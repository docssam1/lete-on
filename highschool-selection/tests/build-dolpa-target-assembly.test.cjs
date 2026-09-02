"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const assembly = require("../scripts/build-dolpa-target-assembly.cjs");

function q(id, paperId, number, semester, unit, sourceRelation = "original") {
  return {
    questionId: id,
    paperId,
    number,
    sourceRelation,
    classification: { semester, minorUnit: unit }
  };
}

test("구성표는 원본을 지우지 않고 시험 범위 안팎을 따로 기록한다", () => {
  const database = { papers: [], questions: [
    q("q1", "m22", 1, "중2-1", "연립일차방정식의 활용"),
    q("q2", "m22", 2, "중2-1", "일차함수"),
    q("q3", "cm1", 1, "중3-2", "원의 성질"),
    q("q4", "cm1", 2, "중1-2", "입체도형의 성질"),
    q("q5", "cm1", 3, "중2-2", "도형의 닮음", "replacement")
  ] };
  const plan = { targets: [
    { targetId: "dp-middle2-2-transfer", indexedPaperIds: ["m22"] },
    { targetId: "dp-common1-entry-202405", indexedPaperIds: ["cm1"] }
  ] };
  const result = assembly.build(database, plan);
  const middle = result.targets.find(target => target.targetId === "dp-middle2-2-transfer");
  const common = result.targets.find(target => target.targetId === "dp-common1-entry-202405");
  assert.deepEqual(middle.includedQuestionIds, ["q1", "q2"]);
  assert.deepEqual(middle.excluded.map(item => item.questionId), []);
  assert.deepEqual(common.includedQuestionIds, ["q3"]);
  assert.deepEqual(common.excluded.map(item => item.questionId), ["q4", "q5"]);
  assert.equal(middle.selectedCount, 0);
  assert.equal(middle.reserveCount, 2);
  assert.equal(middle.assemblyStatus, "waiting_for_original_items");
  assert.equal(database.questions.length, 5);
});

test("과정 시작 시험의 상향 확인 문항은 대표 구성에서만 빠진다", () => {
  const database = {
    papers: [{
      paperId: "m22", placementContext: {
        extensionProbeQuestionNumbers: [2],
        representativePolicy: { mode: "core_only", excludedQuestionNumbers: [2] }
      }
    }],
    questions: [
      q("q1", "m22", 1, "중2-1", "일차함수"),
      q("q2", "m22", 2, "중2-1", "일차함수")
    ]
  };
  const plan = { targets: [
    { targetId: "dp-middle2-2-transfer", indexedPaperIds: ["m22"] },
    { targetId: "dp-common1-entry-202405", indexedPaperIds: [] }
  ] };
  const result = assembly.build(database, plan);
  const target = result.targets.find(item => item.targetId === "dp-middle2-2-transfer");
  assert.deepEqual(target.includedQuestionIds, ["q1"]);
  assert.deepEqual(target.excluded.map(item => item.questionId), ["q2"]);
  assert.match(target.excluded[0].reason, /상향 확인 문항/);
  assert.equal(database.questions.length, 2);
});
