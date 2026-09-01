(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_USER_EXAM_LIBRARY_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const GENERATION_MODES = Object.freeze(["academy_prep", "learning"]);
  const LIBRARY_STATES = Object.freeze(["temporary", "saved"]);
  const ENTITLEMENT_KINDS = Object.freeze(["academy_semester", "academy_all", "all_learning"]);
  const SELECTION_CONDITION_KEYS = Object.freeze([
    "scopeKeys", "difficultyWeights", "responseWeights", "questionCount", "maxPerFamily", "domainQuotas"
  ]);
  const REQUIRED_SELECTION_CONDITION_KEYS = Object.freeze([
    "scopeKeys", "difficultyWeights", "responseWeights", "questionCount", "maxPerFamily"
  ]);
  const FORBIDDEN_RECIPE_KEYS = Object.freeze([
    "questiontext", "questionbody", "prompt", "stem", "body", "answer", "answers", "answerspec",
    "answerkey", "officialanswer", "correctanswer", "solution", "explanation", "hint", "sourcepath",
    "filepath", "pdfurl", "downloadurl", "storageurl", "originalurl"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function clean(value) { return String(value == null ? "" : value).trim(); }

  function token(value, field) {
    const result = clean(value);
    invariant(result.length > 0 && result.length <= 180, `${field} is required`);
    invariant(/^[A-Za-z0-9._:-]+$/.test(result), `${field} is invalid`);
    return result;
  }

  function optionalToken(value, field) {
    return value == null || value === "" ? null : token(value, field);
  }

  function iso(value, field) {
    invariant(value != null && clean(value), `${field} must be a valid timestamp`);
    const parsed = new Date(value);
    invariant(Number.isFinite(parsed.getTime()), `${field} must be a valid timestamp`);
    return parsed.toISOString();
  }

  function positiveInteger(value, field, maximum) {
    const number = Number(value);
    invariant(Number.isSafeInteger(number) && number > 0, `${field} must be a positive integer`);
    if (maximum != null) invariant(number <= maximum, `${field} is too large`);
    return number;
  }

  function score(value, field) {
    const number = Number(value);
    invariant(Number.isFinite(number) && number > 0, `${field} must be positive`);
    return number;
  }

  function enumValue(value, allowed, field) {
    const result = clean(value);
    invariant(allowed.includes(result), `${field} is not allowed`);
    return result;
  }

  function assertExactKeys(value, allowed, field) {
    invariant(value && typeof value === "object" && !Array.isArray(value), `${field} must be an object`);
    Object.keys(value).forEach(function (key) {
      invariant(allowed.has(key), `${field}.${key} is not allowed`);
    });
  }

  function normalizedKey(value) {
    return String(value).normalize("NFKC").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function assertMetadataOnly(value, field) {
    const ancestors = new Set();
    function visit(node, path) {
      if (node == null || typeof node !== "object") {
        invariant(["string", "number", "boolean"].includes(typeof node) || node == null, `${path} contains an unsupported value`);
        if (typeof node === "number") invariant(Number.isFinite(node), `${path} contains a non-finite number`);
        return;
      }
      invariant(!ancestors.has(node), `${field} cannot contain cycles`);
      ancestors.add(node);
      if (Array.isArray(node)) {
        node.forEach(function (item, index) { visit(item, `${path}[${index}]`); });
      } else {
        const prototype = Object.getPrototypeOf(node);
        invariant(prototype === Object.prototype || prototype === null, `${path} must contain plain data`);
        Object.keys(node).forEach(function (key) {
          invariant(!FORBIDDEN_RECIPE_KEYS.includes(normalizedKey(key)), `${field} cannot contain ${key}`);
          visit(node[key], `${path}.${key}`);
        });
      }
      ancestors.delete(node);
    }
    visit(value, field);
    return true;
  }

  function stableCopy(value) {
    if (Array.isArray(value)) return Object.freeze(value.map(stableCopy));
    if (!value || typeof value !== "object") return value;
    const result = {};
    Object.keys(value).sort().forEach(function (key) { result[key] = stableCopy(value[key]); });
    return Object.freeze(result);
  }

  function createLibraryPlan(input) {
    assertExactKeys(input, new Set(["planId", "maxSavedExamCount", "maxRecentExamCount", "temporaryRetentionDays"]), "plan");
    return Object.freeze({
      planId: token(input.planId, "plan.planId"),
      maxSavedExamCount: positiveInteger(input.maxSavedExamCount, "plan.maxSavedExamCount", 1000),
      maxRecentExamCount: positiveInteger(input.maxRecentExamCount, "plan.maxRecentExamCount", 100),
      temporaryRetentionDays: positiveInteger(input.temporaryRetentionDays, "plan.temporaryRetentionDays", 365)
    });
  }

  function normalizeEntitlements(input) {
    invariant(Array.isArray(input), "entitlements must be an array");
    const seen = new Set();
    const normalized = input.map(function (entry, index) {
      const field = `entitlements[${index}]`;
      invariant(entry && typeof entry === "object" && !Array.isArray(entry), `${field} must be an object`);
      const kind = enumValue(entry.kind, ENTITLEMENT_KINDS, `${field}.kind`);
      const allowed = kind === "academy_semester"
        ? new Set(["kind", "academyId", "semesterId"])
        : kind === "academy_all"
          ? new Set(["kind", "academyId"])
          : new Set(["kind"]);
      assertExactKeys(entry, allowed, field);
      const result = { kind };
      if (kind !== "all_learning") result.academyId = token(entry.academyId, `${field}.academyId`);
      if (kind === "academy_semester") result.semesterId = token(entry.semesterId, `${field}.semesterId`);
      const key = `${kind}:${result.academyId || "*"}:${result.semesterId || "*"}`;
      invariant(!seen.has(key), "entitlements cannot contain duplicate grants");
      seen.add(key);
      return Object.freeze(result);
    });
    return Object.freeze(normalized);
  }

  function normalizeWeightMap(input, labels, field) {
    assertExactKeys(input, new Set(labels), field);
    const result = {};
    let total = 0;
    labels.forEach(function (label) {
      invariant(Object.prototype.hasOwnProperty.call(input, label), `${field}.${label} is required`);
      const value = Number(input[label]);
      invariant(Number.isFinite(value) && value >= 0 && value <= 1000, `${field}.${label} is invalid`);
      result[label] = value;
      total += value;
    });
    invariant(total > 0, `${field} must contain a positive weight`);
    return Object.freeze(result);
  }

  function normalizeSelectionConditions(input) {
    const field = "selectionSnapshot.conditions";
    assertMetadataOnly(input, field);
    assertExactKeys(input, new Set(SELECTION_CONDITION_KEYS), field);
    REQUIRED_SELECTION_CONDITION_KEYS.forEach(function (key) {
      invariant(Object.prototype.hasOwnProperty.call(input, key), `${field}.${key} is required`);
    });
    invariant(Array.isArray(input.scopeKeys) && input.scopeKeys.length >= 1 && input.scopeKeys.length <= 100,
      `${field}.scopeKeys must contain between 1 and 100 keys`);
    const seenScopes = new Set();
    const scopeKeys = input.scopeKeys.map(function (value, index) {
      const scope = clean(value).replace(/\/+$/, "");
      invariant(scope.length <= 320 && /^[A-Za-z0-9._:-]+(?:\/[A-Za-z0-9._:-]+)*$/.test(scope),
        `${field}.scopeKeys[${index}] is invalid`);
      invariant(scope.split("/").every(function (segment) { return segment !== "." && segment !== ".."; }),
        `${field}.scopeKeys[${index}] cannot contain relative path segments`);
      invariant(!seenScopes.has(scope), `${field}.scopeKeys cannot contain duplicates`);
      seenScopes.add(scope);
      return scope;
    });
    const questionCount = positiveInteger(input.questionCount, `${field}.questionCount`, 100);
    let domainQuotas = null;
    if (input.domainQuotas != null) {
      assertExactKeys(input.domainQuotas, new Set(["algebra", "geometry"]), `${field}.domainQuotas`);
      invariant(Object.prototype.hasOwnProperty.call(input.domainQuotas, "algebra") && Object.prototype.hasOwnProperty.call(input.domainQuotas, "geometry"), `${field}.domainQuotas must contain algebra and geometry`);
      domainQuotas = Object.freeze({
        algebra: positiveInteger(input.domainQuotas.algebra, `${field}.domainQuotas.algebra`, 100),
        geometry: positiveInteger(input.domainQuotas.geometry, `${field}.domainQuotas.geometry`, 100)
      });
      invariant(domainQuotas.algebra + domainQuotas.geometry === questionCount, `${field}.domainQuotas must sum to questionCount`);
    }
    return Object.freeze({
      scopeKeys: Object.freeze(scopeKeys),
      difficultyWeights: normalizeWeightMap(input.difficultyWeights, ["lowered", "standard", "raised"], `${field}.difficultyWeights`),
      responseWeights: normalizeWeightMap(input.responseWeights, ["objective", "subjective"], `${field}.responseWeights`),
      questionCount,
      maxPerFamily: positiveInteger(input.maxPerFamily, `${field}.maxPerFamily`, 10),
      domainQuotas
    });
  }

  function normalizeSelectionSnapshot(input, generationMode) {
    assertExactKeys(input, new Set(["academyId", "semesterId", "conditions"]), "selectionSnapshot");
    const conditions = normalizeSelectionConditions(input.conditions);
    const academyId = optionalToken(input.academyId, "selectionSnapshot.academyId");
    if (generationMode === "academy_prep") invariant(academyId, "academy_prep requires selectionSnapshot.academyId");
    return Object.freeze({
      academyId,
      semesterId: token(input.semesterId, "selectionSnapshot.semesterId"),
      conditions
    });
  }

  function normalizeRecipeItem(input, index) {
    const field = `recipe.items[${index}]`;
    assertExactKeys(input, new Set(["itemId", "itemVersionId", "order", "score"]), field);
    return Object.freeze({
      itemId: token(input.itemId, `${field}.itemId`),
      itemVersionId: token(input.itemVersionId, `${field}.itemVersionId`),
      order: positiveInteger(input.order, `${field}.order`, 1000),
      score: score(input.score, `${field}.score`)
    });
  }

  function normalizeLayout(input) {
    if (input == null) return null;
    assertExactKeys(input, new Set(["paperSize", "columns", "itemsPerPage", "fontScale"]), "recipe.layout");
    const result = {};
    if (Object.prototype.hasOwnProperty.call(input, "paperSize")) {
      invariant(input.paperSize === "A4", "recipe.layout.paperSize must be A4");
      result.paperSize = "A4";
    }
    if (Object.prototype.hasOwnProperty.call(input, "columns")) {
      const columns = positiveInteger(input.columns, "recipe.layout.columns", 2);
      invariant(columns === 1 || columns === 2, "recipe.layout.columns must be 1 or 2");
      result.columns = columns;
    }
    if (Object.prototype.hasOwnProperty.call(input, "itemsPerPage")) {
      result.itemsPerPage = positiveInteger(input.itemsPerPage, "recipe.layout.itemsPerPage", 6);
    }
    if (Object.prototype.hasOwnProperty.call(input, "fontScale")) {
      const fontScale = Number(input.fontScale);
      invariant(Number.isFinite(fontScale) && fontScale >= 0.8 && fontScale <= 1.4, "recipe.layout.fontScale must be between 0.8 and 1.4");
      result.fontScale = fontScale;
    }
    return stableCopy(result);
  }

  function normalizeUserExamRecipe(input) {
    assertExactKeys(input, new Set([
      "examId", "ownerId", "state", "createdAt", "updatedAt", "expiresAt",
      "generationMode", "selectionSnapshot", "seed", "parentExamId", "items", "layout"
    ]), "recipe");
    assertMetadataOnly(input, "recipe");
    const state = enumValue(input.state, LIBRARY_STATES, "recipe.state");
    const createdAt = iso(input.createdAt, "recipe.createdAt");
    const updatedAt = iso(input.updatedAt, "recipe.updatedAt");
    invariant(Date.parse(updatedAt) >= Date.parse(createdAt), "recipe.updatedAt cannot precede createdAt");
    let expiresAt = null;
    if (state === "temporary") {
      expiresAt = iso(input.expiresAt, "recipe.expiresAt");
      invariant(Date.parse(expiresAt) > Date.parse(updatedAt), "temporary recipe must expire after updatedAt");
    } else {
      invariant(input.expiresAt == null || input.expiresAt === "", "saved recipe cannot expire");
    }
    invariant(Array.isArray(input.items) && input.items.length > 0, "recipe.items must contain at least one item");
    const items = input.items.map(normalizeRecipeItem).sort(function (left, right) { return left.order - right.order; });
    const itemIds = new Set();
    items.forEach(function (item, index) {
      invariant(item.order === index + 1, "recipe item order must be contiguous from 1");
      invariant(!itemIds.has(item.itemId), "recipe cannot contain duplicate itemId values");
      itemIds.add(item.itemId);
    });
    const seed = Number(input.seed);
    invariant(Number.isSafeInteger(seed) && seed >= 0 && seed <= 0xffffffff, "recipe.seed must be an unsigned 32-bit integer");
    const generationMode = enumValue(input.generationMode, GENERATION_MODES, "recipe.generationMode");
    const selectionSnapshot = normalizeSelectionSnapshot(input.selectionSnapshot, generationMode);
    invariant(selectionSnapshot.conditions.questionCount === items.length,
      "selectionSnapshot.conditions.questionCount must match recipe.items length");
    return Object.freeze({
      examId: token(input.examId, "recipe.examId"),
      ownerId: token(input.ownerId, "recipe.ownerId"),
      state,
      createdAt,
      updatedAt,
      expiresAt,
      generationMode,
      selectionSnapshot,
      seed,
      parentExamId: optionalToken(input.parentExamId, "recipe.parentExamId"),
      items: Object.freeze(items),
      layout: normalizeLayout(input.layout)
    });
  }

  function assertTargetEntitled(entitlementsInput, generationModeInput, academyIdInput, semesterIdInput) {
    const entitlements = normalizeEntitlements(entitlementsInput);
    const generationMode = enumValue(generationModeInput, GENERATION_MODES, "generationMode");
    const academyId = academyIdInput == null ? null : token(academyIdInput, "academyId");
    const semesterId = token(semesterIdInput, "semesterId");
    const allowed = entitlements.some(function (entitlement) {
      if (entitlement.kind === "all_learning") return generationMode === "learning";
      if (!academyId || entitlement.academyId !== academyId) return false;
      if (entitlement.kind === "academy_all") return true;
      return entitlement.semesterId === semesterId;
    });
    invariant(allowed, "recipe is not covered by an explicit academy-semester entitlement");
    return true;
  }

  function assertEntitled(entitlementsInput, recipeInput) {
    const recipe = normalizeUserExamRecipe(recipeInput);
    return assertTargetEntitled(
      entitlementsInput,
      recipe.generationMode,
      recipe.selectionSnapshot.academyId,
      recipe.selectionSnapshot.semesterId
    );
  }

  function isExpired(recipeInput, at) {
    const recipe = normalizeUserExamRecipe(recipeInput);
    if (recipe.state !== "temporary") return false;
    const now = at == null ? Date.now() : new Date(at).getTime();
    invariant(Number.isFinite(now), "expiry check time is invalid");
    return Date.parse(recipe.expiresAt) <= now;
  }

  function temporaryExpiresAt(planInput, createdAt) {
    const plan = createLibraryPlan(planInput);
    const start = iso(createdAt, "createdAt");
    return new Date(Date.parse(start) + plan.temporaryRetentionDays * 24 * 60 * 60 * 1000).toISOString();
  }

  function assertTemporaryRetention(planInput, recipeInput) {
    const plan = createLibraryPlan(planInput);
    const recipe = normalizeUserExamRecipe(recipeInput);
    if (recipe.state === "temporary") {
      invariant(recipe.expiresAt === temporaryExpiresAt(plan, recipe.createdAt), "temporary recipe expiry does not match the plan retention period");
    }
    return true;
  }

  function recentTemporaryExams(exams, planInput, at) {
    invariant(Array.isArray(exams), "exams must be an array");
    const plan = createLibraryPlan(planInput);
    return Object.freeze(exams.map(normalizeUserExamRecipe).filter(function (recipe) {
      return recipe.state === "temporary" && !isExpired(recipe, at);
    }).sort(function (left, right) {
      return right.updatedAt.localeCompare(left.updatedAt) || left.examId.localeCompare(right.examId);
    }).slice(0, plan.maxRecentExamCount));
  }

  function assertSavedCapacity(planInput, exams, candidateExamId) {
    const plan = createLibraryPlan(planInput);
    invariant(Array.isArray(exams), "exams must be an array");
    const candidateId = token(candidateExamId, "candidateExamId");
    const normalized = exams.map(normalizeUserExamRecipe);
    const ids = new Set();
    normalized.forEach(function (recipe) {
      invariant(!ids.has(recipe.examId), "exam library contains duplicate examId values");
      ids.add(recipe.examId);
    });
    const alreadySaved = normalized.some(function (recipe) { return recipe.examId === candidateId && recipe.state === "saved"; });
    const savedCount = normalized.filter(function (recipe) { return recipe.state === "saved"; }).length;
    invariant(alreadySaved || savedCount < plan.maxSavedExamCount, "plan saved exam limit has been reached");
    return Object.freeze({ savedCount, maxSavedExamCount: plan.maxSavedExamCount, remainingAfterSave: alreadySaved ? plan.maxSavedExamCount - savedCount : plan.maxSavedExamCount - savedCount - 1 });
  }

  function saveExam(recipeInput, planInput, entitlementsInput, exams, savedAt) {
    const recipe = normalizeUserExamRecipe(recipeInput);
    assertEntitled(entitlementsInput, recipe);
    assertTemporaryRetention(planInput, recipe);
    assertSavedCapacity(planInput, exams, recipe.examId);
    const timestamp = iso(savedAt, "savedAt");
    invariant(Date.parse(timestamp) >= Date.parse(recipe.updatedAt), "savedAt cannot precede updatedAt");
    invariant(!isExpired(recipe, timestamp), "expired temporary recipe cannot be saved");
    return normalizeUserExamRecipe(Object.assign({}, recipe, { state: "saved", updatedAt: timestamp, expiresAt: null }));
  }

  function stableStringify(value) {
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    if (!value || typeof value !== "object") return JSON.stringify(value);
    return `{${Object.keys(value).sort().map(function (key) { return `${JSON.stringify(key)}:${stableStringify(value[key])}`; }).join(",")}}`;
  }

  function fnv1a32(text) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash >>> 0;
  }

  function deriveSimilarExamMetadata(parentInput, options) {
    const parent = normalizeUserExamRecipe(parentInput);
    const input = options || {};
    assertExactKeys(input, new Set(["derivationIndex", "generationMode"]), "derivation");
    const derivationIndex = positiveInteger(input.derivationIndex, "derivation.derivationIndex", 1000000);
    const generationMode = input.generationMode == null
      ? parent.generationMode
      : enumValue(input.generationMode, GENERATION_MODES, "derivation.generationMode");
    const source = stableStringify({
      parentExamId: parent.examId,
      parentSeed: parent.seed,
      generationMode,
      selectionSnapshot: parent.selectionSnapshot,
      derivationIndex,
      itemVersions: parent.items.map(function (item) { return [item.itemId, item.itemVersionId]; })
    });
    const seed = fnv1a32(source);
    return Object.freeze({
      parentExamId: parent.examId,
      generationMode,
      selectionSnapshot: parent.selectionSnapshot,
      seed,
      derivationIndex,
      derivationKey: `similar-${seed.toString(16).padStart(8, "0")}`
    });
  }

  return Object.freeze({
    GENERATION_MODES,
    LIBRARY_STATES,
    ENTITLEMENT_KINDS,
    SELECTION_CONDITION_KEYS,
    FORBIDDEN_RECIPE_KEYS,
    createLibraryPlan,
    normalizeEntitlements,
    normalizeSelectionSnapshot,
    normalizeSelectionConditions,
    normalizeLayout,
    normalizeUserExamRecipe,
    assertMetadataOnly,
    assertTargetEntitled,
    assertEntitled,
    isExpired,
    temporaryExpiresAt,
    assertTemporaryRetention,
    recentTemporaryExams,
    assertSavedCapacity,
    saveExam,
    deriveSimilarExamMetadata
  });
});
