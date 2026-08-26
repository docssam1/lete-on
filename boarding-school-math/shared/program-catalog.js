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

  const verified = "2026-08-26";
  const source = function (authority, url) {
    return Object.freeze({ authority, url, lastVerified: verified });
  };

  const catalog = {
    schemaVersion: contract.SCHEMA_VERSION,
    targetGrades: Object.freeze(["K", 1, 2, 3, 4, 5, 6, 7, 8]),
    programs: Object.freeze([
      {
        id: "us-core-k8",
        title: { ko: "미국 K–8 핵심 수학", en: "US K–8 Core Mathematics", "zh-Hans": "美国 K–8 核心数学" },
        pathway: "core",
        grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8],
        standardsMode: "ccss-id-required-per-skill",
        sources: [source("Common Core State Standards Initiative", "https://corestandards.org/mathematics-standards/")],
        status: { state: "active", reason: "Target backbone; skill-level CCSS crosswalk remains to be authored and reviewed." }
      },
      {
        id: "singapore-mastery",
        title: { ko: "싱가포르 숙달·모델 메서드", en: "Singapore Mastery and Model Method", "zh-Hans": "新加坡精熟与模型方法" },
        pathway: "accelerated",
        grades: [1, 2, 3, 4, 5, 6, 7, 8],
        standardsMode: "moe-primary-verified-secondary-crosswalk-pending",
        sources: [source("Singapore Ministry of Education", "https://www.moe.gov.sg/-/media/files/primary/2021-primary-mathematics-syllabus-p1-to-p6-updated-dec-2024.pdf")],
        status: { state: "active", reason: "Primary 1–6 official spine is verified; grades 7–8 mapping stays locked until the secondary syllabus crosswalk is complete." }
      },
      {
        id: "math-kangaroo-1-8",
        title: { ko: "매스캥거루 1–8", en: "Math Kangaroo Grades 1–8", "zh-Hans": "袋鼠数学 1–8 年级" },
        pathway: "competition",
        grades: [1, 2, 3, 4, 5, 6, 7, 8],
        officialBands: [[1, 2], [3, 4], [5, 6], [7, 8]],
        sources: [source("Math Kangaroo USA", "https://mathkangaroo.org/mks/practice/free-question-samples/")],
        status: { state: "active", reason: "Band and format metadata may be public; original problem text needs an explicit rights record." }
      },
      {
        id: "sasmo-k2-8",
        title: { ko: "SASMO K2–8", en: "SASMO K2–Grade 8", "zh-Hans": "SASMO K2–8 年级" },
        pathway: "competition",
        grades: ["K", 1, 2, 3, 4, 5, 6, 7, 8],
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
        sources: [source("Mathematical Association of America", "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/")],
        status: { state: "active", reason: "Eligibility is official; grades 6–8 are GFIELD's preparation band, not an MAA placement rule." }
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
