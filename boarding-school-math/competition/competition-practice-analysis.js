(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDCompetitionPracticeAnalysis = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const AXES = Object.freeze([
    "number-operations",
    "patterns-algebra",
    "geometry-spatial",
    "combinatorics-logic",
    "data-probability",
    "problem-solving-strategies"
  ]);
  const AXIS_ALIASES = Object.freeze({
    "proportional-reasoning": "number-operations",
    "counting-probability": "data-probability",
    "elementary-geometry": "geometry-spatial",
    "graphs-tables": "data-probability"
  });

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

  function percentage(correct, attempted) {
    return attempted ? Math.round(correct / attempted * 100) : null;
  }

  function readinessBand(attempted, total, accuracy) {
    if (!total || attempted < total) return "collecting";
    if (accuracy >= 90) return "strong";
    if (accuracy >= 70) return "ready-with-review";
    if (accuracy >= 50) return "developing";
    return "foundation";
  }

  function summarize(items, attempts) {
    if (!Array.isArray(items) || !items.length) throw new Error("COMPETITION_ANALYSIS_ITEMS_REQUIRED");
    const domains = AXES.map(function (axis) {
      return { axis: axis, itemCount: 0, attempted: 0, firstCorrect: 0, solved: 0, errorCount: 0, percentage: null, evidenceState: "unmeasured" };
    });
    const domainById = new Map(domains.map(function (domain) { return [domain.axis, domain]; }));
    const sectionById = new Map();
    const itemEvidence = [];
    let attempted = 0;
    let firstCorrect = 0;
    let solved = 0;

    items.forEach(function (item, index) {
      const canonicalAxis = AXIS_ALIASES[item.axis] || item.axis;
      const domain = domainById.get(canonicalAxis);
      if (!domain) throw new Error("COMPETITION_ANALYSIS_AXIS_INVALID:" + item.id);
      domain.itemCount += 1;
      if (!sectionById.has(item.tier)) sectionById.set(item.tier, { tier: item.tier, itemCount: 0, attempted: 0, firstCorrect: 0, solved: 0, percentage: null });
      const section = sectionById.get(item.tier);
      section.itemCount += 1;
      const record = recordFor(attempts, item.id);
      const responses = normalizedResponses(record);
      const wasAttempted = responses.length > 0;
      const wasFirstCorrect = wasAttempted && responses[0].correct;
      const wasSolved = Boolean(record && record.solved === true) || responses.some(function (response) { return response.correct; });
      if (wasAttempted) {
        attempted += 1;
        domain.attempted += 1;
        section.attempted += 1;
      }
      if (wasFirstCorrect) {
        firstCorrect += 1;
        domain.firstCorrect += 1;
        section.firstCorrect += 1;
      }
      if (wasSolved) {
        solved += 1;
        domain.solved += 1;
        section.solved += 1;
      }
      if (wasAttempted && !wasFirstCorrect) domain.errorCount += 1;
      itemEvidence.push({
        itemId: item.id,
        questionNumber: index + 1,
        axis: canonicalAxis,
        tier: item.tier,
        attempted: wasAttempted,
        firstCorrect: wasAttempted ? wasFirstCorrect : null,
        solved: wasSolved,
        attemptCount: responses.length,
        misconception: wasAttempted && !wasFirstCorrect ? item.misconception : null
      });
    });

    domains.forEach(function (domain) {
      domain.percentage = percentage(domain.firstCorrect, domain.attempted);
      domain.evidenceState = domain.attempted === 0 ? "unmeasured" : domain.attempted < 2 ? "thin" : "provisional";
    });
    const sections = Array.from(sectionById.values());
    sections.forEach(function (section) { section.percentage = percentage(section.firstCorrect, section.attempted); });
    const measured = domains.filter(function (domain) { return domain.attempted > 0; });
    const strength = measured.filter(function (domain) { return domain.firstCorrect > 0; }).sort(function (a, b) {
      return b.percentage - a.percentage || b.attempted - a.attempted || AXES.indexOf(a.axis) - AXES.indexOf(b.axis);
    })[0] || null;
    const errors = measured.filter(function (domain) { return domain.errorCount > 0; });
    const priority = errors.slice().sort(function (a, b) {
      return a.percentage - b.percentage || b.errorCount - a.errorCount || b.attempted - a.attempted || AXES.indexOf(a.axis) - AXES.indexOf(b.axis);
    })[0] || null;
    const accuracy = percentage(firstCorrect, attempted);

    return freeze({
      schemaVersion: "1.0.0",
      evidenceKind: "public-practice-preview",
      formalDiagnostic: false,
      officialPrediction: false,
      itemCount: items.length,
      attempted: attempted,
      solved: solved,
      firstCorrect: firstCorrect,
      accuracy: accuracy,
      complete: attempted === items.length,
      readinessBand: readinessBand(attempted, items.length, accuracy),
      domains: domains,
      sections: sections,
      strengthAxis: strength ? strength.axis : null,
      priorityAxis: priority ? priority.axis : null,
      unmeasuredAxes: domains.filter(function (domain) { return domain.evidenceState === "unmeasured"; }).map(function (domain) { return domain.axis; }),
      observedMisconceptions: itemEvidence.filter(function (item) { return item.misconception; }).map(function (item) { return item.misconception; }),
      itemEvidence: itemEvidence
    });
  }

  return freeze({ AXES: AXES, summarize: summarize });
});
