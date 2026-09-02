const test = require("node:test");
const assert = require("node:assert/strict");
const library = require("../data/user-exam-library-core.js");

function plan(overrides = {}) {
  return {
    planId: "plan-basic",
    maxSavedExamCount: 2,
    maxRecentExamCount: 2,
    temporaryRetentionDays: 7,
    ...overrides
  };
}

function entitlements(overrides) {
  return overrides || [
    { kind: "academy_semester", academyId: "DP", semesterId: "M2-1" },
    { kind: "academy_all", academyId: "WM" }
  ];
}

function conditions(overrides = {}) {
  return {
    scopeKeys: ["M2-1/algebra.linear"],
    difficultyWeights: { lowered: 1, standard: 2, raised: 1 },
    responseWeights: { objective: 1, subjective: 1 },
    questionCount: 2,
    maxPerFamily: 1,
    ...overrides
  };
}

function recipe(overrides = {}) {
  return {
    examId: "exam-001",
    ownerId: "learner-001",
    state: "temporary",
    createdAt: "2026-08-30T00:00:00.000Z",
    updatedAt: "2026-08-30T01:00:00.000Z",
    expiresAt: "2026-09-06T00:00:00.000Z",
    generationMode: "academy_prep",
    selectionSnapshot: {
      academyId: "DP",
      semesterId: "M2-1",
      conditions: conditions()
    },
    seed: 78231,
    parentExamId: null,
    items: [
      { itemId: "item-001", itemVersionId: "v1", order: 1, score: 2 },
      { itemId: "item-002", itemVersionId: "v3", order: 2, score: 3.5 }
    ],
    ...overrides
  };
}

test("normalizes a metadata-only user exam recipe and freezes its snapshot", () => {
  const normalized = library.normalizeUserExamRecipe(recipe());
  assert.equal(normalized.generationMode, "academy_prep");
  assert.equal(normalized.items[1].itemVersionId, "v3");
  assert.deepEqual(Object.keys(normalized.selectionSnapshot.conditions), [
    "scopeKeys", "difficultyWeights", "responseWeights", "questionCount", "maxPerFamily", "domainQuotas"
  ]);
  assert.equal(normalized.selectionSnapshot.conditions.domainQuotas, null);
  assert.ok(Object.isFrozen(normalized));
  assert.ok(Object.isFrozen(normalized.items));
  assert.ok(Object.isFrozen(normalized.selectionSnapshot.conditions.difficultyWeights));
});

test("stores an exact optional algebra and geometry quota without weakening old recipes", () => {
  const normalized = library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: {
      academyId: "SM",
      semesterId: "CM1",
      conditions: conditions({ domainQuotas: { algebra: 1, geometry: 1 } })
    }
  }));
  assert.deepEqual(normalized.selectionSnapshot.conditions.domainQuotas, { algebra: 1, geometry: 1 });
  assert.ok(Object.isFrozen(normalized.selectionSnapshot.conditions.domainQuotas));
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: {
      academyId: "SM",
      semesterId: "CM1",
      conditions: conditions({ domainQuotas: { algebra: 2, geometry: 1 } })
    }
  })), /must sum to questionCount/);
});

test("rejects question text, answers, solutions, paths, and unknown recipe fields", () => {
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ answer: "12" })), /recipe.answer is not allowed/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...conditions(), answerKey: "private" } }
  })), /cannot contain answerKey/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...conditions(), sourcePath: "C:/private.pdf" } }
  })), /cannot contain sourcePath/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...conditions(), "official-answer": "12" } }
  })), /cannot contain official-answer/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...conditions(), "question＿body": "private" } }
  })), /cannot contain question＿body/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: { ...conditions(), "source.path": "private" } }
  })), /cannot contain source.path/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions({ scopeKeys: ["../private/source.pdf"] }) }
  })), /relative path segments/);
});

test("requires item versions, contiguous order, positive scores, and unique item ids", () => {
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ items: [{ itemId: "item-1", order: 1, score: 1 }] })), /itemVersionId is not allowed|required/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ items: [
    { itemId: "item-1", itemVersionId: "v1", order: 1, score: 1 },
    { itemId: "item-1", itemVersionId: "v2", order: 2, score: 1 }
  ] })), /duplicate itemId/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ items: [
    { itemId: "item-1", itemVersionId: "v1", order: 2, score: 1 }
  ] })), /contiguous/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ items: [
    { itemId: "item-1", itemVersionId: "v1", order: 1, score: 0 }
  ] })), /must be positive/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions({ questionCount: 1 }) }
  })), /questionCount must match/);
});

test("accepts only academy_prep or learning generation modes and uint32 seeds", () => {
  assert.equal(library.normalizeUserExamRecipe(recipe({ generationMode: "learning" })).generationMode, "learning");
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ generationMode: "automatic" })), /not allowed/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ seed: -1 })), /unsigned 32-bit/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ seed: 0x100000000 })), /unsigned 32-bit/);
});

test("temporary recipes require a future expiry and saved recipes cannot expire", () => {
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ expiresAt: null })), /valid timestamp/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ expiresAt: "2026-08-30T00:30:00Z" })), /expire after updatedAt/);
  const saved = library.normalizeUserExamRecipe(recipe({ state: "saved", expiresAt: null }));
  assert.equal(saved.expiresAt, null);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({ state: "saved" })), /cannot expire/);
});

test("validates explicit academy-semester entitlement combinations without Cartesian product", () => {
  assert.equal(library.assertEntitled(entitlements(), recipe()), true);
  const crossed = [
    { kind: "academy_semester", academyId: "DP", semesterId: "M1-2" },
    { kind: "academy_semester", academyId: "WM", semesterId: "M2-1" }
  ];
  assert.throws(() => library.assertEntitled(crossed, recipe()), /explicit academy-semester entitlement/);
  assert.equal(library.assertEntitled([{ kind: "academy_all", academyId: "DP" }], recipe()), true);
});

test("all_learning allows learning recipes with no academy but never academy prep", () => {
  const learning = recipe({
    generationMode: "learning",
    selectionSnapshot: { academyId: null, semesterId: "M2-1", conditions: conditions() }
  });
  assert.equal(library.assertEntitled([{ kind: "all_learning" }], learning), true);
  assert.equal(library.normalizeUserExamRecipe(learning).selectionSnapshot.academyId, null);
  assert.throws(() => library.assertEntitled([{ kind: "all_learning" }], recipe()), /explicit academy-semester entitlement/);
  assert.throws(() => library.normalizeUserExamRecipe(recipe({
    selectionSnapshot: { academyId: null, semesterId: "M2-1", conditions: conditions() }
  })), /academy_prep requires/);
});

test("entitlements use strict shapes and reject duplicate grants", () => {
  assert.deepEqual(library.normalizeEntitlements([{ kind: "academy_semester", academyId: "DP", semesterId: "M2-1" }]), [
    { kind: "academy_semester", academyId: "DP", semesterId: "M2-1" }
  ]);
  assert.throws(() => library.normalizeEntitlements([{ kind: "all_learning", academyId: "DP" }]), /academyId is not allowed/);
  assert.throws(() => library.normalizeEntitlements([
    { kind: "academy_all", academyId: "DP" },
    { kind: "academy_all", academyId: "DP" }
  ]), /duplicate grants/);
});

test("plan normalization owns storage limits only", () => {
  const normalized = library.createLibraryPlan(plan());
  assert.equal(normalized.maxSavedExamCount, 2);
  assert.equal(normalized.maxRecentExamCount, 2);
  assert.equal(normalized.temporaryRetentionDays, 7);
  assert.throws(() => library.createLibraryPlan(plan({ maxSavedExamCount: 0 })), /positive integer/);
  assert.throws(() => library.createLibraryPlan(plan({ maxSavedExamCount: 1001 })), /too large/);
  assert.throws(() => library.createLibraryPlan({ ...plan(), academyIds: ["DP"] }), /academyIds is not allowed/);
});

test("recent temporary list uses the plan limit and excludes expired and saved exams", () => {
  const recent = library.recentTemporaryExams([
    recipe({ examId: "exam-old", updatedAt: "2026-08-30T00:30:00Z" }),
    recipe({ examId: "exam-new", updatedAt: "2026-08-31T00:30:00Z", expiresAt: "2026-09-07T00:30:00Z" }),
    recipe({ examId: "exam-middle", updatedAt: "2026-08-30T20:30:00Z" }),
    recipe({ examId: "exam-expired", expiresAt: "2026-08-30T02:00:00Z" }),
    recipe({ examId: "exam-saved", state: "saved", expiresAt: null })
  ], plan(), "2026-08-31T01:00:00Z");
  assert.deepEqual(recent.map(item => item.examId), ["exam-new", "exam-middle"]);
  assert.equal(library.isExpired(recipe({ expiresAt: "2026-08-31T00:00:00Z" }), "2026-08-31T00:00:00Z"), true);
});

test("saved capacity counts saved recipes and allows an idempotent existing save", () => {
  const savedA = recipe({ examId: "exam-a", state: "saved", expiresAt: null });
  const savedB = recipe({ examId: "exam-b", state: "saved", expiresAt: null });
  assert.deepEqual(library.assertSavedCapacity(plan(), [savedA], "exam-new"), {
    savedCount: 1, maxSavedExamCount: 2, remainingAfterSave: 0
  });
  assert.throws(() => library.assertSavedCapacity(plan(), [savedA, savedB], "exam-new"), /limit has been reached/);
  assert.equal(library.assertSavedCapacity(plan(), [savedA, savedB], "exam-a").remainingAfterSave, 0);
  assert.throws(() => library.assertSavedCapacity(plan(), [savedA, savedA], "exam-a"), /duplicate examId/);
});

test("saveExam checks retention, entitlement, capacity, and removes temporary expiry", () => {
  const existing = [recipe({ examId: "exam-a", state: "saved", expiresAt: null })];
  const saved = library.saveExam(recipe(), plan(), entitlements(), existing, "2026-08-31T10:00:00Z");
  assert.equal(saved.state, "saved");
  assert.equal(saved.expiresAt, null);
  assert.equal(saved.updatedAt, "2026-08-31T10:00:00.000Z");
  assert.throws(() => library.saveExam(recipe(), plan({ maxSavedExamCount: 1 }), entitlements(), existing, "2026-08-31T10:00:00Z"), /limit/);
  assert.throws(() => library.saveExam(recipe({ expiresAt: "2026-09-07T01:00:00Z" }), plan(), entitlements(), [], "2026-08-31T10:00:00Z"), /retention period/);
  assert.throws(() => library.saveExam(recipe(), plan(), entitlements(), [], "2026-09-06T00:00:00Z"), /expired temporary recipe/);
});

test("similar exam derivation metadata is deterministic and bound to parent versions and conditions", () => {
  const first = library.deriveSimilarExamMetadata(recipe(), { derivationIndex: 1 });
  const second = library.deriveSimilarExamMetadata(recipe(), { derivationIndex: 1 });
  assert.deepEqual(first, second);
  assert.equal(first.parentExamId, "exam-001");
  assert.match(first.derivationKey, /^similar-[0-9a-f]{8}$/);
  assert.notEqual(library.deriveSimilarExamMetadata(recipe(), { derivationIndex: 2 }).seed, first.seed);
  assert.notEqual(library.deriveSimilarExamMetadata(recipe({
    items: [
      { itemId: "item-001", itemVersionId: "v2", order: 1, score: 2 },
      { itemId: "item-002", itemVersionId: "v3", order: 2, score: 3.5 }
    ]
  }), { derivationIndex: 1 }).seed, first.seed);
});

test("derived metadata may switch only between the two supported generation modes", () => {
  const derived = library.deriveSimilarExamMetadata(recipe(), { derivationIndex: 3, generationMode: "learning" });
  assert.equal(derived.generationMode, "learning");
  assert.throws(() => library.deriveSimilarExamMetadata(recipe(), { derivationIndex: 3, generationMode: "random" }), /not allowed/);
});
