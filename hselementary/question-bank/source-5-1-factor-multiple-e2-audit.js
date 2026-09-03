"use strict";

const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-2-factor-multiple.json"), "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u2");
const types = unit.subunits.flatMap(item => item.types);
const e2 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e2-"));
const failures = [];
let checked = 0;

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const divisors = number => range(1, number).filter(value => number % value === 0);
const commonDivisors = (left, right) => divisors(gcd(left, right));
const plainPrompt = prompt => prompt
  .replace(/<span hidden[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replaceAll(",", "")
  .replace(/\s+/g, " ")
  .trim();
const singleAnswer = answer => Number(String(answer).replaceAll(",", "").trim());
const setAnswer = answer => String(answer).split(",").map(value => Number(value.trim())).sort((a, b) => a - b);
const sameSet = (actual, expected) => actual.length === expected.length && actual.every((value, index) => value === [...expected].sort((a, b) => a - b)[index]);
const matchOrThrow = (text, pattern, label) => {
  const match = text.match(pattern);
  if (!match) throw new Error(`${label} 조건을 문제에서 읽을 수 없습니다.`);
  return match;
};

function expectedFromPrompt(type, prompt) {
  const text = plainPrompt(prompt);
  if (type.variant === 0 || type.variant === 1) {
    const [, leftText, rightText] = matchOrThrow(text, /두 수 (\d+) (\d+)의 공약수/, "공약수 모두 찾기");
    return { contract: "set", value: commonDivisors(Number(leftText), Number(rightText)) };
  }
  if (type.variant === 2) {
    const [, aText, bText, cText, dText] = matchOrThrow(text, /두 수 (\d+)×(\d+) (\d+)×(\d+)의 공약수/, "곱으로 나타낸 두 수의 공약수");
    return { contract: "set", value: commonDivisors(Number(aText) * Number(bText), Number(cText) * Number(dText)) };
  }
  if (type.variant === 3) {
    const [, baseText, targetText] = matchOrThrow(text, /두 수 (\d+) ㉠의 최대공약수는 (\d+).*?두 자리 자연수/, "최대공약수가 정해진 두 자리 수");
    const [base, target] = [baseText, targetText].map(Number);
    return { contract: "set", value: range(10, 99).filter(value => gcd(base, value) === target) };
  }
  if (type.variant === 4) {
    const [, leftText, rightText, countText] = matchOrThrow(text, /두 수 (\d+) (\d+)의 공약수 중 약수가 (\d+)개인 수/, "약수 개수가 정해진 공약수");
    const [left, right, divisorCount] = [leftText, rightText, countText].map(Number);
    const candidates = commonDivisors(left, right).filter(value => divisors(value).length === divisorCount);
    if (candidates.length !== 1) throw new Error(`조건을 만족하는 공약수가 ${candidates.length}개입니다.`);
    return { contract: "single-value", value: candidates[0] };
  }
  if (type.variant === 5) {
    const [, baseText, targetText, lowerText, forbiddenText] = matchOrThrow(text, /두 수 ㉠ (\d+)의 최대공약수는 (\d+).*?㉠은 (\d+)보다 크고 (\d+)의 배수가 아닙니다/, "최소 공약수 조건 수");
    const [base, target, lower, forbiddenMultiple] = [baseText, targetText, lowerText, forbiddenText].map(Number);
    const candidates = range(lower + 1, base * 3).filter(value => gcd(value, base) === target && value % forbiddenMultiple !== 0);
    if (!candidates.length) throw new Error("조건을 만족하는 자연수가 없습니다.");
    return { contract: "single-value", value: candidates[0] };
  }
  if (type.variant >= 6 && type.variant <= 8) {
    const [, leftText, rightText] = matchOrThrow(text, /두 수 (\d+) (\d+)의 공약수는 모두 몇 개/, "공약수 개수");
    return { contract: "single-value", value: commonDivisors(Number(leftText), Number(rightText)).length };
  }
  if (type.variant === 9) {
    const [, limitText, baseText] = matchOrThrow(text, /(\d+)보다 작은 자연수 ㉠ 중 두 수 (\d+) ㉠의 최대공약수가 1/, "서로소인 수 개수");
    const [limit, base] = [limitText, baseText].map(Number);
    return { contract: "single-value", value: range(1, limit - 1).filter(value => gcd(value, base) === 1).length };
  }
  if (type.variant === 10) {
    const [, baseText, targetText] = matchOrThrow(text, /두 수 (\d+) ㉠의 최대공약수는 (\d+).*?세 자리 자연수/, "가장 큰 세 자리 수");
    const [base, target] = [baseText, targetText].map(Number);
    const candidates = range(100, 999).filter(value => gcd(value, base) === target);
    if (!candidates.length) throw new Error("조건을 만족하는 세 자리 수가 없습니다.");
    return { contract: "single-value", value: candidates.at(-1) };
  }
  if (type.variant === 11) {
    const [, productText, targetText] = matchOrThrow(text, /두 수의 곱은 (\d+)이고 최대공약수는 (\d+)/, "순서 있는 두 수 쌍");
    const [product, target] = [productText, targetText].map(Number);
    const candidates = divisors(product).filter(first => first > product / first && gcd(first, product / first) === target);
    return { contract: "single-value", value: candidates.length };
  }
  if (type.variant === 12) {
    const [, firstText, remainderText, secondText, shortText, minimumText] = matchOrThrow(text, /나누어지는 수: (\d+) 나머지: (\d+).*?\(2\) (\d+)보다 (\d+) 큰 수는 ㉠의 배수.*?\(3\) ㉠은 (\d+)보다 큰 수/, "남거나 부족한 나눗셈");
    const [first, remainder, second, short, minimum] = [firstText, remainderText, secondText, shortText, minimumText].map(Number);
    return { contract: "set", value: commonDivisors(first - remainder, second + short).filter(value => value > minimum) };
  }
  const [, baseText, targetText] = matchOrThrow(text, /두 수 (\d+) ㉠의 최대공약수는 (\d+).*?두 자리 자연수 ㉠을 모두 더한 값/, "두 자리 수의 합");
  const [base, target] = [baseText, targetText].map(Number);
  return { contract: "single-value", value: range(10, 99).filter(value => gcd(base, value) === target).reduce((total, value) => total + value, 0) };
}

function verifyGenerated(type, generated) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  const visible = `${plainPrompt(generated.prompt)} ${generated.solution}`;
  if (/NaN|undefined|Infinity|\^|순열|조합|팩토리얼|소인수|\bx\b|\ba\b|\bb\b/.test(visible)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
  if (/\d+(?:을|를|이|가|으로|로|과|와|은|는)\b/.test(visible)) throw new Error("숫자 뒤 조사가 붙은 문장은 중립 표현으로 써야 합니다.");
  const expected = expectedFromPrompt(type, generated.prompt);
  const contract = inventory.resultContracts[type.sourceItemId];
  if (contract !== expected.contract) throw new Error(`답 형식 계약이 ${contract}이지만 계산 결과는 ${expected.contract}입니다.`);
  if (contract === "set") {
    if (!sameSet(setAnswer(generated.answer), expected.value)) throw new Error("보이는 문제에서 다시 계산한 여러 답과 정답이 다릅니다.");
  } else if (singleAnswer(generated.answer) !== expected.value) {
    throw new Error(`보이는 문제에서 다시 계산한 답 ${expected.value}과 정답 ${generated.answer}이 다릅니다.`);
  }
}

function verifyOriginalAnchors() {
  const sourceAnswers = [
    commonDivisors(120, 144),
    commonDivisors(72, 108),
    commonDivisors(12 * 15, 20 * 21),
    range(10, 99).filter(value => gcd(36, value) === 18),
    commonDivisors(72, 90).filter(value => divisors(value).length === 4),
    range(22, 1000).filter(value => gcd(value, 252) === 21 && value % 15 !== 0)[0],
    commonDivisors(18, 60).length,
    commonDivisors(90, 108).length,
    commonDivisors(72, 120).length,
    range(1, 199).filter(value => gcd(value, 24) === 1).length,
    range(100, 999).filter(value => gcd(value, 288) === 48).at(-1),
    divisors(100).filter(first => first > 100 / first && gcd(first, 100 / first) === 5).length,
    commonDivisors(137 - 2, 183 + 6).filter(value => value > 6),
    range(10, 99).filter(value => gcd(120, value) === 12).reduce((total, value) => total + value, 0)
  ];
  const expected = [
    [1, 2, 3, 4, 6, 8, 12, 24],
    [1, 2, 3, 4, 6, 9, 12, 18, 36],
    [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
    [18, 54, 90], [6], 147, 4, 6, 8, 67, 912, 1, [9, 27], 132
  ];
  sourceAnswers.forEach((value, index) => {
    const okay = Array.isArray(expected[index]) ? sameSet(value, expected[index]) : value === expected[index];
    if (!okay) failures.push(`원본 기준 ${index + 1}번의 독립 계산값이 다릅니다.`);
  });
}

if (types.length !== 96 || e2.length !== 14 || inventory.items.length !== 96) failures.push("5-1 2단원은 원문 96유형, 탐구 2는 14유형이어야 합니다.");
if (inventory.items.filter(item => item.implementationStatus === "ready").length !== 91 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 5) failures.push("공개 91유형, 잠금 5유형이어야 합니다.");
for (const type of types) if (!type.sourceVerified || (!type.reviewLocked && !["factorMultipleE1", "factorMultipleE2", "factorMultipleE3", "factorMultipleE4", "factorMultipleE5", "factorMultipleE6", "factorMultipleE7", "factorMultipleE8"].includes(api.generatorKey(type))) || (type.reviewLocked && api.generatorKey(type))) failures.push(`${type.id}: 원본·잠금·생성기 연결이 다릅니다.`);
verifyOriginalAnchors();

for (const type of e2) {
  for (const difficulty of [-1, 0, 1]) {
    const promptSamples = new Set();
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        verifyGenerated(type, generated);
        promptSamples.add(plainPrompt(generated.prompt));
        checked += 1;
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
    if (promptSamples.size < 2) failures.push(`${type.id} / 난이도 ${difficulty}: 유사문항 조건이 한 가지뿐입니다.`);
  }
  const difficultyPrompts = [-1, 0, 1].map(difficulty => plainPrompt(api.generate(type, 0, difficulty, 1, type.variant).prompt));
  if (new Set(difficultyPrompts).size !== 3) failures.push(`${type.id}: 세 난이도의 문제 조건이 같아서는 안 됩니다.`);
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 2 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 2 감사 통과: 원문 96유형 · 공개 91/잠금 5 · ${checked.toLocaleString()}회 문제 지문 독립 계산·단일 정답·답 형식·난이도 검사`);
