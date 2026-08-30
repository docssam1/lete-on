"use strict";

// Independent checks for the 11 verified source structures in 5-1 unit 1 exploration 1.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "5-1").units.find(item => item.id === "5-1-u1");
const sourceTypes = unit.subunits.flatMap(subunit => subunit.types);
const readyTypes = sourceTypes.filter(type => type.sourceItemId.startsWith("5-1-u1-e1-"));
const e2ReadyTypes = sourceTypes.filter(type => type.sourceItemId.startsWith("5-1-u1-e2-") && !type.reviewLocked);
const lockedTypes = sourceTypes.filter(type => type.reviewLocked);
const labels = ["①", "②", "③", "④"];
const fail = message => { throw new Error(message); };
const check = (condition, message) => { if (!condition) fail(message); };
const positiveInteger = value => Number.isInteger(value) && value > 0;
const attribute = (tag, name) => tag.match(new RegExp("\\b" + name + "=\"([^\"]*)\""))?.[1] || "";
const getTag = prompt => prompt.match(/<div class="equation"[^>]*data-mixed-kind="[^"]+"[^>]*>/)?.[0] || "";
const numbers = text => text.split(",").map(Number);
const groups = text => text.split(";").map(numbers);

check(sourceTypes.length === 44, `5-1 1단원은 44유형이어야 하나 ${sourceTypes.length}개입니다.`);
check(readyTypes.length === 11, `개념탐구 1 공개 유형은 11개여야 하나 ${readyTypes.length}개입니다.`);
check(e2ReadyTypes.length === 10, `개념탐구 2 공개 유형은 10개여야 하나 ${e2ReadyTypes.length}개입니다.`);
check(lockedTypes.length === 23, `단원 검수 대기 유형은 23개여야 하나 ${lockedTypes.length}개입니다.`);
check(readyTypes.every(type => api.generatorKey(type) === "mixedCalculationE1" && !type.reviewLocked), "개념탐구 1의 생성기 또는 잠금 상태가 다릅니다.");

function verify(kind, tag, generated, context) {
  const raw = attribute(tag, "data-values");
  if (kind === "e1-exploration-set") {
    const [calculation, blankData, joinData] = groups(raw);
    const [head, addend, multiplier, dividend, divisor, subtractor, outside, tail] = calculation;
    const calculationAnswer = head - (addend + multiplier * (dividend / divisor) - subtractor) * outside + tail;
    const [blankStart, blankAddend, blankFactor, blankDivisor, blankTarget] = blankData;
    const blankCandidates = Array.from({ length: 600 }, (_, index) => index + 1).filter(value => blankStart - (blankAddend + blankFactor * value) / blankDivisor === blankTarget);
    const [outerDividend, joinedAddend, outerDivisor, joinDividend, joinDivisor, joinMultiplier] = joinData;
    const joinedValue = joinDividend / joinDivisor * joinMultiplier;
    const joinedAnswer = (outerDividend / joinedValue + joinedAddend) / outerDivisor;
    const combinedExpression = `(${outerDividend} ÷ (${joinDividend} ÷ ${joinDivisor} × ${joinMultiplier}) + ${joinedAddend}) ÷ ${outerDivisor}`;
    const expected = `(1) ${calculationAnswer}, (2) ${blankCandidates[0]}, (3) ${combinedExpression} = ${joinedAnswer}`;
    check(positiveInteger(calculationAnswer), context + ": 첫 계산의 답이 자연수가 아닙니다.");
    check(blankCandidates.length === 1, context + ": 빈칸에 들어갈 자연수가 하나가 아닙니다.");
    check(positiveInteger(joinedValue) && positiveInteger(joinedAnswer), context + ": 두 식을 이은 계산 결과가 자연수가 아닙니다.");
    check(generated.answer === expected, context + ": 개념탐구의 세 답이 독립 계산 결과와 다릅니다.");
    return;
  }
  if (kind === "e1-order-compare") {
    const results = groups(raw).map(([head, addend, multiplier, dividend, divisor, tail]) => head - (addend + multiplier * (dividend / divisor)) + tail);
    check(results.every(positiveInteger) && new Set(results).size === 4, context + ": 네 계산 결과가 자연수이면서 서로 달라야 합니다.");
    const expected = results.map((value, index) => ({ value, label: labels[index] })).sort((left, right) => left.value - right.value).map(item => item.label).join(", ");
    check(generated.answer === expected, context + ": 결과 비교 순서가 다릅니다.");
    return;
  }
  if (kind === "e1-blank") {
    const [start, addend, factor, divisor, target] = numbers(raw);
    const candidates = Array.from({ length: 600 }, (_, index) => index + 1).filter(value => start - (addend + factor * value) / divisor === target);
    check(candidates.length === 1 && String(candidates[0]) === generated.answer, context + ": 빈칸 자연수 답이 하나가 아닙니다.");
    return;
  }
  if (kind === "e1-symbol-two") {
    const [first, second, third] = numbers(raw);
    const middle = first * second - first;
    check(positiveInteger(middle * third + third) && Number(generated.answer) === middle * third + third, context + ": 두 계산 약속의 값이 자연수가 아니거나 다릅니다.");
    return;
  }
  if (kind === "e1-sequence-choice") {
    const [left, right, factor, divisor, subtractor, tail] = numbers(raw);
    const finalValue = (left + right) * factor / divisor - subtractor + tail;
    const choices = [
      left + right * factor / divisor - subtractor + tail,
      (left + right) * (factor / divisor - subtractor) + tail,
      (left + right) * factor / divisor - (subtractor + tail)
    ];
    const correctIndex = Number(attribute(tag, "data-correct-index"));
    choices.splice(correctIndex, 0, finalValue);
    const matching = choices.map((value, index) => value === finalValue ? index : -1).filter(index => index >= 0);
    check(positiveInteger(finalValue) && matching.length === 1 && generated.answer === labels[matching[0]], context + ": 계산 순서에 맞는 식이 자연수가 아니거나 하나로 정해지지 않습니다.");
    return;
  }
  if (kind === "e1-four-calculations") {
    const [oneData, twoData, threeData, fourData] = groups(raw);
    const [base, inner, p, q, outside, u, v, tail] = oneData;
    const one = (base - (inner - p * q)) * outside - (u - v) * tail;
    const [a, b, c, d, e, f, g, h] = twoData;
    const two = a * b + c - (d - e) * f * g + h;
    const [m, n, div, s, scale, u2, v2] = threeData;
    const three = (m * n / div - s) * scale + u2 / v2;
    const [a2, b2, c2, d2, e2, f2, g2, h2] = fourData;
    const four = a2 / ((b2 - c2) * d2 + e2) + f2 - g2 * h2;
    check([one, two, three, four].every(positiveInteger) && generated.answer === `${one}, ${two}, ${three}, ${four}`, context + ": 네 계산 결과가 자연수가 아니거나 다릅니다.");
    return;
  }
  if (kind === "e1-double-blank") {
    const [firstDivisor, addend, secondDivisor, multiplier, target] = numbers(raw);
    const candidates = Array.from({ length: target * firstDivisor }, (_, index) => index + 1).filter(value => value / firstDivisor + (value + addend) / secondDivisor * multiplier === target);
    check(candidates.length === 1 && String(candidates[0]) === generated.answer, context + ": 같은 식을 만족하는 자연수 빈칸이 하나가 아닙니다.");
    return;
  }
  if (kind === "e1-inequality") {
    const [a, b, c, d, coefficient, right] = numbers(raw);
    const left = (a + b) * c - d;
    const candidates = Array.from({ length: Math.max(0, Math.floor((left - right - 1) / coefficient)) }, (_, index) => index + 1).filter(value => left - coefficient * value > right);
    const expected = candidates.reduce((sum, value) => sum + value, 0);
    check(candidates.length > 0 && positiveInteger(expected) && Number(generated.answer) === expected, context + ": 부등식을 만족하는 자연수의 합이 다릅니다.");
    return;
  }
  if (kind === "e1-symbol-rule") {
    const [first, second, third] = numbers(raw);
    const middle = (first + second) * first - second;
    check(positiveInteger(middle * third + middle) && Number(generated.answer) === middle * third + middle, context + ": 두 번째 계산 약속의 값이 자연수가 아니거나 다릅니다.");
    return;
  }
  if (kind === "e1-join-equations") {
    const [a, b, c, paid, addend, divisor] = numbers(raw);
    const first = a * b + c;
    const second = paid - first;
    const third = second + addend;
    const expected = third / divisor;
    check([first, second, third, expected].every(positiveInteger), context + ": 여러 등식을 잇는 중간값이 자연수가 아닙니다.");
    check(Number(generated.answer) === expected, context + ": 여러 등식을 이은 식의 값이 다릅니다.");
    return;
  }
  if (kind === "e1-three-natural") {
    const [product, sum] = numbers(raw);
    const candidates = [];
    for (let first = 1; first < sum; first += 1) {
      const third = sum - first;
      if (first >= third || product % (first * third) !== 0) continue;
      candidates.push({ first, second: product / (first * third), third });
    }
    check(candidates.length === 1, context + ": 세 자연수 조건을 만족하는 순서쌍이 하나가 아닙니다.");
    const item = candidates[0];
    const expected = item.third * item.third - (item.first + item.second) * item.second;
    check(positiveInteger(expected) && Number(generated.answer) === expected, context + ": 세 자연수 조건 뒤 혼합 계산식의 값이 자연수가 아니거나 다릅니다.");
    return;
  }
  fail(context + ": 알 수 없는 검산용 식 종류입니다: " + kind);
}

let generatedCount = 0;
for (const type of readyTypes) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 1000; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const context = `${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}`;
      check(generated?.prompt && generated.answer !== undefined && generated.solution, context + ": 문제·정답·풀이가 비었습니다.");
      check(!/NaN|undefined|Infinity/.test(`${generated.prompt} ${generated.answer} ${generated.solution}`), context + ": 잘못된 값이 노출됩니다.");
      const tag = getTag(generated.prompt);
      check(tag, context + ": 독립 검산용 계산 정보가 없습니다.");
      verify(attribute(tag, "data-mixed-kind"), tag, generated, context);
      generatedCount += 1;
    }
  }
}

console.log(`5-1 자연수의 혼합 계산 개념탐구 1 전용 감사 통과: 개념탐구 1 공개 11유형 · 단원 잠금 23유형 · ${generatedCount.toLocaleString()}회 독립 계산·전수 열거`);
