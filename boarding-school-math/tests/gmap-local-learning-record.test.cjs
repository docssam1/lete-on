"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const records = require("../shared/gmap-local-learning-record.js");
const catalog = require("../competition/sasmo-mock-catalog.js");
const readiness = require("../assessment/sasmo-mock-readiness.js");
const session = require("../assessment/sasmo-local-paper-session.js");

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

function mixedV6Evidence() {
  const form = catalog.getForm(session.FORM_ID);
  const pack = {
    schemaVersion: session.PACK_SCHEMA_VERSION,
    paper: {
      programId: "sasmo", year: 2019, levelId: "G6", sourceType: "third-party-public-reference",
      sourcePageUrl: "https://www.k12mathcontests.com/download/sasmo/2019/primary6",
      sourceFingerprintSha256: form.sourceFingerprintSha256, rightsState: "private-reference-only"
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
        answerProof: { answerProof: "published-solution-plus-independent", publishedSolutionLocator: `private solution ${index + 1}`, independentSolveMethod: "independent calculation", independentSolveConfirmed: true },
        privateScoring: { answerKind: multipleChoice ? "option-id" : "numeric-exact", answerValue: multipleChoice ? "B" : String(index + 1) }
      };
    })
  };
  const responses = pack.items.map(function (item) { return item.privateScoring.answerValue; });
  responses[0] = "A";
  responses[1] = "";
  responses[15] = "0";
  return session.analyze(pack, responses, { catalog, readiness }).localEvidence;
}

test("practice records retain only sanitized local first-attempt evidence", function () {
  const store = records.create(memoryStorage());
  store.savePractice("sasmo-g6", new Map([
    ["sasmo-g6-model-01", { responses: [{ answerId: "A", correct: false }, { answerId: "D", correct: true }], solved: true }],
    ["not allowed / key", { responses: [{ answerId: "A", correct: true }], solved: true }]
  ]), { attempted: 1, itemCount: 10, firstCorrect: 0, accuracy: 0, complete: false, readinessBand: "collecting", strengthAxis: null, priorityAxis: "number-operations" });
  const saved = store.loadPractice("sasmo-g6");
  assert.deepEqual(Object.keys(saved.attempts), ["sasmo-g6-model-01"]);
  assert.deepEqual(saved.attempts["sasmo-g6-model-01"].responses, [{ answerId: "A", correct: false }, { answerId: "D", correct: true }]);
  assert.equal(saved.summary.priorityAxis, "number-operations");
  assert.equal(saved.summary.accuracy, 0);
});

test("only mapped axes can change a learner-plan priority and records can be cleared", function () {
  const store = records.create(memoryStorage());
  assert.deepEqual(records.priorityForAxis("geometry-spatial"), { label: "기하·공간 추론", clusterId: "6.G.A", errorType: "strategy-gap", difficulty: "advanced" });
  assert.equal(records.priorityForAxis("unknown-axis"), null);
  store.savePractice("sasmo-g6", { "sasmo-g6-model-01": { responses: [{ answerId: "B", correct: true }], solved: true } }, { attempted: 1, itemCount: 10, firstCorrect: 1, accuracy: 100, complete: false, readinessBand: "collecting", strengthAxis: "number-operations", priorityAxis: null });
  assert.equal(Object.keys(store.loadPractice("sasmo-g6").attempts).length, 1);
  assert.equal(store.clearPractice("sasmo-g6"), true);
  assert.deepEqual(store.loadPractice("sasmo-g6"), { attempts: {}, summary: null });
});

test("Grade 6 diagnostic evidence keeps only an answer-safe teacher-reviewed summary", function () {
  const store = records.create(memoryStorage());
  assert.equal(store.saveGrade6DiagnosticEvidence({
    schemaVersion: "gfield-grade6-diagnostic-evidence-v1",
    grade: 6,
    sourceState: "local-qa-finalized-teacher-reviewed",
    score: { earnedPoints: 31, maxPoints: 42, percentage: 73.8, performanceBand: "approaching" },
    priorities: [{ clusterId: "6.NS.B", domainId: "G6-NS", label: "수 체계 · 6.NS.B", errorType: "prerequisite-gap", mode: "repair", difficulty: "foundation", percentage: 50 }],
    answer: "must-not-persist",
    studentResponse: "must-not-persist",
    recordedAt: "2026-10-03T03:00:00.000Z"
  }), true);
  const evidence = store.loadGrade6DiagnosticEvidence();
  assert.equal(evidence.score.earnedPoints, 31);
  assert.equal(evidence.priorities[0].errorType, "prerequisite-gap");
  assert.equal(evidence.officialPlacement, false);
  assert.equal(evidence.assignmentAuthorized, false);
  assert.doesNotMatch(JSON.stringify(evidence), /must-not-persist|studentResponse|answer/);
  assert.equal(store.clearGrade6DiagnosticEvidence(), true);
  assert.equal(store.loadGrade6DiagnosticEvidence(), null);
});

test("external assessment evidence is reduced to an answer-safe local planning summary", function () {
  const store = records.create(memoryStorage());
  const saved = store.saveAssessmentEvidence({
    schemaVersion: "gfield-external-math-evidence-v1",
    source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
    testDate: "2026-09-01", grade: 6, band: "on-track-evidence", confidence: "medium-for-gmap-plan", placementState: "school-policy-required", officialPlacement: false,
    recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
    targetCourse: { id: "algebra-1", label: "Algebra 1" },
    primaryPriority: { label: "기하·측정", axis: "geometry-spatial", clusterId: "6.G.A", percent: 58 },
    priorityDomains: [{ id: "geometry", label: "기하·측정", clusterId: "6.G.A", percent: 58 }],
    plan: { weeks: 10, studyDaysPerWeek: 4, minutesPerDay: 45, problemCountPerDay: 10 },
    materialState: "verified-grade6-public-materials", decisionNotice: "G·MAP 권장 진도"
  });
  assert.equal(saved, true);
  const evidence = store.loadAssessmentEvidence();
  assert.equal(evidence.source.id, "map-growth");
  assert.equal(evidence.primaryPriority.clusterId, "6.G.A");
  assert.equal(evidence.officialPlacement, false);
  assert.equal(store.clearAssessmentEvidence(), true);
  assert.equal(store.loadAssessmentEvidence(), null);
});

test("verified SASMO paper evidence is stored without answers, source locators, or official-award claims", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const saved = store.saveCompetitionEvidence({
    schemaVersion: "gfield-competition-evidence-v1",
    programId: "sasmo",
    formId: "sasmo-2019-g6-baseline-a",
    year: 2019,
    levelId: "G6",
    sourceState: "private-verified-reference",
    verifiedRealPaper: true,
    officialAwardPrediction: false,
    score: { rawScore: 48, maxScore: 70, percentOfMax: 68.6, correct: 19, incorrect: 4, blank: 2 },
    axes: [{ axisId: "geometry-spatial", itemCount: 5, correct: 2, incorrect: 2, blank: 1, percentage: 40, evidenceState: "sufficient" }],
    strengths: [],
    weaknesses: ["geometry-spatial"],
    priorityAxis: "geometry-spatial",
    readinessBand: "practice",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false, expectedNextScoreRange: null, confidence: null },
    recordedAt: "2026-09-22T00:00:00.000Z",
    privateScoring: { answerValue: "A" },
    sourceLocator: "private source"
  });
  assert.equal(saved, true);
  const evidence = store.loadCompetitionEvidence();
  assert.equal(evidence.score.rawScore, 48);
  assert.equal(evidence.priorityAxis, null);
  assert.equal(evidence.diagnosticState, "legacy-diagnostic-superseded");
  assert.equal(evidence.officialAwardPrediction, false);
  assert.doesNotMatch(JSON.stringify(evidence), /answerValue|privateScoring|sourceLocator/);
  assert.equal(store.clearCompetitionEvidence(), true);
  assert.equal(store.loadCompetitionEvidence(), null);
});

test("legacy v2 evidence keeps its score but marks the 24-item diagnosis superseded", function () {
  const store = records.create(memoryStorage());
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  const counts = Object.keys(records.AXIS_PRIORITIES).map(function (axisId) {
    return { axisId, itemCount: form.items.filter(function (item) { return item.axisId === axisId; }).length };
  });
  const scoredAxes = counts.map(function (axis) { return { axisId: axis.axisId, itemCount: axis.itemCount, correct: axis.itemCount, incorrect: 0, blank: 0, percentage: 100, evidenceState: axis.itemCount >= 4 ? "sufficient" : "needs-more-evidence" }; });
  const diagnosticAxes = scoredAxes.map(function (axis) {
    const count = axis.itemCount - (axis.axisId === "patterns-algebra" ? 1 : 0);
    return { axisId: axis.axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: 100, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const evidence = {
    schemaVersion: "gfield-competition-evidence-v2", programId: "sasmo", formId: form.formId,
    formVersion: form.formVersion, year: form.year, levelId: form.levelId,
    comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256,
    sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState,
    verifiedRealPaper: true, officialAwardPrediction: false,
    score: { rawScore: 70, maxScore: 70, percentOfMax: 100, correct: 25, incorrect: 0, blank: 0 },
    axes: scoredAxes, diagnosticAxes, scoreOnlyQuestionNumbers: [19],
    strengths: [], weaknesses: ["geometry-spatial"], priorityAxis: "geometry-spatial", readinessBand: "challenge",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false }
  };
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const saved = store.loadCompetitionEvidenceSeries()[0];
  assert.equal(saved.schemaVersion, "gfield-competition-evidence-v2");
  assert.equal(saved.axes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 25);
  assert.equal(saved.diagnosticAxes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 24);
  assert.deepEqual(saved.scoreOnlyQuestionNumbers, [19]);
  assert.equal(saved.diagnosticState, "legacy-diagnostic-superseded");
  assert.deepEqual(saved.weaknesses, []);
  assert.equal(saved.priorityAxis, null);
  const tampered = structuredClone(evidence);
  tampered.scoreOnlyQuestionNumbers = [20];
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  tampered.scoreOnlyQuestionNumbers = [19];
  tampered.diagnosticAxes.find(function (axis) { return axis.axisId === "patterns-algebra"; }).itemCount += 1;
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
});

test("v3 evidence keeps all 25 scored items and excludes Q15 and Q19 from the 23-item diagnosis", function () {
  const store = records.create(memoryStorage());
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  const counts = Object.keys(records.AXIS_PRIORITIES).map(function (axisId) {
    return { axisId, itemCount: form.items.filter(function (item) { return item.axisId === axisId; }).length };
  });
  const scoredAxes = counts.map(function (axis) {
    return { axisId: axis.axisId, itemCount: axis.itemCount, correct: axis.itemCount, incorrect: 0, blank: 0, percentage: 100, evidenceState: axis.itemCount >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const diagnosticAxes = scoredAxes.map(function (axis) {
    const count = axis.itemCount - (axis.axisId === "patterns-algebra" ? 2 : 0);
    return { axisId: axis.axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: count ? 100 : 0, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const evidence = {
    schemaVersion: "gfield-competition-evidence-v3", programId: "sasmo", formId: form.formId,
    formVersion: form.formVersion, year: form.year, levelId: form.levelId,
    comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256,
    sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState,
    verifiedRealPaper: true, officialAwardPrediction: false,
    score: { rawScore: 70, maxScore: 70, percentOfMax: 100, correct: 25, incorrect: 0, blank: 0 },
    axes: scoredAxes, diagnosticAxes,
    diagnosticExcludedQuestionNumbers: [15, 19], scoreOnlyQuestionNumbers: [19], reviewRequiredQuestionNumbers: [15],
    strengths: ["patterns-algebra"], weaknesses: ["geometry-spatial"], priorityAxis: "geometry-spatial", readinessBand: "challenge",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false }
  };
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const saved = store.loadCompetitionEvidenceSeries()[0];
  assert.equal(saved.schemaVersion, "gfield-competition-evidence-v3");
  assert.equal(saved.axes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 25);
  assert.equal(saved.diagnosticAxes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 23);
  assert.deepEqual(saved.diagnosticExcludedQuestionNumbers, [15, 19]);
  assert.deepEqual(saved.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(saved.reviewRequiredQuestionNumbers, [15]);
  assert.equal(saved.diagnosticState, "legacy-diagnostic-superseded");
  assert.deepEqual(saved.strengths, []);
  assert.deepEqual(saved.weaknesses, []);
  assert.equal(saved.priorityAxis, null);
  const tampered = structuredClone(evidence);
  tampered.reviewRequiredQuestionNumbers = [14];
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  tampered.reviewRequiredQuestionNumbers = [15];
  tampered.diagnosticAxes.find(function (axis) { return axis.axisId === "patterns-algebra"; }).itemCount += 1;
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
});

test("v4 evidence keeps all 25 scored items and excludes Q9, Q15, and Q19 from the 22-item diagnosis", function () {
  const store = records.create(memoryStorage());
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  const scoredAxes = Object.keys(records.AXIS_PRIORITIES).map(function (axisId) {
    const count = form.items.filter(function (item) { return item.axisId === axisId; }).length;
    return { axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: 100, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const diagnosticAxes = scoredAxes.map(function (axis) {
    const excluded = axis.axisId === "patterns-algebra" ? 2 : axis.axisId === "data-probability" ? 1 : 0;
    const count = axis.itemCount - excluded;
    return { axisId: axis.axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: count ? 100 : 0, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const evidence = {
    schemaVersion: "gfield-competition-evidence-v4", programId: "sasmo", formId: form.formId,
    formVersion: form.formVersion, year: form.year, levelId: form.levelId,
    comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256,
    sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState,
    verifiedRealPaper: true, officialAwardPrediction: false,
    score: { rawScore: 70, maxScore: 70, percentOfMax: 100, correct: 25, incorrect: 0, blank: 0 },
    axes: scoredAxes, diagnosticAxes,
    diagnosticExcludedQuestionNumbers: [9, 15, 19], scoreOnlyQuestionNumbers: [19], reviewRequiredQuestionNumbers: [9, 15],
    strengths: ["patterns-algebra"], weaknesses: ["data-probability"], priorityAxis: "data-probability", readinessBand: "challenge",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false }
  };
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const saved = store.loadCompetitionEvidenceSeries()[0];
  assert.equal(saved.schemaVersion, "gfield-competition-evidence-v4");
  assert.equal(saved.axes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 25);
  assert.equal(saved.diagnosticAxes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 22);
  assert.deepEqual(saved.diagnosticExcludedQuestionNumbers, [9, 15, 19]);
  assert.deepEqual(saved.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(saved.reviewRequiredQuestionNumbers, [9, 15]);
  assert.equal(saved.diagnosticState, "legacy-diagnostic-superseded");
  assert.deepEqual(saved.strengths, []);
  assert.deepEqual(saved.weaknesses, []);
  assert.equal(saved.priorityAxis, null);
  const tampered = structuredClone(evidence);
  tampered.reviewRequiredQuestionNumbers = [15];
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  tampered.reviewRequiredQuestionNumbers = [9, 15];
  tampered.diagnosticAxes.find(function (axis) { return axis.axisId === "data-probability"; }).itemCount += 1;
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
});

test("v5 evidence keeps all 25 scored items and excludes Q9, Q15, Q19, and Q21 from the 21-item diagnosis", function () {
  const store = records.create(memoryStorage());
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  const scoredAxes = Object.keys(records.AXIS_PRIORITIES).map(function (axisId) {
    const count = form.items.filter(function (item) { return item.axisId === axisId; }).length;
    return { axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: 100, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const diagnosticAxes = scoredAxes.map(function (axis) {
    const excluded = axis.axisId === "patterns-algebra" ? 2 : axis.axisId === "data-probability" || axis.axisId === "combinatorics-logic" ? 1 : 0;
    const count = axis.itemCount - excluded;
    return { axisId: axis.axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: count ? 100 : 0, evidenceState: count >= 4 ? "sufficient" : "needs-more-evidence" };
  });
  const evidence = {
    schemaVersion: "gfield-competition-evidence-v5", programId: "sasmo", formId: form.formId,
    formVersion: form.formVersion, year: form.year, levelId: form.levelId,
    comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256,
    sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState,
    verifiedRealPaper: true, officialAwardPrediction: false,
    score: { rawScore: 70, maxScore: 70, percentOfMax: 100, correct: 25, incorrect: 0, blank: 0 },
    axes: scoredAxes, diagnosticAxes,
    diagnosticExcludedQuestionNumbers: [9, 15, 19, 21], scoreOnlyQuestionNumbers: [19], reviewRequiredQuestionNumbers: [9, 15, 21],
    strengths: ["combinatorics-logic"], weaknesses: ["data-probability"], priorityAxis: "data-probability", readinessBand: "challenge",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false }
  };
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const saved = store.loadCompetitionEvidenceSeries()[0];
  assert.equal(saved.schemaVersion, "gfield-competition-evidence-v5");
  assert.equal(saved.axes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 25);
  assert.equal(saved.diagnosticAxes.reduce(function (sum, axis) { return sum + axis.itemCount; }, 0), 21);
  assert.deepEqual(saved.diagnosticExcludedQuestionNumbers, [9, 15, 19, 21]);
  assert.deepEqual(saved.scoreOnlyQuestionNumbers, [19]);
  assert.deepEqual(saved.reviewRequiredQuestionNumbers, [9, 15, 21]);
  assert.equal(saved.diagnosticState, "taxonomy-review-pending");
  assert.deepEqual(saved.strengths, []);
  assert.deepEqual(saved.weaknesses, []);
  assert.equal(saved.priorityAxis, null);
  const tampered = structuredClone(evidence);
  tampered.reviewRequiredQuestionNumbers = [9, 15];
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  tampered.reviewRequiredQuestionNumbers = [9, 15, 21];
  tampered.diagnosticAxes.find(function (axis) { return axis.axisId === "combinatorics-logic"; }).itemCount += 1;
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  const futureFieldOnLegacy = structuredClone(evidence);
  futureFieldOnLegacy.reviewQueue = [];
  assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(futureFieldOnLegacy), { saved: false, reason: "invalid-evidence" });
});

test("v6 keeps a score-reconciled answer-free first-attempt review queue and rejects tampering", function () {
  const evidence = mixedV6Evidence();
  const store = records.create(memoryStorage());
  assert.equal(evidence.schemaVersion, "gfield-competition-evidence-v6");
  assert.equal(evidence.score.rawScore, 61);
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const saved = store.loadCompetitionEvidenceSeries()[0];
  assert.deepEqual(saved.reviewQueue, [
    { questionNumber: 1, sectionId: "A", outcome: "incorrect", pointsEarned: -1, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" },
    { questionNumber: 2, sectionId: "A", outcome: "blank", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "identify-starting-barrier" },
    { questionNumber: 16, sectionId: "B", outcome: "incorrect", pointsEarned: 0, diagnosticEligibility: "eligible", reviewCommentCode: "locate-first-divergence" }
  ]);
  assert.equal(saved.diagnosticState, "taxonomy-review-pending");
  assert.equal(saved.priorityAxis, null);
  assert.doesNotMatch(JSON.stringify(saved.reviewQueue), /answer|axis|skill|error|source|locator/i);

  function rejected(mutator) {
    const tampered = structuredClone(evidence);
    mutator(tampered);
    assert.deepEqual(records.create(memoryStorage()).saveCompetitionFirstAttempt(tampered), { saved: false, reason: "invalid-evidence" });
  }
  rejected(function (value) { value.reviewQueue[0].answerValue = "B"; });
  rejected(function (value) { value.reviewQueue[0].pointsEarned = 0; });
  rejected(function (value) { value.reviewQueue[0].diagnosticEligibility = "score-only"; });
  rejected(function (value) { value.reviewQueue.reverse(); });
  rejected(function (value) { value.reviewQueue.pop(); });
  rejected(function (value) { value.score.rawScore = 62; });
});

test("first verified paper is retained once and only catalog-matched forms enter the prediction series", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const form = catalog.getForm("sasmo-2019-g6-baseline-a");
  const evidence = {
    schemaVersion: "gfield-competition-evidence-v1", programId: "sasmo", formId: form.formId,
    formVersion: form.formVersion, year: form.year, levelId: form.levelId,
    comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256,
    sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState,
    verifiedRealPaper: true, officialAwardPrediction: false,
    score: { rawScore: 70, maxScore: 70, percentOfMax: 100, correct: 25, incorrect: 0, blank: 0 },
    axes: Object.keys(records.AXIS_PRIORITIES).map(function (axisId, index) {
      const count = index === 0 ? 5 : 4;
      return { axisId, itemCount: count, correct: count, incorrect: 0, blank: 0, percentage: 100, evidenceState: "sufficient" };
    }),
    strengths: [], weaknesses: [], priorityAxis: null, readinessBand: "challenge",
    prediction: { state: "collect-another-real-paper", officialAwardPrediction: false },
    recordedAt: "2026-09-22T00:00:00.000Z", privateScoring: { answerValue: "B" }
  };
  assert.deepEqual(store.saveCompetitionFirstAttempt(evidence), { saved: true, count: 1 });
  const retry = structuredClone(evidence);
  retry.score = { rawScore: -15, maxScore: 70, percentOfMax: -21.4, correct: 0, incorrect: 25, blank: 0 };
  retry.axes.forEach(function (axis) { axis.correct = 0; axis.incorrect = axis.itemCount; axis.percentage = 0; });
  assert.deepEqual(store.saveCompetitionFirstAttempt(retry), { saved: false, reason: "duplicate-form" });
  assert.equal(store.loadCompetitionEvidenceSeries()[0].score.rawScore, 70);
  assert.equal(store.loadCompetitionEvidence().score.rawScore, 70);
  assert.equal(store.getComparableCompetitionSeries(catalog, "G6").length, 1);
  const forged = structuredClone(evidence);
  forged.formId = "sasmo-2020-g6-baseline-a";
  forged.year = 2020;
  forged.sourceFingerprintSha256 = "c".repeat(64);
  assert.deepEqual(store.saveCompetitionFirstAttempt(forged), { saved: true, count: 2 });
  assert.equal(store.getComparableCompetitionSeries(catalog, "G6").length, 1);
  assert.doesNotMatch(storage.getItem("gmap-local-learning-record-v1:competition-first-attempts-v2"), /answerValue|privateScoring|sourceLocator/);
  assert.equal(store.clearCompetitionEvidence(), true);
  assert.deepEqual(store.loadCompetitionEvidenceSeries(), []);
});
