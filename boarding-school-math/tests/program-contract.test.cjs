const test = require("node:test");
const assert = require("node:assert/strict");
const contract = require("../shared/program-contract.js");
const catalog = require("../shared/program-catalog.js");

test("the catalog passes the common contract", function () {
  assert.equal(contract.validateCatalog(catalog), true);
});

test("US core covers every target K-8 grade", function () {
  const core = catalog.programs.find(function (program) { return program.id === "us-core-k8"; });
  assert.deepEqual(core.grades, catalog.targetGrades);
  assert.equal(core.standardsMode, "ccss-id-required-per-skill");
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
  assert.match(amc8.officialEligibility, /Grade 8 or below/);
  assert.equal(amc8.preparationBandNotOfficial, true);
  assert.deepEqual(amc8.grades, [6, 7, 8]);
});

test("the boarding catalog contains no post-grade-8 competition pathway", function () {
  assert.equal(catalog.programs.some(function (program) {
    return program.id === "amc-10-bridge" || program.id === "amc-12-future";
  }), false);
  catalog.programs.forEach(function (program) {
    program.grades.forEach(function (grade) {
      if (grade !== "K") assert.ok(grade <= 8, `${program.id} must stay within K-8`);
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
