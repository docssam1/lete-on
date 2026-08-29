"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { applyReview } = require("../scripts/apply-dolpa-classification-review-to-type-index.cjs");

function typeIndex() {
  return {
    schemaVersion: 1,
    totalQuestionCount: 30,
    papers: [{
      paperId: "DP-M21S-202405-R3",
      questionCount: 30,
      questions: Array.from({ length: 30 }, (_, index) => ({
        number: index + 1,
        semester: "중3-1",
        unit: "제곱근과 실수",
        type: "기존 유형",
        sourceKind: "돌파 원본 시험지",
        sourceRelation: "original"
      }))
    }]
  };
}

function packet() {
  return {
    schemaVersion: "highselect-dolpa-classification-review/v1",
    reviewId: "dp-m21s-correction",
    sourceId: "DP-SRC-40CB36024FBC",
    paperId: "DP-M21S-202405-R3",
    reviewedAt: "2026-08-29",
    reviews: [{
      questionId: "DP-Q-40CB36024FBC-001",
      number: 1,
      semester: "중2-1",
      unit: "유리수와 순환소수",
      typeLabel: "유리수와 소수 표현의 관계 판단하기",
      evidenceLocator: "p.3 Q1",
      reason: "원본 문제 화면을 직접 확인했다."
    }]
  };
}

test("같은 분류 교정표를 원본 유형표에도 적용한다", () => {
  const result = applyReview(typeIndex(), packet());
  assert.equal(result.papers[0].questions[0].semester, "중2-1");
  assert.equal(result.papers[0].questions[0].unit, "유리수와 순환소수");
  assert.equal(result.papers[0].questions[0].type, "유리수와 소수 표현의 관계 판단하기");
  assert.equal(result.papers[0].questions[1].type, "기존 유형");
  assert.equal(result.papers.length, 1);
  assert.equal(result.totalQuestionCount, 30);
});

test("다른 시험지 번호로는 유형표를 바꾸지 않는다", () => {
  const review = packet();
  review.paperId = "DP-OTHER";
  assert.throws(() => applyReview(typeIndex(), review), /없는 시험지/);
});
