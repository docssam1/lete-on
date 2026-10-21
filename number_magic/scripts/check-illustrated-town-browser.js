'use strict';
// Local map/navigation regression. Network writes and production authentication are blocked.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright');
const root=path.resolve(__dirname,'../..'),out=process.env.NM_TOWN_ARTIFACTS;
const server=http.createServer((req,res)=>{const f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(root+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch({args:['--disable-webgl','--disable-webgl2']}),report=[];
try{if(out)fs.mkdirSync(out,{recursive:true});for(const [width,height,lang]of [[390,667,'ko'],[734,734,'ko'],[1280,800,'ko'],[390,844,'en'],[390,844,'zh'],[667,375,'ko']]){
 const c=await b.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage(),errors=[],externalWrites=[];p.on('pageerror',e=>errors.push(e.message));
 await c.route('**/*',r=>{if(r.request().url().startsWith(base+'/')&&r.request().method()==='GET')return r.continue();if(r.request().method()!=='GET')externalWrites.push(r.request().url());return r.abort();});
 await c.route('**/app/entry.js?*',r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
 await c.addInitScript(lang=>{if(!localStorage.getItem('nm_state_v1'))localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'Map fixture',view:'town',avatar:{kind:'boy',name:'Map kid'},character:{number:3,color:'gold'},coins:777,progress:{'N-01':{done:true}},r0BannerSeen:true,attend:{last:new Date().toISOString().slice(0,10),days:1},account:{status:'active'}}));},lang);
 await p.goto(base+'/number_magic/index.html?enter=1');
 if(!await p.locator('#townVp').count())await p.locator('#ttGame:visible,.t3d-btn[data-id="game"]').first().click();
 await p.waitForSelector('#townVp.is-illustrated');await p.waitForTimeout(100);
 assert.equal(await p.locator('.nm-town3d,.t3d-joystick').count(),0,'no 3D town controls');assert((await p.locator('#townWorld').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('assets/map.jpg'),'keep original painted map');
 const before=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return{coins:s.coins,progress:s.progress};});
 const view=await p.evaluate(()=>{const a=document.querySelector('#townVp').getBoundingClientRect(),m=document.querySelector('#townWorld').getBoundingClientRect();return{within:m.x>=a.x-1&&m.y>=a.y-1&&m.right<=a.right+1&&m.bottom<=a.bottom+1,overflow:document.documentElement.scrollWidth>innerWidth};});assert(view.within,'whole painted map fits by default');assert.equal(view.overflow,false);
 const buttons=await p.locator('[data-travel]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{id:e.dataset.travel,w:r.width,h:r.height,x:r.x,y:r.y,right:r.right,bottom:r.bottom,hit:hit===e||e.contains(hit)};}));
 assert.equal(buttons.length,6);assert(buttons.every(e=>e.w>=44&&e.h>=44&&e.x>=0&&e.y>=0&&e.right<=width&&e.bottom<=height&&e.hit),'all direct entrances visible and tappable '+JSON.stringify(buttons));
 if(out)await p.screenshot({path:path.join(out,`${width}-${height}-${lang}-town.png`)});
 // Real touch/click and keyboard routes enter immediately; no intermediate confirmation modal.
 for(const id of ['numberland','beginner','intermediate','advanced','_theater','_closet']){
  const button=p.locator('[data-travel="'+id+'"]');if(id==='beginner'){await button.focus();await p.keyboard.press('Enter');}else await button.click();
  const back=id==='_closet'?'#backCloset':id==='_theater'?'#backExam':'#backTown';await p.waitForSelector(back);assert.equal(await p.locator('#tmodal.on').count(),0);await p.click(back);await p.waitForSelector('#townVp.is-illustrated');
 }
 await p.locator('.nm-zone[data-spot="beginner"]').click();await p.waitForSelector('#backTown');await p.click('#backTown');await p.waitForSelector('#townVp.is-illustrated');
 await p.locator('.nm-town-toolbox summary').click();assert.equal(await p.locator('[data-town-gate]').count(),3,'all outside-world gates remain accessible on mobile');
 assert.equal(await p.locator('#townDex').isVisible(),true);await p.keyboard.press('Escape');assert.equal(await p.locator('.nm-town-toolbox').getAttribute('open'),null);
 const after=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nm_state_v1'));return{coins:s.coins,progress:s.progress};});assert.deepEqual(after,before,'navigation does not award points or change learning progress');assert.deepEqual(errors,[]);assert.deepEqual(externalWrites,[]);report.push({width,height,lang,wholeMapVisible:true,oneTapEntrances:6,keyboardEntrance:true,coinsAndProgressPreserved:true,externalWrites:0});await c.close();
 }if(out)fs.writeFileSync(path.join(out,'town.json'),JSON.stringify(report,null,2));console.log('ILLUSTRATED_TOWN_OK '+JSON.stringify(report));}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
