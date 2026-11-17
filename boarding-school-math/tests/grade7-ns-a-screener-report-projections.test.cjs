"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/diagnostic-engine.js");
const projections = require("../assessment/unit-screener-report-projections.js");
const nextSteps = require("../assessment/grade7-ns-a-teacher-next-step-plan.js");
const plan = require("../assessment/grade7-ns-a-screener-plan.js").plan;

function blueprint(limit) {
  const slots = typeof limit === "number" ? plan.slots.slice(0, limit) : plan.slots;
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade7-nsa-screener-v1",
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    version: 1,
    purpose: "unit-screener",
    items: slots.map(function (slot, index) {
      return {
        slotId: slot.slotId,
        itemId: `qst-bnk-${String(index + 1).padStart(16, "0")}`,
        unitId: slot.unitId,
        clusterId: slot.clusterId,
        standardRange: slot.standardRange,
        standardFocus: slot.standardFocus,
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

function attempt(source) {
  return {
    id: "att-bdg-0000000000000001",
    blueprintId: source.id,
    blueprintVersion: source.version,
    learnerId: "lrm-bdg-0000000000000001",
    schoolId: "sch-bdg-0000000000000001",
    policyId: "pol-bdg-unit-screener-v1",
    policyVersion: 1,
    completedAt: "2026-10-14T00:00:00.000Z",
    itemResults: source.items.map(function (item, index) {
      const correct = index % 3 !== 0;
      const result = { itemId: item.itemId, awardedPoints: correct ? item.maxPoints : 0 };
      if (!correct) result.errorType = index % 2 ? "calculation-error" : "representation-error";
      if (item.scoringMode === "teacher") {
        result.scoringReview = {
          reviewId: `grd-bdg-${String(index + 1).padStart(16, "0")}`,
          reviewerId: `gmt-${String(index + 1).padStart(16, "0")}`,
          reviewedAt: "2026-10-14T00:00:00.000Z",
          attemptId: "att-bdg-0000000000000001",
          itemId: item.itemId
        };
      }
      return result;
    })
  };
}

function analysis(limit) {
  const source = blueprint(limit);
  return engine.analyzeUnitScreener(source, attempt(source));
}

test("student and teacher unit-screener reports preserve evidence while separating identity and lineage", function () {
  const report = analysis();
  const student = projections.buildStudentReport(report);
  const teacher = projections.buildTeacherReport(report);

  assert.equal(projections.validateStudentReport(student), true);
  assert.equal(projections.validateTeacherReport(teacher), true);
  assert.deepEqual(student.score, teacher.score);
  assert.equal(student.focuses.length, 9);
  assert.equal(student.itemFeedback.length, 18);
  assert.equal(Object.prototype.hasOwnProperty.call(student.assessment, "learnerId"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student, "difficultyEvidence"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student.focuses[0], "skillIds"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student.itemFeedback[0], "itemId"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student.itemFeedback[0], "slotId"), false);
  assert.equal(teacher.assessment.learnerId, report.learnerId);
  assert.deepEqual(teacher.focuses[0].skillIds, report.focuses[0].skillIds);
  assert.equal(teacher.itemFeedback[0].itemId, report.itemFeedback[0].itemId);
  assert.equal(teacher.itemFeedback[0].slotId, report.itemFeedback[0].slotId);
  assert.equal(student.interpretation.automaticPrescription, false);
  assert.equal(teacher.interpretation.teacherConfirmationRequired, true);
});

test("teacher feedback and teacher-confirmed next-step preview carry all three locales", function () {
  const teacher = projections.buildTeacherReport(analysis());
  assert.equal(projections.validateTeacherReport(teacher), true);
  for (const item of teacher.itemFeedback) {
    assert.deepEqual(Object.keys(item.comment).sort(), ["en", "ko", "zh-Hans"]);
    assert.deepEqual(item.comment, engine.FEEDBACK[item.commentCode]);
  }
  const draft = nextSteps.buildDraft(teacher, ["7.NS.A.1b"], "zh-Hans");
  assert.equal(draft.locale, "zh-Hans");
  assert.equal(draft.steps[0].title, "用数轴方向和距离表示有理数和");
  assert.equal(draft.authorizationVerified, false);
  assert.equal(draft.studentAssignmentAuthorized, false);
});

test("next-step drafts preserve caller selections without resolving resources before teacher authorization", function () {
  const teacherReport = projections.buildTeacherReport(analysis());
  const draft = nextSteps.buildDraft(teacherReport, ["7.NS.A.1b", "7.NS.A.2d"], "ko");
  assert.equal(draft.audience, "teacher");
  assert.equal(draft.authorizationVerified, false);
  assert.equal(draft.requiresAuthenticatedTeacherDelivery, true);
  assert.equal(draft.releaseState, "locked-review-preview-only");
  assert.equal(draft.locale, "ko");
  assert.deepEqual(draft.sourceAssessment, { blueprintId: "asm-bdg-grade7-nsa-screener-v1", blueprintVersion: 1, purpose: "unit-screener" });
  assert.equal(draft.sourceBindingState, "blueprint-only-awaiting-authenticated-attempt-binding");
  assert.equal(draft.selectionProvenance, "unverified-caller-input");
  assert.equal(draft.automaticPrescription, false);
  assert.equal(draft.studentAssignmentAuthorized, false);
  assert.deepEqual(draft.steps.map(function (step) { return step.standardFocus; }), ["7.NS.A.1b", "7.NS.A.2d"]);
  assert.ok(draft.steps.every(function (step) { return step.callerSelected && step.state === "awaiting-authenticated-teacher-review"; }));
  assert.ok(draft.steps.every(function (step) { return step.resourceResolutionState === "locked-until-teacher-authorization"; }));
  assert.doesNotMatch(JSON.stringify(draft), /resourceId|href|attemptId|earnedPoints|percentage|learnerId|itemId|answer/);
  const englishDraft = nextSteps.buildDraft(teacherReport, ["7.NS.A.1b"], "en");
  assert.equal(englishDraft.steps[0].title, "Represent rational sums with number-line direction and distance");
});

test("caller-selected focus with too few observations requests evidence and keeps resource unavailable", function () {
  const teacherReport = projections.buildTeacherReport(analysis(17));
  const draft = nextSteps.buildDraft(teacherReport, ["7.NS.A.3"], "ko");
  assert.deepEqual(draft.steps.map(function (step) {
    return { state: step.state, reviewedObservationCount: step.reviewedObservationCount, resourceResolutionState: step.resourceResolutionState };
  }), [{ state: "additional-observation-needed", reviewedObservationCount: 1, resourceResolutionState: "not-available-insufficient-evidence" }]);
});

test("next-step draft rejects student projections and invalid or duplicate teacher selections", function () {
  const report = analysis();
  const teacher = projections.buildTeacherReport(report);
  const student = projections.buildStudentReport(report);
  assert.throws(function () { nextSteps.buildDraft(student, ["7.NS.A.1b"], "ko"); }, /teacher unit-screener projection/);
  assert.throws(function () { nextSteps.buildDraft(teacher, ["7.NS.A.1b", "7.NS.A.1b"], "ko"); }, /selected focus input is invalid/);
  assert.throws(function () { nextSteps.buildDraft(teacher, ["7.NS.A.4"], "ko"); }, /selected focus input is invalid/);
  assert.throws(function () { nextSteps.buildDraft(teacher, [new String("7.NS.A.1b")], "ko"); }, /selected focus input is invalid/);
  assert.throws(function () { nextSteps.buildDraft(teacher, ["7.NS.A.1b"], "fr"); }, /locale is invalid/);
});

test("unit-screener projections reject answer data, altered feedback, and unsupported decisions", function () {
  const report = analysis();
  const answerLeak = JSON.parse(JSON.stringify(report));
  answerLeak.itemFeedback[0].answerKey = "A";
  assert.throws(function () { projections.buildStudentReport(answerLeak); }, /unsupported fields|forbidden decision or answer data/);

  const alteredFeedback = JSON.parse(JSON.stringify(report));
  alteredFeedback.itemFeedback[0].comment.ko = "임의 코멘트";
  assert.throws(function () { projections.buildTeacherReport(alteredFeedback); }, /comment\.ko is invalid/);

  const escalated = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  escalated.interpretation.automaticPrescription = true;
  assert.throws(function () { projections.validateTeacherReport(escalated); }, /must remain false/);

  const studentIdentityLeak = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  studentIdentityLeak.assessment.learnerId = report.learnerId;
  assert.throws(function () { projections.validateStudentReport(studentIdentityLeak); }, /unsupported fields/);
});

test("projection validators bind totals and focus evidence to the reviewed item set", function () {
  const report = analysis();
  const teacher = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  teacher.score.earnedPoints += 1;
  assert.throws(function () { projections.validateTeacherReport(teacher); }, /inconsistent|does not match item evidence/);

  const alteredFocus = JSON.parse(JSON.stringify(report));
  alteredFocus.focuses[0].earnedPoints += 1;
  alteredFocus.focuses[0].percentage = 100;
  assert.throws(function () { projections.buildStudentReport(alteredFocus); }, /does not match item evidence/);

  const duplicateItem = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  duplicateItem.itemFeedback[1].itemId = duplicateItem.itemFeedback[0].itemId;
  assert.throws(function () { projections.validateTeacherReport(duplicateItem); }, /duplicated/);

  const duplicateSlot = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  duplicateSlot.itemFeedback[1].slotId = duplicateSlot.itemFeedback[0].slotId;
  assert.throws(function () { projections.validateTeacherReport(duplicateSlot); }, /slotId is duplicated/);

  const projectionFocusDrift = JSON.parse(JSON.stringify(projections.buildStudentReport(report)));
  projectionFocusDrift.focuses[0].earnedPoints += 1;
  projectionFocusDrift.focuses[0].percentage = 100;
  assert.throws(function () { projections.validateStudentReport(projectionFocusDrift); }, /does not match item evidence/);

  const difficultyDrift = JSON.parse(JSON.stringify(projections.buildTeacherReport(report)));
  difficultyDrift.difficultyEvidence.foundation.earnedPoints += 1;
  difficultyDrift.difficultyEvidence.foundation.percentage = 100;
  assert.throws(function () { projections.validateTeacherReport(difficultyDrift); }, /inconsistent|difficulty evidence does not match item evidence/);
});

test("missing observations stay visible without creating a mastery or routing claim", function () {
  const report = analysis(17);
  const student = projections.buildStudentReport(report);
  const teacher = projections.buildTeacherReport(report);
  assert.equal(student.interpretation.state, "insufficient-reviewed-observations");
  assert.deepEqual(student.interpretation.missingObservationFocusIds, ["7.NS.A.3"]);
  assert.equal(student.interpretation.masteryThresholdApproved, false);
  assert.equal(teacher.interpretation.automaticPrescription, false);
  assert.equal(projections.validateStudentReport(student), true);
  assert.equal(projections.validateTeacherReport(teacher), true);
});
