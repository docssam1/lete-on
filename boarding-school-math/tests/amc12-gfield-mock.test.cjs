const test = require("node:test");
const assert = require("node:assert/strict");
require("../amc12-gfield-mock-bank.js");
const exam = globalThis.GFIELDAMC12Mock;

test("GFIELD AMC 12 range mock is a complete, five-domain 25-question form", () => {
  assert.equal(exam.id, "gfield-amc12-concept-mock-v1");
  assert.equal(exam.items.length, 25);
  assert.equal(exam.durationMinutes, 75);
  assert.deepEqual(exam.standards, ["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  assert.equal(new Set(exam.items.map((item) => item.id)).size, 25);
  assert.ok(exam.items.every((item) => exam.standards.includes(item.standard) && item.choices.length === 5 && item.solution));
  assert.deepEqual(exam.standards.map((standard) => exam.items.filter((item) => item.standard === standard).length), [5, 5, 5, 5, 5]);
  assert.match(exam.nextStudyHref, /amc12-practice\.html/);
});

test("answers agree with independent calculations for all 25 original questions", () => {
  const expected = ["527", "4", "24", "16", "48", "17", "5", "32", "7", "35", "29", "4/5", "24", "10", "15/16", "13", "31", "12", "75", "60", "3", "9", "4", "50°", "15"];
  exam.items.forEach((item, index) => assert.equal(String(item.choices[item.answer]), expected[index], item.id));
});

test("form identifies itself as GFIELD-created and keeps score interpretation descriptive", () => {
  const html = require("node:fs").readFileSync(require("node:path").join(__dirname, "../amc12-gfield-mock-exam.html"), "utf8");
  assert.match(html, /모든 문항은 지필드가 새로 만들었습니다/);
  assert.match(html, /실제 AMC 12 점수·등급/);
  assert.match(html, /maa\.org\/student-programs\/amc/);
  assert.match(html, /75/);
});
