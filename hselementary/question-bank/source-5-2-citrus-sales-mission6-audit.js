"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-citrus-sales-mission6.js");
const sourceItemId = "5-2-u1-e3-mission-6-citrus-sales";
const original = { harvest: [4283, 3976, 4015], boxSize: 500, boxPrice: 150000 };
const originalTotal = original.harvest.reduce((a, b) => a + b, 0);
assert.equal(originalTotal, 12274);
assert.equal(Math.floor(originalTotal / original.boxSize), 24);
assert.equal(originalTotal % original.boxSize, 274);
assert.equal(Math.floor(originalTotal / original.boxSize) * original.boxPrice, 3600000);

const tested = [];
for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const question = api.getQuestion(variant, difficulty);
  assert(question, `missing ${variant}/${difficulty}`);
  assert.equal(question.sourceItemId, sourceItemId);
  assert.equal(question.publisherKeyVerified, false);
  assert.equal(question.publisherAnswerVerified, false);
  assert.equal(question.handwrittenAnswerVerified, false);
  const questionText = question.prompt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const solutionText = question.solution.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  assert.match(questionText, /완성된 상자만 모두 판매/);
  assert.match(solutionText, /개가 남습니다/);
  assert(!questionText.includes(question.answer), "answer must not leak into the prompt");
  const { harvest, boxSize, boxPrice } = question.questionModel;
  const total = harvest.reduce((sum, count) => sum + count, 0);
  const fullBoxes = Math.floor(total / boxSize);
  const unpacked = total % boxSize;
  const revenue = fullBoxes * boxPrice;
  assert.equal(question.answerModel.total, total);
  assert.equal(question.answerModel.fullBoxes, fullBoxes);
  assert.equal(question.answerModel.unpacked, unpacked);
  assert.equal(question.answerModel.revenue, revenue);
  assert.equal(question.answer, `${revenue.toLocaleString("en-US")}원`);
  assert(solutionText.includes(`${total.toLocaleString("en-US")}÷${boxSize.toLocaleString("en-US")}=${fullBoxes.toLocaleString("en-US")}…${unpacked.toLocaleString("en-US")}`));
  assert(solutionText.includes(`${fullBoxes.toLocaleString("en-US")}×${boxPrice.toLocaleString("en-US")}=${revenue.toLocaleString("en-US")}원`));
  tested.push({ variant, difficulty, total, boxSize, fullBoxes, unpacked, revenue });
}

for (const pool of api.pools) {
  assert.notEqual(pool.boxSize, original.boxSize);
  assert.notEqual(pool.boxPrice, original.boxPrice);
  assert(pool.harvest.every((count, i) => count !== original.harvest[i]));
}
assert.equal(new Set(tested.map(item => `${item.total}:${item.boxSize}:${item.boxPrice}`)).size, 9);
for (const invalid of [-1, 3, 1.2]) assert.equal(api.getQuestion(invalid, 0), null);
for (const invalid of [-2, 2, 1.2]) assert.equal(api.getQuestion(0, invalid), null);

console.log(JSON.stringify({ status: "passed", sourceItemId, independentSourceAnswer: "3,600,000원", sourceTotal: originalTotal, fullSourceBoxes: 24, unpackedSourceCount: 274, configurations: tested.length, originalValuesExcludedFromPools: true, publisherKeyVerified: false }));
