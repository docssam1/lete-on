import test from 'node:test';import assert from 'node:assert/strict';import {existsSync,readFileSync}from'node:fs';
import{items,unit}from'../data/units/c22-s32-u02.js';import{similar}from'../data/units/c22-s32-u02.similar.js';import{taxonomy}from'../data/units/c22-s32-u02.taxonomy.js';import{judge}from'../data/units/c22-s32-u02.judge.js';import * as misc from'../data/units/c22-s32-u02.misc.js';import{gradeDaily,vocabOf}from'../v2/daily-grade.js';import{contentUnitOfItem}from'../v2/content-unit.js';
const count=fn=>items.reduce((o,q)=>(o[fn(q)]=(o[fn(q)]||0)+1,o),{});
test('현재 지구와 바다의 세 기준을 창작80개로 구분하고 없는 원문·짝을 만들지 않는다',()=>{
 assert.equal(unit.id,'c22-s32-u02');assert.equal(items.length,80);assert.equal(new Set(items.map(q=>q.id)).size,80);assert.equal(similar.length,0);assert.equal(unit.sources.originalExamAvailable,false);assert(!existsSync(new URL('../data/units/c22-s32-u02.source.js',import.meta.url)));assert.deepEqual(taxonomy.sources,{});assert.deepEqual(count(q=>q.taxonomy.standard),{'4과06-01':24,'4과06-02':24,'4과06-03':32});assert(Object.values(count(q=>q.taxonomy.type)).every(n=>n===8));assert.equal(taxonomy.types.length,10);
 for(const q of items){assert.equal(contentUnitOfItem(q.id),unit.id);assert.equal(q.sourceRef.type,'authored-supplement');assert(!q.sourceRef.of);assert.equal(q.status,'authored');assert(!/침식|퇴적|운반 작용|조석|인력|퍼센트|%/.test(q.prompt+' '+JSON.stringify(q.givens)));}
 const publicTax=JSON.parse(readFileSync(new URL('./taxonomy/c22-s32-u02.json',import.meta.url)));assert.equal(publicTax.authoredTotal,80);assert.equal(publicTax.sourceTotal,0);
});
test('보기 위치는50개를10개씩 균형 있게 배치하고70개 자료 응답과10개 열린 설명을 판정한다',()=>{
 const pos=Array(5).fill(0),vocab=vocabOf(items,misc);let correct=0,review=0;
 for(const q of items){const ac=q.answerContract,r=gradeDaily(q,ac.answers||ac.sample||ac.answer,{misc,judge,vocab});if(ac.type==='written-explanation'){assert.equal(r.status,'review',q.id);assert(judge[q.id].open);review++;}else{assert.equal(r.status,'correct',q.id);correct++;}if(ac.type==='single-choice'){pos[ac.answer]++;for(const spaces of[true,false]){const n=q.choices.map(s=>(spaces?s:s.replace(/\s/g,'')).length);assert(n[ac.answer]<Math.max(...n.filter((_,i)=>i!==ac.answer))+3,q.id);}}if(ac.type==='multi-choice'){assert.equal(ac.answers.length,2);assert.equal(new Set(ac.answers).size,2);assert.equal(gradeDaily(q,[ac.answers[0]],{misc,judge,vocab}).status,'wrong');}}
 assert.deepEqual(pos,[10,10,10,10,10]);assert.equal(correct,70);assert.equal(review,10);
});
