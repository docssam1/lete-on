(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../data/question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const validation = typeof module !== "undefined" && module.exports
    ? require("./question-bank-validation.js")
    : root.HIGHSELECT_QUESTION_BANK_VALIDATION;
  const sourceLineage = typeof module !== "undefined" && module.exports
    ? require("../data/source-lineage.js")
    : root.HIGHSELECT_SOURCE_LINEAGE;
  const api = factory(core, validation, sourceLineage);
  root.HIGHSELECT_EXAM_ASSEMBLY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core, validation, sourceLineage) {
  "use strict";

  if (!core || !validation || !sourceLineage) throw new Error("question-bank core, validation, and lineage modules are required");

  function addIssue(issues, code, context) {
    issues.push(Object.freeze({ code, context: context == null ? null : String(context) }));
  }

  function integer(value) {
    return Number.isSafeInteger(value) && value >= 0;
  }

  function countBy(items, key) {
    return items.reduce(function (counts, item) {
      const value = key(item);
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, Object.create(null));
  }

  function checkQuotaMap(issues, counts, quotas, allowedKeys, prefix) {
    if (quotas == null) return;
    Object.keys(quotas).sort().forEach(function (key) {
      if (!allowedKeys.includes(key)) {
        addIssue(issues, `${prefix}.unknown_key`, key);
        return;
      }
      const quota = quotas[key] || {};
      const actual = counts[key] || 0;
      if (quota.min != null && (!integer(quota.min) || actual < quota.min)) addIssue(issues, `${prefix}.minimum`, key);
      if (quota.max != null && (!integer(quota.max) || actual > quota.max)) addIssue(issues, `${prefix}.maximum`, key);
      if (integer(quota.min) && integer(quota.max) && quota.min > quota.max) addIssue(issues, `${prefix}.range`, key);
    });
  }

  function validateExamAssembly(exam, questions, constraints, hooks) {
    const items = Array.isArray(questions) ? questions.slice() : [];
    const rules = constraints || {};
    const issues = [];
    const mode = exam && exam.mode;

    if (!exam || !core.isNeutralId(exam.id, "exam", mode)) addIssue(issues, "exam.id");
    if (!exam || !core.PROGRAM_MODES.includes(mode)) addIssue(issues, "exam.mode");
    if (!exam || exam.writer !== core.WRITER) addIssue(issues, "exam.writer");
    if (!Array.isArray(questions)) addIssue(issues, "exam.questions");

    if (rules.questionCount != null) {
      if (!integer(rules.questionCount) || rules.questionCount === 0) addIssue(issues, "constraint.question_count_invalid");
      else if (items.length !== rules.questionCount) addIssue(issues, "constraint.question_count");
    }

    const seenIds = new Set();
    const seenFamilies = new Map();
    let totalPoints = 0;
    let figureCount = 0;
    let originalCount = 0;
    const gateResults = [];

    items.forEach(function (question, index) {
      const context = question && question.id ? question.id : `index:${index}`;
      if (seenIds.has(context)) addIssue(issues, "question.duplicate_id", context);
      seenIds.add(context);
      if (!question || question.mode !== mode) addIssue(issues, "question.mode_mismatch", context);
      if (!question || question.writer !== core.WRITER) addIssue(issues, "question.writer", context);

      const familyId = question && question.variant && question.variant.familyId;
      if (familyId) seenFamilies.set(familyId, (seenFamilies.get(familyId) || 0) + 1);
      if (validation.requiresFigureAudit(question)) figureCount += 1;
      if (question && question.lineage && question.lineage.relation === "original") originalCount += 1;

      if (!question || !Number.isFinite(question.points) || question.points <= 0) {
        addIssue(issues, "question.points", context);
      } else {
        totalPoints += question.points;
      }

      const gateResult = validation.evaluateQuestionGates(question, hooks);
      gateResults.push(Object.freeze({ id: context, eligible: gateResult.eligible, issues: gateResult.issues }));
      if (!gateResult.eligible) addIssue(issues, "question.ineligible", context);
    });

    const maxPerFamily = rules.maxPerFamily == null ? 1 : rules.maxPerFamily;
    if (!integer(maxPerFamily) || maxPerFamily === 0) addIssue(issues, "constraint.max_per_family_invalid");
    else Array.from(seenFamilies.entries()).sort().forEach(function (entry) {
      if (entry[1] > maxPerFamily) addIssue(issues, "constraint.family_repeat", entry[0]);
    });

    if (rules.totalPoints != null) {
      if (!Number.isFinite(rules.totalPoints) || rules.totalPoints <= 0) addIssue(issues, "constraint.total_points_invalid");
      else if (totalPoints !== rules.totalPoints) addIssue(issues, "constraint.total_points");
    }
    if (rules.maxFigureQuestions != null) {
      if (!integer(rules.maxFigureQuestions)) addIssue(issues, "constraint.max_figures_invalid");
      else if (figureCount > rules.maxFigureQuestions) addIssue(issues, "constraint.max_figures");
    }

    const minOriginalQuestions = rules.minOriginalQuestions == null ? 1 : rules.minOriginalQuestions;
    if (!integer(minOriginalQuestions)) addIssue(issues, "constraint.min_original_invalid");
    else if (originalCount < minOriginalQuestions) addIssue(issues, "constraint.min_original");

    checkQuotaMap(
      issues,
      countBy(items, function (question) { return question && question.difficultyBand; }),
      rules.difficultyBands,
      core.DIFFICULTY_BANDS,
      "constraint.difficulty"
    );
    checkQuotaMap(
      issues,
      countBy(items, function (question) { return question && question.inputType; }),
      rules.inputTypes,
      core.INPUT_TYPES,
      "constraint.input_type"
    );
    checkQuotaMap(
      issues,
      countBy(items, function (question) { return question && question.lineage && question.lineage.relation; }),
      rules.lineageRelations,
      sourceLineage.LINEAGE_RELATIONS,
      "constraint.lineage"
    );

    if (rules.maxPerCurriculumDetail != null) {
      if (!integer(rules.maxPerCurriculumDetail) || rules.maxPerCurriculumDetail === 0) {
        addIssue(issues, "constraint.max_per_detail_invalid");
      } else {
        const detailCounts = countBy(items, function (question) {
          return question && question.curriculum && question.curriculum.key || "missing";
        });
        Object.keys(detailCounts).sort().forEach(function (key) {
          if (detailCounts[key] > rules.maxPerCurriculumDetail) addIssue(issues, "constraint.detail_repeat", key);
        });
      }
    }

    issues.sort(function (a, b) {
      return `${a.code}:${a.context || ""}`.localeCompare(`${b.code}:${b.context || ""}`);
    });
    return Object.freeze({
      eligible: issues.length === 0,
      issues: Object.freeze(issues),
      summary: Object.freeze({ questionCount: items.length, totalPoints, figureCount, originalCount }),
      questionGates: Object.freeze(gateResults)
    });
  }

  return Object.freeze({ validateExamAssembly });
});
