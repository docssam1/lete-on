"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6PrismsPyramidsE3";
const sourceIds = [
  "6-1-u2-e3-example-3-1",
  "6-1-u2-e3-mission-1",
  "6-1-u2-e3-mission-5",
  "6-1-u2-e3-mission-6"
];
const evidenceKinds = [
  "pyramid-edge-from-counts",
  "prism-pyramid-edge-product",
  "pyramid-edge-marks",
  "paper-solids-edge-difference"
];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [
    { values: [22, 10, 20], answer: 20 },
    { values: [26, 12, 24], answer: 24 },
    { values: [30, 14, 28], answer: 28 }
  ],
  [
    { values: [27, 12, 36, 24, 864], answer: 864 },
    { values: [29, 13, 39, 26, 1014], answer: 1014 },
    { values: [31, 14, 42, 28, 1176], answer: 1176 }
  ],
  [
    { values: [300, 15, 19, 157], answer: 157 },
    { values: [330, 15, 21, 173], answer: 173 },
    { values: [360, 15, 23, 189], answer: 189 }
  ],
  [
    { values: [5, 5, 3, 5, 3, 3, 3, 35, 32, 3], answer: 3 },
    { values: [6, 6, 4, 6, 4, 4, 4, 44, 40, 4], answer: 4 },
    { values: [7, 7, 5, 7, 5, 5, 5, 53, 48, 5], answer: 5 }
  ]
];

const failures = [];
let checked = 0;
let context = "";
const check = (condition, message) => {
  if (!condition) failures.push(`${context}: ${message}`);
};
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1];
const allAttrs = (markup, name) => {
  const values = [];
  const expression = new RegExp(`${name}="([^"]*)"`, "g");
  let match;
  while ((match = expression.exec(String(markup)))) values.push(match[1]);
  return values;
};
const visibleText = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const numberAnswer = value => {
  const numbers = String(value).match(/-?\d+(?:\.\d+)?/g) || [];
  return numbers.length === 1 ? Number(numbers[0]) : NaN;
};
const countClass = (markup, className) => (String(markup).match(new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`, "g")) || []).length;
const countAttribute = (markup, name, value) => (String(markup).match(new RegExp(`${name}="${value}"`, "g")) || []).length;
const trianglePointCount = markup => {
  const points = String(markup).match(/<polygon[^>]*class="source61-e3-paper"[^>]*points="([^"]+)"/)?.[1] || "";
  return points.trim() ? points.trim().split(/\s+/).length : 0;
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source61-prism-e3-kind="[^"]+"[\s\S]*?<\/span>/)?.[0];
  if (!markup) throw new Error("E3 독립 검산 자료가 없습니다.");
  const values = String(attr(markup, "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("E3 data-values가 깨졌습니다.");
  return {
    kind: attr(markup, "data-source61-prism-e3-kind"),
    sourceItemId: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

// These formulas are deliberately independent from the production generator.
function independentAnswer(evidence) {
  const v = evidence.values;
  if (evidence.kind === "pyramid-edge-from-counts") {
    const [condition, sides, answer] = v;
    check(condition === 2 * sides + 2, "각기둥 조건식이 2×밑면 변 수+2와 다릅니다.");
    check(answer === 2 * sides, "같은 밑면의 각뿔 모서리 수를 독립 계산하지 못했습니다.");
    return answer;
  }
  if (evidence.kind === "prism-pyramid-edge-product") {
    const [faceSum, sides, prismEdges, pyramidEdges, answer] = v;
    check(faceSum === 2 * sides + 3, "두 도형의 면 수 합이 2×밑면 변 수+3과 다릅니다.");
    check(prismEdges === 3 * sides && pyramidEdges === 2 * sides, "각기둥·각뿔 모서리 수가 독립 계산과 다릅니다.");
    check(answer === prismEdges * pyramidEdges, "모서리 수의 곱이 독립 계산과 다릅니다.");
    return answer;
  }
  if (evidence.kind === "pyramid-edge-marks") {
    const [edgeCm, interval, innerMarks, answer] = v;
    check(edgeCm % interval === 0, "모서리 길이가 점 사이 간격으로 나누어지지 않습니다.");
    check(innerMarks === edgeCm / interval - 1, "한 모서리의 안쪽 점 수가 양끝 점을 뺀 값과 다릅니다.");
    check(answer === 8 * innerMarks + 5, "사각뿔의 모서리 8개와 꼭짓점 5개를 독립 계산하지 못했습니다.");
    return answer;
  }
  if (evidence.kind === "paper-solids-edge-difference") {
    const [a, a2, b, rectangleA, rectangleB, squareA, squareB, prismEdges, pyramidEdges, answer] = v;
    check(a === a2 && rectangleA === a && rectangleB === b && squareA === b && squareB === b, "세 종이의 변 조건이 한 가지 모양으로 연결되지 않았습니다.");
    check(prismEdges === 2 * (a + a2 + b) + 3 * b, "삼각기둥 모서리 합이 독립 계산과 다릅니다.");
    check(pyramidEdges === 4 * a + 4 * b, "사각뿔 모서리 합이 독립 계산과 다릅니다.");
    check(answer === Math.abs(prismEdges - pyramidEdges), "두 입체의 모서리 길이 차가 독립 계산과 다릅니다.");
    return answer;
  }
  throw new Error(`알 수 없는 E3 검산 종류: ${evidence.kind}`);
}

function checkCommon(generated, sourceItemId, difficulty, expected) {
  check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
  check(generated.generator === generatorKey, "E3 전용 생성기를 사용하지 않았습니다.");
  check(generated.sourceItemId === sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, "고정 검증 3문항 계약이 다릅니다.");
  check(Number.isInteger(generated.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex <= 2, "고정 묶음 번호가 0~2가 아닙니다.");
  check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-e3-answer"), "답 그림 wrapper가 없습니다.");
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), "답 그림의 원문 유형 ID가 다릅니다.");
  check(generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 고정 묶음 번호가 다릅니다.");
  const evidence = parseEvidence(generated.prompt);
  check(evidence.kind === evidenceKinds[sourceIds.indexOf(sourceItemId)], "evidence 종류가 원문 유형과 다릅니다.");
  check(evidence.sourceItemId === sourceItemId && evidence.contract === "single-value", "독립 검산 자료의 원문 ID 또는 단일 답 계약이 다릅니다.");
  check(evidence.difficulty === difficultyExpected[String(difficulty)], "난이도별 풀이 부담 표시가 다릅니다.");
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계의 안내가 없습니다.");
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 난이도 안내가 섞였습니다.");
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계의 스스로 찾기 안내가 없습니다.");
  const expectedAnswer = independentAnswer(evidence);
  check(numberAnswer(generated.answer) === expectedAnswer, `표시 답 '${generated.answer}'이 독립 계산 '${expectedAnswer}'과 다릅니다.`);
  check(evidence.values.join(",") === expected.values.join(","), "고정 pool의 data-values가 계약과 다릅니다.");
  check(numberAnswer(generated.answer) === expected.answer, "고정 pool의 정답이 계약과 다릅니다.");
  const promptStructures = allAttrs(generated.prompt, "data-source61-e3-structure");
  const answerStructures = allAttrs(generated.answerVisual, "data-source61-e3-structure");
  check(promptStructures.length > 0 && answerStructures.length > 0, "문제와 답 그림에 공통 구조 서명이 없습니다.");
  check(promptStructures.join("|") === answerStructures.join("|"), "문제와 답 그림의 구조 서명이 다릅니다.");
  check(!generated.prompt.includes("data-result-highlight="), "문제에 정답 강조 속성이 노출되었습니다.");
  check(generated.answerVisual.includes("data-result-highlight="), "답 그림에 결과 강조가 없습니다.");
  check(visibleText(`${generated.prompt}\n${generated.solution}`).search(/undefined|null|NaN|Infinity|순열|조합|제곱근/) < 0, "문제 또는 풀이에 깨진 값·학년 밖 표현이 있습니다.");
  checked += 1;
  return evidence;
}

function checkVariant(variant, generated, evidence) {
  const prompt = String(generated.prompt);
  const answer = String(generated.answerVisual);
  const v = evidence.values;
  if (variant === 0) {
    const [, sides, result] = v;
    check(prompt.includes("각기둥") && prompt.includes("각뿔") && prompt.includes("밑면의 모양이 같음"), "문제 그림의 같은 밑면 관계 도식이 없습니다.");
    check(!prompt.includes(`${sides}각기둥`) && !prompt.includes(`${sides}각뿔`), "문제에 구체적인 n각기둥·n각뿔이 노출되어 정답이 샙니다.");
    check(!prompt.includes(`data-base-sides="${sides}"`) && countAttribute(prompt, "data-solid-edge", "prism") === 0 && countAttribute(prompt, "data-solid-edge", "pyramid") === 0, "문제에 실제 n각형의 선분 또는 꼭짓점 정보가 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(allAttrs(markup, "data-source61-e3-structure").every(value => value === "same-base-prism-pyramid-relation"), "같은 밑면 관계 구조 서명이 아닙니다.");
    }
    for (const markup of [answer]) {
      check(markup.includes(`data-base-sides="${sides}"`) && markup.includes('data-solved="true"'), "답 그림에 실제 밑면 변 수가 없습니다.");
      check(countAttribute(markup, "data-solid-edge", "prism") === 3 * sides, "각기둥의 실제 선분 수가 3n과 다릅니다.");
      check(countAttribute(markup, "data-solid-edge", "pyramid") === 2 * sides, "각뿔의 실제 선분 수가 2n과 다릅니다.");
      check(countAttribute(markup, "data-solid-vertex", "prism") === 2 * sides, "각기둥의 실제 꼭짓점 수가 2n과 다릅니다.");
      check(countAttribute(markup, "data-solid-vertex", "pyramid") === sides + 1, "각뿔의 실제 꼭짓점 수가 n+1과 다릅니다.");
    }
    check(countClass(answer, "source61-e3-highlight") === 2 * sides, "각뿔의 모든 모서리 강조 그림이 없습니다.");
    check(answer.includes(`data-result-highlight="${result}"`), "각뿔 모서리 결과 강조값이 없습니다.");
    return;
  }
  if (variant === 1) {
    const [, sides, prismEdges, pyramidEdges, result] = v;
    check(prompt.includes("각기둥") && prompt.includes("각뿔") && prompt.includes("밑면의 모양이 같음"), "문제 그림의 같은 밑면 관계 도식이 없습니다.");
    check(!prompt.includes(`${sides}각기둥`) && !prompt.includes(`${sides}각뿔`), "문제에 구체적인 n각기둥·n각뿔이 노출되어 정답이 샙니다.");
    check(!prompt.includes(`data-base-sides="${sides}"`) && countAttribute(prompt, "data-solid-edge", "prism") === 0 && countAttribute(prompt, "data-solid-edge", "pyramid") === 0, "문제에 실제 n각형의 선분 또는 꼭짓점 정보가 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(allAttrs(markup, "data-source61-e3-structure").every(value => value === "same-base-prism-pyramid-relation"), "같은 밑면 관계 구조 서명이 아닙니다.");
    }
    for (const markup of [answer]) {
      check(markup.includes(`data-base-sides="${sides}"`) && markup.includes(`data-prism-edge-count="${prismEdges}"`) && markup.includes(`data-pyramid-edge-count="${pyramidEdges}"`), "각기둥·각뿔 구조 데이터가 pool과 다릅니다.");
      check(markup.includes('data-solved="true"'), "답 그림에 solved 상태가 없습니다.");
      check(countAttribute(markup, "data-solid-edge", "prism") === prismEdges, "각기둥의 실제 선분 수가 pool과 다릅니다.");
      check(countAttribute(markup, "data-solid-edge", "pyramid") === pyramidEdges, "각뿔의 실제 선분 수가 pool과 다릅니다.");
      check(countAttribute(markup, "data-solid-vertex", "prism") === 2 * sides && countAttribute(markup, "data-solid-vertex", "pyramid") === sides + 1, "각기둥·각뿔의 실제 꼭짓점 수가 다릅니다.");
    }
    check(answer.includes(`data-result-highlight="${result}"`) && answer.includes(`${prismEdges}×${pyramidEdges}=${result}`), "모서리 수 곱의 답 그림·식이 없습니다.");
    return;
  }
  if (variant === 2) {
    const [edgeCm, interval, innerMarks, result] = v;
    check(prompt.includes(`data-edge-length-cm="${edgeCm}"`) && prompt.includes(`data-mark-interval-cm="${interval}"`) && prompt.includes('data-inner-mark-count="unknown"'), "문제의 사각뿔 점 표시 조건이 pool과 다릅니다.");
    check(answer.includes(`data-edge-length-cm="${edgeCm}"`) && answer.includes(`data-mark-interval-cm="${interval}"`) && answer.includes(`data-inner-mark-count="${innerMarks}"`), "답의 사각뿔 점 표시 구조 데이터가 pool과 다릅니다.");
    check(countClass(prompt, "source61-e3-mark") === 0, "문제에 안쪽 점이 미리 표시되어 중간 답이 샙니다.");
    check(countClass(answer, "source61-e3-mark") === innerMarks, "답 그림의 한 모서리 안쪽 점 수가 pool과 다릅니다.");
    check(!new RegExp(`(?<!\\d)${innerMarks}(?!\\d)`).test(visibleText(prompt)) && !new RegExp(`(?<!\\d)${result}(?!\\d)`).test(visibleText(prompt)), "문제 화면에 안쪽 점 수 또는 전체 답이 노출되었습니다.");
    check(countClass(prompt, "source61-e3-pyramid-vertex") === 0 && countClass(answer, "source61-e3-pyramid-vertex") === 5, "답 그림에만 사각뿔 꼭짓점 5개가 표시되어야 합니다.");
    for (const markup of [prompt, answer]) check(countClass(markup, "source61-e3-vertex-mark") === 2, "확대선 양끝 점 표시가 2개가 아닙니다.");
    check(countAttribute(prompt, "data-solid-edge", "pyramid") === 0 && countAttribute(answer, "data-solid-edge", "pyramid") === 8, "사각뿔의 실제 모서리 구조가 문제/답에 잘못 노출되었습니다.");
    check(prompt.includes('data-interval-mark="one"') && !prompt.includes('data-mark="inner-'), "문제의 확대선에는 15cm 한 구간 표시만 있어야 합니다.");
    check(answer.includes(`data-result-highlight="${result}"`), "사각뿔 점 개수 결과 강조값이 없습니다.");
    return;
  }
  const [, , , , , , , prismEdges, pyramidEdges, result] = v;
  check(prompt.includes('data-triangular-prism-edge-total="unknown"') && prompt.includes('data-square-pyramid-edge-total="unknown"'), "문제에 입체의 모서리 합이 노출되었습니다.");
  check(answer.includes(`data-triangular-prism-edge-total="${prismEdges}"`) && answer.includes(`data-square-pyramid-edge-total="${pyramidEdges}"`), "답의 두 입체 모서리 합 구조 데이터가 pool과 다릅니다.");
  check(trianglePointCount(prompt) === 3 && trianglePointCount(answer) === 3, "가 종이가 세 꼭짓점인 삼각형으로 그려지지 않았습니다.");
  check(prompt.includes(`data-paper-triangle="${v.slice(0, 3).join(",")}"`) && answer.includes(`data-paper-triangle="${v.slice(0, 3).join(",")}"`), "가 종이의 두 변과 밑변 길이 자료가 문제·답 그림과 연결되지 않았습니다.");
  for (const markup of [prompt, answer]) {
    check(markup.includes('data-paper-triangle="') && markup.includes('data-paper-rectangle="') && markup.includes('data-paper-square="'), "세 종이의 구성 데이터가 없습니다.");
  }
  check(countClass(prompt, "source61-e3-solid") === 0 && countAttribute(prompt, "data-solid-edge", "triangular-prism") === 0 && countAttribute(prompt, "data-solid-edge", "square-pyramid") === 0, "문제에 완성 입체가 미리 표시되어 답이 샙니다.");
  check(!new RegExp(`(?<!\\d)(?:35|32|44|40|53|48)(?!\\d)`).test(visibleText(prompt)), "문제 화면에 입체의 모서리 합 수치가 노출되었습니다.");
  check(countClass(answer, "source61-e3-solid") === 2, "답에 삼각기둥과 사각뿔 두 그림이 없습니다.");
  for (const markup of [answer]) {
    check(countClass(markup, "source61-e3-solid") === 2, "삼각기둥과 사각뿔 두 그림이 모두 없습니다.");
    check(countAttribute(markup, "data-solid-edge", "triangular-prism") === 9 && countAttribute(markup, "data-solid-edge", "square-pyramid") === 8, "두 입체의 실제 선분 수가 각각 9개와 8개가 아닙니다.");
    check(countAttribute(markup, "data-solid-vertex", "triangular-prism") === 6 && countAttribute(markup, "data-solid-vertex", "square-pyramid") === 5, "두 입체의 실제 꼭짓점 수가 각각 6개와 5개가 아닙니다.");
  }
  check(answer.includes(`data-result-highlight="${result}"`) && answer.includes(`${prismEdges}-${pyramidEdges}=${result}cm`), "모서리 길이 차의 답 그림·식이 없습니다.");
}

check(Boolean(api && api.names && api.names.includes(generatorKey)), "E3 전용 생성기가 등록되지 않았습니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const poolValues = new Map();
  const poolAnswers = new Map();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 900; seed += 1) {
      context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const type = { generatorKey, variant, sourceItemId: sourceIds[variant] };
        const generated = api.generate(type, 0, difficulty, seed, variant);
        const expected = expectedPools[variant][generated.verifiedPoolIndex];
        const evidence = checkCommon(generated, sourceIds[variant], difficulty, expected);
        checkVariant(variant, generated, evidence);
        const valueSignature = evidence.values.join(",");
        if (poolValues.has(generated.verifiedPoolIndex)) check(poolValues.get(generated.verifiedPoolIndex) === valueSignature, "같은 pool에서 난이도별 값이 달라졌습니다.");
        else poolValues.set(generated.verifiedPoolIndex, valueSignature);
        const answer = numberAnswer(generated.answer);
        if (poolAnswers.has(generated.verifiedPoolIndex)) check(poolAnswers.get(generated.verifiedPoolIndex) === answer, "같은 pool에서 정답이 달라졌습니다.");
        else poolAnswers.set(generated.verifiedPoolIndex, answer);
        pools.add(generated.verifiedPoolIndex);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  context = sourceIds[variant];
  check(pools.size === 3, "고정 pool 0, 1, 2를 모두 확인하지 못했습니다.");
  check(poolValues.size === 3 && poolAnswers.size === 3, "세 고정 pool의 값과 정답이 모두 기록되지 않았습니다.");
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 3 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 3 각기둥과 각뿔 감사 통과: 4유형 · 12개 고정 문항 · ${checked.toLocaleString()}회 독립 계산·pool·단일 정답·답 그림·구조 서명·난이도 검사`);
