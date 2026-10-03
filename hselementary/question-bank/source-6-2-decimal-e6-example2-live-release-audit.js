"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const id = process.env.HSE_SOURCE_ITEM_ID || "6-2-u2-e6-example-2";
assert(["6-2-u2-e6-example-1", "6-2-u2-e6-example-2"].includes(id));
const sourceItem = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"))
  .items.find(item => item.sourceItemId === id);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert.equal(sourceItem.handwrittenAnswer, sourceItem.independentAnswer);
assert.equal(sourceItem.publisherAnswerKeyVerified, false);
assert(!type.reviewLocked && type.generatorKey === sourceItem.candidateVerification.generator);
const baseUrl = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) fs.mkdirSync(outputDir, { recursive: true });

const oneA4Page = (file, label) => {
  const pages = Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)?.[1]);
  assert.equal(pages, 1, `${label}: A4 한 장 배치`);
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const difficulty of [-1, 0, 1]) for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${baseUrl}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      const fractions = await page.locator("#problemView .math-fraction").evaluateAll(nodes => nodes.map(node => {
        const [numerator, denominator] = [...node.children].map(child => child.getBoundingClientRect());
        const box = node.getBoundingClientRect();
        return { centered: Math.abs(numerator.left + numerator.width / 2 - denominator.left - denominator.width / 2) <= 1,
          inBox: numerator.top >= box.top - 1 && denominator.bottom <= box.bottom + 1 };
      }));
      if (id.endsWith("example-1")) {
        assert.equal(fractions.length, difficulty === -1 ? 0 : 3, `${width}px: 원문 분수 표시 수`);
        assert(fractions.every(item => item.centered && item.inBox), `${width}px: 분자·분모 가운데 정렬과 범위`);
      }
      const problem = await page.evaluate(() => ({
        count: document.querySelectorAll("#problemView .question-item").length,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        answerLeak: !!document.querySelector("#problemView .source61-math-board")
      }));
      assert.equal(problem.count, 3, `${difficulty} ${width}px: 실제 문제 세 개`);
      assert(!problem.overflow && !problem.answerLeak, `${difficulty} ${width}px: 문제 넘침·답 노출 없음`);
      const capture = difficulty === 0 && width !== 320 && outputDir;
      if (capture) await page.screenshot({ path: path.join(outputDir, `${id}-${width}-problem.png`), fullPage: true });
      if (capture && width === 1280) {
        await page.emulateMedia({ media: "print" });
        const file = path.join(outputDir, `${id}-problem-a4.pdf`);
        await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
        oneA4Page(file, "문제지");
        await page.emulateMedia({ media: "screen" });
      }
      await page.locator("#solutionTab").click();
      const solution = await page.evaluate(expectedId => ({
        count: document.querySelectorAll("#solutionView .solution-item").length,
        pages: document.querySelectorAll("#solutionView .print-page").length,
        boards: document.querySelectorAll(`#solutionView [data-answer-source="${expectedId}"]`).length,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        rowOverflow: [...document.querySelectorAll("#solutionView .source61-math-row")]
          .some(row => row.scrollWidth > row.clientWidth + 1)
      }), id);
      assert.equal(solution.count, 3, `${difficulty} ${width}px: 실제 풀이 세 개`);
      assert.equal(solution.pages, 1, `${difficulty} ${width}px: 세 풀이 한 장 배치`);
      assert.equal(solution.boards, 3, `${difficulty} ${width}px: 풀이 그림 1:1`);
      assert(!solution.overflow && !solution.rowOverflow, `${difficulty} ${width}px: 풀이 넘침 없음`);
      assert.deepEqual(errors, [], `${difficulty} ${width}px: 브라우저 오류 없음`);
      if (capture) await page.screenshot({ path: path.join(outputDir, `${id}-${width}-solution.png`), fullPage: true });
      if (capture && width === 1280) {
        await page.emulateMedia({ media: "print" });
        const file = path.join(outputDir, `${id}-solution-a4.pdf`);
        await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
        oneA4Page(file, "풀이집");
      }
      checked += 1;
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`${id} 실제 문제은행: ${checked}개 PC·390px·320px 문제·풀이·수식·A4 통과`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
