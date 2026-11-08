"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932";
const original=require("./source-5-2-u5-page108-practice.js"),api=require("./source-5-2-u5-string-height-similar.js"),root={HSE_SOURCE52_U5_P108_PRACTICE:original};
for(let i=0;i<api.cases.length;i++){
  const [w,d,h,knot]=api.cases[i],q=api.build(root,i),source=original.build(11),total=2*(w+h)+2*(d+h)+knot;
  const possible=Array.from({length:100},(_,j)=>j+1).filter(x=>2*(w+x)+2*(d+x)+knot===total);
  assert.deepEqual(possible,[h]);assert.equal(q.answer,`${h}cm`);
  assert(q.solution.includes(`${total}−${knot}=${total-knot}cm`) && q.solution.includes(`${h}cm`),"매듭과 높이 풀이");
  for(const length of [w,d,knot,total])assert(q.prompt.includes(`${length}cm`));
  assert.equal((q.prompt.match(/<path /g)||[]).length,(source.prompt.match(/<path /g)||[]).length);
  assert.equal((q.prompt.match(/<svg /g)||[]).length,1);
}
assert.equal(api.cases.length,9);
assert.equal(api.build(root,api.cases.length),null);
(async()=>{const browser=await chromium.launch({headless:true});try{
  for(const width of [1280,375]){
    const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
    await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    await context.addInitScript(()=>{window.print=()=>{};});const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(`${origin}/hselementary/question-bank/`);await page.locator("#gradeFilter [data-grade='5']").click();await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u5");await page.locator("#typeList input[data-type-id='5-2-u5-t4-4']").check();
    await page.locator("#questionCountInput").fill("9");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
    const prompts=page.locator(`#problemView [data-source-item-id='${api.source}']`);assert.equal(await prompts.count(),9);
    assert.deepEqual((await prompts.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.poolIndex)))).sort(),[0,1,2,3,4,5,6,7,8]);assert.equal(await prompts.locator("svg").count(),9);
    assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);await page.locator("#solutionTab").click();
    const solutions=page.locator(`#solutionView [data-source-answer='${api.source}']`);
    assert.equal(await solutions.count(),9);
    for(let i=0;i<api.cases.length;i++) {
      const answer=`${api.cases[i][2]}cm`;
      assert((await solutions.nth(i).innerText()).includes(answer), `화면 풀이 ${i+1}번 높이`);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ["problem","solution"]){
      await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
      const file=path.join(process.env.MAC_CHECK_OUTPUT,`string-height-${mode}.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
      if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+3\b/);await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
    }
    assert.deepEqual(errors,[]);await context.close();
  }
}finally{await browser.close();}console.log("PASS: nine independently checked source-structure variants, PC/mobile and A4");})().catch(e=>{console.error(e);process.exitCode=1;});
