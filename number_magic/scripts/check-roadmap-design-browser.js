#!/usr/bin/env node
'use strict';
// Read-only product review against local files and synthetic guardian/student APIs.
// No email, SMS, real profile write, publishing or runtime style injection.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const {execFileSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'../..');
const OUT=process.env.NM_EVIDENCE_DIR||'/tmp/nm-roadmap-design';
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'POST, OPTIONS'};
const owner='22222222-2222-4222-8222-222222222222';
const server=http.createServer((req,res)=>{
  let file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(404);return res.end();}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  const relative=path.relative(ROOT,file).split(path.sep).join('/');
  if(process.argv.includes('--baseline')&&['number_magic/app/main.js','number_magic/app/styles.css'].includes(relative)){
    // Serve the unchanged baseline from Git, without reverting the shared checkout.
    res.end(execFileSync('git',['show','HEAD:'+relative],{cwd:ROOT,maxBuffer:8*1024*1024}));return;
  }
  fs.createReadStream(file).pipe(res);
});
async function clean(page){
  for(let n=0;n<100;n++){
    const unlock=page.locator('#nmUnlockOverlayClose');
    if(!await unlock.isVisible())break;
    await unlock.evaluate(el=>el.click());
  }
  await page.waitForSelector('#nmUnlockOverlay',{state:'detached',timeout:5000}).catch(()=>{});
  await page.waitForFunction(()=>!document.querySelector('.nm-confetti'),{timeout:12000}).catch(()=>{});
  await page.evaluate(()=>document.fonts.ready);
}
async function screenshot(page,name){await clean(page);await page.screenshot({path:path.join(OUT,name+'.png'),fullPage:false});}
async function layout(page){return page.evaluate(()=>{
  const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,scrollTop:e.scrollTop,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,parent:e.parentElement?.id||e.parentElement?.className,overflowY:getComputedStyle(e).overflowY};};
  const roots=['#screen','.nm-cr-wrap','.nm-cr-header','#crBody','#nmStandardPlan','#nmPersonalPlan','#crList','#crVisual'];
  const controls=[...document.querySelectorAll('#screen button,#screen summary,#screen select,#screen input')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden';});
  return{width:innerWidth,height:innerHeight,documentOverflow:document.documentElement.scrollWidth>innerWidth+2,regions:Object.fromEntries(roots.map(s=>[s,rect(document.querySelector(s))])),
    plansInsideRoad:['#nmStandardPlan','#nmPersonalPlan'].every(s=>document.querySelector(s)?.closest('#crBody')),
    planScrollers:[...document.querySelectorAll('.nm-personal-plan')].filter(e=>e.scrollHeight>e.clientHeight+2&&/auto|scroll/.test(getComputedStyle(e).overflowY)).map(e=>e.id),
    roadHorizontalOverflow:[...document.querySelectorAll('#crBody *')].filter(e=>{if(e.closest('#crMapScroll,.nm-pc-tablewrap')||!e.checkVisibility())return false;const r=e.getBoundingClientRect(),b=document.querySelector('#crBody').getBoundingClientRect();return r.width&&r.height&&(r.right>b.right+2||r.left<b.left-2);}).slice(0,25).map(e=>({selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+String(e.className).trim().replaceAll(' ','.'),text:e.textContent.trim().slice(0,60),...rect(e)})),
    roadOverflowBoxes:[...document.querySelectorAll('#crBody *')].filter(e=>e.checkVisibility()&&e.scrollWidth>e.clientWidth+2).slice(0,30).map(e=>({selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+String(e.className).trim().replaceAll(' ','.'),text:e.textContent.trim().slice(0,60),...rect(e)})),
    smallControls:controls.filter(e=>{const r=e.getBoundingClientRect();return r.width<43.5||r.height<43.5;}).map(e=>({selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+String(e.className).trim().replaceAll(' ','.'),text:e.textContent.trim().slice(0,60),...rect(e)}))};
});}
async function openFixture(browser,base,{course,width,height,lang='ko'}){
  const name='디자인점검 '+course,session={access_token:'fake-design-owner',refresh_token:'fake-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:owner,email:'guardian@example.test'},password_setup_pending:false};
  const schoolAge=course==='C1'?{entryYear:2028,birthYear:2021,profileGrade:'pre'}:course==='C29'?{entryYear:2020,birthYear:2013,profileGrade:'m1'}:course==='C58'?{entryYear:2017,birthYear:2010,profileGrade:'h1'}:{entryYear:2016,birthYear:2009,profileGrade:'h2'};
  const settings={profileName:name,version:7,courseKey:course,sessionIndex:1,speed:1,amount:1,cadence:'w2',entryYear:schoolAge.entryYear,startDate:'2026-10-24',updatedAt:'2026-10-24T00:00:00.000Z'};
  const original={name,lang,onboarded:true,cloudLinked:true,cloudOwnerId:owner,view:'courseroad',roadView:'road',progress:{'A-02':{done:true,steps:{stamp:true}}},coins:17,account:{status:'active'},placement:{course,self:true},schoolAge,character:{number:3,color:'blue',hat:'none'},avatar:{id:'legacy',kind:'boy',look:'boy',name:'',outfit:'original'}};
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],requests=[],blocked=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>{if(r.request().url().startsWith(base+'/')&&r.request().method()==='GET')return r.continue();blocked.push({method:r.request().method(),url:r.request().url()});return r.abort();});
  await ctx.addInitScript(({key,state})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(state));},{key:'nm_learner_state_v1_'+encodeURIComponent(owner),state:original});
  await ctx.route('**/functions/v1/nm-membership',async r=>{
    if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers:CORS});
    const body=r.request().postDataJSON()||{};requests.push(body.action);
    if(body.action!=='status')return r.fulfill({status:400,headers:CORS,json:{error:'unexpected_action'}});
    return r.fulfill({headers:CORS,json:{membership:{userId:owner,serverNow:new Date().toISOString(),trialStartedAt:new Date(Date.now()-86400000).toISOString(),trialEndsAt:new Date(Date.now()+86400000*6).toISOString(),endsAt:null,status:'trial',plan:null,canUse:true},settings:body.profileName===name?settings:null,contact:{registered:true,privacyVersion:'2026-10-22-v1',phoneMasked:'010-****-5678',smsConsent:false}}});
  });
  await ctx.route('**/rest/v1/nm_profiles**',r=>r.fulfill({json:[]}));
  await ctx.route('**/auth/v1/**',r=>r.request().url().includes('/token?grant_type=password')?r.fulfill({json:session}):r.fulfill({json:{}}));
  await page.goto(base+'/number_magic/access.html?lang='+lang);
  await page.click('#open-book');await page.fill('#login-user','guardian@example.test');await page.fill('#login-password','fixture-only');await page.click('#login-submit');
  await page.waitForFunction(()=>window.NM_MEMBERSHIP?.contactReady());await page.click('#nmGuardBack');
  await clean(page);
  await page.locator('#ttRoad:visible,.nm-title3d [data-id=road]:visible').first().click();
  await page.waitForSelector('#nmPersonalPlan');await clean(page);
  return{ctx,page,errors,requests,blocked,original,settings};
}
async function fullCase(f,c,tag){
  const page=f.page,checks=[],observe=[];
  await page.locator('#crBody').evaluate(e=>e.scrollTop=0);
  const start=await layout(page);checks.push('road body and initial standard plan');
  assert(!start.documentOverflow,tag+' document overflow');
  assert(start.regions['#crBody'].scrollWidth<=start.regions['#crBody'].clientWidth+2,tag+' road body horizontal overflow '+JSON.stringify(start.roadHorizontalOverflow));
  assert(start.plansInsideRoad,tag+' plan cards must share the road scroll container');
  assert(start.regions['#crBody'].clientHeight>=Math.min(200,c.height*.4),tag+' road scroll area collapsed');
  assert.deepEqual(start.planScrollers,[],tag+' nested plan scroll areas');
  await screenshot(page,'road-standard-'+tag);
  const protectedBefore=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem(window.NM_STATE_KEY));return Object.fromEntries(['name','progress','coins','character','avatar','adminPlan','schoolAge','placement'].map(k=>[k,s[k]]));});
  const personal=page.locator('#nmPersonalPlan>summary');await personal.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#nmPersonalPlan').evaluate(e=>e.open),true,tag+' keyboard opens monthly plan');
  const expanded=await layout(page);assert(expanded.regions['#crBody'].clientHeight===start.regions['#crBody'].clientHeight,tag+' expanding months must not shrink road viewport');
  assert.deepEqual(expanded.planScrollers,[],tag+' no nested scroll after opening months');
  assert.equal(await page.locator('#nmPersonalPlan article').count(),12,tag+' twelve month plan');
  await page.locator('#nmPersonalPlan article').last().scrollIntoViewIfNeeded();await screenshot(page,'road-months-'+tag);
  await personal.click();checks.push('monthly 12 months, keyboard and shared scrolling');
  const horizon=page.locator('.nm-plan-horizon>summary');
  if(await horizon.count()){await horizon.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.nm-plan-horizon').evaluate(e=>e.open),true);await horizon.click();}
  await page.locator('#crCurrent').click();
  await page.waitForFunction(course=>{const n=document.querySelector('.nm-cr-node[data-c="'+course+'"]'),b=document.querySelector('#crBody');if(!n||!b)return false;const r=n.getBoundingClientRect(),p=b.getBoundingClientRect();return document.activeElement===n&&r.top>=p.top-2&&r.bottom<=p.bottom+2;},c.course);
  await screenshot(page,'road-current-'+tag);
  const explain=page.locator('.nm-cr-explain[data-c="'+c.course+'"]>summary');
  await explain.click();await page.waitForFunction(course=>(document.querySelector('.nm-cr-explain[data-c="'+course+'"] .nm-cr-ex-body')?.textContent||'').trim().length>12,c.course);await explain.click();
  checks.push('later finish dates disclosure and current-course shortcut, course explanations');
  await page.locator('#crViewMap').click();await page.waitForSelector('#crVisual:not([hidden])');
  assert.equal(await page.locator('.nm-vmap-stop').count(),5);assert.equal(await page.locator('.nm-vmap-character').count(),5);
  const quickNav=page.locator('#crVisual button[data-map-group]:not(.nm-vmap-stop):not(.nm-vmap-character)');
  assert.equal(await quickNav.count(),5,tag+' five visible map shortcuts');
  for(const group of ['first','arithmetic','challenge','middle','high']){
    const button=page.locator('#crVisual button[data-map-group="'+group+'"]:not(.nm-vmap-stop):not(.nm-vmap-character)');
    await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true',tag+' map shortcut selection '+group);
  }
  assert(await page.locator('.nm-vmap-art').evaluate(img=>img.decode().then(()=>img.naturalWidth>0)),tag+' map bitmap decoded');
  const stageKeys=new Set();
  for(const group of ['first','arithmetic','challenge','middle','high']){
    const guide=page.locator('.nm-vmap-character[data-map-group="'+group+'"]');await guide.click();
    assert.equal(await guide.getAttribute('aria-pressed'),'true',tag+' guide selected '+group);
    const speech=(await page.locator('.nm-vmap-talk-bubble p').textContent()).trim();assert(speech.length>12,tag+' guide explanation '+group);
    assert((await page.locator('#crMapLive').textContent()).includes(speech),tag+' guide explanation announced '+group);
    for(const k of await page.locator('.nm-vmap-stage').evaluateAll(els=>els.map(e=>e.dataset.mapStage)))stageKeys.add(k);
  }
  assert.equal(stageKeys.size,10,tag+' five groups expose ten stages');
  const mapMetrics=await page.evaluate(()=>{
    const scroll=document.querySelector('#crMapScroll'),selected=document.querySelector('.nm-vmap-character.is-selected');
    const s=scroll.getBoundingClientRect(),r=selected.getBoundingClientRect();
    return{documentOverflow:document.documentElement.scrollWidth>innerWidth+2,mapScrollable:scroll.scrollWidth>scroll.clientWidth+2,selectedInside:r.left>=s.left-2&&r.right<=s.right+2,
      minStop:Math.min(...[...document.querySelectorAll('.nm-vmap-stop')].map(e=>Math.min(e.getBoundingClientRect().width,e.getBoundingClientRect().height))),
      minGuide:Math.min(...[...document.querySelectorAll('.nm-vmap-character')].map(e=>Math.min(e.getBoundingClientRect().width,e.getBoundingClientRect().height)))};
  });
  assert(!mapMetrics.documentOverflow);assert(mapMetrics.minStop>=44&&mapMetrics.minGuide>=44,tag+' map touch targets');
  const mapLayout=await layout(page);
  assert.equal(mapLayout.regions['#screen'].scrollTop,0,tag+' map guide scroll must stay inside road body');
  assert.equal(mapLayout.regions['.nm-cr-header'].y,start.regions['.nm-cr-header'].y,tag+' map guide must preserve road header position');
  await screenshot(page,'map-high-'+tag);checks.push('all five map signs and guides, ten stages, speech and touch targets');
  await page.locator('#crMapScroll').scrollIntoViewIfNeeded();await screenshot(page,'map-canvas-'+tag);
  await page.locator('[data-map-stage="common2"]').click();
  assert.equal(await page.locator('#crViewRoad').getAttribute('aria-pressed'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.c),'C49',tag+' stage links focus actual road course');
  await page.locator('#crViewMap').click();
  const challenge=page.locator('.nm-vmap-character[data-map-group="challenge"]');await challenge.focus();await page.keyboard.press('Enter');
  assert.equal(await challenge.getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>document.activeElement?.id),'crMapDetail');
  await screenshot(page,'map-detail-'+tag);checks.push('map to real stage and back; keyboard guide and detail focus');
  await page.locator('#crViewRoad').click();
  const node=page.locator('.nm-cr-node[data-c="'+c.course+'"]');await node.focus();await page.keyboard.press('Enter');
  await page.waitForSelector('#nmCourseSheet');
  const dialog=page.locator('#nmCourseSheet [role=dialog],#nmCourseSheet[role=dialog]');
  assert.equal(await dialog.count(),1,tag+' accessible course dialog');
  const dialogLayout=await dialog.evaluate(el=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,width:r.width,height:r.height,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+2};});
  assert(dialogLayout.top>=-1&&dialogLayout.bottom<=dialogLayout.viewport+1&&!dialogLayout.overflow,tag+' course dialog clipped '+JSON.stringify(dialogLayout));
  for(let n=0;n<8;n++){await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement?.closest('#nmCourseSheet')),tag+' modal focus escaped');}
  await page.locator('#csPeekBtn').click();assert.equal(await page.locator('#csPeek').evaluate(e=>e.hidden),false);
  await page.locator('#csPeek').scrollIntoViewIfNeeded();await screenshot(page,'course-peek-'+tag);
  const modalMetrics=await page.locator('#nmCourseSheet').evaluate(el=>({controls:[...el.querySelectorAll('button')].map(b=>{const r=b.getBoundingClientRect();return{id:b.id,width:r.width,height:r.height};}),scrollable:[...el.querySelectorAll('*')].filter(e=>/auto|scroll/.test(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+2).map(e=>e.className)}));
  assert(modalMetrics.controls.every(b=>b.width>=44&&b.height>=44),tag+' course sheet small controls '+JSON.stringify(modalMetrics.controls));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#nmCourseSheet').count(),0,tag+' Escape closes course sheet');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.c),c.course,tag+' closing dialog restores course focus');checks.push('course preview dialog, scroll, touch, focus trap, Escape and focus restore');
  const protectedAfter=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem(window.NM_STATE_KEY));return Object.fromEntries(['name','progress','coins','character','avatar','adminPlan','schoolAge','placement'].map(k=>[k,s[k]]));});
  assert.deepEqual(protectedAfter,protectedBefore,tag+' read-only roadmap interactions preserve learner state');
  let assessmentReturn;
  if(c.course==='C29'&&c.width===390&&c.lang==='ko'){
    await page.evaluate(()=>{const original=NM_PLACEMENT_UI.render;window.__originalPlacementRender=original;NM_PLACEMENT_UI.render=function(opts){window.__observedDiagnosticState=opts.state;return original.call(this,opts);};});
    await page.locator('#crDiag').click();await page.selectOption('#pdAge','14');await page.selectOption('#pdGrade','m1');
    await page.locator('[data-route=age]').click();await page.selectOption('#pdStudyBand','middle');await page.selectOption('#pdBaseline','c29');
    await page.locator('#pdStart').click();for(let n=0;n<20;n++)await page.locator('#pdSkip').click();
    await page.waitForSelector('#pdRoad');
    await page.evaluate(()=>{window.__roadResultOriginal=__observedDiagnosticState;window.__roadResultSnapshot=JSON.stringify(__observedDiagnosticState);});
    await page.locator('#pdRoad').scrollIntoViewIfNeeded();await screenshot(page,'assessment-result-'+tag);
    await page.locator('#pdRoad').click();await page.waitForSelector('#crBack');
    assert.match(await page.locator('#crBack').innerText(),/진단 결과/);assert.equal(await page.locator('#pdSubmit').count(),0,tag+' viewing road never starts another test');
    await page.locator('#crBack').click();await page.waitForSelector('#pdRoad');
    assessmentReturn=await page.evaluate(()=>({sameObject:__observedDiagnosticState===__roadResultOriginal,sameContents:JSON.stringify(__observedDiagnosticState)===__roadResultSnapshot,phase:__observedDiagnosticState.phase,responses:__observedDiagnosticState.responses.length}));
    assert.deepEqual(assessmentReturn,{sameObject:true,sameContents:true,phase:'result',responses:20},tag+' same finished diagnostic is restored');
    await screenshot(page,'assessment-return-'+tag);await page.evaluate(()=>NM_PLACEMENT_UI.render=__originalPlacementRender);
    checks.push('actual 20-item diagnostic result to road and back, same run identity/content and no restart');
  }
  await page.evaluate(({course,lang,schoolAge})=>{
    const wrapper=document.createElement('main');wrapper.className='nm-placement';const host=document.createElement('section');host.className='pd-calendar';host.id='roadmapCalendarFixture';wrapper.appendChild(host);document.querySelector('#screen').replaceChildren(wrapper);window.__paceApplied=[];
    NM_DIAGNOSTIC_ROADMAP.mount(host,{course,session:1,lang,now:'2026-10-24T03:00:00Z',selection:{age:String(2026-schoolAge.birthYear+1),birthYear:schoolAge.birthYear,profileGrade:schoolAge.profileGrade,goal:'steady'},settings:{speed:1,cadence:'w2'},onPaceApply:value=>{window.__paceApplied.push(value);return true;}});
  },{...c,schoolAge:f.original.schoolAge});
  await page.locator('#pdStandardPlan').scrollIntoViewIfNeeded();await screenshot(page,'diagnostic-standard-'+tag);
  await page.locator('#pdCustomPlan>summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-calendar=speed] option').count(),5);
  await page.selectOption('[data-calendar=speed]','1.5');assert.deepEqual(await page.evaluate(()=>__paceApplied),[],tag+' pace preview does not apply silently');
  await page.locator('#pdApplyPace').focus();await page.keyboard.press('Enter');assert.deepEqual(await page.evaluate(()=>__paceApplied),[{speed:1.5,cadence:'w2'}]);
  const calendarMetrics=await page.evaluate(()=>({documentOverflow:document.documentElement.scrollWidth>innerWidth+2,
    controls:[...document.querySelectorAll('#roadmapCalendarFixture button,#roadmapCalendarFixture select,#roadmapCalendarFixture summary')].filter(e=>e.getBoundingClientRect().height).map(e=>{const r=e.getBoundingClientRect();return{id:e.id||e.dataset.calendar||e.tagName,text:e.textContent.trim().slice(0,35),width:r.width,height:r.height};})}));
  assert(!calendarMetrics.documentOverflow,tag+' diagnostic calendar horizontal overflow');
  observe.push(...calendarMetrics.controls.filter(x=>x.width<44||x.height<44).map(x=>({...x,issue:'diagnostic touch target under 44px'})));
  await screenshot(page,'diagnostic-custom-'+tag);checks.push('diagnostic standard then five-step custom pace, explicit apply and no overflow');
  assert.deepEqual(f.errors,[],tag+' page exceptions');assert(f.requests.every(a=>a==='status'),tag+' unexpected membership action');
  return{...c,checks,start,expanded,mapMetrics,mapLayout,modalMetrics,calendarMetrics,assessmentReturn,observe,errors:f.errors,actualExternalWrites:0};
}
async function main(){
  fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
  const results=[];
  try{
    const baseline=process.argv.includes('--baseline');
    let cases=baseline?[{course:'C70',width:390,height:844},{course:'C1',width:844,height:390},{course:'C29',width:1440,height:1000}]:
      [[390,844],[768,1024],[1440,1000],[844,390]].flatMap(([width,height])=>['C1','C29','C58','C70'].map(course=>({course,width,height,lang:'ko'}))).concat(['en','zh'].map(lang=>({course:'C70',width:390,height:844,lang})));
    const courseArg=process.argv.find(a=>a.startsWith('--course='))?.split('=')[1],viewportArg=process.argv.find(a=>a.startsWith('--viewport='))?.split('=')[1],langArg=process.argv.find(a=>a.startsWith('--lang='))?.split('=')[1];
    if(courseArg)cases=cases.filter(c=>c.course===courseArg);if(viewportArg)cases=cases.filter(c=>c.width+'x'+c.height===viewportArg);if(langArg)cases=cases.filter(c=>(c.lang||'ko')===langArg);
    for(const c of cases){
      const f=await openFixture(browser,base,c),tag=c.course+'-'+c.width+'x'+c.height+'-'+(c.lang||'ko');
      if(!baseline){
        try{results.push(await fullCase(f,c,tag));console.log('ROADMAP_DESIGN_CASE_OK '+tag);}
        catch(e){await screenshot(f.page,'FAIL-'+tag);results.push({...c,ok:false,error:e.stack,layout:await layout(f.page)});console.error('ROADMAP_DESIGN_CASE_FAIL '+tag+' '+e.message);if(process.argv.includes('--fail-fast'))throw e;}
        finally{await f.ctx.close();fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify({ok:results.every(r=>!r.error),cases:results,externalWrites:0},null,2)+'\n');}
        continue;
      }
      const before=await layout(f.page);await screenshot(f.page,'baseline-'+tag);
      await f.page.locator('#nmPersonalPlan>summary').click();const expanded=await layout(f.page);await screenshot(f.page,'baseline-expanded-'+tag);
      results.push({...c,before,expanded,errors:f.errors});await f.ctx.close();
    }
    fs.writeFileSync(path.join(OUT,baseline?'baseline.json':'report.json'),JSON.stringify({ok:results.every(r=>!r.error),cases:results,externalWrites:0},null,2)+'\n');
    console.log(JSON.stringify({ok:results.every(r=>!r.error),baseline,cases:results.map(r=>({course:r.course,width:r.width,height:r.height,...(baseline?{roadHeight:r.before.regions['#crBody']?.clientHeight,expandedRoadHeight:r.expanded.regions['#crBody']?.clientHeight,standardParent:r.before.regions['#nmStandardPlan']?.parent,personalParent:r.before.regions['#nmPersonalPlan']?.parent,smallControls:r.before.smallControls.length}:{checks:r.checks?.length,error:r.error?.split('\n')[0]} )})),externalWrites:0},null,2));
    if(results.some(r=>r.error))process.exitCode=1;
  }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
