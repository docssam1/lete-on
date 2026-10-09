"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-decimal-e3.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e3-missions-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);
const expectedLabels = [
  "몫을 첫째·둘째 자리까지 반올림한 값의 차 구하기",
  "수 카드로 몫이 가장 큰 나눗셈 만들기",
  "반올림한 몫에 맞는 빈칸 숫자 찾기",
  "다리를 건널 수 있도록 실을 상자 수 구하기",
  "올림한 몫에 맞는 두 자리 소수의 개수 구하기",
  "직육면체 상자에 들어가는 정육면체 개수 구하기"
];

assert.equal(review.missions.length, 6);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "partial");
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
  assert.equal(publicType.reviewLocked, index === 4);
  assert.equal(Boolean(publicType.generatorKey), index !== 4);
  assert.equal(window.HSE_GENERATORS.generate({ ...publicType, reviewLocked: true }, 0, 0, 1), null, `${id}: 잠금은 생성기보다 우선`);
}

assert.equal(review.missions[1].permutationsChecked, 720);
assert.equal(review.missions[2].candidateDigitsChecked, 10);
assert.equal(review.missions[2].dividendPattern, "2.94□5");
const matches = [];
for (let digit = 0n; digit < 10n; digit++) {
  const numerator = 29405n + digit * 10n, denominator = 34000n;
  if ((200n * numerator + denominator) / (2n * denominator) === 86n) matches.push(Number(digit));
}
assert.deepEqual(matches, [0], "원문 한 빈칸은 열 후보 중 하나만 가능");
const divisors = [];
for (let hundredths = 1n; hundredths <= 1000n; hundredths++) {
  const ceilingTenth = (48210n + hundredths - 1n) / hundredths;
  if (ceilingTenth === 64n) divisors.push(`${hundredths / 100n}.${String(hundredths % 100n).padStart(2, "0")}`);
}
assert.deepEqual(divisors, review.missions[4].candidateDivisors, "올림 범위는 정확히 열두 값");
assert.equal(divisors.filter(value => !value.endsWith("0")).length, 11, "끝자리 영 해석에 따라 손글씨와 일치할 수 있음");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e3-mission-5").implementationStatus, "source-decimal-place-ambiguity-locked");
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e3-mission-5").reviewReason, /해석/);
assert.deepEqual(review.missions[5].dimensionsCm, ["15.05", "19.35", "25.8"]);
assert.equal(review.missions[5].independentAnswer, "756개");
console.log("6-2 탐구 3 Mission: 한 빈칸·원본 카드·올림·상자 조건과 자리 해석 잠금 검사 통과");
