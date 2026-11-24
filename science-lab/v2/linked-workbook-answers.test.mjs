import{beforeEnergyTask}from'./tests/energy-guided-stage.mjs';
import{beforeWeatherTask}from'./tests/weather-guided-stage.mjs';
import{beforeHeatTask}from'./tests/heat-guided-stage.mjs';
import{beforeMixtureTask}from'./tests/mixture-guided-stage.mjs';
import{reviewStudentModule}from'./student-language-review.js';
import{beforeSolutionTask}from'./tests/solution-guided-stage.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {linkedWorkbookAnswers, LINKED_WORKBOOK_ANSWER_VERSION as version, LINKED_WORKBOOK_ANSWER_UNITS as units} from '../data/book/linked-workbook-answers.js';
import {withThink, loadJudge} from './think-merge.js';
import {questionAtVersion, restoreDailyQuestions, restartCurrentQuestion, questionMisconceptions} from './question-revision.js';
import {snapshotDailyPaper, resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {revisedClassroom, classroomQuestions} from './revised-lesson.js';

const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8');
const start=code.indexOf('const UNITS = ')+14,end=code.indexOf('\n// 문제은행만',start);
const expression='('+code.slice(start,end).trim().replace(/;$/,'')+')';
const loaders=new vm.Script(expression,{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const loaded=new Map(await Promise.all(units.map(async unit=>[unit,await loaders[unit]()] )));
const expected={'c22-s51-u03':[16,21,96],'c22-s51-u04':[92],'c22-s52-u01':[46,56,84,88,92],'c22-s52-u02':[26,54,56,99,104]};
const previousVersion=unit=>'20261106-'+({'c22-s51-u03':'solution','c22-s51-u04':'body','c22-s52-u01':'mixture','c22-s52-u02':'heat'}[unit])+'-readable-workbook';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('four actual bank loaders align fourteen reviewed workbook samples while preserving grading and saved versions',async()=>{
 let changed=0,oldVersions=0;
 for(const unit of units){
  const mod=loaded.get(unit),judge=await loadJudge(unit),{workbook}=await import('../data/book/'+unit+'.workbook.js');
  const current=mod.items.map(q=>questionAtVersion(q,version)).filter(Boolean);
  assert.deepEqual(current.map(q=>q.workbookRef.no),expected[unit]);
  for(const q of current){
   changed++;
   const old=questionAtVersion(q,previousVersion(unit)),w=workbook.questions.find(w=>w.id===q.workbookRef.id);
   assert(old);assert.equal(q.prompt,w.prompt);assert.equal(q.answerContract.sample,w.answer);
   assert.notEqual(q.answerContract.sample,old.answerContract.sample);
   for(const key of Object.keys(old).filter(k=>!['answerContract','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
   const restored={...q.answerContract,sample:old.answerContract.sample};
   if(unit==='c22-s51-u03'&&w.no===16){assert.deepEqual(q.answerContract.rubric.required,[w.criteria]);restored.rubric=old.answerContract.rubric;}
   assert.deepEqual(restored,old.answerContract);
   for(const response of['',old.answerContract.sample,q.answerContract.sample,'관찰한 자료로 다시 생각해 보았어요.'])assert.deepEqual(gradeDaily(q,response,{judge,misc:mod.misc}),gradeDaily(old,response,{judge,misc:mod.misc}));
   assert.equal(gradeDaily(q,q.answerContract.sample,{judge,misc:mod.misc}).status,'review');
   assert.deepEqual(questionMisconceptions(q,mod.misc),questionMisconceptions(old,mod.misc));
   for(const v of new Set([old.contentVersion,...old.previousVersions.map(p=>p.version)])){assert.deepEqual(questionAtVersion(q,v),questionAtVersion(old,v));oldVersions++;}
   const state={answers:{[q.id]:old.answerContract.sample,other:'keep'},graded:{[q.id]:{status:'review'}},questionVersions:{[q.id]:old.contentVersion}},copy=structuredClone(state);
   assert.deepEqual(restoreDailyQuestions([q],state)[0],old);
   const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.deepEqual(paper.questions[0].answerContract,old.answerContract);
   const next=restartCurrentQuestion(state,q);assert.deepEqual(state,copy);assert.equal(next.questionVersions[q.id],version);assert.equal(next.answers.other,'keep');assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);
  }
 }
 assert.equal(changed,14);assert(oldVersions>=28);
});

test('alignment is limited to the exact reviewed authored question, source link, sample and version',()=>{
 for(const unit of units){
  const q=loaded.get(unit).items.find(q=>questionAtVersion(q,version)),old=questionAtVersion(q,previousVersion(unit)),before=structuredClone(old);
  const once=linkedWorkbookAnswers([old],unit);assert.equal(once[0].contentVersion,version);assert.equal(linkedWorkbookAnswers(once,unit),once);assert.equal(linkedWorkbookAnswers([old],unit)[0],once[0]);
  for(const patch of[{id:'other'},{contentVersion:'future'},{status:'review'},{sourceRef:{type:'original'}},{sourceRef:{type:'similar'}},{sourceContent:{}},{prompt:'other'},{workbookRef:{...old.workbookRef,id:'other'}},{workbookRef:{...old.workbookRef,unit:'other'}},{workbookRef:{...old.workbookRef,no:999}},{responseContract:'short-text'},{answerContract:{...old.answerContract,sample:'already edited'}}]){
   const rows=[{...old,...patch}];assert.equal(linkedWorkbookAnswers(rows,unit),rows);
  }
  const rows=[old];assert.equal(linkedWorkbookAnswers(rows,'other'),rows);assert.deepEqual(old,before);
 }
 assert.equal(linkedWorkbookAnswers(null,units[0]),null);
 const unit='c22-s51-u03',q=loaded.get(unit).items.find(q=>q.workbookRef.no===16),old=questionAtVersion(q,previousVersion(unit)),rows=[{...old,answerContract:{...old.answerContract,rubric:{...old.answerContract.rubric,required:['already edited']}}}];assert.equal(linkedWorkbookAnswers(rows,unit),rows);
});

test('classroom, Daily and real bank print output use the current examples without exposing student keys',async()=>{
 let selected=0;
 for(const unit of units){
  const mod=loaded.get(unit),raw=await import('../data/book/'+unit+'.book.js'),classroom=await revisedClassroom(unit,raw),pool=classroomQuestions(classroom,[...mod.similar,...mod.items]);
  for(const q of mod.items.filter(q=>questionAtVersion(q,version))){
   const old=questionAtVersion(q,previousVersion(unit));
   for(const rows of[classroom.classroomItems,pool]){const found=rows.find(x=>x.id===q.id);if(found){assert.deepEqual(beforeEnergyTask(beforeWeatherTask(beforeHeatTask(beforeMixtureTask(beforeSolutionTask(found))))),q);selected++;}}
   const active=['c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s52-u04'].includes(unit)?(await reviewStudentModule(unit,mod)).items.find(x=>x.id===q.id):q,student=mod.bankPaper({...mod,items:[['c22-s52-u02','c22-s52-u03','c22-s52-u04'].includes(unit)?active:q],similar:[],source:[],mode:'student'}),teacher=mod.bankPaper({...mod,items:[['c22-s52-u02','c22-s52-u03','c22-s52-u04'].includes(unit)?active:q],similar:[],source:[],mode:'teacher'});
   assert(!student.includes(escape(active.answerContract.sample)));assert(!student.includes('class="ed-key"'));
   assert(teacher.includes(escape(active.answerContract.sample)),q.id);
   assert(!teacher.includes(escape(old.answerContract.sample)),q.id+' obsolete sample');
  }
 }
 assert(selected>14);
 const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8');
 const currentVersion=code.match(/revised-lesson\.js\?v=([^'"]+)/)[1];const entry=new URLSearchParams(index.match(/src="\.\/v2\.js\?([^"]+)/)[1]),lessonParams=new URLSearchParams('v='+currentVersion);assert.equal(entry.get('book'),lessonParams.get('v'));for(const[key,value]of lessonParams)if(key!=='v')assert.equal(entry.get(key),value);assert(code.includes('revised-lesson.js?v='+currentVersion));assert(lesson.includes('linked-workbook-answers.js?v='+version));
 for(const unit of units){const line=code.split('\n').find(l=>l.startsWith(" '"+unit+"':"));assert(line.includes('linked-workbook-answers.js?v='+version));}
});
