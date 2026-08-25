const test = require("node:test");
const assert = require("node:assert/strict");

delete global.HIGHSELECT_CUTLINE_POLICIES;
delete global.HIGHSELECT_CATALOG;
require("../data/catalog.js");
require("../data/cutline-policies.js");
const data = global.HIGHSELECT_CUTLINE_POLICIES;

test("every public cutoff is scoped to academy code, branch, course, round, and curriculum", () => {
  data.referenceCutlines.forEach(policy => {
    assert.match(policy.id, /^CL-/);
    assert.ok(policy.programId);
    assert.ok(policy.branchId);
    assert.ok(policy.courseId);
    assert.ok(policy.roundId);
    assert.equal(policy.curriculumVersion, "2022-revised");
    assert.equal(policy.evidenceStatus, "verified");
    assert.equal(policy.usage, "reference-only");
  });
});

test("reference cutoffs never grade an internal mock without explicit user approval", () => {
  data.examAssignments.forEach(assignment => {
    assert.equal(assignment.policyId, null);
    assert.equal(data.resolveAssignedPolicy(assignment.examId), null);
  });
});

test("every visible exam has an explicit no-inference cutline assignment", () => {
  const examIds = global.HIGHSELECT_CATALOG.exams.filter(exam => exam.visible).map(exam => exam.id);
  const assignmentIds = data.examAssignments.map(assignment => assignment.examId);
  assert.deepEqual(assignmentIds, examIds);
});

test("unknown academy cutoffs remain absent instead of inferred from failed scores", () => {
  const programIds = new Set(data.referenceCutlines.map(policy => policy.programId));
  assert.equal(programIds.has("ED"), false);
  assert.equal(programIds.has("DG"), false);
  assert.equal(programIds.has("SM"), false);
});
