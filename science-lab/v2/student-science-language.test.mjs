import test from'node:test';
import assert from'node:assert/strict';
import{STUDENT_SCIENCE_LANGUAGE_VERSION as version,studentScienceLanguage,withStudentScienceQuestionLanguage}from'../data/book/student-science-language.js';
import{workbook as careerBook,workbook20261104 as oldCareerBook}from'../data/book/c22-s62-u04.workbook.js';
import{workbook as electricityBook,workbook20261104 as oldElectricityBook}from'../data/book/c22-s62-u03.workbook.js';
import{items as careerItems}from'../data/units/c22-s62-u04.js';
import{items as electricityItems}from'../data/units/c22-s62-u03.js';
import{careerBookItems,careerCurrentItems}from'./career-question-language.js';
import{electricityBookItems,electricityCurrentItems}from'./electricity-question-language.js';
import{careerBankBook}from'./career-bank-paper.js';
import{electricityBankBook}from'./electricity-bank-paper.js';
import{questionAtVersion,questionMisconceptions}from'./question-revision.js';
import{gradeDaily}from'./daily-grade.js';
import{judgeItem}from'./judge.js';
import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper}from'./daily-paper-state.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
import*as careerMisc from'../data/units/c22-s62-u04.misc.js';
import*as electricityMisc from'../data/units/c22-s62-u03.misc.js';
const bad=/일를|일와|관계을|알 수 있는 것를|전류를 켠 때|전류를 켠 조건의 작용/;
const groups=[
 {unit:'c22-s62-u04',raw:careerItems,old:careerBookItems,current:careerCurrentItems,book:careerBook,oldBook:oldCareerBook,bank:careerBankBook,misc:careerMisc,numbers:[21,24,25,31,65,66,68,69,70,72,73,74,75,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,104,105,106,110,111]},
 {unit:'c22-s62-u03',raw:electricityItems,old:electricityBookItems,current:electricityCurrentItems,book:electricityBook,oldBook:oldElectricityBook,bank:electricityBankBook,misc:electricityMisc,numbers:[66,70,74,75]}
];
const good=c=>c.teacherRequired?c.sample:c.kind==='single-choice'?c.answer:['multi-choice','unordered-labels'].includes(c.kind)?c.answers:c.kind==='ordered-label-sequence'?c.sequence:c.kind==='short-text'?c.accepted[0]:c.kind==='number-unit'?String(c.value)+c.units[0]:c.parts.map(p=>p.accepted[0]);

test('검수한 진로39·전기4문항에만 두 번째 원고 버전을 만들고 전체314문항의 답·채점 경계를 유지한다',()=>{
 let count=0,auto=0,review=0;
 for(const g of groups){
  const raw=JSON.stringify(g.raw),old=g.old(g.raw),current=g.current(g.raw);
  assert.deepEqual(current.filter(q=>q.contentVersion===version).map(q=>Number(q.id.slice(-3))),g.numbers);
  assert.equal(JSON.stringify(g.raw),raw);assert.equal(current.length,old.length);
  for(let i=0;i<current.length;i++){
   const a=old[i],b=current[i],text=good(a.responseContract),wanted=a.responseContract.teacherRequired?'review':'correct';
   assert.equal(gradeDaily(a,text).status,wanted,a.id);assert.equal(gradeDaily(b,text).status,wanted,b.id);
   assert.equal(judgeItem({text,ac:b.answerContract}).st,wanted==='correct'?'ok':'review',b.id);
   assert.equal(gradeDaily(b,'').status,'blank');assert.equal(b.responseContract.teacherRequired,a.responseContract.teacherRequired);
   if(!a.responseContract.teacherRequired){assert.deepEqual(b.responseContract,a.responseContract);assert.deepEqual(b.answerContract,a.answerContract);auto++;}else review++;
   count++;
  }
 }
 assert.deepEqual({count,auto,review},{count:314,auto:240,review:74});
});

test('각 수정의 직전 전체 원고·계약·진단과 더 이전 이력을 그대로 복원한다',()=>{
 for(const g of groups){const old=g.old(g.raw),current=g.current(g.raw);for(const n of g.numbers){
  const a=old.find(q=>q.id.endsWith('b'+String(n).padStart(3,'0'))),b=current.find(q=>q.id===a.id),last=b.previousVersions.at(-1),{version:stored,...snapshot}=last;
  assert.equal(stored,a.contentVersion||1);assert.deepEqual(snapshot,a);assert.deepEqual(b.previousVersions.slice(0,-1),a.previousVersions||[]);
  const restored=questionAtVersion(b,stored);for(const key of['prompt','choices','givens','responseContract','answerContract','explanation','diagnosticOverride'])assert.deepEqual(restored[key],a[key],a.id+' '+key);
  const before=questionMisconceptions(a,g.misc),after=questionMisconceptions(b,g.misc);
  for(const k of['typed','distractors','cloze','cells'])assert.deepEqual(after[k]?.[a.id],before[k]?.[a.id]);
 }}
 const row=electricityCurrentItems(electricityItems).find(q=>q.id.endsWith('b066'));assert.equal(questionAtVersion(row,1).givens.자료표.행[1][0],'전류를 켠 때');assert.equal(row.givens.자료표.행[1][0],'전지를 연결했을 때');
});

test('재적용·직렬화는 이력을 더 만들지 않고 다른 단원이나 보존 원고를 고치지 않는다',()=>{
 for(const g of groups){const old=g.old(g.raw),bytes=JSON.stringify(old),current=g.current(old);assert.equal(JSON.stringify(old),bytes);assert.deepEqual(g.current(current),current);assert.deepEqual(g.current(JSON.parse(JSON.stringify(current))),current);assert.deepEqual(withStudentScienceQuestionLanguage(current,g.unit),current);assert(bad.test(JSON.stringify(g.oldBook)));assert(!bad.test(JSON.stringify(g.book)));}
 const other={unit:'s31-u01',text:'일를 전류를 켠 때'};assert.equal(studentScienceLanguage(other,other.unit),other);
});

test('두 교재와186/128문항집의 학생·교사·해설·빠른표에는 같은 수정 원고가 나온다',async()=>{
 for(const g of groups){assert(!bad.test(JSON.stringify(g.bank)));const paper=await revisedTextbookPaper(g.unit);for(const mode of['student','teacher','answers','quick'])assert(!bad.test(paper.workbookPaper({mode})),g.unit+' '+mode);}
 assert.equal(electricityBook.figures['electricity-question-data-66'].includes('전지를 연결했을 때'),true);
 assert.equal(electricityBankBook.questions.find(q=>q.sourceBookNo===66).table.행[1][0],'전지를 연결했을 때');
});

test('이전 Daily의 원고·답·채점은 명시적 새 시도 때까지 보존하고 새 원고와 별도로 남긴다',()=>{
 for(const g of groups){const old=g.old(g.raw).filter(q=>g.numbers.includes(Number(q.id.slice(-3)))),current=g.current(g.raw).filter(q=>old.some(p=>p.id===q.id)),state={paper:snapshotDailyPaper(old),answers:Object.fromEntries(old.map(q=>[q.id,good(q.responseContract)])),graded:Object.fromEntries(old.map(q=>[q.id,q.responseContract.teacherRequired?'review':'correct']))},bytes=JSON.stringify(state),resolved=resolveDailyPaper(current,state,{legacyList:[],pool:g.current(g.raw)});assert(resolved.readOnly);assert.deepEqual(resolved.questions,old);const next=startDailyPaper(state,resolved,current,'language-new-attempt');assert.equal(JSON.stringify(state),bytes);assert.deepEqual(next.paperHistory[0].state,state);assert.equal(next.paper.questions.length,current.length);}
});
