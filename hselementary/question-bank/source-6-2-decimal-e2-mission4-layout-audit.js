"use strict";

const assert = require("node:assert/strict");
const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const id = "6-2-u2-e2-mission-4";
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === id);
assert(type?.reviewLocked, "공개 잠금 유지");
const candidateType = { ...type, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE2Mission4" };
const css = readFileSync(path.join(__dirname, "source-6-2-overlap-height.css"), "utf8");
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

async function inspect(page, width, difficulty, view) {
  const diagrams = await page.locator(`#${view} svg.source62-overlap-height`).evaluateAll(nodes => nodes.map(svg => {
    const box = svg.getBoundingClientRect();
    const labels = [...svg.querySelectorAll("text")].map(node => ({ text: node.textContent, box: node.getBoundingClientRect().toJSON() }));
    return { box: box.toJSON(), labels, target: svg.dataset.targetSegment, rightAngle: Boolean(svg.querySelector(".source62-overlap-right-angle")), shaded: Boolean(svg.querySelector(".source62-overlap-region")), crossPoint: Boolean(svg.querySelector(".source62-overlap-cross-point")), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  }));
  assert.equal(diagrams.length, 3, `${width}px 난이도 ${difficulty}: 세 그림`);
  for (const diagram of diagrams) {
    assert(diagram.box.left >= 0 && diagram.box.right <= width + 1 && !diagram.overflow, "그림이 화면 안에 있어야 함");
    assert(diagram.target === "ㅅ-ㅇ" && diagram.rightAngle && diagram.shaded && diagram.crossPoint, "높이·직각·교차점·겹친 부분 표시");
    assert.equal(diagram.labels.filter(label => ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"].includes(label.text)).length, 8, "여덟 점 이름");
    for (let i = 0; i < diagram.labels.length; i += 1) {
      const a = diagram.labels[i];
      assert(a.box.left >= diagram.box.left - 1 && a.box.right <= diagram.box.right + 1 && a.box.top >= diagram.box.top - 1 && a.box.bottom <= diagram.box.bottom + 1 && a.box.height >= 10, `그림 글자 ${a.text} 잘림 없음`);
      for (let j = i + 1; j < diagram.labels.length; j += 1) {
        const b = diagram.labels[j];
        const overlap = a.box.left < b.box.right + 1 && a.box.right + 1 > b.box.left && a.box.top < b.box.bottom + 1 && a.box.bottom + 1 > b.box.top;
        assert(!overlap, `그림 글자 겹침: ${a.text}, ${b.text}`);
      }
    }
  }
  return diagrams.length;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const width of [1280, 390]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const generated = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidateType, 0, difficulty, 1, variant));
      const problem = generated.map(item => `<article><p>${item.prompt.split("<svg")[0]}</p>${item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0]}</article>`).join("");
      const solution = generated.map(item => `<article><p>${item.solution}</p>${item.answerVisual}</article>`).join("");
      const html = `<!doctype html><html lang="ko"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;padding:14px;font:16px/1.55 "Malgun Gothic",sans-serif}article{width:100%;max-width:660px;margin:0 auto 16px;padding:12px;border-bottom:1px solid #bbb}p{margin:0 0 8px}#problemView,#solutionView{max-width:100%}@media print{article{break-inside:avoid;page-break-inside:avoid}#solutionView{break-before:page;page-break-before:always}}${css}</style><div id="problemView">${problem}</div><div id="solutionView">${solution}</div></html>`;
      await page.setContent(html);
      await page.evaluate(() => document.fonts.ready);
      checked += await inspect(page, width, difficulty, "problemView");
      checked += await inspect(page, width, difficulty, "solutionView");
      if (outputDir && difficulty === 0) {
        await page.screenshot({ path: path.join(outputDir, `mission4-${width}.png`), fullPage: true });
        if (width === 1280) writeFileSync(path.join(outputDir, "mission4-candidate.html"), html);
      }
      if (outputDir && width === 1280 && difficulty === 0) await page.pdf({ path: path.join(outputDir, "mission4-candidate-a4.pdf"), format: "A4", printBackground: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 Mission 4 잠금 후보 PC·모바일 그림 ${checked}개 배치 검수 통과 (공개 화면 아님)`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
