"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d1-detail-packet.cjs");

function job(page, slot, sourceItemId) {
  return {
    sourceItemId,
    sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
    locator: { page, slot, kind: "exercise" },
    status: "detail_review_pending"
  };
}

test("황소 중2-1 시각 검수표는 문항마다 세부유형과 풀이 구조를 고정한다", () => {
  const packet = packetBuilder.buildPacket({
    sources: [{
      sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
      jobs: [job(3, 2, "q-decimal"), job(45, 1, "q-symmetric"), job(60, 5, "q-system")]
    }]
  });
  const reviews = packet.sources[0].itemReviews;
  assert.deepEqual(reviews.map(review => review.detailType), [
    "분모의 소인수로 유한소수 판별",
    "두 문자의 대칭식 값 구하기",
    "미지수가 많은 연립방정식의 비와 값"
  ]);
  reviews.forEach(review => {
    assert.equal(review.classificationStatus, "reviewed_detail");
    assert.equal(review.detailPrecision, "verified");
    assert.ok(review.solutionArchetype.length > 10);
    assert.match(review.evidenceLocator, /^PDF p\.\d+, slot \d+$/);
    assert.equal(Object.hasOwn(review, "answer"), false);
    assert.equal(Object.hasOwn(review, "path"), false);
  });
});

test("시각 검수하지 않은 쪽과 칸은 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({
    sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(50, 1, "q-unreviewed")] }]
  }), /시각 검수 규칙이 없는 문항/);
});

test("완료 문항이 대기열에서 빠져도 통합 검수표로 같은 묶음을 다시 만든다", () => {
  const packet = packetBuilder.buildPacket({
    reviews: [{
      sourceItemId: "q-reviewed",
      sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
      evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.53, slot 1`]
    }]
  });
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "두 일차방정식의 그래프와 교점");
});
