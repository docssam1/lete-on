"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberFour";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u1-e4-exploration",
  "4-1-u1-e4-example-4-1",
  "4-1-u1-e4-example-4-2",
  "4-1-u1-e4-example-4-3",
  "4-1-u1-e4-example-4-4",
  "4-1-u1-e4-mission-1",
  "4-1-u1-e4-mission-2",
  "4-1-u1-e4-mission-3",
  "4-1-u1-e4-mission-4",
  "4-1-u1-e4-mission-5",
  "4-1-u1-e4-mission-6"
];
const expectedKinds = [
  "banknote-stack-height",
  "check-count-difference",
  "zero-count-in-written-range",
  "concatenated-natural-last-three",
  "coin-ratio-from-total",
  "production-length-unit-change",
  "digit-count-difference-in-concatenation",
  "annual-growth-first-year-over-target",
  "coin-stack-height-from-money",
  "group-monthly-saving-duration",
  "minimum-money-piece-exchange"
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

function buildDigitPrefix(maximum, targetDigit) {
  const prefix = new Uint32Array(maximum + 1);
  const target = String(targetDigit);
  for (let value = 1; value <= maximum; value += 1) {
    let count = 0;
    for (const digit of String(value)) if (digit === target) count += 1;
    prefix[value] = prefix[value - 1] + count;
  }
  return prefix;
}

const zeroPrefix = buildDigitPrefix(150000, 0);
const onePrefix = buildDigitPrefix(5000, 1);
const ninePrefix = buildDigitPrefix(5000, 9);

function independentMinimumExchange(payload) {
  const originalDenominations = payload.originalDenominations.map(BigInt);
  const originalCounts = payload.originalCounts.map(BigInt);
  const total = originalDenominations.reduce((sum, denomination, index) => sum + denomination * originalCounts[index], 0n);
  assert(total === BigInt(payload.totalAmount), "돈의 종류별 합계가 저장된 매출액과 다릅니다.");
  assert(total % 1000n === 0n, "천 원 단위로 정확히 바꿀 수 없는 매출액입니다.");

  const millionCount = total / 1000000n;
  const remainder = total % 1000000n;
  const candidates = [];
  for (let fifty = 0n; fifty < 20n; fifty += 1n) {
    for (let ten = 0n; ten < 5n; ten += 1n) {
      for (let five = 0n; five < 2n; five += 1n) {
        const used = fifty * 50000n + ten * 10000n + five * 5000n;
        const left = remainder - used;
        if (left < 0n || left % 1000n !== 0n) continue;
        const thousand = left / 1000n;
        if (thousand >= 5n) continue;
        candidates.push({ counts: [millionCount, fifty, ten, five, thousand], pieces: millionCount + fifty + ten + five + thousand });
      }
    }
  }
  assert(candidates.length > 0, "주어진 돈으로 바꾸는 조합을 찾지 못했습니다.");
  const minimum = candidates.reduce((value, candidate) => candidate.pieces < value ? candidate.pieces : value, candidates[0].pieces);
  const winners = candidates.filter(candidate => candidate.pieces === minimum);
  assert(winners.length === 1, `가장 적은 장수의 조합이 ${winners.length}개입니다.`);
  assert(winners[0].counts.map(String).join("|") === payload.exchangeCounts.join("|"), "가장 적은 장수의 돈 구성과 생성 자료가 다릅니다.");
  return formatInteger(minimum);
}

function independentAnswer(kind, payload) {
  if (kind === "banknote-stack-height") {
    const amount = BigInt(payload.amountWon);
    const noteValue = BigInt(payload.noteValue);
    const groupNotes = BigInt(payload.groupNotes);
    assert(amount % noteValue === 0n, "금액을 지폐 수로 정확히 바꿀 수 없습니다.");
    const notes = amount / noteValue;
    assert(notes % groupNotes === 0n, "지폐를 주어진 장수의 묶음으로 나눌 수 없습니다.");
    const centimeters = notes / groupNotes * BigInt(payload.thickness);
    assert(centimeters === BigInt(payload.totalCentimeters) && centimeters % 100000n === 0n, "지폐 높이 또는 km 단위가 맞지 않습니다.");
    return formatInteger(centimeters / 100000n);
  }
  if (kind === "check-count-difference") {
    const amount = BigInt(payload.amount);
    const highValue = BigInt(payload.highValue);
    const lowValue = BigInt(payload.lowValue);
    const counts = [];
    for (let high = 0n; high <= amount / highValue; high += 1n) {
      const left = amount - high * highValue;
      if (left % lowValue === 0n) counts.push(high + left / lowValue);
    }
    assert(counts.length > 0, "두 종류의 돈으로 금액을 바꾸지 못했습니다.");
    const minimum = counts.reduce((left, right) => left < right ? left : right);
    const maximum = counts.reduce((left, right) => left > right ? left : right);
    assert(counts.filter(value => value === minimum).length === 1 && counts.filter(value => value === maximum).length === 1, "가장 많거나 적은 장수가 하나로 정해지지 않습니다.");
    return formatInteger(maximum - minimum);
  }
  if (kind === "zero-count-in-written-range") {
    assert(payload.start >= 1 && payload.end <= 150000 && payload.start <= payload.end, "숫자 0 전수 세기 범위를 벗어났습니다.");
    const total = zeroPrefix[payload.end] - zeroPrefix[payload.start - 1];
    assert(payload.placeCounts.reduce((sum, [, count]) => sum + count, 0) === total, "자리별 0의 개수를 더한 값이 전수 검사와 다릅니다.");
    return formatInteger(total);
  }
  if (kind === "concatenated-natural-last-three") {
    const written = Array.from({ length: payload.end }, (_, index) => String(index + 1)).join("");
    assert(written.length === payload.totalDigits, "이어 쓴 수의 전체 자리 수가 다릅니다.");
    return written.slice(-3);
  }
  if (kind === "coin-ratio-from-total") {
    const known = payload.knownRows.reduce((sum, [denomination, count]) => sum + BigInt(denomination) * BigInt(count), 0n);
    assert(known === BigInt(payload.knownAmount), "개수가 알려진 돈의 합이 다릅니다.");
    const left = BigInt(payload.totalAmount) - known;
    const oneGroup = 500n + 100n * BigInt(payload.ratio);
    assert(left > 0n && left % oneGroup === 0n, "두 동전 수의 관계로 개수를 하나로 정할 수 없습니다.");
    return formatInteger(left / oneGroup);
  }
  if (kind === "production-length-unit-change") {
    const beforeMeters = BigInt(payload.beforeMeters);
    assert(beforeMeters % 1000n === 0n, "m로 나타낸 길이를 km로 정확히 바꿀 수 없습니다.");
    const beforeKm = beforeMeters / 1000n;
    const increase = BigInt(payload.afterOneHour) - beforeKm;
    assert(increase > 0n && increase === BigInt(payload.hourlyIncrease), "한 시간에 만든 길이가 다릅니다.");
    return formatInteger(BigInt(payload.afterOneHour) + BigInt(payload.extraHours) * increase);
  }
  if (kind === "digit-count-difference-in-concatenation") {
    assert(payload.end <= 5000 && payload.firstDigit === 1 && payload.secondDigit === 9, "숫자 횟수 전수 세기 조건이 다릅니다.");
    const first = onePrefix[payload.end];
    const second = ninePrefix[payload.end];
    assert(first > second, "첫째 숫자가 더 많이 쓰이지 않았습니다.");
    return formatInteger(first - second);
  }
  if (kind === "annual-growth-first-year-over-target") {
    const span = BigInt(payload.endYear - payload.startYear);
    const start = BigInt(payload.startAmount);
    const increase = BigInt(payload.annualIncrease);
    assert(start + span * increase === BigInt(payload.endAmount), "두 해의 금액으로 구한 한 해 증가액이 다릅니다.");
    let year = payload.startYear;
    let amount = start;
    while (amount <= BigInt(payload.targetAmount)) {
      year += 1;
      amount += increase;
      assert(year - payload.startYear < 100, "목표 금액을 넘는 해를 찾지 못했습니다.");
    }
    assert(amount - increase <= BigInt(payload.targetAmount), "한 해 전에도 이미 목표 금액을 넘었습니다.");
    return String(year);
  }
  if (kind === "coin-stack-height-from-money") {
    const amount = BigInt(payload.amountWon);
    const coinValue = BigInt(payload.coinValue);
    const groupCoins = BigInt(payload.groupCoins);
    assert(amount % coinValue === 0n, "금액을 동전 수로 정확히 바꿀 수 없습니다.");
    const coins = amount / coinValue;
    assert(coins % groupCoins === 0n, "동전을 주어진 개수의 묶음으로 나눌 수 없습니다.");
    const centimeters = coins / groupCoins * BigInt(payload.groupHeight);
    assert(centimeters === BigInt(payload.totalCentimeters) && centimeters % 100000n === 0n, "동전 높이 또는 km 단위가 맞지 않습니다.");
    return formatInteger(centimeters / 100000n);
  }
  if (kind === "group-monthly-saving-duration") {
    const monthly = BigInt(payload.people) * BigInt(payload.monthlyPerPerson);
    assert(monthly === BigInt(payload.monthlyTotal), "한 달 저금액이 다릅니다.");
    const target = BigInt(payload.targetAmount);
    assert(target % monthly === 0n, "목표 금액을 정확한 개월 수로 나눌 수 없습니다.");
    const months = Number(target / monthly);
    return `${Math.floor(months / 12)}년 ${months % 12}개월`;
  }
  if (kind === "minimum-money-piece-exchange") return independentMinimumExchange(payload);
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditPromptStructure(variant, prompt) {
  const required = [
    ["1000원짜리 지폐", "1000장", "몇 km"],
    ["1000만 원짜리 수표", "100만 원짜리 수표", "가장 많을 때"],
    ["숫자 0", "부터", "까지"],
    ["마지막 세 자리", "source41-concat-preview"],
    ["100원짜리 동전", "500원짜리 동전", "source41-money-table"],
    [" m", " km", "앞으로"],
    ["숫자 1", "숫자 9", "source41-concat-preview"],
    ["해마다 같은 금액", "처음으로", "넘는 해"],
    ["10원짜리 동전 100개", "몇 km"],
    ["한 달에", "몇 년 몇 개월"],
    ["100만 원짜리 수표", "가능한 적게", "source41-money-table"]
  ][variant];
  required.forEach(marker => assert(prompt.includes(marker), `문제 구조 표지 '${marker}'가 없습니다.`));
  if (variant === 7) assert(prompt.includes("넘는 해") && !prompt.includes("이상이 되는 해"), "목표 금액을 엄격히 넘는 조건이 흐려졌습니다.");
}

function auditOriginalAnchors() {
  const conceptMoney = 1000n * 100000000n;
  const conceptNotes = conceptMoney / 1000n;
  const conceptCentimeters = conceptNotes / 1000n * 11n;
  check(conceptCentimeters / 100000n === 11n, "원문 개념탐구 4의 올바른 답 11km가 나오지 않습니다.");

  const exampleOneMaximum = 325000000n / 1000000n;
  const exampleOneMinimum = 32n + 5n;
  check(exampleOneMaximum - exampleOneMinimum === 288n, "원문 예제 4-1의 답이 다릅니다.");

  let originalZeroCount = 0;
  for (let value = 100; value <= 10000; value += 1) originalZeroCount += String(value).split("0").length - 1;
  check(originalZeroCount === 2884, `원문 예제 4-2의 답이 다릅니다: ${originalZeroCount}`);

  const originalWritten = Array.from({ length: 155 }, (_, index) => String(index + 1)).join("");
  check(originalWritten.length === 357 && originalWritten.slice(-3) === "155", "원문 예제 4-3의 자리 수 또는 답이 다릅니다.");

  const knownAmount = 10000n * 167n + 1000n * 5842n + 50n * 23454n;
  const originalCoinCount = (10732700n - knownAmount) / 800n;
  check(originalCoinCount === 2560n, "원문 예제 4-4의 답이 다릅니다.");

  const beforeKm = 365792040000n / 1000n;
  const hourly = 365794040n - beforeKm;
  check(365794040n + 5n * hourly === 365804040n, "원문 Mission 1의 답이 다릅니다.");

  const originalOneCount = Array.from({ length: 95 }, (_, index) => String(index + 1)).join("").split("1").length - 1;
  const originalNineCount = Array.from({ length: 95 }, (_, index) => String(index + 1)).join("").split("9").length - 1;
  check(originalOneCount === 20 && originalNineCount === 15 && originalOneCount - originalNineCount === 5, "원문 Mission 2의 답이 다릅니다.");

  const originalAnnual = (370000000n - 290000000n) / 4n;
  let year = 2014;
  let exports = 290000000n;
  while (exports <= 600000000n) {
    year += 1;
    exports += originalAnnual;
  }
  check(year === 2030 && exports - originalAnnual <= 600000000n, "원문 Mission 3의 엄격한 초과 연도가 다릅니다.");

  const originalCoinHeight = (1000n * 100000000n / 10n / 100n * 15n) / 100000n;
  check(originalCoinHeight === 15000n, "원문 Mission 4의 답이 다릅니다.");

  const originalMonths = 8n * 1000000000000n / (50000000n * 1000n);
  check(originalMonths === 160n && `${originalMonths / 12n}년 ${originalMonths % 12n}개월` === "13년 4개월", "원문 Mission 5의 답이 다릅니다.");

  const originalDenominations = [50000n, 10000n, 5000n, 1000n, 500n, 100n];
  const originalCounts = [69n, 529n, 380n, 6473n, 800n, 54860n];
  const originalTotal = originalDenominations.reduce((sum, denomination, index) => sum + denomination * originalCounts[index], 0n);
  check(originalTotal === 22999000n, "원문 Mission 6의 매출 합계가 다릅니다.");
  check(independentMinimumExchange({ originalDenominations: originalDenominations.map(String), originalCounts: originalCounts.map(String), totalAmount: String(originalTotal), exchangeCounts: ["22", "19", "4", "1", "4"] }) === "50", "원문 Mission 6의 최소 장수가 다릅니다.");
}

auditOriginalAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 4);
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
        assert(generated.solution.includes(independent), "풀이에 최종 정답이 없습니다.");
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

for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= 40, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 부족합니다 (${promptSets[variant][difficultyIndex].size}).`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 깊이가 커지지 않습니다 (${averages.join(", ")}).`);
}

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 4 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 4 감사 통과: 11원문 구조 · ${generatedCount.toLocaleString()}회 독립 계산 · 원문 기준값 11종 대조 · 최소 돈 조합 유일성 · 답안 단위 오기 11cm→11km 바로잡음`);
