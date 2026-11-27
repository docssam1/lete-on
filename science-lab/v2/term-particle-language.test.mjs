import{items as careerItems}from'../data/units/c22-s62-u04.js';
import{careerCurrentItems}from'./career-question-language.js';
import*as careerMisc from'../data/units/c22-s62-u04.misc.js';
import{guidanceParticleCurrentItems,GUIDANCE_PARTICLE_VERSION}from'../data/book/term-particle-language.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {items} from '../data/units/c22-s61-u01.js';
import {source} from '../data/units/c22-s61-u01.source.js';
import {similar} from '../data/units/c22-s61-u01.similar.js';
import * as misc from '../data/units/c22-s61-u01.misc.js';
import {acidCurrentItems} from './acid-question-language.js';
import {acidStudentCurrentItems} from '../data/book/acid-student-language.js';
import {TERM_PARTICLE_VERSION,termParticleCurrentItems} from '../data/book/term-particle-language.js';
import {gradeDaily} from './daily-grade.js';
import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts} from './question-revision.js';
const unit='c22-s61-u01',prior=acidStudentCurrentItems(acidCurrentItems(items)),current=termParticleCurrentItems(prior,unit);
test('조사 교정은 현재 창작 문항에만 적용하고 채점·진단·모든 이전 질문을 보존한다',()=>{
 const frozen=structuredClone(prior);
 assert.equal(current.filter(q=>q.contentVersion===TERM_PARTICLE_VERSION).length,11);
 for(const rows of [source,similar])assert.equal(termParticleCurrentItems(rows,unit),rows);
 assert.equal(termParticleCurrentItems(prior,'not-reviewed'),prior);
 assert.equal(termParticleCurrentItems(current,unit),current);
 assert.deepEqual(termParticleCurrentItems(structuredClone(current),unit),current);
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current[i];
  if(q===old)continue;
  for(const key of ['id','answerContract','responseContract','taxonomy','sourceRef','sourceContract'])assert.deepEqual(q[key],old[key]);
  assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));
  const contract=q.answerContract;
  if(contract.type==='single-choice')q.choices.forEach((_,n)=>assert.equal(gradeDaily(q,n).status,n===contract.answer?'correct':'wrong'));
  if(contract.type==='multi-choice'){
   assert.equal(gradeDaily(q,contract.answers).status,'correct');
   for(let n=0;n<q.choices.length;n++)assert.equal(gradeDaily(q,contract.answers.includes(n)?contract.answers.filter(i=>i!==n):[...contract.answers,n]).status,'wrong');
  }
  if(contract.type==='written-explanation')assert.equal(gradeDaily(q,contract.sample).status,'review');
  for(const oldVersion of [old,...(old.previousVersions||[])]){
   const restored=questionAtVersion(q,oldVersion.version||oldVersion.contentVersion||1);
   for(const[k,v]of Object.entries(oldVersion))if(k!=='version')assert.deepEqual(restored[k],v,`${q.id}:${k}`);
  }
  const future={...q,contentVersion:'future',prompt:old.prompt};assert.equal(termParticleCurrentItems([future],unit)[0],future);
 }
 assert.deepEqual(prior,frozen);
});
test('조사 교정 전 응답은 옛 보기로 읽고 새 시도는 다른 문항과 답안 이력을 보존한다',()=>{
 const q=current.find(q=>q.id===unit+'-b008'),old=prior.find(x=>x.id===q.id),version=old.contentVersion;
 const state={answers:{[q.id]:4,other:'기존 답'},graded:{[q.id]:{status:'wrong'}},self:{[q.id]:'unsure'},questionVersions:{[q.id]:version},at:500},before=structuredClone(state);
 assert.equal(restoreDailyQuestions([q],state)[0].prompt,old.prompt);
 assert.deepEqual(pickedChoiceTexts(q,{picked:4,presentationVersion:version}),[old.choices[4]]);
 assert.deepEqual(pickedChoiceTexts(q,{picked:4,presentationVersion:TERM_PARTICLE_VERSION}),[q.choices[4]]);
 const next=restartCurrentQuestion(state,q);
 assert.deepEqual(state,before);
 assert.equal(next.answers.other,'기존 답');
 assert.equal(next.answers[q.id],undefined);
 assert.equal(next.revisionHistory[q.id][0].version,version);
 assert.equal(next.revisionHistory[q.id][0].answers,4);
 assert.equal(next.revisionHistory[q.id][0].self,'unsure');
 assert.equal(restoreDailyQuestions([q],next)[0],q);
});

test('진로 그림 평가의 조사만 고치고 교사 검토·세대별 기준·기존 응답을 보존한다',()=>{
 const prior=careerCurrentItems(careerItems),before=structuredClone(prior),unit='c22-s62-u04',current=guidanceParticleCurrentItems(prior,unit);
 assert.equal(current.filter(q=>q.contentVersion===GUIDANCE_PARTICLE_VERSION).length,1);
 const old=prior.find(q=>q.id===unit+'-b096'),q=current.find(q=>q.id===old.id);
 for(const[key,value]of Object.entries(old))if(!['responseContract','answerContract','diagnosticOverride','contentVersion','previousVersions'].includes(key))assert.deepEqual(q[key],value);
 for(const key of ['responseContract','answerContract'])assert.deepEqual(JSON.parse(JSON.stringify(q[key]).replaceAll('것과','것와')),old[key]);
 assert.equal(q.answerContract.type,'written-explanation');
 assert.equal(q.responseContract.teacherRequired,true);
 assert.equal(q.responseContract.exactStringScoring,false);
 assert.equal(gradeDaily(q,q.answerContract.sample).status,'review');
 assert.equal(gradeDaily(old,old.answerContract.sample).status,'review');
 assert.deepEqual(questionMisconceptions(q,careerMisc),questionMisconceptions(old,careerMisc));
 for(const version of [old,...(old.previousVersions||[])]){
  const restored=questionAtVersion(q,version.version||version.contentVersion||1);
  for(const[key,value]of Object.entries(version))if(key!=='version')assert.deepEqual(restored[key],value);
 }
 const state={answers:{[q.id]:old.answerContract.sample,other:'유지'},graded:{[q.id]:{status:'review'}},self:{[q.id]:'unsure'},questionVersions:{[q.id]:old.contentVersion},at:10},stateBefore=structuredClone(state);
 assert.deepEqual(restoreDailyQuestions([q],state)[0].answerContract,old.answerContract);
 const next=restartCurrentQuestion(state,q);assert.deepEqual(state,stateBefore);assert.equal(next.answers.other,'유지');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].answers,old.answerContract.sample);assert.equal(restoreDailyQuestions([q],next)[0],q);
 assert.equal(guidanceParticleCurrentItems(current,unit),current);assert.deepEqual(guidanceParticleCurrentItems(structuredClone(current),unit),current);assert.equal(guidanceParticleCurrentItems(prior,'not-reviewed'),prior);
 for(const candidate of [{...old,contentVersion:'future'},{...old,sourceRef:{type:'original'}},{...old,sourceRef:{type:'similar'}},{...old,status:'source'}])assert.equal(guidanceParticleCurrentItems([candidate],unit)[0],candidate);
 assert.deepEqual(prior,before);
});
