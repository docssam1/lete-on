(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAimeScoreDistributionReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Transcribed from MAA's public K-12 EduView Score Distribution report. These are
  // same-exam cohort thresholds, not grade-specific percentiles or a placement scale.
  const sourceUrl = "https://maa.edvistas.com/eduview/report.aspx?view=1561&mode=6";
  const entries = Object.freeze({
    "2023I": Object.freeze({ top1: 13, top2_5: 11, top5: 10, top10: 8, top25: 6, top50: 4, top75: 2, average: 4.28, standardDeviation: 2.81, students: 5853, schools: 1108 }),
    "2023II": Object.freeze({ top1: 13, top2_5: 11, top5: 9, top10: 8, top25: 5, top50: 4, top75: 3, average: 4.40, standardDeviation: 2.47, students: 696, schools: 191 }),
    "2024I": Object.freeze({ top1: 14, top2_5: 13, top5: 12, top10: 10, top25: 8, top50: 5, top75: 4, average: 5.89, standardDeviation: 3.15, students: 5571, schools: 1114 }),
    "2024II": Object.freeze({ top1: 14, top2_5: 11, top5: 10, top10: 9, top25: 7, top50: 5, top75: 4, average: 5.45, standardDeviation: 2.75, students: 1152, schools: 251 }),
    "2025I": Object.freeze({ top1: 13, top2_5: 12, top5: 11, top10: 10, top25: 8, top50: 6, top75: 4, average: 6.16, standardDeviation: 3.10, students: 4690, schools: 929 }),
    "2025II": Object.freeze({ top1: 13, top2_5: 12, top5: 12, top10: 11, top25: 8, top50: 6, top75: 4, average: 6.24, standardDeviation: 3.23, students: 1518, schools: 433 }),
    "2026I": Object.freeze({ top1: 14, top2_5: 14, top5: 13, top10: 11, top25: 9, top50: 6, top75: 4, average: 6.26, standardDeviation: 3.58, students: 4747, schools: 1063 }),
    "2026II": Object.freeze({ top1: 15, top2_5: 14, top5: 13, top10: 12, top25: 9, top50: 6, top75: 3, average: 6.55, standardDeviation: 3.90, students: 673, schools: 228 })
  });
  const bands = Object.freeze([
    Object.freeze({ id: "top1", label: "상위 1% 기준" }),
    Object.freeze({ id: "top2_5", label: "상위 2.5% 기준" }),
    Object.freeze({ id: "top5", label: "상위 5% 기준" }),
    Object.freeze({ id: "top10", label: "상위 10% 기준" }),
    Object.freeze({ id: "top25", label: "상위 25% 기준" }),
    Object.freeze({ id: "top50", label: "상위 50% 기준" }),
    Object.freeze({ id: "top75", label: "상위 75% 기준" })
  ]);
  function referenceFor(year, form) { return entries[`${Number(year)}${String(form || "").toUpperCase()}`] || null; }
  return Object.freeze({ sourceUrl: sourceUrl, entries: entries, bands: bands, referenceFor: referenceFor });
});
