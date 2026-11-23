(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8KoreaPercentileReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Source: the 2011 AMC 8 Korea cohort's transcribed MAA grade report.
  // Percentiles are reported source values; they are not recalculated or generalized.
  const sourceUrl = "https://www.amcstudy.net/79";
  const grades = Object.freeze({
    "5": "<=5",
    "6": "6",
    "7": "7",
    "8": "8"
  });
  const scoreRows = Object.freeze({
    "5": Object.freeze({ 23: [3, 95.83], 21: [1, 94.44], 20: [2, 91.67], 19: [3, 87.50], 18: [4, 81.94], 17: [5, 75.00], 16: [8, 63.89], 15: [2, 61.11], 14: [6, 52.78], 13: [3, 48.61], 12: [2, 45.83], 11: [6, 37.50], 10: [9, 25.00], 9: [3, 20.83], 8: [3, 16.67], 7: [5, 9.72], 6: [1, 8.33], 5: [4, 2.78], 4: [1, 1.39], 3: [1, 0.00] }),
    "6": Object.freeze({ 25: [1, 99.60], 23: [2, 98.81], 22: [6, 96.43], 21: [4, 94.84], 20: [4, 93.25], 19: [5, 91.27], 18: [9, 87.70], 17: [8, 84.52], 16: [8, 81.35], 15: [15, 75.40], 14: [17, 68.65], 13: [22, 59.92], 12: [15, 53.97], 11: [25, 44.05], 10: [27, 33.33], 9: [12, 28.57], 8: [29, 17.06], 7: [13, 11.90], 6: [12, 7.14], 5: [10, 3.17], 4: [3, 1.98], 3: [4, 0.40], 2: [1, 0.00] }),
    "7": Object.freeze({ 25: [1, 99.68], 24: [3, 98.73], 23: [8, 96.19], 22: [9, 93.33], 21: [16, 88.25], 20: [12, 84.44], 19: [17, 79.05], 18: [17, 73.65], 17: [12, 69.84], 16: [21, 63.17], 15: [21, 56.51], 14: [25, 48.57], 13: [26, 40.32], 12: [22, 33.33], 11: [23, 26.03], 10: [18, 20.32], 9: [23, 13.02], 8: [12, 9.21], 7: [11, 5.71], 6: [6, 3.81], 5: [3, 2.86], 4: [7, 0.63], 3: [1, 0.32], 0: [1, 0.00] }),
    "8": Object.freeze({ 25: [2, 99.22], 24: [1, 98.82], 23: [7, 96.08], 22: [5, 94.12], 21: [10, 90.20], 20: [25, 80.39], 19: [11, 76.08], 18: [11, 71.76], 17: [13, 66.67], 16: [19, 59.22], 15: [18, 52.16], 14: [17, 45.49], 13: [19, 38.04], 12: [17, 31.37], 11: [15, 25.49], 10: [16, 19.22], 9: [16, 12.94], 8: [11, 8.63], 7: [9, 5.10], 6: [3, 3.92], 5: [4, 2.35], 4: [2, 1.57], 3: [1, 1.18], 2: [3, 0.00] })
  });
  const participants = Object.freeze({ "5": 72, "6": 252, "7": 315, "8": 255 });
  const korea2009Counts = Object.freeze({
    "5": Object.freeze([0, 0, 0, 0, 0, 1, 1, 1, 5, 5, 2, 2, 8, 6, 4, 9, 5, 3, 4, 4, 1, 3, 5, 0, 1, 0]),
    "6": Object.freeze([0, 0, 0, 2, 1, 4, 5, 6, 13, 9, 8, 14, 14, 10, 11, 18, 4, 7, 7, 7, 5, 6, 2, 4, 1, 0]),
    "7": Object.freeze([0, 0, 0, 1, 1, 1, 6, 3, 11, 10, 16, 15, 13, 18, 26, 18, 19, 17, 15, 16, 16, 14, 11, 8, 4, 3]),
    "8": Object.freeze([0, 0, 0, 0, 1, 3, 6, 14, 18, 10, 24, 14, 14, 23, 19, 16, 16, 20, 7, 12, 5, 7, 4, 6, 5, 3])
  });
  const korea2009Participants = Object.freeze({ "5": 70, "6": 158, "7": 262, "8": 247 });
  const korea2010Counts = Object.freeze({
    "5": Object.freeze([0, 0, 0, 0, 1, 3, 3, 5, 7, 4, 5, 4, 3, 5, 2, 0, 3, 0, 1, 2, 1, 0, 0, 0, 0, 0]),
    "6": Object.freeze([1, 0, 1, 0, 3, 10, 8, 14, 17, 14, 20, 16, 15, 14, 11, 12, 6, 7, 7, 1, 4, 2, 1, 2, 2, 1]),
    "7": Object.freeze([0, 0, 0, 0, 5, 4, 12, 14, 16, 19, 23, 14, 16, 13, 12, 14, 16, 7, 13, 9, 8, 11, 10, 8, 1, 2]),
    "8": Object.freeze([0, 0, 0, 0, 0, 1, 4, 11, 14, 22, 18, 18, 20, 9, 19, 28, 14, 18, 11, 16, 3, 6, 9, 7, 6, 3])
  });
  const korea2010Participants = Object.freeze({ "5": 49, "6": 189, "7": 247, "8": 257 });
  const korea2010SourceUrl = "https://web.archive.org/web/20110625112502id_/http://amc.maa.org/amc8/2010/stats/statestatistics/KOREA.HTML";

  function referenceFor(year, grade, score) {
    const selectedYear = Number(year);
    if (selectedYear !== 2009 && selectedYear !== 2010 && selectedYear !== 2011) return null;
    const selectedScore = Number(score);
    const sourceGrade = grades[String(Number(grade))];
    const sourceKey = sourceGrade === "<=5" ? "5" : sourceGrade;
    if (selectedYear === 2009 || selectedYear === 2010) {
      const sourceCounts = selectedYear === 2009 ? korea2009Counts : korea2010Counts;
      const sourceParticipants = selectedYear === 2009 ? korea2009Participants : korea2010Participants;
      const counts = sourceCounts[String(Number(grade))];
      const total = sourceParticipants[String(Number(grade))];
      if (!counts || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
      const count = counts[selectedScore];
      const strictlyLowerCount = counts.slice(0, selectedScore).reduce(function (sum, value) { return sum + value; }, 0);
      return Object.freeze({
        year: selectedYear,
        grade: Number(grade),
        sourceGrade: String(Number(grade)),
        sourceGradeLabel: `${Number(grade)}학년`,
        score: selectedScore,
        studentsAtScore: count,
        gradeParticipants: total,
        reportedPercentile: strictlyLowerCount / total * 100,
        percentileType: "calculated-from-grade-score-counts",
        percentileMethod: `${strictlyLowerCount}/${total}명: 해당 점수보다 낮은 점수를 받은 응시자 비율`,
        population: `${selectedYear} AMC 8 South Korea reported participant cohort`,
        sourceStatus: selectedYear === 2010 ? "MAA-primary-report-Internet-Archive-copy; percentile-calculated-from-grade-score-counts" : "secondary-transcription-no-percentile",
        sourceUrl: selectedYear === 2010 ? korea2010SourceUrl : "https://www.amcstudy.net/43"
      });
    }
    const row = sourceKey && scoreRows[sourceKey] && scoreRows[sourceKey][selectedScore];
    if (!row || !Number.isFinite(row[1])) return null;
    return Object.freeze({
      year: selectedYear,
      grade: Number(grade),
      sourceGrade: sourceGrade,
      sourceGradeLabel: sourceGrade === "<=5" ? "5학년 이하" : `${sourceGrade}학년`,
      score: selectedScore,
      studentsAtScore: row[0],
      gradeParticipants: participants[sourceKey],
      reportedPercentile: row[1],
      percentileType: "reported-in-source-table",
      percentileMethod: "2011 원자료 표에 기재된 해당 점수의 학년 percentile rank",
      population: "2011 AMC 8 South Korea reported participant cohort",
      sourceStatus: "secondary-transcription-primary-capture-pending",
      sourceUrl: sourceUrl
    });
  }

  return Object.freeze({ sourceUrl: sourceUrl, referenceFor: referenceFor });
});
