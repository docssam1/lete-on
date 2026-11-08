import {withGrade5StudyNotes} from '../data/book/grade5-study-notes.js';
import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s52-u01.js';import{similar}from'../data/units/c22-s52-u01.similar.js';import{observationCurrentItems}from'../data/book/observation-language.js';
import{mixtureReadableCurrentItems,MIXTURE_READABILITY_VERSION}from'../data/book/c22-s52-u01.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s52-u01.book.js';
import{workbook,mixtureReadablePriorWorkbook}from'../data/book/c22-s52-u01.workbook.js';
const unit='c22-s52-u01',baseline=observationCurrentItems(items,unit);
test('mixture current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=mixtureReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,MIXTURE_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','givens','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.givens,old.givens);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],MIXTURE_READABILITY_VERSION);
 }
 assert.equal(changed,92);assert.deepEqual(baseline,before);assert.equal(mixtureReadableCurrentItems(current,unit),current);const repeated=mixtureReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('mixture readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s52-u01-b001','c22-s52-u01-b047']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(mixtureReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(mixtureReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(mixtureReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(mixtureReadableCurrentItems(baseline,'other'),baseline);assert.equal(mixtureReadableCurrentItems(null,unit),null);
});
test('mixture bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=mixtureReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===MIXTURE_READABILITY_VERSION)changed++;}
 assert.equal(changed,16);assert.equal(first.classroomItems.length,16);
});
test('mixture preserves prior figures and answers while explaining the actual separation steps',()=>{
 const current=mixtureReadableCurrentItems(baseline,unit);
 for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);}
 const displayAnswers=new Set([46,56,84,88]);for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(mixtureReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','taxonomy'].includes(k)||(k==='answer'&&!displayAnswers.has(i+1))))assert.deepEqual(workbook.questions[i][key],mixtureReadablePriorWorkbook.questions[i][key]);
 for(const key of['teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],withGrade5StudyNotes(mixtureReadablePriorWorkbook)[key]);
 for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++){const a=withGrade5StudyNotes(mixtureReadablePriorWorkbook)[key][i],b=workbook[key][i];assert.deepEqual(b.rail,a.rail);if(![25,31,37].includes(i))assert.deepEqual(b,a);else{const{blocks:ab,...ap}=a,{blocks:bb,...bp}=b;assert.deepEqual(ap,bp);assert(!/음용|잔류|회수|시료/.test(JSON.stringify(bb)));}}
 for(const n of[6,9,17,20,92])assert.deepEqual(workbook.questions[n-1],mixtureReadablePriorWorkbook.questions[n-1]);
 for(const n of[55,67,86,93]){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef?.no===n);assert.deepEqual(b.givens['보기'],q.given);assert.deepEqual(b.givens['문항'],q.parts);}
 const b92=current.find(q=>q.workbookRef?.no===92);assert.equal(b92.prompt,workbook.questions[91].prompt);assert.equal(b92.explanation,workbook.questions[91].explanation);assert(!b92.prompt.includes('실사형'));
 const text=workbook.questions.map(q=>[q.prompt,q.explanation,q.answer].join(' ')).join(' ');assert(!/회수 질량|잔류 조건|구현하지|타당한 대안을 인정/.test(text));assert(workbook.questions[83].prompt.includes('무게'));
});
