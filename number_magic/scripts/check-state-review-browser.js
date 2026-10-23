#!/usr/bin/env node
'use strict';
// Actual app, shared browser storage, synthetic learners; all remote traffic blocked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_STATE_REVIEW_ARTIFACTS||'/tmp/nm-state-review';
const bridge=`\nwindow.__SR={ready:()=>booted,state:()=>JSON.parse(JSON.stringify(S)),saveUnit:id=>{S.progress[id]={done:true,steps:{stamp:true}};return save();},slot:switchToSlot,reward:key=>coinAdd(78,'unit',key)};`;
const server=http.createServer((req,res)=>{
 const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(ROOT+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');
 let body=fs.readFileSync(file);if(file.endsWith('/app/main.js')){const s=body.toString(),i=s.lastIndexOf('\n})();');body=s.slice(0,i)+bridge+s.slice(i);}res.end(body);
});
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],externalWrites=[],reports=[];
 const fixture=name=>({lang:'ko',onboarded:true,name,coins:400,character:{number:3,color:'blue'},avatar:{kind:'boy',name},progress:{},symbolDex:{},account:{status:'active'},attend:{last:new Date(Date.now()+9*3600000).toISOString().slice(0,10),days:1,dates:[new Date(Date.now()+9*3600000).toISOString().slice(0,10)]}});
 await ctx.route('**/*',r=>{const q=r.request();if(q.url().startsWith(base+'/')&&q.method()==='GET')return r.continue();if(q.method()!=='GET')externalWrites.push(q.url());return r.abort();});
 await ctx.route('**/app/entry.js?*',r=>r.fulfill({contentType:'text/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
 await ctx.addInitScript(first=>{
  if(!localStorage.getItem('__stateReviewSeeded')){localStorage.setItem('nm_state_v1',JSON.stringify(first));localStorage.setItem('nm_active_slot','1');localStorage.setItem('__stateReviewSeeded','1');}
  const write=Storage.prototype.setItem;Storage.prototype.setItem=function(key,val){if(window.__failStateWrite&&key==='nm_state_v1')throw new DOMException('fixture quota','QuotaExceededError');return write.call(this,key,val);};
 },fixture('Synthetic A'));
 const ready=p=>p.waitForFunction(()=>window.__SR?.ready());
 const page=async()=>{const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/number_magic/index.html?enter=1');await ready(p);return p;};
 const reloadAfter=async(p,fn,arg)=>{const nav=p.waitForEvent('framenavigated',{predicate:f=>f===p.mainFrame()});await p.evaluate(fn,arg).catch(e=>{if(!/context was destroyed|navigation/i.test(e.message))throw e;});await nav;await ready(p);};
 const disk=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_v1')));
 try{
  const a=await page(),b=await page();
  assert.equal(await a.evaluate(()=>__SR.saveUnit('N-01')),true);
  await reloadAfter(b,()=>__SR.saveUnit('N-09'));
  let stored=await disk(b);assert(stored.progress['N-01']?.done);assert(!stored.progress['N-09']);reports.push({case:'stale-tab-progress-only-conflict',latestUnitRetained:true,staleUnitRejected:true,reloaded:true});
  // B shares A's wallet but its saved profile is an entirely different sibling.
  const sibling=fixture('Synthetic B');sibling.progress['N-02']={done:true,steps:{stamp:true}};
  await b.evaluate(s=>localStorage.setItem('nm_state_slot2',JSON.stringify(s)),sibling);
  await reloadAfter(b,()=>__SR.slot(2));
  await reloadAfter(a,()=>__SR.saveUnit('N-10'));
  stored=await disk(a);assert.equal(stored.name,'Synthetic B');assert(stored.progress['N-02']?.done);assert(!stored.progress['N-10']);assert.equal(await a.evaluate(()=>localStorage.getItem('nm_active_slot')),'2');reports.push({case:'old-sibling-tab-save',currentSiblingPreserved:true,staleUnitRejected:true});
  assert.equal(await a.evaluate(()=>__SR.saveUnit('N-04')),true);
  await reloadAfter(a,()=>__SR.slot(1));stored=await disk(a);assert.equal(stored.name,'Synthetic A');assert(stored.progress['N-01']?.done);assert(!stored.progress['N-04']);
  assert(await a.evaluate(()=>JSON.parse(localStorage.getItem('nm_state_slot2')).progress['N-04'].done));reports.push({case:'normal-slot-roundtrip',learnersSeparated:true,latestProgressPreserved:true});
  const before=await a.evaluate(()=>__SR.state());await a.evaluate(()=>window.__failStateWrite=true);
  assert.equal(await a.evaluate(()=>__SR.reward('storage-retry-fixture')),0);assert.equal((await a.evaluate(()=>__SR.state())).coins,before.coins);
  await a.evaluate(()=>window.__failStateWrite=false);assert.equal(await a.evaluate(()=>__SR.reward('storage-retry-fixture')),15);assert.equal((await disk(a)).coins,before.coins+15);reports.push({case:'quota-recovery',phantomReward:0,retryAward:15});
  assert.deepEqual(errors,[]);assert.deepEqual(externalWrites,[]);
  fs.writeFileSync(path.join(OUT,'browser-state-review.json'),JSON.stringify({reports,errors,externalWrites},null,2));console.log('STATE_BROWSER_REVIEW '+JSON.stringify({reports,errors,externalWrites}));
 }finally{await ctx.close();await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
