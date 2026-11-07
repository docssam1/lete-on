(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCFallGradePercentileReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const rows = Object.freeze([
    { year: 2021, administration: "fall", program: "amc10", form: "A", canonicalForm: "C", grade: 7, percentile: 50, scoreThreshold: 61.5, reportedCumulativePercent: 52.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55866.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "A", canonicalForm: "C", grade: 7, percentile: 75, scoreThreshold: 78.0, reportedCumulativePercent: 76.47, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55866.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "A", canonicalForm: "C", grade: 7, percentile: 90, scoreThreshold: 90.0, reportedCumulativePercent: 90.34, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55866.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "A", canonicalForm: "C", grade: 7, percentile: 95, scoreThreshold: 97.5, reportedCumulativePercent: 95.28, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55866.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "A", canonicalForm: "C", grade: 7, percentile: 99, scoreThreshold: 114.0, reportedCumulativePercent: 99.12, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55866.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "B", canonicalForm: "D", grade: 7, percentile: 50, scoreThreshold: 58.5, reportedCumulativePercent: 51.73, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55869.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "B", canonicalForm: "D", grade: 7, percentile: 75, scoreThreshold: 73.5, reportedCumulativePercent: 75.50, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55869.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "B", canonicalForm: "D", grade: 7, percentile: 90, scoreThreshold: 90.0, reportedCumulativePercent: 90.03, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55869.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "B", canonicalForm: "D", grade: 7, percentile: 95, scoreThreshold: 99.0, reportedCumulativePercent: 95.82, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55869.jpg" },
    { year: 2021, administration: "fall", program: "amc10", form: "B", canonicalForm: "D", grade: 7, percentile: 99, scoreThreshold: 114.0, reportedCumulativePercent: 99.27, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55869.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "A", canonicalForm: "C", grade: 7, percentile: 50, scoreThreshold: 78.0, reportedCumulativePercent: 52.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55849.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "A", canonicalForm: "C", grade: 7, percentile: 75, scoreThreshold: 87.0, reportedCumulativePercent: 76.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55849.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "A", canonicalForm: "C", grade: 7, percentile: 90, scoreThreshold: 96.0, reportedCumulativePercent: 96.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55849.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "A", canonicalForm: "C", grade: 7, percentile: 95, scoreThreshold: 96.0, reportedCumulativePercent: 96.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55849.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "A", canonicalForm: "C", grade: 7, percentile: 99, scoreThreshold: 115.5, reportedCumulativePercent: 100.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55848.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "B", canonicalForm: "D", grade: 7, percentile: 50, scoreThreshold: 64.5, reportedCumulativePercent: 53.20, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55851.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "B", canonicalForm: "D", grade: 7, percentile: 75, scoreThreshold: 76.5, reportedCumulativePercent: 80.86, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55851.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "B", canonicalForm: "D", grade: 7, percentile: 90, scoreThreshold: 84.0, reportedCumulativePercent: 91.49, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55851.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "B", canonicalForm: "D", grade: 7, percentile: 95, scoreThreshold: 94.5, reportedCumulativePercent: 95.75, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55851.jpg" },
    { year: 2021, administration: "fall", program: "amc12", form: "B", canonicalForm: "D", grade: 7, percentile: 99, scoreThreshold: 100.5, reportedCumulativePercent: 100.00, population: "MAA chart Location: Overall; geographic scope not stated", sourceUrl: "https://www.testdaily.cn/55839/", sourceChart: "55851.jpg" }
  ].map(Object.freeze));
  function referenceFor(program, year, canonicalForm, grade) {
    const paper = rows.filter(function (row) {
      return row.program === String(program || "").toLowerCase() && row.year === Number(year) &&
        row.canonicalForm === String(canonicalForm || "").toUpperCase() && row.grade === Number(grade);
    });
    if (!paper.length) return null;
    return Object.freeze({
      year: paper[0].year, administration: paper[0].administration, program: paper[0].program,
      form: paper[0].form, canonicalForm: paper[0].canonicalForm, grade: paper[0].grade,
      population: paper[0].population, sourceUrl: paper[0].sourceUrl,
      sourceChart: paper[0].sourceChart, rows: Object.freeze(paper)
    });
  }
  return Object.freeze({ rows: rows, referenceFor: referenceFor });
});
