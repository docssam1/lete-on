import test from 'node:test';
import assert from 'node:assert/strict';
import {items} from '../data/units/s41-u02.js';
import {source} from '../data/units/s41-u02.source.js';
import {similar} from '../data/units/s41-u02.similar.js';
import {taxonomy} from '../data/units/s41-u02.taxonomy.js';
import {judge} from '../data/units/s41-u02.judge.js';
import {judgeText,judgeShort} from '../v2/judge.js';
import {BANK} from '../v2/units-index.js';
const sup=items.filter(q=>q.sourceRef.type==='authored-supplement');
test('물 상태 변화는 기존14의 응답 ID와 원문80·짝80을 보존하고 만들기·시험 범위를 독립 보충한다',()=>{
 assert.equal(source.length,80);assert.equal(similar.length,80);assert.equal(items.length,78);
 assert.deepEqual(items.filter(q=>q.sourceRef.type==='authored-practice').map(q=>q.id),Array.from({length:14},(_,i)=>`s41-u02-b${String(i+1).padStart(2,'0')}`));
 assert.equal(new Set([...source,...similar,...items].map(q=>q.id)).size,238);
 assert.equal(sup.length,64);assert.equal(BANK['s41-u02'].supplement,78);assert(BANK['s41-u02'].lesson);
 for(const q of items)assert.equal(q.taxonomy.element,taxonomy.types.find(t=>t.id===q.taxonomy.type)?.element,q.id);
 assert.match(taxonomy.standards.find(s=>s.code==='4과10-03').text,/설계하고 만들/);
 for(let i=13;i<=20;i++)assert.equal(sup.filter(q=>q.taxonomy.type===`T${i}`).length,8);
 assert.equal(sup.filter(q=>q.taxonomy.standard==='4과10-03').length,32);
});
test('40개 단일 답은 균형 있고 새 문항은 독립 발문·형식·열린 설명 판정을 유지한다',()=>{
 const positions=[0,0,0,0,0],stems=new Set([...source,...similar,...items.filter(q=>!sup.includes(q))].map(q=>q.prompt.replace(/\s/g,'')));
 for(const q of sup){assert(!stems.has(q.prompt.replace(/\s/g,'')),q.id);stems.add(q.prompt.replace(/\s/g,''));const a=q.answerContract;
  if(a.type==='single-choice'){positions[a.answer]++;for(const compact of[false,true]){const sizes=q.choices.map(s=>(compact?s.replace(/\s/g,''):s).length);assert(sizes[a.answer]<Math.max(...sizes.filter((_,i)=>i!==a.answer))+3,q.id);}}
  if(a.type==='short-text'){for(const v of a.accepted)assert.equal(judgeShort(v,a.accepted).st,'ok',q.id);assert.equal(judgeShort('모르겠어요',a.accepted).st,'no',q.id);}
  if(a.type==='written-explanation'){assert(judge[q.id].open);assert.equal(judgeText(a.sample,judge[q.id]).st,'review');assert.equal(judgeText('다른 설계 의견',judge[q.id]).st,'review');}
 }
 assert.deepEqual(positions,[8,8,8,8,8]);
 assert.equal(sup.filter(q=>q.answerContract.type==='multi-choice').length,8);
 assert.equal(sup.filter(q=>q.answerContract.type==='short-text').length,8);
 assert.equal(sup.filter(q=>q.answerContract.type==='written-explanation').length,8);
 for(const id of['s41-u02-b08','s41-u02-b09'])assert(judge[id].open);
});
