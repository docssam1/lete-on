'use strict';
// Local synthetic profiles only. External requests and non-GET requests are blocked.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const{chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_MENU_ARTIFACTS||'/tmp/nm-town-menu';
const mime={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
 fs.mkdirSync(out,{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
 try{
 for(const[width,height]of [[320,568],[390,844],[667,375],[1280,800]])for(const lang of ['ko','en','zh'])for(const textScale of [1,2]){
  if(width===1280&&textScale===2)continue;
  if(process.env.NM_MENU_CASE&&[width,height,lang,textScale].join('-')!==process.env.NM_MENU_CASE)continue;
  const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[],writes=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',route=>{const q=route.request();if(q.url().startsWith(base+'/')&&q.method()==='GET')return route.continue();if(q.method()!=='GET')writes.push(q.url());return route.abort();});
  await ctx.route('**/app/entry.js?*',r=>r.fulfill({contentType:'text/javascript',body:'window.NM_ENTRY={mode:"fixture"}'}));
  await ctx.addInitScript(lang=>{
   localStorage.setItem('nm_preview_state_v1',JSON.stringify({lang,onboarded:true,name:'Menu fixture',view:'town',avatar:{kind:'boy',name:'길잡이'},character:{number:3,color:'gold'},coins:777,progress:{'N-01':{done:true}},r0BannerSeen:true,attend:{last:new Date(Date.now()+9*3600000).toISOString().slice(0,10),days:1},account:{status:'active'}}));
   window.__menuObservers=[];const Original=window.ResizeObserver;
   window.ResizeObserver=class extends Original{
    constructor(callback){super(callback);this.targets=new Set();window.__menuObservers.push(this);}
    observe(el,options){this.targets.add(el);super.observe(el,options);}
    unobserve(el){this.targets.delete(el);super.unobserve(el);}
    disconnect(){this.targets.clear();super.disconnect();}
   };
  },lang);
  const enter=async()=>{
   if(!await page.locator('#townVp').count())await page.locator('#ttGame:visible,.t3d-btn[data-id="game"]').first().click();
   await page.waitForSelector('#townVp.is-illustrated');
  };
  const open=async()=>{
   if(await page.locator('.nm-town-toolbox').getAttribute('open')===null)await page.locator('.nm-town-toolbox>summary').click();
   if(await page.locator('.nm-town-more').getAttribute('open')===null)await page.locator('.nm-town-more>summary').click();
  };
  const state=()=>page.evaluate(()=>{const s=JSON.parse(localStorage.getItem(window.NM_STATE_KEY));return{coins:s.coins,progress:s.progress};});
  const player=()=>page.locator('#nbNumi').evaluate(e=>[e.style.left,e.style.top]);
  const observers=()=>page.evaluate(()=>__menuObservers.filter(o=>[...o.targets].some(e=>e.matches('.nm-town-toolbox>summary'))).length);
  try{
   await page.goto(base+'/number_magic/index.html?enter=1');await enter();await open();await page.evaluate(()=>document.fonts.ready);
   const before=await state();
   if(textScale===2)await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')].filter(e=>e instanceof HTMLElement),sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px');});
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const metrics=await page.evaluate(()=>{
    const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,scroll:e.scrollWidth,client:e.clientWidth};};
    const screen=document.querySelector('#screen');
    return{overflow:document.documentElement.scrollWidth-innerWidth,screenOverflow:screen.scrollWidth-screen.clientWidth,panel:box(document.querySelector('.nm-town-tool-list')),buttons:[...document.querySelectorAll('.nm-town-toolbox button,.nm-town-toolbox summary')].map(e=>({text:e.textContent.trim(),...box(e)}))};
   });
   const rect=metrics.panel;
   assert(metrics.overflow<=1&&metrics.screenOverflow<=1&&rect.scroll<=rect.client+1,'no horizontal menu or screen scrolling');
   assert(rect.x>=0&&rect.right<=width+1&&rect.bottom<=height-6,'menu stays inside the available viewport');
   assert(metrics.buttons.every(b=>b.scroll<=b.client+1&&b.w>=44&&b.h>=44),'all menu controls fit and keep touch targets');
   assert.deepEqual(await page.locator('[data-place]').evaluateAll(es=>es.map(e=>e.dataset.place)),['numberland','beginner','intermediate','advanced','_theater','_closet'],'menu follows learning order');
   await page.screenshot({path:path.join(out,`${width}-${height}-${lang}-text${textScale}-menu.png`)});
   const pos=await player(),camera=await page.locator('#townWorld').getAttribute('style');
   await page.locator('#townZout').focus();
   const focused=await page.locator('#townZout').evaluate(e=>{const r=e.getBoundingClientRect(),panel=e.closest('.nm-town-tool-list'),p=panel.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{visible:r.top>=p.top&&r.bottom<=p.bottom&&!!hit&&(hit===e||e.contains(hit)),control:r.toJSON(),panel:p.toJSON(),hit:hit?.outerHTML.slice(0,200),panelScroll:panel.scrollTop,maxScroll:panel.scrollHeight-panel.clientHeight,padding:getComputedStyle(panel).padding,screenScroll:document.querySelector('#screen').scrollTop,active:document.activeElement===e};});
   assert(focused.visible,'last control is revealed by keyboard focus: '+JSON.stringify(focused));
   if((width===320&&lang==='en'&&textScale===1)||(width===667&&lang==='ko'&&textScale===2)||(width===390&&lang==='en'&&textScale===2))await page.screenshot({path:path.join(out,`${width}-${height}-${lang}-text${textScale}-tools.png`)});
   assert.equal(await page.locator('#townWorld').getAttribute('style'),camera,'menu scrolling does not pan or zoom the map');
   assert.deepEqual(await player(),pos,'menu scrolling does not walk the player');
   await page.locator('#townZin').click();assert.notEqual(await page.locator('#townWorld').getAttribute('style'),camera,'zoom control works');
   await page.locator('#townZout').click();await page.locator('#townMe').click();assert.equal(await page.locator('#townMe').getAttribute('aria-pressed'),'true');
   if(width===390&&lang==='ko'&&textScale===2){
    await page.setViewportSize({width:844,height:390});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert(await page.locator('.nm-town-tool-list').evaluate(e=>{const r=e.getBoundingClientRect();return r.bottom<=innerHeight-6&&r.left>=0&&r.right<=innerWidth;}),'an open menu refits after orientation changes');
    assert.deepEqual(await player(),pos);await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   }
   await page.keyboard.press('Escape');assert.equal(await page.locator('.nm-town-toolbox').getAttribute('open'),null);assert(await page.locator('.nm-town-toolbox>summary').evaluate(e=>e===document.activeElement));
   await open();await page.locator('#townLeave').focus();assert.equal(await page.locator('.nm-town-toolbox').getAttribute('open'),null,'focus outside closes the menu');
   assert(await page.locator('#townLeave').evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===e||e.contains(hit);}),'focused leave action is unobscured');
   assert.equal(await observers(),1);
   for(let cycle=0;cycle<3;cycle++){
    await page.locator('#townLeave').click();assert.equal(await observers(),0,'leaving disconnects menu size observers');await enter();assert.equal(await observers(),1,'returning creates only one menu observer');
   }
   assert.deepEqual(await state(),before);assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
   report.push({width,height,lang,textScale,panel:rect,keyboardAndZoom:true,focusExit:true,observerCycles:3,scoringPreserved:true,externalWrites:0});
   console.log('MENU_CASE_OK',width,height,lang,textScale);
  }catch(error){await page.screenshot({path:path.join(out,`${width}-${height}-${lang}-text${textScale}-failure.png`)});throw error;}finally{await ctx.close();fs.writeFileSync(path.join(out,'menu.json'),JSON.stringify(report,null,2));}
 }
 assert.equal(report.length,process.env.NM_MENU_CASE?1:21);console.log('TOWN_MENU_OK cases='+report.length+' observerCycles='+report.length*3+' externalWrites=0');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
