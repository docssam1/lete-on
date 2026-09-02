"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const inventoryModule = require("../server/user-exam-scope-inventory.js");

function data(overrides = {}) {
  return {
    schemaVersion: inventoryModule.SCHEMA_VERSION,
    targets: [
      { generationMode: "academy_prep", academyId: "DP", semesterId: "M2-1", scopeKeys: ["G8/M01"], status: "approved" },
      { generationMode: "learning", academyId: null, semesterId: "M2-1", scopeKeys: ["G8/M01", "G8/M02"], status: "approved" }
    ],
    ...overrides
  };
}

test("approved inventory binds academy, semester, requested scope, and actual curriculum", () => {
  const inventory = inventoryModule.create(data());
  const approval = inventory.requireTarget("academy_prep", "DP", "M2-1", ["G8/M01/S1"]);
  assert.equal(inventory.assertItemScope("G8/M01/S1/D1", approval.target, approval.requestedScopes), true);
  assert.throws(() => inventory.requireTarget("academy_prep", "DP", "M1-2", ["G8/M01"]), /not approved/);
  assert.throws(() => inventory.requireTarget("academy_prep", "WM", "M2-1", ["G8/M01"]), /not approved/);
  assert.throws(() => inventory.requireTarget("academy_prep", "DP", "M2-1", ["G9/M01"]), /outside/);
  assert.throws(() => inventory.requireTarget("academy_prep", "DP", "M2-1", ["../private/source.pdf"]), /relative path segments/);
  assert.throws(() => inventory.assertItemScope("G8/M01/S2", approval.target, approval.requestedScopes), /requested/);
});

test("inventory rejects pending targets, duplicate grants, and academy-bearing learning targets", () => {
  assert.throws(() => inventoryModule.normalize(data({ targets: [
    { generationMode: "academy_prep", academyId: "DP", semesterId: "M2-1", scopeKeys: ["G8"], status: "pending" }
  ] })), /must be approved/);
  assert.throws(() => inventoryModule.normalize(data({ targets: [
    { generationMode: "learning", academyId: "DP", semesterId: "M2-1", scopeKeys: ["G8"], status: "approved" }
  ] })), /must be null/);
  const duplicate = { generationMode: "academy_prep", academyId: "DP", semesterId: "M2-1", scopeKeys: ["G8"], status: "approved" };
  assert.throws(() => inventoryModule.normalize(data({ targets: [duplicate, { ...duplicate }] })), /duplicate targets/);
});
