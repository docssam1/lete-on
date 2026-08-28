const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../shared/program-contract.js");
const catalog = require("../shared/program-catalog.js");

test("the catalog passes the common contract", function () {
  assert.equal(contract.validateCatalog(catalog), true);
});

test("US core covers every target K-12 grade without asserting a universal high-school course sequence", function () {
  const core = catalog.programs.find(function (program) { return program.id === "us-core-k8"; });
  assert.deepEqual(core.grades, catalog.targetGrades);
  assert.deepEqual(catalog.targetGrades, ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(core.standardsMode, "ccss-id-required-per-skill");
  assert.equal(core.highSchoolSequence.state, "school-configured");
  assert.equal(core.highSchoolSequence.claimsUniversalGradeToCourseMapping, false);
  assert.equal(core.highSchoolSequence.gradeToCourseMapping, null);
  assert.deepEqual(core.highSchoolSequence.conceptualCategories, [
    "number-and-quantity", "algebra", "functions", "modeling", "geometry", "statistics-and-probability"
  ]);
});

test("student and teacher resources stay separated", function () {
  const overlap = catalog.resourceRules.student.filter(function (type) {
    return catalog.resourceRules.teacher.includes(type);
  });
  assert.deepEqual(overlap, []);
  assert.ok(catalog.resourceRules.student.includes("concept-workbook"));
  assert.ok(catalog.resourceRules.teacher.includes("answer-key"));
});

test("every program has Korean and English labels", function () {
  catalog.programs.forEach(function (program) {
    assert.doesNotThrow(function () { contract.validateLocalizedText(program.title, program.id); });
  });
});

test("promotion policy cannot claim a national official cut", function () {
  assert.equal(catalog.promotionPolicies[0].claimsNationalOfficialCut, false);
  assert.equal(catalog.promotionPolicies[0].teacherReviewRequired, true);
  assert.equal(catalog.promotionPolicies[0].cutScores, null);
});

test("AMC official eligibility and GFIELD prep band are distinguished", function () {
  const amc8 = catalog.programs.find(function (program) { return program.id === "amc-8"; });
  const amc10 = catalog.programs.find(function (program) { return program.id === "amc-10"; });
  const amc12 = catalog.programs.find(function (program) { return program.id === "amc-12"; });
  assert.match(amc8.officialEligibility, /Grade 8 or below/);
  assert.match(amc10.officialEligibility, /Grade 10 or below/);
  assert.match(amc12.officialEligibility, /Grade 12 or below/);
  assert.equal(amc8.preparationBandNotOfficial, true);
  assert.equal(amc10.preparationBandNotOfficial, true);
  assert.equal(amc12.preparationBandNotOfficial, true);
  assert.deepEqual(amc8.grades, [6, 7, 8]);
  assert.deepEqual(amc10.grades, [9, 10]);
  assert.deepEqual(amc12.grades, [11, 12]);
  assert.deepEqual(amc8.competitionSequence, { previousProgramId: null, nextProgramId: "amc-10" });
  assert.deepEqual(amc10.competitionSequence, { previousProgramId: "amc-8", nextProgramId: "amc-12" });
  assert.deepEqual(amc12.competitionSequence, { previousProgramId: "amc-10", nextProgramId: null });
  [amc8, amc10, amc12].forEach(function (program) {
    assert.equal(Object.hasOwn(program, "contentAvailability"), false);
  });
});

test("SASMO K2-12 eligibility is K2-specific rather than generic K", function () {
  const sasmo = catalog.programs.find(function (program) { return program.id === "sasmo-k2-8"; });
  assert.equal(sasmo.grades.includes("K"), false);
  assert.equal(sasmo.officialGradeKeys[0], "K2");
  assert.deepEqual(sasmo.officialGradeKeys, ["K2", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(sasmo.kindergartenEligibility, "K2-only");
});

test("Singapore primary source points to the current October 2025 revision", function () {
  const singapore = catalog.programs.find(function (program) { return program.id === "singapore-mastery"; });
  assert.match(singapore.sources[0].url, /updated-october-2025\.pdf$/);
  assert.match(singapore.sources[0].documentRevision, /applicable to Primary 6 from 2026/);
  assert.deepEqual(singapore.implementedGrades, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(singapore.plannedLockedGrades, [9, 10, 11, 12]);
});

test("the boarding catalog extends its competition pathway through AMC 8 to AMC 10 to AMC 12", function () {
  assert.deepEqual(catalog.programs.filter(function (program) {
    return ["amc-8", "amc-10", "amc-12"].includes(program.id);
  }).map(function (program) { return program.id; }), ["amc-8", "amc-10", "amc-12"]);
  catalog.programs.forEach(function (program) {
    program.grades.forEach(function (grade) {
      if (grade !== "K") assert.ok(grade <= 12, `${program.id} must stay within K-12`);
    });
  });
});

test("unlicensed or unreviewed source content cannot publish", function () {
  const base = {
    course: "amc-8",
    unit: "counting",
    skill: "systematic-counting",
    level: "challenge",
    testType: "practice",
    resourceType: "guided-practice",
    audience: "student",
    title: { ko: "경우를 빠짐없이 세기", en: "Systematic counting" },
    publicationState: "locked",
    sourceRights: { mode: "permission_required", provenance: "MAA AMC", reviewed: false }
  };
  assert.equal(contract.canPublishContent(base), false);
  assert.throws(function () {
    contract.validateContentRecord(Object.assign({}, base, { publicationState: "published" }));
  }, /cannot be published/);
});

test("owned bilingual content can publish after review", function () {
  const record = {
    course: "us-core-k8",
    unit: "grade-5-fractions",
    skill: "add-unlike-fractions",
    level: "core",
    testType: "practice",
    resourceType: "concept-workbook",
    audience: "student",
    title: { ko: "분모가 다른 분수의 덧셈", en: "Adding fractions with unlike denominators" },
    publicationState: "published",
    sourceRights: { mode: "owned_original", provenance: "GFIELD authored", reviewed: true }
  };
  assert.equal(contract.validateContentRecord(record), true);
  assert.equal(contract.canPublishContent(record), true);
});
