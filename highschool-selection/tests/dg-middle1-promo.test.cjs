"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
require("../data/academy-engagement.js");
require("../data/official-exam-specs.js");
const engagement = globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT;
const policy = require("../data/standard-exam-policy.js");

const mocks = [
  { id: "dg-pre-high1-r01", programId: "DG", title: "깊은생각 예비고1 입학 대비 1회", scope: "공통수학1·공통수학2", questionCount: 30, durationMinutes: 90, mode: "released" },
  { id: "dg-middle1-entry-r01", programId: "DG", title: "깊은생각 중1 시작반 입반 대비 1회", scope: "초5·초6 누적", questionCount: 30, durationMinutes: 70, mode: "released" },
  { id: "dg-middle1-entry-r02", programId: "DG", title: "깊은생각 중1 시작반 입반 대비 2회", scope: "초5·초6 누적", questionCount: 30, durationMinutes: 70, mode: "released" },
  { id: "dp-common1-v14-pilot", programId: "DP", title: "돌파 1회", scope: "중2·중3", questionCount: 30, durationMinutes: 150, mode: "released" }
];

function promo(hash = "#academy=DG") {
  const nodes = new Map();
  const element = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: "", textContent: "", dataset: {} });
    return nodes.get(id);
  };
  const context = vm.createContext({
    HIGHSELECT_PUBLIC_PROFILES: { profiles: [], sources: {}, updatedAt: "", evidencePolicy: "" },
    HIGHSELECT_ACADEMY_ENGAGEMENT: engagement,
    HIGHSELECT_STANDARD_EXAM_POLICY: policy,
    HIGHSELECT_CATALOG: { exams: [] },
    HIGHSELECT_AVAILABLE_MOCKS: mocks,
    HIGHSELECT_OFFICIAL_EXAM_SPECS: globalThis.HIGHSELECT_OFFICIAL_EXAM_SPECS,
    URL, URLSearchParams,
    location: { hash, href: "https://lete-on.gfieldacademy.net/highschool-selection/promo/" + hash },
    document: {
      body: { dataset: {} },
      getElementById: element,
      querySelector: element
    },
    window: { addEventListener() {} }
  });
  const html = fs.readFileSync(path.join(__dirname, "..", "promo", "index.html"), "utf8");
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]).join("\n");
  vm.runInContext(script, context);
  return { context, stage: element("academy-course-stage").innerHTML };
}

test("DG middle1 is a separate elementary-scope course with no legacy release", () => {
  const dg = engagement.programs.find(program => program.code === "DG");
  const course = dg.courses.find(item => item.id === "middle1");
  assert.equal(course.label, "중1 시작반");
  assert.match(course.scope, /초5·초6/);
  assert.match(course.scope, /70분/);
  assert.ok(dg.courses.some(item => item.id === "pre-high1"));
  const legacy = policy.resolve("DG", "middle1", { exams: [] });
  assert.equal(legacy.standardExamId, null);
  assert.equal(legacy.progress.targetQuestionCount, 30);
  assert.equal(legacy.responseMix.objective, 0);
  assert.equal(legacy.responseMix.status, "observed");
  assert.equal(legacy.canApply, false);
  assert.equal(legacy.canSell, false);
});

test("DG academy list keeps middle1 rounds separate from pre-high1", () => {
  const { stage } = promo();
  const middle = stage.match(/<section data-mock-course="middle1"[\s\S]*?<\/section>/)?.[0];
  const high = stage.match(/<section data-mock-course="pre-high1"[\s\S]*?<\/section>/)?.[0];
  assert.ok(middle);
  assert.ok(high);
  assert.match(middle, /exam=dg-middle1-entry-r01/);
  assert.match(middle, /exam=dg-middle1-entry-r02/);
  assert.doesNotMatch(middle, /exam=dg-pre-high1-r01/);
  assert.match(high, /exam=dg-pre-high1-r01/);
  assert.doesNotMatch(high, /exam=dg-middle1-entry/);
  assert.equal((stage.match(/class="course-option" href="\.\.\/login/g) || []).length, 3);
});

test("middle1 course detail offers both actual rounds and the official elementary duration", () => {
  const { stage } = promo("#academy=DG&course=middle1");
  const detail = stage.match(/<section class="course-detail"[\s\S]*?<\/section>/)?.[0];
  assert.ok(detail);
  assert.match(detail, /70분/);
  assert.match(detail, /aria-label="회차별 응시"/);
  assert.match(detail, /exam=dg-middle1-entry-r01/);
  assert.match(detail, /exam=dg-middle1-entry-r02/);
  assert.match(detail, />1회 응시</);
  assert.match(detail, />2회 응시</);
  assert.doesNotMatch(detail, /exam=dg-pre-high1-r01/);
});

test("pre-high1 keeps its own scope and ordinary academy lists stay ungrouped", () => {
  const high = promo("#academy=DG&course=pre-high1").stage.match(/<section class="course-detail"[\s\S]*?<\/section>/)?.[0];
  assert.match(high, /90분/);
  assert.match(high, /exam=dg-pre-high1-r01/);
  assert.doesNotMatch(high, /exam=dg-middle1-entry/);
  const other = promo("#academy=DP").stage;
  assert.match(other, /exam=dp-common1-v14-pilot/);
  assert.doesNotMatch(other, /data-mock-course=/);
  assert.doesNotMatch(other, /exam=dg-/);
});
