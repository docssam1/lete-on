"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberTwo";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u1-e2-exploration",
  "4-1-u1-e2-example-2-1",
  "4-1-u1-e2-example-2-2",
  "4-1-u1-e2-example-2-3",
  "4-1-u1-e2-example-2-4",
  "4-1-u1-e2-mission-1",
  "4-1-u1-e2-mission-2",
  "4-1-u1-e2-mission-3",
  "4-1-u1-e2-mission-4",
  "4-1-u1-e2-mission-5",
  "4-1-u1-e2-mission-6"
];
const expectedKinds = [
  "comparison-triple-count",
  "common-digit-sum",
  "mixed-representation-desc",
  "bounded-fixed-digit-count",
  "masked-largest-fill-order",
  "single-comparison-digit-list",
  "wildcard-number-order",
  "two-symbol-common-digits",
  "chained-two-symbol-count",
  "mixed-representation-asc",
  "mixed-distance-table-order"
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

function power(exponent) {
  return 10n ** BigInt(exponent);
}

function compare(left, right, relation) {
  return relation === "<" ? BigInt(left) < BigInt(right) : BigInt(left) > BigInt(right);
}

function fillPattern(pattern, replacements) {
  let replacementIndex = 0;
  return String(pattern).split("").map(character => character === "□"
    ? String(replacements[replacementIndex++])
    : character).join("");
}

function enumeratePattern(pattern) {
  const characters = String(pattern).split("");
  const blankIndices = characters.map((character, index) => character === "□" ? index : -1).filter(index => index >= 0);
  const values = [];
  const visit = position => {
    if (position === blankIndices.length) {
      values.push(characters.join(""));
      return;
    }
    const index = blankIndices[position];
    for (let digit = index === 0 ? 1 : 0; digit <= 9; digit += 1) {
      characters[index] = String(digit);
      visit(position + 1);
    }
    characters[index] = "□";
  };
  visit(0);
  return values;
}

function validDigits(item) {
  return Array.from({ length: 10 }, (_, digit) => digit).filter(digit =>
    compare(item.left, fillPattern(item.pattern, [digit]), item.relation)
  );
}

function maximumDistinctDigitFill(pattern) {
  const characters = String(pattern).split("");
  const blankIndices = characters.map((character, index) => character === "□" ? index : -1).filter(index => index >= 0);
  const fixedDigits = characters.filter(character => character !== "□").map(Number);
  assert(new Set(fixedDigits).size === fixedDigits.length, "이미 쓰인 숫자가 겹칩니다.");
  const available = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => !fixedDigits.includes(digit));
  const used = Array(available.length).fill(false);
  let maximum = null;
  const visit = position => {
    if (position === blankIndices.length) {
      const value = characters.join("");
      if (value[0] !== "0" && (maximum === null || BigInt(value) > BigInt(maximum))) maximum = value;
      return;
    }
    for (let index = 0; index < available.length; index += 1) {
      if (used[index]) continue;
      used[index] = true;
      characters[blankIndices[position]] = String(available[index]);
      visit(position + 1);
      used[index] = false;
    }
    characters[blankIndices[position]] = "□";
  };
  visit(0);
  assert(maximum !== null, "가장 큰 수를 만들 수 없습니다.");
  return maximum;
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

function independentAnswer(kind, payload) {
  if (kind === "comparison-triple-count") {
    return String(enumeratePattern(payload.pattern).filter(value => compare(payload.left, value, payload.relation)).length);
  }
  if (kind === "common-digit-sum") {
    const common = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => payload.comparisons.every(item => validDigits(item).includes(digit)));
    return String(common.reduce((sum, digit) => sum + digit, 0));
  }
  if (kind === "mixed-representation-desc") {
    return payload.values.map((value, index) => ({ value: BigInt(value), label: ["㉠", "㉡", "㉢", "㉣"][index] }))
      .sort((left, right) => left.value > right.value ? -1 : 1).map(item => item.label).join(", ");
  }
  if (kind === "bounded-fixed-digit-count") {
    const freeExponent = Math.min(...payload.conditions.map(item => item.exponent));
    const prefixScale = power(Math.max(...payload.conditions.map(item => item.exponent)) + 1);
    const prefix = BigInt(payload.lower) / prefixScale;
    let count = 0;
    for (let suffix = 0n; suffix < power(freeExponent); suffix += 1n) {
      const value = prefix * prefixScale
        + BigInt(payload.conditions[0].digit) * power(payload.conditions[0].exponent)
        + BigInt(payload.conditions[1].digit) * power(payload.conditions[1].exponent)
        + suffix;
      if (value > BigInt(payload.lower) && value < BigInt(payload.upper) && String(value).length === payload.digitLength) count += 1;
    }
    return formatInteger(count);
  }
  if (kind === "masked-largest-fill-order") {
    const rows = payload.patterns.map((pattern, index) => ({ maximum: BigInt(maximumDistinctDigitFill(pattern)), name: payload.names[index] }));
    assert(new Set(rows.map(row => String(row.maximum))).size === rows.length, "가장 큰 수에 동점이 있습니다.");
    return rows.sort((left, right) => left.maximum > right.maximum ? -1 : 1).map(row => row.name).join(", ");
  }
  if (kind === "single-comparison-digit-list") {
    return validDigits(payload).join(", ");
  }
  if (kind === "wildcard-number-order") {
    const rows = payload.patterns.map((pattern, index) => {
      const candidates = enumeratePattern(pattern).map(BigInt);
      return { minimum: candidates[0], maximum: candidates[candidates.length - 1], label: payload.labels[index] };
    }).sort((left, right) => left.minimum > right.minimum ? -1 : 1);
    for (let index = 0; index < rows.length - 1; index += 1) {
      assert(rows[index].minimum > rows[index + 1].maximum, "가려진 숫자에 따라 순서가 달라집니다.");
    }
    return rows.map(row => row.label).join(", ");
  }
  if (kind === "two-symbol-common-digits") {
    return Array.from({ length: 10 }, (_, digit) => digit)
      .filter(digit => payload.comparisons.every(item => validDigits(item).includes(digit))).join(", ");
  }
  if (kind === "chained-two-symbol-count") {
    let count = 0;
    for (let square = 0; square <= 9; square += 1) for (let circle = 0; circle <= 9; circle += 1) {
      const squareValue = fillPattern(payload.squarePattern, [square]);
      const circleValue = fillPattern(payload.circlePattern, [circle]);
      if (BigInt(payload.top) > BigInt(squareValue) && BigInt(squareValue) > BigInt(payload.middle) && BigInt(payload.middle) > BigInt(circleValue)) count += 1;
    }
    return String(count);
  }
  if (kind === "mixed-representation-asc") {
    return payload.values.map((value, index) => ({ value: BigInt(value), label: ["㉠", "㉡", "㉢", "㉣"][index] }))
      .sort((left, right) => left.value < right.value ? -1 : 1).map(item => item.label).join(", ");
  }
  if (kind === "mixed-distance-table-order") {
    return payload.values.map((value, index) => ({ value: BigInt(value), label: payload.labels[index] }))
      .sort((left, right) => left.value < right.value ? -1 : 1).map(item => item.label).join(", ");
  }
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditPromptStructure(variant, prompt) {
  const required = [
    ["세 □", "몇 가지"],
    ["공통", "합"],
    ["큰 수부터", "㉠", "㉣"],
    ["자리 자연수", "자리 숫자", "몇 개"],
    ["이미 쓰인 숫자는 그대로", "가장 큰", "학생"],
    ["들어갈 수 있는 숫자를 모두", "□"],
    ["어느 숫자를 넣어도", "큰 수부터"],
    ["㉠과 ㉡", "공통"],
    ["□와 ○", "몇 가지"],
    ["작은 수부터", "㉠", "㉣"],
    ["태양에서 가까운", "거리(km)", "(아)"]
  ][variant];
  required.forEach(marker => assert(prompt.includes(marker), `문제 구조 표지 '${marker}'가 없습니다.`));
}

function auditOriginalAnchors() {
  const exploration = enumeratePattern("85□2□4□061").filter(value => 8572847065n < BigInt(value)).length;
  check(exploration === 212, `원문 개념탐구 경우의 수는 212여야 하나 ${exploration}입니다.`);

  const exampleComparisons = [
    { left: "83493250", pattern: "8□945164", relation: "<" },
    { left: "1720645283", pattern: "1720□64195", relation: ">" }
  ];
  const common = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => exampleComparisons.every(item => validDigits(item).includes(digit)));
  check(common.join(",") === "3,4,5" && common.reduce((sum, digit) => sum + digit, 0) === 12, "원문 예제 2-1의 공통 숫자와 합이 다릅니다.");

  let boundedCount = 0;
  for (let value = 1932001; value < 2000000; value += 1) {
    const text = String(value);
    if (text[text.length - 5] === "7" && text[text.length - 4] === "5") boundedCount += 1;
  }
  check(boundedCount === 1000, `원문 예제 2-3의 답은 1000이어야 하나 ${boundedCount}입니다.`);

  const sourcePatterns = [
    ["광수", "4□5□68□"],
    ["수민", "46□□0□3"],
    ["민우", "4□39□26"],
    ["우경", "4□□6318"]
  ];
  const sourceOrder = sourcePatterns.map(([name, pattern]) => ({ name, maximum: BigInt(maximumDistinctDigitFill(pattern)) }))
    .sort((left, right) => left.maximum > right.maximum ? -1 : 1).map(item => item.name).join(", ");
  check(sourceOrder === "우경, 광수, 민우, 수민", `원문 예제 2-4의 순서가 다릅니다: ${sourceOrder}`);

  const mixedExampleOrder = [
    { label: "가", value: 12530109850n },
    { label: "나", value: 1240000000n },
    { label: "다", value: 12700325670n },
    { label: "라", value: 1350925000n }
  ].sort((left, right) => left.value > right.value ? -1 : 1).map(item => item.label).join(", ");
  check(mixedExampleOrder === "다, 가, 라, 나", `원문 예제 2-2의 순서가 다릅니다: ${mixedExampleOrder}`);

  const missionOne = validDigits({ left: "739165840", pattern: "73916□910", relation: ">" }).join(", ");
  check(missionOne === "0, 1, 2, 3, 4", `원문 Mission 1의 숫자가 다릅니다: ${missionOne}`);

  const missionThreeComparisons = [
    { left: "64593236", pattern: "6□498301", relation: "<" },
    { left: "1005667943", pattern: "1005□75642", relation: ">" }
  ];
  const missionThree = Array.from({ length: 10 }, (_, digit) => digit)
    .filter(digit => missionThreeComparisons.every(item => validDigits(item).includes(digit))).join(", ");
  check(missionThree === "5", `원문 Mission 3의 공통 숫자가 다릅니다: ${missionThree}`);

  let chainCount = 0;
  for (let square = 0; square <= 9; square += 1) for (let circle = 0; circle <= 9; circle += 1) {
    if (788425463n > BigInt(`78${square}619325`) && BigInt(`78${square}619325`) > 786518454n && 786518454n > BigInt(`786518${circle}52`)) chainCount += 1;
  }
  check(chainCount === 10, `원문 Mission 4의 방법 수는 10이어야 하나 ${chainCount}입니다.`);

  const missionFiveOrder = [
    { label: "ㄱ", value: 4576387n },
    { label: "ㄴ", value: 45624004n },
    { label: "ㄷ", value: 45820093n },
    { label: "ㄹ", value: 45929325n }
  ].sort((left, right) => left.value < right.value ? -1 : 1).map(item => item.label).join(", ");
  check(missionFiveOrder === "ㄱ, ㄴ, ㄷ, ㄹ", `원문 Mission 5의 순서가 다릅니다: ${missionFiveOrder}`);

  const missionSixOrder = [
    { label: "(가)", value: 149600000n },
    { label: "(나)", value: 57910000n },
    { label: "(다)", value: 778340000n },
    { label: "(라)", value: 1426670000n },
    { label: "(마)", value: 4498400000n },
    { label: "(바)", value: 2870660000n },
    { label: "(사)", value: 227940000n },
    { label: "(아)", value: 108210000n }
  ].sort((left, right) => left.value < right.value ? -1 : 1).map(item => item.label).join(", ");
  check(missionSixOrder === "(나), (아), (가), (사), (다), (라), (바), (마)", `원문 Mission 6의 순서가 다릅니다: ${missionSixOrder}`);
}

auditOriginalAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 2);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서가 다릅니다.");
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
        assert(!/undefined|null|NaN|Infinity/.test(`${generated.prompt} ${generated.answer} ${generated.solution}`), "잘못된 값이 노출됩니다.");
        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `검산 구조가 ${evidence.kind}입니다.`);
        assert(Number(evidence.payload.variant) === variant && Number(evidence.payload.level) === difficultyIndex, "분기·난이도 자료가 다릅니다.");
        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(String(generated.answer) === independent, `독립 계산 ${independent}와 생성 정답 ${generated.answer}이 다릅니다.`);
        assert(evidence.declared === independent, `숨은 검산 정답 ${evidence.declared}과 독립 계산 ${independent}이 다릅니다.`);
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
    check(promptSets[variant][difficultyIndex].size >= 180, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 부족합니다.`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 깊이가 커지지 않습니다 (${averages.join(", ")}).`);
}

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 2 감사 통과: 11원문 구조 · ${generatedCount.toLocaleString()}회 독립 계산 · 원문 기준값 10종 대조`);
