import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {workbook,ecologyElementaryPriorWorkbook as prior} from '../data/book/c22-s42-u02.workbook.js';
import {ecologyElementaryCurrentItems,ECOLOGY_ELEMENTARY_VERSION} from '../data/book/c22-s42-u02.elementary.js';
import {ecologyReadableCurrentItems} from '../data/book/c22-s42-u02.editorial.js';
import {ecologySoundCurrentItems} from './ecology-sound-question-language.js';
import {withThink} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';

const unit='c22-s42-u02';
async function priorBank(){
 const [{items},{items:think}]=await Promise.all([import('../data/units/'+unit+'.js'),import('../data/units/'+unit+'.think.js')]);
 return ecologyReadableCurrentItems(ecologySoundCurrentItems([...items,...think],unit),unit);
}
async function actualBank(){
 const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
 return new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}))[unit]();
}
const withoutPresentation=q=>Object.fromEntries(Object.entries(q).filter(([key])=>!['prompt','contentVersion','previousVersions'].includes(key)));

test('ecology directions preserve all question requirements, answer modes and upper-learning rails',async()=>{
 assert.equal(workbook.questions.length,80);assert.equal(workbook.questions.filter((q,i)=>q.prompt!==prior.questions[i].prompt).length,18);
 for(const key of Object.keys(prior).filter(k=>k!=='questions'))assert.deepEqual(workbook[key],prior[key]);
 for(let i=0;i<80;i++)assert.deepEqual(withoutPresentation(workbook.questions[i]),withoutPresentation(prior.questions[i]));
 const paper=await revisedTextbookPaper(unit);
 for(const mode of ['student','teacher','answers','quick']){
  const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
  if(mode==='student'||mode==='teacher')for(const q of workbook.questions)for(const part of q.prompt.split(/\[\s*\]|\(\s*\)/).filter(Boolean))assert(html.includes(part.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))),q.id);
  if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
 }
});

test('actual ecology bank retains grading and every historical presentation when prompts change',async()=>{
 const before=await priorBank(),snapshot=structuredClone(before),{items:current,source,similar}=await actualBank();
 assert.equal(current.length,92);let changed=0;
 for(let i=0;i<before.length;i++){
  const old=before[i],q=current[i];assert.deepEqual(withoutPresentation(q),withoutPresentation(old));
  if(q.prompt===old.prompt)continue;changed++;assert.equal(q.contentVersion,ECOLOGY_ELEMENTARY_VERSION);
  const ac=old.answerContract;
  const values=ac.type==='single-choice'?[0,1,2,3,4]:ac.type==='multi-choice'?Array.from({length:32},(_,mask)=>[0,1,2,3,4].filter(n=>mask&(1<<n))):ac.type==='short-text'?[ac.answer,...(ac.accepted||[]),'different answer']:ac.type==='written-explanation'?[ac.sample,'different explanation']:ac.type==='cloze'?[ac.blanks.map(b=>b.answer),ac.blanks.map(()=> 'different answer')]:ac.type==='table-fill'?[ac.rows.map(r=>r.answer),[]]:[];
  for(const value of values)assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));
  for(const version of new Set([old.contentVersion||1,...(old.previousVersions||[]).map(v=>v.version)])){
   const expected=questionAtVersion(old,version),restored=questionAtVersion(q,version);
   for(const [key,value]of Object.entries(expected))assert.deepEqual(restored[key],value);
   if(expected.choices)for(let n=0;n<expected.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],expected.choices[n]);
  }
  const state={answers:{[q.id]:values[0],other:'keep'},graded:{[q.id]:{status:'correct'}},questionVersions:{[q.id]:old.contentVersion||1}},saved=structuredClone(state);
  assert.equal(restoreDailyQuestions([q],state)[0].prompt,old.prompt);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);
 }
 assert.equal(changed,35);assert.deepEqual(before,snapshot);assert.equal(ecologyElementaryCurrentItems(current,unit),current);
 assert.equal(ecologyElementaryCurrentItems(source,unit),source);assert.equal(ecologyElementaryCurrentItems(similar,unit),similar);
 const target=before.find(q=>q.id===unit+'-b60');
 for(const q of [{...target,contentVersion:'future'},{...target,prompt:'unreviewed question'},{...target,status:'review'},...['original','similar','authored-practice'].map(type=>({...target,sourceRef:{type}}))]){const rows=[q];assert.equal(ecologyElementaryCurrentItems(rows,unit),rows);}
 assert.equal(ecologyElementaryCurrentItems(before,'other-unit'),before);
});

test('classroom, workbook and bank share revised wording and explicitly label model outcomes',async()=>{
 const book=await import('../data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book),{items,source,similar}=await actualBank(),bank=new Map([...source,...similar,...items].map(q=>[q.id,q]));
 assert.equal(mod.classroomItems.length,12);assert.equal(mod.classroomItems.filter(q=>q.contentVersion===ECOLOGY_ELEMENTARY_VERSION).length,3);
 for(const q of mod.classroomItems){assert.equal(q.prompt,bank.get(q.id).prompt);assert.deepEqual(q.answerContract,bank.get(q.id).answerContract);}
 for(const q of workbook.questions.filter(q=>q.sourceId&&q.sourceRef?.type==='authored-supplement'))assert.equal(q.prompt,bank.get(q.sourceId).prompt);
 for(const id of ['t05','t07','t12'])assert(items.find(q=>q.id===unit+'-'+id).prompt.includes('모형'));
 for(const q of workbook.questions.filter(q=>q.sourceRef?.type==='similar'))assert.deepEqual(q,prior.questions.find(p=>p.id===q.id));
 for(const q of items.filter(q=>[unit+'-b47',unit+'-b50',unit+'-b67'].includes(q.id)))assert.deepEqual(q,(await priorBank()).find(old=>old.id===q.id));
});
