(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8GlobalGradeScoreReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Counts transcribed from MAA reported tables; totals and rounded means independently reconcile.
  // These historical cohorts are not presented as current norms or validated ability levels.
  const distributions = Object.freeze({
    2009: Object.freeze({
      reportUrl: "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html",
      sourceUrl: "https://www.321ww.org/archiver/tid-4605419.html",
      sourceStatus: "secondary-score-count-transcription-reconciled-to-MAA-report-totals-and-means",
      population: "2009 AMC 8 MAA reported recorded-grade participants across reporting schools",
      gradeGroups: Object.freeze({
        "4-5": Object.freeze({ participants: 3874, mean: 9.45, counts: Object.freeze([16, 12, 46, 108, 192, 270, 325, 393, 386, 389, 318, 322, 241, 215, 177, 151, 89, 77, 49, 38, 22, 13, 11, 8, 4, 2]) }),
        "6": Object.freeze({ participants: 20688, mean: 9.17, counts: Object.freeze([38, 40, 158, 384, 843, 1385, 1955, 2309, 2547, 2408, 2120, 1791, 1370, 1022, 706, 520, 342, 238, 171, 111, 77, 60, 38, 26, 14, 15]) }),
        "7": Object.freeze({ participants: 50218, mean: 10.08, counts: Object.freeze([82, 48, 212, 607, 1304, 2421, 3666, 4664, 5482, 5694, 5545, 4779, 4038, 3053, 2386, 1782, 1327, 959, 722, 461, 366, 241, 162, 106, 73, 38]) }),
        "8": Object.freeze({ participants: 73220, mean: 10.82, counts: Object.freeze([80, 41, 204, 571, 1323, 2540, 4139, 5996, 7063, 7800, 8000, 7226, 6359, 5260, 4162, 3251, 2612, 1955, 1460, 1035, 749, 472, 388, 250, 176, 108]) })
      })
    }),
    2019: Object.freeze({
      reportUrl: "https://bj.xdf.cn/zixun/beimei/97334.html",
      sourceUrl: "https://bj.xdf.cn/zixun/beimei/97334.html",
      sourceStatus: "secondary-transcription-of-MAA-overall-score-grade-report-image-reconciled-to-reported-totals-and-means",
      population: "2019 AMC 8 MAA Overall reported-grade cohort",
      gradeGroups: Object.freeze({
        "<=5": Object.freeze({ participants: 4396, mean: 8.48, counts: Object.freeze([30, 22, 101, 186, 369, 460, 491, 492, 434, 360, 288, 220, 192, 165, 125, 97, 90, 85, 58, 32, 29, 24, 22, 14, 7, 3]) }),
        "6": Object.freeze({ participants: 18245, mean: 8.50, counts: Object.freeze([94, 107, 315, 708, 1260, 1772, 2067, 2153, 1994, 1623, 1347, 1090, 873, 686, 538, 424, 340, 264, 180, 137, 94, 66, 54, 33, 12, 14]) }),
        "7": Object.freeze({ participants: 30327, mean: 9.35, counts: Object.freeze([98, 124, 394, 956, 1611, 2346, 3014, 3095, 3093, 2837, 2448, 2099, 1715, 1361, 1168, 973, 790, 591, 490, 339, 251, 187, 139, 102, 71, 35]) }),
        "8": Object.freeze({ participants: 40167, mean: 10.06, counts: Object.freeze([113, 101, 383, 933, 1636, 2702, 3467, 3870, 4091, 3794, 3238, 2788, 2381, 2081, 1769, 1398, 1182, 1028, 799, 630, 535, 418, 306, 244, 181, 99]) }),
        unknown: Object.freeze({ participants: 1485, mean: 8.09, counts: Object.freeze([70, 10, 26, 56, 122, 143, 136, 168, 150, 105, 129, 76, 71, 59, 39, 31, 23, 25, 16, 12, 9, 3, 2, 2, 2, 0]) })
      })
    })
  });

  function referenceFor(year, grade, score) {
    const selectedYear = Number(year);
    const selectedGrade = Number(grade);
    const selectedScore = Number(score);
    const distribution = distributions[selectedYear];
    if (!distribution || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
    const group = selectedGrade === 4 || selectedGrade === 5 ? (selectedYear === 2019 ? "<=5" : "4-5") : String(selectedGrade);
    const data = distribution.gradeGroups[group];
    if (!data || !Number.isInteger(selectedGrade) || selectedGrade < 4 || selectedGrade > 8) return null;
    const lowerCount = data.counts.slice(0, selectedScore).reduce(function (sum, count) { return sum + count; }, 0);
    return Object.freeze({
      year: selectedYear,
      grade: selectedGrade,
      gradeGroup: group,
      gradeLabel: group === "4-5" || group === "<=5" ? (selectedYear === 2019 ? "5학년 이하" : "4–5학년") : `${group}학년`,
      score: selectedScore,
      participantsAtScore: data.counts[selectedScore],
      gradeParticipants: data.participants,
      strictlyLowerShare: lowerCount / data.participants * 100,
      strictlyLowerCount: lowerCount,
      reportedMean: data.mean,
      population: distribution.population,
      sourceStatus: distribution.sourceStatus,
      sourceUrl: distribution.sourceUrl,
      reportUrl: distribution.reportUrl
    });
  }

  return Object.freeze({ referenceFor: referenceFor });
});
