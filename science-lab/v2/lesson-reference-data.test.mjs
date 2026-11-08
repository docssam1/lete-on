import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {lessonReferenceItems,LESSON_REFERENCE_UNITS,LESSON_REFERENCE_DATA_VERSION} from '../data/book/lesson-reference-data.js';
import {withThink} from './think-merge.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';
import {buildSlides} from './deck.js';
import {deckQuestionSnapshot} from './deck-answer-state.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {questionAtVersion,questionVersion,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily} from './daily-grade.js';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {writtenPracticeHtml} from './written-practice.js';
import {seasonAnswerHint} from './season-answer-hint.js';
import {MATERIALS,TESTS,NOTE,materialResult} from '../scenes/material-model.js';
import {evapModel} from '../scenes/seawater-model.js';
import {LENGTHS,STRENGTHS,rulerModel} from '../scenes/ruler-model.js';
import {ROUNDS,glitterModel} from '../scenes/glitter-model.js';
import {moonModel} from '../scenes/moon-model.js';
import {BASE,YEARS,meadowAt} from '../scenes/meadow-model.js';
import {HOUSES,wetHouses} from '../scenes/sealevel-model.js';
import {START,WATERS,breadModel} from '../scenes/bread-model.js';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8');
const start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const units=await Promise.all(LESSON_REFERENCE_UNITS.map(async unit=>({unit,data:await loaders[unit]()})));
const targets=units.flatMap(({unit,data})=>data.items.filter(q=>q.contentVersion===LESSON_REFERENCE_DATA_VERSION).map(q=>({unit,q})));
const get=id=>targets.find(({q})=>q.id===id).q;
const escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const context=vm.createContext({...presentation,...content,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:null,CIRC:['①','②','③','④','⑤'],esc:escape});
const item=new vm.Script(source.slice(source.indexOf('function blanksHtml('),source.indexOf('let FIG ='))+';itemHtml').runInContext(context);
const dailySource=await readFile(new URL('./daily.js',import.meta.url),'utf8');
const givenStart=dailySource.indexOf('const givensHtml = '),givenEnd=dailySource.indexOf('\n',givenStart);
const dailyGivens=new vm.Script(dailySource.slice(givenStart,givenEnd)+';givensHtml').runInContext(context);

test('data-dependent authored questions show their required tables online, in print and in Daily',()=>{
 assert.equal(units.length,8);assert.equal(targets.length,17);
 for(const {q}of targets){
  assert.equal(q.status,'authored');assert.equal(q.sourceRef.type,'authored-lesson');
  const tables=Object.values(q.givens).filter(v=>v?.머리&&v?.행);assert(tables.length);
  for(const table of tables){assert(table.caption.includes('모형'));for(const row of table.행)assert.equal(row.length,table.머리.length);}
  for(const html of [item(q),item(q,{print:true}),dailyGivens(q)]){
   assert(!/undefined|\[object Object\]/.test(html));
   for(const table of tables){assert(html.includes(escape(table.caption)));for(const header of table.머리)assert(html.includes(escape(header)));for(const row of table.행)for(const value of row)assert(html.includes(escape(value)));}
   assert(!html.includes('class="sol"'));
  }
 }
});

test('reference conditions and values come from the same model data as the lessons',()=>{
 const material=get('c22-s32-u01-t09').givens.결과표;
 assert.deepEqual(material.행,MATERIALS.map(m=>[m+'('+NOTE[m]+')',...TESTS.map(t=>materialResult(t,m).text)]));
 const evaporation=get('c22-s32-u02-t12').givens.결과표;
 assert.deepEqual(evaporation.행,['바닷물','수돗물'].map(w=>[w,'20 mL',evapModel(w,20).look]));
 assert.deepEqual(get('c22-s32-u03-t12').givens.결과표.행,LENGTHS.flatMap(len=>STRENGTHS.map(strength=>{const m=rulerModel(len,strength);return[len+' cm',strength,m.pitch,m.loud];})));
 assert.deepEqual(get('c22-s32-u04-t05').givens.악수표.행,ROUNDS.map((pairs,i)=>[(i+1)+'차례',pairs.map(pair=>pair.join('–')).join(' / ')]));
 assert.deepEqual(get('c22-s32-u04-t12').givens.결과표.행,[0,1,2,3].map(n=>[n?n+'차례 뒤':'처음',glitterModel(n,0).result,glitterModel(n,1).result]));
 assert.deepEqual(get('c22-s42-u01-t12').givens.관찰표.행,[3,7,15].map(day=>{const m=moonModel(day);return[day+'일',m.time,m.name+' · '+m.side,m.dir];}));
 assert.deepEqual(get('c22-s42-u02-t05').givens.결과표.행,['그대로','여우가 사라짐','토끼가 사라짐'].map(change=>[change,BASE.grass,meadowAt(change,YEARS).grass]));
 assert.deepEqual(get('c22-s42-u04-t05').givens.집배치표.행,HOUSES.map(h=>[h.id,h.base,h.near]));
 assert.deepEqual(get('s41-u04-t05').givens.결과표.행,WATERS.map(w=>{const m=breadModel(w);return[w,START,m.vol,m.shape];}));
 const expectedTables={
  'c22-s32-u01-t05':MATERIALS.map(m=>[materialResult('물에 넣기',m).text]),
  'c22-s32-u04-t05':[0,1,2,3].map(n=>[glitterModel(n,0).n+'명']),
  'c22-s42-u02-t05':['그대로','여우가 사라짐','토끼가 사라짐'].map(c=>[meadowAt(c,YEARS).grass>BASE.grass?'늘어남':meadowAt(c,YEARS).grass<BASE.grass?'줄어듦':'그대로']),
  'c22-s42-u04-t05':[1,2,3,4].map(level=>[wetHouses(level).length+'채']),
  's41-u04-t05':WATERS.map(w=>[breadModel(w).vol+' mL']),
 };
 for(const [id,values]of Object.entries(expectedTables)){const q=get(id);assert.deepEqual(q.answerContract.rows.map(r=>r.answer),values);assert.equal(gradeDaily(q,values).status,'correct');}
});

test('adding reference material preserves all grading contracts and historical question presentations',()=>{
 for(const {q}of targets){
  const prior=q.previousVersions.at(-1),{version,...snapshot}=prior,restored=questionAtVersion(q,version);
  assert.equal(snapshot.givens,null);for(const [key,value]of Object.entries(snapshot))assert.deepEqual(restored[key],value);
  for(const [key,value]of Object.entries(snapshot))if(!['givens','contentVersion','previousVersions'].includes(key))assert.deepEqual(q[key],value);
  const ac=q.answerContract,answer=ac.type==='single-choice'?ac.answer:ac.type==='table-fill'?ac.rows.map(r=>r.answer):ac.sample;
  const alternatives=ac.type==='single-choice'?[0,1,2,3,4]:[answer,'different response',[]];
  for(const value of alternatives)assert.deepEqual(gradeDaily(q,value),gradeDaily(snapshot,value));
  const state={answers:{[q.id]:answer,other:'keep'},graded:{[q.id]:{status:'correct'}},questionVersions:{[q.id]:version}},before=structuredClone(state);
  assert.equal(restoreDailyQuestions([q],state)[0].givens,null);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.answers.other,'keep');assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.questionVersions[q.id],LESSON_REFERENCE_DATA_VERSION);
  const oldPaper={paper:snapshotDailyPaper([snapshot]),answers:{[q.id]:answer}};
  const resolved=resolveDailyPaper([q],oldPaper);assert(resolved.readOnly);assert.equal(resolved.questions[0].givens,null);
  const currentPaper=resolveDailyPaper([q],{paper:snapshotDailyPaper([q])});assert(!currentPaper.readOnly);assert.deepEqual(currentPaper.questions[0].givens,q.givens);
  assert.equal(questionAtVersion(q,'unknown-reference-version'),null);
 }
});

test('classroom copies share the three revised bank materials and preserve original and unreviewed inputs',async()=>{
 let classroomTargets=0;
 for(const {unit,data}of units){
  const book=await import('../data/book/'+unit+'.book.js'),a=await revisedClassroom(unit,book),b=await revisedClassroom(unit,book);
  const pool=classroomQuestions(a,[...(data.similar||[]),...data.items]);
  for(const q of a.classroomItems.filter(q=>q.contentVersion===LESSON_REFERENCE_DATA_VERSION)){
   classroomTargets++;assert.deepEqual(q,data.items.find(x=>x.id===q.id));assert.equal(q,b.classroomItems.find(x=>x.id===q.id));
   for(const mode of ['self','teach']){
    const slide=buildSlides(a.chapter,a.art,a.plan,pool,mode).find(s=>s.item===q.id);assert(slide);
    for(const value of Object.values(q.givens))if(value?.caption)assert(slide.body.includes(escape(value.caption)));
    assert(!slide.body.includes('&quot;머리&quot;'));assert.equal(slide.questionVersion,LESSON_REFERENCE_DATA_VERSION);
    const snapshot=deckQuestionSnapshot(slide,pool);assert.deepEqual(snapshot.givens,q.givens);snapshot.givens.자료='changed snapshot';assert.notEqual(snapshot.givens.자료,q.givens.자료);
   }
  }
  assert.equal(lessonReferenceItems(data.source,unit),data.source);assert.equal(lessonReferenceItems(data.similar,unit),data.similar);
 }
 assert.equal(classroomTargets,3);
 const {unit,q}=targets[0],{version,...old}=q.previousVersions.at(-1),input=[old],before=structuredClone(input);
 const first=lessonReferenceItems(input,unit),again=lessonReferenceItems(input,unit);assert.equal(first[0],again[0]);assert.deepEqual(input,before);assert.equal(questionVersion(first[0]),LESSON_REFERENCE_DATA_VERSION);assert.equal(lessonReferenceItems(first,unit),first);
 for(const altered of [{...old,prompt:'unreviewed'},{...old,contentVersion:'future'},{...old,givens:{자료:'already supplied'}},{...old,status:'review'},...['original','similar','authored-supplement'].map(type=>({...old,sourceRef:{type}}))]){const rows=[altered];assert.equal(lessonReferenceItems(rows,unit),rows);}
 assert.equal(lessonReferenceItems(input,'other-unit'),input);
});
