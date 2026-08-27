"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-hwangso-detail-review.cjs");

function curriculum() {
  return {
    schemaVersion: 1,
    sourceBankId: "HWANGSO-MIDDLE",
    reviews: [
      {
        sourceItemId: "Q1", sourceMemoryId: "MEM-1", sourceUnitTypeId: "SH-UNT-1", semester: "중1-1",
        majorUnit: "수와 연산", minorUnit: "소인수분해", classificationStatus: "reviewed_unit", detailPrecision: "unit_only",
        evidence: ["MEM-1:p.1 단원 머리말"]
      },
      {
        sourceItemId: "Q2", sourceMemoryId: "MEM-1", sourceUnitTypeId: "SH-UNT-1", semester: "중1-1",
        majorUnit: "수와 연산", minorUnit: "소인수분해", classificationStatus: "reviewed_unit", detailPrecision: "unit_only",
        evidence: ["MEM-1:p.1 단원 머리말"]
      },
      {
        sourceItemId: "Q3", sourceMemoryId: "MEM-1", sourceUnitTypeId: null, semester: "중1-1",
        majorUnit: null, minorUnit: null, classificationStatus: "pending", detailPrecision: "pending",
        reviewReason: "풀이 페이지", evidence: ["MEM-1:p.9 풀이"]
      }
    ]
  };
}

function packet() {
  return {
    schemaVersion: 1,
    sources: [{
      sourceMemoryId: "MEM-1",
      title: "황소 교재",
      itemReviews: [{
        sourceItemId: "Q1",
        detailType: "조건에 맞는 소수 찾기",
        solutionArchetype: "소수의 정의와 약수 개수를 함께 확인",
        classificationStatus: "reviewed_detail",
        detailPrecision: "verified",
        evidenceLocator: "PDF p.2 첫째 문항",
        note: "원문 문항을 시각 확인"
      }]
    }]
  };
}

test("확인한 황소 문항만 세부유형으로 올리고 나머지는 기존 상태를 지킨다", () => {
  const output = builder.buildReview(curriculum(), [packet()]);
  assert.equal(output.summary.itemCount, 3);
  assert.equal(output.summary.reviewedDetailItemCount, 1);
  assert.equal(output.summary.unitOnlyItemCount, 1);
  assert.equal(output.summary.pendingItemCount, 1);
  assert.match(output.reviews[0].sourceTypeId, /^SH-TYP-/);
  assert.equal(output.reviews[0].detailType, "조건에 맞는 소수 찾기");
  assert.equal(output.reviews[1].sourceTypeId, "SH-UNT-1");
  assert.equal(output.reviews[1].detailPrecision, "unit_only");
  assert.equal(output.reviews[2].sourceTypeId, null);
  assert.equal(output.reviews[2].detailPrecision, "pending");
});

test("보류 문항 승격과 중복 검수 및 근거 없는 분류를 막는다", () => {
  const pending = packet();
  pending.sources[0].itemReviews[0].sourceItemId = "Q3";
  assert.throws(() => builder.buildReview(curriculum(), [pending]), /올릴 수 없습니다/);

  assert.throws(() => builder.buildReview(curriculum(), [packet(), packet()]), /두 번 세부 검수/);

  const noEvidence = packet();
  noEvidence.sources[0].itemReviews[0].evidenceLocator = "";
  assert.throws(() => builder.buildReview(curriculum(), [noEvidence]), /evidence/);
});

test("검수 묶음은 원문·정답·경로 같은 위험한 필드를 받지 않는다", () => {
  const unsafe = packet();
  unsafe.sources[0].itemReviews[0].answer = 17;
  assert.throws(() => builder.buildReview(curriculum(), [unsafe]), /unsafe_keys/);

  const wrongSource = packet();
  wrongSource.sources[0].sourceMemoryId = "MEM-2";
  assert.throws(() => builder.buildReview(curriculum(), [wrongSource]), /원본 자료가 다릅니다/);
});
