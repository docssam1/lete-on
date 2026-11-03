"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932";
const api=require("./source-5-2-u4-tunnel-time-similar.js");
for(let i=0;i<api.cases.length;i++){
  const [tenths,seconds,train]=api.cases[i],q=api.build(i);
  const totalMeters=tenths*100*seconds/600,answerMeters=totalMeters-train;
  assert(Number.isInteger(totalMeters));assert.equal(q.answer,`${answerMeters/1000}km`);
  assert.equal((answerMeters+train)*600,tenths*100*seconds);
  assert(q.prompt.includes(`${tenths/10}km`)&&q.prompt.includes(`${train}m`));
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
    await page.locator("#unitFilter").selectOption("5-2-u4");await page.locator("#typeList input[data-type-id='5-2-u4-t1-9']").check();
    await page.locator("#questionCountInput").fill("4");await page.locator("#difficultyFilter [data-difficulty='0']").click();await page.locator("#generateButton").click();
    await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
    assert.equal(await page.locator("#problemView .question-item").count(),4);
    const variants=await page.locator(`#problemView [data-source-item-id='${api.source}']`).evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.poolIndex)).sort());
    assert.deepEqual(variants,[0,1,2,3]);assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
    await page.locator("#solutionTab").click();assert.equal(await page.locator(`#solutionView [data-source-answer='${api.source}']`).count(),4);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    if(width===1280&&process.env.MAC_CHECK_OUTPUT)for(const mode of ["problem","solution"]){
      await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();await page.locator("#printMenuButton").click();await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
      await page.emulateMedia({media:"print"});await page.evaluate(async()=>{await document.fonts.load('400 10.5pt "Noto Serif KR"','가나다 123');await document.fonts.ready;});
      const font=await page.locator(mode==="problem"?`.p68practice-question[data-source-item-id='${api.source}']`:`.p68practice-solution[data-source-answer='${api.source}']`).first().evaluate(el=>getComputedStyle(el).fontFamily);
      assert.match(font,/Noto Serif KR/);assert(await page.evaluate(()=>document.fonts.check('400 10.5pt "Noto Serif KR"','가나다 123')));
      const file=path.join(process.env.MAC_CHECK_OUTPUT,`tunnel-time-${mode}.pdf`);await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
      if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));await page.emulateMedia({media:"screen"});
    }
    assert.deepEqual(errors,[]);await context.close();
  }
}finally{await browser.close();}console.log("PASS: four independent tunnel time cases, PC/mobile and A4");})().catch(e=>{console.error(e);process.exitCode=1;});
