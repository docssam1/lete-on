const test = require("node:test");
const assert = require("node:assert/strict");
const pathways = require("../curriculum/course-pathways.js");

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
    assert.match(course.teacherHref, /^(\.\/catalog\.html\?role=teacher|#high-school-bridge$)/);
    assert.ok(course.focus.length >= 3);
    assert.ok(course.units.length >= 4);
    assert.ok(Array.isArray(course.previousOptions));
    assert.ok(Array.isArray(course.nextOptions));
  });
  const preAlgebra = pathways.courses.find(function (course) { return course.id === "pre-algebra"; });
  assert.equal(preAlgebra.studentHref, "./concept-learning.html");
  assert.match(preAlgebra.availability, /6학년 개념 10개와 단원 워크북 10개 공개/);
  const algebra2 = pathways.courses.find(function (course) { return course.id === "algebra-2"; });
  assert.equal(algebra2.studentHref, "./algebra2-workbook.html");
  assert.equal(algebra2.teacherHref, "./algebra2-workbook.html?edition=teacher");
  assert.equal(algebra2.units.length, 5);
  assert.deepEqual(algebra2.focus, ["Polynomial structure", "Quadratic functions", "Rational expressions & functions", "Exponential & logarithmic models", "Sequences"]);
  assert.match(algebra2.availability, /5단원·18차시·36문항/);
  const algebra1 = pathways.courses.find(function (course) { return course.id === "algebra-1"; });
  assert.deepEqual(algebra1.previousOptions, ["pre-algebra"]);
  assert.deepEqual(algebra1.nextOptions, ["geometry", "algebra-2"]);
  assert.match(algebra1.availability, /지필드 과정 지도와 원본 첫 수업 공개/);
});
