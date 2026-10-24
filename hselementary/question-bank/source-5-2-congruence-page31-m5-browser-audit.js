"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u3-e4-mission-5";
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
  await page.locator("#unitFilter").selectOption("5-2-u3");
  const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
  assert.equal(await checkbox.isDisabled(), false, `Mission 5 enabled at ${width}px`);
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
    const diagram = page.locator(`#problemView [data-source-item-id='${id}'] svg[data-source52-figure='congruent-triangle-area']`).first();
    assert.equal(await diagram.count(), 1);
    const facts = await diagram.evaluate(svg => ({
      height: Number(svg.dataset.height), width: Number(svg.dataset.width),
      label: svg.getAttribute("aria-label"), box: svg.getBoundingClientRect().toJSON(),
      points: svg.querySelector("polygon").getAttribute("points")
    }));
    assert(facts.label.includes("합동인 두 직각삼각형") && facts.label.includes("넓이"));
    assert(facts.box.width <= width - 20, `Diagram must fit ${width}px viewport`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
    await page.locator("#problemTab").click();
    const problem = page.locator("#problemView");
    const problemText = await problem.innerText();
    assert.match(problemText, /서로 합동입니다/);
    assert.match(problemText, /삼각형 ㄱㄷㅁ의 넓이/);
    assert.equal(await problem.locator(`[data-source-answer='${id}']`).count(), 0, "Solution markup must not leak into the problem");
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission5-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solutionView = page.locator("#solutionView");
    const solution = await solutionView.innerText();
    const proofDiagram = solutionView.locator("svg.source52-p31-area-proof");
    assert.equal(await proofDiagram.count(), 1, "The construction point and enclosing rectangle must be drawn in the solution");
    const proofBounds = await proofDiagram.boundingBox();
    assert(proofBounds.width <= width - 20, `Solution proof diagram must fit ${width}px viewport`);
    assert.equal(await proofDiagram.locator("text").filter({ hasText: "ㅂ" }).count(), 1, "The introduced rectangle vertex ㅂ is labeled");
    assert.match(solution, /합동 표기 순서대로/);
    assert.match(solution, /직사각형/);
    assert.match(solution, /세 부분/);
    assert.match(solution, new RegExp(`${(facts.height*facts.height+facts.width*facts.width)/2}cm(?:²|2)`));
    assert.equal(await solutionView.locator(`[data-source-answer='${id}']`).count(), 1, "The worked solution must stay in the solution tab");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission5-solution-${width}.png`), fullPage: true });
    observations.push({ width, difficulty, variant, height: facts.height, widthCm: facts.width, diagramWidth: Math.round(facts.box.width) });
    if (variant === 0 && difficulty === 0 && width === 1280 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `grade52-mission5-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, problemSolutionSeparated: true, overflowChecks: states * 2, a4ProblemAndSolutionExported: Boolean(evidenceDir), observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
