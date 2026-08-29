"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41MultiplicationTwo";
const variants = Array.from({ length: 11 }, (_, index) => index);
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u3-e2-exploration", 0, "곱셈 성질과 수 카드 활용"],
  ["4-1-u3-e2-example-2-1", 1, "같은 수를 묶어 곱셈을 간단히 계산하기"],
  ["4-1-u3-e2-example-2-2", 2, "곱셈 순서를 바꾸어 계산하기"],
  ["4-1-u3-e2-example-2-3", 3, "같은 수를 여러 번 곱한 결과의 일의 자리 찾기"],
  ["4-1-u3-e2-example-2-4", 4, "수 카드 곱의 최댓값과 최솟값"],
  ["4-1-u3-e2-mission-1", 5, "공통 인수를 묶어 곱셈식 계산"],
  ["4-1-u3-e2-mission-2", 6, "곱을 쉬운 수로 묶어 계산"],
  ["4-1-u3-e2-mission-3", 7, "큰 곱의 각 자리 숫자 합"],
  ["4-1-u3-e2-mission-4", 8, "곱의 차로 세 자리 수 찾기"],
  ["4-1-u3-e2-mission-5", 9, "수 카드로 만든 가장 큰 곱과 가장 작은 곱의 차 구하기"],
  ["4-1-u3-e2-mission-6", 10, "자리 조건을 만족하는 최대 곱"]
];

const sourceAnchors = {
  0: { repeatedDigit: 3, repeatCount: 299, multiplier: 299, digitSum: 1812, pairedFactors: [3125, 32], pairedProduct: 100000, cards: [1, 3, 4, 6, 8, 9], maximumFactors: [941, 863], maximumProduct: 812083 },
  1: { expressions: ["72×99", "87×72+72×13", "559×93-59×93", "71×79+26×71-71×95", "99999×22222+33333×33334"], answers: [7128, 7200, 46500, 710, 3333300000] },
  2: { expressions: ["488×25", "5×7×25×3×16", "28×75×15×6", "2×4×8×16×777×625×125×25×5"], answers: [12200, 42000, 189000, 7770000000000] },
  3: { bases: [23, 37], counts: [23, 37], answer: 9 },
  4: { cards: [2, 4, 5, 6, 7], maximumFactors: [652, 74], maximumProduct: 48248, minimumFactors: [467, 25], minimumProduct: 11675, rejectedPencilMaximumFactors: [642, 75], rejectedPencilMaximumProduct: 48150 },
  5: { expressions: ["39×54+66×39", "234×98-84×98", "3245×43-3245×28+649×25×3", "1999999×444444"], answers: [4680, 14700, 97350, 888887555556] },
  6: { expressions: ["250000×4000", "5×9×7×2", "888×125", "2048×50"], answers: [1000000000, 630, 111000, 102400] },
  7: { repeatedDigit: 2, repeatCount: 8, multiplier: 399999, product: "8888866577778", answer: 93 },
  8: { multipliers: [87, 78], difference: 2277, answer: 253 },
  9: { cards: [1, 3, 4, 7, 8], maximumFactors: [741, 83], maximumProduct: 61503, minimumFactors: [378, 14], minimumProduct: 5292, answer: 56211 },
  10: { digitSum: 19, lastThreeDigitProduct: 24, multiplier: 79, candidates: [7138, 7183, 7318, 7381, 7813, 7831, 8146, 8164, 8416, 8461, 8614, 8641, 9226, 9262, 9622], maximumNumber: 9622, answer: 760138 }
};

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function evidence(generated) {
  const marker = generated.prompt.match(/<span hidden\b[^>]*data-source41-kind="([^"]+)"[^>]*data-source41-payload="([^"]+)"[^>]*data-source41-expected="([^"]+)"[^>]*><\/span>/);
  assert(marker, "원문 근거 자료를 읽을 수 없습니다.");
  return {
    kind: marker[1],
    payload: JSON.parse(decodeURIComponent(marker[2])),
    expected: decodeURIComponent(marker[3])
  };
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function digitSum(value) {
  return [...String(value).replace(/\D/g, "")].reduce((sum, digit) => sum + Number(digit), 0);
}

function withoutThousandsSeparators(value) {
  return String(value).replace(/,(?=\d{3}(?:\D|$))/g, "");
}

function permutations(values) {
  const output = [];
  const visit = (chosen, remaining) => {
    if (!remaining.length) {
      output.push(chosen);
      return;
    }
    remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return output;
}

function cardExtremes(cards, leftLength) {
  const expressions = new Map();
  permutations(cards).forEach(arrangement => {
    let left = Number(arrangement.slice(0, leftLength).join(""));
    let right = Number(arrangement.slice(leftLength).join(""));
    if (leftLength === cards.length - leftLength && right > left) [left, right] = [right, left];
    expressions.set(`${left}×${right}`, { left, right, product: left * right });
  });
  const values = [...expressions.values()];
  const maximumProduct = Math.max(...values.map(item => item.product));
  const minimumProduct = Math.min(...values.map(item => item.product));
  const maxima = values.filter(item => item.product === maximumProduct);
  const minima = values.filter(item => item.product === minimumProduct);
  return { maximum: maxima[0], minimum: minima[0], maximumCount: maxima.length, minimumCount: minima.length };
}

function evaluateExpression(expression) {
  const terms = String(expression).replace(/,/g, "").split(/(?=[+-])|(?<=[+-])/);
  let total = 0n;
  let operator = "+";
  terms.forEach(term => {
    if (term === "+" || term === "-") {
      operator = term;
      return;
    }
    const value = term.split("×").reduce((product, factor) => product * BigInt(factor), 1n);
    total = operator === "+" ? total + value : total - value;
  });
  return total;
}

function powerOnesDigit(base, count) {
  let answer = 1;
  for (let index = 0; index < count; index += 1) answer = answer * (base % 10) % 10;
  return answer;
}

function candidatesForConditions(sum, product) {
  const output = [];
  for (let number = 1000; number <= 9999; number += 1) {
    const digits = String(number).split("").map(Number);
    if (digits.reduce((total, digit) => total + digit, 0) !== sum) continue;
    if (digits.slice(1).reduce((total, digit) => total * digit, 1) !== product) continue;
    output.push(number);
  }
  return output;
}

function independentAnswer(variant, payload) {
  if (variant === 0) {
    const repeatedProduct = BigInt(String(payload.repeatedDigit).repeat(payload.repeatCount)) * BigInt(payload.multiplier);
    const extremes = cardExtremes(payload.cards, 3);
    return `(1) ${digitSum(repeatedProduct)} / (2) ${payload.pairedFactors[0] * payload.pairedFactors[1]}, ㉠ / (3) ${extremes.maximum.left}×${extremes.maximum.right}=${extremes.maximum.product}`;
  }
  if (variant === 1 || variant === 5) return payload.expressions.map(evaluateExpression).map((value, index) => `(${index + 1}) ${value}`).join(" / ");
  if (variant === 2) return payload.factorLists.map(factors => factors.reduce((product, factor) => product * BigInt(factor), 1n)).map((value, index) => `(${index + 1}) ${value}`).join(" / ");
  if (variant === 3) return powerOnesDigit(payload.bases[0], payload.counts[0]) * powerOnesDigit(payload.bases[1], payload.counts[1]) % 10;
  if (variant === 4) {
    const extremes = cardExtremes(payload.cards, 3);
    return `가장 큰 곱 ${extremes.maximum.left}×${extremes.maximum.right}=${extremes.maximum.product} / 가장 작은 곱 ${extremes.minimum.left}×${extremes.minimum.right}=${extremes.minimum.product}`;
  }
  if (variant === 6) return payload.factorLists.map(factors => factors.reduce((product, factor) => product * factor, 1)).map((value, index) => `(${index + 1}) ${value}`).join(" / ");
  if (variant === 7) return digitSum(BigInt(String(payload.repeatedDigit).repeat(payload.repeatCount)) * BigInt(payload.multiplier));
  if (variant === 8) return payload.difference / (payload.multipliers[0] - payload.multipliers[1]);
  if (variant === 9) {
    const extremes = cardExtremes(payload.cards, 3);
    return extremes.maximum.product - extremes.minimum.product;
  }
  const candidates = candidatesForConditions(payload.digitSum, payload.lastThreeDigitProduct);
  return Math.max(...candidates) * payload.multiplier;
}

function auditPayload(variant, payload, generated) {
  const visible = visibleText(`${generated.prompt} ${generated.solution}`);
  assert(!/undefined|null|NaN|Infinity/.test(`${visible} ${generated.answer}`), `분기 ${variant}: 잘못된 값이 보입니다.`);
  assert(!/순열|조합|제곱|모듈러|mod\b/.test(visible), `분기 ${variant}: 초등 과정 밖 표현이 보입니다.`);
  assert(Number(payload.complexity) > 0, `분기 ${variant}: 난이도 자료가 없습니다.`);

  if (variant === 0) {
    assert(payload.reasonChoice === "㉠" && /까닭을 고르세요/.test(visible), "개념탐구의 설명형 답을 선택형 하나로 고정하지 못했습니다.");
    assert(payload.pairedFactors[0] * payload.pairedFactors[1] === payload.pairedProduct, "2와 5를 짝지은 곱이 다릅니다.");
    assert(payload.maximumCount === 1 && payload.maximum.left >= payload.maximum.right, "세 자리 수 곱의 답이 하나가 아니거나 큰 수가 앞에 있지 않습니다.");
  }
  if (variant === 1 || variant === 5) {
    const recalculated = payload.expressions.map(evaluateExpression).map(String);
    assert(JSON.stringify(recalculated) === JSON.stringify(payload.values), `분기 ${variant}: 식과 저장한 계산값이 다릅니다.`);
  }
  if (variant === 2) {
    const recalculated = payload.factorLists.map(factors => factors.reduce((product, factor) => product * BigInt(factor), 1n)).map(String);
    assert(JSON.stringify(recalculated) === JSON.stringify(payload.values), "곱하는 순서를 바꾼 식의 값이 다릅니다.");
    assert(payload.pairedZeros === [3, 6, 10][payload.level], "2와 5를 짝지어 만드는 10의 수가 다릅니다.");
  }
  if (variant === 3) assert(payload.onesDigits[0] === powerOnesDigit(payload.bases[0], payload.counts[0]) && payload.onesDigits[1] === powerOnesDigit(payload.bases[1], payload.counts[1]), "반복 곱의 일의 자리 자료가 다릅니다.");
  if (variant === 4 || variant === 9) {
    const extremes = cardExtremes(payload.cards, 3);
    assert(extremes.maximumCount === 1 && extremes.minimumCount === 1, `분기 ${variant}: 가장 큰 곱이나 가장 작은 곱이 여러 개입니다.`);
    assert(JSON.stringify(extremes.maximum) === JSON.stringify(payload.maximum) && JSON.stringify(extremes.minimum) === JSON.stringify(payload.minimum), `분기 ${variant}: 수 카드 전수검사 결과가 다릅니다.`);
  }
  if (variant === 6) assert(payload.factorLists.every((factors, index) => factors.reduce((product, factor) => product * factor, 1) === payload.values[index]), "쉬운 수끼리 묶은 식의 값이 다릅니다.");
  if (variant === 7) assert(String(BigInt(String(payload.repeatedDigit).repeat(payload.repeatCount)) * BigInt(payload.multiplier)) === payload.product, "큰 곱의 정확한 값이 다릅니다.");
  if (variant === 8) assert(Number.isInteger(payload.answer) && payload.answer >= 100 && payload.answer <= 999, "곱의 차로 찾는 수가 세 자리 자연수가 아닙니다.");
  if (variant === 10) {
    const candidates = candidatesForConditions(payload.digitSum, payload.lastThreeDigitProduct);
    assert(candidates.length === payload.candidateCount && JSON.stringify(candidates) === JSON.stringify(payload.candidates), "자리 조건을 만족하는 수의 전체 목록이 다릅니다.");
    assert(payload.maximumCount === 1 && Math.max(...candidates) === payload.maximumNumber, "가장 큰 네 자리 수가 하나가 아닙니다.");
  }
}

check(api.names.includes(generatorKey), "곱셈 응용 문제 전용 생성기가 등록되지 않았습니다.");
const groupItems = inventory.items.filter(item => item.unit === 3 && item.exploration === 2);
check(groupItems.length === 11, `곱셈 응용 문제 원문 항목은 11개여야 하나 ${groupItems.length}개입니다.`);

for (const [sourceItemId, variant, label] of sourceItems) {
  const item = groupItems.find(entry => entry.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(entry => entry.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceItemId);
  check(Boolean(item), `${sourceItemId}: 원문 목록에 없습니다.`);
  check(item?.typeLabel === label, `${sourceItemId}: 쉬운 한글 유형명이 달라졌습니다.`);
  check(item?.sourcePdfPage === (sourceItemId.includes("mission") ? 39 : 38), `${sourceItemId}: PDF 쪽수가 다릅니다.`);
  check(item?.sourcePrintedPage === (sourceItemId.includes("mission") ? 35 : 34), `${sourceItemId}: 교재 쪽수가 다릅니다.`);
  check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 분기가 연결되지 않았습니다.`);
  check(runtimeItem?.reviewLocked === false && runtimeItem?.generatorKey === generatorKey, `${sourceItemId}: 브라우저에서 공개되지 않았습니다.`);
}

check(nativeMappings.filter(mapping => mapping.generatorKey === generatorKey).length === 11, "곱셈 응용 문제 공개 매핑은 11개여야 합니다.");
check(runtimeInventory.verifiedMappings >= 160, `4-1 공개 유형이 곱셈 응용 문제 완료 기준 160개보다 줄었습니다: ${runtimeInventory.verifiedMappings}개`);

const sourceExplorationProduct = BigInt(String(sourceAnchors[0].repeatedDigit).repeat(sourceAnchors[0].repeatCount)) * BigInt(sourceAnchors[0].multiplier);
check(digitSum(sourceExplorationProduct) === sourceAnchors[0].digitSum, "원문 개념탐구의 긴 곱 자리합은 1812여야 합니다.");
check(sourceAnchors[0].pairedFactors[0] * sourceAnchors[0].pairedFactors[1] === sourceAnchors[0].pairedProduct, "원문 3125×32는 100000이어야 합니다.");
const sourceSixCard = cardExtremes(sourceAnchors[0].cards, 3);
check(sourceSixCard.maximumCount === 1 && sourceSixCard.maximum.left === 941 && sourceSixCard.maximum.right === 863 && sourceSixCard.maximum.product === 812083, "원문 여섯 수 카드의 가장 큰 곱이 다릅니다.");

for (const variant of [1, 2, 5, 6]) {
  const values = sourceAnchors[variant].expressions.map(evaluateExpression).map(Number);
  check(JSON.stringify(values) === JSON.stringify(sourceAnchors[variant].answers), `원문 분기 ${variant}의 식과 답이 다릅니다.`);
}
check(powerOnesDigit(23, 23) * powerOnesDigit(37, 37) % 10 === 9, "원문 23을 23번, 37을 37번 곱한 값의 일의 자리는 9여야 합니다.");
const sourceFiveCard = cardExtremes(sourceAnchors[4].cards, 3);
check(sourceFiveCard.maximumCount === 1 && sourceFiveCard.minimumCount === 1, "원문 예제 2-4의 가장 큰 곱과 가장 작은 곱이 각각 하나여야 합니다.");
check(sourceFiveCard.maximum.product === 48248 && sourceFiveCard.minimum.product === 11675, "원문 예제 2-4 수 카드 극값이 다릅니다.");
check(sourceAnchors[4].rejectedPencilMaximumProduct === 48150 && sourceAnchors[4].rejectedPencilMaximumProduct !== sourceFiveCard.maximum.product, "손글씨 오답 642×75를 거르지 못했습니다.");
check(String(BigInt(String(sourceAnchors[7].repeatedDigit).repeat(sourceAnchors[7].repeatCount)) * BigInt(sourceAnchors[7].multiplier)) === sourceAnchors[7].product && digitSum(sourceAnchors[7].product) === 93, "원문 Mission 3의 큰 곱과 자리합이 다릅니다.");
check(sourceAnchors[8].difference / (sourceAnchors[8].multipliers[0] - sourceAnchors[8].multipliers[1]) === 253, "원문 Mission 4의 세 자리 수는 253이어야 합니다.");
const sourceMissionFive = cardExtremes(sourceAnchors[9].cards, 3);
check(sourceMissionFive.maximum.product - sourceMissionFive.minimum.product === 56211, "원문 Mission 5의 두 곱의 차는 56211이어야 합니다.");
const sourceMissionSix = candidatesForConditions(sourceAnchors[10].digitSum, sourceAnchors[10].lastThreeDigitProduct);
check(JSON.stringify(sourceMissionSix) === JSON.stringify(sourceAnchors[10].candidates), "원문 Mission 6의 조건을 만족하는 15개 수가 다릅니다.");
check(Math.max(...sourceMissionSix) * sourceAnchors[10].multiplier === 760138, "원문 Mission 6의 가장 큰 곱은 760138이어야 합니다.");

const signatures = new Map();
const complexity = new Map();
for (const variant of variants) {
  for (const difficulty of difficulties) {
    const key = `${variant}:${difficulty}`;
    signatures.set(key, new Set());
    complexity.set(key, []);
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        generatedCount += 1;
        const proof = evidence(generated);
        assert(proof.expected === String(generated.answer), `분기 ${variant}: 숨은 기대답과 실제 답이 다릅니다.`);
        assert(JSON.stringify(proof.payload.sourceAnchor) === JSON.stringify(sourceAnchors[variant]), `분기 ${variant}: 원문 기준값이 바뀌었습니다.`);
        assert(withoutThousandsSeparators(independentAnswer(variant, proof.payload)) === withoutThousandsSeparators(generated.answer), `분기 ${variant}: 독립 계산값과 답이 다릅니다.`);
        auditPayload(variant, proof.payload, generated);
        signatures.get(key).add(JSON.stringify([proof.kind, proof.payload, generated.answer]));
        complexity.get(key).push(Number(proof.payload.complexity));
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
}

for (const variant of variants) {
  const minimumVariety = variant === 4 || variant === 9 ? 10 : 20;
  for (const difficulty of difficulties) check(signatures.get(`${variant}:${difficulty}`).size >= minimumVariety, `분기 ${variant} / 난이도 ${difficulty}: 문제 변화가 너무 적습니다.`);
  const low = complexity.get(`${variant}:-1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  const high = complexity.get(`${variant}:1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  check(high > low, `분기 ${variant}: 상 난이도의 조건 복잡도가 하보다 높지 않습니다.`);
}

if (failures.length) {
  console.error(`4-1 곱셈 응용 문제 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 곱셈 응용 문제 전용 감사 통과: 원문 11항목 · 공개 11 · ${generatedCount.toLocaleString()}회 독립 계산 · 수 카드 전수검사 · 네 자리 수 9000개 전수검사 · 손글씨 오답 차단`);
