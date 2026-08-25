const test = require("node:test");
const assert = require("node:assert/strict");
const editor = require("../data/exam-editor-core.js");

function candidate(itemId, overrides = {}) {
  return {
    itemId,
    releaseStatus: "approved",
    classificationStatus: "verified",
    answerStatus: "verified",
    figureRequired: false,
    curriculumPath: "M1-1/ALG/INTEGER/OPERATION",
    ...overrides
  };
}

function draft() {
  return editor.createDraft({
    draftId: "draft-wm-m21-r01",
    profileId: "WM",
    targetId: "middle21-basic-entry",
    durationMinutes: 120,
    scopeKeys: ["M1-1", "M1-2"],
    placements: [
      { placementId: "p-001", itemId: "q-001", score: 2, selectionKind: "recommended" },
      { placementId: "p-002", itemId: "q-002", score: 3, selectionKind: "recommended" },
      { placementId: "p-003", itemId: "q-003", score: 4, selectionKind: "recommended" }
    ]
  });
}

test("drag reorder changes placements only and keeps canonical item ids intact", () => {
  const original = draft();
  const moved = editor.movePlacement(original, "p-003", 0);

  assert.deepEqual(original.placements.map(item => item.itemId), ["q-001", "q-002", "q-003"]);
  assert.deepEqual(moved.placements.map(item => item.itemId), ["q-003", "q-001", "q-002"]);
  assert.deepEqual(moved.placements.map(item => item.order), [1, 2, 3]);
  assert.equal(moved.sortMode, "user");
});

test("replace changes one placement and preserves an audit trail", () => {
  const original = draft();
  const replaced = editor.replacePlacement(original, {
    placementId: "p-002",
    currentItem: candidate("q-002", { variant: { familyId: "family-002" } }),
    candidate: candidate("q-102", {
      variant: { familyId: "family-002" },
      lineage: { relation: "twin" }
    }),
    relationship: "twin",
    reasonCode: "same_type_new_form"
  });

  assert.equal(original.placements[1].itemId, "q-002");
  assert.equal(replaced.placements[1].itemId, "q-102");
  assert.equal(replaced.placements[1].selectionKind, "twin");
  assert.deepEqual(replaced.placements[1].replacementHistory[0], {
    fromItemId: "q-002",
    toItemId: "q-102",
    relationship: "twin",
    reasonCode: "same_type_new_form"
  });
});

test("similar replacement accepts a verified common question type from the metadata registry", () => {
  const replaced = editor.replacePlacement(draft(), {
    placementId: "p-001",
    metadataByItemId: {
      "q-001": candidate("q-001", { lineage: { questionTypeId: "type-integer-operation" } })
    },
    candidate: candidate("q-101", {
      lineage: { relation: "similar", questionTypeId: "type-integer-operation" }
    }),
    relationship: "similar"
  });

  assert.equal(replaced.placements[0].itemId, "q-101");
  assert.equal(replaced.placements[0].selectionKind, "similar");
});

test("twin and similar replacements reject missing, mismatched, or contradictory lineage", () => {
  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-101", { variant: { familyId: "family-001" } }),
    relationship: "twin"
  }), /current item metadata is required/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    currentItemMetadata: candidate("q-001", { variant: { familyId: "family-001" } }),
    candidate: candidate("q-101", { variant: { familyId: "family-other" } }),
    relationship: "twin"
  }), /lineage does not match/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    currentItem: candidate("q-001", {
      variant: { familyId: "family-001" },
      lineage: { questionTypeId: "type-a" }
    }),
    candidate: candidate("q-101", {
      variant: { familyId: "family-001" },
      lineage: { relation: "similar", questionTypeId: "type-b" }
    }),
    relationship: "similar"
  }), /lineage does not match/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    currentItem: candidate("q-001", { variant: { familyId: "family-001" } }),
    candidate: candidate("q-101", {
      variant: { familyId: "family-001" },
      lineage: { relation: "similar" }
    }),
    relationship: "twin"
  }), /lineage relation does not match/);
});

test("manual replacement remains compatible without lineage metadata", () => {
  const replaced = editor.replacePlacement(draft(), {
    placementId: "p-003",
    candidate: candidate("q-103"),
    relationship: "manual"
  });

  assert.equal(replaced.placements[2].itemId, "q-103");
  assert.equal(replaced.placements[2].selectionKind, "manual");
});

test("unverified answers and unaudited figures cannot be added or used as replacements", () => {
  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-004", { answerStatus: "pending" })
  }), /candidate.answer.not_verified/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-104", { figureRequired: true, figureStatus: "pending" }),
    relationship: "similar"
  }), /candidate.figure.not_verified/);
});

test("the same canonical question cannot be selected twice", () => {
  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-002")
  }), /already selected/);
});

test("sorting supports type, difficulty, objective-first, and deterministic random order", () => {
  const metadata = {
    "q-001": { typeCode: "T03", difficultyBand: "raised", inputType: "input" },
    "q-002": { typeCode: "T01", difficultyBand: "lowered", inputType: "single_choice" },
    "q-003": { typeCode: "T02", difficultyBand: "standard", inputType: "ox" }
  };

  assert.deepEqual(editor.sortPlacements(draft(), "type_asc", metadata).placements.map(item => item.itemId), ["q-002", "q-003", "q-001"]);
  assert.deepEqual(editor.sortPlacements(draft(), "difficulty_asc", metadata).placements.map(item => item.itemId), ["q-002", "q-003", "q-001"]);
  assert.deepEqual(editor.sortPlacements(draft(), "objective_subjective", metadata).placements.map(item => item.itemId), ["q-002", "q-003", "q-001"]);
  assert.deepEqual(
    editor.sortPlacements(draft(), "random", metadata, { seed: 77 }).placements.map(item => item.itemId),
    editor.sortPlacements(draft(), "random", metadata, { seed: 77 }).placements.map(item => item.itemId)
  );
});

test("view mode is presentation state and does not expose answers in the draft model", () => {
  const withSolutions = editor.setViewMode(draft(), "question_solution_answer");
  assert.equal(withSolutions.viewMode, "question_solution_answer");
  assert.equal(JSON.stringify(withSolutions).includes("answerKey"), false);
});

test("summary updates after selection and preserves difficulty and response balance", () => {
  const metadata = {
    "q-001": { typeCode: "ALG", difficultyBand: "standard", inputType: "input" },
    "q-002": { typeCode: "ALG", difficultyBand: "raised", inputType: "single_choice" },
    "q-003": { typeCode: "GEO", difficultyBand: "raised", inputType: "ox" }
  };
  const summary = editor.summarizeDraft(draft(), metadata);
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.totalScore, 9);
  assert.deepEqual(summary.byDifficulty, { lowered: 0, standard: 1, raised: 2, unknown: 0 });
  assert.deepEqual(summary.byInput, { objective: 2, subjective: 1, unknown: 0 });
  assert.deepEqual(summary.byType, { ALG: 2, GEO: 1 });
});

test("scope changes keep placements visible and report what must be replaced", () => {
  const metadata = {
    "q-001": { curriculumPath: "M1-1/ALG/INTEGER/OPERATION" },
    "q-002": { curriculumPath: "M1-2/GEO/ANGLES/PARALLEL" },
    "q-003": {}
  };
  const result = editor.changeScope(draft(), ["M1-2"], metadata);

  assert.equal(result.draft.placements.length, 3);
  assert.deepEqual(result.reconciliation.keptPlacementIds, ["p-002"]);
  assert.deepEqual(result.reconciliation.outOfScopePlacementIds, ["p-001"]);
  assert.deepEqual(result.reconciliation.classificationPendingPlacementIds, ["p-003"]);
});

test("new and replacement candidates must belong to the selected scope", () => {
  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-004", { curriculumPath: "M2-1/ALG/EXPRESSIONS/CALCULATION" })
  }), /outside the selected scope/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-101", { curriculumPath: "" }),
    relationship: "similar"
  }), /classification is required/);
});
