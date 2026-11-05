import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s51-u01.js';import{similar}from'../data/units/c22-s51-u01.similar.js';
import{geologyCurrentItems,GEOLOGY_LANGUAGE_VERSION}from'../data/book/geology-student-language.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
test('지층의 현재 표현은 모든 정답 위치와 인정 답·원문/짝 제외·원시 입력을 보존한다',()=>{
 const baseline=structuredClone(items),current=geologyCurrentItems(items);assert.equal(current.length,96);assert(current.some((q,i)=>q!==items[i]));geologyCurrentItems(similar).forEach((q,i)=>assert.equal(q,similar[i]));
 const canonical={...items[0],sourceRef:{type:'original'}};assert.equal(geologyCurrentItems([canonical])[0],canonical);
 for(let i=0;i<items.length;i++){
  const q=current[i],old=items[i],c=old.answerContract;
  for(const key of['id','sourceRef','responseContract','answerContract','figure','explanation','evidence'])assert.deepEqual(q[key],old[key]);
  if(q===old)continue;assert.equal(q.contentVersion,GEOLOGY_LANGUAGE_VERSION);assert.equal(q.choices?.length,old.choices?.length);
  if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong'));
  if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n]).status,'wrong'));}
  if(c.type==='short-text')for(const a of c.accepted)assert.equal(gradeDaily(q,a).status,'correct');
  if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
 }
 assert.deepEqual(items,baseline);
});
test('지층의 이전 원고와 선택지를 복원하고 재시도는 이전 판정·자기 판단을 남긴다',()=>{
 const current=geologyCurrentItems(items);
 for(const q of current.filter(q=>q.previousVersions)){
  const old=items.find(x=>x.id===q.id);for(const[k,v]of Object.entries(old))assert.deepEqual(questionAtVersion(q,1)[k],v);
  assert.equal(geologyCurrentItems([q])[0],q);assert.deepEqual(geologyCurrentItems([structuredClone(q)])[0],q);
  const future={...q,contentVersion:'future-geology',prompt:'future presentation',previousVersions:[...q.previousVersions,{...q,version:q.contentVersion}]};assert.equal(geologyCurrentItems([future])[0],future);
 }
 const q=current.find(q=>q.previousVersions&&q.answerContract.type==='single-choice'&&JSON.stringify(q.choices)!==JSON.stringify(items.find(x=>x.id===q.id).choices)),old=items.find(x=>x.id===q.id),picked=q.answerContract.answer,state={answers:{[q.id]:picked,other:1},first:{[q.id]:{status:'correct'}},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:101},before=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);assert.deepEqual(pickedChoiceTexts(q,{picked,presentationVersion:1}),[old.choices[picked]]);assert.deepEqual(pickedChoiceTexts(q,{picked,presentationVersion:GEOLOGY_LANGUAGE_VERSION}),[q.choices[picked]]);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,1);assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.equal(next.revisionHistory[q.id][0].self,'sure');assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
