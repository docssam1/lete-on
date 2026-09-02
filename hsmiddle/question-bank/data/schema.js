(function (root, factory) {
  "use strict";
  const api = factory();
  root.HSMIDDLE_QUESTION_BANK_SCHEMA = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const freeze = Object.freeze;
  const SCHEMA_VERSION = "hsmiddle-question-bank-v1";
  const WORK_STATUSES = freeze(["pending", "in-progress", "complete", "blocked"]);
  const EVIDENCE_STATUSES = freeze(["draft", "verified", "conflict", "stale", "superseded", "excluded"]);
  const RELEASE_STATUSES = freeze(["locked", "eligible", "approved", "published", "revoked"]);
  const RESPONSE_CONTRACTS = freeze([
    "single-value", "multi-input", "ordered", "set", "range", "drawing", "rubric", "provisional"
  ]);
  const VALIDATION_AXES = freeze([
    "source", "officialAnswer", "solution", "independentMath",
    "uniqueness", "visual", "learnerFit", "release"
  ]);
  const PAGE_ROLES = freeze([
    "problem", "quick-answer", "solution", "answer-solution", "blank", "unreviewed"
  ]);

  return freeze({
    SCHEMA_VERSION,
    WORK_STATUSES,
    EVIDENCE_STATUSES,
    RELEASE_STATUSES,
    RESPONSE_CONTRACTS,
    VALIDATION_AXES,
    PAGE_ROLES
  });
});
