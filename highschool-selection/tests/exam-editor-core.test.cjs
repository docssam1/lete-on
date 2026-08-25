const test = require("node:test");
const assert = require("node:assert/strict");
const editor = require("../data/exam-editor-core.js");

function candidate(itemId, overrides = {}) {
  return {
    itemId,
    itemVersionId: `${itemId}-v1`,
    releaseStatus: "approved",
    classificationStatus: "verified",
    answerStatus: "verified",
    singleAnswerStatus: "verified",
    userApprovalStatus: "approved",
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
      { placementId: "p-001", itemId: "q-001", itemVersionId: "q-001-v1", score: 2, selectionKind: "recommended" },
      { placementId: "p-002", itemId: "q-002", itemVersionId: "q-002-v1", score: 3, selectionKind: "recommended" },
      { placementId: "p-003", itemId: "q-003", itemVersionId: "q-003-v1", score: 4, selectionKind: "recommended" }
    ]
  });
}

function replacementEvidence(sourceItemId, candidateItemId, relationship = "twin", overrides = {}) {
  return {
    evidenceId: `evidence-${sourceItemId}-${candidateItemId}`,
    status: "approved",
    relationship,
    sourceItemId,
    sourceItemVersionId: `${sourceItemId}-v1`,
    candidateItemId,
    candidateItemVersionId: `${candidateItemId}-v1`,
    familyMatched: true,
    detailMatched: true,
    solutionStructureMatched: true,
    difficultyCompatible: true,
    ...overrides
  };
}

test("drag reorder changes placements only and keeps canonical item ids intact", () => {
  const original = draft();
  const moved = editor.movePlacement(original, "p-003", 0);

  assert.deepEqual(original.placements.map(item => item.itemId), ["q-001", "q-002", "q-003"]);
  assert.deepEqual(moved.placements.map(item => item.itemId), ["q-003", "q-001", "q-002"]);
  assert.deepEqual(moved.placements.map(item => item.order), [1, 2, 3]);
  assert.equal(moved.sortMode, "user");
  assert.equal(moved.revision, original.revision + 1);
});

test("replace changes one placement and preserves an audit trail", () => {
  const original = draft();
  const replaced = editor.replacePlacement(original, {
    placementId: "p-002",
    candidate: candidate("q-102"),
    relationship: "twin",
    replacementEvidence: replacementEvidence("q-002", "q-102"),
    reasonCode: "same_type_new_form"
  });

  assert.equal(original.placements[1].itemId, "q-002");
  assert.equal(replaced.placements[1].itemId, "q-102");
  assert.equal(replaced.placements[1].selectionKind, "twin");
  assert.deepEqual(replaced.placements[1].replacementHistory[0], {
    fromItemId: "q-002",
    fromItemVersionId: "q-002-v1",
    toItemId: "q-102",
    toItemVersionId: "q-102-v1",
    relationship: "twin",
    reasonCode: "same_type_new_form",
    evidenceId: "evidence-q-002-q-102"
  });
});

test("unverified answers and unaudited figures cannot be added or used as replacements", () => {
  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-004", { answerStatus: "pending" })
  }), /candidate.answer.not_verified/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-104", { figureRequired: true, figureStatus: "pending" }),
    relationship: "similar",
    replacementEvidence: replacementEvidence("q-001", "q-104", "similar")
  }), /candidate.figure.not_verified/);

  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-004", { singleAnswerStatus: "pending" })
  }), /candidate.single_answer.not_verified/);

  assert.throws(() => editor.addItem(draft(), {
    placementId: "p-004",
    candidate: candidate("q-004", { userApprovalStatus: "pending" })
  }), /candidate.user_approval.not_approved/);
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
    relationship: "similar",
    replacementEvidence: replacementEvidence("q-001", "q-101", "similar")
  }), /classification is required/);
});

test("twin and similar replacements require approved relation evidence", () => {
  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-101"),
    relationship: "twin"
  }), /verified replacement evidence is required/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-101"),
    relationship: "similar",
    replacementEvidence: replacementEvidence("q-001", "q-101", "similar", { solutionStructureMatched: false })
  }), /solution structure is not verified/);

  assert.throws(() => editor.replacePlacement(draft(), {
    placementId: "p-001",
    candidate: candidate("q-101"),
    relationship: "twin",
    replacementEvidence: replacementEvidence("q-002", "q-101")
  }), /source does not match/);
});

test("one placement projection drives question, answer, solution, and analysis numbering", () => {
  const moved = editor.movePlacement(draft(), "p-003", 0);
  const projection = editor.createDraftProjection(moved);
  assert.deepEqual(projection.entries.map(entry => [entry.number, entry.placementId, entry.itemId, entry.itemVersionId]), [
    [1, "p-003", "q-003", "q-003-v1"],
    [2, "p-001", "q-001", "q-001-v1"],
    [3, "p-002", "q-002", "q-002-v1"]
  ]);
  assert.equal(projection.revision, moved.revision);
});

test("final readiness rechecks version, scope, single answer, and user approval", () => {
  const metadata = {
    "q-001": candidate("q-001"),
    "q-002": candidate("q-002"),
    "q-003": candidate("q-003")
  };
  assert.equal(editor.evaluateDraftReadiness(draft(), metadata).eligible, true);

  const stale = { ...metadata, "q-002": candidate("q-002", { itemVersionId: "q-002-v2" }) };
  const staleResult = editor.evaluateDraftReadiness(draft(), stale);
  assert.equal(staleResult.eligible, false);
  assert.ok(staleResult.issues.includes("placement.version.mismatch:p-002"));

  const blocked = { ...metadata, "q-003": candidate("q-003", { userApprovalStatus: "pending" }) };
  assert.equal(editor.evaluateDraftReadiness(draft(), blocked).eligible, false);
});

test("readiness reports an invalid draft without trying to create a projection", () => {
  const invalid = { ...draft(), revision: 0 };
  const result = editor.evaluateDraftReadiness(invalid, {});
  assert.equal(result.eligible, false);
  assert.equal(result.projection, null);
  assert.ok(result.issues.includes("draft.revision.invalid"));

  const missing = editor.evaluateDraftReadiness(null, {});
  assert.equal(missing.eligible, false);
  assert.equal(missing.projection, null);
  assert.deepEqual(missing.issues, ["draft.placements.missing"]);
});
