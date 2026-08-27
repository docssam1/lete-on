"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const types = require("../data/dp-original-question-types.js");
const middle22 = require("../data/review-only/dp-middle22-entry-202404-inventory.js").inventory;
const common1Entry = require("../data/review-only/dp-cm1-entry-202405-inventory.js").inventory;

const pairs = [
  ["middle2-2-transfer", middle22],
  ["common1-entry", common1Entry]
];

test("돌파 두 회차 60문항을 문제마다 한 유형으로 보여 준다", () => {
  assert.deepEqual(types.validate(), []);
  assert.equal(Object.values(types.sets).reduce((sum, set) => sum + set.items.length, 0), 60);

  pairs.forEach(([targetId, inventory]) => {
    const set = types.forTarget(targetId);
    assert.ok(set);
    assert.equal(set.items.length, inventory.items.length);
    set.items.forEach((item, index) => {
      assert.equal(item.number, inventory.items[index].number);
      assert.equal(item.semester, inventory.items[index].curriculumCandidate.label);
      assert.equal(item.unit, inventory.items[index].majorCandidate.label);
      assert.equal(item.sourceRelation, inventory.items[index].lineageRef.relation);
      assert.equal(item.sourceKind, item.sourceRelation === "replacement" ? "검산 완료 대체 문항" : "돌파 원본 시험지");
      assert.equal(item.supplement, false);
    });
  });
});

test("공통수학1 29번 대체 문항을 원본과 섞지 않는다", () => {
  const middleSet = types.forTarget("middle2-2-transfer");
  const commonSet = types.forTarget("common1-entry");
  assert.equal(middleSet.originalCount, 30);
  assert.equal(middleSet.replacementCount, 0);
  assert.equal(commonSet.originalCount, 29);
  assert.equal(commonSet.replacementCount, 1);
  assert.equal(commonSet.items[28].number, 29);
  assert.equal(commonSet.items[28].sourceRelation, "replacement");
});

test("고쟁이 문제를 돌파 원본 유형으로 표시하지 않는다", () => {
  const text = JSON.stringify(types.sets);
  assert.doesNotMatch(text, /고쟁이|참고서|추가 연습/);
});

test("문제 유형 이름은 학생이 이해할 수 있는 말로 적는다", () => {
  const labels = Object.values(types.sets).flatMap(set => set.items.map(item => item.label));
  labels.forEach(label => {
    assert.match(label, /(구하기|찾기|고르기|판단하기|계산하기|나타내기|비교하기)$/);
    assert.doesNotMatch(label, /아키타입|메타데이터|모델링|역산|비복원|추적/);
  });
});
