const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "admin", "exam-builder.html"), "utf8");
const script = fs.readFileSync(path.join(root, "shared", "exam-builder-page.js"), "utf8");
const css = fs.readFileSync(path.join(root, "shared", "app.css"), "utf8");

test("exam builder UI uses the protected admin API and contains no question, answer, or source payload", () => {
  assert.match(html, /id="candidate-rows"/);
  assert.match(html, /id="placement-rows"/);
  assert.match(script, /HIGHSELECT_AUTH\.requireAdmin/);
  assert.match(script, /credentials: "include"/);
  assert.match(script, /\/admin\/exam-drafts/);
  assert.match(script, /data-up/);
  assert.match(html, /id="audit-list"/);
  assert.match(script, /DRAFT_APPROVED/);
  assert.match(css, /\.builder-layout/);
  assert.match(css, /\.builder-layout, \.viewer-shell/);
  const combined = html + script;
  assert.doesNotMatch(combined, /questionText|answerKey|correctAnswer|pdfUrl|sourcePath|storagePath/i);
});
