"use strict";

const fs = require("node:fs");
const path = require("node:path");
const reviewTools = require("./apply-project-type-reviews.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function reconcile(index, packet) {
  const candidateIds = new Set((index.overlapCandidates || []).map(candidate => candidate.candidateId));
  const expanded = reviewTools.expandBatchReviews(index, packet);
  const reviews = [];
  const retiredReviews = [];
  const seen = new Set();
  (expanded.reviews || []).forEach(review => {
    if (seen.has(review.candidateId)) throw new Error(`같은 유형 후보 검수가 중복됩니다: ${review.candidateId}`);
    seen.add(review.candidateId);
    if (candidateIds.has(review.candidateId)) reviews.push(review);
    else retiredReviews.push({ ...review, retiredReason: "candidate_not_present_in_current_index" });
  });
  reviews.sort((left, right) => left.candidateId.localeCompare(right.candidateId));
  retiredReviews.sort((left, right) => left.candidateId.localeCompare(right.candidateId));
  const output = {
    schemaVersion: 1,
    title: String(packet.title || "프로젝트 공통 유형 후보 ID 고정 검수표"),
    reviews,
    retiredReviews,
    summary: {
      candidateCount: candidateIds.size,
      carriedReviewCount: reviews.length,
      retiredReviewCount: retiredReviews.length,
      pendingCount: Math.max(0, candidateIds.size - reviews.length)
    }
  };
  const issues = reviewTools.validateReviews(index, output);
  if (issues.length) throw new Error(`이어 쓸 유형 검수표를 확인해 주세요: ${issues.join(", ")}`);
  return output;
}

function main(args) {
  if (args.length !== 3) throw new Error("사용법: node reconcile-project-type-reviews.cjs <새공통인덱스.json> <이전검수표.json> <출력.json>");
  const output = reconcile(readJson(args[0]), readJson(args[1]));
  const outputPath = path.resolve(args[2]);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(output.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ reconcile });
