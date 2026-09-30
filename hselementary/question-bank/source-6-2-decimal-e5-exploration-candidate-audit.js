"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-exploration-1";
const review = require("./source-inventory/6-2-u2-e5-source-review.json").items.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(type.reviewLocked && type.generatorKey === "", "공식 답 대조 전 실제 유형은 잠금 유지");
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1), null);
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };

const decimal = (value, places) => {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= places, `예상보다 많은 소수 자리: ${value}`);
  return BigInt(whole) * 10n ** BigInt(places) + BigInt(fraction.padEnd(places, "0"));
};
const duration = minutes => `${minutes / 60n}시간${minutes % 60n ? ` ${minutes % 60n}분` : ""}`;
const minutes = (hour, minute = "0") => BigInt(hour) * 60n + BigInt(minute);

// 인쇄 지문의 수치만 사용하고 손글씨 답은 제외한다.
assert.equal(decimal("276.3", 1) * 60n / minutes("4", "30"), decimal("61.4", 1));
assert.equal(decimal("27.63", 3) * 10n / decimal("0.15", 3), decimal("184.2", 1));
assert.equal(decimal("184.2", 1) * 60n / decimal("61.4", 1), 180n);
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("276.3km를 달리는 데 4시간 30분"));
assert(originalShape.prompt.includes("1km를 달릴 때 휘발유 0.15L"));
assert(originalShape.prompt.includes("휘발유 27.63L를 사용했습니다"));
assert.equal(originalShape.answer, "3시간");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (let seed = 1; seed <= 40; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const easySpeed = item.prompt.match(/1시간에 ([\d.]+)km를 달립니다/);
    const sample = item.prompt.match(/([\d.]+)km를 달리는 데 (\d+)시간(?: (\d+)분)?이 걸렸습니다/);
    const perKm = item.prompt.match(/1km를 달릴 때 휘발유 ([\d.]+)L를 씁니다/);
    const used = item.prompt.match(/휘발유 ([\d.]+)L를 사용했습니다/);
    const remaining = item.prompt.match(/다른 날 운행을 시작할 때는 휘발유가 ([\d.]+)L 있었고, 운행을 마친 뒤에는 ([\d.]+)L 남았습니다/);
    assert(item.prompt.includes("다른 날 운행"), "앞선 거리 관찰과 목표 운행을 구분");
    assert(perKm, "1km에 필요한 휘발유가 제시됨");
    assert.equal(Boolean(easySpeed), level === 0);
    assert.equal(Boolean(sample), level !== 0);
    assert.equal(Boolean(remaining), level === 2);
    assert.equal(Boolean(used), level !== 2);
    const speed = easySpeed ? decimal(easySpeed[1], 1) : decimal(sample[1], 1) * 60n / minutes(sample[2], sample[3]);
    if (sample) assert.equal(decimal(sample[1], 1) * 60n % minutes(sample[2], sample[3]), 0n, "1시간 거리 단일 값");
    const fuel = used ? decimal(used[1], 3) : decimal(remaining[1], 3) - decimal(remaining[2], 3);
    const perKmMl = decimal(perKm[1], 3);
    assert(fuel > 0n && perKmMl > 0n && speed > 0n, "거리와 빠르기 조건은 양수");
    if (remaining) {
      assert.equal(decimal(remaining[2], 3) % 10n, 0n, "어려움의 남은 휘발유는 소수 둘째 자리 안에서 표현");
      assert.equal(fuel % 10n, 0n, "어려움의 사용량도 소수 둘째 자리 안에서 표현");
    }
    assert.equal(fuel * 10n % perKmMl, 0n, "휘발유로 달린 거리가 정확히 정해짐");
    const distanceTenths = fuel * 10n / perKmMl;
    assert.equal(distanceTenths * 60n % speed, 0n, "걸린 시간이 분 단위로 정확히 정해짐");
    const expected = duration(distanceTenths * 60n / speed);
    assert.equal(item.answer, expected, "지문에서 독립 계산한 시간과 정답이 같음");
    assert(item.answerVisual.includes(expected), "풀이 표의 시간도 같음");
    assert(item.solution.includes("/km)"), "연료당 거리 단위가 풀이에 있음");
    assert(item.solution.includes("/시간)"), "거리당 시간 단위가 풀이에 있음");
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
  assert.notEqual(source.answer, hard.answer, "어려움은 기준 문제의 답만 반복하지 않음");
}
assert.equal(new Set([0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, 1, 1, variant).answer)).size, 3, "어려움 세 묶음의 답은 서로 다름");
console.log(`6-2 개념탐구 5 본문 잠금 후보: 원문 독립 계산과 3난이도 × 3고정 묶음 × 40회 검산 ${checks}회 통과`);
