import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {items,source,similar} from '../data/units/c22-s61-u04.js';import * as misc from '../data/units/c22-s61-u04.misc.js';
import {earthMotionCurrentItems} from './earth-motion-question-language.js';
import {earthMotionReadableCurrentItems,EARTH_MOTION_READABILITY_VERSION} from '../data/book/c22-s61-u04.editorial.js';import {workbook,earthMotionReadablePriorWorkbook} from '../data/book/c22-s61-u04.workbook.js';
import {gradeDaily} from './daily-grade.js';import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s61-u04.book.js';
import{observationCurrentItems}from'../data/book/observation-language.js';
const unit='c22-s61-u04',prior=observationCurrentItems(earthMotionCurrentItems(items),'c22-s61-u04'),current=earthMotionReadableCurrentItems(prior,unit);
test('earthMotion wording keeps every prior field, grading result and saved response restorable',()=>{
 const before=structuredClone(prior);let changed=0;
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,EARTH_MOTION_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','choices','givens','explanation','answerContract','diagnosticOverride','responseContract','misconception','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?old.choices.map((_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const[k,v]of Object.entries(old))assert.deepEqual(restored[k],v);
  if(!q.id.endsWith('b096'))assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));assert.deepEqual(questionMisconceptions(restored,misc),questionMisconceptions(old,misc));
  if(old.choices)old.choices.forEach((text,picked)=>assert.equal(pickedChoiceTexts(q,{picked,presentationVersion:version})[0],text));
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:JSON.parse(JSON.stringify(gradeDaily(old,value)))},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];
  for(const key of ['prompt','explanation','givens','answerContract'])assert.deepEqual(daily[key],old[key]);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.equal(next.questionVersions[q.id],EARTH_MOTION_READABILITY_VERSION);
 }
 assert.equal(changed,106);assert.deepEqual(prior,before);assert.equal(earthMotionReadableCurrentItems(current,unit),current);const repeated=earthMotionReadableCurrentItems(prior,unit);current.forEach((q,i)=>assert.equal(repeated[i],q));
});
test('earthMotion revision excludes original, paired, unrelated and future questions',()=>{
 const paired=prior.filter(q=>q.sourceRef?.type==='authored-pair');assert.equal(paired.length,39);for(const q of paired){assert.equal(current.find(x=>x.id===q.id),q);assert.equal(earthMotionReadableCurrentItems([q],unit)[0],q);}for(const rows of [source,similar,paired])assert.equal(earthMotionReadableCurrentItems(rows,unit),rows);assert.equal(earthMotionReadableCurrentItems(prior,'other'),prior);assert.equal(earthMotionReadableCurrentItems(null,unit),null);
 for(const old of prior){const future={...old,contentVersion:'future',previousVersions:[]},external={...old,sourceRef:{type:'original'}},draft={...old,status:'draft'};for(const q of [future,external,draft]){assert.equal(earthMotionReadableCurrentItems([q],unit)[0],q);assert.equal(earthMotionCurrentItems([q])[0],q);}}
});
const valid=c=>c.teacherRequired?c.sample||'그림과 글':c.kind==='single-choice'?c.answer:c.kind==='multi-choice'?c.answers:c.kind==='ordered-label-parts'?c.answers.join(', '):c.kind==='ordered-label-sequence'?c.sequence.join(' → '):['ordered-term-parts','ordered-word-parts'].includes(c.kind)?c.parts.map(p=>p.accepted[0]).join(' / '):c.accepted[0];
test('current sample wording and the repaired learner drawing retain strict automatic grading',()=>{
 let samples=0,auto=0,review=0;
 for(const q of current){const old=prior.find(x=>x.id===q.id),w=workbook.questions.find(w=>w.id===q.bookQuestionId);const c=q.answerContract.earthAuthoredContract||q.answerContract.earthMotionContract;
  assert.equal(gradeDaily(q,valid(c)).status,c.teacherRequired?'review':'correct',q.id);c.teacherRequired?review++:auto++;if(!w)continue;
  assert.equal(q.prompt,w.prompt);assert.equal(q.explanation,w.explanation);if(w.choices)assert.deepEqual(q.choices,w.choices);assert.deepEqual(q.responseContract,w.responseContract);assert.deepEqual(q.answerContract.earthAuthoredContract,w.responseContract);
  if(q.answerContract.sample!==old.answerContract.sample){samples++;assert.equal(q.answerContract.sample,w.answer);const clean=contract=>{const value=structuredClone(contract);delete value.sample;delete value.earthAuthoredContract.sample;if(w.no===96){delete value.rubric.required;delete value.earthAuthoredContract.required;}return value;};assert.deepEqual(clean(q.answerContract),clean(old.answerContract));}
  const prev=earthMotionReadablePriorWorkbook.questions[w.no-1];for(const key of ['id','key','accepted','standard','standards','sourceRef','sourceContract','taxonomy'])assert.deepEqual(w[key],prev[key]);
 }
 assert.equal(auto,116);assert.equal(review,51);assert.equal(samples,45);
 const q=current.find(q=>q.id.endsWith('b096')),w=workbook.questions[95];assert(!w.prompt.includes('문항 그림을 설계'));assert(w.prompt.includes('별 카드를 그려요'));assert.equal(q.responseContract.teacherRequired,true);assert.deepEqual(q.answerContract.rubric.required,w.requirements);assert.deepEqual(q.responseContract.required,w.requirements);assert.equal(w.requirements.length,3);assert.deepEqual(q.diagnosticOverride,{version:EARTH_MOTION_READABILITY_VERSION,typed:null,distractors:null,cloze:null,cells:null});
 for(const q of workbook.questions)if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]+' '+q.choices[q.key]);
 for(const html of Object.values(workbook.figures).filter(x=>x.includes('earth-quick-grid')))for(const m of html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>([\s\S]*?)<\/td><\/tr>/g)){const q=workbook.questions[Number(m[1])-1];if(q.form==='choice')assert([q.answer,'①②③④⑤'[q.key]].includes(m[2]));else if(!['written','draw'].includes(q.form))assert.equal(m[2],q.answer);}
});
test('actual class and production loader share the current practice questions',async()=>{
 const mod=await revisedClassroom(unit,book),repeat=await revisedClassroom(unit,book),pool=classroomQuestions(mod,[...similar,...items]);assert.deepEqual(mod.classroomItems,current);assert.deepEqual(repeat.classroomItems,mod.classroomItems);for(const q of mod.classroomItems)assert.equal(pool.find(x=>x.id===q.id),q);assert.equal(mod.chapter.check.filter(id=>mod.classroomItems.find(q=>q.id===id).contentVersion===EARTH_MOTION_READABILITY_VERSION).length,10);
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/earth-motion-workbook-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert(result.productionUnitLoaderExecuted);assert.equal(result.readableQuestions,106);assert.equal(result.studentStorageReads+result.studentStorageWrites,0);
});
