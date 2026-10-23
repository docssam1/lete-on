"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8917";
const id = "5-2-u1-e3-mission-2-perimeter";
const widths = [1280, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });
const backgroundErrors = [];
const missionErrors = [];
let states = 0;
let blockedRequests = 0;
let activeBrowser;

async function prepare(page, width) {
  await page.setViewportSize({ width, height: 1000 });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
  await page.goto(`${origin}/hselementary/question-bank/`);
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("5-2-u1");
  const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
  assert.equal(await checkbox.isDisabled(), false, `Mission 2 enabled at ${width}px`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = activeBrowser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const width of widths) {
    for (const difficulty of [-1, 0, 1]) {
      for (const variant of (width === 1280 ? [0, 1, 2] : [0])) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
        await context.route("**/*", route => new URL(route.request().url()).origin === origin
          ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
        const page = await context.newPage();
        let phase = "startup";
        page.on("pageerror", error => (phase === "mission2" ? missionErrors : backgroundErrors).push(error.message));
        await prepare(page, width);
        await page.evaluate(({ id, variant }) => {
          const originalGenerate = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
          window.HSE_GENERATORS.generate = (type, levelRank, difficultyOffset, seed, requestedVariant) =>
            type?.sourceItemId === id ? originalGenerate(type, levelRank, difficultyOffset, seed, variant) : originalGenerate(type, levelRank, difficultyOffset, seed, requestedVariant);
        }, { id, variant });
        await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
        phase = "mission2";
        await page.locator("#generateButton").click();
        await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
        const diagram = page.locator(`#problemView [data-source-item-id='${id}'] svg.source52-l-perimeter`).first();
        assert.equal(await diagram.count(), 1, `Diagram rendered: ${width}/${variant}/${difficulty}`);
        const diagramFacts = await diagram.evaluate(svg => ({
          height: svg.dataset.totalHeightMm,
          width: svg.dataset.totalWidthMm,
          accessible: svg.getAttribute("aria-label"),
          box: svg.getBoundingClientRect().toJSON()
        }));
        assert(diagramFacts.accessible && diagramFacts.accessible.includes("ㄱ자") && diagramFacts.accessible.includes("밀리미터"), JSON.stringify(diagramFacts));
        assert(diagramFacts.box.width <= width - 20, `Diagram must fit ${width}px viewport`);
        const visibleProblem = await page.locator("#problemView").innerText();
        assert.match(visibleProblem, /아래 그림과 같은 도형의 둘레는 약 몇 cm/);
        assert.equal(await page.locator("#problemView .source52-perimeter-solution").count(), 0, "Solution must not leak into the problem");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}/${variant}/${difficulty}`);
        await page.locator("#solutionTab").click();
        const solution = await page.locator("#solutionView").innerText();
        assert.match(solution, /둘레는/);
        const shownHeight = Number(diagramFacts.height);
        const shownWidth = Number(diagramFacts.width);
        const expectedPerimeter = 2 * (shownHeight + shownWidth);
        assert.match(solution, new RegExp(`${expectedPerimeter}mm`));
        assert.match(solution, new RegExp(`${expectedPerimeter / 10}cm`));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}/${variant}/${difficulty}`);
        if (evidenceDir && variant === 0 && difficulty === 0) {
          await page.screenshot({ path: path.join(evidenceDir, `mission2-solution-${width}.png`), fullPage: true });
          await page.locator("#problemTab").click();
          await page.screenshot({ path: path.join(evidenceDir, `mission2-problem-${width}.png`), fullPage: true });
        }
        if (variant === 0 && difficulty === 0 && width === 1280) {
          for (const mode of ["problem", "solution"]) {
            if (mode === "solution") await page.locator("#solutionTab").click();
            await page.locator("#printMenuButton").click();
            await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
            await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
            await page.pdf({ path: path.join(evidenceDir || "/tmp", `grade52-mission2-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          }
        }
        states++;
        await context.close();
      }
    }
  }
  await browser.close();
  assert.deepEqual(missionErrors, [], "Mission 2 interaction produced no page errors");
  console.log(JSON.stringify({ status: "passed", sourceItemId: id, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, horizontalOverflowChecks: states * 2, a4ProblemAndSolutionExported: true, unrelatedExistingPageErrorsDuringStartup: [...new Set(backgroundErrors)] }, null, 2));
})().catch(async error => { console.error(error); await activeBrowser?.close().catch(() => {}); process.exitCode = 1; });
