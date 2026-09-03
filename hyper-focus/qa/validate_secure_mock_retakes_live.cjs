"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
const configSource = fs.readFileSync(path.join(root, "supabase-config.js"), "utf8");
const readConfig = name => configSource.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1] || "";
const projectUrl = readConfig("projectUrl");
const publishableKey = readConfig("publishableKey");
const origin = "https://lete-on.gfieldacademy.net";

async function requestJson(url, options, expected = 200) {
  const response = await fetch(url, options);
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  assert.equal(response.status, expected, `${url} -> ${response.status}: ${body.error || text.slice(0, 120)}`);
  return body;
}

async function main() {
  assert.ok(serviceKey && projectUrl && publishableKey, "Supabase 실검증 환경값이 필요합니다.");
  const runId = crypto.randomUUID();
  const handle = `qa${runId.replaceAll("-", "").slice(0, 8)}`;
  const email = `hf.${handle}@auth.gfieldacademy.net`;
  const password = `${crypto.randomUUID()}Aa1!`;
  let userId = "";
  const serviceHeaders = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, "content-type": "application/json" };
  const restHeaders = { ...serviceHeaders, prefer: "return=representation" };
  try {
    const created = await requestJson(`${projectUrl}/auth/v1/admin/users`, {
      method: "POST", headers: serviceHeaders,
      body: JSON.stringify({ email, password, email_confirm: true, app_metadata: { hf_role: "student", hf_login_version: 1 } })
    });
    userId = created.id;
    assert.match(userId, /^[0-9a-f-]{36}$/i);
    await requestJson(`${projectUrl}/rest/v1/hf_students`, {
      method: "POST", headers: restHeaders,
      body: JSON.stringify({ id: userId, login_handle: handle, display_name: "QA 자동검수", login_name_key: `qa-${runId}`, login_version: 1, student_type: "online", account_status: "active" })
    }, 201);
    const exams = await requestJson(`${projectUrl}/rest/v1/hf_mock_exams?slug=eq.premier-final-01&select=id`, { headers: serviceHeaders });
    assert.equal(exams.length, 1);
    await requestJson(`${projectUrl}/rest/v1/hf_mock_entitlements`, {
      method: "POST", headers: restHeaders, body: JSON.stringify({ student_id: userId, mock_exam_id: exams[0].id })
    }, 201);
    const session = await requestJson(`${projectUrl}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { apikey: publishableKey, "content-type": "application/json" }, body: JSON.stringify({ email, password })
    });
    const headers = { apikey: publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json", origin };
    const invoke = (body, expected = 200) => requestJson(`${projectUrl}/functions/v1/secure-mock`, { method: "POST", headers, body: JSON.stringify(body) }, expected);
    const exam = await invoke({ action: "loadExam", examId: "premier-final-01", loadEventId: crypto.randomUUID() });
    const scoring = exam.questions.filter(question => question.scoringEligible === true);
    const marks = Object.fromEntries(scoring.map(question => [String(question.number), "o"]));
    const attemptIds = [exam.attemptId];
    await invoke({ action: "loadAnswers", attemptId: exam.attemptId });
    await invoke({ action: "saveAttempt", attemptId: exam.attemptId, submissionId: crypto.randomUUID(), marks });
    for (const expectedAttemptNo of [2, 3]) {
      const retake = await invoke({ action: "startNewAttempt", examId: exam.exam.id, retakeEventId: crypto.randomUUID() });
      assert.equal(retake.attemptNo, expectedAttemptNo);
      attemptIds.push(retake.attemptId);
      await invoke({ action: "loadAnswers", attemptId: retake.attemptId });
      await invoke({ action: "saveAttempt", attemptId: retake.attemptId, submissionId: crypto.randomUUID(), marks });
    }
    const limit = await invoke({ action: "startNewAttempt", examId: exam.exam.id, retakeEventId: crypto.randomUUID() }, 409);
    assert.equal(limit.error, "attempt_limit_reached");
    console.log(JSON.stringify({ status: "PASS", attempts: attemptIds.length, attemptNumbers: [1, 2, 3], fourthAttemptStatus: 409 }, null, 2));
  } finally {
    if (userId) {
      const encoded = encodeURIComponent(userId);
      await fetch(`${projectUrl}/rest/v1/hf_mock_attempts?student_id=eq.${encoded}`, { method: "DELETE", headers: serviceHeaders });
      await fetch(`${projectUrl}/rest/v1/hf_mock_entitlements?student_id=eq.${encoded}`, { method: "DELETE", headers: serviceHeaders });
      await fetch(`${projectUrl}/rest/v1/hf_entitlements?student_id=eq.${encoded}`, { method: "DELETE", headers: serviceHeaders });
      await fetch(`${projectUrl}/rest/v1/hf_students?id=eq.${encoded}`, { method: "DELETE", headers: serviceHeaders });
      await fetch(`${projectUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE", headers: serviceHeaders });
    }
  }
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
