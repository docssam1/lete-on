"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const reconciler = require("../scripts/reconcile-project-type-reviews.cjs");

test("새 인덱스에 남은 검수만 이어 쓰고 사라진 후보 결정은 별도 기록으로 보존한다", () => {
  const index = {
    overlapCandidates: [{ candidateId: "C1" }, { candidateId: "C3" }]
  };
  const packet = {
    schemaVersion: 1,
    title: "검수표",
    reviews: [
      { candidateId: "C1", decision: "keep_separate", reviewer: "검수자", reviewedAt: "2026-08-29", reason: "다른 유형", evidence: [] },
      { candidateId: "C2", decision: "keep_separate", reviewer: "검수자", reviewedAt: "2026-08-29", reason: "다른 유형", evidence: [] }
    ]
  };
  const output = reconciler.reconcile(index, packet);
  assert.deepEqual(output.reviews.map(review => review.candidateId), ["C1"]);
  assert.deepEqual(output.retiredReviews.map(review => review.candidateId), ["C2"]);
  assert.equal(output.retiredReviews[0].retiredReason, "candidate_not_present_in_current_index");
  assert.equal(output.summary.pendingCount, 1);
});
