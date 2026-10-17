"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const engine = require("../assessment/diagnostic-engine.js");
const registry = require("../curriculum/us-k8-content-registry.js");
const source = require("../assessment/grade7-ns-a-screener-plan.js");

function counts(rows, field) {
  return Object.fromEntries(Array.from(new Set(rows.map(function (row) { return row[field]; }))).sort().map(function (value) {
    return [value, rows.filter(function (row) { return row[field] === value; }).length];
  }));
}

function contractPayload(plan) {
  return {
    schemaVersion: plan.schemaVersion,
    id: plan.id,
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    learnerStage: plan.learnerStage,
    purpose: plan.purpose,
    plannedItemCount: plan.plannedItemCount,
    deliveryRequirement: plan.deliveryRequirement,
    presentationOrderState: plan.presentationOrderState,
    officialSource: plan.officialSource,
    standardDecompositionState: plan.standardDecompositionState,
    coverageBoundary: plan.coverageBoundary,
    itemIndependence: plan.itemIndependence,
    releaseState: plan.releaseState,
    claimsOfficialNationalCut: plan.claimsOfficialNationalCut,
    resultContract: plan.resultContract,
    learnerFitGate: plan.learnerFitGate,
    slots: plan.slots
  };
}

function objectKeys(value) {
  if (Array.isArray(value)) return value.flatMap(objectKeys);
  if (!value || typeof value !== "object") return [];
  return Object.keys(value).flatMap(function (key) { return [key].concat(objectKeys(value[key])); });
}

test("7.NS.A screener reserves two observations for every granular focus", function () {
  const plan = source.plan;
  assert.equal(plan.purpose, "unit-screener");
  assert.equal(plan.plannedItemCount, 18);
  assert.equal(plan.slots.length, 18);
  assert.equal(source.focusSpecs.length, 9);
  assert.deepEqual(counts(plan.slots, "standardFocus"), {
    "7.NS.A.1a": 2, "7.NS.A.1b": 2, "7.NS.A.1c": 2, "7.NS.A.1d": 2,
    "7.NS.A.2a": 2, "7.NS.A.2b": 2, "7.NS.A.2c": 2, "7.NS.A.2d": 2, "7.NS.A.3": 2
  });
  assert.deepEqual(counts(plan.slots, "difficulty"), { advanced: 6, core: 6, foundation: 6 });
  assert.deepEqual(counts(plan.slots, "responseType"), { "constructed-response": 3, "multiple-choice": 10, numeric: 4, "short-answer": 1 });
  assert.deepEqual(counts(plan.slots, "scoringMode"), { automatic: 14, teacher: 4 });
  assert.equal(new Set(plan.slots.map(function (slot) { return slot.slotId; })).size, 18);
});

test("the screener remains locked, answer-free, and non-placement", function () {
  const plan = source.plan;
  assert.equal(engine.PURPOSE_RULES[plan.purpose].placementCapable, false);
  assert.equal(plan.resultContract.coursePlacementAllowed, false);
  assert.equal(plan.resultContract.promotionDecisionAllowed, false);
  assert.equal(plan.resultContract.competitionScorePredictionAllowed, false);
  assert.equal(plan.resultContract.fullStandardMasteryClaimAllowed, false);
  assert.equal(plan.resultContract.automaticPrescriptionAllowed, false);
  assert.equal(plan.resultContract.teacherConfirmationRequired, true);
  assert.equal(plan.claimsOfficialNationalCut, false);
  assert.match(plan.releaseState, /^locked-/);
  plan.slots.forEach(function (slot) {
    assert.equal(slot.itemId, null);
    assert.equal(slot.itemVersion, null);
    assert.match(slot.releaseState, /^locked-/);
  });
  const forbiddenKeys = new Set(["prompt", "answer", "answerKey", "correctOption", "solution", "rubric"]);
  assert.deepEqual(objectKeys(plan).filter(function (key) { return forbiddenKeys.has(key); }), []);
});

test("every slot is bound to the reviewed official source action without claiming complete standard coverage", function () {
  const plan = source.plan;
  assert.deepEqual(plan.officialSource, {
    title: "Common Core State Standards for Mathematics",
    authority: "Common Core State Standards Initiative",
    url: "https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf",
    section: "Grade 7 | The Number System | 7.NS.A.1-3",
    printedPages: "48-49",
    pdfPages: "47-48",
    verifiedOn: "2026-10-14",
    mappingState: "official-source-verified-paraphrase-only"
  });
  assert.match(plan.coverageBoundary, /cannot establish full-standard mastery/);
  assert.equal(new Set(plan.slots.map(function (slot) { return slot.evidenceTarget; })).size, 18);
  plan.slots.forEach(function (slot) {
    assert.match(slot.sourceLocator, /printed p/);
    assert.ok(slot.officialRequirementSummary.length >= 30);
    assert.ok(slot.mathematicalAction.length >= 30);
    assert.match(slot.visualRequirement, /^(?:calculated-number-line-required|diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset)$/);
  });
  assert.deepEqual(plan.slots.map(function (slot) {
    return [slot.standardFocus, slot.evidenceTarget, slot.responseType, slot.visualRequirement];
  }), [
    ["7.NS.A.1a", "context-selection-opposites-zero", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.1a", "learner-described-opposites-zero-context", "constructed-response", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.1b", "number-line-distance-direction", "multiple-choice", "calculated-number-line-required"],
    ["7.NS.A.1b", "contextual-sum-and-additive-inverse", "numeric", "calculated-number-line-required"],
    ["7.NS.A.1c", "subtraction-to-additive-inverse", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.1c", "contextual-absolute-difference-distance", "numeric", "calculated-number-line-required"],
    ["7.NS.A.1d", "property-strategy-recognition", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.1d", "property-strategy-application-and-justification", "constructed-response", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2a", "property-grounded-product-context", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2a", "exact-signed-rational-product", "numeric", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2b", "quotient-domain-sign-and-context", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2b", "exact-contextual-signed-quotient", "numeric", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2c", "multiplicative-property-strategy-recognition", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2c", "multiplicative-property-strategy-application-and-justification", "constructed-response", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2d", "decimal-form-classification", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.2d", "long-division-and-exact-decimal-form", "short-answer", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.3", "real-world-rational-operation-problem", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"],
    ["7.NS.A.3", "mathematical-rational-operation-problem", "multiple-choice", "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset"]
  ]);
  const oneA = plan.slots.filter(function (slot) { return slot.standardFocus === "7.NS.A.1a"; });
  assert.deepEqual(oneA.map(function (slot) { return slot.responseType; }), ["multiple-choice", "constructed-response"]);
  const oneCDistance = plan.slots.find(function (slot) { return slot.evidenceTarget === "contextual-absolute-difference-distance"; });
  assert.equal(oneCDistance.responseType, "numeric");
  assert.equal(oneCDistance.visualRequirement, "calculated-number-line-required");
});

test("every slot keeps registered Grade 7 lineage and the exact learner-fit contract", function () {
  const unit = registry.units.find(function (candidate) { return candidate.clusterId === "7.NS.A"; });
  assert.ok(unit);
  source.plan.slots.forEach(function (slot) {
    assert.equal(slot.unitId, unit.unitId);
    assert.equal(slot.clusterId, unit.clusterId);
    assert.equal(slot.standardRange, unit.standardRange);
    assert.equal(slot.skillId, registry.skillIdForCluster(unit.clusterId));
    assert.equal(slot.domainId, "G7-NS");
    assert.equal(slot.maxPoints, 1);
    if (["short-answer", "constructed-response"].includes(slot.responseType)) assert.equal(slot.scoringMode, "teacher");
  });
  assert.deepEqual(source.plan.learnerFitGate, {
    id: "learner-fit",
    learnerStage: "US Grade 7 ages 12-13",
    state: "pending-item-level-review",
    criteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]
  });
});

test("a hypothetical approved projection fits the existing unit-screener validator without gaining placement authority", function () {
  const blueprint = {
    schemaVersion: engine.SCHEMA_VERSION,
    id: "asm-bdg-grade7-nsa-screener-v1",
    programId: source.plan.programId,
    targetGrade: source.plan.targetGrade,
    version: 1,
    purpose: source.plan.purpose,
    items: source.plan.slots.map(function (slot, index) {
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
  assert.equal(engine.validateBlueprint(blueprint), true);
  assert.equal(engine.PURPOSE_RULES[blueprint.purpose].placementCapable, false);
});

test("the locked plan contract has an immutable review fingerprint", function () {
  const digest = crypto.createHash("sha256").update(JSON.stringify(contractPayload(source.plan))).digest("hex");
  assert.equal(digest, source.plan.planContractSha256);
});
