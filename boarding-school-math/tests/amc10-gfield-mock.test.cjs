const test = require("node:test");
const assert = require("node:assert/strict");
require("../amc10-gfield-mock-bank.js");
const exam = globalThis.GFIELDAMC10Mock;

test("GFIELD AMC 10 mock is a complete 25-item, five-domain 75-minute form", () => {
  assert.equal(exam.id, "gfield-amc10-concept-mock-v1");
  assert.equal(exam.formVersion, "2026-11-04-v4");
  assert.equal(exam.items.length, 25);
  assert.equal(exam.durationMinutes, 75);
  assert.deepEqual(exam.standards, ["대수", "정수론", "기하", "경우의 수", "확률"]);
  assert.deepEqual(exam.standards.map((domain) => exam.items.filter((item) => item.standard === domain).length), [5, 4, 6, 5, 5]);
  assert.deepEqual(exam.items.slice(0, 5).map((item) => item.standard), ["대수", "기하", "기하", "경우의 수", "확률"]);
  assert.equal(new Set(exam.items.map((item) => item.id)).size, 25);
  assert.ok(exam.items.every((item) => item.choices.length === 5 && item.solution && item.focus));
  assert.match(exam.nextStudyHref, /amc10-practice\.html/);
});

test("all authored answers match independently calculated values and choices are distinct", () => {
  const expected = ["25", "31.5", "29", "48", "1/9", "3", "6", "52", "156", "18/35", "6", "24", "12", "26", "4/7", "47", "84", "67", "72", "5/14", "4", "60", "33", "56", "133/500"];
  exam.items.forEach((item, index) => assert.equal(String(item.choices[item.answer]), expected[index], item.id));
  exam.items.forEach((item) => assert.equal(new Set(item.choices.map(String)).size, 5, item.id));
  assert.match(exam.items[2].prompt, /가장 긴 변의 길이가 20/);
  assert.equal(exam.items[2].standard, "기하");
  assert.match(exam.items[2].focus, /삼각형 부등식/);
  assert.match(exam.items[13].solution, /56−30=26/);
  assert.match(exam.items[24].solution, /133\/500/);
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
