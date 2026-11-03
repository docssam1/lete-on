"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const reference = require("../competition/amc8-global-grade-score-reference.js");

const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc8-2009-global-grade-score-counts.csv");
const rows = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/).slice(1).map(function (line) {
  const [year, , gradeGroup, score, participantsAtScore, gradeParticipants] = line.split(",");
  return { year: Number(year), gradeGroup, score: Number(score), participantsAtScore: Number(participantsAtScore), gradeParticipants: Number(gradeParticipants) };
});

test("2009 AMC 8 global grade counts reconcile to the annual report totals and means", function () {
  const expected = { "4-5": [3874, 9.45], "6": [20688, 9.17], "7": [50218, 10.08], "8": [73220, 10.82] };
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
  assert.equal(reference.referenceFor(2008, 7, 21), null);
  assert.equal(reference.referenceFor(2009, 9, 21), null);
  assert.equal(reference.referenceFor(2009, 7, 26), null);
});

test("review results keep the 2009 all-school distribution separate from the Korea cohort", function () {
  const html = fs.readFileSync(path.join(__dirname, "../competition-paper-review.html"), "utf8");
  const script = fs.readFileSync(path.join(__dirname, "../competition-paper-review.js"), "utf8");
  assert.match(html, /amc8-global-grade-score-reference\.js/);
  assert.match(html, /2009 AMC 8 전체 응시 기록 · 같은 학년 점수 위치/);
  assert.match(html, /공식 percentile이나 현재 기준·실력 등급은 아닙니다/);
  assert.match(script, /GFIELDAMC8GlobalGradeScoreReference/);
  assert.match(script, /strictlyLowerShare/);
});
