const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const reference = require("../competition/amc10-12-aime-cutoff-reference.js");

test("historic AMC 10/12 AIME score lines cover the staged years/forms and preserve revisions", function () {
  const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc10-12-aime-qualification-cutoffs-2000-2025.csv");
  const csvRows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/).slice(1);
  assert.equal(csvRows.length, reference.rows.length);
  assert.equal(reference.rows.length, 104);
  assert.equal(reference.referenceFor("amc10", 2003, "B").cutoff, 121);
  assert.equal(reference.referenceFor("amc12", 2024, "A").cutoff, 76.5);
  assert.equal(reference.referenceFor("amc12", 2025, "B").cutoff, 100.5);
  assert.equal(reference.referenceFor("amc10", 2021, "A").administration, "spring");
  assert.equal(reference.referenceFor("amc10", 2021, "C").administration, "fall");
  assert.equal(reference.referenceFor("amc12", 2021, "D").cutoff, 84);
  assert.equal(reference.referenceFor("amc10", 2026, "A"), null);
  for (const line of csvRows) {
    const [year, administration, contest, form, cutoff] = line.split(",");
    const lookupForm = year === "2021" && administration === "fall" ? form === "A" ? "C" : "D" : form;
    const record = reference.referenceFor(contest.toLowerCase(), year, lookupForm);
    assert.ok(record, `missing ${year} ${administration} ${contest} ${form}`);
    assert.equal(record.cutoff, Number(cutoff));
  }
});
