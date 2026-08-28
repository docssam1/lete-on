"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d8-detail-packet.cjs");
const job = (page, slot, sourceItemId) => ({
  sourceItemId,
  sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
  locator: { page, slot, kind: "exercise" },
  status: "detail_review_pending"
});

test("황소 중2-1 D8은 완전한 단일 문항 두 개만 세부 유형에 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(102, 10, "q-no-intersection"), job(110, 10, "q-segment-slope")
  ] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "두 직선이 만나지 않도록 문자 값 구하기",
    "고정된 y절편의 직선이 선분과 만나게 하는 기울기 범위"
  ]);
  assert.equal(packet.deferred.length, 0);
});

test("잘린 조각과 여러 문항이 섞인 다섯 영역은 검수 완료로 올리지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(86, 1, "q-p86"), job(87, 1, "q-p87"), job(101, 2, "q-p101"), job(134, 1, "q-p134"), job(135, 1, "q-p135")
  ] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.equal(packet.deferred.length, 5);
  assert.match(packet.deferred.find(entry => entry.sourceItemId === "q-p86").reason, /6~10번/);
  assert.match(packet.deferred.find(entry => entry.sourceItemId === "q-p87").reason, /11~15번/);
  assert.match(packet.deferred.find(entry => entry.sourceItemId === "q-p101").reason, /예제 8-2/);
  assert.match(packet.deferred.find(entry => entry.sourceItemId === "q-p134").reason, /60\(1\)~60\(8\)/);
  assert.match(packet.deferred.find(entry => entry.sourceItemId === "q-p135").reason, /60\(9\)~60\(20\)/);
});

test("D8 대상 위치 일곱 개는 검수 규칙 또는 보류 사유를 빠짐없이 갖는다", () => {
  const reviewedKeys = new Set(Object.entries(packetBuilder.PAGE_RULES).flatMap(([page, slots]) => Object.keys(slots).map(slot => `${page}:${slot}`)));
  const covered = new Set([...reviewedKeys, ...packetBuilder.DEFERRED.keys()]);
  assert.deepEqual([...covered].sort(), [...packetBuilder.TARGET_KEYS].sort());
  assert.equal(reviewedKeys.size, 2);
  assert.equal(packetBuilder.DEFERRED.size, 5);
});

test("135쪽 묶음은 네 소문항을 하나의 재사용 유형으로 합치지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(135, 1, "q-four-items")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.match(packet.deferred[0].reason, /네 개의 독립 문항 위치/);
});

test("D6·D7에서 이미 다룬 위치와 D8 밖의 문항은 다시 처리하지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(159, 1, "q-d6"), job(177, 1, "q-d7"), job(100, 1, "q-other"), job(102, 10, "q-d8")
  ] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.sourceItemId), ["q-d8"]);
  assert.equal(packet.deferred.length, 0);
});

test("통합 검수표로도 D8 검수 완료 문항을 다시 만들 수 있다", () => {
  const packet = packetBuilder.buildPacket({ reviews: [{
    sourceItemId: "q-reviewed",
    sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID,
    evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.110, slot 10`]
  }] });
  assert.equal(packet.sources[0].itemReviews[0].detailType, "고정된 y절편의 직선이 선분과 만나게 하는 기울기 범위");
});
