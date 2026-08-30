"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d3-detail-packet.cjs");

function job(page, slot, sourceItemId) {
  return { sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" };
}

test("황소 중2-1 D3는 일차함수 문항을 원본 위치와 세부유형에 연결한다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{
      sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
      jobs: [job(93, 2, "q-sign"), job(98, 10, "q-slope-range"), job(112, 3, "q-reflection")]
    }]
  });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "일차함수 그래프와 계수의 부호",
    "선분을 지나는 직선의 기울기 범위",
    "대칭이동을 이용한 두 거리 합의 최솟값"
  ]);
  packet.sources[0].itemReviews.forEach(review => {
    assert.equal(review.classificationStatus, "reviewed_detail");
    assert.equal(review.detailPrecision, "verified");
    assert.match(review.evidenceLocator, /^PDF p\.\d+, slot \d+$/);
    assert.equal(Object.hasOwn(review, "answer"), false);
    assert.equal(Object.hasOwn(review, "path"), false);
  });
});

test("겹치거나 본문이 없는 중복 영역은 검수 완료로 승격하지 않는다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(101, 2, "q-label"), job(102, 10, "q-wide"), job(110, 10, "q-wide-2")] }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.deepEqual(packet.deferred.map(item => item.sourceItemId), ["q-label", "q-wide", "q-wide-2"]);
  assert.ok(packet.deferred.every(item => item.reason.length > 20));
});

test("여러 소문항이 합쳐진 영역은 세부유형을 붙이되 분할 권장 기록을 남긴다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(90, 1, "q-block"), job(95, 1, "q-examples")] }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 2);
  assert.ok(packet.sources[0].itemReviews.every(review => review.note.includes("분할을 권장")));
});

test("완료 문항이 대기열에서 빠져도 통합 검수표로 D3를 다시 만든다", () => {
  const packet = packetBuilder.buildPacket({
    reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.115, slot 5`] }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "두 직선의 교점이 특정 사분면에 있을 조건");
});

test("시각 검수하지 않은 쪽과 칸은 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(92, 1, "q-unreviewed")] }]
  }), /시각 검수 규칙이 없는 문항/);
});
