"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberThree";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u1-e3-exploration",
  "4-1-u1-e3-example-3-1",
  "4-1-u1-e3-example-3-2",
  "4-1-u1-e3-example-3-3",
  "4-1-u1-e3-example-3-4",
  "4-1-u1-e3-mission-1",
  "4-1-u1-e3-mission-2",
  "4-1-u1-e3-mission-3",
  "4-1-u1-e3-mission-4",
  "4-1-u1-e3-mission-5",
  "4-1-u1-e3-mission-6"
];
const expectedKinds = [
  "skip-sequence-nth-from-four",
  "skip-step-from-inside-count",
  "large-number-line-two-targets",
  "correct-decreasing-skip-error",
  "greatest-digit-number-minimum-jumps",
  "large-number-line-far-target",
  "find-step-then-apply",
  "correct-increasing-skip-error",
  "nearest-reachable-skip-value",
  "count-skip-values-between",
  "far-skip-sequence-nth"
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

function formatLarge(value) {
  const units = ["", "만", "억", "조", "경", "해"];
  const signed = BigInt(value);
  const negative = signed < 0n;
  const absolute = negative ? -signed : signed;
  if (absolute < 100000000n) return `${negative ? "-" : ""}${formatInteger(absolute)}`;
  const groups = [];
  let rest = absolute;
  let unitIndex = 0;
  while (rest > 0n) {
    const group = rest % 10000n;
    if (group) groups.push(`${group}${units[unitIndex]}`);
    rest /= 10000n;
    unitIndex += 1;
  }
  return `${negative ? "-" : ""}${groups.reverse().join(" ")}`;
}

function distance(left, right) {
  return left > right ? left - right : right - left;
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
  if (kind === "skip-sequence-nth-from-four" || kind === "far-skip-sequence-nth") {
    const shown = payload.shown.map(BigInt);
    assert(shown.length === 4, "처음 네 수가 모두 저장되지 않았습니다.");
    const differences = shown.slice(1).map((value, index) => value - shown[index]);
    assert(differences.every(value => value === BigInt(payload.step)), "처음 네 수의 간격이 일정하지 않습니다.");
    return formatLarge(BigInt(payload.start) + BigInt(payload.targetIndex - 1) * BigInt(payload.step));
  }
  if (kind === "skip-step-from-inside-count") {
    const difference = BigInt(payload.end) - BigInt(payload.start);
    const intervals = BigInt(payload.insideCount + 1);
    assert(difference % intervals === 0n, "두 끝 수의 차가 간격 수로 나누어떨어지지 않습니다.");
    assert(difference / intervals === BigInt(payload.step), "저장된 뛰는 수가 두 끝 수와 맞지 않습니다.");
    return formatLarge(difference / intervals);
  }
  if (kind === "large-number-line-two-targets") {
    const values = payload.targetIndices.map(index => BigInt(payload.start) + BigInt(index) * BigInt(payload.step));
    assert(values.map(String).join("|") === payload.expectedValues.join("|"), "수직선 목표값 자료가 좌표와 다릅니다.");
    return `(가) ${formatLarge(values[0])}, (나) ${formatLarge(values[1])}`;
  }
  if (kind === "correct-decreasing-skip-error") {
    const start = BigInt(payload.wrongFinal) + BigInt(payload.jumpCount) * BigInt(payload.wrongStep);
    assert(start === BigInt(payload.start), "잘못 센 마지막 수에서 처음 수를 되돌릴 수 없습니다.");
    const demonstration = payload.demonstration.map(BigInt);
    assert(demonstration.slice(1).every((value, index) => demonstration[index] - value === BigInt(payload.correctStep)), "보기의 줄어드는 규칙이 일정하지 않습니다.");
    return formatLarge(start - BigInt(payload.jumpCount) * BigInt(payload.correctStep));
  }
  if (kind === "greatest-digit-number-minimum-jumps") {
    const digits = payload.digits.map(Number);
    assert(new Set(digits).size === digits.length, "수 카드 숫자가 겹칩니다.");
    const greatest = BigInt(digits.slice().sort((left, right) => right - left).join(""));
    assert(greatest === BigInt(payload.greatest), "수 카드로 만든 가장 큰 수가 다릅니다.");
    let value = greatest;
    let jumps = 0n;
    while (value <= BigInt(payload.target)) {
      value += BigInt(payload.step);
      jumps += 1n;
      assert(jumps < 100000n, "최소 뛰는 횟수 전수 검사가 끝나지 않습니다.");
    }
    assert(value - BigInt(payload.step) <= BigInt(payload.target), "한 번 덜 뛰어도 기준 수보다 큽니다.");
    return formatInteger(jumps);
  }
  if (kind === "large-number-line-far-target") {
    return formatLarge(BigInt(payload.lineStart) + BigInt(payload.targetIndex) * BigInt(payload.step));
  }
  if (kind === "find-step-then-apply") {
    const difference = BigInt(payload.firstEnd) - BigInt(payload.firstStart);
    const count = BigInt(payload.firstJumpCount);
    assert(difference % count === 0n, "첫 뛰어 세기의 한 번에 뛰는 수가 자연수가 아닙니다.");
    const step = difference / count;
    assert(step === BigInt(payload.step), "첫 뛰어 세기에서 찾은 간격이 저장값과 다릅니다.");
    return formatLarge(BigInt(payload.secondStart) + BigInt(payload.secondJumpCount) * step);
  }
  if (kind === "correct-increasing-skip-error") {
    const start = BigInt(payload.wrongFinal) - BigInt(payload.jumpCount) * BigInt(payload.wrongStep);
    assert(start === BigInt(payload.start), "잘못 센 마지막 수에서 처음 수를 되돌릴 수 없습니다.");
    return formatLarge(start + BigInt(payload.jumpCount) * BigInt(payload.correctStep));
  }
  if (kind === "nearest-reachable-skip-value") {
    const target = BigInt(payload.target);
    const candidates = payload.candidates.map(BigInt);
    const distances = candidates.map(value => distance(value, target));
    const minimum = distances.reduce((left, right) => left < right ? left : right);
    const nearest = candidates.filter((_, index) => distances[index] === minimum);
    assert(nearest.length === 1, `가장 가까운 수가 ${nearest.length}개입니다.`);
    assert(payload.nearest.length === 1 && BigInt(payload.nearest[0]) === nearest[0], "저장된 가장 가까운 수가 전수 검사와 다릅니다.");
    return formatLarge(nearest[0]);
  }
  if (kind === "count-skip-values-between") {
    const start = BigInt(payload.start);
    const end = BigInt(payload.end);
    const step = BigInt(payload.step);
    let count = 0;
    for (let value = start + step; value < end; value += step) {
      count += 1;
      assert(count < 100000, "두 수 사이의 항 전수 검사가 끝나지 않습니다.");
    }
    assert(start + BigInt(count + 1) * step === end, "끝 수가 같은 뛰어 세기 규칙에 놓이지 않습니다.");
    return String(count);
  }
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditNumberLine(prompt, payload, expectedMarkerCount) {
  const svg = prompt.match(/<svg class="geometry-diagram source41-number-line"[^>]*>[\s\S]*?<\/svg>/)?.[0];
  assert(svg, "큰 수 수직선 SVG가 없습니다.");
  const start = BigInt(attribute(svg, "data-start"));
  const step = BigInt(attribute(svg, "data-step"));
  const intervals = Number(attribute(svg, "data-intervals"));
  assert(start === BigInt(payload.start ?? payload.lineStart), "수직선 시작값이 검산 자료와 다릅니다.");
  assert(step === BigInt(payload.step) && intervals === Number(payload.intervals), "수직선 간격 자료가 검산 자료와 다릅니다.");
  const tickTags = [...svg.matchAll(/<line class="source41-number-line__tick"[^>]*>/g)].map(match => match[0]);
  assert(tickTags.length === intervals + 1, `수직선 눈금이 ${tickTags.length}개뿐입니다.`);
  const tickPositions = tickTags.map((tag, index) => {
    assert(Number(attribute(tag, "data-index")) === index, "수직선 눈금 번호가 순서대로 놓이지 않았습니다.");
    return Number(attribute(tag, "x1"));
  });
  const spacing = (tickPositions[tickPositions.length - 1] - tickPositions[0]) / intervals;
  assert(spacing >= 18, `수직선 눈금 간격이 ${spacing.toFixed(2)}로 너무 좁습니다.`);
  tickPositions.forEach((position, index) => assert(Math.abs(position - (tickPositions[0] + spacing * index)) < 0.01, "수직선 눈금의 화면 간격이 일정하지 않습니다."));
  const markerTags = [...svg.matchAll(/<g class="source41-number-line__marker[^"]*"[^>]*>/g)].map(match => match[0]);
  assert(markerTags.length === expectedMarkerCount, `수직선 표시가 ${markerTags.length}개입니다.`);
  markerTags.forEach(tag => {
    const index = Number(attribute(tag, "data-marker-index"));
    const value = BigInt(attribute(tag, "data-marker-value"));
    assert(index >= 0 && index <= intervals, "수직선 표시가 선 밖에 있습니다.");
    assert(value === start + BigInt(index) * step, "수직선 표시값이 눈금 위치와 다릅니다.");
  });
  assert(!/<text[^>]*>\s*<\/text>/.test(svg), "수직선에 빈 글자가 있습니다.");
}

function auditPromptStructure(variant, prompt) {
  const required = [
    ["처음 네 수", "번째 수", "source41-skip-sequence"],
    ["두 수 사이", "한 번에", "뛰어"],
    ["수직선", "(가)", "(나)"],
    ["잘못하여", "작게", "바르게"],
    ["숫자를 한 번씩", "가장 큰", "적어도"],
    ["수직선", "㉠", "같은 간격"],
    ["번 크게", "같은 규칙", "구하세요"],
    ["잘못하여", "크게", "바르게"],
    ["가장 가까운 수", "뛰어"],
    ["두 끝 수는 세지 않습니다", "사이에"],
    ["규칙으로 뛰어", "번째 수", "source41-skip-sequence"]
  ][variant];
  required.forEach(marker => assert(prompt.includes(marker), `문제 구조 표지 '${marker}'가 없습니다.`));
  if (variant === 4) assert(prompt.includes("보다 큰 수") && !prompt.includes("이상"), "기준 수를 넘는 조건이 엄밀하지 않습니다.");
}

function auditOriginalAnchors() {
  const exploration = 27539n + 999n * 14062n;
  check(exploration === 14075477n, `원문 개념탐구 3의 답이 다릅니다: ${exploration}`);

  const exampleOneStep = (830n - 780n) * 100000000n / 5n;
  check(exampleOneStep === 1000000000n, `원문 예제 3-1의 한 번에 뛰는 수가 다릅니다: ${exampleOneStep}`);

  const exampleTwoStart = 125n * 100000000n;
  const exampleTwoKnown = 304n * 100000000n;
  const exampleTwoStep = (exampleTwoKnown - exampleTwoStart) / 5n;
  const exampleTwoA = exampleTwoStart + 2n * exampleTwoStep;
  const exampleTwoB = exampleTwoKnown + 3n * exampleTwoStep;
  check(exampleTwoStep === 3580000000n && exampleTwoA === 19660000000n && exampleTwoB === 41140000000n, "원문 예제 3-2의 눈금 간격 또는 두 답이 다릅니다.");

  const wrongFinalDown = 6n * 1000000000000n + 100n * 100000000n;
  const wrongStepDown = 1n * 1000000000000n + 3000n * 100000000n;
  const correctStepDown = 1200n * 100000000n;
  const startDown = wrongFinalDown + 4n * wrongStepDown;
  const correctedDown = startDown - 4n * correctStepDown;
  check(correctedDown === 10730000000000n, `원문 예제 3-3의 답이 다릅니다: ${correctedDown}`);

  const greatest = 87654321n;
  const strictTarget = 100000000n;
  const exampleFourJumps = (strictTarget - greatest) / 120000n + 1n;
  check(exampleFourJumps === 103n && greatest + 102n * 120000n <= strictTarget && greatest + 103n * 120000n > strictTarget, "원문 예제 3-4의 최소 횟수 또는 경계가 다릅니다.");

  const missionOneA = 410n * 1000000000000n + 3700n * 100000000n;
  const missionOneB = 410n * 1000000000000n + 3800n * 100000000n;
  const missionOneStep = (missionOneB - missionOneA) / 10n;
  const missionOneTarget = missionOneB + 7n * missionOneStep;
  check(missionOneStep === 1000000000n && missionOneTarget === 410387000000000n, "원문 Mission 1의 눈금 간격 또는 답이 다릅니다.");

  const missionTwoStep = ((2n * 1000000000000n + 8830n * 100000000n) - (2n * 1000000000000n + 6430n * 100000000n)) / 2n;
  const missionTwoAnswer = 5n * 1000000000000n + 7545n * 100000000n + 5n * missionTwoStep;
  check(missionTwoAnswer === 6354500000000n, `원문 Mission 2의 답이 다릅니다: ${missionTwoAnswer}`);

  const missionThreeWrongFinal = 489500000n;
  const missionThreeStart = missionThreeWrongFinal - 3n * 13000000n;
  const missionThreeAnswer = missionThreeStart + 3n * 1300000n;
  check(missionThreeAnswer === 454400000n, `원문 Mission 3의 답이 다릅니다: ${missionThreeAnswer}`);

  const missionFourStart = 6n * 1000000000000n + 8000n * 100000000n;
  const missionFourStep = 300n * 100000000n;
  const missionFourTarget = 7n * 1000000000000n;
  const missionFourCandidates = Array.from({ length: 9 }, (_, index) => missionFourStart + BigInt(index) * missionFourStep);
  const missionFourMinimum = missionFourCandidates.map(value => distance(value, missionFourTarget)).reduce((left, right) => left < right ? left : right);
  const missionFourNearest = missionFourCandidates.filter(value => distance(value, missionFourTarget) === missionFourMinimum);
  check(missionFourNearest.length === 1 && missionFourNearest[0] === 7010000000000n, "원문 Mission 4의 가장 가까운 수가 하나로 정해지지 않거나 답이 다릅니다.");

  const missionFiveIntervals = (4579733n - 4072733n) / 6500n;
  check(missionFiveIntervals === 78n && missionFiveIntervals - 1n === 77n, "원문 Mission 5의 두 수 사이 개수가 다릅니다.");

  const missionSix = 542750n + 1999n * 123505n;
  check(missionSix === 247429245n, `원문 Mission 6의 답이 다릅니다: ${missionSix}`);
}

auditOriginalAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 3);
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
        if (variant === 2) auditNumberLine(generated.prompt, evidence.payload, 4);
        if (variant === 5) auditNumberLine(generated.prompt, evidence.payload, 3);
        if (variant !== 2 && variant !== 5) assert(!generated.prompt.includes("source41-number-line"), "수직선이 아닌 유형에 수직선이 섞였습니다.");
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
    check(promptSets[variant][difficultyIndex].size >= 90, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 부족합니다 (${promptSets[variant][difficultyIndex].size}).`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 깊이가 커지지 않습니다 (${averages.join(", ")}).`);
}

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 3 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 3 감사 통과: 11원문 구조 · ${generatedCount.toLocaleString()}회 독립 계산 · 원문 기준값 11종 대조 · 수직선 좌표 역산`);
