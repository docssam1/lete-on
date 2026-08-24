const test = require("node:test");
const assert = require("node:assert/strict");
const security = require("../shared/exam-security.js");

const exam = { id: "sh-selection-r01", pageCount: 2, questionCount: 2 };
const session = { studentId: "student-1" };
const runtime = { assetMode: "signed-page-images", assetHosts: ["assets.example.test"], maxPageUrlTtlSeconds: 900 };
const now = Date.parse("2026-08-21T00:00:00Z");
const expiresAt = "2026-08-21T00:10:00Z";

test("accepts an exact student-bound signed image manifest", () => {
  const pages = security.validateManifest({
    examId: exam.id,
    studentId: session.studentId,
    expiresAt,
    pages: [
      { number: 1, url: "https://assets.example.test/e/1.png?sig=a", mimeType: "image/png" },
      { number: 2, url: "https://assets.example.test/e/2.webp?sig=b", mimeType: "image/webp" }
    ]
  }, exam, session, runtime, now);
  assert.equal(pages.length, 2);
});

test("rejects PDF, wrong student, wrong page count, and excessive TTL", () => {
  const base = { examId: exam.id, studentId: session.studentId, expiresAt, pages: [
    { number: 1, url: "https://assets.example.test/e/1.png", mimeType: "image/png" },
    { number: 2, url: "https://assets.example.test/e/2.png", mimeType: "image/png" }
  ] };
  assert.throws(() => security.validateManifest({ ...base, studentId: "other" }, exam, session, runtime, now));
  assert.throws(() => security.validateManifest({ ...base, pages: base.pages.slice(0, 1) }, exam, session, runtime, now));
  assert.throws(() => security.validateManifest({ ...base, expiresAt: "2026-08-21T01:00:00Z" }, exam, session, runtime, now));
  assert.throws(() => security.validateManifest({ ...base, pages: [{ number: 1, url: "https://assets.example.test/original.pdf", mimeType: "image/png" }, base.pages[1]] }, exam, session, runtime, now));
});

test("response schema rejects answer leakage", () => {
  assert.throws(() => security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input", correctAnswer: "3" },
      { number: 2, responseType: "input" }
    ]
  }, exam, session, runtime, now));
  assert.equal(security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input" },
      { number: 2, responseType: "multi_input", fields: [{ label: "가" }, { label: "나" }] }
    ]
  }, exam, session, runtime, now).length, 2);
  assert.throws(() => security.validateResponseSchema({
    examId: exam.id,
    studentId: "other",
    questions: [{ number: 1, responseType: "input" }, { number: 2, responseType: "input" }]
  }, exam, session, runtime, now));
});

test("response schema accepts and sanitizes the five canonical modes", () => {
  const fiveQuestionExam = { id: exam.id, pageCount: 2, questionCount: 5 };
  const questions = security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input", presentationOnly: "discarded" },
      { number: 2, responseType: "multi_input", fields: [
        { id: "x", label: "x", group: "point-a", groupLabel: "점 A" },
        { id: "y", label: "y", group: "point-a", groupLabel: "점 A" }
      ] },
      { number: 3, responseType: "ordered_list" },
      { number: 4, responseType: "unordered_set" },
      {
        number: 5,
        responseType: "self_check",
        selfCheck: true,
        singleAnswerVerified: true,
        answerImageUrl: "https://assets.example.test/answers/5.png?sig=a",
        answerImageMimeType: "image/png",
        answerImageExpiresAt: expiresAt
      }
    ]
  }, fiveQuestionExam, session, runtime, now);
  assert.deepEqual(questions.map((question) => question.responseType), ["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
  assert.equal(Object.hasOwn(questions[0], "presentationOnly"), false);
  assert.deepEqual(questions[1].fields, [
    { slotId: "x", label: "x", groupId: "point-a", groupLabel: "점 A" },
    { slotId: "y", label: "y", groupId: "point-a", groupLabel: "점 A" }
  ]);
});

test("legacy ox is accepted only as a canonical self-check alias", () => {
  const oneQuestionExam = { id: exam.id, pageCount: 2, questionCount: 1 };
  const questions = security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [{
      number: 1,
      responseType: "ox",
      selfCheck: true,
      singleAnswerVerified: true,
      answerImageUrl: "https://assets.example.test/answers/1.png?sig=a",
      answerImageMimeType: "image/png",
      answerImageExpiresAt: expiresAt
    }]
  }, oneQuestionExam, session, runtime, now);
  assert.equal(questions[0].responseType, "self_check");
});

test("response schema rejects nested answer material and ambiguous multi-input slots", () => {
  assert.throws(() => security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input", metadata: { answerSpec: { value: "private" } } },
      { number: 2, responseType: "input" }
    ]
  }, exam, session, runtime, now), /비공개 정보/);
  assert.throws(() => security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input", metadata: { acceptedAnswerHash: "private" } },
      { number: 2, responseType: "input" }
    ]
  }, exam, session, runtime, now), /비공개 정보/);
  assert.throws(() => security.validateResponseSchema({
    examId: exam.id,
    studentId: session.studentId,
    questions: [
      { number: 1, responseType: "input" },
      { number: 2, responseType: "multi_input", fields: [{ slotId: "same" }, { slotId: "same" }] }
    ]
  }, exam, session, runtime, now), /중복/);
});

test("attempt validation preserves ordered values and slots while canonicalizing unordered values", () => {
  const schema = [
    { number: 1, responseType: "input" },
    { number: 2, responseType: "multi_input", fields: [
      { slotId: "x", label: "x", groupId: "point-a" },
      { slotId: "y", label: "y", groupId: "point-a" }
    ] },
    { number: 3, responseType: "ordered_list" },
    { number: 4, responseType: "unordered_set" },
    { number: 5, responseType: "self_check" }
  ];
  const result = security.validateAttemptAnswers([
    { number: 1, responseType: "input", value: " 7 " },
    { number: 2, responseType: "multi_input", value: ["2", ""], slotIds: ["x", "y"], groupIds: ["point-a", "point-a"] },
    { number: 3, responseType: "ordered_list", value: ["3", "1", "2"] },
    { number: 4, responseType: "unordered_set", value: ["3", "1", "2"] },
    { number: 5, responseType: "self_check", value: "O" }
  ], schema);
  assert.equal(result[0].value, "7");
  assert.deepEqual(result[1].value, ["2", ""]);
  assert.deepEqual(result[2].value, ["3", "1", "2"]);
  assert.deepEqual(result[3].value, ["1", "2", "3"]);
  assert.equal(result[4].value, "o");
});

test("attempt validation rejects slot remapping and response-mode substitution", () => {
  const schema = [{ number: 1, responseType: "multi_input", fields: [
    { slotId: "x", label: "x", groupId: "point-a" },
    { slotId: "y", label: "y", groupId: "point-a" }
  ] }];
  assert.throws(() => security.validateAttemptAnswers([
    { number: 1, responseType: "multi_input", value: ["2", "5"], slotIds: ["y", "x"], groupIds: ["point-a", "point-a"] }
  ], schema), /슬롯/);
  assert.throws(() => security.validateAttemptAnswers([
    { number: 1, responseType: "input", value: "2,5" }
  ], schema), /구성이 일치/);
});
