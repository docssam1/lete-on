#!/usr/bin/env node
'use strict';
/* 홍보 책(promo/) 3판 검사 — 2026-09-29
   원장 지적을 그대로 검사 항목으로 옮겼다:
   - "아래로 내려가지 않게, 책 안에 가득 찬 화면" → 문서 스크롤 0, 모든 쪽이 넘치지 않음(4개 화면 × 3개 언어 × 모든 펼침).
   - "책 넘긴 효과가 이상" → 넘기는 종이가 실제 3D 띠(segment) 여러 장으로 휘어서 넘어가는지, 끌어서 넘기기가 되는지.
   - "실험실을 직접 체험" → 미분·적분·무지개 덧셈을 쪽 안에서 실제로 조작해 값이 바뀌는지, 그 조작이 책장을 넘기지 않는지.
   - "로드맵 이미지" → 10단계 길 그림이 NM_STAGES 에서 그려지는지, 정거장을 누르면 상세가 바뀌는지.
   - "없는 이미지" → 쪽에 쓰인 모든 그림·영상 주소가 200.
   - 광고 원칙 → KMO·학원 실명·합격생·알림톡이 사전에 없는지, mp4/pdf 다운로드 링크가 없는지.
   NM_PROMO_ARTIFACTS=<폴더> 를 주면 펼침마다 스크린숏을 남긴다. */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),vm=require('vm');
const {chromium}=require('./lib/playwright');
const NM=path.resolve(__dirname,'..'),REPO=path.resolve(NM,'..');
const OUT=process.env.NM_PROMO_ARTIFACTS&&path.resolve(process.env.NM_PROMO_ARTIFACTS);
const QUICK=!!process.env.NM_PROMO_QUICK;
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.mp4':'video/mp4','.woff2':'font/woff2','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
  let url=decodeURIComponent(req.url.split('?')[0]);
  if(url.endsWith('/'))url+='index.html';
  const file=path.resolve(REPO,'.'+url);
  if(!file.startsWith(REPO+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  if(req.method==='HEAD'){res.setHeader('Content-Length',fs.statSync(file).size);return res.end();}
  fs.createReadStream(file).pipe(res);
});
const VIEWPORTS=[[1440,900],[1280,720],[1024,768],[390,844]];
const LANGS=['ko','en','zh'];
const ARGS=['--use-gl=angle','--use-angle=swiftshader'];

/* ── 정적 검사: 사전·문구 ── */
function staticChecks(){
  const src=fs.readFileSync(path.join(NM,'promo','i18n.js'),'utf8');
  const ctx={window:{}};vm.runInNewContext(src,ctx);
  const D=ctx.window.NM_PROMO_I18N;
  for(const l of LANGS)assert(D[l],`사전에 ${l} 이 없음`);
  const keys=Object.keys(D.ko);
  for(const l of ['en','zh'])for(const k of keys){
    assert(k in D[l],`${l} 사전에 ${k} 가 빠짐`);
    if(k!=='ws.lang')assert(String(D[l][k]).trim(),`${l} 사전의 ${k} 가 비어 있음`);
  }
  for(const l of ['en','zh'])for(const k of Object.keys(D[l]))assert(k in D.ko,`ko 사전에 ${k} 가 없음(${l}에만 있음)`);
  const html=fs.readFileSync(path.join(NM,'promo','index.html'),'utf8');
  const all=JSON.stringify(D)+html.replace(/<!--[\s\S]*?-->/g,'');
  for(const bad of ['KMO','소마','황소','프리미어','합격생','알림톡','Premier'])assert(!all.includes(bad),`광고 원칙 위반 문구: ${bad}`);
  assert(!/<a\b[^>]+href=["'][^"']+\.(mp4|pdf)/i.test(html),'mp4/pdf 다운로드 링크가 없어야 한다');
  assert(!/\sdownload(\s|=|>)/i.test(html),'download 속성이 없어야 한다');
  assert(/controlslist="[^"]*nodownload/.test(html),'영상은 내려받기 단추를 숨긴다');
  for(const need of ['data-page="road"','data-page="calcA"','data-page="calcB"','data-page="rainbow"','data-page="sheet"','data-page="films"','open.kakao.com/me/gfield'])assert(html.includes(need),`책에 빠진 것: ${need}`);
  return {keys:keys.length};
}

async function newPage(browser,w,h,reduced){
  const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:reduced?'reduce':'no-preference',deviceScaleFactor:1});
  const page=await ctx.newPage(),log={errors:[],bad:[],reqs:new Set()};
  page.on('pageerror',e=>log.errors.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')log.errors.push('console: '+m.text())});
  // 외부 글꼴(Google Fonts)은 검사 환경에서 네트워크가 없을 수 있어 빈 응답으로 대신한다 — 실제 배포에선 그대로 200.
  await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.fulfill({status:200,contentType:'text/css',body:''}));
  page.on('response',r=>{const u=r.url();log.reqs.add(u);if(r.status()>=400)log.bad.push(r.status()+' '+u)});
  page.on('requestfailed',r=>{const f=r.failure();if(!/ERR_ABORTED/.test(f&&f.errorText||''))log.bad.push('failed '+r.url()+' '+(f&&f.errorText))});
  return {ctx,page,log};
}
/* 지금 보이는 쪽들이 책 안에 딱 맞는가 */
async function fitReport(page){
  return page.evaluate(()=>{
    const out=[],de=document.documentElement;
    if(de.scrollHeight>de.clientHeight+1||de.scrollWidth>de.clientWidth+1||document.body.scrollHeight>de.clientHeight+1)out.push(`document scroll ${de.scrollWidth}x${de.scrollHeight}`);
    if(window.scrollY||window.scrollX)out.push('window scrolled');
    for(const pg of document.querySelectorAll('.slot-l .pg,.slot-r .pg')){
      const slot=pg.parentElement.getBoundingClientRect();
      if(!slot.width)continue;
      const box=pg.querySelector('.pad')||pg.querySelector('.pg-in');
      if(box.scrollHeight>box.clientHeight+1)out.push(`${pg.dataset.page}: 세로 넘침 ${box.scrollHeight-box.clientHeight}px`);
      if(box.scrollWidth>box.clientWidth+1)out.push(`${pg.dataset.page}: 가로 넘침 ${box.scrollWidth-box.clientWidth}px`);
      const pr=pg.getBoundingClientRect();
      for(const el of pg.querySelectorAll('*')){
        if(el.closest('.bleed,.phone,.sheet-paper,.symcard,.folio,.road svg,.people,.film-screen'))continue;
        const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;
        const hasText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
        if(!hasText&&!/^(BUTTON|INPUT|CANVAS|IMG|A|SVG|VIDEO)$/i.test(el.tagName))continue;
        const r=el.getBoundingClientRect();if(!r.width&&!r.height)continue;
        if(r.left<pr.left-1||r.right>pr.right+1||r.top<pr.top-1||r.bottom>pr.bottom+1)out.push(`${pg.dataset.page}: 쪽 밖으로 나감 <${el.tagName.toLowerCase()} class="${el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className}"> ${(el.textContent||'').trim().slice(0,30)}`);
        // 잘린 글자: 줄임표 없이 overflow hidden 으로 잘리는 글
        if(hasText&&(cs.overflow==='hidden'||cs.overflowY==='hidden')&&el.scrollHeight>el.clientHeight+2&&el.clientHeight>0)out.push(`${pg.dataset.page}: 글자가 잘림 "${el.textContent.trim().slice(0,30)}"`);
      }
    }
    return out;
  });
}
async function waitIdle(page){await page.waitForFunction(()=>window.NM_PROMO&&!NM_PROMO.busy,null,{timeout:90000})}
async function shot(page,name){if(OUT)await page.screenshot({path:path.join(OUT,name+'.png')})}

async function sweep(browser,port,w,h,lang){
  const {ctx,page,log}=await newPage(browser,w,h,true);
  await page.goto(`http://127.0.0.1:${port}/number_magic/promo/?lang=${lang}`,{waitUntil:'load'});
  await page.waitForSelector('#cover');
  let f=await page.evaluate(()=>{const de=document.documentElement;return {sh:de.scrollHeight,ch:de.clientHeight,sw:de.scrollWidth,cw:de.clientWidth,ov:getComputedStyle(document.body).overflow}});
  assert(f.sh<=f.ch+1&&f.sw<=f.cw+1,`표지에서 문서가 스크롤됨 ${w}x${h} ${JSON.stringify(f)}`);
  assert.equal(f.ov,'hidden');
  assert.equal(await page.evaluate(()=>document.documentElement.lang),lang==='zh'?'zh-Hans':lang);
  await shot(page,`${lang}-${w}x${h}-00-cover`);
  await page.locator('#openBook').click({force:true});
  await page.waitForFunction(()=>NM_PROMO.isOpen);await waitIdle(page);
  const n=await page.evaluate(()=>NM_PROMO.views),problems=[];
  const mode=await page.evaluate(()=>NM_PROMO.mode);
  assert.equal(mode,w<=700?'single':'spread');
  assert.equal(n,w<=700?22:12,`펼침 수가 다름 (${mode})`);
  for(let i=0;i<n;i++){
    if(i>0){await page.evaluate(i=>NM_PROMO.go(i),i);await waitIdle(page)}
    await page.waitForTimeout(40);
    const ids=await page.evaluate(()=>[...document.querySelectorAll('.slot-l .pg,.slot-r .pg')].map(p=>p.dataset.page));
    assert(ids.length===(mode==='spread'?2:1),`펼침 ${i}에 쪽 수가 이상함: ${ids}`);
    problems.push(...(await fitReport(page)).map(s=>`[${i}] ${s}`));
    // 로드맵 상세는 10단계 전부, FAQ 는 여섯 답 전부 펼쳐서 확인
    if(ids.includes('stage')){
      for(let s=0;s<10;s++){await page.evaluate(s=>NM_PROMO.selectStage(s),s);await page.waitForTimeout(20);problems.push(...(await fitReport(page)).map(x=>`[stage ${s+1}] ${x}`))}
      await page.evaluate(()=>NM_PROMO.selectStage(0));
    }
    if(ids.includes('faq')){
      for(let q=1;q<=6;q++){const b=page.locator('#fq'+q);if(await b.getAttribute('aria-expanded')!=='true')await b.click();await page.waitForTimeout(20);problems.push(...(await fitReport(page)).map(x=>`[faq ${q}] ${x}`))}
      await page.locator('#fq1').click();
    }
    await shot(page,`${lang}-${w}x${h}-${String(i+1).padStart(2,'0')}-${ids.join('+')}`);
  }
  // 로드맵 정거장 = NM_STAGES 10개, 누르면 상세가 바뀐다
  await page.evaluate(()=>NM_PROMO.goPage('road'));await waitIdle(page);
  assert.equal(await page.locator('#road .st').count(),10,'로드맵 정거장이 10개가 아님');
  await page.locator('#road .st[data-i="6"]').click();
  await page.waitForTimeout(50);
  const stageTitle=await page.evaluate(()=>{const pg=NM_PROMO.pages.find(p=>p.dataset.page==='stage');const c=pg.querySelector('.stage-card');return c?c.querySelector('.kicker').textContent:''}); // 휴대폰에선 상세 쪽이 다음 장이라 떼어 둔 쪽에서 읽는다
  assert.match(stageTitle,/7/,'정거장 7을 눌렀는데 상세가 바뀌지 않음: '+stageTitle+' '+JSON.stringify(await page.evaluate(()=>[NM_PROMO.view,[...document.querySelectorAll('.slot .pg')].map(p=>p.dataset.page)])));
  await page.evaluate(()=>NM_PROMO.selectStage(0));
  // 모든 쪽의 그림 주소(떼어 둔 쪽 포함)가 200 인지
  const srcs=await page.evaluate(()=>{const s=new Set();NM_PROMO.pages.forEach(p=>p.querySelectorAll('img[src],image').forEach(im=>{const v=im.getAttribute('src')||im.getAttribute('href');if(v)s.add(new URL(v,location.href).href)}));document.querySelectorAll('img[src]').forEach(im=>s.add(im.src));
    ['online-learning.mp4','showreel-full.mp4','showreel-60s.mp4','poster-online-learning.jpg','poster-full.jpg','poster-60s.jpg'].forEach(f=>s.add(new URL('../assets/promo/video/'+f,location.href).href));
    for(let i=1;i<=6;i++)s.add(new URL('../assets/promo/sample/page-'+i+'.webp',location.href).href);
    document.querySelectorAll('[data-lablink]').forEach(a=>s.add(a.href));NM_PROMO.pages.forEach(p=>p.querySelectorAll('a[href^="../"]').forEach(a=>s.add(a.href)));return [...s]});
  const missing=[];
  for(const u of srcs){const r=await page.request.fetch(u,{method:u.endsWith('.mp4')?'HEAD':'GET'});if(r.status()!==200)missing.push(r.status()+' '+u)}
  assert.deepEqual(missing,[],`없는 파일: ${missing.join(', ')}`);
  assert.deepEqual(log.bad,[],`실패한 요청: ${log.bad.join(', ')}`);
  assert.deepEqual(log.errors,[],`콘솔/페이지 오류: ${log.errors.join(' | ')}`);
  assert.deepEqual(problems,[],`${lang} ${w}x${h} 쪽 맞춤 문제:\n  ${problems.join('\n  ')}`);
  await ctx.close();
  return {lang,viewport:`${w}x${h}`,mode,views:n,assets:srcs.length};
}

/* 실험실을 손으로 움직여 본다(책장이 넘어가면 안 된다) */
async function labs(browser,port,w,h){
  const {ctx,page,log}=await newPage(browser,w,h,false);
  await page.goto(`http://127.0.0.1:${port}/number_magic/promo/?lang=ko#calcA`,{waitUntil:'load'});
  await page.waitForFunction(()=>NM_PROMO.isOpen);await waitIdle(page);
  const v0=await page.evaluate(()=>NM_PROMO.view);
  const read=()=>page.locator('#readTan').innerText();
  const before=await read();
  const cv=await page.locator('#cvTan').boundingBox();
  // Q 는 오른쪽 위, P 는 가운데 — 오른쪽에서 왼쪽 끝까지 끌면 h = 0(접선)
  await page.mouse.move(cv.x+cv.width*.75,cv.y+cv.height*.4);await page.mouse.down();
  for(let k=1;k<=10;k++)await page.mouse.move(cv.x+cv.width*(.75-k*.06),cv.y+cv.height*.5);
  await page.mouse.move(cv.x+cv.width*.1,cv.y+cv.height*.5);await page.mouse.up();
  await page.waitForTimeout(80);
  const after=await read();
  assert.notEqual(after,before,'미분 실험실: 끌어도 값이 그대로');
  assert.match(after,/2/,'미분 실험실: 끝까지 끌면 기울기 2(접선)가 나와야 한다');
  assert.equal(await page.evaluate(()=>NM_PROMO.view),v0,'실험실 안에서 끌었는데 책장이 넘어감');
  assert.equal(await page.locator('.leaf-host .seg').count(),0);
  // 적분: 단추와 슬라이더
  const mode=await page.evaluate(()=>NM_PROMO.mode);
  if(mode==='single'){await page.evaluate(()=>NM_PROMO.next());await waitIdle(page)}
  const a0=await page.locator('#readArea').innerText();
  await page.locator('#areaMore').click();await page.locator('#areaMore').click();
  const a1=await page.locator('#readArea').innerText();
  assert.notEqual(a1,a0,'적분 실험실: 더 잘게 눌러도 그대로');
  await page.locator('#rgArea').fill('80');
  assert.match(await page.locator('#readArea').innerText(),/∫/,'적분 실험실: 80개면 참값에 거의 닿아야 한다');
  // 무지개: 1과 10을 짝지으면 무지개가 하나 생긴다
  await page.evaluate(()=>NM_PROMO.goPage('rainbow'));await waitIdle(page);
  const arcs=()=>page.locator('#rbArcs path:not([stroke-dasharray])').count();
  assert.equal(await arcs(),0);
  await page.locator('.rb-cell[data-v="1"]').click();await page.locator('.rb-cell[data-v="10"]').click();
  assert.equal(await arcs(),1,'무지개 실험실: 1과 10을 눌러도 무지개가 없음');
  assert.match(await page.locator('#rbRead').innerText(),/1 \+ 10 = 11/);
  await page.locator('.rb-cell[data-v="2"]').click();await page.locator('.rb-cell[data-v="3"]').click();
  assert.equal(await arcs(),1,'틀린 짝(2+3)은 무지개가 되면 안 됨');
  for(const [x,y] of [[2,9],[3,8],[4,7],[5,6]]){await page.locator(`.rb-cell[data-v="${x}"]`).click();await page.locator(`.rb-cell[data-v="${y}"]`).click()}
  assert.match(await page.locator('#rbRead').innerText(),/55/,'1~10 을 다 짝지으면 55');
  await page.locator('.rb-picks .chip[data-n="100"]').click();
  await page.locator('#rbBig').click();
  await page.waitForFunction(()=>/5050/.test(document.querySelector('#rbRead').textContent),null,{timeout:8000});
  assert.equal(await arcs(),50);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),await page.evaluate(()=>NM_PROMO.view));
  // 기호 카드 뒤집기 · 8+7 펼치기 · 학습지 넘기기
  await page.evaluate(()=>NM_PROMO.goPage('symbols'));await waitIdle(page);
  await page.locator('.symcard').first().click();
  assert.equal(await page.locator('.symcard').first().getAttribute('aria-pressed'),'true');
  await page.evaluate(()=>NM_PROMO.goPage('philosophy'));await waitIdle(page);
  await page.locator('#unfoldBtn').click();await page.locator('#unfoldBtn').click();await page.locator('#unfoldBtn').click();
  assert.equal((await page.locator('#unfoldEq').innerText()).trim(),'15');
  await page.evaluate(()=>NM_PROMO.goPage('sheet'));await waitIdle(page);
  await page.locator('#sheetNext').click();await page.waitForTimeout(300);
  assert.match(await page.locator('#sheetImg').getAttribute('src'),/page-2\.webp$/);
  await page.locator('#sheetOpen').click();assert.equal(await page.locator('#zoom').isVisible(),true);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#zoom').isHidden(),true);
  assert.deepEqual(log.errors,[]);assert.deepEqual(log.bad,[]);
  await ctx.close();
  return {viewport:`${w}x${h}`,tangent:after,area:true,rainbow:true};
}

/* 넘기는 종이: 버튼·키보드·끌기 */
async function turning(browser,port,w,h){
  const {ctx,page,log}=await newPage(browser,w,h,false);
  await page.goto(`http://127.0.0.1:${port}/number_magic/promo/?lang=ko`,{waitUntil:'load'});
  await page.locator('#openBook').click({force:true});
  assert.equal(await page.locator('#bookEl').evaluate(el=>el.classList.contains('is-open')),true,'표지를 눌렀는데 열리지 않음');
  await page.waitForFunction(()=>NM_PROMO.isOpen&&!NM_PROMO.busy,null,{timeout:30000});
  const single=w<=700,N=single?8:10;
  await page.locator('#btnNext').click();
  const segs=await page.locator('.leaf-host .seg').count();
  assert.equal(segs,N,`넘기는 종이가 ${N}개의 띠로 휘어야 한다 (지금 ${segs})`);
  const faces=await page.locator('.leaf-host .face .pg.is-clone').count();
  assert(faces>=N,'종이 앞면에 쪽 내용이 실려야 한다');
  // 느린 소프트웨어 렌더러에서도 되도록 시간 대신 '넘기는 동안 한 번이라도 휘었는가'를 본다
  let bent=0,shotTaken=false;
  while(await page.evaluate(()=>NM_PROMO.busy)){
    const b2=await page.evaluate(()=>{const s=[...document.querySelectorAll('.leaf-host .seg')].map(e=>e.style.transform);return new Set(s).size});
    if(b2>bent)bent=b2;
    if(OUT&&!shotTaken&&b2>4){await page.screenshot({path:path.join(OUT,`turn-${w}x${h}-mid.png`)});shotTaken=true}
    await page.waitForTimeout(60);
  }
  assert(bent>2,'띠마다 각도가 달라야(종이가 휘어야) 한다');
  await waitIdle(page);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),1);
  assert.equal(await page.locator('.leaf-host .seg').count(),0);
  await page.keyboard.press('ArrowRight');await waitIdle(page);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),2,'→ 키로 넘어가야 한다');
  await page.keyboard.press('ArrowLeft');await waitIdle(page);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),1,'← 키로 돌아가야 한다');
  // 끌어서 넘기기: 오른쪽 아래 모서리에서 왼쪽으로
  const b=await page.locator('#bookEl').boundingBox();
  const sx=b.x+b.width-24,sy=b.y+b.height-80;
  await page.mouse.move(sx,sy);await page.mouse.down();
  for(let k=1;k<=12;k++)await page.mouse.move(sx-k*(b.width*.9/12),sy-6);
  assert(await page.locator('.leaf-host .seg').count()>0,'끄는 동안 종이가 들려야 한다');
  if(OUT)await page.screenshot({path:path.join(OUT,`drag-${w}x${h}.png`)});
  await page.mouse.up();await waitIdle(page);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),2,'끌어서 넘기기가 안 됨');
  // 조금만 끌다 놓으면 제자리로
  await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(sx-20,sy);await page.waitForTimeout(200);await page.mouse.move(sx-40,sy);await page.waitForTimeout(250);await page.mouse.move(sx-41,sy);await page.waitForTimeout(250);await page.mouse.up();await waitIdle(page);
  assert.equal(await page.evaluate(()=>NM_PROMO.view),2,'살짝 끌다 놓으면 넘어가면 안 됨');
  // 차례에서 바로 가기
  await page.evaluate(()=>NM_PROMO.go(0));await waitIdle(page);
  await page.locator('#tocList button[data-go="rainbow"]').click();await waitIdle(page);
  assert(await page.locator('.slot [data-page="rainbow"]').count()===1,'차례의 제목을 누르면 그 쪽이 펼쳐져야 한다');
  // 언어 바꾸기
  await page.locator('.lang button[data-lang="zh"]').click();
  assert.equal(await page.evaluate(()=>document.documentElement.lang),'zh-Hans');
  assert.match(new URL(page.url()).search,/lang=zh/);
  // 책 덮기
  await page.locator('#btnClose').click();
  await page.waitForFunction(()=>!NM_PROMO.isOpen,null,{timeout:30000});
  assert.equal(await page.locator('#bookEl').evaluate(el=>el.classList.contains('is-closed')),true);
  assert.deepEqual(log.errors,[]);assert.deepEqual(log.bad,[]);
  await ctx.close();
  return {viewport:`${w}x${h}`,segments:segs,bentAngles:bent,drag:true,keyboard:true};
}
async function reducedMotion(browser,port){
  const {ctx,page,log}=await newPage(browser,1280,720,true);
  await page.goto(`http://127.0.0.1:${port}/number_magic/promo/?lang=en`,{waitUntil:'load'});
  await page.locator('#openBook').click({force:true});
  assert.equal(await page.evaluate(()=>NM_PROMO.isOpen&&!NM_PROMO.busy),true,'움직임 줄이기: 표지가 즉시 열려야 한다');
  await page.evaluate(()=>NM_PROMO.next());
  assert.equal(await page.evaluate(()=>[NM_PROMO.view,NM_PROMO.busy,document.querySelectorAll('.leaf-host .seg').length].join()),'1,false,0','움직임 줄이기: 넘김이 즉시여야 한다');
  assert.deepEqual(log.errors,[]);
  await ctx.close();
  return {instant:true};
}

(async()=>{
  const st=staticChecks();
  if(OUT)fs.mkdirSync(OUT,{recursive:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const port=server.address().port;let browser;
  try{
    browser=await chromium.launch({executablePath:process.env.NM_CHROMIUM,headless:true,args:ARGS});
    const results={static:st,sweep:[],labs:[],turn:[]};
    for(const lang of LANGS)for(const [w,h] of (QUICK?[[1280,720],[390,844]]:VIEWPORTS))results.sweep.push(await sweep(browser,port,w,h,lang));
    results.labs.push(await labs(browser,port,1280,720));
    results.labs.push(await labs(browser,port,390,844));
    results.turn.push(await turning(browser,port,1440,900));
    results.turn.push(await turning(browser,port,390,844));
    results.reduced=await reducedMotion(browser,port);
    console.log(JSON.stringify({ok:true,...results},null,1));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e&&e.message||e);process.exitCode=1});
