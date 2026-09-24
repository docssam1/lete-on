#!/usr/bin/env node
'use strict';
// Real roadmap view. Button routing is observed independently of the worksheet renderer.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),out=process.env.NM_CONCEPT_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM});
    const page=await browser.newPage(),errors=[],checks=[];
    await page.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/supabase|google-analytics/.test(r.request().url())?r.abort():r.continue());
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{
      window.NM_NO_AUTOPRINT=true;window.print=()=>{};
      localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'진도 검수',view:'courseroad',avatar:{kind:'boy'},cloudLinked:false,progress:{},account:{status:'active'},placement:{course:'C29',self:true},roadCadence:'w2'}));
    });
    for(const width of [1440,390]){
      await page.setViewportSize({width,height:1100});
      await page.goto('http://127.0.0.1:'+server.address().port+'/index.html?enter=1',{waitUntil:'networkidle'});
      if(await page.locator('#ttRoad').isVisible())await page.locator('#ttRoad').click();
      if(await page.locator('#townCourseRoad').isVisible())await page.locator('#townCourseRoad').click();
      await page.waitForSelector('#middlePacing1');
      assert.equal(await page.locator('.nm-middle-pacing').count(),3);
      assert.equal(await page.locator('[data-middle-session]').count(),42);
      await page.evaluate(()=>{window.__pacingCalls=[];NM_EXAM.openMiddlePacing=(grade,id)=>window.__pacingCalls.push({grade,id});});
      for(const grade of [1,2,3]){
        const plan=page.locator('#middlePacing'+grade);
        await plan.locator('summary').click();
        assert.equal(await plan.locator('.nm-mp-session').count(),14);
        const buttons=plan.locator('[data-middle-session]');
        await buttons.first().focus();await page.keyboard.press('Enter');
        const received=await page.evaluate(()=>window.__pacingCalls.pop());
        assert.equal(received.grade,grade);assert.equal(received.id,'M'+grade+'-S01');
        const bounds=await plan.evaluate(e=>{
          const r=e.getBoundingClientRect();
          return {left:r.left,right:r.right,width:innerWidth,overflow:[...e.querySelectorAll('h4,p,button')].some(x=>x.scrollWidth>x.clientWidth+3)};
        });
        assert(bounds.left>=-1&&bounds.right<=width+1&&!bounds.overflow,JSON.stringify(bounds));
        // The roadmap scrolls inside its own panel. A tall element screenshot is clipped by
        // that ancestor; capture the real viewport and separately prove the final row is reachable.
        if(out){await buttons.first().scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'middle'+grade+'-'+width+'.png')});}
        await buttons.last().scrollIntoViewIfNeeded();
        const tail=await buttons.last().boundingBox();
        assert(tail&&tail.y>=0&&tail.y+tail.height<=1100,'last session must be reachable inside the scrolling roadmap');
        checks.push({width,grade,rows:14,keyboardRoute:received.id,overflow:false});
        await plan.locator('summary').click();
      }
    }
    assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,checks,errors},null,2));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
