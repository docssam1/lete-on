"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const course = require("../curriculum/algebra-1-course.js");

test("GFIELD Algebra 1 has an original, standards-scoped five-unit course map", function () {
  assert.equal(course.id, "gfield-algebra-1-v1");
  assert.equal(course.status, "first-original-lesson-published");
  assert.equal(course.units.length, 5);
  assert.ok(course.units.every(function (unit) {
    return unit.title && unit.question && unit.goals.length >= 3 && unit.standards.length
      && unit.lesson && unit.lesson.title && unit.lesson.prompt && unit.lesson.solution && unit.lesson.extension;
  }));
  assert.match(course.scope, /학교별 단원 순서와 깊이는 교사가 조정/);
  assert.equal(course.source.url, "https://www.thecorestandards.org/Math/Content/HSA/");
  assert.match(course.originalContentNotice, /지필드가 새로 작성/);
});

test("the first lesson gives original equation reasoning, verification, and extension", function () {
  const lesson = course.starterLesson;
  assert.equal(lesson.steps.length, 4);
  assert.equal(lesson.steps.at(-1).expression, "x = 3");
  assert.ok(lesson.steps.every(function (step) { return step.expression && step.reason; }));
  assert.match(lesson.prompt, /각 줄에서 등식이 계속 참인 이유/);
  assert.match(lesson.check, /원래 식에 넣으면/);
  assert.match(lesson.extension, /2\(3x \+ 4\) = 5x \+ 17/);
});
