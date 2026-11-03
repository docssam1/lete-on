const test = require("node:test");
const assert = require("node:assert/strict");
require("../amc12-gfield-mock-bank.js");
const exam = globalThis.GFIELDAMC12Mock;

test("GFIELD AMC 12 range mock is a complete, five-domain 25-question form", () => {
  assert.equal(exam.id, "gfield-amc12-concept-mock-v1");
  assert.equal(exam.formVersion, "2026-11-04-v2");
  assert.equal(exam.items.length, 25);
  assert.equal(exam.durationMinutes, 75);
  assert.deepEqual(exam.standards, ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  assert.equal(new Set(exam.items.map((item) => item.id)).size, 25);
  assert.ok(exam.items.every((item) => exam.standards.includes(item.standard) && item.choices.length === 5 && item.solution));
  assert.deepEqual(exam.standards.map((standard) => exam.items.filter((item) => item.standard === standard).length), [5, 5, 5, 5, 5]);
  assert.match(exam.nextStudyHref, /amc12-practice\.html/);
});

test("answers agree with independent calculations for all 25 original questions", () => {
  const expected = ["527", "4", "60", "16", "48", "17", "5", "32", "24√3", "220", "29", "3√6/8", "32", "65/8", "5/9", "123", "26", "24", "32π", "200", "4", "3π", "807", "24", "2/11"];
  exam.items.forEach((item, index) => assert.equal(String(item.choices[item.answer]), expected[index], item.id));
  exam.items.forEach((item) => assert.equal(new Set(item.choices.map(String)).size, 5, `${item.id} choices must be distinct`));
});

test("form identifies itself as GFIELD-created and keeps score interpretation descriptive", () => {
  const html = require("node:fs").readFileSync(require("node:path").join(__dirname, "../amc12-gfield-mock-exam.html"), "utf8");
  assert.match(html, /모든 문항은 지필드가 새로 만들었습니다/);
  assert.match(html, /실제 AMC 12 점수·등급/);
  assert.match(html, /maa\.org\/student-programs\/amc/);
  assert.match(html, /75/);
});
