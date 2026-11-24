import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';import{createHash}from'node:crypto';
import{withThink}from'./think-merge.js';import{BANK}from'./units-index.js';import{revisedTextbookUnits}from'./revised-textbook.js';import{withOptionalClassroomRecords}from'./revised-lesson.js';import{practicePaperHtml}from'./practice-paper.js';import{photoFigureHtml}from'./photo-figure.js';import{writtenPracticeHtml}from'./written-practice.js';import{seasonAnswerHint}from'./season-answer-hint.js';import*as presentation from'./source-presentation.js';import*as content from'./source-content.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const units=['s31-u01','s31-u02','s31-u03','s31-u04'],counts=[80,80,80,105],esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),ids=html=>[...html.matchAll(/data-id="([^"]+)"/g)].map(x=>x[1]);
const selected=m=>m.lesson.includePairedItems?[...m.items,...(m.similar||[])]:m.lesson.reusePairedItems?m.similar||[]:m.items;
const functions=source=>({itemRenderer:source.slice(source.indexOf('function blanksHtml('),source.indexOf('let FIG =')),pageBook:source.slice(source.indexOf('function pageBook('),source.indexOf('// GFIELD 실험 과학 영재'))});
function context(mod,source=functions(code)){
 const ctx=vm.createContext({...presentation,...content,photoFigureHtml,writtenPracticeHtml,seasonAnswerHint,FIG:mod.figures||{},MISC:mod.misc,BANK,BOOKX:{taxonomy:mod.taxonomy,similar:mod.similar,source:mod.source||[],items:mod.items,guidance:mod.unit?.sources?.guidance},$app:{innerHTML:''},revisedTextbookUnits,practicePaperHtml,byId:rows=>Object.fromEntries(rows.map(q=>[q.id,q])),CIRC:['①','②','③','④','⑤'],esc,store:{get(){throw Error('unexpected stored answer read');},set(){throw Error('unexpected stored answer write');}}});
 new vm.Script(source.itemRenderer).runInContext(ctx);
 new vm.Script(source.pageBook).runInContext(ctx);
 return ctx;
}
function route(ctx,u,mod,mode){const start=code.indexOf("  if(a==='workbook'&&mod.workbookPaper)"),end=code.indexOf("  if (a === 'lab-book')",start),branch=new vm.Script('(function(u,mod,L,items,a,b){'+code.slice(start,end)+'})').runInContext(ctx);branch(u,mod,withOptionalClassroomRecords(u,mod.lesson),mod.items,'print',mode);return ctx.$app.innerHTML;}
const fixture=JSON.parse(fs.readFileSync(new URL('./tests/fixtures/current-paper-before-deduplication.json',import.meta.url),'utf8')),prior=fixture.functions;
for(const[name,source]of Object.entries(prior))assert.equal(createHash('sha256').update(source).digest('hex'),fixture.functionSha256[name]);

test('all four actual generic print branches keep every distinct selected and paired question exactly once',async()=>{
 let total=0;
 for(const[i,u]of units.entries()){
  const mod=await loaders[u]();assert.equal(mod.bankPaper,undefined);const snapshot=JSON.stringify(mod),rows=[...new Map([...selected(mod),...(mod.similar||[])].map(q=>[q.id,q])).values()],expected=rows.map(q=>q.id),ctx=context(mod);assert.equal(rows.length,counts[i]);total+=rows.length;
  for(const mode of['student','teacher']){
   const html=route(ctx,u,mod,mode);assert.deepEqual(ids(html),expected,u+' '+mode);assert(!html.includes('<h2>탐구보고서</h2>'));assert(!html.includes('rep-print'));assert(!html.includes('— 개념 정리'));
   for(const q of rows)if(q.answerContract.type!=='cloze')assert(html.includes(esc(q.prompt)),q.id);
   if(mode==='student'){assert(!html.includes('<h2>정답·해설</h2>'));assert(!html.includes('class="ans"'));}
  }
  const answers=route(ctx,u,mod,'answers');assert.deepEqual(ids(answers),[]);const keys=[...answers.matchAll(/<span class="no">(\d+)\.<\/span> <b class="ans">([\s\S]*?)<\/b> — ([\s\S]*?)<\/div>/g)];assert.equal(keys.length,rows.length);keys.forEach((key,i)=>{assert.equal(Number(key[1]),i+1);assert.equal(key[3],esc(rows[i].explanation));});assert.equal(JSON.stringify(mod),snapshot);
 }
 assert.equal(total,345);
});

test('the new question papers do not require report fields and preserve optional records and noncurrent print output',async()=>{
 for(const u of units){const mod=await loaders[u](),ctx=context(mod),without={...mod,lesson:{...mod.lesson,report:undefined,explore:undefined}};for(const mode of['student','teacher','answers'])assert.doesNotThrow(()=>route(ctx,u,without,mode));assert(mod.lesson.report.sections.length);}
 const legacy=await loaders['s42-u04'](),now=context(legacy),before=context(legacy,prior);
 for(const mode of['student','teacher','answers']){const a=route(now,'s42-u04',legacy,mode),b=route(before,'s42-u04',legacy,mode);assert.equal(a,b);}
});

test('current paper cards keep the previous item renderer and the root refreshes the current shared modules',async()=>{
 for(const u of units){const mod=await loaders[u](),now=context(mod),before=context(mod,prior),rows=[...new Map([...selected(mod),...(mod.similar||[])].map(q=>[q.id,q])).values()];
  const oldItem=new vm.Script('itemHtml').runInContext(before),newItem=new vm.Script('itemHtml').runInContext(now);for(const q of rows)for(const show of[false,true])assert.equal(newItem(q,{print:true,show}),oldItem(q,{print:true,show}));
 }
 const version=code.match(/revised-textbook\.js\?v=([^'"]+)/)[1],index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8'),lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8');assert(index.includes('&book='+version));assert(code.includes('revised-textbook.js?v='+version));assert(code.includes('revised-lesson.js?v='+version));assert(lesson.includes('revised-textbook.js?v='+version));assert(index.includes('practice-paper.css?v=20261115-practice-paper-figures'));
});
