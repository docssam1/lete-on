import test from'node:test';import assert from'node:assert/strict';
import{items as baseline}from'../data/units/c22-s42-u03.js';import{gasReadableCurrentItems,GAS_READABILITY_VERSION}from'../data/book/c22-s42-u03.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s42-u03.book.js';
import{workbook,gasReadablePriorWorkbook}from'../data/book/c22-s42-u03.workbook.js';
const unit='c22-s42-u03';
test('gas readable presentations keep scoring and every old field and answer snapshot',()=>{
 const before=structuredClone(baseline),current=gasReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,GAS_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?[0,1,2,3,4]:ac.type==='multi-choice'?Array.from({length:32},(_,m)=>[0,1,2,3,4].filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another answer']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],GAS_READABILITY_VERSION);
 }
 assert.equal(changed,33);assert.deepEqual(baseline,before);assert.equal(gasReadableCurrentItems(current,unit),current);const repeated=gasReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('gas readability excludes originals, similar, other units, review rows and future versions',()=>{
 const old=baseline.find(q=>q.id==='c22-s42-u03-b79');
 for(const type of['original','similar']){const rows=[{...old,sourceRef:{type}}];assert.equal(gasReadableCurrentItems(rows,unit),rows);}
 for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(gasReadableCurrentItems(rows,unit),rows);}
 const rows=[{...old,status:'review'}];assert.equal(gasReadableCurrentItems(rows,unit),rows);assert.equal(gasReadableCurrentItems(baseline,'other'),baseline);assert.equal(gasReadableCurrentItems(null,unit),null);
});
test('all sixteen current gas classroom objects are shared with Daily and retain their own grading positions',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=gasReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems){assert.equal(q.contentVersion,GAS_READABILITY_VERSION);linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);}
 assert.equal(linked,16);const b79=current.find(q=>q.id==='c22-s42-u03-b79');assert.equal(b79.answerContract.answer,4);assert(b79.choices[4].includes('같은 판'));assert(b79.explanation.includes('다섯째 보기'));assert.equal(workbook.questions.find(q=>q.no===14).key,0);
});
test('gas answer reasons distinguish experiment roles and keep independent bank design/share cases intact',()=>{
 const current=gasReadableCurrentItems(baseline,unit),b85=current.find(q=>q.id==='c22-s42-u03-b85'),b91=current.find(q=>q.id==='c22-s42-u03-b91');
 assert(b85.prompt.includes('설계 그림'));assert(b85.explanation.includes('아직 장치는 만들지'));assert(!/2초|6초/.test(b85.explanation));assert(b91.prompt.includes('저장'));assert(!/3번|5번/.test(b91.explanation));assert(workbook.questions.find(q=>q.no===15).explanation.includes('2초에서 6초'));
 const q30=workbook.questions.find(q=>q.no===30);assert(q30.explanation.includes('바꿀 것은 누르는 압력'));assert(q30.explanation.includes('바깥 압력은 같게'));assert(!q30.explanation.includes('질문마다 다른 역할로 읽지'));
 for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++)assert.deepEqual(workbook[key][i].rail,gasReadablePriorWorkbook[key][i].rail);
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(gasReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['key','responseContract'].includes(k)))assert.deepEqual(workbook.questions[i][key],gasReadablePriorWorkbook.questions[i][key]);
 assert.deepEqual(workbook.quickPages,gasReadablePriorWorkbook.quickPages);assert.deepEqual(workbook.figures,gasReadablePriorWorkbook.figures);
});
