"use strict";
const assert = require("node:assert/strict");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8957";
const ids = ["5-1-u1-t1", "5-1-u1-t1-2", "5-1-u1-t1-3", "5-1-u1-t1-4"];
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [width, difficulty] of [1280, 375].flatMap(width => [-1, 0, 1].map(difficulty => [width, difficulty]))) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "load" });
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='1']").click();
      await page.locator("#unitFilter").selectOption("5-1-u1");
      for (const id of ids) await page.locator(`#typeList input[data-type-id="${id}"]`).check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator(`#difficultyFilter [data-difficulty="${difficulty}"]`).click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      for (let i = 0; i < 12; i++) {
        if (i) await page.locator("#newProblemButton").click();
        await page.locator("#printMenuButton").click();
        await page.locator('#printMenuList [data-print-mode="problem"]').click();
        await page.emulateMedia({ media: "print" });
        await page.setViewportSize({ width: 794, height: 1123 });
        if (i === 11) await page.evaluate(() => {
          const equation = document.querySelector('[data-mixed-kind="e1-exploration-set"]');
          const prefix = equation.querySelector(".mixed-calculation-prefix");
          const ending = equation.querySelector(".mixed-calculation-ending");
          if (!prefix || !ending) throw new Error("missing calculation segments");
          prefix.textContent = "1195 - {27 + 13 × (100 ÷ 10) - 20}";
          ending.textContent = " × 8 + 62 = □";
        });
        const items = await page.locator("#problemView .question-item").evaluateAll(nodes => nodes.map(node => {
          const prompt = node.querySelector(".question-prompt").getBoundingClientRect();
          const answer = node.querySelector(".answer-line").getBoundingClientRect();
          const box = node.getBoundingClientRect(), equation = node.querySelector(".equation");
          const wrappedText = [...equation.childNodes].filter(text => {
            if (text.nodeType !== Node.TEXT_NODE || !text.textContent.trim()) return false;
            const range = document.createRange(); range.selectNodeContents(text);
            return range.getClientRects().length > 1;
          });
          const wrapped = wrappedText.length > 0;
          const ending = equation.querySelector(".mixed-calculation-ending");
          const prefix = equation.querySelector(".mixed-calculation-prefix");
          const segmentsWrapped = [prefix, ending].some(part => part && part.getClientRects().length > 1);
          return { overlap: prompt.bottom > answer.top + 1, outside: answer.bottom > box.bottom + 1, wrapped: wrapped || segmentsWrapped, wrappedText: wrappedText.map(n => n.textContent), segmentsWrapped, overflow: equation.scrollWidth > equation.clientWidth + 1 };
        }));
        assert.equal(items.length, 4);
        assert(items.every(item => !item.overlap && !item.outside && !item.wrapped && !item.overflow), `equations and answer spaces must fit: ${JSON.stringify(items)}`);
        const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
        assert.equal((pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length, 1);
        await page.emulateMedia({ media: "screen" });
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: mixed-calculation four-up A4 on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
