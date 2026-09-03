"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const auditor = require("../scripts/audit-dolpa-question-db.cjs");
const recorder = require("../scripts/record-dolpa-paper-questions.cjs");

function ledger() {
  return {
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: [
      { sourceId: "DP-SRC-AAAAAAAAAAAA", sourceFingerprint: "a".repeat(64) },
      { sourceId: "DP-SRC-BBBBBBBBBBBB", sourceFingerprint: "b".repeat(64) }
    ],
    questions: [{
      questionId: "DP-Q-AAAAAAAAAAAA-001",
      sourceId: "DP-SRC-AAAAAAAAAAAA",
      paperId: "DP-PAPER-A",
      paperTitle: "대표 시험 A",
      number: 1,
      sourceRelation: "original",
      curriculum: { semester: "중2-1", domain: "함수", unit: "일차함수" },
      type: { typeId: "DP-TYP-B87E85D820DF7943", label: "두 직선의 교점 구하기", methodTags: [], methodReviewStatus: "pending" },
      difficulty: { band: null, status: "pending", evidence: [] },
      classificationStatus: "verified",
      evidence: ["audit.paper.a"]
    }]
  };
}

test("돌파 문항 DB는 문제 원문 없이 출처·유형·후속 검수 상태를 저장한다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const database = builder.buildDatabase(value, null, "1".repeat(64));
  assert.equal(database.summary.questionCount, 1);
  assert.equal(database.summary.typeCount, 1);
  assert.equal(database.questions[0].difficulty.status, "pending");
  assert.equal(database.questions[0].answerCheck.status, "pending");
  assert.equal(database.questions[0].classification.majorUnit, "함수");
  assert.equal(database.questions[0].classification.minorUnit, "일차함수");
  assert.deepEqual(database.profileCatalog.map(profile => profile.profileId), [
    "DP_STANDARD", "SM_STANDARD", "WM_BASIC", "WM_DUAL", "ED_CUMULATIVE", "SH_SELECTION", "DG_ADVANCED"
  ]);
  assert.notEqual(database.profileCatalog.find(profile => profile.profileId === "WM_BASIC").label,
    database.profileCatalog.find(profile => profile.profileId === "WM_DUAL").label);
  assert.equal(database.questions[0].usageProfiles.find(profile => profile.profileId === "DP_STANDARD").status, "source_verified");
  assert.equal(database.questions[0].usageProfiles.find(profile => profile.profileId === "WM_DUAL").status, "candidate");
  assert.equal(Object.prototype.hasOwnProperty.call(database.questions[0], "prompt"), false);
  assert.equal(auditor.audit(database).ok, true);
});

test("기존 문항의 수동 검수 결과는 다시 빌드해도 보존된다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const first = builder.buildDatabase(value, null, "1".repeat(64));
  first.questions[0].difficulty = { band: "상", status: "verified", evidence: ["difficulty.audit.one"] };
  first.questions[0].classification.evidence.push("taxonomy.domain-normalization.test");
  const rebuilt = builder.buildDatabase(value, first, "1".repeat(64));
  assert.equal(rebuilt.questions[0].difficulty.band, "상");
  assert.deepEqual(rebuilt.questions[0].classification.evidence, ["audit.paper.a", "taxonomy.domain-normalization.test"]);
  assert.equal(rebuilt.questions[0].usageProfiles.find(profile => profile.profileId === "DP_STANDARD").status, "source_verified");
  assert.equal(auditor.audit(rebuilt).ok, true);
});

test("새 시험지 분류는 한 번만 추가되고 다른 내용으로 재등록되지 않는다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const database = builder.buildDatabase(value, null, "1".repeat(64));
  const manifest = {
    paperId: "DP-PAPER-B",
    sourceId: "DP-SRC-BBBBBBBBBBBB",
    title: "대표 시험 B",
    evidenceId: "audit.paper.b",
    answerEvidenceId: "audit.paper.b.answers",
    questions: [{
      number: 1,
      semester: "중2-2",
      unit: "도형의 닮음",
      typeLabel: "평행선에서 길이비 구하기",
      sourceRelation: "original",
      page: 3,
      slot: 1,
      responseKind: "input",
      responseSlotCount: 1
    }]
  };
  const added = recorder.merge(database, value, manifest);
  assert.equal(added.changed, true);
  assert.equal(added.database.summary.questionCount, 2);
  assert.equal(added.database.summary.locatorVerifiedCount, 1);
  assert.equal(added.database.summary.responseVerifiedCount, 1);
  assert.equal(added.database.summary.answerVerifiedCount, 1);
  assert.equal(recorder.merge(added.database, value, manifest).changed, false);
  const changed = structuredClone(manifest);
  changed.questions[0].typeLabel = "삼각형의 넓이비 구하기";
  assert.throws(() => recorder.merge(added.database, value, changed), /덮어쓰지 않습니다/);
});

test("정답 이견 문항은 근거·설명·잠금과 candidate 또는 excluded 사용 상태만 허용한다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const database = builder.buildDatabase(value, null, "1".repeat(64));
  const question = database.questions[0];
  question.answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "원본 답과 독립 검산이 일치하지 않음" };
  question.usageProfiles = question.usageProfiles.map(profile => ({ ...profile, status: "candidate", evidence: [] }));
  database.summary = builder.summarize(database);
  assert.equal(auditor.audit(database).ok, true);

  const noEvidence = structuredClone(database);
  noEvidence.questions[0].answerCheck.evidence = [];
  assert.equal(auditor.audit(noEvidence).issues.some(issue => issue.startsWith("answer_dispute_evidence:")), true);

  const released = structuredClone(database);
  released.questions[0].releaseStatus = "released";
  assert.equal(auditor.audit(released).issues.some(issue => issue.startsWith("answer_dispute_release:")), true);

  for (const unsafeStatus of ["source_verified", "approved"]) {
    const unsafe = structuredClone(database);
    unsafe.questions[0].usageProfiles[0] = { ...unsafe.questions[0].usageProfiles[0], status: unsafeStatus, evidence: ["unsafe"] };
    assert.equal(auditor.audit(unsafe).issues.some(issue => issue.startsWith("answer_dispute_usage:")), true);
  }
});

test("문항 DB 감사는 철자 변형 정답 키를 통한 비공개 이견 답값 주입을 막는다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const database = builder.buildDatabase(value, null, "1".repeat(64));
  database.questions[0].official_answer = "490";
  assert.equal(auditor.audit(database).issues.some(issue => issue.startsWith("forbidden:")), true);
});
