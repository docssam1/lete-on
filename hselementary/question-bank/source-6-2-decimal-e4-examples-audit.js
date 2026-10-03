"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-decimal-e4.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e4-examples-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

assert.equal(review.examples.length, 4);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "partial");
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);

for (const [index, reviewed] of review.examples.entries()) {
  const id = `6-2-u2-e4-example-${index + 1}`;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  assert.equal(reviewed.sourceItemId, id);
  assert(original && publicType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.pdfPage, 22);
  assert.equal(original.printedPage, 24);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  const locked = index === 3;
  assert.equal(publicType.reviewLocked, locked);
  assert.equal(publicType.generatorKey, locked ? "" : `sourceGrade6DecimalE4Example${index + 1}`);
  assert.equal(publicType.problemVisualRequired, false, "원문에 없는 그림은 생성하지 않음");
  if (!locked) assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1).answer, reviewed.independentAnswer);
  assert.equal(window.HSE_GENERATORS.generate({ ...publicType, reviewLocked: true }, 0, 0, 1), null, `${id}: 잠금이 생성기보다 우선`);
}

assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-example-3").name, /새 나머지/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-example-4").name, /몫의 자리를 늘려 새 나머지/);
assert.match(source.find(item => item.sourceItemId === "6-2-u2-e4-example-4").implementationStatus, /conflict-locked/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-example-4").reviewReason, /공식 답/);
console.log("6-2 개념탐구 4 예제 4문항: 원문 구조·새 나머지 유형·공개 잠금 검사 통과");
