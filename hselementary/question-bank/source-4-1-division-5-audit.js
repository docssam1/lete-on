"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");
require("./curriculum.js");

const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const inventory = require("./source-inventory/4-1-source-items.json");
const mappings = require("./source-inventory/4-1-native-generators.json").mappings;
const generatorKey = "source41DivisionFive";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u3-e5-exploration", 0, "나머지를 보고 가장 작은 나누어지는 수 찾기"],
  ["4-1-u3-e5-example-5-1", 1, "몫과 나머지가 같은 세 자리 수의 큰 수와 작은 수 비교하기"],
  ["4-1-u3-e5-example-5-2", 2, "수 카드로 몫과 나머지가 정해진 나눗셈 완성하기"],
  ["4-1-u3-e5-example-5-3", 3, "잘못 나누어 뒤바뀐 몫과 나머지로 처음 수 찾기"],
  ["4-1-u3-e5-example-5-4", 4, "어떤 수를 더한 뒤 처음 수의 나머지 찾기"],
  ["4-1-u3-e5-mission-1", 5, "주어진 범위에서 나머지가 가장 큰 수 찾기"],
  ["4-1-u3-e5-mission-2", 6, "가장 큰 나머지를 가지면서 기준 수에 가장 가까운 수 찾기"],
  ["4-1-u3-e5-mission-3", 7, "나머지가 가장 크도록 세 자리 수의 빈칸 채우기"],
  ["4-1-u3-e5-mission-4", 8, "나누어지는 수의 한 자리와 두 자리 몫 함께 채우기"],
  ["4-1-u3-e5-mission-5", 9, "같은 나머지를 갖는 세 자리 수의 개수 구하기"],
  ["4-1-u3-e5-mission-6", 10, "일정하게 늘어나는 수들을 나눈 나머지의 합 구하기"]
];

const expectedKinds = [
  "smallest-dividend-from-hidden-divisor",
  "equal-quotient-remainder-range",
  "card-division-fixed-quotient-remainder",
  "swapped-quotient-remainder-recovery",
  "remainder-before-adding",
  "largest-remainder-in-range",
  "largest-remainder-nearest-number",
  "two-digit-blank-largest-remainder",
  "dividend-and-quotient-blank",
  "count-numbers-with-remainder",
  "remainder-sum-repeating-cycle"
];

const sourceAnchors = {
  0: { quotient: 20, remainder: 29, smallestDivisor: 30, answer: 629 },
  1: { divisor: 17, values: [108, 126, 144, 162, 180, 198, 216, 234, 252, 270, 288], answer: 180 },
  2: { cards: [1, 3, 5, 6, 8], quotient: 7, remainder: 68, expression: "635÷81=7…68" },
  3: { correctDivisor: 23, wrongDivisor: 32, quotient: 31, remainder: 22, answer: 735 },
  4: { added: 95, divisor: 50, remainderAfterAdding: 44, candidates: [449, 499, 549, 599, 649, 699, 749, 799, 849, 899, 949, 999], answer: 49 },
  5: { lower: 251, upper: 299, divisor: 60, answer: 299 },
  6: { divisor: 35, target: 500, answer: 489 },
  7: { prefix: 9, divisor: 73, number: 948, answer: "㉠=4, ㉡=8" },
  8: { dividend: 951, divisor: 46, quotient: 20, remainder: 31, answer: "951÷46=20…31" },
  9: { lower: 100, upper: 999, divisor: 11, remainder: 9, answer: 82 },
  10: { start: 32, end: 134, step: 2, divisor: 15, answer: 371 }
};

const expectedStructures = {
  0: [["direct-divisor", "given-divisor-find-dividend", 1], ["hidden-minimum", "infer-smallest-divisor-then-dividend", 2], ["divisor-range-difference", "find-extreme-dividends-then-difference", 3]],
  1: [["guided-quotient-list", "compare-values-from-given-quotients", 1], ["all-three-digit", "enumerate-all-three-digit-values", 2], ["digit-sum-filter", "filter-by-digit-sum-then-compare", 3]],
  2: [["fixed-hundreds-card", "place-four-cards-after-fixed-hundreds", 1], ["all-card-layouts", "place-all-five-cards", 2], ["layout-then-difference", "complete-division-then-find-difference", 3]],
  3: [["given-correct-pair", "rebuild-number-and-check-wrong-division", 1], ["swapped-relation", "infer-swapped-quotient-and-remainder", 2], ["swapped-then-digit-sum", "infer-number-then-add-its-digits", 3]],
  4: [["known-after-quotient", "reverse-added-number-then-find-remainder", 1], ["common-remainder", "check-many-originals-for-common-remainder", 2], ["count-and-remainder", "count-originals-and-find-common-remainder", 3]],
  5: [["narrow-one-cycle", "find-one-largest-remainder-value", 1], ["source-single-maximum", "find-source-range-maximum-remainder-value", 2], ["two-cycle-larger", "find-all-largest-remainder-values-then-choose-larger", 3]],
  6: [["two-shown-candidates", "compare-two-shown-nearest-candidates", 1], ["all-three-digit-nearest", "enumerate-three-digit-candidates-then-compare", 2], ["filtered-nearest", "filter-by-range-and-parity-then-compare", 3]],
  7: [["one-blank", "fill-one-digit-for-largest-remainder", 1], ["two-blanks", "fill-two-digits-for-largest-remainder", 2], ["distinct-blanks-sum", "fill-distinct-digits-then-add-them", 3]],
  8: [["shown-quotient-one-blank", "fill-one-dividend-digit", 1], ["one-digit-and-quotient", "fill-dividend-digit-and-two-digit-quotient", 2], ["two-blanks-relation", "apply-digit-relation-then-fill-dividend-and-quotient", 3]],
  9: [["two-digit-count", "count-two-digit-values", 1], ["three-digit-count", "count-all-three-digit-values", 2], ["boundaries-and-count", "find-first-last-and-count-inside-range", 3]],
  10: [["one-period", "sum-one-complete-remainder-period", 1], ["periods-and-tail", "sum-complete-periods-and-leftover", 2], ["front-full-back", "split-front-full-periods-and-back", 3]]
};

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function parseEvidence(generated) {
  const match = `${generated.prompt}${generated.solution}`.match(/data-source41-kind="([^"]+)" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/);
  assert(match, "검산 자료가 없습니다.");
  return { kind: match[1], payload: JSON.parse(decodeURIComponent(match[2])), expected: decodeURIComponent(match[3]) };
}

function visibleText(html) {
  return String(html).replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]*>/g, " ");
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  return values.flatMap((value, index) => permutations(values.filter((_, other) => other !== index)).map(rest => [value, ...rest]));
}

function cardMatches(cards, quotient, remainder) {
  return permutations(cards).map(order => ({ dividend: Number(order.slice(0, 3).join("")), divisor: Number(order.slice(3).join("")) }))
    .filter(item => item.divisor >= 10 && Math.floor(item.dividend / item.divisor) === quotient && item.dividend % item.divisor === remainder);
}

function allInRange(lower, upper, predicate) {
  const values = [];
  for (let value = lower; value <= upper; value += 1) if (predicate(value)) values.push(value);
  return values;
}

function gcd(left, right) {
  return right ? gcd(right, left % right) : left;
}

function auditPayload(variant, payload, generated) {
  const text = visibleText(`${generated.prompt} ${generated.solution}`);
  assert(!/undefined|null|NaN|Infinity/.test(`${text} ${generated.answer}`), "잘못된 값이 화면에 보입니다.");
  assert(!/방정식|순열|조합|제곱|모듈러|합동식|정수해/.test(text), "초등 과정 밖 풀이 표현이 보입니다.");
  assert(Number(payload.complexity) > 0, "난이도 자료가 없습니다.");

  if (variant === 0) {
    const divisors = allInRange(payload.divisorLower, payload.divisorUpper, divisor => divisor > payload.remainder);
    const candidates = divisors.map(divisor => ({ divisor, dividend: payload.quotient * divisor + payload.remainder }));
    assert(same(divisors, payload.divisors) && same(candidates, payload.candidates), "나누는 수와 나누어지는 수의 전수 목록이 다릅니다.");
    assert(same(payload.minimum, candidates[0]) && same(payload.maximum, candidates.at(-1)), "가장 작은 수와 큰 수가 다릅니다.");
    const expected = payload.level === 2 ? candidates.at(-1).dividend - candidates[0].dividend : candidates[0].dividend;
    assert(Number(generated.answer) === expected, "난이도별로 요구한 나누어지는 수 또는 두 수의 차가 다릅니다.");
    assert(payload.level !== 0 || payload.divisorLower === payload.divisorUpper, "쉬움은 나누는 수를 직접 보여 주어야 합니다.");
    assert(payload.level !== 1 || payload.divisorLower === payload.remainder + 1, "중간은 나머지로 가장 작은 나누는 수를 찾아야 합니다.");
    assert(payload.level !== 2 || payload.divisorUpper > payload.divisorLower, "어려움은 나누는 수의 범위에서 두 끝값을 비교해야 합니다.");
  } else if (variant === 1) {
    const quotients = payload.level === 0 ? [8, 9, 10, 11, 12] : allInRange(0, payload.divisor - 1, () => true);
    const baseValues = quotients.map(quotient => ({ quotient, value: (payload.divisor + 1) * quotient }))
      .filter(item => item.value >= 100 && item.value <= 999 && Math.floor(item.value / payload.divisor) === item.value % payload.divisor);
    const candidates = payload.level === 2 ? baseValues.filter(item => [...String(item.value)].reduce((sum, digit) => sum + Number(digit), 0) === payload.digitSum) : baseValues;
    const values = candidates.map(item => item.value);
    assert(same(quotients, payload.quotientCandidates) && same(baseValues, payload.baseValues), "몫 범위에서 만든 세 자리 수 목록이 다릅니다.");
    assert(same(candidates, payload.candidates) && same(values, payload.values), "추가 자리 숫자 조건을 적용한 수 목록이 다릅니다.");
    assert(Number(generated.answer) === values.at(-1) - values[0], "가장 큰 수와 작은 수의 차가 다릅니다.");
    assert(payload.level !== 2 || payload.digitSum === 9, "어려움의 자리 숫자 합 조건이 빠졌습니다.");
  } else if (variant === 2) {
    const matches = cardMatches(payload.cards, payload.quotient, payload.remainder);
    assert(new Set(payload.cards).size === 5 && payload.cards.length === 5, "수 카드가 서로 다른 다섯 장이 아닙니다.");
    assert(payload.arrangementsChecked === 120 && matches.length === 1 && same(matches, payload.matches), "120개 수 카드 배열에서 식이 하나로 정해지지 않습니다.");
    const eligible = payload.level === 0 ? matches.filter(item => Number(String(item.dividend)[0]) === payload.prefilledDigit) : matches;
    assert(eligible.length === 1 && same(eligible, payload.candidates), "난이도별로 보여 준 카드 조건에서 식이 하나가 아닙니다.");
    const expression = `${matches[0].dividend}÷${matches[0].divisor}=${payload.quotient}…${payload.remainder}`;
    const expected = payload.level === 2 ? `${expression}, 차=${matches[0].dividend - matches[0].divisor}` : expression;
    assert(matches[0].dividend % matches[0].divisor < matches[0].divisor && generated.answer === expected, "난이도별 수 카드 답이 다릅니다.");
    assert(payload.level !== 0 || payload.prefilledDigit === Number(String(matches[0].dividend)[0]), "쉬움의 미리 보여 준 백의 자리 숫자가 다릅니다.");
    assert(payload.level !== 2 || payload.difference === matches[0].dividend - matches[0].divisor, "어려움의 두 수의 차가 다릅니다.");
  } else if (variant === 3) {
    const candidates = [];
    for (let quotient = 0; quotient < payload.wrongDivisor; quotient += 1) for (let remainder = 0; remainder < payload.correctDivisor; remainder += 1) {
      const correctNumber = payload.correctDivisor * quotient + remainder;
      const wrongNumber = payload.wrongDivisor * remainder + quotient;
      if (correctNumber === wrongNumber && correctNumber > 0) candidates.push({ quotient, remainder, number: correctNumber });
    }
    assert(candidates.length === 1 && same(candidates, payload.candidates), "두 나눗셈을 모두 만족하는 몫·나머지 쌍이 하나가 아닙니다.");
    const digitSum = [...String(candidates[0].number)].reduce((sum, digit) => sum + Number(digit), 0);
    const expected = payload.level === 2 ? digitSum : candidates[0].number;
    assert(Number(generated.answer) === expected && candidates[0].remainder < payload.correctDivisor && candidates[0].quotient < payload.wrongDivisor, "뒤바뀐 몫과 나머지의 난이도별 답이 다릅니다.");
    assert(payload.originalNumber === candidates[0].number && payload.digitSum === digitSum, "처음 수 또는 자리 숫자의 합 근거가 다릅니다.");
  } else if (variant === 4) {
    const candidates = allInRange(100, 999, number => {
      const after = number + payload.added;
      const quotient = Math.floor(after / payload.divisor);
      return quotient >= payload.quotientLower && quotient <= payload.quotientUpper && after % payload.divisor === payload.afterRemainder;
    });
    const remainders = [...new Set(candidates.map(number => number % payload.divisor))];
    assert(same(candidates, payload.candidates) && same(remainders, payload.remainders), "더하기 전 후보 또는 나머지가 다릅니다.");
    const expected = payload.level === 2 ? `개수=${candidates.length}, 나머지=${remainders[0]}` : String(remainders[0]);
    assert(remainders.length === 1 && generated.answer === expected, "처음 수의 개수와 공통 나머지 답이 다릅니다.");
    assert(payload.level !== 0 || candidates.length === 1 && payload.afterQuotient === payload.quotientLower, "쉬움은 더한 뒤 몫으로 처음 수를 하나 되찾아야 합니다.");
    assert(payload.level !== 1 || candidates.length > 1, "중간은 가능한 처음 수가 여러 개여야 합니다.");
    assert(payload.level !== 2 || payload.candidateCount === candidates.length && generated.answer.includes("개수="), "어려움은 개수와 공통 나머지를 함께 물어야 합니다.");
  } else if (variant === 5) {
    const values = allInRange(payload.lower, payload.upper, value => value % payload.divisor === payload.largestRemainder);
    assert(payload.largestRemainder === payload.divisor - 1 && same(values, payload.values), "범위에서 가장 큰 나머지를 갖는 수의 전수 목록이 다릅니다.");
    assert(payload.level < 2 ? values.length === 1 : values.length >= 2, "난이도별 최대 나머지 수의 개수가 다릅니다.");
    const expected = payload.level === 2 ? values.at(-1) : values[0];
    assert(Number(generated.answer) === expected && payload.selected === expected, "범위에서 요구한 최대 나머지 수가 다릅니다.");
    assert(payload.level !== 2 || payload.selection === "larger", "어려움은 여러 수 중 더 큰 수를 골라야 합니다.");
  } else if (variant === 6) {
    const allCandidates = allInRange(payload.searchLower, payload.searchUpper, value => value % payload.divisor === payload.divisor - 1);
    const filteredCandidates = payload.parity === "even" ? allCandidates.filter(value => value % 2 === 0) : allCandidates;
    const lowerShown = filteredCandidates.filter(value => value < payload.target).at(-1);
    const upperShown = filteredCandidates.find(value => value > payload.target);
    const candidates = payload.level === 0 ? [lowerShown, upperShown] : filteredCandidates;
    const nearestDistance = Math.min(...candidates.map(value => Math.abs(value - payload.target)));
    const closest = candidates.filter(value => Math.abs(value - payload.target) === nearestDistance).map(value => ({ value, distance: nearestDistance }));
    assert(same(allCandidates, payload.allCandidates) && same(filteredCandidates, payload.filteredCandidates), "범위와 짝수 조건을 적용한 후보 목록이 다릅니다.");
    assert(same(candidates, payload.candidates) && same(closest, payload.closest), "비교할 수 또는 가까운 수가 다릅니다.");
    assert(closest.length === 1 && Number(generated.answer) === closest[0].value, "가장 가까운 수가 하나로 정해지지 않습니다.");
    assert(payload.level !== 0 || candidates.length === 2, "쉬움은 비교할 두 수만 보여 주어야 합니다.");
    assert(payload.level !== 1 || payload.searchLower === 100 && payload.searchUpper === 999, "중간은 세 자리 수 전체를 확인해야 합니다.");
    assert(payload.level !== 2 || payload.parity === "even", "어려움은 범위와 짝수 조건을 함께 적용해야 합니다.");
  } else if (variant === 7) {
    const assignments = [];
    if (payload.level === 0) {
      for (let digit = 0; digit <= 9; digit += 1) {
        const number = 940 + digit;
        assignments.push({ digits: [digit], number, remainder: number % payload.divisor });
      }
    } else {
      for (let first = 0; first <= 9; first += 1) for (let second = 0; second <= 9; second += 1) {
        if (payload.level === 2 && first === second) continue;
        const number = 900 + first * 10 + second;
        assignments.push({ digits: [first, second], number, remainder: number % payload.divisor });
      }
    }
    const largestRemainder = Math.max(...assignments.map(item => item.remainder));
    const winning = assignments.filter(item => item.remainder === largestRemainder);
    assert(same(assignments, payload.assignments) && same(winning, payload.winning), "빈칸 숫자의 모든 경우를 확인한 결과가 다릅니다.");
    assert(winning.length === 1 && largestRemainder === payload.divisor - 1, "가장 큰 나머지를 만드는 빈칸 답이 하나가 아닙니다.");
    const expected = payload.level === 0 ? String(winning[0].digits[0]) : payload.level === 1 ? `㉠=${winning[0].digits[0]}, ㉡=${winning[0].digits[1]}` : String(winning[0].digits[0] + winning[0].digits[1]);
    assert(generated.answer === expected && payload.number === winning[0].number, "난이도별 빈칸 답이 다릅니다.");
    assert(payload.level !== 2 || payload.distinctDigits && winning[0].digits[0] !== winning[0].digits[1], "어려움의 서로 다른 숫자 조건이 빠졌습니다.");
  } else if (variant === 8) {
    const assignments = [];
    if (payload.level < 2) {
      for (let digit = 0; digit <= 9; digit += 1) {
        const number = 950 + digit;
        assignments.push({ digits: [digit], number, quotient: Math.floor(number / payload.divisor), remainder: number % payload.divisor });
      }
    } else {
      for (let first = 0; first <= 9; first += 1) for (let second = 0; second <= 9; second += 1) {
        const number = 900 + first * 10 + second;
        assignments.push({ digits: [first, second], number, quotient: Math.floor(number / payload.divisor), remainder: number % payload.divisor, digitSum: first + second });
      }
    }
    const candidates = assignments.filter(item => item.remainder === payload.remainder && (payload.shownQuotient === null || item.quotient === payload.shownQuotient) && (payload.level < 2 || item.digitSum === payload.digitSum));
    assert(same(assignments, payload.assignments) && same(candidates, payload.candidates), "나누어지는 수 빈칸의 모든 경우를 확인한 결과가 다릅니다.");
    assert(candidates.length === 1, "나누어지는 수와 몫의 빈칸이 하나로 정해지지 않습니다.");
    const expression = `${candidates[0].number}÷${payload.divisor}=${candidates[0].quotient}…${payload.remainder}`;
    const expected = payload.level === 0 ? String(candidates[0].digits[0]) : expression;
    assert(generated.answer === expected && payload.expression === expression, "난이도별 빈칸 나눗셈 답이 다릅니다.");
    assert(payload.level !== 0 || payload.shownQuotient === candidates[0].quotient, "쉬움은 몫을 직접 보여 주어야 합니다.");
    assert(payload.level !== 2 || payload.digitSum === 6 && candidates[0].digits.length === 2, "어려움은 두 빈칸과 숫자 합 조건을 사용해야 합니다.");
  } else if (variant === 9) {
    const values = allInRange(payload.lower, payload.upper, value => value % payload.divisor === payload.remainder);
    const expected = payload.level === 2 ? `첫 수=${values[0]}, 끝 수=${values.at(-1)}, 개수=${values.length}` : String(values.length);
    assert(same(values, payload.values) && generated.answer === expected, "같은 나머지를 갖는 수의 난이도별 답이 다릅니다.");
    assert(payload.first === values[0] && payload.last === values.at(-1), "개수를 세는 처음 수 또는 마지막 수가 다릅니다.");
    assert(payload.level !== 0 || payload.lower >= 10 && payload.upper <= 99, "쉬움은 두 자리 범위여야 합니다.");
    assert(payload.level !== 1 || payload.lower === 100 && payload.upper === 999, "중간은 세 자리 수 전체여야 합니다.");
    assert(payload.level !== 2 || payload.boundaryAligned === false, "어려움의 범위 양 끝은 조건에 바로 맞지 않아야 합니다.");
  } else {
    const values = [];
    for (let value = payload.start; value <= payload.end; value += payload.step) values.push(value);
    const directSum = values.reduce((sum, value) => sum + value % payload.divisor, 0);
    const period = payload.divisor / gcd(payload.step, payload.divisor);
    const oneCycle = values.slice(0, period).map(value => value % payload.divisor);
    let frontRemainders = [];
    let fullCycleRemainders = oneCycle;
    let fullCycleCount = Math.floor(values.length / period);
    let tailRemainders = oneCycle.slice(0, values.length % period);
    if (payload.level === 2) {
      const boundaryIndex = values.findIndex((value, index) => index > 0 && value % payload.divisor === 0);
      assert(boundaryIndex > 0, "어려움의 앞부분을 나눌 기준이 없습니다.");
      frontRemainders = values.slice(0, boundaryIndex).map(value => value % payload.divisor);
      const rest = values.slice(boundaryIndex);
      fullCycleRemainders = rest.slice(0, period).map(value => value % payload.divisor);
      fullCycleCount = Math.floor(rest.length / period);
      tailRemainders = rest.slice(fullCycleCount * period).map(value => value % payload.divisor);
    }
    const cycleSum = frontRemainders.reduce((sum, value) => sum + value, 0)
      + fullCycleRemainders.reduce((sum, value) => sum + value, 0) * fullCycleCount
      + tailRemainders.reduce((sum, value) => sum + value, 0);
    assert(same(values, payload.values) && same(oneCycle, payload.oneCycle), "나머지 묶음이 다릅니다.");
    assert(same(frontRemainders, payload.frontRemainders) && same(fullCycleRemainders, payload.fullCycleRemainders) && same(tailRemainders, payload.tailRemainders), "앞·온전한 묶음·뒤의 나머지 구분이 다릅니다.");
    assert(directSum === cycleSum && directSum === payload.directSum && cycleSum === payload.cycleSum && Number(generated.answer) === directSum, "직접 합과 묶어서 더한 합이 다릅니다.");
    assert(payload.level !== 0 || values.length === period, "쉬움은 한 주기만 더해야 합니다.");
    assert(payload.level !== 1 || values.length > period && payload.remaining > 0, "중간은 여러 주기와 남은 항이 있어야 합니다.");
    assert(payload.level !== 2 || frontRemainders.length > 0 && fullCycleCount > 0 && tailRemainders.length > 0, "어려움은 앞부분·온전한 묶음·뒷부분이 모두 있어야 합니다.");
  }
}

check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);
for (const [sourceItemId, variant, label] of sourceItems) {
  const sourceItem = inventory.items.find(item => item.sourceItemId === sourceItemId);
  const mapping = mappings.find(item => item.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(item => item.sourceItemId === sourceItemId);
  check(Boolean(sourceItem), `${sourceItemId}: 원문 항목이 없습니다.`);
  check(sourceItem?.typeLabel === label, `${sourceItemId}: 원문 유형명이 정확히 일치하지 않습니다.`);
  check(runtimeItem?.typeLabel === label, `${sourceItemId}: 브라우저 유형명이 원문 유형명과 일치하지 않습니다.`);
  if (variant === 2) {
    check(!mapping && runtimeItem?.reviewLocked && !runtimeItem?.generatorKey, `${sourceItemId}: 공식 숫자 답이 없는 수 카드 문항은 잠금이어야 합니다.`);
  } else {
    check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 연결이 다릅니다.`);
    check(runtimeItem?.generatorKey === generatorKey && runtimeItem?.variant === variant && !runtimeItem?.reviewLocked, `${sourceItemId}: 브라우저에서 생성 가능 상태가 아닙니다.`);
  }
}

check(20 * 30 + 29 === 629, "원문 본문 답이 다릅니다.");
const anchorOne = allInRange(100, 999, value => Math.floor(value / 17) === value % 17);
check(anchorOne.at(-1) - anchorOne[0] === 180, "원문 예제 5-1 답이 다릅니다.");
const anchorCards = cardMatches([1, 3, 5, 6, 8], 7, 68);
check(anchorCards.length === 1 && anchorCards[0].dividend === 635 && anchorCards[0].divisor === 81, "원문 예제 5-2 수 카드 120배열 답이 다릅니다.");
const anchorSwapped = [];
for (let quotient = 0; quotient < 32; quotient += 1) for (let remainder = 0; remainder < 23; remainder += 1) if (23 * quotient + remainder === 32 * remainder + quotient && 23 * quotient + remainder > 0) anchorSwapped.push({ quotient, remainder, number: 23 * quotient + remainder });
check(anchorSwapped.length === 1 && anchorSwapped[0].number === 735, "원문 예제 5-3 답이 다릅니다.");
const anchorBefore = allInRange(100, 999, number => (number + 95) % 50 === 44 && Math.floor((number + 95) / 50) >= 10 && Math.floor((number + 95) / 50) <= 99);
check(new Set(anchorBefore.map(number => number % 50)).size === 1 && anchorBefore[0] % 50 === 49, "원문 예제 5-4 답이 다릅니다.");
check(allInRange(251, 299, value => value % 60 === 59).join(",") === "299", "원문 Mission 1 답이 다릅니다.");
const anchorNearest = allInRange(100, 999, value => value % 35 === 34).sort((a, b) => Math.abs(a - 500) - Math.abs(b - 500));
check(anchorNearest[0] === 489 && Math.abs(anchorNearest[0] - 500) < Math.abs(anchorNearest[1] - 500), "원문 Mission 2 답이 다릅니다.");
check(allInRange(900, 999, value => value % 73 === 72).join(",") === "948", "원문 Mission 3 답이 다릅니다.");
check(allInRange(0, 9, digit => Math.floor((950 + digit) / 46) === 20 && (950 + digit) % 46 === 31).join(",") === "1", "원문 Mission 4 답이 다릅니다.");
check(allInRange(100, 999, value => value % 11 === 9).length === 82, "원문 Mission 5 답이 다릅니다.");
const anchorSum = allInRange(32, 134, value => value % 2 === 0).reduce((sum, value) => sum + value % 15, 0);
check(anchorSum === 371, "원문 Mission 6 답이 다릅니다.");

const complexities = new Map();
for (const [, variant] of sourceItems) {
  const modesSeen = new Set();
  const tasksSeen = new Set();
  const conditionCountsSeen = new Set();
  for (const difficulty of difficulties) {
    complexities.set(`${variant}:${difficulty}`, []);
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        const extracted = parseEvidence(generated);
        assert(extracted.kind === expectedKinds[variant], "원문 구조 표시가 다릅니다.");
        assert(extracted.expected === String(generated.answer), "근거 자료의 정답과 화면 정답이 다릅니다.");
        assert(extracted.payload.variant === variant && extracted.payload.level === difficulty + 1, "난이도 또는 문항 분기 근거가 다릅니다.");
        assert(same(extracted.payload.sourceAnchor, sourceAnchors[variant]), "원문 고정값 근거가 정확히 일치하지 않습니다.");
        const [expectedMode, expectedTask, expectedConditionCount] = expectedStructures[variant][difficulty + 1];
        assert(extracted.payload.mode === expectedMode, "난이도별 문제 방식이 다릅니다.");
        assert(extracted.payload.task === expectedTask, "난이도별 풀이 작업이 다릅니다.");
        assert(extracted.payload.conditionCount === expectedConditionCount, "난이도별 조건 수가 다릅니다.");
        auditPayload(variant, extracted.payload, generated);
        modesSeen.add(extracted.payload.mode);
        tasksSeen.add(extracted.payload.task);
        conditionCountsSeen.add(extracted.payload.conditionCount);
        complexities.get(`${variant}:${difficulty}`).push(extracted.payload.complexity);
        generatedCount += 1;
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
  check(modesSeen.size === 3, `분기 ${variant}: 하·중·상의 문제 방식이 세 가지로 나뉘지 않습니다.`);
  check(tasksSeen.size === 3, `분기 ${variant}: 하·중·상의 풀이 작업이 세 가지로 나뉘지 않습니다.`);
  check(same([...conditionCountsSeen].sort((a, b) => a - b), [1, 2, 3]), `분기 ${variant}: 하·중·상의 조건 수가 1·2·3으로 구분되지 않습니다.`);
  const low = complexities.get(`${variant}:-1`);
  const high = complexities.get(`${variant}:1`);
  if (low.length && high.length) {
    const lowAverage = low.reduce((sum, value) => sum + value, 0) / low.length;
    const highAverage = high.reduce((sum, value) => sum + value, 0) / high.length;
    check(highAverage > lowAverage, `분기 ${variant}: 심화 어려움의 조건이 심화 쉬움보다 커지지 않습니다.`);
  }
}

if (failures.length) {
  console.error(`4-1 나눗셈의 나머지 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 나눗셈의 나머지 전용 감사 통과: 원문 11항목 · 공개 10 · 잠금 1 · ${generatedCount.toLocaleString()}회 독립 계산 · 수 카드 120배치와 모든 정답 후보 전수검사`);
