const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/diagnostic-engine.js");
const projections = require("../assessment/report-projections.js");

const domains = ["G6-RP", "G6-NS", "G6-EE", "G6-G", "G6-SP"];
function blueprint() {
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade6-report-v1",
    programId: "us-core-k8",
    targetGrade: 6,
    version: 1,
    purpose: "course-placement",
    items: Array.from({ length: 40 }, function (_, index) {
      const lineage = [
        { unitId: "ccss-6-rp-a", clusterId: "6.RP.A", standardRange: "6.RP.A.1-3" },
        { unitId: "ccss-6-ns-a", clusterId: "6.NS.A", standardRange: "6.NS.A.1" },
        { unitId: "ccss-6-ee-a", clusterId: "6.EE.A", standardRange: "6.EE.A.1-4" },
        { unitId: "ccss-6-g-a", clusterId: "6.G.A", standardRange: "6.G.A.1-4" },
        { unitId: "ccss-6-sp-a", clusterId: "6.SP.A", standardRange: "6.SP.A.1-3" }
      ][index % 5];
      return {
        itemId: `qst-bnk-${String(index + 1).padStart(16, "0")}`,
        unitId: lineage.unitId,
        clusterId: lineage.clusterId,
        standardRange: lineage.standardRange,
        skillId: `skill:us-core-k8:${["6-rp-a", "6-ns-a", "6-ee-a", "6-g-a", "6-sp-a"][index % 5]}:anchor`,
        domainId: domains[index % domains.length],
        maxPoints: 1,
        responseType: index % 2 ? "numeric" : "multiple-choice",
        difficulty: ["foundation", "core", "advanced"][index % 3],
        scoringMode: "automatic",
        reviewState: "approved"
      };
    })
  };
}
function policy() {
  return {
    id: "pol-bdg-report-2026",
    version: 1,
    owner: "GFIELD Campus A",
    schoolId: "sch-bdg-0123456789abcdef",
    programId: "us-core-k8",
    targetGrade: 6,
    effectiveFrom: "2026-08-26",
    claimsNationalOfficialCut: false,
    teacherReviewRequired: true,
    bands: [{ id: "foundation", minPercent: 0 }, { id: "proficient", minPercent: 75 }],
    promotionReview: { minimumBandId: "proficient", minDomainPercent: 65, maxPrerequisiteGaps: 0 },
    evidenceRequired: ["diagnostic", "unit-mastery", "retention-check", "teacher-review"]
  };
}
function attempt(source) {
  return {
    id: "att-bdg-0123456789abcdef",
    blueprintId: source.id,
    blueprintVersion: source.version,
    learnerId: "lrm-bdg-0123456789abcdef",
    schoolId: "sch-bdg-0123456789abcdef",
    policyId: "pol-bdg-report-2026",
    policyVersion: 1,
    completedAt: "2026-08-26T10:00:00Z",
    itemResults: source.items.map(function (item, index) {
      return index % 9 === 0
        ? { itemId: item.itemId, awardedPoints: 0, errorType: "prerequisite-gap", scoringReview: null }
        : index % 7 === 0
        ? { itemId: item.itemId, awardedPoints: 0, errorType: "calculation-error", scoringReview: null }
        : { itemId: item.itemId, awardedPoints: 1, errorType: null, scoringReview: null };
    })
  };
}

test("student projection keeps score, domain feedback, and item comments but removes internal identity and policy", function () {
  const source = blueprint();
  const report = engine.analyzeAttempt(source, attempt(source), policy(), {});
  const student = projections.buildStudentReport(report);
  assert.equal(student.audience, "student");
  assert.equal(student.deliveryRequirement, "authenticated-owner-only");
  assert.equal(student.authorizationVerified, false);
  assert.equal(student.domains.length, 5);
  assert.equal(student.clusters.length, 5);
  assert.equal(student.clusterPriorities.length, 5);
  assert.equal(student.itemFeedback.length, 40);
  assert.equal(student.itemFeedback[0].questionNumber, 1);
  assert.equal(student.itemFeedback[0].unitId, "ccss-6-rp-a");
  assert.equal(student.itemFeedback[0].clusterId, "6.RP.A");
  assert.equal(student.itemFeedback[0].difficulty, "foundation");
  assert.ok(student.itemFeedback[0].comment.ko);
  assert.ok(student.itemFeedback[0].comment.en);
  assert.equal(Object.prototype.hasOwnProperty.call(student.assessment, "learnerId"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student, "policy"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student.itemFeedback[0], "itemId"), false);
  assert.equal(student.promotionReview.automaticPromotion, false);
  assert.equal(student.promotionReview.finalDecision, "school-review-required");
  assert.equal(projections.validateStudentReport(student), true);
});

test("teacher projection retains pseudonymous assessment, policy and evidence bindings without answer data", function () {
  const source = blueprint();
  const report = engine.analyzeAttempt(source, attempt(source), policy(), {});
  const teacher = projections.buildTeacherReport(report);
  assert.equal(teacher.audience, "teacher");
  assert.equal(teacher.assessment.learnerId, "lrm-bdg-0123456789abcdef");
  assert.equal(teacher.policy.id, "pol-bdg-report-2026");
  assert.equal(Object.hasOwn(teacher.policy, "owner"), false);
  assert.ok(teacher.itemFeedback[0].itemId);
  assert.equal(teacher.promotionReview.requiresServerAuthorization, true);
  assert.equal(teacher.promotionReview.serverAuthorizationVerified, false);
  assert.equal(Object.hasOwn(teacher.promotionReview, "decisionAuthority"), false);
  assert.equal(teacher.clusters[0].evidenceState, "cluster-range-only-pending-teacher-confirmation");
  assert.doesNotMatch(JSON.stringify(teacher), /"(?:answer|solution|rubric|correctOption)"/i);
  assert.equal(projections.validateTeacherReport(teacher), true);
});

test("projections refuse answer-bearing analysis input and cannot be misreported as automatic promotion", function () {
  const source = blueprint();
  const report = engine.analyzeAttempt(source, attempt(source), policy(), {});
  const unsafe = Object.assign({}, report, { answer: "A" });
  assert.throws(function () { projections.buildStudentReport(unsafe); }, /unsupported fields|private answer data/);
  const student = projections.buildStudentReport(report);
  const invalid = Object.assign({}, student, { authorizationVerified: true });
  assert.throws(function () { projections.validateStudentReport(invalid); }, /student projection is invalid/);
});

test("analysis and report projections reject altered feedback copy and nested private fields", function () {
  const source = blueprint();
  const report = engine.analyzeAttempt(source, attempt(source), policy(), {});
  const alteredReport = JSON.parse(JSON.stringify(report));
  alteredReport.itemFeedback[0].comment.ko = "정답은 7";
  assert.throws(function () { projections.validateAnalysisReport(alteredReport); }, /comment\.ko is invalid/);

  const privatePolicy = JSON.parse(JSON.stringify(report));
  privatePolicy.policy.answer_key = "7";
  assert.throws(function () { projections.buildTeacherReport(privatePolicy); }, /unsupported fields|private answer data/);

  const injectedEvidence = JSON.parse(JSON.stringify(report));
  injectedEvidence.promotionReview.boundEvidenceRecordIds = ["answer=7"];
  assert.throws(function () { projections.buildTeacherReport(injectedEvidence); }, /evidence record IDs are invalid/);

  const injectedIdentifier = JSON.parse(JSON.stringify(report));
  injectedIdentifier.blueprintId = "asm-bdg-answer-7";
  assert.throws(function () { projections.buildStudentReport(injectedIdentifier); }, /blueprintId is invalid/);

  const injectedOwner = JSON.parse(JSON.stringify(report));
  injectedOwner.policy.owner = "7";
  assert.throws(function () { projections.buildTeacherReport(injectedOwner); }, /unsupported fields/);

  const injectedAuthority = JSON.parse(JSON.stringify(report));
  injectedAuthority.promotionReview.decisionAuthority = "7";
  assert.throws(function () { projections.buildTeacherReport(injectedAuthority); }, /promotion review is invalid/);

  const alteredStudent = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  alteredStudent.itemFeedback[0].comment.en = "Answer: 7";
  assert.throws(function () { projections.validateStudentReport(alteredStudent); }, /comment\.en is invalid/);

  const injectedStudent = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  injectedStudent.itemFeedback[0].answer_key = "7";
  assert.throws(function () { projections.validateStudentReport(injectedStudent); }, /unsupported fields|private answer data/);

  const studentIdentifier = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  studentIdentifier.assessment.blueprintId = "asm-bdg-answer-7";
  assert.throws(function () { projections.validateStudentReport(studentIdentifier); }, /blueprintId is invalid/);

  const studentLowDomain = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  studentLowDomain.promotionReview.lowDomainIds = ["answer=7"];
  assert.throws(function () { projections.validateStudentReport(studentLowDomain); }, /lowDomainIds/);

  const teacherLowDomain = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  teacherLowDomain.promotionReview.lowDomainIds = ["answer=7"];
  assert.throws(function () { projections.validateTeacherReport(teacherLowDomain); }, /lowDomainIds/);
});

test("untrusted policy owner labels never reach teacher output", function () {
  const source = blueprint();
  ["7", "A", "Answer: 7", "정답은 7"].forEach(function (ownerLabel) {
    const untrustedPolicy = policy();
    untrustedPolicy.owner = ownerLabel;
    const report = engine.analyzeAttempt(source, attempt(source), untrustedPolicy, {});
    const teacher = projections.buildTeacherReport(report);

    assert.equal(Object.hasOwn(report.policy, "owner"), false);
    assert.equal(report.promotionReview.decisionAuthority, untrustedPolicy.id);
    assert.equal(Object.hasOwn(teacher.policy, "owner"), false);
    assert.equal(Object.hasOwn(teacher.promotionReview, "decisionAuthority"), false);
    assert.equal(projections.validateTeacherReport(teacher), true);
  });
});
