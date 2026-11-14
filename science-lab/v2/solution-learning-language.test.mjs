import test from 'node:test';import assert from 'node:assert/strict';
import {SOLUTION_CASE_IDS,solutionCase,solutionCompareRecord,validSolutionCompareRow,solutionCompareValues,solutionComparisonProgress} from './solution-compare-model.js';
import {solutionCasePresentation,solutionMaterialPresentation,solutionComparePresentationValues,withSolutionLearnerCues} from './solution-learning-language.js';
import {revisedClassroom,classroomTableData} from './revised-lesson.js';
import * as book from '../data/book/c22-s51-u03.book.js';
import {chapter as originalChapter,plan} from '../data/book/c22-s51-u03.thinking-lesson.js';
test('plain solution case descriptions preserve every raw saved material, choice key, condition value and progress result',()=>{
 const originals=SOLUTION_CASE_IDS.map(solutionCase);let variants=0;
 for(const id of SOLUTION_CASE_IDS){
  const raw=solutionCase(id),display=solutionCasePresentation(id);assert.deepEqual(Object.keys(display),Object.keys(raw));assert.deepEqual(display.options,raw.options);assert.equal(display.heads.length,raw.heads.length);assert.deepEqual(display.rows.map(row=>row.length),raw.rows.map(row=>row.length));
  for(const key of Object.keys(raw.options)){
   const row=solutionCompareRecord(id,key),saved=structuredClone(row),values=solutionCompareValues(row);assert(validSolutionCompareRow(row));assert.deepEqual(solutionComparePresentationValues(row),[display.label,display.options[key],display.reason]);assert.deepEqual(solutionCompareValues(row),values);assert.deepEqual(row,saved);variants++;
  }
 }
 assert.equal(variants,28);assert.deepEqual(SOLUTION_CASE_IDS.map(solutionCase),originals);assert(solutionComparisonProgress(SOLUTION_CASE_IDS.map(id=>solutionCompareRecord(id,'unknown'))).complete);
 assert(!/영점|투입량|잔류|자유 부유/.test(JSON.stringify(SOLUTION_CASE_IDS.map(solutionCasePresentation))));
 const bad=solutionCompareRecord('mass','unknown');bad.material.rows[0][1]='바꾼 값';assert(!validSolutionCompareRow(bad));assert.throws(()=>solutionComparePresentationValues(bad));
});
test('a changed future material is preserved and displayed values cannot mutate the current input or model',()=>{
 for(const id of ['mass','temperature','floating','contact']){
  const raw=solutionCase(id),saved=structuredClone(raw),display=solutionMaterialPresentation(id,raw);assert.deepEqual(raw,saved);assert.equal(solutionMaterialPresentation(id,display),display);
  display.rows[0][1]='변경';display.options.unknown='변경';assert.deepEqual(raw,saved);assert.deepEqual(solutionCase(id),saved);
  for(const field of ['rows','reason','conditions','options','newField']){const future=structuredClone(raw);if(field==='rows')future.rows[0][1]='다음 자료의 값';else if(field==='options')future.options.unknown='다음 자료의 선택지';else future[field]='다음 자료에서 정한 내용';assert.equal(solutionMaterialPresentation(id,future),future,field);}
 }
 const future={newField:'다음 자료'};assert.equal(solutionMaterialPresentation('constructor',future),future);assert.throws(()=>solutionCasePresentation('missing'));
});
test('solution voice wording is current only, stays separate from old saved-record labels and preserves custom future cues',async()=>{
 const input={chapter:{...originalChapter,unit:'c22-s51-u03'},plan},saved=structuredClone(input),next=withSolutionLearnerCues(input);assert.deepEqual(input,saved);assert.equal(next.plan,input.plan);assert.equal(withSolutionLearnerCues(next),next);
 for(const key of Object.keys(input.chapter.slideCues))if(!['observe','communicate'].includes(key))assert.equal(next.chapter.slideCues[key],input.chapter.slideCues[key]);assert(!/잔류|미수신/.test(next.chapter.slideCues.observe+next.chapter.slideCues.communicate));
 const future={...input,chapter:{...input.chapter,slideCues:{...input.chapter.slideCues,observe:'새 관찰 안내',communicate:'새 소개 안내'}}};assert.equal(withSolutionLearnerCues(future),future);const other={chapter:{unit:'other'}};assert.equal(withSolutionLearnerCues(other),other);
 const mod=await revisedClassroom('c22-s51-u03',book);assert.deepEqual(mod.chapter.slideCues,next.chapter.slideCues);const old=solutionCompareRecord('floating','unknown');assert.deepEqual(classroomTableData('c22-s51-u03',mod.classroomLab,[old]).rowValues(old),solutionCompareValues(old));
});
