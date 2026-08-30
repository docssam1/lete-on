"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const builder = require("../scripts/build-hwangso-detail-packet-from-rules.cjs");

function queue() {
  return { sources: [{ sourceMemoryId: "MEM-1", jobs: [
    { sourceItemId: "Q1", locator: { page: 2, slot: 1 } },
    { sourceItemId: "Q2", locator: { page: 3, slot: 2 } }
  ] }] };
}

function rules() {
  return {
    schemaVersion: 1,
    coverageMode: "complete_source",
    sourceMemoryId: "MEM-1",
    title: "황소 교재",
    itemReviews: [{ sourceItemId: "Q1", page: 2, slot: 1, detailType: "나머지 조건으로 자연수 찾기", solutionArchetype: "나눗셈식을 세우고 가능한 자연수를 확인한다" }],
    deferred: [{ sourceItemId: "Q2", page: 3, slot: 2, reason: "서로 다른 두 문제가 한 영역에 묶여 새 위치가 필요함." }]
  };
}

test("완전한 원본 검수 규칙으로 표준 황소 패킷을 만든다", () => {
  const packet = builder.buildPacket(queue(), rules());
  assert.equal(packet.sources[0].itemReviews.length, 1);
  assert.equal(packet.deferred.length, 1);
  assert.equal(packet.sources[0].itemReviews[0].classificationStatus, "reviewed_detail");
  assert.equal(packet.sources[0].itemReviews[0].evidenceLocator, "PDF p.2, slot 1");
  assert.equal(packet.deferred[0].evidenceLocator, "PDF p.3, slot 2");
});

test("원문·정답·경로 같은 위험한 규칙 필드는 받지 않는다", () => {
  const unsafe = rules();
  unsafe.itemReviews[0].answer = 17;
  assert.throws(() => builder.buildPacket(queue(), unsafe), /unsafe_keys/);

  const unsafeDeferred = rules();
  unsafeDeferred.deferred[0].sourcePath = "G:/private/book.pdf";
  assert.throws(() => builder.buildPacket(queue(), unsafeDeferred), /unsafe_keys/);
});

test("대기열 전체를 빠짐없이 한 번씩 검수하지 않으면 중단한다", () => {
  const missing = rules();
  missing.deferred = [];
  assert.throws(() => builder.buildPacket(queue(), missing), /전체 규칙 수/);

  const duplicate = rules();
  duplicate.deferred[0].sourceItemId = "Q1";
  assert.throws(() => builder.buildPacket(queue(), duplicate), /duplicate/);
});

test("대기열과 다른 쪽·칸을 규칙에 적으면 중단한다", () => {
  const wrong = rules();
  wrong.itemReviews[0].page = 9;
  assert.throws(() => builder.buildPacket(queue(), wrong), /위치가 대기열과 다릅니다/);
});
