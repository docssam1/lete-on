"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("administrator editor uses the protected server workflow for candidate search and draft mutations", () => {
  const html = read("admin/exam-builder.html");
  const page = read("shared/exam-builder-page.js");
  assert.match(html, /id="candidate-list"/);
  assert.match(html, /id="placement-list"/);
  assert.match(html, /id="scope-keys"/);
  assert.match(html, /id="check-readiness"/);
  assert.match(page, /requireAdmin\("\.\.\/login\.html"\)/);
  assert.match(page, /\/admin\/exam-editor\/candidates/);
  assert.match(page, /\/admin\/exam-editor\/drafts/);
  assert.match(page, /expectedRevision: draft\.draft\.revision/);
  assert.match(page, /evidenceId = item\.replacement/);
  assert.match(page, /kind: "move"/);
  assert.match(page, /kind: "change_scope"/);
  assert.match(page, /kind: "set_view"/);
});

test("administrator editor has no answer, solution, source, or PDF display payload", () => {
  const combined = `${read("admin/exam-builder.html")}\n${read("shared/exam-builder-page.js")}`;
  assert.doesNotMatch(combined, /answerKey|answerSpec|sourcePath|storagePath|pdfUrl|\.pdf/i);
  assert.match(combined, /검수 후보/);
  assert.match(combined, /교체 이력과 근거 ID가 저장/);
});

test("administrator entry page links to the protected editor", () => {
  assert.match(read("admin/index.html"), /\.\/exam-builder\.html/);
});
