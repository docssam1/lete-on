#!/usr/bin/env node
'use strict';
// Existing generated questions through actual unit practice/lab; browser-only
// fixtures and account storage, no production data writes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const {NO_WEBGL_ARGS}=require('./lib/nm-onboard');
const measure=process.argv.includes('--measure'),out=process.env.NM_MANIPULATIVE_ARTIFACTS;
const fixtures=[
 {id:'fingers',unit:'N-01',gen:'g13_n1',params:{level:'main',modes:['rep']},rightType:'fingers',root:'.nm-g13-rep'},
 {id:'frames',unit:'N-01',gen:'g13_n1',params:{level:'main',modes:['rep']},rightType:'frame',root:'.nm-g13-rep'},
 ...['plate','cake','paint','bar','circle'].map(skin=>({id:'split-'+skin,unit:'N-06',gen:'g46_split',params:{skin,lo:9,hi:9},root:'.nm-g46-split'})),
 {id:'bond',unit:'N-06',step:'practice',gen:'nl4_bond',params:{mode:'join',level:'practice'},root:'.nm-nb-wrap'},
 ...['read','draw'].map(mode=>({id:'hop-'+mode,unit:'N-07',gen:'nl41_hop',params:{mode,dir:'-'},root:'.nm-g79-hop'}))
];
async function run(){
 if(out)fs.mkdirSync(out,{recursive:true});
 const {server,base}=await serve(),browser=await chromium.launch({args:NO_WEBGL_ARGS}),report=[];
 try{
  const cases=[[1280,720,'ko'],[390,844,'ko']].flatMap(v=>fixtures.map(f=>({v,f})));
  for(const v of [[390,844,'en'],[390,844,'zh'],[390,667,'ko'],[844,390,'ko']])
    for(const id of ['fingers','split-cake','hop-draw'])cases.push({v,f:fixtures.find(f=>f.id===id)});
  for(const {v:[width,height,lang],f} of cases){
   const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<700,serviceWorkers:'block'});
   await ctx.route('**/*',r=>!r.request().url().startsWith(base)||!['GET','HEAD'].includes(r.request().method())?r.abort():r.continue());
   await ctx.route('**/app/entry.js*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
   await ctx.addInitScript(({unit,lang})=>localStorage.setItem('nm_state_v1',JSON.stringify({lang,name:'교구검수',onboarded:true,view:'unit',unit,step:'lab',avatar:{kind:'boy'},placement:{course:'C0',self:true},account:{status:'active'},symbolDex:{'+':{},'-':{},'−':{},'×':{},'÷':{},'=':{},'□':{}},progress:{[unit]:{introSeen:true,steps:{},touchedAt:1}}})),{unit:f.unit,lang});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultNavigationTimeout(120000);
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click({timeout:40000});
   await page.locator('.nm-unit-view').waitFor();
   for(let i=0;i<20;i++){const close=page.locator('#nmUnlockOverlayClose,#nmSymClose').last();if(!await close.count()||!await close.isVisible())break;await close.click();}
   const p=await page.evaluate(f=>{
    const gen=NM_TGEN[f.gen];let p;
    for(let seed=1;seed<10000;seed++){p=gen(f.params,NM_RNG.mulberry32(seed));if(!f.rightType||p.rightType===f.rightType)break;}
    if(f.rightType&&p.rightType!==f.rightType)throw Error('Missing seeded representation');
    NM_TGEN[f.gen]=()=>JSON.parse(JSON.stringify(p));return p;
   },f);
   await page.locator(`[data-step="${f.step||'lab'}"]`).click();
   if(await page.locator('#skipNo').count())await page.locator('#skipNo').click();
   if(await page.locator('#nmLessonBegin').count())await page.locator('#nmLessonBegin').click();
   await page.locator(f.root).waitFor();await page.evaluate(()=>document.fonts.ready);
   async function snapshot(label){
    const m=await page.evaluate(root=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
     return {prompt:document.querySelector('.nm-bubble').textContent,rects:Object.fromEntries(['.nm-unit-bar','.nm-flow','.nm-bubble',root].map(s=>[s,rect(document.querySelector(s))])),
      buttons:[...document.querySelector(root).querySelectorAll('button')].filter(e=>!e.disabled).map(e=>({cls:e.className,...rect(e)})),
      confirm:[...document.querySelector(root).querySelectorAll('.nm-tm-done,.nm-nb-done')].map(rect),
      splitRows:[...document.querySelectorAll('.nm-g46-srow')].length,
      scrolls:['#screen','#stepBody'].map(s=>{const e=document.querySelector(s);return {s,extra:e.scrollHeight-e.clientHeight};}),
      overflow:document.documentElement.scrollWidth-innerWidth};
    },f.root);
    if(out)await page.screenshot({path:path.join(out,`${label}-${f.id}-${lang}-${width}x${height}.png`)});
    report.push({id:f.id,lang,width,height,label,p,m});
    if(!measure){
     assert.equal(m.overflow,0,'horizontal overflow');assert.deepEqual(errors,[],'page errors');
     // Dense multi-method activities may pan inside the board, not move guide
     // or confirm off-screen. Very short windows retain the readable fallback.
     if(height>=700){
      assert(m.scrolls.every(s=>s.extra<=2),JSON.stringify(m.scrolls));
      for(const [s,r] of Object.entries(m.rects))assert(r.y>=0&&r.bottom<=height+1&&r.x>=0&&r.right<=width+1,`${s} outside viewport ${JSON.stringify(r)}`);
      assert(m.confirm.every(r=>r.bottom<=height&&r.y>=0&&r.w>=44&&r.h>=44),'visible confirm');
     }
     if(p.widget==='splitDraw')assert.equal(m.splitRows,p.rows+p.preset.length,'all methods preserved');
     if(p.widget==='g13Rep')assert.equal(await page.locator('.nm-g13-mc').count(),p.left.length+p.right.length);
     assert(m.buttons.filter(b=>!b.cls.includes('tickbtn')).every(b=>b.w>=43.9&&b.h>=43.9),'44px primary targets (number-line ticks have arrow-key access)');
    }
    console.log(`${measure?'MEASURE':'PASS'} ${f.id} ${width}x${height}: ${JSON.stringify(m.scrolls)}, bottom ${Math.round(m.rects[f.root].bottom)}`);
   }
   await snapshot('first');
   if(!measure){
    const original=await page.locator(f.root).elementHandle();
    const tap=async(b)=>width<700?b.tap():b.click();
    const key=async(b,k='Enter')=>{await b.focus();await page.keyboard.press(k);};
    const resize=async()=>{await page.setViewportSize({width:width+8,height:height+8});await page.setViewportSize({width,height});};
    if(p.widget==='g13Rep'){
     const left=page.locator('.nm-ml-col').nth(0).locator('button'),right=page.locator('.nm-ml-col').nth(1).locator('button');
     await tap(left.nth(0));await key(right.nth(p.right.findIndex(n=>n!==p.left[0])));
     assert.equal(await page.locator('.matched').count(),0,'wrong pair not matched');
     await tap(left.nth(0));await resize();assert.equal(await page.locator('.nm-ml-card.sel').count(),1,'resize preserves selection');
     await key(left.nth(0),'Space');assert.equal(await page.locator('.nm-ml-card.sel').count(),0,'deselect');
     for(let i=0;i<p.left.length;i++){await key(left.nth(i),'Space');await key(right.nth(p.right.indexOf(p.left[i])));}
    }else if(p.widget==='numberBond'){
     assert.equal(p.answer,p.a+p.b,'independent join answer');
     const ask=page.locator('.nm-nb-node.ask'),done=page.locator('.nm-nb-done');
     await key(ask,'Space');await key(done);await page.waitForTimeout(750);
     assert.equal(await page.locator('#nbAskNum').textContent(),'1','wrong answer kept input');
     await resize();assert.equal(await page.locator('#nbAskNum').textContent(),'1');
     await key(ask,'Backspace');assert.equal(await page.locator('#nbAskNum').textContent(),'0','keyboard undo');
     for(let i=0;i<p.answer;i++)await key(ask,'Space');await tap(done);
    }else if(p.widget==='hopLine'){
     assert.equal(p.eq.c,p.eq.a-p.eq.b,'independent subtraction answer');
     const nums=page.locator('.nm-g79-nbtn');
     if(p.mode==='draw'){
      const ticks=page.locator('.nm-g79-tickbtn');
      await ticks.first().focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator(':focus').getAttribute('aria-label'),'1','tick keyboard navigation');
      await key(ticks.first());assert.equal(await page.locator('.nm-g79-hopsvg .arc').count(),0,'wrong tick not accepted');
      await tap(ticks.nth(p.hops[0].to));await resize();assert.equal(await page.locator('.nm-g79-hopsvg .arc').count(),1,'resize preserves hop');
      await key(ticks.nth(p.hops[1].to),'Space');
     }
     await tap(nums.nth((p.answer+1)%10));
     assert.equal(await original.evaluate(el=>el.isConnected),true,'wrong number did not advance');
     await key(nums.nth(p.answer));
    }else if(p.widget==='splitDraw'){
     const done=page.locator('.nm-g46-done'),rows=page.locator('.nm-g46-srow:not(.locked)');
     await key(done);await page.waitForTimeout(750);
     assert((await page.locator('.nm-g46-msg').textContent()).length>0,'wrong split feedback');
     await snapshot('wrong');
     const keyOf=ab=>(p.distinct==='ordered'?ab:ab.slice().sort((a,b)=>a-b)).join(',');
     const used=new Set(p.preset.map(x=>keyOf([x.a,x.b]))),solutions=[];
     for(let a=1;a<p.total;a++){const ab=[a,p.total-a],k=keyOf(ab);if(!used.has(k)){used.add(k);solutions.push(ab);}}
     assert(solutions.length>=p.rows,'enough independent different methods');
     for(let i=0;i<p.rows;i++){
      const row=rows.nth(i),[a,b]=solutions[i];await row.scrollIntoViewIfNeeded();
      if(['plate','cake','circle'].includes(p.skin)){
       const halves=row.locator(p.skin==='circle'?'.nm-g46-half':'.nm-g46-plate');
       const position=p.skin==='circle'?undefined:{x:2,y:2};
       if(width<700)await halves.nth(0).tap({position});
       else await halves.nth(0).click({position});
       assert.equal(await halves.nth(0).locator('.nm-g46-tk').count(),1,'real pointer/touch adds a token');
       await key(halves.nth(0),'Backspace');
       for(let n=0;n<a;n++)await key(halves.nth(0));for(let n=0;n<b;n++)await key(halves.nth(1),'Space');
       assert.equal(await halves.nth(0).locator('.nm-g46-tk').count(),a);assert.equal(await halves.nth(1).locator('.nm-g46-tk').count(),b);
      }else if(p.skin==='bar')await key(row.locator('.nm-g46-bc').nth(a-1));
      else {
       const palette=page.locator('.nm-g46-pcolor'),cells=row.locator('.nm-g46-pt');
       await key(palette.nth(0));for(let n=0;n<a;n++)await key(cells.nth(n));
       await key(palette.nth(1));for(let n=a;n<p.total;n++)await key(cells.nth(n));
       assert.equal(await row.locator('.c1').count(),a);assert.equal(await row.locator('.c2').count(),b);
      }
      if(i===0){await resize();assert.equal(await row.locator('.nm-g46-tk,.c1,.c2').count()>0||p.skin==='bar',true,'resize retains split');}
     }
     await snapshot('filled');await key(done);
    }
    await page.waitForFunction(el=>!el.isConnected,original);
    await page.locator(f.root).waitFor();await snapshot('next');
    assert.equal(await page.locator('.nm-bubble').textContent(),p.prompt[lang],'original generated prompt');
   }
   await ctx.close();
  }
  if(out)fs.writeFileSync(path.join(out,'manipulative.json'),JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
