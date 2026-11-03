(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCScoreDistributionReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Transcribed from MAA's public K-12 EduView Score Distribution reports.
  // Thresholds are for the selected exam/form and report sample, not grade norms.
  const base = "https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561";
  const entry = function (values) {
    const record = Object.assign({}, values);
    record.sourceUrl = record.sourceUrl || `${base}&schoolyear=${record.schoolYear}&amccomp=${record.contestId}&viewClicked=true`;
    return Object.freeze(record);
  };
  const entries = Object.freeze({
    amc8: Object.freeze({
      // Older MAA report rows survive as third-party mirrors; preserve the values printed there.
      // Neither year includes the 2.5% or 10% columns, so those cut lines remain unavailable.
      "2018": entry({ top1: 19, top5: 15, top25: 11, top50: 8, top75: 6, average: 8.51, standardDeviation: 3.68, students: 98448, schools: 1844, sourceNote: "MAA Contest Score Report PDF의 제3자 재게시본입니다. 보고서 표본의 지역·포함 범위는 확인하지 못해, 인쇄된 수치만 옮겼습니다. 현재 규준이나 학년별 기준은 아닙니다.", sourceUrl: "https://www.mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf" }),
      "2019": entry({ top1: 23, top5: 19, top25: 12, top50: 9, top75: 6, average: 9.43, standardDeviation: 4.46, students: 94675, schools: 1869, reportAsOf: "2020-01-01", sourceNote: "MAA AMC 8 Contest Score Report 이미지의 제3자 재게시본입니다. 별도 재인용 자료와 응시자 수가 다르므로 이 보고서 표본 수치만 보존합니다. 현재 규준이나 학년별 기준은 아닙니다.", sourceUrl: "https://www.ivytrack.com/forum.php?mod=viewthread&tid=19238" }),
      // 2022 report image is a secondary-hosted copy of an MAA report, data as of 2023-02-25.
      // It omits the 2.5% and 10% columns; leave those thresholds unavailable.
      "2022": entry({ top1: 22, top5: 19, top25: 13, top50: 9, top75: 6, average: 9.69, standardDeviation: 4.84, students: 71143, schools: 1759, reportAsOf: "2023-02-25", sourceNote: "MAA 점수 보고서 이미지는 제3자 페이지에 재게시된 자료예요. 원자료에 응시 모집단 설명이 없어, 표본 범위를 다른 전체 응시 통계와 합치지 않습니다.", sourceUrl: "https://www.sohu.com/a/695186451_121124027" }),
      "2023": entry({ top1: 21, top2_5: 19, top5: 17, top10: 15, top25: 13, top50: 10, top75: 7, average: 10.26, standardDeviation: 3.92, students: 74380, schools: 1909, schoolYear: 2023, contestId: 31265 }),
      "2024": entry({ top1: 22, top2_5: 20, top5: 18, top10: 16, top25: 13, top50: 10, top75: 8, average: 10.75, standardDeviation: 4.13, students: 80725, schools: 2053, schoolYear: 2024, contestId: 37433 }),
      "2025": entry({ top1: 23, top2_5: 21, top5: 19, top10: 17, top25: 14, top50: 11, top75: 9, average: 11.74, standardDeviation: 4.29, students: 79524, schools: 2027, schoolYear: 2025, contestId: 53956 }),
      "2026": entry({ top1: 24, top2_5: 23, top5: 21, top10: 19, top25: 16, top50: 12, top75: 9, average: 12.42, standardDeviation: 4.72, students: 80983, schools: 2129, schoolYear: 2026, contestId: 81060 })
    }),
    amc10: Object.freeze({
      "2022A": entry({ top1: 120, top2_5: 109.5, top5: 99, top10: 88.5, top25: 69, top50: 54, top75: 43.5, average: 58.32, standardDeviation: 21.34, students: 27411, schools: 1654, schoolYear: 2023, contestId: 31266 }),
      "2022B": entry({ top1: 114, top2_5: 106.5, top5: 100.5, top10: 90, top25: 73.5, top50: 54, top75: 40.5, average: 57.91, standardDeviation: 22.48, students: 22885, schools: 1637, schoolYear: 2023, contestId: 31267 }),
      "2023A": entry({ top1: 136.5, top2_5: 123, top5: 111, top10: 97.5, top25: 78, top50: 60, top75: 48, average: 64.74, standardDeviation: 23.96, students: 30043, schools: 1876, schoolYear: 2024, contestId: 37434 }),
      "2023B": entry({ top1: 135, top2_5: 123, top5: 112.5, top10: 100.5, top25: 82.5, top50: 60, top75: 42, average: 64.12, standardDeviation: 26.78, students: 22912, schools: 1572, schoolYear: 2024, contestId: 37435 }),
      "2024A": entry({ top1: 132, top2_5: 118.5, top5: 105, top10: 88.5, top25: 69, top50: 54, top75: 42, average: 58.01, standardDeviation: 23.10, students: 30545, schools: 1877, schoolYear: 2025, contestId: 53664 }),
      "2024B": entry({ top1: 138, top2_5: 126, top5: 114, top10: 99, top25: 76.5, top50: 57, top75: 42, average: 61.78, standardDeviation: 26.48, students: 23372, schools: 1557, schoolYear: 2025, contestId: 53951 }),
      "2025A": entry({ top1: 150, top2_5: 141, top5: 124.5, top10: 94.5, top25: 69, top50: 51, top75: 39, average: 57.12, standardDeviation: 25.86, students: 31600, schools: 1956, schoolYear: 2026, contestId: 81054 }),
      "2025B": entry({ top1: 133.5, top2_5: 120, top5: 105, top10: 87, top25: 66, top50: 51, top75: 42, average: 56.99, standardDeviation: 22.69, students: 25204, schools: 1715, schoolYear: 2026, contestId: 81055 })
    }),
    amc12: Object.freeze({
      "2022A": entry({ top1: 126, top2_5: 115.5, top5: 106.5, top10: 96, top25: 73.5, top50: 55.5, top75: 42, average: 59.90, standardDeviation: 24.09, students: 19393, schools: 1542, schoolYear: 2023, contestId: 31268 }),
      "2022B": entry({ top1: 129, top2_5: 117, top5: 103.5, top10: 90, top25: 70.5, top50: 52.5, top75: 40.5, average: 57.33, standardDeviation: 23.59, students: 18073, schools: 1627, schoolYear: 2023, contestId: 31269 }),
      "2023A": entry({ top1: 136.5, top2_5: 126, top5: 112.5, top10: 96, top25: 73.5, top50: 55.5, top75: 45, average: 61.57, standardDeviation: 24.31, students: 21937, schools: 1769, schoolYear: 2024, contestId: 37437 }),
      "2023B": entry({ top1: 139.5, top2_5: 127.5, top5: 114, top10: 99, top25: 76.5, top50: 55.5, top75: 43.5, average: 62.54, standardDeviation: 25.75, students: 16655, schools: 1573, schoolYear: 2024, contestId: 37436 }),
      "2024A": entry({ top1: 133.5, top2_5: 123, top5: 108, top10: 88.5, top25: 66, top50: 51, top75: 42, average: 56.50, standardDeviation: 23.22, students: 21222, schools: 1734, schoolYear: 2025, contestId: 53952 }),
      "2024B": entry({ top1: 139.5, top2_5: 132, top5: 118.5, top10: 100.5, top25: 75, top50: 54, top75: 43.5, average: 61.72, standardDeviation: 26.32, students: 16522, schools: 1541, schoolYear: 2025, contestId: 53953 }),
      "2025A": entry({ top1: 150, top2_5: 141, top5: 127.5, top10: 106.5, top25: 78, top50: 55.5, top75: 45, average: 64.42, standardDeviation: 28.16, students: 20429, schools: 1838, schoolYear: 2026, contestId: 81057 }),
      "2025B": entry({ top1: 145.5, top2_5: 139.5, top5: 127.5, top10: 109.5, top25: 81, top50: 58.5, top75: 45, average: 65.96, standardDeviation: 28.66, students: 16432, schools: 1699, schoolYear: 2026, contestId: 81058 })
    })
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
  function referenceFor(programId, year, form) {
    const program = entries[programId];
    if (!program) return null;
    const key = programId === "amc8" ? String(Number(year)) : `${Number(year)}${String(form || "").toUpperCase()}`;
    return program[key] || null;
  }
  return Object.freeze({ sourceUrl: base, entries: entries, bands: bands, referenceFor: referenceFor });
});
