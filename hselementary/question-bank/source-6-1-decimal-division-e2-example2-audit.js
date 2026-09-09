"use strict";

global.window = {};
require("./generators.js");
require("./source-grade6-decimal-e2-example2.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e2-example-2";
const generatorKey = "sourceGrade6DecimalDivisionE2Example2";
const expectedSides = [2.4, 3.6, 4.2];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const close = (left, right, tolerance = 1e-8) => Math.abs(Number(left) - Number(right)) <= tolerance;
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e2ex2-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const evidenceFrom = markup => String(markup).match(/<span hidden[^>]*data-source61-e2ex2-kind="three-square-intersection-quadrilateral"[^>]*><\/span>/)?.[0] || "";
const parsePoints = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));
const cross = (a, b, point) => (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x);
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point.x * next.y - next.x * point.y;
}, 0)) / 2;

if (!api?.names?.includes(generatorKey)) fail("예제 2-2 전용 생성기가 등록되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seedIndex = 0; seedIndex < 600; seedIndex += 1) {
    const seed = 61032200 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 0, difficulty, seed, 0);
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const problemSvg = svgFrom(generated?.prompt);
    const answerSvg = svgFrom(generated?.answerVisual);
    const evidence = evidenceFrom(generated?.prompt);
    const poolIndex = generated?.verifiedPoolIndex;
    const side = expectedSides[poolIndex];
    const leftParallel = side / 6;
    const rightParallel = side / 3;
    const independentArea = Math.round((leftParallel + rightParallel) * side / 2 * 100) / 100;
    const ratioArea = Math.round(side * side / 4 * 100) / 100;
    if (!Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 문항 번호가 없습니다.`);
    else seenPools.add(poolIndex);
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
    if (!close(independentArea, ratioArea) || String(generated?.answer) !== `${independentArea}cm²`) fail(`${label}: 사다리꼴 계산 ${independentArea}와 넓이 비 계산 ${ratioArea}, 표시 답 ${generated?.answer}이 일치하지 않습니다.`);
    if (poolIndex === 0 && independentArea !== 1.44) fail(`${label}: 원본 2.4cm 문항의 답이 1.44cm²가 아닙니다.`);
    const values = attr(evidence, "data-values").split(",").map(Number);
    if (attr(evidence, "data-source-item") !== sourceItemId || values.length !== 4 || !close(values[0], side) || !close(values[1], leftParallel) || !close(values[2], rightParallel) || !close(values[3], independentArea)) fail(`${label}: 문제 검산 자료가 독립 계산과 다릅니다.`);
    const problemPoints = parsePoints(attr(problemSvg, "data-source61-e2ex2-points"));
    const answerPoints = parsePoints(attr(answerSvg, "data-source61-e2ex2-points"));
    if (JSON.stringify(problemPoints) !== JSON.stringify(answerPoints) || attr(problemSvg, "data-target-order") !== "G-N-D-R" || attr(answerSvg, "data-target-order") !== "G-N-D-R") fail(`${label}: 문제와 답의 점 또는 ㄱㄴㄷㄹ 순서가 다릅니다.`);
    const p = problemPoints;
    if (!p.A || !p.G || !p.N || !p.D || !p.R || !p.L || !p.U) fail(`${label}: 필수 점 자료가 없습니다.`);
    else {
      const squareSide = p.G.x - p.A.x;
      if (!close(p.G.x, p.N.x) || !close(p.D.x, p.R.x) || !close(p.D.x - p.G.x, squareSide) || !close(p.U.x - p.A.x, squareSide * 3) || !close(p.D.y - p.A.y, squareSide)) fail(`${label}: 정사각형 세 개의 같은 간격이 깨졌습니다.`);
      if (!close(cross(p.A, p.U, p.G), 0, 1) || !close(cross(p.A, p.U, p.R), 0, 1) || !close(cross(p.A, p.L, p.N), 0, 1) || !close(p.D.x, p.L.x) || !close(p.D.y, p.L.y)) fail(`${label}: 두 선분의 종점 또는 교점이 원본 구조와 다릅니다.`);
      if (!close((p.G.y - p.A.y) / squareSide, 1 / 3, 1e-4) || !close((p.N.y - p.A.y) / squareSide, 1 / 2, 1e-4) || !close((p.R.y - p.A.y) / squareSide, 2 / 3, 1e-4)) fail(`${label}: ㄱ·ㄴ·ㄹ의 높이 비가 다릅니다.`);
      if (!close(polygonArea([p.G, p.N, p.D, p.R]) / (squareSide * squareSide), 1 / 4, 1e-4)) fail(`${label}: 좌표로 다시 구한 사각형 넓이 비가 1/4이 아닙니다.`);
    }
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e2ex2-phase") !== "problem" || attr(answerSvg, "data-source61-e2ex2-phase") !== "answer" || attr(problemSvg, "data-pool") !== String(poolIndex) || attr(answerSvg, "data-pool") !== String(poolIndex)) fail(`${label}: 문제·답 그림 단계 또는 pool 연결이 다릅니다.`);
    if (!String(generated?.answerVisual).includes(`data-answer-source="${sourceItemId}"`) || !answerSvg.includes("source61-e2ex2-target is-solved") || problemSvg.includes("source61-e2ex2-target is-solved")) fail(`${label}: 답 그림의 목표 사각형 강조가 다릅니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 문항에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움의 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}|\b\d+\s*\/\s*\d+\b/.test(`${generated?.prompt}\n${generated?.answer}\n${generated?.solution}\n${generated?.answerVisual}`)) fail(`${label}: 깨진 값, 학년 밖 표현 또는 슬래시 분수가 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 고정 문항 3개가 모두 나오지 않았습니다.`);
}

console.log(`6-1 소수의 나눗셈 E2 예제 2-2 감사: ${checked}회 · 3문항×3난이도 · 두 방식 넓이·단일 답·교점·라벨 순서·문제/답 같은 점 확인`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 원본 1.44cm² · 사다리꼴/넓이비 독립 계산 · ㄱㄴㄷㄹ 좌표 · 세 정사각형 비율 · 난이도 계약");
}
