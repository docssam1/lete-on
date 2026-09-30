"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e5-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);
const expectedIds = ["6-2-u2-e5-exploration-1", ...Array.from({ length: 4 }, (_, i) => `6-2-u2-e5-example-${i + 1}`)];

assert.equal(review.sourceIdentity.pdfPage, 24);
assert.equal(review.sourceIdentity.printedPage, 26);
assert.equal(review.sourceIdentity.originalChecked, true);
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "locked");
assert.deepEqual(review.items.map(item => item.sourceItemId), expectedIds);
assert.equal(new Set(review.items.map(item => item.answerContract)).size, expectedIds.length);

for (const reviewed of review.items) {
  const id = reviewed.sourceItemId;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  const inventoryType = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === id);
  assert(original && publicType && inventoryType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.pdfPage, 24);
  assert.equal(original.printedPage, 26);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  assert.equal(original.implementationStatus, "review-locked");
  assert.equal(inventoryType.problemVisualRequired, false, `${id}: 원문은 그림 없는 서술형`);
  assert.equal(inventoryType.answerVisualRequired, true);
  assert.match(inventoryType.reviewReason, /공식 답/);
  assert.equal(publicType.reviewLocked, true);
  assert.equal(publicType.generatorKey, "");
  assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 공식 답 대조 전 출제 금지`);
  assert(reviewed.candidateVerification, `${id}: 잠금 후보 생성기 기록 누락`);
  assert.equal(reviewed.candidateVerification.fixedPoolCount, 3);
  assert.equal(reviewed.candidateVerification.publicReleaseStatus, "locked");
  assert.equal(reviewed.candidateVerification.difficultyDesign.length, 3);
  const candidate = { ...publicType, reviewLocked: false, generatorKey: reviewed.candidateVerification.generator };
  for (const difficulty of [-1, 0, 1]) {
    const generated = window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, 0);
    assert.equal(generated.sourceItemId, id, `${id}: 후보 문항이 원본 항목을 가리킴`);
    assert(generated.prompt && generated.answer && generated.solution && generated.answerVisual, `${id}: 문제·정답·풀이·답 그림 존재`);
  }
}

assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-example-2").name, /연료값/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-example-4").name, /거슬러/);
console.log("6-2 개념탐구 5 본문·예제 5문항: 원문 구조·3난이도 후보·공개 잠금 검사 통과");
