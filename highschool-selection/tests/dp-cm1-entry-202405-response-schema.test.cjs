const test = require("node:test");
const assert = require("node:assert/strict");
const schema = require("../data/review-only/dp-cm1-entry-202405-response-schema.js");
const security = require("../shared/exam-security.js");

const exam = { id: "dp-common1-entry-202405", questionCount: 30 };
const session = { studentId: "STUDENT_TEST_001" };

test("DP CM1 source revision exposes 30 answerless input contracts", () => {
  assert.deepEqual(schema.validate(schema.template), []);
  assert.equal(schema.template.examId, "dp-common1-entry-202405");
  assert.equal(schema.questions.length, 30);
  assert.equal(schema.questions.every(item => item.responseType === "input"), true);
  const serialized = JSON.stringify(schema.template);
  assert.equal(/answer|solution|explanation|sourcePath|filePath|pdfUrl|downloadUrl|correct/i.test(serialized), false);
});

test("student-bound schema passes the runtime browser validator", () => {
  const packet = schema.forStudent(session.studentId);
  const validated = security.validateResponseSchema(packet, exam, session, {});
  assert.equal(validated.length, 30);
  assert.deepEqual(validated[0], { number: 1, responseType: "input" });
  assert.deepEqual(validated[29], { number: 30, responseType: "input" });
});
