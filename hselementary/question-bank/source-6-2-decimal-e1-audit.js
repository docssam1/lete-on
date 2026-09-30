"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const rawItems = require("./source-inventory/6-2-source-items.json").items;
const sourceIds = [
  "6-2-u2-e1-exploration-1",
  "6-2-u2-e1-exploration-2",
  "6-2-u2-e1-example-1",
  "6-2-u2-e1-example-2",
  "6-2-u2-e1-example-3",
  "6-2-u2-e1-example-4"
];
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2").units.find(item => item.id === "6-2-u2");
const types = unit.subunits.flatMap(item => item.types);
const marks = ["①", "②", "③", "④", "⑤", "⑥"];
const exploration = rawItems.find(item => item.sourceItemId === "6-2-u2-e1-exploration");
const example = rawItems.find(item => item.sourceItemId === "6-2-u2-e1-example-1");
assert.deepEqual(exploration.publicSourceItemIds, sourceIds.slice(0, 2), "복합 탐구와 공개 소문항 연결");
assert.equal(example.publicSourceItemId, sourceIds[2], "예제 출처 연결");
assert([exploration, example].every(item => item.sourceVerified && item.implementationStatus === "fixed-verified-pool"), "원자료 검수 상태");
for (const sourceId of sourceIds.slice(3)) {
  const item = rawItems.find(raw => raw.sourceItemId === sourceId);
  assert(item && item.publicSourceItemId === sourceId && item.sourceVerified && item.implementationStatus === "fixed-verified-pool", `${sourceId}: 원자료 연결`);
}

function fraction(text) {
  const [whole, part = ""] = text.split(".");
  return { n: BigInt(whole + part), d: 10n ** BigInt(part.length) };
}

function quotient(a, b) {
  const left = fraction(a);
  const right = fraction(b);
  return { n: left.n * right.d, d: left.d * right.n };
}

function same(a, b) {
  return a.n * b.d === b.n * a.d;
}

function product(a, b) {
  return { n: a.n * b.n, d: a.d * b.d };
}

function division(a, b) {
  return { n: a.n * b.d, d: a.d * b.n };
}

function expected(generated, sourceId) {
  if (sourceId.endsWith("exploration-1")) {
    const prompt = generated.prompt.match(/([\d.]+) ÷ ([\d.]+)와 몫/);
    const choices = [...generated.prompt.matchAll(/<li><span>([①-⑥])<\/span>([\d.]+) ÷ ([\d.]+)<\/li>/g)];
    assert(prompt && choices.length >= 3 && choices.length <= 6, "보기 구조 누락");
    const target = quotient(prompt[1], prompt[2]);
    const matching = choices.filter(choice => same(target, quotient(choice[2], choice[3])));
    assert.equal(matching.length, 1, "정답 보기가 하나가 아님");
    assert(choices.every((choice, index) => choice[1] === marks[index]), "보기 순서 오류");
    return matching[0][1];
  }
  if (sourceId.endsWith("exploration-2")) {
    const prompt = generated.prompt.match(/([\d.]+) ÷ ([\d.]+)을 계산/);
    assert(prompt, "계산식 누락");
    const answer = fraction(generated.answer);
    assert(same(quotient(prompt[1], prompt[2]), answer), "독립 소수 계산 불일치");
    return generated.answer;
  }
  if (sourceId.endsWith("example-2")) {
    const equations = [...generated.prompt.matchAll(/\([가나]\) ([\d.]+) ÷ [㉠㉡] = ([\d.]+)/g)];
    assert.equal(equations.length, 2, "두 나눗셈 누락");
    const first = quotient(equations[0][1], equations[0][2]);
    const second = quotient(equations[1][1], equations[1][2]);
    assert(same(division(first, second), fraction(generated.answer.replace("배", ""))), "나누는 수의 비가 틀림");
    return generated.answer;
  }
  if (sourceId.endsWith("example-3")) {
    const equations = [...generated.prompt.matchAll(/(?:가 × 나|나 × 다|가 × 다) = ([\d.]+)/g)];
    assert.equal(equations.length, 3, "세 곱셈 누락");
    const [ab, bc, ac] = equations.map(equation => fraction(equation[1]));
    const candidates = Array.from({ length: 100 }, (_, index) => fraction(String((index + 1) / 10)))
      .filter(b => same(product(product(b, b), ac), product(ab, bc)));
    assert.equal(candidates.length, 1, "가운데 수가 하나가 아님");
    assert(same(candidates[0], fraction(generated.answer)), "가운데 수 오답");
    return generated.answer;
  }
  if (sourceId.endsWith("example-4")) {
    const expression = generated.prompt.match(/(\d+) × ㉠ \+ (\d+) × ㉡ = (\d+)/);
    assert(expression, "자연수·소수 부분 식 누락");
    const [wholeFactor, partFactor, total] = expression.slice(1).map(Number);
    const restricted = generated.prompt.includes("0.5보다 큽니다");
    const candidates = [];
    for (let whole = 1; whole <= total / wholeFactor; whole += 1) {
      const remainder = total - wholeFactor * whole;
      if (remainder > 0 && remainder < partFactor && (!restricted || remainder * 2 > partFactor)) candidates.push({ whole, remainder });
    }
    assert.equal(candidates.length, 1, "자연수·소수 부분의 짝이 하나가 아님");
    const candidate = candidates[0];
    assert(same({ n: BigInt(candidate.whole * partFactor), d: BigInt(candidate.remainder) }, fraction(generated.answer)), "부분을 나눈 몫 오답");
    return generated.answer;
  }
  const expression = generated.prompt.match(/>([\d.]+) ÷ ([\d.]+) < □ < ([\d.]+) ÷ ([\d.]+)<\/div>/);
  assert(expression, "범위식 누락");
  const low = quotient(expression[1], expression[2]);
  const high = quotient(expression[3], expression[4]);
  const tenths = Array.from({ length: 100 }, (_, index) => index)
    .filter(index => BigInt(index) * low.d > low.n * 10n && BigInt(index) * high.d < high.n * 10n);
  assert(tenths.length > 0, "가능한 한 자리 소수 없음");
  const sum = tenths.reduce((total, value) => total + value, 0) / 10;
  return String(sum);
}

let checked = 0;
for (const sourceId of sourceIds) {
  const matching = types.filter(type => type.sourceItemId === sourceId);
  assert.equal(matching.length, 1, `${sourceId}: 유형 연결 수`);
  const type = matching[0];
  assert.equal(type.rawSourceItemId, sourceId.includes("exploration") ? exploration.sourceItemId : sourceId, "공개 유형의 원자료 연결");
  assert.equal(type.reviewLocked, false, `${sourceId}: 공개 상태`);
  assert.equal(type.verifiedVariantCount, 3, `${sourceId}: 묶음 수`);
  const prompts = new Set();
  const pools = new Set();
  for (const offset of [-1, 0, 1]) {
    for (let seed = 1; seed <= 120; seed += 1) {
      const generated = window.HSE_GENERATORS.generate(type, 0, offset, seed, seed % 3);
      assert(generated, `${sourceId}: 생성 결과 없음`);
      assert.equal(generated.sourceItemId, sourceId);
      assert.equal(generated.generationMode, "fixed-verified-pool");
      assert.equal(generated.answer, expected(generated, sourceId), `${sourceId} 난이도 ${offset} 시드 ${seed}`);
      if (sourceId.endsWith("example-4")) assert.equal(generated.prompt.includes("0.5보다 큽니다"), offset === 1, "어려움의 추가 조건 누락");
      if (sourceId.endsWith("example-2")) assert.equal(generated.prompt.includes("직접 구하지 않고"), offset === 1, "어려움의 비교 방법 누락");
      if (sourceId.endsWith("example-3")) {
        assert.equal(generated.prompt.includes("값을 각각 구하지 않고"), offset === 1, "어려움의 풀이 조건 누락");
        assert(!/\d+\.\d{8,}/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`), "풀이의 소수 표시 오류");
      }
      assert(generated.solution && generated.answerVisual && generated.answerVisual.includes(generated.answer), "풀이 또는 답 그림 누락");
      assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
      prompts.add(generated.prompt);
      pools.add(generated.verifiedPoolIndex);
      checked += 1;
    }
  }
  assert(prompts.size >= 3 && pools.size === 3, `${sourceId}: 3개 고정 묶음 누락`);
}
for (const type of types.filter(item => item.sourceItemId?.startsWith("6-2-u2-") && !sourceIds.includes(item.sourceItemId) && !/^6-2-u2-e1-mission-[1-6]$/.test(item.sourceItemId) && !["6-2-u2-e2-exploration", "6-2-u2-e2-example-1", "6-2-u2-e2-example-2", "6-2-u2-e2-example-3", "6-2-u2-e2-mission-1", "6-2-u2-e2-mission-2", "6-2-u2-e2-mission-3", "6-2-u2-e2-mission-5"].includes(item.sourceItemId))) {
  assert.equal(type.reviewLocked, true, `${type.sourceItemId}: 검수 전 유형 잠금 해제됨`);
}
console.log(`6-2 소수의 나눗셈 E1: ${sourceIds.length}유형, ${checked}건 독립 검산, 나머지 잠금 유지`);
