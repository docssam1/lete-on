const test = require("node:test");
const assert = require("node:assert/strict");
const sasmo = require("../competition/sasmo-program-architecture.js");

test("SASMO architecture covers K2 and every grade from G1 through G12", function () {
  assert.deepEqual(sasmo.LEVEL_IDS, ["K2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"]);
  assert.deepEqual(sasmo.architecture.levels.map(function (level) { return level.id; }), sasmo.LEVEL_IDS);
  assert.deepEqual(sasmo.architecture.gradeBands.map(function (band) { return band.id; }), ["K2", "G1-2", "G3-4", "G5-6", "G7-8", "G9-10", "G11-12"]);
  sasmo.LEVEL_IDS.forEach(function (levelId) {
    assert.ok(sasmo.getLevel(levelId));
    assert.ok(sasmo.getGradeBand(levelId));
    assert.ok(sasmo.getOfficialFormat(levelId));
  });
  assert.equal(sasmo.getLevel("12").id, "G12");
  assert.equal(sasmo.getLevel("g1").id, "G1");
  assert.equal(sasmo.normalizeLevelId("K"), null);
});

test("SASMO architecture keeps the six readiness axes and complete learner workflow", function () {
  assert.deepEqual(sasmo.AXIS_IDS, [
    "number-operations",
    "patterns-algebra",
    "geometry-spatial",
    "combinatorics-logic",
    "data-probability",
    "problem-solving-strategies"
  ]);
  assert.deepEqual(sasmo.architecture.axes.map(function (axis) { return axis.id; }), sasmo.AXIS_IDS);
  assert.deepEqual(sasmo.WORKFLOW_IDS, ["level", "goal", "diagnostic", "prescription", "practice", "timed-check", "review"]);
  assert.deepEqual(sasmo.architecture.workflow.map(function (step) { return step.id; }), sasmo.WORKFLOW_IDS);
  assert.deepEqual(sasmo.GOAL_IDS, ["first-attempt", "skill-growth", "award-target", "amc-bridge"]);
});

test("SASMO architecture exposes the required learning modes and role boundaries", function () {
  assert.deepEqual(sasmo.MODE_IDS, [
    "placement_screener",
    "skill_diagnostic",
    "guided_practice",
    "timed_mini_test",
    "full_mock",
    "error_review",
    "retention_check"
  ]);
  assert.deepEqual(sasmo.ROLE_IDS, ["student", "teacher"]);
  assert.equal(sasmo.architecture.modes.find(function (mode) { return mode.id === "full_mock"; }).purpose.includes("official paper"), true);
  assert.equal(sasmo.architecture.roles.find(function (role) { return role.id === "teacher"; }).permissions.includes("assign-plan"), true);
  assert.equal(sasmo.architecture.roles.length, 2);
  sasmo.architecture.modes.forEach(function (mode) {
    assert.equal(mode.audience.every(function (roleId) { return sasmo.ROLE_IDS.includes(roleId); }), true);
  });
});

test("SASMO architecture keeps source, rights, and verification states explicit", function () {
  assert.deepEqual(sasmo.SOURCE_STATUS_IDS, [
    "gfield_original",
    "official_public_link_only",
    "official_private_reference",
    "third_party_index_only",
    "not_publishable"
  ]);
  assert.deepEqual(sasmo.RIGHTS_STATUS_IDS, [
    "gfield_owned",
    "permission_required",
    "metadata_and_links_only",
    "private_reference_only",
    "not_cleared"
  ]);
  assert.deepEqual(sasmo.VERIFICATION_STATE_IDS, [
    "draft",
    "source_verified",
    "content_validated",
    "rights_reviewed",
    "release_approved",
    "locked"
  ]);
  assert.equal(sasmo.architecture.sources.find(function (source) { return source.id === "sasmo-third-party-index"; }).rightsStatus, "not_cleared");
  assert.equal(sasmo.architecture.sources.find(function (source) { return source.id === "sasmo-official-historical-reference"; }).rightsStatus, "private_reference_only");
});

test("SASMO current official format is separate from GFIELD curriculum and third-party history", function () {
  const k2 = sasmo.getOfficialFormat("K2");
  const g1 = sasmo.getOfficialFormat("G1");
  const g12 = sasmo.getOfficialFormat("G12");
  assert.deepEqual([k2.questionCount, k2.durationMinutes], [15, 60]);
  assert.deepEqual([g1.questionCount, g1.durationMinutes], [25, 90]);
  assert.equal(g12.id, "current-g1-g12");
  assert.equal(sasmo.lastVerified, "2026-08-28");
  assert.equal(sasmo.architecture.officialEligibilityAndFormat.currentFormatOnly, true);
  assert.equal(sasmo.architecture.gfieldAuthoredCurriculum.isOfficialCurriculum, false);
  assert.equal(sasmo.architecture.historicalThirdPartyArchive.isOfficialCurrentFormat, false);
  sasmo.architecture.sources.filter(function (source) { return source.sourceStatus === "official_public_link_only"; }).forEach(function (source) {
    assert.match(source.url, /^https:\/\/sasmo\.simcc\.org\//);
    assert.equal(source.lastVerified, "2026-08-28");
  });
});

test("SASMO route and architecture validators reject invalid handoffs and preserve a valid route", function () {
  const valid = sasmo.validateStudentRoute({ levelId: "g8", goalId: "award-target", modeId: "timed_mini_test", roleId: "student" });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.route, {
    levelId: "G8",
    goalId: "award-target",
    modeId: "timed_mini_test",
    roleId: "student",
    gradeBandId: "G7-8",
    officialFormatId: "current-g1-g12"
  });
  const invalid = sasmo.validateStudentRoute({ levelId: "G13", goalId: "unknown", modeId: "nope", roleId: "guardian" });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 4);
  assert.deepEqual(sasmo.validateArchitecture(), { valid: true, errors: [] });
  assert.throws(function () {
    sasmo.assertArchitecture({ levels: [] });
  }, /Invalid SASMO program architecture/);
});

test("SASMO public architecture has no question content or PDF delivery URLs and exports are frozen", function () {
  const safety = sasmo.validatePublicSafety();
  assert.deepEqual(safety, { valid: true, errors: [] });
  const text = JSON.stringify(sasmo.architecture);
  assert.doesNotMatch(text, /https?:[^\"\s]+\.pdf(?:[\"\s]|$)/i);
  assert.doesNotMatch(text, /\b(questionText|questionContent|officialProblem|answerKey|workedSolution)\b/i);
  assert.equal(Object.isFrozen(sasmo), true);
  assert.equal(Object.isFrozen(sasmo.architecture), true);
  assert.equal(Object.isFrozen(sasmo.architecture.sources[0]), true);
  assert.equal(Object.isFrozen(sasmo.architecture.axes[0]), true);
});
