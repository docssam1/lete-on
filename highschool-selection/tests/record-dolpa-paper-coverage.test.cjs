"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const recorder = require("../scripts/record-dolpa-paper-coverage.cjs");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");

function database() {
  return {
    schemaVersion: 1,
    profileCatalog: dbCore.PROFILE_CATALOG,
    papers: [{ paperId: "DP-PAPER", sourceId: "DP-SRC-AAAAAAAAAAAA", questionCount: 0, questionIds: [] }],
    questions: [],
    typeCatalog: [],
    summary: {
      sourceCount: 0, paperCount: 1, questionCount: 0, typeCount: 0,
      classificationVerifiedCount: 0, locatorVerifiedCount: 0, methodVerifiedCount: 0,
      difficultyVerifiedCount: 0, responseVerifiedCount: 0, answerVerifiedCount: 0,
      variantReadyCount: 0, usageApprovedCount: 0
    }
  };
}

test("원본 시험지마다 실제 종료 단원과 범위 형태를 따로 기록한다", () => {
  const result = recorder.record(database(), {
    paperId: "DP-PAPER",
    coverageKind: "mid_unit_cutoff",
    declaredScopeLabel: "중1-1~중2-1 연립일차방정식까지",
    observedTerminal: { semester: "중2-1", unit: "연립일차방정식" },
    evidenceId: "review.coverage.one"
  });
  assert.equal(result.papers[0].coverage.coverageKind, "mid_unit_cutoff");
  assert.equal(result.papers[0].coverage.observedTerminal.unit, "연립일차방정식");
});

test("이미 확인한 범위를 다른 값으로 자동 덮어쓰지 않는다", () => {
  const first = recorder.record(database(), {
    paperId: "DP-PAPER", coverageKind: "full_range", declaredScopeLabel: "중2-1 전체",
    observedTerminal: { semester: "중2-1", unit: "일차함수" }, evidenceId: "review.coverage.one"
  });
  assert.throws(() => recorder.record(first, {
    paperId: "DP-PAPER", coverageKind: "mid_unit_cutoff", declaredScopeLabel: "중2-1 일부",
    observedTerminal: { semester: "중2-1", unit: "연립일차방정식" }, evidenceId: "review.coverage.two"
  }), /자동으로 덮어쓰지 않습니다/);
});
