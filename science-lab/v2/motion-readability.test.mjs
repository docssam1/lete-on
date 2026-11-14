import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {items} from '../data/units/c22-s61-u02.js';import {source} from '../data/units/c22-s61-u02.source.js';import {similar} from '../data/units/c22-s61-u02.similar.js';import * as misc from '../data/units/c22-s61-u02.misc.js';
import {motionCurrentItems} from './motion-question-language.js';import {observationCurrentItems} from '../data/book/observation-language.js';
import {motionReadableCurrentItems,MOTION_READABILITY_VERSION} from '../data/book/c22-s61-u02.editorial.js';import {workbook,motionReadablePriorWorkbook} from '../data/book/c22-s61-u02.workbook.js';
import {gradeDaily} from './daily-grade.js';import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s61-u02.book.js';
const unit='c22-s61-u02',prior=observationCurrentItems(motionCurrentItems(items),unit),current=motionReadableCurrentItems(prior,unit);
test('motion wording keeps every prior field, grading result and saved response restorable',()=>{
 const before=structuredClone(prior);let changed=0;
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current[i];if(q===old)continue;changed++;assert.equal(q.contentVersion,MOTION_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','choices','givens','explanation','answerContract','diagnosticOverride','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  const ac=old.answerContract,value=ac.type==='written-explanation'?ac.sample:ac.type==='multi-choice'?ac.answers:ac.answer;
  const responses=ac.type==='single-choice'?old.choices.map((_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<old.choices.length},(_,m)=>old.choices.map((_,i)=>i).filter(n=>m&(1<<n))):ac.type==='short-text'?['',...ac.accepted,'another response']:['',value,'another response'];
  for(const picked of responses)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);for(const[k,v]of Object.entries(old))assert.deepEqual(restored[k],v);
  assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));assert.deepEqual(questionMisconceptions(restored,misc),questionMisconceptions(old,misc));
  if(old.choices)old.choices.forEach((text,picked)=>assert.equal(pickedChoiceTexts(q,{picked,presentationVersion:version})[0],text));
  const state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:JSON.parse(JSON.stringify(gradeDaily(old,value)))},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state),daily=restoreDailyQuestions([q],state)[0];
  for(const key of ['prompt','explanation','givens','answerContract'])assert.deepEqual(daily[key],old[key]);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.equal(next.questionVersions[q.id],MOTION_READABILITY_VERSION);
 }
 assert.equal(changed,69);assert.deepEqual(prior,before);assert.equal(motionReadableCurrentItems(current,unit),current);const repeated=motionReadableCurrentItems(prior,unit);current.forEach((q,i)=>assert.equal(repeated[i],q));
});
test('motion revision excludes original, paired, unrelated and future questions',()=>{
 for(const rows of [source,similar])assert.equal(motionReadableCurrentItems(rows,unit),rows);assert.equal(motionReadableCurrentItems(prior,'other'),prior);assert.equal(motionReadableCurrentItems(null,unit),null);
 for(const old of prior){const future={...old,contentVersion:'future',previousVersions:[]},external={...old,sourceRef:{type:'original'}},draft={...old,status:'draft'};for(const q of [future,external,draft]){assert.equal(motionReadableCurrentItems([q],unit)[0],q);assert.equal(motionCurrentItems([q])[0],q);}}
});
test('current sample wording changes no grading rules and quick keys match all five choices',()=>{
 let samples=0;
 for(const q of current){const old=prior.find(x=>x.id===q.id),n=Number(q.bookQuestionId.slice(-3)),w=workbook.questions[n-1];assert.equal(q.prompt,w.prompt);assert.equal(q.explanation,w.explanation);if(w.choices)assert.deepEqual(q.choices,w.choices);
  if(q.answerContract.sample!==old.answerContract.sample){samples++;assert.equal(q.answerContract.sample,w.answer);const{sample:a,motionContract:oldMotion,...oldRules}=old.answerContract,{sample:b,motionContract:newMotion,...newRules}=q.answerContract;assert.deepEqual(newRules,oldRules);const{sample:c,...oldMotionRules}=oldMotion,{sample:d,...newMotionRules}=newMotion;assert.deepEqual(newMotionRules,oldMotionRules);assert.equal(d,w.answer);assert.equal(w.responseContract.sample,w.answer);}else assert.deepEqual(q.answerContract,old.answerContract);
 }
 assert.equal(samples,11);for(const q of workbook.questions)if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]+' '+q.choices[q.key]);
 for(const html of Object.values(workbook.figures).filter(x=>x.includes('mt-quick-grid')))for(const m of html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>([\s\S]*?)<\/td><\/tr>/g)){const q=workbook.questions[Number(m[1])-1];if(q.form==='choice')assert([q.answer,'①②③④⑤'[q.key]].includes(m[2]));else if(!['written','draw'].includes(q.form))assert.equal(m[2],q.answer);}
 for(let i=0;i<workbook.questions.length;i++)for(const key of ['id','key','accepted','standard','standards','sourceRef','sourceContract','taxonomy'])assert.deepEqual(workbook.questions[i][key],motionReadablePriorWorkbook.questions[i][key]);
 const core=JSON.stringify({pages:workbook.pages.map(p=>p.blocks),questions:workbook.questions.map(q=>({prompt:q.prompt,explanation:q.explanation}))});assert(!/평균 속력|미수신|재전달/.test(core));for(const q of current){const c=q.answerContract.motionContract,w=workbook.questions.find(w=>w.id===q.bookQuestionId),value=c.kind==='single-choice'?c.answer:c.kind==='multi-choice'?c.answers:c.kind==='ordered-parts'?c.answers:c.kind==='ordered-sequence'?c.sequence:w.answer;assert.equal(gradeDaily(q,value).status,c.teacherRequired?'review':'correct');}
});
test('actual class and production loader share the current practice questions',async()=>{
 const mod=await revisedClassroom(unit,book),repeat=await revisedClassroom(unit,book),pool=classroomQuestions(mod,[...similar,...items]);assert.deepEqual(mod.classroomItems,current);assert.deepEqual(repeat.classroomItems,mod.classroomItems);for(const q of mod.classroomItems)assert.equal(pool.find(x=>x.id===q.id),q);assert.equal(mod.chapter.check.filter(id=>mod.classroomItems.find(q=>q.id===id).contentVersion===MOTION_READABILITY_VERSION).length,8);
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/motion-workbook-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert(result.productionUnitLoaderExecuted);assert.equal(result.readableQuestions,69);assert.equal(result.studentStorageReads+result.studentStorageWrites,0);
});
