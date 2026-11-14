import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {items} from '../data/units/c22-s61-u01.js';import {source} from '../data/units/c22-s61-u01.source.js';import {similar} from '../data/units/c22-s61-u01.similar.js';import * as misc from '../data/units/c22-s61-u01.misc.js';
import {acidCurrentItems} from './acid-question-language.js';import {acidStudentCurrentItems} from '../data/book/acid-student-language.js';import {termParticleCurrentItems} from '../data/book/term-particle-language.js';
import {acidReadableCurrentItems,ACID_READABILITY_VERSION} from '../data/book/c22-s61-u01.editorial.js';import {workbook,acidReadablePriorWorkbook} from '../data/book/c22-s61-u01.workbook.js';
import {gradeDaily} from './daily-grade.js';import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s61-u01.book.js';
const unit='c22-s61-u01',prior=termParticleCurrentItems(acidStudentCurrentItems(acidCurrentItems(items)),unit),current=acidReadableCurrentItems(prior,unit);
test('acid wording keeps every prior field, grading result and saved response restorable',()=>{
 const before=structuredClone(prior);let changed=0;
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,ACID_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','choices','givens','explanation','answerContract','diagnosticOverride','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?old.choices.map((_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const[k,v]of Object.entries(old))assert.deepEqual(restored[k],v);
  assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));assert.deepEqual(questionMisconceptions(restored,misc),questionMisconceptions(old,misc));
  if(old.choices)old.choices.forEach((text,picked)=>assert.equal(pickedChoiceTexts(q,{picked,presentationVersion:version})[0],text));
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];
  for(const key of ['prompt','explanation','givens','answerContract'])assert.deepEqual(daily[key],old[key]);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.equal(next.questionVersions[q.id],ACID_READABILITY_VERSION);
 }
 assert.equal(changed,86);assert.deepEqual(prior,before);assert.equal(acidReadableCurrentItems(current,unit),current);const repeated=acidReadableCurrentItems(prior,unit);current.forEach((q,i)=>assert.equal(repeated[i],q));
});
test('acid revision excludes original, paired, unrelated and future questions',()=>{
 for(const rows of [source,similar])assert.equal(acidReadableCurrentItems(rows,unit),rows);assert.equal(acidReadableCurrentItems(prior,'other'),prior);assert.equal(acidReadableCurrentItems(null,unit),null);
 for(const old of prior){const future={...old,contentVersion:'future',previousVersions:[]},external={...old,sourceRef:{type:'original'}},draft={...old,status:'draft'};for(const q of [future,external,draft])assert.equal(acidReadableCurrentItems([q],unit)[0],q);}
});
test('current sample wording changes no grading rules and quick keys match all five choices',()=>{
 let samples=0;
 for(const q of current){const old=prior.find(x=>x.id===q.id),n=q.workbookRef.no,w=workbook.questions[n-1];assert.equal(q.prompt,w.prompt);assert.equal(q.explanation,w.explanation);if(w.choices)assert.deepEqual(q.choices,w.choices);
  if(q.answerContract.sample!==old.answerContract.sample){samples++;assert.equal(q.answerContract.sample,w.answer);const{sample:a,...oldRules}=old.answerContract,{sample:b,...newRules}=q.answerContract;assert.deepEqual(newRules,oldRules);}else assert.deepEqual(q.answerContract,old.answerContract);
 }
 assert.equal(samples,20);for(const q of workbook.questions)if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]+' '+q.choices[q.key]);
 for(const html of Object.values(workbook.figures).filter(x=>x.includes('mt-quick-grid')))for(const m of html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>([\s\S]*?)<\/td><\/tr>/g)){const q=workbook.questions[Number(m[1])-1];if(!['written','draw'].includes(q.form))assert.equal(m[2],q.answer);}
 for(let i=0;i<workbook.questions.length;i++)for(const key of ['id','key','accepted','standard','standards','sourceRef','sourceContract','taxonomy'])assert.deepEqual(workbook.questions[i][key],acidReadablePriorWorkbook.questions[i][key]);
 const core=JSON.stringify({pages:workbook.pages.map(p=>p.blocks),questions:workbook.questions.map(q=>({prompt:q.prompt,explanation:q.explanation}))});assert(!/pH|중성|중화|이온/.test(core));
});
test('actual class and production loader share the current practice questions',async()=>{
 const mod=await revisedClassroom(unit,book),repeat=await revisedClassroom(unit,book),pool=classroomQuestions(mod,[...similar,...items]);assert.deepEqual(mod.classroomItems,current);assert.deepEqual(repeat.classroomItems,mod.classroomItems);for(const q of mod.classroomItems)assert.equal(pool.find(x=>x.id===q.id),q);assert.equal(mod.chapter.check.filter(id=>mod.classroomItems.find(q=>q.id===id).contentVersion===ACID_READABILITY_VERSION).length,6);
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/acid-workbook-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert(result.productionUnitLoaderExecuted);assert.equal(result.readableQuestions,86);assert.equal(result.studentStorageReads+result.studentStorageWrites,0);
});
