"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");

const QUESTION_FIELDS = Object.freeze([
  "number", "semester", "unit", "typeLabel", "sourceRelation",
  "page", "slot", "responseKind", "responseSlotCount"
]);
const SHARED_QUESTION_FIELDS = Object.freeze(["number", "questionId"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function normalizeManifest(manifest, ledger, database = null) {
  if (!manifest || typeof manifest !== "object") throw new Error("문항 분류 manifest가 필요합니다.");
  if (!/^DP-[A-Z0-9-]+$/.test(String(manifest.paperId || ""))) throw new Error("paperId를 확인해 주세요.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(String(manifest.sourceId || ""))) throw new Error("sourceId를 확인해 주세요.");
  const source = ledger.sources.find(item => item.sourceId === manifest.sourceId);
  if (!source) throw new Error(`작업 장부에 없는 원본입니다: ${manifest.sourceId}`);
  const evidenceId = String(manifest.evidenceId || "").trim();
  if (!evidenceId) throw new Error("문항 분류 근거 ID가 필요합니다.");
  const answerEvidenceId = String(manifest.answerEvidenceId || "").trim();
  if (!Array.isArray(manifest.questions) || !manifest.questions.length) throw new Error("문항 분류가 필요합니다.");
  const isPartialVariant = Boolean(manifest.variantOfPaperId || manifest.sharedQuestions);
  if (isPartialVariant && (!manifest.variantOfPaperId || !Array.isArray(manifest.sharedQuestions))) {
    throw new Error("부분 교체 시험지는 대표 시험지와 공유 문항 연결이 모두 필요합니다.");
  }
  const seenQuestionNumbers = new Set();
  const questions = manifest.questions.map((item, index) => {
    const extra = Object.keys(item).filter(key => !QUESTION_FIELDS.includes(key));
    if (extra.length) throw new Error(`문항 분류에 허용되지 않은 필드가 있습니다: ${extra.join(",")}`);
    const number = Number(item.number);
    if (!Number.isSafeInteger(number) || number < 1 || seenQuestionNumbers.has(number)) {
      throw new Error(`문항 번호를 확인해 주세요: ${number}`);
    }
    if (!isPartialVariant && number !== index + 1) throw new Error(`문항 번호는 1부터 빠짐없이 이어져야 합니다: ${number}`);
    seenQuestionNumbers.add(number);
    const semester = String(item.semester || "").trim();
    const unit = String(item.unit || "").trim();
    const typeLabel = String(item.typeLabel || "").trim();
    if (!semester || !unit || !typeLabel) throw new Error(`${number}번의 학기·단원·세부 유형이 필요합니다.`);
    const sourceRelation = String(item.sourceRelation || (isPartialVariant ? "replacement" : "original"));
    if (!["original", "replacement"].includes(sourceRelation)) throw new Error(`${number}번의 출처 관계를 확인해 주세요.`);
    if (isPartialVariant && sourceRelation !== "replacement") throw new Error(`${number}번은 부분 교체 시험지가 직접 소유한 교체 문항이어야 합니다.`);
    const page = Number(item.page);
    const slot = Number(item.slot);
    if (!Number.isSafeInteger(page) || page < 1) throw new Error(`${number}번의 원본 페이지를 확인해 주세요.`);
    if (!Number.isSafeInteger(slot) || slot < 1) throw new Error(`${number}번의 페이지 안 문항 순서를 확인해 주세요.`);
    const responseKind = String(item.responseKind || "").trim();
    const responseSlotCount = Number(item.responseSlotCount);
    if (!responseKind || !Number.isSafeInteger(responseSlotCount) || responseSlotCount < 1) {
      throw new Error(`${number}번의 답안 형식을 확인해 주세요.`);
    }
    const questionId = ledgerCore.stableQuestionId(manifest.sourceId, number);
    return {
      questionId,
      sourceId: manifest.sourceId,
      paperId: manifest.paperId,
      number,
      sourceRelation,
      locator: { page, slot, status: "verified", evidence: [evidenceId] },
      classification: {
        semester,
        domain: ledgerCore.domainFor(unit),
        unit,
        majorUnit: ledgerCore.domainFor(unit),
        minorUnit: unit,
        typeId: ledgerCore.stableTypeId(semester, unit, typeLabel),
        typeLabel,
        status: "verified",
        evidence: [evidenceId]
      },
      method: { tags: [], status: "pending", evidence: [] },
      difficulty: { band: null, status: "pending", evidence: [] },
      responseFormat: { kind: responseKind, slotCount: responseSlotCount, status: "verified", evidence: [evidenceId] },
      answerCheck: answerEvidenceId
        ? { status: "verified", evidence: [answerEvidenceId] }
        : { status: "pending", evidence: [] },
      variantSet: { status: "not_started", originalId: questionId, twinIds: [], similarIds: [] },
      usageProfiles: dbCore.initialUsageProfiles("DP_STANDARD", [evidenceId]),
      releaseStatus: "locked"
    };
  });
  questions.sort((left, right) => left.number - right.number);
  let variant = null;
  let questionIds = questions.map(question => question.questionId);
  let questionCount = questions.length;
  if (isPartialVariant) {
    if (!database || !Array.isArray(database.papers) || !Array.isArray(database.questions)) {
      throw new Error("부분 교체 시험지를 확인할 문항 DB가 필요합니다.");
    }
    const primaryPaper = database.papers.find(paper => paper.paperId === manifest.variantOfPaperId);
    if (!primaryPaper) throw new Error(`공유할 대표 시험지를 찾을 수 없습니다: ${manifest.variantOfPaperId}`);
    if (primaryPaper.variant) throw new Error("부분 교체 시험지는 다른 부분 교체 시험지를 대표 시험지로 사용할 수 없습니다.");
    if (!Number.isSafeInteger(primaryPaper.questionCount) || primaryPaper.questionCount < 1
      || primaryPaper.questionCount !== (primaryPaper.questionIds || []).length) {
      throw new Error(`대표 시험지의 문항 연결을 확인해 주세요: ${primaryPaper.paperId}`);
    }
    const questionsById = new Map(database.questions.map(question => [question.questionId, question]));
    const sharedNumbers = new Set();
    const sharedQuestionLinks = manifest.sharedQuestions.map((link, index) => {
      const extra = Object.keys(link).filter(key => !SHARED_QUESTION_FIELDS.includes(key));
      if (extra.length) throw new Error(`공유 문항 연결에 허용되지 않은 필드가 있습니다: ${extra.join(",")}`);
      const number = Number(link.number);
      const questionId = String(link.questionId || "").trim();
      if (!Number.isSafeInteger(number) || number < 1 || number > primaryPaper.questionCount || sharedNumbers.has(number)) {
        throw new Error(`공유 문항 번호를 확인해 주세요: ${number || index + 1}`);
      }
      if (seenQuestionNumbers.has(number)) throw new Error(`공유 문항과 교체 문항 번호가 겹칩니다: ${number}`);
      const shared = questionsById.get(questionId);
      if (!shared || shared.paperId !== primaryPaper.paperId || shared.sourceId !== primaryPaper.sourceId
        || !primaryPaper.questionIds.includes(questionId)) {
        throw new Error(`공유 문항이 대표 시험지 소유 문항과 연결되지 않았습니다: ${number}`);
      }
      sharedNumbers.add(number);
      return { number, questionId };
    }).sort((a, b) => a.number - b.number);
    for (let number = 1; number <= primaryPaper.questionCount; number += 1) {
      if (!sharedNumbers.has(number) && !seenQuestionNumbers.has(number)) {
        throw new Error(`부분 교체 시험지에 ${number}번 연결이 없습니다.`);
      }
    }
    if (sharedQuestionLinks.length + questions.length !== primaryPaper.questionCount) {
      throw new Error("공유 문항과 교체 문항 수가 대표 시험지 문항 수와 다릅니다.");
    }
    questionCount = primaryPaper.questionCount;
    questionIds = Array(questionCount);
    sharedQuestionLinks.forEach(link => { questionIds[link.number - 1] = link.questionId; });
    questions.forEach(question => { questionIds[question.number - 1] = question.questionId; });
    variant = {
      kind: "partial_question_variant",
      primaryPaperId: primaryPaper.paperId,
      sharedQuestionLinks,
      overrideQuestionIds: questions.slice().sort((a, b) => a.number - b.number).map(question => question.questionId)
    };
  }
  return {
    paper: {
      paperId: manifest.paperId,
      title: String(manifest.title || manifest.paperId),
      sourceId: manifest.sourceId,
      sourceFingerprint: source.sourceFingerprint,
      classificationStatus: "verified",
      evidence: [evidenceId],
      questionCount,
      questionIds,
      ...(variant ? { variant } : {})
    },
    questions
  };
}

function paperIdentity(paper, questions) {
  if (questions.some(question => !question)) throw new Error(`시험지 소유 문항 연결이 끊겼습니다: ${paper.paperId}`);
  return JSON.stringify({
    paperId: paper.paperId,
    sourceId: paper.sourceId,
    questionCount: paper.questionCount,
    questionIds: paper.questionIds,
    variant: paper.variant || null,
    questions: questions.map(question => ({
      number: question.number,
      sourceRelation: question.sourceRelation,
      semester: question.classification.semester,
      unit: question.classification.unit,
      typeId: question.classification.typeId
    }))
  });
}

function merge(database, ledger, manifest) {
  const normalized = normalizeManifest(manifest, ledger, database);
  const existingPaper = database.papers.find(paper => paper.paperId === normalized.paper.paperId);
  if (existingPaper) {
    const ownedIds = existingPaper.variant ? existingPaper.variant.overrideQuestionIds : existingPaper.questionIds;
    const existingQuestions = ownedIds.map(id => database.questions.find(question => question.questionId === id));
    if (paperIdentity(existingPaper, existingQuestions) !== paperIdentity(normalized.paper, normalized.questions)) {
      throw new Error(`이미 등록된 시험지 분류와 다릅니다. 자동으로 덮어쓰지 않습니다: ${normalized.paper.paperId}`);
    }
    return { database, changed: false };
  }
  if (database.papers.some(paper => paper.sourceId === normalized.paper.sourceId)) {
    throw new Error(`원본 하나에 시험지를 두 번 등록할 수 없습니다: ${normalized.paper.sourceId}`);
  }
  const knownQuestions = new Set(database.questions.map(question => question.questionId));
  normalized.questions.forEach(question => {
    if (knownQuestions.has(question.questionId)) throw new Error(`이미 등록된 문항입니다: ${question.questionId}`);
  });
  database.papers.push(normalized.paper);
  database.questions.push(...normalized.questions);
  database.papers.sort((a, b) => a.paperId.localeCompare(b.paperId));
  database.questions.sort((a, b) => a.sourceId.localeCompare(b.sourceId) || a.number - b.number);
  database.typeCatalog = dbCore.rebuildTypeCatalog(database.questions);
  database.summary = dbCore.summarize(database);
  const result = dbAudit.audit(database);
  if (!result.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${result.issues.join(", ")}`);
  return { database, changed: true };
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node record-dolpa-paper-questions.cjs <question-db> <work-ledger> <manifest>");
  const databasePath = path.resolve(args[0]);
  const merged = merge(readJson(databasePath), readJson(args[1]), readJson(args[2]));
  if (merged.changed) {
    const temporaryPath = `${databasePath}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(merged.database, null, 2)}\n`, "utf8");
    fs.renameSync(temporaryPath, databasePath);
  }
  process.stdout.write(`${JSON.stringify({ changed: merged.changed, summary: merged.database.summary })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalizeManifest, paperIdentity, merge });
