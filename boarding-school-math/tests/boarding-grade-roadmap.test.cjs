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
  assert.match(roadmap.getTracks(3)[0][1], /Spectrum Math.*Math Mammoth.*하루 5문제.*맞은 문제/);
  assert.match(roadmap.getTracks(4)[0][1], /Spectrum Word Problems.*Singapore Math Primary Mathematics.*계산 전에 표/);
  assert.match(roadmap.getTracks(5)[0][1], /Math Mammoth.*IXL.*점수보다 풀이 이유/);
  assert.match(roadmap.getTracks(6)[0][1], /Singapore Math Primary Mathematics.*Spectrum Test Prep.*새 진도보다 이미 배운 단원/);
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
  const elementaryPlanTitles = {
    3: ["기본 연산 살펴보기", "문장제 읽기 습관", "그림과 식으로 나타내기", "섞어 풀고 설명하기"],
    4: ["표와 그래프에서 조건 찾기", "개념을 그림으로 보기", "표부터 설명하고 계산하기", "표·그림·문장제 복습"],
    5: ["분수·소수 개념 확인", "문장제 조건 나타내기", "필요한 단원 보완", "문장제 복습과 설명"]
  };
  [3, 4, 5].forEach(function (grade) {
    const plan = roadmap.getAnnualPlan(grade);
    assert.equal(plan.source, "inferred");
    assert.equal(plan.periods.length, 4);
    assert.ok(plan.periods.every(function (period) { return period[0].includes("추정") && period.slice(1).every(Boolean); }));
    assert.deepEqual(plan.periods.map(function (period) { return period[1]; }), elementaryPlanTitles[grade]);
    assert.match(plan.note, /제공된 초등 로드맵.*12개월 구간.*계획 예시/);
  });
  const suppliedStageTitles = {
    6: ["Pre-Algebra 개념 익히기", "AMC 8 유형과 논리", "SAT 기초 유형 맛보기", "복습과 실전 연습"],
    7: ["Algebra 1 개념과 풀이", "기하 기초와 AMC 입문", "대수 강화와 SAT 유형", "누적 복습과 모의 연습"],
    8: ["대수 개념과 문제 해결", "기하 심화와 AMC 10/12", "AIME형 문제와 SAT 심화", "실전 연습과 풀이 복습"],
    10: ["Pre-Calculus와 AMC 12 준비", "AIME형 정수론·조합", "SAT Math 점검", "증명과 다음 단계"]
  };
  [6, 7, 8, 10].forEach(function (grade) {
    const plan = roadmap.getAnnualPlan(grade);
    assert.equal(plan.source, "provided");
    assert.equal(plan.periods.length, 4);
    assert.deepEqual(plan.periods.map(function (period) { return period[0].split(" · ")[0]; }), ["1–3개월", "4–6개월", "7–9개월", "10–12개월"]);
    assert.deepEqual(plan.periods.map(function (period) { return period[1]; }), suppliedStageTitles[grade]);
    assert.ok(plan.periods.every(function (period) { return period.slice(1).every(Boolean); }));
  });
  assert.equal(roadmap.getAnnualPlan(9).source, "inferred");
  assert.match(roadmap.getAnnualPlan(6).title, /^선택 심화/);
  assert.match(roadmap.getAnnualPlan(6).note, /학교 수학에서 이미 배운 단원.*별도의 선택 심화/);
  assert.match(roadmap.getAnnualPlan(6).periods[0][2], /변수식, 거듭제곱·연산 순서/);
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
});

test("concept-flow examples connect supplied routes without learner placement", function () {
  assert.equal(roadmap.conceptFlows.length, 5);
  assert.deepEqual(roadmap.conceptFlows.map(function (flow) { return flow.steps.length; }), [6, 5, 5, 5, 5]);
  const flows = Object.fromEntries(roadmap.conceptFlows.map(function (flow) { return [flow.id, flow]; }));
  assert.match(flows["arithmetic-algebra"].steps.join(" → "), /곱셈 구조.*분배법칙.*다항식 전개.*식 정리.*AMC 10/);
  assert.match(flows["ratio-coordinate"].steps.join(" → "), /비·비율.*단위 변환.*비례식.*일차 함수.*좌표기하/);
  assert.match(flows["parity-counting"].steps.join(" → "), /짝·홀수.*조건별.*경우의 수.*조합.*AIME/);
  assert.match(flows["sequence-number-theory"].steps.join(" → "), /수열.*닫힌식.*나머지.*합동식.*AIME/);
  assert.equal(flows["prealgebra-algebra1"].optional, true);
  assert.match(flows["prealgebra-algebra1"].title, /선택형/);
  assert.match(flows["prealgebra-algebra1"].steps.join(" → "), /변수와 식.*말을 식으로 나타내기.*대입·거듭제곱·연산 순서.*연산 성질.*분배법칙.*동류항 정리/);
  assert.match(flows["prealgebra-algebra1"].note, /Pre-Algebra와 Algebra 1.*진단 결과가 아니에요/);
  assert.equal(Object.isFrozen(roadmap.conceptFlows), true);
  assert.equal(Object.isFrozen(roadmap.conceptFlows[0].steps), true);
});

test("Grade 7 route names checkpoints and identifies its public workbooks", function () {
  assert.deepEqual(roadmap.grade7Stops.map(function (stop) { return stop.id; }), ["nsa", "rpa", "ee", "geometry"]);
  assert.deepEqual(roadmap.getGrade(7).steps.map(function (step) { return step[0]; }), roadmap.grade7Stops.map(function (stop) { return stop.title; }));
  assert.equal(roadmap.grade7Stops[0].resourceState, "public");
  assert.equal(roadmap.grade7Stops[1].resourceState, "public");
  assert.ok(roadmap.grade7Stops.every(function (stop) { return Boolean(stop.check || (stop.checks && stop.checks.length)); }));
  assert.equal(roadmap.grade7Stops[0].checks.length, 4);
  assert.ok(roadmap.grade7Stops.slice(2).every(function (stop) { return !stop.clusterId; }));
  assert.deepEqual(roadmap.grade7Stops.slice(2).map(function (stop) { return stop.resources.length; }), [4, 3]);
  assert.ok(roadmap.grade7Stops.slice(2).flatMap(function (stop) { return stop.resources; }).every(function (resource) { return resource.url.startsWith("https://math7.flippedmath.com/") && resource.title; }));
  assert.ok(roadmap.grade7Stops.slice(2).every(function (stop) { return Object.isFrozen(stop.resources) && stop.resources.every(Object.isFrozen); }));
});

test("upper-grade course references are limited to named courses and keep Grade 9 inferred", function () {
  assert.deepEqual(Object.keys(roadmap.courseStageResources), ["8", "9", "10"]);
  assert.equal(roadmap.courseStageResources[8][0][0].url, "https://geometry.flippedmath.com/");
  assert.match(roadmap.courseStageResources[8][2][0].title, /Algebra 2.*제작 중/);
  assert.match(roadmap.courseStageResources[9].note, /추정 경로.*학교의 실제 과목/);
  assert.equal(roadmap.courseStageResources[9][0][0].url, "https://algebra2.flippedmath.com/");
  assert.equal(roadmap.courseStageResources[9][1][0].url, "https://geometry.flippedmath.com/");
  assert.equal(roadmap.courseStageResources[10][0][0].url, "https://precalculus.flippedmath.com/precalc-traditional.html");
});

test("competition options follow grade and keep advanced AMC paths optional", function () {
  assert.deepEqual(roadmap.competitionOptions(3).map(function (entry) { return entry.id; }), ["sasmo", "kangaroo"]);
  [
    [5, "grades-5-6"], [6, "grades-5-6"], [7, "grades-7-8"], [8, "grades-7-8"],
    [9, "grades-9-10"], [10, "grades-9-10"], [11, "grades-11-12"], [12, "grades-11-12"]
  ].forEach(function ([grade, bandId]) {
    assert.equal(roadmap.competitionOptions(grade).find(function (entry) { return entry.id === "kangaroo"; }).paperBandId, bandId);
  });
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

test("AMC 8 manual summaries separate official data interpretation and number-proportional scope", function () {
  assert.deepEqual(roadmap.competitionDomains("amc8").map(function (domain) { return domain.title; }), ["식·대수", "수·비례·추정", "기하·공간", "경우의 수·확률", "그래프·표 해석"]);
  assert.equal(roadmap.competitionDomains("amc10").length, 4);
  assert.equal(roadmap.analyzeCompetition(Array(4).fill({ attempted: 0, correct: 0 }), 25, "amc8").valid, false);
  const result = roadmap.analyzeCompetition(Array(5).fill({ attempted: 1, correct: 1 }), 25, "amc8");
  assert.equal(result.valid, true);
  assert.equal(result.rows[4].title, "그래프·표 해석");
  assert.equal("level" in result, false);
});
