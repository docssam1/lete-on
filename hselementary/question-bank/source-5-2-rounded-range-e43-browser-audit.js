"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u1-e4-example-3";
const widths = [1440, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  const errors = [];
  let blockedRequests = 0;
  const observations = [];
  let states = 0;
  for (const width of widths) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1440 ? [0, 1, 2] : [0])) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin
      ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
    await context.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/hselementary/question-bank/`);
    await page.locator("#gradeFilter [data-grade='5']").click();
    await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u1");
    const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
    assert.equal(await checkbox.isDisabled(), false);
    await checkbox.check();
    await page.locator("#questionCountInput").fill("1");
    await page.evaluate(({ id, variant }) => {
      const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
      window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
        ? original(type, rank, difficulty, seed, variant) : original(type, rank, difficulty, seed, requested);
    }, { id, variant });
    await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
    await page.locator("#generateButton").click();
    await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
    const question = await page.evaluate(({ variant, difficulty }) => window.HSE_SOURCE_52_ROUNDED_RANGE_E43.getQuestion(variant, difficulty), { variant, difficulty });
    const problem = page.locator("#problemView");
    const prompt = await problem.innerText();
    assert.equal(await problem.locator(`[data-source-item-id='${id}']`).count(), 1);
    assert(!prompt.includes(question.answer), "Answer leaked into problem view");
    assert.equal(await problem.locator(`[data-source-answer='${id}']`).count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `example43-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solution = await page.locator("#solutionView").innerText();
    assert(solution.includes(question.answer));
    assert.match(solution, /합을 백의 자리까지 반올림/);
    assert.match(solution, /차를 백의 자리까지 반올림/);
    assert.match(solution, /큰 수는 \(합\+차\)÷2/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `example43-solution-${width}.png`), fullPage: true });
    if (evidenceDir && variant === 0 && difficulty === 0 && width === 1440) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `example43-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    observations.push({ width, difficulty, variant, answer: question.answer, problemChars: prompt.length, solutionChars: solution.length });
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", id, states, widths, difficulties: [-1, 0, 1], blockedRequests, overflowChecks: states * 2, answerLeak: false, a4FilesCreated: evidenceDir ? 2 : 0, observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
