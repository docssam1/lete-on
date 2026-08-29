"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d6-detail-packet.cjs");
const job = (page, slot, sourceItemId) => ({ sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" });

test("황소 중2-1 D6는 연립방정식과 부등식 문항을 실제 풀이 구조에 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(144, 17, "q-three-lines"), job(152, 6, "q-parameter"), job(155, 7, "q-circle"), job(162, 13, "q-empty")
  ] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "세 직선이 한 점에서 만날 조건",
    "매개변수 값에 따라 해 없음과 무수히 많음을 나누기",
    "원형 길에서 반대·같은 방향으로 만나는 시간",
    "연립부등식의 공통해가 없도록 문자 범위 정하기"
  ]);
});

test("잘리거나 서로 다른 문제가 섞인 네 영역은 검수 완료로 올리지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(159, 1, "q-thin-1"), job(159, 2, "q-mixed-1"), job(160, 1, "q-thin-2"), job(160, 2, "q-mixed-2")
  ] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.equal(packet.deferred.length, 4);
  assert.ok(packet.deferred.every(item => item.reason.length > 20));
});

test("합쳐진 소문항과 다음 쪽에 빠진 연속 문항을 함께 기록한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(145, 1, "q-system-block"), job(147, 8, "q-chain-block"), job(149, 5, "q-three-variable-block"), job(157, 9, "q-inequality-block")
  ] }] });
  const notes = packet.sources[0].itemReviews.map(review => review.note);
  assert.ok(notes.every(note => note.includes("문항별 분할")));
  assert.match(notes[0], /146쪽의 11번/);
  assert.match(notes[1], /148쪽의 20번/);
  assert.match(notes[2], /150쪽의 21번/);
  assert.match(notes[3], /158쪽의 14번/);
});

test("162쪽 33번은 원본에서 완전한 문항으로 확인해 계수 부호별 해 분류로 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(162, 8, "q-parameter-sign")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "문자 계수의 부호에 따라 일차부등식 해 분류하기");
});

test("통합 검수표로도 D6 문항을 다시 만들 수 있다", () => {
  const packet = packetBuilder.buildPacket({ reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.153, slot 8`] }] });
  assert.equal(packet.sources[0].itemReviews[0].detailType, "두 합금의 성분 비율로 필요한 혼합량 구하기");
});

test("시각 검수하지 않은 위치는 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(148, 1, "q-unknown")] }] }), /시각 검수 규칙이 없는 문항/);
});
