"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-e2-geometry.js");

const id = "6-2-u2-e2-mission-6";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === id);
const review = require("./source-inventory/6-2-u2-e2-mission6-source-review.json");
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(raw && review && type);
assert.equal(raw.pdfPage, 19);
assert.equal(raw.printedPage, 21);
assert.equal(raw.answerContract, "four-rectangle-missing-area");
assert.equal(review.officialAnswerEvidence, "not-available-for-this-item");
assert.equal(review.publicReleaseStatus, "ready");
assert(!type.reviewLocked && type.generatorKey);
assert.equal(review.answerEvidence.publisherAnswerVerified, false);
assert.equal(review.answerEvidence.handwritingAgreesWithCalculation, true);
assert.equal(window.HSE_GENERATORS.generate({ ...type, reviewLocked: true }, 0, 0, 1, 0), null, "잠금 상태에서는 출제되지 않음");

const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE2Mission6" };
const asHundredths = value => Math.round(Number(value) * 100);
let checked = 0;
for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
  const generated = window.HSE_GENERATORS.generate(candidateType, 0, difficulty, seed, seed % 3);
  assert(generated && generated.sourceItemId === id && generated.verifiedVariantCount === 3);
  const svg = generated.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  assert(svg && svg.includes('data-geometry-kind="four-adjacent-rectangles"'));
  const labels = [...svg.matchAll(/<text class="source62-four-rect-label(?: is-target)?" x="([\d.]+)" y="([\d.]+)" dominant-baseline="middle"[^>]*>([^<]+)<tspan/g)];
  assert.equal(labels.length, 4, `네 영역이 모두 표시됨: difficulty=${difficulty} seed=${seed} ${svg}`);
  assert.equal(labels[0][3], "㉠", "문제 그림은 빈 넓이로 표시됨");
  const [topRight100, bottomLeft100] = labels.slice(1, 3).map(match => asHundredths(match[3]));
  let bottomRight100;
  if (difficulty === 1) {
    assert.equal(labels[3][3], "□", "어려움은 아랫줄 합에서 숨은 넓이를 먼저 구함");
    const total = generated.prompt.split("<svg")[0].match(/아랫줄 두 직사각형의 넓이의 합은 ([\d.]+)cm²/);
    assert(total, "숨은 넓이를 결정하는 합 조건");
    bottomRight100 = asHundredths(total[1]) - bottomLeft100;
  } else {
    bottomRight100 = asHundredths(labels[3][3]);
  }
  assert(bottomRight100 > 0);
  const candidates = [];
  for (let target100 = 1; target100 <= 10000; target100 += 1) {
    if (target100 * bottomRight100 === topRight100 * bottomLeft100) candidates.push(target100);
  }
  assert.equal(candidates.length, 1, "그림에 표시된 넓이에서 답은 하나");
  assert.equal(generated.answer, `${Number((candidates[0] / 100).toFixed(2))}cm²`, "별도 전수 계산과 정답 일치");
  const splitX = Number(svg.match(/<line data-layout-role="column-divider"[^>]* x1="([\d.]+)"/)?.[1]);
  const splitY = Number(svg.match(/<line data-layout-role="row-divider"[^>]* y1="([\d.]+)"/)?.[1]);
  const outline = svg.match(/<rect class="source62-four-rect-outline"[^>]* x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/);
  assert(outline, "모델에서 계산한 바깥 테두리");
  const [left, top, width, height] = outline.slice(1).map(Number);
  assert(splitX > left && splitX < left + width && splitY > top && splitY < top + height, "그림의 네 영역이 유효함");
  const geometryTopRatio = (splitY - top) / (top + height - splitY);
  const geometryLeftRatio = (splitX - left) / (left + width - splitX);
  assert(Math.abs(geometryTopRatio - topRight100 / bottomRight100) < 0.001, "그림의 높이 비율과 표시 넓이 일치");
  assert(Math.abs(geometryLeftRatio - bottomLeft100 / bottomRight100) < 0.001, "그림의 너비 비율과 표시 넓이 일치");
  assert(!generated.prompt.includes(generated.answer), "문제에 답이 드러나지 않음");
  assert(generated.solution.replace(/<[^>]*>/g, "").includes(generated.answer), "풀이의 정답 일치");
  const solvedSvg = generated.answerVisual.match(/<svg[\s\S]*?<\/svg>/)?.[0];
  const solvedTarget = [...(solvedSvg || "").matchAll(/<text class="source62-four-rect-label is-target"[^>]*>([^<]+)<tspan/g)][0]?.[1];
  assert.equal(asHundredths(solvedTarget), candidates[0], "정답 그림의 ㉠ 넓이 일치");
  if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
    assert.deepEqual([topRight100, bottomLeft100, bottomRight100], [600, 925, 555], "원본 수치");
    assert.equal(generated.answer, "10cm²", "원본 독립 계산");
  }
  checked += 1;
}
assert.equal(checked, 360);
console.log(`6-2 Mission 6 ${checked}회: 원본 구조·추론 조건·답 유일성·그림 비율 통과`);
