(function (root, factory) {
  const registry = typeof module === "object" && module.exports
    ? require("../curriculum/us-k8-content-registry.js")
    : root.GFIELDUSK8ContentRegistry;
  const api = factory(registry);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDK8ResourcePlan = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (registry) {
  "use strict";

  if (!registry) throw new Error("GFIELDUSK8ContentRegistry is required");

  const SCHEMA_VERSION = "gfield-k8-resource-plan-v1";
  const PLAN_STATES = Object.freeze({
    templateOnly: "template-only",
    cadenceReady: "cadence-ready",
    contentLocked: "locked-awaiting-reviewed-signed-content",
    metadataOnly: "metadata-only",
    unbound: "unbound"
  });
  const PLAN_FIELDS = Object.freeze([
    "schemaVersion", "planId", "planVersion", "courseId", "grade", "unitId", "clusterId", "skillId",
    "planningState", "contentState", "publicationState", "cadence", "retentionSchedule", "resourcesByAudience"
  ]);
  const RESOURCE_FIELDS = Object.freeze([
    "resourcePlanItemId", "sessionId", "audience", "courseId", "unitId", "skillId", "levelId", "testType",
    "resourceType", "deliveryRequirement", "signedItemRequired", "plannedComponents", "bindingState"
  ]);
  const FORBIDDEN_PUBLIC_KEYS = new Set([
    "promptblocks", "options", "itemid", "answer", "correctoption", "solution", "rubricpayload", "scoringspec",
    "learnerid", "reviewerid", "releaseid", "releasemanifestid", "privatespec", "privateanswer"
  ]);

  const GRADE6_CADENCE = Object.freeze({
    cadenceProfileId: "grade6-core-3week-2x75-v1",
    weeksPerUnit: 3,
    sessionsPerWeek: 2,
    minutesPerSession: 75,
    homeBlocksPerWeek: 2,
    minutesPerHomeBlock: 30,
    schoolMayOverride: true,
    unitSequenceState: "school-configured-order-required",
    sessions: Object.freeze([
      Object.freeze({ sessionId: "g6-w1-s1-entry-screener", sequence: 1, week: 1, meeting: 1, phase: "entry-screener" }),
      Object.freeze({ sessionId: "g6-w1-s2-concept-model", sequence: 2, week: 1, meeting: 2, phase: "concept-model" }),
      Object.freeze({ sessionId: "g6-w2-s1-guided-practice", sequence: 3, week: 2, meeting: 1, phase: "guided-practice" }),
      Object.freeze({ sessionId: "g6-w2-s2-independent-application", sequence: 4, week: 2, meeting: 2, phase: "independent-application" }),
      Object.freeze({ sessionId: "g6-w3-s1-unit-mastery", sequence: 5, week: 3, meeting: 1, phase: "unit-mastery" }),
      Object.freeze({ sessionId: "g6-w3-s2-transfer-application", sequence: 6, week: 3, meeting: 2, phase: "transfer-application" })
    ])
  });
  const GRADE6_RETENTION_SCHEDULE = Object.freeze({
    sessionId: "g6-delayed-retention",
    scheduleId: "grade6-post-unit-retention-v1",
    scheduleState: "school-configured-delayed-attempt-required",
    minimumDelayDays: 7,
    testType: "retention-check",
    requiresSeparateAttempt: true
  });

  const TEMPLATE_RESOURCES = Object.freeze([
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "foundation", testType: "guided-practice", resourceType: "concept-workbook", plannedComponents: Object.freeze([{ componentType: "concept-summary", plannedCount: 1 }, { componentType: "worked-example", plannedCount: 2 }, { componentType: "guided-check", plannedCount: 4 }]) }),
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "core", testType: "guided-practice", resourceType: "guided-practice", plannedComponents: Object.freeze([{ componentType: "guided-problem", plannedCount: 6 }]) }),
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "core", testType: "guided-practice", resourceType: "homework", plannedComponents: Object.freeze([{ componentType: "home-practice", plannedCount: 6 }]) }),
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "foundation", testType: "unit-screener", resourceType: "quiz", plannedComponents: Object.freeze([{ componentType: "screener-prompt", plannedCount: 4 }]) }),
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "core", testType: "unit-mastery", resourceType: "test", plannedComponents: Object.freeze([{ componentType: "mastery-prompt", plannedCount: 6 }]) }),
    Object.freeze({ audience: "student", sessionId: "template-unit", levelId: "advanced", testType: "retention-check", resourceType: "student-report", plannedComponents: Object.freeze([{ componentType: "progress-summary", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "foundation", testType: "lesson-planning", resourceType: "lesson-plan", plannedComponents: Object.freeze([{ componentType: "lesson-outline", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "core", testType: "assessment-review", resourceType: "answer-key", plannedComponents: Object.freeze([{ componentType: "scoring-reference", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "core", testType: "assessment-review", resourceType: "solution-guide", plannedComponents: Object.freeze([{ componentType: "solution-structure", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "foundation", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "core", testType: "lesson-planning", resourceType: "assignment-builder", plannedComponents: Object.freeze([{ componentType: "assignment-template", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "template-unit", levelId: "advanced", testType: "assessment-review", resourceType: "teacher-report", plannedComponents: Object.freeze([{ componentType: "evidence-summary", plannedCount: 1 }]) })
  ]);

  const GRADE6_RESOURCES = Object.freeze([
    Object.freeze({ audience: "student", sessionId: "g6-w1-s1-entry-screener", levelId: "foundation", testType: "unit-screener", resourceType: "quiz", plannedComponents: Object.freeze([{ componentType: "screener-prompt", plannedCount: 2 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w1-s1-entry-screener", levelId: "core", testType: "unit-screener", resourceType: "quiz", plannedComponents: Object.freeze([{ componentType: "screener-prompt", plannedCount: 2 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w1-s1-entry-screener", levelId: "foundation", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w1-s1-entry-screener", levelId: "core", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w1-s1-entry-screener", levelId: "core", testType: "assessment-review", resourceType: "teacher-report", plannedComponents: Object.freeze([{ componentType: "evidence-summary", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w1-s2-concept-model", levelId: "foundation", testType: "guided-practice", resourceType: "concept-workbook", plannedComponents: Object.freeze([{ componentType: "concept-summary", plannedCount: 1 }, { componentType: "worked-example", plannedCount: 1 }, { componentType: "guided-check", plannedCount: 2 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w1-s2-concept-model", levelId: "core", testType: "guided-practice", resourceType: "concept-workbook", plannedComponents: Object.freeze([{ componentType: "worked-example", plannedCount: 1 }, { componentType: "guided-check", plannedCount: 2 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w1-s2-concept-model", levelId: "core", testType: "lesson-planning", resourceType: "lesson-plan", plannedComponents: Object.freeze([{ componentType: "lesson-outline", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w2-s1-guided-practice", levelId: "core", testType: "guided-practice", resourceType: "guided-practice", plannedComponents: Object.freeze([{ componentType: "guided-problem", plannedCount: 6 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w2-s1-guided-practice", levelId: "core", testType: "assessment-review", resourceType: "solution-guide", plannedComponents: Object.freeze([{ componentType: "solution-structure", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w2-s2-independent-application", levelId: "core", testType: "guided-practice", resourceType: "homework", plannedComponents: Object.freeze([{ componentType: "home-practice", plannedCount: 4 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w2-s2-independent-application", levelId: "advanced", testType: "guided-practice", resourceType: "homework", plannedComponents: Object.freeze([{ componentType: "transfer-practice", plannedCount: 2 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w2-s2-independent-application", levelId: "core", testType: "lesson-planning", resourceType: "assignment-builder", plannedComponents: Object.freeze([{ componentType: "assignment-template", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w2-s2-independent-application", levelId: "core", testType: "assessment-review", resourceType: "answer-key", plannedComponents: Object.freeze([{ componentType: "scoring-reference", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w3-s1-unit-mastery", levelId: "foundation", testType: "unit-mastery", resourceType: "test", plannedComponents: Object.freeze([{ componentType: "mastery-prompt", plannedCount: 2 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w3-s1-unit-mastery", levelId: "core", testType: "unit-mastery", resourceType: "test", plannedComponents: Object.freeze([{ componentType: "mastery-prompt", plannedCount: 3 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w3-s1-unit-mastery", levelId: "advanced", testType: "unit-mastery", resourceType: "test", plannedComponents: Object.freeze([{ componentType: "mastery-prompt", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s1-unit-mastery", levelId: "foundation", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s1-unit-mastery", levelId: "core", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s1-unit-mastery", levelId: "advanced", testType: "assessment-review", resourceType: "rubric", plannedComponents: Object.freeze([{ componentType: "scoring-criterion", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s1-unit-mastery", levelId: "core", testType: "assessment-review", resourceType: "answer-key", plannedComponents: Object.freeze([{ componentType: "scoring-reference", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s1-unit-mastery", levelId: "core", testType: "assessment-review", resourceType: "teacher-report", plannedComponents: Object.freeze([{ componentType: "evidence-summary", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w3-s2-transfer-application", levelId: "advanced", testType: "guided-practice", resourceType: "guided-practice", plannedComponents: Object.freeze([{ componentType: "transfer-practice", plannedCount: 4 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-w3-s2-transfer-application", levelId: "advanced", testType: "guided-practice", resourceType: "homework", plannedComponents: Object.freeze([{ componentType: "transfer-practice", plannedCount: 2 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s2-transfer-application", levelId: "advanced", testType: "lesson-planning", resourceType: "assignment-builder", plannedComponents: Object.freeze([{ componentType: "assignment-template", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-w3-s2-transfer-application", levelId: "advanced", testType: "assessment-review", resourceType: "solution-guide", plannedComponents: Object.freeze([{ componentType: "solution-structure", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-delayed-retention", levelId: "core", testType: "retention-check", resourceType: "quiz", plannedComponents: Object.freeze([{ componentType: "retention-prompt", plannedCount: 3 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-delayed-retention", levelId: "advanced", testType: "retention-check", resourceType: "quiz", plannedComponents: Object.freeze([{ componentType: "retention-prompt", plannedCount: 1 }]) }),
    Object.freeze({ audience: "student", sessionId: "g6-delayed-retention", levelId: "core", testType: "retention-check", resourceType: "student-report", plannedComponents: Object.freeze([{ componentType: "progress-summary", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-delayed-retention", levelId: "core", testType: "assessment-review", resourceType: "solution-guide", plannedComponents: Object.freeze([{ componentType: "solution-structure", plannedCount: 1 }]) }),
    Object.freeze({ audience: "teacher", sessionId: "g6-delayed-retention", levelId: "core", testType: "assessment-review", resourceType: "teacher-report", plannedComponents: Object.freeze([{ componentType: "evidence-summary", plannedCount: 1 }]) })
  ]);

  function fail(message) { throw new Error(message); }
  function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function requireText(value, field) { if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} must be a non-blank string`); }
  function denseArray(value, field) {
    if (!Array.isArray(value)) fail(`${field} must be an array`);
    for (let index = 0; index < value.length; index += 1) if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not contain empty slots`);
  }
  function knownFields(value, fields, field) {
    if (!isRecord(value)) fail(`${field} must be an object`);
    const allowed = new Set(fields);
    if (Object.keys(value).some(function (key) { return !allowed.has(key); })) fail(`${field} has unsupported fields`);
  }
  function slug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function equalGrade(left, right) { return String(left) === String(right); }
  function freezeComponents(components) {
    return Object.freeze(components.map(function (component) { return Object.freeze({ componentType: component.componentType, plannedCount: component.plannedCount }); }));
  }
  function deliveryRequirement(audience) {
    if (audience === "teacher") return "authenticated-teacher-or-admin-only";
    return "authenticated-student-only";
  }
  function findUnit(unitId) {
    const unit = registry.units.find(function (candidate) { return candidate.unitId === unitId; });
    if (!unit) fail("unitId is not registered");
    return unit;
  }
  function resourceRecord(unit, definition) {
    const skillId = registry.skillIdForCluster(unit.clusterId);
    const resolved = registry.resolveLineage({
      courseId: registry.COURSE_ID,
      unitId: unit.unitId,
      skillId,
      levelId: definition.levelId,
      testType: definition.testType,
      resourceType: definition.resourceType,
      audience: definition.audience
    });
    registry.buildMetadataRecord({
      courseId: registry.COURSE_ID,
      unitId: unit.unitId,
      skillId,
      levelId: definition.levelId,
      testType: definition.testType,
      resourceType: definition.resourceType,
      audience: definition.audience
    });
    return Object.freeze({
      resourcePlanItemId: `rpl-${slug(unit.unitId)}-${definition.sessionId}-${definition.audience}-${definition.levelId}-${definition.resourceType}`,
      sessionId: definition.sessionId,
      audience: definition.audience,
      courseId: registry.COURSE_ID,
      unitId: unit.unitId,
      skillId,
      levelId: definition.levelId,
      testType: definition.testType,
      resourceType: definition.resourceType,
      deliveryRequirement: deliveryRequirement(definition.audience),
      signedItemRequired: resolved.testType.signedItemRequired,
      plannedComponents: freezeComponents(definition.plannedComponents),
      bindingState: PLAN_STATES.unbound
    });
  }
  function resourceGroups(unit) {
    const definitions = unit.grade === 6 ? GRADE6_RESOURCES : TEMPLATE_RESOURCES;
    const groups = { student: [], teacher: [] };
    definitions.forEach(function (definition) { groups[definition.audience].push(resourceRecord(unit, definition)); });
    return Object.freeze({ student: Object.freeze(groups.student), teacher: Object.freeze(groups.teacher) });
  }
  function assertNoForbiddenKeys(value, field) {
    if (Array.isArray(value)) return value.forEach(function (entry, index) { assertNoForbiddenKeys(entry, `${field}[${index}]`); });
    if (!isRecord(value)) return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_PUBLIC_KEYS.has(key.toLowerCase())) fail(`${field}.${key} is not allowed in a public resource plan`);
      assertNoForbiddenKeys(value[key], `${field}.${key}`);
    });
  }
  function validateCadence(plan) {
    if (plan.grade !== 6) {
      if (plan.cadence !== null) fail("only Grade 6 may use the current cadence profile");
      return;
    }
    knownFields(plan.cadence, ["cadenceProfileId", "weeksPerUnit", "sessionsPerWeek", "minutesPerSession", "homeBlocksPerWeek", "minutesPerHomeBlock", "schoolMayOverride", "unitSequenceState", "sessions"], "plan.cadence");
    ["cadenceProfileId", "weeksPerUnit", "sessionsPerWeek", "minutesPerSession", "homeBlocksPerWeek", "minutesPerHomeBlock", "schoolMayOverride", "unitSequenceState"].forEach(function (field) {
      if (plan.cadence[field] !== GRADE6_CADENCE[field]) fail(`plan.cadence.${field} is not the Grade 6 profile`);
    });
    denseArray(plan.cadence.sessions, "plan.cadence.sessions");
    if (plan.cadence.sessions.length !== GRADE6_CADENCE.sessions.length) fail("plan.cadence.sessions has an invalid count");
    plan.cadence.sessions.forEach(function (session, index) {
      const expected = GRADE6_CADENCE.sessions[index];
      knownFields(session, ["sessionId", "sequence", "week", "meeting", "phase"], `plan.cadence.sessions[${index}]`);
      Object.keys(expected).forEach(function (field) { if (session[field] !== expected[field]) fail(`plan.cadence.sessions[${index}] does not match the Grade 6 profile`); });
    });
  }
  function validateRetentionSchedule(plan) {
    if (plan.grade !== 6) {
      if (plan.retentionSchedule !== null) fail("only Grade 6 may use the current delayed retention schedule");
      return;
    }
    knownFields(plan.retentionSchedule, ["sessionId", "scheduleId", "scheduleState", "minimumDelayDays", "testType", "requiresSeparateAttempt"], "plan.retentionSchedule");
    Object.keys(GRADE6_RETENTION_SCHEDULE).forEach(function (field) {
      if (plan.retentionSchedule[field] !== GRADE6_RETENTION_SCHEDULE[field]) fail(`plan.retentionSchedule.${field} is invalid`);
    });
  }
  function validateResource(resource, plan, audience, allowedSessionIds) {
    knownFields(resource, RESOURCE_FIELDS, "resource");
    requireText(resource.resourcePlanItemId, "resource.resourcePlanItemId");
    requireText(resource.sessionId, "resource.sessionId");
    if (!allowedSessionIds.has(resource.sessionId)) fail("resource.sessionId is not in the plan cadence");
    if (resource.audience !== audience || resource.courseId !== plan.courseId || resource.unitId !== plan.unitId || resource.skillId !== plan.skillId) fail("resource lineage does not match its plan");
    const resolved = registry.resolveLineage({
      courseId: resource.courseId,
      unitId: resource.unitId,
      skillId: resource.skillId,
      levelId: resource.levelId,
      testType: resource.testType,
      resourceType: resource.resourceType,
      audience: resource.audience
    });
    if (resource.signedItemRequired !== resolved.testType.signedItemRequired) fail("resource signed item requirement is invalid");
    if (resource.deliveryRequirement !== deliveryRequirement(resource.audience)) fail("resource delivery requirement is invalid");
    if (resource.bindingState !== PLAN_STATES.unbound) fail("public resource plans cannot bind item or release IDs");
    if (plan.grade === 6 && resource.testType === "retention-check" && resource.sessionId !== GRADE6_RETENTION_SCHEDULE.sessionId) fail("Grade 6 retention must use the delayed retention schedule");
    denseArray(resource.plannedComponents, "resource.plannedComponents");
    if (!resource.plannedComponents.length) fail("resource.plannedComponents is required");
    resource.plannedComponents.forEach(function (component, index) {
      knownFields(component, ["componentType", "plannedCount"], `resource.plannedComponents[${index}]`);
      if (typeof component.componentType !== "string" || !/^[a-z][a-z0-9-]{1,63}$/.test(component.componentType)) fail("resource component type is invalid");
      if (!Number.isInteger(component.plannedCount) || component.plannedCount < 1 || component.plannedCount > 100) fail("resource component count is invalid");
    });
  }
  function validatePlan(plan) {
    knownFields(plan, PLAN_FIELDS, "plan");
    assertNoForbiddenKeys(plan, "plan");
    if (plan.schemaVersion !== SCHEMA_VERSION || plan.planVersion !== 1) fail("plan schema or version is invalid");
    requireText(plan.planId, "plan.planId");
    if (plan.courseId !== registry.COURSE_ID) fail("plan course is invalid");
    const unit = findUnit(plan.unitId);
    const expectedSkillId = registry.skillIdForCluster(unit.clusterId);
    if (!equalGrade(plan.grade, unit.grade) || plan.clusterId !== unit.clusterId || plan.skillId !== expectedSkillId) fail("plan unit lineage is invalid");
    const expectedPlanningState = unit.grade === 6 ? PLAN_STATES.cadenceReady : PLAN_STATES.templateOnly;
    if (plan.planningState !== expectedPlanningState || plan.contentState !== PLAN_STATES.contentLocked || plan.publicationState !== PLAN_STATES.metadataOnly) fail("plan publication state is invalid");
    validateCadence(plan);
    validateRetentionSchedule(plan);
    knownFields(plan.resourcesByAudience, ["student", "teacher"], "plan.resourcesByAudience");
    const allowedSessionIds = new Set(unit.grade === 6
      ? GRADE6_CADENCE.sessions.map(function (session) { return session.sessionId; }).concat([GRADE6_RETENTION_SCHEDULE.sessionId])
      : ["template-unit"]);
    const ids = new Set();
    ["student", "teacher"].forEach(function (audience) {
      const resources = plan.resourcesByAudience[audience];
      denseArray(resources, `plan.resourcesByAudience.${audience}`);
      if (!resources.length) fail(`plan.resourcesByAudience.${audience} is required`);
      resources.forEach(function (resource) {
        validateResource(resource, plan, audience, allowedSessionIds);
        if (ids.has(resource.resourcePlanItemId)) fail("resource plan item IDs must be unique");
        ids.add(resource.resourcePlanItemId);
      });
    });
    return true;
  }
  function buildUnitPlan(unitId) {
    const unit = findUnit(unitId);
    const skillId = registry.skillIdForCluster(unit.clusterId);
    const plan = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      planId: `rpl-${slug(unit.unitId)}-v1`,
      planVersion: 1,
      courseId: registry.COURSE_ID,
      grade: unit.grade,
      unitId: unit.unitId,
      clusterId: unit.clusterId,
      skillId,
      planningState: unit.grade === 6 ? PLAN_STATES.cadenceReady : PLAN_STATES.templateOnly,
      contentState: PLAN_STATES.contentLocked,
      publicationState: PLAN_STATES.metadataOnly,
      cadence: unit.grade === 6 ? GRADE6_CADENCE : null,
      retentionSchedule: unit.grade === 6 ? GRADE6_RETENTION_SCHEDULE : null,
      resourcesByAudience: resourceGroups(unit)
    });
    validatePlan(plan);
    return plan;
  }
  function buildGradePlans(grade) {
    const plans = registry.units.filter(function (unit) { return equalGrade(unit.grade, grade); }).map(function (unit) { return buildUnitPlan(unit.unitId); });
    if (!plans.length) fail("grade is not registered");
    return Object.freeze(plans);
  }
  function projectAudience(plan, audience) {
    if (!["student", "teacher"].includes(audience)) fail("audience is invalid");
    validatePlan(plan);
    return Object.freeze({
      schemaVersion: "gfield-k8-resource-audience-projection-v1",
      planId: plan.planId,
      planVersion: plan.planVersion,
      audience,
      contentState: plan.contentState,
      publicationState: plan.publicationState,
      resources: plan.resourcesByAudience[audience]
    });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    PLAN_STATES,
    GRADE6_CADENCE,
    GRADE6_RETENTION_SCHEDULE,
    buildUnitPlan,
    buildGradePlans,
    validatePlan,
    projectAudience
  });
});
