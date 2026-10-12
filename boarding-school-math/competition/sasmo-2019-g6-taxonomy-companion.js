(function (factory) {
  // Review-only CommonJS artifact. Do not expose a browser global until the
  // release locks are approved and the runtime migration is designed.
  if (typeof module === "object" && module.exports) {
    module.exports = factory(function (value) {
      return require("node:crypto").createHash("sha256").update(value, "utf8").digest("hex");
    });
  }
})(function (hashText) {
  "use strict";

  /*
   * Answer-free review companion for one immutable scoring form.
   *
   * The syllabus strands below are GFIELD mappings to the broad SASMO
   * Primary 5-6 syllabus, not organizer-assigned item classifications. This
   * companion is deliberately not loaded by the scoring or planning pages.
   */
  const SCHEMA_VERSION = "gfield-sasmo-taxonomy-v4";
  const FORM_ID = "sasmo-2019-g6-baseline-a";
  const SOURCE_FINGERPRINT_SHA256 = "a2e7191c21d29fdfb5b9f8a0d08018df6d7c1b318d0e05207dcc522696074d6b";
  const TAXONOMY_VERSION = "sasmo-2019-g6-review-draft-20261009-3";
  const TAXONOMY_FINGERPRINT_SHA256 = "b82b0f966ac7f8cf2f4355680760b2c95504bb4bd2f0cd6b3c2de023a127fdd6";
  const SYLLABUS_ID = "sasmo-primary-5-6-current-20261007";

  const OFFICIAL_SYLLABUS_STRANDS = Object.freeze([
    "arithmetic-statistics",
    "geometry-mensuration",
    "word-problems",
    "non-routine-problem-solving"
  ]);
  const GFIELD_CONTENT_AXES = Object.freeze([
    "number-operations",
    "patterns-algebra",
    "geometry-spatial",
    "combinatorics-logic",
    "data-probability"
  ]);
  const REASONING_METHODS = Object.freeze([
    "direct-calculation",
    "model-representation",
    "algebraic-equations",
    "working-backwards",
    "systematic-enumeration",
    "case-analysis",
    "inclusion-exclusion",
    "modular-reasoning",
    "pattern-generalization",
    "geometric-decomposition",
    "constraint-reasoning",
    "relative-rate",
    "extremal-reasoning"
  ]);
  const CLASSIFICATION_STATES = Object.freeze(["pending", "reviewed"]);
  const DIAGNOSTIC_STATES = Object.freeze(["eligible", "score-only", "review-required"]);
  const REASON_CODES = Object.freeze([
    "nonunique-rule",
    "source-verification-pending",
    "answer-verification-pending",
    "language-determinacy-review",
    "whole-number-zero-scope-review",
    "classification-policy-review"
  ]);

  function item(questionNumber, officialSyllabusStrands, gfieldContentAxis, reasoningMethods, classificationState, diagnosticState, reasonCodes) {
    return {
      questionNumber,
      officialSyllabusStrands,
      gfieldContentAxis,
      reasoningMethods,
      classificationState: classificationState || "reviewed",
      diagnosticEligibility: {
        state: diagnosticState || "eligible",
        reasonCodes: reasonCodes || []
      }
    };
  }

  const ITEMS = [
    item(1, ["arithmetic-statistics"], "number-operations", ["direct-calculation"]),
    item(2, ["arithmetic-statistics", "word-problems", "non-routine-problem-solving"], "combinatorics-logic", ["inclusion-exclusion", "model-representation"]),
    item(3, ["geometry-mensuration", "non-routine-problem-solving"], "geometry-spatial", ["constraint-reasoning", "direct-calculation"]),
    item(4, ["word-problems", "non-routine-problem-solving"], "combinatorics-logic", ["systematic-enumeration", "constraint-reasoning"]),
    item(5, ["arithmetic-statistics", "word-problems"], "number-operations", ["working-backwards", "direct-calculation"]),
    item(6, ["geometry-mensuration", "non-routine-problem-solving"], "geometry-spatial", ["geometric-decomposition", "constraint-reasoning", "direct-calculation"]),
    item(7, ["arithmetic-statistics", "word-problems"], "number-operations", ["model-representation", "working-backwards", "direct-calculation"]),
    item(8, ["arithmetic-statistics", "non-routine-problem-solving"], "number-operations", ["modular-reasoning", "constraint-reasoning"]),
    item(9, ["arithmetic-statistics"], "data-probability", ["systematic-enumeration", "direct-calculation"], "reviewed", "review-required", ["language-determinacy-review"]),
    item(10, ["arithmetic-statistics", "word-problems"], "number-operations", ["relative-rate", "direct-calculation"]),
    item(11, ["arithmetic-statistics", "non-routine-problem-solving"], "number-operations", ["modular-reasoning", "working-backwards"]),
    item(12, ["geometry-mensuration", "word-problems", "non-routine-problem-solving"], "geometry-spatial", ["relative-rate", "model-representation", "algebraic-equations"]),
    item(13, ["non-routine-problem-solving"], "combinatorics-logic", ["case-analysis", "constraint-reasoning"]),
    item(14, ["arithmetic-statistics", "non-routine-problem-solving"], "number-operations", ["direct-calculation", "constraint-reasoning", "extremal-reasoning"]),
    item(15, ["non-routine-problem-solving"], "patterns-algebra", ["pattern-generalization", "case-analysis"], "pending", "review-required", ["nonunique-rule"]),
    item(16, ["geometry-mensuration", "non-routine-problem-solving"], "geometry-spatial", ["systematic-enumeration", "case-analysis", "geometric-decomposition"]),
    item(17, ["arithmetic-statistics", "non-routine-problem-solving"], "number-operations", ["direct-calculation", "pattern-generalization"]),
    item(18, ["arithmetic-statistics", "word-problems"], "data-probability", ["model-representation", "direct-calculation"]),
    item(19, ["non-routine-problem-solving"], "patterns-algebra", ["pattern-generalization", "model-representation"], "reviewed", "score-only", ["nonunique-rule"]),
    item(20, ["arithmetic-statistics", "word-problems"], "number-operations", ["model-representation", "working-backwards", "direct-calculation"]),
    item(21, ["arithmetic-statistics", "non-routine-problem-solving"], "combinatorics-logic", ["constraint-reasoning", "case-analysis", "extremal-reasoning"], "reviewed", "review-required", ["whole-number-zero-scope-review"]),
    item(22, ["arithmetic-statistics", "geometry-mensuration", "word-problems", "non-routine-problem-solving"], "number-operations", ["model-representation", "direct-calculation", "modular-reasoning"]),
    item(23, ["geometry-mensuration", "non-routine-problem-solving"], "geometry-spatial", ["geometric-decomposition", "constraint-reasoning", "direct-calculation"]),
    item(24, ["arithmetic-statistics", "non-routine-problem-solving"], "combinatorics-logic", ["case-analysis", "constraint-reasoning"]),
    item(25, ["arithmetic-statistics", "non-routine-problem-solving"], "combinatorics-logic", ["systematic-enumeration", "case-analysis", "direct-calculation"])
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  function record(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
  function onlyKeys(value, allowed, label) {
    if (!record(value) || Object.keys(value).some(function (key) { return !allowed.includes(key); })) throw new Error(`${label} has unsupported fields`);
  }
  function dense(value, expected, label) {
    if (!Array.isArray(value) || value.length !== expected) throw new Error(`${label} must contain ${expected} records`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) throw new Error(`${label} must be dense`);
    }
    return value;
  }
  function uniqueAllowed(value, allowed, label, allowEmpty) {
    if (!Array.isArray(value) || (!allowEmpty && !value.length)) throw new Error(`${label} is invalid`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index) || typeof value[index] !== "string" || !allowed.includes(value[index])) throw new Error(`${label} is invalid`);
    }
    if (new Set(value).size !== value.length) {
      throw new Error(`${label} is invalid`);
    }
  }
  function canonicalJson(value) {
    if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
    if (value && typeof value === "object") return `{${Object.keys(value).sort().map(function (key) { return `${JSON.stringify(key)}:${canonicalJson(value[key])}`; }).join(",")}}`;
    return JSON.stringify(value);
  }
  function fingerprintPayload(value) {
    return Object.fromEntries(Object.entries(value).filter(function (entry) { return entry[0] !== "taxonomyFingerprintSha256"; }));
  }

  function validateCompanion(value) {
    onlyKeys(value, ["schemaVersion", "formId", "sourceFingerprintSha256", "taxonomyVersion", "taxonomyFingerprintSha256", "syllabusId", "releaseLocks", "items"], "companion");
    if (value.schemaVersion !== SCHEMA_VERSION || value.formId !== FORM_ID || value.sourceFingerprintSha256 !== SOURCE_FINGERPRINT_SHA256 || value.taxonomyVersion !== TAXONOMY_VERSION || value.syllabusId !== SYLLABUS_ID || value.taxonomyFingerprintSha256 !== TAXONOMY_FINGERPRINT_SHA256) throw new Error("companion identity is invalid");
    onlyKeys(value.releaseLocks, ["domainDiagnosis", "automaticPrescription", "sourceLinkedWorkbook"], "releaseLocks");
    if (value.releaseLocks.domainDiagnosis !== true || value.releaseLocks.automaticPrescription !== true || value.releaseLocks.sourceLinkedWorkbook !== true) throw new Error("all release locks must remain closed");
    dense(value.items, 25, "items").forEach(function (entry, index) {
      onlyKeys(entry, ["questionNumber", "officialSyllabusStrands", "gfieldContentAxis", "reasoningMethods", "classificationState", "diagnosticEligibility"], `items[${index}]`);
      if (entry.questionNumber !== index + 1 || !CLASSIFICATION_STATES.includes(entry.classificationState)) throw new Error(`items[${index}] identity is invalid`);
      uniqueAllowed(entry.officialSyllabusStrands, OFFICIAL_SYLLABUS_STRANDS, `items[${index}].officialSyllabusStrands`, true);
      if (entry.gfieldContentAxis !== null && !GFIELD_CONTENT_AXES.includes(entry.gfieldContentAxis)) throw new Error(`items[${index}].gfieldContentAxis is invalid`);
      if (entry.classificationState === "reviewed" && entry.gfieldContentAxis === null) throw new Error(`items[${index}] reviewed axis is missing`);
      uniqueAllowed(entry.reasoningMethods, REASONING_METHODS, `items[${index}].reasoningMethods`, false);
      onlyKeys(entry.diagnosticEligibility, ["state", "reasonCodes"], `items[${index}].diagnosticEligibility`);
      if (!DIAGNOSTIC_STATES.includes(entry.diagnosticEligibility.state)) throw new Error(`items[${index}].diagnosticEligibility.state is invalid`);
      uniqueAllowed(entry.diagnosticEligibility.reasonCodes, REASON_CODES, `items[${index}].diagnosticEligibility.reasonCodes`, true);
      if ((entry.classificationState === "pending" || entry.diagnosticEligibility.state !== "eligible") && !entry.diagnosticEligibility.reasonCodes.length) throw new Error(`items[${index}] review reason is missing`);
      if (entry.diagnosticEligibility.state === "eligible" && entry.diagnosticEligibility.reasonCodes.length) throw new Error(`items[${index}] eligible item has a review reason`);
    });
    const pending = value.items.filter(function (entry) { return entry.classificationState === "pending"; }).map(function (entry) { return entry.questionNumber; });
    const reviewRequired = value.items.filter(function (entry) { return entry.diagnosticEligibility.state === "review-required"; }).map(function (entry) { return entry.questionNumber; });
    const scoreOnly = value.items.filter(function (entry) { return entry.diagnosticEligibility.state === "score-only"; }).map(function (entry) { return entry.questionNumber; });
    if (JSON.stringify(pending) !== "[15]" || JSON.stringify(reviewRequired) !== "[9,15,21]" || JSON.stringify(scoreOnly) !== "[19]") throw new Error("review boundary is invalid");
    const serialized = JSON.stringify(value);
    if (/answerValue|privateScoring|sourceLocator|publishedSolutionLocator|sourcePageUrl|studentResponse|correctOption/i.test(serialized)) throw new Error("answer-free companion boundary failed");
    if (typeof hashText !== "function" || hashText(canonicalJson(fingerprintPayload(value))) !== TAXONOMY_FINGERPRINT_SHA256) throw new Error("taxonomy fingerprint mismatch");
    return true;
  }

  const COMPANION = deepFreeze({
    schemaVersion: SCHEMA_VERSION,
    formId: FORM_ID,
    sourceFingerprintSha256: SOURCE_FINGERPRINT_SHA256,
    taxonomyVersion: TAXONOMY_VERSION,
    taxonomyFingerprintSha256: TAXONOMY_FINGERPRINT_SHA256,
    syllabusId: SYLLABUS_ID,
    releaseLocks: {
      domainDiagnosis: true,
      automaticPrescription: true,
      sourceLinkedWorkbook: true
    },
    items: ITEMS
  });

  validateCompanion(COMPANION);
  return Object.freeze({
    SCHEMA_VERSION,
    FORM_ID,
    SOURCE_FINGERPRINT_SHA256,
    TAXONOMY_VERSION,
    TAXONOMY_FINGERPRINT_SHA256,
    SYLLABUS_ID,
    OFFICIAL_SYLLABUS_STRANDS,
    GFIELD_CONTENT_AXES,
    REASONING_METHODS,
    CLASSIFICATION_STATES,
    DIAGNOSTIC_STATES,
    REASON_CODES,
    COMPANION,
    validateCompanion
  });
});
