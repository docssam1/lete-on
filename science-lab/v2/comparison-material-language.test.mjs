import test from 'node:test';import assert from 'node:assert/strict';
import {learnerComparisonMaterial,learnerComparisonValues,withComparisonLearnerCues} from './comparison-material-language.js';
import {host} from './tests/comparison-widget-cases.mjs';import {mountGroundCompare} from './lab-ground-compare.js';
import {mountCareerCompare} from './lab-career-compare.js';
import {revisedClassroom,classroomTableData} from './revised-lesson.js';
const specs=[['water','tube','WATER_CASE_IDS','waterCase','waterCompareRecord','validWaterCompareRow','waterCompareValues','waterComparisonProgress','s41-u02'],['magnet','design','MAGNET_CASE_IDS','magnetCase','magnetCompareRecord','validMagnetCompareRow','magnetCompareValues','magnetComparisonProgress','s41-u01'],['ground','practice','GROUND_CASE_IDS','groundCase','groundCompareRecord','validGroundCompareRow','groundCompareValues','groundComparisonProgress','s41-u03'],['combustion','ecosystem','COMBUSTION_CASE_IDS','combustionCase','combustionCompareRecord','validCombustionCompareRow','combustionCompareValues','combustionComparisonProgress','c22-s62-u02'],['career','current','CAREER_CASE_IDS','careerCase','careerCompareRecord','validCareerCompareRow','careerCompareValues','careerComparisonProgress','c22-s62-u04']];
specs.push(...[["acid", "litmus", "ACID_CASE_IDS", "acidCase", "acidCompareRecord", "validAcidCompareRow", "acidCompareValues", "acidComparisonProgress", "c22-s61-u01"], ["biology", "share", "BIOLOGY_CASE_IDS", "biologyCase", "biologyCompareRecord", "validBiologyCompareRow", "biologyCompareValues", "biologyComparisonProgress", "s41-u04"], ["earth-motion", "sun", "EARTH_MOTION_CASE_IDS", "earthMotionCase", "earthMotionCompareRecord", "validEarthMotionCompareRow", "earthMotionCompareValues", "earthMotionComparisonProgress", "c22-s61-u04"], ["electricity", "brightness", "ELECTRICITY_CASE_IDS", "electricityCase", "electricityCompareRecord", "validElectricityCompareRow", "electricityCompareValues", "electricityComparisonProgress", "c22-s62-u03"], ["energy", "efficiency", "ENERGY_CASE_IDS", "energyCase", "energyCompareRecord", "validEnergyCompareRow", "energyCompareValues", "energyComparisonProgress", "c22-s52-u04"], ["gas", "test", "GAS_CASE_IDS", "gasCase", "gasCompareRecord", "validGasCompareRow", "gasCompareValues", "gasComparisonProgress", "c22-s42-u03"], ["geology", "past", "GEOLOGY_CASE_IDS", "geologyCase", "geologyCompareRecord", "validGeologyCompareRow", "geologyCompareValues", "geologyComparisonProgress", "c22-s51-u01"], ["heat", "contact", "HEAT_CASE_IDS", "heatCase", "heatCompareRecord", "validHeatCompareRow", "heatCompareValues", "heatComparisonProgress", "c22-s52-u02"], ["mixture", "recovery", "MIXTURE_CASE_IDS", "mixtureCase", "mixtureCompareRecord", "validMixtureCompareRow", "mixtureCompareValues", "mixtureComparisonProgress", "c22-s52-u01"], ["motion", "position", "MOTION_CASE_IDS", "motionCase", "motionCompareRecord", "validMotionCompareRow", "motionCompareValues", "motionComparisonProgress", "c22-s61-u02"], ["plant-structure", "root", "PLANT_STRUCTURE_CASE_IDS", "plantStructureCase", "plantStructureCompareRecord", "validPlantStructureCompareRow", "plantStructureCompareValues", "plantStructureComparisonProgress", "c22-s61-u03"], ["season", "device", "SEASON_CASE_IDS", "seasonCase", "seasonCompareRecord", "validSeasonCompareRow", "seasonCompareValues", "seasonComparisonProgress", "c22-s62-u01"], ["weather", "observe", "WEATHER_CASE_IDS", "weatherCase", "weatherCompareRecord", "validWeatherCompareRow", "weatherCompareValues", "weatherComparisonProgress", "c22-s52-u03"]]);
const models=await Promise.all(specs.map(([name])=>import('./'+name+'-compare-model.js')));
test('all eight life examples keep their data and old record shape while headings and explanations use student wording',async()=>{
 const m=await import('./life-compare-model.js');let cases=0,records=0;
 for(const experiment of Object.keys(m.LIFE_EXPERIMENTS))for(const plan of Object.keys(m.LIFE_PLANS)){
  const raw=m.lifeMaterial(experiment,plan),saved=structuredClone(raw),id=experiment+'/'+plan,display=learnerComparisonMaterial('life-compare',id,raw);assert(!/가상|연습 자료/.test(JSON.stringify(display)));assert.deepEqual(display.results,raw.results);assert.deepEqual(display.conditions,raw.conditions);assert.equal(display.period,raw.period);assert.equal(display.comparable,raw.comparable);assert.deepEqual(raw,saved);assert.equal(learnerComparisonMaterial('life-compare',id,display),display);
  for(const judgment of Object.keys(m.LIFE_JUDGMENTS)){const row=m.lifeCompareRecord(experiment,plan,judgment),before=structuredClone(row),values=m.lifeCompareValues(row);assert(m.validLifeCompareRow(row));assert.deepEqual(m.lifeCompareValues(row),values);assert.deepEqual(row,before);records++;}
  for(const future of [{...raw,extra:true},{...raw,results:[['바뀐 값']]},{...raw,conditions:[['바뀐 조건']]}])assert.equal(learnerComparisonMaterial('life-compare',id,future),future);cases++;
 }
 assert.equal(cases,8);assert.equal(records,24);
});
test('career comparison uses the reviewed table wording without changing existing stored material',async()=>{
 const m=await import('./career-compare-model.js'),raw=m.careerCase('current'),saved=m.careerCompareRecord('current','station'),h=host();const handle=mountCareerCompare(h,{rows:[saved]});
 assert(h.innerHTML.includes('시청의 자료(예시, 2025년)'));assert(!h.innerHTML.includes('가상 시 자료팀'));assert(!h.innerHTML.includes('교재의 가상 자료 카드'));
 assert.deepEqual(handle.rows,[saved]);assert(m.validCareerCompareRow(saved));assert(raw.rows[0][1].includes('가상 시 자료팀'));handle.dispose();
});
test('plain comparison materials keep all 576 original record variants, option keys, numeric rows and progress rules',()=>{
 let variants=0;
 for(const [at,[name,target,ids,get,record,valid,values,progress]]of specs.entries()){
  const m=models[at],kind=name+'-compare',originals=m[ids].map(m[get]);
  for(const id of m[ids]){
   const raw=m[get](id),display=learnerComparisonMaterial(kind,id,raw);assert.deepEqual(Object.keys(display),Object.keys(raw));assert.deepEqual(Object.keys(display.options),Object.keys(raw.options));assert.equal(display.figureKey,raw.figureKey);assert.deepEqual(display.rows.map(r=>r.length),raw.rows.map(r=>r.length));
   if((name!=='ground'||id!==target)&&name!=='career')assert.deepEqual(display.rows,raw.rows);
   if(name==='career'){assert.deepEqual(JSON.stringify(display.rows).match(/\d+(?:\.\d+)?/g),JSON.stringify(raw.rows).match(/\d+(?:\.\d+)?/g));assert(!/가상|연습/.test(display.conditions));}
   for(const key of Object.keys(raw.options)){
    const row=m[record](id,key),saved=structuredClone(row),oldValues=m[values](row);assert(m[valid](row));assert.deepEqual(learnerComparisonValues(kind,row,m[valid]),[display.label,display.options[key],display.reason]);assert.deepEqual(m[values](row),oldValues);assert.deepEqual(row,saved);variants++;
   }
  }
  assert.deepEqual(m[ids].map(m[get]),originals);assert(m[progress](m[ids].map(id=>m[record](id,'unknown'))).complete);
  const bad=m[record](target,'unknown');bad.material.rows[0][1]='바뀐 값';assert(!m[valid](bad));assert.throws(()=>learnerComparisonValues(kind,bad,m[valid]));assert.throws(()=>learnerComparisonValues('other-compare',m[record](target,'unknown'),m[valid]));
 }
 assert.equal(variants,576);
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
