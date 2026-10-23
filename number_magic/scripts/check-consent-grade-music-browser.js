'use strict';
// Full local UI + actual auth/membership clients; API fixtures only. No email, text or production record writes.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_CONSENT_ARTIFACTS||'/tmp/nm-consent-grade-music-20261023';
const VERSION='2026-10-22-v1',OWNER='consent-fixture-owner';
const server=http.createServer((req,res)=>{
 const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.m4a':'audio/mp4','.mp3':'audio/mpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
 if(f.endsWith('/app/main.js')){let s=fs.readFileSync(f,'utf8'),i=s.lastIndexOf('\n})();');return res.end(s.slice(0,i)+`\nwindow.__CONSENT_CHECK={view:v=>{guardianEntry=false;S.onboarded=true;S.view=v;render();},placement:(grade)=>{guardianEntry=false;S._diag=null;S.schoolAge={entryYear:new Date().getFullYear()-grade+1,birthYear:new Date().getFullYear()-grade-6,setAt:Date.now()};startPlacement();},music:()=>{const b=document.createElement('div');b.id='testMusic';b.className='nm-title3d';document.body.appendChild(b);window.__stopMusic=mountDeskMusic(b);},snapshot:()=>JSON.parse(JSON.stringify({coins:S.coins,progress:S.progress,schoolAge:S.schoolAge}))};`+s.slice(i));}
 fs.createReadStream(f).pipe(res);
});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required','--disable-webgl','--disable-webgl2']}),report=[];
 try{for(const [width,lang]of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
  const c=await b.newContext({viewport:{width,height:850},reducedMotion:'reduce'}),p=await c.newPage(),errors=[],calls=[];let version=null,registered=true,sms=true;
  p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));await c.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
  await c.route('**/auth/v1/token?grant_type=password',r=>r.fulfill({json:{access_token:'consent-fixture-token',refresh_token:'consent-fixture-refresh',expires_in:3600,user:{id:OWNER,email:'guardian@example.test'}}}));
  await c.route('**/functions/v1/nm-membership',r=>{const d=r.request().postDataJSON();calls.push(d);if(d.action==='register_contact'){version=d.privacyVersion;sms=d.smsConsent;registered=true;return r.fulfill({json:{ok:true}});}return r.fulfill({json:{membership:{userId:OWNER,status:'trial',canUse:true,trialEndsAt:new Date(Date.now()+86400000).toISOString(),serverNow:new Date().toISOString()},contact:{registered,smsConsent:sms,phoneMasked:'010-****-1234',privacyVersion:version,consentedAt:version?new Date().toISOString():null}}});});
  await c.addInitScript(lang=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'Consent fixture',avatar:{kind:'boy'},view:'title',coins:100,progress:{}}));window.__played=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){__played.push(this);return play.call(this);};},lang);
  await p.goto(base+'/number_magic/access.html?lang='+lang);await p.click('#open-book');await p.fill('#login-user','guardian@example.test');await p.fill('#login-password','fixture-only');await p.click('#login-submit');await p.waitForSelector('#nmGuardContactForm');
  let keep=await p.evaluate(()=>__CONSENT_CHECK.snapshot());
  assert.equal(await p.locator('#nmContactPrivacy').isChecked(),false);assert.equal(await p.locator('#nmContactGuardian').isChecked(),false);assert.equal(await p.locator('#nmContactSms').isChecked(),false,'renewal cannot preselect SMS');
  await p.click('#nmGuardContactSave');assert.equal(calls.filter(x=>x.action==='register_contact').length,0);await p.check('#nmContactPrivacy');await p.click('#nmGuardContactSave');assert.equal(calls.filter(x=>x.action==='register_contact').length,0,'guardian confirmation required');
  await p.locator('.nm-privacy-consents summary').click();assert.equal(await p.locator('.nm-privacy-document dl dt').count(),8);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:path.join(OUT,width+'-'+lang+'-notice.png'),fullPage:true});
  await p.locator('.nm-privacy-consents summary').click();
  await p.evaluate(()=>__CONSENT_CHECK.view('town'));await p.waitForSelector('#nmConsentRenew');keep=await p.evaluate(()=>__CONSENT_CHECK.snapshot());await p.click('#nmConsentRenew');await p.waitForSelector('#nmGuardContactForm');
  await p.check('#nmContactPrivacy');await p.check('#nmContactGuardian');assert.equal(await p.inputValue('#nmGuardPhone'),'');await p.click('#nmGuardContactSave');await p.waitForFunction(()=>NM_MEMBERSHIP.contactReady());
  const save=calls.find(x=>x.action==='register_contact');assert.equal(save.privacyVersion,VERSION);assert.equal(save.guardianConsent,true);assert.equal(save.smsConsent,false);assert.equal('phone' in save,false,'renewal keeps existing phone');assert.equal(await p.locator('#nmConsentBanner').count(),0);
  assert.deepEqual(await p.evaluate(()=>__CONSENT_CHECK.snapshot()),keep,'consent must not change coins/progress/grade');
  // Newly registered phone: exact same gate, optional texts off, valid digits only.
  registered=false;version=null;await p.evaluate(async()=>{await NM_MEMBERSHIP.refresh(true);__CONSENT_CHECK.view('closet');const settings=document.querySelector('.nm-closet-settings');if(settings)settings.open=true;});await p.waitForSelector('#nmGuardContactForm');
  await p.check('#nmContactPrivacy');await p.check('#nmContactGuardian');await p.fill('#nmGuardPhone','020-0000-1234');await p.click('#nmGuardContactSave');assert.equal(calls.filter(x=>x.action==='register_contact').length,1);
  await p.fill('#nmGuardPhone','010-0000-1234');await p.click('#nmGuardContactSave');await p.waitForFunction(()=>NM_MEMBERSHIP.contactReady());assert.equal(calls.filter(x=>x.action==='register_contact')[1].phone,'01000001234');
  // Actual grade prefills a new assessment. Manual advanced scope survives actual-grade correction.
  for(const grade of [3,7,10]){await p.evaluate(g=>__CONSENT_CHECK.placement(g),grade);await p.waitForSelector('#pdGrade');assert.equal(await p.inputValue('#pdGrade'),grade===3?'e3':grade===7?'m1':'h1');assert.equal(await p.inputValue('#pdStudyBand'),grade===3?'elementary':grade===7?'middle':'high');assert.equal(await p.locator('#pdStart').isEnabled(),true);}
  await p.selectOption('#pdStudyBand','high');await p.selectOption('#pdBaseline','c41');await p.selectOption('#pdGrade','e3');assert.equal(await p.inputValue('#pdBaseline'),'c41');assert.equal(await p.inputValue('#pdStudyBand'),'high');
  // Same audio as promo, real decoding/playback, on/off persisted, narration suspends music.
  await p.evaluate(()=>{__CONSENT_CHECK.view('closet');__CONSENT_CHECK.music();});await p.waitForFunction(()=>__played.some(a=>a.src.includes('promo-ambience')&&!a.paused));
  await p.waitForTimeout(700);assert(await p.evaluate(()=>{const a=__played.find(a=>a.src.includes('promo-ambience'));return a.currentTime>0&&a.volume>0;}));
  await p.click('#testMusic button');assert.equal(await p.evaluate(()=>__played.find(a=>a.src.includes('promo-ambience')).paused),true);assert.equal(await p.evaluate(()=>localStorage.getItem('nm_desk_music_v1')),'off');
  await p.click('#testMusic button');await p.waitForFunction(()=>!__played.find(a=>a.src.includes('promo-ambience')).paused);
  await p.evaluate(()=>{window.__speaking=true;window.__oldSpeaking=NM_VOICE.isSpeaking;NM_VOICE.isSpeaking=()=>__speaking;});await p.waitForFunction(()=>__played.find(a=>a.src.includes('promo-ambience')).paused);await p.evaluate(()=>window.__speaking=false);await p.waitForFunction(()=>!__played.find(a=>a.src.includes('promo-ambience')).paused);
  await p.evaluate(()=>{NM_VOICE.isSpeaking=__oldSpeaking;window.__disposedMusic=__played.find(a=>a.src.includes('promo-ambience'));__stopMusic();});await p.waitForTimeout(750);assert.equal(await p.evaluate(()=>__disposedMusic.paused),true);assert.equal(await p.locator('#testMusic button').count(),0);
  const policy=await c.newPage();await policy.goto(base+'/number_magic/privacy.html?lang='+lang);assert.equal(await policy.locator('dl dt').count(),8);assert.equal(await policy.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);report.push({width,lang,requiredConsents:true,renewalKeepsPhone:true,smsOptional:true,newPhoneValidation:true,gradePrefill:true,manualScopePreserved:true,musicPlaybackAndCleanup:true,narrationPausesMusic:true,externalWrites:0});await c.close();
 }fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(report,null,2));console.log('CONSENT_GRADE_MUSIC_OK '+JSON.stringify(report));}
 finally{await b.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
