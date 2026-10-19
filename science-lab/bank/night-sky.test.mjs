import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {source} from '../data/units/c22-s42-u01.source.js';
import {similar} from '../data/units/c22-s42-u01.similar.js';
import {unit,items} from '../data/units/c22-s42-u01.js';
import {taxonomy} from '../data/units/c22-s42-u01.taxonomy.js';
import {judge} from '../data/units/c22-s42-u01.judge.js';
import * as misc from '../data/units/c22-s42-u01.misc.js';
import {gradeDaily,vocabOf} from '../v2/daily-grade.js';
import {skyBankPaperHtml} from '../v2/sky-bank-paper.js';
import {teacherKeyHtml} from '../v2/daily.js';
import {BANK,READY,BOOK_UNITS} from '../v2/units-index.js';
import {bankFor2022} from '../v2/curriculum-2022.js';
const all=[...source,...similar,...items],opt={misc,judge,vocab:vocabOf(all,misc)},value=q=>q.answerContract.sample??q.answerContract.answer??q.answerContract.answers;
test('밤하늘270은8묶음의 실제 출처95와 독립짝95·보충80이며 기존 식물 ID를 보존한다',async()=>{
 assert.equal(all.length,270);assert.equal(new Set(all.map(q=>q.id)).size,270);assert.equal(items.length,80);assert.equal(similar.length,95);
 assert.deepEqual([1,2,3,4,5,6,7,8].map(s=>source.filter(q=>q.sourceRef.set===s).length),[10,20,20,25,3,5,5,7]);
 for(const q of source){const r=q.sourceRef;assert.equal(r.course,r.set<=4?'초등 5-1':'초등 6-1');assert.equal(r.originalSet,r.set<=4?r.set:r.set-4);assert.equal(r.originalNo,r.no);const raw=JSON.parse(readFileSync(new URL(`./work/c22s42u01/${r.set<=4?'solar':'moon'}-set${r.originalSet}.json`,import.meta.url)));assert.equal(q.prompt,raw.find(o=>o.no===r.no).prompt);assert.equal(similar.filter(p=>p.sourceRef.of.set===r.set&&p.sourceRef.of.no===r.no).length,1);assert.equal(q.taxonomy.grade,4);assert.equal(q.taxonomy.semester,2);}
 assert.equal(bankFor2022('s42-u01',BANK).contentId,unit.id);assert(!READY[unit.id].bankOnly);assert(BOOK_UNITS.has(unit.id));assert(BANK[unit.id].lesson);
 const legacy=await import('../data/units/s42-u01.js');assert.equal(legacy.unit.title,'식물의 생활');assert.equal(legacy.unit.id,'s42-u01');
});
test('전체270의 실제 채점·빈답·복수 답 부분집합과 열린 서술29개를 확인한다',()=>{
 let correct=0,review=0;
 for(const q of all){const a=q.answerContract,r=gradeDaily(q,value(q),opt);assert.equal(r.status,a.type==='written-explanation'?'review':'correct',q.id);r.status==='correct'?correct++:review++;assert.equal(gradeDaily(q,'',opt).status,'blank',q.id);
  if(q.choices){const ok=[].concat(a.answer??a.answers);for(let i=0;i<q.choices.length;i++)if(!ok.includes(i))assert.equal(gradeDaily(q,a.type==='multi-choice'?[i]:i,opt).status,'wrong',q.id);}
  if(a.type==='multi-choice'){assert.equal(gradeDaily(q,a.answers.slice(0,1),opt).status,'wrong',q.id);assert.equal(gradeDaily(q,[...a.answers].reverse(),opt).status,'correct',q.id);}
  if(a.type==='short-text')assert.notEqual(gradeDaily(q,'아직 확인하지 못한 임의 답',opt).status,'correct',q.id);
  if(a.type==='written-explanation')assert(judge[q.id].open,q.id);
 }
 assert.equal(correct,241);assert.equal(review,29);
});
test('원문5개 보류·서술4개 인쇄 배점·연계확장과 현행 필수를 분리한다',()=>{
 assert.deepEqual(source.filter(q=>q.sourceRef.reviewOnly).map(q=>`${q.sourceRef.set}-${q.sourceRef.no}`),['2-18','4-15','6-20','7-17','7-18']);
 for(const q of source.filter(q=>q.sourceRef.reviewOnly)){assert(q.printedAnswerContract);assert.equal(q.responseContract,'written-explanation');assert(!q.evidence.gates.includes('answer'));assert.match(q.givens['학습 안내'],/자동 정오 판정/);}
 const printed=source.filter(q=>q.answerContract.rubric?.criteria);assert.equal(printed.length,4);for(const q of printed){assert(q.answerContract.rubric.criteria.some(c=>c.includes('100%')));assert(q.answerContract.rubric.criteria.some(c=>c.includes('50%')));}
 for(const q of [...source,...similar]){assert(taxonomy.types.some(t=>t.id===q.taxonomy.type));assert(taxonomy.standards.some(s=>s.code===q.taxonomy.standard));if(['T17','T18','T19','T20'].includes(q.taxonomy.type)){assert.equal(q.curriculumScope,'legacy-extension');assert.match(q.givens['학습 범위'],/필수 수치 암기/);}}
});
test('문항집4모드270번호와 학생 답 분리·그림38참조·보류5의 공식 답 참고를 유지한다',()=>{
 for(const mode of ['student','teacher','answers','quick']){const h=skyBankPaperHtml({unit,source,similar,items,mode});assert.equal((h.match(/data-paper-item=/g)||[]).length,270);assert(h.includes('GFIELD · 지필드'));assert(!h.includes('[object Object]'));assert(!h.includes('[원문 달 사진'));if(mode==='student'){assert(!h.includes('class="sky-key"'));assert.equal((h.match(/<img /g)||[]).length,38);assert(h.includes('sky-answer-line'));}if(mode==='teacher'){assert.equal((h.match(/class="sky-key"/g)||[]).length,270);assert.equal((h.match(/인쇄된 공식 답 참고/g)||[]).length,5);}if(mode==='quick')assert(!h.includes('<img '));}
 const h=teacherKeyHtml({u:unit.id,ch:{title:unit.title},list:source,misc});assert.equal((h.match(/dt-printed-key/g)||[]).length,5);assert.equal((h.match(/<span>검토 요지<\/span>/g)||[]).length,5);
});
