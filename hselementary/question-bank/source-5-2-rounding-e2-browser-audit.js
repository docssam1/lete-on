"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");

const origin = "http://127.0.0.1:8909";
const ids = ["5-2-u1-e2-exploration", "5-2-u1-e2-example-2-1", "5-2-u1-e2-example-2-2", "5-2-u1-e2-example-2-3"];
const widths = [1280, 375, 320];
const difficulties = [-1, 0, 1];
const repoRoot = path.resolve(__dirname, "../..");
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
if (evidenceDir) {
  assert(path.isAbsolute(evidenceDir), "MAC_CHECK_OUTPUT must be an absolute private path");
  const relative = path.relative(repoRoot, evidenceDir);
  assert(relative.startsWith("..") || path.isAbsolute(relative), "Browser evidence must stay outside the repository");
  fs.mkdirSync(evidenceDir, { recursive: true });
}
const errors = [];
let blockedRequests = 0;
let states = 0;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const width of widths) {
    for (const id of ids) {
      for (const difficulty of difficulties) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: "block" });
        await context.route("**/*", async route => {
          const url = new URL(route.request().url());
          if (url.origin !== origin) {
            blockedRequests += 1;
            return route.fulfill({ status: 200, contentType: "text/plain", body: "" });
          }
          return route.continue();
        });
        const page = await context.newPage();
        page.on("pageerror", error => errors.push(error.message));
        await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
        await page.goto(`${origin}/hselementary/question-bank/`);
        await page.locator("#gradeFilter [data-grade='5']").click();
        await page.locator("#termFilter [data-term='2']").click();
        await page.locator("#unitFilter").selectOption("5-2-u1");
        const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
        assert.equal(await checkbox.isDisabled(), false, `${id} should be enabled at ${width}px`);
        await checkbox.check();
        await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
        await page.locator("#questionCountInput").fill("1");
        await page.locator("#generateButton").click();
        await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
        assert((await page.locator("#problemView").innerText()).trim(), `${id} problem rendered`);
        assert.equal(await page.locator("#problemView .source52-range-solution").count(), 0, `${id} solution must not leak into problem view`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} problem overflow at ${width}px`);
        await page.locator("#solutionTab").click();
        assert((await page.locator("#solutionView .source52-range-solution").innerText()).trim(), `${id} solution rendered`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} solution overflow at ${width}px`);
        if (evidenceDir && difficulty === 0 && width === 1280) await page.screenshot({ path: path.join(evidenceDir, `${id}-solution-1280.png`), fullPage: true });
        if (evidenceDir && difficulty === 0 && width === 1280) {
          await page.locator("#problemTab").click();
          await page.screenshot({ path: path.join(evidenceDir, `${id}-problem-1280.png`), fullPage: true });
          await page.locator("#solutionTab").click();
        }
        if (evidenceDir && difficulty === 0 && width === 375) await page.screenshot({ path: path.join(evidenceDir, `${id}-solution-375.png`), fullPage: true });
        states += 1;
        await context.close();
      }
    }
  }
  if (process.env.HSE_CREATE_PDF === "1") {
    assert(evidenceDir, "Set MAC_CHECK_OUTPUT before creating print evidence");
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", async route => new URL(route.request().url()).origin === origin
      ? route.continue() : route.fulfill({ status: 200, contentType: "text/plain", body: "" }));
    const page = await context.newPage();
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
    await page.goto(`${origin}/hselementary/question-bank/`);
    await page.locator("#gradeFilter [data-grade='5']").click();
    await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u1");
    for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
    await page.locator("#questionCountInput").fill(String(ids.length));
    await page.locator("#generateButton").click();
    await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
    const problemItems = await page.locator("#problemView .question-item").evaluateAll(items => items.map(item => item.dataset.typeId || item.querySelector("[data-source-item-id]")?.dataset.sourceItemId || ""));
    assert.equal(problemItems.length, ids.length, "The mixed print fixture contains four source questions");
    const renderedIds = await page.locator("#problemView [data-source-item-id]").evaluateAll(items => [...new Set(items.map(item => item.dataset.sourceItemId))]);
    assert.deepEqual(renderedIds.sort(), [...ids].sort(), "Each verified source type appears once in the print fixture");
    const files = [];
    for (const mode of ["problem", "solution"]) {
      if (mode === "solution") await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
      if (mode === "solution") await page.locator("#solutionTab").click();
      await page.locator("#printMenuButton").click();
      await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
      await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
      const file = path.join(evidenceDir, `rounding-e2-${mode}.pdf`);
      await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
      files.push(file);
    }
    await context.close();
    const { spawnSync } = require("node:child_process");
    const python = process.env.HSE_PYTHON || "python3";
    const output = path.join(evidenceDir, "rounding-e2-question-and-solution.pdf");
    const merge = spawnSync(python, ["-c", "from pypdf import PdfReader, PdfWriter; import sys; w=PdfWriter(); [w.append(PdfReader(p)) for p in sys.argv[1:-1]]; w.write(sys.argv[-1])", ...files, output], { encoding: "utf8" });
    assert.equal(merge.status, 0, merge.stderr || "Could not combine print evidence");
  }
  await browser.close();
  assert.deepEqual(errors, [], "No page errors");
  console.log(JSON.stringify({ status: "passed", states, desktopAndMobileWidths: widths, difficultyOffsets: difficulties, isolatedContexts: states,
    blockedExternalRequests: blockedRequests, existingStudentProfilesUsed: false, answerLeakChecks: states, horizontalOverflowChecks: states * 2 }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
