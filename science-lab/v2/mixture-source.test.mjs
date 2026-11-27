import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {source,sourceRegistration} from '../data/units/c22-s52-u01.source.js';
import {items} from '../data/units/c22-s52-u01.js';
import {taxonomy} from '../data/units/c22-s52-u01.taxonomy.js';
import {originalSourceTwin} from './original-source-pairs.js';
import {needsSourceTeacherReview} from './source-content.js';
import {gradeDaily} from './daily-grade.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {withThink} from './think-merge.js';
import {BANK} from './units-index.js';
const unit='c22-s52-u01';
const text=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),start=text.indexOf('const UNITS = ')+14,end=text.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+text.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));

test('혼합물 교재 원문은 실제 쪽·원번호와 다섯 묶음을 보존하고 기존96개에 하나씩 연결된다',()=>{
 assert.equal(source.length,20);assert.equal(items.length,96);assert.equal(sourceRegistration.wholeCurrentEdition,false);assert.equal(sourceRegistration.transport,'static-files');assert.equal(sourceRegistration.loginRequired,false);
 assert.equal(createHash('sha256').update(JSON.stringify(source)).digest('hex'),sourceRegistration.reviewedContentSha256);
 assert.deepEqual([...new Set(source.map(q=>q.sourceRef.page))],[6,7,8,9,18,26,27,28,29]);
 assert.equal(BANK[unit].n,20);assert.equal(BANK[unit].paired,20);assert.equal(BANK[unit].supplement,96);assert(!BANK[unit].sourcePending);assert(BANK[unit].sourceExcerptOnly);assert.deepEqual(BANK[unit].sets,[1,2,3,4,5]);
 const pairs=new Set();
 for(const q of source){
  const pair=originalSourceTwin(q,{items});assert(pair,q.id);assert(!pairs.has(pair.id));pairs.add(pair.id);assert.equal(pair.taxonomy.type,q.taxonomy.type);assert.equal(taxonomy.sources[q.key][0],q.taxonomy.type);
  assert(q.sourceRef.page>0);assert(q.sourceRef.originalNo);assert(q.printedAnswerContract);assert(q.printedExplanation);assert(!/\/Users\/|privatePath/.test(JSON.stringify(q)));
  for(const b of [...q.sourceContextBlocks,...q.sourceMaterialBlocks])if(b.type==='figure')assert(fs.existsSync(new URL('../'+b.src,import.meta.url)));
 }
 assert.equal(pairs.size,20);assert.equal(new Set([...source,...items].map(q=>q.id)).size,116);
});

test('원문 답안은11개 자동·9개 교사 확인이며 잘못된 인쇄 해설과 대안 답을 오답으로 강제하지 않는다',()=>{
 let automatic=0,review=0;const answers={};
 for(const q of source){
  const a=q.answerContract,value=a.type==='single-choice'?a.answer:a.type==='multi-choice'?a.answers:a.sample??a.answer;answers[q.id]=value;
  assert.equal(gradeDaily(q,'').status,'blank');
  const r=gradeDaily(q,value,{judge:{[q.id]:{open:true}}});
  if(needsSourceTeacherReview(q)){assert.equal(r.status,'review',q.id);review++;}else{assert.equal(r.status,'correct',q.id);assert.notEqual(gradeDaily(q,'뜻이 다른 답').status,'correct');automatic++;}
 }
 assert.equal(automatic,11);assert.equal(review,9);
 const sieve=source.find(q=>q.sourceRef.originalNo==='1(1)'),oil=source.find(q=>q.key==='5-2');
 assert(sieve.printedExplanation.includes('작으면 체를 빠져나가고'));assert(sieve.reviewSummary.includes('거꾸로'));
 assert.equal(gradeDaily(oil,4).status,'review');assert.equal(gradeDaily(oil,2).status,'review');
 const snapshot=snapshotDailyPaper(source),restored=resolveDailyPaper(source,{unit,paper:snapshot,answers});
 assert.equal(restored.questions.length,20);assert.deepEqual(restored.questions.map(q=>q.id),source.map(q=>q.id));assert.equal(restored.readOnly,false);
});

test('실제 혼합물 로더의 통합116문항 인쇄는 원문·현재 연습·해설·인쇄 준비를 구별한다',async()=>{
 const mod=await loaders[unit]();assert.equal(mod.source.length,20);const before=JSON.stringify(mod.items);
 for(const mode of ['student','teacher','answers','quick']){
  const html=mod.bankPaper({...mod,mode});
  assert.equal((html.match(/data-paper-item=/g)||[]).length,20);assert(html.includes('source-bank-combined'));assert(html.includes('revised-workbook-print'));assert(html.includes('data-workbook-print disabled'));
  for(const q of source)assert(html.includes('data-paper-item="'+q.id+'"'));
  if(mode==='student'){assert(!html.includes('source-print-key'));assert(!html.includes('class="ans"'));assert(!html.includes('source-review'));assert.equal((html.match(/data-question=/g)||[]).length,96);}
  if(['answers','quick'].includes(mode)){const originals=html.slice(html.indexOf('<main'),html.indexOf('<section class="source-bank-practice">'));assert(!originals.includes('<img'));assert(!originals.includes('source-print-number'));}
 }
 assert.equal(JSON.stringify(mod.items),before);
});
