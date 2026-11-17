"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/diagnostic-engine.js");
const readiness = require("../assessment/unit-screener-scoring-readiness.js");
const projections = require("../assessment/unit-screener-report-projections.js");
const plan = require("../assessment/grade7-ns-a-screener-plan.js").plan;

function blueprint() {
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade7-nsa-screener-v1",
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    version: 1,
    purpose: "unit-screener",
    items: plan.slots.map(function (slot, index) {
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

function automaticResult(item, index) {
  return index % 3
    ? { itemId: item.itemId, awardedPoints: item.maxPoints }
    : { itemId: item.itemId, awardedPoints: 0, errorType: "calculation-error" };
}

function teacherReview(item, index) {
  const fullCredit = index % 2 === 1;
  return {
    itemId: item.itemId,
    awardedPoints: fullCredit ? item.maxPoints : 0,
    errorType: fullCredit ? null : "explanation-incomplete",
    scoringReview: {
      reviewId: `grd-bdg-${String(index + 1).padStart(16, "0")}`,
      reviewerId: "gmt-0000000000000001",
      reviewedAt: "2026-10-14T00:10:00.000Z",
      attemptId: "att-bdg-0000000000000001",
      itemId: item.itemId
    }
  };
}

function draft(source, reviewedCount) {
  const automaticItems = source.items.filter(function (item) { return item.scoringMode === "automatic"; });
  const teacherItems = source.items.filter(function (item) { return item.scoringMode === "teacher"; });
  return {
    schemaVersion: readiness.DRAFT_SCHEMA_VERSION,
    attemptId: "att-bdg-0000000000000001",
    blueprintId: source.id,
    blueprintVersion: source.version,
    learnerId: "lrm-bdg-0000000000000001",
    schoolId: "sch-bdg-0000000000000001",
    policyId: "pol-bdg-unit-screener-v1",
    policyVersion: 1,
    completedAt: "2026-10-14T00:00:00.000Z",
    automaticResults: automaticItems.map(automaticResult),
    teacherReviews: teacherItems.slice(0, reviewedCount).map(teacherReview)
  };
}

test("submitted screener remains score-safe while four teacher reviews are pending", function () {
  const source = blueprint();
  const pending = draft(source, 0);
  const status = readiness.inspectScoringReadiness(source, pending);
  const student = readiness.buildStudentStatus(source, pending);
  const teacher = readiness.buildTeacherStatus(source, pending);

  assert.equal(status.state, "pending-teacher-review");
  assert.deepEqual(status.counts, {
    totalItemCount: 18,
    automaticScoredCount: 14,
    teacherReviewRequiredCount: 4,
    teacherReviewedCount: 0,
    teacherPendingCount: 4
  });
  assert.equal(status.pendingItemIds.length, 4);
  assert.equal(status.scoreReleased, false);
  assert.equal(status.analysisReleased, false);
  assert.equal(student.deliveryRequirement, "authenticated-owner-only");
  assert.equal(Object.prototype.hasOwnProperty.call(student, "assessment"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(student, "pendingItemIds"), false);
  assert.equal(teacher.deliveryRequirement, "authenticated-teacher-or-admin-only");
  assert.equal(teacher.assessment.learnerId, pending.learnerId);
  assert.deepEqual(teacher.pendingItemIds, status.pendingItemIds);
  assert.throws(function () { readiness.buildFinalAttempt(source, pending); }, /still pending teacher review/);
});

test("partial teacher review changes only readiness counts and never releases a partial score", function () {
  const source = blueprint();
  const pending = draft(source, 2);
  const status = readiness.inspectScoringReadiness(source, pending);
  assert.equal(status.state, "pending-teacher-review");
  assert.equal(status.counts.teacherReviewedCount, 2);
  assert.equal(status.counts.teacherPendingCount, 2);
  assert.equal(status.scoreReleased, false);
  assert.equal(status.analysisReleased, false);
  assert.equal(status.automaticPrescription, false);
  assert.equal(status.teacherConfirmationRequired, true);
});

test("all four bound reviews produce one engine-valid attempt in immutable blueprint order", function () {
  const source = blueprint();
  const complete = draft(source, 4);
  complete.automaticResults.reverse();
  complete.teacherReviews.reverse();
  const status = readiness.inspectScoringReadiness(source, complete);
  const attempt = readiness.buildFinalAttempt(source, complete);
  const analysis = engine.analyzeUnitScreener(source, attempt);
  const studentReport = projections.buildStudentReport(analysis);
  const teacherReport = projections.buildTeacherReport(analysis);

  assert.equal(status.state, "ready-for-analysis");
  assert.equal(status.counts.teacherPendingCount, 0);
  assert.deepEqual(attempt.itemResults.map(function (result) { return result.itemId; }), source.items.map(function (item) { return item.itemId; }));
  assert.equal(engine.validateAttempt(source, attempt), true);
  assert.equal(analysis.itemFeedback.length, 18);
  assert.deepEqual(analysis.itemFeedback.map(function (item) { return item.slotId; }), source.items.map(function (item) { return item.slotId; }));
  assert.equal(analysis.interpretation.automaticPrescription, false);
  assert.equal(projections.validateStudentReport(studentReport), true);
  assert.equal(projections.validateTeacherReport(teacherReport), true);
  assert.equal(Object.prototype.hasOwnProperty.call(studentReport.assessment, "learnerId"), false);
  assert.equal(teacherReport.assessment.learnerId, complete.learnerId);
});

test("readiness rejects response leakage, cross-mode scores, and unbound or stale reviews", function () {
  const source = blueprint();

  const responseLeak = draft(source, 0);
  responseLeak.studentResponse = "hidden";
  assert.throws(function () { readiness.inspectScoringReadiness(source, responseLeak); }, /unsupported fields|response or answer data/);

  const crossMode = draft(source, 0);
  crossMode.automaticResults[0].itemId = source.items.find(function (item) { return item.scoringMode === "teacher"; }).itemId;
  assert.throws(function () { readiness.inspectScoringReadiness(source, crossMode); }, /invalid or duplicated/);

  const wrongBinding = draft(source, 1);
  wrongBinding.teacherReviews[0].scoringReview.attemptId = "att-bdg-9999999999999999";
  assert.throws(function () { readiness.inspectScoringReadiness(source, wrongBinding); }, /must match the attempt and item/);

  const staleReview = draft(source, 1);
  staleReview.teacherReviews[0].scoringReview.reviewedAt = "2026-10-13T23:59:59.000Z";
  assert.throws(function () { readiness.inspectScoringReadiness(source, staleReview); }, /cannot predate/);

  const duplicateReview = draft(source, 2);
  duplicateReview.teacherReviews[1].scoringReview.reviewId = duplicateReview.teacherReviews[0].scoringReview.reviewId;
  assert.throws(function () { readiness.inspectScoringReadiness(source, duplicateReview); }, /review IDs are duplicated/);
});
