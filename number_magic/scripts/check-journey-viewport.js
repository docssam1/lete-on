#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process'),{chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_VIEWPORT_ARTIFACTS&&path.resolve(process.env.NM_VIEWPORT_ARTIFACTS);
const LIVE=process.env.NM_JOURNEY_BASE,baseline=process.argv.find(a=>a.startsWith('--baseline='))?.split('=')[1];
if(OUT&&!/^[EG]:[\\/]/i.test(OUT))throw Error('Artifacts must be on E: or G:');
if(LIVE&&new URL(LIVE).origin!=='https://lete-on.gfieldacademy.net')throw Error('Unexpected production origin');
const old=new Map(),files=['index.html','app/main.js','app/living-lesson.js','app/living-lesson.css','app/activity-journey.js','app/journey-stage.js'];
if(baseline)for(const f of files)old.set('number_magic/'+f,execFileSync('git',['show',baseline+':number_magic/'+f],{cwd:ROOT,encoding:'utf8',maxBuffer:8e6}));
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.woff2':'font/woff2','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');const rel=path.relative(ROOT,file).replaceAll('\\','/');if(old.has(rel))return res.end(old.get(rel));fs.createReadStream(file).pipe(res);});
const seed=lang=>({lang,onboarded:true,name:'배치 검수',view:'unit',unit:'A-02',step:'discover',sub:{},avatar:{kind:'boy'},character:{number:3,color:'gold'},cloudLinked:false,placement:{course:'C1',self:true},symbolDex:{'+':{},'-':{},'−':{},'=':{},'□':{},'×':{}},progress:{'A-02':{introSeen:true,steps:{}}},coins:0,account:{status:'active'},r0BannerSeen:true});
async function check(browser,base,width,height,motion='reduce',lang='ko',large=false){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:motion,hasTouch:width<600}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===new URL(base).origin&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort();});
 await page.addInitScript(s=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify(s));},seed(lang));
 const host=page.locator('#livingLesson'),prefix=`${width}-${height}-${motion}-${lang}${large?'-large':''}`;
 const shot=async tag=>{if(OUT)await page.screenshot({path:path.join(OUT,prefix+'-'+tag+'.png')});};
 const stable=()=>page.waitForFunction(()=>document.querySelector('#livingLesson')?.dataset.saved==='true'&&document.querySelector('#livingLesson').dataset.moving!=='true');
 const press=async(action,value='')=>{await host.locator(`[data-action="${action}"][data-value="${value}"]`).click();await stable();};
 const geometry=()=>host.evaluate(e=>{const bounds=n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height};};return {screen:bounds(e.closest('#screen')),stage:bounds(e.querySelector('.nm-live-stage')),question:bounds(e.querySelector('.nm-live-question')),controls:bounds(e.querySelector('.nm-journey-controls')),scroll:e.closest('#screen').scrollTop};});
 try{
  await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click();
  await page.waitForFunction(()=>document.querySelector('#livingLesson')?.__livingLesson&&document.querySelector('#livingLesson .nm-live-stage')?.dataset.renderer==='webgl');await stable();
  for(let i=0;i<30;i++){const close=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(!await close.count())break;await close.last().click();}
  await page.locator('.nm-confetti').first().waitFor({state:'detached',timeout:10000});
  if(large){await page.addStyleTag({content:'.nm-journey .nm-live-question{font-size:48px!important}.nm-journey .nm-journey-controls button{font-size:44px!important}.nm-journey .nm-live-equation{font-size:64px!important}'});}
  await press('predict','2');await press('begin');
  const fit=height>=800&&!large;let g=await geometry();
  if(fit){assert(g.stage.top>=g.screen.top-1,'whole manipulative remains above the fold after begin');assert(g.stage.bottom<=g.screen.bottom+1,'whole manipulative fits');assert(g.controls.bottom<=g.screen.bottom+1,'primary controls fit with the manipulative');assert(g.question.top>=g.screen.top-1);}
  assert(g.stage.height>=240,'do not make the manipulative unreadably small');await shot('select');
  const scoring=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return {progress:s.progress,coins:s.coins};}),beforeScore=await scoring();
  const token=host.locator('[data-action="select"][data-value="R03"]');await token.focus();await page.keyboard.press('Space');await stable();assert.equal(await token.getAttribute('aria-pressed'),'true');assert.equal(await token.evaluate(b=>b===document.activeElement),true,'replace controls without losing keyboard focus');
  await press('select','R04');
  const originalIds=await host.evaluate(e=>e.__livingLesson.getVisualState().objects.map(o=>o.id).sort());assert.equal(originalIds.length,15);
  const poseBefore=await host.evaluate(e=>e.__livingLesson.getVisualState());
  await host.locator('[data-action="move"]').click();
  let flight=null;
  if(motion==='no-preference'){
   assert.equal(await host.getAttribute('data-moving'),'true');assert.equal(await host.locator('.nm-live-equation').innerText(),'8 + 7 = ?','do not announce regrouping before arrival');
   assert.equal(await host.locator('[data-object="left-count"]').innerText(),'8');assert.equal(await host.locator('[data-object="right-count"]').innerText(),'7');
   await page.waitForTimeout(130);flight=await host.evaluate(e=>e.__livingLesson.getVisualState());
   assert.deepEqual(flight.objects.map(o=>o.id).sort(),originalIds);
   assert(flight.objects.find(o=>o.id==='R03').position[1]>.16,'the original piece visibly lifts');
   const revision=await host.evaluate(e=>e.__livingLesson.getState().revision);await host.evaluate(e=>e.__livingLesson.dispatch('move',''));assert.equal(await host.evaluate(e=>e.__livingLesson.getState().revision),revision,'rapid extra move is ignored');
   await shot('flight');
   if(width===390){
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    await page.waitForTimeout(850);assert.equal(await host.getAttribute('data-moving'),'true','hidden lesson must not announce arrival on a timer');assert.equal(await host.locator('.nm-live-equation').innerText(),'8 + 7 = ?');
    await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
   }
  }
  await stable();assert.equal(await host.locator('.nm-live-equation').innerText(),'8 + 7 = 8 + 2 + 5');assert.equal(await host.locator('[data-object="left-count"]').innerText(),'10');assert.equal(await host.locator('[data-object="right-count"]').innerText(),'5');
  const arrival=await host.evaluate(e=>e.__livingLesson.getVisualState());assert.deepEqual(arrival.objects.map(o=>o.id).sort(),originalIds);
  const verticalTrays=await host.locator('.nm-live-stage').evaluate(e=>e.clientWidth<600);
  for(const [i,id] of ['R03','R04'].entries()){const p=arrival.objects.find(o=>o.id===id).position;assert(Math.abs(p[1]-.16)<.001);assert(Math.abs(p[2]-(verticalTrays?-.85:.3))<.001);assert(Math.abs(p[0]-((verticalTrays?-1.68:-3.1)+(3+i)*.84))<.001);}
  g=await geometry();if(fit){assert(g.stage.top>=g.screen.top-1);assert(g.stage.bottom<=g.screen.bottom+1);assert(g.controls.bottom<=g.screen.bottom+1);}await shot('arrived');
  await press('undo');assert.equal(await host.locator('.nm-live-equation').innerText(),'8 + 7 = ?');await press('move');await press('group');
  assert.equal(await host.locator('.nm-live-equation').innerText(),'8 + 2 + 5 = 10 + 5');assert.equal(await host.locator('.nm-live-equation').innerText().then(t=>t.endsWith('15')),false,'total answer is still hidden');
  await host.locator('input[name="answer"]').fill('15');await host.locator('.nm-journey-answer button').click();await stable();await press('meaning','moved');assert.deepEqual(await scoring(),beforeScore);
  await host.locator('.nm-journey-tools summary').click();assert.equal(await host.locator('[data-action="reset"]').isVisible(),true);await shot('tools');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.deepEqual(errors,[]);
  const small=await host.locator('button:visible,summary:visible').evaluateAll(bs=>bs.filter(b=>b.getBoundingClientRect().width<48||b.getBoundingClientRect().height<48).map(b=>b.textContent));assert.deepEqual(small,[]);
  return {width,height,motion,lang,large,fitRequired:fit,geometry:g,identities:originalIds,poseBefore,flight,arrival,errors,scoringUnchanged:true};
 }catch(e){await shot('failure');throw e;}finally{await context.close();}
}
(async()=>{if(OUT)fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
 browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});const base=LIVE||`http://127.0.0.1:${server.address().port}`,results=[];
 const matrix=baseline?[[390,844,'reduce','ko',false]]:[[390,844,'no-preference','ko',false],[1280,900,'no-preference','ko',false],[320,800,'reduce','ko',false],[390,667,'reduce','ko',false],[844,390,'reduce','ko',false],[390,844,'reduce','en',false],[390,844,'reduce','zh',false],[390,844,'reduce','ko',true]];
 for(const args of matrix){results.push(await check(browser,base,...args));console.log('PASS viewport '+args.join('/'));}
 if(OUT)fs.writeFileSync(path.join(OUT,'journey-viewport.json'),JSON.stringify({base,baseline:baseline||null,softwareWebGL:true,results},null,2));console.log('OK: A-02 viewport, arrival-gated equation/counts, identity, keyboard focus, undo, secondary tools, unchanged scores');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
