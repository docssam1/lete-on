"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = ["5-2-u3-e6-mission-1-fold-fourths-synthetic", "5-2-u3-e6-mission-2-clock-palindrome-synthetic", "5-2-u3-e6-mission-3-wedge-ball-synthetic", "5-2-u3-e6-mission-4-folded-triangle-synthetic", "5-2-u3-e6-mission-5-included-digit-synthetic", "5-2-u3-e6-mission-6-laser-corner-synthetic", "5-2-u3-e7-mission-1-rotated-addition-synthetic", "5-2-u3-e7-mission-2-arrow-overlap-synthetic", "5-2-u3-e7-mission-3-parallelogram-overlap-synthetic", "5-2-u3-e7-mission-4-grid-construction-synthetic", "5-2-u3-e7-mission-5-rotating-triangle-synthetic", "5-2-u3-e7-mission-6-triangle-area-synthetic"];
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE_52_FOLD_FOURTHS_AREA && window.HSE_SOURCE_52_CLOCK_PALINDROME && window.HSE_SOURCE_52_WEDGE_BALL_RETURN && window.HSE_SOURCE_52_FOLDED_TRIANGLE_PIECES && window.HSE_SOURCE_52_PALINDROME_INCLUDED_DIGIT && window.HSE_SOURCE_52_LASER_CORNER && window.HSE_SOURCE_52_ROTATED_NUMBER && window.HSE_SOURCE_52_ARROW_OVERLAP && window.HSE_SOURCE_52_PARALLELOGRAM_OVERLAP && window.HSE_SOURCE_52_GRID_CONSTRUCTION && window.HSE_SOURCE_52_ROTATING_TRIANGLE && window.HSE_SOURCE_52_TWO_CENTERS_AREA);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("36");
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [window.HSE_SOURCE_52_FOLD_FOURTHS_AREA, window.HSE_SOURCE_52_CLOCK_PALINDROME, window.HSE_SOURCE_52_WEDGE_BALL_RETURN, window.HSE_SOURCE_52_FOLDED_TRIANGLE_PIECES, window.HSE_SOURCE_52_PALINDROME_INCLUDED_DIGIT, window.HSE_SOURCE_52_LASER_CORNER, window.HSE_SOURCE_52_ROTATED_NUMBER, window.HSE_SOURCE_52_ARROW_OVERLAP, window.HSE_SOURCE_52_PARALLELOGRAM_OVERLAP, window.HSE_SOURCE_52_GRID_CONSTRUCTION, window.HSE_SOURCE_52_ROTATING_TRIANGLE, window.HSE_SOURCE_52_TWO_CENTERS_AREA];
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).answer, automaticGrading: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).automaticGrading, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => ({ text: e.innerText, figures: e.querySelectorAll("svg").length })) };
      }, ids);
      assert.equal(data.problems.length, 36);
      assert.equal(data.solutions.length, 36);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.question-item').length)), [4, 4, 4, 4, 4, 4, 4, 4, 4], 'four questions per page, except the final remainder');
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
        if (![ids[1],ids[4]].includes(p.id)) assert(p.figures >= 1, `problem ${i + 1} includes its figure`);
        if (![ids[1],ids[4]].includes(p.id)) assert(data.solutions[i].figures >= 1, `solution ${i + 1} includes its figure`);
        if ([ids[9]].includes(p.id)) assert.equal(p.automaticGrading, false, `drawing ${p.id} is manually graded`);
      });
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
  console.log("PASS: 36 mixed problems match their solutions on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
