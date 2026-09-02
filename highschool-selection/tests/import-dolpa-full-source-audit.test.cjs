"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");
const core = require("../scripts/import-dolpa-full-source-audit.cjs");

function audit() {
  return {
    schemaVersion: "1.0.0",
    auditDate: "2026-08-31",
    source: {
      sourceId: "DP-SRC-ABCDEF123456",
      sourceFingerprint: "a".repeat(64),
      title: "돌파 원본 검수 시험",
      paperIdProposal: "DP-M11-202608-R1",
      questionCount: 30,
      timeMinutes: 180,
      sourceCutFactOnly: 20
    },
    coursePlacement: {
      processRole: "course_start_first_month",
      target: "중1-1 과정 시작 전 누적 진단",
      centralScope: "초등 누적 범위",
      terminalCoreUnit: "초6-2 원기둥",
      midCourseJoin: false
    },
    summary: { verified: 29, needsReview: 1, disputed: 0 },
    questions: Array.from({ length: 30 }, (_, index) => ({
      number: index + 1,
      page: Math.floor(index / 4) + 3,
      slot: index % 2 ? "right" : "left",
      semester: index === 29 ? "초6-2" : "초5-1",
      largeUnit: index === 29 ? "도형과 측정" : "수와 연산",
      smallUnit: index === 29 ? "원기둥" : `검수 단원 ${index + 1}`,
      fineType: `검수 세부 유형 ${index + 1}`,
      solutionStructure: `조건 ${index + 1}을 순서대로 적용한다.`,
      absoluteDifficulty: index < 15 ? "standard" : "raised",
      difficultyReason: "조건 수와 풀이 단계를 확인했다.",
      responseFormat: {
        kind: index === 1 ? "multi_field" : "short_answer",
        slotCount: index === 1 ? 2 : 1,
        ordered: true,
        fieldOrder: index === 1 ? ["first", "second"] : ["result"]
      },
      scopeRole: "center_range",
      answerCheck: { status: index === 2 ? "needs_review" : "verified", publicationLock: true }
    }))
  };
}

function database() {
  const typeId = ledgerCore.stableTypeId("초5-1", "검수 단원 1", "검수 세부 유형 1");
  return {
    typeCatalog: [{
      typeId,
      semester: "초5-1",
      unit: "검수 단원 1",
      label: "검수 세부 유형 1",
      solutionArchetype: "조건 1을 순서대로 적용한다."
    }]
  };
}

function crosswalk(db) {
  return {
    schemaVersion: core.CROSSWALK_SCHEMA,
    sourceId: "DP-SRC-ABCDEF123456",
    items: Array.from({ length: 30 }, (_, index) => index === 0
      ? { number: 1, decision: "reuse", typeId: db.typeCatalog[0].typeId, expectedSolutionArchetype: "조건 1을 순서대로 적용한다.", reason: "동일 구조" }
      : { number: index + 1, decision: "new", reason: "기존 동일 유형 없음" })
  };
}

test("실제 전체 검수본 버전과 답안 형식을 공통 계약으로 바꾼다", () => {
  const sourceAudit = audit();
  core.validateAudit(sourceAudit);
  assert.equal(core.responseKind("short_answer"), "input");
  assert.equal(core.responseKind("multi_field"), "multi_input");
  assert.equal(core.responseKind("ordered_sequence"), "multi_input");
  assert.equal(core.responseKind("multi_part"), "multi_input");
  assert.equal(core.responseKind("multi_short_answer"), "multi_input");
  assert.equal(core.responseKind("compound_short_answer"), "multi_input");
  assert.equal(core.responseKind("coordinate_pair"), "multi_input");
  assert.equal(core.responseKind("short_answer_with_unit"), "input");
  assert.equal(core.responseKind("algebraic_expression"), "input");
  assert.equal(core.normalizeAnswerStatus("needs_review"), "pending");
});

test("기존 동일 유형은 reuse로만 연결하고 새 유형 충돌은 막는다", () => {
  const sourceAudit = audit();
  const db = database();
  core.validateCrosswalk(crosswalk(db), sourceAudit, db);
  const bad = crosswalk(db);
  bad.items[0] = { number: 1, decision: "new", reason: "잘못된 신규" };
  assert.throws(() => core.validateCrosswalk(bad, sourceAudit, db), /reuse/);
});

test("공동 신규 유형은 감사 라벨 대신 검수된 canonical 분류를 사용할 수 있다", () => {
  const sourceAudit = audit();
  const db = database();
  const map = crosswalk(db);
  map.items[8] = {
    number: 9,
    decision: "new",
    canonical: {
      semester: "초5-1",
      unit: "약수와 배수",
      typeLabel: "서로 다른 일·휴식 주기의 장기간 공통 휴일 수 세기"
    },
    reason: "두 원본의 같은 풀이 구조를 공동 신규 유형으로 묶음"
  };
  const packets = core.buildPackets(sourceAudit, map, db);
  assert.equal(packets.paperReview.questions[8].unit, "약수와 배수");
  assert.equal(packets.paperReview.questions[8].typeLabel, "서로 다른 일·휴식 주기의 장기간 공통 휴일 수 세기");
});

test("원본 30문항을 대표 시험 검수 패킷으로 만들고 불확실 문항은 잠근다", () => {
  const sourceAudit = audit();
  const db = database();
  const packets = core.buildPackets(sourceAudit, crosswalk(db), db);
  assert.equal(packets.paperReview.questions.length, 30);
  assert.equal(packets.paperReview.questions[0].typeLabel, "검수 세부 유형 1");
  assert.equal(packets.paperReview.questions[1].responseFormat, "multi_input");
  assert.equal(packets.paperReview.questions[2].answerStatus, "pending");
  assert.deepEqual(packets.paperReview.coverage.observedTerminal, { semester: "초6-2", unit: "원기둥" });
  assert.equal(packets.methodReview.reviews.length, 30);
  assert.equal(packets.difficultyReview.reviews.filter(item => item.band === "raised").length, 15);
});

test("원본 위치 문자열 대신 페이지 안 문항 순서를 숫자로 고정한다", () => {
  const slots = core.slotNumbers(audit().questions);
  assert.equal(slots.get(1), 1);
  assert.equal(slots.get(4), 4);
  assert.equal(slots.get(5), 1);
});

test("시험 범위 끝은 문항 배열의 마지막 항목이 아니라 검수된 종단 단원을 따른다", () => {
  const sourceAudit = audit();
  sourceAudit.coursePlacement.terminalCoreUnit = "중1-1 정비례와 반비례";
  sourceAudit.questions[29].semester = "중1-1";
  sourceAudit.questions[29].smallUnit = "유리수의 계산과 전개도";
  assert.deepEqual(core.observedTerminal(sourceAudit), { semester: "중1-1", unit: "정비례와 반비례" });
});
