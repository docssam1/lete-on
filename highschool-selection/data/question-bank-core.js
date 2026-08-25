(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_QUESTION_BANK_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const PROGRAM_MODES = Object.freeze(["SH", "DP", "WM", "ED", "DG", "SM"]);
  const SHARED_BANK_SCOPE = "BNK";
  const WRITER = "T";
  const ENTITY_PREFIXES = Object.freeze({
    exam: "exm",
    question: "qst",
    variant: "var",
    figure: "fig",
    policy: "pol",
    source: "src",
    type: "typ",
    lineage: "lin",
    approval: "apr",
    learner: "lrn",
    attempt: "atm",
    practiceSet: "pst",
    examDraft: "drf",
    placement: "plc"
  });
  const CURRICULUM_LEVELS = Object.freeze(["grade", "major", "minor", "detail"]);
  const SOURCE_ROLES = Object.freeze(["actual", "recommended", "textbook", "internal-variant"]);
  const SOURCE_STATUSES = Object.freeze(["missing", "found", "audited", "cleared", "rejected"]);
  const PROVENANCE_STATUSES = SOURCE_STATUSES;
  const ANSWER_VERIFICATION_STATUSES = Object.freeze(["missing", "found", "pending", "verified", "disputed", "rejected"]);
  const INPUT_TYPES = Object.freeze([
    "input",
    "multi_input",
    "single_choice",
    "multi_choice",
    "ox",
    "ordered_list",
    "unordered_set",
    "figure_select",
    "construction"
  ]);
  const GENERATION_KINDS = Object.freeze(["parameterized", "bespoke", "figure_only"]);
  const DIFFICULTY_BANDS = Object.freeze(["lowered", "standard", "raised"]);
  const REVIEW_STATUSES = Object.freeze(["draft", "audit_pending", "approved", "excluded"]);
  const NEUTRAL_ID_PATTERN = /^(exm|qst|var|fig|pol|src|typ|lin|apr|lrn|atm|pst|drf|plc)-(sh|dp|wm|ed|dg|sm)-([0-9a-f]{16})$/;
  const SHARED_ID_PATTERN = /^(qst|var|fig|src|typ|lin)-bnk-([0-9a-f]{16})$/;
  const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{0,31}$/;
  const OPAQUE_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;

  const STATUS_TRANSITIONS = Object.freeze({
    provenance: Object.freeze({
      missing: Object.freeze(["found"]),
      found: Object.freeze(["audited", "rejected"]),
      audited: Object.freeze(["cleared", "found", "rejected"]),
      cleared: Object.freeze(["audited", "rejected"]),
      rejected: Object.freeze(["found"])
    }),
    answerVerification: Object.freeze({
      missing: Object.freeze(["found"]),
      found: Object.freeze(["pending", "rejected"]),
      pending: Object.freeze(["verified", "disputed", "rejected"]),
      verified: Object.freeze(["pending", "disputed", "rejected"]),
      disputed: Object.freeze(["pending", "rejected"]),
      rejected: Object.freeze(["pending"])
    })
  });

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function enumValue(value, allowed, field) {
    invariant(allowed.includes(value), `${field} is not allowed`);
    return value;
  }

  function normalizeMode(value) {
    const mode = String(value == null ? "" : value).toUpperCase();
    return enumValue(mode, PROGRAM_MODES, "mode");
  }

  function normalizeCode(value, field) {
    const code = String(value == null ? "" : value).trim().toUpperCase();
    invariant(CODE_PATTERN.test(code), `${field} must be a neutral curriculum code`);
    return code;
  }

  function digest32(value, seed) {
    let hash = seed >>> 0;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  function createNeutralId(entity, mode, stableKey) {
    const prefix = ENTITY_PREFIXES[entity];
    invariant(prefix, "entity is not allowed");
    const normalizedMode = normalizeMode(mode);
    const key = String(stableKey == null ? "" : stableKey);
    invariant(OPAQUE_KEY_PATTERN.test(key), "stableKey must be an opaque registry key without spaces or paths");
    const canonical = `${entity}:${normalizedMode}:${key}`;
    const digest = digest32(canonical, 0x811c9dc5) + digest32(canonical, 0x9e3779b9);
    return `${prefix}-${normalizedMode.toLowerCase()}-${digest}`;
  }

  function createSharedBankId(entity, stableKey) {
    const prefix = ENTITY_PREFIXES[entity];
    invariant(["question", "variant", "figure", "source", "type", "lineage"].includes(entity), "shared bank entity is not allowed");
    const key = String(stableKey == null ? "" : stableKey);
    invariant(OPAQUE_KEY_PATTERN.test(key), "stableKey must be an opaque registry key without spaces or paths");
    const canonical = `shared:${entity}:${key}`;
    const digest = digest32(canonical, 0x811c9dc5) + digest32(canonical, 0x9e3779b9);
    return `${prefix}-${SHARED_BANK_SCOPE.toLowerCase()}-${digest}`;
  }

  function parseSharedBankId(value) {
    const match = String(value == null ? "" : value).match(SHARED_ID_PATTERN);
    if (!match) return null;
    const entity = Object.keys(ENTITY_PREFIXES).find(function (key) {
      return ENTITY_PREFIXES[key] === match[1];
    });
    return Object.freeze({ entity, scope: SHARED_BANK_SCOPE, digest: match[2] });
  }

  function isSharedBankId(value, entity) {
    const parsed = parseSharedBankId(value);
    if (!parsed) return false;
    return !entity || parsed.entity === entity;
  }

  function parseNeutralId(value) {
    const match = String(value == null ? "" : value).match(NEUTRAL_ID_PATTERN);
    if (!match) return null;
    const entity = Object.keys(ENTITY_PREFIXES).find(function (key) {
      return ENTITY_PREFIXES[key] === match[1];
    });
    return Object.freeze({ entity, mode: match[2].toUpperCase(), digest: match[3] });
  }

  function isNeutralId(value, entity, mode) {
    const parsed = parseNeutralId(value);
    if (!parsed) return false;
    if (entity && parsed.entity !== entity) return false;
    if (mode && parsed.mode !== String(mode).toUpperCase()) return false;
    return true;
  }

  function createCurriculumPath(input) {
    invariant(input && typeof input === "object", "curriculum path is required");
    const result = {};
    CURRICULUM_LEVELS.forEach(function (level) {
      const node = input[level];
      const rawCode = node && typeof node === "object" ? node.code : node;
      result[level] = Object.freeze({ code: normalizeCode(rawCode, level) });
    });
    result.key = CURRICULUM_LEVELS.map(function (level) { return result[level].code; }).join("/");
    return Object.freeze(result);
  }

  function freezeHierarchyNode(node, childKey) {
    const result = { code: node.code };
    if (childKey) result[childKey] = Object.freeze(node[childKey].map(function (child) { return Object.freeze(child); }));
    return Object.freeze(result);
  }

  function createCurriculumHierarchy(paths) {
    invariant(Array.isArray(paths) && paths.length > 0, "curriculum paths are required");
    const tree = new Map();
    const seen = new Set();
    paths.map(createCurriculumPath).sort(function (a, b) { return a.key.localeCompare(b.key); }).forEach(function (path) {
      invariant(!seen.has(path.key), "duplicate curriculum detail path");
      seen.add(path.key);
      if (!tree.has(path.grade.code)) tree.set(path.grade.code, new Map());
      const majors = tree.get(path.grade.code);
      if (!majors.has(path.major.code)) majors.set(path.major.code, new Map());
      const minors = majors.get(path.major.code);
      if (!minors.has(path.minor.code)) minors.set(path.minor.code, new Set());
      minors.get(path.minor.code).add(path.detail.code);
    });
    const grades = Array.from(tree.keys()).sort().map(function (gradeCode) {
      const majorsMap = tree.get(gradeCode);
      const majors = Array.from(majorsMap.keys()).sort().map(function (majorCode) {
        const minorsMap = majorsMap.get(majorCode);
        const minors = Array.from(minorsMap.keys()).sort().map(function (minorCode) {
          const details = Array.from(minorsMap.get(minorCode)).sort().map(function (detailCode) {
            return freezeHierarchyNode({ code: detailCode });
          });
          return freezeHierarchyNode({ code: minorCode, details }, "details");
        });
        return freezeHierarchyNode({ code: majorCode, minors }, "minors");
      });
      return freezeHierarchyNode({ code: gradeCode, majors }, "majors");
    });
    return Object.freeze({ levels: CURRICULUM_LEVELS, grades: Object.freeze(grades) });
  }

  function validateCurriculumPath(path) {
    const issues = [];
    let seenMissing = false;
    CURRICULUM_LEVELS.forEach(function (level) {
      const code = path && path[level] && typeof path[level] === "object" ? path[level].code : path && path[level];
      if (code == null || code === "") {
        seenMissing = true;
        issues.push(`curriculum.${level}.missing`);
      } else if (seenMissing) {
        issues.push(`curriculum.${level}.orphaned`);
      } else if (!CODE_PATTERN.test(String(code))) {
        issues.push(`curriculum.${level}.invalid_code`);
      }
    });
    if (path && typeof path.key === "string" && issues.length === 0) {
      const expected = CURRICULUM_LEVELS.map(function (level) { return path[level].code; }).join("/");
      if (path.key !== expected) issues.push("curriculum.key.mismatch");
    }
    return Object.freeze(issues);
  }

  function createProvenanceRecord(input) {
    invariant(input && typeof input === "object", "provenance is required");
    const mode = normalizeMode(input.mode);
    const status = enumValue(input.status, PROVENANCE_STATUSES, "provenance.status");
    const role = enumValue(input.role, SOURCE_ROLES, "provenance.role");
    const referenceId = input.referenceId == null ? null : String(input.referenceId);
    if (status !== "missing") {
      invariant(isNeutralId(referenceId, "source", mode), "provenance.referenceId must be a neutral source id");
    } else {
      invariant(referenceId === null, "missing provenance cannot have a source reference");
    }
    return Object.freeze({ role, status, referenceId });
  }

  function createAnswerVerification(input) {
    invariant(input && typeof input === "object", "answer verification is required");
    const status = enumValue(input.status, ANSWER_VERIFICATION_STATUSES, "answerVerification.status");
    const reviewCount = Number(input.reviewCount == null ? 0 : input.reviewCount);
    invariant(Number.isSafeInteger(reviewCount) && reviewCount >= 0, "answerVerification.reviewCount must be a non-negative integer");
    invariant(status !== "verified" || reviewCount >= 1, "verified answers require at least one review");
    return Object.freeze({ status, reviewCount });
  }

  function createVariantRecord(input) {
    invariant(input && typeof input === "object", "variant is required");
    const mode = normalizeMode(input.mode);
    const band = enumValue(input.band, DIFFICULTY_BANDS, "variant.band");
    invariant(isNeutralId(input.familyId, "question", mode), "variant.familyId must be a neutral question id");
    return Object.freeze({ familyId: input.familyId, band });
  }

  function createVariantSet(input) {
    invariant(input && typeof input === "object", "variant set is required");
    const mode = normalizeMode(input.mode);
    invariant(isNeutralId(input.familyId, "question", mode), "variantSet.familyId must be a neutral question id");
    const ids = DIFFICULTY_BANDS.map(function (band) {
      invariant(isNeutralId(input[band], "question", mode), `variantSet.${band} must be a neutral question id`);
      return input[band];
    });
    invariant(new Set(ids).size === DIFFICULTY_BANDS.length, "variant question ids must be unique");
    return Object.freeze({
      familyId: input.familyId,
      lowered: Object.freeze({ id: input.lowered, band: "lowered" }),
      standard: Object.freeze({ id: input.standard, band: "standard" }),
      raised: Object.freeze({ id: input.raised, band: "raised" })
    });
  }

  function canTransition(kind, from, to) {
    const graph = STATUS_TRANSITIONS[kind];
    if (!graph || !graph[from]) return false;
    return from === to || graph[from].includes(to);
  }

  return Object.freeze({
    PROGRAM_MODES,
    SHARED_BANK_SCOPE,
    WRITER,
    ENTITY_PREFIXES,
    CURRICULUM_LEVELS,
    SOURCE_ROLES,
    SOURCE_STATUSES,
    PROVENANCE_STATUSES,
    ANSWER_VERIFICATION_STATUSES,
    INPUT_TYPES,
    GENERATION_KINDS,
    DIFFICULTY_BANDS,
    REVIEW_STATUSES,
    STATUS_TRANSITIONS,
    createNeutralId,
    createSharedBankId,
    parseNeutralId,
    parseSharedBankId,
    isNeutralId,
    isSharedBankId,
    createCurriculumPath,
    createCurriculumHierarchy,
    validateCurriculumPath,
    createProvenanceRecord,
    createAnswerVerification,
    createVariantRecord,
    createVariantSet,
    canTransition
  });
});
