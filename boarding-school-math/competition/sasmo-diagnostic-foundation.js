(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMODiagnosticFoundation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /*
   * This is deliberately a release and verification contract, not a contest
   * paper store. SASMO prompts, answer values, solutions, and PDFs stay with
   * their organizer or an authorised private assessment service.
   */
  const LAST_VERIFIED = "2026-08-29";
  const LEVEL_IDS = Object.freeze(["G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"]);
  const YEAR_IDS = Object.freeze([2019, 2020]);
  const ANSWER_PROOF_IDS = Object.freeze([
    "official-answer-and-solution",
    "official-answer-only",
    "independent-dual-solve",
    "unverified"
  ]);
  const RELEASE_STATES = Object.freeze(["ready-for-private-intake", "locked"]);

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  function normalizeLevelId(levelId) {
    const value = String(levelId || "").trim().toUpperCase();
    const match = /^G?(10|[2-9])$/.exec(value);
    return match ? "G" + match[1] : null;
  }

  const yearSources = YEAR_IDS.map(function (year) {
    return {
      year,
      provider: "SIMCC Member Development Portal",
      sourcePageUrl: year === 2019
        ? "https://form.simcc.org/2019-sasmo-year-paper/"
        : "https://form.simcc.org/2020-sasmo-past-year-paper/",
      levelIds: LEVEL_IDS,
      sourceDelivery: "external-official-source",
      solutionProof: "official-answer-and-solution",
      releaseState: "ready-for-private-intake",
      note: "The organizer page lists Grade 2 through Grade 10 past-paper material with answer and solution access. GFIELD does not copy or translate the material."
    };
  });

  const workflow = [
    { id: "select-authorized-year", audience: ["student", "teacher"], output: "external source paper or an authorised school copy" },
    { id: "capture-source-locator", audience: ["teacher"], output: "private item-to-page evidence ledger" },
    { id: "verify-answer-proof", audience: ["teacher"], output: "official proof or two independent matching solves" },
    { id: "tag-skill-and-error", audience: ["teacher"], output: "six-axis and error-type item map" },
    { id: "score-and-prescribe", audience: ["student", "teacher"], output: "answer-free student prescription and teacher analysis" }
  ];

  function getYearSource(year) {
    const normalized = Number(year);
    return yearSources.find(function (source) { return source.year === normalized; }) || null;
  }

  function getDiagnosticReadiness(year, levelId) {
    const source = getYearSource(year);
    const normalizedLevel = normalizeLevelId(levelId);
    const available = Boolean(source && normalizedLevel && source.levelIds.includes(normalizedLevel));
    return deepFreeze({
      year: Number(year),
      levelId: normalizedLevel,
      available,
      releaseState: available ? source.releaseState : "locked",
      sourceDelivery: available ? source.sourceDelivery : null,
      solutionProof: available ? source.solutionProof : "unverified",
      reason: available
        ? "Teacher intake may begin only after page-level source and answer-proof evidence are recorded privately."
        : "No verified organizer answer-and-solution route is declared for this year and level. Use an independently authored GFIELD diagnostic instead."
    });
  }

  function validatePrivateItemEvidence(candidate) {
    const item = candidate || {};
    const errors = [];
    if (typeof item.itemId !== "string" || !item.itemId.trim()) errors.push("itemId is required.");
    if (typeof item.sourceLocator !== "string" || !item.sourceLocator.trim()) errors.push("A page-level source locator is required.");
    if (!ANSWER_PROOF_IDS.includes(item.answerProof)) errors.push("answerProof is unsupported.");
    if (item.answerProof === "unverified") errors.push("An unverified answer cannot be scored or released.");
    if (item.answerProof === "independent-dual-solve") {
      if (!Array.isArray(item.independentSolverIds) || item.independentSolverIds.length !== 2 || new Set(item.independentSolverIds).size !== 2) {
        errors.push("Independent answer proof requires two distinct solver records.");
      }
      if (item.solversAgree !== true) errors.push("Independent solver records must agree before release.");
    }
    return deepFreeze({ valid: errors.length === 0, errors, releaseState: errors.length ? "locked" : "ready-for-private-intake" });
  }

  function validateFoundation(candidate) {
    const data = candidate || { yearSources, workflow };
    const errors = [];
    if (!Array.isArray(data.yearSources) || data.yearSources.length !== YEAR_IDS.length) errors.push("Every verified year source must be declared.");
    if (!Array.isArray(data.workflow) || data.workflow.map(function (step) { return step.id; }).join(",") !== workflow.map(function (step) { return step.id; }).join(",")) {
      errors.push("The SASMO diagnostic workflow is incomplete.");
    }
    (data.yearSources || []).forEach(function (source) {
      if (!YEAR_IDS.includes(source.year) || source.sourceDelivery !== "external-official-source" || source.solutionProof !== "official-answer-and-solution") {
        errors.push("Year source must remain an externally hosted official answer-and-solution route.");
      }
      if (!Array.isArray(source.levelIds) || source.levelIds.join(",") !== LEVEL_IDS.join(",")) errors.push("Verified year levels are incomplete.");
    });
    const text = JSON.stringify(data);
    if (/https?:[^"\\s]+\\.pdf(?:["\\s]|$)/i.test(text)) errors.push("Public diagnostic foundation cannot deliver PDF URLs.");
    if (/\\b(questionText|questionContent|officialProblem|answerKey|workedSolution|answerValue|solutionText)\\b/i.test(text)) errors.push("Public diagnostic foundation cannot contain contest content or answers.");
    return deepFreeze({ valid: errors.length === 0, errors });
  }

  const foundation = { schemaVersion: "1.0.0", programId: "sasmo-year-paper-diagnostic-foundation", lastVerified: LAST_VERIFIED, yearSources, workflow };
  const api = {
    schemaVersion: "1.0.0",
    lastVerified: LAST_VERIFIED,
    LEVEL_IDS,
    YEAR_IDS,
    ANSWER_PROOF_IDS,
    RELEASE_STATES,
    foundation,
    normalizeLevelId,
    getYearSource,
    getDiagnosticReadiness,
    validatePrivateItemEvidence,
    validateFoundation
  };

  if (!validateFoundation(foundation).valid) throw new Error("SASMO diagnostic foundation is not safe.");
  return deepFreeze(api);
});
