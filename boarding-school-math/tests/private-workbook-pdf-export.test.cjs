const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const exporter = require("../scripts/export-private-grade6-workbook-pdf.cjs");

test("private PDF exporter requires explicit external HTML and PDF paths", function () {
  const inputPath = path.resolve(os.tmpdir(), "6-ee-b-ko-student.html");
  const outputPath = path.resolve(os.tmpdir(), "6-ee-b-ko-student.pdf");
  assert.deepEqual(exporter.parseArguments(["--input", inputPath, "--output", outputPath]), { inputPath, outputPath });
  assert.doesNotThrow(function () {
    exporter.parseArguments([
      "--input", path.resolve(os.tmpdir(), "6-ee-b-zh-Hans-teacher.html"),
      "--output", path.resolve(os.tmpdir(), "6-ee-b-zh-Hans-teacher.pdf")
    ]);
  });
  assert.throws(function () {
    exporter.parseArguments(["--input", inputPath, "--output", path.resolve(os.tmpdir(), "unsafe.pdf")]);
  }, /PRIVATE_PDF_EXPORT_COMMAND_INVALID/);
  assert.throws(function () {
    exporter.parseArguments(["--input", inputPath, "--output", path.resolve(os.tmpdir(), "6-ee-b-ko-teacher.pdf")]);
  }, /PRIVATE_PDF_EXPORT_FILE_BINDING_INVALID/);
  assert.throws(function () {
    exporter.parseArguments(["--input", inputPath, "--output", path.resolve(os.tmpdir(), "6-ee-b-en-student.pdf")]);
  }, /PRIVATE_PDF_EXPORT_FILE_BINDING_INVALID/);
});

test("private PDF exporter binds generated page count and Letter media boxes", function () {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-pdf-export-"));
  const pdfPath = path.join(temporaryRoot, "6-ee-b-ko-student.pdf");
  try {
    fs.writeFileSync(pdfPath, "%PDF-1.7\n1 0 obj<</Type /Page /MediaBox [0 0 612 792]>>endobj\n2 0 obj<</Type /Page /MediaBox [0 0 612 792]>>endobj\n", "latin1");
    assert.deepEqual(exporter.inspectGeneratedPdf(pdfPath), { pages: 2, pageSize: "letter" });
    fs.writeFileSync(pdfPath, "%PDF-1.7\n1 0 obj<</Type /Page /MediaBox [0 0 595 842]>>endobj\n", "latin1");
    assert.throws(function () {
      exporter.inspectGeneratedPdf(pdfPath);
    }, /PRIVATE_PDF_EXPORT_PAGE_LAYOUT_INVALID/);
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
