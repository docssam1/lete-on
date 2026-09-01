/* Geometry question-bank identity core.
 *
 * A question, its difficulty placement, and its source are different records.
 * Keeping them separate lets one reviewed question appear at both Kinder-high
 * and Kids-low without copying the question or changing its stable ID.
 */
(function (root, factory) {
  "use strict";
  const api = factory();
  root.GFIELD_GEOMETRY_QUESTION_BANK = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const ID_SCOPE = "geo";
  const ENTITY_PREFIXES = Object.freeze({
    question: "qst",
    family: "fam",
    type: "typ",
    placement: "plc",
    source: "src"
  });
  const ID_PATTERN = /^(qst|fam|typ|plc|src)-geo-([0-9a-f]{16})$/;
  const STAGE_PATTERN = /^L[0-8]$/;
  const DIFFICULTIES = Object.freeze([1, 2, 3]);

  // Labels and teacher-facing copy may be edited or translated without making
  // a mathematically new question.
  const DISPLAY_ONLY_KEYS = new Set([
    "prompt",
    "promptKey",
    "answerText",
    "methodHint",
    "givenLabel",
    "hiddenLabel",
    "patternName",
    "group",
    "identity",
    "level",
    "intensity"
  ]);

  // These fields change the amount of help or the requested sub-step while
  // retaining the same underlying mathematical structure. They distinguish a
  // question item, but not its family.
  const FAMILY_SCAFFOLD_KEYS = new Set([
    "dottedEmpty",
    "drawViews",
    "numberGrid",
    "showSolveTable",
    "askFloor",
    "askHeight",
    "askTotal",
    "askUpper"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function digest32(value, seed) {
    let hash = seed >>> 0;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  function digest64(value) {
    const text = String(value);
    return digest32(text, 0x811c9dc5) + digest32(text, 0x9e3779b9);
  }

  function normalizeString(value) {
    return String(value).normalize("NFKC");
  }

  function normalizeValue(value, options) {
    const opts = options || {};
    if (value === null) return null;
    if (typeof value === "string") return normalizeString(value);
    if (typeof value === "boolean") return value;
    if (typeof value === "number") {
      invariant(Number.isFinite(value), "question identity cannot contain a non-finite number");
      return Object.is(value, -0) ? 0 : value;
    }
    if (Array.isArray(value)) {
      return value.map(function (entry) {
        return entry === undefined ? null : normalizeValue(entry, opts);
      });
    }
    invariant(value && typeof value === "object", "question identity accepts JSON-compatible values only");
    const result = {};
    Object.keys(value).sort().forEach(function (key) {
      const child = value[key];
      if (child === undefined || typeof child === "function") return;
      if (DISPLAY_ONLY_KEYS.has(key)) return;
      if (opts.family && FAMILY_SCAFFOLD_KEYS.has(key)) return;
      result[key] = normalizeValue(child, opts);
    });
    return result;
  }

  function stableSerialize(value, options) {
    return JSON.stringify(normalizeValue(value, options));
  }

  function createId(entity, stableKey) {
    const prefix = ENTITY_PREFIXES[entity];
    invariant(prefix, "unknown geometry question-bank entity");
    const key = String(stableKey == null ? "" : stableKey);
    invariant(key.length > 0, "stableKey is required");
    return prefix + "-" + ID_SCOPE + "-" + digest64("geometry:" + entity + ":" + key);
  }

  function parseId(value) {
    const match = String(value == null ? "" : value).match(ID_PATTERN);
    if (!match) return null;
    const entity = Object.keys(ENTITY_PREFIXES).find(function (key) {
      return ENTITY_PREFIXES[key] === match[1];
    });
    return Object.freeze({ entity, scope: ID_SCOPE, digest: match[2] });
  }

  function isId(value, entity) {
    const parsed = parseId(value);
    return Boolean(parsed && (!entity || parsed.entity === entity));
  }

  function normalizeStage(value) {
    const stage = String(value == null ? "" : value).trim().toUpperCase();
    invariant(STAGE_PATTERN.test(stage), "placement stage must be L0 through L8");
    return stage;
  }

  function normalizeDifficulty(value) {
    const difficulty = Number(value);
    invariant(DIFFICULTIES.includes(difficulty), "placement difficulty must be 1, 2, or 3");
    return difficulty;
  }

  function questionPayload(problem, family) {
    invariant(problem && typeof problem === "object", "problem is required");
    const type = normalizeString(problem.type || "").trim().toUpperCase();
    invariant(type.length > 0, "problem.type is required");
    invariant(problem.figures && typeof problem.figures === "object", "problem.figures are required");
    invariant(problem.answer && typeof problem.answer === "object", "problem.answer is required");
    if (family && problem.familyKey != null) {
      return normalizeValue({
        schema: "geometry-question-family-v" + SCHEMA_VERSION,
        type,
        familyKey: problem.familyKey
      }, { family: true });
    }
    return normalizeValue({
      schema: "geometry-question-v" + SCHEMA_VERSION,
      type,
      figures: problem.figures,
      answer: problem.answer,
      familyKey: null
    }, { family: Boolean(family) });
  }

  function createPlacement(questionId, stage, difficulty) {
    invariant(isId(questionId, "question"), "placement questionId is invalid");
    const normalizedStage = normalizeStage(stage);
    const normalizedDifficulty = normalizeDifficulty(difficulty);
    const stableKey = stableSerialize({ questionId, stage: normalizedStage, difficulty: normalizedDifficulty });
    return Object.freeze({
      id: createId("placement", stableKey),
      stage: normalizedStage,
      difficulty: normalizedDifficulty
    });
  }

  function createQuestionIdentity(problem, placement) {
    const itemKey = stableSerialize(questionPayload(problem, false));
    const familyKey = stableSerialize(questionPayload(problem, true));
    const typeCode = normalizeString(problem.type).trim().toUpperCase();
    const questionId = createId("question", itemKey);
    const familyId = createId("family", familyKey);
    const typeId = createId("type", "worksheet:" + typeCode);
    const stage = placement && placement.stage != null ? placement.stage : problem.level;
    const difficulty = placement && placement.difficulty != null ? placement.difficulty : problem.intensity;
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      questionId,
      familyId,
      typeId,
      contentFingerprint: "geo64:" + digest64(itemKey),
      placement: createPlacement(questionId, stage, difficulty)
    });
  }

  function createPlacementIndex(questionId, placements) {
    invariant(Array.isArray(placements) && placements.length > 0, "at least one placement is required");
    const seen = new Set();
    return Object.freeze(placements.map(function (entry) {
      const placement = createPlacement(questionId, entry.stage, entry.difficulty);
      invariant(!seen.has(placement.id), "duplicate question placement");
      seen.add(placement.id);
      return placement;
    }).sort(function (left, right) {
      return left.stage.localeCompare(right.stage) || left.difficulty - right.difficulty;
    }));
  }

  return Object.freeze({
    SCHEMA_VERSION,
    ID_SCOPE,
    ENTITY_PREFIXES,
    DIFFICULTIES,
    DISPLAY_ONLY_KEYS,
    FAMILY_SCAFFOLD_KEYS,
    digest64,
    normalizeValue,
    stableSerialize,
    createId,
    parseId,
    isId,
    normalizeStage,
    normalizeDifficulty,
    questionPayload,
    createPlacement,
    createPlacementIndex,
    createQuestionIdentity
  });
});
