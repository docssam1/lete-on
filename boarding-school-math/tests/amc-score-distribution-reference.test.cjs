"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const reference = require("../competition/amc-score-distribution-reference.js");

test("MAA same-form AMC references are available for the published AMC 8 seasons", function () {
  assert.deepEqual(Object.keys(reference.entries.amc8), ["2018", "2019", "2022", "2023", "2024", "2025", "2026"]);
  assert.deepEqual(
    [2018, 2019].map(function (year) {
      const row = reference.referenceFor("amc8", year, "");
      return [row.top1, row.top5, row.top25, row.top50, row.top75];
    }),
    [[19, 15, 11, 8, 6], [23, 19, 12, 9, 6]]
  );
  assert.equal(reference.referenceFor("amc8", 2018, "").students, 98448);
  assert.equal(reference.referenceFor("amc8", 2019, "").students, 94675);
  assert.equal(reference.referenceFor("amc8", 2019, "").reportAsOf, "2020-01-01");
  assert.equal(reference.referenceFor("amc8", 2018, "").top2_5, undefined);
  assert.equal(reference.referenceFor("amc8", 2019, "").top10, undefined);
  assert.equal(reference.referenceFor("amc8", 2022, "").top1, 22);
  assert.equal(reference.referenceFor("amc8", 2022, "").top5, 19);
  assert.equal(reference.referenceFor("amc8", 2022, "").top25, 13);
  assert.equal(reference.referenceFor("amc8", 2022, "").top50, 9);
  assert.equal(reference.referenceFor("amc8", 2022, "").top75, 6);
  assert.equal(reference.referenceFor("amc8", 2022, "").top2_5, undefined);
  assert.equal(reference.referenceFor("amc8", 2022, "").students, 71143);
  assert.equal(reference.referenceFor("amc8", 2022, "").reportAsOf, "2023-02-25");
  assert.match(reference.referenceFor("amc8", 2022, "").sourceUrl, /sohu\.com/);
  assert.equal(reference.referenceFor("amc8", 2026, "").top10, 19);
  assert.equal(reference.referenceFor("amc8", 2026, "").students, 80983);
  assert.match(reference.referenceFor("amc8", 2026, "").sourceUrl, /schoolyear=2026&amccomp=81060/);
});

test("MAA AMC 10 and AMC 12 references distinguish year and A/B form", function () {
  for (const program of ["amc10", "amc12"]) {
    assert.deepEqual(Object.keys(reference.entries[program]), ["2022A", "2022B", "2023A", "2023B", "2024A", "2024B", "2025A", "2025B"]);
    assert.notEqual(reference.referenceFor(program, 2025, "A"), reference.referenceFor(program, 2025, "B"));
    assert.equal(reference.referenceFor(program, 2025, "a").top10, reference.referenceFor(program, 2025, "A").top10);
    assert.equal(reference.referenceFor(program, 2026, "A"), null);
  }
  assert.equal(reference.referenceFor("amc12", 2025, "A").top10, 106.5);
  assert.equal(reference.referenceFor("amc12", 2025, "B").top10, 109.5);
  assert.equal(reference.referenceFor("amc10", 2025, "A").average, 57.12);
});

test("AMC report references contain ordered thresholds and exact source-cohort counts", function () {
  for (const program of Object.values(reference.entries)) {
    for (const entry of Object.values(program)) {
      const thresholds = reference.bands.map((band) => entry[band.id]);
      assert.ok(thresholds.every(Number.isFinite));
      assert.ok(thresholds.every((value, index) => index === 0 || value <= thresholds[index - 1]));
      assert.ok(entry.students > 0 && entry.schools > 0);
      assert.ok(entry.average >= 0 && entry.standardDeviation >= 0);
      assert.match(entry.sourceUrl, /maa\.edvistas\.com\/eduview\/report\.aspx\?mode=6/);
    }
  }
  assert.equal(reference.referenceFor("aime", 2025, "I"), null);
  assert.equal(reference.referenceFor("amc12", 2025, "C"), null);
});
