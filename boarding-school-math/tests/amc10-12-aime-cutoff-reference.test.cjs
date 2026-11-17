const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const reference = require("../competition/amc10-12-aime-cutoff-reference.js");

test("historic AMC 10/12 AIME score lines cover the staged years/forms and preserve revisions", function () {
  const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc10-12-aime-qualification-cutoffs-2000-2025.csv");
  const csvRows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/).slice(1);
  assert.equal(csvRows.length, reference.rows.filter(row => row.year <= 2025).length);
  assert.equal(reference.rows.length, 108);
  assert.equal(reference.referenceFor("amc10", 2003, "B").cutoff, 121);
  assert.equal(reference.referenceFor("amc12", 2024, "A").cutoff, 76.5);
  assert.equal(reference.referenceFor("amc12", 2025, "B").cutoff, 100.5);
  assert.equal(reference.referenceFor("amc10", 2021, "A").administration, "spring");
  assert.equal(reference.referenceFor("amc10", 2021, "C").administration, "fall");
  assert.equal(reference.referenceFor("amc12", 2021, "D").cutoff, 84);
  for (const contest of ["amc10", "amc12"]) for (const form of ["A", "B"]) {
    const current = reference.referenceFor(contest, 2026, form);
    assert.equal(current.cutoff, contest === "amc10" ? 100 : 85);
    assert.equal(current.sourceStatus, "maa-official-fixed-registration-threshold");
    assert.equal(current.sourceUrl, "https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/");
  }
  assert.equal(reference.referenceFor("amc10", 2027, "A"), null);
  for (const line of csvRows) {
    const [year, administration, contest, form, cutoff] = line.split(",");
    const lookupForm = year === "2021" && administration === "fall" ? form === "A" ? "C" : "D" : form;
    const record = reference.referenceFor(contest.toLowerCase(), year, lookupForm);
    assert.ok(record, `missing ${year} ${administration} ${contest} ${form}`);
    assert.equal(record.cutoff, Number(cutoff));
  }
});
