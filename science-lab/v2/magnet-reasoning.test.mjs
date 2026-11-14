import{magnetElementaryCurrentItems}from'../data/book/s41-u01.elementary.js';
import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/s41-u01.js';
import{magnetSkyCurrentItems}from'./magnet-sky-question-language.js';
import{magnetReasoningCurrentItems,MAGNET_REASONING_VERSION}from'../data/book/s41-u01.rail-notes.js';
import{gradeDaily}from'./daily-grade.js';
import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/s41-u01.book.js';
const unit='s41-u01',baseline=magnetSkyCurrentItems(raw,unit);
test('magnet explanations preserve grading, old presentations and saved written answers',()=>{
 const before=structuredClone(baseline),current=magnetReasoningCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;
  assert.equal(q.contentVersion,MAGNET_REASONING_VERSION);
  for(const key of Object.keys(old).filter(k=>!['explanation','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  if(q.answerContract.type==='multi-choice')for(let mask=0;mask<32;mask++){const picked=[0,1,2,3,4].filter(n=>mask&(1<<n));assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));}
  else{assert.equal(q.answerContract.type,'written-explanation');for(const value of['',q.answerContract.sample,'another learner response'])assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));}
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);
  for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const value=old.answerContract.type==='multi-choice'?old.answerContract.answers:old.answerContract.sample,state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
  const daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],MAGNET_REASONING_VERSION);
 }
 assert.equal(changed,7);assert.deepEqual(baseline,before);assert.equal(magnetReasoningCurrentItems(current,unit),current);
 const repeated=magnetReasoningCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('magnet overlay excludes raw originals, similar, other-unit and unexpected versions',()=>{
 const old=baseline.find(q=>q.id==='s41-u01-b08');
 for(const sourceType of['original','similar']){const rows=[{...old,sourceRef:{type:sourceType}}];assert.equal(magnetReasoningCurrentItems(rows,unit),rows);}
 for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(magnetReasoningCurrentItems(rows,unit),rows);}
 const rows=[{...old,status:'review'}];assert.equal(magnetReasoningCurrentItems(rows,unit),rows);assert.equal(magnetReasoningCurrentItems(baseline,'other'),baseline);
});
test('repeated magnet classroom and daily pools share the same current authored question objects',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),reasoning=magnetReasoningCurrentItems(baseline,unit),current=magnetElementaryCurrentItems(reasoning,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems.filter(q=>reasoning.find(x=>x.id===q.id)?.contentVersion===MAGNET_REASONING_VERSION)){
  linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);
  assert.deepEqual(current.find(x=>x.id===q.id),q);
  const old=reasoning.find(x=>x.id===q.id),restored=questionAtVersion(q,MAGNET_REASONING_VERSION);for(const [key,value]of Object.entries(old))assert.deepEqual(restored[key],value);
 }
 assert.equal(linked,4);
});
