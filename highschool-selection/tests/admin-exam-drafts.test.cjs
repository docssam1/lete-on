"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../server/app.js");
const { hashApprovalCode } = require("../server/security.js");
const bank = require("../data/question-bank-core.js");
const draftStore = require("../server/exam-draft-store.js");

const SECRET = "exam-draft-admin-secret-with-at-least-32-characters";
function config() {
  return {
    schemaVersion: "highselect-private-config/v1",
    students: [
      { studentId: "admin_ops", name: "운영관리자", approvalCodeHash: hashApprovalCode("ADMIN-001", Buffer.alloc(16, 1).toString("base64url")), role: "admin", grants: [] },
      { studentId: "student_ops", name: "일반학생", approvalCodeHash: hashApprovalCode("STUDENT-001", Buffer.alloc(16, 2).toString("base64url")), role: "student", grants: [] }
    ],
    exams: {}
  };
}
function item(key) { return bank.createNeutralId("question", "WM", key); }
function payload() {
  return {
    draftId: "draft-wm-middle21-basic-001",
    profileId: "WM",
    targetId: "middle21-basic",
    durationMinutes: 110,
    scopeKeys: ["M1-1", "M1-2"],
    sortMode: "user",
    viewMode: "question_solution_answer",
    placements: [{ placementId: "plc-001", itemId: item("adminitem001"), order: 1, score: 3, locked: false, selectionKind: "manual", replacementHistory: [] }]
  };
}
function outputSettings() {
  return {
    title: "중2-1 기본반 대비 1회", subtitle: "중1 대수 20문항 · 중1 기하 20문항",
    writer: "T", gradeLabel: "중2-1 기본반 입학 대비", purpose: "entry_test",
    themeId: "violet", accentColor: "#6d28d9", layout: "four_up",
    showNameField: true, showQuestionNumber: true, showPoints: false,
    showDifficulty: false, showAnswerSpace: true, showWorkSpace: false,
    dateMode: "hidden", qrDestination: "answer_entry",
    answerBookletPolicy: "question_solution_answer"
  };
}
async function start() {
  const app = createApp({
    sessionSecret: SECRET,
    assetSecret: `${SECRET}-asset`,
    privateConfig: config(),
    privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
    privateExamDrafts: { schemaVersion: draftStore.SCHEMA_VERSION, drafts: {} },
    cookieSecure: false
  });
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}
async function login(base, name, approvalCode) {
  const response = await fetch(`${base}/session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, approvalCode }) });
  return { response, cookie: String(response.headers.get("set-cookie") || "").split(";")[0] };
}
function headers(cookie, origin) { return { Cookie: cookie, Origin: origin, "Content-Type": "application/json", "X-Highselect-Admin": "1" }; }

test("administrator draft CRUD is CSRF-protected, revisioned, and metadata-only", async t => {
  const env = await start();
  t.after(() => env.server.close());
  const student = await login(env.base, "일반학생", "STUDENT-001");
  assert.equal((await fetch(`${env.base}/admin/exam-drafts`, { headers: { Cookie: student.cookie } })).status, 403);
  const admin = await login(env.base, "운영관리자", "ADMIN-001");
  const csrf = await fetch(`${env.base}/admin/exam-drafts`, { method: "POST", headers: { Cookie: admin.cookie, "Content-Type": "application/json" }, body: JSON.stringify({ draft: payload() }) });
  assert.equal(csrf.status, 403);
  const createdResponse = await fetch(`${env.base}/admin/exam-drafts`, { method: "POST", headers: headers(admin.cookie, env.base), body: JSON.stringify({ draft: payload(), outputSettings: outputSettings() }) });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.draft.placements[0].itemId, item("adminitem001"));
  assert.equal(created.draft.outputSettings.layout, "four_up");
  assert.equal(created.draft.outputSettings.writer, "T");
  assert.equal(/"(?:answer|solution|questionText|sourcePath)"\s*:/i.test(JSON.stringify(created)), false);
  const invalid = payload(); invalid.prompt = "not allowed";
  const blocked = await fetch(`${env.base}/admin/exam-drafts`, { method: "POST", headers: headers(admin.cookie, env.base), body: JSON.stringify({ draft: invalid }) });
  assert.equal(blocked.status, 400);
  const changed = payload(); changed.placements[0].locked = true;
  const changedOutput = Object.assign(outputSettings(), { qrDestination: "diagnostic_report" });
  const updatedResponse = await fetch(`${env.base}/admin/exam-drafts/${created.draft.draftId}`, { method: "PUT", headers: headers(admin.cookie, env.base), body: JSON.stringify({ expectedRevision: created.revision, draft: changed, outputSettings: changedOutput }) });
  assert.equal(updatedResponse.status, 200);
  const updated = await updatedResponse.json();
  assert.equal(updated.draft.placements[0].locked, true);
  assert.equal(updated.draft.outputSettings.qrDestination, "diagnostic_report");
  const stale = await fetch(`${env.base}/admin/exam-drafts/${created.draft.draftId}`, { method: "DELETE", headers: headers(admin.cookie, env.base), body: JSON.stringify({ expectedRevision: created.revision }) });
  assert.equal(stale.status, 409);
  const removed = await fetch(`${env.base}/admin/exam-drafts/${created.draft.draftId}`, { method: "DELETE", headers: headers(admin.cookie, env.base), body: JSON.stringify({ expectedRevision: updated.revision }) });
  assert.equal(removed.status, 200);
});
