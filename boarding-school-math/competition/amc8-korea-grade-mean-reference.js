(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8KoreaGradeMeanReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Historical South Korea reported participant cohorts; keep separate from MAA whole-report rows.
  const sourceUrls = Object.freeze({
    2009: "https://www.amcstudy.net/43",
    2010: "https://web.archive.org/web/20110625112502id_/http://amc.maa.org/amc8/2010/stats/statestatistics/KOREA.HTML",
    2011: "https://www.amcstudy.net/79"
  });
  const rows = Object.freeze([
    { year: 2009, grade: 5, participants: 70, mean: 14.37, total: 741, gradeListed: 737 },
    { year: 2009, grade: 6, participants: 158, mean: 13.11, total: 741, gradeListed: 737 },
    { year: 2009, grade: 7, participants: 262, mean: 15.17, total: 741, gradeListed: 737 },
    { year: 2009, grade: 8, participants: 247, mean: 13.65, total: 741, gradeListed: 737 },
    { year: 2010, grade: 5, participants: 49, mean: 10.43, total: 751, gradeListed: 742 },
    { year: 2010, grade: 6, participants: 189, mean: 11.47, total: 751, gradeListed: 742 },
    { year: 2010, grade: 7, participants: 247, mean: 13.28, total: 751, gradeListed: 742 },
    { year: 2010, grade: 8, participants: 257, mean: 14.14, total: 751, gradeListed: 742 },
    { year: 2011, grade: 5, participants: 68, mean: 13.16, total: 899, gradeListed: 894 },
    { year: 2011, grade: 6, participants: 252, mean: 11.67, total: 899, gradeListed: 894 },
    { year: 2011, grade: 7, participants: 315, mean: 13.92, total: 899, gradeListed: 894 },
    { year: 2011, grade: 8, participants: 255, mean: 14.20, total: 899, gradeListed: 894 }
  ].map(function (row) {
    return Object.freeze(Object.assign({}, row, {
      population: "South Korea reported AMC 8 participant cohort",
      sourceStatus: row.year === 2010 ? "MAA-primary-report-Internet-Archive-copy" : "secondary-transcription-of-MAA-result-copy",
      sourceUrl: sourceUrls[row.year],
      unlistedGradeCount: row.total - row.gradeListed
    }));
  }));

  function referenceFor(year, grade, score) {
    const selectedYear = Number(year);
    const selectedGrade = Number(grade);
    const selectedScore = Number(score);
    const row = rows.find(function (entry) { return entry.year === selectedYear && entry.grade === selectedGrade; });
    if (!row || !Number.isFinite(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
    return Object.freeze(Object.assign({}, row, {
      learnerScore: selectedScore,
      differenceFromMean: Number((selectedScore - row.mean).toFixed(2))
    }));
  }

  return Object.freeze({ rows: rows, referenceFor: referenceFor });
});
