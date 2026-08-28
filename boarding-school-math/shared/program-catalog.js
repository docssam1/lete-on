(function (root, factory) {
  const contract = typeof module === "object" && module.exports
    ? require("./program-contract.js")
    : root.GFIELDMathContract;
  const catalog = factory(contract);
  if (typeof module === "object" && module.exports) module.exports = catalog;
  if (root) root.GFIELDMathProgramCatalog = catalog;
})(typeof globalThis !== "undefined" ? globalThis : this, function (contract) {
  "use strict";

  if (!contract) throw new Error("GFIELDMathContract must load before program-catalog.js");

  const verified = "2026-08-28";
  const source = function (authority, url, documentRevision) {
    return Object.freeze({ authority, url, documentRevision: documentRevision || "current official page; revision date not stated", lastVerified: verified });
  };

  const catalog = {
    schemaVersion: contract.SCHEMA_VERSION,
    targetGrades: Object.freeze(["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    programs: Object.freeze([
      {
        id: "us-core-k8",
        title: { ko: "미국 K–12 핵심 수학", en: "US K–12 Core Mathematics", "zh-Hans": "美国 K–12 核心数学" },
        pathway: "core",
        grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        standardsMode: "ccss-id-required-per-skill",
        highSchoolSequence: Object.freeze({
          state: "school-configured",
          claimsUniversalGradeToCourseMapping: false,
          gradeToCourseMapping: null,
          conceptualCategories: Object.freeze([
            "number-and-quantity", "algebra", "functions", "modeling", "geometry", "statistics-and-probability"
          ]),
          note: "High-school standards are represented by conceptual category. Each adopting school must configure and version its own course sequence."
        }),
        sources: [source("Common Core State Standards Initiative", "https://corestandards.org/mathematics-standards/", "official current-site copy; PDF revision number not stated")],
        status: { state: "active", reason: "K–8 remains the implemented spine; high-school conceptual categories are in contract and school-specific course sequencing remains locked until configured." }
      },
      {
        id: "singapore-mastery",
        title: { ko: "싱가포르 숙달·모델 메서드", en: "Singapore Mastery and Model Method", "zh-Hans": "新加坡精熟与模型方法" },
        pathway: "accelerated",
        grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        standardsMode: "moe-primary-verified-secondary-crosswalk-pending",
        implementedGrades: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]),
        plannedLockedGrades: Object.freeze([9, 10, 11, 12]),
        sources: [source("Singapore Ministry of Education", "https://www.moe.gov.sg/-/media/files/primary/2021-primary-mathematics-syllabus-p1-to-p6-updated-october-2025.pdf", "2021 syllabus; updated October 2025; applicable to Primary 6 from 2026")],
        status: { state: "active", reason: "The current G1–8 map remains the implemented boundary; G9–12 are planned and locked pending a reviewed secondary crosswalk and school configuration." }
      },
      {
        id: "math-kangaroo-1-8",
        title: { ko: "매스캥거루 1–12", en: "Math Kangaroo Grades 1–12", "zh-Hans": "袋鼠数学 1–12 年级" },
        pathway: "competition",
        grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        officialBands: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12]],
        profileId: "math-kangaroo-usa-k12",
        sources: [
          source("Math Kangaroo USA", "https://mathkangaroo.org/mks/faqs/about-the-test/"),
          source("Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/"),
          source("Math Kangaroo USA", "https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/")
        ],
        status: { state: "active", reason: "Band and format metadata may be public; original problem text needs an explicit rights record." }
      },
      {
        id: "sasmo-k2-8",
        title: { ko: "SASMO K2–12", en: "SASMO K2–Grade 12", "zh-Hans": "SASMO K2–12 年级" },
        pathway: "competition",
        grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        officialGradeKeys: ["K2", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        kindergartenEligibility: "K2-only",
        profileId: "sasmo-k2-12",
        officialEligibility: "K2 and differentiated papers for grades 1–12",
        sources: [source("Singapore and Asian Schools Math Olympiad", "https://sasmo.simcc.org/")],
        status: { state: "active", reason: "Grade structure is verified; past-paper reproduction remains permission-required until a license is recorded." }
      },
      {
        id: "amc-8",
        title: { ko: "AMC 8 준비", en: "AMC 8 Preparation", "zh-Hans": "AMC 8 备考" },
        pathway: "competition",
        grades: [6, 7, 8],
        officialEligibility: "Grade 8 or below and under 15.5 years of age on competition day",
        preparationBandNotOfficial: true,
        profileId: "maa-amc-8",
        competitionSequence: Object.freeze({ previousProgramId: null, nextProgramId: "amc-10" }),
        sources: [
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/"),
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/"),
          source("Mathematical Association of America", "https://maa.org/wp-content/uploads/2025/08/2026-AMC-8-Teachers-Manual.pdf", "2026 AMC 8 teacher manual")
        ],
        status: { state: "active", reason: "Eligibility and scope metadata are official; grades 6–8 are GFIELD's preparation band, not an MAA placement rule, and no original-content availability is claimed." }
      },
      {
        id: "amc-10",
        title: { ko: "AMC 10 준비", en: "AMC 10 Preparation", "zh-Hans": "AMC 10 备考" },
        pathway: "competition",
        grades: [9, 10],
        officialEligibility: "Grade 10 or below and under 17.5 years of age on competition day",
        preparationBandNotOfficial: true,
        profileId: "maa-amc-10",
        competitionSequence: Object.freeze({ previousProgramId: "amc-8", nextProgramId: "amc-12" }),
        sources: [
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/", "current AMC overview; 2026–27 cycle visible"),
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/", "2026–27 official policies landing page")
        ],
        status: { state: "active", reason: "Eligibility and scope metadata are official; grades 9–10 are GFIELD's preparation band, not an MAA placement rule, and no original-content availability is claimed." }
      },
      {
        id: "amc-12",
        title: { ko: "AMC 12 준비", en: "AMC 12 Preparation", "zh-Hans": "AMC 12 备考" },
        pathway: "competition",
        grades: [11, 12],
        officialEligibility: "Grade 12 or below and under 19.5 years of age on competition day",
        preparationBandNotOfficial: true,
        profileId: "maa-amc-12",
        competitionSequence: Object.freeze({ previousProgramId: "amc-10", nextProgramId: null }),
        sources: [
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/", "current AMC overview; 2026–27 cycle visible"),
          source("Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/", "2026–27 official policies landing page")
        ],
        status: { state: "active", reason: "Eligibility and scope metadata are official; grades 11–12 are GFIELD's preparation band, not an MAA placement rule, and no original-content availability is claimed." }
      }
    ]),
    promotionPolicies: Object.freeze([
      {
        id: "gfield-school-configured-promotion",
        policyOwner: "GFIELD or adopting school",
        claimsNationalOfficialCut: false,
        teacherReviewRequired: true,
        cutScores: null,
        evidence: ["diagnostic", "unit-mastery", "retention-check", "teacher-review"],
        note: "Cut scores must be configured and versioned by the adopting school; standards and competition eligibility are not promotion cut scores."
      }
    ]),
    resourceRules: Object.freeze({
      student: Object.freeze(["concept-workbook", "guided-practice", "homework", "quiz", "test", "student-report"]),
      teacher: Object.freeze(["lesson-plan", "answer-key", "solution-guide", "rubric", "assignment-builder", "teacher-report"])
    }),
    contentContract: Object.freeze({
      hierarchy: Object.freeze(["course", "unit", "skill", "level", "testType", "resourceType"]),
      requiredLocales: contract.REQUIRED_LOCALES,
      optionalLocales: contract.OPTIONAL_LOCALES,
      publicationRights: contract.PUBLIC_RIGHTS
    })
  };

  contract.validateCatalog(catalog);
  return Object.freeze(catalog);
});
