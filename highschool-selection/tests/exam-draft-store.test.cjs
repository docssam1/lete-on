"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const drafts = require("../server/exam-draft-store.js");
const bank = require("../data/question-bank-core.js");

function question(mode, key) { return bank.createNeutralId("question", mode, key); }
function outputSettings() {
  return {
    title: "중2-1 기본반 대비 1회", subtitle: "중1 대수 20문항 · 중1 기하 20문항",
    writer: "T", gradeLabel: "중2-1 기본반 입학 대비", purpose: "entry_test",
    themeId: "violet", accentColor: "#6d28d9", layout: "four_up",
    showNameField: true, showQuestionNumber: true, showPoints: false,
    showDifficulty: false, showAnswerSpace: true, showWorkSpace: false,
    dateMode: "hidden", qrDestination: "none", answerBookletPolicy: "question_solution_answer"
  };
}
function draft(overrides) {
  const mode = "WM";
  const value = {
    draftId: "draft-wm-middle21-basic-001",
    profileId: mode,
    targetId: "middle21-basic",
    durationMinutes: 110,
    scopeKeys: ["M1-1", "M1-2"],
    sortMode: "user",
    viewMode: "question_solution_answer",
    outputSettings: outputSettings(),
    placements: [
      { placementId: "plc-001", itemId: question(mode, "draftitem001"), order: 1, score: 3, locked: false, selectionKind: "manual", replacementHistory: [] },
      { placementId: "plc-002", itemId: question(mode, "draftitem002"), order: 2, score: 4, locked: true, selectionKind: "recommended", replacementHistory: [] }
    ],
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
    updatedBy: "admin_test"
  };
  return Object.assign(value, overrides || {});
}

test("exam drafts save only IDs and preserve placement order", () => {
  const store = drafts.createStore({ data: { schemaVersion: drafts.SCHEMA_VERSION, drafts: {} } });
  const saved = store.create(draft());
  assert.equal(saved.draft.placements[0].itemId, question("WM", "draftitem001"));
  assert.deepEqual(saved.draft.placements.map(item => item.order), [1, 2]);
  assert.equal(saved.draft.outputSettings.itemsPerPage, 4);
  assert.equal(JSON.stringify(saved.draft).includes("questionText"), false);
  assert.equal(store.list().drafts.length, 1);
});

test("exam draft rejects nested source text and answers", () => {
  const invalid = draft({ placements: [Object.assign({}, draft().placements[0], { replacementHistory: [{
    fromItemId: question("WM", "draftitem001"), toItemId: question("WM", "draftitem003"), relationship: "similar", reasonCode: "TYPE_MATCH", answer: "42"
  }] })] });
  assert.throws(() => drafts.normalize({ schemaVersion: drafts.SCHEMA_VERSION, drafts: { [invalid.draftId]: invalid } }), /answer is not allowed/);
  const withText = draft(Object.assign({}, { prompt: "copy" }));
  assert.throws(() => drafts.normalize({ schemaVersion: drafts.SCHEMA_VERSION, drafts: { [withText.draftId]: withText } }), /prompt is not allowed/);
});

test("exam draft uses expectedRevision for update and removal conflicts", () => {
  const store = drafts.createStore({ data: { schemaVersion: drafts.SCHEMA_VERSION, drafts: {} } });
  const created = store.create(draft());
  const updated = store.update(created.draft.draftId, created.revision, function (current) {
    current.placements = [current.placements[1], current.placements[0]].map(function (placement, index) {
      return Object.assign({}, placement, { order: index + 1 });
    });
    current.updatedAt = "2026-08-25T01:00:00.000Z";
    return current;
  });
  assert.deepEqual(updated.draft.placements.map(item => item.placementId), ["plc-002", "plc-001"]);
  assert.throws(() => store.update(created.draft.draftId, created.revision, current => current), error => error.code === "EXAM_DRAFT_CONFLICT");
  assert.throws(() => store.remove(created.draft.draftId, created.revision), error => error.code === "EXAM_DRAFT_CONFLICT");
  assert.equal(store.remove(created.draft.draftId, updated.revision).revision.length > 10, true);
});

test("exam draft rejects duplicate canonical questions and malformed order", () => {
  const duplicate = draft();
  duplicate.placements[1] = Object.assign({}, duplicate.placements[1], { itemId: duplicate.placements[0].itemId });
  assert.throws(() => drafts.normalize({ schemaVersion: drafts.SCHEMA_VERSION, drafts: { [duplicate.draftId]: duplicate } }), /repeat an ID/);
  const unordered = draft();
  unordered.placements[1] = Object.assign({}, unordered.placements[1], { order: 3 });
  assert.throws(() => drafts.normalize({ schemaVersion: drafts.SCHEMA_VERSION, drafts: { [unordered.draftId]: unordered } }), /order is invalid/);
});
