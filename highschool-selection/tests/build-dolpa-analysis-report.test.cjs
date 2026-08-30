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
    locator: { page: 3 + Math.floor(index / 4), status: "verified" },
    difficulty: { band: index < 7 ? "standard" : "raised", status: "verified" },
    responseFormat: { status: "verified" },
    answerCheck: { status: "verified" }
  }));
  return {
    papers: [{ paperId: "DP-M22S-202403-R1", sourceId: "DP-SRC-8BB6E543C0F7", title: "대표 시험", coverage: { status: "verified", declaredScopeLabel: "중1-1~중2-1 전체" } }],
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
});

test("난이도 검수가 남은 시험은 분석지를 만들지 않는다", () => {
  const input = database();
  input.questions[0].difficulty.status = "pending";
  assert.throws(() => buildReport(input, "DP-SRC-8BB6E543C0F7", "2026-08-29"), /검수가 끝나지 않았습니다/);
});
