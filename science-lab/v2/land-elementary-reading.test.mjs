import {landReasoningCurrentItems} from '../data/book/s41-u03.editorial.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {workbook,landElementaryPriorWorkbook as prior} from '../data/book/s41-u03.workbook.js';
import {landElementaryCurrentItems,LAND_ELEMENTARY_VERSION} from '../data/book/s41-u03.elementary.js';
import {withThink} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';

const unit='s41-u03';
async function priorBank(){
 const {items}=await import('../data/units/s41-u03.js');
 return landReasoningCurrentItems(items,unit);
}
async function actualBank(){
 const source=await readFile(new URL('./v2.js',import.meta.url),'utf8');
 const start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
 const body=source.slice(start,end).trim().replace(/;$/,'');
 const loaders=new vm.Script('('+body+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
 return loaders[unit]();
}
const withoutPresentation=q=>Object.fromEntries(Object.entries(q).filter(([key])=>!['prompt','contentVersion','previousVersions'].includes(key)));

test('Land-change reading edits preserve workbook grading, pictures and all four paper views',async()=>{
  assert.equal(workbook.questions.length,80);
  assert.equal(workbook.questions.filter((q,i)=>q.prompt!==prior.questions[i].prompt).length,34);
  assert.deepEqual(workbook.pages,prior.pages);
  assert.deepEqual(workbook.teacherStudentPages,prior.teacherStudentPages);
  assert.deepEqual(workbook.teacherPages,prior.teacherPages);
  assert.deepEqual(workbook.figures,prior.figures);
  for(const no of [64,66,68,69,73,74,75,76,78,79,80])assert.deepEqual(workbook.questions.find(q=>q.no===no),prior.questions.find(q=>q.no===no));
  for(let i=0;i<80;i++)assert.deepEqual(withoutPresentation(workbook.questions[i]),withoutPresentation(prior.questions[i]));
  const paper=await revisedTextbookPaper(unit);
  for(const mode of ['student','teacher','answers','quick']){
    const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
    if(mode==='student'||mode==='teacher')for(const q of workbook.questions)for(const text of q.prompt.split(/\[\s*\]|\(\s*\)/).filter(Boolean))assert(html.includes(text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))),q.id);
    if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
  }
});

test('actual bank loader preserves every answer boundary and saved presentation when prompts change',async()=>{
  const before=await priorBank(),savedBefore=structuredClone(before),{items:current}=await actualBank();
  assert.equal(current.length,82);let changed=0;
  for(let i=0;i<before.length;i++){
    const old=before[i],q=current[i];assert.deepEqual(withoutPresentation(q),withoutPresentation(old));
    const ac=q.answerContract,values=ac.type==='single-choice'?[0,1,2,3,4]:ac.type==='multi-choice'?Array.from({length:32},(_,mask)=>[0,1,2,3,4].filter(n=>mask&(1<<n))):ac.type==='short-text'?[ac.answer,...(ac.accepted||[]),'다른 답']:ac.type==='written-explanation'?[ac.sample,'다른 설명']:[];
    for(const value of values)assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));
    if(q.prompt===old.prompt)continue;
    changed++;assert.equal(q.contentVersion,LAND_ELEMENTARY_VERSION);
    for(const version of new Set([old.contentVersion||1,...(old.previousVersions||[]).map(v=>v.version)])){
      const expected=questionAtVersion(old,version),restored=questionAtVersion(q,version);
      for(const [key,value]of Object.entries(expected))assert.deepEqual(restored[key],value);
    }
    const state={answers:{[q.id]:values[0],other:'keep'},graded:{[q.id]:{status:'correct'}},questionVersions:{[q.id]:old.contentVersion||1}},saved=structuredClone(state);
    assert.equal(restoreDailyQuestions([q],state)[0].prompt,old.prompt);
    const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');
    assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);
    assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});
  }
  assert.equal(changed,45);assert.deepEqual(before,savedBefore);
  assert.equal(landElementaryCurrentItems(current,unit),current);
  const target=before.find(q=>q.id==='s41-u03-b19');
  for(const q of [{...target,contentVersion:'future'},...['original','similar'].map(type=>({...target,sourceRef:{type}}))]){
    const rows=[q];assert.equal(landElementaryCurrentItems(rows,unit),rows);
  }
  assert.equal(landElementaryCurrentItems(before,'other-unit'),before);
  assert.equal(landElementaryCurrentItems(before,'s41-u03b'),before);
});

test('classroom questions use the same revised bank prompts while retaining their contracts',async()=>{
  const book=await import('../data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book),{items,source,similar}=await actualBank();
  const bank=new Map([...source,...similar,...items].map(q=>[q.id,q]));assert.equal(mod.classroomItems.length,25);
  assert.equal(mod.classroomItems.filter(q=>q.contentVersion===LAND_ELEMENTARY_VERSION).length,13);
  for(const q of mod.classroomItems){assert.equal(q.prompt,bank.get(q.id).prompt);assert.deepEqual(q.answerContract,bank.get(q.id).answerContract);}
  assert.equal(workbook.questions.filter(q=>q.sourceId&&q.sourceRef?.type==='authored-supplement').length,20);
  for(const q of workbook.questions.filter(q=>q.sourceId&&q.sourceRef?.type==='authored-supplement'))assert.equal(q.prompt,bank.get(q.sourceId).prompt);
  assert.equal(workbook.questions.filter(q=>q.sourceRef?.type==='similar').length,20);
  for(const q of workbook.questions.filter(q=>q.sourceRef?.type==='similar'))assert.deepEqual(q,prior.questions.find(p=>p.id===q.id));
  assert.equal(source.length,80);assert.equal(landElementaryCurrentItems(source,unit),source);assert.equal(landElementaryCurrentItems(similar,unit),similar);
});
