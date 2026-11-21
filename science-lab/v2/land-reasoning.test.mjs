import{landElementaryCurrentItems}from'../data/book/s41-u03.elementary.js';
import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/s41-u03.js';
import{landReasoningCurrentItems,LAND_REASONING_VERSION}from'../data/book/s41-u03.editorial.js';
import{gradeDaily}from'./daily-grade.js';
import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/s41-u03.book.js';
const unit='s41-u03',baseline=raw;
test('land explanations preserve grading, old presentations and saved written answers',()=>{
 const before=structuredClone(baseline),current=landReasoningCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;
  assert.equal(q.contentVersion,LAND_REASONING_VERSION);
  for(const key of Object.keys(old).filter(k=>!['explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  if(q.answerContract.type==='single-choice')for(let picked=0;picked<q.choices.length;picked++)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  else if(q.answerContract.type==='multi-choice')for(let mask=0;mask<32;mask++){const picked=[0,1,2,3,4].filter(n=>mask&(1<<n));assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));}
  else{assert.equal(q.answerContract.type,'written-explanation');for(const value of['',q.answerContract.sample,'another learner response'])assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));}
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);
  for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const value=old.answerContract.type==='single-choice'?old.answerContract.answer:old.answerContract.type==='multi-choice'?old.answerContract.answers:old.answerContract.sample,state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
  const daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],LAND_REASONING_VERSION);
 }
 assert.equal(changed,5);assert.deepEqual(baseline,before);assert.equal(landReasoningCurrentItems(current,unit),current);
 const repeated=landReasoningCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('land overlay excludes raw originals, similar, other-unit and unexpected versions',()=>{
 const old=baseline.find(q=>q.id==='s41-u03-b76');
 for(const sourceType of['original','similar']){const rows=[{...old,sourceRef:{type:sourceType}}];assert.equal(landReasoningCurrentItems(rows,unit),rows);}
 for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(landReasoningCurrentItems(rows,unit),rows);}
 const rows=[{...old,status:'review'}];assert.equal(landReasoningCurrentItems(rows,unit),rows);assert.equal(landReasoningCurrentItems(baseline,'other'),baseline);
});
test('repeated land classroom and daily pools share the same current authored question objects',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),reasoning=landReasoningCurrentItems(baseline,unit),current=landElementaryCurrentItems(reasoning,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems.filter(q=>reasoning.find(x=>x.id===q.id)?.contentVersion===LAND_REASONING_VERSION)){
  linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);
  assert.deepEqual(current.find(x=>x.id===q.id),q);
  const old=reasoning.find(x=>x.id===q.id),restored=questionAtVersion(q,LAND_REASONING_VERSION);for(const [key,value]of Object.entries(old))assert.deepEqual(restored[key],value);
 }
 assert.equal(linked,3);
});

import{groundCase,groundCaseForDisplay,groundCompareRecord,validGroundCompareRow}from'./ground-compare-model.js';
import{mountGroundCompare}from'./lab-ground-compare.js';
test('desk-leg wording appears in the live comparison while old saved material stays valid',()=>{
 const old=groundCase('earthquake'),saved=groundCompareRecord('earthquake','stages'),before=structuredClone(saved),display=groundCaseForDisplay('earthquake');
 assert.equal(display.rows[0][1],'책상 아래에서 몸을 보호하고 책상 다리 잡기');assert.deepEqual(groundCase('earthquake'),old);assert.equal(old.rows[0][1],'책상 아래에서 몸을 보호하고 다리 잡기');
 const events=new Map(),host={innerHTML:'',addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:(name,fn)=>{if(events.get(name)===fn)events.delete(name);},querySelector:()=>({focus(){}})},handle=mountGroundCompare(host,{rows:[saved]});
 events.get('change')({target:{value:'earthquake',matches:selector=>selector==='[data-ground-compare-case]'}});
 assert(host.innerHTML.includes('책상 아래에서 몸을 보호하고 책상 다리 잡기'));assert.deepEqual(saved,before);assert.deepEqual(handle.rows,[before]);assert(validGroundCompareRow(before));handle.dispose();
});
