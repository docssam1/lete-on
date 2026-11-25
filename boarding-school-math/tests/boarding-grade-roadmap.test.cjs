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
  assert.match(roadmap.getTracks(9)[0][0], /학교 수학/);
  assert.match(roadmap.getTracks(10)[2][1], /Digital SAT Math 800은 개인 도전 목표.*응시 계획/);
  [11, 12].forEach(function (grade) {
    assert.match(roadmap.getTracks(grade)[0][0], /학교 수학/);
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
    assert.ok(plan.periods.every(function (period) { return !period[0].includes("추정") && period.slice(1).every(Boolean); }));
    assert.deepEqual(plan.periods.map(function (period) { return period[1]; }), elementaryPlanTitles[grade]);
    assert.match(plan.note, /제공된 초등 로드맵.*12개월 구간.*계획 예시/);
  });
  const suppliedStageTitles = {
    6: ["Pre-Algebra 개념 익히기", "AMC 8 유형과 논리", "SAT 기초 유형 맛보기", "복습과 실전 연습"],
    7: ["Algebra 1 개념과 풀이", "기하 기초와 AMC 입문", "대수 강화와 SAT 유형", "누적 복습과 모의 연습"],
    8: ["대수 개념과 문제 해결", "기하 심화와 AMC 10/12", "AIME형 문제와 SAT 심화", "실전 연습과 풀이 복습"],
    10: ["Pre-Calculus와 AMC 12 준비", "AIME형 정수론·조합", "SAT Math 점검", "주장을 근거로 설명하기"]
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
  assert.match(roadmap.getAnnualPlan(6).periods[0][2], /문자를 사용한 식, 거듭제곱·연산 순서/);
  assert.match(roadmap.getAnnualPlan(6).periods[0][3], /지필드 개념 학습 10개.*공개 6\.EE\.A 단원 워크북 36문항/);
  assert.doesNotMatch(roadmap.getAnnualPlan(6).periods[0][3], /단원 워크북 10개/);
  assert.match(roadmap.getAnnualPlan(6).periods[1][3], /지필드 AMC 8 유형 연습 10문항.*MAA 공식/);
  assert.doesNotMatch(roadmap.getAnnualPlan(6).periods.flat().join(" "), /AoPS|Beast Academy|PWN the SAT/);
  assert.equal(roadmap.getAnnualPlan(9).periods.length, 4);
  assert.deepEqual(roadmap.getAnnualPlan(9).periods.map(function (period) { return period[0]; }), ["1–3개월", "4–6개월", "7–9개월", "10–12개월"]);
  assert.ok(roadmap.getAnnualPlan(9).periods.every(function (period) { return !period[0].includes("추정") && period.slice(1).every(Boolean); }));
  assert.match(roadmap.getAnnualPlan(9).note, /학교마다 달라요.*수강 과목/);
  [11, 12].forEach(function (grade) {
    const plan = roadmap.getAnnualPlan(grade);
    assert.equal(plan.source, "inferred");
    assert.equal(plan.periods.length, 4);
    assert.ok(plan.periods.every(function (period) { return !period[0].includes("추정") && period.slice(1).every(Boolean); }));
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
  assert.equal(flows["prealgebra-algebra1"].title, "문자와 식의 계산 · 선택 학습");
  assert.deepEqual(flows["prealgebra-algebra1"].steps, [
    "문자를 사용한 식과 식의 값",
    "거듭제곱과 혼합계산",
    "문장을 식으로 나타내기",
    "교환법칙·결합법칙·분배법칙",
    "분배법칙을 이용한 식의 전개",
    "동류항의 정리"
  ]);
  assert.equal(flows["prealgebra-algebra1"].note, "공유된 Prealgebra Unit 1의 개념 흐름을 참고한 예시예요. 학년 배치나 진단 결과가 아니에요.");
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
  assert.deepEqual(roadmap.grade7Stops.slice(2).map(function (stop) { return stop.resources.length; }), [1, 1]);
  assert.deepEqual(roadmap.grade7Stops.slice(2).flatMap(function (stop) { return stop.resources.map(function (resource) { return resource.url; }); }), ["./algebra1-workbook.html", "./geometry-workbook.html"]);
  assert.ok(roadmap.grade7Stops.slice(2).flatMap(function (stop) { return stop.resources; }).every(function (resource) { return /지필드/.test(resource.title); }));
  assert.ok(roadmap.grade7Stops.slice(2).every(function (stop) { return Object.isFrozen(stop.resources) && stop.resources.every(Object.isFrozen); }));
});

test("upper-grade course references cover high-school stages and keep Grade 9 inferred", function () {
  assert.deepEqual(Object.keys(roadmap.courseStageResources), ["8", "9", "10", "11", "12"]);
  assert.deepEqual(Object.keys(roadmap.annualPlanResourceLinks), ["6", "7", "8", "9", "10", "11", "12"]);
  [6, 7, 8, 9, 10, 11, 12].forEach(function (grade) {
    assert.deepEqual(Object.keys(roadmap.annualPlanResourceLinks[grade]), ["0", "1", "2", "3"]);
    Object.values(roadmap.annualPlanResourceLinks[grade]).flat().forEach(function (resource) {
      assert.ok(resource.title);
      assert.ok(resource.url.startsWith("https://") || resource.url.startsWith("./") || resource.url.startsWith("#"));
    });
  });
  assert.deepEqual(roadmap.annualPlanResourceLinks[6][0].map(function (resource) { return resource.url; }), ["./concept-learning.html", "./concept-learning.html?cluster=6.EE.A", "./unit-workbook.html?cluster=6.EE.A&mode=workbook&audience=student&locale=ko&paper=A4"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[6][1].map(function (resource) { return resource.url; }), ["./competition-practice.html?program=amc8", "https://maa.org/student-programs/amc/"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[6][2].map(function (resource) { return resource.url; }), ["./sat-foundation-practice.html?grade=6", "./concept-learning.html?cluster=6.RP.A", "https://satsuite.collegeboard.org/practice/student-question-bank/math"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[6][3].map(function (resource) { return resource.url; }), ["./concept-learning.html", "./competition-practice.html?program=amc8"]);
  assert.equal(roadmap.annualPlanResourceLinks[7][0][0].url, "./algebra1-workbook.html");
  assert.deepEqual(roadmap.annualPlanResourceLinks[7][1].map(function (resource) { return resource.url; }), ["./geometry-workbook.html", "./amc10-practice.html?grade=7", "https://maa.org/student-programs/amc/"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[7][2].map(function (resource) { return resource.url; }), ["./sat-foundation-practice.html?grade=7", "https://www.khanacademy.org/digital-sat", "https://satsuite.collegeboard.org/practice/student-question-bank/math"]);
  assert.equal(roadmap.courseStageResources[8][0][0].url, "./geometry-workbook.html");
  assert.equal(roadmap.annualPlanResourceLinks[8][0][0].url, "./algebra2-workbook.html");
  assert.match(roadmap.annualPlanResourceLinks[8][0][0].title, /지필드 Algebra 2 원본/);
  assert.equal(roadmap.annualPlanResourceLinks[8][1][0].url, "./geometry-workbook.html");
  assert.match(roadmap.annualPlanResourceLinks[8][1][0].title, /지필드 Geometry 원본/);
  assert.deepEqual(roadmap.annualPlanResourceLinks[8][1].map(function (resource) { return resource.url; }), ["./geometry-workbook.html", "./amc10-practice.html?grade=8", "./amc12-practice.html?grade=8", "https://maa.org/student-programs/amc/"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[8][2].map(function (resource) { return resource.url; }), ["./aime-practice.html?grade=8", "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/", "./sat-foundation-practice.html?grade=8", "https://satsuite.collegeboard.org/practice/student-question-bank/math"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[9][0].map(function (resource) { return resource.url; }), ["./algebra2-workbook.html"]);
  assert.match(roadmap.annualPlanResourceLinks[9][0][0].title, /현재 과목일 때 선택/);
  assert.deepEqual(roadmap.annualPlanResourceLinks[9][1].map(function (resource) { return resource.url; }), ["./geometry-workbook.html", "./algebra2-workbook.html"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[9][2].map(function (resource) { return resource.url; }), ["./amc10-practice.html?grade=9", "./amc12-practice.html?grade=9", "./sat-foundation-practice.html?grade=9", "https://satsuite.collegeboard.org/practice/student-question-bank/math"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[9][3].map(function (resource) { return resource.url; }), ["./precalculus-workbook.html"]);
  assert.match(roadmap.annualPlanResourceLinks[9][3][0].title, /선수 조건 확인 후 선택/);
  assert.deepEqual(roadmap.annualPlanResourceLinks[10][1].map(function (resource) { return resource.url; }), ["./aime-practice.html?grade=10", "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/", "https://maa.org/maa-invitational-competitions/"]);
  assert.deepEqual(roadmap.annualPlanResourceLinks[10][2].map(function (resource) { return resource.url; }), ["./sat-foundation-practice.html?grade=10", "./precalculus-workbook.html", "https://www.khanacademy.org/digital-sat", "https://satsuite.collegeboard.org/practice/practice-tests/bluebook", "https://satsuite.collegeboard.org/practice/student-question-bank/math"]);
  assert.match(roadmap.annualPlanResourceLinks[10][2][0].title, /SAT Math 네 영역 기초 복습/);
  assert.deepEqual(roadmap.annualPlanResourceLinks[10][3].map(function (resource) { return resource.url; }), ["./proof-writing-workbook.html", "https://maa.org/maa-invitational-competitions/"]);
  assert.equal(roadmap.annualPlanResourceLinks[10][3][0].title, "지필드 증명 쓰기 워크북 · 자체 8문항");
  assert.equal(roadmap.courseStageResources[8][1][0].url, "./amc10-practice.html?grade=8");
  assert.match(roadmap.courseStageResources[8][2][0].title, /지필드 Algebra 2 원본/);
  assert.equal(roadmap.courseStageResources[8][2][1].url, "./aime-practice.html?grade=8");
  assert.match(roadmap.courseStageResources[8][2][2].title, /MAA 2027 AIME 자격·응시 안내/);
  assert.equal(roadmap.courseStageResources[8][2][2].url, "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/");
  assert.match(roadmap.courseStageResources[8].stageNotes[2], /2027 AIME.*만 13세 이상.*AMC 10 100점.*AMC 12 85점/);
  assert.match(roadmap.courseStageResources[9].note, /학교마다 수강 과목과 순서/);
  assert.equal(roadmap.courseStageResources[9][0][0].url, "./algebra2-workbook.html");
  assert.deepEqual(roadmap.courseStageResources[9][1].map(function (resource) { return resource.url; }), [
    "./geometry-workbook.html", "./algebra2-workbook.html"
  ]);
  assert.deepEqual(roadmap.courseStageResources[9][2].map(function (resource) { return resource.url; }), [
    "./amc10-practice.html?grade=9", "./amc12-practice.html?grade=9", "./sat-foundation-practice.html?grade=9",
    "https://maa.org/student-programs/amc/", "https://satsuite.collegeboard.org/practice/student-question-bank/math"
  ]);
  assert.equal(roadmap.courseStageResources[9][3][0].url, "./precalculus-workbook.html");
  assert.match(roadmap.courseStageResources[9][3][0].title, /선수 조건 확인 후 선택/);
  assert.equal(roadmap.courseStageResources[10][0][0].url, "./precalculus-workbook.html");
  assert.deepEqual(roadmap.courseStageResources[10][1].map(function (source) { return source.url; }), [
    "./aime-practice.html?grade=10",
    "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/",
    "https://maa.org/maa-invitational-competitions/"
  ]);
  assert.deepEqual(roadmap.courseStageResources[8][1].map(function (source) { return source.url; }), [
    "./amc10-practice.html?grade=8", "./amc12-practice.html?grade=8", "https://maa.org/student-programs/amc/"
  ]);
  assert.match(roadmap.courseStageResources[10].stageNotes[2], /2027 AIME.*만 13세 이상.*AMC 10 100점.*AMC 12 85점/);
  assert.equal(roadmap.courseStageResources[10][0][0].title, "지필드 Precalculus 원본 수업·A4 교재");
  assert.deepEqual(roadmap.courseStageResources[10][2].map(function (source) { return source.url; }), [
    "./sat-foundation-practice.html?grade=10",
    "./precalculus-workbook.html",
    "https://www.khanacademy.org/digital-sat",
    "https://satsuite.collegeboard.org/practice/practice-tests/bluebook",
    "https://satsuite.collegeboard.org/practice/student-question-bank/math",
    "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/",
    "https://maa.org/maa-invitational-competitions/"
  ]);
  assert.match(roadmap.courseStageResources[10].stageNotes[2], /미국·캐나다의 2027 AIME.*만 13세 이상.*AMC 10 100점.*AMC 12 85점.*다른 연도·지역/);
});

test("Grade 10 score goals are optional aspirations, with qualification kept separate", function () {
  const plan = roadmap.getAnnualPlan(10);
  const tracks = roadmap.getTracks(10);
  assert.match(plan.note, /AMC 12 130\+와 Digital SAT Math 800은 선택형 도전 목표/);
  assert.match(plan.note, /AIME·USAMO 진출을 예측하거나 보장하지 않아요/);
  assert.match(plan.periods[0][2], /AMC 12 130\+를 개인 도전 목표/);
  assert.match(plan.periods[0][3], /지필드 Precalculus 원본 수업/);
  assert.doesNotMatch(plan.periods[0][3], /AoPS Precalculus|FlippedMath/);
  assert.match(plan.periods[2][2], /Digital SAT Math 800은 선택한 개인 도전 목표/);
  assert.match(plan.periods[3][2], /정수·대수·기하의 주장.*반례와 증명 전략.*USAMO형 증명 문제/);
  assert.match(plan.periods[3][3], /지필드 증명 쓰기 워크북 · 선택한 경시 문제/);
  assert.match(tracks.find(function (track) { return track[0] === "경시 · 선택"; })[1], /AMC 12 130\+.*AIME 응시와 USAMO 선발은 해당 연도 MAA 기준/);
  assert.match(tracks.find(function (track) { return track[0] === "SAT · 선택"; })[1], /Digital SAT Math 800은 개인 도전 목표/);
});

test("Grade 8 advanced algebra stays optional while school Geometry continues", function () {
  const plan = roadmap.getAnnualPlan(8);
  const tracks = roadmap.getTracks(8);
  assert.match(plan.note, /학교 Geometry는 정규 진도에서 이어가고.*준비도에 맞춰 선택 심화/);
  assert.match(plan.periods[0][2], /다항식·이차식·유리식·지수·로그.*복소수·수열·행렬은.*선택/);
  assert.match(plan.periods[1][2], /학교 Geometry.*변환·합동·증명·닮음·삼각비·원·좌표기하/);
  assert.match(tracks.find(function (track) { return track[0] === "학교 수학"; })[1], /Algebra 2는 준비도에 맞춰 선택 심화.*Geometry는 학교 과정에서 이어가요/);
  assert.match(tracks.find(function (track) { return track[0] === "경시 · 선택"; })[1], /AMC 10\/12.*AIME형 풀이/);
});

test("Grade 7 plan keeps Algebra 1 acceleration separate from school Geometry, AMC, and SAT", function () {
  const plan = roadmap.getAnnualPlan(7);
  const tracks = roadmap.getTracks(7);
  assert.match(plan.note, /Algebra 1은 가속 학습 예시.*학교 Geometry는 정규 진도에서 이어가고.*선택 경로/);
  assert.match(plan.note, /학생의 현재 수준이나 배정 과목을 판정하지 않아요/);
  assert.match(plan.periods[0][2], /문자를 사용한 식·일차방정식·부등식.*등식의 성질/);
  assert.match(plan.periods[1][2], /학교 Geometry에서 각·삼각형·닮음·넓이와 부피/);
  assert.match(plan.periods[2][2], /대수·기하.*심화 문장제와 자료 해석.*Digital SAT Math/);
  assert.match(plan.periods[3][2], /AMC·SAT형 문제.*시간 연습.*개념·아이디어·계산/);
  assert.match(tracks[0][1], /Algebra 1은 가속 학습 예시.*Geometry는 학교 정규 진도/);
  assert.match(tracks[2][1], /대수·기하 심화 문장제와 자료 해석/);
});

test("competition options follow grade and keep advanced AMC paths optional", function () {
  assert.deepEqual(roadmap.competitionOptions(3).map(function (entry) { return entry.id; }), ["sasmo", "kangaroo", "amc8"]);
  [
    [5, "grades-5-6"], [6, "grades-5-6"], [7, "grades-7-8"], [8, "grades-7-8"],
    [9, "grades-9-10"], [10, "grades-9-10"], [11, "grades-11-12"], [12, "grades-11-12"]
  ].forEach(function ([grade, bandId]) {
    assert.equal(roadmap.competitionOptions(grade).find(function (entry) { return entry.id === "kangaroo"; }).paperBandId, bandId);
  });
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc8"; }));
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "amc10" && entry.optional === true; }));
  assert.ok(roadmap.competitionOptions(7).some(function (entry) { return entry.id === "aime" && entry.optional === true; }));
  assert.deepEqual(roadmap.competitionOptions(8).find(function (entry) { return entry.id === "aime"; }), { id: "aime", title: "AIME 문항 복습", itemCount: 15, optional: true });
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
  assert.deepEqual(roadmap.competitionDomains("amc8").map(function (domain) { return domain.title; }), ["식·대수", "수·비례·근사", "기하·공간", "경우의 수·확률", "그래프·표 해석"]);
  assert.equal(roadmap.competitionDomains("amc10").length, 4);
  assert.equal(roadmap.analyzeCompetition(Array(4).fill({ attempted: 0, correct: 0 }), 25, "amc8").valid, false);
  const result = roadmap.analyzeCompetition(Array(5).fill({ attempted: 1, correct: 1 }), 25, "amc8");
  assert.equal(result.valid, true);
  assert.equal(result.rows[4].title, "그래프·표 해석");
  assert.equal("level" in result, false);
});
