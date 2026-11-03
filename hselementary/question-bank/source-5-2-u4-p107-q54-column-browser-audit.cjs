"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:45702";
const numbers = [47, 48, 53, 54];
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.waitForFunction(() => window.HSE_GENERATORS);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u4");
      for (const n of numbers) await page.locator(`#typeList input[data-type-id='5-2-u4-practice-${n}-original']`).check();
      await page.locator("#questionCountInput").fill("4");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      await page.locator("#printMenuButton").click();
      await page.locator("#printMenuList [data-print-mode='problem']").click();
      await page.waitForFunction(() => document.body.dataset.printMode === "problem");
      await page.emulateMedia({ media: "print" });
      // Use A4 width for the DOM checks even when the creation flow ran on mobile.
      await page.setViewportSize({ width: 794, height: 1123 });
      const result = await page.evaluate(() => {
        const pages = [...document.querySelectorAll("#problemView .print-page")];
        const p = pages[0], grid = p.querySelector(".question-grid");
        const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, height: r.height }; };
        return { pageCount: pages.length, fourUp: p.classList.contains("print-page--four-up"), grid: box(grid),
          items: [...p.querySelectorAll(".question-item")].map(e => ({ box: box(e), prompt: box(e.querySelector(".question-prompt")), answer: box(e.querySelector(".answer-line")), number: e.querySelector("header b").textContent, svg: e.querySelector("svg") ? box(e.querySelector("svg")) : null })) };
      });
      assert.equal(result.pageCount, 1);
      assert(result.fourUp);
      assert.equal(result.items.length, 4);
      const [a, b, c, d] = result.items;
      assert.deepEqual(result.items.map(i => i.number), ["1", "2", "3", "4"]);
      assert(Math.abs(a.box.y - c.box.y) < 2 && Math.abs(b.box.y - d.box.y) < 2, "both columns share the same rows");
      assert(b.box.y - a.box.y > 400 && Math.abs(b.box.height - a.box.height) < 3, "two balanced rows use the A4 height");
      assert(result.grid.height > 850, "the grid fills the usable page rather than clustering at the top");
      assert(a.box.x < c.box.x && b.box.x < d.box.x, "read left column before right column");
      for (const item of result.items) {
        assert(item.prompt.bottom <= item.answer.y + 1, `question ${item.number}: prompt must not overlap answer`);
        assert(item.answer.bottom <= item.box.bottom + 1, `question ${item.number}: answer must remain inside its cell`);
        if (item.svg) assert(item.svg.bottom <= item.answer.y + 1 && item.svg.right <= item.box.right + 1, `question ${item.number}: diagram must fit`);
      }
      assert.equal(await page.locator('#problemView svg').count(),4);
      const columns = await page.locator('#problemView .u4p107-q54').evaluate(svg => Object.fromEntries(['factor','multiplier','partial-one','partial-two','result'].map(row => [row,[...svg.querySelectorAll(`[data-row="${row}"]`)].map(e=>[Number(e.getAttribute('data-column')),e.textContent])])));
      assert.deepEqual(columns, {factor:[[140,'㉠'],[162,'㉡'],[184,'㉢']],multiplier:[[140,'㉣'],[162,'㉤'],[184,'7']], 'partial-one':[[118,'1'],[140,'㉤'],[162,'㉠'],[184,'㉢']], 'partial-two':[[96,'㉡'],[118,'㉣'],[140,'㉢']],result:[[96,'㉡'],[118,'㉡'],[140,'㉢'],[162,'㉠'],[184,'㉢']]});
      assert.match(await page.locator('#solutionView').textContent(), /1\+4\+5\+3\+0/);
      const file = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p107-aligned-${width}.pdf`);
      await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
      const info = execFileSync("pdfinfo", [file], { encoding: "utf8" });
      assert.match(info, /Pages:\s+1\b/, "four questions must fit on one physical A4 page");
      assert.match(info, /Page size:.*A4/, "physical page must be A4");
      assert.deepEqual(errors, []);
      if (!process.env.MAC_CHECK_OUTPUT) fs.unlinkSync(file);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 107 written-multiplication columns and balanced four-up A4 spacing from desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
