import test from 'node:test';import assert from 'node:assert/strict';
import {items as magnet} from '../data/units/s41-u01.js';import {source as magnetSource} from '../data/units/s41-u01.source.js';import {similar as magnetSimilar} from '../data/units/s41-u01.similar.js';
import {items as sky} from '../data/units/c22-s42-u01.js';import {source as skySource} from '../data/units/c22-s42-u01.source.js';import {similar as skySimilar} from '../data/units/c22-s42-u01.similar.js';
import {magnetSkyCurrentItems,MAGNET_SKY_LANGUAGE_VERSION} from './magnet-sky-question-language.js';
import {gradeDaily} from './daily-grade.js';import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
const groups=[['s41-u01',magnet,magnetSource,magnetSimilar,9],['c22-s42-u01',sky,skySource,skySimilar,7]];
test('두 단원의 현재 창작 문구만 바꾸고 원문/유사·정답 위치·표 답·열린 채점 경계를 유지한다',()=>{
 for(const [unit,items,source,similar,count]of groups){
  const before=JSON.stringify(items),current=magnetSkyCurrentItems(items,unit);assert.equal(current.length,items.length);assert.equal(current.filter(q=>q.contentVersion===MAGNET_SKY_LANGUAGE_VERSION).length,count);
  for(const rows of[source,similar]){const next=magnetSkyCurrentItems(rows,unit);next.forEach((q,i)=>assert.equal(q,rows[i]));}
  for(let i=0;i<items.length;i++){
   const old=items[i],q=current[i],c=old.answerContract;assert.deepEqual(q.answerContract,c);assert.equal(q.id,old.id);
   if(q===old)continue;
   assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.sourceRef,old.sourceRef);
   if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong',q.id));
   if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');for(let n=0;n<q.choices.length;n++){const a=c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n];assert.notEqual(gradeDaily(q,a).status,'correct');}}
   if(c.type==='table-fill'){const answers=c.rows.map(r=>r.answer);assert.equal(gradeDaily(q,answers).status,'correct');const wrong=structuredClone(answers);wrong[0][0]='유리';assert.equal(gradeDaily(q,wrong).status,'wrong');}
   if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
  }
  assert.equal(JSON.stringify(items),before);
 }
 assert.equal(magnetSkyCurrentItems(magnet,'unrelated'),magnet);
});
test('이전 표현과 선택 문구를 복원하고 다시 풀 때 이전 답·판정·다른 문항 기록을 보존한다',()=>{
 for(const [unit,items]of groups)for(const q of magnetSkyCurrentItems(items,unit).filter(q=>q.previousVersions)){
  const old=items.find(x=>x.id===q.id),past=questionAtVersion(q,1);for(const[k,v]of Object.entries(old))assert.deepEqual(past[k],v);assert.equal(magnetSkyCurrentItems([q],unit)[0],q);assert.deepEqual(magnetSkyCurrentItems([structuredClone(q)],unit)[0],q);
 }
 const q=magnetSkyCurrentItems(sky,'c22-s42-u01').find(q=>q.id==='c22-s42-u01-b22'),old=sky.find(x=>x.id===q.id),state={answers:{[q.id]:2,other:0},graded:{[q.id]:{status:'correct'}},first:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:456},before=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);assert.deepEqual(pickedChoiceTexts(q,{picked:[2],presentationVersion:1}),[old.choices[2]]);assert.deepEqual(pickedChoiceTexts(q,{picked:[2],presentationVersion:MAGNET_SKY_LANGUAGE_VERSION}),[q.choices[2]]);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers[q.id],undefined);assert.equal(next.answers.other,0);assert.equal(next.questionVersions[q.id],MAGNET_SKY_LANGUAGE_VERSION);assert.equal(next.revisionHistory[q.id][0].answers,2);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
