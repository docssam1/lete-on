"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../learning/learner-plan-engine.js");

function baseInput() {
  return {
    goalId: "sasmo-primary6",
    startDate: "2026-09-21",
    targetDate: "2026-11-16",
    availability: { studyDaysPerWeek: 4, minutesPerDay: 45 },
    priorities: [{ label: "기하·공간 추론", errorType: "reasoning-gap", difficulty: "advanced", clusterId: "6.G.A" }]
  };
}

test("plan uses a time budget and does not invent a score before diagnostic evidence", function () {
  const plan = engine.buildPlan(baseInput());
  assert.equal(plan.goal.id, "sasmo-primary6");
  assert.equal(plan.calendar.calendarWeeks, 8);
  assert.equal(plan.calendar.studyDays, 32);
  assert.equal(plan.calendar.usableMinutes, 1152);
  assert.equal(plan.prediction.state, "diagnostic-required");
  assert.equal(plan.diagnostic.state, "diagnostic-required");
  assert.equal(plan.today.totalMinutes, 45);
  assert.ok(plan.today.totalProblemCount >= 5);
  assert.match(plan.materials.studentWorkbookHref, /cluster=6.G.A/);
  assert.match(plan.materials.teacherWorkbookHref, /audience=teacher/);
});

test("prediction appears only when supplied as diagnostic evidence", function () {
  const input = baseInput();
  input.prediction = { range: [52, 58], confidence: "medium" };
  const plan = engine.buildPlan(input);
  assert.deepEqual(plan.prediction.range, [52, 58]);
  assert.equal(plan.prediction.confidence, "medium");
  assert.equal(plan.diagnostic.state, "evidence-connected");
});

test("plan retains spaced rechecks and rejects invalid daily capacity", function () {
  const plan = engine.buildPlan(baseInput());
  assert.deepEqual(plan.retention.map(function (entry) { return entry.afterDays; }), [1, 3, 7, 14]);
  const invalid = baseInput();
  invalid.availability.minutesPerDay = 10;
  assert.throws(function () { engine.buildPlan(invalid); }, /minutesPerDay/);
});
