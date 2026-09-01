"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");

const FORBIDDEN_KEYS = new Set([
  "prompt", "stem", "answer", "answervalue", "officialanswer", "independentanswer", "derivedanswer", "correctanswer",
  "solution", "content", "rawtext", "pageimage", "privatepath"
]);

function normalizedKey(value) {
  return String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function walk(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(normalizedKey(key))) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function validateQuestionRef(item, prefix, issues) {
  if (!clean(item.questionId)) issues.push(`${prefix}.questionId`);
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(item.sourceId))) issues.push(`${prefix}.sourceId`);
  if (!clean(item.paperId)) issues.push(`${prefix}.paperId`);
  if (!Number.isSafeInteger(item.number) || item.number < 1) issues.push(`${prefix}.number`);
  if (!clean(item.evidenceId)) issues.push(`${prefix}.evidenceId`);
}

function validateTypePacket(packet) {
  const issues = [];
  walk(packet, "", issues);
  if (packet.schemaVersion !== "highselect-dolpa-type-correction-review/v1") issues.push("schemaVersion");
  if (!clean(packet.reviewId)) issues.push("reviewId");
  if (!clean(packet.reviewedAt)) issues.push("reviewedAt");
  if (!Array.isArray(packet.items) || !packet.items.length) issues.push("items");
  const ids = new Set();
  (packet.items || []).forEach((item, index) => {
    const prefix = `items[${index}]`;
    validateQuestionRef(item, prefix, issues);
    if (ids.has(clean(item.questionId))) issues.push(`${prefix}.duplicate`);
    ids.add(clean(item.questionId));
    ["semester", "unit", "typeLabel", "reason"].forEach(key => {
      if (!clean(item[key]) || clean(item[key]).length > 180) issues.push(`${prefix}.${key}`);
    });
  });
  if (issues.length) throw new Error(`돌파 유형 교정표를 확인해 주세요: ${issues.join(", ")}`);
}

function validateDisputePacket(packet) {
  const issues = [];
  walk(packet, "", issues);
  if (packet.schemaVersion !== "highselect-dolpa-answer-dispute-review/v1") issues.push("schemaVersion");
  if (!clean(packet.reviewId)) issues.push("reviewId");
  if (!clean(packet.reviewedAt)) issues.push("reviewedAt");
  if (packet.reviewCount !== 1) issues.push("reviewCount");
  if (!Array.isArray(packet.items) || !packet.items.length) issues.push("items");
  const ids = new Set();
  (packet.items || []).forEach((item, index) => {
    const prefix = `items[${index}]`;
    validateQuestionRef(item, prefix, issues);
    if (ids.has(clean(item.questionId))) issues.push(`${prefix}.duplicate`);
    ids.add(clean(item.questionId));
    ["reason", "difficultyReason"].forEach(key => {
      if (!clean(item[key]) || clean(item[key]).length > 240) issues.push(`${prefix}.${key}`);
      if (/\d/.test(clean(item[key]))) issues.push(`${prefix}.${key}.numericLeak`);
    });
  });
  if (issues.length) throw new Error(`돌파 정답 이견표를 확인해 주세요: ${issues.join(", ")}`);
}

function resolveQuestion(database, item) {
  const question = database.questions.find(candidate => candidate.questionId === clean(item.questionId));
  if (!question || question.sourceId !== clean(item.sourceId) || question.paperId !== clean(item.paperId)
    || question.number !== item.number) {
    throw new Error(`검수 문항 위치가 일치하지 않습니다: ${item.questionId}`);
  }
  return question;
}

function applyTypeCorrection(database, packet) {
  validateTypePacket(packet);
  const next = structuredClone(database);
  packet.items.forEach(item => {
    const question = resolveQuestion(next, item);
    const semester = clean(item.semester);
    const unit = clean(item.unit);
    const typeLabel = clean(item.typeLabel);
    const domain = ledgerCore.domainFor(unit);
    question.classification = {
      semester,
      domain,
      unit,
      majorUnit: domain,
      minorUnit: unit,
      typeId: ledgerCore.stableTypeId(semester, unit, typeLabel),
      typeLabel,
      status: "verified",
      evidence: Array.from(new Set([
        ...(question.classification.evidence || []),
        `${clean(packet.reviewId)}:${clean(item.evidenceId)}`
      ])).sort()
    };
  });
  next.typeCorrectionReviews = (next.typeCorrectionReviews || [])
    .filter(review => review.reviewId !== clean(packet.reviewId))
    .concat({
      reviewId: clean(packet.reviewId), reviewedAt: clean(packet.reviewedAt), correctedQuestionCount: packet.items.length
    }).sort((left, right) => left.reviewId.localeCompare(right.reviewId));
  next.typeCatalog = dbCore.rebuildTypeCatalog(next.questions);
  next.summary = dbCore.summarize(next);
  return next;
}

function applyAnswerDispute(database, packet) {
  validateDisputePacket(packet);
  const next = structuredClone(database);
  packet.items.forEach(item => {
    const question = resolveQuestion(next, item);
    question.answerCheck = {
      status: "disputed",
      evidence: Array.from(new Set([
        ...(question.answerCheck.evidence || []),
        `${clean(packet.reviewId)}:${clean(item.evidenceId)}`
      ])).sort(),
      note: clean(item.reason)
    };
    question.difficulty = {
      ...question.difficulty,
      reason: clean(item.difficultyReason),
      evidence: Array.from(new Set([
        ...(question.difficulty.evidence || []),
        `${clean(packet.reviewId)}:${clean(item.evidenceId)}:difficulty`
      ])).sort()
    };
    question.releaseStatus = "locked";
    question.usageProfiles = (question.usageProfiles || []).map(profile => ({
      ...profile,
      status: "candidate",
      evidence: [],
      reviewNote: "공식 답과 독립 계산이 일치하지 않아 선택 전 재검수 필요"
    }));
  });
  next.answerDisputeReviews = (next.answerDisputeReviews || [])
    .filter(review => review.reviewId !== clean(packet.reviewId))
    .concat({
      reviewId: clean(packet.reviewId), reviewedAt: clean(packet.reviewedAt), reviewCount: packet.reviewCount,
      affectedQuestionCount: packet.items.length
    }).sort((left, right) => left.reviewId.localeCompare(right.reviewId));
  next.summary = dbCore.summarize(next);
  return next;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(path.resolve(filePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function main(args) {
  const mode = args.shift();
  if (!["type", "answer"].includes(mode) || args.length !== 3) {
    throw new Error("사용법: apply-dolpa-question-exception-review.cjs <type|answer> <question-db> <review-packet> <output>");
  }
  const database = readJson(args[0]);
  const packet = readJson(args[1]);
  const result = mode === "type" ? applyTypeCorrection(database, packet) : applyAnswerDispute(database, packet);
  writeJson(args[2], result);
  process.stdout.write(`${JSON.stringify(result.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ normalizedKey, validateTypePacket, validateDisputePacket, applyTypeCorrection, applyAnswerDispute });
