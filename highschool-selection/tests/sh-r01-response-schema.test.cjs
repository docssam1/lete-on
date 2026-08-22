const test = require("node:test");
const assert = require("node:assert/strict");
const schema = require("../data/review-only/sh-r01-response-schema.js");
const security = require("../shared/exam-security.js");

const exam = { id: "sh-selection-r01", questionCount: 40 };
const session = { studentId: "STUDENT_TEST_001" };

test("SH-R01 exposes exactly 40 answer shapes without answer data", () => {
  assert.deepEqual(schema.validate(schema.template), []);
  assert.equal(schema.questions.length, 40);
  const counts = schema.questions.reduce((result, question) => {
    result[question.responseType] = (result[question.responseType] || 0) + 1;
    return result;
  }, {});
  assert.deepEqual(counts, { input: 33, multi_input: 3, unordered_set: 3, ordered_list: 1 });
  const serialized = JSON.stringify(schema.template);
  assert.equal(/answer|solution|explanation|sourcePath|filePath|pdfUrl|downloadUrl|correct/i.test(serialized), false);
});

test("coordinate questions retain their exact public slot and group contract", () => {
  assert.deepEqual(schema.questions.filter(item => item.responseType === "multi_input").map(item => item.number), [7, 14, 21]);
  assert.deepEqual(schema.questions[13].fields.map(field => field.slotId), ["pair-a-x", "pair-a-y", "pair-b-x", "pair-b-y"]);
  assert.deepEqual(schema.questions[20].fields.map(field => field.groupId), ["point-p", "point-p", "point-q", "point-q"]);
});

test("student-bound schema passes the same browser security validator used at runtime", () => {
  const packet = schema.forStudent(session.studentId);
  const validated = security.validateResponseSchema(packet, exam, session, {});
  assert.equal(validated.length, 40);
  assert.equal(validated[6].responseType, "multi_input");
  assert.equal(validated[13].fields.length, 4);
  assert.equal(validated[34].responseType, "unordered_set");
});
