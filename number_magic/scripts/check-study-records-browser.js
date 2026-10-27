#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_RECORD_ARTIFACTS;
const WEBGL=process.argv.includes('--webgl');
if(!OUT||!path.isAbsolute(OUT)||(process.platform==='win32'&&!/^E:[\\/]/i.test(OUT)))throw Error('Set NM_RECORD_ARTIFACTS to a dedicated absolute path (E: on Windows)');
fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
const localDay=ms=>{const d=new Date(ms);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
function seed(lang,ready){const events=[];if(ready)for(let i=0;i<4;i++){const ts=Date.now()-(20-i*6)*86400000;events.push({id:'fixture-'+i,kind:'session',at:ts,day:localDay(ts),course:'C1',session:i+1,minutes:20,whole:true,source:'adult-confirmed',total:20,correct:20});}
 return {lang,onboarded:true,name:'기록 검수 가상',character:{number:3,color:'blue'},progress:{'A-02':{introSeen:true,steps:{}}},coins:123,roadAmount:1.25,roadSpeed:.85,roadCadence:'w2',account:{status:'active'},cloudLinked:false,studyLog:{version:1,events}};}
const load=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')));
async function panel(page){
 await page.selectOption('#pdLevel','a6');await page.locator('.pd-selection details summary').click();await page.selectOption('#pdBaseline','c1');await page.click('#pdStart');
 for(let i=0;i<20;i++)await page.click('#pdSkip');await page.click('#pdRoad');await page.locator('.pd-route-planner > summary').click();
}
async function noOverflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal viewport overflow');}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser;const report=[];
try{browser=await chromium.launch({headless:true,args:WEBGL?['--enable-unsafe-swiftshader']:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
for(const lang of (WEBGL?['ko']:['ko','en','zh']))for(const width of (WEBGL?[1280]:[390,1280])){
 const ready=lang==='ko'&&width===1280,ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await ctx.route('**/*',r=>new URL(r.request().url()).origin===base&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
 await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_state_v1')){localStorage.setItem('nm_state_v1',JSON.stringify(s));localStorage.setItem('nm_thread_stats_v1',JSON.stringify({NS1:[{ts:Date.now(),rate:1,total:999,correct:999,level:1}]}));}},seed(lang,ready));
 try{
  await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),async el=>el.click(),{noWaitAfter:true});
  await page.goto(base+'/number_magic/index.html?enter=1');await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await page.waitForSelector('#pdLevel');
  const protectedBefore=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({progress:s.progress,coins:s.coins,amount:s.roadAmount,speed:s.roadSpeed,cad:s.roadCadence});});
  await panel(page);
  assert.equal(await page.locator('.pd-session-form').count(),1);assert.equal(await page.locator('.pd-projection-form .pd-session-form').count(),0,'completion and projection forms must not be nested');
  assert.equal(await page.locator('[name="rampWeeks"]').getAttribute('min'),'2');
  if(ready){
   assert.equal(await page.locator('.pd-projection-form [name="startSession"]').inputValue(),'5','continues after 4 whole confirmed sessions');
   assert.equal(await page.locator('.pd-projection-form [name="observedVisits"]').inputValue(),'4');
   assert.equal(await page.locator('.pd-projection-form [name="frequency"]').inputValue(),'1.33','real 4 study days / 21 calendar days including idle tail, not configured 2');
   assert.equal(await page.locator('[name="reviewed"]').isDisabled(),false);
   await page.locator('.pd-save-goal').click();assert((await load(page)).studyGoal);
   await page.locator('.pd-projection-form [name="reviewed"]').check();await page.locator('.pd-projection-form button[type="submit"]').click();
   await page.waitForSelector('.pd-projection-table');assert.equal(await page.locator('.pd-projection-table tbody tr').count(),3);
   if(WEBGL){await page.waitForFunction(()=>document.querySelector('.pd-projection-stage')?.dataset.renderer==='webgl',null,{timeout:45000});await page.locator('.pd-projection-week').fill('1');const held=await page.locator('.pd-projection-stage').evaluate(e=>e.__studyBranches.debug());assert.deepEqual(held.beads[0],held.beads[2]);await page.locator('.pd-projection-stage').screenshot({path:path.join(OUT,'actual-records-3d.png')});}
   await page.locator('[name="rampWeeks"]').fill('1');assert.equal(await page.locator('[name="rampWeeks"]').evaluate(e=>e.checkValidity()),false);await page.locator('[name="rampWeeks"]').fill('2');
  }else{
   assert.equal(await page.locator('[name="reviewed"]').isDisabled(),true,'legacy global high score does not unlock profile observation');
   await page.locator('.pd-projection-form button[type="submit"]').click();assert(await page.locator('.pd-error').textContent());assert.equal(await page.locator('.pd-projection-table').count(),0);
  }
  await noOverflow(page);await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));await page.locator('.pd-evidence').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(OUT,lang+'-'+width+'-records.png')});
  if(lang==='ko'&&width===390){
   await page.locator('.pd-session-confirm > summary').click();const f=page.locator('.pd-session-form');
   await f.locator('[name="session"]').fill('1');await f.locator('[name="minutes"]').fill('20');await f.locator('[name="total"]').fill('20');await f.locator('[name="correct"]').fill('19');await f.locator('[name="whole"]').check();await f.locator('button[type="submit"]').click();
   assert.equal((await load(page)).studyLog.events.length,1);assert.equal(await page.locator('.pd-projection-form [name="startSession"]').inputValue(),'2','save immediately advances planning pointer, not student progress');
   await f.locator('[name="whole"]').check();await f.locator('button[type="submit"]').click();assert.equal((await load(page)).studyLog.events.length,1,'duplicate day/session rejected');
   await page.locator('.pd-save-goal').click();const goal=(await load(page)).studyGoal;
   // Actual production exam UI and actual grade callback, not a fixture-only recorder call.
   await page.evaluate(()=>window.examScreen(document.getElementById('screen'),{}));await page.click('[data-sec="road"]');await page.click('[data-course-toggle="C1"]');await page.locator('.nm-ex-road-online-btn[data-course="C1"][data-session="0"]').click();
   const inputs=page.locator('.nm-vp-inp');assert(await inputs.count()>0);for(let i=0;i<await inputs.count();i++)await inputs.nth(i).fill('999');
   await page.waitForTimeout(150);await page.click('#nm-ws-grade');let logged=(await load(page)).studyLog.events;
   assert.equal(logged.length,2);assert.equal(logged[1].kind,'attempt');assert.equal(logged[1].course,'C1');assert.equal(logged[1].session,1);assert(logged[1].activeSec>0);assert.equal(logged[1].correct,0);
   await page.click('#nm-ws-grade');assert.equal((await load(page)).studyLog.events.length,2,'repeat grade is not another observation');
   await page.click('#nm-ws-reroll');await page.click('#nm-ws-grade');assert.equal((await load(page)).studyLog.events.length,3);assert.equal((await load(page)).studyLog.events[2].answered,0);
   await page.click('#nm-ws-back');assert.equal(await page.evaluate(()=>!!document.getElementById('screen').__nmStudyClock),false,'clock listeners cleaned up on exit');
   await page.reload();await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await page.waitForSelector('#pdLevel');await panel(page);
   assert.equal((await load(page)).studyLog.events.length,3);assert.deepEqual((await load(page)).studyGoal,goal);assert.equal(await page.locator('.pd-projection-form [name="startSession"]').inputValue(),'2');
   // Storage-full injection: no false saved message and no in-memory duplicate lock.
   await page.evaluate(()=>{window.__storageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='nm_state_v1')throw new DOMException('fixture-full','QuotaExceededError');return window.__storageSet.call(this,k,v);};});
   await page.locator('.pd-session-confirm > summary').click();const fail=page.locator('.pd-session-form');await fail.locator('[name="session"]').fill('2');await fail.locator('[name="minutes"]').fill('20');await fail.locator('[name="whole"]').check();await fail.locator('button[type="submit"]').click();
   assert.match(await fail.locator('[role="status"]').textContent(),/저장하지 못/);assert.equal(await page.evaluate(()=>window.NM_STUDY_RECORDS.snapshot().studyLog.events.length),3);
   await page.evaluate(()=>Storage.prototype.setItem=window.__storageSet);await fail.locator('button[type="submit"]').click();assert.equal((await load(page)).studyLog.events.length,4);
  }
  const protectedAfter=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({progress:s.progress,coins:s.coins,amount:s.roadAmount,speed:s.roadSpeed,cad:s.roadCadence});});assert.equal(protectedAfter,protectedBefore);
  assert.deepEqual(errors,[]);report.push({lang,width,ready,webgl:WEBGL,protectedStateUnchanged:true,errors});
 }catch(e){await page.screenshot({path:path.join(OUT,'failure-'+lang+'-'+width+'.png')});fs.writeFileSync(path.join(OUT,'failure-dom.txt'),await page.locator('body').innerText());throw e;}finally{await ctx.close();}
}
fs.writeFileSync(path.join(OUT,'browser-report.json'),JSON.stringify(report,null,2));console.log('STUDY_RECORDS_BROWSER_OK cases='+report.length+' externalWrites=0');
}finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
