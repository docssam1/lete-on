#!/usr/bin/env node
'use strict';
/* 실제 WebGL 마을 → 도감/수학 이야기 → 뒤로의 화면 상태와 해제를 검사한다.
   NM_NAV_ARTIFACTS로 캡처 위치를 지정한다. 제작용 API는 노출하지 않고 검사 서버에서만
   원래 mount 함수를 감싸 내부 컨트롤러를 관찰한다(3D 렌더·입력은 실제 구현 그대로). */
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..');
const OUT=process.env.NM_NAV_ARTIFACTS&&path.resolve(process.env.NM_NAV_ARTIFACTS);
if(OUT&&!/^[EG]:[\\/]/i.test(OUT))throw Error('Artifacts must be on E: or G:');
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');
  if(file.endsWith(path.join('town3d','town3d.js'))){
    const source=fs.readFileSync(file,'utf8').replace('export async function mountTown3D(container, opts)','async function realMountTown3D(container, opts)');
    return res.end(source+'\nexport async function mountTown3D(container,opts){const c=await realMountTown3D(container,opts);window.__navTowns=window.__navTowns||[];window.__navTowns.push(c);window.__navTown=c;return c;}');
  }
  fs.createReadStream(file).pipe(res);
});
async function checkViewport(browser,port,width){
  const ctx=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,hasTouch:width===390});
  const page=await ctx.newPage(),errors=[];
  const result={width};
  const shot=async name=>{if(OUT)await page.screenshot({path:path.join(OUT,`${width}-${name}.png`)});};
  page.on('pageerror',e=>errors.push(e.message));
  page.on('dialog',d=>d.accept());
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.addInitScript(()=>localStorage.setItem('nm_state_v1',JSON.stringify({lang:'ko',onboarded:true,name:'동선 검사',view:'town',avatar:{kind:'boy'},character:{number:3,color:'gold'},cloudLinked:false,progress:{},coins:0,account:{status:'active'},r0BannerSeen:true,attend:{last:new Date().toISOString().slice(0,10),days:1}})));
  const snap=()=>page.evaluate(()=>window.__navTown.snapshot());
  const waitTown=async count=>{
    await page.waitForSelector('#townVp.is-3d',{timeout:60000});
    await page.waitForFunction(n=>window.__navTowns.length===n&&window.__navTown.debug.renderer.info.render.frame>0,count);
    assert.equal(await page.locator('#townWorld').evaluate(e=>getComputedStyle(e).display),'none','완료된 3D 뒤에 옛 2D 지도를 표시하지 않음');
  };
  try{
    await page.goto(`http://127.0.0.1:${port}/number_magic/index.html?enter=1`,{waitUntil:'domcontentloaded'});
    await page.locator('.nm-title3d [data-id="game"]').click({timeout:60000});
    await waitTown(1);
    await page.locator('.t3d-lab[data-spot="numberland"]').focus();
    await page.waitForTimeout(350);
    assert.deepEqual((await snap()).selectedPlace,{kind:'spot',id:'numberland'},'explicit building selection is not overwritten by a nearby building');
    assert.equal((await snap()).selectedByUser,true);
    const gate=page.locator('.t3d-lab[data-gate]').first();
    if(await gate.count()){const id=await gate.getAttribute('data-gate');await gate.focus();await page.waitForTimeout(350);assert.deepEqual((await snap()).selectedPlace,{kind:'gate',id},'explicit gate selection is not overwritten by a nearby building');}
    await page.locator('.t3d-cv').focus();await page.keyboard.press('ArrowLeft');
    assert.equal((await snap()).selectedByUser,false,'intentional movement restores proximity guidance');
    result.explicitSelectionPreserved=true;
    if(width===390){
      result.reachability=await page.evaluate(()=>{
        const d=window.__navTown.debug,p=d.chars.find(c=>c.def.role==='player'),step=.9,queue=[[0,0]],seen=new Set(['0,0']),parent=new Map(),found={};
        const spots=Object.entries(d.world.spots);let head=0;
        const validEdge=(x,z,nx,nz)=>{const n=Math.ceil(Math.hypot(nx-x,nz-z)/.12);for(let i=1;i<=n;i++)if(!d.canMove(x+(nx-x)*i/n,z+(nz-z)*i/n,x+(nx-x)*(i-1)/n,z+(nz-z)*(i-1)/n))return false;return true;};
        while(head<queue.length&&Object.keys(found).length<spots.length){const [ix,iz]=queue[head++],x=p.x+ix*step,z=p.z+iz*step;
          for(const [id,s]of spots)if(!found[id]&&Math.hypot(x-s.center.x,z-s.center.z)<5.9)found[id]={x,z,cell:[ix,iz]};
          for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=ix+dx,nz=iz+dz,key=nx+','+nz,wx=p.x+nx*step,wz=p.z+nz*step;if(seen.has(key)||wx<-47||wx>47||wz<-64||wz>40)continue;seen.add(key);if(!validEdge(x,z,wx,wz))continue;parent.set(key,[ix,iz]);queue.push([nx,nz]);}
        }
        // Each discovered path has collision-free edges in both directions.
        for(const item of Object.values(found)){let cell=item.cell,count=0;while(cell[0]||cell[1]){const prev=parent.get(cell.join(','));if(!prev)throw Error('Broken reachable path');if(!validEdge(p.x+cell[0]*step,p.z+cell[1]*step,p.x+prev[0]*step,p.z+prev[1]*step))throw Error('Return path blocked');cell=prev;count++;}item.pathEdges=count;}
        return {terrainScale:d.scale,destinations:found,visitedCells:head};
      });
      assert.deepEqual(Object.keys(result.reachability.destinations).sort(),['numberland','beginner','intermediate','advanced','_theater','_closet'].sort(),'all six destinations have round-trip collision-free paths');
      const cdp=await ctx.newCDPSession(page),joy=await page.locator('.t3d-joystick').boundingBox(),cx=joy.x+joy.width/2,cy=joy.y+joy.height/2;
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx+38,y:cy,id:1}]});
      const owner=await page.evaluate(()=>window.__navTown.debug.movement().owner);assert.notEqual(owner,null);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx+38,y:cy,id:1},{x:cx-38,y:cy,id:2}]});
      assert.equal(await page.evaluate(()=>window.__navTown.debug.movement().owner),owner,'second finger cannot steal the joystick');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+180,y:cy,id:1},{x:cx-38,y:cy,id:2}]});
      assert.ok(await page.evaluate(()=>window.__navTown.debug.movement().vector.x>.9),'captured pointer keeps controlling outside the disc');
      await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
      assert.deepEqual(await page.evaluate(()=>window.__navTown.debug.movement()),{owner:null,vector:{x:0,z:0},keys:[]});
      await page.locator('.t3d-joystick').focus();await page.keyboard.down('ArrowRight');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.keyboard.up('ArrowRight');
      assert.deepEqual(await page.evaluate(()=>window.__navTown.debug.movement()),{owner:null,vector:{x:0,z:0},keys:[]});
      result.touch={secondPointerIgnored:true,outsideCapture:true,cancelStops:true,blurHandlerStops:true};
    }
    await page.locator('#townZin').click();await page.locator('#townZin').click();
    await page.locator('.t3d-cv').focus();await page.keyboard.press('ArrowLeft');
    result.before=await snap();await shot('map-before');
    await page.locator('#townDex').click();
    assert.equal(await page.evaluate(()=>window.__navTowns[0].debug.renderer.getContext().isContextLost()),true,'떠난 마을의 GPU 컨텍스트를 해제함');
    assert.equal(await page.locator('.t3d-cv').count(),0,'다른 화면에 마을 canvas를 남기지 않음');
    await page.locator('#dexBack').click();await waitTown(2);
    result.afterDex=await snap();
    for(const k of ['x','z','d'])assert.equal(result.afterDex.camera[k],result.before.camera[k],`도감 복귀 때 카메라 ${k} 유지`);
    for(const id of ['player','elder','doc']){
      const before=result.before.characters.find(c=>c.id===id),after=result.afterDex.characters.find(c=>c.id===id);
      assert.equal(after.x,before.x);assert.equal(after.z,before.z);
    }
    await shot('map-return');
    await page.locator('#roadEnter').click();
    const unit=page.locator('.nm-road-stone[data-uid="N-07"]');
    await unit.scrollIntoViewIfNeeded();
    await unit.evaluate(e=>e.addEventListener('click',()=>{window.__navRoadBefore={top:e.getBoundingClientRect().top,scrollTop:document.querySelector('.nm-road-wrap').scrollTop};},{capture:true,once:true}));
    await unit.click();await page.waitForSelector('.nm-unit-view');
    result.roadBefore=await page.evaluate(()=>window.__navRoadBefore);
    await shot('learning-n07');
    await page.locator('[data-step="practice"]').click();
    await page.locator('[data-step="discover"]').click();
    await page.locator('#backMap').click();
    result.roadAfter=await page.locator('.nm-road-wrap').evaluate(e=>({top:e.querySelector('[data-uid="N-07"]').getBoundingClientRect().top,scrollTop:e.scrollTop}));
    assert.ok(Math.abs(result.roadAfter.scrollTop-result.roadBefore.scrollTop)<=1,'학습한 유닛의 목록 위치로 돌아옴');
    assert.equal(await page.evaluate(()=>document.activeElement.dataset.uid),'N-07','뒤로 돌아온 유닛에 키보드 포커스 유지');
    await shot('learning-return-road');
    await page.locator('#roadBack').click();await waitTown(3);
    result.afterLearning=await snap();
    for(const k of ['x','z','d'])assert.equal(result.afterLearning.camera[k],result.before.camera[k],`학습 복귀 때 카메라 ${k} 유지`);
    result.horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert.equal(result.horizontalOverflow,false);assert.deepEqual(errors,[]);
    result.errors=errors;
    return result;
  }finally{await ctx.close();}
}
(async()=>{
  if(OUT)fs.mkdirSync(OUT,{recursive:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try{
    browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
    const results=[];
    for(const width of [390,1280])results.push(await checkViewport(browser,server.address().port,width));
    if(OUT)fs.writeFileSync(path.join(OUT,'town-navigation.json'),JSON.stringify(results,null,2));
    console.log('OK: 실제 3D 마을·학습 왕복 390/1280px — 위치·확대·목록·포커스 유지, GPU 해제, 오류·가로 넘침 없음');
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
