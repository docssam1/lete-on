"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");

const FORBIDDEN_KEYS = new Set(["prompt", "stem", "answer", "answerValue", "solution", "content", "rawText", "pageImage"]);
const BANDS = new Set(["standard", "raised"]);

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
  if (packet.schemaVersion !== "highselect-dolpa-difficulty-review/v1") issues.push("schemaVersion");
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
    if (!BANDS.has(clean(review.band))) issues.push(`${prefix}.band`);
    ["evidenceLocator", "reason"].forEach(key => {
      if (!clean(review[key]) || clean(review[key]).length > 180) issues.push(`${prefix}.${key}`);
    });
    if (!new Set(["high", "medium"]).has(clean(review.confidence))) issues.push(`${prefix}.confidence`);
  });
  if (issues.length) throw new Error(`돌파 난이도 검수표를 확인해 주세요: ${issues.join(", ")}`);
}

function applyDifficultyReview(database, packet) {
  if (database.schemaVersion !== 1) throw new Error("돌파 문항 DB 버전을 확인해 주세요.");
  validatePacket(packet);
  const next = structuredClone(database);
  const paper = next.papers.find(item => item.paperId === packet.paperId);
  if (!paper || paper.sourceId !== packet.sourceId) throw new Error("난이도 검수표와 시험지 원본이 일치하지 않습니다.");
  const byId = new Map(next.questions.map(question => [question.questionId, question]));
  packet.reviews.forEach(review => {
    const question = byId.get(clean(review.questionId));
    if (!question || question.paperId !== packet.paperId || question.sourceId !== packet.sourceId || question.number !== review.number) {
      throw new Error(`난이도 검수 문항 위치가 일치하지 않습니다: ${review.questionId}`);
    }
    question.difficulty = {
      band: clean(review.band),
      status: "verified",
      evidence: [`${clean(packet.reviewId)}:${clean(review.evidenceLocator)}`]
    };
  });
  const summary = {
    reviewId: clean(packet.reviewId),
    sourceId: clean(packet.sourceId),
    paperId: clean(packet.paperId),
    reviewedAt: clean(packet.reviewedAt),
    reviewedQuestionCount: packet.reviews.length,
    standardCount: packet.reviews.filter(review => review.band === "standard").length,
    raisedCount: packet.reviews.filter(review => review.band === "raised").length
  };
  const prior = Array.isArray(next.difficultyReviews) ? next.difficultyReviews : [];
  next.difficultyReviews = prior.filter(review => review.reviewId !== summary.reviewId).concat(summary)
    .sort((left, right) => left.reviewId.localeCompare(right.reviewId));
  next.summary = dbCore.summarize(next);
  return next;
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node apply-dolpa-difficulty-review.cjs <question-db> <difficulty-review> <output>");
  const result = applyDifficultyReview(readJson(args[0]), readJson(args[1]));
  const output = path.resolve(args[2]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ validatePacket, applyDifficultyReview });
