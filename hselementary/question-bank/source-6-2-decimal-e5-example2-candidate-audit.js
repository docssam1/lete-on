"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-example-2";
const review = require("./source-inventory/6-2-u2-e5-source-review.json").items.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator, "독립 검산된 실제 유형 연결");
assert.equal(window.HSE_GENERATORS.generate({ ...type, reviewLocked: true }, 0, 0, 1), null);
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };

const decimal = (value, places) => {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= places, `예상보다 많은 소수 자리: ${value}`);
  return BigInt(whole) * 10n ** BigInt(places) + BigInt(fraction.padEnd(places, "0"));
};

// 인쇄된 세 수치로 원문 답을 독립 계산한다.
assert.equal(decimal("348", 1) % decimal("17.4", 1), 0n);
assert.equal(decimal("348", 1) / decimal("17.4", 1), 20n);
assert.equal(decimal("1.2", 3) * 20n * 1480n / 1000n, 35520n);
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("휘발유 1.2L로 17.4km"));
assert(originalShape.prompt.includes("1L의 가격이 1480원"));
assert(originalShape.prompt.includes("348km를 가는 데"));
assert.equal(originalShape.answer, "35520원");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (let seed = 1; seed <= 40; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const easySample = item.prompt.match(/휘발유 1L로 ([\d.]+)km를 갑니다/);
    const sourceSample = item.prompt.match(/휘발유 ([\d.]+)L로 ([\d.]+)km를 갈 수 있는 자동차/);
    const price = item.prompt.match(/휘발유 1L의 가격이 (\d+)원/);
    const singleTrip = item.prompt.match(/이 자동차가 ([\d.]+)km를 가는 데/);
    const twoDayTrip = item.prompt.match(/첫날 ([\d.]+)km를, 다음 날 ([\d.]+)km를 갔다면/);
    assert(price, "휘발유 1L의 가격이 지문에 있음");
    assert.equal(Boolean(easySample), level === 0);
    assert.equal(Boolean(sourceSample), level !== 0);
    assert.equal(Boolean(singleTrip), level !== 2);
    assert.equal(Boolean(twoDayTrip), level === 2);
    const targetDistance = singleTrip ? decimal(singleTrip[1], 1) : decimal(twoDayTrip[1], 1) + decimal(twoDayTrip[2], 1);
    assert(targetDistance > 0n);
    const fuelNumerator = easySample
      ? targetDistance * 1000n
      : targetDistance * decimal(sourceSample[1], 3);
    const fuelDenominator = easySample ? decimal(easySample[1], 1) : decimal(sourceSample[2], 1);
    assert(fuelDenominator > 0n && fuelNumerator % fuelDenominator === 0n, "필요한 연료가 mL 단위로 정확히 정해짐");
    const neededFuelMl = fuelNumerator / fuelDenominator;
    const costNumerator = neededFuelMl * BigInt(price[1]);
    assert.equal(costNumerator % 1000n, 0n, "휘발유값이 정수 원 단위로 정해짐");
    const expected = `${costNumerator / 1000n}원`;
    assert.equal(item.answer, expected, "지문에서 독립 계산한 금액과 정답이 같음");
    assert(item.answerVisual.includes(expected), "풀이 표의 금액도 같음");
    assert(item.solution.includes("원/L"), "휘발유 가격의 단위가 풀이에 있음");
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    assert(!item.prompt.includes("source61-math-board"), "문제에는 풀이 표를 넣지 않음");
    checks += 1;
  }
}
assert.equal(checks, 360);
for (let variant = 0; variant < 3; variant += 1) {
  const source = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, variant);
  const hard = window.HSE_GENERATORS.generate(candidate, 0, 1, 1, variant);
  assert.notEqual(source.answer, hard.answer, "어려움은 기준 문제의 금액만 반복하지 않음");
}
console.log(`6-2 개념탐구 5 예제 5-2 원문 유형: 원문 35520원 독립 계산과 3난이도 × 3고정 묶음 × 40회 금액 검산 ${checks}회 통과`);
