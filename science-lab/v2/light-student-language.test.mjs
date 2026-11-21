import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s51-u02.js';import{source}from'../data/units/c22-s51-u02.source.js';import{similar}from'../data/units/c22-s51-u02.similar.js';
import{lightCurrentItems,LIGHT_LANGUAGE_VERSION}from'../data/book/light-student-language.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
test('빛의 현재 원고는 은행의 정답 순서와 응답 계약·원문·짝을 유지한다',()=>{
 const baseline=structuredClone(items),current=lightCurrentItems(items);assert.equal(current.length,80);
 for(const rows of[source,similar])lightCurrentItems(rows).forEach((q,i)=>assert.equal(q,rows[i]));
 const changed=current.filter((q,i)=>q!==items[i]);assert(changed.length>0);
 for(let i=0;i<items.length;i++){
  const q=current[i],old=items[i],c=old.answerContract;for(const key of['id','sourceRef','responseContract','answerContract','workbookRef','explanation','misconception'])assert.deepEqual(q[key],old[key]);
  if(q===old)continue;assert.equal(q.contentVersion,LIGHT_LANGUAGE_VERSION);assert.equal(q.choices?.length,old.choices?.length);
  if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong'));
  if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n]).status,'wrong'));}
  if(c.type==='short-text')for(const a of c.accepted)assert.equal(gradeDaily(q,a).status,'correct');
  if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
 }
 assert.deepEqual(items,baseline);
 // The four-choice workbook and five-choice bank intentionally use different
 // answer positions. Clarifying alignment must preserve the bank's position.
 const aligned=current.find(q=>q.workbookRef.no===12);assert.equal(aligned.answerContract.answer,3);assert(aligned.choices[3].includes('LED'));
 const multiple=current.find(q=>q.workbookRef.no===74);assert.equal(gradeDaily(multiple,[0,2,3]).status,'wrong');assert.equal(gradeDaily(multiple,[0,3]).status,'correct');
});
test('빛의 이전 보기와 판정을 복원하고 재시도는 이전 상태를 덮어쓰지 않는다',()=>{
 const current=lightCurrentItems(items);
 for(const q of current.filter(q=>q.previousVersions)){
  const old=items.find(x=>x.id===q.id);for(const[k,v]of Object.entries(old))assert.deepEqual(questionAtVersion(q,1)[k],v);
  assert.equal(lightCurrentItems([q])[0],q);assert.deepEqual(lightCurrentItems([structuredClone(q)])[0],q);
  const future={...q,contentVersion:'future-light',prompt:'future wording',previousVersions:[...q.previousVersions,{...q,version:q.contentVersion}]};assert.equal(lightCurrentItems([future])[0],future);
 }
 const q=current.find(q=>q.workbookRef.no===74),old=items.find(x=>x.id===q.id),picked=[0,3],state={answers:{[q.id]:picked,other:1},graded:{[q.id]:{status:'correct'}},first:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:456},before=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);assert.deepEqual(pickedChoiceTexts(q,{picked:[2],presentationVersion:1}),[old.choices[2]]);assert.deepEqual(pickedChoiceTexts(q,{picked:[2],presentationVersion:LIGHT_LANGUAGE_VERSION}),[q.choices[2]]);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,1);assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.equal(next.revisionHistory[q.id][0].self,'sure');assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
