"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(path.join(root, "admin", "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "shared", "admin-page.js"), "utf8");

test("admin can assign a plan, all-learning access, and academy-semester access", () => {
  assert.match(page, /id="bank-access-panel"/);
  assert.match(page, /id="bank-plan"/);
  assert.match(page, /id="bank-all-learning"/);
  assert.match(page, /id="bank-target-choices"/);
  assert.match(script, /\/admin\/user-exam-library\/options/);
  assert.match(script, /\/admin\/user-exam-library\/users\//);
  assert.match(script, /kind:'all_learning'/);
  assert.match(script, /kind:'academy_all'/);
  assert.match(script, /kind:'academy_semester'/);
});

test("admin question-bank controls show limits without exposing protected question data", () => {
  ["maxSavedExamCount", "maxRecentExamCount", "temporaryRetentionDays"].forEach(key => assert.match(script, new RegExp(key)));
  ["answerKey", "correctAnswer", "questionText", "sourcePath", "filePath", "pdfUrl", "storageUrl"].forEach(key => {
    assert.equal(page.includes(key) || script.includes(key), false, key);
  });
});

test("admin access editor fails closed on a static page", () => {
  assert.match(script, /if\(!connected\)/);
  assert.match(script, /서버가 연결되지 않은 정적 화면/);
});
