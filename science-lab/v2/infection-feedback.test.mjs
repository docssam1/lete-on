import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {items as base} from '../data/units/c22-s32-u04.js';
import {items as think} from '../data/units/c22-s32-u04.think.js';
import {grade3PracticeCurrentItems,infectionFeedbackCurrentItems,INFECTION_FEEDBACK_VERSION} from '../data/book/c22-s32-practice-language.js';
import {lessonReferenceItems} from '../data/book/lesson-reference-data.js';
import {withThink} from './think-merge.js';
import {questionAtVersion,questionVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily,vocabOf} from './daily-grade.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {teacherKeyHtml} from './daily.js';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {writtenPracticeHtml} from './written-practice.js';
import {seasonAnswerHint} from './season-answer-hint.js';

const unit='c22-s32-u04',source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const a=source.indexOf('const UNITS = ')+14,b=source.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+source.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const current=await loaders[unit]();
const prior=lessonReferenceItems(grade3PracticeCurrentItems([...base,...think],unit),unit);
const targetIds=['t01','t04','t09','t10'].map(no=>unit+'-'+no);
const reviewed=current.items.filter(q=>q.contentVersion===INFECTION_FEEDBACK_VERSION);

test('four infection explanations change without changing questions, answer boundaries or saved attempts',()=>{
 assert.equal(current.items.length,92);assert.deepEqual(reviewed.map(q=>q.id),targetIds);
 const vocabulary=vocabOf(prior,current.misc),options={misc:current.misc,vocab:vocabulary};
 for(let i=0;i<prior.length;i++){
  const old=prior[i],q=current.items[i];
  if(!targetIds.includes(q.id)){assert.deepEqual(q,old);continue;}
  assert.notEqual(q.explanation,old.explanation);
  for(const key of Object.keys(old))if(!['explanation','contentVersion','previousVersions'].includes(key))assert.deepEqual(q[key],old[key]);
  const {version,...snapshot}=q.previousVersions.at(-1);assert.equal(version,questionVersion(old));assert.deepEqual(snapshot,old);
  const ac=q.answerContract,answers=ac.type==='single-choice'?[0,1,2,3,4,'']:[[ac.blanks[0].answer],[''],['충치'],['손바닥'],['어떤 다른 말']];
  for(const answer of answers)assert.deepEqual(gradeDaily(q,answer,options),gradeDaily(old,answer,options));
  for(const version of new Set([questionVersion(old),...(old.previousVersions||[]).map(p=>p.version)])){
   const expected=questionAtVersion(old,version),restored=questionAtVersion(q,version);
   for(const [key,value]of Object.entries(expected))assert.deepEqual(restored[key],value);
   const state={answers:{[q.id]:answers[0],other:'keep'},first:{[q.id]:{status:'correct'}},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},before=structuredClone(state);
   assert.equal(restoreDailyQuestions([q],state)[0].explanation,expected.explanation);
   const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,'keep');assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.equal(next.revisionHistory[q.id][0].self,'sure');
  }
  const saved={paper:snapshotDailyPaper([old]),answers:{[q.id]:answers[0]}},before=structuredClone(saved);
  const resolved=resolveDailyPaper([q],saved);assert.equal(resolved.questions[0].explanation,old.explanation);assert.deepEqual(saved,before);
 }
 const before=structuredClone(prior);infectionFeedbackCurrentItems(prior,unit);assert.deepEqual(prior,before);
 assert.equal(infectionFeedbackCurrentItems(current.items,unit),current.items);
 const old=prior.find(q=>q.id===targetIds[0]);
 for(const altered of [{...old,contentVersion:'future'},{...old,prompt:'unreviewed prompt'},{...old,explanation:'unreviewed explanation'},{...old,status:'review'},...['original','similar','authored-supplement'].map(type=>({...old,sourceRef:{type}}))]){
  const rows=[altered];assert.equal(infectionFeedbackCurrentItems(rows,unit),rows);
 }
 assert.equal(infectionFeedbackCurrentItems(prior,'other-unit'),prior);
});

test('online, printed teacher feedback and Daily use the reviewed explanations while student print hides them',()=>{
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const context=vm.createContext({...presentation,...content,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:null,questionMisconceptions,CIRC:['①','②','③','④','⑤'],esc});
 const item=new vm.Script(source.slice(source.indexOf('function blanksHtml('),source.indexOf('let FIG ='))+';itemHtml').runInContext(context);
 const feedback=new vm.Script(source.slice(source.indexOf('function whyHtml('),source.indexOf('// ctx = '))+';whyHtml').runInContext(context);
 for(const q of reviewed){
  const old=prior.find(p=>p.id===q.id),explanation=esc(q.explanation);
  for(const html of [feedback(q,true),item(q,{print:true,show:true}),teacherKeyHtml({u:unit,ch:{title:'감염병과 건강한 생활'},list:[q],misc:current.misc})]){
   assert(html.includes(explanation));assert(!html.includes(esc(old.explanation)));assert(!/undefined|\[object Object\]/.test(html));
  }
  assert(!item(q,{print:true}).includes(explanation));
  assert(!item(q).includes(explanation));
 }
 assert(!reviewed[0].explanation.includes('눈병은 감염병'));
 assert(!reviewed[2].explanation.includes('묻지 않아요'));
 assert(reviewed[3].explanation.includes('감염 위험을 줄이는 데 도움이'));
 assert(reviewed[3].explanation.includes('비말은 작은 침방울, 타액은 침'));
});
