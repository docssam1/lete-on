"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");

const PROFILE_CATALOG = Object.freeze([
  Object.freeze({ profileId: "DP_STANDARD", programId: "DP", label: "돌파형", purpose: "과정별 입학·편입 30문항", definitionStatus: "verified" }),
  Object.freeze({ profileId: "SM_STANDARD", programId: "SM", label: "생수형", purpose: "공통수학 누적·모의고사 변형", definitionStatus: "needs_evidence" }),
  Object.freeze({ profileId: "WM_BASIC", programId: "WM", label: "원수학 기본형", purpose: "대수·기하 분리와 기본기·과락 확인", definitionStatus: "verified" }),
  Object.freeze({ profileId: "WM_DUAL", programId: "WM", label: "원수학 듀얼형", purpose: "두 과정 연결과 심화 통합", definitionStatus: "needs_evidence" }),
  Object.freeze({ profileId: "ED_CUMULATIVE", programId: "ED", label: "이든형", purpose: "학년·학기 누적과 고등선행 연결", definitionStatus: "verified" }),
  Object.freeze({ profileId: "SH_SELECTION", programId: "SH", label: "황소형", purpose: "중등 전 범위 누적 선발", definitionStatus: "verified" }),
  Object.freeze({ profileId: "DG_ADVANCED", programId: "DG", label: "깊은생각형", purpose: "함수·부등식·기하 연결 심화", definitionStatus: "needs_evidence" })
]);
const PROFILE_STATUSES = Object.freeze(["source_verified", "candidate", "approved", "excluded", "stale"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function fingerprint(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.resolve(filePath))).digest("hex");
}

function pendingEvidence() {
  return { status: "pending", evidence: [] };
}

function initialUsageProfiles(sourceProfileId, evidence) {
  return PROFILE_CATALOG.map(profile => ({
    profileId: profile.profileId,
    status: profile.profileId === sourceProfileId ? "source_verified" : "candidate",
    evidence: profile.profileId === sourceProfileId ? Array.from(new Set(evidence || [])).sort() : [],
    reviewNote: profile.profileId === sourceProfileId
      ? "이 시험형의 원본 문항으로 확인"
      : "범위·난이도·문항 위치 호환성 검수 전 사용 후보"
  }));
}

function fromLedgerQuestion(question) {
  return {
    questionId: question.questionId,
    sourceId: question.sourceId,
    paperId: question.paperId,
    number: question.number,
    sourceRelation: question.sourceRelation,
    locator: { page: null, slot: null, status: "pending", evidence: [] },
    classification: {
      semester: question.curriculum.semester,
      domain: question.curriculum.domain,
      unit: question.curriculum.unit,
      majorUnit: question.curriculum.domain,
      minorUnit: question.curriculum.unit,
      typeId: question.type.typeId,
      typeLabel: question.type.label,
      status: question.classificationStatus,
      evidence: question.evidence
    },
    method: {
      solutionArchetype: null,
      tags: question.type.methodTags,
      status: question.type.methodReviewStatus,
      evidence: []
    },
    difficulty: question.difficulty,
    responseFormat: { kind: null, ...pendingEvidence() },
    answerCheck: { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: question.questionId, twinIds: [], similarIds: [] },
    usageProfiles: initialUsageProfiles("DP_STANDARD", question.evidence),
    releaseStatus: "locked"
  };
}

function sameIdentity(left, right) {
  return left.sourceId === right.sourceId && left.paperId === right.paperId && left.number === right.number &&
    left.classification.typeId === right.classification.typeId;
}

function mergeExisting(seed, existing) {
  if (!existing) return seed;
  if (existing.schemaVersion !== 1) throw new Error("기존 돌파 문항 DB 버전을 확인해 주세요.");
  const oldById = new Map((existing.questions || []).map(question => [question.questionId, question]));
  return seed.map(question => {
    const old = oldById.get(question.questionId);
    if (!old) return question;
    if (!sameIdentity(question, old)) throw new Error(`기존 문항의 출처·유형이 달라졌습니다: ${question.questionId}`);
    return {
      ...question,
      classification: old.classification,
      locator: old.locator,
      method: old.method,
      difficulty: old.difficulty,
      responseFormat: old.responseFormat,
      answerCheck: old.answerCheck,
      variantSet: old.variantSet,
      usageProfiles: old.usageProfiles || question.usageProfiles,
      releaseStatus: "locked"
    };
  });
}

function validatePartialVariantPaper(paper, papersById, questionsById) {
  const fail = detail => { throw new Error(`부분 교체 시험지 연결을 확인해 주세요: ${paper.paperId}:${detail}`); };
  if (!paper.variant || paper.variant.kind !== "partial_question_variant") fail("kind");
  const primary = papersById.get(paper.variant.primaryPaperId);
  if (!primary || primary.paperId === paper.paperId || primary.variant) fail("primary");
  const effectiveIds = Array.isArray(paper.questionIds) ? paper.questionIds : [];
  const shared = Array.isArray(paper.variant.sharedQuestionLinks) ? paper.variant.sharedQuestionLinks : [];
  const overrideIds = Array.isArray(paper.variant.overrideQuestionIds) ? paper.variant.overrideQuestionIds : [];
  if (!Number.isSafeInteger(paper.questionCount) || paper.questionCount < 1 || paper.questionCount !== effectiveIds.length
    || !shared.length || !overrideIds.length || shared.length + overrideIds.length !== paper.questionCount) fail("coverage");
  const occupied = new Set();
  const sharedCanonicalIds = new Set();
  shared.forEach(link => {
    const number = link && link.number;
    const questionId = link && link.questionId;
    const row = questionsById.get(questionId);
    if (!Number.isSafeInteger(number) || number < 1 || number > paper.questionCount || occupied.has(number)
      || !questionId || !(primary.questionIds || []).includes(questionId)
      || effectiveIds[number - 1] !== questionId || !row || row.paperId !== primary.paperId
      || row.sourceId !== primary.sourceId || !Number.isSafeInteger(link.page) || link.page < 1
      || !Number.isSafeInteger(link.slot) || link.slot < 1 || !(link.evidence || []).length) fail(`shared-${number}`);
    occupied.add(number);
    sharedCanonicalIds.add(questionId);
  });
  overrideIds.forEach(questionId => {
    const row = questionsById.get(questionId);
    if (!questionId || sharedCanonicalIds.has(questionId) || !row || row.paperId !== paper.paperId
      || row.sourceId !== paper.sourceId || !Number.isSafeInteger(row.number) || row.number < 1
      || row.number > paper.questionCount || occupied.has(row.number) || effectiveIds[row.number - 1] !== questionId) {
      fail(`override-${questionId}`);
    }
    occupied.add(row.number);
  });
  if (occupied.size !== paper.questionCount) fail("coverage");
}

function rebuildTypeCatalog(questions) {
  const map = new Map();
  questions.forEach(question => {
    const key = question.classification.typeId;
    if (!map.has(key)) {
      map.set(key, {
        typeId: key,
        semester: question.classification.semester,
        domain: question.classification.domain,
        unit: question.classification.unit,
        majorUnit: question.classification.majorUnit,
        minorUnit: question.classification.minorUnit,
        label: question.classification.typeLabel,
        solutionArchetype: null,
        methodTags: [],
        methodStatus: "pending",
        questionIds: []
      });
    }
    const type = map.get(key);
    const expected = [type.semester, type.domain, type.unit, type.majorUnit, type.minorUnit, type.label].join("|");
    const actual = [
      question.classification.semester,
      question.classification.domain,
      question.classification.unit,
      question.classification.majorUnit,
      question.classification.minorUnit,
      question.classification.typeLabel
    ].join("|");
    if (expected !== actual) throw new Error(`같은 유형 ID에 서로 다른 분류가 연결됐습니다: ${key}`);
    type.questionIds.push(question.questionId);
  });
  const questionById = new Map(questions.map(question => [question.questionId, question]));
  return Array.from(map.values()).map(type => {
    const linked = type.questionIds.map(id => questionById.get(id));
    const verified = linked.filter(question => question.method.status === "verified");
    const archetypes = Array.from(new Set(verified.map(question => question.method.solutionArchetype).filter(Boolean)));
    const allVerified = linked.length > 0 && verified.length === linked.length && archetypes.length === 1;
    return {
      ...type,
      solutionArchetype: allVerified ? archetypes[0] : null,
      methodTags: Array.from(new Set(verified.flatMap(question => question.method.tags || []))).sort(),
      methodStatus: allVerified ? "verified" : verified.length ? "partial" : "pending",
      questionIds: type.questionIds.sort()
    };
  }).sort((a, b) => a.typeId.localeCompare(b.typeId));
}

function rebuildPapers(questions, ledger, existing) {
  const sourceById = new Map(ledger.sources.map(source => [source.sourceId, source]));
  const oldPapersById = new Map(((existing && existing.papers) || []).map(paper => [paper.paperId, paper]));
  const questionById = new Map(questions.map(question => [question.questionId, question]));
  const map = new Map();
  questions.forEach(question => {
    if (!map.has(question.paperId)) {
      const seed = ledger.questions.find(item => item.paperId === question.paperId);
      map.set(question.paperId, {
        paperId: question.paperId,
        title: seed ? seed.paperTitle : question.paperId,
        sourceId: question.sourceId,
        sourceFingerprint: sourceById.get(question.sourceId).sourceFingerprint,
        classificationStatus: "verified",
        evidence: Array.from(new Set(question.classification.evidence)).sort(),
        questionIds: []
      });
    }
    const paper = map.get(question.paperId);
    if (paper.sourceId !== question.sourceId) throw new Error(`시험지에 원본이 둘 이상 연결됐습니다: ${question.paperId}`);
    paper.questionIds.push(question.questionId);
  });
  return Array.from(map.values()).map(paper => {
    const old = oldPapersById.get(paper.paperId);
    if (old && old.variant) {
      const effectiveIds = Array.isArray(old.questionIds) ? old.questionIds : [];
      const overrideIds = Array.isArray(old.variant.overrideQuestionIds) ? old.variant.overrideQuestionIds : [];
      if (old.questionCount !== effectiveIds.length || effectiveIds.some(id => !questionById.has(id))) {
        throw new Error(`부분 교체 시험지의 공유 문항 연결이 끊겼습니다: ${old.paperId}`);
      }
      if (overrideIds.some(id => {
        const row = questionById.get(id);
        return !row || row.paperId !== old.paperId || row.sourceId !== old.sourceId;
      })) throw new Error(`부분 교체 시험지의 교체 문항 연결이 끊겼습니다: ${old.paperId}`);
      const source = sourceById.get(old.sourceId);
      return {
        ...old,
        sourceFingerprint: source ? source.sourceFingerprint : old.sourceFingerprint,
        questionCount: effectiveIds.length,
        questionIds: effectiveIds
      };
    }
    return {
      ...paper,
      ...(old && old.coverage ? { coverage: old.coverage } : {}),
      ...(old && old.placementContext ? { placementContext: old.placementContext } : {}),
      ...(old && old.equivalentSources ? { equivalentSources: old.equivalentSources } : {}),
      questionCount: paper.questionIds.length,
      questionIds: paper.questionIds.sort()
    };
  })
    .sort((a, b) => a.paperId.localeCompare(b.paperId));
}

function questionSeedsForBuild(ledger, existing) {
  const variantPaperIds = new Set();
  const variantOwnedIds = new Set();
  const existingPapersById = new Map((((existing && existing.papers) || [])).map(paper => [paper.paperId, paper]));
  const existingQuestionsById = new Map((((existing && existing.questions) || [])).map(question => [question.questionId, question]));
  ((existing && existing.papers) || []).forEach(paper => {
    if (!paper.variant) return;
    validatePartialVariantPaper(paper, existingPapersById, existingQuestionsById);
    variantPaperIds.add(paper.paperId);
    (paper.variant.overrideQuestionIds || []).forEach(id => variantOwnedIds.add(id));
  });
  const seed = ledger.questions
    .filter(question => !variantPaperIds.has(question.paperId) || variantOwnedIds.has(question.questionId))
    .map(fromLedgerQuestion);
  const merged = mergeExisting(seed, existing);
  const present = new Set(merged.map(question => question.questionId));
  ((existing && existing.questions) || []).forEach(question => {
    if (!variantOwnedIds.has(question.questionId) || present.has(question.questionId)) return;
    if (question.questionId !== ledgerCore.stableQuestionId(question.sourceId, question.number)) {
      throw new Error(`부분 교체 시험지의 기존 문항 ID를 확인해 주세요: ${question.questionId}`);
    }
    merged.push(question);
    present.add(question.questionId);
  });
  return merged;
}

function summarize(database) {
  return {
    sourceCount: new Set(database.questions.map(question => question.sourceId)).size,
    paperCount: database.papers.length,
    questionCount: database.questions.length,
    typeCount: database.typeCatalog.length,
    classificationVerifiedCount: database.questions.filter(question => question.classification.status === "verified").length,
    locatorVerifiedCount: database.questions.filter(question => question.locator.status === "verified").length,
    methodVerifiedCount: database.questions.filter(question => question.method.status === "verified").length,
    difficultyVerifiedCount: database.questions.filter(question => question.difficulty.status === "verified").length,
    responseVerifiedCount: database.questions.filter(question => question.responseFormat.status === "verified").length,
    answerVerifiedCount: database.questions.filter(question => question.answerCheck.status === "verified").length,
    variantReadyCount: database.questions.filter(question => question.variantSet.status === "verified").length,
    usageApprovedCount: database.questions.reduce((sum, question) => sum + question.usageProfiles.filter(profile => profile.status === "approved").length, 0)
  };
}

function buildDatabase(ledger, existing, ledgerSha256) {
  const questions = questionSeedsForBuild(ledger, existing)
    .sort((a, b) => a.sourceId.localeCompare(b.sourceId) || a.number - b.number);
  const database = {
    schemaVersion: 1,
    taxonomyVersion: ledger.taxonomyVersion,
    title: "돌파 문항 DB",
    rules: [
      "한 문제는 sourceId와 원본 문항 번호로 만든 questionId 하나만 사용한다.",
      "문제 원문과 정답 값은 이 DB에 저장하지 않는다.",
      "학년·영역·단원·세부 유형은 근거가 있는 문항만 verified로 둔다.",
      "풀이법·난이도·답안·유사문항은 각각 따로 검수한다.",
      "기존 questionId의 출처나 유형이 달라지면 자동 덮어쓰지 않고 오류로 막는다."
    ],
    inputs: { workLedgerSha256: ledgerSha256 },
    profileCatalog: PROFILE_CATALOG,
    papers: [],
    typeCatalog: [],
    questions
  };
  database.papers = rebuildPapers(questions, ledger, existing);
  database.typeCatalog = rebuildTypeCatalog(questions);
  database.summary = summarize(database);
  return database;
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error("사용법: node build-dolpa-question-db.cjs <work-ledger> [existing-db|-] <output>");
  }
  const ledgerPath = args[0];
  const existingPath = args.length === 3 ? args[1] : "-";
  const outputPath = args.length === 3 ? args[2] : args[1];
  const ledger = readJson(ledgerPath);
  const existing = existingPath === "-" || !fs.existsSync(path.resolve(existingPath)) ? null : readJson(existingPath);
  const database = buildDatabase(ledger, existing, fingerprint(ledgerPath));
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(database, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(database.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({
  PROFILE_CATALOG,
  PROFILE_STATUSES,
  initialUsageProfiles,
  fromLedgerQuestion,
  mergeExisting,
  validatePartialVariantPaper,
  rebuildTypeCatalog,
  rebuildPapers,
  questionSeedsForBuild,
  summarize,
  buildDatabase
});
