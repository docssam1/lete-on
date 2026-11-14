import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';
import {questionAtVersion,questionVersion} from './question-revision.js';
import {lookupRecordQuestion} from './check.js';
import {withThink} from './think-merge.js';
import {workbook as gasWorkbook,gasLinkPriorWorkbook} from '../data/book/c22-s42-u03.workbook.js';
import {art as gasArt} from '../data/book/c22-s42-u03.workbook-art.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
import {withGasIndependentQuestionLinks} from '../data/book/c22-s42-u03.editorial.js';
import {withVersionedClassroomQuestions} from './classroom-question-versions.js';

const cases=[['s31-u01',['s31-u01-v020']],['s31-u02',['s31-u02-v003','s31-u02-v012','s31-u02-v013']]];
async function actualLoaders(context){
 const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
 return new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(context);
}
async function teacherUnit(unit){
 const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('async function pageCheck('),end=source.indexOf('async function pageStart(',start);
 const context=vm.createContext({withThink,revisedClassroom,classroomQuestions,BANK:{},$app:{}}),loaders=await actualLoaders(context);
 context.UNITS=loaders;context.BOOKS=Object.fromEntries(cases.map(([u])=>[u,()=>import('../data/book/'+u+'.book.js')]));
 let loaded;
 const checkModule=new vm.SyntheticModule(['records','renderCheck'],function(){
  this.setExport('records',()=>[]);
  this.setExport('renderCheck',async(_app,options)=>{loaded=await options.loadUnit(unit);});
 },{context});await checkModule.link(()=>{});await checkModule.evaluate();
 const pageCheck=new vm.Script('('+source.slice(start,end)+')',{importModuleDynamically:()=>checkModule}).runInContext(context);
 await pageCheck(unit);return loaded;
}

test('clarified classroom variants have a distinct version and restore every raw prior field',async()=>{
 for(const [unit,ids]of cases){
  const [{similar},book]=await Promise.all([import('../data/units/'+unit+'.similar.js'),import('../data/book/'+unit+'.book.js')]);
  const before=structuredClone(similar),current=await revisedClassroom(unit,book),again=await revisedClassroom(unit,book);
  for(const id of ids){
   const old=similar.find(q=>q.id===id),q=current.classroomItems.find(q=>q.id===id);
   assert.notEqual(q.prompt,old.prompt);assert.notEqual(questionVersion(q),questionVersion(old));
   assert.equal(again.classroomItems.find(q=>q.id===id),q);
   assert.deepEqual(q.answerContract,old.answerContract);assert.deepEqual(q.choices,old.choices);
   const restored=questionAtVersion(q,questionVersion(old));for(const [key,value]of Object.entries(old))assert.deepEqual(restored[key],value);
  }
  assert.deepEqual(similar,before);
 }
});

test('actual teacher loader resolves classroom versions while keeping legacy chapter lookup and saved snapshots',async()=>{
 for(const [unit,ids]of cases){
  const book=await import('../data/book/'+unit+'.book.js'),classroom=await revisedClassroom(unit,book),data=await teacherUnit(unit);
  assert.equal(data.ch,book.chapter);
  for(const id of ids){
   const q=classroom.classroomItems.find(q=>q.id===id),version=questionVersion(q),entry={k:'daily',item:id,slide:'daily-'+id+':version:'+version};
   assert.equal(lookupRecordQuestion(entry,data.ch,data.similar).q,q.prompt);
   const old=questionAtVersion(q,1);assert.equal(lookupRecordQuestion({...entry,slide:'daily-'+id},data.ch,data.similar).q,old.prompt);
   const snapshot={...old,prompt:'stored presentation'};
   assert.equal(lookupRecordQuestion({...entry,question:snapshot},data.ch,data.similar).q,snapshot.prompt);
   assert.equal(lookupRecordQuestion({...entry,slide:'daily-'+id+':version:unknown'},data.ch,data.similar).q,'기록 당시 문제를 확인할 수 없어요.');
  }
 }
});

test('independent gas workbook cases retain their content without a live bank-question link',()=>{
 for(const [no,id]of [[15,'c22-s42-u03-b85'],[16,'c22-s42-u03-b91']]){
  const q=gasWorkbook.questions.find(q=>q.no===no);
  assert.equal(q.sourceId,undefined);assert.equal(q.previousBankSourceId,id);
  assert.equal(q.sourceRef.type,'authored-workbook');assert.equal(q.sourceRef.originalCounterpart,false);
  assert(q.prompt&&q.choices.length===5&&q.answer&&q.figure);
 }
 const before=makeWorkbookPaper(gasLinkPriorWorkbook,gasArt),after=makeWorkbookPaper(gasWorkbook,gasArt);
 for(const mode of ['student','teacher','answers','quick'])assert.equal(after.workbookPaper({mode}),before.workbookPaper({mode}));
 for(const q of gasWorkbook.questions.filter(q=>![15,16].includes(q.no)))assert.deepEqual(q,gasLinkPriorWorkbook.questions.find(old=>old.id===q.id));
});

test('classroom version and workbook link guards exclude future or unreviewed inputs',async()=>{
 const unit='s31-u02',book=await import('../data/book/'+unit+'.book.js'),current=await revisedClassroom(unit,book);
 const q=structuredClone(current.classroomItems.find(q=>q.id==='s31-u02-v013'));delete q.contentVersion;delete q.previousVersions;
 const input={classroomItems:[q]},snapshot=structuredClone(input);assert.notEqual(await withVersionedClassroomQuestions(unit,input),input);assert.deepEqual(input,snapshot);
 for(const altered of [{...q,contentVersion:'future'},{...q,prompt:'unreviewed prompt'},{...q,explanation:'unreviewed explanation'},{...q,status:'review'},{...q,sourceRef:{...q.sourceRef,type:'original'}}]){
  const mod={classroomItems:[altered]};assert.equal(await withVersionedClassroomQuestions(unit,mod),mod);
 }
 assert.equal(await withVersionedClassroomQuestions('other-unit',input),input);
 assert.equal(await withVersionedClassroomQuestions(unit,current),current);
 assert.equal(withGasIndependentQuestionLinks(gasWorkbook),gasWorkbook);
 for(const altered of [{...gasLinkPriorWorkbook.questions.find(q=>q.no===15),prompt:'future workbook prompt'},{...gasLinkPriorWorkbook.questions.find(q=>q.no===15),key:0}]){
  const wb={...gasLinkPriorWorkbook,questions:[altered]};assert.equal(withGasIndependentQuestionLinks(wb),wb);
 }
});
