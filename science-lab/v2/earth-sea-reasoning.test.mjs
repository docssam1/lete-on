import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/c22-s32-u02.js';
import{materialEarthCurrentItems}from'../data/book/material-earth-student-language.js';
import{earthSeaReasoningCurrentItems,EARTH_SEA_REASONING_VERSION}from'../data/book/c22-s32-u02.rail-notes.js';
import{gradeDaily}from'./daily-grade.js';
import{questionAtVersion,pickedChoiceTexts,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';
const baseline=materialEarthCurrentItems(raw,'c22-s32-u02');
test('Earth and sea authored revisions retain grading and every saved presentation',()=>{
 const untouched=structuredClone(baseline),current=earthSeaReasoningCurrentItems(baseline,'c22-s32-u02');let changes=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changes++;
  assert.equal(q.contentVersion,EARTH_SEA_REASONING_VERSION);
  for(const key of Object.keys(old).filter(k=>!['explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const contract=q.answerContract;if(contract.type==='single-choice')for(let n=0;n<q.choices.length;n++)assert.equal(gradeDaily(q,n).status==='correct',n===contract.answer);
  else for(let mask=0;mask<32;mask++){const picked=[0,1,2,3,4].filter(n=>mask&(1<<n));assert.equal(gradeDaily(q,picked).status==='correct',picked.length===contract.answers.length&&contract.answers.every(n=>picked.includes(n)));}
  const versions=[old,...(old.previousVersions||[]).map(h=>questionAtVersion(old,h.version))];
  for(const previous of versions){const version=previous.contentVersion||1,restored=questionAtVersion(q,version);assert(restored);for(const key of Object.keys(previous))assert.deepEqual(restored[key],previous[key]);if(previous.choices)for(let n=0;n<previous.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],previous.choices[n]);}
  const picked=contract.type==='multi-choice'?contract.answers:contract.answer,version=old.contentVersion||1,state={answers:{[q.id]:picked,other:1},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
  assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,1);assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(next.questionVersions[q.id],EARTH_SEA_REASONING_VERSION);
 }
 assert.equal(changes,3);assert.deepEqual(baseline,untouched);assert.equal(earthSeaReasoningCurrentItems(current,'c22-s32-u02'),current);
});
test('Earth and sea wording leaves original, similar, other-unit and future rows intact',()=>{
 const old=baseline.find(q=>q.id==='c22-s32-u02-b25');
 for(const sourceType of['original','similar']){const item={...old,sourceRef:{type:sourceType}},rows=[item];assert.equal(earthSeaReasoningCurrentItems(rows,'c22-s32-u02'),rows);}
 const future={...old,contentVersion:'future-lesson'},rows=[future];assert.equal(earthSeaReasoningCurrentItems(rows,'c22-s32-u02'),rows);assert.equal(earthSeaReasoningCurrentItems(baseline,'other'),baseline);
});
