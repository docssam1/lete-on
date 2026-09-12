"use strict";

global.window = {};
require("./generators.js");
require("./source-grade6-decimal-e4-example1.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e4-example-1";
const generatorKey = "sourceGrade6DecimalDivisionE4Example1";
const expectedPools = [
  [4, 1, 3, 15.2, 2.5, 7, 66.5, 19, 3.5],
  [5, 1, 4, 17.5, 2.4, 9, 75.6, 21, 3.6],
  [5, 2, 4, 18, 2.2, 8, 63.36, 19.8, 3.2]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-6) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e4ex1-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point.x * next.y - next.x * point.y;
}, 0)) / 2;

if (!api?.names?.includes(generatorKey)) fail("예제 4-1 전용 생성기가 등록되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seedIndex = 0; seedIndex < 600; seedIndex += 1) {
    const seed = 61034100 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const poolIndex = generated?.verifiedPoolIndex;
    const expected = expectedPools[poolIndex];
    if (!Number.isInteger(poolIndex) || !expected) fail(`${label}: 고정 문항 번호가 없습니다.`);
    else seenPools.add(poolIndex);
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
    const problemSvg = svgFrom(generated?.prompt);
    const answerSvg = svgFrom(generated?.answerVisual);
    const values = attr(problemSvg, "data-source61-e4ex1-values").split(",").map(Number);
    if (values.length !== 9 || values.some((value, index) => !close(value, expected?.[index])) || attr(problemSvg, "data-source61-e4ex1-values") !== attr(answerSvg, "data-source61-e4ex1-values")) fail(`${label}: 문제·답 값 자료가 고정 문항과 다릅니다.`);
    const cells = attr(problemSvg, "data-source61-e4ex1-cells").split(";").filter(Boolean);
    if (attr(problemSvg, "data-source61-e4ex1-cells") !== attr(answerSvg, "data-source61-e4ex1-cells") || new Set(cells).size !== cells.length || cells.length !== expected?.[5]) fail(`${label}: 문제·답의 격자 칸 목록이 다릅니다.`);
    const points = parsePoints(attr(problemSvg, "data-source61-e4ex1-points"));
    const answerPoints = parsePoints(attr(answerSvg, "data-source61-e4ex1-points"));
    if (JSON.stringify(points) !== JSON.stringify(answerPoints) || !points.N || !points.G || !points.D) fail(`${label}: 문제·답의 삼각형 꼭짓점 자료가 다릅니다.`);
    if (expected && points.N && points.G && points.D) {
      const [columns, topStart, apexColumn, totalWidth, cellHeight, cellCount, wholeArea, triangleArea, ratio] = expected;
      const cellWidth = totalWidth / columns;
      const areaByCells = cellCount * cellWidth * cellHeight;
      const scaleX = (points.D.x - points.N.x) / totalWidth;
      const scaleY = (points.N.y - points.G.y) / cellHeight;
      const areaByShoelace = polygonArea([points.N, points.G, points.D]) / (scaleX * scaleY);
      const areaRatio = areaByCells / areaByShoelace;
      if (!close(areaByCells, wholeArea) || !close(areaByShoelace, triangleArea) || !close(areaRatio, ratio)) fail(`${label}: 셀 합·신발끈 공식·넓이 비의 독립 계산이 일치하지 않습니다 (${areaByCells}/${areaByShoelace}/${areaRatio}).`);
      if (!(topStart > 0 && topStart < columns && apexColumn >= topStart && apexColumn < columns && points.N.x < points.G.x && points.G.x < points.D.x && close(points.N.y, points.D.y))) fail(`${label}: 계단형 격자 또는 삼각형 꼭짓점이 하나로 정해지지 않습니다.`);
      if (poolIndex === 0 && (columns !== 4 || topStart !== 1 || apexColumn !== 3 || !close(totalWidth, 15.2) || !close(cellHeight, 2.5) || cellCount !== 7 || !close(wholeArea, 66.5) || !close(triangleArea, 19) || !close(ratio, 3.5))) fail(`${label}: 원본 7칸·15.2cm·2.5cm·19cm²·3.5배가 다릅니다.`);
      if (String(generated?.answer) !== `${ratio}배`) fail(`${label}: 표시 답 ${generated?.answer}이 독립 계산 ${ratio}배와 다릅니다.`);
    }
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e4ex1-phase") !== "problem" || attr(answerSvg, "data-source61-e4ex1-phase") !== "answer" || problemSvg.includes("source61-e4ex1-target") || !answerSvg.includes("source61-e4ex1-target is-solved")) fail(`${label}: 문제·답 단계 또는 답 전용 삼각형 표시가 다릅니다.`);
    if (!String(generated?.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 그림의 원문 연결이 없습니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 문항에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움의 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}|\b\d+\s*\/\s*\d+\b/.test(`${generated?.prompt}\n${generated?.answer}\n${generated?.solution}\n${generated?.answerVisual}`)) fail(`${label}: 깨진 값, 학년 밖 표현 또는 슬래시 분수가 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 고정 문항 3개가 모두 나오지 않았습니다.`);
}

console.log(`6-1 소수의 나눗셈 E4 예제 4-1 감사: ${checked}회 · 3문항×3난이도 · 격자 셀·좌표 넓이·단일 답·문제/답 같은 점 확인`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 원본 7칸·15.2cm·2.5cm·66.5cm²·19cm²·3.5배 · 셀 합/신발끈 독립 계산 · 난이도 계약");
}
