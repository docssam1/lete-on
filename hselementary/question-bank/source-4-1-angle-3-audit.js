"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41AngleThree";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const expectedSourceIds = [
  "4-1-u2-e3-exploration",
  "4-1-u2-e3-example-3-1",
  "4-1-u2-e3-example-3-2",
  "4-1-u2-e3-example-3-3",
  "4-1-u2-e3-example-3-4",
  "4-1-u2-e3-mission-1",
  "4-1-u2-e3-mission-2",
  "4-1-u2-e3-mission-3",
  "4-1-u2-e3-mission-4",
  "4-1-u2-e3-mission-5",
  "4-1-u2-e3-mission-6"
];

// These names are copied from the source41AngleThree evidence emitted by generators.js.
const expectedKinds = [
  "four-polygons-all-interior-angle-sum",
  "two-corner-halves-center-angle",
  "altitude-bisector-two-angle-sum",
  "concave-octagon-two-small-angle-sum",
  "compound-three-polygons-marked-angle-sum",
  "three-corner-halves-center-angle",
  "trisected-base-two-apex-angles",
  "pentagon-exterior-angle-missing",
  "straight-lines-five-target-angle-sum",
  "two-turn-octagon-final-angle",
  "four-crossed-triangles-eight-angle-sum"
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

function firstTag(html, tagName) {
  return String(html).match(new RegExp(`<${tagName}\\b[^>]*>`))?.[0] || "";
}

function countMatches(text, expression) {
  return String(text).match(expression)?.length || 0;
}

function readEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  const payloadText = attribute(tag, "data-source41-payload");
  const expectedText = attribute(tag, "data-source41-expected");
  assert(payloadText !== undefined && expectedText !== undefined, "검산 자료의 답 또는 조건이 비어 있습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(payloadText)),
    declared: decodeURIComponent(expectedText)
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

function numberAnswer(value) {
  assert(Number.isFinite(value), "독립 계산 결과가 유한한 수가 아닙니다.");
  assert(Number.isInteger(value), `독립 계산 결과가 정수가 아닙니다: ${value}`);
  return String(value);
}

function independentAnswer(kind, payload) {
  if (kind === "four-polygons-all-interior-angle-sum") {
    assert(Array.isArray(payload.sideCounts) && payload.sideCounts.length === 4, "네 다각형의 변 수 자료가 없습니다.");
    const sums = payload.sideCounts.map(sideCount => (sideCount - 2) * 180);
    assert(sums.every(Number.isFinite), "다각형 내각합 계산 자료가 잘못되었습니다.");
    assert(sums.join(",") === payload.interiorSums.join(","), "네 다각형의 개별 내각합이 다릅니다.");
    return numberAnswer(sums.reduce((sum, value) => sum + value, 0));
  }
  if (kind === "two-corner-halves-center-angle") {
    return numberAnswer(90 + payload.angleA / 2);
  }
  if (kind === "altitude-bisector-two-angle-sum") {
    const firstTarget = 90 - payload.angleC;
    const secondTarget = 90 - payload.angleB / 2;
    assert(firstTarget === payload.firstTarget && secondTarget === payload.secondTarget, "두 목표각을 각각 다시 계산한 값이 다릅니다.");
    assert(firstTarget + secondTarget === payload.angleA + payload.angleB / 2, "높이와 이등분선의 두 목표각 합 공식이 다릅니다.");
    return numberAnswer(payload.angleA + payload.angleB / 2);
  }
  if (kind === "concave-octagon-two-small-angle-sum") {
    assert(payload.knownSum === payload.givens.reduce((sum, value) => sum + value, 0), "오목 팔각형의 주어진 각 합이 다릅니다.");
    return numberAnswer(payload.knownSum - 360);
  }
  if (kind === "compound-three-polygons-marked-angle-sum") {
    assert(Array.isArray(payload.sideCounts) && payload.sideCounts.length === 3, "세 다각형의 변 수 자료가 없습니다.");
    const sums = payload.sideCounts.map(sideCount => (sideCount - 2) * 180);
    assert(sums.join(",") === payload.interiorSums.join(","), "세 다각형의 개별 내각합이 다릅니다.");
    return numberAnswer(sums.reduce((sum, value) => sum + value, 0));
  }
  if (kind === "three-corner-halves-center-angle") {
    return numberAnswer(90 + payload.angleA / 2);
  }
  if (kind === "trisected-base-two-apex-angles") {
    const partSum = payload.leftPart + payload.rightPart;
    const firstTarget = 3 * partSum;
    const secondTarget = 180 - 2 * partSum;
    assert(partSum === payload.partSum, "세 등분선의 한 조각 합이 다릅니다.");
    assert(firstTarget === payload.firstTarget && secondTarget === payload.secondTarget, "세 등분선의 두 목표각을 다시 계산한 값이 다릅니다.");
    assert(payload.lowerAngle === 180 - partSum, "아래쪽 각과 한 조각 합의 관계가 다릅니다.");
    return `㉠ ${firstTarget}°, ㉡ ${secondTarget}°`;
  }
  if (kind === "pentagon-exterior-angle-missing") {
    return numberAnswer(360 - payload.givens.reduce((sum, value) => sum + value, 0));
  }
  if (kind === "straight-lines-five-target-angle-sum") {
    const top = 180 - payload.apex;
    const left = 180 - payload.leftGiven - payload.bottomGiven;
    const right = 180 - payload.rightGiven;
    assert(top === payload.topTargets && left === payload.leftTarget && right === payload.rightTargets, "직선 위 세 묶음의 목표각을 다시 계산한 값이 다릅니다.");
    return numberAnswer(top + left + right);
  }
  if (kind === "two-turn-octagon-final-angle") {
    assert(payload.knownSum === payload.knownAngles.reduce((sum, value) => sum + value, 0), "두 번 꺾인 도형의 주어진 각 합이 다릅니다.");
    return numberAnswer(720 - payload.knownSum);
  }
  if (kind === "four-crossed-triangles-eight-angle-sum") {
    const expected = 720 - (360 - payload.givenAngle);
    assert(expected === 360 + payload.givenAngle, "네 삼각형의 가운데 각 계산이 다릅니다.");
    return numberAnswer(expected);
  }
  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

function auditSvg(prompt, variant) {
  const svg = firstTag(prompt, "svg");
  assert(svg.includes("geometry-diagram"), "도형 SVG가 없습니다.");
  if (variant === 0 || variant === 4) {
    assert(svg.includes("source41-polygon-collection"), "다각형 모음 그림이 없습니다.");
    const expectedCount = variant === 0 ? 4 : 3;
    assert(countMatches(prompt, /class="source41-polygon-group/g) === expectedCount, `다각형이 ${expectedCount}개가 아닙니다.`);
    const counts = (attribute(svg, "data-side-counts") || "").split(",").map(Number);
    assert(counts.length === expectedCount && counts.every(Number.isInteger), "다각형 변 수 표시가 잘못되었습니다.");
    assert(countMatches(prompt, /class="source41-polygon-angle-mark/g) >= expectedCount, "다각형의 표시각 자료가 부족합니다.");
    if (variant === 4) assert(svg.includes("is-compound"), "세 다각형 합 그림이 compound 구조가 아닙니다.");
    return;
  }
  if (variant === 1 || variant === 5) {
    assert(svg.includes("source41-triangle-bisectors"), "삼각형 각의 이등분선 그림이 없습니다.");
    const expectedCount = variant === 1 ? 2 : 3;
    assert(attribute(svg, "data-bisector-count") === String(expectedCount), "이등분선 수 표시가 다릅니다.");
    assert(countMatches(prompt, /data-bisector="[ABC]"/g) === expectedCount, "그림의 이등분선 수가 다릅니다.");
    assert(countMatches(prompt, /source41-equal-angle-mark/g) >= expectedCount, "이등분 표시가 부족합니다.");
    assert(countMatches(prompt, /class="source41-target-label/g) === 1, "목표각 표시가 하나가 아닙니다.");
    return;
  }
  if (variant === 2) {
    assert(svg.includes("source41-altitude-bisector"), "높이와 이등분선 그림이 없습니다.");
    assert(countMatches(prompt, /data-altitude="1"/g) === 1, "높이 표시가 없습니다.");
    assert(countMatches(prompt, /data-bisector="B"/g) === 1, "각의 이등분선 표시가 없습니다.");
    assert(countMatches(prompt, /source41-right-angle-mark/g) === 1, "직각 표시가 없습니다.");
    assert(countMatches(prompt, /class="source41-target-label/g) === 2, "두 목표각 표시가 아닙니다.");
    return;
  }
  if (variant === 3) {
    assert(svg.includes("source41-concave-octagon"), "오목 팔각형 그림이 없습니다.");
    assert(attribute(svg, "data-target-count") === "2", "오목 팔각형 목표각 수가 다릅니다.");
    assert((attribute(svg, "data-known-angles") || "").split(",").length === 6, "오목 팔각형 주어진 각 수가 6개가 아닙니다.");
    assert(countMatches(prompt, /class="source41-given-label/g) === 6, "오목 팔각형 주어진 각 표시 수가 다릅니다.");
    assert(countMatches(prompt, /class="source41-target-label/g) === 2, "오목 팔각형 목표각 표시 수가 다릅니다.");
    return;
  }
  if (variant === 6) {
    assert(svg.includes("source41-trisected-triangle"), "세 등분선 삼각형 그림이 없습니다.");
    assert(attribute(svg, "data-left-part") && attribute(svg, "data-right-part") && attribute(svg, "data-lower-angle"), "세 등분선 그림의 수 자료가 없습니다.");
    assert(countMatches(prompt, /source41-equal-angle-mark/g) === 6, "왼쪽·오른쪽 세 등분 표시 수가 6개가 아닙니다.");
    assert(countMatches(prompt, /class="source41-target-label/g) === 2, "세 등분선 목표각 표시 수가 2개가 아닙니다.");
    return;
  }
  if (variant === 7) {
    assert(svg.includes("source41-exterior-polygon"), "오각형 바깥각 그림이 없습니다.");
    assert((attribute(svg, "data-exterior-angles") || "").split(",").length === 5, "오각형 바깥각 자료가 5개가 아닙니다.");
    assert(countMatches(prompt, /data-exterior-label=/g) === 5, "오각형 바깥각 표시 수가 5개가 아닙니다.");
    assert(countMatches(prompt, /source41-extension-line/g) === 5, "오각형 바깥각의 연장선 수가 5개가 아닙니다.");
    return;
  }
  if (variant === 8) {
    assert(svg.includes("source41-five-target"), "다섯 목표각 그림이 없습니다.");
    assert((attribute(svg, "data-givens") || "").split(",").length === 4, "다섯 목표각의 주어진 수가 4개가 아닙니다.");
    assert(countMatches(prompt, /data-target-index=/g) === 5, "다섯 목표각 표시 수가 5개가 아닙니다.");
    return;
  }
  if (variant === 9) {
    assert(svg.includes("source41-two-turn-octagon"), "두 번 꺾인 팔각형 그림이 없습니다.");
    assert((attribute(svg, "data-known-angles") || "").split(",").length === 7, "두 번 꺾인 도형의 주어진 각 수가 7개가 아닙니다.");
    assert(countMatches(prompt, /data-known-index=/g) === 7, "두 번 꺾인 도형의 주어진 각 표시 수가 7개가 아닙니다.");
    assert(countMatches(prompt, /class="source41-target-label/g) === 1, "두 번 꺾인 도형 목표각 표시가 하나가 아닙니다.");
    return;
  }
  assert(variant === 10, `알 수 없는 도형 분기 ${variant}입니다.`);
  assert(svg.includes("source41-four-triangle-cross"), "네 삼각형 교차 그림이 없습니다.");
  assert(attribute(svg, "data-target-count") === "8", "네 삼각형의 목표각 수가 8개가 아닙니다.");
  assert(countMatches(prompt, /data-triangle=/g) === 4, "네 삼각형 수가 4개가 아닙니다.");
  assert(countMatches(prompt, /data-target-index=/g) === 8, "네 삼각형 바깥 목표각 표시 수가 8개가 아닙니다.");
}

function auditSourceAnchors() {
  const fixed = [
    [6, 3, 4, 5].reduce((sum, sideCount) => sum + (sideCount - 2) * 180, 0),
    90 + 72 / 2,
    87 + 46 / 2,
    623 - 360,
    [8, 3, 4].reduce((sum, sideCount) => sum + (sideCount - 2) * 180, 0),
    90 + 60 / 2,
    "㉠ 120°, ㉡ 100°",
    360 - (77 + 42 + 72 + 119),
    (180 - 46) + (180 - 95 - 20) + (180 - 82),
    720 - (110 + 136 + 124 + 95 + 130 + 22 + 55),
    720 - (360 - 40)
  ];
  const expected = [1800, 126, 110, 263, 1620, 120, "㉠ 120°, ㉡ 100°", 50, 297, 48, 400];
  fixed.forEach((value, index) => check(value === expected[index], `원문 고정 기준 ${index}번이 ${value}로 계산되었습니다.`));

  const example32A = 87;
  const example32B = 46;
  const example32C = 180 - example32A - example32B;
  const firstTarget = 90 - example32C;
  const secondTarget = 90 - example32B / 2;
  check(firstTarget + secondTarget === 110 && example32A + example32B / 2 === 110, "예제 3-2의 개별 목표각 재검산이 110°가 아닙니다.");
  check(3 * (20 + 20) === 120 && 180 - 2 * (20 + 20) === 100, "Mission 2의 두 목표각 재검산이 다릅니다.");
  check(720 - (360 - 40) === 400, "Mission 6의 가운데 각 재검산이 400°가 아닙니다.");
}

auditSourceAnchors();

const sourceItems = inventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 3);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 순서가 다릅니다.");
check(new Set(sourceItems.map(item => item.typeLabel)).size === 11, "11개 원문 항목의 유형명이 서로 다르지 않습니다.");
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
        for (const term of [/순열/, /조합/, /방정식/, /미지수/, /삼각함수/, /라디안/, /보각/, /맞꼭지각/]) {
          assert(!term.test(visible), `학생용으로 어려운 표현 ${term}이 보입니다.`);
        }

        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `분기 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant && evidence.payload.level === difficulty + 1, "variant 또는 난이도 자료가 다릅니다.");
        assert(Number.isFinite(evidence.payload.complexity), "난이도 자료가 없습니다.");
        const owner = kindOwners.get(evidence.kind);
        assert(owner === undefined || owner === variant, `검산 구조 ${evidence.kind}가 둘 이상의 원문 항목에 쓰였습니다.`);
        kindOwners.set(evidence.kind, variant);

        auditSvg(generated.prompt, variant);
        const independent = independentAnswer(evidence.kind, evidence.payload);
        assert(independent === evidence.declared, `생성기 선언 답 ${evidence.declared}과 독립 답 ${independent}이 다릅니다.`);
        assert(independent === String(generated.answer), `표시 답 ${generated.answer}과 독립 답 ${independent}이 다릅니다.`);
        if (variant === 6) {
          assert(generated.solution.includes(`${evidence.payload.firstTarget}°`) && generated.solution.includes(`${evidence.payload.secondTarget}°`), "풀이에 두 목표각의 최종 값이 없습니다.");
        } else {
          assert(generated.solution.includes(String(generated.answer)), "풀이에 최종 답이 없습니다.");
        }
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
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 복잡도가 증가하지 않습니다 (${averages.map(value => value.toFixed(1)).join(", ")}).`);
}

check(kindOwners.size === 11, `서로 식별되는 원문 검산 구조가 11개가 아닙니다: ${kindOwners.size}`);
check(generatedCount === 11 * difficulties.length * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 각도 개념탐구 3 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 3 전용 감사 통과: 원문 11항목 · 11구조 · ${generatedCount.toLocaleString()}회 독립 검산 · 정답/풀이/단일 계산/가시성 확인`);
console.log("원문 기준 답: 1800° · 126° · 110° · 263° · 1620° · 120° · ㉠ 120°·㉡ 100° · 50° · 297° · 48° · 400°");
