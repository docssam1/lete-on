#!/usr/bin/env node
'use strict';
/* 수의 마법 앱(홈 화면 앱·APK) 검사(2026-10-28, 원장 「이제 프로그램·iOS·APK — 설치하기 어떻게 조치할지」).
 *  ① 짧은 주소 /app/ → 설치 안내(install.html)  ② 매니페스트·서비스 워커가 크롬 기준 「설치 가능」
 *  ③ 「다 받아 두기」가 offline-files.json 을 빠짐없이 받는다  ④ 서버가 꺼져도 처음 화면 → 체험하기 → 앱 첫 화면까지 열린다
 *  ⑤ 설치 안내가 기기마다 맞는 방법을 먼저 보이고(안드로이드·아이폰·컴퓨터·카카오톡 창), 숨길 칸은 숨기고, 가로로 넘치지 않는다
 *  ⑥ APK 안에서만 공부 알림 칸과 처음 화면의 「앱 설정」 단추가 보인다  ⑦ 자동 검사 브라우저에서는 ?pwa=1 없이 서비스 워커를 켜지 않는다(다른 검사를 흐리지 않게)
 * 외부 요청은 막는다. usage: node scripts/check-pwa-browser.js */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.ttf':'font/ttf','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.mp3':'audio/mpeg','.m4a':'audio/mp4'};
let down=false;
const server=http.createServer((req,res)=>{
  if(down){req.socket.destroy();return;}
  let f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
const UA={
  android:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
  iphone:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  kakaoIphone:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.8.0',
  kakaoAndroid:'Mozilla/5.0 (Linux; Android 14; SM-S921N; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36 KAKAOTALK 10.8.0',
  apk:'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36 GFIELDNumberMagic/1.0.1'};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,report={};
 const list=JSON.parse(fs.readFileSync(path.join(ROOT,'number_magic/offline-files.json'),'utf8'));
 assert.equal(list.files.length,list.count);
 for(const f of list.files)assert.ok(fs.existsSync(path.resolve(ROOT,'number_magic',f)),'목록에 없는 파일: '+f);
 const browser=await chromium.launch();
 const blockOutside=async ctx=>ctx.route(u=>!u.href.startsWith(base),r=>r.abort());
 try{
  // ⑦ ?pwa=1 없이는 켜지 않는다
  {const ctx=await browser.newContext();await blockOutside(ctx);const p=await ctx.newPage();
   await p.goto(base+'/number_magic/install.html');await p.waitForLoadState('load');await p.waitForTimeout(500);
   assert.equal(await p.evaluate(()=>navigator.serviceWorker.getRegistrations().then(r=>r.length)),0,'자동 검사 브라우저에서는 서비스 워커를 켜지 않는다');
   await ctx.close();}

  // ①~④ 안드로이드 크롬
  const ctx=await browser.newContext({viewport:{width:412,height:860},userAgent:UA.android});await blockOutside(ctx);
  const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/app/?pwa=1');await page.waitForURL(/number_magic\/install\.html/);report.redirect=true;
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:30000});
  const cdp=await ctx.newCDPSession(page);
  const inst=await cdp.send('Page.getInstallabilityErrors');assert.deepEqual(inst.installabilityErrors,[],'설치 가능');
  const man=await cdp.send('Page.getAppManifest');assert.deepEqual(man.errors,[],'매니페스트 오류 없음');
  await page.waitForFunction(()=>!document.querySelector('#dl-btn').disabled,null,{timeout:30000});
  const t0=Date.now();await page.click('#dl-btn');
  await page.waitForFunction(()=>/다 받/.test(document.querySelector('#dl-stat').textContent),null,{timeout:300000});
  const stat=await page.textContent('#dl-stat');assert.match(stat,new RegExp('다 받아 두었어요 \\('+list.count+'개\\)'),stat);
  report.download={files:list.count,mb:+(list.bytes/1048576).toFixed(1),seconds:+((Date.now()-t0)/1000).toFixed(1)};
  const cached=await page.evaluate(async files=>{const c=await caches.open('nm-files');let have=0;for(const f of files)if(await c.match(new URL(f,location.href).href))have++;return have;},list.files);
  assert.equal(cached,list.count,'목록의 파일이 전부 저장됨');

  down=true;   // 서버를 끈다 — 이제부터는 저장본만
  const off=await ctx.newPage(),failed=[];off.on('pageerror',e=>errors.push('offline: '+e.message));
  off.on('requestfailed',r=>{if(r.url().startsWith(base))failed.push(r.url().slice(base.length)+' '+(r.failure()&&r.failure().errorText)+' '+Math.round(performance.now()));});
  await off.goto(base+'/number_magic/access.html');
  assert.ok(await off.locator('#preview-link').count(),'오프라인에서 처음 화면');
  await off.evaluate(()=>document.getElementById('preview-link').click());
  await off.waitForURL(/index\.html\?enter=1/);
  await off.waitForFunction(()=>(document.querySelector('#screen')||document.body).innerText.length>40,null,{timeout:30000});
  const offText=await off.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,80));
  // 디자인 그림 부품(assets/ui/)이 있는지 보는 탐침은 원래 없는 파일이라 실패가 정상
  const unexpected=failed.filter(u=>!/\/assets\/ui\//.test(u));
  assert.deepEqual(unexpected,[],'오프라인에서 못 받은 파일');
  report.offline={entered:true,text:offText};
  down=false;
  assert.deepEqual(errors,[]);
  await ctx.close();

  // ⑤ 기기별 안내
  report.devices={};
  for(const [name,ua,vp,tab] of [['android',UA.android,[390,844],'android'],['iphone',UA.iphone,[390,844],'ios'],['kakaoIphone',UA.kakaoIphone,[390,844],'ios'],['kakaoAndroid',UA.kakaoAndroid,[390,844],'android'],['pc',null,[1280,900],'pc']]){
    const c=await browser.newContext(Object.assign({viewport:{width:vp[0],height:vp[1]}},ua?{userAgent:ua}:{}));await blockOutside(c);
    const p=await c.newPage(),errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto(base+'/number_magic/install.html');await p.waitForLoadState('load');
    const r=await p.evaluate(()=>{const vis=s=>{const e=document.querySelector(s);return!!e&&e.getClientRects().length>0;};
      return{tab:document.querySelector('[role=tab][aria-selected=true]').dataset.tab,already:vis('#already'),settings:vis('#settings'),phone:vis('#phone'),
        inapp:vis('[data-inapp]'),notSafari:vis('[data-ios-notsafari]'),external:[...document.querySelectorAll('[data-open-external]')].filter(a=>a.getClientRects().length).map(a=>a.href.split(':')[0]),
        hscroll:document.documentElement.scrollWidth>innerWidth+1};});
    assert.equal(r.tab,tab,name+' 기기 탭');assert.equal(r.already,false);assert.equal(r.settings,false,name+' 공부 알림은 APK에서만');
    assert.equal(r.phone,name==='pc',name+' QR은 컴퓨터에서만');assert.equal(r.hscroll,false,name+' 가로 넘침');
    if(name==='kakaoAndroid'){assert.equal(r.inapp,true);assert.deepEqual(r.external,['kakaotalk']);}
    if(name==='kakaoIphone'){assert.equal(r.notSafari,true);assert.deepEqual(r.external,['kakaotalk']);}
    if(name==='iphone')assert.equal(r.notSafari,false);
    if(name==='android')assert.equal(r.inapp,false);
    assert.deepEqual(errs,[]);report.devices[name]=r.tab;await c.close();
  }

  // ⑥ APK 안
  {const c=await browser.newContext({viewport:{width:390,height:844},userAgent:UA.apk});await blockOutside(c);
   await c.addInitScript(()=>{window.__calls=[];window.NMAndroid={getReminder:()=>'{"on":true,"hour":18,"minute":30}',setReminder:(h,m)=>{__calls.push(['set',h,m]);return'asked';},cancelReminder:()=>{__calls.push(['cancel']);return'ok';},print:()=>{}};});
   const p=await c.newPage();await p.goto(base+'/number_magic/install.html');await p.waitForLoadState('load');
   assert.ok(await p.locator('#already').isVisible(),'APK 안: 이미 앱');assert.ok(await p.locator('#settings').isVisible(),'APK 안: 공부 알림');
   assert.equal(await p.inputValue('#rm-time'),'18:30');assert.equal(await p.isChecked('#rm-on'),true);
   await p.fill('#rm-time','07:05');
   assert.match(await p.textContent('#rm-note'),/허용/);
   await p.evaluate(()=>dispatchEvent(new CustomEvent('nm-android',{detail:{type:'notify-permission',value:true}})));
   assert.match(await p.textContent('#rm-note'),/07:05/);
   await p.uncheck('#rm-on');
   assert.deepEqual(await p.evaluate(()=>__calls),[['set',7,5],['cancel']]);
   await p.goto(base+'/number_magic/access.html');await p.waitForSelector('#nm-pwa-settings');
   assert.match(await p.getAttribute('#nm-pwa-settings','href'),/install\.html$/);
   report.apk={reminder:true,settingsLink:true};await c.close();}
  {const c=await browser.newContext({userAgent:UA.android});await blockOutside(c);const p=await c.newPage();
   await p.goto(base+'/number_magic/access.html');await p.waitForLoadState('load');await p.waitForTimeout(300);
   assert.equal(await p.locator('#nm-pwa-settings').count(),0,'브라우저로 연 처음 화면에는 「앱 설정」 없음');await c.close();}

  console.log('PWA_OK',JSON.stringify(report));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
