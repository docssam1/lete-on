'use strict';
// Actual generator, local HTTP only. Never sends a message or writes a profile.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');res.end(fs.readFileSync(p));});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext();await context.route('**/*',r=>r.request().url().startsWith(base+'/')?r.continue():r.abort());const page=await context.newPage();
  await page.goto(base+'/ws.html?c=C4&w=2026-W43&auto=0&p=1&s=2&amt=0.7');await page.waitForFunction(()=>window.NM_WS_READY!==undefined);
  assert.equal(await page.evaluate(()=>window.NM_WS_READY),true);
  const count=await page.evaluate(()=>{
   let count=0;
   for(const [key,c] of Object.entries(NM_COURSES))for(let i=0;i<c.sessions.length;i++)for(const k of [1,2]){
    const e=NM_EXAM.weeklyEnvelope(c,key,'2026-W43',{startSession:i+1,sessionIdx:i,k,cad:'w2'});
    if(!e)throw Error(key+' S'+(i+1)+' no envelope');
    const expected=c.sessions[i].test?c.sessions[i].pool:c.sessions[i].drills;
    if(JSON.stringify(e.session.drills)!==JSON.stringify(expected))throw Error(key+' S'+(i+1)+' wrong session');
    if(e.cover.sessionIdx!==i)throw Error('reading session differs');count++;
   }return count;
  });
  const limits=JSON.parse(fs.readFileSync(path.join(root,'../supabase/functions/nm-membership/course-limits.json'),'utf8'));
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(NM_COURSES).map(([k,c])=>[k,c.sessions.length]))),limits);
  for(const [c,s,amt] of [['C4',8,0.7],['C4',9,1],['C0',2,1],['C29',2,1]]){
   await page.goto(base+'/ws.html?c='+c+'&w=2026-W43&auto=0&p=1&s='+s+'&amt='+amt+'&k=2');
   await page.waitForFunction(()=>window.NM_WS_READY!==undefined);
   assert.equal(await page.evaluate(()=>window.NM_WS_READY),true,c+' S'+s+': '+await page.locator('#wsBody').innerText().then(t=>t.slice(0,100)));
   const pageCount=await page.locator('.nm-w2-page').count();assert(pageCount>0);
  }
  console.log('PERSONAL_WORKSHEET_OK selections='+count+' rendered=5 courseLimitsMatch=true externalWrites=0');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
