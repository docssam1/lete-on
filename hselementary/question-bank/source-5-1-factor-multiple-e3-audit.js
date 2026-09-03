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
const e3 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e3-"));
const failures = [];
let checked = 0;

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const lcm = (left, right) => Math.abs(left * right) / gcd(left, right);
const plainPrompt = prompt => prompt
  .replace(/<span hidden[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const singleAnswer = answer => Number(String(answer).replaceAll(",", "").trim());
const setAnswer = answer => String(answer).split(",").map(value => Number(value.trim())).sort((a, b) => a - b);
const orderedAnswer = answer => String(answer).split(",").map(value => value.trim());
const sameValues = (actual, expected) => actual.length === expected.length && actual.every((value, index) => value === expected[index]);
const matchOrThrow = (text, pattern, label) => {
  const match = text.match(pattern);
  if (!match) throw new Error(`${label} 조건을 문제에서 읽을 수 없습니다.`);
  return match;
};
const nearestPositiveMultiple = (base, target) => {
  const quotient = Math.max(1, Math.floor(target / base));
  const candidates = [...new Set([quotient * base, (quotient + 1) * base])];
  const distance = Math.min(...candidates.map(value => Math.abs(value - target)));
  const winners = candidates.filter(value => Math.abs(value - target) === distance);
  if (winners.length !== 1) throw new Error("기준 수에 가장 가까운 수가 하나가 아닙니다.");
  return winners[0];
};

function expectedFromPrompt(type, prompt) {
  const text = plainPrompt(prompt);
  if (type.variant === 0) {
    const [, leftText, rightText, targetText] = matchOrThrow(text, /두 수 (\d+), (\d+)의 공배수 중 (\d+)에 가장 가까운/, "가장 가까운 공배수");
    const [left, right, target] = [leftText, rightText, targetText].map(Number);
    return { contract: "single-value", value: nearestPositiveMultiple(lcm(left, right), target) };
  }
  if (type.variant === 1 || type.variant === 10) {
    const [, baseText, targetText] = matchOrThrow(text, /두 수 (\d+), ㉠의 최소공배수가 (\d+)일 때/, "최소공배수 조건 수");
    const [base, target] = [baseText, targetText].map(Number);
    const values = range(1, target).filter(value => lcm(base, value) === target);
    return type.variant === 1 ? { contract: "single-value", value: values.length } : { contract: "set", value: values };
  }
  if (type.variant === 2 || type.variant === 7) {
    const [, leftText, rightText] = matchOrThrow(text, /두 수 (\d+), (\d+)의 공배수인 세 자리 자연수/, "세 자리 공배수");
    const base = lcm(Number(leftText), Number(rightText));
    const values = range(100, 999).filter(value => value % base === 0);
    if (!values.length) throw new Error("세 자리 공배수가 하나도 없어 원문 유형의 풀이 활동이 성립하지 않습니다.");
    return type.variant === 2 ? { contract: "single-value", value: values.length } : { contract: "single-value", value: values.reduce((total, value) => total + value, 0) };
  }
  if (type.variant === 3) {
    const [, firstText, firstGcdText, secondText, secondGcdText] = matchOrThrow(text, /㉠과 (\d+)의 최대공약수는 (\d+)이고, ㉠과 (\d+)의 최대공약수는 (\d+)/, "두 최대공약수 조건");
    const [first, firstGcd, second, secondGcd] = [firstText, firstGcdText, secondText, secondGcdText].map(Number);
    const values = range(1, lcm(first, second)).filter(value => gcd(value, first) === firstGcd && gcd(value, second) === secondGcd);
    if (!values.length) throw new Error("두 최대공약수 조건을 만족하는 자연수가 없습니다.");
    return { contract: "single-value", value: values[0] };
  }
  if (type.variant === 4 || type.variant === 8) {
    const [, multipleText, notMultipleText] = matchOrThrow(text, /세 자리 자연수 중 (\d+)의 배수이지만 (\d+)의 배수가 아닌 수/, "배수이지만 다른 배수가 아닌 수");
    const [multiple, notMultiple] = [multipleText, notMultipleText].map(Number);
    return { contract: "single-value", value: range(100, 999).filter(value => value % multiple === 0 && value % notMultiple !== 0).length };
  }
  if (type.variant === 5) {
    const [, lastText, nextText, nextNextText, divisorText] = matchOrThrow(text, /\((\d+), (\d+), (\d+)\)과 같이 연속한 세 수.*?합이 (\d+)의 배수/, "연속한 세 수 묶음");
    const [last, next, nextNext, divisor] = [lastText, nextText, nextNextText, divisorText].map(Number);
    if (next !== last + 1 || nextNext !== last + 2) throw new Error("마지막 묶음이 연속한 세 수가 아닙니다.");
    return { contract: "single-value", value: range(1, last).filter(start => (start + start + 1 + start + 2) % divisor === 0).length };
  }
  if (type.variant === 6) {
    const records = ["가", "나", "다", "라"].map(label => {
      const [, leftText, rightText] = matchOrThrow(text, new RegExp(`${label}: \\[(\\d+), (\\d+)\\]`), `${label} 최소공배수`);
      return { label, least: lcm(Number(leftText), Number(rightText)) };
    });
    if (new Set(records.map(record => record.least)).size !== 4) throw new Error("네 최소공배수가 모두 다르지 않습니다.");
    return { contract: "ordered", value: records.sort((first, second) => first.least - second.least).map(record => record.label) };
  }
  if (type.variant === 9) {
    const [, leftText, rightText, divisorText, targetText] = matchOrThrow(text, /두 수 (\d+), (\d+)의 공배수이면서 (\d+)로 나누어떨어지는 수 중 (\d+)에 가장 가까운/, "추가 조건이 있는 가장 가까운 공배수");
    const [left, right, divisor, target] = [leftText, rightText, divisorText, targetText].map(Number);
    return { contract: "single-value", value: nearestPositiveMultiple(lcm(lcm(left, right), divisor), target) };
  }
  const [, limitText, firstText, secondText] = matchOrThrow(text, /1부터 (\d+)까지의 자연수 중 (\d+)로도 나누어떨어지지 않고, (\d+)로도 나누어떨어지지 않는 수/, "어느 것으로도 나누어떨어지지 않는 수");
  const [limit, first, second] = [limitText, firstText, secondText].map(Number);
  return { contract: "single-value", value: range(1, limit).filter(value => value % first !== 0 && value % second !== 0).length };
}

function verifyGenerated(type, generated) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  if (!generated.prompt.includes("data-factor-multiple-e3-kind") || !generated.prompt.includes("data-result-contract")) throw new Error("문항 종류와 답 형식 표지가 없습니다.");
  const visible = `${plainPrompt(generated.prompt)} ${generated.solution}`;
  if (/NaN|undefined|Infinity|\$\{|\^|순열|조합|팩토리얼|소인수|제곱|포함배제|\bx\b|\ba\b|\bb\b/.test(visible)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
  if (/\d+(?:을|를|이|가|으로|로|과|와|은|는)\b/.test(visible)) throw new Error("숫자 뒤 조사가 붙은 문장은 중립 표현으로 써야 합니다.");
  const expected = expectedFromPrompt(type, generated.prompt);
  const contract = inventory.resultContracts[type.sourceItemId];
  if (contract !== expected.contract) throw new Error(`답 형식 계약이 ${contract}이지만 지문 계산 결과는 ${expected.contract}입니다.`);
  if (contract === "set") {
    if (!sameValues(setAnswer(generated.answer), expected.value)) throw new Error("지문에서 다시 계산한 여러 답과 저장된 답이 다릅니다.");
  } else if (contract === "ordered") {
    if (!sameValues(orderedAnswer(generated.answer), expected.value)) throw new Error("지문에서 다시 계산한 기호 순서와 저장된 답이 다릅니다.");
  } else if (singleAnswer(generated.answer) !== expected.value) {
    throw new Error(`지문에서 다시 계산한 답 ${expected.value}과 저장된 답 ${generated.answer}이 다릅니다.`);
  }
}

function verifyOriginalAnchors() {
  const sourceAnswers = [
    nearestPositiveMultiple(lcm(12, 42), 1000),
    range(1, 140).filter(value => lcm(28, value) === 140).length,
    range(100, 999).filter(value => value % lcm(24, 30) === 0).length,
    range(1, lcm(60, 63)).find(value => gcd(value, 60) === 15 && gcd(value, 63) === 21),
    range(100, 999).filter(value => value % 8 === 0 && value % 3 !== 0).length,
    range(1, 2019).filter(start => (start + start + 1 + start + 2) % 48 === 0).length,
    [[20, 30], [14, 16], [16, 40], [21, 35]].map((pair, index) => ({ label: ["가", "나", "다", "라"][index], least: lcm(...pair) })).sort((first, second) => first.least - second.least).map(record => record.label),
    range(100, 999).filter(value => value % lcm(24, 32) === 0).reduce((total, value) => total + value, 0),
    range(100, 999).filter(value => value % 9 === 0 && value % 5 !== 0).length,
    nearestPositiveMultiple(lcm(lcm(24, 36), 5), 1000),
    range(1, 315).filter(value => lcm(45, value) === 315),
    range(1, 1000).filter(value => value % 12 !== 0 && value % 15 !== 0).length
  ];
  const expected = [1008, 6, 8, 105, 75, 126, ["가", "다", "라", "나"], 5184, 80, 1080, [7, 21, 35, 63, 105, 315], 867];
  sourceAnswers.forEach((value, index) => {
    const okay = Array.isArray(value) ? sameValues(value, expected[index]) : value === expected[index];
    if (!okay) failures.push(`원본 기준 ${index + 1}번의 독립 계산값이 다릅니다.`);
  });
}

if (types.length !== 96 || e3.length !== 12 || inventory.items.length !== 96) failures.push("5-1 2단원은 원문 96유형, 탐구 3은 12유형이어야 합니다.");
if (inventory.items.filter(item => item.implementationStatus === "ready").length !== 91 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 5) failures.push("공개 91유형, 잠금 5유형이어야 합니다.");
for (const type of types) if (!type.sourceVerified || (!type.reviewLocked && !["factorMultipleE1", "factorMultipleE2", "factorMultipleE3", "factorMultipleE4", "factorMultipleE5", "factorMultipleE6", "factorMultipleE7", "factorMultipleE8"].includes(api.generatorKey(type))) || (type.reviewLocked && api.generatorKey(type))) failures.push(`${type.id}: 원본·잠금·생성기 연결이 다릅니다.`);
verifyOriginalAnchors();

for (const type of e3) {
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
    if (promptSamples.size < 3) failures.push(`${type.id} / 난이도 ${difficulty}: 한 시험지에 겹치지 않게 낼 서로 다른 조건이 세 가지보다 적습니다.`);
  }
  const difficultyPrompts = [-1, 0, 1].map(difficulty => plainPrompt(api.generate(type, 0, difficulty, 1, type.variant).prompt));
  if (new Set(difficultyPrompts).size !== 3) failures.push(`${type.id}: 세 난이도의 문제 조건이 같아서는 안 됩니다.`);
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 3 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 3 감사 통과: 원문 96유형 · 공개 91/잠금 5 · ${checked.toLocaleString()}회 지문 독립 계산·정답 유일성·답 형식·난이도 검사`);
