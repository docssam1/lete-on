const test = require("node:test");
const assert = require("node:assert/strict");
const readiness = require("../assessment/sasmo-mock-readiness.js");
const catalog = require("../competition/sasmo-mock-catalog.js");

function form() {
  return {
    schemaVersion: readiness.SCHEMA_VERSION,
    formId: "sasmo-2019-g6-baseline-a",
    formVersion: "2019-g6-r1",
    programId: "sasmo",
    year: 2019,
    levelId: "G6",
    comparisonKey: "sasmo:g6:15x2-1_10x4:v1",
    scoringFingerprintSha256: catalog.getForm("sasmo-2019-g6-baseline-a").scoringFingerprintSha256,
    sourceFingerprintSha256: catalog.getForm("sasmo-2019-g6-baseline-a").sourceFingerprintSha256,
    packFingerprintSha256: catalog.getForm("sasmo-2019-g6-baseline-a").packFingerprintSha256,
    sourceState: "private-verified-reference",
    sections: [
      { id: "A", firstQuestionNumber: 1, itemCount: 15, correctPoints: 2, incorrectPoints: -1, blankPoints: 0 },
      { id: "B", firstQuestionNumber: 16, itemCount: 10, correctPoints: 4, incorrectPoints: 0, blankPoints: 0 }
    ],
    items: Array.from({ length: 25 }, function (_, index) {
      return { questionNumber: index + 1, axisId: readiness.AXIS_IDS[index % readiness.AXIS_IDS.length], skillId: `skill-${String(index + 1).padStart(2, "0")}` };
    })
  };
}
function policy() {
  return { bands: [
    { id: "foundation", minPercent: 0, label: "기초 보완" },
    { id: "core", minPercent: 45, label: "핵심 정착" },
    { id: "practice", minPercent: 65, label: "실전 진입" },
    { id: "challenge", minPercent: 82, label: "상위권 도전" }
  ] };
}
function attempt(outcomes) {
  return { formId: "sasmo-2019-g6-baseline-a", outcomes: outcomes.map(function (outcome, index) { return { questionNumber: index + 1, outcome }; }) };
}
function historyEntry(formId, rawScore, sourceFingerprintSha256) {
  const reference = catalog.getForm("sasmo-2019-g6-baseline-a");
  return { formId, formVersion: "verified-r1", levelId: "G6", comparisonKey: reference.comparisonKey, scoringFingerprintSha256: reference.scoringFingerprintSha256, sourceFingerprintSha256, rawScore, maxScore: 70, verifiedRealPaper: true };
}

test("SASMO readiness preserves the 15/10 question and negative-mark scoring contract", function () {
  const outcomes = Array.from({ length: 25 }, function (_, index) { return index < 15 ? "correct" : "blank"; });
  outcomes[0] = "incorrect";
  const report = readiness.analyzeAttempt(form(), attempt(outcomes), policy(), {});
  assert.equal(report.score.rawScore, 27);
  assert.equal(report.score.maxScore, 70);
  assert.equal(report.score.sections[0].rawScore, 27);
  assert.equal(report.score.sections[1].rawScore, 0);
  assert.equal(report.readiness.notAnOfficialAward, true);
  assert.equal(report.prediction.state, "collect-another-real-paper");
});

test("readiness trend uses only verified real 70-point paper history and is visibly non-official", function () {
  const outcomes = Array.from({ length: 25 }, function () { return "correct"; });
  const report = readiness.analyzeAttempt(form(), attempt(outcomes), policy(), {
    targetScore: 55,
    history: [
      historyEntry("sasmo-2018-g6-baseline-a", 48, "b".repeat(64)),
      historyEntry("sasmo-2020-g6-baseline-b", 56, "c".repeat(64))
    ]
  });
  assert.equal(report.prediction.state, "preliminary-real-paper-trend");
  assert.equal(report.prediction.officialAwardPrediction, false);
  assert.ok(report.prediction.targetScoreProbabilityPercent >= 0 && report.prediction.targetScoreProbabilityPercent <= 100);
  assert.throws(function () {
    readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { targetScore: 55, history: [Object.assign(historyEntry("sasmo-2018-g6-baseline-a", 48, "b".repeat(64)), { verifiedRealPaper: false }), historyEntry("sasmo-2020-g6-baseline-b", 56, "c".repeat(64))] });
  }, /history must contain verified/);
});

test("all wrong Section A answers still produce a foundation report at a negative total", function () {
  const report = readiness.analyzeAttempt(form(), attempt(Array(25).fill("incorrect")), policy(), {});
  assert.equal(report.score.rawScore, -15);
  assert.equal(report.score.maxScore, 70);
  assert.equal(report.readiness.band.id, "foundation");
  assert.equal(report.prediction.state, "collect-another-real-paper");
});

test("a retake, repeated source, or different grading contract cannot create a trend", function () {
  const outcomes = Array(25).fill("correct");
  const base = historyEntry("sasmo-2018-g6-baseline-a", 48, "b".repeat(64));
  const cases = [
    [base, historyEntry("sasmo-2018-g6-baseline-a", 52, "c".repeat(64))],
    [base, historyEntry("sasmo-2020-g6-baseline-b", 52, "b".repeat(64))],
    [base, Object.assign(historyEntry("sasmo-2020-g6-baseline-b", 52, "c".repeat(64)), { levelId: "G5" })]
  ];
  cases.forEach(function (history) {
    const prediction = readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { history }).prediction;
    assert.equal(prediction.state, "incomparable-real-paper-history");
    assert.equal(prediction.expectedNextScoreRange, undefined);
  });
  const two = readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { history: [base] }).prediction;
  assert.equal(two.state, "collect-another-real-paper");
  assert.equal(two.evidenceCount, 2);
});

test("SASMO readiness does not accept an arbitrary scoring format or incomplete responses", function () {
  const invalid = form();
  invalid.sections[0].incorrectPoints = 0;
  assert.throws(function () { readiness.validateForm(invalid); }, /scoring/);
  assert.throws(function () { readiness.analyzeAttempt(form(), { formId: form().formId, outcomes: [] }, policy(), {}); }, /25 outcomes/);
});

test("one-item axes in an unbalanced paper never become declared strengths or weaknesses", function () {
  const synthetic = form();
  const axes = [
    ...Array(8).fill("number-operations"),
    ...Array(4).fill("patterns-algebra"),
    ...Array(8).fill("geometry-spatial"),
    ...Array(3).fill("combinatorics-logic"),
    "data-probability",
    "problem-solving-strategies"
  ];
  synthetic.items = axes.map(function (axisId, index) {
    return { questionNumber: index + 1, axisId, skillId: `synthetic-skill-${index + 1}` };
  });
  const outcomes = Array(25).fill("incorrect");
  outcomes[23] = "correct";
  const report = readiness.analyzeAttempt(synthetic, attempt(outcomes), policy(), {});
  const data = report.axes.find(function (axis) { return axis.axisId === "data-probability"; });
  const strategy = report.axes.find(function (axis) { return axis.axisId === "problem-solving-strategies"; });
  assert.equal(data.itemCount, 1);
  assert.equal(data.percentage, 100);
  assert.equal(data.evidenceState, "needs-more-evidence");
  assert.equal(strategy.itemCount, 1);
  assert.equal(strategy.percentage, 0);
  assert.equal(strategy.evidenceState, "needs-more-evidence");
  assert.ok(!report.strengths.includes("data-probability"));
  assert.ok(!report.weaknesses.includes("problem-solving-strategies"));
});

test("score-only items remain in the 70-point score but not the diagnostic denominator", function () {
  const outcomes = Array(25).fill("correct");
  const scored = readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { scoreOnlyQuestionNumbers: [19] });
  const axisId = form().items[18].axisId;
  const scoredAxis = scored.axes.find(function (axis) { return axis.axisId === axisId; });
  const diagnosticAxis = scored.diagnostic.axes.find(function (axis) { return axis.axisId === axisId; });
  assert.equal(scored.score.rawScore, 70);
  assert.equal(scored.diagnostic.itemCount, 24);
  assert.deepEqual(scored.diagnostic.scoreOnlyQuestionNumbers, [19]);
  assert.equal(scoredAxis.itemCount - diagnosticAxis.itemCount, 1);
  assert.throws(function () { readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { scoreOnlyQuestionNumbers: [19, 19] }); }, /scoreOnlyQuestionNumbers/);
  assert.throws(function () { readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { scoreOnlyQuestionNumbers: [26] }); }, /scoreOnlyQuestionNumbers/);
});
