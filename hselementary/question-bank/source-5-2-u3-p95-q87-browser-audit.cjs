"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const numbers = [81, 83, 85, 87];
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
      const q87 = page.locator('#problemView [data-source-item-id="5-2-u3-practice-87-original"]');
      assert.equal(await q87.count(), 1);
      assert.match(await q87.innerText(), /네 번 접었다가/);
      assert.equal(await q87.locator('svg.u3p95-fold87').count(), 1);
      const explanation = await page.locator('#solutionView [data-source-answer="5-2-u3-practice-87-original"]').innerText();
      assert(explanation.includes('8개') && explanation.includes('두 개씩'));
      const polygons = await page.locator('#solutionView .solution-item:has([data-source-answer="5-2-u3-practice-87-original"]) svg polygon[fill="#b7b7b7"]').evaluateAll(es=>es.map(e=>e.getAttribute('points')));
      assert.equal(polygons.length,8);
      const canonical = points => points.map(([x,y])=>`${x},${y}`).sort().join(';');
      const displayed = new Set(polygons.map(p=>canonical(p.trim().split(/\s+/).map(pair=>pair.split(',').map(Number)))));
      assert.equal(displayed.size,8, 'all eight highlighted shapes must differ');
      const families = [[1,0,[0,40,80]],[0,1,[0,40,80]],[1,1,[40,80,120]],[1,-1,[-40,0,40]]];
      const expected = new Set();
      for (let i=0;i<4;i++) for (let j=i+1;j<4;j++) {
        const [a,b,cs]=families[i], [d,e,ds]=families[j]; if(a*d+b*e===0) continue;
        const det=a*e-b*d;
        for(let u=0;u<3;u++) for(let v=u+1;v<3;v++) for(let w=0;w<3;w++) for(let z=w+1;z<3;z++) {
          const pts=[cs[u],cs[v]].flatMap(c=>[ds[w],ds[z]].map(f=>[(c*e-b*f)/det,(a*f-c*d)/det]));
          if(pts.every(([x,y])=>x>=0&&x<=80&&y>=0&&y<=80)) expected.add(canonical(pts));
        }
      }
      assert.equal(expected.size,8); assert.deepEqual(displayed,expected);
      const file = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p95-q87-${width}.pdf`);
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
      const solutionFile = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p95-q87-solution-${width}.pdf`);
      await page.pdf({ path: solutionFile, format: 'A4', printBackground: true, preferCSSPageSize: true });
      const solutionInfo = execFileSync('pdfinfo', [solutionFile], { encoding: 'utf8' });
      assert.match(solutionInfo, /Page size:.*A4/);
      assert.match(solutionInfo, /Pages:\s+[234]\b/);
      const pagePrefix = path.join(process.env.MAC_CHECK_OUTPUT || os.tmpdir(), `hse-p95-q87-solution-page2-${width}`);
      execFileSync('pdftoppm', ['-f', '2', '-l', '2', '-r', '72', '-singlefile', '-png', solutionFile, pagePrefix]);
      const darkPixels = Number(execFileSync('python3', ['-c', 'from PIL import Image;import sys; im=Image.open(sys.argv[1]).convert("RGB"); print(sum(1 for r,g,b in im.crop((0,0,im.width,24)).getdata() if max(r,g,b)<150))', `${pagePrefix}.png`], { encoding: 'utf8' }).trim());
      assert(darkPixels < 10, `solution page 2 needs a top margin; found ${darkPixels} dark pixels`);
      assert.deepEqual(errors, []);
      if (!process.env.MAC_CHECK_OUTPUT) { fs.unlinkSync(file); fs.unlinkSync(solutionFile); fs.unlinkSync(`${pagePrefix}.png`); }
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: page 95 question 87 answer, figure and four-up A4 from desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
