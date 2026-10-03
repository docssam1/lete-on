#!/usr/bin/env node
'use strict';
/* 3D 타이틀·마을이 늦게 준비돼도 옛 2D 화면이 먼저 번쩍이지 않는지 확인한다.
   모듈 응답을 일부러 늦춘 성공 경로와, WebGL 대체 화면으로 돌아가는 실패 경로를 모두 고정한다. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=process.env.NM_FLASH_ARTIFACTS&&path.resolve(process.env.NM_FLASH_ARTIFACTS);
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const TITLE_OK=`
  export const DEFAULT_CHOICES=[{id:'game',title:{ko:'게임 모드',en:'Game Mode',zh:'游戏模式'},sub:{ko:'',en:'',zh:''}}];
  export async function mountTitle3D(container,opts){
    const b=document.createElement('button'); b.className='t3d-btn'; b.textContent='게임 모드'; b.onclick=()=>opts.onPick('game'); container.appendChild(b);
    return {dispose(){}};
  }`;
const TOWN_OK=`
  export async function mountTown3D(container){
    window.__townMounts=(window.__townMounts||0)+1;
    const c=document.createElement('canvas'); c.className='t3d-canvas'; container.appendChild(c);
    return {ready:new Promise(r=>{window.__releaseTownReady=()=>r(true);}),dispose(){},zoomIn(){},zoomOut(){},focusPlayer(){}};
  }`;
const TITLE_FAIL=`export const DEFAULT_CHOICES=[]; export async function mountTitle3D(){return null;}`;
const TOWN_FAIL=`export async function mountTown3D(){return null;}`;

function state(){return {lang:'ko',onboarded:true,name:'깜빡임 검사',view:'town',avatar:{kind:'boy'},character:{number:3,color:'gold'},cloudLinked:false,progress:{},coins:0,account:{status:'active'}};}
async function pageFor(browser,port,success){
  const ctx=await browser.newContext({viewport:{width:1280,height:800}});
  await ctx.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.pathname.endsWith('/app/title3d/title3d.js')){await wait(700);return route.fulfill({contentType:'application/javascript',body:success?TITLE_OK:TITLE_FAIL});}
    if(u.pathname.endsWith('/app/town3d/town3d.js')){await wait(700);return route.fulfill({contentType:'application/javascript',body:success?TOWN_OK:TOWN_FAIL});}
    if(u.hostname==='127.0.0.1')return route.continue();
    return route.abort();
  });
  const page=await ctx.newPage();
  await page.addInitScript(s=>localStorage.setItem('nm_state_v1',JSON.stringify(s)),state());
  await page.goto(`http://127.0.0.1:${port}/index.html?enter=1`,{waitUntil:'domcontentloaded'});
  return {ctx,page};
}

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try{
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM,headless:true,args:['--disable-3d-apis','--disable-webgl','--disable-webgl2']});
    const port=server.address().port;
    const good=await pageFor(browser,port,true);
    const p=good.page;
    await p.waitForSelector('.nm-title3d .nm-3d-loading');
    assert.equal(await p.locator('.nm-title').evaluate(e=>getComputedStyle(e).visibility),'hidden','3D 타이틀 로딩 중 옛 메뉴가 숨겨져야 한다');
    assert.equal(await p.locator('.nm-title3d .nm-3d-loading').isVisible(),true,'타이틀 준비 화면이 보여야 한다');
    if(OUT){fs.mkdirSync(OUT,{recursive:true});await p.screenshot({path:path.join(OUT,'title-loading.png')});}
    await p.waitForSelector('.nm-title3d .t3d-btn');
    assert.equal(await p.locator('.nm-title3d .nm-3d-loading').count(),0,'3D 타이틀 준비 후 로더를 치워야 한다');
    await p.locator('.nm-title3d .t3d-btn').click();
    await p.waitForSelector('#townVp.is-3d-pending .nm-3d-loading');
    assert.equal(await p.locator('#townWorld').evaluate(e=>getComputedStyle(e).visibility),'hidden','3D 마을 로딩 중 옛 지도가 숨겨져야 한다');
    assert.equal(await p.locator('#townVp .nm-3d-loading').isVisible(),true,'마을 준비 화면이 보여야 한다');
    if(OUT)await p.screenshot({path:path.join(OUT,'town-loading.png')});
    await p.waitForSelector('.t3d-canvas',{state:'attached'});
    assert.equal(await p.locator('#townVp .nm-3d-loading').isVisible(),true,'3D 생성 후에도 첫 프레임 전에는 준비 화면을 유지해야 한다');
    await p.evaluate(()=>window.__releaseTownReady());
    await p.waitForSelector('#townVp.is-3d');
    assert.equal(await p.locator('#townWorld').evaluate(e=>getComputedStyle(e).display),'none','3D 마을 준비 후 옛 지도를 계속 숨겨야 한다');
    assert.equal(await p.locator('#townVp .nm-3d-loading').count(),0,'3D 마을 준비 후 로더를 치워야 한다');
    await good.ctx.close();

    const fast=await pageFor(browser,port,true);
    await fast.page.waitForSelector('.nm-title3d .t3d-btn');
    await fast.page.locator('.nm-title3d .t3d-btn').click();
    await fast.page.locator('#townDex').click();
    await fast.page.waitForSelector('#dexBack');
    await wait(1000);
    assert.equal(await fast.page.evaluate(()=>window.__townMounts||0),0,'마을을 이미 떠났으면 늦은 모듈로 폐기된 3D 장면을 만들지 않아야 한다');
    await fast.ctx.close();

    const fallback=await pageFor(browser,port,false);
    const f=fallback.page;
    await f.waitForFunction(()=>document.querySelector('.nm-title')&&!document.querySelector('.nm-title').classList.contains('is-3d-pending'));
    assert.equal(await f.locator('.nm-title').isVisible(),true,'3D 타이틀 실패 때 옛 메뉴를 대체 화면으로 보여야 한다');
    if(OUT)await f.screenshot({path:path.join(OUT,'title-fallback.png')});
    await f.locator('#ttGame').click();
    await f.waitForFunction(()=>document.querySelector('#townVp')&&!document.querySelector('#townVp').classList.contains('is-3d-pending'));
    assert.equal(await f.locator('#townWorld').isVisible(),true,'3D 마을 실패 때 옛 지도를 대체 화면으로 보여야 한다');
    assert.equal(await f.locator('.nm-town3d').count(),0,'실패한 3D 층이 남으면 안 된다');
    await fallback.ctx.close();
    console.log('OK: 3D 로딩 중 옛 화면 비노출 + 첫 프레임 대기 + 빠른 화면 전환 + 실패 시 대체 화면 복구');
  }finally{
    if(browser)await browser.close();
    await new Promise(r=>server.close(r));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
