import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {unit,items,bankPaper} from '../data/units/c22-s42-fin.js';
import {reviewedAssessmentItems,ASSESSMENT_LANGUAGE_VERSION} from '../data/units/reviewed-assessment-language.js';
import {assessmentPaperHtml} from './assessment-paper.js';
import {BANK} from './units-index.js';
import {bankLabel,examHeading,sourceTableHtml} from './source-presentation.js';
import {questionAtVersion,questionVersion,restoreDailyQuestions,questionMisconceptions} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {gradeDaily} from './daily-grade.js';
import {withThink} from './think-merge.js';
import * as misc from '../data/units/c22-s42-fin.misc.js';
const id='c22-s42-fin-f1-18',q=items.find(q=>q.id===id),prior=questionAtVersion(q,1);

test('the food table question uses primary-school wording and retains its conditions, answer and diagnosis',()=>{
 assert.equal(q.prompt,'다음 먹이 관계표를 보고, 알맞은 설명 두 가지를 고르세요.');
 assert.equal(q.givens['먹이 관계표'].caption,'먹이 관계표');
 assert.deepEqual(q.givens['먹이 관계표'].행,prior.givens['가상 관찰 자료'].행);
 assert.deepEqual(q.givens['먹이 관계표'].머리,prior.givens['가상 관찰 자료'].머리);
 assert.equal(q.choices[1],'매는 토끼와 들쥐를 먹는다.');assert.equal(q.choices[4],'토끼와 들쥐는 모두 풀을 먹는다.');
 for(const key of ['id','status','sourceRef','taxonomy','responseContract','answerContract','evidence'])assert.deepEqual(q[key],prior[key]);
 assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(prior,misc));
 for(const answer of ['',[],[1],[4],[1,4],[4,1],[0,1,4],[0,2]])assert.deepEqual(gradeDaily(q,answer,{misc}),gradeDaily(prior,answer,{misc}));
 assert.equal(gradeDaily(q,[1,4],{misc}).status,'correct');assert.equal(gradeDaily(q,[1],{misc}).status,'wrong');
});

test('existing answers and frozen papers retain the full earlier wording, including unversioned saved answers',()=>{
 assert.equal(questionVersion(q),ASSESSMENT_LANGUAGE_VERSION);assert.equal(prior.prompt,'가상 먹이 관계표에 맞는 설명 두 가지를 고르세요.');assert.equal(prior.choices[4],'풀에서 토끼와 들쥐로 경로가 갈라진다.');
 assert.equal(q.previousVersions.length,1);assert.equal(q.previousVersions[0].snapshotKind,'full-question');
 for(const state of [{answers:{[id]:[1,4]}},{answers:{[id]:[1,4]},questionVersions:{[id]:1}}])assert.deepEqual(restoreDailyQuestions([q],state),[prior]);
 assert.deepEqual(restoreDailyQuestions([q],{}),[q]);const frozen=resolveDailyPaper([q],{paper:snapshotDailyPaper([prior]),answers:{[id]:[1,4]}});assert.equal(frozen.readOnly,true);assert.deepEqual(frozen.questions,[prior]);
 const {contentVersion,...original}=prior,saved=structuredClone(original);assert.deepEqual(reviewedAssessmentItems([original])[0],q);assert.deepEqual(original,saved);assert.equal(reviewedAssessmentItems(items),items);
 for(const patch of [{prompt:'future'},{contentVersion:'future'},{answerContract:{type:'future'}},{evidence:{future:true}}]){const input=[{...original,...patch}];assert.equal(reviewedAssessmentItems(input),input);}
});

test('the actual unit loader and both paper routes use the revised item while student papers hide keys and production notes',async()=>{
 const entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
 const actual=await loaders[unit.id]();assert.deepEqual(actual.items.find(x=>x.id===id),q);
 for(const u of ['c22-s41-fin','c22-s42-mid','c22-s42-fin']){
  const mod=await loaders[u](),ids=mod.items.map(x=>x.id);
  for(const mode of ['student','teacher','answers','quick']){
   const html=mod.bankPaper({...mod,mode});assert.deepEqual([...html.matchAll(/data-paper-item="([^"]+)"/g)].map(m=>m[1]),ids);
   assert(!html.includes('창작 학습 평가'));assert(!html.includes('<caption>가상 관찰 자료</caption>'));
   if(mode==='student'){
    assert(!html.includes('class="a42-key"'));assert(!html.includes('class="f41-key"'));assert(!html.includes('공식 배점표'));assert(!html.includes('지필 응답과 저장'));assert(!html.includes('· 창작'));assert(html.includes('class="sheet-fields"'));assert(html.includes(' · A형</h1>'));assert(html.includes(' · B형</h1>'));
    const pages=html.split('<section class="sheet exam-page"').slice(1);assert.equal(pages.length,mod.items.length/2);
    for(const page of pages)assert.equal((page.split('</footer>')[0].match(/data-paper-item=/g)||[]).length,2);
   }
  }
 }
 const args={unit:unit.id,bank:BANK[unit.id],list:items.filter(x=>x.sourceRef.set===1),form:1},student=assessmentPaperHtml(args),teacher=assessmentPaperHtml({...args,teacher:true});
 assert(student.includes(q.prompt));assert(student.includes('<caption>먹이 관계표</caption>'));assert(!student.includes(q.explanation));assert(teacher.includes(q.explanation));assert(!student.includes('가상 관찰 자료'));assert(!student.includes('가상 기록·모형 값은 실제 측정값과 구별해요.'));assert(!student.includes('직접 작성'));assert(teacher.includes('직접 작성한 학습용 평가'));
 assert.equal(bankLabel(BANK[unit.id]),'기말평가');assert.equal(examHeading(BANK[unit.id],1),'기말평가 · A형');
 // Source content still uses its exact source caption. Only authored exam presentation is simplified.
 assert(sourceTableHtml(prior.givens['가상 관찰 자료']).includes('<caption>가상 관찰 자료</caption>'));
});
