"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const reference = require("../competition/amc-score-distribution-reference.js");

test("MAA same-form AMC references are available for the published AMC 8 seasons", function () {
  assert.deepEqual(Object.keys(reference.entries.amc8), ["2010", "2011", "2016", "2018", "2019", "2020", "2022", "2023", "2024", "2025", "2026"]);
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
  assert.equal(reference.referenceFor("amc8", 2010, "").average, 9.98);
  assert.equal(reference.referenceFor("amc8", 2010, "").students, 153211);
  assert.equal(reference.referenceFor("amc8", 2010, "").schools, 2342);
  assert.equal(reference.referenceFor("amc8", 2010, "").top1, 22);
  assert.equal(reference.referenceFor("amc8", 2010, "").top5, 17);
  assert.match(reference.referenceFor("amc8", 2010, "").sourceUrl, /web\.archive\.org\/web\/20130707194038/);
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
    assert.ok(Object.keys(reference.entries[program]).includes("2022A"));
    assert.notEqual(reference.referenceFor(program, 2025, "A"), reference.referenceFor(program, 2025, "B"));
    assert.equal(reference.referenceFor(program, 2025, "a").top10, reference.referenceFor(program, 2025, "A").top10);
    assert.equal(reference.referenceFor(program, 2026, "A"), null);
  }
  assert.equal(reference.referenceFor("amc12", 2025, "A").top10, 106.5);
  assert.equal(reference.referenceFor("amc12", 2025, "B").top10, 109.5);
  assert.equal(reference.referenceFor("amc10", 2025, "A").average, 57.12);
  assert.equal(reference.referenceFor("amc10", 2012, "A").top1, 121.5);
  assert.equal(reference.referenceFor("amc10", 2012, "B").average, 76.59);
  assert.deepEqual([reference.referenceFor("amc10", 2000, "").average, reference.referenceFor("amc10", 2001, "").average], [64.2, 67.8]);
  assert.deepEqual([reference.referenceFor("amc12", 2000, "").average, reference.referenceFor("amc12", 2001, "").average], [64.9, 56.6]);
  assert.deepEqual(
    [reference.referenceFor("amc10", 2011, "A").average, reference.referenceFor("amc10", 2011, "B").average, reference.referenceFor("amc12", 2011, "A").average, reference.referenceFor("amc12", 2011, "B").average],
    [67.7, 72.2, 66.8, 64.9]
  );
  assert.deepEqual(
    [reference.referenceFor("amc10", 2011, "A").students, reference.referenceFor("amc10", 2011, "B").students, reference.referenceFor("amc12", 2011, "A").students, reference.referenceFor("amc12", 2011, "B").students],
    [70919, 33723, 74665, 30846]
  );
  assert.match(reference.referenceFor("amc10", 2011, "A").sourceUrl, /web\.archive\.org\/web\/20130124025158/);
  assert.match(reference.referenceFor("amc10", 2001, "").sourceLabel, /2차 자료/);
  assert.match(reference.referenceFor("amc12", 2000, "").sourceNote, /독립 대조하지 못했다고/);
  assert.equal(reference.referenceFor("amc10", 2001, "").top1, undefined);
  assert.equal(reference.referenceFor("amc12", 2000, "").top5, undefined);
  assert.deepEqual([reference.referenceFor("amc10", 2007, "A").average, reference.referenceFor("amc10", 2007, "B").average], [67.9, 61.5]);
  assert.deepEqual([reference.referenceFor("amc10", 2006, "A").average, reference.referenceFor("amc10", 2006, "B").average], [79, 68.5]);
  assert.deepEqual([reference.referenceFor("amc10", 2005, "A").average, reference.referenceFor("amc10", 2005, "B").average], [74.7, 77.9]);
  assert.equal(reference.referenceFor("amc10", 2002, "B"), null);
  assert.deepEqual([reference.referenceFor("amc12", 2006, "A").average, reference.referenceFor("amc12", 2006, "B").average], [85.7, 85.5]);
  assert.deepEqual([reference.referenceFor("amc12", 2002, "A").average, reference.referenceFor("amc12", 2002, "B").average], [72.7, 80.8]);
  assert.match(reference.referenceFor("amc12", 2006, "A").sourceUrl, /2008-high-school-summary/);
  assert.equal(reference.referenceFor("amc12", 2006, "A").top1, undefined);
  assert.deepEqual([reference.referenceFor("amc12", 2010, "A").average, reference.referenceFor("amc12", 2010, "B").average], [62.5, 59.8]);
  assert.equal(reference.referenceFor("amc12", 2016, "A").top1, 111);
  assert.equal(reference.referenceFor("amc12", 2016, "B").average, undefined);
  assert.match(reference.referenceFor("amc12", 2016, "B").corroboratingSourceUrl, /mathgoldmedalist\.com/);
  assert.equal(reference.referenceFor("amc10", 2017, "A").top1, 127.5);
  assert.equal(reference.referenceFor("amc10", 2020, "B").students, 26553);
  assert.deepEqual(
    [reference.referenceFor("amc12", 2018, "B").top1, reference.referenceFor("amc12", 2018, "B").top5, reference.referenceFor("amc12", 2018, "B").average],
    [126, 99, undefined]
  );
  assert.equal(reference.referenceFor("amc10", 2021, "A").displayLabel, "봄 AMC 10 A");
  assert.equal(reference.referenceFor("amc10", 2021, "C").displayLabel, "가을 AMC 10 A");
  assert.equal(reference.referenceFor("amc10", 2021, "D").top1, 120);
  assert.equal(reference.referenceFor("amc10", 2021, "C").average, 59.48);
  assert.equal(reference.referenceFor("amc12", 2021, "C").top1, 130.5);
  assert.equal(reference.referenceFor("amc12", 2021, "C").average, 63.56);
  assert.equal(reference.referenceFor("amc12", 2021, "D").top1, 130.5);
  assert.equal(reference.referenceFor("amc12", 2021, "D").top5, 103.5);
  assert.equal(reference.referenceFor("amc12", 2021, "D").average, 57.18);
  assert.equal(reference.referenceFor("amc12", 2021, "D").students, 18884);
});

test("AMC references keep known fields, order reported cutoffs, and identify their sources", function () {
  for (const program of Object.values(reference.entries)) {
    for (const entry of Object.values(program)) {
      const thresholds = reference.bands.map((band) => entry[band.id]).filter(Number.isFinite);
      assert.ok(thresholds.length > 0 || Number.isFinite(entry.average));
      assert.ok(thresholds.every((value, index) => index === 0 || value <= thresholds[index - 1]));
      if (entry.students !== undefined) assert.ok(entry.students > 0);
      if (entry.schools !== undefined) assert.ok(entry.schools > 0);
      if (entry.average !== undefined) assert.ok(entry.average >= 0);
      if (entry.standardDeviation !== undefined) assert.ok(entry.standardDeviation >= 0);
      assert.match(entry.sourceUrl, /^https:\/\//);
      if (entry.corroboratingSourceUrl) assert.match(entry.corroboratingSourceUrl, /^https:\/\//);
      if (entry.sourceNote) assert.ok(entry.sourceLabel);
    }
  }
  assert.equal(reference.referenceFor("aime", 2025, "I"), null);
  assert.equal(reference.referenceFor("amc12", 2025, "C"), null);
});


test("recovered 2021 fall report fields retain paper and source identity without importing mislabeled AIME lines", function () {
 const expected = {
  amc10: {C:[75,57,45,59.48,23.31,29264,1594,5],D:[72,54,40.5,56.34,24.24,25270,1410,2]},
  amc12: {C:[75,60,48,63.56,24.45,20876,1508,6],D:[69,54,43.5,57.18,23.69,18884,1396,18]}
 };
 for (const program of Object.keys(expected)) for (const form of Object.keys(expected[program])) {
  const row = reference.referenceFor(program,2021,form);
  assert.deepEqual([row.top25,row.top50,row.top75,row.average,row.standardDeviation,row.students,row.schools,row.perfectScores],expected[program][form]);
  assert.equal(row.reportAsOf,"2022-02-06");
  assert.match(row.sourceUrl,/testdaily.cn\/55839/);
  assert.match(row.scoreReportImageUrl,/202409292055/);
  assert.match(row.sourceNote,/Apple Vision/);
  assert.match(row.sourceNote,/AIME/);
  assert.equal(row.top2_5,undefined);
  assert.equal(row.top10,undefined);
 }
});
