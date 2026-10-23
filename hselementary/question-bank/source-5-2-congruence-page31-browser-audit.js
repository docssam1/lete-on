"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8919";
const output = process.env.MAC_CHECK_OUTPUT;
assert(output && path.isAbsolute(output), "Set MAC_CHECK_OUTPUT to a private absolute evidence directory");
fs.mkdirSync(output, { recursive: true });
const ids = ["5-2-u3-e4-mission-1", "5-2-u3-e4-mission-2", "5-2-u3-e4-mission-3"];
const result = { status: "running", states: [], pdfs: [], screenshots: [], externalBlocked: 0, pageErrors: [] };

let browser;
(async () => {
  browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  for (const id of ids) for (const width of [1440, 375]) for (const difficulty of [-1, 0, 1]) for (const variant of [0, 1, 2]) {
    const context = await browser.newContext({ viewport: { width, height: 1050 }, serviceWorkers: "block" });
    await context.route("**/*", async route => {
      if (new URL(route.request().url()).origin !== origin) {
        result.externalBlocked++;
        return route.fulfill({ status: 200, contentType: "text/plain", body: "" });
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on("pageerror", error => result.pageErrors.push(error.message));
    await page.addInitScript(() => { localStorage.clear(); sessionStorage.clear(); window.print = () => {}; });
    try {
      await page.goto(`${origin}/hselementary/question-bank/?type=${id}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => window.HSE_GENERATORS && window.HSE_SOURCE_52_CONGRUENCE_PAGE31);
      await page.locator("#worksheet").waitFor({ state: "hidden" });
      await page.locator("#questionCountInput").fill("1");
      await page.evaluate(({ id, variant }) => {
        const api = window.HSE_GENERATORS;
        const type = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).find(x => x.id === id);
        if (!type || type.reviewLocked || api.generatorKey(type) !== type.generatorKey) throw new Error(`${id} is not publicly enabled by the real curriculum gate`);
        const original = api.generate.bind(api);
        api.generate = (type, rank, difficulty, seed, requested) => type?.sourceItemId === id
          ? window.HSE_SOURCE_52_CONGRUENCE_PAGE31.getQuestion(id, variant, difficulty ?? 0)
          : original(type, rank, difficulty, seed, requested);
      }, { id, variant });
      await page.locator(`#difficultyFilter [data-difficulty='${difficulty}']`).click();
      await page.locator("#generateButton").click();
      await page.waitForFunction(() => !document.querySelector("#worksheet").hidden);
      const q = await page.evaluate(({ id, variant, difficulty }) => {
        const generated = window.HSE_SOURCE_52_CONGRUENCE_PAGE31.getQuestion(id, variant, difficulty);
        const problem = document.querySelector("#problemView");
        const solution = document.querySelector("#solutionView");
        return {
          answer: generated.answer,
          prompt: problem.innerText,
          solution: solution.innerText,
          diagramCount: problem.querySelectorAll("svg[data-source52-figure]").length,
          answerVisualInProblem: Boolean(problem.querySelector(".source52-p31-answer-visual,[data-source-answer]")),
          solutionTextInProblem: problem.innerText.includes("SAS 합동") || problem.innerText.includes("회전은 각의 크기를 보존") || problem.innerText.includes("원주각은 바라보는 호의 절반"),
          solutionAnswerVisible: solution.innerText.includes(generated.answer),
          solutionProofDiagramCount: solution.querySelectorAll('svg[data-source52-figure="square-angle-proof"]').length,
          solutionAdvancedTrig: /tan\(|탄젠트/.test(solution.innerText),
          sourceMarkerCount: problem.querySelectorAll(`[data-source-item-id='${id}']`).length,
          diagramTextClipped: (() => {
            const svg = problem.querySelector("svg[data-source52-figure]");
            if (!svg) return true;
            const box = svg.getBoundingClientRect();
            return [...svg.querySelectorAll("text")].some(text => {
              const rect = text.getBoundingClientRect();
              return rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1;
            });
          })(),
          proofDiagramTextClipped: (() => {
            const svg = solution.querySelector('svg[data-source52-figure="square-angle-proof"]');
            if (id.endsWith("mission-1") && !svg) return true;
            if (!svg) return false;
            const box = svg.getBoundingClientRect();
            return [...svg.querySelectorAll("text")].some(text => {
              const rect = text.getBoundingClientRect();
              return rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1;
            });
          })(),
          width: innerWidth,
          overflow: document.documentElement.scrollWidth > innerWidth + 1
        };
      }, { id, variant, difficulty });
      assert.equal(q.sourceMarkerCount, 1, `${id} prompt count`);
      assert.equal(q.diagramCount, 1, `${id} prompt diagram`);
      assert.equal(q.solutionProofDiagramCount, id.endsWith("mission-1") ? 1 : 0, `${id} proof diagram`);
      assert.equal(q.solutionAdvancedTrig, false, `${id} elementary solution language`);
      assert.equal(q.proofDiagramTextClipped, false, `${id} proof diagram label clipped at ${width}px / difficulty ${difficulty} / pool ${variant}`);
      assert.equal(q.answerVisualInProblem, false, `${id} answer leak`);
      assert.equal(q.solutionTextInProblem, false, `${id} solution leak`);
      assert.equal(q.diagramTextClipped, false, `${id} diagram label clipped at ${width}px / difficulty ${difficulty} / pool ${variant}`);
      assert.equal(q.solutionAnswerVisible, true, `${id} solution missing answer`);
      assert.equal(q.overflow, false, `${id} overflow at ${width}px`);

      const key = `${id}-v${variant}-d${difficulty + 1}-w${width}`;
      if (variant === 0 && difficulty === 0) {
        const problemShot = path.join(output, `${id}-problem-${width}.png`);
        await page.locator("#problemView").screenshot({ path: problemShot });
        assert(fs.statSync(problemShot).size > 2000);
        result.screenshots.push(path.basename(problemShot));
        await page.locator("#solutionTab").click();
        const solutionShot = path.join(output, `${id}-solution-${width}.png`);
        await page.locator("#solutionView").screenshot({ path: solutionShot });
        assert(fs.statSync(solutionShot).size > 2000);
        result.screenshots.push(path.basename(solutionShot));
        await page.locator("#problemTab").click();
      }
      if (width === 1440 && variant === 0 && difficulty === 0) {
        for (const mode of ["problem", "solution"]) {
          await page.locator(mode === "problem" ? "#problemTab" : "#solutionTab").click();
          await page.locator("#printMenuButton").click();
          await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
          await page.waitForFunction(expected => document.body.dataset.printMode === expected, mode);
          await page.emulateMedia({ media: "print" });
          await page.setViewportSize({ width: Math.ceil(210 * 96 / 25.4), height: Math.ceil(297 * 96 / 25.4) });
          const pdf = path.join(output, `${id}-${mode}.pdf`);
          await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
          const bytes = fs.readFileSync(pdf);
          const source = bytes.toString("latin1");
          const pages = (source.match(/\/Type\s*\/Page\b/g) || []).length;
          const boxes = [...source.matchAll(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
          assert.equal(pages, 1, `${id} ${mode} page count`);
          assert(boxes.length && boxes.every(b => Math.abs(Number(b[3]) - Number(b[1]) - 595.28) < 2 && Math.abs(Number(b[4]) - Number(b[2]) - 841.89) < 2), `${id} ${mode} A4 size`);
          result.pdfs.push({ file: path.basename(pdf), pages, bytes: bytes.length });
          await page.emulateMedia({ media: "screen" });
        }
      }
      result.states.push({ id, width, difficulty, variant, answer: q.answer, diagramCount: q.diagramCount, overflow: q.overflow });
    } finally {
      await context.close();
    }
  }
  await browser.close();
  assert.deepEqual(result.pageErrors, []);
  result.status = "passed";
  fs.writeFileSync(path.join(output, "browser-audit.json"), JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ status: result.status, states: result.states.length, widths: [1440, 375], pools: 3, difficulties: 3, PDFs: result.pdfs, screenshots: result.screenshots.length, blockedExternalRequests: result.externalBlocked, pageErrors: result.pageErrors.length }, null, 2));
})().catch(async error => { console.error(error); await browser?.close().catch(() => {}); process.exitCode = 1; });
