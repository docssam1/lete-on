"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8919";
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
const missions = [
  { id: "5-2-u1-e4-mission-4-rounded-seven-million-range", api: "HSE_SOURCE_52_ROUNDED_TRIPLET_MISSION4" },
  { id: "5-2-u1-e4-mission-5-quotient-range-sum", api: "HSE_SOURCE_52_QUOTIENT_SUM_MISSION5" }
];
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  const errors = [];
  const observations = [];
  let blockedRequests = 0;
  for (const mission of missions) for (const width of [1440, 375]) for (const difficulty of [-1, 0, 1]) {
    const variants = width === 1440 ? [0, 1, 2] : [0];
    for (const variant of variants) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: "block" });
      await context.route("**/*", route => new URL(route.request().url()).origin === origin
        ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
      const page = await context.newPage();
      page.on("pageerror", error => errors.push(error.message));
      page.setDefaultTimeout(8000);
      await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "domcontentloaded", timeout: 10000 });
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
    await page.waitForFunction(() => [...document.querySelector("#unitFilter").options].some(option => option.value === "5-2-u1"));
      await page.locator("#unitFilter").selectOption("5-2-u1");
      const checkbox = page.locator(`#typeList input[data-type-id='${mission.id}']`);
      assert.equal(await checkbox.isDisabled(), false, `${mission.id} is source-verified and available`);
      await checkbox.check();
      await page.locator("#questionCountInput").fill("1");
      await page.evaluate(({ id, apiName, variant }) => {
        const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
        window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
          ? original(type, rank, difficulty, seed, variant) : original(type, rank, difficulty, seed, requested);
        window.__qaMission = window[apiName];
      }, { id: mission.id, apiName: mission.api, variant });
      await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const q = await page.evaluate(({ variant, difficulty }) => window.__qaMission.getQuestion(variant, difficulty), { variant, difficulty });
      const problem = page.locator("#problemView");
      const prompt = await problem.innerText();
      assert.equal(await problem.locator(`[data-source-item-id='${mission.id}']`).count(), 1);
      assert(!prompt.includes(q.answer), "Answer must stay out of the learner problem");
      assert.equal(await problem.locator(`[data-source-answer='${mission.id}']`).count(), 0);
      assert.equal(await problem.locator("svg, img, canvas").count(), 0, "Text-only source must not gain an invented figure");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Problem overflow ${width}`);
      if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${mission.id}-problem-${width}.png`), fullPage: true });
      await page.locator("#solutionTab").click();
      const solution = await page.locator("#solutionView").innerText();
      assert(solution.includes(q.answer), "Solution must show the verified answer");
      if (mission.id.endsWith("mission-4-rounded-seven-million-range")) {
        const { lower, lowerInclusive, upper, upperInclusive } = q.questionModel.intersection;
        assert(q.answer.includes(lowerInclusive ? "이상" : "초과"), "Mission 4 answer must preserve its generated lower endpoint");
        assert(q.answer.includes(upperInclusive ? "이하" : "미만"), "Mission 4 answer must preserve its generated upper endpoint");
        assert(solution.includes(lower.toLocaleString("ko-KR")));
        assert(solution.includes(upper.toLocaleString("ko-KR")));
      } else {
        assert(solution.includes(String(q.questionModel.count)), "Mission 5 must show the complete candidate count");
        assert(solution.includes(q.answer));
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Solution overflow ${width}`);
      if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${mission.id}-solution-${width}.png`), fullPage: true });
      if (evidenceDir && variant === 0 && difficulty === 0 && width === 1440) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.pdf({ path: path.join(evidenceDir, `${mission.id}-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
        }
      }
      observations.push({ id: mission.id, width, difficulty, variant, answer: q.answer, problemChars: prompt.length, solutionChars: solution.length });
      await context.close();
    }
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItems: missions.map(x => x.id), states: observations.length, widths: [1440, 375], difficultyOffsets: [-1, 0, 1], allPoolsDesktop: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, overflowChecks: observations.length * 2, a4FilesCreated: evidenceDir ? 4 : 0, observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
