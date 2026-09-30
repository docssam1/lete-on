"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-example-1";
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
const tenthMm = (value, unit) => decimal(value, unit === "cm" ? 2 : 1);
const duration = value => `${value / 60n}시간${value % 60n ? ` ${value % 60n}분` : ""}`;

// 원문에서 인쇄된 길이와 타는 빠르기만 사용한다.
const originalBurned = tenthMm("23.5", "cm") - tenthMm("16.06", "cm");
assert.equal(originalBurned, tenthMm("74.4", "mm"));
assert.equal(originalBurned / tenthMm("0.8", "mm") * 5n, 465n);
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("5분에 0.8mm씩"));
assert(originalShape.prompt.includes("처음 길이는 23.5cm"));
assert(originalShape.prompt.includes("길이가 16.06cm로 줄어들 때까지"));
assert.equal(originalShape.answer, "7시간 45분");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (let seed = 1; seed <= 40; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const rate = item.prompt.match(/(\d+)분에 ([\d.]+)mm씩 일정하게 타는/);
    const initial = item.prompt.match(/처음 길이는 ([\d.]+)(mm|cm)입니다/);
    const remaining = item.prompt.match(/길이가 ([\d.]+)(mm|cm)로 줄어들 때까지/);
    const paused = item.prompt.match(/중간에 불을 (\d+)분 동안 꺼 두었고/);
    assert(rate && initial && remaining, "시간과 두 길이를 지문에서 읽을 수 있음");
    assert.equal(Boolean(paused), level === 2, "꺼 둔 시간은 어려움에만 있음");
    assert.equal(initial[2], level === 0 ? "mm" : "cm");
    assert.equal(remaining[2], initial[2]);
    const burned = tenthMm(initial[1], initial[2]) - tenthMm(remaining[1], remaining[2]);
    const step = tenthMm(rate[2], "mm");
    assert(burned > 0n && step > 0n && burned % step === 0n, "탄 길이에서 구간 수가 정확히 하나로 정해짐");
    const burningMinutes = burned / step * BigInt(rate[1]);
    const elapsedMinutes = burningMinutes + BigInt(paused?.[1] || "0");
    const expected = duration(elapsedMinutes);
    assert.equal(item.answer, expected, "지문에서 독립 계산한 시간과 정답이 같음");
    assert(item.answerVisual.includes(expected), "풀이 표의 시간도 같음");
    assert(item.solution.includes(`${burningMinutes}분`), "실제로 탄 시간이 풀이에 있음");
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    assert(!item.prompt.includes("source61-math-board"), "문제에는 풀이 표를 넣지 않음");
    checks += 1;
  }
}
assert.equal(checks, 360);
for (const difficulty of [-1, 0, 1]) {
  const answers = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant).answer);
  assert.equal(new Set(answers).size, 3, "같은 난이도의 세 묶음은 정답이 서로 다름");
}
console.log(`6-2 개념탐구 5 예제 5-1 잠금 후보: 원문 단위 환산과 3난이도 × 3고정 묶음 × 40회 독립 시간 검산 ${checks}회 통과`);
