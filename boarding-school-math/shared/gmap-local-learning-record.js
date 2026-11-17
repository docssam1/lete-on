(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDLocalLearningRecord = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const VERSION = "gmap-local-learning-record-v1";
  const SETTINGS_KEY = `${VERSION}:plan-settings`;
  const PRACTICE_KEY = `${VERSION}:practice`;
  const ASSESSMENT_KEY = `${VERSION}:external-assessment`;
  const ASSESSMENT_HISTORY_KEY = `${VERSION}:external-assessment-history`;
  const MAX_ASSESSMENT_RECORDS = 30;
  const GRADE6_DIAGNOSTIC_KEY = `${VERSION}:grade6-diagnostic-evidence`;
  const COMPETITION_KEY = `${VERSION}:competition-evidence`;
  const COMPETITION_SERIES_KEY = `${VERSION}:competition-first-attempts-v2`;
  const COMPETITION_DIAGNOSTIC_HISTORY_KEY = `${VERSION}:competition-diagnostic-history-v1`;
  const GFIELD_MOCK_RESULT_HISTORY_KEY = `${VERSION}:gfield-mock-result-history-v1`;
  const MAX_COMPETITION_FORMS = 8;
  const MAX_COMPETITION_DIAGNOSTICS = 50;
  const MAX_GFIELD_MOCK_RESULTS = 20;
  const GFIELD_MOCK_RESULT_RULES = Object.freeze({
    "gfield-grade7-ns-a-mock-v1": Object.freeze({ formVersion: "2026-11-03-v1", title: "7.NS.A 유리수 연산", clusterId: "7.NS.A", prefix: "ns-a-m", standards: ["7.NS.A.1", "7.NS.A.2", "7.NS.A.3"], itemsPerStandard: [5, 5, 4] }),
    "gfield-grade7-rp-a-mock-v1": Object.freeze({ formVersion: "2026-11-04-v1", title: "7.RP.A 비와 비례 관계", clusterId: "7.RP.A", prefix: "rp-a-m", standards: ["7.RP.A.1", "7.RP.A.2", "7.RP.A.3"], itemsPerStandard: [4, 5, 5] }),
    "gfield-grade7-amc8-style-mock-v1": Object.freeze({ formVersion: "2026-11-04-v1", title: "지필드 AMC 8 스타일 모의고사 · 1회", clusterId: "AMC8", prefix: "amc8-g7-m", standards: ["수 감각·비율", "대수·규칙", "기하·좌표", "경우의 수·확률", "정수·자료 해석"], itemsPerStandard: [5, 5, 5, 5, 5] }),
    "gfield-grade7-amc8-style-mock-v2": Object.freeze({ formVersion: "2026-11-04-v2", title: "지필드 AMC 8 스타일 모의고사 · 2회", clusterId: "AMC8", prefix: "amc8-g7-v2-m", gradeRange: Object.freeze({ min: 6, max: 8 }), standards: ["수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석"], itemsPerStandard: [5, 5, 5, 5, 5], itemStandards: ["수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석", "수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석", "수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석", "수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석", "수 감각·비율", "대수·규칙", "기하·공간", "경우의 수·확률", "정수·자료 해석"] }),
    "gfield-amc10-concept-mock-v1": Object.freeze({
      formVersion: "2026-11-04-v4", title: "지필드 AMC 10 범위 모의고사 · 1회", clusterId: "AMC10", prefix: "amc10-m", gradeRange: Object.freeze({ min: 7, max: 10 }),
      standards: ["대수", "정수론", "기하", "경우의 수", "확률"],
      formVersions: Object.freeze({
        "2026-11-04-v4": Object.freeze({ itemsPerStandard: [5, 4, 6, 5, 5], itemStandards: ["대수", "기하", "기하", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률"] }),
        "2026-11-04-v3": Object.freeze({ itemsPerStandard: [5, 5, 5, 5, 5], itemStandards: ["대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률", "대수", "기하", "정수론", "경우의 수", "확률"] }),
        "2026-11-04-v2": Object.freeze({ itemsPerStandard: [5, 5, 5, 5, 5], itemStandards: ["대수", "대수", "대수", "대수", "대수", "정수론", "정수론", "정수론", "정수론", "정수론", "기하", "기하", "기하", "기하", "기하", "경우의 수", "경우의 수", "경우의 수", "경우의 수", "경우의 수", "확률", "확률", "확률", "확률", "확률"] })
      })
    }),
    "gfield-amc12-concept-mock-v1": Object.freeze({ formVersion: "2026-11-04-v2", previousFormVersions: ["2026-11-04-v1"], title: "지필드 AMC 12 범위 개념 모의고사 · 1회", clusterId: "AMC12", prefix: "amc12-gfield-m", gradeRange: Object.freeze({ min: 7, max: 12 }), standards: ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"], itemsPerStandard: [5, 5, 5, 5, 5], itemStandards: ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수", "대수", "함수·삼각함수", "정수론", "기하", "경우의 수", "대수", "함수·삼각함수", "정수론", "기하", "경우의 수", "대수", "함수·삼각함수", "정수론", "기하", "경우의 수", "대수", "함수·삼각함수", "정수론", "기하", "경우의 수"] })
  });
  const COMPETITION_DOMAIN_LABELS = Object.freeze({ algebra: "식·대수", number: "수와 정수론", geometry: "기하·공간", counting: "경우의 수·확률", data: "그래프·표 해석", functions: "함수와 그래프" });
  const COMPETITION_REASON_IDS = new Set(["concept", "approach", "calculation", "reading", "time"]);
  const REVIEWED_2019_G6_SOURCE_SHA256 = "a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b";
  const REVIEWED_2019_G6_AXIS_BY_QUESTION = Object.freeze([
    "number-operations", "data-probability", "geometry-spatial", "combinatorics-logic", "number-operations",
    "geometry-spatial", "patterns-algebra", "number-operations", "data-probability", "number-operations",
    "problem-solving-strategies", "geometry-spatial", "combinatorics-logic", "number-operations", "patterns-algebra",
    "geometry-spatial", "number-operations", "data-probability", "patterns-algebra", "patterns-algebra",
    "combinatorics-logic", "number-operations", "geometry-spatial", "combinatorics-logic", "problem-solving-strategies"
  ]);
  const MAX_RESPONSES_PER_ITEM = 12;
  const AXIS_PRIORITIES = Object.freeze({
    "number-operations": Object.freeze({ label: "수와 연산", clusterId: "6.RP.A", errorType: "concept-gap", difficulty: "core" }),
    "patterns-algebra": Object.freeze({ label: "규칙과 대수", clusterId: "6.EE.B", errorType: "representation-error", difficulty: "core" }),
    "geometry-spatial": Object.freeze({ label: "기하·공간 추론", clusterId: "6.G.A", errorType: "strategy-gap", difficulty: "advanced" }),
    "combinatorics-logic": Object.freeze({ label: "조합과 논리", clusterId: "6.G.A", errorType: "strategy-gap", difficulty: "advanced" }),
    "data-probability": Object.freeze({ label: "자료와 가능성", clusterId: "6.SP.A", errorType: "concept-gap", difficulty: "core" }),
    "problem-solving-strategies": Object.freeze({ label: "문제 해결 전략", clusterId: "6.G.A", errorType: "strategy-gap", difficulty: "advanced" })
  });
  const DIAGNOSTIC_ERROR_TYPES = new Set([
    "prerequisite-gap", "concept-gap", "representation-error", "calculation-error", "condition-missed", "strategy-gap", "explanation-incomplete"
  ]);
  const DIAGNOSTIC_MODES = new Set(["repair", "guided-practice", "consolidate"]);
  const DIAGNOSTIC_DIFFICULTIES = new Set(["foundation", "core", "advanced"]);

  function object(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
  function safeParse(value, fallback) {
    if (typeof value !== "string") return fallback;
    try { const parsed = JSON.parse(value); return object(parsed) ? parsed : fallback; } catch (error) { return fallback; }
  }
  function browserStorage() {
    try {
      const storage = typeof globalThis !== "undefined" ? globalThis.localStorage : null;
      if (!storage) return null;
      const probe = `${VERSION}:probe`;
      storage.setItem(probe, "1");
      storage.removeItem(probe);
      return storage;
    } catch (error) { return null; }
  }
  function validProgramId(value) { return typeof value === "string" && /^[a-z0-9-]{2,64}$/.test(value); }
  function sanitizedAttempt(value) {
    if (!object(value) || !Array.isArray(value.responses)) return null;
    const responses = value.responses.slice(0, MAX_RESPONSES_PER_ITEM).map(function (response) {
      if (!object(response) || typeof response.answerId !== "string" || !/^[A-Z]$/.test(response.answerId)) return null;
      return { answerId: response.answerId, correct: response.correct === true };
    }).filter(Boolean);
    if (!responses.length) return null;
    return { responses: responses, solved: value.solved === true || responses.some(function (response) { return response.correct; }) };
  }
  function sanitizedAttempts(attempts) {
    const source = attempts instanceof Map ? Object.fromEntries(attempts) : attempts;
    if (!object(source)) return {};
    return Object.keys(source).reduce(function (output, itemId) {
      if (!/^[a-z0-9-]{3,120}$/.test(itemId)) return output;
      const attempt = sanitizedAttempt(source[itemId]);
      if (attempt) output[itemId] = attempt;
      return output;
    }, {});
  }
  function sanitizedSummary(summary) {
    if (!object(summary) || !Number.isInteger(summary.attempted) || summary.attempted < 0) return null;
    return {
      attempted: summary.attempted,
      itemCount: Number.isInteger(summary.itemCount) && summary.itemCount > 0 ? summary.itemCount : 0,
      firstCorrect: Number.isInteger(summary.firstCorrect) && summary.firstCorrect >= 0 ? summary.firstCorrect : 0,
      complete: summary.complete === true,
      recordedAt: new Date().toISOString()
    };
  }
  function sanitizedLegacyAssessment(value) {
    if (!object(value) || !object(value.source) || !object(value.scores) || !["school-placement", "map-growth", "ctp", "ssat", "isee"].includes(value.source.id)) return null;
    const legacyIsee = value.source.id === "isee";
    return {
      schemaVersion: value.schemaVersion,
      legacyEvidence: true,
      source: { id: String(value.source.id).slice(0, 32), label: String(value.source.label || "외부 평가").slice(0, 100), role: String(value.source.role || "").slice(0, 40) },
      testDate: typeof value.testDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.testDate) ? value.testDate : null,
      grade: Number.isInteger(value.grade) && value.grade >= 3 && value.grade <= 12 ? value.grade : null,
      scores: {
        metric: !legacyIsee && Number.isFinite(value.scores.metric) ? value.scores.metric : null,
        rit: Number.isFinite(value.scores.rit) ? value.scores.rit : null,
        percentile: Number.isFinite(value.scores.percentile) ? value.scores.percentile : null,
        scaleScore: Number.isFinite(value.scores.scaleScore) ? value.scores.scaleScore : null,
        stanine: !legacyIsee && Number.isFinite(value.scores.stanine) ? value.scores.stanine : null,
        schoolCut: Number.isFinite(value.scores.schoolCut) ? value.scores.schoolCut : null
      },
      needsIseeStanines: legacyIsee,
      savedAt: typeof value.savedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.savedAt) ? value.savedAt : null
    };
  }
  function sanitizedTestLevel(value, sourceId) {
    const levels = sourceId === "ssat"
      ? ["ssat-elementary-3", "ssat-elementary-4", "ssat-middle", "ssat-upper"]
      : sourceId === "isee"
        ? ["isee-primary-2", "isee-primary-3", "isee-primary-4", "isee-lower", "isee-middle", "isee-upper"]
        : [];
    return typeof value === "string" && levels.includes(value) ? value : null;
  }
  function sanitizedAssessment(value) {
    if (object(value) && value.schemaVersion === "gfield-external-math-evidence-v1") return sanitizedLegacyAssessment(value);
    if (!object(value) || !["gfield-external-math-evidence-v2", "gfield-external-math-evidence-v3"].includes(value.schemaVersion) || !object(value.source) || !object(value.currentCourse) || !object(value.recommendedStart) || !object(value.plan)) return null;
    const domains = Array.isArray(value.domainComparisons) ? value.domainComparisons.slice(0, 6).map(function (domain) {
      if (!object(domain) || typeof domain.label !== "string" || (domain.clusterId !== null && typeof domain.clusterId !== "string") || !Number.isFinite(domain.percent)) return null;
      return { id: String(domain.id || "").slice(0, 32), label: domain.label.slice(0, 80), clusterId: domain.clusterId === null ? null : domain.clusterId.slice(0, 32), percent: domain.percent };
    }).filter(Boolean) : [];
    return {
      schemaVersion: value.schemaVersion,
      source: { id: String(value.source.id || "").slice(0, 32), label: String(value.source.label || "").slice(0, 100), role: String(value.source.role || "").slice(0, 40) },
      testDate: typeof value.testDate === "string" ? value.testDate : null,
      grade: Number.isInteger(value.grade) ? value.grade : null,
      band: null,
      confidence: "not-calculated",
      placementState: typeof value.placementState === "string" ? value.placementState : null,
      officialPlacement: false,
      targetCandidate: value.targetCandidate === true && value.source.id === "school-placement" && value.scores && value.scores.clearsEnteredCut === true,
      scores: object(value.scores) ? { metric: Number.isFinite(value.scores.metric) ? value.scores.metric : null, metricLabel: String(value.scores.metricLabel || "입력 점수").slice(0, 80), rit: Number.isFinite(value.scores.rit) ? value.scores.rit : null, scaleScore: Number.isFinite(value.scores.scaleScore) ? value.scores.scaleScore : null, stanine: Number.isFinite(value.scores.stanine) ? value.scores.stanine : null, quantStanine: Number.isFinite(value.scores.quantStanine) ? value.scores.quantStanine : null, mathStanine: Number.isFinite(value.scores.mathStanine) ? value.scores.mathStanine : null, percentile: Number.isFinite(value.scores.percentile) ? value.scores.percentile : null, schoolCut: Number.isFinite(value.scores.schoolCut) ? value.scores.schoolCut : null, clearsEnteredCut: value.scores.clearsEnteredCut === true ? true : value.scores.clearsEnteredCut === false ? false : null, normGroup: typeof value.scores.normGroup === "string" ? value.scores.normGroup.slice(0, 80) : null, testLevel: sanitizedTestLevel(value.scores.testLevel, value.source.id), season: typeof value.scores.season === "string" ? value.scores.season.slice(0, 12) : null, normYear: value.schemaVersion === "gfield-external-math-evidence-v3" && ["2020", "2025"].includes(String(value.scores.normYear || "")) ? String(value.scores.normYear) : null, instructionalWeeks: value.schemaVersion === "gfield-external-math-evidence-v3" && Number.isInteger(value.scores.instructionalWeeks) && value.scores.instructionalWeeks >= 1 && value.scores.instructionalWeeks <= 40 ? value.scores.instructionalWeeks : null } : null,
      currentCourse: { id: String(value.currentCourse.id || "").slice(0, 40), label: String(value.currentCourse.label || "").slice(0, 80), publicLearning: value.currentCourse.publicLearning === true },
      recommendedStart: { id: String(value.recommendedStart.id || "").slice(0, 40), label: String(value.recommendedStart.label || "").slice(0, 80), publicLearning: value.recommendedStart.publicLearning === true },
      targetCourse: object(value.targetCourse) ? { id: String(value.targetCourse.id || "").slice(0, 40), label: String(value.targetCourse.label || "").slice(0, 80) } : null,
      route: Array.isArray(value.route) ? value.route.slice(0, 8).map(function (course) { return object(course) ? { id: String(course.id || "").slice(0, 40), label: String(course.label || "").slice(0, 80), stage: String(course.stage || "").slice(0, 80), publicLearning: course.publicLearning === true } : null; }).filter(Boolean) : [],
      primaryPriority: null,
      priorityDomains: [],
      domainComparisons: domains,
      plan: { weeks: Number(value.plan.weeks) || null, studyDaysPerWeek: Number(value.plan.studyDaysPerWeek) || null, minutesPerDay: Number(value.plan.minutesPerDay) || null, problemCountPerDay: Number(value.plan.problemCountPerDay) || null },
      materialState: typeof value.materialState === "string" ? value.materialState : null,
      decisionNotice: typeof value.decisionNotice === "string" ? value.decisionNotice.slice(0, 240) : null,
      savedAt: typeof value.savedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.savedAt) ? value.savedAt : new Date().toISOString()
    };
  }
  function sanitizedGrade6DiagnosticEvidence(value) {
    if (!object(value) || value.schemaVersion !== "gfield-grade6-diagnostic-evidence-v1" || value.grade !== 6 || value.sourceState !== "local-qa-finalized-teacher-reviewed" || !object(value.score) || !Array.isArray(value.priorities)) return null;
    if (!Number.isFinite(value.score.earnedPoints) || !Number.isFinite(value.score.maxPoints) || value.score.maxPoints <= 0 || value.score.earnedPoints < 0 || value.score.earnedPoints > value.score.maxPoints || !Number.isFinite(value.score.percentage) || value.score.percentage < 0 || value.score.percentage > 100 || !["developing", "approaching", "ready"].includes(value.score.performanceBand)) return null;
    const priorities = value.priorities.slice(0, 2).map(function (priority) {
      if (!object(priority) || typeof priority.clusterId !== "string" || !/^6\.(?:RP|NS|EE|G|SP)\.[A-C]$/.test(priority.clusterId) || typeof priority.domainId !== "string" || !/^G6-(?:RP|NS|EE|G|SP)$/.test(priority.domainId) || typeof priority.label !== "string" || !priority.label.trim() || priority.label.length > 100 || !DIAGNOSTIC_ERROR_TYPES.has(priority.errorType) || !DIAGNOSTIC_MODES.has(priority.mode) || !DIAGNOSTIC_DIFFICULTIES.has(priority.difficulty) || !Number.isFinite(priority.percentage) || priority.percentage < 0 || priority.percentage > 100) return null;
      return {
        clusterId: priority.clusterId,
        domainId: priority.domainId,
        label: priority.label.trim(),
        errorType: priority.errorType,
        mode: priority.mode,
        difficulty: priority.difficulty,
        percentage: priority.percentage
      };
    }).filter(Boolean);
    if (value.priorities.length > 0 && priorities.length !== Math.min(value.priorities.length, 2)) return null;
    return {
      schemaVersion: "gfield-grade6-diagnostic-evidence-v1",
      grade: 6,
      sourceState: "local-qa-finalized-teacher-reviewed",
      sourceLabel: "Grade 6 42문항 진단",
      officialPlacement: false,
      assignmentAuthorized: false,
      score: {
        earnedPoints: value.score.earnedPoints,
        maxPoints: value.score.maxPoints,
        percentage: value.score.percentage,
        performanceBand: value.score.performanceBand
      },
      priorities: priorities,
      recordedAt: typeof value.recordedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.recordedAt) ? value.recordedAt : new Date().toISOString()
    };
  }
  function sanitizedGfieldMockResult(value) {
    if (!object(value) || value.schemaVersion !== "gfield-mock-result-v1" || !Number.isInteger(value.grade) || !object(value.score) || !Array.isArray(value.standards) || !Array.isArray(value.reviewFocuses)) return null;
    const rules = GFIELD_MOCK_RESULT_RULES[value.examId];
    if (!rules) return null;
    const versionRules = rules.formVersions ? rules.formVersions[value.formVersion] : value.formVersion === rules.formVersion || (rules.previousFormVersions || []).includes(value.formVersion) ? rules : null;
    if (!versionRules) return null;
    if (rules.gradeRange ? value.grade < rules.gradeRange.min || value.grade > rules.gradeRange.max : value.grade !== 7) return null;
    const itemsPerStandard = versionRules.itemsPerStandard || rules.itemsPerStandard;
    const itemStandards = versionRules.itemStandards || rules.itemStandards;
    const itemCount = itemsPerStandard.reduce(function (sum, count) { return sum + count; }, 0);
    const standards = value.standards.slice(0, rules.standards.length).map(function (entry, index) {
      if (!object(entry) || entry.id !== rules.standards[index] || !Number.isInteger(entry.correct) || !Number.isInteger(entry.total) || entry.total !== itemsPerStandard[index] || entry.correct < 0 || entry.correct > entry.total) return null;
      return { id: entry.id, correct: entry.correct, total: entry.total };
    }).filter(Boolean);
    if (standards.length !== rules.standards.length || standards.reduce(function (sum, entry) { return sum + entry.total; }, 0) !== itemCount) return null;
    if (!Number.isInteger(value.score.correct) || value.score.correct < 0 || value.score.correct > itemCount || !Number.isInteger(value.score.answered) || value.score.answered < 0 || value.score.answered > itemCount || value.score.answered < value.score.correct || standards.reduce(function (sum, entry) { return sum + entry.correct; }, 0) !== value.score.correct) return null;
    const focusIds = new Set();
    const reviewFocuses = value.reviewFocuses.slice(0, itemCount).map(function (focus) {
      if (!object(focus) || typeof focus.itemId !== "string" || typeof focus.standard !== "string" || typeof focus.label !== "string" || !focus.label.trim() || focus.label.length > 100) return null;
      const match = new RegExp("^" + rules.prefix + "(\\d{2})$").exec(focus.itemId);
      const index = match ? Number(match[1]) - 1 : -1;
      const expectedStandard = index >= 0 && index < itemCount
        ? itemStandards ? itemStandards[index] : rules.standards.find(function (standard, standardIndex) { return index >= itemsPerStandard.slice(0, standardIndex).reduce(function (sum, count) { return sum + count; }, 0) && index < itemsPerStandard.slice(0, standardIndex + 1).reduce(function (sum, count) { return sum + count; }, 0); })
        : null;
      if (index < 0 || index >= itemCount || focus.standard !== expectedStandard || focusIds.has(focus.itemId)) return null;
      focusIds.add(focus.itemId);
      return { itemId: focus.itemId, standard: focus.standard, label: focus.label.trim() };
    }).filter(Boolean);
    if (reviewFocuses.length !== value.reviewFocuses.length) return null;
    return {
      schemaVersion: "gfield-mock-result-v1", id: typeof value.id === "string" && /^mock-[a-z0-9-]{8,48}$/.test(value.id) ? value.id : `mock-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`,
      examId: value.examId, examTitle: rules.title, clusterId: rules.clusterId, formVersion: value.formVersion, grade: value.grade,
      score: { correct: value.score.correct, answered: value.score.answered, total: itemCount },
      standards: standards,
      reviewFocuses: reviewFocuses,
      completedAt: typeof value.completedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.completedAt) ? value.completedAt : new Date().toISOString()
    };
  }
  function sanitizedCompetitionEvidence(value) {
    if (!object(value) || !["gfield-competition-evidence-v1", "gfield-competition-evidence-v2", "gfield-competition-evidence-v3", "gfield-competition-evidence-v4", "gfield-competition-evidence-v5", "gfield-competition-evidence-v6"].includes(value.schemaVersion) || value.programId !== "sasmo" || value.verifiedRealPaper !== true || value.officialAwardPrediction !== false || !object(value.score)) return null;
    const versionTwo = value.schemaVersion === "gfield-competition-evidence-v2";
    const versionThree = value.schemaVersion === "gfield-competition-evidence-v3";
    const versionFour = value.schemaVersion === "gfield-competition-evidence-v4";
    const versionFive = value.schemaVersion === "gfield-competition-evidence-v5";
    const versionSix = value.schemaVersion === "gfield-competition-evidence-v6";
    const versionedDiagnostics = versionTwo || versionThree || versionFour || versionFive || versionSix;
    if (typeof value.formId !== "string" || !/^sasmo-[0-9]{4}-g(?:[2-9]|10)-[a-z0-9-]{3,64}$/.test(value.formId) || !Number.isInteger(value.year) || typeof value.levelId !== "string") return null;
    const identity = /^sasmo-([0-9]{4})-g([2-9]|10)-/.exec(value.formId);
    if (Number(identity[1]) !== value.year || value.levelId !== `G${identity[2]}`) return null;
    if (value.formVersion != null && !/^[a-z0-9-]{3,64}$/.test(value.formVersion)) return null;
    if (value.comparisonKey != null && !/^sasmo:g(?:[2-9]|10):[a-z0-9:+_/-]{6,100}$/.test(value.comparisonKey)) return null;
    if (value.scoringFingerprintSha256 != null && !/^[a-f0-9]{64}$/.test(value.scoringFingerprintSha256)) return null;
    if (value.sourceFingerprintSha256 != null && !/^[a-f0-9]{64}$/.test(value.sourceFingerprintSha256)) return null;
    function sanitizeAxes(source) { return Array.isArray(source) ? source.slice(0, 6).map(function (axis) {
      if (!object(axis) || !AXIS_PRIORITIES[axis.axisId] || !Number.isInteger(axis.itemCount) || !Number.isInteger(axis.correct) || !Number.isInteger(axis.incorrect) || !Number.isInteger(axis.blank) || !Number.isFinite(axis.percentage)) return null;
      return {
        axisId: axis.axisId,
        itemCount: axis.itemCount,
        correct: axis.correct,
        incorrect: axis.incorrect,
        blank: axis.blank,
        percentage: axis.percentage,
        evidenceState: axis.evidenceState === "sufficient" ? "sufficient" : "needs-more-evidence"
      };
    }).filter(Boolean) : []; }
    const axes = sanitizeAxes(value.axes);
    if (!axes.length || !Number.isFinite(value.score.rawScore) || value.score.rawScore < -15 || value.score.rawScore > 70 || value.score.maxScore !== 70) return null;
    if (axes.some(function (axis) { return axis.itemCount < 0 || axis.correct < 0 || axis.incorrect < 0 || axis.blank < 0 || axis.correct + axis.incorrect + axis.blank !== axis.itemCount || axis.percentage < 0 || axis.percentage > 100; })) return null;
    if (axes.length === 6 && ["correct", "incorrect", "blank"].some(function (field) { return axes.reduce(function (total, axis) { return total + axis[field]; }, 0) !== value.score[field]; })) return null;
    const taxonomyPending2019 = value.formId === "sasmo-2019-g6-baseline-a";
    const diagnosticAxes = versionedDiagnostics ? sanitizeAxes(value.diagnosticAxes) : [];
    if (versionedDiagnostics) {
      if (value.formId !== "sasmo-2019-g6-baseline-a" || value.sourceFingerprintSha256 !== REVIEWED_2019_G6_SOURCE_SHA256) return null;
      if (versionTwo && (!Array.isArray(value.scoreOnlyQuestionNumbers) || value.scoreOnlyQuestionNumbers.length !== 1 || value.scoreOnlyQuestionNumbers[0] !== 19)) return null;
      if (versionThree && (
        !Array.isArray(value.diagnosticExcludedQuestionNumbers) || JSON.stringify(value.diagnosticExcludedQuestionNumbers) !== "[15,19]" ||
        !Array.isArray(value.scoreOnlyQuestionNumbers) || JSON.stringify(value.scoreOnlyQuestionNumbers) !== "[19]" ||
        !Array.isArray(value.reviewRequiredQuestionNumbers) || JSON.stringify(value.reviewRequiredQuestionNumbers) !== "[15]"
      )) return null;
      if (versionFour && (
        !Array.isArray(value.diagnosticExcludedQuestionNumbers) || JSON.stringify(value.diagnosticExcludedQuestionNumbers) !== "[9,15,19]" ||
        !Array.isArray(value.scoreOnlyQuestionNumbers) || JSON.stringify(value.scoreOnlyQuestionNumbers) !== "[19]" ||
        !Array.isArray(value.reviewRequiredQuestionNumbers) || JSON.stringify(value.reviewRequiredQuestionNumbers) !== "[9,15]"
      )) return null;
      if ((versionFive || versionSix) && (
        !Array.isArray(value.diagnosticExcludedQuestionNumbers) || JSON.stringify(value.diagnosticExcludedQuestionNumbers) !== "[9,15,19,21]" ||
        !Array.isArray(value.scoreOnlyQuestionNumbers) || JSON.stringify(value.scoreOnlyQuestionNumbers) !== "[19]" ||
        !Array.isArray(value.reviewRequiredQuestionNumbers) || JSON.stringify(value.reviewRequiredQuestionNumbers) !== "[9,15,21]"
      )) return null;
      const excludedCount = versionFive || versionSix ? 4 : versionFour ? 3 : versionThree ? 2 : 1;
      if (diagnosticAxes.length !== 6 || axes.length !== 6 || axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0) !== 25 || diagnosticAxes.reduce(function (total, axis) { return total + axis.itemCount; }, 0) !== 25 - excludedCount) return null;
      if (diagnosticAxes.some(function (axis, index) {
        const scored = axes[index];
        return axis.axisId !== scored.axisId || axis.itemCount < 0 || axis.correct < 0 || axis.incorrect < 0 || axis.blank < 0 || axis.correct + axis.incorrect + axis.blank !== axis.itemCount || axis.percentage < 0 || axis.percentage > 100 || axis.itemCount > scored.itemCount || axis.correct > scored.correct || axis.incorrect > scored.incorrect || axis.blank > scored.blank || axis.evidenceState !== (axis.itemCount >= 4 ? "sufficient" : "needs-more-evidence");
      })) return null;
      const expectedAxisExclusions = versionFive || versionSix
        ? { "patterns-algebra": 2, "data-probability": 1, "combinatorics-logic": 1 }
        : versionFour ? { "patterns-algebra": 2, "data-probability": 1 } : { "patterns-algebra": excludedCount };
      const outcomeDelta = ["correct", "incorrect", "blank"].reduce(function (total, field) {
        return total + axes.reduce(function (sum, axis) { return sum + axis[field]; }, 0) - diagnosticAxes.reduce(function (sum, axis) { return sum + axis[field]; }, 0);
      }, 0);
      if (outcomeDelta !== excludedCount || ["correct", "incorrect", "blank"].some(function (field) { return axes.reduce(function (total, axis) { return total + axis[field]; }, 0) - diagnosticAxes.reduce(function (total, axis) { return total + axis[field]; }, 0) < 0; })) return null;
      if (diagnosticAxes.some(function (axis, index) { return axes[index].itemCount - axis.itemCount !== (expectedAxisExclusions[axis.axisId] || 0); })) return null;
    }
    function expectedReviewEntry(questionNumber, outcome) {
      const diagnosticEligibility = [9, 15, 21].includes(questionNumber) ? "review-required" : questionNumber === 19 ? "score-only" : "eligible";
      return {
        questionNumber,
        sectionId: questionNumber <= 15 ? "A" : "B",
        outcome,
        pointsEarned: questionNumber <= 15 && outcome === "incorrect" ? -1 : 0,
        diagnosticEligibility,
        reviewCommentCode: diagnosticEligibility !== "eligible" ? "diagnostic-exclusion" : outcome === "incorrect" ? "locate-first-divergence" : "identify-starting-barrier"
      };
    }
    let reviewQueue = [];
    if (versionSix) {
      if (!Array.isArray(value.reviewQueue) || value.reviewQueue.length > 25) return null;
      const allowedKeys = ["diagnosticEligibility", "outcome", "pointsEarned", "questionNumber", "reviewCommentCode", "sectionId"];
      reviewQueue = value.reviewQueue.map(function (entry, index) {
        if (!object(entry) || JSON.stringify(Object.keys(entry).sort()) !== JSON.stringify(allowedKeys)) return null;
        if (!Number.isInteger(entry.questionNumber) || entry.questionNumber < 1 || entry.questionNumber > 25 || (index > 0 && entry.questionNumber <= value.reviewQueue[index - 1].questionNumber) || !["incorrect", "blank"].includes(entry.outcome)) return null;
        const expected = expectedReviewEntry(entry.questionNumber, entry.outcome);
        if (allowedKeys.some(function (key) { return entry[key] !== expected[key]; })) return null;
        return expected;
      });
      if (reviewQueue.some(function (entry) { return !entry; })) return null;
      const incorrect = reviewQueue.filter(function (entry) { return entry.outcome === "incorrect"; }).length;
      const blank = reviewQueue.filter(function (entry) { return entry.outcome === "blank"; }).length;
      if (value.score.incorrect !== incorrect || value.score.blank !== blank || value.score.correct !== 25 - reviewQueue.length) return null;
      const queued = new Map(reviewQueue.map(function (entry) { return [entry.questionNumber, entry]; }));
      const expectedRawScore = REVIEWED_2019_G6_AXIS_BY_QUESTION.reduce(function (total, axisId, index) {
        const questionNumber = index + 1;
        const entry = queued.get(questionNumber);
        return total + (entry ? entry.pointsEarned : questionNumber <= 15 ? 2 : 4);
      }, 0);
      if (expectedRawScore !== value.score.rawScore) return null;
      function expectedAxisRows(excludedNumbers) {
        const excluded = new Set(excludedNumbers);
        const rows = Object.keys(AXIS_PRIORITIES).map(function (axisId) { return { axisId, itemCount: 0, correct: 0, incorrect: 0, blank: 0 }; });
        REVIEWED_2019_G6_AXIS_BY_QUESTION.forEach(function (axisId, index) {
          const questionNumber = index + 1;
          if (excluded.has(questionNumber)) return;
          const row = rows.find(function (entry) { return entry.axisId === axisId; });
          const outcome = queued.has(questionNumber) ? queued.get(questionNumber).outcome : "correct";
          row.itemCount += 1;
          row[outcome] += 1;
        });
        return rows.map(function (row) {
          return Object.assign(row, {
            percentage: row.itemCount ? Math.round(1000 * row.correct / row.itemCount) / 10 : 0,
            evidenceState: row.itemCount >= 4 ? "sufficient" : "needs-more-evidence"
          });
        });
      }
      const expectedAxes = expectedAxisRows([]);
      const expectedDiagnosticAxes = expectedAxisRows([9, 15, 19, 21]);
      if (JSON.stringify(axes) !== JSON.stringify(expectedAxes) || JSON.stringify(diagnosticAxes) !== JSON.stringify(expectedDiagnosticAxes)) return null;
    } else if (Object.prototype.hasOwnProperty.call(value, "reviewQueue")) return null;
    const prediction = object(value.prediction) ? {
      state: typeof value.prediction.state === "string" ? value.prediction.state.slice(0, 60) : "collect-another-real-paper",
      officialAwardPrediction: false,
      expectedNextScoreRange: Array.isArray(value.prediction.expectedNextScoreRange) && value.prediction.expectedNextScoreRange.length === 2 && value.prediction.expectedNextScoreRange.every(Number.isFinite) ? value.prediction.expectedNextScoreRange.slice() : null,
      confidence: ["low", "medium", "high"].includes(value.prediction.confidence) ? value.prediction.confidence : null
    } : { state: "collect-another-real-paper", officialAwardPrediction: false, expectedNextScoreRange: null, confidence: null };
    return {
      schemaVersion: value.schemaVersion,
      programId: "sasmo",
      formId: value.formId,
      formVersion: value.formVersion || null,
      year: value.year,
      levelId: value.levelId.slice(0, 4),
      comparisonKey: value.comparisonKey || null,
      scoringFingerprintSha256: value.scoringFingerprintSha256 || null,
      sourceFingerprintSha256: value.sourceFingerprintSha256 || null,
      sourceState: typeof value.sourceState === "string" ? value.sourceState.slice(0, 50) : "private-verified-reference",
      verifiedRealPaper: true,
      officialAwardPrediction: false,
      score: {
        rawScore: value.score.rawScore,
        maxScore: 70,
        percentOfMax: Number.isFinite(value.score.percentOfMax) ? value.score.percentOfMax : null,
        correct: Number.isInteger(value.score.correct) ? value.score.correct : null,
        incorrect: Number.isInteger(value.score.incorrect) ? value.score.incorrect : null,
        blank: Number.isInteger(value.score.blank) ? value.score.blank : null
      },
      axes: axes,
      diagnosticAxes: diagnosticAxes,
      diagnosticExcludedQuestionNumbers: versionFive || versionSix ? [9, 15, 19, 21] : versionFour ? [9, 15, 19] : versionThree ? [15, 19] : versionTwo ? [19] : [],
      scoreOnlyQuestionNumbers: versionedDiagnostics ? [19] : [],
      reviewRequiredQuestionNumbers: versionFive || versionSix ? [9, 15, 21] : versionFour ? [9, 15] : versionThree ? [15] : [],
      ...(versionSix ? { reviewQueue } : {}),
      diagnosticState: taxonomyPending2019 && !(versionFive || versionSix) ? "legacy-diagnostic-superseded" : taxonomyPending2019 ? "taxonomy-review-pending" : "legacy",
      strengths: taxonomyPending2019 ? [] : Array.isArray(value.strengths) ? value.strengths.filter(function (axisId) { return Boolean(AXIS_PRIORITIES[axisId]) && (!versionedDiagnostics || diagnosticAxes.some(function (axis) { return axis.axisId === axisId && axis.evidenceState === "sufficient"; })); }).slice(0, 2) : [],
      weaknesses: taxonomyPending2019 ? [] : Array.isArray(value.weaknesses) ? value.weaknesses.filter(function (axisId) { return Boolean(AXIS_PRIORITIES[axisId]) && (!versionedDiagnostics || diagnosticAxes.some(function (axis) { return axis.axisId === axisId && axis.evidenceState === "sufficient"; })); }).slice(0, 2) : [],
      priorityAxis: taxonomyPending2019 ? null : AXIS_PRIORITIES[value.priorityAxis] && (!versionedDiagnostics || diagnosticAxes.some(function (axis) { return axis.axisId === value.priorityAxis && axis.evidenceState === "sufficient"; })) ? value.priorityAxis : null,
      readinessBand: typeof value.readinessBand === "string" ? value.readinessBand.slice(0, 40) : null,
      prediction: prediction,
      recordedAt: typeof value.recordedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.recordedAt) ? value.recordedAt : new Date().toISOString()
    };
  }
  function sanitizedCompetitionDiagnostic(value) {
    if (!object(value) || value.schemaVersion !== "gfield-competition-diagnostic-v1" || !["amc8", "amc10", "amc12", "aime", "kangaroo", "sasmo"].includes(value.programId) || !Number.isInteger(value.grade) || value.grade < 3 || value.grade > 12 || (value.programId === "amc8" && (value.grade < 6 || value.grade > 8)) || (value.programId === "amc10" && (value.grade < 7 || value.grade > 10)) || (value.programId === "amc12" && value.grade < 8) || (value.programId === "aime" && value.grade < 8) || !object(value.summary) || !Array.isArray(value.domains) || !Array.isArray(value.reasons)) return null;
    const summary = value.summary;
    if (value.officialPercentile != null && (value.programId !== "kangaroo" || !Number.isFinite(value.officialPercentile) || value.officialPercentile < 0 || value.officialPercentile > 100)) return null;
    if (!["itemCount", "correct", "wrong", "blank", "unmarked", "attempted", "domainClassified", "reasonClassified"].every(function (key) { return Number.isInteger(summary[key]) && summary[key] >= 0; })) return null;
    if (summary.itemCount < 1 || summary.itemCount > 30 || summary.correct + summary.wrong + summary.blank + summary.unmarked !== summary.itemCount || summary.attempted !== summary.correct + summary.wrong || summary.domainClassified > summary.itemCount || summary.reasonClassified > summary.wrong) return null;
    const legacyAmc8Domains = value.programId === "amc8" && value.domains.length === 4;
    const domains = value.domains.slice(0, 6).map(function (domain) {
      if (!object(domain) || !Object.prototype.hasOwnProperty.call(COMPETITION_DOMAIN_LABELS, domain.id) || !["attempted", "correct", "wrong", "blank"].every(function (key) { return Number.isInteger(domain[key]) && domain[key] >= 0; }) || domain.attempted !== domain.correct + domain.wrong || domain.attempted + domain.blank > summary.itemCount) return null;
      const rate = domain.attempted >= 3 ? Math.round(domain.correct / domain.attempted * 100) : null;
      const name = domain.id === "number" && value.programId === "amc8" && !legacyAmc8Domains ? "수·비례·추정" : COMPETITION_DOMAIN_LABELS[domain.id];
      return { id: domain.id, name: name, attempted: domain.attempted, correct: domain.correct, wrong: domain.wrong, blank: domain.blank, rate: rate, evidence: domain.attempted >= 3 ? "3문제 이상" : domain.attempted ? "3문제 미만 · 비교 보류" : "미측정" };
    }).filter(Boolean);
    const reasons = value.reasons.slice(0, 5).map(function (reason) {
      return object(reason) && COMPETITION_REASON_IDS.has(reason.id) && Number.isInteger(reason.count) && reason.count > 0 && reason.count <= summary.wrong ? { id: reason.id, count: reason.count } : null;
    }).filter(Boolean);
    const domainIds = domains.map(function (domain) { return domain.id; }).sort();
    const expectedLegacyDomainIds = ["algebra", "counting", "geometry", "number"];
    const expectedAmc8DomainIds = expectedLegacyDomainIds.concat(["data"]).sort();
    const validLegacyDomains = value.domains.length === 4 && domainIds.join("|") === expectedLegacyDomainIds.join("|");
    const validAmc8Domains = value.programId === "amc8" && value.domains.length === 5 && domainIds.join("|") === expectedAmc8DomainIds.join("|");
    const validSixDomains = value.domains.length === 6 && domainIds.join("|") === expectedAmc8DomainIds.concat(["functions"]).sort().join("|");
    if ((!validLegacyDomains && !validAmc8Domains && !validSixDomains) || domains.length !== value.domains.length || reasons.length !== value.reasons.length || new Set(domains.map(function (domain) { return domain.id; })).size !== domains.length) return null;
    if (domains.reduce(function (total, domain) { return total + domain.attempted + domain.blank; }, 0) !== summary.domainClassified || domains.reduce(function (total, domain) { return total + domain.correct; }, 0) > summary.correct || domains.reduce(function (total, domain) { return total + domain.wrong; }, 0) > summary.wrong || domains.reduce(function (total, domain) { return total + domain.blank; }, 0) > summary.blank || reasons.reduce(function (total, reason) { return total + reason.count; }, 0) !== summary.reasonClassified) return null;
    return {
      schemaVersion: "gfield-competition-diagnostic-v1",
      id: typeof value.id === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value.id) ? value.id : `${value.programId}-${value.grade}-${Date.now()}`,
      programId: value.programId,
      programTitle: String(value.programTitle || value.programId.toUpperCase()).slice(0, 40),
      grade: value.grade,
      paperLabel: typeof value.paperLabel === "string" ? value.paperLabel.trim().slice(0, 80) : "",
      ...(object(value.paper) && ["amc8", "amc10", "amc12", "aime"].includes(value.programId)
        && Number.isInteger(value.paper.year) && value.paper.year >= 1950 && value.paper.year <= 2100
        && typeof value.paper.form === "string" && /^(?:|A|B|C|D|I|II)$/.test(value.paper.form)
        ? { paper: { year: value.paper.year, form: value.paper.form,
          ...(summary.unmarked === 0 && Number.isFinite(value.paper.points) && value.paper.points >= 0
            && value.paper.max === (value.programId === "amc8" ? 25 : value.programId === "aime" ? 15 : 150)
            && value.paper.points <= value.paper.max && Number.isInteger(value.paper.points * 2)
            ? { points: value.paper.points, max: value.paper.max } : {}) } } : {}),
      examDate: typeof value.examDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.examDate) && !Number.isNaN(Date.parse(`${value.examDate}T00:00:00Z`)) && new Date(`${value.examDate}T00:00:00Z`).toISOString().slice(0, 10) === value.examDate ? value.examDate : null,
      officialPercentile: value.programId === "kangaroo" && Number.isFinite(value.officialPercentile) ? value.officialPercentile : null,
      summary: { itemCount: summary.itemCount, correct: summary.correct, wrong: summary.wrong, blank: summary.blank, unmarked: summary.unmarked, attempted: summary.attempted, domainClassified: summary.domainClassified, reasonClassified: summary.reasonClassified, accuracy: summary.attempted >= 3 ? Math.round(summary.correct / summary.attempted * 100) : null },
      domains: domains,
      reasons: reasons,
      ...(Array.isArray(value.concepts) && value.concepts.length <= 200 && new Set(value.concepts.map(function (row) { return row && row.id; })).size === value.concepts.length
        && value.concepts.every(function (row) { return object(row) && typeof row.id === "string" && /^[a-z0-9-]{1,80}$/.test(row.id)
          && ["correct", "wrong", "blank"].every(function (key) { return Number.isInteger(row[key]) && row[key] >= 0 && row[key] <= summary[key]; })
          && row.correct + row.wrong + row.blank > 0; })
        ? { concepts: value.concepts.map(function (row) { return { id: row.id, correct: row.correct, wrong: row.wrong, blank: row.blank }; }) } : {}),
      ...(Array.isArray(value.blankReasons) && value.blankReasons.length <= 3 && new Set(value.blankReasons.map(function (row) { return row && row.id; })).size === value.blankReasons.length
        && value.blankReasons.every(function (row) { return object(row) && ["time", "skipped", "could-not-start"].includes(row.id) && Number.isInteger(row.count) && row.count > 0; })
        && value.blankReasons.reduce(function (sum, row) { return sum + row.count; }, 0) <= summary.blank
        ? { blankReasons: value.blankReasons.map(function (row) { return { id: row.id, count: row.count }; }) } : {}),
      savedAt: typeof value.savedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.savedAt) ? value.savedAt : new Date().toISOString()
    };
  }
  function create(storage) {
    const store = storage || browserStorage();
    function read(key) { return store ? safeParse(store.getItem(key), {}) : {}; }
    function write(key, value) { if (store) store.setItem(key, JSON.stringify(value)); }
    function loadPractice(programId) {
      if (!validProgramId(programId)) return { attempts: {}, summary: null };
      const all = read(PRACTICE_KEY);
      const record = object(all[programId]) ? all[programId] : {};
      return { attempts: sanitizedAttempts(record.attempts), summary: sanitizedSummary(record.summary) };
    }
    function savePractice(programId, attempts, summary) {
      if (!validProgramId(programId)) return false;
      const all = read(PRACTICE_KEY);
      all[programId] = { attempts: sanitizedAttempts(attempts), summary: sanitizedSummary(summary), updatedAt: new Date().toISOString() };
      write(PRACTICE_KEY, all);
      return true;
    }
    function clearPractice(programId) {
      if (!validProgramId(programId) || !store) return false;
      const all = read(PRACTICE_KEY);
      delete all[programId];
      write(PRACTICE_KEY, all);
      return true;
    }
    function loadPlanSettings() {
      const value = read(SETTINGS_KEY);
      return {
        goalId: typeof value.goalId === "string" ? value.goalId : null,
        targetDate: typeof value.targetDate === "string" ? value.targetDate : null,
        studyDays: Number.isInteger(value.studyDays) ? value.studyDays : null,
        minutesPerDay: Number.isInteger(value.minutesPerDay) ? value.minutesPerDay : null,
        priority: typeof value.priority === "string" ? value.priority : null
      };
    }
    function savePlanSettings(settings) {
      if (!object(settings)) return false;
      write(SETTINGS_KEY, {
        goalId: typeof settings.goalId === "string" ? settings.goalId : null,
        targetDate: typeof settings.targetDate === "string" ? settings.targetDate : null,
        studyDays: Number.isInteger(settings.studyDays) ? settings.studyDays : null,
        minutesPerDay: Number.isInteger(settings.minutesPerDay) ? settings.minutesPerDay : null,
        priority: typeof settings.priority === "string" ? settings.priority : null,
        updatedAt: new Date().toISOString()
      });
      return true;
    }
    function loadAssessmentEvidence() { return sanitizedAssessment(read(ASSESSMENT_KEY)); }
    function loadAssessmentEvidenceHistory() {
      const raw = read(ASSESSMENT_HISTORY_KEY);
      if (!object(raw) || raw.schemaVersion !== "gfield-external-assessment-history-v1" || !Array.isArray(raw.records)) {
        const previous = sanitizedAssessment(read(ASSESSMENT_KEY));
        if (previous && !previous.legacyEvidence) {
          write(ASSESSMENT_HISTORY_KEY, { schemaVersion: "gfield-external-assessment-history-v1", records: [previous] });
          return [previous];
        }
        return [];
      }
      return raw.records.slice(0, MAX_ASSESSMENT_RECORDS).map(sanitizedAssessment).filter(function (entry) { return entry && !entry.legacyEvidence; })
        .sort(function (a, b) { return String(b.testDate || "").localeCompare(String(a.testDate || "")) || String(b.savedAt || "").localeCompare(String(a.savedAt || "")); });
    }
    function loadLatestAssessmentEvidence(grade) {
      if (!Number.isInteger(grade)) return null;
      return loadAssessmentEvidenceHistory().find(function (entry) { return entry.grade === grade; }) || null;
    }
    function saveAssessmentEvidence(evidence) {
      const sanitized = sanitizedAssessment(evidence);
      if (!sanitized || sanitized.legacyEvidence) return false;
      const history = loadAssessmentEvidenceHistory();
      const identity = [sanitized.source.id, sanitized.grade, sanitized.testDate].join(":");
      const next = history.filter(function (entry) { return [entry.source.id, entry.grade, entry.testDate].join(":") !== identity; });
      next.unshift(sanitized);
      write(ASSESSMENT_HISTORY_KEY, { schemaVersion: "gfield-external-assessment-history-v1", records: next.slice(0, MAX_ASSESSMENT_RECORDS) });
      write(ASSESSMENT_KEY, sanitized);
      return true;
    }
    function clearAssessmentEvidence() { if (!store) return false; store.removeItem(ASSESSMENT_KEY); store.removeItem(ASSESSMENT_HISTORY_KEY); return true; }
    function loadGfieldMockResultHistory(examId) {
      const saved = read(GFIELD_MOCK_RESULT_HISTORY_KEY);
      if (saved.schemaVersion !== "gfield-mock-result-history-v1" || !Array.isArray(saved.records)) return [];
      return saved.records.slice(0, MAX_GFIELD_MOCK_RESULTS).map(sanitizedGfieldMockResult).filter(function (entry) { return entry && (!examId || entry.examId === examId); }).sort(function (a, b) { return String(b.completedAt).localeCompare(String(a.completedAt)); });
    }
    function saveGfieldMockResult(result) {
      const sanitized = sanitizedGfieldMockResult(result);
      if (!store || !sanitized) return false;
      const records = loadGfieldMockResultHistory().filter(function (entry) { return entry.id !== sanitized.id; });
      records.unshift(sanitized);
      write(GFIELD_MOCK_RESULT_HISTORY_KEY, { schemaVersion: "gfield-mock-result-history-v1", records: records.slice(0, MAX_GFIELD_MOCK_RESULTS) });
      return sanitized;
    }
    function removeGfieldMockResult(id) {
      if (!store || typeof id !== "string") return false;
      const records = loadGfieldMockResultHistory().filter(function (entry) { return entry.id !== id; });
      write(GFIELD_MOCK_RESULT_HISTORY_KEY, { schemaVersion: "gfield-mock-result-history-v1", records: records });
      return true;
    }
    function clearGfieldMockResultHistory() { if (!store) return false; store.removeItem(GFIELD_MOCK_RESULT_HISTORY_KEY); return true; }
    function loadCompetitionDiagnosticHistory(grade, programId) {
      const saved = read(COMPETITION_DIAGNOSTIC_HISTORY_KEY);
      if (saved.schemaVersion !== "gfield-competition-diagnostic-history-v1" || !Array.isArray(saved.records)) return [];
      return saved.records.slice(0, MAX_COMPETITION_DIAGNOSTICS).map(sanitizedCompetitionDiagnostic).filter(function (entry) {
        return entry && (!Number.isInteger(grade) || entry.grade === grade) && (!programId || entry.programId === programId);
      }).sort(function (a, b) {
        const aHasDate = Boolean(a.examDate); const bHasDate = Boolean(b.examDate);
        if (aHasDate !== bHasDate) return aHasDate ? -1 : 1;
        return String(b.examDate || b.savedAt).localeCompare(String(a.examDate || a.savedAt)) || String(b.savedAt).localeCompare(String(a.savedAt));
      });
    }
    function saveCompetitionDiagnostic(record) {
      const sanitized = sanitizedCompetitionDiagnostic(record);
      if (!sanitized) return false;
      const records = loadCompetitionDiagnosticHistory();
      function identityFor(entry) {
        if (!entry.examDate) return null;
        let paper = entry.paper;
        if (!paper) {
          const match = /^(\d{4}) (AMC 8|AMC 10|AMC 12|AIME)(?: ([ABCD]|I|II))?$/.exec(entry.paperLabel);
          const titles = { amc8: "AMC 8", amc10: "AMC 10", amc12: "AMC 12", aime: "AIME" };
          if (match && titles[entry.programId] === match[2]) paper = { year: Number(match[1]), form: match[3] || "" };
        }
        return [entry.grade, entry.programId, entry.examDate, paper ? "paper:" + paper.year + ":" + paper.form : "memo:" + entry.paperLabel].join(":");
      }
      const identity = identityFor(sanitized);
      const next = records.filter(function (entry) { return !identity || identityFor(entry) !== identity; });
      next.unshift(sanitized);
      write(COMPETITION_DIAGNOSTIC_HISTORY_KEY, { schemaVersion: "gfield-competition-diagnostic-history-v1", records: next.slice(0, MAX_COMPETITION_DIAGNOSTICS) });
      return sanitized;
    }
    function removeCompetitionDiagnostic(id) {
      if (!store || typeof id !== "string") return false;
      const records = loadCompetitionDiagnosticHistory().filter(function (entry) { return entry.id !== id; });
      write(COMPETITION_DIAGNOSTIC_HISTORY_KEY, { schemaVersion: "gfield-competition-diagnostic-history-v1", records: records });
      return true;
    }
    function clearCompetitionDiagnosticHistory() { if (!store) return false; store.removeItem(COMPETITION_DIAGNOSTIC_HISTORY_KEY); return true; }
    function loadGrade6DiagnosticEvidence() { return sanitizedGrade6DiagnosticEvidence(read(GRADE6_DIAGNOSTIC_KEY)); }
    function saveGrade6DiagnosticEvidence(evidence) {
      const sanitized = sanitizedGrade6DiagnosticEvidence(evidence);
      if (!sanitized) return false;
      write(GRADE6_DIAGNOSTIC_KEY, sanitized);
      return true;
    }
    function clearGrade6DiagnosticEvidence() { if (!store) return false; store.removeItem(GRADE6_DIAGNOSTIC_KEY); return true; }
    function loadCompetitionEvidence() { return sanitizedCompetitionEvidence(read(COMPETITION_KEY)); }
    function saveCompetitionEvidence(evidence) {
      const sanitized = sanitizedCompetitionEvidence(evidence);
      if (!sanitized) return false;
      write(COMPETITION_KEY, sanitized);
      return true;
    }
    function loadCompetitionEvidenceSeries() {
      const saved = read(COMPETITION_SERIES_KEY);
      if (saved.schemaVersion !== "gfield-competition-first-attempts-v2" || saved.programId !== "sasmo" || !Array.isArray(saved.attempts)) return [];
      const seenForms = new Set();
      const seenSources = new Set();
      return saved.attempts.slice(0, MAX_COMPETITION_FORMS).map(function (entry) {
        const sanitized = sanitizedCompetitionEvidence(entry);
        if (!sanitized || !sanitized.formVersion || !sanitized.comparisonKey || !sanitized.scoringFingerprintSha256 || !sanitized.sourceFingerprintSha256) return null;
        if (seenForms.has(sanitized.formId) || seenSources.has(sanitized.sourceFingerprintSha256)) return null;
        if (sanitized.score.correct + sanitized.score.incorrect + sanitized.score.blank !== 25 || sanitized.axes.length !== 6 || new Set(sanitized.axes.map(function (axis) { return axis.axisId; })).size !== 6 || sanitized.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0) !== 25) return null;
        seenForms.add(sanitized.formId);
        seenSources.add(sanitized.sourceFingerprintSha256);
        return sanitized;
      }).filter(Boolean);
    }
    function saveCompetitionFirstAttempt(evidence) {
      const sanitized = sanitizedCompetitionEvidence(evidence);
      if (!store || !sanitized || !sanitized.formVersion || !sanitized.comparisonKey || !sanitized.scoringFingerprintSha256 || !sanitized.sourceFingerprintSha256) return { saved: false, reason: "invalid-evidence" };
      if (sanitized.score.correct + sanitized.score.incorrect + sanitized.score.blank !== 25 || sanitized.axes.length !== 6 || new Set(sanitized.axes.map(function (axis) { return axis.axisId; })).size !== 6 || sanitized.axes.reduce(function (total, axis) { return total + axis.itemCount; }, 0) !== 25) return { saved: false, reason: "invalid-evidence" };
      const attempts = loadCompetitionEvidenceSeries();
      if (attempts.some(function (entry) { return entry.formId === sanitized.formId || entry.sourceFingerprintSha256 === sanitized.sourceFingerprintSha256; })) return { saved: false, reason: "duplicate-form" };
      if (attempts.length >= MAX_COMPETITION_FORMS) return { saved: false, reason: "series-full" };
      attempts.push(sanitized);
      write(COMPETITION_SERIES_KEY, { schemaVersion: "gfield-competition-first-attempts-v2", programId: "sasmo", attempts: attempts });
      saveCompetitionEvidence(sanitized);
      return { saved: true, count: attempts.length };
    }
    function getComparableCompetitionSeries(catalog, levelId) {
      if (!catalog || typeof catalog.getForm !== "function") return [];
      return loadCompetitionEvidenceSeries().filter(function (entry) {
        const form = catalog.getForm(entry.formId);
        return form && entry.levelId === levelId && form.levelId === levelId && entry.formVersion === form.formVersion && entry.comparisonKey === form.comparisonKey && entry.scoringFingerprintSha256 === form.scoringFingerprintSha256 && entry.sourceFingerprintSha256 === form.sourceFingerprintSha256;
      });
    }
    function clearCompetitionEvidence() {
      if (!store) return false;
      store.removeItem(COMPETITION_KEY);
      store.removeItem(COMPETITION_SERIES_KEY);
      return true;
    }
    return Object.freeze({ loadPractice: loadPractice, savePractice: savePractice, clearPractice: clearPractice, loadPlanSettings: loadPlanSettings, savePlanSettings: savePlanSettings, loadAssessmentEvidence: loadAssessmentEvidence, loadAssessmentEvidenceHistory: loadAssessmentEvidenceHistory, loadLatestAssessmentEvidence: loadLatestAssessmentEvidence, saveAssessmentEvidence: saveAssessmentEvidence, clearAssessmentEvidence: clearAssessmentEvidence, loadGfieldMockResultHistory: loadGfieldMockResultHistory, saveGfieldMockResult: saveGfieldMockResult, removeGfieldMockResult: removeGfieldMockResult, clearGfieldMockResultHistory: clearGfieldMockResultHistory, loadCompetitionDiagnosticHistory: loadCompetitionDiagnosticHistory, saveCompetitionDiagnostic: saveCompetitionDiagnostic, removeCompetitionDiagnostic: removeCompetitionDiagnostic, clearCompetitionDiagnosticHistory: clearCompetitionDiagnosticHistory, loadGrade6DiagnosticEvidence: loadGrade6DiagnosticEvidence, saveGrade6DiagnosticEvidence: saveGrade6DiagnosticEvidence, clearGrade6DiagnosticEvidence: clearGrade6DiagnosticEvidence, loadCompetitionEvidence: loadCompetitionEvidence, saveCompetitionEvidence: saveCompetitionEvidence, loadCompetitionEvidenceSeries: loadCompetitionEvidenceSeries, saveCompetitionFirstAttempt: saveCompetitionFirstAttempt, getComparableCompetitionSeries: getComparableCompetitionSeries, clearCompetitionEvidence: clearCompetitionEvidence });
  }
  function priorityForAxis(axis) { return AXIS_PRIORITIES[axis] || null; }
  return Object.freeze({ VERSION: VERSION, AXIS_PRIORITIES: AXIS_PRIORITIES, priorityForAxis: priorityForAxis, create: create, storage: create() });
});
