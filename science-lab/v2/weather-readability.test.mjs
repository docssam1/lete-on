import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s52-u03.js';import{similar}from'../data/units/c22-s52-u03.similar.js';import{observationCurrentItems}from'../data/book/observation-language.js';
import{weatherReadableCurrentItems,WEATHER_READABILITY_VERSION}from'../data/book/c22-s52-u03.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s52-u03.book.js';
import{workbook,weatherReadablePriorWorkbook}from'../data/book/c22-s52-u03.workbook.js';
import*as misc from'../data/units/c22-s52-u03.misc.js';import{questionMisconceptions}from'./question-revision.js';
const unit='c22-s52-u03',baseline=observationCurrentItems(items,unit);
test('weather current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=weatherReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,WEATHER_READABILITY_VERSION);
  const editable=['prompt','explanation','choices','givens','contentVersion','previousVersions'];if([49,52,67,78,80,84,106,108,112].includes(old.workbookRef.no))editable.push('taxonomy','misconception','diagnosticOverride');if([16,52,56,67,72,75,77,78,80,84,104,108,112].includes(old.workbookRef.no))editable.push('answerContract');for(const key of Object.keys(old).filter(k=>!editable.includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses){if([52,67,78,80,84,108,112].includes(old.workbookRef.no))assert.equal(gradeDaily(q,picked).status,picked===''?'blank':'review');else assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));}
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.givens,old.givens);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],WEATHER_READABILITY_VERSION);
 }
 assert.equal(changed,57);assert.deepEqual(baseline,before);assert.equal(weatherReadableCurrentItems(current,unit),current);const repeated=weatherReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('weather readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s52-u03-b003','c22-s52-u03-b009']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(weatherReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(weatherReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(weatherReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(weatherReadableCurrentItems(baseline,'other'),baseline);assert.equal(weatherReadableCurrentItems(null,unit),null);
});
test('weather bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=weatherReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){const repeated=second.classroomItems.find(x=>x.id===q.id);assert.deepEqual(repeated,q);assert.equal(daily.find(x=>x.id===q.id),repeated);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===WEATHER_READABILITY_VERSION)changed++;}
 assert.equal(changed,6);assert.equal(first.classroomItems.length,16);
});
test('weather aligns nine current workbook contexts and keeps old scoring and diagnoses available',()=>{
 const current=weatherReadableCurrentItems(baseline,unit),semantic=[49,52,67,78,80,84,106,108,112],written=[52,67,78,80,84,108,112];for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);}
 const displayAnswers=new Set([16,56,72,75,77,104]);for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(weatherReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','standard','taxonomy'].includes(k)||(k==='answer'&&!displayAnswers.has(i+1))))assert.deepEqual(workbook.questions[i][key],weatherReadablePriorWorkbook.questions[i][key]);
 for(const key of['teacherPages','quickPages','figures'])assert.deepEqual(workbook[key],weatherReadablePriorWorkbook[key]);for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++){assert.deepEqual(workbook[key][i].rail,weatherReadablePriorWorkbook[key][i].rail);if(![11,32,36].includes(i))assert.deepEqual(workbook[key][i],weatherReadablePriorWorkbook[key][i]);}
 for(const n of semantic){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n),old=baseline.find(x=>x.id===b.id);assert.equal(b.prompt,q.prompt);assert.equal(b.explanation,q.explanation);assert.equal(b.taxonomy.topic,q.topic);assert.deepEqual(b.sourceRef,old.sourceRef);if(q.choices)assert.deepEqual(b.choices,q.choices);if(q.parts)assert.deepEqual(b.givens['문항'],q.parts);if(written.includes(n)){assert.equal(b.answerContract.sample,q.answer);assert.deepEqual(b.answerContract.rubric.required,[q.criteria]);assert.equal(b.answerContract.reviewRequired,true);assert.equal(gradeDaily(b,b.answerContract.sample,{judge:{[b.id]:{need:[],wrong:[]}}}).status,'review');assert.equal(questionMisconceptions(b,misc).typed?.[b.id],undefined);}else{assert.deepEqual(b.answerContract,old.answerContract);if(n===106)assert.equal(questionMisconceptions(b,misc).distractors?.[b.id],undefined);}}
 for(const n of[16,56,72,75,77,104]){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n),old=baseline.find(x=>x.id===b.id);assert.equal(b.answerContract.sample,q.answer);const{sample:before,...oldGrading}=old.answerContract,{sample:after,...newGrading}=b.answerContract;assert.deepEqual(newGrading,oldGrading);}
 for(const n of[64,90]){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n);assert.deepEqual(b.choices,q.choices);assert.deepEqual(b.answerContract.answers,q.key);}
 assert(!/유효 시각|혼입 조건|포화량 공식|AI풍향계|수증기 질량/.test(workbook.questions.map(q=>[q.prompt,q.explanation,q.choices].join(' ')).join(' ')));
});
