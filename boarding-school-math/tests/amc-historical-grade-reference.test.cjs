"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const reference = require("../competition/amc-historical-grade-reference.js");

test("AMC 8 returns only the matching recorded grade and exact contest year", function () {
  const result = reference.referenceFor("amc8", 2009, "", 7);
  assert.equal(result.mean, 10.08);
  assert.equal(result.participants, 50218);
  assert.equal(result.max, 25);
  const earlierYear = reference.referenceFor("amc8", 2001, "", 7);
  assert.equal(earlierYear.mean, 9.49);
  assert.equal(earlierYear.participants, 58271);
  assert.equal(reference.referenceFor("amc8", 2002, "", 8).mean, 11.79);
  const recovered2010 = [5, 6, 7, 8].map((grade) => reference.referenceFor("amc8", 2010, "", grade));
  assert.deepEqual(recovered2010.map((entry) => [entry.participants, entry.mean]), [[3945, 8.79], [20715, 8.61], [50749, 9.74], [75207, 10.6]]);
  assert.equal(recovered2010.reduce((sum, entry) => sum + entry.participants, 0), 150616);
  assert.ok(recovered2010.every((entry) => entry.sourceStatus === "MAA-original-host-preserved-by-Internet-Archive"));
  assert.match(recovered2010[0].sourceUrl, /web\.archive\.org\/web\/20130707194038/);
  assert.match(recovered2010[0].note, /2,595/);
  assert.equal(reference.referenceFor("amc8", 2010, "", 4), null);
  assert.equal(reference.referenceFor("amc8", 2010, "", 9), null);
  assert.equal(reference.referenceFor("amc8", 2009, "", 5), null);
  const recovered2011 = [5, 6, 7, 8].map((grade) => reference.referenceFor("amc8", 2011, "", grade));
  assert.deepEqual(recovered2011.map((entry) => [entry.participants, entry.mean]), [[3456, 9.3], [22879, 9.33], [50176, 10.66], [72230, 11.45]]);
  // Exact grades 5–8 exclude the separately reported <=4 cohort (938).
  assert.equal(recovered2011.reduce((sum, entry) => sum + entry.participants, 0), 148741);
  assert.equal(reference.entries.find(entry => entry.program === "amc8" && entry.year === 2011 && entry.gradeGroup === "<=4").participants, 938);
  assert.ok(recovered2011.every((entry) => entry.sourceStatus === "secondary-international-administrator-report-web-indexed-text"));
  assert.match(recovered2011[2].note, /3,066 participants have no recorded grade/);
  assert.equal(reference.referenceFor("amc8", 2011, "", 4), null);
  assert.equal(reference.comparisonFor("amc8", 2011, "", 7).rows.find((entry) => entry.selected).mean, 10.66);
});

test("AMC 10 and AMC 12 references require exact year, form, and grade", function () {
  const amc10 = reference.referenceFor("amc10", 2011, "A", 9);
  assert.equal(amc10.mean, 62.4);
  assert.equal(amc10.participants, 24410);
  assert.equal(reference.referenceFor("amc10", 2011, "A", 7), null);
  assert.equal(reference.referenceFor("amc10", 2011, "B", 9).mean, 66.6);
  assert.equal(reference.referenceFor("amc12", 2010, "B", 10).mean, 63.1);
  assert.equal(reference.referenceFor("amc12", 2010, "C", 10), null);
});

test("grouped and unknown grades never masquerade as exact-grade references", function () {
  const grouped = reference.entries.find((entry) => entry.program === "amc10" && entry.year === 2011 && entry.form === "A" && entry.gradeGroup === "<=8");
  const unknown = reference.entries.find((entry) => entry.program === "amc12" && entry.year === 2011 && entry.form === "A" && entry.gradeGroup === "unknown");
  assert.ok(grouped && unknown);
  assert.equal(grouped.grade, null);
  assert.equal(unknown.grade, null);
  assert.equal(reference.referenceFor("amc10", 2011, "A", 8), null);
});

test("cross-grade mean comparison stays within the same year, form, source and population", function () {
  const comparison = reference.comparisonFor("amc10", 2011, "A", 9);
  assert.deepEqual(comparison.rows.map((entry) => entry.gradeLabel), ["Grade 8 and below", "Grade 9", "Grade 10"]);
  assert.deepEqual(comparison.rows.map((entry) => entry.selected), [false, true, false]);
  assert.deepEqual(comparison.rows.map((entry) => entry.participants), [5018, 24410, 35727]);
  assert.equal(comparison.rows.some((entry) => entry.gradeGroup === "unknown"), false);
  assert.equal(reference.comparisonFor("amc10", 2011, "B", 9).form, "B");
  assert.equal(reference.comparisonFor("amc10", 2011, "A", 8), null);
  assert.equal(reference.comparisonFor("amc10", 2022, "A", 9), null);
});

test("restored AMC 8 2001–2010 means retain every CSV value and exact-grade boundary", function () {
  const fs = require("node:fs");
  const path = require("node:path");
  let count = 0;
  for (const file of ["amc8-grade-means-2001-2009.csv", "amc8-grade-means-2010.csv"]) {
    const lines = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade", file), "utf8").trim().split(/\r?\n/).slice(1);
    for (const line of lines) {
      const [year, , , population, group, participants, mean, , status, url] = line.split(",");
      const entry = reference.entries.find(row => row.program === "amc8" && row.year === Number(year) && row.gradeGroup === group);
      assert.ok(entry);
      assert.equal(entry.participants, Number(participants));
      assert.equal(entry.mean, Number(mean));
      assert.equal(entry.population, population);
      assert.equal(entry.sourceStatus, status);
      assert.equal(entry.sourceUrl, url);
      if (group === "4-5") {
        assert.equal(entry.grade, null);
        assert.equal(reference.referenceFor("amc8", year, "", 4), null);
        assert.equal(reference.referenceFor("amc8", year, "", 5), null);
      } else assert.equal(reference.referenceFor("amc8", year, "", Number(group)), entry);
      count += 1;
    }
  }
  assert.equal(count, 40);
});
