"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d5-detail-packet.cjs");

const job = (page, slot, sourceItemId) => ({ sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" });

test("황소 중2-1 D5는 식의 계산 확인학습을 실제 풀이 구조에 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(123, 16, "q-exponent"), job(132, 5, "q-ratio"), job(139, 10, "q-telescope"), job(142, 12, "q-symmetric")
  ] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "같은 밑의 나눗셈으로 지수방정식 풀기",
    "이어진 두 비를 세 변수의 비로 맞춰 식의 값 구하기",
    "지수가 두 배씩 커지는 곱을 거듭제곱의 차로 합치기",
    "세 쌍의 합을 곱한 값 구하기"
  ]);
  assert.ok(packet.sources[0].itemReviews.every(review => review.classificationStatus === "reviewed_detail" && review.detailPrecision === "verified"));
});

test("잘리거나 여러 문제와 섞인 후보는 검수 완료로 올리지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(134, 1, "q-mixed"), job(135, 1, "q-cropped")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.deepEqual(packet.deferred.map(item => item.sourceItemId), ["q-mixed", "q-cropped"]);
  assert.ok(packet.deferred.every(item => item.reason.includes("영역")));
});

test("합쳐진 소문항과 다음 쪽에 빠진 연속 문항을 기록한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(127, 6, "q-block-30"), job(137, 8, "q-block-66"), job(143, 2, "q-two-results")] }] });
  const notes = packet.sources[0].itemReviews.map(review => review.note);
  assert.ok(notes.every(note => note.includes("문항별 분할")));
  assert.match(notes[0], /128쪽의 30번/);
  assert.match(notes[1], /138쪽의 66번/);
});

test("통합 검수표로도 D5 문항을 다시 만들 수 있다", () => {
  const packet = packetBuilder.buildPacket({ reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.141, slot 11`] }] });
  assert.equal(packet.sources[0].itemReviews[0].detailType, "삼차 주기로 높은 거듭제곱과 역수 계산하기");
});

test("시각 검수하지 않은 위치는 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(123, 1, "q-unknown")] }] }), /시각 검수 규칙이 없는 문항/);
});
