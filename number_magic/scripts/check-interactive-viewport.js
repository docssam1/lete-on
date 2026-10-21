#!/usr/bin/env node
'use strict';
// Real app, actual seeded generator; no account/server writes. Evidence goes to E: via env.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const {NO_WEBGL_ARGS}=require('./lib/nm-onboard');
const measure=process.argv.includes('--measure');
const out=process.env.NM_VIEWPORT_ARTIFACTS;
const cases=[['ko',1558,734,3],['ko',1280,720,5],['ko',1024,768,5],['ko',390,844,5],
 ['en',390,667,3],['zh',390,844,5],['ko',844,390,3],
 ['ko',1280,720,5,'read','practice'],['ko',390,844,5,'read','practice']];
async function run(){
 if(out)fs.mkdirSync(out,{recursive:true});
 const {server,base}=await serve(),browser=await chromium.launch({args:NO_WEBGL_ARGS});
 const report=[];
 try{
  for(const [lang,width,height,cols,mode='paint',step='lab'] of cases){
   const ctx=await browser.newContext({viewport:{width,height},serviceWorkers:'block'});
   await ctx.route('**/*',r=>!r.request().url().startsWith(base)||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   await ctx.route('**/app/entry.js*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
   await ctx.addInitScript(({lang})=>localStorage.setItem('nm_state_v1',JSON.stringify({
    lang,name:'화면검수',onboarded:true,view:'unit',unit:'N-01',step:'lab',avatar:{kind:'boy'},
    placement:{course:'C0',self:true},account:{status:'active'},
    symbolDex:{'+':{},'-':{},'−':{},'×':{},'÷':{},'=':{},'□':{}},
    progress:{'N-01':{introSeen:true,steps:{},touchedAt:1}}
   })),{lang});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   page.setDefaultNavigationTimeout(120000);
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click({timeout:40000});
   await page.locator('.nm-unit-view').waitFor();
   for(let i=0;i<20;i++){
    const close=page.locator('#nmUnlockOverlayClose,#nmSymClose').last();
    if(!await close.count()||!await close.isVisible())break;await close.click();
   }
   // Find an actual generated painting problem, keeping its prompt/answer/topology intact.
   const problem=await page.evaluate(({cols,mode})=>{
    const gen=NM_TGEN.g13_n1;let p;
    for(let seed=1;seed<10000;seed++){
     p=gen({level:'main',modes:['grid']},NM_RNG.mulberry32(seed));
     if(p.gmode===mode&&p.cols===cols&&p.rows===cols&&(mode==='paint'?p.target:p.answer)===5)break;
    }
    if(!p||p.gmode!==mode||p.cols!==cols||p.rows!==cols||(mode==='paint'?p.target:p.answer)!==5)throw Error('Missing seeded fixture');
    NM_TGEN.g13_n1=()=>JSON.parse(JSON.stringify(p));
    return p;
   },{cols,mode});
   await page.locator(`[data-step="${step}"]`).click();
   if(await page.locator('#skipNo').count())await page.locator('#skipNo').click();
   if(await page.locator('#nmLessonBegin').count())await page.locator('#nmLessonBegin').click();
   await page.locator('.nm-g13-gframe').waitFor();await page.evaluate(()=>document.fonts.ready);
   // Both initial introduction and subsequent question must fit.
   async function metrics(label){
    const result=await page.evaluate(mode=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
     const selectors=['.nm-unit-bar','.nm-flow','.nm-bubble','.nm-g13-gframe',mode==='paint'?'.nm-tm-done':'.nm-g13-choices'];
     return {prompt:document.querySelector('.nm-bubble').textContent,rects:Object.fromEntries(selectors.map(s=>[s,rect(document.querySelector(s))])),
      cells:[...document.querySelectorAll('.nm-g13-gcell.tap')].map(rect),
      choices:[...document.querySelectorAll('.nm-g13-choices button')].map(rect),
      scrolls:['#screen','#stepBody'].map(s=>{const e=document.querySelector(s);return {s,extra:e.scrollHeight-e.clientHeight};}),
      overflow:document.documentElement.scrollWidth-innerWidth,
      dialogueFont:document.querySelector('.nm-numi-dialogue')?getComputedStyle(document.querySelector('.nm-numi-dialogue')).fontFamily:null,
      numberFonts:[...document.querySelectorAll('.nm-dialog-figure')].map(e=>getComputedStyle(e).fontFamily),
      bubbleFont:getComputedStyle(document.querySelector('.nm-bubble')).fontSize};
    },mode);
    if(out)await page.screenshot({path:path.join(out,`${label}-${lang}-${width}x${height}-${cols}-${mode}-${step}.png`)});
    if(!measure){
     assert.equal(result.overflow,0,'horizontal overflow');
     // Landscape phone has a readable scrolling fallback, not tiny/clipped controls.
     if(height>=600){
      assert(result.scrolls.every(s=>s.extra<=2),JSON.stringify(result.scrolls));
      for(const [s,r] of Object.entries(result.rects))assert(r.y>=0&&r.bottom<=height+1&&r.x>=0&&r.right<=width+1,s+' outside viewport '+JSON.stringify(r));
     }
     assert(result.cells.every(r=>r.w>=44&&r.h>=44),'touch targets');
     assert(result.choices.every(r=>r.w>=44&&r.h>=44),'choice targets');
     assert(parseFloat(result.bubbleFont)>=19,'readable preschool prompt');
     assert.equal(result.dialogueFont.includes('NM Lesson Hand'),lang!=='zh','dialogue language/font');
     assert(result.numberFonts.every(f=>!f.includes('NM Lesson Hand')),'dialogue numbers stay sans');
     assert.deepEqual(errors,[],'page errors');
    }
    report.push({lang,width,height,cols,mode,step,label,result});
   }
   await metrics('intro');
   if(mode==='read'){
    await page.getByRole('button',{name:String(problem.answer),exact:true}).click();
    await page.waitForTimeout(850);await metrics('question');
    assert.equal(await page.locator('.nm-bubble').textContent(),problem.prompt[lang]);
    await ctx.close();console.log(`PASS — ${lang} ${width}x${height}, read/practice`);continue;
   }
   const cells=page.locator('.nm-g13-gcell.tap');
   await cells.nth(0).click();await cells.nth(1).click();
   if(!measure){await cells.nth(1).focus();await page.keyboard.press('Space');}
   else await cells.nth(1).click();
   assert.equal(await page.locator('.nm-tm-cnt').textContent(),'1','deselect');
   // Resize with an existing selection: layout must not regenerate or reset input.
   await page.setViewportSize({width:width+8,height:height+8});
   assert.equal(await page.locator('.nm-tm-cnt').textContent(),'1','resize preserves selection');
   await page.setViewportSize({width,height});
   if(!measure){await page.locator('.nm-tm-done').focus();await page.keyboard.press('Enter');}
   else await page.locator('.nm-tm-done').click();
   await page.waitForTimeout(850);
   assert.equal(await page.locator('.nm-tm-cnt').textContent(),'1','wrong answer preserves selection');
   for(let i=1;i<problem.target;i++)await cells.nth(i).click();
   await page.locator('.nm-tm-done').click();
   await page.waitForFunction(()=>document.querySelector('.nm-tm-cnt')?.textContent==='0');
   await metrics('question');
   assert.equal(await page.locator('.nm-bubble').textContent(),problem.prompt[lang],'generator prompt preserved');
   await ctx.close();console.log(`${measure?'MEASURE':'PASS'} — ${lang} ${width}x${height}, ${cols}x${cols}, initial/subsequent and interaction`);
  }
  if(out)fs.writeFileSync(path.join(out,'viewport.json'),JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
