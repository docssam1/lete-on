"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e3-mission-2";
const review = require("./source-inventory/6-2-u2-e3-missions-source-review.json").missions[1];
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };
assert(!type.reviewLocked && type.generatorKey, "검수 완료한 유형만 생성기로 연결");
assert.equal(window.HSE_GENERATORS.generate({ ...type, reviewLocked: true }, 0, 0, 1), null, "잠금 속성이 생성보다 우선함");

function nextPermutation(values) {
  let pivot = values.length - 2;
  while (pivot >= 0 && values[pivot] >= values[pivot + 1]) pivot -= 1;
  if (pivot < 0) return false;
  let next = values.length - 1;
  while (values[next] <= values[pivot]) next -= 1;
  [values[pivot], values[next]] = [values[next], values[pivot]];
  for (let left = pivot + 1, right = values.length - 1; left < right; left += 1, right -= 1) {
    [values[left], values[right]] = [values[right], values[left]];
  }
  return true;
}

function independentBest(cards, level) {
  const order = [...cards].sort((left, right) => left - right);
  let best = null;
  let ties = 0;
  let inspected = 0;
  do {
    inspected += 1;
    if (level === 0 && order[0] !== Math.max(...cards)) continue;
    if (level === 2 && order[3] === Math.min(...cards)) continue;
    const numerator = BigInt(order[0] * 100 + order[1] * 10 + order[2]);
    const denominator = BigInt(order[3] * 100 + order[4] * 10 + order[5]);
    if (!best || numerator * best.denominator > best.numerator * denominator) {
      best = { numerator, denominator };
      ties = 1;
    } else if (numerator * best.denominator === best.numerator * denominator) ties += 1;
  } while (nextPermutation(order));
  assert.equal(inspected, 720, "카드 여섯 장의 모든 배치 확인");
  assert.equal(ties, 1, "가장 큰 몫의 배치가 하나");
  const roundedCents = (200n * best.numerator + best.denominator) / (2n * best.denominator);
  return {
    expression: `${best.numerator / 100n}.${String(best.numerator % 100n).padStart(2, "0")} ÷ ${best.denominator / 100n}.${String(best.denominator % 100n).padStart(2, "0")}`,
    answer: `${roundedCents / 100n}.${String(roundedCents % 100n).padStart(2, "0")}`
  };
}

const cardPools = [[2, 1, 5, 3, 7, 4], [1, 2, 4, 6, 7, 9], [2, 3, 4, 5, 7, 8]];
let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  const expected = independentBest(cardPools[variant], level);
  for (let seed = 1; seed <= 1; seed += 1) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.answer, expected.answer, "독립 BigInt 반올림과 같은 답");
    assert(item.answerVisual.includes(expected.expression), "풀이에 실제 최댓값 배열이 보임");
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    for (const digit of cardPools[variant]) assert(item.prompt.includes(`data-card-digit="${digit}"`), "카드가 빠짐없이 표시됨");
    assert.equal((item.prompt.match(/data-card-digit=/g) || []).length, 6, "카드 중복 없음");
    checks += 1;
  }
}
assert.equal(checks, 9);
assert.equal(review.candidateVerification.independentEnumerationChecks, checks);
console.log(`6-2 Mission 3-2: ${checks}개 서로 다른 조건 각각 720배열 독립 전수 검산 통과`);
