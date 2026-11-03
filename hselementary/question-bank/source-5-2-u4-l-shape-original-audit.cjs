"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const api=require("./source-5-2-u4-l-shape-original.js"),original=require("./source-5-2-decimal-page101-practice.js");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932",q=api.build(0),whole=original.build(28);
assert.equal((154*73-70*26)/100,94.22);assert.equal(((154-70)*26+154*(73-26))/100,94.22);
assert.equal(q.answer,"94.22cm²");assert.match(whole.answer,/13\.208.*94\.22/);
for(const text of ["M218 30 H302 V56 H372 V103 H218 Z","7.3cm","2.6cm","7cm","15.4cm"])assert(q.prompt.includes(text)&&whole.prompt.includes(text));
assert.equal(api.build(1),null);
(async()=>{const browser=await chromium.launch({headless:true});try{
 for(const width of [1280,375]){
  const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());await context.addInitScript(()=>{window.print=()=>{};});
  const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));await page.goto(`${origin}/hselementary/question-bank/`);
  await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();await page.locator("#unitFilter").selectOption("5-2-u4");
  for(const id of [api.typeId,"5-2-u4-practice-1-original","5-2-u4-practice-6-original","5-2-u4-practice-7-original"])await page.locator(`#typeList input[data-type-id='${id}']`).check();
  await page.locator("#questionCountInput").fill("4");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
  assert.equal(await page.locator("#problemView .question-item").count(),4);assert.equal(await page.locator(`#problemView [data-source-item-id='${api.source}'] svg`).count(),1);assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
  await page.locator("#solutionTab").click();const solution=page.locator(`#solutionView [data-source-answer='${api.source}']`);await solution.waitFor({state:"visible"});assert.match(await solution.innerText(),/94\.22/);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ["problem","solution"]){await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);const file=path.join(process.env.MAC_CHECK_OUTPUT,`l-shape-${mode}.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));}
  assert.deepEqual(errors,[]);await context.close();
 }
}finally{await browser.close();}console.log("PASS: original part 28(2), independent area calculations, PC/mobile and A4");})().catch(e=>{console.error(e);process.exitCode=1;});
