#!/usr/bin/env node
'use strict';
// Actual Chromium at a 190mm print width. PNG/JSON only; never creates PDFs,
// publishes data, signs in, calls Supabase, or sends messages.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.env.NM_EXTENSION_PRINT_ARTIFACTS||null;
if(OUT)fs.mkdirSync(OUT,{recursive:true});
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
const report={sets:[],conditions:[],errors:[],failures:[],writes:[],pdfs:0};
function questionSignature(root){return [...root.querySelectorAll('.nm-w2-item')].map(item=>{const node=item.cloneNode(true);node.querySelectorAll('button').forEach(x=>x.remove());return [...node.querySelectorAll('[data-tex]')].map(x=>x.dataset.tex).join('|')+'::'+node.textContent.replace(/\s+/g,' ').trim();});}
function inspect(rootSelector){
 const root=document.querySelector(rootSelector),bad=[];if(!root)throw Error('Missing rendered root '+rootSelector);
 for(const el of root.querySelectorAll('.nm-w2-page,.nm-w2-item,.nm-w2-head,.nm-w2-head-run,.nm-w2-head-top,.nm-w2-head-mid,.nm-mid-concept,.nm-w2-example,.nm-cvw,.nm-ak-item')){
  if(el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3)bad.push({class:el.className,w:el.clientWidth,sw:el.scrollWidth,h:el.clientHeight,sh:el.scrollHeight,text:el.textContent.slice(0,140)});
 }
 const conceptKeys=[...root.querySelectorAll('.nm-w2-concept')].map(el=>el.closest('.nm-w2-page')?.querySelector('.nm-w2-head-code')?.textContent.match(/([A-Z]+\d+)-L(\d+)/)?.slice(1).join('@')||'missing-key');
 const tagline=root.querySelector('.nm-cvw-tagline')?.textContent||'';
 return {questions:root.querySelectorAll('.nm-w2-item').length,answers:root.querySelectorAll('.nm-ak-item').length,pages:root.querySelectorAll('.nm-w2-page').length,
  katexErrors:root.querySelectorAll('.katex-error').length,conceptKeys,duplicateConcepts:conceptKeys.filter((key,i)=>conceptKeys.indexOf(key)!==i),
  tagline,extraReading:[...root.querySelectorAll('.nm-cvw-name')].filter(el=>/수학사|매거진|종이 교구/.test(el.textContent)).map(el=>el.textContent),bad,
  solve:localStorage.getItem('nm_ws_solve'),font:root.querySelector('.nm-w2-head')?getComputedStyle(root.querySelector('.nm-w2-head')).fontFamily:null};
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--disable-webgl','--disable-webgl2']}),ctx=await browser.newContext({viewport:{width:1100,height:1200},reducedMotion:'reduce'}),page=await ctx.newPage();
 try{
  page.on('pageerror',e=>report.errors.push(e.message));
  await ctx.route('**/*',route=>{const req=route.request(),url=req.url();if(!['GET','HEAD'].includes(req.method())){report.writes.push(url);return route.abort();}if(url.startsWith(base+'/')||/^https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//.test(url))return route.continue();return route.abort();});
  await ctx.addInitScript(()=>{localStorage.setItem('nm_ws_solve','1');window.NM_NO_AUTOPRINT=true;window.__printCalls=0;window.print=()=>{window.__printCalls++;};});
  await page.goto(base+'/drill.html',{waitUntil:'networkidle',timeout:60000});await page.waitForFunction(()=>window.NM_EXAM&&window.NM_HIGH_PACING);
  if(!await page.evaluate(()=>!!window.NM_MIDDLE_EXTENSION))await page.addScriptTag({url:base+'/data/middle-extension.js'});
  // Inspect the actual selected generators once: a prompt may contain either
  // a dispensable solution hint or an essential domain/ordering condition.
  report.semanticAudit=await page.evaluate(()=>[...new Set([1,2,3].flatMap(g=>NM_MIDDLE_EXTENSION.course(g).sessions.flatMap(s=>s.drills.map(d=>d.t+'@'+d.lv))))].map(tag=>{
   const [thread,lv]=tag.split('@'),p=NM_EXAM.buildProblems(thread,+lv,1,NM_RNG.hashSeed('semantic-check'))[0];
   return {tag,prompt:p.prompt?.ko,tex:p.tex,word:!!p.word,graph:!!p.graph};
  }));
  // Use the app's actual current print/editor styles, including the standalone
  // print font fallback stack. No layout or font metrics are replaced by a QA theme.
  const targets=[1,2,3].flatMap(grade=>[{grade,index:0,name:'first'},{grade,index:10,name:'last'}]);
  await page.emulateMedia({media:'print'});
  const widthStyle=await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
  for(const target of targets){
   const entry={...target};report.sets.push(entry);
   try{
    const expected=await page.evaluate(async t=>{const refs=[NM_MIDDLE_EXTENSION.reference(t.grade,t.index),NM_MIDDLE_EXTENSION.reference(t.grade,t.index+1)],e=NM_EXAM.plannedEnvelope(refs,'2026-W43',{amount:1.5,grade:t.grade+6,cad:'w2',name:'인쇄 검수'});if(!e||!e.compactHigh||e.items.some(it=>!it.compactHigh))throw Error('Extension lost designed-print flags');window.__extensionPrintEnvelope=e;NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:e.compactHigh});await document.fonts.ready;await Promise.all([...document.querySelectorAll('.nm-w2-brand-logo')].map(i=>i.decode().catch(()=>{})));return {count:e.items.reduce((n,it)=>n+it.count,0),concepts:e.items.filter(it=>!it.noTeach&&!it.skipConcept).length,ids:e.assignedExtensionIds};},target);
    entry.expected=expected;entry.direct=await page.evaluate(inspect,'.nm-print-sheet');
    assert.equal(entry.direct.questions,expected.count);assert.equal(entry.direct.answers,expected.count);assert.equal(entry.direct.katexErrors,0);assert.equal(entry.direct.solve,'1');assert.equal(entry.direct.conceptKeys.length,expected.concepts);assert.deepEqual(entry.direct.duplicateConcepts,[]);assert.deepEqual(entry.direct.extraReading,[]);assert.deepEqual(entry.direct.bad,[]);
    assert.equal(entry.direct.tagline,`중${target.grade} 선택 심화 12묶음 · 표준 6주 · 기본 포함 총 16주`);
    if(OUT&&target.grade===1&&target.index===0)await page.locator('.nm-print-sheet .nm-cvw').screenshot({path:path.join(OUT,'sample-m1-first-cover.png')});
    if(OUT&&target.grade===3&&target.index===10){await page.locator('.nm-print-sheet .nm-w2-page').filter({has:page.locator('.nm-w2-item')}).first().screenshot({path:path.join(OUT,'sample-m3-last-practice.png')});await page.locator('.nm-print-sheet .nm-print-answer-key.nm-w2-page').first().screenshot({path:path.join(OUT,'sample-m3-last-answers.png')});}
    await page.emulateMedia({media:'screen'});
    await page.evaluate(()=>{document.querySelector('.nm-print-sheet')?.remove();const e=window.__extensionPrintEnvelope;NM_EXAM.openPrintEditor(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:e.compactHigh});});await page.waitForSelector('#nm-pe-overlay .nm-w2-item');await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#nm-pe-count-seg').count(),0);assert((await page.locator('#nm-pe-overlay .nm-pe-opt-label').first().innerText()).includes('설계 분량'));
    entry.preview=await page.evaluate(inspect,'#nm-pe-overlay');assert.equal(entry.preview.questions,expected.count);assert.equal(entry.preview.conceptKeys.length,expected.concepts);assert.deepEqual(entry.preview.duplicateConcepts,[]);
    const before=await page.locator('.nm-pe-round').evaluateAll(es=>es.map(e=>e.dataset.code));await page.locator('#nm-pe-reroll-all').click();
    const after=await page.locator('.nm-pe-round').evaluateAll(es=>es.map(e=>e.dataset.code));assert.notDeepEqual(after,before);assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),expected.count);assert.equal(await page.locator('[data-nm-unique-error]').count(),0);
    const previewSignatures=await page.locator('#nm-pe-overlay').evaluate(questionSignature);
    const printedBefore=await page.evaluate(()=>window.__printCalls);await page.evaluate(()=>{window.NM_NO_AUTOPRINT=false;});await page.locator('#nm-pe-print').click();await page.waitForFunction(n=>window.__printCalls===n+1,printedBefore);await page.evaluate(()=>{window.NM_NO_AUTOPRINT=true;});
    const printSignatures=await page.locator('.nm-print-sheet').evaluate(questionSignature);assert.deepEqual(printSignatures,previewSignatures,'Rerolled preview and printed questions must be identical');
    // The A4 paginator repeats the round header for each answer fragment.
    // Collapse adjacent repeated headers, retaining the actual round order.
    const printedCodes=await page.locator('.nm-print-sheet .nm-ak-section > .nm-ak-subhead > .nm-ak-subcode').evaluateAll(es=>es.map(e=>e.textContent.trim()).filter((code,i,list)=>!i||code!==list[i-1]));assert.deepEqual(printedCodes,after,'Printed answer keys must use exactly the rerolled preview codes');
    await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);entry.printed=await page.evaluate(inspect,'.nm-print-sheet');
    assert.equal(entry.printed.questions,expected.count);assert.equal(entry.printed.answers,expected.count);assert.equal(entry.printed.katexErrors,0);assert.deepEqual(entry.printed.bad,[]);assert.deepEqual(entry.printed.duplicateConcepts,[]);assert.deepEqual(entry.printed.extraReading,[]);assert.equal(entry.printed.solve,'1');entry.rerollAndPrintParity=true;
    await page.emulateMedia({media:'screen'});await page.locator('#nm-pe-close').click();assert.equal(await page.locator('#nm-pe-overlay').count(),0);await page.emulateMedia({media:'print'});
   }catch(error){entry.error=error.message;report.failures.push({target,error:error.message});if(OUT)await page.screenshot({path:path.join(OUT,`failure-m${target.grade}-${target.name}.png`),fullPage:false});await page.evaluate(()=>document.getElementById('nm-pe-overlay')?.remove());await page.emulateMedia({media:'print'});}
  }
  // Conditions must travel with each printed question, including later pages,
  // worked examples and guided practice. Printing every full prompt would leak
  // solving hints, so only these reviewed exact levels receive a condition.
  for(const [index,thread,level,phrase]of [[10,'MD26',3,'중근'],[3,'MD20',5,'작은 수부터'],[9,'MD25',3,'작은 수부터'],[7,'MD93',2,'정수 a'],[8,'MD93',3,'정수 근']]){
   const entry={tag:thread+'@'+level};report.conditions.push(entry);
   try{
    const expected=await page.evaluate(async({index,thread,level})=>{const e=NM_EXAM.plannedEnvelope([NM_MIDDLE_EXTENSION.reference(3,index)],'2026-W43',{amount:1.5,grade:9,cad:'w2'});NM_EXAM.renderPrintMulti(e.items,e.wsId,{mixed:20,cover:e.cover,units:e.units,compactHigh:e.compactHigh});await document.fonts.ready;return e.items.filter(it=>it.thread===thread&&it.level===level).reduce((n,it)=>n+it.count,0);},{index,thread,level});
    const pages=page.locator('.nm-print-sheet .nm-w2-page').filter({has:page.locator('.nm-w2-head-code').filter({hasText:thread+'-L'+level+' ·'})});
    const cells=pages.locator('.nm-w2-item');assert.equal(await cells.count(),expected);
    const conditions=await cells.locator('.nm-print-condition').allTextContents();assert.equal(conditions.length,expected);assert(conditions.every(text=>text.includes(phrase)),entry.tag+' condition must appear in every question');
    assert((await pages.locator('.nm-w2-example .nm-print-condition').first().innerText()).includes(phrase));
    const guides=await pages.locator('.nm-w2-guide-item .nm-print-condition').allTextContents();assert.equal(guides.length,3);assert(guides.every(text=>text.includes(phrase)));
    const measured=await page.evaluate(inspect,'.nm-print-sheet');assert.deepEqual(measured.bad,[]);assert.equal(measured.katexErrors,0);
    entry.questions=expected;entry.conditions=conditions.length;entry.guidedConditions=guides.length;entry.workedExample=true;entry.overflow=0;
   }catch(error){entry.error=error.message;report.failures.push({condition:entry.tag,error:error.message});}
  }
  await widthStyle.evaluate(e=>e.remove());assert.deepEqual(report.errors,[]);assert.deepEqual(report.writes,[]);
  if(OUT)fs.writeFileSync(path.join(OUT,'middle-extension-print.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({sets:report.sets.length,questions:report.sets.reduce((n,s)=>n+(s.direct?.questions||0),0),printParity:report.sets.filter(s=>s.rerollAndPrintParity).length,reviewedLevels:report.semanticAudit.length,conditions:report.conditions,failures:report.failures,errors:report.errors,externalWrites:report.writes.length,pdfs:0},null,2));assert.equal(report.failures.length,0,'See middle-extension-print.json and failure PNGs');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{if(OUT)fs.writeFileSync(path.join(OUT,'middle-extension-print.json'),JSON.stringify(report,null,2));console.error(e);process.exitCode=1;});
