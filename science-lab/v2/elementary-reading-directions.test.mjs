import{weatherMixedUnchangedQuickRows}from'./tests/weather-mixed-stage.mjs';
import{motionMixedUnchangedQuickRows}from'./tests/motion-mixed-stage.mjs';
import{acidMixedUnchangedQuickRows}from'./tests/acid-mixed-stage.mjs';
import{careerUnchangedSolutions,careerUnchangedQuickRows}from'./tests/career-guided-stage.mjs';
import{electricityUnchangedSolutions,electricityUnchangedQuickRows}from'./tests/electricity-guided-stage.mjs';
import{combustionUnchangedSolutions,combustionUnchangedQuickRows}from'./tests/combustion-guided-stage.mjs';
import{seasonUnchangedSolutions,seasonUnchangedQuickRows}from'./tests/season-guided-stage.mjs';
import{earthMotionUnchangedSolutions,earthMotionUnchangedQuickRows}from'./tests/earth-motion-guided-stage.mjs';
import{plantStructureUnchangedSolutions,plantStructureUnchangedQuickRows}from'./tests/plant-structure-guided-stage.mjs';
import{motionUnchangedSolutions}from'./tests/motion-guided-stage.mjs';
import{acidUnchangedSolutions}from'./tests/acid-guided-stage.mjs';
import{energyUnchangedSolutions}from'./tests/energy-guided-stage.mjs';
import{weatherUnchangedSolutions}from'./tests/weather-guided-stage.mjs';
import{heatUnchangedSolutions}from'./tests/heat-guided-stage.mjs';
import{mixtureUnchangedSolutions}from'./tests/mixture-guided-stage.mjs';
import{bodyUnchangedSolutions}from'./tests/body-guided-stage.mjs';
import{solutionUnchangedSolutions}from'./tests/solution-guided-stage.mjs';
import{lightUnchangedSolutions}from'./tests/light-guided-stage.mjs';
import{geologyUnchangedSolutions}from'./tests/geology-guided-stage.mjs';
import{climateUnchangedSolutions}from'./tests/climate-guided-stage.mjs';
import{gasUnchangedSolutions}from'./tests/gas-guided-stage.mjs';
import{skyUnchangedSolutions}from'./tests/sky-guided-stage.mjs';
import{biologyUnchangedSolutions}from'./tests/biology-guided-stage.mjs';
import{groundUnchangedSolutions}from'./tests/ground-guided-stage.mjs';
import{waterUnchangedSolutions}from'./tests/water-guided-stage.mjs';
import{magnetUnchangedSolutions}from'./tests/magnet-guided-stage.mjs';
import{infectionUnchangedSolutions}from'./tests/infection-guided-stage.mjs';
import{soundUnchangedSolutions}from'./tests/sound-guided-stage.mjs';
import{earthSeaUnchangedSolutions}from'./tests/earth-sea-guided-stage.mjs';
import{materialUnchangedSolutions}from'./tests/material-guided-stage.mjs';
import{lifeUnchangedSolutions,lifeQuickKeys}from'./tests/life-guided-stage.mjs';
import{plantUnchangedSolutions,plantQuickKeys}from'./tests/plant-guided-stage.mjs';
import{animalUnchangedSolutions,animalQuickKeys}from'./tests/animal-guided-stage.mjs';
import{withoutForceTaskSolutions,withoutForceTaskQuickRows}from'./tests/force-drawing-stage.mjs';
import{reviewStudentWorkbook}from'./student-language-review.js';
import {withObservedPhotoAlt} from '../data/book/observation-language.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {withElementaryReadingDirections,ELEMENTARY_DIRECTIONS,ELEMENTARY_DIRECTIONS_UNITS} from '../data/book/elementary-reading-directions.js';
import {revisedTextbook,revisedTextbookPaper,revisedTextbookUnits} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';

test('reviewed student directions preserve all 3080 questions, answer books, rails, figures and writing space',async()=>{
 let units=0,pages=0,fields=0,questions=0;
 const seen={};
 function compare(before,after,path,unit){
  if(before===after)return;
  if(typeof before==='string'&&typeof after==='string'){
   assert.match(path,/^(pages|teacherStudentPages)\/\d+\/(title|lead|blocks\/)/);
   assert.equal(after,ELEMENTARY_DIRECTIONS[unit]?.[before],unit+' '+path);
   if(path.startsWith('pages/')){fields++;(seen[unit]??=new Set()).add(before);}
   return;
  }
  assert(before&&after&&typeof before==='object'&&typeof after==='object',unit+' '+path);
  assert.deepEqual(Object.keys(after),Object.keys(before),unit+' '+path+' keys');
  for(const key of Object.keys(before))compare(before[key],after[key],path?path+'/'+key:key,unit);
 }
 for(const unit of revisedTextbookUnits){
  const {workbook:before}=await import(`../data/book/${unit}.workbook.js`),saved=structuredClone(before),after=withElementaryReadingDirections(before);
  questions+=before.questions.length;compare(before,after,'',unit);
  assert.deepEqual(before,saved);assert.equal(withElementaryReadingDirections(after),after);
  for(const key of ['questions','teacherPages','quickPages','figures'])assert.equal(after[key],before[key]);
  if(after!==before)units++;
  for(const key of ['pages','teacherStudentPages'])for(let i=0;i<(before[key]||[]).length;i++){
   const old=before[key][i],current=after[key][i];assert.equal(current.rail,old.rail);
   if(key==='pages'&&old!==current)pages++;
   const writing=p=>(p.blocks||[]).filter(b=>b.type==='field').map(b=>[b.lines,b.draw]);
   assert.deepEqual(writing(current),writing(old));
  }
 }
 assert.deepEqual({units,pages,fields,questions},{units:21,pages:49,fields:89,questions:3080});
 for(const unit of ELEMENTARY_DIRECTIONS_UNITS)assert.deepEqual([...seen[unit]].sort(),Object.keys(ELEMENTARY_DIRECTIONS[unit]).sort());
});

test('actual web and all 128 print modes use the same reviewed directions and keep answers unchanged',async()=>{
 for(const unit of revisedTextbookUnits){
  const {workbook:before}=await import(`../data/book/${unit}.workbook.js`),{art}=await import(`../data/book/${unit}.workbook-art.js`);
  const expected=await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(before))),web=await revisedTextbook(unit,{chapter:{unit},art:{}}),paper=await revisedTextbookPaper(unit);
  assert.deepEqual(web.workbook,expected);assert.equal(web.chapter.pages,web.workbook.pages);assert.equal(web.chapter.questions,web.workbook.questions);assert.deepEqual(web.chapter.questions,expected.questions);
  const currentPaper=makeWorkbookPaper(expected,art),previousPaper=makeWorkbookPaper(await reviewStudentWorkbook(unit,withObservedPhotoAlt(before)),art);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode});assert.equal(html,currentPaper.workbookPaper({mode}),unit+' '+mode);
   if((['answers','quick'].includes(mode)||!ELEMENTARY_DIRECTIONS_UNITS.includes(unit))&&!(unit==='c22-s42-u02'&&['answers','quick'].includes(mode))){const historical=previousPaper.workbookPaper({mode});if(unit==='c22-s52-u03'&&mode==='quick')assert.deepEqual(weatherMixedUnchangedQuickRows(html),weatherMixedUnchangedQuickRows(historical));else if(unit==='c22-s61-u02'&&mode==='quick')assert.deepEqual(motionMixedUnchangedQuickRows(html),motionMixedUnchangedQuickRows(historical));else if(unit==='c22-s61-u01'&&mode==='quick')assert.deepEqual(acidMixedUnchangedQuickRows(html),acidMixedUnchangedQuickRows(historical));else if(unit==='c22-s62-u04'&&mode==='answers')assert.deepEqual(careerUnchangedSolutions(html),careerUnchangedSolutions(historical));else if(unit==='c22-s62-u04'&&mode==='quick')assert.deepEqual(careerUnchangedQuickRows(html),careerUnchangedQuickRows(historical));else if(unit==='c22-s62-u03'&&mode==='answers')assert.deepEqual(electricityUnchangedSolutions(html),electricityUnchangedSolutions(historical));else if(unit==='c22-s62-u03'&&mode==='quick')assert.deepEqual(electricityUnchangedQuickRows(html),electricityUnchangedQuickRows(historical));else if(unit==='c22-s62-u02'&&mode==='answers')assert.deepEqual(combustionUnchangedSolutions(html),combustionUnchangedSolutions(historical));else if(unit==='c22-s62-u02'&&mode==='quick')assert.deepEqual(combustionUnchangedQuickRows(html),combustionUnchangedQuickRows(historical));else if(unit==='c22-s62-u01'&&mode==='answers')assert.deepEqual(seasonUnchangedSolutions(html),seasonUnchangedSolutions(historical));else if(unit==='c22-s62-u01'&&mode==='quick')assert.deepEqual(seasonUnchangedQuickRows(html),seasonUnchangedQuickRows(historical));else if(unit==='c22-s61-u04'&&mode==='answers')assert.deepEqual(earthMotionUnchangedSolutions(html),earthMotionUnchangedSolutions(historical));else if(unit==='c22-s61-u04'&&mode==='quick')assert.deepEqual(earthMotionUnchangedQuickRows(html),earthMotionUnchangedQuickRows(historical));else if(unit==='c22-s61-u03'&&mode==='quick')assert.deepEqual(plantStructureUnchangedQuickRows(html),plantStructureUnchangedQuickRows(historical));else if(unit==='c22-s61-u03'&&mode==='answers')assert.deepEqual(plantStructureUnchangedSolutions(html),plantStructureUnchangedSolutions(historical));else if(unit==='c22-s61-u02'&&mode==='answers')assert.deepEqual(motionUnchangedSolutions(html),motionUnchangedSolutions(historical));else if(unit==='c22-s61-u01'&&mode==='answers')assert.deepEqual(acidUnchangedSolutions(html),acidUnchangedSolutions(historical));else if(unit==='c22-s52-u04'&&mode==='answers')assert.deepEqual(energyUnchangedSolutions(html),energyUnchangedSolutions(historical));else if(unit==='c22-s52-u03'&&mode==='answers')assert.deepEqual(weatherUnchangedSolutions(html),weatherUnchangedSolutions(historical));else if(unit==='c22-s52-u02'&&mode==='answers')assert.deepEqual(heatUnchangedSolutions(html),heatUnchangedSolutions(historical));else if(unit==='c22-s52-u01'&&mode==='answers')assert.deepEqual(mixtureUnchangedSolutions(html),mixtureUnchangedSolutions(historical));else if(unit==='c22-s51-u04'&&mode==='answers')assert.deepEqual(bodyUnchangedSolutions(html),bodyUnchangedSolutions(historical));else if(unit==='c22-s51-u03'&&mode==='answers')assert.deepEqual(solutionUnchangedSolutions(html),solutionUnchangedSolutions(historical));else if(unit==='c22-s51-u02'&&mode==='answers')assert.deepEqual(lightUnchangedSolutions(html),lightUnchangedSolutions(historical));else if(unit==='c22-s51-u01'&&mode==='answers')assert.deepEqual(geologyUnchangedSolutions(html),geologyUnchangedSolutions(historical));else if(unit==='c22-s42-u04'&&mode==='answers')assert.deepEqual(climateUnchangedSolutions(html),climateUnchangedSolutions(historical));else if(unit==='c22-s42-u03'&&mode==='answers')assert.deepEqual(gasUnchangedSolutions(html),gasUnchangedSolutions(historical));else if(unit==='c22-s42-u01'&&mode==='answers')assert.deepEqual(skyUnchangedSolutions(html),skyUnchangedSolutions(historical));else if(unit==='s41-u04'&&mode==='answers')assert.deepEqual(biologyUnchangedSolutions(html),biologyUnchangedSolutions(historical));else if(unit==='s41-u03'&&mode==='answers')assert.deepEqual(groundUnchangedSolutions(html),groundUnchangedSolutions(historical));else if(unit==='s41-u02'&&mode==='answers')assert.deepEqual(waterUnchangedSolutions(html),waterUnchangedSolutions(historical));else if(unit==='s41-u01'&&mode==='answers')assert.deepEqual(magnetUnchangedSolutions(html),magnetUnchangedSolutions(historical));else if(unit==='c22-s32-u04'&&mode==='answers')assert.deepEqual(infectionUnchangedSolutions(html),infectionUnchangedSolutions(historical));else if(unit==='c22-s32-u03'&&mode==='answers')assert.deepEqual(soundUnchangedSolutions(html),soundUnchangedSolutions(historical));else if(unit==='c22-s32-u02'&&mode==='answers')assert.deepEqual(earthSeaUnchangedSolutions(html),earthSeaUnchangedSolutions(historical));else if(unit==='c22-s32-u01'&&mode==='answers')assert.deepEqual(materialUnchangedSolutions(html),materialUnchangedSolutions(historical));else if(unit==='s31-u04'&&mode==='answers')assert.deepEqual(lifeUnchangedSolutions(html),lifeUnchangedSolutions(historical));else if(unit==='s31-u04'&&mode==='quick')assert.deepEqual(lifeQuickKeys(html),lifeQuickKeys(historical));else if(unit==='s31-u03'&&mode==='answers')assert.deepEqual(plantUnchangedSolutions(html),plantUnchangedSolutions(historical));else if(unit==='s31-u03'&&mode==='quick')assert.deepEqual(plantQuickKeys(html),plantQuickKeys(historical));else if(unit==='s31-u02'&&mode==='answers')assert.deepEqual(animalUnchangedSolutions(html),animalUnchangedSolutions(historical));else if(unit==='s31-u02'&&mode==='quick')assert.deepEqual(animalQuickKeys(html),animalQuickKeys(historical));else if(unit==='s31-u01'&&mode==='answers')assert.equal(withoutForceTaskSolutions(html),withoutForceTaskSolutions(historical));else if(unit==='s31-u01'&&mode==='quick')assert.equal(withoutForceTaskQuickRows(html),withoutForceTaskQuickRows(historical));else assert.equal(html,historical);}
   if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
  }
 }
});

test('unsupported units, future wording, questions and figures retain their own text and identity',()=>{
 for(const unit of ['legacy','other','__proto__','constructor','toString']){const wb={unit};assert.equal(withElementaryReadingDirections(wb),wb);}
 const text='판단 한정',opaque=['questions','solutions','diagram','gallery'].map(type=>({type,text,ids:[text],key:text}));
 const untouched={kind:'learn',title:'a future heading',blocks:[{type:'text',text:'a future explanation'},...opaque],rail:[{title:text,text}]};
 const wb={unit:'s31-u03',pages:[untouched],teacherStudentPages:[untouched],questions:[{prompt:text,answer:text}],teacherPages:[],quickPages:[]};
 assert.equal(withElementaryReadingDirections(wb),wb);
 const other={...untouched,blocks:[{type:'heading',text},...opaque]},edited=withElementaryReadingDirections({...wb,pages:[other]});
 assert.equal(edited.pages[0].blocks[0].text,'사진에서 알 수 있는 것');
 assert.equal(edited.pages[0].rail,other.rail);assert.equal(edited.questions,wb.questions);
 for(let i=1;i<other.blocks.length;i++)assert.equal(edited.pages[0].blocks[i],other.blocks[i]);
});
