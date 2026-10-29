"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.MAC_CHECK_OUTPUT || "/tmp/grade52-p48-e12-browser-audit";
const itemId = "5-2-u5-e1-example-2";
let server;

function startServer() {
  return new Promise(resolve => {
    server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      let file = path.resolve(root, `.${pathname}`);
      if (pathname.endsWith("/")) file = path.join(file, "index.html");
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) { res.writeHead(403).end("forbidden"); return; }
      fs.readFile(file, (error, data) => {
        if (error) { res.writeHead(404).end("not found"); return; }
        const ext = path.extname(file);
        const type = ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : "text/html";
        res.writeHead(200, { "content-type": `${type}; charset=utf-8` }).end(data);
      });
    }).listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`));
  });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const origin = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  const summaries = [];
  try {
    for (const width of [1440, 375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1050 }, serviceWorkers: "block" });
      const page = await context.newPage();
      const errors = [], externalRequests = [];
      await context.route("**/*", route => {
        const requestUrl = new URL(route.request().url());
        if ((requestUrl.protocol === "http:" || requestUrl.protocol === "https:") && requestUrl.origin !== origin) {
          externalRequests.push(requestUrl.href);
          return route.abort();
        }
        return route.continue();
      });
      page.on("pageerror", error => errors.push(error.message));
      page.on("dialog", async dialog => { errors.push(`dialog: ${dialog.message()}`); await dialog.accept(); });
      await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      const checkbox = page.locator(`#typeList input[data-type-id='${itemId}']`);
      assert.equal(await checkbox.isDisabled(), false, `verified type enabled at ${width}px`);
      await checkbox.check();
      await page.locator("#questionCountInput").fill("1");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden, null, { timeout: 10000 });

      const problemView = page.locator("#problemView");
      const problemItem = problemView.locator(`[data-source-item-id='${itemId}']`).first();
      await problemItem.waitFor({ state: "visible" });
      const problemText = await problemItem.innerText();
      assert.match(problemText, /어떤 직육면체를 위와 옆에서 본 그림/);
      assert.match(problemText, /모든 모서리의 합은 몇 cm인가/);
      const fontStatus = await page.evaluate(async () => {
        await document.fonts.ready;
        return {
          sansLoaded: document.fonts.check('600 16px "Pretendard"', "위 옆 그림")
        };
      });
      assert.deepEqual(fontStatus, { sansLoaded: true }, `local body and diagram font loaded at ${width}px`);
      assert.equal(await problemView.locator(`[data-source-answer='${itemId}']`).count(), 0, "answer stays out of problem view");
      const desktop = problemItem.locator("svg.source52-p48e12-desktop");
      assert.equal(await desktop.count(), 1, "desktop orthographic diagram exists");
      assert.equal(await desktop.locator("text").allTextContents().then(values => values.join(" ")).then(value => ["12cm", "4cm", "10cm", "위", "옆"].every(part => value.includes(part))), true, "source dimensions and view labels are rendered");
      const mobile = problemItem.locator(".source52-p48e12-mobile");
      assert.equal(await mobile.count(), 1, "mobile orthographic views exist");
      assert.equal(await mobile.locator("svg").count(), 2, "mobile presents both source views");
      assert(await problemItem.locator(width < 680 ? ".source52-p48e12-mobile" : ".source52-p48e12-desktop").isVisible(), `responsive diagram visible at ${width}px`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `problem horizontal overflow ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `example12-problem-${width}.png`), fullPage: true });
      const problemBox = await problemItem.boundingBox();

      await page.locator("#solutionTab").click();
      const solutionView = page.locator("#solutionView");
      const solutionText = await solutionView.innerText();
      assert.match(solutionText, /4 × \(12 \+ 4 \+ 10\) = 104/);
      assert.match(solutionText, /답: 104cm/);
      assert.equal(await solutionView.locator(`[data-source-answer='${itemId}']`).count(), 1, "solution is separated from the problem");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `solution horizontal overflow ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `example12-solution-${width}.png`), fullPage: true });

      if (width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          const file = path.join(outputDir, `example12-${mode}.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          assert(fs.statSync(file).size > 5000, `${mode} A4 PDF has content`);
        }
      }
      assert.deepEqual(errors, [], `browser errors at ${width}px`);
      assert(externalRequests.every(url => url === "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"), `unexpected external request at ${width}px: ${externalRequests.join(", ")}`);
      assert(problemBox && problemBox.x >= 0 && problemBox.x + problemBox.width <= width + 1, `item bounds at ${width}px`);
      summaries.push({ width, problemHeight: Math.round(problemBox.height), pageErrors: errors.length, ...fontStatus, blockedSharedFontStylesheetRequests: externalRequests.length });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: "passed", sourceItemId: itemId, summaries, a4: ["problem", "solution"], outputDir }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
