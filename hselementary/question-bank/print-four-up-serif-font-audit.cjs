"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8936";
const ids = ["5-2-u3-e8-mission-1-double-point-synthetic", "5-2-u3-e8-mission-2-half-synthetic", "5-2-u3-e8-mission-5-rotated-number-synthetic", "5-2-u3-e8-mission-6-flower-ring-synthetic"];
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
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE_52_DOUBLE_POINT && window.HSE_SOURCE_52_COMPOSITE_HALF && window.HSE_SOURCE_52_FLOWER_RING);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("12");
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
      await page.emulateMedia({ media: "print" });
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.fonts.check('400 14px "Noto Serif KR"', '꽃잎')), 'print font is loaded');
      const printed = await page.locator('#problemView .question-item').evaluateAll(items=>items.map(item=>{const p=item.querySelector('.question-prompt p'), prompt=item.querySelector('.question-prompt').getBoundingClientRect(),answer=item.querySelector('.answer-line').getBoundingClientRect();return {font:p&&getComputedStyle(p).fontFamily, weight:p&&getComputedStyle(p).fontWeight,bottom:prompt.bottom,answer:answer.top};}));
      for (const [i,p] of printed.entries()) { assert.match(p.font||'',/Noto Serif KR/,`question ${i+1} uses print serif`); assert.equal(p.weight,'400'); assert(p.bottom<=p.answer+1,`question ${i+1} does not overlap answer`); }
      await page.emulateMedia({ media: null });
      assert.equal(data.problems.length, 12);
      assert.equal(data.solutions.length, 12);
      assert.deepEqual(await page.locator('#problemView .print-page').evaluateAll(pages => pages.map(page => page.querySelectorAll('.question-item').length)), [4, 4, 4], 'four questions per page, except the final remainder');
      assert.equal(await page.locator('#problemView [data-source-answer]').count(), 0, 'answers stay out of problems');
      const compact = s => s.normalize("NFKC").replace(/\s/g, "");
      for (const id of ids) assert.deepEqual(data.problems.filter(p => p.id === id).map(p => p.variant).sort(), [0, 1, 2]);
      data.problems.forEach((p, i) => {
        assert(p.answer && compact(data.solutions[i].text).includes(compact(p.answer)), `answer ${i + 1} matches ${p.id}`);
        if (p.id !== ids[2]) assert(p.figures >= 1, `problem ${i + 1} includes its figure`);
        if ([ids[0], ids[1]].includes(p.id)) assert(data.solutions[i].figures >= 1, `solution ${i + 1} includes its figure`);
        if ([ids[0], ids[1], ids[3]].includes(p.id)) assert.equal(p.automaticGrading, false, `drawing ${p.id} is manually graded`);
      });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.emulateMedia({ media: "print" });
      const solutionFonts=await page.locator('#solutionView .solution-item').evaluateAll(items=>items.map(item=>{const text=item.querySelector('[data-source-answer] p')||item.querySelector('[data-source-answer]')||item.querySelector('p');return text&&{family:getComputedStyle(text).fontFamily,weight:getComputedStyle(text).fontWeight}}));
      assert.equal(solutionFonts.length,12);for(const [i,font] of solutionFonts.entries()){assert.match(font?.family||'',/Noto Serif KR/,`solution ${i+1} uses print serif`);assert.equal(font.weight,'400');}
      await page.emulateMedia({ media: null });
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          const file=path.join(process.env.MAC_CHECK_OUTPUT, `mixed-${mode}.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          if(mode === "problem") assert.match(require("node:child_process").execFileSync("pdfinfo",[file],{encoding:"utf8"}),/^Pages:\s+3$/m);
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 12 page 39 questions and solutions use print serif and match on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
