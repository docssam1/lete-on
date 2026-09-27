"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const inventory = require("./source-inventory/5-1-u6-e3-e4-readiness-review.json");
const sourceItemId = "5-1-u6-e3-mission-2";
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const number = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const svg = markup => {
  const match = markup.match(/<svg class="geometry-diagram source51-e3-tile-array[^"]*"([^>]*)>([\s\S]*?)<\/svg>/);
  return match ? { open: match[1], body: match[2] } : null;
};

const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);
const ledger = inventory.items.find(item => item.sourceItemId === sourceItemId);
check(Boolean(type), "Mission 2 공개 유형이 없습니다.");
check(type?.generatorKey === "source51ParallelogramTileArrayE3" && type?.variant === 9, "Mission 2 생성기 또는 분기가 다릅니다.");
check(!type?.reviewLocked && type?.generationMode === "fixed-verified-pool" && type?.verifiedVariantCount === 3, "Mission 2 공개 고정 묶음 계약이 다릅니다.");
check(type?.answerVisualRequired && type?.answerVisualStatus === "verified", "Mission 2 정답 그림 계약이 없습니다.");
check(ledger?.implementationStatus === "implemented-fixed-verified-pool" && ledger?.publicDecision === "ready", "Mission 2 준비표 공개 상태가 다릅니다.");

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
      const rows = Number(attr(problem.open, "data-rows"));
      const columns = Number(attr(problem.open, "data-columns"));
      const tileCount = Number(attr(problem.open, "data-tile-count"));
      const base = Number(attr(problem.open, "data-base"));
      const height = Number(attr(problem.open, "data-height"));
      const side = Number(attr(problem.open, "data-side"));
      const tileArea = Number(attr(problem.open, "data-tile-area"));
      const totalArea = Number(attr(solution.open, "data-total-area"));
      const problemTiles = (problem.body.match(/data-layout-role="tile"/g) || []).length;
      const solutionTiles = (solution.body.match(/data-layout-role="tile"/g) || []).length;
      const answerCandidates = Array.from({ length: totalArea + 1 }, (_, index) => index + 1)
        .filter(candidate => candidate === base * height * rows * columns);

      check(attr(problem.open, "data-source-item") === sourceItemId, `${context}: 원본 ID가 다릅니다.`);
      check(Number(attr(problem.open, "data-answer-candidate-count")) === 1, `${context}: 단일 답 계약이 아닙니다.`);
      check(rows * columns === tileCount, `${context}: 행과 열로 센 조각 수가 다릅니다.`);
      check(problemTiles === tileCount && solutionTiles === tileCount, `${context}: 그림의 조각 수가 자료와 다릅니다.`);
      check(base * height === tileArea, `${context}: 한 조각 넓이가 다릅니다.`);
      check(tileArea * tileCount === totalArea && number(generated.answer) === totalArea, `${context}: 전체 넓이가 다릅니다.`);
      check(side > height, `${context}: 빗변 길이가 높이보다 길지 않습니다.`);
      check(answerCandidates.length === 1 && answerCandidates[0] === totalArea, `${context}: 전체 넓이 답이 하나가 아닙니다.`);
      check(/source51-e3-tile-height/.test(problem.body) && /source51-e3-tile-right-angle/.test(problem.body), `${context}: 수직 높이 또는 직각 표시가 없습니다.`);
      check(!/data-result-highlight=/.test(problem.open), `${context}: 문제 그림에 답 자료가 노출됩니다.`);
      check(attr(solution.open, "data-result-highlight") === `${totalArea}cm²`, `${context}: 풀이 그림의 확인 답이 다릅니다.`);
      if (rows === 3 && columns === 6 && base === 8 && height === 6 && side === 10) {
        check(tileCount === 18 && tileArea === 48 && totalArea === 864, `${context}: 원문 3행×6열·8·6·10 구조가 다릅니다.`);
      }
      pools.add(Number(generated.verifiedPoolIndex));
      designs.add(attr(problem.open, "data-difficulty-design"));
      checked += 1;
    } catch (error) {
      failures.push(`${context}: ${error.message}`);
    }
  }
}

check(pools.size === 3 && [0, 1, 2].every(index => pools.has(index)), "Mission 2 고정 검증 문항 3개가 모두 생성되지 않습니다.");
check(designs.size === 3, "Mission 2 쉬움·기준·어려움 설계가 구분되지 않습니다.");
if (failures.length) {
  console.error(`5-1 6단원 Mission 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 Mission 2 감사 통과: ${checked.toLocaleString()}회 조각 수·넓이·단일 답 검사`);
