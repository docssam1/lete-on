"use strict";

global.window = {};
require("./generators.js");
require("./source-grade6-decimal-e2-example4.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e2-example-4";
const generatorKey = "sourceGrade6DecimalDivisionE2Example4";
const expectedPools = [
  [5, 9, 8.7, 3, 1.95, 20, 13, 4.3, 9.245],
  [4.8, 8, 8.3, 4, 3.12, 15, 11.7, 3.4, 5.78],
  [6, 10, 9.3, 5, 3.75, 18, 13.5, 4.2, 8.82]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-6) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e2ex4-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point.x * next.y - next.x * point.y;
}, 0)) / 2;
const clip = (polygon, inside, intersect) => {
  const output = [];
  polygon.forEach((current, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentInside = inside(current), previousInside = inside(previous);
    if (currentInside) {
      if (!previousInside) output.push(intersect(previous, current));
      output.push(current);
    } else if (previousInside) output.push(intersect(previous, current));
  });
  return output;
};
const clipTriangleWithRectangle = (triangle, rectangle) => {
  let result = triangle;
  const vertical = (x, left, right) => ({ x, y: left.y + (right.y - left.y) * (x - left.x) / (right.x - left.x) });
  const horizontal = (y, left, right) => ({ x: left.x + (right.x - left.x) * (y - left.y) / (right.y - left.y), y });
  result = clip(result, point => point.x >= rectangle.left, (a, b) => vertical(rectangle.left, a, b));
  result = clip(result, point => point.x <= rectangle.right, (a, b) => vertical(rectangle.right, a, b));
  result = clip(result, point => point.y >= rectangle.bottom, (a, b) => horizontal(rectangle.bottom, a, b));
  result = clip(result, point => point.y <= rectangle.top, (a, b) => horizontal(rectangle.top, a, b));
  return result;
};

if (!api?.names?.includes(generatorKey)) fail("예제 2-4 전용 생성기가 등록되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seedIndex = 0; seedIndex < 600; seedIndex += 1) {
    const seed = 61032400 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const poolIndex = generated?.verifiedPoolIndex;
    const expected = expectedPools[poolIndex];
    if (!Number.isInteger(poolIndex) || !expected) fail(`${label}: 고정 문항 번호가 없습니다.`);
    else seenPools.add(poolIndex);
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
    const problemSvg = svgFrom(generated?.prompt);
    const answerSvg = svgFrom(generated?.answerVisual);
    const problemValues = attr(problemSvg, "data-source61-e2ex4-values").split(",").map(Number);
    const answerValues = attr(answerSvg, "data-source61-e2ex4-values").split(",").map(Number);
    if (JSON.stringify(problemValues) !== JSON.stringify(answerValues) || problemValues.length !== 9 || problemValues.some((value, index) => !close(value, expected?.[index]))) fail(`${label}: 문제·답 자료가 고정 문항과 다릅니다.`);
    if (expected) {
      const [rectangleWidth, triangleBase, gap, periodSeconds, distancePerPeriod, elapsedSeconds, movedDistance, overlapWidth, expectedArea] = expected;
      const movedByRate = distancePerPeriod / periodSeconds * elapsedSeconds;
      const analyticArea = overlapWidth * overlapWidth / 2;
      const triangle = [{ x: rectangleWidth + gap, y: 0 }, { x: rectangleWidth + gap + triangleBase, y: 0 }, { x: rectangleWidth + gap + triangleBase / 2, y: triangleBase / 2 }];
      const rectangle = { left: movedDistance, right: movedDistance + rectangleWidth, bottom: 0, top: triangleBase / 2 };
      const clipped = clipTriangleWithRectangle(triangle, rectangle);
      const clippedArea = polygonArea(clipped);
      if (!close(movedByRate, movedDistance) || !close(movedDistance - gap, overlapWidth) || !close(analyticArea, expectedArea) || !close(clippedArea, expectedArea)) fail(`${label}: 이동량·직각삼각형·다각형 교집합의 독립 계산이 일치하지 않습니다 (${movedByRate}/${analyticArea}/${clippedArea}).`);
      if (!(overlapWidth > 0 && overlapWidth < triangleBase / 2) || clipped.length !== 3) fail(`${label}: 겹친 부분이 하나의 직각이등변삼각형으로 정해지지 않습니다.`);
      if (poolIndex === 0 && (!close(movedDistance, 13) || !close(overlapWidth, 4.3) || !close(expectedArea, 9.245))) fail(`${label}: 원본 문항의 13cm·4.3cm·9.245cm²가 다릅니다.`);
      if (String(generated?.answer) !== `${expectedArea}cm²`) fail(`${label}: 표시 답 ${generated?.answer}이 독립 계산 ${expectedArea}cm²와 다릅니다.`);
    }
    const problemPoints = parsePoints(attr(problemSvg, "data-source61-e2ex4-points"));
    const answerPoints = parsePoints(attr(answerSvg, "data-source61-e2ex4-points"));
    if (JSON.stringify(problemPoints) !== JSON.stringify(answerPoints) || !problemPoints.IL || !problemPoints.IR || !problemPoints.TL || !problemPoints.TA || !problemPoints.TR || !problemPoints.FL || !problemPoints.FR || !problemPoints.OT) fail(`${label}: 문제·답의 점·선분 자료가 다릅니다.`);
    else {
      if (!close(problemPoints.TA.x, (problemPoints.TL.x + problemPoints.TR.x) / 2, 1e-4) || !close(problemPoints.TL.y, problemPoints.TR.y, 1e-4)) fail(`${label}: 직각이등변삼각형의 꼭짓점과 밑변 위치가 다릅니다.`);
      if (!close(problemPoints.FR.x, problemPoints.OT.x, 1e-4) || !close(problemPoints.FR.y, problemPoints.TL.y, 1e-4)) fail(`${label}: 이동한 직사각형의 오른쪽 변과 겹친 삼각형이 연결되지 않습니다.`);
    }
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e2ex4-phase") !== "problem" || attr(answerSvg, "data-source61-e2ex4-phase") !== "answer" || problemSvg.includes("source61-e2ex4-overlap") || !answerSvg.includes("source61-e2ex4-overlap is-solved")) fail(`${label}: 문제·답 단계 또는 답 전용 겹침 표시가 다릅니다.`);
    if (!String(generated?.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 그림의 원문 연결이 없습니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 문항에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움의 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}|\b\d+\s*\/\s*\d+\b/.test(`${generated?.prompt}\n${generated?.answer}\n${generated?.solution}\n${generated?.answerVisual}`)) fail(`${label}: 깨진 값, 학년 밖 표현 또는 슬래시 분수가 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 고정 문항 3개가 모두 나오지 않았습니다.`);
}

console.log(`6-1 소수의 나눗셈 E2 예제 2-4 감사: ${checked}회 · 3문항×3난이도 · 이동량·교집합·단일 답·문제/답 같은 점 확인`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 원본 13cm·4.3cm·9.245cm² · 직각삼각형/다각형 자르기 독립 계산 · 이동 전후 좌표 · 난이도 계약");
}
