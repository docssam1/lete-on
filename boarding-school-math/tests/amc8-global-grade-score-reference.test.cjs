"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const reference = require("../competition/amc8-global-grade-score-reference.js");

const rows2006 = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-2006-global-grade-score-counts.csv"), "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});
const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc8-2009-global-grade-score-counts.csv");
const rows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});
const rows2007to2008 = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-2007-2008-global-grade-score-counts.csv"), "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});
const rows2019 = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-2019-global-grade-score-counts.csv"), "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});
const rows2022 = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-2022-global-grade-score-counts.csv"), "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});

test("2006 AMC 8 grade counts reconcile to MAA report totals and grade means", function () {
  const expected = { "4-5": [1853, "8.21"], "6": [16639, "8.51"], "7": [48479, "9.82"], "8": [78038, "10.75"] };
  Object.entries(expected).forEach(function ([gradeGroup, [participants, mean]]) {
    const gradeRows = rows2006.filter(function (row) { return row.gradeGroup === gradeGroup; });
    assert.equal(gradeRows.length, 26, `${gradeGroup} must include scores 0–25`);
    assert.equal(gradeRows.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), participants);
    assert.ok(gradeRows.every(function (row) { return row.gradeParticipants === participants; }));
    const weightedMean = gradeRows.reduce(function (sum, row) { return sum + row.score * row.participantsAtScore; }, 0) / participants;
    assert.equal(weightedMean.toFixed(2), mean);
    const lookup = reference.referenceFor(2006, gradeGroup === "4-5" ? 5 : Number(gradeGroup), 20);
    assert.equal(lookup.gradeParticipants, participants);
    assert.equal(lookup.reportedMean.toFixed(2), mean);
  });
  assert.equal(rows2006.length, 104);
});

test("2009 AMC 8 global grade counts reconcile to the annual report totals and means", function () {
  const expected = { "4-5": [3874, "9.45"], "6": [20688, "9.17"], "7": [50218, "10.08"], "8": [73220, "10.82"] };
  Object.entries(expected).forEach(function ([gradeGroup, [participants, mean]]) {
    const gradeRows = rows.filter(function (row) { return row.gradeGroup === gradeGroup; });
    assert.equal(gradeRows.length, 26, `${gradeGroup} must include scores 0–25`);
    assert.equal(gradeRows.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), participants);
    assert.ok(gradeRows.every(function (row) { return row.gradeParticipants === participants; }));
    const weightedMean = gradeRows.reduce(function (sum, row) { return sum + row.score * row.participantsAtScore; }, 0) / participants;
    assert.equal(weightedMean.toFixed(2), mean);
  });
  assert.equal(rows.length, 104);
});

test("2007–2008 AMC 8 grade distributions reconcile to the MAA annual report totals and means", function () {
  const expected = {
    2007: { "4-5": [3170, "8.48"], "6": [18687, "8.19"], "7": [49594, "9.51"], "8": [76907, "10.60"] },
    2008: { "4-5": [2698, "10.75"], "6": [19726, "9.88"], "7": [48889, "11.18"], "8": [75002, "12.07"] }
  };
  Object.entries(expected).forEach(function ([year, groups]) {
    Object.entries(groups).forEach(function ([gradeGroup, [participants, mean]]) {
      const gradeRows = rows2007to2008.filter(function (row) { return row.year === Number(year) && row.gradeGroup === gradeGroup; });
      assert.equal(gradeRows.length, 26, `${year} ${gradeGroup} must include scores 0–25`);
      assert.equal(gradeRows.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), participants);
      assert.ok(gradeRows.every(function (row) { return row.gradeParticipants === participants; }));
      const weightedMean = gradeRows.reduce(function (sum, row) { return sum + row.score * row.participantsAtScore; }, 0) / participants;
      assert.equal(weightedMean.toFixed(2), mean);
      const lookup = reference.referenceFor(Number(year), gradeGroup === "4-5" ? 5 : Number(gradeGroup), 20);
      assert.equal(lookup.gradeParticipants, participants);
      assert.equal(lookup.reportedMean.toFixed(2), mean);
    });
  });
  assert.equal(rows2007to2008.length, 208);
  assert.equal(rows2007to2008.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), 294673);
});

test("the same-grade score location reports a strict lower-score share, not a percentile", function () {
  const grade7 = reference.referenceFor(2009, 7, 21);
  assert.equal(grade7.gradeLabel, "7학년");
  assert.equal(grade7.participantsAtScore, 241);
  assert.equal(grade7.gradeParticipants, 50218);
  assert.equal(grade7.strictlyLowerCount, 49598);
  assert.equal(grade7.strictlyLowerShare.toFixed(2), "98.77");
  assert.equal(grade7.sourceStatus, "secondary-score-count-transcription-reconciled-to-MAA-report-totals-and-means");
  assert.equal(reference.referenceFor(2009, 5, 21).gradeLabel, "4–5학년");
  assert.equal(reference.referenceFor(2009, 3, 21), null);
  assert.equal(reference.referenceFor(2008, 7, 21).gradeParticipants, 48889);
  assert.equal(reference.referenceFor(2009, 9, 21), null);
  assert.equal(reference.referenceFor(2009, 7, 26), null);
});

test("cross-grade comparison uses only the selected year's reported grade groups", function () {
  const comparison2009 = reference.comparisonFor(2009, 7, 21);
  assert.deepEqual(comparison2009.rows.map(function (row) { return row.gradeLabel; }), ["4–5학년", "6학년", "7학년", "8학년"]);
  assert.deepEqual(comparison2009.rows.map(function (row) { return row.selected; }), [false, false, true, false]);
  assert.equal(comparison2009.rows[2].strictlyLowerCount, 49598);
  assert.equal(comparison2009.rows[2].gradeParticipants, 50218);
  assert.equal(comparison2009.rows.some(function (row) { return row.gradeLabel === "unknown"; }), false);

  const comparison2006 = reference.comparisonFor(2006, 7, 20);
  assert.deepEqual(comparison2006.rows.map(function (row) { return row.gradeLabel; }), ["4–5학년", "6학년", "7학년", "8학년"]);
  assert.equal(comparison2006.rows[2].gradeParticipants, 48479);
  assert.equal(comparison2006.rows[2].strictlyLowerCount, 47226);

  const comparison2007 = reference.comparisonFor(2007, 7, 20);
  assert.deepEqual(comparison2007.rows.map(function (row) { return row.gradeLabel; }), ["4–5학년", "6학년", "7학년", "8학년"]);
  assert.equal(comparison2007.rows[2].gradeParticipants, 49594);
  assert.equal(comparison2007.rows[2].strictlyLowerCount, 48702);
  const comparison2008 = reference.comparisonFor(2008, 7, 20);
  assert.equal(comparison2008.rows[2].gradeParticipants, 48889);
  assert.equal(comparison2008.rows[2].strictlyLowerCount, 46461);

  const comparison2019 = reference.comparisonFor(2019, 5, 20);
  assert.deepEqual(comparison2019.rows.map(function (row) { return row.gradeLabel; }), ["5학년 이하", "6학년", "7학년", "8학년"]);
  assert.equal(comparison2019.rows[0].selected, true);
  assert.equal(comparison2019.rows[0].gradeParticipants, 4396);

  const comparison2022 = reference.comparisonFor(2022, 7, 20);
  assert.equal(comparison2022.rows.length, 4);
  assert.equal(comparison2022.rows[2].strictlyLowerCount, 21833);
  assert.equal(comparison2022.rows[2].strictlyLowerShare.toFixed(2), "97.07");
  assert.equal(reference.comparisonFor(2018, 7, 20), null);
  assert.equal(reference.comparisonFor(2022, 3, 20), null);
  assert.equal(reference.comparisonFor(2022, 7, 26), null);
});

test("2019 MAA overall grade distributions reconcile to the report image summary", function () {
  const expected = { "<=5": [4396, "8.48"], "6": [18245, "8.50"], "7": [30327, "9.35"], "8": [40167, "10.06"], "unknown": [1485, "8.09"] };
  Object.entries(expected).forEach(function ([gradeGroup, [participants, mean]]) {
    const gradeRows = rows2019.filter(function (row) { return row.gradeGroup === gradeGroup; });
    assert.equal(gradeRows.length, 26, `${gradeGroup} must include scores 0–25`);
    assert.equal(gradeRows.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), participants);
    assert.ok(gradeRows.every(function (row) { return row.gradeParticipants === participants; }));
    const weightedMean = gradeRows.reduce(function (sum, row) { return sum + row.score * row.participantsAtScore; }, 0) / participants;
    assert.equal(weightedMean.toFixed(2), mean);
  });
  assert.equal(rows2019.length, 130);
  assert.equal(rows2019.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), 94620);
  const grade7 = reference.referenceFor(2019, 7, 20);
  assert.equal(grade7.gradeLabel, "7학년");
  assert.equal(grade7.gradeParticipants, 30327);
  assert.equal(grade7.strictlyLowerCount, 29542);
  assert.equal(grade7.strictlyLowerShare.toFixed(2), "97.41");
  assert.equal(reference.referenceFor(2019, 5, 20).gradeLabel, "5학년 이하");
  assert.equal(reference.referenceFor(2019, 3, 20), null);
  assert.equal(reference.referenceFor(2018, 7, 20), null);
});

test("2022 MAA Overall score-grade counts reconcile to the report image and grade means", function () {
  const expected = { "<=5": [4336, "8.96"], "6": [14258, "8.78"], "7": [22493, "9.57"], "8": [29236, "10.38"], unknown: [694, "7.87"] };
  Object.entries(expected).forEach(function ([gradeGroup, [participants, mean]]) {
    const gradeRows = rows2022.filter(function (row) { return row.gradeGroup === gradeGroup; });
    assert.equal(gradeRows.length, 26, `${gradeGroup} must include scores 0–25`);
    assert.equal(gradeRows.reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), participants);
    assert.ok(gradeRows.every(function (row) { return row.gradeParticipants === participants; }));
    const weightedMean = gradeRows.reduce(function (sum, row) { return sum + row.score * row.participantsAtScore; }, 0) / participants;
    assert.equal(weightedMean.toFixed(2), mean);
  });
  assert.equal(rows2022.length, 130);
  const imageAllCounts = [131,193,290,401,599,790,1078,1315,1760,2186,2669,3198,3946,4544,5274,5887,6130,6300,5982,5156,4232,3116,1863,965,484,2528];
  imageAllCounts.reverse().forEach(function (count, score) {
    assert.equal(rows2022.filter(function (row) { return row.score === score; }).reduce(function (sum, row) { return sum + row.participantsAtScore; }, 0), count);
  });
  const grade7 = reference.referenceFor(2022, 7, 20);
  assert.equal(grade7.gradeParticipants, 22493);
  assert.equal(grade7.participantsAtScore, 204);
  assert.equal(grade7.strictlyLowerCount, 21833);
  assert.equal(grade7.strictlyLowerShare.toFixed(2), "97.07");
  assert.equal(reference.referenceFor(2022, 5, 20).gradeLabel, "5학년 이하");
  assert.equal(reference.referenceFor(2022, 3, 20), null);
});

test("review results keep the 2009 all-school distribution separate from the Korea cohort", function () {
  const html = fs.readFileSync(path.join(__dirname, "../competition-paper-review.html"), "utf8");
  const script = fs.readFileSync(path.join(__dirname, "../competition-paper-review.js"), "utf8");
  assert.match(html, /amc8-global-grade-score-reference\.js/);
  assert.match(html, /AMC 8 과거 학년별 점수 기록/);
  assert.match(html, /공식 percentile이나 현재 기준·실력 등급은 아닙니다/);
  assert.match(html, /같은 점수 · 보고서 학년 그룹 비교/);
  assert.match(script, /GFIELDAMC8GlobalGradeScoreReference/);
  assert.match(script, /strictlyLowerShare/);
  assert.match(script, /comparisonFor\(selectedYear, grade, result\.scoreEstimate\.points\)/);
  assert.match(script, /2019 MAA Overall 성적 보고서 이미지/);
  assert.match(script, /2022 MAA Overall 점수×학년 보고서 이미지/);
});
