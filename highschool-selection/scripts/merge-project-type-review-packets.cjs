"use strict";

const fs = require("node:fs");
const path = require("node:path");
const reviews = require("./apply-project-type-reviews.cjs");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function mergeReviewPackets(index, packets) {
  const byCandidateId = new Map();
  packets.forEach((packet, packetIndex) => {
    const expanded = reviews.expandBatchReviews(index, packet);
    const issues = reviews.validateReviews(index, expanded);
    if (issues.length) throw new Error(`유형 검수 묶음 ${packetIndex + 1}을 확인해 주세요: ${issues.join(", ")}`);
    (expanded.reviews || []).forEach(review => {
      const prior = byCandidateId.get(review.candidateId);
      if (prior) throw new Error(`같은 후보를 두 번 검수했습니다: ${review.candidateId}`);
      byCandidateId.set(review.candidateId, review);
    });
  });
  const merged = {
    schemaVersion: 1,
    title: "프로젝트 공통 유형 후보 ID 고정 검수표",
    reviews: Array.from(byCandidateId.values()).sort((left, right) => left.candidateId.localeCompare(right.candidateId))
  };
  merged.summary = {
    candidateCount: (index.overlapCandidates || []).length,
    reviewCount: merged.reviews.length,
    pendingCount: Math.max(0, (index.overlapCandidates || []).length - merged.reviews.length),
    complete: merged.reviews.length === (index.overlapCandidates || []).length
  };
  return merged;
}

function main(args) {
  if (args.length < 3) throw new Error("사용법: node merge-project-type-review-packets.cjs <공통인덱스.json> <출력.json> <검수표1.json> [검수표2.json ...]");
  const index = readJson(args[0]);
  const outputPath = args[1];
  const merged = mergeReviewPackets(index, args.slice(2).map(readJson));
  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(merged.summary)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ mergeReviewPackets });
