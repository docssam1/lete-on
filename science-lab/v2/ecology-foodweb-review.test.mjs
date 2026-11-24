import{withEcologyPageDensity}from'./ecology-page-density.js';
import{withEcologyMixedWorkbook}from'./ecology-mixed-response.js';
import{beforeEcologyMixed}from'./tests/ecology-mixed-stage.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink,loadJudge} from './think-merge.js';
import {reviewStudentModule,reviewStudentWorkbook,reviewQuestionRows,reviewTextTree,reviewWorkbookTableText} from './student-language-review.js';
import {review} from '../data/language/c22-s42-u02.js';
import {taxonomy} from '../data/units/c22-s42-u02.taxonomy.js';
import {workbook} from '../data/book/c22-s42-u02.workbook.js';
import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
import {withObservedPhotoAlt} from '../data/book/observation-language.js';
import {withEcologyGuidedWorkbook} from './ecology-guided-workbook.js';
import {ecologyWritingItems,withEcologyWritingWorkbook} from './ecology-writing-review.js';
import {ecologyConservationItems,withEcologyConservationWorkbook} from './ecology-conservation-review.js';
import {ECOLOGY_FOODWEB_VERSION as version,ecologyFoodwebItems,withEcologyFoodwebWorkbook} from './ecology-foodweb-review.js';
import {questionAtVersion,questionVersion,questionMisconceptions,restoreDailyQuestions} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';

const unit=workbook.unit,entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8');
const a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const raw=await loaders[unit](),current=await reviewStudentModule(unit,raw);
const priorBank=ecologyConservationItems(ecologyWritingItems([...reviewQuestionRows(raw.similar,review),...reviewQuestionRows(raw.items,review)],unit),unit),bank=[...current.similar,...current.items].map(beforeEcologyMixed);
const base=reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review);
const priorBook=withEcologyConservationWorkbook(withEcologyWritingWorkbook(withEcologyGuidedWorkbook(base))),snapshot=JSON.parse(JSON.stringify(priorBook));
const next=withEcologyFoodwebWorkbook(priorBook),nos=[27,28,36,43,44,45,48,53,54,55,56],plain=x=>JSON.parse(JSON.stringify(x)),normalize=q=>({...q,contentVersion:questionVersion(q)});
const ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));

test('one authored food-web question has a current classification while every older choice, diagnosis and saved answer remains restorable',async()=>{
 const updated=bank.filter(q=>q.contentVersion===version);assert.equal(updated.length,1);assert.equal(updated[0].id,unit+'-b37');
 const q=updated[0],old=priorBank.find(x=>x.id===q.id),judge=await loadJudge(unit);
 assert.equal(current.source,raw.source);assert.equal(bank.length,priorBank.length);
 for(let i=0;i<bank.length;i++)if(bank[i]!==q){assert.deepEqual(bank[i],priorBank[i]);assert.equal(ecologyFoodwebItems([priorBank[i]],unit)[0],priorBank[i]);}
 assert.equal(q.responseContract,old.responseContract);assert.equal(q.answerContract,old.answerContract);assert.equal(q.sourceRef,old.sourceRef);
 assert.deepEqual(q.taxonomy,{...old.taxonomy,element:'E3',type:'T06',topic:'먹이 사슬과 먹이그물 비교',concept:'먹이 사슬과 먹이그물 비교',inquirySkill:'먹이 관계 비교'});
 assert.equal(q.taxonomy.standard,'4과14-02');assert.equal(q.choices.length,5);assert.equal(taxonomy.types.find(t=>t.id===q.taxonomy.type).element,q.taxonomy.element);
 for(let n=0;n<5;n++)assert.equal(gradeDaily(q,n,{judge}).status,n===1?'correct':'wrong');
 const misc={distractors:{[q.id]:{0:'old model reason'}}};assert(!Object.hasOwn(questionMisconceptions(q,misc).distractors,q.id));
 for(const v of new Set([questionVersion(old),...(old.previousVersions||[]).map(x=>x.version)])){
  const state={answers:{[q.id]:1},questionVersions:{[q.id]:v}},saved=plain(state),expected=normalize(questionAtVersion(old,v));
  assert.deepEqual(normalize(questionAtVersion(q,v)),expected);assert.deepEqual(normalize(restoreDailyQuestions([q],state)[0]),expected);assert.deepEqual(state,saved);
 }
 const frozen=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:{[q.id]:1}});assert(frozen.readOnly);assert.deepEqual(frozen.questions,[old]);
 assert.equal(ecologyFoodwebItems([q],unit)[0],q);assert.equal(ecologyFoodwebItems(priorBank,'other'),priorBank);
 for(const patch of [{status:'source'},{sourceRef:{type:'original'}},{prompt:old.prompt+' future'},{future:true},{taxonomy:{...old.taxonomy,type:'future'}},{answerContract:{...old.answerContract,answer:3}}]){const input={...old,...patch};assert.equal(ecologyFoodwebItems([input],unit)[0],input);}
});

test('eleven concrete ecology tasks preserve the other sixty-nine questions and remove four unnecessary prose responses',()=>{
 assert.deepEqual(priorBook,snapshot);assert.deepEqual(next.questions.filter((q,i)=>q!==priorBook.questions[i]).map(q=>q.no),nos);
 assert.equal(next.pages.length,45);assert.equal(next.teacherPages,priorBook.teacherPages);assert.deepEqual(ids(next.pages),ids(priorBook.pages));assert.equal(new Set(ids(next.pages)).size,80);
 for(let i=0;i<80;i++){
  const q=next.questions[i],old=priorBook.questions[i];for(const k of ['id','no','form','standard','sourceRef','responseContract'])assert.equal(q[k],old[k]);
  if(!nos.includes(q.no)){assert.equal(q,old);continue;}
  assert(!/실제 조사나 실천|실제 조사한 결과|생존 기간|3년 뒤 여우|새 자료의 대상/.test(q.prompt+' '+q.criteria));
 }
 for(const n of [28,54,55,56]){const q=next.questions[n-1];assert.equal(q.drawingExplanationLines,0);assert.equal(q.responseContract.teacherRequired,true);}
 assert.deepEqual(next.questions[42].key,[0,4]);assert.deepEqual(next.questions[42].key.map(k=>next.questions[42].choices[k]),['풀','뱀']);
 assert.deepEqual(next.questions[44].key,[0,1]);assert.equal(next.questions[44].choices.length,4);
 assert.equal(next.questions[47].answer,'㉠ 먹이그물 · ㉡ 생산자');assert(!next.questions[47].prompt.includes('이 그림'));
 assert.equal(next.questions[52].answer,'㉢→㉠→㉣→㉡');
 assert.deepEqual(next.foodEdges,priorBook.foodEdges);
 for(const[k,html]of Object.entries(priorBook.figures)){if(k==='ecoChains'){assert.equal(next.figures[k].match(/<tbody>[\s\S]*?<\/tbody>/)[0],html.match(/<tbody>[\s\S]*?<\/tbody>/)[0]);assert(!next.figures[k].includes('이름 카드의 장수'));continue;}assert.equal(next.figures[k],k==='ecoSurveyCards'?html.replace('관계 지도 만들기를 위한 제공 목록이에요. 학생이 직접 조사한 결과가 아니에요.','목록의 여섯 대상을 살아 있는지에 따라 나누어 보아요.'):html);}
 for(const row of next.quickPages.flatMap(p=>p.blocks.flatMap(b=>b.rows||[]))){const q=next.questions[Number(row[0])-1];if(!nos.includes(q.no))continue;assert(row[1].endsWith(q.topic));assert.equal(row[2],q.form==='draw'?'교사 확인(해설 쪽)':q.form==='choice'?'①②③④⑤'[q.key]:q.answer);}
 assert.equal(withEcologyFoodwebWorkbook(next),next);
 for(const patch of [{unit:'other'},{future:true},{figures:{...priorBook.figures,new:'future'}},{questions:[]},{pages:[]},{teacherPages:[]},{quickPages:[]}]){const w={...priorBook,...patch};assert.equal(withEcologyFoodwebWorkbook(w),w);}
});

test('the current web book, teacher solutions, quick key and bank share the new food-web tasks without redundant drawing lines',async()=>{
 assert.deepEqual(await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),withEcologyPageDensity(withEcologyMixedWorkbook(next)));
 const paper=await revisedTextbookPaper(unit),student=paper.workbookPaper({mode:'student'}),answers=paper.workbookPaper({mode:'answers'}),quick=paper.workbookPaper({mode:'quick'});
 for(const q of next.questions.filter(q=>nos.includes(q.no))){
  const start=student.indexOf('data-question="'+q.id+'"'),end=student.indexOf('<li class="ed-question"',start),card=student.slice(start,end<0?undefined:end);assert(start>0);assert(!card.includes('ed-key'));
  if(q.form==='draw')assert(!card.includes('class="ed-lines"'));
  assert(quick.includes(q.topic));assert(answers.includes(q.answer));
 }
 const link=bank.find(q=>q.contentVersion===version),book=next.questions[35];assert.equal(book.prompt,link.prompt);assert.equal(book.choices[book.key],link.choices[link.answerContract.answer]);assert.equal(book.sourceExplanation,link.explanation);
 const cls=await revisedClassroom(unit,await import('../data/book/'+unit+'.book.js'));assert.equal(cls.classroomItems.filter(q=>q.contentVersion===version).length,0);assert.deepEqual(classroomQuestions(cls,bank).find(q=>q.id===link.id),link);
 assert(current.bankPaper({...current,mode:'student'}).includes(link.prompt));assert(current.bankPaper({...current,mode:'teacher'}).includes(link.explanation));
 for(const[mode,count]of Object.entries({student:43,teacher:71,answers:27,quick:5}))assert.equal((paper.workbookPaper({mode}).match(/<section class="bk-page /g)||[]).length,count);
});
