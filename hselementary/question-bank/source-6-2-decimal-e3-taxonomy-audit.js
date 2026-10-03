"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-decimal-e3.js");

const raw = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e3-exploration-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);
const commonType = "몫을 소수 둘째 자리까지 반올림하기";
assert.equal(review.commonType, commonType);
assert.equal(review.sourceItems.length, 3);
assert(!raw.some(item => item.sourceItemId === "6-2-u2-e3-exploration"), "세 소문항을 한 원문 문항으로 합치지 않음");

function exactFraction(decimal) {
  assert(/^\d+(?:\.\d+)?$/.test(decimal), "양의 유한소수");
  const [whole, fractional = ""] = decimal.split(".");
  return { numerator: BigInt(whole + fractional), denominator: 10n ** BigInt(fractional.length) };
}

function roundedHundredth(dividend, divisor) {
  const left = exactFraction(dividend);
  const right = exactFraction(divisor);
  const numerator = left.numerator * right.denominator;
  const denominator = left.denominator * right.numerator;
  const candidates = [];
  for (let cents = 0n; cents <= 2000n; cents += 1n) {
    if ((2n * cents - 1n) * denominator <= 200n * numerator
      && 200n * numerator < (2n * cents + 1n) * denominator) candidates.push(cents);
  }
  assert.equal(candidates.length, 1, "표시된 두 소수로 반올림한 몫은 하나");
  const cents = candidates[0];
  return `${cents / 100n}.${String(cents % 100n).padStart(2, "0")}`;
}

for (const [index, item] of review.sourceItems.entries()) {
  const id = `6-2-u2-e3-exploration-${index + 1}`;
  assert.equal(item.sourceItemId, id);
  const original = raw.find(entry => entry.sourceItemId === id);
  const publicType = types.find(entry => entry.sourceItemId === id);
  assert(original && publicType, `${id}: 원문과 분류표가 각각 있어야 함`);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.pdfPage, 20);
  assert.equal(original.printedPage, 22);
  assert.equal(original.answerContract, "rounded-quotient-hundredth");
  assert.equal(original.sourceVerified, true);
  assert.equal(publicType.commonTypeId, commonType);
  assert(!/빈칸|비 구하기/.test(publicType.typeLabel), `${id}: 뒤의 예제와 혼동하지 않음`);
  const locked = index === 2;
  assert.equal(publicType.reviewLocked, locked);
  assert.equal(Boolean(publicType.generatorKey), !locked);
  assert.equal(window.HSE_GENERATORS.generate({ ...publicType, reviewLocked: true }, 0, 0, 1), null, "잠금이 생성기보다 우선함");
  if (!locked) assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1).answer, item.independentRounded);
  assert.equal(roundedHundredth(item.dividend, item.divisor), item.independentRounded);
}
assert.equal(review.sourceItems[2].independentRounded, "0.90", "소수 둘째 자리 0을 보존");
assert.equal(review.officialAnswerEvidence, "not-available-for-this-item");
assert.equal(review.publicReleaseStatus, "partial");
assert.equal(review.sourceItems[2].handwritingAgrees, false);
assert.equal(raw.find(item => item.sourceItemId === review.sourceItems[2].sourceItemId).implementationStatus, "handwriting-conflict-locked");
console.log("6-2 탐구 3: 원문 세 소문항·정확한 반올림·두 유형 출제·필기 충돌 잠금 검사 통과");
