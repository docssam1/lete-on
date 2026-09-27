"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const inventory = require("./source-inventory/5-1-u6-e3-e4-readiness-review.json");
const sourceItemId = "5-1-u6-e3-example-3-1";
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const number = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const svg = markup => {
  const match = markup.match(/<svg class="geometry-diagram source51-e3-overlap[^"]*"([^>]*)>([\s\S]*?)<\/svg>/);
  return match ? { open: match[1], body: match[2] } : null;
};
const polygon = (body, role) => String(body.match(new RegExp(`<polygon[^>]*data-layout-role="${role}"[^>]*points="([^"]+)"`))?.[1] || "")
  .trim().split(/\s+/).filter(Boolean).map(value => value.split(",").map(Number));
const area = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point[0] * next[1] - next[0] * point[1];
}, 0)) / 2;

const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);
const ledger = inventory.items.find(item => item.sourceItemId === sourceItemId);
check(Boolean(type), "예제 3-1 공개 유형이 없습니다.");
check(type?.generatorKey === "source51OverlappingParallelogramsE3" && type?.variant === 4, "예제 3-1 생성기 또는 분기가 다릅니다.");
check(!type?.reviewLocked && type?.generationMode === "fixed-verified-pool" && type?.verifiedVariantCount === 3, "예제 3-1 공개 고정 묶음 계약이 다릅니다.");
check(type?.answerVisualRequired && type?.answerVisualStatus === "verified", "예제 3-1 정답 그림 계약이 없습니다.");
check(ledger?.implementationStatus === "implemented-fixed-verified-pool" && ledger?.publicDecision === "ready", "예제 3-1 준비표 공개 상태가 다릅니다.");

const pools = new Set();
const designs = new Set();
for (const difficulty of [-1, 0, 1]) {
  for (let seed = 1; seed <= 1000; seed += 1) {
    const context = `${sourceItemId}/${difficulty}/${seed}`;
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const problem = svg(generated.prompt);
      const solution = svg(generated.answerVisual);
      check(Boolean(problem && solution), `${context}: 문제 또는 풀이 SVG가 없습니다.`);
      if (!problem || !solution) continue;
      const base = Number(attr(problem.open, "data-base"));
      const height = Number(attr(problem.open, "data-height"));
      const offset = Number(attr(problem.open, "data-offset"));
      const oneArea = Number(attr(problem.open, "data-one-area"));
      const shadedArea = Number(attr(problem.open, "data-shaded-area"));
      const overlapArea = Number(attr(solution.open, "data-overlap-area"));
      const unionPoints = polygon(problem.body, "shaded-union");
      const overlapPoints = polygon(problem.body, "overlap-triangle");
      const drawScale = overlapPoints.length === 3 ? (overlapPoints[1][0] - overlapPoints[0][0]) / base : 0;
      const candidates = Array.from({ length: oneArea * 2 + 1 }, (_, index) => index + 1)
        .filter(candidate => candidate === oneArea * 2 - shadedArea);

      check(attr(problem.open, "data-source-item") === sourceItemId, `${context}: 원본 ID가 다릅니다.`);
      check(Number(attr(problem.open, "data-answer-candidate-count")) === 1, `${context}: 단일 답 계약이 아닙니다.`);
      check(base * height === oneArea, `${context}: 평행사변형 하나의 넓이가 다릅니다.`);
      check(oneArea * 2 - shadedArea === overlapArea && number(generated.answer) === overlapArea, `${context}: 겹친 넓이 계산이 다릅니다.`);
      check(candidates.length === 1 && candidates[0] === overlapArea, `${context}: 겹친 넓이 답이 하나가 아닙니다.`);
      check(unionPoints.length === 7 && overlapPoints.length === 3, `${context}: 색칠 영역 또는 겹친 삼각형의 점 수가 다릅니다.`);
      check(Math.abs(area(unionPoints) - shadedArea * drawScale * drawScale) < 1e-6, `${context}: 그린 색칠 영역의 넓이가 자료와 다릅니다.`);
      check(Math.abs(area(overlapPoints) - overlapArea * drawScale * drawScale) < 1e-6, `${context}: 그린 겹친 삼각형의 넓이가 자료와 다릅니다.`);
      check(["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ"].every(label => problem.body.includes(`data-label-for="${label}"`)), `${context}: 점 이름이 빠졌습니다.`);
      check(!/data-result-highlight=/.test(problem.open), `${context}: 문제 그림에 답 자료가 노출됩니다.`);
      check(attr(solution.open, "data-result-highlight") === `${overlapArea}cm²`, `${context}: 풀이 그림의 확인 답이 다릅니다.`);
      if (base === 12 && height === 9 && offset === 18) check(oneArea === 108 && shadedArea === 180 && overlapArea === 36, `${context}: 원문 12·9·12·180 구조가 다릅니다.`);
      pools.add(Number(generated.verifiedPoolIndex));
      designs.add(attr(problem.open, "data-difficulty-design"));
      checked += 1;
    } catch (error) {
      failures.push(`${context}: ${error.message}`);
    }
  }
}

check(pools.size === 3 && [0, 1, 2].every(index => pools.has(index)), "예제 3-1 고정 검증 문항 3개가 모두 생성되지 않습니다.");
check(designs.size === 3, "예제 3-1 쉬움·기준·어려움 설계가 구분되지 않습니다.");
if (failures.length) {
  console.error(`5-1 6단원 예제 3-1 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 예제 3-1 감사 통과: ${checked.toLocaleString()}회 다각형 넓이·겹친 영역·단일 답 검사`);
