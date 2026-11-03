"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const numbers = [49, 50, 55, 56];
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
      await page.locator("#unitFilter").selectOption("5-2-u3");
      for (const n of numbers) await page.locator(`#typeList input[data-type-id='5-2-u3-practice-${n}-original']`).check();
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
      const q55 = page.locator('#problemView [data-source-item-id="5-2-u3-practice-55-original"]');
      assert.equal(await q55.count(), 1);
      assert.match(await q55.innerText(), /선분 ㄱㄷ/);
      assert.equal(await q55.locator('svg').count(), 1);
      const pathData = await q55.locator('svg path').first().getAttribute('d');
      const coords = pathData.split(' Z')[0].match(/-?\d+(?:\.\d+)?/g).map(Number);
      assert.equal(coords.length, 16);
      const points = Array.from({length: 8}, (_, i) => [coords[i*2], coords[i*2+1]]), g = points[0];
      const dist = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
      const sides = [];
      for (let i=1;i<=6;i++) sides.push([dist(g,points[i]),dist(g,points[i+1]),dist(points[i],points[i+1])].sort((a,b)=>a-b));
      for (const side of sides) for (let i=0;i<3;i++) assert(Math.abs(side[i]-sides[0][i])<0.03, 'all six triangles must be congruent');
      assert(Math.abs(dist(points[1],points[3])/dist(g,points[2])-10/12)<0.001);
      const diagram = await q55.locator('svg').getAttribute('aria-label');
      assert(diagram.includes('여섯 개의 합동 삼각형'));
      const explanation = await page.locator('#solutionView [data-source-answer="5-2-u3-practice-55-original"]').innerText();
      assert(explanation.includes('10cm') && explanation.includes('30cm') && explanation.includes('5cm'));
      const file = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p86-q55-${width}.pdf`);
      await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
      const info = execFileSync("pdfinfo", [file], { encoding: "utf8" });
      assert.match(info, /Pages:\s+1\b/, "four questions must fit on one physical A4 page");
      assert.match(info, /Page size:.*A4/, "physical page must be A4");
      await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      await page.emulateMedia({ media: 'screen' });
      await page.locator('#printMenuButton').click();
      await page.locator('#printMenuList [data-print-mode="solution"]').click();
      await page.waitForFunction(() => document.body.dataset.printMode === 'solution');
      await page.emulateMedia({ media: 'print' });
      const solutionFile = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p86-q55-solution-${width}.pdf`);
      await page.pdf({ path: solutionFile, format: 'A4', printBackground: true, preferCSSPageSize: true });
      const solutionInfo = execFileSync('pdfinfo', [solutionFile], { encoding: 'utf8' });
      assert.match(solutionInfo, /Page size:.*A4/);
      assert.match(solutionInfo, /Pages:\s+[23]\b/);
      const pagePrefix = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p86-q55-solution-page2-${width}`);
      execFileSync('pdftoppm', ['-f', '2', '-l', '2', '-r', '72', '-singlefile', '-png', solutionFile, pagePrefix]);
      const darkPixels = Number(execFileSync('python3', ['-c', 'from PIL import Image;import sys; im=Image.open(sys.argv[1]).convert("RGB"); print(sum(1 for r,g,b in im.crop((0,0,im.width,24)).getdata() if max(r,g,b)<150))', `${pagePrefix}.png`], { encoding: 'utf8' }).trim());
      assert(darkPixels < 10, `solution page 2 needs a top margin; found ${darkPixels} dark pixels`);
      assert.deepEqual(errors, []);
      if (!process.env.MAC_CHECK_OUTPUT) { fs.unlinkSync(file); fs.unlinkSync(solutionFile); fs.unlinkSync(`${pagePrefix}.png`); }
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 91 question 55 answer, figure and four-up A4 from desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
