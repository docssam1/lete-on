const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../assessment/diagnostic-engine.js");
const reports = require("../assessment/report-projections.js");
const placement = require("../assessment/grade6-placement-plan.js");
const roadmap = require("../assessment/grade6-roadmap-projection.js");

function blueprint() {
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade6-roadmap-v1",
    programId: "us-core-k8",
    targetGrade: 6,
    version: 1,
    purpose: "course-placement",
    items: placement.plan.slots.map(function (slot, index) {
      return {
        itemId: `qst-bnk-${String(index + 1).padStart(16, "0")}`,
        unitId: slot.unitId,
        clusterId: slot.clusterId,
        standardRange: slot.standardRange,
        skillId: slot.skillId,
        domainId: slot.domainId,
        maxPoints: slot.maxPoints,
        responseType: slot.responseType,
        difficulty: slot.difficulty,
        scoringMode: slot.scoringMode,
        reviewState: "approved"
      };
    })
  };
}

function policy() {
  return {
    id: "pol-bdg-roadmap-2026",
    version: 1,
    owner: "GFIELD Campus A",
    schoolId: "sch-bdg-0123456789abcdef",
    programId: "us-core-k8",
    targetGrade: 6,
    effectiveFrom: "2026-08-26",
    claimsNationalOfficialCut: false,
    teacherReviewRequired: true,
    bands: [{ id: "foundation", minPercent: 0 }, { id: "proficient", minPercent: 75 }],
    promotionReview: { minimumBandId: "proficient", minDomainPercent: 65, maxPrerequisiteGaps: 2 },
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
    policyId: "pol-bdg-roadmap-2026",
    policyVersion: 1,
    completedAt: "2026-08-26T10:00:00Z",
    itemResults: source.items.map(function (item, index) {
      const missed = item.clusterId === "6.NS.A";
      return {
        itemId: item.itemId,
        awardedPoints: missed ? 0 : item.maxPoints,
        errorType: missed ? "calculation-error" : null,
        scoringReview: item.scoringMode === "teacher" ? {
          reviewId: `grd-bdg-${String(index + 1).padStart(16, "0")}`,
          reviewerId: "gmt-0123456789abcdef",
          reviewedAt: "2026-08-26T11:00:00Z",
          attemptId: "att-bdg-0123456789abcdef",
          itemId: item.itemId
        } : null
      };
    })
  };
}

function report() {
  const source = blueprint();
  const completed = attempt(source);
  return engine.analyzeAttempt(source, completed, policy(), {});
}

test("Grade 6 student roadmap routes cluster evidence only to locked student metadata", function () {
  const student = roadmap.buildStudentRoadmap(report());
  const fractionDivision = student.routes.find(function (route) { return route.clusterId === "6.NS.A"; });

  assert.equal(student.audience, "student");
  assert.equal(student.deliveryRequirement, "authenticated-owner-only");
  assert.equal(student.authorizationVerified, false);
  assert.equal(student.routes.length, 10);
  assert.equal(Object.hasOwn(student.assessment, "learnerId"), false);
  assert.equal(Object.hasOwn(student, "policy"), false);
  assert.equal(fractionDivision.mode, "repair");
  assert.equal(fractionDivision.evidenceState, roadmap.ROUTING_EVIDENCE_STATE);
  assert.equal(fractionDivision.assignmentState, roadmap.ASSIGNMENT_STATE);
  assert.ok(fractionDivision.studentResources.length > 0);
  fractionDivision.studentResources.forEach(function (resource) {
    assert.equal(resource.audience, "student");
    assert.equal(resource.signedItemRequired, false);
    assert.equal(resource.bindingState, "unbound");
  });
  assert.equal(Object.hasOwn(fractionDivision, "teacherResources"), false);
  assert.equal(roadmap.validateStudentRoadmap(student), true);
});

test("Grade 6 teacher roadmap includes only metadata for aligned student and teacher resources", function () {
  const teacher = roadmap.buildTeacherRoadmap(report());
  const fractionDivision = teacher.routes.find(function (route) { return route.clusterId === "6.NS.A"; });

  assert.equal(teacher.audience, "teacher");
  assert.equal(teacher.deliveryRequirement, "authenticated-teacher-or-admin-only");
  assert.equal(teacher.assessment.learnerId, "lrm-bdg-0123456789abcdef");
  assert.equal(teacher.policy.id, "pol-bdg-roadmap-2026");
  assert.equal(Object.hasOwn(teacher.policy, "owner"), false);
  assert.equal(Object.hasOwn(teacher.promotionReview, "decisionAuthority"), false);
  assert.ok(fractionDivision.teacherResources.length > 0);
  fractionDivision.teacherResources.forEach(function (resource) {
    assert.equal(resource.audience, "teacher");
    assert.equal(resource.bindingState, "unbound");
  });
  assert.equal(roadmap.validateTeacherRoadmap(teacher), true);
});

test("roadmap projection rejects altered cluster lineage or resource bindings", function () {
  const sourceReport = report();
  const alteredReport = JSON.parse(JSON.stringify(sourceReport));
  alteredReport.clusterPriorities[0].unitId = "ccss-6-rp-a";
  assert.throws(function () { reports.validateAnalysisReport(alteredReport); }, /cluster priority is invalid/);

  const student = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  student.routes[0].studentResources.pop();
  assert.throws(function () { roadmap.validateStudentRoadmap(student); }, /student resources is invalid/);
});

test("roadmap projection rejects nested answer keys, identity aliases, and altered action copy", function () {
  const sourceReport = report();
  const actionChanged = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  actionChanged.routes[0].studentAction.ko = "정답은 7";
  assert.throws(function () { roadmap.validateStudentRoadmap(actionChanged); }, /studentAction is invalid/);

  const answerInjected = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  answerInjected.routes[0].answer_key = "7";
  assert.throws(function () { roadmap.validateStudentRoadmap(answerInjected); }, /unsupported fields|private content/);

  const identityInjected = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  identityInjected.assessment.learner_id = "lrm-bdg-0123456789abcdef";
  assert.throws(function () { roadmap.validateStudentRoadmap(identityInjected); }, /unsupported fields|private content/);

  const teacher = JSON.parse(JSON.stringify(roadmap.buildTeacherRoadmap(sourceReport)));
  teacher.assessment.learner_id = "lrm-bdg-0123456789abcdef";
  assert.throws(function () { roadmap.validateTeacherRoadmap(teacher); }, /unsupported fields|private content/);

  const teacherOwner = JSON.parse(JSON.stringify(roadmap.buildTeacherRoadmap(sourceReport)));
  teacherOwner.policy.owner = "7";
  assert.throws(function () { roadmap.validateTeacherRoadmap(teacherOwner); }, /unsupported fields|private content/);

  const teacherAuthority = JSON.parse(JSON.stringify(roadmap.buildTeacherRoadmap(sourceReport)));
  teacherAuthority.promotionReview.decisionAuthority = "7";
  assert.throws(function () { roadmap.validateTeacherRoadmap(teacherAuthority); }, /unsupported fields|private content/);

  const identifierChanged = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  identifierChanged.assessment.blueprintId = "asm-bdg-answer-7";
  assert.throws(function () { roadmap.validateStudentRoadmap(identifierChanged); }, /blueprintId is invalid/);

  const inheritedPayload = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  Object.setPrototypeOf(inheritedPayload.routes[0].studentAction, { answer_key: "secret" });
  assert.throws(function () { roadmap.validateStudentRoadmap(inheritedPayload); }, /studentAction is invalid|unsupported object type/);

  const accessorPayload = JSON.parse(JSON.stringify(roadmap.buildStudentRoadmap(sourceReport)));
  const originalAction = accessorPayload.routes[0].studentAction.ko;
  delete accessorPayload.routes[0].studentAction.ko;
  Object.defineProperty(accessorPayload.routes[0].studentAction, "ko", {
    enumerable: true,
    get: function () { return originalAction; }
  });
  assert.throws(function () { roadmap.validateStudentRoadmap(accessorPayload); }, /studentAction is invalid|unsupported object type/);
});

test("untrusted policy owner labels never reach the Grade 6 teacher roadmap", function () {
  const source = blueprint();
  ["7", "A", "Answer: 7", "정답은 7"].forEach(function (ownerLabel) {
    const untrustedPolicy = policy();
    untrustedPolicy.owner = ownerLabel;
    const sourceReport = engine.analyzeAttempt(source, attempt(source), untrustedPolicy, {});
    const teacher = roadmap.buildTeacherRoadmap(sourceReport);

    assert.equal(Object.hasOwn(sourceReport.policy, "owner"), false);
    assert.equal(sourceReport.promotionReview.decisionAuthority, untrustedPolicy.id);
    assert.equal(Object.hasOwn(teacher.policy, "owner"), false);
    assert.equal(Object.hasOwn(teacher.promotionReview, "decisionAuthority"), false);
    assert.equal(roadmap.validateTeacherRoadmap(teacher), true);
  });
});
