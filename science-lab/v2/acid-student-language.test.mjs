import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s61-u01.js';import{source}from'../data/units/c22-s61-u01.source.js';import{similar}from'../data/units/c22-s61-u01.similar.js';import*as misc from'../data/units/c22-s61-u01.misc.js';
import{acidCurrentItems,ACID_QUESTION_VERSION}from'./acid-question-language.js';import{acidStudentCurrentItems,ACID_STUDENT_LANGUAGE_VERSION}from'../data/book/acid-student-language.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
const prior=acidCurrentItems(items),current=acidStudentCurrentItems(prior);
test('산과 염기 학생 표현은 앞선 정답 수정·성취기준·진단 예외와 모든 정답 위치를 유지한다',()=>{
 const before=structuredClone(prior);assert.equal(current.length,128);assert.equal(current.filter(q=>q.contentVersion===ACID_STUDENT_LANGUAGE_VERSION).length,36);
 for(const rows of[source,similar])acidStudentCurrentItems(rows).forEach((q,i)=>assert.equal(q,rows[i]));
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current[i],c=old.answerContract;assert.equal(q.id,old.id);assert.deepEqual(q.answerContract,c);assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.taxonomy,old.taxonomy);assert.deepEqual(q.sourceRef,old.sourceRef);if(q===old)continue;
  if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong',q.id));
  if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');for(let n=0;n<q.choices.length;n++)assert.equal(gradeDaily(q,c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n]).status,'wrong');}
  if(c.type==='short-text')for(const a of c.accepted||[c.answer])assert.equal(gradeDaily(q,a).status,'correct');
  if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
  assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc),q.id);
 }
 assert.deepEqual(prior,before);assert(acidCurrentItems(current).every((q,i)=>q===current[i]));assert(acidStudentCurrentItems(current).every((q,i)=>q===current[i]));assert.deepEqual(acidStudentCurrentItems(structuredClone(current)),current);
});
test('산과 염기의 원래·앞선 교정·현재 표현 세 세대와 각 응답 기록을 되돌릴 수 있다',()=>{
 for(let i=0;i<current.length;i++){
  const q=current[i],old=prior[i];if(q===old)continue;
  const restored=questionAtVersion(q,old.contentVersion||1);for(const[k,v]of Object.entries(old))assert.deepEqual(restored[k],v,q.id);
  for(const p of old.previousVersions||[]){const x=questionAtVersion(q,p.version);for(const[k,v]of Object.entries(p))if(k!=='version')assert.deepEqual(x[k],v,q.id);}
 }
 const q=current.find(q=>q.workbookRef.no===33),old=prior.find(x=>x.id===q.id);assert.equal(old.contentVersion,ACID_QUESTION_VERSION);assert.equal(q.diagnosticOverride.version,ACID_STUDENT_LANGUAGE_VERSION);
 const state={answers:{[q.id]:old.answerContract.answer,other:'기존 답'},graded:{[q.id]:{status:'review'}},self:{[q.id]:'unsure'},questionVersions:{[q.id]:ACID_QUESTION_VERSION},at:500},before=structuredClone(state);
 assert.equal(restoreDailyQuestions([q],state)[0].prompt,old.prompt);const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,'기존 답');assert.equal(next.answers[q.id],undefined);assert.equal(next.revisionHistory[q.id][0].version,ACID_QUESTION_VERSION);assert.equal(next.revisionHistory[q.id][0].answers,state.answers[q.id]);assert.equal(next.revisionHistory[q.id][0].self,'unsure');assert.equal(restoreDailyQuestions([q],next)[0],q);
 const choice=current.find(q=>q.workbookRef.no===81),oldChoice=prior.find(q=>q.id===choice.id),n=choice.answerContract.answer;assert.deepEqual(pickedChoiceTexts(choice,{picked:n,presentationVersion:1}),[oldChoice.choices[n]]);assert.deepEqual(pickedChoiceTexts(choice,{picked:n,presentationVersion:ACID_STUDENT_LANGUAGE_VERSION}),[choice.choices[n]]);
});
