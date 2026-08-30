"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ledgerCore = require("./build-dolpa-work-ledger.cjs");
const dbCore = require("./build-dolpa-question-db.cjs");

const FORBIDDEN_KEYS = new Set(["prompt", "stem", "answer", "answerValue", "solution", "content", "rawText", "pageImage"]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function walk(value, pointer, issues) {
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    if (FORBIDDEN_KEYS.has(key)) issues.push(`forbidden:${pointer}/${key}`);
    walk(child, `${pointer}/${key}`, issues);
  });
}

function validatePacket(packet) {
  const issues = [];
  walk(packet, "", issues);
  if (packet.schemaVersion !== "highselect-dolpa-classification-review/v1") issues.push("schemaVersion");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(packet.sourceId))) issues.push("sourceId");
  if (!clean(packet.paperId)) issues.push("paperId");
  if (!clean(packet.reviewId)) issues.push("reviewId");
  if (!Array.isArray(packet.reviews) || !packet.reviews.length) issues.push("reviews");
  const ids = new Set();
  (packet.reviews || []).forEach((review, index) => {
    const prefix = `reviews[${index}]`;
    if (!clean(review.questionId) || ids.has(review.questionId)) issues.push(`${prefix}.questionId`);
    ids.add(clean(review.questionId));
    if (!Number.isSafeInteger(review.number) || review.number < 1) issues.push(`${prefix}.number`);
    ["semester", "unit", "typeLabel", "evidenceLocator", "reason"].forEach(key => {
      if (!clean(review[key]) || clean(review[key]).length > 180) issues.push(`${prefix}.${key}`);
    });
  });
  if (issues.length) throw new Error(`돌파 분류 교정표를 확인해 주세요: ${issues.join(", ")}`);
}

function applyClassificationReview(database, packet) {
  if (database.schemaVersion !== 1) throw new Error("돌파 문항 DB 버전을 확인해 주세요.");
  validatePacket(packet);
  const paper = database.papers.find(item => item.paperId === packet.paperId);
  if (!paper || paper.sourceId !== packet.sourceId) throw new Error("분류 교정표와 시험지 원본이 일치하지 않습니다.");
  const byId = new Map(database.questions.map(question => [question.questionId, question]));
  packet.reviews.forEach(review => {
    const question = byId.get(clean(review.questionId));
    if (!question || question.paperId !== packet.paperId || question.sourceId !== packet.sourceId || question.number !== review.number) {
      throw new Error(`분류 교정 문항 위치가 일치하지 않습니다: ${review.questionId}`);
    }
    const unit = clean(review.unit);
    const domain = ledgerCore.domainFor(unit);
    question.classification = {
      semester: clean(review.semester),
      domain,
      unit,
      majorUnit: domain,
      minorUnit: unit,
      typeId: ledgerCore.stableTypeId(review.semester, unit, review.typeLabel),
      typeLabel: clean(review.typeLabel),
      status: "verified",
      evidence: Array.from(new Set([
        ...(question.classification.evidence || []),
        `${clean(packet.reviewId)}:${clean(review.evidenceLocator)}`
      ])).sort()
    };
  });
  const reviewedQuestionIds = new Set(packet.reviews.map(review => clean(review.questionId)));
  let normalizedDomainCount = 0;
  database.questions.filter(question => reviewedQuestionIds.has(question.questionId)).forEach(question => {
    const domain = ledgerCore.domainFor(question.classification.unit);
    if (question.classification.domain === domain && question.classification.majorUnit === domain) return;
    question.classification.domain = domain;
    question.classification.majorUnit = domain;
    question.classification.evidence = Array.from(new Set([
      ...(question.classification.evidence || []),
      `${clean(packet.reviewId)}:taxonomy-domain-normalization`
    ])).sort();
    normalizedDomainCount += 1;
  });
  const reviewSummary = {
    reviewId: clean(packet.reviewId),
    sourceId: clean(packet.sourceId),
    paperId: clean(packet.paperId),
    reviewedAt: clean(packet.reviewedAt),
    reviewedQuestionCount: packet.reviews.length,
    normalizedDomainCount
  };
  const prior = Array.isArray(database.classificationReviews) ? database.classificationReviews : [];
  database.classificationReviews = prior.filter(review => review.reviewId !== reviewSummary.reviewId).concat(reviewSummary)
    .sort((left, right) => left.reviewId.localeCompare(right.reviewId));
  database.typeCatalog = dbCore.rebuildTypeCatalog(database.questions);
  database.summary = dbCore.summarize(database);
  return database;
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node apply-dolpa-classification-review.cjs <question-db> <classification-review> <output>");
  const database = applyClassificationReview(readJson(args[0]), readJson(args[1]));
  fs.mkdirSync(path.dirname(path.resolve(args[2])), { recursive: true });
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(database, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(database.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ validatePacket, applyClassificationReview });
