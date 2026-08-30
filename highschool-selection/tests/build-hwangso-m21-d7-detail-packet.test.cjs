"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const packetBuilder = require("../scripts/build-hwangso-m21-d7-detail-packet.cjs");
const job = (page, slot, sourceItemId) => ({ sourceItemId, sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, locator: { page, slot, kind: "exercise" }, status: "detail_review_pending" });

test("황소 중2-1 D7은 부등식 활용과 일차함수 문항을 실제 풀이 구조에 연결한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [
    job(163, 14, "q-interval"), job(166, 10, "q-rounded-ratio"), job(169, 9, "q-bisector"), job(176, 12, "q-segment")
  ] }] });
  assert.deepEqual(packet.sources[0].itemReviews.map(review => review.detailType), [
    "한 열린구간이 다른 열린구간에 포함될 문자 범위",
    "반올림된 비율과 추가 시행 뒤 정확한 비율로 이전 성공 횟수 구하기",
    "절편 삼각형을 원점에서 넓이 이등분하는 직선의 기울기",
    "한 점을 지나는 직선군이 선분과 만나게 하는 기울기 범위"
  ]);
});

test("163~178쪽 정상 위치 109개를 빠짐없이 규칙으로 갖고 있다", () => {
  const count = Object.values(packetBuilder.PAGE_RULES).reduce((sum, pageRules) => sum + Object.keys(pageRules).length, 0);
  assert.equal(count, 109);
  assert.equal(packetBuilder.PAGE_RULES[177], undefined);
});

test("177쪽의 서로 다른 일곱 문제가 섞인 큰 영역은 검수 완료로 올리지 않는다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(177, 1, "q-mixed-page")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 0);
  assert.equal(packet.deferred.length, 1);
  assert.match(packet.deferred[0].reason, /76~82번/);
  assert.match(packet.deferred[0].reason, /각각 독립 문항 영역/);
});

test("172쪽 37번은 풀이 구조가 다른 세 소문항의 분할 권고를 기록한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(172, 6, "q-three-line-equations")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.match(packet.sources[0].itemReviews[0].note, /문항별 분할/);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "평행·두 점·수평선 조건으로 직선 방정식 세우기 묶음");
});

test("보기형 문항은 선택지를 흩뜨리지 않고 한 문항으로 유지한다", () => {
  const packet = packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(167, 7, "q-context-options"), job(168, 12, "q-graph-options")] }] });
  assert.equal(packet.sources[0].itemReviews.length, 2);
  assert.equal(packet.sources[0].itemReviews[0].detailType, "생활 관계에서 일차함수인 상황 모두 고르기");
  assert.equal(packet.sources[0].itemReviews[1].detailType, "일차함수 그래프에서 기울기·절편·함숫값 보기 판단");
});

test("통합 검수표로도 D7 문항을 다시 만들 수 있다", () => {
  const packet = packetBuilder.buildPacket({ reviews: [{ sourceItemId: "q-reviewed", sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, evidence: [`${packetBuilder.SOURCE_MEMORY_ID}:PDF p.178, slot 5`] }] });
  assert.equal(packet.sources[0].itemReviews[0].detailType, "네 점까지 거리 합이 최소인 점의 좌표");
});

test("시각 검수하지 않은 위치는 자동 분류하지 않는다", () => {
  assert.throws(() => packetBuilder.buildPacket({ sources: [{ sourceMemoryId: packetBuilder.SOURCE_MEMORY_ID, jobs: [job(163, 1, "q-unknown")] }] }), /시각 검수 규칙이 없는 문항/);
});
