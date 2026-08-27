"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const reviews = require("../scripts/apply-project-type-reviews.cjs");

function index() {
  return {
    summary: {},
    conceptFamilies: [
      { conceptFamilyId: "CPT-A" },
      { conceptFamilyId: "CPT-B" },
      { conceptFamilyId: "CPT-C" }
    ],
    overlapCandidates: [
      { candidateId: "OVR-1", leftConceptFamilyId: "CPT-A", rightConceptFamilyId: "CPT-B", status: "review_required", decision: null },
      { candidateId: "OVR-2", leftConceptFamilyId: "CPT-B", rightConceptFamilyId: "CPT-C", status: "review_required", decision: null }
    ],
    items: [
      { itemId: "Q-A", conceptFamilyId: "CPT-A" },
      { itemId: "Q-B", conceptFamilyId: "CPT-B" },
      { itemId: "Q-C", conceptFamilyId: "CPT-C" }
    ]
  };
}

function packet(decision, evidence) {
  return {
    schemaVersion: 1,
    reviews: [{ candidateId: "OVR-1", decision, reviewer: "T", reviewedAt: "2026-08-27", reason: "검수 완료", evidence: evidence || [] }]
  };
}

test("세부유형 병합은 원본 유형을 지우지 않고 공통 대표 ID만 연결한다", () => {
  const output = reviews.applyReviews(index(), packet("merge_detail", ["audit:q1-q2"]));
  assert.equal(output.conceptFamilies.length, 3);
  assert.equal(output.items[0].canonicalConceptFamilyId, output.items[1].canonicalConceptFamilyId);
  assert.equal(output.summary.mergedAliasCount, 1);
});

test("같은 개념군 판정은 세부유형 ID를 합치지 않고 관계만 기록한다", () => {
  const output = reviews.applyReviews(index(), packet("same_concept_family"));
  assert.notEqual(output.items[0].canonicalConceptFamilyId, output.items[1].canonicalConceptFamilyId);
  assert.equal(output.typeRelations[0].relation, "same_concept_family");
});

test("근거 없는 세부유형 병합과 중복 판정을 막는다", () => {
  assert.throws(() => reviews.applyReviews(index(), packet("merge_detail")), /merge_evidence/);
  const duplicate = packet("keep_separate");
  duplicate.reviews.push({ ...duplicate.reviews[0] });
  assert.throws(() => reviews.applyReviews(index(), duplicate), /duplicate/);
});

test("위치별 배치 검수표를 후보 ID와 원본 근거에 안전하게 펼친다", () => {
  const output = reviews.applyReviews(index(), {
    schemaVersion: 1,
    batches: [{
      reviewer: "T",
      reviewedAt: "2026-08-27",
      positions: { merge_detail: [1], keep_separate: [2] },
      evidence: ["audit:batch-1"]
    }]
  });
  assert.equal(output.summary.resolvedOverlapCount, 2);
  assert.equal(output.summary.mergedAliasCount, 1);
  assert.equal(output.overlapCandidates[0].review.evidence.includes("audit:batch-1"), true);
  assert.equal(output.overlapCandidates[1].review.reason, reviews.DECISION_REASONS.keep_separate);
});
