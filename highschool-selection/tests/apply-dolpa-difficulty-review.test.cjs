"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { applyDifficultyReview } = require("../scripts/apply-dolpa-difficulty-review.cjs");

function database() {
  return {
    schemaVersion: 1,
    papers: [{ paperId: "DP-M22S-202403-R1", sourceId: "DP-SRC-8BB6E543C0F7" }],
    questions: [{
      questionId: "DP-Q-8BB6E543C0F7-001",
      paperId: "DP-M22S-202403-R1",
      sourceId: "DP-SRC-8BB6E543C0F7",
      number: 1,
      classification: { status: "verified" },
      locator: { status: "verified" },
      method: { status: "pending" },
      difficulty: { band: null, status: "pending", evidence: [] },
      responseFormat: { status: "verified" },
      answerCheck: { status: "verified" },
      variantSet: { status: "not_started" },
      usageProfiles: [],
      releaseStatus: "locked"
    }],
    typeCatalog: [],
    summary: {}
  };
}

function packet() {
  return {
    schemaVersion: "highselect-dolpa-difficulty-review/v1",
    reviewId: "dp-m22s-r1-difficulty-review-v1",
    sourceId: "DP-SRC-8BB6E543C0F7",
    paperId: "DP-M22S-202403-R1",
    reviewedAt: "2026-08-29",
    reviews: [{
      questionId: "DP-Q-8BB6E543C0F7-001",
      number: 1,
      band: "standard",
      evidenceLocator: "p.3 Q1",
      reason: "한 핵심 개념을 직접 적용한다.",
      confidence: "high"
    }]
  };
}

test("원본 위치에 묶인 난이도 검수만 문항 DB에 적용한다", () => {
  const result = applyDifficultyReview(database(), packet());
  assert.equal(result.questions[0].difficulty.band, "standard");
  assert.equal(result.questions[0].difficulty.status, "verified");
  assert.equal(result.difficultyReviews[0].standardCount, 1);
  assert.equal(result.summary.difficultyVerifiedCount, 1);
  assert.equal(result.questions[0].releaseStatus, "locked");
});

test("다른 원본의 난이도 검수표는 적용하지 않는다", () => {
  const review = packet();
  review.sourceId = "DP-SRC-AAAAAAAAAAAA";
  assert.throws(() => applyDifficultyReview(database(), review), /원본이 일치하지 않습니다/);
});
