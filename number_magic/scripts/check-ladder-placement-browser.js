#!/usr/bin/env node
'use strict';
/* 사다리 진단 화면 검사(2026-10-27): 진단 시작 화면에서 5·6·7세가 「처음 시작」을 고르면 그 나이 교재 수준 사다리가 뜨고,
 * 화면 풀이·종이 채점(한 칸 ○→X→비움) 모두 처음 막힌 단계에서 시작하며, 인쇄 시험지의 채점 칸은 맨 위·간결한 칸이다.
 * 외부 요청 없음. usage: node scripts/check-ladder-placement-browser.js */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
const seed=lang=>({lang,onboarded:true,name:'사다리 검수',view:'placement',avatar:{kind:'boy'},character:{number:3,color:'gold'},coins:50,progress:{},account:{status:'active'},r0BannerSeen:true,cloudLinked:false});
async function open(browser,base,width,lang){
 const ctx=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
 await ctx.route('**/*',r=>new URL(r.request().url()).origin===base&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_preview_state_v1'))localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},seed(lang));
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
 await page.goto(base+'/number_magic/access.html');await page.evaluate(()=>sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'preview',at:Date.now(),userId:null})));
 await page.goto(base+'/number_magic/index.html?enter=1');await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await page.waitForSelector('#pdLevel');
 return {ctx,page,errors};
}
const overflow=page=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const report=[];
 const browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
 try{
  for(const [width,lang] of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
   const {ctx,page,errors}=await open(browser,base,width,lang);
   const titles={a5:/P1/,a6:/K1/,a7:lang==='ko'?/1권/:lang==='en'?/Vol\. 1/:/第1册/};
   for(const code of ['a5','a6','a7']){
    await page.selectOption('#pdLevel',code);await page.click('[data-route="unlearned"]');
    const steps=await page.locator('.pd-ladder-steps li').allInnerTexts();
    const plan=await page.evaluate(c=>NM_PLACEMENT_PLAN.buildLadder(c,'x').ladder.steps.length,code);
    assert.equal(steps.length,plan,code+' lists every step');assert.match(steps.join(' '),titles[code],code+' climbs to its book level');
    assert(await page.locator('#pdStart').isEnabled(),code+' can start');assert.equal(await overflow(page),false,code+' fits');
    assert((await page.locator('#pdPaper').getAttribute('href')).includes('ladder='+code),code+' print link carries the ladder');
   }
   // 8세 이상은 사다리 없이 예전처럼 수 세기부터
   await page.selectOption('#pdLevel','e2');await page.click('[data-route="unlearned"]');assert.equal(await page.locator('.pd-ladder-steps').count(),0,'school-age keeps the counting start');
   // 화면 풀이: 모두 모름 → 첫 단계에서 시작
   await page.selectOption('#pdLevel','a6');await page.click('[data-route="unlearned"]');await page.click('#pdStart');
   for(let i=0;i<20;i++)await page.click('#pdSkip');
   await page.waitForSelector('.pd-ladder-result');
   assert.equal(await page.locator('.pd-ladder-result li').count(),7);assert.equal(await page.locator('.pd-ladder-result li.is-start').count(),1);
   assert.equal(await page.locator('.pd-ladder-result li').first().getAttribute('class'),'is-start','all unknown → first step');
   assert.equal(await overflow(page),false);
   await page.screenshot({path:path.join(process.env.NM_LADDER_ARTIFACTS||'/tmp','ladder-online-'+lang+'-'+width+'.png')}).catch(()=>{});
   // 종이 채점: 앞 2단계 ○, 3단계 X → 3단계에서 시작
   await page.click('#pdAgain');await page.locator('dialog [data-confirm]').click();
   await page.selectOption('#pdLevel','a5');await page.click('[data-route="unlearned"]');
   await page.click('#pdPrintOptions summary');await page.click('#pdPaperAnswers');await page.waitForSelector('.pd-mark-cell');
   const grid=await page.evaluate(()=>{const g=document.querySelector('.pd-marks-grid').getBoundingClientRect(),c=document.querySelector('.pd-mark-cell').getBoundingClientRect();return {h:g.height,cell:c.height};});
   assert(grid.h<400&&grid.cell>=44,'compact marking grid '+JSON.stringify(grid));
   const items=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_preview_state_v1'));return s._diag.plan.items.map(x=>x.ladderStep);});
   for(let i=0;i<20;i++){const cell=page.locator('.pd-mark-cell').nth(i),want=items[i]<2?'o':items[i]===2?'x':'';for(let k=0;k<3&&await cell.getAttribute('data-state')!==want;k++)await cell.click();}
   assert.match(await page.locator('.pd-mark-count').innerText(),/○ 5\b/,'5세 사다리 1·2단계 = 5문항 ○');
   await page.click('#pdPaperForm button[type=submit]');await page.waitForSelector('.pd-ladder-result');
   const startIndex=await page.locator('.pd-ladder-result li').evaluateAll(li=>li.findIndex(x=>x.classList.contains('is-start')));
   assert.equal(startIndex,2,'paper marks: first step with two misses is the start');
   assert.deepEqual(errors,[]);report.push({width,lang,ladders:3,onlineAllUnknown:'step 1',paperStart:'step 3',externalWrites:0});await ctx.close();
  }
  // 인쇄 시험지: 채점 칸이 시험지보다 위, 칸마다 정답
  const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/number_magic/placement-sheet.html?ladder=a7&l=ko&seed=check');await page.waitForFunction(()=>window.NM_WS_READY===true,null,{timeout:90000});
  assert.equal(await page.locator('.pl-q').count(),20);
  assert(await page.evaluate(()=>!!(document.getElementById('plScore').compareDocumentPosition(document.querySelector('.nm-print-sheet'))&Node.DOCUMENT_POSITION_FOLLOWING)),'marking box precedes the printed pages');
  await page.click('#plScore>summary');const cells=await page.locator('.pl-sc-cell').count();assert.equal(cells,20);
  const answers=await page.evaluate(()=>NM_PLACEMENT_PLAN.buildLadder('a7','check').items.map(x=>String(Array.isArray(x.answer)?x.answer.join(', '):x.answer)));
  const shown=await page.locator('.pl-sc-ans').allInnerTexts();assert(shown.every((s,i)=>s.includes(answers[i])||/개|←|→|왼|오/.test(s)),'each cell shows its answer');
  await page.click('[data-mark-all="o"]');await page.click('#plGo');assert.equal(await page.locator('.pl-ladder li.is-start').count(),0,'all ○ → next book');
  assert.equal(await overflow(page),false);assert.deepEqual(errors,[]);await ctx.close();
  console.log('LADDER_PLACEMENT_BROWSER_OK '+JSON.stringify(report));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
