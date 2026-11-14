"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
require("../data/official-exam-specs.js");
require("../data/available-mocks.js");
require("../data/public-exam-profiles.js");
const policy = require("../data/standard-exam-policy.js");
const specs = globalThis.HIGHSELECT_OFFICIAL_EXAM_SPECS;
const mocks = globalThis.HIGHSELECT_AVAILABLE_MOCKS;
const keyFor = e => e.id.startsWith("wm-common1-basic-") ? "WM:common1-basic" : ({SH:"SH:high-selection",DP:"DP:common1-basic",WM:"WM:middle21-basic",ED:"ED:high-advance",SM:"SM:common1-basic"}[e.programId] || (e.id.startsWith("dg-middle1-") ? "DG:middle1" : "DG:pre-high1"));

test("every released mock agrees with its own branch/course time and count", () => {
  assert.equal(mocks.length, 22);
  assert.equal(mocks.reduce((n,e) => n + e.questionCount, 0), 870);
  mocks.forEach(e => {
    const s = specs.courses[keyFor(e)];
    assert.ok(s, e.id);
    assert.match(s.branch, /대치/);
    if (s.durationState === "official") {
      assert.equal(e.durationMinutes, s.durationMinutes, e.id);
      assert.equal(e.questionCount, s.questionCount, e.id);
    } else if (s.durationState === "owner-confirmed") {
      assert.equal(e.durationMinutes, s.durationMinutes, e.id);
      assert.equal(s.questionCount, null);
    } else {
      assert.equal(s.durationMinutes, null);
      assert.equal(e.durationMinutes, s.mockDurationMinutes);
    }
    if (s.sectionMinutes) {
      assert.deepEqual(e.sectionMinutes, s.sectionMinutes);
      assert.equal(e.breakMinutes, s.breakMinutes);
      assert.equal(e.durationMinutes, Object.values(s.sectionMinutes).reduce((a,b) => a+b, 0));
    }
  });
});

test("Won basic courses retain different ranges and durations after the October revision", () => {
  const m = specs.courses["WM:middle21-basic"], h = specs.courses["WM:common1-basic"];
  assert.equal(m.durationMinutes, 140);
  assert.equal(h.durationMinutes, 180);
  assert.match(m.scope, /통계 제외/);
  assert.match(h.scope, /확률 포함/);
  assert.notEqual(m.sourceUrl, h.sourceUrl);
  assert.equal(policy.courseBlueprints.WM["middle21-basic"].targetQuestionCount, 50);
});

test("Hwangso uses the owner-confirmed time while unconfirmed branches stay separate", () => {
  assert.equal(specs.courses["SH:high-selection"].durationState, "owner-confirmed");
  assert.equal(specs.courses["SH:high-selection"].durationMinutes, 110);
  assert.equal(specs.courses["SH:high-selection"].durationConfirmedAt, "2026-11-06");
  const sh = globalThis.HIGHSELECT_PUBLIC_PROFILES.profiles.find(p => p.code === "SH");
  assert.equal(sh.cutline.state, "needs-review");
  assert.ok(!JSON.stringify(sh).match(/SONGPA|WIRYE|위례|송파/));
  const dg = specs.branchChecks.find(s => s.programId === "DG");
  assert.equal(dg.branch, "분당");
  assert.equal(dg.scope, null);
  assert.equal(dg.durationMinutes, null);
});

test("Deepthink current prehigh scope excludes the old extra middle3 range", () => {
  assert.equal(specs.courses["DG:pre-high1"].scope, "공통수학1 + 공통수학2 도형의 방정식");
  const dg = globalThis.HIGHSELECT_PUBLIC_PROFILES.profiles.find(p => p.code === "DG");
  const fact = dg.facts.find(f => f.label === "대치 2027 예비고1 범위");
  assert.equal(fact.value, specs.courses["DG:pre-high1"].scope);
  assert.equal(specs.courses["DG:middle1"].durationMinutes, 70);
  assert.match(specs.courses["DG:middle1"].note, /A·B형과 구분/);
});
