const test = require("node:test");
const assert = require("node:assert/strict");
require("../competition/amc12-concept-practice-bank.js");
const bank = globalThis.GFIELDAMC12ConceptPractice;

test("AMC 12 bank is original, balanced, and spans the full high-school topic groups", () => {
  assert.equal(bank.items.length, 15);
  assert.deepEqual(bank.domains, ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  assert.equal(new Set(bank.items.map((item) => item.id)).size, 15);
  assert.ok(bank.items.every((item) => item.choices.length === 5 && item.solution.length >= 3 && item.connection));
  assert.deepEqual(bank.items.reduce((counts, item) => {
    counts[item.domain] = (counts[item.domain] || 0) + 1;
    return counts;
  }, {}), { "대수": 3, "함수·삼각함수": 3, "정수론": 3, "기하": 3, "경우의 수": 3 });
  const answerPositions = bank.items.reduce((counts, item) => {
    counts[item.answer] += 1;
    return counts;
  }, [0, 0, 0, 0, 0]);
  assert.deepEqual(answerPositions, [3, 3, 3, 3, 3]);
  assert.match(bank.scope, /excluding calculus/);
});

test("independently checked AMC 12 answers match each worked solution", () => {
  const expected = [39, -2, 53, 2, "4/5", "√2", 30, 58, 24, "15/2", 12, 2, "3/7", 30, "2/9"];
  bank.items.forEach((item, index) => {
    assert.equal(item.choices[item.answer], expected[index], item.id);
  });
});
