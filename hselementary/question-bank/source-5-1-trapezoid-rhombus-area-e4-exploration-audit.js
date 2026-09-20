"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const expected = [
  {
    id: "5-1-u6-e4-exploration-trapezoid",
    variant: 0,
    generator: "source51TrapezoidAreaE4",
    kind: "trapezoid",
    source: { top: 16, bottom: 20, height: 12, answer: 216 },
    designs: ["formula-cue", "source", "split-into-rectangle-and-triangle"]
  },
  {
    id: "5-1-u6-e4-exploration-rhombus",
    variant: 1,
    generator: "source51RhombusAreaE4",
    kind: "rhombus",
    source: { horizontal: 18, vertical: 12, answer: 108 },
    designs: ["formula-cue", "source", "four-right-triangles"]
  }
];
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const near = (left, right, tolerance = 1e-6) => Math.abs(left - right) <= tolerance;
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const number = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const points = value => String(value).trim().split(/\s+/).map(point => point.split(",").map(Number));
const modelPoints = value => String(value).split(";").map(point => point.split(",").map(Number));
const length = (left, right) => Math.hypot(right[0] - left[0], right[1] - left[1]);
const dot = (left, right) => left[0] * right[0] + left[1] * right[1];
const parseSvg = (markup, className) => {
  const match = markup.match(new RegExp(`<svg class="geometry-diagram source51-e4-area source51-e4-${className}[^\"]*"([^>]*)>([\\s\\S]*?)<\\/svg>`));
  if (!match) return null;
  const body = match[2];
  const polygon = points(body.match(/<polygon class="source51-e4-shape" points="([^"]+)"\/>/)?.[1]);
  const labels = [...body.matchAll(/<text class="([^\"]+)" x="([^"]+)" y="([^"]+)">([^<]+)<\/text>/g)]
    .map(match => ({ className: match[1], x: Number(match[2]), y: Number(match[3]), text: match[4], value: number(match[4]) }));
  const line = className => {
    const match = body.match(new RegExp(`<line class="[^"]*${className}[^"]*" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"\/>`));
    return match ? match.slice(1).map(Number) : null;
  };
  const pathData = className => body.match(new RegExp(`<path class="[^"]*${className}[^"]*" d="([^"]+)"\/>`))?.[1] || null;
  return { open: match[1], body, polygon, labels, line, pathData };
};
const pointOnSegment = (point, start, end, tolerance = 1e-6) => {
  const cross = (point[0] - start[0]) * (end[1] - start[1]) - (point[1] - start[1]) * (end[0] - start[0]);
  const dotProduct = (point[0] - start[0]) * (point[0] - end[0]) + (point[1] - start[1]) * (point[1] - end[1]);
  return Math.abs(cross) <= tolerance && dotProduct <= tolerance;
};
const sameLine = (left, right) => Boolean(left && right) && left.length === right.length && left.every((value, index) => near(value, right[index]));
const sameLabels = (left, right) => left.length === right.length && left.every((label, index) => {
  const other = right[index];
  return other && label.className === other.className && label.text === other.text && near(label.x, other.x) && near(label.y, other.y);
});

const semester = curriculum.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u6");
const subunit = unit?.subunits.find(item => item.id === "5-1-u6-s4");
const sourceInventory = require("./source-inventory/5-1-u6-e3-e4-readiness-review.json");

for (const definition of expected) {
  const type = subunit?.types.find(item => item.sourceItemId === definition.id);
  const inventory = sourceInventory.items.find(item => item.sourceItemId === definition.id);
  check(Boolean(type), `${definition.id}: 화면 유형이 없습니다.`);
  check(inventory?.implementationStatus === "implemented-fixed-verified-pool" && inventory?.publicDecision === "ready", `${definition.id}: 원본 분류표 공개 상태가 다릅니다.`);
  if (!type) continue;
  check(type.variant === definition.variant && type.generatorKey === definition.generator, `${definition.id}: 전용 생성기 연결이 다릅니다.`);
  check(!type.reviewLocked && type.generationMode === "fixed-verified-pool" && type.verifiedVariantCount === 3, `${definition.id}: 고정 검증 묶음 공개 계약이 다릅니다.`);
  check(type.answerVisualRequired && type.answerVisualStatus === "verified", `${definition.id}: 정답 그림 계약이 없습니다.`);
  const designs = new Set();
  const poolIndexes = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 300; seed += 1) {
      const context = `${definition.id}/${difficulty}/${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        const problem = parseSvg(generated.prompt, definition.kind);
        const solution = parseSvg(generated.answerVisual, definition.kind);
        check(Boolean(problem && solution), `${context}: 문제 또는 정답 SVG가 없습니다.`);
        if (!problem || !solution) continue;
        const open = problem.open;
        const design = attr(open, "data-difficulty-design");
        const pool = Number(attr(open, "data-verified-pool-index"));
        check(attr(open, "data-source-item") === definition.id && Number(attr(open, "data-answer-candidate-count")) === 1, `${context}: 원본 ID 또는 단일 답 계약이 다릅니다.`);
        check(attr(solution.open, "data-result-highlight") === generated.answer, `${context}: 정답 그림의 정답 표시가 다릅니다.`);
        check(design === definition.designs[difficulty + 1], `${context}: 난이도별 조건 부담이 다릅니다.`);
        if (difficulty === 0) check(generated.solution.includes("방법 1:") && generated.solution.includes("방법 2:"), `${context}: 원본 단계 풀이에 서로 다른 두 계산이 모두 없습니다.`);
        check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && generated.sourceItemId === definition.id, `${context}: 생성 결과의 고정 묶음 계약이 다릅니다.`);
        check(problem.polygon.length === 4 && solution.polygon.length === 4 && problem.polygon.every(point => point.every(Number.isFinite)), `${context}: 실제 SVG 도형 꼭짓점이 깨졌습니다.`);
        check(problem.polygon.every((point, index) => solution.polygon[index] && near(point[0], solution.polygon[index][0]) && near(point[1], solution.polygon[index][1])), `${context}: 문제와 정답 그림의 점 모델이 다릅니다.`);
        check(sameLabels(problem.labels, solution.labels), `${context}: 문제와 정답 그림의 치수 라벨 위치 또는 값이 다릅니다.`);
        check(problem.pathData("source51-e4-right-angle") === solution.pathData("source51-e4-right-angle"), `${context}: 문제와 정답 그림의 직각 표시가 다릅니다.`);
        if (definition.kind === "trapezoid") {
          const [topLeft, topRight, bottomRight, bottomLeft] = problem.polygon;
          const top = Number(attr(open, "data-top-base"));
          const bottom = Number(attr(open, "data-bottom-base"));
          const height = Number(attr(open, "data-height"));
          const heightLine = problem.line("source51-e4-height");
          const solvedHeightLine = solution.line("source51-e4-height");
          const splitLeft = problem.line("source51-e4-trapezoid-split-left");
          const splitRight = problem.line("source51-e4-trapezoid-split-right");
          const solvedSplitLeft = solution.line("source51-e4-trapezoid-split-left");
          const solvedSplitRight = solution.line("source51-e4-trapezoid-split-right");
          const topVector = [topRight[0] - topLeft[0], topRight[1] - topLeft[1]];
          const bottomVector = [bottomRight[0] - bottomLeft[0], bottomRight[1] - bottomLeft[1]];
          const scale = length(bottomLeft, bottomRight) / bottom;
          const formulaArea = (top + bottom) * height / 2;
          const splitArea = top * height + (bottom - top) * height / 2;
          const candidates = Array.from({ length: 60 }, (_, index) => index + 1).filter(candidate => (top + bottom) * candidate / 2 === formulaArea);
          check(near(dot(topVector, [bottomVector[1], -bottomVector[0]]), 0) && near(topVector[1], bottomVector[1]) && near(length(topLeft, topRight) / length(bottomLeft, bottomRight), top / bottom), `${context}: 실제 SVG의 두 밑변이 평행하거나 비율이 맞지 않습니다.`);
          check(Boolean(heightLine) && near(heightLine[0], heightLine[2]) && near(heightLine[0], topRight[0]) && near(heightLine[1], topRight[1]) && near(heightLine[3], bottomLeft[1]), `${context}: 실제 SVG의 오른쪽 수직 높이가 윗변 꼭짓점에 연결되지 않습니다.`);
          const sameOptionalLine = (left, right) => left || right ? sameLine(left, right) : true;
          check(sameLine(heightLine, solvedHeightLine) && sameOptionalLine(splitLeft, solvedSplitLeft) && sameOptionalLine(splitRight, solvedSplitRight), `${context}: 문제와 정답 그림의 높이선 또는 분할선이 다릅니다.`);
          check(near(Math.abs(heightLine[3] - heightLine[1]) / scale, height), `${context}: 실제 SVG 높이와 치수가 다릅니다.`);
          check(/<path class="source51-e4-right-angle" d="M [^"]+ H [^"]+ V [^"]+"\/>/.test(problem.body), `${context}: 높이의 발에 직각 표시가 없습니다.`);
          check(candidates.length === 1 && candidates[0] === height && formulaArea === splitArea && number(generated.answer) === formulaArea, `${context}: 사다리꼴의 두 독립 계산 또는 단일 답이 다릅니다.`);
          const topLabel = problem.labels.find(label => label.value === top && label.y < topLeft[1]);
          const bottomLabel = problem.labels.find(label => label.value === bottom && label.y > bottomLeft[1]);
          const heightLabel = problem.labels.find(label => label.value === height && near(label.x, heightLine[0] - 39) && near(label.y, (heightLine[1] + heightLine[3]) / 2));
          check(topLabel && bottomLabel && heightLabel && !pointOnSegment([topLabel.x, topLabel.y], topLeft, topRight) && !pointOnSegment([bottomLabel.x, bottomLabel.y], bottomLeft, bottomRight), `${context}: 사다리꼴 치수 라벨이 대상 변과 겹치거나 빠졌습니다.`);
          if (difficulty === 1) {
            check(Boolean(splitLeft && splitRight) && near(splitLeft[0], splitLeft[2]) && near(splitRight[0], splitRight[2]) && near(splitLeft[0], topLeft[0]) && near(splitRight[0], topRight[0]) && near(splitLeft[1], topLeft[1]) && near(splitRight[1], topRight[1]) && near(splitLeft[3], bottomLeft[1]) && near(splitRight[3], bottomRight[1]), `${context}: 어려움 단계의 가운데 직사각형·양쪽 삼각형 분할선이 실제 도형과 다릅니다.`);
          } else check(!splitLeft && !splitRight, `${context}: 원본 또는 쉬움 단계에 불필요한 분할선이 있습니다.`);
        } else {
          const [left, topPoint, right, bottom, center] = modelPoints(attr(open, "data-model-points"));
          const [renderLeft, renderTop, renderRight, renderBottom] = problem.polygon;
          const horizontal = Number(attr(open, "data-horizontal-diagonal"));
          const vertical = Number(attr(open, "data-vertical-diagonal"));
          const horizontalLine = problem.line("source51-e4-horizontal-diagonal");
          const verticalLine = problem.line("source51-e4-vertical-diagonal");
          const solvedHorizontalLine = solution.line("source51-e4-horizontal-diagonal");
          const solvedVerticalLine = solution.line("source51-e4-vertical-diagonal");
          const diagonalArea = horizontal * vertical / 2;
          const triangleArea = horizontal / 2 * vertical / 2 / 2 * 4;
          const candidates = Array.from({ length: 500 }, (_, index) => index + 1).filter(candidate => candidate === diagonalArea);
          check([left, topPoint, right, bottom].every((point, index) => near(point[0], problem.polygon[index][0]) && near(point[1], problem.polygon[index][1])), `${context}: 점 모델과 실제 SVG 마름모가 다릅니다.`);
          check(Boolean(horizontalLine && verticalLine) && near(horizontalLine[1], horizontalLine[3]) && near(verticalLine[0], verticalLine[2]), `${context}: 실제 SVG 대각선이 가로·세로로 그려지지 않았습니다.`);
          check(sameLine(horizontalLine, solvedHorizontalLine) && sameLine(verticalLine, solvedVerticalLine), `${context}: 문제와 정답 그림의 대각선 좌표가 다릅니다.`);
          const crossing = [horizontalLine[0] + (horizontalLine[2] - horizontalLine[0]) / 2, verticalLine[1] + (verticalLine[3] - verticalLine[1]) / 2];
          check(near(crossing[0], center[0]) && near(crossing[1], center[1]) && near(horizontalLine[0], renderLeft[0]) && near(horizontalLine[2], renderRight[0]) && near(verticalLine[1], renderTop[1]) && near(verticalLine[3], renderBottom[1]), `${context}: 실제 SVG 대각선의 교점 또는 끝점이 마름모와 다릅니다.`);
          check(near(dot([horizontalLine[2] - horizontalLine[0], horizontalLine[3] - horizontalLine[1]], [verticalLine[2] - verticalLine[0], verticalLine[3] - verticalLine[1]]), 0), `${context}: 실제 SVG 대각선이 수직이 아닙니다.`);
          check(/<path class="source51-e4-right-angle" d="M [^"]+ H [^"]+ V [^"]+"\/>/.test(problem.body), `${context}: 대각선 교점의 직각 표시가 없습니다.`);
          check(candidates.length === 1 && diagonalArea === triangleArea && number(generated.answer) === diagonalArea, `${context}: 마름모의 두 독립 계산 또는 단일 답이 다릅니다.`);
          const measures = problem.labels.filter(label => label.className.includes("source51-e4-measure"));
          if (difficulty === 1) {
            check(measures.length === 4 && measures.filter(label => label.value === horizontal / 2).length === 2 && measures.filter(label => label.value === vertical / 2).length === 2, `${context}: 어려움 단계의 대각선 반씩 표시가 다릅니다.`);
          } else {
            check(measures.some(label => label.value === horizontal && label.x < center[0]) && measures.some(label => label.value === vertical && label.x > center[0]), `${context}: 대각선 길이 라벨의 위치 또는 값이 다릅니다.`);
          }
        }
        poolIndexes.add(pool);
        designs.add(design);
        checked += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  check(poolIndexes.size === 3 && [0, 1, 2].every(index => poolIndexes.has(index)), `${definition.id}: 고정 묶음 3개가 모두 생성되지 않았습니다.`);
  check(designs.size === 3, `${definition.id}: 쉬움·원본·어려움의 조건 부담이 구분되지 않았습니다.`);
}

if (failures.length) {
  console.error(`5-1 6단원 개념탐구 4 사다리꼴·마름모 넓이 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 개념탐구 4 사다리꼴·마름모 넓이 감사 통과: 2유형 · ${checked.toLocaleString()}회 실제 SVG·두 계산·단일 답·라벨·난이도 검사`);
