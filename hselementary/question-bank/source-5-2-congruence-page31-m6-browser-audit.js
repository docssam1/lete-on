"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u3-e4-mission-6";
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
  assert.equal(await checkbox.isDisabled(), false, `Mission 6 enabled at ${width}px`);
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
    const diagram = page.locator(`#problemView [data-source-item-id='${id}'] svg[data-source52-figure='trapezoid-midpoint-area']`).first();
    assert.equal(await diagram.count(), 1);
    const facts = await diagram.evaluate(svg => ({
      height: Number(svg.dataset.height), top: Number(svg.dataset.top), bottom: Number(svg.dataset.bottom),
      points: Object.fromEntries(["g", "n", "d", "r", "m", "p"].map(key => [key, svg.dataset[key].split(",").map(Number)])),
      label: svg.getAttribute("aria-label"), box: svg.getBoundingClientRect().toJSON(),
      points: svg.querySelector("polygon").getAttribute("points")
    }));
    assert(facts.label.includes("사다리꼴") && facts.label.includes("넓이"));
    assert(facts.box.width <= width - 20, `Diagram must fit ${width}px viewport`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
    await page.locator("#problemTab").click();
    const problem = page.locator("#problemView");
    const problemText = await problem.innerText();
    assert.match(problemText, /사다리꼴 ㄱㄴㄷㄹ/);
    assert.match(problemText, /삼각형 ㄱㄹㅁ의 넓이/);
    assert.match(problemText, /점 ㅁ은 변 ㄴㄷ의 한가운데 점/);
    assert.equal(await problem.locator(`[data-source-answer='${id}']`).count(), 0, "Solution markup must not leak into the problem");
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission6-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solutionView = page.locator("#solutionView");
    const solution = await solutionView.innerText();
    const proofDiagram = solutionView.locator("svg.source52-p31-trapezoid-proof");
    assert.equal(await proofDiagram.count(), 1, "The midpoint line and its intersection point must be drawn in the solution");
    const proofBounds = await proofDiagram.boundingBox();
    assert(proofBounds.width <= width - 20, `Solution proof diagram must fit ${width}px viewport`);
    assert.equal(await proofDiagram.locator("text").filter({ hasText: "ㅂ" }).count(), 1, "The midpoint line intersection ㅂ is labeled");
    assert.match(solution, /사다리꼴의 중선 길이는 두 평행한 변의 길이의 평균/);
    assert.match(solution, /밑변 ㄱㄹ/);
    assert.match(solution, new RegExp(`${facts.height*((facts.top+facts.bottom)/2)/2}cm(?:²|2)`));
    assert.equal(await solutionView.locator(`[data-source-answer='${id}']`).count(), 1, "The worked solution must stay in the solution tab");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
    if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission6-solution-${width}.png`), fullPage: true });
    observations.push({ width, difficulty, variant, top: facts.top, bottom: facts.bottom, height: facts.height, diagramWidth: Math.round(facts.box.width) });
    if (variant === 0 && difficulty === 0 && width === 1280 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `grade52-mission6-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, problemSolutionSeparated: true, overflowChecks: states * 2, a4ProblemAndSolutionExported: Boolean(evidenceDir), observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
