'use strict';
// Local-only camera regression. A fake learner is used and all network writes are blocked.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_TOWN_ARTIFACTS;
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
function near(a,b,tolerance=1){return Math.abs(a-b)<=tolerance;}
function worldDistance(a,b){return Math.hypot((a.wx-b.wx)*20,(a.wy-b.wy)*13.42);}

(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
  try{
    if(out)fs.mkdirSync(out,{recursive:true});
    const cases=[[390,844,false],[1280,800,false],[844,390,true],[390,667,true]];
    for(const [width,height,reduced]of cases.filter(x=>!process.env.NM_TOWN_WIDTH||x[0]===Number(process.env.NM_TOWN_WIDTH))){
      const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
      const page=await context.newPage(),errors=[],writes=[];
      page.on('pageerror',error=>errors.push(error.message));
      await context.route('**/*',route=>{
        const request=route.request();
        if(request.url().startsWith(base+'/')&&request.method()==='GET')return route.continue();
        if(request.method()!=='GET')writes.push(request.url());
        return route.abort();
      });
      await context.route('**/app/entry.js?*',route=>route.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
      await context.addInitScript(()=>{
        if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify({
          lang:'ko',onboarded:true,name:'Follow fixture',view:'town',avatar:{kind:'boy',name:'Map kid'},
          character:{number:3,color:'gold'},coins:777,progress:{'N-01':{done:true}},r0BannerSeen:true,
          attend:{last:new Date(Date.now()+9*3600000).toISOString().slice(0,10),days:1},account:{status:'active'}
        }));
      });
      await page.goto(base+'/number_magic/index.html?enter=1');
      if(!await page.locator('#townVp').count())await page.locator('#ttGame:visible,.t3d-btn[data-id="game"]').first().click();
      await page.waitForSelector('#townVp.is-illustrated');
      await page.waitForTimeout(120);
      const snapshot=()=>page.evaluate(()=>{
        const vp=document.querySelector('#townVp').getBoundingClientRect(),world=document.querySelector('#townWorld'),map=world.getBoundingClientRect();
        const player=document.querySelector('#nbNumi'),matrix=new DOMMatrixReadOnly(getComputedStyle(world).transform),pm=new DOMMatrixReadOnly(getComputedStyle(player).transform);
        const wx=parseFloat(player.style.left),wy=parseFloat(player.style.top);
        return{wx,wy,x:map.x+wx/100*map.width,y:map.y+wy/100*map.height,
          scale:matrix.a,camX:matrix.e,camY:matrix.f,rotation:Math.abs(pm.b)+Math.abs(pm.c),facing:player.querySelector('.nm-walker')?.dataset.dir,
          walking:!!player.querySelector('.walking'),follow:document.querySelector('#townMe').getAttribute('aria-pressed'),
          vp:{x:vp.x,y:vp.y,width:vp.width,height:vp.height,right:vp.right,bottom:vp.bottom},
          covered:map.x<=vp.x+1&&map.y<=vp.y+1&&map.right>=vp.right-1&&map.bottom>=vp.bottom-1};
      });
      const learner=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return{coins:s.coins,progress:s.progress,avatar:s.avatar,character:s.character};});
      const openTools=async()=>{
        if(await page.locator('.nm-town-toolbox').getAttribute('open')===null)await page.locator('.nm-town-toolbox > summary').click();
        if(await page.locator('.nm-town-more').getAttribute('open')===null)await page.locator('.nm-town-more > summary').click();
      };
      const closeTools=()=>page.evaluate(()=>document.querySelectorAll('.nm-town-toolbox,.nm-town-more').forEach(e=>e.open=false));
      // Choose an uncovered background pixel, keeping its world location before the camera moves.
      const choose=async(far=true)=>page.evaluate(far=>{
        const vp=document.querySelector('#townVp').getBoundingClientRect(),map=document.querySelector('#townWorld').getBoundingClientRect(),e=document.querySelector('#nbNumi');
        const x=map.x+parseFloat(e.style.left)/100*map.width,y=map.y+parseFloat(e.style.top)/100*map.height;
        const horizontal=map.width-vp.width>=map.height-vp.height;
        const candidates=[];
        for(let fy=.16;fy<=.90;fy+=.074)for(let fx=.08;fx<=.93;fx+=.071){
          const px=vp.x+fx*vp.width,py=vp.y+fy*vp.height,hit=document.elementFromPoint(px,py);
          if(!hit?.closest('#townVp')||hit.closest('button,a,.nb'))continue;
          const d=Math.hypot(px-x,py-y),axis=horizontal?Math.abs(px-x):Math.abs(py-y);
          if(d<55)continue;
          candidates.push({x:px,y:py,wx:(px-map.x)/map.width*100,wy:(py-map.y)/map.height*100,score:far?axis+d*.12:-d});
        }
        candidates.sort((a,b)=>b.score-a.score);
        if(!candidates.length)throw Error('No empty map point available');
        return candidates[0];
      },far);
      const waitStopped=async()=>{
        await page.waitForFunction(()=>!document.querySelector('#nbNumi .walking'),null,{timeout:15000});
        await page.waitForTimeout(reduced?160:650);
      };
      const walkTo=async(target)=>{
        const start=await snapshot();
        await page.mouse.click(target.x,target.y);
        await page.waitForFunction(()=>!!document.querySelector('#nbNumi .walking'),null,{timeout:2000});
        const frames=await page.evaluate(()=>new Promise(resolve=>{
          const frames=[],started=performance.now();let stopped=0;
          function next(t){
            const vp=document.querySelector('#townVp').getBoundingClientRect(),world=document.querySelector('#townWorld'),map=world.getBoundingClientRect(),e=document.querySelector('#nbNumi');
            const matrix=new DOMMatrixReadOnly(getComputedStyle(world).transform),pm=new DOMMatrixReadOnly(getComputedStyle(e).transform),walking=!!e.querySelector('.walking');
            frames.push({t,x:parseFloat(e.style.left),y:parseFloat(e.style.top),scale:matrix.a,camX:matrix.e,camY:matrix.f,
              facing:e.querySelector('.nm-walker')?.dataset.dir,rotation:Math.abs(pm.b)+Math.abs(pm.c),
              covered:map.x<=vp.x+1&&map.y<=vp.y+1&&map.right>=vp.right-1&&map.bottom>=vp.bottom-1});
            stopped=walking?0:stopped+1;
            if(stopped>=45||t-started>15000)resolve(frames);else requestAnimationFrame(next);
          }
          requestAnimationFrame(next);
        }));
        await waitStopped();
        const end=await snapshot();
        assert(worldDistance(end,target)<2,'tap reaches the original world point even while the camera moves');
        assert(frames.every(f=>f.covered),'follow never exposes a blank map edge');
        assert(frames.every(f=>near(f.scale,start.scale,.00001)),'walking never forces a zoom');
        assert(frames.every(f=>f.rotation<.00001&&f.facing==='s'),'characters translate without spinning or flipping');
        assert(frames.every((f,i)=>!i||Math.hypot((f.x-frames[i-1].x)*20,(f.y-frames[i-1].y)*13.42)<=220*Math.min(.05,(f.t-frames[i-1].t)/1000)+2),'walking remains smooth at the measured frame interval');
        return{start,end,frames};
      };

      const before=await learner(),initial=await snapshot();
      assert(near(initial.scale,Math.max(initial.vp.width/2000,initial.vp.height/1342),.00001),'initial view uses cover scale, without forced 1.7x zoom');
      assert(initial.covered,'initial map covers the viewport');
      assert.equal(await page.locator('.nm-town3d,.t3d-joystick,#townVp canvas').count(),0,'the active village stays in 2D');
      assert.equal(await page.locator('.nm-town-illustrated[data-character-mode="2d"]').count(),1,'the village declares its 2D character mode');
      assert.equal(await page.locator('#nbNumi svg,#nbNumi img').count()>0,true,'human avatar remains a 2D sprite');
      assert.equal(await page.locator('#nbBuddy svg,#nbBuddy img').count()>0,true,'number buddy uses the same 2D rendering');
      assert((await page.locator('#townWorld').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('assets/map.jpg'),'approved painted map is retained');
      await closeTools();
      const first=await walkTo(await choose());
      assert.equal(first.end.follow,'true','a walking tap enables follow');
      assert(Math.hypot(first.end.camX-first.start.camX,first.end.camY-first.start.camY)>3,'map moves with the walking player');

      // Manual panning leaves the player in place and suspends camera follow until a new command.
      const dragAt=await choose(false),preDrag=await snapshot();
      const horizontal=2000*preDrag.scale-preDrag.vp.width>=1342*preDrag.scale-preDrag.vp.height;
      let delta=horizontal?{x:-65,y:0}:{x:0,y:-55};
      const extent=horizontal?preDrag.vp.width-2000*preDrag.scale:preDrag.vp.height-1342*preDrag.scale;
      const value=horizontal?preDrag.camX:preDrag.camY;
      if(value<(extent/2))delta=horizontal?{x:65,y:0}:{x:0,y:55};
      await page.mouse.move(dragAt.x,dragAt.y);await page.mouse.down();
      await page.mouse.move(dragAt.x+delta.x,dragAt.y+delta.y,{steps:8});await page.mouse.up();
      await page.waitForTimeout(150);const dragged=await snapshot();await page.waitForTimeout(500);const idle=await snapshot();
      assert(worldDistance(preDrag,dragged)<.05,'dragging the map is not a walk');
      assert.equal(dragged.follow,'false','manual drag pauses follow');
      assert(Math.hypot(dragged.camX-preDrag.camX,dragged.camY-preDrag.camY)>5,'manual pan still changes camera position');
      assert(near(dragged.camX,idle.camX,.1)&&near(dragged.camY,idle.camY,.1),'camera does not fight manual panning');
      const resumed=await walkTo(await choose());assert.equal(resumed.end.follow,'true','the next walk restores follow');

      // Wheel/pinch remain inspection gestures and do not create a walk or later snap back.
      const preZoom=await snapshot(),zoomX=preZoom.vp.x+preZoom.vp.width/2,zoomY=preZoom.vp.y+preZoom.vp.height/2;
      await page.locator('#townVp').dispatchEvent('wheel',{deltaY:-100,clientX:zoomX,clientY:zoomY});
      await page.waitForTimeout(100);const zoomed=await snapshot();await page.waitForTimeout(350);const zoomIdle=await snapshot();
      assert(zoomed.scale>preZoom.scale,'manual zoom still works');assert.equal(zoomed.follow,'false','manual zoom pauses follow');
      assert(worldDistance(zoomed,preZoom)<.05,'zooming does not move the player');
      assert(near(zoomed.camX,zoomIdle.camX,.1)&&near(zoomed.camY,zoomIdle.camY,.1),'follow does not fight manual zoom');
      if(width===390&&!reduced){
        const at=await choose(false),cdp=await context.newCDPSession(page),prePinch=await snapshot();
        await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:at.x-15,y:at.y,id:1},{x:at.x+15,y:at.y,id:2}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:at.x-23,y:at.y,id:1},{x:at.x+23,y:at.y,id:2}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:at.x-28,y:at.y,id:1},{x:at.x+28,y:at.y,id:2}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(150);
        const pinched=await snapshot();assert(worldDistance(pinched,prePinch)<.05,'pinch never walks');assert.equal(pinched.follow,'false');
        await cdp.detach();
      }

      // Direction keys deliberately use key repeat rather than a separate joystick/velocity system.
      await closeTools();await page.locator('#townVp').focus();
      const keyStart=await snapshot(),key=horizontal?(keyStart.wx>55?'ArrowLeft':'ArrowRight'):(keyStart.wy>55?'ArrowUp':'ArrowDown');
      for(let i=0;i<7;i++)await page.keyboard.press(key);
      await page.waitForFunction(()=>!!document.querySelector('#nbNumi .walking'),null,{timeout:2000});
      await waitStopped();const keyed=await snapshot();
      assert(worldDistance(keyed,keyStart)>60,'direction keys move the player');assert.equal(keyed.follow,'true','direction keys resume follow');
      assert(near(keyed.scale,keyStart.scale,.00001),'keyboard navigation preserves zoom');
      assert(keyed.covered,'keyboard camera stays clamped to the map');
      assert(Math.hypot(keyed.camX-keyStart.camX,keyed.camY-keyStart.camY)>3,'keyboard walking also moves the map: '+JSON.stringify({key,keyStart,keyed}));

      await openTools();const preButton=await snapshot();await page.locator('#townZin').focus();await page.keyboard.press(key);await page.waitForTimeout(100);
      assert(worldDistance(await snapshot(),preButton)<.05,'direction keys on a control do not walk');
      await page.locator('#townMe').click();await page.waitForTimeout(reduced?150:750);const located=await snapshot();
      assert.equal(located.follow,'true','My Location restores follow');assert(near(located.scale,preButton.scale,.00001),'My Location does not change scale');
      await closeTools();

      const resizeAt=await snapshot();await page.locator('#townVp').dispatchEvent('wheel',{deltaY:-100,clientX:resizeAt.vp.x+resizeAt.vp.width/2,clientY:resizeAt.vp.y+resizeAt.vp.height/2});
      const preResize=await snapshot();assert.equal(preResize.follow,'false');
      await page.setViewportSize({width:width+37,height:height+21});await page.waitForTimeout(450);const resized=await snapshot();
      assert(worldDistance(resized,preResize)<.05,'resizing preserves player world coordinates');assert(resized.covered,'resizing preserves cover/clamp');
      assert(resized.scale>=preResize.scale-.00001,'resizing never resets an explicit zoom');
      assert.equal(resized.follow,'false','resize leaves a manually inspected map in manual mode');

      // Keep detached references to make leaked RAF movement observable after leaving the village.
      const departure=await choose(false);await page.mouse.click(departure.x,departure.y);await page.waitForTimeout(60);
      await page.evaluate(()=>{window.__oldTown={world:document.querySelector('#townWorld'),player:document.querySelector('#nbNumi')};});
      await openTools();await page.locator('[data-place="beginner"]').click();await page.waitForSelector('#backTown');
      const detached=()=>page.evaluate(()=>({map:window.__oldTown.world.style.transform,left:window.__oldTown.player.style.left,top:window.__oldTown.player.style.top}));
      const old=await detached();await page.waitForTimeout(350);assert.deepEqual(await detached(),old,'leaving cancels player and camera animation');
      await page.keyboard.press(key);assert.deepEqual(await detached(),old,'keyboard listener is removed after leaving');
      await page.locator('#backTown').click();await page.waitForSelector('#townVp.is-illustrated');await page.waitForTimeout(100);
      assert((await snapshot()).covered,'reentering creates a clean camera');
      assert.deepEqual(await learner(),before,'camera interactions preserve coins, purchases, characters and learning progress');
      assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
      if(out)await page.screenshot({path:path.join(out,`follow-${width}-${height}-${reduced?'reduced':'normal'}.png`)});
      report.push({width,height,reduced,initialCover:true,tapFollow:true,manualPanPauses:true,nextWalkResumes:true,zoomPreserved:true,keyboardFollow:true,resize:true,cleanup:true,learnerPreserved:true,externalWrites:0});
      await context.close();
    }
    if(out)fs.writeFileSync(path.join(out,'town-follow.json'),JSON.stringify(report,null,2));
    console.log('TOWN_FOLLOW_OK '+JSON.stringify(report));
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
