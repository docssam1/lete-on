(function (root, factory) {
  const engine = typeof module === "object" && module.exports
    ? require("./diagnostic-engine.js")
    : root.GFIELDDiagnosticEngine;
  const api = factory(engine);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDUnitScreenerReportProjections = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (engine) {
  "use strict";

  if (!engine) throw new Error("GFIELDDiagnosticEngine is required");

  const SCHEMA_VERSION = "gfield-unit-screener-report-projection-v1";
  const EVIDENCE_STATE = "reviewed-observation-count-only-no-mastery-threshold";
  const FORBIDDEN_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "solution", "rubric",
    "privatepayload", "privatescoring", "scoringspec", "acceptedalternatives",
    "placement", "promotion", "prescription", "mastery", "strength", "weakness"
  ]);
  const ID_PATTERNS = Object.freeze({
    blueprintId: /^asm-bdg-[a-z0-9-]{6,64}$/,
    learnerId: /^lrm-bdg-[a-z0-9]{16}$/,
    slotId: /^slot-bdg-[a-z0-9-]{4,64}$/,
    itemId: /^qst-bnk-[a-z0-9]{16}$/,
    unitId: /^[a-z0-9][a-z0-9-]{2,127}$/,
    clusterId: /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/,
    standardRange: /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/,
    standardFocus: /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/,
    skillId: /^[a-z0-9][a-z0-9:-]{2,127}$/,
    domainId: /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/
  });
  const ANALYSIS_FIELDS = Object.freeze([
    "schemaVersion", "blueprintId", "blueprintVersion", "purpose", "learnerId", "score",
    "difficultyEvidence", "focuses", "itemFeedback", "interpretation"
  ]);
  const FOCUS_FIELDS = Object.freeze([
    "standardFocus", "unitId", "clusterId", "standardRange", "domainId", "skillIds",
    "earnedPoints", "maxPoints", "itemCount", "percentage", "errorCounts",
    "difficultyEvidence", "minimumObservationsMet", "evidenceState"
  ]);
  const ITEM_FIELDS = Object.freeze([
    "slotId", "itemId", "standardFocus", "difficulty", "earnedPoints", "maxPoints", "outcomeCode",
    "errorType", "commentCode", "comment"
  ]);
  const INTERPRETATION_FIELDS = Object.freeze([
    "state", "missingObservationFocusIds", "masteryThresholdApproved", "automaticPrescription",
    "coursePlacement", "promotionDecision", "competitionScorePrediction", "teacherConfirmationRequired"
  ]);

  function fail(message) { throw new Error(message); }
  function hasAccessors(value) {
    return Object.values(Object.getOwnPropertyDescriptors(value)).some(function (descriptor) {
      return typeof descriptor.get === "function" || typeof descriptor.set === "function";
    });
  }
  function isRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return (prototype === Object.prototype || prototype === null) && !hasAccessors(value);
  }
  function knownFields(value, fields, label) {
    if (!isRecord(value) || Object.getOwnPropertySymbols(value).length) fail(`${label} is invalid`);
    const allowed = new Set(fields);
    if (Object.keys(value).some(function (key) { return !allowed.has(key); })) fail(`${label} has unsupported fields`);
    return value;
  }
  function denseArray(value, label) {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length || hasAccessors(value)) {
      fail(`${label} must be an array`);
    }
    if (Object.keys(value).length !== value.length || Object.keys(value).some(function (key, index) { return key !== String(index); })) {
      fail(`${label} must not have empty slots or unsupported fields`);
    }
    return value;
  }
  function normalizedKey(value) {
    return String(value).normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
  }
  function noPrivateKeys(value, label) {
    const seen = new Set();
    function visit(node, path) {
      if (!node || typeof node !== "object") return;
      if (seen.has(node)) fail(`${label} contains a cycle`);
      seen.add(node);
      if (Array.isArray(node)) denseArray(node, path).forEach(function (child, index) { visit(child, `${path}[${index}]`); });
      else {
        if (!isRecord(node)) fail(`${path} is invalid`);
        Object.keys(node).forEach(function (key) {
          if (FORBIDDEN_KEYS.has(normalizedKey(key))) fail(`${label} contains forbidden decision or answer data`);
          visit(node[key], `${path}.${key}`);
        });
      }
      seen.delete(node);
    }
    visit(value, label);
  }
  function requireText(value, label, pattern) {
    if (typeof value !== "string" || !value || value !== value.trim() || (pattern && !pattern.test(value))) fail(`${label} is invalid`);
    return value;
  }
  function requireInteger(value, label) {
    if (!Number.isInteger(value) || value < 0) fail(`${label} is invalid`);
    return value;
  }
  function requireNumber(value, label) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(`${label} is invalid`);
    return value;
  }
  function requirePercent(value, label) {
    requireNumber(value, label);
    if (value > 100) fail(`${label} is invalid`);
    return value;
  }
  function round1(value) { return Math.round((value + Number.EPSILON) * 10) / 10; }
  function sameJson(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
  function sameCounts(left, right) {
    return sameJson(Object.entries(left).sort(), Object.entries(right).sort());
  }
  function emptyDifficultyTotals() {
    return Object.fromEntries(engine.DIFFICULTIES.map(function (difficulty) {
      return [difficulty, { earnedPoints: 0, maxPoints: 0, itemCount: 0 }];
    }));
  }
  function addDifficultyTotal(value, difficulty, earnedPoints, maxPoints) {
    value[difficulty].earnedPoints += earnedPoints;
    value[difficulty].maxPoints += maxPoints;
    value[difficulty].itemCount += 1;
  }
  function difficultyMatches(value, totals) {
    return engine.DIFFICULTIES.every(function (difficulty) {
      const row = value[difficulty];
      const expected = totals[difficulty];
      const percentage = expected.maxPoints ? round1(100 * expected.earnedPoints / expected.maxPoints) : null;
      return row.earnedPoints === expected.earnedPoints && row.maxPoints === expected.maxPoints &&
        row.itemCount === expected.itemCount && row.percentage === percentage;
    });
  }
  function cloneLocalized(value) {
    return Object.freeze({ ko: value.ko, en: value.en, "zh-Hans": value["zh-Hans"] });
  }
  function validateLocalized(value, expected, label) {
    knownFields(value, ["ko", "en", "zh-Hans"], label);
    ["ko", "en", "zh-Hans"].forEach(function (locale) {
      requireText(value[locale], `${label}.${locale}`);
      if (expected && value[locale] !== expected[locale]) fail(`${label}.${locale} is invalid`);
    });
  }
  function validateScore(score, label) {
    knownFields(score, ["earnedPoints", "maxPoints", "percentage"], label);
    requireNumber(score.earnedPoints, `${label}.earnedPoints`);
    requireNumber(score.maxPoints, `${label}.maxPoints`);
    requirePercent(score.percentage, `${label}.percentage`);
    if (!score.maxPoints || score.earnedPoints > score.maxPoints || score.percentage !== round1(100 * score.earnedPoints / score.maxPoints)) fail(`${label} is inconsistent`);
  }
  function validateErrorCounts(value, label) {
    if (!isRecord(value)) fail(`${label} is invalid`);
    Object.entries(value).forEach(function (entry) {
      if (!engine.ERROR_TYPES.includes(entry[0]) || !Number.isInteger(entry[1]) || entry[1] < 1) fail(`${label} is invalid`);
    });
  }
  function validateDifficulty(value, label) {
    knownFields(value, engine.DIFFICULTIES, label);
    engine.DIFFICULTIES.forEach(function (difficulty) {
      const row = value[difficulty];
      knownFields(row, ["earnedPoints", "maxPoints", "itemCount", "percentage"], `${label}.${difficulty}`);
      requireNumber(row.earnedPoints, `${label}.${difficulty}.earnedPoints`);
      requireNumber(row.maxPoints, `${label}.${difficulty}.maxPoints`);
      requireInteger(row.itemCount, `${label}.${difficulty}.itemCount`);
      if (!row.itemCount) {
        if (row.earnedPoints || row.maxPoints || row.percentage !== null) fail(`${label}.${difficulty} is inconsistent`);
      } else {
        requirePercent(row.percentage, `${label}.${difficulty}.percentage`);
        if (!row.maxPoints || row.earnedPoints > row.maxPoints || row.percentage !== round1(100 * row.earnedPoints / row.maxPoints)) fail(`${label}.${difficulty} is inconsistent`);
      }
    });
  }
  function validateInterpretation(value, focusIds, label) {
    knownFields(value, INTERPRETATION_FIELDS, label);
    denseArray(value.missingObservationFocusIds, `${label}.missingObservationFocusIds`).forEach(function (focusId) {
      requireText(focusId, `${label}.missingObservationFocusIds`, ID_PATTERNS.standardFocus);
      if (!focusIds.has(focusId)) fail(`${label} contains an unknown focus`);
    });
    ["masteryThresholdApproved", "automaticPrescription", "coursePlacement", "promotionDecision", "competitionScorePrediction"].forEach(function (field) {
      if (value[field] !== false) fail(`${label}.${field} must remain false`);
    });
    if (value.teacherConfirmationRequired !== true) fail(`${label}.teacherConfirmationRequired must remain true`);
    const expectedState = value.missingObservationFocusIds.length ? "insufficient-reviewed-observations" : "ready-for-teacher-interpretation";
    if (value.state !== expectedState) fail(`${label}.state is invalid`);
  }
  function validateAnalysis(analysis) {
    knownFields(analysis, ANALYSIS_FIELDS, "unit-screener analysis");
    noPrivateKeys(analysis, "unit-screener analysis");
    if (analysis.schemaVersion !== engine.SCHEMA_VERSION || analysis.purpose !== "unit-screener") fail("unit-screener analysis is invalid");
    requireText(analysis.blueprintId, "unit-screener analysis.blueprintId", ID_PATTERNS.blueprintId);
    requireInteger(analysis.blueprintVersion, "unit-screener analysis.blueprintVersion");
    if (analysis.blueprintVersion < 1) fail("unit-screener analysis.blueprintVersion is invalid");
    requireText(analysis.learnerId, "unit-screener analysis.learnerId", ID_PATTERNS.learnerId);
    validateScore(analysis.score, "unit-screener analysis.score");
    validateDifficulty(analysis.difficultyEvidence, "unit-screener analysis.difficultyEvidence");

    const focusMap = new Map();
    denseArray(analysis.focuses, "unit-screener analysis.focuses").forEach(function (focus, index) {
      const label = `unit-screener analysis.focuses[${index}]`;
      knownFields(focus, FOCUS_FIELDS, label);
      ["standardFocus", "unitId", "clusterId", "standardRange", "domainId"].forEach(function (field) {
        requireText(focus[field], `${label}.${field}`, ID_PATTERNS[field]);
      });
      if (focusMap.has(focus.standardFocus)) fail("unit-screener analysis focuses contain duplicates");
      denseArray(focus.skillIds, `${label}.skillIds`).forEach(function (skillId) { requireText(skillId, `${label}.skillIds`, ID_PATTERNS.skillId); });
      if (!focus.skillIds.length || new Set(focus.skillIds).size !== focus.skillIds.length) fail(`${label}.skillIds is invalid`);
      requireNumber(focus.earnedPoints, `${label}.earnedPoints`);
      requireNumber(focus.maxPoints, `${label}.maxPoints`);
      requireInteger(focus.itemCount, `${label}.itemCount`);
      requirePercent(focus.percentage, `${label}.percentage`);
      if (!focus.maxPoints || !focus.itemCount || focus.earnedPoints > focus.maxPoints || focus.percentage !== round1(100 * focus.earnedPoints / focus.maxPoints)) fail(`${label} is inconsistent`);
      validateErrorCounts(focus.errorCounts, `${label}.errorCounts`);
      validateDifficulty(focus.difficultyEvidence, `${label}.difficultyEvidence`);
      if (focus.minimumObservationsMet !== (focus.itemCount >= 2) || focus.evidenceState !== EVIDENCE_STATE) fail(`${label} has an unsupported interpretation`);
      focusMap.set(focus.standardFocus, focus);
    });
    if (!focusMap.size) fail("unit-screener analysis requires focus evidence");

    const slotIds = new Set();
    const itemIds = new Set();
    const grouped = new Map();
    const overallDifficulty = emptyDifficultyTotals();
    denseArray(analysis.itemFeedback, "unit-screener analysis.itemFeedback").forEach(function (item, index) {
      const label = `unit-screener analysis.itemFeedback[${index}]`;
      knownFields(item, ITEM_FIELDS, label);
      requireText(item.slotId, `${label}.slotId`, ID_PATTERNS.slotId);
      requireText(item.itemId, `${label}.itemId`, ID_PATTERNS.itemId);
      requireText(item.standardFocus, `${label}.standardFocus`, ID_PATTERNS.standardFocus);
      if (slotIds.has(item.slotId) || itemIds.has(item.itemId) || !focusMap.has(item.standardFocus)) fail(`${label} is invalid`);
      slotIds.add(item.slotId);
      itemIds.add(item.itemId);
      if (!engine.DIFFICULTIES.includes(item.difficulty)) fail(`${label}.difficulty is invalid`);
      requireNumber(item.earnedPoints, `${label}.earnedPoints`);
      requireNumber(item.maxPoints, `${label}.maxPoints`);
      if (!item.maxPoints || item.earnedPoints > item.maxPoints) fail(`${label} is inconsistent`);
      const expectedOutcome = item.earnedPoints === item.maxPoints ? "full-credit" : item.earnedPoints > 0 ? "partial-credit" : "no-credit";
      if (item.outcomeCode !== expectedOutcome) fail(`${label}.outcomeCode is invalid`);
      if (item.earnedPoints === item.maxPoints) {
        if (item.errorType !== null || item.commentCode !== "secure") fail(`${label} feedback is invalid`);
      } else if (!engine.ERROR_TYPES.includes(item.errorType) || item.commentCode !== item.errorType) fail(`${label} feedback is invalid`);
      validateLocalized(item.comment, engine.FEEDBACK[item.commentCode], `${label}.comment`);
      if (!grouped.has(item.standardFocus)) grouped.set(item.standardFocus, {
        earnedPoints: 0, maxPoints: 0, itemCount: 0, errorCounts: {}, difficultyEvidence: emptyDifficultyTotals()
      });
      const group = grouped.get(item.standardFocus);
      group.earnedPoints += item.earnedPoints;
      group.maxPoints += item.maxPoints;
      group.itemCount += 1;
      if (item.errorType) group.errorCounts[item.errorType] = (group.errorCounts[item.errorType] || 0) + 1;
      addDifficultyTotal(group.difficultyEvidence, item.difficulty, item.earnedPoints, item.maxPoints);
      addDifficultyTotal(overallDifficulty, item.difficulty, item.earnedPoints, item.maxPoints);
    });
    if (!itemIds.size) fail("unit-screener analysis requires item feedback");

    focusMap.forEach(function (focus, focusId) {
      const group = grouped.get(focusId);
      if (!group || group.earnedPoints !== focus.earnedPoints || group.maxPoints !== focus.maxPoints || group.itemCount !== focus.itemCount ||
        !sameCounts(group.errorCounts, focus.errorCounts) || !difficultyMatches(focus.difficultyEvidence, group.difficultyEvidence)) {
        fail(`unit-screener analysis focus ${focusId} does not match item evidence`);
      }
    });
    const earned = analysis.itemFeedback.reduce(function (sum, item) { return sum + item.earnedPoints; }, 0);
    const maximum = analysis.itemFeedback.reduce(function (sum, item) { return sum + item.maxPoints; }, 0);
    if (earned !== analysis.score.earnedPoints || maximum !== analysis.score.maxPoints) fail("unit-screener analysis score does not match item evidence");
    if (!difficultyMatches(analysis.difficultyEvidence, overallDifficulty)) fail("unit-screener analysis difficulty evidence does not match item evidence");
    validateInterpretation(analysis.interpretation, new Set(focusMap.keys()), "unit-screener analysis.interpretation");
    const expectedMissing = analysis.focuses.filter(function (focus) { return !focus.minimumObservationsMet; }).map(function (focus) { return focus.standardFocus; });
    if (!sameJson(analysis.interpretation.missingObservationFocusIds, expectedMissing)) fail("unit-screener analysis interpretation does not match focus evidence");
    return true;
  }

  function cloneScore(score) { return Object.freeze({ earnedPoints: score.earnedPoints, maxPoints: score.maxPoints, percentage: score.percentage }); }
  function cloneErrorCounts(value) { return Object.freeze(Object.assign({}, value)); }
  function cloneDifficulty(value) {
    return Object.freeze(Object.fromEntries(engine.DIFFICULTIES.map(function (difficulty) {
      const row = value[difficulty];
      return [difficulty, Object.freeze({ earnedPoints: row.earnedPoints, maxPoints: row.maxPoints, itemCount: row.itemCount, percentage: row.percentage })];
    })));
  }
  function cloneInterpretation(value) {
    return Object.freeze({
      state: value.state,
      missingObservationFocusIds: Object.freeze(value.missingObservationFocusIds.slice()),
      masteryThresholdApproved: false,
      automaticPrescription: false,
      coursePlacement: false,
      promotionDecision: false,
      competitionScorePrediction: false,
      teacherConfirmationRequired: true
    });
  }
  function buildReport(analysis, audience) {
    validateAnalysis(analysis);
    const teacher = audience === "teacher";
    const assessment = teacher
      ? { blueprintId: analysis.blueprintId, blueprintVersion: analysis.blueprintVersion, purpose: analysis.purpose, learnerId: analysis.learnerId }
      : { blueprintId: analysis.blueprintId, blueprintVersion: analysis.blueprintVersion, purpose: analysis.purpose };
    const focuses = analysis.focuses.map(function (focus) {
      const common = {
        standardFocus: focus.standardFocus,
        clusterId: focus.clusterId,
        earnedPoints: focus.earnedPoints,
        maxPoints: focus.maxPoints,
        itemCount: focus.itemCount,
        percentage: focus.percentage,
        errorCounts: cloneErrorCounts(focus.errorCounts),
        minimumObservationsMet: focus.minimumObservationsMet,
        evidenceState: focus.evidenceState
      };
      if (teacher) Object.assign(common, {
        unitId: focus.unitId,
        standardRange: focus.standardRange,
        domainId: focus.domainId,
        skillIds: Object.freeze(focus.skillIds.slice()),
        difficultyEvidence: cloneDifficulty(focus.difficultyEvidence)
      });
      return Object.freeze(common);
    });
    const itemFeedback = analysis.itemFeedback.map(function (item, index) {
      const common = {
        questionNumber: index + 1,
        standardFocus: item.standardFocus,
        difficulty: item.difficulty,
        earnedPoints: item.earnedPoints,
        maxPoints: item.maxPoints,
        outcomeCode: item.outcomeCode,
        errorType: item.errorType,
        commentCode: item.commentCode,
        comment: cloneLocalized(item.comment)
      };
      if (teacher) {
        common.slotId = item.slotId;
        common.itemId = item.itemId;
      }
      return Object.freeze(common);
    });
    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      audience,
      deliveryRequirement: teacher ? "authenticated-teacher-or-admin-only" : "authenticated-owner-only",
      authorizationVerified: false,
      assessment: Object.freeze(assessment),
      score: cloneScore(analysis.score),
      difficultyEvidence: teacher ? cloneDifficulty(analysis.difficultyEvidence) : undefined,
      focuses: Object.freeze(focuses),
      itemFeedback: Object.freeze(itemFeedback),
      interpretation: cloneInterpretation(analysis.interpretation)
    });
  }
  function buildStudentReport(analysis) {
    const report = buildReport(analysis, "student");
    const student = Object.assign({}, report);
    delete student.difficultyEvidence;
    return Object.freeze(student);
  }
  function buildTeacherReport(analysis) { return buildReport(analysis, "teacher"); }

  function validateProjection(projection, audience) {
    const teacher = audience === "teacher";
    const fields = ["schemaVersion", "audience", "deliveryRequirement", "authorizationVerified", "assessment", "score", "focuses", "itemFeedback", "interpretation"];
    if (teacher) fields.push("difficultyEvidence");
    knownFields(projection, fields, `${audience} unit-screener projection`);
    noPrivateKeys(projection, `${audience} unit-screener projection`);
    if (projection.schemaVersion !== SCHEMA_VERSION || projection.audience !== audience || projection.authorizationVerified !== false) fail(`${audience} unit-screener projection is invalid`);
    const expectedDelivery = teacher ? "authenticated-teacher-or-admin-only" : "authenticated-owner-only";
    if (projection.deliveryRequirement !== expectedDelivery) fail(`${audience} unit-screener projection is invalid`);
    knownFields(projection.assessment, teacher ? ["blueprintId", "blueprintVersion", "purpose", "learnerId"] : ["blueprintId", "blueprintVersion", "purpose"], `${audience} unit-screener projection assessment`);
    requireText(projection.assessment.blueprintId, `${audience} unit-screener projection assessment.blueprintId`, ID_PATTERNS.blueprintId);
    requireInteger(projection.assessment.blueprintVersion, `${audience} unit-screener projection assessment.blueprintVersion`);
    if (projection.assessment.blueprintVersion < 1 || projection.assessment.purpose !== "unit-screener") fail(`${audience} unit-screener projection assessment is invalid`);
    if (teacher) requireText(projection.assessment.learnerId, "teacher unit-screener projection assessment.learnerId", ID_PATTERNS.learnerId);
    validateScore(projection.score, `${audience} unit-screener projection.score`);
    if (teacher) validateDifficulty(projection.difficultyEvidence, "teacher unit-screener projection.difficultyEvidence");

    const focusMap = new Map();
    const focusFields = ["standardFocus", "clusterId", "earnedPoints", "maxPoints", "itemCount", "percentage", "errorCounts", "minimumObservationsMet", "evidenceState"];
    const teacherFocusFields = focusFields.concat(["unitId", "standardRange", "domainId", "skillIds", "difficultyEvidence"]);
    denseArray(projection.focuses, `${audience} unit-screener projection.focuses`).forEach(function (focus, index) {
      const label = `${audience} unit-screener projection.focuses[${index}]`;
      knownFields(focus, teacher ? teacherFocusFields : focusFields, label);
      requireText(focus.standardFocus, `${label}.standardFocus`, ID_PATTERNS.standardFocus);
      requireText(focus.clusterId, `${label}.clusterId`, ID_PATTERNS.clusterId);
      if (focusMap.has(focus.standardFocus)) fail(`${label} is duplicated`);
      focusMap.set(focus.standardFocus, focus);
      requireNumber(focus.earnedPoints, `${label}.earnedPoints`);
      requireNumber(focus.maxPoints, `${label}.maxPoints`);
      requireInteger(focus.itemCount, `${label}.itemCount`);
      requirePercent(focus.percentage, `${label}.percentage`);
      if (!focus.maxPoints || !focus.itemCount || focus.earnedPoints > focus.maxPoints || focus.percentage !== round1(100 * focus.earnedPoints / focus.maxPoints)) fail(`${label} is inconsistent`);
      validateErrorCounts(focus.errorCounts, `${label}.errorCounts`);
      if (focus.minimumObservationsMet !== (focus.itemCount >= 2) || focus.evidenceState !== EVIDENCE_STATE) fail(`${label} has an unsupported interpretation`);
      if (teacher) {
        requireText(focus.unitId, `${label}.unitId`, ID_PATTERNS.unitId);
        requireText(focus.standardRange, `${label}.standardRange`, ID_PATTERNS.standardRange);
        requireText(focus.domainId, `${label}.domainId`, ID_PATTERNS.domainId);
        denseArray(focus.skillIds, `${label}.skillIds`).forEach(function (skillId) { requireText(skillId, `${label}.skillIds`, ID_PATTERNS.skillId); });
        if (!focus.skillIds.length || new Set(focus.skillIds).size !== focus.skillIds.length) fail(`${label}.skillIds is invalid`);
        validateDifficulty(focus.difficultyEvidence, `${label}.difficultyEvidence`);
      }
    });
    if (!focusMap.size) fail(`${audience} unit-screener projection requires focus evidence`);

    const slotIds = new Set();
    const itemIds = new Set();
    const grouped = new Map();
    const overallDifficulty = emptyDifficultyTotals();
    const itemFields = ["questionNumber", "standardFocus", "difficulty", "earnedPoints", "maxPoints", "outcomeCode", "errorType", "commentCode", "comment"];
    denseArray(projection.itemFeedback, `${audience} unit-screener projection.itemFeedback`).forEach(function (item, index) {
      const label = `${audience} unit-screener projection.itemFeedback[${index}]`;
      knownFields(item, teacher ? itemFields.concat(["slotId", "itemId"]) : itemFields, label);
      if (item.questionNumber !== index + 1 || !focusMap.has(item.standardFocus) || !engine.DIFFICULTIES.includes(item.difficulty)) fail(`${label} is invalid`);
      if (teacher) {
        requireText(item.slotId, `${label}.slotId`, ID_PATTERNS.slotId);
        requireText(item.itemId, `${label}.itemId`, ID_PATTERNS.itemId);
        if (slotIds.has(item.slotId)) fail(`${label}.slotId is duplicated`);
        if (itemIds.has(item.itemId)) fail(`${label}.itemId is duplicated`);
        slotIds.add(item.slotId);
        itemIds.add(item.itemId);
      }
      requireNumber(item.earnedPoints, `${label}.earnedPoints`);
      requireNumber(item.maxPoints, `${label}.maxPoints`);
      if (!item.maxPoints || item.earnedPoints > item.maxPoints) fail(`${label} is inconsistent`);
      const expectedOutcome = item.earnedPoints === item.maxPoints ? "full-credit" : item.earnedPoints > 0 ? "partial-credit" : "no-credit";
      if (item.outcomeCode !== expectedOutcome) fail(`${label}.outcomeCode is invalid`);
      if (item.earnedPoints === item.maxPoints) {
        if (item.errorType !== null || item.commentCode !== "secure") fail(`${label} feedback is invalid`);
      } else if (!engine.ERROR_TYPES.includes(item.errorType) || item.commentCode !== item.errorType) fail(`${label} feedback is invalid`);
      validateLocalized(item.comment, engine.FEEDBACK[item.commentCode], `${label}.comment`);
      if (!grouped.has(item.standardFocus)) grouped.set(item.standardFocus, {
        earnedPoints: 0, maxPoints: 0, itemCount: 0, errorCounts: {}, difficultyEvidence: emptyDifficultyTotals()
      });
      const group = grouped.get(item.standardFocus);
      group.earnedPoints += item.earnedPoints;
      group.maxPoints += item.maxPoints;
      group.itemCount += 1;
      if (item.errorType) group.errorCounts[item.errorType] = (group.errorCounts[item.errorType] || 0) + 1;
      addDifficultyTotal(group.difficultyEvidence, item.difficulty, item.earnedPoints, item.maxPoints);
      addDifficultyTotal(overallDifficulty, item.difficulty, item.earnedPoints, item.maxPoints);
    });
    focusMap.forEach(function (focus, focusId) {
      const group = grouped.get(focusId);
      if (!group || group.earnedPoints !== focus.earnedPoints || group.maxPoints !== focus.maxPoints || group.itemCount !== focus.itemCount ||
        !sameCounts(group.errorCounts, focus.errorCounts) || (teacher && !difficultyMatches(focus.difficultyEvidence, group.difficultyEvidence))) {
        fail(`${audience} unit-screener projection focus ${focusId} does not match item evidence`);
      }
    });
    const earned = projection.itemFeedback.reduce(function (sum, item) { return sum + item.earnedPoints; }, 0);
    const maximum = projection.itemFeedback.reduce(function (sum, item) { return sum + item.maxPoints; }, 0);
    if (earned !== projection.score.earnedPoints || maximum !== projection.score.maxPoints) fail(`${audience} unit-screener projection score does not match item evidence`);
    if (teacher && !difficultyMatches(projection.difficultyEvidence, overallDifficulty)) fail("teacher unit-screener projection difficulty evidence does not match item evidence");
    validateInterpretation(projection.interpretation, new Set(focusMap.keys()), `${audience} unit-screener projection.interpretation`);
    return true;
  }

  return Object.freeze({
    SCHEMA_VERSION,
    validateAnalysis,
    buildStudentReport,
    buildTeacherReport,
    validateStudentReport: function (projection) { return validateProjection(projection, "student"); },
    validateTeacherReport: function (projection) { return validateProjection(projection, "teacher"); }
  });
});
