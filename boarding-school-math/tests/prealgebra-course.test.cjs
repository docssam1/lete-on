"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const course = require("../curriculum/prealgebra-course.js");

test("GFIELD Pre-Algebra Unit 1 follows the six requested expression concepts in curriculum language", function () {
  assert.equal(course.id, "pre-algebra");
  assert.equal(course.units.length, 1);
  const unit = course.units[0];
  assert.equal(unit.id, "expressions-and-equivalence");
  assert.deepEqual(unit.standards, ["6.EE.A.1", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4"]);
  assert.deepEqual(unit.lessons.map(function (lesson) { return lesson.title; }), [
    "변수식으로 나타내고 식의 값 구하기",
    "거듭제곱과 연산 순서 적용하기",
    "문장을 변수식으로 번역하기",
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
    "https://www.thecorestandards.org/Math/Content/7/EE/"
  ]);
});

test("fraction examples use plain source notation for the shared stacked-fraction renderer", function () {
  const text = JSON.stringify(course.units);
  assert.match(text, /3\/2/);
  assert.match(text, /9\/4/);
  assert.match(text, /3\/4/);
});
