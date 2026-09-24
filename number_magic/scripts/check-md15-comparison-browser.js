#!/usr/bin/env node
'use strict';

const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const out=process.env.NM_MD15_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(res);
});

(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r)); let browser;
  const result={levels:[],previews:[],errors:[]};
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch(process.env.NM_CHROMIUM?{executablePath:process.env.NM_CHROMIUM}:{});
    const page=await browser.newPage({viewport:{width:1100,height:1100}});
    page.on('pageerror',e=>result.errors.push(e.message));
    await page.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수용',avatar:{kind:'boy'},cloudLinked:false,progress:{}}));});
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/drill.html',{waitUntil:'networkidle'});
    await page.emulateMedia({media:'print'});
    await page.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    for(const level of [4,5,6]){
      const r=await page.evaluate(async cfg=>{
        NM_EXAM.renderPrint(cfg); await document.fonts.ready; await new Promise(requestAnimationFrame);
        const sheet=document.querySelector('.nm-print-sheet');
        const rel=[...sheet.querySelectorAll('.nm-ak-item [data-tex]')].map(e=>e.getAttribute('data-tex')).filter(t=>/^\d+\\;\(/.test(t||''));
        const focus=sheet.querySelector('.nm-mid-focus')?.textContent||'';
        const bad=[...sheet.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')].filter(e=>{
          const rect=e.getBoundingClientRect(),parent=e.closest('.nm-w2-page');
          return e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3||(parent&&rect.bottom>parent.getBoundingClientRect().bottom+3);
        }).map(e=>({cls:e.className,cw:e.clientWidth,sw:e.scrollWidth,ch:e.clientHeight,sh:e.scrollHeight}));
        return {level:cfg.level,concept:sheet.querySelectorAll('[data-middle-concept="MD15"]').length,example:sheet.querySelectorAll('.nm-w2-example').length,guides:sheet.querySelectorAll('.nm-w2-guide-item').length,questions:sheet.querySelectorAll('.nm-w2-item').length,keys:sheet.querySelectorAll('.nm-ak-item').length,relations:rel.length,focus,bad,katexErrors:sheet.querySelectorAll('.katex-error').length,pages:sheet.querySelectorAll('.nm-w2-page').length};
      },{thread:'MD15',level,count:24,seed:'md15-browser-'+level});
      assert.equal(r.concept,1); assert.equal(r.example,1); assert.equal(r.guides,3);
      assert.equal(r.questions,24); assert.equal(r.keys,24); assert.equal(r.relations,24);
      assert.equal(r.katexErrors,0); assert.deepEqual(r.bad,[]);
      assert(r.focus.length>40,'level-specific concept explanation missing');
      result.levels.push(r);
      if(out&&level===6)await page.locator('.nm-w2-page').first().screenshot({path:path.join(out,'MD15-L6-a4-first-page.png')});
    }
    await page.emulateMedia({media:'screen'});
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:1000});
      await page.goto(base+'/index.html?enter=1',{waitUntil:'networkidle'});
      await page.evaluate(()=>NM_EXAM.openPrintEditor([{thread:'MD15',level:6,seed:'md15-preview'}],'제곱근 대소 비교',{count:24}));
      await page.waitForSelector('#nm-pe-overlay');
      const p=await page.evaluate(()=>{
        const overlay=document.querySelector('#nm-pe-overlay');
        const bad=[...overlay.querySelectorAll('.nm-w2-page,.nm-mid-concept,.nm-w2-example,.nm-w2-guide,.nm-w2-item,.nm-ak-grid')].filter(e=>e.scrollWidth>e.clientWidth+3||e.scrollHeight>e.clientHeight+3).map(e=>({cls:e.className,cw:e.clientWidth,sw:e.scrollWidth,ch:e.clientHeight,sh:e.scrollHeight}));
        return {width:innerWidth,position:getComputedStyle(overlay).position,docOverflow:document.documentElement.scrollWidth>innerWidth+2,bad,questions:overlay.querySelectorAll('.nm-w2-item').length,relations:[...overlay.querySelectorAll('.nm-ak-item [data-tex]')].filter(e=>/^\d+\\;\(/.test(e.getAttribute('data-tex')||'')).length};
      });
      assert.equal(p.position,'fixed'); assert.equal(p.docOverflow,false); assert.deepEqual(p.bad,[]);
      /* 편집기 공용 기본값은 20문항(선택지는 10/20/30)이다. 위 직접 인쇄
         검사는 권장 편성의 24문항을 별도로 검증한다. */
      assert.equal(p.questions,20); assert.equal(p.relations,0,'student preview must not expose the answer relation'); result.previews.push(p);
      if(out)await page.screenshot({path:path.join(out,'MD15-L6-preview-'+width+'.png')});
      await page.locator('#nm-pe-close').click();
    }
    assert.deepEqual(result.errors,[]);
    if(out)fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2));
    console.log(JSON.stringify({ok:true,...result},null,2));
  }finally{
    if(browser)await browser.close(); await new Promise(r=>server.close(r));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
