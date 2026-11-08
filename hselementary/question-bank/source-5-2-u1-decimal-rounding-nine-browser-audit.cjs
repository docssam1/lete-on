'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {chromium} = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:8918';
const output = process.env.MAC_CHECK_OUTPUT;
if (output) fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch();try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
 await context.addInitScript(()=>{window.print=()=>{}});const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:'load'});
 const check=await page.evaluate(()=>{const types=HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types)));const type=types.find(t=>t.id==='5-2-u1-e2-example-2-4-synthetic'),original=types.find(t=>t.id==='5-2-u1-e2-example-2-4');return {type,locked:original.reviewLocked,qs:Array.from({length:9},(_,i)=>HSE_GENERATORS.generate(type,0,0,1,i)),invalid:HSE_GENERATORS.generate(type,0,0,1,9)};});
 assert.equal(check.locked,true);assert.equal(check.type.verifiedVariantCount,9);assert.equal(check.type.sourceParentItemId,'5-2-u1-e2-example-4');assert.equal(check.invalid,null);
 assert.deepEqual(check.qs.map(q=>q.answer),['3','4','3','2','3','4','5','6','7']);assert.equal(new Set(check.qs.map(q=>q.prompt)).size,9);
 await page.locator('#gradeFilter [data-grade="5"]').click();await page.locator('#termFilter [data-term="2"]').click();await page.locator('#unitFilter').selectOption('5-2-u1');
 assert(await page.locator('#typeList input[data-type-id="5-2-u1-e2-example-2-4"]').isDisabled());
 await page.locator('#typeList input[data-type-id="5-2-u1-e2-example-2-4-synthetic"]').check();await page.locator('#questionCountInput').fill('9');await page.locator('#difficultyFilter [data-difficulty="0"]').click();await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);
 assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(es=>es.map(e=>e.querySelectorAll('.question-item').length)),[4,4,1]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1280&&output)for(const mode of ['problem','solution']){await page.locator(mode==='problem'?'#problemTab':'#solutionTab').click();await page.locator('#printMenuButton').click();await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();const pdf=await page.pdf({path:path.join(output,`${mode}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});if(mode==='problem')assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,3);await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
 assert.deepEqual(errors,[]);await context.close();
 }}finally{await browser.close()}console.log('PASS: nine constrained rounding exercises; original locked; desktop, mobile and A4');})().catch(error=>{console.error(error);process.exitCode=1});
