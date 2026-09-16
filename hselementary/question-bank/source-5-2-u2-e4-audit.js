"use strict";

global.window = {};
require("./source-inventory-5-2.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-e1.js");
const sourceE4 = require("./source-5-2-u2-e4.js");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const e4Ids = new Set(sourceE4.sourceItemIds);
const unit = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-2")
  ?.units.find(item => item.id === "5-2-u2");
const types = unit?.subunits.flatMap(subunit => subunit.types).filter(type => e4Ids.has(type.sourceItemId)) || [];
const expected = [
  "5-2-u2-e4-exploration",
  "5-2-u2-e4-example-1",
  "5-2-u2-e4-example-2",
  "5-2-u2-e4-example-3",
  "5-2-u2-e4-example-4",
  "5-2-u2-e4-mission-1",
  "5-2-u2-e4-mission-2",
  "5-2-u2-e4-mission-3",
  "5-2-u2-e4-mission-4",
  "5-2-u2-e4-mission-5",
  "5-2-u2-e4-mission-6"
];
const visualIds = new Set(["5-2-u2-e4-example-2", "5-2-u2-e4-mission-5"]);
let independentlyChecked = 0;
let generated = 0;

const gcd = (a, b) => {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
};
const F = (n, d = 1) => {
  const sign = d < 0 ? -1 : 1;
  const common = gcd(n, d);
  return { n: sign * n / common, d: Math.abs(d) / common };
};
const add = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const subtract = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const multiply = (a, b) => F(a.n * b.n, a.d * b.d);
const divide = (a, b) => F(a.n * b.d, a.d * b.n);
const compare = (a, b) => a.n * b.d - b.n * a.d;
const same = (a, b) => compare(a, b) === 0;
const mixedText = value => {
  if (value.d === 1) return String(value.n);
  const whole = Math.floor(value.n / value.d);
  const rest = value.n % value.d;
  return whole > 0 ? `${whole} ${rest}/${value.d}` : `${value.n}/${value.d}`;
};
const ints = (start, end) => Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);

// The audit deliberately repeats each source structure with plain rational arithmetic,
// rather than consulting the generator's private pools or proof values.
const truth = {
  "5-2-u2-e4-exploration": [
    [F(21, 36), F(35, 48), F(77, 90)],
    [F(2, 3), F(2, 5), F(2, 7)],
    [F(2, 3), F(2, 5), F(2, 9)]
  ].map(values => {
    let answer = null;
    for (let d = 1; d <= 120; d += 1) for (let n = 1; n <= 30000; n += 1) {
      if (gcd(n, d) !== 1) continue;
      const candidate = F(n, d);
      if (values.every(value => multiply(candidate, value).d === 1) && (!answer || compare(candidate, answer) < 0)) answer = candidate;
    }
    return mixedText(answer);
  }),
  "5-2-u2-e4-example-1": [
    [F(21, 4), F(2, 5), F(15, 2)],
    [F(17, 4), F(3, 7), F(17, 3)],
    [F(15, 4), F(5, 8), F(75, 11)]
  ].map(([width, part, partArea]) => {
    const height = divide(divide(partArea, part), width);
    return String(height.n * height.d);
  }),
  "5-2-u2-e4-example-2": [
    [F(22, 15), F(51, 10)], [F(7, 6), F(29, 6)], [F(13, 10), F(49, 10)]
  ].map(([start, end]) => mixedText(add(start, multiply(subtract(end, start), F(5, 8))))),
  "5-2-u2-e4-example-3": [20, 15, 10].map(limit => {
    const multiplier = F(42, 11);
    const a = ints(1, 80).filter(value => gcd(value, 7) === 1 && multiply(F(value, 7), multiplier).d === 1 && compare(multiply(F(value, 7), multiplier), F(limit)) < 0);
    const b = ints(1, 160).filter(value => gcd(33, value) === 1 && multiply(F(33, value), multiplier).d === 1 && compare(multiply(F(33, value), multiplier), F(limit)) < 0);
    return `가: ${a.join(", ")}, 나: ${b.join(", ")}`;
  }),
  "5-2-u2-e4-example-4": [
    [[3, 4, 5, 6, 7, 8, 9], F(1, 2)], [[2, 3, 4, 5, 6, 7, 8], F(1, 2)], [[3, 4, 5, 6, 7, 8, 9], F(1, 3)]
  ].map(([numbers, target]) => {
    const values = [];
    for (const n of numbers) for (const d of numbers) if (n < d && gcd(n, d) === 1) values.push(F(n, d));
    let count = 0;
    for (let left = 0; left < values.length; left += 1) for (let right = left + 1; right < values.length; right += 1) if (same(multiply(values[left], values[right]), target)) count += 1;
    return `${count}쌍`;
  }),
  "5-2-u2-e4-mission-1": [5, 6, 7].map(denominator => {
    const values = [1, 2, 3, 4].map(value => F(value, denominator));
    let best = null;
    for (const a of values) for (const b of values) for (const c of values) for (const d of values) {
      if (new Set([a, b, c, d]).size !== 4) continue;
      const value = add(subtract(a, multiply(b, c)), d);
      if (!best || compare(value, best) > 0) best = value;
    }
    return mixedText(best);
  }),
  "5-2-u2-e4-mission-2": [
    [[3, 7, 10], F(3, 7)], [[4, 5, 9], F(1, 3)], [[5, 8, 9], F(1, 3)]
  ].map(([denominators, target]) => {
    const triples = [];
    for (const a of ints(1, 9)) for (const b of ints(1, 9)) for (const c of ints(1, 9)) {
      if (a >= denominators[0] || b >= denominators[1] || c >= denominators[2]) continue;
      if (gcd(a, denominators[0]) !== 1 || gcd(b, denominators[1]) !== 1 || gcd(c, denominators[2]) !== 1) continue;
      if (same(multiply(multiply(F(a, denominators[0]), F(b, denominators[1])), F(c, denominators[2])), target)) triples.push([a, b, c]);
    }
    return String(100 * triples[0][0] + 10 * triples[0][1] + triples[0][2]);
  }),
  "5-2-u2-e4-mission-3": [
    [39, 13, F(8, 15)], [20, 5, F(3, 8)], [20, 4, F(7, 25)]
  ].map(([firstDenominator, secondNumerator, target]) => {
    const pairs = [];
    for (const a of ints(1, firstDenominator - 1)) for (const b of ints(secondNumerator + 1, 99)) {
      if (gcd(a, firstDenominator) !== 1 || gcd(secondNumerator, b) !== 1) continue;
      if (same(multiply(F(a, firstDenominator), F(secondNumerator, b)), target)) pairs.push([a, b]);
    }
    return String(pairs[0][0] + pairs[0][1]);
  }),
  "5-2-u2-e4-mission-4": [
    [7, F(2, 5), F(7, 2), 20], [8, F(3, 4), F(4), 24], [9, F(2, 3), F(9, 2), 20]
  ].map(([base, a, b, limit]) => {
    const values = ints(1, limit - 1).filter(value => multiply(multiply(add(F(1), F(value, base)), a), b).d === 1);
    return String(values.reduce((sum, value) => sum + value, 0));
  }),
  "5-2-u2-e4-mission-5": [
    [F(3, 7), F(7, 3)], [F(2, 5), F(13, 5)], [F(5, 6), F(19, 6)]
  ].map(([start, end]) => mixedText(add(start, multiply(subtract(end, start), F(3, 5))))),
  "5-2-u2-e4-mission-6": [
    [[F(5, 6), F(10, 3), F(15, 4)], F(9)], [[F(2, 3), F(2, 5), F(4, 5)], F(9)], [[F(3, 4), F(8, 3), F(5, 2)], F(31)]
  ].map(([values, target]) => {
    let step = null;
    for (let d = 1; d <= 80; d += 1) for (let n = 1; n <= 4000; n += 1) {
      if (gcd(n, d) !== 1) continue;
      const candidate = F(n, d);
      if (values.every(value => multiply(candidate, value).d === 1) && (!step || compare(candidate, step) < 0)) step = candidate;
    }
    const candidates = ints(1, 24).map(multiplier => multiply(step, F(multiplier)));
    return mixedText(candidates.reduce((best, candidate) => {
      const candidateDistance = Math.abs(candidate.n * target.d - target.n * candidate.d) / (candidate.d * target.d);
      const bestDistance = Math.abs(best.n * target.d - target.n * best.d) / (best.d * target.d);
      return candidateDistance < bestDistance ? candidate : best;
    }));
  })
};

check(types.length === 11, `개념탐구 4 공개 유형은 11개여야 하나 ${types.length}개입니다.`);
check(sourceE4.sourceItemIds.length === 11, `생성기 원문 ID는 11개여야 하나 ${sourceE4.sourceItemIds.length}개입니다.`);
check(new Set(sourceE4.sourceItemIds).size === 11, "개념탐구 4 원문 ID가 중복됩니다.");
check(expected.every(id => e4Ids.has(id)), "개념탐구 4의 개념·예제·Mission 원문 ID가 빠졌습니다.");

for (const type of types) {
  check(!type.reviewLocked, `${type.sourceItemId}: 공개 상태가 아닙니다.`);
  check(type.generatorKey === sourceE4.generatorKey, `${type.sourceItemId}: 전용 생성기 키가 다릅니다.`);
  check(window.HSE_GENERATORS.generatorKey(type) === sourceE4.generatorKey, `${type.sourceItemId}: 런타임 생성기가 연결되지 않았습니다.`);
  check(type.generationMode === "fixed-verified-pool", `${type.sourceItemId}: 고정 검증 변형 계약이 아닙니다.`);
  check(type.verifiedVariantCount === 3, `${type.sourceItemId}: 검증 변형 수가 3개가 아닙니다.`);
  check(type.problemVisualRequired === true, `${type.sourceItemId}: 문제 시각 계약이 없습니다.`);
  check(type.answerVisualRequired === visualIds.has(type.sourceItemId), `${type.sourceItemId}: 정답 그림 계약이 원문 그림 필요 여부와 다릅니다.`);

  for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
    const verified = sourceE4.verify(type.sourceItemId, poolIndex);
    independentlyChecked += 1;
    check(verified?.candidateCount === 1, `${type.sourceItemId}/${poolIndex}: 독립 계산의 답 후보 수가 1이 아닙니다.`);
    check(Boolean(String(verified?.answer || "").trim()), `${type.sourceItemId}/${poolIndex}: 독립 계산 답이 비었습니다.`);
    check(verified?.answer === truth[type.sourceItemId]?.[poolIndex], `${type.sourceItemId}/${poolIndex}: 별도 전수 계산 답 ${truth[type.sourceItemId]?.[poolIndex]}과 생성기 답 ${verified?.answer}이 다릅니다.`);
    if (type.sourceItemId === "5-2-u2-e4-mission-6" && poolIndex === 0) check(verified.answer === "9 3/5", "Mission 6 원문형 답은 9 3/5여야 합니다.");
    if (type.sourceItemId === "5-2-u2-e4-mission-5" && poolIndex === 0) check(verified.answer === "1 4/7", "Mission 5 원문형 답은 대분수 1 4/7이어야 합니다.");
    if (type.sourceItemId === "5-2-u2-e4-example-3" && poolIndex === 0) check(verified.answer === "가: 11, 22, 33, 나: 7, 14", "예제 4-3은 원문 조건의 가능한 값 전체를 답으로 유지해야 합니다.");
  }

  const observedPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 36; seed += 1) {
      let item;
      try {
        item = window.HSE_GENERATORS.generate(type, 0, difficulty, 8524000 + seed, type.variant || 0);
      } catch (error) {
        failures.push(`${type.sourceItemId}/${difficulty}/${seed}: 생성 실패 ${error.message}`);
        break;
      }
      generated += 1;
      const visible = `${item?.prompt || ""} ${item?.answer || ""} ${item?.solution || ""} ${item?.answerVisual || ""}`;
      check(item?.sourceItemId === type.sourceItemId, `${type.sourceItemId}/${difficulty}/${seed}: 원문 ID가 달라졌습니다.`);
      check(item?.generationMode === "fixed-verified-pool" && item?.verifiedVariantCount === 3, `${type.sourceItemId}/${difficulty}/${seed}: 고정 검증 변형 연결이 다릅니다.`);
      check(Number.isInteger(item?.verifiedPoolIndex), `${type.sourceItemId}/${difficulty}/${seed}: 검증 변형 번호가 없습니다.`);
      check(/data-answer-candidate-count="1"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 단일 정답 증거가 없습니다.`);
      check(!/undefined|null|NaN|Infinity|SyntaxError|\$\{/.test(visible), `${type.sourceItemId}/${difficulty}/${seed}: 깨진 값이 보입니다.`);
      check(/math-fraction/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 분수 수식이 중앙 수식 마크업으로 나오지 않습니다.`);
      check(/source52-(equation|card-row|number-line)/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 얇은 검정선 기반의 원문형 시각 요소가 없습니다.`);
      if (type.sourceItemId === "5-2-u2-e4-example-1") {
        check((String(item?.prompt || "").match(/aria-label="나분의 가"/g) || []).length >= 2 && /가×나/.test(item.prompt), `${type.sourceItemId}/${difficulty}/${seed}: 원문에서 숨긴 세로 가/나가 문제에 그대로 유지되지 않았습니다.`);
      }
      if (visualIds.has(type.sourceItemId)) {
        check(/<svg\b/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 수직선 또는 격자 SVG가 없습니다.`);
        check(/data-(grid|line)-parts="[0-9]+"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 수직선 등분 데이터가 없습니다.`);
        if (type.sourceItemId === "5-2-u2-e4-mission-5") {
          const partMatch = String(item?.prompt || "").match(/data-line-parts="(\d+)"/);
          const intervalCount = (String(item?.prompt || "").match(/data-equal-interval="\d+"/g) || []).length;
          check(Boolean(partMatch) && intervalCount === Number(partMatch[1]) && new RegExp(`data-equal-interval-count="${partMatch?.[1] || ""}"`).test(item.prompt), `${type.sourceItemId}/${difficulty}/${seed}: 원본의 같은 간격 호 표시 수가 등분 수와 다릅니다.`);
        }
        check(Boolean(item?.answerVisual) && /data-answer-source="5-2-u2-e4-/.test(item.answerVisual), `${type.sourceItemId}/${difficulty}/${seed}: 정답 그림의 출처·그림 연결이 없습니다.`);
      } else {
        check(!item?.answerVisual, `${type.sourceItemId}/${difficulty}/${seed}: 답에 필요 없는 그림이 섞였습니다.`);
      }
      observedPools.add(item?.verifiedPoolIndex);
    }
  }
  check(observedPools.size === 3, `${type.sourceItemId}: 난이도별 다중 시드에서 세 검증 변형을 모두 만나지 못했습니다.`);
}

if (failures.length) {
  console.error(`5-2 2단원 개념탐구 4 원문형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-2 2단원 개념탐구 4 원문형 감사 통과: 11유형 공개 · 독립 전수 계산 ${independentlyChecked}개 · 난이도별 다중 시드 ${generated.toLocaleString()}회 · 수직선/격자 시각 계약 통과`);
