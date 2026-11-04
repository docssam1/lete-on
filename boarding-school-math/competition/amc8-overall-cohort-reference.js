(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8OverallCohortReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Whole-cohort comparison only. Population labels follow the cited source.
  const sourceUrl = "https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf";
  const rows = Object.freeze({
    2002: ["Global", 157778, 126, null, 11.09, "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary"],
    2003: ["Global", 158309, 192, null, 10.27, "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary"],
    2004: ["Global", 154590, 50, null, 9.94, "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary"],
    2005: ["Global", 143428, 77, 2548, 9.835, "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary"],
    2006: ["Global", 147210, 289, 4428, 10.14, "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary"],
    2007: ["Global", 150618, 129, 3593, 9.87, "https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america"],
    2008: ["Global", 148731, 334, 8575, 11.45, "https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america"],
    2009: ["Global", 150733, 163, 3452, 10.28, "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html"], 2010: ["Global", 153211, 499, 5849, 9.98],
    2011: ["Global", 152745, 284, 6709, 10.76], 2012: ["Global", 151117, 213, 6445, 10.64],
    2013: ["Global", 149709, 369, 6531, 10.70], 2014: ["Global", 144737, 256, 6950, 11.44],
    2015: ["Global", 149844, 94, 2669, 8.55],
    2016: ["United States and Canada", 108227, 268, 3104, 9.36], 2017: ["United States and Canada", 81386, 56, 1185, 9.05],
    2018: ["United States and Canada", 98389, 45, 866, 8.51], 2019: ["United States and Canada", 94634, 151, 2958, 9.43],
    2022: ["MAA Overall reported-grade cohort", 71017, 131, 2404, 9.69],
    // MAA Wisconsin Section reports the U.S. mean, but not the participant count or score-frequency totals.
    2020: ["United States", null, null, null, 10.01, "https://sections.maa.org/wisconsin/news/MAAWINewsFall21v2.pdf"]
  });
  // MAA's 2006 report Table 6 prints every 2005 score count; its weighted mean (9.8451)
  // differs from Table 1's reported 9.835, so expose count-based position with a visible caveat.
  const amc8_2005_score_counts = Object.freeze([385,425,1341,3112,5511,8123,11017,12938,13915,14519,13907,13103,11080,9085,7168,5357,3847,2762,1926,1359,959,657,414,257,184,77]);
  const amc8_2005_source_url = "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary";
  // Table 4 records 0(@) attempted-some and 0($) attempted-none separately; combine only for score lookup.
  const amc8_2006_score_counts = Object.freeze([322,138,569,1630,3826,7038,10772,14390,16567,16925,15879,13547,11211,8615,6447,4874,3656,2725,2052,1599,1227,994,804,661,453,289]);
  const amc8_2006_source_url = "https://studylib.net/doc/28486602/618492772-2006-amc-8-summary";
  // MAA's 2008 report Table 8 lists 2007 and 2008 score counts high-to-low.
  // In 2008, add the 253 explicitly reported no-attempt participants to score 0.
  const amc8_2007_score_counts = Object.freeze([445,556,1509,3309,5830,8507,11387,13619,15047,15643,14906,13338,11020,8849,6870,5061,3969,3068,2371,1721,1263,967,618,391,225,129]);
  const amc8_2008_score_counts = Object.freeze([261,89,369,1050,2517,4829,7642,10532,12816,14285,14783,14132,12473,10608,8749,7291,5824,4729,3964,3213,2581,2068,1612,1253,727,334]);
  const amc8_2007_2008_source_url = "https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america";
  // MAA's 2009 report Table 5 records 0^ (some items attempted) and 0$ (none attempted) separately.
  // Sum these only for score-position lookup; retain both source rows in the CSV transcription.
  const amc8_2009_score_counts = Object.freeze([239,143,637,1718,3785,6819,10372,13730,15885,16691,16350,14457,12244,9719,7560,5782,4428,3269,2424,1663,1231,792,603,392,271,163]);
  const amc8_2009_source_url = "https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html";
  // The 99CEF 2010 report's Global score frequencies reconcile to its 153,211 / 9.98 summary.
  // Its printed 20+ cumulative total is nine higher than the sum of the six displayed score rows.
  const amc8_2010_global_score_counts = Object.freeze([338,180,778,2367,5039,8937,12682,16006,17669,16806,15033,12543,10057,7435,5768,4557,3723,3011,2423,2019,1570,1315,1020,832,604,499]);
  const amc8_2010_source_url = "https://www.99cef.org.tw/userfiles/2010_AMC8_Report.pdf";
  // 99CEF's 2011 Global score table reconciles to its annual summary totals and mean.
  const amc8_2011_global_score_counts = Object.freeze([286,198,791,2119,4366,7255,10196,12755,14166,14510,13964,12984,11386,9863,8361,6771,5632,4364,3418,2651,2086,1619,1249,984,487,284]);
  const amc8_2011_source_url = "https://www.99cef.org.tw/userfiles/2011AMC8Summary.pdf";
  // The contemporary 99CEF 2012 report includes a complete Global score-count table.
  // Keep its distinct source population/results instead of blending in the later retrospective table.
  const amc8_2012_global_score_counts = Object.freeze([335,203,729,1876,3925,6726,10132,13235,15288,15435,14904,13459,11043,8924,7432,6012,4866,4075,3302,2771,2136,1674,1148,760,514,213]);
  const amc8_2012_source_url = "https://www.99cef.org.tw/userfiles/2012_AMC8_Report.pdf";
  // 2013 counts transcribed from the Global column on p.7 of 99CEF's contemporary report.
  const amc8_2013_global_score_counts = Object.freeze([311,261,815,2081,4069,6971,9923,12714,14489,14957,14228,12866,10858,9263,7540,6279,5241,4217,3437,2658,2089,1524,1176,819,554,369]);
  const amc8_2013_source_url = "https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf";
  // 2014 printed p.8 score table sums to 144,177, 560 below the report's overall n=144,737;
  // its weighted frequency mean is 11.462, versus the report's 11.44 overall summary.
  const amc8_2014_global_score_counts = Object.freeze([277,62,182,735,1721,3495,6284,9722,12958,15377,15767,14787,12644,10579,8711,6900,5706,4618,3703,2999,2330,1755,1179,829,601,256]);
  const amc8_2014_source_url = "https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf";
  const amc8_2015_global_score_counts = Object.freeze([576,1067,2954,6213,9973,13178,16240,17112,16185,14464,12280,9561,7363,5660,4201,3169,2471,1912,1447,1149,882,650,463,357,223,94]);
  const amc8_2015_source_url = "https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf";
  const amc8_2017_global_score_counts = Object.freeze([290,438,1279,2823,4574,6377,7704,8518,8231,7760,6964,5907,4935,3950,3151,2429,1852,1430,939,650,379,296,185,154,115,56]);
  const amc8_2017_source_url = "https://www.99cef.org.tw/userfiles/2017AMC8Report.pdf";
  const amc8_2018_global_score_counts = Object.freeze([397,571,1603,3250,5898,8402,10440,11599,11465,10355,8826,7126,5377,3888,2808,1949,1464,972,663,470,283,215,157,96,70,45]);
  const amc8_2018_source_url = "https://www.99cef.org.tw/userfiles/2018AMC8Report.pdf";
  // 99CEF's 2019 report prints the exact U.S./Canada 0–25 counts (n=94,634).
  // The separate MAA grade-group transcription remains in its own file (n=94,620).
  const amc8_2019_global_score_counts = Object.freeze([406,364,1219,2839,4999,7424,9178,9778,9765,8719,7453,6273,5233,4352,3641,2923,2425,1992,1543,1150,918,698,523,395,273,151]);
  const amc8_2019_source_url = "https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf";
  const amc8_2022_overall_score_counts = Object.freeze([2528,484,965,1863,3116,4232,5156,5982,6300,6130,5887,5274,4544,3946,3198,2669,2186,1760,1315,1078,790,599,401,290,193,131]);
  const amc8_2022_source_url = "https://yach-doc-shimo.zhiyinlou.com/uploader/f/Ua2Ju3KZtSXEM7uP.png";

  function referenceFor(year, score) {
    const values = rows[Number(year)];
    const points = Number(score);
    if (!values || !Number.isInteger(points) || points < 0 || points > 25) return null;
    const selectedYear = Number(year);
    const scoreCountData = selectedYear === 2005 ? amc8_2005_score_counts
      : selectedYear === 2006 ? amc8_2006_score_counts
      : selectedYear === 2007 ? amc8_2007_score_counts
      : selectedYear === 2008 ? amc8_2008_score_counts
      : selectedYear === 2009 ? amc8_2009_score_counts
      : selectedYear === 2010 ? amc8_2010_global_score_counts
      : selectedYear === 2011 ? amc8_2011_global_score_counts
      : selectedYear === 2012 ? amc8_2012_global_score_counts
      : selectedYear === 2013 ? amc8_2013_global_score_counts
      : selectedYear === 2014 ? amc8_2014_global_score_counts
      : selectedYear === 2015 ? amc8_2015_global_score_counts
      : selectedYear === 2017 ? amc8_2017_global_score_counts
      : selectedYear === 2018 ? amc8_2018_global_score_counts
      : selectedYear === 2019 ? amc8_2019_global_score_counts
      : selectedYear === 2022 ? amc8_2022_overall_score_counts : null;
    const distributionParticipants = scoreCountData ? scoreCountData.reduce(function (sum, count) { return sum + count; }, 0) : null;
    const strictlyLowerShare = scoreCountData
      ? scoreCountData.slice(0, points).reduce(function (sum, count) { return sum + count; }, 0) / distributionParticipants * 100
      : null;
    return Object.freeze({ year: selectedYear, population: values[0], participants: values[1], perfectScores: values[2],
      scoreAtLeast20: values[3], meanScore: values[4], learnerScore: points, differenceFromMean: points - values[4],
      strictlyLowerShare: strictlyLowerShare, distributionParticipants: distributionParticipants, scoreAtLearner: scoreCountData ? scoreCountData[points] : null,
      sourceUrl: selectedYear === 2005 ? amc8_2005_source_url
        : selectedYear === 2006 ? amc8_2006_source_url
        : selectedYear === 2007 || selectedYear === 2008 ? amc8_2007_2008_source_url
        : selectedYear === 2009 ? amc8_2009_source_url
        : selectedYear === 2010 ? amc8_2010_source_url
        : selectedYear === 2011 ? amc8_2011_source_url
        : selectedYear === 2012 ? amc8_2012_source_url
        : selectedYear === 2013 ? amc8_2013_source_url
        : selectedYear === 2014 ? amc8_2014_source_url
        : selectedYear === 2015 ? amc8_2015_source_url
        : selectedYear === 2017 ? amc8_2017_source_url
        : selectedYear === 2018 ? amc8_2018_source_url
        : selectedYear === 2019 ? amc8_2019_source_url
        : selectedYear === 2022 ? amc8_2022_source_url : values[5] || sourceUrl });
  }

  return Object.freeze({ referenceFor: referenceFor });
});
