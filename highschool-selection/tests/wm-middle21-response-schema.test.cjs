const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const schema = require("../data/review-only/wm-middle21-response-schema.js");
const contracts = require("../server/exam-contracts.js");

test("all four WM M2-1 rounds use the reviewed 40-cell direct-input answer sheet", () => {
  assert.equal(schema.EXAM_IDS.length, 4);
  schema.EXAM_IDS.forEach((examId, index) => {
    const template = schema.templates[examId];
    assert.deepEqual(schema.validate(template), []);
    assert.equal(template.questions.length, 40);
    assert.deepEqual(template.questions.map(item => item.number), Array.from({ length: 40 }, (_, itemIndex) => itemIndex + 1));
    assert.deepEqual(new Set(template.questions.map(item => item.responseType)), new Set(["input"]));

    const contract = contracts.getExamContract(examId);
    assert.equal(contract.title, `원수학 중2-1 기본반 입학 대비 ${index + 1}회`);
    assert.equal(contract.programCode, "WM");
    assert.equal(contract.trackId, "middle-entry");
    assert.equal(contract.questionCount, 40);
    assert.equal(contract.durationMinutes, 100);
    assert.equal(contract.scheduledWindowMinutes, 120);
    assert.equal(contract.pageCount, 12);
    assert.equal(contract.cutlinePolicy, null);

    const student = contracts.responseSchemaFor(examId, "student-WM-M21");
    assert.equal(student.examId, examId);
    assert.equal(student.studentId, "student-WM-M21");
    assert.equal(student.questions.length, 40);
  });
});

test("WM public response schema never includes protected answer material", () => {
  const serialized = JSON.stringify(schema.templates);
  ["answer", "solution", "explanation", "correct", "sourcePath", "filePath", "pdfUrl"].forEach(term => {
    assert.equal(serialized.toLowerCase().includes(term.toLowerCase()), false);
  });
  const source = fs.readFileSync(path.join(__dirname, "..", "data", "review-only", "wm-middle21-response-schema.js"), "utf8");
  assert.equal(source.includes("G:\\"), false);
  assert.equal(source.includes("accepted"), false);
});
