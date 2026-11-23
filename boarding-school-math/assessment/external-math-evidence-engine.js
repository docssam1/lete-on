(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDExternalMathEvidenceEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-external-math-evidence-v3";
  const SOURCES = Object.freeze({
    "school-placement": Object.freeze({ label: "학교 수학 Placement Test", role: "course-placement", placementWeight: "primary", scoreLabel: "정답률" }),
    "map-growth": Object.freeze({ label: "NWEA MAP Growth Math", role: "instructional-growth", placementWeight: "supporting", scoreLabel: "성취 백분위" }),
    ctp: Object.freeze({ label: "ERB CTP Mathematics", role: "achievement-and-growth", placementWeight: "supporting", scoreLabel: "성취 백분위" }),
    ssat: Object.freeze({ label: "SSAT Quantitative", role: "admission-support", placementWeight: "supplementary", scoreLabel: "Quantitative 백분위" }),
    isee: Object.freeze({ label: "ISEE Quantitative / Mathematics", role: "admission-support", placementWeight: "supplementary", scoreLabel: "수학 stanine" })
  });
  const COURSES = Object.freeze([
    Object.freeze({ id: "elementary-foundations", label: "Elementary Foundations", stage: "K–5", publicLearning: false }),
    Object.freeze({ id: "pre-algebra", label: "Pre-Algebra", stage: "Grades 6–8", publicLearning: true }),
    Object.freeze({ id: "algebra-1", label: "Algebra 1", stage: "학교별 과목 순서 확인", publicLearning: false }),
    Object.freeze({ id: "geometry", label: "Geometry", stage: "학교별 과목 순서 확인", publicLearning: false }),
    Object.freeze({ id: "algebra-2", label: "Algebra 2", stage: "학교별 과목 순서 확인", publicLearning: false }),
    Object.freeze({ id: "precalculus", label: "Precalculus", stage: "학교별 과목 순서 확인", publicLearning: false }),
    Object.freeze({ id: "calculus", label: "Calculus", stage: "고등학교 선택 과목 · 학교별", publicLearning: false }),
    Object.freeze({ id: "statistics", label: "Statistics", stage: "고등학교 선택 과목 · 학교별", publicLearning: false }),
    Object.freeze({ id: "discrete-mathematics", label: "Discrete Mathematics", stage: "고등학교 선택 과목 · 학교별", publicLearning: false })
  ]);
  const DOMAIN_SPECS = Object.freeze({
    number: Object.freeze({ label: "수와 연산", axis: "number-operations", clusterId: "6.NS.B" }),
    proportional: Object.freeze({ label: "비와 비례", axis: "number-operations", clusterId: "6.RP.A" }),
    algebra: Object.freeze({ label: "식·방정식", axis: "patterns-algebra", clusterId: "6.EE.B" }),
    geometry: Object.freeze({ label: "기하·측정", axis: "geometry-spatial", clusterId: "6.G.A" }),
    data: Object.freeze({ label: "자료·확률", axis: "data-probability", clusterId: "6.SP.A" }),
    reasoning: Object.freeze({ label: "문제 해결·추론", axis: "problem-solving-strategies", clusterId: null })
  });

  function fail(code) { throw new Error(code); }
  function record(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
  function finite(value, field, min, max, required) {
    if (value == null || value === "") { if (required) fail(`${field}_REQUIRED`); return null; }
    const number = Number(value);
    if (!Number.isFinite(number) || number < min || number > max) fail(`${field}_INVALID`);
    return number;
  }
  function date(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail("TEST_DATE_INVALID");
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail("TEST_DATE_INVALID");
    return value;
  }
  function course(id, field) {
    const found = COURSES.find(function (row) { return row.id === id; });
    if (!found) fail(`${field}_INVALID`);
    return found;
  }
  function normalizeDomains(domains, grade) {
    if (!Array.isArray(domains)) return [];
    const seen = new Set();
    return domains.map(function (row) {
      if (!record(row) || !DOMAIN_SPECS[row.id] || seen.has(row.id)) fail("DOMAIN_INVALID");
      seen.add(row.id);
      return Object.freeze({ id: row.id, label: DOMAIN_SPECS[row.id].label, axis: DOMAIN_SPECS[row.id].axis, clusterId: grade === 6 ? DOMAIN_SPECS[row.id].clusterId : null, percent: finite(row.percent, `DOMAIN_${row.id.toUpperCase()}`, 0, 100, true) });
    });
  }
  function evidenceMetric(input, source) {
    if (source.id === "school-placement") return finite(input.overallPercent, "OVERALL_PERCENT", 0, 100, true);
    if (source.id === "isee") {
      finite(input.quantStanine, "QUANT_STANINE", 1, 9, true);
      finite(input.mathStanine, "MATH_STANINE", 1, 9, true);
      return null;
    }
    return finite(input.percentile, "PERCENTILE", 1, 99, true);
  }
  function testLevel(input, source) {
    if (source.id !== "ssat" && source.id !== "isee") return null;
    const value = typeof input.testLevel === "string" ? input.testLevel : "";
    const allowed = source.id === "ssat"
      ? ["ssat-elementary-3", "ssat-elementary-4", "ssat-middle", "ssat-upper"]
      : ["isee-primary-2", "isee-primary-3", "isee-primary-4", "isee-lower", "isee-middle", "isee-upper"];
    if (value && !allowed.includes(value)) fail("TEST_LEVEL_INVALID");
    return value || null;
  }
  function routeBetween(startId, targetId) {
    return Object.freeze([startId, targetId].filter(function (id, index, ids) { return index === 0 || id !== ids[index - 1]; }).map(function (id) {
      const row = course(id, "ROUTE_COURSE");
      return Object.freeze({ id: row.id, label: row.label, stage: row.stage, publicLearning: row.publicLearning });
    }));
  }
  function analyze(input) {
    if (!record(input) || !SOURCES[input.sourceId]) fail("SOURCE_INVALID");
    const source = Object.freeze(Object.assign({ id: input.sourceId }, SOURCES[input.sourceId]));
    const grade = finite(input.grade, "GRADE", 2, 12, true);
    if (!Number.isInteger(grade)) fail("GRADE_INVALID");
    const current = course(input.currentCourseId, "CURRENT_COURSE");
    const target = course(input.targetCourseId, "TARGET_COURSE");
    const testDate = date(input.testDate);
    const domains = normalizeDomains(input.domains, grade);
    const metric = evidenceMetric(input, source);
    const selectedTestLevel = testLevel(input, source);
    const quantStanine = source.id === "isee" ? finite(input.quantStanine, "QUANT_STANINE", 1, 9, true) : null;
    const mathStanine = source.id === "isee" ? finite(input.mathStanine, "MATH_STANINE", 1, 9, true) : null;
    const schoolCut = source.id === "school-placement" ? finite(input.schoolCut, "SCHOOL_CUT", 0, 100, false) : null;
    const rit = source.id === "map-growth" ? finite(input.rit, "RIT", 100, 350, true) : null;
    const scaleScore = source.id === "ctp" || source.id === "ssat" ? finite(input.scaleScore, "SCALE_SCORE", 0, 2000, false) : null;
    const stanine = source.id === "ctp" ? finite(input.stanine, "STANINE", 1, 9, false) : null;
    const normGroup = source.id === "ctp" && typeof input.normGroup === "string" && input.normGroup.trim() ? input.normGroup.trim().slice(0, 80) : null;
    const season = source.id === "map-growth" && typeof input.season === "string" && ["fall", "winter", "spring", "summer"].includes(input.season) ? input.season : null;
    const normYear = source.id === "map-growth" && ["2020", "2025"].includes(String(input.normYear || "")) ? String(input.normYear) : null;
    const instructionalWeeks = source.id === "map-growth" ? finite(input.instructionalWeeks, "INSTRUCTIONAL_WEEKS", 1, 40, false) : null;
    if (instructionalWeeks != null && !Number.isInteger(instructionalWeeks)) fail("INSTRUCTIONAL_WEEKS_INVALID");
    const sortedDomains = domains.slice().sort(function (a, b) { return a.percent - b.percent || a.id.localeCompare(b.id); });
    const clearsEnteredCut = schoolCut == null ? null : metric >= schoolCut;
    const targetCandidate = source.id === "school-placement" && clearsEnteredCut === true;
    const placementState = source.role === "admission-support" ? "admission-evidence-only" : schoolCut == null ? "school-policy-required" : clearsEnteredCut ? "entered-cut-met-school-review-required" : "entered-cut-not-met";
    const primaryPriority = null;
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      evidenceKind: "user-entered-external-assessment",
      officialPlacement: false,
      source,
      testDate,
      grade,
      scores: Object.freeze({ metric, metricLabel: source.scoreLabel, rit, scaleScore, stanine, quantStanine, mathStanine, percentile: source.id !== "school-placement" && source.id !== "isee" ? metric : null, schoolCut, clearsEnteredCut, normGroup, testLevel: selectedTestLevel, season, normYear, instructionalWeeks }),
      band: null,
      confidence: "not-calculated",
      placementState,
      currentCourse: current,
      targetCourse: target,
      recommendedStart: current,
      domainComparisons: Object.freeze(sortedDomains),
      targetCandidate,
      route: routeBetween(current.id, target.id),
      domains: Object.freeze(domains),
      priorityDomains: Object.freeze([]),
      primaryPriority,
      plan: Object.freeze({ weeks: null, studyDaysPerWeek: null, minutesPerDay: null, problemCountPerDay: null, retentionDays: Object.freeze([1, 3, 7, 14]) }),
      materialState: grade === 6 && current.id === "pre-algebra" ? "verified-grade6-public-materials" : "pathway-only-content-locked",
      decisionNotice: source.role === "admission-support" ? "입학시험 점수는 입력한 자료로 기록합니다. 수학 과정 배정을 단독 결정하지 않습니다." : "시험 점수와 사용자가 입력한 과정의 비교 자료입니다. 학교의 공식 배정은 학교 정책과 교사 검토로 결정합니다."
    });
  }

  return Object.freeze({ SCHEMA_VERSION, SOURCES, COURSES, DOMAIN_SPECS, analyze });
});
