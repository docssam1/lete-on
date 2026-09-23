"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const inventory = require("./source-inventory/5-1-u6-e3-e4-readiness-review.json");
const failures = [];
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const near = (left, right, tolerance = 1e-6) => Math.abs(left - right) <= tolerance;
const attr = (markup, name) => markup.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const number = value => Number(String(value).match(/-?\d+(?:\.\d+)?/)?.[0]);
const svg = (markup, className) => {
  const match = markup.match(new RegExp(`<svg class="geometry-diagram ${className}[^"]*"([^>]*)>([\\s\\S]*?)<\\/svg>`));
  return match ? { open: match[1], body: match[2] } : null;
};
const polygonPoints = (body, className) => String(body.match(new RegExp(`<polygon class="${className}"[^>]*points="([^"]+)"`))?.[1] || "")
  .trim().split(/\s+/).filter(Boolean).map(value => value.split(",").map(Number));

const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const types = unit?.subunits.flatMap(item => item.types) || [];
const specs = [
  { sourceItemId: "5-1-u6-e4-example-4-3", generatorKey: "source51RhombusRectangleOverlapE4", variant: 4, className: "source51-e4-overlap" },
  { sourceItemId: "5-1-u6-e4-example-4-4", generatorKey: "source51MovingPointTrapezoidE4", variant: 5, className: "source51-e4-motion" }
];

for (const spec of specs) {
  const type = types.find(item => item.sourceItemId === spec.sourceItemId);
  const ledger = inventory.items.find(item => item.sourceItemId === spec.sourceItemId);
  check(Boolean(type), `${spec.sourceItemId}: 공개 유형이 없습니다.`);
  check(type?.generatorKey === spec.generatorKey && type?.variant === spec.variant, `${spec.sourceItemId}: 생성기 또는 분기가 다릅니다.`);
  check(!type?.reviewLocked && type?.generationMode === "fixed-verified-pool" && type?.verifiedVariantCount === 3, `${spec.sourceItemId}: 공개 고정 묶음 계약이 다릅니다.`);
  check(type?.answerVisualRequired && type?.answerVisualStatus === "verified", `${spec.sourceItemId}: 정답 그림 계약이 없습니다.`);
  check(ledger?.implementationStatus === "implemented-fixed-verified-pool" && ledger?.publicDecision === "ready", `${spec.sourceItemId}: 준비표 공개 상태가 다릅니다.`);

  const pools = new Set();
  const designs = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 1000; seed += 1) {
      const context = `${spec.sourceItemId}/${difficulty}/${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        const problem = svg(generated.prompt, spec.className);
        const solution = svg(generated.answerVisual, spec.className);
        check(Boolean(problem && solution), `${context}: 문제 또는 풀이 SVG가 없습니다.`);
        if (!problem || !solution) continue;
        check(attr(problem.open, "data-source-item") === spec.sourceItemId, `${context}: 원본 ID가 다릅니다.`);
        check(Number(attr(problem.open, "data-answer-candidate-count")) === 1, `${context}: 단일 답 계약이 아닙니다.`);
        check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${context}: 고정 검증 묶음이 아닙니다.`);
        check(!/data-result-highlight=/.test(problem.open), `${context}: 문제 그림에 답 자료가 노출됩니다.`);
        check(/data-result-highlight=/.test(solution.open), `${context}: 풀이 그림에 확인 답이 없습니다.`);

        if (spec.variant === 4) {
          const width = Number(attr(problem.open, "data-rectangle-width"));
          const height = Number(attr(problem.open, "data-rectangle-height"));
          const rectangleNumerator = Number(attr(problem.open, "data-overlap-rectangle-numerator"));
          const rectangleDenominator = Number(attr(problem.open, "data-overlap-rectangle-denominator"));
          const rhombusNumerator = Number(attr(problem.open, "data-overlap-rhombus-numerator"));
          const rhombusDenominator = Number(attr(problem.open, "data-overlap-rhombus-denominator"));
          const overlapArea = Number(attr(problem.open, "data-overlap-area"));
          const rhombusArea = Number(attr(problem.open, "data-rhombus-area"));
          const shortDiagonal = Number(attr(problem.open, "data-short-diagonal"));
          const longDiagonal = Number(attr(solution.open, "data-long-diagonal"));
          const expectedOverlap = width * height * rectangleNumerator / rectangleDenominator;
          const expectedRhombus = expectedOverlap * rhombusDenominator / rhombusNumerator;
          const expectedLong = 2 * expectedRhombus / shortDiagonal;
          const candidates = Array.from({ length: 800 }, (_, index) => (index + 1) / 2)
            .filter(candidate => candidate >= shortDiagonal && near(shortDiagonal * candidate / 2, rhombusArea));
          check(near(overlapArea, expectedOverlap) && near(rhombusArea, expectedRhombus), `${context}: 두 넓이 비 계산이 다릅니다.`);
          check(near(longDiagonal, expectedLong) && near(number(generated.answer), expectedLong), `${context}: 긴 대각선 계산이 다릅니다.`);
          check(candidates.length === 1 && near(candidates[0], expectedLong), `${context}: 긴 대각선 후보가 하나가 아닙니다.`);
          check(polygonPoints(problem.body, "source51-e4-overlap-region").length >= 3, `${context}: 실제 교집합 다각형이 없습니다.`);
          check(/source51-e4-overlap-rectangle/.test(problem.body) && /source51-e4-overlap-rhombus/.test(problem.body) && /source51-e4-overlap-diagonal/.test(problem.body), `${context}: 직사각형·마름모·짧은 대각선이 빠졌습니다.`);
          if (width === 14 && height === 6) check(near(expectedOverlap, 36) && near(expectedRhombus, 66) && near(expectedLong, 16.5), `${context}: 원문 14·6·6/11·3/7·8 구조가 다릅니다.`);
        } else {
          const top = Number(attr(problem.open, "data-top-base"));
          const bottom = Number(attr(problem.open, "data-bottom-base"));
          const height = Number(attr(problem.open, "data-height"));
          const topSpeed = Number(attr(problem.open, "data-top-speed"));
          const bottomSpeed = Number(attr(problem.open, "data-bottom-speed"));
          const targetNumerator = Number(attr(problem.open, "data-target-numerator"));
          const targetDenominator = Number(attr(problem.open, "data-target-denominator"));
          const targetArea = Number(attr(problem.open, "data-target-area"));
          const answer = Number(attr(solution.open, "data-time-answer"));
          const totalArea = (top + bottom) * height / 2;
          const expectedTarget = totalArea * targetNumerator / targetDenominator;
          const maxTime = Math.floor(Math.min(top / topSpeed, bottom / bottomSpeed));
          const candidates = Array.from({ length: maxTime }, (_, index) => index + 1)
            .filter(time => near((topSpeed * time + bottomSpeed * time) * height / 2, targetArea));
          check(near(targetArea, expectedTarget), `${context}: 목표 넓이가 전체의 주어진 분수가 아닙니다.`);
          check(candidates.length === 1 && candidates[0] === answer && number(generated.answer) === answer, `${context}: 시간 답이 하나가 아닙니다.`);
          check(topSpeed * answer <= top && bottomSpeed * answer <= bottom, `${context}: 움직인 점이 사다리꼴 변을 벗어납니다.`);
          check(["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"].every(label => problem.body.includes(`data-label-for="${label}"`)), `${context}: 점 이름이 빠졌습니다.`);
          check(/source51-e4-motion-arrow/.test(problem.body) && /data-layout-role="moving-segment"/.test(problem.body), `${context}: 이동 방향 또는 두 점을 이은 선분이 없습니다.`);
          if (top === 12 && bottom === 24) check(totalArea === 252 && targetArea === 84 && answer === 4, `${context}: 원문 12·24·14·1/3 구조가 다릅니다.`);
        }

        pools.add(Number(generated.verifiedPoolIndex));
        designs.add(attr(problem.open, "data-difficulty-design"));
        checked += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
  check(pools.size === 3 && [0, 1, 2].every(index => pools.has(index)), `${spec.sourceItemId}: 고정 검증 문항 3개가 모두 생성되지 않습니다.`);
  check(designs.size === 3, `${spec.sourceItemId}: 쉬움·기준·어려움 설계가 구분되지 않습니다.`);
}

if (failures.length) {
  console.error(`5-1 6단원 예제 4-3·4-4 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-1 6단원 예제 4-3·4-4 감사 통과: ${checked.toLocaleString()}회 교집합·넓이 비·이동 거리·단일 답 검사`);
