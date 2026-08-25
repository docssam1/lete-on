(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_DEFAULT_EXAM_SETS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const baselineRoundPlan = Object.freeze([
    Object.freeze({ round: 1, purpose: "현재 실력 확인", difficulty: "standard" }),
    Object.freeze({ round: 2, purpose: "취약 단원 보완", difficulty: "lowered" }),
    Object.freeze({ round: 3, purpose: "심화 적응", difficulty: "raised" }),
    Object.freeze({ round: 4, purpose: "최종 실전", difficulty: "mixed" })
  ]);

  const requiredGuideSections = Object.freeze([
    "target-and-structure",
    "scope-and-item-style",
    "cutline-and-section-minimum",
    "preparation-sequence",
    "exam-day-strategy",
    "after-admission-first-four-weeks"
  ]);

  const standards = Object.freeze([
    Object.freeze({
      standardId: "WM-M21-BASIC-ENTRY-2026-07",
      programCode: "WM",
      label: "원수학 중2-1 기본반 입학",
      itemCount: 40,
      sections: Object.freeze([
        Object.freeze({ id: "ALG", label: "중1 대수", itemCount: 20, minutes: 50 }),
        Object.freeze({ id: "GEO", label: "중1 기하", itemCount: 20, minutes: 50 })
      ]),
      scheduledWindowMinutes: 120,
      cutline: Object.freeze({ total: 28, algebra: 13, geometry: 12, solutionReviewFrom: 25 }),
      desiredRoundCount: 4,
      availableRoundCount: 4,
      bankStatus: "private-review-ready",
      guideStatus: "ready",
      aftercareGuideStatus: "ready",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "SH-HIGH-SELECTION-R01",
      programCode: "SH",
      label: "황소 고등 선발",
      itemCount: 40,
      sections: Object.freeze([Object.freeze({ id: "CUM", label: "중등 누적", itemCount: 40, minutes: 110 })]),
      scheduledWindowMinutes: 110,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 1,
      bankStatus: "one-round-reviewed",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "DP-M22-TRANSFER-2024",
      programCode: "DP",
      label: "돌파 중2-2 편입",
      itemCount: 30,
      sections: Object.freeze([Object.freeze({ id: "CUM", label: "중1-1~중2-2 누적", itemCount: 30, minutes: 150 })]),
      scheduledWindowMinutes: 150,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 1,
      bankStatus: "one-round-reviewed",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "DP-CM1-ENTRY-2024",
      programCode: "DP",
      label: "돌파 공통수학1 입학",
      itemCount: 30,
      sections: Object.freeze([Object.freeze({ id: "CUM", label: "중2-1~중3-2 누적", itemCount: 30, minutes: null })]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 1,
      bankStatus: "one-round-reviewed",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "DP-M1-ENTRY",
      programCode: "DP",
      label: "돌파 중1 입학",
      itemCount: 30,
      sections: Object.freeze([Object.freeze({ id: "ELEM", label: "초등 누적", itemCount: 30, minutes: null })]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "observed-structure-only",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "WM-CM1-BASIC-ENTRY-2025-09",
      programCode: "WM",
      label: "원수학 공통수학1 기본반 입학",
      itemCount: 50,
      sections: Object.freeze([
        Object.freeze({ id: "ALG", label: "중등 대수", itemCount: 25, minutes: 90 }),
        Object.freeze({ id: "GEO", label: "중등 기하", itemCount: 25, minutes: 90 })
      ]),
      scheduledWindowMinutes: 200,
      cutline: Object.freeze({ total: 35, algebra: 17, geometry: 15, solutionReviewFrom: 32 }),
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "geometry-source-missing",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "WM-M22-BASIC-TRANSFER-2026-09",
      programCode: "WM",
      label: "원수학 중2-2 기본반 편입",
      itemCount: 50,
      sections: Object.freeze([
        Object.freeze({ id: "ALG", label: "중등 대수", itemCount: 25, minutes: 70 }),
        Object.freeze({ id: "GEO", label: "중등 기하", itemCount: 25, minutes: 70 })
      ]),
      scheduledWindowMinutes: null,
      cutline: Object.freeze({ total: 35, algebra: 17, geometry: 15, solutionReviewFrom: 32 }),
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "blueprint-only",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "WM-M31-BASIC-TRANSFER-2026-07",
      programCode: "WM",
      label: "원수학 중3-1 기본반 편입",
      itemCount: 50,
      sections: Object.freeze([
        Object.freeze({ id: "ALG", label: "중등 대수", itemCount: 25, minutes: 70 }),
        Object.freeze({ id: "GEO", label: "중등 기하", itemCount: 25, minutes: 70 })
      ]),
      scheduledWindowMinutes: null,
      cutline: Object.freeze({ total: 35, algebra: 17, geometry: 15, solutionReviewFrom: 32 }),
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "blueprint-only",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "ED-M1-ENTRY",
      programCode: "ED",
      label: "이든 중1 시작",
      itemCount: 30,
      sections: Object.freeze([
        Object.freeze({ id: "E5", label: "초5", itemCount: 12, minutes: null }),
        Object.freeze({ id: "E6", label: "초6", itemCount: 18, minutes: null })
      ]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "observed-structure-only",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "ED-HIGH-ADVANCE-ENTRY",
      programCode: "ED",
      label: "이든 고등선행 입학",
      itemCount: 30,
      sections: Object.freeze([Object.freeze({ id: "CUM", label: "중등 학기별 누적", itemCount: 30, minutes: null })]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 2,
      bankStatus: "source-found-review-pending",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "DG-HIGH-ADVANCE-ENTRY",
      programCode: "DG",
      label: "깊은생각 입학",
      itemCount: null,
      sections: Object.freeze([]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 0,
      bankStatus: "scope-only",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    }),
    Object.freeze({
      standardId: "SM-CM2-BASIC",
      programCode: "SM",
      label: "생수 공통수학2 기본",
      itemCount: 30,
      sections: Object.freeze([Object.freeze({ id: "CM2", label: "공통수학2", itemCount: 30, minutes: null })]),
      scheduledWindowMinutes: null,
      cutline: null,
      desiredRoundCount: 4,
      availableRoundCount: 3,
      bankStatus: "source-found-review-pending",
      guideStatus: "pending",
      aftercareGuideStatus: "pending",
      roundPlan: baselineRoundPlan
    })
  ]);

  function getStandard(standardId) {
    return standards.find(item => item.standardId === standardId) || null;
  }

  function getProgramStandards(programCode) {
    return standards.filter(item => item.programCode === programCode);
  }

  return Object.freeze({
    schemaVersion: 1,
    updatedAt: "2026-08-25",
    baselineRoundPlan,
    requiredGuideSections,
    standards,
    getStandard,
    getProgramStandards
  });
});
