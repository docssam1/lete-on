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
  const ctx=await context(browser,base,width,lang),page=await ctx.newPage(),errors=[];let completedBookSheetHref='';page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),async el=>el.click(),{noWaitAfter:true});
   await enter(page,base);assert(await page.locator('#pdStart').isDisabled());assert.equal(await page.locator('[data-route]').count(),4);
   assert.equal(await page.locator('#pdSeries,#pdStep,#pdBookCourse,#pdBookDetail,#pdProgress').count(),0,'no duplicate progress questionnaires or free-text book detail');
   await page.selectOption('#pdAge','6');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-split5');
   await page.click('[data-route="unlearned"]');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-count5');
   await page.click('[data-route="school"]');assert.equal(await page.locator('#pdAge').count(),0,'school progress does not require age');
   await page.selectOption('#pdSchoolGrade','e3');await page.selectOption('#pdSemester','2');
   assert.equal(await page.locator('#pdBaseline').inputValue(),'','school grade does not claim a studied topic');
   assert(await page.locator('#pdStart').isDisabled());await page.selectOption('#pdBaseline','c8');
   assert.equal(await page.locator('#pdStart').isDisabled(),false);
   const schoolHref=await page.locator('#pdPaper').getAttribute('href');
   assert(schoolHref.includes('route=school')&&schoolHref.includes('grade=e3')&&schoolHref.includes('semester=2'),'school-only print link retains grade and semester');
   await page.selectOption('#pdSemester','1');assert.equal(await page.locator('#pdBaseline').inputValue(),'','changing semester clears the diagnostic topic');
   await page.click('[data-route="age"]');await page.selectOption('#pdAge','16');
   await page.selectOption('#pdGrade','m2');assert.equal(await page.locator('#pdBaseline').inputValue(),'c32');
   await page.click('[data-route="book"]');await page.selectOption('[data-book-series="0"]','kumon');await page.selectOption('[data-book-step="0"]','stage-i');assert(await page.locator('#pdStart').isDisabled(),'unknown book mapping needs topic confirmation');
   await page.selectOption('#pdBaseline','c35');assert.equal(await page.locator('#pdStart').isDisabled(),false);
   await page.selectOption('[data-book-series="0"]','dunoro');await page.selectOption('[data-book-step="0"]','level-3');
   assert.deepEqual(await page.locator('[data-book-course="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:9},(_,i)=>String(i+17))]);
   assert.equal(await page.locator('#pdBookDetail,.pd-book-detail').count(),0,'book detail is selected, never typed');
   await page.selectOption('[data-book-course="0"]','17');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.selection.completedBooks[0].bookCourseNumber),17,'book course number is saved as a number');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.selection.completedBooks[0].bookStatus),'completed','only a newly confirmed choice is recorded as completed');
   assert(await page.locator('#pdStart').isDisabled(),'book course number alone cannot select an app starting point');
   await page.selectOption('[data-book-step="0"]','level-2');assert.equal(await page.locator('[data-book-course="0"]').inputValue(),'');assert.equal(await page.locator('#pdBaseline').inputValue(),'');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.selection.completedBooks[0].bookCourseNumber),null,'changing the level clears its course number');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.selection.completedBooks[0].bookStatus),'','changing the level clears completed status');
   await overflow(page);
   if(lang==='ko'&&width===390){
    for(const [series,volumeCount] of [['soma-p',8],['soma-k',8],['soma-a',8],['soma-b',8],['soma-c',8],['soma-d',6]]){
     await page.selectOption('[data-book-series="0"]',series);
     assert.deepEqual(await page.locator('[data-book-step="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:volumeCount},(_,i)=>'v'+(i+1))],series+' has every printed volume');
     assert.equal(await page.locator('#pdBookDetail,.pd-book-detail').count(),0,'no typed volume fallback');
     assert(await page.locator('#pdStart').isDisabled(),'a series alone is not a completed volume');
     await page.selectOption('[data-book-step="0"]','v1');assert(await page.locator('#pdStart').isDisabled(),'an unverified volume still needs a diagnostic topic');
     await page.selectOption('#pdBaseline','f-split5');assert.equal(await page.locator('#pdStart').isDisabled(),false);
     assert((await page.locator('#pdBaselinePreview').innerText()).includes('완료한 교재'),'selected completed volume appears beside the question mix');
     await page.selectOption('[data-book-step="0"]','v'+volumeCount);assert.equal(await page.locator('#pdBaseline').inputValue(),'','changing a completed volume clears the old diagnostic topic');
     assert(await page.locator('#pdStart').isDisabled(),'stale topic cannot create a sheet for a new volume');
    }
    await page.selectOption('[data-book-series="0"]','dunoro');
    assert.deepEqual((await page.locator('[data-book-step="0"] option').evaluateAll(rows=>rows.map(x=>x.value))).slice(0,4),['','level-1','level-2','level-3'],'recorded levels 1–3 are selectable');
    assert((await page.locator('.pd-selection').innerText()).includes('두뇌로 교재 과정 번호와 이 앱의 과정 번호는 다릅니다.'));
    for(const [step,first,last] of [['level-1',1,10],['level-2',11,16],['level-3',17,25]]){
     await page.selectOption('[data-book-step="0"]',step);assert(await page.locator('#pdStart').isDisabled(),'completed level still needs its printed course and diagnostic topic');
     assert.deepEqual(await page.locator('[data-book-course="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:last-first+1},(_,i)=>String(first+i))],step+' exposes only its printed course numbers');
     assert(await page.locator('#pdBaseline').isDisabled(),'a level without its last completed course cannot choose a diagnostic topic');
     await page.selectOption('[data-book-course="0"]',String(last));assert.equal(await page.locator('#pdBaseline').inputValue(),'','choosing a different course clears the old topic');
     assert(await page.locator('#pdStart').isDisabled());
     await page.selectOption('#pdBaseline','f-split5');assert.equal(await page.locator('#pdStart').isDisabled(),false);
    }
    await page.selectOption('[data-book-step="0"]','level-2');
    assert.equal(await page.locator('[data-book-course="0"]').inputValue(),'','changing book level clears the old course number');
    assert(await page.locator('#pdBaseline').isDisabled(),'changing book level clears the old topic');
    assert(await page.locator('#pdStart').isDisabled());
    await page.selectOption('[data-book-course="0"]','16');
    await page.selectOption('#pdBaseline','f-split5');
    await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-topic.png')});
    await page.selectOption('[data-book-series="0"]','miracle');await page.selectOption('[data-book-step="0"]','pre-2023-v1-order');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-order10');assert.equal(await page.locator('#pdStart').isDisabled(),false);
    await page.selectOption('[data-book-step="0"]','elem-2021-v10');assert(await page.locator('#pdStart').isDisabled(),'whole-volume metadata must not certify a baseline');
   }
   await page.click('[data-route="age"]');await page.selectOption('#pdAge','16');assert.equal(await page.locator('#pdBaseline').inputValue(),'c35');
   await page.locator('.pd-selection details summary').click();await page.selectOption('#pdBaseline','f-count5');assert.equal(await page.locator('.pd-selection details').getAttribute('open'),'');
   await page.locator('.pd-selection details summary').click();await page.selectOption('#pdAge','6');await page.click('[data-route="unlearned"]');await overflow(page);await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));await page.screenshot({path:path.join(OUT,lang+'-'+width+'-setup.png')});
   if(lang==='ko'&&width===390){
    const before=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});});
    await page.click('#pdStart');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))._diag.plan.items.length),20);
    assert.deepEqual(await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nm_state_v1'))._diag.plan.items;return items.reduce((counts,item)=>(counts[item.band]++,counts),{previous:0,current:0,next:0});}),{previous:6,current:10,next:4},'online plan keeps previous/current/next at 6/10/4');
    await page.click('#pdSkip');const saved=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});});
    await page.reload();await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);
    assert.equal(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});}),saved,'answered plan resumes unchanged');
    for(let i=1;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    assert.equal(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});}),before,'results cannot change workload or achievements');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).placement.autoPlan.cadence),'w1');assert.equal(await page.locator('.pd-route-planner').count(),1);
    await page.screenshot({path:path.join(OUT,'ko-390-result.png')});
    await page.click('#pdAgain');await page.click('[data-route="book"]');
    await page.selectOption('[data-book-series="0"]','dunoro');await page.selectOption('[data-book-step="0"]','level-3');await page.selectOption('[data-book-course="0"]','17');
    await page.click('#pdAddBook');assert.equal(await page.locator('[data-book-row]').count(),2);
    await page.selectOption('[data-book-series="1"]','soma-p');await page.selectOption('[data-book-edition="1"]','2019');await page.selectOption('[data-book-step="1"]','v1');
    assert(await page.locator('#pdStart').isDisabled(),'adding another book requires a newly confirmed app topic');
    await page.selectOption('#pdBaseline','c18');completedBookSheetHref=await page.locator('#pdPaper').getAttribute('href');
    const linkedBooks=JSON.parse(new URLSearchParams(completedBookSheetHref.split('?')[1]).get('books'));
    assert.deepEqual(linkedBooks.map(x=>[x.series,x.step,x.bookCourseNumber,x.editionId]),[['dunoro','level-3',17,''],['soma-p','v1',null,'2019']],'print link carries both completed books');
    await overflow(page);
    assert.equal(await page.locator('.pd-book-row select,.pd-book-add,.pd-book-remove').evaluateAll(xs=>xs.some(x=>x.getBoundingClientRect().height<44)),false,'book controls meet mobile touch height');
    await page.screenshot({path:path.join(OUT,'ko-390-multi-books.png'),fullPage:true});
    await page.click('#pdStart');
    assert.deepEqual(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_state_v1'))._diag;return d.plan.items.reduce((counts,item)=>(counts[item.band]++,counts),{previous:0,current:0,next:0});}),{previous:6,current:10,next:4},'completed-book plan keeps previous/current/next at 6/10/4');
    for(let i=0;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    const resultText=await page.locator('.pd-recommended').innerText();
    assert(resultText.includes('완료한 교재')&&resultText.includes('교재 과정 17')&&resultText.includes('소마셈 P')&&resultText.includes('수의 마법 과정'),'result identifies both completed books separately from the app course');
    assert.deepEqual(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1')).placement.selection;return s.completedBooks.map(x=>[x.series,x.step,x.bookCourseNumber,x.editionId]);}),[['dunoro','level-3',17,''],['soma-p','v1',null,'2019']],'result retains both completed books for later comparison');
    await page.click('#pdRoad');await page.locator('.pd-road-goal').waitFor();
    const roadText=await page.locator('.nm-cr-diagchip,.pd-road-goal').allInnerTexts();
    assert(roadText.join(' ').includes('완료한 교재 1')&&roadText.join(' ').includes('교재 과정 17')&&roadText.join(' ').includes('소마셈 P')&&roadText.join(' ').includes('수의 마법 과정'),'roadmap separates both completed books and app course numbers');
    await page.locator('.pd-road-goal').screenshot({path:path.join(OUT,'ko-390-dunoro-roadmap-detail.png')});
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-roadmap.png')});
    await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).placement.selection.completedBooks[0].bookCourseNumber),17,'book course number survives reload');
   }
   await page.goto(completedBookSheetHref?base+'/number_magic/'+completedBookSheetHref:base+'/number_magic/placement-sheet.html?b=f-count5&seed=browser-observe&l='+lang);await page.waitForFunction(()=>window.NM_WS_READY);
   if(completedBookSheetHref){const source=(await page.locator('.pl-source').allInnerTexts()).join(' ');assert(source.includes('완료한 교재')&&source.includes('Level 3')&&source.includes('교재 과정 17')&&source.includes('소마셈 P'),'printed sheet names both completed books');assert.equal(await page.locator('.pl-sc-item').count(),20);}
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
