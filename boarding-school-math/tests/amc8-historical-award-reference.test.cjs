const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const reference = require("../competition/amc8-historical-award-reference.js");

test("historical AMC 8 award cutoffs match every staged year and preserve the missing 2021 contest", function () {
  const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc8-award-cutoffs-2003-2022.csv");
  const rows = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1);
  const years = [];
  rows.forEach(function (line) {
    const [year, , , top5, top1] = line.split(",");
    const record = reference.referenceFor(Number(year));
    assert.ok(record, `missing historical cutoff row for ${year}`);
    assert.equal(record.honorRollTop5, Number(top5));
    assert.equal(record.distinguishedHonorRollTop1, Number(top1));
    assert.equal(record.sourceUrl, "https://ivyleaguecenter.org/2016/10/12/amc-8-historical-results-from-2011-to-2015/");
    years.push(Number(year));
  });
  assert.equal(rows.length, 19);
  assert.equal(reference.referenceFor(2021), null);
  const recent = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-score-distribution-2023-2026-maa.csv"), "utf8").trim().split(/\r?\n/).slice(1);
  assert.equal(recent.length, 4);
  for (const line of recent) {
    const fields = line.split(",");
    const record = reference.referenceFor(Number(fields[0]));
    assert.equal(record.distinguishedHonorRollTop1, Number(fields[3]));
    assert.equal(record.honorRollTop5, Number(fields[5]));
    assert.equal(record.sourceStatus, fields[15]);
    assert.equal(record.sourceUrl, fields[16]);
  }
  assert.equal(reference.referenceFor(2027), null);
  assert.deepEqual(years, years.slice().sort(function (a, b) { return a - b; }));
});
