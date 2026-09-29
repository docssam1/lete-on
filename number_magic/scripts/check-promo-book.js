#!/usr/bin/env node
'use strict';
/* 광고가 긴 스크롤 페이지로 돌아가지 않고 한 권의 책 안에서
   표지 → 오른쪽 영상 → 실제 학습지 → 전체 로드맵으로 이어지는지 확인한다. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'..');
const OUT=process.env.NM_PROMO_ARTIFACTS&&path.resolve(process.env.NM_PROMO_ARTIFACTS);
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'};
const server=http.createServer((req,res)=>{
  let url=decodeURIComponent(req.url.split('?')[0]);
  if(url.endsWith('/'))url+='index.html';
  const file=path.resolve(ROOT,'.'+url);
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
function screenName(width,view){return `${view}-${width}.png`;}
async function visibleText(page,selector){return (await page.locator(selector).innerText()).replace(/\s+/g,' ').trim();}
async function checkViewport(browser,port,width,height){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*.mp4',route=>route.abort());
  await page.goto(`http://127.0.0.1:${port}/promo/`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.scene-cover.is-active');
  const fit=await page.evaluate(()=>({
    bodyW:document.body.scrollWidth,bodyH:document.body.scrollHeight,viewW:document.documentElement.clientWidth,viewH:document.documentElement.clientHeight,
    overflow:getComputedStyle(document.body).overflow
  }));
  assert(fit.bodyW<=fit.viewW+1,`horizontal overflow at ${width}: ${JSON.stringify(fit)}`);
  assert(fit.bodyH<=fit.viewH+1,`vertical overflow at ${width}: ${JSON.stringify(fit)}`);
  assert.equal(fit.overflow,'hidden');
  assert.match(await visibleText(page,'.scene-cover'),/숫자가 마법이 되는 곳 Numbers of Magic ·? ?수의 마법/);
  assert.match(await visibleText(page,'.scene-cover'),/책을 눌러 펼쳐 보세요/);
  const coverParts=await page.evaluate(()=>{const name=document.querySelector('.cover-name-ko').getBoundingClientRect(),logo=document.querySelector('.cover-logo').getBoundingClientRect();return{nameBottom:name.bottom,logoTop:logo.top}});
  assert(coverParts.nameBottom<=coverParts.logoTop+1,`표지 제목과 로고가 겹침 at ${width}: ${JSON.stringify(coverParts)}`);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.magic-book-app').getAttribute('data-view'),'cover','표지에서 Escape는 아무 동작도 하지 않아야 한다');
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'cover'))});

  await page.locator('#openBook').click();
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='menu');
  await page.waitForSelector('[data-panel="menu"].is-active');
  assert.equal(await page.locator('.chapter-nav > *').count(),4);
  assert.match(await visibleText(page,'.chapter-nav'),/04 오픈톡 상담/);
  assert.equal(await page.locator('#cinema').getAttribute('class'),'cinema journey-cinema is-journey');
  assert.match(await page.locator('#introVideo').getAttribute('src'),/showreel-15s-vertical\.mp4$/);
  const journeyContract=await page.locator('#introVideo').evaluate(v=>({loop:v.loop,muted:v.muted,volume:v.volume,right:!!v.closest('.page-right')}));
  assert.deepEqual(journeyContract,{loop:true,muted:false,volume:.72,right:true});
  assert.match(await visibleText(page,'#journeyEnter'),/수의 마법으로 여행/);
  assert.equal(await page.locator('#cinemaPlay').isVisible(),true,'움직임 줄이기 설정에서는 미리보기를 직접 재생할 수 있어야 한다');
  assert.equal(await page.locator('#bookNext').getAttribute('aria-label'),'다음 페이지: 실제 학습지');
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'menu'))});

  await page.locator('#journeyEnter .primary-button').click();
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='video');
  await page.waitForSelector('[data-panel="menu"].is-active');
  assert.equal(await page.locator('[data-panel="menu"]').getAttribute('aria-labelledby'),'video-title');
  const showreelClasses=await page.locator('#cinema').evaluate(el=>Array.from(el.classList));
  assert(showreelClasses.includes('is-showreel')&&!showreelClasses.includes('is-journey'),'CTA 후 주 영상 상태여야 한다');
  assert.match(await page.locator('#introVideo').getAttribute('src'),/showreel-full\.mp4$/);
  assert.equal(await page.locator('#videoHeading').isVisible(),true);
  assert.equal(await page.locator('#cinemaControls').isVisible(),true);
  assert.equal(await page.locator('#journeyEnter').isHidden(),true);
  assert.equal(await page.locator('[data-cut]').count(),2);
  assert.match(await visibleText(page,'#video-title'),/2분 10초로 보는 수의 마법/);
  const videoContract=await page.locator('#introVideo').evaluate(v=>({native:v.hasAttribute('controls'),list:v.getAttribute('controlslist'),pip:v.hasAttribute('disablepictureinpicture')}));
  assert.deepEqual(videoContract,{native:false,list:'nodownload noremoteplayback',pip:true});
  await page.locator('#introVideo').evaluate(v=>v.dispatchEvent(new Event('play')));
  assert.equal(await page.locator('#cinemaPlay').isHidden(),true,'재생 중 투명한 중앙 버튼이 포커스 순서에 남으면 안 된다');
  await page.locator('#introVideo').evaluate(v=>v.dispatchEvent(new Event('pause')));
  await page.locator('#introVideo').evaluate(v=>v.dispatchEvent(new Event('ended')));
  await page.waitForSelector('#videoFinish:not([hidden])');
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'video-ended'))});

  await page.locator('#bookNext').click();
  await page.waitForSelector('[data-panel="worksheet"].is-active');
  assert.equal(await page.locator('#bookNext').getAttribute('aria-label'),'다음 페이지: 전체 로드맵');
  await page.locator('#sheetA').evaluate(img=>img.decode());
  assert.match(await page.locator('#sheetA').getAttribute('src'),/page-1\.webp$/);
  await page.locator('#sheetNext').click();
  await page.waitForTimeout(230);
  assert.match(await page.locator('#sheetA').getAttribute('src'),width<=700?/page-2\.webp$/:/page-3\.webp$/);
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'worksheet'))});

  await page.locator('#bookNext').click();
  await page.waitForSelector('[data-panel="roadmap"].is-active');
  assert.equal(await page.locator('#bookNext').isHidden(),true);
  assert.equal(await page.locator('#roadmapRows .roadmap-row').count(),7);
  assert.equal(await page.locator('.track-key [data-track]').count(),3);
  const tracks=await visibleText(page,'.track-key');
  assert.match(tracks,/소마 A 트랙/);assert.match(tracks,/필즈 E1 트랙/);assert.match(tracks,/프리미어 트랙/);
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'roadmap'))});
  await page.locator('#bookBack').evaluate(button=>{button.click();button.click()});
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='worksheet');
  await page.waitForSelector('[data-panel="worksheet"].is-active');
  await page.waitForFunction(()=>!document.querySelector('.book-paper').classList.contains('is-turning'));
  const historyBeforeBack=await page.evaluate(()=>history.length);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='video');
  await page.waitForFunction(()=>!document.querySelector('.book-paper').classList.contains('is-turning'));
  assert.equal(await page.evaluate(()=>history.length),historyBeforeBack,'이전 장은 브라우저 기록을 추가하지 않아야 한다');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='menu');
  await page.waitForSelector('[data-panel="menu"].is-active');
  assert.equal(await page.evaluate(()=>history.length),historyBeforeBack,'차례로 돌아가며 브라우저 기록을 추가하지 않아야 한다');
  assert.equal(await page.locator('#cinema').getAttribute('class'),'cinema journey-cinema is-journey');
  assert.equal(await page.locator('[data-panel="menu"]').getAttribute('aria-labelledby'),'menu-title');
  await page.locator('#bookHome').click();
  await page.waitForSelector('.scene-cover.is-active');
  assert.deepEqual(errors,[]);
  await context.close();
  return {width,height,bodyOverflow:false,chapters:4,rightPageVideo:true,videoCuts:2,edgeNext:true,worksheet:true,roadmapStages:7,tracks:3};
}
async function checkMotionAndMedia(browser,port){
  const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'no-preference'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route(/showreel-(?:full|60s)\.mp4$/,route=>route.abort());
  await page.goto(`http://127.0.0.1:${port}/promo/`,{waitUntil:'domcontentloaded'});
  await page.locator('#openBook').click();
  assert.equal(await page.locator('#openBook').evaluate(el=>el.classList.contains('is-opening')),true,'표지를 누르면 책 넘김 애니메이션이 즉시 시작되어야 한다');
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='menu');
  await page.waitForFunction(()=>{const v=document.querySelector('#introVideo');return v.readyState>=2&&!v.paused&&!v.muted&&v.currentTime>0},null,{timeout:8000});
  await page.waitForTimeout(300);
  const preview=await page.locator('#introVideo').evaluate(v=>({paused:v.paused,muted:v.muted,time:v.currentTime,src:v.currentSrc}));
  const previewControl=await page.locator('#cinemaPlay').evaluate(button=>({tag:button.tagName,tabIndex:button.tabIndex,hidden:button.hidden,label:button.getAttribute('aria-label')}));
  assert.deepEqual(previewControl,{tag:'BUTTON',tabIndex:0,hidden:false,label:'영상 일시정지'});
  await page.locator('#cinemaPlay').click();
  await page.waitForFunction(()=>{const v=document.querySelector('#introVideo'),b=document.querySelector('#cinemaPlay');return v.paused&&b.getAttribute('aria-label')==='영상 재생'});
  await page.locator('#cinemaPlay').click();
  await page.waitForFunction(()=>!document.querySelector('#introVideo').paused);
  await page.locator('#journeyEnter .primary-button').click();
  assert.equal(await page.locator('.book-paper').evaluate(el=>el.classList.contains('is-turning')),false,'주 영상은 같은 오른쪽 장에서 바뀌어야 한다');
  assert.match(await page.locator('#introVideo').getAttribute('src'),/showreel-full\.mp4$/);
  await page.locator('#bookNext').click();
  assert.equal(await page.locator('.book-paper').evaluate(el=>el.classList.contains('is-turning')),true,'옷 책장 넘김 버튼은 실제 페이지 애니메이션을 시작해야 한다');
  await page.waitForFunction(()=>document.querySelector('.magic-book-app').dataset.view==='worksheet');
  assert.equal((await page.locator('#introVideo').evaluate(v=>v.paused)),true);
  assert.deepEqual(errors,[]);
  await context.close();
  return {coverFlip:true,previewPlaying:true,previewPauseControl:true,samePageVideoSwap:true,edgePageTurn:true,preview};
}
(async()=>{
  const html=fs.readFileSync(path.join(ROOT,'promo','index.html'),'utf8');
  const css=fs.readFileSync(path.join(ROOT,'promo','book.css'),'utf8');
  assert.match(css,/@keyframes\s+coverFlip\b/,'첫 화면 책 표지가 실제로 넘어가는 애니메이션이 있어야 한다');
  assert.equal(/<a\b[^>]+href=["'][^"']+\.mp4/i.test(html),false,'MP4 직접 다운로드 링크가 없어야 한다');
  assert.equal(/<a\b[^>]+href=["'][^"']+\.pdf/i.test(html),false,'PDF 다운로드 링크가 없어야 한다');
  assert.equal(/\sdownload(?:\s|=|>)/i.test(html),false,'download 속성이 없어야 한다');
  for(const removed of ['왜 빠른 계산보다 수 감각인지','영상 파일로 받기','체험 학습지 PDF로 받기','과정 5 뺄셈 마법과 구구단 첫걸음'])assert.equal(html.includes(removed),false,`장황한 옛 문구가 남음: ${removed}`);
  if(OUT)fs.mkdirSync(OUT,{recursive:true});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM,headless:true});
    const port=server.address().port;
    const results=[];
    results.push(await checkViewport(browser,port,1366,768));
    results.push(await checkViewport(browser,port,390,844));
    results.push(await checkViewport(browser,port,844,390));
    const motionAndMedia=await checkMotionAndMedia(browser,port);
    console.log(JSON.stringify({ok:true,results,motionAndMedia},null,2));
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
