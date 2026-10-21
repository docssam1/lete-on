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
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
  let checks=0;
  const context=async()=>{const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());return c;};
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
      await page.route('**/app/exam.js',async r=>r.fulfill({contentType:'application/javascript',body:fs.readFileSync(path.join(ROOT,'number_magic/app/exam.js'),'utf8')+'\nNM_EXAM.renderPrintMulti=()=>{throw new Error('+JSON.stringify(attack)+');};'}));
      await page.goto(base+'/number_magic/ws.html?c=C4&auto=0&l='+lang);
      await page.waitForFunction(()=>window.NM_WS_READY==='error');
      assert.equal(await page.evaluate(()=>window.__nmInjected),undefined);
      assert.equal(await page.locator('.ws-err img').count(),0);
      assert((await page.locator('.ws-err').innerText()).includes(attack));
      checks++;await ctx.close();
    }
    for(const raw of ['not-json','null','[]','"text"','42']){
      const ctx=await context(),page=await ctx.newPage();
      await ctx.addInitScript(raw=>localStorage.setItem('nm_state_v1',raw),raw);
      await page.goto(base+'/number_magic/index.html?enter=1');
      await page.waitForSelector('.nm-av-card');
      assert.equal(await page.evaluate(()=>NM_GATE.accountActive()),false);
      assert.equal(await page.evaluate(()=>localStorage.getItem('nm_state_v1_recovery')),raw);
      checks++;await ctx.close();
    }
    const ctx=await context(),page=await ctx.newPage(),requests=[];
    const owner='11111111-1111-4111-8111-111111111111';
    const original={name:'이메일검수',lang:'ko',onboarded:true,cloudLinked:true,progress:{'A-02':{done:true,steps:{stamp:true}}},account:{status:'active'},character:{number:3,color:'blue'},avatar:{kind:'boy'}};
    await ctx.addInitScript(s=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify(s));},original);
    await ctx.route('**/auth/v1/**',async r=>{
      requests.push({url:r.request().url(),method:r.request().method()});
      if(r.request().url().includes('/verify'))return r.fulfill({json:{access_token:'verified-test-token',refresh_token:'refresh-test-token',expires_in:3600,user:{id:owner,email:'guardian@example.test'}}});
      return r.fulfill({json:{}});
    });
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
    await page.waitForSelector('#idClaim');assert.equal(profiles.length,0);
    await page.click('#idClaim');await page.waitForSelector('.nm-idcard.linked',{state:'attached'});
    await page.click('.nm-closet-settings > summary');
    const insert=profiles.find(x=>x.method==='POST');assert(insert);assert.equal(insert.headers.authorization,'Bearer verified-test-token');assert.equal(insert.body.owner_id,owner);
    assert(profiles.filter(x=>x.method==='GET').every(x=>x.url.includes('owner_id=eq.'+owner)));
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).progress),original.progress);checks++;
    await page.click('#nmGuardOut');await page.waitForSelector('#nmGuardEmail');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1')),null);
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).progress),original.progress);checks++;
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2)),'email controls fit mobile viewport');
    // Resuming a cloud copy preserves the previous local progress and normalizes missing account data.
    profileRows=[{name:original.name,owner_id:owner,state:{name:original.name,lang:'ko',progress:{},onboarded:true}}];
    await page.fill('#nmGuardEmail','guardian@example.test');await page.fill('#nmGuardToken','123456');await page.click('#nmGuardVerify');
    await page.waitForSelector('#idClaim');await page.click('#idClaim');await page.waitForSelector('#idResume');await page.click('#idResume');
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1_preresume')).progress),original.progress);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).account.status),'trial');checks++;
    // A supplied email-link token is only a candidate until the guardian confirms the displayed email.
    await page.click('.nm-closet-settings > summary');await page.click('#nmGuardOut');await page.waitForSelector('#nmGuardEmail');
    await ctx.route('**/auth/v1/user',r=>r.fulfill({json:{id:owner,email:'guardian@example.test'}}));
    await page.goto(base+'/number_magic/index.html?enter=1#access_token=link-test-token&refresh_token=link-refresh&expires_in=3600');
    await page.waitForSelector('#nmGuardAccept');
    assert.equal(await page.evaluate(()=>localStorage.getItem('nm_guardian_session_v1')),null);
    assert.equal(new URL(page.url()).hash,'');
    await page.click('#nmGuardAccept');await page.waitForSelector('#idClaim');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_guardian_session_v1')).user.id),owner);checks++;
    await ctx.close();
    const fresh=await context(),newPage=await fresh.newPage();
    await fresh.route('**/auth/v1/user',r=>r.fulfill({json:{id:owner,email:'guardian@example.test'}}));
    await fresh.route('**/rest/v1/nm_profiles**',r=>{
      assert.equal(r.request().method(),'GET','a new device resumes without creating a placeholder profile');
      assert.equal(r.request().headers().authorization,'Bearer fresh-link-token');
      return r.fulfill({json:profileRows});
    });
    await newPage.goto(base+'/number_magic/index.html?enter=1#access_token=fresh-link-token&refresh_token=fresh-refresh&expires_in=3600');
    await newPage.waitForSelector('#nmGuardAccept');await newPage.click('#nmGuardAccept');
    await newPage.waitForSelector('#idClaim');await newPage.fill('#idName',original.name);await newPage.click('#idClaim');
    await newPage.waitForSelector('#idResume',{timeout:10000}).catch(async e=>{console.error('New-device resume state:',await newPage.locator('#nm-idcard-slot').innerText());throw e;});await newPage.click('#idResume');
    assert.equal(await newPage.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).onboarded),true);
    assert.equal(await newPage.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')).cloudOwnerId),owner);checks++;
    await fresh.close();
    console.log('PROGRAM_SAFETY_BROWSER_OK cases='+checks+' externalWrites=0');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
