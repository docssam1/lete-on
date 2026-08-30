"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberFive";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u1-e5-exploration",
  "4-1-u1-e5-example-5-1",
  "4-1-u1-e5-example-5-2",
  "4-1-u1-e5-example-5-3",
  "4-1-u1-e5-example-5-4",
  "4-1-u1-e5-mission-1",
  "4-1-u1-e5-mission-2",
  "4-1-u1-e5-mission-3",
  "4-1-u1-e5-mission-4",
  "4-1-u1-e5-mission-5",
  "4-1-u1-e5-mission-6"
];
const expectedKinds = [
  "nearest-distinct-digit-between-count",
  "matching-two-place-digits-in-range",
  "swap-leading-digits-from-difference",
  "bounded-digit-sum-count",
  "repeated-symbol-possibilities",
  "place-value-ratio-two-blanks",
  "reverse-add-max-digit-sum",
  "palindrome-consecutive-zero-number",
  "smallest-all-different-number",
  "largest-distinct-position-sum",
  "skip-count-place-match-largest"
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

const distinctCache = new Map();
function distinctNumbers(length) {
  if (distinctCache.has(length)) return distinctCache.get(length);
  const values = [];
  const digits = [];
  function visit(mask) {
    if (digits.length === length) {
      values.push(Number(digits.join("")));
      return;
    }
    for (let digit = 0; digit <= 9; digit += 1) {
      if ((mask & (1 << digit)) || (!digits.length && digit === 0)) continue;
      digits.push(digit);
      visit(mask | (1 << digit));
      digits.pop();
    }
  }
  visit(0);
  distinctCache.set(length, values);
  return values;
}

function nearestDistinct(target, length) {
  let distance = Infinity;
  const winners = [];
  for (const value of distinctNumbers(length)) {
    const gap = Math.abs(value - target);
    if (gap < distance) {
      distance = gap;
      winners.length = 0;
      winners.push(value);
    } else if (gap === distance) {
      winners.push(value);
    }
  }
  return { distance, winners };
}

function countEqualDigitsUpTo(limit, higherExponent, lowerExponent) {
  if (limit < 0) return 0;
  const digits = String(limit).split("").map(Number);
  const higherIndex = digits.length - higherExponent - 1;
  const lowerIndex = digits.length - lowerExponent - 1;
  const memo = new Map();
  function visit(index, tight, remembered) {
    if (index === digits.length) return 1;
    const key = `${index}|${tight ? 1 : 0}|${remembered}`;
    if (!tight && memo.has(key)) return memo.get(key);
    const maximum = tight ? digits[index] : 9;
    let total = 0;
    for (let digit = 0; digit <= maximum; digit += 1) {
      if (index === lowerIndex && digit !== remembered) continue;
      const nextRemembered = index === higherIndex ? digit : remembered;
      total += visit(index + 1, tight && digit === maximum, nextRemembered);
    }
    if (!tight) memo.set(key, total);
    return total;
  }
  return visit(0, true, -1);
}

function countDigitSequences(length, target) {
  let counts = Array(target + 1).fill(0);
  counts[0] = 1;
  for (let index = 0; index < length; index += 1) {
    const next = Array(target + 1).fill(0);
    for (let sum = 0; sum <= target; sum += 1) {
      for (let digit = 0; digit <= 9 && sum + digit <= target; digit += 1) next[sum + digit] += counts[sum];
    }
    counts = next;
  }
  return counts[target];
}

function independentRepeatedSymbols(payload) {
  const values = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 1; d <= 9; d += 1) {
    if (new Set([a, b, c, d]).size !== 4) continue;
    if (3 * a + b + c + d !== payload.total || b !== c + payload.delta || d <= Math.max(a, b, c)) continue;
    values.push(100 * a + 10 * c + d);
  }
  const unique = [...new Set(values)].sort((left, right) => left - right);
  assert(unique.join("|") === payload.candidates.join("|"), "기호 조건을 만족하는 세 자리 수 목록이 다릅니다.");
  return unique.map(formatInteger).join(", ");
}

function independentSmallestAllDifferent(payload) {
  const values = [];
  for (let hundreds = 0; hundreds <= 9; hundreds += 1) {
    const hundredMillions = payload.multiplier * hundreds;
    if (hundredMillions > 9) continue;
    for (let thousands = 0; thousands <= 9; thousands += 1) {
      const tens = payload.pairSum - thousands;
      if (tens < 0 || tens > 9) continue;
      const fixed = [hundredMillions, payload.fixedA, payload.fixedB, thousands, hundreds, tens];
      if (new Set(fixed).size !== fixed.length) continue;
      const remaining = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => !fixed.includes(digit));
      function permute(unused, placed = []) {
        if (!unused.length) {
          const digits = Array(10);
          digits[1] = hundredMillions;
          digits[2] = payload.fixedA;
          digits[5] = payload.fixedB;
          digits[6] = thousands;
          digits[7] = hundreds;
          digits[8] = tens;
          [0, 3, 4, 9].forEach((position, index) => { digits[position] = placed[index]; });
          if (digits[0]) values.push(digits.join(""));
          return;
        }
        for (let index = 0; index < unused.length; index += 1) permute([...unused.slice(0, index), ...unused.slice(index + 1)], [...placed, unused[index]]);
      }
      permute(remaining);
    }
  }
  values.sort();
  assert(values.length === payload.candidateCount, "모든 숫자가 다른 수의 후보 개수가 다릅니다.");
  assert(values[0] === payload.answerText, "모든 숫자가 다른 가장 작은 수가 다릅니다.");
  return formatInteger(values[0]);
}

function independentLargestDistinct(payload) {
  const selected = new Set(payload.selectedPositions);
  const digits = [];
  let answer = "";
  function visit(index, usedMask, sum) {
    if (index === payload.length) {
      if (sum === payload.target) answer = digits.join("");
      return Boolean(answer);
    }
    for (let digit = 9; digit >= 0; digit -= 1) {
      if ((usedMask & (1 << digit)) || (index === 0 && digit === 0)) continue;
      const next = sum + (selected.has(index) ? digit : 0);
      if (next > payload.target) continue;
      digits.push(digit);
      if (visit(index + 1, usedMask | (1 << digit), next)) return true;
      digits.pop();
    }
    return false;
  }
  visit(0, 0, 0);
  assert(answer, "서로 다른 숫자로 만든 가장 큰 수를 찾지 못했습니다.");
  return formatInteger(answer);
}

function combinations(values, count, start = 0, selected = [], output = []) {
  if (selected.length === count) {
    output.push([...selected]);
    return output;
  }
  for (let index = start; index <= values.length - (count - selected.length); index += 1) {
    selected.push(values[index]);
    combinations(values, count, index + 1, selected, output);
    selected.pop();
  }
  return output;
}

function independentSkipLargest(payload) {
  const reference = BigInt(payload.start) + BigInt(payload.jumps) * BigInt(payload.step);
  assert(reference === BigInt(payload.reference), "뛰어 센 수가 다릅니다.");
  const digitAt = (value, exponent) => Number(value / 10n ** BigInt(exponent) % 10n);
  const fixedReference = new Map(payload.fixedExponents.map(exponent => [14 - exponent, digitAt(reference, exponent)]));
  const maxima = [];
  for (let lower = 0; lower * payload.multiplier <= 9; lower += 1) {
    const fixed = new Map(fixedReference);
    fixed.set(14 - payload.relationHigherExponent, lower * payload.multiplier);
    fixed.set(14 - payload.relationLowerExponent, lower);
    const fixedOnes = [...fixed.values()].filter(digit => digit === 1).length;
    const needed = payload.oneCount - fixedOnes;
    const free = Array.from({ length: 15 }, (_, index) => index).filter(index => !fixed.has(index));
    if (needed < 0 || needed > free.length) continue;
    for (const onePositions of combinations(free, needed)) {
      const ones = new Set(onePositions);
      const digits = Array.from({ length: 15 }, (_, index) => fixed.has(index) ? fixed.get(index) : ones.has(index) ? 1 : 9);
      if (digits[0]) maxima.push(digits.join(""));
    }
  }
  maxima.sort();
  assert(maxima.length, "뛰어 센 수의 자리 조건을 만족하는 수가 없습니다.");
  return formatInteger(maxima[maxima.length - 1]);
}

function independentAnswer(kind, payload) {
  if (kind === "nearest-distinct-digit-between-count") {
    const checked = payload.targets.map(target => nearestDistinct(target, payload.length));
    checked.forEach((item, index) => {
      assert(item.winners.length === 1, "가장 가까운 수가 하나가 아닙니다.");
      assert(item.winners[0] === payload.nearest[index] && item.distance === payload.distances[index], "가장 가까운 수 또는 거리가 다릅니다.");
    });
    return formatInteger(checked[1].winners[0] - checked[0].winners[0] - 1);
  }
  if (kind === "matching-two-place-digits-in-range") {
    const count = countEqualDigitsUpTo(payload.upper - 1, payload.higherExponent, payload.lowerExponent) - countEqualDigitsUpTo(payload.lower, payload.higherExponent, payload.lowerExponent);
    return formatInteger(count);
  }
  if (kind === "swap-leading-digits-from-difference") {
    const placeGap = 10 ** payload.higherExponent - 10 ** payload.lowerExponent;
    const digitGap = payload.difference / placeGap;
    assert(Number.isInteger(digitGap), "자리 교환으로 생긴 차가 정확히 나누어지지 않습니다.");
    const high = (payload.digitTotal + digitGap) / 2;
    const low = (payload.digitTotal - digitGap) / 2;
    assert(Number.isInteger(high) && Number.isInteger(low) && high > low, "두 자리 숫자가 하나로 정해지지 않습니다.");
    return formatInteger(`${high}${low}${payload.suffix}`);
  }
  if (kind === "bounded-digit-sum-count") {
    let pairWays = 0;
    for (let first = 0; first <= 9; first += 1) for (let second = 0; second <= 9; second += 1) if (first + second === payload.pairTarget) pairWays += 1;
    const remainingWays = countDigitSequences(payload.remainingPositions, payload.remainingTarget);
    assert(pairWays === payload.pairWays && remainingWays === payload.remainingWays, "자리 숫자 합을 만드는 방법 수가 다릅니다.");
    return formatInteger(pairWays * remainingWays);
  }
  if (kind === "repeated-symbol-possibilities") return independentRepeatedSymbols(payload);
  if (kind === "place-value-ratio-two-blanks") {
    assert(payload.higherExponent - payload.lowerExponent === 4, "두 빈칸의 자릿값 간격이 10,000배가 아닙니다.");
    const otherSum = payload.digits.reduce((sum, digit, index) => index === payload.higherIndex || index === payload.lowerIndex ? sum : sum + digit, 0);
    const blankTotal = payload.total - otherSum;
    assert(blankTotal % 2 === 0 && blankTotal / 2 >= 0 && blankTotal / 2 <= 9, "두 빈칸의 숫자가 하나로 정해지지 않습니다.");
    const blank = blankTotal / 2;
    return `${blank}, ${blank}`;
  }
  if (kind === "reverse-add-max-digit-sum") {
    const rows = [];
    for (let blank = 0; blank <= 9; blank += 1) {
      const text = `${payload.pattern.slice(0, payload.blankIndex)}${blank}${payload.pattern.slice(payload.blankIndex + 1)}`;
      const reversed = [...text].reverse().join("");
      const sum = String(BigInt(text) + BigInt(reversed));
      rows.push({ blank, digitSum: [...sum].reduce((total, digit) => total + Number(digit), 0) });
    }
    const maximum = Math.max(...rows.map(row => row.digitSum));
    const winners = rows.filter(row => row.digitSum === maximum);
    assert(winners.length === 1, "합의 자리 숫자 합이 가장 큰 빈칸이 하나가 아닙니다.");
    return String(winners[0].blank);
  }
  if (kind === "palindrome-consecutive-zero-number") {
    const values = [];
    for (let first = 1; first <= 9; first += 1) for (let second = 1; second <= 9; second += 1) for (let third = 1; third <= 9; third += 1) {
      const digits = [first, second, third, 0, 0, 0, 0, third, second, first];
      if (first === payload.multiplier * second && digits.reduce((sum, digit) => sum + digit, 0) === payload.total) values.push(digits.join(""));
    }
    assert(values.length === 1, `거꾸로 써도 같은 수가 ${values.length}개입니다.`);
    return formatInteger(values[0]);
  }
  if (kind === "smallest-all-different-number") return independentSmallestAllDifferent(payload);
  if (kind === "largest-distinct-position-sum") return independentLargestDistinct(payload);
  if (kind === "skip-count-place-match-largest") return independentSkipLargest(payload);
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditOriginalAnchors() {
  const high = nearestDistinct(500000, 6);
  const low = nearestDistinct(200000, 6);
  check(high.winners.join("|") === "501234" && high.distance === 1234, "원문 본문의 50만에 가장 가까운 수가 501234가 아닙니다.");
  check(low.winners.join("|") === "198765" && low.distance === 1235, "원문 본문의 20만에 가장 가까운 수가 198765가 아닙니다.");
  check(high.winners[0] - low.winners[0] - 1 === 302468, "원문 본문의 두 수 사이 자연수 개수가 다릅니다.");

  const exampleOne = countEqualDigitsUpTo(12501733, 4, 3) - countEqualDigitsUpTo(12374810, 4, 3);
  check(exampleOne === 14000, `원문 예제 5-1의 답이 다릅니다: ${exampleOne}`);
  check((8 - 6) * 9000000 === 18000000 && 8 + 6 === 14, "원문 예제 5-2의 자리 교환 조건이 다릅니다.");
  check(86283451 - 68283451 === 18000000, "원문 예제 5-2의 답이 다릅니다.");
  const exampleThreePairs = [];
  for (let tenBillions = 0; tenBillions <= 9; tenBillions += 1) {
    for (let hundredMillions = 0; hundredMillions <= 9; hundredMillions += 1) {
      if (tenBillions + hundredMillions === 8) exampleThreePairs.push([tenBillions, hundredMillions]);
    }
  }
  const exampleThreeTailWays = countDigitSequences(8, 1);
  check(exampleThreePairs.length === 9 && exampleThreeTailWays === 8 && exampleThreePairs.length * exampleThreeTailWays === 72, "원문 예제 5-3의 답이 다릅니다.");
  check(independentRepeatedSymbols({ total: 15, delta: 2, candidates: [126, 215] }) === "126, 215", "원문 예제 5-4의 답이 다릅니다.");
  check(3 * 1000000 === 3 * 100 * 10000 && 8 + 0 + 3 + 3 + 2 + 4 + 3 + 7 + 0 === 30, "원문 Mission 1의 답이 다릅니다.");

  const missionTwoRows = [];
  for (let blank = 0; blank <= 9; blank += 1) {
    const text = `84${blank}37516`;
    const sum = String(BigInt(text) + BigInt([...text].reverse().join("")));
    missionTwoRows.push({ blank, digitSum: [...sum].reduce((total, digit) => total + Number(digit), 0) });
  }
  const missionTwoMaximum = Math.max(...missionTwoRows.map(row => row.digitSum));
  check(missionTwoRows.filter(row => row.digitSum === missionTwoMaximum).map(row => row.blank).join("|") === "3", "원문 Mission 2의 답이 3이 아닙니다.");
  check(missionTwoRows.find(row => row.blank === 3).digitSum === 38, "원문 Mission 2의 가장 큰 자리 숫자 합이 38이 아닙니다.");

  check(independentAnswer("palindrome-consecutive-zero-number", { multiplier: 3, total: 10 }) === "3,110,000,113", "원문 Mission 3의 답이 다릅니다.");
  check(independentSmallestAllDifferent({ fixedA: 4, fixedB: 7, multiplier: 4, pairSum: 9, candidateCount: 84, answerText: "1840573269" }) === "1,840,573,269", "원문 Mission 4의 답이 다릅니다.");
  check(independentLargestDistinct({ length: 6, selectedPositions: [1, 3, 5], target: 22 }) === "895,746", "원문 Mission 5의 답이 다릅니다.");

  const start = 54n * 10n ** 12n + 306n * 10n ** 8n + 384n * 10n ** 4n;
  const step = 40n * 10n ** 8n + 8000n * 10n ** 4n;
  const reference = start + 6n * step;
  const referenceDigitAt = exponent => Number(reference / 10n ** BigInt(exponent) % 10n);
  const missionSix = independentSkipLargest({ start: String(start), step: String(step), jumps: 6, reference: String(reference), fixedExponents: [10, 7, 4], relationHigherExponent: 9, relationLowerExponent: 5, multiplier: 2, oneCount: 4 });
  check(reference === 54055083840000n, "원문 Mission 6의 6번 뛰어 센 수가 다릅니다.");
  check([10, 7, 4].map(referenceDigitAt).join("|") === "5|8|4", "원문 Mission 6에서 새 수와 각각 맞춰야 할 자리 숫자가 다릅니다.");
  check(missionSix === "999,958,989,441,111", `원문 Mission 6의 답이 다릅니다: ${missionSix}`);
}

function auditPromptStructure(variant, prompt) {
  const required = [
    ["같은 숫자를 두 번 쓰지 않고", "가장 가까운", "사이에는 자연수"],
    ["보다 크고", "보다 작은", "만의 자리 숫자", "천의 자리 숫자"],
    ["서로 바꾸었더니", "처음 수보다", "가와 나의 합"],
    ["각 자리 숫자의 합", "자리 숫자와", "source41-condition-list"],
    ["서로 다른 글자는 서로 다른 숫자", "가-다-라", "source41-symbol-number"],
    ["10,000배", "각 자리 숫자의 합", "source41-symbol-number"],
    ["거꾸로 써서", "자리 숫자를 다시 모두 더", "source41-masked-number"],
    ["거꾸로 써도 같은", "숫자 0이 4개", "source41-condition-list"],
    ["서로 다른 10자리", "가장 작은", "source41-condition-list"],
    ["각 자리 숫자가 모두 다른", "가장 큰"],
    ["15자리", "번 뛰어 세어", "백억의 자리", "숫자 1"]
  ][variant];
  required.forEach(marker => assert(prompt.includes(marker), `문제 구조 표지 '${marker}'가 없습니다.`));
}

auditOriginalAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 5);
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

const minimumDiversity = [12, 40, 40, 40, 18, 40, 40, 8, 40, 15, 40];
for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= minimumDiversity[variant], `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 부족합니다 (${promptSets[variant][difficultyIndex].size}).`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 깊이가 커지지 않습니다 (${averages.join(", ")}).`);
}

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 5 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 5 감사 통과: 11원문 구조 · ${generatedCount.toLocaleString()}회 독립 계산 · 원문 기준값 11종 · 예제 5-3은 72개 · Mission 6 대응 자리는 5·8·4 · 가장 가까운 수와 Mission 2 답안 충돌 바로잡음`);
