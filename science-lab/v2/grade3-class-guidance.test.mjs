import test from 'node:test';import assert from 'node:assert/strict';
import {withLearnerClassGuidance} from './learner-class-guidance.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';
import {buildSlides} from './deck.js';
const units=['s31-u01','c22-s32-u01','c22-s32-u02'];
const cues={'s31-u01':['apply'],'c22-s32-u01':['share','end'],'c22-s32-u02':['share','end']};
test('grade3 voice guidance keeps existing data and future custom cues while replacing the current difficult instructions',async()=>{
 for(const unit of units){
  const original=await import(`../data/book/${unit}.thinking-lesson.js`),input={chapter:{...original.chapter,unit},plan:original.plan},saved=structuredClone(input),next=withLearnerClassGuidance(input);
  assert.deepEqual(input,saved);assert.equal(next.plan,input.plan);assert.equal(next.chapter.slideCues.predict,input.chapter.slideCues.predict);assert.equal(withLearnerClassGuidance(next),next);
  for(const id of Object.keys(input.chapter.slideCues))if(!cues[unit].includes(id))assert.equal(next.chapter.slideCues[id],input.chapter.slideCues[id]);
  for(const id of cues[unit]){assert.notEqual(next.chapter.slideCues[id],input.chapter.slideCues[id]);assert(!/시료|반례|설계와 실제 제작/.test(next.chapter.slideCues[id]));}
  assert.deepEqual({...next.chapter,slideCues:input.chapter.slideCues},input.chapter);
  const future={...input,chapter:{...input.chapter,slideCues:{...input.chapter.slideCues,...Object.fromEntries(cues[unit].map(id=>[id,'다음 수업에서 새로 정한 설명이에요.']))}}};assert.equal(withLearnerClassGuidance(future),future);
 }
 for(const unit of ['other','__proto__','constructor']){const other={chapter:{unit}};assert.equal(withLearnerClassGuidance(other),other);}
});
test('real grade3 lessons explain comparisons and sharing in plain Korean while preserving checks, units, data and safety instructions',async()=>{
 for(const unit of units){
  const book=await import(`../data/book/${unit}.book.js`),mod=await revisedClassroom(unit,book),pool=classroomQuestions(mod,mod.classroomItems);
  for(const mode of ['self','teach']){
   const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),get=id=>{const page=slides.find(s=>s.id===id);assert(page,id);return page.body;},studentText=slides.filter(s=>!s.item&&s.id!=='plan').map(s=>s.title+' '+s.body).join(' ');
   assert(!/시료|반례|영점|완료로 세지|설계·소통/.test(studentText),unit);assert(get('end').includes(`#/${unit}/daily`));assert(slides.filter(s=>s.item).every(s=>pool.some(q=>q.id===s.item)));
   if(unit==='s31-u01'){assert(get('scale').includes('0을 가리키는지'));assert(get('scale').includes('100 g'));assert(get('scale').includes('200 g'));assert(get('scale').includes('눈높이'));assert(get('apply').includes('맞지 않는 때'));assert(get('design').includes('받침점에서 같은 거리'));}
   if(unit==='c22-s32-u01'){assert(get('design-object').includes('투명함, 쉽게 깨지지 않음'));assert(get('design-make').includes('안전한 도구와 재료'));assert(get('share').includes('친구의 질문'));assert(get('end').includes('고체·액체·기체'));assert(get('end').includes('모양과 부피'));}
   if(unit==='c22-s32-u02'){assert(get('design').includes('보호 안경'));assert(get('design').includes('끓임쪽'));assert(get('design').includes('물은 맛보지'));assert.equal([...get('results').matchAll(/20 mL/g)].length,2);assert(get('results').includes('가열 전 남은 것이 보이지 않음'));assert(get('results').includes('관찰하지 않음'));assert(get('limits').includes('순수한 소금'));assert(get('end').includes('밀물·썰물'));}
  }
 }
});
