(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_SOURCE_LINEAGE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const ASSET_VARIANTS = Object.freeze(["original", "twin", "similar"]);
  const LINEAGE_RELATIONS = Object.freeze(["original", "twin", "similar"]);
  const APPROVAL_STATUSES = Object.freeze(["pending", "approved", "rejected", "revoked"]);
  const FINGERPRINT_PATTERN = /^sha256:[0-9a-f]{64}$/;
  const LOCATOR_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{0,31}$/;
  const FORBIDDEN_ASSET_KEYS = Object.freeze([
    "url", "uri", "path", "filePath", "pdfUrl", "downloadUrl", "storageUrl", "originalUrl"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
  }

  function rejectDirectAssetLocations(input) {
    FORBIDDEN_ASSET_KEYS.forEach(function (key) {
      invariant(!hasOwn(input, key), `source asset references cannot contain ${key}`);
    });
  }

  function createBBox(input) {
    invariant(input && typeof input === "object", "bbox is required");
    const values = ["x", "y", "width", "height"].map(function (key) { return Number(input[key]); });
    values.forEach(function (value) { invariant(Number.isFinite(value), "bbox values must be finite numbers"); });
    const x = values[0], y = values[1], width = values[2], height = values[3];
    invariant(x >= 0 && y >= 0 && width > 0 && height > 0, "bbox values must be positive normalized coordinates");
    invariant(x + width <= 1 && y + height <= 1, "bbox must stay inside the page");
    return Object.freeze({ x, y, width, height, unit: "ratio" });
  }

  function createItemLocator(input) {
    invariant(input && typeof input === "object", "itemLocator is required");
    const code = String(input.code == null ? "" : input.code).trim().toUpperCase();
    invariant(LOCATOR_CODE_PATTERN.test(code), "itemLocator.code must be a neutral code");
    return Object.freeze({ code });
  }

  function createSourceAssetReference(input) {
    invariant(input && typeof input === "object", "source asset reference is required");
    rejectDirectAssetLocations(input);
    const parsed = core.parseNeutralId(input.sourceAssetId);
    invariant(parsed && parsed.entity === "source", "sourceAssetId must be a neutral source id");
    const sourceFingerprint = String(input.sourceFingerprint || "").toLowerCase();
    invariant(FINGERPRINT_PATTERN.test(sourceFingerprint), "sourceFingerprint must be a sha256 fingerprint");
    invariant(Number.isSafeInteger(input.pageNumber) && input.pageNumber > 0, "pageNumber must be a positive integer");
    invariant(ASSET_VARIANTS.includes(input.assetVariant), "assetVariant is not allowed");
    invariant(input.itemLocator || input.bbox, "itemLocator or bbox is required");
    return Object.freeze({
      sourceAssetId: input.sourceAssetId,
      sourceFingerprint,
      pageNumber: input.pageNumber,
      itemLocator: input.itemLocator ? createItemLocator(input.itemLocator) : null,
      bbox: input.bbox ? createBBox(input.bbox) : null,
      assetVariant: input.assetVariant,
      deliveryPolicy: "signed-page-images"
    });
  }

  function createQuestionLineage(input) {
    invariant(input && typeof input === "object", "question lineage is required");
    const mode = String(input.mode || "").toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "lineage mode is not allowed");
    invariant(core.isNeutralId(input.id, "lineage", mode), "lineage.id is invalid");
    invariant(core.isNeutralId(input.sourceExamId, "exam", mode), "lineage.sourceExamId is invalid");
    invariant(core.isNeutralId(input.originalQuestionId, "question", mode), "lineage.originalQuestionId is invalid");
    invariant(core.isNeutralId(input.questionId, "question", mode), "lineage.questionId is invalid");
    invariant(core.isNeutralId(input.questionTypeId, "type", mode), "lineage.questionTypeId is invalid");
    invariant(LINEAGE_RELATIONS.includes(input.relation), "lineage.relation is not allowed");
    const sourceAsset = createSourceAssetReference(input.sourceAsset);
    invariant(core.isNeutralId(sourceAsset.sourceAssetId, "source", mode), "source asset mode must match lineage mode");
    invariant(sourceAsset.assetVariant === input.relation, "assetVariant must match lineage relation");
    if (input.relation === "original") {
      invariant(input.questionId === input.originalQuestionId, "original lineage must point to itself");
    } else {
      invariant(input.questionId !== input.originalQuestionId, "derived lineage must point to a distinct original question");
    }
    return Object.freeze({
      id: input.id,
      sourceExamId: input.sourceExamId,
      originalQuestionId: input.originalQuestionId,
      questionId: input.questionId,
      questionTypeId: input.questionTypeId,
      relation: input.relation,
      sourceAsset
    });
  }

  function createUserApproval(input) {
    invariant(input && typeof input === "object", "user approval is required");
    const mode = String(input.mode || "").toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "approval mode is not allowed");
    invariant(core.isNeutralId(input.id, "approval", mode), "approval.id is invalid");
    invariant(core.isNeutralId(input.questionId, "question", mode), "approval.questionId is invalid");
    invariant(APPROVAL_STATUSES.includes(input.status), "approval.status is not allowed");
    invariant(Number.isSafeInteger(input.decisionVersion) && input.decisionVersion > 0, "approval.decisionVersion must be positive");
    return Object.freeze({
      id: input.id,
      questionId: input.questionId,
      status: input.status,
      decisionVersion: input.decisionVersion,
      reviewer: core.WRITER
    });
  }

  function validateQuestionLineage(question) {
    const issues = [];
    try {
      const lineage = createQuestionLineage(Object.assign({ mode: question && question.mode }, question && question.lineage));
      if (lineage.questionId !== question.id) issues.push("source_lineage.question_mismatch");
    } catch (_error) {
      issues.push("source_lineage.invalid");
    }
    return Object.freeze(issues);
  }

  function createApprovedServiceChain(input) {
    invariant(input && typeof input === "object", "service chain is required");
    const mode = String(input.mode || "").toUpperCase();
    const lineages = LINEAGE_RELATIONS.map(function (relation) {
      const record = createQuestionLineage(Object.assign({ mode }, input[relation]));
      invariant(record.relation === relation, `service chain ${relation} relation is invalid`);
      return record;
    });
    const original = lineages[0];
    lineages.slice(1).forEach(function (record) {
      invariant(record.sourceExamId === original.sourceExamId, "service chain source exam must match");
      invariant(record.originalQuestionId === original.questionId, "service chain original question must match");
      invariant(record.questionTypeId === original.questionTypeId, "service chain question type must match");
    });
    const approvals = LINEAGE_RELATIONS.map(function (relation, index) {
      const approval = createUserApproval(Object.assign({ mode }, input.approvals && input.approvals[relation]));
      invariant(approval.questionId === lineages[index].questionId, `service chain ${relation} approval target must match`);
      invariant(approval.status === "approved", `service chain ${relation} is not approved`);
      return approval;
    });
    return Object.freeze({
      sourceExamId: original.sourceExamId,
      originalQuestionId: original.questionId,
      questionTypeId: original.questionTypeId,
      stages: Object.freeze(LINEAGE_RELATIONS.map(function (relation, index) {
        return Object.freeze({ relation, lineage: lineages[index], approval: approvals[index] });
      }))
    });
  }

  return Object.freeze({
    ASSET_VARIANTS,
    LINEAGE_RELATIONS,
    APPROVAL_STATUSES,
    FINGERPRINT_PATTERN,
    FORBIDDEN_ASSET_KEYS,
    createBBox,
    createItemLocator,
    createSourceAssetReference,
    createQuestionLineage,
    createUserApproval,
    createApprovedServiceChain,
    validateQuestionLineage
  });
});
