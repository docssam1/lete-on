"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41AngleTwo";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u2-e2-exploration",
  "4-1-u2-e2-example-2-1",
  "4-1-u2-e2-example-2-2",
  "4-1-u2-e2-example-2-3",
  "4-1-u2-e2-example-2-4",
  "4-1-u2-e2-mission-1",
  "4-1-u2-e2-mission-2",
  "4-1-u2-e2-mission-3",
  "4-1-u2-e2-mission-4",
  "4-1-u2-e2-mission-5",
  "4-1-u2-e2-mission-6"
];
const expectedKinds = [
  "paired-right-triangle-angle-list",
  "shifted-equilateral-union-angle",
  "right-line-nested-and-reflex-angles",
  "right-angle-multiple-chain",
  "two-lines-extra-rays-angle-difference",
  "crossed-lines-opposite-angle-target",
  "fraction-related-angle-sum",
  "crossed-lines-split-opposite-angle",
  "full-turn-two-angle-sum",
  "vertical-angle-two-target-difference",
  "given-composite-vs-straight-difference"
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compositeTriangleAngles(firstAngles, secondAngles) {
  const values = new Set();
  const add = value => {
    if (value > 0 && value <= 180) values.add(value);
  };
  for (const first of firstAngles) {
    for (const second of secondAngles) {
      for (const value of [first, second, Math.abs(first - second), first + second]) {
        add(value);
        add(180 - value);
      }
    }
  }
  return [...values].sort((left, right) => left - right);
}

function independentAnswer(kind, payload) {
  if (kind === "paired-right-triangle-angle-list") {
    const values = compositeTriangleAngles(payload.firstAngles, payload.secondAngles);
    assert(values.join(",") === payload.possibleAngles.join(","), "두 삼각형으로 만든 각 목록이 독립 열거와 다릅니다.");
    return values.map(value => `${value}°`).join(", ");
  }
  if (kind === "shifted-equilateral-union-angle") return String(60 + (payload.triangleCount - 1) * payload.shift);
  if (kind === "right-line-nested-and-reflex-angles") {
    const first = 90 - payload.leftGiven + payload.rightGiven;
    const second = 180 - payload.leftGiven;
    const third = 270 - payload.rightGiven;
    return `㉠ ${first}°, ㉡ ${second}°, ㉢ ${third}°`;
  }
  if (kind === "right-angle-multiple-chain") {
    const first = 90 / (payload.firstMultiple - 1);
    const second = (90 - first) / payload.secondMultiple;
    assert(Number.isInteger(first) && Number.isInteger(second), "배수 관계로 구한 각이 자연수 각도가 아닙니다.");
    return String(first + second);
  }
  if (kind === "two-lines-extra-rays-angle-difference") {
    const first = payload.secondGiven + payload.thirdGiven - payload.firstGiven;
    const second = 180 - payload.secondGiven - payload.thirdGiven;
    return String(Math.abs(first - second));
  }
  if (kind === "crossed-lines-opposite-angle-target") return String(payload.firstGiven + payload.secondGiven - payload.thirdGiven);
  if (kind === "fraction-related-angle-sum") {
    assert(payload.firstLarge + payload.secondLarge === 180, "분수 관계의 두 큰 각이 평각이 아닙니다.");
    return String(payload.firstLarge / payload.denominator + payload.secondLarge / payload.denominator);
  }
  if (kind === "crossed-lines-split-opposite-angle") return String(payload.upperRay - payload.lowerRay - payload.split);
  if (kind === "full-turn-two-angle-sum") return String(360 - payload.firstGiven - payload.secondGiven);
  if (kind === "vertical-angle-two-target-difference") {
    const first = payload.largeGiven - payload.smallGiven;
    const second = 180 - payload.smallGiven;
    return String(Math.abs(second - first));
  }
  if (kind === "given-composite-vs-straight-difference") return String(180 - payload.largeGiven);
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditDiagram(prompt, variant) {
  if (variant === 0) {
    assert(prompt.includes("source41-triangle-pair"), "두 직각삼각형 그림이 없습니다.");
    assert((prompt.match(/data-triangle=/g) || []).length === 2, "직각삼각형이 두 개가 아닙니다.");
    return;
  }
  if (variant === 1) {
    assert(prompt.includes("source41-equilateral-fan"), "겹친 정삼각형 그림이 없습니다.");
    return;
  }
  assert(prompt.includes("source41-angle-web"), "각도 계산 그림이 없습니다.");
  const anglesText = prompt.match(/class="geometry-diagram source41-angle-web"[^>]*data-ray-angles="([^"]+)"/)?.[1];
  assert(anglesText, "그림의 광선 각도 자료가 없습니다.");
  const angles = anglesText.split(",").map(Number).sort((left, right) => left - right);
  assert(angles.every(Number.isFinite), "그림 광선에 잘못된 수가 있습니다.");
  const gaps = angles.map((angle, index) => index + 1 < angles.length ? angles[index + 1] - angle : 360 - angle + angles[0]);
  assert(Math.min(...gaps) >= 8, `서로 붙어 보이는 광선 간격 ${Math.min(...gaps)}°가 있습니다.`);

  const linePairsText = prompt.match(/class="geometry-diagram source41-angle-web"[^>]*data-line-pairs="([^"]*)"/)?.[1] || "";
  if (linePairsText) {
    for (const pairText of linePairsText.split(";")) {
      const [first, second] = pairText.split(",").map(Number);
      const difference = Math.abs(first - second);
      assert(difference === 180, `직선으로 표시한 두 광선의 차가 ${difference}°입니다.`);
    }
  }
  if (variant === 2 || variant === 3) assert(prompt.includes("data-right-pair"), "직각 조건이 그림에 표시되지 않았습니다.");
}

function auditSourceAnchors() {
  const sourceAngles = compositeTriangleAngles([45, 45, 90], [30, 60, 90]);
  check(sourceAngles.join(",") === "15,30,45,60,75,90,105,120,135,150,165,180", "원문 본문의 15°부터 180°까지 각 목록이 다릅니다.");
  check(60 + 15 + 15 === 90, "원문 예제 2-1의 답이 90°가 아닙니다.");
  check(90 - 30 + 40 === 100 && 180 - 30 === 150 && 270 - 40 === 230, "원문 예제 2-2의 100°·150°·230°가 다릅니다.");
  check(90 / (4 - 1) + (90 - 30) / 5 === 42, "원문 예제 2-3의 답이 42°가 아닙니다.");
  check(Math.abs((88 + 32 - 41) - (180 - 88 - 32)) === 19, "원문 예제 2-4의 답이 19°가 아닙니다.");
  check(89 + 48 - 26 === 111, "원문 Mission 1의 답이 111°가 아닙니다.");
  check(180 / 5 === 36, "원문 Mission 2의 답이 36°가 아닙니다.");
  check(127 - 40 - 35 === 52, "원문 Mission 3의 답이 52°가 아닙니다.");
  check(360 - 150 - 130 === 80, "원문 Mission 4의 답이 80°가 아닙니다.");
  check((180 - 55) - (140 - 55) === 40, "원문 Mission 5의 답이 40°가 아닙니다.");
  check(180 - 125 === 55, "원문 Mission 6의 답이 55°가 아닙니다.");
}

auditSourceAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 2);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서가 다릅니다.");
check(new Set(sourceItems.map(item => item.typeLabel)).size === 11, "11개 원문 항목의 쉬운 한글 유형명이 서로 다르지 않습니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);

const promptSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const complexitySums = Array.from({ length: 11 }, () => difficulties.map(() => 0));
const kindOwners = new Map();
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
        assert(Boolean(generated.prompt && generated.answer !== "" && generated.solution), "문제·정답·풀이가 비었습니다.");
        const visible = visibleText(`${generated.prompt} ${generated.answer} ${generated.solution}`);
        assert(!/undefined|null|NaN|Infinity/.test(visible), "깨진 계산값이 보입니다.");
        assert(!/[\u4E00-\u9FFF]/.test(visible), "한자 표현이 보입니다.");
        for (const term of [/순열/, /조합/, /방정식/, /미지수/, /삼각함수/, /라디안/, /보각/, /맞꼭지각/]) assert(!term.test(visible), `초등학생에게 어려운 표현 ${term}이 보입니다.`);

        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `분기 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant && evidence.payload.level === difficulty + 1, "variant 또는 난이도 자료가 다릅니다.");
        const owner = kindOwners.get(evidence.kind);
        assert(owner === undefined || owner === variant, `검산 구조 ${evidence.kind}가 둘 이상의 원문 항목에 쓰였습니다.`);
        kindOwners.set(evidence.kind, variant);

        auditDiagram(generated.prompt, variant);
        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(independent === evidence.declared, `생성기 선언 답 ${evidence.declared}과 독립 답 ${independent}이 다릅니다.`);
        assert(independent === generated.answer, `표시 답 ${generated.answer}과 독립 답 ${independent}이 다릅니다.`);
        assert(generated.solution.includes(generated.answer), "풀이에 최종 답이 없습니다.");
        assert(visibleText(generated.solution).length >= 50, "풀이 단계가 너무 짧습니다.");

        promptSets[variant][difficultyIndex].add(generated.prompt);
        complexitySums[variant][difficultyIndex] += evidence.payload.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
}

for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= 10, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 ${promptSets[variant][difficultyIndex].size}개뿐입니다.`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 조건 수가 커지지 않습니다 (${averages.map(value => value.toFixed(1)).join(", ")}).`);
}

check(kindOwners.size === 11, `서로 식별되는 원문 검산 구조가 11개가 아닙니다: ${kindOwners.size}`);
check(generatedCount === 11 * difficulties.length * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 각도 개념탐구 2 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 2 전용 감사 통과: 원문 11항목 · 11구조 · ${generatedCount.toLocaleString()}회 독립 검산 · 원본 정답/단일답/가시성 확인`);
console.log("원본 기준 답: 본문 15° 간격 12개 · 예제 90°/100°·150°·230°/42°/19° · Mission 111°/36°/52°/80°/40°/55°");
