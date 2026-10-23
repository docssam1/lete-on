"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");

const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8909";
const ids = ["round-up", "round-down", "round-nearest"].map(suffix => `5-2-u1-e3-exploration-${suffix}`);
const widths = [1280, 375];
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

async function chooseUnit(page) {
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("5-2-u1");
}
async function blockExternal(context) {
  await context.route("**/*", route => new URL(route.request().url()).origin === origin
    ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const width of widths) for (const id of ids) for (const difficulty of difficulties) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
    await blockExternal(context);
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
    await page.goto(`${origin}/hselementary/question-bank/`);
    await chooseUnit(page);
    const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
    assert.equal(await checkbox.isDisabled(), false, `${id} enabled at ${width}px`);
    await checkbox.check();
    await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
    await page.locator("#questionCountInput").fill("1");
    await page.locator("#generateButton").click();
    await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
    const problem = await page.locator("#problemView").innerText();
    assert(problem.trim(), `${id} problem rendered`);
    assert.equal(await page.locator("#problemView .source52-rounding-solution").count(), 0, `${id} solution must not leak`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} problem overflow at ${width}px`);
    await page.locator("#solutionTab").click();
    const solution = await page.locator("#solutionView").innerText();
    assert(solution.length > 40, `${id} explanation rendered`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} solution overflow at ${width}px`);
    if (evidenceDir && difficulty === 0 && width === 1280) {
      await page.screenshot({ path: path.join(evidenceDir, `${id}-solution-1280.png`), fullPage: true });
      await page.locator("#problemTab").click();
      await page.screenshot({ path: path.join(evidenceDir, `${id}-problem-1280.png`), fullPage: true });
    }
    if (evidenceDir && difficulty === 0 && width === 375) {
      await page.screenshot({ path: path.join(evidenceDir, `${id}-solution-375.png`), fullPage: true });
    }
    states++;
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: "block" });
  await blockExternal(context);
  const page = await context.newPage();
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
  await page.goto(`${origin}/hselementary/question-bank/`);
  await chooseUnit(page);
  for (const id of ids) await page.locator(`#typeList input[data-type-id='${id}']`).check();
  await page.locator("#questionCountInput").fill("9");
  await page.locator("#generateButton").click();
  await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
  const rendered = await page.locator("#problemView [data-source-item-id]").evaluateAll(nodes => [...new Set(nodes.map(node => node.dataset.sourceItemId))]);
  assert.deepEqual(rendered.sort(), [...ids].sort(), "A4 fixture contains each Exploration 3 type");
  await page.locator("#solutionTab").click();
  const solutionPageCounts = await page.locator("#solutionView .answer-page").evaluateAll(nodes => nodes.map(node => node.querySelectorAll(".solution-item").length));
  assert.deepEqual(solutionPageCounts, [5, 4], "A4 explanations should be balanced across two full pages");
  const pdfFiles = [];
  for (const mode of ["problem", "solution"]) {
    if (mode === "solution") await page.locator("#solutionTab").click();
    await page.locator("#printMenuButton").click();
    await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
    await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
    const file = path.join(evidenceDir || "/tmp", `rounding-application-e3-${mode}.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    pdfFiles.push(file);
  }
  await context.close();
  await browser.close();
  assert.deepEqual(errors, [], "No page errors");
  console.log(JSON.stringify({ status: "passed", states, widths, difficulties, blockedExternalRequests: blockedRequests,
    answerLeakChecks: states, horizontalOverflowChecks: states * 2, existingStudentProfilesUsed: false,
    a4FixtureSourceTypes: rendered.length, a4PdfFiles: pdfFiles, a4MixedPdf: false }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
