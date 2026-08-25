"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("admin exam editor exposes the full assembly workflow without embedding question content", () => {
  const html = read("admin/exam-editor.html");
  [
    "draft-create-form", "draft-mode", "draft-open-form", "candidate-mode", "candidate-scope", "candidate-list",
    "placement-list", "sort-mode", "view-mode", "scope-panel", "check-readiness"
  ].forEach(id => assert.match(html, new RegExp(`id=["']${id}["']`)));
  assert.match(html, /새 문제/);
  assert.match(html, /쌍둥이/);
  assert.match(html, /유사/);
  assert.match(html, /문제·정답/);
  assert.match(html, /문제·풀이/);
  assert.doesNotMatch(html, /answerKey|solutionText|sourcePath|storagePath|pdfUrl/);
});

test("editor client uses admin-only API mutations, revision CAS, conflict reload, and safe DOM rendering", () => {
  const script = read("shared/exam-editor-page.js");
  assert.match(script, /HIGHSELECT_AUTH\.requireAdmin/);
  assert.match(script, /"X-Highselect-Admin"/);
  assert.match(script, /expectedRevision:\s*state\.packet\.draft\.revision/);
  assert.match(script, /error\.status === 409/);
  assert.match(script, /\^\(INPUT\|SELECT\|TEXTAREA\)\$/);
  assert.match(script, /await openDraft\(state\.packet\.draftId/);
  assert.match(script, /textContent/);
  assert.doesNotMatch(script, /\.innerHTML\s*=/);
  assert.match(script, /kind:\s*"set_score"/);
  assert.match(script, /const pendingScores = new Map\(\)/);
  assert.match(script, /if \(state\.busy\) \{[\s\S]*flushScoreSave\(placementId\)/);
  assert.match(script, /kind:\s*"change_scope"/);
  assert.match(script, /kind:\s*"replace"/);
  assert.match(script, /mode:\s*elements\.createForm\.mode\.value/);
  assert.match(script, /new URLSearchParams\(\{ draftId: state\.packet\.draftId/);
  assert.match(script, /await request\("\/admin\/exam-editor\/status"\)/);
  assert.doesNotMatch(script, /params\.set\("mode"/);
  assert.doesNotMatch(script, /params\.set\("originalOnly"/);
  assert.match(script, /const changed = await performMutation\(/);
  assert.match(script, /if \(changed\) \{[\s\S]*pendingScores\.delete\(placementId\)/);
  assert.match(script, /retryDelay/);
  assert.match(script, /flushPendingScoreSaves/);
  assert.match(script, /if \(state\.packet && !\(await flushPendingScoreSaves\(\)\)\)/);
  assert.match(script, /dragstart/);
  assert.match(script, /dragover/);
  assert.match(script, /kind:\s*"move"/);
});

test("editor layout remains operational on desktop and phone widths", () => {
  const css = read("shared/app.css");
  assert.match(css, /\.editor-layout\s*\{[^}]*grid-template-columns:\s*minmax\(330px,/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.editor-layout \{ grid-template-columns: 1fr; \}/);
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.placement-row \{ grid-template-columns:/);
  assert.match(css, /\.candidate-list[^}]*max-height:/);
  assert.match(css, /\.placement-actions[^}]*display: flex/);
});
