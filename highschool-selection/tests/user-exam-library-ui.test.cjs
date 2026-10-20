"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(path.join(root, "my-exams.html"), "utf8");
const printPage = fs.readFileSync(path.join(root, "exam-print.html"), "utf8");
const printScript = fs.readFileSync(path.join(root, "shared", "user-exam-print.js"), "utf8");
const printStyle = fs.readFileSync(path.join(root, "shared", "user-exam-print.css"), "utf8");
const engagement = fs.readFileSync(path.join(root, "data", "academy-engagement.js"), "utf8");

test("member dashboard opens the personal exam builder", () => {
  assert.match(engagement, /href: "\.\/my-exams\.html"/);
  assert.match(page, /나만의 문제은행/);
  assert.match(page, /user-exam-library\/access/);
  assert.match(page, /user-exam-library\/options/);
  assert.match(page, /user-exam-library\/generate/);
  assert.match(page, /user-exam-library\/exams/);
});

test("personal exam builder exposes only selection controls and safe recipe actions", () => {
  ["difficultyWeights", "responseWeights", "scopeKeys", "questionCount", "maxPerFamily", "domainQuotas", "itemsPerPage"].forEach(key => assert.match(page, new RegExp(key)));
  assert.match(page, /한 쪽 문항 수/);
  assert.match(page, /다시 구성/);
  assert.match(page, /function loadRecipe/);
  assert.match(page, /유사 시험/);
  assert.match(page, /exam-print\.html\?examId=/);
  assert.match(page, /parentExamId===card\.dataset\.examId/);
  assert.match(page, /\/save/);
  ["answerKey", "correctAnswer", "sourcePath", "filePath", "pdfUrl", "storageUrl"].forEach(key => assert.equal(page.includes(key), false, key));
});

test("personal exam print view keeps four-item A4 order down the left then down the right", () => {
  assert.match(printPage, /user-exam-print\.css/);
  assert.match(printPage, /user-exam-print\.js/);
  assert.match(printScript, /print-manifest/);
  assert.match(printScript, /signed-item-images/);
  assert.match(printScript, /waitForImages/);
  assert.match(printStyle, /grid-auto-flow:\s*column/);
  assert.match(printStyle, /@page\s*\{\s*size:\s*A4 portrait/);
  ["answerKey", "correctAnswer", "solution", "sourcePath", "filePath", "pdfUrl", "storageUrl"].forEach(key => {
    assert.equal(printPage.includes(key) || printScript.includes(key), false, key);
  });
});

test("personal exam builder fails closed without an operating API", () => {
  assert.match(page, /if\(!api\)/);
  assert.match(page, /운영 서버 연결이 필요합니다/);
  assert.match(page, /workspace\.hidden=false/);
});
