const test = require("node:test");
const assert = require("node:assert/strict");
require("../amc10-gfield-mock-bank.js");
const exam = globalThis.GFIELDAMC10Mock;

test("GFIELD AMC 10 mock is a complete 25-item, five-domain 75-minute form", () => {
  assert.equal(exam.id, "gfield-amc10-concept-mock-v1");
  assert.equal(exam.items.length, 25);
  assert.equal(exam.durationMinutes, 75);
  assert.deepEqual(exam.standards, ["대수", "정수론", "기하", "경우의 수", "확률"]);
  assert.deepEqual(exam.standards.map((domain) => exam.items.filter((item) => item.standard === domain).length), [5, 5, 5, 5, 5]);
  assert.equal(new Set(exam.items.map((item) => item.id)).size, 25);
  assert.ok(exam.items.every((item) => item.choices.length === 5 && item.solution && item.focus));
  assert.match(exam.nextStudyHref, /amc10-practice\.html/);
});

test("all authored answers match independently calculated values and choices are distinct", () => {
  const expected = ["25", "7", "6", "20", "1", "25", "6", "50", "3", "36", "90", "31.5", "15", "10π", "120", "12", "12", "12", "10", "18", "1/3", "3/10", "1/6", "3/10", "1/2"];
  exam.items.forEach((item, index) => assert.equal(String(item.choices[item.answer]), expected[index], item.id));
  exam.items.forEach((item) => assert.equal(new Set(item.choices.map(String)).size, 5, item.id));
});

test("AMC 10 exam page distinguishes its authored mock from official score claims", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const html = fs.readFileSync(path.join(__dirname, "../amc10-gfield-mock-exam.html"), "utf8");
  assert.match(html, /25문항/);
  assert.match(html, /75분/);
  assert.match(html, /공식 AMC 문항이나 공식 점수·등급으로 환산하지 않아요/);
  assert.match(html, /maa\.org\/student-programs\/amc/);
});
