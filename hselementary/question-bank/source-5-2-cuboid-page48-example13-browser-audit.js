"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.MAC_CHECK_OUTPUT || "/tmp/grade52-p48-e13-browser-audit";
const itemId = "5-2-u5-e1-example-3";
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
      assert.match(problemText, /가로, 세로, 높이가 각각 7cm, 5cm, 3cm/);
      assert.match(problemText, /네 개의 작은 직육면체/);
      assert.match(problemText, /모서리의 길이를 모두 더하면 몇 cm인가/);
      assert.equal(await problemView.locator(`[data-source-answer='${itemId}']`).count(), 0, "answer stays out of problem view");
      const diagram = problemItem.locator("svg.source52-p48e13-diagram");
      assert.equal(await diagram.count(), 1, "reconstructed source diagram exists");
      assert.equal(await diagram.locator(".source52-p48e13-cut-edge").count(), 4, "two through-cuts are shown across top/front/side faces");
      assert.equal(await diagram.locator('line[x1="560"][y1="170"][x2="210"][y2="170"]').count(), 0, "hidden rear edge does not cross the front face");
      const diagramText = (await diagram.locator("text").allTextContents()).join(" ");
      assert(["7cm", "5cm", "3cm"].every(value => diagramText.includes(value)), "all three original dimensions are labeled");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `problem horizontal overflow ${width}px`);
      const fontStatus = await page.evaluate(async () => {
        await document.fonts.ready;
        return document.fonts.check('600 16px "Pretendard"', "직육면체 절단 그림");
      });
      assert.equal(fontStatus, true, `local diagram and body font loaded at ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `example13-problem-${width}.png`), fullPage: true });
      const problemBox = await problemItem.boundingBox();

      await page.locator("#solutionTab").click();
      const solutionView = page.locator("#solutionView");
      const solutionText = await solutionView.innerText();
      assert.match(solutionText, /가로 길이 합은 원래 가로의 두 배/);
      assert.match(solutionText, /4×\(14\+10\+12\)=144cm/);
      assert.match(solutionText, /답: 144cm/);
      assert.equal(await solutionView.locator(`[data-source-answer='${itemId}']`).count(), 1, "solution is separated from the problem");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `solution horizontal overflow ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `example13-solution-${width}.png`), fullPage: true });

      if (width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          const file = path.join(outputDir, `example13-${mode}.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          assert(fs.statSync(file).size > 5000, `${mode} A4 PDF has content`);
        }
      }
      assert.deepEqual(errors, [], `browser errors at ${width}px`);
      assert(externalRequests.every(url => url === "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"), `unexpected external request at ${width}px: ${externalRequests.join(", ")}`);
      assert(problemBox && problemBox.x >= 0 && problemBox.x + problemBox.width <= width + 1, `item bounds at ${width}px`);
      summaries.push({ width, problemHeight: Math.round(problemBox.height), pageErrors: errors.length, localPretendardLoaded: fontStatus, blockedSharedFontStylesheetRequests: externalRequests.length });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: "passed", sourceItemId: itemId, summaries, a4: ["problem", "solution"], outputDir }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
