"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = ["5-2-u3-e5-example-1-reflection-synthetic"];
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
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("3");
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [window.HSE_SOURCE_52_SLANTED_REFLECTION];
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).answer, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => e.innerText) };
      }, ids);
      assert.equal(data.problems.length, 3);
      assert.equal(data.solutions.length, 3);
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      assert.equal(await page.locator('#solutionView [data-source-answer="5-2-u3-e5-example-1-reflection-synthetic"]').count(), 3, 'each solution has its source marker');
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i]).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
        assert(p.figures >= 1, `problem ${i + 1} includes its figure`);
      });
      if (process.env.MAC_CHECK_OUTPUT) await page.screenshot({path:path.join(process.env.MAC_CHECK_OUTPUT, `problem-${width}.png`),fullPage:true});
      await page.locator("#solutionTab").click();
      if (process.env.MAC_CHECK_OUTPUT) await page.screenshot({path:path.join(process.env.MAC_CHECK_OUTPUT, `solution-${width}.png`),fullPage:true});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          await page.emulateMedia({ media: "print" });
          const selector = mode === "problem" ? `[data-source-item-id="${ids[0]}"]` : `[data-source-answer="${ids[0]}"]`;

          assert(await page.evaluate(() => document.fonts.load('12px "Noto Serif KR"').then(fonts => fonts.length > 0)), "print serif font is available");
          assert.match(await page.locator(selector).first().evaluate(el => getComputedStyle(el).fontFamily), /Noto Serif KR/, `${mode} uses the print serif font`);
          if (mode === "problem") {
            const figures = await page.locator("#problemView .question-item").evaluateAll(items => items.map(item => {
              const svg = item.querySelector("svg").getBoundingClientRect();
              const answer = item.querySelector(".answer-line").getBoundingClientRect();
              return { width: svg.width, bottom: svg.bottom, answerTop: answer.top };
            }));
            assert(figures.every(figure => figure.width >= 270 && figure.bottom <= figure.answerTop + 1), "drawing grids are large enough and do not overlap answer lines");
          }
          await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
          await page.emulateMedia({ media: null });
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 3 slanted reflection problems and solutions on desktop, mobile, and A4");
})().catch(error => { console.error(error); process.exitCode = 1; });
