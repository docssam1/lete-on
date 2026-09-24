"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright"));

const root = __dirname;
const server = http.createServer((request, response) => {
  const relative = decodeURIComponent((request.url || "/").split("?")[0]).replace(/^\/+/, "") || "index.html";
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end();
    return;
  }
  const mime = ({ ".html": "text/html", ".css": "text/css", ".js": "application/javascript" })[path.extname(file)] || "application/octet-stream";
  response.writeHead(200, { "Content-Type": `${mime}; charset=utf-8`, "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(response);
});

async function assertSameFont(page, selector) {
  const result = await page.evaluate(selector => {
    const expected = getComputedStyle(document.body).fontFamily;
    const fonts = [...document.querySelectorAll(selector)].map(element => getComputedStyle(element).fontFamily);
    return { expected, fonts };
  }, selector);
  assert(result.fonts.length > 0, `No visible content for ${selector}`);
  assert(result.fonts.every(font => font === result.expected), `Mixed font in ${selector}: ${JSON.stringify(result)}`);
}

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const width of [1440, 390]) {
      for (const typeId of ["4-2-u4-t4-8", "5-1-u4-t4-7"]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        try {
          await page.goto(`${base}?type=${typeId}&review=1`);
          await page.locator(".question-prompt").first().waitFor();
          await assertSameFont(page, ".question-prompt, .question-prompt svg text, .question-prompt .math-fraction");
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${typeId} overflows at ${width}px`);
          await page.locator("#solutionTab").click();
          await assertSameFont(page, ".solution-item p, .solution-item header strong, .solution-answer-visual svg text");
          await page.locator("#solutionViewerButton").click();
          await assertSameFont(page, ".solution-viewer-prompt, .solution-viewer-solution");
        } finally {
          await page.close();
        }
      }
    }

    const page = await browser.newPage();
    try {
      await page.goto(base);
      await page.locator('#termFilter [data-term="2"]').click();
      await page.locator('[data-type-id="4-2-u4-t4-8"]').check();
      await page.locator("#questionCountInput").fill("3");
      await page.locator("#generateButton").click();
      const pools = await page.locator(".question-item").evaluateAll(items => items.map(item => {
        const marker = item.querySelector("[data-source-item][data-pool-index]");
        return { source: marker?.dataset.sourceItem, index: Number(marker?.dataset.poolIndex) };
      }));
      assert.equal(await page.locator(".question-item").count(), 3);
      assert.deepEqual(pools.map(item => item.index).sort(), [0, 1, 2]);
      assert(pools.every(item => item.source === "4-2-u4-e4-mission-3"));
    } finally {
      await page.close();
    }
    console.log("Typography and question-bank reuse passed: desktop, mobile, problem, solution, viewer, 3 verified variants");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
