#!/usr/bin/env node
'use strict';
/* 광고가 긴 스크롤 페이지로 돌아가지 않고 한 권의 책 안에서
   표지 → 영상 → 실제 학습지 → 전체 로드맵으로 이어지는지 확인한다. */
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
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.magic-book-app').getAttribute('data-view'),'cover','표지에서 Escape는 아무 동작도 하지 않아야 한다');
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'cover'))});

  await page.locator('#openBook').click();
  await page.waitForSelector('[data-panel="menu"].is-active');
  assert.equal(await page.locator('.chapter-nav > *').count(),4);
  assert.match(await visibleText(page,'.chapter-nav'),/04 오픈톡 상담/);
  const detailInside=await page.locator('[data-panel="menu"] [data-route="video"]').last().evaluate(el=>!!el.closest('.open-book'));
  assert.equal(detailInside,true,'자세히 보기는 펼친 책 안에 있어야 한다');
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'menu'))});

  await page.locator('[data-panel="menu"] .primary-button').click();
  await page.waitForSelector('[data-panel="video"].is-active');
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

  await page.locator('#videoFinish [data-route="worksheet"]').click();
  await page.waitForSelector('[data-panel="worksheet"].is-active');
  await page.locator('#sheetA').evaluate(img=>img.decode());
  assert.match(await page.locator('#sheetA').getAttribute('src'),/page-1\.webp$/);
  await page.locator('#sheetNext').click();
  await page.waitForTimeout(230);
  assert.match(await page.locator('#sheetA').getAttribute('src'),width<=700?/page-2\.webp$/:/page-3\.webp$/);
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'worksheet'))});

  await page.locator('[data-panel="worksheet"] [data-route="roadmap"]').click();
  await page.waitForSelector('[data-panel="roadmap"].is-active');
  assert.equal(await page.locator('#roadmapRows .roadmap-row').count(),7);
  assert.equal(await page.locator('.track-key [data-track]').count(),3);
  const tracks=await visibleText(page,'.track-key');
  assert.match(tracks,/소마 A 트랙/);assert.match(tracks,/필즈 E1 트랙/);assert.match(tracks,/프리미어 트랙/);
  if(OUT)await page.screenshot({path:path.join(OUT,screenName(width,'roadmap'))});
  await page.goBack();
  await page.waitForSelector('[data-panel="worksheet"].is-active');
  await page.keyboard.press('Escape');
  await page.waitForSelector('[data-panel="menu"].is-active');
  await page.locator('#bookHome').click();
  await page.waitForSelector('.scene-cover.is-active');
  assert.deepEqual(errors,[]);
  await context.close();
  return {width,height,bodyOverflow:false,chapters:4,videoCuts:2,worksheet:true,roadmapStages:7,tracks:3};
}
(async()=>{
  const html=fs.readFileSync(path.join(ROOT,'promo','index.html'),'utf8');
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
    console.log(JSON.stringify({ok:true,results},null,2));
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
