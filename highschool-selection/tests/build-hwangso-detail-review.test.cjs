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

function deferredPacket(sourceItemId = "Q2") {
  return {
    schemaVersion: 1,
    sources: [{ sourceMemoryId: "MEM-1", title: "황소 교재", itemReviews: [] }],
    deferred: [{ sourceItemId, evidenceLocator: "PDF p.3, slot 1", reason: "서로 다른 두 문항이 한 영역에 묶여 위치를 다시 만들어야 함." }]
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

  const unsafeSource = packet();
  unsafeSource.sources[0].sourcePath = "D:/private/book.pdf";
  assert.throws(() => builder.buildReview(curriculum(), [unsafeSource]), /unsafe_keys/);

  const copiedText = packet();
  copiedText.sources[0].itemReviews[0].note = "문제 원문 ".repeat(60);
  assert.throws(() => builder.buildReview(curriculum(), [copiedText]), /length/);
});

test("검수 묶음 목록이 없는 빌드 설정은 받지 않는다", () => {
  assert.throws(() => builder.loadConfig({ curriculumReviews: "curriculum.json", packets: [] }), /빌드 설정/);
  assert.throws(() => builder.loadConfig({ packets: ["packet.json"] }), /빌드 설정/);
});

test("위치를 다시 만들어야 하는 문항은 단원 분류를 보존하고 별도 상태로 기록한다", () => {
  const output = builder.buildReview(curriculum(), [deferredPacket()]);
  const deferred = output.reviews.find(review => review.sourceItemId === "Q2");
  assert.equal(output.summary.deferredItemCount, 1);
  assert.equal(deferred.detailPrecision, "unit_only");
  assert.equal(deferred.sourceTypeId, "SH-UNT-1");
  assert.equal(deferred.detailReviewStatus, "locator_rebuild_required");
  assert.match(deferred.detailReviewReason, /위치를 다시/);
  assert.equal(deferred.detailReviewEvidence, "MEM-1:PDF p.3, slot 1");
});

test("뒤 묶음에서 완전한 문항으로 확인되면 앞의 보류 기록을 해제한다", () => {
  const output = builder.buildReview(curriculum(), [deferredPacket("Q1"), packet()]);
  const reviewed = output.reviews.find(review => review.sourceItemId === "Q1");
  assert.equal(reviewed.detailPrecision, "verified");
  assert.equal(reviewed.detailReviewStatus, undefined);
  assert.equal(output.summary.deferredItemCount, 0);
});

test("보류 기록도 원문·정답·경로 필드와 불완전한 근거를 받지 않는다", () => {
  const unsafe = deferredPacket();
  unsafe.deferred[0].answer = 17;
  assert.throws(() => builder.buildReview(curriculum(), [unsafe]), /unsafe_keys/);

  const noReason = deferredPacket();
  noReason.deferred[0].reason = "";
  assert.throws(() => builder.buildReview(curriculum(), [noReason]), /reason/);
});

test("같은 묶음에서 한 문항을 검수 완료와 위치 재작업으로 동시에 기록하지 않는다", () => {
  const conflict = packet();
  conflict.deferred = deferredPacket("Q1").deferred;
  assert.throws(() => builder.buildReview(curriculum(), [conflict]), /완료와 위치 재작업/);
});
