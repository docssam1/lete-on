"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const syncModule = require("../scripts/sync-dolpa-reviewed-inventories.cjs");
const auditModule = require("../scripts/audit-dolpa-question-db.cjs");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");

function database() {
  const sourceIds = ["DP-SRC-AAAAAAAAAAAA", "DP-SRC-BBBBBBBBBBBB"];
  const papers = syncModule.REVIEW_SOURCES.map((source, index) => ({ source, sourceId: sourceIds[index] }));
  const ledger = {
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: papers.map((entry, index) => ({ sourceId: entry.sourceId, sourceFingerprint: String(index + 1).repeat(64) })),
    questions: papers.flatMap(entry => entry.source.module.inventory.items.map(item => {
      const semester = item.curriculumCandidate.label;
      const unit = item.majorCandidate.label;
      const typeLabel = item.detailCandidate.label;
      return {
        questionId: ledgerCore.stableQuestionId(entry.sourceId, item.number),
        sourceId: entry.sourceId,
        paperId: entry.source.module.inventory.roundCode,
        paperTitle: entry.source.module.inventory.roundCode,
        number: item.number,
        sourceRelation: "original",
        curriculum: { semester, domain: unit, unit },
        type: { typeId: ledgerCore.stableTypeId(semester, unit, typeLabel), label: typeLabel, methodTags: [], methodReviewStatus: "pending" },
        difficulty: { band: null, status: "pending", evidence: [] },
        classificationStatus: "verified",
        evidence: [entry.source.evidenceId]
      };
    }))
  };
  return builder.buildDatabase(ledger, null, "f".repeat(64));
}

test("검수된 돌파 60문항의 쪽·난이도·답안 형식을 기존 DB에 다시 분석하지 않고 합친다", () => {
  const input = database();
  const output = syncModule.syncReviewedInventories(input);
  assert.equal(auditModule.audit(output).ok, true);
  assert.equal(output.summary.questionCount, 60);
  assert.equal(output.summary.locatorVerifiedCount, 60);
  assert.equal(output.summary.difficultyVerifiedCount, 60);
  assert.equal(output.summary.responseVerifiedCount, 60);
  assert.equal(output.summary.answerVerifiedCount, 60);
  assert.equal(output.summary.methodVerifiedCount, 0);
  assert.equal(output.summary.variantReadyCount, 0);
  assert.equal(output.summary.usageApprovedCount, 0);
  assert.equal(output.questions.find(item => item.paperId === "DP-M22-202404" && item.number === 1).locator.page, 3);
  assert.equal(output.questions.find(item => item.paperId === "DP-M22-202404" && item.number === 27).responseFormat.slotCount, 2);
  assert.equal(output.questions.find(item => item.paperId === "DP-CM1-202405" && item.number === 1).responseFormat.kind, "single_choice");
  assert.equal(output.questions.find(item => item.paperId === "DP-CM1-202405" && item.number === 29).locator.page, 10);
});

test("같은 검수 기록을 다시 합쳐도 DB가 달라지지 않는다", () => {
  const input = database();
  const once = syncModule.syncReviewedInventories(input);
  const twice = syncModule.syncReviewedInventories(once);
  assert.deepEqual(twice, once);
});

test("기존 정답 이견 상태는 검수 완료 inventory로도 verified로 덮지 않는다", () => {
  const input = database();
  const target = input.questions.find(item => item.paperId === "DP-M22-202404" && item.number === 1);
  target.answerCheck = { status: "disputed", evidence: ["private.answer.conflict"], note: "원본 답과 독립 검산이 일치하지 않음" };
  target.usageProfiles = target.usageProfiles.map(profile => ({ ...profile, status: "candidate", evidence: [] }));
  input.summary = builder.summarize(input);
  const output = syncModule.syncReviewedInventories(input);
  const preserved = output.questions.find(item => item.questionId === target.questionId);
  assert.deepEqual(preserved.answerCheck, target.answerCheck);
  assert.equal(preserved.usageProfiles.every(profile => profile.status === "candidate"), true);
  assert.equal(auditModule.audit(output).ok, true);
});
