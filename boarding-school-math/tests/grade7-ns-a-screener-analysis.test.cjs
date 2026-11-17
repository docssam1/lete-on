"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/diagnostic-engine.js");
const plan = require("../assessment/grade7-ns-a-screener-plan.js").plan;

function blueprint() {
  return {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade7-nsa-screener-v1",
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    version: 1,
    purpose: plan.purpose,
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

function resultFor(item, index, points, errorType) {
  const result = { itemId: item.itemId, awardedPoints: points };
  if (points < item.maxPoints) result.errorType = errorType || "concept-gap";
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
}

function attemptFor(source, award) {
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
      const value = award(item, index);
      return resultFor(item, index, value.points, value.errorType);
    })
  };
}

test("reviewed unit-screener evidence is aggregated by granular focus without mastery claims", function () {
  const source = blueprint();
  const attempt = attemptFor(source, function (item, index) {
    return index % 3 === 0 ? { points: 0, errorType: "representation-error" } : { points: 1 };
  });
  const report = engine.analyzeUnitScreener(source, attempt);
  assert.equal(report.purpose, "unit-screener");
  assert.equal(report.focuses.length, 9);
  assert.equal(report.itemFeedback.length, 18);
  assert.deepEqual(report.itemFeedback.map(function (row) { return row.slotId; }), source.items.map(function (item) { return item.slotId; }));
  assert.equal(report.score.maxPoints, 18);
  assert.equal(report.score.earnedPoints, 12);
  assert.equal(report.score.percentage, 66.7);
  report.focuses.forEach(function (focus) {
    assert.equal(focus.itemCount, 2);
    assert.equal(focus.minimumObservationsMet, true);
    assert.equal(focus.evidenceState, "reviewed-observation-count-only-no-mastery-threshold");
    assert.equal(Object.prototype.hasOwnProperty.call(focus, "strength"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(focus, "weakness"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(focus, "mastery"), false);
  });
  assert.deepEqual(report.interpretation, {
    state: "ready-for-teacher-interpretation",
    missingObservationFocusIds: [],
    masteryThresholdApproved: false,
    automaticPrescription: false,
    coursePlacement: false,
    promotionDecision: false,
    competitionScorePrediction: false,
    teacherConfirmationRequired: true
  });
});

test("analysis rebinds shuffled results by immutable item ID", function () {
  const source = blueprint();
  const attempt = attemptFor(source, function (item, index) { return { points: index % 2 }; });
  attempt.itemResults.reverse();
  const report = engine.analyzeUnitScreener(source, attempt);
  assert.deepEqual(report.itemFeedback.map(function (row) { return row.itemId; }), source.items.map(function (item) { return item.itemId; }));
  report.itemFeedback.forEach(function (row, index) { assert.equal(row.earnedPoints, index % 2); });
});

test("unit-screener analysis requires complete granular focus lineage", function () {
  const source = blueprint();
  source.items[0] = Object.assign({}, source.items[0], { standardFocus: "7.RP.A.1" });
  assert.throws(function () { engine.validateBlueprint(source); }, /standardFocus must belong to its cluster/);

  const missing = blueprint();
  delete missing.items[0].standardFocus;
  const complete = attemptFor(missing, function () { return { points: 1 }; });
  assert.throws(function () { engine.analyzeUnitScreener(missing, complete); }, /requires standardFocus on every item/);
});

test("unit-screener analysis rejects missing or duplicate immutable slot bindings", function () {
  const missing = blueprint();
  delete missing.items[0].slotId;
  assert.throws(function () { engine.validateBlueprint(missing); }, /require slotId/);

  const duplicate = blueprint();
  duplicate.items[1].slotId = duplicate.items[0].slotId;
  assert.throws(function () { engine.validateBlueprint(duplicate); }, /slot ids contains duplicates/);
});

test("placement and competition blueprints cannot enter the unit-screener analyzer", function () {
  ["course-placement", "competition-benchmark"].forEach(function (purpose) {
    const source = blueprint();
    source.purpose = purpose;
    assert.throws(function () { engine.analyzeUnitScreener(source, attemptFor(source, function () { return { points: 1 }; })); }, /analyzeUnitScreener requires a unit-screener blueprint/);
  });
});
