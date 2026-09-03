"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { buildReport } = require("../scripts/build-dolpa-analysis-report.cjs");

function database() {
  const questions = Array.from({ length: 30 }, (_, index) => ({
    questionId: `DP-Q-8BB6E543C0F7-${String(index + 1).padStart(3, "0")}`,
    sourceId: "DP-SRC-8BB6E543C0F7",
    number: index + 1,
    classification: { semester: index < 10 ? "중1-1" : "중2-1", domain: index % 2 ? "기하" : "문자와 식", unit: "검수 단원", status: "verified" },
    locator: { page: 3 + Math.floor(index / 4), status: "verified", evidence: [`locator.${index + 1}`] },
    difficulty: { band: index < 7 ? "standard" : "raised", status: "verified" },
    responseFormat: { status: "verified" },
    answerCheck: { status: "verified", evidence: [`answer.${index + 1}`] }
  }));
  return {
    papers: [{ paperId: "DP-M22S-202403-R1", sourceId: "DP-SRC-8BB6E543C0F7", sourceFingerprint: "8".repeat(64), title: "대표 시험", coverage: { status: "verified", declaredScopeLabel: "중1-1~중2-1 전체" } }],
    questions
  };
}

test("검수 완료 대표 시험에서 그래프 값과 코멘트를 만든다", () => {
  const report = buildReport(database(), "DP-SRC-8BB6E543C0F7", "2026-08-29");
  assert.equal(report.summary.questionCount, 30);
  assert.equal(report.summary.standardCount, 7);
  assert.equal(report.summary.raisedCount, 23);
  assert.equal(report.charts.byDifficulty[1].count, 23);
  assert.equal(report.releaseStatus, "locked");
  assert.match(report.comments[0], /중1-1~중2-1 전체.*중2-1 20문항.*중1-1 10문항/);
  assert.match(report.comments.at(-1), /합격선.*추정하지 않는다/);
  assert.equal(report.evidence.length, 30);
  assert.deepEqual(report.evidence[0], {
    questionId: "DP-Q-8BB6E543C0F7-001",
    page: 3,
    difficultyBand: "standard",
    answerStatus: "verified",
    answerEvidenceStatus: "verified",
    sourceFingerprint: "8".repeat(64),
    locatorEvidenceId: "locator.1"
  });
});

test("난이도 검수가 남은 시험은 분석지를 만들지 않는다", () => {
  const input = database();
  input.questions[0].difficulty.status = "pending";
  assert.throws(() => buildReport(input, "DP-SRC-8BB6E543C0F7", "2026-08-29"), /검수가 끝나지 않았습니다/);
});

test("정답 이견 문항은 분석을 막지 않되 최상단 경고와 잠금 상태를 남긴다", () => {
  const input = database();
  input.questions[26].answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "공식 답과 독립 계산이 일치하지 않음" };
  const report = buildReport(input, "DP-SRC-8BB6E543C0F7", "2026-08-29");
  assert.equal(report.summary.answerDisputeCount, 1);
  assert.equal(report.criticalWarnings[0].number, 27);
  assert.match(report.comments[0], /27번.*잠겨/);
  assert.equal(report.evidence[26].answerStatus, "disputed");
  assert.equal(report.evidence[26].answerEvidenceStatus, "conflict");
  assert.equal(Object.keys(report.evidence[26]).some(key => /answerValue|officialAnswer|derivedAnswer/i.test(key)), false);
});

test("정답 값이 든 철자 변형 금지 키가 주입된 분석 입력은 중단한다", () => {
  const byKey = database();
  byKey.questions[0].official_answer = "490";
  assert.throws(() => buildReport(byKey, "DP-SRC-8BB6E543C0F7", "2026-08-29"), /정답 값 또는 금지 필드/);
});
