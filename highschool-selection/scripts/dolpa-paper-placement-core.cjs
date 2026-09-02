"use strict";

const ADMISSION_MODES = Object.freeze([
  "initial_entry",
  "mid_course_transfer",
  "existing_class_checkpoint",
  "unknown"
]);
const EVIDENCE_STATUSES = Object.freeze(["verified", "supported", "inferred"]);
const REPRESENTATIVE_MODES = Object.freeze(["core_only", "all_observed"]);

function clean(value) {
  return String(value == null ? "" : value).trim();
}

function endpoint(value, label) {
  if (!value || !clean(value.semester) || !clean(value.unit)) {
    throw new Error(`${label}의 학기와 단원이 필요합니다.`);
  }
  return { semester: clean(value.semester), unit: clean(value.unit) };
}

function questionNumbers(values, questionCount, label) {
  if (!Array.isArray(values)) throw new Error(`${label}은 문항 번호 배열이어야 합니다.`);
  const normalized = values.slice().sort((left, right) => left - right);
  const seen = new Set();
  normalized.forEach(number => {
    if (!Number.isSafeInteger(number) || number < 1 || number > questionCount || seen.has(number)) {
      throw new Error(`${label}의 문항 번호를 확인해 주세요: ${number}`);
    }
    seen.add(number);
  });
  return normalized;
}

function normalize(item, questionCount) {
  const paperId = clean(item && item.paperId);
  const evidenceId = clean(item && item.evidenceId);
  const operationalAdmissionMode = clean(item && item.operationalAdmissionMode);
  const evidenceStatus = clean(item && item.evidenceStatus);
  const representativeMode = clean(item && item.representativeMode) || "core_only";
  if (!paperId) throw new Error("paperId가 필요합니다.");
  if (!evidenceId) throw new Error(`${paperId}의 과정 위치 확인 근거가 필요합니다.`);
  if (!ADMISSION_MODES.includes(operationalAdmissionMode)) throw new Error(`${paperId}의 입반 방식을 확인해 주세요.`);
  if (!EVIDENCE_STATUSES.includes(evidenceStatus)) throw new Error(`${paperId}의 과정 위치 근거 상태를 확인해 주세요.`);
  if (!REPRESENTATIVE_MODES.includes(representativeMode)) throw new Error(`${paperId}의 대표 구성 방식을 확인해 주세요.`);
  if (!Number.isSafeInteger(item.sequenceIndex) || item.sequenceIndex < 1) {
    throw new Error(`${paperId}의 시험 순번이 필요합니다.`);
  }
  const targetCourseLabel = clean(item.targetCourseLabel);
  if (!targetCourseLabel) throw new Error(`${paperId}의 목표 과정 이름이 필요합니다.`);
  const testedPrerequisiteEndpoint = endpoint(item.testedPrerequisiteEndpoint, `${paperId}의 직전 과정 끝`);
  const testedCoreEndpoint = endpoint(item.testedCoreEndpoint, `${paperId}의 중심 범위 끝`);
  const maximumObservedContent = endpoint(item.maximumObservedContent, `${paperId}의 가장 높은 확인 내용`);
  const extensionProbeQuestionNumbers = questionNumbers(
    item.extensionProbeQuestionNumbers || [], questionCount, `${paperId}의 상향 확인 문항`
  );
  if (representativeMode === "core_only" && operationalAdmissionMode === "initial_entry" && !extensionProbeQuestionNumbers.length) {
    throw new Error(`${paperId}의 과정 시작 대표 구성에는 상향 확인 문항 검토 결과가 필요합니다.`);
  }
  return {
    examLabelKind: clean(item.examLabelKind) || "entrance",
    operationalAdmissionMode,
    courseEntryPhase: {
      sequenceIndex: item.sequenceIndex,
      label: clean(item.courseEntryPhaseLabel) || null
    },
    targetCourse: { label: targetCourseLabel },
    testedPrerequisiteEndpoint,
    testedCoreEndpoint,
    maximumObservedContent,
    extensionProbeQuestionNumbers,
    rangeAlignment: clean(item.rangeAlignment) || "unknown",
    representativePolicy: {
      mode: representativeMode,
      excludedQuestionNumbers: representativeMode === "core_only" ? extensionProbeQuestionNumbers : []
    },
    status: evidenceStatus,
    evidence: [evidenceId],
    note: clean(item.note) || null
  };
}

function questionRole(paper, number) {
  const context = paper && paper.placementContext;
  if (!context) return "unclassified";
  return (context.extensionProbeQuestionNumbers || []).includes(number) ? "extension_probe" : "core";
}

function representativeDecision(paper, number) {
  const role = questionRole(paper, number);
  const policy = paper && paper.placementContext && paper.placementContext.representativePolicy;
  if (role === "extension_probe" && policy && policy.mode === "core_only") {
    return { eligible: false, role, reason: "과정 시작 대표 구성에서 제외하는 상향 확인 문항" };
  }
  return { eligible: true, role, reason: role === "core" ? "시험의 중심 범위 문항" : "과정 위치 미분류 문항" };
}

module.exports = Object.freeze({
  ADMISSION_MODES,
  EVIDENCE_STATUSES,
  REPRESENTATIVE_MODES,
  normalize,
  questionRole,
  representativeDecision
});
