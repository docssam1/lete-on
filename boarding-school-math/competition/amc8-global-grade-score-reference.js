(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8GlobalGradeScoreReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Counts transcribed from tables labeled as MAA reports; the 2022 image is a secondary repost.
  // Totals and rounded means reconcile to the corresponding report tables.
  // These historical cohorts are not presented as current norms or validated ability levels.
  const distributions = Object.freeze({
    2006: Object.freeze({
      reportUrl: "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary",
      sourceUrl: "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary",
      sourceStatus: "secondary-transcription-of-MAA-annual-report-grade-score-table-reconciled-to-counts-and-means",
      population: "2006 AMC 8 MAA annual-report recorded-grade participants; international schools are included in the report cohort",
      gradeGroups: Object.freeze({
        "4-5": Object.freeze({ participants: 1853, mean: 8.21, counts: Object.freeze([7,12,42,76,148,200,216,248,193,190,126,84,73,46,41,31,20,20,18,9,16,9,11,8,5,4]) }),
        "6": Object.freeze({ participants: 16639, mean: 8.51, counts: Object.freeze([30,33,151,341,822,1376,1962,2247,2263,2019,1604,1194,834,555,343,240,172,117,87,62,60,35,37,28,15,12]) }),
        "7": Object.freeze({ participants: 48479, mean: 9.82, counts: Object.freeze([119,40,173,610,1402,2533,3887,5150,5935,5734,5347,4275,3449,2526,1846,1382,1044,711,599,464,349,284,229,187,129,75]) }),
        "8": Object.freeze({ participants: 78038, mean: 10.75, counts: Object.freeze([134,48,188,574,1380,2811,4542,6537,7929,8721,8562,7796,6704,5363,4134,3153,2370,1840,1326,1033,787,652,521,431,304,198]) })
      })
    }),
    2007: Object.freeze({
      reportUrl: "https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards",
      sourceUrl: "https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards",
      sourceStatus: "secondary-transcription-of-MAA-annual-report-grade-score-table-reconciled-to-counts-and-means",
      population: "2007 AMC 8 MAA annual-report recorded-grade participants; domestic/international scope not distinguished in grade table",
      gradeGroups: Object.freeze({
        "4-5": Object.freeze({ participants: 3170, mean: 8.48, counts: Object.freeze([57, 27, 99, 166, 229, 286, 308, 311, 268, 253, 222, 210, 174, 144, 100, 78, 65, 53, 39, 31, 21, 11, 9, 5, 2, 2]) }),
        "6": Object.freeze({ participants: 18687, mean: 8.19, counts: Object.freeze([72, 162, 433, 835, 1313, 1709, 2093, 2241, 2091, 1831, 1563, 1169, 904, 653, 451, 355, 242, 163, 125, 92, 65, 47, 31, 27, 13, 7]) }),
        "7": Object.freeze({ participants: 49594, mean: 9.51, counts: Object.freeze([127, 185, 523, 1193, 2064, 3132, 4161, 4868, 5247, 5318, 4908, 4350, 3470, 2650, 2040, 1508, 1129, 804, 625, 400, 313, 233, 152, 104, 58, 32]) }),
        "8": Object.freeze({ participants: 76907, mean: 10.60, counts: Object.freeze([158, 168, 423, 1061, 2111, 3227, 4633, 6008, 7182, 8006, 7973, 7435, 6323, 5268, 4192, 3058, 2488, 2019, 1569, 1175, 855, 667, 420, 253, 150, 85]) })
      })
    }),
    2008: Object.freeze({
      reportUrl: "https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america",
      sourceUrl: "https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america",
      sourceStatus: "secondary-transcription-of-MAA-annual-report-grade-score-table-reconciled-to-counts-and-means",
      population: "2008 AMC 8 MAA annual-report recorded-grade participants; domestic/international scope not distinguished in grade table",
      gradeGroups: Object.freeze({
        "4-5": Object.freeze({ participants: 2698, mean: 10.75, counts: Object.freeze([6, 4, 14, 51, 108, 140, 201, 237, 227, 241, 199, 198, 183, 164, 132, 133, 107, 95, 69, 48, 46, 35, 38, 14, 7, 1]) }),
        "6": Object.freeze({ participants: 19726, mean: 9.88, counts: Object.freeze([46, 18, 94, 279, 589, 1141, 1542, 2073, 2224, 2219, 2035, 1765, 1430, 1062, 787, 598, 489, 329, 271, 219, 159, 142, 88, 62, 40, 25]) }),
        "7": Object.freeze({ participants: 48889, mean: 11.18, counts: Object.freeze([88, 26, 134, 360, 870, 1629, 2673, 3617, 4569, 5063, 4975, 4737, 4092, 3400, 2729, 2203, 1766, 1425, 1179, 926, 774, 574, 439, 355, 196, 90]) }),
        "8": Object.freeze({ participants: 75002, mean: 12.07, counts: Object.freeze([99, 39, 119, 344, 915, 1855, 3101, 4421, 5587, 6515, 7309, 7191, 6534, 5828, 4978, 4229, 3354, 2809, 2395, 1986, 1572, 1284, 1028, 813, 480, 217]) })
      })
    }),
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
    }),
    2022: Object.freeze({
      reportUrl: "https://www.think-matrix.com/math_planet/awards_setting_and_historical_result",
      sourceUrl: "https://yach-doc-shimo.zhiyinlou.com/uploader/f/Ua2Ju3KZtSXEM7uP.png",
      sourceStatus: "secondary-reproduction-of-MAA-overall-score-grade-report-image-visually-transcribed-and-reconciled-to-grade-means",
      population: "2022 AMC 8 MAA Overall reported-grade cohort",
      gradeGroups: Object.freeze({
        "<=5": Object.freeze({ participants: 4336, mean: 8.96, counts: Object.freeze([253,45,98,175,240,304,379,351,333,345,276,245,238,211,164,155,151,117,81,63,52,26,18,12,1,3]) }),
        "6": Object.freeze({ participants: 14258, mean: 8.78, counts: Object.freeze([573,125,249,547,846,1058,1196,1407,1369,1180,1125,970,805,626,545,405,336,288,186,150,104,70,38,31,22,7]) }),
        "7": Object.freeze({ participants: 22493, mean: 9.57, counts: Object.freeze([793,171,304,573,1003,1330,1650,1931,2067,2080,1907,1672,1408,1235,978,834,669,517,375,336,204,183,112,92,47,22]) }),
        "8": Object.freeze({ participants: 29236, mean: 10.38, counts: Object.freeze([869,138,294,541,994,1470,1868,2218,2451,2466,2524,2348,2056,1839,1495,1264,1019,832,669,524,429,319,233,155,122,99]) }),
        unknown: Object.freeze({ participants: 694, mean: 7.87, counts: Object.freeze([40,5,20,27,33,70,63,75,80,59,55,39,37,35,16,11,11,6,4,5,1,1,0,0,1,0]) })
      })
    })
  });

  function referenceFor(year, grade, score) {
    const selectedYear = Number(year);
    const selectedGrade = Number(grade);
    const selectedScore = Number(score);
    const distribution = distributions[selectedYear];
    if (!distribution || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
    const group = selectedGrade === 4 || selectedGrade === 5 ? ([2019, 2022].includes(selectedYear) ? "<=5" : "4-5") : String(selectedGrade);
    const data = distribution.gradeGroups[group];
    if (!data || !Number.isInteger(selectedGrade) || selectedGrade < 4 || selectedGrade > 8) return null;
    const lowerCount = data.counts.slice(0, selectedScore).reduce(function (sum, count) { return sum + count; }, 0);
    return Object.freeze({
      year: selectedYear,
      grade: selectedGrade,
      gradeGroup: group,
      gradeLabel: group === "4-5" || group === "<=5" ? (selectedYear === 2019 ? "5학년 이하" : selectedYear === 2022 ? "5학년 이하" : "4–5학년") : `${group}학년`,
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

  function comparisonFor(year, grade, score) {
    const selectedYear = Number(year);
    const selectedGrade = Number(grade);
    const selectedScore = Number(score);
    const distribution = distributions[selectedYear];
    if (!distribution || !Number.isInteger(selectedGrade) || selectedGrade < 4 || selectedGrade > 8 || !Number.isInteger(selectedScore) || selectedScore < 0 || selectedScore > 25) return null;
    const selectedGroup = selectedGrade === 4 || selectedGrade === 5 ? ([2019, 2022].includes(selectedYear) ? "<=5" : "4-5") : String(selectedGrade);
    const rows = Object.keys(distribution.gradeGroups).filter(function (group) { return group !== "unknown"; }).sort(function (left, right) {
      const leftOrder = left === "4-5" || left === "<=5" ? 5 : Number(left);
      const rightOrder = right === "4-5" || right === "<=5" ? 5 : Number(right);
      return leftOrder - rightOrder;
    }).map(function (group) {
      const data = distribution.gradeGroups[group];
      const lowerCount = data.counts.slice(0, selectedScore).reduce(function (sum, count) { return sum + count; }, 0);
      const gradeLabel = group === "4-5" || group === "<=5" ? (group === "4-5" ? "4–5학년" : "5학년 이하") : `${group}학년`;
      return Object.freeze({
        gradeGroup: group,
        gradeLabel: gradeLabel,
        selected: group === selectedGroup,
        strictlyLowerCount: lowerCount,
        strictlyLowerShare: lowerCount / data.participants * 100,
        gradeParticipants: data.participants,
        reportedMean: data.mean
      });
    });
    return Object.freeze({
      year: selectedYear,
      score: selectedScore,
      population: distribution.population,
      sourceUrl: distribution.sourceUrl,
      reportUrl: distribution.reportUrl,
      rows: Object.freeze(rows)
    });
  }

  return Object.freeze({ referenceFor: referenceFor, comparisonFor: comparisonFor });
});
