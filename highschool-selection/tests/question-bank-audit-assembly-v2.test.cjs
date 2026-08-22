const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const validation = require("../shared/question-bank-validation.js");
const assembly = require("../shared/exam-assembly.js");

function makeQuestion(index, overrides = {}) {
  const mode = overrides.mode || "SH";
  const difficultyBand = overrides.difficultyBand || "standard";
  const relation = overrides.relation || "original";
  const questionId = core.createNeutralId("question", mode, `registry:item-${index}`);
  const originalQuestionId = relation === "original"
    ? questionId
    : (overrides.originalQuestionId || core.createNeutralId("question", mode, `registry:original-${index}`));
  const familyId = overrides.familyId || originalQuestionId;
  const sourceAsset = sourceLineage.createSourceAssetReference({
    sourceAssetId: core.createNeutralId("source", mode, `registry:asset-${index}`),
    sourceFingerprint: `sha256:${String(index).padStart(64, "0")}`,
    pageNumber: index,
    itemLocator: { code: `I0${index}` },
    assetVariant: relation
  });
  const lineage = sourceLineage.createQuestionLineage({
    mode,
    id: core.createNeutralId("lineage", mode, `registry:lineage-${index}`),
    sourceExamId: core.createNeutralId("exam", mode, "registry:source-exam"),
    originalQuestionId,
    questionId,
    questionTypeId: core.createNeutralId("type", mode, `registry:type-${index}`),
    relation,
    sourceAsset
  });
  const userApproval = sourceLineage.createUserApproval({
    mode,
    id: core.createNeutralId("approval", mode, `registry:approval-${index}`),
    questionId,
    status: "approved",
    decisionVersion: 1
  });
  const { familyId: _familyId, relation: _relation, originalQuestionId: _originalQuestionId, ...recordOverrides } = overrides;
  return {
    id: questionId,
    mode,
    writer: "T",
    points: overrides.points || 10,
    curriculum: core.createCurriculumPath({
      grade: "G10",
      major: "M01",
      minor: `S0${index}`,
      detail: `D0${index}`
    }),
    provenance: core.createProvenanceRecord({
      mode,
      role: "internal-variant",
      status: "cleared",
      referenceId: core.createNeutralId("source", mode, `registry:source-${index}`)
    }),
    answerVerification: core.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: overrides.inputType || "input",
    generationKind: overrides.generationKind || "parameterized",
    difficultyBand,
    variant: core.createVariantRecord({ mode, familyId, band: difficultyBand }),
    lineage,
    userApproval,
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `CHECK-${index}` },
    figureAudit: overrides.figureAudit || { required: false, status: "not_required" },
    reviewStatus: "approved",
    ...recordOverrides
  };
}

test("all deterministic gates pass for an eligible non-figure question", () => {
  const report = validation.evaluateQuestionGates(makeQuestion(1));

  assert.equal(report.eligible, true);
  assert.deepEqual(report.gates.map(gate => gate.gate), validation.GATE_ORDER);
  assert.deepEqual(report.issues, []);
});

test("single-answer hook accepts exactly one valid outcome and exposes no outcomes", () => {
  const question = makeQuestion(1);
  const unique = validation.auditSingleAnswer(question, {
    countValidOutcomes: () => ({ status: "passed", validOutcomeCount: 1, evidenceCode: "ENUM-1" })
  });
  const ambiguous = validation.auditSingleAnswer(question, {
    countValidOutcomes: () => ({ status: "passed", validOutcomeCount: 2, evidenceCode: "ENUM-2" })
  });

  assert.equal(unique.passed, true);
  assert.equal(Object.hasOwn(unique.evidence, "outcomes"), false);
  assert.deepEqual(ambiguous.issues, ["single_answer.multiple"]);
});

test("figure audit requires visible and unambiguous evidence", () => {
  const question = makeQuestion(2, {
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
  });
  const failed = validation.auditFigureVisibility(question);
  const passed = validation.auditFigureVisibility(question, {
    inspectFigure: () => ({
      status: "passed",
      evidenceVisible: true,
      hiddenStateConstrained: true,
      positionUnambiguous: true,
      contrastSufficient: true
    })
  });

  assert.deepEqual(failed.issues, ["figure_visibility.hiddenStateConstrained"]);
  assert.equal(passed.passed, true);
});

test("a question remains blocked until user approval", () => {
  const question = makeQuestion(4);
  question.userApproval = sourceLineage.createUserApproval({
    mode: "SH",
    id: core.createNeutralId("approval", "SH", "registry:approval-pending"),
    questionId: question.id,
    status: "pending",
    decisionVersion: 1
  });
  const report = validation.evaluateQuestionGates(question);
  assert.equal(report.eligible, false);
  assert.equal(report.issues.includes("user_approval.not_approved"), true);
});

test("exam assembly enforces eligibility, quotas, points, and family diversity", () => {
  const questions = [
    makeQuestion(1, { difficultyBand: "lowered", points: 20 }),
    makeQuestion(2, { difficultyBand: "standard", points: 30 }),
    makeQuestion(3, { difficultyBand: "raised", points: 50 })
  ];
  const exam = {
    id: core.createNeutralId("exam", "SH", "registry:exam-001"),
    mode: "SH",
    writer: "T"
  };
  const constraints = {
    questionCount: 3,
    totalPoints: 100,
    maxPerFamily: 1,
    maxPerCurriculumDetail: 1,
    maxFigureQuestions: 0,
    difficultyBands: {
      lowered: { min: 1, max: 1 },
      standard: { min: 1, max: 1 },
      raised: { min: 1, max: 1 }
    },
    inputTypes: { input: { min: 3, max: 3 } },
    lineageRelations: { original: { min: 3, max: 3 } }
  };

  const report = assembly.validateExamAssembly(exam, questions, constraints);
  assert.equal(report.eligible, true);
  assert.deepEqual(report.summary, { questionCount: 3, totalPoints: 100, figureCount: 0, originalCount: 3 });

  const repeated = [questions[0], { ...questions[1], variant: questions[0].variant }];
  const rejected = assembly.validateExamAssembly(exam, repeated, { questionCount: 2, maxPerFamily: 1 });
  assert.equal(rejected.eligible, false);
  assert.equal(rejected.issues.some(issue => issue.code === "constraint.family_repeat"), true);
});

test("an exam cannot be assembled from derived questions only", () => {
  const question = makeQuestion(5, { relation: "similar" });
  const exam = {
    id: core.createNeutralId("exam", "SH", "registry:derived-only-exam"),
    mode: "SH",
    writer: "T"
  };
  const report = assembly.validateExamAssembly(exam, [question], { questionCount: 1 });
  assert.equal(report.eligible, false);
  assert.equal(report.issues.some(issue => issue.code === "constraint.min_original"), true);
});

test("an approved original may be reused across different exam forms", () => {
  const sharedQuestion = makeQuestion(6, { points: 10 });
  const firstExam = {
    id: core.createNeutralId("exam", "SH", "registry:reuse-exam-a"),
    mode: "SH",
    writer: "T"
  };
  const secondExam = {
    id: core.createNeutralId("exam", "SH", "registry:reuse-exam-b"),
    mode: "SH",
    writer: "T"
  };
  const constraints = { questionCount: 1, totalPoints: 10, maxPerFamily: 1 };

  assert.equal(assembly.validateExamAssembly(firstExam, [sharedQuestion], constraints).eligible, true);
  assert.equal(assembly.validateExamAssembly(secondExam, [sharedQuestion], constraints).eligible, true);
});

test("assembly issue ordering is deterministic", () => {
  const report = assembly.validateExamAssembly(
    { id: "invalid", mode: "SH", writer: "" },
    [],
    { questionCount: 1, maxPerFamily: 0 }
  );
  const keys = report.issues.map(issue => `${issue.code}:${issue.context || ""}`);
  assert.deepEqual(keys, keys.slice().sort((a, b) => a.localeCompare(b)));
});
