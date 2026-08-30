const test = require("node:test");
const assert = require("node:assert/strict");
const diagnostic = require("../competition/sasmo-diagnostic-foundation.js");

test("SASMO diagnostic foundation declares verified official 2019 and 2020 intake routes for G2 through G10", function () {
  assert.deepEqual(diagnostic.YEAR_IDS, [2019, 2020]);
  assert.deepEqual(diagnostic.LEVEL_IDS, ["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"]);
  diagnostic.YEAR_IDS.forEach(function (year) {
    const source = diagnostic.getYearSource(year);
    assert.match(source.sourcePageUrl, /^https:\/\/form\.simcc\.org\//);
    assert.equal(source.sourceDelivery, "external-official-source");
    assert.equal(source.solutionProof, "official-answer-and-solution");
    assert.deepEqual(source.levelIds, diagnostic.LEVEL_IDS);
  });
  assert.equal(diagnostic.getDiagnosticReadiness(2020, "g6").available, true);
  assert.equal(diagnostic.getDiagnosticReadiness(2020, "G11").releaseState, "locked");
});

test("SASMO answer verification blocks guesses and requires two independent matching solves when no official proof exists", function () {
  assert.deepEqual(diagnostic.validatePrivateItemEvidence({ itemId: "sasmo-2020-g6-q01", sourceLocator: "page 1", answerProof: "unverified" }), {
    valid: false,
    errors: ["An unverified answer cannot be scored or released."],
    releaseState: "locked"
  });
  assert.equal(diagnostic.validatePrivateItemEvidence({
    itemId: "sasmo-2020-g6-q01",
    sourceLocator: "page 1",
    answerProof: "independent-dual-solve",
    independentSolverIds: ["solver-a", "solver-b"],
    solversAgree: true
  }).valid, true);
  assert.equal(diagnostic.validatePrivateItemEvidence({
    itemId: "sasmo-2020-g6-q01",
    sourceLocator: "page 1",
    answerProof: "independent-dual-solve",
    independentSolverIds: ["solver-a", "solver-a"],
    solversAgree: true
  }).releaseState, "locked");
});

test("SASMO diagnostic foundation is public-safe and frozen", function () {
  assert.deepEqual(diagnostic.validateFoundation(), { valid: true, errors: [] });
  const text = JSON.stringify(diagnostic.foundation);
  assert.doesNotMatch(text, /https?:[^"\s]+\.pdf(?:["\s]|$)/i);
  assert.doesNotMatch(text, /\b(questionText|questionContent|officialProblem|answerKey|workedSolution|answerValue|solutionText)\b/i);
  assert.equal(Object.isFrozen(diagnostic), true);
  assert.equal(Object.isFrozen(diagnostic.foundation.yearSources[0]), true);
});
