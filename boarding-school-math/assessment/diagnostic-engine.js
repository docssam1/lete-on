(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDDiagnosticEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-boarding-diagnostic-v1";
  const PURPOSE_RULES = Object.freeze({
    "unit-screener": Object.freeze({ minItems: 8, maxItems: 20, minDomains: 1, placementCapable: false }),
    "course-placement": Object.freeze({
      minItems: 36,
      maxItems: 60,
      minDomains: 4,
      minItemsPerDomain: 4,
      minDifficultyRatio: 0.2,
      placementCapable: true
    }),
    "competition-benchmark": Object.freeze({ minItems: 15, maxItems: 30, minDomains: 3, placementCapable: false })
  });
  const RESPONSE_TYPES = Object.freeze(["multiple-choice", "numeric", "short-answer", "constructed-response"]);
  const DIFFICULTIES = Object.freeze(["foundation", "core", "advanced"]);
  const SCORING_MODES = Object.freeze(["automatic", "teacher"]);
  const ERROR_TYPES = Object.freeze([
    "prerequisite-gap",
    "concept-gap",
    "representation-error",
    "calculation-error",
    "condition-missed",
    "strategy-gap",
    "explanation-incomplete"
  ]);
  const EVIDENCE_TYPES = Object.freeze(["diagnostic", "unit-mastery", "retention-check", "teacher-review"]);
  const ITEM_FIELDS = Object.freeze([
    "itemId", "skillId", "domainId", "maxPoints", "responseType", "difficulty", "scoringMode", "reviewState"
  ]);
  const BLUEPRINT_FIELDS = Object.freeze(["schemaVersion", "id", "programId", "targetGrade", "version", "purpose", "items"]);
  const ATTEMPT_FIELDS = Object.freeze([
    "id", "blueprintId", "blueprintVersion", "learnerId", "schoolId", "policyId", "policyVersion", "completedAt", "itemResults"
  ]);
  const POLICY_FIELDS = Object.freeze([
    "id", "version", "owner", "schoolId", "programId", "targetGrade", "effectiveFrom",
    "claimsNationalOfficialCut", "teacherReviewRequired", "bands", "promotionReview", "evidenceRequired"
  ]);
  const BAND_FIELDS = Object.freeze(["id", "minPercent"]);
  const PROMOTION_REVIEW_FIELDS = Object.freeze(["minimumBandId", "minDomainPercent", "maxPrerequisiteGaps"]);
  const RESULT_FIELDS = Object.freeze(["itemId", "awardedPoints", "errorType", "scoringReview"]);
  const SCORING_REVIEW_FIELDS = Object.freeze(["reviewId", "reviewerId", "reviewedAt", "attemptId", "itemId"]);
  const EVIDENCE_INPUT_FIELDS = Object.freeze(["unit-mastery", "retention-check", "teacher-review"]);
  const EVIDENCE_RECORD_FIELDS = Object.freeze([
    "recordId", "type", "learnerId", "schoolId", "programId", "attemptId", "blueprintId", "blueprintVersion",
    "policyId", "policyVersion", "verifiedAt", "verifiedBy"
  ]);

  const FEEDBACK = Object.freeze({
    secure: Object.freeze({ ko: "핵심 조건과 계산이 모두 정확합니다.", en: "The key conditions and calculation are both correct.", "zh-Hans": "关键条件与计算均正确。" }),
    "partial-evidence": Object.freeze({ ko: "풀이의 일부는 맞지만 끝까지 확인할 근거가 더 필요합니다.", en: "Part of the work is correct, but more evidence is needed to finish it.", "zh-Hans": "部分过程正确，但还需要更多依据完成解答。" }),
    "prerequisite-gap": Object.freeze({ ko: "먼저 연결되는 선수 개념을 다시 확인합니다.", en: "Review the prerequisite idea that this skill depends on.", "zh-Hans": "先复习本技能所依赖的前置概念。" }),
    "concept-gap": Object.freeze({ ko: "개념의 뜻과 사용 조건을 다시 연결합니다.", en: "Reconnect the meaning of the concept with when to use it.", "zh-Hans": "重新理解概念含义及其使用条件。" }),
    "representation-error": Object.freeze({ ko: "그림·표·식 사이의 표현을 다시 바꾸어 봅니다.", en: "Practice moving between diagrams, tables, and equations.", "zh-Hans": "练习在图、表和算式之间转换。" }),
    "calculation-error": Object.freeze({ ko: "계산 과정을 한 줄씩 쓰고 역산으로 확인합니다.", en: "Write each calculation step and check it with a reverse operation.", "zh-Hans": "逐步写出计算，并用逆运算检查。" }),
    "condition-missed": Object.freeze({ ko: "문제의 조건을 표시하고 모두 사용했는지 확인합니다.", en: "Mark every condition and check that each one was used.", "zh-Hans": "标出所有条件，并检查是否全部使用。" }),
    "strategy-gap": Object.freeze({ ko: "가능한 풀이 전략을 비교하고 첫 단계를 선택합니다.", en: "Compare possible strategies and choose a clear first step.", "zh-Hans": "比较可行策略，并选择清晰的第一步。" }),
    "explanation-incomplete": Object.freeze({ ko: "답뿐 아니라 왜 그런지 문장이나 식으로 설명합니다.", en: "Explain why the answer works, not only what the answer is.", "zh-Hans": "不仅写答案，还要说明理由。" })
  });

  function fail(message) {
    throw new Error(message);
  }

  function isRecord(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function requireText(value, field, pattern) {
    if (typeof value !== "string") fail(`${field} must be a string`);
    if (value !== value.trim() || !value) fail(`${field} must be a non-blank trimmed string`);
    if (pattern && !pattern.test(value)) fail(`${field} is invalid`);
    return value;
  }

  function requireFinitePercent(value, field) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
      fail(`${field} must be a finite number from 0 to 100`);
    }
    return value;
  }

  function requireRealDate(value, field) {
    requireText(value, field, /^\d{4}-\d{2}-\d{2}$/);
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) fail(`${field} is not a real date`);
    return value;
  }

  function requireRealTimestamp(value, field) {
    requireText(value, field, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/);
    const parsed = new Date(value);
    const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== normalized) fail(`${field} is not a real timestamp`);
    return value;
  }

  function sameGrade(left, right) {
    return String(left) === String(right);
  }

  function assertKnownFields(value, allowed, field) {
    const unknown = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
    if (unknown.length) fail(`${field} has unsupported fields: ${unknown.join(", ")}`);
  }

  function assertUnique(values, field) {
    if (new Set(values).size !== values.length) fail(`${field} contains duplicates`);
  }

  function round1(value) {
    return Math.round((value + Number.EPSILON) * 10) / 10;
  }

  function validateGrade(value, field) {
    if (value === "K") return true;
    if (!Number.isInteger(value) || value < 1 || value > 8) fail(`${field} must be K or grade 1-8`);
    return true;
  }

  function validateItem(item, index) {
    const field = `items[${index}]`;
    if (!isRecord(item)) fail(`${field} must be an object`);
    assertKnownFields(item, ITEM_FIELDS, field);
    requireText(item.itemId, `${field}.itemId`, /^qst-bnk-[a-z0-9]{16}$/);
    requireText(item.skillId, `${field}.skillId`, /^[a-z0-9][a-z0-9:-]{2,127}$/);
    requireText(item.domainId, `${field}.domainId`, /^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/);
    if (!Number.isInteger(item.maxPoints) || item.maxPoints < 1 || item.maxPoints > 4) fail(`${field}.maxPoints must be 1-4`);
    if (!RESPONSE_TYPES.includes(item.responseType)) fail(`${field}.responseType is invalid`);
    if (!DIFFICULTIES.includes(item.difficulty)) fail(`${field}.difficulty is invalid`);
    if (!SCORING_MODES.includes(item.scoringMode)) fail(`${field}.scoringMode is invalid`);
    if (item.responseType === "constructed-response" && item.scoringMode !== "teacher") {
      fail(`${field} constructed response must be teacher scored`);
    }
    if (item.reviewState !== "approved") fail(`${field}.reviewState must be approved`);
    return true;
  }

  function validateBlueprint(blueprint) {
    if (!isRecord(blueprint)) fail("blueprint must be an object");
    assertKnownFields(blueprint, BLUEPRINT_FIELDS, "blueprint");
    if (blueprint.schemaVersion !== SCHEMA_VERSION) fail("blueprint.schemaVersion is unsupported");
    requireText(blueprint.id, "blueprint.id", /^asm-bdg-[a-z0-9-]{6,64}$/);
    requireText(blueprint.programId, "blueprint.programId", /^[a-z0-9][a-z0-9-]{2,63}$/);
    validateGrade(blueprint.targetGrade, "blueprint.targetGrade");
    if (!Number.isInteger(blueprint.version) || blueprint.version < 1) fail("blueprint.version must be a positive integer");
    const rule = PURPOSE_RULES[blueprint.purpose];
    if (!rule) fail("blueprint.purpose is invalid");
    if (!Array.isArray(blueprint.items)) fail("blueprint.items is required");
    if (blueprint.items.length < rule.minItems || blueprint.items.length > rule.maxItems) {
      fail(`${blueprint.purpose} requires ${rule.minItems}-${rule.maxItems} items`);
    }
    blueprint.items.forEach(validateItem);
    assertUnique(blueprint.items.map(function (item) { return item.itemId; }), "blueprint item ids");
    const domains = new Set(blueprint.items.map(function (item) { return item.domainId; }));
    if (domains.size < rule.minDomains) fail(`${blueprint.purpose} requires at least ${rule.minDomains} domains`);
    if (blueprint.purpose === "course-placement") {
      domains.forEach(function (domainId) {
        const count = blueprint.items.filter(function (item) { return item.domainId === domainId; }).length;
        if (count < rule.minItemsPerDomain) fail(`course-placement requires at least ${rule.minItemsPerDomain} items per domain`);
      });
      const minimumDifficultyItems = Math.ceil(blueprint.items.length * rule.minDifficultyRatio);
      DIFFICULTIES.forEach(function (difficulty) {
        const count = blueprint.items.filter(function (item) { return item.difficulty === difficulty; }).length;
        if (count < minimumDifficultyItems) {
          fail(`course-placement requires at least ${minimumDifficultyItems} ${difficulty} items`);
        }
      });
      if (new Set(blueprint.items.map(function (item) { return item.responseType; })).size < 2) {
        fail("course-placement requires at least two response types");
      }
    }
    return true;
  }

  function validateBands(bands) {
    if (!Array.isArray(bands) || bands.length < 2) fail("policy.bands requires at least two bands");
    bands.forEach(function (band, index) {
      if (!isRecord(band)) fail(`policy.bands[${index}] must be an object`);
      assertKnownFields(band, BAND_FIELDS, `policy.bands[${index}]`);
      requireText(band.id, `policy.bands[${index}].id`, /^[a-z][a-z0-9-]{1,31}$/);
      requireFinitePercent(band.minPercent, `policy.bands[${index}].minPercent`);
      if (index === 0 && band.minPercent !== 0) fail("policy.bands must start at 0 percent");
      if (index > 0 && band.minPercent <= bands[index - 1].minPercent) fail("policy.bands must increase");
    });
    assertUnique(bands.map(function (band) { return band.id; }), "policy band ids");
  }

  function validatePolicy(policy) {
    if (!isRecord(policy)) fail("policy must be an object");
    assertKnownFields(policy, POLICY_FIELDS, "policy");
    requireText(policy.id, "policy.id", /^pol-bdg-[a-z0-9-]{4,64}$/);
    if (!Number.isInteger(policy.version) || policy.version < 1) fail("policy.version must be a positive integer");
    requireText(policy.owner, "policy.owner");
    if (policy.owner.length > 120 || /[\u0000-\u001f\u007f]/.test(policy.owner)) fail("policy.owner is invalid");
    requireText(policy.schoolId, "policy.schoolId", /^sch-bdg-[a-z0-9]{16}$/);
    requireText(policy.programId, "policy.programId", /^[a-z0-9][a-z0-9-]{2,63}$/);
    validateGrade(policy.targetGrade, "policy.targetGrade");
    requireRealDate(policy.effectiveFrom, "policy.effectiveFrom");
    if (policy.claimsNationalOfficialCut !== false) fail("policy cannot claim a national official cut");
    if (policy.teacherReviewRequired !== true) fail("policy.teacherReviewRequired must be true");
    validateBands(policy.bands);
    if (!isRecord(policy.promotionReview)) fail("policy.promotionReview is required");
    assertKnownFields(policy.promotionReview, PROMOTION_REVIEW_FIELDS, "policy.promotionReview");
    if (!policy.bands.some(function (band) { return band.id === policy.promotionReview.minimumBandId; })) {
      fail("policy.promotionReview.minimumBandId is unknown");
    }
    requireFinitePercent(policy.promotionReview.minDomainPercent, "policy.promotionReview.minDomainPercent");
    if (!Number.isInteger(policy.promotionReview.maxPrerequisiteGaps) || policy.promotionReview.maxPrerequisiteGaps < 0) {
      fail("policy.promotionReview.maxPrerequisiteGaps must be a non-negative integer");
    }
    if (!Array.isArray(policy.evidenceRequired) || !policy.evidenceRequired.length) fail("policy.evidenceRequired is required");
    assertUnique(policy.evidenceRequired, "policy.evidenceRequired");
    policy.evidenceRequired.forEach(function (evidence) {
      if (!EVIDENCE_TYPES.includes(evidence)) fail(`unknown required evidence: ${evidence}`);
    });
    if (policy.evidenceRequired.length !== EVIDENCE_TYPES.length || EVIDENCE_TYPES.some(function (type) {
      return !policy.evidenceRequired.includes(type);
    })) {
      fail("policy must require all four evidence types");
    }
    return true;
  }

  function validateAttempt(blueprint, attempt) {
    validateBlueprint(blueprint);
    if (!isRecord(attempt)) fail("attempt must be an object");
    assertKnownFields(attempt, ATTEMPT_FIELDS, "attempt");
    requireText(attempt.id, "attempt.id", /^att-bdg-[a-z0-9]{16}$/);
    if (attempt.blueprintId !== blueprint.id || attempt.blueprintVersion !== blueprint.version) {
      fail("attempt must match the blueprint id and version");
    }
    requireText(attempt.learnerId, "attempt.learnerId", /^lrm-bdg-[a-z0-9]{16}$/);
    requireText(attempt.schoolId, "attempt.schoolId", /^sch-bdg-[a-z0-9]{16}$/);
    requireText(attempt.policyId, "attempt.policyId", /^pol-bdg-[a-z0-9-]{4,64}$/);
    if (!Number.isInteger(attempt.policyVersion) || attempt.policyVersion < 1) fail("attempt.policyVersion must be a positive integer");
    requireRealTimestamp(attempt.completedAt, "attempt.completedAt");
    if (!Array.isArray(attempt.itemResults) || attempt.itemResults.length !== blueprint.items.length) {
      fail("attempt must contain exactly one result for every item");
    }
    for (let index = 0; index < attempt.itemResults.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(attempt.itemResults, index)) fail("attempt item results must be a dense array without empty slots");
    }
    const itemById = new Map(blueprint.items.map(function (item) { return [item.itemId, item]; }));
    assertUnique(attempt.itemResults.map(function (result) { return result.itemId; }), "attempt item ids");
    attempt.itemResults.forEach(function (result, index) {
      const field = `attempt.itemResults[${index}]`;
      if (!isRecord(result)) fail(`${field} must be an object`);
      assertKnownFields(result, RESULT_FIELDS, field);
      const item = itemById.get(result.itemId);
      if (!item) fail(`${field}.itemId is not in the blueprint`);
      if (typeof result.awardedPoints !== "number" || !Number.isFinite(result.awardedPoints) || result.awardedPoints < 0 || result.awardedPoints > item.maxPoints) {
        fail(`${field}.awardedPoints is outside the item range`);
      }
      if (result.awardedPoints < item.maxPoints && !ERROR_TYPES.includes(result.errorType)) {
        fail(`${field}.errorType is required for lost points`);
      }
      if (result.awardedPoints === item.maxPoints && result.errorType != null) fail(`${field}.errorType must be empty for full credit`);
      if (item.scoringMode === "teacher") {
        if (!isRecord(result.scoringReview)) fail(`${field} requires a bound teacher scoring review`);
        assertKnownFields(result.scoringReview, SCORING_REVIEW_FIELDS, `${field}.scoringReview`);
        requireText(result.scoringReview.reviewId, `${field}.scoringReview.reviewId`, /^grd-bdg-[a-z0-9]{16}$/);
        requireText(result.scoringReview.reviewerId, `${field}.scoringReview.reviewerId`, /^gmt-[a-z0-9]{16}$/);
        requireRealTimestamp(result.scoringReview.reviewedAt, `${field}.scoringReview.reviewedAt`);
        if (result.scoringReview.attemptId !== attempt.id || result.scoringReview.itemId !== item.itemId) {
          fail(`${field}.scoringReview must match the attempt and item`);
        }
        if (Date.parse(result.scoringReview.reviewedAt) < Date.parse(attempt.completedAt)) {
          fail(`${field}.scoringReview cannot predate the completed attempt`);
        }
      } else if (result.scoringReview != null) {
        fail(`${field}.scoringReview is allowed only for teacher-scored items`);
      }
    });
    const scoringReviewIds = attempt.itemResults.filter(function (result) {
      return !!result.scoringReview;
    }).map(function (result) { return result.scoringReview.reviewId; });
    assertUnique(scoringReviewIds, "teacher scoring review ids");
    return true;
  }

  function selectBand(percentage, bands) {
    return bands.reduce(function (selected, band) {
      return percentage >= band.minPercent ? band : selected;
    }, bands[0]);
  }

  function validateEvidenceRecord(type, record, blueprint, attempt, policy) {
    const field = `evidence.${type}`;
    if (!isRecord(record)) fail(`${field} must be a bound evidence record object`);
    assertKnownFields(record, EVIDENCE_RECORD_FIELDS, field);
    requireText(record.recordId, `${field}.recordId`, /^evd-bdg-[a-z0-9]{16}$/);
    if (record.type !== type) fail(`${field}.type must match ${type}`);
    requireText(record.learnerId, `${field}.learnerId`, /^lrm-bdg-[a-z0-9]{16}$/);
    requireText(record.schoolId, `${field}.schoolId`, /^sch-bdg-[a-z0-9]{16}$/);
    requireText(record.programId, `${field}.programId`, /^[a-z0-9][a-z0-9-]{2,63}$/);
    requireText(record.attemptId, `${field}.attemptId`, /^att-bdg-[a-z0-9]{16}$/);
    requireText(record.blueprintId, `${field}.blueprintId`, /^asm-bdg-[a-z0-9-]{6,64}$/);
    requireText(record.policyId, `${field}.policyId`, /^pol-bdg-[a-z0-9-]{4,64}$/);
    requireText(record.verifiedBy, `${field}.verifiedBy`, /^gmt-[a-z0-9]{16}$/);
    requireRealTimestamp(record.verifiedAt, `${field}.verifiedAt`);
    if (!Number.isInteger(record.blueprintVersion) || !Number.isInteger(record.policyVersion)) {
      fail(`${field} versions must be integers`);
    }
    const bindingsMatch = record.learnerId === attempt.learnerId && record.schoolId === attempt.schoolId &&
      record.programId === blueprint.programId && record.attemptId === attempt.id &&
      record.blueprintId === blueprint.id && record.blueprintVersion === blueprint.version &&
      record.policyId === policy.id && record.policyVersion === policy.version;
    if (!bindingsMatch) fail(`${field} does not match the learner, attempt, blueprint, and policy`);
    return true;
  }

  function analyzeAttempt(blueprint, attempt, policy, evidence) {
    validateAttempt(blueprint, attempt);
    validatePolicy(policy);
    if (!PURPOSE_RULES[blueprint.purpose].placementCapable) fail(`${blueprint.purpose} cannot produce a placement review`);
    if (policy.schoolId !== attempt.schoolId || policy.programId !== blueprint.programId ||
        !sameGrade(policy.targetGrade, blueprint.targetGrade) || attempt.policyId !== policy.id ||
        attempt.policyVersion !== policy.version) {
      fail("policy must match the attempt school and the blueprint program and grade");
    }
    if (policy.effectiveFrom > attempt.completedAt.slice(0, 10)) fail("policy cannot take effect after the completed attempt");
    if (evidence != null && !isRecord(evidence)) fail("evidence must be an object");
    const suppliedEvidence = evidence || {};
    assertKnownFields(suppliedEvidence, EVIDENCE_INPUT_FIELDS, "evidence");
    EVIDENCE_INPUT_FIELDS.forEach(function (type) {
      if (suppliedEvidence[type] != null) validateEvidenceRecord(type, suppliedEvidence[type], blueprint, attempt, policy);
    });
    assertUnique(EVIDENCE_INPUT_FIELDS.filter(function (type) {
      return suppliedEvidence[type] != null;
    }).map(function (type) { return suppliedEvidence[type].recordId; }), "evidence record ids");

    const itemById = new Map(blueprint.items.map(function (item) { return [item.itemId, item]; }));
    const domainMap = new Map();
    const itemFeedback = attempt.itemResults.map(function (result) {
      const item = itemById.get(result.itemId);
      if (!domainMap.has(item.domainId)) {
        domainMap.set(item.domainId, { domainId: item.domainId, earnedPoints: 0, maxPoints: 0, itemCount: 0, errorCounts: {} });
      }
      const domain = domainMap.get(item.domainId);
      domain.earnedPoints += result.awardedPoints;
      domain.maxPoints += item.maxPoints;
      domain.itemCount += 1;
      if (result.errorType) domain.errorCounts[result.errorType] = (domain.errorCounts[result.errorType] || 0) + 1;
      const outcomeCode = result.awardedPoints === item.maxPoints ? "full-credit" :
        result.awardedPoints > 0 ? "partial-credit" : "no-credit";
      const commentCode = result.awardedPoints === item.maxPoints ? "secure" : result.errorType;
      return Object.freeze({
        itemId: item.itemId,
        skillId: item.skillId,
        domainId: item.domainId,
        earnedPoints: result.awardedPoints,
        maxPoints: item.maxPoints,
        outcomeCode,
        errorType: result.errorType || null,
        commentCode,
        comment: FEEDBACK[commentCode]
      });
    });

    const domains = Array.from(domainMap.values()).map(function (domain) {
      return Object.freeze(Object.assign({}, domain, {
        errorCounts: Object.freeze(Object.assign({}, domain.errorCounts)),
        percentage: round1(100 * domain.earnedPoints / domain.maxPoints)
      }));
    }).sort(function (left, right) { return left.domainId.localeCompare(right.domainId); });
    const earnedPoints = domains.reduce(function (sum, domain) { return sum + domain.earnedPoints; }, 0);
    const maxPoints = domains.reduce(function (sum, domain) { return sum + domain.maxPoints; }, 0);
    const exactPercentage = 100 * earnedPoints / maxPoints;
    const percentage = round1(exactPercentage);
    const band = selectBand(exactPercentage, policy.bands);
    const minimumBand = policy.bands.find(function (candidate) { return candidate.id === policy.promotionReview.minimumBandId; });
    const lowDomains = domains.filter(function (domain) {
      return 100 * domain.earnedPoints / domain.maxPoints < policy.promotionReview.minDomainPercent;
    });
    const prerequisiteGaps = itemFeedback.filter(function (item) { return item.errorType === "prerequisite-gap"; }).length;
    const evidenceStatus = Object.freeze({
      diagnostic: true,
      "unit-mastery": !!suppliedEvidence["unit-mastery"],
      "retention-check": !!suppliedEvidence["retention-check"],
      "teacher-review": !!suppliedEvidence["teacher-review"]
    });
    const missingEvidence = policy.evidenceRequired.filter(function (key) { return !evidenceStatus[key]; });
    const blockers = [];
    if (exactPercentage < minimumBand.minPercent) blockers.push("overall-score-below-policy");
    if (lowDomains.length) blockers.push("domain-floor-not-met");
    if (prerequisiteGaps > policy.promotionReview.maxPrerequisiteGaps) blockers.push("prerequisite-gaps-exceed-policy");
    const status = blockers.length ? "needs-more-learning" : missingEvidence.length ? "needs-more-evidence" : "eligible-for-server-verification";
    const lessonPriorities = domains.slice().sort(function (left, right) {
      return left.percentage - right.percentage || left.domainId.localeCompare(right.domainId);
    }).map(function (domain) {
      const mode = 100 * domain.earnedPoints / domain.maxPoints < policy.promotionReview.minDomainPercent ? "repair" :
        Object.keys(domain.errorCounts).length ? "guided-practice" : "consolidate";
      return Object.freeze({ domainId: domain.domainId, mode, percentage: domain.percentage, errorCounts: Object.freeze(Object.assign({}, domain.errorCounts)) });
    });

    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      blueprintId: blueprint.id,
      blueprintVersion: blueprint.version,
      learnerId: attempt.learnerId,
      policy: Object.freeze({
        id: policy.id,
        version: policy.version,
        owner: policy.owner,
        schoolId: policy.schoolId,
        programId: policy.programId,
        targetGrade: policy.targetGrade,
        effectiveFrom: policy.effectiveFrom,
        claimsNationalOfficialCut: false
      }),
      score: Object.freeze({ earnedPoints, maxPoints, percentage, performanceBand: band.id }),
      domains: Object.freeze(domains),
      itemFeedback: Object.freeze(itemFeedback),
      lessonPriorities: Object.freeze(lessonPriorities),
      promotionReview: Object.freeze({
        status,
        automaticPromotion: false,
        requiresServerAuthorization: true,
        serverAuthorizationVerified: false,
        decisionAuthority: policy.owner,
        blockers: Object.freeze(blockers),
        missingEvidence: Object.freeze(missingEvidence),
        lowDomainIds: Object.freeze(lowDomains.map(function (domain) { return domain.domainId; })),
        prerequisiteGapCount: prerequisiteGaps,
        boundEvidenceRecordIds: Object.freeze(EVIDENCE_INPUT_FIELDS.filter(function (type) {
          return !!suppliedEvidence[type];
        }).map(function (type) { return suppliedEvidence[type].recordId; }))
      })
    });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    PURPOSE_RULES,
    RESPONSE_TYPES,
    DIFFICULTIES,
    SCORING_MODES,
    ERROR_TYPES,
    EVIDENCE_TYPES,
    FEEDBACK,
    validateBlueprint,
    validatePolicy,
    validateAttempt,
    analyzeAttempt
  });
});
