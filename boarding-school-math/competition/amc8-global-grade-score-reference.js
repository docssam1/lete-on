(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8GlobalGradeScoreReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Counts transcribed from the reported 2009 MAA table; the annual-report grade totals and
  // means independently reconcile all four columns. The source does not publish this as a norm.
  const gradeGroups = Object.freeze({
    "4-5": Object.freeze({ participants: 3874, mean: 9.45, counts: Object.freeze([16, 12, 46, 108, 192, 270, 325, 393, 386, 389, 318, 322, 241, 215, 177, 151, 89, 77, 49, 38, 22, 13, 11, 8, 4, 2]) }),
    "6": Object.freeze({ participants: 20688, mean: 9.17, counts: Object.freeze([38, 40, 158, 384, 843, 1385, 1955, 2309, 2547, 2408, 2120, 1791, 1370, 1022, 706, 520, 342, 238, 171, 111, 77, 60, 38, 26, 14, 15]) }),
    "7": Object.freeze({ participants: 50218, mean: 10.08, counts: Object.freeze([82, 48, 212, 607, 1304, 2421, 3666, 4664, 5482, 5694, 5545, 4779, 4038, 3053, 2386, 1782, 1327, 959, 722, 461, 366, 241, 162, 106, 73, 38]) }),
    "8": Object.freeze({ participants: 73220, mean: 10.82, counts: Object.freeze([80, 41, 204, 571, 1323, 2540, 4139, 5996, 7063, 7800, 8000, 7226, 6359, 5260, 4162, 3251, 2612, 1955, 1460, 1035, 749, 472, 388, 250, 176, 108]) })
  });
  const sourceUrl = "https://www.321ww.org/archiver/tid-4605419.html";
  const reportUrl = "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html";

  function referenceFor(year, grade, score) {
    const selectedYear = Number(year);
    const selectedGrade = Number(grade);
    const selectedScore = Number(score);
    if (selectedYear !== 2009 || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
    const group = selectedGrade === 4 || selectedGrade === 5 ? "4-5" : String(selectedGrade);
    const data = gradeGroups[group];
    if (!data || !Number.isInteger(selectedGrade) || selectedGrade < 4 || selectedGrade > 8) return null;
    const lowerCount = data.counts.slice(0, selectedScore).reduce(function (sum, count) { return sum + count; }, 0);
    return Object.freeze({
      year: 2009,
      grade: selectedGrade,
      gradeGroup: group,
      gradeLabel: group === "4-5" ? "4–5학년" : `${group}학년`,
      score: selectedScore,
      participantsAtScore: data.counts[selectedScore],
      gradeParticipants: data.participants,
      strictlyLowerShare: lowerCount / data.participants * 100,
      strictlyLowerCount: lowerCount,
      reportedMean: data.mean,
      population: "2009 AMC 8 MAA reported recorded-grade participants across reporting schools",
      sourceStatus: "secondary-score-count-transcription-reconciled-to-MAA-report-totals-and-means",
      sourceUrl: sourceUrl,
      reportUrl: reportUrl
    });
  }

  return Object.freeze({ sourceUrl: sourceUrl, reportUrl: reportUrl, referenceFor: referenceFor });
});
