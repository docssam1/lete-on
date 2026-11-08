'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:18771';
const id = '5-2-u3-practice-58-original';
const ids = [57, 58, 59, 60].map(n => `5-2-u3-practice-${n}-original`);
async function checkLabels(page, message) {
  const labels = await page.locator(`#problemView [data-source-item-id="${id}"] svg`).evaluate(svg => {
    const box = svg.getBoundingClientRect();
    return [...svg.querySelectorAll('text')].map(text => {const r=text.getBoundingClientRect();return {text:text.textContent,top:r.top-box.top,bottom:box.bottom-r.bottom,left:r.left-box.left,right:box.right-r.right};});
  });
  assert.equal(labels.length, 10);
  for (const label of labels) for (const side of ['top','bottom','left','right']) assert(label[side] >= -0.5, `${message}: ${label.text} clipped at ${side}: ${label[side]}`);
}
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1280,375,320]) {
      const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
      await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(()=>{window.print=()=>{};});
      await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:'load'});
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator('#unitFilter').selectOption('5-2-u3');
      for(const type of ids)await page.locator(`#typeList input[data-type-id="${type}"]`).check();
      await page.locator('#questionCountInput').fill('4');await page.locator('#generateButton').click();
      await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);await page.evaluate(()=>document.fonts.ready);
      await checkLabels(page,`${width}px screen`);
      const item=page.locator(`#problemView [data-source-item-id="${id}"]`);
      assert.match(await item.innerText(),/직선 ㅈㅊ/);
      assert.match(await page.locator(`#solutionView [data-source-answer="${id}"]`).innerText(),/④/);
      await page.locator('#printMenuButton').click();await page.locator('#printMenuList [data-print-mode="problem"]').click();
      await page.waitForFunction(()=>document.body.dataset.printMode==='problem');await page.emulateMedia({media:'print'});await page.setViewportSize({width:794,height:1123});await page.evaluate(()=>document.fonts.ready);
      await checkLabels(page,`${width}px A4`);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(es=>es.map(e=>e.querySelectorAll('.question-item').length)),[4]);
      const boxes=await item.evaluate(el=>{const a=el.closest('.question-item').querySelector('.answer-line').getBoundingClientRect(),r=el.getBoundingClientRect();return {bottom:r.bottom,answerTop:a.top};});
      assert(boxes.bottom<=boxes.answerTop+1,'question remains above answer line');
      if(process.env.MAC_CHECK_OUTPUT){const pdf=await page.pdf({path:path.join(process.env.MAC_CHECK_OUTPUT,`problem-${width}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1);}
      assert.deepEqual(errors,[]);await context.close();
    }
  } finally {await browser.close();}
  console.log('PASS: symmetry-axis labels fit on screen and A4; answer ④ is unchanged');
})().catch(error=>{console.error(error);process.exitCode=1;});
