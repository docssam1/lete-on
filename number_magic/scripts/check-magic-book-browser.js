#!/usr/bin/env node
'use strict';
/* 3D 마법책 시범 두 쪽(magic-book-3d.html) 검사 — 2026-10-27.
 * 덮인 책 → 「책 펼치기」 → 왼쪽 쪽을 마커 쥔 손이 써 감(누르면 바로 다 써짐, 휴대폰은 다 쓰면 그림 쪽으로) → 노란 구슬을 화면에서 직접 눌러 2개 옮기기 → 10 · 남은 5 · 도장 상태,
 * 날개 누르기, 글로 보기(예측·날개·구슬 단추가 3D 와 같은 상태를 바꾼다), 다시 하기,
 * 움직임 줄이기(즉시 펼쳐짐), 3D 를 못 여는 기기(nogl=1) 대체 화면, ko/en/zh · 390/1280, 가로 넘침·44px 단추.
 * 외부 요청은 막는다(제목 글꼴 Google Fonts 요청 실패만 허용). usage: node scripts/check-magic-book-browser.js */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_BOOK_ARTIFACTS||'';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css','.woff2':'font/woff2','.ttf':'font/ttf','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const report=[];
 if(OUT)fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const page=async(w,h,q,o={})=>{const ctx=await browser.newContext({viewport:{width:w,height:h},reducedMotion:o.reduced?'reduce':'no-preference'});const p=await ctx.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errors.push(m.text());});
   await ctx.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
   await p.goto(base+'/number_magic/magic-book-3d.html'+q,{waitUntil:'domcontentloaded',timeout:120000});return {ctx,p,errors};};
 const until=(p,fn,arg,ms=60000)=>p.waitForFunction(fn,arg,{timeout:ms,polling:200});
 try{
  for(const [w,h,lang] of [[1280,800,'ko'],[390,844,'ko'],[390,844,'en'],[390,844,'zh']]){
   const {ctx,p,errors}=await page(w,h,'?lang='+lang);
   await until(p,()=>window.NM_BOOK,null,120000);
   assert.equal(await p.evaluate(()=>NM_BOOK.state.open),false,'starts closed');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'no horizontal overflow');
   const small=await p.locator('#bar button:visible,#back').evaluateAll(xs=>xs.filter(x=>x.getBoundingClientRect().height<44).length);assert.equal(small,0,'44px controls');
   await p.click('#openBtn');
   // 왼쪽 쪽: 펼친 뒤 마커 쥔 손이 한 걸음씩 써 간다(소피 영어 스토리처럼). 휴대폰은 그동안 설명 쪽을 보여 준다.
   await until(p,()=>NM_BOOK.writing&&NM_BOOK._debug.step>=1,null,90000);
   assert.equal(await p.evaluate(()=>NM_BOOK._debug.hand),true,'hand image loaded');
   if(w<500)assert.equal(await p.evaluate(()=>NM_BOOK.state.view),'left','phone shows the page being written');
   await until(p,()=>NM_BOOK.state.open&&!document.getElementById('openBtn').classList.contains('primary')&&!NM_BOOK.busy,null,120000);
   const dbg=await p.evaluate(()=>NM_BOOK._debug);assert.equal(dbg.step,dbg.steps,'every step written');
   if(w<500){await until(p,()=>NM_BOOK.state.view==='right'&&!NM_BOOK.busy,null,10000);}
   // 노란 구슬을 화면에서 직접 두 번 누른다
   for(let n=1;n<=2;n++){const pt=await p.evaluate(()=>NM_BOOK._screenOf('bead'));await p.mouse.click(pt.x,pt.y);await until(p,k=>NM_BOOK.state.moved===k,n);await until(p,()=>!NM_BOOK.busy,null,90000);}
   await until(p,()=>/15/.test(document.getElementById('toast').textContent));   // 두 번째 구슬이 내려앉으면 「… 10 + 5 = 15」
   // 다 채운 뒤 또 누르면 「가득 찼어요」
   const pt3=await p.evaluate(()=>NM_BOOK._screenOf('bead'));if(pt3){await p.mouse.click(pt3.x,pt3.y);await sleep(600);}
   assert.equal(await p.evaluate(()=>NM_BOOK.state.moved),2,'never more than 2 moves');
   // 날개: 휴대폰은 설명 쪽으로 넘겨서 누른다
   if(w<500){await p.click('#pageLeft');await sleep(2500);}
   const fp=await p.evaluate(()=>NM_BOOK._screenOf('flap'));await p.mouse.click(fp.x,fp.y);await until(p,()=>NM_BOOK.state.flap===true);
   if(OUT)await p.screenshot({path:path.join(OUT,`book-${lang}-${w}.png`)});
   // 글로 보기: 같은 상태를 보여 주고, 예측을 바꾸면 3D 쪽도 바뀐다
   await p.click('#textBtn');await p.waitForSelector('#textView[open]');
   assert.match(await p.locator('#tvInner').innerText(),/15/);assert.equal(await p.locator('#tvMove').isDisabled(),true,'move button done after 2');
   await p.check('#tvChoice1');await until(p,()=>NM_BOOK.state.choice===1);
   await p.click('#tvClose');assert.equal(await p.locator('#textView[open]').count(),0);
   // 다시 하기
   await p.click('#resetBtn');await until(p,()=>{const s=NM_BOOK.state;return s.moved===0&&s.choice===null&&s.flap===false;});
   if(w>500){   // 빠르게 두 번: 날아가는 동안 누른 것도 이어서 날아간다
     const a1=await p.evaluate(()=>NM_BOOK._screenOf('bead'));await p.mouse.click(a1.x,a1.y);await sleep(150);await p.mouse.click(a1.x-60,a1.y);
     await until(p,()=>NM_BOOK.state.moved===2&&!NM_BOOK.busy,null,90000);}
   assert.deepEqual(errors,[]);report.push({width:w,lang,handWrites:true,beadTaps:2,flapTap:true,textView:true,reset:true,quickDoubleTap:w>500});await ctx.close();
  }
  // 쓰는 중에 쪽을 누르면 바로 다 써진다
  {const {ctx,p,errors}=await page(1280,800,'');await until(p,()=>window.NM_BOOK,null,120000);
   await p.click('#openBtn');await until(p,()=>NM_BOOK.writing&&NM_BOOK._debug.step>=1,null,90000);
   const before=await p.evaluate(()=>NM_BOOK._debug.step);const pg=await p.evaluate(()=>NM_BOOK._screenOf('page'));await p.mouse.click(pg.x,pg.y);
   await until(p,()=>!NM_BOOK.writing,null,3000);const d2=await p.evaluate(()=>NM_BOOK._debug);
   assert(before<d2.steps&&d2.step===d2.steps,'tap finishes the page');assert.equal(await p.evaluate(()=>NM_BOOK.state.choice),null,'skip tap is not a pick');
   assert.deepEqual(errors,[]);report.push({tapToFinish:true});await ctx.close();}
  // 움직임 줄이기: 펼치기가 바로 끝난다
  {const {ctx,p,errors}=await page(1280,800,'',{reduced:true});await until(p,()=>window.NM_BOOK,null,120000);
   await p.click('#openBtn');await until(p,()=>NM_BOOK.state.open,null,5000);
   assert.equal(await p.evaluate(()=>NM_BOOK.writing),false,'reduced motion: page already written');
   const dr=await p.evaluate(()=>NM_BOOK._debug);assert.equal(dr.step,dr.steps);
   await p.evaluate(()=>NM_BOOK.moveBead());assert.equal(await p.evaluate(()=>NM_BOOK.state.moved),1,'instant move');
   assert.equal(await p.locator('#motionBtn').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);report.push({reducedMotion:true});await ctx.close();}
  // 3D 를 못 여는 기기
  {const {ctx,p,errors}=await page(390,844,'?nogl=1');await p.waitForSelector('body.nogl');
   assert(await p.locator('#nogl').isVisible());await p.click('#noglText');await p.waitForSelector('#textView[open]');
   await p.click('#tvMove');await p.click('#tvMove');assert.match(await p.locator('#tvInner').innerText(),/15/,'text version works without 3D');
   assert.deepEqual(errors,[]);report.push({noWebGLFallback:true});await ctx.close();}
  console.log('MAGIC_BOOK_BROWSER_OK '+JSON.stringify(report));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
