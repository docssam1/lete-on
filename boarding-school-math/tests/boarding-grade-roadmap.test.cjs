"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const roadmap = require("../learning/boarding-grade-roadmap.js");

test("grade roadmap covers provided grades and labels the inferred Grade 9 bridge", function () {
  assert.deepEqual(roadmap.grades.map(function (entry) { return entry.grade; }), [3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(roadmap.getGrade(9).source, "inferred");
  assert.equal(roadmap.getGrade(7).source, "provided");
  roadmap.grades.forEach(function (entry) { assert.equal(entry.steps.length, 4); });
});

test("school, competition, and SAT stay separate in upper-grade examples", function () {
  assert.deepEqual(roadmap.getTracks(3).map((track) => track[0]), ["학교 수학", "문제 해결"]);
  assert.deepEqual(roadmap.getTracks(7).map((track) => track[0]), ["학교 수학", "경시 · 선택", "SAT · 맛보기"]);
  assert.match(roadmap.getTracks(9)[0][0], /추정/);
  assert.match(roadmap.getTracks(10)[2][1], /응시할 때/);
});

test("annual roadmap uses supplied 12-month stages and labels the Grade 9 bridge as inferred", function () {
  [6, 7, 8, 10].forEach(function (grade) {
    const plan = roadmap.getAnnualPlan(grade);
    assert.equal(plan.source, "provided");
    assert.equal(plan.periods.length, 4);
    assert.deepEqual(plan.periods.map(function (period) { return period[0].split(" · ")[0]; }), ["1–3개월", "4–6개월", "7–9개월", "10–12개월"]);
    assert.ok(plan.periods.every(function (period) { return period.slice(1).every(Boolean); }));
  });
  assert.equal(roadmap.getAnnualPlan(9).source, "inferred");
  assert.equal(roadmap.getAnnualPlan(9).periods.length, 4);
  assert.deepEqual(roadmap.getAnnualPlan(9).periods.map(function (period) { return period[0].replace(" · 추정", ""); }), ["1–3개월", "4–6개월", "7–9개월", "10–12개월"]);
  assert.ok(roadmap.getAnnualPlan(9).periods.every(function (period) { return period[0].includes("추정"); }));
  assert.match(roadmap.getAnnualPlan(9).note, /추정안/);
  [6, 7, 8, 10].forEach(function (grade) { assert.doesNotMatch(roadmap.getAnnualPlan(grade).note, /사용자|제공된 계획/); });
  [3, 4, 5].forEach(function (grade) { assert.equal(roadmap.getAnnualPlan(grade), null); });
});

test("Grade 7 route names checkpoints and only links available workbook previews", function () {
  assert.deepEqual(roadmap.grade7Stops.map(function (stop) { return stop.id; }), ["nsa", "rpa", "ee", "geometry"]);
  assert.deepEqual(roadmap.getGrade(7).steps.map(function (step) { return step[0]; }), roadmap.grade7Stops.map(function (stop) { return stop.title; }));
  assert.equal(roadmap.grade7Stops[0].resourceState, "review-preview");
  assert.equal(roadmap.grade7Stops[1].resourceState, "public");
  assert.ok(roadmap.grade7Stops.every(function (stop) { return Boolean(stop.check); }));
  assert.ok(roadmap.grade7Stops.slice(2).every(function (stop) { return !stop.clusterId; }));
});

test("competition options follow grade and keep advanced AMC paths optional", function () {
  assert.deepEqual(roadmap.competitionOptions(3).map(function (entry) { return entry.id; }), ["sasmo", "kangaroo"]);
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc8"; }));
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc10" && entry.optional === true; }));
  assert.ok(!roadmap.competitionOptions(10).some(function (entry) { return entry.id === "amc8"; }));
});

test("manual competition analysis validates counts and does not assign a level", function () {
  const valid = roadmap.analyzeCompetition([
    { attempted: 4, correct: 3 }, { attempted: 2, correct: 2 },
    { attempted: 3, correct: 1 }, { attempted: 1, correct: 0 }
  ], 25);
  assert.equal(valid.valid, true);
  assert.equal(valid.complete, false);
  assert.equal(valid.attempted, 10);
  assert.equal(valid.rows[0].rate, 75);
  assert.equal(valid.rows[1].evidence, "3문제 미만");
  assert.equal("level" in valid, false);
  assert.equal(roadmap.analyzeCompetition([
    { attempted: 4, correct: 5 }, { attempted: 0, correct: 0 },
    { attempted: 0, correct: 0 }, { attempted: 0, correct: 0 }
  ], 25).valid, false);
});
