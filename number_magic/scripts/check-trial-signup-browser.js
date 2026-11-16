'use strict';
// 무료 체험 → 가입 갈래 검사(원장 2026-11-16 「과정 저장·문자는 가입」 → 「꼬이지 않도록 · 가입이 장벽일 수도」).
// A 같은 창에서 가입 → 옮김(두 번째 빈 계정엔 안 옮김) · B 메일 링크를 다른 창에서 → 옮김 + 체험 창 알림
// C 12시간 지난 표시 → 안 옮김 · D 이 기기에 기록 있는 계정 → 안 섞음 · E 대문 보호자 로그인 → 안 옮김
// F 가입 도중 멈춤 → 「나중에 마저 하고 학습 계속」·「가입 마치기」, 체험 범위 그대로 · G 새 방문 → 지난 표시 지움
// 로컬 서버 + 가짜 인증·회원 응답만 쓴다(외부 쓰기·메일·문자 없음). 화면 사진: NM_TRIAL_ARTIFACTS=<절대 경로>
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_TRIAL_ARTIFACTS;
if(out)fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}const ext=path.extname(f);res.setHeader('Content-Type',({'.js':'application/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml'})[ext]||'application/octet-stream');res.end(fs.readFileSync(f));});
const R={};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/number_magic/';
const browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']});
async function newCtx(lang,w=390,h=844,contactRegistered=false){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
  await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1')?r.continue():r.abort());
  await ctx.route('**/auth/v1/token?grant_type=password',r=>{const d=r.request().postDataJSON();return r.fulfill({json:{access_token:'fx-token',refresh_token:'fx-refresh',expires_in:3600,user:{id:'fx-owner',email:d.email}}});});
  await ctx.route('**/functions/v1/nm-membership',r=>r.fulfill({json:{membership:{userId:'fx-owner',status:'trial',canUse:true,trialEndsAt:new Date(Date.now()+86400000).toISOString(),serverNow:new Date().toISOString()},contact:contactRegistered?{registered:true,privacyVersion:'2026-10-22-v1',smsConsent:false,phoneMasked:'010-****-1234'}:{registered:false}}}));
  return ctx;
}
async function enterTrial(p,lang,state){
  await p.goto(base+'access.html?lang='+lang);
  if(state)await p.evaluate(s=>localStorage.setItem('nm_preview_state_v1',JSON.stringify(s)),state);
  await p.evaluate(()=>sessionStorage.setItem('nm_preview_visit_v1','1')); // 같은 방문으로(기록 유지)
  await p.click('#open-book');await p.click('#preview-link');await p.waitForURL(/index\.html/);
  await p.waitForSelector('.t3d-btn,#ttContinue,.nm-title-btn,#obAvNext',{timeout:20000});
}
const asOwner=async(p,owner,lang)=>{if(p.url()==='about:blank')await p.goto(base+'access.html');await p.evaluate(o=>sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'guardian',at:Date.now(),userId:o})),owner);await p.goto(base+'index.html?enter=1&lang='+lang);await p.waitForTimeout(500);};
const acct=(p,o)=>p.evaluate(o=>JSON.parse(localStorage.getItem('nm_learner_state_v1_'+o)||'null'),o);
const trialState=(lang,name)=>({lang,onboarded:true,name,avatar:{kind:'boy'},coins:300,progress:{'N-01':{done:true}},view:'town',account:{status:'active'},cloudLinked:false});
try{
 for(const lang of ['ko','en','zh']){
  const errors=[];
  // A. 같은 창: 「가입하면 저장」 → 가입 → 옮김, 체험 원본은 그대로
  {const ctx=await newCtx(lang),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
   await enterTrial(p,lang,trialState(lang,'Same'));
   await p.locator('.t3d-btn,#ttContinue,.nm-title-btn').first().click().catch(()=>{});await p.waitForSelector('#previewSignupBtn');
   await p.click('#previewSignupBtn');await p.waitForSelector('.nm-trial-save');
   assert.ok(await p.evaluate(()=>localStorage.getItem('nm_preview_carry_v1')),'A flag set');
   await asOwner(p,'own-a',lang);const a=await acct(p,'own-a');
   assert.equal(a&&a.name,'Same','A carried');assert.ok(!('account' in a)&&!('cloudLinked' in a),'A ownership stripped');
   assert.ok(await p.evaluate(()=>localStorage.getItem('nm_preview_state_v1')),'A trial copy kept');
   assert.equal(await p.evaluate(()=>localStorage.getItem('nm_preview_carry_v1')),null,'A flag consumed');
   // 두 번째 빈 계정 → 안 옮김
   await asOwner(p,'own-a2',lang);assert.equal(await acct(p,'own-a2'),null,'A second empty account untouched');
   await ctx.close();}
  // B. 다른 창(메일 링크 흉내): 체험 창은 열린 채, 새 창에서 가입 → 옮김 + 체험 창에 알림
  {const ctx=await newCtx(lang),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
   await enterTrial(p,lang,trialState(lang,'Other'));
   await p.locator('.t3d-btn,#ttContinue,.nm-title-btn').first().click().catch(()=>{});await p.waitForSelector('#previewSignupBtn');
   await p.click('#previewSignupBtn');await p.waitForSelector('.nm-trial-save');await p.click('#nmGuardBack');await p.waitForSelector('#previewSignupBtn');
   const q=await ctx.newPage();q.on('pageerror',e=>errors.push(e.message));await asOwner(q,'own-b',lang);
   assert.equal((await acct(q,'own-b'))?.name,'Other','B carried from another window');
   await p.waitForSelector('#nmCarriedElsewhere',{timeout:5000});R['B-notice-'+lang]=await p.textContent('#nmCarriedElsewhere p');
   if(out&&lang==='ko')await p.screenshot({path:path.join(out,'B-other-window-notice.png')});
   assert.ok(await p.evaluate(()=>!!document.querySelector('#previewSignupBtn')),'B trial window still works');
   await ctx.close();}
  // C. 12시간 지난 표시 → 안 옮김
  {const ctx=await newCtx(lang),p=await ctx.newPage();
   await enterTrial(p,lang,trialState(lang,'Old'));
   await p.evaluate(()=>localStorage.setItem('nm_preview_carry_v1',String(Date.now()-13*3600000)));
   await asOwner(p,'own-c',lang);assert.equal(await acct(p,'own-c'),null,'C stale flag ignored');await ctx.close();}
  // D. 이 기기에 기록 있는 계정 → 안 섞음
  {const ctx=await newCtx(lang),p=await ctx.newPage();
   await p.goto(base+'access.html');await p.evaluate(()=>localStorage.setItem('nm_learner_state_v1_own-d',JSON.stringify({lang:'ko',onboarded:true,name:'Member',coins:9,progress:{}})));
   await enterTrial(p,lang,trialState(lang,'Trial'));
   await p.locator('.t3d-btn,#ttContinue,.nm-title-btn').first().click().catch(()=>{});await p.waitForSelector('#previewSignupBtn');await p.click('#previewSignupBtn');
   await asOwner(p,'own-d',lang);assert.equal((await acct(p,'own-d'))?.name,'Member','D existing record untouched');await ctx.close();}
  // E. 대문 「보호자 로그인」(체험 안에서 가입을 누르지 않음) → 안 옮김
  {const ctx=await newCtx(lang),p=await ctx.newPage();
   await enterTrial(p,lang,trialState(lang,'Front'));
   await asOwner(p,'own-e',lang);assert.equal(await acct(p,'own-e'),null,'E front-door login does not carry');await ctx.close();}
  // F. 체험 안 옷장/가입 화면에서 로그인했지만 휴대폰 등록이 남음 → 학습 계속 가능 + 「가입 마저 하기」
  {const ctx=await newCtx(lang),p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
   await enterTrial(p,lang,trialState(lang,'Half'));
   await p.locator('.t3d-btn,#ttContinue,.nm-title-btn').first().click().catch(()=>{});await p.waitForSelector('#previewSignupBtn');
   await p.click('#previewSignupBtn');await p.waitForSelector('#nmGuardLoginForm');
   await p.fill('#nmGuardEmail','parent@example.test');await p.fill('#nmGuardLoginPassword','Fixture-pass-1');
   await Promise.all([p.waitForURL(/index\.html\?enter=1/),p.click('#nmGuardLogin')]);
   await p.waitForFunction(()=>window.NM_PROFILE_AUTH?.peek()&&document.getElementById('nmGuardBack'));
   await p.waitForFunction(()=>/나중에|later|稍后/i.test(document.getElementById('nmGuardBack').textContent),null,{timeout:8000});
   R['F-back-'+lang]=await p.textContent('#nmGuardBack');
   assert.equal((await acct(p,'fx-owner'))?.name,'Half','F carried at login');
   if(out&&lang==='ko')await p.screenshot({path:path.join(out,'F-unfinished-guardian.png')});
   await p.click('#nmGuardBack');await p.waitForSelector('.t3d-btn,#ttContinue,.nm-title-btn');
   await p.locator('.t3d-btn,#ttContinue,.nm-title-btn').first().click().catch(()=>{});
   await p.waitForSelector('#previewSignupBtn');R['F-pill-'+lang]=await p.textContent('#previewSignupBtn .nm-pp-short');R['F-top-'+lang]=await p.evaluate(()=>{const els=[...document.querySelectorAll('.nm-top-right > *')].map(e=>e.getBoundingClientRect());return{rows:new Set(els.map(r=>Math.round(r.top))).size,maxH:Math.max(...els.map(r=>r.height)),sw:document.documentElement.scrollWidth};});
   assert.equal(await p.evaluate(()=>NM_GATE.accountActive()),false,'F still trial range');
   if(out&&lang==='ko')await p.screenshot({path:path.join(out,'F-keep-learning.png')});
   await p.click('#previewSignupBtn');await p.waitForSelector('#nmGuardBack');R['F-again-'+lang]=await p.textContent('#nmGuardBack');
   await ctx.close();}
  // G. 새 방문(「무료 체험하기」를 새로 누름) → 지난 방문의 가입 표시·체험 기록은 넘기지 않음
  {const ctx=await newCtx(lang),p=await ctx.newPage();
   await p.goto(base+'access.html?lang='+lang);
   await p.evaluate(s=>{localStorage.setItem('nm_preview_carry_v1',String(Date.now()));localStorage.setItem('nm_preview_state_v1',JSON.stringify(s));},trialState(lang,'Yesterday'));
   await p.click('#open-book');await p.click('#preview-link');await p.waitForURL(/index\.html/);await p.waitForSelector('#obAvNext',{timeout:20000});
   assert.equal(await p.evaluate(()=>localStorage.getItem('nm_preview_carry_v1')),null,'G old flag cleared');
   await asOwner(p,'own-g',lang);assert.equal(await acct(p,'own-g'),null,'G nothing carried');await ctx.close();}
  R['errors-'+lang]=errors;assert.deepEqual(errors,[],'page errors');
 }
 console.log('TRIAL_SIGNUP_BROWSER_OK cases=7 langs=3 externalWrites=0');
}catch(e){console.log(JSON.stringify(R,null,1));console.error('FAIL',e);process.exitCode=1}finally{await browser.close();server.close();}})();
