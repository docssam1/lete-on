(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDK8CompetitionProfiles = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const verified = "2026-08-26";
  const source = function (authority, url, documentRevision) {
    return Object.freeze({ authority, url, documentRevision, lastVerified: verified });
  };

  const profiles = Object.freeze([
    Object.freeze({
      id: "math-kangaroo-usa-k8",
      programId: "math-kangaroo-1-8",
      jurisdiction: "USA",
      officialStudentGrades: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
      kindergartenMayEnterGrade1Paper: true,
      durationMinutes: 75,
      responseType: "multiple-choice",
      paperBands: Object.freeze([
        Object.freeze({ grades: Object.freeze([1, 2]), questionCount: 24, scoreTiers: Object.freeze([3, 4, 5]), questionsPerTier: 8, maxScore: 96 }),
        Object.freeze({ grades: Object.freeze([3, 4]), questionCount: 24, scoreTiers: Object.freeze([3, 4, 5]), questionsPerTier: 8, maxScore: 96 }),
        Object.freeze({ grades: Object.freeze([5, 6]), questionCount: 30, scoreTiers: Object.freeze([3, 4, 5]), questionsPerTier: 10, maxScore: 120 }),
        Object.freeze({ grades: Object.freeze([7, 8]), questionCount: 30, scoreTiers: Object.freeze([3, 4, 5]), questionsPerTier: 10, maxScore: 120 })
      ]),
      rankingSeparatesStudentGrades: true,
      wrongAnswerPenalty: false,
      calculatorAllowed: false,
      curriculumIsGeneralGuideline: true,
      sources: Object.freeze([
        source("Math Kangaroo USA", "https://mathkangaroo.org/mks/faqs/about-the-test/", "current web page; revision date not stated"),
        source("Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/", "official two-grade curriculum guideline bands"),
        source("Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/", "current scoring page; revision date not stated")
      ]),
      contentRights: Object.freeze({ originalProblems: "permission-required", publicUse: "metadata-and-links-only" })
    }),
    Object.freeze({
      id: "sasmo-k2-8",
      programId: "sasmo-k2-8",
      officialGradeKeys: Object.freeze(["K2", 1, 2, 3, 4, 5, 6, 7, 8]),
      gradeSpecificPapers: true,
      calculatorAllowed: false,
      formats: Object.freeze([
        Object.freeze({
          gradeKeys: Object.freeze(["K2"]),
          durationMinutes: 60,
          questionCount: 15,
          sections: Object.freeze([
            Object.freeze({ id: "A", responseType: "multiple-choice", questions: 10, correctPoints: 4, wrongPoints: -1, blankPoints: 0 }),
            Object.freeze({ id: "B", responseType: "non-routine", questions: 5, correctPoints: 7, wrongPoints: 0, blankPoints: 0 })
          ]),
          startingPoints: 10,
          maxScore: 85
        }),
        Object.freeze({
          gradeKeys: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
          durationMinutes: 90,
          questionCount: 25,
          sections: Object.freeze([
            Object.freeze({ id: "A", responseType: "multiple-choice", questions: 15, correctPoints: 2, wrongPoints: -1, blankPoints: 0 }),
            Object.freeze({ id: "B", responseType: "non-routine", questions: 10, correctPoints: 4, wrongPoints: 0, blankPoints: 0 })
          ]),
          startingPoints: 15,
          maxScore: 85
        })
      ]),
      sources: Object.freeze([
        source("Singapore and Asian Schools Math Olympiad", "https://sasmo.simcc.org/", "current organizer page; revision date not stated")
      ]),
      contentRights: Object.freeze({ originalProblems: "permission-required", publicUse: "metadata-and-links-only" })
    }),
    Object.freeze({
      id: "maa-amc-8",
      programId: "amc-8",
      officialEligibility: Object.freeze({ gradeMaximum: 8, ageExclusiveMaximum: 15.5 }),
      gfieldPreparationGrades: Object.freeze([6, 7, 8]),
      preparationBandIsOfficial: false,
      durationMinutes: 40,
      questionCount: 25,
      responseType: "five-choice-multiple-choice",
      correctPoints: 1,
      wrongPoints: 0,
      blankPoints: 0,
      maxScore: 25,
      calculatorAllowed: false,
      remoteAdministrationAllowed: false,
      topicTags: Object.freeze([
        "counting-probability", "estimation", "proportional-reasoning", "elementary-geometry",
        "pythagorean-theorem", "spatial-visualization", "graphs-tables", "beginning-algebra"
      ]),
      sources: Object.freeze([
        source("Mathematical Association of America", "https://maa.org/student-programs/amc/", "current AMC overview; 2026-27 cycle visible"),
        source("Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/", "current policy page; revision date not stated"),
        source("Mathematical Association of America", "https://maa.org/wp-content/uploads/2025/08/2026-AMC-8-Teachers-Manual.pdf", "2026 AMC 8 teacher manual")
      ]),
      contentRights: Object.freeze({ originalProblems: "permission-required", publicUse: "metadata-and-links-only" })
    })
  ]);

  return Object.freeze({ lastVerified: verified, profiles });
});
