"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberSix";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u1-e6-exploration",
  "4-1-u1-e6-example-6-1",
  "4-1-u1-e6-example-6-2",
  "4-1-u1-e6-example-6-3",
  "4-1-u1-e6-example-6-4",
  "4-1-u1-e6-mission-1",
  "4-1-u1-e6-mission-2",
  "4-1-u1-e6-mission-3",
  "4-1-u1-e6-mission-4",
  "4-1-u1-e6-mission-5",
  "4-1-u1-e6-mission-6"
];
const expectedKinds = [
  "repeated-four-card-hidden-digit",
  "second-nearest-all-cards",
  "third-largest-number-pieces",
  "third-extremes-distinct-cards",
  "rotated-card-calculation",
  "count-permutations-above-threshold",
  "limited-repeat-third-extremes",
  "fixed-place-repeated-card-extremes",
  "hidden-nonzero-card-extreme-sum",
  "hidden-card-extreme-sum-range",
  "repeated-cards-place-product-maximum"
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function formatInteger(value) {
  return String(value).replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function readEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(attribute(tag, "data-source41-payload"))),
    declared: decodeURIComponent(attribute(tag, "data-source41-expected"))
  };
}

const factorials = [1];
for (let value = 1; value <= 18; value += 1) factorials[value] = factorials[value - 1] * value;

function multinomial(counts) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  return counts.reduce((ways, count) => ways / factorials[count], factorials[total]);
}

function kthRepeatedNumber(cards, repeat, rank, descending) {
  const sortedCards = [...new Set(cards)].sort((left, right) => descending ? right - left : left - right);
  const counts = new Map(sortedCards.map(card => [card, repeat]));
  const output = [];
  const length = cards.length * repeat;
  for (let position = 0; position < length; position += 1) {
    let chosen = false;
    for (const digit of sortedCards) {
      if (!counts.get(digit) || (position === 0 && digit === 0)) continue;
      counts.set(digit, counts.get(digit) - 1);
      const ways = multinomial(sortedCards.map(card => counts.get(card)));
      if (rank > ways) {
        rank -= ways;
        counts.set(digit, counts.get(digit) + 1);
        continue;
      }
      output.push(digit);
      chosen = true;
      break;
    }
    assert(chosen, "반복 카드의 몇 번째 수를 찾지 못했습니다.");
  }
  return output.join("");
}

function permuteItems(items, take = items.length) {
  const values = new Set();
  const used = Array(items.length).fill(false);
  const current = [];
  function visit() {
    if (current.length === take) {
      values.add(current.join(""));
      return;
    }
    for (let index = 0; index < items.length; index += 1) {
      if (used[index] || (!current.length && String(items[index]).startsWith("0"))) continue;
      used[index] = true;
      current.push(items[index]);
      visit();
      current.pop();
      used[index] = false;
    }
  }
  visit();
  return [...values].sort((left, right) => left.localeCompare(right));
}

function countLessThan(digits, targetText) {
  const available = digits.slice().sort((left, right) => left - right);
  let count = 0;
  for (let position = 0; position < targetText.length; position += 1) {
    const targetDigit = Number(targetText[position]);
    for (const digit of available) {
      if (digit >= targetDigit) break;
      if (position === 0 && digit === 0) continue;
      count += factorials[available.length - 1];
    }
    const exactIndex = available.indexOf(targetDigit);
    if (exactIndex < 0 || (position === 0 && targetDigit === 0)) return count;
    available.splice(exactIndex, 1);
  }
  return count;
}

function validPermutationCount(digits) {
  const total = factorials[digits.length];
  return digits.includes(0) ? total - factorials[digits.length - 1] : total;
}

function unrankDistinctNumber(digits, rank) {
  const available = digits.slice().sort((left, right) => left - right);
  const output = [];
  for (let position = 0; position < digits.length; position += 1) {
    for (let index = 0; index < available.length; index += 1) {
      const digit = available[index];
      if (position === 0 && digit === 0) continue;
      const ways = factorials[available.length - 1];
      if (rank >= ways) {
        rank -= ways;
        continue;
      }
      output.push(digit);
      available.splice(index, 1);
      break;
    }
  }
  assert(output.length === digits.length, "서로 다른 카드의 순서 번호를 수로 바꾸지 못했습니다.");
  return output.join("");
}

function nearestDistinctRows(digits, targetText) {
  const insertion = countLessThan(digits, targetText);
  const total = validPermutationCount(digits);
  const ranks = [];
  for (let offset = -4; offset <= 3; offset += 1) {
    const rank = insertion + offset;
    if (rank >= 0 && rank < total) ranks.push(rank);
  }
  return [...new Set(ranks)].map(rank => {
    const text = unrankDistinctNumber(digits, rank);
    const distance = BigInt(text) > BigInt(targetText) ? BigInt(text) - BigInt(targetText) : BigInt(targetText) - BigInt(text);
    return { text, distance };
  }).sort((left, right) => left.distance < right.distance ? -1 : left.distance > right.distance ? 1 : left.text.localeCompare(right.text));
}

function rotate180(text) {
  const mapping = { 0: 0, 1: 1, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 };
  return [...text].reverse().map(digit => mapping[digit]).join("");
}

function limitedWays(capacities, slots, memo) {
  if (slots === 0) return 1;
  const key = `${slots}|${capacities.join(",")}`;
  if (memo.has(key)) return memo.get(key);
  let ways = 0;
  for (let index = 0; index < capacities.length; index += 1) {
    if (!capacities[index]) continue;
    capacities[index] -= 1;
    ways += limitedWays(capacities, slots - 1, memo);
    capacities[index] += 1;
  }
  memo.set(key, ways);
  return ways;
}

function kthLimitedNumber(allowedDigits, maxUse, length, rank, descending) {
  const order = allowedDigits.slice().sort((left, right) => descending ? right - left : left - right);
  const capacities = allowedDigits.map(() => maxUse);
  const output = [];
  for (let position = 0; position < length; position += 1) {
    let chosen = false;
    for (const digit of order) {
      const index = allowedDigits.indexOf(digit);
      if (!capacities[index] || (position === 0 && digit === 0)) continue;
      capacities[index] -= 1;
      const ways = limitedWays(capacities, length - position - 1, new Map());
      if (rank > ways) {
        rank -= ways;
        capacities[index] += 1;
        continue;
      }
      output.push(digit);
      chosen = true;
      break;
    }
    assert(chosen, "사용 횟수가 정해진 카드의 몇 번째 수를 찾지 못했습니다.");
  }
  return output.join("");
}

function kthFixedPositionNumber(cards, repeat, fixedPositions, fixedDigits, rank, descending) {
  const fixed = new Map(fixedPositions.map((position, index) => [position, fixedDigits[index]]));
  const order = cards.slice().sort((left, right) => descending ? right - left : left - right);
  const initialCounts = cards.map(() => repeat);
  const length = cards.length * repeat;
  const memo = new Map();
  function completionCount(position, counts) {
    if (position === length) return counts.every(count => count === 0) ? 1 : 0;
    const key = `${position}|${counts.join(",")}`;
    if (memo.has(key)) return memo.get(key);
    let ways = 0;
    if (fixed.has(position)) {
      const digitIndex = cards.indexOf(fixed.get(position));
      if (digitIndex >= 0 && counts[digitIndex] > 0) {
        counts[digitIndex] -= 1;
        ways = completionCount(position + 1, counts);
        counts[digitIndex] += 1;
      }
    } else {
      for (let digitIndex = 0; digitIndex < cards.length; digitIndex += 1) {
        if (!counts[digitIndex] || (position === 0 && cards[digitIndex] === 0)) continue;
        counts[digitIndex] -= 1;
        ways += completionCount(position + 1, counts);
        counts[digitIndex] += 1;
      }
    }
    memo.set(key, ways);
    return ways;
  }

  const counts = initialCounts.slice();
  const output = [];
  for (let position = 0; position < length; position += 1) {
    if (fixed.has(position)) {
      const digit = fixed.get(position);
      const digitIndex = cards.indexOf(digit);
      assert(digitIndex >= 0 && counts[digitIndex] > 0, "고정 자리 카드가 남아 있지 않습니다.");
      output.push(digit);
      counts[digitIndex] -= 1;
      continue;
    }
    let chosen = false;
    for (const digit of order) {
      const digitIndex = cards.indexOf(digit);
      if (!counts[digitIndex] || (position === 0 && digit === 0)) continue;
      counts[digitIndex] -= 1;
      const ways = completionCount(position + 1, counts);
      if (rank > ways) {
        rank -= ways;
        counts[digitIndex] += 1;
        continue;
      }
      output.push(digit);
      chosen = true;
      break;
    }
    assert(chosen, "고정 자리 조건을 만족하는 순서 번호의 수를 찾지 못했습니다.");
  }
  return output.join("");
}

function enumeratedMaxMin(cards) {
  const values = permuteItems(cards);
  assert(values.length > 0, "카드로 만들 수 있는 자연수가 없습니다.");
  return { largest: BigInt(values[values.length - 1]), smallest: BigInt(values[0]) };
}

function maximumByProductSearch(digits, repeat, fixedPositions, targetProduct) {
  const fixed = new Set(fixedPositions);
  const length = digits.length * repeat;
  const initialCounts = digits.map(() => repeat);
  const memo = new Map();
  function canComplete(position, counts, product) {
    if (position === length) return product === targetProduct && counts.every(count => count === 0);
    const key = `${position}|${product}|${counts.join(",")}`;
    if (memo.has(key)) return memo.get(key);
    for (let digitIndex = 0; digitIndex < digits.length; digitIndex += 1) {
      if (!counts[digitIndex]) continue;
      const nextProduct = fixed.has(position) ? product * digits[digitIndex] : product;
      if (nextProduct > targetProduct || targetProduct % nextProduct !== 0) continue;
      counts[digitIndex] -= 1;
      const possible = canComplete(position + 1, counts, nextProduct);
      counts[digitIndex] += 1;
      if (possible) {
        memo.set(key, true);
        return true;
      }
    }
    memo.set(key, false);
    return false;
  }

  const counts = initialCounts.slice();
  const output = [];
  let product = 1;
  for (let position = 0; position < length; position += 1) {
    let chosen = false;
    for (let digitIndex = digits.length - 1; digitIndex >= 0; digitIndex -= 1) {
      if (!counts[digitIndex]) continue;
      const nextProduct = fixed.has(position) ? product * digits[digitIndex] : product;
      if (nextProduct > targetProduct || targetProduct % nextProduct !== 0) continue;
      counts[digitIndex] -= 1;
      if (canComplete(position + 1, counts, nextProduct)) {
        output.push(digits[digitIndex]);
        product = nextProduct;
        chosen = true;
        break;
      }
      counts[digitIndex] += 1;
    }
    assert(chosen, "자리 곱 조건을 완성할 수 있는 카드 배치를 찾지 못했습니다.");
  }
  return output.join("");
}

function independentAnswer(kind, payload) {
  if (kind === "repeated-four-card-hidden-digit") {
    const rows = payload.candidates.map(candidate => {
      const cards = [...payload.shown, candidate.hidden];
      const secondLargest = BigInt(kthRepeatedNumber(cards, 2, 2, true));
      const smallest = BigInt(kthRepeatedNumber(cards, 2, 1, false));
      return { hidden: candidate.hidden, difference: secondLargest - smallest };
    });
    const winners = rows.filter(row => row.difference === BigInt(payload.difference));
    assert(winners.length === 1, `숨은 카드 답이 ${winners.length}개입니다.`);
    return String(winners[0].hidden);
  }
  if (kind === "second-nearest-all-cards") {
    const rows = nearestDistinctRows(payload.digits, payload.targetText);
    assert(rows.length >= 3 && rows[1].distance !== rows[0].distance && rows[1].distance !== rows[2].distance, "두 번째로 가까운 수가 하나가 아닙니다.");
    return formatInteger(rows[1].text);
  }
  if (kind === "third-largest-number-pieces") {
    const values = permuteItems(payload.pieces);
    return formatInteger(values[values.length - 3]);
  }
  if (kind === "third-extremes-distinct-cards") {
    const values = permuteItems(payload.cards);
    return formatInteger(BigInt(values[values.length - 3]) - BigInt(values[2]));
  }
  if (kind === "rotated-card-calculation") {
    const values = permuteItems(payload.cards, payload.chooseCount);
    const original = values[1];
    const rotated = rotate180(original);
    const addend = BigInt(payload.target) - BigInt(rotated);
    assert(addend > 0n, "잘못 더한 수가 자연수가 아닙니다.");
    return formatInteger(BigInt(original) + addend);
  }
  if (kind === "count-permutations-above-threshold") {
    const total = validPermutationCount(payload.digits);
    const lower = countLessThan(payload.digits, payload.thresholdText);
    return formatInteger(total - lower - 1);
  }
  if (kind === "limited-repeat-third-extremes") {
    const high = kthLimitedNumber(payload.allowedDigits, payload.maxUse, payload.length, 3, true);
    const low = kthLimitedNumber(payload.allowedDigits, payload.maxUse, payload.length, 3, false);
    return formatInteger(BigInt(high) - BigInt(low));
  }
  if (kind === "fixed-place-repeated-card-extremes") {
    const high = kthFixedPositionNumber(payload.cards, payload.repeat, payload.fixedPositions, payload.fixedDigits, 1, true);
    const low = kthFixedPositionNumber(payload.cards, payload.repeat, payload.fixedPositions, payload.fixedDigits, 1, false);
    return formatInteger(BigInt(high) - BigInt(low));
  }
  if (kind === "hidden-nonzero-card-extreme-sum") {
    const winners = [];
    for (let digit = 1; digit <= 9; digit += 1) {
      if (payload.shown.includes(digit)) continue;
      const extremes = enumeratedMaxMin([...payload.shown, digit]);
      if (extremes.largest + extremes.smallest === BigInt(payload.target)) winners.push(digit);
    }
    assert(winners.length === 1, `빈 카드 답이 ${winners.length}개입니다.`);
    return String(winners[0]);
  }
  if (kind === "hidden-card-extreme-sum-range") {
    const winners = [];
    for (let digit = 0; digit <= 9; digit += 1) {
      if (payload.shown.includes(digit)) continue;
      const extremes = enumeratedMaxMin([...payload.shown, digit]);
      const sum = extremes.largest + extremes.smallest;
      if (sum > BigInt(payload.lower) && sum < BigInt(payload.upper)) winners.push(digit);
    }
    assert(winners.length > 0, "합의 범위에 맞는 빈 카드가 없습니다.");
    return winners.join(", ");
  }
  if (kind === "repeated-cards-place-product-maximum") return formatInteger(maximumByProductSearch(payload.digits, payload.repeat, payload.fixedPositions, payload.targetProduct));
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditOriginalAnchors() {
  const shown = [4, 8, 1];
  const targetDifference = 77217453n;
  const hiddenRows = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => !shown.includes(digit)).map(hidden => ({
    hidden,
    difference: BigInt(kthRepeatedNumber([...shown, hidden], 2, 2, true)) - BigInt(kthRepeatedNumber([...shown, hidden], 2, 1, false))
  }));
  check(hiddenRows.filter(row => row.difference === targetDifference).map(row => row.hidden).join("|") === "6", "원문 개념탐구 6의 숨은 카드가 6이 아닙니다.");

  const nearRows = nearestDistinctRows(Array.from({ length: 10 }, (_, digit) => digit), "5000000000");
  check(nearRows[0].text === "5012346789" && nearRows[1].text === "4987653210", "원문 예제 6-1의 가까운 두 수가 다릅니다.");
  check(nearRows[1].text === "4987653210", "원문 예제 6-1의 둘째로 가까운 수가 다릅니다.");

  const pieceValues = permuteItems(["87", "24", "09", "6", "31"]);
  check(pieceValues[pieceValues.length - 3] === "876243109", "원문 예제 6-2의 셋째 큰 수가 다릅니다.");

  const cardValues = permuteItems([3, 8, 6, 0, 2, 5, 9]);
  check(cardValues[cardValues.length - 3] === "9865230" && cardValues[2] === "2035869", "원문 예제 6-3의 셋째 큰 수 또는 작은 수가 다릅니다.");
  check(BigInt(cardValues[cardValues.length - 3]) - BigInt(cardValues[2]) === 7829361n, "원문 예제 6-3의 답은 7,829,361이어야 합니다.");

  const rotatedValues = permuteItems([1, 9, 5, 0, 8, 2, 6], 5);
  const original = rotatedValues[1];
  const rotated = rotate180(original);
  const addend = 90000n - BigInt(rotated);
  check(original === "10258" && rotated === "85201" && addend === 4799n, "원문 예제 6-4의 둘째 작은 수 또는 회전 수가 다릅니다.");
  check(BigInt(original) + addend === 15057n, "원문 예제 6-4의 바른 계산값은 15,057이어야 합니다.");

  const allDigits = Array.from({ length: 10 }, (_, digit) => digit);
  const greater = validPermutationCount(allDigits) - countLessThan(allDigits, "9876534102") - 1;
  check(greater === 27, "원문 Mission 1의 답은 27개여야 합니다.");

  const thirdHigh = kthLimitedNumber([0, 1, 2, 3, 4, 5], 2, 10, 3, true);
  const thirdLow = kthLimitedNumber([0, 1, 2, 3, 4, 5], 2, 10, 3, false);
  check(thirdHigh === "5544332201" && thirdLow === "1001223354", "원문 Mission 2의 셋째 큰 수 또는 작은 수가 다릅니다.");
  check(BigInt(thirdHigh) - BigInt(thirdLow) === 4543108847n, "원문 Mission 2의 답은 4,543,108,847이어야 합니다.");

  const repeatedCards = [0, 1, 4, 5, 7, 9];
  const fixedPositions = [1, 4];
  const fixedDigits = [1, 7];
  const fixedHigh = kthFixedPositionNumber(repeatedCards, 2, fixedPositions, fixedDigits, 1, true);
  const fixedLow = kthFixedPositionNumber(repeatedCards, 2, fixedPositions, fixedDigits, 1, false);
  check(fixedHigh === "919775544100" && fixedLow === "110074455799", "원문 Mission 3의 가장 큰 수 또는 작은 수가 다릅니다.");
  check(BigInt(fixedHigh) - BigInt(fixedLow) === 809701088301n, "원문 Mission 3의 답이 다릅니다.");

  const missionFour = [];
  for (let hidden = 1; hidden <= 9; hidden += 1) {
    if ([4, 8, 5, 6].includes(hidden)) continue;
    const extremes = enumeratedMaxMin([4, 8, 5, hidden, 6]);
    if (extremes.largest + extremes.smallest === 111110n) missionFour.push(hidden);
  }
  check(missionFour.join("|") === "2", "원문 Mission 4의 빈 카드는 2여야 합니다.");

  const missionFive = [];
  for (let hidden = 0; hidden <= 9; hidden += 1) {
    if ([7, 0, 5, 4, 2].includes(hidden)) continue;
    const extremes = enumeratedMaxMin([7, 0, 5, 4, 2, hidden]);
    const sum = extremes.largest + extremes.smallest;
    if (sum > 950000n && sum < 1000000n) missionFive.push(hidden);
  }
  check(missionFive.join("|") === "3|6", "원문 Mission 5의 빈 카드는 3, 6이어야 합니다.");

  const missionSix = maximumByProductSearch([1, 2, 3, 4, 5], 3, [0, 4, 8], 24);
  check(missionSix === "455534432322111", "원문 Mission 6의 가장 큰 수는 455,534,432,322,111이어야 합니다.");
}

function auditPromptStructure(variant, prompt) {
  const required = [
    ["각각 두 번씩", "두 번째로 큰 수", "가장 작은 수", "source41-card-row"],
    ["한 번씩만", "두 번째로 가까운", "source41-card-row"],
    ["수 조각", "세 번째로 큰 수", "source41-piece-row"],
    ["한 번씩 모두", "세 번째로 큰 수", "세 번째로 작은 수", "source41-card-row"],
    ["180°", "두 번째로 작은", "바르게 계산", "source41-card-row"],
    ["0부터 9까지", "모두 한 번씩", "보다 큰 수"],
    ["각각 두 번까지", "세 번째로 큰 수", "세 번째로 작은 수"],
    ["각각 두 번씩", "가장 큰 수", "가장 작은 수", "source41-condition-list"],
    ["0이 아닌 서로 다른", "숫자가 쓰여 있지 않은", "source41-card-row"],
    ["합이", "보다 크고", "보다 작습니다", "모두 구하세요"],
    ["각각 세 번씩", "자리 수", "곱", "가장 큰 수"]
  ][variant];
  required.forEach(marker => assert(prompt.includes(marker), `문제 구조 표지 '${marker}'가 없습니다.`));
}

auditOriginalAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 6);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서가 다릅니다.");
check(new Set(sourceItems.map(item => item.typeLabel)).size === 11, "11개 원문 문제의 유형명이 서로 구분되지 않습니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);

const promptSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const complexitySums = Array.from({ length: 11 }, () => difficulties.map(() => 0));
let generatedCount = 0;

for (let variant = 0; variant < 11; variant += 1) {
  const type = { id: expectedSourceIds[variant], name: sourceItems[variant]?.typeLabel || expectedSourceIds[variant], generatorKey, variant };
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    const difficulty = difficulties[difficultyIndex];
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      const context = `variant ${variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey, "다른 생성기가 호출되었습니다.");
        assert(Boolean(generated.prompt && generated.solution && generated.answer !== undefined), "문제·정답·풀이가 비었습니다.");
        const visible = `${generated.prompt} ${generated.answer} ${generated.solution}`;
        assert(!/undefined|null|NaN|Infinity|\d+n\b/.test(visible), "잘못된 값 또는 BigInt 표기가 노출됩니다.");
        assert(!/순열|조합|팩토리얼/.test(visible), "초등 풀이에 쓰지 않을 계산 용어가 노출됩니다.");
        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `검산 구조가 ${evidence.kind}입니다.`);
        assert(Number(evidence.payload.variant) === variant && Number(evidence.payload.level) === difficultyIndex, "분기·난이도 자료가 다릅니다.");
        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(String(generated.answer) === independent, `독립 계산 ${independent}와 생성 정답 ${generated.answer}이 다릅니다.`);
        assert(evidence.declared === independent, `숨은 검산 정답 ${evidence.declared}과 독립 계산 ${independent}이 다릅니다.`);
        assert(generated.solution.includes(independent) || generated.solution.includes(independent.replace(/,/g, "")), "풀이에 최종 정답이 없습니다.");
        auditPromptStructure(variant, generated.prompt);
        promptSets[variant][difficultyIndex].add(generated.prompt.replace(/<span hidden[^>]*><\/span>/, ""));
        complexitySums[variant][difficultyIndex] += Number(evidence.payload.complexity);
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
        break;
      }
    }
  }
}

const minimumDiversity = [12, 4, 30, 30, 18, 15, 30, 30, 24, 18, 12];
for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= minimumDiversity[variant], `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 부족합니다 (${promptSets[variant][difficultyIndex].size}).`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 깊이가 커지지 않습니다 (${averages.join(", ")}).`);
}

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 6 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 6 감사 통과: 11원문 구조 · ${generatedCount.toLocaleString()}회 독립 계산 · 원문 기준값 11종 · 답지 오류 5건을 원문 계산으로 바로잡음`);
