(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8OverallCohortReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Whole-cohort comparison only. Population labels follow the cited source.
  const sourceUrl = "https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf";
  const rows = Object.freeze({
    2005: ["Global", 143428, 77, 2548, 9.84], 2006: ["Global", 147210, 289, 4428, 10.14],
    2007: ["Global", 150618, 129, 3593, 9.87], 2008: ["Global", 148731, 329, 8513, 11.45],
    2009: ["Global", 150733, 163, 3450, 10.28], 2010: ["Global", 153211, 499, 5849, 9.98],
    2011: ["Global", 152745, 284, 6709, 10.76], 2012: ["Global", 151117, 213, 6445, 10.64],
    2013: ["Global", 149709, 369, 6531, 10.70], 2014: ["Global", 144737, 256, 6950, 11.44],
    2015: ["Global", 149844, 94, 2669, 8.55],
    2016: ["United States and Canada", 108227, 268, 3104, 9.36], 2017: ["United States and Canada", 81386, 56, 1185, 9.05],
    2018: ["United States and Canada", 98389, 45, 866, 8.51], 2019: ["United States and Canada", 94634, 151, 2958, 9.43],
    // MAA Wisconsin Section reports the U.S. mean, but not the participant count or score-frequency totals.
    2020: ["United States", null, null, null, 10.01, "https://sections.maa.org/wisconsin/news/MAAWINewsFall21v2.pdf"]
  });
  // The contemporary 99CEF 2012 report includes a complete Global score-count table.
  // Keep its distinct source population/results instead of blending in the later retrospective table.
  const amc8_2012_global_score_counts = Object.freeze([335,203,729,1876,3925,6726,10132,13235,15288,15435,14904,13459,11043,8924,7432,6012,4866,4075,3302,2771,2136,1674,1148,760,514,213]);
  const amc8_2012_source_url = "https://www.99cef.org.tw/userfiles/2012_AMC8_Report.pdf";
  // 2013 counts transcribed from the Global column on p.7 of 99CEF's contemporary report.
  const amc8_2013_global_score_counts = Object.freeze([311,261,815,2081,4069,6971,9923,12714,14489,14957,14228,12866,10858,9263,7540,6279,5241,4217,3437,2658,2089,1524,1176,819,554,369]);
  const amc8_2013_source_url = "https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf";
  // 2014 p.7 score table sums to 144,177, 560 below the report's overall n=144,737.
  const amc8_2014_global_score_counts = Object.freeze([277,62,182,735,1721,3495,6284,9722,12958,15377,15767,14787,12644,10579,8711,6900,5706,4618,3703,2999,2330,1755,1179,829,601,256]);
  const amc8_2014_source_url = "https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf";
  const amc8_2015_global_score_counts = Object.freeze([576,1067,2954,6213,9973,13178,16240,17112,16185,14464,12280,9561,7363,5660,4201,3169,2471,1912,1447,1149,882,650,463,357,223,94]);
  const amc8_2015_source_url = "https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf";

  function referenceFor(year, score) {
    const values = rows[Number(year)];
    const points = Number(score);
    if (!values || !Number.isInteger(points) || points < 0 || points > 25) return null;
    const selectedYear = Number(year);
    const scoreCountData = selectedYear === 2012 ? amc8_2012_global_score_counts
      : selectedYear === 2013 ? amc8_2013_global_score_counts
      : selectedYear === 2014 ? amc8_2014_global_score_counts
      : selectedYear === 2015 ? amc8_2015_global_score_counts : null;
    const distributionParticipants = scoreCountData ? scoreCountData.reduce(function (sum, count) { return sum + count; }, 0) : null;
    const strictlyLowerShare = scoreCountData
      ? scoreCountData.slice(0, points).reduce(function (sum, count) { return sum + count; }, 0) / distributionParticipants * 100
      : null;
    return Object.freeze({ year: selectedYear, population: values[0], participants: values[1], perfectScores: values[2],
      scoreAtLeast20: values[3], meanScore: values[4], learnerScore: points, differenceFromMean: points - values[4],
      strictlyLowerShare: strictlyLowerShare, distributionParticipants: distributionParticipants, scoreAtLearner: scoreCountData ? scoreCountData[points] : null,
      sourceUrl: selectedYear === 2012 ? amc8_2012_source_url
        : selectedYear === 2013 ? amc8_2013_source_url
        : selectedYear === 2014 ? amc8_2014_source_url
        : selectedYear === 2015 ? amc8_2015_source_url : values[5] || sourceUrl });
  }

  return Object.freeze({ referenceFor: referenceFor });
});
