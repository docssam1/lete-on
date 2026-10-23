"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u1-e3-mission-4-mat-cost";
const widths = [1280, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });
const errors = [];
let blockedRequests = 0;

async function prepare(page, width) {
  await page.setViewportSize({ width, height: 1000 });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
  await page.goto(`${origin}/hselementary/question-bank/`);
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("5-2-u1");
  const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
  assert.equal(await checkbox.isDisabled(), false, `Mission 4 enabled at ${width}px`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let states = 0;
  const observations = [];
  for (const width of widths) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1280 ? [0, 1, 2] : [0])) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin
      ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await prepare(page, width);
    await page.evaluate(({ id, variant }) => {
      const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
      window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
        ? original(type, rank, difficulty, seed, variant) : original(type, rank, difficulty, seed, requested);
    }, { id, variant });
    await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
    await page.locator("#generateButton").click();
    await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
    const table = page.locator(`#problemView [data-source-item-id='${id}'] table.source52-supply-cost-table`).first();
    assert.equal(await table.count(), 1, "The original comparison table must be represented in the question");
    const facts = await table.evaluate(element => ({
      caption: element.caption?.innerText,
      headers: [...element.querySelectorAll("thead th")].map(cell => cell.innerText.trim()),
      rows: [...element.querySelectorAll("tbody tr")].map(row => [...row.children].map(cell => cell.innerText.trim())),
      box: element.getBoundingClientRect().toJSON(),
      tableWidth: getComputedStyle(element).width
    }));
    assert.equal(facts.caption, "마트별 스케치북 묶음 판매");
    assert.deepEqual(facts.headers, ["마트", "한 묶음의 수", "한 묶음의 가격"]);
    assert.equal(facts.rows.length, 2);
    assert(facts.box.width <= width - 20, `Table must fit ${width}px viewport`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
    await page.locator("#problemTab").click();
    const problemText = await page.locator("#problemView").innerText();
    assert.match(problemText, /묶음으로만 사서 부족하지 않게/);
    assert.equal(await page.locator("#problemView .source52-supply-cost-solution").count(), 0, "Solution must not leak into the problem");
    assert.doesNotMatch(problemText, /\d[\d,]*원 절약/);
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission4-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solution = await page.locator("#solutionView").innerText();
    assert.match(solution, /원−[\d,]+원=[\d,]+원이므로/);
    assert.match(solution, /묶음을 삽니다/);
    assert.match(solution, /권이 남/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
    observations.push({ width, difficulty, variant, rows: facts.rows });
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission4-solution-${width}.png`), fullPage: true });
    if (variant === 0 && difficulty === 0 && width === 1280 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `grade52-mission4-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, overflowChecks: states * 2, a4ProblemAndSolutionExported: Boolean(evidenceDir), observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
