"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const rawInventory = require("./source-inventory/6-2-source-items.json");
const source = rawInventory.items;
const review = require("./source-inventory/6-2-u2-e4-exploration-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

assert.equal(rawInventory.integrity.expectedTotalItems, source.length, "원문 장부 총수는 실제 색인 수와 같아야 함");
for (const section of ["exploration", "example", "mission"]) {
  assert.equal(rawInventory.integrity.expectedBySection[section], source.filter(item => item.section === section).length);
}
for (const [unitId, expectedCount] of Object.entries(rawInventory.integrity.expectedByUnit)) {
  assert.equal(expectedCount, source.filter(item => item.unitId === unitId).length);
}
assert.equal(review.sourceItems.length, 2);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "locked");
assert(!source.some(item => item.sourceItemId === "6-2-u2-e4-exploration"), "서로 다른 두 물음을 한 문항으로 합치지 않음");

for (const [index, reviewed] of review.sourceItems.entries()) {
  const id = `6-2-u2-e4-exploration-${index + 1}`;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  assert.equal(reviewed.sourceItemId, id);
  assert(original && publicType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.pdfPage, 22);
  assert.equal(original.printedPage, 24);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  assert.equal(publicType.reviewLocked, true);
  assert.equal(publicType.generatorKey, "");
  assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 공식 답·화면 검수 전 출제 금지`);
}
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-exploration-1").name, /반지 수.*남은 금/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-exploration-2").name, /가장 작은 나머지/);
assert(!/반올림/.test(types.find(item => item.sourceItemId === "6-2-u2-e4-exploration-2").name), "원문에 없는 반올림을 유형명에 넣지 않음");
console.log("6-2 개념탐구 4: 두 물음 분리·원문 장부 수량·공개 잠금 검사 통과");
