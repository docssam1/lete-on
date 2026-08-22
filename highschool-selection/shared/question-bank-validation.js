(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../data/question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const sourceLineage = typeof module !== "undefined" && module.exports
    ? require("../data/source-lineage.js")
    : root.HIGHSELECT_SOURCE_LINEAGE;
  const api = factory(core, sourceLineage);
  root.HIGHSELECT_QUESTION_BANK_VALIDATION = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core, sourceLineage) {
  "use strict";

  if (!core || !sourceLineage) throw new Error("question-bank core and source lineage modules are required");

  const GATE_ORDER = Object.freeze([
    "identity",
    "curriculum",
    "metadata",
    "provenance",
    "source_lineage",
    "answer_verification",
    "single_answer",
    "figure_visibility",
    "user_approval",
    "release"
  ]);
  const FIGURE_INPUT_TYPES = Object.freeze(["figure_select", "construction"]);
  const FIGURE_REQUIRED_FLAGS = Object.freeze([
    "evidenceVisible",
    "hiddenStateConstrained",
    "positionUnambiguous",
    "contrastSufficient"
  ]);

  function result(gate, issues, evidence) {
    return Object.freeze({
      gate,
      passed: issues.length === 0,
      issues: Object.freeze(issues.slice().sort()),
      evidence: evidence ? Object.freeze(evidence) : undefined
    });
  }

  function safeAudit(run, failureCode) {
    try {
      return { value: run(), issue: null };
    } catch (_error) {
      return { value: null, issue: failureCode };
    }
  }

  function auditSingleAnswer(question, hooks) {
    const custom = hooks && hooks.countValidOutcomes;
    const audit = safeAudit(function () {
      return custom ? custom(question) : question && question.singleAnswerAudit;
    }, "single_answer.hook_error");
    if (audit.issue) return result("single_answer", [audit.issue]);

    const raw = audit.value;
    const count = typeof raw === "number" ? raw : raw && raw.validOutcomeCount;
    const status = typeof raw === "object" && raw ? raw.status : "passed";
    const evidenceCode = typeof raw === "object" && raw && typeof raw.evidenceCode === "string"
      ? raw.evidenceCode
      : null;
    const issues = [];
    if (!Number.isSafeInteger(count) || count < 0) issues.push("single_answer.count_invalid");
    else if (count !== 1) issues.push(count === 0 ? "single_answer.none" : "single_answer.multiple");
    if (status !== "passed") issues.push("single_answer.not_passed");
    return result("single_answer", issues, { validOutcomeCount: count, evidenceCode });
  }

  function requiresFigureAudit(question) {
    return !!(question && (
      question.generationKind === "figure_only" ||
      FIGURE_INPUT_TYPES.includes(question.inputType) ||
      (question.figureAudit && question.figureAudit.required === true)
    ));
  }

  function auditFigureVisibility(question, hooks) {
    const required = requiresFigureAudit(question);
    if (!required) return result("figure_visibility", [], { required: false });
    const custom = hooks && hooks.inspectFigure;
    const audit = safeAudit(function () {
      return custom ? custom(question) : question && question.figureAudit;
    }, "figure_visibility.hook_error");
    if (audit.issue) return result("figure_visibility", [audit.issue], { required: true });

    const record = audit.value || {};
    const issues = [];
    if (record.status !== "passed") issues.push("figure_visibility.not_passed");
    FIGURE_REQUIRED_FLAGS.forEach(function (flag) {
      if (record[flag] !== true) issues.push(`figure_visibility.${flag}`);
    });
    return result("figure_visibility", issues, {
      required: true,
      evidenceVisible: record.evidenceVisible === true,
      hiddenStateConstrained: record.hiddenStateConstrained === true,
      positionUnambiguous: record.positionUnambiguous === true,
      contrastSufficient: record.contrastSufficient === true
    });
  }

  function identityGate(question) {
    const issues = [];
    const mode = question && question.mode;
    if (!core.PROGRAM_MODES.includes(mode)) issues.push("identity.mode");
    if (!core.isNeutralId(question && question.id, "question", mode)) issues.push("identity.id");
    if (!question || question.writer !== core.WRITER) issues.push("identity.writer");
    return result("identity", issues);
  }

  function curriculumGate(question) {
    return result("curriculum", Array.from(core.validateCurriculumPath(question && question.curriculum)));
  }

  function metadataGate(question) {
    const issues = [];
    if (!question || !core.INPUT_TYPES.includes(question.inputType)) issues.push("metadata.input_type");
    if (!question || !core.GENERATION_KINDS.includes(question.generationKind)) issues.push("metadata.generation_kind");
    if (!question || !core.DIFFICULTY_BANDS.includes(question.difficultyBand)) issues.push("metadata.difficulty_band");
    if (!question || !question.variant || question.variant.band !== question.difficultyBand) issues.push("metadata.variant_band");
    if (!question || !question.variant || !core.isNeutralId(question.variant.familyId, "question", question.mode)) {
      issues.push("metadata.variant_family");
    }
    return result("metadata", issues);
  }

  function provenanceGate(question) {
    const issues = [];
    const provenance = question && question.provenance;
    if (!provenance || !core.SOURCE_ROLES.includes(provenance.role)) issues.push("provenance.role");
    if (!provenance || !["audited", "cleared"].includes(provenance.status)) issues.push("provenance.status");
    if (!provenance || !core.isNeutralId(provenance.referenceId, "source", question && question.mode)) {
      issues.push("provenance.reference_id");
    }
    return result("provenance", issues);
  }

  function answerGate(question) {
    const record = question && question.answerVerification;
    const issues = [];
    if (!record || record.status !== "verified") issues.push("answer_verification.status");
    if (!record || !Number.isSafeInteger(record.reviewCount) || record.reviewCount < 1) {
      issues.push("answer_verification.review_count");
    }
    return result("answer_verification", issues);
  }

  function sourceLineageGate(question) {
    const issues = Array.from(sourceLineage.validateQuestionLineage(question));
    const lineage = question && question.lineage;
    if (!lineage || !question || !question.variant || lineage.originalQuestionId !== question.variant.familyId) {
      issues.push("source_lineage.family_mismatch");
    }
    return result("source_lineage", issues);
  }

  function userApprovalGate(question) {
    const issues = [];
    try {
      const approval = sourceLineage.createUserApproval(Object.assign({ mode: question && question.mode }, question && question.userApproval));
      if (approval.questionId !== question.id) issues.push("user_approval.question_mismatch");
      if (approval.status !== "approved") issues.push("user_approval.not_approved");
    } catch (_error) {
      issues.push("user_approval.invalid");
    }
    return result("user_approval", issues);
  }

  function releaseGate(question) {
    const issues = [];
    if (!question || !core.REVIEW_STATUSES.includes(question.reviewStatus)) issues.push("release.review_status_invalid");
    if (!question || question.reviewStatus !== "approved") issues.push("release.not_approved");
    return result("release", issues);
  }

  function evaluateQuestionGates(question, hooks) {
    const gates = [
      identityGate(question),
      curriculumGate(question),
      metadataGate(question),
      provenanceGate(question),
      sourceLineageGate(question),
      answerGate(question),
      auditSingleAnswer(question, hooks),
      auditFigureVisibility(question, hooks),
      userApprovalGate(question),
      releaseGate(question)
    ];
    const issues = gates.reduce(function (all, gate) { return all.concat(gate.issues); }, []).sort();
    return Object.freeze({
      eligible: issues.length === 0,
      gates: Object.freeze(gates),
      issues: Object.freeze(issues)
    });
  }

  return Object.freeze({
    GATE_ORDER,
    FIGURE_INPUT_TYPES,
    FIGURE_REQUIRED_FLAGS,
    auditSingleAnswer,
    requiresFigureAudit,
    auditFigureVisibility,
    evaluateQuestionGates
  });
});
