'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../data/available-mocks.js');
require('../data/academy-engagement.js');
const nav = require('../promo/course-navigation.js');
const mocks = globalThis.HIGHSELECT_AVAILABLE_MOCKS;
const programs = globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs;

test('all 40 released editions remain reachable in exactly one advertised course', () => {
  const visible = programs.flatMap(p => p.courses.flatMap(c => nav.examsFor(p.code,c.id,mocks).map(e => e.id)));
  assert.equal(visible.length,40);
  assert.equal(new Set(visible).size,visible.length);
  assert.deepEqual([...visible].sort(),mocks.map(e => e.id).sort());
});

test('Dolpa keeps common1 and middle transfer papers in their own available courses', () => {
  const dp = nav.coursesFor(programs.find(p => p.code === 'DP'),mocks);
  assert.equal(dp[0].id,'common1-basic');
  assert.equal(dp[0].exams.length,5);
  assert.deepEqual(dp[0].exams.map(e=>e.id),['dp-common1-v14-pilot','dp-common1-r02','dp-common1-r03','dp-common1-r04','dp-common1-final']);
  assert.deepEqual(dp[0].exams.map(e=>nav.roundLabel(e)),['1회','2회','3회','4회','최종(마무리)']);
  const r03=dp[0].exams[2];
  assert.deepEqual(nav.selectionForExam(r03.id),{program:'DP',course:'common1-basic'});
  assert.match(r03.scope,/중2-1~중3-2/);
  assert.deepEqual([r03.questionCount,r03.durationMinutes,r03.pageCount,r03.answerPageCount,r03.analysisPageCount],[30,150,16,15,4]);
  const r04=dp[0].exams[3];
  assert.deepEqual(nav.selectionForExam(r04.id),{program:'DP',course:'common1-basic'});
  assert.match(r04.scope,/중2-1~중3-2/);
  assert.deepEqual([r04.questionCount,r04.durationMinutes,r04.pageCount,r04.answerPageCount,r04.analysisPageCount],[30,150,16,15,4]);
  const final=dp[0].exams[4];
  assert.equal(final.id,'dp-common1-final');
  assert.deepEqual(nav.selectionForExam(final.id),{program:'DP',course:'common1-basic'});
  assert.match(final.scope,/중2-1~중3-2/);
  assert.deepEqual([final.questionCount,final.durationMinutes,final.pageCount,final.answerPageCount,final.analysisPageCount],[30,150,17,16,4]);
  assert.ok(dp.filter(c => !['common1-basic','middle-transfer'].includes(c.id)).every(c => c.exams.length === 0));
  assert.equal(nav.examsFor('DP','common2-basic',mocks).length,0);
  const transfer=nav.examsFor('DP','middle-transfer',mocks);
  assert.deepEqual(transfer.map(e=>e.id),['dp-middle22-transfer-r01','dp-middle22-transfer-r02','dp-middle22-transfer-r03','dp-middle22-transfer-r04','dp-middle22-transfer-final']);
  assert.match(transfer[0].scope,/중1-1~중2-1/);
  assert.deepEqual(transfer.map(e=>nav.roundLabel(e)),['1회','2회','3회','4회','최종(마무리)']);
  assert.ok(transfer.every(e=>e.questionCount===30&&e.durationMinutes===150));
  assert.deepEqual(nav.selectionForExam(transfer[0].id),{program:'DP',course:'middle-transfer'});
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
test('Won common1 and middle21 expose five common1 and five middle21 editions with separate time and scope', () => {
 const cm=nav.examsFor('WM','common1-basic',mocks),middle=nav.examsFor('WM','middle21-basic',mocks);
 assert.equal(cm.length,5);assert.equal(middle.length,5);
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

test('Won middle22 transfer preserves historical R1 and adds the latest-timetable R2',()=>{
 const transfer=nav.examsFor('WM','middle22-basic',mocks);
 assert.deepEqual(transfer.map(e=>e.id),['wm-middle22-basic-r01','wm-middle22-basic-mixed-r02','wm-middle22-basic-mixed-r03','wm-middle22-basic-mixed-r04','wm-middle22-basic-mixed-final']);
 assert.deepEqual(nav.selectionForExam(transfer[0].id),{program:'WM',course:'middle22-basic'});
 assert.match(transfer[0].scope,/중2-1 대수 기본형.*중1-2 기하 심화형.*통계 제외/);
 assert.equal(transfer[0].questionCount,50);assert.equal(transfer[0].durationMinutes,140);
 assert.equal(transfer[0].breakMinutes,10);assert.deepEqual(transfer[0].sectionMinutes,{ALG:70,GEO:70});
 assert.deepEqual([transfer[0].pageCount,transfer[0].answerPageCount,transfer[0].analysisPageCount],[19,20,5]);
 const r2=transfer[1];
 assert.deepEqual(nav.selectionForExam(r2.id),{program:'WM',course:'middle22-basic'});
 assert.deepEqual([r2.questionCount,r2.pageCount,r2.answerPageCount,r2.analysisPageCount],[50,23,22,5]);
 assert.deepEqual(r2.sectionMinutes,{ALG:70,GEO:70});
 assert.equal(r2.durationMinutes,140);assert.equal(r2.totalWindowMinutes,160);
 assert.equal(r2.breakMinutes,20);assert.equal(r2.pauseLabel,'교시 사이');
 for(const c of ['middle21-basic','common1-basic','middle31-basic','middle-transfer'])assert.ok(nav.examsFor('WM',c,mocks).every(e=>e.id!==r2.id));
 for(const c of ['middle21-basic','common1-basic','middle31-basic','middle-transfer'])assert.ok(nav.examsFor('WM',c,mocks).every(e=>e.id!==transfer[0].id));
});

test('Eden elementary-entry and common1 papers remain separate despite sharing a 100-minute duration',()=>{
 const middle=nav.examsFor('ED','middle1',mocks),common=nav.examsFor('ED','high-advance',mocks);
 assert.deepEqual(middle.map(e=>e.id),['ed-middle1-authored-r01']);assert.equal(common.length,2);
 assert.match(middle[0].scope,/초5.*초6/);assert.ok(common.every(e=>/중2.*중3/.test(e.scope)));
 assert.equal(middle[0].pageCount,10);assert.equal(middle[0].answerPageCount,10);assert.equal(middle[0].analysisPageCount,3);
 assert.deepEqual(nav.selectionForExam(middle[0].id),{program:'ED',course:'middle1'});
});

test('Won middle31 transfer is distinct from middle22 and common1',()=>{
 const transfer=nav.examsFor('WM','middle31-basic',mocks);
 assert.deepEqual(transfer.map(e=>e.id),['wm-middle31-basic-r01','wm-middle31-basic-r02']);
 const e=transfer[0];assert.deepEqual(nav.selectionForExam(e.id),{program:'WM',course:'middle31-basic'});
 assert.match(e.scope,/중2-1 대수 심화형.*중2-2 기하 심화형.*확률 포함/);
 assert.equal(e.questionCount,50);assert.equal(e.durationMinutes,140);
 assert.deepEqual(e.sectionMinutes,{ALG:70,GEO:70});assert.equal(e.breakMinutes,20);
 assert.deepEqual([e.pageCount,e.answerPageCount,e.analysisPageCount],[16,17,5]);
 for(const course of ['middle21-basic','middle22-basic','common1-basic','middle-transfer'])assert.ok(nav.examsFor('WM',course,mocks).every(x=>x.id!==e.id));
});

test('Won middle31 round 2 retains its own probability scope, official rest and protected documents',()=>{
 const e=nav.examsFor('WM','middle31-basic',mocks).find(e=>e.id==='wm-middle31-basic-r02');
 assert.ok(e);assert.deepEqual(nav.selectionForExam(e.id),{program:'WM',course:'middle31-basic'});
 assert.match(e.scope,/중2-1 대수 심화형.*중2-2 기하 심화형.*확률 포함/);
 assert.deepEqual([e.questionCount,e.pageCount,e.answerPageCount,e.analysisPageCount],[50,22,28,5]);
 assert.deepEqual(e.sectionMinutes,{ALG:70,GEO:70});assert.equal(e.pauseLabel,'휴식');
 assert.equal(e.breakMinutes,20);assert.equal(e.durationMinutes,140);assert.equal(e.totalWindowMinutes,160);
 for(const course of ['middle21-basic','middle22-basic','common1-basic','middle-transfer'])assert.ok(nav.examsFor('WM',course,mocks).every(x=>x.id!==e.id));
 assert.ok(!['questions','answers','pages','answerPages'].some(key=>key in e));
});


test('Won middle21 final follows four original rounds with its own protected page counts',()=>{
 const middle=nav.examsFor('WM','middle21-basic',mocks);
 assert.deepEqual(middle.map(e=>nav.roundLabel(e)),['1회','2회','3회','4회','최종(마무리)']);
 const final=middle[4];assert.equal(final.id,'wm-middle21-basic-final');
 assert.equal(final.questionCount,50);assert.equal(final.durationMinutes,140);
 assert.deepEqual(final.sectionMinutes,{ALG:70,GEO:70});assert.equal(final.breakMinutes,20);
 assert.deepEqual([final.pageCount,final.answerPageCount,final.analysisPageCount],[19,20,5]);
 assert.deepEqual(nav.selectionForExam(final.id),{program:'WM',course:'middle21-basic'});
 for(const course of ['common1-basic','middle22-basic','middle31-basic','middle-transfer'])assert.ok(nav.examsFor('WM',course,mocks).every(e=>e.id!==final.id));
});
