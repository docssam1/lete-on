"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932";
const api=require("./source-5-2-u6-equal-step-average-linked.js");
for(let i=0;i<api.cases.length;i++){
  const {mean,gap}=api.cases[i],q=api.build(i), candidates=[];
  for(let a=1;a<=mean*3;a++)for(let b=a+1;b<=mean*3;b++){
    const c=3*mean-a-b;
    if(c>b && b-a===gap && c-b===gap)candidates.push([a,b,c]);
  }
  assert.equal(candidates.length,1);
  assert.equal(q.answer,`A ${candidates[0][0]}, B ${candidates[0][1]}, C ${candidates[0][2]}`);
}
assert.equal(api.build(4),null);
(async()=>{const browser=await chromium.launch({headless:true});try{
  for(const width of [1280,375]){
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
    await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    await context.addInitScript(()=>{window.print=()=>{};});
    const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(`${origin}/hselementary/question-bank/`);
    await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u6");await page.locator("#typeList input[data-type-id='5-2-u6-t1-6']").check();
    await page.locator("#questionCountInput").fill("4");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
    await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
    assert.equal(await page.locator("#problemView .question-item").count(),4);
    const variants=await page.locator(`#problemView [data-source-item-id='${api.source}']`).evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.poolIndex)).sort());
    assert.deepEqual(variants,[0,1,2,3]);assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
    await page.locator("#solutionTab").click();assert.equal(await page.locator(`#solutionView [data-source-answer='${api.source}']`).count(),4);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ["problem","solution"]){
      await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
      const file=path.join(process.env.MAC_CHECK_OUTPUT,`equal-step-${mode}.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
      if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
    }
    assert.deepEqual(errors,[]);await context.close();
  }
}finally{await browser.close();}console.log("PASS: four independent equal-step cases, PC/mobile and A4");})().catch(e=>{console.error(e);process.exitCode=1;});
