"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const recorder = require("../scripts/record-dolpa-target-selection.cjs");

function question(number) {
  return {
    questionId: `DP-Q-AAAAAAAAAAAA-${String(number).padStart(3, "0")}`,
    paperId: "DP-PAPER",
    number,
    sourceRelation: "original",
    classification: { semester: "중1-1", minorUnit: "소인수분해" }
  };
}

test("현재 범위의 검수한 원본 30문항만 시험 구성으로 고정한다", () => {
  const questions = Array.from({ length: 30 }, (_, index) => question(index + 1));
  const plan = { targets: [{ targetId: "dp-middle2-2-transfer", indexedPaperIds: ["DP-PAPER"] }] };
  const manifest = {
    targetId: "dp-middle2-2-transfer",
    evidenceId: "audit.selection.one",
    selectedQuestionIds: questions.map(item => item.questionId)
  };
  const result = recorder.record(plan, { questions }, manifest);
  assert.equal(result.targets[0].selectedQuestionIds.length, 30);
  assert.equal(result.targets[0].selectionStatus, "ready_for_final_review");
});
