"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const id = "5-2-u2-e2-mission-6-spacing-synthetic";
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [1280, 375]) for (const level of [-1, 0, 1]) for (const variant of [0, 1, 2]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u2");
      await page.locator(`#typeList input[data-type-id='${id}']`).check();
      await page.locator("#questionCountInput").fill("1");
      await page.locator(`#difficultyFilter [data-difficulty="${level}"]`).click();
      await page.evaluate(({ id, variant }) => {
        const generate = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
        window.HSE_GENERATORS.generate = (type, rank, level, seed, requested) => generate(type, rank, level, seed, type?.id === id ? variant : requested);
      }, { id, variant });
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const problem = page.locator(`#problemView [data-source-item-id='${id}']`).first();
      const geometry = await problem.locator("svg").evaluate(svg => {
        const rect = svg.querySelector("rect"), circles = [...svg.querySelectorAll('circle[r="56"]')];
        return { width: Number(rect.getAttribute("width")), height: Number(rect.getAttribute("height")), centers: circles.map(c => Number(c.getAttribute("cx"))), count: circles.length };
      });
      const halves = [5, 7, 9][variant], quarters = ({[-1]:4,0:2,1:1})[level], step = 112 * quarters / (2 * halves);
      assert.equal(geometry.count, 10);
      assert.equal(geometry.height, 112);
      assert(Math.abs(geometry.width - (112 + 9 * step)) < .002);
      for (let i = 1; i < 10; i++) assert(Math.abs(geometry.centers[i] - geometry.centers[i-1] - step) < .002);
      assert.match(await problem.innerText(), /중심 사이 거리/);
      assert.doesNotMatch(await problem.innerText(), /도움말|힌트/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.locator("#solutionTab").click();
      const solution = page.locator(`#solutionView [data-source-answer='${id}']`);
      const expected = await page.evaluate(({v,l}) => window.HSE_SOURCE_52_U2_PAGE17_MISSION6_SPACING.build([5, 7, 9][v], l).answer, {v:variant,l:level});
      const compact = s => s.replace(/[\s/]/g, "").replace(/²/g, "2");
      const actual = await solution.innerText();
      assert(compact(actual).includes(compact(expected)), `Variant ${variant}: ${actual} must contain ${expected}`);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
          await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `circle-${level}-${variant}-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log("PASS: 9 circle geometries and matching answers on desktop and mobile");
})().catch(error => { console.error(error); process.exitCode = 1; });
