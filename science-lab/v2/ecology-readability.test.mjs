import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/c22-s42-u02.js';import{items as think}from'../data/units/c22-s42-u02.think.js';
import{ecologySoundCurrentItems}from'./ecology-sound-question-language.js';
import{ecologyReadableCurrentItems,ECOLOGY_READABILITY_VERSION}from'../data/book/c22-s42-u02.editorial.js';
import{ecologyElementaryCurrentItems}from'../data/book/c22-s42-u02.elementary.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s42-u02.book.js';
import{workbook,ecologyReadablePriorWorkbook}from'../data/book/c22-s42-u02.workbook.js';import{revisedTextbookPaper}from'./revised-textbook.js';
const unit='c22-s42-u02',baseline=ecologySoundCurrentItems([...raw,...think],unit);
test('ecology readable questions preserve grading, every old field and saved written/choice answers',()=>{
 const before=structuredClone(baseline),current=ecologyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;
  assert.equal(q.contentVersion,ECOLOGY_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const contract=old.answerContract,value=contract.type==='written-explanation'?contract.sample:contract.answer,responses=contract.type==='single-choice'?[0,1,2,3,4]:contract.type==='short-text'?['',...contract.accepted,'another answer']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],ECOLOGY_READABILITY_VERSION);
 }
 assert.equal(changed,20);assert.deepEqual(baseline,before);assert.equal(ecologyReadableCurrentItems(current,unit),current);const repeated=ecologyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('ecology readability excludes originals, similar, other units and future versions',()=>{
 for(const id of['c22-s42-u02-b10','c22-s42-u02-b78']){
  const old=baseline.find(q=>q.id===id);
  for(const type of['original','similar']){const rows=[{...old,sourceRef:{type}}];assert.equal(ecologyReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(ecologyReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(ecologyReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(ecologyReadableCurrentItems(baseline,'other'),baseline);assert.equal(ecologyReadableCurrentItems(null,unit),null);
});
test('ecology classroom and Daily share six revised objects and retain each presentation answer position',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),prior=ecologyReadableCurrentItems(baseline,unit),current=ecologyElementaryCurrentItems(prior,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems.filter(q=>q.contentVersion===ECOLOGY_READABILITY_VERSION||q.previousVersions?.some(v=>v.version===ECOLOGY_READABILITY_VERSION))){linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);assert.deepEqual(questionAtVersion(q,ECOLOGY_READABILITY_VERSION).prompt,prior.find(x=>x.id===q.id).prompt);}
 assert.equal(linked,6);const q=current.find(q=>q.id==='c22-s42-u02-b78');assert.equal(q.answerContract.answer,1);assert(q.choices[1].includes('서로의 까닭'));assert(q.explanation.includes('둘째 보기'));assert.equal(workbook.questions.find(q=>q.no===63).key,4);
});
test('the current card-count blank agrees with all answer modes and keeps earlier cards and upper rails',async()=>{
 const q=workbook.questions.find(q=>q.no===48),old=ecologyReadablePriorWorkbook.questions.find(q=>q.no===48);assert.equal(q.answer,'㉠ 한/1 · ㉡ 수');assert.equal(old.answer,'㉠ 연결점 · ㉡ 개체');assert.deepEqual(q.responseContract,old.responseContract);
 const row=workbook.quickPages.flatMap(p=>p.blocks.flatMap(b=>b.rows||[])).find(r=>r[0]==='48');assert.equal(row[2],q.answer);const oldRow=ecologyReadablePriorWorkbook.quickPages.flatMap(p=>p.blocks.flatMap(b=>b.rows||[])).find(r=>r[0]==='48');assert.equal(oldRow[2],old.answer);
 for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++)assert.deepEqual(workbook[key][i].rail,ecologyReadablePriorWorkbook[key][i].rail);
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(ecologyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['key','responseContract'].includes(k)))assert.deepEqual(workbook.questions[i][key],ecologyReadablePriorWorkbook.questions[i][key]);
 const paper=await revisedTextbookPaper(unit);for(const mode of['teacher','answers','quick'])assert(paper.workbookPaper({mode}).includes(q.answer),mode);assert(!paper.workbookPaper({mode:'student'}).includes(q.answer));
});
