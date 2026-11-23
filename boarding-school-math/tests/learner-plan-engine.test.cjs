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
    priorities: [{ label: "기하·공간 추론", errorType: "strategy-gap", difficulty: "advanced", clusterId: "6.G.A" }]
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

test("Grade 7 rational-number plan opens the embedded public lesson and keeps diagnosis pending", function () {
  const input = baseInput();
  input.goalId = "school-g7-nsa";
  input.priorities = [{ label: "유리수 더하기·빼기", errorType: "concept-gap", difficulty: "core", clusterId: "7.NS.A" }];
  const plan = engine.buildPlan(input);
  assert.equal(plan.goal.clusterId, "7.NS.A");
  assert.equal(plan.diagnostic.state, "preparing");
  assert.equal(plan.diagnostic.actionLabel, "7.NS.A 단원 진단 준비 중");
  assert.equal(plan.prediction.range, null);
  assert.match(plan.materials.studentConceptHref, /cluster=7\.NS\.A.*#unit-concepts/);
  assert.match(plan.materials.teacherLessonHref, /audience=teacher.*#unit-concepts/);
  assert.match(plan.today.blocks.find(function (block) { return block.id === "concept"; }).href, /#unit-concepts/);
  const minutes = plan.today.blocks.map(function (block) { return block.minutes; });
  input.priorities[0].errorType = "strategy-gap";
  assert.deepEqual(engine.buildPlan(input).today.blocks.map(function (block) { return block.minutes; }), minutes);
  input.prediction = { range: [52, 58], confidence: "medium" };
  assert.throws(function () { engine.buildPlan(input); }, /prediction is unavailable/);
});

test("all seven diagnostic error types produce a complete daily learning budget", function () {
  [20, 45, 180].forEach(function (minutesPerDay) {
    ["prerequisite-gap", "concept-gap", "representation-error", "calculation-error", "condition-missed", "strategy-gap", "explanation-incomplete"].forEach(function (errorType) {
      const input = baseInput();
      input.availability.minutesPerDay = minutesPerDay;
      input.priorities = [{ label: "진단 우선 약점", errorType, difficulty: "core", clusterId: "6.EE.B" }];
      const plan = engine.buildPlan(input);
      assert.equal(plan.today.blocks.reduce(function (total, block) { return total + block.minutes; }, 0), minutesPerDay);
      assert.equal(plan.today.blocks.every(function (block) { return block.minutes >= 2; }), true);
      assert.equal(plan.priorities[0].errorType, errorType);
      assert.ok(plan.priorities[0].errorLabel.length > 0);
    });
  });
});
