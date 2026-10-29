"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:18763";
const id = "5-2-u3-e4-mission-4";
const widths = [1280, 375];
const difficulties = [-1, 0, 1];
const variants = [0, 1, 2];
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
  assert.equal(await checkbox.isDisabled(), false, `Mission 4 enabled at ${width}px`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let states = 0;
  const observations = [];
  for (const width of widths) for (const difficulty of difficulties) for (const variant of variants) {
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
    const diagram = page.locator(`#problemView [data-source-item-id='${id}'] svg[data-source52-figure='square-trisection-inner-area']`);
    assert.equal(await diagram.count(), 1);
    const facts = await diagram.evaluate(svg => ({
      k: Number(svg.dataset.k), side: Number(svg.dataset.sideLength), outerArea: Number(svg.dataset.outerArea),
      points: Object.fromEntries(["g","n","d","r","m","b","s","o"].map(key => [key, svg.dataset[key].split(",").map(Number)])),
      labels: [...svg.querySelectorAll("text")].map(node => node.textContent.trim()),
      label: svg.getAttribute("aria-label"), box: svg.getBoundingClientRect().toJSON()
    }));
    const k = [8, 11, 14][variant] + difficulty;
    const expectedAnswer = 5*k*k;
    assert.equal(facts.k, k);
    assert.equal(facts.side, 3*k);
    assert.equal(facts.outerArea, 9*k*k);
    assert.deepEqual(facts.labels, ["ㄱ","ㄹ","ㄷ","ㄴ","ㅁ","ㅂ","ㅅ","ㅇ"]);
    assert(facts.label.includes("삼등분") && facts.label.includes("작은 정사각형"));
    assert(facts.box.width <= width - 20, `Diagram must fit ${width}px viewport`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
    await page.locator("#problemTab").click();
    const problem = page.locator("#problemView");
    const problemText = await problem.innerText();
    assert.match(problemText, new RegExp(`넓이가 ${9*k*k}cm(?:²|2)인 정사각형 ㄱㄴㄷㄹ`));
    assert.match(problemText, /작은 정사각형 ㅁㅂㅅㅇ/);
    assert.equal(await problem.locator(`[data-source-answer='${id}']`).count(), 0, "Solution markup must not leak into problem");
    assert.doesNotMatch(problemText, new RegExp(`${expectedAnswer}cm(?:²|2)`), "The answer must not appear in the problem");
    if (evidenceDir && variant === 1 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission4-problem-${width}.png`), fullPage: true });
    await page.locator("#solutionTab").click();
    const solutionView = page.locator("#solutionView");
    const solution = await solutionView.innerText();
    assert.match(solution, new RegExp(`${k}×${2*k}÷2=${k*k}cm(?:²|2)`));
    assert.match(solution, new RegExp(`${9*k*k}−${4*k*k}=${expectedAnswer}cm(?:²|2)`));
    assert.equal(await solutionView.locator(`[data-source-answer='${id}']`).count(), 1, "The worked solution stays in the solution tab");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
    if (evidenceDir && variant === 1 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `mission4-solution-${width}.png`), fullPage: true });
    if (variant === 1 && difficulty === 0 && width === 1280 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.pdf({ path: path.join(evidenceDir, `grade52-mission4-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    observations.push({ width, difficulty, variant, k, outerArea: facts.outerArea, answer: expectedAnswer, diagramWidth: Math.round(facts.box.width) });
    states++;
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths, difficultyOffsets: difficulties, variants, sourceExactExcluded: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, problemSolutionSeparated: true, overflowChecks: states * 2, a4ProblemAndSolutionExported: Boolean(evidenceDir), observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
