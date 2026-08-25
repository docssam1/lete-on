(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_EXAM_DRAFT_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("question-bank core is required");

  const SCOPE_STATES = Object.freeze(["in_scope", "out_of_scope", "classification_required"]);
  const VERIFICATION_STATES = Object.freeze(["verified", "review_required"]);
  const LINEAGE_RELATIONS = Object.freeze(["original", "twin", "similar"]);
  const DRAFT_STATUSES = Object.freeze(["draft", "review_required", "approved"]);
  const PLACEMENT_OUTPUT_KEYS = Object.freeze([
    "id", "draftId", "mode", "writer", "item", "order", "points", "scopeVersion", "scopeState",
    "verificationState", "revision", "replacementHistory"
  ]);
  const FORBIDDEN_CONTENT_KEYS = Object.freeze([
    "answer", "answers", "answerspec", "answerkey", "correctanswer", "solution", "explanation",
    "questiontext", "prompt", "url", "uri", "path", "filepath", "pdfurl", "downloadurl", "storageurl"
  ]);
  const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{0,31}$/;
  const TITLE_PATTERN = /^[^<>\r\n]{1,160}$/;

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function own(value, key) {
    return Object.prototype.hasOwnProperty.call(value || {}, key);
  }

  function exactKeys(value, allowed, label) {
    invariant(value && typeof value === "object" && !Array.isArray(value), `${label} is required`);
    const extra = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
    invariant(extra.length === 0, `${label} contains protected or unknown fields: ${extra.join(",")}`);
  }

  function positiveInteger(value, field) {
    invariant(Number.isSafeInteger(value) && value > 0, `${field} must be a positive integer`);
    return value;
  }

  function nonNegativeInteger(value, field) {
    invariant(Number.isSafeInteger(value) && value >= 0, `${field} must be a non-negative integer`);
    return value;
  }

  function neutralQuestionId(value, mode) {
    return core.isNeutralId(value, "question", mode) || core.isSharedBankId(value, "question");
  }

  function neutralTypeId(value, mode) {
    return core.isNeutralId(value, "type", mode) || core.isSharedBankId(value, "type");
  }

  function freezeScope(scope) {
    exactKeys(scope, ["curriculumVersion", "paths"], "scope");
    const version = String(scope.curriculumVersion || "").trim();
    invariant(/^[a-z0-9][a-z0-9._-]{1,63}$/i.test(version), "scope.curriculumVersion is invalid");
    invariant(Array.isArray(scope.paths) && scope.paths.length > 0, "scope.paths are required");
    const paths = scope.paths.map(function (path) { return core.createCurriculumPath(path); });
    const keys = paths.map(function (path) { return path.key; });
    invariant(new Set(keys).size === keys.length, "scope.paths contain a duplicate curriculum path");
    return Object.freeze({
      curriculumVersion: version,
      paths: Object.freeze(paths.slice().sort(function (a, b) { return a.key.localeCompare(b.key); }))
    });
  }

  function createExamDraft(input) {
    exactKeys(input, ["id", "mode", "writer", "title", "scope", "status", "scopeVersion"], "exam draft");
    const mode = String(input.mode || "").toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "examDraft.mode is not allowed");
    invariant(core.isNeutralId(input.id, "examDraft", mode), "examDraft.id is invalid");
    invariant(input.writer === core.WRITER, "examDraft.writer must be T");
    const title = String(input.title || "").trim();
    invariant(TITLE_PATTERN.test(title), "examDraft.title is invalid");
    const status = input.status == null ? "draft" : String(input.status);
    invariant(DRAFT_STATUSES.includes(status), "examDraft.status is not allowed");
    const scopeVersion = input.scopeVersion == null ? 1 : positiveInteger(input.scopeVersion, "examDraft.scopeVersion");
    return Object.freeze({
      id: input.id,
      mode,
      writer: core.WRITER,
      title,
      scope: freezeScope(input.scope),
      status,
      scopeVersion
    });
  }

  function createCandidate(input, draft) {
    exactKeys(input, [
      "itemId", "mode", "familyId", "typeId", "curriculum", "responseType", "classificationVerified", "answerVerified",
      "rightsVerified", "releaseEligible", "lineageRelation", "difficultyBand", "coreConditionVerified", "solutionStructureVerified"
    ], "placement candidate");
    invariant(draft && core.isNeutralId(draft.id, "examDraft", draft.mode), "draft is invalid");
    const mode = String(input.mode || "").toUpperCase();
    invariant(mode === draft.mode || mode === core.SHARED_BANK_SCOPE, "placement candidate mode is not compatible");
    invariant(neutralQuestionId(input.itemId, draft.mode), "placement candidate itemId is invalid");
    invariant(neutralQuestionId(input.familyId, draft.mode), "placement candidate familyId is invalid");
    invariant(neutralTypeId(input.typeId, draft.mode), "placement candidate typeId is invalid");
    const curriculum = core.createCurriculumPath(input.curriculum);
    const responseType = String(input.responseType || "");
    invariant(core.INPUT_TYPES.includes(responseType), "placement candidate responseType is invalid");
    const lineageRelation = String(input.lineageRelation || "");
    invariant(LINEAGE_RELATIONS.includes(lineageRelation), "placement candidate lineageRelation is invalid");
    const difficultyBand = String(input.difficultyBand || "");
    invariant(core.DIFFICULTY_BANDS.includes(difficultyBand), "placement candidate difficultyBand is invalid");
    ["classificationVerified", "answerVerified", "rightsVerified", "releaseEligible", "coreConditionVerified", "solutionStructureVerified"].forEach(function (key) {
      invariant(typeof input[key] === "boolean", `placement candidate ${key} must be boolean`);
    });
    return Object.freeze({
      itemId: input.itemId,
      mode,
      familyId: input.familyId,
      typeId: input.typeId,
      curriculum,
      responseType,
      classificationVerified: input.classificationVerified,
      answerVerified: input.answerVerified,
      rightsVerified: input.rightsVerified,
      releaseEligible: input.releaseEligible,
      lineageRelation,
      difficultyBand,
      coreConditionVerified: input.coreConditionVerified,
      solutionStructureVerified: input.solutionStructureVerified
    });
  }

  function scopeState(scope, candidate) {
    if (!candidate.classificationVerified) return "classification_required";
    return scope.paths.some(function (path) { return path.key === candidate.curriculum.key; }) ? "in_scope" : "out_of_scope";
  }

  function verificationState(candidate) {
    return candidate.classificationVerified && candidate.answerVerified && candidate.rightsVerified && candidate.releaseEligible
      ? "verified"
      : "review_required";
  }

  function createReplacementHistory(value, draft) {
    if (value == null) return Object.freeze([]);
    invariant(Array.isArray(value), "placement.replacementHistory must be an array");
    return Object.freeze(value.map(function (record, index) {
      exactKeys(record, ["version", "previousItemId", "nextItemId", "relation", "reasonCode", "reviewer"], "placement replacement history");
      positiveInteger(record.version, "placement replacement version");
      invariant(record.version === index + 1, "placement replacement history must be ordered");
      invariant(neutralQuestionId(record.previousItemId, draft.mode), "placement replacement previousItemId is invalid");
      invariant(neutralQuestionId(record.nextItemId, draft.mode), "placement replacement nextItemId is invalid");
      invariant(record.previousItemId !== record.nextItemId, "placement replacement must change the item");
      invariant(["twin", "similar"].includes(record.relation), "placement replacement relation is invalid");
      const reasonCode = String(record.reasonCode || "").toUpperCase();
      invariant(CODE_PATTERN.test(reasonCode), "placement replacement reasonCode is invalid");
      invariant(record.reviewer === core.WRITER, "placement replacement reviewer must be T");
      return Object.freeze({ version: record.version, previousItemId: record.previousItemId, nextItemId: record.nextItemId, relation: record.relation, reasonCode, reviewer: core.WRITER });
    }));
  }

  function createExamPlacement(input, draft) {
    exactKeys(input, ["id", "draftId", "mode", "writer", "item", "order", "points", "scopeVersion", "revision", "replacementHistory"], "exam placement");
    invariant(draft && core.isNeutralId(draft.id, "examDraft", draft.mode), "draft is invalid");
    invariant(input.draftId === draft.id, "placement draftId does not match");
    invariant(String(input.mode || "").toUpperCase() === draft.mode, "placement mode does not match");
    invariant(core.isNeutralId(input.id, "placement", draft.mode), "placement.id is invalid");
    invariant(input.writer === core.WRITER, "placement.writer must be T");
    const item = createCandidate(input.item, draft);
    const order = positiveInteger(input.order, "placement.order");
    const points = Number(input.points);
    invariant(Number.isFinite(points) && points > 0 && points <= 100, "placement.points is invalid");
    const scopeVersion = input.scopeVersion == null ? draft.scopeVersion : positiveInteger(input.scopeVersion, "placement.scopeVersion");
    invariant(scopeVersion === draft.scopeVersion, "placement.scopeVersion is stale");
    const revision = input.revision == null ? 0 : nonNegativeInteger(input.revision, "placement.revision");
    const replacementHistory = createReplacementHistory(input.replacementHistory, draft);
    invariant(replacementHistory.length === revision, "placement.revision must match replacement history");
    return Object.freeze({
      id: input.id,
      draftId: draft.id,
      mode: draft.mode,
      writer: core.WRITER,
      item,
      order,
      points,
      scopeVersion,
      scopeState: scopeState(draft.scope, item),
      verificationState: verificationState(item),
      revision,
      replacementHistory
    });
  }

  function placementInput(placement) {
    exactKeys(placement, PLACEMENT_OUTPUT_KEYS, "stored exam placement");
    return {
      id: placement && placement.id,
      draftId: placement && placement.draftId,
      mode: placement && placement.mode,
      writer: placement && placement.writer,
      item: placement && placement.item,
      order: placement && placement.order,
      points: placement && placement.points,
      scopeVersion: placement && placement.scopeVersion,
      revision: placement && placement.revision,
      replacementHistory: placement && placement.replacementHistory
    };
  }

  function sortedPlacements(placements) {
    invariant(Array.isArray(placements), "placements must be an array");
    return placements.slice().sort(function (a, b) { return a.order - b.order || a.id.localeCompare(b.id); });
  }

  function assertPlacementSet(draft, placements) {
    const ids = new Set();
    sortedPlacements(placements).forEach(function (placement) {
      const clean = createExamPlacement(placementInput(placement), draft);
      invariant(!ids.has(clean.id), "placements contain a duplicate placement id");
      ids.add(clean.id);
    });
  }

  function nextPlacementId(draft, candidate, placements) {
    const stableKey = `placement:${draft.id.slice(-16)}:${candidate.itemId.slice(-16)}:${placements.length + 1}`;
    return core.createNeutralId("placement", draft.mode, stableKey);
  }

  function appendPlacement(draft, placements, candidateInput, points, placementId, constraints) {
    assertPlacementSet(draft, placements);
    const candidate = createCandidate(candidateInput, draft);
    invariant(!placements.some(function (placement) { return placement.item.itemId === candidate.itemId; }), "the same item is already placed");
    const config = constraints || {};
    const maxPerFamily = config.maxPerFamily == null ? 1 : Number(config.maxPerFamily);
    invariant(Number.isSafeInteger(maxPerFamily) && maxPerFamily >= 1, "append maxPerFamily is invalid");
    const familyUses = placements.filter(function (placement) { return placement.item.familyId === candidate.familyId; }).length;
    invariant(familyUses < maxPerFamily, "the item family is already placed at its limit");
    const id = placementId || nextPlacementId(draft, candidate, placements);
    invariant(!placements.some(function (placement) { return placement.id === id; }), "placement id already exists");
    const placement = createExamPlacement({
      id, draftId: draft.id, mode: draft.mode, writer: core.WRITER, item: candidate,
      order: placements.length + 1, points, scopeVersion: draft.scopeVersion, revision: 0, replacementHistory: []
    }, draft);
    return Object.freeze(sortedPlacements(placements.concat([placement])));
  }

  function removePlacement(draft, placements, placementId) {
    assertPlacementSet(draft, placements);
    invariant(placements.some(function (placement) { return placement.id === placementId; }), "placement does not exist");
    return Object.freeze(sortedPlacements(placements.filter(function (placement) { return placement.id !== placementId; }).map(function (placement, index) {
      return createExamPlacement(Object.assign(placementInput(placement), { order: index + 1 }), draft);
    })));
  }

  function reorderPlacements(draft, placements, orderedIds) {
    assertPlacementSet(draft, placements);
    invariant(Array.isArray(orderedIds) && orderedIds.length === placements.length, "ordered placement ids must exactly match placements");
    invariant(new Set(orderedIds).size === orderedIds.length, "ordered placement ids contain duplicates");
    const byId = new Map(placements.map(function (placement) { return [placement.id, placement]; }));
    orderedIds.forEach(function (id) { invariant(byId.has(id), "ordered placement id is unknown"); });
    return Object.freeze(orderedIds.map(function (id, index) {
      return createExamPlacement(Object.assign(placementInput(byId.get(id)), { order: index + 1 }), draft);
    }));
  }

  function replacePlacement(draft, placement, candidateInput, replacement) {
    const current = createExamPlacement(placementInput(placement), draft);
    const candidate = createCandidate(candidateInput, draft);
    exactKeys(replacement, ["reasonCode", "sameFamily", "sameDetailType", "sameCoreConditions", "sameSolutionStructure", "difficultyReviewed", "reviewer"], "replacement");
    invariant(candidate.itemId !== current.item.itemId, "replacement must use a different item");
    invariant(["twin", "similar"].includes(candidate.lineageRelation), "replacement must be twin or similar");
    invariant(candidate.familyId === current.item.familyId && replacement.sameFamily === true, "replacement family is not verified");
    invariant(candidate.typeId === current.item.typeId && replacement.sameDetailType === true, "replacement detail type is not verified");
    invariant(candidate.coreConditionVerified === true && replacement.sameCoreConditions === true, "replacement core conditions are not verified");
    invariant(candidate.solutionStructureVerified === true && replacement.sameSolutionStructure === true, "replacement solution structure is not verified");
    invariant(replacement.difficultyReviewed === true, "replacement difficulty is not reviewed");
    invariant(replacement.reviewer === core.WRITER, "replacement reviewer must be T");
    const reasonCode = String(replacement.reasonCode || "").toUpperCase();
    invariant(CODE_PATTERN.test(reasonCode), "replacement reasonCode is invalid");
    const history = current.replacementHistory.concat([Object.freeze({
      version: current.revision + 1,
      previousItemId: current.item.itemId,
      nextItemId: candidate.itemId,
      relation: candidate.lineageRelation,
      reasonCode,
      reviewer: core.WRITER
    })]);
    return createExamPlacement({
      id: current.id, draftId: current.draftId, mode: current.mode, writer: core.WRITER, item: candidate,
      order: current.order, points: current.points, scopeVersion: draft.scopeVersion, revision: current.revision + 1,
      replacementHistory: history
    }, draft);
  }

  function changeDraftScope(draftInput, placements, scope) {
    const draft = createExamDraft(draftInput);
    assertPlacementSet(draft, placements);
    const nextDraft = createExamDraft(Object.assign({}, draft, { scope: scope, scopeVersion: draft.scopeVersion + 1, status: "review_required" }));
    const nextPlacements = Object.freeze(sortedPlacements(placements).map(function (placement) {
      return createExamPlacement(Object.assign(placementInput(placement), { scopeVersion: nextDraft.scopeVersion }), nextDraft);
    }));
    return Object.freeze({ draft: nextDraft, placements: nextPlacements, summary: scopeSummary(nextPlacements) });
  }

  function scopeSummary(placements) {
    const summary = { in_scope: 0, out_of_scope: 0, classification_required: 0, verified: 0, review_required: 0 };
    placements.forEach(function (placement) {
      summary[placement.scopeState] += 1;
      summary[placement.verificationState] += 1;
    });
    return Object.freeze(summary);
  }

  function validateExamDraft(draftInput, placements, constraints) {
    const draft = createExamDraft(draftInput);
    const issues = [];
    const config = constraints || {};
    const items = sortedPlacements(placements || []);
    const placementIds = new Set(), itemIds = new Set(), familyCounts = new Map();
    items.forEach(function (placement, index) {
      let clean;
      try { clean = createExamPlacement(placementInput(placement), draft); } catch (_error) { issues.push(`placement.${index + 1}.invalid`); return; }
      if (placementIds.has(clean.id)) issues.push(`placement.${index + 1}.duplicate_id`);
      placementIds.add(clean.id);
      if (itemIds.has(clean.item.itemId)) issues.push(`placement.${index + 1}.duplicate_item`);
      itemIds.add(clean.item.itemId);
      familyCounts.set(clean.item.familyId, (familyCounts.get(clean.item.familyId) || 0) + 1);
      if (clean.order !== index + 1) issues.push(`placement.${index + 1}.order`);
      if (clean.scopeState !== "in_scope") issues.push(`placement.${index + 1}.${clean.scopeState}`);
      if (clean.verificationState !== "verified") issues.push(`placement.${index + 1}.review_required`);
    });
    const maxPerFamily = config.maxPerFamily == null ? 1 : Number(config.maxPerFamily);
    if (!Number.isSafeInteger(maxPerFamily) || maxPerFamily < 1) issues.push("constraint.max_per_family_invalid");
    else Array.from(familyCounts.entries()).forEach(function (entry) { if (entry[1] > maxPerFamily) issues.push(`family.${entry[0]}.overused`); });
    if (config.questionCount != null && (!Number.isSafeInteger(config.questionCount) || config.questionCount < 1 || items.length !== config.questionCount)) issues.push("constraint.question_count");
    if (config.totalPoints != null) {
      const total = items.reduce(function (sum, placement) { return sum + (Number(placement.points) || 0); }, 0);
      if (!Number.isFinite(config.totalPoints) || total !== config.totalPoints) issues.push("constraint.total_points");
    }
    issues.sort();
    return Object.freeze({ eligible: issues.length === 0, issues: Object.freeze(issues), summary: Object.freeze(Object.assign({ questionCount: items.length }, scopeSummary(items))) });
  }

  return Object.freeze({
    SCOPE_STATES,
    VERIFICATION_STATES,
    LINEAGE_RELATIONS,
    DRAFT_STATUSES,
    PLACEMENT_OUTPUT_KEYS,
    FORBIDDEN_CONTENT_KEYS,
    createExamDraft,
    createCandidate,
    createExamPlacement,
    appendPlacement,
    removePlacement,
    reorderPlacements,
    replacePlacement,
    changeDraftScope,
    scopeSummary,
    validateExamDraft
  });
});
