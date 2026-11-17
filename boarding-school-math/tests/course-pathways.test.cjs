const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const pathways = require("../curriculum/course-pathways.js");
const algebra1Course = require("../curriculum/algebra-1-course.js");

test("course pathway exposes the complete school-configured progression", function () {
  assert.equal(pathways.sequenceState, "school-configured");
  assert.match(pathways.sequenceNotice, /학교/);
  assert.deepEqual(pathways.courses.map(function (course) { return course.id; }), [
    "elementary-foundations", "pre-algebra", "algebra-1", "geometry", "algebra-2", "precalculus"
  ]);
});

test("each course keeps prerequisites, student and teacher paths, and availability explicit", function () {
  pathways.courses.forEach(function (course) {
    assert.ok(course.prerequisites);
    assert.ok(course.next);
    assert.ok(course.availability);
    assert.match(course.studentHref, /^(\.\/|#availability$)/);
    assert.match(course.teacherHref, /^(\.\/|#high-school-bridge$)/);
    assert.ok(course.focus.length >= 3);
    assert.ok(course.units.length >= 4);
    assert.ok(Array.isArray(course.previousOptions));
    assert.ok(Array.isArray(course.nextOptions));
  });
  const preAlgebra = pathways.courses.find(function (course) { return course.id === "pre-algebra"; });
  assert.equal(preAlgebra.studentHref, "./prealgebra-path.html");
  assert.equal(preAlgebra.teacherHref, "./prealgebra-workbook.html?edition=teacher");
  assert.match(preAlgebra.availability, /Pre-Algebra 4단원·27차시·54문항 공개 · 개념 수업 10개·검수 워크북 8종 연결/);
  const algebra2 = pathways.courses.find(function (course) { return course.id === "algebra-2"; });
  assert.equal(algebra2.studentHref, "./algebra2-workbook.html");
  assert.equal(algebra2.teacherHref, "./algebra2-workbook.html?edition=teacher");
  assert.equal(algebra2.units.length, 5);
  assert.deepEqual(algebra2.focus, ["Polynomial structure", "Quadratic functions", "Rational expressions & functions", "Exponential & logarithmic models", "Sequences"]);
  assert.match(algebra2.availability, /5단원·18차시·36문항/);
  const geometry = pathways.courses.find(function (course) { return course.id === "geometry"; });
  assert.equal(geometry.studentHref, "./geometry-workbook.html");
  assert.equal(geometry.teacherHref, "./geometry-workbook.html?edition=teacher");
  assert.equal(geometry.units.length, 5);
  assert.match(geometry.availability, /5단원·16차시·32문항/);
  const precalculus = pathways.courses.find(function (course) { return course.id === "precalculus"; });
  assert.equal(precalculus.studentHref, "./precalculus-workbook.html");
  assert.equal(precalculus.teacherHref, "./precalculus-workbook.html?edition=teacher");
  assert.equal(precalculus.units.length, 5);
  assert.match(precalculus.availability, /5단원·16차시·32문항.*극좌표는 선택 심화/);
  const algebra1 = pathways.courses.find(function (course) { return course.id === "algebra-1"; });
  assert.deepEqual(algebra1.previousOptions, ["pre-algebra"]);
  assert.deepEqual(algebra1.nextOptions, ["geometry", "algebra-2"]);
  assert.equal(algebra1.studentHref, "./algebra1-workbook.html");
  assert.equal(algebra1.teacherHref, "./algebra1-workbook.html?edition=teacher");
  assert.match(algebra1.availability, /5단원·32차시·64문항 공개/);
});

test("every course comparison card points to existing GFIELD student and teacher material", function () {
  pathways.courses.forEach(function (course) {
    [course.studentHref, course.teacherHref].forEach(function (href) {
      const file = href.split(/[?#]/, 1)[0];
      assert.ok(fs.existsSync(path.resolve(__dirname, "..", file)), course.id + " material is missing: " + href);
    });
  });
  const algebra1Lessons = algebra1Course.units.flatMap(function (unit) { return unit.lessons; });
  assert.equal(algebra1Course.units.length, 5);
  assert.equal(algebra1Lessons.length, 32);
  assert.equal(algebra1Lessons.reduce(function (sum, lesson) { return sum + lesson.practice.length; }, 0), 64);
});
