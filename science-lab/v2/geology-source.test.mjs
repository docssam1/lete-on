import{standaloneQuestionContexts}from'../data/book/standalone-question-context.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {source,sourceRegistration} from '../data/units/c22-s51-u01.source.js';
import {items} from '../data/units/c22-s51-u01.js';
import {taxonomy} from '../data/units/c22-s51-u01.taxonomy.js';
import {originalSourceTwin} from './original-source-pairs.js';
import {needsSourceTeacherReview} from './source-content.js';
import {gradeDaily} from './daily-grade.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {wireSourceBankPrint} from './source-bank-paper.js?v=20261115-geology-source';
import {geologyCurrentItems} from '../data/book/geology-student-language.js';
import {geologyReadableCurrentItems} from '../data/book/c22-s51-u01.editorial.js';
import {withThink} from './think-merge.js';
import {BANK} from './units-index.js';
const unit='c22-s51-u01';
const text=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),start=text.indexOf('const UNITS = ')+14,end=text.indexOf('\n// 문제은행만',start);
const loaders=new vm.Script('('+text.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
test('지층과 화석17원문은 출처의 쪽·부분문항과 기존96개 중 독립17짝을 보존한다',()=>{
 assert.equal(source.length,17);assert.equal(items.length,96);assert.equal(sourceRegistration.wholeCurrentEdition,false);assert.equal(sourceRegistration.transport,'static-files');assert.equal(sourceRegistration.loginRequired,false);
 assert.equal(createHash('sha256').update(JSON.stringify(source)).digest('hex'),sourceRegistration.reviewedContentSha256);
 assert.deepEqual([...new Set(source.map(q=>q.sourceRef.page))],[26,27,28,29,30,33]);assert.deepEqual(BANK[unit].sets,[1,2,3,4]);assert.equal(BANK[unit].n,17);assert.equal(BANK[unit].supplement,96);assert(BANK[unit].sourceExcerptOnly&&BANK[unit].pairsInPractice);assert(!BANK[unit].sourcePending);
 const pairs=new Set(),figures=new Set();
 for(const q of source){const pair=originalSourceTwin(q,{items});assert(pair,q.id);assert(!pairs.has(pair.id));pairs.add(pair.id);assert.equal(pair.taxonomy.type,q.taxonomy.type);assert.equal(taxonomy.sources[q.key][0],q.taxonomy.type);assert(q.sourceRef.originalNo);assert(q.printedAnswerContract);assert(q.printedExplanation);assert(!/\/Users\/|privatePath/.test(JSON.stringify(q)));
  for(const b of [...q.sourceContextBlocks,...q.sourceMaterialBlocks])if(b.type==='figure'){assert(fs.existsSync(new URL('../'+b.src,import.meta.url)));figures.add(b.src);}
 }
 assert.equal(pairs.size,17);assert.equal(figures.size,10);assert.equal(new Set([...source,...items].map(q=>q.id)).size,113);
});
test('5자동·12교사 확인은 인쇄 답과 추가 근거가 필요한 판단을 구별하고 과거 시험지를 보존한다',()=>{
 let automatic=0,review=0;const answers={};
 for(const q of source){const a=q.answerContract,value=a.type==='single-choice'?a.answer:a.type==='multi-choice'?a.answers:a.sample??a.answer;answers[q.id]=value;assert.equal(gradeDaily(q,'').status,'blank');const r=gradeDaily(q,value,{judge:{[q.id]:{open:true}}});if(needsSourceTeacherReview(q)){assert.equal(r.status,'review',q.id);review++;}else{assert.equal(r.status,'correct',q.id);assert.notEqual(gradeDaily(q,'다른 답').status,'correct');automatic++;}}
 assert.equal(automatic,5);assert.equal(review,12);
 const sea=source.find(q=>q.key==='1-9'),food=source.find(q=>q.key==='1-10');assert.equal(sea.printedAnswerContract.answer,1);assert.equal(gradeDaily(sea,0).status,'review');assert.equal(gradeDaily(sea,1).status,'review');assert.deepEqual(food.printedAnswerContract.answers,[0,2]);assert.equal(gradeDaily(food,[0,2,4]).status,'review');assert(food.reviewSummary.includes('⑤'));
 const snapshot=snapshotDailyPaper(source),changed=structuredClone(source);changed[0].prompt+=' revised';const restored=resolveDailyPaper(changed,{paper:snapshot,answers});assert.equal(restored.readOnly,true);assert.equal(restored.questions[0].prompt,source[0].prompt);assert.deepEqual(restored.questions.map(q=>q.id),source.map(q=>q.id));
});
test('실제113문항집은 현재 쉬운 표현을 유지하고 학생·교사·해설만·빠른표와 인쇄 도구를 구별한다',async()=>{
 const mod=await loaders[unit](),current=standaloneQuestionContexts(geologyReadableCurrentItems(geologyCurrentItems(items),unit),unit),before=JSON.stringify(mod.items);assert.deepEqual(mod.items,current);assert.equal(mod.source.length,17);assert.equal(mod.wireBankPaper,wireSourceBankPrint);
 for(const mode of ['student','teacher','answers','quick']){const html=mod.bankPaper({...mod,mode});assert.equal((html.match(/data-paper-item=/g)||[]).length,113);assert.equal((html.match(/data-workbook-print/g)||[]).length,1);assert(html.includes('data-workbook-print disabled'));assert(html.includes('data-paper-unit="'+unit+'"'));assert(!html.includes('data-geo-print'));assert(!html.includes('원문이 없어'));assert(html.includes('원문 17개'));
  if(mode==='student'){assert(!html.includes('source-print-key'));assert(!html.includes('geo-key'));assert(!html.includes('source-review'));assert(!html.includes('class="ans"'));assert(!html.includes('loading="lazy"'));assert(html.includes('loading="eager"'));}
  if(['answers','quick'].includes(mode)){const originals=html.slice(html.indexOf('<main'),html.indexOf('<section class="source-bank-practice">'));assert(!originals.includes('<img'));assert(!originals.includes('source-print-number'));assert(!html.includes('<img'));}
 }
 assert.equal(JSON.stringify(mod.items),before);
});
test('지층 통합 문항집은 새 상단 인쇄 버튼에 모든 그림·본문/손글씨/명조 글꼴 준비를 연결한다',async()=>{
 const mod=await loaders[unit]();let clicked=0;const events={},fonts=[],button={disabled:false,addEventListener(k,f){events[k]=f;},removeEventListener(k){delete events[k];}},status={textContent:''},images=[{complete:true,naturalWidth:200}];
 const previous={document:globalThis.document,window:globalThis.window,scrollTo:globalThis.scrollTo};globalThis.document={fonts:{load:async f=>{fonts.push(f);return[{}];},ready:Promise.resolve()}};globalThis.window={print(){clicked++;}};globalThis.scrollTo=()=>{};
 const root={dataset:{},isConnected:true,querySelector(s){return s==='[data-workbook-print]'?button:s==='[data-workbook-status]'?status:s==='[data-paper-unit]'?{dataset:{paperUnit:unit}}:null;},querySelectorAll(s){return s==='img'?images:[];}};
 try{const release=mod.wireBankPaper(root);assert(button.disabled);await new Promise(r=>setImmediate(r));assert.equal(button.disabled,false);assert(fonts.some(f=>f.includes('Noto Serif KR')));assert(fonts.some(f=>f.includes('Pretendard')));assert(fonts.some(f=>f.includes('Gaegu')));events.click();assert.equal(clicked,1);release();assert(!events.click);}finally{for(const[k,v]of Object.entries(previous))if(v===undefined)delete globalThis[k];else globalThis[k]=v;}
});
