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

test("an entered school cutoff can create a target-course candidate but never official placement", function () {
  const result = engine.analyze(base());
  assert.equal(result.targetCandidate, true);
  assert.equal(result.recommendedStart.id, "algebra-1");
  assert.equal(result.officialPlacement, false);
  assert.equal(result.placementState, "entered-cut-met-school-review-required");
  assert.equal(result.confidence, "high-for-gmap-plan");
});

test("a low prerequisite domain blocks target-course acceleration even when the total clears the entered cut", function () {
  const result = engine.analyze(base({ domains: [{ id: "number", percent: 90 }, { id: "algebra", percent: 88 }, { id: "geometry", percent: 61 }, { id: "reasoning", percent: 80 }] }));
  assert.equal(result.targetCandidate, false);
  assert.equal(result.recommendedStart.id, "pre-algebra");
  assert.equal(result.primaryPriority.clusterId, "6.G.A");
  assert.deepEqual(result.plan.retentionDays, [1, 3, 7, 14]);
});

test("MAP evidence keeps RIT distinct from percentile and produces an instructional route", function () {
  const result = engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 218, percentile: 64, season: "fall" }));
  assert.equal(result.scores.rit, 218);
  assert.equal(result.scores.percentile, 64);
  assert.equal(result.band, "on-track-evidence");
  assert.equal(result.placementState, "school-policy-required");
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
});

test("invalid ranges and backwards course targets are rejected", function () {
  assert.throws(function () { engine.analyze(base({ grade: 1 })); }, /GRADE_INVALID/);
  assert.throws(function () { engine.analyze(base({ sourceId: "map-growth", overallPercent: undefined, schoolCut: undefined, rit: 99, percentile: 50 })); }, /RIT_INVALID/);
  assert.throws(function () { engine.analyze(base({ currentCourseId: "algebra-1", targetCourseId: "pre-algebra" })); }, /TARGET_COURSE_BEFORE_CURRENT/);
});

test("only the verified Grade 6 Pre-Algebra bridge unlocks current public materials", function () {
  const gradeSix = engine.analyze(base({ domains: [{ id: "geometry", percent: 61 }] }));
  assert.equal(gradeSix.materialState, "verified-grade6-public-materials");
  const gradeSeven = engine.analyze(base({ grade: 7, domains: [{ id: "geometry", percent: 61 }] }));
  assert.equal(gradeSeven.materialState, "pathway-only-content-locked");
  const algebraCurrent = engine.analyze(base({ currentCourseId: "algebra-1", targetCourseId: "geometry", domains: [{ id: "algebra", percent: 61 }] }));
  assert.equal(algebraCurrent.materialState, "pathway-only-content-locked");
});
