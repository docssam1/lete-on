"use strict";

global.window = {};
require("./generators.js");
require("./source-grade6-decimal-e4-mission4.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e4-mission-4";
const generatorKey = "sourceGrade6DecimalDivisionE4Mission4";
const expectedPools = [
  [6, 19.2, 4.4, 13.2, 14.8],
  [4.8, 15.6, 3.6, 10.8, 12],
  [7.5, 23.1, 5.2, 15.6, 17.9]
];
const failures = [];
const close = (left, right, tolerance = 1e-6) => Math.abs(Number(left) - Number(right)) <= tolerance;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-e4m4-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const pointsFrom = value => Object.fromEntries(String(value).split(";").filter(Boolean).map(entry => {
  const [name, coordinate] = entry.split(":");
  const [x, y] = coordinate.split(",").map(Number);
  return [name, { x, y }];
}));

for (const difficulty of [-1, 0, 1]) for (let seed = 61044000; seed < 61044600; seed += 1) {
  const generated = api.generate({ sourceItemId, reviewLocked: false }, 0, difficulty, seed, 0);
  const problemSvg = svgFrom(generated.prompt);
  const answerSvg = svgFrom(generated.answerVisual);
  const values = attr(problemSvg, "data-source61-e4m4-values").split(",").map(Number);
  const poolIndex = generated.verifiedPoolIndex;
  const label = `난이도 ${difficulty} / seed ${seed}`;
  if (generated.generator !== generatorKey || generated.sourceItemId !== sourceItemId || generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex)) fail(`${label}: 생성기·원문·고정 문항 계약이 다릅니다.`);
  if (values.length !== 5 || values.some((value, index) => !close(value, expectedPools[poolIndex]?.[index])) || attr(problemSvg, "data-source61-e4m4-values") !== attr(answerSvg, "data-source61-e4m4-values")) fail(`${label}: 문제·답의 고정 수치가 다릅니다.`);
  const [nr, nm, side, rm, largeSide] = values;
  if (!close(nm - nr, rm) || !close(rm / 3, side) || !close(largeSide, nr + 2 * side) || generated.answer !== `${side}cm`) fail(`${label}: ㄴㅁ-ㄴㄹ=ㄹㅁ=한 변×3 관계가 다릅니다.`);
  const points = pointsFrom(attr(problemSvg, "data-source61-e4m4-points"));
  if (!["G", "N", "D", "R", "M"].every(name => points[name])) fail(`${label}: 정삼각형과 선분의 꼭짓점이 없습니다.`);
  else {
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    if (!close(distance(points.N, points.D), side) || !close(distance(points.R, points.M), rm) || !close(distance(points.N, points.M), nm) || !close(distance(points.N, points.R), nr)) fail(`${label}: 점·선분 모델의 길이가 독립 계산과 다릅니다.`);
    if (!close(points.N.y, points.D.y) || !close(points.D.y, points.R.y) || !close(points.R.y, points.M.y) || !(points.N.x < points.D.x && points.D.x < points.R.x && points.R.x < points.M.x)) fail(`${label}: ㄴ-ㄷ-ㄹ-ㅁ의 수평 순서가 다릅니다.`);
  }
  if (problemSvg.includes("source61-e4m4-target") || problemSvg.includes("source61-e4-result-label") || !answerSvg.includes("source61-e4m4-target is-solved") || !answerSvg.includes("source61-e4m4-rm is-solved")) fail(`${label}: 문제·답 그림의 강조가 분리되지 않았습니다.`);
  if (!String(generated.answerVisual).includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 그림의 원문 연결이 없습니다.`);
}

const summary = `${failures.length ? "실패" : "통과"}: 6-1 소수의 나눗셈 E4 Mission 4 1800회 · 3문항×3난이도 · 정삼각형 점·선분 모델 · ㄴㅁ-ㄴㄹ=ㄹㅁ=한 변×3 · 단일 답 · 문제/답 같은 좌표 확인\n${failures.join("\n")}\n`;
console.log(summary);
if (failures.length) process.exitCode = 1;
