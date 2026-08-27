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
  assert.equal(Object.prototype.hasOwnProperty.call(database.questions[0], "prompt"), false);
  assert.equal(auditor.audit(database).ok, true);
});

test("기존 문항의 수동 검수 결과는 다시 빌드해도 보존된다", () => {
  const value = ledger();
  value.questions[0].type.typeId = require("../scripts/build-dolpa-work-ledger.cjs").stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  const first = builder.buildDatabase(value, null, "1".repeat(64));
  first.questions[0].difficulty = { band: "상", status: "verified", evidence: ["difficulty.audit.one"] };
  const rebuilt = builder.buildDatabase(value, first, "1".repeat(64));
  assert.equal(rebuilt.questions[0].difficulty.band, "상");
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
    questions: [{ number: 1, semester: "중2-2", unit: "도형의 닮음", typeLabel: "평행선에서 길이비 구하기", sourceRelation: "original" }]
  };
  const added = recorder.merge(database, value, manifest);
  assert.equal(added.changed, true);
  assert.equal(added.database.summary.questionCount, 2);
  assert.equal(recorder.merge(added.database, value, manifest).changed, false);
  const changed = structuredClone(manifest);
  changed.questions[0].typeLabel = "삼각형의 넓이비 구하기";
  assert.throws(() => recorder.merge(added.database, value, changed), /덮어쓰지 않습니다/);
});
