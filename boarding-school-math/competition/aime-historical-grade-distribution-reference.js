(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAIMEHistoricalGradeDistributionReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Transcribed from the grade-level score tables in the MAA-authored 2010
  // AMC 10/12 Summary, hosted here as a third-party mirror. Columns are
  // unknown, <=7, 8, 9, 10, 11, 12, and 13. Counts are kept separate by form.
  const sourceUrl = "https://www.scribd.com/document/51428451/2010-HS-summary";
  const scoresDescending = Object.freeze([15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  const gradeColumns = Object.freeze(["unknown", "le7", "8", "9", "10", "11", "12", "13"]);
  const scoreRows = Object.freeze({
    I: Object.freeze([
      [0, 0, 0, 0, 0, 2, 1, 0], [0, 0, 1, 2, 0, 7, 1, 0],
      [0, 0, 2, 2, 5, 6, 11, 0], [0, 1, 1, 2, 10, 15, 25, 0],
      [0, 0, 5, 6, 13, 22, 31, 0], [0, 2, 5, 11, 23, 28, 30, 0],
      [0, 4, 3, 17, 23, 35, 47, 0], [0, 3, 15, 16, 34, 43, 42, 1],
      [0, 4, 11, 20, 36, 71, 47, 0], [0, 7, 19, 31, 48, 89, 78, 1],
      [1, 4, 20, 45, 44, 117, 114, 0], [1, 11, 16, 29, 70, 144, 164, 0],
      [0, 8, 16, 29, 66, 205, 207, 1], [0, 3, 10, 29, 57, 198, 209, 1],
      [0, 9, 5, 32, 51, 183, 188, 0], [0, 3, 7, 13, 24, 137, 131, 1]
    ]),
    II: Object.freeze([
      [1, 0, 0, 1, 0, 0, 0, 0], [4, 0, 0, 2, 1, 1, 3, 0],
      [12, 0, 0, 4, 4, 14, 12, 0], [8, 0, 1, 4, 5, 23, 14, 0],
      [8, 1, 3, 10, 25, 35, 38, 0], [12, 3, 6, 10, 32, 53, 30, 0],
      [12, 1, 9, 15, 56, 78, 58, 0], [9, 5, 18, 23, 83, 68, 69, 1],
      [13, 4, 14, 27, 85, 102, 86, 0], [14, 6, 18, 30, 91, 117, 60, 1],
      [13, 3, 16, 18, 71, 129, 84, 2], [17, 2, 16, 27, 79, 112, 73, 1],
      [2, 3, 10, 11, 47, 109, 89, 0], [5, 0, 4, 11, 32, 84, 56, 0],
      [2, 1, 3, 4, 24, 57, 56, 0], [0, 0, 3, 3, 9, 37, 26, 0]
    ])
  });

  function totalForGrade(form, grade) {
    const column = gradeColumns.indexOf(String(grade));
    if (column < 2) return null;
    return scoreRows[form].reduce((sum, row) => sum + row[column], 0);
  }

  function referenceFor(year, form, grade, score) {
    if (Number(year) !== 2010) return null;
    const selectedForm = String(form || "").toUpperCase();
    const column = gradeColumns.indexOf(String(grade));
    const selectedScore = Number(score);
    if (!scoreRows[selectedForm] || column < 2 || column > 7 || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 15) return null;
    const counts = scoreRows[selectedForm];
    const participants = totalForGrade(selectedForm, grade);
    const rowIndex = scoresDescending.indexOf(selectedScore);
    const studentsAtScore = counts[rowIndex][column];
    const studentsBelowScore = counts.slice(rowIndex + 1).reduce((sum, row) => sum + row[column], 0);
    return Object.freeze({
      year: 2010,
      form: selectedForm,
      grade: Number(grade),
      score: selectedScore,
      participants,
      studentsAtScore,
      studentsBelowScore,
      lowerScorePercent: participants ? studentsBelowScore / participants * 100 : null,
      max: 15,
      sourceUrl: sourceUrl
    });
  }

  return Object.freeze({ sourceUrl, scoresDescending, gradeColumns, scoreRows, totalForGrade, referenceFor });
});
