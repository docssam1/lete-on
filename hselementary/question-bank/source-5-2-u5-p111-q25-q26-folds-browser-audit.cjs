'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||'playwright');
const origin=process.env.HSE_AUDIT_ORIGIN||'http://127.0.0.1:8918',output=process.env.HSE_AUDIT_OUTPUT;
if(output)fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch();try{for(const width of [1280,375]){
 const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});await context.addInitScript(()=>{window.print=()=>{}});const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:'load'});await page.locator('#gradeFilter [data-grade="5"]').click();await page.locator('#termFilter [data-term="2"]').click();await page.locator('#unitFilter').selectOption('5-2-u5');
 for(const n of [25,26,27,28])await page.locator(`#typeList input[data-type-id="5-2-u5-practice-${n}-original"]`).check();
 await page.locator('#questionCountInput').fill('4');await page.locator('#difficultyFilter [data-difficulty="0"]').click();await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);
 assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(es=>es.map(e=>e.querySelectorAll('.question-item').length)),[4]);
 for(const n of [25,26]){const folds=page.locator(`#problemView [data-net111-folds=\"${n}\"]`);assert.equal(await folds.count(),1);assert.equal(await folds.getAttribute('stroke-dasharray'),'4 2');}
 const solution=(await page.locator('#solutionView').innerText()).replace(/\s/g,'');for(const answer of ['60cm','300cm','158cm','132cm'])assert(solution.includes(answer));
 assert.equal(4*(5+2+(10-2)),60);assert.equal((9+7+9)*12,300);assert.equal(4*(21+8+10.5),158);assert.equal(4*(9+6+18),132);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 if(width===1280&&output)for(const mode of ['problem','solution']){await page.locator(mode==='problem'?'#problemTab':'#solutionTab').click();await page.locator('#printMenuButton').click();await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();const pdf=await page.pdf({path:path.join(output,`${mode}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});if(mode==='problem')assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1);await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));}
 assert.deepEqual(errors,[]);await context.close();
 }}finally{await browser.close()}console.log('PASS: p111 q25 and q26 source fold lines, four questions, desktop/mobile and A4');})().catch(error=>{console.error(error);process.exitCode=1});
