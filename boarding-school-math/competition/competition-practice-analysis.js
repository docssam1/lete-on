(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDCompetitionPracticeAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function freeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { freeze(value[key]); });
    return Object.freeze(value);
  }

  function recordFor(attempts, itemId) {
    if (attempts instanceof Map) return attempts.get(itemId) || null;
    return attempts && typeof attempts === "object" ? attempts[itemId] || null : null;
  }

  function normalizedResponses(record) {
    if (!record || !Array.isArray(record.responses)) return [];
    return record.responses.map(function (response) {
      return typeof response === "boolean" ? { correct: response } : { correct: response && response.correct === true };
    });
  }

  function summarize(items, attempts) {
    if (!Array.isArray(items) || !items.length) throw new Error("COMPETITION_ANALYSIS_ITEMS_REQUIRED");
    const itemEvidence = [];
    let attempted = 0;
    let firstCorrect = 0;
    let solved = 0;

    items.forEach(function (item, index) {
      const record = recordFor(attempts, item.id);
      const responses = normalizedResponses(record);
      const wasAttempted = responses.length > 0;
      const wasFirstCorrect = wasAttempted && responses[0].correct;
      const wasSolved = wasAttempted && (Boolean(record && record.solved === true) || responses.some(function (response) { return response.correct; }));
      if (wasAttempted) {
        attempted += 1;
      }
      if (wasFirstCorrect) {
        firstCorrect += 1;
      }
      if (wasSolved) {
        solved += 1;
      }
      itemEvidence.push({
        itemId: item.id,
        questionNumber: index + 1,
        attempted: wasAttempted,
        firstCorrect: wasAttempted ? wasFirstCorrect : null,
        solved: wasSolved,
        attemptCount: responses.length
      });
    });

    return freeze({
      schemaVersion: "1.0.0",
      evidenceKind: "public-practice-preview",
      formalDiagnostic: false,
      officialPrediction: false,
      itemCount: items.length,
      attempted: attempted,
      solved: solved,
      firstCorrect: firstCorrect,
      complete: attempted === items.length,
      itemEvidence: itemEvidence
    });
  }

  return freeze({ summarize: summarize });
});
