#!/usr/bin/env node
'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  const errors=[];
  try{
    for(const html of ['index.html','drill.html','ws.html']){
      const source=fs.readFileSync(path.join(root,html),'utf8');
      for(const script of ['mid11.js','mid12.js','mid13.js']){
        const hits=(source.match(new RegExp('engine/threads/'+script.replace('.', '\\.'),'g'))||[]).length;
        assert.equal(hits,1,html+': '+script+' must be loaded exactly once');
      }
    }
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;});
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url+'/drill.html',{waitUntil:'networkidle'});
    const integrated=await page.evaluate(()=>({
      generators:[typeof NM_TGEN.md88_countingCases,typeof NM_TGEN.md85_dispersion,typeof NM_TGEN.md84_center],
      threads:[!!NM_THREADS.MD88,!!NM_THREADS.MD85,!!NM_THREADS.MD84],
      scripts:['mid11.js','mid12.js','mid13.js'].map(name=>[...document.scripts].filter(s=>s.src.endsWith('/engine/threads/'+name)).length)
    }));
    assert.deepEqual(integrated.generators,['function','function','function'],'mid11/mid12/mid13 generator runtime load');
    assert.deepEqual(integrated.threads,[true,true,true],'MD88/MD85/MD84 thread runtime load');
    assert.deepEqual(integrated.scripts,[1,1,1],'mid11/mid12/mid13 duplicate runtime load');
    console.log('PASS integrated load: mid11=MD88, mid12=MD85, mid13=MD84; index/drill/ws exactly once');
    await page.emulateMedia({media:'print'});
    for(let level=1;level<=6;level++){
      const count=level<=3?12:24;
      const result=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg);await document.fonts.ready;await new Promise(requestAnimationFrame);
        const s=document.querySelector('.nm-print-sheet'),bad=[];
        for(const e of s.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')){
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page');
          if(e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(parent&&rect.bottom>parent.getBoundingClientRect().bottom+3))bad.push({cls:e.className,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight});
        }
        const pageCounts=[...s.querySelectorAll('.nm-w2-page')].map(p=>p.querySelectorAll('.nm-w2-item').length).filter(Boolean);
        return{concept:s.querySelectorAll('[data-middle-concept]').length,example:s.querySelectorAll('.nm-w2-example').length,guides:s.querySelectorAll('.nm-w2-guide-item').length,questions:s.querySelectorAll('.nm-w2-item').length,keys:s.querySelectorAll('.nm-ak-item').length,katex:s.querySelectorAll('.katex-error').length,bad,pageCounts};
      },{thread:'MD84',level,count,seed:'md84-browser-'+level});
      assert.equal(result.concept,1,'L'+level+' concept');
      assert.equal(result.example,1,'L'+level+' example');
      assert.equal(result.guides,3,'L'+level+' guides');
      assert.equal(result.questions,count,'L'+level+' questions');
      assert.equal(result.keys,count,'L'+level+' keys');
      assert.equal(result.katex,0,'L'+level+' KaTeX');
      assert.deepEqual(result.bad,[],'L'+level+' A4 overflow '+JSON.stringify(result.bad));
      assert(result.pageCounts.slice(0,-1).every(n=>n>=6),'L'+level+' fewer than six on a non-final practice page: '+result.pageCounts);
      console.log('PASS A4 MD84 L'+level+': '+count+' questions; pages '+result.pageCounts.join('/'));
    }
    await page.emulateMedia({media:'screen'});
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD84',level:6,count:24,seed:'md84-390'}],'중1 대표값',{pacing:true}));
    await page.waitForSelector('#nm-pe-overlay [data-middle-concept]');
    const mobile=await page.evaluate(()=>{
      const overlay=document.querySelector('#nm-pe-overlay'),sheet=overlay.querySelector('.nm-pe-sheet');
      return{questions:overlay.querySelectorAll('.nm-w2-item').length,katex:overlay.querySelectorAll('.katex-error').length,docOverflow:document.documentElement.scrollWidth>innerWidth+2,overlayOverflow:overlay.scrollWidth>overlay.clientWidth+2,sheetWidth:sheet.getBoundingClientRect().width,viewport:innerWidth};
    });
    assert.equal(mobile.questions,24);assert.equal(mobile.katex,0);assert.equal(mobile.docOverflow,false);assert.equal(mobile.overlayOverflow,false);
    console.log('PASS 390px preview: '+JSON.stringify(mobile));
    assert.deepEqual(errors,[]);
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
