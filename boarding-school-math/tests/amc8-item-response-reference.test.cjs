const assert = require("node:assert/strict");
const reference = require("../competition/amc8-item-response-reference.js");

for (const year of [2009, 2010, 2011]) assert.equal(reference.questionsByYear[year].length, 25);
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
