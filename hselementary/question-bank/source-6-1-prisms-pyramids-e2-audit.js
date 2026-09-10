"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6PrismsPyramidsE2";
const sourceIds = [
  "6-1-u2-e2-example-2-2",
  "6-1-u2-e2-mission-2",
  "6-1-u2-e2-mission-5",
  "6-1-u2-e2-mission-6",
  "6-1-u2-e2-mission-1",
  "6-1-u2-e2-example-2-4",
  "6-1-u2-e2-example-2-3",
  "6-1-u2-e2-example-2-1",
  "6-1-u2-e2-mission-4"
];
const sourceAnswers = new Map([
  ["6-1-u2-e2-example-2-2", 74],
  ["6-1-u2-e2-mission-2", 63],
  ["6-1-u2-e2-mission-5", 92],
  ["6-1-u2-e2-mission-6", 77],
  ["6-1-u2-e2-mission-1", 60],
  ["6-1-u2-e2-example-2-4", 848],
  ["6-1-u2-e2-example-2-3", 6],
  ["6-1-u2-e2-example-2-1", "108,54"],
  ["6-1-u2-e2-mission-4", 4]
]);
const evidenceKinds = [
  "cuboid-all-corners-cut",
  "regular-prism-radial-cut",
  "prism-all-vertices-truncated",
  "pentagonal-prism-shortest-net-area",
  "pentagonal-prism-45-degree-spiral-height",
  "three-triangular-prisms-trapezoidal-prism-surface-area",
  "triangular-prism-three-face-shortest-segment",
  "hexagonal-prism-six-congruent-pieces-edge-extremes",
  "square-prism-four-face-shortest-segment"
];
const difficultyExpected = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedPools = [
  [
    { values: [1, 4, 14, 24, 36, 74], answer: 74 },
    { values: [2, 7, 14, 24, 36, 74], answer: 74 },
    { values: [3, 10, 14, 24, 36, 74], answer: 74 }
  ],
  [
    { values: [5, 9, 45], answer: 45 },
    { values: [7, 9, 63], answer: 63 },
    { values: [8, 9, 72], answer: 72 }
  ],
  [
    { values: [5, 10, 15, 17, 30, 45, 92], answer: 92 },
    { values: [6, 12, 18, 20, 36, 54, 110], answer: 110 },
    { values: [7, 14, 21, 23, 42, 63, 128], answer: 128 }
  ],
  [
    { values: [7, 11, 2, 3, 14, 77], answer: 77 },
    { values: [8, 13, 2, 3, 16, 104], answer: 104 },
    { values: [6, 15, 2, 3, 12, 90], answer: 90 }
  ],
  [
    { values: [10, 5, 1, 6, 60], answer: 60 },
    { values: [8, 5, 1, 6, 48], answer: 48 },
    { values: [12, 5, 1, 6, 72], answer: 72 }
  ],
  [
    { values: [10, 8, 10, 144, 12, 56, 848], answer: 848 },
    { values: [13, 12, 9, 180, 10, 56, 864], answer: 864 },
    { values: [17, 15, 8, 360, 16, 82, 1376], answer: 1376 }
  ],
  [
    { values: [9, 18, 3, 2, 6], answer: 6 },
    { values: [10, 21, 3, 2, 7], answer: 7 },
    { values: [11, 24, 3, 2, 8], answer: 8 }
  ],
  [
    { values: [6, 6, 3, 18, 9, 108, 54, 96], answer: "108,54" },
    { values: [6, 6, 3, 18, 9, 108, 54, 108], answer: "108,54" },
    { values: [6, 6, 3, 18, 9, 108, 54, 120], answer: "108,54" }
  ],
  [
    { values: [6, 12, 4, 3, 3], answer: 3 },
    { values: [7, 16, 4, 3, 4], answer: 4 },
    { values: [8, 20, 4, 3, 5], answer: 5 }
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
const countClass = (markup, className) => {
  const expression = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`, "g");
  return (String(markup).match(expression) || []).length;
};
const stripHidden = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "");
const stripTags = value => String(value).replace(/<[^>]*>/g, " ");
const visibleText = markup => stripTags(stripHidden(markup)).replace(/\s+/g, " ").trim();
const numberAnswer = value => {
  const numbers = String(value).match(/-?\d+(?:\.\d+)?/g) || [];
  return numbers.length === 1 ? Number(numbers[0]) : NaN;
};
const answerSignature = value => (String(value).match(/-?\d+(?:\.\d+)?/g) || []).map(Number).join(",");

const parseEvidence = prompt => {
  const evidenceMarkup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source61-prism-e2-kind="[^"]+"[\s\S]*?<\/span>/)?.[0];
  if (!evidenceMarkup) throw new Error("E2 독립 검산 자료가 없습니다.");
  const valuesText = attr(evidenceMarkup, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isFinite(value))) throw new Error("E2 data-values가 깨졌습니다.");
  return {
    kind: attr(evidenceMarkup, "data-source61-prism-e2-kind"),
    sourceItemId: attr(evidenceMarkup, "data-source-item"),
    contract: attr(evidenceMarkup, "data-result-contract"),
    difficulty: attr(evidenceMarkup, "data-difficulty-design"),
    values
  };
};

// Independent formulas intentionally do not call or reuse a production generator.
function independentAnswer(evidence) {
  const values = evidence.values;
  if (evidence.kind === "cuboid-all-corners-cut") {
    const [distance, minimumEdge, faces, vertices, edges, total] = values;
    check([1, 2, 3].includes(distance), "절단 거리가 고정 pool 1, 2, 3이 아닙니다.");
    check(minimumEdge === 3 * distance + 1, "최소 모서리 길이 조건이 절단 거리와 맞지 않습니다.");
    check(faces === 14 && vertices === 24 && edges === 36, "직육면체 절단 뒤 F=14, V=24, E=36이 아닙니다.");
    check(faces + vertices + edges === total && total === 74, "절단 뒤 전체 수가 독립 계산 74와 다릅니다.");
    return total;
  }
  if (evidence.kind === "regular-prism-radial-cut") {
    const [n, edgesPerPiece, total] = values;
    check([5, 7, 8].includes(n), "정n각기둥의 n이 고정 pool 5, 7, 8이 아닙니다.");
    check(edgesPerPiece === 9, "삼각기둥 한 조각의 모서리 수가 9가 아닙니다.");
    check(edgesPerPiece * n === total, "삼각기둥 n개의 모서리 합을 독립 계산하지 못했습니다.");
    return total;
  }
  if (evidence.kind === "prism-all-vertices-truncated") {
    const [n, originalVertices, originalEdges, faces, vertices, edges, total] = values;
    check([5, 6, 7].includes(n), "정n각기둥의 n이 고정 pool 5, 6, 7이 아닙니다.");
    check(originalVertices === 2 * n && originalEdges === 3 * n, "원래 각기둥의 꼭짓점·모서리 수가 다릅니다.");
    check(faces === 3 * n + 2, "절단 뒤 면의 수가 3n+2와 다릅니다.");
    check(vertices === 6 * n, "절단 뒤 꼭짓점 수가 6n과 다릅니다.");
    check(edges === 9 * n, "절단 뒤 모서리 수가 9n과 다릅니다.");
    check(vertices + edges + faces === total && total === 18 * n + 2, "절단 뒤 전체 수가 독립 계산과 다릅니다.");
    return total;
  }
  if (evidence.kind === "pentagonal-prism-shortest-net-area") {
    const [side, height, shortFaces, longFaces, triangleBase, area] = values;
    check([6, 7, 8].includes(side) && [11, 13, 15].includes(height), "정오각기둥의 고정 길이 pool이 아닙니다.");
    check(shortFaces === 2 && longFaces === 3 && shortFaces + longFaces === 5, "정오각기둥의 두 둘레 방향이 옆면 2개와 3개가 아닙니다.");
    check(triangleBase === shortFaces * side, "펼친 삼각형의 밑변이 옆면 2장의 너비와 다릅니다.");
    const shortPathSquared = height * height + (shortFaces * side) ** 2;
    const longPathSquared = height * height + (longFaces * side) ** 2;
    check(shortPathSquared < longPathSquared, "옆면 2개를 지나는 경로가 옆면 3개 경로보다 유일하게 짧지 않습니다.");
    check(area === triangleBase * height / 2 && area === side * height, "삼각형 넓이가 독립 계산과 다릅니다.");
    return area;
  }
  if (evidence.kind === "pentagonal-prism-45-degree-spiral-height") {
    const [side, facesPerTurn, extraFaces, crossedFaces, height] = values;
    check([8, 10, 12].includes(side), "정오각기둥의 밑면 한 변이 고정 pool 8, 10, 12가 아닙니다.");
    check(facesPerTurn === 5, "정오각기둥 한 바퀴의 옆면 수가 5가 아닙니다.");
    check(extraFaces === 1 && crossedFaces === facesPerTurn + extraFaces, "도착점까지 한 바퀴 뒤 옆면 한 장을 더 지나는 구조가 아닙니다.");
    check(height === crossedFaces * side, "45도 경로의 가로 이동과 각기둥 높이가 같지 않습니다.");
    return height;
  }
  if (evidence.kind === "three-triangular-prisms-trapezoidal-prism-surface-area") {
    const [slant, altitude, prismLength, baseArea, triangleBase, basePerimeter, surfaceArea] = values;
    check([[10, 8, 10, 144], [13, 12, 9, 180], [17, 15, 8, 360]].some(pool => pool.join(",") === [slant, altitude, prismLength, baseArea].join(",")), "세 삼각기둥의 길이와 밑면 넓이가 고정 pool과 다릅니다.");
    check(Number.isInteger(triangleBase) && triangleBase === 2 * baseArea / (3 * altitude), "한 삼각형의 넓이에서 구한 밑변이 다릅니다.");
    check(slant * slant === altitude * altitude + (triangleBase / 2) ** 2, "삼각형의 양쪽 변·높이·밑변이 직각삼각형 관계와 맞지 않습니다.");
    check(basePerimeter === 3 * triangleBase + 2 * slant, "세 삼각형이 만든 사다리꼴의 바깥 둘레가 다릅니다.");
    check(surfaceArea === 2 * baseArea + basePerimeter * prismLength, "두 밑면과 옆면으로 계산한 겉넓이가 다릅니다.");
    return surfaceArea;
  }
  if (evidence.kind === "triangular-prism-three-face-shortest-segment") {
    const [side, prismHeight, faceCount, crossingCount, targetLength] = values;
    check([[9, 18], [10, 21], [11, 24]].some(pool => pool.join(",") === [side, prismHeight].join(",")), "삼각기둥의 밑면 한 변과 높이가 고정 pool과 다릅니다.");
    check(faceCount === 3 && crossingCount === 2, "지나는 옆면 3개와 경계점 2개의 구조가 다릅니다.");
    check(prismHeight % faceCount === 0, "기둥 높이가 같은 세 부분으로 나누어지지 않습니다.");
    check(targetLength === prismHeight / faceCount, "선분 ㅇㅂ의 길이가 높이의 3분의 1과 다릅니다.");
    const unfoldedWidth = side * faceCount;
    const fullRouteSquared = unfoldedWidth ** 2 + prismHeight ** 2;
    const oneFaceRouteSquared = side ** 2 + targetLength ** 2;
    check(fullRouteSquared === faceCount ** 2 * oneFaceRouteSquared, "전개도의 곧은 선이 같은 옆면 세 장에서 같은 비율로 나뉘지 않습니다.");
    return targetLength;
  }
  if (evidence.kind === "hexagonal-prism-six-congruent-pieces-edge-extremes") {
    const [baseSides, pieceCount, minimumBaseSides, maximumEdgesPerPiece, minimumEdgesPerPiece, maximumTotal, minimumTotal, prismHeight] = values;
    check(baseSides === 6 && pieceCount === 6 && minimumBaseSides === 3, "정육각기둥·합동인 여섯 조각·삼각기둥 최소 조건이 다릅니다.");
    check([96, 108, 120].includes(prismHeight), "정육각기둥 그림 높이가 고정 pool과 다릅니다.");
    check(maximumEdgesPerPiece === 3 * baseSides && maximumTotal === pieceCount * maximumEdgesPerPiece, "정육각기둥 여섯 층의 최대 모서리 합이 108이 아닙니다.");
    check(minimumEdgesPerPiece === 3 * minimumBaseSides && minimumTotal === pieceCount * minimumEdgesPerPiece, "삼각기둥 여섯 조각의 최소 모서리 합이 54가 아닙니다.");
    check(maximumTotal === 108 && minimumTotal === 54 && maximumTotal > minimumTotal, "최대·최소의 값 또는 순서가 다릅니다.");
    return `${maximumTotal},${minimumTotal}`;
  }
  if (evidence.kind === "square-prism-four-face-shortest-segment") {
    const [side, prismHeight, faceCount, crossingCount, targetLength] = values;
    check([[6, 12], [7, 16], [8, 20]].some(pool => pool.join(",") === [side, prismHeight].join(",")), "사각기둥의 밑면 한 변과 높이가 고정 pool과 다릅니다.");
    check(faceCount === 4 && crossingCount === 3, "지나는 옆면 4개와 경계점 3개의 구조가 다릅니다.");
    check(prismHeight % faceCount === 0, "기둥 높이가 같은 네 부분으로 나누어지지 않습니다.");
    check(targetLength === prismHeight / faceCount, "선분 ㄴㅈ의 길이가 높이의 4분의 1과 다릅니다.");
    const unfoldedWidth = side * faceCount;
    const fullRouteSquared = unfoldedWidth ** 2 + prismHeight ** 2;
    const oneFaceRouteSquared = side ** 2 + targetLength ** 2;
    check(fullRouteSquared === faceCount ** 2 * oneFaceRouteSquared, "전개도의 곧은 선이 같은 옆면 네 장에서 같은 비율로 나뉘지 않습니다.");
    return targetLength;
  }
  throw new Error(`알 수 없는 E2 검산 종류: ${evidence.kind}`);
}

function checkCommon(generated, sourceItemId, difficulty, expected) {
  check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), "문제·정답·풀이가 비었습니다.");
  check(generated.generator === generatorKey, "E2 전용 생성기를 사용하지 않았습니다.");
  check(generated.sourceItemId === sourceItemId, "생성 결과의 원문 유형 ID가 다릅니다.");
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, "고정 검증 3문항 계약이 다릅니다.");
  check(Number.isInteger(generated.verifiedPoolIndex) && generated.verifiedPoolIndex >= 0 && generated.verifiedPoolIndex <= 2, "고정 묶음 번호가 0~2가 아닙니다.");
  check(typeof generated.answerVisual === "string" && generated.answerVisual.includes("source61-answer-diagram"), "답 그림 wrapper가 없습니다.");
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`), "답 그림의 원문 유형 ID가 다릅니다.");
  check(generated.answerVisual.includes(`data-verified-pool-index="${generated.verifiedPoolIndex}"`), "답 그림의 고정 묶음 번호가 다릅니다.");
  check(generated.answerVisual.includes(`data-source-item="${sourceItemId}"`), "답 그림의 숨은 원문 연결이 없습니다.");
  const evidence = parseEvidence(generated.prompt);
  check(evidence.kind === evidenceKinds[sourceIds.indexOf(sourceItemId)], "evidence kind가 원문 유형과 다릅니다.");
  check(evidence.sourceItemId === sourceItemId, "독립 검산 자료의 원문 유형 ID가 다릅니다.");
  const expectedContract = evidence.kind === "hexagonal-prism-six-congruent-pieces-edge-extremes" ? "ordered-two-values" : "single-value";
  check(evidence.contract === expectedContract, "문항의 정답 계약이 원문 물음과 다릅니다.");
  check(evidence.difficulty === difficultyExpected[String(difficulty)], "난이도별 풀이 부담 표시가 다릅니다.");
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), "쉬움 단계의 안내가 없습니다.");
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), "원본 단계에 난이도 안내가 섞였습니다.");
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), "어려움 단계의 스스로 찾기 안내가 없습니다.");
  const expectedAnswer = independentAnswer(evidence);
  const displayedAnswer = expectedContract === "ordered-two-values" ? answerSignature(generated.answer) : numberAnswer(generated.answer);
  check(displayedAnswer === expectedAnswer, `표시 답 '${generated.answer}'이 독립 계산 '${expectedAnswer}'과 다릅니다.`);
  check(evidence.values.join(",") === expected.values.join(","), "고정 pool의 data-values가 계약과 다릅니다.");
  check(displayedAnswer === expected.answer, "고정 pool의 정답이 계약과 다릅니다.");
  const promptStructures = allAttrs(generated.prompt, "data-source61-e2-structure");
  const answerStructures = allAttrs(generated.answerVisual, "data-source61-e2-structure");
  check(promptStructures.length > 0 && answerStructures.length > 0, "문제와 답 그림에 공통 구조 서명이 없습니다.");
  check(promptStructures.join("|") === answerStructures.join("|"), "문제와 답 그림의 구조 서명이 다릅니다.");
  check(!generated.prompt.includes("data-result-highlight="), "문제에 정답 강조 속성이 노출되었습니다.");
  check(generated.answerVisual.includes("data-result-highlight="), "답 그림에 목표 결과 강조가 없습니다.");
  const visible = visibleText(`${generated.prompt}\n${generated.solution}`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visible), "문제 또는 풀이에 깨진 값·학년 밖 표현이 있습니다.");
  checked += 1;
  return evidence;
}

function checkVariant(variant, generated, evidence) {
  const prompt = String(generated.prompt);
  const answer = String(generated.answerVisual);
  const values = evidence.values;
  if (variant === 0) {
    const [distance] = values;
    const promptText = visibleText(prompt);
    for (const forbidden of ["14", "24", "36", "74"]) {
      check(!new RegExp(`\\b${forbidden}\\b`).test(promptText), `문제에 절단 뒤 결과 ${forbidden}가 노출되었습니다.`);
    }
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-cut-distance="${distance}"`), "절단 거리 semantic data가 pool 값과 다릅니다.");
      check(markup.includes('data-vertex-count="24"') && markup.includes('data-edge-count="36"') && markup.includes('data-face-count="14"') && markup.includes('data-total-count="74"'), "F/V/E/전체 semantic data가 계약과 다릅니다.");
      check(countClass(markup, "source61-e2-corner-cut") === 8, "직육면체의 절단면 polygon이 8개가 아닙니다.");
      check(countClass(markup, "source61-e2-prism-vertex") === 24, "절단 뒤 꼭짓점 dot이 24개가 아닙니다.");
    }
    check(answer.includes('data-result-highlight="74"'), "답에서 74가 강조되지 않았습니다.");
    return;
  }
  if (variant === 1) {
    const [n] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes(`${n}각기둥`), "문제에 주어진 정n각기둥이 없습니다.");
    check(!/(?:9n|9×n|n×9)/.test(promptText), "문제에 계산 결과 9n이 노출되었습니다.");
    check(!new RegExp(`\\b(?:${9 * n}|45|63|72)\\b`).test(promptText), "문제에 나누어진 모서리 수의 계산 결과가 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-n="${n}"`), "정n각기둥의 n semantic data가 없습니다.");
      check(markup.includes(`data-fan-count="${n}"`), "부채꼴로 나뉜 삼각기둥 수가 n과 다릅니다.");
      check(markup.includes('data-edge-per-fan="9"') && markup.includes(`data-total-edge-count="${9 * n}"`), "삼각기둥 모서리 수 semantic data가 계약과 다릅니다.");
      check(countClass(markup, "source61-e2-fan") === n, "부채꼴 sector 개수가 실제 n과 다릅니다.");
    }
    check(answer.includes(`data-result-highlight="${9 * n}"`), "답에서 9n 결과가 강조되지 않았습니다.");
    return;
  }
  if (variant === 2) {
    const [n, originalVertices, originalEdges, faces, vertices, edges, total] = values;
    const promptText = visibleText(prompt);
    for (const forbidden of [String(faces), String(vertices), String(edges), String(total)]) {
      check(!new RegExp(`\\b${forbidden}\\b`).test(promptText), `문제에 절두 뒤 결과 ${forbidden}가 노출되었습니다.`);
    }
    check(!/(?:18n\\+2|18×n\\+2|18n)/.test(promptText), "문제에 절두 뒤 전체 공식이 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-n="${n}"`) && markup.includes(`data-original-vertices="${originalVertices}"`) && markup.includes(`data-original-edges="${originalEdges}"`), "원래 각기둥 semantic data가 계약과 다릅니다.");
      check(markup.includes(`data-result-vertex-count="${vertices}"`) && markup.includes(`data-result-edge-count="${edges}"`) && markup.includes(`data-result-face-count="${faces}"`) && markup.includes(`data-total-count="${total}"`), "절두 뒤 결과 semantic data가 계약과 다릅니다.");
      check(countClass(markup, "source61-e2-corner-cut") === 2 * n, "절단면 polygon이 2n개가 아닙니다.");
      check(countClass(markup, "source61-e2-prism-vertex") === 6 * n, "절단 뒤 꼭짓점 dot이 6n개가 아닙니다.");
    }
    check(!prompt.includes("data-result-highlight="), "문제에 결과 강조 속성이 있습니다.");
    check(answer.includes(`data-result-highlight="${total}"`), "답에서 절두 뒤 전체 수가 강조되지 않았습니다.");
    return;
  }

  if (variant === 3) {
    const [side, height, shortFaces, longFaces, triangleBase, area] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes("정오각기둥") && prompt.includes("삼각형 ㄱㄴㄷ"), "원문의 정오각기둥과 삼각형 ㄱㄴㄷ 물음이 없습니다.");
    check(!new RegExp(`(^|\\D)${area}(?=\\D|$)`).test(promptText), "문제에 삼각형 넓이 답이 노출되었습니다.");
    check(!new RegExp(`(^|\\D)${triangleBase}(?=\\D|$)`).test(promptText), "문제에 펼친 밑변의 계산 결과가 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes('data-base-sides="5"') && markup.includes('data-net-face-count="5"'), "정오각기둥과 옆면 다섯 장의 semantic data가 없습니다.");
      check(markup.includes(`data-base-edge="${side}"`) && markup.includes(`data-prism-height="${height}"`), "밑면의 한 변과 높이 semantic data가 고정 pool과 다릅니다.");
      check(markup.includes(`data-shortest-face-count="${shortFaces}"`) && markup.includes(`data-other-face-count="${longFaces}"`), "두 방향의 옆면 수 semantic data가 다릅니다.");
      check(markup.includes(`data-triangle-base="${triangleBase}"`) && markup.includes(`data-area="${area}"`), "펼친 삼각형의 길이·넓이 semantic data가 다릅니다.");
      check(countClass(markup, "source61-e2-shortest-face") === 5, "전개도의 옆면 사각형이 5개가 아닙니다.");
      check(countClass(markup, "source61-e2-shortest-solid-route") === 1, "입체 그림의 가장 짧은 경로가 하나가 아닙니다.");
    }
    check(countClass(prompt, "source61-e2-shortest-net-line") === 0, "문제 전개도에 정답 선분이 미리 그려졌습니다.");
    check(countClass(answer, "source61-e2-shortest-net-line") === 1 && countClass(answer, "source61-e2-shortest-triangle") === 1, "답 그림에 최단 선분과 삼각형 강조가 없습니다.");
    check(answer.includes(`data-result-highlight="${area}"`), "답에서 삼각형 넓이가 강조되지 않았습니다.");
    return;
  }

  if (variant === 4) {
    const [side, facesPerTurn, extraFaces, crossedFaces, height] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes("오각기둥") && prompt.includes("45°") && prompt.includes("점 ㄱ") && prompt.includes("점 ㄴ"), "원문의 오각기둥·45도·출발점·도착점 조건이 없습니다.");
    check(!new RegExp(`(^|\\D)${height}(?=\\D|$)`).test(promptText), "문제에 각기둥 높이 답이 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes('data-base-sides="5"') && markup.includes(`data-base-edge="${side}"`), "정오각기둥과 밑면 한 변 semantic data가 다릅니다.");
      check(markup.includes(`data-faces-per-turn="${facesPerTurn}"`) && markup.includes(`data-extra-face-count="${extraFaces}"`), "한 바퀴와 추가 옆면 수 semantic data가 다릅니다.");
      check(markup.includes(`data-crossed-face-count="${crossedFaces}"`) && markup.includes(`data-route-segment-count="${crossedFaces}"`), "지나간 옆면과 이동 조각 수 semantic data가 다릅니다.");
      check(markup.includes(`data-prism-height="${height}"`), "45도 이동으로 구한 높이 semantic data가 다릅니다.");
      check(markup.includes(`data-unfolded-width="${height}"`) && markup.includes(`data-unfolded-height="${height}"`) && markup.includes('data-unfolded-angle="45"'), "펼친 가로·세로의 같은 축척과 45도 자료가 다릅니다.");
      check(countClass(markup, "source61-e2-spiral-route") === crossedFaces, "입체 그림의 45도 이동 조각이 6개가 아닙니다.");
      check(countClass(markup, "source61-e2-spiral-angle-arc") >= 1, "점 ㄱ에 45도 각 표시가 없습니다.");
    }
    check(countClass(prompt, "source61-e2-spiral-net-face") === 0 && countClass(prompt, "source61-e2-spiral-net-route") === 0, "문제에 펼친 답 그림이 미리 노출되었습니다.");
    check(countClass(answer, "source61-e2-spiral-net-face") === crossedFaces, "답 그림에 펼친 옆면 6장이 없습니다.");
    check(countClass(answer, "source61-e2-spiral-net-route") === 1 && countClass(answer, "source61-e2-spiral-triangle") === 1, "답 그림에 45도 선과 직각삼각형이 없습니다.");
    check(answer.includes(`data-result-highlight="${height}"`), "답에서 각기둥 높이가 강조되지 않았습니다.");
    return;
  }

  if (variant === 5) {
    const [slant, altitude, prismLength, baseArea, triangleBase, basePerimeter, surfaceArea] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes("같은 삼각기둥 세 개") && prompt.includes("사다리꼴") && prompt.includes("사각기둥"), "원문의 세 삼각기둥 결합과 사각기둥 물음이 없습니다.");
    check(!new RegExp(`(^|\\D)${surfaceArea}(?=\\D|$)`).test(promptText), "문제에 겉넓이 답이 노출되었습니다.");
    check(!new RegExp(`(^|\\D)${basePerimeter}(?=\\D|$)`).test(promptText), "문제에 사다리꼴 둘레 답이 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes('data-triangle-count="3"') && markup.includes('data-shared-face-count="2"') && markup.includes('data-base-sides="4"'), "삼각기둥 3개·붙인 면 2개·사각형 밑면 자료가 다릅니다.");
      check(markup.includes(`data-slant="${slant}"`) && markup.includes(`data-altitude="${altitude}"`) && markup.includes(`data-prism-length="${prismLength}"`), "그림의 길이 자료가 고정 pool과 다릅니다.");
      check(markup.includes(`data-base-area="${baseArea}"`) && markup.includes(`data-triangle-base="${triangleBase}"`) && markup.includes(`data-base-perimeter="${basePerimeter}"`) && markup.includes(`data-surface-area="${surfaceArea}"`), "밑면·둘레·겉넓이 자료가 독립 계산과 다릅니다.");
      check(countClass(markup, "source61-e2-combined-triangle") === 3, "합친 사다리꼴의 삼각형 조각이 3개가 아닙니다.");
      check(countClass(markup, "source61-e2-combined-join") === 5, "붙인 선의 앞·뒤·기둥 방향 표시가 5개가 아닙니다.");
      check(countClass(markup, "source61-e2-combined-right-angle") === 1, "8cm 높이의 직각 표시가 없습니다.");
      check(allAttrs(markup, "data-prism-dimension").length === 1 && markup.includes(`data-prism-dimension="${prismLength}"`), "기둥 높이가 두 밑면을 잇는 방향의 치수선으로 표시되지 않았습니다.");
      check(countClass(markup, "source61-e2-combined-prism-dimension-label") === 1 && markup.includes(`기둥 높이 ${prismLength}cm`), "기둥 높이 이름과 값이 그림에 분명히 표시되지 않았습니다.");
    }
    check(countClass(prompt, "source61-e2-combined-exterior") === 0, "문제에 답인 바깥 둘레 강조가 노출되었습니다.");
    check(countClass(answer, "source61-e2-combined-exterior") === 1 && answer.includes(`data-exterior-perimeter="${basePerimeter}"`), "답 그림에 사다리꼴 바깥 둘레가 강조되지 않았습니다.");
    check(answer.includes(`data-result-highlight="${surfaceArea}"`), "답에서 겉넓이가 강조되지 않았습니다.");
    return;
  }

  if (variant === 6) {
    const [side, prismHeight, faceCount, crossingCount, targetLength] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes("삼각기둥") && prompt.includes("꼭짓점 ㄱ") && prompt.includes("점 ㅅ") && prompt.includes("점 ㅇ") && prompt.includes("꼭짓점 ㄹ") && prompt.includes("선분 ㅇㅂ"), "원문의 삼각기둥·지나는 점·구할 선분 조건이 없습니다.");
    check(!new RegExp(`(^|\\D)${targetLength}(?=\\D|$)`).test(promptText), "문제에 선분 ㅇㅂ의 답이 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes(`data-triangle-side="${side}"`) && markup.includes(`data-prism-height="${prismHeight}"`), "밑면 한 변과 기둥 높이 semantic data가 고정 pool과 다릅니다.");
      check(markup.includes(`data-lateral-face-count="${faceCount}"`) && markup.includes('data-route-segment-count="3"') && markup.includes(`data-crossing-count="${crossingCount}"`), "옆면·이동 선분·경계점 수가 다릅니다.");
      check(markup.includes('data-target-name="ㅇㅂ"'), "구할 선분 이름이 ㅇㅂ으로 고정되지 않았습니다.");
      check(countClass(markup, "source61-e2-tri-shortest-solid-route") === 3, "입체 그림의 경로가 세 선분이 아닙니다.");
      check(countClass(markup, "source61-e2-tri-shortest-solid-route is-behind") === 1, "뒤쪽으로 숨는 셋째 경로가 점선 한 개가 아닙니다.");
      check(countClass(markup, "source61-e2-tri-shortest-point") >= 8, "삼각기둥의 꼭짓점과 경계점 표시가 부족합니다.");
      check(allAttrs(markup, "data-prism-height-dimension").length === 1 && markup.includes(`data-prism-height-dimension="${prismHeight}"`), "기둥 높이 치수선이 정확히 한 개가 아닙니다.");
    }
    check(countClass(prompt, "source61-e2-tri-shortest-net-face") === 0 && countClass(prompt, "source61-e2-tri-shortest-net-route") === 0, "문제에 펼친 답 그림이 노출되었습니다.");
    check(countClass(answer, "source61-e2-tri-shortest-net-face") === 3 && countClass(answer, "source61-e2-tri-shortest-net-route") === 1 && countClass(answer, "source61-e2-tri-shortest-net-target") === 1, "답 그림에 옆면 세 장·곧은 선·선분 ㅇㅂ이 없습니다.");
    check(answer.includes(`data-target-length="${targetLength}"`) && answer.includes(`data-result-highlight="${targetLength}"`), "답에서 선분 ㅇㅂ의 길이가 강조되지 않았습니다.");
    return;
  }

  if (variant === 7) {
    const [baseSides, pieceCount, minimumBaseSides, maximumEdgesPerPiece, minimumEdgesPerPiece, maximumTotal, minimumTotal, prismHeight] = values;
    const promptText = visibleText(prompt);
    check(prompt.includes("밑면의 모양이 정육각형") && prompt.includes("합동인 각기둥 6개") && prompt.includes("가장 클 때와 가장 작을 때"), "원문의 정육각기둥 절단과 최대·최소 물음이 없습니다.");
    check(!/(?:108|54)/.test(promptText), "문제에 최대 또는 최소 답이 노출되었습니다.");
    for (const markup of [prompt, answer]) {
      check(markup.includes('data-base-sides="6"') && markup.includes('data-piece-count="6"') && markup.includes('data-minimum-base-sides="3"'), "정육각형·여섯 조각·삼각형 최소 밑면 자료가 다릅니다.");
      check(markup.includes(`data-maximum-edges-per-piece="${maximumEdgesPerPiece}"`) && markup.includes(`data-minimum-edges-per-piece="${minimumEdgesPerPiece}"`), "한 조각의 최대·최소 모서리 수 자료가 다릅니다.");
      check(markup.includes(`data-maximum-total="${maximumTotal}"`) && markup.includes(`data-minimum-total="${minimumTotal}"`), "여섯 조각의 최대·최소 모서리 합 자료가 다릅니다.");
      check(markup.includes('data-cut-rule="straight-planes-congruent-prisms"'), "평면으로 곧게 잘라 합동인 각기둥을 만드는 범위가 고정되지 않았습니다.");
      check(countClass(markup, "source61-e2-six-piece-prism") >= 1, "정육각기둥 입체 그림이 없습니다.");
      check(countClass(markup, "source61-e2-six-piece-edge is-behind") >= 3, "뒤쪽 모서리의 점선 표시가 부족합니다.");
    }
    check(countClass(prompt, "source61-e2-six-piece-layer-cut") === 0 && countClass(prompt, "source61-e2-six-piece-radial-cut") === 0, "문제에 최대·최소를 만드는 절단선이 미리 노출되었습니다.");
    check(countClass(answer, "source61-e2-six-piece-layer-cut") === 30, "답 그림에 여섯 층을 만드는 다섯 육각형 절단선이 없습니다.");
    check(countClass(answer, "source61-e2-six-piece-radial-cut") === 13, "답 그림에 삼각기둥 여섯 조각을 만드는 중심 절단선이 없습니다.");
    check(answer.includes('data-layer-cut-count="5"') && answer.includes('data-radial-piece-count="6"'), "답 그림의 두 절단 방법 요약이 없습니다.");
    check(answer.includes(`data-result-highlight="${maximumTotal},${minimumTotal}"`), "답에서 최대 108과 최소 54가 순서대로 강조되지 않았습니다.");
    check(baseSides === 6 && pieceCount === 6 && minimumBaseSides === 3 && [96, 108, 120].includes(prismHeight), "고정 문항 자료가 원본 범위를 벗어났습니다.");
    return;
  }

  const [side, prismHeight, faceCount, crossingCount, targetLength] = values;
  const promptText = visibleText(prompt);
  check(prompt.includes("사각기둥") && prompt.includes("꼭짓점 ㄱ") && prompt.includes("점 ㅈ") && prompt.includes("점 ㅊ") && prompt.includes("점 ㅋ") && prompt.includes("꼭짓점 ㅁ") && prompt.includes("선분 ㄴㅈ"), "원문의 사각기둥·지나는 점·구할 선분 조건이 없습니다.");
  check(!new RegExp(`(^|\\D)${targetLength}(?=\\D|$)`).test(promptText), "문제에 선분 ㄴㅈ의 답이 노출되었습니다.");
  for (const markup of [prompt, answer]) {
    check(markup.includes(`data-base-side="${side}"`) && markup.includes(`data-prism-height="${prismHeight}"`), "밑면 한 변과 기둥 높이 자료가 고정 pool과 다릅니다.");
    check(markup.includes(`data-lateral-face-count="${faceCount}"`) && markup.includes('data-route-segment-count="4"') && markup.includes(`data-crossing-count="${crossingCount}"`), "옆면·이동 선분·경계점 수가 다릅니다.");
    check(markup.includes('data-crossing-ratios="0.25,0.5,0.75"') && markup.includes('data-target-name="ㄴㅈ"'), "경계점의 높이 비 또는 구할 선분 이름이 다릅니다.");
    check(countClass(markup, "source61-e2-square-shortest-route") === 4, "입체 그림의 경로가 네 선분이 아닙니다.");
    check(countClass(markup, "source61-e2-square-shortest-route is-behind") === 2, "뒤쪽으로 숨는 경로가 점선 두 개가 아닙니다.");
    check(countClass(markup, "source61-e2-square-shortest-point") === 11, "사각기둥의 꼭짓점 8개와 경계점 3개가 모두 표시되지 않았습니다.");
    check(allAttrs(markup, "data-prism-height-dimension").length === 1 && markup.includes(`data-prism-height-dimension="${prismHeight}"`), "기둥 높이 치수선이 정확히 한 개가 아닙니다.");
  }
  check(countClass(prompt, "source61-e2-square-shortest-net-face") === 0 && countClass(prompt, "source61-e2-square-shortest-net-route") === 0 && countClass(prompt, "source61-e2-square-shortest-target") === 0, "문제에 전개도 또는 선분 ㄴㅈ의 답 강조가 노출되었습니다.");
  check(countClass(answer, "source61-e2-square-shortest-net-face") === 4 && countClass(answer, "source61-e2-square-shortest-net-route") === 1 && countClass(answer, "source61-e2-square-shortest-net-target") === 1, "답 그림에 옆면 네 장·곧은 선·선분 ㄴㅈ이 없습니다.");
  check(answer.includes(`data-target-length="${targetLength}"`) && answer.includes(`data-result-highlight="${targetLength}"`), "답에서 선분 ㄴㅈ의 길이가 강조되지 않았습니다.");
  check(faceCount === 4 && crossingCount === 3 && targetLength === prismHeight / 4, "고정 문항의 최단 경로 계산이 원본 구조와 다릅니다.");
}

check(Boolean(api && api.names && api.names.includes(generatorKey)), "E2 전용 생성기가 등록되지 않았습니다.");

const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-1-source-items.json"), "utf8"));
const ledgerItems = new Map(sourceLedger.items.map(item => [item.sourceItemId, item]));
const ledgerContracts = [
  { id: "6-1-u2-e2-example-2", page: 9, words: ["예제 2-2", "직육면체", "모든 꼭짓점", "면·꼭짓점·모서리"] },
  { id: "6-1-u2-e2-mission-2", page: 10, words: ["Mission 2", "정칠각기둥", "수직", "삼각기둥 7개"] },
  { id: "6-1-u2-e2-mission-5", page: 10, words: ["Mission 5", "오각기둥", "삼등분", "모든 꼭짓점"] },
  { id: "6-1-u2-e2-mission-6", page: 10, words: ["Mission 6", "정오각형", "7cm", "11cm", "삼각형"] },
  { id: "6-1-u2-e2-mission-1", page: 10, words: ["Mission 1", "오각기둥", "10cm", "45°"] },
  { id: "6-1-u2-e2-example-4", page: 9, words: ["예제 2-4", "삼각기둥", "3개", "144cm²", "겉넓이"] },
  { id: "6-1-u2-e2-example-3", page: 9, words: ["예제 2-3", "삼각기둥", "점 ㅅ", "점 ㅇ", "선분 ㅇㅂ"] },
  { id: "6-1-u2-e2-example-1", page: 9, words: ["예제 2-1", "정육각형", "잘라", "합동인 각기둥 6개", "최대", "최소"] },
  { id: "6-1-u2-e2-mission-4", page: 10, words: ["Mission 4", "사각기둥", "점 ㅈ", "점 ㅊ", "점 ㅋ", "선분 ㄴㅈ"] }
];
for (const expected of ledgerContracts) {
  context = `${expected.id} / 원본 장부`;
  const item = ledgerItems.get(expected.id);
  check(Boolean(item), "원본 장부 항목이 없습니다.");
  if (!item) continue;
  check(item.pdfPage === expected.page, `원본 PDF 쪽이 ${expected.page}쪽이 아닙니다.`);
  const expectedContract = expected.id === "6-1-u2-e2-example-1" ? "ordered-two-values-fixed-pool" : "single-answer-fixed-pool";
  check(item.answerContract === expectedContract && item.sourceVerified === true && item.implementationStatus === "fixed-verified-pool", "원본 장부의 검증·고정 문항 상태가 다릅니다.");
  for (const word of expected.words) check(String(item.sourceShape).includes(word), `원본 구조 설명에 '${word}'가 없습니다.`);
}

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const pools = new Set();
  const poolValues = new Map();
  const poolAnswers = new Map();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 1200; seed += 1) {
      context = `${sourceIds[variant]} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const type = { generatorKey, variant, sourceItemId: sourceIds[variant] };
        const generated = api.generate(type, 0, difficulty, seed, variant);
        const poolIndex = generated.verifiedPoolIndex;
        const expected = expectedPools[variant][poolIndex] || { values: [], answer: NaN };
        const evidence = checkCommon(generated, sourceIds[variant], difficulty, expected);
        checkVariant(variant, generated, evidence);
        const valueSignature = evidence.values.join(",");
        if (poolValues.has(poolIndex)) check(poolValues.get(poolIndex) === valueSignature, "같은 pool에서 난이도별 값이 달라졌습니다.");
        else poolValues.set(poolIndex, valueSignature);
        const answer = variant === 7 ? answerSignature(generated.answer) : numberAnswer(generated.answer);
        if (poolAnswers.has(poolIndex)) check(poolAnswers.get(poolIndex) === answer, "같은 pool에서 정답이 달라졌습니다.");
        else poolAnswers.set(poolIndex, answer);
        pools.add(poolIndex);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  context = sourceIds[variant];
  check(pools.size === 3, "고정 pool 0, 1, 2를 모두 확인하지 못했습니다.");
  check(poolValues.size === 3 && poolAnswers.size === 3, "세 고정 pool의 값과 정답이 모두 기록되지 않았습니다.");
  check(Array.from(poolAnswers.values()).includes(sourceAnswers.get(sourceIds[variant])), `원문 답 ${sourceAnswers.get(sourceIds[variant])}이 고정 문항 묶음에 없습니다.`);
}

if (failures.length) {
  console.error(`6-1 2단원 개념탐구 2 각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 2단원 개념탐구 2 각기둥과 각뿔 감사 통과: 9유형 · 27개 고정 문항 · ${checked.toLocaleString()}회 독립 계산·pool·단일 정답·답 그림·원문 ID·난이도·도형 semantic 검사`);
