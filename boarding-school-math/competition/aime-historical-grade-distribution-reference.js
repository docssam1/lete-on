(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAIMEHistoricalGradeDistributionReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Transcribed from MAA-authored annual reports. Columns are unknown, <=7,
  // 8, 9, 10, 11, 12, and 13. Counts are kept separate by year and form.
  const sourceUrls = Object.freeze({
    2008: "https://web.archive.org/web/20240107095913id_/https://maa.org/sites/default/files/pdf/AMC/d-publication/d1-pubarchive/2007-8pub/Summary,2008HS.pdf",
    2010: "https://www.scribd.com/document/51428451/2010-HS-summary"
  });
  const scoresDescending = Object.freeze([15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  const gradeColumns = Object.freeze(["unknown", "le7", "8", "9", "10", "11", "12", "13"]);
  const scoreRowsByYear = Object.freeze({
    2008: Object.freeze({
      I: Object.freeze([
        [0, 0, 0, 0, 0, 1, 3, 0], [0, 0, 0, 0, 3, 3, 2, 0],
        [0, 0, 0, 2, 0, 2, 1, 0], [0, 0, 2, 3, 6, 10, 13, 0],
        [0, 0, 0, 2, 8, 26, 24, 0], [0, 2, 5, 14, 17, 25, 21, 0],
        [0, 2, 9, 29, 45, 55, 42, 0], [0, 4, 26, 31, 47, 71, 117, 0],
        [0, 7, 26, 36, 98, 114, 148, 1], [0, 14, 34, 63, 127, 208, 236, 1],
        [1, 19, 34, 95, 179, 298, 302, 2], [1, 10, 42, 95, 212, 354, 343, 2],
        [5, 10, 45, 79, 192, 296, 281, 1], [0, 4, 8, 40, 130, 161, 162, 0],
        [0, 2, 9, 13, 60, 64, 75, 0], [0, 1, 4, 2, 8, 22, 19, 0]
      ]),
      II: Object.freeze([
        [0, 0, 0, 0, 1, 0, 3, 0], [0, 0, 0, 1, 1, 5, 3, 0],
        [1, 1, 0, 0, 2, 9, 14, 0], [0, 0, 0, 1, 7, 9, 12, 0],
        [0, 0, 1, 2, 13, 20, 22, 0], [0, 1, 0, 5, 26, 39, 35, 0],
        [0, 0, 6, 7, 41, 56, 49, 1], [1, 2, 7, 11, 57, 79, 74, 0],
        [0, 5, 11, 27, 64, 88, 98, 2], [0, 3, 14, 40, 92, 117, 119, 2],
        [1, 12, 11, 51, 95, 144, 169, 3], [1, 6, 12, 37, 103, 143, 153, 4],
        [2, 2, 13, 29, 64, 148, 142, 0], [0, 3, 5, 25, 46, 91, 104, 1],
        [0, 2, 7, 9, 18, 43, 63, 1], [0, 4, 1, 2, 8, 13, 18, 0]
      ])
    }),
    2010: Object.freeze({
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
    })
  });

  function totalForGrade(year, form, grade) {
    // Keep the original two-argument form call compatible with existing users.
    if (arguments.length === 2) {
      grade = form;
      form = year;
      year = 2010;
    }
    const column = gradeColumns.indexOf(String(grade));
    if (column < 2) return null;
    const counts = scoreRowsByYear[Number(year)]?.[form];
    return counts ? counts.reduce((sum, row) => sum + row[column], 0) : null;
  }

  function referenceFor(year, form, grade, score) {
    const selectedYear = Number(year);
    const selectedForm = String(form || "").toUpperCase();
    const column = gradeColumns.indexOf(String(grade));
    const selectedScore = Number(score);
    const counts = scoreRowsByYear[selectedYear]?.[selectedForm];
    if (!counts || column < 2 || column > 7 || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 15) return null;
    const participants = totalForGrade(selectedYear, selectedForm, grade);
    const rowIndex = scoresDescending.indexOf(selectedScore);
    const studentsAtScore = counts[rowIndex][column];
    const studentsBelowScore = counts.slice(rowIndex + 1).reduce((sum, row) => sum + row[column], 0);
    return Object.freeze({
      year: selectedYear,
      form: selectedForm,
      grade: Number(grade),
      score: selectedScore,
      participants,
      studentsAtScore,
      studentsBelowScore,
      lowerScorePercent: participants ? studentsBelowScore / participants * 100 : null,
      max: 15,
      sourceUrl: sourceUrls[selectedYear]
    });
  }

  // Keep the original 2010 exports available to existing consumers.
  const sourceUrl = sourceUrls[2010];
  const scoreRows = scoreRowsByYear[2010];
  return Object.freeze({ sourceUrl, sourceUrls, scoresDescending, gradeColumns, scoreRows, scoreRowsByYear, totalForGrade, referenceFor });
});
