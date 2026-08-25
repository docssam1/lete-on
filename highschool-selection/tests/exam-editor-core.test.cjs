const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const editor = require("../data/exam-editor-core.js");

function makeQuestion(index, overrides = {}) {
  const mode = overrides.mode || "SH";
  const difficultyBand = overrides.difficultyBand || "standard";
  const relation = overrides.relation || "original";
  const questionId = overrides.questionId || core.createNeutralId("question", mode, `editor:item-${index}`);
  const originalQuestionId = relation === "original"
    ? questionId
    : (overrides.originalQuestionId || core.createNeutralId("question", mode, `editor:original-${index}`));
  const familyId = overrides.familyId || originalQuestionId;
  const sourceAsset = sourceLineage.createSourceAssetReference({
    sourceAssetId: core.createNeutralId("source", mode, `editor:asset-${index}`),
    sourceFingerprint: `sha256:${String(index).padStart(64, "0")}`,
    pageNumber: index,
    itemLocator: { code: `E${String(index).padStart(3, "0")}` },
    assetVariant: relation
  });
  const lineage = sourceLineage.createQuestionLineage({
    mode,
    id: core.createNeutralId("lineage", mode, `editor:lineage-${index}`),
    sourceExamId: core.createNeutralId("exam", mode, "editor:source-exam"),
    originalQuestionId,
    questionId,
    questionTypeId: core.createNeutralId("type", mode, `editor:type-${index}`),
    relation,
    sourceAsset
  });
  const userApproval = sourceLineage.createUserApproval({
    mode,
    id: core.createNeutralId("approval", mode, `editor:approval-${index}`),
    questionId,
    status: "approved",
    decisionVersion: 1
  });
  const {
    familyId: _familyId,
    relation: _relation,
    originalQuestionId: _originalQuestionId,
    questionId: _questionId,
    ...recordOverrides
  } = overrides;
  return {
    id: questionId,
    itemVersionId: `editor-item-${index}-v1`,
    mode,
    writer: "T",
    curriculum: core.createCurriculumPath({
      grade: "G10",
      major: "M01",
      minor: `S${String(index).padStart(3, "0")}`,
      detail: `D${String(index).padStart(3, "0")}`
    }),
    provenance: core.createProvenanceRecord({
      mode,
      role: "internal-variant",
      status: "cleared",
      referenceId: core.createNeutralId("source", mode, `editor:source-${index}`)
    }),
    answerVerification: core.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: "input",
    generationKind: "parameterized",
    difficultyBand,
    variant: core.createVariantRecord({ mode, familyId, band: difficultyBand }),
    lineage,
    userApproval,
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `EDITOR-${index}` },
    figureAudit: { required: false, status: "not_required" },
    reviewStatus: "approved",
    ...recordOverrides
  };
}

function fixture() {
  const questions = [makeQuestion(1), makeQuestion(2), makeQuestion(3)];
  const questionsByItemId = Object.fromEntries(questions.map(question => [question.id, question]));
  const draft = editor.createDraft({
    draftId: "draft-wm-m21-r01",
    mode: "SH",
    profileId: "WM",
    targetId: "middle21-basic-entry",
    durationMinutes: 120,
    scopeKeys: ["G10"],
    placements: questions.map((question, index) => ({
      placementId: `p-00${index + 1}`,
      itemId: question.id,
      itemVersionId: question.itemVersionId,
      score: index + 2,
      selectionKind: "recommended"
    }))
  });
  return { draft, questions, questionsByItemId };
}

function replacementEvidence(source, candidate, relationship = "twin", overrides = {}) {
  return {
    evidenceId: `evidence-${source.id}-${candidate.id}`,
    status: "approved",
    relationship,
    sourceItemId: source.id,
    sourceItemVersionId: source.itemVersionId,
    candidateItemId: candidate.id,
    candidateItemVersionId: candidate.itemVersionId,
    familyMatched: true,
    detailMatched: true,
    solutionStructureMatched: true,
    difficultyCompatible: true,
    ...overrides
  };
}

test("drag reorder changes placements only and keeps canonical item ids intact", () => {
  const { draft, questions } = fixture();
  const moved = editor.movePlacement(draft, "p-003", 0);

  assert.deepEqual(draft.placements.map(item => item.itemId), questions.map(question => question.id));
  assert.deepEqual(moved.placements.map(item => item.itemId), [questions[2].id, questions[0].id, questions[1].id]);
  assert.deepEqual(moved.placements.map(item => item.order), [1, 2, 3]);
  assert.equal(moved.sortMode, "user");
  assert.equal(moved.revision, draft.revision + 1);
});

test("score editing changes one placement, increments revision, and rejects invalid or locked edits", () => {
  const { draft } = fixture();
  const scored = editor.setPlacementScore(draft, "p-002", 4.5);
  assert.equal(scored.placements[1].score, 4.5);
  assert.equal(draft.placements[1].score, 3);
  assert.equal(scored.revision, draft.revision + 1);
  assert.equal(editor.setPlacementScore(scored, "p-002", 4.5).revision, scored.revision);
  assert.throws(() => editor.setPlacementScore(draft, "p-002", 0), /positive/);
  assert.throws(() => editor.setPlacementScore(draft, "p-002", -1), /positive/);
  const locked = editor.createDraft({
    draftId: "draft-locked-score",
    mode: "SH",
    profileId: "WM",
    targetId: "locked-score",
    durationMinutes: 60,
    scopeKeys: ["G10"],
    placements: [{ ...draft.placements[0], placementId: "locked-1", locked: true }]
  });
  assert.throws(() => editor.setPlacementScore(locked, "locked-1", 3), /locked placement score/);
});

test("drafts require a supported program mode", () => {
  const base = {
    draftId: "draft-mode-check",
    profileId: "WM",
    targetId: "mode-check",
    durationMinutes: 60,
    scopeKeys: ["G10"],
    placements: []
  };
  assert.throws(() => editor.createDraft(base), /mode is not allowed/);
  assert.throws(() => editor.createDraft({ ...base, mode: "XX" }), /mode is not allowed/);
  assert.equal(editor.createDraft({ ...base, mode: "sh" }).mode, "SH");
});

test("drafts require at least one scope and empty scope checks fail closed", () => {
  const { draft, questionsByItemId } = fixture();
  assert.throws(() => editor.createDraft({
    draftId: "draft-empty-scope",
    mode: "SH",
    profileId: "WM",
    targetId: "empty-scope",
    durationMinutes: 60,
    scopeKeys: [],
    placements: []
  }), /at least one scope key/);
  assert.throws(() => editor.createDraft({
    draftId: "draft-slash-scope",
    mode: "SH",
    profileId: "WM",
    targetId: "slash-scope",
    durationMinutes: 60,
    scopeKeys: ["/"],
    placements: []
  }), /scope key is invalid/);
  assert.throws(() => editor.changeScope(draft, [], questionsByItemId), /at least one scope key/);
  assert.equal(editor.isCurriculumPathInScope("G10/M01/S01/D01", []), false);
});

test("replace changes one placement and preserves versioned audit evidence", () => {
  const { draft, questions, questionsByItemId } = fixture();
  const replacement = makeQuestion(102, {
    relation: "twin",
    originalQuestionId: questions[1].variant.familyId,
    familyId: questions[1].variant.familyId
  });
  const evidence = replacementEvidence(questions[1], replacement);
  const replaced = editor.replacePlacement(draft, {
    placementId: "p-002",
    candidate: replacement,
    questionsByItemId,
    relationship: "twin",
    replacementEvidence: evidence,
    reasonCode: "same_type_new_form"
  });

  assert.equal(draft.placements[1].itemId, questions[1].id);
  assert.equal(replaced.placements[1].itemId, replacement.id);
  assert.equal(replaced.placements[1].itemVersionId, replacement.itemVersionId);
  assert.equal(replaced.placements[1].selectionKind, "twin");
  assert.deepEqual(replaced.placements[1].replacementHistory[0], {
    fromItemId: questions[1].id,
    fromItemVersionId: questions[1].itemVersionId,
    toItemId: replacement.id,
    toItemVersionId: replacement.itemVersionId,
    relationship: "twin",
    reasonCode: "same_type_new_form",
    evidenceId: evidence.evidenceId
  });
  assert.equal(replaced.revision, draft.revision + 1);
});

test("the complete question gate blocks unapproved, ambiguous, unaudited, and unversioned candidates", () => {
  const { draft, questionsByItemId } = fixture();
  const unapproved = makeQuestion(4);
  unapproved.userApproval = sourceLineage.createUserApproval({
    mode: "SH",
    id: core.createNeutralId("approval", "SH", "editor:approval-pending"),
    questionId: unapproved.id,
    status: "pending",
    decisionVersion: 1
  });
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: unapproved,
    questionsByItemId
  }), /candidate.user_approval.not_approved/);

  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: makeQuestion(5, { singleAnswerAudit: { status: "passed", validOutcomeCount: 2 } }),
    questionsByItemId
  }), /candidate.single_answer.multiple/);

  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: makeQuestion(6, {
      inputType: "figure_select",
      generationKind: "figure_only",
      figureAudit: {
        required: true,
        status: "passed",
        evidenceVisible: true,
        hiddenStateConstrained: false,
        positionUnambiguous: true,
        contrastSufficient: true
      }
    }),
    questionsByItemId
  }), /candidate.figure_visibility.hiddenStateConstrained/);

  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: makeQuestion(7, { itemVersionId: "" }),
    questionsByItemId
  }), /candidate.item_version_id.missing/);
});

test("the same canonical question and related variants cannot be added as new placements", () => {
  const { draft, questions, questionsByItemId } = fixture();
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: questions[1],
    questionsByItemId
  }), /already selected/);

  const relatedFamily = core.createNeutralId("question", "SH", "editor:new-related-family");
  const relatedVariant = makeQuestion(105, {
    relation: "similar",
    originalQuestionId: relatedFamily,
    familyId: relatedFamily
  });
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-005",
    candidate: relatedVariant,
    questionsByItemId
  }), /new placement candidate must be original/);
});

test("new and replacement candidates must match the draft program mode", () => {
  const { draft, questionsByItemId } = fixture();
  const otherMode = makeQuestion(108, { mode: "WM" });
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: otherMode,
    questionsByItemId
  }), /candidate mode does not match draft mode/);
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: otherMode,
    questionsByItemId,
    relationship: "manual"
  }), /candidate mode does not match draft mode/);
});

test("twin and similar replacements require matching lineage and approved evidence", () => {
  const { draft, questions, questionsByItemId } = fixture();
  const wrongRelation = makeQuestion(105, {
    relation: "similar",
    originalQuestionId: questions[0].variant.familyId,
    familyId: questions[0].variant.familyId
  });
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: wrongRelation,
    questionsByItemId,
    relationship: "twin",
    replacementEvidence: replacementEvidence(questions[0], wrongRelation, "twin")
  }), /relationship does not match/);

  const validTwin = makeQuestion(106, {
    relation: "twin",
    originalQuestionId: questions[0].variant.familyId,
    familyId: questions[0].variant.familyId
  });
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: validTwin,
    questionsByItemId,
    relationship: "twin"
  }), /verified replacement evidence is required/);

  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: validTwin,
    questionsByItemId,
    relationship: "twin",
    replacementEvidence: replacementEvidence(questions[0], validTwin, "twin", { solutionStructureMatched: false })
  }), /solution structure is not verified/);

  const wrongFamily = makeQuestion(107, { relation: "twin" });
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: wrongFamily,
    questionsByItemId,
    relationship: "twin",
    replacementEvidence: replacementEvidence(questions[0], wrongFamily)
  }), /same question family/);
});

test("sorting supports type, difficulty, objective-first, and deterministic random order", () => {
  const { draft, questions } = fixture();
  const metadata = {
    [questions[0].id]: { typeCode: "T03", difficultyBand: "raised", inputType: "input" },
    [questions[1].id]: { typeCode: "T01", difficultyBand: "lowered", inputType: "single_choice" },
    [questions[2].id]: { typeCode: "T02", difficultyBand: "standard", inputType: "ox" }
  };

  const expected = [questions[1].id, questions[2].id, questions[0].id];
  assert.deepEqual(editor.sortPlacements(draft, "type_asc", metadata).placements.map(item => item.itemId), expected);
  assert.deepEqual(editor.sortPlacements(draft, "difficulty_asc", metadata).placements.map(item => item.itemId), expected);
  assert.deepEqual(editor.sortPlacements(draft, "objective_subjective", metadata).placements.map(item => item.itemId), expected);
  assert.deepEqual(
    editor.sortPlacements(draft, "random", metadata, { seed: 77 }).placements.map(item => item.itemId),
    editor.sortPlacements(draft, "random", metadata, { seed: 77 }).placements.map(item => item.itemId)
  );
});

test("view mode is presentation state, increments once, and exposes no answers", () => {
  const { draft } = fixture();
  const withSolutions = editor.setViewMode(draft, "question_solution_answer");
  assert.equal(withSolutions.viewMode, "question_solution_answer");
  assert.equal(withSolutions.revision, draft.revision + 1);
  assert.equal(editor.setViewMode(withSolutions, "question_solution_answer").revision, withSolutions.revision);
  assert.equal(JSON.stringify(withSolutions).includes("answerKey"), false);
});

test("summary updates after selection and preserves difficulty and response balance", () => {
  const { draft, questions } = fixture();
  const metadata = {
    [questions[0].id]: { typeCode: "ALG", difficultyBand: "standard", inputType: "input" },
    [questions[1].id]: { typeCode: "ALG", difficultyBand: "raised", inputType: "single_choice" },
    [questions[2].id]: { typeCode: "GEO", difficultyBand: "raised", inputType: "ox" }
  };
  const summary = editor.summarizeDraft(draft, metadata);
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.totalScore, 9);
  assert.deepEqual(summary.byDifficulty, { lowered: 0, standard: 1, raised: 2, unknown: 0 });
  assert.deepEqual(summary.byInput, { objective: 2, subjective: 1, unknown: 0 });
  assert.deepEqual(summary.byType, { ALG: 2, GEO: 1 });
});

test("scope changes keep placements visible and report what must be replaced", () => {
  const { draft, questions } = fixture();
  const metadata = {
    [questions[0].id]: questions[0],
    [questions[1].id]: { curriculum: core.createCurriculumPath({ grade: "G11", major: "M01", minor: "S001", detail: "D001" }) },
    [questions[2].id]: {}
  };
  const result = editor.changeScope(draft, ["G11"], metadata);

  assert.equal(result.draft.placements.length, 3);
  assert.equal(result.draft.revision, draft.revision + 1);
  assert.deepEqual(result.reconciliation.keptPlacementIds, ["p-002"]);
  assert.deepEqual(result.reconciliation.outOfScopePlacementIds, ["p-001"]);
  assert.deepEqual(result.reconciliation.classificationPendingPlacementIds, ["p-003"]);
});

test("new and replacement candidates must belong to the selected scope", () => {
  const { draft, questionsByItemId } = fixture();
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: makeQuestion(4, {
      curriculum: core.createCurriculumPath({ grade: "G11", major: "M01", minor: "S001", detail: "D001" })
    }),
    questionsByItemId
  }), /outside the selected scope/);

  const missingClassification = makeQuestion(101, { curriculum: null });
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: missingClassification,
    questionsByItemId,
    relationship: "manual"
  }), /candidate.curriculum/);
});

test("one placement projection drives every numbered output", () => {
  const { draft, questions } = fixture();
  const moved = editor.movePlacement(draft, "p-003", 0);
  const projection = editor.createDraftProjection(moved);
  assert.deepEqual(projection.entries.map(entry => [entry.number, entry.placementId, entry.itemId, entry.itemVersionId]), [
    [1, "p-003", questions[2].id, questions[2].itemVersionId],
    [2, "p-001", questions[0].id, questions[0].itemVersionId],
    [3, "p-002", questions[1].id, questions[1].itemVersionId]
  ]);
  assert.equal(projection.revision, moved.revision);
});

test("final readiness rechecks version, scope, full gates, and family uniqueness", () => {
  const { draft, questions, questionsByItemId } = fixture();
  assert.equal(editor.evaluateDraftReadiness(draft, questionsByItemId).eligible, true);

  const stale = makeQuestion(2, {
    questionId: questions[1].id,
    itemVersionId: "editor-item-2-v2"
  });
  const staleResult = editor.evaluateDraftReadiness(draft, { ...questionsByItemId, [stale.id]: stale });
  assert.equal(staleResult.eligible, false);
  assert.ok(staleResult.issues.includes("placement.version.mismatch:p-002"));

  const blocked = makeQuestion(3, {
    questionId: questions[2].id,
    userApproval: sourceLineage.createUserApproval({
      mode: "SH",
      id: core.createNeutralId("approval", "SH", "editor:readiness-pending"),
      questionId: questions[2].id,
      status: "pending",
      decisionVersion: 1
    })
  });
  const blockedResult = editor.evaluateDraftReadiness(draft, { ...questionsByItemId, [blocked.id]: blocked });
  assert.equal(blockedResult.eligible, false);
  assert.ok(blockedResult.issues.includes("candidate.user_approval.not_approved:p-003"));

  const duplicateFamily = makeQuestion(20, {
    familyId: questions[0].variant.familyId,
    originalQuestionId: questions[0].variant.familyId,
    relation: "similar"
  });
  const familyDraft = editor.createDraft({
    draftId: "draft-family-check",
    mode: "SH",
    profileId: "WM",
    targetId: "middle21-basic-entry",
    durationMinutes: 120,
    scopeKeys: ["G10"],
    placements: [questions[0], duplicateFamily].map((question, index) => ({
      placementId: `pf-${index + 1}`,
      itemId: question.id,
      itemVersionId: question.itemVersionId,
      score: 2
    }))
  });
  const familyResult = editor.evaluateDraftReadiness(familyDraft, {
    [questions[0].id]: questions[0],
    [duplicateFamily.id]: duplicateFamily
  });
  assert.equal(familyResult.eligible, false);
  assert.ok(familyResult.issues.includes("placement.family.duplicate:pf-2"));

  const replacementOnly = makeQuestion(30, {
    relation: "twin",
    originalQuestionId: questions[0].id,
    familyId: questions[0].id
  });
  const replacementOnlyDraft = editor.createDraft({
    draftId: "draft-replacement-only",
    mode: "SH",
    profileId: "WM",
    targetId: "replacement-only",
    durationMinutes: 60,
    scopeKeys: ["G10"],
    placements: [{
      placementId: "replacement-only-1",
      itemId: replacementOnly.id,
      itemVersionId: replacementOnly.itemVersionId,
      score: 2
    }]
  });
  const replacementOnlyResult = editor.evaluateDraftReadiness(replacementOnlyDraft, {
    [replacementOnly.id]: replacementOnly
  });
  assert.equal(replacementOnlyResult.eligible, false);
  assert.ok(replacementOnlyResult.issues.includes("draft.original.minimum"));

  const wrongMode = makeQuestion(31, { mode: "WM" });
  const wrongModeResult = editor.evaluateDraftReadiness(draft, {
    ...questionsByItemId,
    [questions[0].id]: { ...wrongMode, id: questions[0].id, itemVersionId: questions[0].itemVersionId }
  });
  assert.equal(wrongModeResult.eligible, false);
  assert.ok(wrongModeResult.issues.includes("placement.mode.mismatch:p-001"));
});

test("readiness reports an invalid draft without creating a projection", () => {
  const { draft } = fixture();
  const invalid = { ...draft, revision: 0 };
  const result = editor.evaluateDraftReadiness(invalid, {});
  assert.equal(result.eligible, false);
  assert.equal(result.projection, null);
  assert.ok(result.issues.includes("draft.revision.invalid"));

  const missing = editor.evaluateDraftReadiness(null, {});
  assert.equal(missing.eligible, false);
  assert.equal(missing.projection, null);
  assert.deepEqual(missing.issues, ["draft.placements.missing"]);

  const empty = editor.createDraft({
    draftId: "draft-empty-readiness",
    mode: "SH",
    profileId: "WM",
    targetId: "empty",
    durationMinutes: 60,
    scopeKeys: ["G10"],
    placements: []
  });
  const emptyResult = editor.evaluateDraftReadiness(empty, {});
  assert.equal(emptyResult.eligible, false);
  assert.equal(emptyResult.projection, null);
  assert.ok(emptyResult.issues.includes("draft.placements.empty"));
});
