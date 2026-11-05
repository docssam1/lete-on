import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s52-u02.js';import{similar}from'../data/units/c22-s52-u02.similar.js';import{observationCurrentItems}from'../data/book/observation-language.js';
import{heatReadableCurrentItems,HEAT_READABILITY_VERSION}from'../data/book/c22-s52-u02.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s52-u02.book.js';
import{workbook,heatReadablePriorWorkbook}from'../data/book/c22-s52-u02.workbook.js';
import{heatEnergyCurrentItems}from'./heat-energy-question-language.js';import{items as energy}from'../data/units/c22-s52-u04.js';import*as misc from'../data/units/c22-s52-u02.misc.js';import{questionMisconceptions}from'./question-revision.js';
const unit='c22-s52-u02',baseline=observationCurrentItems(heatEnergyCurrentItems(items,unit),unit);
test('heat current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=heatReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,HEAT_READABILITY_VERSION);
  const editable=['prompt','explanation','choices','givens','contentVersion','previousVersions'];if([95,103].includes(old.workbookRef.no))editable.push('taxonomy','misconception','diagnosticOverride');for(const key of Object.keys(old).filter(k=>!editable.includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.givens,old.givens);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],HEAT_READABILITY_VERSION);
 }
 assert.equal(changed,36);assert.deepEqual(baseline,before);assert.equal(heatReadableCurrentItems(current,unit),current);const repeated=heatReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('heat readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s52-u02-b001','c22-s52-u02-b047']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(heatReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(heatReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(heatReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(heatReadableCurrentItems(baseline,'other'),baseline);assert.equal(heatReadableCurrentItems(null,unit),null);
});
test('heat bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=heatReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){const repeated=second.classroomItems.find(x=>x.id===q.id);assert.deepEqual(repeated,q);assert.equal(daily.find(x=>x.id===q.id),repeated);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===HEAT_READABILITY_VERSION){assert.equal(repeated,q);changed++;}}
 assert.equal(changed,6);assert.equal(first.classroomItems.length,16);
});
test('heat synchronizes the actual insulation and measurement questions without losing earlier diagnoses',()=>{
 const current=heatReadableCurrentItems(baseline,unit);for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);assert.equal(heatEnergyCurrentItems([q],unit)[0],q);}
 const displayAnswers=new Set([26,54,56,99,104]);for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(heatReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','standard','taxonomy'].includes(k)||(k==='answer'&&!displayAnswers.has(i+1))))assert.deepEqual(workbook.questions[i][key],heatReadablePriorWorkbook.questions[i][key]);
 for(const key of['teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],heatReadablePriorWorkbook[key]);for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++){assert.deepEqual(workbook[key][i].rail,heatReadablePriorWorkbook[key][i].rail);if(![14,19,20,25,37,50].includes(i))assert.deepEqual(workbook[key][i],heatReadablePriorWorkbook[key][i]);}
 for(const n of[51,95,103]){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n);assert.equal(b.prompt,q.prompt);assert.equal(b.explanation,q.explanation);if(q.choices)assert.deepEqual(b.choices,q.choices);else assert.deepEqual(b.givens['문항'],q.parts);assert.deepEqual(b.answerContract,items.find(x=>x.id===b.id).answerContract);}
 const b95=current.find(q=>q.workbookRef.no===95),b103=current.find(q=>q.workbookRef.no===103);assert.deepEqual(questionMisconceptions(b95,misc).distractors[b95.id],{3:'M07',4:'M07'});assert.equal(questionMisconceptions(b103,misc).typed?.[b103.id],undefined);assert.equal(questionMisconceptions(questionAtVersion(b103,1),misc).typed[b103.id].any,'M08');
 for(const[u,rows,numbers]of[[unit,items,[65,67]],['c22-s52-u04',energy,[51]]])for(const n of numbers){const raw=rows.find(q=>q.workbookRef.no===n);for(const version of[2,'future-without-history']){const future={...raw,contentVersion:version,previousVersions:[]};assert.equal(heatEnergyCurrentItems([future],u)[0],future);}for(const type of['original','similar']){const original={...raw,sourceRef:{type}};assert.equal(heatEnergyCurrentItems([original],u)[0],original);}}
 assert(!/보간값|시료|미관찰을 만들어|보편 광고/.test(workbook.questions.map(q=>[q.prompt,q.explanation].join(' ')).join(' ')));
});
