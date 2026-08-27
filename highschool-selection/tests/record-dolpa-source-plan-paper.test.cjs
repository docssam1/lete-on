"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const recorder = require("../scripts/record-dolpa-source-plan-paper.cjs");

test("검수한 원본 시험지만 구성 대상에 추가한다", () => {
  const plan = {
    targets: [{
      targetId: "dp-middle2-2-transfer",
      indexedPaperIds: ["DP-OLD"],
      sourcePapersToReview: [{ sourceId: "DP-SRC-AAAAAAAAAAAA", reviewStatus: "question_index_pending" }]
    }]
  };
  const result = recorder.record(plan, "dp-middle2-2-transfer", "DP-NEW", "DP-SRC-AAAAAAAAAAAA");
  assert.deepEqual(result.targets[0].indexedPaperIds, ["DP-NEW", "DP-OLD"]);
  assert.equal(result.targets[0].sourcePapersToReview[0].paperId, "DP-NEW");
  assert.equal(result.targets[0].sourcePapersToReview[0].reviewStatus, "question_index_verified");
  assert.equal(plan.targets[0].sourcePapersToReview[0].paperId, undefined);
});
