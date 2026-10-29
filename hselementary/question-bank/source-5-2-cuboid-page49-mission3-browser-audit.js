"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.MAC_CHECK_OUTPUT || "/tmp/grade52-p49-m3-browser-audit";
const itemId = "5-2-u5-e1-mission-3";
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
      assert.match(problemText, /색 테이프는 2번씩 감았고/);
      assert.match(problemText, /매듭을 묶는 데 16cm씩/);
      assert.equal(await problemView.locator(`[data-source-answer='${itemId}']`).count(), 0, "answer stays out of problem view");
      const diagram = problemItem.locator("svg.source52-p49m3-diagram");
      assert.equal(await diagram.count(), 1, "source cuboid and three tape loops are drawn");
      assert.equal(await diagram.locator(".source52-p49m3-wraps path").count(), 3, "each direction has its own double-wrap path");
      assert.equal(await diagram.locator(".source52-p49m3-knot").count(), 3, "three source knots are shown");
      assert.equal(await diagram.locator(".source52-p49m3-hidden").count(), 0, "hidden edges do not cross visible faces");
      assert.match(await diagram.locator(".source52-p49m3-dimensions path").getAttribute("d"), /M359 329 469 249/, "24cm dimension follows the depth edge");
      assert.equal(await diagram.locator(".source52-p49m3-dimensions text").allTextContents().then(v => v.join(" ")).then(v => /30cm/.test(v) && /24cm/.test(v) && /35cm/.test(v)), true, "all three source dimensions are labeled");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `problem horizontal overflow ${width}px`);
      const fontStatus = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 16px "Pretendard"', "색 테이프를 두 번씩 감기"); });
      assert.equal(fontStatus, true, `local Pretendard loaded at ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `mission3-problem-${width}.png`), fullPage: true });

      await page.locator("#solutionTab").click();
      const solutionView = page.locator("#solutionView");
      const solutionText = await solutionView.innerText();
      for (const phrase of ["130cm", "118cm", "108cm", "712cm", "48cm", "760cm", "답: 760cm"]) assert(solutionText.includes(phrase), `solution includes ${phrase}`);
      assert.equal(await solutionView.locator(`[data-source-answer='${itemId}']`).count(), 1, "answer is separated into solution view");
      assert.equal(await solutionView.locator("svg.source52-p49m3-diagram .source52-p49m3-loop-labels text").count(), 0, "loop lengths are explained in text without overlapping the diagram");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `solution horizontal overflow ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `mission3-solution-${width}.png`), fullPage: true });

      if (width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.emulateMedia({ media: "screen" });
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.emulateMedia({ media: "print" });
          const serifLoaded = await page.evaluate(async () => {
            await document.fonts.load('400 16px "Noto Serif KR"', "직육면체와 테이프");
            await document.fonts.ready;
            return document.fonts.check('400 16px "Noto Serif KR"', "직육면체와 테이프");
          });
          assert.equal(serifLoaded, true, "local Noto Serif KR loads for A4 print");
          const file = path.join(outputDir, `mission3-${mode}.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          assert(fs.statSync(file).size > 5000, `${mode} A4 PDF has content`);
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, [], `browser errors at ${width}px`);
      assert(externalRequests.every(url => url === "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"), `unexpected external request at ${width}px: ${externalRequests.join(", ")}`);
      summaries.push({ width, pageErrors: errors.length, localPretendardLoaded: fontStatus, blockedSharedFontStylesheetRequests: externalRequests.length });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: "passed", sourceItemId: itemId, summaries, a4: ["problem", "solution"], outputDir }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
