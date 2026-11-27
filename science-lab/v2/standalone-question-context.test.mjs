import{beforeCareerTask}from'./tests/career-guided-stage.mjs';
import{beforeBiologyTask}from'./tests/biology-guided-stage.mjs';
import{CAREER_TEMPERATURE_VERSION}from'../data/book/career-temperature-condition.js';
const beforeCareerContext=latest=>{const q=latest?.contentVersion===CAREER_TEMPERATURE_VERSION?questionAtVersion(latest,latest.previousVersions.at(-1).version):latest;if(q?.contentVersion!=='20261116-career-workbook-context')return q;const{version,snapshotKind,...previous}=q.previousVersions.at(-1);return previous;};
import{BIOLOGY_EXAMPLE_VERSION}from'../data/book/biology-example-card.js';
const beforeRepresentation=q=>{if(q?.contentVersion!=='20261115-representation-response-review')return q;const{version,snapshotKind,...previous}=q.previousVersions.at(-1);return previous;};
const beforeGrade6Review=item=>{const q=beforeRepresentation(beforeCareerContext(item));return q?.contentVersion==='20261115-grade6-question-review'?questionAtVersion(q,q.previousVersions.at(-1).version):q;};
import{GRADE4_REVIEW_VERSION}from'../data/book/grade4-question-review.js';
// This regression verifies the earlier presentation stage; the grade 4 review has separate coverage.
const beforeGrade4=item=>{const q=item.contentVersion===BIOLOGY_EXAMPLE_VERSION?questionAtVersion(item,item.previousVersions.at(-1).version):item;return q.contentVersion===GRADE4_REVIEW_VERSION?questionAtVersion(q,q.previousVersions.at(-1).version):q;};
import{BIOLOGY_PEER_OPINIONS_VERSION,BIOLOGY_ELEMENTARY_BANK_VERSION as peerPriorVersion}from'../data/book/s41-u04.editorial.js';
import{BIOLOGY_OBSERVATION_CHOICE_VERSION}from'../data/book/standalone-question-context.js';
import{BIOLOGY_OBSERVATION_PHOTO_VERSION}from'../data/book/biology-observation-photos.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {standaloneQuestionContexts,STANDALONE_CONTEXT_VERSION} from '../data/book/standalone-question-context.js';
import {items as biologyItems} from '../data/units/s41-u04.js';
import {items as biologyThink} from '../data/units/s41-u04.think.js';
import {items as careerItems} from '../data/units/c22-s62-u04.js';
import {biologyCurrentItems} from '../data/book/biology-student-language.js';
import {biologyReadableCurrentItems,biologyElementaryCurrentItems} from '../data/book/s41-u04.editorial.js';
import {careerCurrentItems} from './career-question-language.js';
import {careerReadableCurrentItems,careerReadableWorkbookBeforeContext} from '../data/book/c22-s62-u04.editorial.js';
import {guidanceParticleCurrentItems} from '../data/book/term-particle-language.js';
import {lessonReferenceItems} from '../data/book/lesson-reference-data.js';
import {grade6ReviewPriorWorkbook as workbook,careerReadablePriorWorkbook} from '../data/book/c22-s62-u04.workbook.js';
import {withThink,loadJudge} from './think-merge.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {questionAtVersion,questionVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily} from './daily-grade.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {writtenPracticeHtml} from './written-practice.js';
import {seasonAnswerHint} from './season-answer-hint.js';

const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const a=source.indexOf('const UNITS = ')+14,b=source.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+source.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const prior={
 's41-u04':lessonReferenceItems(biologyElementaryCurrentItems(biologyReadableCurrentItems(biologyCurrentItems([...biologyItems,...biologyThink]),'s41-u04'),'s41-u04'),'s41-u04'),
 'c22-s62-u04':careerReadableCurrentItems(guidanceParticleCurrentItems(careerCurrentItems(careerItems),'c22-s62-u04'),'c22-s62-u04'),
};
const current=Object.fromEntries(await Promise.all(Object.keys(prior).map(async unit=>[unit,await loaders[unit]()])))
const expected=['c22-s62-u04-b032','s41-u04-b09','s41-u04-b16'];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('three missing contexts preserve every answer boundary, previous presentation and saved response',async()=>{
 const changed=[];
 for(const [unit,rows]of Object.entries(prior)){
  const mod=current[unit],judge=await loadJudge(unit);assert.equal(rows.length,mod.items.length);
  const immutable=structuredClone(rows);
  for(let i=0;i<rows.length;i++){
   const old=rows[i],stage=beforeGrade4(beforeGrade6Review(mod.items[i])),latest=stage.contentVersion===BIOLOGY_PEER_OPINIONS_VERSION?questionAtVersion(stage,peerPriorVersion):stage,photo=latest.contentVersion===BIOLOGY_OBSERVATION_CHOICE_VERSION?questionAtVersion(latest,BIOLOGY_OBSERVATION_PHOTO_VERSION):latest,q=photo.contentVersion===BIOLOGY_OBSERVATION_PHOTO_VERSION?questionAtVersion(photo,photo.previousVersions.at(-1).version):photo;
   if(!expected.includes(q.id)){assert.deepEqual(q,old);continue;}
   changed.push(q.id);assert.equal(q.contentVersion,STANDALONE_CONTEXT_VERSION);
   const {prompt:p1,givens:g1,figure:f1,figureNote:n1,contentVersion:v1,previousVersions:h1,...oldFields}=old;
   const {prompt:p2,givens:g2,figure:f2,figureNote:n2,contentVersion:v2,previousVersions:h2,...newFields}=q;
   assert.deepEqual(newFields,oldFields);assert.deepEqual(questionMisconceptions(q,mod.misc),questionMisconceptions(old,mod.misc));
   const {version,snapshotKind,...snapshot}=h2.at(-1);assert.equal(version,questionVersion(old));assert.equal(snapshotKind,'full-question');assert.deepEqual(snapshot,old);
   const answers=q.answerContract.type==='single-choice'?[0,1,2,3,4,'']:[q.answerContract.sample,'another explanation',''];
   for(const answer of answers)assert.deepEqual(gradeDaily(q,answer,{judge,misc:mod.misc}),gradeDaily(old,answer,{judge,misc:mod.misc}));
   for(const version of new Set([questionVersion(old),...(old.previousVersions||[]).map(p=>p.version)])){
    const expectedOld=questionAtVersion(old,version),restored=questionAtVersion(q,version);
    for(const [key,value]of Object.entries(expectedOld))assert.deepEqual(restored[key],value);
    for(const key of ['figure','figureNote','givens'])assert.equal(Object.hasOwn(restored,key),Object.hasOwn(expectedOld,key),q.id+' '+key);
    const state={answers:{[q.id]:answers[0],other:'keep'},graded:{[q.id]:{status:'review'}},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
    assert.equal(restoreDailyQuestions([q],state)[0].prompt,expectedOld.prompt);
    const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.revisionHistory[q.id][0].version,version);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);
   }
   const saved={paper:snapshotDailyPaper([old]),answers:{[q.id]:answers[0]}},resolved=resolveDailyPaper([q],saved);
   assert.equal(resolved.questions[0].figure,old.figure);assert.deepEqual(resolved.questions[0].givens,old.givens);
  }
  assert.deepEqual(rows,immutable);assert.equal(standaloneQuestionContexts(mod.items,unit),mod.items);
  for(const row of [mod.source,mod.similar])assert.equal(standaloneQuestionContexts(row,unit),row);
  const old=rows.find(q=>expected.includes(q.id));
  for(const q of [{...old,contentVersion:'future'},{...old,prompt:'unreviewed'},{...old,givens:{자료:'existing'}},{...old,figure:'existing.webp'},{...old,status:'review'},...['original','similar','authored-pair'].map(type=>({...old,sourceRef:{type}}))]){
   const input=[q];assert.equal(standaloneQuestionContexts(input,unit),input);
  }
 }
 assert.deepEqual(changed.sort(),expected);
});

test('the existing bacteria photo appears in online, Daily and combined papers without redrawing or hidden answers',()=>{
 const imagePath='assets/bank/s41-u04/s3-q11.webp',file=fs.readFileSync(new URL('../'+imagePath,import.meta.url));
 assert.equal(createHash('sha256').update(file).digest('hex'),'0e25085d414a29f9a5fc462fcc863a4177787fb409b2e09e895e47b32aa304f0');
 const context=vm.createContext({...presentation,...content,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:null,CIRC:['①','②','③','④','⑤'],esc});
 const item=new vm.Script(source.slice(source.indexOf('function blanksHtml('),source.indexOf('let FIG ='))+';itemHtml').runInContext(context);
 const dailySource=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8');
 const dailyFigure=new vm.Script(dailySource.slice(dailySource.indexOf('const figHtml ='),dailySource.indexOf('const givensHtml ='))+';figHtml').runInContext(context);
 for(const q of current['s41-u04'].items.filter(q=>expected.includes(q.id))){
  assert(q.prompt.includes('오른쪽 위'));assert(q.prompt.includes('입힌 색이라고 정했어요'));
  for(const html of [item(q),item(q,{print:true}),item(q,{print:true,show:true}),dailyFigure(q)])assert(html.includes('../'+imagePath));
  assert(!item(q,{print:true}).includes('class="ans"'));assert(!item(q).includes(esc(q.explanation)));
 }
 for(const mode of ['student','teacher','answers','quick']){
  const html=current['s41-u04'].bankPaper({...current['s41-u04'],mode});assert(!/undefined|\[object Object\]/.test(html));
  if(mode==='student'||mode==='teacher')for(const id of expected.filter(id=>id.startsWith('s41'))){const start=html.indexOf('data-paper-item="'+id+'"'),end=html.indexOf('</article>',start);assert(html.slice(start,end).includes('../'+imagePath));}
  if(mode==='student')assert(!html.includes('class="bio-bank-key"'));
 }
});

test('career question 32 shares question 18 water data across workbook, bank, class and both print paths',async()=>{
 const bank=current['c22-s62-u04'],q=bank.items.find(q=>q.id==='c22-s62-u04-b032'),given=bank.items.find(q=>q.id==='c22-s62-u04-b018').givens;
 assert.deepEqual(q.givens,given);
 const shortages=q.givens.자료표.행.map(([name,available,needed])=>[name,parseFloat(needed)-parseFloat(available)]).filter(([,n])=>n>0);
 assert.deepEqual(shortages,[['ㄴ',10]]);
 const old=careerReadableWorkbookBeforeContext(careerReadablePriorWorkbook);
 for(const key of Object.keys(old).filter(k=>k!=='questions'))assert.deepEqual(workbook[key],old[key]);
 for(let i=0;i<128;i++){
  const before=old.questions[i],now=workbook.questions[i];
  if(now.no!==32){assert.deepEqual(now,before);continue;}
  assert.deepEqual(now.table,q.givens.자료표);assert.equal(now.givens,q.givens.조건);assert.equal(now.figure,'career-question-data-18');
  for(const key of Object.keys(before))assert.deepEqual(now[key],before[key]);
  assert.equal(now.drawingSpaceMinimumMm,120);assert.equal(now.drawingExplanationLines,3);
 }
 const paper=await revisedTextbookPaper('c22-s62-u04');
 for(const mode of ['student','teacher','answers','quick'])for(const html of [paper.workbookPaper({mode}),bank.bankPaper({mode})]){
  assert(!/undefined|\[object Object\]/.test(html));
  if(mode==='student'||mode==='teacher'){
   const match=html.match(/<li class="ed-question" data-question="c22-s62-u04-w032"[\s\S]*?<\/li>/);assert(match);
   for(const header of q.givens.자료표.머리)assert(match[0].includes(esc(header)));
   for(const row of q.givens.자료표.행)for(const value of row)assert(match[0].includes(value));
   assert(match[0].includes('ed-drawing large'));if(mode==='student')assert(!match[0].includes('ed-key'));
  }
 }
 for(const unit of Object.keys(prior)){
  const mod=await revisedClassroom(unit,await import('../data/book/'+unit+'.book.js'));
  for(const item of mod.classroomItems.map(q=>beforeBiologyTask(beforeCareerTask(q))))assert.deepEqual(item,current[unit].items.find(q=>q.id===item.id));
 }
});
