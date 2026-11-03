"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = ["5-2-u3-e8-exploration-staircase-half-synthetic", "5-2-u3-e8-example-1-circle-difference-synthetic", "5-2-u3-e8-example-2-cut-synthetic", "5-2-u3-e8-example-3-overlap-synthetic", "5-2-u3-e8-example-4-stone-synthetic"];
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE_52_STAIRCASE_HALF && window.HSE_SOURCE_52_CIRCLE_DIFFERENCE && window.HSE_SOURCE_52_CONGRUENT_GRID && window.HSE_SOURCE_52_DOUBLE_OVERLAP && window.HSE_SOURCE_52_STONE_GAME);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("15");
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [window.HSE_SOURCE_52_STAIRCASE_HALF, window.HSE_SOURCE_52_CIRCLE_DIFFERENCE, window.HSE_SOURCE_52_CONGRUENT_GRID, window.HSE_SOURCE_52_DOUBLE_OVERLAP, window.HSE_SOURCE_52_STONE_GAME];
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).answer, automaticGrading: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).automaticGrading, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => ({ text: e.innerText, figures: e.querySelectorAll("svg").length })) };
      }, ids);
      assert.equal(data.problems.length, 15);
      assert.equal(data.solutions.length, 15);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.question-item').length)), [4, 4, 4, 3], 'four questions per page, except the final remainder');
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
        assert(p.figures >= 1, `problem ${i + 1} includes its figure`);
        if (p.id !== ids[4]) assert(data.solutions[i].figures >= 1, `solution ${i + 1} includes its figure`);
        if ([ids[0], ids[4]].includes(p.id)) assert.equal(p.automaticGrading, false, `drawing ${p.id} is manually graded`);
      });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          if (mode === "problem") {
            await page.emulateMedia({media:"print"});
            await page.setViewportSize({width:794,height:1123});
            const conflicts=await page.locator('#problemView .question-item').evaluateAll(items=>items.map(item=>({number:item.querySelector('header b').textContent,prompt:item.querySelector('.question-prompt').getBoundingClientRect().bottom,answer:item.querySelector('.answer-line').getBoundingClientRect().top})).filter(item=>item.prompt>item.answer+1));
            assert.deepEqual(conflicts,[],"문제 내용과 답란이 겹치지 않아야 합니다.");
          }
          const pdfPath=path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`);
          await page.pdf({ path:pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
          if(mode === "problem")assert.match(execFileSync('pdfinfo',[pdfPath],{encoding:'utf8'}),/^Pages:\s+4$/m,'15 problems need four physical pages');
          await page.emulateMedia({media:null});
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 15 geometry problems match their solutions on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
