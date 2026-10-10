"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-decimal-e4.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e4-missions-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);
const expectedLabels = [
  "네 나눗셈의 나머지를 큰 순서로 쓰기",
  "정확한 몫의 자리를 줄여 생기는 나머지 구하기",
  "원래 수를 되찾아 다른 수로 나눈 나머지 구하기",
  "몫이 소수 둘째 자리에서 끝나도록 더하기",
  "가장 큰 원래 수를 찾아 다시 나눈 나머지 구하기",
  "셋째 자리 몫의 반올림과 나머지로 원래 수 구하기"
];

assert.equal(review.missions.length, 6);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "verified-finite-pools");
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);

for (const [index, reviewed] of review.missions.entries()) {
  const id = `6-2-u2-e4-mission-${index + 1}`;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  assert.equal(reviewed.sourceItemId, id);
  assert(original && publicType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.pdfPage, 23);
  assert.equal(original.printedPage, 25);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  assert.equal(publicType.name, expectedLabels[index]);
  assert.equal(publicType.reviewLocked, false);
  assert.equal(publicType.generatorKey, `sourceGrade6DecimalE4Mission${index + 1}`);
  assert.equal(publicType.problemVisualRequired, false, "원문에 없는 그림은 생성하지 않음");
  assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1).answer, reviewed.independentAnswer);
  assert.equal(window.HSE_GENERATORS.generate({ ...publicType, reviewLocked: true }, 0, 0, 1), null, `${id}: 잠금이 생성기보다 우선`);
}

assert.equal(review.missions[5].possibleHundredthQuotientsChecked, 1000);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e4-mission-5").name, /다시 나눈 나머지/);
console.log("6-2 개념탐구 4 Mission 6문항: 원문 구조·새 나머지 유형·공개 잠금 검사 통과");
