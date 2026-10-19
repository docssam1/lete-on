import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {source} from '../data/units/s41-u04.source.js';
import {similar} from '../data/units/s41-u04.similar.js';
import {items,unit} from '../data/units/s41-u04.js';
import {taxonomy} from '../data/units/s41-u04.taxonomy.js';
import {judge} from '../data/units/s41-u04.judge.js';
import * as misc from '../data/units/s41-u04.misc.js';
import {gradeDaily,summarize,vocabOf} from '../v2/daily-grade.js';
import {judgeText} from '../v2/judge.js';
import {BANK,READY,BOOK_UNITS} from '../v2/units-index.js';
import {bankFor2022} from '../v2/curriculum-2022.js';
const all=[...source,...similar,...items],vocab=vocabOf(all,misc);
const value=q=>q.answerContract.sample??q.answerContract.answer??q.answerContract.answers;
test('현행 생물은행214개는 옛5-1 원문75의 실제 분량·출처와 기존 효모빵 ID를 구별한다',async()=>{
 assert.equal(unit.course,'4-1');assert.equal(unit.id,'s41-u04');assert.deepEqual([1,2,3,4].map(n=>source.filter(q=>q.sourceRef.set===n).length),[10,20,20,25]);assert.equal(similar.length,75);assert.equal(items.length,64);assert.equal(new Set(all.map(q=>q.id)).size,214);
 for(const q of source){assert.equal(q.sourceRef.course,'초등 5-1');assert.equal(q.taxonomy.grade,4);assert.equal(q.taxonomy.semester,1);assert(q.sourceRef.page>0);assert.equal(similar.filter(v=>v.sourceRef.of.set===q.sourceRef.set&&v.sourceRef.of.no===q.sourceRef.no&&v.taxonomy.type===q.taxonomy.type).length,1);}
 assert.equal(BANK['s41-u04'].n,75);assert.equal(BANK['s41-u04'].reviewOnly,7);assert(!READY['s41-u04'].bankOnly);assert(BANK['s41-u04'].lesson);assert(BOOK_UNITS.has('s41-u04'));assert(BANK['s41-u04'].lesson);assert.equal(bankFor2022('s41-u04',BANK).contentId,'s41-u04');
 const old=await import('../data/units/s51-u05.js');assert.equal(old.unit.id,'s51-u05');assert.equal(old.items.length,12);
});
test('전214개 계약의 실제 정답·빈답·복수 일부·역순·임의 문자열과 교사 확인을 검증한다',()=>{
 let correct=0,review=0;
 for(const q of all){const ac=q.answerContract,r=gradeDaily(q,value(q),{misc,judge,vocab});assert.equal(r.status,ac.type==='written-explanation'?'review':'correct',q.id);r.status==='review'?review++:correct++;assert.equal(gradeDaily(q,'',{misc,judge,vocab}).status,'blank',q.id);
  if(ac.type==='single-choice')for(let i=0;i<q.choices.length;i++)if(i!==ac.answer)assert.equal(gradeDaily(q,i,{misc,judge,vocab}).status,'wrong',q.id);
  if(ac.type==='multi-choice'){assert.equal(gradeDaily(q,ac.answers.slice(0,1),{misc,judge,vocab}).status,'wrong',q.id);assert.equal(gradeDaily(q,[...ac.answers].reverse(),{misc,judge,vocab}).status,'correct',q.id);}
  if(ac.type==='short-text')assert.notEqual(gradeDaily(q,'자료에 없는 임의의 답',{misc,judge,vocab}).status,'correct',q.id);
  if(ac.type==='written-explanation')for(const s of [ac.sample,'아직 확인하지 못했습니다.','곰팡이를 먹으면 모든 병이 낫는다.'])assert.equal(judgeText(s,judge[q.id]).st,'review',q.id);
 }
 assert.equal(correct,187);assert.equal(review,27);
});
test('충돌하는 공식 답7개와 인쇄 서술 배점6개는 교사 검토이며 원전사는 보존한다',()=>{
 const keys=['1-7','1-8','2-12','3-15','3-20','4-11','4-12'];
 assert.deepEqual(source.filter(q=>q.sourceRef.reviewOnly).map(q=>`${q.sourceRef.set}-${q.sourceRef.no}`),keys);
 const raw=[1,2,3,4].flatMap(s=>JSON.parse(readFileSync(new URL(`./work/s41u04/set${s}.json`,import.meta.url),'utf8')).map(q=>({...q,s})));
 assert.equal(raw.filter(q=>q.format==='서술형').length,6);
 for(const q of source){const r=raw.find(r=>r.s===q.sourceRef.set&&r.no===q.sourceRef.no);assert.equal(q.prompt,r.prompt);if(q.sourceRef.reviewOnly){assert(q.printedAnswerContract);assert(!q.evidence.gates.includes('answer'));assert.match(q.givens['학습 안내'],/자동 채점하지 않/);assert.equal(q.responseContract,'written-explanation');}}
 for(const r of raw.filter(q=>q.format==='서술형')){const q=source.find(q=>q.sourceRef.set===r.s&&q.sourceRef.no===r.no);assert(q.answerContract.rubric.criteria.some(x=>x.includes('100%')));assert(q.answerContract.rubric.criteria.some(x=>x.includes('50%')));assert(judge[q.id].open);}
 assert.match(source.find(q=>q.id==='s41-u04-o2-20').explanation,/항생제 치료와 백신 예방/);
});
test('분류·근거·오개념은 전214개와 독립64·8유형에 연결되고 정답 위치를 균등히 둔다',()=>{
 for(const q of all){assert(taxonomy.types.some(t=>t.id===q.taxonomy.type&&t.element===q.taxonomy.element),q.id);assert(q.taxonomy.inquirySkill,q.id);assert(taxonomy.standards.some(s=>s.code===q.taxonomy.standard),q.id);assert(q.explanation.length>20,q.id);if(q.choices){const ok=[].concat(q.answerContract.answer??q.answerContract.answers);for(let i=0;i<q.choices.length;i++)if(!ok.includes(i))assert(misc.misconceptions[misc.distractors[q.id]?.[i]],q.id);else assert(!misc.distractors[q.id]?.[i],q.id);}}
 for(let i=13;i<=20;i++)assert.equal(items.filter(q=>q.taxonomy.type===`T${i}`).length,8);
 for(const qs of [similar,items]){const pos=[0,0,0,0,0];for(const q of qs.filter(q=>q.responseContract==='single-choice')){const a=q.answerContract.answer;pos[a]++;for(const trim of[false,true]){const L=q.choices.map(c=>(trim?c.replace(/\s/g,''):c).length);assert(L[a]<Math.max(...L.filter((_,i)=>i!==a))+3,q.id);}}assert(Math.max(...pos)-Math.min(...pos)<=2);}
 assert.equal(items.filter(q=>q.responseContract==='written-explanation').length,8);
 for(const q of items)assert.equal(q.sourceRef.type,'authored-supplement');
  // 원문의 반복 발문은 인쇄대로 두고 창작 발문은 따로 검사한다.
 assert.equal(new Set([...similar,...items].map(q=>q.prompt.replace(/\s/g,''))).size,139);
});
