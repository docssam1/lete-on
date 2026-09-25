#!/usr/bin/env node
'use strict';

/* MD82 actual-render gate: A4/390 and the two visible boxes for |x|=k. */
const assert=require('assert/strict'),fs=require('fs'),http=require('http'),path=require('path');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function renderUntilBoth(page,seedPrefix){
  for(let i=0;i<40;i++){
    const seed=seedPrefix+'-'+i;
    const result=await page.evaluate(async seed=>{
      NM_EXAM.renderPrint({thread:'MD82',level:3,count:12,seed});
      await document.fonts.ready;await new Promise(requestAnimationFrame);
      const items=[...document.querySelectorAll('.nm-print-sheet .nm-w2-item')];
      const both=items.find(el=>el.textContent.includes('두 수'));
      if(!both)return null;
      const tex=both.querySelector('[data-tex]')?.getAttribute('data-tex')||'';
      return {seed,tex,boxed:(tex.match(/\\boxed/g)||[]).length,domBoxes:both.querySelectorAll('.katex-html .fbox').length};
    },seed);
    if(result)return result;
  }
  throw new Error('MD82 L3 two-answer item not reached');
}

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{}}));});
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/drill.html',{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const level of [1,2,3]){
      const stats=await page.evaluate(async level=>{
        NM_EXAM.renderPrint({thread:'MD82',level,count:12,seed:'md82-a4-'+level});
        await document.fonts.ready;await new Promise(requestAnimationFrame);
        const sheet=document.querySelector('.nm-print-sheet');
        const bad=[...sheet.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')].filter(el=>{
          const r=el.getBoundingClientRect(),parent=el.closest('.nm-w2-page');
          return el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3||(parent&&r.bottom>parent.getBoundingClientRect().bottom+3);
        });
        return {questions:sheet.querySelectorAll('.nm-w2-item').length,keys:sheet.querySelectorAll('.nm-ak-item').length,example:sheet.querySelectorAll('.nm-w2-example').length,guides:sheet.querySelectorAll('.nm-w2-guide-item').length,katex:sheet.querySelectorAll('.katex-error').length,bad:bad.length};
      },level);
      assert.deepEqual(stats,{questions:12,keys:12,example:1,guides:3,katex:0,bad:0},'MD82 L'+level+' A4');
    }
    const a4=await renderUntilBoth(page,'md82-two-box-a4');
    assert.equal(a4.boxed,2,'normalized student TeX must contain two write boxes');
    assert.equal(a4.domBoxes,2,'KaTeX DOM must render two boxes');

    await page.emulateMedia({media:'screen'});await page.setViewportSize({width:390,height:900});
    await page.goto(base+'/index.html?enter=1',{waitUntil:'networkidle'});
    await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD82',level:3,count:12,seed:'md82-mobile'}],'수직선 검수',{count:12}));
    await page.waitForSelector('#nm-pe-overlay');
    let mobile=null;
    for(let i=0;i<40&&!mobile;i++){
      mobile=await page.evaluate(i=>{
        if(i)NM_EXAM.openPrintEditor([{thread:'MD82',level:3,count:12,seed:'md82-mobile-'+i}],'수직선 검수',{count:12});
        const item=[...document.querySelectorAll('#nm-pe-overlay .nm-w2-item')].find(el=>el.textContent.includes('두 수'));
        if(!item)return null;
        const tex=item.querySelector('[data-tex]')?.getAttribute('data-tex')||'';
        return {boxes:item.querySelectorAll('.katex-html .fbox').length,normalized:(tex.match(/\\boxed/g)||[]).length,questions:document.querySelectorAll('#nm-pe-overlay .nm-w2-item').length,overflow:document.documentElement.scrollWidth>innerWidth+2};
      },i);
    }
    assert(mobile,'390 px preview did not reach a two-answer item');
    assert.deepEqual(mobile,{boxes:2,normalized:2,questions:12,overflow:false});
    assert.deepEqual(errors,[],'browser page errors');
    console.log('PASS MD82 A4 L1-L3: 12 questions + example + 3 guided, no overflow or KaTeX errors.');
    console.log('PASS MD82 L3: normalized TeX and actual KaTeX DOM each contain two student write boxes; 390 px overflow 0.');
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
