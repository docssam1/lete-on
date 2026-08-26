const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/review-only/wm-cm1-basic-entry-r01-inventory.js");

test("WM common-math entry keeps the current 25+25 structure without pretending the missing geometry source exists", () => {
  assert.equal(data.inventory.questionCount, 50);
  assert.equal(data.inventory.items.filter(item => item.sectionId === "ALG").length, 25);
  assert.equal(data.inventory.items.filter(item => item.sectionId === "GEO").length, 25);
  assert.equal(data.inventory.items.slice(0, 25).every(item => item.sourceStatus === "audited_internal_variant"), true);
  assert.equal(data.inventory.items.slice(25).every(item => item.sourceStatus === "missing_exact_25_item_source"), true);
  assert.equal(data.validateInventory(data.inventory).length, 0);
});

test("WM reference cutline stays non-operational and every item remains locked", () => {
  assert.equal(data.inventory.referenceDecision.status, "reference_only");
  assert.deepEqual(data.inventory.referenceDecision.sectionMinimums, { ALG: 17, GEO: 15 });
  assert.equal(data.inventory.items.every(item => item.releaseStatus === "locked"), true);
  const gate = data.evaluateReviewGate(data.inventory);
  assert.equal(gate.canAssemble, false);
  assert.equal(gate.canRelease, false);
  assert.equal(gate.issues.includes("review.geometry_source_missing"), true);
  assert.equal(gate.issues.includes("review.answer_audit_pending"), true);
});

test("WM public review inventory contains no originals, answers, or private paths", () => {
  const serialized = JSON.stringify(data.inventory);
  ["questionText", "prompt", "answerKey", "correctAnswer", "sourcePath", "G:\\", ".hwp", "file://"].forEach(term => {
    assert.equal(serialized.includes(term), false, term);
  });
});
