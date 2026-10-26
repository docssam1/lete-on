#!/usr/bin/env node
'use strict';
// Local production UI with a read-only test bridge; no external requests or real
// learner records. The bridge calls the actual practice/diagnostic handlers.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const source=fs.readFileSync(path.resolve(__dirname,'../app/main.js'),'utf8');
const bridge=`
window.__SCATTER_LEARNING={
 state:()=>JSON.parse(JSON.stringify(S.sub)),
 practice:()=>{lessonVersion++;stopVoice();window.NM_VOICE=null;S.view='unit';S.unit='M-87';S.step='practice';S.sub={started:true};const body=document.getElementById('screen');runPractice(body,UNITS['M-87']);},
 lab:()=>{lessonVersion++;S.view='unit';S.unit='M-87';S.step='lab';S.sub={labStarted:true};stepLab(document.getElementById('screen'),UNITS['M-87']);},
 arena:()=>{lessonVersion++;S.view='unit';S.unit='M-87';S.step='arena';S.sub={ai:0,score:0,left:100};nextArena(document.getElementById('screen'),UNITS['M-87'],24);},
 scalar:raw=>{lessonVersion++;S.view='unit';S.unit='M-87';S.step='practice';const u={practice:{count:12,generator:'ad1_add1d',params:{maxSum:9}}};S.sub={pIdx:0,started:true,cur:{tex:'1+1=\\\\square',answer:2,widget:'numpad',prompt:{ko:'계산'}}};runPractice(document.getElementById('screen'),u);S.sub.inp=raw;handlePractice('ok',document.getElementById('screen'),u);return S.sub.pIdx;},
 diagnostic:()=>{lessonVersion++;stopVoice();window.NM_VOICE=null;const d={stage:'fine',fineThreads:['MD87'],fineIdx:0,fineAsked:0,asked:0,correct:0,log:[],run:'scatter-fixture',K:'C37',zone:['C36','C37']};S._diag=d;S.view='placement';renderPlacementQuestion(d,{thread:'MD87',level:1},null,'fine');return d.cur;},
 diagnosticLog:()=>JSON.parse(JSON.stringify(S._diag.log)),
 matches:matchesLearningAnswer
};
`;
(async()=>{
 const {server,base}=await serve(),browser=await chromium.launch({args:['--disable-webgl','--disable-webgl2']});
 const out=process.env.NM_SCATTER_LEARNING_ARTIFACTS;if(out)fs.mkdirSync(out,{recursive:true});
 const reports=[];
 try{
  for(const width of [390,1280]){
   const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await ctx.route('**/*',r=>r.request().url().startsWith(base+'/')&&r.request().method()==='GET'?r.continue():r.abort());
   await ctx.route('**/app/entry.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
   await ctx.route('**/app/main.js*',r=>{const i=source.lastIndexOf('\n})();');return r.fulfill({contentType:'text/javascript',body:source.slice(0,i)+bridge+source.slice(i)});});
   await page.goto(base+'/number_magic/index.html?enter=1',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.__SCATTER_LEARNING&&window.NM_EXAM?.matchesAnswer);
   await page.waitForSelector('#obAvNext');
   await page.evaluate(()=>{document.getElementById('app').innerHTML='<div id="screen"></div>';__SCATTER_LEARNING.practice();});
   await page.waitForSelector('[data-scatter-submit]');
   const cur=await page.evaluate(()=>__SCATTER_LEARNING.state().cur);
   assert.equal(cur.scatterPlot.mode,'plot');assert.equal(await page.locator('#pracWidget .nm-numpad').count(),0);
   const add=async(x,y)=>{await page.fill('[data-scatter-x]',String(x));await page.fill('[data-scatter-y]',String(y));await page.click('[data-scatter-add]');};
   for(let y=0;y<cur.answer;y++)await add(0,y);
   await page.click('[data-scatter-submit]');assert.equal((await page.evaluate(()=>__SCATTER_LEARNING.state())).pIdx,0,'same number of wrong points must not pass');
   await page.click('[data-scatter-clear]');
   for(const [x,y] of cur.scatterPlot.points)await add(x,y);
   if(out)await page.screenshot({path:path.join(out,'M87-practice-'+width+'.png'),fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile width');
   await page.click('[data-scatter-submit]');await page.waitForFunction(()=>__SCATTER_LEARNING.state().pIdx===1);
   await page.waitForTimeout(800);
   await page.evaluate(()=>__SCATTER_LEARNING.lab());
   const lab=await page.evaluate(()=>__SCATTER_LEARNING.state().cur);
   assert.equal(await page.locator('#labWidget .nm-gp-pt').count(),lab.scatterPlot.points.length,'read task must show its points');
   const press=async text=>page.locator('#gpPad button').filter({hasText:new RegExp('^'+text+'$')}).dispatchEvent('pointerup');
   await press('0');await press('✓');assert.equal((await page.evaluate(()=>__SCATTER_LEARNING.state())).li,0);
   await press('←');for(const d of String(lab.answer))await press(d);await press('✓');
   await page.waitForFunction(()=>__SCATTER_LEARNING.state().li===1);await page.waitForTimeout(800);
   await page.evaluate(()=>__SCATTER_LEARNING.arena());const arena=await page.evaluate(()=>__SCATTER_LEARNING.state().cur);
   assert.equal(await page.locator('#arenaWidget .nm-gp-pt').count(),arena.scatterPlot.points.length);
   for(const d of String(arena.answer))await press(d);await press('✓');assert.equal((await page.evaluate(()=>__SCATTER_LEARNING.state())).score,1);
   const checks=await page.evaluate(()=>({bad:__SCATTER_LEARNING.matches('2junk',2),badArray:__SCATTER_LEARNING.matches('1,,2',[1,2]),goodFraction:__SCATTER_LEARNING.matches(['1','2'],[1,2]),goodDecimal:__SCATTER_LEARNING.matches('-1.5',-1.5),badPractice:__SCATTER_LEARNING.scalar('2junk')}));
   assert.deepEqual(checks,{bad:false,badArray:false,goodFraction:true,goodDecimal:true,badPractice:0});
   assert.equal(await page.evaluate(()=>__SCATTER_LEARNING.scalar('2')),1);await page.waitForTimeout(800);
   // A real multi-box widget retains its fraction shape and numeric response.
   await page.evaluate(()=>{const host=document.getElementById('screen');window.__fractionResponse=null;NM_WIDGETS.render({tex:'\\frac{1}{2}',answer:[1,2],answerShape:'fraction',widget:'numpad'},host,v=>window.__fractionResponse=v);});
   assert.equal(await page.locator('.nm-frac').count(),1);
   await page.locator('#wfPad button').filter({hasText:/^1$/}).dispatchEvent('pointerup');await page.locator('.nm-ans-box[data-i="1"]').dispatchEvent('pointerup');await page.locator('#wfPad button').filter({hasText:/^2$/}).dispatchEvent('pointerup');await page.locator('#wfPad button').filter({hasText:/^✓$/}).dispatchEvent('pointerup');
   assert.deepEqual(await page.evaluate(()=>window.__fractionResponse),[1,2]);
   const diag=await page.evaluate(()=>__SCATTER_LEARNING.diagnostic());
   await page.waitForSelector('#dgWidget [data-scatter-submit]');for(const [x,y] of diag.scatterPlot.points)await add(x,y);await page.click('[data-scatter-submit]');
   assert.equal((await page.evaluate(()=>__SCATTER_LEARNING.diagnosticLog())).at(-1).ok,true);
   assert.deepEqual(errors,[]);reports.push({width,practiceWrongPointsRejected:true,practiceCorrectPointsPassed:true,labRetry:true,arenaGraph:true,diagnosticPlot:true,strictScalar:true,fraction:true});await ctx.close();
  }
  console.log(JSON.stringify({status:'PASS',reports},null,2));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
