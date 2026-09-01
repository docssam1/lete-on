"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildQueue } = require("../scripts/build-dolpa-detail-work-queue.cjs");

function tasks(overrides = {}) {
  return Object.assign({
    coverReview: { status: "verified" },
    bodyReview: { status: "verified" },
    answerReview: { status: "verified" },
    questionSegmentation: { status: "verified" },
    typeClassification: { status: "verified" },
    difficultyReview: { status: "verified" },
    learnerFitReview: { status: "pending" },
    analysisReport: { status: "verified" }
  }, overrides);
}

test("원본 세부 검수와 학습 적합성 대기열을 분리한다", () => {
  const ledger = { sources: [
    { sourceId: "SRC-A", familyHint: "입반시험", courseHint: "중2-1", conversion: { status: "변환 완료" }, tasks: tasks({ bodyReview: { status: "pending" } }) },
    { sourceId: "SRC-B", familyHint: "입반시험", courseHint: "중2-1", conversion: { status: "변환 완료" }, tasks: tasks() }
  ] };
  const database = { questions: [{ sourceId: "SRC-B" }] };
  const plan = { targets: [{ targetId: "target", sourcePapersToReview: [{ sourceId: "SRC-A", role: "primary" }] }] };
  const queue = buildQueue(ledger, database, plan, "2026-08-31");
  assert.deepEqual(queue.sourceAuditQueue.map(item => item.sourceId), ["SRC-A"]);
  assert.deepEqual(queue.sourceAuditQueue[0].pendingTasks, ["bodyReview"]);
  assert.deepEqual(queue.learnerFitQueue.map(item => item.sourceId), ["SRC-B"]);
  assert.equal(queue.learnerFitQueue[0].questionCount, 1);
});

test("변환 또는 표지 확인이 끝나지 않은 원본은 세부 검수 대기열에 넣지 않는다", () => {
  const ledger = { sources: [
    { sourceId: "SRC-A", conversion: { status: "대기" }, tasks: tasks({ bodyReview: { status: "pending" } }) },
    { sourceId: "SRC-B", conversion: { status: "변환 완료" }, tasks: tasks({ coverReview: { status: "pending" }, bodyReview: { status: "pending" } }) }
  ] };
  const queue = buildQueue(ledger, { questions: [] }, { targets: [] }, "2026-08-31");
  assert.equal(queue.sourceAuditQueue.length, 0);
  assert.equal(queue.learnerFitQueue.length, 0);
});

test("정답 이견이 남은 전체 검수본을 다시 원본 감사에 넣지 않는다", () => {
  const ledger = { sources: [{
    sourceId: "SRC-A",
    conversion: { status: "변환 완료" },
    tasks: tasks({ answerReview: { status: "sampled" } })
  }] };
  const queue = buildQueue(ledger, { questions: [] }, { targets: [] }, "2026-08-31");
  assert.equal(queue.sourceAuditQueue.length, 0);
  assert.deepEqual(queue.answerExceptionQueue.map(item => item.sourceId), ["SRC-A"]);
  assert.deepEqual(queue.learnerFitQueue.map(item => item.sourceId), ["SRC-A"]);
  assert.equal(queue.summary.detailedSourceCount, 1);
});

test("기존 대표 시험과 완전히 같은 보조 원본은 다시 검수하지 않는다", () => {
  const notApplicable = Object.fromEntries(Object.keys(tasks()).map(key => [key, { status: key === "coverReview" ? "verified" : "not_applicable" }]));
  const ledger = { sources: [{ sourceId: "SRC-ALT", conversion: { status: "변환 완료" }, tasks: notApplicable }] };
  const queue = buildQueue(ledger, { questions: [] }, { targets: [] }, "2026-08-31");
  assert.equal(queue.sourceAuditQueue.length, 0);
  assert.equal(queue.answerExceptionQueue.length, 0);
  assert.equal(queue.learnerFitQueue.length, 0);
  assert.equal(queue.summary.detailedSourceCount, 1);
});
