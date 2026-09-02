"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const selector = require("../scripts/select-question-bank.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");

function learnerFit(overall = "pass") {
  return {
    overall,
    dimensions: Object.fromEntries(selector.LEARNER_FIT_DIMENSIONS.map(name => [name, overall])),
    evidence: overall === "pass" ? ["private.learner-fit.audit"] : []
  };
}

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
  const value = builder.buildDatabase(ledger, null, "1".repeat(64));
  value.questions.forEach(question => {
    question.answerCheck = { status: "verified", evidence: ["private.answer.audit"] };
    question.learnerFit = learnerFit();
  });
  value.summary = builder.summarize(value);
  return value;
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

test("정답 이견 문항은 기본 선택에서 빠지고 관리자 후보 보기에서도 release 불가로 표시한다", () => {
  const value = database();
  const target = value.questions[0];
  target.answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "원본 답과 독립 검산이 일치하지 않음" };
  target.usageProfiles = target.usageProfiles.map(profile => ({ ...profile, status: "candidate", evidence: [] }));
  value.summary = builder.summarize(value);
  assert.equal(selector.selectQuestions(value, ["DP_STANDARD"]).questions.some(question => question.questionId === target.questionId), false);
  const reviewOnly = selector.selectQuestions(value, ["DP_STANDARD"], ["source_verified", "approved", "candidate"]);
  const row = reviewOnly.questions.find(question => question.questionId === target.questionId);
  assert.equal(row.reviewChecks.keyCheck, false);
  assert.equal(row.releaseEligible, false);
  assert.equal(row.releaseBlockReason, "answer_check_not_verified");
});

test("정답 이견 문항을 source_verified로 위조하면 선택 전에 DB 검사에서 차단한다", () => {
  const value = database();
  const target = value.questions[0];
  target.answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "원본 답과 독립 검산이 일치하지 않음" };
  target.usageProfiles.find(profile => profile.profileId === "DP_STANDARD").status = "source_verified";
  value.summary = builder.summarize(value);
  assert.throws(() => selector.selectQuestions(value, ["DP_STANDARD"]), /answer_dispute_usage/);
});

test("학습 적합성 누락·대기·실패는 학생 선택에서 빠지고 관리자 검수에서만 보인다", () => {
  for (const state of ["missing", "pending", "fail"]) {
    const value = database();
    const target = value.questions[0];
    if (state === "missing") delete target.learnerFit;
    else target.learnerFit = learnerFit(state);
    assert.equal(selector.selectQuestions(value, ["DP_STANDARD"]).questions.some(question => question.questionId === target.questionId), false);
    const admin = selector.selectQuestions(value, ["DP_STANDARD"], ["source_verified", "approved", "candidate"]);
    const row = admin.questions.find(question => question.questionId === target.questionId);
    assert.ok(row, state);
    assert.equal(row.releaseEligible, false, state);
    assert.equal(row.releaseBlockReason, "learner_fit_not_passed", state);
    assert.equal(row.reviewChecks.learnerFit, false, state);
    assert.equal(row.learnerFit.overall, state === "fail" ? "fail" : "pending", state);
  }
});

test("정답 확인과 학습 적합성 5항목이 모두 pass일 때만 다음 선택 단계로 간다", () => {
  const value = database();
  assert.equal(selector.selectQuestions(value, ["DP_STANDARD"]).questionCount, 2);
  value.questions[0].learnerFit.dimensions.responseMode = "pending";
  assert.equal(selector.selectQuestions(value, ["DP_STANDARD"]).questionCount, 1);
});

test("정답 이견 문항은 학습 적합성이 pass여도 학생 선택에서 빠진다", () => {
  const value = database();
  const target = value.questions[0];
  target.answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "정답 이견" };
  target.usageProfiles = target.usageProfiles.map(profile => ({ ...profile, status: "candidate", evidence: [] }));
  value.summary = builder.summarize(value);
  assert.equal(selector.selectQuestions(value, ["DP_STANDARD"]).questions.some(question => question.questionId === target.questionId), false);
  const admin = selector.selectQuestions(value, ["DP_STANDARD"], ["source_verified", "approved", "candidate"]);
  const row = admin.questions.find(question => question.questionId === target.questionId);
  assert.equal(row.releaseEligible, false);
  assert.equal(row.releaseBlockReason, "answer_check_not_verified");
  assert.equal(row.reviewChecks.learnerFit, true);
});
