"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");
const { applyMethodReview } = require("../scripts/apply-dolpa-method-review.cjs");

function question(number, typeId) {
  return {
    questionId: `DP-Q-ABCDEF123456-${String(number).padStart(3, "0")}`,
    sourceId: "DP-SRC-ABCDEF123456",
    paperId: "DP-M22-TEST",
    number,
    classification: { semester: "중2-2", domain: "기하", unit: "닮음", majorUnit: "기하", minorUnit: "닮음", typeId, typeLabel: "평행선과 닮음", status: "verified", evidence: ["classification"] },
    locator: { page: 3, slot: null, status: "verified", evidence: ["locator"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
    difficulty: { status: "pending", evidence: [] },
    responseFormat: { status: "pending", evidence: [] },
    answerCheck: { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: `DP-Q-ABCDEF123456-${String(number).padStart(3, "0")}`, twinIds: [], similarIds: [] },
    usageProfiles: [],
    releaseStatus: "locked"
  };
}

function database() {
  const questions = [question(1, "DP-TYP-A")];
  return {
    schemaVersion: 1,
    papers: [{ paperId: "DP-M22-TEST", sourceId: "DP-SRC-ABCDEF123456" }],
    questions,
    typeCatalog: dbCore.rebuildTypeCatalog(questions),
    summary: dbCore.summarize({ papers: [], questions, typeCatalog: [] })
  };
}

test("applies a source-located method review without storing problem content", () => {
  const output = applyMethodReview(database(), {
    schemaVersion: "highselect-dolpa-method-review/v1",
    reviewId: "dp-m22-method-review-v1",
    sourceId: "DP-SRC-ABCDEF123456",
    paperId: "DP-M22-TEST",
    reviews: [{
      questionId: "DP-Q-ABCDEF123456-001",
      number: 1,
      solutionArchetype: "평행선에서 생기는 닮음비를 이어 목표 길이를 구한다.",
      tags: ["닮음", "평행선"],
      evidenceLocator: "p.3 Q1",
      confidence: "high"
    }]
  });
  assert.equal(output.questions[0].method.status, "verified");
  assert.equal(output.questions[0].method.solutionArchetype, "평행선에서 생기는 닮음비를 이어 목표 길이를 구한다.");
  assert.deepEqual(output.questions[0].method.evidence, ["dp-m22-method-review-v1:p.3 Q1"]);
  assert.equal(output.typeCatalog[0].methodStatus, "verified");
  assert.equal(output.summary.methodVerifiedCount, 1);
  assert.deepEqual(output.methodReviews, [{
    reviewId: "dp-m22-method-review-v1",
    sourceId: "DP-SRC-ABCDEF123456",
    paperId: "DP-M22-TEST",
    reviewedAt: "",
    reviewedQuestionCount: 1
  }]);
  assert.equal(JSON.stringify(output).includes("problem content"), false);
});

test("rejects an unknown question locator", () => {
  assert.throws(() => applyMethodReview(database(), {
    schemaVersion: "highselect-dolpa-method-review/v1",
    reviewId: "dp-m22-method-review-v1",
    sourceId: "DP-SRC-ABCDEF123456",
    paperId: "DP-M22-TEST",
    reviews: [{
      questionId: "DP-Q-ABCDEF123456-002",
      number: 2,
      solutionArchetype: "평행선에서 생기는 닮음비를 이어 목표 길이를 구한다.",
      tags: ["닮음", "평행선"],
      evidenceLocator: "p.3 Q2",
      confidence: "high"
    }]
  }), /일치하지 않습니다/);
});
