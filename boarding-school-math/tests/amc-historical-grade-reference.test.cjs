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
