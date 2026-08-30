const test = require("node:test");
const assert = require("node:assert/strict");
const report = require("../scripts/analyze-private-sasmo-mock.cjs");
const pack = require("../scripts/validate-private-sasmo-diagnostic.cjs");

function referencePack() {
  return {
    schemaVersion: pack.REFERENCE_SCHEMA_VERSION,
    paper: { programId: "sasmo", year: 2019, levelId: "G6", sourceType: "third-party-public-reference", sourcePageUrl: "https://www.k12mathcontests.com/download/sasmo/2019/primary6", sourceFingerprintSha256: "a".repeat(64), rightsState: "private-reference-only" },
    items: Array.from({ length: 25 }, function (_, index) {
      return { itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`, sourceLocator: `private:p${index + 1}`, axisId: ["number-operations", "patterns-algebra", "geometry-spatial", "combinatorics-logic", "data-probability", "problem-solving-strategies"][index % 6], skillId: ["digit-product-sum", "two-set-inclusion-exclusion", "polyhedron-edge-count", "adjacent-block-arrangements", "reverse-percent-total", "square-equilateral-angle-chase", "relational-coin-equations", "digit-parity-divisibility", "whole-number-frequency-count", "net-rate-leakage", "weekday-cycle", "clock-hand-overlap", "truth-statement-cases", "factorial-prime-coverage", "figure-composition-rule", "composite-triangle-count", "geometric-fraction-sum", "repeated-percent-change", "calendar-sequence-encoding", "multi-ratio-total", "parity-minimum-selection", "rate-cycle-lcm", "composite-shaded-area", "cryptarithm-column-constraints", "calendar-digit-count"][index], responseType: index < 15 ? "multiple-choice" : "numeric-exact", primaryErrorType: "reasoning-error", answerProof: { answerProof: "published-solution-plus-independent", publishedSolutionLocator: `private:s${index + 1}`, independentSolveMethod: "independent check", independentSolveConfirmed: true }, privateScoring: { answerKind: index < 15 ? "option-id" : "numeric-exact", answerValue: index < 15 ? "A" : "7" } };
    })
  };
}

test("private SASMO report emits student and teacher evidence without answers or source locators", function () {
  const source = referencePack();
  pack.validatePack(source);
  const payload = { formId: "sasmo-2019-g6-baseline-a", responses: new Map(Array.from({ length: 25 }, function (_, index) { return [index + 1, index < 15 ? "A" : "7"]; })), history: null, targetScore: null };
  const result = report.reportFor(source, payload);
  assert.equal(result.student.score.rawScore, 70);
  assert.equal(result.teacher.questionEvidence.length, 25);
  assert.equal(result.officialAwardPrediction, false);
  assert.doesNotMatch(JSON.stringify(result), /answerValue|sourceLocator|private:s/i);
});

test("private SASMO report requires the real-paper form and keeps a wrong answer as review evidence", function () {
  const source = referencePack();
  const payload = { formId: "sasmo-2019-g6-baseline-a", responses: new Map(Array.from({ length: 25 }, function (_, index) { return [index + 1, ""]; })), history: null, targetScore: null };
  const result = report.reportFor(source, payload);
  assert.equal(result.teacher.questionEvidence[0].outcome, "blank");
  assert.equal(result.teacher.questionEvidence[0].workReviewRequired, true);
  assert.match(result.teacher.followUpRule, /patterns only/i);
});
