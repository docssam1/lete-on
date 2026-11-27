import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink} from './think-merge.js';
import {gradeDaily} from './daily-grade.js';
import {bankPromptHtml} from './bank-response-print.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),daily=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8'),start=code.indexOf('const UNITS = ')+14,end=code.indexOf('\n// 문제은행만',start),loaders=new vm.Script('('+code.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const mod=await loaders['c22-s42-u04'](),q=mod.items.find(q=>q.id==='c22-s42-u04-t03'),escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),circles=['①','②','③','④','⑤'];
const ctx=vm.createContext({esc:escape,CIRC:circles}),blanks=new vm.Script(code.slice(code.indexOf('function blanksHtml('),code.indexOf('// 낱말 칩 순서'))+';blanksHtml').runInContext(ctx),prompt=new vm.Script(daily.slice(daily.indexOf('function promptHtml('),daily.indexOf('const figHtml ='))+';promptHtml').runInContext(ctx);
const indices=html=>[...html.matchAll(/data-k="(\d+)"/g)].map(m=>Number(m[1]));

test('the real repeated ① question points to two answers in learning, Daily and printed teacher and student views',()=>{
 const before=structuredClone(q);assert.deepEqual(q.answerContract.blanks.map(b=>b.answer),['해수면','낮은']);
 assert.deepEqual(indices(blanks(q.prompt,q.answerContract.blanks,{print:false,show:false})),[0,0,1]);
 const teacher=blanks(q.prompt,q.answerContract.blanks,{print:true,show:true});assert.deepEqual([...teacher.matchAll(/class="blank-print ans">([^<]*)/g)].map(m=>m[1]),['해수면','해수면','낮은']);
 for(const value of[null,['해수면','낮은']]){const html=prompt(q,value,mod.misc);assert.deepEqual(indices(html),[0,0,1]);if(value)assert.equal((html.match(/(?:value="해수면"| selected>해수면)/g)||[]).length,2);}
 for(const mode of['student','teacher']){const html=mod.bankPaper({...mod,items:[q],source:[],similar:[],mode});assert.deepEqual([...html.matchAll(/data-bank-blank="(\d+)"/g)].map(m=>Number(m[1])),[0,0,1]);if(mode==='teacher')assert.deepEqual([...html.matchAll(/data-bank-blank="\d+">([^<]*)/g)].map(m=>m[1]),['해수면','해수면','낮은']);else assert(!html.includes('bank-print-answer'));}
 assert.equal(bankPromptHtml('( ③ )',q.answerContract,{show:true}),'( ③ )');
 assert.equal(gradeDaily(q,['해수면','낮은']).status,'correct');assert.deepEqual(q,before);
 const version='20261115-question-part-lines';assert(code.includes('climate-bank-paper.js?v='+version));assert(fs.readFileSync(new URL('./climate-bank-paper.js',import.meta.url),'utf8').includes('bank-response-print.js?v='+version));
});

test('actual Daily input listeners mirror repeated references, keep only declared slots for new answers and preserve existing extra entries',()=>{
 const line=daily.split('\n').find(line=>line.includes("$q.querySelectorAll('.dt-blank').forEach"));assert(line);
 for(const legacy of[[],['처음 답','두 번째 답','이전 세 번째 기록']]){
  const controls=[0,0,1].map((k,i)=>({dataset:{k:String(k)},tagName:i===0?'INPUT':'SELECT',value:'',events:{},addEventListener(type,fn){this.events[type]=fn;}})),state={answers:{[q.id]:[...legacy]},other:'keep'},calls=[];
  const host={querySelectorAll(selector){return selector==='.dt-blank'?controls:controls.filter(el=>el.dataset.k===selector.match(/data-k="(\d+)"/)[1]);}};
  const context=vm.createContext({$q:host,it:q,S:state,active:true,locked:false,set:value=>{state.answers[q.id]=value;calls.push(value);}});new vm.Script(line).runInContext(context);
  controls[0].value='해수면';controls[0].events.input();assert.equal(controls[1].value,'해수면');assert.equal(state.answers[q.id][0],'해수면');
  controls[2].value='낮은';controls[2].events.change();assert.deepEqual(Array.from(state.answers[q.id]).slice(0,2),['해수면','낮은']);assert.equal(state.answers[q.id].length,legacy.length||2);if(legacy.length)assert.equal(state.answers[q.id][2],legacy[2]);assert.equal(state.other,'keep');
  const count=calls.length;context.locked=true;controls[0].value='수정 시도';controls[0].events.input();assert.equal(calls.length,count);assert.equal(controls[1].value,'해수면');
 }
});

test('real chip and reveal listeners update both copies of a blank without counting the repeated number as a third answer',()=>{
 const source=code.slice(code.indexOf('function wireItem('),code.indexOf('// ── 화면 뼈대'));
 const element=dataset=>({dataset,events:{},textContent:'',innerHTML:'',classList:{values:new Set(),add(...values){values.forEach(v=>this.values.add(v));},contains(v){return this.values.has(v);}},addEventListener(type,fn){this.events[type]=fn;}});
 for(const chips of[false,true]){
  const blanks=[0,0,1].map(k=>element({k:String(k)})),why={},rows=[0,1].map(k=>{const row=element({k:String(k)}),chip=element({v:q.answerContract.blanks[k].answer});row.querySelectorAll=()=>[chip];row.chip=chip;return row;}),done=[];
  const card={dataset:{},querySelector:s=>s==='.why'?why:null,querySelectorAll:s=>s==='.chip-row'?chips?rows:[]:s==='.blank'?blanks:blanks.filter(b=>b.dataset.k===s.match(/data-k="(\d+)"/)?.[1])};
  const context=vm.createContext({MISC:chips?{cloze:{[q.id]:{options:[['해수면'],['낮은']],wrong:[]}}}:null,wireSourceTeacherReview:()=>false,esc:escape,whyHtml:()=>'',CSS:{escape:String}}),wire=new vm.Script(source+';wireItem').runInContext(context);wire(card,q,(...args)=>done.push(args));
  if(chips){rows[0].chip.events.click();assert(blanks.slice(0,2).every(b=>b.innerHTML==='해수면'));rows[1].chip.events.click();}
  else{blanks[1].events.click();assert(blanks.slice(0,2).every(b=>b.textContent==='해수면'));blanks[2].events.click();}
  assert.equal(done.length,1);assert.equal(done[0][0],true);assert(blanks.every(b=>b.classList.contains('open')));
 }
});
