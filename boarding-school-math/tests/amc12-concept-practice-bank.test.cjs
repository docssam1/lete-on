const test = require("node:test");
const assert = require("node:assert/strict");
require("../competition/amc12-concept-practice-bank.js");
const bank = globalThis.GFIELDAMC12ConceptPractice;

test("AMC 12 bank retains its balanced seed set and structurally validates every expanded item", () => {
  assert.equal(bank.items.length, 67);
  assert.deepEqual(bank.domains, ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  assert.equal(new Set(bank.items.map((item) => item.id)).size, 67);
  assert.ok(bank.items.every((item) => item.choices.length === 5 && item.solution.length >= 2 && item.connection));
  assert.deepEqual(bank.items.slice(0, 15).reduce((counts, item) => {
    counts[item.domain] = (counts[item.domain] || 0) + 1;
    return counts;
  }, {}), { "대수": 3, "함수·삼각함수": 3, "정수론": 3, "기하": 3, "경우의 수": 3 });
  const answerPositions = bank.items.slice(0, 15).reduce((counts, item) => {
    counts[item.answer] += 1;
    return counts;
  }, [0, 0, 0, 0, 0]);
  assert.deepEqual(answerPositions, [3, 3, 3, 3, 3]);
  assert.ok(bank.items.slice(0, 15).every(item => item.solution.length >= 3));
  assert.ok(bank.items.every(item => bank.domains.includes(item.domain) && new Set(item.choices.map(String)).size === 5));
  assert.match(bank.scope, /excluding calculus/);
});

test("independently checked AMC 12 answers match each worked solution", () => {
  // Values independently recomputed from the prompts, including all 52 later core/gap additions.
  const expected = [39, -2, 53, 2, "4/5", "√2", 30, 58, 24, "15/2", 12, 2, "3/7", 30, "2/9",
    5, 4, "36cm²", 5, 6, 10, 16, "54cm²", 300, "21%", 16, "1 + √2", "36√3cm²", "6/5",
    "8/9", 162, 35, 15, "119/169", 2, "2x−2", 49, 3, -24, 2186, "35.5", 294, 10, "2025/2027",
    "51", "60°", "95°", "7", "12", "B", 60, 21, "20%", "60", "√57", "15", "√93", 9, "2/3",
    "48", "π/4", "5", "13", "27,216", "0", "40", "30"];
  assert.equal(expected.length, bank.items.length);
  bank.items.forEach((item, index) => {
    assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 5, item.id);
    assert.equal(item.choices[item.answer], expected[index], item.id);
  });
});
