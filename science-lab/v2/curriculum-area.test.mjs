import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink,loadJudge} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {BANK} from './units-index.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
const cases=[['c22-s32-u04','생명','4과08'],['c22-s42-u04','환경','4과16']];
const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{
 importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href),
}).runInContext(vm.createContext({withThink}));
test('감염병·기후변화의 실제 문제은행·수업·차례는 과학과 사회 영역을 함께 사용한다',async()=>{
 for(const[unit,,standard]of cases){
  const mod=await loaders[unit](),classroom=await revisedClassroom(unit,mod);
  assert.equal(mod.unit.domain,'과학과 사회');
  const {taxonomy}=await import('../data/units/'+unit+'.taxonomy.js');
  assert.equal(taxonomy.area,'과학과 사회');
  assert(taxonomy.standards.every(s=>s.code.startsWith(standard)));
  assert.equal(classroom.classroomItems.length,12);
  for(const q of [...mod.items,...(mod.similar||[]),...(mod.source||[]),...classroom.classroomItems]){
   assert.equal(q.taxonomy.area,'과학과 사회',q.id);
  }
  assert.equal(BANK[unit].n,unit==='c22-s32-u04'?0:6);
 }
});
test('영역 표기 수정은 과거 시험지를 읽기 전용으로 만들거나 이전 답안·채점을 바꾸지 않는다',async()=>{
 for(const[unit,oldArea]of cases){
  const mod=await loaders[unit](),questions=[...(mod.source||[]),...(mod.similar||[]),...mod.items];
  const prior=structuredClone(questions);
  for(const q of prior)q.taxonomy.area=oldArea;
  const answers=Object.fromEntries(prior.map(q=>[q.id,'이전에 적은 답']));
  const paper=snapshotDailyPaper(prior),before=JSON.stringify(paper),state={paper,answers};
  const resolved=resolveDailyPaper(questions,state);
  assert.equal(resolved.readOnly,false);assert.equal(resolved.reason,'current');
  assert.equal(JSON.stringify(paper),before);assert.deepEqual(state.answers,answers);
  assert.deepEqual(resolved.questions,prior);
  const judge=await loadJudge(unit);
  const selected=questions.filter(q=>q.answerContract.type==='single-choice'&&typeof q.answerContract.answer==='number');
  assert(selected.length>0);
  for(const q of selected){
   const old=prior.find(p=>p.id===q.id),correct=q.answerContract.answer,wrong=(correct+1)%q.choices.length;
   assert.deepEqual(gradeDaily(q,correct,{judge,misc:mod.misc}),gradeDaily(old,correct,{judge,misc:mod.misc}));
   assert.deepEqual(gradeDaily(q,wrong,{judge,misc:mod.misc}),gradeDaily(old,wrong,{judge,misc:mod.misc}));
  }
 }
});

test('the two bank writers keep the current science-and-society area when rebuilding',async()=>{
 for(const[unit]of cases){
  const short=unit.replaceAll('-',''),code=fs.readFileSync(new URL('../../scripts/bank-science-'+short+'.mjs',import.meta.url),'utf8'),mod=await loaders[unit]();
  const areas=[...code.matchAll(/\b(?:area|domain):\s*['"]([^'"]+)['"]/g)].map(m=>m[1]);assert(areas.length>0);for(const area of areas)assert.equal(area,mod.unit.domain);
 }
});
