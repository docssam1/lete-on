'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:18772';
const groups = [
  { unit:'5-2-u3', ids:['5-2-u3-practice-48-original','5-2-u3-practice-69-clarified-similar','5-2-u3-practice-58-original','5-2-u3-practice-59-original'], targets:['5-2-u3-practice-48-original','5-2-u3-practice-69-clarified-similar'] },
  { unit:'5-2-u5', ids:[34,37,38,39].map(n=>`5-2-u5-practice-${n}-original`), targets:['5-2-u5-practice-39-original'] }
];
async function checkLabels(page, targets, message) {
  const violations = await page.evaluate(targets => {
    const out=[];
    for(const id of targets){const item=document.querySelector(`#problemView [data-source-item-id="${id}"]`);if(!item){out.push(`${id}: missing`);continue;}
      for(const svg of item.querySelectorAll('svg')){const box=svg.getBoundingClientRect();for(const t of svg.querySelectorAll('text')){const r=t.getBoundingClientRect();if(!r.width||!r.height)continue;for(const [side,d] of [['top',r.top-box.top],['bottom',box.bottom-r.bottom],['left',r.left-box.left],['right',box.right-r.right]])if(d < -0.5)out.push(`${id}: ${t.textContent} clipped ${side} ${d}`);}}
    }return out;
  }, targets);
  assert.deepEqual(violations, [], message);
}
(async()=>{
  const browser=await chromium.launch();
  try{for(const width of [1280,375,320])for(const group of groups){
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:'block'});
    await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.print=()=>{};});
    await page.goto(`${origin}/hselementary/question-bank/`,{waitUntil:'load'});await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator('#unitFilter').selectOption(group.unit);
    for(const id of group.ids)await page.locator(`#typeList input[data-type-id="${id}"]`).check();
    await page.locator('#questionCountInput').fill('4');await page.locator('#generateButton').click();await page.waitForFunction(()=>!document.querySelector('#worksheet').hidden);await page.evaluate(()=>document.fonts.ready);
    await checkLabels(page,group.targets,`${group.unit} ${width}px screen`);
    assert.equal(await page.locator('#solutionView .solution-item').count(),4);
    const text=await page.locator('#solutionView').innerText();
    if(group.unit==='5-2-u3'){assert.match(text,/29°/);assert.match(text,/122°/);assert.match(text,/48cm/);}else assert.match(text,/ㄱㅂ, ㅂㅇ, ㄷㅇ/);
    await page.locator('#printMenuButton').click();await page.locator('#printMenuList [data-print-mode="problem"]').click();await page.waitForFunction(()=>document.body.dataset.printMode==='problem');await page.emulateMedia({media:'print'});await page.setViewportSize({width:794,height:1123});await page.evaluate(()=>document.fonts.ready);
    await checkLabels(page,group.targets,`${group.unit} ${width}px A4`);
    assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(es=>es.map(e=>e.querySelectorAll('.question-item').length)),[4]);
    const overlaps=await page.locator('#problemView .question-item').evaluateAll(es=>es.map(e=>e.querySelector('.question-prompt').getBoundingClientRect().bottom-e.querySelector('.answer-line').getBoundingClientRect().top));
    assert(overlaps.every(n=>n<=1),'questions fit above answer lines');
    if(process.env.MAC_CHECK_OUTPUT){const pdf=await page.pdf({path:path.join(process.env.MAC_CHECK_OUTPUT,`${group.unit}-${width}.pdf`),format:'A4',printBackground:true,preferCSSPageSize:true});assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1);}
    assert.deepEqual(errors,[]);await context.close();
  }}finally{await browser.close();}
  console.log('PASS: three diagrams retain all labels and four-up A4 layout');
})().catch(error=>{console.error(error);process.exitCode=1;});
