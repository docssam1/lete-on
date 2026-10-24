"use strict";
const assert = require("node:assert/strict");
const mission = require("./source-5-2-quotient-sum-mission5.js");

function enumerate(roundedTarget, truncatedTarget, limit = 10000) {
  const values = [];
  for (let n = 1; n <= limit; n += 1) {
    if (Math.floor(Math.floor(n / 9) / 10 + 0.5) * 10 !== roundedTarget) continue;
    if (Math.floor(Math.floor(n / 6) / 10) * 10 !== truncatedTarget) continue;
    values.push(n);
  }
  return values;
}

const source = enumerate(30, 40, 1000);
assert.deepEqual(source, Array.from({ length: 60 }, (_, i) => 240 + i));
assert.equal(source.reduce((sum, n) => sum + n, 0), 16170);

const observations = [];
const configurationKeys = new Set();
for (let variant = 0; variant < mission.pools.length; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
  const q = mission.getQuestion(variant, difficultyOffset);
  assert(q, `configuration ${variant}/${difficultyOffset}`);
  const m = q.questionModel;
  const values = enumerate(m.roundedTarget, m.truncatedTarget);
  assert.deepEqual(values, Array.from({ length: m.count }, (_, i) => m.commonRange[0] + i));
  assert.deepEqual(m.commonRange, [values[0], values.at(-1)]);
  assert.equal(q.answer, values.reduce((sum, n) => sum + n, 0).toLocaleString("ko-KR"));
  assert(q.solution.includes(q.answer));
  assert.equal(q.publisherKeyVerified, false);
  assert.notEqual(m.roundedTarget, 30, "Do not reuse source rounding target");
  assert.notEqual(m.truncatedTarget, 40, "Do not reuse source truncation target");
  const configurationKey = `${m.roundedTarget}/${m.truncatedTarget}`;
  assert(!configurationKeys.has(configurationKey), `Generated condition pair must be unique: ${configurationKey}`);
  configurationKeys.add(configurationKey);
  observations.push({ variant, difficultyOffset, roundedTarget: m.roundedTarget, truncatedTarget: m.truncatedTarget, candidateRange: m.commonRange, count: values.length, answer: q.answer });
}
assert.equal(observations.length, 9);
assert.equal(configurationKeys.size, 9, "All pool/difficulty combinations must differ");
assert.equal(mission.getQuestion(-1, 0), null);
assert.equal(mission.getQuestion(0, 2), null);
console.log(JSON.stringify({ status: "passed", sourceCandidateRange: [240, 299], sourceCount: source.length, sourceSum: 16170, syntheticConfigurations: observations.length, observations }, null, 2));
