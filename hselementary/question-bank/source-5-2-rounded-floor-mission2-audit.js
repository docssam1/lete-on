"use strict";
const assert = require("node:assert/strict");
const mission = require("./source-5-2-rounded-floor-mission2.js");

function enumerate(hundredTarget, thousandFloorTarget, limit = 12000) {
  const candidates = [];
  for (let n = 1; n <= limit; n += 1) {
    if (Math.floor((n + 50) / 100) * 100 === hundredTarget && Math.floor(n / 1000) * 1000 === thousandFloorTarget) candidates.push(n);
  }
  return candidates;
}

const sourceCandidates = enumerate(4000, 3000);
assert.deepEqual(sourceCandidates, Array.from({ length: 50 }, (_, index) => 3950 + index));
assert.equal(sourceCandidates.length, 50);
const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) {
  for (const difficultyOffset of [-1, 0, 1]) {
    const question = mission.getQuestion(variant, difficultyOffset);
    assert.ok(question, `configuration ${variant}/${difficultyOffset} exists`);
    const { hundredTarget, thousandFloorTarget, commonRange } = question.questionModel;
    const candidates = enumerate(hundredTarget, thousandFloorTarget);
    assert.equal(candidates.length, question.answerModel.count);
    assert.deepEqual(candidates, Array.from({ length: candidates.length }, (_, index) => commonRange[0] + index));
    assert.equal(question.answer, `${candidates.length}개`);
    const expectedCount = difficultyOffset === 1 ? 50 : 100;
    assert.equal(question.answer, `${expectedCount}개`, `expected answer for ${variant}/${difficultyOffset}`);
    if (difficultyOffset === 1) {
      const { roundedRange, floorRange, commonRange } = question.questionModel;
      assert.equal(commonRange[0], roundedRange[0], "hard overlap starts at the rounded interval boundary");
      assert.equal(commonRange[1], floorRange[1], "hard overlap ends at the thousand-floor boundary");
      assert.equal(question.answerModel.count, 50, "hard setting preserves the source partial-overlap count");
    }
    assert.notEqual(hundredTarget, 4000);
    assert.notEqual(thousandFloorTarget, 3000);
    observations.push({ variant, difficultyOffset, hundredTarget, thousandFloorTarget, commonRange, answer: question.answer });
  }
}

console.log(JSON.stringify({ status: "passed", sourceCandidates: sourceCandidates.length, sourceRange: [sourceCandidates[0], sourceCandidates.at(-1)], syntheticConfigurations: observations.length, observations }, null, 2));
