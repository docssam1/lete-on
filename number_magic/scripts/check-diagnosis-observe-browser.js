#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_DIAG_ARTIFACTS;
if(!OUT||!path.isAbsolute(OUT)||(process.platform==='win32'&&!/^[E]:[\\/]/i.test(OUT))||path.resolve(OUT)===path.parse(path.resolve(OUT)).root)throw Error('Set NM_DIAG_ARTIFACTS to a dedicated absolute directory (E: on Windows)');fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
const seed=lang=>({lang,onboarded:true,name:'진단 검수',view:'placement',avatar:{kind:'boy'},character:{number:3,color:'gold'},coins:321,progress:{'A-02':{introSeen:true,steps:{}}},account:{status:'active'},r0BannerSeen:true,roadSpeed:.85,roadAmount:1.5,roadCadence:'w1',roadManual:false,cloudLinked:false});
async function context(browser,base,width,lang){const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await ctx.route('**/*',r=>new URL(r.request().url()).origin===base&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify(s));},seed(lang));return ctx;}
async function openDiagnostic(page){
 await page.waitForSelector('#pdAge,#pdSkip,#townCourseRoad,#ttGame',{timeout:30000});
 if(await page.locator('#pdAge,#pdSkip').count())return;
 if(await page.locator('#ttGame').isVisible())await page.click('#ttGame');
 for(let i=0;i<4;i++){const close=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(!await close.count())break;await close.last().click();}
 await page.click('#townCourseRoad');await page.click('#crDiag');await page.waitForSelector('#pdAge,#pdSkip');
}
async function enter(page,base){await page.goto(base+'/number_magic/index.html?enter=1');await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);}
async function overflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'viewport horizontal overflow');}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser,webgl;const report=[];
try{
 browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
 for(const lang of (process.argv.includes('--webgl-only')?[]:['ko','en','zh']))for(const width of [390,1280]){
  const ctx=await context(browser,base,width,lang),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),async el=>el.click(),{noWaitAfter:true});
   await enter(page,base);assert(await page.locator('#pdStart').isDisabled());assert.equal(await page.locator('[data-route]').count(),3);
   assert.equal(await page.locator('#pdSeries,#pdStep,#pdProgress').count(),0,'no duplicate progress questionnaires');
   await page.selectOption('#pdAge','6');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-split5');
   await page.click('[data-route="unlearned"]');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-count5');
   await page.selectOption('#pdAge','16');await page.click('[data-route="age"]');assert.equal(await page.locator('[data-route="school"],#pdSemester').count(),0,'age and school merged');
   await page.selectOption('#pdGrade','m2');assert.equal(await page.locator('#pdBaseline').inputValue(),'c32');
   await page.click('[data-route="book"]');await page.selectOption('#pdSeries','kumon');await page.selectOption('#pdStep','stage-i');assert(await page.locator('#pdStart').isDisabled(),'unknown book mapping needs topic confirmation');
   await page.selectOption('#pdBaseline','c35');assert.equal(await page.locator('#pdStart').isDisabled(),false);
   if(lang==='ko'&&width===390){
    for(const series of ['soma-p','soma-k','soma-a','soma-b','soma-c','dunoro']){
     await page.selectOption('#pdSeries',series);assert.equal(await page.locator('#pdStep').count(),0,'do not show a meaningless single-item selector');assert(await page.locator('#pdStart').isDisabled());
     await page.fill('#pdBookDetail','교재 표기 참고');await page.selectOption('#pdBaseline','f-split5');assert.equal(await page.locator('#pdStart').isDisabled(),false);
    }
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-topic.png')});
    await page.selectOption('#pdSeries','miracle');await page.selectOption('#pdStep','pre-2023-v1-order');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-order10');assert.equal(await page.locator('#pdStart').isDisabled(),false);
    await page.selectOption('#pdStep','elem-2021-v10');assert(await page.locator('#pdStart').isDisabled(),'whole-volume metadata must not certify a baseline');
   }
   await page.click('[data-route="age"]');await page.selectOption('#pdAge','16');assert.equal(await page.locator('#pdBaseline').inputValue(),'c35');
   await page.locator('.pd-selection details summary').click();await page.selectOption('#pdBaseline','f-count5');assert.equal(await page.locator('.pd-selection details').getAttribute('open'),'');
   await page.locator('.pd-selection details summary').click();await page.selectOption('#pdAge','6');await page.click('[data-route="unlearned"]');await overflow(page);await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));await page.screenshot({path:path.join(OUT,lang+'-'+width+'-setup.png')});
   if(lang==='ko'&&width===390){
    const before=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});});
    await page.click('#pdStart');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.plan.items.length),20);
    await page.click('#pdSkip');const saved=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});});
    await page.reload();await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);
    assert.equal(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});}),saved,'answered plan resumes unchanged');
    for(let i=1;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    assert.equal(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});}),before,'results cannot change workload or achievements');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).placement.autoPlan.cadence),'w1');assert.equal(await page.locator('.pd-route-planner').count(),1);
    await page.screenshot({path:path.join(OUT,'ko-390-result.png')});
   }
   await page.goto(base+'/number_magic/placement-sheet.html?b=f-count5&seed=browser-observe&l='+lang);await page.waitForFunction(()=>window.NM_WS_READY);
   await page.click('#plGo');assert.match(await page.locator('#plOut').innerText(),lang==='ko'?/미입력/:lang==='en'?/Unmarked/:/未填写/);
   await page.locator('input[name="q0"][value="o"]').check();await page.selectOption('[data-unlearned="0"]','n');assert.equal(await page.locator('input[name="q0"]:checked').count(),0);
   await page.locator('input[name="q0"][value="o"]').check();assert.equal(await page.locator('[data-unlearned="0"]').inputValue(),'');
   for(let i=1;i<20;i++)await page.locator('input[name="q'+i+'"][value="'+(i>=16?'x':'o')+'"]').check();
   await page.click('#plGo');const text=await page.locator('#plOut').innerText();assert(text.includes('6/6')&&text.includes('10/10')&&text.includes('0/4'));assert.equal(await page.locator('#plOut li').count(),0,'next-stage X is not a current gap');
   await overflow(page);const overlap=await page.locator('.pl-sc-item').evaluateAll(rows=>rows.some(row=>{const r=row.getBoundingClientRect();return [...row.children].some(e=>{const x=e.getBoundingClientRect();return x.right>r.right+1||x.left<r.left-1;});}));assert.equal(overlap,false,'OX controls fit their row');
   assert.equal(await page.locator('.pl-sc-item label,.pl-sc-item select').evaluateAll(xs=>xs.some(x=>x.getBoundingClientRect().height<44)),false);
   await page.locator('#plScore').screenshot({path:path.join(OUT,lang+'-'+width+'-paper-marks.png')});
   if(lang==='ko'&&width===1280){
    await page.locator('.pd-route-planner summary').click();
    for(const [name,value] of Object.entries({frequency:'2',minutes:'20',observedWeeks:'2',observedVisits:'4',completedSessions:'4',observedMinutes:'80'}))await page.locator('[name="'+name+'"]').fill(value);
    await page.locator('.pd-projection-form button[type="submit"]').click();await page.waitForFunction(()=>!!document.querySelector('.pd-projection-fallback')?.textContent);
    assert.equal(await page.locator('.pd-projection-stage').isVisible(),false);assert.equal(await page.locator('.pd-projection-table tbody tr').count(),3);
    assert.equal(await page.locator('[data-route-preview="2"]').isDisabled(),true,'unreviewed increase is locked');
    assert.equal((await page.locator('.pd-projection-result').innerText()).includes('추가 학습시간 예산'),false,'no quantified increase before review');
   }
   // PDF artifact is a diagnostic capture, not a learner-facing deliverable.
   assert.deepEqual(errors,[]);report.push({lang,width,ui:true,paper:true,errors});
  }catch(e){await page.screenshot({path:path.join(OUT,'failure-'+lang+'-'+width+'.png')});fs.writeFileSync(path.join(OUT,'failure-dom.txt'),await page.locator('body').innerText());throw e;}finally{await ctx.close();}
 }
 // Real WebGL branch renderer, with actual Number Magic course data and isolated profile.
 webgl=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 for(const width of [390,1280]){
  const ctx=await context(webgl,base,width,'ko'),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),async el=>el.click(),{noWaitAfter:true});
   page.on('console',m=>{if(m.text().startsWith('[study-route]'))console.log(m.text());});
   await page.goto(base+'/number_magic/placement-sheet.html?b=c1&seed=branches&l=ko');await page.waitForFunction(()=>window.NM_WS_READY);
   for(let i=0;i<20;i++)await page.locator('input[name="q'+i+'"][value="o"]').check();await page.click('#plGo');
   await page.locator('.pd-route-planner summary').click();
   for(const [name,value] of Object.entries({startDate:'2026-10-15',targetDate:'2026-12-10',frequency:'2',minutes:'20',observedWeeks:'2',observedVisits:'4',completedSessions:'4',observedMinutes:'80',reviewSessions:'2'}))await page.locator('[name="'+name+'"]').fill(value);
   await page.locator('[name="reviewed"]').check();const state=await page.evaluate(()=>localStorage.getItem('nm_state_v1'));await page.locator('.pd-projection-form button[type="submit"]').click();
   const stage=page.locator('.pd-projection-stage');await page.waitForFunction(()=>document.querySelector('.pd-projection-stage')?.dataset.renderer==='webgl',null,{timeout:45000});
   await stage.scrollIntoViewIfNeeded();const start=await stage.evaluate(e=>e.__studyBranches.debug());assert.equal(start.curves,3);assert(start.meshes>4);
   await page.locator('.pd-projection-week').fill('1');const held=await stage.evaluate(e=>e.__studyBranches.debug());assert.deepEqual(held.beads[0],held.beads[1]);assert.deepEqual(held.beads[0],held.beads[2]);
   await page.locator('[data-route-preview="2"]').click();await page.locator('.pd-projection-week').fill('3');assert.equal(await stage.evaluate(e=>e.__studyBranches.debug().selected),2);assert.equal(await stage.evaluate(e=>e.__studyBranches.debug().week),3);
   await page.locator('[data-orbit="1"]').click();await overflow(page);await page.waitForTimeout(100);await stage.screenshot({path:path.join(OUT,'branches-'+width+'.png')});
   assert.equal(await page.evaluate(()=>localStorage.getItem('nm_state_v1')),state,'scenario comparisons do not mutate learner state');
   await stage.evaluate(e=>{window.__priorStudyBranches=e.__studyBranches;});
   if(width===390){await stage.evaluate(e=>e.__studyBranches._debug.renderer.getContext().getExtension('WEBGL_lose_context').loseContext());await stage.waitFor({state:'hidden'});assert.equal(await page.locator('.pd-projection-table tbody tr').count(),3);assert.equal(await page.locator('.pd-projection-controls').isVisible(),false);}
   await page.locator('[name="reviewSessions"]').fill('3');assert.equal(await page.locator('.pd-projection-stage').count(),0,'changed assumptions remove stale results');
   assert.equal(await page.evaluate(()=>window.__priorStudyBranches.debug().disposed),true,'old GPU scene is disposed');
   if(width===1280){await page.selectOption('[name="targetCourse"]','C73');await page.locator('.pd-projection-form button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('.pd-projection-stage')?.dataset.renderer==='webgl');assert(await page.locator('.pd-study-label.is-axis').count()<=13,'wide curriculum axis samples labels instead of overlapping all 74');}
   assert.deepEqual(errors,[]);report.push({width,webgl:true,curves:start.curves,comparisonDoesNotWrite:true});
  }catch(e){await page.screenshot({path:path.join(OUT,'failure-webgl-'+width+'.png')});fs.writeFileSync(path.join(OUT,'failure-webgl-dom.txt'),await page.locator('body').innerText());throw e;}finally{await ctx.close();}
 }
 fs.writeFileSync(path.join(OUT,'browser-report.json'),JSON.stringify(report,null,2));console.log('DIAGNOSIS_OBSERVE_BROWSER_OK cases='+report.length+' externalWrites=0');
}catch(e){fs.writeFileSync(path.join(OUT,'failure.txt'),e.stack);throw e;}finally{if(browser)await browser.close();if(webgl)await webgl.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
