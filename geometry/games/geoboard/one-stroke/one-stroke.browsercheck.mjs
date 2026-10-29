import assert from "node:assert/strict";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {fileURLToPath,pathToFileURL} from "node:url";
import {join} from "node:path";
import {homedir,tmpdir} from "node:os";
import {copy} from "./i18n.js";
const bank=JSON.parse(await readFile(new URL("./bank.json",import.meta.url),"utf8"));
const verify=spawnSync(process.env.PYTHON||"python",[fileURLToPath(new URL("./verify_bank.py",import.meta.url)),fileURLToPath(new URL("./bank.json",import.meta.url))],{encoding:"utf8"});
assert.equal(verify.status,0,verify.stderr);const proofs=JSON.parse(verify.stdout).proofs;
const runtime=join(homedir(),".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||pathToFileURL(join(runtime,"playwright/index.mjs")).href);
const {default:sharp}=await import(process.env.SHARP_MODULE||pathToFileURL(join(runtime,"sharp/dist/index.mjs")).href);
const base=(process.env.GFIELD_BASE_URL||"http://127.0.0.1:8771").replace(/\/$/,"");
const url=`${base}/geometry/games/geoboard/?activity=one-stroke`;
const output=process.env.GFIELD_ARTIFACT_DIR||join(tmpdir(),`geometry-euler-${Date.now()}`);await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],layouts=[];let currentPage;
const SAVE="gfield-geoboard-one-stroke-v1";
const legacy=JSON.stringify({name:"QA",sentinel:"preserve-existing",progress:{geoboardStudio:{level:2,problemIndex:1,untouched:true},otherGame:{solved:8}}});
const seed=(level=1,index=0)=>({version:1,bankVersion:1,level,indices:{1:0,2:0,3:0,[level]:index},paths:Object.fromEntries(bank.problems.filter(p=>p.level===level).slice(0,index).map(p=>[p.id,Object.values(proofs.find(q=>q.id===p.id).trails)[0]]))});
const peg=(page,id)=>page.locator(`.os-peg-hit[data-node="${id}"]`);
async function center(locator){const r=await locator.boundingBox();assert.ok(r);return{x:r.x+r.width/2,y:r.y+r.height/2};}
async function prepare(page,language="ko",snapshot=seed()){
  currentPage=page;
  await page.goto(`${base}/geometry/games/geoboard/one-stroke/bank.json`);
  await page.evaluate(({language,snapshot,legacy,SAVE})=>{localStorage.setItem(SAVE,JSON.stringify(snapshot));localStorage.setItem("gfield-language",language);localStorage.setItem("gfield-audio-muted","true");localStorage.setItem("gfield-profile",legacy);localStorage.setItem("gfield-geoboard-tutorial-v1","done");},{language,snapshot,legacy,SAVE});
  await page.goto(url,{waitUntil:"networkidle"});await page.locator(".one-stroke.is-ready").waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
}
async function layout(page,label){
  const data=await page.evaluate(()=>{
    const root=document.querySelector('.one-stroke'),board=root.querySelector('.os-board').getBoundingClientRect(),header=root.querySelector('.os-header').getBoundingClientRect(),footer=root.querySelector('.os-footer').getBoundingClientRect();
    const controls=[...root.querySelectorAll('button,select,a')].filter(n=>n.getClientRects().length).map(n=>{const r=n.getBoundingClientRect();return{label:n.getAttribute('aria-label')||n.textContent,width:r.width,height:r.height,left:r.left,top:r.top,right:r.right,bottom:r.bottom};});
    const info=root.querySelector('.os-info').getBoundingClientRect(),message=root.querySelector('.os-message');
    return{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,board:{width:board.width,height:board.height,top:board.top,bottom:board.bottom,left:board.left,right:board.right},controls,headerBottom:header.bottom,footerTop:footer.top,infoTop:info.top,infoBottom:info.bottom,messageFits:message.scrollHeight<=message.clientHeight+1};
  });
  await writeFile(join(output,'last-layout.json'),JSON.stringify({label,...data},null,2));
  assert.ok(data.scrollWidth<=data.width+1,`${label}: horizontal overflow`);assert.ok(data.scrollHeight<=data.height+1,`${label}: vertical overflow`);
  assert.ok(Math.abs(data.board.width-data.board.height)<.1,`${label}: distorted board`);
  assert.ok(data.board.top>=data.headerBottom-1&&data.board.bottom<=data.footerTop+1,`${label}: board clipped`);
  assert.ok(data.infoTop>=data.headerBottom-1&&data.infoBottom<=data.footerTop+1,`${label}: guidance clipped`);
  assert.ok(data.messageFits,`${label}: message overflow`);
  for(const r of data.controls){assert.ok(r.width>=43.9&&r.height>=43.9,`${label}: small target ${JSON.stringify(r)}`);assert.ok(r.left>=-1&&r.right<=data.width+1&&r.top>=-1&&r.bottom<=data.height+1,`${label}: control clipped ${JSON.stringify(r)}`);}
  layouts.push({label,...data});
}
async function drag(page,path,touch=false){
  const points=[];for(const id of path)points.push(await center(peg(page,id)));
  if(touch){const session=await page.context().newCDPSession(page);await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[points[0]]});for(const point of points.slice(1))await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await session.detach();}
  else{await page.mouse.move(points[0].x,points[0].y);await page.mouse.down();for(const p of points.slice(1))await page.mouse.move(p.x,p.y,{steps:4});await page.mouse.up();}
}
async function woodPixels(page){
  const bytes=await page.locator('.os-board').screenshot();const {data,info}=await sharp(bytes).resize(100,100).removeAlpha().raw().toBuffer({resolveWithObject:true});let wood=0;const colors=new Set();
  for(let i=0;i<data.length;i+=info.channels){if(data[i]>data[i+2]+25&&data[i+1]>data[i+2]+10)wood++;colors.add(`${data[i]>>3},${data[i+1]>>3},${data[i+2]>>3}`);}
  assert.ok(wood>5500&&colors.size>60,"Actual wooden texture, pegs and edges render");
}
async function paintedEdges(page){
  const samples=await page.locator('.os-edge.is-used').evaluateAll(lines=>{
    const r=document.querySelector('.os-board').getBoundingClientRect();
    return{width:r.width,points:lines.map(line=>{const p=document.querySelector('.os-board svg').createSVGPoint();p.x=line.x1.baseVal.value+(line.x2.baseVal.value-line.x1.baseVal.value)*.25;p.y=line.y1.baseVal.value+(line.y2.baseVal.value-line.y1.baseVal.value)*.25;const q=p.matrixTransform(line.getScreenCTM());return{x:q.x-r.x,y:q.y-r.y};})};
  });
  const {data,info}=await sharp(await page.locator('.os-board').screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true}),scale=info.width/samples.width;
  return samples.points.every(p=>{let color=0;for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const x=Math.round(p.x*scale)+dx,y=Math.round(p.y*scale)+dy,i=(y*info.width+x)*info.channels;if(data[i+1]>data[i]*1.1&&data[i+2]>data[i]*.9)color++;}return color>=8;});
}
try{
  for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:320,height:568},{width:844,height:390},{width:600,height:320}]){
    const context=await browser.newContext({viewport,hasTouch:true,serviceWorkers:"block"}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
    for(const language of ["ko","en","zh","ja"]){
      await prepare(page,language);await layout(page,`${viewport.width}-${language}-start`);
      assert.equal(await page.locator('.os-edge.is-used').count(),0);assert.equal(await page.locator('.os-node.is-current').count(),0,"No correct starting peg is revealed");
      await peg(page,'b').tap();assert.equal(await page.locator('.one-stroke').getAttribute('data-feedback'),'wrongStart');assert.equal(await page.locator('.one-stroke').getAttribute('data-path'),'');
      assert.equal(await page.locator('.os-message').textContent(),copy[language].wrongStart);await layout(page,`${viewport.width}-${language}-wrong-start`);
      if(language==="ko")await page.screenshot({path:join(output,`${viewport.width}-wrong-start.png`)});
      await page.locator('.os-reset').click();assert.equal(await page.locator('.one-stroke').getAttribute('data-feedback'),'chooseStart');assert.equal(await page.locator('.os-node.is-rejected').count(),0);
      const a=await center(peg(page,'a')),b=await center(peg(page,'b'));
      await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move((a.x+b.x)/2,(a.y+b.y)/2,{steps:4});
      assert.equal(await page.locator('.os-edge.is-used').count(),0);assert.equal(await page.locator('.os-live').evaluate(n=>getComputedStyle(n).display!=='none'),true);
      if(language==="ko")await page.screenshot({path:join(output,`${viewport.width}-in-flight.png`)});
      await page.mouse.up();assert.equal(await page.locator('.os-live').evaluate(n=>getComputedStyle(n).display),'none');
      await page.locator('.os-reset').click();assert.equal(await page.locator('.one-stroke').getAttribute('data-path'),'');assert.equal(await page.locator('.one-stroke').getAttribute('data-problem'),'os-bend');
      await drag(page,['a','b','c','d'],viewport.width<1000);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
      assert.equal(await page.locator('.os-edge.is-used').count(),3);assert.equal(await page.evaluate(()=>localStorage.getItem('gfield-profile')),legacy);
      await layout(page,`${viewport.width}-${language}-solved`);await woodPixels(page);
      assert.equal(await paintedEdges(page),true,"Accepted edges are actually painted between pegs");
      if(language==="ko")await page.screenshot({path:join(output,`${viewport.width}-solved.png`)});
      await page.reload({waitUntil:'networkidle'});await page.locator('.one-stroke[data-phase="solved"]').waitFor();
      await page.locator('.os-undo').click();assert.equal(await page.locator('.os-edge.is-used').count(),2);await layout(page,`${viewport.width}-${language}-undo`);
      await page.locator('.os-reset').click();assert.equal(await page.locator('.os-edge.is-used').count(),0);
    }
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1280,height:800},hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();currentPage=page;page.on('pageerror',e=>errors.push(e.message));
  for(const p of bank.problems){
    const index=bank.problems.filter(q=>q.level===p.level).findIndex(q=>q.id===p.id);await prepare(page,'ko',seed(p.level,index));
    const trail=Object.values(proofs.find(q=>q.id===p.id).trails)[0];await drag(page,trail,true);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
    assert.equal(await page.locator('.os-edge.is-used').count(),p.edges.length);assert.deepEqual((await page.locator('.one-stroke').getAttribute('data-path')).split(','),trail);
    assert.equal(await paintedEdges(page),true,`${p.id}: actual edge pixels`);
    await page.screenshot({path:join(output,`${p.id}.png`)});
  }
  await prepare(page,'ko',seed(2,0));await drag(page,['b','d']);await page.locator('.one-stroke[data-phase="stuck"]').waitFor();assert.match(await page.locator('.os-message').textContent(),/선이 남/);
  await page.locator('.os-undo').click();await drag(page,['b','a','c','b','d']);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
  await prepare(page);await peg(page,'a').focus();await page.keyboard.press('Enter');await peg(page,'b').focus();await page.keyboard.press('Enter');
  await peg(page,'a').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.one-stroke').getAttribute('data-feedback'),'usedLine');assert.equal(await page.locator('.os-edge.is-used').count(),1);
  await peg(page,'c').focus();await page.keyboard.press('Enter');await peg(page,'d').focus();await page.keyboard.press('Enter');await page.locator('.one-stroke[data-phase="solved"]').waitFor();
  await page.locator('.os-reset').click();const a=await center(peg(page,'a')),b=await center(peg(page,'b'));
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:5});await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.mouse.up();
  assert.equal(await page.locator('.os-edge.is-used').count(),1);await page.reload({waitUntil:'networkidle'});await page.locator('.one-stroke[data-path="a,b"]').waitFor();
  await drag(page,['c','d']);assert.equal(await page.locator('.os-edge.is-used').count(),1,"Lifting cannot restart from another peg");
  await drag(page,['b','c','d']);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
  await page.locator('.os-edge.is-used').first().evaluate(line=>line.style.stroke='transparent');assert.equal(await paintedEdges(page),false,"Pixel checker rejects an intentionally invisible accepted edge");
  await page.locator('.os-edge.is-used').first().evaluate(line=>line.style.removeProperty('stroke'));assert.equal(await paintedEdges(page),true);
  await page.locator('.os-reset').click();await drag(page,['a','c']);assert.equal(await page.locator('.os-edge.is-used').count(),0,"Dragging across a corner cannot invent a diagonal edge");
  await page.locator('.os-reset').click();
  const session=await context.newCDPSession(page),pa=await center(peg(page,'a')),pb=await center(peg(page,'b')),pc=await center(peg(page,'c'));
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pa]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[pb]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:(pb.x+pc.x)/2,y:(pb.y+pc.y)/2}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.locator('.os-edge.is-used').count(),1);assert.equal(await page.locator('.os-live').evaluate(n=>getComputedStyle(n).display),'none');
  const resume=await center(peg(page,'b'));await page.mouse.move(resume.x,resume.y);await page.mouse.down();await page.setViewportSize({width:600,height:320});await page.mouse.up();
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.equal(await page.locator('.one-stroke').getAttribute('data-path'),'a,b');await drag(page,['b','c','d'],true);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
  await page.locator('.os-reset').click();const wrong=await center(peg(page,'b')),start=await center(peg(page,'a'));
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...wrong,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...wrong,id:1},{...start,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await page.locator('.one-stroke').getAttribute('data-path'),'','Secondary touch cannot silently choose a start');await session.detach();
  await drag(page,['a','b','c','d'],true);await page.locator('.one-stroke[data-phase="solved"]').waitFor();
  await page.locator('.os-next').click();assert.equal(await page.locator('.one-stroke').getAttribute('data-problem'),'os-steps');
  await page.goto(`${base}/geometry/geoboard/`);assert.equal(await page.locator('#typeGrid .type-card').count(),6);await page.locator('.card-euler').click();await page.locator('.one-stroke').waitFor();
  await page.goto(`${base}/geometry/games/geoboard/?level=1`);await page.locator('.yard-shell[data-activity-ready="true"]').waitFor();await page.locator('#levelButton').click();await page.locator('#levelDialog a[href="?activity=one-stroke"]').click();await page.locator('.one-stroke').waitFor();
  await context.close();
  const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true,serviceWorkers:'block'}),rp=await reduced.newPage();await prepare(rp);await drag(rp,['a','b','c','d'],true);await rp.locator('.one-stroke[data-phase="solved"]').waitFor();await reduced.close();
  const quota=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'}),qp=await quota.newPage();await prepare(qp);await qp.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('QA quota','QuotaExceededError');};});await drag(qp,['a','b','c','d']);await qp.locator('.one-stroke[data-phase="solved"]').waitFor();await qp.locator('.os-storage').waitFor();await quota.close();
  const missing=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});await missing.route('**/assets/ui/wood-light.webp',r=>r.abort());const mp=await missing.newPage();await mp.goto(url);await mp.locator('.os-fatal button').waitFor();assert.equal(await mp.locator('.one-stroke').count(),0);await missing.close();
  const offline=await browser.newContext({viewport:{width:600,height:320},hasTouch:true}),op=await offline.newPage();await prepare(op);await op.evaluate(()=>navigator.serviceWorker.ready);await op.waitForFunction(async()=>!!await caches.match('/geometry/games/geoboard/one-stroke/bank.json?v=euler-1'),{},{timeout:60000});await op.reload();await op.waitForFunction(()=>!!navigator.serviceWorker.controller);await offline.setOffline(true);await op.reload({waitUntil:'domcontentloaded'});await op.locator('.one-stroke.is-ready').waitFor();await drag(op,['a','b','c','d'],true);await op.locator('.one-stroke[data-phase="solved"]').waitFor();await offline.close();
  assert.deepEqual(errors,[]);await writeFile(join(output,'result.json'),JSON.stringify({status:'PASS',layouts,problems:12,matrixSolved:20,additionalProblemPaths:12,languages:['ko','en','zh','ja'],errors,physicalDeviceTested:false,teacherApproved:false},null,2));
  console.log(JSON.stringify({status:'PASS',layoutChecks:layouts.length,problemPaths:32,output,errors}));
}catch(error){if(currentPage&&!currentPage.isClosed()){await currentPage.screenshot({path:join(output,'failure.png')}).catch(()=>{});await writeFile(join(output,'failure.json'),JSON.stringify({error:String(error),url:currentPage.url(),state:await currentPage.locator('.one-stroke').evaluate(n=>({...n.dataset})).catch(()=>null)},null,2));}console.error(`Evidence: ${output}`);throw error;}
finally{await browser.close();}
