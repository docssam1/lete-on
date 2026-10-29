"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.MAC_CHECK_OUTPUT || "/tmp/grade52-p55-m5-browser-audit";
const itemId = "5-2-u5-e4-mission-5";
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
      const typeStatus = await page.evaluate(id => {
        const type = window.HSE_CURRICULUM.semesters.find(x => x.id === "5-2")?.units.find(x => x.id === "5-2-u5")?.subunits.find(x => x.name === "주사위에 관한 문제 ①")?.types.find(x => x.sourceItemId === id);
        return type && { reviewLocked: type.reviewLocked, sourceVerified: type.sourceVerified, generationMode: type.generationMode, verifiedVariantCount: type.verifiedVariantCount, generatorKey: window.HSE_GENERATORS.generatorKey(type) };
      }, itemId);
      assert.deepEqual(typeStatus, { reviewLocked: false, sourceVerified: true, generationMode: "fixed-verified-pool", verifiedVariantCount: 1, generatorKey: "source52CuboidDiceRollNinetiethFacePage55Mission5" }, "live catalog exposes only the exact source pool");
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u5");
      const checkbox = page.locator(`#typeList input[data-type-id='${itemId}']`);
      assert.equal(await checkbox.isDisabled(), false, `preview type selectable at ${width}px`);
      await checkbox.check();
      await page.locator("#questionCountInput").fill("1");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden, null, { timeout: 10000 });
      const problemView = page.locator("#problemView");
      const problemItem = problemView.locator(`[data-source-item-id='${itemId}']`).first();
      await problemItem.waitFor({ state: "visible" });
      const problemText = await problemItem.innerText();
      assert.match(problemText, /90번 굴려 마지막 칸/);
      assert.match(problemText, /알맞게 그려 넣으세요/);
      assert.equal(await problemView.locator(`[data-source-answer='${itemId}']`).count(), 0, "answer stays out of problem view");
      assert.equal(await problemItem.locator("svg.source52-p55m5-diagram--wide .source52-p55m5-die[data-die-label='start'] .source52-p55m5-pip").count(), 11, "starting die shows 2, 6, 3");
      assert.equal(await problemItem.locator("svg.source52-p55m5-diagram--wide .source52-p55m5-die[data-die-label='90th'] .source52-p55m5-pip").count(), 0, "final die remains blank in problem view");
      if (width <= 700) {
        const mobileDiagram = problemItem.locator("svg.source52-p55m5-diagram--mobile");
        assert.equal(await mobileDiagram.isVisible(), true, "readable mobile path diagram is selected");
        assert.equal(await problemItem.locator(".source52-p55m5-mobile-path").isVisible(), true, "mobile route label is readable outside the small path cells");
        assert.equal(await mobileDiagram.locator(".source52-p55m5-cell").count(), 4, "mobile diagram shows source path cells");
        assert.equal(await mobileDiagram.locator(".source52-p55m5-die[data-die-label='90th'] .source52-p55m5-pip").count(), 0, "mobile final die remains blank");
      } else {
        assert.equal(await problemItem.locator("svg.source52-p55m5-diagram--wide").isVisible(), true, "readable wide source-path diagram is selected");
        assert.equal(await problemItem.locator(".source52-p55m5-mobile-path").isVisible(), false, "mobile-only route label is hidden on wide screens");
      }
      assert.equal(await problemItem.locator("svg.source52-p55m5-diagram .source52-p55m5-die[data-die-label='90th'] .source52-p55m5-pip").count(), 0, "three visible final faces are left blank");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `problem horizontal overflow ${width}px`);
      const fontStatus = await page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 16px "Pretendard"', "주사위를 90번 굴려 마지막 칸에 도착했을 때"); });
      assert.equal(fontStatus, true, `local Pretendard loaded at ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `mission5-problem-${width}.png`), fullPage: true });

      await page.locator("#solutionTab").click();
      const solutionView = page.locator("#solutionView");
      const solutionText = await solutionView.innerText();
      for (const phrase of ["위 5, 앞 6, 오른쪽 4", "88번", "4의 배수"]) assert(solutionText.includes(phrase), `solution includes ${phrase}`);
      assert.equal(await solutionView.locator(`[data-source-answer='${itemId}']`).count(), 1, "answer is separated into solution view");
      const visibleSolutionDiagram = page.locator(width <= 700 ? "svg.source52-p55m5-diagram--mobile" : "svg.source52-p55m5-diagram--wide");
      assert.equal(await visibleSolutionDiagram.locator(".source52-p55m5-die[data-die-label='90th'] .source52-p55m5-pip").count(), 15, "solution draws five, six, and four pips");
      assert.equal(await solutionView.locator(`.solution-answer-visual .source52-p55m5-answer-visual .source52-p55m5-pip`).count(), 15, "answer drawing is also exposed through the bank's answer-visual field");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `solution horizontal overflow ${width}px`);
      await page.screenshot({ path: path.join(outputDir, `mission5-solution-${width}.png`), fullPage: true });
      if (width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.emulateMedia({ media: "screen" });
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.emulateMedia({ media: "print" });
          const serifLoaded = await page.evaluate(async () => {
            await document.fonts.load('400 16px "Noto Serif KR"', "다음 그림의 주사위는 마주 보는 면끼리의 눈의 합이 항상 7입니다");
            await document.fonts.ready;
            return document.fonts.check('400 16px "Noto Serif KR"', "마지막 칸에 도착했을 때 생기는 주사위의 눈");
          });
          assert.equal(serifLoaded, true, "local Noto Serif KR loads for A4 print");
          const file = path.join(outputDir, `mission5-${mode}.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          assert(fs.statSync(file).size > 5000, `${mode} A4 PDF has content`);
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, [], `browser errors at ${width}px`);
      assert(externalRequests.every(url => url === "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"), `unexpected external request at ${width}px: ${externalRequests.join(", ")}`);
      summaries.push({ width, pageErrors: errors.length, horizontalOverflow: false, localPretendardLoaded: fontStatus, blockedSharedFontStylesheetRequests: externalRequests.length });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: "passed", sourceItemId: itemId, summaries, a4: ["problem", "solution"], outputDir }, null, 2));
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
