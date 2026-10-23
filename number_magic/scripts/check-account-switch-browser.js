#!/usr/bin/env node
'use strict';
// Real app/auth UI, fake account owners, all remote responses mocked. No real
// learner, database, email, or SMS writes are made by this regression.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_ACCOUNT_SWITCH_ARTIFACTS;
const fixed=Date.parse('2026-10-24T04:00:00Z'),today='2026-10-24';
const accounts={
  'a@example.test':{owner:'11111111-1111-4111-8111-111111111111',name:'계정 A 합성 학습자',coins:80},
  'b@example.test':{owner:'22222222-2222-4222-8222-222222222222',name:'계정 B 합성 학습자',coins:13},
  'c@example.test':{owner:'33333333-3333-4333-8333-333333333333',name:'계정 C 신규 합성 학습자',coins:0}
};
const [A,B,C]=Object.values(accounts),key=owner=>'nm_learner_state_v1_'+encodeURIComponent(owner);
const bridge=`\nwindow.__ACCT={ready:()=>booted,key:()=>KEY,state:()=>JSON.parse(JSON.stringify(S)),
 saveUnit:id=>{S.progress[id]={done:true,steps:{stamp:true}};return save();},reward:claim=>coinAdd(78,'unit',claim),
 openAccount:()=>{guardianEntry=true;render();}};`;
const server=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(ROOT+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');
  let body=fs.readFileSync(file);if(file.endsWith('/app/main.js')){const source=body.toString(),end=source.lastIndexOf('\n})();');assert(end>0);body=source.slice(0,end)+bridge+source.slice(end);}res.end(body);
});
function state(account,unit,claim){return{
  lang:'ko',name:account.name,onboarded:true,view:'town',cloudLinked:true,cloudOwnerId:account.owner,guardianManaged:true,
  coins:account.coins,character:{number:3,color:'blue',bg:'plain',hat:'none',cape:'none'},character_unlocked:{},
  avatar:{id:account.owner,kind:'boy',look:'boy',name:account.name,outfit:'original'},account:{status:'active'},
  progress:{[unit]:{done:true,steps:{stamp:true}}},symbolDex:{[claim]:{unitId:unit,earnedAt:fixed-1000}},
  attend:{last:today,days:3,dates:[today],reward:1},coinRewards:{version:'20261024-balanced1',days:{[today]:{total:0,game:0}},claims:{['unit|'+claim]:today}},
  studyLog:{version:1,events:[{id:claim,kind:'attempt',thread:'AD3',level:1,total:10,correct:9,answered:10,exposed:false,activeSec:12,day:today,at:fixed-1000}]}
};}
const legacy={lang:'ko',name:'소유자를 모르는 과거 원본',onboarded:true,cloudLinked:true,coins:999,progress:{'N-20':{done:true}},coinRewards:{claims:{'unit|legacy-unknown':today}}};
const legacyStats={AD3:[{sessionId:'legacy-unknown',level:1,correct:1,total:10,rate:.1,ts:fixed-1000}]};
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'GET,POST,PATCH,OPTIONS'};

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),reports=[];
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],unexpected=[],patches=[];
  const tokens=new Map(Object.entries(accounts).map(([email,a])=>['fixture-'+a.owner,{...a,email}]));
  const ownerOf=request=>tokens.get((request.headers().authorization||'').replace(/^Bearer /,''));
  let releaseUser=null,userStarted=false;
  async function mocks(ctx){
    await ctx.route('**/*',route=>{
      const r=route.request();if(r.url().startsWith(base+'/')&&r.method()==='GET')return route.continue();
      if(r.method()!=='GET'&&r.method()!=='OPTIONS')unexpected.push(r.method()+' '+new URL(r.url()).pathname);
      return route.abort();
    });
    await ctx.route('**/auth/v1/**',async route=>{
      const r=route.request(),url=new URL(r.url());if(r.method()==='OPTIONS')return route.fulfill({status:204,headers:CORS});
      if(url.pathname.endsWith('/token')&&url.searchParams.get('grant_type')==='password'){
        const a=accounts[r.postDataJSON()?.email];assert(a,'only synthetic fixture accounts may sign in');
        return route.fulfill({headers:CORS,json:{access_token:'fixture-'+a.owner,refresh_token:'refresh-'+a.owner,expires_at:Math.floor(fixed/1000)+3600,user:{id:a.owner,email:r.postDataJSON().email},password_setup_pending:false}});
      }
      if(url.pathname.endsWith('/logout'))return route.fulfill({status:204,headers:CORS});
      if(url.pathname.endsWith('/user')){
        userStarted=true;await new Promise(resolve=>releaseUser=resolve);
        return route.fulfill({headers:CORS,json:{id:B.owner,email:'b@example.test'}});
      }
      unexpected.push('unexpected auth '+url.pathname);return route.fulfill({status:400,headers:CORS,json:{error:'fixture_unexpected_auth'}});
    });
    await ctx.route('**/functions/v1/nm-membership',async route=>{
      const r=route.request();if(r.method()==='OPTIONS')return route.fulfill({status:204,headers:CORS});
      const body=r.postDataJSON(),a=ownerOf(r);assert(a,'membership requires a synthetic authenticated owner');
      assert.equal(body.action,'status','no email, SMS, registration, or admin action is allowed');
      return route.fulfill({headers:CORS,json:{membership:{userId:a.owner,serverNow:new Date(fixed).toISOString(),trialStartedAt:new Date(fixed-86400000).toISOString(),trialEndsAt:new Date(fixed+29*86400000).toISOString(),status:'trial',canUse:true},settings:null,
        contact:{registered:true,privacyVersion:'2026-10-22-v1',phoneMasked:'010-****-0000',smsConsent:false}}});
    });
    await ctx.route('**/rest/v1/nm_profiles**',async route=>{
      const r=route.request();if(r.method()==='OPTIONS')return route.fulfill({status:204,headers:CORS});
      const a=ownerOf(r);assert(a,'profile route requires a synthetic authenticated owner');
      if(r.method()==='GET')return route.fulfill({headers:CORS,json:[]});
      assert.equal(r.method(),'PATCH','account switching must not create a profile');
      const body=r.postDataJSON();assert.equal(body.state.cloudOwnerId,a.owner,'a profile PATCH cannot use another account identity');
      assert(new URL(r.url()).searchParams.get('owner_id')==='eq.'+a.owner);
      patches.push({owner:a.owner,name:body.state.name});return route.fulfill({headers:CORS,json:[{name:body.state.name}]});
    });
  }
  await mocks(context);
  await context.addInitScript(({fixed,seeds,legacy,legacyStats})=>{
    const RealDate=Date;window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}};
    if(!localStorage.getItem('__accountFixtureSeeded')){
      for(const [k,v]of Object.entries(seeds))localStorage.setItem(k,JSON.stringify(v));
      localStorage.setItem('nm_state_v1',JSON.stringify(legacy));localStorage.setItem('nm_thread_stats_v1',JSON.stringify(legacyStats));
      localStorage.setItem('nm_state_slot2','{"name":"보존할 예전 슬롯"}');localStorage.setItem('__accountFixtureSeeded','1');
    }
  },{fixed,seeds:{[key(A.owner)]:state(A,'N-01','A-only'),[key(B.owner)]:state(B,'A-01','B-only')},legacy,legacyStats});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  const ready=owner=>page.waitForFunction(owner=>window.__ACCT?.ready()&&window.NM_PROFILE_AUTH?.peek()?.user.id===owner&&window.NM_STATE_KEY===('nm_learner_state_v1_'+encodeURIComponent(owner)),owner);
  const snapshot=()=>page.evaluate(()=>__ACCT.state());
  const original=()=>page.evaluate(()=>({legacy:localStorage.getItem('nm_state_v1'),stats:localStorage.getItem('nm_thread_stats_v1'),slot:localStorage.getItem('nm_state_slot2')}));
  const loginAccess=async(email,owner)=>{
    await page.goto(base+'/number_magic/access.html?lang=ko');await page.click('#open-book');await page.fill('#login-user',email);await page.fill('#login-password','fixture-password');await page.click('#login-submit');
    await ready(owner);await page.waitForFunction(()=>window.NM_MEMBERSHIP?.contactReady());
  };
  const logout=async()=>{
    await page.evaluate(()=>__ACCT.openAccount());await page.locator('#nmGuardOut').click();await page.waitForURL('**/access.html?*');
    assert.equal(await page.evaluate(()=>typeof window.__ACCT),'undefined','logout destroys the old learner document and its callbacks');
    assert.equal(await page.locator('#ttGame:visible,#townVp').count(),0,'signed-out account cannot continue the old learner');
  };
  try{
    await loginAccess('a@example.test',A.owner);const untouched=await original();let a=await snapshot();
    assert.equal(a.name,A.name);assert.equal(a.coins,A.coins);assert(a.progress['N-01']?.done);assert(!a.progress['A-01']);
    assert.equal(await page.evaluate(()=>NM_STATS.sessionsOf('AD3').length),0,'ownerless legacy statistics are not imported');
    assert.equal(await page.evaluate(()=>NM_STATS.record('AD3',1,9,10,{sessionId:'A-session'})),true);
    assert.equal(await page.evaluate(()=>__ACCT.saveUnit('N-09')),true);assert.equal(await page.evaluate(()=>__ACCT.reward('A-new-claim')),15);
    a=await snapshot();const aLearning={coins:a.coins,progress:a.progress,claims:a.coinRewards.claims,study:a.studyLog,symbols:a.symbolDex};
    await logout();await loginAccess('b@example.test',B.owner);let b=await snapshot();
    assert.equal(b.name,B.name);assert.equal(b.coins,B.coins);assert(b.progress['A-01']?.done);assert(!b.progress['N-01']&&!b.progress['N-09']);
    assert(!b.coinRewards.claims['unit|A-only']&&!b.coinRewards.claims['unit|A-new-claim']);assert(b.coinRewards.claims['unit|B-only']);
    assert.equal(b.studyLog.events[0].id,'B-only');assert(!b.symbolDex['A-only']);
    assert.equal(await page.evaluate(()=>NM_STATS.sessionsOf('AD3').length),0);assert.equal(await page.evaluate(()=>NM_STATS.record('AD3',1,3,10,{sessionId:'B-session'})),true);
    assert.equal(await page.evaluate(()=>__ACCT.saveUnit('A-02')),true);const bSaved=await snapshot();
    reports.push({case:'A-logout-B-new-document',stateKeysSeparated:true,progressCoinsClaimsStatisticsMixed:0,oldLearnerBlockedAfterLogout:true});
    await logout();await loginAccess('a@example.test',A.owner);a=await snapshot();
    assert.deepEqual({coins:a.coins,progress:a.progress,claims:a.coinRewards.claims,study:a.studyLog,symbols:a.symbolDex},aLearning);
    const aStats=await page.evaluate(()=>NM_STATS.sessionsOf('AD3'));assert.equal(aStats.length,1);assert.equal(aStats[0].sessionId,'A-session');
    assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).progress,key(B.owner)),bSaved.progress);
    assert(!a.progress['A-02']);reports.push({case:'A-relogin',progressWalletClaimsAndStudyRestored:true,ownStatisticsRestored:true,BPreserved:true});
    // If identity changes in an already-open learning document, callbacks must
    // be discarded and the new account must receive a fresh guarded document.
    await page.evaluate(()=>window.__oldAccountDocument='A');
    const changedDocument=page.waitForEvent('framenavigated',{predicate:frame=>frame===page.mainFrame()});
    await page.evaluate(()=>NM_PROFILE_AUTH.signInWithPassword('b@example.test','fixture-password')).catch(error=>{if(!/context was destroyed|navigation/i.test(error.message))throw error;});
    await changedDocument;await ready(B.owner);await page.waitForFunction(()=>window.NM_MEMBERSHIP?.contactReady());
    assert.equal(await page.evaluate(()=>window.__oldAccountDocument),undefined);b=await snapshot();assert.deepEqual(b.progress,bSaved.progress);assert.equal(b.coins,B.coins);
    const bStats=await page.evaluate(()=>NM_STATS.sessionsOf('AD3'));assert.equal(bStats.length,1);assert.equal(bStats[0].sessionId,'B-session');
    reports.push({case:'owner-change-new-document',oldCallbacksDiscarded:true,newAccountStateRestored:true,ownStatisticsRestored:true});
    await logout();await loginAccess('c@example.test',C.owner);const c=await snapshot();
    assert.equal(c.name,'');assert.equal(c.coins,0);assert.deepEqual(c.progress,{});assert(!c.coinRewards);assert(!c.studyLog);
    assert.equal(await page.evaluate(()=>NM_STATS.sessionsOf('AD3').length),0);assert.deepEqual(await original(),untouched);
    reports.push({case:'new-account-unknown-legacy',unknownLegacyImported:false,oldStateStatsAndSlotsPreserved:true});

    // Pending email-link identity must not expose the last account or write its key.
    await logout();
    const before=await page.evaluate(k=>localStorage.getItem(k),key(A.owner));
    await page.evaluate(({owner,fixed})=>sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'guardian',at:fixed,userId:owner})),{owner:A.owner,fixed});
    await page.goto(base+'/number_magic/index.html?enter=1&auth=1#access_token=fixture-pending&refresh_token=fixture-pending-refresh&expires_in=3600');
    await page.waitForFunction(()=>window.__ACCT?.ready());
    await page.waitForTimeout(120);assert(userStarted,'the synthetic identity check is held pending');
    assert.equal(await page.locator('#ttGame:visible,#townVp').count(),0);assert(!((await page.locator('body').innerText()).includes(A.name)));
    assert.equal(await page.evaluate(k=>localStorage.getItem(k),key(A.owner)),before);
    const blocked=await page.evaluate(()=>({reward:__ACCT.reward('unauthenticated-claim'),stats:NM_STATS.record('AD3',1,10,10,{sessionId:'unauthenticated'})}));
    assert.equal(blocked.reward,0);assert.equal(blocked.stats,false);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key(A.owner)),before);
    releaseUser();await page.waitForTimeout(120);assert.equal(await page.locator('#ttGame:visible,#townVp').count(),0);
    reports.push({case:'unconfirmed-identity',oldAccountLearningVisible:false,oldAccountWrites:0,rewardBlocked:true,statisticsBlocked:true});

    const migration=fs.readFileSync(path.join(ROOT,'supabase/migrations/20261021030330_nm_membership_admin_personal_learning.sql'),'utf8');
    const contacts=migration.slice(migration.indexOf('create table if not exists nm_private.guardian_contacts ('),migration.indexOf('-- One student profile per account/email.'));
    assert(/owner_id\s+uuid primary key/.test(contacts));assert(/phone\s+text not null check/.test(contacts));assert(!/unique\s*\(\s*phone\s*\)/i.test(contacts));
    assert(/on public\.nm_profiles \(owner_id\) where owner_id is not null/.test(migration));
    reports.push({case:'same-phone-source-contract',separateAccountOwnerPrimaryKeys:true,phoneGloballyUnique:false,actualRegistrationNotPerformed:true});
    assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
    if(OUT){fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'account-switch.json'),JSON.stringify({reports,errors,unexpected,profilePatchesMocked:patches.length,realWrites:0},null,2));}
    console.log('ACCOUNT_SWITCH_OK '+JSON.stringify({reports,errors,unexpected,profilePatchesMocked:patches.length,realDatabaseWrites:0,emailSent:0,smsSent:0}));
  }finally{if(releaseUser)releaseUser();await context.close();await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
