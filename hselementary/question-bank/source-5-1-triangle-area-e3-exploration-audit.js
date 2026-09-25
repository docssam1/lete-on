"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const expected = [
  { id: "5-1-u6-e3-exploration-3", variant: 2, generator: "source51TriangleAreaInteriorE3", foot: "inside", designs: ["formula-cue", "source", "split-height"] },
  { id: "5-1-u6-e3-exploration-4", variant: 3, generator: "source51TriangleAreaExteriorE3", foot: "outside", designs: ["extension-cue", "source", "split-exterior-height"] }
];
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const answerNumber = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const parsePoints = value => String(value).split(";").map(point => point.split(",").map(Number));
const parseSvgPoints = value => String(value).trim().split(/\s+/).map(point => point.split(",").map(Number));
const near = (left, right, tolerance = 1e-6) => Math.abs(left - right) <= tolerance;
const parseRenderedGeometry = (body, definition, height) => {
  const polygon = parseSvgPoints(body.match(/<polygon class="source51-triangle-area-shape" points="([^"]+)"/)?.[1]);
  const lines = [...body.matchAll(/<line class="source51-triangle-area-altitude[^"]*" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"\/>/g)]
    .map(match => match.slice(1).map(Number));
  const [renderApex, renderBaseLeft, renderBaseRight] = definition.foot === "inside"
    ? [polygon[2], polygon[0], polygon[1]]
    : [polygon[0], polygon[1], polygon[2]];
  const firstLine = lines[0] || [];
  const lastLine = lines.at(-1) || [];
  const renderFoot = [lastLine[2], lastLine[3]];
  const segmentValues = lines.map((line, index) => {
    const totalPixels = Math.abs(lastLine[3] - firstLine[1]);
    return Math.round(Math.abs(line[3] - line[1]) / totalPixels * height * 1e6) / 1e6;
  });
  const splitPointMatch = body.match(/<circle class="source51-triangle-area-split-point" cx="([^"]+)" cy="([^"]+)"/);
  const splitPoint = splitPointMatch ? splitPointMatch.slice(1).map(Number) : null;
  const measureLabels = [...body.matchAll(/<text class="source51-triangle-area-measure" x="([^"]+)" y="([^"]+)">\s*(-?\d+(?:\.\d+)?)\s*cm<\/text>/g)]
    .map(match => ({ x: Number(match[1]), y: Number(match[2]), value: Number(match[3]) }));
  return {
    polygon,
    lines,
    renderApex,
    renderBaseLeft,
    renderBaseRight,
    renderFoot,
    segmentValues,
    splitPoint,
    measureLabels,
    body
  };
};

const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const allTypes = unit?.subunits.flatMap(item => item.types) || [];

for (const definition of expected) {
  const type = allTypes.find(item => item.sourceItemId === definition.id);
  check(Boolean(type), `${definition.id}: 유형이 없습니다.`);
  if (!type) continue;
  check(type.variant === definition.variant && type.generatorKey === definition.generator, `${definition.id}: 원본 분기 또는 전용 생성기 연결이 다릅니다.`);
  check(!type.reviewLocked && type.sourceVerified && type.sourceTier === "advanced", `${definition.id}: 심화 원본 공개 상태가 아닙니다.`);
  check(type.generationMode === "fixed-verified-pool" && type.verifiedVariantCount === 3, `${definition.id}: 검증된 3문항 고정 묶음이 아닙니다.`);
  check(type.answerVisualRequired && type.answerVisualStatus === "verified", `${definition.id}: 정답 그림 계약이 없습니다.`);

  const poolIndexes = new Set();
  const designs = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 300; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        const problemSvg = generated?.prompt.match(/<svg class="geometry-diagram source51-triangle-area-e3 [^"]+"([^>]*)>([\s\S]*?)<\/svg>/);
        const solvedSvg = generated?.answerVisual.match(/<svg class="geometry-diagram source51-triangle-area-e3 [^"]+ is-solved"([^>]*)>([\s\S]*?)<\/svg>/);
        const open = problemSvg?.[1] || "";
        const solvedOpen = solvedSvg?.[1] || "";
        check(Boolean(open && solvedOpen), `${definition.id}/${difficulty}/${seed}: 문제 또는 정답 그림이 없습니다.`);
        if (!open || !solvedOpen) continue;
        const base = Number(attr(open, "data-base"));
        const height = Number(attr(open, "data-height"));
        const points = parsePoints(attr(open, "data-model-points"));
        const [left, right, apex, foot] = points;
        const crossArea = Math.abs((right[0] - left[0]) * (apex[1] - left[1]) - (right[1] - left[1]) * (apex[0] - left[0])) / 2;
        const formulaArea = base * height / 2;
        const footState = foot[0] > left[0] && foot[0] < right[0] ? "inside" : "outside";
        const design = attr(open, "data-difficulty-design");
        const rendered = parseRenderedGeometry(problemSvg?.[2] || "", definition, height);
        const renderedSolved = parseRenderedGeometry(solvedSvg?.[2] || "", definition, height);
        const modelFootRatio = (foot[0] - left[0]) / (right[0] - left[0]);

        check(points.length === 4 && points.every(point => point.length === 2 && point.every(Number.isFinite)), `${definition.id}/${difficulty}/${seed}: 점 모델이 깨졌습니다.`);
        check(right[0] - left[0] === base && apex[1] === height && foot[1] === left[1] && apex[0] === foot[0], `${definition.id}/${difficulty}/${seed}: 밑변·높이 점 모델이 수치와 다릅니다.`);
        check(footState === definition.foot && attr(open, "data-altitude-foot-state") === definition.foot, `${definition.id}/${difficulty}/${seed}: 높이의 발 위치가 원본과 다릅니다.`);
        for (const [renderMode, render] of [["문제", rendered], ["풀이", renderedSolved]]) {
          const renderFootRatio = (render.renderFoot[0] - render.renderBaseLeft[0]) / (render.renderBaseRight[0] - render.renderBaseLeft[0]);
          const renderFootState = render.renderFoot[0] > render.renderBaseLeft[0] && render.renderFoot[0] < render.renderBaseRight[0] ? "inside" : "outside";
          check(render.polygon.length === 3 && render.polygon.every(point => point.length === 2 && point.every(Number.isFinite)), `${definition.id}/${difficulty}/${seed}/${renderMode}: 실제 SVG 꼭짓점이 깨졌습니다.`);
          check(render.lines.length === (difficulty === 1 ? 2 : 1), `${definition.id}/${difficulty}/${seed}/${renderMode}: 실제 높이 선분 수가 난이도 조건과 다릅니다.`);
          check(render.lines.every((line, index) => line.every(Number.isFinite) && near(line[0], line[2]) && (index === 0 || (near(render.lines[index - 1][2], line[0]) && near(render.lines[index - 1][3], line[1])))), `${definition.id}/${difficulty}/${seed}/${renderMode}: 실제 높이 선분이 수직으로 이어지지 않습니다.`);
          check(near(render.renderApex[0], render.renderFoot[0]) && near(render.renderBaseLeft[1], render.renderBaseRight[1]) && near(render.renderFoot[1], render.renderBaseLeft[1]), `${definition.id}/${difficulty}/${seed}/${renderMode}: SVG 꼭짓점·밑변·높이의 발이 연결되지 않습니다.`);
          check(near(renderFootRatio, modelFootRatio) && renderFootState === definition.foot, `${definition.id}/${difficulty}/${seed}/${renderMode}: SVG가 점 모델의 높이 발 위치와 다릅니다.`);
          if (difficulty === 1) {
            const junction = [render.lines[0][2], render.lines[0][3]];
            const labelIndexes = render.lines.map((line, index) => {
              const midpointY = (line[1] + line[3]) / 2;
              const expectedX = line[0] + (definition.foot === "inside" ? 39 : -39);
              return render.measureLabels.findIndex(label => near(label.x, expectedX) && near(label.y, midpointY) && near(label.value, render.segmentValues[index]));
            });
            const actualLabelValues = labelIndexes.filter(index => index >= 0).map(index => render.measureLabels[index].value);
            check(render.splitPoint && near(render.splitPoint[0], junction[0]) && near(render.splitPoint[1], junction[1]), `${definition.id}/${difficulty}/${seed}/${renderMode}: 분할점이 두 높이 선분의 접점과 다릅니다.`);
            check(render.segmentValues.length === 2 && near(render.segmentValues[0] + render.segmentValues[1], height), `${definition.id}/${difficulty}/${seed}/${renderMode}: 높이 두 선분의 길이 합이 다릅니다.`);
            check(labelIndexes.every(index => index >= 0) && new Set(labelIndexes).size === render.lines.length && near(actualLabelValues.reduce((sum, value) => sum + value, 0), height), `${definition.id}/${difficulty}/${seed}/${renderMode}: 높이 두 선분의 실제 길이표시 위치·값·합 또는 일대일 대응이 다릅니다.`);
          } else {
            const midpointY = (render.lines[0][1] + render.lines[0][3]) / 2;
            const expectedX = render.lines[0][0] + (definition.foot === "inside" ? 41 : -41);
            const hasHeightLabel = render.measureLabels.some(label => near(label.x, expectedX) && near(label.y, midpointY) && near(label.value, height));
            check(!render.splitPoint && hasHeightLabel, `${definition.id}/${difficulty}/${seed}/${renderMode}: 원본 높이 한 줄 표시가 다릅니다.`);
          }
        }
        check(crossArea === formulaArea && answerNumber(generated.answer) === formulaArea, `${definition.id}/${difficulty}/${seed}: 외적·공식·표시 답이 일치하지 않습니다.`);
        check(Number(attr(open, "data-answer-candidate-count")) === 1, `${definition.id}/${difficulty}/${seed}: 정답 후보가 하나가 아닙니다.`);
        check(design === definition.designs[difficulty + 1], `${definition.id}/${difficulty}/${seed}: 난이도별 조건 설계가 다릅니다.`);
        check(generated.answerVisual.includes(`넓이 = ${formulaArea}cm²`) && attr(solvedOpen, "data-result-highlight") === `${formulaArea}cm²`, `${definition.id}/${difficulty}/${seed}: 풀이 그림의 정답 표시가 다릅니다.`);
        check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3 && generated.sourceItemId === definition.id, `${definition.id}/${difficulty}/${seed}: 생성 결과의 원본·고정 묶음 계약이 다릅니다.`);
        poolIndexes.add(generated.verifiedPoolIndex);
        designs.add(design);
        checked += 1;
      } catch (error) {
        failures.push(`${definition.id}/${difficulty}/${seed}: ${error.message}`);
      }
    }
  }
  check(poolIndexes.size === 3 && [0, 1, 2].every(index => poolIndexes.has(index)), `${definition.id}: 고정 묶음 3개가 모두 생성되지 않았습니다.`);
  check(designs.size === 3, `${definition.id}: 쉬움·원본·어려움의 추론 부담이 구분되지 않았습니다.`);
}

if (failures.length) {
  console.error(`5-1 6단원 개념탐구 3 삼각형 넓이 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 개념탐구 3 삼각형 넓이 감사 통과: 2유형 · ${checked.toLocaleString()}회 외적·공식 독립 계산 · 높이 발 안/밖 · 단일 정답 · 난이도 3단계`);
