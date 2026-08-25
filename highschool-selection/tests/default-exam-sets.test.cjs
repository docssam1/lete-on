const test = require("node:test");
const assert = require("node:assert/strict");

const registry = require("../data/default-exam-sets.js");

test("every standard uses the four-round baseline and complete guide contract", () => {
  assert.equal(registry.baselineRoundPlan.length, 4);
  assert.deepEqual(registry.baselineRoundPlan.map(item => item.round), [1, 2, 3, 4]);
  assert.deepEqual(registry.requiredGuideSections, [
    "target-and-structure",
    "scope-and-item-style",
    "cutline-and-section-minimum",
    "preparation-sequence",
    "exam-day-strategy",
    "after-admission-first-four-weeks"
  ]);
  for (const standard of registry.standards) assert.equal(standard.roundPlan, registry.baselineRoundPlan);
});

test("Won Math middle 2-1 is the only currently complete four-set standard", () => {
  const wm = registry.getStandard("WM-M21-BASIC-ENTRY-2026-07");
  assert.equal(wm.availableRoundCount, 4);
  assert.equal(wm.guideStatus, "ready");
  assert.equal(wm.aftercareGuideStatus, "ready");
  assert.equal(wm.sections.reduce((sum, section) => sum + section.itemCount, 0), 40);
  assert.equal(wm.sections.reduce((sum, section) => sum + section.minutes, 0), 100);
});

test("unknown cutlines stay null instead of being guessed", () => {
  for (const id of ["SH-HIGH-SELECTION-R01", "DP-M22-TRANSFER-2024", "DP-CM1-ENTRY-2024"]) {
    assert.equal(registry.getStandard(id).cutline, null);
  }
});

test("all six academy modes have at least one explicit default-set standard", () => {
  assert.deepEqual(
    [...new Set(registry.standards.map(item => item.programCode))].sort(),
    ["DG", "DP", "ED", "SH", "SM", "WM"]
  );
});
