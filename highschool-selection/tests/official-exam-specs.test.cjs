"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
require("../data/official-exam-specs.js");
require("../data/available-mocks.js");
require("../data/public-exam-profiles.js");
const policy = require("../data/standard-exam-policy.js");
const specs = globalThis.HIGHSELECT_OFFICIAL_EXAM_SPECS;
const mocks = globalThis.HIGHSELECT_AVAILABLE_MOCKS;
const keyFor = e => e.id.startsWith("wm-middle31-basic-") ? "WM:middle31-basic" : e.id === "wm-middle22-basic-r01" ? "WM:middle22-basic" : e.id.startsWith("ed-middle1-authored-") ? "ED:middle1" : e.id.startsWith("dp-middle22-transfer-") ? "DP:middle-transfer" : e.id.startsWith("wm-common1-basic-") ? "WM:common1-basic" : ({SH:"SH:high-selection",DP:"DP:common1-basic",WM:"WM:middle21-basic",ED:"ED:high-advance",SM:"SM:common1-basic"}[e.programId] || (e.id.startsWith("dg-middle1-") ? "DG:middle1" : "DG:pre-high1"));

test("every released mock agrees with its own branch/course time and count", () => {
  assert.equal(mocks.length, 45);
  assert.equal(mocks.reduce((n,e) => n + e.questionCount, 0), 1800);
  mocks.forEach(e => {
    const s = specs.editions?.[e.id] || specs.courses[keyFor(e)];
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

test('December middle22 R2 uses published endpoints without relabeling the entire gap as official rest',()=>{
 const e=mocks.find(e=>e.id==='wm-middle22-basic-mixed-r02'),s=specs.editions[e.id];
 assert.equal(s.sourceUrl,'https://blog.naver.com/wonmath563/224470731361');
 assert.equal(e.totalWindowMinutes,160);assert.equal(e.pauseLabel,'교시 사이');
 assert.equal(s.officialRestRowMinutes,10);assert.equal(s.unlabelledInterSectionMinutes,10);
 assert.equal(e.durationMinutes+e.breakMinutes,e.totalWindowMinutes);
 assert.equal(mocks.find(e=>e.id==='wm-middle22-basic-r01').breakMinutes,10);
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

test("Won transfer levels keep their different geometry scopes and breaks", () => {
  const m22=specs.courses['WM:middle22-basic'],m31=specs.courses['WM:middle31-basic'];
  assert.match(m22.scope,/중2-1 대수 기본형.*중1-2 기하 심화형.*통계 제외/);
  assert.match(m31.scope,/중2-1 대수 심화형.*중2-2 기하 심화형.*확률 포함/);
  for(const s of [m22,m31]){
    assert.equal(s.questionCount,50);assert.deepEqual(s.sectionCounts,{ALG:25,GEO:25});
    assert.deepEqual(s.sectionMinutes,{ALG:70,GEO:70});assert.equal(s.durationMinutes,140);
  }
  assert.equal(m22.breakMinutes,10);assert.equal(m31.breakMinutes,20);
  assert.equal(m31.scopeRevisedAt,'2026-09-03');assert.notEqual(m22.sourceUrl,m31.sourceUrl);
});

test("Deepthink current prehigh scope excludes the old extra middle3 range", () => {
  assert.equal(specs.courses["DG:pre-high1"].scope, "공통수학1 + 공통수학2 도형의 방정식");
  const dg = globalThis.HIGHSELECT_PUBLIC_PROFILES.profiles.find(p => p.code === "DG");
  const fact = dg.facts.find(f => f.label === "대치 2027 예비고1 범위");
  assert.equal(fact.value, specs.courses["DG:pre-high1"].scope);
  assert.equal(specs.courses["DG:middle1"].durationMinutes, 70);
  assert.match(specs.courses["DG:middle1"].note, /A·B형과 구분/);
});

 test("Dolpa middle transfer uses middle-branch timing without treating its source range as every class range",()=>{
 const transfer=specs.courses["DP:middle-transfer"];
 assert.equal(transfer.branch,"대치 중등관");assert.equal(transfer.durationMinutes,150);
 assert.equal(transfer.scopeState,"source-paper");assert.match(transfer.note,/진도별 확인/);
 assert.notEqual(transfer.scope,specs.courses["DP:common1-basic"].scope);
 });

test('Dolpa common1 basic timing is bound to the middle campus rather than Zero basic admissions',()=>{
 const common=specs.courses['DP:common1-basic'];
 assert.equal(common.branch,'대치 중등관');
 assert.equal(common.durationMinutes,150);assert.equal(common.questionCount,30);
 assert.match(common.scope,/중2.*중3/);
 assert.equal(common.sourceUrl,'https://blog.naver.com/dpmath/224407474293');
 assert.notEqual(common.sourceUrl,'https://blog.naver.com/dpmath/224426268104');
});

test('Eden middle1 entry uses elementary scope and its own official source',()=>{
 const m=specs.courses['ED:middle1'],c=specs.courses['ED:high-advance'];assert.match(m.scope,/초5.*초6/);assert.match(m.branch,/초등관/);
 assert.equal(m.durationMinutes,100);assert.equal(m.questionCount,30);assert.notEqual(m.sourceUrl,c.sourceUrl);
});
