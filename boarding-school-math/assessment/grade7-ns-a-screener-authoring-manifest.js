(function (root, factory) {
  const planData = typeof module === "object" && module.exports
    ? require("./grade7-ns-a-screener-plan.js")
    : root.GFIELDGrade7NSAScreenerPlan;
  const itemContract = typeof module === "object" && module.exports
    ? require("../question-bank/item-release-contract.js")
    : root.GFIELDItemReleaseContract;
  const api = factory(planData, itemContract);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade7NSAScreenerAuthoringManifest = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (planData, itemContract) {
  "use strict";

  if (!planData || !planData.plan) throw new Error("GFIELDGrade7NSAScreenerPlan is required");
  if (!itemContract || typeof itemContract.requiredReviewTypes !== "function") throw new Error("GFIELDItemReleaseContract is required");

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }

  const localizedTextPlaceholder = {
    promptBlocks: [{ type: "text", valueByLocale: { ko: "x", en: "x", "zh-Hans": "x" } }]
  };
  const localizedDiagramPlaceholder = {
    promptBlocks: [{ type: "diagram", valueByLocale: { ko: "x", en: "x", "zh-Hans": "x" } }]
  };
  const minimumReviewTypes = freeze(itemContract.requiredReviewTypes(localizedTextPlaceholder));
  const diagramReviewTypes = itemContract.requiredReviewTypes(localizedDiagramPlaceholder);
  const conditionalDiagramReviewTypes = freeze(diagramReviewTypes.filter(function (type) {
    return !minimumReviewTypes.includes(type);
  }));

  const proofMethods = freeze({
    "7.NS.A.1a": ["opposite-quantities-combine-to-zero", "context-direction-and-unit-consistency", "described-situation-validity-check"],
    "7.NS.A.1b": ["exact-rational-coordinate-model", "calculated-number-line-geometry", "signed-distance-and-direction-check", "additive-inverse-zero-check", "real-world-sum-interpretation-check", "student-target-marker-absence"],
    "7.NS.A.1c": ["subtraction-to-opposite-equivalence", "exact-rational-evaluation", "calculated-number-line-geometry", "absolute-difference-distance-check", "real-world-distance-interpretation-check", "student-target-marker-absence"],
    "7.NS.A.1d": ["declared-operation-property-identity", "both-expression-sides-exactly-equal", "strategy-is-not-label-only"],
    "7.NS.A.2a": ["signed-product-rule-from-operation-properties", "distributive-property-justification", "exact-rational-product", "real-world-product-interpretation-check"],
    "7.NS.A.2b": ["nonzero-divisor-proof", "integer-quotient-is-rational-check", "equivalent-negative-quotient-form-check", "exact-rational-quotient", "real-world-quotient-interpretation-check", "independent-multiplication-reversal"],
    "7.NS.A.2c": ["declared-operation-property-identity", "both-expression-sides-exactly-equal", "strategy-is-not-reciprocal-only"],
    "7.NS.A.2d": ["long-division-work-evidence", "reduced-denominator-factor-test", "independent-long-division-period-check", "formal-repeating-block-notation"],
    "7.NS.A.3": ["real-world-and-mathematical-context-split", "four-operation-coverage-check", "complex-fraction-eligibility-check", "declared-context-equation", "unit-and-operation-order-check", "independent-reverse-calculation"]
  });

  const entries = planData.plan.slots.map(function (slot) {
    return freeze({
      slotId: slot.slotId,
      unitId: slot.unitId,
      clusterId: slot.clusterId,
      standardRange: slot.standardRange,
      standardFocus: slot.standardFocus,
      sourceLocator: slot.sourceLocator,
      officialRequirementSummary: slot.officialRequirementSummary,
      mathematicalAction: slot.mathematicalAction,
      evidenceTarget: slot.evidenceTarget,
      domainId: slot.domainId,
      difficulty: slot.difficulty,
      responseType: slot.responseType,
      scoringMode: slot.scoringMode,
      maxPoints: slot.maxPoints,
      authoringState: "locked-awaiting-sol-ultra-authoring-and-independent-review",
      itemId: null,
      itemVersion: null,
      contentOriginRequirement: "new-unseen-gfield-original-diagnostic-item-not-workbook-reuse",
      learnerStage: planData.plan.learnerStage,
      learnerFitCriteria: planData.plan.learnerFitGate.criteria.slice(),
      learnerLocales: ["ko", "en", "zh-Hans"],
      answerContract: "one-determinate-mathematical-result-with-separate-private-proof-or-teacher-rubric",
      minimumReviewTypes: minimumReviewTypes.slice(),
      conditionalDiagramReviewTypes: conditionalDiagramReviewTypes.slice(),
      visualRequirement: slot.visualRequirement,
      proofMethods: proofMethods[slot.standardFocus].slice(),
      standardClaimLimit: "slot-observation-only-not-full-focus-mastery",
      sourceFidelityAuditRequired: true,
      implementationAndVerificationSeparated: true,
      authorCannotSelfApproveMathReview: true,
      studentTeacherPayloadsSeparated: true,
      fractionDisplayRequirement: "stacked-mathml-no-visible-slash-fractions",
      studentVisualAnswerState: "givens-only-no-target-answer-marker",
      releaseState: "locked-no-item-no-signature-no-delivery"
    });
  });

  const manifest = freeze({
    schemaVersion: "gfield-unit-screener-authoring-manifest-v1",
    planId: planData.plan.id,
    planContractSha256: planData.plan.planContractSha256,
    learnerStage: planData.plan.learnerStage,
    requiredEntryCount: planData.plan.plannedItemCount,
    minimumReviewTypes,
    conditionalDiagramReviewTypes,
    entries,
    releaseState: "locked-until-all-item-release-bundles-pass-existing-contract-and-authenticated-signer"
  });

  return freeze({ manifest, proofMethods });
});
