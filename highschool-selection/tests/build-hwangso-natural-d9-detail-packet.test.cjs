"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-natural-d9-detail-packet.cjs");
const job = (page, slot, sourceItemId) => ({ sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" });

test("황소 자연수 D9는 97~100번 네 문항을 서로 다른 풀이 구조로 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(28, 7, "q97"), job(28, 8, "q98"), job(28, 9, "q99"), job(28, 10, "q100")
  ] }] });
  assert.equal(packet.sources[0].itemReviews.length, 4);
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "세 수의 최소공배수 조건으로 가능한 자연수 여러 개 찾기",
    "세 수의 최대공약수와 최소공배수로 가능한 자연수 찾기",
    "세 수의 최대공약수와 최소공배수 조건을 만족하는 세 자리 수의 합",
    "쌍별 최대공약수와 최소공배수로 순서가 정해진 세 자연수 찾기"
  ]);
});

test("여러 예제가 합쳐지거나 얇게 잘린 세 영역은 위치 재작업으로 넘긴다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(4, 1, "q-p4"), job(6, 1, "q-p6"), job(12, 3, "q-p12")
  ] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.equal(packet.deferred.length, 3);
  assert.match(packet.deferred[0].reason, /예제 1-2.*예제 1-3.*예제 1-4/);
  assert.match(packet.deferred[1].reason, /예제 3-1.*예제 3-2.*예제 3-3/);
  assert.match(packet.deferred[2].reason, /예제 9-3.*매우 얇게 잘린/);
});

test("D9의 일곱 위치는 검수 규칙 또는 보류 사유를 모두 갖는다", () => {
  const reviewedKeys = new Set(Object.entries(packetBuilder.PAGE_RULES).flatMap(([page, slots]) => Object.keys(slots).map(slot => `${page}:${slot}`)));
  const covered = new Set([...reviewedKeys, ...packetBuilder.DEFERRED.keys()]);
  assert.deepEqual([...covered].sort(), [...packetBuilder.TARGET_KEYS].sort());
  assert.equal(reviewedKeys.size, 4);
  assert.equal(packetBuilder.DEFERRED.size, 3);
});

test("D9 밖의 문항은 이 묶음에서 다시 처리하지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(29, 1, "q-other"), job(28, 7, "q-d9")] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.sourceItemId), ["q-d9"]);
});
