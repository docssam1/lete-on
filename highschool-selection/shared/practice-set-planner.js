(function (root, factory) {
  "use strict";
  const core = typeof module !== "undefined" && module.exports
    ? require("../data/question-bank-core.js")
    : root.HIGHSELECT_QUESTION_BANK_CORE;
  const practiceCore = typeof module !== "undefined" && module.exports
    ? require("../data/practice-bank-core.js")
    : root.HIGHSELECT_PRACTICE_BANK_CORE;
  const validation = typeof module !== "undefined" && module.exports
    ? require("./question-bank-validation.js")
    : root.HIGHSELECT_QUESTION_BANK_VALIDATION;
  const api = factory(core, practiceCore, validation);
  root.HIGHSELECT_PRACTICE_SET_PLANNER = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (core, practiceCore, validation) {
  "use strict";

  if (!core || !practiceCore || !validation) {
    throw new Error("question-bank core, practice core, and validation modules are required");
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const MASTERY_PRIORITY = Object.freeze({
    needs_review: 0,
    learning: 1,
    consolidating: 2,
    unseen: 3,
    mastered: 4
  });

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function compareText(a, b) {
    return String(a).localeCompare(String(b));
  }

  function normalizeIso(value, field) {
    const parsed = new Date(value);
    invariant(Number.isFinite(parsed.getTime()), `${field} must be a valid timestamp`);
    return parsed.toISOString();
  }

  function addDays(iso, days) {
    return new Date(Date.parse(iso) + days * DAY_MS).toISOString();
  }

  function digest32(value, seed) {
    let hash = seed >>> 0;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  function stableSelectionDigest(values) {
    const canonical = values.slice().sort().join("|");
    return digest32(canonical, 0x811c9dc5) + digest32(canonical, 0x9e3779b9);
  }

  function sortAttempts(records) {
    return records.slice().sort(function (a, b) {
      return compareText(a.attemptedAt, b.attemptedAt) || compareText(a.id, b.id);
    });
  }

  function normalizeHistory(history, mode, learnerId, asOf) {
    invariant(Array.isArray(history), "practice history must be an array");
    const ids = new Set();
    return Object.freeze(sortAttempts(history.map(function (record) {
      const normalized = practiceCore.createPracticeAttempt(Object.assign({}, record, { mode }));
      invariant(normalized.learnerId === learnerId, "practice history learner does not match");
      invariant(normalized.attemptedAt <= asOf, "practice history cannot be in the future");
      invariant(!ids.has(normalized.id), "practice history contains a duplicate attempt id");
      ids.add(normalized.id);
      return normalized;
    })));
  }

  function computeFamilyMastery(input) {
    invariant(input && typeof input === "object", "mastery input is required");
    const policy = practiceCore.createPracticePolicy(input.policy);
    const asOf = normalizeIso(input.asOf, "mastery.asOf");
    invariant(core.isNeutralId(input.familyId, "question", policy.mode), "mastery family id must be neutral");
    invariant(core.isNeutralId(input.learnerId, "learner", policy.mode), "mastery learner id must be neutral");
    const attempts = sortAttempts((input.attempts || []).map(function (attempt) {
      const normalized = practiceCore.createPracticeAttempt(Object.assign({}, attempt, { mode: policy.mode }));
      invariant(normalized.familyId === input.familyId, "mastery attempt family does not match");
      invariant(normalized.learnerId === input.learnerId, "mastery attempt learner does not match");
      invariant(normalized.attemptedAt <= asOf, "mastery attempt cannot be in the future");
      return normalized;
    }));

    if (attempts.length === 0) {
      return Object.freeze({
        familyId: input.familyId,
        status: "unseen",
        dueAt: asOf,
        due: true,
        attemptCount: 0,
        correctStreak: 0,
        successfulRelationCount: 0,
        lastAttemptAt: null
      });
    }

    let correctStreak = 0;
    let everMastered = false;
    let streakRelations = new Set();
    let streakBands = new Set();
    attempts.forEach(function (attempt) {
      if (attempt.result === "correct") {
        correctStreak += 1;
        streakRelations.add(attempt.relation);
        streakBands.add(attempt.difficultyBand);
        const hasStandardEvidence = streakBands.has("standard") || streakBands.has("raised");
        if (
          correctStreak >= policy.masteryMinCorrectStreak &&
          streakRelations.size >= policy.masteryMinRelations &&
          hasStandardEvidence
        ) {
          everMastered = true;
        }
      } else {
        correctStreak = 0;
        streakRelations = new Set();
        streakBands = new Set();
      }
    });

    const latest = attempts[attempts.length - 1];
    let status;
    if (everMastered && latest.result === "incorrect") status = "needs_review";
    else if (everMastered && correctStreak >= policy.recoveryCorrectStreak) status = "mastered";
    else if (correctStreak > 0) status = "consolidating";
    else status = "learning";
    const dueAt = addDays(latest.attemptedAt, policy.spacingDays[status]);
    return Object.freeze({
      familyId: input.familyId,
      status,
      dueAt,
      due: dueAt <= asOf,
      attemptCount: attempts.length,
      correctStreak,
      successfulRelationCount: streakRelations.size,
      lastAttemptAt: latest.attemptedAt
    });
  }

  function validateCandidateMetadata(candidate, mode) {
    practiceCore.assertPracticeMetadataOnly(candidate);
    const gateReport = validation.evaluateQuestionGates(candidate);
    const issues = gateReport.issues.slice();
    if (!candidate || candidate.mode !== mode) issues.push("practice_candidate.mode_mismatch");
    if (!candidate || !candidate.lineage || !practiceCore.RELATION_ORDER.includes(candidate.lineage.relation)) {
      issues.push("practice_candidate.relation_invalid");
    }
    return Object.freeze({
      eligible: issues.length === 0,
      issues: Object.freeze(Array.from(new Set(issues)).sort())
    });
  }

  function createFamilyPool(candidates, mode) {
    invariant(Array.isArray(candidates), "practice candidates must be an array");
    const ids = new Set();
    const blockedCandidates = [];
    const byFamily = new Map();
    candidates.forEach(function (candidate) {
      invariant(candidate && typeof candidate === "object", "practice candidate must be an object");
      invariant(!ids.has(candidate.id), "practice candidates contain a duplicate question id");
      ids.add(candidate.id);
      const report = validateCandidateMetadata(candidate, mode);
      if (!report.eligible) {
        blockedCandidates.push(Object.freeze({ questionId: candidate.id || null, issues: report.issues }));
        return;
      }
      const familyId = candidate.variant.familyId;
      if (!byFamily.has(familyId)) byFamily.set(familyId, []);
      byFamily.get(familyId).push(candidate);
    });

    const eligibleFamilies = [];
    const blockedFamilies = [];
    Array.from(byFamily.keys()).sort(compareText).forEach(function (familyId) {
      const familyCandidates = byFamily.get(familyId).slice().sort(function (a, b) {
        return compareText(a.id, b.id);
      });
      const relations = new Set(familyCandidates.map(function (candidate) { return candidate.lineage.relation; }));
      const sourceExamIds = new Set(familyCandidates.map(function (candidate) { return candidate.lineage.sourceExamId; }));
      const questionTypeIds = new Set(familyCandidates.map(function (candidate) { return candidate.lineage.questionTypeId; }));
      const issues = [];
      practiceCore.RELATION_ORDER.forEach(function (relation) {
        if (!relations.has(relation)) issues.push(`practice_chain.${relation}_missing_or_unapproved`);
      });
      core.DIFFICULTY_BANDS.forEach(function (band) {
        if (!familyCandidates.some(function (candidate) { return candidate.difficultyBand === band; })) {
          issues.push(`practice_difficulty.${band}_missing_or_unapproved`);
        }
      });
      if (sourceExamIds.size !== 1) issues.push("practice_chain.source_exam_mismatch");
      if (questionTypeIds.size !== 1) issues.push("practice_chain.question_type_mismatch");
      if (issues.length) {
        blockedFamilies.push(Object.freeze({ familyId, issues: Object.freeze(issues.sort()) }));
      } else {
        eligibleFamilies.push(Object.freeze({ familyId, candidates: Object.freeze(familyCandidates) }));
      }
    });

    return Object.freeze({
      eligibleFamilies: Object.freeze(eligibleFamilies),
      blockedCandidates: Object.freeze(blockedCandidates.sort(function (a, b) {
        return compareText(a.questionId, b.questionId);
      })),
      blockedFamilies: Object.freeze(blockedFamilies)
    });
  }

  function chooseTargetRelation(policy, attempts) {
    const counts = new Map(policy.relationOrder.map(function (relation) { return [relation, 0]; }));
    const lastAt = new Map(policy.relationOrder.map(function (relation) { return [relation, null]; }));
    attempts.forEach(function (attempt) {
      counts.set(attempt.relation, counts.get(attempt.relation) + 1);
      lastAt.set(attempt.relation, attempt.attemptedAt);
    });
    const firstMissing = policy.relationOrder.find(function (relation) { return counts.get(relation) === 0; });
    if (firstMissing) return Object.freeze({ relation: firstMissing, firstPass: true });
    const relation = policy.relationOrder.slice().sort(function (a, b) {
      return counts.get(a) - counts.get(b) ||
        compareText(lastAt.get(a), lastAt.get(b)) ||
        policy.relationOrder.indexOf(a) - policy.relationOrder.indexOf(b);
    })[0];
    return Object.freeze({ relation, firstPass: false });
  }

  function lastAttemptForQuestion(attempts, questionId) {
    const matches = attempts.filter(function (attempt) { return attempt.questionId === questionId; });
    return matches.length ? matches[matches.length - 1].attemptedAt : null;
  }

  function chooseCandidateForFamily(family, familyAttempts, mastery, policy, asOf) {
    const targetRelation = chooseTargetRelation(policy, familyAttempts);
    const targetDifficulty = policy.difficultyByMastery[mastery.status];
    const cutoff = Date.parse(asOf) - policy.exactRepeatCooldownDays * DAY_MS;
    let pool = family.candidates.filter(function (candidate) {
      const lastAt = lastAttemptForQuestion(familyAttempts, candidate.id);
      return lastAt == null || Date.parse(lastAt) <= cutoff;
    });
    if (targetRelation.firstPass) {
      pool = pool.filter(function (candidate) { return candidate.lineage.relation === targetRelation.relation; });
    }
    if (!pool.length) return null;

    const relationIndex = new Map(policy.relationOrder.map(function (relation, index) { return [relation, index]; }));
    const bandIndex = new Map(core.DIFFICULTY_BANDS.map(function (band, index) { return [band, index]; }));
    const targetRelationIndex = relationIndex.get(targetRelation.relation);
    const targetBandIndex = bandIndex.get(targetDifficulty);
    pool.sort(function (a, b) {
      const aRelationDistance = Math.abs(relationIndex.get(a.lineage.relation) - targetRelationIndex);
      const bRelationDistance = Math.abs(relationIndex.get(b.lineage.relation) - targetRelationIndex);
      const aBandDistance = Math.abs(bandIndex.get(a.difficultyBand) - targetBandIndex);
      const bBandDistance = Math.abs(bandIndex.get(b.difficultyBand) - targetBandIndex);
      const aLast = lastAttemptForQuestion(familyAttempts, a.id) || "";
      const bLast = lastAttemptForQuestion(familyAttempts, b.id) || "";
      return aRelationDistance - bRelationDistance ||
        aBandDistance - bBandDistance ||
        compareText(aLast, bLast) ||
        compareText(a.id, b.id);
    });
    return pool[0];
  }

  function createCounter(keys) {
    const counter = {};
    keys.forEach(function (key) { counter[key] = 0; });
    return counter;
  }

  function buildPracticeSetPlan(input) {
    invariant(input && typeof input === "object", "practice plan input is required");
    const policy = practiceCore.createPracticePolicy(input.policy);
    const mode = String(input.mode || policy.mode).toUpperCase();
    invariant(mode === policy.mode, "practice plan mode must match policy");
    invariant(core.isNeutralId(input.learnerId, "learner", mode), "practice learner id must be neutral");
    const asOf = normalizeIso(input.asOf, "practicePlan.asOf");
    const history = normalizeHistory(input.history || [], mode, input.learnerId, asOf);
    const familyPool = createFamilyPool(input.candidates || [], mode);
    const attemptsByFamily = new Map();
    history.forEach(function (attempt) {
      if (!attemptsByFamily.has(attempt.familyId)) attemptsByFamily.set(attempt.familyId, []);
      attemptsByFamily.get(attempt.familyId).push(attempt);
    });

    const familyEntries = familyPool.eligibleFamilies.map(function (family) {
      const attempts = attemptsByFamily.get(family.familyId) || [];
      const mastery = computeFamilyMastery({
        familyId: family.familyId,
        learnerId: input.learnerId,
        attempts,
        policy,
        asOf
      });
      if (!mastery.due) return null;
      const candidate = chooseCandidateForFamily(family, attempts, mastery, policy, asOf);
      if (!candidate) return null;
      return Object.freeze({
        familyId: family.familyId,
        mastery,
        candidate,
        detailCode: candidate.curriculum.detail.code
      });
    }).filter(Boolean).sort(function (a, b) {
      return MASTERY_PRIORITY[a.mastery.status] - MASTERY_PRIORITY[b.mastery.status] ||
        compareText(a.mastery.dueAt, b.mastery.dueAt) ||
        compareText(a.familyId, b.familyId);
    });

    const selectedEntries = [];
    const selectedFamilies = new Set();
    const detailCounts = new Map();
    function canSelect(entry, requireNewDetail) {
      if (selectedEntries.length >= policy.setSize) return false;
      if (selectedFamilies.has(entry.familyId)) return false;
      const current = detailCounts.get(entry.detailCode) || 0;
      if (current >= policy.maxPerDetail) return false;
      if (requireNewDetail && current > 0) return false;
      return true;
    }
    function select(entry) {
      selectedEntries.push(entry);
      selectedFamilies.add(entry.familyId);
      detailCounts.set(entry.detailCode, (detailCounts.get(entry.detailCode) || 0) + 1);
    }

    familyEntries.forEach(function (entry) {
      if (detailCounts.size < policy.minDistinctDetails && canSelect(entry, true)) select(entry);
    });
    familyEntries.forEach(function (entry) {
      if (canSelect(entry, false)) select(entry);
    });

    const items = Object.freeze(selectedEntries.map(function (entry, index) {
      return Object.freeze({
        position: index + 1,
        questionId: entry.candidate.id,
        familyId: entry.familyId,
        relation: entry.candidate.lineage.relation,
        difficultyBand: entry.candidate.difficultyBand,
        curriculumKey: entry.candidate.curriculum.key,
        detailCode: entry.detailCode,
        masteryBefore: entry.mastery.status,
        dueAt: entry.mastery.dueAt,
        scheduledReason: entry.mastery.attemptCount === 0 ? "initial" : "spaced_reattempt"
      });
    }));

    const issues = [];
    if (items.length < policy.setSize) {
      issues.push(Object.freeze({ code: "practice_set.insufficient_eligible_questions", context: `${items.length}/${policy.setSize}` }));
    }
    if (detailCounts.size < policy.minDistinctDetails) {
      issues.push(Object.freeze({ code: "practice_set.insufficient_detail_diversity", context: `${detailCounts.size}/${policy.minDistinctDetails}` }));
    }
    issues.sort(function (a, b) {
      return compareText(`${a.code}:${a.context}`, `${b.code}:${b.context}`);
    });

    const selectionDigest = stableSelectionDigest(items.map(function (item) { return item.questionId; }));
    const stableKey = [
      "practice",
      asOf.replace(/[^0-9A-Z]/gi, ""),
      policy.version,
      input.learnerId,
      selectionDigest
    ].join(":");
    const practiceSetId = core.createNeutralId("practiceSet", mode, stableKey);
    const byMastery = createCounter(practiceCore.MASTERY_STATUSES);
    const byDifficulty = createCounter(core.DIFFICULTY_BANDS);
    const byRelation = createCounter(practiceCore.RELATION_ORDER);
    items.forEach(function (item) {
      byMastery[item.masteryBefore] += 1;
      byDifficulty[item.difficultyBand] += 1;
      byRelation[item.relation] += 1;
    });
    const eligible = issues.length === 0;
    const plan = Object.freeze({
      id: practiceSetId,
      mode,
      learnerId: input.learnerId,
      writer: core.WRITER,
      policyId: policy.id,
      policyVersion: policy.version,
      plannedAt: asOf,
      releaseStatus: eligible ? "approval_required" : "blocked",
      eligible,
      issues: Object.freeze(issues),
      items,
      summary: Object.freeze({
        requestedCount: policy.setSize,
        selectedCount: items.length,
        distinctFamilies: selectedFamilies.size,
        distinctDetails: detailCounts.size,
        blockedCandidateCount: familyPool.blockedCandidates.length,
        blockedFamilyCount: familyPool.blockedFamilies.length,
        byMastery: Object.freeze(byMastery),
        byDifficulty: Object.freeze(byDifficulty),
        byRelation: Object.freeze(byRelation)
      })
    });
    practiceCore.assertPracticeMetadataOnly(plan);
    return plan;
  }

  function releasePracticeSet(plan, approvalInput) {
    practiceCore.assertPracticeMetadataOnly(plan);
    invariant(plan && plan.eligible === true, "blocked practice plan cannot be released");
    invariant(plan.releaseStatus === "approval_required", "practice plan is not awaiting approval");
    invariant(core.isNeutralId(plan.id, "practiceSet", plan.mode), "practice plan id is invalid");
    invariant(Array.isArray(plan.items) && plan.items.length > 0, "practice plan must contain items");
    invariant(new Set(plan.items.map(function (item) { return item.questionId; })).size === plan.items.length, "practice plan repeats a question");
    invariant(new Set(plan.items.map(function (item) { return item.familyId; })).size === plan.items.length, "practice plan repeats a family");
    const approval = practiceCore.createPracticeSetApproval(Object.assign({ mode: plan.mode }, approvalInput));
    invariant(approval.practiceSetId === plan.id, "practice approval target does not match");
    invariant(approval.status === "approved", "practice plan does not have user approval");
    const released = Object.freeze(Object.assign({}, plan, {
      releaseStatus: "released",
      approval
    }));
    practiceCore.assertPracticeMetadataOnly(released);
    return released;
  }

  return Object.freeze({
    DAY_MS,
    MASTERY_PRIORITY,
    stableSelectionDigest,
    computeFamilyMastery,
    validateCandidateMetadata,
    buildPracticeSetPlan,
    releasePracticeSet
  });
});
