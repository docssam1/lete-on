"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const reference = require("../competition/aime-historical-grade-distribution-reference.js");

test("2010 AIME I and II transcribed grade distributions reconcile with report totals", function () {
  const expected = { I: [3618, 2, 59, 136, 284, 504, 1302, 1326, 5], II: [2904, 132, 29, 121, 200, 644, 1019, 754, 5] };
  for (const form of ["I", "II"]) {
    const byGrade = reference.gradeColumns.map((grade, column) => reference.scoreRows[form].reduce((sum, row) => sum + row[column], 0));
    assert.deepEqual(byGrade, expected[form].slice(1));
    assert.equal(byGrade.reduce((sum, count) => sum + count, 0), expected[form][0]);
    for (const row of reference.scoreRows[form]) assert.equal(row.length, reference.gradeColumns.length);
  }
});

test("historical AIME grade lookup reports strict lower-score share and ties separately", function () {
  const grade8 = reference.referenceFor(2010, "I", 8, 8);
  assert.deepEqual({ participants: grade8.participants, studentsAtScore: grade8.studentsAtScore, studentsBelowScore: grade8.studentsBelowScore }, { participants: 136, studentsAtScore: 15, studentsBelowScore: 104 });
  assert.equal(grade8.lowerScorePercent, 104 / 136 * 100);
  assert.equal(reference.referenceFor(2010, "II", 12, 0).lowerScorePercent, 0);
  assert.equal(reference.referenceFor(2010, "II", 12, 15).studentsBelowScore, 754);
});

test("AIME history does not fabricate exact results for a different year or grouped grade", function () {
  assert.equal(reference.referenceFor(2009, "I", 8, 8), null);
  assert.equal(reference.referenceFor(2010, "I", 7, 8), null);
  assert.equal(reference.referenceFor(2010, "I", 8, 16), null);
});
