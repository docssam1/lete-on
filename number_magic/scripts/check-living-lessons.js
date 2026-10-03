'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const api=require('../data/living-lessons');
// Independent conservation checks, including repeated clicks at boundaries.
for(const uid of ['N-07','M-01']){
 const rounds=uid==='N-07'?4:3;
 for(let round=0;round<rounds;round++){
  let s=api.create(uid,round),v=api.snapshot(s),start=v.positive-v.negative;
  const action=uid==='N-07'?'add':'pair';
  for(let i=0;i<20;i++){
   s=api.act(s,action);v=api.snapshot(s);
   assert(v.remaining>=0);assert(v.positiveLeft>=0&&v.negativeLeft>=0);
   if(uid==='N-07'){assert.equal(v.total,v.base+v.added);assert(v.total<=10);}
   else{assert.equal(v.total,start);assert.equal(v.positiveLeft+v.pairs,v.positive);assert.equal(v.negativeLeft+v.pairs,v.negative);}
  }
  assert(v.complete);if(uid==='N-07')assert.equal(v.total,10);
  for(let i=0;i<20;i++)s=api.act(s,'undo');
  assert.equal(api.snapshot(s).added,0);assert.equal(api.snapshot(s).pairs,0);
  assert.deepEqual(api.act(s,'reset'),api.create(uid,round));
  const predicted=api.act(s,'predict',999);assert.equal(api.snapshot(predicted).total,api.snapshot(s).total);
 }
}
console.log('PASS — 7 rounds: ten-frame bound, zero-pair conservation, undo/reset and predictions');
let picked=api.act(api.create('N-07'),'add',4);assert.deepEqual(picked.moved,[4]);assert.equal(api.act(picked,'add',4).added,1);
picked=api.act(api.create('M-01'),'pair',{positive:2,negative:1});assert.deepEqual(picked.paired,[{positive:2,negative:1}]);assert.equal(api.act(picked,'pair',{positive:2,negative:0}).pairs,1);
if(!process.argv.includes('--browser'))process.exit(0);
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const out=process.env.NM_LIVE_ARTIFACTS;if(out)fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {server,base}=await serve();let browser;const report=[];
 try{
  browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
  for(const [uid,lang,width,reduced,fallback] of [['N-07','ko',390,false,false],['M-01','ko',390,false,false],['N-07','en',1100,true,false],['M-01','zh',768,true,false],['N-07','ko',390,true,true]]){
   const context=await browser.newContext({viewport:{width,height:950},reducedMotion:reduced?'reduce':'no-preference'});
   await context.route(url=>!url.href.startsWith(base)&&!url.href.startsWith('data:')&&!url.href.startsWith('blob:'),r=>r.abort());
   // Test-only projection probe: the actions below still use real pointer events/raycasting.
   await context.route(url=>url.pathname.endsWith('/app/living-lesson.js'),r=>{
    const source=fs.readFileSync(path.join(__dirname,'../app/living-lesson.js'),'utf8').replace(/\r\n/g,'\n');
    const probe=`stage.__probe=()=>{scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const rect=canvas.getBoundingClientRect();return (ten?spares:pieces).filter(o=>o.visible&&o.userData.active).map(o=>{const p=o.getWorldPosition(new T.Vector3()).project(camera);return {index:o.userData.index,sign:o.userData.sign,x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2};});};`;
    const anchor=' resize();\n return {sync';
    assert(source.includes(anchor),'The test-only projection probe must be mounted');
    return r.fulfill({contentType:'application/javascript',body:source.replace(anchor,probe+'\n'+anchor)});
   });
   await context.addInitScript(({uid,lang,fallback})=>{
    localStorage.setItem('nm_state_v1',JSON.stringify({lang,onboarded:true,name:'검수',view:'unit',unit:uid,step:'discover',avatar:{kind:'boy'},placement:{course:uid==='N-07'?'C0':'C29',self:true},account:{status:'active'},symbolDex:{'+':{},'-':{},'−':{},'=':{},'□':{}},progress:{[uid]:{introSeen:true,steps:{}}}}));
    if(fallback){const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){if(/^webgl/.test(kind))return null;return original.call(this,kind,...args);};}
   },{uid,lang,fallback});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   const title=page.locator('[data-id="continue"]:visible,#ttContinue:visible');
   await title.first().click({timeout:30000});
   await page.waitForSelector('.nm-live-stage[data-renderer]',{timeout:30000}).catch(async e=>{console.log({uid,errors,body:(await page.locator('body').innerText()).slice(-3500)});throw e;});
   for(let i=0;i<100;i++){
    const close=page.locator('#nmUnlockOverlayClose,#nmSymClose');if(await close.count())await close.last().click();else break;
   }
   await page.locator('.nm-confetti').first().waitFor({state:'detached',timeout:5000}).catch(()=>{});
   await page.evaluate(()=>document.fonts.ready);await page.locator('.nm-live-head').scrollIntoViewIfNeeded();
   const root=page.locator('.nm-live-lesson'),state=()=>root.evaluate(el=>el.__livingLesson.getState());
   assert.equal(await page.locator('.nm-live-stage').getAttribute('data-renderer'),fallback?'fallback':'webgl');
   assert.equal(await page.locator('.nm-unit-view').getAttribute('data-learning-band'),uid==='N-07'?'preschool':'secondary');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.equal(await page.locator('.nm-live-lesson button').evaluateAll(a=>a.some(b=>b.getBoundingClientRect().height<44)),false);
   if(out)await root.screenshot({path:path.join(out,`${uid}-${lang}-${width}${fallback?'-fallback':''}-before.png`)});
   if(!fallback){
    await page.locator('.nm-live-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
    const points=await page.locator('.nm-live-stage').evaluate(el=>el.__probe());
    if(uid==='N-07'){
     const p=points.find(p=>p.index===4);await page.mouse.click(p.x,p.y);assert.deepEqual((await state()).moved,[4]);
    }else{
     const p=points.find(p=>p.sign==='positive'&&p.index===2),n=points.find(p=>p.sign==='negative'&&p.index===1);
     await page.mouse.click(p.x,p.y);await page.mouse.click(n.x,n.y);assert.deepEqual((await state()).paired,[{positive:2,negative:1}]);
    }
    await page.locator('[data-act="reset"]').click();
   }
   // Prediction must not silently move pieces or mark a concept done.
   const initial=await state();await page.locator('[data-predict]').first().click();
   assert.equal((await state()).total,initial.total);
   if(!fallback){
    await page.waitForTimeout(650);
    const before=await page.locator('.nm-live-stage').evaluate(el=>el.__probe());
    await page.locator('[data-predict]').first().click();await page.waitForTimeout(150);
    const after=await page.locator('.nm-live-stage').evaluate(el=>el.__probe());
    assert.deepEqual(after,before,'A prediction does not move the pieces');
   }
   const action=page.locator(`[data-act="${uid==='N-07'?'add':'pair'}"]`);
   const rounds=uid==='N-07'?4:3;
   for(let i=0;i<rounds;i++){
    const before=await state();let guard=0;
    while(!(await state()).complete&&guard++<10)await action.click();
    const result=await state();assert(result.complete);assert.equal(result.total,uid==='N-07'?10:before.positive-before.negative);
    if(i===0){
     await page.waitForTimeout(reduced?100:700);
     if(out)await root.screenshot({path:path.join(out,`${uid}-${lang}-${width}${fallback?'-fallback':''}-complete.png`)});
     await page.locator('[data-act="undo"]').focus();await page.keyboard.press('Enter');assert.equal((await state()).complete,false);
     await action.click();
    }
    await page.locator('[data-act="next"]').click();
   }
   await page.locator('[data-act="reset"]').click();assert.equal((await state()).round,0);
   // Retain the detached canvas to prove the context is actually released.
   await root.evaluate(el=>{window.__oldLiving=el;window.__oldLivingCanvas=el.querySelector('canvas');});
   await page.locator('[data-step="practice"]').click();await page.waitForTimeout(120);
   assert.equal(await page.evaluate(()=>!!__oldLiving.__livingLesson),false);
   if(!fallback)assert.equal(await page.evaluate(()=>__oldLivingCanvas.getContext('webgl2').isContextLost()),true);
   await page.locator('[data-step="discover"]').click();await page.waitForSelector('.nm-live-stage[data-renderer]');
   assert.deepEqual(errors,[]);
   report.push({uid,lang,width,reduced,fallback,rounds,passed:true});await context.close();
  }
  console.log('PASS — actual app, 5 configurations, 18 rounds, keyboard, responsive, reduced motion, WebGL fallback, dispose/remount');
  if(out)fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
