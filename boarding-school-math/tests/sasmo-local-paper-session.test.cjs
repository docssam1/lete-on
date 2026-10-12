"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const session = require("../assessment/sasmo-local-paper-session.js");
const catalog = require("../competition/sasmo-mock-catalog.js");
const readiness = require("../assessment/sasmo-mock-readiness.js");

function pack() {
  const form = catalog.getForm(session.FORM_ID);
  return {
    schemaVersion: session.PACK_SCHEMA_VERSION,
    paper: {
      programId: "sasmo",
      year: 2019,
      levelId: "G6",
      sourceType: "third-party-public-reference",
      sourcePageUrl: "https://www.k12mathcontests.com/download/sasmo/2019/primary6",
      sourceFingerprintSha256: form.sourceFingerprintSha256,
      rightsState: "private-reference-only"
    },
    items: form.items.map(function (entry, index) {
      const multipleChoice = index < 15;
      return {
        itemId: `sasmo-2019-g6-q${String(index + 1).padStart(2, "0")}`,
        sourceLocator: `private paper question ${index + 1}`,
        axisId: entry.axisId,
        skillId: entry.skillId,
        responseType: multipleChoice ? "multiple-choice" : "numeric-exact",
        primaryErrorType: "reasoning-error",
        answerProof: {
          answerProof: "published-solution-plus-independent",
          publishedSolutionLocator: `private solution ${index + 1}`,
          independentSolveMethod: "independent arithmetic or exhaustive check",
          independentSolveConfirmed: true
        },
        privateScoring: { answerKind: multipleChoice ? "option-id" : "numeric-exact", answerValue: multipleChoice ? "B" : index === 15 ? "1/2" : String(index + 1) }
      };
    })
  };
}

test("a verified 2019 G6 private pack produces a 70-point answer-safe local report", function () {
  const source = pack();
  const responses = source.items.map(function (item) { return item.privateScoring.answerValue; });
  responses[15] = "2/4";
  const result = session.analyze(source, responses, { catalog, readiness });
  assert.equal(result.student.score.rawScore, 70);
  assert.equal(result.student.score.maxScore, 70);
  assert.equal(result.schemaVersion, "gfield-sasmo-local-paper-report-v6");
  assert.equal(result.localEvidence.schemaVersion, "gfield-competition-evidence-v6");
  assert.deepEqual(result.localEvidence.reviewQueue, []);
  assert.deepEqual(result.student.diagnosticExcludedQuestionNumbers, [9, 15, 19, 21]);
  assert.deepEqual(result.student.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(result.student.reviewRequiredQuestionNumbers, [9, 15, 21]);
  assert.equal(result.student.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 21);
  assert.equal(result.localEvidence.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 25);
  assert.equal(result.localEvidence.diagnosticAxes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 21);
  assert.equal(result.teacher.questionEvidence.length, 25);
  assert.equal(result.teacher.questionEvidence.reduce(function (sum, item) { return sum + item.pointsEarned; }, 0), 70);
  assert.deepEqual(Object.assign({}, result.teacher.questionEvidence[0], { skillId: null, axisId: null }), {
    questionNumber: 1,
    sectionId: "A",
    responseType: "multiple-choice",
    pointsPossible: 2,
    pointsEarned: 2,
    axisId: null,
    skillId: null,
    outcome: "correct",
    diagnosticUse: true,
    diagnosticEligibility: "eligible",
    diagnosticReasonCode: null,
    reviewCommentCode: "explain-strategy",
    workReviewRequired: false
  });
  assert.equal(result.teacher.questionEvidence[8].diagnosticUse, false);
  assert.equal(result.teacher.questionEvidence[8].diagnosticEligibility, "review-required");
  assert.equal(result.teacher.questionEvidence[8].diagnosticReasonCode, "language-determinacy-review");
  assert.equal(result.teacher.questionEvidence[8].workReviewRequired, true);
  assert.equal(result.teacher.questionEvidence[14].diagnosticUse, false);
  assert.equal(result.teacher.questionEvidence[14].diagnosticEligibility, "review-required");
  assert.equal(result.teacher.questionEvidence[14].diagnosticReasonCode, "nonunique-rule");
  assert.equal(result.teacher.questionEvidence[14].workReviewRequired, true);
  assert.equal(result.teacher.questionEvidence[18].diagnosticUse, false);
  assert.equal(result.teacher.questionEvidence[18].diagnosticEligibility, "score-only");
  assert.equal(result.teacher.questionEvidence[18].diagnosticReasonCode, "nonunique-rule");
  assert.equal(result.teacher.questionEvidence[20].diagnosticUse, false);
  assert.equal(result.teacher.questionEvidence[20].diagnosticEligibility, "review-required");
  assert.equal(result.teacher.questionEvidence[20].diagnosticReasonCode, "whole-number-zero-scope-review");
  assert.equal(result.teacher.questionEvidence[20].workReviewRequired, true);
  assert.equal(result.localEvidence.verifiedRealPaper, true);
  assert.equal(result.localEvidence.officialAwardPrediction, false);
  assert.equal(result.localEvidence.prediction.state, "collect-another-real-paper");
  assert.equal(result.localEvidence.priorityAxis, null);
  assert.equal(result.student.taxonomyReviewState, "pending");
  assert.doesNotMatch(JSON.stringify(result.localEvidence), /answerValue|sourceLocator|publishedSolutionLocator|privateScoring|sourcePageUrl/);
});

test("v6 exports only a neutral first-attempt review queue and reconciles it to the 70-point score", function () {
  const source = pack();
  const responses = source.items.map(function (item) { return item.privateScoring.answerValue; });
  responses[0] = source.items[0].privateScoring.answerValue === "A" ? "B" : "A";
  responses[1] = "";
  responses[15] = source.items[15].privateScoring.answerValue === "0" ? "1" : "0";
  const result = session.analyze(source, responses, { catalog, readiness });
  assert.equal(result.student.score.rawScore, 61);
  assert.deepEqual(result.localEvidence.reviewQueue, [
    { questionNumber: 1, sectionId: "A", outcome: "incorrect", pointsEarned: -1, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" },
    { questionNumber: 2, sectionId: "A", outcome: "blank", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "identify-starting-barrier" },
    { questionNumber: 16, sectionId: "B", outcome: "incorrect", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" }
  ]);
  assert.equal(result.localEvidence.reviewQueue.length, result.localEvidence.score.incorrect + result.localEvidence.score.blank);
  assert.doesNotMatch(JSON.stringify(result.localEvidence.reviewQueue), /answer|axis|skill|error|source|locator/i);
});

test("Q9, Q15, Q19, and Q21 change the printed-key score but cannot change diagnostic evidence", function () {
  const source = pack();
  const responses = source.items.map(function (item) { return item.privateScoring.answerValue; });
  const baseline = session.analyze(source, responses, { catalog, readiness });
  responses[8] = source.items[8].privateScoring.answerValue === "A" ? "B" : "A";
  const changedNine = session.analyze(source, responses, { catalog, readiness });
  assert.equal(changedNine.student.score.rawScore, baseline.student.score.rawScore - 3);
  assert.deepEqual(changedNine.student.axes, baseline.student.axes);
  responses[8] = source.items[8].privateScoring.answerValue;
  responses[14] = source.items[14].privateScoring.answerValue === "A" ? "B" : "A";
  const changedFifteen = session.analyze(source, responses, { catalog, readiness });
  assert.equal(changedFifteen.student.score.rawScore, baseline.student.score.rawScore - 3);
  assert.deepEqual(changedFifteen.student.axes, baseline.student.axes);
  responses[14] = source.items[14].privateScoring.answerValue;
  responses[18] = "0";
  const changed = session.analyze(source, responses, { catalog, readiness });
  assert.equal(changed.student.score.rawScore, baseline.student.score.rawScore - 4);
  const baselinePattern = baseline.student.axes.find(function (axis) { return axis.axisId === "patterns-algebra"; });
  const changedPattern = changed.student.axes.find(function (axis) { return axis.axisId === "patterns-algebra"; });
  assert.deepEqual(changedPattern, baselinePattern);
  assert.equal(changedPattern.itemCount, 2);
  assert.equal(changedPattern.evidenceState, "needs-more-evidence");
  assert.equal(changed.teacher.questionEvidence[18].workReviewRequired, true);
  responses[18] = source.items[18].privateScoring.answerValue;
  responses[20] = "0";
  const changedTwentyOne = session.analyze(source, responses, { catalog, readiness });
  assert.equal(changedTwentyOne.student.score.rawScore, baseline.student.score.rawScore - 4);
  assert.deepEqual(changedTwentyOne.student.axes, baseline.student.axes);
  assert.equal(changedTwentyOne.teacher.questionEvidence[20].workReviewRequired, true);
  assert.deepEqual(changed.localEvidence.diagnosticExcludedQuestionNumbers, [9, 15, 19, 21]);
  assert.deepEqual(changed.localEvidence.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(changed.localEvidence.reviewRequiredQuestionNumbers, [9, 15, 21]);
});

test("Section A keeps negative marking and unanswered items stay blank", function () {
  const source = pack();
  const responses = Array.from({ length: 25 }, function () { return ""; });
  responses[0] = "A";
  responses[1] = "B";
  const result = session.analyze(source, responses, { catalog, readiness });
  assert.equal(result.student.score.rawScore, 1);
  assert.equal(result.student.score.correct, 1);
  assert.equal(result.student.score.incorrect, 1);
  assert.equal(result.student.score.blank, 23);
  assert.equal(result.teacher.questionEvidence[0].pointsEarned, -1);
  assert.equal(result.teacher.questionEvidence[0].reviewCommentCode, "locate-first-divergence");
  assert.equal(result.teacher.questionEvidence[1].pointsEarned, 2);
  assert.equal(result.teacher.questionEvidence[2].pointsEarned, 0);
  assert.equal(result.teacher.questionEvidence[2].reviewCommentCode, "identify-starting-barrier");
  assert.equal(result.teacher.questionEvidence.reduce(function (sum, item) { return sum + item.pointsEarned; }, 0), result.student.score.rawScore);
});

test("item scoring separates Section A penalties from Section B review comments", function () {
  const source = pack();
  const responses = Array(25).fill("");
  responses[0] = "A";
  responses[15] = "0";
  responses[16] = source.items[16].privateScoring.answerValue;
  const result = session.analyze(source, responses, { catalog, readiness });
  const first = result.teacher.questionEvidence[0];
  const sixteenth = result.teacher.questionEvidence[15];
  const seventeenth = result.teacher.questionEvidence[16];
  assert.equal(result.student.score.rawScore, 3);
  assert.deepEqual([first.sectionId, first.pointsPossible, first.pointsEarned, first.outcome], ["A", 2, -1, "incorrect"]);
  assert.deepEqual([sixteenth.sectionId, sixteenth.pointsPossible, sixteenth.pointsEarned, sixteenth.outcome], ["B", 4, 0, "incorrect"]);
  assert.deepEqual([seventeenth.sectionId, seventeenth.pointsPossible, seventeenth.pointsEarned, seventeenth.outcome], ["B", 4, 4, "correct"]);
  assert.equal(first.reviewCommentCode, "locate-first-divergence");
  assert.equal(sixteenth.reviewCommentCode, "locate-first-divergence");
  assert.equal(seventeenth.reviewCommentCode, "explain-strategy");
  assert.equal(result.teacher.questionEvidence.reduce(function (sum, item) { return sum + item.pointsEarned; }, 0), result.student.score.rawScore);
});

test("all incorrect responses yield a complete negative-score report and answer-safe record", function () {
  const source = pack();
  const responses = Array(15).fill("A").concat(Array(10).fill("0"));
  const result = session.analyze(source, responses, { catalog, readiness });
  assert.equal(result.student.score.rawScore, -15);
  assert.equal(result.student.readiness.band.id, "foundation");
  assert.equal(result.localEvidence.score.rawScore, -15);
  assert.equal(result.localEvidence.score.incorrect, 25);
  assert.deepEqual(result.student.weaknesses, []);
  assert.deepEqual(result.localEvidence.weaknesses, []);
  assert.equal(result.localEvidence.priorityAxis, null);
});

test("the browser scorer blocks unverified answers, a wrong form taxonomy, and malformed numeric input", function () {
  const unverified = pack();
  unverified.items[0].answerProof.independentSolveConfirmed = false;
  assert.throws(function () { session.validatePack(unverified); }, /ANSWER_PROOF_UNVERIFIED/);

  const mismatched = pack();
  mismatched.items[0].axisId = "geometry-spatial";
  assert.throws(function () { session.analyze(mismatched, Array(25).fill(""), { catalog, readiness }); }, /FORM_TAXONOMY_MISMATCH/);
  assert.throws(function () { session.normalizeResponses(Array(15).fill("").concat(["not-a-number"], Array(9).fill(""))); }, /RESPONSE_VALUE_INVALID/);
});
