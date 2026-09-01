"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const adapter = require("../server/user-exam-supabase-adapter.js");

const AUTH_OWNER = "11111111-1111-4111-8111-111111111111";
const EXAM_ID = "22222222-2222-4222-8222-222222222222";
const PARENT_ID = "33333333-3333-4333-8333-333333333333";

function conditions(overrides = {}) {
  return {
    scopeKeys: ["M2-1/algebra.linear"],
    difficultyWeights: { lowered: 1, standard: 2, raised: 1 },
    responseWeights: { objective: 1, subjective: 1 },
    questionCount: 2,
    maxPerFamily: 1,
    domainQuotas: null,
    ...overrides
  };
}

function recipe(overrides = {}) {
  return {
    examId: EXAM_ID,
    ownerId: "spoofed-student-id",
    state: "temporary",
    createdAt: "2026-08-30T01:00:00.000Z",
    updatedAt: "2026-08-30T01:00:00.000Z",
    expiresAt: "2026-09-06T01:00:00.000Z",
    generationMode: "academy_prep",
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions() },
    seed: 12345,
    parentExamId: PARENT_ID,
    items: [
      { itemId: "item-1", itemVersionId: "version:1", order: 1, score: 2 },
      { itemId: "item-2", itemVersionId: "version:2", order: 2, score: 3.5 }
    ],
    layout: null,
    ...overrides
  };
}

function row(overrides = {}) {
  const insert = adapter.toInsertRow(recipe(), AUTH_OWNER);
  return {
    ...insert,
    created_at: "2026-08-30 01:00:00+00",
    updated_at: "2026-08-30T01:05:00.000Z",
    expires_at: "2026-09-06T01:00:00.000Z",
    ...overrides
  };
}

test("toInsertRow stores only compact recipe data and trusts the authenticated UUID for ownership", () => {
  const result = adapter.toInsertRow(recipe(), AUTH_OWNER);
  assert.deepEqual(result, {
    id: EXAM_ID,
    owner_id: AUTH_OWNER,
    parent_exam_id: PARENT_ID,
    status: "temporary",
    generation_mode: "academy_prep",
    title: "",
    academy_code: "DP",
    semester_code: "M2-1",
    recipe: {
      schemaVersion: 1,
      seed: 12345,
      selectionSnapshot: { conditions: conditions() },
      items: [
        { itemId: "item-1", itemVersionId: "version:1", order: 1, score: 2 },
        { itemId: "item-2", itemVersionId: "version:2", order: 2, score: 3.5 }
      ]
    }
  });
  assert.equal(Object.prototype.hasOwnProperty.call(result.recipe, "layout"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(result, "created_at"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(result, "expires_at"), false);
  assert.notEqual(result.owner_id, recipe().ownerId);
});

test("toInsertRow preserves an approved layout and optional title", () => {
  const layout = { paperSize: "A4", columns: 2, itemsPerPage: 4, fontScale: 1.1 };
  const result = adapter.toInsertRow(recipe({ layout }), AUTH_OWNER, { title: "중2-1 연습" });
  assert.deepEqual(result.recipe.layout, layout);
  assert.equal(result.title, "중2-1 연습");
});

test("toInsertRow validates auth, exam, and parent UUIDs", () => {
  assert.throws(() => adapter.toInsertRow(recipe(), "student-one"), /authUserId must be a UUID/);
  assert.throws(() => adapter.toInsertRow(recipe({ examId: "userexam_123" }), AUTH_OWNER), /recipe.examId must be a UUID/);
  assert.throws(() => adapter.toInsertRow(recipe({ parentExamId: "parent-one" }), AUTH_OWNER), /recipe.parentExamId must be a UUID/);
});

test("toInsertRow enforces the five required conditions and an optional exact domain quota", () => {
  const missing = conditions();
  delete missing.maxPerFamily;
  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: missing }
  }), AUTH_OWNER), /maxPerFamily is required/);

  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions({ note: "extra" }) }
  }), AUTH_OWNER), /conditions.note is not allowed/);

  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: {
      academyId: "DP",
      semesterId: "M2-1",
      conditions: conditions({ difficultyWeights: { lowered: 0, standard: 0, raised: 0 } })
    }
  }), AUTH_OWNER), /positive weight/);

  const withDomains = adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "SM", semesterId: "CM1", conditions: conditions({ domainQuotas: { algebra: 1, geometry: 1 } }) }
  }), AUTH_OWNER);
  assert.deepEqual(withDomains.recipe.selectionSnapshot.conditions.domainQuotas, { algebra: 1, geometry: 1 });
  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "SM", semesterId: "CM1", conditions: conditions({ domainQuotas: { algebra: 2, geometry: 1 } }) }
  }), AUTH_OWNER), /must sum to questionCount/);
});

test("toInsertRow enforces DB item, order, score, target, and layout boundaries", () => {
  const tooMany = Array.from({ length: 101 }, (_, index) => ({
    itemId: `item-${index + 1}`,
    itemVersionId: "v1",
    order: index + 1,
    score: 1
  }));
  assert.throws(() => adapter.toInsertRow(recipe({ items: tooMany }), AUTH_OWNER), /between 1 and 100 items/);
  assert.throws(() => adapter.toInsertRow(recipe({
    items: [{ itemId: "item-1", itemVersionId: "v1", order: 1, score: 1000.01 }]
  }), AUTH_OWNER), /at most 1000/);
  assert.throws(() => adapter.toInsertRow(recipe({
    items: [{ itemId: "item-1", itemVersionId: "v1", order: 2, score: 1 }]
  }), AUTH_OWNER), /contiguous from 1/);
  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "DP.BAD", semesterId: "M2-1", conditions: conditions() }
  }), AUTH_OWNER), /academyId is invalid/);
  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions({ scopeKeys: ["../private/source.pdf"] }) }
  }), AUTH_OWNER), /relative path segments/);
  assert.throws(() => adapter.toInsertRow(recipe({
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions({ questionCount: 1 }) }
  }), AUTH_OWNER), /questionCount must match/);
  assert.throws(() => adapter.toInsertRow(recipe({ layout: { columns: 3 } }), AUTH_OWNER), /columns must be 1 or 2/);
});

test("fromRow rehydrates DB-owned UUIDs and timestamps into the JS recipe view", () => {
  const result = adapter.fromRow(row());
  assert.deepEqual(result, {
    examId: EXAM_ID,
    ownerId: AUTH_OWNER,
    state: "temporary",
    createdAt: "2026-08-30T01:00:00.000Z",
    updatedAt: "2026-08-30T01:05:00.000Z",
    expiresAt: "2026-09-06T01:00:00.000Z",
    generationMode: "academy_prep",
    selectionSnapshot: { academyId: "DP", semesterId: "M2-1", conditions: conditions() },
    seed: 12345,
    parentExamId: PARENT_ID,
    items: [
      { itemId: "item-1", itemVersionId: "version:1", order: 1, score: 2 },
      { itemId: "item-2", itemVersionId: "version:2", order: 2, score: 3.5 }
    ],
    layout: null
  });
});

test("fromRow accepts a saved row only with a null expiry", () => {
  const result = adapter.fromRow(row({ status: "saved", expires_at: null }));
  assert.equal(result.state, "saved");
  assert.equal(result.expiresAt, null);
  assert.throws(() => adapter.fromRow(row({ status: "saved" })), /saved row cannot have/);
});

test("fromRow fails closed on invalid DB timestamps and compact JSON shapes", () => {
  assert.throws(() => adapter.fromRow(row({ updated_at: "not-a-time" })), /database timestamp/);
  assert.throws(() => adapter.fromRow(row({ expires_at: "2026-08-30T01:04:00Z" })), /expire after/);
  assert.throws(() => adapter.fromRow(row({ recipe: { ...row().recipe, schemaVersion: 2 } })), /schemaVersion must be 1/);
  assert.throws(() => adapter.fromRow(row({ recipe: { ...row().recipe, layout: null } })), /layout must be an object/);
  assert.throws(() => adapter.fromRow(row({
    recipe: { ...row().recipe, selectionSnapshot: { conditions: conditions({ questionCount: 1 }) } }
  })), /questionCount must match/);
  assert.throws(() => adapter.fromRow(row({
    recipe: {
      ...row().recipe,
      selectionSnapshot: { conditions: conditions(), academyId: "DP" }
    }
  })), /academyId is not allowed/);
});
