"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../scripts/apply-dolpa-question-exception-review.cjs");
const ledger = require("../scripts/build-dolpa-work-ledger.cjs");

function question(id, sourceId, paperId, number) {
  const semester = "중1-1";
  const unit = "일차방정식";
  const typeLabel = "이전 유형";
  return {
    questionId: id, sourceId, paperId, number,
    locator: { page: 3, slot: 1, status: "verified", evidence: ["old"] },
    classification: { semester, domain: "문자와 식", unit, majorUnit: "문자와 식", minorUnit: unit,
      typeId: ledger.stableTypeId(semester, unit, typeLabel), typeLabel, status: "verified", evidence: ["old"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
    difficulty: { band: "raised", status: "verified", evidence: ["old"] },
    responseFormat: { kind: "input", slotCount: 1, status: "verified", evidence: ["old"] },
    answerCheck: { status: "verified", evidence: ["old-answer"] },
    variantSet: { status: "not_started", originalId: id, twinIds: [], similarIds: [] },
    usageProfiles: [{ profileId: "DP_STANDARD", status: "source_verified", evidence: ["old"], reviewNote: "원본" }],
    releaseStatus: "locked"
  };
}

function database(questions) {
  return {
    schemaVersion: 1,
    papers: Array.from(new Map(questions.map(item => [item.paperId, {
      paperId: item.paperId, sourceId: item.sourceId, questionIds: [item.questionId], questionCount: 1
    }])).values()),
    questions,
    typeCatalog: [],
    profileCatalog: [],
    summary: {}
  };
}

test("지정한 두 문항만 올바른 새 유형으로 묶는다", () => {
  const one = question("DP-Q-AAAAAAAAAAAA-020", "DP-SRC-AAAAAAAAAAAA", "P-A", 20);
  const two = question("DP-Q-BBBBBBBBBBBB-020", "DP-SRC-BBBBBBBBBBBB", "P-B", 20);
  const untouched = question("DP-Q-CCCCCCCCCCCC-001", "DP-SRC-CCCCCCCCCCCC", "P-C", 1);
  const packet = {
    schemaVersion: "highselect-dolpa-type-correction-review/v1", reviewId: "q20-correction", reviewedAt: "2026-08-30",
    items: [one, two].map(item => ({ questionId: item.questionId, sourceId: item.sourceId, paperId: item.paperId, number: item.number,
      semester: "중2-1", unit: "일차함수", typeLabel: "두 절편이 주어진 직선 위 음의 정수 좌표점 개수 구하기",
      evidenceId: "visual-match", reason: "동일 문항을 직접 대조하고 잘못된 학기와 단원을 바로잡음" }))
  };
  const result = core.applyTypeCorrection(database([one, two, untouched]), packet);
  const expected = ledger.stableTypeId("중2-1", "일차함수", packet.items[0].typeLabel);
  assert.equal(result.questions[0].classification.typeId, expected);
  assert.equal(result.questions[1].classification.typeId, expected);
  assert.deepEqual(result.questions[2], untouched);
});

test("한 번의 정답 이견 검수로 동일 문항 두 곳을 잠그고 정답 값을 받지 않는다", () => {
  const one = question("DP-Q-AAAAAAAAAAAA-027", "DP-SRC-AAAAAAAAAAAA", "P-A", 27);
  const two = question("DP-Q-BBBBBBBBBBBB-027", "DP-SRC-BBBBBBBBBBBB", "P-B", 27);
  const packet = {
    schemaVersion: "highselect-dolpa-answer-dispute-review/v1", reviewId: "q27-dispute", reviewedAt: "2026-08-30", reviewCount: 1,
    items: [one, two].map(item => ({ questionId: item.questionId, sourceId: item.sourceId, paperId: item.paperId, number: item.number,
      evidenceId: "private-sidecar", reason: "공식 답과 독립 계산이 일치하지 않음",
      difficultyReason: "왕복 거리와 편도 깊이를 구별해야 하는 문제" }))
  };
  const result = core.applyAnswerDispute(database([one, two]), packet);
  result.questions.forEach(item => {
    assert.equal(item.answerCheck.status, "disputed");
    assert.equal(item.releaseStatus, "locked");
    assert.equal(item.usageProfiles[0].status, "candidate");
    assert.match(item.difficulty.reason, /왕복 거리/);
  });
  for (const key of [
    ["official", "answer"].join("_"),
    ["Derived", "Answer"].join("-"),
    ["ANSWER", "VALUE"].join(" ")
  ]) {
    const unsafe = structuredClone(packet);
    unsafe.items[0][key] = "비공개 값";
    assert.throws(() => core.validateDisputePacket(unsafe), /forbidden/);
  }
  const valueLeak = structuredClone(packet);
  valueLeak.items[0].reason = `공식 검토값 ${7 * 70}, 독립 검토값 ${6 * 80}`;
  assert.throws(() => core.validateDisputePacket(valueLeak), /numericLeak/);

  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(String(7 * 70)), false);
  assert.equal(serialized.includes(String(6 * 80)), false);
});
