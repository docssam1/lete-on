"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const {chromium} = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const api = require("./source-5-2-u5-unit-cube-count-practice.js");
const grid = require("./source-5-2-u5-cuboid-grid-practice.js");
const id = api.source;
const root = {HSE_SOURCE52_U5_GRID_PRACTICE:grid};
const expected=[12,16,20,24,30,40,48,45,50];
assert.equal(api.cases.length,9);
for (let i=0;i<api.cases.length;i++) {
  const [w,h,d]=api.cases[i],q=api.build(root,i);
  let count=0;
  for(let x=0;x<w;x++) for(let y=0;y<h;y++) for(let z=0;z<d;z++) count++;
  assert.equal(count,expected[i]);assert.equal(q.answer,`${count}개`);
  assert(q.solution.includes(`${count}개`));
  assert.match(q.prompt,/선을 모두 따라/);
  for(const [role,n] of [["front-vertical",w-1],["top-width",w-1],["front-horizontal",h-1],["side-height",h-1],["top-depth",d-1],["side-depth",d-1]])
    assert.equal((q.prompt.match(new RegExp(`data-grid-line="${role}"`,"g"))||[]).length,n);
}
assert.equal(api.build(root,9),null);
const runtime={HSE_SOURCE52_U5_GRID_PRACTICE:grid,HSE_GENERATORS:{generatorKey:()=>'',generate:()=>null,names:[]}};
assert(api.install(runtime));
const good={id:api.typeId,sourceItemId:api.source,generatorKey:api.key,sourceVerified:true,reviewLocked:false};
assert.equal(runtime.HSE_GENERATORS.generatorKey(good),api.key);
assert.equal(runtime.HSE_GENERATORS.generate({...good,reviewLocked:true},0,0,0,0),null);
assert.equal(runtime.HSE_GENERATORS.generate({...good,sourceVerified:false},0,0,0,0),null);
assert.equal(runtime.HSE_GENERATORS.generate(good,0,0,0,0).answer,'12개');
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
      await page.waitForFunction(()=>window.HSE_U5_UNIT_CUBE_COUNT_PRACTICE && window.HSE_GENERATORS);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      const input=page.locator(`#typeList input[data-type-id='${api.typeId}']`);
      assert.equal(await input.isDisabled(),false);
      await input.check();
      await page.locator("#questionCountInput").fill("9");
      await page.locator("#generateButton").click();
      await page.waitForSelector(`#problemView [data-source-item-id='${id}']`);
      const questions=page.locator(`#problemView [data-source-item-id='${id}']`);
      assert.equal(await questions.count(),9);
      assert.deepEqual(await questions.evaluateAll(xs=>xs.map(x=>x.dataset.poolIndex)),["0","1","2","3","4","5","6","7","8"]);
      assert.equal(await questions.locator("svg[role='img']").count(),9);
      assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
      assert.deepEqual(await page.locator("#problemView .print-page").evaluateAll(xs=>xs.map(x=>x.querySelectorAll(".question-item").length)),[4,4,1]);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      await page.locator("#solutionTab").click();
      const solutions=page.locator(`#solutionView [data-source-answer='${id}']`);
      assert.equal(await solutions.count(),9);
      for(let i=0;i<9;i++) assert((await solutions.nth(i).innerText()).includes(expected.map(n=>`${n}개`)[i]));
      if(width===1280 && process.env.MAC_CHECK_OUTPUT) {
        for(const mode of ["problem","solution"]) {
          await page.locator(mode==="problem"?"#problemTab":"#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode=>document.body.dataset.printMode===mode,mode);
          const pdf=await page.pdf({path:path.join(process.env.MAC_CHECK_OUTPUT,`unit-cube-${mode}.pdf`),format:"A4",printBackground:true,preferCSSPageSize:true});
          assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)||[]).length,mode==="problem"?3:2,`${mode}: expected A4 pages`);
          await page.evaluate(()=>window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors,[]);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: nine unit cube exercises and matching solutions on desktop and mobile; four-up A4 problems and solution pages");
})().catch(error=>{console.error(error);process.exitCode=1;});
