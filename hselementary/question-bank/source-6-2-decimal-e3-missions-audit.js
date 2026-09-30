"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e3-missions-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);
const expectedLabels = [
  "몫을 첫째·둘째 자리까지 반올림한 값의 차 구하기",
  "수 카드로 몫이 가장 큰 나눗셈 만들기",
  "반올림한 몫에 맞는 두 빈칸 숫자 모두 찾기",
  "다리를 건널 수 있도록 실을 상자 수 구하기",
  "반올림한 몫에 맞는 두 자리 소수의 개수 구하기",
  "직육면체 상자에 들어가는 정육면체 개수 구하기"
];

assert.equal(review.missions.length, 6);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "locked");
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);

for (const [index, item] of review.missions.entries()) {
  const id = `6-2-u2-e3-mission-${index + 1}`;
  const raw = source.find(entry => entry.sourceItemId === id);
  const publicType = types.find(entry => entry.sourceItemId === id);
  assert.equal(item.sourceItemId, id);
  assert(raw && publicType, `${id}: 원문과 공개 유형이 연결되어야 함`);
  assert.equal(raw.pdfPage, 21);
  assert.equal(raw.printedPage, 23);
  assert.equal(raw.sourceVerified, true);
  assert.equal(raw.answerContract, item.answerContract);
  assert.equal(publicType.name, expectedLabels[index]);
  assert.equal(publicType.commonTypeId, expectedLabels[index]);
  assert.equal(publicType.reviewLocked, true);
  assert.equal(publicType.generatorKey, "");
  assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 정답지·화면 검수 전 출제 금지`);
}

assert.equal(review.missions[1].permutationsChecked, 720);
assert.equal(review.missions[2].candidatePairsChecked, 100);
assert.match(source.find(item => item.sourceItemId === "6-2-u2-e3-mission-3").implementationStatus, /ambiguity-locked/);
assert.match(source.find(item => item.sourceItemId === "6-2-u2-e3-mission-5").implementationStatus, /conflict-locked/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e3-mission-3").reviewReason, /여러 개/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e3-mission-5").reviewReason, /공식 답/);
console.log("6-2 개념탐구 3 Mission 6문항: 원문 구조·유형·잠금 상태 검사 통과");
