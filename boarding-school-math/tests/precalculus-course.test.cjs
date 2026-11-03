"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const course = require("../curriculum/precalculus-course.js");

test("GFIELD Precalculus has a standards-scoped original progression with A4-ready lessons", function () {
  assert.equal(course.id, "precalculus");
  assert.equal(course.units.length, 5);
  assert.deepEqual(course.units.map(function (unit) { return unit.lessons.length; }), [3, 3, 3, 3, 4]);
  const lessons = course.units.flatMap(function (unit) { return unit.lessons; });
  assert.equal(lessons.length, 16);
  assert.equal(lessons.flatMap(function (lesson) { return lesson.practice; }).length, 32);
  assert.ok(course.units.every(function (unit) {
    return unit.question && unit.goals.length >= 3 && unit.standards.length
      && unit.lessons.every(function (lesson) {
        return lesson.title && lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
          && lesson.practice.length === 2
          && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
      });
  }));
  assert.match(course.scope, /지필드가 새로 작성/);
  assert.match(course.scope, /학교의 선수 조건·과목 배정·수업 순서를 대신하지 않습니다/);
  assert.match(course.scope, /극한과 미적분은 이 교재에서 다루지 않습니다/);
  assert.match(course.scope, /극좌표 표현은 선택 심화/);
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSF/TF/"));
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSA/"));
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSN/VM/"));
  assert.ok(course.units.every(function (unit) { return Object.isFrozen(unit.lessons); }));
});

test("representative Precalculus calculations match the displayed questions", function () {
  const units = Object.fromEntries(course.units.map(function (unit) { return [unit.id, unit]; }));
  assert.equal(units["functions-transformations"].lessons[0].example.solution.includes("정의역은 x≥2"), true);
  assert.equal(units["polynomial-rational-analysis"].lessons[1].example.solution.includes("구멍은 (2,4)"), true);
  assert.equal(units["exponential-logarithmic-sequences"].lessons[1].practice[0].answer, "t=log₅40≈2.29");
  assert.equal(units["trigonometry-unit-circle"].lessons[0].practice[0].answer, "5π/4");
  assert.equal(units["trigonometry-unit-circle"].lessons[1].example.solution.includes("cos θ=−√3/2"), true);
  assert.equal(units["vectors-complex-modeling"].lessons[0].practice[0].answer, "(6,5)");
  assert.equal(units["vectors-complex-modeling"].lessons[1].example.solution.includes("θ=π\/3"), true);
  const polar = units["vectors-complex-modeling"].lessons[2];
  assert.match(polar.title, /선택 심화/);
  assert.equal(polar.example.solution.includes("(0,−2)"), true);
  assert.equal(polar.practice[0].answer, "(2, 2√3)");
  assert.equal(polar.practice[0].feedback.includes("4×1/2"), true);
});
