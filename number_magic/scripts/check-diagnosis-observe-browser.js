#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_DIAG_ARTIFACTS;
if(!OUT||!path.isAbsolute(OUT)||(process.platform==='win32'&&!/^[E]:[\\/]/i.test(OUT))||path.resolve(OUT)===path.parse(path.resolve(OUT)).root)throw Error('Set NM_DIAG_ARTIFACTS to a dedicated absolute directory (E: on Windows)');fs.mkdirSync(OUT,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
const seed=lang=>({lang,onboarded:true,name:'진단 검수',view:'placement',avatar:{kind:'boy'},character:{number:3,color:'gold'},coins:321,progress:{'A-02':{introSeen:true,steps:{}}},account:{status:'active'},r0BannerSeen:true,roadSpeed:.85,roadAmount:1.5,roadCadence:'w1',roadManual:false,cloudLinked:false});
async function context(browser,base,width,lang){const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await ctx.route('**/*',r=>new URL(r.request().url()).origin===base&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_preview_state_v1'))localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},seed(lang));return ctx;}
async function openDiagnostic(page){
 await page.waitForSelector('#pdLevel,#pdStart,#pdSkip,#pdResumeOnline,#townCourseRoad,#ttGame',{timeout:30000});
 // An unfinished online check asks before continuing (app/placement-ui.js).
 if(await page.locator('#pdResumeOnline').count()){await page.click('#pdResumeOnline');await page.waitForSelector('#pdSkip');return;}
 if(await page.locator('#pdLevel,#pdStart,#pdSkip').count())return;
 if(await page.locator('#ttGame').isVisible())await page.click('#ttGame');
 for(let i=0;i<4;i++){const close=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(!await close.count())break;await close.last().click();}
 await page.click('#townCourseRoad');await page.click('#crDiag');await page.waitForSelector('#pdLevel,#pdStart,#pdSkip');
}
async function enter(page,base){await openPreview(page,base);await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);}
async function overflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'viewport horizontal overflow');}
// app/entry.js admits index.html only once per hand-off from access.html; 「가입 전에 체험하기」 grants a preview
// (app/access.js grant('preview')), whose learner record lives in nm_preview_state_v1.
async function openPreview(page,base){await page.goto(base+'/number_magic/access.html');await page.evaluate(()=>sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'preview',at:Date.now(),userId:null})));await page.goto(base+'/number_magic/index.html?enter=1');}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser,webgl;const report=[];
try{
 browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
 for(const lang of (process.argv.includes('--webgl-only')?[]:['ko','en','zh']))for(const width of [390,1280]){
  const ctx=await context(browser,base,width,lang),page=await ctx.newPage(),errors=[];let completedBookSheetHref='';page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),async el=>el.click(),{noWaitAfter:true});
   await enter(page,base);assert(await page.locator('#pdStart').isDisabled());assert.equal(await page.locator('[data-route]').count(),3);assert.equal(await page.locator('[data-route="school"]').count(),0,'the school-progress route was retired');
   assert.equal(await page.locator('#pdSeries,#pdStep,#pdBookCourse,#pdBookDetail,#pdProgress').count(),0,'no duplicate progress questionnaires or free-text book detail');
   await page.selectOption('#pdLevel','a6');assert.match(await page.locator('#pdBaseline').inputValue(),/^f-/,'a preschooler starts in the foundation stages');
   await page.click('[data-route="unlearned"]');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-count5');
   await page.click('[data-route="age"]');await page.selectOption('#pdLevel','m2');assert.equal(await page.locator('#pdBaseline').inputValue(),'c32');
   await page.click('[data-route="book"]');await page.selectOption('[data-book-series="0"]','kumon');await page.selectOption('[data-book-step="0"]','stage-i');assert(await page.locator('#pdStart').isDisabled(),'unknown book mapping needs topic confirmation');
   await page.selectOption('#pdBaseline','c35');assert.equal(await page.locator('#pdStart').isDisabled(),false);
   await page.selectOption('[data-book-series="0"]','dunoro');
   assert.equal(await page.locator('[data-book-step="0"]').count(),0,'Dunoro course is chosen directly, without a Level selector');
   assert.deepEqual(await page.locator('[data-book-course="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:25},(_,i)=>String(i+1)),'other']);
   assert.equal(await page.locator('#pdBookDetail,.pd-book-detail').count(),0,'book detail is selected, never typed');
   await page.selectOption('[data-book-course="0"]','17');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0].bookCourseNumber),17,'book course number is saved as a number');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0].step),'level-3','Level is derived from completed course 17');
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0].bookStatus),'completed','only a newly confirmed choice is recorded as completed');
   // 두뇌로 완료 과정 하나면 그 진도를 기준으로 이전 6 · 현재 10 · 다음 4 진단지가 바로 준비된다.
   assert.equal(await page.locator('#pdStart').isDisabled(),false,'a completed Dunoro course starts its own 6/10/4 paper');
   if(lang==='ko'){
    const hint=await page.locator('.pd-intake-hint').allInnerTexts();assert(hint.join(' ').includes('두뇌로 과정 17 완료 기준'),'the Dunoro scope is shown: '+JSON.stringify(hint));
    assert((await page.locator('.pd-note').allTextContents()).join(' ').includes('교재와 같은 주제나 문제 형식일 필요는 없어요'),'the book paper does not require identical textbook topics');
   }
   assert((await page.locator('#pdPaper').getAttribute('href')).includes('dunoro=17'),'the paper link carries the Dunoro course');
   await page.selectOption('[data-book-course="0"]','11');assert.equal(await page.locator('#pdBaseline').inputValue(),'');
   assert.deepEqual(await page.evaluate(()=>{const row=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0];return [row.step,row.bookCourseNumber,row.bookStatus];}),['level-2',11,'completed'],'changing the book course derives Level 2 and keeps a completed selection');
   await page.selectOption('[data-book-course="0"]','');
   assert.deepEqual(await page.evaluate(()=>{const row=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0];return [row.step,row.bookCourseNumber,row.bookStatus];}),['',null,''],'clearing the course clears derived Level and completed status');
   await overflow(page);
   if(lang==='ko'&&width===390){
    for(const [series,volumeCount] of [['soma-p',8],['soma-k',8],['soma-a',8],['soma-b',8],['soma-c',8],['soma-d',6]]){
     await page.selectOption('[data-book-series="0"]',series);
     assert.equal(await page.locator('[data-book-edition="0"]').inputValue(),'2019',series+' starts with the owner-selected 2019 publication');
     assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0].editionId),'2019','the default publication year is saved');
     assert.deepEqual(await page.locator('[data-book-step="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:volumeCount},(_,i)=>'v'+(i+1))],series+' has every printed volume');
     assert.equal(await page.locator('#pdBookDetail,.pd-book-detail').count(),0,'no typed volume fallback');
     assert(await page.locator('#pdStart').isDisabled(),'a series alone is not a completed volume');
     await page.selectOption('[data-book-step="0"]','v1');
     assert.equal(await page.locator('#pdStart').isDisabled(),false,'every selected 2019 volume has a topic paper');
     const href=await page.locator('#pdPaper').getAttribute('href');
     assert(href.includes(series==='soma-p'?'somaP=1':'bookSeries='+series+'&bookVolume=1'),'print link keeps the book volume');
     const paper=await ctx.newPage();await paper.goto(base+'/number_magic/'+href);await paper.waitForFunction(()=>window.NM_WS_READY);
     assert.equal(await paper.locator('.pl-q').count(),20,'2019 volume prints all 20 questions');await overflow(paper);await paper.close();
     await page.click('#pdRangeOptions summary');
     await page.selectOption('#pdBaseline','f-split5');assert.equal(await page.locator('#pdStart').isDisabled(),false);
     assert((await page.locator('#pdBaselinePreview').textContent()).includes('완료한 교재'),'selected completed volume appears beside the question mix');
     await page.selectOption('[data-book-step="0"]','v'+volumeCount);assert.equal(await page.locator('#pdBaseline').inputValue(),'','changing a completed volume clears the old diagnostic topic');
     assert.equal(await page.locator('#pdStart').isDisabled(),false,'each changed 2019 volume uses its own paper');
    }
    await page.selectOption('[data-book-series="0"]','soma-p');
    await page.selectOption('[data-book-edition="0"]','2013');await page.selectOption('[data-book-step="0"]','v2');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0].editionId),'2013','an explicit older publication is saved');
    await openPreview(page,base);await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);
    assert.equal(await page.locator('[data-book-edition="0"]').inputValue(),'2013','a previously selected 2013 publication survives reload');
    assert.equal(await page.locator('[data-book-step="0"]').inputValue(),'v2','the saved 2013 volume survives reload');
    await page.selectOption('[data-book-series="0"]','miracle');
    await page.selectOption('[data-book-series="0"]','soma-p');
    assert.equal(await page.locator('[data-book-edition="0"]').inputValue(),'2019','a newly selected Soma publication starts at 2019');
    await page.selectOption('[data-book-series="0"]','dunoro');
    assert.equal(await page.locator('[data-book-step="0"]').count(),0,'Dunoro has no separate Level step');
    assert((await page.locator('.pd-selection').innerText()).includes('두뇌로 교재 과정 번호와 이 앱의 과정 번호는 다릅니다.'));
    assert.deepEqual(await page.locator('[data-book-course="0"] option').evaluateAll(rows=>rows.map(x=>x.value)),['',...Array.from({length:25},(_,i)=>String(i+1)),'other'],'all 25 printed course numbers are in one selector');
    assert(await page.locator('#pdBaseline').isDisabled(),'no course means no diagnostic topic selection');
    for(const [step,course] of [['level-1',1],['level-1',10],['level-2',11],['level-2',16],['level-3',17],['level-3',25]]){
     await page.selectOption('[data-book-course="0"]',String(course));assert.equal(await page.locator('#pdBaseline').inputValue(),'','choosing a different course clears the old topic');
     assert.deepEqual(await page.evaluate(()=>{const row=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0];return [row.step,row.bookCourseNumber];}),[step,course],'boundary course derives the matching Level');
     assert.equal(await page.locator('#pdStart').isDisabled(),false,'course '+course+' starts its Dunoro paper');
     assert((await page.locator('#pdPaper').getAttribute('href')).includes('dunoro='+course));
     await page.click('#pdRangeOptions summary');await page.selectOption('#pdBaseline','f-split5');assert.equal(await page.locator('#pdStart').isDisabled(),false);
     assert(!(await page.locator('#pdPaper').getAttribute('href')).includes('dunoro='),'a chosen app topic replaces the Dunoro paper');
    }
    await page.selectOption('[data-book-course="0"]','other');
    assert.deepEqual(await page.evaluate(()=>{const row=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.selection.completedBooks[0];return [row.step,row.bookCourseNumber];}),['contents',null],'other course notation stays outside numbered Levels');
    assert.equal(await page.locator('#pdBaseline').inputValue(),'','other course notation clears the prior app topic');
    await page.selectOption('[data-book-course="0"]','16');
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-course.png')});
    await page.click('#pdRangeOptions summary');await page.selectOption('#pdBaseline','f-split5');
    await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-topic.png')});
    await page.selectOption('[data-book-series="0"]','miracle');await page.selectOption('[data-book-step="0"]','pre-2023-v1-order');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-order10');assert.equal(await page.locator('#pdStart').isDisabled(),false);
    await page.selectOption('[data-book-step="0"]','elem-2021-v10');
    assert.equal(await page.locator('#pdStart').isDisabled(),false,'identified Miracle volume starts a topic paper');
    assert((await page.locator('#pdPaper').getAttribute('href')).includes('bookSeries=miracle-elem-2021&bookVolume=10'),'Miracle print link preserves the identified publication and volume');
    assert((await page.locator('.pd-note').allTextContents()).join(' ').includes('교재와 같은 주제나 문제 형식일 필요는 없어요'),'whole-volume paper does not require a textbook topic match');
   }
   await page.click('[data-route="age"]');await page.selectOption('#pdLevel','m3');assert.equal(await page.locator('#pdBaseline').inputValue(),'c35');
   await page.selectOption('#pdStudyBand','foundation');await page.selectOption('#pdBaseline','f-count5');assert.equal(await page.locator('#pdBaseline').inputValue(),'f-count5','an explicit earlier topic is kept');
   await page.selectOption('#pdLevel','a6');await page.click('[data-route="unlearned"]');await overflow(page);await page.waitForFunction(()=>!document.querySelector('.nm-confetti'));await page.screenshot({path:path.join(OUT,lang+'-'+width+'-setup.png')});
   if(lang==='ko'&&width===390){
    const before=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_preview_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});});
    await page.click('#pdStart');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.plan.items.length),20);
    assert.deepEqual(await page.evaluate(()=>{const items=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.plan.items;return items.reduce((counts,item)=>(counts[item.band]++,counts),{previous:0,current:0,next:0});}),{previous:6,current:10,next:4},'online plan keeps previous/current/next at 6/10/4');
    await page.click('#pdSkip');const saved=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});});
    await openPreview(page,base);await page.locator('[data-id="diag"]:visible,#ttDiag:visible').first().click();await openDiagnostic(page);
    assert.equal(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag;return JSON.stringify({seed:d.seed,plan:d.plan,index:d.index,responses:d.responses});}),saved,'answered plan resumes unchanged');
    for(let i=1;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    assert.equal(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_preview_state_v1'));return JSON.stringify({speed:s.roadSpeed,amount:s.roadAmount,cadence:s.roadCadence,coins:s.coins,progress:s.progress});}),before,'results cannot change workload or achievements');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1')).placement.autoPlan.cadence),'w1');assert.equal(await page.locator('.pd-route-planner').count(),1);
    await page.screenshot({path:path.join(OUT,'ko-390-result.png')});
    await page.click('#pdAgain');await page.locator('dialog [data-confirm]').click();await page.click('[data-route="book"]');
    await page.selectOption('[data-book-series="0"]','dunoro');await page.selectOption('[data-book-course="0"]','17');
    await page.click('#pdAddBook');assert.equal(await page.locator('[data-book-row]').count(),2);
    await page.selectOption('[data-book-series="1"]','soma-p');assert.equal(await page.locator('[data-book-edition="1"]').inputValue(),'2019');await page.selectOption('[data-book-step="1"]','v1');
    // Two supported completed books require an explicit basis for this paper.
    assert(await page.locator('#pdStart').isDisabled(),'multiple supported books need a selected basis');
    assert.equal(await page.locator('#pdBookFocus option').count(),4);
    await page.selectOption('#pdBookFocus','all');
    assert.equal(await page.locator('#pdStart').isDisabled(),false,'two completed books can share one 6/10/4 paper');
    assert((await page.locator('#pdPaper').getAttribute('href')).includes('mixBooks=1'),'mixed print link keeps the combined basis');
    assert((await page.locator('main[data-pd-view]').textContent()).includes('이전 6·다음 4문항에는 모든 교재가 들어가지 않을 수 있어요'),'mixed paper explains fixed band capacity');
    const mixedHref=await page.locator('#pdPaper').getAttribute('href');
    const mixedPaper=await ctx.newPage();await mixedPaper.goto(base+'/number_magic/'+mixedHref);await mixedPaper.waitForFunction(()=>window.NM_WS_READY);
    assert.equal(await mixedPaper.locator('.pl-q').count(),20,'mixed paper prints 20 questions');await overflow(mixedPaper);await mixedPaper.close();
    await page.click('#pdStart');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag.plan.book.series),'mixed','online paper retains the combined basis');
    for(let i=0;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    assert(!(await page.locator('.pd-note').allTextContents()).some(line=>line.includes('다른 교재는 이번 문항 출제 기준에 포함되지 않았어요')),'mixed result does not exclude its books');
    await page.click('#pdAgain');await page.locator('dialog [data-confirm]').click();
    await page.selectOption('#pdBookFocus','soma-p:1');
    assert((await page.locator('#pdPaper').getAttribute('href')).includes('somaP=1'));
    await page.selectOption('#pdBookFocus','dunoro:17');
    assert.equal(await page.locator('#pdStart').isDisabled(),false,'the selected Dunoro course can start');
    assert((await page.locator('#pdPaper').getAttribute('href')).includes('dunoro=17'));
    assert((await page.locator('main[data-pd-view]').textContent()).includes('함께 기록한 다른 교재는 이번 문항 출제 기준에 포함되지 않아요'),'other books are identified as records only');
    await page.click('#pdRangeOptions summary');await page.selectOption('#pdBaseline','c18');completedBookSheetHref=await page.locator('#pdPaper').getAttribute('href');
    const linkedBooks=JSON.parse(new URLSearchParams(completedBookSheetHref.split('?')[1]).get('books'));
    assert.deepEqual(linkedBooks.map(x=>[x.series,x.step,x.bookCourseNumber,x.editionId]),[['dunoro','level-3',17,''],['soma-p','v1',null,'2019']],'print link carries both completed books');
    await overflow(page);
    assert.equal(await page.locator('.pd-book-row select,.pd-book-add,.pd-book-remove').evaluateAll(xs=>xs.some(x=>x.getBoundingClientRect().height<44)),false,'book controls meet mobile touch height');
    await page.screenshot({path:path.join(OUT,'ko-390-multi-books.png'),fullPage:true});
    await page.click('#pdStart');
    assert.deepEqual(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('nm_preview_state_v1'))._diag;return d.plan.items.reduce((counts,item)=>(counts[item.band]++,counts),{previous:0,current:0,next:0});}),{previous:6,current:10,next:4},'completed-book plan keeps previous/current/next at 6/10/4');
    for(let i=0;i<20;i++)await page.click('#pdSkip');await page.locator('#pdRoad').waitFor();
    const resultText=await page.locator('.pd-recommended').innerText();
    assert(resultText.includes('완료한 교재')&&resultText.includes('교재 과정 17')&&resultText.includes('소마셈 P')&&resultText.includes('수의 마법 과정'),'result identifies both completed books separately from the app course');
    assert.deepEqual(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_preview_state_v1')).placement.selection;return s.completedBooks.map(x=>[x.series,x.step,x.bookCourseNumber,x.editionId]);}),[['dunoro','level-3',17,''],['soma-p','v1',null,'2019']],'result retains both completed books for later comparison');
    await page.click('#pdRoad');await page.locator('.pd-road-goal').waitFor();
    const roadText=await page.locator('.nm-cr-diagchip,.pd-road-goal').allInnerTexts();
    assert(roadText.join(' ').includes('완료한 교재 1')&&roadText.join(' ').includes('교재 과정 17')&&roadText.join(' ').includes('소마셈 P')&&roadText.join(' ').includes('수의 마법 과정'),'roadmap separates both completed books and app course numbers');
    await page.locator('.pd-road-goal').screenshot({path:path.join(OUT,'ko-390-dunoro-roadmap-detail.png')});
    await page.screenshot({path:path.join(OUT,'ko-390-dunoro-roadmap.png')});
    await openPreview(page,base);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1')).placement.selection.completedBooks[0].bookCourseNumber),17,'book course number survives reload');
   }
   await page.goto(completedBookSheetHref?base+'/number_magic/'+completedBookSheetHref:base+'/number_magic/placement-sheet.html?b=f-count5&seed=browser-observe&l='+lang);await page.waitForFunction(()=>window.NM_WS_READY);
   if(completedBookSheetHref){const source=(await page.locator('.pl-source').allInnerTexts()).join(' ');assert(source.includes('완료한 교재')&&source.includes('Level 3')&&source.includes('교재 과정 17')&&source.includes('소마셈 P'),'printed sheet names both completed books');assert.equal(await page.locator('.pl-sc-item').count(),20);}
   await page.click('#plGo');assert.match(await page.locator('#plOut').innerText(),lang==='ko'?/아직 확인하지 못했어요/:lang==='en'?/Not determined yet/:/尚未确认/,'no marks → no start level');assert(await page.locator('#plRoadmap').isHidden(),'no roadmap without marks');
   // ○·X buttons per question (placement-sheet.html): the last pick wins and is shown as pressed.
   await page.click('[data-mark-index="0"][data-mark="x"]');await page.click('[data-mark-index="0"][data-mark="o"]');
   assert.equal(await page.getAttribute('[data-mark-index="0"][data-mark="o"]','aria-pressed'),'true');assert.equal(await page.getAttribute('[data-mark-index="0"][data-mark="x"]','aria-pressed'),'false');
   for(let i=1;i<20;i++)await page.click('[data-mark-index="'+i+'"][data-mark="'+(i>=16?'x':'o')+'"]');
   await page.click('#plGo');const text=await page.locator('#plOut').innerText();assert(text.includes('6/6')&&text.includes('10/10')&&text.includes('0/4'));assert.equal(await page.locator('#plOut li').count(),0,'next-stage X is not a current gap');
   await overflow(page);const overlap=await page.locator('.pl-sc-item').evaluateAll(rows=>rows.some(row=>{const r=row.getBoundingClientRect();return [...row.children].some(e=>{const x=e.getBoundingClientRect();return x.right>r.right+1||x.left<r.left-1;});}));assert.equal(overlap,false,'OX controls fit their row');
   assert.equal(await page.locator('.pl-sc-item [data-mark]').evaluateAll(xs=>xs.some(x=>x.getBoundingClientRect().height<44)),false);
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
   for(let i=0;i<20;i++)await page.click('[data-mark-index="'+i+'"][data-mark="o"]');await page.click('#plGo');
   await page.locator('.pd-route-planner summary').click();
   for(const [name,value] of Object.entries({startDate:'2026-10-15',targetDate:'2026-12-10',frequency:'2',minutes:'20',observedWeeks:'2',observedVisits:'4',completedSessions:'4',observedMinutes:'80',reviewSessions:'2'}))await page.locator('[name="'+name+'"]').fill(value);
   await page.locator('[name="reviewed"]').check();const state=await page.evaluate(()=>localStorage.getItem('nm_preview_state_v1'));await page.locator('.pd-projection-form button[type="submit"]').click();
   const stage=page.locator('.pd-projection-stage');await page.waitForFunction(()=>document.querySelector('.pd-projection-stage')?.dataset.renderer==='webgl',null,{timeout:45000});
   await stage.scrollIntoViewIfNeeded();const start=await stage.evaluate(e=>e.__studyBranches.debug());assert.equal(start.curves,3);assert(start.meshes>4);
   await page.locator('.pd-projection-week').fill('1');const held=await stage.evaluate(e=>e.__studyBranches.debug());assert.deepEqual(held.beads[0],held.beads[1]);assert.deepEqual(held.beads[0],held.beads[2]);
   await page.locator('[data-route-preview="2"]').click();await page.locator('.pd-projection-week').fill('3');assert.equal(await stage.evaluate(e=>e.__studyBranches.debug().selected),2);assert.equal(await stage.evaluate(e=>e.__studyBranches.debug().week),3);
   await page.locator('[data-orbit="1"]').click();await overflow(page);await page.waitForTimeout(100);await stage.screenshot({path:path.join(OUT,'branches-'+width+'.png')});
   assert.equal(await page.evaluate(()=>localStorage.getItem('nm_preview_state_v1')),state,'scenario comparisons do not mutate learner state');
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
