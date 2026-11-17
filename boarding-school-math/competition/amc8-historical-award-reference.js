(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8HistoricalAwardReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const sourceUrl = "https://ivyleaguecenter.org/2016/10/12/amc-8-historical-results-from-2011-to-2015/";
  const maaReportBase = "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561";
  const entries = Object.freeze({
    2003: [18, 22], 2004: [17, 21], 2005: [16, 20], 2006: [17, 21], 2007: [17, 21],
    2008: [19, 22], 2009: [17, 20], 2010: [17, 22], 2011: [17, 22], 2012: [18, 22],
    2013: [18, 22], 2014: [19, 23], 2015: [16, 21], 2016: [18, 22], 2017: [17, 20],
    2018: [15, 19], 2019: [19, 23], 2020: [18, 21], 2022: [19, 22],
    2023: [17, 21], 2024: [18, 22], 2025: [19, 23], 2026: [21, 24]
  });
  const maaReportIds = Object.freeze({ 2023: [2023, 31265], 2024: [2024, 37433], 2025: [2025, 53956], 2026: [2026, 81060] });

  function referenceFor(year) {
    const selectedYear = Number(year);
    const scores = entries[selectedYear];
    if (!scores) return null;
    const report = maaReportIds[selectedYear];
    return Object.freeze({
      year: selectedYear,
      honorRollTop5: scores[0],
      distinguishedHonorRollTop1: scores[1],
      population: "MAA national AMC 8 cohort",
      sourceStatus: report ? "MAA-K12-EduView-score-distribution-report" : "secondary-historical-table",
      sourceUrl: report ? `${maaReportBase}&schoolyear=${report[0]}&amccomp=${report[1]}&viewClicked=true` : sourceUrl
    });
  }

  return Object.freeze({ entries: entries, sourceUrl: sourceUrl, referenceFor: referenceFor });
});
