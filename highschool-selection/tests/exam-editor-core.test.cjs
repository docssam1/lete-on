const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const editor = require("../data/exam-editor-core.js");

function makeQuestion(index, overrides = {}) {
  const mode = overrides.mode || "SH";
  const difficultyBand = overrides.difficultyBand || "standard";
  const relation = overrides.relation || "original";
  const questionId = core.createNeutralId("question", mode, `editor:item-${index}`);
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
    ...recordOverrides
  } = overrides;
  return {
    id: questionId,
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
    profileId: "WM",
    targetId: "middle21-basic-entry",
    durationMinutes: 120,
    scopeKeys: ["G10"],
    placements: questions.map((question, index) => ({
      placementId: `p-00${index + 1}`,
      itemId: question.id,
      score: index + 2,
      selectionKind: "recommended"
    }))
  });
  return { draft, questions, questionsByItemId };
}

test("drag reorder changes placements only and keeps canonical item ids intact", () => {
  const { draft, questions } = fixture();
  const moved = editor.movePlacement(draft, "p-003", 0);

  assert.deepEqual(draft.placements.map(item => item.itemId), questions.map(question => question.id));
  assert.deepEqual(moved.placements.map(item => item.itemId), [questions[2].id, questions[0].id, questions[1].id]);
  assert.deepEqual(moved.placements.map(item => item.order), [1, 2, 3]);
  assert.equal(moved.sortMode, "user");
});

test("replace changes one placement and preserves an audit trail", () => {
  const { draft, questions, questionsByItemId } = fixture();
  const replacement = makeQuestion(102, {
    relation: "twin",
    originalQuestionId: questions[1].variant.familyId,
    familyId: questions[1].variant.familyId
  });
  const replaced = editor.replacePlacement(draft, {
    placementId: "p-002",
    candidate: replacement,
    questionsByItemId,
    relationship: "twin",
    reasonCode: "same_type_new_form"
  });

  assert.equal(draft.placements[1].itemId, questions[1].id);
  assert.equal(replaced.placements[1].itemId, replacement.id);
  assert.equal(replaced.placements[1].selectionKind, "twin");
  assert.deepEqual(replaced.placements[1].replacementHistory[0], {
    fromItemId: questions[1].id,
    toItemId: replacement.id,
    relationship: "twin",
    reasonCode: "same_type_new_form"
  });
});

test("the complete question gate blocks unapproved, ambiguous, and unaudited figure candidates", () => {
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
});

test("the same canonical question or question family cannot be selected twice", () => {
  const { draft, questions, questionsByItemId } = fixture();
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: questions[1],
    questionsByItemId
  }), /already selected/);

  const sameFamily = makeQuestion(104, {
    relation: "similar",
    originalQuestionId: questions[0].variant.familyId,
    familyId: questions[0].variant.familyId
  });
  assert.throws(() => editor.addItem(draft, {
    placementId: "p-004",
    candidate: sameFamily,
    questionsByItemId
  }), /question family is already selected/);
});

test("replacement relation must match lineage and stay in the current family", () => {
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
    relationship: "twin"
  }), /relationship does not match/);

  const wrongFamily = makeQuestion(106, { relation: "twin" });
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: wrongFamily,
    questionsByItemId,
    relationship: "twin"
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

test("view mode is presentation state and does not expose answers in the draft model", () => {
  const { draft } = fixture();
  const withSolutions = editor.setViewMode(draft, "question_solution_answer");
  assert.equal(withSolutions.viewMode, "question_solution_answer");
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

  const missingClassification = makeQuestion(101);
  missingClassification.curriculum = null;
  assert.throws(() => editor.replacePlacement(draft, {
    placementId: "p-001",
    candidate: missingClassification,
    questionsByItemId,
    relationship: "manual"
  }), /candidate.curriculum/);
});
