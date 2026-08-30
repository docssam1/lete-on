"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { applyClassificationReview } = require("../scripts/apply-dolpa-classification-review.cjs");

function fixture() {
  return {
    schemaVersion: 1,
    papers: [{ paperId: "DP-M21A", sourceId: "DP-SRC-A64644977758" }],
    typeCatalog: [],
    questions: [{
      questionId: "DP-Q-A64644977758-025",
      sourceId: "DP-SRC-A64644977758",
      paperId: "DP-M21A",
      number: 25,
      classification: {
        semester: "중1-1", domain: "문자와 식", unit: "일차방정식의 활용", majorUnit: "문자와 식",
        minorUnit: "일차방정식의 활용", typeId: "OLD", typeLabel: "거리 범위", status: "verified", evidence: ["old"]
      },
      locator: { page: 9, slot: 1, status: "verified", evidence: ["old"] },
      method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
      difficulty: { band: null, status: "pending", evidence: [] },
      responseFormat: { kind: "short_answer", slotCount: 1, status: "verified", evidence: ["old"] },
      answerCheck: { status: "verified", evidence: ["old"] },
      variantSet: { status: "not_started", originalId: "DP-Q-A64644977758-025", twinIds: [], similarIds: [] },
      usageProfiles: [], releaseStatus: "locked"
    }]
  };
}

test("원본 대조 분류 교정은 유형 ID와 유형 목록을 함께 다시 만든다", () => {
  const output = applyClassificationReview(fixture(), {
    schemaVersion: "highselect-dolpa-classification-review/v1",
    reviewId: "m21a-correction",
    sourceId: "DP-SRC-A64644977758",
    paperId: "DP-M21A",
    reviewedAt: "2026-08-29",
    reviews: [{
      questionId: "DP-Q-A64644977758-025", number: 25, semester: "중2-1", unit: "일차부등식의 활용",
      typeLabel: "되돌아간 이동 시간으로 거리의 상한 구하기", evidenceLocator: "p.9 Q25", reason: "정확한 값이 아닌 상한을 묻는다."
    }]
  });
  const question = output.questions[0];
  assert.equal(question.classification.semester, "중2-1");
  assert.equal(question.classification.unit, "일차부등식의 활용");
  assert.equal(question.classification.domain, "문자와 식");
  assert.notEqual(question.classification.typeId, "OLD");
  assert.equal(output.typeCatalog[0].typeId, question.classification.typeId);
  assert.equal(output.classificationReviews[0].reviewedQuestionCount, 1);
  assert.equal(output.classificationReviews[0].normalizedDomainCount, 0);
});

test("분류 교정은 검수표에 없는 다른 시험지 문항을 바꾸지 않는다", () => {
  const input = fixture();
  input.questions.push({
    ...input.questions[0],
    questionId: "DP-Q-OTHER-001",
    sourceId: "DP-SRC-OTHER0000000",
    paperId: "DP-OTHER",
    number: 1,
    classification: {
      semester: "중1-1", domain: "기하", unit: "좌표평면과 그래프", majorUnit: "기하",
      minorUnit: "좌표평면과 그래프", typeId: "COORD", typeLabel: "정비례 그래프", status: "verified", evidence: ["old"]
    }
  });
  input.papers.push({ paperId: "DP-OTHER", sourceId: "DP-SRC-OTHER0000000" });
  const packet = {
    schemaVersion: "highselect-dolpa-classification-review/v1", reviewId: "m21a-correction", sourceId: "DP-SRC-A64644977758",
    paperId: "DP-M21A", reviewedAt: "2026-08-29", reviews: [{ questionId: "DP-Q-A64644977758-025", number: 25,
      semester: "중2-1", unit: "일차부등식의 활용", typeLabel: "거리 상한", evidenceLocator: "p.9 Q25", reason: "범위" }]
  };
  const output = applyClassificationReview(input, packet);
  const coordinate = output.questions.find(question => question.questionId === "DP-Q-OTHER-001");
  assert.equal(coordinate.classification.domain, "기하");
  assert.equal(coordinate.classification.majorUnit, "기하");
  assert.deepEqual(coordinate.classification.evidence, ["old"]);
  assert.equal(output.classificationReviews[0].normalizedDomainCount, 0);
});

test("원본과 다른 시험지의 교정표는 적용하지 않는다", () => {
  const packet = {
    schemaVersion: "highselect-dolpa-classification-review/v1", reviewId: "wrong", sourceId: "DP-SRC-A64644977758",
    paperId: "DP-OTHER", reviewedAt: "2026-08-29", reviews: [{ questionId: "DP-Q-A64644977758-025", number: 25,
      semester: "중2-1", unit: "일차부등식의 활용", typeLabel: "거리 상한", evidenceLocator: "p.9 Q25", reason: "범위" }]
  };
  assert.throws(() => applyClassificationReview(fixture(), packet), /시험지 원본이 일치하지 않습니다/);
});
