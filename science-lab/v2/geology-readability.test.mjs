import {withGrade5StudyNotes} from '../data/book/grade5-study-notes.js';
import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s51-u01.js';import{similar}from'../data/units/c22-s51-u01.similar.js';import{geologyCurrentItems}from'../data/book/geology-student-language.js';
import{geologyReadableCurrentItems,GEOLOGY_READABILITY_VERSION}from'../data/book/c22-s51-u01.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s51-u01.book.js';
import{workbook,geologyReadablePriorWorkbook}from'../data/book/c22-s51-u01.workbook.js';
const unit='c22-s51-u01',baseline=geologyCurrentItems(items);
test('geology current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=geologyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,GEOLOGY_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],GEOLOGY_READABILITY_VERSION);
 }
 assert.equal(changed,28);assert.deepEqual(baseline,before);assert.equal(geologyReadableCurrentItems(current,unit),current);const repeated=geologyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('geology readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s51-u01-b001','c22-s51-u01-b040']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(geologyReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(geologyReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(geologyReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(geologyReadableCurrentItems(baseline,'other'),baseline);assert.equal(geologyReadableCurrentItems(null,unit),null);
});
test('geology bank, recurring classroom and Daily use the same twelve current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=geologyReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===GEOLOGY_READABILITY_VERSION)changed++;}
 assert.equal(changed,12);assert.equal(first.classroomItems.length,16);
});
test('geology keeps raw version one, the prior language version and corrected answer displays',()=>{
 const current=geologyReadableCurrentItems(baseline,unit);
 for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);}
 for(const no of[15,16,31]){const q=workbook.questions.find(q=>q.no===no);assert.equal(q.answer,'\u2460\u2461\u2462\u2463\u2464'[q.key]+' '+q.choices[q.key]);assert.notEqual(q.answer,geologyReadablePriorWorkbook.questions.find(q=>q.no===no).answer);}
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(geologyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','taxonomy'].includes(k)))assert.deepEqual(workbook.questions[i][key],geologyReadablePriorWorkbook.questions[i][key]);
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],withGrade5StudyNotes(geologyReadablePriorWorkbook)[key]);
});
