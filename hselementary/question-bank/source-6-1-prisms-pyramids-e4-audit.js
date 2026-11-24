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
  "6-1-u2-e4-mission-4",
  "6-1-u2-e4-example-4-3",
  "6-1-u2-e4-mission-5"
];
const sourceAnswers = new Map([
  ["6-1-u2-e4-example-4-1", "74"],
  ["6-1-u2-e4-example-4-2", "50"],
  ["6-1-u2-e4-example-4-4", "60cm"],
  ["6-1-u2-e4-mission-1", "면 9개, 모서리 16개, 꼭짓점 9개"],
  ["6-1-u2-e4-mission-4", "38"],
  ["6-1-u2-e4-example-4-3", "200cm²"],
  ["6-1-u2-e4-mission-5", "264cm²"]
]);
const evidenceKinds = [
  "cube-six-pyramid-assembly",
  "pyramid-vertex-truncation",
  "tetrahedron-midpoint-quadrilateral",
  "prism-pyramid-base-join",
  "pyramid-base-to-base",
  "square-pyramid-net-area-in-square",
  "square-pyramid-net-area-from-apex-square"
];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [
    { values: [6], answer: 74, baseSolid: "cube" },
    { values: [4], answer: 58, baseSolid: "cube" },
    { values: [5], answer: 66, baseSolid: "cube" }
  ],
  [
    { values: [4], answer: 50 },
    { values: [3], answer: 38 },
    { values: [5], answer: 62 }
  ],
  [
    { values: [20], answer: "60cm" },
    { values: [16], answer: "48cm" },
    { values: [24], answer: "72cm" }
  ],
  [
    { values: [4], answer: "면 9개, 모서리 16개, 꼭짓점 9개" },
    { values: [3], answer: "면 7개, 모서리 12개, 꼭짓점 7개" },
    { values: [5], answer: "면 11개, 모서리 20개, 꼭짓점 11개" }
  ],
  [
    { values: [6], answer: 38 },
    { values: [4], answer: 26 },
    { values: [5], answer: 32 }
  ],
  [
    { values: [20, 10, 50, 200], answer: "200cm²" },
    { values: [16, 8, 32, 128], answer: "128cm²" },
    { values: [24, 12, 72, 288], answer: "288cm²" }
  ],
  [
    { values: [22, 12, 72, 264], answer: "264cm²" },
    { values: [18, 10, 50, 180], answer: "180cm²" },
    { values: [26, 14, 98, 364], answer: "364cm²" }
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
    baseSolid: attr(markup, "data-base-solid") || "cube",
    values
  };
};

function polygonArea(points) {
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point[0] * next[1] - point[1] * next[0];
  }, 0)) / 2;
}

// This calculation is intentionally separate from the production generator.
function independentAnswer(evidence) {
  const values = evidence.values;
  if (evidence.kind === "cube-six-pyramid-assembly") {
    // 2026-11-24: pool 0 정육면체+사각뿔 6개(원문), pool 1 정육면체(윗면·아랫면 제외)+사각뿔 4개, pool 2 정육면체(아랫면 제외)+사각뿔 5개
    const [pyramids] = values;
    const center = { cube: { faces: 6, edges: 12, vertices: 8, sides: 4 } }[evidence.baseSolid];
    check(Boolean(center), "가운데 입체가 정육면체가 아닙니다.");
    if (!center) return "";
    const faces = (center.faces - pyramids) + pyramids * center.sides, edges = center.edges + pyramids * center.sides, vertices = center.vertices + pyramids, total = faces + edges + vertices;
    check(pyramids >= 1 && pyramids <= center.faces, "붙이는 각뿔 수가 가운데 입체의 면 수를 넘습니다.");
    check(vertices - edges + faces === 2, "완성 입체가 꼭짓점-모서리+면=2를 만족하지 않습니다.");
    check([["cube", 6, 74], ["cube", 4, 58], ["cube", 5, 66]].some(([solid, count, sum]) => solid === evidence.baseSolid && count === pyramids && sum === total), "완성 입체의 합이 고정 pool 74·58·66과 다릅니다.");
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
  if (evidence.kind === "square-pyramid-net-area-in-square") {
    const [outerSide, diagonal, baseArea, recordedNetArea] = values;
    const halfOuter = outerSide / 2, halfDiagonal = diagonal / 2;
    const frame = [[-halfOuter, -halfOuter], [halfOuter, -halfOuter], [halfOuter, halfOuter], [-halfOuter, halfOuter]];
    const base = [[0, -halfDiagonal], [halfDiagonal, 0], [0, halfDiagonal], [-halfDiagonal, 0]];
    const lateralFaces = [
      [base[0], base[3], frame[0]],
      [base[1], base[0], frame[1]],
      [base[2], base[1], frame[2]],
      [base[3], base[2], frame[3]]
    ];
    const coordinateArea = polygonArea(base) + lateralFaces.reduce((sum, face) => sum + polygonArea(face), 0);
    const emptyHeight = (outerSide - diagonal) / 2;
    const complementArea = outerSide * outerSide - 4 * (outerSide * emptyHeight / 2);
    const diagonalCandidates = Array.from({ length: outerSide - 1 }, (_, index) => index + 1).filter(candidate => candidate * candidate / 2 === baseArea);
    check([[16, 8, 32], [20, 10, 50], [24, 12, 72]].some(pool => pool.join(",") === [outerSide, diagonal, baseArea].join(",")), "정사각뿔 전개도 자료가 고정 pool과 다릅니다.");
    check(diagonalCandidates.length === 1 && diagonalCandidates[0] === diagonal, "밑면 넓이로 정해지는 대각선이 하나가 아닙니다.");
    check(polygonArea(base) === baseArea, "좌표로 계산한 밑면 넓이가 주어진 넓이와 다릅니다.");
    check(coordinateArea === complementArea && coordinateArea === outerSide * diagonal, "좌표 합과 바깥 정사각형에서 빈 부분을 뺀 넓이가 다릅니다.");
    check(recordedNetArea === coordinateArea, "기록된 전개도 넓이가 독립 좌표 계산과 다릅니다.");
    return `${coordinateArea}cm²`;
  }
  if (evidence.kind === "square-pyramid-net-area-from-apex-square") {
    const [apexSquareSide, diagonal, recordedBaseArea, recordedNetArea] = values;
    const halfFrame = apexSquareSide / 2, halfDiagonal = diagonal / 2;
    const apexSquare = [[-halfFrame, -halfFrame], [halfFrame, -halfFrame], [halfFrame, halfFrame], [-halfFrame, halfFrame]];
    const base = [[0, -halfDiagonal], [halfDiagonal, 0], [0, halfDiagonal], [-halfDiagonal, 0]];
    const lateralFaces = [
      [base[0], base[3], apexSquare[0]],
      [base[1], base[0], apexSquare[1]],
      [base[2], base[1], apexSquare[2]],
      [base[3], base[2], apexSquare[3]]
    ];
    const coordinateArea = polygonArea(base) + lateralFaces.reduce((sum, face) => sum + polygonArea(face), 0);
    const baseArea = diagonal * diagonal / 2;
    const emptyHeight = (apexSquareSide - diagonal) / 2;
    const complementArea = apexSquareSide * apexSquareSide - 4 * (apexSquareSide * emptyHeight / 2);
    const candidates = new Set([coordinateArea, complementArea, apexSquareSide * diagonal]);
    check([[18, 10], [22, 12], [26, 14]].some(pool => pool.join(",") === [apexSquareSide, diagonal].join(",")), "꼭짓점을 이은 정사각형과 밑면 대각선 자료가 고정 pool과 다릅니다.");
    check(apexSquareSide > diagonal && diagonal > 0 && diagonal % 2 === 0, "꼭짓점 정사각형과 밑면 대각선 길이가 전개도 조건과 맞지 않습니다.");
    check(candidates.size === 1, "좌표 합·빈 부분 빼기·가로세로 곱의 전개도 넓이가 서로 다릅니다.");
    check(polygonArea(base) === baseArea && recordedBaseArea === baseArea, "밑면 대각선으로 계산한 정사각형 넓이가 기록과 다릅니다.");
    check(recordedNetArea === coordinateArea, "기록된 전개도 넓이가 독립 좌표 계산과 다릅니다.");
    return `${coordinateArea}cm²`;
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

// 보통 난이도 첫 문항(pool 0)은 원본 책 문장·수치와 같아야 합니다(끝맺음만 앱 말투). 예제 4-1은 이번 복원 범위 밖입니다.
const bookPrompts = [
  null,
  "그림과 같은 사각뿔에서 모든 모서리를 삼등분하여 각 꼭짓점에서 모서리의 삼등분한 점을 지나도록 잘라 내었을 때, 남은 입체도형의 면, 모서리, 꼭짓점의 수의 합을 구하세요.",
  "모든 모서리의 길이가 같은 삼각뿔에서 그림과 같이 네 모서리의 가운뎃점을 연결하여 사각형 ㅁㅂㅅㅇ을 만들었습니다. 이 사각형의 둘레의 길이가 20cm일 때, 삼각뿔의 모든 모서리의 길이의 합을 구하세요.",
  "다음 그림과 같이 밑면의 크기와 모양이 같은 사각뿔과 사각기둥을 밑면끼리 꼭 맞게 이어 붙여 새로운 입체도형을 만들었습니다. 이 입체도형의 면의 수, 모서리의 수, 꼭짓점의 수를 각각 구하세요.",
  "다음 입체도형은 똑같은 육각뿔 두 개를 밑면을 서로 이어 붙여서 만들 수 있습니다. 이 입체도형의 면의 수, 모서리의 수, 꼭짓점의 수의 합을 구하세요.",
  "정사각형 안에 밑면이 정사각형인 사각뿔의 전개도를 그렸습니다. 사각뿔의 밑면의 넓이가 50cm²일 때 사각뿔의 전개도의 넓이는 몇 cm²입니까?",
  "그림은 밑면이 정사각형이고, 밑면의 한 대각선의 길이가 12cm인 사각뿔의 전개도입니다. 전개도에서 각뿔의 꼭짓점이 되는 점을 이은 정사각형의 한 변의 길이가 22cm일 때, 사각뿔의 전개도의 넓이는 몇 cm²입니까?"
];

function checkTopology(variant, generated, evidence) {
  const prompt = String(generated.prompt);
  const answer = String(generated.answerVisual);
  const values = evidence.values;
  const promptText = visibleText(prompt);
  if (generated.verifiedPoolIndex === 0 && bookPrompts[variant]) {
    check(promptText.includes(bookPrompts[variant]), "첫 문항 문장이 원본 책 문항과 다릅니다.");
    check(String(generated.answer) === sourceAnswers.get(sourceIds[variant]), `첫 문항 답 '${generated.answer}'이 원본 문항 답 '${sourceAnswers.get(sourceIds[variant])}'과 다릅니다.`);
  }
  if (variant === 2) {
    for (const name of ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"]) check(prompt.includes(`>${name}</text>`), `문제 그림에 원본의 점 ${name} 이름이 없습니다.`);
    check((prompt.match(/data-section-side="/g) || []).length === 4, "문제 그림에 원본처럼 사각형 ㅁㅂㅅㅇ의 네 변이 없습니다.");
  }
  if (variant === 4) check(prompt.includes("source61-e4-bipyramid") && !prompt.includes("data-solid-"), "문제 그림이 원본처럼 두 각뿔을 붙인 입체가 아니거나 셀 수 있는 자료가 노출되었습니다.");
  check(answer.includes("<svg"), "답에 다시 그린 SVG가 없습니다.");
  if (![0, 5, 6].includes(variant)) check(answer.includes("source61-e4-hidden-edge"), "답 그림에 가려진 모서리를 나타내는 점선이 없습니다.");
  if (variant === 0) {
    const [solidKind, faces, edges, vertices, total] = [["stellated-cube", 24, 36, 14, 74], ["cube-four-pyramids", 18, 28, 12, 58], ["cube-five-pyramids", 21, 32, 13, 66]][generated.verifiedPoolIndex];
    for (const forbidden of [faces, edges, vertices, total].map(String)) check(!new RegExp(`(?<!\\d)${forbidden}(?!\\d)`).test(promptText), `문제에 완성 입체의 결과 ${forbidden}가 노출되었습니다.`);
    check(allAttrs(answer, "data-solid-face", solidKind) === faces, `각뿔을 붙인 입체의 실제 면이 ${faces}개가 아닙니다.`);
    check(allAttrs(answer, "data-solid-edge", solidKind) === edges, `각뿔을 붙인 입체의 실제 모서리가 ${edges}개가 아닙니다.`);
    check(allAttrs(answer, "data-solid-vertex", solidKind) === vertices, `각뿔을 붙인 입체의 실제 꼭짓점이 ${vertices}개가 아닙니다.`);
    check(evidence.baseSolid === expectedPools[0][generated.verifiedPoolIndex].baseSolid, "가운데 입체 종류가 고정 pool과 다릅니다.");
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
  if (variant === 5) {
    const [outerSide, diagonal, baseArea, netArea] = values;
    const emptyHeight = (outerSide - diagonal) / 2;
    check(!new RegExp(`(?<!\\d)${netArea}(?!\\d)`).test(promptText), "문제에 전개도 넓이의 답이 노출되었습니다.");
    check(attr(prompt, "data-outer-side-cm") === String(outerSide) && attr(answer, "data-outer-side-cm") === String(outerSide), "문제와 답의 바깥 정사각형 한 변이 다릅니다.");
    check(attr(prompt, "data-base-diagonal-cm") === String(diagonal) && attr(answer, "data-base-diagonal-cm") === String(diagonal), "문제와 답의 밑면 대각선 자료가 다릅니다.");
    check(attr(prompt, "data-base-area-cm2") === String(baseArea) && attr(answer, "data-base-area-cm2") === String(baseArea), "문제와 답의 밑면 넓이가 다릅니다.");
    check(attr(answer, "data-net-area-cm2") === String(netArea), "답 그림의 전개도 넓이가 독립 계산과 다릅니다.");
    check(allAttrs(prompt, "data-net-face", "base") === 1 && allAttrs(answer, "data-net-face", "base") === 1, "문제와 답의 밑면이 각각 한 개가 아닙니다.");
    check(allAttrs(prompt, "data-net-face", "lateral") === 4 && allAttrs(answer, "data-net-face", "lateral") === 4, "문제와 답의 옆면 삼각형이 각각 네 개가 아닙니다.");
    check(allAttrs(prompt, "data-fold-edge") === 4 && allAttrs(answer, "data-fold-edge") === 4, "문제와 답의 네 접는 선이 모두 표시되지 않았습니다.");
    check(allAttrs(prompt, "data-complement-region") === 0 && allAttrs(answer, "data-complement-region") === 4, "답에만 네 빈 삼각형이 따로 표시되어야 합니다.");
    check(allAttrs(prompt, "data-base-diagonal") === 0 && allAttrs(answer, "data-base-diagonal", "shown") === 1, "답에만 밑면 대각선이 표시되어야 합니다.");
    check(answer.includes(`(${outerSide}-${diagonal})÷2=${emptyHeight}cm`) && answer.includes(`${outerSide}×${outerSide}`), "답 그림의 빈 삼각형 높이와 바깥 정사각형 계산이 없습니다.");
    return;
  }
  if (variant === 6) {
    const [apexSquareSide, diagonal, baseArea, netArea] = values;
    const emptyHeight = (apexSquareSide - diagonal) / 2;
    check(!new RegExp(`(?<!\\d)${baseArea}(?!\\d)`).test(promptText) && !new RegExp(`(?<!\\d)${netArea}(?!\\d)`).test(promptText), "문제에 밑면 넓이 또는 전개도 넓이의 답이 노출되었습니다.");
    check(attr(prompt, "data-frame-kind") === "apex-square" && attr(answer, "data-frame-kind") === "apex-square", "문제와 답의 꼭짓점을 이은 정사각형 표시가 없습니다.");
    check(attr(prompt, "data-outer-side-cm") === String(apexSquareSide) && attr(answer, "data-outer-side-cm") === String(apexSquareSide), "문제와 답의 꼭짓점 정사각형 한 변이 다릅니다.");
    check(attr(prompt, "data-base-diagonal-cm") === String(diagonal) && attr(answer, "data-base-diagonal-cm") === String(diagonal), "문제와 답의 주어진 밑면 대각선이 다릅니다.");
    check(!attr(prompt, "data-base-area-cm2") && attr(answer, "data-base-area-cm2") === String(baseArea), "문제에는 밑면 넓이를 숨기고 답에서만 계산해야 합니다.");
    check(attr(answer, "data-net-area-cm2") === String(netArea), "답 그림의 전개도 넓이가 독립 계산과 다릅니다.");
    check(allAttrs(prompt, "data-net-face", "base") === 1 && allAttrs(answer, "data-net-face", "base") === 1, "문제와 답의 밑면이 각각 한 개가 아닙니다.");
    check(allAttrs(prompt, "data-net-face", "lateral") === 4 && allAttrs(answer, "data-net-face", "lateral") === 4, "문제와 답의 옆면 삼각형이 각각 네 개가 아닙니다.");
    check(allAttrs(prompt, "data-fold-edge") === 4 && allAttrs(answer, "data-fold-edge") === 4, "문제와 답의 네 접는 선이 모두 표시되지 않았습니다.");
    check(allAttrs(prompt, "data-complement-region") === 0 && allAttrs(answer, "data-complement-region") === 4, "답에만 네 빈 삼각형이 표시되어야 합니다.");
    check(allAttrs(prompt, "data-base-diagonal", "given") === 1 && allAttrs(answer, "data-base-diagonal", "given") === 1, "문제와 답에 주어진 밑면 대각선이 모두 표시되어야 합니다.");
    check(allAttrs(prompt, "data-apex-point") === 4 && allAttrs(answer, "data-apex-point") === 4, "각뿔의 꼭짓점이 되는 네 점이 모두 표시되지 않았습니다.");
    check(answer.includes(`(${apexSquareSide}-${diagonal})÷2=${emptyHeight}cm`) && answer.includes(`${apexSquareSide}×${apexSquareSide}`), "답 그림의 빈 삼각형 높이와 꼭짓점 정사각형 계산이 없습니다.");
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
check(sourceIds.length === 7 && expectedPools.map(pool => pool.length).join(",") === "3,3,3,3,3,3,3", "E4 source type 또는 fixed pool 개수가 계약과 다릅니다.");

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
  check(Array.from(poolAnswers.values()).includes(sourceAnswers.get(sourceIds[variant])), `원문 답 ${sourceAnswers.get(sourceIds[variant])}이 고정 문항 묶음에 없습니다.`);
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 4 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 4 각기둥과 각뿔 감사 통과: 7유형 · ${expectedPools.reduce((sum, pool) => sum + pool.length, 0)}개 고정 문항 · ${checked.toLocaleString()}회 독립 계산·pool·단일 정답·답 그림·실제 토폴로지·난이도 검사`);
