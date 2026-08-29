"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const merger = require("../scripts/merge-hwangso-detail-rule-parts.cjs");

const queue = { sources: [{ sourceMemoryId: "MEM-1", jobs: [
  { sourceItemId: "Q1", locator: { page: 2, slot: 1 } },
  { sourceItemId: "Q2", locator: { page: 8, slot: 2 } }
] }] };
const review = { sourceItemId: "Q1", page: 2, slot: 1, detailType: "나머지 조건으로 수 찾기", solutionArchetype: "나눗셈식으로 가능한 수를 확인한다" };
const deferred = { sourceItemId: "Q2", page: 8, slot: 2, reason: "두 문항이 한 영역에 섞여 새 위치가 필요함." };

function parts() {
  return [
    { schemaVersion: 1, sourceMemoryId: "MEM-1", title: "황소 교재", pageStart: 2, pageEnd: 4, itemReviews: [review], deferred: [] },
    { schemaVersion: 1, sourceMemoryId: "MEM-1", title: "황소 교재", pageStart: 5, pageEnd: 9, itemReviews: [], deferred: [deferred] }
  ];
}

test("여러 담당 구간의 검수 결과를 원본 전체 규칙 하나로 합친다", () => {
  const spec = merger.mergeParts(queue, parts());
  assert.equal(spec.coverageMode, "complete_source");
  assert.equal(spec.itemReviews.length, 1);
  assert.equal(spec.deferred.length, 1);
});

test("담당 구간 밖 문항과 중복 문항을 막는다", () => {
  const outOfRange = parts();
  outOfRange[0].itemReviews[0] = { ...review, page: 7 };
  assert.throws(() => merger.mergeParts(queue, outOfRange), /담당 쪽 범위/);

  const duplicate = parts();
  duplicate[1].deferred[0] = { ...deferred, sourceItemId: "Q1" };
  assert.throws(() => merger.mergeParts(queue, duplicate), /중복/);
});

test("원본 정보와 안전한 필드가 다른 분할 검수표를 거부한다", () => {
  const wrongSource = parts();
  wrongSource[1].sourceMemoryId = "MEM-2";
  assert.throws(() => merger.mergeParts(queue, wrongSource), /원본 정보/);

  const unsafe = parts();
  unsafe[0].sourcePath = "G:/private/book.pdf";
  assert.throws(() => merger.mergeParts(queue, unsafe), /형식/);
});
