"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), http = require("node:http"), path = require("node:path"), test = require("node:test");
const { chromium } = require("playwright");
let browser, server, base;
function fixturePdf(count) {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Count ${count} /Kids [${Array.from({length:count},(_,n)=>`${4+n*2} 0 R`).join(" ")}] >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  for (let n=0;n<count;n++) {
    const text=`BT /F1 18 Tf 40 740 Td (${n+1}.) Tj 0 -35 Td (Reader QA page ${n+1}) Tj 0 -35 Td (Choose an answer without revealing the solution.) Tj ET`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+n*2} 0 R >>`, `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`);
  }
  let value="%PDF-1.4\n",offsets=[0];objects.forEach((object,i)=>{offsets.push(Buffer.byteLength(value));value+=`${i+1} 0 obj\n${object}\nendobj\n`;});
  const xref=Buffer.byteLength(value);value+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(value);
}
test.before(async()=>{
  const root=path.resolve(__dirname,"..");server=http.createServer((req,res)=>{const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader("Content-Type",({".mjs":"text/javascript",".js":"text/javascript",".html":"text/html",".css":"text/css",".wasm":"application/wasm"})[path.extname(file)]||"application/octet-stream");fs.createReadStream(file).pipe(res);});
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));base=`http://127.0.0.1:${server.address().port}`;
  browser=await chromium.launch({headless:true,executablePath:process.env.GFIELD_CHROME_EXECUTABLE});
});
test.after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
async function setup(count=3,width=1440){const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://live.poshenloh.com/images/past-contests/pdf/**',route=>route.fulfill({contentType:'application/pdf',headers:{'access-control-allow-origin':'*'},body:fixturePdf(count)}));return {page,context,errors};}
async function ready(page,number=1){await page.waitForFunction(n=>document.getElementById('paper-book').dataset.renderState==='ready'&&document.getElementById('book-sheet').dataset.page===String(n),number);}
async function open(page,query='grade=7&program=amc8&year=2025'){await page.goto(base+'/competition-paper-review.html?'+query);await page.locator('#book-open').click();await ready(page);}
async function printed(page,pages){await page.waitForFunction(wanted=>document.querySelector('.paper-book-print-frame')?.dataset.pages===wanted,pages);assert.match(await page.locator('#book-print-status').textContent(),/인쇄 창/);}

test('reader loads only on request, navigates and zooms while answers survive reload and stay out of diagnostic summaries',async()=>{
 const {page,context,errors}=await setup();let requests=0;page.on('request',r=>{if(r.url().endsWith('.pdf'))requests++});await page.goto(base+'/competition-paper-review.html?grade=7&program=amc8&year=2025');assert.equal(requests,0);
 await page.locator('#book-open').click();await ready(page);assert.equal(requests,1);assert.match(await page.locator('#book-sheet').textContent(),/Reader QA page 1/);
 await page.locator('#book-next').click();await ready(page,2);await page.locator('#book-page').fill('99');await page.locator('#book-page').press('Enter');assert.equal(await page.locator('#book-page').inputValue(),'2');assert.equal(await page.locator('.review-report').isVisible(),false);
 await page.locator('#book-zoom').selectOption('2');await ready(page,2);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.locator('#book-answer-jump').click();await page.locator('[data-question="1"][data-field="answer"]').selectOption('E');await page.locator('#book-next').click();await ready(page,3);assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'E');
 await page.reload();await ready(page,3);assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'E');assert.equal(await page.locator('[data-question="1"][data-field="status"]').inputValue(),'unmarked');
 await page.locator('#apply-answer-key').click();await page.locator('.review-form-actions button[type=submit]').click();await page.locator('#review-exam-date').fill('2026-11-17');await page.locator('#save-diagnostic').click();const stored=await page.evaluate(()=>localStorage.getItem('gmap-local-learning-record-v1:competition-diagnostic-history-v1'));assert.doesNotMatch(stored,/"answers"|"responses"|"questionNumber"/);
 await page.locator('#archive-year').selectOption('2024');assert.equal(await page.locator('#book-sheet canvas').count(),0);assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'');assert.equal(await page.locator('#book-open').isVisible(),true);
 await page.locator('#archive-year').selectOption('2025');await ready(page,3);assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'E');await page.locator('#clear-marks').click();assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'');await page.reload();assert.equal(await page.locator('#book-open').isVisible(),true);
 assert.deepEqual(errors,[]);await context.close();
});

test('printing renders exactly all, current or selected original pages and rejects invalid ranges',async()=>{
 const {page,context,errors}=await setup();await open(page);await page.locator('#book-next').click();await ready(page,2);
 await page.locator('#book-print').click();await page.locator('#book-print-scope').selectOption('range');await page.locator('#book-print-pages').fill('4, 1');await page.locator('#book-print-confirm').click();assert.match(await page.locator('#book-print-error').textContent(),/쪽 번호/);assert.equal(await page.locator('.paper-book-print-frame').count(),0);
 await page.locator('#book-print-pages').fill('3, 1-2, 2');await page.locator('#book-print-confirm').click();await printed(page,'1,2,3');assert.equal(await page.locator('.paper-book-print-frame').contentFrame().locator('.sheet').count(),3);assert.equal(await page.locator('#book-sheet').getAttribute('data-page'),'2');
 await page.locator('#book-print-scope').selectOption('current');await page.locator('#book-print-confirm').click();await printed(page,'2');assert.equal(await page.locator('.paper-book-print-frame').contentFrame().locator('img').count(),1);
 await page.locator('#book-print-scope').selectOption('all');await page.locator('#book-print-confirm').click();await printed(page,'1,2,3');
 await page.locator('#book-print-scope').selectOption('review');await page.locator('#book-print-confirm').click();await page.waitForFunction(()=>document.getElementById('book-print-error').textContent.includes('먼저 채점'));await page.locator('#book-print-cancel').click();
 assert.equal(await page.locator('#book-print-dialog').isVisible(),false);assert.deepEqual(errors,[]);await context.close();
});

test('review printing uses only a complete heading map and keeps continuation pages',async()=>{
 const {page,context}=await setup(25);await open(page);await page.locator('#book-detail-marks').click();await page.locator('[data-question="3"][data-field="status"]').selectOption('wrong');await page.locator('#book-print').click();await page.locator('#book-print-scope').selectOption('review');await page.locator('#book-print-confirm').click();await printed(page,'3,4');await context.close();
 const other=await setup(3);await open(other.page);await other.page.locator('#book-detail-marks').click();await other.page.locator('[data-question="3"][data-field="status"]').selectOption('wrong');await other.page.locator('#book-print').click();await other.page.locator('#book-print-scope').selectOption('review');await other.page.locator('#book-print-confirm').click();await other.page.waitForFunction(()=>document.getElementById('book-print-error').textContent.includes('自動')||document.getElementById('book-print-error').textContent.includes('자동으로 구분'));assert.equal(await other.page.locator('.paper-book-print-frame').count(),0);await other.context.close();
});

test('reader and mobile answer tabs fit all three languages and AIME integer drafts keep leading zeros',async()=>{
 const {page,context,errors}=await setup(3,390);await open(page,'grade=9&program=aime&year=2025&form=I');
 for(const locale of ['en','zh-Hans','ko']){
  await page.locator('[data-boarding-content-locale]').selectOption(locale);await page.evaluate(()=>GFIELDContentI18n.refresh());
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,locale+' '+width);}
  await page.setViewportSize({width:390,height:844});await page.locator('#book-tab-answers').click();assert.equal(await page.locator('#paper-answer-panel').isVisible(),true);assert.equal(await page.locator('#paper-book').isVisible(),false);
  await page.locator('[data-question="1"][data-field="answer"]').fill('007');await page.locator('#book-tab-paper').click();assert.equal(await page.locator('#paper-book').isVisible(),true);
  if(locale!=='ko'){assert.doesNotMatch(await page.locator('#paper-book').innerText(),/[가-힣]/);await page.locator('#book-print').click();assert.doesNotMatch(await page.locator('#book-print-dialog').innerText(),/[가-힣]/);await page.locator('#book-print-cancel').click();}
 }
 await page.reload();await ready(page);await page.locator('#book-tab-answers').click();assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'007');assert.deepEqual(errors,[]);await context.close();
});

test('load errors allow retry without losing answers and switching papers cannot show a stale page',async()=>{
 const {page,context,errors}=await setup();let fail=true;await page.route('https://live.poshenloh.com/images/past-contests/pdf/**',route=>fail?route.fulfill({status:404,body:'Not found',headers:{'access-control-allow-origin':'*'}}):route.fulfill({contentType:'application/pdf',headers:{'access-control-allow-origin':'*'},body:fixturePdf(3)}));
 await page.goto(base+'/competition-paper-review.html?grade=7&program=amc8&year=2025');await page.locator('[data-question="1"][data-field="answer"]').selectOption('B');await page.locator('#book-open').click();await page.waitForFunction(()=>document.getElementById('paper-book').dataset.renderState==='error');assert.equal(await page.locator('#book-source').getAttribute('href'),'https://live.poshenloh.com/images/past-contests/pdf/amc8-2025-exam.pdf');assert.equal(await page.locator('[data-question="1"][data-field="answer"]').inputValue(),'B');fail=false;await page.locator('#book-retry').click();await ready(page);
 await page.locator('#archive-year').selectOption('2024');assert.equal(await page.locator('#book-sheet canvas').count(),0);assert.match(await page.locator('#book-identity').textContent(),/2024/);assert.equal(await page.locator('#book-tools').isVisible(),false);assert.deepEqual(errors,[]);await context.close();
});
