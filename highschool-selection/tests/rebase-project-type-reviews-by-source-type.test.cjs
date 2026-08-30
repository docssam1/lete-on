"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { rebase } = require("../scripts/rebase-project-type-reviews-by-source-type.cjs");

const family = (id, bank, type) => ({ conceptFamilyId: id, sourceTypes: [{ sourceBankId: bank, sourceTypeId: type }] });
const candidate = (id, left, right) => ({ candidateId: id, leftConceptFamilyId: left, rightConceptFamilyId: right });

test("family ID가 바뀌어도 원본 유형 쌍으로 기존 결정을 이어 붙인다", () => {
  const oldIndex = {
    conceptFamilies: [family("OLD-A", "DP", "T1"), family("OLD-B", "SH", "T2")],
    overlapCandidates: [candidate("OLD-C", "OLD-A", "OLD-B")]
  };
  const newIndex = {
    conceptFamilies: [family("NEW-A", "DP", "T1"), family("NEW-B", "SH", "T2")],
    overlapCandidates: [candidate("NEW-C", "NEW-B", "NEW-A")]
  };
  const output = rebase(oldIndex, newIndex, {
    schemaVersion: 1,
    reviews: [{ candidateId: "OLD-C", decision: "same_concept_family", reviewer: "검수자", reviewedAt: "2026-08-29", reason: "같은 개념군", evidence: [] }]
  });
  assert.equal(output.reviews.length, 1);
  assert.equal(output.reviews[0].candidateId, "NEW-C");
  assert.equal(output.retiredReviews.length, 0);
});

test("새 인덱스에서 더 이상 후보가 아닌 쌍은 이유와 함께 보존한다", () => {
  const oldIndex = {
    conceptFamilies: [family("OLD-A", "DP", "T1"), family("OLD-B", "SH", "T2")],
    overlapCandidates: [candidate("OLD-C", "OLD-A", "OLD-B")]
  };
  const newIndex = {
    conceptFamilies: [family("NEW-A", "DP", "T1"), family("NEW-B", "SH", "T2")],
    overlapCandidates: []
  };
  const output = rebase(oldIndex, newIndex, {
    schemaVersion: 1,
    reviews: [{ candidateId: "OLD-C", decision: "keep_separate", reviewer: "검수자", reviewedAt: "2026-08-29", reason: "다른 유형", evidence: [] }]
  });
  assert.equal(output.reviews.length, 0);
  assert.equal(output.retiredReviews[0].retiredReason, "pair_not_candidate_in_new_index");
});
