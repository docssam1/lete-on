"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");

const QUESTION_FIELDS = Object.freeze(["number", "semester", "unit", "typeLabel", "sourceRelation"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function normalizeManifest(manifest, ledger) {
  if (!manifest || typeof manifest !== "object") throw new Error("문항 분류 manifest가 필요합니다.");
  if (!/^DP-[A-Z0-9-]+$/.test(String(manifest.paperId || ""))) throw new Error("paperId를 확인해 주세요.");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(String(manifest.sourceId || ""))) throw new Error("sourceId를 확인해 주세요.");
  const source = ledger.sources.find(item => item.sourceId === manifest.sourceId);
  if (!source) throw new Error(`작업 장부에 없는 원본입니다: ${manifest.sourceId}`);
  const evidenceId = String(manifest.evidenceId || "").trim();
  if (!evidenceId) throw new Error("문항 분류 근거 ID가 필요합니다.");
  if (!Array.isArray(manifest.questions) || !manifest.questions.length) throw new Error("문항 분류가 필요합니다.");
  const questions = manifest.questions.map((item, index) => {
    const extra = Object.keys(item).filter(key => !QUESTION_FIELDS.includes(key));
    if (extra.length) throw new Error(`문항 분류에 허용되지 않은 필드가 있습니다: ${extra.join(",")}`);
    const number = Number(item.number);
    if (number !== index + 1) throw new Error(`문항 번호는 1부터 빠짐없이 이어져야 합니다: ${number}`);
    const semester = String(item.semester || "").trim();
    const unit = String(item.unit || "").trim();
    const typeLabel = String(item.typeLabel || "").trim();
    if (!semester || !unit || !typeLabel) throw new Error(`${number}번의 학기·단원·세부 유형이 필요합니다.`);
    const sourceRelation = String(item.sourceRelation || "original");
    if (!["original", "replacement"].includes(sourceRelation)) throw new Error(`${number}번의 출처 관계를 확인해 주세요.`);
    const questionId = ledgerCore.stableQuestionId(manifest.sourceId, number);
    return {
      questionId,
      sourceId: manifest.sourceId,
      paperId: manifest.paperId,
      number,
      sourceRelation,
      locator: { page: null, slot: null, status: "pending", evidence: [] },
      classification: {
        semester,
        domain: ledgerCore.domainFor(unit),
        unit,
        typeId: ledgerCore.stableTypeId(semester, unit, typeLabel),
        typeLabel,
        status: "verified",
        evidence: [evidenceId]
      },
      method: { tags: [], status: "pending", evidence: [] },
      difficulty: { band: null, status: "pending", evidence: [] },
      responseFormat: { kind: null, status: "pending", evidence: [] },
      answerCheck: { status: "pending", evidence: [] },
      variantSet: { status: "not_started", originalId: questionId, twinIds: [], similarIds: [] },
      usageProfiles: dbCore.initialUsageProfiles("DP_STANDARD", [evidenceId]),
      releaseStatus: "locked"
    };
  });
  return {
    paper: {
      paperId: manifest.paperId,
      title: String(manifest.title || manifest.paperId),
      sourceId: manifest.sourceId,
      sourceFingerprint: source.sourceFingerprint,
      classificationStatus: "verified",
      evidence: [evidenceId],
      questionCount: questions.length,
      questionIds: questions.map(question => question.questionId)
    },
    questions
  };
}

function paperIdentity(paper, questions) {
  return JSON.stringify({
    paperId: paper.paperId,
    sourceId: paper.sourceId,
    questionCount: paper.questionCount,
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
  const normalized = normalizeManifest(manifest, ledger);
  const existingPaper = database.papers.find(paper => paper.paperId === normalized.paper.paperId);
  if (existingPaper) {
    const existingQuestions = existingPaper.questionIds.map(id => database.questions.find(question => question.questionId === id));
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
