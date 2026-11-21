import test from 'node:test';
import assert from 'node:assert/strict';
import {revisedClassroom,classroomQuestions,classroomTableData} from './revised-lesson.js?v=20261102-force';
import * as original from '../data/book/s31-u01.book.js';
import {similar} from '../data/units/s31-u01.similar.js';
import {lesson} from '../data/units/s31-u01.lesson.js';
import {forceRecord} from './force-model.js';
import {buildSlides} from './deck.js?v=20261102-force';
import {findLifeItem} from './book-life.js';
const mod=await revisedClassroom('s31-u01',original);
const pool=classroomQuestions(mod,similar);
test('힘 기본 수업은 예상·모형·자료·생활 적용으로 이어지며 기록·보고서를 요구하지 않는다',()=>{
 for(const mode of ['self','teach']){
  const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode);
  assert.equal(slides.length,mode==='self'?26:27);
  const ids=slides.map(s=>s.id);
  for(const id of ['predict','lab','results','conclusion','scale','tools','apply'])assert(ids.includes(id));
  assert(ids.indexOf('predict')<ids.indexOf('lab'));
  assert(ids.indexOf('lab')<ids.indexOf('results'));
  assert(ids.indexOf('results')<ids.indexOf('tools'));
  assert(!slides.some(s=>s.kind==='fieldwork'||s.id==='report'||/href="[^\"]*\/(report|records)/.test(s.body)));
  assert.equal(slides.filter(s=>s.item).length,11);
  assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['4과01-01','4과01-02','4과01-03','4과01-04']);
  assert(!/undefined|\[object Object\]/.test(slides.map(s=>s.body).join('')));
  assert(slides.every(s=>s.phaseObj));
  for(const s of slides.filter(s=>s.item)){
   const q=pool.find(q=>q.id===s.item);
   if(q.givens){
    assert(s.body.includes('class="dk-given-list"'));
    assert(!s.body.includes('[&quot;'));
    for(const values of Object.values(q.givens))for(const value of values)assert(s.body.includes(value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')));
   }
  }
  if(mode==='self'){
   assert(slides.find(s=>s.id==='conclusion').body.includes('data-prediction-summary'));
   assert(!slides.some(s=>s.body.includes('class="dk-ans rv"')));
  }else assert(!slides.some(s=>s.body.includes('<textarea')));
 }
 assert.equal(mod.plan.phases.reduce((sum,p)=>sum+p.min,0),80);
});
test('기존 실제 활동 교재·수업 계획·보고서와 모든 채점 계약을 보존한다',()=>{
 assert.notEqual(mod,original);
 assert.equal(original.chapter.forceThinking,undefined);
 const oldSlides=buildSlides(original.chapter,original.art,original.plan,similar,'self');
 assert(oldSlides.some(s=>s.id==='report'&&s.body.includes('/report')));
 assert.equal(lesson.elaborate.report,true);
 assert.equal(lesson.explore.lab.kind,'force');
 assert.equal(pool.length,similar.length);
 const revisedIds=new Set(mod.classroomItems.map(q=>q.id));assert.equal(revisedIds.size,11);
 for(const q of pool){
  const old=similar.find(x=>x.id===q.id);assert(old);
  assert.deepEqual(q.answerContract,old.answerContract);
  assert.deepEqual(q.sourceRef,old.sourceRef);
  assert.deepEqual(q.taxonomy,old.taxonomy);
  if(!revisedIds.has(q.id))assert.equal(q,old);
 }
 for(const key of [...mod.chapter.formative.items,...mod.chapter.check])assert(findLifeItem(pool,key));
 assert.notDeepEqual(pool.find(q=>q.id==='s31-u01-v001').choices,similar.find(q=>q.id==='s31-u01-v001').choices);
});
test('모형 기록 표는 물체·위치·예상·관찰을 각 열에 맞게 읽고 원래 행은 수정하지 않는다',()=>{
 const rows=[forceRecord({pair:'ab',left:3,right:3},'left'),forceRecord({pair:'ab',left:4,right:2},'level'),forceRecord({pair:'ac',left:3,right:3},'right')];
 const before=structuredClone(rows),table=classroomTableData('s31-u01',lesson.explore.lab,rows);
 assert.equal(table.rows,rows);
 assert.equal(table.cols.length,4);
 assert.deepEqual(table.rows.map(table.rowValues),[
  ['물체 가 · 3칸','물체 나 · 3칸','왼쪽이 내려간다','오른쪽이 내려간다'],
  ['물체 가 · 4칸','물체 나 · 2칸','수평을 이룬다','수평을 이룬다'],
  ['물체 가 · 3칸','물체 다 · 3칸','오른쪽이 내려간다','수평을 이룬다'],
 ]);
 assert.deepEqual(rows,before);
});
test('다른 단원과 준비 중인 자료에는 기존 객체·기록 표를 그대로 돌려준다',async()=>{
 for(const unit of ['not-reviewed']){
  const book={chapter:{unit}};
  assert.equal(await revisedClassroom(unit,book),book);
  const questions=[];assert.equal(classroomQuestions(book,questions),questions);
  const rows=[],lab={columns:['조건','결과']},table=classroomTableData(unit,lab,rows);
  assert.equal(table.rows,rows);assert.equal(table.cols,lab.columns);assert.equal(table.rowValues,undefined);
 }
 const pool=[];assert.equal(classroomQuestions(null,pool),pool);
});
