"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-grade6-decimal-e1-mission4.js");
require("./source-grade6-decimal-e1-mission3.js");

const readiness = require("./source-inventory/6-1-u3-source-readiness-review.json");
const rawInventory = require("./source-inventory/6-1-source-items.json");
const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e1-mission-3";
const generatorKey = "sourceGrade6DecimalDivisionE1Mission3";
const expectedPools = [
  [13, 7.5, 4.8, 56.25, 62.4, 118.65],
  [12.5, 6.8, 5.2, 46.24, 65, 111.24],
  [14, 8.5, 6.3, 72.25, 88.2, 160.45]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const close = (left, right, tolerance = 1e-6) => Math.abs(Number(left) - Number(right)) <= tolerance;
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const pointMap = markup => new Map((attr(markup, "data-source61-e1m3-points") || "").split(";").filter(Boolean).map(item => {
  const [name, values] = item.split(":");
  const [x, y] = values.split(",").map(Number);
  return [name, { x, y }];
}));
const vector = (from, to) => ({ x: to.x - from.x, y: to.y - from.y });
const length = value => Math.hypot(value.x, value.y);
const dot = (left, right) => left.x * right.x + left.y * right.y;
const cross = (left, right) => left.x * right.y - left.y * right.x;
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point.x * next.y - point.y * next.x;
}, 0)) / 2;
const visibleProblem = prompt => String(prompt).replace(/<span hidden[\s\S]*?<\/span>/g, "");

if (!api?.names?.includes(generatorKey)) fail("Mission 3 전용 생성기가 등록되지 않았습니다.");
const catalogItem = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const curriculumItem = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units).flatMap(unit => unit.subunits).flatMap(subunit => subunit.types).find(type => type.sourceItemId === sourceItemId);
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const rawItem = rawInventory.items.find(item => item.sourceItemId === sourceItemId);
if (!catalogItem || catalogItem.reviewLocked || catalogItem.generatorKey !== generatorKey || catalogItem.answerVisualStatus !== "verified" || catalogItem.verifiedVariantCount !== 3) fail("공개 분류표의 Mission 3 생성 계약이 다릅니다.");
if (!curriculumItem || curriculumItem.reviewLocked || curriculumItem.generatorKey !== generatorKey) fail("교육과정 화면의 Mission 3 연결이 다릅니다.");
if (!readinessItem || readinessItem.implementationStatus !== "fixed-verified-pool" || readinessItem.publicDecision !== "confirmed" || readinessItem.releaseStatus !== "verified" || !readinessItem.singleAnswer) fail("원문 준비도 기록의 Mission 3 공개 상태가 다릅니다.");
if (!rawItem || rawItem.implementationStatus !== "fixed-verified-pool" || rawItem.answerContract !== "single-answer-fixed-pool" || rawItem.publicSourceItemId !== sourceItemId) fail("원자료 장부의 Mission 3 연결이 다릅니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seed = 610300; seed < 610900; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey, variant: 0 }, 0, difficulty, seed, 0);
    const poolIndex = Number(generated?.verifiedPoolIndex);
    const expected = expectedPools[poolIndex];
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const values = (attr(generated.prompt, "data-values") || "").split(",").filter(Boolean).map(Number);
    const points = pointMap(generated.prompt);
    seenPools.add(poolIndex);
    if (!expected || !sameValues(values, expected)) fail(`${label}: 고정 문항의 수와 넓이가 다릅니다.`);
    const [base, side, height, squareArea, parallelogramArea, totalArea] = values;
    const candidates = [];
    for (let tenths = 1; tenths <= 999; tenths += 1) if (close(base * tenths / 10 + squareArea, totalArea, 1e-9)) candidates.push(tenths / 10);
    if (!close(side * side, squareArea) || !close(base * height, parallelogramArea) || !close(squareArea + parallelogramArea, totalArea) || candidates.length !== 1 || !close(candidates[0], height)) fail(`${label}: 독립 넓이 계산 또는 단일 정답 검사가 실패했습니다.`);
    if (points.size !== 7 || [..."ABCDEFH"].some(name => !points.has(name))) {
      fail(`${label}: 점 좌표가 빠졌습니다.`);
    } else {
      const A = points.get("A"), B = points.get("B"), C = points.get("C"), D = points.get("D"), E = points.get("E"), F = points.get("F"), H = points.get("H");
      const AB = vector(A, B), DC = vector(D, C), AD = vector(A, D), BC = vector(B, C);
      const BE = vector(B, E), EF = vector(E, F), FC = vector(F, C), CB = vector(C, B), AH = vector(A, H);
      const scale = Number(attr(generated.prompt, "data-scale"));
      if (!close(cross(AB, DC), 0) || !close(cross(AD, BC), 0) || !close(AB.x, DC.x) || !close(AD.x, BC.x) || !close(AD.y, BC.y)) fail(`${label}: 평행사변형의 마주 보는 변이 평행하지 않습니다.`);
      if (![BE, EF, FC, CB].every(edge => close(length(edge), side * scale, .02)) || !close(dot(BE, BC), 0, 1) || !close(dot(EF, BE), 0, 1)) fail(`${label}: 정사각형의 네 변 또는 직각이 맞지 않습니다.`);
      if (!close(dot(AH, AB), 0, 1) || !close(length(AH), height * scale, .02) || !close(H.y, D.y, .02)) fail(`${label}: 높이가 밑변에 수직이 아니거나 길이가 다릅니다.`);
      if (!(cross(BC, vector(B, A)) * cross(BC, vector(B, E)) < 0)) fail(`${label}: 두 도형이 공유변의 같은 쪽에 있어 겹칩니다.`);
      if (!close(polygonArea([A, B, C, D]) / (scale * scale), parallelogramArea, .02) || !close(polygonArea([B, E, F, C]) / (scale * scale), squareArea, .02)) fail(`${label}: SVG 좌표에서 다시 구한 넓이가 자료와 다릅니다.`);
    }
    const problemSvg = String(generated.prompt).match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
    const answerSvg = String(generated.answerVisual).match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e1m3-points") !== attr(answerSvg, "data-source61-e1m3-points") || attr(problemSvg, "data-source61-e1m3-segments") !== attr(answerSvg, "data-source61-e1m3-segments")) fail(`${label}: 문제와 답의 점·선분 자료가 다릅니다.`);
    if (attr(problemSvg, "data-shared-segment") !== "B-C" || (problemSvg.match(/source61-e1m3-right-angle/g) || []).length !== 5) fail(`${label}: 공유변 또는 직각 표시가 빠졌습니다.`);
    if (visibleProblem(generated.prompt).includes(`${height}cm`) || visibleProblem(generated.prompt).includes("source61-e1m3-target is-solved") || !problemSvg.includes("source61-e1m3-blank")) fail(`${label}: 문제 그림에 답이 노출되거나 빈칸이 없습니다.`);
    if (!answerSvg.includes("source61-e1m3-target is-solved") || !generated.answerVisual.includes("source61-e1m3-board") || String(generated.answer) !== `${height}cm`) fail(`${label}: 답 그림 또는 계산 보드가 다릅니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt} ${generated.answer} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 세 고정 문항이 모두 생성되지 않았습니다.`);
}

if (failures.length) {
  console.error(`6-1 소수의 나눗셈 E1 Mission 3 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`6-1 소수의 나눗셈 E1 Mission 3 감사 통과: ${checked.toLocaleString()}회 · 3문항×3난이도 · 독립 넓이·단일 정답·공유변·평행·직각·비겹침·같은 점 자료 확인`);
