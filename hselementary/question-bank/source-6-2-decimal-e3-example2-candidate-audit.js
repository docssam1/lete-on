"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const id = "6-2-u2-e3-example-2";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(type?.reviewLocked && !type.generatorKey);
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1), null, "검수 후보는 공개 출제되지 않음");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE3Example2" };

function exact(decimal) {
  const [whole, fraction = ""] = decimal.split(".");
  return { n: BigInt(whole + fraction), d: 10n ** BigInt(fraction.length) };
}

let checked = 0;
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const item = window.HSE_GENERATORS.generate(candidateType, 0, difficulty, seed, seed % 3);
  assert(item && item.sourceItemId === id && item.verifiedVariantCount === 3);
  const expression = item.prompt.match(/>(\d+)\.\<span class="source62-e3-digit-blank"[^>]*>□<\/span>(\d{2}) ÷ (\d+\.\d+)<\/span>/);
  const target = item.prompt.match(/나타내면 (\d+\.\d)이 됩니다/);
  assert(expression && target, "문제에 한 자리 빈칸·나누는 수·반올림 결과가 표시됨");
  const [, whole, suffix, divisorText] = expression;
  const divisor = exact(divisorText);
  const targetTenths = exact(target[1]);
  const shownRange = item.solution.match(/범위는 (\d+\.\d{2}) 이상 (\d+\.\d{2}) 미만/);
  assert(shownRange, "풀이에 반올림 범위가 보임");
  const lower = exact(shownRange[1]);
  const upper = exact(shownRange[2]);
  const matches = [];
  for (let digit = 0; digit <= 9; digit += 1) {
    const dividend = exact(`${whole}.${digit}${suffix}`);
    const quotientNumerator = dividend.n * divisor.d;
    const quotientDenominator = dividend.d * divisor.n;
    const roundedTenths = (20n * quotientNumerator + quotientDenominator) / (2n * quotientDenominator);
    const roundedMatch = roundedTenths * targetTenths.d === 10n * targetTenths.n;
    const rangeMatch = quotientNumerator * lower.d >= lower.n * quotientDenominator
      && quotientNumerator * upper.d < upper.n * quotientDenominator;
    assert.equal(rangeMatch, roundedMatch, "풀이에 쓴 반올림 범위와 독립 계산 일치");
    if (roundedMatch) matches.push(digit);
  }
  assert(matches.length > 0 && matches.length < 10, "답 후보가 있고 모든 숫자가 정답은 아님");
  assert.equal(Number(item.answer), matches.length, "문제에 보이는 조건을 따로 전수 계산한 개수");
  const marked = [...item.answerVisual.matchAll(/data-digit="(\d)" data-matches="yes"/g)].map(match => Number(match[1]));
  assert.deepEqual(marked, matches, "풀이 숫자판의 표시와 독립 계산 일치");
  assert(item.solution.includes(`${matches.length}개`) && item.answerVisual.includes(`모두 ${matches.length}개`));
  assert(!item.prompt.includes("data-matches="), "문제에는 답 표시가 없음");
  if (difficulty === 0 && item.verifiedPoolIndex === 0) {
    assert.deepEqual([whole, suffix, divisorText, target[1]], ["1", "68", "2.34", "0.8"], "원본 조건");
    assert.deepEqual(matches, [7, 8, 9], "원본 독립 계산");
  }
  checked += 1;
}
assert.equal(checked, 360);
console.log(`6-2 예제 3-2 잠금 후보 ${checked}회: 한 자리 숫자 전수 열거·답 그림 일치 검사 통과`);
