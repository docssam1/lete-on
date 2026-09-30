"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const rawItems = require("./source-inventory/6-2-source-items.json").items;
const types = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2")
  .units.find(item => item.id === "6-2-u2").subunits.flatMap(item => item.types);
const ids = Array.from({ length: 6 }, (_, index) => `6-2-u2-e1-mission-${index + 1}`);

function rational(value) {
  const [whole, decimals = ""] = String(value).split(".");
  return { n: BigInt(whole + decimals), d: 10n ** BigInt(decimals.length) };
}
function multiply(a, b) { return { n: a.n * b.n, d: a.d * b.d }; }
function divide(a, b) { return { n: a.n * b.d, d: a.d * b.n }; }
function compare(a, b) {
  const difference = a.n * b.d - b.n * a.d;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}
function quotient(a, b) { return divide(rational(a), rational(b)); }
function expected(generated, index) {
  const prompt = generated.prompt;
  if (index === 1) {
    const target = prompt.match(/([\d.]+) ÷ ([\d.]+)보다 몫이 큰/);
    const options = [...prompt.matchAll(/<li><span>([㉠-㉥])<\/span>([\d.]+) ÷ ([\d.]+)<\/li>/g)];
    assert(target && options.length >= 5, "Mission 1 보기 구조");
    const base = quotient(target[1], target[2]);
    const larger = options.filter(option => compare(quotient(option[2], option[3]), base) > 0);
    assert.equal(larger.length, 3, "Mission 1 큰 몫의 수");
    return larger.map(option => option[1]).join(", ");
  }
  if (index === 2) {
    const lines = [...prompt.matchAll(/([\d.]+) ÷ ([\d.]+) &lt; □ &lt; ([\d.]+) ÷ ([\d.]+)/g)];
    assert.equal(lines.length, 2, "Mission 2 공통 범위 두 줄");
    return Array.from({ length: 100 }, (_, position) => position + 1).filter(value =>
      lines.every(line => compare(quotient(line[1], line[2]), rational(value)) < 0 &&
        compare(rational(value), quotient(line[3], line[4])) < 0)).length;
  }
  if (index === 3) {
    const range = prompt.match(/([\d.]+) ÷ ([\d.]+) &lt; ㉠ × ([\d.]+) &lt; ([\d.]+) ÷ ([\d.]+)/);
    assert(range, "Mission 3 곱셈 범위");
    return Array.from({ length: 100 }, (_, position) => ({ n: BigInt(position + 1), d: 10n }))
      .filter(value => compare(quotient(range[1], range[2]), multiply(value, rational(range[3]))) < 0 &&
        compare(multiply(value, rational(range[3])), quotient(range[4], range[5])) < 0).length;
  }
  if (index === 4) {
    const expression = prompt.match(/(\d)\.㉠(\d)㉡ ÷ ([\d.]+)/);
    assert(expression, "Mission 4 자리 구조");
    const pairs = [];
    for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) {
      const dividend = rational(`${expression[1]}.${a}${expression[2]}${b}`);
      const value = divide(dividend, rational(expression[3]));
      if (value.n * 100n % value.d === 0n && value.n * 10n % value.d !== 0n) pairs.push(`(${a}, ${b})`);
    }
    assert(pairs.length >= 1, "Mission 4 가능한 순서쌍");
    return pairs.join(", ");
  }
  const cards = [...prompt.matchAll(/class="source62-decimal-cards"[\s\S]*?<\/div>/g)];
  assert.equal(cards.length, 1, "숫자 카드 한 묶음");
  const digits = [...cards[0][0].matchAll(/<span>(\d)<\/span>/g)].map(match => Number(match[1]));
  if (index === 5) {
    assert.equal(digits.length, 7, "Mission 5 일곱 숫자 카드");
    let best = null;
    let maxima = 0;
    for (const a of digits) for (const b of digits) for (const c of digits)
      for (const d of digits) for (const e of digits) for (const f of digits) {
        if (new Set([a, b, c, d, e, f]).size !== 6) continue;
        const numerator = BigInt(100 * a + 10 * b + c);
        const denominator = BigInt(100 * d + 10 * e + f);
        if (denominator === 0n) continue;
        const candidate = { n: numerator, d: denominator };
        const order = best ? compare(candidate, best) : 1;
        if (order > 0) { best = candidate; maxima = 1; }
        else if (order === 0) maxima += 1;
      }
    assert.equal(maxima, 1, "Mission 5 최고 몫의 카드 배치");
    assert.equal(best.n % best.d, 0n, "Mission 5 자연수 몫");
    const shown = generated.answerVisual.match(/(\d)\.(\d)(\d) ÷ (\d)\.(\d)(\d) = (\d+)/);
    assert(shown, "Mission 5 답 그림의 카드 배치");
    const shownRatio = { n: BigInt(shown[1] + shown[2] + shown[3]), d: BigInt(shown[4] + shown[5] + shown[6]) };
    assert.equal(compare(shownRatio, best), 0, "Mission 5 답 그림이 최댓값과 다름");
    return Number(best.n / best.d);
  }
  assert.equal(digits.length, 5, "Mission 6 다섯 숫자 카드");
  const range = prompt.match(/([\d.]+) &lt; ㉠ × ([\d.]+) ÷ ([\d.]+) &lt; ([\d.]+)/);
  assert(range, "Mission 6 연산 범위");
  let count = 0;
  for (const a of digits) for (const b of digits) for (const c of digits) {
    if (new Set([a, b, c]).size !== 3) continue;
    const value = divide(multiply(rational(`${a}.${b}${c}`), rational(range[2])), rational(range[3]));
    if (compare(rational(range[1]), value) < 0 && compare(value, rational(range[4])) < 0) count += 1;
  }
  return count;
}

let checked = 0;
for (let index = 1; index <= 6; index += 1) {
  const id = ids[index - 1];
  const type = types.find(item => item.sourceItemId === id);
  const raw = rawItems.find(item => item.sourceItemId === id);
  assert(type && raw && !type.reviewLocked && raw.publicSourceItemId === id && raw.sourceVerified, `${id}: 원본 연결과 공개 상태`);
  assert.equal(type.rawSourceItemId, id, `${id}: 원자료 ID`);
  const prompts = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 30; seed += 1) {
    const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
    assert(generated && generated.generationMode === "fixed-verified-pool" && generated.sourceItemId === id, `${id}: 생성 계약`);
    assert.equal(String(generated.answer), String(expected(generated, index)), `${id} 난이도 ${difficulty} 시드 ${seed}: 독립 검산`);
    assert(generated.solution && generated.answerVisual?.includes(String(generated.answer)) && generated.answerVisual.includes(id), `${id}: 답 그림`);
    assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), `${id}: 표시 오류`);
    prompts.add(generated.prompt);
    checked += 1;
  }
  assert(prompts.size >= 3, `${id}: 고정 문항 3개`);
}
console.log(`6-2 소수의 나눗셈 Mission 6유형: ${checked}건 독립 열거·답 그림 검산 통과`);
