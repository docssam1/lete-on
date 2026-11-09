'use strict';
// N-07 개구리 뛰기 — 누르기·끌기(2026-11-09). 실제 앱에서 마우스와 손가락(CDP 터치)으로
//  ① 무대를 누르면 한 칸 ② 개구리를 끌면 눈금을 넘을 때마다 한 칸 ③ 반대쪽으로 끌면 움직이지 않음
//  ④ 끈 뒤 손을 떼도 한 칸이 더 생기지 않음 ⑤ 손가락으로 끌 때 화면이 옆으로 밀리지 않음 ⑥ 페이지 오류 0
// 쓰는 법: node number_magic/scripts/check-hop-drag-browser.js   (NM_HOP_ARTIFACTS=폴더 → 캡처)
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const out=process.env.NM_HOP_ARTIFACTS;
(async()=>{
 const {server,base}=await serve();const browser=await chromium.launch();
 try{
  if(out)fs.mkdirSync(out,{recursive:true});
  for(const [width,touch] of [[390,false],[390,true],[1280,false]]){
   const ctx=await browser.newContext({viewport:{width,height:844},hasTouch:touch,reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await ctx.route(u=>!u.href.startsWith(base)&&!/^(data|blob):/.test(u.href),r=>r.abort());
   await ctx.addInitScript(()=>localStorage.setItem('nm_preview_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'검수',view:'unit',unit:'N-07',step:'discover',avatar:{kind:'boy'},placement:{course:'C0',self:true},account:{status:'active'},r0BannerSeen:true,symbolDex:{'+':{},'-':{},'−':{},'=':{},'□':{}},progress:{'N-07':{introSeen:true,steps:{}}}})));
   await require('./lib/preview-fixture')(page);
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click({timeout:30000});
   await page.evaluate(()=>__NM_AUDIT_OPEN('N-07'));
   await page.waitForSelector('.nm-hop-stage svg');
   for(let i=0;i<60;i++){const c=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(!await c.count())break;await c.last().click();}
   const host=page.locator('.nm-hop-lesson'),state=()=>host.evaluate(e=>e.__livingLesson.getState());
   await page.locator('.nm-hop-stage').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(150);
   const tick=n=>page.locator(`.nm-hop-stage [data-tick="${n}"]`).evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y};});
   const frog=()=>page.locator('.nm-hop-frog .nm-hop-grip').evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
   const cdp=touch?await ctx.newCDPSession(page):null;
   const drag=async(a,b)=>{
    if(touch){const pt=(p)=>[{x:p.x,y:p.y}];await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:pt(a)});for(let k=1;k<=10;k++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:pt({x:a.x+(b.x-a.x)*k/10,y:a.y+(b.y-a.y)*k/10})});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
    else{await page.mouse.move(a.x,a.y);await page.mouse.down();for(let k=1;k<=10;k++)await page.mouse.move(a.x+(b.x-a.x)*k/10,a.y+(b.y-a.y)*k/10);await page.mouse.up();}
    await page.waitForTimeout(120);};
   let v=await state();assert.equal(v.pos,0);
   // ① 누르기
   if(touch)await page.locator('.nm-hop-stage').tap({position:{x:20,y:20}});else await page.locator('.nm-hop-stage').click({position:{x:20,y:20}});
   await page.waitForTimeout(150);v=await state();assert.equal(v.pos,1,'a tap hops once');
   // ③ 뒤로 끌기 — 첫 주사위 동안은 앞으로만
   const sx=await page.evaluate(()=>scrollX),sy=await page.evaluate(()=>document.querySelector('#screen')?.scrollTop||0);
   await drag(await frog(),await tick(0));v=await state();assert.equal(v.pos,1,'dragging the wrong way does not move the frog');
   // ② 앞으로 끌기 — 남은 첫 주사위 칸을 끝까지
   const target=v.input[0];await drag(await frog(),await tick(Math.min(10,target+3)));v=await state();
   assert.equal(v.pos,target,'dragging stops at the end of the first die: '+v.pos);assert.equal(v.hops.length,target);
   // 둘째 주사위 — 기호 방향으로 끝까지
   const [a,op,c]=v.input,end=op==='+'?a+c:a-c;
   await drag(await frog(),await tick(Math.max(0,Math.min(10,op==='+'?end+2:end-2))));v=await state();
   assert.equal(v.pos,end,'second die follows the sign');assert(v.complete,'complete after dragging');assert.equal(v.hops.length,a+c,'each crossed tick is one hop, no extra hop on release');
   if(touch){assert.equal(await page.evaluate(()=>scrollX),sx,'no sideways page scroll');}
   if(out)await page.screenshot({path:path.join(out,`N-07-${width}${touch?'-touch':''}.png`)});
   await page.locator('[data-act="undo"]').click();v=await state();assert.equal(v.complete,false);assert.equal(v.hops.length,a+c-1,'undo takes back one hop');
   // − 회차: 둘째 주사위는 뒤로 끌어야 한다
   for(let r=0;r<4&&(await state()).input[1]!=='−'&&(await state()).input[1]!=='-';r++)await page.locator('[data-act="next"]').click();
   v=await state();await page.locator('.nm-hop-stage').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(150);
   if(v.input[1]!=='+'){const [a2,,c2]=v.input;await drag(await frog(),await tick(Math.min(10,a2+2)));v=await state();assert.equal(v.pos,a2);
    await drag(await frog(),await tick(10));assert.equal((await state()).pos,a2,'minus die does not go forward');
    await drag(await frog(),await tick(0));v=await state();assert.equal(v.pos,a2-c2);assert(v.complete);console.log('  minus round',`${a2}−${c2}=${a2-c2}`);}
   assert.deepEqual(errors,[]);console.log('ok N-07',width,touch?'touch':'mouse',`${a}${op}${c}=${end}`);await ctx.close();
  }
  console.log('N-07 hop tap/drag: all checks passed');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
