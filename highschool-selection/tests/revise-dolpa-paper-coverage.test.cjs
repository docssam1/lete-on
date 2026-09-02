"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const reviser = require("../scripts/revise-dolpa-paper-coverage.cjs");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");

function database() {
  return {
    schemaVersion: 1,
    profileCatalog: dbCore.PROFILE_CATALOG,
    papers: [{
      paperId: "DP-PAPER", sourceId: "DP-SRC-AAAAAAAAAAAA", questionCount: 0, questionIds: [],
      coverage: {
        coverageKind: "mixed_range",
        declaredScopeLabel: "기존의 넓은 범위 설명",
        observedTerminal: { semester: "중2-2", unit: "피타고라스 정리" },
        status: "verified", evidence: ["old.review"], note: "기존 기록"
      }
    }],
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

function manifest(db) {
  return {
    paperId: "DP-PAPER",
    expectedCurrentCoverage: structuredClone(db.papers[0].coverage),
    replacement: {
      coverageKind: "mixed_range",
      declaredScopeLabel: "중1 전 범위 중심, 상향 확인 문항 포함",
      observedTerminal: { semester: "중2-2", unit: "피타고라스 정리" },
      evidenceId: "new.review",
      note: "중심 범위와 가장 높은 확인 문항을 따로 기록"
    }
  };
}

test("기존 범위가 정확히 일치할 때만 설명을 고친다", () => {
  const db = database();
  const result = reviser.revise(db, manifest(db));
  assert.equal(result.papers[0].coverage.declaredScopeLabel, "중1 전 범위 중심, 상향 확인 문항 포함");
  assert.deepEqual(db.papers[0].coverage.evidence, ["old.review"]);
});

test("다른 작업이 먼저 범위를 바꿨으면 자동 수정하지 않는다", () => {
  const db = database();
  const change = manifest(db);
  db.papers[0].coverage.note = "다른 작업의 새 기록";
  assert.throws(() => reviser.revise(db, change), /자동으로 고치지 않습니다/);
});
