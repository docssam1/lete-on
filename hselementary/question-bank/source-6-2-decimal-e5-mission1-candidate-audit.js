"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-1";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json").missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator, "검수된 실제 유형 연결");
const candidate = type;

const hundredths = value => {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= 2, `거리의 자릿수 초과: ${value}`);
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
};
const roundedHours = (distance, speed) => {
  assert(distance > 0n && speed > 0n);
  const tenths = (distance * 20n + speed) / (speed * 2n);
  return `${tenths / 10n}.${tenths % 10n}시간`;
};

// 원본에서 66분을 시간으로 바꾼 뒤, 마지막 시간만 반올림한다.
assert.equal(hundredths("4.18") * 60n / 66n, hundredths("3.8"));
assert.equal(roundedHours(hundredths("45.29"), hundredths("3.8")), "11.9시간");
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("1시간 6분 동안 4.18km"));
assert(originalShape.prompt.includes("45.29km를 걸으면"));
assert(originalShape.prompt.includes("소수 첫째 자리"));
assert.equal(originalShape.answer, "11.9시간");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const directSpeed = item.prompt.match(/1시간에 ([\d.]+)km를 갑니다/);
    const measuredSpeed = item.prompt.match(/(\d+)시간 (\d+)분 동안 ([\d.]+)km를 갑니다/);
    assert.equal(Boolean(directSpeed), level === 0);
    assert.equal(Boolean(measuredSpeed), level !== 0);
    let speed;
    if (directSpeed) speed = hundredths(directSpeed[1]);
    else {
      const minutes = BigInt(measuredSpeed[1]) * 60n + BigInt(measuredSpeed[2]);
      assert.equal(hundredths(measuredSpeed[3]) * 60n % minutes, 0n, "1시간 거리 정확히 계산 가능");
      speed = hundredths(measuredSpeed[3]) * 60n / minutes;
    }
    const singleDistance = item.prompt.match(/같은 빠르기로 ([\d.]+)km를 걸으면/);
    const twoLegDistance = item.prompt.match(/첫째 구간 ([\d.]+)km와 둘째 구간 ([\d.]+)km/);
    assert.equal(Boolean(singleDistance), level !== 2);
    assert.equal(Boolean(twoLegDistance), level === 2);
    const distance = singleDistance ? hundredths(singleDistance[1])
      : hundredths(twoLegDistance[1]) + hundredths(twoLegDistance[2]);
    const expected = roundedHours(distance, speed);
    assert.equal(item.answer, expected, "지문으로 독립 계산한 반올림 시간과 일치");
    assert(item.answerVisual.includes(expected));
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert(item.solution.includes("소수 첫째 자리"));
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
  assert.notEqual(source.answer, hard.answer, "어려움은 다른 거리와 시간을 사용함");
}
console.log(`6-2 개념탐구 5 Mission 1 공개 유형: 원문 11.9시간과 3난이도 × 3고정 묶음 × 2시드 반올림 검산 ${checks}회 통과`);
