const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/review-only/wm-middle21-basic-entry-r01-blueprint.js");

test("WM middle2-1 entry blueprint uses the corrected 20+20 structure", () => {
  assert.equal(data.blueprint.questionCount, 40);
  assert.deepEqual(data.blueprint.sectionPlan.map(section => section.questionCount), [20, 20]);
  assert.deepEqual(data.blueprint.sectionPlan.map(section => section.minutes), [50, 50]);
  assert.equal(data.blueprint.scheduledWindowMinutes, 120);
  assert.equal(data.items.filter(item => item.sectionId === "ALG").length, 20);
  assert.equal(data.items.filter(item => item.sectionId === "GEO").length, 20);
});

test("WM middle2-1 entry excludes statistics and remains locked without a current cutline", () => {
  assert.deepEqual(Array.from(data.blueprint.excludedUnits), ["중1 통계"]);
  assert.equal(data.items.some(item => /통계/.test(item.majorUnit + item.minorUnit + item.typeLabel)), false);
  assert.equal(data.blueprint.currentCutline, null);
  assert.equal(data.blueprint.cutlineStatus, "confirmation-required");
  assert.equal(data.blueprint.scorecardStatus, "confirmation-required");
  assert.equal(data.blueprint.releaseStatus, "blocked");
  assert.equal(data.items.every(item => item.answerStatus === "not-authored" && item.reviewStatus === "locked"), true);
});

test("A-grade and discontinued grade1 references are candidate pools, not released originals", () => {
  assert.deepEqual(data.sourcePools.map(pool => pool.id), ["HS_G7", "DP_G7", "AG_G7_OOP", "HX_G7_OOP", "SM_G7_OOP"]);
  assert.equal(data.sourcePools.every(pool => pool.status === "private-candidate-locked"), true);
  assert.equal(data.items.every(item => !Object.hasOwn(item, "prompt") && !Object.hasOwn(item, "answer")), true);
});

test("the 2022-revised blueprint covers every numbered slot exactly once", () => {
  assert.equal(data.blueprint.curriculumVersion, "2022-revised");
  assert.deepEqual(data.items.map(item => item.number), Array.from({ length: 40 }, (_, index) => index + 1));
  assert.equal(new Set(data.items.map(item => item.id)).size, 40);
});
