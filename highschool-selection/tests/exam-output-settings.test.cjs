const test = require("node:test");
const assert = require("node:assert/strict");
const output = require("../data/exam-output-settings.js");

test("four-up output produces the required left two and right two page capacity", () => {
  const settings = output.createOutputSettings({
    title: "원수학 중2-1 기본반 대비 1회",
    subtitle: "중1 대수·기하 누적",
    writer: "T",
    gradeLabel: "중2-1 기본반 입학 대비",
    purpose: "entry_test",
    layout: "four_up",
    themeId: "violet",
    accentColor: "#6d28d9",
    showPoints: true,
    showDifficulty: false,
    showWorkSpace: true,
    dateMode: "custom",
    customDate: "2026-08-25",
    qrDestination: "answer_entry",
    answerBookletPolicy: "question_solution_answer"
  });
  const preview = output.createPreviewManifest(settings, 40);

  assert.equal(settings.columns, 2);
  assert.equal(settings.itemsPerPage, 4);
  assert.equal(preview.pageCount, 10);
  assert.equal(preview.fields.name, true);
  assert.equal(preview.qrDestination, "answer_entry");
});

test("QR destinations cannot pretend that a missing lecture exists", () => {
  assert.deepEqual(output.QR_DESTINATIONS, ["none", "answer_entry", "diagnostic_report"]);
  assert.throws(() => output.createOutputSettings({
    title: "시험지",
    writer: "T",
    gradeLabel: "중1",
    qrDestination: "lecture"
  }), /qrDestination is not allowed/);
});

test("output settings contain no question, answer, solution, or private path content", () => {
  assert.throws(() => output.createOutputSettings({
    title: "시험지",
    writer: "T",
    gradeLabel: "중1",
    answerKey: [1, 2, 3]
  }), /cannot contain answerKey/);
  assert.throws(() => output.createOutputSettings({
    title: "시험지",
    writer: "T",
    gradeLabel: "중1",
    nested: { filePath: "G:/private/source.pdf" }
  }), /cannot contain filePath/);
});

test("writer is fixed to T and custom dates use an exact date format", () => {
  assert.throws(() => output.createOutputSettings({ title: "시험지", writer: "돌파", gradeLabel: "중1" }), /writer must be T/);
  assert.throws(() => output.createOutputSettings({
    title: "시험지",
    writer: "T",
    gradeLabel: "중1",
    dateMode: "custom",
    customDate: "8월 25일"
  }), /YYYY-MM-DD/);
});
