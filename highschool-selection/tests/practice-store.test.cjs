const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const core = require("../data/question-bank-core.js");
const planner = require("../shared/practice-set-planner.js");
const practiceStore = require("../server/practice-store.js");

const MODE = "SH";

function plan() {
  const practiceSetId = core.createNeutralId("practiceSet", MODE, "store:test:set:01");
  const questionId = core.createNeutralId("question", MODE, "store:test:question:01");
  return {
    id: practiceSetId,
    mode: MODE,
    learnerId: core.createNeutralId("learner", MODE, "store:test:learner:01"),
    writer: "T",
    policyId: core.createNeutralId("policy", MODE, "store:test:policy:01"),
    policyVersion: 1,
    plannedAt: "2026-08-24T00:00:00.000Z",
    releaseStatus: "approval_required",
    eligible: true,
    issues: [],
    items: [{
      position: 1,
      questionId,
      familyId: questionId,
      relation: "original",
      difficultyBand: "standard",
      curriculumKey: "G10/M01/S01/D01",
      detailCode: "D01",
      masteryBefore: "unseen",
      dueAt: "2026-08-24T00:00:00.000Z",
      scheduledReason: "initial"
    }],
    summary: {
      requestedCount: 1,
      selectedCount: 1,
      distinctFamilies: 1,
      distinctDetails: 1,
      blockedCandidateCount: 0,
      blockedFamilyCount: 0,
      byMastery: { unseen: 1, learning: 0, consolidating: 0, mastered: 0, needs_review: 0 },
      byDifficulty: { lowered: 0, standard: 1, raised: 0 },
      byRelation: { original: 1, twin: 0, similar: 0 }
    }
  };
}

function record() {
  const value = plan();
  return { practiceSetId: value.id, studentId: "student_store", plan: value, approval: null };
}

test("private practice store rejects content leakage and structural drift", () => {
  const base = { schemaVersion: practiceStore.SCHEMA_VERSION, sets: { [record().practiceSetId]: record() } };
  assert.doesNotThrow(() => practiceStore.normalize(base));
  const leaked = JSON.parse(JSON.stringify(base));
  leaked.sets[record().practiceSetId].plan.answer = "blocked";
  assert.throws(() => practiceStore.normalize(leaked), /cannot contain answer/);
  const drifted = JSON.parse(JSON.stringify(base));
  drifted.sets[record().practiceSetId].plan.items[0].position = 2;
  assert.throws(() => practiceStore.normalize(drifted), /position is invalid/);
});

test("file practice store is idempotent, revision-bound, and atomically releases", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-practice-store-"));
  const filePath = path.join(root, "practice.json");
  const store = practiceStore.createStore({ filePath });
  try {
    const created = store.put(record());
    assert.equal(created.record.plan.releaseStatus, "approval_required");
    assert.equal(store.put(record()).revision, created.revision);

    const conflictRecord = record();
    conflictRecord.studentId = "student_other";
    assert.throws(() => store.put(conflictRecord), error => error && error.code === "PRACTICE_CONFLICT");
    assert.throws(() => store.update(created.record.practiceSetId, "stale", value => value), error => error && error.code === "PRACTICE_CONFLICT");

    const approvalId = core.createNeutralId("approval", MODE, "store:test:approval:01");
    const releasedPlan = planner.releasePracticeSet(created.record.plan, {
      id: approvalId,
      practiceSetId: created.record.practiceSetId,
      status: "approved",
      decisionVersion: 1
    });
    const released = store.update(created.record.practiceSetId, created.revision, value => ({
      practiceSetId: value.practiceSetId,
      studentId: value.studentId,
      plan: releasedPlan,
      approval: {
        approvalId,
        decisionVersion: 1,
        approvedAt: "2026-08-24T01:00:00.000Z",
        approvedBy: "admin_store"
      }
    }));
    assert.equal(released.record.plan.releaseStatus, "released");
    assert.equal(fs.existsSync(`${filePath}.lock`), false);
    assert.equal(fs.readdirSync(root).some(name => name.endsWith(".tmp")), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
