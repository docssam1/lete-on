import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withThink} from './think-merge.js';
import {workbook} from '../data/book/c22-s52-u01.workbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
import {wireWorkbookPrint} from './workbook-print-ready.js?v=20261106-readable-type';
import {priorMixtureBankPaperHtml,wirePriorMixtureBankPaper} from './mixture-bank-paper.js';
import {chapter as priorChapter,art as priorArt,quickPages as priorQuickPages} from '../data/book/c22-s52-u01.book.js';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8'),start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
const data=await new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}))['c22-s52-u01']();
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('actual mixture bank print uses all current prompts, examples and explanations without changing the bank',()=>{
 const before=JSON.stringify(data.items),student=data.bankPaper({...data,mode:'student'}),teacher=data.bankPaper({...data,mode:'teacher'}),answers=data.bankPaper({...data,mode:'answers'});
 assert.equal(data.items.length,96);
 for(const q of workbook.questions){
  const bank=data.items.find(b=>b.workbookRef?.id===q.id);assert(bank);assert.equal(bank.prompt,q.prompt);
  for(const part of q.prompt.split(/\[\s*\]/).filter(Boolean))assert(student.includes(escape(part)),q.id+' current student prompt');
  for(const html of [teacher,answers]){
   const block=[...html.matchAll(/<section class="ed-solution" data-solution="([^"]+)">[\s\S]*?<\/section>/g)].find(m=>m[1]===q.id)?.[0];
   assert(block,q.id+' current solution');assert(block.includes(escape(q.answer)),q.id+' current sample');assert(block.includes(escape(q.explanation)),q.id+' current explanation');
  }
 }
 assert.equal((student.match(/data-question=/g)||[]).length,96);assert(!/class="ed-key"|class="ed-solution"/.test(student));assert.equal((teacher.match(/class="ed-key"/g)||[]).length,96);assert.equal(JSON.stringify(data.items),before);
 assert.deepEqual(new Set([...student.matchAll(/data-form="([^"]+)"/g)].map(m=>m[1])),new Set(['choice','blank','match','written','multi','short','order','draw']));
});

test('all four mixture print modes share the current workbook renderer, typography and preparation handler',()=>{
 const paper=makeWorkbookPaper(workbook,{}, {route:'print',toolLabel:'혼합물 문항집 고르기'});
 assert.equal(data.wireBankPaper,wireWorkbookPrint);
 for(const mode of ['student','teacher','answers','quick']){
  const html=data.bankPaper({...data,mode});assert.equal(html,paper.workbookPaper({mode}));
  assert(html.includes('revised-workbook-print'));assert(html.includes('data-workbook-print disabled'));assert(html.includes('/print/'+mode));assert(!/AI 실사형 설명 이미지|undefined|\[object Object\]/.test(html));
 }
});

test('the actual mixture route replaces stale bank exports inherited from a cached unit module',async()=>{
 const context=vm.createContext({withThink}),raw=await import('../data/units/c22-s52-u01.js'),stalePrint=()=> 'stale bank paper',staleWire=()=>{};
 const inherited={...raw,bankPaper:stalePrint,wireBankPaper:staleWire};
 const cached=new vm.SyntheticModule(Object.keys(inherited),function(){for(const [key,value]of Object.entries(inherited))this.setExport(key,value);},{context});await cached.link(()=>{});await cached.evaluate();
 const routes=new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:spec=>spec==='../data/units/c22-s52-u01.js'?cached:import(new URL(spec,new URL('./v2.js',import.meta.url)).href)}).runInContext(context);
 const current=await routes['c22-s52-u01']();assert.notEqual(current.bankPaper,stalePrint);assert.notEqual(current.wireBankPaper,staleWire);
 assert.equal(current.wireBankPaper,wireWorkbookPrint);assert(current.bankPaper({...current,mode:'student'}).includes('revised-workbook-print'));
});

test('the prior mixture manuscript and print view remain available without mutating their figures',()=>{
 const before=JSON.stringify({priorChapter,priorArt,priorQuickPages}),currentQuestionIds=workbook.questions.map(q=>q.id);
 assert.equal(typeof wirePriorMixtureBankPaper,'function');
 for(const mode of ['student','teacher','answers','quick']){
  const html=priorMixtureBankPaperHtml({mode});assert(html.includes('mixture-print'));assert(!html.includes('revised-workbook-print'));assert(!html.includes('AI 실사형 설명 이미지'));
 }
 assert.equal(JSON.stringify({priorChapter,priorArt,priorQuickPages}),before);
 assert.deepEqual(workbook.questions.map(q=>q.id),currentQuestionIds);
 const quick=data.bankPaper({...data,mode:'quick'});
 const rows=[...quick.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[\s\S]*?<\/td><td>([\s\S]*?)<\/td><\/tr>/g)];
 assert.equal(rows.length,96);assert.equal(new Set(rows.map(r=>r[1])).size,96);
 for(const row of rows){const q=workbook.questions.find(q=>q.no===Number(row[1]));assert(q);assert.equal(row[2],['written','draw'].includes(q.form)?'교사 확인':escape(q.answer));}
});
