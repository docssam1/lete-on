const test = require("node:test");
const assert = require("node:assert/strict");

const inventory = require("../data/question-bank-readiness.js");

test("candidate counts are never presented as reusable counts", () => {
  const m1 = inventory.getGradeInventory("M1");
  const m2 = inventory.getGradeInventory("M2");
  assert.equal(m1.indexedCandidates, 1656);
  assert.equal(m1.uniqueReusablePrivateDrafts, 160);
  assert.equal(m2.indexedCandidates, 2356);
  assert.equal(m2.uniqueReusablePrivateDrafts, 0);
  assert.ok(m1.indexedCandidates > m1.uniqueReusablePrivateDrafts);
});

test("owner-approved inventory remains zero before user confirmation", () => {
  for (const grade of inventory.gradeInventory) assert.equal(grade.ownerApproved, 0);
});

test("cumulative exams remain outside per-grade totals", () => {
  assert.deepEqual(
    inventory.cumulativeSourceBackedExams.map(item => item.itemCount),
    [40, 30, 30]
  );
  assert.ok(inventory.cumulativeSourceBackedExams.every(item => item.allocation === "학년별 분리 전"));
});
