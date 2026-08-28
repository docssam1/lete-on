const assert = require("node:assert/strict");
const test = require("node:test");
const registry = require("../curriculum/us-k8-content-registry.js");
const resources = require("../resources/k8-resource-plan.js");

function allPlans() {
  return ["K", 1, 2, 3, 4, 5, 6, 7, 8].flatMap(function (grade) {
    return resources.buildGradePlans(grade);
  });
}

function componentCount(entries, sessionId, resourceType) {
  return entries
    .filter(function (entry) { return entry.sessionId === sessionId && entry.resourceType === resourceType; })
    .flatMap(function (entry) { return entry.plannedComponents; })
    .reduce(function (total, component) { return total + component.plannedCount; }, 0);
}

test("every verified K-8 unit receives one rights-locked student/teacher resource plan", function () {
  const plans = allPlans();
  assert.equal(plans.length, registry.units.length);
  assert.equal(new Set(plans.map(function (plan) { return plan.planId; })).size, registry.units.length);
  plans.forEach(function (plan) {
    assert.equal(resources.validatePlan(plan), true);
    assert.equal(plan.courseId, "us-core-k8");
    assert.equal(plan.contentState, resources.PLAN_STATES.contentLocked);
    assert.equal(plan.publicationState, resources.PLAN_STATES.metadataOnly);
    assert.ok(plan.resourcesByAudience.student.length > 0);
    assert.ok(plan.resourcesByAudience.teacher.length > 0);
    plan.resourcesByAudience.student.forEach(function (resource) {
      assert.equal(resource.audience, "student");
      assert.equal(resource.deliveryRequirement, "authenticated-student-only");
    });
    plan.resourcesByAudience.teacher.forEach(function (resource) {
      assert.equal(resource.audience, "teacher");
      assert.equal(resource.deliveryRequirement, "authenticated-teacher-or-admin-only");
    });
  });
});

test("Grade 6 uses a school-configurable six-session cadence while keeping level on resource records", function () {
  const plans = resources.buildGradePlans(6);
  assert.equal(plans.length, 10);
  plans.forEach(function (plan) {
    assert.equal(plan.planningState, resources.PLAN_STATES.cadenceReady);
    assert.equal(plan.cadence.cadenceProfileId, "grade6-core-3week-2x75-v1");
    assert.equal(plan.cadence.weeksPerUnit, 3);
    assert.equal(plan.cadence.sessionsPerWeek, 2);
    assert.equal(plan.cadence.minutesPerSession, 75);
    assert.equal(plan.cadence.homeBlocksPerWeek, 2);
    assert.equal(plan.cadence.minutesPerHomeBlock, 30);
    assert.equal(plan.cadence.schoolMayOverride, true);
    assert.equal(plan.cadence.sessions.length, 6);
    assert.deepEqual(plan.cadence.sessions.map(function (session) { return session.sequence; }), [1, 2, 3, 4, 5, 6]);
    assert.equal(plan.cadence.sessions.some(function (session) { return Object.hasOwn(session, "levelId"); }), false);
    assert.equal(plan.retentionSchedule.minimumDelayDays, 7);
    assert.equal(plan.retentionSchedule.requiresSeparateAttempt, true);

    const studentTypes = new Set(plan.resourcesByAudience.student.map(function (resource) { return resource.resourceType; }));
    const teacherTypes = new Set(plan.resourcesByAudience.teacher.map(function (resource) { return resource.resourceType; }));
    ["concept-workbook", "guided-practice", "homework", "quiz", "test", "student-report"].forEach(function (type) { assert.equal(studentTypes.has(type), true); });
    ["lesson-plan", "answer-key", "solution-guide", "rubric", "assignment-builder", "teacher-report"].forEach(function (type) { assert.equal(teacherTypes.has(type), true); });

    assert.equal(componentCount(plan.resourcesByAudience.student, "g6-w1-s1-entry-screener", "quiz"), 4);
    assert.equal(componentCount(plan.resourcesByAudience.student, "g6-w3-s1-unit-mastery", "test"), 6);
    assert.equal(componentCount(plan.resourcesByAudience.student, "g6-delayed-retention", "quiz"), 4);
    const masteryLevels = new Set(plan.resourcesByAudience.student
      .filter(function (resource) { return resource.sessionId === "g6-w3-s1-unit-mastery" && resource.resourceType === "test"; })
      .map(function (resource) { return resource.levelId; }));
    assert.deepEqual([...masteryLevels].sort(), ["advanced", "core", "foundation"]);
    const signedAssessmentResources = plan.resourcesByAudience.student.filter(function (resource) {
      return ["unit-screener", "unit-mastery", "retention-check"].includes(resource.testType);
    });
    assert.ok(signedAssessmentResources.length > 0);
    signedAssessmentResources.forEach(function (resource) { assert.equal(resource.signedItemRequired, true); });
    plan.resourcesByAudience.student
      .filter(function (resource) { return resource.testType === "retention-check"; })
      .forEach(function (resource) { assert.equal(resource.sessionId, "g6-delayed-retention"); });
  });
});

test("non-Grade-6 plans remain templates and audience projection never mixes teacher resources", function () {
  const plan = resources.buildGradePlans(5)[0];
  assert.equal(plan.planningState, resources.PLAN_STATES.templateOnly);
  assert.equal(plan.cadence, null);
  assert.equal(plan.retentionSchedule, null);
  assert.equal(plan.resourcesByAudience.student.length, 6);
  assert.equal(plan.resourcesByAudience.teacher.length, 6);
  const student = resources.projectAudience(plan, "student");
  const teacher = resources.projectAudience(plan, "teacher");
  assert.equal(student.resources.every(function (resource) { return resource.audience === "student"; }), true);
  assert.equal(teacher.resources.every(function (resource) { return resource.audience === "teacher"; }), true);
});

test("resource plans reject item, answer, solution, or learner payloads", function () {
  const altered = JSON.parse(JSON.stringify(resources.buildGradePlans(6)[0]));
  altered.resourcesByAudience.student[0].answer = "blocked";
  assert.throws(function () { resources.validatePlan(altered); }, /not allowed/);
});
