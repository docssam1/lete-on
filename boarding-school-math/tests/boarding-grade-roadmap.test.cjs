"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const roadmap = require("../learning/boarding-grade-roadmap.js");

test("grade roadmap covers the Grade 3–12 map and labels inferred high-school bridges", function () {
  assert.deepEqual(roadmap.grades.map(function (entry) { return entry.grade; }), [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  [9, 11, 12].forEach(function (grade) { assert.equal(roadmap.getGrade(grade).source, "inferred"); });
  assert.equal(roadmap.getGrade(7).source, "provided");
  [7, 8, 10].forEach(function (grade) { assert.match(roadmap.getGrade(grade).pathNote, /가속 학습 예시.*학교 학년 기준 아님/); });
  roadmap.grades.forEach(function (entry) { assert.equal(entry.steps.length, 4); });
});

test("school, competition, and SAT stay separate in upper-grade examples", function () {
  assert.deepEqual(roadmap.getTracks(3).map((track) => track[0]), ["학교 수학", "문제 해결", "경시 · 선택"]);
  assert.match(roadmap.getTracks(3)[2][1], /별도 경시 과정이 제시되지 않았어요/);
  assert.deepEqual(roadmap.getTracks(7).map((track) => track[0]), ["학교 수학", "경시 · 선택", "SAT · 맛보기"]);
  assert.match(roadmap.getTracks(9)[0][0], /추정/);
  assert.match(roadmap.getTracks(10)[2][1], /응시할 때/);
  [11, 12].forEach(function (grade) {
    assert.match(roadmap.getTracks(grade)[0][0], /추정/);
    assert.match(roadmap.getTracks(grade)[0][1], /확인|목표/);
    assert.match(roadmap.getTracks(grade)[1][1], /참가 자격 확인/);
  });
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
  [11, 12].forEach(function (grade) {
    const plan = roadmap.getAnnualPlan(grade);
    assert.equal(plan.source, "inferred");
    assert.equal(plan.periods.length, 4);
    assert.ok(plan.periods.every(function (period) { return period[0].includes("추정") && period.slice(1).every(Boolean); }));
    assert.match(plan.note, /학교|과목/);
  });
  [6, 7, 8, 10].forEach(function (grade) { assert.doesNotMatch(roadmap.getAnnualPlan(grade).note, /사용자|제공된 계획/); });
  [3, 4, 5].forEach(function (grade) { assert.equal(roadmap.getAnnualPlan(grade), null); });
});

test("concept-flow examples connect the four user-supplied routes without learner placement", function () {
  assert.equal(roadmap.conceptFlows.length, 4);
  assert.deepEqual(roadmap.conceptFlows.map(function (flow) { return flow.steps.length; }), [5, 5, 5, 5]);
  assert.match(roadmap.conceptFlows[0].steps.join(" → "), /곱셈 구조.*분배법칙.*다항식 전개.*식 정리.*AMC 10/);
  assert.match(roadmap.conceptFlows[1].steps.join(" → "), /비·비율.*단위 변환.*비례식.*일차 함수.*좌표기하/);
  assert.match(roadmap.conceptFlows[2].steps.join(" → "), /짝·홀수.*조건별.*경우의 수.*조합.*AIME/);
  assert.match(roadmap.conceptFlows[3].steps.join(" → "), /수열.*닫힌식.*나머지.*합동식.*AIME/);
  assert.equal(Object.isFrozen(roadmap.conceptFlows), true);
  assert.equal(Object.isFrozen(roadmap.conceptFlows[0].steps), true);
});

test("Grade 7 route names checkpoints and only links available workbook previews", function () {
  assert.deepEqual(roadmap.grade7Stops.map(function (stop) { return stop.id; }), ["nsa", "rpa", "ee", "geometry"]);
  assert.deepEqual(roadmap.getGrade(7).steps.map(function (step) { return step[0]; }), roadmap.grade7Stops.map(function (stop) { return stop.title; }));
  assert.equal(roadmap.grade7Stops[0].resourceState, "review-preview");
  assert.equal(roadmap.grade7Stops[1].resourceState, "public");
  assert.ok(roadmap.grade7Stops.every(function (stop) { return Boolean(stop.check || (stop.checks && stop.checks.length)); }));
  assert.equal(roadmap.grade7Stops[0].checks.length, 4);
  assert.ok(roadmap.grade7Stops.slice(2).every(function (stop) { return !stop.clusterId; }));
});

test("competition options follow grade and keep advanced AMC paths optional", function () {
  assert.deepEqual(roadmap.competitionOptions(3).map(function (entry) { return entry.id; }), ["sasmo", "kangaroo"]);
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc8"; }));
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc10" && entry.optional === true; }));
  assert.ok(!roadmap.competitionOptions(10).some(function (entry) { return entry.id === "amc8"; }));
  [11, 12].forEach(function (grade) {
    const options = roadmap.competitionOptions(grade);
    assert.ok(!options.some(function (entry) { return entry.id === "amc10"; }));
    assert.ok(options.some(function (entry) { return entry.id === "amc12" && entry.optional === true; }));
  });
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
