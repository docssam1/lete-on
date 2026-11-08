import {lessonReferenceItems} from '../data/book/lesson-reference-data.js';
import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s42-u04.js';import{similar}from'../data/units/c22-s42-u04.similar.js';import{withThink}from'./think-merge.js';
import{climateReadableCurrentItems,CLIMATE_READABILITY_VERSION}from'../data/book/c22-s42-u04.rail-notes.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s42-u04.book.js';
import{workbook,climateReadablePriorWorkbook}from'../data/book/c22-s42-u04.workbook.js';
const unit='c22-s42-u04',baseline=(await withThink(unit,{items,similar})).items;
test('climate current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=climateReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,CLIMATE_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],CLIMATE_READABILITY_VERSION);
 }
 assert.equal(changed,11);assert.deepEqual(baseline,before);assert.equal(climateReadableCurrentItems(current,unit),current);const repeated=climateReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('climate readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s42-u04-b27','c22-s42-u04-t08']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(climateReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(climateReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(climateReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(climateReadableCurrentItems(baseline,'other'),baseline);assert.equal(climateReadableCurrentItems(null,unit),null);
});
test('climate bank, recurring classroom and Daily use the same eleven current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=lessonReferenceItems(climateReadableCurrentItems(baseline,unit),unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===CLIMATE_READABILITY_VERSION||q.previousVersions?.some(v=>v.version===CLIMATE_READABILITY_VERSION))changed++;}
 assert.equal(changed,11);assert.equal(first.classroomItems.length,12);assert.equal(first.classroomItems[0],baseline.find(q=>q.id==='c22-s42-u04-t01'));
 const t08=current.find(q=>q.id==='c22-s42-u04-t08');assert(t08.explanation.startsWith('이 모형에서'));assert(!t08.explanation.includes('땅의 높이가 정해요'));
});
test('climate workbook preserves all grading/source fields, optional upper rails and model data',()=>{
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(climateReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','taxonomy'].includes(k)))assert.deepEqual(workbook.questions[i][key],climateReadablePriorWorkbook.questions[i][key]);
 for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++){assert.deepEqual(workbook[key][i].rail,climateReadablePriorWorkbook[key][i].rail);assert.equal(workbook[key][i].kind,climateReadablePriorWorkbook[key][i].kind);}
 assert.deepEqual(workbook.quickPages,climateReadablePriorWorkbook.quickPages);assert.deepEqual(workbook.figures,climateReadablePriorWorkbook.figures);
 for(const no of[27,47,50,55,57,59,73,74,77]){const q=workbook.questions.find(q=>q.no===no);assert(q.explanation.length>0);}
 assert(workbook.questions.find(q=>q.no===57).explanation.includes('0채를 관찰한 것은 달라요'));
 assert(workbook.questions.find(q=>q.no===77).explanation.includes('쓴 전기의 양은 없어요'));
 const body=JSON.stringify({questions:workbook.questions,pages:workbook.pages.map(p=>p.blocks)});
 assert(!/복사 평형|완화와 적응|완화·적응/.test(body));
});

