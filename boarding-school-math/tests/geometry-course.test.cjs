"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const course = require("../curriculum/geometry-course.js");

test("GFIELD Geometry has a standards-scoped original progression with A4-ready lessons", function () {
  assert.equal(course.id, "geometry");
  assert.equal(course.units.length, 5);
  assert.deepEqual(course.units.map(function (unit) { return unit.lessons.length; }), [4, 3, 3, 3, 3]);
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
  assert.match(course.scope, /학교의 과목 배정과 연간 순서를 대신하지 않으며/);
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSG/CO/"));
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSG/SRT/"));
  assert.ok(course.sources.includes("https://www.thecorestandards.org/Math/Content/HSG/C/"));
  assert.ok(course.units.every(function (unit) { return Object.isFrozen(unit.lessons); }));
});

test("representative geometry answers are consistent with the stated relationships", function () {
  const units = Object.fromEntries(course.units.map(function (unit) { return [unit.id, unit]; }));
  assert.equal(units["transformations-congruence"].lessons[0].practice[0].answer, "(3, 2)");
  assert.equal(units["transformations-congruence"].lessons[3].practice[0].answer, "5cm보다 크게");
  assert.equal(units["similarity-right-triangles"].lessons[0].practice[1].answer, "147cm²");
  assert.equal(units["similarity-right-triangles"].lessons[1].practice[1].answer, "2√13cm");
  assert.equal(units["circles"].lessons[2].practice[1].answer, "9π/2 cm²");
  assert.equal(units["coordinate-geometry"].lessons[1].example.solution.includes("원 위에 있어요"), true);
  assert.equal(units["coordinate-geometry"].lessons[0].practice[1].answer, "(0, 0)");
  assert.equal(units["measurement-modeling"].lessons[1].example.solution.includes("90πcm³"), true);
  assert.equal(units["measurement-modeling"].lessons[2].practice[1].answer, "15kg/m³");
});
