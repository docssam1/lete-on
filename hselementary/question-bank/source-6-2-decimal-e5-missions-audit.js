"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

assert.equal(review.sourceIdentity.pdfPage, 25);
assert.equal(review.sourceIdentity.printedPage, 27);
assert.equal(review.sourceIdentity.originalChecked, true);
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "locked");
assert.deepEqual(review.missions.map(item => item.sourceItemId), Array.from({ length: 6 }, (_, i) => `6-2-u2-e5-mission-${i + 1}`));
assert.equal(new Set(review.missions.map(item => item.answerContract)).size, 6);

for (const [index, reviewed] of review.missions.entries()) {
  const id = reviewed.sourceItemId;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  const inventoryType = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === id);
  assert(original && publicType && inventoryType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.pdfPage, 25);
  assert.equal(original.printedPage, 27);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  assert.equal(inventoryType.problemVisualRequired, false, `${id}: 원문은 그림 없는 서술형`);
  assert.equal(inventoryType.answerVisualRequired, true);
  assert.equal(publicType.reviewLocked, true);
  assert.equal(publicType.generatorKey, "");
  assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 공식 답 대조 전 출제 금지`);
}

assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").implementationStatus, "ambiguity-locked");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").implementationStatus, "conflict-locked");
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").reviewReason, /기준 빠르기/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").reviewReason, /손글씨 답/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").name, /참기름/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-6").name, /갤런/);
console.log("6-2 개념탐구 5 Mission 6문항: 각기 다른 원문 구조·두 충돌 잠금·공개 잠금 검사 통과");
