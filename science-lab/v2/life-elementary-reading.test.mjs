import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {workbook,lifeElementaryPriorWorkbook as prior} from '../data/book/s31-u04.workbook.js';
import {items as priorBank} from '../data/units/s31-u04.js';
import {LIFE_ELEMENTARY_VERSION,lifeElementaryCurrentItems,withLifeElementaryWorkbook} from '../data/book/s31-u04.elementary.js';
import {withThink,loadJudge} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const routes=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:spec=>import(new URL(spec,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const unit='s31-u04',data=await routes[unit](),withoutPrompt=q=>Object.fromEntries(Object.entries(q).filter(([key])=>key!=='prompt'));
const withoutPresentation=q=>Object.fromEntries(Object.entries(q).filter(([key])=>!['prompt','contentVersion','previousVersions'].includes(key)));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('life workbook directions preserve sources, blanks, answer contracts and all page materials',async()=>{
 assert.equal(workbook.questions.length,80);assert.deepEqual({...workbook,questions:null},{...prior,questions:null});
 let changed=0,protectedRows=0;
 for(let i=0;i<80;i++){
  const q=workbook.questions[i],old=prior.questions[i];assert.deepEqual(withoutPrompt(q),withoutPrompt(old));
  assert.equal((q.prompt.match(/\[\s*\]/g)||[]).length,(old.prompt.match(/\[\s*\]/g)||[]).length);
  if(q.prompt!==old.prompt)changed++;
  if(q.sourceRef?.type==='similar'){assert.deepEqual(q,old);protectedRows++;}
 }
 assert.equal(changed,50);assert.equal(protectedRows,18);
 const bank=new Map(data.items.map(q=>[q.id,q]));
 for(const q of workbook.questions.filter(q=>q.sourceRef?.type==='authored-supplement'))assert.equal(q.prompt,bank.get(q.sourceId).prompt);
 const paper=await revisedTextbookPaper(unit);
 for(const mode of ['student','teacher','answers','quick']){
  const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
  if(mode==='student'||mode==='teacher')for(const q of workbook.questions)for(const text of q.prompt.split(/\[\s*\]/).filter(Boolean))assert(html.includes(escape(text)),q.id+' '+mode);
  if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
 }
});

test('the actual life bank keeps grading and old saved presentations when thirty prompts change',async()=>{
 const saved=structuredClone(priorBank),judge=await loadJudge(unit);let changed=0,cases=0;
 assert.equal(data.items.length,64);
 for(let i=0;i<64;i++){
  const old=priorBank[i],q=data.items[i];assert.deepEqual(withoutPresentation(q),withoutPresentation(old));
  const ac=q.answerContract,values=ac.type==='single-choice'?[0,1,2,3,4]:ac.type==='multi-choice'?Array.from({length:32},(_,mask)=>[0,1,2,3,4].filter(n=>mask&(1<<n))):ac.type==='short-text'?[ac.answer,...(ac.accepted||[]),'다른 답','']:[ac.sample,'다른 설명',''];
  for(const value of values){assert.deepEqual(gradeDaily(q,value,judge),gradeDaily(old,value,judge));cases++;}
  if(q.prompt===old.prompt)continue;changed++;assert.equal(q.contentVersion,LIFE_ELEMENTARY_VERSION);
  const restored=questionAtVersion(q,1);for(const [key,value]of Object.entries(old))assert.deepEqual(restored[key],value);
  const state={answers:{[q.id]:values[0],other:'keep'},graded:{[q.id]:{status:'correct'}},questionVersions:{[q.id]:1}},before=structuredClone(state);
  assert.equal(restoreDailyQuestions([q],state)[0].prompt,old.prompt);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,'keep');assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);
 }
 assert.equal(changed,30);assert(cases>400);assert.deepEqual(priorBank,saved);assert.equal(lifeElementaryCurrentItems(data.items,unit),data.items);
});

test('life classroom shares the current bank while source, unknown and future presentations remain protected',async()=>{
 const book=await import('../data/book/s31-u04.book.js'),mod=await revisedClassroom(unit,book),bank=new Map([...data.source,...data.similar,...data.items].map(q=>[q.id,q]));
 assert.equal(mod.classroomItems.length,11);assert.equal(mod.classroomItems.filter(q=>q.contentVersion===LIFE_ELEMENTARY_VERSION).length,1);
 for(const q of mod.classroomItems){assert.equal(q.prompt,bank.get(q.id).prompt);assert.deepEqual(q.answerContract,bank.get(q.id).answerContract);}
 const target=priorBank[0];
 for(const q of [{...target,contentVersion:'future'},{...target,prompt:'a later reviewed prompt'},...['original','similar'].map(type=>({...target,sourceRef:{type}}))]){const rows=[q];assert.equal(lifeElementaryCurrentItems(rows,unit),rows);}
 assert.equal(lifeElementaryCurrentItems(priorBank,'other-unit'),priorBank);
 assert.equal(lifeElementaryCurrentItems(data.source,unit),data.source);assert.equal(lifeElementaryCurrentItems(data.similar,unit),data.similar);
 const saved=structuredClone(prior);assert.deepEqual(withLifeElementaryWorkbook(prior),workbook);assert.deepEqual(prior,saved);assert.equal(withLifeElementaryWorkbook(workbook),workbook);
 const row=prior.questions.find((q,i)=>q.prompt!==workbook.questions[i].prompt);
 for(const q of [{...row,sourceId:'unknown'},{...row,sourceRef:{type:'original'}},{...row,sourceRef:{type:'similar'}},{...row,contentVersion:'future'},{...row,prompt:'a later reviewed prompt'}]){const wb={...prior,questions:[q]};assert.equal(withLifeElementaryWorkbook(wb),wb);}
});
