import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.SCIENCE_PLAYWRIGHT||'playwright');
const base=process.env.PILOT_URL||'http://127.0.0.1:39246/science-lab/popcorn/fabre-09/current/';
const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const out=process.env.PILOT_SHOTS; if(out)await mkdir(out,{recursive:true});
const results=[];
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(base,r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html lang="ko"><meta charset="utf-8"><link rel="stylesheet" href="style.css"><body><header class="top">팝콘 실험실</header><main class="lesson"><aside class="rail"></aside><section class="workspace"><div class="lesson-head"><h1>전류 조립 안내</h1></div><div class="learning-grid"><div class="model-panel"><div class="viewport"><canvas id="model"></canvas></div></div><div class="text-panel">3D 조립 모형</div></div></section></main></body></html>'}));
 await page.addInitScript(()=>{globalThis.SL_QUALITY='low';});await page.goto(base);
 await page.evaluate(async()=>{const {createRig}=await import('./model.js');window.rig=createRig(document.querySelector('#model'));});
 const cases=[['student-pc',1440,900,false,false],['teacher-pc',1440,900,true,false],['phone',390,844,false,false],['small-phone',360,740,false,false],['tablet',1024,768,false,false],['full-pc',1280,760,false,true],['full-phone',844,390,false,true]];
 for(const [name,width,height,teacher,full] of cases){
  await page.setViewportSize({width,height});await page.evaluate(({teacher,full})=>{document.body.className=teacher?'teacher':'';const v=document.querySelector('.viewport');v.style.position=full?'fixed':'';v.style.inset=full?'0':'';v.style.width=full?'100vw':'';v.style.height=full?'100dvh':'';v.style.zIndex=full?'10':'';window.dispatchEvent(new Event('resize'));},{teacher,full});
  for(const id of ['welcome','compare','parts','paper','socket','switch','wire1','wire2','junction','wirelow','wirehigh','assembly','test']){
   await page.evaluate(id=>window.rig.set({id,mode:id==='compare'?'parallel':'stand',position:'high'}),id);await page.waitForFunction(()=>!window.rig.stage._needFit,null,{timeout:15000});if(id==='assembly')await page.waitForTimeout(1600);
   const box=await page.evaluate(()=>{const s=window.rig.stage;const pts=s._framePoints().map(p=>p.clone().project(s.camera));return {x0:Math.min(...pts.map(p=>p.x)),x1:Math.max(...pts.map(p=>p.x)),y0:Math.min(...pts.map(p=>p.y)),y1:Math.max(...pts.map(p=>p.y)),need:s._needFit,width:s.canvas.clientWidth,height:s.canvas.clientHeight};});
   assert.ok(box.x0>=-1.01&&box.x1<=1.01&&box.y0>=-1.01&&box.y1<=1.01,`${name}/${id} clipping: ${JSON.stringify(box)}`);
   assert.ok(Math.max(box.x1-box.x0,box.y1-box.y0)>=1.2,`${name}/${id} model too small: ${JSON.stringify(box)}`);
   assert.equal(box.need,false,`${name}/${id} fit pending`);results.push({view:name,id,...box});
  }
  for(const id of ['socket','switch','assembly']){
   await page.evaluate(async id=>{const {THREE}=await import('../../../scenes/_kit.js');window.rig.set({id,demo:true});window.rig.stage.root.updateMatrixWorld(true);window.demoPoints=[];window.rig.stage.root.traverseVisible(o=>{if(!o.isMesh||o.userData.noFrame||o.userData.isLabel)return;const b=new THREE.Box3().setFromObject(o);for(let i=0;i<8;i++)window.demoPoints.push([i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z]);});},id);
   await page.waitForFunction(()=>!window.rig.stage._needFit);
   const bounds=await page.evaluate(async()=>{const {THREE}=await import('../../../scenes/_kit.js');const s=window.rig.stage;const p=window.demoPoints.map(p=>new THREE.Vector3(...p).project(s.camera));return {x0:Math.min(...p.map(v=>v.x)),x1:Math.max(...p.map(v=>v.x)),y0:Math.min(...p.map(v=>v.y)),y1:Math.max(...p.map(v=>v.y))};});
   assert.ok(bounds.x0>=-1.01&&bounds.x1<=1.01&&bounds.y0>=-1.01&&bounds.y1<=1.01,`${name}/${id} initial demo geometry clipped: ${JSON.stringify(bounds)}`);
   results.push({view:name,id:id+'-demo',...bounds});
  }
  if(out)await page.screenshot({path:out+'/3d-'+name+'.png'});console.log('PASS 3D',name);
 }
 assert.equal(errors.length,0,errors.join('\n'));await page.evaluate(()=>window.rig.dispose());
 const live=await page.evaluate(async()=>{const {Stage}=await import('../../../engine.js');return Stage.live.size;});assert.equal(live,0);
 console.log('3D PILOT PASS',results.length,'cases, 0 failed');if(out)await writeFile(out+'/3d-qa.json',JSON.stringify({passed:results.length,failed:0,results},null,2));
}finally{await browser.close();}
