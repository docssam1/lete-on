"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const ids = ["5-2-u1-e4-exploration-rounded-range", "5-2-u1-e4-example-1"];
const widths = [1280, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });
const errors = [];
let blockedRequests = 0;

async function prepare(page, width, id) {
  await page.setViewportSize({ width, height: 1000 });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
  await page.goto(`${origin}/hselementary/question-bank/`);
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("5-2-u1");
  const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
  assert.equal(await checkbox.isDisabled(), false, `${id} enabled at ${width}px`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let states = 0;
  const observations = [];
  for (const id of ids) for (const width of widths) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1280 ? [0, 1, 2] : [0])) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin
      ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await prepare(page, width, id);
    await page.evaluate(({ id, variant }) => {
      const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
      window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
        ? original(type, rank, difficulty, seed, variant) : original(type, rank, difficulty, seed, requested);
    }, { id, variant });
    await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
    await page.locator("#generateButton").click();
    await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
    const root = page.locator(`#problemView [data-source-item-id='${id}']`).first();
    assert.equal(await root.count(), 1, `${id} rendered at ${width}/${variant}/${difficulty}`);
    const problemText = await page.locator("#problemView").innerText();
    const question = await page.evaluate(({ id, variant, difficulty }) => window.HSE_SOURCE_52_ROUNDED_RANGE_E4.getQuestion(id, variant, difficulty), { id, variant, difficulty });
    assert.equal(question.sourceItemId, id);
    assert(!problemText.includes(question.answer), `Answer leaked for ${id} at ${width}/${variant}/${difficulty}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${id}/${variant}/${difficulty}`);
    assert.equal(await page.locator(`#problemView [data-source-answer='${id}']`).count(), 0, "Solution markup must not appear in the question");
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example41" : "exploration4"}-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solutionText = await page.locator("#solutionView").innerText();
    if (id === ids[0]) {
      assert.match(solutionText, /50개/);
      assert.match(solutionText, /부터/);
    } else {
      assert.match(solutionText, /백의 자리 버림과 반올림/);
      assert.match(solutionText, /십의 자리 올림과 반올림/);
      assert(solutionText.includes(question.answer));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${id}/${variant}/${difficulty}`);
    observations.push({ sourceItemId: id, width, difficulty, variant, promptLength: problemText.length, solutionLength: solutionText.length });
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example41" : "exploration4"}-solution-${width}.png`), fullPage: true });
    if (variant === 0 && difficulty === 0 && width === 1280 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example41" : "exploration4"}-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemIds: ids, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, overflowChecks: states * 2, a4FilesCreated: evidenceDir ? 4 : 0, observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
