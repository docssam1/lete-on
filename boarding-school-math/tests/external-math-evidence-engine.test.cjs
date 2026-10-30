"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../assessment/external-math-evidence-engine.js");

function base(overrides) {
  return Object.assign({
    sourceId: "school-placement", testDate: "2026-09-01", grade: 6,
    currentCourseId: "pre-algebra", targetCourseId: "algebra-1",
    overallPercent: 82, schoolCut: 80,
    domains: [
      { id: "number", percent: 88 }, { id: "proportional", percent: 84 },
      { id: "algebra", percent: 78 }, { id: "geometry", percent: 72 },
      { id: "reasoning", percent: 74 }
    ]
  }, overrides || {});
}

test("school-cut comparison reports only the entered cutoff and never official placement", function () {
  const result = engine.analyze(base());
  assert.equal(result.targetCandidate, true);
  assert.equal(result.recommendedStart.id, "pre-algebra");
  assert.equal(result.officialPlacement, false);
  assert.equal(result.placementState, "entered-cut-met-school-review-required");
  assert.equal(result.band, null);
  assert.equal(result.confidence, "not-calculated");
  assert.equal(result.plan.weeks, null);
});

test("entered domain values are shown descriptively and do not apply an invented readiness cutoff", function () {
  const result = engine.analyze(base({ domains: [{ id: "number", percent: 90 }, { id: "algebra", percent: 88 }, { id: "geometry", percent: 61 }, { id: "reasoning", percent: 80 }] }));
  assert.equal(result.targetCandidate, true);
  assert.equal(result.recommendedStart.id, "pre-algebra");
  assert.equal(result.primaryPriority, null);
  assert.deepEqual(result.priorityDomains, []);
  assert.equal(result.domainComparisons[0].clusterId, "6.G.A");
  assert.equal(result.domainComparisons[0].percent, 61);
  assert.equal(result.domainComparisons.find(function (domain) { return domain.id === "reasoning"; }).clusterId, null);
});

test("MAP evidence keeps RIT distinct from percentile and reflects only the selected course route", function () {
  const result = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, season: "fall", normYear: "2025", instructionalWeeks: 4 }));
  assert.equal(result.scores.rit, 218);
  assert.equal(result.scores.percentile, 64);
  assert.equal(result.band, null);
  assert.equal(result.scores.season, "fall");
  assert.equal(result.scores.normYear, "2025");
  assert.equal(result.scores.instructionalWeeks, 4);
  assert.equal(result.placementState, "school-policy-required");
  assert.equal(result.recommendedStart.id, "pre-algebra");
  assert.equal(result.targetCandidate, false);
});

test("MAP norm year is kept only for supported, explicitly selected references", function () {
  const supported = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, season: "fall", normYear: "2025" }));
  const unknown = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, season: "fall" }));
  const invalid = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, season: "fall", normYear: "2015" }));
  const unrelated = engine.analyze(base({ sourceId: "school-placement", normYear: "2025" }));
  assert.equal(supported.scores.normYear, "2025");
  assert.equal(unknown.scores.normYear, null);
  assert.equal(invalid.scores.normYear, null);
  assert.equal(unrelated.scores.normYear, null);
  assert.throws(function () { engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, instructionalWeeks: 4.5 })); }, /INSTRUCTIONAL_WEEKS_INVALID/);
});

test("a high supporting score without domain evidence cannot advance a course by itself", function () {
  const map = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 242, percentile: 93, domains: [] }));
  assert.equal(map.recommendedStart.id, "pre-algebra");
  const ctp = engine.analyze(base({ sourceId: "ctp", overallPercent: undefined, schoolCut: undefined, percentile: 91, stanine: 8, domains: [] }));
  assert.equal(ctp.recommendedStart.id, "pre-algebra");
});

test("SSAT and ISEE remain admissions evidence and cannot independently advance placement", function () {
  const ssat = engine.analyze(base({ sourceId: "ssat", overallPercent: undefined, schoolCut: undefined, percentile: 96, scaleScore: 760, domains: [] }));
  assert.equal(ssat.recommendedStart.id, "pre-algebra");
  assert.equal(ssat.placementState, "admission-evidence-only");
  const isee = engine.analyze(base({ sourceId: "isee", overallPercent: undefined, schoolCut: undefined, quantStanine: 9, mathStanine: 8, domains: [] }));
  assert.equal(isee.recommendedStart.id, "pre-algebra");
  assert.equal(isee.officialPlacement, false);
  assert.equal(isee.scores.metric, null);
});

test("SSAT and ISEE test levels are preserved only for their own known levels", function () {
  const ssat = engine.analyze(base({ sourceId: "ssat", overallPercent: undefined, schoolCut: undefined, percentile: 70, testLevel: "ssat-middle", domains: [] }));
  const isee = engine.analyze(base({ sourceId: "isee", overallPercent: undefined, schoolCut: undefined, quantStanine: 6, mathStanine: 7, testLevel: "isee-upper", domains: [] }));
  const unrelated = engine.analyze(base({ testLevel: "isee-upper" }));
  assert.equal(ssat.scores.testLevel, "ssat-middle");
  assert.equal(isee.scores.testLevel, "isee-upper");
  assert.equal(unrelated.scores.testLevel, null);
  assert.throws(function () { engine.analyze(base({ sourceId: "ssat", overallPercent: undefined, schoolCut: undefined, percentile: 70, testLevel: "isee-middle", domains: [] })); }, /TEST_LEVEL_INVALID/);
});

test("invalid ranges are rejected while the user-selected course comparison may branch either way", function () {
  assert.throws(function () { engine.analyze(base({ grade: 1 })); }, /GRADE_INVALID/);
  assert.throws(function () { engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 99, percentile: 50 })); }, /RIT_INVALID/);
  const selected = engine.analyze(base({ currentCourseId: "algebra-1", targetCourseId: "pre-algebra" }));
  assert.deepEqual(selected.route.map(function (course) { return course.id; }), ["algebra-1", "pre-algebra"]);
  assert.equal(selected.band, null);
});

test("high-school elective comparisons preserve school choice and do not imply an intermediate sequence", function () {
  const ids = engine.COURSES.map(function (course) { return course.id; });
  assert.ok(ids.includes("calculus"));
  assert.ok(ids.includes("statistics"));
  assert.ok(ids.includes("discrete-mathematics"));
  const result = engine.analyze(base({ grade: 12, currentCourseId: "algebra-2", targetCourseId: "statistics", domains: [{ id: "data", percent: 61 }] }));
  assert.deepEqual(result.route.map(function (course) { return course.id; }), ["algebra-2", "statistics"]);
  assert.equal(result.domainComparisons[0].clusterId, null);
  const grade6 = engine.analyze(base({ grade: 6, domains: [{ id: "geometry", percent: 61 }] }));
  assert.equal(grade6.domainComparisons[0].clusterId, "6.G.A");
});

test("only the verified Grade 6 Pre-Algebra bridge unlocks current public materials", function () {
  const gradeSix = engine.analyze(base({ domains: [{ id: "geometry", percent: 61 }] }));
  assert.equal(gradeSix.materialState, "verified-grade6-public-materials");
  const gradeSeven = engine.analyze(base({ grade: 7, domains: [{ id: "geometry", percent: 61 }] }));
  assert.equal(gradeSeven.materialState, "pathway-only-content-locked");
  const algebraCurrent = engine.analyze(base({ currentCourseId: "algebra-1", targetCourseId: "geometry", domains: [{ id: "algebra", percent: 61 }] }));
  assert.equal(algebraCurrent.materialState, "pathway-only-content-locked");
});
