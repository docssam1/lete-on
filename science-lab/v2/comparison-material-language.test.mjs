import test from 'node:test';import assert from 'node:assert/strict';
import {learnerComparisonMaterial,learnerComparisonValues,withComparisonLearnerCues} from './comparison-material-language.js';
import {host} from './tests/comparison-widget-cases.mjs';import {mountGroundCompare} from './lab-ground-compare.js';
import {revisedClassroom,classroomTableData} from './revised-lesson.js';
const specs=[['water','tube','WATER_CASE_IDS','waterCase','waterCompareRecord','validWaterCompareRow','waterCompareValues','waterComparisonProgress','s41-u02'],['magnet','design','MAGNET_CASE_IDS','magnetCase','magnetCompareRecord','validMagnetCompareRow','magnetCompareValues','magnetComparisonProgress','s41-u01'],['ground','practice','GROUND_CASE_IDS','groundCase','groundCompareRecord','validGroundCompareRow','groundCompareValues','groundComparisonProgress','s41-u03'],['combustion','ecosystem','COMBUSTION_CASE_IDS','combustionCase','combustionCompareRecord','validCombustionCompareRow','combustionCompareValues','combustionComparisonProgress','c22-s62-u02']];
const models=await Promise.all(specs.map(([name])=>import('./'+name+'-compare-model.js')));
test('plain comparison materials keep all 124 original record variants, option keys, numeric rows and progress rules',()=>{
 let variants=0;
 for(const [at,[name,target,ids,get,record,valid,values,progress]]of specs.entries()){
  const m=models[at],kind=name+'-compare',originals=m[ids].map(m[get]);
  for(const id of m[ids]){
   const raw=m[get](id),display=learnerComparisonMaterial(kind,id,raw);assert.deepEqual(Object.keys(display),Object.keys(raw));assert.deepEqual(Object.keys(display.options),Object.keys(raw.options));assert.equal(display.figureKey,raw.figureKey);assert.deepEqual(display.rows.map(r=>r.length),raw.rows.map(r=>r.length));
   if(name!=='ground'||id!==target)assert.deepEqual(display.rows,raw.rows);
   for(const key of Object.keys(raw.options)){
    const row=m[record](id,key),saved=structuredClone(row),oldValues=m[values](row);assert(m[valid](row));assert.deepEqual(learnerComparisonValues(kind,row,m[valid]),[display.label,display.options[key],display.reason]);assert.deepEqual(m[values](row),oldValues);assert.deepEqual(row,saved);variants++;
   }
  }
  assert.deepEqual(m[ids].map(m[get]),originals);assert(m[progress](m[ids].map(id=>m[record](id,'unknown'))).complete);
  const bad=m[record](target,'unknown');bad.material.rows[0][1]='바뀐 값';assert(!m[valid](bad));assert.throws(()=>learnerComparisonValues(kind,bad,m[valid]));assert.throws(()=>learnerComparisonValues('other-compare',m[record](target,'unknown'),m[valid]));
 }
 assert.equal(variants,124);
});
test('future values, options and fields stay untouched and display mutation cannot change the raw input',()=>{
 for(const [at,[name,id,,get]]of specs.entries()){
  const kind=name+'-compare',raw=models[at][get](id),saved=structuredClone(raw),display=learnerComparisonMaterial(kind,id,raw);assert.deepEqual(raw,saved);assert.notEqual(display,raw);assert.equal(learnerComparisonMaterial(kind,id,display),display);
  display.rows[0][1]='변경';display.options.unknown='변경';assert.deepEqual(raw,saved);assert.deepEqual(models[at][get](id),saved);
  for(const field of ['rows','conditions','options','newField']){const future=structuredClone(raw);if(field==='rows')future.rows[0][1]='다음 값';else if(field==='options')future.options.unknown='다음 선택지';else future[field]='다음 안내';assert.equal(learnerComparisonMaterial(kind,id,future),future);}
  const reordered=Object.fromEntries(Object.entries(raw).reverse());assert.deepEqual(learnerComparisonMaterial(kind,id,reordered),learnerComparisonMaterial(kind,id,raw));
 }
 const other={value:'새 자료'};assert.equal(learnerComparisonMaterial('__proto__','constructor',other),other);assert.equal(learnerComparisonMaterial('unknown','unknown',other),other);
});
test('only matching current flow and voice guidance change; custom future pages, cues and other units stay intact',async()=>{
 for(const unit of ['s41-u03','c22-s62-u02']){
  const raw=await import('../data/book/'+unit+'.thinking-lesson.js'),input={chapter:{...raw.chapter,unit},plan:raw.plan},saved=structuredClone(input),next=withComparisonLearnerCues(input);assert.deepEqual(input,saved);assert.equal(next.plan,input.plan);assert.equal(withComparisonLearnerCues(next),next);
  const id=unit==='s41-u03'?'feedback':'seacase';assert.notEqual(next.chapter.slideCues[id],input.chapter.slideCues[id]);assert(!/생장|재연습/.test(next.chapter.slideCues[id]));for(const key of Object.keys(input.chapter.slideCues))if(key!==id)assert.equal(next.chapter.slideCues[key],input.chapter.slideCues[key]);
  const future={...input,chapter:{...input.chapter,slideCues:{...input.chapter.slideCues,[id]:'새 음성'}}},revised=withComparisonLearnerCues(future);assert.equal(revised.chapter.slideCues[id],'새 음성');
  if(unit==='c22-s62-u02'){
   for(const page of input.chapter.combustionFlow)if(page.id!==id)assert.equal(next.chapter.combustionFlow.find(p=>p.id===page.id),page);
   const custom={...input,chapter:{...input.chapter,combustionFlow:input.chapter.combustionFlow.map(p=>p.id===id?{...p,text:['새 자료의 설명']}:p)}};assert.equal(withComparisonLearnerCues(custom),custom);
  }
  const book=await import('../data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book);assert.deepEqual(mod.chapter.slideCues,next.chapter.slideCues);if(unit==='c22-s62-u02')assert.deepEqual(mod.chapter.combustionFlow,next.chapter.combustionFlow);
 }
 const other={chapter:{unit:'other'}};assert.equal(withComparisonLearnerCues(other),other);
});
test('existing earthquake display safety wording and raw exported record values survive the new display layer',async()=>{
 const h=host(),handle=mountGroundCompare(h);h.change({'data-ground-compare-case':''},'earthquake');assert(h.innerHTML.includes('책상 아래에서 몸을 보호하고 책상 다리 잡기'));assert(!h.innerHTML.includes('책상 아래에서 몸을 보호하고 다리 잡기'));handle.dispose();
 for(const [at,[,,ids,,record,,values,,unit]]of specs.entries()){
  const book=await import('../data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book),m=models[at],rows=m[ids].map(id=>m[record](id,'unknown'));
  for(const row of rows)assert.deepEqual(classroomTableData(unit,mod.classroomLab,rows).rowValues(row),m[values](row));
 }
});
