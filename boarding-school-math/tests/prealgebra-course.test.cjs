"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const course = require("../curriculum/prealgebra-course.js");

test("GFIELD Pre-Algebra Unit 1 follows the six requested expression concepts in curriculum language", function () {
  assert.equal(course.id, "pre-algebra");
  assert.equal(course.title, "GFIELD Pre-Algebra");
  assert.equal(course.shortTitle, "PRE-ALGEBRA");
  assert.equal(course.units.length, 4);
  assert.match(course.scope, /네 단원/);
  const unit = course.units[0];
  assert.equal(unit.id, "expressions-and-equivalence");
  assert.deepEqual(unit.standards, ["6.EE.A.1", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4"]);
  assert.deepEqual(unit.lessons.map(function (lesson) { return lesson.title; }), [
    "변수식으로 나타내고 식의 값 구하기",
    "거듭제곱과 연산 순서 적용하기",
    "문장으로 제시된 상황을 대수식으로 나타내기",
    "연산 성질로 식을 바꾸고 확인하기",
    "분배법칙으로 전개하고 묶기",
    "동류항을 결합해 식을 정리하기"
  ]);
  assert.ok(unit.lessons.every(function (lesson) {
    return lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
      && lesson.practice.length === 2
      && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
  }));
  assert.equal(unit.lessons.length, 6);
  assert.equal(unit.lessons.reduce(function (sum, lesson) { return sum + lesson.practice.length; }, 0), 12);
  assert.match(course.scope, /전체 Pre-Algebra 과정이나 진단·학년 배치를 대신하지 않습니다/);
  assert.deepEqual(course.sources, [
    "https://www.thecorestandards.org/Math/Content/6/EE/",
    "https://www.thecorestandards.org/Math/Content/7/EE/",
    "https://www.thecorestandards.org/Math/Content/7/NS/",
    "https://www.thecorestandards.org/Math/Content/7/RP/"
  ]);
});

test("fraction examples use plain source notation for the shared stacked-fraction renderer", function () {
  const text = JSON.stringify(course.units);
  assert.match(text, /3\/2/);
  assert.match(text, /9\/4/);
  assert.match(text, /3\/4/);
});

test("GFIELD Pre-Algebra Unit 2 separates Grade 6 foundations from Grade 7 equation connections", function () {
  assert.equal(course.units.length, 4);
  const unit = course.units[1];
  assert.equal(unit.id, "equations-and-inequalities");
  assert.deepEqual(unit.standards, ["6.EE.B.5", "6.EE.B.6", "6.EE.B.7", "6.EE.B.8", "7.EE.B.4"]);
  assert.deepEqual(unit.lessons.map(function (lesson) { return lesson.title; }), [
    "대입으로 방정식과 부등식의 해 확인하기",
    "덧셈·뺄셈 방정식 풀기",
    "곱셈 방정식 풀기",
    "문제 상황을 방정식으로 나타내기 · 7학년 연결",
    "부등식으로 조건과 범위 나타내기",
    "부등식의 해를 그래프로 나타내고 해석하기 · 7학년 연결"
  ]);
  assert.ok(unit.lessons.every(function (lesson) {
    return lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
      && lesson.practice.length === 2
      && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
  }));
  assert.equal(unit.lessons.length, 6);
  assert.equal(unit.lessons.reduce(function (sum, lesson) { return sum + lesson.practice.length; }, 0), 12);
  assert.match(unit.lessons[3].idea, /7학년 연결 내용/);
  assert.match(unit.lessons[5].title, /7학년 연결/);
  assert.match(unit.lessons[0].practice[0].answer, /해입니다.*2×5\+1=11/);
  assert.match(unit.lessons[2].example.solution, /x=18\/5/);
  assert.match(unit.lessons[3].example.solution, /n=5/);
  assert.match(unit.lessons[4].example.solution, /h>125.*열린 점/);
  assert.match(unit.lessons[5].example.solution, /s≥50\/3.*17건/);
  assert.equal(course.units.reduce(function (sum, item) { return sum + item.lessons.length; }, 0), 27);
  assert.equal(course.units.reduce(function (sum, item) {
    return sum + item.lessons.reduce(function (lessonSum, lesson) { return lessonSum + lesson.practice.length; }, 0);
  }, 0), 54);
});

test("GFIELD Pre-Algebra Unit 3 covers the Grade 7 rational-number operation standards", function () {
  const unit = course.units[2];
  assert.equal(unit.id, "rational-number-operations");
  assert.deepEqual(unit.standards, ["7.NS.A.1", "7.NS.A.2", "7.NS.A.3"]);
  assert.deepEqual(unit.lessons.map(function (lesson) { return lesson.title; }), [
    "반대인 수와 0이 되는 합",
    "수직선에서 유리수의 덧셈",
    "뺄셈을 반대 수의 덧셈으로 바꾸기",
    "덧셈·뺄셈의 성질로 유리수 계산하기",
    "유리수의 곱셈과 부호",
    "0으로 나누지 않고 유리수의 나눗셈 하기",
    "분수를 소수로 나타내고 순환 여부 찾기",
    "유리수 네 연산으로 문장제 해결하기"
  ]);
  assert.ok(unit.lessons.every(function (lesson) {
    return lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
      && lesson.practice.length === 2
      && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
  }));
  assert.equal(unit.lessons.length, 8);
  assert.equal(unit.lessons.reduce(function (sum, lesson) { return sum + lesson.practice.length; }, 0), 16);
  assert.match(unit.lessons[2].example.solution, /−2−5=−2\+\(−5\)=−7/);
  assert.match(unit.lessons[2].practice[1].answer, /거리는 \|−3−\(−8\)\|=5/);
  assert.match(unit.lessons[5].practice[1].answer, /5÷0.*정의되지 않습니다/);
  assert.match(unit.lessons[6].example.prompt, /1\/8.*1\/6/);
  assert.match(unit.lessons[6].example.solution, /1÷8.*0\.125.*1÷6.*0\.1666/);
  assert.match(unit.lessons[7].example.solution, /0\.75달러/);
});

test("GFIELD Pre-Algebra Unit 4 connects ratios, unit rates, proportional relationships, and percent", function () {
  const unit = course.units[3];
  assert.equal(unit.id, "ratio-proportional-relationships");
  assert.deepEqual(unit.standards, ["7.RP.A.1", "7.RP.A.2", "7.RP.A.3"]);
  assert.deepEqual(unit.lessons.map(function (lesson) { return lesson.title; }), [
    "비를 순서와 단위가 있는 곱셈 비교로 나타내기",
    "비례표에서 동치인 비 찾기",
    "단위율로 속도와 가격 비교하기",
    "단위율로 측정 단위 바꾸기",
    "식과 그래프로 비례 관계 설명하기",
    "백분율을 비로 해석해 문장제 해결하기",
    "비례 관계인지 판별하고 상황을 모델링하기"
  ]);
  assert.ok(unit.lessons.every(function (lesson) {
    return lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
      && lesson.practice.length === 2
      && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
  }));
  assert.equal(unit.lessons.length, 7);
  assert.equal(unit.lessons.reduce(function (sum, lesson) { return sum + lesson.practice.length; }, 0), 14);
  assert.match(unit.lesson.solution, /2\.20<2\.50/);
  assert.match(unit.lessons[4].example.solution, /y=3\.5x.*\(0,0\)/);
  assert.match(unit.lessons[5].example.solution, /40×15\/100=6.*34달러/);
  assert.match(unit.lessons[6].practice[1].answer, /C=6\+2n.*비례 관계가 아닙니다/);
});
