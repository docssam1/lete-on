"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41DivisionFour";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u3-e4-exploration", 0, "찢어진 나눗셈에서 나누어지는 수 찾기"],
  ["4-1-u3-e4-example-4-1", 1, "곱과 몫이 세 자리인 수 세기"],
  ["4-1-u3-e4-example-4-2", 2, "두 곱이 같도록 빈칸 숫자 찾기"],
  ["4-1-u3-e4-example-4-3", 3, "두 몫과 자리 숫자의 합으로 수 찾기"],
  ["4-1-u3-e4-example-4-4", 4, "연속한 자연수의 합으로 첫 수 찾기"],
  ["4-1-u3-e4-mission-1", 5, "주어진 수에 가장 가까운 곱 만들기"],
  ["4-1-u3-e4-mission-2", 6, "곱셈 조건을 만족하는 수 세기"],
  ["4-1-u3-e4-mission-3", 7, "수 카드 최대 나눗셈의 몫 비교"],
  ["4-1-u3-e4-mission-4", 8, "계산 관계를 이용해 네 수의 곱 구하기"],
  ["4-1-u3-e4-mission-5", 9, "몫과 나머지가 같은 세 자리 수"],
  ["4-1-u3-e4-mission-6", 10, "연속한 수의 합에서 최댓값 찾기"]
];

const sourceAnchors = {
  0: { dividendLastDigit: 8, divisor: 36, quotient: 26, dividends: [938, 948, 958, 968], answer: "938, 948, 958, 968" },
  1: { multiplyBy: 2, divideBy: 4, candidates: Array.from({ length: 100 }, (_, index) => 400 + index), answer: 100 },
  2: { leftFactors: [377, 77], rightFactors: [319, 91], blankDigit: 1, answer: 1 },
  3: { divisors: [81, 82], digitSum: 12, candidatesBeforeDigitSum: Array.from({ length: 10 }, (_, index) => 810 + index), answer: 813 },
  4: { total: 1012, count: 8, first: 123, answer: 123 },
  5: { factor: 736, target: 35000, answer: 48, nearestProduct: 35328, difference: 328 },
  6: { firstFactor: 4, secondFactor: 5, candidates: Array.from({ length: 50 }, (_, index) => 200 + index), answer: 50 },
  7: { firstCards: [1, 5, 4, 8, 7], firstExpression: "875÷14", firstQuotient: 62, firstRemainder: 7, secondCards: [9, 0, 2, 6, 4], secondExpression: "964÷20", secondQuotient: 48, secondRemainder: 4, winner: "현우", answer: 14 },
  8: { firstProduct: 504, quotient: 6, secondProduct: 792, answer: 66528 },
  9: { minimum: 750, divisor: 78, candidatesBeforeDigitSum: [790, 869, 948], digitSum: 21, answer: 948 },
  10: { total: 3627, count: 13, largest: 285, answer: 285 }
};

const expectedKinds = [
  "torn-division-dividend-list",
  "two-three-digit-results-count",
  "cross-paired-factor-blank",
  "near-divisors-and-digit-sum",
  "consecutive-even-count-first",
  "nearest-product-natural-number",
  "three-and-four-digit-products-count",
  "card-division-maximum-quotient",
  "four-natural-numbers-product",
  "equal-quotient-remainder-digit-sum",
  "consecutive-odd-count-last"
];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function digitSum(value) {
  return [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function tornCandidates(divisor, quotient, lastDigit) {
  const values = [];
  for (let remainder = 0; remainder < divisor; remainder += 1) {
    const dividend = divisor * quotient + remainder;
    if (dividend >= 100 && dividend % 10 === lastDigit) values.push(dividend);
  }
  return values;
}

function threeDigitProductAndQuotient(multiplyBy, divideBy) {
  const values = [];
  for (let number = 1; number <= 9999; number += 1) {
    const product = multiplyBy * number;
    const quotient = Math.floor(number / divideBy);
    if (product >= 100 && product <= 999 && quotient >= 100 && quotient <= 999) values.push(number);
  }
  return values;
}

function blankDigitCandidates(leftFirst, leftSecond, rightFirst, rightSecond) {
  const text = String(rightFirst);
  const values = [];
  for (let digit = 0; digit <= 9; digit += 1) {
    const tested = Number(`${text[0]}${digit}${text[2]}`);
    if (leftFirst * leftSecond === tested * rightSecond) values.push(digit);
  }
  return values;
}

function nearDivisorCandidates(firstDivisor, secondDivisor, targetDigitSum = null) {
  const values = [];
  for (let number = 100; number <= 999; number += 1) {
    const firstQuotient = Math.floor(number / firstDivisor);
    const secondQuotient = Math.floor(number / secondDivisor);
    if (firstQuotient < 10 || firstQuotient > 99 || secondQuotient < 1 || secondQuotient > 9) continue;
    if (targetDigitSum !== null && digitSum(number) !== targetDigitSum) continue;
    values.push(number);
  }
  return values;
}

function consecutiveStarts(total, count) {
  const values = [];
  for (let first = 1; first <= Math.floor(total / count); first += 1) {
    let sum = 0;
    for (let offset = 0; offset < count; offset += 1) sum += first + offset;
    if (sum === total) values.push(first);
  }
  return values;
}

function nearestCandidates(factor, target) {
  const values = [];
  let smallestGap = Infinity;
  for (let multiplier = 1; multiplier <= Math.ceil(target / factor) + 2; multiplier += 1) {
    const gap = Math.abs(factor * multiplier - target);
    if (gap < smallestGap) {
      smallestGap = gap;
      values.length = 0;
      values.push(multiplier);
    } else if (gap === smallestGap) {
      values.push(multiplier);
    }
  }
  return { values, smallestGap };
}

function threeAndFourDigitProducts(firstFactor, secondFactor) {
  const values = [];
  for (let number = 1; number <= 9999; number += 1) {
    const first = firstFactor * number;
    const second = secondFactor * number;
    if (first >= 100 && first <= 999 && second >= 1000 && second <= 9999) values.push(number);
  }
  return values;
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, current) => current !== index)).map(rest => [value, ...rest]));
}

function maximumCardQuotients(cards) {
  const expressions = [];
  const seen = new Set();
  for (const order of permutations(cards)) {
    if (order[0] === 0 || order[3] === 0) continue;
    const dividend = Number(order.slice(0, 3).join(""));
    const divisor = Number(order.slice(3).join(""));
    const key = `${dividend}/${divisor}`;
    if (seen.has(key)) continue;
    seen.add(key);
    expressions.push({ dividend, divisor, quotient: Math.floor(dividend / divisor), remainder: dividend % divisor });
  }
  const maximum = Math.max(...expressions.map(item => item.quotient));
  return expressions.filter(item => item.quotient === maximum);
}

function fourNumberProducts(firstProduct, quotient, secondProduct) {
  const candidates = [];
  for (let middle = 1; middle <= Math.min(firstProduct, secondProduct); middle += 1) {
    if (firstProduct % middle !== 0 || secondProduct % middle !== 0 || middle % quotient !== 0) continue;
    const first = firstProduct / middle;
    const third = middle / quotient;
    const fourth = secondProduct / middle;
    candidates.push({ first, middle, third, fourth, product: first * middle * third * fourth });
  }
  return candidates;
}

function equalQuotientRemainderCandidates(minimum, divisor, targetDigitSum = null) {
  const values = [];
  for (let number = 100; number <= 999; number += 1) {
    if (number <= minimum || Math.floor(number / divisor) !== number % divisor) continue;
    if (targetDigitSum !== null && digitSum(number) !== targetDigitSum) continue;
    values.push(number);
  }
  return values;
}

function auditPayload(variant, payload, generated) {
  const text = visibleText(`${generated.prompt} ${generated.solution}`);
  assert(!/undefined|null|NaN|Infinity/.test(`${text} ${generated.answer}`), "잘못된 값이 화면에 보입니다.");
  assert(!/방정식|순열|조합|제곱|모듈러|mod\b/.test(text), "초등 과정 밖 풀이 표현이 보입니다.");
  assert(!/\d+(?:을|를) 곱|\d+(?:로|으로) 나누/.test(text), "숫자 뒤 자동 조사가 어색하게 붙었습니다.");
  assert(Number(payload.complexity) > 0, "난이도 자료가 없습니다.");

  if (variant === 0) {
    const candidates = tornCandidates(payload.divisor, payload.quotient, payload.visibleLastDigit);
    assert(candidates.length >= 2 && same(candidates, payload.dividends), "찢어진 나눗셈의 가능한 수 목록이 다릅니다.");
    assert(String(generated.answer) === candidates.join(", "), "가능한 나누어지는 수가 답과 다릅니다.");
  } else if (variant === 1) {
    const candidates = threeDigitProductAndQuotient(payload.multiplyBy, payload.divideBy);
    assert(same(candidates, payload.candidates) && Number(generated.answer) === candidates.length, "곱과 몫이 모두 세 자리인 수의 개수가 다릅니다.");
  } else if (variant === 2) {
    const candidates = blankDigitCandidates(payload.leftFirst, payload.leftSecond, payload.rightFirst, payload.rightSecond);
    assert(payload.leftFirst * payload.leftSecond === payload.rightFirst * payload.rightSecond, "두 곱이 같지 않습니다.");
    assert(candidates.length === 1 && same(candidates, payload.candidates) && Number(generated.answer) === candidates[0], "빈칸 숫자가 하나로 정해지지 않습니다.");
  } else if (variant === 3) {
    const before = nearDivisorCandidates(payload.firstDivisor, payload.secondDivisor);
    const after = nearDivisorCandidates(payload.firstDivisor, payload.secondDivisor, payload.digitSum);
    assert(same(before, payload.candidatesBeforeDigitSum), "두 몫 조건의 범위가 다릅니다.");
    assert(after.length === 1 && same(after, payload.candidates) && Number(generated.answer) === after[0], "자리 숫자의 합을 적용한 답이 하나가 아닙니다.");
  } else if (variant === 4 || variant === 10) {
    const starts = consecutiveStarts(payload.total, payload.count);
    assert(starts.length === 1 && same(starts, payload.candidates) && starts[0] === payload.first, "연속한 자연수의 시작이 하나로 정해지지 않습니다.");
    assert(payload.last === payload.first + payload.count - 1, "연속한 자연수의 마지막 수가 다릅니다.");
    assert(Number(generated.answer) === (variant === 4 ? payload.first : payload.last), "연속한 자연수의 답이 다릅니다.");
    assert(variant !== 4 || payload.count % 2 === 0, "첫 수 문제의 자연수 개수는 짝수여야 합니다.");
    assert(variant !== 10 || payload.count % 2 === 1, "가장 큰 수 문제의 자연수 개수는 홀수여야 합니다.");
    assert(!/\d[\d,]*을 연속한/.test(text), "합계 숫자 뒤 조사가 어색하게 붙었습니다.");
  } else if (variant === 5) {
    const nearest = nearestCandidates(payload.factor, payload.target);
    assert(nearest.values.length === 1 && same(nearest.values, payload.candidates), "가장 가까운 곱의 자연수가 하나가 아닙니다.");
    assert(nearest.values[0] === payload.answer && Number(generated.answer) === payload.answer, "가장 가까운 곱의 답이 다릅니다.");
    assert(nearest.smallestGap === payload.difference && payload.factor * payload.answer === payload.nearestProduct, "가장 가까운 곱의 차가 다릅니다.");
    assert(payload.lowerProduct === payload.factor * payload.lowerMultiplier && payload.upperProduct === payload.factor * payload.upperMultiplier, "비교할 두 곱이 다릅니다.");
    assert(payload.lowerDifference === payload.target - payload.lowerProduct && payload.upperDifference === payload.upperProduct - payload.target, "비교할 두 차가 다릅니다.");
    const lowerProductText = `${payload.factor.toLocaleString()}×${payload.lowerMultiplier.toLocaleString()}=${payload.lowerProduct.toLocaleString()}`;
    const upperProductText = `${payload.factor.toLocaleString()}×${payload.upperMultiplier.toLocaleString()}=${payload.upperProduct.toLocaleString()}`;
    const lowerDifferenceText = `목표와의 차는 ${payload.lowerDifference.toLocaleString()}입니다.`;
    const upperDifferenceText = `목표와의 차는 ${payload.upperDifference.toLocaleString()}입니다.`;
    assert(text.includes(lowerProductText) && text.includes(upperProductText) && text.includes(lowerDifferenceText) && text.includes(upperDifferenceText), "풀이에 두 후보의 곱과 차가 완전한 문장으로 모두 보이지 않습니다.");
  } else if (variant === 6) {
    const candidates = threeAndFourDigitProducts(payload.firstFactor, payload.secondFactor);
    assert(same(candidates, payload.candidates) && Number(generated.answer) === candidates.length, "두 곱의 자리 수 조건을 만족하는 수의 개수가 다릅니다.");
  } else if (variant === 7) {
    assert(new Set(payload.firstCards).size === 5 && !payload.firstCards.includes(0), "현우의 수 카드는 0이 없는 서로 다른 다섯 장이어야 합니다.");
    assert(new Set(payload.secondCards).size === 5 && payload.secondCards.filter(value => value === 0).length === 1, "민재의 수 카드는 0 한 장을 포함한 서로 다른 다섯 장이어야 합니다.");
    const first = maximumCardQuotients(payload.firstCards);
    const second = maximumCardQuotients(payload.secondCards);
    assert(first.length === 1 && second.length === 1, "수 카드의 최대 몫 식이 하나가 아닙니다.");
    assert(same(first[0], payload.firstMaximum) && same(second[0], payload.secondMaximum), "수 카드 최대 몫 식이 다릅니다.");
    const winner = first[0].quotient > second[0].quotient ? "현우" : "민재";
    const difference = Math.abs(first[0].quotient - second[0].quotient);
    assert(difference > 0 && String(generated.answer) === `${winner}, ${difference}`, "수 카드 몫 비교 답이 다릅니다.");
  } else if (variant === 8) {
    const candidates = fourNumberProducts(payload.firstProduct, payload.quotient, payload.secondProduct);
    const products = [...new Set(candidates.map(item => item.product))];
    assert(candidates.length >= 1 && products.length === 1, "주어진 관계에서 네 수의 곱이 하나로 정해지지 않습니다.");
    assert(products[0] === payload.answer && Number(generated.answer) === payload.answer, "네 자연수의 곱이 다릅니다.");
    assert(payload.answer === payload.firstProduct * payload.secondProduct / payload.quotient, "세 관계에서 계산한 곱이 다릅니다.");
  } else if (variant === 9) {
    const before = equalQuotientRemainderCandidates(payload.minimum, payload.divisor);
    const after = equalQuotientRemainderCandidates(payload.minimum, payload.divisor, payload.digitSum);
    assert(before.length >= 3 && same(before, payload.candidatesBeforeDigitSum), "몫과 나머지가 같은 기본 후보가 다릅니다.");
    assert(after.length === 1 && same(after, payload.candidates) && Number(generated.answer) === after[0], "자리 숫자의 합을 적용한 답이 하나가 아닙니다.");
  }
}

check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);
check(runtimeInventory.verifiedMappings >= 181, `4-1 공개 유형이 나눗셈 응용 문제 완료 기준 181개보다 줄었습니다: ${runtimeInventory.verifiedMappings}개`);

for (const [sourceItemId, variant, label] of sourceItems) {
  const sourceItem = inventory.items.find(item => item.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(item => item.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(item => item.sourceItemId === sourceItemId);
  check(Boolean(sourceItem), `${sourceItemId}: 원문 항목이 없습니다.`);
  check(sourceItem?.typeLabel === label, `${sourceItemId}: 쉬운 한글 유형명이 다릅니다.`);
  check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 연결이 다릅니다.`);
  check(runtimeItem?.generatorKey === generatorKey && runtimeItem?.variant === variant && !runtimeItem?.reviewLocked, `${sourceItemId}: 브라우저에서 생성 가능 상태가 아닙니다.`);
}

check(tornCandidates(36, 26, 8).join(", ") === sourceAnchors[0].answer, "원문 찢어진 나눗셈 답이 다릅니다.");
check(threeDigitProductAndQuotient(2, 4).length === 100, "원문 예제 4-1 답이 다릅니다.");
check(blankDigitCandidates(377, 77, 319, 91).join(",") === "1", "원문 예제 4-2 답이 다릅니다.");
check(nearDivisorCandidates(81, 82, 12).join(",") === "813", "원문 예제 4-3 답이 다릅니다.");
check(consecutiveStarts(1012, 8).join(",") === "123", "원문 예제 4-4 답이 다릅니다.");
check(nearestCandidates(736, 35000).values.join(",") === "48", "원문 Mission 1 답이 다릅니다.");
check(threeAndFourDigitProducts(4, 5).length === 50, "원문 Mission 2 답이 다릅니다.");
check(maximumCardQuotients(sourceAnchors[7].firstCards)[0].quotient === 62 && maximumCardQuotients(sourceAnchors[7].secondCards)[0].quotient === 48, "원문 Mission 3 최대 몫이 다릅니다.");
check(fourNumberProducts(504, 6, 792).every(item => item.product === 66528), "원문 Mission 4 답이 다릅니다.");
check(equalQuotientRemainderCandidates(750, 78, 21).join(",") === "948", "원문 Mission 5 답이 다릅니다.");
check(consecutiveStarts(3627, 13)[0] + 12 === 285, "원문 Mission 6 답이 다릅니다.");

const complexities = new Map();
for (const [, variant] of sourceItems) {
  for (const difficulty of difficulties) {
    complexities.set(`${variant}:${difficulty}`, []);
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        const extracted = evidence(generated);
        assert(extracted.kind === expectedKinds[variant], `원문 구조 표시가 다릅니다: ${extracted.kind}`);
        assert(extracted.expected === String(generated.answer), "근거 자료의 정답과 화면 정답이 다릅니다.");
        assert(same(extracted.payload.sourceAnchor, sourceAnchors[variant]), "원문 기준값이 다릅니다.");
        auditPayload(variant, extracted.payload, generated);
        complexities.get(`${variant}:${difficulty}`).push(extracted.payload.complexity);
        generatedCount += 1;
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
  const low = complexities.get(`${variant}:-1`);
  const high = complexities.get(`${variant}:1`);
  if (low.length && high.length) {
    const lowAverage = low.reduce((sum, value) => sum + value, 0) / low.length;
    const highAverage = high.reduce((sum, value) => sum + value, 0) / high.length;
    check(highAverage > lowAverage, `분기 ${variant}: 심화 어려움의 조건 크기가 심화 쉬움보다 커지지 않습니다.`);
  }
}

if (failures.length) {
  console.error(`4-1 나눗셈 응용 문제 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 나눗셈 응용 문제 전용 감사 통과: 원문 11항목 · 공개 11 · ${generatedCount.toLocaleString()}회 독립 계산 · 수 카드 120배치와 모든 정답 후보 전수검사`);
