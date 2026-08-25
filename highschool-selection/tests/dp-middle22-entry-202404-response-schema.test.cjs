const test = require("node:test");
const assert = require("node:assert/strict");
const security = require("../shared/exam-security.js");
const responseContract = require("../shared/response-contract.js");
const response = require("../data/review-only/dp-middle22-entry-202404-response-schema.js");

test("DP middle 2-2 response template has 30 safe canonical questions", () => {
  assert.deepEqual(response.validate(response.template), []);
  assert.equal(response.template.examId, "dp-middle2-2-transfer");
  assert.equal(response.questions.length, 30);
  assert.deepEqual(response.questions.filter(item => item.responseType === "unordered_set").map(item => item.number), [16]);
  assert.deepEqual(response.questions.filter(item => item.responseType === "multi_input").map(item => item.number), [27, 30]);
  assert.equal(response.questions.filter(item => item.responseType === "input").length, 27);
});

test("multi-input slots and unordered sets survive the public runtime contracts", () => {
  const session = { studentId: "learner_001" };
  const normalized = security.validateResponseSchema(
    response.forStudent(session.studentId),
    { id: response.template.examId, questionCount: 30 },
    session,
    {}
  );
  assert.equal(normalized[15].responseType, "unordered_set");
  assert.equal(normalized[26].fields.length, 2);
  assert.deepEqual(responseContract.collect(normalized[26], [" 1 ", "2"]), {
    value: ["1", "2"],
    slotIds: ["slot-1", "slot-2"],
    groupIds: [null, null]
  });
  assert.deepEqual(responseContract.collect(normalized[15], "b, a"), { value: ["a", "b"] });
});

test("student-specific response schema adds only a neutral student id", () => {
  const student = response.forStudent("learner_001");
  assert.equal(student.studentId, "learner_001");
  assert.deepEqual(response.validate(student), []);
  assert.throws(() => response.forStudent("홍길동"), /invalid student id/);
});

test("public response schema contains no answer-bearing or path fields", () => {
  const serialized = JSON.stringify(response.template);
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/answer|solution|correct|sourcePath|pdfUrl|downloadUrl/i.test(serialized), false);
});
