"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = new URL(process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918").origin;
const ids = ["5-2-u1-e4-exploration-rounded-range", "5-2-u1-e4-example-1"];
const widths = [1440, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
const requireSelfHostedPrintFont = process.env.HSE_REQUIRE_PRINT_FONT !== "0";
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });
const errors = [];
let blockedRequests = 0;

async function prepare(page, width, id) {
  await page.setViewportSize({ width, height: 1000 });
  await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
  const response = await page.goto(`${origin}/hselementary/question-bank/`);
  assert.equal(response?.status(), 200, `Question bank HTTP status at ${origin}`);
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.waitForFunction(() => [...document.querySelectorAll("#termFilter [data-term]")].some(node => node.dataset.term === "2"));
  await page.locator("#termFilter [data-term='2']").click();
  await page.waitForFunction(() => [...document.querySelector("#unitFilter").options].some(option => option.value === "5-2-u1"));
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
  for (const id of ids) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", route => new URL(route.request().url()).origin === origin
      ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await prepare(page, 1440, id);
    await page.evaluate(id => {
      const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
      window.__grade52AuditGenerate = original;
      window.__grade52AuditVariant = 0;
      window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
        ? window.__grade52AuditGenerate(type, rank, difficulty, seed, window.__grade52AuditVariant)
        : window.__grade52AuditGenerate(type, rank, difficulty, seed, requested);
    }, id);
    for (const width of widths) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1440 ? [0, 1, 2] : [0])) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(variant => { window.__grade52AuditVariant = variant; }, variant);
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
    if (variant === 0 && difficulty === 0 && width === 1440 && evidenceDir) {
      for (const mode of ["problem", "solution"]) {
        await page.emulateMedia({ media: "screen" });
        await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
        await page.emulateMedia({ media: "print" });
        const printTypography = await page.evaluate(async () => {
          await document.fonts.load('12pt "FC Serif"', "한글 ABC");
          const fontFamily = getComputedStyle(document.body).fontFamily;
          const prompt = document.querySelector(".question-prompt");
          return {
            fontFamily,
            promptFontFamily: prompt ? getComputedStyle(prompt).fontFamily : "",
            promptFontWeight: prompt ? getComputedStyle(prompt).fontWeight : "",
            fontLoaded: document.fonts.check('12pt "FC Serif"', "한글 ABC")
          };
        });
        if (requireSelfHostedPrintFont) {
          assert(printTypography.fontFamily.includes("FC Serif"), `Print body must use FC Serif for ${id}/${mode}`);
          assert(printTypography.promptFontFamily.includes("FC Serif"), `Print prompt must use FC Serif for ${id}/${mode}`);
          assert.equal(printTypography.promptFontWeight, "400", `Print prompt must use 400 weight for ${id}/${mode}`);
          assert.equal(printTypography.fontLoaded, true, `Self-hosted FC Serif must load for ${id}/${mode}`);
        }
        await page.pdf({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example41" : "exploration4"}-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
    }
    states++;
    await page.emulateMedia({ media: "screen" });
    await page.locator("#backButton").click();
    await page.waitForFunction(() => document.querySelector("#worksheet").hidden);
    }
    await context.close();
  }
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", sourceItemIds: ids, states, widths, difficultyOffsets: [-1, 0, 1], allSyntheticVariantsAtDesktop: true, selectedSyntheticVariantAtBothWidths: true, blockedExternalRequests: blockedRequests, noAnswerLeak: true, overflowChecks: states * 2, a4FilesCreated: evidenceDir ? 4 : 0, printFont: requireSelfHostedPrintFont ? "self-hosted FC Serif" : "current deployed stylesheet inspected without enforcing the pending print-font patch", observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
