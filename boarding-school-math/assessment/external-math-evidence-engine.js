(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDExternalMathEvidenceEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-external-math-evidence-v1";
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
    Object.freeze({ id: "algebra-1", label: "Algebra 1", stage: "보통 Grades 8–10", publicLearning: false }),
    Object.freeze({ id: "geometry", label: "Geometry", stage: "보통 Grades 9–10", publicLearning: false }),
    Object.freeze({ id: "algebra-2", label: "Algebra 2", stage: "보통 Grades 10–11", publicLearning: false }),
    Object.freeze({ id: "precalculus", label: "Precalculus", stage: "보통 Grades 11–12", publicLearning: false })
  ]);
  const DOMAIN_SPECS = Object.freeze({
    number: Object.freeze({ label: "수와 연산", axis: "number-operations", clusterId: "6.NS.B" }),
    proportional: Object.freeze({ label: "비와 비례", axis: "number-operations", clusterId: "6.RP.A" }),
    algebra: Object.freeze({ label: "식·방정식", axis: "patterns-algebra", clusterId: "6.EE.B" }),
    geometry: Object.freeze({ label: "기하·측정", axis: "geometry-spatial", clusterId: "6.G.A" }),
    data: Object.freeze({ label: "자료·확률", axis: "data-probability", clusterId: "6.SP.A" }),
    reasoning: Object.freeze({ label: "문제 해결·추론", axis: "problem-solving-strategies", clusterId: "6.G.A" })
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
  function normalizeDomains(domains) {
    if (!Array.isArray(domains)) return [];
    const seen = new Set();
    return domains.map(function (row) {
      if (!record(row) || !DOMAIN_SPECS[row.id] || seen.has(row.id)) fail("DOMAIN_INVALID");
      seen.add(row.id);
      return Object.freeze({ id: row.id, label: DOMAIN_SPECS[row.id].label, axis: DOMAIN_SPECS[row.id].axis, clusterId: DOMAIN_SPECS[row.id].clusterId, percent: finite(row.percent, `DOMAIN_${row.id.toUpperCase()}`, 0, 100, true) });
    });
  }
  function evidenceMetric(input, source) {
    if (source.id === "school-placement") return finite(input.overallPercent, "OVERALL_PERCENT", 0, 100, true);
    if (source.id === "isee") {
      const quant = finite(input.quantStanine, "QUANT_STANINE", 1, 9, true);
      const math = finite(input.mathStanine, "MATH_STANINE", 1, 9, true);
      return Math.round((quant + math) / 2 * 10) / 10;
    }
    return finite(input.percentile, "PERCENTILE", 1, 99, true);
  }
  function performanceBand(sourceId, metric) {
    if (sourceId === "school-placement") {
      if (metric >= 85) return "advanced-evidence";
      if (metric >= 70) return "on-track-evidence";
      if (metric >= 50) return "developing-evidence";
      return "foundation-evidence";
    }
    if (sourceId === "isee") {
      if (metric >= 8) return "advanced-evidence";
      if (metric >= 6) return "on-track-evidence";
      if (metric >= 4) return "developing-evidence";
      return "foundation-evidence";
    }
    if (metric >= 85) return "advanced-evidence";
    if (metric >= 60) return "on-track-evidence";
    if (metric >= 35) return "developing-evidence";
    return "foundation-evidence";
  }
  function routeBetween(startId, targetId) {
    const start = COURSES.findIndex(function (row) { return row.id === startId; });
    const target = COURSES.findIndex(function (row) { return row.id === targetId; });
    const low = Math.min(start, target); const high = Math.max(start, target);
    return Object.freeze(COURSES.slice(low, high + 1).map(function (row) { return Object.freeze({ id: row.id, label: row.label, stage: row.stage, publicLearning: row.publicLearning }); }));
  }
  function analyze(input) {
    if (!record(input) || !SOURCES[input.sourceId]) fail("SOURCE_INVALID");
    const source = Object.freeze(Object.assign({ id: input.sourceId }, SOURCES[input.sourceId]));
    const grade = finite(input.grade, "GRADE", 2, 12, true);
    if (!Number.isInteger(grade)) fail("GRADE_INVALID");
    const current = course(input.currentCourseId, "CURRENT_COURSE");
    const target = course(input.targetCourseId, "TARGET_COURSE");
    const currentIndex = COURSES.indexOf(current); const targetIndex = COURSES.indexOf(target);
    if (targetIndex < currentIndex) fail("TARGET_COURSE_BEFORE_CURRENT");
    const testDate = date(input.testDate);
    const domains = normalizeDomains(input.domains);
    const metric = evidenceMetric(input, source);
    const band = performanceBand(source.id, metric);
    const schoolCut = source.id === "school-placement" ? finite(input.schoolCut, "SCHOOL_CUT", 0, 100, false) : null;
    const rit = source.id === "map-growth" ? finite(input.rit, "RIT", 100, 350, true) : null;
    const scaleScore = source.id === "ctp" || source.id === "ssat" ? finite(input.scaleScore, "SCALE_SCORE", 0, 2000, false) : null;
    const stanine = source.id === "ctp" ? finite(input.stanine, "STANINE", 1, 9, false) : source.id === "isee" ? metric : null;
    const normGroup = typeof input.normGroup === "string" && input.normGroup.trim() ? input.normGroup.trim().slice(0, 80) : null;
    const season = typeof input.season === "string" && ["fall", "winter", "spring", "summer"].includes(input.season) ? input.season : null;
    const sortedDomains = domains.slice().sort(function (a, b) { return a.percent - b.percent || a.id.localeCompare(b.id); });
    const priorityDomains = sortedDomains.filter(function (row) { return row.percent < 70; }).slice(0, 2);
    const minimumDomain = sortedDomains.length ? sortedDomains[0].percent : null;
    const clearsEnteredCut = schoolCut == null ? null : metric >= schoolCut;
    const targetCandidate = source.id === "school-placement" && clearsEnteredCut === true && (minimumDomain == null || minimumDomain >= 70);
    let recommendedIndex = currentIndex;
    if (band === "foundation-evidence") recommendedIndex = Math.max(0, currentIndex - 1);
    else if (band === "advanced-evidence" && source.role !== "admission-support" && domains.length >= 3 && minimumDomain >= 70) recommendedIndex = Math.min(currentIndex + 1, targetIndex);
    if (targetCandidate) recommendedIndex = targetIndex;
    const recommended = COURSES[recommendedIndex];
    const gapCount = priorityDomains.length;
    const baseWeeks = { "foundation-evidence": 12, "developing-evidence": 10, "on-track-evidence": 8, "advanced-evidence": 6 }[band];
    const weeks = Math.min(16, baseWeeks + gapCount * 2);
    const studyDaysPerWeek = band === "foundation-evidence" ? 5 : band === "developing-evidence" ? 4 : 3;
    const minutesPerDay = grade <= 5 ? 35 : grade <= 8 ? 45 : 60;
    const problemCountPerDay = band === "foundation-evidence" ? 8 : band === "developing-evidence" ? 10 : 12;
    const confidence = source.placementWeight === "primary" && schoolCut != null && domains.length >= 4 ? "high-for-gmap-plan" : domains.length >= 3 ? "medium-for-gmap-plan" : "low-for-gmap-plan";
    const placementState = source.role === "admission-support" ? "admission-evidence-only" : schoolCut == null ? "school-policy-required" : clearsEnteredCut ? "entered-cut-met-school-review-required" : "entered-cut-not-met";
    const primaryPriority = priorityDomains[0] || sortedDomains[0] || Object.freeze({ id: "reasoning", label: DOMAIN_SPECS.reasoning.label, axis: DOMAIN_SPECS.reasoning.axis, clusterId: DOMAIN_SPECS.reasoning.clusterId, percent: null });
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      evidenceKind: "user-entered-external-assessment",
      officialPlacement: false,
      source,
      testDate,
      grade,
      scores: Object.freeze({ metric, metricLabel: source.scoreLabel, rit, scaleScore, stanine, percentile: source.id !== "school-placement" && source.id !== "isee" ? metric : null, schoolCut, clearsEnteredCut, normGroup, season }),
      band,
      confidence,
      placementState,
      currentCourse: current,
      targetCourse: target,
      recommendedStart: recommended,
      targetCandidate,
      route: routeBetween(recommended.id, target.id),
      domains: Object.freeze(domains),
      priorityDomains: Object.freeze(priorityDomains),
      primaryPriority,
      plan: Object.freeze({ weeks, studyDaysPerWeek, minutesPerDay, problemCountPerDay, retentionDays: Object.freeze([1, 3, 7, 14]) }),
      materialState: grade === 6 && current.id === "pre-algebra" ? "verified-grade6-public-materials" : "pathway-only-content-locked",
      decisionNotice: source.role === "admission-support" ? "입학시험 결과는 지원 준비의 보조 근거이며 수학 과정 배정을 단독 결정하지 않습니다." : "이 결과는 G·MAP 권장 진도이며 학교의 공식 배정은 학교 정책과 교사 검토로 확정됩니다."
    });
  }

  return Object.freeze({ SCHEMA_VERSION, SOURCES, COURSES, DOMAIN_SPECS, analyze, performanceBand });
});
