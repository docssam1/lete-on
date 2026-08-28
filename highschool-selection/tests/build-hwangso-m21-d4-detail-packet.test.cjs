"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d4-detail-packet.cjs");

const job = (page, slot, sourceItemId) => ({ sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" });

test("황소 중2-1 D4는 유리수와 순환소수 확인학습을 세부유형에 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(119, 6, "q-digit"), job(121, 6, "q-error"), job(122, 18, "q-three")] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "분수의 순환소수에서 특정 자리 숫자",
    "분자·분모를 바꿔 얻은 순환소수 복원",
    "세 순환소수의 자리 숫자 조건"
  ]);
  assert.ok(packet.sources[0].itemReviews.every(review => review.classificationStatus === "reviewed_detail" && review.detailPrecision === "verified"));
});

test("한 영역에 여러 소문항이 있으면 분할 권장 기록을 남긴다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(118, 1, "q-block"), job(121, 10, "q-arithmetic")] }] });
  assert.ok(packet.sources[0].itemReviews.every(review => review.note.includes("분할을 권장")));
});

test("통합 검수표로도 D4 문항을 다시 만들 수 있다", () => {
  const packet = packetBuilder.buildPacket({ reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.122, slot 17`] }] });
  assert.equal(packet.sources[0].itemReviews[0].detailType, "순환소수가 있는 연립방정식");
});

test("시각 검수하지 않은 위치는 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(118, 3, "q-unknown")] }] }), /시각 검수 규칙이 없는 문항/);
});
