'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../data/available-mocks.js');
require('../data/academy-engagement.js');
const nav = require('../promo/course-navigation.js');
const mocks = globalThis.HIGHSELECT_AVAILABLE_MOCKS;
const programs = globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs;

test('all 23 released editions remain reachable in exactly one advertised course', () => {
  const visible = programs.flatMap(p => p.courses.flatMap(c => nav.examsFor(p.code,c.id,mocks).map(e => e.id)));
  assert.equal(visible.length,23);
  assert.equal(new Set(visible).size,23);
  assert.deepEqual([...visible].sort(),mocks.map(e => e.id).sort());
});

test('Dolpa exposes the available common1 banner first without suggesting other levels are released', () => {
  const dp = nav.coursesFor(programs.find(p => p.code === 'DP'),mocks);
  assert.equal(dp[0].id,'common1-basic');
  assert.equal(dp[0].exams.length,2);
  assert.ok(dp.slice(1).every(c => c.exams.length === 0));
  assert.equal(nav.examsFor('DP','common2-basic',mocks).length,0);
});

test('Deepthink starting and prehigh editions never cross course boundaries', () => {
  const middle = nav.examsFor('DG','middle1',mocks);
  const high = nav.examsFor('DG','pre-high1',mocks);
  assert.equal(middle.length,2);
  assert.ok(middle.every(e => e.durationMinutes === 70));
  assert.equal(high.length,1);
  assert.equal(high[0].durationMinutes,90);
  assert.equal(nav.examsFor('DG','level-entry',mocks).length,0);
});

test('unknown or nonreleased editions do not silently appear under an academy', () => {
  assert.deepEqual(nav.examsFor('DP','common1-basic',[{id:'unknown',programId:'DP',mode:'released'}]),[]);
  assert.deepEqual(nav.examsFor('DP','common1-basic',[{id:'dp-common1-r02',programId:'DP',mode:'review_pending'}]),[]);
  assert.deepEqual(nav.examsFor('WM','common2-basic',mocks),[]);
});

test('actual final-round naming is preserved', () => {
  assert.equal(nav.roundLabel(mocks.find(e => e.id === 'sh-selection-r05')),'최종(마무리)');
  assert.equal(nav.roundLabel(mocks.find(e => e.id === 'dp-common1-r02')),'2회');
});

// A new Won high-entry paper must never replace the existing middle-entry IDs.
test('Won common1 and middle21 expose five common1 and four middle21 editions with separate time and scope', () => {
 const cm=nav.examsFor('WM','common1-basic',mocks),middle=nav.examsFor('WM','middle21-basic',mocks);
 assert.equal(cm.length,5);assert.equal(middle.length,4);
 assert.ok(cm.every(e=>e.id.startsWith('wm-common1-basic-')&&e.questionCount===50&&e.durationMinutes===180&&e.sectionMinutes.ALG===90&&e.sectionMinutes.GEO===90&&e.breakMinutes===20));
 assert.ok(middle.every(e=>e.durationMinutes===140&&e.sectionMinutes.ALG===70));
 assert.deepEqual(cm.map(e=>nav.selectionForExam(e.id)),cm.map(()=>({program:'WM',course:'common1-basic'})));
 assert.ok(cm.every(e=>/중2-1.*중3-1/.test(e.scope)&&/확률/.test(e.scope)));
});

test('Won final round follows rounds 1–4 within the common1 course',()=>{
 const cm=nav.examsFor('WM','common1-basic',mocks);
 assert.deepEqual(cm.map(e=>nav.roundLabel(e)),['1회','2회','3회','4회','최종(마무리)']);
 assert.equal(cm[4].id,'wm-common1-basic-final');
 assert.equal(nav.examsFor('WM','middle21-basic',mocks).some(e=>e.id===cm[4].id),false);
});
