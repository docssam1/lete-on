"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const plan = require("../assessment/grade7-ns-a-screener-plan.js").plan;
const itemContract = require("../question-bank/item-release-contract.js");
const manifest = require("../assessment/grade7-ns-a-screener-authoring-manifest.js").manifest;

test("the authoring manifest binds all 18 locked slots without inventing item or answer content", function () {
  assert.equal(manifest.entries.length, 18);
  assert.equal(manifest.requiredEntryCount, 18);
  assert.equal(manifest.planId, plan.id);
  assert.equal(manifest.planContractSha256, plan.planContractSha256);
  assert.deepEqual(manifest.entries.map(function (entry) { return entry.slotId; }), plan.slots.map(function (slot) { return slot.slotId; }));
  manifest.entries.forEach(function (entry, index) {
    const slot = plan.slots[index];
    ["unitId", "clusterId", "standardRange", "standardFocus", "sourceLocator", "officialRequirementSummary", "mathematicalAction", "evidenceTarget", "domainId", "difficulty", "responseType", "scoringMode", "maxPoints", "visualRequirement"].forEach(function (field) {
      assert.equal(entry[field], slot[field], `${entry.slotId}:${field}`);
    });
    assert.equal(entry.itemId, null);
    assert.equal(entry.itemVersion, null);
    assert.match(entry.authoringState, /locked-awaiting-sol-ultra/);
    assert.match(entry.releaseState, /^locked-/);
    assert.doesNotMatch(JSON.stringify(entry), /(?:answerKey|correctAnswer|solutionText|acceptedAlternatives)/i);
  });
});

test("minimum reviews stay synchronized with the existing item release contract", function () {
  const textItem = { promptBlocks: [{ type: "text", valueByLocale: { ko: "x", en: "x", "zh-Hans": "x" } }] };
  const diagramItem = { promptBlocks: [{ type: "diagram", valueByLocale: { ko: "x", en: "x", "zh-Hans": "x" } }] };
  assert.deepEqual(manifest.minimumReviewTypes, itemContract.requiredReviewTypes(textItem));
  assert.deepEqual(manifest.conditionalDiagramReviewTypes, itemContract.requiredReviewTypes(diagramItem).filter(function (type) {
    return !manifest.minimumReviewTypes.includes(type);
  }));
  [
    "math-correctness", "age-appropriateness", "answer-uniqueness", "translation-ko", "translation-en",
    "translation-zh-Hans", "rights", "scoring-rubric", "student-payload-safety"
  ].forEach(function (type) { assert.ok(manifest.minimumReviewTypes.includes(type), type); });
  assert.deepEqual(manifest.conditionalDiagramReviewTypes, ["visual-evidence", "asset-rights"]);
});

test("every focus declares independent proof and exact learner-fit requirements", function () {
  const focusCounts = new Map();
  manifest.entries.forEach(function (entry) {
    focusCounts.set(entry.standardFocus, (focusCounts.get(entry.standardFocus) || 0) + 1);
    assert.equal(entry.learnerStage, "US Grade 7 ages 12-13");
    assert.deepEqual(entry.learnerFitCriteria, ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]);
    assert.deepEqual(entry.learnerLocales, ["ko", "en", "zh-Hans"]);
    assert.ok(entry.proofMethods.length >= 3);
    assert.equal(entry.implementationAndVerificationSeparated, true);
    assert.equal(entry.authorCannotSelfApproveMathReview, true);
    assert.equal(entry.studentTeacherPayloadsSeparated, true);
    assert.equal(entry.fractionDisplayRequirement, "stacked-mathml-no-visible-slash-fractions");
    assert.equal(entry.studentVisualAnswerState, "givens-only-no-target-answer-marker");
    assert.equal(entry.standardClaimLimit, "slot-observation-only-not-full-focus-mastery");
    assert.equal(entry.sourceFidelityAuditRequired, true);
  });
  assert.deepEqual(Object.fromEntries(focusCounts), {
    "7.NS.A.1a": 2, "7.NS.A.1b": 2, "7.NS.A.1c": 2, "7.NS.A.1d": 2,
    "7.NS.A.2a": 2, "7.NS.A.2b": 2, "7.NS.A.2c": 2, "7.NS.A.2d": 2, "7.NS.A.3": 2
  });
});

test("number-line evidence slots require calculated visual review while other visuals remain conditional", function () {
  const numberLine = manifest.entries.filter(function (entry) { return entry.visualRequirement === "calculated-number-line-required"; });
  assert.equal(numberLine.length, 3);
  numberLine.forEach(function (entry) {
    assert.equal(entry.visualRequirement, "calculated-number-line-required");
    assert.ok(entry.proofMethods.includes("calculated-number-line-geometry"));
    assert.ok(entry.proofMethods.includes("student-target-marker-absence"));
  });
  assert.deepEqual(numberLine.map(function (entry) { return entry.evidenceTarget; }), [
    "number-line-distance-direction",
    "contextual-sum-and-additive-inverse",
    "contextual-absolute-difference-distance"
  ]);
  manifest.entries.filter(function (entry) { return entry.visualRequirement !== "calculated-number-line-required"; }).forEach(function (entry) {
    assert.equal(entry.visualRequirement, "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset");
  });
});
