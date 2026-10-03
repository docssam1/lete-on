(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDLearnerPlanEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-learner-plan-v1";
  const RETENTION_DAYS = Object.freeze([1, 3, 7, 14]);
  const GOALS = Object.freeze({
    "school-g6": Object.freeze({
      id: "school-g6",
      label: "Grade 6 학교 과정·배치",
      program: "school-placement",
      assessmentLabel: "Grade 6 42문항 진단",
      assessmentHref: "./diagnostic.html",
      clusterId: "6.G.A",
      clusterLabel: "기하 측정",
      scoreUnit: null
    }),
    "sasmo-primary6": Object.freeze({
      id: "sasmo-primary6",
      label: "SASMO Primary 6",
      program: "sasmo",
      assessmentLabel: "SASMO 준비도 점검",
      assessmentHref: "./competition-practice.html?program=sasmo-g6&audience=student&locale=ko",
      clusterId: "6.G.A",
      clusterLabel: "기하·공간 추론",
      scoreUnit: "/ 70"
    }),
    "promotion-g6": Object.freeze({
      id: "promotion-g6",
      label: "Grade 6 승급·선발 대비",
      program: "promotion",
      assessmentLabel: "승급 진단 배정",
      assessmentHref: "./diagnostic.html",
      clusterId: "6.G.A",
      clusterLabel: "기하 측정",
      scoreUnit: null
    })
  });
  const ERROR_PROFILES = Object.freeze({
    "prerequisite-gap": Object.freeze({ label: "선수개념부터 다시 연결할 약점", weights: Object.freeze({ review: 0.12, concept: 0.36, guided: 0.34, independent: 0.13, check: 0.05 }) }),
    "concept-gap": Object.freeze({ label: "개념의 뜻과 조건을 다시 연결할 약점", weights: Object.freeze({ review: 0.08, concept: 0.30, guided: 0.38, independent: 0.19, check: 0.05 }) }),
    "representation-error": Object.freeze({ label: "그림·표·식 사이의 표현을 바꿔 볼 약점", weights: Object.freeze({ review: 0.10, concept: 0.20, guided: 0.40, independent: 0.25, check: 0.05 }) }),
    "calculation-error": Object.freeze({ label: "계산 과정과 역산 확인이 필요한 약점", weights: Object.freeze({ review: 0.20, concept: 0.08, guided: 0.26, independent: 0.41, check: 0.05 }) }),
    "condition-missed": Object.freeze({ label: "문제의 조건을 빠짐없이 표시할 약점", weights: Object.freeze({ review: 0.15, concept: 0.12, guided: 0.35, independent: 0.33, check: 0.05 }) }),
    "strategy-gap": Object.freeze({ label: "풀이 전략을 비교하고 첫 단계를 고를 약점", weights: Object.freeze({ review: 0.12, concept: 0.20, guided: 0.42, independent: 0.21, check: 0.05 }) }),
    "explanation-incomplete": Object.freeze({ label: "답의 근거를 수학 문장으로 완성할 약점", weights: Object.freeze({ review: 0.10, concept: 0.15, guided: 0.36, independent: 0.29, check: 0.10 }) })
  });
  const DIFFICULTY_MINUTES = Object.freeze({ foundation: 2.5, core: 4, advanced: 6 });

  function fail(message) { throw new Error(message); }
  function record(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function integer(value, field, min, max) {
    if (!Number.isInteger(value) || value < min || value > max) fail(`${field} is invalid`);
    return value;
  }
  function dateText(value, field) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`${field} is invalid`);
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) fail(`${field} is invalid`);
    return date;
  }
  function href(clusterId, audience, mode) {
    return `./unit-workbook.html?cluster=${encodeURIComponent(clusterId)}&mode=${mode}&audience=${audience}&locale=ko&paper=A4`;
  }
  function validateInput(input) {
    if (!record(input)) fail("plan input is required");
    if (!GOALS[input.goalId]) fail("goalId is invalid");
    dateText(input.startDate, "startDate");
    const target = dateText(input.targetDate, "targetDate");
    const start = dateText(input.startDate, "startDate");
    if (target <= start) fail("targetDate must be after startDate");
    if (!record(input.availability)) fail("availability is required");
    integer(input.availability.studyDaysPerWeek, "availability.studyDaysPerWeek", 1, 7);
    integer(input.availability.minutesPerDay, "availability.minutesPerDay", 20, 180);
    if (!Array.isArray(input.priorities) || input.priorities.length < 1 || input.priorities.length > 2) fail("priorities must contain 1-2 skills");
    input.priorities.forEach(function (priority, index) {
      if (!record(priority) || typeof priority.label !== "string" || !priority.label.trim()) fail(`priorities[${index}] is invalid`);
      if (!ERROR_PROFILES[priority.errorType]) fail(`priorities[${index}].errorType is invalid`);
      if (!DIFFICULTY_MINUTES[priority.difficulty]) fail(`priorities[${index}].difficulty is invalid`);
      if (priority.clusterId != null && !/^\d+\.[A-Z]+\.[A-Z]+$/.test(priority.clusterId)) fail(`priorities[${index}].clusterId is invalid`);
    });
    if (input.prediction != null) {
      if (!record(input.prediction) || !Array.isArray(input.prediction.range) || input.prediction.range.length !== 2 || !Number.isFinite(input.prediction.range[0]) || !Number.isFinite(input.prediction.range[1]) || input.prediction.range[0] > input.prediction.range[1] || !["low", "medium", "high"].includes(input.prediction.confidence)) fail("prediction is invalid");
    }
    return true;
  }
  function allocateMinutes(total, weights) {
    const keys = ["review", "concept", "guided", "independent", "check"];
    const minimums = Object.freeze({ review: 2, concept: 3, guided: 3, independent: 3, check: 2 });
    const minimumTotal = keys.reduce(function (sum, key) { return sum + minimums[key]; }, 0);
    if (total < minimumTotal) fail("daily minutes cannot cover the five learning blocks");
    const remaining = total - minimumTotal;
    const output = {};
    const fractions = [];
    let used = minimumTotal;
    keys.forEach(function (key, index) {
      const exact = remaining * weights[key];
      const extra = Math.floor(exact);
      output[key] = minimums[key] + extra;
      used += extra;
      fractions.push({ key: key, index: index, remainder: exact - extra });
    });
    fractions.sort(function (left, right) { return right.remainder - left.remainder || left.index - right.index; });
    for (let index = 0; used < total; index += 1, used += 1) output[fractions[index % fractions.length].key] += 1;
    return Object.freeze(output);
  }
  function estimateProblems(minutes, difficulty, floor, ceiling) {
    return Math.max(floor, Math.min(ceiling, Math.round(minutes / DIFFICULTY_MINUTES[difficulty])));
  }
  function buildDailySession(goal, availability, priority) {
    const profile = ERROR_PROFILES[priority.errorType];
    const minutes = allocateMinutes(availability.minutesPerDay, profile.weights);
    const clusterId = priority.clusterId || goal.clusterId;
    const guidedCount = estimateProblems(minutes.guided, priority.difficulty, 2, 6);
    const independentCount = estimateProblems(minutes.independent, priority.difficulty, 2, 8);
    return Object.freeze({
      totalMinutes: availability.minutesPerDay,
      totalProblemCount: guidedCount + independentCount + 1,
      blocks: Object.freeze([
        Object.freeze({ id: "review", title: "이전 학습 다시 보기", minutes: minutes.review, detail: "최근 오답 또는 유지 확인 1개", kind: "retention" }),
        Object.freeze({ id: "concept", title: "개념 교재", minutes: minutes.concept, detail: `${priority.label}의 핵심 모델과 예제`, kind: "concept", href: `./concept-learning.html?cluster=${encodeURIComponent(clusterId)}&from=diagnostic` }),
        Object.freeze({ id: "guided", title: "수업용 워크북", minutes: minutes.guided, problemCount: guidedCount, detail: `대표 유형 ${guidedCount}문항`, kind: "guided", href: href(clusterId, "student", "workbook") }),
        Object.freeze({ id: "independent", title: "혼자 풀기", minutes: minutes.independent, problemCount: independentCount, detail: `약점 보완 ${independentCount}문항`, kind: "independent", href: href(clusterId, "student", "workbook") }),
        Object.freeze({ id: "check", title: "마무리 확인", minutes: minutes.check, problemCount: 1, detail: "오늘 배운 유형 1문항", kind: "check", href: href(clusterId, "student", "workbook") })
      ])
    });
  }
  function buildPlan(input) {
    validateInput(input);
    const goal = GOALS[input.goalId];
    const start = dateText(input.startDate, "startDate");
    const target = dateText(input.targetDate, "targetDate");
    const daysRemaining = Math.ceil((target.getTime() - start.getTime()) / 86400000);
    const calendarWeeks = Math.max(1, Math.ceil(daysRemaining / 7));
    const studyDays = calendarWeeks * input.availability.studyDaysPerWeek;
    const usableMinutes = Math.floor(studyDays * input.availability.minutesPerDay * 0.8);
    const primary = input.priorities[0];
    const clusterId = primary.clusterId || goal.clusterId;
    const session = buildDailySession(goal, input.availability, primary);
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      goal,
      calendar: Object.freeze({ startDate: input.startDate, targetDate: input.targetDate, daysRemaining, calendarWeeks, studyDays, usableMinutes, planningRule: "80-percent-buffer" }),
      availability: Object.freeze({ studyDaysPerWeek: input.availability.studyDaysPerWeek, minutesPerDay: input.availability.minutesPerDay }),
      diagnostic: Object.freeze({ state: input.prediction ? "evidence-connected" : "diagnostic-required", actionLabel: goal.assessmentLabel, actionHref: goal.assessmentHref }),
      prediction: input.prediction ? Object.freeze({ state: "available", range: Object.freeze(input.prediction.range.slice()), confidence: input.prediction.confidence, scoreUnit: goal.scoreUnit }) : Object.freeze({ state: "diagnostic-required", range: null, confidence: null, scoreUnit: goal.scoreUnit }),
      priorities: Object.freeze(input.priorities.map(function (priority, index) {
        const selectedCluster = priority.clusterId || goal.clusterId;
        return Object.freeze({ rank: index + 1, label: priority.label.trim(), errorType: priority.errorType, errorLabel: ERROR_PROFILES[priority.errorType].label, difficulty: priority.difficulty, clusterId: selectedCluster });
      })),
      today: session,
      materials: Object.freeze({
        clusterId,
        studentConceptHref: `./concept-learning.html?cluster=${encodeURIComponent(clusterId)}&from=diagnostic`,
        studentWorkbookHref: href(clusterId, "student", "workbook"),
        teacherWorkbookHref: href(clusterId, "teacher", "workbook"),
        teacherLessonHref: `./concept-learning.html?cluster=${encodeURIComponent(clusterId)}&from=diagnostic`
      }),
      retention: Object.freeze(RETENTION_DAYS.map(function (afterDays) { return Object.freeze({ afterDays, label: `${afterDays}일 뒤 재확인`, status: "scheduled-after-first-study" }); }))
    });
  }

  return Object.freeze({ SCHEMA_VERSION, GOALS, RETENTION_DAYS, buildPlan, validateInput });
});
