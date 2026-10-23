#!/usr/bin/env node
'use strict';
// Isolated guide with the real app stylesheet; all nonlocal requests are blocked.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.js':'application/javascript','.css':'text/css','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true}),checks=[];
  try{
    for(const [width,lang]of [[390,'ko'],[1280,'ko'],[390,'en'],[390,'zh']]){
      const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[],writes=[];
      page.on('pageerror',e=>errors.push(e.message));
      await context.route('**/*',route=>{const request=route.request();if(request.method()!=='GET')writes.push(request.url());return request.url().startsWith(base+'/')&&request.method()==='GET'?route.continue():route.abort();});
      await page.goto(base+'/app/middle-study-guidance.js');
      await page.setContent('<!doctype html><html lang="'+lang+'"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="'+base+'/app/styles.css"><main style="max-width:720px;padding:12px;margin:auto"><section id="guide"></section><button id="normalNext">Normal next course</button></main></html>');
      await page.addScriptTag({url:base+'/app/middle-study-guidance.js'});
      await page.evaluate(()=>{
        window.__records={progress:{C36:1},speed:1,cadence:'w2'},window.__before=JSON.stringify(__records);window.__choices=[];window.__continues=0;window.__normal=0;
        document.querySelector('#normalNext').onclick=()=>__normal++;
      });
      for(const phase of ['mid','end']){
        await page.evaluate(({phase,lang})=>{window.__controller=NM_MIDDLE_STUDY_GUIDANCE.mount(document.querySelector('#guide'),{grade:3,phase,lang,choice:null,onChoice:value=>__choices.push(value),onContinue:()=>__continues++});},{phase,lang});
        assert.equal(await page.locator('#guide details').evaluate(e=>e.open),false,'details begin closed');
        assert.equal(await page.locator('#guide button').count(),2);
        assert.match(await page.locator('#guide').innerText(),/2\.5/);assert.match(await page.locator('#guide').innerText(),/4/);assert.match(await page.locator('#guide').innerText(),/1\.5/);
        const before=await page.evaluate(()=>({choices:__choices.length,continues:__continues}));
        await page.click('#normalNext');
        assert.deepEqual(await page.evaluate(()=>({choices:__choices.length,continues:__continues})),before,'no answer never blocks or chooses the normal route');
        assert.equal(await page.evaluate(()=>__controller.getChoice()),null);
        await page.locator('[data-guidance=interested]').focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('#guide details').evaluate(e=>e.open),true);
        assert.equal(await page.locator('[data-guidance=interested]').getAttribute('aria-expanded'),'true');
        assert.equal(await page.evaluate(()=>__choices.at(-1)),'interested');assert.equal(await page.evaluate(()=>__continues),before.continues,'interest does not enroll or advance');
        await page.click('[data-guidance=continue]');assert.equal(await page.evaluate(()=>__choices.at(-1)),'continue');assert.equal(await page.evaluate(()=>__continues),before.continues+1);
        assert.equal(await page.evaluate(()=>JSON.stringify(__records)===__before),true,'guide cannot change learning records');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'no horizontal overflow');
        checks.push({width,lang,phase,nonblocking:true,interestOnly:true,noRecordMutation:true});
      }
      await page.evaluate(lang=>NM_MIDDLE_STUDY_GUIDANCE.mount(document.querySelector('#guide'),{grade:3,phase:'end',lang,choice:'interested'}),lang);
      assert.equal(await page.locator('#guide details').evaluate(e=>e.open),true,'saved interest restores the topic details after a host re-render');
      assert.equal(await page.locator('[data-guidance=interested]').getAttribute('aria-expanded'),'true');
      assert(await page.locator('[data-guidance=status]').innerText());
      await page.evaluate(lang=>{
        const host=document.querySelector('#guide');
        const opts={grade:3,phase:'mid',lang,choice:null,onChoice:value=>{opts.choice=value;NM_MIDDLE_STUDY_GUIDANCE.mount(host,opts);}};
        NM_MIDDLE_STUDY_GUIDANCE.mount(host,opts);
      },lang);
      await page.click('[data-guidance=interested]');
      assert.equal(await page.locator('#guide details').evaluate(e=>e.open),true,'a synchronous host re-mount does not close newly opened topic details');
      assert.equal(await page.locator('[data-guidance=interested]').getAttribute('aria-expanded'),'true');
      assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);await context.close();
    }
    console.log('MIDDLE_STUDY_GUIDANCE_BROWSER_OK '+JSON.stringify({cases:checks.length,checks,externalWrites:0}));
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
