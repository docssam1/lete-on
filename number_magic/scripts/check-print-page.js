#!/usr/bin/env node
'use strict';
/* A4 실제 폭에서 세로 잘림을 검사한다. check-print.js의 가로 검사 보완.
 * NODE_PATH로 Playwright 설치 경로를 지정할 수 있다. 문항/학습 기록은 쓰지 않는다. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
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
    const p=await browser.newPage({viewport:{width:1000,height:1200}});
    const errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.addInitScript(()=>{window.NM_NO_AUTOPRINT=true;});
    await p.goto('http://127.0.0.1:'+server.address().port+'/drill.html');
    await p.emulateMedia({media:'print'});
    // 210mm A4 - 양쪽 10mm. 화면 폭이 인쇄 폭인 것처럼 재현한다.
    await p.addStyleTag({content:'html,body{width:190mm!important}.nm-print-sheet{width:190mm!important}'});
    await p.evaluate(()=>document.fonts.ready);
    let sets=0,pages=0;
    const targets=await p.evaluate(()=>['DC6','MD83'].flatMap(t=>NM_THREADS[t].levels.map(l=>[t,l.id])).concat([['MD65',4]]));
    for(const [thread,level] of targets){
      // DC6의 일부 레벨은 보이는 변형 풀이 20개 미만인 유한 풀이다. 무중복 계약을
      // 깨고 20/30개를 채우지 말고, 가능한 10개로 조판만 검사한다.
      const counts=thread==='DC6'?[10]:[10,20,30];
      for(const count of counts)for(const seed of ['page1','page2','page3']){
        const r=await p.evaluate(async cfg=>{
          NM_EXAM.renderPrint(cfg);
          await document.fonts.ready;
          await new Promise(requestAnimationFrame);
          const sheet=document.querySelector('.nm-print-sheet');
          const cards=[...sheet.querySelectorAll('.nm-w2-item')];
          const bad=[];
          cards.forEach((c,i)=>{
            const r=c.getBoundingClientRect(),page=c.closest('.nm-w2-page').getBoundingClientRect();
            if(r.top<page.top-2||r.bottom>page.bottom+2||c.scrollHeight>c.clientHeight+2||c.scrollWidth>c.clientWidth+2)bad.push({item:i+1,h:c.clientHeight,sh:c.scrollHeight,w:c.clientWidth,sw:c.scrollWidth});
          });
          const pageOverflow=[...sheet.querySelectorAll('.nm-w2-page')].filter(e=>e.scrollHeight>e.clientHeight+2).length;
          const blocks=[...sheet.querySelectorAll('.nm-w2-head,.nm-w2-guide,.nm-ak-grid')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>({cls:e.className,w:e.clientWidth,sw:e.scrollWidth}));
          return {cards:cards.length,keys:sheet.querySelectorAll('.nm-ak-item').length,bad,blocks,pageOverflow,pages:sheet.querySelectorAll('.nm-w2-page').length};
        },{thread,level,count,seed});
        assert.equal(r.cards,count,thread+' question count');assert.equal(r.keys,count,thread+' answer count');
        assert.deepEqual(r.bad,[],JSON.stringify({thread,level,count,seed,...r}));assert.deepEqual(r.blocks,[],JSON.stringify({thread,level,count,seed,...r}));assert.equal(r.pageOverflow,0,thread+' page overflow');
        sets++;pages+=r.pages;
      }
    }
    assert.deepEqual(errors,[]);console.log('PASS A4 page geometry: '+sets+' sets / '+pages+' problem pages (finite-pool-safe counts, 3 seeds)');
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
