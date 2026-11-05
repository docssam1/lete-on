import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s51-u03.js';import{similar}from'../data/units/c22-s51-u03.similar.js';import{solutionCurrentItems}from'./solution-question-language.js';
import{solutionReadableCurrentItems,SOLUTION_READABILITY_VERSION}from'../data/book/c22-s51-u03.rail-notes.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s51-u03.book.js';
import{workbook,solutionReadablePriorWorkbook}from'../data/book/c22-s51-u03.workbook.js';
const unit='c22-s51-u03',baseline=solutionCurrentItems(items);
test('solution current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=solutionReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,SOLUTION_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],SOLUTION_READABILITY_VERSION);
 }
 assert.equal(changed,96);assert.deepEqual(baseline,before);assert.equal(solutionReadableCurrentItems(current,unit),current);const repeated=solutionReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('solution readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s51-u03-b001','c22-s51-u03-b047']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(solutionReadableCurrentItems(rows,unit),rows);assert.equal(solutionCurrentItems(rows)[0],rows[0]);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(solutionReadableCurrentItems(rows,unit),rows);assert.equal(solutionCurrentItems(rows)[0],rows[0]);}
  const rows=[{...old,status:'review'}];assert.equal(solutionReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(solutionReadableCurrentItems(baseline,'other'),baseline);assert.equal(solutionReadableCurrentItems(null,unit),null);
});
test('solution bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=solutionReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===SOLUTION_READABILITY_VERSION)changed++;}
 assert.equal(changed,16);assert.equal(first.classroomItems.length,16);
});
test('solution keeps all raw and prior fields, weight vocabulary and the melting distinction',()=>{
 const current=solutionReadableCurrentItems(baseline,unit);
 for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);assert.equal(solutionCurrentItems([q])[0],q);}
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(solutionReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','answer','responseContract','taxonomy'].includes(k)))assert.deepEqual(workbook.questions[i][key],solutionReadablePriorWorkbook.questions[i][key]);
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],solutionReadablePriorWorkbook[key]);
 const q65=workbook.questions.find(q=>q.no===65),b65=current.find(q=>q.id==='c22-s51-u03-b065');assert.equal(q65.key,1);assert.equal(b65.answerContract.answer,0);assert(q65.choices.includes('\uB179\uAE30'));assert(b65.choices.includes('\uB179\uAE30'));assert(!q65.choices.includes('\uC735\uD574'));assert(!b65.choices.includes('\uC735\uD574'));assert.equal(q65.choices.length,4);assert.equal(b65.choices.length,5);
 const q89=workbook.questions.find(q=>q.no===89);assert(q89.prompt.includes('\uC5BC\uC74C'));assert(!q89.explanation.includes('\uC124\uD0D5 \uC790\uCCB4\uAC00 \uC5F4'));
 for(const q of workbook.questions)assert(!/\uC9C8\uB7C9|\uAC19\uC740 \uACC4|\uD558\uD55C \uC815\uBCF4/.test(q.explanation));
});
