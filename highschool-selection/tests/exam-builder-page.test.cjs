"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("legacy exam builder address redirects to the verified editor", () => {
  const html = read("admin/exam-builder.html");
  const page = read("shared/exam-builder-page.js");
  assert.match(html, /href="\.\/exam-editor\.html"/);
  assert.match(page, /new URL\("\.\/exam-editor\.html"/);
  assert.match(page, /\^draft_\[A-Za-z0-9\]\+\$/);
  assert.match(page, /location\.replace\(target\.href\)/);
  assert.doesNotMatch(page, /\/admin\/exam-editor\/candidates|method:\s*"PATCH"/);
});

test("administrator entry page links directly to the verified editor", () => {
  assert.match(read("admin/index.html"), /\.\/exam-editor\.html/);
});
