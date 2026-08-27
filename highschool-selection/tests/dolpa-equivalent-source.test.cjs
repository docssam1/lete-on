"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const recorder = require("../scripts/record-dolpa-equivalent-source.cjs");

function fixture() {
  return {
    database: {
      schemaVersion: 1,
      taxonomyVersion: 1,
      profileCatalog: require("../scripts/build-dolpa-question-db.cjs").PROFILE_CATALOG,
      summary: {
        sourceCount: 0, paperCount: 1, questionCount: 0, typeCount: 0,
        classificationVerifiedCount: 0, locatorVerifiedCount: 0, methodVerifiedCount: 0,
        difficultyVerifiedCount: 0, responseVerifiedCount: 0, answerVerifiedCount: 0,
        variantReadyCount: 0, usageApprovedCount: 0
      },
      papers: [{ paperId: "DP-PAPER-A", sourceId: "DP-SRC-111111111111", questionCount: 0, questionIds: [] }],
      typeCatalog: [],
      questions: []
    },
    ledger: { sources: [{ sourceId: "DP-SRC-222222222222", sourceFingerprint: "a".repeat(64) }] },
    manifest: {
      paperId: "DP-PAPER-A",
      sourceId: "DP-SRC-222222222222",
      evidenceId: "pixel-compare-v1",
      pageCount: 11,
      note: "모든 문제와 답이 같음"
    }
  };
}

test("같은 시험의 다른 원본 파일은 문항을 복제하지 않고 시험지에 연결한다", () => {
  const value = fixture();
  const first = recorder.record(value.database, value.ledger, value.manifest);
  assert.equal(first.changed, true);
  assert.equal(first.database.questions.length, 0);
  assert.equal(first.database.papers[0].equivalentSources.length, 1);
  assert.equal(first.database.papers[0].equivalentSources[0].relation, "same_question_content_revision");
  const second = recorder.record(first.database, value.ledger, value.manifest);
  assert.equal(second.changed, false);
});

test("같은 원본을 다른 시험지에 중복 연결하지 않는다", () => {
  const value = fixture();
  const first = recorder.record(value.database, value.ledger, value.manifest).database;
  first.papers.push({ paperId: "DP-PAPER-B", sourceId: "DP-SRC-333333333333", questionCount: 0, questionIds: [] });
  assert.throws(() => recorder.record(first, value.ledger, { ...value.manifest, paperId: "DP-PAPER-B" }), /다른 시험지/);
});
