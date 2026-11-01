"use strict";

// Exercise the six page-11 practice types together in fresh browser contexts.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
const output = process.env.MAC_CHECK_OUTPUT;
const ids = [
  "5-2-u1-e4-mission-1-rounded-count",
  "5-2-u1-e4-mission-2-rounded-floor-range",
  "5-2-u1-e4-mission-3-notebook-range",
  "5-2-u1-e4-mission-4-rounded-seven-million-range",
  "5-2-u1-e4-mission-5-quotient-range-sum",
  "5-2-u1-e4-mission-6-rounded-place-synthetic"
];
if (process.env.HSE_CREATE_PDF === "1") {
  assert(output && path.isAbsolute(output), "Set a private absolute MAC_CHECK_OUTPUT");
  fs.mkdirSync(output, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const observations = [];
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin
        ? route.continue() : route.fulfill({ status: 200, body: "" }));
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage(), errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`);
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator("#unitFilter").selectOption("5-2-u1");
      for (const id of ids) {
        const input = page.locator(`#typeList input[data-type-id='${id}']`);
        assert.equal(await input.isDisabled(), false, `${id} selectable`);
        await input.check();
      }
      await page.locator("#questionCountInput").fill("18");
      await page.locator("#difficultyFilter [data-difficulty='0']").click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const data = await page.evaluate(ids => {
        const modules = [
          window.HSE_SOURCE_52_ROUNDED_COUNT_MISSION1,
          window.HSE_SOURCE_52_ROUNDED_RANGE_MISSION2,
          window.HSE_SOURCE_52_NOTEBOOK_RANGE_MISSION3,
          window.HSE_SOURCE_52_ROUNDED_RANGE_MISSION4,
          window.HSE_SOURCE_52_QUOTIENT_RANGE_SUM_MISSION5,
          window.HSE_SOURCE_52_ROUNDED_COUNT_MISSION6
        ];
        const problems = [...document.querySelectorAll("#problemView .question-item")].map(item => {
          const marker = item.querySelector("[data-source-item-id]");
          if (!marker) return null;
          const id = marker.dataset.sourceItemId, variant = Number(marker.dataset.poolIndex);
          const api = modules[ids.indexOf(id)], question = api?.getQuestion(variant, 0);
          return question && { id, variant, answer: question.answer, prompt: marker.textContent };
        });
        return { problems, solutions: [...document.querySelectorAll("#solutionView .solution-item")].map(e => e.innerText),
          overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }, ids);
      assert.equal(data.problems.length, 18);
      assert.equal(data.solutions.length, 18);
      assert.equal(data.overflow, false);
      for (const id of ids) {
        const owned = data.problems.filter(item => item?.id === id);
        assert.equal(owned.length, 3, `${id} produces three problems`);
        assert.deepEqual(owned.map(item => item.variant).sort(), [0, 1, 2]);
      }
      data.problems.forEach((item, index) => {
        assert(item && item.prompt.trim(), `problem ${index + 1} is present`);
        const compact = value => value.replace(/\s/g, "");
        assert(compact(data.solutions[index]).includes(compact(item.answer)), `solution ${index + 1} matches its problem`);
      });
      await page.locator("#solutionTab").click();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (width === 1280 && process.env.HSE_CREATE_PDF === "1") {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.pdf({ path: path.join(output, `page11-mixed-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
          await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
        }
      }
      assert.deepEqual(errors, []);
      observations.push({ width, problems: data.problems.length, linkedSolutions: data.solutions.length });
      await context.close();
    }
  } finally { await browser.close(); }
  console.log(JSON.stringify({ status: "passed", observations }));
})().catch(error => { console.error(error); process.exitCode = 1; });
