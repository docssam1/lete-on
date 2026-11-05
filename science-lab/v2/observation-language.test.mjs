import test from'node:test';import assert from'node:assert/strict';
import{OBSERVATION_LANGUAGE_UNITS,OBSERVATION_LANGUAGE_VERSION,observationCurrentItems,withObservationLanguage}from'../data/book/observation-language.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,pickedChoiceTexts,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';
import{motionCurrentItems}from'./motion-question-language.js';import{earthMotionCurrentItems}from'./earth-motion-question-language.js';import{heatEnergyCurrentItems}from'./heat-energy-question-language.js';
const groups=await Promise.all(['c22-s51-u04','c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s61-u02','c22-s61-u04'].map(async unit=>{let{items}=await import(`../data/units/${unit}.js`);if(unit==='c22-s61-u02')items=motionCurrentItems(items);if(unit==='c22-s61-u04')items=earthMotionCurrentItems(items);if(unit==='c22-s52-u02')items=heatEnergyCurrentItems(items,unit);return{unit,items}}));
test('관찰 상태 표현층은 기존 응답 계약·정답 위치·원문/짝과 이전 교정층을 보존한다',async()=>{
 let revised=0;
 for(const{unit,items}of groups){const before=structuredClone(items),current=observationCurrentItems(items,unit);
  for(let i=0;i<items.length;i++){const old=items[i],q=current[i],c=old.answerContract;for(const key of['id','answerContract','responseContract','sourceRef','explanation','diagnosticOverride','figure'])assert.deepEqual(q[key],old[key]);if(q===old)continue;revised++;assert.equal(q.contentVersion,OBSERVATION_LANGUAGE_VERSION);assert.equal(q.choices?.length,old.choices?.length);
   if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong'));
   if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n]).status,'wrong'));}
   if(c.type==='short-text')for(const a of c.accepted||[c.answer])assert.equal(gradeDaily(q,a).status,'correct');
   if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
   const canonical={...old,sourceRef:{type:'original'}};assert.equal(observationCurrentItems([canonical],unit)[0],canonical);const pair={...old,sourceRef:{type:'similar'}};assert.equal(observationCurrentItems([pair],unit)[0],pair);
  }assert.deepEqual(items,before);
 }assert.equal(revised,10);
 for(const unit of OBSERVATION_LANGUAGE_UNITS){const module=await import(`../data/book/${unit}.workbook.js`),prior=module.observationPriorWorkbook,workbook=module.motionPhotoPriorWorkbook||module.ecologyPhotoPriorWorkbook||module.activityGuidePriorWorkbook||module.weatherPhotoPriorWorkbook||module.studentGuidePriorWorkbook||module.biologyGuidancePriorWorkbook||module.learnerPriorWorkbook||module.workbook;assert.deepEqual(withObservationLanguage(prior),workbook);for(let i=0;i<prior.questions.length;i++)for(const key of Object.keys(prior.questions[i]).filter(k=>!['topic','prompt','choices','given','parts','options'].includes(k)))assert.deepEqual(workbook.questions[i][key],prior.questions[i][key]);for(const key of['figures','teacherPages','quickPages'])assert.deepEqual(workbook[key],prior[key]);}
});
test('관찰 표현을 바꿔도 이전 질문·선택지·기존 기록과 미래 버전을 복원한다',()=>{
 for(const{unit,items}of groups)for(const q of observationCurrentItems(items,unit).filter(q=>q.contentVersion===OBSERVATION_LANGUAGE_VERSION)){
  const old=items.find(x=>x.id===q.id),priorVersion=old.contentVersion||1;for(const[k,v]of Object.entries(old))assert.deepEqual(questionAtVersion(q,priorVersion)[k],v);
  assert.equal(observationCurrentItems([q],unit)[0],q);const future={...q,contentVersion:'future-status',previousVersions:[...q.previousVersions,{...q,version:q.contentVersion}]};assert.equal(observationCurrentItems([future],unit)[0],future);
  const picked=q.answerContract.type==='multi-choice'?q.answerContract.answers:q.answerContract.answer??q.answerContract.sample,state={answers:{[q.id]:picked,other:1},graded:{[q.id]:{status:'correct'}},first:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},questionVersions:{[q.id]:priorVersion}},before=structuredClone(state),restored=restoreDailyQuestions([q],state)[0];assert.equal(restored.prompt,old.prompt);if(old.choices){assert.deepEqual(restored.choices,old.choices);assert.deepEqual(pickedChoiceTexts(q,{picked,presentationVersion:priorVersion}),[].concat(picked).map(i=>old.choices[i]));}
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,1);assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.equal(next.revisionHistory[q.id][0].self,'sure');assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.equal(restoreDailyQuestions([q],next)[0],q);
 }
});
