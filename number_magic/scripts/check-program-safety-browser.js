#!/usr/bin/env node
'use strict';
// Local-only regression checks: no email, SMS, profile or payment writes reach a server.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
// app/entry.js without the access.html gate: a guardian sign-in still reopens the page into that
// guardian's own learner storage (single-use nm_entry_once_v1 hand-off, or an email-link hash).
const ENTRY_FIXTURE=`(function(){let g=null;try{g=JSON.parse(sessionStorage.getItem('nm_entry_once_v1')||'null');sessionStorage.removeItem('nm_entry_once_v1');}catch(e){}
const link=/^#(?:.*&)?(?:access_token|code)=/.test(location.hash),signed=g&&g.mode==='guardian'&&typeof g.userId==='string';
window.NM_ENTRY={mode:link||signed?'guardian':'preview',guardianUserId:signed?g.userId:null};})();`;
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
  let checks=0;
  const context=async()=>{const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());await c.route('**/app/entry.js*',r=>r.fulfill({contentType:'application/javascript',body:ENTRY_FIXTURE}));return c;};
  try{
    for(const lang of ['ko','en','zh']){
      const ctx=await context(),page=await ctx.newPage();
      const attack='<img src=x onerror="window.__nmInjected=1">';
      await page.goto(base+'/number_magic/ws.html?c='+encodeURIComponent(attack)+'&l='+lang);
      await page.waitForFunction(()=>window.NM_WS_READY==='error');
      assert.equal(await page.evaluate(()=>window.__nmInjected),undefined);
      assert.equal(await page.locator('.ws-err img').count(),0);
      assert(await page.locator('#wsPrint').isDisabled());
      assert.match(await page.locator('.ws-err').innerText(),lang==='ko'?/주소/:lang==='en'?/invalid/:/无效/);
      checks++;
      await page.goto(base+'/number_magic/placement-sheet.html?l='+lang);
      await page.waitForFunction(()=>window.NM_WS_READY===true);
      assert.match(await page.locator('#wsPrint').innerText(),lang==='ko'?/인쇄/:lang==='en'?/Print/:/打印/);
      checks++;
      // Rendering exceptions must also be text, even if their message contains HTML.
      await page.route('**/app/exam.js*',async r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(ROOT,'number_magic/app/exam.js'),'utf8')+'\nNM_EXAM.renderPrintMulti=()=>{throw new Error('+JSON.stringify(attack)+');};'}));
      await page.goto(base+'/number_magic/ws.html?c=C4&auto=0&l='+lang);
      await page.waitForFunction(()=>window.NM_WS_READY==='error');
      assert.equal(await page.evaluate(()=>window.__nmInjected),undefined);
      assert.equal(await page.locator('.ws-err img').count(),0);
      assert((await page.locator('.ws-err').innerText()).includes(attack));
      checks++;await ctx.close();
    }
    for(const raw of ['not-json','null','[]','"text"','42']){
      const ctx=await context(),page=await ctx.newPage();
      // A damaged profile in this browser's own key is kept as *_recovery and replaced by a fresh onboarding.
      // A damaged legacy key (nm_state_v1) is never read, written or renamed (app/learner-storage.js).
      await ctx.addInitScript(raw=>{localStorage.setItem('nm_preview_state_v1',raw);localStorage.setItem('nm_state_v1',raw);},raw);
      await page.goto(base+'/number_magic/index.html?enter=1');
      await page.waitForSelector('.nm-av-card');
      assert.equal(await page.evaluate(()=>NM_STATE_KEY),'nm_preview_state_v1');
      assert.equal(await page.evaluate(()=>NM_GATE.accountActive()),false);
      assert.equal(await page.evaluate(()=>localStorage.getItem('nm_preview_state_v1_recovery')),raw);
      assert.equal(await page.evaluate(()=>localStorage.getItem('nm_state_v1')),raw,'legacy key left untouched');
      checks++;await ctx.close();
    }
    const ctx=await context(),page=await ctx.newPage(),requests=[];
    const owner='11111111-1111-4111-8111-111111111111';
    // Mock-only guardian auth: every /auth/v1 call is fulfilled locally; nothing reaches a real server.
    const PASSWORD='Correct-horse-1',RAW_SERVER='RAW_SERVER_SECRET_ERROR';
    let passwordMode='ok';const passwordPuts=[];
    const authRoute=log=>async r=>{
      const req=r.request(),url=req.url();
      log.push({url,method:req.method()});
      if(url.includes('/verify'))return r.fulfill({json:{access_token:'verified-test-token',refresh_token:'refresh-test-token',expires_in:3600,user:{id:owner,email:'guardian@example.test'}}});
      if(url.includes('grant_type=password')){
        const b=req.postDataJSON();
        if(b.password!==PASSWORD)return r.fulfill({status:400,json:{error_description:RAW_SERVER+' '+b.password}});
        return r.fulfill({json:{access_token:'password-login-token',refresh_token:'password-refresh-token',expires_in:3600,user:{id:owner,email:b.email}}});
      }
      return r.fulfill({json:{}});
    };
    const userRoute=r=>{
      const req=r.request();
      if(req.method()==='PUT'){
        const body=req.postDataJSON();passwordPuts.push({authorization:req.headers().authorization,body});
        if(passwordMode==='fail')return r.fulfill({status:500,json:{msg:RAW_SERVER+' '+body.password}});
        return r.fulfill({json:{id:owner,email:'guardian@example.test'}});
      }
      return r.fulfill({json:{id:owner,email:'guardian@example.test'}});
    };
    // Mock-only membership endpoint (/functions/v1/nm-membership): status + register_contact. Same shape as app/membership.js expects.
    const PRIVACY_VERSION='2026-10-22-v1',DAY=86400000,PHONE_RAW='010-1234-5678',PHONE_DIGITS='01012345678';
    const makeMem=(registered,mode)=>({registered,mode:mode||'trial',sms:false,calls:[],registrations:[]});
    const membershipRoute=mem=>async r=>{
      const req=r.request(),cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'POST, OPTIONS'};
      if(req.method()==='OPTIONS')return r.fulfill({status:204,headers:cors});
      const body=req.postDataJSON()||{},now=Date.now(),expired=mem.mode==='expired';
      mem.calls.push({action:body.action,authorization:req.headers().authorization,body});
      const contact=()=>({registered:mem.registered,phoneMasked:mem.registered?'010-****-5678':null,smsConsent:mem.sms,privacyVersion:mem.registered?PRIVACY_VERSION:null,consentedAt:mem.registered?new Date(now).toISOString():null});
      if(body.action==='status')return r.fulfill({headers:cors,json:{membership:{userId:owner,serverNow:new Date(now).toISOString(),trialStartedAt:new Date(now-(expired?14:1)*DAY).toISOString(),trialEndsAt:new Date(now+(expired?-7:6)*DAY).toISOString(),endsAt:null,status:expired?'expired':'trial',plan:null,canUse:!expired},settings:null,contact:contact()}});
      if(body.action==='register_contact'){
        if(!/^01\d{8,9}$/.test(String(body.phone||'').replace(/\D/g,''))||body.collectionConsent!==true||body.guardianConsent!==true||body.privacyVersion!==PRIVACY_VERSION)return r.fulfill({status:400,headers:cors,json:{error:'invalid_contact'}});
        mem.registered=true;mem.sms=body.smsConsent===true;mem.registrations.push(body);
        return r.fulfill({headers:cors,json:{ok:true,userId:owner,contact:contact()}});
      }
      return r.fulfill({status:400,headers:cors,json:{error:'unknown_action'}});
    };
    const mainMem=makeMem(false); // fresh signup: no phone registered yet
    let extra=0;
    const openGuard=async p=>{await p.goto(base+'/number_magic/index.html?enter=1');await p.locator('[data-id="game"]:visible,#ttGame:visible').first().click();await p.click('#charChipBtn');await p.click('.nm-closet-settings > summary');await p.waitForSelector('#nmGuardEmail');};
    const fillPassword=async(p,pw,confirm)=>{await p.waitForSelector('#nmGuardNewPassword');await p.fill('#nmGuardNewPassword',pw);await p.fill('#nmGuardConfirmPassword',confirm);await p.click('#nmGuardPasswordSave');};
    const status=(p,sel)=>p.locator(sel).innerText();
    const layout=p=>p.evaluate(()=>{const w=innerWidth;return{scroll:document.documentElement.scrollWidth>w+2,bad:[...document.querySelectorAll('.nm-guard-card, .nm-guard-card *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>w+1||r.left<-1);}).map(e=>e.id||e.className||e.tagName)};});
    const sizes=(p,sels)=>p.evaluate(sels=>sels.map(s=>{const e=document.querySelector(s),cs=getComputedStyle(e);return{s,fs:parseFloat(cs.fontSize),h:e.getBoundingClientRect().height};}),sels);
    const original={name:'이메일검수',lang:'ko',onboarded:true,cloudLinked:true,progress:{'A-02':{done:true,steps:{stamp:true}}},account:{status:'active'},character:{number:3,color:'blue'},avatar:{kind:'boy'}};
    await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_preview_state_v1'))localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},original);
    // After sign-in the page reopens in this guardian's own learner storage, where onboarding is finished
    // (no name yet, not linked, no progress) — the ID card then registers the learner name.
    await ctx.addInitScript(o=>{const k='nm_learner_state_v1_'+o;if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({lang:'ko',onboarded:true,character:{number:3,color:'blue'},avatar:{kind:'boy'},progress:{}}));},owner);
    await ctx.route('**/auth/v1/**',authRoute(requests));
    await ctx.route('**/auth/v1/user',userRoute); // later routes win: GET user (email link) and PUT user (set password)
    await ctx.route('**/functions/v1/nm-membership',membershipRoute(mainMem));
    const profiles=[];let profileRows=[];
    await ctx.route('**/rest/v1/nm_profiles**',async r=>{
      profiles.push({method:r.request().method(),url:r.request().url(),headers:r.request().headers(),body:r.request().postDataJSON()});
      return r.fulfill({status:r.request().method()==='POST'?201:200,json:r.request().method()==='GET'?profileRows:r.request().method()==='PATCH'?[{name:original.name}]:{}});
    });
    await page.goto(base+'/number_magic/index.html?enter=1');
    await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
    await page.locator('[data-id="game"]:visible,#ttGame:visible').first().click();
    await page.click('#charChipBtn');
    await page.click('.nm-closet-settings > summary');
    await page.waitForSelector('#nmGuardEmail');
    assert.equal(profiles.length,0,'legacy cloudLinked flag alone sends no profile requests');
    assert.equal(await page.locator('#idClaim').count(),0,'name-only resume is unavailable');checks++;
    await page.fill('#nmGuardEmail','guardian@example.test');await page.click('#nmGuardSend');
    await page.waitForFunction(()=>document.getElementById('nmGuardSend')&&!document.getElementById('nmGuardSend').disabled);
    assert.equal(requests.filter(x=>x.url.includes('/otp')).length,1);
    await page.fill('#nmGuardToken','123456');await page.click('#nmGuardVerify');
    // OTP only proves the email: the password screen appears and learner ID claim/resume stays locked.
    await page.waitForSelector('#nmGuardNewPassword');
    assert.equal(await page.locator('#idClaim').count(),0,'no learner ID claim before a password is saved');
    assert.equal(await page.locator('#idResume').count(),0);
    assert.equal(profiles.length,0);
    for(const sel of ['#nmGuardNewPassword','#nmGuardConfirmPassword']){
      const el=page.locator(sel);
      assert.equal(await el.getAttribute('type'),'password');assert.equal(await el.getAttribute('minlength'),'8');
      assert.equal(await el.getAttribute('maxlength'),'128');assert.equal(await el.getAttribute('autocomplete'),'new-password');
    }
    assert(await page.locator('#nmGuardPasswordSave').isVisible());assert(await page.locator('#nmGuardOut').isVisible(),'pending password screen can sign out');
    assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1'))).password_setup_pending,true);
    // Mismatch and a server failure never unlock, never call out wrongly, and never echo the password or raw server text.
    await fillPassword(page,PASSWORD,'Different-pass-2');
    assert.match(await status(page,'#nmGuardPasswordMsg'),/서로 달라요/);
    assert.equal(passwordPuts.length,0,'mismatch is rejected before any request');
    passwordMode='fail';
    await fillPassword(page,PASSWORD,PASSWORD);
    await page.waitForFunction(()=>/저장하지 못했어요/.test((document.getElementById('nmGuardPasswordMsg')||{}).textContent||''));
    assert.equal(passwordPuts.length,1);assert.equal(passwordPuts[0].authorization,'Bearer verified-test-token');
    const failText=await status(page,'#nmGuardPasswordMsg');
    assert(!failText.includes(RAW_SERVER)&&!failText.includes(PASSWORD),'error text never echoes the password or raw server error');
    assert.equal(await page.locator('#idClaim').count(),0,'failed password save does not unlock');
    assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1'))).password_setup_pending,true);
    assert.equal(profiles.length,0);
    passwordMode='ok';await page.waitForFunction(()=>!document.getElementById('nmGuardPasswordSave').disabled);
    await fillPassword(page,PASSWORD,PASSWORD);
    // Fresh signup: password is not enough. Phone step comes first and no profile exists until it is saved.
    await page.waitForSelector('#nmGuardPhone');
    assert.equal(await page.locator('#idClaim').count(),0,'no learner ID claim before the phone is registered');
    assert.equal(profiles.length,0,'no profile request before phone registration');
    assert(mainMem.calls.some(x=>x.action==='status'&&x.authorization==='Bearer verified-test-token'),'status is checked with the guardian session');
    const phoneCard=page.locator('#nmGuardPhone').locator('xpath=ancestor::*[contains(@class,"nm-guard-card")][1]');
    // app/privacy-consent.js: [필수] 수집·이용 · [필수] 보호자 확인 · [선택] 문자. None is pre-checked.
    const box=id=>phoneCard.locator('#nmContact'+id);
    const consent={};for(const id of ['Privacy','Guardian','Sms'])consent[id]=await box(id).evaluate(e=>({required:e.required,checked:e.checked}));
    assert(consent.Privacy.required&&!consent.Privacy.checked,'collection consent is mandatory and not pre-checked');
    assert(consent.Guardian.required&&!consent.Guardian.checked,'guardian confirmation is mandatory and not pre-checked');
    assert(!consent.Sms.required&&!consent.Sms.checked,'SMS consent is optional and unchecked');
    const phoneSave=phoneCard.locator('#nmGuardPhoneSave,button[type=submit]').first();
    await page.fill('#nmGuardPhone',PHONE_RAW);await phoneSave.click();
    await page.waitForTimeout(300);
    assert.equal(mainMem.registrations.length,0,'phone is not sent without collection consent');
    assert.equal(await page.locator('#idClaim').count(),0);
    await box('Privacy').check();await phoneSave.click();await page.waitForTimeout(300);
    assert.equal(mainMem.registrations.length,0,'phone is not sent without guardian confirmation');
    await box('Guardian').check();await phoneSave.click();
    await page.waitForSelector('#idClaim');assert.equal(profiles.length,0);
    assert.equal(mainMem.registrations.length,1);assert.equal(mainMem.registrations[0].collectionConsent,true);assert.equal(mainMem.registrations[0].smsConsent,false,'SMS consent stays opt-in');
    assert.equal(mainMem.registrations[0].phone.replace(/\D/g,''),PHONE_DIGITS);
    const stored=await page.evaluate(()=>JSON.stringify(localStorage)+JSON.stringify(sessionStorage));
    assert(!stored.includes(PHONE_RAW)&&!stored.includes(PHONE_DIGITS)&&!stored.includes('12345678'),'raw phone is never persisted in browser storage');
    assert(!JSON.stringify(profiles).includes('12345678'),'raw phone never goes to profile writes');
    assert.equal(await page.evaluate(()=>NM_GATE.accountActive()),false,'learner ownership must also be connected');
    extra++;
    assert.equal(passwordPuts.length,2);assert.equal(passwordPuts[1].body.password,PASSWORD);
    assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1'))).password_setup_pending,false);
    assert(!(await page.evaluate(()=>JSON.stringify(localStorage)+JSON.stringify(sessionStorage))).includes(PASSWORD),'password is never persisted');checks++;
    // The sign-in reopened the page in this guardian's own learner storage. The preview profile is not copied in.
    assert.equal(await page.evaluate(()=>NM_STATE_KEY),'nm_learner_state_v1_'+owner);
    if(await page.locator('#idName').count())await page.fill('#idName',original.name);
    await page.click('#idClaim');await page.waitForSelector('.nm-idcard.linked',{state:'attached',timeout:8000}).catch(async e=>{console.error('CLAIM:',await page.locator('#nm-idcard-slot').innerText(),JSON.stringify(profiles.map(x=>[x.method,x.url.split('?')[1],x.body])).slice(0,800));throw e;});
    assert.equal(await page.evaluate(()=>NM_GATE.accountActive()),true,'own linked learner + registered phone + usable trial opens the account');
    const insert=profiles.find(x=>x.method==='POST');assert(insert);assert.equal(insert.headers.authorization,'Bearer verified-test-token');assert.equal(insert.body.owner_id,owner);
    assert(profiles.filter(x=>x.method==='GET').every(x=>x.url.includes('owner_id=eq.'+owner)));
    const previewProgress=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('nm_preview_state_v1')).progress);
    assert.deepEqual(await previewProgress(),original.progress,'preview profile is left untouched');checks++;
    // Sign-out returns to the access page; the guardian session is gone and the preview cannot be approved locally.
    await page.click('#nmGuardOut');await page.waitForURL(/access\.html/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1')),null);
    await openGuard(page);
    assert.equal(await page.evaluate(()=>NM_GATE.accountActive()),false,'logout cannot reactivate a legacy local approval after guardian enrollment');
    assert.equal(await page.locator('#accCode').count(),0,'enrolled learner is not offered a legacy approval-code bypass');
    assert.deepEqual(await previewProgress(),original.progress);checks++;
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)),'email controls fit mobile viewport');
    // Later sign-in works with email + password (no OTP), and a wrong password shows a safe message.
    const otpBefore=requests.filter(x=>x.url.includes('/otp')).length;
    await page.fill('#nmGuardEmail','guardian@example.test');await page.fill('#nmGuardLoginPassword','Wrong-password-9');await page.click('#nmGuardLogin');
    await page.waitForFunction(()=>/맞지 않아요/.test((document.getElementById('nmGuardLoginMsg')||{}).textContent||''));
    const badLogin=await status(page,'#nmGuardLoginMsg');
    assert(!badLogin.includes(RAW_SERVER)&&!badLogin.includes('Wrong-password-9'));
    assert.equal(await page.inputValue('#nmGuardLoginPassword'),'');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1')),null);
    await page.fill('#nmGuardLoginPassword',PASSWORD);await page.click('#nmGuardLogin');
    // The same guardian's learner storage opens again, already linked.
    await page.waitForFunction(o=>window.NM_STATE_KEY==='nm_learner_state_v1_'+o&&window.NM_GATE&&NM_GATE.accountActive(),owner);
    assert.equal(await page.locator('#nmGuardNewPassword').count(),0,'password sign-in does not ask for a new password');
    assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1'))).password_setup_pending,false);
    assert.equal(requests.filter(x=>x.url.includes('/otp')).length,otpBefore,'password sign-in sends no email');
    assert(requests.some(x=>x.method==='POST'&&x.url.includes('grant_type=password')));
    assert(!(await page.evaluate(()=>JSON.stringify(localStorage)+JSON.stringify(sessionStorage))).includes(PASSWORD));checks++;
    profileRows=[{name:original.name,owner_id:owner,state:{name:original.name,lang:'ko',progress:{},onboarded:true}}];
    await page.evaluate(()=>NM_PROFILE_AUTH.signOut());await page.waitForURL(/access\.html/);
    // A supplied email-link token is only a candidate until the guardian confirms the displayed email.
    await page.goto(base+'/number_magic/index.html?enter=1#access_token=link-test-token&refresh_token=link-refresh&expires_in=3600');
    await page.waitForSelector('#nmGuardAccept');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1')),null);
    assert.equal(new URL(page.url()).hash,'');
    await page.click('#nmGuardAccept');await page.waitForSelector('#nmGuardNewPassword');
    assert.equal(await page.locator('#idClaim').count(),0,'a confirmed email link also requires a password first');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_guardian_session_v1')).password_setup_pending),true);
    await fillPassword(page,PASSWORD,PASSWORD);await page.waitForFunction(()=>window.NM_GATE&&NM_GATE.accountActive());
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_guardian_session_v1')).user.id),owner);checks++;
    await ctx.close();
    const fresh=await context(),newPage=await fresh.newPage();
    await fresh.route('**/auth/v1/user',userRoute);
    await fresh.route('**/functions/v1/nm-membership',membershipRoute(makeMem(true))); // returning guardian: phone already registered
    await fresh.route('**/rest/v1/nm_profiles**',r=>{
      assert.equal(r.request().method(),'GET','a new device resumes without creating a placeholder profile');
      assert.equal(r.request().headers().authorization,'Bearer fresh-link-token');
      return r.fulfill({json:profileRows});
    });
    await newPage.goto(base+'/number_magic/index.html?enter=1#access_token=fresh-link-token&refresh_token=fresh-refresh&expires_in=3600');
    await newPage.waitForSelector('#nmGuardAccept');await newPage.click('#nmGuardAccept');
    await fillPassword(newPage,PASSWORD,PASSWORD);
    await newPage.waitForSelector('#idClaim');await newPage.fill('#idName',original.name);await newPage.click('#idClaim');
    await newPage.waitForSelector('#idResume',{timeout:10000}).catch(async e=>{console.error('New-device resume state:',await newPage.locator('#nm-idcard-slot').innerText());throw e;});await newPage.click('#idResume');
    // Resuming a cloud copy keeps a backup of what was on this device and normalizes missing account data.
    assert.notEqual(await newPage.evaluate(()=>localStorage.getItem(NM_STATE_KEY+'_preresume')),null);
    assert.equal(await newPage.evaluate(()=>JSON.parse(localStorage.getItem(NM_STATE_KEY)).account.status),'trial');
    assert.equal(await newPage.evaluate(()=>JSON.parse(localStorage.getItem(NM_STATE_KEY)).onboarded),true);
    assert.equal(await newPage.evaluate(()=>JSON.parse(localStorage.getItem(NM_STATE_KEY)).cloudOwnerId),owner);checks++;
    await fresh.close();
    // ko/en/zh at 390px: login + password screens fit, controls are >=16px/>=44px, errors are localized and safe.
    const T={
      ko:{login:/로그인/,bad:/맞지 않아요/,mismatch:/서로 달라요/,fail:/저장하지 못했어요/},
      en:{login:/Sign in/,bad:/incorrect/,mismatch:/do not match/,fail:/Could not save the password/},
      zh:{login:/登录/,bad:/不正确/,mismatch:/不一致/,fail:/无法保存密码/}};
    for(const lang of ['ko','en','zh']){
      const lctx=await context(),lpage=await lctx.newPage(),t=T[lang];
      await lctx.addInitScript(s=>{if(!localStorage.getItem('nm_preview_state_v1'))localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},{...original,lang});
      await lctx.route('**/auth/v1/**',authRoute([]));await lctx.route('**/auth/v1/user',userRoute);
      await lctx.route('**/functions/v1/nm-membership',membershipRoute(makeMem(true)));
      await lctx.route('**/rest/v1/nm_profiles**',r=>r.fulfill({json:[]}));
      passwordMode='ok';
      await lpage.goto(base+'/number_magic/index.html?enter=1');
      await lpage.addLocatorHandler(lpage.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
      await lpage.locator('[data-id="game"]:visible,#ttGame:visible').first().click();
      await lpage.click('#charChipBtn');await lpage.click('.nm-closet-settings > summary');
      await lpage.waitForSelector('#nmGuardEmail');
      for(const id of ['#nmGuardEmail','#nmGuardSend','#nmGuardToken','#nmGuardVerify','#nmGuardLoginPassword','#nmGuardLogin'])assert(await lpage.locator(id).isVisible(),lang+' '+id+' visible');
      assert.match(await lpage.locator('#nmGuardLogin').innerText(),t.login);
      let lay=await layout(lpage);assert(!lay.scroll&&lay.bad.length===0,lang+' login UI overflows: '+lay.bad.join(','));
      for(const s of await sizes(lpage,['#nmGuardEmail','#nmGuardLoginPassword','#nmGuardToken']))assert(s.fs>=16&&s.h>=44,lang+' '+s.s+' size '+JSON.stringify(s));
      for(const s of await sizes(lpage,['#nmGuardLogin','#nmGuardSend','#nmGuardVerify']))assert(s.h>=44,lang+' '+s.s+' height '+s.h);
      assert.equal(await lpage.evaluate(()=>getComputedStyle(document.querySelector('.nm-guard-card p')).wordBreak),'keep-all',lang+' no mid-word breaks');
      await lpage.fill('#nmGuardEmail','guardian@example.test');await lpage.fill('#nmGuardLoginPassword','Wrong-password-9');await lpage.click('#nmGuardLogin');
      await lpage.waitForFunction(re=>new RegExp(re).test((document.getElementById('nmGuardLoginMsg')||{}).textContent||''),t.bad.source);
      const badText=await status(lpage,'#nmGuardLoginMsg');
      assert(!badText.includes(RAW_SERVER)&&!badText.includes('Wrong-password-9'),lang+' login error is safe');
      await lpage.fill('#nmGuardToken','123456');await lpage.click('#nmGuardVerify');
      await lpage.waitForSelector('#nmGuardNewPassword');
      assert.equal(await lpage.locator('#idClaim').count(),0);
      lay=await layout(lpage);assert(!lay.scroll&&lay.bad.length===0,lang+' password UI overflows: '+lay.bad.join(','));
      for(const s of await sizes(lpage,['#nmGuardNewPassword','#nmGuardConfirmPassword']))assert(s.fs>=16&&s.h>=44,lang+' '+s.s+' size '+JSON.stringify(s));
      for(const s of await sizes(lpage,['#nmGuardPasswordSave','#nmGuardOut']))assert(s.h>=44,lang+' '+s.s+' height '+s.h);
      assert.equal(await lpage.getAttribute('#nmGuardPasswordMsg','role'),'status');
      await fillPassword(lpage,PASSWORD,'Different-pass-2');
      assert.match(await status(lpage,'#nmGuardPasswordMsg'),t.mismatch);
      passwordMode='fail';await fillPassword(lpage,PASSWORD,PASSWORD);
      await lpage.waitForFunction(re=>new RegExp(re).test((document.getElementById('nmGuardPasswordMsg')||{}).textContent||''),t.fail.source);
      const failMsg=await status(lpage,'#nmGuardPasswordMsg');
      assert(!failMsg.includes(RAW_SERVER)&&!failMsg.includes(PASSWORD),lang+' password error is safe');
      assert.equal(await lpage.locator('#idClaim').count(),0);
      lay=await layout(lpage);assert(!lay.scroll&&lay.bad.length===0,lang+' password error state overflows: '+lay.bad.join(','));
      passwordMode='ok';checks++;await lctx.close();
    }
    // Expired membership: server says canUse=false, so only the free-trial gate must not stay open (even for trial units).
    {
      const ex=await context(),exPage=await ex.newPage(),exMem=makeMem(true,'expired');
      await ex.addInitScript(s=>{if(!localStorage.getItem('nm_preview_state_v1'))localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},original);
      await ex.route('**/auth/v1/**',authRoute([]));await ex.route('**/auth/v1/user',userRoute);
      await ex.route('**/rest/v1/nm_profiles**',r=>r.fulfill({json:[]}));
      await ex.route('**/functions/v1/nm-membership',membershipRoute(exMem));
      passwordMode='ok';
      await exPage.goto(base+'/number_magic/index.html?enter=1');
      await exPage.addLocatorHandler(exPage.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
      const trialUnit=await exPage.evaluate(()=>[...NM_GATE.trialUnitSet()][0]);
      assert(trialUnit,'a trial unit exists');
      await exPage.locator('[data-id="game"]:visible,#ttGame:visible').first().click();
      await exPage.click('#charChipBtn');await exPage.click('.nm-closet-settings > summary');
      await exPage.waitForSelector('#nmGuardEmail');
      await exPage.fill('#nmGuardEmail','guardian@example.test');await exPage.fill('#nmGuardToken','123456');await exPage.click('#nmGuardVerify');
      await fillPassword(exPage,PASSWORD,PASSWORD);
      await exPage.waitForFunction(()=>window.NM_MEMBERSHIP.snapshot().membership?.status==='expired');
      assert.equal(await exPage.evaluate(()=>NM_GATE.accountActive()),false,'expired membership is not active');
      assert.equal(await exPage.evaluate(u=>NM_GATE.isTrialUnit(u),trialUnit),false,'expired membership gets no trial units');
      assert.equal(await exPage.evaluate(u=>NM_GATE.unitLocked(u),trialUnit),true);
      extra++;await ex.close();
    }
    console.log('PROGRAM_SAFETY_BROWSER_OK cases='+checks+' membershipCases='+extra+' externalWrites=0');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
