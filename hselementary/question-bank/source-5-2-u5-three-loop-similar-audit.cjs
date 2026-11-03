"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932";
const original=require("./source-5-2-u5-page108-practice.js"),api=require("./source-5-2-u5-three-loop-similar.js"),root={HSE_SOURCE52_U5_P108_PRACTICE:original};
for(let i=0;i<api.cases.length;i++){
  const [w,d,h]=api.cases[i],q=api.build(root,i),source=original.build(10);
  assert.equal(q.answer,`${4*w+4*d+4*h}cm`);
  for(const length of [w,d,h])assert(q.prompt.includes(`${length}cm`));
  assert.equal((q.prompt.match(/<path /g)||[]).length,(source.prompt.match(/<path /g)||[]).length);
  assert.equal((q.prompt.match(/<svg /g)||[]).length,1);
}
assert.equal(api.build(root,4),null);
(async()=>{const browser=await chromium.launch({headless:true});try{
  for(const width of [1280,375]){
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
    await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    await context.addInitScript(()=>{window.print=()=>{};});const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(`${origin}/hselementary/question-bank/`);await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u5");await page.locator("#typeList input[data-type-id='5-2-u5-t4-2']").check();
    await page.locator("#questionCountInput").fill("4");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
    const prompts=page.locator(`#problemView [data-source-item-id='${api.source}']`);assert.equal(await prompts.count(),4);
    assert.deepEqual((await prompts.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.poolIndex)))).sort(),[0,1,2,3]);assert.equal(await prompts.locator("svg").count(),4);
    assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);await page.locator("#solutionTab").click();assert.equal(await page.locator(`#solutionView [data-source-answer='${api.source}']`).count(),4);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ["problem","solution"]){
      await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
      const file=path.join(process.env.MAC_CHECK_OUTPUT,`three-loop-${mode}.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
      if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
    }
    assert.deepEqual(errors,[]);await context.close();
  }
}finally{await browser.close();}console.log("PASS: four independently checked source-structure variants, PC/mobile and A4");})().catch(e=>{console.error(e);process.exitCode=1;});
