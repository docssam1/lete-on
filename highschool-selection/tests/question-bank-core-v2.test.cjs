const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");

test("neutral ids are deterministic, scoped, and do not reveal the registry key", () => {
  const first = core.createNeutralId("question", "SH", "registry:item-001");
  const repeated = core.createNeutralId("question", "SH", "registry:item-001");
  const different = core.createNeutralId("question", "SH", "registry:item-002");

  assert.equal(first, repeated);
  assert.notEqual(first, different);
  assert.equal(first.includes("registry"), false);
  assert.deepEqual(core.parseNeutralId(first), {
    entity: "question",
    mode: "SH",
    digest: first.slice(-16)
  });
  assert.equal(core.isNeutralId(first, "question", "SH"), true);
  assert.throws(() => core.createNeutralId("question", "SH", "folder/item"), /opaque registry key/);
});

test("only public mode codes and writer T are defined", () => {
  assert.deepEqual(core.PROGRAM_MODES, ["SH", "DP", "WM", "ED", "DG", "SM"]);
  assert.equal(core.WRITER, "T");
  assert.throws(() => core.createNeutralId("exam", "", "registry:exam-001"), /mode is not allowed/);
});

test("curriculum paths preserve the complete grade to detail hierarchy", () => {
  const path = core.createCurriculumPath({
    grade: "g10",
    major: "m01",
    minor: "s02",
    detail: "d03"
  });

  assert.equal(path.key, "G10/M01/S02/D03");
  assert.deepEqual(core.validateCurriculumPath(path), []);
  assert.deepEqual(core.validateCurriculumPath({ grade: "G10", detail: "D03" }), [
    "curriculum.major.missing",
    "curriculum.minor.missing",
    "curriculum.detail.orphaned"
  ]);
  const hierarchy = core.createCurriculumHierarchy([
    path,
    { grade: "G10", major: "M01", minor: "S02", detail: "D04" }
  ]);
  assert.deepEqual(hierarchy.grades[0].majors[0].minors[0].details.map(node => node.code), ["D03", "D04"]);
});

test("provenance, answer verification, and variant records expose status only", () => {
  const sourceId = core.createNeutralId("source", "DP", "registry:source-001");
  const familyId = core.createNeutralId("question", "DP", "registry:family-001");
  const provenance = core.createProvenanceRecord({
    mode: "DP",
    role: "actual",
    status: "audited",
    referenceId: sourceId
  });
  const verification = core.createAnswerVerification({ status: "verified", reviewCount: 2 });
  const variant = core.createVariantRecord({ mode: "DP", familyId, band: "raised" });

  assert.deepEqual(provenance, { role: "actual", status: "audited", referenceId: sourceId });
  assert.deepEqual(verification, { status: "verified", reviewCount: 2 });
  assert.deepEqual(variant, { familyId, band: "raised" });
  assert.equal(Object.hasOwn(verification, "answer"), false);
  assert.throws(() => core.createAnswerVerification({ status: "verified", reviewCount: 0 }), /at least one review/);
});

test("status transitions reject skipped or unknown workflow states", () => {
  assert.equal(core.canTransition("provenance", "found", "audited"), true);
  assert.equal(core.canTransition("provenance", "missing", "cleared"), false);
  assert.equal(core.canTransition("answerVerification", "pending", "verified"), true);
  assert.equal(core.canTransition("answerVerification", "missing", "verified"), false);
  assert.equal(core.canTransition("unknown", "pending", "verified"), false);
});

test("a variant set contains one unique question per difficulty band", () => {
  const familyId = core.createNeutralId("question", "WM", "registry:variant-family");
  const set = core.createVariantSet({
    mode: "WM",
    familyId,
    lowered: core.createNeutralId("question", "WM", "registry:variant-lowered"),
    standard: core.createNeutralId("question", "WM", "registry:variant-standard"),
    raised: core.createNeutralId("question", "WM", "registry:variant-raised")
  });
  assert.equal(set.lowered.band, "lowered");
  assert.equal(set.standard.band, "standard");
  assert.equal(set.raised.band, "raised");
});
