"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const origin = String(process.env.HF_E2E_ORIGIN || "https://lete-on.gfieldacademy.net");
const studentName = String(process.env.HF_E2E_STUDENT_NAME || "").trim();
const studentCode = String(process.env.HF_E2E_STUDENT_CODE || "").trim();
const examId = String(process.env.HF_E2E_EXAM_ID || "premier-final-01");
const allowSubmit = process.env.HF_E2E_SUBMIT === "1";
const allowRetakes = process.env.HF_E2E_RETAKES === "1";

function publicConfig() {
  const source = fs.readFileSync(path.join(root, "supabase-config.js"), "utf8");
  const read = name => {
    const match = source.match(new RegExp(`${name}:\\s*"([^"]+)"`));
    assert.ok(match, `${name} 공개 설정이 없습니다.`);
    return match[1];
  };
  return { projectUrl: read("projectUrl"), publishableKey: read("publishableKey") };
}

function normalizeCode(value) {
  return String(value).normalize("NFKC").toUpperCase().replace(/[\s-]+/gu, "");
}

function loginNameKey(value) {
  return String(value).normalize("NFKC").replace(/\s+/gu, "").trim().toLocaleLowerCase("ko-KR");
}

function password(name, code) {
  const material = `hf-login-v1\0${loginNameKey(name)}\0${normalizeCode(code)}`;
  return `${crypto.createHash("sha256").update(material).digest("base64url")}Aa1!`;
}

async function requestJson(url, options, expected = 200) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { error: text.slice(0, 160) }; }
  assert.equal(response.status, expected, `${url} -> ${response.status}: ${body.error || "unknown"}`);
  return body;
}

async function main() {
  assert.ok(studentName && studentCode, "HF_E2E_STUDENT_NAME/HF_E2E_STUDENT_CODE가 필요합니다.");
  assert.match(normalizeCode(studentCode), /^GF\d{4}$/);
  const config = publicConfig();
  const digits = normalizeCode(studentCode).slice(2).toLowerCase();
  const session = await requestJson(`${config.projectUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: config.publishableKey, "content-type": "application/json" },
    body: JSON.stringify({
      email: `hf.${digits}@auth.gfieldacademy.net`,
      password: password(studentName, studentCode)
    })
  });
  const headers = {
    apikey: config.publishableKey,
    authorization: `Bearer ${session.access_token}`,
    "content-type": "application/json",
    origin
  };
  const invoke = (body, expected = 200) => requestJson(`${config.projectUrl}/functions/v1/secure-mock`, {
    method: "POST", headers, body: JSON.stringify(body)
  }, expected);

  const available = await invoke({ action: "listExams" });
  assert.equal(available.exams.length, 15, "학생에게 공개된 프리미어 회차 수가 다릅니다.");
  assert.equal(new Set(available.exams.map(exam => exam.id)).size, 15);
  assert.ok(available.exams.every(exam => exam.status === "published" && exam.answersReleasedAt));

  const exam = await invoke({ action: "loadExam", examId, loadEventId: crypto.randomUUID() });
  assert.equal(exam.exam.id, examId);
  assert.equal(exam.deliveryMode, "page_images");
  assert.equal(exam.sourceQuestionCount, 20);
  assert.equal(exam.questions.length, 20);
  const scoring = exam.questions.filter(question => question.scoringEligible === true);
  const excluded = exam.questions.filter(question => question.scoringEligible === false);
  assert.equal(scoring.length, exam.questionCount);
  assert.ok(excluded.length > 0, "검수 제외 문항이 있는 회차를 사용해야 합니다.");
  assert.ok(excluded.every(question => question.releaseStatus === "excluded" && question.lockReasons.length));
  assert.ok(scoring.some((question, index) => index > 0 && question.number !== scoring[index - 1].number + 1),
    "띄엄띄엄 원본 문항번호 제출 검증 대상이 아닙니다.");
  for (const page of exam.pages) {
    const response = await fetch(page.signedAssetUrl, { headers: { referer: `${origin}/hyper-focus/mock/viewer.html` } });
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200, `${page.number}쪽 서명 이미지`);
    assert.equal(response.headers.get("content-type"), "image/webp");
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF");
    assert.ok(bytes.length > 10000);
  }

  const answers = await invoke({ action: "loadAnswers", attemptId: exam.attemptId });
  assert.equal(answers.answers.length, scoring.length);
  assert.ok(answers.answersViewedAt);
  assert.deepEqual(answers.answers.map(row => row.questionKey), scoring.map(row => row.questionKey));

  let receipt = null;
  const attemptIds = [exam.attemptId];
  if (allowSubmit) {
    const marks = Object.fromEntries(scoring.map((question, index) => [String(question.number), index === 1 ? "x" : "o"]));
    receipt = await invoke({
      action: "saveAttempt",
      attemptId: exam.attemptId,
      submissionId: crypto.randomUUID(),
      marks
    });
    assert.equal(receipt.questionCount, scoring.length);
    assert.equal(receipt.correctCount, scoring.length - 1);
    assert.deepEqual(receipt.wrongQuestionKeys, [scoring[1].questionKey]);
    assert.deepEqual(receipt.wrongTypeKeys, [scoring[1].typeKey]);
  }

  if (allowRetakes) {
    assert.ok(allowSubmit, "재응시 실검증에는 HF_E2E_SUBMIT=1이 필요합니다.");
    for (const expectedAttemptNo of [2, 3]) {
      const retake = await invoke({ action: "startNewAttempt", examId, retakeEventId: crypto.randomUUID() });
      assert.equal(retake.attemptNo, expectedAttemptNo);
      assert.equal(retake.attemptStatus, "in_progress");
      attemptIds.push(retake.attemptId);
      const loaded = await invoke({ action: "loadExam", examId, loadEventId: crypto.randomUUID() });
      assert.equal(loaded.attemptId, retake.attemptId);
      const loadedScoring = loaded.questions.filter(question => question.scoringEligible === true);
      const loadedAnswers = await invoke({ action: "loadAnswers", attemptId: loaded.attemptId });
      assert.equal(loadedAnswers.answers.length, loadedScoring.length);
      const marks = Object.fromEntries(loadedScoring.map(question => [String(question.number), "o"]));
      const saved = await invoke({ action: "saveAttempt", attemptId: loaded.attemptId, submissionId: crypto.randomUUID(), marks });
      assert.equal(saved.status, "submitted");
      assert.equal(saved.correctCount, loadedScoring.length);
    }
    const limit = await invoke({ action: "startNewAttempt", examId, retakeEventId: crypto.randomUUID() }, 409);
    assert.equal(limit.error, "attempt_limit_reached");
  }

  const unauthenticated = await fetch(`${config.projectUrl}/functions/v1/secure-mock`, {
    method: "POST",
    headers: { apikey: config.publishableKey, "content-type": "application/json", origin },
    body: JSON.stringify({ action: "listExams" })
  });
  assert.equal(unauthenticated.status, 401);

  console.log(JSON.stringify({
    status: "PASS",
    examId,
    publishedRounds: available.exams.length,
    attemptId: exam.attemptId,
    attemptIds,
    attemptNo: exam.attemptNo,
    pageCount: exam.pages.length,
    sourceQuestionCount: exam.sourceQuestionCount,
    scoringQuestionCount: scoring.length,
    excludedQuestionCount: excluded.length,
    answersViewed: answers.answers.length,
    sparseSubmissionStored: Boolean(receipt),
    retakeSequenceVerified: allowRetakes,
    unauthenticatedStatus: unauthenticated.status
  }, null, 2));
}

main().catch(error => {
  console.error(`Hyper Focus secure mock live release QA: FAIL\n${error.stack || error.message}`);
  process.exitCode = 1;
});
