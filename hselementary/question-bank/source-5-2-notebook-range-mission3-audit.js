"use strict";
const assert = require("node:assert/strict");
const mission = require("./source-5-2-notebook-range-mission3.js");

function enumerate(ceilingTarget, notebooksPerStudent, totalNotebooks) {
  const values = [];
  const students = [];
  for (let n = 1; n <= 1000; n += 1) {
    if (Math.ceil(n / 10) * 10 !== ceilingTarget) continue;
    const remainder = totalNotebooks - notebooksPerStudent * n;
    if (remainder >= 0) { students.push(n); values.push(remainder); }
  }
  return { students, values };
}

const source = enumerate(50, 3, 160);
assert.deepEqual(source.students, Array.from({ length: 10 }, (_, index) => 41 + index));
assert.deepEqual(source.values, [37, 34, 31, 28, 25, 22, 19, 16, 13, 10]);
assert.equal(Math.min(...source.values), 10);
assert.equal(Math.max(...source.values), 37);
const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) {
  for (const difficultyOffset of [-1, 0, 1]) {
    const question = mission.getQuestion(variant, difficultyOffset);
    assert.ok(question, `configuration ${variant}/${difficultyOffset} exists`);
    const { ceilingTarget, notebooksPerStudent, totalNotebooks, studentRange, remainderRange, possibleRemainders } = question.questionModel;
    const exhaustive = enumerate(ceilingTarget, notebooksPerStudent, totalNotebooks);
    assert.deepEqual(exhaustive.students, Array.from({ length: 10 }, (_, index) => studentRange[0] + index));
    assert.deepEqual(exhaustive.values, possibleRemainders);
    assert.deepEqual(remainderRange, [Math.min(...exhaustive.values), Math.max(...exhaustive.values)]);
    assert.equal(question.answer, `${remainderRange[0].toLocaleString("ko-KR")}권 이상 ${remainderRange[1].toLocaleString("ko-KR")}권 이하`);
    assert.notEqual(ceilingTarget, 50);
    assert.notEqual(totalNotebooks, 160);
    assert.equal(notebooksPerStudent, 3, "Preserve three notebooks per student");
    assert.equal(new Set(exhaustive.values).size, 10);
    observations.push({ variant, difficultyOffset, ceilingTarget, totalNotebooks, studentRange, possibleRemainders: exhaustive.values, remainderRange, answer: question.answer });
  }
}

console.log(JSON.stringify({ status: "passed", sourceStudentRange: [source.students[0], source.students.at(-1)], sourceRemainders: source.values, sourceAnswer: "10권 이상 37권 이하", syntheticConfigurations: observations.length, observations }, null, 2));
