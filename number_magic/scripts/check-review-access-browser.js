#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_REVIEW_ARTIFACTS;
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch({args:['--disable-webgl','--disable-webgl2']});const report=[];if(OUT)fs.mkdirSync(OUT,{recursive:true});
try{
 for(const [width,lang]of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
  const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage(),requests=[],errors=[],backend=[];let valid=true;
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.url().includes('.supabase.co/')&&!r.url().includes('/functions/v1/nm-review'))backend.push({method:r.method(),url:r.url()});});await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  await c.route('**/functions/v1/nm-review',r=>{const d=r.request().postDataJSON();requests.push(d);if(d.action==='login'&&d.code!=='fixture-only-code')return r.fulfill({status:401,json:{error:'invalid_credentials'}});if(d.action==='status'&&!valid)return r.fulfill({status:401,json:{error:'unauthorized'}});return r.fulfill({status:200,json:d.action==='logout'?{ok:true}:{username:'review-fixture',expiresAt:new Date(Date.now()+3600000).toISOString(),scope:'learning_review',...(d.action==='login'?{token:'a'.repeat(64)}:{})}});});
  const original={lang,name:'Real learner fixture',onboarded:true,view:'town',avatar:{kind:'girl'},character:{number:3,color:'blue'},coins:777,progress:{'N-01':{done:true,steps:{stamp:true}}},guardianManaged:true,cloudLinked:true,cloudOwnerId:'real-owner-fixture',account:{status:'trial'}};
  await c.addInitScript(s=>{if(!localStorage.getItem('nm_state_v1')){localStorage.setItem('nm_state_v1',JSON.stringify(s));localStorage.setItem('nm_state_slot1','keep-real-slot');localStorage.setItem('nm_active_slot','2');localStorage.setItem('nm_guardian_session_v1','keep-real-guardian-session');}},original);
  await p.goto(base+'/number_magic/about.html');await p.locator('.skipbtn').click();await p.waitForURL('**/access.html');assert.equal(await p.locator('#guardian-link').count(),1);
  await p.locator('.access-lang[data-lang="'+lang+'"]').click();
  assert.equal(await p.locator('[role="tab"],#review-form,#review-submit').count(),0,'one common login form, no master selector');
  assert.equal(await p.locator('form').count(),1);
  for(const id of ['login-user','login-password','login-submit']){const box=await p.locator('#'+id).boundingBox();assert(box.width>=44&&box.height>=44,id+' touch size');}
  if(OUT)await p.screenshot({path:path.join(OUT,`${width}-${lang}-login.png`)});
  await p.fill('#login-user','review-fixture');await p.fill('#login-password','wrong-fixture');await p.click('#login-submit');await p.waitForFunction(()=>!document.getElementById('login-submit').disabled);assert.equal(await p.locator('#login-password').inputValue(),'');
  await p.fill('#login-password','fixture-only-code');await p.click('#login-submit');await p.waitForURL('**/index.html?**review=1**');await p.waitForFunction(()=>!!window.NM_GATE);
  assert.equal(await p.locator('.nm-review-banner').count(),1);assert.equal(await p.evaluate(()=>Object.keys(NM_UNITS).filter(k=>NM_GATE.unitLocked(k)).length),0,'all learning units available to a validated review session');
  const rawOriginal=JSON.stringify(original);const untouched=()=>p.evaluate(raw=>({normal:localStorage.getItem('nm_state_v1')===raw,slot:localStorage.getItem('nm_state_slot1'),active:localStorage.getItem('nm_active_slot'),guardian:localStorage.getItem('nm_guardian_session_v1')}),rawOriginal);
  assert.deepEqual(await untouched(),{normal:true,slot:'keep-real-slot',active:'2',guardian:'keep-real-guardian-session'});
  await p.locator('.nm-title3d [data-id="game"]:visible,#ttGame:visible').first().click();await p.click('#charChipBtn');await p.waitForSelector('#nmc-name');assert.equal(await p.locator('.nm-closet-settings,#nm-slots-slot,#nmGuardEmail').count(),0,'real student/account settings are absent');
  const beforeCoins=await p.evaluate(()=>JSON.parse(localStorage.getItem('nm_review_state_v1_review-fixture')).coins);
  await p.fill('#nmc-name','Review avatar');await p.locator('[data-nmc-act="savename"]').click();await p.locator('[data-tab="color"]').click();await p.locator('[data-nmc-act="item"][data-id="gold"]').click();await p.locator('[data-nmc-act="confirm"]').click();
  const review=await p.evaluate(()=>JSON.parse(localStorage.getItem('nm_review_state_v1_review-fixture')));assert.equal(review.coins,beforeCoins-15);assert.equal(review.avatar.name,'Review avatar');assert.equal(review.cloudLinked,false);assert.equal(review.cloudOwnerId,null);assert.equal(review.progress['N-01'],undefined,'real learner progress was not copied');
  assert.equal((await untouched()).normal,true);assert.equal(await p.evaluate(()=>Object.values(localStorage).some(x=>x.includes('fixture-only-code')||x.includes('a'.repeat(64)))),false,'no password/token in localStorage');assert(!p.url().includes('fixture-only-code')&&!p.url().includes('a'.repeat(64)));
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  if(OUT)await p.screenshot({path:path.join(OUT,`${width}-${lang}-review.png`)});
  await p.click('#nmReviewLogout');await p.waitForURL('**/access.html');assert(requests.some(x=>x.action==='logout'));assert.equal((await untouched()).normal,true);
  if(OUT)await p.screenshot({path:path.join(OUT,`${width}-${lang}-access.png`)});
  // A URL flag and fake stored token do not unlock the app if the server rejects it.
  valid=false;await p.evaluate(()=>{sessionStorage.setItem('nm_review_session_v1',JSON.stringify({token:'a'.repeat(64)}));sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'review',at:Date.now()}));});await p.goto(base+'/number_magic/index.html?enter=1&review=1');await p.waitForURL('**/access.html?reason=expired');assert.equal(await p.locator('.nm-review-banner').count(),0);assert.equal((await untouched()).normal,true);
  assert.deepEqual(errors,[]);assert.deepEqual(backend,[],'review never calls real guardian/profile/contact/membership APIs');report.push({width,lang,approvalEntry:true,allUnitsUnlocked:true,realProfileAndGuardianPreserved:true,pointsIsolated:true,logout:true,rejectedSessionClosed:true,errors});await c.close();
 }
 // Email and username share the same form. Same-visit auth crosses once; reload asks again.
 for(const lang of ['ko','en','zh']){
 const c=await b.newContext({viewport:{width:390,height:667}}),p=await c.newPage(),authCalls=[],reviewCalls=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
 await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
 await c.route('**/functions/v1/nm-review',r=>{reviewCalls.push(r.request().postDataJSON());return r.abort();});
 await c.route('**/auth/v1/token?grant_type=password',r=>{const d=r.request().postDataJSON();authCalls.push(d);if(d.password!=='Guardian-fixture-1')return r.fulfill({status:400,json:{error_description:'do-not-display-'+d.password}});return r.fulfill({json:{access_token:'guardian-fixture-token',refresh_token:'guardian-fixture-refresh',expires_in:3600,user:{id:'guardian-fixture-owner',email:d.email}}});});
 await c.route('**/functions/v1/nm-membership',r=>r.fulfill({json:{membership:{userId:'guardian-fixture-owner',status:'trial',canUse:true,trialEndsAt:new Date(Date.now()+86400000).toISOString(),serverNow:new Date().toISOString()},contact:{registered:true,smsConsent:false,phoneMasked:'010-****-1234'}}}));
 await c.addInitScript(lang=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'Existing fixture',avatar:{kind:'boy'},view:'town',account:{status:'active'},progress:{}}));},lang);
 await p.goto(base+'/number_magic/access.html?lang='+lang+'&ws=fixture-sheet');
 await p.fill('#login-user','guardian@example.test');await p.fill('#login-password','Wrong-fixture');await p.click('#login-submit');await p.waitForFunction(()=>!document.getElementById('login-submit').disabled);assert.equal(await p.inputValue('#login-password'),'');assert(!(await p.locator('#login-status').innerText()).includes('Wrong-fixture'));
 await p.fill('#login-password','Guardian-fixture-1');await p.click('#login-submit');await p.waitForURL('**/index.html?**');
 await p.waitForFunction(()=>!!window.NM_PROFILE_AUTH?.peek());await p.waitForFunction(()=>document.getElementById('nmGuardBack')?.textContent.match(/학습 화면|Learning screen|学习界面/));
 assert.equal(await p.locator('#nmGuardLoginForm,#nmGuardPasswordForm,.nm-review-banner').count(),0,'no second login or password setup');assert.equal(authCalls.length,2);assert.equal(reviewCalls.length,0,'email credentials never reach review API');assert(p.url().includes('ws=fixture-sheet'));
 assert.equal(await p.evaluate(()=>sessionStorage.getItem('nm_entry_once_v1')),null,'handoff consumed');
 const stored=await p.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));assert(!stored.includes('Guardian-fixture-1')&&!stored.includes('Wrong-fixture'),'passwords never persisted');
 await p.click('#nmGuardBack');await p.waitForFunction(()=>!document.getElementById('nmGuardBack'));
 await p.reload();await p.waitForURL(/access\.html/);assert.equal(authCalls.length,2,'no automatic password submission after reload');
 // Even auth=1 may not restore a previous login without the freshly consumed ticket.
 await p.goto(base+'/number_magic/index.html?enter=1&auth=1');await p.waitForSelector('#nmGuardEmail');assert.equal(await p.evaluate(()=>NM_PROFILE_AUTH.peek()),null);
 await p.click('#nmGuardBack');await p.waitForURL('**/access.html');await p.click('#guardian-link');await p.waitForSelector('#nmGuardSend');
 assert.deepEqual(errors,[]);report.push({lang,sharedEmailLogin:true,noDuplicateLogin:true,signupRecoveryAvailable:true,reloadRequiresLogin:true,passwordRequests:authCalls.length,externalWrites:0});await c.close();
 }
 if(OUT)fs.writeFileSync(path.join(OUT,'review-access.json'),JSON.stringify(report,null,2));console.log('OK: approval skip/guardian route, ko/en/zh390/1280px, full learning-only review, separate points/progress/slots/guardian data, no stored credentials, logout/invalid session');
}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
