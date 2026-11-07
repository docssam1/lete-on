import test from 'node:test';
import assert from 'node:assert/strict';
import {currentBankWorkbook,CURRENT_BANK_WORKBOOK_VERSION} from './current-bank-workbook.js';
import {ELECTRICITY_PAIR_LANGUAGE_VERSION} from './electricity-pair-language.js';
import {COMBUSTION_PAIR_LANGUAGE_VERSION} from './combustion-pair-language.js';
import {revisedClassroom} from './revised-lesson.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,restoreDailyQuestions} from './question-revision.js';
const specs=[['career','Career','c22-s62-u04',128],['electricity','Electricity','c22-s62-u03',186],['combustion','Combustion','c22-s62-u02',198],['season','Season','c22-s62-u01',198],['earth-motion','EarthMotion','c22-s61-u04',167]];
const cases=await Promise.all(specs.map(async([name,cap,unit,count])=>{
 const mod=await import('./'+name+'-bank-paper.js'),{workbook}=await import('../data/book/'+unit+'.workbook.js'),book=await import('../data/book/'+unit+'.book.js'),lesson=await revisedClassroom(unit,book),camel=cap[0].toLowerCase()+cap.slice(1);
 return {unit,count,workbook,items:lesson.classroomItems,prior:mod[camel+'BankBook'],current:mod['current'+cap+'BankBook'],render:mod.bankPaper};
}));
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=value=>structuredClone(value);

test('five print books use640 current workbook questions, retain237 pair IDs and show128 revised electricity and combustion pairs',()=>{
 let matched=0,paired=0,revisedPairs=0;
 for(const c of cases){
  const before=clone(c.prior),itemsBefore=clone(c.items),bookBefore=clone(c.workbook),byItem=new Map(c.items.map(q=>[q.id,q]));
  assert.equal(c.current.presentationVersion,CURRENT_BANK_WORKBOOK_VERSION);assert.equal(c.current.questions.length,c.count);
  for(const key of ['pages','teacherStudentPages','teacherPages','quickPages','title','unit'])assert.deepEqual(c.current[key],c.prior[key]);
  for(let i=0;i<c.prior.questions.length;i++){
   const old=c.prior.questions[i],q=c.current.questions[i],item=byItem.get(old.sourceItemId),w=c.workbook.questions.find(w=>w.id===old.sourceBookQuestionId);
   assert.equal(q.id,old.id);assert.equal(q.no,old.no);assert.equal(q.sourceItemId,old.sourceItemId);assert.equal(q.sourceBookQuestionId,old.sourceBookQuestionId);assert.deepEqual(q.sourceRef,old.sourceRef);
   if(item?.sourceRef?.type==='authored-pair'){
    paired++;
    if([ELECTRICITY_PAIR_LANGUAGE_VERSION,COMBUSTION_PAIR_LANGUAGE_VERSION].includes(item.contentVersion)){
     revisedPairs++;assert.notEqual(q,old);assert.equal(q.contentVersion,item.contentVersion);
     for(const key of ['prompt','choices','explanation','responseContract','answerContract'])assert.deepEqual(q[key]??null,item[key]??null);
     assert.deepEqual(q.given,Object.entries(item.givens||{}).filter(([,v])=>typeof v==='string').map(([key,value])=>key+': '+value));
     if(old.figure){const expected=old.id==='c22-s62-u03-v049'?c.prior.figures[old.figure].replace('2개를 서로 돕는 한 줄로 연결','2개를 직렬연결'):c.prior.figures[old.figure];assert.equal(c.current.figures[old.figure],expected);}
    }else{assert.equal(q,old);if(old.figure)assert.equal(c.current.figures[old.figure],c.prior.figures[old.figure]);}
    continue;
   }
   assert(w);matched++;
   for(const key of ['prompt','choices','given','givens','parts','options','table','figure','answer','responseContract','requirements','criteria','explanation','misconception','drawing','drawingSpaceMinimumMm','drawingExplanationLines'])assert.deepEqual(q[key],w[key],c.unit+' '+w.no+' '+key);
   assert.equal(q.contentVersion,item.contentVersion||1);assert.deepEqual(q.answerContract,item.answerContract);assert.deepEqual(q.responseContract,item.responseContract);
   if(w.figure)assert.equal(c.current.figures[w.figure],c.workbook.figures[w.figure]);
  }
  assert.deepEqual(currentBankWorkbook(c.prior,c.workbook,c.items),c.current);assert.deepEqual(c.prior,before);assert.deepEqual(c.items,itemsBefore);assert.deepEqual(c.workbook,bookBefore);
 }
 assert.equal(matched,640);assert.equal(paired,237);assert.equal(revisedPairs,128);
});

test('all five actual print renderers show current student text, keys, explanations and 877 quick answers',()=>{
 let renderedQuestions=0,quickRows=0;
 for(const c of cases){
  const html=Object.fromEntries(['student','teacher','answers','quick'].map(mode=>[mode,c.render({mode})]));
  for(const h of Object.values(html))assert(!/undefined|\[object Object\]/.test(h));
  assert(!/class="ed-key"|class="ed-solution"/.test(html.student));
  assert.equal((html.student.match(/data-question=/g)||[]).length,c.count);assert.equal((html.teacher.match(/data-question=/g)||[]).length,c.count);
  for(const q of c.current.questions){
   const start=html.student.indexOf('data-question="'+esc(q.id)+'"');assert(start>=0);const end=html.student.indexOf('</li>',start),card=html.student.slice(start,end);
   const plain=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),expected=plain(esc(q.prompt).replace(/\[\s*\]/g,''));
   assert(plain(card).includes(expected),q.id);assert(html.answers.includes(esc(q.explanation)),q.id);
   if(q.options)for(const option of q.options)assert(html.student.includes(esc(option)),q.id);
   renderedQuestions++;
  }
  const rows=[...html.quick.matchAll(/<tr><th scope="row">(\d+)<\/th><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g)];assert.equal(rows.length,c.count);
  for(const row of rows){const q=c.current.questions.find(q=>q.no===Number(row[1]));assert(q);assert.equal(row[2],esc(q.formLabel));assert.equal(row[3],esc(q.responseContract?.teacherRequired?'교사 확인':q.answer));quickRows++;}
 }
 assert.equal(renderedQuestions,877);assert.equal(quickRows,877);
 const career=cases.find(c=>c.unit==='c22-s62-u04'),roles=career.current.questions.find(q=>q.sourceBookNo===38);assert.deepEqual(roles.options,['ㄱ 고장에 대비해 함께 관리할 계획','ㄴ 장치를 쓸 사람과 설치할 곳 의논하기','ㄷ 관측값을 비교해 차이와 까닭 살피기']);
 const earth=cases.find(c=>c.unit==='c22-s61-u04'),drawing=earth.current.questions.find(q=>q.sourceBookNo===96);assert.equal(drawing.prompt,earth.workbook.questions[95].prompt);assert.deepEqual(drawing.requirements,earth.workbook.questions[95].requirements);
});

test('print mapping requires matching unit, original IDs and authored supplement provenance',()=>{
 const c=cases[0];assert.throws(()=>currentBankWorkbook({...c.prior,unit:'other'},c.workbook,c.items),/단원/);
 const old=c.prior.questions[0],item=c.items.find(q=>q.id===old.sourceItemId);
 for(const replacement of [{...item,status:'draft'},{...item,sourceRef:{type:'original'}},{...item,sourceRef:{type:'authored-pair'}},{...item,bookQuestionId:'other'},{...item,prompt:'different current draft'}]){
  assert.throws(()=>currentBankWorkbook(c.prior,c.workbook,c.items.map(q=>q===item?replacement:q)),/연결되지|원고가 다릅니다/);
 }
 const wrongNo={...c.prior,questions:c.prior.questions.map((q,i)=>i? q:{...q,sourceBookNo:999})},printed=currentBankWorkbook(wrongNo,c.workbook,c.items);assert.equal(printed.questions[0].prompt,c.workbook.questions[0].prompt);
 const duplicate={...c.prior,questions:[...c.prior.questions,c.prior.questions[0]]};assert.throws(()=>currentBankWorkbook(duplicate,c.workbook,c.items),/중복/);
});

test('rendering current print books preserves online question history and every saved graded response',()=>{
 let restored=0;
 for(const c of cases){
  const before=clone(c.items);c.render({mode:'teacher'});
  for(const q of c.current.questions){
   const item=c.items.find(i=>i.id===q.sourceItemId);assert(item);const ac=item.answerContract;
   const responses=ac.type==='single-choice'?item.choices.map((_,i)=>i):ac.type==='multi-choice'?Array.from({length:1<<item.choices.length},(_,mask)=>item.choices.map((_,i)=>i).filter(i=>mask&(1<<i))):ac.type==='short-text'?['',...ac.accepted,'unaccepted']:['',ac.sample];
   for(const value of responses)assert.deepEqual(gradeDaily({...item,answerContract:q.answerContract,responseContract:q.responseContract},value),gradeDaily(item,value));
   for(const prior of item.previousVersions||[]){
    const version=prior.version,original=questionAtVersion(item,version),value=original.answerContract.sample??original.answerContract.answer??original.answerContract.answers;
    const state={answers:{[item.id]:value},graded:{[item.id]:JSON.parse(JSON.stringify(gradeDaily(original,value)))},questionVersions:{[item.id]:version}},saved=clone(state);
    const resolved=restoreDailyQuestions([item],state)[0];assert.deepEqual(resolved,original);assert.deepEqual(state,saved);restored++;
   }
  }
  assert.deepEqual(c.items,before);
 }
 assert(restored>0);
});
