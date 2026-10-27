'use strict';
// Real onboarding → diagnosis → calendar transitions. Network writes are blocked.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const {onboard}=require('./lib/nm-onboard');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_PROFILE_ARTIFACTS||'/tmp/nm-profile-intake-20261023';
const bridge=`
window.__PROFILE_CHECK={
 welcome:()=>{guardianEntry=false;S.onboarded=false;S.schoolAge=null;save();screenWelcome();},
 start:()=>startPlacement(),grade:g=>setSchoolGrade(g),clear:()=>openAgeSheet(),
 snapshot:()=>JSON.parse(JSON.stringify({schoolAge:S.schoolAge,run:S._diag,coins:S.coins,progress:S.progress,speed:S.roadSpeed})),
 adminGrade:entryYear=>{const old=membership.snapshot;membership.snapshot=()=>({owner:S.cloudOwnerId,settings:{profileName:S.name,entryYear,version:'fixture',speed:1,amount:1,cadence:'w1',updatedAt:new Date().toISOString()}});try{applyAdminSettings();}finally{membership.snapshot=old;S.adminPlan=null;}},
 finish:()=>{S._diag.phase='result';},
};`;
const server=http.createServer((req,res)=>{
 const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');
 let s=fs.readFileSync(f);if(f.endsWith('/app/main.js')){s=s.toString();const i=s.lastIndexOf('\n})();');s=s.slice(0,i)+bridge+s.slice(i);}res.end(s);
});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
 try{for(const [width,lang]of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
  const c=await browser.newContext({viewport:{width,height:667},reducedMotion:'reduce'}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  await c.route('**/auth/v1/token?grant_type=password',r=>r.fulfill({json:{access_token:'fixture-token',refresh_token:'fixture-refresh',expires_in:3600,user:{id:'profile-fixture-owner',email:'guardian@example.test'}}}));
  await c.route('**/functions/v1/nm-membership',r=>r.fulfill({json:{membership:{userId:'profile-fixture-owner',status:'trial',canUse:true,trialEndsAt:new Date(Date.now()+86400000).toISOString(),serverNow:new Date().toISOString()},contact:{registered:true,smsConsent:false,phoneMasked:'010-****-1234',privacyVersion:'2026-10-22-v1',consentedAt:new Date().toISOString()}}}));
  await c.addInitScript(lang=>localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'Profile fixture',avatar:{kind:'boy'},view:'title',coins:100,progress:{},cloudLinked:true,cloudOwnerId:'profile-fixture-owner'})),lang);
  await p.goto(base+'/number_magic/access.html?lang='+lang);await p.click('#open-book');await p.fill('#login-user','guardian@example.test');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForFunction(()=>window.__PROFILE_CHECK&&NM_PROFILE_AUTH.peek()?.user);
  await p.waitForSelector('#screen');await p.evaluate(()=>__PROFILE_CHECK.welcome());
  // 나이·학년은 한 칸(5세·6세·7세·초1…) — 출생연도·실제 학년을 따로 묻지 않는다(2026-10-27).
  await p.locator('.nm-av-card').first().click();await p.click('#obAvNext');assert.equal(await p.locator('#obBirthYear').count(),0,'no birth-year question');
  assert(await p.locator('#obGrNext').isDisabled(),'a choice is required to continue');
  await p.click('[data-level="e4"]');await p.click('[data-level="e3"]');assert(await p.locator('#obGrNext').isEnabled());
  assert.equal(await p.locator('.nm-ob-grade.sel').getAttribute('data-level'),'e3','last choice wins');
  const levels=await p.locator('.nm-ob-grade').evaluateAll(es=>es.map(e=>e.dataset.level));assert.deepEqual(levels.slice(0,4),['a5','a6','a7','e1']);assert.equal(levels.at(-1),'h3');
  const lv=await p.evaluate(()=>({e3:NM_DIAGNOSTIC_ROADMAP.fromLevel('e3'),e4:NM_DIAGNOSTIC_ROADMAP.fromLevel('e4'),a5:NM_DIAGNOSTIC_ROADMAP.fromLevel('a5')})),birth=lv.e3.birthYear;
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const btn=await p.locator('.nm-ob-grade').first().evaluate(e=>e.getBoundingClientRect().height);assert(btn>=44,'touch target');
  await p.screenshot({path:path.join(OUT,width+'-'+lang+'-profile.png'),fullPage:true});
  if(process.env.NM_PROFILE_SETUP_ONLY==='1'){
   for(const box of await p.locator('.nm-ob-grade').evaluateAll(es=>es.map(e=>({client:e.clientWidth,scroll:e.scrollWidth}))))assert(box.scroll<=box.client,'grade labels fit their buttons');
   assert.deepEqual(errors,[]);report.push({width,lang,setupOnly:true,externalWrites:0});await c.close();continue;
  }
  await p.click('#obGrNext');await p.fill('#obName','Profile fixture');await p.click('#obGo');await p.waitForSelector('#obName',{state:'detached'});await p.waitForTimeout(2000);
  await p.evaluate(()=>__PROFILE_CHECK.start());await p.waitForSelector('#pdStart');assert.equal(await p.inputValue('#pdLevel'),'e3');assert.equal(await p.locator('#pdAge,#pdGrade').count(),0);assert(await p.locator('#pdStart').isEnabled());
  const keep=await p.evaluate(()=>__PROFILE_CHECK.snapshot());await p.click('#pdStart');await p.click('#pdSkip');const active=await p.evaluate(()=>__PROFILE_CHECK.snapshot());assert.equal(active.run.selection.scopeSource,'grade');
  // Editing the profile must not regenerate an already started assessment.
  await p.evaluate(()=>{__PROFILE_CHECK.grade(7);__PROFILE_CHECK.start();});let next=await p.evaluate(()=>__PROFILE_CHECK.snapshot());assert.deepEqual(next.run,active.run);assert.equal(next.schoolAge.birthYear,birth);
  // A fresh retest follows the latest actual grade when the old scope was automatic.
  await p.evaluate(()=>{__PROFILE_CHECK.finish();__PROFILE_CHECK.start();});assert.equal(await p.inputValue('#pdLevel'),'m1');assert.equal(await p.inputValue('#pdStudyBand'),'middle');
  await p.selectOption('#pdStudyBand','high');await p.selectOption('#pdBaseline','c41');await p.selectOption('#pdLevel','e4');assert.equal(await p.inputValue('#pdBaseline'),'c41','level correction keeps manual scope');
  await p.click('#pdStart');next=await p.evaluate(()=>__PROFILE_CHECK.snapshot());assert.equal(next.run.selection.scopeSource,'manual');assert.equal(next.schoolAge.birthYear,lv.e4.birthYear);
  for(let i=0;i<20;i++)await p.click('#pdSkip');await p.waitForSelector('.pd-calendar-table');assert.equal(await p.locator('#pdMonthlyPlan').locator('tbody tr').count(),12);
  await p.evaluate(()=>{__PROFILE_CHECK.grade(5);__PROFILE_CHECK.start();});assert.equal(await p.inputValue('#pdLevel'),'e5');assert.equal(await p.inputValue('#pdBaseline'),'c41','retest keeps manual advanced study');
  await p.evaluate(()=>__PROFILE_CHECK.adminGrade(new Date().getFullYear()-4));assert.equal((await p.evaluate(()=>__PROFILE_CHECK.snapshot())).schoolAge.birthYear,lv.e4.birthYear,'admin plan keeps birth year');
  await p.evaluate(()=>__PROFILE_CHECK.clear());assert.equal(await p.locator('#nmAgeSheet .nm-ob-grade.sel').getAttribute('data-level'),'e5','sheet shows current level');await p.click('#ageClear');next=await p.evaluate(()=>__PROFILE_CHECK.snapshot());assert.equal(next.schoolAge,null,'clear removes the one age/grade choice');
  assert.equal(next.coins,keep.coins);assert.deepEqual(next.progress,keep.progress);assert.deepEqual(errors,[]);
  // The common onboarding helper also traverses the real level buttons (preschool).
  if(width===390&&lang==='ko'){await p.evaluate(()=>__PROFILE_CHECK.welcome());await onboard(p,{level:'a5'});await p.waitForFunction(()=>__PROFILE_CHECK.snapshot().schoolAge,null,{timeout:10000});const sa=(await p.evaluate(()=>__PROFILE_CHECK.snapshot())).schoolAge;assert.equal(sa.entryYear,lv.a5.entryYear);assert.equal(sa.birthYear,lv.a5.birthYear);}
  report.push({width,lang,singleAgeGradeChoice:true,profileCarryOver:true,activeAssessmentUnchanged:true,automaticRetestUpdated:true,manualAdvancedScopePreserved:true,calendarMonths:12,externalWrites:0});await c.close();
 }
 fs.writeFileSync(path.join(OUT,process.env.NM_PROFILE_SETUP_ONLY==='1'?'setup-report.json':'report.json'),JSON.stringify(report,null,2));console.log('PROFILE_INTAKE_OK '+JSON.stringify(report));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
