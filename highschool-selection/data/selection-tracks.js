(function (root) {
  "use strict";

  const trackDefinitions = [
    {
      id: "high-selection",
      label: "고등과정 선발",
      targetStage: "high",
      admissionKind: "selection",
      aliases: []
    },
    {
      id: "middle-entry",
      label: "중등 시작·입학",
      targetStage: "middle",
      admissionKind: "entry",
      aliases: ["start"]
    },
    {
      id: "middle-transfer",
      label: "중등 편입",
      targetStage: "middle",
      admissionKind: "transfer",
      aliases: []
    },
    {
      id: "common-math-entry",
      label: "공통수학 입학",
      targetStage: "high",
      admissionKind: "entry",
      aliases: []
    },
    {
      id: "high-advance",
      label: "고등선행 입학",
      targetStage: "high",
      admissionKind: "advance-entry",
      aliases: []
    },
    {
      id: "high-transfer",
      label: "고등과정 편입",
      targetStage: "high",
      admissionKind: "transfer",
      aliases: []
    }
  ];

  // A program can offer several tracks. The program code identifies the
  // operator; trackId identifies the admission purpose and is never prefixed
  // with an operator code.
  const programTrackBindings = [
    {
      id: "SH:high-selection",
      programCode: "SH",
      trackId: "high-selection",
      scopeKey: "middle-cumulative",
      scopeLabel: "중등 누적",
      evidenceStatus: "observed",
      evidenceRefs: ["EXAM:sh-selection-r01"]
    },
    {
      id: "DP:middle-entry",
      programCode: "DP",
      trackId: "middle-entry",
      scopeKey: "elementary-cumulative",
      scopeLabel: "중1 입학 선수 과정",
      evidenceStatus: "observed",
      evidenceRefs: ["OBSERVATION:DP-MIDDLE-ENTRY"]
    },
    {
      id: "DP:middle-transfer",
      programCode: "DP",
      trackId: "middle-transfer",
      scopeKey: "middle1-1-to-middle2-2",
      scopeLabel: "중1-1~중2-2 누적",
      evidenceStatus: "observed",
      evidenceRefs: ["USER:DP-MIDDLE2-2-TRANSFER-SCOPE"]
    },
    {
      id: "DP:common-math-entry",
      programCode: "DP",
      trackId: "common-math-entry",
      scopeKey: "common-math-1",
      scopeLabel: "공통수학1",
      evidenceStatus: "verified",
      evidenceRefs: ["PUBLIC:DP-ENTRY-MIRROR"]
    },
    {
      id: "WM:common-math-entry",
      programCode: "WM",
      trackId: "common-math-entry",
      scopeKey: "middle-algebra-geometry",
      scopeLabel: "중등 대수·기하 누적",
      evidenceStatus: "verified",
      evidenceRefs: ["PUBLIC:WM-ENTRY-2025-MIRROR"]
    },
    {
      id: "ED:middle-entry",
      programCode: "ED",
      trackId: "middle-entry",
      scopeKey: "elementary-cumulative",
      scopeLabel: "중1 입학 선수 과정",
      evidenceStatus: "observed",
      evidenceRefs: ["OBSERVATION:ED-MIDDLE-ENTRY"]
    },
    {
      id: "ED:high-advance",
      programCode: "ED",
      trackId: "high-advance",
      scopeKey: "middle-semester-cumulative",
      scopeLabel: "중등 학기별 누적",
      evidenceStatus: "observed",
      evidenceRefs: ["EXAM:ed-high-advance-entry"]
    },
    {
      id: "DG:high-advance",
      programCode: "DG",
      trackId: "high-advance",
      scopeKey: "middle-common-math-mixed",
      scopeLabel: "중등 심화·공통수학 누적",
      evidenceStatus: "verified",
      evidenceRefs: ["PUBLIC:DG-SCOPE-MIRROR"]
    },
    {
      id: "SM:common-math-entry",
      programCode: "SM",
      trackId: "common-math-entry",
      scopeKey: "common-math-sample",
      scopeLabel: "공통수학 샘플 범위",
      evidenceStatus: "needs-review",
      evidenceRefs: ["EXAM:sm-common2-basic-r01"]
    }
  ];

  // These assignments preserve every existing public exam ID. They add a
  // neutral track join without changing catalog.js or its legacy track label.
  const examTrackAssignments = [
    { examId: "sh-selection-r01", programCode: "SH", trackId: "high-selection" },
    { examId: "dp-middle1-entry", programCode: "DP", trackId: "middle-entry" },
    { examId: "dp-common1-entry", programCode: "DP", trackId: "common-math-entry" },
    { examId: "dp-middle2-2-transfer", programCode: "DP", trackId: "middle-transfer" },
    { examId: "dp-common1-entry-202405", programCode: "DP", trackId: "common-math-entry" },
    { examId: "wm-algebra-geometry-diagnostic", programCode: "WM", trackId: "common-math-entry" },
    { examId: "ed-middle1-entry", programCode: "ED", trackId: "middle-entry" },
    { examId: "ed-high-advance-entry", programCode: "ED", trackId: "high-advance" },
    { examId: "dg-entry-common", programCode: "DG", trackId: "high-advance" },
    { examId: "sm-common2-basic-r01", programCode: "SM", trackId: "common-math-entry" },
    { examId: "sm-common2-basic-r02", programCode: "SM", trackId: "common-math-entry" },
    { examId: "sm-common2-basic-r03", programCode: "SM", trackId: "common-math-entry" }
  ];

  function getTrack(trackId) {
    return trackDefinitions.find(track => track.id === trackId) || null;
  }

  function getProgramTracks(programCode) {
    return programTrackBindings.filter(binding => binding.programCode === programCode);
  }

  function resolveExamTrack(examId) {
    const assignment = examTrackAssignments.find(item => item.examId === examId);
    if (!assignment) return null;
    return {
      assignment,
      track: getTrack(assignment.trackId),
      binding: programTrackBindings.find(binding => (
        binding.programCode === assignment.programCode &&
        binding.trackId === assignment.trackId
      )) || null
    };
  }

  root.SELECTION_TRACK_CATALOG = {
    schemaVersion: 1,
    updatedAt: "2026-08-22",
    evidenceStatuses: ["verified", "observed", "needs-review"],
    trackDefinitions,
    programTrackBindings,
    examTrackAssignments,
    getTrack,
    getProgramTracks,
    resolveExamTrack
  };
})(typeof window !== "undefined" ? window : globalThis);
