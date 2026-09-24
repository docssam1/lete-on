#!/usr/bin/env node
'use strict';

/* Focused Chromium/A4 gate for MD11 L4/L5. No learner record is written. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1000,height:1200}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;});
    await page.goto(`http://127.0.0.1:${server.address().port}/drill.html`,{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    const results=[];
    for(const cfg of [{level:4,count:12},{level:5,count:24}])for(const seed of ['md11-a4-a','md11-a4-b','md11-a4-c']){
      const result=await page.evaluate(async input=>{
        NM_EXAM.renderPrint({thread:'MD11',level:input.level,count:input.count,seed:input.seed});
        await document.fonts.ready;await new Promise(requestAnimationFrame);
        const sheet=document.querySelector('.nm-print-sheet');
        const pages=[...sheet.querySelectorAll('.nm-w2-page')];
        const cards=[...sheet.querySelectorAll('.nm-w2-item')];
        const badCards=cards.map((card,index)=>{
          const r=card.getBoundingClientRect(),p=card.closest('.nm-w2-page').getBoundingClientRect();
          return r.top<p.top-2||r.bottom>p.bottom+2||card.scrollWidth>card.clientWidth+2||card.scrollHeight>card.clientHeight+2?index+1:null;
        }).filter(Boolean);
        const badPages=pages.map((p,index)=>p.scrollWidth>p.clientWidth+2||p.scrollHeight>p.clientHeight+2?index+1:null).filter(Boolean);
        const answerRows=sheet.querySelectorAll('.nm-ak-item').length;
        const visible=NM_EXAM.buildProblems('MD11',input.level,input.count,input.seed);
        return {level:input.level,count:input.count,cards:cards.length,answerRows,badCards,badPages,pages:pages.length,unique:new Set(visible.map(NM_EXAM.problemKey)).size};
      },{...cfg,seed});
      assert.equal(result.cards,cfg.count,JSON.stringify(result));
      assert.equal(result.answerRows,cfg.count,JSON.stringify(result));
      assert.equal(result.unique,cfg.count,JSON.stringify(result));
      assert.deepEqual(result.badCards,[],JSON.stringify(result));
      assert.deepEqual(result.badPages,[],JSON.stringify(result));
      results.push(result);
    }
    assert.deepEqual(errors,[]);
    console.log(`PASS MD11 Chromium/A4: ${results.length} sets, ${results.reduce((n,r)=>n+r.cards,0)} problems, no repeat/overflow.`);
  }finally{
    if(browser)await browser.close();
    await new Promise(r=>server.close(r));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
