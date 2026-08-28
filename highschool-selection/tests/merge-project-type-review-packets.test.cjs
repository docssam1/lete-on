"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const merger = require("../scripts/merge-project-type-review-packets.cjs");

function candidate(candidateId) {
  return { candidateId, leftConceptFamilyId: `L-${candidateId}`, rightConceptFamilyId: `R-${candidateId}`, status: "review_required", decision: null };
}

function review(candidateId, decision) {
  return { candidateId, decision, reviewer: "T", reviewedAt: "2026-08-28", reason: "근거를 대조해 판단", evidence: decision === "merge_detail" ? ["source:evidence"] : [] };
}

test("나뉜 검수표를 후보 ID 기준으로 합치고 전체 처리 여부를 계산한다", () => {
  const index = { overlapCandidates: [candidate("OVR-1"), candidate("OVR-2")] };
  const merged = merger.mergeReviewPackets(index, [
    { schemaVersion: 1, reviews: [review("OVR-1", "merge_detail")] },
    { schemaVersion: 1, reviews: [review("OVR-2", "keep_separate")] }
  ]);
  assert.equal(merged.summary.reviewCount, 2);
  assert.equal(merged.summary.pendingCount, 0);
  assert.equal(merged.summary.complete, true);
});

test("같은 후보가 두 검수표에 있으면 조용히 덮어쓰지 않고 중단한다", () => {
  const index = { overlapCandidates: [candidate("OVR-1")] };
  assert.throws(() => merger.mergeReviewPackets(index, [
    { schemaVersion: 1, reviews: [review("OVR-1", "merge_detail")] },
    { schemaVersion: 1, reviews: [review("OVR-1", "keep_separate")] }
  ]), /두 번 검수/);
});
