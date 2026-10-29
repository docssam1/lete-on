"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root = path.resolve(__dirname, "../..");
const outputDir = process.env.MAC_CHECK_OUTPUT || "/tmp/grade52-p50-e23-browser-audit";
const itemId = "5-2-u5-e2-example-2-3";
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
        res.writeHead(200, { "content-type": `${ext === ".css" ? "text/css" : ext === ".js" ? "text/javascript" : "text/html"}; charset=utf-8` }).end(data);
      });
    }).listen(0, "127.0.0.1", () => resolve(`http://127.0.0.1:${server.address().port}`));
  });
}
(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const origin = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  const states = [];
  try {
    for (const width of [1440, 375, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1150 }, serviceWorkers: "block" });
      const page = await context.newPage(), errors = [], external = [];
      await context.route("**/*", route => {
        const u = new URL(route.request().url());
        if ((u.protocol === "http:" || u.protocol === "https:") && u.origin !== origin) { external.push(u.href); return route.abort(); }
        return route.continue();
      });
      page.on("pageerror", e => errors.push(e.message));
      await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      const checkbox = page.locator(`#typeList input[data-type-id='${itemId}']`);
      assert.equal(await checkbox.isDisabled(), false, `source type enabled at ${width}`);
      await checkbox.check();
      await page.locator("#questionCountInput").fill("1");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden, null, { timeout: 10000 });
      const problem = page.locator(`#problemView [data-source-item-id='${itemId}']`).first();
      await problem.waitFor({ state: "visible" });
      assert.match(await problem.innerText(), /①부터 ⑩까지/);
      assert.equal(await problem.locator("svg.source52-p50e23-diagram").count(), 1);
      const seams = await problem.locator(".source52-p50e23-fold").evaluate(path => ({ d: path.getAttribute("d"), dash: getComputedStyle(path).strokeDasharray }));
      assert.equal(seams.d, "M169 183v64 M233 183v64 M233 183h64 M233 247h64", "seams connect only adjacent shaded squares");
      assert.notEqual(seams.dash, "none", "fold seams remain dashed after styles load");
      assert.equal(await page.locator(`#problemView [data-source-answer='${itemId}']`).count(), 0);
      const pWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(pWidth <= width + 1, `problem overflow at ${width}: ${pWidth}`);
      await page.screenshot({ path: path.join(outputDir, `problem-${width}.png`), fullPage: true });
      await page.locator("#solutionTab").click();
      const solution = page.locator(`#solutionView [data-source-answer='${itemId}']`);
      await solution.waitFor({ state: "visible" });
      const solutionText = await solution.innerText();
      assert.match(solutionText, /4, 8, 9, 10/);
      assert.match(solutionText, /4, 8, 9, 10/);
      assert.equal(await page.locator(`#solutionView [data-source-answer='${itemId}'] table tbody tr`).count(), 10);
      assert.equal(await page.locator("#solutionView svg.source52-p50e23-diagram").count(), 1);
      const sWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(sWidth <= width + 1, `solution overflow at ${width}: ${sWidth}`);
      await page.screenshot({ path: path.join(outputDir, `solution-${width}.png`), fullPage: true });
      if (width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.pdf({ path: path.join(outputDir, `${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
        }
      }
      assert.deepEqual(errors, [], `browser errors at ${width}`);
      assert(external.every(u => u === "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"), `unexpected external requests: ${external}`);
      states.push({ width, problemScrollWidth: pWidth, solutionScrollWidth: sWidth, diagram: 2, answer: "4, 8, 9, 10", errors: errors.length });
      await context.close();
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
  const report = { status: "passed", sourceItemId: itemId, states, a4: ["problem", "solution"], outputDir };
  fs.writeFileSync(path.join(outputDir, "browser-audit.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
