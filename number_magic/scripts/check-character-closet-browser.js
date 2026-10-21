#!/usr/bin/env node
'use strict';
// Production UI on a local server; never sends email/SMS or changes a live profile.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_CHARACTER_ARTIFACTS;
const MIME={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',MIME[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--disable-webgl','--disable-webgl2']});const reports=[];
 if(OUT)fs.mkdirSync(OUT,{recursive:true});
 try{
  for(const [width,lang]of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
   const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
   await page.route('**/app/entry.js?*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
   await page.addInitScript(lang=>{if(!localStorage.getItem('nm_state_v1')){const d=new Date(),day=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'학생 기록',avatar:{kind:'girl'},character:{number:3,color:'blue',hat:'none',cape:'none',bg:'plain'},character_unlocked:{},coins:100,progress:{'N-01':{done:true,steps:{stamp:true}}},account:{status:'active'},attend:{last:day,days:1},coinLedger:[{amount:3,reason:'attendance',at:new Date().toISOString()}]}));}},lang);
   const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')));
   const act=a=>page.locator(`[data-nmc-act="${a}"]`),tab=t=>page.locator(`.nmc-tab[data-tab="${t}"]`),item=(t,id)=>page.locator(`[data-nmc-act="item"][data-type="${t}"][data-id="${id}"]`);
   const shot=async tag=>{if(OUT)await page.screenshot({path:path.join(OUT,`${width}-${lang}-${tag}.png`),fullPage:false});};
   const enter=async()=>{await page.goto(base+'/number_magic/index.html?enter=1');await page.locator('.nm-title3d [data-id="game"]:visible,#ttGame:visible').first().click({timeout:60000});await page.locator('#charChipBtn').click();await page.waitForSelector('#nmc-name');};
   await enter();await shot('characters');
   const original=await state();assert.equal(await page.locator('[data-nmc-act="look"]').count(),8);
   await page.fill('#nmc-name','별이 🌟');await act('savename').click();assert.equal((await state()).avatar.name,'별이 🌟');assert.match(await page.locator('#charChipBtn').innerText(),/별이/);
   await page.locator('[data-nmc-act="look"][data-id="forest-boy"]').click();await page.fill('#nmc-newname','숲 친구');await act('add').click();
   let s=await state();assert.equal(s.avatarCollection.length,2);assert.equal(s.avatar.name,'숲 친구');assert.equal(s.avatar.look,'forest-boy');assert.equal(s.coins,100);
   assert.equal(s.name,original.name);assert.deepEqual(s.progress,original.progress);assert.deepEqual(s.account,original.account);
   await tab('color').click();await item('color','gold').click();assert.equal((await state()).coins,100,'preview never charges');assert.equal((await state()).character.color,'blue');await shot('purchase-preview');
   await act('cancel').click();assert.equal((await state()).coins,100);
   await item('color','gold').click();await act('confirm').click();s=await state();assert.equal(s.coins,85,'single purchase debits exactly15');assert.equal(s.character.color,'gold');assert.equal(s.character_unlocked.color_gold,true);
   await item('color','blue').click();await act('confirm').click();await item('color','gold').click();await act('confirm').click();assert.equal((await state()).coins,85,'free/equipped selections never repeat prior debit');
   await tab('outfit').click();assert.equal(await page.locator('[data-nmc-act="item"]').count(),9);await item('outfit','royal').click();assert.equal((await state()).coins,85);await act('confirm').click();s=await state();assert.equal(s.coins,55);assert.equal(s.avatar.outfit,'royal');assert.equal(await page.locator('#charChipBtn [data-outfit="royal"]').count()>0,true);
   await tab('number').click();await item('number','99').click();assert.equal(await act('confirm').isDisabled(),true,'not enough coins');await act('cancel').click();
   await tab('me').click();await page.locator('[data-nmc-act="pick"]').first().click();s=await state();assert.equal(s.avatar.name,'별이 🌟');assert.equal(s.coins,55);assert.equal(s.avatar.kind,'girl');
   await page.fill('#nmc-name','<img src=x>');await act('savename').click();assert.equal(await page.locator('#charChipBtn img[src="x"]').count(),0,'nickname escaped');
   await page.fill('#nmc-name','별이 🌟');await act('savename').click();
   await act('points').click();assert.equal(await page.locator('.nmc-ledger li').count(),3,'earn and two purchases are visible without reload');await shot('points');
   // Storage failure must not debit or unlock; restore the real method after checking.
   await tab('hat').click();await item('hat','wizard').click();const before=await state();
   await page.evaluate(()=>{window.__realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='nm_state_v1')throw Error('quota');return window.__realSet.call(this,k,v);};});
   await act('confirm').click();assert.deepEqual(await state(),before,'failed persistence leaves disk state intact');
   await page.evaluate(()=>{Storage.prototype.setItem=window.__realSet;});await act('confirm').click();s=await state();assert.equal(s.coins,20);assert.equal(s.character.hat,'wizard');
   await page.reload();await page.locator('.nm-title3d [data-id="game"]:visible,#ttGame:visible').first().click({timeout:60000});await page.locator('#charChipBtn').click();await page.waitForSelector('#nmc-name');s=await state();assert.equal(s.avatarCollection.length,2);assert.equal(s.avatar.name,'별이 🌟');assert.equal(s.coins,20);assert.equal(s.character.color,'gold');
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,input:parseFloat(getComputedStyle(document.querySelector('#nmc-name')).fontSize),small:[...document.querySelectorAll('.nmc-btn,.nmc-tab,.nmc-char,.nmc-chip,.nmc-ptoggle')].filter(e=>e.getBoundingClientRect().height<44).map(e=>e.className)}));assert.equal(metrics.overflow,false);assert(metrics.input>=16);assert.deepEqual(metrics.small,[],'interactive targets >=44px');
   await tab('color').click();await item('color','pink').click();await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));s.coins=0;s.progress.external={done:true};localStorage.setItem('nm_state_v1',JSON.stringify(s));});await act('confirm').click();
   await page.locator('.nm-title3d [data-id="game"]:visible,#ttGame:visible').first().click({timeout:60000});
   await page.locator('#charChipBtn').click();await page.waitForSelector('#nmc-name');
   assert.equal((await state()).coins,0,'stale balance cannot overwrite another tab');assert.equal((await state()).character_unlocked.color_pink,undefined);assert.equal((await state()).progress.external.done,true,'reload and subsequent saves retain the other tab’s progress');
   await page.locator('#backCloset').click();
   assert.equal(await page.locator('[data-travel]').count(),6);
   assert.equal(await page.locator('[data-travel="_closet"]').evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom;}),true,'all six destinations fit at this viewport');
   await page.locator('.nm-town-toolbox summary').click();await page.keyboard.press('Escape');assert.equal(await page.locator('.nm-town-toolbox').getAttribute('open'),null);
   assert.deepEqual(errors,[]);reports.push({width,lang,purchaseExactlyOnce:true,storageFailureRollback:true,stalePurchaseRejected:true,namesEscaped:true,collectionPreserved:true,studentPreserved:true,metrics});await ctx.close();
  }
  if(OUT)fs.writeFileSync(path.join(OUT,'closet.json'),JSON.stringify(reports,null,2));console.log('OK: closet ko/en/zh, 390/1280px — avatars/names/persistence, preview/cancel/exact-once purchase, insufficient/stale balance, failed-storage rollback, point history,44px controls');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
