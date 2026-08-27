const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const qa = require("../scripts/qa-private-grade6-workbook-html.cjs");

test("private HTML QA requires explicit external roots and keeps output filenames deterministic", function () {
  const inputRoot = path.resolve(os.tmpdir(), "gfield-private-html-input");
  const outputRoot = path.resolve(os.tmpdir(), "gfield-private-html-output");
  assert.deepEqual(
    qa.parseArguments(["--input-root", inputRoot, "--unit", "ccss-6-ee-b", "--output", outputRoot]),
    { inputRoot, unitId: "ccss-6-ee-b", outputRoot }
  );
  assert.equal(qa.expectedFileName("ccss-6-ee-b", "zh-Hans", "teacher"), "6-ee-b-zh-Hans-teacher.html");
  assert.equal(qa.expectedScreenshotName("ccss-6-ee-b", "ko", "student", "mobile"), "6-ee-b-ko-student-mobile.png");
  assert.throws(function () {
    qa.parseArguments(["--input-root", inputRoot]);
  }, /PRIVATE_HTML_QA_COMMAND_INVALID/);
});

test("private HTML QA finalizes screenshots without replacing another invocation output", function () {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-html-qa-"));
  const temporaryRoot = qa.createOwnedTemporaryDirectory(outputRoot);
  const stagedPath = path.join(temporaryRoot, "6-ee-b-ko-student-desktop.png");
  const outputPath = path.join(outputRoot, "6-ee-b-ko-student-desktop.png");
  try {
    fs.writeFileSync(stagedPath, "owned screenshot", "utf8");
    qa.copyScreenshotExclusive(stagedPath, outputPath);
    assert.equal(fs.readFileSync(outputPath, "utf8"), "owned screenshot");
    fs.writeFileSync(stagedPath, "later screenshot", "utf8");
    assert.throws(function () {
      qa.copyScreenshotExclusive(stagedPath, outputPath);
    }, /PRIVATE_HTML_QA_OUTPUT_EXISTS/);
    assert.equal(fs.readFileSync(outputPath, "utf8"), "owned screenshot");
  } finally {
    qa.removeOwnedTemporaryDirectory(temporaryRoot);
    fs.rmSync(outputRoot, { recursive: true, force: true });
  }
});
