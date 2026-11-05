import test from 'node:test';
import assert from 'node:assert/strict';
import {items} from '../data/units/c22-s51-u03.js';
import {source} from '../data/units/c22-s51-u03.source.js';
import {similar} from '../data/units/c22-s51-u03.similar.js';
import {solutionReadablePriorWorkbook as workbook} from '../data/book/c22-s51-u03.workbook.js';
import {solutionCurrentItems,SOLUTION_LANGUAGE_VERSION} from './solution-question-language.js';
import {gradeDaily,vocabOf} from './daily-grade.js';
import {judge} from '../data/units/c22-s51-u03.judge.js';
import * as misc from '../data/units/c22-s51-u03.misc.js';
import {questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';

test('용액 현재 문항은 교재 문구와 연결되고 기존 모든 응답 계약·선택 위치·열린 채점 경계를 유지한다',()=>{
 const before=JSON.stringify(items),current=solutionCurrentItems(items),options={judge,misc,vocab:vocabOf([...source,...similar,...items],misc)};
 assert.equal(current.length,96);assert.equal(current.filter(q=>q.contentVersion===SOLUTION_LANGUAGE_VERSION).length,37);
 assert.equal(solutionCurrentItems(source)[0],source[0]);assert.equal(solutionCurrentItems(similar)[0],similar[0]);
 for(let i=0;i<current.length;i++){
  const q=current[i],old=items[i],book=workbook.questions.find(b=>b.id===q.workbookRef.id),c=old.answerContract;
  assert.equal(q.id,old.id);assert.deepEqual(q.answerContract,c);assert.deepEqual(q.workbookRef,old.workbookRef);
  assert.equal(q.prompt,book.prompt);assert.equal(q.taxonomy.topic,book.topic);
  if(book.given)assert.deepEqual(q.givens.보기,book.given);
  if(book.parts)assert.deepEqual(q.givens.문항,book.parts);
  if(c.type==='single-choice')for(let n=0;n<q.choices.length;n++)assert.equal(gradeDaily(q,n,options).status,n===c.answer?'correct':'wrong',q.id);
  if(c.type==='multi-choice'){
   assert.equal(gradeDaily(q,c.answers,options).status,'correct');
   for(let n=0;n<q.choices.length;n++){const picked=c.answers.includes(n)?c.answers.filter(k=>k!==n):[...c.answers,n];assert.notEqual(gradeDaily(q,picked,options).status,'correct',q.id);}
  }
  if(c.type==='short-text')for(const answer of c.accepted)assert.equal(gradeDaily(q,answer,options).status,'correct',q.id);
  if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample,options).status,'review',q.id);
 }
 assert.equal(JSON.stringify(items),before);
});

test('용액 이전 응답은 당시 문구로 복원하고 현재 문제로 다시 풀 때 이전 결과를 이력에 보존한다',()=>{
 const current=solutionCurrentItems(items),revised=current.filter(q=>q.previousVersions);
 for(const q of revised){const old=items.find(x=>x.id===q.id),past=questionAtVersion(q,1);for(const[k,v]of Object.entries(old))assert.deepEqual(past[k],v,q.id+':'+k);assert.equal(solutionCurrentItems([q])[0],q);assert.deepEqual(solutionCurrentItems([structuredClone(q)])[0],q);}
 const q=current.find(q=>q.workbookRef.no===79),old=items.find(x=>x.id===q.id),state={answers:{[q.id]:[1,2],other:0},first:{[q.id]:{status:'correct'}},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:123},before=structuredClone(state);
 const restored=restoreDailyQuestions([q],state)[0];assert.deepEqual(restored.choices,old.choices);assert.equal(restored.prompt,old.prompt);
 assert.deepEqual(pickedChoiceTexts(q,{picked:[1],presentationVersion:1}),[old.choices[1]]);
 assert.deepEqual(pickedChoiceTexts(q,{picked:[1],presentationVersion:SOLUTION_LANGUAGE_VERSION}),[q.choices[1]]);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers[q.id],undefined);assert.equal(next.answers.other,0);assert.equal(next.questionVersions[q.id],SOLUTION_LANGUAGE_VERSION);
 assert.deepEqual(next.revisionHistory[q.id][0].answers,[1,2]);assert.deepEqual(next.revisionHistory[q.id][0].graded,{status:'correct'});assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
