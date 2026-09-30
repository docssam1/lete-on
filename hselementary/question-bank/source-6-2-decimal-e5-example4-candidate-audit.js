"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-example-4";
const review = require("./source-inventory/6-2-u2-e5-source-review.json").items.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(type.reviewLocked && type.generatorKey === "", "공식 답 대조 전 실제 유형은 잠금 유지");
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1), null);
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };

const tenths = value => {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= 1, `거리의 자릿수가 예상과 다름: ${value}`);
  return BigInt(whole) * 10n + BigInt(fraction.padEnd(1, "0"));
};
const minutes = (hour, minute = "0") => BigInt(hour) * 60n + BigInt(minute);
const duration = value => `${value / 60n}시간${value % 60n ? ` ${value % 60n}분` : ""}`;
const km = value => `${value / 10n}${value % 10n ? `.${value % 10n}` : ""}km`;

// 인쇄 원문 수치만으로 계산하며, 필기 흔적은 답 근거에 포함하지 않는다.
assert.equal(tenths("20.1") * 60n / minutes("1", "30"), tenths("13.4"));
assert.equal((tenths("36") - tenths("13.4")) * minutes("2", "30") / 60n, tenths("56.5"));
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("1시간 30분 동안 20.1km를 흐르는 강"), "첫 고정 문항의 강물 조건은 인쇄 원문과 같음");
assert(originalShape.prompt.includes("1시간에 36km를 갑니다"), "첫 고정 문항의 배 조건은 인쇄 원문과 같음");
assert(originalShape.prompt.includes("반대 방향으로 56.5km를 가려면"), "첫 고정 문항의 목표 거리는 인쇄 원문과 같음");
assert.equal(originalShape.answer, "2시간 30분", "인쇄 원문에 대응하는 첫 고정 문항의 답");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (let seed = 1; seed <= 40; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const easyCurrent = item.prompt.match(/강물이 1시간에 ([\d.]+)km씩 흐릅니다/);
    const drift = item.prompt.match(/(\d+)시간(?: (\d+)분)? 동안 ([\d.]+)km를 흐르는 강/);
    const still = item.prompt.match(/흐르지 않는 물에서 이 배는 1시간에 ([\d.]+)km를 갑니다/);
    const downstream = item.prompt.match(/강물이 흐르는 방향으로 2시간 동안 ([\d.]+)km를 갔습니다/);
    const target = item.prompt.match(/강물이 흐르는 반대 방향으로 ([\d.]+)km를 가려면/);
    assert(target, "지문에서 거슬러 갈 거리를 읽을 수 있음");
    assert.equal(Boolean(easyCurrent), level === 0);
    assert.equal(Boolean(drift), level !== 0);
    assert.equal(Boolean(still), level !== 2);
    assert.equal(Boolean(downstream), level === 2);
    if (downstream) assert.notEqual(minutes(drift[1], drift[2]), 120n, "강물과 배의 관찰 시간이 구분됨");
    let current = easyCurrent ? tenths(easyCurrent[1]) : tenths(drift[3]) * 60n / minutes(drift[1], drift[2]);
    if (drift) assert.equal(tenths(drift[3]) * 60n % minutes(drift[1], drift[2]), 0n, "강물의 빠르기가 정확히 정해짐");
    let stillSpeed = still ? tenths(still[1]) : tenths(downstream[1]) * 60n / 120n - current;
    if (downstream) assert.equal(tenths(downstream[1]) * 60n % 120n, 0n, "하류 관찰에서 배의 빠르기가 정확히 정해짐");
    const upstream = stillSpeed - current;
    assert(current > 0n && upstream > 0n, "거슬러 가는 빠르기가 양수");
    const numerator = tenths(target[1]) * 60n;
    assert.equal(numerator % upstream, 0n, "걸린 시간이 분 단위로 하나만 정해짐");
    const expected = duration(numerator / upstream);
    assert.equal(item.answer, expected, "지문에서 독립 계산한 시간과 정답이 같음");
    assert(item.solution.includes(`÷ (${km(upstream)}/시간)`), "마지막 시간 계산식에 거리당 시간 단위가 있음");
    assert(item.answerVisual.includes(expected), "풀이 표의 시간도 같음");
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
console.log(`6-2 개념탐구 5 예제 5-4 잠금 후보: 원문 독립 계산과 3난이도 × 3고정 묶음 × 40회 검산 ${checks}회 통과`);
