const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const storeModule = require("../server/user-exam-library-store.js");

function root(overrides = {}) {
  return {
    schemaVersion: storeModule.SCHEMA_VERSION,
    plans: {
      basic: { planId: "basic", maxSavedExamCount: 1, maxRecentExamCount: 2, temporaryRetentionDays: 7 }
    },
    assignments: {
      learner1: {
        ownerId: "learner1", planId: "basic", updatedAt: "2026-08-30T00:00:00Z",
        entitlements: [{ kind: "academy_semester", academyId: "DP", semesterId: "M2-1" }]
      },
      learner2: {
        ownerId: "learner2", planId: "basic", updatedAt: "2026-08-30T00:00:00Z",
        entitlements: [{ kind: "all_learning" }]
      }
    },
    exams: {},
    ...overrides
  };
}

function recipe(examId, ownerId = "learner1", overrides = {}) {
  const createdAt = overrides.createdAt || "2026-08-30T00:00:00.000Z";
  const updatedAt = overrides.updatedAt || createdAt;
  return {
    examId,
    ownerId,
    state: "temporary",
    createdAt,
    updatedAt,
    expiresAt: new Date(Date.parse(createdAt) + 7 * 86400000).toISOString(),
    generationMode: "academy_prep",
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { scopeKeys: ["M2-1"] } },
    seed: 7,
    parentExamId: null,
    items: [{ itemId: `item-${examId}`, itemVersionId: "v1", order: 1, score: 2 }],
    ...overrides
  };
}

test("normalizes plans, explicit entitlements, and metadata-only recipes", () => {
  const normalized = storeModule.normalize(root());
  assert.equal(normalized.plans.basic.maxRecentExamCount, 2);
  assert.equal(normalized.assignments.learner1.entitlements[0].semesterId, "M2-1");
  assert.throws(() => storeModule.normalize(root({ exams: {
    bad: recipe("bad", "learner1", { selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { answerKey: "x" } } })
  } })), /cannot contain answerKey/);
});

test("creates only explicitly entitled recipes and keeps owners isolated", () => {
  const store = storeModule.createMemoryStore(root());
  assert.equal(store.create("learner1", recipe("exam1")).examId, "exam1");
  assert.equal(store.read("learner2", "exam1"), null);
  assert.throws(() => store.create("learner1", recipe("wrong", "learner1", {
    selectionSnapshot: { academyId: "WM", semesterId: "M2-1", conditions: {} }
  })), /explicit academy-semester entitlement/);
  assert.throws(() => store.create("learner1", recipe("foreign", "learner2")), /ownerId does not match/);
});

test("all_learning allows an academy-neutral learning recipe", () => {
  const store = storeModule.createMemoryStore(root());
  const result = store.create("learner2", recipe("learn1", "learner2", {
    generationMode: "learning",
    selectionSnapshot: { academyId: null, semesterId: "M2-1", conditions: { difficultyRatio: { standard: 70, raised: 30 } } }
  }));
  assert.equal(result.selectionSnapshot.academyId, null);
});

test("temporary overflow and expired records are pruned without deleting saved exams", () => {
  const saved = recipe("saved1", "learner1", { state: "saved", expiresAt: null });
  const store = storeModule.createMemoryStore(root({ exams: { saved1: saved } }));
  store.create("learner1", recipe("old", "learner1", { createdAt: "2026-08-30T00:00:00Z", updatedAt: "2026-08-30T00:00:00Z" }), "2026-08-30T00:00:00Z");
  store.create("learner1", recipe("middle", "learner1", { createdAt: "2026-08-31T00:00:00Z", updatedAt: "2026-08-31T00:00:00Z" }), "2026-08-31T00:00:00Z");
  store.create("learner1", recipe("new", "learner1", { createdAt: "2026-09-01T00:00:00Z", updatedAt: "2026-09-01T00:00:00Z" }), "2026-09-01T00:00:00Z");
  assert.deepEqual(store.list("learner1", "2026-09-01T01:00:00Z").map(item => item.examId), ["new", "middle", "saved1"]);
  assert.equal(store.read("learner1", "old", "2026-09-01T01:00:00Z"), null);
  assert.equal(store.read("learner1", "saved1").state, "saved");
});

test("save enforces the plan quota and removes temporary expiry", () => {
  const store = storeModule.createMemoryStore(root());
  store.create("learner1", recipe("exam1"));
  const saved = store.save("learner1", "exam1", "2026-08-31T00:00:00Z");
  assert.equal(saved.state, "saved");
  assert.equal(saved.expiresAt, null);
  store.create("learner1", recipe("exam2"));
  assert.throws(() => store.save("learner1", "exam2", "2026-08-31T00:00:00Z"), /limit/);
});

test("file store persists compact recipes and assignment changes", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-user-exams-"));
  const filePath = path.join(directory, "library.json");
  fs.writeFileSync(filePath, `${JSON.stringify(root(), null, 2)}\n`, "utf8");
  const store = storeModule.createFileStore(filePath);
  store.create("learner1", recipe("file1"));
  const reopened = storeModule.createFileStore(filePath);
  assert.equal(reopened.read("learner1", "file1").items[0].itemVersionId, "v1");
  reopened.setAssignment({
    ownerId: "learner1", planId: "basic", updatedAt: "2026-08-31T00:00:00Z",
    entitlements: [{ kind: "academy_all", academyId: "DP" }]
  });
  assert.equal(reopened.assignment("learner1").assignment.entitlements[0].kind, "academy_all");
});
