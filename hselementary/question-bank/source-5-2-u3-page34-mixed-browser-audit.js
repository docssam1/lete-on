"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = ["5-2-u3-e6-exploration-mirror-synthetic", "5-2-u3-e6-example-1-fold-cut-synthetic", "5-2-u3-e6-example-2-fold-area-synthetic", "5-2-u3-e6-example-3-palindrome-synthetic", "5-2-u3-e6-example-4-two-mirror-synthetic"];
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
      await page.locator("#questionCountInput").fill("15");
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [window.HSE_SOURCE_52_MIRROR_PATH, window.HSE_SOURCE_52_FOLD_CUT_COUNT, window.HSE_SOURCE_52_FOLD_RECTANGLE_AREA, window.HSE_SOURCE_52_PALINDROME, window.HSE_SOURCE_52_TWO_MIRROR_BOUNCES];
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id][data-pool-index]");
          const id = marker?.dataset.sourceItemId, variant = Number(marker?.dataset.poolIndex);
          return { id, variant, answer: modules[ids.indexOf(id)]?.makeQuestion(variant, 0).answer, figures: item.querySelectorAll("svg").length };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => e.innerText) };
      }, ids);
      assert.equal(data.problems.length, 15);
      assert.equal(data.solutions.length, 15);
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      assert.equal(await page.locator('#solutionView [data-source-answer^="5-2-u3-e6-"]').count(), 15, 'each solution has its source marker');
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i]).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
        if (p.id !== ids[3]) assert(p.figures >= 1, `problem ${i + 1} includes its figure`);
      });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          await page.emulateMedia({ media: "print" });
          if (mode === "problem") {
            await page.evaluate(() => document.fonts.ready);
            const figures = await page.locator('#problemView [data-fold-rectangle="problem"]').evaluateAll(nodes => nodes.map(svg => {
              const box = svg.getBoundingClientRect(), answer = svg.closest('.question-item').querySelector('.answer-line').getBoundingClientRect();
              const labels = [...svg.querySelectorAll('text')].map(text => { const b = text.getBBox(); return { left:b.x, right:b.x+b.width, top:b.y, bottom:b.y+b.height }; });
              return { width:box.width, bottom:box.bottom, answerTop:answer.top, labels };
            }));
            assert.equal(figures.length, 3);
            assert(figures.every(f => f.width >= 235 && f.bottom <= f.answerTop + 1), "fold figures remain legible and inside their cells");
            assert(figures.every(f => f.labels.every(b => b.left >= 0 && b.right <= 450 && b.top >= 0 && b.bottom <= 430)), "fold labels fit inside the SVG");
          }
          const file = path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`);
          await page.pdf({ path:file, format:"A4", printBackground:true, preferCSSPageSize:true });
          if (mode === "problem") assert.match(execFileSync("pdfinfo", [file], {encoding:"utf8"}), /^Pages:\s+4$/m, "15 questions fit four A4 pages without blanks");
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
          await page.emulateMedia({ media: null });
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 15 geometry problems match their solutions on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
