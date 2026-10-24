#!/usr/bin/env node
'use strict';
// Real roadmap view. Button routing is observed independently of the worksheet renderer.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
const OWNER='22222222-2222-4222-8222-222222222222';
async function signInFixture(page,base){
 const session={access_token:'middle-fixture-token',refresh_token:'middle-fixture-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:OWNER,email:'guardian@example.test'},password_setup_pending:false};
 const cors={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'POST, OPTIONS'};
 await page.route('**/functions/v1/nm-membership',r=>{
  if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers:cors});
  const now=Date.now();return r.fulfill({headers:cors,json:{membership:{userId:OWNER,serverNow:new Date(now).toISOString(),trialStartedAt:new Date(now-86400000).toISOString(),trialEndsAt:new Date(now+6*86400000).toISOString(),status:'trial',canUse:true},settings:null,contact:{registered:true,privacyVersion:'2026-10-22-v1',phoneMasked:'010-****-5678',smsConsent:false}}});
 });
 await page.route('**/auth/v1/**',r=>r.fulfill({headers:cors,json:r.request().url().includes('/token?grant_type=password')?session:session.user}));
 await page.route('**/rest/v1/nm_profiles**',r=>r.fulfill({headers:cors,json:[]}));
 await page.goto(base+'/access.html?lang=ko');
 await page.click('#open-book');await page.fill('#login-user','guardian@example.test');await page.fill('#login-password','fixture-only');await page.click('#login-submit');
 await page.waitForFunction(()=>window.NM_MEMBERSHIP?.contactReady());
 await page.waitForSelector('#nmGuardBack');await page.click('#nmGuardBack');
 await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
 await page.locator('#ttRoad:visible,.nm-title3d [data-id=road]:visible').first().waitFor();
 await page.locator('#ttRoad:visible,.nm-title3d [data-id=road]:visible').first().click();
}
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM});
    const page=await browser.newPage(),errors=[],checks=[];
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      window.NM_NO_AUTOPRINT=true;window.print=()=>{};
      localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'진도 검수',view:'courseroad',avatar:{kind:'boy'},cloudLinked:true,cloudOwnerId:'22222222-2222-4222-8222-222222222222',progress:{},account:{status:'active'},placement:{course:'C29',self:true},roadCadence:'w1'}));
    });
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:1100});
      await signInFixture(page,'http://127.0.0.1:'+server.address().port);
      await page.waitForSelector('#middlePacing1');
      assert.equal(await page.locator('.nm-middle-pacing').count(),3);
      /* 2026-09-25: 보기는 정규 과정에서 계산된다 — 기대값도 데이터에서 읽는다(옛 판은 42·14 고정) */
      const expect=await page.evaluate(()=>Object.values(NM_MIDDLE_PACING.grades).map(p=>({n:p.sessions.length,first:p.sessions[0].id})));
      assert.equal(await page.locator('[data-middle-session]').count(),expect.reduce((a,e)=>a+e.n,0));
      await page.evaluate(()=>{window.__pacingCalls=[];NM_EXAM.openMiddlePacing=(grade,id)=>window.__pacingCalls.push({grade,id});});
      for(const grade of [1,2,3]){
        const plan=page.locator('#middlePacing'+grade);
        await plan.locator('summary').click();
        assert.match(await plan.locator('.nm-mp-summeta').innerText(),/기본\s*10주.*속진\s*8주/);
        assert.equal(await plan.locator('.nm-mp-session').count(),expect[grade-1].n);
        const buttons=plan.locator('[data-middle-session]');
        await buttons.first().focus();await page.keyboard.press('Enter');
        const received=await page.evaluate(()=>window.__pacingCalls.pop());
        assert.equal(received.grade,grade);assert.equal(received.id,expect[grade-1].first);
        const bounds=await plan.evaluate(e=>{
          const r=e.getBoundingClientRect();
          return {left:r.left,right:r.right,width:innerWidth,overflow:[...e.querySelectorAll('h4,p,button')].some(x=>x.scrollWidth>x.clientWidth+3)};
        });
        assert(bounds.left>=-1&&bounds.right<=width+1&&!bounds.overflow,JSON.stringify(bounds));
        // The roadmap scrolls inside its own panel. A tall element screenshot is clipped by
        // that ancestor; capture the real viewport and separately prove the final row is reachable.
        if(out){await buttons.first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'middle'+grade+'-'+width+'.png')});}
        await buttons.last().scrollIntoViewIfNeeded();
        const tail=await buttons.last().boundingBox();
        assert(tail&&tail.y>=0&&tail.y+tail.height<=1100,'last session must be reachable inside the scrolling roadmap');
        checks.push({width,grade,rows:expect[grade-1].n,keyboardRoute:received.id,overflow:false});
        await plan.locator('summary').click();
      }
    }
    assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,checks,errors},null,2));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
