"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:18763";
const id = "5-2-u3-e4-example-2";
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
  assert.equal(await checkbox.isDisabled(), false, `Example 4-2 enabled at ${width}px`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let states = 0;
  const observations = [];
  for (const width of [1280, 375]) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1280 ? [0, 1, 2] : [1])) {
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
    const problem = page.locator("#problemView");
    const diagram = problem.locator(`svg[data-source52-figure='equilateral-angle-chase-example2']`);
    assert.equal(await diagram.count(), 1);
    const facts = await diagram.evaluate(svg => ({
      alpha: Number(svg.dataset.alpha), beta: Number(svg.dataset.beta), target: Number(svg.dataset.targetAngle),
      box: svg.getBoundingClientRect().toJSON(), viewBox: svg.getAttribute("viewBox").split(" ").map(Number),
      labels: [...svg.querySelectorAll("text")].map(node => { const box = node.getBBox(); return { x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height }; })
    }));
    assert.equal(facts.target, 180 - facts.alpha - facts.beta);
    assert(facts.box.width <= width - 20, `Diagram must fit ${width}px viewport`);
    assert(facts.labels.every(label => label.x >= -2 && label.y >= -2 && label.right <= facts.viewBox[2] + 2 && label.bottom <= facts.viewBox[3] + 2), `SVG labels remain inside viewBox: ${JSON.stringify(facts.labels)}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
    const problemText = await problem.innerText();
    assert.match(problemText, /정삼각형 ㄱㄴㄷ과 정삼각형 ㄴㄹㅁ/);
    assert.equal(await problem.locator(`[data-source-answer='${id}']`).count(), 0, "Solution markup must not leak into the problem");
    const solutionTab = page.locator("#solutionTab");
    await solutionTab.click();
    const solutionView = page.locator("#solutionView");
    const solution = await solutionView.innerText();
    assert.match(solution, /시계 방향 60° 회전/);
    assert.match(solution, /∠ㄴㅁㄱ=∠ㄴㄹㄷ/);
    assert.equal(await solutionView.locator(`svg[data-source52-figure='equilateral-angle-chase-example2']`).count(), 1, "Solution has its own worked figure");
    assert.equal(await solutionView.locator(`[data-source-answer='${id}']`).count(), 1, "The worked solution stays in the solution tab");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
    if (evidenceDir && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `example2-${width}-${width === 1280 ? "desktop" : "mobile"}-solution.png`), fullPage: true });
    if (evidenceDir && width === 1280 && difficulty === 0 && variant === 1) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `grade52-example2-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    observations.push({ width, variant, difficulty, alpha: facts.alpha, beta: facts.beta, target: facts.target, diagramWidth: Math.round(facts.box.width) });
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths: [1280, 375], allSyntheticVariantsAtDesktop: true, solutionProblemSeparated: true, noAnswerLeak: true, blockedExternalRequests: blockedRequests, a4ProblemAndSolutionExported: Boolean(evidenceDir), observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
