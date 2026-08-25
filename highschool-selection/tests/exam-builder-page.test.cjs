"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "admin", "exam-builder.html"), "utf8");
const page = fs.readFileSync(path.join(root, "shared", "exam-builder-page.js"), "utf8");

test("administrator editor exposes selection, scope, drag ordering, and four-up output controls", () => {
  assert.match(html, /id="candidate-list"/);
  assert.match(html, /id="placement-list"/);
  assert.match(html, /id="scope-dialog"/);
  assert.match(html, /4문항 · 왼쪽 2 \/ 오른쪽 2/);
  assert.match(page, /core\.changeScope\(/);
  assert.match(page, /core\.movePlacement\(/);
  assert.match(page, /core\.sortPlacements\(/);
  assert.match(page, /core\.replacePlacement\(/);
  assert.match(page, /dragCandidateId/);
  assert.match(page, /data-candidate-id/);
  assert.match(page, /draggable="true"/);
});

test("administrator editor can switch between all four Won Math representative rounds", () => {
  assert.match(html, /id="round-select"/);
  ["r01", "r02", "r03", "r04"].forEach(round => assert.match(html, new RegExp(`wm-middle21-basic-entry-${round}`)));
  assert.match(html, /wm-middle21-diagnostic-metadata\.js/);
  assert.match(page, /wmDiagnostic\.rounds\[examId\]/);
  assert.match(page, /createRoundDraft\(wm\)/);
  assert.match(page, /dom\["round-select"\]\.addEventListener\("change"/);
  assert.match(page, /답안과 원문은 편집 화면에 표시하지 않습니다/);
});

test("builder keeps unverified slots locked and blocks server save without canonical bank IDs", () => {
  assert.match(page, /releaseStatus: "locked"/);
  assert.match(page, /core\.validateCandidate\(item\)/);
  assert.match(page, /bankCore\.isNeutralId/);
  assert.match(page, /검증된 문항 DB ID와 연결한 뒤 저장/);
  assert.match(page, /revision = saved\.revision/);
  assert.doesNotMatch(page, /Number\(saved\.revision/);
});

test("builder output offers only answer entry or diagnostic QR and no lecture placeholder", () => {
  assert.match(html, /value="answer_entry">답안 입력/);
  assert.match(html, /value="diagnostic_report">진단지/);
  assert.doesNotMatch(html + page, /영상|강의 QR|video/i);
});
