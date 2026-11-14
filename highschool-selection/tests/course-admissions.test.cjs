'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../data/academy-engagement.js');
const admissions = require('../data/course-admissions.js');
const notice = (academy,title,url='https://blog.naver.com/example/1') => ({academy,title,url});

test('each advertised Dolpa, Won and Eden course has its own admission record', () => {
  for (const p of HIGHSELECT_ACADEMY_ENGAGEMENT.programs.filter(p=>['DP','WM','ED'].includes(p.code))) {
    assert.equal(new Set(p.courses.map(c=>c.id)).size,p.courses.length);
    for (const c of p.courses) {
      const info=admissions.forCourse(p.code,c.id);
      assert.ok(info,p.code+':'+c.id);
      for (const link of info.links) assert.equal(new URL(link.url).hostname,'blog.naver.com');
    }
  }
});
test('course filters distinguish basic levels, dual courses and unrelated academies', () => {
  assert.equal(admissions.matchesNotice('WM','common1-basic',notice('WM',"12월 '공수1 기본반' 입학테스트")),true);
  assert.equal(admissions.matchesNotice('WM','common1-basic',notice('WM',"실력공수1,2 듀얼반 편입")),false);
  assert.equal(admissions.matchesNotice('WM','high-dual',notice('WM',"실력공수1,2 듀얼반 편입")),true);
  assert.equal(admissions.matchesNotice('WM','common2-basic',notice('WM',"공수1 기본반")),false);
  assert.equal(admissions.matchesNotice('ED','common1-skill',notice('ED',"공통수학1 기본반 모집")),false);
  assert.equal(admissions.matchesNotice('ED','high-advance',notice('WM',"공통수학1 기본반 모집")),false);
  assert.equal(admissions.matchesNotice('ED','does-not-exist',notice('ED',"공통수학1 기본반")),false);
});
test('a shared official timetable belongs only to its own academy and supported courses', () => {
  const zero=notice('DP','12월 개강시간표 안내','https://blog.naver.com/dpmath/224426268104');
  assert.equal(admissions.matchesNotice('DP','common2-basic',zero),true);
  assert.equal(admissions.matchesNotice('DP','algebra-basic',zero),true);
  assert.equal(admissions.matchesNotice('WM','algebra-basic',zero),false);
  assert.equal(admissions.matchesNotice('DP','middle1',zero),false);
  const links=admissions.forCourse('DP','common1-basic').links;
  assert.ok(links.some(x=>x.note.includes('중등관')&&x.note.includes('150분')));
  assert.ok(links.some(x=>x.note.includes('제로관')&&x.note.includes('120분')));
});

test('admission guidance cannot enable an unprepared course application or sale', () => {
  const policy=require('../data/standard-exam-policy.js');
  require('../data/catalog.js');
  for (const [program,course] of [['WM','algebra-direct'],['WM','common2-basic'],['ED','algebra-skill'],['ED','calculus1-basic'],['ED','geometry-basic']]) {
    const state=policy.resolve(program,course,HIGHSELECT_CATALOG);
    assert.equal(state.standardExamId,null);
    assert.equal(state.canApply,false);
    assert.equal(state.canSell,false);
    assert.equal(state.progress.targetQuestionCount,null);
  }
});
