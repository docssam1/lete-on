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
  });
  const preAlgebra = pathways.courses.find(function (course) { return course.id === "pre-algebra"; });
  assert.equal(preAlgebra.studentHref, "./concept-learning.html");
  assert.match(preAlgebra.availability, /Grade 6 개념 10개 공개/);
  const algebra2 = pathways.courses.find(function (course) { return course.id === "algebra-2"; });
  assert.equal(algebra2.studentHref, "#availability");
  assert.equal(algebra2.teacherHref, "#high-school-bridge");
});
