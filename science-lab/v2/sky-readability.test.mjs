import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/c22-s42-u01.js';import{items as think}from'../data/units/c22-s42-u01.think.js';
import{magnetSkyCurrentItems}from'./magnet-sky-question-language.js';
import{skyReadableCurrentItems,SKY_READABILITY_VERSION}from'../data/book/c22-s42-u01.rail-notes.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s42-u01.book.js';
import{workbook,skyReadablePriorWorkbook}from'../data/book/c22-s42-u01.workbook.js';import{revisedTextbookPaper}from'./revised-textbook.js';
const unit='c22-s42-u01',baseline=magnetSkyCurrentItems([...raw,...think],unit);
test('sky readable prompts preserve grading and every earlier field and saved response',()=>{
 const before=structuredClone(baseline),current=skyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;
  assert.equal(q.contentVersion,SKY_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const contract=old.answerContract,value=contract.type==='written-explanation'?contract.sample:contract.answer;
  const responses=contract.type==='single-choice'?[0,1,2,3,4]:contract.type==='short-text'?['',...contract.accepted,'another answer']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];
  assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.equal(next.questionVersions[q.id],SKY_READABILITY_VERSION);
 }
 assert.equal(changed,10);assert.deepEqual(baseline,before);assert.equal(skyReadableCurrentItems(current,unit),current);
 const repeated=skyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('sky readability leaves originals, similar, other units and unexpected versions alone',()=>{
 const old=baseline.find(q=>q.id==='c22-s42-u01-b52');
 for(const type of['original','similar']){const rows=[{...old,sourceRef:{type}}];assert.equal(skyReadableCurrentItems(rows,unit),rows);}
 for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(skyReadableCurrentItems(rows,unit),rows);}
 const rows=[{...old,status:'review'}];assert.equal(skyReadableCurrentItems(rows,unit),rows);assert.equal(skyReadableCurrentItems(baseline,'other'),baseline);assert.equal(skyReadableCurrentItems(null,unit),null);
});
test('sky repeated classroom and daily pool use the same three revised question objects',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=skyReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems.filter(q=>q.contentVersion===SKY_READABILITY_VERSION)){linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);}
 assert.equal(linked,3);
});
test('the pointer-star question gives Korean names without changing the English labels or answer position',async()=>{
 const q=workbook.questions.find(q=>q.no===69),old=skyReadablePriorWorkbook.questions.find(q=>q.no===69);
 assert.deepEqual(q.choices.map(c=>c.match(/\(([^)]+)\)$/)[1]),old.choices);assert.equal(q.key,old.key);assert.equal(q.key,3);assert.equal(q.answer,'④ 북극성(Polaris)');assert.equal(old.answer,'④ Polaris');assert(!q.prompt.includes('영문 이름을 고르세요'));
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],skyReadablePriorWorkbook[key]);
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(skyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['key','responseContract'].includes(k)))assert.deepEqual(workbook.questions[i][key],skyReadablePriorWorkbook.questions[i][key]);
 const paper=await revisedTextbookPaper(unit);for(const mode of['teacher','answers'])assert(paper.workbookPaper({mode}).includes(q.answer));assert(paper.workbookPaper({mode:'student'}).includes('북극성(Polaris)'));
});
