"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d2-detail-packet.cjs");

function job(page, slot, sourceItemId) {
  return { sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" };
}

test("황소 중2-1 D2는 연립방정식·부등식 문항의 세부유형을 원본 위치대로 고정한다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{
      sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
      jobs: [job(62, 5, "q-system"), job(72, 12, "q-range"), job(84, 10, "q-mixture")]
    }]
  });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "동차 연립방정식의 자명하지 않은 해",
    "반올림된 수와 일차식의 값의 범위",
    "농도 범위의 연립부등식 활용"
  ]);
  packet.sources[0].itemReviews.forEach(review => {
    assert.equal(review.classificationStatus, "reviewed_detail");
    assert.equal(review.detailPrecision, "verified");
    assert.match(review.evidenceLocator, /^PDF p\.\d+, slot \d+$/);
    assert.equal(Object.hasOwn(review, "answer"), false);
    assert.equal(Object.hasOwn(review, "path"), false);
  });
});

test("잘리거나 여러 문항이 합쳐진 영역은 검수 완료로 승격하지 않는다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(86, 1, "q-merged"), job(87, 1, "q-cropped")] }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.deepEqual(packet.deferred.map(item => item.sourceItemId), ["q-merged", "q-cropped"]);
  assert.ok(packet.deferred.every(item => item.reason.length > 20));
});

test("시각 검수하지 않은 쪽과 칸은 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(70, 1, "q-divider")] }]
  }), /시각 검수 규칙이 없는 문항/);
});

test("완료 문항이 대기열에서 빠져도 통합 검수표로 같은 묶음을 다시 만든다", () => {
  const packet = packetBuilder.buildPacket({
    reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.83, slot 1`] }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "속력과 시간의 일차부등식 활용");
});
