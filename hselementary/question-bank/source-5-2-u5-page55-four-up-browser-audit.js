"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = [1,2,3,4,5,6].map(n => `5-2-u5-e4-mission-${n}`);
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE_52_CUBOID_PAGE55_M1 && window.HSE_SOURCE_52_CUBOID_PAGE55_M6);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("6");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const types = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: window.HSE_GENERATORS.generate(types.find(t => t.id === id), 0, 0, 0, variant).answer, automaticGrading: window.HSE_GENERATORS.generate(types.find(t => t.id === id), 0, 0, 0, variant).automaticGrading, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => ({ text: e.innerText, figures: e.querySelectorAll("svg").length })) };
      }, ids);
      assert.equal(data.problems.length, 6);
      assert.equal(data.solutions.length, 6);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.question-item').length)), [4, 2], 'four questions per page, except the final remainder');
      assert.deepEqual(await page.locator('#solutionView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.solution-item').length)), [1, 1, 1, 1, 1, 1], 'long illustrated explanations need their own numbered pages');
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      assert.doesNotMatch(await page.locator('#problemView').innerText(), /도움말|힌트|풀이할 때/);
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
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
            await page.emulateMedia({ media: "print" });
            await page.setViewportSize({ width: 794, height: 1123 });
            const figure = await page.locator('#problemView .source52-p55m4-diagram').evaluate(svg => {
              const image = svg.getBoundingClientRect(), answer = svg.closest('.question-item').querySelector('.answer-line').getBoundingClientRect();
              return { height: image.height, bottom: image.bottom, answerTop: answer.top };
            });
            assert(figure.height >= 200 && figure.bottom <= figure.answerTop, 'dice remain large enough to count and clear of the answer line');
          }
          const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          const physicalPages = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
          assert.equal(physicalPages, mode === "problem" ? 2 : 6, `${mode} must fit its numbered A4 pages`);
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
          await page.emulateMedia({ media: "screen" });
          await page.setViewportSize({ width, height: 1000 });
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: six dice missions match their solutions on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
