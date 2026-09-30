"use strict";

const assert = require("node:assert/strict");
const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const id = "6-2-u2-e3-example-2";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(type.reviewLocked, "공개 잠금 유지");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE3Example2" };
const css = readFileSync(path.join(__dirname, "source-6-2-e3-digit-count.css"), "utf8");
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const width of [1280, 390]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const items = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidateType, 0, difficulty, 1, variant));
      const questions = items.map(item => `<article><p>${item.prompt}</p></article>`).join("");
      const answers = items.map(item => `<article><p>${item.solution}</p>${item.answerVisual}</article>`).join("");
      const html = `<!doctype html><html lang="ko"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:14px;font:16px/1.55 "Malgun Gothic",sans-serif}article{width:100%;max-width:660px;margin:0 auto 16px;padding:12px;border-bottom:1px solid #bbb}p{margin:0 0 8px}#problemView,#solutionView{max-width:100%}@media print{article{break-inside:avoid;page-break-inside:avoid}#solutionView{break-before:page;page-break-before:always}}${css}</style><div id="problemView">${questions}</div><div id="solutionView">${answers}</div></html>`;
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const questions = [...document.querySelectorAll("#problemView article")];
        const answers = [...document.querySelectorAll("#solutionView article")];
        const expressions = [...document.querySelectorAll(".source62-e3-digit-expression")];
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          questions: questions.length,
          answers: answers.length,
          expressionBoxes: expressions.map(node => ({ box: node.getBoundingClientRect().toJSON(), parent: node.closest("article").getBoundingClientRect().toJSON(), blank: Boolean(node.querySelector(".source62-e3-digit-blank")) })),
          grids: [...document.querySelectorAll(".source62-e3-digit-grid")].map(grid => ({ box: grid.getBoundingClientRect().toJSON(), cells: [...grid.children].map(cell => cell.getBoundingClientRect().toJSON()) }))
        };
      });
      assert(!state.overflow && state.questions === 3 && state.answers === 3, `${width}px: 문제·풀이 세 쌍과 화면 너비`);
      assert.equal(state.expressionBoxes.length, 6);
      for (const item of state.expressionBoxes) {
        assert(item.blank && item.box.left >= item.parent.left && item.box.right <= item.parent.right + 1, "빈칸 수식이 문항 안에 표시됨");
        assert(item.box.width < width - 20, "수식 자체가 모바일 너비 이내");
      }
      assert.equal(state.grids.length, 3);
      for (const grid of state.grids) {
        assert.equal(grid.cells.length, 10, "0부터 9까지 전수 표시");
        assert(grid.box.left >= 0 && grid.box.right <= width + 1, "숫자판 화면 잘림 없음");
        const rows = new Set(grid.cells.map(box => Math.round(box.top)));
        assert.equal(rows.size, 2, "다섯 칸씩 두 줄");
        assert(grid.cells.every(box => box.width > 30 && box.height >= 30), "칸 크기 유지");
      }
      checked += state.expressionBoxes.length + state.grids.length;
      if (outputDir && difficulty === 0) {
        await page.screenshot({ path: path.join(outputDir, `example2-${width}.png`), fullPage: true });
        if (width === 1280) writeFileSync(path.join(outputDir, "example2-candidate.html"), html);
      }
      if (outputDir && width === 1280 && difficulty === 0) await page.pdf({ path: path.join(outputDir, "example2-candidate-a4.pdf"), format: "A4", printBackground: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 예제 3-2 잠금 후보 PC·모바일 수식·숫자판 ${checked}개 배치 검사 통과`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
