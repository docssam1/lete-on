"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-2";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json").missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator, "검수된 실제 유형 연결");
const candidate = type;

const decimal = (value, places) => {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= places, `소수 자리 초과: ${value}`);
  return BigInt(whole) * 10n ** BigInt(places) + BigInt(fraction.padEnd(places, "0"));
};
const ratio = (aDistance, aFuel, bDistance, bFuel) => {
  const numerator = bDistance * aFuel * 100n;
  const denominator = aDistance * bFuel;
  assert(denominator > 0n && numerator % denominator === 0n, "비교 결과가 소수 둘째 자리 이내로 정확히 정해짐");
  const hundredths = numerator / denominator;
  return `${hundredths / 100n}${hundredths % 100n ? `.${String(hundredths % 100n).padStart(2, "0").replace(/0$/, "")}` : ""}배`;
};

// 원본의 두 연료·거리 쌍에서 나 자동차 ÷ 가 자동차 순서를 지킨다.
assert.equal(decimal("30.24", 2) * 1000n / decimal("2.4", 3), 1260n);
assert.equal(decimal("72.45", 2) * 1000n / decimal("4.6", 3), 1575n);
assert.equal(ratio(decimal("30.24", 2), decimal("2.4", 3), decimal("72.45", 2), decimal("4.6", 3)), "1.25배");
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("가 자동차는 휘발유 2.4L로 30.24km"));
assert(originalShape.prompt.includes("나 자동차는 휘발유 4.6L로 72.45km"));
assert(originalShape.prompt.includes("나 자동차가 갈 수 있는 거리는 가 자동차가 갈 수 있는 거리의 몇 배"));
assert.equal(originalShape.answer, "1.25배");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const direct = item.prompt.match(/가 자동차는 휘발유 1L로 ([\d.]+)km를, 나 자동차는 휘발유 1L로 ([\d.]+)km를/);
    const a = item.prompt.match(/가 자동차는 휘발유 ([\d.]+)L로 ([\d.]+)km를/);
    const b = item.prompt.match(/나 자동차는 휘발유 ([\d.]+)L로 ([\d.]+)km를/);
    const bLegs = item.prompt.match(/나 자동차는 휘발유 ([\d.]+)L로 첫째 구간 ([\d.]+)km와 둘째 구간 ([\d.]+)km를/);
    assert.equal(Boolean(direct), level === 0);
    assert(a, "가 자동차의 연료·거리가 지문에 있음");
    assert.equal(Boolean(b), level !== 2);
    assert.equal(Boolean(bLegs), level === 2);
    const aDistance = direct ? decimal(direct[1], 2) : decimal(a[2], 2);
    const aFuel = direct ? 1000n : decimal(a[1], 3);
    const bDistance = direct ? decimal(direct[2], 2) : b ? decimal(b[2], 2)
      : decimal(bLegs[2], 2) + decimal(bLegs[3], 2);
    const bFuel = direct ? 1000n : decimal((b || bLegs)[1], 3);
    const expected = ratio(aDistance, aFuel, bDistance, bFuel);
    assert.equal(item.answer, expected, "지문에서 나 ÷ 가 순서로 독립 계산한 배수와 일치");
    assert(item.answerVisual.includes(expected));
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert(item.solution.includes("나 자동차의 1L당 거리를 가 자동차의 1L당 거리로 나누면"));
    if (level !== 0) assert(item.solution.includes("km/L"), "1L당 거리의 계산식에 단위가 있음");
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    checks += 1;
  }
  assert.deepEqual(
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant),
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 41, variant),
    "고정 묶음은 시드에 따라 바뀌지 않음"
  );
}
assert.equal(checks, 18);
for (let variant = 0; variant < 3; variant += 1) {
  const source = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, variant);
  const hard = window.HSE_GENERATORS.generate(candidate, 0, 1, 1, variant);
  assert.notEqual(source.answer, hard.answer, "어려움은 다른 거리와 비교 배수를 사용함");
}
assert.equal(new Set([0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, 0, 1, variant).answer)).size, 3,
  "같은 난이도의 세 고정 묶음은 답도 다르게 만듦");
console.log(`6-2 개념탐구 5 Mission 2 잠금 후보: 원문 1.25배와 3난이도 × 3고정 묶음 × 2시드 비교 순서 검산 ${checks}회 통과`);
