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
  assert.equal("priorityAxis" in saved.summary, false);
  assert.equal("readinessBand" in saved.summary, false);
  assert.equal("strengthAxis" in saved.summary, false);
  assert.equal("accuracy" in saved.summary, false);
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

test("GFIELD mock results keep local aggregate evidence only, in newest-first order, and can be cleared", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const result = {
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261103-a1b2c3d4", examId: "gfield-grade7-ns-a-mock-v1", formVersion: "2026-11-03-v1", grade: 7,
    score: { correct: 9, answered: 12 },
    standards: [{ id: "7.NS.A.1", correct: 4, total: 5 }, { id: "7.NS.A.2", correct: 3, total: 5 }, { id: "7.NS.A.3", correct: 2, total: 4 }],
    reviewFocuses: [{ itemId: "ns-a-m03", standard: "7.NS.A.1", label: "소수의 덧셈" }], completedAt: "2026-11-03T02:00:00.000Z",
    studentName: "private name", schoolScore: 100, responses: [{ answer: "private answer" }]
  };
  const first = store.saveGfieldMockResult(result);
  assert.equal(first.score.correct, 9);
  assert.equal("studentName" in first, false);
  assert.equal("schoolScore" in first, false);
  assert.equal("responses" in first, false);
  const second = store.saveGfieldMockResult({ ...result, id: "mock-20261103-e5f6g7h8", completedAt: "2026-11-03T03:00:00.000Z", score: { correct: 10, answered: 14 }, standards: [{ id: "7.NS.A.1", correct: 5, total: 5 }, { id: "7.NS.A.2", correct: 3, total: 5 }, { id: "7.NS.A.3", correct: 2, total: 4 }] });
  assert.equal(second.score.correct, 10);
  assert.equal(store.loadGfieldMockResultHistory("gfield-grade7-ns-a-mock-v1").length, 2);
  assert.equal(store.loadGfieldMockResultHistory()[0].id, second.id);
  assert.doesNotMatch(storage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1"), /private name|private answer|schoolScore|responses|studentName/);
  assert.equal(store.removeGfieldMockResult(first.id), true);
  assert.equal(store.loadGfieldMockResultHistory().length, 1);
  assert.equal(store.clearGfieldMockResultHistory(), true);
  assert.deepEqual(store.loadGfieldMockResultHistory(), []);
  assert.equal(store.saveGfieldMockResult({ ...result, id: "bad-result", score: { correct: 15, answered: 15 } }), false);
});

test("GFIELD stores the second Grade 7 unit form under its own reviewed scope", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const saved = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-rpa12345", examId: "gfield-grade7-rp-a-mock-v1", formVersion: "2026-11-04-v1", grade: 7,
    score: { correct: 10, answered: 13 },
    standards: [{ id: "7.RP.A.1", correct: 3, total: 4 }, { id: "7.RP.A.2", correct: 4, total: 5 }, { id: "7.RP.A.3", correct: 3, total: 5 }],
    reviewFocuses: [{ itemId: "rp-a-m03", standard: "7.RP.A.1", label: "분수 시간의 단위율" }], completedAt: "2026-11-04T02:00:00.000Z",
    responses: [{ answer: "not stored" }], studentName: "not stored"
  });
  assert.equal(saved.examTitle, "7.RP.A 비와 비례 관계");
  assert.equal(saved.clusterId, "7.RP.A");
  assert.equal(saved.score.total, 14);
  assert.equal(store.loadGfieldMockResultHistory("gfield-grade7-rp-a-mock-v1").length, 1);
  assert.equal(store.loadGfieldMockResultHistory("gfield-grade7-ns-a-mock-v1").length, 0);
  assert.doesNotMatch(storage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1"), /not stored|responses|studentName/);
  assert.equal(store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-rpa12346", examId: "gfield-grade7-rp-a-mock-v1", formVersion: "wrong-form", grade: 7,
    score: { correct: 14, answered: 14 }, standards: [{ id: "7.RP.A.1", correct: 4, total: 4 }, { id: "7.RP.A.2", correct: 5, total: 5 }, { id: "7.RP.A.3", correct: 5, total: 5 }], reviewFocuses: []
  }), false);
});

test("GFIELD stores the revised AMC 8 style mock as five aggregate domains only and preserves the earlier form", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const standardsV1 = ["수 감각·비율", "대수·규칙", "기하·좌표", "경우의 수·확률", "정수·자료 해석"].map(function (id) { return { id, correct: 4, total: 5 }; });
  const standards = ["수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석"].map(function (id) { return { id, correct: 4, total: 5 }; });
  const result = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc81234", examId: "gfield-grade7-amc8-style-mock-v2", formVersion: "2026-11-04-v2", grade: 7,
    score: { correct: 20, answered: 23 }, standards, reviewFocuses: [{ itemId: "amc8-g7-v2-m25", standard: "정수·자료 해석", label: "최소공배수와 나머지 연결하기" }],
    completedAt: "2026-11-04T03:00:00.000Z", responses: [{ answer: "private" }], schoolScore: 100
  });
  assert.equal(result.examTitle, "지필드 AMC 8 스타일 모의고사 · 2회");
  assert.equal(result.clusterId, "AMC8");
  assert.equal(result.score.total, 25);
  assert.equal(result.standards.length, 5);
  assert.equal(result.reviewFocuses.length, 1);
  assert.doesNotMatch(storage.getItem("gmap-local-learning-record-v1:gfield-mock-result-history-v1"), /private|schoolScore|responses/);
  assert.equal(store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc81235", examId: "gfield-grade7-amc8-style-mock-v2", formVersion: "wrong-form", grade: 7,
    score: { correct: 25, answered: 25 }, standards: standards.map(function (entry) { return { ...entry, correct: 5 }; }), reviewFocuses: []
  }), false);
  const oldResult = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc81236", examId: "gfield-grade7-amc8-style-mock-v1", formVersion: "2026-11-04-v1", grade: 7,
    score: { correct: 16, answered: 20 }, standards: standardsV1.map(function (entry, index) { return { ...entry, correct: index === 0 ? 4 : 3 }; }),
    reviewFocuses: [{ itemId: "amc8-g7-m25", standard: "정수·자료 해석", label: "최소공배수와 나머지" }]
  });
  assert.equal(oldResult.examTitle, "지필드 AMC 8 스타일 모의고사 · 1회");
});

test("competition mock result storage preserves only grades allowed by each exam route", function () {
  const store = records.create(memoryStorage());
  const amc8Standards = ["수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석"].map((id) => ({ id, correct: 4, total: 5 }));
  for (const grade of [6, 8]) {
    const saved = store.saveGfieldMockResult({
      schemaVersion: "gfield-mock-result-v1", id: `mock-20261104-g${grade}amc8`, examId: "gfield-grade7-amc8-style-mock-v2", formVersion: "2026-11-04-v2", grade,
      score: { correct: 20, answered: 25 }, standards: amc8Standards, reviewFocuses: []
    });
    assert.equal(saved.grade, grade);
  }
  const amc10Standards = ["대수", "정수론", "기하", "경우의 수", "확률"].map((id, index) => ({ id, correct: 0, total: [5, 4, 6, 5, 5][index] }));
  const amc10LegacyStandards = ["대수", "정수론", "기하", "경우의 수", "확률"].map((id) => ({ id, correct: 0, total: 5 }));
  const amc10 = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc10g9", examId: "gfield-amc10-concept-mock-v1", formVersion: "2026-11-04-v4", grade: 9,
    score: { correct: 0, answered: 0 }, standards: amc10Standards, reviewFocuses: [{ itemId: "amc10-m03", standard: "기하", label: "삼각형 부등식과 정수 경우 나누기" }]
  });
  assert.equal(amc10.grade, 9);
  assert.equal(amc10.reviewFocuses[0].standard, "기하");
  const olderAmc10 = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc10old", examId: "gfield-amc10-concept-mock-v1", formVersion: "2026-11-04-v3", grade: 9,
    score: { correct: 0, answered: 0 }, standards: amc10LegacyStandards, reviewFocuses: [{ itemId: "amc10-m03", standard: "정수론", label: "삼각형 부등식과 경우 나누기" }]
  });
  assert.equal(olderAmc10.formVersion, "2026-11-04-v3");
  assert.equal(olderAmc10.reviewFocuses[0].standard, "정수론");
  const preInterleaveAmc10 = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc10older", examId: "gfield-amc10-concept-mock-v1", formVersion: "2026-11-04-v2", grade: 9,
    score: { correct: 0, answered: 0 }, standards: amc10LegacyStandards, reviewFocuses: [{ itemId: "amc10-m06", standard: "정수론", label: "옛 문항 분류 확인" }]
  });
  assert.equal(preInterleaveAmc10.formVersion, "2026-11-04-v2");
  const amc12Standards = ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"].map((id) => ({ id, correct: 0, total: 5 }));
  const amc12 = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc12g10", examId: "gfield-amc12-concept-mock-v1", formVersion: "2026-11-04-v2", grade: 10,
    score: { correct: 0, answered: 0 }, standards: amc12Standards, reviewFocuses: []
  });
  assert.equal(amc12.grade, 10);
  const olderAmc12 = store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc12old", examId: "gfield-amc12-concept-mock-v1", formVersion: "2026-11-04-v1", grade: 10,
    score: { correct: 0, answered: 0 }, standards: amc12Standards, reviewFocuses: []
  });
  assert.equal(olderAmc12.formVersion, "2026-11-04-v1");
  assert.equal(store.saveGfieldMockResult({
    schemaVersion: "gfield-mock-result-v1", id: "mock-20261104-amc10g6", examId: "gfield-amc10-concept-mock-v1", formVersion: "2026-11-04-v4", grade: 6,
    score: { correct: 0, answered: 0 }, standards: amc10Standards, reviewFocuses: []
  }), false);
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
  const storage = memoryStorage();
  const store = records.create(storage);
  const saved = store.saveAssessmentEvidence({
    schemaVersion: "gfield-external-math-evidence-v2",
    source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
    testDate: "2026-09-01", grade: 6, band: null, confidence: "not-calculated", placementState: "school-policy-required", officialPlacement: false,
    currentCourse: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
    recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
    targetCourse: { id: "algebra-1", label: "Algebra 1" },
    scores: { metric: 64, metricLabel: "성취 백분위", rit: 218, percentile: 64, normGroup: null, season: "fall" },
    primaryPriority: null, priorityDomains: [], domainComparisons: [{ id: "geometry", label: "기하·측정", clusterId: "6.G.A", percent: 58 }],
    plan: { weeks: null, studyDaysPerWeek: null, minutesPerDay: null, problemCountPerDay: null },
    materialState: "verified-grade6-public-materials", decisionNotice: "G·MAP 권장 진도"
  });
  assert.equal(saved, true);
  const evidence = store.loadAssessmentEvidence();
  assert.equal(evidence.source.id, "map-growth");
  assert.equal(evidence.primaryPriority, null);
  assert.equal(evidence.domainComparisons[0].clusterId, "6.G.A");
  assert.equal(evidence.band, null);
  assert.equal(evidence.officialPlacement, false);
  storage.removeItem("gmap-local-learning-record-v1:external-assessment-history");
  assert.equal(store.loadLatestAssessmentEvidence(6).source.id, "map-growth");
  assert.equal(store.loadAssessmentEvidenceHistory().length, 1);
  assert.equal(store.clearAssessmentEvidence(), true);
  assert.equal(store.loadAssessmentEvidence(), null);
});

test("admissions assessment test level survives local summary sanitization", function () {
  const store = records.create(memoryStorage());
  const saved = store.saveAssessmentEvidence({
    schemaVersion: "gfield-external-math-evidence-v3", source: { id: "ssat", label: "SSAT Quantitative", role: "admission-support" },
    testDate: "2026-09-01", grade: 7, band: null, confidence: "not-calculated", placementState: "admission-evidence-only", officialPlacement: false,
    currentCourse: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true }, recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true }, targetCourse: { id: "algebra-1", label: "Algebra 1" },
    scores: { metric: 74, metricLabel: "Quantitative 백분위", percentile: 74, testLevel: "ssat-middle" }, primaryPriority: null, priorityDomains: [], domainComparisons: [], plan: { weeks: null, studyDaysPerWeek: null, minutesPerDay: null, problemCountPerDay: null },
    materialState: "pathway-only-content-locked", decisionNotice: "입학시험 점수는 참고자료입니다."
  });
  assert.equal(saved, true);
  assert.equal(store.loadAssessmentEvidence().scores.testLevel, "ssat-middle");
});

test("external MAP norm-year reference survives safe local storage and legacy v2 rows remain readable", function () {
  const store = records.create(memoryStorage());
  const evidence = {
    schemaVersion: "gfield-external-math-evidence-v3",
    source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
    testDate: "2026-09-01", grade: 7, band: null, confidence: "not-calculated", placementState: "school-policy-required", officialPlacement: false,
    currentCourse: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
    recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
    targetCourse: { id: "algebra-1", label: "Algebra 1" },
    scores: { metric: 64, metricLabel: "성취 백분위", rit: 218, percentile: 64, season: "fall", normYear: "2025", instructionalWeeks: 4 },
    primaryPriority: null, priorityDomains: [], domainComparisons: [], plan: {}, materialState: null, decisionNotice: "사용자 입력"
  };
  assert.equal(store.saveAssessmentEvidence(evidence), true);
  assert.equal(store.loadAssessmentEvidence().scores.normYear, "2025");
  assert.equal(store.loadAssessmentEvidence().scores.instructionalWeeks, 4);
  evidence.schemaVersion = "gfield-external-math-evidence-v2";
  evidence.scores.normYear = "2020";
  assert.equal(store.saveAssessmentEvidence(evidence), true);
  assert.equal(store.loadAssessmentEvidence().scores.normYear, null);
  assert.equal(store.loadAssessmentEvidence().scores.instructionalWeeks, null);
});

test("external assessment history keeps grade and source records separate and replaces duplicate date entries", function () {
  const store = records.create(memoryStorage());
  function evidence(grade, sourceId, date, label) {
    return {
      schemaVersion: "gfield-external-math-evidence-v2",
      source: { id: sourceId, label, role: "instructional-growth" }, testDate: date, grade,
      band: null, confidence: "not-calculated", placementState: "school-policy-required", officialPlacement: false,
      currentCourse: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
      recommendedStart: { id: "pre-algebra", label: "Pre-Algebra", publicLearning: true },
      targetCourse: { id: "algebra-1", label: "Algebra 1" },
      scores: { metric: 64, metricLabel: "입력 점수", rit: 218, percentile: 64 },
      primaryPriority: null, priorityDomains: [], domainComparisons: [], plan: {}, materialState: null, decisionNotice: "사용자 입력"
    };
  }
  assert.equal(store.saveAssessmentEvidence(evidence(7, "map-growth", "2026-09-01", "MAP")), true);
  assert.equal(store.saveAssessmentEvidence(evidence(8, "school-placement", "2026-09-01", "Placement")), true);
  assert.equal(store.saveAssessmentEvidence(evidence(7, "map-growth", "2026-09-01", "MAP revised")), true);
  assert.equal(store.loadAssessmentEvidenceHistory().length, 2);
  assert.equal(store.loadLatestAssessmentEvidence(7).source.label, "MAP revised");
  assert.equal(store.loadLatestAssessmentEvidence(8).source.id, "school-placement");
  assert.equal(store.loadLatestAssessmentEvidence(9), null);
  assert.equal(store.clearAssessmentEvidence(), true);
  assert.deepEqual(store.loadAssessmentEvidenceHistory(), []);
});

test("saved competition diagnostics keep only grade-matched aggregates and can be removed", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const diagnostic = {
    schemaVersion: "gfield-competition-diagnostic-v1", id: "diag-7-amc8-1", programId: "amc8", programTitle: "AMC 8", grade: 7,
    paperLabel: "Practice A", examDate: "2026-10-29", responses: [{ answer: "private" }],
    summary: { itemCount: 25, correct: 1, wrong: 1, blank: 1, unmarked: 22, attempted: 2, domainClassified: 3, reasonClassified: 1 },
    domains: [
      { id: "algebra", attempted: 2, correct: 1, wrong: 1, blank: 0 }, { id: "number", attempted: 0, correct: 0, wrong: 0, blank: 0 },
      { id: "geometry", attempted: 0, correct: 0, wrong: 0, blank: 1 }, { id: "counting", attempted: 0, correct: 0, wrong: 0, blank: 0 }
    ], reasons: [{ id: "reading", count: 1 }]
  };
  const saved = store.saveCompetitionDiagnostic(diagnostic);
  assert.equal(saved.grade, 7);
  assert.equal(saved.summary.accuracy, null);
  assert.equal(saved.domains[0].rate, null);
  assert.equal("responses" in saved, false);
  assert.equal(store.loadCompetitionDiagnosticHistory(7, "amc8").length, 1);
  assert.equal(store.loadCompetitionDiagnosticHistory(8, "amc8").length, 0);
  const raw = storage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1");
  assert.doesNotMatch(raw, /private|responses/);
  assert.equal(store.removeCompetitionDiagnostic("diag-7-amc8-1"), true);
  assert.deepEqual(store.loadCompetitionDiagnosticHistory(7, "amc8"), []);
});

test("saved AMC 8 diagnostics accept the five official-scope groups without exposing responses", function () {
  const store = records.create(memoryStorage());
  const diagnostic = {
    schemaVersion: "gfield-competition-diagnostic-v1", id: "diag-amc8-five-domains", programId: "amc8", programTitle: "AMC 8", grade: 7,
    examDate: "2026-10-29",
    summary: { itemCount: 25, correct: 4, wrong: 1, blank: 1, unmarked: 19, attempted: 5, domainClassified: 6, reasonClassified: 1 },
    domains: [
      { id: "algebra", attempted: 1, correct: 1, wrong: 0, blank: 0 }, { id: "number", attempted: 1, correct: 1, wrong: 0, blank: 0 },
      { id: "geometry", attempted: 1, correct: 0, wrong: 1, blank: 0 }, { id: "counting", attempted: 1, correct: 1, wrong: 0, blank: 0 },
      { id: "data", attempted: 1, correct: 1, wrong: 0, blank: 1 }
    ], reasons: [{ id: "concept", count: 1 }]
  };
  const saved = store.saveCompetitionDiagnostic(diagnostic);
  assert.equal(saved.domains.length, 5);
  assert.equal(saved.domains[1].name, "수·비례·추정");
  assert.equal(saved.domains[4].name, "그래프·표 해석");
  assert.equal(store.loadCompetitionDiagnosticHistory(7, "amc8")[0].domains.length, 5);
  ["amc8", "amc10", "amc12", "aime"].forEach(function (program) {
    const modern = JSON.parse(JSON.stringify(diagnostic));
    modern.id = "six-domains-" + program;
    modern.programId = program;
    modern.grade = 8;
    modern.domains.push({ id: "functions", attempted: 0, correct: 0, wrong: 0, blank: 0 });
    const result = store.saveCompetitionDiagnostic(modern);
    assert.equal(result.domains.length, 6);
    assert.equal(result.domains[5].name, "함수와 그래프");
    assert.equal(store.loadCompetitionDiagnosticHistory(8, program)[0].domains.length, 6);
  });
  const invalidOtherContest = JSON.parse(JSON.stringify(diagnostic));
  invalidOtherContest.id = "diag-amc10-five-domains";
  invalidOtherContest.programId = "amc10";
  invalidOtherContest.programTitle = "AMC 10";
  assert.equal(store.saveCompetitionDiagnostic(invalidOtherContest), false);
});

test("AIME review saves aggregate-only evidence for grade 8+ and rejects lower grades", function () {
  const storage = memoryStorage();
  const store = records.create(storage);
  const diagnostic = {
    schemaVersion: "gfield-competition-diagnostic-v1", id: "diag-aime-grade8", programId: "aime", programTitle: "AIME 문항 복습", grade: 8,
    paperLabel: "2026 개인 연습 세트", examDate: "2026-11-03", responses: [{ answer: "do not store" }],
    summary: { itemCount: 15, correct: 1, wrong: 0, blank: 0, unmarked: 14, attempted: 1, domainClassified: 1, reasonClassified: 0 },
    domains: [
      { id: "algebra", attempted: 1, correct: 1, wrong: 0, blank: 0 }, { id: "number", attempted: 0, correct: 0, wrong: 0, blank: 0 },
      { id: "geometry", attempted: 0, correct: 0, wrong: 0, blank: 0 }, { id: "counting", attempted: 0, correct: 0, wrong: 0, blank: 0 }
    ], reasons: []
  };
  const saved = store.saveCompetitionDiagnostic(diagnostic);
  assert.equal(saved.programId, "aime");
  assert.equal(saved.summary.itemCount, 15);
  assert.equal("responses" in saved, false);
  assert.equal(store.loadCompetitionDiagnosticHistory(8, "aime").length, 1);
  const raw = storage.getItem("gmap-local-learning-record-v1:competition-diagnostic-history-v1");
  assert.doesNotMatch(raw, /do not store|responses/);
  const invalidGrade = { ...diagnostic, id: "diag-aime-grade7", grade: 7 };
  assert.equal(store.saveCompetitionDiagnostic(invalidGrade), false);
});

test("Math Kangaroo paper-review summaries persist for cross-grade same-paper comparison", function () {
  const store = records.create(memoryStorage());
  const saved = store.saveCompetitionDiagnostic({
    schemaVersion: "gfield-competition-diagnostic-v1", id: "diag-kangaroo-grade7", programId: "kangaroo", programTitle: "Math Kangaroo", grade: 7,
    paperLabel: "2025 Grade 7–8 official paper", examDate: "2026-03-19", officialPercentile: 72.5,
    summary: { itemCount: 30, correct: 1, wrong: 0, blank: 0, unmarked: 29, attempted: 1, domainClassified: 1, reasonClassified: 0 },
    domains: [
      { id: "algebra", attempted: 1, correct: 1, wrong: 0, blank: 0 }, { id: "number", attempted: 0, correct: 0, wrong: 0, blank: 0 },
      { id: "geometry", attempted: 0, correct: 0, wrong: 0, blank: 0 }, { id: "counting", attempted: 0, correct: 0, wrong: 0, blank: 0 }
    ], reasons: []
  });
  assert.equal(saved.programId, "kangaroo");
  assert.equal(saved.officialPercentile, 72.5);
  assert.equal(store.loadCompetitionDiagnosticHistory(7, "kangaroo")[0].summary.itemCount, 30);
  assert.equal(store.loadCompetitionDiagnosticHistory(7, "kangaroo")[0].officialPercentile, 72.5);
  assert.equal(store.loadCompetitionDiagnosticHistory(8, "kangaroo").length, 0);
  const invalidPercentile = Object.assign({}, saved, { id: "diag-kangaroo-invalid-percentile", officialPercentile: 100.1 });
  assert.equal(store.saveCompetitionDiagnostic(invalidPercentile), false);
});

test("legacy assessment summaries retain only source-score inputs and cannot feed the learning plan", function () {
  const storage = memoryStorage();
  storage.setItem("gmap-local-learning-record-v1:external-assessment", JSON.stringify({
    schemaVersion: "gfield-external-math-evidence-v1",
    source: { id: "map-growth", label: "NWEA MAP Growth Math", role: "instructional-growth" },
    testDate: "2026-09-01", grade: 7, band: "advanced-evidence", confidence: "high-for-gmap-plan", placementState: "school-policy-required", officialPlacement: false,
    scores: { metric: 93, metricLabel: "성취 백분위", rit: 242, percentile: 93, schoolCut: null, clearsEnteredCut: null },
    recommendedStart: { id: "algebra-1", label: "Algebra 1", publicLearning: false },
    targetCourse: { id: "geometry", label: "Geometry" },
    primaryPriority: { label: "geometry", axis: "geometry-spatial", clusterId: "6.G.A", percent: 48 },
    priorityDomains: [{ id: "geometry", label: "기하·측정", clusterId: "6.G.A", percent: 48 }],
    plan: { weeks: 6, studyDaysPerWeek: 3, minutesPerDay: 45, problemCountPerDay: 12 },
    materialState: "verified-grade6-public-materials"
  }));
  const store = records.create(storage);
  const legacy = store.loadAssessmentEvidence();
  assert.equal(legacy.legacyEvidence, true);
  assert.equal(legacy.scores.rit, 242);
  assert.equal(legacy.scores.percentile, 93);
  assert.equal(legacy.band, undefined);
  assert.equal(legacy.recommendedStart, undefined);
  assert.equal(legacy.materialState, undefined);
  assert.equal(legacy.primaryPriority, undefined);
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

test("concept and unanswered-reason totals survive safely, while malformed optional profiles are dropped",function(){
 const store=records.create(memoryStorage());
 const input={schemaVersion:"gfield-competition-diagnostic-v1",id:"profile-safe",programId:"amc10",programTitle:"AMC 10",grade:9,paperLabel:"2025 AMC 10 A",examDate:"2026-11-15",
  summary:{itemCount:25,correct:3,wrong:2,blank:1,unmarked:19,attempted:5,domainClassified:0,reasonClassified:0},
  domains:["algebra","number","geometry","counting","data","functions"].map(id=>({id,attempted:0,correct:0,wrong:0,blank:0})),reasons:[],
  concepts:[{id:"fraction",correct:1,wrong:1,blank:1,answer:"private",questionNumber:7}],blankReasons:[{id:"time",count:1}]};
 let saved=store.saveCompetitionDiagnostic(input);
 assert.deepEqual(saved.concepts,[{id:"fraction",correct:1,wrong:1,blank:1}]);assert.deepEqual(saved.blankReasons,[{id:"time",count:1}]);
 assert.doesNotMatch(JSON.stringify(saved),/private|questionNumber|"answer"/);
 saved=store.saveCompetitionDiagnostic({...input,concepts:[{id:"fraction",correct:4,wrong:0,blank:0}],blankReasons:[{id:"time",count:2}]});
 assert.equal('concepts' in saved,false);assert.equal('blankReasons' in saved,false);
});

test("partial records retain canonical year/form and distinct papers on the same day never collide on memo",function(){
 const store=records.create(memoryStorage());
 const input={schemaVersion:"gfield-competition-diagnostic-v1",id:"year-2025",programId:"amc10",programTitle:"AMC 10",grade:9,paperLabel:"Same note",examDate:"2026-11-16",
  paper:{year:2025,form:"A",points:150,max:150},summary:{itemCount:25,correct:1,wrong:0,blank:0,unmarked:24,attempted:1,domainClassified:0,reasonClassified:0},
  domains:["algebra","number","geometry","counting","data","functions"].map(id=>({id,attempted:0,correct:0,wrong:0,blank:0})),reasons:[]};
 const saved=store.saveCompetitionDiagnostic(input);assert.deepEqual(saved.paper,{year:2025,form:"A"});
 store.saveCompetitionDiagnostic({...input,id:"year-2024",paper:{year:2024,form:"A"}});
 assert.equal(store.loadCompetitionDiagnosticHistory(9,"amc10").length,2);
 store.saveCompetitionDiagnostic({...input,id:"renamed",paperLabel:"A different note"});
 const rows=store.loadCompetitionDiagnosticHistory(9,"amc10");assert.equal(rows.length,2);assert.equal(rows.find(r=>r.paper.year===2025).paperLabel,"A different note");
});
