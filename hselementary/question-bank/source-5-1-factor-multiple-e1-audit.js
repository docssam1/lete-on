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
const e1 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e1-"));
const failures = [];
let checked = 0;

const fail = (type, difficulty, seed, message) => failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${message}`);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const divisors = number => range(1, number).filter(value => number % value === 0);
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
  if (type.variant === 0) {
    const [, numberText] = matchOrThrow(text, /(\d+)의 약수들을 모두 곱한 값/, "약수 곱");
    return { contract: "single-value", value: divisors(Number(numberText)).length / 2 };
  }
  if (type.variant === 1) {
    const [, fromText, toText, divisorText] = matchOrThrow(text, /(\d+) 이상 (\d+) 이하인 수 중 (\d+)의 배수/, "배수 개수");
    const [from, to, divisor] = [fromText, toText, divisorText].map(Number);
    return { contract: "single-value", value: Math.floor(to / divisor) - Math.floor((from - 1) / divisor) };
  }
  if (type.variant === 2) {
    const [, numberText] = matchOrThrow(text, /(\d+)의 약수 중 가장 큰 세 자리 수/, "세 자리 약수");
    const candidates = divisors(Number(numberText)).filter(value => value >= 100 && value <= 999);
    if (!candidates.length) throw new Error("세 자리 약수가 없습니다.");
    return { contract: "single-value", value: candidates.at(-1) };
  }
  if (type.variant === 3) {
    const [, baseText, divisorText] = matchOrThrow(text, /(\d+) \+ □가 (\d+)의 배수/, "더한 수의 배수");
    const upper = Number(text.match(/□는 10 이상 (\d+) 이하/)?.[1] || 99);
    const [base, divisor] = [baseText, divisorText].map(Number);
    return { contract: "single-value", value: range(10, upper).filter(value => (base + value) % divisor === 0).length };
  }
  if (type.variant === 4) {
    const [, dividendText, remainderText] = matchOrThrow(text, /나누어지는 수는 (\d+).*?나머지는 (\d+)/, "나머지와 나누는 수");
    const [dividend, remainder] = [dividendText, remainderText].map(Number);
    return { contract: "single-value", value: divisors(dividend - remainder).filter(value => value > remainder).length };
  }
  if (type.variant === 5) {
    const [, boundText, correctText, wrongText] = matchOrThrow(text, /(\d+)보다 작은 어떤 자연수.*?나누는 수가 (\d+)인 나눗셈.*?나누는 수가 (\d+)인 나눗셈/, "바뀐 몫과 나머지");
    const [bound, correctDivisor, wrongDivisor] = [boundText, correctText, wrongText].map(Number);
    const candidates = range(1, bound - 1).filter(number => {
      const quotient = Math.floor(number / correctDivisor);
      const remainder = number % correctDivisor;
      return Math.floor(number / wrongDivisor) === remainder && number % wrongDivisor === quotient;
    });
    if (candidates.length !== 1) throw new Error(`문제에서 계산한 답 후보가 ${candidates.length}개입니다.`);
    return { contract: "single-value", value: candidates[0] };
  }
  if (type.variant === 6) {
    const [, numberText] = matchOrThrow(text, /(\d+)의 약수가 되는 수/, "한 자리 약수");
    const number = Number(numberText);
    return { contract: "set", value: range(1, 9).filter(value => number % value === 0) };
  }
  if (type.variant === 7) {
    const [, targetText, divisorText] = matchOrThrow(text, /(\d+)에 가장 가까운 (\d+)의 배수/, "가까운 배수");
    const [target, divisor] = [targetText, divisorText].map(Number);
    const lower = Math.floor(target / divisor) * divisor;
    const upper = lower + divisor;
    if (target - lower === upper - target) throw new Error("가장 가까운 배수가 두 개입니다.");
    return { contract: "single-value", value: target - lower < upper - target ? lower : upper };
  }
  if (type.variant === 8) {
    const [, upperText] = matchOrThrow(text, /1부터 (\d+)까지의 자연수/, "카드 범위");
    const cardDivisors = [...text.matchAll(/(\d+)의 배수/g)].map(match => Number(match[1]));
    if (cardDivisors.length < 2) throw new Error("꺼낼 카드의 배수 조건이 부족합니다.");
    const value = range(1, Number(upperText)).filter(number => !cardDivisors.some(divisor => number % divisor === 0)).length;
    return { contract: "single-value", value };
  }
  if (type.variant === 9) {
    const [, dividendText, remainderText] = matchOrThrow(text, /나누어지는 수는 (\d+).*?나머지는 (\d+)/, "나머지와 나누는 수 모두 찾기");
    const [dividend, remainder] = [dividendText, remainderText].map(Number);
    return { contract: "set", value: divisors(dividend - remainder).filter(value => value > remainder) };
  }
  if (type.variant === 10) {
    const [, unitText, leftText, tensText, rightText] = matchOrThrow(text, /□(\d+) × (\d+) = (\d+)□ × (\d+)/, "같은 숫자 넣기");
    const [unit, leftMultiplier, rightTens, rightMultiplier] = [unitText, leftText, tensText, rightText].map(Number);
    const candidates = range(1, 9).filter(digit => (10 * digit + unit) * leftMultiplier === (10 * rightTens + digit) * rightMultiplier);
    if (candidates.length !== 1) throw new Error(`공통으로 들어갈 숫자가 ${candidates.length}개입니다.`);
    return { contract: "single-value", value: candidates[0] };
  }
  const [, fromText, toText, firstText, secondText] = matchOrThrow(text, /(\d+)부터 (\d+)까지의 자연수 중 (\d+)의 배수가 아닌 수의 개수와 (\d+)의 배수가 아닌 수의 개수의 차/, "배수가 아닌 수의 개수 차");
  const [from, to, firstDivisor, secondDivisor] = [fromText, toText, firstText, secondText].map(Number);
  const values = range(from, to);
  const firstCount = values.filter(value => value % firstDivisor !== 0).length;
  const secondCount = values.filter(value => value % secondDivisor !== 0).length;
  return { contract: "single-value", value: Math.abs(firstCount - secondCount) };
}

function verifyGenerated(type, generated) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  const visible = `${plainPrompt(generated.prompt)} ${generated.solution}`;
  if (/NaN|undefined|Infinity|\^|순열|조합|팩토리얼|⌊|⌋/.test(visible)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
  if (/\d+(?:을|를|이|가|으로|로)\b/.test(visible)) throw new Error("숫자 뒤 조사가 붙은 문장은 중립 표현으로 써야 합니다.");
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
    divisors(60).length / 2,
    range(1000, 9999).filter(value => value % 37 === 0).length,
    divisors(2002).filter(value => value >= 100 && value <= 999).at(-1),
    range(10, 99).filter(value => (5496 + value) % 11 === 0).length,
    divisors(240 - 6).filter(value => value > 6).length,
    range(1, 1999).filter(number => Math.floor(number / 76) === number % 67 && number % 76 === Math.floor(number / 67)),
    range(1, 9).filter(value => 784520 % value === 0),
    [Math.floor(10000 / 43) * 43, Math.ceil(10000 / 43) * 43].sort((a, b) => Math.abs(10000 - a) - Math.abs(10000 - b))[0],
    range(1, 50).filter(value => ![2, 3, 4, 5].some(divisor => value % divisor === 0)).length,
    divisors(181 - 6).filter(value => value > 6),
    range(1, 9).filter(digit => (10 * digit + 9) * 12 === (30 + digit) * 23),
    Math.abs(range(100, 200).filter(value => value % 3 !== 0).length - range(100, 200).filter(value => value % 5 !== 0).length)
  ];
  const expected = [6, 243, 286, 8, 8, [1697], [1, 2, 4, 5, 8], 10019, 14, [7, 25, 35, 175], [6], 12];
  sourceAnswers.forEach((value, index) => {
    const okay = Array.isArray(expected[index]) ? sameSet(value, expected[index]) : value === expected[index];
    if (!okay) failures.push(`원본 기준 ${index + 1}번의 독립 계산값이 다릅니다.`);
  });
}

if (types.length !== 96 || e1.length !== 12 || inventory.items.length !== 96) failures.push("5-1 2단원은 원문 96유형, 탐구 1은 12유형이어야 합니다.");
if (inventory.items.filter(item => item.sourceVerified).length !== 96 || inventory.items.filter(item => item.implementationStatus === "ready").length !== 12 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 84) failures.push("원본 확인·공개·잠금 수가 다릅니다.");
for (const type of types) if (!type.sourceVerified || (!type.reviewLocked && api.generatorKey(type) !== "factorMultipleE1") || (type.reviewLocked && api.generatorKey(type))) failures.push(`${type.id}: 원본·잠금·생성기 연결이 다릅니다.`);
verifyOriginalAnchors();

for (const type of e1) {
  for (const difficulty of [-1, 0, 1]) {
    const promptSamples = new Set();
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        verifyGenerated(type, generated);
        promptSamples.add(plainPrompt(generated.prompt));
        checked += 1;
      } catch (error) {
        fail(type, difficulty, seed,error.message);
      }
    }
    if (promptSamples.size < 2) failures.push(`${type.id} / 난이도 ${difficulty}: 유사문항 조건이 한 가지뿐입니다.`);
  }
  const difficultyPrompts = [-1, 0, 1].map(difficulty => plainPrompt(api.generate(type, 0, difficulty, 1, type.variant).prompt));
  if (new Set(difficultyPrompts).size !== 3) failures.push(`${type.id}: 세 난이도의 문제 조건이 같아서는 안 됩니다.`);
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 1 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 1 감사 통과: 원문 96유형 · 공개 12/잠금 84 · ${checked.toLocaleString()}회 문제 지문 독립 계산·단일 정답·답 형식·난이도 검사`);
