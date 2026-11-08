import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {tmpdir,homedir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {bank,anchors,solutions,tally,piecesAfter,candidate} from './model.js';
const runtime=process.env.PLAYWRIGHT_MODULE||join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const {chromium}=await import(pathToFileURL(runtime).href),base=process.env.GFIELD_BASE_URL||'http://127.0.0.1:8772',out=process.env.GFIELD_ARTIFACT_DIR||join(tmpdir(),`straight-paper-cut-${Date.now()}`);
await mkdir(out,{recursive:true});const browser=await chromium.launch({headless:true}),errors=[];let flows=0,pdfs=0;
async function peg(page,point){const board=await page.locator('.board').boundingBox();await page.touchscreen.tap(board.x+(point.x*100+20)*board.width/140,board.y+(point.y*100+20)*board.height/140);}
async function run(type,index,viewport,lang='ko',keyboard=false){
 const context=await browser.newContext({viewport,hasTouch:true,reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.addInitScript(({type,index,lang})=>{localStorage.setItem('gfield-language',lang);localStorage.setItem('gfield-straight-paper-cut-v1',JSON.stringify({positions:{[type]:index},completed:[]}));localStorage.setItem('gfield-paper-fold-progress-v4','preserved');localStorage.setItem('gfield-one-stroke-three-types-v1','preserved');},{type,index,lang});
 try{
 await page.goto(`${base}/geometry/games/paper-cut/?type=${type}`);const task=bank[type][index];await page.locator(`#app[data-task="${task.id}"]`).waitFor();await page.evaluate(()=>document.fonts.ready);
 const rect=await page.locator('.board').boundingBox();assert.ok(Math.abs(rect.width-rect.height)<1,'Board must remain square');assert.ok(rect.width>140,'Paper must not shrink to an unusable target');
 assert.equal(await page.locator('.piece-label').count(),0,'No result before the answer');
 assert.ok(await page.locator('.coach img').evaluate(img=>img.complete&&img.naturalWidth>0));
 const layout=await page.evaluate(()=>{
  const character=document.querySelector('.coach img'),keys=document.querySelector('.number-pad'),r=character.getBoundingClientRect(),k=keys.getBoundingClientRect();
  return {visible:r.width>30&&r.height>30&&r.bottom<=innerHeight&&r.top>=0,overlap:getComputedStyle(keys).display==='none'?false:r.left<k.right&&r.right>k.left&&r.top<k.bottom&&r.bottom>k.top,scroll:document.querySelector('.info').scrollHeight>document.querySelector('.info').clientHeight+1};
 });assert.equal(layout.visible,true,'Character is visibly present');assert.equal(layout.overlap,false,'Character must not cover the keypad');assert.equal(layout.scroll,false,'Answer panel must fit without scrolling');
 if(type==='count'){
  assert.equal(await page.locator('input[type=number]').count(),0,'Use Cube Town-style answer displays, not native spinner inputs');
  assert.equal(await page.locator('.number-pad [data-digit]').count(),10);
  assert.equal(await page.locator('.number-pad').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),5);
  assert.equal(await page.locator('[data-count] strong').first().textContent(),'?','An empty answer must not be prefilled with zero');
  assert.equal(await page.locator('#app').getAttribute('data-phase'),'answer','The stated cut is already complete');
  if(lang==='ko')assert.equal(await page.locator('.prompt').textContent(),'색종이를 아래와 같이 잘랐어요.');
  if(index===0)await page.screenshot({path:join(out,`ready-count-${viewport.width}-${lang}.png`)});
  await page.locator('.check').click();assert.equal(await page.locator('#app').getAttribute('data-phase'),'answer');
  const counts=tally(piecesAfter(task.cuts));
  assert.equal(await page.locator('[data-count]').count(),Object.keys(counts).length);
  for(const [n,count] of Object.entries(counts)){
   await page.locator(`[data-count="${n}"]`).click();assert.equal(await page.locator(`[data-count="${n}"]`).getAttribute('aria-pressed'),'true');
   if(keyboard){await page.keyboard.press('9');await page.keyboard.press('Backspace');assert.equal(await page.locator(`[data-count="${n}"] strong`).textContent(),'?');await page.keyboard.press(String(count));}
   else{await page.locator('[data-digit="9"]').tap();await page.locator('.clear-key').tap();assert.equal(await page.locator(`[data-count="${n}"] strong`).textContent(),'?');await page.locator(`[data-digit="${count}"]`).tap();}
   assert.equal(await page.locator(`[data-count="${n}"] strong`).textContent(),String(count));
  }
  await page.locator('.check').click();
 }else{
  const invalid=anchors.flatMap((a,i)=>anchors.slice(i+1).map(b=>[a,b])).find(cut=>{const r=candidate(task,...cut);return r.changed&&!r.correct;});
  await peg(page,invalid[0]);await peg(page,invalid[1]);assert.equal(await page.locator('#app').getAttribute('data-phase'),'answer');
  assert.ok(await page.locator('.message').textContent());await page.locator('.retry').click();
  const answer=solutions(task).at(-1);
  for(const point of answer){if(keyboard){const i=anchors.findIndex(p=>p.x===point.x&&p.y===point.y);await page.locator(`[data-point="${i}"]`).focus();await page.keyboard.press('Enter');}else await peg(page,point);}
 }
 assert.equal(await page.locator('#app').getAttribute('data-phase'),'solved');assert.ok(await page.locator('.next').isVisible());
 const stats=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,bottom:document.querySelector('footer').getBoundingClientRect().bottom,height:innerHeight}));assert.equal(stats.overflow,false);assert.ok(stats.bottom<=stats.height+1,'Footer must fit');
 if(index===0)await page.screenshot({path:join(out,`${type}-${viewport.width}-${lang}.png`)});
 const record=await page.evaluate(()=>localStorage.getItem('gfield-straight-paper-cut-v1'));
 await page.locator('.help').click();assert.equal(await page.locator('#app').getAttribute('data-training'),'true');await page.locator('.help').click();
 assert.equal(await page.locator('#app').getAttribute('data-phase'),'solved');assert.equal(await page.evaluate(()=>localStorage.getItem('gfield-straight-paper-cut-v1')),record);
 for(const key of ['gfield-paper-fold-progress-v4','gfield-one-stroke-three-types-v1'])assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),'preserved');
 await page.locator('.next').click();assert.notEqual(await page.locator('#app').getAttribute('data-task'),task.id);flows++;
 }catch(error){await page.screenshot({path:join(out,'failure.png')});console.log(JSON.stringify({out,type,index,viewport,lang}));throw error;}finally{await context.close();}
}
try{
 for(const type of ['count','make'])for(let i=0;i<bank[type].length;i++)await run(type,i,{width:1280,height:800});
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:320,height:740}])for(const type of ['count','make'])await run(type,0,viewport);
 for(const viewport of [{width:390,height:844},{width:844,height:390},{width:320,height:740},{width:600,height:320}]){
  await run('count',bank.count.findIndex(task=>Object.keys(tally(piecesAfter(task.cuts))).length===2),viewport);
  await run('make',bank.make.findIndex(task=>Object.keys(task.target).length===2),viewport);
 }
 for(const lang of ['en','zh','ja'])for(const type of ['count','make'])await run(type,0,{width:1280,height:800},lang,true);
 for(const lang of ['en','zh','ja'])for(const viewport of [{width:320,height:740},{width:600,height:320}])for(const type of ['count','make'])await run(type,0,viewport,lang);
 const page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['ko','en','zh','ja'])for(const answers of [0,1]){
  await page.goto(base+'/geometry/worksheet/paper-cut/?answers='+answers);await page.evaluate(lang=>localStorage.setItem('gfield-language',lang),lang);await page.reload();await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('article').count(),24);assert.equal(await page.locator('.sheet').count(),8);
  await page.emulateMedia({media:'print'});
  const layout=await page.locator('article').evaluateAll(nodes=>nodes.every(n=>n.scrollHeight<=n.clientHeight+1));assert.ok(layout,'A4 questions must fit');
  await page.pdf({path:join(out,`${lang}-${answers?'teacher':'student'}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});pdfs++;await page.emulateMedia({media:'screen'});
  if(lang==='ko')await page.screenshot({path:join(out,`worksheet-${answers}.png`),fullPage:false});
 }
 await page.goto(base+'/geometry/origami-studio/');assert.equal(await page.locator('#straightCutGrid a').count(),2);await page.close();assert.deepEqual(errors,[]);
 const result={flows,questions:24,cutCombinations:2880,pdfs,errors,actualDevice:false,teacherApproval:false,main:false};await writeFile(join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({out,...result}));
}finally{await browser.close();}
