(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDCompetitionOriginalLinks = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const records = Object.freeze([
    Object.freeze({
      id: "sasmo-2019-member-portal-g2-8",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2019]),
      officialGradeKeys: Object.freeze([2, 3, 4, 5, 6, 7, 8]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://form.simcc.org/2019-sasmo-year-paper/",
      officialHost: "form.simcc.org",
      sourceKind: "organizer-member-portal",
      coverageLabel: "2019 · Grade 2–8",
      originalLanguage: "en",
      delivery: "external-official-link",
      uiLocalizationOnly: true,
      rehosted: false,
      storedCopy: false,
      translationAvailable: false,
      lastVerified: "2026-08-28"
    }),
    Object.freeze({
      id: "sasmo-2025-official-lms-g1-8",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2025]),
      officialGradeKeys: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://sasmo.simcc.org/courses/sasmo-past-papers-year-2025/",
      officialHost: "sasmo.simcc.org",
      sourceKind: "organizer-lms",
      coverageLabel: "2025 · Grade 1–8 · enrollment may be required",
      originalLanguage: "en",
      delivery: "external-official-link",
      uiLocalizationOnly: true,
      rehosted: false,
      storedCopy: false,
      translationAvailable: false,
      lastVerified: "2026-08-28"
    }),
    Object.freeze({
      id: "sasmo-2019-2020-free-lms-g2-8",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2019, 2020]),
      officialGradeKeys: Object.freeze([2, 3, 4, 5, 6, 7, 8]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://form.simcc.org/lms-home/",
      officialHost: "form.simcc.org",
      sourceKind: "organizer-member-portal",
      coverageLabel: "2019–2020 · Grade 2–8",
      originalLanguage: "en",
      delivery: "external-official-link",
      uiLocalizationOnly: true,
      rehosted: false,
      storedCopy: false,
      translationAvailable: false,
      lastVerified: "2026-08-28"
    })
  ]);

  function findForGrade(programId, gradeKey) {
    return records.filter(function (record) {
      return record.programId === programId && record.officialGradeKeys.some(function (grade) {
        return String(grade) === String(gradeKey);
      });
    });
  }

  return Object.freeze({
    schemaVersion: "1.0.0",
    useMode: "noncommercial_educational",
    records,
    findForGrade
  });
});
