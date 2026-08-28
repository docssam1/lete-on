(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDCompetitionOriginalLinks = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const records = Object.freeze([
    Object.freeze({
      id: "sasmo-2019-member-portal-g2-12",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2019]),
      officialGradeKeys: Object.freeze([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://form.simcc.org/2019-sasmo-year-paper/",
      officialHost: "form.simcc.org",
      sourceKind: "organizer-member-portal",
      coverageLabel: "2019 · Grade 2–12 · G10–12 share the organizer's combined Secondary 4 / JC 1/2 entry",
      coverageLabelKo: "2019년 · G2–G12 · G10–G12는 주최기관의 Secondary 4 / JC 1·2 통합 진입",
      organizerRegistration: Object.freeze({ state: "organizer-managed", url: "https://sasmo.simcc.org/register/", gfieldRegistrationChannel: false }),
      officialSourceAccess: Object.freeze({ state: "organizer-landing-page", url: "https://form.simcc.org/2019-sasmo-year-paper/", mayRequireAccount: true, publicPdfDelivery: false }),
      gfieldReadiness: Object.freeze({ state: "link-only", originalContentReady: false, analysisReady: false }),
      originalLanguage: "en",
      delivery: "external-official-link",
      uiLocalizationOnly: true,
      rehosted: false,
      storedCopy: false,
      translationAvailable: false,
      lastVerified: "2026-08-28"
    }),
    Object.freeze({
      id: "sasmo-2025-official-lms-g1-11",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2025]),
      officialGradeKeys: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://sasmo.simcc.org/courses/sasmo-past-papers-year-2025/",
      officialHost: "sasmo.simcc.org",
      sourceKind: "organizer-lms",
      coverageLabel: "2025 · Grade 1–11 · free enrollment or login may be required; no Grade 12 entry is listed",
      coverageLabelKo: "2025년 · G1–G11 · 무료 등록 또는 로그인이 필요할 수 있으며 G12 항목은 미표시",
      organizerRegistration: Object.freeze({ state: "organizer-managed", url: "https://sasmo.simcc.org/register/", gfieldRegistrationChannel: false }),
      officialSourceAccess: Object.freeze({ state: "organizer-lms", url: "https://sasmo.simcc.org/courses/sasmo-past-papers-year-2025/", mayRequireAccount: true, publicPdfDelivery: false }),
      gfieldReadiness: Object.freeze({ state: "link-only", originalContentReady: false, analysisReady: false }),
      originalLanguage: "en",
      delivery: "external-official-link",
      uiLocalizationOnly: true,
      rehosted: false,
      storedCopy: false,
      translationAvailable: false,
      lastVerified: "2026-08-28"
    }),
    Object.freeze({
      id: "sasmo-2019-2020-free-lms-g2-10",
      programId: "sasmo-k2-8",
      competitionYears: Object.freeze([2019, 2020]),
      officialGradeKeys: Object.freeze([2, 3, 4, 5, 6, 7, 8, 9, 10]),
      organizer: "SIMCC",
      organizerHostedUrl: "https://form.simcc.org/lms-home/",
      officialHost: "form.simcc.org",
      sourceKind: "organizer-member-portal",
      coverageLabel: "2019–2020 · Grade 2–10 · historic paper-based and online groupings vary",
      coverageLabelKo: "2019–2020년 · G2–G10 · 종이 자료와 온라인 자료의 학년 묶음은 연도별로 다름",
      organizerRegistration: Object.freeze({ state: "organizer-managed", url: "https://sasmo.simcc.org/register/", gfieldRegistrationChannel: false }),
      officialSourceAccess: Object.freeze({ state: "organizer-lms-landing-page", url: "https://form.simcc.org/lms-home/", mayRequireAccount: true, publicPdfDelivery: false }),
      gfieldReadiness: Object.freeze({ state: "link-only", originalContentReady: false, analysisReady: false }),
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
    browserDelivery: Object.freeze({ mode: "external-only", translated: false, rehosted: false, publicPdfDelivery: false }),
    records,
    findForGrade
  });
});
