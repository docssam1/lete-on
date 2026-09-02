"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { applyReviewGates } = require("../scripts/apply-saengsu-review-gates.cjs");

function candidateDb() {
  return {
    schemaVersion: "highselect-private-saengsu-candidate-db/v1",
    summary: { questionCount: 2, typeCount: 2, usageApprovedCount: 0 },
    types: [
      { candidateTypeId: "SMTYPE-A", canonicalMergeStatus: "pending", detailType: "유형 A" },
      { candidateTypeId: "SMTYPE-B", canonicalMergeStatus: "pending", detailType: "유형 B" }
    ],
    questions: [
      { questionId: "SM-LEGACY-R01-Q01", candidateTypeId: "SMTYPE-A", responseEvidence: { keySectionPresent: true, explanationPresent: true, independentCorrectnessVerified: false }, usageApproved: false, releaseStatus: "locked" },
      { questionId: "SM-LEGACY-R01-Q02", candidateTypeId: "SMTYPE-B", responseEvidence: { keySectionPresent: true, explanationPresent: true, independentCorrectnessVerified: false }, usageApproved: false, releaseStatus: "locked" }
    ]
  };
}

test("applies evidence-only answer and taxonomy reviews while preserving release locks", () => {
  const output = applyReviewGates(candidateDb(), {
    reviews: [{
      questionId: "SM-LEGACY-R01-Q01",
      status: "verified",
      officialKeyMatch: true,
      singleAnswerConfirmed: true,
      diagramObservabilityConfirmed: true,
      evidenceLocator: "private-review:r01:q01",
      verifier: "independent-reviewer"
    }]
  }, {
    reviews: [{
      candidateTypeId: "SMTYPE-A",
      decision: "merge_existing",
      target: { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-TYPE-1" },
      confidence: 0.98,
      evidenceLocator: "taxonomy-review:batch1:a"
    }]
  });
  assert.equal(output.questions[0].responseEvidence.independentCorrectnessVerified, true);
  assert.equal(output.questions[0].answerVerification.status, "verified");
  assert.equal(output.questions[1].answerVerification.status, "blocked");
  assert.equal(output.questions.every(item => item.usageApproved === false && item.releaseStatus === "locked"), true);
  assert.equal(output.types[0].canonicalMergeStatus, "merge_existing");
  assert.deepEqual(output.types[0].canonicalTarget, { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-TYPE-1" });
  assert.equal(output.types[1].canonicalMergeStatus, "pending");
  assert.deepEqual(output.summary.answerVerification, { verified: 1, disputed: 0, blocked: 1 });
  assert.equal(output.summary.typeReview.merge_existing, 1);
  assert.equal(output.summary.typeReview.pending, 1);
  assert.equal(JSON.stringify(output).includes("answerValue"), false);
});

test("fails closed for unsupported verification or taxonomy decisions", () => {
  assert.throws(() => applyReviewGates(candidateDb(), { reviews: [{ questionId: "SM-LEGACY-R01-Q01", status: "verified", officialKeyMatch: false, singleAnswerConfirmed: true, evidenceLocator: "x" }] }, { reviews: [] }), /match the official key/);
  assert.throws(() => applyReviewGates(candidateDb(), { reviews: [] }, { reviews: [{ candidateTypeId: "SMTYPE-A", decision: "merge_existing" }] }), /requires a target/);
  assert.throws(() => applyReviewGates(candidateDb(), { reviews: [{ questionId: "UNKNOWN", status: "blocked" }] }, { reviews: [] }), /unknown question/);
  assert.throws(() => applyReviewGates(candidateDb(), { reviews: [] }, { reviews: [{ candidateTypeId: "UNKNOWN", decision: "locked" }] }), /unknown type/);
});

test("does not let an answer review grant use or release approval", () => {
  const source = candidateDb();
  source.questions[0].usageApproved = true;
  source.questions[0].releaseStatus = "released";
  const output = applyReviewGates(source, { reviews: [] }, { reviews: [] });
  assert.equal(output.questions[0].usageApproved, false);
  assert.equal(output.questions[0].releaseStatus, "locked");
  assert.equal(output.summary.usageApprovedCount, 0);
});

test("accepts a private independent-audit shape without copying answer values", () => {
  const output = applyReviewGates(candidateDb(), {
    auditId: "SM-R01-INDEPENDENT-ANSWER-VERIFY",
    createdAt: "2026-08-31T19:30:00+09:00",
    questions: [
      { questionId: "SM-R01-Q01", independentAnswer: "protected", officialAnswerMatch: true, status: "verified", ambiguity: false, diagramDependency: "high" },
      { questionId: "SM-R01-Q02", independentAnswer: "protected", officialAnswerMatch: false, status: "locked", ambiguity: true, diagramDependency: "none" }
    ]
  }, { reviews: [] });
  assert.equal(output.questions[0].answerVerification.status, "verified");
  assert.equal(output.questions[0].responseEvidence.singleAnswerConfirmed, true);
  assert.equal(output.questions[0].responseEvidence.diagramObservabilityConfirmed, false);
  assert.equal(output.questions[1].answerVerification.status, "disputed");
  assert.equal(JSON.stringify(output).includes("protected"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(output.questions[0], "independentAnswer"), false);
});

test("normalizes reviewed crosswalk recommendations without auto-releasing types", () => {
  const output = applyReviewGates(candidateDb(), { reviews: [] }, {
    schemaVersion: "saengsu-type-crosswalk-human-review-v1",
    generatedAt: "2026-08-31T20:00:00+09:00",
    reviews: [
      { candidateTypeId: "SMTYPE-A", recommendedDecision: "alias_existing", targetTypeId: "DP-TYP-ABC", confidence: 0.8 },
      { candidateTypeId: "SMTYPE-B", recommendedDecision: "alias_internal_group", internalCanonicalGroupId: "SM-GRP-1", confidence: 0.7 }
    ]
  });
  assert.equal(output.types[0].canonicalMergeStatus, "alias_existing");
  assert.deepEqual(output.types[0].canonicalTarget, { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-TYP-ABC" });
  assert.equal(output.types[1].canonicalMergeStatus, "alias_internal_group");
  assert.equal(output.types[1].canonicalInternalGroupId, "SM-GRP-1");
  assert.equal(output.questions.every(item => item.releaseStatus === "locked"), true);
});

test("combines independent audit batches and preserves a matched but ambiguous item as blocked", () => {
  const output = applyReviewGates(candidateDb(), [
    { questions: [{ questionId: "SM-R01-Q01", verificationStatus: "verified", officialAnswerMatch: true, ambiguity: { hasAmbiguity: false }, diagramDependency: { visibleEnough: true } }] },
    { questions: [{ questionId: "SM-R01-Q02", verificationStatus: "locked", officialAnswerMatch: true, ambiguity: { hasAmbiguity: true }, diagramDependency: { visibleEnough: true } }] }
  ], { reviews: [] });
  assert.equal(output.questions[0].answerVerification.status, "verified");
  assert.equal(output.questions[0].responseEvidence.diagramObservabilityConfirmed, true);
  assert.equal(output.questions[1].answerVerification.status, "blocked");
  assert.equal(output.questions[1].responseEvidence.independentCorrectnessVerified, false);
});

test("combines crosswalk batches and normalizes source-bank and exclusion decisions", () => {
  const output = applyReviewGates(candidateDb(), { reviews: [] }, [
    { reviews: [{ candidateTypeId: "SMTYPE-A", recommendedDecision: "alias_existing", targetTypeId: "SH-TYP-123", targetDefinition: { sourceBankId: "HWANGSO-MIDDLE" } }] },
    { reviews: [{ candidateTypeId: "SMTYPE-B", recommendedDecision: "locked/excluded" }] }
  ]);
  assert.deepEqual(output.types[0].canonicalTarget, { sourceBankId: "HWANGSO-MIDDLE", sourceTypeId: "SH-TYP-123" });
  assert.equal(output.types[1].canonicalMergeStatus, "excluded");
});

test("uses a private representative type id for an internal alias group without treating it as an external merge", () => {
  const output = applyReviewGates(candidateDb(), { reviews: [] }, {
    reviews: [{ candidateTypeId: "SMTYPE-A", recommendedDecision: "alias_internal_group", targetTypeId: "SMTYPE-B", targetDefinition: { sourceBankId: "SAENGSU-CM1-LEGACY" } }]
  });
  assert.equal(output.types[0].canonicalMergeStatus, "alias_internal_group");
  assert.equal(output.types[0].canonicalTarget, null);
  assert.equal(output.types[0].canonicalInternalGroupId, "representative:SMTYPE-B");
});
