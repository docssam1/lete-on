"use strict";

global.window = {};
require("./generators.js");
require("./source-grade6-decimal-e2-mission6.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e2-mission-6";
const generatorKey = "sourceGrade6DecimalDivisionE2Mission6";
const expectedPools = [
  [3, 6, 10, 2, 3.2, 3, 2.1, 5, 8, 3.5, 1.5, 1.125],
  [4, 6.5, 9.2, 2, 2.4, 3, 1.8, 6, 7.2, 3.6, 1.6, 1.28],
  [5, 7, 12.4, 3, 3.6, 4, 2.4, 8, 9.6, 4.8, 2, 2]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-6) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e2m6-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point.x * next.y - next.x * point.y;
}, 0)) / 2;
const distinctPoints = points => points.filter((point, index, all) => all.findIndex(candidate => close(candidate.x, point.x) && close(candidate.y, point.y)) === index);
const clip = (polygon, inside, intersect) => {
  const output = [];
  polygon.forEach((current, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentInside = inside(current);
    const previousInside = inside(previous);
    if (currentInside) {
      if (!previousInside) output.push(intersect(previous, current));
      output.push(current);
    } else if (previousInside) output.push(intersect(previous, current));
  });
  return output;
};
const clipTriangleWithRectangle = (triangle, rectangle) => {
  let result = triangle;
  const vertical = (x, a, b) => ({ x, y: a.y + (b.y - a.y) * (x - a.x) / (b.x - a.x) });
  const horizontal = (y, a, b) => ({ x: a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y), y });
  result = clip(result, point => point.x >= rectangle.left, (a, b) => vertical(rectangle.left, a, b));
  result = clip(result, point => point.x <= rectangle.right, (a, b) => vertical(rectangle.right, a, b));
  result = clip(result, point => point.y >= rectangle.bottom, (a, b) => horizontal(rectangle.bottom, a, b));
  result = clip(result, point => point.y <= rectangle.top, (a, b) => horizontal(rectangle.top, a, b));
  return result;
};

if (!api?.names?.includes(generatorKey)) fail("Mission 6 전용 생성기가 등록되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seedIndex = 0; seedIndex < 600; seedIndex += 1) {
    const seed = 61032600 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const poolIndex = generated?.verifiedPoolIndex;
    const expected = expectedPools[poolIndex];
    if (!Number.isInteger(poolIndex) || !expected) fail(`${label}: 고정 문항 번호가 없습니다.`);
    else seenPools.add(poolIndex);
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
    const problemSvg = svgFrom(generated?.prompt);
    const answerSvg = svgFrom(generated?.answerVisual);
    const problemValues = attr(problemSvg, "data-source61-e2m6-values").split(",").map(Number);
    const answerValues = attr(answerSvg, "data-source61-e2m6-values").split(",").map(Number);
    if (JSON.stringify(problemValues) !== JSON.stringify(answerValues) || problemValues.length !== 12 || problemValues.some((value, index) => !close(value, expected?.[index]))) fail(`${label}: 문제·답 자료가 고정 문항과 다릅니다.`);
    if (expected) {
      const [triangleBase, rectangleWidth, gap, trianglePeriod, triangleDistance, rectanglePeriod, rectangleDistance, elapsedSeconds, triangleMove, rectangleMove, overlapWidth, expectedArea] = expected;
      const movedTriangle = triangleDistance / trianglePeriod * elapsedSeconds;
      const movedRectangle = rectangleDistance / rectanglePeriod * elapsedSeconds;
      const relativeOverlap = movedTriangle + movedRectangle - gap;
      const analyticArea = relativeOverlap * relativeOverlap / 2;
      const triangle = [{ x: movedTriangle, y: 0 }, { x: movedTriangle + triangleBase, y: 0 }, { x: movedTriangle + triangleBase / 2, y: triangleBase / 2 }];
      const rectangleLeft = triangleBase + gap - movedRectangle;
      const rectangle = { left: rectangleLeft, right: rectangleLeft + rectangleWidth, bottom: 0, top: triangleBase / 2 };
      const clipped = clipTriangleWithRectangle(triangle, rectangle);
      const clippedArea = polygonArea(clipped);
      if (!close(movedTriangle, triangleMove) || !close(movedRectangle, rectangleMove) || !close(relativeOverlap, overlapWidth) || !close(analyticArea, expectedArea) || !close(clippedArea, expectedArea)) fail(`${label}: 두 이동·직각삼각형·다각형 교집합의 독립 계산이 일치하지 않습니다 (${movedTriangle}/${movedRectangle}/${analyticArea}/${clippedArea}).`);
      if (!(overlapWidth > 0 && overlapWidth <= triangleBase / 2) || distinctPoints(clipped).length !== 3) fail(`${label}: 겹친 부분이 하나의 직각삼각형으로 정해지지 않습니다.`);
      if (poolIndex === 0 && (!close(triangleMove, 8) || !close(rectangleMove, 3.5) || !close(overlapWidth, 1.5) || !close(expectedArea, 1.125))) fail(`${label}: 원본 문항의 8cm·3.5cm·1.5cm·1.125cm²가 다릅니다.`);
      if (String(generated?.answer) !== `${expectedArea}cm²`) fail(`${label}: 표시 답 ${generated?.answer}이 독립 계산 ${expectedArea}cm²와 다릅니다.`);
    }
    const problemPoints = parsePoints(attr(problemSvg, "data-source61-e2m6-points"));
    const answerPoints = parsePoints(attr(answerSvg, "data-source61-e2m6-points"));
    if (JSON.stringify(problemPoints) !== JSON.stringify(answerPoints) || !problemPoints.ITL || !problemPoints.ITA || !problemPoints.ITR || !problemPoints.IRL || !problemPoints.IRR || !problemPoints.FTL || !problemPoints.FTA || !problemPoints.FTR || !problemPoints.FRL || !problemPoints.FRR || !problemPoints.OT) fail(`${label}: 문제·답의 점·선분 자료가 다릅니다.`);
    else {
      if (!close(problemPoints.ITA.x, (problemPoints.ITL.x + problemPoints.ITR.x) / 2, 1e-4) || !close(problemPoints.ITL.y, problemPoints.ITR.y, 1e-4)) fail(`${label}: 직각이등변삼각형의 꼭짓점과 밑변 위치가 다릅니다.`);
      if (!close(problemPoints.FRL.x, problemPoints.OT.x, 1e-4) || !close(problemPoints.FRL.y, problemPoints.FTR.y, 1e-4)) fail(`${label}: 이동한 직사각형의 왼쪽 변과 겹친 삼각형이 연결되지 않습니다.`);
    }
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e2m6-phase") !== "problem" || attr(answerSvg, "data-source61-e2m6-phase") !== "answer" || problemSvg.includes("source61-e2m6-overlap") || !answerSvg.includes("source61-e2m6-overlap is-solved")) fail(`${label}: 문제·답 단계 또는 답 전용 겹침 표시가 다릅니다.`);
    if (!String(generated?.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 그림의 원문 연결이 없습니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 문항에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움의 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}|\b\d+\s*\/\s*\d+\b/.test(`${generated?.prompt}\n${generated?.answer}\n${generated?.solution}\n${generated?.answerVisual}`)) fail(`${label}: 깨진 값, 학년 밖 표현 또는 슬래시 분수가 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 고정 문항 3개가 모두 나오지 않았습니다.`);
}

console.log(`6-1 소수의 나눗셈 E2 Mission 6 감사: ${checked}회 · 3문항×3난이도 · 양쪽 이동·교집합·단일 답·문제/답 같은 점 확인`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 원본 8cm·3.5cm·1.5cm·1.125cm² · 직각삼각형/다각형 자르기 독립 계산 · 이동 전후 좌표 · 난이도 계약");
}
