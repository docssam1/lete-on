(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOMockReadiness = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /*
   * Answer-free SASMO year-paper analysis contract.
   *
   * A private delivery service owns prompts and answers. This module receives
   * only scored outcomes, so it can safely build the student/teacher
   * readiness view without turning a public browser build into an answer key.
   */
  const SCHEMA_VERSION = "gfield-sasmo-mock-readiness-v1";
  const AXIS_IDS = Object.freeze([
    "number-operations", "patterns-algebra", "geometry-spatial",
    "combinatorics-logic", "data-probability", "problem-solving-strategies"
  ]);
  const OUTCOMES = Object.freeze(["correct", "incorrect", "blank"]);
  const SOURCE_STATES = Object.freeze(["private-verified-reference", "organizer-authorized-private"]);

  function fail(message) { throw new Error(message); }
  function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function dense(value, field) {
    if (!Array.isArray(value)) fail(`${field} must be an array`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must be dense`);
    }
    return value;
  }
  function text(value, field, pattern) {
    if (typeof value !== "string" || !value.trim() || value !== value.trim() || (pattern && !pattern.test(value))) {
      fail(`${field} is invalid`);
    }
  }
  function onlyKeys(value, keys, field) {
    if (!isRecord(value) || Object.keys(value).some(function (key) { return !keys.includes(key); })) fail(`${field} has unsupported fields`);
  }
  function round1(value) { return Math.round(value * 10) / 10; }

  function validateForm(form) {
    onlyKeys(form, ["schemaVersion", "formId", "formVersion", "programId", "year", "levelId", "comparisonKey", "scoringFingerprintSha256", "sourceFingerprintSha256", "packFingerprintSha256", "sourceState", "sections", "items"], "form");
    if (form.schemaVersion !== SCHEMA_VERSION || form.programId !== "sasmo") fail("form is not a SASMO readiness form");
    text(form.formId, "form.formId", /^sasmo-[0-9]{4}-g(?:[2-9]|10)-[a-z0-9-]{3,64}$/);
    text(form.formVersion, "form.formVersion", /^[a-z0-9-]{3,64}$/);
    if (!Number.isInteger(form.year) || form.year < 2000 || form.year > 2100) fail("form.year is invalid");
    text(form.levelId, "form.levelId", /^G(?:[2-9]|10)$/);
    text(form.comparisonKey, "form.comparisonKey", /^sasmo:g(?:[2-9]|10):[a-z0-9:+_/-]{6,100}$/);
    text(form.scoringFingerprintSha256, "form.scoringFingerprintSha256", /^[a-f0-9]{64}$/);
    text(form.sourceFingerprintSha256, "form.sourceFingerprintSha256", /^[a-f0-9]{64}$/);
    text(form.packFingerprintSha256, "form.packFingerprintSha256", /^[a-f0-9]{64}$/);
    if (!SOURCE_STATES.includes(form.sourceState)) fail("form.sourceState is invalid");
    const sections = dense(form.sections, "form.sections");
    if (sections.length !== 2) fail("form must contain exactly two sections");
    const expectedSections = [
      { id: "A", firstQuestionNumber: 1, itemCount: 15, correctPoints: 2, incorrectPoints: -1, blankPoints: 0 },
      { id: "B", firstQuestionNumber: 16, itemCount: 10, correctPoints: 4, incorrectPoints: 0, blankPoints: 0 }
    ];
    sections.forEach(function (section, index) {
      onlyKeys(section, ["id", "firstQuestionNumber", "itemCount", "correctPoints", "incorrectPoints", "blankPoints"], `form.sections[${index}]`);
      if (JSON.stringify(section) !== JSON.stringify(expectedSections[index])) fail("form section scoring must preserve the verified SASMO G6 format");
    });
    const items = dense(form.items, "form.items");
    if (items.length !== 25) fail("form must contain exactly 25 items");
    const skillIds = new Set();
    items.forEach(function (item, index) {
      onlyKeys(item, ["questionNumber", "axisId", "skillId"], `form.items[${index}]`);
      if (item.questionNumber !== index + 1 || !AXIS_IDS.includes(item.axisId)) fail("form item order or axis is invalid");
      text(item.skillId, `form.items[${index}].skillId`, /^[a-z][a-z0-9-]{2,80}$/);
      if (skillIds.has(item.skillId)) fail("form skill IDs must be unique per question");
      skillIds.add(item.skillId);
    });
    return true;
  }

  function validateAttempt(form, attempt) {
    validateForm(form);
    onlyKeys(attempt, ["formId", "outcomes"], "attempt");
    if (attempt.formId !== form.formId) fail("attempt formId does not match");
    const outcomes = dense(attempt.outcomes, "attempt.outcomes");
    if (outcomes.length !== 25) fail("attempt must contain exactly 25 outcomes");
    outcomes.forEach(function (outcome, index) {
      onlyKeys(outcome, ["questionNumber", "outcome"], `attempt.outcomes[${index}]`);
      if (outcome.questionNumber !== index + 1 || !OUTCOMES.includes(outcome.outcome)) fail("attempt outcome is invalid");
    });
    return true;
  }

  function scoreSection(section, outcomes) {
    const subset = outcomes.slice(section.firstQuestionNumber - 1, section.firstQuestionNumber - 1 + section.itemCount);
    const counts = { correct: 0, incorrect: 0, blank: 0 };
    subset.forEach(function (entry) { counts[entry.outcome] += 1; });
    return Object.freeze({
      id: section.id,
      correct: counts.correct,
      incorrect: counts.incorrect,
      blank: counts.blank,
      rawScore: counts.correct * section.correctPoints + counts.incorrect * section.incorrectPoints + counts.blank * section.blankPoints,
      maxScore: section.itemCount * section.correctPoints
    });
  }

  function scoreOnlyNumbers(value) {
    if (value == null) return Object.freeze([]);
    const numbers = dense(value, "scoreOnlyQuestionNumbers");
    if (numbers.some(function (number) { return !Number.isInteger(number) || number < 1 || number > 25; }) || new Set(numbers).size !== numbers.length) fail("scoreOnlyQuestionNumbers is invalid");
    return Object.freeze(numbers.slice().sort(function (left, right) { return left - right; }));
  }

  function axisReport(form, outcomes, excluded) {
    const byAxis = new Map();
    form.items.forEach(function (item) {
      if (excluded.has(item.questionNumber)) return;
      if (!byAxis.has(item.axisId)) byAxis.set(item.axisId, { axisId: item.axisId, itemCount: 0, correct: 0, incorrect: 0, blank: 0, questionNumbers: [] });
      const bucket = byAxis.get(item.axisId);
      const outcome = outcomes[item.questionNumber - 1].outcome;
      bucket.itemCount += 1;
      bucket[outcome] += 1;
      bucket.questionNumbers.push(item.questionNumber);
    });
    return Object.freeze(AXIS_IDS.map(function (axisId) {
      const bucket = byAxis.get(axisId) || { axisId, itemCount: 0, correct: 0, incorrect: 0, blank: 0, questionNumbers: [] };
      const percentage = bucket.itemCount ? round1(100 * bucket.correct / bucket.itemCount) : 0;
      return Object.freeze(Object.assign(bucket, {
        percentage,
        evidenceState: bucket.itemCount >= 4 ? "sufficient" : "needs-more-evidence"
      }));
    }));
  }

  function validateBandPolicy(policy) {
    onlyKeys(policy, ["bands"], "band policy");
    const bands = dense(policy.bands, "band policy.bands");
    if (bands.length < 2 || bands.length > 6) fail("band policy requires 2-6 bands");
    let prior = -Infinity;
    bands.forEach(function (band, index) {
      onlyKeys(band, ["id", "minPercent", "label"], `band policy.bands[${index}]`);
      text(band.id, `band policy.bands[${index}].id`, /^[a-z][a-z0-9-]{2,40}$/);
      text(band.label, `band policy.bands[${index}].label`, /^.{2,80}$/);
      if (!Number.isFinite(band.minPercent) || band.minPercent < 0 || band.minPercent > 100 || band.minPercent <= prior) fail("band policy thresholds are invalid");
      prior = band.minPercent;
    });
    if (bands[0].minPercent !== 0) fail("first readiness band must start at 0");
    return true;
  }

  function readinessBand(percent, policy) {
    validateBandPolicy(policy);
    return policy.bands.filter(function (band) { return Math.max(0, percent) >= band.minPercent; }).slice(-1)[0];
  }

  function normalCdf(value) {
    const sign = value < 0 ? -1 : 1;
    const x = Math.abs(value) / Math.sqrt(2);
    const t = 1 / (1 + 0.3275911 * x);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-x * x);
    return 0.5 * (1 + sign * erf);
  }

  function buildTrendPrediction(form, rawScore, history, targetScore) {
    const entries = history == null ? [] : dense(history, "history");
    if (targetScore != null && (!Number.isFinite(targetScore) || targetScore < -15 || targetScore > 70)) fail("target score is invalid");
    entries.forEach(function (entry, index) {
      onlyKeys(entry, ["formId", "formVersion", "levelId", "comparisonKey", "scoringFingerprintSha256", "sourceFingerprintSha256", "rawScore", "maxScore", "verifiedRealPaper"], `history[${index}]`);
      text(entry.formId, `history[${index}].formId`, /^sasmo-[0-9]{4}-g(?:[2-9]|10)-[a-z0-9-]{3,64}$/);
      text(entry.formVersion, `history[${index}].formVersion`, /^[a-z0-9-]{3,64}$/);
      text(entry.levelId, `history[${index}].levelId`, /^G(?:[2-9]|10)$/);
      text(entry.comparisonKey, `history[${index}].comparisonKey`, /^sasmo:g(?:[2-9]|10):[a-z0-9:+_/-]{6,100}$/);
      text(entry.scoringFingerprintSha256, `history[${index}].scoringFingerprintSha256`, /^[a-f0-9]{64}$/);
      text(entry.sourceFingerprintSha256, `history[${index}].sourceFingerprintSha256`, /^[a-f0-9]{64}$/);
      if (!Number.isFinite(entry.rawScore) || entry.rawScore < -15 || entry.rawScore > 70 || entry.maxScore !== 70 || entry.verifiedRealPaper !== true) fail("history must contain verified 70-point SASMO papers");
    });
    const evidenceCount = entries.length + 1;
    if (evidenceCount < 3) {
      return Object.freeze({ state: "collect-another-real-paper", officialAwardPrediction: false, evidenceCount, requiredEvidenceCount: 3 });
    }
    const formIds = entries.map(function (entry) { return entry.formId; }).concat([form.formId]);
    const sourceFingerprints = entries.map(function (entry) { return entry.sourceFingerprintSha256; }).concat([form.sourceFingerprintSha256]);
    const comparable = entries.every(function (entry) {
      return entry.levelId === form.levelId && entry.comparisonKey === form.comparisonKey && entry.scoringFingerprintSha256 === form.scoringFingerprintSha256;
    });
    if (new Set(formIds).size !== formIds.length || new Set(sourceFingerprints).size !== sourceFingerprints.length || !comparable) {
      return Object.freeze({ state: "incomparable-real-paper-history", officialAwardPrediction: false, evidenceCount, requiredEvidenceCount: 3 });
    }
    const values = history.map(function (entry) { return entry.rawScore; }).concat([rawScore]);
    const mean = values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
    const spread = values.length > 1 ? Math.sqrt(values.reduce(function (sum, value) { return sum + (value - mean) ** 2; }, 0) / (values.length - 1)) : 0;
    const conservativeSpread = Math.max(8, spread);
    const result = {
      state: "preliminary-real-paper-trend",
      officialAwardPrediction: false,
      expectedNextScoreRange: Object.freeze([Math.max(-15, Math.round(mean - conservativeSpread)), Math.min(70, Math.round(mean + conservativeSpread))]),
      evidenceCount,
      requiredEvidenceCount: 3,
      confidence: values.length >= 4 ? "medium" : "low",
      note: "This is a real-paper score trend, not an official SASMO award or cutoff prediction."
    };
    if (targetScore != null) {
      result.targetScore = targetScore;
      result.targetScoreProbabilityPercent = round1(100 * (1 - normalCdf((targetScore - mean) / conservativeSpread)));
    }
    return Object.freeze(result);
  }

  function analyzeAttempt(form, attempt, policy, options) {
    validateForm(form);
    validateAttempt(form, attempt);
    const settings = options || {};
    const scoreOnlyQuestionNumbers = scoreOnlyNumbers(settings.scoreOnlyQuestionNumbers);
    const scoreOnlySet = new Set(scoreOnlyQuestionNumbers);
    const sectionScores = form.sections.map(function (section) { return scoreSection(section, attempt.outcomes); });
    const rawScore = sectionScores.reduce(function (sum, section) { return sum + section.rawScore; }, 0);
    const maxScore = sectionScores.reduce(function (sum, section) { return sum + section.maxScore; }, 0);
    const correct = sectionScores.reduce(function (sum, section) { return sum + section.correct; }, 0);
    const incorrect = sectionScores.reduce(function (sum, section) { return sum + section.incorrect; }, 0);
    const blank = sectionScores.reduce(function (sum, section) { return sum + section.blank; }, 0);
    const percentOfMax = round1(100 * rawScore / maxScore);
    const axes = axisReport(form, attempt.outcomes, new Set());
    const diagnosticAxes = axisReport(form, attempt.outcomes, scoreOnlySet);
    const diagnosticItemCount = 25 - scoreOnlyQuestionNumbers.length;
    const diagnosticCorrect = diagnosticAxes.reduce(function (sum, axis) { return sum + axis.correct; }, 0);
    const diagnosticAverage = diagnosticItemCount ? diagnosticCorrect * 100 / diagnosticItemCount : null;
    const sufficient = diagnosticAxes.filter(function (axis) { return axis.evidenceState === "sufficient"; });
    const strengths = diagnosticAverage == null ? [] : sufficient.filter(function (axis) { return axis.percentage > diagnosticAverage; }).sort(function (a, b) { return b.percentage - a.percentage; }).slice(0, 2).map(function (axis) { return axis.axisId; });
    const weaknesses = diagnosticAverage == null ? [] : sufficient.filter(function (axis) { return axis.percentage < diagnosticAverage && axis.incorrect + axis.blank >= 2; }).sort(function (a, b) { return a.percentage - b.percentage; }).slice(0, 2).map(function (axis) { return axis.axisId; });
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      form: Object.freeze({ formId: form.formId, formVersion: form.formVersion, year: form.year, levelId: form.levelId, comparisonKey: form.comparisonKey, scoringFingerprintSha256: form.scoringFingerprintSha256, sourceFingerprintSha256: form.sourceFingerprintSha256, sourceState: form.sourceState }),
      score: Object.freeze({ rawScore, maxScore, percentOfMax, correct, incorrect, blank, sections: Object.freeze(sectionScores) }),
      readiness: Object.freeze({ band: Object.freeze(readinessBand(percentOfMax, policy)), notAnOfficialAward: true }),
      axes,
      diagnostic: Object.freeze({ itemCount: diagnosticItemCount, scoreOnlyQuestionNumbers, axes: diagnosticAxes }),
      strengths: Object.freeze(strengths),
      weaknesses: Object.freeze(weaknesses),
      prediction: buildTrendPrediction(form, rawScore, settings.history || null, settings.targetScore == null ? null : settings.targetScore)
    });
  }

  return Object.freeze({ SCHEMA_VERSION, AXIS_IDS, validateForm, validateAttempt, validateBandPolicy, buildTrendPrediction, analyzeAttempt });
});
