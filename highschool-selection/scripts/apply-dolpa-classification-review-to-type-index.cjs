"use strict";

const fs = require("node:fs");
const path = require("node:path");
const classificationReview = require("./apply-dolpa-classification-review.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function applyReview(typeIndex, packet) {
  classificationReview.validatePacket(packet);
  if (typeIndex.schemaVersion !== 1 || !Array.isArray(typeIndex.papers)) {
    throw new Error("돌파 원본 유형표 버전을 확인해 주세요.");
  }
  const next = structuredClone(typeIndex);
  const paper = next.papers.find(item => item.paperId === packet.paperId);
  if (!paper) throw new Error(`원본 유형표에 없는 시험지입니다: ${packet.paperId}`);
  if (!Array.isArray(paper.questions) || paper.questions.length !== 30) {
    throw new Error(`원본 유형표의 문항 수가 30개가 아닙니다: ${packet.paperId}`);
  }
  const byNumber = new Map(paper.questions.map(question => [question.number, question]));
  packet.reviews.forEach(review => {
    const question = byNumber.get(review.number);
    if (!question) throw new Error(`원본 유형표에 없는 문항입니다: ${packet.paperId} ${review.number}번`);
    question.semester = String(review.semester).trim();
    question.unit = String(review.unit).trim();
    question.type = String(review.typeLabel).trim();
  });
  next.totalQuestionCount = next.papers.reduce((sum, item) => sum + item.questionCount, 0);
  return next;
}

function main(args) {
  if (args.length !== 3) {
    throw new Error("사용법: node apply-dolpa-classification-review-to-type-index.cjs <type-index> <classification-review> <output>");
  }
  const result = applyReview(readJson(args[0]), readJson(args[1]));
  const output = path.resolve(args[2]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ paperCount: result.papers.length, questionCount: result.totalQuestionCount })}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ applyReview });
