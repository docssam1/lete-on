"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const selector = require("../scripts/select-question-bank.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");

function database() {
  const ledger = {
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: [{ sourceId: "DP-SRC-AAAAAAAAAAAA", sourceFingerprint: "a".repeat(64) }],
    questions: [
      {
        questionId: "DP-Q-AAAAAAAAAAAA-001", sourceId: "DP-SRC-AAAAAAAAAAAA", paperId: "DP-PAPER-A", paperTitle: "A", number: 1,
        sourceRelation: "original", curriculum: { semester: "중2-1", domain: "함수", unit: "일차함수" },
        type: { typeId: ledgerCore.stableTypeId("중2-1", "일차함수", "교점 구하기"), label: "교점 구하기", methodTags: [], methodReviewStatus: "pending" },
        difficulty: { band: null, status: "pending", evidence: [] }, classificationStatus: "verified", evidence: ["paper.a"]
      },
      {
        questionId: "DP-Q-AAAAAAAAAAAA-002", sourceId: "DP-SRC-AAAAAAAAAAAA", paperId: "DP-PAPER-A", paperTitle: "A", number: 2,
        sourceRelation: "original", curriculum: { semester: "중1-1", domain: "문자와 식", unit: "일차방정식" },
        type: { typeId: ledgerCore.stableTypeId("중1-1", "일차방정식", "해 구하기"), label: "해 구하기", methodTags: [], methodReviewStatus: "pending" },
        difficulty: { band: null, status: "pending", evidence: [] }, classificationStatus: "verified", evidence: ["paper.a"]
      }
    ]
  };
  return builder.buildDatabase(ledger, null, "1".repeat(64));
}

test("돌파형 체크는 돌파 원본 확인 문항만 교육과정 순서로 반환한다", () => {
  const selected = selector.selectQuestions(database(), ["돌파형"]);
  assert.equal(selected.questionCount, 2);
  assert.equal(selected.selectedProfiles[0].profileId, "DP_STANDARD");
  assert.deepEqual(selected.questions.map(question => question.minorUnit), ["일차방정식", "일차함수"]);
  assert.equal(selected.questions.every(question => question.usage[0].status === "source_verified"), true);
});

test("후보 상태는 기본 결과에 나오지 않고 관리자 선택에서만 보인다", () => {
  const value = database();
  assert.equal(selector.selectQuestions(value, ["원수학 듀얼형"]).questionCount, 0);
  assert.equal(selector.selectQuestions(value, ["WM_DUAL"], ["source_verified", "approved", "candidate"]).questionCount, 2);
});

test("여러 시험형을 골라도 검수 전 후보 시험형을 확정 배지로 섞지 않는다", () => {
  const selected = selector.selectQuestions(database(), ["DP_STANDARD", "WM_DUAL"]);
  assert.equal(selected.questionCount, 2);
  assert.equal(selected.questions.every(question => question.usage.length === 1), true);
  assert.equal(selected.questions.every(question => question.usage[0].profileId === "DP_STANDARD"), true);
});
