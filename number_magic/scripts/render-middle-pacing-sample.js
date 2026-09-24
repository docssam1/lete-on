#!/usr/bin/env node
'use strict';
// Local paged proof only. Never reads or publishes private textbook pages.
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
if(!out)throw Error('NM_CONCEPT_ARTIFACTS is required');
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};});
    await page.goto('http://127.0.0.1:'+server.address().port+'/drill.html',{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    const data=await page.evaluate(async()=>{
      const items=NM_EXAM.middlePacingItems(1,'M1-S13','inverse-paged-proof');
      NM_EXAM.renderPrintMulti(items,'중1-1 7주 첫 수업 · 반비례',{mixed:12,pacing:true});
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('.nm-w2-brand-logo')].map(i=>i.decode()));
      await new Promise(requestAnimationFrame);
      return {questions:items.reduce((s,x)=>s+x.count,0),studentPages:document.querySelectorAll('.nm-w2-page:not(.nm-draw-answer-page)').length,drawingKeys:document.querySelectorAll('.nm-draw-key-item').length};
    });
    const file=path.join(out,'middle1-inverse-session.pdf');
    await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const [selector,name] of [['.nm-draw-teaching','inverse-concept'],['.nm-draw-practice','inverse-student'],['.nm-draw-answer-page','inverse-teacher']])
      await page.locator(selector).screenshot({path:path.join(out,name+'.png')});
    console.log(JSON.stringify({...data,file}));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
