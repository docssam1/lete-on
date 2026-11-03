'use strict';
const assert=require('node:assert/strict'), path=require('node:path'), {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||'playwright');
const bank=require('./source-5-2-probability-page65-original.js');
for(let i=0;i<3;i++){const q=bank.makeQuestion(4,i),{n,w}=q.questionModel;let all=0,win=0;for(let a=0;a<n;a++)for(let b=0;b<n;b++)if(a!==b){all++;if(a<w&&b<w)win++;}const [num,den]=q.answer.split('/').map(Number);assert.equal(win*den,all*num);assert.match(q.prompt,/다시 넣지 않습니다/);}
const origin=process.env.HSE_AUDIT_ORIGIN||'http://127.0.0.1:8932';
(async()=>{const browser=await chromium.launch({headless:true});try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());await context.addInitScript(()=>{window.print=()=>{};});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`${origin}/hselementary/question-bank/`);
 await page.locator('#gradeFilter [data-grade="5"]').click();await page.locator('#termFilter [data-term="2"]').click();await page.locator('#unitFilter').selectOption('5-2-u6');
 for(const id of ['5-2-u6-t4-6','5-2-u6-practice-6-original','5-2-u6-practice-8-original','5-2-u6-practice-14-original'])await page.locator(`#typeList input[data-type-id="${id}"]`).check();
 await page.locator('#questionCountInput').fill('4');await page.locator('#difficultyFilter [data-difficulty="0"]').click();await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);
 assert.equal(await page.locator('#problemView .question-item').count(),4);const q=page.locator('#problemView [data-source-item-id="5-2-u6-e4-mission-5"]');assert.equal(await q.count(),1);assert.match(await q.innerText(),/다시 넣지 않습니다/);assert.equal(await page.locator('#problemView [data-source-answer]').count(),0);
 await page.locator('#solutionTab').click();const sol=page.locator('#solutionView [data-source-answer="5-2-u6-e4-mission-5"]');await sol.waitFor({state:'visible'});assert.match(await sol.innerText(),/당첨/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ['problem','solution']){await page.locator(mode==='problem'?'#problemTab':'#solutionTab').click();await page.locator('#printMenuButton').click();await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);const file=path.join(process.env.MAC_CHECK_OUTPUT,`ticket-probability-${mode}.pdf`);await page.pdf({path:file,format:'A4',printBackground:true,preferCSSPageSize:true});await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
 assert.deepEqual(errors,[]);await context.close();
}}finally{await browser.close();}console.log('PASS: three independent ordered-ticket enumerations and linked generation, PC/mobile and A4');})().catch(e=>{console.error(e);process.exitCode=1;});
