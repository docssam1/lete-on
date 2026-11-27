import test from'node:test';import assert from'node:assert/strict';
import{items}from'../data/units/s41-u04.js';import{items as think}from'../data/units/s41-u04.think.js';import{source}from'../data/units/s41-u04.source.js';import{similar}from'../data/units/s41-u04.similar.js';
import{biologyCurrentItems,BIOLOGY_LANGUAGE_VERSION}from'../data/book/biology-student-language.js';
import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
const raw=[...items,...think];
test('생물 현재 표현을 바꿔도 원문·짝과 각 응답 형식의 판정 경계는 유지한다',()=>{
 const before=structuredClone(raw),current=biologyCurrentItems(raw);assert.equal(current.length,76);assert.equal(current.filter(q=>q.contentVersion===BIOLOGY_LANGUAGE_VERSION).length,28);
 for(const rows of[source,similar])biologyCurrentItems(rows).forEach((q,i)=>assert.equal(q,rows[i]));
 for(let i=0;i<raw.length;i++){
  const q=current[i],old=raw[i],c=old.answerContract;assert.equal(q.id,old.id);assert.deepEqual(c,q.answerContract);assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.sourceRef,old.sourceRef);if(q===old)continue;
  if(c.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===c.answer?'correct':'wrong',q.id));
  if(c.type==='multi-choice'){assert.equal(gradeDaily(q,c.answers).status,'correct');for(let n=0;n<q.choices.length;n++)assert.equal(gradeDaily(q,c.answers.includes(n)?c.answers.filter(i=>i!==n):[...c.answers,n]).status,'wrong');}
  if(c.type==='short-text')for(const a of c.accepted)assert.equal(gradeDaily(q,a).status,'correct');
  if(c.type==='written-explanation')assert.equal(gradeDaily(q,c.sample).status,'review');
  if(c.type==='cloze'){
   const correct=c.blanks.map(b=>b.answer);assert.equal(gradeDaily(q,correct).status,'correct');assert.equal(gradeDaily(q,['']).status,'blank');
   assert.equal(gradeDaily(q,['균류'],{vocab:new Set(['균류'])}).status,'wrong');assert.equal(gradeDaily(q,['더 알아볼 생물']).status,'review');
  }
 }
 assert.deepEqual(raw,before);
});
test('생물 이전 표현과 보기 선택을 복원하고 다시 풀 때 이전 응답·판정·자기 판단을 이력에 남긴다',()=>{
 const current=biologyCurrentItems(raw);
 for(const q of current.filter(q=>q.previousVersions)){
  const old=raw.find(x=>x.id===q.id);for(const[k,v]of Object.entries(old))assert.deepEqual(questionAtVersion(q,1)[k],v);assert.equal(biologyCurrentItems([q])[0],q);assert.deepEqual(biologyCurrentItems([structuredClone(q)])[0],q);
 }
 const q=current.find(q=>q.id==='s41-u04-b35'),old=raw.find(x=>x.id===q.id),picked=q.answerContract.answer;
 assert.deepEqual(pickedChoiceTexts(q,{picked,presentationVersion:1}),[old.choices[picked]]);assert.deepEqual(pickedChoiceTexts(q,{picked,presentationVersion:BIOLOGY_LANGUAGE_VERSION}),[q.choices[picked]]);
 const state={answers:{[q.id]:picked,unrelated:1},first:{[q.id]:{status:'correct'}},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:100},before=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].choices,old.choices);const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.unrelated,1);assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.equal(next.revisionHistory[q.id][0].self,'sure');assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices);assert.equal(restoreDailyQuestions([q],next)[0],q);
});
