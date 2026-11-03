const assert = require("node:assert/strict");
const reference = require("../competition/amc8-item-response-reference.js");

assert.equal(reference.questions.length, 25);
assert.equal(reference.responseFor(2009, 3, "B"), null);
assert.equal(reference.responseFor(2010, 26, "B"), null);
assert.equal(reference.responseFor(2010, 3, "B").correctAnswer, "C");
assert.equal(reference.responseFor(2010, 3, "B").selectedResponsePercent, 20.97);
assert.equal(reference.responseFor(2010, 3, "B").correctResponsePercent, 64.41);
assert.deepEqual(reference.responseFor(2010, 3, "").mostCommonDistractor, { answer: "B", percent: 20.97 });
assert.equal(reference.responseFor(2010, 25, "E").correctResponsePercent, 18.41);
for (const item of reference.questions) {
  const total = Object.values(item.responsePercent).reduce((sum, value) => sum + value, item.omittedPercent + item.unreadablePercent);
  assert.ok(Math.abs(total - 100) < 0.12, `question ${item.number} response percentages sum to ${total}`);
  assert.ok(Object.hasOwn(item.responsePercent, item.correctAnswer));
  assert.equal(item.correctResponsePercent, item.responsePercent[item.correctAnswer]);
}
