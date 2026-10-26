#!/usr/bin/env node
'use strict';
// Local-only checks: academy-applied personal plan on the course road, and /w/?m= short-link redirects.
// Every network call is mocked; nothing is written to any real server.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  let file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(404);return res.end();}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'POST, OPTIONS'};
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
  let checks=0;
  const context=async(width)=>{const c=await browser.newContext({viewport:{width:width||390,height:900},reducedMotion:'reduce'});await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());return c;};
  const owner='22222222-2222-4222-8222-222222222222',NAME='개인로드맵';
  const high=process.argv.includes('--high'),middle=process.argv.includes('--middle'),calculus=process.argv.includes('--calculus'),compact=high||middle||calculus;
  const settings={profileName:NAME,version:7,courseKey:'C4',sessionIndex:3,speed:1.5,amount:1.25,cadence:'w2',entryYear:2020,startDate:'2026-10-19',updatedAt:'2026-10-20T00:00:00.000Z'};
  if(high)Object.assign(settings,{courseKey:'C58',sessionIndex:1,speed:1,amount:1,startDate:'2026-10-23'});
  if(middle)Object.assign(settings,{courseKey:'C29',sessionIndex:1,speed:1,amount:1,cadence:'w1',startDate:'2026-10-23'});
  if(calculus)Object.assign(settings,{courseKey:'C70',sessionIndex:1,speed:1,amount:1,cadence:'w1',startDate:'2026-10-24'});
  const original={name:NAME,lang:'ko',onboarded:true,cloudLinked:true,cloudOwnerId:owner,view:'courseroad',progress:{'A-02':{done:true,steps:{stamp:true}}},account:{status:'active'},character:{number:3,color:'blue',hat:'none'},avatar:{id:'legacy',kind:'boy',look:'boy',name:'',outfit:'original'}};
  const session={access_token:'fake-owner-token',refresh_token:'fake-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:owner,email:'guardian@example.test'},password_setup_pending:false};
  const T={
    ko:{sum:/나의 월별 로드맵.*12개월/,applied:/학원에서 정한/},
    en:{sum:/My monthly roadmap.*12 months/,applied:/academy’s individual/},
    zh:{sum:/我的月度路线图.*12个月/,applied:/已应用学院/}};
  try{
    for(const width of [390,1280])for(const lang of ['ko','en','zh']){
      const ctx=await context(width),page=await ctx.newPage(),calls=[],writes=[],external=[];
      page.on('request',r=>{const u=r.url();if(!u.startsWith(base+'/'))external.push({method:r.method(),url:u});});
      await ctx.addInitScript(([s,sess])=>{
        if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify(s));
        // Each visit starts with explicit sign-in; an old stored session must not bypass it.
      },[{...original,lang},session]);
      await ctx.route('**/functions/v1/nm-membership',async r=>{
        const req=r.request();
        if(req.method()==='OPTIONS')return r.fulfill({status:204,headers:CORS});
        const body=req.postDataJSON()||{},now=Date.now();
        calls.push({action:body.action,authorization:req.headers().authorization,body});
        if(body.action!=='status')return r.fulfill({status:400,headers:CORS,json:{error:'unknown_action'}});
        return r.fulfill({headers:CORS,json:{membership:{userId:owner,serverNow:new Date(now).toISOString(),trialStartedAt:new Date(now-86400000).toISOString(),trialEndsAt:new Date(now+6*86400000).toISOString(),endsAt:null,status:'trial',plan:null,canUse:true},settings:body.profileName===NAME?settings:null,contact:{registered:true,privacyVersion:'2026-10-22-v1',phoneMasked:'010-****-5678',smsConsent:false}}});
      });
      await ctx.route('**/rest/v1/nm_profiles**',r=>{
        if(r.request().method()!=='GET')writes.push(r.request().method()+' '+r.request().url());
        return r.fulfill({json:[]});
      });
      await ctx.route('**/auth/v1/**',r=>{if(r.request().url().includes('/token?grant_type=password'))return r.fulfill({json:session});writes.push('auth '+r.request().method()+' '+r.request().url());return r.fulfill({json:{}});});
      await page.goto(base+'/number_magic/access.html?lang='+lang);
      await page.click('#open-book');await page.fill('#login-user','guardian@example.test');await page.fill('#login-password','fixture-only');await page.click('#login-submit');
      await page.waitForFunction(()=>window.NM_MEMBERSHIP?.contactReady());
      await page.waitForSelector('#nmGuardBack');await page.click('#nmGuardBack');
      await page.addLocatorHandler(page.locator('#nmUnlockOverlayClose'),el=>el.click(),{noWaitAfter:true});
      // The title screen overrides the saved course-road view; enter the road through its button.
      await page.locator('#ttRoad:visible,#nmPersonalPlan:visible,.nm-title3d [data-id=road]:visible').first().waitFor();
      if(!await page.locator('#nmPersonalPlan:visible').count())await page.locator('#ttRoad:visible,.nm-title3d [data-id=road]:visible').first().click();
      await page.waitForSelector('#nmPersonalPlan');
      const t=T[lang],tag=width+'/'+lang;
      await page.waitForFunction(re=>new RegExp(re).test((document.querySelector('#nmPersonalPlan .nm-personal-plan-body p')||{}).textContent||''),t.applied.source,{timeout:10000});
      assert(calls.some(c=>c.action==='status'&&c.authorization==='Bearer fake-owner-token'&&c.body.profileName===NAME),tag+' status checked with guardian session');
      assert.match(await page.locator('#nmPersonalPlan > summary').innerText(),t.sum,tag+' summary');
      await page.locator('#nmPersonalPlan > summary').click();
      assert.equal(await page.locator('#nmPersonalPlan').evaluate(e=>e.open),true);
      assert.equal(await page.locator('#nmPersonalPlan article').count(),12,tag+' 12 months');
      const startLine=await page.locator('#nmPersonalPlan .nm-personal-plan-body > p').nth(1).innerText();
      assert(startLine.includes(settings.startDate)&&startLine.includes(String(settings.speed))&&/2/.test(startLine),tag+' custom start/speed/cadence shown: '+startLine);
      const lay=await page.evaluate(()=>{const w=innerWidth;return{scroll:document.documentElement.scrollWidth>w+2,bad:[...document.querySelectorAll('#nmPersonalPlan, #nmPersonalPlan *, #nmStandardPlan, #nmStandardPlan *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>w+1||r.left<-1);}).map(e=>e.tagName+'.'+(e.className||''))};});
      assert(!lay.scroll&&lay.bad.length===0,tag+' overflow: '+lay.bad.join(','));
      if(process.env.NM_SCREENSHOT_DIR&&lang==='ko'){fs.mkdirSync(process.env.NM_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.NM_SCREENSHOT_DIR,'personal-plan-'+width+'.png')});}
      const st=await page.evaluate(()=>JSON.parse(localStorage.getItem(NM_LEARNER_STORAGE.keyFor(NM_ENTRY.guardianUserId))));
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1'))),{...original,lang},tag+' legacy source remains unchanged');
      assert.equal(st.adminPlan.version,settings.version);assert.equal(st.roadSpeed,settings.speed);assert.equal(st.roadAmount,settings.amount);assert.equal(st.roadCadence,settings.cadence);assert.equal(st.schoolAge.entryYear,2020);
      for(const k of ['name','progress','character','avatar','cloudOwnerId','cloudLinked','account'])assert.deepEqual(st[k],original[k],tag+' private record '+k+' preserved');
      assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('nm_guardian_session_v1')).access_token),'fake-owner-token');
      assert.deepEqual(calls.filter(c=>c.action!=='status'),[],tag+' only status calls');
      assert.deepEqual(writes,[],tag+' no profile/auth writes');
      assert(external.every(x=>x.method==='GET'||(x.url.includes('/functions/v1/nm-membership')||x.url.includes('/auth/v1/token?grant_type=password'))),tag+' unexpected external writes '+JSON.stringify(external));
      if(high){
        const result=await page.evaluate(()=>{
          const p=NM_LEARNING_PLAN.project(NM_COURSES,{courseKey:'C58',sessionIndex:1,speed:1,cadence:'w2',pace:'p2',startDate:'2026-10-23',entryYear:2020},{now:'2026-10-23'});
          const timing=NM_ROAD_TIMING({curKey:'C58',curFrac:0,smNow:90,cad:'w2',pace:'p2',speed:1});
          const fast=NM_ROAD_TIMING({curKey:'C58',curFrac:0,smNow:90,cad:'w2',pace:'p2',speed:1.5});
          return {days:(Date.parse(p.milestones.find(m=>m.key==='C69').date)-Date.parse('2026-10-23'))/86400000,weeks:timing.rows.C69.endWeeks,fast:fast.rows.C69.endWeeks};
        });
        assert.equal(result.days,84,tag+' calendar is 12 weeks');assert.equal(result.weeks,12,tag+' main roadmap is 12 weeks');assert.equal(result.fast,8,tag+' main 1.5× is 8 weeks');
        assert.equal(st.weeklyDigest.highStartDate,settings.startDate,tag+' digest uses plan anchor');assert.equal(st.weeklyDigest.highSpeed,settings.speed,tag+' digest uses plan speed');
        if(process.env.NM_EVIDENCE_DIR){fs.mkdirSync(process.env.NM_EVIDENCE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'high-road-'+width+'-'+lang+'.png')});}
      }
      if(calculus){
        const result=await page.evaluate(()=>{
          const base={courseKey:'C70',sessionIndex:1,startDate:'2026-10-24',entryYear:2020};
          const days=p=>(Date.parse(p.milestones.find(m=>m.key==='C73').date)-Date.parse(base.startDate))/86400000;
          const standard=NM_LEARNING_PLAN.standard(NM_COURSES,base,{now:base.startDate});
          const fast=NM_LEARNING_PLAN.project(NM_COURSES,{...base,speed:1.5,cadence:'w2'},{now:base.startDate});
          const manual=NM_LEARNING_PLAN.project(NM_COURSES,{...base,speed:1,cadence:'w1'},{now:base.startDate});
          const timing=NM_ROAD_TIMING({curKey:'C70',curFrac:0,smNow:90,cad:'w2',pace:'p2',speed:1});
          const timingFast=NM_ROAD_TIMING({curKey:'C70',curFrac:0,smNow:90,cad:'w2',pace:'p2',speed:1.5});
          return {standard:days(standard),fast:days(fast),manual:days(manual),weeks:timing.rows.C73.endWeeks,fastWeeks:timingFast.rows.C73.endWeeks};
        });
        assert.deepEqual(result,{standard:84,fast:56,manual:168,weeks:12,fastWeeks:8},tag+' calculus standard 12 / faster 8 / saved slow 24 weeks');
        assert.equal(st.weeklyDigest.highStartDate,settings.startDate,tag+' calculus digest uses saved plan anchor');
        assert.equal(st.weeklyDigest.highPlanVersion,'20261026-calculus3m-v2',tag+' calculus digest has versioned compact link');
        assert.equal(st.weeklyDigest.cadence,'w1',tag+' saved admin slow pace is not replaced by the standard');
        if(process.env.NM_EVIDENCE_DIR){fs.mkdirSync(process.env.NM_EVIDENCE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'calculus-road-'+width+'-'+lang+'.png')});}
        await page.evaluate(()=>{
          document.querySelectorAll('.nm-confetti').forEach(e=>e.remove());const wrapper=document.createElement('main');wrapper.className='nm-placement';const host=document.createElement('section');host.className='pd-calendar';host.id='paceFixture';wrapper.appendChild(host);document.querySelector('#screen').replaceChildren(wrapper);window.__paceApplied=[];
          NM_DIAGNOSTIC_ROADMAP.mount(host,{course:'C70',session:1,lang:document.documentElement.lang,now:'2026-10-24T03:00:00Z',selection:{age:'16',birthYear:2011,profileGrade:'h1',goal:'steady'},settings:{speed:1,cadence:'w1'},onPaceApply:value=>{window.__paceApplied.push(value);return true;}});
        });
        assert(await page.locator('#pdStandardPlan').isVisible(),tag+' calculus standard plan visible');
        assert.equal(await page.locator('#pdCustomPlan').evaluate(e=>e.open),false,tag+' calculus manual controls start collapsed');
        await page.locator('#pdCustomPlan > summary').click();assert.equal(await page.locator('[data-calendar=speed] option').count(),5,tag+' five manual speeds');
        assert.equal(await page.locator('[data-calendar=cadence]').inputValue(),'w1',tag+' saved manual cadence visible');
        await page.selectOption('[data-calendar=cadence]','w2');await page.selectOption('[data-calendar=speed]','1.5');
        assert.deepEqual(await page.evaluate(()=>window.__paceApplied),[],tag+' calculus preview needs explicit apply');
        await page.click('#pdApplyPace');assert.deepEqual(await page.evaluate(()=>window.__paceApplied),[{speed:1.5,cadence:'w2'}]);
        assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem(NM_LEARNER_STORAGE.keyFor(NM_ENTRY.guardianUserId))).progress),original.progress,tag+' calculus preview preserves actual completion');
        const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,bad:[...document.querySelectorAll('#pdStandardPlan,#pdStandardPlan *,#pdCustomPlan,#pdCustomPlan *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left<-1);}).map(el=>el.tagName+'.'+el.className)}));
        assert(!layout.overflow&&!layout.bad.length,tag+' calculus diagnostic calendar overflow '+JSON.stringify(layout));
        if(process.env.NM_EVIDENCE_DIR)await page.screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'calculus-plan-'+width+'-'+lang+'.png')});
      }
      if(middle){
        const result=await page.evaluate(()=>{
          const base={courseKey:'C29',sessionIndex:1,startDate:'2026-10-23',entryYear:2020};
          const a=NM_LEARNING_PLAN.standard(NM_COURSES,base,{now:base.startDate}),b=NM_LEARNING_PLAN.project(NM_COURSES,{...base,cadence:'w2',speed:1.25},{now:base.startDate});
          return {standard:(Date.parse(a.milestones.find(m=>m.key==='C31').date)-Date.parse(base.startDate))/86400000,accelerated:(Date.parse(b.milestones.find(m=>m.key==='C31').date)-Date.parse(base.startDate))/86400000};
        });
        assert.deepEqual(result,{standard:70,accelerated:56},tag+' standard 10 / faster 8 weeks');
        assert(await page.locator('#nmStandardPlan').isVisible(),tag+' standard plan shown first');
        await page.evaluate(()=>{
          document.querySelectorAll('.nm-confetti').forEach(e=>e.remove());const wrapper=document.createElement('main');wrapper.className='nm-placement';const host=document.createElement('section');host.className='pd-calendar';host.id='paceFixture';wrapper.appendChild(host);document.querySelector('#screen').replaceChildren(wrapper);window.__paceApplied=[];
          NM_DIAGNOSTIC_ROADMAP.mount(host,{course:'C35',session:2,lang:document.documentElement.lang,now:'2026-10-23T03:00:00Z',selection:{age:'12',birthYear:2015,profileGrade:'e5',goal:'steady'},settings:{speed:1,cadence:'w1'},onPaceApply:value=>{window.__paceApplied.push(value);return true;}});
        });
        assert(await page.locator('#pdStandardPlan').isVisible());assert.equal(await page.locator('#pdCustomPlan').evaluate(e=>e.open),false);if(process.env.NM_EVIDENCE_DIR){await page.locator('#pdStandardPlan').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'middle-standard-'+width+'-'+lang+'.png')});}
        await page.locator('#pdCustomPlan > summary').click();assert.equal(await page.locator('[data-calendar=speed] option').count(),5);
        await page.selectOption('[data-calendar=cadence]','w2');await page.selectOption('[data-calendar=speed]','1.5');
        assert.deepEqual(await page.evaluate(()=>window.__paceApplied),[],'preview requires explicit apply');
        await page.click('#pdApplyPace');assert.deepEqual(await page.evaluate(()=>window.__paceApplied),[{speed:1.5,cadence:'w2'}]);
        assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem(NM_LEARNER_STORAGE.keyFor(NM_ENTRY.guardianUserId))).progress),original.progress,'preview/apply never completes lessons');
        if(process.env.NM_EVIDENCE_DIR){fs.mkdirSync(process.env.NM_EVIDENCE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.NM_EVIDENCE_DIR,'middle-plan-'+width+'-'+lang+'.png')});}
      }
      checks++;await ctx.close();
    }
    // Short link /w/?m=<32 hex>: resolves through the mocked membership function.
    const TOKEN='0123456789abcdef0123456789abcdef';
    const shortCtx=async(handler)=>{
      const ctx=await context(390),page=await ctx.newPage(),seen=[],hops=[],external=[];
      page.on('request',r=>{if(!r.url().startsWith(base+'/'))external.push(r.url());});
      page.on('framenavigated',f=>{if(f===page.mainFrame())hops.push(f.url());});
      await ctx.route('**/functions/v1/nm-membership',async r=>{
        const req=r.request();
        if(req.method()==='OPTIONS')return r.fulfill({status:204,headers:CORS});
        const body=req.postDataJSON()||{};seen.push(body);
        return handler(r,body);
      });
      return {ctx,page,seen,hops,external};
    };
    const goodCfg={courseKey:calculus?'C70':high?'C58':middle?'C29':'C4',...(compact?{highPlanVersion:calculus?'20261024-calculus3m':middle?'20261023-middle25':'20261023-high3m',highStartDate:'2026-10-19',highSpeed:1.5}:{}),week:'2026-W43',k:2,amount:0.7,cadence:'w2',sessionIndex:2};
    {
      const {ctx,page,seen,external}=await shortCtx((r,b)=>b.action==='resolve_worksheet'&&b.token===TOKEN?r.fulfill({headers:CORS,json:{config:goodCfg,redirect:'https://evil.example/x',url:'https://evil.example/y'}}):r.fulfill({status:400,headers:CORS,json:{error:'bad'}}));
      await page.goto(base+'/w/?m='+TOKEN);
      await page.waitForURL(u=>u.pathname==='/number_magic/ws.html');
      const u=new URL(page.url());
      assert.equal(u.origin,base,'redirect stays on the same origin');
      assert.equal(u.pathname,'/number_magic/ws.html');
      assert.deepEqual(Object.fromEntries(u.searchParams),{c:goodCfg.courseKey,w:'2026-W43',k:'2',cad:'w2',amt:'0.7',s:'2',p:'1',auto:'0',...(compact?{hp:'1',highPlanVersion:goodCfg.highPlanVersion,hs:'2026-10-19',hv:'1.5'}:{})});
      assert.equal([...u.searchParams].length,compact?12:8,'version stays in the managed redirect');
      assert.deepEqual(seen,[{action:'resolve_worksheet',token:TOKEN}]);
      await page.waitForFunction(()=>window.NM_WS_READY!==undefined);
      assert.equal(await page.evaluate(()=>window.NM_WS_READY),true,'personalised worksheet renders');
      assert(external.every(x=>x.includes('/functions/v1/nm-membership')||x.startsWith('https://fonts.googleapis.com/')||x.startsWith('https://cdn.jsdelivr.net/')),'no untrusted external redirect');
      checks++;await ctx.close();
    }
    // Invalid / expired / hostile responses stop on the /w/ page with a message and never redirect.
    const stops=[
      ['expired',TOKEN,(r)=>r.fulfill({status:410,headers:CORS,json:{error:'expired',config:goodCfg}}),/만료/],
      ['unknown',TOKEN,(r)=>r.fulfill({status:404,headers:CORS,json:{error:'not_found'}}),/만료|연결/],
      ['hostile course',TOKEN,(r)=>r.fulfill({headers:CORS,json:{config:{...goodCfg,courseKey:'//evil.example/'}}}),/만료|연결/],
      ['bad amount',TOKEN,(r)=>r.fulfill({headers:CORS,json:{config:{...goodCfg,amount:0.9}}}),/만료|연결/],
      ['bad week',TOKEN,(r)=>r.fulfill({headers:CORS,json:{config:{...goodCfg,week:'2026-W99'}}}),/만료|연결/],
      ['no config',TOKEN,(r)=>r.fulfill({headers:CORS,json:{}}),/만료|연결/]
    ];
    for(const [name,token,handler,msg] of stops){
      const {ctx,page,seen,hops,external}=await shortCtx((r)=>handler(r));
      await page.goto(base+'/w/?m='+token);
      await page.waitForFunction(re=>new RegExp(re).test(document.getElementById('m').textContent),msg.source);
      await page.waitForTimeout(300);
      assert.equal(new URL(page.url()).pathname,'/w/',name+' stays on /w/');
      assert(hops.every(h=>new URL(h).pathname==='/w/'),name+' no navigation away');
      assert.equal(seen.length,1,name);assert(external.every(x=>x.includes('/functions/v1/nm-membership')),name+' no external navigation');
      checks++;await ctx.close();
    }
    // Malformed token: rejected locally, no membership request at all.
    for(const bad of ['xyz','0123456789ABCDEF0123456789ABCDEF','0123456789abcdef0123456789abcde','0123456789abcdef0123456789abcdef0','']){
      const {ctx,page,seen,hops}=await shortCtx(r=>r.fulfill({headers:CORS,json:{config:goodCfg}}));
      await page.goto(base+'/w/?m='+bad);
      await page.waitForFunction(()=>/확인해 주세요/.test(document.getElementById('m').textContent));
      await page.waitForTimeout(200);
      assert.equal(seen.length,0,'malformed token '+JSON.stringify(bad)+' sends no request');
      assert(hops.every(h=>new URL(h).pathname==='/w/'));
      checks++;await ctx.close();
    }
    // Legacy short links keep working.
    for(const [q,expected] of [['2642.C4',{w:'2026-W42',c:'C4'}],['2642.C4-2',{w:'2026-W42',c:'C4',k:'2'}]]){
      const {ctx,page,seen}=await shortCtx(r=>r.fulfill({status:500,headers:CORS,json:{}}));
      await page.goto(base+'/w/?'+q);
      await page.waitForURL(u=>u.pathname==='/number_magic/ws.html');
      const u=new URL(page.url());
      assert.equal(u.origin,base);
      assert.deepEqual(Object.fromEntries(u.searchParams),expected,q+' legacy params');
      assert.equal(seen.length,0,'legacy link makes no membership request');
      checks++;await ctx.close();
    }
    console.log('PERSONAL_PLAN_BROWSER_OK high='+high+' middle='+middle+' calculus='+calculus+' cases='+checks+' externalWrites=0');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
