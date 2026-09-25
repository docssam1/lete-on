#!/usr/bin/env node
'use strict';
// Real A4 body / desktop / narrow preview. No publishing or learner records.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  const report={sets:[],errors:[],failures:[],screens:[]};
  if(out)fs.mkdirSync(out,{recursive:true});
  try{
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    page.on('pageerror',e=>report.errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;window.print=()=>{};});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    const style=await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const [thread,level] of [['AD1',1],['DC6',3],['MD4',1],['MD10',2],['MD51',2],['MD69',2],['MD72',2],['MD82',2],['MD83',5]]){
      const cfg={thread,level,count:12,seed:'concept-a'};
      const r=await page.evaluate(async cfg=>{
        if(!NM_THREADS[cfg.thread])throw Error('Unknown thread '+cfg.thread);
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;
        await Promise.all([...document.querySelectorAll('.nm-w2-brand-logo')].map(i=>i.decode()));
        await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet'),bad=[];
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-w2-head-run,.nm-w2-head-top,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-guide-item,.nm-w2-item,.nm-ak-grid')){
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page');
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(parent&&rect.bottom>parent.getBoundingClientRect().bottom+3))bad.push({cls:e.className,text:e.textContent.slice(0,100),w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        return{questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,
          scratch:s.querySelectorAll('[class*="nm-w2-scratch"]').length,
          logos:[...s.querySelectorAll('.nm-w2-brand-logo')].every(i=>i.complete&&i.naturalWidth===357),
          logoCount:s.querySelectorAll('.nm-w2-brand-logo').length,
          practice:[...s.querySelectorAll('.nm-w2-page')].map(e=>e.querySelectorAll('.nm-w2-item').length).filter(Boolean),bad};
      },cfg);
      report.sets.push({...cfg,...r});
      if(thread.startsWith('MD')&&r.practice.some(n=>n<6))r.bad.push({reason:'unbalanced twelve-question practice'});
      if(r.questions!==12||r.keys!==12||r.scratch||!r.logos||!r.logoCount||r.bad.length)report.failures.push({...cfg,...r});
      if(out){
        await page.locator('.nm-w2-page').first().screenshot({path:path.join(out,thread+'-concept.png')});
        const practice=page.locator('.nm-w2-page').filter({has:page.locator('.nm-w2-item')});
        await practice.last().screenshot({path:path.join(out,thread+'-practice.png')});
      }
    }
    await style.evaluate(e=>e.remove());
    await page.emulateMedia({media:'screen'});
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{},account:{status:'active'}})));
      await page.goto(url+'/index.html?enter=1',{waitUntil:'networkidle'});
      await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD69',level:2,seed:'editorial-preview'}],'반비례 개념과 연습',{count:10}));
      await page.waitForSelector('#nm-pe-overlay');
      await page.locator('#nm-pe-count-seg [data-n="12"]').click();
      assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),12);
      await page.locator('[data-lvl-sel="0"]').selectOption('1');
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('#nm-pe-overlay [data-nm-unique-error]').count(),0);
      assert.equal(await page.locator('#nm-pe-overlay .nm-w2-item').count(),12);
      assert.equal(await page.locator('#nm-pe-overlay [class*="nm-w2-scratch"]').count(),0);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);
      if(width===390){
        const mobile=await page.evaluate(()=>{
          const outer=document.querySelector('.nm-pe-scale-outer');
          const wrap=document.querySelector('.nm-pe-scale-wrap');
          const sheet=document.querySelector('.nm-pe-sheet');
          const close=document.querySelector('.nm-pe-close');
          const swap=document.querySelector('.nm-pe-cell-swap');
          const rect=e=>{const r=e.getBoundingClientRect();return{w:r.width,h:r.height};};
          return{zoom:Number(wrap.style.zoom),overflowX:getComputedStyle(outer).overflowX,
            scrollable:outer.scrollWidth>outer.clientWidth+20,sheet:rect(sheet),close:rect(close),swap:rect(swap)};
        });
        assert.ok(mobile.zoom>=.77,'mobile preview must preserve a readable paper scale');
        assert.equal(mobile.overflowX,'auto');
        assert.equal(mobile.scrollable,true,'paper must pan inside the preview, not shrink to unreadable text');
        assert.ok(mobile.sheet.w>580,'mobile paper became too small to read');
        assert.ok(mobile.close.h>=43,'outside-paper controls need a touch-size target');
        assert.ok(mobile.swap.w>=43&&mobile.swap.h>=43,'inside-paper controls need a touch-size target after zoom');
      }
      if(out)await page.screenshot({path:path.join(out,'preview-'+width+'.png')});
      await page.locator('#nm-pe-close').click();assert.equal(await page.locator('#nm-pe-overlay').count(),0);
      if(width===1440){
        await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD69',level:2,seed:'cover-proof'}],'반비례',{count:12}));
        await page.locator('#nm-pe-cover-chk').check();
        await page.locator('#nm-pe-close').click();
        // 표지 토글은 인쇄 설정이다. 실제 출력 경로에서 로고를 확인한다.
        await page.evaluate(()=>NM_EXAM.renderPrint({thread:'MD69',level:2,count:12,seed:'cover-proof'}));
        assert.equal(await page.locator('.nm-print-cover .nm-w2-brand-logo').count(),1);
        await page.emulateMedia({media:'print'});
        const coverStyle=await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
        if(out)await page.locator('.nm-print-cover').screenshot({path:path.join(out,'cover.png')});
        await coverStyle.evaluate(e=>e.remove());
        await page.emulateMedia({media:'screen'});
      }
      report.screens.push(width);
    }
    // A customised academy name must not silently become GFIELD.
    await page.evaluate(()=>{localStorage.setItem('nm_brand_name','다른 학원');NM_EXAM.renderPrint({thread:'MD69',level:2,count:12,seed:'brand',noTeach:true});});
    assert.equal(await page.locator('.nm-w2-brand-logo').count(),0);
    assert.equal(await page.locator('.nm-w2-head-brand').first().evaluate(e=>e.textContent.includes('다른 학원')),true);
    assert.equal(await page.locator('.nm-w2-concept,.nm-w2-guide,.nm-w2-example').count(),0);
    if(out)fs.writeFileSync(path.join(out,'editorial-results.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify(report,null,2));assert.deepEqual(report.errors,[]);assert.deepEqual(report.failures,[]);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
