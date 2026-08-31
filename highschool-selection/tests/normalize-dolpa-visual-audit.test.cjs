"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { normalize } = require("../scripts/normalize-dolpa-visual-audit.cjs");

function audit(operationStage, scopeSummary) {
  return {
    schemaVersion: "dolpa-source-visual-audit-v1",
    sourceId: "DP-SRC-E00A54FBB8B2",
    sourceFingerprint: "e00a54fbb8b2e196336da50c4f58bec040a1ab515e7a713b0beedc585d62478b",
    sourceFacts: { displayLabel: "2-1 입반 테스트 ②", questionCount: 30, testMinutes: 180, sourceCutFactOnly: 20 },
    coursePlacement: {
      confidence: "confirmed",
      operationStage,
      decision: "mid_course_join",
      reason: "검수 근거",
      centralRange: { semester: "중2-1", terminalUnit: "일차부등식", coverage: "중1 누적과 중2-1 일차부등식" }
    },
    releasePolicy: { approvalCount: 0 },
    answerAuditSummary: { verified: 29, needsReview: 0, disputed: 1 },
    difficultySummary: { standard: 15, raised: 15 },
    scopeSummary,
    questions: Array.from({ length: 30 }, (_, index) => ({ number: index + 1 }))
  };
}

test("둘째 달 원본을 셋째 달로 잘못 고정하지 않는다", () => {
  const output = normalize(audit("second_month", { centralTerminal: 10, outOfRange: 0 }), "DP-M21-202310-R2");
  assert.equal(output.coursePlacement.target, "중2-1 둘째 달 중간 합류");
  assert.equal(output.summary.centerRange, 10);
  assert.equal(output.summary.upwardDiagnostic, 0);
});

test("셋째 달 상향 진단 수를 원본 감사 필드에서 유지한다", () => {
  const output = normalize(audit("third_month", { central: 28, borderlineFutureDiagnostic: 2 }), "DP-M11-202311-R3");
  assert.equal(output.coursePlacement.target, "중2-1 셋째 달 중간 합류");
  assert.equal(output.summary.centerRange, 28);
  assert.equal(output.summary.upwardDiagnostic, 2);
});
