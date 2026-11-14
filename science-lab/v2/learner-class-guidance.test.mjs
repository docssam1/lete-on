import test from 'node:test';import assert from 'node:assert/strict';
import {PLANT_STRUCTURE_CASE_IDS,plantStructureCase,plantStructureCompareRecord,validPlantStructureCompareRow,plantStructureCompareValues,plantStructureComparisonProgress} from './plant-structure-compare-model.js';
import {plantStructureCasePresentation,plantStructureComparePresentationValues,withLearnerClassGuidance} from './learner-class-guidance.js';
import {mountPlantStructureCompare} from './lab-plant-structure-compare.js';
import {revisedClassroom,classroomQuestions,classroomTableData} from './revised-lesson.js';
import {buildSlides} from './deck.js';
import * as plantBook from '../data/book/c22-s61-u03.book.js';import * as forceBook from '../data/book/s31-u01.book.js';
import {chapter as originalChapter,plan as originalPlan} from '../data/book/c22-s61-u03.thinking-lesson.js';

test('readable plant tables preserve every existing record material, prediction key and progress value',()=>{
 const original=PLANT_STRUCTURE_CASE_IDS.map(plantStructureCase);let records=0;
 for(const id of PLANT_STRUCTURE_CASE_IDS){
  const raw=plantStructureCase(id),display=plantStructureCasePresentation(id);assert.deepEqual(display.options,raw.options);assert.equal(display.figureKey,raw.figureKey);assert.equal(display.rows.length,raw.rows.length);assert.equal(display.heads.length,raw.heads.length);
  for(const key of Object.keys(raw.options)){
   const row=plantStructureCompareRecord(id,key),saved=structuredClone(row),rawValues=plantStructureCompareValues(row);assert(validPlantStructureCompareRow(row));assert.deepEqual(plantStructureComparePresentationValues(row),[display.label,display.options[key],display.reason]);assert.deepEqual(plantStructureCompareValues(row),rawValues);assert.deepEqual(row,saved);records++;
  }
 }
 assert.equal(records,32);assert.deepEqual(PLANT_STRUCTURE_CASE_IDS.map(plantStructureCase),original);
 const raw=plantStructureCase('starch'),display=plantStructureCasePresentation('starch');assert.deepEqual(raw.heads,['시료','녹말 검출 반응']);assert.deepEqual(raw.rows.map(r=>r[1]),['미검출','청람색','미검출']);assert.deepEqual(display.heads,['비교할 잎','녹말을 확인한 색 반응']);assert.deepEqual(display.rows.map(r=>r[1]),['푸른 검은색으로 변하지 않음','푸른 검은색으로 변함','푸른 검은색으로 변하지 않음']);
 const changed=plantStructureCompareRecord('starch','unknown');changed.material.heads=display.heads;assert(!validPlantStructureCompareRow(changed));assert.throws(()=>plantStructureComparePresentationValues(changed));display.rows[0][1]='mutated';assert.equal(plantStructureCasePresentation('starch').rows[0][1],'푸른 검은색으로 변하지 않음');
 assert(plantStructureComparisonProgress(PLANT_STRUCTURE_CASE_IDS.map(id=>plantStructureCompareRecord(id,'unknown'))).complete);
});

test('class directions and voice cues change only matching old wording and leave future custom guidance alone',async()=>{
 const input={chapter:{...originalChapter,unit:'c22-s61-u03'},plan:originalPlan},before=structuredClone(input),next=withLearnerClassGuidance(input);assert.deepEqual(input,before);assert.equal(withLearnerClassGuidance(next),next);assert.equal(next.plan.phases,input.plan.phases);assert.equal(next.plan.minutes,330);
 for(const id of ['starchprepare','starchobserve','starchunexpected']){assert(!/시료|청람색/.test(next.chapter.slideCues[id]));assert.notEqual(next.chapter.slideCues[id],input.chapter.slideCues[id]);}
 for(const page of input.chapter.plantStructureFlow)if(!['starchprepare','starchobserve','starchunexpected'].includes(page.id))assert.equal(next.chapter.plantStructureFlow.find(p=>p.id===page.id),page);
 const future={...input,plan:{...input.plan,note:'future plan'},chapter:{...input.chapter,slideCues:{...input.chapter.slideCues,starchprepare:'future voice'},plantStructureFlow:input.chapter.plantStructureFlow.map(p=>p.id==='starchprepare'?{...p,steps:['future instruction',...p.steps.slice(1)]}:p)}};
 const revised=withLearnerClassGuidance(future);assert.equal(revised.plan,future.plan);assert.equal(revised.chapter.slideCues.starchprepare,'future voice');assert.equal(revised.chapter.plantStructureFlow.find(p=>p.id==='starchprepare').steps[0],'future instruction');
 const other={chapter:{unit:'other'}};assert.equal(withLearnerClassGuidance(other),other);
 const mod=await revisedClassroom('c22-s61-u03',plantBook);assert.deepEqual(mod.chapter.plantStructureFlow,next.chapter.plantStructureFlow);assert.deepEqual(mod.chapter.slideCues,next.chapter.slideCues);assert.equal(mod.plan.note,next.plan.note);
 const oldRow=plantStructureCompareRecord('starch','light');assert.deepEqual(classroomTableData('c22-s61-u03',mod.classroomLab,[oldRow]).rowValues(oldRow),plantStructureCompareValues(oldRow));
});

function host(){const events=new Map(),controls=new Map();return {innerHTML:'',addEventListener:(t,f)=>events.set(t,f),removeEventListener:t=>events.delete(t),querySelector:s=>{if(!controls.has(s))controls.set(s,{focus(){},disabled:false});return controls.get(s)},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-plant-structure-compare-${field}]`}}),act:value=>events.get('click')?.({target:{closest:()=>({dataset:{plantStructureCompareAct:value}})}})};}
test('actual comparison mount displays readable labels while restoring and emitting the unchanged saved-record schema',()=>{
 const old=plantStructureCompareRecord('starch','unknown'),saved=structuredClone(old),h=host();let emitted=0,rows;
 const handle=mountPlantStructureCompare(h,{rows:[old],onRecord:value=>{emitted++;rows=value;}});assert.equal(emitted,0);assert.deepEqual(handle.rows,[saved]);h.change('case','starch');assert(h.innerHTML.includes('비교할 잎'));assert(h.innerHTML.includes('푸른 검은색으로 변하지 않음'));assert(!/시료|미검출|청람색/.test(h.innerHTML));
 h.change('prediction','light');h.act('reveal');h.act('record');assert.equal(emitted,1);assert.deepEqual(rows,[saved,plantStructureCompareRecord('starch','light')]);assert(rows.every(validPlantStructureCompareRow));assert.deepEqual(old,saved);
 rows[0].material.rows[0][0]='mutated';assert.deepEqual(handle.rows[0],saved);handle.dispose();
});

test('real self and teacher slides use simple activity language without changing science checks or requiring a report',async()=>{
 for(const [unit,book]of [['c22-s61-u03',plantBook],['s31-u01',forceBook]]){
  const mod=await revisedClassroom(unit,book),pool=classroomQuestions(mod,mod.classroomItems);
  for(const mode of ['self','teach']){
   const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode);
   if(unit==='c22-s61-u03')for(const id of ['starchprepare','starchobserve','starchunexpected','starchdata','organdata','transdata',...(mode==='teach'?['plan']:[])]){
    const slide=slides.find(s=>s.id===id);assert(slide);assert(!/시료|미검출|청람색|生長/.test(slide.body),id);if(id==='starchobserve')assert(slide.body.includes('아이오딘-아이오딘화 칼륨'));
   }
   else{const end=slides.find(s=>s.id==='end');assert(end.body.includes('저울을 0에 맞추기'));assert(!/실제 수행|공식 성적|영점/.test(end.body));assert(end.body.includes('#/s31-u01/daily'));}
  }
 }
});
