"use strict";

const assert = require("node:assert/strict");
const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e3-mission-2";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(type.reviewLocked && type.generatorKey === "", "공개 잠금 유지");
const candidate = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE3Mission2" };
const css = readFileSync(path.join(__dirname, "source-6-2-e3-card-maximum.css"), "utf8");
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const width of [1280, 390, 320]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const items = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant));
      const questions = items.map(item => `<article><div>${item.prompt}</div></article>`).join("");
      const answers = items.map(item => `<article><p>${item.solution}</p>${item.answerVisual}</article>`).join("");
      const html = `<!doctype html><html lang="ko"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:14px;font:16px/1.55 Pretendard,"Malgun Gothic",sans-serif;letter-spacing:0}article{width:100%;max-width:660px;margin:0 auto 16px;padding:12px;border-bottom:1px solid #bbb}p{margin:0 0 8px}#problemView,#solutionView{max-width:100%}@media print{article{break-inside:avoid;page-break-inside:avoid}#solutionView{break-before:page;page-break-before:always}}${css}</style><div id="problemView">${questions}</div><div id="solutionView">${answers}</div></html>`;
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        questions: document.querySelectorAll("#problemView article").length,
        answers: document.querySelectorAll("#solutionView article").length,
        cards: [...document.querySelectorAll(".source62-card-max__cards")].map(row => ({
          box: row.getBoundingClientRect().toJSON(),
          parent: row.closest("article").getBoundingClientRect().toJSON(),
          cells: [...row.children].map(cell => cell.getBoundingClientRect().toJSON())
        })),
        expressions: [...document.querySelectorAll(".source62-card-max__expression")].map(node => ({
          box: node.getBoundingClientRect().toJSON(),
          parent: node.closest("article").getBoundingClientRect().toJSON()
        }))
      }));
      assert(!state.overflow && state.questions === 3 && state.answers === 3, `${width}px: 문제·풀이 세 쌍과 화면 너비`);
      assert.equal(state.cards.length, 3);
      for (const row of state.cards) {
        assert.equal(row.cells.length, 6, "카드 여섯 장 표시");
        assert(row.box.left >= row.parent.left && row.box.right <= row.parent.right + 1, "카드 줄이 문항 안에 있음");
        assert.equal(new Set(row.cells.map(box => Math.round(box.top))).size, 1, "여섯 카드가 한 줄에 정렬됨");
        assert(row.cells.every(box => box.width >= 37 && box.height >= 41), "카드 크기 유지");
      }
      assert.equal(state.expressions.length, 3);
      for (const item of state.expressions) assert(item.box.left >= item.parent.left && item.box.right <= item.parent.right + 1, "풀이 식이 문항 안에 있음");
      checked += state.cards.length + state.expressions.length;
      if (outputDir && difficulty === 0) {
        await page.screenshot({ path: path.join(outputDir, `mission2-${width}.png`), fullPage: true });
        if (width === 1280) writeFileSync(path.join(outputDir, "mission2-candidate.html"), html);
      }
      if (outputDir && width === 1280 && difficulty === 0) await page.pdf({ path: path.join(outputDir, "mission2-candidate-a4.pdf"), format: "A4", printBackground: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 Mission 3-2 잠금 후보 PC·390px·320px 카드·풀이 식 ${checked}개 배치 검사 통과`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
