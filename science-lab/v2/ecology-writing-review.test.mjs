import {beforeEcologyConservation} from './tests/ecology-writing-stage.mjs';
import {withEcologyConservationWorkbook} from './ecology-conservation-review.js';
import{buildSlides}from'./deck.js';
import{deckQuestionSnapshot,deckSlideRecordKey}from'./deck-answer-state.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink,loadJudge} from './think-merge.js';
import {reviewStudentModule,reviewStudentWorkbook,reviewQuestionRows,reviewTextTree,reviewWorkbookTableText} from './student-language-review.js';
import {review} from '../data/language/c22-s42-u02.js';
import {workbook} from '../data/book/c22-s42-u02.workbook.js';
import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
import {withObservedPhotoAlt} from '../data/book/observation-language.js';
import {withEcologyGuidedWorkbook} from './ecology-guided-workbook.js';
import {ECOLOGY_WRITING_VERSION as version,ecologyWritingItems,withEcologyWritingWorkbook} from './ecology-writing-review.js';
import {questionAtVersion,questionVersion,restoreDailyQuestions} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {revisedTextbook,revisedTextbookPaper} from './revised-textbook.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';

const unit=workbook.unit,entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8');
const a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const raw=await loaders[unit](),current=await reviewStudentModule(unit,raw);
const priorBank=[...reviewQuestionRows(raw.similar,review),...reviewQuestionRows(raw.items,review)];
const currentBank=[...current.similar,...current.items].map(beforeEcologyConservation);
const base=reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review);
const priorBook=withEcologyGuidedWorkbook(base),ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
const plain=x=>JSON.parse(JSON.stringify(x)),normalized=q=>({...q,contentVersion:questionVersion(q)});

test('eight authored explanations have short concrete tasks while every earlier saved question remains restorable',async()=>{
 const revised=currentBank.filter(q=>q.contentVersion===version);assert.equal(revised.length,8);
 assert.equal(current.source,raw.source);assert.equal(currentBank.length,priorBank.length);
 const judge=await loadJudge(unit);
 for(let i=0;i<priorBank.length;i++){
  const old=priorBank[i],now=currentBank[i];
  if(now.contentVersion!==version){assert.deepEqual(now,old);assert.equal(ecologyWritingItems([old],unit)[0],old);continue;}
  assert.equal(now.sourceRef,old.sourceRef);assert.equal(now.taxonomy,old.taxonomy);assert.equal(now.responseContract,old.responseContract);
  assert.equal(now.answerContract.reviewRequired,true);assert(now.answerContract.rubric.required.length<=2);
  assert.deepEqual(now.previousVersions.slice(0,-1),old.previousVersions||[]);
  for(const v of new Set([questionVersion(old),...(old.previousVersions||[]).map(p=>p.version)])){
   const expected=questionAtVersion(old,v);assert.deepEqual(normalized(questionAtVersion(now,v)),normalized(expected));
   const state={answers:{[old.id]:'내가 쓴 옛 답'},questionVersions:{[old.id]:v}},saved=plain(state);
   assert.deepEqual(normalized(restoreDailyQuestions([now],state)[0]),normalized(expected));assert.deepEqual(state,saved);
  }
  const saved=resolveDailyPaper([now],{paper:snapshotDailyPaper([old]),answers:{[old.id]:'내 답'}});assert(saved.readOnly);assert.deepEqual(saved.questions,[old]);
  assert.equal(gradeDaily(now,'',{judge}).status,'blank');
  for(const answer of[now.answerContract.sample,'다른 타당한 방법','물병을 전날 씻어 챙겨요.','모르겠어요.'])assert.equal(gradeDaily(now,answer,{judge}).status,'review');
  assert.equal(ecologyWritingItems([now],unit)[0],now);
  for(const patch of[{status:'source'},{sourceRef:{type:'original'}},{contentVersion:'future'},{prompt:old.prompt+' future'},{futureMetadata:true},{answerContract:{...old.answerContract,future:true}}]){const q={...old,...patch};assert.equal(ecologyWritingItems([q],unit)[0],q);}
 }
 assert.equal(ecologyWritingItems(priorBank,'other'),priorBank);
});

test('the workbook preserves all other questions, data and science standards, with one answer line under each guided part',async()=>{
 const saved=plain(priorBook),next=withEcologyWritingWorkbook(priorBook);assert.deepEqual(priorBook,saved);
 assert.equal(next.pages.length,43);assert.deepEqual(ids(next.pages),ids(priorBook.pages));assert.equal(new Set(ids(next.pages)).size,80);
 for(const key of Object.keys(priorBook))if(!['questions','pages','teacherStudentPages','teacherPages'].includes(key))assert.equal(next[key],priorBook[key],key);
 assert.equal(next.teacherPages.length,27);assert.deepEqual(ids(next.teacherPages),ids(priorBook.teacherPages));
 assert(next.teacherPages.every(p=>ids([p]).length<=3));
 let changed=0;for(let i=0;i<80;i++){
  const q=next.questions[i],old=priorBook.questions[i];if(q===old)continue;changed++;
  assert.equal(q.sourceRef,old.sourceRef);assert.equal(q.standard,old.standard);assert.equal(q.form,'written');assert.equal(q.lines,2);
  assert.equal(q.sourceContract.sample,q.answer);assert.equal(q.sourceContract.rubric.required.join(' / '),q.criteria);
  const bank=currentBank.find(b=>b.id===q.sourceId);assert.equal(q.answer,bank.answerContract.sample);assert.deepEqual(q.sourceGivens,bank.givens);
  assert.equal([q.prompt,...(q.parts||[])].join('\n'),bank.prompt);
  if(q.parts){assert.equal(q.parts.length,2);assert(q.answerPerPart);}else assert.equal(q.no,8);
 }
 assert.equal(changed,8);assert.equal(withEcologyWritingWorkbook(next),next);
 const correction=next.pages.find(p=>ids([p]).includes(unit+'-w038'));
 assert.deepEqual(ids([correction]),[unit+'-w037',unit+'-w038']);
 assert(!correction.blocks.some(b=>b.type==='diagram'&&b.key==='ecoWeb'));
 for(const patch of[{unit:'other'},{pages:priorBook.pages.slice(1)},{teacherPages:priorBook.teacherPages.slice(1)},{figures:{...priorBook.figures,future:'new'}},{questions:priorBook.questions.map((q,i)=>i?q:{...q,future:true})}]){const input={...priorBook,...patch};assert.equal(withEcologyWritingWorkbook(input),input);}
 const reviewed=await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook)));assert.deepEqual(reviewed,withEcologyConservationWorkbook(next));
 const paper=await revisedTextbookPaper(unit),student=paper.workbookPaper({mode:'student'}),teacher=paper.workbookPaper({mode:'teacher'});
 for(const q of next.questions.filter(q=>q.guidedWriting)){
  const at=student.indexOf('data-question="'+q.id+'"'),end=student.indexOf('</li>',at),card=student.slice(at,end);
  assert(!card.includes(q.answer));assert(!card.includes('ed-key'));
  assert.equal((card.match(/ed-part-response/g)||[]).length,q.parts?.length||0);
  if(q.parts)assert(!card.includes('class="ed-lines"'));else assert.equal((card.match(/<i><\/i>/g)||[]).length,2);
  assert(teacher.includes(q.answer));
 }
});

test('real classroom, web book and bank print use the same current revision without exposing solutions',async()=>{
 const mod=await import('../data/book/'+unit+'.book.js'),book=await revisedTextbook(unit,mod),cls=await revisedClassroom(unit,mod),pool=classroomQuestions(cls,currentBank);
 assert.equal(book.plan,mod.plan);assert.equal(book.workbook.pages.length,45);
 assert.equal(cls.classroomItems.filter(q=>q.contentVersion===version).length,5);
 const slides=buildSlides(cls.chapter,cls.art,cls.plan,pool,'self');
 for(const q of cls.classroomItems.filter(q=>q.contentVersion===version)){const selected=slides.filter(s=>s.item===q.id);assert(selected.length);for(const slide of selected){assert.equal(slide.questionVersion,version);assert.deepEqual(deckQuestionSnapshot(slide,pool),q);assert(deckSlideRecordKey(cls.chapter,slide).includes(':version:'+version));}}
 for(const q of currentBank.filter(q=>q.contentVersion===version))assert.deepEqual(pool.find(p=>p.id===q.id),q);
 const student=current.bankPaper({...current,mode:'student'}),teacher=current.bankPaper({...current,mode:'teacher'});
 for(const q of currentBank.filter(q=>q.contentVersion===version)){
  const start=student.indexOf('data-paper-item="'+q.id+'"'),end=student.indexOf('</article>',start),card=student.slice(start,end);
  assert(start>=0);assert(!card.includes('eco-key'));assert(!card.includes(q.answerContract.sample));
  assert.equal((card.match(/eco-answer-line/g)||[]).length,2);
  assert(teacher.includes(q.explanation));
 }
 const paper=await revisedTextbookPaper(unit);for(const[mode,count]of Object.entries({student:45,teacher:73,answers:27,quick:5}))assert.equal((paper.workbookPaper({mode}).match(/<section class="bk-page /g)||[]).length,count);
});
