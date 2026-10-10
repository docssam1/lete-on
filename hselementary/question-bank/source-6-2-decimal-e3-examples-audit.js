"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-decimal-e3.js");

const raw = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e3-examples-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

function decimal(value) {
  assert(/^\d+(?:\.\d+)?$/.test(value), "양의 유한소수 문자열");
  const [whole, fractional = ""] = value.split(".");
  return { n: BigInt(whole + fractional), d: 10n ** BigInt(fractional.length) };
}

function divide(left, right) {
  assert(right.n !== 0n, "0으로 나눌 수 없음");
  return { n: left.n * right.d, d: left.d * right.n };
}

function formatRounded(value, places) {
  const scale = 10n ** BigInt(places);
  const rounded = (2n * scale * value.n + value.d) / (2n * value.d);
  return `${rounded / scale}.${String(rounded % scale).padStart(places, "0")}`;
}

assert.equal(review.examples.length, 4);
for (const [index, example] of review.examples.entries()) {
  const id = `6-2-u2-e3-example-${index + 1}`;
  assert.equal(example.sourceItemId, id);
  const source = raw.find(item => item.sourceItemId === id);
  const type = types.find(item => item.sourceItemId === id);
  assert(source && type, `${id}: 원본 문항과 공개 분류표가 연결됨`);
  assert.equal(source.ordinal, index + 1);
  assert.equal(source.pdfPage, 20);
  assert.equal(source.printedPage, 22);
  assert.equal(source.answerContract, example.answerContract);
  assert.equal(source.sourceVerified, true);
  assert.equal(type.reviewLocked, index === 2, `${id}: 조건 누락 예제만 잠금`);
  assert.equal(Boolean(type.generatorKey), index !== 2);
  assert.equal(window.HSE_GENERATORS.generate({ ...type, reviewLocked: true }, 0, 0, 1), null, `${id}: 잠금 상태는 생성 불가`);
}

const [first, second, third, fourth] = review.examples;
assert.equal(first.roundingPlaces, 100, "원문은 소수 100째 자리까지 반올림");
const quotientFirst = divide(decimal(first.dividend), decimal(first.divisor));
const roundedFirst = formatRounded(quotientFirst, first.roundingPlaces);
assert.equal(roundedFirst.split(".")[1].length, 100);
assert.equal(roundedFirst.split(".")[1].slice(-1), first.roundedLastDecimalDigit);
assert.match(raw.find(item => item.sourceItemId === first.sourceItemId).sourceShape, /100째/);
// Long division supplies a separate check for the repeating digits and the rounding carry.
let remainder = quotientFirst.n % quotientFirst.d;
const expansion = [];
for (let place = 0; place <= first.roundingPlaces; place += 1) {
  remainder *= 10n;
  expansion.push(String(remainder / quotientFirst.d));
  remainder %= quotientFirst.d;
}
assert.equal(expansion.slice(0, 3).join(""), first.unroundedRepeatingDigits);
assert(expansion.every((digit, index) => digit === first.unroundedRepeatingDigits[index % 3]));
const truncated = BigInt(String(quotientFirst.n / quotientFirst.d) + expansion.slice(0, 100).join(""));
const separatelyRounded = truncated + (Number(expansion[100]) >= 5 ? 1n : 0n);
assert.equal(separatelyRounded.toString(), roundedFirst.replace(".", ""));
assert.equal(roundedFirst, `1.${"270".repeat(33)}3`);
assert.equal(first.independentAnswer, "301");
assert.equal([...roundedFirst.replace(".", "")].reduce((sum, digit) => sum + Number(digit), 0), Number(first.independentAnswer));

const matchingDigits = [];
for (let digit = 0; digit <= 9; digit += 1) {
  const dividend = second.dividendPattern.replace("□", String(digit));
  if (formatRounded(divide(decimal(dividend), decimal(second.divisor)), 1) === second.targetRoundedTenth) matchingDigits.push(digit);
}
assert.deepEqual(matchingDigits, second.validDigits, "가능한 한 자리 숫자를 모두 열거");
assert.equal(matchingDigits.length, Number(second.independentAnswer));

const divisors = third.divisors.map(decimal);
for (const shared of ["0.1", "1", "7.5"]) {
  const quotientSizes = divisors.map(divisor => divide(decimal(shared), divisor));
  const largest = quotientSizes[2];
  const smallest = quotientSizes[1];
  assert(quotientSizes.every(value => value.n * largest.d <= largest.n * value.d), "가장 큰 몫의 나누는 수 확인");
  assert(quotientSizes.every(value => value.n * smallest.d >= smallest.n * value.d), "가장 작은 몫의 나누는 수 확인");
  assert.equal(formatRounded(divide(largest, smallest), 2), third.roundedFactor, "양수 공통값과 관계없이 같은 배수");
}
assert.throws(() => divide({ n: 0n, d: 1n }, { n: 0n, d: 1n }), /0으로 나눌 수 없음/, "공통 수 0일 때 배수는 정의되지 않음");
assert.equal(third.publicReleaseStatus, "source-condition-ambiguity-locked");
assert(/양수/.test(types.find(item => item.sourceItemId === third.sourceItemId).reviewReason));

const total = decimal(fourth.totalKg);
const capacity = decimal(fourth.capacityKg);
const minimumBags = (total.n * capacity.d + total.d * capacity.n - 1n) / (total.d * capacity.n);
assert.equal(minimumBags, BigInt(fourth.minimumBags), "용량을 넘지 않는 최소 봉지 수");
assert((minimumBags - 1n) * capacity.n * total.d < total.n * capacity.d, "봉지가 하나 적으면 용량 초과");
const perBag = divide(total, { n: minimumBags, d: 1n });
assert.equal(formatRounded(perBag, 3), fourth.independentAnswerKg);
assert(perBag.n * capacity.d <= capacity.n * perBag.d, "실제 봉지당 쌀은 용량 이하");

assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "partial");
console.log("6-2 탐구 3 예제 4문항: 원본별 계약·100째 자리·빈칸 전수 열거·양수 조건 잠금 검사 통과");
