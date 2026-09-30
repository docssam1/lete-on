"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const sourceItemId = "6-2-u2-e2-exploration";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === sourceItemId);
const readiness = require("./source-inventory/6-2-u2-e2-exploration-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2")
  .units.find(item => item.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(raw && type && !type.reviewLocked && type.rawSourceItemId === sourceItemId, "원본과 공개 유형 연결");
assert.equal(raw.publicSourceItemId, sourceItemId);
assert.equal(raw.pdfPage, 18);
assert.equal(raw.printedPage, 20);
assert.equal(readiness.sourceItemId, sourceItemId);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.releaseStatus, "verified");
assert.equal(readiness.verifiedVariantCount, 3);

function attribute(svg, key) {
  const match = svg.match(new RegExp(`\\b${key}="([^"]+)"`));
  assert(match, `${key} 누락`);
  return match[1];
}
function region(svg, name) {
  const match = svg.match(new RegExp(`<rect data-region="${name}"[^>]+>`));
  assert(match, `${name} 직사각형 누락`);
  return Object.fromEntries(["x", "y", "width", "height"].map(key => [key, Number(attribute(match[0], key))]));
}
function independentAnswer(svg) {
  const right = BigInt(attribute(svg, "data-right-width-tenths"));
  const full = BigInt(attribute(svg, "data-full-height-tenths"));
  const lower = BigInt(attribute(svg, "data-lower-height-tenths"));
  const ratio = BigInt(attribute(svg, "data-area-ratio-tenths"));
  assert(full > lower && lower > 0n && right > 0n && ratio > 0n, "길이와 비가 양수여야 함");
  const top = full - lower;
  const topWidthNumerator = 10n * right * full;
  const topWidthDenominator = ratio * top;
  assert.equal(topWidthNumerator % topWidthDenominator, 0n, "답이 한 자리 소수로 끝나지 않음");
  const targetTenths = topWidthNumerator / topWidthDenominator - right;
  assert(targetTenths > 0n, "대상 선분이 양수가 아님");
  const upper = region(svg, "upper-rectangle");
  const rightRegion = region(svg, "right-rectangle");
  assert(Math.abs(upper.y - rightRegion.y) < 0.11, "위쪽과 오른쪽 도형의 윗변이 다름");
  assert(Math.abs(upper.x + upper.width - rightRegion.x - rightRegion.width) < 0.11, "두 도형의 오른쪽 변이 다름");
  assert(Math.abs(upper.height / rightRegion.height - Number(top) / Number(full)) < 0.015, "높이 비례가 다름");
  assert(Math.abs(rightRegion.width / rightRegion.height - Number(right) / Number(full)) < 0.015, "가로·세로 비례가 다름");
  assert.equal(attribute(svg, "data-target-segment"), "ga-ma", "대상 선분");
  for (const label of ["ga", "ma", "ra", "na", "center", "da", "ba", "sa"]) assert(svg.includes(`data-label-for="${label}"`), `${label} 점 이름 누락`);
  const cm = (Number(targetTenths) / 10).toFixed(1);
  return `${cm}cm`;
}

let checks = 0;
const pools = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
  assert(generated && generated.sourceItemId === sourceItemId && generated.generationMode === "fixed-verified-pool", "고정 문항 생성");
  assert(generated.prompt.includes("ㅁㅂㅅㄹ") && generated.prompt.includes("ㄱㄴㄷㄹ"), "원본의 두 직사각형 관계");
  if (difficulty === 1) {
    const perimeter = generated.prompt.match(/둘레는 ([\d.]+)cm/);
    assert(perimeter && !generated.prompt.includes('data-owner-id="full-height"'), "어려움의 둘레 조건과 숨긴 높이");
    const right = BigInt(attribute(generated.prompt, "data-right-width-tenths"));
    const full = BigInt(attribute(generated.prompt, "data-full-height-tenths"));
    assert.equal(BigInt(Math.round(Number(perimeter[1]) * 10)), 2n * (right + full), "둘레와 도형 길이 불일치");
  } else {
    assert(generated.prompt.includes('data-owner-id="full-height"'), "원본 높이 표시 누락");
    assert.equal(generated.prompt.includes("위쪽 직사각형의 높이는"), difficulty === -1, "쉬움의 추가 높이 조건");
  }
  assert.equal(generated.answer, independentAnswer(generated.prompt), "독립 넓이 비 검산");
  assert.equal(generated.answer, independentAnswer(generated.answerVisual), "답 그림의 도형 모델");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이와 답 그림");
  assert(!/\d+\.0cm/.test(`${generated.prompt}${generated.solution}${generated.answerVisual}`), "불필요한 .0cm 표시");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류");
  pools.add(generated.verifiedPoolIndex);
  checks += 1;
}
assert.equal(pools.size, 3, "고정 문항 3개");
console.log(`6-2 소수의 나눗셈 개념탐구 2: ${checks}건 넓이 비·도형 관계 독립 검산 통과`);
