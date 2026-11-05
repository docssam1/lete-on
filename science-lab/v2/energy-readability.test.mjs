import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/c22-s52-u04.js';import{similar}from'../data/units/c22-s52-u04.similar.js';import{observationCurrentItems}from'../data/book/observation-language.js';
import{energyReadableCurrentItems,ENERGY_READABILITY_VERSION}from'../data/book/c22-s52-u04.editorial.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/c22-s52-u04.book.js';
import{workbook,energyReadablePriorWorkbook}from'../data/book/c22-s52-u04.workbook.js';
import*as misc from'../data/units/c22-s52-u04.misc.js';import{questionMisconceptions}from'./question-revision.js';
import{heatEnergyCurrentItems}from'./heat-energy-question-language.js';
const unit='c22-s52-u04',baseline=heatEnergyCurrentItems(items,unit);
test('energy current presentations preserve scoring, every old field and saved responses',()=>{
 const before=structuredClone(baseline),current=energyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,ENERGY_READABILITY_VERSION);
  const editable=['prompt','explanation','choices','givens','contentVersion','previousVersions'];if([48,49,50,52,56,68,77,80,84,97,102,104,105,109,111,112].includes(old.workbookRef.no))editable.push('taxonomy','misconception','diagnosticOverride');if([52,56,68,69,72,74,75,76,80,102,108,109,111,112].includes(old.workbookRef.no))editable.push('answerContract');for(const key of Object.keys(old).filter(k=>!editable.includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?Array.from({length:old.choices.length},(_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses){if([52,68,80,109,111,112].includes(old.workbookRef.no))assert.equal(gradeDaily(q,picked).status,picked===''?'blank':'review');else if([56,102].includes(old.workbookRef.no)){if(picked==='')assert.equal(gradeDaily(q,picked).status,'blank');else assert.notEqual(gradeDaily(q,picked).status,'correct');}else assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));}
  if([56,102].includes(old.workbookRef.no))for(const answer of q.answerContract.accepted)assert.equal(gradeDaily(q,answer).status,'correct');
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.prompt,old.prompt);assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.givens,old.givens);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],ENERGY_READABILITY_VERSION);
 }
 assert.equal(changed,61);assert.deepEqual(baseline,before);assert.equal(energyReadableCurrentItems(current,unit),current);const repeated=energyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('energy readability guards original, similar, review, future and other unit questions',()=>{
 for(const id of['c22-s52-u04-b003','c22-s52-u04-b009']){
  const old=baseline.find(q=>q.id===id);assert(old);
  for(const type of['original','similar','authored-workbook']){const rows=[{...old,sourceRef:{type}}];assert.equal(energyReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(energyReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(energyReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(energyReadableCurrentItems(baseline,'other'),baseline);assert.equal(energyReadableCurrentItems(null,unit),null);
});
test('energy bank, recurring classroom and Daily use the same sixteen current presentations',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=energyReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let changed=0;
 for(const q of first.classroomItems){const repeated=second.classroomItems.find(x=>x.id===q.id);assert.deepEqual(repeated,q);assert.equal(daily.find(x=>x.id===q.id),repeated);assert.deepEqual(current.find(x=>x.id===q.id),q);if(q.contentVersion===ENERGY_READABILITY_VERSION)changed++;}
 assert.equal(changed,7);assert.equal(first.classroomItems.length,16);
});
test('energy aligns sixteen contexts, both changed short answers and the actual quick key',()=>{
 const current=energyReadableCurrentItems(baseline,unit),semantic=[48,49,50,52,56,68,77,80,84,97,102,104,105,109,111,112],written=[52,68,80,109,111,112];for(const q of current){const raw=items.find(x=>x.id===q.id),restored=questionAtVersion(q,1);for(const key of Object.keys(raw))assert.deepEqual(restored[key],raw[key]);assert.equal(heatEnergyCurrentItems([q],unit)[0],q);}
 const displayAnswers=new Set([69,74,75,76,104,108]);for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(energyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['id','no','form','key','responseContract','standard','taxonomy'].includes(k)||(k==='answer'&&!displayAnswers.has(i+1))))assert.deepEqual(workbook.questions[i][key],energyReadablePriorWorkbook.questions[i][key]);
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages'])assert.deepEqual(workbook[key],energyReadablePriorWorkbook[key]);for(const[key,figure]of Object.entries(workbook.figures))if(key!=='energy-quick-84')assert.equal(figure,energyReadablePriorWorkbook.figures[key]);
 for(const n of semantic){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n),old=baseline.find(x=>x.id===b.id);assert.equal(b.prompt,q.prompt);assert.equal(b.explanation,q.explanation);assert.equal(b.taxonomy.topic,q.topic);assert.deepEqual(b.sourceRef,old.sourceRef);if(q.choices)assert.deepEqual(b.choices,q.choices);if(q.parts)assert.deepEqual(b.givens['문항'],q.parts);if(n===77){assert.deepEqual(b.givens['자료'],q.given);assert.equal(Object.hasOwn(b.givens,'보기'),false);}if(written.includes(n)){assert.equal(b.answerContract.sample,q.answer);assert.deepEqual(b.answerContract.rubric.required,[q.criteria]);assert.equal(b.answerContract.reviewRequired,true);assert.equal(gradeDaily(b,b.answerContract.sample,{judge:{[b.id]:{need:[],wrong:[]}}}).status,'review');}else if(![56,102].includes(n))assert.deepEqual(b.answerContract,old.answerContract);}
 for(const n of[56,102]){const b=current.find(x=>x.workbookRef.no===n),old=baseline.find(x=>x.id===b.id);assert.equal(b.answerContract.answer,workbook.questions[n-1].answer);assert.equal(gradeDaily(b,b.answerContract.answer).status,'correct');assert.notEqual(gradeDaily(b,old.answerContract.answer).status,'correct');const saved={answers:{[b.id]:old.answerContract.answer}};assert.equal(gradeDaily(restoreDailyQuestions([b],saved)[0],old.answerContract.answer).status,'correct');assert.equal(questionMisconceptions(b,misc).typed?.[b.id],undefined);}
 for(const n of[69,74,75,76,108]){const q=workbook.questions[n-1],b=current.find(x=>x.workbookRef.no===n),old=baseline.find(x=>x.id===b.id);assert.equal(b.answerContract.sample,q.answer);const{sample:before,...oldGrading}=old.answerContract,{sample:after,...newGrading}=b.answerContract;assert.deepEqual(newGrading,oldGrading);}
 for(const q of workbook.questions)if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]+' '+q.choices[q.key]);for(const html of Object.values(workbook.figures).filter(x=>x.includes('mt-quick-grid')))for(const m of html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>([\s\S]*?)<\/td><\/tr>/g)){const q=workbook.questions[Number(m[1])-1];if(!['written','draw'].includes(q.form))assert.equal(m[2],q.answer);}assert(workbook.figures['energy-quick-84'].includes('같은 활동과 기간에 실제로 쓴 종이 장수를 비교한다.'));
});
