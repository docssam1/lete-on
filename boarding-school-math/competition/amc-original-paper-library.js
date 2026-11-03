(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMCOriginalPaperLibrary = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Original contest content remains at its authorized host. GFIELD stores only routes and metadata.
  const archives = Object.freeze({
    amc8: Object.freeze({ title: "AMC 8", years: Object.freeze(Array.from({ length: 42 }, function (_, index) { return 2026 - index; }).filter(function (year) { return year !== 2021; })), forms: Object.freeze([""]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc8" }),
    amc10: Object.freeze({ title: "AMC 10", years: Object.freeze(Array.from({ length: 26 }, function (_, index) { return 2025 - index; })), forms: Object.freeze(["A", "B"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc10" }),
    amc12: Object.freeze({ title: "AMC 12", years: Object.freeze(Array.from({ length: 76 }, function (_, index) { return 2025 - index; })), forms: Object.freeze(["A", "B"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "amc12" }),
    aime: Object.freeze({ title: "AIME", years: Object.freeze(Array.from({ length: 44 }, function (_, index) { return 2026 - index; })), forms: Object.freeze(["I", "II"]), archiveUrl: "https://live.poshenloh.com/past-contests", path: "aime" })
  });
  function archiveFor(programId) { return archives[programId] || null; }

  function archiveRoute(programId, year, form) {
    const archive = archiveFor(programId);
    if (!archive || !archive.years.includes(Number(year))) return archive ? archive.archiveUrl : "";
    const formId = String(form || "").toUpperCase();
    const suffix = programId === "amc8" ? "" : programId === "aime"
      ? `${Number(year) <= 1999 ? "" : formId}`
      : `${Number(year) <= 2001 ? "" : formId}`;
    return `https://live.poshenloh.com/past-contests/${archive.path}/${Number(year)}${suffix}`;
  }

  return Object.freeze({ schemaVersion: "2.0.0", archives: archives, archiveFor: archiveFor, archiveRoute: archiveRoute });
});
