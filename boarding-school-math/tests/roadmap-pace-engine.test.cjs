"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const engine = require("../learning/roadmap-pace-engine.js");

function results(correctCount, total) {
  return Array.from({ length: total }, function (_, index) {
    return { id: `q${index + 1}`, domainId: ["수와 연산", "식과 관계", "기하", "자료"][index % 4], correct: index < correctCount };
  });
}

function baseInput() {
  return {
    locale: "ko",
    goalId: "sasmo-primary6",
    weeksAvailable: 8,
    studyDaysPerWeek: 4,
    minutesPerDay: 45,
    observationCount: 1,
    retentionPassed: false,
    results: results(17, 25)
  };
}

test("one paper O/X result always keeps acceleration locked for a stabilization window", function () {
  const roadmap = engine.buildRoadmap(baseInput());
  assert.equal(roadmap.summary.correct, 17);
  assert.equal(roadmap.summary.total, 25);
  assert.equal(roadmap.stability.state, "observing");
  assert.equal(roadmap.stability.accelerationLocked, true);
  assert.equal(roadmap.stability.stabilizationWeeks, 2);
  assert.match(roadmap.comment, /2주 동안 현재 속도를 유지/);
});

test("a second stable observation can unlock the smallest feasible pace branch", function () {
  const input = baseInput();
  input.observationCount = 2;
  input.retentionPassed = true;
  const roadmap = engine.buildRoadmap(input);
  assert.equal(roadmap.stability.accelerationLocked, false);
  assert.equal(roadmap.stability.stabilizationWeeks, 0);
  const selected = roadmap.pace.options.find(function (option) { return option.id === roadmap.pace.selectedOptionId; });
  assert.equal(selected.feasible, true);
  assert.equal(roadmap.pace.options.slice(0, roadmap.pace.options.indexOf(selected)).every(function (option) { return !option.feasible; }), true);
});

test("an impossible deadline says to extend the target instead of inventing feasibility", function () {
  const input = baseInput();
  input.weeksAvailable = 2;
  input.studyDaysPerWeek = 1;
  input.minutesPerDay = 20;
  const roadmap = engine.buildRoadmap(input);
  assert.equal(roadmap.pace.targetFeasible, false);
  assert.ok(roadmap.pace.extraWeeks > 0);
  assert.match(roadmap.decision, /목표일/);
});

test("English and Chinese curriculum labels are country-specific and never expose Korean workbook brands", function () {
  const english = baseInput();
  english.locale = "en";
  const chinese = baseInput();
  chinese.locale = "zh-Hans";
  const englishRoadmap = engine.buildRoadmap(english);
  const chineseRoadmap = engine.buildRoadmap(chinese);
  assert.equal(englishRoadmap.curriculum.id, "us-school-math");
  assert.equal(chineseRoadmap.curriculum.id, "sg-school-math");
  assert.match(englishRoadmap.curriculum.label, /U\.S\./);
  assert.match(chineseRoadmap.curriculum.label, /新加坡/);
  assert.doesNotMatch(JSON.stringify([englishRoadmap, chineseRoadmap]), /소마|SOMA|Soma/u);
});
