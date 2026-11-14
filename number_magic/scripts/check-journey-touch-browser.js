'use strict';
// 마법 노트 M-02(수직선 걷기)·T-DV4(배수 만나기) — 그림을 누르고 끌어서 하기(2026-11-09). 실제 앱·WebGL(swiftshader)에서
//  M-02 ① 틀린 눈금을 누르면 출발하지 않고 도움말 ② 맞는 눈금을 누르면 거기 선다 ③ 사람을 끌면 넘은 눈금만큼 걷는다
//       ④ 걷는 쪽 반대로 끌면 걷지 않는다 ⑤ 화면을 누르면 한 칸 (마우스·손가락 모두)
//  T-DV4 ⑥ 줄을 누르면 그 줄만 한 번 더 간다 ⑦ 두 줄이 처음 같이 선 점을 누르면 「처음 만남」이 된다 ⑧ 페이지 오류 0
// 쓰는 법: node number_magic/scripts/check-journey-touch-browser.js   (NM_TOUCH_ARTIFACTS=폴더 → 캡처)
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const out=process.env.NM_TOUCH_ARTIFACTS;
const synthetic=uid=>({lang:'ko',onboarded:true,name:'교구 검수',view:'unit',unit:uid,step:'discover',sub:{},avatar:{kind:'boy'},character:{number:3,color:'gold'},placement:{course:'C29',self:true},symbolDex:{'+':{},'-':{},'−':{},'=':{},'□':{},'×':{}},progress:{[uid]:{introSeen:true,steps:{}}},coins:0,account:{status:'active'},r0BannerSeen:true});
(async()=>{
 const {server,base}=await serve();const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
 try{
  if(out)fs.mkdirSync(out,{recursive:true});
  for(const [uid,width,touch] of [['M-02',390,false],['M-02',390,true],['M-02',1280,false],['T-DV4',390,false],['T-DV4',390,true]]){
   const ctx=await browser.newContext({viewport:{width,height:900},hasTouch:touch,reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await ctx.route(u=>!u.href.startsWith(base)&&!/^(data|blob):/.test(u.href),r=>r.abort());
   await ctx.addInitScript(s=>localStorage.setItem('nm_preview_state_v1',JSON.stringify(s)),synthetic(uid));
   await require('./lib/preview-fixture')(page);
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.locator('[data-id="continue"]:visible,#ttContinue:visible').first().click({timeout:30000});
   await page.evaluate(uid=>__NM_AUDIT_OPEN(uid),uid);
   await page.waitForFunction(()=>document.querySelector('#livingLesson .nm-live-stage')?.dataset.renderer==='webgl',null,{timeout:60000});
   for(let i=0;i<60;i++){const c=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(!await c.count())break;await c.last().click();}
   const host=page.locator('#livingLesson'),view=()=>host.evaluate(e=>e.__livingLesson.getView()),vis=()=>host.evaluate(e=>e.__livingLesson.getVisualState());
   const saved=()=>page.waitForFunction(()=>document.querySelector('#livingLesson').dataset.saved==='true');
   const press=async(a,v)=>{await host.locator(`button[data-action="${a}"][data-value="${v}"]`).click();await saved();};
   const center=async()=>{await host.locator('.nm-live-stage').evaluate(e=>{const s=e.closest('#screen')||document.scrollingElement;s.scrollTop+=e.getBoundingClientRect().top-120;});await page.waitForTimeout(250);};
   const box=async()=>host.locator('.nm-live-stage canvas').boundingBox();
   const at=async(fx,fy)=>{const b=await box();return {x:b.x+b.width*fx,y:b.y+b.height*fy};};
   const label=async name=>{const r=await host.locator(`[data-object="${name}"]`).boundingBox();return r&&{x:r.x+r.width/2,y:r.y+r.height/2};};
   const cdp=touch?await ctx.newCDPSession(page):null;
   const tap=async p=>{if(touch){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else await page.mouse.click(p.x,p.y);await page.waitForTimeout(120);await saved();};
   const drag=async(a,b)=>{if(touch){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});for(let k=1;k<=10;k++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*k/10,y:a.y+(b.y-a.y)*k/10}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{await page.mouse.move(a.x,a.y);await page.mouse.down();for(let k=1;k<=10;k++)await page.mouse.move(a.x+(b.x-a.x)*k/10,a.y+(b.y-a.y)*k/10);await page.mouse.up();}await page.waitForTimeout(150);await saved();};
   if(uid==='M-02'){
    let v=await view();if(v.word)await press('model','+');
    await center();
    // 눈금 위치: 3D 라벨(tick-n)이 화면에 찍힌 곳 — 라벨 바로 위, 막대 쪽을 누른다
    const tickAt=async n=>{const camera=await vis();const q=camera;const l=await label('tick-'+n);if(l)return {x:l.x,y:l.y-22};const a=await label('tick-'+(n-1)),b=await label('tick-'+(n+1));return {x:(a.x+b.x)/2,y:(a.y+b.y)/2-22};};
    const wrong=v.a===0?1:0;await tap(await tickAt(wrong));v=await view();assert.equal(v.phase,0,'a wrong tick does not start');
    await tap(await tickAt(v.a));v=await view();assert.equal(v.phase,1,'tapping the starting tick starts there');assert.equal(v.position,v.a);
    await press('face',Math.sign(v.b));await press('walk',v.op==='+'?1:-1);await press('count',Math.abs(v.b));
    v=await view();const dir=v.face*v.walk,steps=Math.abs(v.b);
    await center();
    const person=async()=>{const s=(await vis()).person.position,b=await box(),st=await vis();/* project via labels: use tick label x for position, y slightly above line */const l=await tickAt(Math.round(s[0]));return {x:l.x,y:l.y-40};};
    // ④ 반대로 끌기
    const p0=await person(),back=await tickAt(Math.max(-8,Math.min(8,v.position-dir*2)));await drag(p0,{x:back.x,y:p0.y});v=await view();assert.equal(v.steps,0,'dragging against the walk does not move');
    if(steps>=2){
     // ③ 두 칸 끌기
     const p1=await person(),dest=await tickAt(v.position+dir*2);await drag(p1,{x:dest.x,y:p1.y});v=await view();assert.equal(v.steps,2,'dragging over two ticks walks two steps: '+v.steps);
    }
    // ⑤ 나머지는 화면 누르기로 한 칸씩
    for(let g=0;g<6&&(await view()).phase===4;g++){await tap(await at(.5,.15));if(!touch)await page.waitForTimeout(50);}
    v=await view();assert.equal(v.phase,5,'arrived');assert.equal(v.steps,steps);assert.equal(v.position,v.a+(v.op==='+'?v.b:-v.b));
    assert.equal(v.face,Math.sign(v.b),'facing kept');
   }else{
    let v=await view();if(v.word)await press('model',v.word);
    const gcd=(a,b)=>b?gcd(b,a%b):a,G=gcd(v.a,v.b),L=v.a*v.b/G;
    for(let k=1;k<=G;k++){await press('tryGroup',k);if(v.a%k===0&&v.b%k===0)await press('common',k);}await press('greatest',G);
    v=await view();assert.equal(v.phase,1);await center();
    // ⑥ 줄 누르기 — 0 라벨 오른쪽, 그 줄 높이
    const rowA=await label('zero-A'),rowB=await label('zero-B');assert(rowA&&rowB,'track rows are drawn');
    const b=await box(),xA=Math.min(b.x+b.width-8,rowA.x+b.width*.6);
    await tap({x:xA,y:rowA.y-14});v=await view();assert.deepEqual(v.trackA,[v.a],'tapping row A jumps A once');assert.deepEqual(v.trackB,[]);
    await tap({x:xA,y:rowB.y-14});v=await view();assert.deepEqual(v.trackB,[v.b],'tapping row B jumps B once');
    while(!(await view()).trackA.includes(L)||!(await view()).trackB.includes(L)){v=await view();const rowY=(!v.trackA.includes(L)&&(v.trackA.at(-1)||0)<=(v.trackB.at(-1)||0))?rowA.y:rowB.y;await tap({x:xA,y:rowY-14});}
    if(out)await page.screenshot({path:path.join(out,`${uid}-${width}${touch?'-touch':''}-tracks.png`)});
    // ⑦ 처음 만남 점 누르기 — 두 줄의 L 라벨 사이
    const la=await label(`track-A-${L}`),lb=await label(`track-B-${L}`);assert(la&&lb,'meeting dots are labelled');
    await tap({x:(la.x+lb.x)/2,y:la.y-14});v=await view();assert.equal(v.least,L,'tapping the first meeting picks it');
   }
   if(out)await page.screenshot({path:path.join(out,`${uid}-${width}${touch?'-touch':''}.png`)});
   assert.deepEqual(errors,[]);console.log('ok',uid,width,touch?'touch':'mouse');await ctx.close();
  }
  console.log('journey picture tap/drag: all checks passed');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exit(1);});
