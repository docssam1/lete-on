"use strict";

// Independent regression check for 5-1 unit 6 perimeter and area generators.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  { id: "5-1-u6-t1", name: "다각형의 둘레" },
  { id: "5-1-u6-t2", name: "직사각형과 직각삼각형의 넓이" },
  { id: "5-1-u6-t3", name: "둘레와 넓이" },
  { id: "5-1-u6-t4", name: "여러 가지 사각형의 넓이" }
];
const expectedGenerators = [
  "advancedPolygonPerimeter",
  "rectangleRightTriangleAreaAdvanced",
  "perimeterAreaSquareCompositionAdvanced",
  "quadrilateralAreaAdvanced"
];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const parseValues = tag => (attribute(tag, "data-measure-values") || "").split(",").filter(Boolean).map(Number);
const parseCells = (tag, name) => (attribute(tag, name) || "").split(";").filter(Boolean).map(value => value.split(":").map(Number));

const boundary = cells => {
  const cellSet = new Set(cells.map(([x, y]) => `${x},${y}`));
  return cells.reduce((total, [x, y]) => total + [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => !cellSet.has(`${x + dx},${y + dy}`)).length, 0);
};

const sequencePerimeter = order => 2 * order.reduce((sum, value) => sum + value, 0) + order[0] + order[order.length - 1] + order.slice(1).reduce((sum, value, index) => sum + Math.abs(value - order[index]), 0);
const maximumSequencePerimeter = count => {
  const values = Array.from({ length: count }, (_, index) => index + 1);
  let maximum = 0;
  const visit = (chosen, remaining) => {
    if (!remaining.length) {
      maximum = Math.max(maximum, sequencePerimeter(chosen));
      return;
    }
    remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return maximum;
};

const recompute = (kind, values, tag) => {
  if (kind === "rectilinear-perimeter") {
    const [width, height, topDepth, bottomDepth] = values;
    return 2 * (width + height) + 2 * (topDepth + bottomDepth);
  }
  if (kind === "cut-strip-perimeter") {
    const [width, height, ...pieces] = values;
    check(width === pieces.reduce((sum, value) => sum + value, 0), `${kind}: 조각의 가로 합이 원래 가로와 다릅니다.`);
    return width - height;
  }
  if (kind === "square-sequence-max") return maximumSequencePerimeter(values[0]);
  if (kind === "partition-area") {
    const [x1, , , y2] = values;
    return x1 * y2;
  }
  if (kind === "scaled-area") {
    const [area, numerator, denominator] = values;
    return area * numerator * numerator / (denominator * denominator);
  }
  if (kind === "cutout-area") {
    const [width, height, firstWidth, firstHeight, secondWidth, secondHeight] = values;
    return width * height - firstWidth * firstHeight - secondWidth * secondHeight;
  }
  if (kind === "poly-area-to-perimeter" || kind === "poly-perimeter-to-area") {
    const [side, count] = values;
    const cells = parseCells(tag, "data-measure-cells");
    check(cells.length === count, `${kind}: 표시된 정사각형 수가 내부 값과 다릅니다.`);
    return kind === "poly-area-to-perimeter" ? boundary(cells) * side : count * side * side;
  }
  if (kind === "poly-pair") {
    const [side, countA, countB] = values;
    const cellsA = parseCells(tag, "data-measure-cells-a");
    const cellsB = parseCells(tag, "data-measure-cells-b");
    check(cellsA.length === countA && cellsB.length === countB, `${kind}: 두 도형의 정사각형 수가 내부 값과 다릅니다.`);
    return boundary(cellsB) * side;
  }
  if (kind === "equal-quadrilaterals") {
    const [base, height, trapezoidTop, trapezoidBottom] = values;
    const parallelogramArea = base * height;
    const trapezoidArea = (trapezoidTop + trapezoidBottom) * height / 2;
    check(parallelogramArea === trapezoidArea, `${kind}: 평행사변형과 사다리꼴의 넓이가 다릅니다.`);
    check(parallelogramArea === (2 * height) * base / 2, `${kind}: 마름모의 넓이가 다릅니다.`);
    return base;
  }
  if (kind === "maximum-rectangle") {
    const [halfPerimeter] = values;
    return Math.floor(halfPerimeter / 2) * Math.ceil(halfPerimeter / 2);
  }
  if (kind === "moving-point-area") {
    const [base, , numerator, denominator, speed] = values;
    return 2 * base * numerator / denominator / speed;
  }
  return NaN;
};

let generatedCount = 0;
for (let typeIndex = 0; typeIndex < types.length; typeIndex += 1) {
  const type = types[typeIndex];
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      for (let variant = 0; variant < 3; variant += 1) {
        const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed} / 변형 ${variant}`;
        let generated;
        try {
          generated = api.generate({ ...type, semesterId: "5-1", unitId: "5-1-u6" }, 0, difficulty, seed, variant);
        } catch (error) {
          failures.push(`${context}: ${error.message}`);
          continue;
        }
        generatedCount += 1;
        check(generated?.generator === expectedGenerators[typeIndex], `${context}: 전용 생성기가 아닙니다.`);
        check(generated?.answer && generated.solution, `${context}: 정답 또는 풀이가 비어 있습니다.`);
        check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 계산값이 깨졌습니다.`);
        const tag = generated.prompt.match(/<svg\b[^>]*data-measure-kind="[^"]+"[^>]*>/)?.[0];
        if (!tag) {
          failures.push(`${context}: 검산용 도형 데이터가 없습니다.`);
          continue;
        }
        const kind = attribute(tag, "data-measure-kind");
        const values = parseValues(tag);
        const declaredExpected = Number(attribute(tag, "data-measure-expected"));
        const recomputed = recompute(kind, values, tag);
        const actual = Number(generated.answer);
        check(Number.isFinite(recomputed), `${context}: ${kind}를 독립 계산하지 못했습니다.`);
        check(recomputed === declaredExpected, `${context}: 도형 데이터의 정답 ${declaredExpected}과 독립 계산 ${recomputed}이 다릅니다.`);
        check(recomputed === actual, `${context}: 표시 정답 ${actual}과 독립 계산 ${recomputed}이 다릅니다.`);
        check(/<svg\b[^>]*viewBox="[^"]+"/.test(generated.prompt), `${context}: 반응형 SVG viewBox가 없습니다.`);
      }
    }
  }
}

if (failures.length) {
  console.error(`둘레와 넓이 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`둘레와 넓이 감사 통과: 4유형, ${generatedCount.toLocaleString()}개 생성`);
