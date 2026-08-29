"use strict";

const fs = require("node:fs");
const path = require("node:path");
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
  if (packet.schemaVersion !== "highselect-dolpa-method-review/v1") issues.push("schemaVersion");
  if (!/^DP-SRC-[0-9A-F]{12}$/.test(clean(packet.sourceId))) issues.push("sourceId");
  if (!clean(packet.paperId)) issues.push("paperId");
  if (!clean(packet.reviewId)) issues.push("reviewId");
  if (!Array.isArray(packet.reviews) || !packet.reviews.length) issues.push("reviews");
  const ids = new Set();
  (packet.reviews || []).forEach((review, index) => {
    const prefix = `reviews[${index}]`;
    if (!clean(review.questionId) || ids.has(review.questionId)) issues.push(`${prefix}.questionId`);
    ids.add(review.questionId);
    if (!Number.isSafeInteger(review.number) || review.number < 1) issues.push(`${prefix}.number`);
    if (!clean(review.solutionArchetype) || clean(review.solutionArchetype).length > 240) issues.push(`${prefix}.solutionArchetype`);
    if (!Array.isArray(review.tags) || review.tags.length < 2 || review.tags.some(tag => !clean(tag) || clean(tag).length > 60)) issues.push(`${prefix}.tags`);
    if (!clean(review.evidenceLocator) || clean(review.evidenceLocator).length > 120) issues.push(`${prefix}.evidenceLocator`);
    if (!['high', 'medium'].includes(clean(review.confidence))) issues.push(`${prefix}.confidence`);
  });
  if (issues.length) throw new Error(`돌파 풀이법 검수표를 확인해 주세요: ${issues.join(", ")}`);
}

function applyMethodReview(database, packet) {
  if (database.schemaVersion !== 1) throw new Error("돌파 문항 DB 버전을 확인해 주세요.");
  validatePacket(packet);
  const paper = database.papers.find(item => item.paperId === packet.paperId);
  if (!paper || paper.sourceId !== packet.sourceId) throw new Error("풀이법 검수표와 시험지 원본이 일치하지 않습니다.");
  const byId = new Map(database.questions.map(question => [question.questionId, question]));
  packet.reviews.forEach(review => {
    const question = byId.get(review.questionId);
    if (!question || question.paperId !== packet.paperId || question.sourceId !== packet.sourceId || question.number !== review.number) {
      throw new Error(`풀이법 검수 문항 위치가 일치하지 않습니다: ${review.questionId}`);
    }
    question.method = {
      solutionArchetype: clean(review.solutionArchetype),
      tags: Array.from(new Set(review.tags.map(clean))).sort(),
      status: "verified",
      evidence: [`${clean(packet.reviewId)}:${clean(review.evidenceLocator)}`]
    };
  });
  const reviewSummary = {
    reviewId: clean(packet.reviewId),
    sourceId: clean(packet.sourceId),
    paperId: clean(packet.paperId),
    reviewedAt: clean(packet.reviewedAt),
    reviewedQuestionCount: packet.reviews.length
  };
  const prior = Array.isArray(database.methodReviews) ? database.methodReviews : [];
  database.methodReviews = prior.filter(review => review.reviewId !== reviewSummary.reviewId).concat(reviewSummary)
    .sort((left, right) => left.reviewId.localeCompare(right.reviewId));
  database.typeCatalog = dbCore.rebuildTypeCatalog(database.questions);
  database.summary = dbCore.summarize(database);
  return database;
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node apply-dolpa-method-review.cjs <question-db> <method-review> <output>");
  const database = applyMethodReview(readJson(args[0]), readJson(args[1]));
  fs.mkdirSync(path.dirname(path.resolve(args[2])), { recursive: true });
  fs.writeFileSync(path.resolve(args[2]), `${JSON.stringify(database, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(database.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ validatePacket, applyMethodReview });
