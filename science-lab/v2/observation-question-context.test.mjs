import{beforeSeasonTask}from'./tests/season-guided-stage.mjs';
import{seasonContextItems}from'../data/book/season-workbook-context.js';
const beforeSeasonContext=q=>{q=beforeSeasonTask(q);if(q?.contentVersion!=='20261116-season-workbook-context')return q;const{version,snapshotKind,...previous}=q.previousVersions.at(-1);return previous;};
import{representationQuestionReview}from'../data/book/representation-question-review.js';
const beforeRepresentation=item=>{const q=beforeSeasonContext(item);if(q?.contentVersion!=='20261115-representation-response-review')return q;const{version,snapshotKind,...previous}=q.previousVersions.at(-1);return previous;};
import{grade6QuestionReview}from'../data/book/grade6-question-review.js';
const beforeGrade6Review=item=>{const q=beforeRepresentation(item);return q?.contentVersion==='20261115-grade6-question-review'?questionAtVersion(q,q.previousVersions.at(-1).version):q;};
import{seasonComparisonCurrentItems,seasonComparisonEdits,SEASON_COMPARISON_VERSION}from'../data/book/c22-s62-u01.editorial.js';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import{createHash}from'node:crypto';
import{standaloneQuestionContexts,withSeasonStandaloneContext,OBSERVATION_CONTEXT_VERSION}from'../data/book/standalone-question-context.js';
import{items as seasonRaw}from'../data/units/c22-s62-u01.js';import{items as skyRaw}from'../data/units/c22-s42-u01.js';import{items as skyThink}from'../data/units/c22-s42-u01.think.js';
import{seasonCurrentItems}from'./season-question-language.js';import{seasonReadableCurrentItems}from'../data/book/c22-s62-u01.editorial.js';import{seasonPairCurrentItems}from'./season-pair-language.js';import{elementaryPromptCurrentItems}from'../data/book/elementary-question-prompts.js';
import{magnetSkyCurrentItems}from'./magnet-sky-question-language.js';import{skyReadableCurrentItems}from'../data/book/c22-s42-u01.rail-notes.js';import{lessonReferenceItems}from'../data/book/lesson-reference-data.js';
import{seasonComparisonPriorWorkbook as workbook,observationContextPriorWorkbook}from'../data/book/c22-s62-u01.workbook.js';import{withThink,loadJudge}from'./think-merge.js';import{revisedClassroom}from'./revised-lesson.js';import{revisedTextbookPaper}from'./revised-textbook.js';
import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,questionMisconceptions}from'./question-revision.js';import{gradeDaily}from'./daily-grade.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';
import*as presentation from'./source-presentation.js';import*as content from'./source-content.js';import{writtenPracticeHtml}from'./written-practice.js';import{seasonAnswerHint}from'./season-answer-hint.js';
const code=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const prior={'c22-s62-u01':elementaryPromptCurrentItems(seasonPairCurrentItems(seasonReadableCurrentItems(seasonCurrentItems(seasonRaw),'c22-s62-u01'),'c22-s62-u01'),'c22-s62-u01'),'c22-s42-u01':lessonReferenceItems(skyReadableCurrentItems(magnetSkyCurrentItems([...skyRaw,...skyThink],'c22-s42-u01'),'c22-s42-u01'),'c22-s42-u01')};
const current=Object.fromEntries(await Promise.all(Object.keys(prior).map(async u=>[u,await loaders[u]()]))),ids=['c22-s62-u01-b030','c22-s42-u01-b02'];
const imagePath='assets/book/c22-s42-u01-moltke-apollo10-nasa.jpg',esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('two missing observation contexts preserve all contracts, earlier versions, saved answers and retake history',async()=>{
 const changed=[];
 for(const[u,rows]of Object.entries(prior)){
  const before=JSON.stringify(rows),mod=current[u],judge=await loadJudge(u);assert.deepEqual(mod.items.map(beforeSeasonTask),skyResponseItems(seasonContextItems(representationQuestionReview(grade6QuestionReview(seasonComparisonCurrentItems(standaloneQuestionContexts(rows,u),u),u),u),u),u));const stageItems=mod.items.map(beforeSkyResponse).map(beforeGrade6Review).map(q=>q.contentVersion===SEASON_COMPARISON_VERSION?questionAtVersion(q,seasonComparisonEdits[q.workbookRef.no].priorVersion):q);
  for(let i=0;i<rows.length;i++){
   const old=rows[i],q=stageItems[i];if(!ids.includes(q.id)){assert.deepEqual(q,old);continue;}changed.push(q.id);
   assert.equal(q.contentVersion,OBSERVATION_CONTEXT_VERSION);assert.deepEqual(q.answerContract,old.answerContract);assert.deepEqual(q.responseContract,old.responseContract);assert.equal(q.explanation,old.explanation);assert.deepEqual(q.taxonomy,old.taxonomy);assert.deepEqual(q.sourceRef,old.sourceRef);
   assert.deepEqual(questionAtVersion(q,old.contentVersion||1),{...old,contentVersion:old.contentVersion||1});
   assert.deepEqual(questionMisconceptions(q,mod.misc),questionMisconceptions(old,mod.misc));
   const responses=q.choices?[0,1,2,3,4,'']:[q.answerContract.sample,'another explanation',''];
   for(const response of responses)assert.deepEqual(gradeDaily(q,response,{judge,misc:mod.misc}),gradeDaily(old,response,{judge,misc:mod.misc}));
   const state=JSON.parse(JSON.stringify({answers:{[q.id]:responses[0],other:'keep'},graded:{[q.id]:gradeDaily(old,responses[0],{judge,misc:mod.misc})},self:{[q.id]:'sure'},questionVersions:{[q.id]:old.contentVersion||1}})),saved=structuredClone(state);
   assert.deepEqual(restoreDailyQuestions([q],state)[0],{...old,contentVersion:old.contentVersion||1});
   const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.equal(next.revisionHistory[q.id][0].self,'sure');assert.equal(next.answers.other,'keep');
   const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert.deepEqual(paper.questions[0].givens,old.givens);assert.equal(paper.questions[0].figure,old.figure);
   for(const altered of [{...old,contentVersion:'future'},{...old,prompt:'future question'},{...old,givens:{existing:'data'}},{...old,figure:'existing.webp'},...['original','similar','authored-pair'].map(type=>({...old,sourceRef:{type}}))]){const input=[altered];assert.equal(standaloneQuestionContexts(input,u),input);}
  }
  assert.equal(JSON.stringify(rows),before);assert.equal(standaloneQuestionContexts(mod.items,u),mod.items);
  const cls=await revisedClassroom(u,await import('../data/book/'+u+'.book.js'));for(const q of cls.classroomItems)if(ids.includes(q.id))assert.deepEqual(beforeSeasonTask(q),mod.items.find(it=>it.id===q.id));
 }
 assert.deepEqual(changed.sort(),ids.sort());
});

test('season question 30 shares the five existing samples in workbook and both four-mode papers',async()=>{
 const q=current['c22-s62-u01'].items.find(q=>q.id===ids.find(id=>id.includes('s62'))),w=workbook.questions.find(q=>q.no===30),data=workbook.questions.find(q=>q.no===28);
 assert.deepEqual(w.table,data.table);assert.equal(w.givens,data.givens);assert.deepEqual(q.givens,{조건:data.givens,자료표:data.table});assert.equal(w.figure,'season-question-data-28');
 assert.deepEqual(data.table.행,[['10:15','41°'],['11:15','53°'],['12:15','62°'],['13:15','60°'],['14:15','49°']]);
 const max=Math.max(...data.table.행.map(row=>parseFloat(row[1])));assert.equal(max,62);assert.equal(data.table.행.find(row=>parseFloat(row[1])===max)[0],'12:15');assert(w.givens.includes('정확한 남중 시각은 따로 주어지지'));
 for(let i=0;i<128;i++){const old=observationContextPriorWorkbook.questions[i],now=workbook.questions[i];if(now.no===30){const{givens,given,table,figure,...fields}=now;assert.deepEqual(fields,old);assert.equal(now.lines,6);}else assert.deepEqual(now,old);}
 for(const k of Object.keys(workbook).filter(k=>k!=='questions'))assert.deepEqual(workbook[k],observationContextPriorWorkbook[k]);assert.equal(withSeasonStandaloneContext(workbook),workbook);
 const paper=await revisedTextbookPaper('c22-s62-u01');
 for(const mode of ['student','teacher','answers','quick'])for(const [html,id] of [[paper.workbookPaper({mode}),'c22-s62-u01-w030'],[current['c22-s62-u01'].bankPaper({mode}),'c22-s62-u01-b030']]){
  assert(!/undefined|\[object Object\]/.test(html));if(mode==='student'||mode==='teacher'){const m=html.match(new RegExp('<li class="ed-question" data-question="'+id+'"[\\s\\S]*?</li>'));assert(m);for(const row of data.table.행)for(const v of row)assert(m[0].includes(v));if(mode==='student')assert(!m[0].includes('ed-key'));}
 }
});

test('the existing lunar photo is visible in standalone learning, Daily and the student and teacher question papers',()=>{
 const q=current['c22-s42-u01'].items.find(q=>q.id==='c22-s42-u01-b02');assert.equal(q.figure,imagePath);assert(!q.prompt.includes('교사'));assert.equal(createHash('sha256').update(fs.readFileSync(new URL('../'+imagePath,import.meta.url))).digest('hex'),'e5fb78d33efb9a64cec032242d2df0f236bcc818e898f146328370de9bd09f76');
 const ctx=vm.createContext({...presentation,...content,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:null,CIRC:['①','②','③','④','⑤'],esc});
 const item=new vm.Script(code.slice(code.indexOf('function blanksHtml('),code.indexOf('let FIG ='))+';itemHtml').runInContext(ctx),dailyCode=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8'),daily=new vm.Script(dailyCode.slice(dailyCode.indexOf('const figHtml ='),dailyCode.indexOf('const givensHtml ='))+';figHtml').runInContext(ctx);
 for(const html of [item(q),item(q,{print:true}),daily(q)]){assert(html.includes('../'+imagePath));assert(!html.includes(esc(q.explanation)));}
 for(const mode of ['student','teacher','answers','quick']){const mod=current['c22-s42-u01'],html=mod.bankPaper({...mod,mode});assert(!/undefined|\[object Object\]/.test(html));if(mode==='student'||mode==='teacher'){const at=html.indexOf('data-paper-item="'+q.id+'"'),end=html.indexOf('</article>',at),card=html.slice(at,end);assert(card.includes('../'+imagePath));if(mode==='student')assert(!card.includes('sky-key'));}}
});

import{skyResponseItems,SKY_RESPONSE_VERSION}from'../data/book/sky-response-review.js';
const beforeSkyResponse=q=>q.contentVersion===SKY_RESPONSE_VERSION?questionAtVersion(q,q.previousVersions.at(-1).version):q;
