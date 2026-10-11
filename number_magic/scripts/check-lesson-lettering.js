#!/usr/bin/env node
'use strict';
// Real lesson screens, source-preserving before/after and screen-only font QA.
// NM_LETTERING_ARTIFACTS=<E: directory> writes screenshots/PDF/evidence there.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const {NO_WEBGL_ARGS}=require('./lib/nm-onboard');
const ROOT=path.resolve(__dirname,'..'),REPO=path.dirname(ROOT);
const baseline=(process.argv.find(a=>a.startsWith('--baseline='))||'').slice(11);
const previous=baseline?execFileSync('git',['show',baseline+':number_magic/app/learning-stage.css'],{cwd:REPO,encoding:'utf8'}):null;
const out=process.env.NM_LETTERING_ARTIFACTS;
if(out)fs.mkdirSync(out,{recursive:true});
const cases=[['N-07','ko',390],['N-01','ko',390],['A-02','ko',390],['C-14','ko',1280],
 ['M-13','ko',390],['M-60','ko',1280],['N-07','en',390],['N-07','zh',390],['A-02','en',1280],['A-02','zh',1280]];
async function run(){
 const {server,base}=await serve(),browser=await chromium.launch({args:NO_WEBGL_ARGS});
 const report=[],snapshots=new Map();
 try{
  for(const version of previous?['before','after']:['after'])for(const [unit,lang,width] of cases){
   const ctx=await browser.newContext({viewport:{width,height:960},serviceWorkers:'block'});
   await ctx.route('**/*',r=>!r.request().url().startsWith(base)||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   if(version==='before')await ctx.route('**/app/learning-stage.css*',r=>r.fulfill({contentType:'text/css',body:previous}));
   await ctx.addInitScript(({unit,lang})=>localStorage.setItem('nm_state_v1',JSON.stringify({
    lang,name:'글꼴검수',onboarded:true,view:'unit',unit,step:'discover',avatar:{kind:'boy'},
    placement:{course:'C0',self:true},account:{status:'active'},
    symbolDex:{'+':{},'-':{},'−':{},'×':{},'÷':{},'=':{},'□':{}},
    progress:{[unit]:{introSeen:true,steps:{},touchedAt:1}}
   })),{unit,lang});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click({timeout:40000});
   await page.locator('.nm-unit-view').waitFor();
   for(let i=0;i<20;i++){
    const close=page.locator('#nmUnlockOverlayClose,#nmSymClose').last();
    if(!await close.count()||!await close.isVisible())break;await close.click();
   }
   await page.waitForFunction(()=>!document.querySelector('.nm-confetti'),null,{timeout:6000});
   await page.evaluate(()=>document.fonts.ready);
   const key=unit+'-'+lang+'-'+width;
   const result=await page.evaluate(()=>{
    const unit=document.querySelector('.nm-unit-view'),title=unit.querySelector('.nm-unit-title');
    const css=el=>({font:getComputedStyle(el).fontFamily,size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight});
    const reading=[...unit.querySelectorAll('.nm-comic-cap,.nm-cdesc,.nm-live-question,.nm-live-feedback')];
    const headings=[...unit.querySelectorAll('.nm-card-h,.nm-mzu-title,.nm-live-head h2')];
    const text=[title,...unit.querySelectorAll('.nm-story-bubble,.nm-comic-cap,.nm-cdesc,.nm-live-question,.nm-live-equation')].map(e=>e.textContent.trim());
    const clipped=[title,...headings,...reading].filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+2).map(e=>e.className);
    return {lang:unit.lang,band:unit.dataset.learningBand,title:css(title),headings:headings.map(css),reading:reading.map(css),
     story:[...unit.querySelectorAll('.nm-story-bubble')].map(css),
     text,clipped,overflow:document.documentElement.scrollWidth-innerWidth,
     loaded:[...document.fonts].filter(f=>f.family==='NM Lesson Hand').map(f=>f.status),
     buttons:[...unit.querySelectorAll('.nm-flow-step,.nm-back,.nm-live-actions button')].filter(b=>b.getClientRects().length).map(b=>({text:b.textContent.trim(),height:b.getBoundingClientRect().height}))};
   });
   assert.equal(result.lang,lang);assert.equal(result.overflow,0,key+' page overflow');
   assert.deepEqual(result.clipped,[],key+' clipped text');assert.deepEqual(errors,[],key+' page errors');
   assert(result.buttons.every(b=>b.height>=44),key+' targets: '+JSON.stringify(result.buttons));
   if(version==='before')snapshots.set(key,result.text);
   else{
    if(previous)assert.deepEqual(result.text,snapshots.get(key),key+' wording/math unchanged');
    const pen=result.band!=='secondary'&&lang!=='zh';
    assert.equal(result.title.font.includes('NM Lesson Hand'),pen,key+' age/language font');
    assert(result.story.every(s=>s.font.includes('NM Lesson Hand')===pen),key+' story bubble font');
    assert(result.reading.every(s=>!s.font.includes('NM Lesson Hand')),key+' reading stays sans');
    if(pen){
     assert(result.loaded.includes('loaded'),key+' actual font loaded');
     const cdp=await ctx.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
     const {root}=await cdp.send('DOM.getDocument');
     const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.nm-unit-title'});
     const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
     assert(fonts.some(f=>f.familyName==='NM Lesson Hand'&&f.glyphCount>0),key+' actual glyph renderer');
     result.actualFonts=fonts;await cdp.detach();
    }
   }
   if(out){
    await page.screenshot({path:path.join(out,version+'-'+key+'-screen.png')});
    if(unit==='N-07'&&lang==='ko'){
     await page.locator('#livingLesson').screenshot({path:path.join(out,version+'-'+key+'-hop.png')});
    }
    if(unit==='N-01'&&lang==='ko'){
     const caption=page.locator('.nm-comic-cap').first();
     if(await caption.count()){
      await caption.scrollIntoViewIfNeeded();
      await page.screenshot({path:path.join(out,version+'-'+key+'-story.png')});
     }
    }
   }
   if(version==='after'){
    // Applying the same learning CSS in print must not turn worksheet/body text into pen letters.
    await page.emulateMedia({media:'print'});
    const printFamily=await page.locator('.nm-unit-title').evaluate(e=>getComputedStyle(e).fontFamily);
    assert(!printFamily.includes('NM Lesson Hand'),key+' screen-only typography');
    result.printFamily=printFamily;
   }
   report.push({version,key,result,errors});await ctx.close();
   console.log('PASS — '+version+' '+key);
  }
  // Font request failure must leave readable, unclipped fallback, not a blank heading.
  const ctx=await browser.newContext({viewport:{width:390,height:960}});
  await ctx.route('**/*',r=>!r.request().url().startsWith(base)?r.abort():r.continue());
  await ctx.route('**/nm-lesson-hand.woff2',r=>r.fulfill({status:404,body:''}));
  await ctx.route('**/__nm-lettering-fallback.html',r=>r.fulfill({contentType:'text/html',body:
   '<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<link rel="stylesheet" href="app/learning-stage.css"></head><body style="margin:0">'+
   '<main class="nm-unit-view" lang="ko" data-learning-band="preschool"><div class="nm-unit-inner">'+
   '<div class="nm-unit-bar"><div class="nm-unit-title">수가 마법이 되는 곳 — 한 칸씩 뛰어 보세요</div></div>'+
   '</div></main></body></html>'}));
  const page=await ctx.newPage();
  await page.goto(base+'/number_magic/__nm-lettering-fallback.html',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'fallback overflow');
  assert(await page.locator('.nm-unit-title').isVisible());
  if(out)await page.locator('.nm-unit-inner').screenshot({path:path.join(out,'font-fallback.png')});
  await ctx.close();
  if(out)fs.writeFileSync(path.join(out,'lettering.json'),JSON.stringify(report,null,2));
  console.log('PASS — 10 age/language screens, unchanged text/math, real font glyphs, safe print and missing-font fallback'+(previous?'; before/after compared':''));
 }finally{await browser.close();server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
