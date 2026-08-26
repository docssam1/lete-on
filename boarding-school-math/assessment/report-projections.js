(function (root, factory) {
  const engine = typeof module === "object" && module.exports
    ? require("./diagnostic-engine.js")
    : root.GFIELDDiagnosticEngine;
  const api = factory(engine);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDDiagnosticReportProjections = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (engine) {
  "use strict";

  if (!engine) throw new Error("GFIELDDiagnosticEngine is required");

  const SCHEMA_VERSION = "gfield-diagnostic-report-projection-v1";
  const FORBIDDEN_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "solution", "rubric",
    "privatepayload", "privatescoring", "scoringspec", "acceptedalternatives"
  ]);
  const STATUS_COPY = Object.freeze({
    "needs-more-learning": Object.freeze({
      ko: "우선 보완 학습이 필요합니다.", en: "Targeted learning is needed first.", "zh-Hans": "需要先进行针对性学习。"
    }),
    "needs-more-evidence": Object.freeze({
      ko: "추가 학습 근거와 교사 검토가 필요합니다.", en: "Additional learning evidence and teacher review are needed.", "zh-Hans": "需要补充学习证据和教师审核。"
    }),
    "eligible-for-server-verification": Object.freeze({
      ko: "학교의 최종 확인을 위해 제출할 수 있습니다.", en: "This may be submitted for the school's final verification.", "zh-Hans": "可提交学校进行最终核验。"
    })
  });
  const ROUTING_MODES = Object.freeze(["repair", "guided-practice", "consolidate"]);
  const CLUSTER_EVIDENCE_STATE = "cluster-range-only-pending-teacher-confirmation";
  const ANALYSIS_FIELDS = Object.freeze([
    "schemaVersion", "blueprintId", "blueprintVersion", "learnerId", "policy", "score", "domains", "clusters",
    "itemFeedback", "lessonPriorities", "clusterPriorities", "promotionReview"
  ]);
  const POLICY_SNAPSHOT_FIELDS = Object.freeze([
    "id", "version", "schoolId", "programId", "targetGrade", "effectiveFrom", "claimsNationalOfficialCut"
  ]);
  const SCORE_FIELDS = Object.freeze(["earnedPoints", "maxPoints", "percentage", "performanceBand"]);
  const DOMAIN_FIELDS = Object.freeze(["domainId", "earnedPoints", "maxPoints", "itemCount", "errorCounts", "percentage"]);
  const CLUSTER_FIELDS = Object.freeze([
    "unitId", "clusterId", "standardRange", "domainId", "skillIds", "earnedPoints", "maxPoints", "itemCount",
    "errorCounts", "difficultyEvidence", "percentage", "evidenceState"
  ]);
  const ITEM_FEEDBACK_FIELDS = Object.freeze([
    "itemId", "unitId", "clusterId", "standardRange", "skillId", "domainId", "difficulty", "earnedPoints", "maxPoints",
    "outcomeCode", "errorType", "commentCode", "comment"
  ]);
  const LESSON_PRIORITY_FIELDS = Object.freeze(["domainId", "mode", "percentage", "errorCounts"]);
  const CLUSTER_PRIORITY_FIELDS = Object.freeze([
    "unitId", "clusterId", "standardRange", "domainId", "skillIds", "mode", "percentage", "itemCount", "errorCounts",
    "difficultyEvidence", "evidenceState"
  ]);
  const PROMOTION_REVIEW_FIELDS = Object.freeze([
    "status", "automaticPromotion", "requiresServerAuthorization", "serverAuthorizationVerified", "decisionAuthority", "blockers",
    "missingEvidence", "lowDomainIds", "prerequisiteGapCount", "boundEvidenceRecordIds"
  ]);
  const ID_PATTERNS = Object.freeze({
    blueprintId: /^asm-bdg-[a-z0-9-]{6,64}$/,
    learnerId: /^lrm-bdg-[a-z0-9]{16}$/,
    policyId: /^pol-bdg-[a-z0-9-]{4,64}$/,
    schoolId: /^sch-bdg-[a-z0-9]{16}$/,
    programId: /^[a-z0-9][a-z0-9-]{2,63}$/,
    itemId: /^qst-bnk-[a-z0-9]{16}$/,
    unitId: /^[a-z0-9][a-z0-9-]{2,127}$/,
    clusterId: /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/,
    standardRange: /^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/,
    skillId: /^[a-z0-9][a-z0-9:-]{2,127}$/,
    domainId: /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/,
    evidenceId: /^evd-bdg-[a-z0-9]{16}$/
  });
  const FORBIDDEN_IDENTIFIER_TEXT = /(?:answer|correct|solution|rubric|정답|답|正确答案|答案|풀이|解答)/iu;

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
  function denseArray(value, field) {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length || hasAccessors(value)) {
      fail(`${field} must be an array`);
    }
    const keys = Object.keys(value);
    if (keys.length !== value.length || keys.some(function (key, index) { return key !== String(index); })) fail(`${field} must not have unsupported properties`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not have empty slots`);
    }
    return value;
  }
  function requireText(value, field) {
    if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} is required`);
    return value;
  }
  function requirePatternText(value, field, pattern) {
    requireText(value, field);
    if (!pattern.test(value) || FORBIDDEN_IDENTIFIER_TEXT.test(value)) fail(`${field} is invalid`);
    return value;
  }
  function requireRealDate(value, field) {
    requirePatternText(value, field, /^\d{4}-\d{2}-\d{2}$/);
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail(`${field} is invalid`);
    return value;
  }
  function requireFiniteNonNegative(value, field) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(`${field} is invalid`);
    return value;
  }
  function knownFields(value, fields, field) {
    if (!isRecord(value)) fail(`${field} is invalid`);
    if (Object.getOwnPropertySymbols(value).length) fail(`${field} has unsupported fields`);
    const allowed = new Set(fields);
    if (Object.keys(value).some(function (key) { return !allowed.has(key); })) fail(`${field} has unsupported fields`);
    return value;
  }
  function normalizedKey(value) {
    return String(value).normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
  }
  function round1(value) { return Math.round((value + Number.EPSILON) * 10) / 10; }
  function sameJson(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
  function validateLocalizedCopy(value, expected, field) {
    knownFields(value, ["ko", "en", "zh-Hans"], field);
    ["ko", "en", "zh-Hans"].forEach(function (locale) {
      requireText(value[locale], `${field}.${locale}`);
      if (expected && value[locale] !== expected[locale]) fail(`${field}.${locale} is invalid`);
    });
  }
  function validateTextArray(value, field, allowed) {
    const entries = denseArray(value, field);
    const seen = new Set();
    entries.forEach(function (entry, index) {
      requireText(entry, `${field}[${index}]`);
      if (seen.has(entry) || (allowed && !allowed.has(entry))) fail(`${field} is invalid`);
      seen.add(entry);
    });
    return entries;
  }
  function noPrivateKeys(value, field) {
    if (Array.isArray(value)) {
      denseArray(value, field).forEach(function (entry, index) { noPrivateKeys(entry, `${field}[${index}]`); });
      return;
    }
    if (value && typeof value === "object" && !isRecord(value)) fail(`${field} has an unsupported object type`);
    if (!isRecord(value)) return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.has(normalizedKey(key))) fail(`${field}.${key} is private answer data`);
      noPrivateKeys(value[key], `${field}.${key}`);
    });
  }
  function errorBreakdown(errorCounts) {
    if (!isRecord(errorCounts)) fail("domain.errorCounts must be an object");
    return Object.freeze(Object.keys(errorCounts).sort(function (left, right) {
      return errorCounts[right] - errorCounts[left] || left.localeCompare(right);
    }).map(function (errorType) {
      if (!engine.ERROR_TYPES.includes(errorType) || !Number.isInteger(errorCounts[errorType]) || errorCounts[errorType] < 1) {
        fail("domain.errorCounts contains an invalid error type or count");
      }
      return Object.freeze({ errorType, count: errorCounts[errorType] });
    }));
  }
  function validateDifficultyEvidence(value, field) {
    if (!isRecord(value) || Object.keys(value).length !== engine.DIFFICULTIES.length ||
      engine.DIFFICULTIES.some(function (difficulty) { return !Object.prototype.hasOwnProperty.call(value, difficulty); })) {
      fail(`${field} is invalid`);
    }
    engine.DIFFICULTIES.forEach(function (difficulty) {
      const evidence = value[difficulty];
      knownFields(evidence, ["earnedPoints", "maxPoints", "itemCount", "percentage"], `${field}.${difficulty}`);
      ["earnedPoints", "maxPoints"].forEach(function (key) { requireFiniteNonNegative(evidence[key], `${field}.${difficulty}.${key}`); });
      if (!Number.isInteger(evidence.itemCount) || evidence.itemCount < 0 || evidence.maxPoints < evidence.earnedPoints) {
        fail(`${field}.${difficulty} is invalid`);
      }
      if (evidence.itemCount === 0) {
        if (evidence.earnedPoints !== 0 || evidence.maxPoints !== 0 || evidence.percentage !== null) fail(`${field}.${difficulty} is invalid`);
      } else {
        requireFiniteNonNegative(evidence.percentage, `${field}.${difficulty}.percentage`);
        if (!evidence.maxPoints || evidence.percentage !== round1(100 * evidence.earnedPoints / evidence.maxPoints)) {
          fail(`${field}.${difficulty} is invalid`);
        }
      }
    });
    return true;
  }
  function validatePriority(priority, field, expectedId, idField) {
    if (!isRecord(priority)) fail(`${field} is invalid`);
    requirePatternText(priority[idField], `${field}.${idField}`, idField === "domainId" ? ID_PATTERNS.domainId : ID_PATTERNS.clusterId);
    if (expectedId != null && priority[idField] !== expectedId) fail(`${field}.${idField} is invalid`);
    if (!ROUTING_MODES.includes(priority.mode)) fail(`${field}.mode is invalid`);
    requireFiniteNonNegative(priority.percentage, `${field}.percentage`);
    errorBreakdown(priority.errorCounts);
    return true;
  }
  function sameErrorCounts(left, right) {
    return JSON.stringify(errorBreakdown(left)) === JSON.stringify(errorBreakdown(right));
  }
  function sameDifficultyEvidence(left, right) {
    return engine.DIFFICULTIES.every(function (difficulty) {
      const leftEvidence = left[difficulty];
      const rightEvidence = right[difficulty];
      return leftEvidence.earnedPoints === rightEvidence.earnedPoints &&
        leftEvidence.maxPoints === rightEvidence.maxPoints &&
        leftEvidence.itemCount === rightEvidence.itemCount &&
        leftEvidence.percentage === rightEvidence.percentage;
    });
  }
  function validateScore(score, field) {
    knownFields(score, SCORE_FIELDS, field);
    ["earnedPoints", "maxPoints", "percentage"].forEach(function (key) { requireFiniteNonNegative(score[key], `${field}.${key}`); });
    requireText(score.performanceBand, `${field}.performanceBand`);
    if (!/^[a-z][a-z0-9-]{1,31}$/.test(score.performanceBand) || FORBIDDEN_IDENTIFIER_TEXT.test(score.performanceBand)) {
      fail(`${field}.performanceBand is invalid`);
    }
    if (!score.maxPoints || score.earnedPoints > score.maxPoints || score.percentage > 100 ||
      score.percentage !== round1(100 * score.earnedPoints / score.maxPoints)) {
      fail(`${field} is invalid`);
    }
  }
  function validatePolicySnapshot(policy) {
    knownFields(policy, POLICY_SNAPSHOT_FIELDS, "analysis report policy");
    requirePatternText(policy.id, "analysis report policy.id", ID_PATTERNS.policyId);
    requirePatternText(policy.schoolId, "analysis report policy.schoolId", ID_PATTERNS.schoolId);
    requirePatternText(policy.programId, "analysis report policy.programId", ID_PATTERNS.programId);
    requireRealDate(policy.effectiveFrom, "analysis report policy.effectiveFrom");
    if (!Number.isInteger(policy.version) || policy.version < 1 ||
      !(policy.targetGrade === "K" || (Number.isInteger(policy.targetGrade) && policy.targetGrade >= 1 && policy.targetGrade <= 8)) ||
      policy.claimsNationalOfficialCut !== false) {
      fail("analysis report policy is invalid");
    }
  }
  function validateItemFeedback(item, field) {
    knownFields(item, ITEM_FEEDBACK_FIELDS, field);
    requirePatternText(item.itemId, `${field}.itemId`, ID_PATTERNS.itemId);
    requirePatternText(item.unitId, `${field}.unitId`, ID_PATTERNS.unitId);
    requirePatternText(item.clusterId, `${field}.clusterId`, ID_PATTERNS.clusterId);
    requirePatternText(item.standardRange, `${field}.standardRange`, ID_PATTERNS.standardRange);
    requirePatternText(item.skillId, `${field}.skillId`, ID_PATTERNS.skillId);
    requirePatternText(item.domainId, `${field}.domainId`, ID_PATTERNS.domainId);
    ["difficulty", "outcomeCode", "commentCode"].forEach(function (key) { requireText(item[key], `${field}.${key}`); });
    ["earnedPoints", "maxPoints"].forEach(function (key) { requireFiniteNonNegative(item[key], `${field}.${key}`); });
    if (!engine.DIFFICULTIES.includes(item.difficulty) || !item.maxPoints || item.earnedPoints > item.maxPoints) {
      fail(`${field} is invalid`);
    }
    const fullCredit = item.earnedPoints === item.maxPoints;
    const partialCredit = item.earnedPoints > 0 && !fullCredit;
    const expectedOutcome = fullCredit ? "full-credit" : partialCredit ? "partial-credit" : "no-credit";
    const expectedCommentCode = fullCredit ? "secure" : item.errorType;
    if (item.outcomeCode !== expectedOutcome || (fullCredit ? item.errorType !== null : !engine.ERROR_TYPES.includes(item.errorType)) ||
      item.commentCode !== expectedCommentCode || !engine.FEEDBACK[item.commentCode]) {
      fail(`${field} is invalid`);
    }
    validateLocalizedCopy(item.comment, engine.FEEDBACK[item.commentCode], `${field}.comment`);
  }
  function aggregateItemFeedback(items) {
    const domains = new Map();
    const clusters = new Map();
    const itemIds = new Set();
    items.forEach(function (item, index) {
      const field = `analysis report item feedback[${index}]`;
      validateItemFeedback(item, field);
      if (itemIds.has(item.itemId)) fail("analysis report item feedback contains duplicate item IDs");
      itemIds.add(item.itemId);
      if (!domains.has(item.domainId)) domains.set(item.domainId, {
        earnedPoints: 0, maxPoints: 0, itemCount: 0, errorCounts: {}
      });
      if (!clusters.has(item.clusterId)) clusters.set(item.clusterId, {
        unitId: item.unitId,
        standardRange: item.standardRange,
        domainId: item.domainId,
        skillIds: new Set(),
        earnedPoints: 0,
        maxPoints: 0,
        itemCount: 0,
        errorCounts: {},
        difficultyEvidence: Object.fromEntries(engine.DIFFICULTIES.map(function (difficulty) {
          return [difficulty, { earnedPoints: 0, maxPoints: 0, itemCount: 0 }];
        }))
      });
      const domain = domains.get(item.domainId);
      const cluster = clusters.get(item.clusterId);
      if (cluster.unitId !== item.unitId || cluster.standardRange !== item.standardRange || cluster.domainId !== item.domainId) {
        fail(`${field} has inconsistent cluster lineage`);
      }
      cluster.skillIds.add(item.skillId);
      [domain, cluster].forEach(function (bucket) {
        bucket.earnedPoints += item.earnedPoints;
        bucket.maxPoints += item.maxPoints;
        bucket.itemCount += 1;
        if (item.errorType) bucket.errorCounts[item.errorType] = (bucket.errorCounts[item.errorType] || 0) + 1;
      });
      const difficulty = cluster.difficultyEvidence[item.difficulty];
      difficulty.earnedPoints += item.earnedPoints;
      difficulty.maxPoints += item.maxPoints;
      difficulty.itemCount += 1;
    });
    clusters.forEach(function (cluster) {
      cluster.skillIds = Array.from(cluster.skillIds).sort();
      cluster.difficultyEvidence = Object.fromEntries(engine.DIFFICULTIES.map(function (difficulty) {
        const evidence = cluster.difficultyEvidence[difficulty];
        return [difficulty, {
          earnedPoints: evidence.earnedPoints,
          maxPoints: evidence.maxPoints,
          itemCount: evidence.itemCount,
          percentage: evidence.itemCount ? round1(100 * evidence.earnedPoints / evidence.maxPoints) : null
        }];
      }));
    });
    return Object.freeze({ domains, clusters });
  }
  function validatePromotionReview(review, policy, domainsById, itemFeedback) {
    knownFields(review, PROMOTION_REVIEW_FIELDS, "analysis report promotion review");
    if (!STATUS_COPY[review.status] || review.automaticPromotion !== false || review.requiresServerAuthorization !== true ||
      review.serverAuthorizationVerified !== false || review.decisionAuthority !== policy.id ||
      !Number.isInteger(review.prerequisiteGapCount) || review.prerequisiteGapCount < 0) {
      fail("analysis report promotion review is invalid");
    }
    requirePatternText(review.decisionAuthority, "analysis report promotion review.decisionAuthority", ID_PATTERNS.policyId);
    const blockerCodes = new Set(["overall-score-below-policy", "domain-floor-not-met", "prerequisite-gaps-exceed-policy"]);
    const evidenceTypes = new Set(engine.EVIDENCE_TYPES.filter(function (type) { return type !== "diagnostic"; }));
    validateTextArray(review.blockers, "analysis report promotion blockers", blockerCodes);
    validateTextArray(review.missingEvidence, "analysis report promotion missing evidence", evidenceTypes);
    const lowDomainIds = validateTextArray(review.lowDomainIds, "analysis report promotion low domain IDs");
    lowDomainIds.forEach(function (domainId) {
      if (!domainsById.has(domainId)) fail("analysis report promotion low domain IDs are invalid");
    });
    validateTextArray(review.boundEvidenceRecordIds, "analysis report promotion evidence record IDs").forEach(function (recordId) {
      if (!ID_PATTERNS.evidenceId.test(recordId)) fail("analysis report promotion evidence record IDs are invalid");
    });
    const prerequisiteGapCount = itemFeedback.filter(function (item) { return item.errorType === "prerequisite-gap"; }).length;
    if (review.prerequisiteGapCount !== prerequisiteGapCount ||
      review.blockers.includes("domain-floor-not-met") !== (lowDomainIds.length > 0) ||
      (review.prerequisiteGapCount === 0 && review.blockers.includes("prerequisite-gaps-exceed-policy"))) {
      fail("analysis report promotion review is invalid");
    }
    const expectedStatus = review.blockers.length ? "needs-more-learning" :
      review.missingEvidence.length ? "needs-more-evidence" : "eligible-for-server-verification";
    if (review.status !== expectedStatus) fail("analysis report promotion status is invalid");
  }
  function validateAnalysisReport(report) {
    if (!isRecord(report)) fail("analysis report must be an object");
    knownFields(report, ANALYSIS_FIELDS, "analysis report");
    if (report.schemaVersion !== engine.SCHEMA_VERSION) fail("analysis report schema version is unsupported");
    requirePatternText(report.blueprintId, "analysis report blueprintId", ID_PATTERNS.blueprintId);
    if (!Number.isInteger(report.blueprintVersion) || report.blueprintVersion < 1) fail("analysis report blueprintVersion is invalid");
    requirePatternText(report.learnerId, "analysis report learnerId", ID_PATTERNS.learnerId);
    validatePolicySnapshot(report.policy);
    validateScore(report.score, "analysis report score");
    const domainIds = new Set();
    const domainsById = new Map();
    denseArray(report.domains, "analysis report domains").forEach(function (domain) {
      knownFields(domain, DOMAIN_FIELDS, "analysis report domain");
      requirePatternText(domain.domainId, "analysis report domainId", ID_PATTERNS.domainId);
      if (domainIds.has(domain.domainId)) fail("analysis report domains contain duplicates");
      domainIds.add(domain.domainId);
      ["earnedPoints", "maxPoints", "percentage"].forEach(function (field) { requireFiniteNonNegative(domain[field], `analysis report domain.${field}`); });
      if (!Number.isInteger(domain.itemCount) || domain.itemCount < 1 || !domain.maxPoints || domain.maxPoints < domain.earnedPoints ||
        domain.percentage > 100 || domain.percentage !== round1(100 * domain.earnedPoints / domain.maxPoints)) fail("analysis report domain is invalid");
      errorBreakdown(domain.errorCounts);
      domainsById.set(domain.domainId, domain);
    });
    const clusterIds = new Set();
    const clustersById = new Map();
    denseArray(report.clusters, "analysis report clusters").forEach(function (cluster) {
      knownFields(cluster, CLUSTER_FIELDS, "analysis report cluster");
      requirePatternText(cluster.unitId, "analysis report cluster.unitId", ID_PATTERNS.unitId);
      requirePatternText(cluster.clusterId, "analysis report cluster.clusterId", ID_PATTERNS.clusterId);
      requirePatternText(cluster.standardRange, "analysis report cluster.standardRange", ID_PATTERNS.standardRange);
      requirePatternText(cluster.domainId, "analysis report cluster.domainId", ID_PATTERNS.domainId);
      requireText(cluster.evidenceState, "analysis report cluster.evidenceState");
      if (cluster.evidenceState !== CLUSTER_EVIDENCE_STATE || clusterIds.has(cluster.clusterId) || !domainIds.has(cluster.domainId)) {
        fail("analysis report cluster is invalid");
      }
      clusterIds.add(cluster.clusterId);
      const skillIds = validateTextArray(cluster.skillIds, "analysis report cluster skill IDs");
      skillIds.forEach(function (skillId, index) { requirePatternText(skillId, `analysis report cluster skill IDs[${index}]`, ID_PATTERNS.skillId); });
      if (!skillIds.length || skillIds.some(function (skillId, index) { return index && skillIds[index - 1].localeCompare(skillId) >= 0; })) {
        fail("analysis report cluster skill IDs are invalid");
      }
      ["earnedPoints", "maxPoints", "percentage"].forEach(function (field) { requireFiniteNonNegative(cluster[field], `analysis report cluster.${field}`); });
      if (!Number.isInteger(cluster.itemCount) || cluster.itemCount < 1 || !cluster.maxPoints || cluster.maxPoints < cluster.earnedPoints ||
        cluster.percentage > 100 || cluster.percentage !== round1(100 * cluster.earnedPoints / cluster.maxPoints)) fail("analysis report cluster is invalid");
      errorBreakdown(cluster.errorCounts);
      validateDifficultyEvidence(cluster.difficultyEvidence, "analysis report cluster difficulty evidence");
      clustersById.set(cluster.clusterId, cluster);
    });
    const priorityDomains = new Set();
    denseArray(report.lessonPriorities, "analysis report lesson priorities").forEach(function (priority) {
      knownFields(priority, LESSON_PRIORITY_FIELDS, "analysis report lesson priority");
      validatePriority(priority, "analysis report lesson priority", null, "domainId");
      if (!domainIds.has(priority.domainId) || priorityDomains.has(priority.domainId)) fail("analysis report lesson priority is invalid");
      const domain = domainsById.get(priority.domainId);
      if (priority.percentage !== domain.percentage || !sameErrorCounts(priority.errorCounts, domain.errorCounts)) {
        fail("analysis report lesson priority is invalid");
      }
      priorityDomains.add(priority.domainId);
    });
    if (priorityDomains.size !== domainIds.size) fail("analysis report lesson priorities are incomplete");
    const priorityClusters = new Set();
    denseArray(report.clusterPriorities, "analysis report cluster priorities").forEach(function (priority) {
      knownFields(priority, CLUSTER_PRIORITY_FIELDS, "analysis report cluster priority");
      validatePriority(priority, "analysis report cluster priority", null, "clusterId");
      requirePatternText(priority.unitId, "analysis report cluster priority.unitId", ID_PATTERNS.unitId);
      requirePatternText(priority.standardRange, "analysis report cluster priority.standardRange", ID_PATTERNS.standardRange);
      requirePatternText(priority.domainId, "analysis report cluster priority.domainId", ID_PATTERNS.domainId);
      requireText(priority.evidenceState, "analysis report cluster priority.evidenceState");
      if (!clusterIds.has(priority.clusterId) || priorityClusters.has(priority.clusterId) || priority.evidenceState !== CLUSTER_EVIDENCE_STATE) {
        fail("analysis report cluster priority is invalid");
      }
      const cluster = clustersById.get(priority.clusterId);
      if (priority.unitId !== cluster.unitId || priority.standardRange !== cluster.standardRange || priority.domainId !== cluster.domainId ||
        priority.percentage !== cluster.percentage || priority.itemCount !== cluster.itemCount ||
        JSON.stringify(priority.skillIds) !== JSON.stringify(cluster.skillIds) || !sameErrorCounts(priority.errorCounts, cluster.errorCounts) ||
        !sameDifficultyEvidence(priority.difficultyEvidence, cluster.difficultyEvidence)) {
        fail("analysis report cluster priority is invalid");
      }
      const skillIds = validateTextArray(priority.skillIds, "analysis report cluster priority skill IDs");
      skillIds.forEach(function (skillId, index) { requirePatternText(skillId, `analysis report cluster priority skill IDs[${index}]`, ID_PATTERNS.skillId); });
      if (!skillIds.length || skillIds.some(function (skillId, index) { return index && skillIds[index - 1].localeCompare(skillId) >= 0; })) {
        fail("analysis report cluster priority skill IDs are invalid");
      }
      if (!Number.isInteger(priority.itemCount) || priority.itemCount < 1) fail("analysis report cluster priority is invalid");
      validateDifficultyEvidence(priority.difficultyEvidence, "analysis report cluster priority difficulty evidence");
      priorityClusters.add(priority.clusterId);
    });
    if (priorityClusters.size !== clusterIds.size) fail("analysis report cluster priorities are incomplete");
    const itemFeedback = denseArray(report.itemFeedback, "analysis report itemFeedback");
    if (!itemFeedback.length) fail("analysis report item feedback is required");
    const aggregates = aggregateItemFeedback(itemFeedback);
    if (aggregates.domains.size !== domainsById.size || aggregates.clusters.size !== clustersById.size) {
      fail("analysis report aggregates are incomplete");
    }
    let earnedPoints = 0;
    let maxPoints = 0;
    aggregates.domains.forEach(function (expected, domainId) {
      const domain = domainsById.get(domainId);
      if (!domain || domain.earnedPoints !== expected.earnedPoints || domain.maxPoints !== expected.maxPoints ||
        domain.itemCount !== expected.itemCount || !sameErrorCounts(domain.errorCounts, expected.errorCounts)) {
        fail("analysis report domain aggregate is invalid");
      }
      earnedPoints += expected.earnedPoints;
      maxPoints += expected.maxPoints;
    });
    aggregates.clusters.forEach(function (expected, clusterId) {
      const cluster = clustersById.get(clusterId);
      if (!cluster || cluster.unitId !== expected.unitId || cluster.standardRange !== expected.standardRange ||
        cluster.domainId !== expected.domainId || JSON.stringify(cluster.skillIds) !== JSON.stringify(expected.skillIds) ||
        cluster.earnedPoints !== expected.earnedPoints || cluster.maxPoints !== expected.maxPoints ||
        cluster.itemCount !== expected.itemCount || !sameErrorCounts(cluster.errorCounts, expected.errorCounts) ||
        !sameDifficultyEvidence(cluster.difficultyEvidence, expected.difficultyEvidence)) {
        fail("analysis report cluster aggregate is invalid");
      }
    });
    if (report.score.earnedPoints !== earnedPoints || report.score.maxPoints !== maxPoints ||
      report.score.percentage !== round1(100 * earnedPoints / maxPoints)) {
      fail("analysis report score aggregate is invalid");
    }
    validatePromotionReview(report.promotionReview, report.policy, domainsById, itemFeedback);
    noPrivateKeys(report, "analysis report");
    return true;
  }
  function projectDomain(domain) {
    return Object.freeze({
      domainId: domain.domainId,
      earnedPoints: domain.earnedPoints,
      maxPoints: domain.maxPoints,
      percentage: domain.percentage,
      errorBreakdown: errorBreakdown(domain.errorCounts)
    });
  }
  function projectFeedback(item, index, includeItemId) {
    const result = {
      questionNumber: index + 1,
      unitId: item.unitId,
      clusterId: item.clusterId,
      standardRange: item.standardRange,
      skillId: item.skillId,
      domainId: item.domainId,
      difficulty: item.difficulty,
      outcomeCode: item.outcomeCode,
      errorType: item.errorType,
      commentCode: item.commentCode,
      comment: Object.freeze({ ko: item.comment.ko, en: item.comment.en, "zh-Hans": item.comment["zh-Hans"] || item.comment.en })
    };
    if (includeItemId) result.itemId = item.itemId;
    return Object.freeze(result);
  }
  function projectPriorities(report) {
    return Object.freeze(report.lessonPriorities.map(function (priority) {
      return Object.freeze({
        domainId: priority.domainId,
        mode: priority.mode,
        percentage: priority.percentage,
        errorBreakdown: errorBreakdown(priority.errorCounts)
      });
    }));
  }
  function projectCluster(cluster) {
    return Object.freeze({
      unitId: cluster.unitId,
      clusterId: cluster.clusterId,
      standardRange: cluster.standardRange,
      domainId: cluster.domainId,
      skillIds: Object.freeze(cluster.skillIds.slice()),
      earnedPoints: cluster.earnedPoints,
      maxPoints: cluster.maxPoints,
      itemCount: cluster.itemCount,
      percentage: cluster.percentage,
      errorBreakdown: errorBreakdown(cluster.errorCounts),
      difficultyEvidence: cluster.difficultyEvidence,
      evidenceState: cluster.evidenceState
    });
  }
  function projectClusterPriorities(report) {
    return Object.freeze(report.clusterPriorities.map(function (priority) {
      return Object.freeze({
        unitId: priority.unitId,
        clusterId: priority.clusterId,
        standardRange: priority.standardRange,
        domainId: priority.domainId,
        skillIds: Object.freeze(priority.skillIds.slice()),
        mode: priority.mode,
        percentage: priority.percentage,
        itemCount: priority.itemCount,
        errorBreakdown: errorBreakdown(priority.errorCounts),
        difficultyEvidence: priority.difficultyEvidence,
        evidenceState: priority.evidenceState
      });
    }));
  }
  function projectPromotion(report, includeInternal) {
    const review = report.promotionReview;
    const result = {
      status: review.status,
      statusMessage: STATUS_COPY[review.status],
      automaticPromotion: false,
      finalDecision: "school-review-required",
      blockers: Object.freeze(review.blockers.slice()),
      missingEvidence: Object.freeze(review.missingEvidence.slice()),
      lowDomainIds: Object.freeze(review.lowDomainIds.slice()),
      prerequisiteGapCount: review.prerequisiteGapCount
    };
    if (includeInternal) {
      result.requiresServerAuthorization = true;
      result.serverAuthorizationVerified = review.serverAuthorizationVerified === true;
      result.boundEvidenceRecordIds = Object.freeze(review.boundEvidenceRecordIds.slice());
    }
    return Object.freeze(result);
  }
  function buildStudentReport(report) {
    validateAnalysisReport(report);
    const projection = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "student",
      deliveryRequirement: "authenticated-owner-only",
      authorizationVerified: false,
      assessment: Object.freeze({ blueprintId: report.blueprintId, blueprintVersion: report.blueprintVersion }),
      score: Object.freeze({ earnedPoints: report.score.earnedPoints, maxPoints: report.score.maxPoints, percentage: report.score.percentage, performanceBand: report.score.performanceBand }),
      domains: Object.freeze(report.domains.map(projectDomain)),
      clusters: Object.freeze(report.clusters.map(projectCluster)),
      itemFeedback: Object.freeze(report.itemFeedback.map(function (item, index) { return projectFeedback(item, index, false); })),
      lessonPriorities: projectPriorities(report),
      clusterPriorities: projectClusterPriorities(report),
      promotionReview: projectPromotion(report, false)
    });
    validateStudentReport(projection);
    return projection;
  }
  function buildTeacherReport(report) {
    validateAnalysisReport(report);
    const projection = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "teacher",
      deliveryRequirement: "authenticated-teacher-or-admin-only",
      authorizationVerified: false,
      assessment: Object.freeze({ blueprintId: report.blueprintId, blueprintVersion: report.blueprintVersion, learnerId: report.learnerId }),
      policy: report.policy,
      score: Object.freeze({ earnedPoints: report.score.earnedPoints, maxPoints: report.score.maxPoints, percentage: report.score.percentage, performanceBand: report.score.performanceBand }),
      domains: Object.freeze(report.domains.map(projectDomain)),
      clusters: Object.freeze(report.clusters.map(projectCluster)),
      itemFeedback: Object.freeze(report.itemFeedback.map(function (item, index) { return projectFeedback(item, index, true); })),
      lessonPriorities: projectPriorities(report),
      clusterPriorities: projectClusterPriorities(report),
      promotionReview: projectPromotion(report, true)
    });
    validateTeacherReport(projection);
    return projection;
  }
  function validateErrorBreakdownList(value, field) {
    const entries = denseArray(value, field);
    const types = new Set();
    entries.forEach(function (entry, index) {
      knownFields(entry, ["errorType", "count"], `${field}[${index}]`);
      if (!engine.ERROR_TYPES.includes(entry.errorType) || !Number.isInteger(entry.count) || entry.count < 1 || types.has(entry.errorType)) {
        fail(`${field}[${index}] is invalid`);
      }
      types.add(entry.errorType);
    });
  }
  function validateProjectedDomain(domain, field) {
    knownFields(domain, ["domainId", "earnedPoints", "maxPoints", "percentage", "errorBreakdown"], field);
    requirePatternText(domain.domainId, `${field}.domainId`, ID_PATTERNS.domainId);
    ["earnedPoints", "maxPoints", "percentage"].forEach(function (key) { requireFiniteNonNegative(domain[key], `${field}.${key}`); });
    if (!domain.maxPoints || domain.earnedPoints > domain.maxPoints || domain.percentage > 100 ||
      domain.percentage !== round1(100 * domain.earnedPoints / domain.maxPoints)) fail(`${field} is invalid`);
    validateErrorBreakdownList(domain.errorBreakdown, `${field}.errorBreakdown`);
  }
  function validateProjectedCluster(cluster, field) {
    knownFields(cluster, [
      "unitId", "clusterId", "standardRange", "domainId", "skillIds", "earnedPoints", "maxPoints", "itemCount", "percentage",
      "errorBreakdown", "difficultyEvidence", "evidenceState"
    ], field);
    requirePatternText(cluster.unitId, `${field}.unitId`, ID_PATTERNS.unitId);
    requirePatternText(cluster.clusterId, `${field}.clusterId`, ID_PATTERNS.clusterId);
    requirePatternText(cluster.standardRange, `${field}.standardRange`, ID_PATTERNS.standardRange);
    requirePatternText(cluster.domainId, `${field}.domainId`, ID_PATTERNS.domainId);
    requireText(cluster.evidenceState, `${field}.evidenceState`);
    const skillIds = validateTextArray(cluster.skillIds, `${field}.skillIds`);
    skillIds.forEach(function (skillId, index) { requirePatternText(skillId, `${field}.skillIds[${index}]`, ID_PATTERNS.skillId); });
    if (!skillIds.length || skillIds.some(function (skillId, index) { return index && skillIds[index - 1].localeCompare(skillId) >= 0; }) ||
      cluster.evidenceState !== CLUSTER_EVIDENCE_STATE) fail(`${field} is invalid`);
    ["earnedPoints", "maxPoints", "percentage"].forEach(function (key) { requireFiniteNonNegative(cluster[key], `${field}.${key}`); });
    if (!Number.isInteger(cluster.itemCount) || cluster.itemCount < 1 || !cluster.maxPoints || cluster.earnedPoints > cluster.maxPoints ||
      cluster.percentage > 100 || cluster.percentage !== round1(100 * cluster.earnedPoints / cluster.maxPoints)) fail(`${field} is invalid`);
    validateErrorBreakdownList(cluster.errorBreakdown, `${field}.errorBreakdown`);
    validateDifficultyEvidence(cluster.difficultyEvidence, `${field}.difficultyEvidence`);
  }
  function validateProjectedFeedback(item, field, includeItemId) {
    const fields = [
      "questionNumber", "unitId", "clusterId", "standardRange", "skillId", "domainId", "difficulty", "outcomeCode", "errorType", "commentCode", "comment"
    ];
    if (includeItemId) fields.push("itemId");
    knownFields(item, fields, field);
    requirePatternText(item.unitId, `${field}.unitId`, ID_PATTERNS.unitId);
    requirePatternText(item.clusterId, `${field}.clusterId`, ID_PATTERNS.clusterId);
    requirePatternText(item.standardRange, `${field}.standardRange`, ID_PATTERNS.standardRange);
    requirePatternText(item.skillId, `${field}.skillId`, ID_PATTERNS.skillId);
    requirePatternText(item.domainId, `${field}.domainId`, ID_PATTERNS.domainId);
    ["difficulty", "outcomeCode", "commentCode"].forEach(function (key) { requireText(item[key], `${field}.${key}`); });
    if (includeItemId) requirePatternText(item.itemId, `${field}.itemId`, ID_PATTERNS.itemId);
    if (!Number.isInteger(item.questionNumber) || item.questionNumber < 1 || !engine.DIFFICULTIES.includes(item.difficulty) ||
      !["full-credit", "partial-credit", "no-credit"].includes(item.outcomeCode)) fail(`${field} is invalid`);
    const isFullCredit = item.outcomeCode === "full-credit";
    if ((isFullCredit ? item.errorType !== null || item.commentCode !== "secure" :
      !engine.ERROR_TYPES.includes(item.errorType) || item.commentCode !== item.errorType) || !engine.FEEDBACK[item.commentCode]) {
      fail(`${field} is invalid`);
    }
    validateLocalizedCopy(item.comment, engine.FEEDBACK[item.commentCode], `${field}.comment`);
  }
  function validateProjectedPromotion(review, audience, domainIds, field) {
    const common = ["status", "statusMessage", "automaticPromotion", "finalDecision", "blockers", "missingEvidence", "lowDomainIds", "prerequisiteGapCount"];
    const fields = audience === "teacher" ? common.concat(["requiresServerAuthorization", "serverAuthorizationVerified", "boundEvidenceRecordIds"]) : common;
    knownFields(review, fields, field);
    if (!STATUS_COPY[review.status] || review.automaticPromotion !== false || review.finalDecision !== "school-review-required" ||
      !Number.isInteger(review.prerequisiteGapCount) || review.prerequisiteGapCount < 0) fail(`${field} is invalid`);
    validateLocalizedCopy(review.statusMessage, STATUS_COPY[review.status], `${field}.statusMessage`);
    const blockerCodes = new Set(["overall-score-below-policy", "domain-floor-not-met", "prerequisite-gaps-exceed-policy"]);
    const evidenceTypes = new Set(engine.EVIDENCE_TYPES.filter(function (type) { return type !== "diagnostic"; }));
    validateTextArray(review.blockers, `${field}.blockers`, blockerCodes);
    validateTextArray(review.missingEvidence, `${field}.missingEvidence`, evidenceTypes);
    const lowDomainIds = validateTextArray(review.lowDomainIds, `${field}.lowDomainIds`);
    lowDomainIds.forEach(function (domainId, index) {
      requirePatternText(domainId, `${field}.lowDomainIds[${index}]`, ID_PATTERNS.domainId);
      if (!domainIds.has(domainId)) fail(`${field}.lowDomainIds is invalid`);
    });
    if (audience === "teacher") {
      if (review.requiresServerAuthorization !== true || review.serverAuthorizationVerified !== false) {
        fail(`${field} is invalid`);
      }
      validateTextArray(review.boundEvidenceRecordIds, `${field}.boundEvidenceRecordIds`).forEach(function (recordId) {
        if (!/^evd-bdg-[a-z0-9]{16}$/.test(recordId)) fail(`${field}.boundEvidenceRecordIds is invalid`);
      });
    }
    const expectedStatus = review.blockers.length ? "needs-more-learning" :
      review.missingEvidence.length ? "needs-more-evidence" : "eligible-for-server-verification";
    if (review.status !== expectedStatus || review.blockers.includes("domain-floor-not-met") !== (lowDomainIds.length > 0)) {
      fail(`${field}.status is invalid`);
    }
  }
  function validateProjectedPriorities(projection) {
    const domainsById = new Map();
    denseArray(projection.domains, "report projection domains").forEach(function (domain, index) {
      validateProjectedDomain(domain, `report projection domains[${index}]`);
      if (domainsById.has(domain.domainId)) fail("report projection domains contain duplicates");
      domainsById.set(domain.domainId, domain);
    });
    const clustersById = new Map();
    denseArray(projection.clusters, "report projection clusters").forEach(function (cluster, index) {
      validateProjectedCluster(cluster, `report projection clusters[${index}]`);
      if (clustersById.has(cluster.clusterId)) fail("report projection clusters contain duplicates");
      clustersById.set(cluster.clusterId, cluster);
    });
    const priorityDomains = new Set();
    denseArray(projection.lessonPriorities, "report projection lesson priorities").forEach(function (priority, index) {
      knownFields(priority, ["domainId", "mode", "percentage", "errorBreakdown"], `report projection lesson priorities[${index}]`);
      requirePatternText(priority.domainId, `report projection lesson priorities[${index}].domainId`, ID_PATTERNS.domainId);
      if (!ROUTING_MODES.includes(priority.mode) || priorityDomains.has(priority.domainId) || !domainsById.has(priority.domainId)) {
        fail("report projection lesson priority is invalid");
      }
      const domain = domainsById.get(priority.domainId);
      if (priority.percentage !== domain.percentage || !sameJson(priority.errorBreakdown, domain.errorBreakdown)) fail("report projection lesson priority is invalid");
      validateErrorBreakdownList(priority.errorBreakdown, `report projection lesson priorities[${index}].errorBreakdown`);
      priorityDomains.add(priority.domainId);
    });
    if (priorityDomains.size !== domainsById.size) fail("report projection lesson priorities are incomplete");
    const priorityClusters = new Set();
    denseArray(projection.clusterPriorities, "report projection cluster priorities").forEach(function (priority, index) {
      knownFields(priority, [
        "unitId", "clusterId", "standardRange", "domainId", "skillIds", "mode", "percentage", "itemCount", "errorBreakdown",
        "difficultyEvidence", "evidenceState"
      ], `report projection cluster priorities[${index}]`);
      requirePatternText(priority.unitId, `report projection cluster priorities[${index}].unitId`, ID_PATTERNS.unitId);
      requirePatternText(priority.clusterId, `report projection cluster priorities[${index}].clusterId`, ID_PATTERNS.clusterId);
      requirePatternText(priority.standardRange, `report projection cluster priorities[${index}].standardRange`, ID_PATTERNS.standardRange);
      requirePatternText(priority.domainId, `report projection cluster priorities[${index}].domainId`, ID_PATTERNS.domainId);
      requireText(priority.evidenceState, `report projection cluster priorities[${index}].evidenceState`);
      if (!ROUTING_MODES.includes(priority.mode) || priorityClusters.has(priority.clusterId) || !clustersById.has(priority.clusterId)) {
        fail("report projection cluster priority is invalid");
      }
      const cluster = clustersById.get(priority.clusterId);
      if (priority.unitId !== cluster.unitId || priority.standardRange !== cluster.standardRange || priority.domainId !== cluster.domainId ||
        !sameJson(priority.skillIds, cluster.skillIds) || priority.percentage !== cluster.percentage || priority.itemCount !== cluster.itemCount ||
        !sameJson(priority.errorBreakdown, cluster.errorBreakdown) || !sameDifficultyEvidence(priority.difficultyEvidence, cluster.difficultyEvidence) ||
        priority.evidenceState !== cluster.evidenceState) fail("report projection cluster priority is invalid");
      validateTextArray(priority.skillIds, `report projection cluster priorities[${index}].skillIds`).forEach(function (skillId, skillIndex) {
        requirePatternText(skillId, `report projection cluster priorities[${index}].skillIds[${skillIndex}]`, ID_PATTERNS.skillId);
      });
      validateErrorBreakdownList(priority.errorBreakdown, `report projection cluster priorities[${index}].errorBreakdown`);
      validateDifficultyEvidence(priority.difficultyEvidence, `report projection cluster priorities[${index}].difficultyEvidence`);
      priorityClusters.add(priority.clusterId);
    });
    if (priorityClusters.size !== clustersById.size) fail("report projection cluster priorities are incomplete");
    return Object.freeze({ domainsById, clustersById });
  }
  function validateReportProjection(projection, audience) {
    const common = [
      "schemaVersion", "audience", "deliveryRequirement", "authorizationVerified", "assessment", "score", "domains", "clusters",
      "itemFeedback", "lessonPriorities", "clusterPriorities", "promotionReview"
    ];
    knownFields(projection, audience === "teacher" ? common.concat(["policy"]) : common, `${audience} projection`);
    const expectedDelivery = audience === "student" ? "authenticated-owner-only" : "authenticated-teacher-or-admin-only";
    if (projection.schemaVersion !== SCHEMA_VERSION || projection.audience !== audience || projection.deliveryRequirement !== expectedDelivery ||
      projection.authorizationVerified !== false) fail(`${audience} projection is invalid`);
    knownFields(projection.assessment, audience === "teacher" ? ["blueprintId", "blueprintVersion", "learnerId"] : ["blueprintId", "blueprintVersion"], `${audience} projection assessment`);
    requirePatternText(projection.assessment.blueprintId, `${audience} projection assessment.blueprintId`, ID_PATTERNS.blueprintId);
    if (!Number.isInteger(projection.assessment.blueprintVersion) || projection.assessment.blueprintVersion < 1) fail(`${audience} projection assessment is invalid`);
    if (audience === "teacher") {
      requirePatternText(projection.assessment.learnerId, "teacher projection assessment.learnerId", ID_PATTERNS.learnerId);
      validatePolicySnapshot(projection.policy);
    }
    validateScore(projection.score, `${audience} projection score`);
    const itemIds = new Set();
    denseArray(projection.itemFeedback, `${audience} projection item feedback`).forEach(function (item, index) {
      validateProjectedFeedback(item, `${audience} projection item feedback[${index}]`, audience === "teacher");
      if (item.questionNumber !== index + 1 || (audience === "teacher" && (itemIds.has(item.itemId) || !itemIds.add(item.itemId)))) {
        fail(`${audience} projection item feedback is invalid`);
      }
    });
    const projectionMaps = validateProjectedPriorities(projection);
    validateProjectedPromotion(projection.promotionReview, audience, projectionMaps.domainsById, `${audience} projection promotion review`);
    noPrivateKeys(projection, `${audience} projection`);
  }
  function validateStudentReport(projection) {
    validateReportProjection(projection, "student");
    return true;
  }
  function validateTeacherReport(projection) {
    validateReportProjection(projection, "teacher");
    return true;
  }

  return Object.freeze({ STATUS_COPY, SCHEMA_VERSION, validateAnalysisReport, buildStudentReport, buildTeacherReport, validateStudentReport, validateTeacherReport });
});
