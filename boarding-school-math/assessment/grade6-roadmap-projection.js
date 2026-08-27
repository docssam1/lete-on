(function (root, factory) {
  const reports = typeof module === "object" && module.exports
    ? require("./report-projections.js")
    : root.GFIELDDiagnosticReportProjections;
  const registry = typeof module === "object" && module.exports
    ? require("../curriculum/us-k8-content-registry.js")
    : root.GFIELDUSK8ContentRegistry;
  const resourcePlans = typeof module === "object" && module.exports
    ? require("../resources/k8-resource-plan.js")
    : root.GFIELDK8ResourcePlan;
  const api = factory(reports, registry, resourcePlans);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade6RoadmapProjection = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (reports, registry, resourcePlans) {
  "use strict";

  if (!reports || !registry || !resourcePlans) throw new Error("GFIELD report, curriculum, and resource-plan contracts are required");

  const SCHEMA_VERSION = "gfield-grade6-roadmap-projection-v1";
  const ROUTING_EVIDENCE_STATE = "cluster-range-only-pending-teacher-confirmation";
  const ROUTE_STATE = "candidate-pending-teacher-confirmation";
  const ASSIGNMENT_STATE = "locked-awaiting-reviewed-signed-content-and-teacher-confirmation";
  const PACING_STATE = "school-configured-order-required";
  const MODES = Object.freeze(["repair", "guided-practice", "consolidate"]);
  const STUDENT_TYPES = new Set(["concept-workbook", "guided-practice", "homework"]);
  const TEACHER_TYPES = new Set(["lesson-plan", "solution-guide", "assignment-builder", "answer-key"]);
  const MODE_LEVELS = Object.freeze({
    repair: Object.freeze(["foundation", "core"]),
    "guided-practice": Object.freeze(["core"]),
    consolidate: Object.freeze(["advanced"])
  });
  const ERROR_TYPES = new Set([
    "prerequisite-gap", "concept-gap", "representation-error", "calculation-error", "condition-missed", "strategy-gap", "explanation-incomplete"
  ]);
  const PROMOTION_BLOCKERS = new Set([
    "overall-score-below-policy", "domain-floor-not-met", "prerequisite-gaps-exceed-policy"
  ]);
  const MISSING_EVIDENCE_TYPES = new Set(["unit-mastery", "retention-check", "teacher-review"]);
  const ID_PATTERNS = Object.freeze({
    blueprintId: /^asm-bdg-[a-z0-9-]{6,64}$/,
    learnerId: /^lrm-bdg-[a-z0-9]{16}$/,
    policyId: /^pol-bdg-[a-z0-9-]{4,64}$/,
    schoolId: /^sch-bdg-[a-z0-9]{16}$/,
    programId: /^[a-z0-9][a-z0-9-]{2,63}$/
  });
  const FORBIDDEN_IDENTIFIER_TEXT = /(?:answer|correct|solution|rubric|정답|답|正确答案|答案|풀이|解答)/iu;
  const FORBIDDEN_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "solution", "rubric", "prompt", "options",
    "privatepayload", "privatescoring", "scoringspec", "acceptedalternatives", "expectedresponse", "learnerid", "studentname"
  ]);
  const ROUTE_COPY = Object.freeze({
    repair: Object.freeze({
      ko: "기초 모델부터 다시 연결한 뒤 단계별 연습으로 넘어갑니다. 교사 확인 후 배정됩니다.",
      en: "Reconnect the foundation model before guided practice. Assignment follows teacher confirmation.",
      "zh-Hans": "先重新连接基础模型，再进行分步练习；须经教师确认后分配。"
    }),
    "guided-practice": Object.freeze({
      ko: "핵심 적용을 단계별로 연습하고 오류 유형을 다시 확인합니다. 교사 확인 후 배정됩니다.",
      en: "Practice the core application step by step and revisit the error pattern. Assignment follows teacher confirmation.",
      "zh-Hans": "分步练习核心应用并复查错误类型；须经教师确认后分配。"
    }),
    consolidate: Object.freeze({
      ko: "심화 전이 연습으로 현재 이해를 확인합니다. 교사 확인 후 배정됩니다.",
      en: "Use advanced transfer practice to confirm current understanding. Assignment follows teacher confirmation.",
      "zh-Hans": "用进阶迁移练习确认当前理解；须经教师确认后分配。"
    })
  });
  const TEACHER_ACTION = Object.freeze({
    ko: "학생 자료는 교사 확인과 인증된 배정 전까지 전달하지 않습니다.",
    en: "Do not deliver student resources before teacher confirmation and authenticated assignment.",
    "zh-Hans": "在教师确认和认证分配前，不得向学生发送资料。"
  });

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
    if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} is invalid`);
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
  }
  function normalizedKey(value) {
    return String(value).normalize("NFKC").toLowerCase().replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
  }
  function noPrivateKeys(value, field, allowedPrivatePaths) {
    if (Array.isArray(value)) {
      denseArray(value, field).forEach(function (entry, index) { noPrivateKeys(entry, `${field}[${index}]`, allowedPrivatePaths); });
      return;
    }
    if (value && typeof value === "object" && !isRecord(value)) fail(`${field} has an unsupported object type`);
    if (!isRecord(value)) return;
    Object.keys(value).forEach(function (key) {
      const childField = `${field}.${key}`;
      if (FORBIDDEN_KEYS.has(normalizedKey(key)) && !(allowedPrivatePaths && allowedPrivatePaths.has(childField))) {
        fail(`${childField} contains private content`);
      }
      noPrivateKeys(value[key], childField, allowedPrivatePaths);
    });
  }
  function sameJson(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
  function round1(value) { return Math.round((value + Number.EPSILON) * 10) / 10; }
  function validateLocalizedCopy(value, expected, field) {
    knownFields(value, ["ko", "en", "zh-Hans"], field);
    ["ko", "en", "zh-Hans"].forEach(function (locale) { requireText(value[locale], `${field}.${locale}`); });
    if (expected && !sameJson(value, expected)) fail(`${field} is invalid`);
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
  function validateErrorBreakdown(value, field) {
    const entries = denseArray(value, field);
    const types = new Set();
    entries.forEach(function (entry, index) {
      knownFields(entry, ["errorType", "count"], `${field}[${index}]`);
      requireText(entry.errorType, `${field}[${index}].errorType`);
      if (!ERROR_TYPES.has(entry.errorType) || !Number.isInteger(entry.count) || entry.count < 1 || types.has(entry.errorType)) fail(`${field}[${index}] is invalid`);
      types.add(entry.errorType);
    });
  }
  function validateDifficultyEvidence(value, field) {
    knownFields(value, ["foundation", "core", "advanced"], field);
    ["foundation", "core", "advanced"].forEach(function (level) {
      const evidence = value[level];
      knownFields(evidence, ["earnedPoints", "maxPoints", "itemCount", "percentage"], `${field}.${level}`);
      requireFiniteNonNegative(evidence.earnedPoints, `${field}.${level}.earnedPoints`);
      requireFiniteNonNegative(evidence.maxPoints, `${field}.${level}.maxPoints`);
      if (!Number.isInteger(evidence.itemCount) || evidence.itemCount < 0 || evidence.earnedPoints > evidence.maxPoints) fail(`${field}.${level} is invalid`);
      if (evidence.itemCount === 0) {
        if (evidence.earnedPoints !== 0 || evidence.maxPoints !== 0 || evidence.percentage !== null) fail(`${field}.${level} is invalid`);
      } else {
        requireFiniteNonNegative(evidence.percentage, `${field}.${level}.percentage`);
        if (!evidence.maxPoints || evidence.percentage !== round1(100 * evidence.earnedPoints / evidence.maxPoints)) {
          fail(`${field}.${level} is invalid`);
        }
      }
    });
  }
  function validateScore(value, field) {
    knownFields(value, ["earnedPoints", "maxPoints", "percentage", "performanceBand"], field);
    ["earnedPoints", "maxPoints", "percentage"].forEach(function (key) { requireFiniteNonNegative(value[key], `${field}.${key}`); });
    if (!value.maxPoints || value.earnedPoints > value.maxPoints || value.percentage > 100 ||
      value.percentage !== round1(100 * value.earnedPoints / value.maxPoints)) fail(`${field} is invalid`);
    requireText(value.performanceBand, `${field}.performanceBand`);
    if (!/^[a-z][a-z0-9-]{1,31}$/.test(value.performanceBand) || FORBIDDEN_IDENTIFIER_TEXT.test(value.performanceBand)) {
      fail(`${field}.performanceBand is invalid`);
    }
  }
  function validatePromotionReview(value, audience, field) {
    const common = ["status", "statusMessage", "automaticPromotion", "finalDecision", "blockers", "missingEvidence", "lowDomainIds", "prerequisiteGapCount"];
    const fields = audience === "teacher" ? common.concat(["requiresServerAuthorization", "serverAuthorizationVerified", "boundEvidenceRecordIds"]) : common;
    knownFields(value, fields, field);
    requireText(value.status, `${field}.status`);
    if (!reports.STATUS_COPY || !reports.STATUS_COPY[value.status]) fail(`${field}.status is invalid`);
    validateLocalizedCopy(value.statusMessage, reports.STATUS_COPY[value.status], `${field}.statusMessage`);
    if (value.automaticPromotion !== false || value.finalDecision !== "school-review-required" || !Number.isInteger(value.prerequisiteGapCount) || value.prerequisiteGapCount < 0) {
      fail(`${field} is invalid`);
    }
    validateTextArray(value.blockers, `${field}.blockers`, PROMOTION_BLOCKERS);
    validateTextArray(value.missingEvidence, `${field}.missingEvidence`, MISSING_EVIDENCE_TYPES);
    validateTextArray(value.lowDomainIds, `${field}.lowDomainIds`).forEach(function (domainId) {
      if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{1,63}$/.test(domainId)) fail(`${field}.lowDomainIds is invalid`);
    });
    if (audience === "teacher") {
      if (value.requiresServerAuthorization !== true || value.serverAuthorizationVerified !== false) fail(`${field} is invalid`);
      validateTextArray(value.boundEvidenceRecordIds, `${field}.boundEvidenceRecordIds`).forEach(function (recordId) {
        if (!/^evd-bdg-[a-z0-9]{16}$/.test(recordId)) fail(`${field}.boundEvidenceRecordIds is invalid`);
      });
    }
    const expectedStatus = value.blockers.length ? "needs-more-learning" :
      value.missingEvidence.length ? "needs-more-evidence" : "eligible-for-server-verification";
    if (value.status !== expectedStatus) fail(`${field}.status is invalid`);
  }
  function validateDefaultCadence(value, field) {
    knownFields(value, [
      "cadenceProfileId", "weeksPerUnit", "sessionsPerWeek", "minutesPerSession", "homeBlocksPerWeek", "minutesPerHomeBlock",
      "schoolMayOverride", "retentionMinimumDelayDays"
    ], field);
    const expected = {
      cadenceProfileId: resourcePlans.GRADE6_CADENCE.cadenceProfileId,
      weeksPerUnit: resourcePlans.GRADE6_CADENCE.weeksPerUnit,
      sessionsPerWeek: resourcePlans.GRADE6_CADENCE.sessionsPerWeek,
      minutesPerSession: resourcePlans.GRADE6_CADENCE.minutesPerSession,
      homeBlocksPerWeek: resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek,
      minutesPerHomeBlock: resourcePlans.GRADE6_CADENCE.minutesPerHomeBlock,
      schoolMayOverride: true,
      retentionMinimumDelayDays: resourcePlans.GRADE6_RETENTION_SCHEDULE.minimumDelayDays
    };
    if (!sameJson(value, expected)) fail(`${field} is invalid`);
  }
  function validateGrade6PolicySnapshot(value, field) {
    knownFields(value, ["id", "version", "schoolId", "programId", "targetGrade", "effectiveFrom", "claimsNationalOfficialCut"], field);
    requirePatternText(value.id, `${field}.id`, ID_PATTERNS.policyId);
    requirePatternText(value.schoolId, `${field}.schoolId`, ID_PATTERNS.schoolId);
    requirePatternText(value.programId, `${field}.programId`, ID_PATTERNS.programId);
    requireRealDate(value.effectiveFrom, `${field}.effectiveFrom`);
    if (!Number.isInteger(value.version) || value.version < 1 || value.programId !== registry.COURSE_ID ||
      value.targetGrade !== 6 || value.claimsNationalOfficialCut !== false) fail(`${field} is invalid`);
  }
  function cloneComponents(components) {
    return Object.freeze(components.map(function (component) {
      return Object.freeze({ componentType: component.componentType, plannedCount: component.plannedCount });
    }));
  }
  function resourceMetadata(resource) {
    return Object.freeze({
      resourcePlanItemId: resource.resourcePlanItemId,
      courseId: resource.courseId,
      unitId: resource.unitId,
      skillId: resource.skillId,
      sessionId: resource.sessionId,
      audience: resource.audience,
      levelId: resource.levelId,
      testType: resource.testType,
      resourceType: resource.resourceType,
      deliveryRequirement: resource.deliveryRequirement,
      signedItemRequired: resource.signedItemRequired,
      plannedComponents: cloneComponents(resource.plannedComponents),
      bindingState: resource.bindingState
    });
  }
  function grade6Unit(priority) {
    const unit = registry.units.find(function (candidate) { return candidate.unitId === priority.unitId; });
    if (!unit || unit.grade !== 6 || unit.clusterId !== priority.clusterId || unit.standardRange !== priority.standardRange ||
      priority.domainId !== `G6-${unit.domainCode}`) {
      fail("roadmap priority does not resolve to a Grade 6 unit");
    }
    const knownSkills = new Map(registry.skills.map(function (skill) { return [skill.skillId, skill]; }));
    if (!Array.isArray(priority.skillIds) || !priority.skillIds.length || priority.skillIds.some(function (skillId) {
      const skill = knownSkills.get(skillId);
      return !skill || skill.unitId !== unit.unitId || skill.clusterId !== unit.clusterId;
    })) {
      fail("roadmap priority skill lineage is invalid");
    }
    return unit;
  }
  function selectedStudentResources(plan, mode) {
    const levels = new Set(MODE_LEVELS[mode]);
    const resources = plan.resourcesByAudience.student.filter(function (resource) {
      return resource.testType === "guided-practice" && STUDENT_TYPES.has(resource.resourceType) && levels.has(resource.levelId);
    });
    if (!resources.length || resources.some(function (resource) { return resource.signedItemRequired || resource.bindingState !== resourcePlans.PLAN_STATES.unbound; })) {
      fail("roadmap student resources are not safely available as metadata");
    }
    return Object.freeze(resources.map(resourceMetadata));
  }
  function selectedTeacherResources(plan, studentResources) {
    const sessions = new Set(studentResources.map(function (resource) { return resource.sessionId; }));
    const resources = plan.resourcesByAudience.teacher.filter(function (resource) {
      return sessions.has(resource.sessionId) && TEACHER_TYPES.has(resource.resourceType);
    });
    if (!resources.length || resources.some(function (resource) { return resource.bindingState !== resourcePlans.PLAN_STATES.unbound; })) {
      fail("roadmap teacher resources are not safely available as metadata");
    }
    return Object.freeze(resources.map(resourceMetadata));
  }
  function routeBase(priority) {
    if (!isRecord(priority) || !MODES.includes(priority.mode) || priority.evidenceState !== ROUTING_EVIDENCE_STATE) {
      fail("roadmap priority is invalid");
    }
    const unit = grade6Unit(priority);
    const plan = resourcePlans.buildUnitPlan(unit.unitId);
    const studentResources = selectedStudentResources(plan, priority.mode);
    return Object.freeze({
      unit,
      plan,
      studentResources,
      route: Object.freeze({
        unitId: unit.unitId,
        clusterId: unit.clusterId,
        standardRange: unit.standardRange,
        domainId: priority.domainId,
        skillIds: Object.freeze(priority.skillIds.slice()),
        mode: priority.mode,
        percentage: priority.percentage,
        itemCount: priority.itemCount,
        errorBreakdown: Object.freeze(priority.errorCounts ? Object.keys(priority.errorCounts).sort().map(function (errorType) {
          return Object.freeze({ errorType, count: priority.errorCounts[errorType] });
        }) : []),
        difficultyEvidence: priority.difficultyEvidence,
        evidenceState: ROUTING_EVIDENCE_STATE,
        routeState: ROUTE_STATE,
        schoolPacingState: PACING_STATE,
        assignmentState: ASSIGNMENT_STATE,
        studentAction: ROUTE_COPY[priority.mode],
        studentResources
      })
    });
  }
  function validateAnalysisForGrade6(report) {
    reports.validateAnalysisReport(report);
    if (!isRecord(report.policy) || report.policy.programId !== registry.COURSE_ID || report.policy.targetGrade !== 6) {
      fail("roadmap requires a Grade 6 US core analysis report");
    }
    if (!Array.isArray(report.clusterPriorities) || !report.clusterPriorities.length) fail("roadmap requires cluster priorities");
  }
  function projectionBase(report, audience) {
    validateAnalysisForGrade6(report);
    const reportProjection = audience === "student" ? reports.buildStudentReport(report) : reports.buildTeacherReport(report);
    const routes = report.clusterPriorities.map(routeBase);
    const base = {
      schemaVersion: SCHEMA_VERSION,
      audience,
      deliveryRequirement: audience === "student" ? "authenticated-owner-only" : "authenticated-teacher-or-admin-only",
      authorizationVerified: false,
      roadmapState: ROUTE_STATE,
      routingEvidenceState: ROUTING_EVIDENCE_STATE,
      assignmentState: ASSIGNMENT_STATE,
      assessment: audience === "student"
        ? Object.freeze({ blueprintId: reportProjection.assessment.blueprintId, blueprintVersion: reportProjection.assessment.blueprintVersion })
        : Object.freeze({ blueprintId: reportProjection.assessment.blueprintId, blueprintVersion: reportProjection.assessment.blueprintVersion, learnerId: reportProjection.assessment.learnerId }),
      score: reportProjection.score,
      promotionReview: reportProjection.promotionReview,
      defaultCadence: Object.freeze({
        cadenceProfileId: resourcePlans.GRADE6_CADENCE.cadenceProfileId,
        weeksPerUnit: resourcePlans.GRADE6_CADENCE.weeksPerUnit,
        sessionsPerWeek: resourcePlans.GRADE6_CADENCE.sessionsPerWeek,
        minutesPerSession: resourcePlans.GRADE6_CADENCE.minutesPerSession,
        homeBlocksPerWeek: resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek,
        minutesPerHomeBlock: resourcePlans.GRADE6_CADENCE.minutesPerHomeBlock,
        schoolMayOverride: true,
        retentionMinimumDelayDays: resourcePlans.GRADE6_RETENTION_SCHEDULE.minimumDelayDays
      })
    };
    if (audience === "student") {
      base.routes = Object.freeze(routes.map(function (entry) { return entry.route; }));
    } else {
      base.policy = reportProjection.policy;
      base.routes = Object.freeze(routes.map(function (entry) {
        return Object.freeze(Object.assign({}, entry.route, {
          teacherAction: Object.freeze({
            ko: TEACHER_ACTION.ko,
            en: TEACHER_ACTION.en,
            "zh-Hans": TEACHER_ACTION["zh-Hans"]
          }),
          teacherResources: selectedTeacherResources(entry.plan, entry.studentResources)
        }));
      }));
    }
    return Object.freeze(base);
  }
  function expectedRouteResources(route, audience) {
    const priority = {
      unitId: route.unitId,
      clusterId: route.clusterId,
      standardRange: route.standardRange,
      domainId: route.domainId,
      skillIds: route.skillIds,
      mode: route.mode,
      evidenceState: route.evidenceState
    };
    const base = routeBase(priority);
    if (audience === "student") return Object.freeze({ student: base.studentResources, teacher: null });
    return Object.freeze({ student: base.studentResources, teacher: selectedTeacherResources(base.plan, base.studentResources) });
  }
  function sameResourceList(actual, expected, field) {
    denseArray(actual, field);
    if (actual.length !== expected.length) fail(`${field} is invalid`);
    actual.forEach(function (resource, index) {
      const wanted = expected[index];
      if (JSON.stringify(resource) !== JSON.stringify(wanted)) fail(`${field} is invalid`);
    });
  }
  function validateRoute(route, audience) {
    const common = [
      "unitId", "clusterId", "standardRange", "domainId", "skillIds", "mode", "percentage", "itemCount", "errorBreakdown",
      "difficultyEvidence", "evidenceState", "routeState", "schoolPacingState", "assignmentState", "studentAction", "studentResources"
    ];
    const fields = audience === "teacher" ? common.concat(["teacherAction", "teacherResources"]) : common;
    knownFields(route, fields, "roadmap route");
    ["unitId", "clusterId", "standardRange", "domainId", "evidenceState", "routeState", "schoolPacingState", "assignmentState"].forEach(function (field) {
      requireText(route[field], `roadmap route.${field}`);
    });
    if (!MODES.includes(route.mode) || route.evidenceState !== ROUTING_EVIDENCE_STATE || route.routeState !== ROUTE_STATE ||
      route.schoolPacingState !== PACING_STATE || route.assignmentState !== ASSIGNMENT_STATE) fail("roadmap route is invalid");
    requireFiniteNonNegative(route.percentage, "roadmap route.percentage");
    if (route.percentage > 100) fail("roadmap route.percentage is invalid");
    if (!Number.isInteger(route.itemCount) || route.itemCount < 1 || !Array.isArray(route.skillIds) || !route.skillIds.length ||
      new Set(route.skillIds).size !== route.skillIds.length) fail("roadmap route is invalid");
    route.skillIds.forEach(function (skillId, index) { requireText(skillId, `roadmap route.skillIds[${index}]`); });
    validateErrorBreakdown(route.errorBreakdown, "roadmap route.errorBreakdown");
    validateDifficultyEvidence(route.difficultyEvidence, "roadmap route.difficultyEvidence");
    validateLocalizedCopy(route.studentAction, ROUTE_COPY[route.mode], "roadmap route.studentAction");
    const expected = expectedRouteResources(route, audience);
    sameResourceList(route.studentResources, expected.student, "roadmap route student resources");
    if (audience === "teacher") {
      validateLocalizedCopy(route.teacherAction, TEACHER_ACTION, "roadmap route.teacherAction");
      sameResourceList(route.teacherResources, expected.teacher, "roadmap route teacher resources");
    }
    noPrivateKeys(route, "roadmap route");
  }
  function validateBase(projection, audience) {
    const common = [
      "schemaVersion", "audience", "deliveryRequirement", "authorizationVerified", "roadmapState", "routingEvidenceState", "assignmentState",
      "assessment", "score", "promotionReview", "defaultCadence", "routes"
    ];
    knownFields(projection, audience === "teacher" ? common.concat(["policy"]) : common, "roadmap projection");
    if (projection.schemaVersion !== SCHEMA_VERSION || projection.audience !== audience || projection.authorizationVerified !== false ||
      projection.roadmapState !== ROUTE_STATE || projection.routingEvidenceState !== ROUTING_EVIDENCE_STATE || projection.assignmentState !== ASSIGNMENT_STATE) {
      fail("roadmap projection is invalid");
    }
    const expectedDelivery = audience === "student" ? "authenticated-owner-only" : "authenticated-teacher-or-admin-only";
    if (projection.deliveryRequirement !== expectedDelivery || !isRecord(projection.assessment) || !isRecord(projection.score) ||
      !isRecord(projection.promotionReview) || !isRecord(projection.defaultCadence)) fail("roadmap projection is invalid");
    knownFields(projection.assessment, audience === "teacher" ? ["blueprintId", "blueprintVersion", "learnerId"] : ["blueprintId", "blueprintVersion"], "roadmap assessment");
    requirePatternText(projection.assessment.blueprintId, "roadmap assessment.blueprintId", ID_PATTERNS.blueprintId);
    if (!Number.isInteger(projection.assessment.blueprintVersion) || projection.assessment.blueprintVersion < 1) fail("roadmap assessment is invalid");
    if (audience === "teacher") {
      requirePatternText(projection.assessment.learnerId, "roadmap assessment.learnerId", ID_PATTERNS.learnerId);
      validateGrade6PolicySnapshot(projection.policy, "roadmap policy");
    }
    validateScore(projection.score, "roadmap score");
    validatePromotionReview(projection.promotionReview, audience, "roadmap promotion review");
    validateDefaultCadence(projection.defaultCadence, "roadmap default cadence");
    const routeClusterIds = new Set();
    denseArray(projection.routes, "roadmap routes").forEach(function (route) {
      validateRoute(route, audience);
      if (routeClusterIds.has(route.clusterId)) fail("roadmap routes contain duplicate cluster IDs");
      routeClusterIds.add(route.clusterId);
    });
    if (!projection.routes.length) fail("roadmap routes are required");
    const routeDomainIds = new Set(projection.routes.map(function (route) { return route.domainId; }));
    projection.promotionReview.lowDomainIds.forEach(function (domainId) {
      if (!routeDomainIds.has(domainId)) fail("roadmap promotion review.lowDomainIds is invalid");
    });
    noPrivateKeys(projection, "roadmap projection", audience === "teacher" ? new Set(["roadmap projection.assessment.learnerId"]) : null);
    return true;
  }
  function buildStudentRoadmap(report) {
    const projection = projectionBase(report, "student");
    validateStudentRoadmap(projection);
    return projection;
  }
  function buildTeacherRoadmap(report) {
    const projection = projectionBase(report, "teacher");
    validateTeacherRoadmap(projection);
    return projection;
  }
  function validateStudentRoadmap(projection) { return validateBase(projection, "student"); }
  function validateTeacherRoadmap(projection) { return validateBase(projection, "teacher"); }

  return Object.freeze({
    SCHEMA_VERSION,
    ROUTING_EVIDENCE_STATE,
    ROUTE_STATE,
    ASSIGNMENT_STATE,
    buildStudentRoadmap,
    buildTeacherRoadmap,
    validateStudentRoadmap,
    validateTeacherRoadmap
  });
});
