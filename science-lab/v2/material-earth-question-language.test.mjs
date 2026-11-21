import test from 'node:test';import assert from 'node:assert/strict';
import {items as materials} from '../data/units/c22-s32-u01.js';import {source as materialSource} from '../data/units/c22-s32-u01.source.js';import {similar as materialSimilar} from '../data/units/c22-s32-u01.similar.js';
import {items as earth} from '../data/units/c22-s32-u02.js';import {similar as earthSimilar} from '../data/units/c22-s32-u02.similar.js';
import {materialEarthCurrentItems,MATERIAL_EARTH_LANGUAGE_VERSION} from '../data/book/material-earth-student-language.js';
import {gradeDaily} from './daily-grade.js';import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
const groups=[['c22-s32-u01',materials,materialSource,materialSimilar,15],['c22-s32-u02',earth,[],earthSimilar,7]];
test('현재 물체/지구바다 표현만 고치고 원문·유사·모든 정답 위치·인정 단답·교사 확인을 보존한다',()=>{
 for(const[unit,items,source,similar,count]of groups){
  const before=JSON.stringify(items),current=materialEarthCurrentItems(items,unit);assert.equal(current.length,items.length);assert.equal(current.filter(q=>q.contentVersion===MATERIAL_EARTH_LANGUAGE_VERSION).length,count);
  for(const rows of[source,similar])materialEarthCurrentItems(rows,unit).forEach((q,i)=>assert.equal(q,rows[i]));
  for(let i=0;i<items.length;i++){
   const q=current[i],old=items[i],c=old.answerContract;assert.equal(q.id,old.id);assert.deepEqual(q.answerContract,c);assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.sourceRef,old.sourceRef);if(q===old)continue;
   if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong',q.id));
   if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');for(let n=0;n<q.choices.length;n++){const a=c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n];assert.notEqual(gradeDaily(q,a).status,'correct');}}
   if(c.type==='short-text')for(const a of c.accepted)assert.equal(gradeDaily(q,a).status,'correct');
   if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
  }
  assert.equal(JSON.stringify(items),before);
 }
 assert.equal(materialEarthCurrentItems(materials,'unrelated'),materials);
});
test('이전 재료/물 표현과 선택지를 복원하고 현재 문제로 다시 풀어도 이전 결과와 다른 기록을 남긴다',()=>{
 for(const[unit,items]of groups)for(const q of materialEarthCurrentItems(items,unit).filter(q=>q.previousVersions)){
  const old=items.find(x=>x.id===q.id),past=questionAtVersion(q,1);for(const[k,v]of Object.entries(old))assert.deepEqual(past[k],v);assert.equal(materialEarthCurrentItems([q],unit)[0],q);assert.deepEqual(materialEarthCurrentItems([structuredClone(q)],unit)[0],q);
 }
 const q=materialEarthCurrentItems(earth,'c22-s32-u02').find(q=>q.id==='c22-s32-u02-b30'),old=earth.find(x=>x.id===q.id),answers=structuredClone(q.answerContract.answers),state={answers:{[q.id]:answers,other:0},graded:{[q.id]:{status:'correct'}},first:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:789},before=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);assert.deepEqual(pickedChoiceTexts(q,{picked:[0],presentationVersion:1}),[old.choices[0]]);assert.deepEqual(pickedChoiceTexts(q,{picked:[0],presentationVersion:MATERIAL_EARTH_LANGUAGE_VERSION}),[q.choices[0]]);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers[q.id],undefined);assert.equal(next.answers.other,0);assert.equal(next.questionVersions[q.id],MATERIAL_EARTH_LANGUAGE_VERSION);assert.deepEqual(next.revisionHistory[q.id][0].answers,answers);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
