"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-supply-cost-mission4.js");
const sourceItemId = "5-2-u1-e3-mission-4-mat-cost";
const original = { students: 652, marts: [{ pack: 15, price: 9000 }, { pack: 24, price: 13000 }] };

const originalCosts = original.marts.map(mart => Math.ceil(original.students / mart.pack) * mart.price);
assert.deepEqual(originalCosts, [396000, 364000]);
assert.equal(Math.min(...originalCosts), 364000);
assert.equal(Math.max(...originalCosts) - Math.min(...originalCosts), 32000);

const tested = [];
for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const item = api.getQuestion(variant, difficulty);
  assert(item, `missing ${variant}/${difficulty}`);
  assert.match(item.prompt, /한 마트에서만 묶음으로/);
  const text = item.prompt.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const solution = item.solution.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  assert.match(item.prompt, /<table class="source52-supply-cost-table">/);
  assert.match(item.prompt, /<caption>마트별 스케치북 묶음 판매<\/caption>/);
  assert.match(item.prompt, /한 묶음의 수/);
  assert.match(item.prompt, /한 묶음의 가격/);
  assert.equal(item.sourceItemId, sourceItemId);
  assert.equal(item.publisherKeyVerified, false);
  assert.equal(item.publisherAnswerVerified, false);
  assert.equal(item.handwrittenAnswerVerified, false);

  const studentsMatch = text.match(/전교생 ([\d,]+)명/);
  assert(studentsMatch, "learner-facing prompt must show student count");
  const students = Number(studentsMatch[1].replaceAll(",", ""));
  const rows = [...item.prompt.matchAll(/<tr><th scope="row">\((가|나)\)마트<\/th><td>([\d,]+)권<\/td><td>([\d,]+)원<\/td><\/tr>/g)];
  assert.equal(rows.length, 2, "prompt must include both source-style mart rows");
  const marts = rows.map((row, index) => ({ label: row[1], pack: Number(row[2].replaceAll(",", "")), price: Number(row[3].replaceAll(",", "")), expectedLabel: ["가", "나"][index] }));
  for (const mart of marts) assert.equal(mart.label, mart.expectedLabel);

  const computed = marts.map(mart => {
    const bundles = Math.ceil(students / mart.pack);
    const purchased = bundles * mart.pack;
    const left = purchased - students;
    const cost = bundles * mart.price;
    assert(solution.includes(`${bundles}묶음`));
    assert(solution.includes(`${bundles}×${mart.pack}=${purchased}권`));
    assert(solution.includes(`${left}권이 남`));
    assert(solution.includes(`${bundles}×${mart.price.toLocaleString("en-US")}=${cost.toLocaleString("en-US")}원`));
    return { ...mart, bundles, purchased, left, cost };
  });
  const [a, b] = computed;
  assert.notEqual(a.cost, b.cost, "each variant must have one clear cheaper mart");
  const winner = a.cost < b.cost ? a : b;
  const savings = Math.abs(a.cost - b.cost);
  assert.equal(item.answer, `(${winner.label})마트, ${savings.toLocaleString("en-US")}원 절약`);
  assert.equal(item.answerModel.cheapestMart, winner.label);
  assert.equal(item.answerModel.savings, savings);
  assert(solution.includes(`${Math.max(a.cost, b.cost).toLocaleString("en-US")}원−${Math.min(a.cost, b.cost).toLocaleString("en-US")}원=${savings.toLocaleString("en-US")}원`));
  assert(!text.includes(`${savings.toLocaleString("en-US")}원`), "savings must not leak into question");
  assert(!text.includes(`${winner.label})마트가 더 싼`), "winner must not leak into question");
  assert.equal(item.answerVisualRequired, false);
  assert.equal(item.answerVisualStatus, "not-required");
  assert.equal(item.difficultyLevel, difficulty + 1);
  tested.push({ variant, difficulty, students, costs: [a.cost, b.cost], winner: winner.label, savings });
}

assert.equal(new Set(tested.map(item => `${item.students}:${item.costs.join(":")}`)).size, 9);
for (const pool of api.pools) {
  assert.notEqual(pool.students, original.students);
  for (const mart of pool.marts) {
    assert.notEqual(mart.pack, 15);
    assert.notEqual(mart.pack, 24);
    assert.notEqual(mart.price, 9000);
    assert.notEqual(mart.price, 13000);
  }
}
for (const invalid of [-1, 3, 1.2]) assert.equal(api.getQuestion(invalid, 0), null);
for (const invalid of [-2, 2, 1.2]) assert.equal(api.getQuestion(0, invalid), null);

console.log(JSON.stringify({ status: "passed", sourceItemId, originalCosts, originalSavings: 32000, configurations: tested.length, allNineHaveUniqueCheaperMart: true, sourceValuesExcludedFromPools: true, publisherKeyVerified: false }));
