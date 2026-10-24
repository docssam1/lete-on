"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = new URL(process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918").origin;
const ids = ["5-2-u1-e3-example-1", "5-2-u1-e3-example-2"];
const widths = [1440, 375];
const evidenceDir = process.env.MAC_CHECK_OUTPUT || "";
const errors = [];
let blockedRequests = 0;
if (evidenceDir) fs.mkdirSync(evidenceDir, { recursive: true });

async function prepare(page, id) {
  const response = await page.goto(`${origin}/hselementary/question-bank/`);
  assert.equal(response?.status(), 200, "문제은행 로컬 응답이 성공해야 합니다.");
  await page.locator("#gradeFilter [data-grade='5']").click();
  await page.locator("#termFilter [data-term='2']").click();
  await page.locator("#unitFilter").selectOption("5-2-u1");
  const checkbox = page.locator(`#typeList input[data-type-id='${id}']`);
  assert.equal(await checkbox.isDisabled(), false, `${id}가 검증된 생성기로 활성화되어야 합니다.`);
  await checkbox.check();
  await page.locator("#questionCountInput").fill("1");
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  const observations = [];
  let states = 0;
  for (const id of ids) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: "block" });
    await context.route("**/*", route => route.request().url().startsWith(origin)
      ? route.continue() : (blockedRequests++, route.fulfill({ status: 200, contentType: "text/plain", body: "" })));
    const page = await context.newPage();
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
    page.on("pageerror", error => errors.push(error.message));
    await prepare(page, id);
    await page.evaluate(id => {
      const original = window.HSE_GENERATORS.generate.bind(window.HSE_GENERATORS);
      window.__grade52ExampleGenerate = original;
      window.__grade52ExampleVariant = 0;
      window.HSE_GENERATORS.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
        ? window.__grade52ExampleGenerate(type, rank, difficulty, seed, window.__grade52ExampleVariant)
        : window.__grade52ExampleGenerate(type, rank, difficulty, seed, requested);
    }, id);
    for (const width of widths) for (const difficulty of [-1, 0, 1]) for (const variant of (width === 1440 ? [0, 1, 2] : [0])) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(variant => { window.__grade52ExampleVariant = variant; }, variant);
      await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const root = page.locator(`#problemView [data-source-item-id='${id}']`).first();
      assert.equal(await root.count(), 1, `${id}의 문제 영역이 렌더되어야 합니다.`);
      const question = await page.evaluate(({ id, variant, difficulty }) => window.HSE_SOURCE_52_ROUNDING_EXAMPLES_E3.getQuestion(id, variant, difficulty), { id, variant, difficulty });
      const problemText = await page.locator("#problemView").innerText();
      assert(!problemText.includes(question.answer), `${id}의 답이 문제에 노출되면 안 됩니다.`);
      assert.equal(await page.locator(`#problemView [data-source-answer='${id}']`).count(), 0, `${id}의 풀이 DOM이 문제 영역에 없어야 합니다.`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} 문제 가로 넘침 ${width}/${variant}/${difficulty}`);
      if (id === ids[0]) {
        assert(problemText.includes(question.questionModel.value.toLocaleString("en-US")));
        assert(problemText.includes(question.questionModel.target.toLocaleString("en-US")));
      } else {
        const model = question.questionModel;
        const visibleValues = [
          `${Math.floor(model.redCm / 100)}.${String(model.redCm % 100).padStart(2, "0")}m`,
          `${Math.floor(model.yellowCm / 100)}.${String(model.yellowCm % 100).padStart(2, "0")}m`,
          `${model.redUnitCm}cm`, `${model.yellowUnitCm}cm`,
          `${model.redPrice.toLocaleString("en-US")}원`, `${model.yellowPrice.toLocaleString("en-US")}원`
        ];
        for (const value of visibleValues) assert(problemText.includes(value), `문제에 합성 값 ${value}가 보여야 합니다.`);
      }
      if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example31" : "example32"}-problem-${width}.png`), fullPage: true });
      await page.locator("#solutionTab").click();
      const solutionText = await page.locator("#solutionView").innerText();
      assert(solutionText.includes(question.answer), `${id}의 풀이에서 답을 확인할 수 있어야 합니다.`);
      if (id === ids[0]) assert.match(solutionText, /백의 자리 버림.*천의 자리 버림.*천의 자리 반올림/);
      else assert.match(solutionText, /cm/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${id} 풀이 가로 넘침 ${width}/${variant}/${difficulty}`);
      observations.push({ sourceItemId: id, width, difficulty, variant, promptLength: problemText.length, solutionLength: solutionText.length });
      if (evidenceDir && variant === 0 && difficulty === 0) await page.screenshot({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example31" : "example32"}-solution-${width}.png`), fullPage: true });
      if (evidenceDir && width === 1440 && difficulty === 0 && variant === 0) {
        for (const mode of ["problem", "solution"]) {
          await page.emulateMedia({ media: "screen" });
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.emulateMedia({ media: "print" });
          const typography = await page.evaluate(async () => {
            await document.fonts.load('12pt "FC Serif"', "한글 ABC");
            const prompt = document.querySelector(".question-prompt");
            return { body: getComputedStyle(document.body).fontFamily, prompt: prompt ? getComputedStyle(prompt).fontFamily : "", weight: prompt ? getComputedStyle(prompt).fontWeight : "", loaded: document.fonts.check('12pt "FC Serif"', "한글 ABC") };
          });
          assert(typography.body.includes("FC Serif") && typography.prompt.includes("FC Serif"), `${id}/${mode}: 인쇄 명조가 적용되어야 합니다.`);
          assert.equal(typography.weight, "400", `${id}/${mode}: 본문 굵기는 400이어야 합니다.`);
          assert.equal(typography.loaded, true, `${id}/${mode}: 자체 탑재 글꼴이 로드되어야 합니다.`);
          await page.pdf({ path: path.join(evidenceDir, `${id.endsWith("example-1") ? "example31" : "example32"}-${mode}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
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
  console.log(JSON.stringify({ status: "passed", sourceItemIds: ids, states, widths, variants: [0, 1, 2], difficultyOffsets: [-1, 0, 1], overflowChecks: states * 2, blockedExternalRequests: blockedRequests, noAnswerLeak: true, selfHostedPrintFont: "FC Serif 400", a4PdfCount: evidenceDir ? 4 : 0, observations }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
