(function (root) {
  "use strict";

  const referenceCutlines = [
    {
      id: "CL-SH-WY-2026-06-START",
      programId: "SH",
      branchId: "SH-BR-WY",
      courseId: "SH-START",
      roundId: "2026-06",
      curriculumVersion: "2022-revised",
      rule: { kind: "level-score", thresholds: [{ levelId: "SR", minimum: 70 }, { levelId: "BP", minimum: 50 }, { levelId: "BL", minimum: 30 }] },
      evidenceId: "SH-WIRYE-2026-06-MIRROR",
      evidenceStatus: "verified",
      usage: "reference-only"
    },
    {
      id: "CL-DP-DC-2026-08-CM2B",
      programId: "DP",
      branchId: "DP-BR-DC",
      courseId: "DP-CM2-BASIC-ENTRY",
      roundId: "2026-08-14-NOTICE",
      curriculumVersion: "2022-revised",
      rule: { kind: "correct-count", minimum: 20, denominator: 30 },
      evidenceId: "DP-ENTRY-MIRROR",
      evidenceStatus: "verified",
      usage: "reference-only"
    },
    {
      id: "CL-WM-DC-2025-09-CM1B",
      programId: "WM",
      branchId: "WM-BR-DC",
      courseId: "WM-CM1-BASIC-ENTRY",
      roundId: "2025-09",
      curriculumVersion: "2022-revised",
      rule: {
        kind: "composite-correct-count",
        minimum: 35,
        denominator: 50,
        sectionMinimums: [{ sectionId: "ALG", minimum: 17 }, { sectionId: "GEO", minimum: 15 }],
        reviewFrom: 32
      },
      evidenceId: "WM-ENTRY-2025-MIRROR",
      evidenceStatus: "verified",
      usage: "reference-only"
    }
  ];

  const examAssignments = [
    { examId: "sh-selection-r01", policyId: null, status: "review-pending", approvedBy: null, approvedAt: null },
    { examId: "dp-middle1-entry", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "dp-common1-entry", policyId: null, status: "review-pending", approvedBy: null, approvedAt: null },
    { examId: "dp-middle2-2-transfer", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "dp-common1-entry-202405", policyId: null, status: "review-pending", approvedBy: null, approvedAt: null },
    { examId: "wm-algebra-geometry-diagnostic", policyId: null, status: "blocked-source-conflict", approvedBy: null, approvedAt: null },
    { examId: "ed-middle1-entry", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "ed-high-advance-entry", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "dg-entry-common", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "sm-common2-basic-r01", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "sm-common2-basic-r02", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null },
    { examId: "sm-common2-basic-r03", policyId: null, status: "needs-evidence", approvedBy: null, approvedAt: null }
  ];

  function resolveAssignedPolicy(examId) {
    const assignment = examAssignments.find(function (item) { return item.examId === examId; });
    if (!assignment || assignment.status !== "approved" || !assignment.policyId || !assignment.approvedBy || !assignment.approvedAt) return null;
    const policy = referenceCutlines.find(function (item) { return item.id === assignment.policyId; });
    return policy && policy.usage === "exam-approved" ? policy : null;
  }

  root.HIGHSELECT_CUTLINE_POLICIES = {
    updatedAt: "2026-08-22",
    policy: "학원·지점·과정·회차가 모두 일치하고 사용자가 시험별로 승인한 규칙만 판정에 사용합니다.",
    referenceCutlines,
    examAssignments,
    resolveAssignedPolicy
  };
})(typeof window !== "undefined" ? window : globalThis);
