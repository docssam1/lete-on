const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const reference = require("../competition/amc8-korea-percentile-reference.js");

test("2011 AMC 8 Korea percentile lookup returns the reported grade row only", function () {
  const grade7 = reference.referenceFor(2011, 7, 21);
  assert.equal(grade7.reportedPercentile, 88.25);
  assert.equal(grade7.studentsAtScore, 16);
  assert.equal(grade7.gradeParticipants, 315);
  assert.equal(grade7.population, "2011 AMC 8 South Korea reported participant cohort");
  assert.match(grade7.sourceUrl, /amcstudy\.net\/79$/);
  assert.equal(reference.referenceFor(2010, 7, 21).percentileType, "calculated-from-grade-score-counts");
  assert.equal(reference.referenceFor(2011, 9, 21), null);
  assert.equal(reference.referenceFor(2011, 7, 1), null);
});

test("grade 5 is labeled as the source's combined under-grade-5 group", function () {
  const grade5 = reference.referenceFor(2011, 5, 23);
  assert.equal(grade5.sourceGrade, "<=5");
  assert.equal(grade5.sourceGradeLabel, "5학년 이하");
  assert.equal(grade5.gradeParticipants, 72);
});

test("every exposed 2011 row matches the source transcription", function () {
  const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc8-2011-korea-grade-percentile.csv");
  const rows = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1);
  rows.forEach(function (line) {
    const [year, , , , gradeGroup, score, count, percentile] = line.split(",");
    const grade = gradeGroup === "<=5" ? 5 : Number(gradeGroup);
    const match = reference.referenceFor(Number(year), grade, Number(score));
    if (percentile === "") {
      assert.equal(match, null, `blank percentile should stay hidden: ${gradeGroup} / ${score}`);
      return;
    }
    assert.ok(match, `reported source row missing: ${gradeGroup} / ${score}`);
    assert.equal(match.studentsAtScore, Number(count));
    assert.equal(match.reportedPercentile, Number(percentile));
  });
});

test("2009 grade percentile is calculated only from the complete source score counts", function () {
  const csvPath = path.join(__dirname, "../competition/historical-amc-grade/amc8-2009-korea-grade-score-count.csv");
  const rows = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "").trim().split(/\r?\n/).slice(1).map(function (line) {
    const [year, , , , grade, score, count] = line.split(",");
    return { year: Number(year), grade: Number(grade), score: Number(score), count: Number(count) };
  });
  rows.forEach(function (row) {
    const match = reference.referenceFor(row.year, row.grade, row.score);
    const gradeRows = rows.filter(function (candidate) { return candidate.grade === row.grade; });
    const total = gradeRows.reduce(function (sum, candidate) { return sum + candidate.count; }, 0);
    const strictlyLower = gradeRows.filter(function (candidate) { return candidate.score < row.score; }).reduce(function (sum, candidate) { return sum + candidate.count; }, 0);
    assert.equal(match.studentsAtScore, row.count);
    assert.equal(match.gradeParticipants, total);
    assert.equal(match.reportedPercentile, strictlyLower / total * 100);
    assert.equal(match.percentileType, "calculated-from-grade-score-counts");
  });
  const grade7score21 = reference.referenceFor(2009, 7, 21);
  assert.equal(grade7score21.reportedPercentile.toFixed(2), "84.73");
  assert.equal(reference.referenceFor(2009, 4, 21), null);
});

test("every 2010 Korea percentile uses strictly lower counts in the same grade", function () {
  const rows = fs.readFileSync(path.join(__dirname, "../competition/historical-amc-grade/amc8-2010-korea-grade-score-counts.csv"), "utf8").trim().split(/\r?\n/).slice(1).map(line => line.split(","));
  assert.equal(rows.length, 104);
  for (const row of rows) {
    const group = rows.filter(candidate => candidate[4] === row[4]);
    const total = group.reduce((sum, candidate) => sum + Number(candidate[6]), 0);
    const lower = group.filter(candidate => Number(candidate[5]) < Number(row[5])).reduce((sum, candidate) => sum + Number(candidate[6]), 0);
    const record = reference.referenceFor(2010, Number(row[4]), Number(row[5]));
    assert.equal(record.studentsAtScore, Number(row[6]));
    assert.equal(record.gradeParticipants, total);
    assert.equal(record.reportedPercentile, lower / total * 100);
    assert.equal(record.sourceUrl, row[9]);
    assert.equal(record.percentileType, "calculated-from-grade-score-counts");
  }
  assert.equal(reference.referenceFor(2010, 4, 21), null);
  assert.equal(reference.referenceFor(2010, 9, 21), null);
});
