"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8932";
const ids = ["5-2-u5-t2-5", ...[18, 20, 24].map(n => `5-2-u5-practice-${n}-original`)];
(async () => {
  const browser = await chromium.launch({headless:true});
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({viewport:{width,height:1000},serviceWorkers:"block"});
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_CURRICULUM);
      const result = await page.evaluate(() => {
        const types = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
        const type = types.find(t => t.id === "5-2-u5-t2-5");
        const source = types.find(t => t.id === "5-2-u5-practice-17-original");
        const generate = t => window.HSE_GENERATORS.generate(t,0,0,0,0);
        const linked = generate(type), original = generate(source);
        return {type, linked, samePrompt:linked.prompt === original.prompt, sameAnswer:linked.answer === original.answer,
          rejected:window.HSE_GENERATORS.generate(type,0,0,0,1) === null,
          locked:window.HSE_GENERATORS.generate({...type,reviewLocked:true},0,0,0,0) === null};
      });
      assert.equal(result.type.verifiedVariantCount,1);
      assert.equal(result.type.publisherKeyVerified,false);
      assert.equal(result.linked.answer,"②, ③, ⑧, ⑨");
      assert(result.samePrompt && result.sameAnswer && result.rejected && result.locked);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      assert.equal(await page.locator("#problemView .question-item").count(),4);
      const linked = page.locator("#problemView [data-source-item-id='5-2-u5-practice-17-original']");
      assert.equal(await linked.count(),1);
      assert.equal(await linked.locator("svg").count(),1);
      assert.equal(await page.locator("#problemView [data-source-answer]").count(),0);
      const net18 = page.locator("#problemView [data-source-item-id='5-2-u5-practice-18-original'] svg");
      const label = await net18.getAttribute("aria-label");
      assert.match(label,/24cm.*48cm.*54cm/);
      assert.doesNotMatch(label,/12cm/);
      await page.locator("#solutionTab").click();
      await page.locator("#solutionView [data-source-answer='5-2-u5-practice-17-original']").waitFor({state:"visible"});
      assert.match(await page.locator("#solutionView [data-source-answer='5-2-u5-practice-17-original']").innerText(),/②, ③, ⑧, ⑨/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem","solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode,mode);
          if (mode === "problem") {
            await page.emulateMedia({media:"print"});
            const measurement = await net18.locator("text").filter({hasText:"48cm"}).boundingBox();
            const vertices = await net18.locator("text").filter({hasText:/^[ㅌㅋ]$/}).evaluateAll(nodes => nodes.map(node => {const r=node.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
            assert.equal(vertices.length,2);
            for (const vertex of vertices) assert(measurement.y + measurement.height <= vertex.top || measurement.x + measurement.width <= vertex.left || measurement.x >= vertex.right, "length label must not overlap a vertex label");
          }
          const file = path.join(process.env.MAC_CHECK_OUTPUT,`net17-${mode}.pdf`);
          await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
          if (mode === "problem") assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+1\b/);
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
          await page.emulateMedia({media:"screen"});
        }
      }
      assert.deepEqual(errors,[]);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: source 17 link, guarded generation, desktop/mobile and four-question A4");
})().catch(error => {console.error(error);process.exitCode=1;});
