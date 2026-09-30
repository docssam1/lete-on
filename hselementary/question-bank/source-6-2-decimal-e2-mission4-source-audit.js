"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const id = "6-2-u2-e2-mission-4";
const raw = require("./source-inventory/6-2-source-items.json").items.find(item => item.sourceItemId === id);
const review = require("./source-inventory/6-2-u2-e2-mission4-source-review.json");
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);

assert(raw && type && review.sourceItemId === id);
assert.equal(raw.pdfPage, 19);
assert.equal(raw.printedPage, 21);
assert.equal(raw.answerContract, "union-overlap-triangle-height");
assert.equal(raw.sourceVerified, true);
assert.equal(review.officialAnswerEvidence, "not-available-for-this-item");
assert.equal(type.reviewLocked, true);
assert.equal(review.publicReleaseStatus, "locked");
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1, 0), null, "공식 답과 그림 검수 전에는 출제되지 않음");

const areas100 = review.sourceModel.givenAreasCm2.map(value => Math.round(value * 100));
const union100 = Math.round(review.sourceModel.unionAreaCm2 * 100);
const base100 = Math.round(review.sourceModel.sharedBaseCm * 100);
const overlap100 = areas100[0] + areas100[1] - union100;
const candidates = [];
for (let height1000 = 1; height1000 <= 30000; height1000 += 1) {
  if (base100 * height1000 === 2 * overlap100 * 1000) candidates.push(height1000);
}
assert.equal(overlap100, 1740, "겹친 넓이");
assert.deepEqual(candidates, [10875], "보이는 조건에서 높이 후보는 하나");
assert.equal(candidates[0] / 1000, review.independentMath.heightCm);
assert.equal(review.independentMath.candidateCount, 1);
console.log("6-2 Mission 4 원본 조건·독립 계산·출제 잠금 검사 통과");
