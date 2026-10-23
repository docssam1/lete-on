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
