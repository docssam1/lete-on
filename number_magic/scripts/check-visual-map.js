#!/usr/bin/env node
/* 그림 지도와 기존 길 로드맵을 실제 브라우저에서 왕복 확인한다. */
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const pw=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript',
  '.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json'};

async function main(){
  const server=http.createServer((req,res)=>{
    const file=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
    if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){
      res.writeHead(404);res.end();return;
    }
    res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try{
    browser=await pw.chromium.launch({args:['--disable-gpu','--disable-webgl','--disable-webgl2']});
    for(const [lang,width,height,title] of [
      ['ko',1280,900,'그림으로 보는 연산 지도'],
      ['ko',390,844,'그림으로 보는 연산 지도'],
      ['en',390,844,'Illustrated arithmetic map'],
      ['zh',390,844,'图画运算地图']
    ]){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
      await context.addInitScript(language=>{
        localStorage.setItem('nm_state_v1',JSON.stringify({lang:language,onboarded:true,name:'지도 검수',
          view:'courseroad',roadView:'map',account:{status:'active'},placement:{course:'C20',self:true}}));
      },lang);
      const page=await context.newPage(),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/*',route=>/supabase|google-analytics|googletagmanager/.test(route.request().url())?route.abort():route.continue());
      await page.goto(`http://127.0.0.1:${server.address().port}/number_magic/index.html?enter=1`,{waitUntil:'domcontentloaded'});
      await page.locator('#ttRoad').click();
      try{await page.locator('#crVisual:not([hidden])').waitFor({timeout:15000});}
      catch(e){console.error('지도 진입 진단',lang,width,await page.title(),await page.locator('body').innerText().then(x=>x.slice(0,450)),errors);throw e;}
      assert.equal((await page.locator('#crVisualTitle').textContent()).trim(),title);
      assert(await page.locator('.nm-vmap-art').evaluate(img=>img.decode().then(()=>img.naturalWidth===1672)),'지도 이미지 디코딩');
      assert.equal(await page.locator('.nm-vmap-stop').count(),5,'지도 지점 5개');
      assert.equal(await page.locator('.nm-vmap-character').count(),5,'표지판 아래 안내 캐릭터 5명');
      assert(await page.locator('.nm-vmap-character img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().then(()=>img.naturalWidth>0))).then(xs=>xs.every(Boolean))),'안내 캐릭터 이미지 디코딩');
      assert.equal(await page.locator('.nm-vmap-stop.is-current').count(),1,'현재 위치 1개');
      assert.equal(await page.locator('.nm-vmap-stage.is-current').count(),1,'현재 단계 1개');
      assert.equal(await page.locator('.nm-vmap-character.is-selected').count(),1,'선택된 안내 캐릭터 1명');
      assert(await page.locator('.nm-vmap-talk-bubble p').textContent(),'안내 캐릭터의 과정 설명');
      const layout=await page.evaluate(()=>({
        documentWidth:document.documentElement.scrollWidth,viewportWidth:document.documentElement.clientWidth,
        bodyWidth:document.querySelector('#crBody').scrollWidth,bodyViewport:document.querySelector('#crBody').clientWidth,
        mapWidth:document.querySelector('#crMapScroll').scrollWidth,
        mapViewport:document.querySelector('#crMapScroll').clientWidth,
        selectedVisible:(()=>{const a=document.querySelector('.nm-vmap-stop.is-selected').getBoundingClientRect(),b=document.querySelector('#crMapScroll').getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;})(),
        guidesInsideCanvas:(()=>{const b=document.querySelector('.nm-vmap-canvas').getBoundingClientRect();return [...document.querySelectorAll('.nm-vmap-character')].every(el=>{const a=el.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1;});})(),
        minimumStop:Math.min(...[...document.querySelectorAll('.nm-vmap-stop')].map(el=>Math.min(el.getBoundingClientRect().width,el.getBoundingClientRect().height))),
        minimumGuide:Math.min(...[...document.querySelectorAll('.nm-vmap-character')].map(el=>Math.min(el.getBoundingClientRect().width,el.getBoundingClientRect().height)))
      }));
      assert(layout.documentWidth<=layout.viewportWidth+1,`문서 가로 넘침: ${JSON.stringify(layout)}`);
      assert(layout.bodyWidth<=layout.bodyViewport+1,`로드맵 영역 가로 넘침: ${JSON.stringify(layout)}`);
      assert(layout.selectedVisible,`선택된 지점이 지도 안에 보이지 않음: ${JSON.stringify(layout)}`);
      assert(layout.guidesInsideCanvas,`캐릭터가 그림 밖으로 나감: ${JSON.stringify(layout)}`);
      assert(layout.minimumStop>=44,`지도 지점 터치 크기: ${layout.minimumStop}`);
      assert(layout.minimumGuide>=44,`안내 캐릭터 터치 크기: ${layout.minimumGuide}`);
      if(width===390)assert(layout.mapWidth>layout.mapViewport,'모바일 지도 가로 탐색');
      if(lang==='ko')await page.screenshot({path:`/tmp/number-magic-visual-map-${width}.png`,fullPage:false});

      const stageKeys=new Set();
      for(const group of ['first','arithmetic','challenge','middle','high']){
        await page.locator(`.nm-vmap-character[data-map-group="${group}"]`).click();
        const keys=await page.locator('.nm-vmap-stage').evaluateAll(els=>els.map(el=>el.dataset.mapStage));
        for(const key of keys)stageKeys.add(key);
      }
      assert.equal(stageKeys.size,10,'다섯 지점의 단계 10개');
      assert(await page.evaluate(keys=>keys.every(key=>{
        const stage=window.NM_STAGES.find(s=>s.key===key);
        return stage&&document.querySelector(`.nm-cr-node[data-c="C${stage.courses.from}"]`);
      }),[...stageKeys]),'모든 단계의 첫 과정이 실제 길에 있음');

      await page.locator('.nm-vmap-character[data-map-group="high"]').click();
      assert.equal(await page.locator('.nm-vmap-stage').count(),4,'고등 수학 4단계');
      const expectedSpeech=lang==='ko'?'다항식':lang==='en'?'polynomials':'多项式';
      assert((await page.locator('.nm-vmap-talk-bubble p').textContent()).includes(expectedSpeech),'언어별 실제 과정 설명');
      assert((await page.locator('#crMapLive').textContent()).includes(expectedSpeech),'선택한 캐릭터 설명 알림');
      if(lang==='ko'&&width===390)await page.screenshot({path:'/tmp/number-magic-visual-map-detail-390.png',fullPage:false});
      await page.locator('[data-map-stage="common2"]').click();
      assert.equal(await page.locator('#crViewRoad').getAttribute('aria-pressed'),'true','길 보기로 전환');
      assert(await page.locator('#crList').isVisible(),'기존 과정 길 표시');
      assert.equal(await page.evaluate(()=>document.activeElement&&document.activeElement.dataset.c),'C49','실제 과정 49로 이동');
      await page.locator('#crViewMap').click();
      assert(await page.locator('#crVisual').isVisible(),'그림 지도 재진입');
      const tower=page.locator('.nm-vmap-character[data-map-group="challenge"]');
      await tower.focus();await page.keyboard.press('Enter');
      assert.equal(await tower.getAttribute('aria-pressed'),'true','키보드 Enter로 지점 선택');
      assert.equal(await page.evaluate(()=>document.activeElement&&document.activeElement.id),'crMapDetail','키보드 초점은 단계 설명으로 이동');
      assert.equal(await page.locator('[data-map-stage="tower"]').count(),1,'선택한 지점의 실제 단계');
      assert((await page.locator('.nm-vmap-talk-bubble p').textContent()).length>12,'캐릭터가 선택한 과정 설명');
      assert.deepEqual(errors,[],`화면 오류: ${errors.join('; ')}`);
      await context.close();
      console.log(`✓ 그림 지도 ${lang} ${width}px · 이미지/단계/전환/키보드/폭`);
    }
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
