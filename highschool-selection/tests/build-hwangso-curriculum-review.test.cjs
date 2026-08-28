"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-hwangso-curriculum-review.cjs");

function index() {
  return {
    sources: [{ sourceRef: "SRC-1", privateSourceMemoryId: "MEM-1" }],
    items: [
      { id: "Q1", sourceRef: "SRC-1", locator: { page: 3 }, discoveryStatus: "visual_verified", releaseStatus: "locked" },
      { id: "Q2", sourceRef: "SRC-1", locator: { page: 8 }, discoveryStatus: "visual_verified", releaseStatus: "locked" }
    ],
    rejectedCandidates: []
  };
}

function packet() {
  return {
    schemaVersion: 1,
    sources: [{
      sourceMemoryId: "MEM-1", title: "교재", course: "중1-1",
      pageRanges: [
        { pageStart: 1, pageEnd: 5, majorUnit: "수와 연산", minorUnit: "소인수분해", status: "reviewed", evidenceLocator: "p.1 단원 머리말" },
        { pageStart: 6, pageEnd: 10, status: "pending", evidenceLocator: "p.6 풀이 기록지", note: "문제 페이지가 아니므로 보류" }
      ]
    }]
  };
}

test("원본 페이지 범위를 문항별 학기·대단원·소단원에 연결한다", () => {
  const output = builder.buildReview(index(), [packet()]);
  assert.equal(output.summary.itemCount, 2);
  assert.equal(output.summary.unitReviewedItemCount, 1);
  assert.equal(output.summary.pendingItemCount, 1);
  assert.match(output.reviews[0].sourceUnitTypeId, /^SH-UNT-/);
  assert.equal(output.reviews[0].semester, "중1-1");
  assert.equal(output.reviews[1].sourceUnitTypeId, null);
  assert.equal(output.reviews[1].reviewReason, "문제 페이지가 아니므로 보류");
  assert.deepEqual(output.reviews[1].evidence, ["MEM-1:p.6 풀이 기록지"]);
  assert.equal(output.summary.pendingReasonCount, 1);
});

test("겹친 페이지 범위와 범위 밖 문항은 자동 분류하지 않고 중단한다", () => {
  const overlap = packet();
  overlap.sources[0].pageRanges[1].pageStart = 5;
  assert.throws(() => builder.buildReview(index(), [overlap]), /overlapping_ranges/);

  const missing = packet();
  missing.sources[0].pageRanges[1].pageStart = 9;
  assert.throws(() => builder.buildReview(index(), [missing]), /한 범위/);
});

test("보류 범위에도 사유와 확인 위치가 반드시 있어야 한다", () => {
  const missingReason = packet();
  missingReason.sources[0].pageRanges[1].note = "";
  assert.throws(() => builder.buildReview(index(), [missingReason]), /pending_reason/);

  const missingEvidence = packet();
  missingEvidence.sources[0].pageRanges[1].evidenceLocator = "";
  assert.throws(() => builder.buildReview(index(), [missingEvidence]), /pending_reason/);
});
