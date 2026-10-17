(function (root, factory) {
  const engine = typeof module === "object" && module.exports
    ? require("./diagnostic-engine.js")
    : root.GFIELDDiagnosticEngine;
  const api = factory(engine);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDUnitScreenerScoringReadiness = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (engine) {
  "use strict";

  if (!engine) throw new Error("GFIELDDiagnosticEngine is required");

  const DRAFT_SCHEMA_VERSION = "gfield-unit-screener-scoring-draft-v1";
  const STATUS_SCHEMA_VERSION = "gfield-unit-screener-scoring-status-v1";
  const DRAFT_FIELDS = Object.freeze([
    "schemaVersion", "attemptId", "blueprintId", "blueprintVersion", "learnerId", "schoolId",
    "policyId", "policyVersion", "completedAt", "automaticResults", "teacherReviews"
  ]);
  const RESULT_FIELDS = Object.freeze(["itemId", "awardedPoints", "errorType"]);
  const TEACHER_RESULT_FIELDS = Object.freeze(["itemId", "awardedPoints", "errorType", "scoringReview"]);
  const REVIEW_FIELDS = Object.freeze(["reviewId", "reviewerId", "reviewedAt", "attemptId", "itemId"]);
  const FORBIDDEN_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "solution", "rubric", "response", "studentresponse",
    "privatepayload", "privatescoring", "scoringspec", "acceptedalternatives"
  ]);

  function fail(message) { throw new Error(message); }
  function hasAccessors(value) {
    return Object.values(Object.getOwnPropertyDescriptors(value)).some(function (descriptor) {
      return typeof descriptor.get === "function" || typeof descriptor.set === "function";
    });
  }
  function isRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return (prototype === Object.prototype || prototype === null) && !hasAccessors(value);
  }
  function knownFields(value, fields, label) {
    if (!isRecord(value) || Object.getOwnPropertySymbols(value).length) fail(`${label} is invalid`);
    const allowed = new Set(fields);
    if (Object.keys(value).some(function (key) { return !allowed.has(key); })) fail(`${label} has unsupported fields`);
    return value;
  }
  function denseArray(value, label) {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length || hasAccessors(value)) {
      fail(`${label} must be an array`);
    }
    if (Object.keys(value).length !== value.length || Object.keys(value).some(function (key, index) { return key !== String(index); })) {
      fail(`${label} must not have empty slots or unsupported fields`);
    }
    return value;
  }
  function normalizedKey(value) {
    return String(value).normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
  }
  function noPrivateKeys(value, label) {
    const seen = new Set();
    function visit(node, path) {
      if (!node || typeof node !== "object") return;
      if (seen.has(node)) fail(`${label} contains a cycle`);
      seen.add(node);
      if (Array.isArray(node)) denseArray(node, path).forEach(function (child, index) { visit(child, `${path}[${index}]`); });
      else {
        if (!isRecord(node)) fail(`${path} is invalid`);
        Object.keys(node).forEach(function (key) {
          if (FORBIDDEN_KEYS.has(normalizedKey(key))) fail(`${label} contains response or answer data`);
          visit(node[key], `${path}.${key}`);
        });
      }
      seen.delete(node);
    }
    visit(value, label);
  }
  function requireText(value, label, pattern) {
    if (typeof value !== "string" || !value || value !== value.trim() || (pattern && !pattern.test(value))) fail(`${label} is invalid`);
    return value;
  }
  function requirePositiveInteger(value, label) {
    if (!Number.isInteger(value) || value < 1) fail(`${label} is invalid`);
    return value;
  }
  function requireTimestamp(value, label) {
    requireText(value, label, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/);
    const parsed = new Date(value);
    const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) fail(`${label} is invalid`);
  }
  function validatePoints(result, item, label) {
    if (typeof result.awardedPoints !== "number" || !Number.isFinite(result.awardedPoints) || result.awardedPoints < 0 || result.awardedPoints > item.maxPoints) {
      fail(`${label}.awardedPoints is outside the item range`);
    }
    if (result.awardedPoints === item.maxPoints) {
      if (result.errorType != null) fail(`${label}.errorType must be empty for full credit`);
    } else if (!engine.ERROR_TYPES.includes(result.errorType)) fail(`${label}.errorType is required for lost points`);
  }
  function validateDraftMetadata(blueprint, draft) {
    engine.validateBlueprint(blueprint);
    if (blueprint.purpose !== "unit-screener") fail("scoring readiness requires a unit-screener blueprint");
    knownFields(draft, DRAFT_FIELDS, "unit-screener scoring draft");
    noPrivateKeys(draft, "unit-screener scoring draft");
    if (draft.schemaVersion !== DRAFT_SCHEMA_VERSION) fail("unit-screener scoring draft schema is invalid");
    requireText(draft.attemptId, "unit-screener scoring draft.attemptId", /^att-bdg-[a-z0-9]{16}$/);
    if (draft.blueprintId !== blueprint.id || draft.blueprintVersion !== blueprint.version) fail("unit-screener scoring draft must match the blueprint");
    requireText(draft.learnerId, "unit-screener scoring draft.learnerId", /^lrm-bdg-[a-z0-9]{16}$/);
    requireText(draft.schoolId, "unit-screener scoring draft.schoolId", /^sch-bdg-[a-z0-9]{16}$/);
    requireText(draft.policyId, "unit-screener scoring draft.policyId", /^pol-bdg-[a-z0-9-]{4,64}$/);
    requirePositiveInteger(draft.policyVersion, "unit-screener scoring draft.policyVersion");
    requireTimestamp(draft.completedAt, "unit-screener scoring draft.completedAt");
  }
  function inspectScoringReadiness(blueprint, draft) {
    validateDraftMetadata(blueprint, draft);
    const automaticItems = blueprint.items.filter(function (item) { return item.scoringMode === "automatic"; });
    const teacherItems = blueprint.items.filter(function (item) { return item.scoringMode === "teacher"; });
    const automaticById = new Map(automaticItems.map(function (item) { return [item.itemId, item]; }));
    const teacherById = new Map(teacherItems.map(function (item) { return [item.itemId, item]; }));
    const automaticResults = denseArray(draft.automaticResults, "unit-screener scoring draft.automaticResults");
    const teacherReviews = denseArray(draft.teacherReviews, "unit-screener scoring draft.teacherReviews");
    if (automaticResults.length !== automaticItems.length) fail("unit-screener scoring draft requires every automatic result");
    if (teacherReviews.length > teacherItems.length) fail("unit-screener scoring draft has too many teacher reviews");

    const automaticIds = new Set();
    automaticResults.forEach(function (result, index) {
      const label = `unit-screener scoring draft.automaticResults[${index}]`;
      knownFields(result, RESULT_FIELDS, label);
      requireText(result.itemId, `${label}.itemId`, /^qst-bnk-[a-z0-9]{16}$/);
      const item = automaticById.get(result.itemId);
      if (!item || automaticIds.has(result.itemId)) fail(`${label}.itemId is invalid or duplicated`);
      automaticIds.add(result.itemId);
      validatePoints(result, item, label);
    });
    if (automaticIds.size !== automaticById.size) fail("unit-screener scoring draft automatic results are incomplete");

    const reviewedItemIds = new Set();
    const reviewIds = new Set();
    teacherReviews.forEach(function (result, index) {
      const label = `unit-screener scoring draft.teacherReviews[${index}]`;
      knownFields(result, TEACHER_RESULT_FIELDS, label);
      requireText(result.itemId, `${label}.itemId`, /^qst-bnk-[a-z0-9]{16}$/);
      const item = teacherById.get(result.itemId);
      if (!item || reviewedItemIds.has(result.itemId)) fail(`${label}.itemId is invalid or duplicated`);
      reviewedItemIds.add(result.itemId);
      validatePoints(result, item, label);
      knownFields(result.scoringReview, REVIEW_FIELDS, `${label}.scoringReview`);
      requireText(result.scoringReview.reviewId, `${label}.scoringReview.reviewId`, /^grd-bdg-[a-z0-9]{16}$/);
      requireText(result.scoringReview.reviewerId, `${label}.scoringReview.reviewerId`, /^gmt-[a-z0-9]{16}$/);
      requireTimestamp(result.scoringReview.reviewedAt, `${label}.scoringReview.reviewedAt`);
      if (reviewIds.has(result.scoringReview.reviewId)) fail("unit-screener scoring draft teacher review IDs are duplicated");
      reviewIds.add(result.scoringReview.reviewId);
      if (result.scoringReview.attemptId !== draft.attemptId || result.scoringReview.itemId !== item.itemId) {
        fail(`${label}.scoringReview must match the attempt and item`);
      }
      if (Date.parse(result.scoringReview.reviewedAt) < Date.parse(draft.completedAt)) fail(`${label}.scoringReview cannot predate the completed attempt`);
    });

    const pendingItemIds = teacherItems.filter(function (item) { return !reviewedItemIds.has(item.itemId); }).map(function (item) { return item.itemId; });
    return Object.freeze({
      schemaVersion: STATUS_SCHEMA_VERSION,
      state: pendingItemIds.length ? "pending-teacher-review" : "ready-for-analysis",
      counts: Object.freeze({
        totalItemCount: blueprint.items.length,
        automaticScoredCount: automaticResults.length,
        teacherReviewRequiredCount: teacherItems.length,
        teacherReviewedCount: teacherReviews.length,
        teacherPendingCount: pendingItemIds.length
      }),
      pendingItemIds: Object.freeze(pendingItemIds),
      scoreReleased: false,
      analysisReleased: false,
      automaticPrescription: false,
      teacherConfirmationRequired: true
    });
  }
  function buildStudentStatus(blueprint, draft) {
    const status = inspectScoringReadiness(blueprint, draft);
    return Object.freeze({
      schemaVersion: STATUS_SCHEMA_VERSION,
      audience: "student",
      deliveryRequirement: "authenticated-owner-only",
      authorizationVerified: false,
      state: status.state,
      counts: status.counts,
      scoreReleased: false,
      analysisReleased: false,
      automaticPrescription: false,
      teacherConfirmationRequired: true
    });
  }
  function buildTeacherStatus(blueprint, draft) {
    const status = inspectScoringReadiness(blueprint, draft);
    return Object.freeze({
      schemaVersion: STATUS_SCHEMA_VERSION,
      audience: "teacher",
      deliveryRequirement: "authenticated-teacher-or-admin-only",
      authorizationVerified: false,
      assessment: Object.freeze({
        attemptId: draft.attemptId,
        learnerId: draft.learnerId,
        blueprintId: draft.blueprintId,
        blueprintVersion: draft.blueprintVersion
      }),
      state: status.state,
      counts: status.counts,
      pendingItemIds: status.pendingItemIds,
      scoreReleased: false,
      analysisReleased: false,
      automaticPrescription: false,
      teacherConfirmationRequired: true
    });
  }
  function buildFinalAttempt(blueprint, draft) {
    const status = inspectScoringReadiness(blueprint, draft);
    if (status.state !== "ready-for-analysis") fail("unit-screener scoring draft is still pending teacher review");
    const resultById = new Map(draft.automaticResults.concat(draft.teacherReviews).map(function (result) { return [result.itemId, result]; }));
    const attempt = Object.freeze({
      id: draft.attemptId,
      blueprintId: draft.blueprintId,
      blueprintVersion: draft.blueprintVersion,
      learnerId: draft.learnerId,
      schoolId: draft.schoolId,
      policyId: draft.policyId,
      policyVersion: draft.policyVersion,
      completedAt: draft.completedAt,
      itemResults: Object.freeze(blueprint.items.map(function (item) {
        const result = resultById.get(item.itemId);
        const projected = { itemId: result.itemId, awardedPoints: result.awardedPoints };
        if (result.errorType != null) projected.errorType = result.errorType;
        if (result.scoringReview) projected.scoringReview = Object.freeze(Object.assign({}, result.scoringReview));
        return Object.freeze(projected);
      }))
    });
    engine.validateAttempt(blueprint, attempt);
    return attempt;
  }

  return Object.freeze({
    DRAFT_SCHEMA_VERSION,
    STATUS_SCHEMA_VERSION,
    inspectScoringReadiness,
    buildStudentStatus,
    buildTeacherStatus,
    buildFinalAttempt
  });
});
