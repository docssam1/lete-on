const test = require("node:test");
const assert = require("node:assert/strict");
const readiness = require("../assessment/sasmo-mock-readiness.js");

function form() {
  return {
    schemaVersion: readiness.SCHEMA_VERSION,
    formId: "sasmo-2019-g6-baseline-a",
    programId: "sasmo",
    year: 2019,
    levelId: "G6",
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
      { formId: "sasmo-2018-g6-baseline-a", rawScore: 48, maxScore: 70, verifiedRealPaper: true },
      { formId: "sasmo-2020-g6-baseline-b", rawScore: 56, maxScore: 70, verifiedRealPaper: true }
    ]
  });
  assert.equal(report.prediction.state, "preliminary-real-paper-trend");
  assert.equal(report.prediction.officialAwardPrediction, false);
  assert.ok(report.prediction.targetScoreProbabilityPercent >= 0 && report.prediction.targetScoreProbabilityPercent <= 100);
  assert.throws(function () {
    readiness.analyzeAttempt(form(), attempt(outcomes), policy(), { targetScore: 55, history: [{ formId: "sasmo-2018-g6-baseline-a", rawScore: 48, maxScore: 70, verifiedRealPaper: false }, { formId: "sasmo-2020-g6-baseline-b", rawScore: 56, maxScore: 70, verifiedRealPaper: true }] });
  }, /history must contain verified/);
});

test("SASMO readiness does not accept an arbitrary scoring format or incomplete responses", function () {
  const invalid = form();
  invalid.sections[0].incorrectPoints = 0;
  assert.throws(function () { readiness.validateForm(invalid); }, /scoring/);
  assert.throws(function () { readiness.analyzeAttempt(form(), { formId: form().formId, outcomes: [] }, policy(), {}); }, /25 outcomes/);
});
