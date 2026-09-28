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
  assert.equal(result.localEvidence.schemaVersion, "gfield-competition-evidence-v2");
  assert.deepEqual(result.student.scoreOnlyQuestionNumbers, [19]);
  assert.equal(result.student.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 24);
  assert.equal(result.localEvidence.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 25);
  assert.equal(result.localEvidence.diagnosticAxes.reduce(function (total, axis) { return total + axis.itemCount; }, 0), 24);
  assert.equal(result.teacher.questionEvidence.length, 25);
  assert.equal(result.teacher.questionEvidence[18].diagnosticUse, false);
  assert.equal(result.localEvidence.verifiedRealPaper, true);
  assert.equal(result.localEvidence.officialAwardPrediction, false);
  assert.equal(result.localEvidence.prediction.state, "collect-another-real-paper");
  assert.equal(result.localEvidence.priorityAxis, null);
  assert.equal(result.student.taxonomyReviewState, "pending");
  assert.doesNotMatch(JSON.stringify(result.localEvidence), /answerValue|sourceLocator|publishedSolutionLocator|privateScoring|sourcePageUrl/);
});

test("Q19 changes the printed-key score but cannot change pattern-diagnostic evidence", function () {
  const source = pack();
  const responses = source.items.map(function (item) { return item.privateScoring.answerValue; });
  const baseline = session.analyze(source, responses, { catalog, readiness });
  responses[18] = "0";
  const changed = session.analyze(source, responses, { catalog, readiness });
  assert.equal(changed.student.score.rawScore, baseline.student.score.rawScore - 4);
  const baselinePattern = baseline.student.axes.find(function (axis) { return axis.axisId === "patterns-algebra"; });
  const changedPattern = changed.student.axes.find(function (axis) { return axis.axisId === "patterns-algebra"; });
  assert.deepEqual(changedPattern, baselinePattern);
  assert.equal(changedPattern.itemCount, 3);
  assert.equal(changedPattern.evidenceState, "needs-more-evidence");
  assert.equal(changed.teacher.questionEvidence[18].workReviewRequired, true);
  assert.deepEqual(changed.localEvidence.scoreOnlyQuestionNumbers, [19]);
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
