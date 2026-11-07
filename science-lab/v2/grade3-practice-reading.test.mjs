import {materialEarthCurrentItems} from '../data/book/material-earth-student-language.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {grade3PracticeCurrentItems,GRADE3_PRACTICE_LANGUAGE_VERSION as VERSION} from '../data/book/c22-s32-practice-language.js';
import {ecologySoundCurrentItems} from './ecology-sound-question-language.js';
import {withThink} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';

const cases=[
 {unit:'c22-s32-u01',prior:'materialElementaryPriorWorkbook',wbChanges:36,bankCount:76,bankChanges:32,classChanges:4,linked:40},
 {unit:'c22-s32-u03',prior:'soundElementaryPriorWorkbook',wbChanges:40,bankCount:76,bankChanges:32,classChanges:8,linked:54},
 {unit:'c22-s32-u04',prior:'infectionElementaryPriorWorkbook',wbChanges:35,bankCount:92,bankChanges:34,classChanges:8},
];
const withoutPresentation=q=>Object.fromEntries(Object.entries(q).filter(([key])=>!['prompt','contentVersion','previousVersions'].includes(key)));
const escape=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function priorBank(unit){
 const names=['lesson','base','similar','taxonomy','misc',...(unit!=='c22-s32-u04'?['source']:[])];
 const mods=Object.fromEntries(await Promise.all(names.map(async name=>[name,await import('../data/units/'+unit+(name==='base'?'':'.'+name)+'.js')])));
 const mod=await withThink(unit,{...(unit==='c22-s32-u01'?{...mods.base,...mods.lesson}:{...mods.lesson,...mods.base}),...mods.similar,...mods.taxonomy,...(mods.source||{source:[]}),misc:mods.misc});
 return unit==='c22-s32-u01'?materialEarthCurrentItems(mod.items,unit):unit==='c22-s32-u03'?ecologySoundCurrentItems(mod.items,unit):mod.items;
}
async function actualBank(unit){
 const source=await readFile(new URL('./v2.js',import.meta.url),'utf8');
 const line=source.split('\n').find(line=>new RegExp("'"+unit+"':\\s*async\\s*\\(").test(line));
 const body=line.slice(line.indexOf('async()=>')).replace(/,$/,'');
 return new vm.Script('('+body+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}))();
}
for(const c of cases){
 const {unit}=c;
 test(unit+' clearer directions preserve all workbook answers, figures and paper modes',async()=>{
  const mod=await import('../data/book/'+unit+'.workbook.js'),wb=mod.workbook,prior=mod[c.prior];
  assert.equal(wb.questions.length,80);
  assert.equal(wb.questions.filter((q,i)=>q.prompt!==prior.questions[i].prompt).length,c.wbChanges);
  for(const key of Object.keys(prior).filter(k=>k!=='questions'))assert.deepEqual(wb[key],prior[key]);
  for(let i=0;i<80;i++)assert.deepEqual(withoutPresentation(wb.questions[i]),withoutPresentation(prior.questions[i]));
  const paper=await revisedTextbookPaper(unit);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
   if(mode==='student'||mode==='teacher')for(const q of wb.questions)for(const text of q.prompt.split(/\[\s*\]/).filter(Boolean))assert(html.includes(escape(text)),q.id);
   if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
  }
 });
 test(unit+' actual loader preserves grading and saved revisions while protecting other content',async()=>{
  const before=await priorBank(unit),savedBefore=structuredClone(before),{items:current}=await actualBank(unit);
  assert.equal(current.length,c.bankCount);let changed=0;
  for(let i=0;i<before.length;i++){
   const old=before[i],q=current[i];assert.deepEqual(withoutPresentation(q),withoutPresentation(old));
   const ac=q.answerContract,values=ac.type==='single-choice'?[0,1,2,3,4]:ac.type==='multi-choice'?Array.from({length:32},(_,mask)=>[0,1,2,3,4].filter(n=>mask&(1<<n))):ac.type==='short-text'?[ac.answer,...(ac.accepted||[]),'다른 답']:ac.type==='written-explanation'?[ac.sample,'다른 설명']:ac.type==='cloze'?[ac.blanks.map(b=>b.answer),ac.blanks.map(()=>''),ac.blanks.map(()=>'다른 답')]:ac.type==='table-fill'?[ac.rows.map(r=>r.answer),ac.rows.map(r=>r.answer.map(()=>'')),ac.rows.map(r=>r.answer.map(()=>'다른 답'))]:[];
   for(const value of values)assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));
   if(q.prompt===old.prompt)continue;
   changed++;assert.equal(q.contentVersion,VERSION);
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
  assert.equal(changed,c.bankChanges);assert.deepEqual(before,savedBefore);
  assert.equal(grade3PracticeCurrentItems(current,unit),current);
  const target=before.find((q,i)=>q.prompt!==current[i].prompt);
  for(const q of [{...target,contentVersion:'future'},{...target,prompt:'새로 고친 다른 문장'},...['original','similar'].map(type=>({...target,sourceRef:{type}}))]){
   const rows=[q];assert.equal(grade3PracticeCurrentItems(rows,unit),rows);
  }
  assert.equal(grade3PracticeCurrentItems(before,'other-unit'),before);
 });
 test(unit+' classroom and bank share revised wording and original response contracts',async()=>{
  const book=await import('../data/book/'+unit+'.book.js'),mod=await revisedClassroom(unit,book),{items,source=[],similar=[]}=await actualBank(unit);
  const bank=new Map([...source,...similar,...items].map(q=>[q.id,q]));assert.equal(mod.classroomItems.length,12);
  assert.equal(mod.classroomItems.filter(q=>q.contentVersion===VERSION).length,c.classChanges);
  for(const q of mod.classroomItems){assert.equal(q.prompt,bank.get(q.id).prompt);assert.deepEqual(q.answerContract,bank.get(q.id).answerContract);}
  const {workbook}=await import('../data/book/'+unit+'.workbook.js');
  if(unit!=='c22-s32-u04'){
   const linked=workbook.questions.filter(q=>q.sourceId);assert.equal(linked.length,c.linked);
   for(const q of linked)assert.equal(q.prompt,bank.get(q.sourceId).prompt);
   const source=(await import('../data/units/'+unit+'.source.js')).source;
   assert.equal(source.length,70);assert.equal(grade3PracticeCurrentItems(source,unit),source);
  }else{
   assert.equal(workbook.questions.filter(q=>q.sourceId).length,0);
   assert(!bank.get(unit+'-t01').prompt.includes('작은 생물'));
   assert(bank.get(unit+'-t01').prompt.includes('( ① )'));
  }
 });
}
