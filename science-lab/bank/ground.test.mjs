import test from 'node:test';
import assert from 'node:assert/strict';
import {source} from '../data/units/s41-u03.source.js';
import {similar} from '../data/units/s41-u03.similar.js';
import {items} from '../data/units/s41-u03.js';
import {taxonomy} from '../data/units/s41-u03.taxonomy.js';
import {judge} from '../data/units/s41-u03.judge.js';
import {judgeText} from '../v2/judge.js';
import {BANK} from '../v2/units-index.js';
import {bankFor2022} from '../v2/curriculum-2022.js';
import {sourceTableHtml} from '../v2/source-presentation.js';
const sup=items.filter(q=>q.sourceRef.type==='authored-supplement');
test('땅의 변화는80원문/80짝·기존18ID를 보존하며 네 기준을 독립 보충한다',()=>{
 assert.equal(source.length,80);assert.equal(similar.length,80);assert.equal(items.length,82);assert.equal(sup.length,64);
 assert.equal(new Set([...source,...similar,...items].map(q=>q.id)).size,242);
 assert.deepEqual(items.slice(0,18).map(q=>q.id),Array.from({length:18},(_,i)=>`s41-u03-b${String(i+1).padStart(2,'0')}`));
 for(const q of [...source,...similar,...items])assert.equal(q.taxonomy.element,taxonomy.types.find(t=>t.id===q.taxonomy.type)?.element,q.id);
 for(let i=1;i<=4;i++)assert.equal(sup.filter(q=>q.taxonomy.standard===`4과11-0${i}`).length,16);
 for(let i=12;i<=19;i++)assert.equal(sup.filter(q=>q.taxonomy.type===`T${i}`).length,8);
 for(const q of source)assert.equal(similar.filter(v=>v.sourceRef.of.set===q.sourceRef.set&&v.sourceRef.of.no===q.sourceRef.no).length,1);
 assert.equal(BANK['s41-u03'].supplement,82);assert(BANK['s41-u03'].lesson);assert.equal(bankFor2022('s41-u03',BANK).contentId,'s41-u03');
});
test('인쇄 단일 기준을 쪼개거나 학교 대처의 타당한 대안을 강제하지 않는다',()=>{
 for(const q of source.filter(q=>q.responseContract==='written-explanation')){
  assert.equal(q.answerContract.rubric.required.length,1);assert.equal(judge[q.id].need.length,1);assert(!JSON.stringify(q.answerContract).includes('100%'));
 }
 const school=judge['s41-u03-o2-20'];
 for(const a of ['책상 아래로 들어가 몸을 보호한다.','흔들림이 멈추면 질서 있게 운동장으로 대피한다.'])assert.equal(judgeText(a,school).st,'ok');
 assert.notEqual(judgeText('흔들리는 동안 계단으로 뛰어 나간다.',school).st,'ok');
 assert.equal(judgeText('마그마가 천천히 식었다.',judge['s41-u03-v014']).st,'ok');
 assert.notEqual(judgeText('마그마가 분출해 만든 지형이 아니다.',judge['s41-u03-o1-6']).st,'ok');
 for(const q of sup.filter(q=>q.responseContract==='written-explanation'))assert.equal(judgeText(q.answerContract.sample,judge[q.id]).st,'review');
});
test('독립 보충의 보기 위치·발문·모형/실천 경계를 확인한다',()=>{
 const pos=[0,0,0,0,0],stems=new Set([...source,...similar,...items.slice(0,18)].map(q=>q.prompt.replace(/\s/g,'')));
 for(const q of sup){assert(!stems.has(q.prompt.replace(/\s/g,'')),q.id);stems.add(q.prompt.replace(/\s/g,''));
  if(q.responseContract==='single-choice'){const a=q.answerContract.answer;pos[a]++;for(const compact of[false,true]){const L=q.choices.map(c=>(compact?c.replace(/\s/g,''):c).length);assert(L[a]<Math.max(...L.filter((_,i)=>i!==a))+3,q.id);}}
 }
 assert.deepEqual(pos,[8,8,8,8,8]);
 assert.equal(sup.filter(q=>q.responseContract==='multi-choice').length,8);assert.equal(sup.filter(q=>q.responseContract==='short-text').length,8);assert.equal(sup.filter(q=>q.responseContract==='written-explanation').length,8);
 for(const q of source.filter(q=>q.taxonomy.type==='T06'))assert.match(q.givens['학습 안내'],/학생이.*따라 하지 않/);
 assert(sup.some(q=>q.taxonomy.standard==='4과11-04'&&q.prompt.includes('실제 연습')));
 for(const id of ['s41-u03-b07','s41-u03-b23','s41-u03-v058']){
  const q=[...items,...similar].find(q=>q.id===id);
  const table=Object.values(q.givens).find(v=>v&&Array.isArray(v.머리));
  assert(table,id);assert.match(table.caption,/가상/,id);
  assert(table.행.length>=2,id);assert(table.행.every(row=>row.length===table.머리.length),id);
  const html=sourceTableHtml(table);assert.match(html,/<th scope="col">/,id);assert.match(html,/<td>/,id);
  assert(!html.includes('undefined'),id);
 }
});
