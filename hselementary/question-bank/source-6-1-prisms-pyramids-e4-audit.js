"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6PrismsPyramidsE4";
const sourceIds = [
  "6-1-u2-e4-example-4-1",
  "6-1-u2-e4-example-4-2",
  "6-1-u2-e4-example-4-4",
  "6-1-u2-e4-mission-1",
  "6-1-u2-e4-mission-4"
];
const evidenceKinds = [
  "cube-six-pyramid-assembly",
  "pyramid-vertex-truncation",
  "tetrahedron-midpoint-quadrilateral",
  "prism-pyramid-base-join",
  "pyramid-base-to-base"
];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [{ values: [6], answer: 74 }],
  [
    { values: [3], answer: 38 },
    { values: [4], answer: 50 },
    { values: [5], answer: 62 }
  ],
  [
    { values: [16], answer: "48cm" },
    { values: [20], answer: "60cm" },
    { values: [24], answer: "72cm" }
  ],
  [
    { values: [3], answer: "면 7개, 모서리 12개, 꼭짓점 7개" },
    { values: [4], answer: "면 9개, 모서리 16개, 꼭짓점 9개" },
    { values: [5], answer: "면 11개, 모서리 20개, 꼭짓점 11개" }
  ],
  [
    { values: [4], answer: 26 },
    { values: [5], answer: 32 },
    { values: [6], answer: 38 }
  ]
];

const failures = [];
let checked = 0;
let context = "";
const check = (condition, message) => {
  if (!condition) failures.push(`${context}: ${message}`);
};
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1];
const allAttrs = (markup, name, value) => {
  const expression = new RegExp(`${name}="([^"]*)"`, "g");
  let count = 0;
  let match;
  while ((match = expression.exec(String(markup)))) if (value === undefined || match[1] === value) count += 1;
  return count;
};
const countClass = (markup, className) => (String(markup).match(new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`, "g")) || []).length;
const stripHidden = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "");
const visibleText = markup => stripHidden(markup).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const parseEvidence = prompt => {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source61-prism-e4-kind="[^"]+"[\s\S]*?<\/span>/)?.[0];
  if (!markup) throw new Error("E4 독립 검산 자료가 없습니다.");
  const values = String(attr(markup, "data-values") || "").split(",").map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("E4 data-values가 깨졌습니다.");
  return {
    kind: attr(markup, "data-source61-prism-e4-kind"),
    sourceItemId: attr(markup, "data-source-item"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
};

// This calculation is intentionally separate from the production generator.
function independentAnswer(evidence) {
  const values = evidence.values;
  if (evidence.kind === "cube-six-pyramid-assembly") {
    const [pyramids] = values;
    const faces = pyramids * 4, edges = 12 + pyramids * 4, vertices = 8 + pyramids, total = faces + edges + vertices;
    check(pyramids === 6, "정육면체에 붙이는 사각뿔 수가 6이 아닙니다.");
    check(faces === pyramids * 4 && edges === 12 + pyramids * 4 && vertices === 8 + pyramids, "정육면체와 사각뿔의 겉 구조를 독립 계산하지 못했습니다.");
    check(total === faces + edges + vertices && total === 74, "완성 입체의 합이 74가 아닙니다.");
    return total;
  }
  if (evidence.kind === "pyramid-vertex-truncation") {
    const [n] = values;
    const faces = 2 * n + 2, edges = 6 * n, vertices = 4 * n, total = faces + edges + vertices;
    check([3, 4, 5].includes(n), "정n각뿔의 n이 고정 pool 3, 4, 5가 아닙니다.");
    check(faces === 2 * n + 2 && edges === 6 * n && vertices === 4 * n, "잘라 낸 각뿔의 면·모서리·꼭짓점 공식을 독립 계산하지 못했습니다.");
    check(total === faces + edges + vertices && total === 12 * n + 2, "잘라 낸 각뿔의 합이 12n+2와 다릅니다.");
    return total;
  }
  if (evidence.kind === "tetrahedron-midpoint-quadrilateral") {
    const [perimeter] = values;
    const edgeCm = perimeter / 2, total = edgeCm * 6;
    check([16, 20, 24].includes(perimeter), "사각형 둘레가 고정 pool 16, 20, 24가 아닙니다.");
    check(edgeCm * 2 === perimeter && total === edgeCm * 6, "가운데점 사각형과 정사면체 모서리 합의 관계가 다릅니다.");
    return `${total}cm`;
  }
  if (evidence.kind === "prism-pyramid-base-join") {
    const [n] = values;
    const faces = 2 * n + 1, edges = 4 * n, vertices = 2 * n + 1;
    check([3, 4, 5].includes(n), "붙이는 각기둥·각뿔의 n이 고정 pool 3, 4, 5가 아닙니다.");
    check(faces === 2 * n + 1 && edges === 4 * n && vertices === 2 * n + 1, "각기둥과 각뿔을 붙인 뒤의 수를 독립 계산하지 못했습니다.");
    return `면 ${faces}개, 모서리 ${edges}개, 꼭짓점 ${vertices}개`;
  }
  if (evidence.kind === "pyramid-base-to-base") {
    const [n] = values;
    const faces = 2 * n, edges = 3 * n, vertices = n + 2, total = faces + edges + vertices;
    check([4, 5, 6].includes(n), "붙이는 각뿔의 n이 고정 pool 4, 5, 6이 아닙니다.");
    check(faces === 2 * n && edges === 3 * n && vertices === n + 2, "두 각뿔을 붙인 뒤의 수를 독립 계산하지 못했습니다.");
    check(total === faces + edges + vertices && total === 6 * n + 2, "두 각뿔을 붙인 뒤의 합이 6n+2와 다릅니다.");
    return total;
  }
  throw new Error(`알 수 없는 E4 검산 종류: ${evidence.kind}`);
}

function checkCommon(generated, sourceItemId, variant, difficulty, expected) {
  check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
  check(generated.generator === generatorKey, "E4 전용 생성기를 사용하지 않았습니다.");
  check(generated.sourceItemId === sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === expectedPools[variant].length, "고정 검증 pool 계약이 다릅니다.");
  check(Number.isInteger(generated.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex < expectedPools[variant].length, "고정 묶음 번호가 pool 범위를 벗어났습니다.");
  check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-answer-diagram"), "답 그림 wrapper가 없습니다.");
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), "답 그림의 원문 유형 ID가 다릅니다.");
  check(generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 고정 묶음 번호가 다릅니다.");
  const evidence = parseEvidence(generated.prompt);
  check(evidence.kind === evidenceKinds[variant] && evidence.sourceItemId === sourceItemId, "독립 검산 자료가 원문 유형과 다릅니다.");
  check(evidence.contract === (variant === 3 ? "three-values" : "single-value"), "문항의 단일 또는 세 값 정답 계약이 다릅니다.");
  check(evidence.difficulty === difficultyExpected[difficulty], "난이도별 풀이 부담 표시가 다릅니다.");
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계의 안내가 없습니다.");
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 난이도 안내가 섞였습니다.");
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계의 스스로 찾기 안내가 없습니다.");
  const independent = independentAnswer(evidence);
  check(String(generated.answer) === String(independent), `표시 답 '${generated.answer}'이 독립 계산 '${independent}'과 다릅니다.`);
  check(evidence.values.join(",") === expected.values.join(","), "고정 pool의 data-values가 계약과 다릅니다.");
  check(String(generated.answer) === String(expected.answer), "고정 pool의 정답이 계약과 다릅니다.");
  const promptStructure = attr(generated.prompt, "data-source61-e4-structure");
  const answerStructure = attr(generated.answerVisual, "data-source61-e4-structure");
  const promptGeometry = attr(generated.prompt, "data-source61-e4-geometry");
  const answerGeometry = attr(generated.answerVisual, "data-source61-e4-geometry");
  check(promptStructure && promptStructure === answerStructure, "문제와 답 그림의 구조 서명이 다릅니다.");
  check(promptGeometry && promptGeometry === answerGeometry, "문제와 답 그림의 공통 도형 자료가 다릅니다.");
  check(!generated.prompt.includes("data-result-highlight=") && !generated.prompt.includes("data-solid-face=") && !generated.prompt.includes("data-solid-edge=") && !generated.prompt.includes("data-solid-vertex="), "문제에 답 도형의 결과 토폴로지가 노출되었습니다.");
  check(generated.answerVisual.includes("is-solved") && generated.answerVisual.includes("data-result-highlight="), "답 그림에 완성 도형 또는 목표 표시가 없습니다.");
  const visible = visibleText(`${generated.prompt}\n${generated.solution}`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱근|위상/.test(visible), "문제 또는 풀이에 깨진 값·학년 밖 표현이 있습니다.");
  checked += 1;
  return evidence;
}

function checkTopology(variant, generated, evidence) {
  const prompt = String(generated.prompt);
  const answer = String(generated.answerVisual);
  const values = evidence.values;
  const promptText = visibleText(prompt);
  check(answer.includes("<svg"), "답에 다시 그린 SVG가 없습니다.");
  if (variant !== 0) check(answer.includes("source61-e4-hidden-edge"), "답 그림에 가려진 모서리를 나타내는 점선이 없습니다.");
  if (variant === 0) {
    const [pyramids] = values;
    const faces = pyramids * 4, edges = 12 + pyramids * 4, vertices = 8 + pyramids;
    for (const forbidden of ["24", "36", "14", "74"]) check(!new RegExp(`(?<!\\d)${forbidden}(?!\\d)`).test(promptText), `문제에 완성 입체의 결과 ${forbidden}가 노출되었습니다.`);
    check(allAttrs(answer, "data-solid-face", "stellated-cube") === 24, "여섯 사각뿔을 붙인 입체의 실제 삼각형 면이 24개가 아닙니다.");
    check(allAttrs(answer, "data-solid-edge", "stellated-cube") === 36, "여섯 사각뿔을 붙인 입체의 실제 모서리가 36개가 아닙니다.");
    check(allAttrs(answer, "data-solid-vertex", "stellated-cube") === 14, "여섯 사각뿔을 붙인 입체의 실제 꼭짓점이 14개가 아닙니다.");
    check(answer.includes("source61-e4-counting-net"), "답에 선 겹침 없이 면·모서리·꼭짓점을 세는 펼친 그림이 없습니다.");
    check(countClass(answer, "source61-e4-separate-pyramid") === 0, "답이 분리된 사각뿔만 그리고 조립 결과를 그리지 않았습니다.");
    return;
  }
  if (variant === 1) {
    const [n] = values;
    const faces = 2 * n + 2, edges = 6 * n, vertices = 4 * n, total = faces + edges + vertices;
    for (const forbidden of [faces, edges, vertices, total]) check(!new RegExp(`(?<!\\d)${forbidden}(?!\\d)`).test(promptText), `문제에 잘라 낸 각뿔의 결과 ${forbidden}가 노출되었습니다.`);
    check(allAttrs(answer, "data-solid-face", "truncated-pyramid") === faces, "잘라 낸 각뿔의 실제 면 요소 수가 공식과 다릅니다.");
    check(allAttrs(answer, "data-solid-edge", "truncated-pyramid") === edges, "잘라 낸 각뿔의 실제 모서리 요소 수가 공식과 다릅니다.");
    check(allAttrs(answer, "data-solid-vertex", "truncated-pyramid") === vertices, "잘라 낸 각뿔의 실제 꼭짓점 요소 수가 공식과 다릅니다.");
    check(countClass(prompt, "source61-e4-cut-mark") === 4 * n, "문제 그림의 삼등분점 수가 각 모서리와 맞지 않습니다.");
    return;
  }
  if (variant === 2) {
    const [perimeter] = values;
    const edgeCm = perimeter / 2, total = edgeCm * 6;
    check(!new RegExp(`(?<!\\d)${total}(?!\\d)`).test(promptText), "문제에 정사면체 모서리 합이 노출되었습니다.");
    check(allAttrs(answer, "data-solid-face", "tetrahedron") === 4, "답 정사면체의 실제 면이 4개가 아닙니다.");
    check(allAttrs(answer, "data-solid-edge", "tetrahedron") === 6, "답 정사면체의 실제 모서리가 6개가 아닙니다.");
    check(allAttrs(answer, "data-solid-vertex", "tetrahedron") === 4, "답 정사면체의 실제 꼭짓점이 4개가 아닙니다.");
    check(countClass(answer, "source61-e4-section-highlight") === 1 && answer.includes(`둘레 ${perimeter}cm`), "답에 가운데점 사각형 강조와 둘레가 없습니다.");
    check(answer.includes(`한 모서리</span><b>${perimeter}÷2=${edgeCm}cm`), "답의 가운데점과 원래 모서리 계산이 없습니다.");
    return;
  }
  if (variant === 3) {
    const [n] = values;
    const faces = 2 * n + 1, edges = 4 * n, vertices = 2 * n + 1;
    check(!new RegExp(`(?<!\\d)${faces}(?!\\d)`).test(promptText) && !new RegExp(`(?<!\\d)${edges}(?!\\d)`).test(promptText) && !new RegExp(`(?<!\\d)${vertices}(?!\\d)`).test(promptText), "문제에 붙인 입체의 결과 수가 노출되었습니다.");
    check(allAttrs(answer, "data-solid-face", "prism-pyramid") === faces, "각기둥과 각뿔을 붙인 실제 면 요소 수가 공식과 다릅니다.");
    check(allAttrs(answer, "data-solid-edge", "prism-pyramid") === edges, "각기둥과 각뿔을 붙인 실제 모서리 요소 수가 공식과 다릅니다.");
    check(allAttrs(answer, "data-solid-vertex", "prism-pyramid") === vertices, "각기둥과 각뿔을 붙인 실제 꼭짓점 요소 수가 공식과 다릅니다.");
    check(countClass(answer, "source61-e4-separate-solid") === 0, "답이 분리된 입체만 그리고 붙인 결과를 그리지 않았습니다.");
    return;
  }
  const [n] = values;
  const faces = 2 * n, edges = 3 * n, vertices = n + 2, total = faces + edges + vertices;
  check(!new RegExp(`(?<!\\d)${total}(?!\\d)`).test(promptText), "문제에 두 각뿔을 붙인 뒤의 합이 노출되었습니다.");
  check(allAttrs(answer, "data-solid-face", "bipyramid") === faces, "두 각뿔을 붙인 실제 면 요소 수가 공식과 다릅니다.");
  check(allAttrs(answer, "data-solid-edge", "bipyramid") === edges, "두 각뿔을 붙인 실제 모서리 요소 수가 공식과 다릅니다.");
  check(allAttrs(answer, "data-solid-vertex", "bipyramid") === vertices, "두 각뿔을 붙인 실제 꼭짓점 요소 수가 공식과 다릅니다.");
}

check(Boolean(api && api.names && api.names.includes(generatorKey)), "E4 전용 생성기가 등록되지 않았습니다.");
check(sourceIds.length === 5 && expectedPools.map(pool => pool.length).join(",") === "1,3,3,3,3", "E4 source type 또는 fixed pool 개수가 계약과 다릅니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const poolValues = new Map();
  const poolAnswers = new Map();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 600; seed += 1) {
      context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate({ generatorKey, variant, sourceItemId: sourceIds[variant] }, 0, difficulty, seed, variant);
        const poolIndex = generated.verifiedPoolIndex;
        const expected = expectedPools[variant][poolIndex] || { values: [], answer: "" };
        const evidence = checkCommon(generated, sourceIds[variant], variant, difficulty, expected);
        checkTopology(variant, generated, evidence);
        const valueSignature = evidence.values.join(",");
        if (poolValues.has(poolIndex)) check(poolValues.get(poolIndex) === valueSignature, "같은 pool에서 난이도별 값이 달라졌습니다.");
        else poolValues.set(poolIndex, valueSignature);
        if (poolAnswers.has(poolIndex)) check(poolAnswers.get(poolIndex) === String(generated.answer), "같은 pool에서 정답이 달라졌습니다.");
        else poolAnswers.set(poolIndex, String(generated.answer));
        pools.add(poolIndex);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  context = sourceIds[variant];
  check(pools.size === expectedPools[variant].length, "모든 고정 pool을 확인하지 못했습니다.");
  check(poolValues.size === expectedPools[variant].length && poolAnswers.size === expectedPools[variant].length, "모든 고정 pool의 값과 정답이 기록되지 않았습니다.");
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 4 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 4 각기둥과 각뿔 감사 통과: 5유형 · ${expectedPools.reduce((sum, pool) => sum + pool.length, 0)}개 고정 문항 · ${checked.toLocaleString()}회 독립 계산·pool·단일 정답·답 그림·실제 토폴로지·난이도 검사`);
