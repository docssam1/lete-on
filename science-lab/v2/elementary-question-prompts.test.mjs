import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink} from './think-merge.js';
import {withElementaryQuestionPrompts,elementaryPromptCurrentItems,ELEMENTARY_PROMPT_EDITS,ELEMENTARY_PROMPT_VERSION} from '../data/book/elementary-question-prompts.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbook,revisedTextbookPaper} from './revised-textbook.js';
import {electricityCurrentItems} from './electricity-question-language.js';
import {combustionCurrentItems} from './combustion-question-language.js';
import {seasonCurrentItems} from './season-question-language.js';
import {electricityReadableCurrentItems} from '../data/book/c22-s62-u03.editorial.js';
import {combustionReadableCurrentItems} from '../data/book/c22-s62-u02.editorial.js';
import {seasonReadableCurrentItems} from '../data/book/c22-s62-u01.editorial.js';
import {electricityPairCurrentItems} from './electricity-pair-language.js';
import {combustionPairCurrentItems} from './combustion-pair-language.js';
import {seasonPairCurrentItems} from './season-pair-language.js';

const units=Object.keys(ELEMENTARY_PROMPT_EDITS);
const pipelines={
 'c22-s62-u03':rows=>electricityPairCurrentItems(electricityReadableCurrentItems(electricityCurrentItems(rows),'c22-s62-u03'),'c22-s62-u03'),
 'c22-s62-u02':rows=>combustionPairCurrentItems(combustionReadableCurrentItems(combustionCurrentItems(rows),'c22-s62-u02'),'c22-s62-u02'),
 'c22-s62-u01':rows=>seasonPairCurrentItems(seasonReadableCurrentItems(seasonCurrentItems(rows),'c22-s62-u01'),'c22-s62-u01'),
};
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const versioned=new Set(['prompt','contentVersion','previousVersions','diagnosticOverride']);

test('only eleven authored workbook prompts change; every other field and complete prior manuscript survive',async()=>{
 let changed=0;
 for(const unit of units){
  const {workbook:current,elementaryPromptPriorWorkbook:prior}=await import(`../data/book/${unit}.workbook.js`),saved=structuredClone(prior);
  assert.equal(current.questions.length,128);
  for(const key of Object.keys(prior).filter(k=>k!=='questions'))assert.equal(current[key],prior[key]);
  for(let i=0;i<128;i++){
   const q=current.questions[i],old=prior.questions[i];if(q===old)continue;changed++;
   const patch=ELEMENTARY_PROMPT_EDITS[unit][q.no];assert(patch);assert.equal(old.prompt,patch.previous);assert.equal(q.prompt,patch.prompt);
   assert.deepEqual({...q,prompt:old.prompt},old);
  }
  assert.deepEqual(prior,saved);assert.equal(withElementaryQuestionPrompts(current),current);
 }
 assert.equal(changed,11);
});

test('all eleven bank revisions retain grading, effective diagnostics and every stored presentation',async()=>{
 let changed=0;
 for(const unit of units){
  const raw=await import(`../data/units/${unit}.js`),misc=await import(`../data/units/${unit}.misc.js`),prior=pipelines[unit](raw.items),saved=structuredClone(prior),current=elementaryPromptCurrentItems(prior,unit);
  for(let i=0;i<prior.length;i++){
   const q=current[i],old=prior[i];if(q===old)continue;changed++;
   assert.equal(q.contentVersion,ELEMENTARY_PROMPT_VERSION);
   for(const key of Object.keys(old).filter(k=>!versioned.has(k)))assert.deepEqual(q[key],old[key],q.id+' '+key);
   if(old.diagnosticOverride?.version===old.contentVersion)assert.deepEqual({...q.diagnosticOverride,version:old.diagnosticOverride.version},old.diagnosticOverride);
   else assert.equal(q.diagnosticOverride,old.diagnosticOverride);
   assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));
   const c=q.answerContract,responses=c.type==='multi-choice'?Array.from({length:1<<q.choices.length},(_,mask)=>q.choices.map((_,i)=>i).filter(i=>mask&(1<<i))):c.type==='short-text'?['',...c.accepted,'another response']:['',c.sample,'another response'];
   for(const value of responses)assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value),q.id);
   for(const version of [old.contentVersion||1,...(old.previousVersions||[]).map(p=>p.version)]){
    const restored=questionAtVersion(q,version),before=questionAtVersion(old,version);
    assert(restored&&before);for(const [key,value]of Object.entries(before))assert.deepEqual(restored[key],value,q.id+' '+version+' '+key);
    assert.deepEqual(questionMisconceptions(restored,misc),questionMisconceptions(before,misc));
   }
   const value=responses[1],state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:old.contentVersion||1}},snapshot=structuredClone(state);
   const restored=restoreDailyQuestions([q],state)[0];assert.equal(restored.prompt,old.prompt);assert.deepEqual(restored.answerContract,old.answerContract);
   const restarted=restartCurrentQuestion(state,q);assert.deepEqual(state,snapshot);assert.equal(restarted.answers.other,'keep');assert.equal(restarted.questionVersions[q.id],ELEMENTARY_PROMPT_VERSION);assert.equal(restarted.revisionHistory[q.id][0].presentation.prompt,old.prompt);
  }
  assert.deepEqual(prior,saved);assert.equal(elementaryPromptCurrentItems(current,unit),current);
  const repeated=elementaryPromptCurrentItems(prior,unit);current.forEach((q,i)=>assert.equal(q,repeated[i]));
 }
 assert.equal(changed,11);
});

test('actual unit loaders, classrooms, web workbooks and both paper sets share the new prompts',async()=>{
 const url=new URL('./v2.js',import.meta.url),source=fs.readFileSync(url,'utf8'),a=source.indexOf('const UNITS = ')+14,b=source.indexOf('\n// 문제은행만',a);
 const loaders=new vm.Script('('+source.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
 let changed=0;
 for(const unit of units){
  const data=await loaders[unit](),book=await import(`../data/book/${unit}.book.js`),classroom=await revisedClassroom(unit,book),web=await revisedTextbook(unit,book),paper=await revisedTextbookPaper(unit);
  for(const [no,edit]of Object.entries(ELEMENTARY_PROMPT_EDITS[unit])){
   const q=data.items.find(q=>q.bookQuestionId===`${unit}-w${no.padStart(3,'0')}`);changed++;assert(q);
   assert.equal(q.prompt,edit.prompt);assert.equal(q.contentVersion,ELEMENTARY_PROMPT_VERSION);assert.deepEqual(classroom.classroomItems.find(it=>it.id===q.id),q);
   assert.equal(web.workbook.questions.find(it=>it.id===q.bookQuestionId).prompt,q.prompt);
   for(const mode of ['student','teacher']){assert(paper.workbookPaper({mode}).includes(esc(edit.prompt)));assert(data.bankPaper({mode}).includes(esc(edit.prompt)));}
  }
 }
 assert.equal(changed,11);
});

test('originals, paired questions, unsupported units and unreviewed versions keep their own text',async()=>{
 for(const unit of units){
  const raw=await import(`../data/units/${unit}.js`),prior=pipelines[unit](raw.items),old=prior.find(q=>Object.values(ELEMENTARY_PROMPT_EDITS[unit]).some(edit=>q.prompt===edit.previous));assert(old);
  for(const source of ['original','similar','authored-pair']){const rows=[{...old,sourceRef:{...old.sourceRef,type:source}}];assert.equal(elementaryPromptCurrentItems(rows,unit),rows);}
  for(const patch of [{status:'draft'},{contentVersion:'future'},{prompt:'future prompt'},{bookQuestionId:'other'},{sourceRef:{...old.sourceRef,originalExam:true}}]){const rows=[{...old,...patch}];assert.equal(elementaryPromptCurrentItems(rows,unit),rows);}
  for(const unsupported of ['other','__proto__','constructor'])assert.equal(elementaryPromptCurrentItems(prior,unsupported),prior);
  assert.equal(elementaryPromptCurrentItems(null,unit),null);
  const {elementaryPromptPriorWorkbook:book}=await import(`../data/book/${unit}.workbook.js`),q=book.questions.find(q=>ELEMENTARY_PROMPT_EDITS[unit][q.no]);
  for(const patch of [{status:'draft'},{contentVersion:'future'},{prompt:'future prompt'},{sourceRef:{...q.sourceRef,type:'original'}},{sourceRef:{...q.sourceRef,originalExam:true}}]){
   const candidate={...book,questions:[{...q,...patch}]};assert.equal(withElementaryQuestionPrompts(candidate),candidate);
  }
 }
});

test('bank paper modules bypass cached former workbook URLs and load the revised presentation',async()=>{
 for(const [unit,label]of [['c22-s62-u01','season'],['c22-s62-u02','combustion'],['c22-s62-u03','electricity']]){
  const url=new URL(`./${label}-bank-paper.js`,import.meta.url),source=fs.readFileSync(url,'utf8'),context=vm.createContext({}),cache=new Map();let staleReads=0,freshReads=0;
  const compiled=new vm.SourceTextModule(source,{context,identifier:url.href});
  await compiled.link(async spec=>{
   const target=new URL(spec,url);if(cache.has(target.href))return cache.get(target.href);
   let ns=await import(target.href);
   if(target.pathname.endsWith(`/${unit}.workbook.js`)){
    if(target.search.includes(ELEMENTARY_PROMPT_VERSION))freshReads++;
    else {staleReads++;ns={...ns,workbook:ns.elementaryPromptPriorWorkbook};}
   }
   const mod=new vm.SyntheticModule(Object.keys(ns),function(){for(const [key,value]of Object.entries(ns))this.setExport(key,value);},{context});cache.set(target.href,mod);await mod.link(()=>{});return mod;
  });
  await compiled.evaluate();assert.equal(staleReads,0);assert.equal(freshReads,1);
  const html=compiled.namespace.bankPaper({mode:'student'});for(const edit of Object.values(ELEMENTARY_PROMPT_EDITS[unit]))assert(html.includes(esc(edit.prompt)));
 }
});
