"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const id = "6-2-u2-e2-mission-4";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(type?.reviewLocked && window.HSE_GENERATORS.generate(type, 0, 0, 1) === null, "검수 후보는 공개 출제되지 않음");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE2Mission4" };
const toHundredths = value => Math.round(Number(value) * 100);

function pointMap(svg) {
  const points = {};
  for (const line of svg.matchAll(/<line data-layout-role="([^"]+)" data-from="([^"]+)" data-to="([^"]+)" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)) {
    points[line[2]] = [Number(line[4]), Number(line[5])];
    points[line[3]] = [Number(line[6]), Number(line[7])];
  }
  return points;
}

function independent(generated, level) {
  const statement = generated.prompt.split("<svg")[0];
  const svg = generated.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  assert(svg && svg.includes('data-geometry-kind="two-overlapping-triangles-height"'), "원본의 겹친 삼각형 그림");
  const base = toHundredths(svg.match(/class="source62-overlap-base-label"[^>]*>([\d.]+)cm/)?.[1]);
  let overlap100;
  if (level === 0) {
    overlap100 = toHundredths(statement.match(/겹친 부분의 넓이는 ([\d.]+)cm²/)?.[1]);
  } else if (level === 1) {
    const a = toHundredths(statement.match(/삼각형 ㄱㄴㄷ의 넓이는 ([\d.]+)cm²/)?.[1]);
    const b = toHundredths(statement.match(/삼각형 ㄹㅁㅂ의 넓이는 ([\d.]+)cm²/)?.[1]);
    const union = toHundredths(statement.match(/전체 넓이는 ([\d.]+)cm²/)?.[1]);
    overlap100 = a + b - union;
  } else {
    const sum = toHundredths(statement.match(/두 삼각형의 넓이의 합은 ([\d.]+)cm²/)?.[1]);
    const outside = toHundredths(statement.match(/겹치지 않은 두 부분의 넓이의 합은 ([\d.]+)cm²/)?.[1]);
    overlap100 = (sum - outside) / 2;
  }
  assert(base > 0 && Number.isInteger(overlap100) && overlap100 > 0, "표시된 조건으로 겹친 넓이가 결정됨");
  const candidates = [];
  for (let h = 1; h <= 30000; h += 1) if (base * h === 2 * overlap100 * 1000) candidates.push(h);
  assert.equal(candidates.length, 1, "표시된 조건에서 높이 후보 하나");
  assert.equal(generated.answer, `${Number((candidates[0] / 1000).toFixed(3))}cm`, "독립 계산과 표시 답 일치");
  const points = pointMap(svg);
  assert.deepEqual(Object.keys(points).sort(), ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"].sort(), "그림의 여덟 점");
  assert(points["ㄱ"][1] === points["ㄹ"][1] && points["ㄴ"][1] === points["ㅁ"][1] && points["ㅁ"][1] === points["ㄷ"][1] && points["ㄷ"][1] === points["ㅂ"][1], "위 꼭짓점과 아랫변 위치");
  assert(points["ㅁ"][0] < points["ㅇ"][0] && points["ㅇ"][0] < points["ㄷ"][0] && points["ㅅ"][0] === points["ㅇ"][0], "밑변 안에 수선의 발이 있음");
  const twiceLeft = (points["ㄷ"][0] - points["ㄴ"][0]) * (points["ㄴ"][1] - points["ㄱ"][1]);
  const twiceRight = (points["ㅂ"][0] - points["ㅁ"][0]) * (points["ㅁ"][1] - points["ㄹ"][1]);
  const twiceOverlap = (points["ㄷ"][0] - points["ㅁ"][0]) * (points["ㅇ"][1] - points["ㅅ"][1]);
  const [left100, right100, union100, base100] = svg.match(/data-model="([\d,]+)"/)?.[1].split(",").map(Number) || [];
  assert.equal(base100, base);
  assert(Math.abs(twiceLeft / twiceOverlap - left100 / overlap100) < 0.001, "왼쪽 삼각형 그림 넓이 비");
  assert(Math.abs(twiceRight / twiceOverlap - right100 / overlap100) < 0.001, "오른쪽 삼각형 그림 넓이 비");
  assert.equal(left100 + right100 - union100, overlap100, "그림 모델의 공통 부분 넓이");
  assert(!svg.includes(generated.answer), "문제 그림에 정답 누설 없음");
  assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), "풀이와 답 그림 일치");
  return overlap100;
}

let checked = 0;
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(candidateType, 0, difficulty, seed, seed % 3);
  assert(generated && generated.sourceItemId === id && generated.verifiedVariantCount === 3);
  const overlap100 = independent(generated, difficulty + 1);
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.equal(overlap100, 1740);
    assert.equal(generated.answer, "10.875cm");
  }
  checked += 1;
}
console.log(`6-2 Mission 4 잠금 후보 ${checked}회: 표시 조건·답 후보·그림 넓이 비 검산 통과`);
