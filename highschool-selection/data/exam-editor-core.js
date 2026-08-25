(function (root, factory) {
  "use strict";
  const validation = typeof module !== "undefined" && module.exports
    ? require("../shared/question-bank-validation.js")
    : root.HIGHSELECT_QUESTION_BANK_VALIDATION;
  const api = factory(validation);
  root.HIGHSELECT_EXAM_EDITOR_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (validation) {
  "use strict";

  if (!validation) throw new Error("question bank validation module is required");

  const SORT_MODES = Object.freeze([
    "user",
    "type_asc",
    "difficulty_asc",
    "objective_subjective",
    "random"
  ]);
  const VIEW_MODES = Object.freeze([
    "question",
    "question_answer",
    "question_solution_answer"
  ]);
  const SELECTION_KINDS = Object.freeze(["recommended", "manual", "twin", "similar"]);
  const RELATIONSHIPS = Object.freeze(["manual", "twin", "similar"]);
  const DIFFICULTY_ORDER = Object.freeze({ lowered: 0, standard: 1, raised: 2 });
  const OBJECTIVE_INPUT_TYPES = new Set(["single_choice", "multi_choice", "ox"]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function enumValue(value, allowed, field) {
    invariant(allowed.includes(value), `${field} is not allowed`);
    return value;
  }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function freezeDraft(draft) {
    const placements = draft.placements.map(function (placement, index) {
      const history = Object.freeze((placement.replacementHistory || []).map(function (entry) {
        return Object.freeze(clone(entry));
      }));
      return Object.freeze(Object.assign({}, placement, {
        order: index + 1,
        replacementHistory: history
      }));
    });
    return Object.freeze(Object.assign({}, draft, {
      revision: draft.revision,
      scopeKeys: Object.freeze((draft.scopeKeys || []).slice()),
      placements: Object.freeze(placements)
    }));
  }

  function bumpRevision(draft) {
    draft.revision += 1;
    return draft;
  }

  function normalizeScopeKeys(scopeKeys) {
    invariant(Array.isArray(scopeKeys), "scopeKeys must be an array");
    const normalized = scopeKeys.map(function (value) {
      const key = String(value == null ? "" : value).trim();
      invariant(key.length > 0 && key.length <= 160, "scope key is invalid");
      invariant(!key.includes("..") && !key.includes("\\"), "scope key is invalid");
      return key.replace(/\/+$/, "");
    });
    invariant(new Set(normalized).size === normalized.length, "scope keys must be unique");
    return normalized;
  }

  function normalizePlacement(input, order) {
    invariant(input && typeof input === "object", "placement is required");
    invariant(typeof input.placementId === "string" && input.placementId.trim(), "placementId is required");
    invariant(typeof input.itemId === "string" && input.itemId.trim(), "itemId is required");
    invariant(typeof input.itemVersionId === "string" && input.itemVersionId.trim(), "itemVersionId is required");
    const score = Number(input.score == null ? 0 : input.score);
    invariant(Number.isFinite(score) && score >= 0, "placement.score must be non-negative");
    return {
      placementId: input.placementId,
      itemId: input.itemId,
      itemVersionId: input.itemVersionId,
      order,
      score,
      locked: Boolean(input.locked),
      selectionKind: enumValue(input.selectionKind || "manual", SELECTION_KINDS, "placement.selectionKind"),
      replacementHistory: clone(input.replacementHistory || [])
    };
  }

  function createDraft(input) {
    invariant(input && typeof input === "object", "draft is required");
    invariant(typeof input.draftId === "string" && input.draftId.trim(), "draftId is required");
    invariant(typeof input.profileId === "string" && input.profileId.trim(), "profileId is required");
    invariant(typeof input.targetId === "string" && input.targetId.trim(), "targetId is required");
    const durationMinutes = Number(input.durationMinutes);
    invariant(Number.isSafeInteger(durationMinutes) && durationMinutes > 0, "durationMinutes must be a positive integer");
    const revision = Number(input.revision == null ? 1 : input.revision);
    invariant(Number.isSafeInteger(revision) && revision >= 1, "revision must be a positive integer");
    const placements = (input.placements || []).map(function (placement, index) {
      return normalizePlacement(placement, index + 1);
    });
    const draft = {
      draftId: input.draftId,
      revision,
      profileId: input.profileId,
      targetId: input.targetId,
      durationMinutes,
      scopeKeys: normalizeScopeKeys(input.scopeKeys || []),
      sortMode: enumValue(input.sortMode || "user", SORT_MODES, "sortMode"),
      viewMode: enumValue(input.viewMode || "question", VIEW_MODES, "viewMode"),
      placements
    };
    const issues = validateDraft(draft);
    invariant(issues.length === 0, `invalid draft: ${issues.join(", ")}`);
    return freezeDraft(draft);
  }

  function mutableDraft(draft) {
    invariant(draft && typeof draft === "object", "draft is required");
    return {
      draftId: draft.draftId,
      revision: draft.revision,
      profileId: draft.profileId,
      targetId: draft.targetId,
      durationMinutes: draft.durationMinutes,
      scopeKeys: (draft.scopeKeys || []).slice(),
      sortMode: draft.sortMode,
      viewMode: draft.viewMode,
      placements: draft.placements.map(function (placement) { return clone(placement); })
    };
  }

  function validateCandidate(candidate) {
    if (!candidate || typeof candidate !== "object") return Object.freeze(["candidate.missing"]);
    const issues = [];
    if (typeof candidate.itemVersionId !== "string" || !candidate.itemVersionId.trim()) {
      issues.push("candidate.item_version_id.missing");
    }
    const report = validation.evaluateQuestionGates(candidate);
    report.issues.forEach(function (issue) { issues.push(`candidate.${issue}`); });
    return Object.freeze(issues);
  }

  function validateDraft(draft) {
    const issues = [];
    if (!draft || !Array.isArray(draft.placements)) return Object.freeze(["draft.placements.missing"]);
    if (!Number.isSafeInteger(draft.revision) || draft.revision < 1) issues.push("draft.revision.invalid");
    const placementIds = new Set();
    const itemIds = new Set();
    draft.placements.forEach(function (placement, index) {
      if (!placement.itemVersionId) issues.push("draft.item_version_id.missing");
      if (placementIds.has(placement.placementId)) issues.push("draft.placement_id.duplicate");
      placementIds.add(placement.placementId);
      if (itemIds.has(placement.itemId)) issues.push("draft.item_id.duplicate");
      itemIds.add(placement.itemId);
      if (placement.order !== index + 1) issues.push("draft.order.not_contiguous");
    });
    return Object.freeze(Array.from(new Set(issues)));
  }

  function assertCandidate(candidate) {
    const issues = validateCandidate(candidate);
    invariant(issues.length === 0, `candidate is locked: ${issues.join(", ")}`);
  }

  function isCurriculumPathInScope(curriculumPath, scopeKeys) {
    if (!scopeKeys || scopeKeys.length === 0) return true;
    const rawPath = curriculumPath && typeof curriculumPath === "object"
      ? curriculumPath.key
      : curriculumPath;
    const path = String(rawPath == null ? "" : rawPath).replace(/\/+$/, "");
    if (!path) return null;
    return scopeKeys.some(function (scopeKey) {
      return path === scopeKey || path.startsWith(`${scopeKey}/`);
    });
  }

  function assertCandidateInScope(draft, candidate) {
    const match = isCurriculumPathInScope(candidate.curriculum, draft.scopeKeys);
    invariant(match !== false, "candidate is outside the selected scope");
    invariant(match !== null, "candidate curriculum classification is required");
  }

  function selectedQuestion(questionsByItemId, itemId, itemVersionId) {
    const question = questionsByItemId && questionsByItemId[itemId];
    invariant(question && question.id === itemId, "selected item metadata is required");
    if (itemVersionId != null) {
      invariant(question.itemVersionId === itemVersionId, "selected item version does not match");
    }
    return question;
  }

  function assertFamilyAvailable(draft, candidate, questionsByItemId, excludedPlacementId) {
    const familyId = candidate && candidate.variant && candidate.variant.familyId;
    invariant(typeof familyId === "string" && familyId, "candidate family is required");
    draft.placements.forEach(function (placement) {
      if (placement.placementId === excludedPlacementId) return;
      const existing = selectedQuestion(questionsByItemId, placement.itemId, placement.itemVersionId);
      invariant(existing.variant.familyId !== familyId, "question family is already selected");
    });
  }

  function addItem(draft, input) {
    invariant(input && typeof input === "object", "add input is required");
    assertCandidate(input.candidate);
    assertCandidateInScope(draft, input.candidate);
    const next = mutableDraft(draft);
    invariant(!next.placements.some(function (placement) { return placement.itemId === input.candidate.id; }), "item is already selected");
    invariant(!next.placements.some(function (placement) { return placement.placementId === input.placementId; }), "placementId is already selected");
    assertFamilyAvailable(draft, input.candidate, input.questionsByItemId);
    const index = input.index == null ? next.placements.length : Number(input.index);
    invariant(Number.isSafeInteger(index) && index >= 0 && index <= next.placements.length, "add index is out of range");
    next.placements.splice(index, 0, normalizePlacement({
      placementId: input.placementId,
      itemId: input.candidate.id,
      itemVersionId: input.candidate.itemVersionId,
      score: input.score,
      locked: input.locked,
      selectionKind: input.selectionKind || "manual",
      replacementHistory: []
    }, index + 1));
    next.sortMode = "user";
    return freezeDraft(bumpRevision(next));
  }

  function removePlacement(draft, placementId) {
    const next = mutableDraft(draft);
    const index = next.placements.findIndex(function (placement) { return placement.placementId === placementId; });
    invariant(index >= 0, "placement was not found");
    invariant(!next.placements[index].locked, "locked placement cannot be removed");
    next.placements.splice(index, 1);
    next.sortMode = "user";
    return freezeDraft(bumpRevision(next));
  }

  function movePlacement(draft, placementId, toIndex) {
    const next = mutableDraft(draft);
    const fromIndex = next.placements.findIndex(function (placement) { return placement.placementId === placementId; });
    invariant(fromIndex >= 0, "placement was not found");
    const destination = Number(toIndex);
    invariant(Number.isSafeInteger(destination) && destination >= 0 && destination < next.placements.length, "move index is out of range");
    const moved = next.placements.splice(fromIndex, 1)[0];
    next.placements.splice(destination, 0, moved);
    next.sortMode = "user";
    return freezeDraft(bumpRevision(next));
  }

  function replacePlacement(draft, input) {
    invariant(input && typeof input === "object", "replacement input is required");
    assertCandidate(input.candidate);
    assertCandidateInScope(draft, input.candidate);
    const relationship = enumValue(input.relationship || "manual", RELATIONSHIPS, "relationship");
    const next = mutableDraft(draft);
    const index = next.placements.findIndex(function (placement) { return placement.placementId === input.placementId; });
    invariant(index >= 0, "placement was not found");
    invariant(!next.placements[index].locked, "locked placement cannot be replaced");
    invariant(!next.placements.some(function (placement, placementIndex) {
      return placementIndex !== index && placement.itemId === input.candidate.id;
    }), "replacement item is already selected");
    const current = next.placements[index];
    const currentQuestion = selectedQuestion(input.questionsByItemId, current.itemId, current.itemVersionId);
    assertFamilyAvailable(draft, input.candidate, input.questionsByItemId, current.placementId);
    let evidenceId = null;
    if (relationship !== "manual") {
      invariant(input.candidate.lineage && input.candidate.lineage.relation === relationship, "replacement relationship does not match candidate lineage");
      invariant(input.candidate.variant.familyId === currentQuestion.variant.familyId, "replacement must stay in the same question family");
      const evidence = input.replacementEvidence;
      invariant(evidence && typeof evidence === "object", "verified replacement evidence is required");
      invariant(typeof evidence.evidenceId === "string" && evidence.evidenceId.trim(), "replacement evidenceId is required");
      invariant(evidence.status === "approved", "replacement evidence is not approved");
      invariant(evidence.relationship === relationship, "replacement evidence relationship does not match");
      invariant(evidence.sourceItemId === current.itemId && evidence.sourceItemVersionId === current.itemVersionId, "replacement evidence source does not match");
      invariant(evidence.candidateItemId === input.candidate.id && evidence.candidateItemVersionId === input.candidate.itemVersionId, "replacement evidence candidate does not match");
      invariant(evidence.familyMatched === true, "replacement family is not verified");
      invariant(evidence.detailMatched === true, "replacement detail type is not verified");
      invariant(evidence.solutionStructureMatched === true, "replacement solution structure is not verified");
      invariant(evidence.difficultyCompatible === true, "replacement difficulty is not verified");
      evidenceId = evidence.evidenceId;
    }
    current.replacementHistory.push({
      fromItemId: current.itemId,
      fromItemVersionId: current.itemVersionId,
      toItemId: input.candidate.id,
      toItemVersionId: input.candidate.itemVersionId,
      relationship,
      reasonCode: input.reasonCode || "user_selected",
      evidenceId
    });
    current.itemId = input.candidate.id;
    current.itemVersionId = input.candidate.itemVersionId;
    current.selectionKind = relationship;
    next.sortMode = "user";
    return freezeDraft(bumpRevision(next));
  }

  function setViewMode(draft, viewMode) {
    const next = mutableDraft(draft);
    const normalized = enumValue(viewMode, VIEW_MODES, "viewMode");
    if (next.viewMode === normalized) return freezeDraft(next);
    next.viewMode = normalized;
    return freezeDraft(bumpRevision(next));
  }

  function changeScope(draft, scopeKeys, metadataByItemId) {
    const next = mutableDraft(draft);
    next.scopeKeys = normalizeScopeKeys(scopeKeys);
    const metadata = metadataByItemId || {};
    const reconciliation = { keptPlacementIds: [], outOfScopePlacementIds: [], classificationPendingPlacementIds: [] };
    next.placements.forEach(function (placement) {
      const item = metadata[placement.itemId];
      const match = isCurriculumPathInScope(item && (item.curriculum || item.curriculumPath), next.scopeKeys);
      if (match === true) reconciliation.keptPlacementIds.push(placement.placementId);
      else if (match === false) reconciliation.outOfScopePlacementIds.push(placement.placementId);
      else reconciliation.classificationPendingPlacementIds.push(placement.placementId);
    });
    return Object.freeze({
      draft: freezeDraft(bumpRevision(next)),
      reconciliation: Object.freeze({
        keptPlacementIds: Object.freeze(reconciliation.keptPlacementIds),
        outOfScopePlacementIds: Object.freeze(reconciliation.outOfScopePlacementIds),
        classificationPendingPlacementIds: Object.freeze(reconciliation.classificationPendingPlacementIds)
      })
    });
  }

  function seededShuffle(items, seed) {
    let state = Number(seed == null ? 1 : seed) >>> 0;
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const target = state % (index + 1);
      const value = result[index];
      result[index] = result[target];
      result[target] = value;
    }
    return result;
  }

  function sortPlacements(draft, mode, metadataByItemId, options) {
    const sortMode = enumValue(mode, SORT_MODES, "sortMode");
    if (sortMode === "user") return freezeDraft(mutableDraft(draft));
    const next = mutableDraft(draft);
    const metadata = metadataByItemId || {};
    if (sortMode === "random") {
      next.placements = seededShuffle(next.placements, options && options.seed);
    } else {
      next.placements.sort(function (left, right) {
        const leftMeta = metadata[left.itemId] || {};
        const rightMeta = metadata[right.itemId] || {};
        if (sortMode === "type_asc") return String(leftMeta.typeCode || "").localeCompare(String(rightMeta.typeCode || "")) || left.order - right.order;
        if (sortMode === "difficulty_asc") return (DIFFICULTY_ORDER[leftMeta.difficultyBand] ?? 99) - (DIFFICULTY_ORDER[rightMeta.difficultyBand] ?? 99) || left.order - right.order;
        const leftGroup = OBJECTIVE_INPUT_TYPES.has(leftMeta.inputType) ? 0 : 1;
        const rightGroup = OBJECTIVE_INPUT_TYPES.has(rightMeta.inputType) ? 0 : 1;
        return leftGroup - rightGroup || left.order - right.order;
      });
    }
    next.sortMode = sortMode;
    return freezeDraft(bumpRevision(next));
  }

  function createDraftProjection(draft) {
    const issues = validateDraft(draft);
    invariant(issues.length === 0, `invalid draft: ${issues.join(", ")}`);
    return Object.freeze({
      draftId: draft.draftId,
      revision: draft.revision,
      entries: Object.freeze(draft.placements.map(function (placement, index) {
        return Object.freeze({
          number: index + 1,
          placementId: placement.placementId,
          itemId: placement.itemId,
          itemVersionId: placement.itemVersionId,
          score: placement.score
        });
      }))
    });
  }

  function evaluateDraftReadiness(draft, metadataByItemId) {
    const draftIssues = Array.from(validateDraft(draft));
    const issues = draftIssues.slice();
    const metadata = metadataByItemId || {};
    if (!draft || !Array.isArray(draft.placements)) {
      return Object.freeze({
        eligible: false,
        issues: Object.freeze(Array.from(new Set(issues)).sort()),
        projection: null
      });
    }
    const familyIds = new Set();
    draft.placements.forEach(function (placement) {
      const candidate = metadata[placement.itemId];
      if (!candidate) {
        issues.push(`placement.metadata.missing:${placement.placementId}`);
        return;
      }
      if (candidate.id !== placement.itemId || candidate.itemVersionId !== placement.itemVersionId) {
        issues.push(`placement.version.mismatch:${placement.placementId}`);
      }
      validateCandidate(candidate).forEach(function (issue) {
        issues.push(`${issue}:${placement.placementId}`);
      });
      const familyId = candidate.variant && candidate.variant.familyId;
      if (familyId && familyIds.has(familyId)) issues.push(`placement.family.duplicate:${placement.placementId}`);
      if (familyId) familyIds.add(familyId);
      const inScope = isCurriculumPathInScope(candidate.curriculum, draft.scopeKeys);
      if (inScope === false) issues.push(`placement.scope.outside:${placement.placementId}`);
      if (inScope === null) issues.push(`placement.scope.classification_pending:${placement.placementId}`);
    });
    const uniqueIssues = Array.from(new Set(issues)).sort();
    return Object.freeze({
      eligible: uniqueIssues.length === 0,
      issues: Object.freeze(uniqueIssues),
      projection: draftIssues.length === 0 ? createDraftProjection(draft) : null
    });
  }

  function summarizeDraft(draft, metadataByItemId) {
    const metadata = metadataByItemId || {};
    const summary = {
      itemCount: draft.placements.length,
      totalScore: 0,
      byDifficulty: { lowered: 0, standard: 0, raised: 0, unknown: 0 },
      byInput: { objective: 0, subjective: 0, unknown: 0 },
      byType: {}
    };
    draft.placements.forEach(function (placement) {
      const item = metadata[placement.itemId] || {};
      summary.totalScore += placement.score;
      if (Object.hasOwn(DIFFICULTY_ORDER, item.difficultyBand)) summary.byDifficulty[item.difficultyBand] += 1;
      else summary.byDifficulty.unknown += 1;
      if (item.inputType) summary.byInput[OBJECTIVE_INPUT_TYPES.has(item.inputType) ? "objective" : "subjective"] += 1;
      else summary.byInput.unknown += 1;
      const typeCode = item.typeCode || "unknown";
      summary.byType[typeCode] = (summary.byType[typeCode] || 0) + 1;
    });
    return Object.freeze(clone(summary));
  }

  return Object.freeze({
    SORT_MODES,
    VIEW_MODES,
    SELECTION_KINDS,
    RELATIONSHIPS,
    createDraft,
    validateCandidate,
    validateDraft,
    addItem,
    removePlacement,
    movePlacement,
    replacePlacement,
    changeScope,
    isCurriculumPathInScope,
    setViewMode,
    sortPlacements,
    summarizeDraft,
    createDraftProjection,
    evaluateDraftReadiness
  });
});
