#!/usr/bin/env node
'use strict';

/* Real Chromium gate for MD88: 12/24 count, concept flow, A4 and 390 px. */
const assert=require('assert/strict');
const fs=require('fs'),http=require('http'),path=require('path');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..');
const out=process.env.NM_MD88_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[path.extname(file)]||'application/octet-stream';
  res.setHeader('Content-Type',mime);fs.createReadStream(file).pipe(res);
});

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{}}));});
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/drill.html',{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const cfg of [{level:1,count:12},{level:2,count:24},{level:3,count:24},{level:4,count:24},{level:5,count:24}]){
      const stats=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint({thread:'MD88',level:cfg.level,count:cfg.count,seed:'md88-a4-'+cfg.level});
        await document.fonts.ready;await new Promise(requestAnimationFrame);
        const sheet=document.querySelector('.nm-print-sheet');
        const bad=[...sheet.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')].filter(el=>{
          const r=el.getBoundingClientRect(),parent=el.closest('.nm-w2-page');
          return el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3||(parent&&r.bottom>parent.getBoundingClientRect().bottom+3);
        }).map(el=>el.className);
        return {concept:sheet.querySelectorAll('[data-middle-concept="MD88"]').length,example:sheet.querySelectorAll('.nm-w2-example').length,guides:sheet.querySelectorAll('.nm-w2-guide-item').length,guideKeys:sheet.querySelectorAll('.nm-ak-guide-item').length,questions:sheet.querySelectorAll('.nm-w2-item').length,keys:sheet.querySelectorAll('.nm-ak-item').length,katexErrors:sheet.querySelectorAll('.katex-error').length,practicePages:[...sheet.querySelectorAll('.nm-w2-page')].map(el=>el.querySelectorAll('.nm-w2-item').length).filter(Boolean),bad};
      },cfg);
      assert.equal(stats.concept,1,'MD88 L'+cfg.level+': concept panel');
      assert.equal(stats.example,1,'MD88 L'+cfg.level+': worked example');
      assert.equal(stats.guides,3,'MD88 L'+cfg.level+': guided problems');
      assert.equal(stats.guideKeys,3,'MD88 L'+cfg.level+': guided answers');
      assert.equal(stats.questions,cfg.count,'MD88 L'+cfg.level+': practice count');
      assert.equal(stats.keys,cfg.count,'MD88 L'+cfg.level+': answer count');
      assert.equal(stats.katexErrors,0,'MD88 L'+cfg.level+': KaTeX errors');
      assert.deepEqual(stats.bad,[],'MD88 L'+cfg.level+': A4 overflow');
      assert(stats.practicePages.slice(0,-1).every(n=>n>=6),'MD88 L'+cfg.level+': fewer than six questions before final practice page');
      console.log(`PASS MD88 L${cfg.level} A4: ${cfg.count} questions, ${stats.practicePages.join('+')} per practice pages.`);
      if(out&&cfg.level===5)await page.locator('.nm-w2-page').first().screenshot({path:path.join(out,'MD88-L5-a4-first-page.png')});
    }

    await page.emulateMedia({media:'screen'});
    await page.setViewportSize({width:390,height:900});
    await page.goto(base+'/index.html?enter=1',{waitUntil:'networkidle'});
    const registered=await page.evaluate(()=>({unit:!!NM_UNITS['M-88'],thread:!!NM_THREADS.MD88,roadmap:NM_ROADMAP.chapters.some(c=>c.id==='W9-5'&&(c.units||[]).includes('M-88'))}));
    assert.deepEqual(registered,{unit:true,thread:true,roadmap:true},'MD88 registry connection');
    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD88',level:5,count:24,seed:'md88-mobile'}],'경우의 수 검수',{count:24}));
    await page.waitForSelector('#nm-pe-overlay [data-middle-concept="MD88"]');
    assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),24);
    assert.equal(await page.locator('#nm-pe-overlay .katex-error').count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'390 px horizontal overflow');
    assert.deepEqual(errors,[],'browser page errors');
    if(out)await page.screenshot({path:path.join(out,'MD88-L5-preview-390.png')});
    console.log('PASS MD88 mobile preview: 390 px, 24 questions, unit/thread/roadmap connected, no horizontal overflow.');
  }finally{
    if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
