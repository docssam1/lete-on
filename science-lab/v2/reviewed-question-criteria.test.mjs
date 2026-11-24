import{beforeWeatherTask}from'./tests/weather-guided-stage.mjs';
import{beforeHeatTask}from'./tests/heat-guided-stage.mjs';
import{reviewStudentModule}from'./student-language-review.js';
import{beforeMixtureTask}from'./tests/mixture-guided-stage.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {reviewedQuestionCriteria,withReviewedWorkbookCriteria,REVIEWED_CRITERIA_VERSION as version,REVIEWED_CRITERIA_UNITS as units} from '../data/book/reviewed-question-criteria.js';
import {withThink,loadJudge} from './think-merge.js';
import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
import {withObservedPhotoAlt} from '../data/book/observation-language.js';
import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),start=code.indexOf('const UNITS = ')+14,end=code.indexOf('\n// 문제은행만',start),expression='('+code.slice(start,end).trim().replace(/;$/,'')+')';
const loaders=new vm.Script(expression,{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const beforeGrade5=q=>['20261116-mixture-workbook-context','20261116-weather-workbook-context','20261116-heat-workbook-context','20261116-energy-workbook-context','20261116-acid-workbook-context'].includes(q.contentVersion)?(questionAtVersion(q,version)||q):q.contentVersion==='20261115-grade5-question-review'?questionAtVersion(q,q.previousVersions.at(-1).version):q;
const mods=new Map(await Promise.all(units.map(async unit=>[unit,await loaders[unit]()] )));
const previous=q=>questionAtVersion(q,q.previousVersions.at(-1).version);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('130 current criteria and twelve choice phrasings preserve keys, teacher review, every saved version and source material',async()=>{
 let criteria=0,choices=0;
 for(const unit of units){
  const mod=mods.get(unit),judge=await loadJudge(unit),{grade6ReviewPriorWorkbook:priorGrade6,grade5ReviewPriorWorkbook:priorGrade5,workbook:liveWorkbook}=await import('../data/book/'+unit+'.workbook.js'),workbook=priorGrade6||priorGrade5||liveWorkbook;
  for(const q of mod.items.map(beforeGrade5).filter(q=>q.contentVersion===version)){
   const old=previous(q),w=workbook.questions.find(w=>w.id===q.workbookRef.id);assert(old);assert.equal(q.prompt,w.prompt);
   const isChoice=q.answerContract.type==='single-choice';
   if(isChoice){choices++;assert.equal(q.choices[q.answerContract.answer],w.choices[w.key]);assert.deepEqual(q.answerContract,old.answerContract);for(let i=0;i<q.choices.length;i++)if(i!==q.answerContract.answer)assert.equal(q.choices[i],old.choices[i]);}
   else{criteria++;assert.deepEqual(q.answerContract.rubric.required,[w.criteria]);assert.deepEqual({...q.answerContract,rubric:old.answerContract.rubric},old.answerContract);assert.equal(gradeDaily(q,q.answerContract.sample,{judge,misc:mod.misc}).status,'review');}
   for(const key of Object.keys(old).filter(k=>!['choices','answerContract','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
   if(!isChoice)assert.deepEqual(q.choices,old.choices);
   const inputs=isChoice?Array.from({length:q.choices.length},(_,i)=>i):['',old.answerContract.sample,'자료에서 확인한 까닭을 설명해요.'];
   for(const value of inputs)assert.deepEqual(gradeDaily(q,value,{judge,misc:mod.misc}),gradeDaily(old,value,{judge,misc:mod.misc}));
   assert.deepEqual(questionMisconceptions(q,mod.misc),questionMisconceptions(old,mod.misc));
   for(const v of new Set([old.contentVersion,...(old.previousVersions||[]).map(p=>p.version)]))assert.deepEqual(questionAtVersion(q,v),questionAtVersion(old,v));
   const state={answers:{[q.id]:isChoice?old.answerContract.answer:old.answerContract.sample,other:'keep'},graded:{[q.id]:{status:isChoice?'correct':'review'}},questionVersions:{[q.id]:old.contentVersion}},before=structuredClone(state);
   assert.deepEqual(restoreDailyQuestions([q],state)[0],old);
   const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.deepEqual(paper.questions[0].answerContract,old.answerContract);
   const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.questionVersions[q.id],version);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.equal(next.answers.other,'keep');
  }
 }
 assert.equal(criteria,130);assert.equal(choices,12);
});

test('39 workbook criteria change no student question, answer, page, figure, writing space or quick key',async()=>{
 let changed=0;
 for(const unit of units.filter(u=>u!=='c22-s51-u02')){
  const {grade6ReviewPriorWorkbook,grade5ReviewPriorWorkbook,workbook:liveWorkbook,reviewedCriteriaPriorWorkbook:old}=await import('../data/book/'+unit+'.workbook.js'),workbook=grade6ReviewPriorWorkbook||grade5ReviewPriorWorkbook||liveWorkbook;assert(old);
  for(let i=0;i<workbook.questions.length;i++){const q=workbook.questions[i],before=old.questions[i];assert.deepEqual({...q,criteria:before.criteria},before);if(q.criteria!==before.criteria)changed++;}
  for(const k of Object.keys(old).filter(k=>k!=='questions'))assert.deepEqual(workbook[k],old[k]);
  const {art}=await import('../data/book/'+unit+'.workbook-art.js'),paper=makeWorkbookPaper(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),art),before=makeWorkbookPaper(withObservedPhotoAlt(withElementaryReadingDirections(old)),art);
  for(const mode of['student','quick'])assert.equal(paper.workbookPaper({mode}),before.workbookPaper({mode}));
 }
 assert.equal(changed,39);
 const {workbook:heat}=await import('../data/book/c22-s52-u02.workbook.js'),{workbook:weather}=await import('../data/book/c22-s52-u03.workbook.js'),{workbook:energy}=await import('../data/book/c22-s52-u04.workbook.js'),{workbook:acid}=await import('../data/book/c22-s61-u01.workbook.js');
 assert(heat.questions.find(q=>q.no===4).criteria.includes('예상과 그렇게 생각한 까닭'));
 assert(weather.questions.find(q=>q.no===28).criteria.includes('덧붙여도 인정'));
 assert(!weather.questions.find(q=>q.no===16).criteria.includes('질량'));
 assert(!energy.questions.find(q=>q.no===75).criteria.includes('버전/날짜'));
 assert(acid.questions.find(q=>q.no===46).criteria.includes('덧붙여도 인정'));
});

test('exact-version guards preserve originals, edited criteria and reordered or already edited choices',()=>{
 for(const unit of units){
  const q=mods.get(unit).items.find(q=>q.contentVersion===version),old=previous(q),copy=structuredClone(old),rows=[old],once=reviewedQuestionCriteria(rows,unit);
  assert.equal(once[0].contentVersion,version);assert.equal(reviewedQuestionCriteria(once,unit),once);assert.equal(reviewedQuestionCriteria(rows,unit)[0],once[0]);
  for(const patch of[{id:'other'},{status:'draft'},{contentVersion:'future'},{sourceContent:{}},{sourceRef:{type:'original'}},{sourceRef:{type:'similar'}},{prompt:'another question'},{workbookRef:{...old.workbookRef,id:'other'}},{workbookRef:{...old.workbookRef,no:999}},{workbookRef:{...old.workbookRef,unit:'other'}},{responseContract:'other'}]){const rows=[{...old,...patch}];assert.equal(reviewedQuestionCriteria(rows,unit),rows);}
  const edited=old.choices?{...old,choices:[...old.choices].reverse()}:{...old,answerContract:{...old.answerContract,rubric:{...old.answerContract.rubric,required:['already edited']}}};
  const others=[edited];assert.equal(reviewedQuestionCriteria(others,unit),others);assert.equal(reviewedQuestionCriteria(rows,'other'),rows);assert.deepEqual(old,copy);
 }
 assert.equal(reviewedQuestionCriteria(null,units[0]),null);assert.equal(withReviewedWorkbookCriteria(null),null);
});

test('current classroom, Daily and printed keys share the same version and retain student answer hiding',async()=>{
 let found=0;
 for(const unit of units){
  const historical=mods.get(unit),mod=historical,currentPrint=['c22-s52-u02','c22-s52-u03'].includes(unit)?await reviewStudentModule(unit,historical):historical,book=await import('../data/book/'+unit+'.book.js'),classroom=await revisedClassroom(unit,book),pool=classroomQuestions(classroom,[...mod.similar,...mod.items]),student=currentPrint.bankPaper({...currentPrint,mode:'student'}),teacher=currentPrint.bankPaper({...currentPrint,mode:'teacher'});
  for(const q of historical.items.filter(q=>beforeGrade5(q).contentVersion===version)){
   for(const list of[classroom.classroomItems,pool]){const displayed=list.find(x=>x.id===q.id);if(displayed){assert.deepEqual(beforeWeatherTask(beforeHeatTask(beforeMixtureTask(displayed))),displayed.heatGuidedResponse?beforeWeatherTask(beforeHeatTask((await reviewStudentModule(unit,historical)).items.find(x=>x.id===q.id))):q);found++;}}
   if(q.answerContract.rubric){const active=(await reviewStudentModule(unit,mod)).items.find(x=>x.id===q.id),criterion=active.answerContract.rubric.required[0];assert(teacher.includes(escape(criterion)),'teacher '+q.id);if(['c22-s52-u02','c22-s52-u03'].includes(unit)){const at=student.indexOf('data-paper-item="'+q.id+'"'),end=student.indexOf('</article>',at);assert(at>=0&&end>at);assert(!student.slice(at,end).includes(escape(criterion)),'student '+q.id);}else assert(!student.includes(escape(criterion)),'student '+q.id);}
  }
  assert(!student.includes('class="ed-key"'));
 }
 assert(found>=142);
 const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),shared=fs.readFileSync(new URL('./revised-textbook.js',import.meta.url),'utf8'),lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8');const activeTextbookVersion=code.match(/revised-textbook\.js\?v=([^'"]+)/)[1];assert(index.includes('&book='+activeTextbookVersion));assert(shared.includes(".includes(unit)?'"+version+"'"));assert(lesson.includes('reviewed-question-criteria.js?v='+version));
 for(const unit of units)assert(code.split('\n').find(l=>l.startsWith(" '"+unit+"':")).includes('reviewed-question-criteria.js?v='+version));
});
