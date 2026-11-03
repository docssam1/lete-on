"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const course = require("../curriculum/algebra-2-course.js");

test("GFIELD Algebra 2 has an original five-unit course with student and teacher-ready lesson data", function () {
  assert.equal(course.id, "algebra-2");
  assert.equal(course.units.length, 5);
  assert.deepEqual(course.units.map(function (unit) { return unit.lessons.length; }), [3, 3, 5, 3, 4]);
  assert.equal(course.units.flatMap(function (unit) { return unit.lessons; }).length, 18);
  assert.equal(course.units.flatMap(function (unit) { return unit.lessons.flatMap(function (lesson) { return lesson.practice; }); }).length, 36);
  assert.ok(course.units.every(function (unit) {
    return unit.title && unit.question && unit.goals.length >= 3 && unit.standards.length
      && unit.lesson.title && unit.lesson.prompt && unit.lesson.solution && unit.lesson.extension
      && unit.lessons.every(function (lesson) {
        return lesson.title && lesson.objective && lesson.idea && lesson.example.prompt && lesson.example.solution
          && lesson.practice.length === 2
          && lesson.practice.every(function (item) { return item.prompt && item.answer && item.feedback; });
      });
  }));
  assert.match(course.scope, /지필드가 새로 작성/);
  assert.match(course.scope, /복소수와 행렬은.*선택 확장/);
  assert.match(course.scope, /학교 Geometry.*대신하지 않습니다/);
  assert.deepEqual(course.sources, [
    "https://www.thecorestandards.org/Math/Content/HSA/",
    "https://www.thecorestandards.org/Math/Content/HSF/",
    "https://www.thecorestandards.org/Math/Content/HSN/CN/",
    "https://www.thecorestandards.org/Math/Content/HSN/VM/"
  ]);
  assert.equal(Object.isFrozen(course), true);
  assert.ok(course.units.every(function (unit) { return Object.isFrozen(unit.lessons); }));
});

test("representative rational-expression, quadratic, sequence, and extension answers agree with their worked methods", function () {
  const unit = Object.fromEntries(course.units.map(function (entry) { return [entry.id, entry]; }));
  assert.equal(unit["polynomial-structure"].lessons[1].practice[0].answer, "x² − 2x − 24");
  assert.equal(unit["quadratic-functions"].lessons[1].practice[1].answer, "x = −1 ± 2√2");
  assert.equal(unit["rational-expressions"].lessons[3].practice[1].answer, "2x + 1 + 5/(x + 3), 단 x ≠ −3");
  assert.equal(unit["sequences-complex-extensions"].lessons[3].practice[1].answer, "75/8");
  assert.match(unit["sequences-complex-extensions"].lessons[2].idea, /선택 확장/);
  assert.match(unit["sequences-complex-extensions"].lessons[3].practice[1].feedback, /5\/8/);
});
