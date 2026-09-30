"use strict";

const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const url = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const id = "6-2-u2-e2-mission-3";

async function inspect(page, view, width, difficulty) {
  const selector = `#${view} .source62-overlap-triangle-bases`;
  const diagrams = await page.locator(selector).evaluateAll(svgs => svgs.map(svg => {
    const rect = svg.getBoundingClientRect();
    const model = svg.dataset.model.split(",").map(Number);
    const texts = [...svg.querySelectorAll("text")].map(node => ({
      value: node.textContent,
      owner: node.dataset.labelFor || null,
      rect: node.getBoundingClientRect().toJSON(),
      height: node.getBoundingClientRect().height
    }));
    const points = {};
    for (const line of svg.querySelectorAll("line[data-from][data-to]")) {
      points[line.dataset.from] = { x: Number(line.getAttribute("x1")), y: Number(line.getAttribute("y1")) };
      points[line.dataset.to] = { x: Number(line.getAttribute("x2")), y: Number(line.getAttribute("y2")) };
    }
    return { rect: rect.toJSON(), model, texts, points, rightAngles: Boolean(svg.querySelector(".source62-triangle-right-angle")), target: svg.dataset.targetSegment, hasSolvedTarget: Boolean(svg.querySelector(".source62-triangle-target")), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  }));
  assert.equal(diagrams.length, 3, `${width}px ${difficulty} ${view}: 고정 문항 3개의 그림`);
  for (const diagram of diagrams) {
    assert(diagram.rect.left >= 0 && diagram.rect.right <= width + 1 && !diagram.overflow, `${width}px: 그림·화면 넘침 없음`);
    assert.deepEqual(diagram.points["ㄱ"].y, diagram.points["ㄹ"].y, "두 꼭짓점의 같은 높이");
    assert.deepEqual([diagram.points["ㄴ"].y, diagram.points["ㅁ"].y], [diagram.points["ㄷ"].y, diagram.points["ㄷ"].y], "밑변 세 점이 한 직선");
    assert(diagram.points["ㄴ"].x < diagram.points["ㅁ"].x && diagram.points["ㅁ"].x < diagram.points["ㄷ"].x, "ㄴ-ㅁ-ㄷ 순서");
    assert(Math.abs(diagram.points["ㅁ"].x - (100 + 280 * (diagram.model[1] - diagram.model[2]) / diagram.model[1])) < 0.01, "밑변 비에서 계산한 ㅁ 좌표");
    assert(diagram.rightAngles && diagram.target === "ㄴ-ㅁ" && diagram.hasSolvedTarget === (view === "solutionView"), "직각·목표 선분·정답 그림 구분");
    assert.equal(diagram.texts.filter(label => label.owner).length, 5, "원본 다섯 점 이름");
    for (let index = 0; index < diagram.texts.length; index += 1) {
      const a = diagram.texts[index];
      assert(a.rect.left >= diagram.rect.left - 1 && a.rect.right <= diagram.rect.right + 1 && a.rect.top >= diagram.rect.top - 1 && a.rect.bottom <= diagram.rect.bottom + 1 && a.height >= 10, `글자 ${a.value}가 읽히고 그림 안에 있음`);
      for (let other = index + 1; other < diagram.texts.length; other += 1) {
        const b = diagram.texts[other];
        const overlap = a.rect.left < b.rect.right + 1 && a.rect.right + 1 > b.rect.left && a.rect.top < b.rect.bottom + 1 && a.rect.bottom + 1 > b.rect.top;
        assert(!overlap, `그림 글자 겹침: ${a.value}, ${b.value}`);
      }
    }
  }
  return diagrams.length;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let count = 0;
  try {
    for (const width of [1280, 390]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${url}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      count += await inspect(page, "problemView", width, difficulty);
      await page.locator("#solutionTab").click();
      count += await inspect(page, "solutionView", width, difficulty);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 겹친 삼각형 그림 검수 통과: PC·모바일 × 3난이도 × 문제·풀이 그림 ${count}개`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
