"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-hwangso-detail-work-queue.cjs");

function index() {
  return {
    items: [
      { id: "Q1", sourceRef: "SRC-1", locator: { page: 2, slot: 1, kind: "example", box: { x: 0.1, y: 0.2, width: 0.3, height: 0.4 } }, releaseStatus: "locked", discoveryStatus: "visual_verified" },
      { id: "Q2", sourceRef: "SRC-1", locator: { page: 3, slot: 1, kind: "exercise", box: { x: 0.2, y: 0.3, width: 0.3, height: 0.2 } }, releaseStatus: "locked", discoveryStatus: "visual_verified" },
      { id: "Q3", sourceRef: "SRC-1", locator: { page: 9, slot: 1, kind: "exercise", box: { x: 0.2, y: 0.3, width: 0.3, height: 0.2 } }, releaseStatus: "locked", discoveryStatus: "visual_verified" }
    ],
    rejectedCandidates: []
  };
}

function reviews() {
  return {
    sourceBankId: "HWANGSO-MIDDLE",
    reviews: [
      { sourceItemId: "Q1", sourceMemoryId: "MEM-1", sourceRef: "SRC-1", semester: "중1-1", majorUnit: "수와 연산", minorUnit: "소인수분해", detailPrecision: "verified" },
      { sourceItemId: "Q2", sourceMemoryId: "MEM-1", sourceRef: "SRC-1", semester: "중1-1", majorUnit: "수와 연산", minorUnit: "소인수분해", detailPrecision: "unit_only" },
      { sourceItemId: "Q3", sourceMemoryId: "MEM-1", sourceRef: "SRC-1", semester: "중1-1", majorUnit: null, minorUnit: null, detailPrecision: "pending" }
    ]
  };
}

test("세부유형이 남은 문항만 원본 쪽·문항 위치와 함께 대기열에 넣는다", () => {
  const output = builder.buildQueue(index(), reviews());
  assert.equal(output.summary.activeItemCount, 3);
  assert.equal(output.summary.reviewedDetailItemCount, 1);
  assert.equal(output.summary.pendingDetailItemCount, 1);
  assert.equal(output.summary.quarantinedItemCount, 1);
  assert.equal(output.sources[0].jobs[0].sourceItemId, "Q2");
  assert.deepEqual(output.sources[0].jobs[0].locator.box, { x: 0.2, y: 0.3, width: 0.3, height: 0.2 });
});

test("검수표가 활성 문항을 빠뜨리거나 ID를 중복하면 대기열 생성을 막는다", () => {
  const missing = reviews();
  missing.reviews.pop();
  assert.throws(() => builder.buildQueue(index(), missing), /문항 수가 다릅니다/);

  const duplicate = reviews();
  duplicate.reviews[2].sourceItemId = "Q2";
  assert.throws(() => builder.buildQueue(index(), duplicate), /중복/);
});

test("위치 재작업 문항은 일반 세부 검수에서 빼고 별도 목록에 남긴다", () => {
  const input = reviews();
  Object.assign(input.reviews[1], {
    detailReviewStatus: "locator_rebuild_required",
    detailReviewReason: "여러 문제가 한 영역에 섞임",
    detailReviewEvidence: "MEM-1:PDF p.3, slot 1"
  });
  const output = builder.buildQueue(index(), input);
  assert.equal(output.summary.pendingDetailItemCount, 0);
  assert.equal(output.summary.locatorRebuildItemCount, 1);
  assert.equal(output.locatorRebuilds[0].sourceItemId, "Q2");
  assert.equal(output.locatorRebuilds[0].status, "locator_rebuild_required");
  assert.match(output.locatorRebuilds[0].reason, /여러 문제/);
});
