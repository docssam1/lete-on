"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const TASK_NAMES = Object.freeze([
  "pdfAudit",
  "coverReview",
  "bodyReview",
  "answerReview",
  "questionSegmentation",
  "typeClassification",
  "difficultyReview",
  "analysisReport"
]);
const TASK_STATUSES = Object.freeze(["pending", "sampled", "verified", "blocked", "not_applicable", "stale"]);

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fingerprint(filePath) {
  const bytes = fs.readFileSync(path.resolve(filePath));
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function stableTypeId(semester, unit, label) {
  const canonical = [semester, unit, label].map(value => String(value || "").trim()).join("|");
  return `DP-TYP-${crypto.createHash("sha256").update(canonical, "utf8").digest("hex").slice(0, 16).toUpperCase()}`;
}

function stableQuestionId(sourceId, number) {
  return `DP-Q-${String(sourceId).replace(/^DP-SRC-/, "")}-${String(number).padStart(3, "0")}`;
}

function domainFor(unit) {
  const text = String(unit || "");
  if (/경우의 수|확률|통계|자료|도수|평균|분산|표준편차/.test(text)) return "확률과 통계";
  if (/함수|좌표|그래프/.test(text)) return "함수";
  if (/도형|삼각|사각|피타고라스|원의 성질|원과 부채꼴|부채꼴|위치 관계|삼각비|작도|입체|평면/.test(text)) return "기하";
  if (/소인수|유리수|순환소수|제곱근|실수/.test(text)) return "수와 연산";
  if (/식|방정식|부등식|다항식/.test(text)) return "문자와 식";
  return "융합·기타";
}

function emptyTask() {
  return { status: "pending", evidence: [], note: null };
}

function normalizeTask(value) {
  if (!value) return emptyTask();
  const status = String(value.status || "pending");
  if (!TASK_STATUSES.includes(status)) fail(`허용되지 않은 작업 상태입니다: ${status}`);
  return {
    status,
    evidence: Array.from(new Set((value.evidence || []).map(String))).sort(),
    note: value.note == null ? null : String(value.note)
  };
}

function applyTask(target, name, value) {
  if (!TASK_NAMES.includes(name)) fail(`허용되지 않은 작업 이름입니다: ${name}`);
  target[name] = normalizeTask(value);
}

function makeTasks(job) {
  const tasks = Object.fromEntries(TASK_NAMES.map(name => [name, emptyTask()]));
  if (job.status === "변환 완료") {
    tasks.pdfAudit = {
      status: "verified",
      evidence: [`${job.sourceId}:pdf:${job.pageCount}:${job.outputSize}`],
      note: "PDF 머리, 파일 크기, 페이지 수 자동검사 통과"
    };
  } else if (job.status === "변환 실패") {
    tasks.pdfAudit = { status: "blocked", evidence: [], note: job.error || "PDF 변환 실패" };
  }
  return tasks;
}

function applyReviewDecisions(sourcesById, jobsByOrder, decisions) {
  (decisions.rangeReviews || []).forEach(range => {
    const from = Number(range.fromOrder);
    const to = Number(range.toOrder);
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 1 || to < from) {
      fail("검수 범위의 시작·끝 번호를 확인해 주세요.");
    }
    for (let order = from; order <= to; order += 1) {
      const job = jobsByOrder.get(order);
      if (!job) fail(`검수 범위에 없는 변환 순서입니다: ${order}`);
      const source = sourcesById.get(job.sourceId);
      Object.entries(range.tasks || {}).forEach(([name, value]) => applyTask(source.tasks, name, value));
    }
  });
  (decisions.sourceReviews || []).forEach(review => {
    const source = sourcesById.get(review.sourceId);
    if (!source) fail(`검수 기록의 원본 ID를 찾을 수 없습니다: ${review.sourceId}`);
    Object.entries(review.tasks || {}).forEach(([name, value]) => applyTask(source.tasks, name, value));
  });
}

function applyPaperLinks(sourcesById, links, typeIndex) {
  const papersById = new Map((typeIndex.papers || []).map(paper => [paper.paperId, paper]));
  const questions = [];
  (links.links || []).forEach(link => {
    const source = sourcesById.get(link.sourceId);
    if (!source) fail(`대표 시험지의 원본 ID를 찾을 수 없습니다: ${link.sourceId}`);
    const paper = papersById.get(link.paperId);
    if (!paper) fail(`대표 시험지 유형표를 찾을 수 없습니다: ${link.paperId}`);
    if (String(link.evidenceStatus) !== "verified") fail(`${link.paperId} 연결은 verified여야 합니다.`);
    if (source.paperIds.length) fail(`한 원본에 대표 시험지가 둘 이상 연결됐습니다: ${link.sourceId}`);
    source.paperIds.push(link.paperId);
    (link.verifiedStages || []).forEach(stage => {
      applyTask(source.tasks, stage, {
        status: "verified",
        evidence: [String(link.evidenceRecordId || link.paperId)],
        note: "대표 시험지 원본과 문항별 검수 기록 연결"
      });
    });
    paper.questions.forEach(item => {
      const classificationStatus = String(item.classificationStatus || "verified");
      if (classificationStatus !== "verified") fail(`${link.paperId} ${item.number}번 유형 상태를 확인해 주세요.`);
      questions.push({
        questionId: stableQuestionId(source.sourceId, item.number),
        sourceId: source.sourceId,
        paperId: paper.paperId,
        paperTitle: paper.title,
        number: Number(item.number),
        sourceRelation: item.sourceRelation,
        curriculum: {
          semester: item.semester,
          domain: domainFor(item.unit),
          unit: item.unit
        },
        type: {
          typeId: stableTypeId(item.semester, item.unit, item.type),
          label: item.type,
          methodTags: [],
          methodReviewStatus: "pending"
        },
        difficulty: {
          band: null,
          status: "pending",
          evidence: []
        },
        classificationStatus,
        evidence: [String(link.evidenceRecordId || paper.paperId)]
      });
    });
  });
  return questions.sort((a, b) => a.sourceId.localeCompare(b.sourceId) || a.number - b.number);
}

function buildLedger(inventory, queue, typeIndex, paperLinks, reviewDecisions, inputFingerprints) {
  if (inventory.schemaVersion !== 2) fail("돌파 원본 자료대장 버전을 확인해 주세요.");
  if (inventory.sources.length !== queue.jobs.length) fail("원본 자료대장과 PDF 대기열 수가 다릅니다.");
  const jobsById = new Map(queue.jobs.map(job => [job.sourceId, job]));
  const jobsByOrder = new Map(queue.jobs.map(job => [Number(job.order), job]));
  const sources = inventory.sources.map(item => {
    const job = jobsById.get(item.sourceId);
    if (!job) fail(`PDF 대기열에서 원본을 찾을 수 없습니다: ${item.sourceId}`);
    return {
      sourceId: item.sourceId,
      sourceFingerprint: item.sha256,
      canonicalRelativePath: item.canonicalRelativePath,
      aliases: item.aliases,
      familyHint: item.primaryFamilyHint,
      courseHint: item.primaryCourseHint,
      layerHint: item.primaryLayer,
      hintStatus: "filename_only",
      conversion: {
        order: Number(job.order),
        status: job.status,
        outputRelativePath: job.outputRelativePath,
        pageCount: job.pageCount == null ? null : Number(job.pageCount),
        outputSize: job.outputSize == null ? null : Number(job.outputSize),
        error: job.error || null
      },
      paperIds: [],
      tasks: makeTasks(job)
    };
  }).sort((a, b) => a.conversion.order - b.conversion.order);
  const sourcesById = new Map(sources.map(source => [source.sourceId, source]));
  applyReviewDecisions(sourcesById, jobsByOrder, reviewDecisions);
  const questions = applyPaperLinks(sourcesById, paperLinks, typeIndex);
  const summary = {
    sourceCount: sources.length,
    duplicatePathCount: Number(inventory.summary.duplicatePathCount),
    convertedSourceCount: sources.filter(source => source.conversion.status === "변환 완료").length,
    coverVerifiedSourceCount: sources.filter(source => source.tasks.coverReview.status === "verified").length,
    segmentedSourceCount: sources.filter(source => source.tasks.questionSegmentation.status === "verified").length,
    classifiedSourceCount: sources.filter(source => source.tasks.typeClassification.status === "verified").length,
    questionCount: questions.length,
    classifiedQuestionCount: questions.filter(question => question.classificationStatus === "verified").length,
    difficultyVerifiedQuestionCount: questions.filter(question => question.difficulty.status === "verified").length,
    analysisCompleteSourceCount: sources.filter(source => source.tasks.analysisReport.status === "verified").length
  };
  return {
    schemaVersion: 1,
    taxonomyVersion: "dolpa-kr-math-v1",
    title: "돌파 원본 변환·검수·문항분류 작업 장부",
    rules: [
      "같은 SHA-256 원본은 sourceId 하나로만 처리한다.",
      "파일명에서 읽은 과정과 시험 종류는 hintStatus가 filename_only인 임시 정보다.",
      "표지·본문·답안·문항 분리·유형·난이도·분석지는 각각 따로 완료한다.",
      "학년·단원·세부 유형은 원본을 확인한 문항만 verified로 둔다.",
      "풀이법과 난이도는 근거가 없으면 pending으로 남긴다.",
      "verified·sampled·excluded 결정을 남겨 같은 검수를 반복하지 않는다."
    ],
    inputs: inputFingerprints,
    summary,
    sources,
    questions
  };
}

function main(args) {
  if (args.length !== 6) {
    fail("사용법: node build-dolpa-work-ledger.cjs <inventory> <queue> <type-index> <paper-links> <review-decisions> <output>");
  }
  const [inventoryPath, queuePath, typeIndexPath, paperLinksPath, reviewDecisionsPath, outputPath] = args;
  const ledger = buildLedger(
    readJson(inventoryPath),
    readJson(queuePath),
    readJson(typeIndexPath),
    readJson(paperLinksPath),
    readJson(reviewDecisionsPath),
    {
      inventorySha256: fingerprint(inventoryPath),
      queueSha256: fingerprint(queuePath),
      typeIndexSha256: fingerprint(typeIndexPath),
      paperLinksSha256: fingerprint(paperLinksPath),
      reviewDecisionsSha256: fingerprint(reviewDecisionsPath)
    }
  );
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(ledger.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));

module.exports = Object.freeze({ TASK_NAMES, TASK_STATUSES, stableTypeId, stableQuestionId, domainFor, buildLedger });
