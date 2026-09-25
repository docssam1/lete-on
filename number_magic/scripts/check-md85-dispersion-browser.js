#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_MD85_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],results=[];
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});page.setDefaultTimeout(45000);
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'산포도 검수',avatar:{kind:'boy'},cloudLinked:false,progress:{}}));});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle',timeout:60000});await page.waitForFunction(()=>window.NM_EXAM&&window.NM_THREADS.MD85);
    /* The A4 fixture must not leak a 190 mm root width into the later 390 px
       screen preview.  Keep the sheet-width override print-scoped so the
       mobile assertion measures the production screen layout, not the test
       harness' former 718 px html/body width. */
    await page.emulateMedia({media:'print'});await page.addStyleTag({content:'@media print{html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}}'});
    for(let level=1;level<=4;level++){
      const count=level===1?12:24;
      const result=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet'),bad=[];
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')){
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page'),pr=parent&&parent.getBoundingClientRect();
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(pr&&(rect.bottom>pr.bottom+3||rect.left<pr.left-3||rect.right>pr.right+3)))bad.push({cls:e.className,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        return{concept:s.querySelectorAll('[data-middle-concept="MD85"]').length,example:s.querySelectorAll('.nm-w2-example').length,guides:s.querySelectorAll('.nm-w2-guide-item').length,questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,katex:s.querySelectorAll('.katex-error').length,pages:s.querySelectorAll('.nm-w2-page').length,pageCounts:[...s.querySelectorAll('.nm-w2-page')].map(p=>p.querySelectorAll('.nm-w2-item').length).filter(Boolean),bad};
      },{thread:'MD85',level,count,seed:'md85-browser-'+level});
      assert.equal(result.concept,1,'L'+level+' concept');assert.equal(result.example,1,'L'+level+' example');assert.equal(result.guides,3,'L'+level+' guides');
      assert.equal(result.questions,count);assert.equal(result.keys,count);assert.equal(result.katex,0);assert.deepEqual(result.bad,[],'L'+level+' overflow '+JSON.stringify(result.bad));
      assert(result.pageCounts.slice(0,-1).every(n=>n>=6),'L'+level+' fewer than six on a non-final practice page: '+result.pageCounts);results.push({level,count,...result});
      if(out&&level===4)await page.locator('.nm-w2-page').first().screenshot({path:path.join(out,'MD85-L4-a4-first-page.png')});
    }
    await page.emulateMedia({media:'screen'});
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:width===390?844:1000});
      await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD85',level:4,count:24,seed:'md85-preview'}],'중3 산포도',{pacing:true}));await page.waitForSelector('#nm-pe-overlay [data-middle-concept="MD85"]');
      const mobile=await page.evaluate(()=>{const o=document.querySelector('#nm-pe-overlay');return{questions:o.querySelectorAll('.nm-w2-item').length,katex:o.querySelectorAll('.katex-error').length,docOverflow:document.documentElement.scrollWidth>innerWidth+2,docWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overlayOverflow:o.scrollWidth>o.clientWidth+2,overlayWidth:o.scrollWidth,viewport:innerWidth,wide:[...o.querySelectorAll('*')].filter(e=>!e.closest('.katex-mathml')&&e.scrollWidth>e.clientWidth+3).slice(0,8).map(e=>({cls:e.className,w:e.clientWidth,sw:e.scrollWidth,text:(e.textContent||'').slice(0,80)})),offscreen:[...document.querySelectorAll('body *')].map(e=>{const svg=e.closest('svg'),visual=svg&&svg!==e?svg:e;return{e,r:visual.getBoundingClientRect()};}).filter(x=>x.r.right>innerWidth+2||x.r.left<-2).sort((a,b)=>b.r.right-a.r.right).slice(0,10).map(x=>({tag:x.e.tagName,cls:x.e.className,left:Math.round(x.r.left),right:Math.round(x.r.right),w:Math.round(x.r.width),text:(x.e.textContent||'').slice(0,60)}))};});
      if(out)await page.screenshot({path:path.join(out,'MD85-L4-preview-'+width+'.png')});
      assert.equal(mobile.questions,24);assert.equal(mobile.katex,0);assert.equal(mobile.docOverflow,false,JSON.stringify(mobile));assert.equal(mobile.overlayOverflow,false,JSON.stringify(mobile));results.push(mobile);
      await page.locator('#nm-pe-close').click();
    }
    assert.deepEqual(errors,[]);if(out)fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors},null,2));
    console.log(JSON.stringify({ok:true,results,errors},null,2));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
