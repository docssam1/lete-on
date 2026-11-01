"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = Array.from({ length: 6 }, (_, i) => `5-2-u2-e3-mission-${i + 1}-synthetic`);
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u2");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("18");
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [1, 2, 3, 4, 5, 6].map(n => window[`HSE_SOURCE_52_U2_PAGE19_MISSION${n}`]);
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: modules[ids.indexOf(id)]?.build(variant, 0).answer };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => e.innerText) };
      }, ids);
      assert.equal(data.problems.length, 18);
      assert.equal(data.solutions.length, 18);
      const compact = s => s.replace(/[\s/]/g, "").replace(/²/g, "2");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => assert(p.answer && compact(data.solutions[i]).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`));
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 18 mixed problems match their solutions on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
