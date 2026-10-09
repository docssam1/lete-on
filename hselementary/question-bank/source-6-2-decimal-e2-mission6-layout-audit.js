"use strict";

const assert = require("node:assert/strict");
const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-6-2-e2-geometry.js");

const id = "6-2-u2-e2-mission-6";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(!type.reviewLocked, "원문 검수 문항 공개 연결");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE2Mission6" };
const css = readFileSync(path.join(__dirname, "source-6-2-four-rect.css"), "utf8") + readFileSync(path.join(__dirname, "source-6-2-e2-geometry.css"), "utf8");
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let inspected = 0;
  try {
    for (const width of [1280, 390]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const items = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidateType, 0, difficulty, 1, variant));
      const problem = items.map(item => `<article><p>${item.prompt.split("<svg")[0]}</p>${item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0]}</article>`).join("");
      const solution = items.map(item => `<article><p>${item.solution}</p>${item.answerVisual}</article>`).join("");
      const html = `<!doctype html><html lang="ko"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:14px;font:16px/1.55 "Malgun Gothic",sans-serif}article{width:100%;max-width:660px;margin:0 auto 16px;padding:12px;border-bottom:1px solid #bbb}p{margin:0 0 8px}#problemView,#solutionView{max-width:100%}@media print{article{break-inside:avoid;page-break-inside:avoid}#solutionView{break-before:page;page-break-before:always}#solutionView svg.source62-four-rect{width:min(370px,100%)}}${css}</style><div id="problemView">${problem}</div><div id="solutionView">${solution}</div></html>`;
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      const diagrams = await page.locator("svg.source62-four-rect").evaluateAll(nodes => nodes.map(svg => {
        const box = svg.getBoundingClientRect();
        const texts = [...svg.querySelectorAll("text")].map(node => ({ text: node.textContent, box: node.getBoundingClientRect().toJSON() }));
        const rect = svg.querySelector("rect").getBoundingClientRect();
        const splitX = Number(svg.querySelector('[data-layout-role="column-divider"]').getAttribute("x1"));
        const splitY = Number(svg.querySelector('[data-layout-role="row-divider"]').getAttribute("y1"));
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = splitX;
        svgPoint.y = splitY;
        const divider = svgPoint.matrixTransform(svg.getScreenCTM());
        return { box: box.toJSON(), rect: rect.toJSON(), divider: { x: divider.x, y: divider.y }, texts, dividerCount: svg.querySelectorAll("line.source62-four-rect-divider").length, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }));
      assert.equal(diagrams.length, 6, `${width}px 난이도 ${difficulty}: 문제·풀이 그림 세 쌍`);
      for (const diagram of diagrams) {
        assert(!diagram.overflow && diagram.box.left >= 0 && diagram.box.right <= width + 1, "그림 화면 밖 잘림 없음");
        assert.equal(diagram.dividerCount, 2, "세로·가로 경계선");
        assert.equal(diagram.texts.length, 4, "각 영역에 넓이 하나");
        for (const [index, text] of diagram.texts.entries()) {
          const b = text.box;
          assert(b.left > diagram.rect.left + 2 && b.right < diagram.rect.right - 2 && b.top > diagram.rect.top + 2 && b.bottom < diagram.rect.bottom - 2, `넓이 ${text.text} 바깥 테두리 충돌 없음`);
          const leftColumn = index === 0 || index === 2;
          const topRow = index < 2;
          assert(leftColumn ? b.right < diagram.divider.x - 3 : b.left > diagram.divider.x + 3, `넓이 ${text.text} 세로 경계선 충돌 없음`);
          assert(topRow ? b.bottom < diagram.divider.y - 3 : b.top > diagram.divider.y + 3, `넓이 ${text.text} 가로 경계선 충돌 없음`);
        }
        for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) {
          const a = diagram.texts[i].box;
          const b = diagram.texts[j].box;
          assert(a.right + 2 < b.left || b.right + 2 < a.left || a.bottom + 2 < b.top || b.bottom + 2 < a.top, "넓이 글자 겹침 없음");
        }
      }
      inspected += diagrams.length;
      if (outputDir && difficulty === 0) {
        await page.screenshot({ path: path.join(outputDir, `mission6-${width}.png`), fullPage: true });
        if (width === 1280) writeFileSync(path.join(outputDir, "mission6-candidate.html"), html);
      }
      if (outputDir && width === 1280 && difficulty === 0) await page.pdf({ path: path.join(outputDir, "mission6-candidate-a4.pdf"), format: "A4", printBackground: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 Mission 6 PC·모바일 그림 ${inspected}개 배치 검수 통과 (별도 조판 화면, 실제 페이지 검수는 live audit)`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
