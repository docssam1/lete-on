"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const mission = require("./source-5-2-rounding-place-count-mission6.js");

const sourceId = mission.sourceItemId;
const sourceText = fs.readFileSync("/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/page11/mission6/apple-vision-printed-text.txt", "utf8");
assert.match(sourceText, /7200/);
assert.match(sourceText, /적어도/);
assert.match(sourceText, /가장 많으면/);
assert.match(sourceText, /알맞은 수를 각각 구하여라/);

const round = (n, unit) => Math.floor(n / unit + 0.5) * unit;
function enumerate(target, unit) {
  const values = [];
  const lower = Math.max(1, target - unit / 2 - 1);
  const upper = target + unit / 2 + 1;
  for (let n = lower; n <= upper; n += 1) if (round(n, unit) === target) values.push(n);
  return values;
}

function verifyTarget(target) {
  const tens = enumerate(target, 10);
  const hundreds = enumerate(target, 100);
  const largerPlaceCounts = [1000, 10000, 100000, 1000000].map(unit => enumerate(target, unit).length);
  assert.equal(tens.length, 10, `${target}: ten-place count`);
  assert.equal(hundreds.length, 100, `${target}: hundred-place count`);
  assert.deepEqual(largerPlaceCounts, [0, 0, 0, 0], `${target}: no thousands-or-higher rounded result`);
  const q = mission.solve(target);
  assert.deepEqual([q.tens.first, q.tens.last], [tens[0], tens.at(-1)]);
  assert.deepEqual([q.hundreds.first, q.hundreds.last], [hundreds[0], hundreds.at(-1)]);
  assert.deepEqual([q.minimumCount, q.maximumCount], [10, 100]);
  return { target, tens: [tens[0], tens.at(-1), tens.length], hundreds: [hundreds[0], hundreds.at(-1), hundreds.length], largerPlaceCounts };
}

const source = verifyTarget(7200);
assert.deepEqual(source.tens, [7195, 7204, 10]);
assert.deepEqual(source.hundreds, [7150, 7249, 100]);

const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
  const q = mission.getQuestion(variant, difficultyOffset);
  assert(q, `${variant}/${difficultyOffset}`);
  const prompt = q.prompt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const target = q.questionModel.target;
  const expected = verifyTarget(target);
  assert(prompt.includes(target.toLocaleString("ko-KR")));
  assert.match(prompt, /개수는 최소 \(ㄱ\)개, 최대 \(ㄴ\)개/);
  assert.equal(q.answer, "10개, 100개");
  assert(q.solution.includes(q.questionModel.tens.first.toLocaleString("ko-KR")));
  assert(q.solution.includes(q.questionModel.tens.last.toLocaleString("ko-KR")));
  assert(q.solution.includes(q.questionModel.hundreds.first.toLocaleString("ko-KR")));
  assert(q.solution.includes(q.questionModel.hundreds.last.toLocaleString("ko-KR")));
  assert(q.solution.includes("일의 자리까지 반올림하면 수가 바뀌지 않으므로"));
  assert(q.solution.includes("천의 자리 이상"));
  assert.equal(q.publisherKeyVerified, false);
  assert.equal(q.handwrittenAnswerVerified, false);
  assert.equal(q.sourceStructurePreserved, true);
  observations.push({ variant, difficultyOffset, ...expected, answer: q.answer });
}

assert.deepEqual(mission.solve(7200), {
  target: 7200,
  tens: { first: 7195, last: 7204, count: 10 },
  hundreds: { first: 7150, last: 7249, count: 100 },
  minimumCount: 10,
  maximumCount: 100
});

console.log(JSON.stringify({
  status: "passed",
  sourceItemId: sourceId,
  sourceTextVerifiedFromAppleVisionOCR: true,
  sourcePlaceCounts: source,
  sourceAnswer: "10개, 100개",
  roundingUnitsConsidered: "십의 자리 이상(일의 자리 반올림은 원래 수를 그대로 두므로 어림 단위에서 제외)",
  syntheticConfigurations: observations.length,
  observations,
  publisherAnswerKeyUsed: false,
  handwritingUsed: false
}, null, 2));
