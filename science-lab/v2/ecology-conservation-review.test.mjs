import {beforeEcologyFoodweb} from './tests/ecology-writing-stage.mjs';
import {withEcologyFoodwebWorkbook} from './ecology-foodweb-review.js';
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
import {ecologyWritingItems,withEcologyWritingWorkbook} from './ecology-writing-review.js';
import {ECOLOGY_CONSERVATION_VERSION as version,ecologyConservationItems,withEcologyConservationWorkbook} from './ecology-conservation-review.js';
import {questionAtVersion,questionVersion,questionMisconceptions,restoreDailyQuestions} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';
import {buildSlides} from './deck.js';
import {deckQuestionSnapshot} from './deck-answer-state.js';

const unit=workbook.unit,entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8');
const a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const raw=await loaders[unit](),current=await reviewStudentModule(unit,raw);
const priorBank=ecologyWritingItems([...reviewQuestionRows(raw.similar,review),...reviewQuestionRows(raw.items,review)],unit),bank=[...current.similar,...current.items].map(beforeEcologyFoodweb);
const base=reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review);
const priorBook=withEcologyWritingWorkbook(withEcologyGuidedWorkbook(base));
const priorSnapshot=JSON.parse(JSON.stringify(priorBook));
const revised=withEcologyConservationWorkbook(priorBook),plain=x=>JSON.parse(JSON.stringify(x)),normalize=q=>({...q,contentVersion:questionVersion(q)});
const changedNos=[61,62,63,68,70,71,73,74,75,76,77,78,79,80];
const pageIds=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));

test('three authored conservation choices preserve every saved earlier question and grade the new five-choice presentations correctly',async()=>{
 const judge=await loadJudge(unit),updated=bank.filter(q=>q.contentVersion===version);
 assert.deepEqual(updated.map(q=>q.id),['c22-s42-u02-b43','c22-s42-u02-b53','c22-s42-u02-b78']);
 assert.equal(current.source,raw.source);assert.equal(bank.length,priorBank.length);
 for(let i=0;i<bank.length;i++){
  const q=bank[i],old=priorBank[i];if(q.contentVersion!==version){assert.deepEqual(q,old);assert.equal(ecologyConservationItems([old],unit)[0],old);continue;}
  for(const k of ['sourceRef','taxonomy','responseContract','answerContract'])assert.equal(q[k],old[k]);
  assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5);
  for(let choice=0;choice<5;choice++)assert.equal(gradeDaily(q,choice,{judge}).status,choice===q.answerContract.answer?'correct':'wrong');
  const misc={distractors:{[q.id]:{0:'old reason'}},typed:{other:'keep'}};
  assert(!Object.hasOwn(questionMisconceptions(q,misc).distractors,q.id));assert.equal(questionMisconceptions(old,misc),misc);
  for(const v of new Set([questionVersion(old),...(old.previousVersions||[]).map(x=>x.version)])){
   const state={answers:{[q.id]:1},questionVersions:{[q.id]:v}},saved=plain(state);
   assert.deepEqual(normalize(questionAtVersion(q,v)),normalize(questionAtVersion(old,v)));
   assert.deepEqual(normalize(restoreDailyQuestions([q],state)[0]),normalize(questionAtVersion(old,v)));assert.deepEqual(state,saved);
  }
  const saved=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:{[q.id]:1}});assert(saved.readOnly);assert.deepEqual(saved.questions,[old]);
  assert.equal(ecologyConservationItems([q],unit)[0],q);
  for(const patch of [{status:'source'},{sourceRef:{type:'original'}},{prompt:old.prompt+' future'},{future:true},{answerContract:{...old.answerContract,answer:4}}]){const input={...old,...patch};assert.equal(ecologyConservationItems([input],unit)[0],input);}
 }
 assert.equal(ecologyConservationItems(priorBank,'other'),priorBank);
});

test('fourteen tasks replace repetitive record audits while preserving standards, source identities, all other questions and page order',async()=>{
 assert.deepEqual(priorBook,priorSnapshot);
 assert.deepEqual(revised.questions.filter((q,i)=>q!==priorBook.questions[i]).map(q=>q.no),changedNos);
 assert.equal(revised.pages.length,45);assert.equal(revised.teacherPages,priorBook.teacherPages);assert.equal(revised.figures,priorBook.figures);
 assert.deepEqual(pageIds(revised.pages),pageIds(priorBook.pages));assert.equal(new Set(pageIds(revised.pages)).size,80);
 for(let i=0;i<80;i++){
  const q=revised.questions[i],old=priorBook.questions[i];
  for(const k of ['id','no','form','standard','sourceRef','responseContract'])assert.equal(q[k],old[k]);
  if(!changedNos.includes(q.no)){assert.equal(q,old);continue;}
  assert.equal(q.standard,'4과14-03');assert(!/실제 사용 횟수|성분을 측정한|실제로 한 일인지|세 상태|실제 조사.*따로/.test(q.prompt+' '+q.criteria));
  if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]+' '+q.choices[q.key]);
  const link=bank.find(x=>x.id===q.sourceId);if(link){assert.equal(q.prompt,link.prompt);assert.equal(q.choices[q.key],link.choices[link.answerContract.answer]);assert.equal(q.sourceContract,old.sourceContract);assert.deepEqual(q.sourceGivens,link.givens);}
 }
 assert.equal(revised.questions[78].drawingExplanationLines,0);assert.equal(revised.questions[79].drawingExplanationLines,1);assert(!('contextFigure'in revised.questions[79]));
 assert(!revised.pages.at(-1).blocks.some(b=>b.key==='ecoPracticeCards'));
 for(const row of revised.quickPages.flatMap(p=>p.blocks.flatMap(b=>b.rows||[]))){const q=revised.questions[Number(row[0])-1];if(!changedNos.includes(q.no))continue;assert(row[1].endsWith(q.topic));assert.equal(row[2],['written','draw'].includes(q.form)?'교사 확인(해설 쪽)':q.form==='choice'?'①②③④⑤'[q.key]:q.answer);}
 assert.equal(withEcologyConservationWorkbook(revised),revised);
 for(const patch of [{unit:'other'},{future:true},{pages:priorBook.pages.slice(1)},{figures:{...priorBook.figures,new:'future'}},{quickPages:[]},{teacherPages:[]}]){const input={...priorBook,...patch};assert.equal(withEcologyConservationWorkbook(input),input);}
 assert.deepEqual(await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),withEcologyFoodwebWorkbook(revised));
});

test('current web, classroom, print solutions and quick answers share the conservation revision without revealing student answers',async()=>{
 const mod=await import('../data/book/'+unit+'.book.js'),cls=await revisedClassroom(unit,mod),pool=classroomQuestions(cls,bank);
 const selected=cls.classroomItems.filter(q=>q.contentVersion===version);assert.equal(selected.length,1);
 for(const q of selected){
  assert.deepEqual(pool.find(x=>x.id===q.id),q);
  const slides=buildSlides(cls.chapter,cls.art,cls.plan,pool,'self').filter(s=>s.item===q.id);assert(slides.length>0);
  for(const slide of slides){assert.equal(slide.questionVersion,version);assert.deepEqual(deckQuestionSnapshot(slide,pool),q);}
 }
 const paper=await revisedTextbookPaper(unit),student=paper.workbookPaper({mode:'student'}),answers=paper.workbookPaper({mode:'answers'}),quick=paper.workbookPaper({mode:'quick'});
 for(const q of revised.questions.filter(q=>changedNos.includes(q.no))){
  const start=student.indexOf('data-question="'+q.id+'"'),next=student.indexOf('<li class="ed-question"',start),card=student.slice(start,next<0?undefined:next);
  assert(start>0);assert(card.includes(q.prompt.replace(/\[\s*\]/g,'<span class="ed-blank" aria-label="빈칸"></span>')));assert(!card.includes('ed-key'));
  assert(answers.includes(q.answer.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))));
  if(q.no===79)assert(!card.includes('class="ed-lines"'));if(q.no===80)assert(card.includes('<div class="ed-lines"><i></i></div>'));
  assert(quick.includes(q.topic));
 }
 const studentBank=current.bankPaper({...current,mode:'student'}),teacher=current.bankPaper({...current,mode:'teacher'});
 for(const q of bank.filter(q=>q.contentVersion===version)){assert(studentBank.includes(q.prompt));assert(teacher.includes(q.explanation));}
 assert(!student.includes('ecoPracticeCards'));for(const[mode,count]of Object.entries({student:45,teacher:73,answers:27,quick:5}))assert.equal((paper.workbookPaper({mode}).match(/<section class="bk-page /g)||[]).length,count);
});
