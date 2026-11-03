"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const {chromium} = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u5-e1-mission-1-grid-synthetic";
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    for(const width of [1280,375]) {
      const context=await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
      await context.route("**/*",route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      await context.addInitScript(()=>{window.print=()=>{};});
      const page=await context.newPage(),errors=[];
      page.on("pageerror",error=>errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.waitForFunction(()=>window.HSE_SOURCE52_U5_GRID_PRACTICE && window.HSE_GENERATORS);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      const input=page.locator(`#typeList input[data-type-id='${id}']`);
      assert.equal(await input.isDisabled(),false);
      await input.check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator("#generateButton").click();
      await page.waitForSelector(`#problemView [data-source-item-id='${id}']`);
      const questions=page.locator(`#problemView [data-source-item-id='${id}']`);
      assert.equal(await questions.count(),4);
      assert.deepEqual(await questions.evaluateAll(xs=>xs.map(x=>x.dataset.poolIndex)),["0","1","2","3"]);
      assert.equal(await questions.locator("svg[role='img']").count(),4);
      assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
      assert.deepEqual(await page.locator("#problemView .print-page").evaluateAll(xs=>xs.map(x=>x.querySelectorAll(".question-item").length)),[4]);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      await page.locator("#solutionTab").click();
      const solutions=page.locator(`#solutionView [data-source-answer='${id}']`);
      assert.equal(await solutions.count(),4);
      for(let i=0;i<4;i++) assert((await solutions.nth(i).innerText()).includes(["180개","135개","270개","450개"][i]));
      if(width===1280 && process.env.MAC_CHECK_OUTPUT) {
        for(const mode of ["problem","solution"]) {
          await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
          const pdf=await page.pdf({path:path.join(process.env.MAC_CHECK_OUTPUT,`grid-${mode}.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});
          assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)||[]).length,mode==="problem"?1:2,`${mode}: expected A4 pages`);
          await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors,[]);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: four grid exercises and matching solutions on desktop and mobile; four-up A4 problems and two solution pages");
})().catch(error=>{console.error(error);process.exitCode=1;});
