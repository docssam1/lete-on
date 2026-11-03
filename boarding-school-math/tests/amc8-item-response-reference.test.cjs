const assert = require("node:assert/strict");
const reference = require("../competition/amc8-item-response-reference.js");

for (const year of [2009, 2010, 2011]) assert.equal(reference.questionsByYear[year].length, 25);
for (const grade of [7, 8]) {
  for (let question = 1; question <= 25; question++) {
    const row = reference.responseFor(2013, question, "", grade);
    assert.ok(row, `2013 grade ${grade} question ${question} should have a matching school-cohort reference`);
    assert.equal(row.respondentCount, grade === 7 ? 63 : 55);
    const total = Object.values(row.responsePercent).reduce((sum, value) => sum + value, row.omittedPercent + row.unreadablePercent);
    assert.ok(Math.abs(total - 100) < 0.15, `2013 grade ${grade} question ${question} sums to ${total}`);
  }
}
assert.equal(reference.responseFor(2013, 1, "", 7).correctAnswer, "A");
assert.equal(reference.responseFor(2013, 25, "", 8).correctAnswer, "A");
assert.equal(reference.responseFor(2013, 8, "B", 7).correctResponsePercent, 30.16);
assert.equal(reference.responseFor(2013, 8, "B", 7).selectedResponsePercent, 20.63);
assert.equal(reference.responseFor(2013, 8, "", 7).population, "2013 AMC 8 Mathematics Ed Clinic reported Grade 7 school cohort");
assert.equal(reference.responseFor(2013, 8, "", 6), null);
assert.equal(reference.responseFor(2013, 8, "", 9), null);
assert.equal(reference.responseFor(2013, 8, "", undefined), null);
const official2013Key = ["A", "D", "E", "C", "E", "C", "C", "C", "C", "C", "D", "B", "A", "C", "B", "E", "B", "B", "D", "C", "E", "E", "B", "C", "A"];
for (const grade of [7, 8]) for (let question = 1; question <= 25; question++) {
  assert.equal(reference.responseFor(2013, question, "", grade).correctAnswer, official2013Key[question - 1]);
}
const official2015Key = ["A", "D", "D", "E", "A", "B", "E", "D", "D", "B", "B", "C", "D", "D", "D", "B", "D", "B", "A", "D", "C", "C", "D", "B", "C"];
for (let question = 1; question <= 25; question++) {
  const row = reference.responseFor(2015, question, "", 7);
  assert.ok(row, `2015 grade 7 question ${question} should have a matching school-cohort reference`);
  assert.equal(row.respondentCount, 10);
  assert.equal(row.correctAnswer, official2015Key[question - 1]);
  const total = Object.values(row.responsePercent).reduce((sum, value) => sum + value, row.omittedPercent + row.unreadablePercent);
  assert.ok(Math.abs(total - 100) < 0.15, `2015 grade 7 question ${question} sums to ${total}`);
}
assert.equal(reference.responseFor(2015, 8, "C", 7).correctResponsePercent, 60);
assert.equal(reference.responseFor(2015, 8, "C", 7).selectedResponsePercent, 30);
assert.equal(reference.responseFor(2015, 8, "", 6), null);
assert.equal(reference.responseFor(2015, 8, "", 8), null);
assert.equal(reference.responseFor(2008, 3, "B"), null);
assert.equal(reference.responseFor(2010, 26, "B"), null);
assert.equal(reference.responseFor(2010, 3, "B").correctAnswer, "C");
assert.equal(reference.responseFor(2010, 3, "B").selectedResponsePercent, 20.97);
assert.equal(reference.responseFor(2010, 3, "B").correctResponsePercent, 64.41);
assert.deepEqual(reference.responseFor(2010, 3, "").mostCommonDistractor, { answer: "B", percent: 20.97 });
assert.equal(reference.responseFor(2010, 25, "E").correctResponsePercent, 18.41);
assert.equal(reference.responseFor(2009, 3, "A").correctAnswer, "C");
assert.equal(reference.responseFor(2009, 3, "A").respondentCount, 741);
assert.deepEqual(reference.responseFor(2009, 12, "A").acceptedAnswers, ["D", "E"]);
assert.equal(reference.responseFor(2009, 12, "A").correctResponsePercent, 65.18);
assert.equal(reference.responseFor(2009, 12, "").mostCommonDistractor.answer, "B");
assert.equal(reference.responseFor(2011, 4, "A").correctAnswer, "C");
assert.equal(reference.responseFor(2011, 4, "A").respondentCount, 899);
assert.equal(reference.responseFor(2011, 4, "A").correctResponsePercent, 59.96);
for (const year of [2009, 2010, 2011]) {
  for (const item of reference.questionsByYear[year]) {
    const total = Object.values(item.responsePercent).reduce((sum, value) => sum + value, item.omittedPercent + item.unreadablePercent);
    assert.ok(Math.abs(total - 100) < 0.15, `${year} question ${item.number} response percentages sum to ${total}`);
    assert.ok(item.acceptedAnswers.every((answer) => Object.hasOwn(item.responsePercent, answer)));
    const expected = item.acceptedAnswers.reduce((sum, answer) => sum + item.responsePercent[answer], 0);
    assert.equal(item.correctResponsePercent, Number(expected.toFixed(2)));
  }
}
