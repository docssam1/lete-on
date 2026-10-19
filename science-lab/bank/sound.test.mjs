import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {items,unit} from '../data/units/c22-s32-u03.js';import {source} from '../data/units/c22-s32-u03.source.js';import {similar} from '../data/units/c22-s32-u03.similar.js';import {source as oldSource} from '../data/units/s32-u05.source.js';import {similar as oldSimilar} from '../data/units/s32-u05.similar.js';import {taxonomy} from '../data/units/c22-s32-u03.taxonomy.js';import {judge} from '../data/units/c22-s32-u03.judge.js';import * as misc from '../data/units/c22-s32-u03.misc.js';import {gradeDaily,vocabOf} from '../v2/daily-grade.js';import {judgeShort} from '../v2/judge.js';import {sourceGivensFor} from '../../scripts/bank-science-lib.mjs';
test('현재 단원은 옛70개 원문·짝의 객체와 번호를 그대로 참조하고64개 보충과 구별한다',()=>{
 assert.equal(unit.id,'c22-s32-u03');assert.equal(unit.no,3);assert.strictEqual(source,oldSource);assert.strictEqual(similar,oldSimilar);assert.equal(source.length,70);assert.equal(similar.length,70);assert.equal(items.length,64);assert.equal(new Set([...source,...similar,...items].map(q=>q.id)).size,204);assert.equal(taxonomy.standards.length,3);
 for(const q of source){const ref=q.sourceRef;assert(q.id.startsWith('s32-u05-o'));assert.equal(ref.unit,'Ⅴ. 소리의 성질');const raw=JSON.parse(readFileSync(new URL(`./work/s32u05/set${ref.set}.json`,import.meta.url)))[ref.no-1];assert.equal(q.prompt,raw.prompt);if(q.choices){const indices=[...raw.answer].filter(c=>'①②③④⑤'.includes(c)).map(c=>'①②③④⑤'.indexOf(c));assert.deepEqual(q.answerContract.answers||[q.answerContract.answer],indices,q.id);}else assert.equal(q.answerContract.answer,raw.answer,q.id);}
 for(const q of source)assert.equal(similar.filter(s=>s.sourceRef.of.set===q.sourceRef.set&&s.sourceRef.of.no===q.sourceRef.no).length,1);
});
test('원문 그림 설명은 인쇄 보기로 추가하지 않고 원문 해설과 검토 설명을 구별한다',()=>{
 for(const id of['s32-u05-o1-11','s32-u05-o4-15']){const q=source.find(q=>q.id===id);assert.equal(q.givens,null);assert(q.figure);}
 assert.match(source.find(q=>q.id==='s32-u05-o1-15').explanation,/\[자료 검토\]/);assert.match(source.find(q=>q.id==='s32-u05-o1-15').explanation,/큰 물체를 바닥으로 떨어뜨려/);
 const o={set:1,no:2,givens:{보기:['인쇄 보기']}};assert.deepEqual(sourceGivensFor(o,{}),o.givens);assert.equal(sourceGivensFor(o,{sourceGivensOverrides:{'1-2':null}}),null);
});
test('204개 응답을 형식별로 판정하며 열린 설명·순서·복수 선택의 계약을 지킨다',()=>{
 const all=[...source,...similar,...items],vocab=vocabOf(all,misc);let correct=0,review=0;
 for(const q of all){const ac=q.answerContract,r=gradeDaily(q,ac.answers||ac.sample||ac.answer,{misc,judge,vocab});if(ac.type==='written-explanation'){assert.equal(r.status,'review',q.id);assert(judge[q.id].open);review++;}else{assert.equal(r.status,'correct',q.id);correct++;}if(ac.type==='multi-choice')assert.equal(gradeDaily(q,[ac.answers[0]],{misc,judge,vocab}).status,'wrong',q.id);}
 assert.equal(correct,196);assert.equal(review,8);const seq=source.find(q=>q.id==='s32-u05-o2-11');assert.equal(judgeShort('ㄹ ㄷ ㄱ ㄴ',seq.answerContract.accepted).st,'no');for(const id of['s32-u05-o3-09','s32-u05-o3-12'])assert.equal(judgeShort('ㄱ',source.find(q=>q.id===id).answerContract.accepted).st,'no');
 const pos=Array(5).fill(0);for(const q of items.filter(q=>q.answerContract.type==='single-choice')){const a=q.answerContract.answer;pos[a]++;for(const trim of[false,true]){const n=q.choices.map(s=>(trim?s.replace(/\s/g,''):s).length);assert(n[a]<Math.max(...n.filter((_,i)=>i!==a))+3,q.id);}}assert.deepEqual(pos,[8,8,8,8,8]);
});
