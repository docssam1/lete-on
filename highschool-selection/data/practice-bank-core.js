(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("./question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const api = factory(core);
  root.HIGHSELECT_PRACTICE_BANK_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core) {
  "use strict";

  if (!core) throw new Error("HIGHSELECT_QUESTION_BANK_CORE is required");

  const MASTERY_STATUSES = Object.freeze([
    "unseen",
    "learning",
    "consolidating",
    "mastered",
    "needs_review"
  ]);
  const ATTEMPT_RESULTS = Object.freeze(["correct", "incorrect"]);
  const RELATION_ORDER = Object.freeze(["original", "twin", "similar"]);
  const PRACTICE_APPROVAL_STATUSES = Object.freeze(["pending", "approved", "rejected", "revoked"]);
  const DEFAULT_SPACING_DAYS = Object.freeze({
    unseen: 0,
    learning: 1,
    consolidating: 3,
    mastered: 14,
    needs_review: 1
  });
  const DEFAULT_DIFFICULTY_BY_MASTERY = Object.freeze({
    unseen: "standard",
    learning: "lowered",
    consolidating: "standard",
    mastered: "raised",
    needs_review: "lowered"
  });
  const FORBIDDEN_CONTENT_KEYS = Object.freeze([
    "questiontext",
    "prompt",
    "stem",
    "answer",
    "answers",
    "answerspec",
    "correctanswer",
    "solution",
    "explanation",
    "url",
    "uri",
    "path",
    "filepath",
    "pdfurl",
    "downloadurl",
    "storageurl",
    "originalurl"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function normalizeMode(value) {
    const mode = String(value == null ? "" : value).toUpperCase();
    invariant(core.PROGRAM_MODES.includes(mode), "practice mode is not allowed");
    return mode;
  }

  function positiveInteger(value, field, fallback, maximum) {
    const number = Number(value == null ? fallback : value);
    invariant(Number.isSafeInteger(number) && number > 0, `${field} must be a positive integer`);
    if (maximum != null) invariant(number <= maximum, `${field} is too large`);
    return number;
  }

  function nonNegativeInteger(value, field, fallback, maximum) {
    const number = Number(value == null ? fallback : value);
    invariant(Number.isSafeInteger(number) && number >= 0, `${field} must be a non-negative integer`);
    if (maximum != null) invariant(number <= maximum, `${field} is too large`);
    return number;
  }

  function normalizeIso(value, field) {
    const parsed = new Date(value);
    invariant(Number.isFinite(parsed.getTime()), `${field} must be a valid ISO timestamp`);
    return parsed.toISOString();
  }

  function createStatusMap(input, defaults, validator, field) {
    const source = input || defaults;
    const result = {};
    MASTERY_STATUSES.forEach(function (status) {
      const value = source[status] == null ? defaults[status] : source[status];
      result[status] = validator(value, `${field}.${status}`);
    });
    return Object.freeze(result);
  }

  function createPracticePolicy(input) {
    invariant(input && typeof input === "object", "practice policy is required");
    const mode = normalizeMode(input.mode);
    invariant(core.isNeutralId(input.id, "policy", mode), "practice policy id must be neutral");
    const setSize = positiveInteger(input.setSize, "practicePolicy.setSize", 10, 40);
    const maxPerFamily = positiveInteger(input.maxPerFamily, "practicePolicy.maxPerFamily", 1, 1);
    const maxPerDetail = positiveInteger(
      input.maxPerDetail,
      "practicePolicy.maxPerDetail",
      Math.min(2, setSize),
      setSize
    );
    const minDistinctDetails = positiveInteger(
      input.minDistinctDetails,
      "practicePolicy.minDistinctDetails",
      Math.min(setSize, 3),
      setSize
    );
    const relationOrder = Object.freeze((input.relationOrder || RELATION_ORDER).map(function (relation) {
      invariant(RELATION_ORDER.includes(relation), "practicePolicy relation is not allowed");
      return relation;
    }));
    invariant(relationOrder.length === RELATION_ORDER.length, "practicePolicy relation order must contain three stages");
    invariant(new Set(relationOrder).size === RELATION_ORDER.length, "practicePolicy relation stages must be unique");
    RELATION_ORDER.forEach(function (relation) {
      invariant(relationOrder.includes(relation), "practicePolicy relation chain is incomplete");
    });
    invariant(input.userApprovalRequired !== false, "practice sets cannot disable user approval");

    const spacingDays = createStatusMap(
      input.spacingDays,
      DEFAULT_SPACING_DAYS,
      function (value, field) { return nonNegativeInteger(value, field, 0, 365); },
      "practicePolicy.spacingDays"
    );
    const difficultyByMastery = createStatusMap(
      input.difficultyByMastery,
      DEFAULT_DIFFICULTY_BY_MASTERY,
      function (value, field) {
        invariant(core.DIFFICULTY_BANDS.includes(value), `${field} is not allowed`);
        return value;
      },
      "practicePolicy.difficultyByMastery"
    );

    return Object.freeze({
      id: input.id,
      mode,
      writer: core.WRITER,
      version: positiveInteger(input.version, "practicePolicy.version", 1),
      setSize,
      maxPerFamily,
      maxPerDetail,
      minDistinctDetails,
      exactRepeatCooldownDays: nonNegativeInteger(
        input.exactRepeatCooldownDays,
        "practicePolicy.exactRepeatCooldownDays",
        7,
        365
      ),
      masteryMinCorrectStreak: positiveInteger(
        input.masteryMinCorrectStreak,
        "practicePolicy.masteryMinCorrectStreak",
        3,
        20
      ),
      masteryMinRelations: positiveInteger(
        input.masteryMinRelations,
        "practicePolicy.masteryMinRelations",
        2,
        RELATION_ORDER.length
      ),
      recoveryCorrectStreak: positiveInteger(
        input.recoveryCorrectStreak,
        "practicePolicy.recoveryCorrectStreak",
        2,
        20
      ),
      relationOrder,
      spacingDays,
      difficultyByMastery,
      userApprovalRequired: true
    });
  }

  function createPracticeAttempt(input) {
    invariant(input && typeof input === "object", "practice attempt is required");
    const mode = normalizeMode(input.mode);
    invariant(core.isNeutralId(input.id, "attempt", mode), "practice attempt id must be neutral");
    invariant(core.isNeutralId(input.learnerId, "learner", mode), "learner id must be neutral");
    invariant(core.isNeutralId(input.practiceSetId, "practiceSet", mode), "practice set id must be neutral");
    invariant(core.isNeutralId(input.practiceSetApprovalId, "approval", mode), "practice set approval id must be neutral");
    invariant(core.isNeutralId(input.questionId, "question", mode), "practice question id must be neutral");
    invariant(core.isNeutralId(input.familyId, "question", mode), "practice family id must be neutral");
    invariant(RELATION_ORDER.includes(input.relation), "practice relation is not allowed");
    invariant(core.DIFFICULTY_BANDS.includes(input.difficultyBand), "practice difficulty is not allowed");
    invariant(ATTEMPT_RESULTS.includes(input.result), "practice result is not allowed");
    return Object.freeze({
      id: input.id,
      mode,
      learnerId: input.learnerId,
      practiceSetId: input.practiceSetId,
      practiceSetApprovalId: input.practiceSetApprovalId,
      questionId: input.questionId,
      familyId: input.familyId,
      relation: input.relation,
      difficultyBand: input.difficultyBand,
      attemptedAt: normalizeIso(input.attemptedAt, "practiceAttempt.attemptedAt"),
      result: input.result,
      recordVersion: positiveInteger(input.recordVersion, "practiceAttempt.recordVersion", 1)
    });
  }

  function createPracticeSetApproval(input) {
    invariant(input && typeof input === "object", "practice set approval is required");
    const mode = normalizeMode(input.mode);
    invariant(core.isNeutralId(input.id, "approval", mode), "practice approval id must be neutral");
    invariant(core.isNeutralId(input.practiceSetId, "practiceSet", mode), "practice approval target must be neutral");
    invariant(PRACTICE_APPROVAL_STATUSES.includes(input.status), "practice approval status is not allowed");
    return Object.freeze({
      id: input.id,
      practiceSetId: input.practiceSetId,
      status: input.status,
      decisionVersion: positiveInteger(input.decisionVersion, "practiceApproval.decisionVersion", 1),
      reviewer: core.WRITER
    });
  }

  function assertPracticeMetadataOnly(value) {
    const seen = new Set();
    function visit(node) {
      if (!node || typeof node !== "object") return;
      invariant(!seen.has(node), "practice metadata cannot contain cycles");
      seen.add(node);
      Object.keys(node).forEach(function (key) {
        invariant(!FORBIDDEN_CONTENT_KEYS.includes(key.toLowerCase()), `practice metadata cannot contain ${key}`);
        visit(node[key]);
      });
      seen.delete(node);
    }
    visit(value);
    return true;
  }

  return Object.freeze({
    MASTERY_STATUSES,
    ATTEMPT_RESULTS,
    RELATION_ORDER,
    PRACTICE_APPROVAL_STATUSES,
    DEFAULT_SPACING_DAYS,
    DEFAULT_DIFFICULTY_BY_MASTERY,
    FORBIDDEN_CONTENT_KEYS,
    createPracticePolicy,
    createPracticeAttempt,
    createPracticeSetApproval,
    assertPracticeMetadataOnly
  });
});
