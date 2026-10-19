import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {source} from '../data/units/c22-s42-u02.source.js';
import {similar} from '../data/units/c22-s42-u02.similar.js';
import {unit,items} from '../data/units/c22-s42-u02.js';
import {taxonomy} from '../data/units/c22-s42-u02.taxonomy.js';
import {judge} from '../data/units/c22-s42-u02.judge.js';
import * as misc from '../data/units/c22-s42-u02.misc.js';
import {gradeDaily,vocabOf} from '../v2/daily-grade.js';
import {judgeShort} from '../v2/judge.js';
import {ecologyBankPaperHtml} from '../v2/ecology-bank-paper.js';
import {BANK,READY,BOOK_UNITS} from '../v2/units-index.js';
import {bankFor2022} from '../v2/curriculum-2022.js';
const all=[...source,...similar,...items],opt={misc,judge,vocab:vocabOf(all,misc)},value=q=>q.answerContract.sample??q.answerContract.answer??q.answerContract.answers;
const read=n=>JSON.parse(readFileSync(new URL('./work/c22s42u02/'+n,import.meta.url)));
test('생물과 환경220은실제70원문과70독립짝·현행80이며기존물단원과분리한다',async()=>{
 assert.equal(all.length,220);assert.equal(new Set(all.map(q=>q.id)).size,220);
 assert.deepEqual([1,2,3,4].map(s=>source.filter(q=>q.sourceRef.set===s).length),[15,15,20,20]);
 for(const q of source){const r=q.sourceRef,raw=read(`set${r.set}.json`).find(o=>o.no===r.no);assert.equal(r.course,'초등 5-2');assert.equal(q.prompt,raw.prompt);assert.equal(r.originalNo,r.no);assert.equal(r.originalSet,r.set);assert.equal(r.page,raw.page);assert.equal(similar.filter(v=>v.sourceRef.of.set===r.set&&v.sourceRef.of.no===r.no).length,1);assert.equal(q.taxonomy.grade,4);}
 assert.equal(bankFor2022('s42-u02',BANK).contentId,unit.id);assert(!READY[unit.id].bankOnly);assert(BANK[unit.id].lesson);assert(BOOK_UNITS.has(unit.id));
 const old=await import('../data/units/s42-u02.js');assert.equal(old.unit.title,'물의 상태 변화');assert.equal(old.unit.id,'s42-u02');
});
test('220응답의정답·빈답·모든오답선택과복수답부분집합을실제채점한다',()=>{
 let correct=0,review=0;
 for(const q of all){const a=q.answerContract,r=gradeDaily(q,value(q),opt);assert.equal(r.status,a.type==='written-explanation'?'review':'correct',q.id);r.status==='correct'?correct++:review++;assert.equal(gradeDaily(q,'',opt).status,'blank',q.id);
  if(q.choices){const ok=[].concat(a.answer??a.answers);for(let i=0;i<q.choices.length;i++)if(!ok.includes(i))assert.equal(gradeDaily(q,a.type==='multi-choice'?[i]:i,opt).status,'wrong',q.id);}
  if(a.type==='multi-choice'){assert.equal(gradeDaily(q,a.answers.slice(0,1),opt).status,'wrong',q.id);assert.equal(gradeDaily(q,[...a.answers].reverse(),opt).status,'correct',q.id);}
  if(a.type==='short-text'){for(const v of a.accepted)assert.equal(gradeDaily(q,v,opt).status,'correct',q.id);assert.notEqual(gradeDaily(q,'확인하지 않은 임의 응답',opt).status,'correct',q.id);assert.notEqual(gradeDaily(q,'아니요 '+a.answer,opt).status,'correct',q.id);}
  if(a.type==='written-explanation'){assert(judge[q.id]?.open,q.id);assert.equal(gradeDaily(q,'근거를 더 찾아야겠습니다.',opt).status,'review',q.id);}
 }
 assert.equal(correct,196);assert.equal(review,24);
});
test('열린설명24와원문2보류는자동통과하지않고인쇄공식답을보존한다',()=>{
 assert.deepEqual(source.filter(q=>q.sourceRef.reviewOnly).map(q=>`${q.sourceRef.set}-${q.sourceRef.no}`),['2-8','4-7']);
 for(const q of source.filter(q=>q.sourceRef.reviewOnly)){assert.equal(q.responseContract,'written-explanation');assert(q.printedAnswerContract);assert(!q.evidence.gates.includes('answer'));assert.equal(gradeDaily(q,String(q.printedAnswerContract.answer),opt).status,'review');assert.match(q.givens['학습 안내'],/자동 정오 판정/);}
 const printed=source.filter(q=>q.answerContract.rubric?.criteria);assert.equal(printed.length,3);assert(printed.every(q=>q.answerContract.rubric.criteria.some(x=>x.includes('100%'))));assert.equal(printed.filter(q=>q.answerContract.rubric.criteria.some(x=>x.includes('50%'))).length,2);
});
test('먹이사슬순서·기호전부선택·오염종류의잘못된접두어를정답으로세지않는다',()=>{
 const chain=source.find(q=>q.id.endsWith('-o4-08'));assert.equal(gradeDaily(chain,'뱀, 개구리, 메뚜기, 벼',opt).status,'review');
 const multi=source.find(q=>q.id.endsWith('-o4-01'));for(const v of ['ㄱ, ㄹ, ㅁ','ㄱ, ㄴ, ㄹ, ㅁ, ㅂ','ㄱ, ㄹ, ㅁ, ㅁ'])assert.notEqual(gradeDaily(multi,v,opt).status,'correct');
 assert.equal(judgeShort('물고기',['물']).st,'no');assert.equal(judgeShort('생태계보전',['생태계']).st,'no');assert.equal(judgeShort('분해자입니다',['분해자']).st,'ok');
});
test('현행80개는성취기준·16유형을고르게다루고원문을그대로재사용하지않는다',()=>{
 const prompts=new Set(source.map(q=>q.prompt));for(const q of [...similar,...items]){assert(!prompts.has(q.prompt));prompts.add(q.prompt);assert(taxonomy.types.some(t=>t.id===q.taxonomy.type));assert(taxonomy.standards.some(s=>s.code===q.taxonomy.standard));}
 for(let i=1;i<=16;i++)assert.equal(items.filter(q=>q.taxonomy.type===`T${String(i).padStart(2,'0')}`).length,5);
 assert.deepEqual(source.find(q=>q.id.endsWith('-o3-11')).givens.표.머리,['조건','ㄱ','ㄴ','ㄷ','ㄹ']);
 assert.deepEqual(source.find(q=>q.id.endsWith('-o3-12')).givens.표.행,[['햇빛','○','○','×','×'],['물','○','×','○','×']]);
 assert.deepEqual(taxonomy.standards.map(s=>s.code),['4과14-01','4과14-02','4과14-03']);
 for(const q of [...source,...similar].filter(q=>['T17','T18','T19'].includes(q.taxonomy.type))){assert.equal(q.curriculumScope,'legacy-extension');assert.match(q.givens['학습 범위'],/옛교재 연계/);}
});
test('원문12동결파일과7그림8참조를보존한다',()=>{
 const freeze=read('source-freeze-20261018.json');assert.equal(freeze.fileCount,12);
 for(const [f,sha]of Object.entries(freeze.sha256))assert.equal(createHash('sha256').update(readFileSync(new URL('./work/c22s42u02/'+f,import.meta.url))).digest('hex'),sha,f);
 const figs=source.filter(q=>q.figure);assert.equal(figs.length,8);assert.equal(new Set(figs.map(q=>q.figure)).size,7);for(const q of figs)assert(existsSync(new URL('../'+q.figure,import.meta.url)));
});
test('인쇄네모드220번호·학생답숨김·교사공식답2와그림을유지한다',()=>{
 for(const mode of ['student','teacher','answers','quick']){const h=ecologyBankPaperHtml({unit,source,similar,items,mode});assert.equal((h.match(/data-paper-item=/g)||[]).length,220);assert(h.includes('원문70'));assert(h.includes('GFIELD · 지필드'));assert(!h.includes('[object Object]'));assert(!h.includes('밤하늘'));
  if(mode==='student'){assert(!h.includes('class="eco-key"'));assert.equal((h.match(/<img /g)||[]).length,8);assert(h.includes('eco-answer-line'));}
  if(mode==='teacher'){assert.equal((h.match(/class="eco-key"/g)||[]).length,220);assert.equal((h.match(/인쇄된 공식 답 참고/g)||[]).length,2);}
  if(mode==='answers'||mode==='quick')assert(!h.includes('<img '));
 }
});
