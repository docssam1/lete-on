"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-e2-geometry.js");

const assert = require("node:assert/strict");
const id = "6-2-u2-e2-mission-3";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === id);
const readiness = require("./source-inventory/6-2-u2-e2-mission3-readiness-review.json");
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(raw && type && type.reviewLocked && type.rawSourceItemId === id, "원본·잠금 유형 연결");
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1, 0), null, "공식 답 근거 전에는 출제되지 않음");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE2Mission3" };
assert.equal(raw.answerContract, "single-shared-height-triangle-base-difference");
assert.equal(raw.pdfPage, 19);
assert.equal(raw.printedPage, 21);
assert.equal(readiness.sourceItemId, id);
assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
assert.equal(readiness.sourceIdentity.printedPage, raw.printedPage);
assert.equal(readiness.officialAnswerEvidence.status, "not-available-for-this-item");
assert.equal(readiness.verifiedVariantCount, 3);
assert.equal(readiness.releaseStatus, "locked");

function independentAnswer(prompt) {
  const statement = prompt.split("<svg")[0];
  const ratio = Number(statement.match(/삼각형 ㄹㅁㄷ의 넓이의 ([\d.]+)배/)?.[1]);
  const height = Number(prompt.match(/class="source62-triangle-height-label"[^>]*>([\d.]+)cm/)?.[1]);
  const easyBase = statement.match(/선분 ㄴㄷ의 길이는 ([\d.]+)cm/);
  const standardArea = statement.match(/삼각형 ㄱㄴㄷ의 넓이는 ([\d.]+)cm²/);
  const hardArea = statement.match(/두 삼각형의 넓이의 합은 ([\d.]+)cm²/);
  assert(height > 0 && ratio > 1, "같은 높이와 양의 넓이 비");
  assert.equal([easyBase, standardArea, hardArea].filter(Boolean).length, 1, "난이도별 주어진 조건 하나");
  const largeBase = easyBase ? Number(easyBase[1]) : standardArea ? 2 * Number(standardArea[1]) / height : 2 * Number(hardArea[1]) * ratio / (ratio + 1) / height;
  const candidates = [];
  for (let gapHundredths = 1; gapHundredths < Math.round(largeBase * 100); gapHundredths += 1) {
    const smallerBase = largeBase - gapHundredths / 100;
    if (Math.abs(largeBase / smallerBase - ratio) < 1e-8) candidates.push(gapHundredths);
  }
  assert.equal(candidates.length, 1, "그림과 조건으로 정답 후보가 정확히 한 개");
  return { answer: `${Number((candidates[0] / 100).toFixed(2))}cm`, height, ratio, largeBase, smallBase: largeBase - candidates[0] / 100, condition: easyBase ? "base" : standardArea ? "large-area" : "sum-area" };
}

let checked = 0;
const pools = new Set();
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(candidateType, 0, difficulty, seed, seed % 3);
  const independent = independentAnswer(generated.prompt);
  const svg = generated.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  assert.equal(generated.sourceItemId, id);
  assert.equal(generated.generationMode, "fixed-verified-pool");
  assert.equal(generated.verifiedVariantCount, 3);
  assert.equal(generated.answer, independent.answer, "표시된 조건을 별도 계산한 답");
  assert.equal(independent.condition, ["base", "large-area", "sum-area"][difficulty + 1], "난이도별 추론 조건");
  assert(generated.solution.replace(/<[^>]*>/g, "").includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이·정답 그림의 답 일치");
  assert(svg && svg.includes('data-geometry-kind="same-height-overlap-triangles"') && svg.includes('data-target-segment="ㄴ-ㅁ"'), "원본 도형의 같은 높이와 목표 선분");
  assert.equal((svg.match(/data-label-for="/g) || []).length, 5, "다섯 꼭짓점 이름");
  assert.deepEqual([...svg.matchAll(/data-label-for="([^"]+)"/g)].map(match => match[1]).sort(), ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"].sort(), "원본 점 이름");
  assert(!/data-model="/.test(svg), "문제 그림에 숨은 길이 조건을 넣지 않음");
  const targetPoint = Number(svg.match(/<line[^>]* data-from="ㄹ" data-to="ㅁ"[^>]* x2="([\d.]+)"/)?.[1]);
  assert(Math.abs(targetPoint - (100 + 280 * (independent.largeBase - independent.smallBase) / independent.largeBase)) < 0.01, "ㅁ의 위치는 밑변 비에서 계산됨");
  assert(!svg.includes(generated.answer), "문제 그림에 정답 누설 없음");
  assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), "표시값 오류 없음");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.equal(independent.height, 3.9);
    assert.equal(independent.ratio, 1.25);
    assert.equal(generated.prompt.includes("9.36cm²"), true);
    assert.equal(independent.answer, "0.96cm");
  }
  if (difficulty === 1 && generated.verifiedPoolIndex === 0) assert(generated.prompt.includes("16.848cm²"), "어려움은 두 넓이의 합만 제시");
  pools.add(generated.verifiedPoolIndex);
  checked += 1;
}
assert.equal(pools.size, 3, "검증된 고정 문항 3개");
console.log(`6-2 겹친 삼각형: ${checked}회 보이는 조건에서 답 후보 전수 열거·원본 구조 검사 통과`);
