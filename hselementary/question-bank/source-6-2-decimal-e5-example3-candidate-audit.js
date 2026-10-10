"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-example-3";
const review = require("./source-inventory/6-2-u2-e5-source-review.json").items.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator, "독립 검산된 실제 유형 연결");
assert.equal(window.HSE_GENERATORS.generate({ ...type, reviewLocked: true }, 0, 0, 1), null);

const ml = text => {
  const [whole, fractional = ""] = text.split(".");
  return BigInt(whole) * 1000n + BigInt(fractional.padEnd(3, "0"));
};
const seconds = text => {
  const match = text.match(/^(?:(\d+)분(?: (\d+)초)?)|(?:(\d+)초)$/);
  assert(match, `시간 표기를 읽을 수 없음: ${text}`);
  return BigInt(match[3] || 0) + BigInt(match[1] || 0) * 60n + BigInt(match[2] || 0);
};
const duration = value => `${value / 60n}분${value % 60n ? ` ${value % 60n}초` : ""}`;

// 원본의 두 독립 계량값에서 1초당 유량과 답을 재계산한다.
assert.equal(ml("54.6") / seconds("3분 15초"), 280n);
assert.equal(ml("38.1") / seconds("2분 30초"), 254n);
assert.equal(ml("280.35") % (280n + 254n), 0n);
assert.equal(ml("280.35") / (280n + 254n), 525n);
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("㉮에서는 3분 15초 동안 54.6L"));
assert(originalShape.prompt.includes("㉯에서는 2분 30초 동안 38.1L"));
assert(originalShape.prompt.includes("함께 틀어 280.35L의 물"));
assert.equal(originalShape.answer, "8분 45초");
const hardShape = window.HSE_GENERATORS.generate(candidate, 0, 1, 1, 0);
assert.equal(ml("347.1") - ml("13.35"), 534n * 625n);
assert(hardShape.prompt.includes("처음에 13.35L의 물"));
assert(hardShape.prompt.includes("물통에 든 물이 347.1L에 이를 때까지"));
assert.equal(hardShape.answer, "10분 25초");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (let seed = 1; seed <= 40; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    assert(item.prompt.includes("각각 따로 틀어"), "두 측정이 독립임을 명시");
    const samples = item.prompt.match(/㉮에서는 (.+?) 동안 ([\d.]+)L, ㉯에서는 (.+?) 동안 ([\d.]+)L의 물/);
    assert(samples, "문항에서 두 수도꼭지의 양과 시간을 독립 추출");
    const [timeA, amountA, timeB, amountB] = [seconds(samples[1]), ml(samples[2]), seconds(samples[3]), ml(samples[4])];
    assert(timeA > 0n && timeB > 0n && amountA > 0n && amountB > 0n);
    assert.equal(amountA % timeA, 0n, "㉮ 초당 물의 양이 정확히 정해짐");
    assert.equal(amountB % timeB, 0n, "㉯ 초당 물의 양이 정확히 정해짐");
    const totalRate = amountA / timeA + amountB / timeB;
    const initial = item.prompt.match(/처음에 ([\d.]+)L의 물이 들어 있는 물통/);
    const final = item.prompt.match(/물통에 든 물이 ([\d.]+)L에 이를 때까지/);
    const emptyTarget = item.prompt.match(/함께 틀어 ([\d.]+)L의 물을 받으려면/);
    assert.equal(Boolean(initial), level === 2, "어려움에서만 처음 물 조건을 추가");
    assert.equal(Boolean(final), level === 2, "어려움에서 끝 물의 양을 명시");
    if (initial) assert(item.prompt.includes("몇 분 몇 초가 걸릴까요"), "처음 물이 있을 때 걸린 시간을 물음");
    const required = initial ? ml(final[1]) - ml(initial[1]) : ml(emptyTarget[1]);
    assert(required > 0n && totalRate > 0n && required % totalRate === 0n, "시간 답은 정확히 하나");
    if (initial) {
      assert.equal(ml(initial[1]) % totalRate, 0n, "처음 물을 채운 시간도 온전한 초 단위");
      assert.equal(ml(final[1]) % totalRate, 0n, "전체 물을 채운 시간도 온전한 초 단위");
    }
    const expected = duration(required / totalRate);
    assert.equal(item.answer, expected, "문항에서 재계산한 시간과 일치");
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert(item.answerVisual.includes(expected), "풀이 화면도 같은 시간 표시");
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
  assert.notEqual(source.answer, hard.answer, "어려움이 같은 묶음의 기준 문제와 다른 목표 시간을 사용함");
  assert.match(hard.prompt, /처음에 [\d.]+L의 물/, "어려움에만 처음 물 조건이 추가됨");
  const sourceTarget = ml(source.prompt.match(/함께 틀어 ([\d.]+)L의 물을 받으려면/)[1]);
  const hardStart = ml(hard.prompt.match(/처음에 ([\d.]+)L의 물/)[1]);
  const hardFinal = ml(hard.prompt.match(/물통에 든 물이 ([\d.]+)L에 이를 때까지/)[1]);
  assert.notEqual(sourceTarget, hardFinal - hardStart, "어려움이 기준 문제의 같은 나눗셈을 반복하지 않음");
}
console.log(`6-2 개념탐구 5 예제 5-3 원문 유형: 원문 8분 45초 독립 계산과 3난이도 × 3고정 묶음 × 40회 물량·시간 검산 ${checks}회 통과`);
