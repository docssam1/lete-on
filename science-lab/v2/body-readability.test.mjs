import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s51-u04.js';import{similar}from'../data/units/c22-s51-u04.similar.js';import{observationCurrentItems}from'../data/book/observation-language.js';
import{bodyReadableCurrentItems,BODY_READABILITY_VERSION}from'../data/book/c22-s51-u04.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s51-u04.book.js';
import{workbook,bodyReadablePriorWorkbook}from'../data/book/c22-s51-u04.workbook.js';
const unit='c22-s51-u04',baseline=observationCurrentItems(items,unit);
test('body current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=bodyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,BODY_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],BODY_READABILITY_VERSION);
 }
 assert.equal(changed,96);assert.deepEqual(baseline,before);assert.equal(bodyReadableCurrentItems(current,unit),current);const repeated=bodyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('body readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s51-u04-b001','c22-s51-u04-b047']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(bodyReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(bodyReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(bodyReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(bodyReadableCurrentItems(baseline,'other'),baseline);assert.equal(bodyReadableCurrentItems(null,unit),null);
});
test('body bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=bodyReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===BODY_READABILITY_VERSION)changed++;}
 assert.equal(changed,16);assert.equal(first.classroomItems.length,16);
});
test('body keeps raw and prior fields, model limits and walking comparison times',()=>{
 const current=bodyReadableCurrentItems(baseline,unit);
 for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);}
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(bodyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','answer','responseContract','taxonomy'].includes(k)))assert.deepEqual(workbook.questions[i][key],bodyReadablePriorWorkbook.questions[i][key]);
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],bodyReadablePriorWorkbook[key]);
 const q51=workbook.questions.find(q=>q.no===51),b51=current.find(q=>q.id==='c22-s51-u04-b051');assert.equal(q51.key,2);assert.equal(b51.answerContract.answer,3);assert.equal(q51.choices.length,4);assert.equal(b51.choices.length,5);assert.equal(q51.choices[2],b51.choices[3]);assert(q51.prompt.includes('걷기 전 18회'));assert(!q51.prompt.includes('쉬기 전'));
 assert(!current.find(q=>q.id==='c22-s51-u04-b092').prompt.includes('AI 실사형'));
 assert(!/기관계의 연결|대응|미실행/.test(workbook.questions.map(q=>q.explanation).join(' ')));
});
