"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const placement = require("../scripts/record-dolpa-paper-placement.cjs");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");

function database() {
  const questions = Array.from({ length: 30 }, (_, index) => ({
    questionId: `DP-Q-AAAAAAAAAAAA-${String(index + 1).padStart(3, "0")}`,
    sourceId: "DP-SRC-AAAAAAAAAAAA",
    paperId: "DP-PAPER",
    number: index + 1,
    classification: {
      semester: "중1-2", domain: "기하", unit: "기본도형", majorUnit: "기하", minorUnit: "기본도형",
      typeId: require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중1-2", "기본도형", `유형 ${index + 1}`),
      typeLabel: `유형 ${index + 1}`, status: "verified", evidence: ["review.questions"]
    },
    locator: { page: 1, slot: index + 1, status: "verified", evidence: ["review.locator"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
    difficulty: { band: "standard", status: "verified", evidence: ["review.difficulty"] },
    responseFormat: { kind: "input", slotCount: 1, status: "verified", evidence: ["review.response"] },
    answerCheck: { status: "verified", evidence: ["review.answer"] },
    variantSet: { status: "not_started", originalId: `DP-Q-AAAAAAAAAAAA-${String(index + 1).padStart(3, "0")}`, twinIds: [], similarIds: [] },
    usageProfiles: dbCore.PROFILE_CATALOG.map(profile => ({ profileId: profile.profileId, status: "candidate", evidence: [] })),
    releaseStatus: "locked"
  }));
  const value = {
    schemaVersion: 1,
    profileCatalog: dbCore.PROFILE_CATALOG,
    papers: [{
      paperId: "DP-PAPER", sourceId: "DP-SRC-AAAAAAAAAAAA", questionCount: 30,
      questionIds: questions.map(question => question.questionId)
    }],
    questions,
    typeCatalog: dbCore.rebuildTypeCatalog(questions)
  };
  value.summary = dbCore.summarize(value);
  return value;
}

function manifest() {
  return {
    paperId: "DP-PAPER",
    evidenceId: "review.placement.a03",
    examLabelKind: "entrance",
    operationalAdmissionMode: "initial_entry",
    sequenceIndex: 1,
    courseEntryPhaseLabel: "과정 시작 첫째 달",
    targetCourseLabel: "중2-1 과정",
    testedPrerequisiteEndpoint: { semester: "중1-2", unit: "자료의 정리와 해석" },
    testedCoreEndpoint: { semester: "중1-2", unit: "자료의 정리와 해석" },
    maximumObservedContent: { semester: "중2-2", unit: "피타고라스 정리" },
    extensionProbeQuestionNumbers: [17, 20, 29, 30],
    rangeAlignment: "core_aligned_with_extension_probes",
    representativeMode: "core_only",
    evidenceStatus: "supported",
    note: "표지 순번과 시작반 첫째 달 경로, 문항 분포를 함께 확인"
  };
}

test("과정 시작 시험은 중심 범위와 상향 확인 문항을 따로 기록한다", () => {
  const result = placement.record(database(), manifest());
  const context = result.papers[0].placementContext;
  assert.equal(context.operationalAdmissionMode, "initial_entry");
  assert.equal(context.testedCoreEndpoint.semester, "중1-2");
  assert.equal(context.maximumObservedContent.semester, "중2-2");
  assert.deepEqual(context.extensionProbeQuestionNumbers, [17, 20, 29, 30]);
  assert.deepEqual(context.representativePolicy.excludedQuestionNumbers, [17, 20, 29, 30]);
  assert.equal(result.questions.length, 30);
});

test("대표 구성은 상향 확인 문항만 제외하고 문항 DB에서는 지우지 않는다", () => {
  const paper = placement.record(database(), manifest()).papers[0];
  assert.deepEqual(placement.representativeDecision(paper, 16), {
    eligible: true, role: "core", reason: "시험의 중심 범위 문항"
  });
  assert.deepEqual(placement.representativeDecision(paper, 17), {
    eligible: false, role: "extension_probe", reason: "과정 시작 대표 구성에서 제외하는 상향 확인 문항"
  });
});

test("범위를 벗어난 문항 번호와 기존 기록 자동 덮어쓰기를 막는다", () => {
  const invalid = manifest();
  invalid.extensionProbeQuestionNumbers = [31];
  assert.throws(() => placement.record(database(), invalid), /문항 번호/);

  const first = placement.record(database(), manifest());
  const changed = manifest();
  changed.testedCoreEndpoint = { semester: "중2-1", unit: "일차함수" };
  assert.throws(() => placement.record(first, changed), /자동으로 덮어쓰지 않습니다/);
});
