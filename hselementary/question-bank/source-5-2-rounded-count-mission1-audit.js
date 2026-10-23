"use strict";
const assert = require("node:assert/strict");
const mission = require("./source-5-2-rounded-count-mission1.js");

function enumerate(hundredTarget, tenCeilingTarget, limit = 10000) {
  const candidates = [];
  for (let n = 1; n <= limit; n += 1) {
    if (Math.floor((n + 50) / 100) * 100 === hundredTarget && Math.ceil(n / 10) * 10 === tenCeilingTarget) candidates.push(n);
  }
  return candidates;
}

const sourceCandidates = enumerate(1200, 1200, 3000);
assert.deepEqual(sourceCandidates, Array.from({ length: 10 }, (_, index) => 1191 + index));
assert.equal(sourceCandidates.length, 10);
const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) {
  for (const difficultyOffset of [-1, 0, 1]) {
    const question = mission.getQuestion(variant, difficultyOffset);
    assert.ok(question, `configuration ${variant}/${difficultyOffset} exists`);
    const { hundredTarget, tenCeilingTarget, commonRange } = question.questionModel;
    const candidates = enumerate(hundredTarget, tenCeilingTarget);
    assert.equal(candidates.length, question.answerModel.count);
    assert.deepEqual(candidates, Array.from({ length: candidates.length }, (_, index) => commonRange[0] + index));
    assert.equal(question.answer, `${candidates.length}개`);
    assert.notEqual(question.answer, "10개", "synthetic answer must differ from source answer");
    assert.notEqual(hundredTarget, 1200);
    assert.notEqual(tenCeilingTarget, 1200);
    observations.push({ variant, difficultyOffset, hundredTarget, tenCeilingTarget, commonRange, answer: question.answer });
  }
}

console.log(JSON.stringify({ status: "passed", sourceCandidates: sourceCandidates.length, sourceRange: [sourceCandidates[0], sourceCandidates.at(-1)], syntheticConfigurations: observations.length, observations }, null, 2));
