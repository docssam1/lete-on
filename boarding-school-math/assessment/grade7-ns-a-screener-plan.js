(function (root, factory) {
  const registry = typeof module === "object" && module.exports
    ? require("../curriculum/us-k8-content-registry.js")
    : root.GFIELDUSK8ContentRegistry;
  const api = factory(registry);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade7NSAScreenerPlan = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (registry) {
  "use strict";

  if (!registry) throw new Error("GFIELDUSK8ContentRegistry is required");

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }

  const unit = registry.units.find(function (candidate) { return candidate.clusterId === "7.NS.A"; });
  if (!unit || unit.grade !== 7 || unit.standardRange !== "7.NS.A.1-3") {
    throw new Error("7.NS.A must map to the registered Grade 7 unit");
  }

  const focusSpecs = freeze([
    {
      focusId: "7.NS.A.1a",
      sourceLocator: "printed p.48; PDF p.47",
      officialRequirementSummary: "describe situations in which opposite quantities combine to zero",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "identify a valid situation in which opposite quantities combine to zero", evidenceTarget: "context-selection-opposites-zero" },
        { difficulty: "core", responseType: "constructed-response", mathematicalAction: "describe and justify a situation in which opposite rational quantities combine to zero", evidenceTarget: "learner-described-opposites-zero-context" }
      ]
    },
    {
      focusId: "7.NS.A.1b",
      sourceLocator: "printed p.48; PDF p.47",
      officialRequirementSummary: "model rational sums by signed distance and direction, verify additive inverses, and interpret sums in context",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "select a number-line model whose distance and direction represent a rational sum", evidenceTarget: "number-line-distance-direction", visualRequirement: "calculated-number-line-required" },
        { difficulty: "core", responseType: "numeric", mathematicalAction: "determine a contextual rational sum from a number-line movement and verify an additive-inverse case", evidenceTarget: "contextual-sum-and-additive-inverse", visualRequirement: "calculated-number-line-required" }
      ]
    },
    {
      focusId: "7.NS.A.1c",
      sourceLocator: "printed p.48; PDF p.47",
      officialRequirementSummary: "treat subtraction as addition of the opposite and use absolute difference for number-line distance in context",
      profiles: [
        { difficulty: "core", responseType: "multiple-choice", mathematicalAction: "rewrite rational subtraction as addition of the opposite", evidenceTarget: "subtraction-to-additive-inverse" },
        { difficulty: "advanced", responseType: "numeric", mathematicalAction: "find a contextual number-line distance as the absolute value of a rational difference", evidenceTarget: "contextual-absolute-difference-distance", visualRequirement: "calculated-number-line-required" }
      ]
    },
    {
      focusId: "7.NS.A.1d",
      sourceLocator: "printed p.48; PDF p.47",
      officialRequirementSummary: "use operation properties as strategies for rational addition and subtraction",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "recognize a valid operation-property strategy for rational addition or subtraction", evidenceTarget: "property-strategy-recognition" },
        { difficulty: "advanced", responseType: "constructed-response", mathematicalAction: "apply and justify an operation-property strategy for rational addition or subtraction", evidenceTarget: "property-strategy-application-and-justification" }
      ]
    },
    {
      focusId: "7.NS.A.2a",
      sourceLocator: "printed pp.48-49; PDF pp.47-48",
      officialRequirementSummary: "extend multiplication through operation properties, justify signed products, and interpret products in context",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "recognize a property-grounded signed-product rule in a real-world context", evidenceTarget: "property-grounded-product-context" },
        { difficulty: "core", responseType: "numeric", mathematicalAction: "calculate a signed rational product while preserving the contextual sign meaning", evidenceTarget: "exact-signed-rational-product" }
      ]
    },
    {
      focusId: "7.NS.A.2b",
      sourceLocator: "printed p.49; PDF p.48",
      officialRequirementSummary: "divide integers only by nonzero divisors, recognize rational quotients and equivalent sign placements, and interpret quotients in context",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "recognize a valid nonzero-divisor rational quotient and its equivalent sign placements in context", evidenceTarget: "quotient-domain-sign-and-context" },
        { difficulty: "advanced", responseType: "numeric", mathematicalAction: "calculate and reverse-check a contextual signed rational quotient with a nonzero divisor", evidenceTarget: "exact-contextual-signed-quotient" }
      ]
    },
    {
      focusId: "7.NS.A.2c",
      sourceLocator: "printed p.49; PDF p.48",
      officialRequirementSummary: "use operation properties as strategies for rational multiplication and division",
      profiles: [
        { difficulty: "core", responseType: "multiple-choice", mathematicalAction: "recognize a valid operation-property strategy for rational multiplication or division", evidenceTarget: "multiplicative-property-strategy-recognition" },
        { difficulty: "advanced", responseType: "constructed-response", mathematicalAction: "apply and justify an operation-property strategy for rational multiplication or division", evidenceTarget: "multiplicative-property-strategy-application-and-justification" }
      ]
    },
    {
      focusId: "7.NS.A.2d",
      sourceLocator: "printed p.49; PDF p.48",
      officialRequirementSummary: "use long division to convert rational numbers and distinguish terminating from eventually repeating decimals",
      profiles: [
        { difficulty: "foundation", responseType: "multiple-choice", mathematicalAction: "classify a rational decimal as terminating or eventually repeating from valid division evidence", evidenceTarget: "decimal-form-classification" },
        { difficulty: "advanced", responseType: "short-answer", mathematicalAction: "show long-division evidence and record the exact terminating or repeating decimal form", evidenceTarget: "long-division-and-exact-decimal-form" }
      ]
    },
    {
      focusId: "7.NS.A.3",
      sourceLocator: "printed p.49 and footnote; PDF p.48",
      officialRequirementSummary: "solve real-world and mathematical problems using the four rational-number operations, including eligible complex fractions",
      profiles: [
        { difficulty: "core", responseType: "multiple-choice", mathematicalAction: "solve a real-world multi-operation rational-number problem with units", evidenceTarget: "real-world-rational-operation-problem" },
        { difficulty: "advanced", responseType: "multiple-choice", mathematicalAction: "solve a mathematical multi-operation rational-number problem that may include a complex fraction", evidenceTarget: "mathematical-rational-operation-problem" }
      ]
    }
  ]);

  const slots = [];
  focusSpecs.forEach(function (spec) {
    spec.profiles.forEach(function (profile, index) {
      const responseType = profile.responseType;
      slots.push(freeze({
        slotId: `slot-bdg-g7-nsa-${spec.focusId.split(".").pop()}-${String(index + 1).padStart(2, "0")}`,
        unitId: unit.unitId,
        clusterId: unit.clusterId,
        skillId: registry.skillIdForCluster(unit.clusterId),
        standardRange: unit.standardRange,
        standardFocus: spec.focusId,
        sourceLocator: spec.sourceLocator,
        officialRequirementSummary: spec.officialRequirementSummary,
        mathematicalAction: profile.mathematicalAction,
        evidenceTarget: profile.evidenceTarget,
        visualRequirement: profile.visualRequirement || "diagram-review-required-only-if-approved-public-item-uses-diagram-or-asset",
        domainId: "G7-NS",
        difficulty: profile.difficulty,
        responseType,
        scoringMode: ["short-answer", "constructed-response"].includes(responseType) ? "teacher" : "automatic",
        maxPoints: 1,
        itemId: null,
        itemVersion: null,
        releaseState: "locked-awaiting-new-reviewed-diagnostic-item"
      }));
    });
  });

  const plan = freeze({
    schemaVersion: "gfield-unit-screener-plan-v1",
    id: "asm-bdg-grade7-nsa-screener-plan-v1",
    planContractSha256: "d58d1b6c07c4ddf185610b574eff0d64ec61ef27a0ef2fd0990e8915fb464a81",
    programId: registry.COURSE_ID,
    targetGrade: 7,
    learnerStage: "US Grade 7 ages 12-13",
    purpose: "unit-screener",
    plannedItemCount: 18,
    deliveryRequirement: "authenticated-assessment-only",
    presentationOrderState: "fixed-stratified-template-only-server-seeded-order-pending",
    officialSource: freeze({
      title: "Common Core State Standards for Mathematics",
      authority: "Common Core State Standards Initiative",
      url: "https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf",
      section: "Grade 7 | The Number System | 7.NS.A.1-3",
      printedPages: "48-49",
      pdfPages: "47-48",
      verifiedOn: "2026-10-14",
      mappingState: "official-source-verified-paraphrase-only"
    }),
    standardDecompositionState: "official-source-reviewed-paraphrase-map-awaiting-sol-ultra-item-authoring-and-independent-review",
    coverageBoundary: "two planned observations per focus are evidence samples and cannot establish full-standard mastery",
    itemIndependence: "new-unseen-diagnostic-items-required-workbook-items-may-inform-structure-but-must-not-be-reused",
    releaseState: "locked-awaiting-new-reviewed-items-server-signature-and-teacher-approval",
    claimsOfficialNationalCut: false,
    resultContract: freeze({
      unitStrengthWeaknessSignalAllowedAfterReview: true,
      automaticPrescriptionAllowed: false,
      coursePlacementAllowed: false,
      promotionDecisionAllowed: false,
      competitionScorePredictionAllowed: false,
      fullStandardMasteryClaimAllowed: false,
      teacherConfirmationRequired: true,
      minimumReviewedObservationsPerFocus: 2
    }),
    learnerFitGate: freeze({
      id: "learner-fit",
      learnerStage: "US Grade 7 ages 12-13",
      state: "pending-item-level-review",
      criteria: freeze(["language", "representations", "prerequisites", "reasoning-load", "response-mode"])
    }),
    slots: freeze(slots)
  });

  return freeze({ focusSpecs, plan });
});
