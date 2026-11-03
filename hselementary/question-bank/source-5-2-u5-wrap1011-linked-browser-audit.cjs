"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8932";
const ids = ["5-2-u5-practice-10-original","5-2-u5-t4-4","5-2-u5-practice-12-original","5-2-u5-practice-14-original"];
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1280,375]) {
      const context = await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
      await context.route("**/*",route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => {window.print=()=>{};});
      const page=await context.newPage(), errors=[];
      page.on("pageerror",error=>errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.waitForFunction(()=>window.HSE_GENERATORS && window.HSE_CURRICULUM);
      const values=await page.evaluate(()=>{
        const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types)));
        return [["5-2-u5-practice-10-original",10],["5-2-u5-t4-4",11]].map(([id,n])=>{
          const type=types.find(t=>t.id===id), original=types.find(t=>t.id===`5-2-u5-practice-${n}-original`);
          const generate=(t,v=0)=>window.HSE_GENERATORS.generate(t,0,0,0,v);
          const linked=generate(type), source=generate(original);
          return {answer:linked.answer,samePrompt:linked.prompt===source.prompt,sameAnswer:linked.answer===source.answer,
            count:type.verifiedVariantCount,publisherKeyVerified:type.publisherKeyVerified,
            locked:generate({...type,reviewLocked:true})===null,otherVariant:generate(type,1)===null};
        });
      });
      assert.deepEqual(values.map(x=>x.answer),["240cm","12cm"]);
      assert(values.every(x=>x.samePrompt&&x.sameAnswer&&x.count===1&&!x.publisherKeyVerified&&x.locked&&x.otherVariant));
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      for(const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(()=>!document.querySelector("#worksheet").hidden);
      assert.equal(await page.locator("#problemView .question-item").count(),4);
      for(const n of [10,11]) assert.equal(await page.locator(`#problemView [data-source-item-id='5-2-u5-practice-${n}-original']`).count(),1);
      assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
      await page.locator("#solutionTab").click();
      for(const n of [10,11]) await page.locator(`#solutionView [data-source-answer='5-2-u5-practice-${n}-original']`).waitFor({state:"visible"});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth+1),false);
      if(width===1280 && process.env.MAC_CHECK_OUTPUT) for(const mode of ["problem","solution"]) {
        await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
        const file=path.join(process.env.MAC_CHECK_OUTPUT,`wrap1011-${mode}.pdf`);
        await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
        if(mode==="problem")assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);
        await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
      }
      assert.deepEqual(errors,[]);
      await context.close();
    }
  } finally {await browser.close();}
  console.log("PASS: original problems 10 and 11 linked, guarded, printed and rendered");
})().catch(error=>{console.error(error);process.exitCode=1;});
