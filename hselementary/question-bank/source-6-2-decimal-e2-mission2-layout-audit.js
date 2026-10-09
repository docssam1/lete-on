"use strict";

const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const url = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const id = "6-2-u2-e2-mission-2";

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const width of [1280, 390]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.goto(`${url}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      try {
        await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
      } catch (error) {
        throw new Error(`${width}px 난이도 ${difficulty}: 화면을 열지 못함. ${pageErrors.join("; ") || error.message}`);
      }
      await page.evaluate(() => document.fonts.ready);
      const items = await page.locator("#problemView .question-item .source62-tape-count").evaluateAll(svgs => svgs.map(svg => {
        const [length, firstOverlap, secondOverlap] = svg.dataset.tapeModel.split(",").map(Number);
        const rects = [...svg.querySelectorAll("rect")].map(rect => ({ x: Number(rect.getAttribute("x")), width: Number(rect.getAttribute("width")), y: Number(rect.getAttribute("y")), height: Number(rect.getAttribute("height")) }));
        const text = [...svg.querySelectorAll("text")].map(node => {
          const bounds = node.getBBox();
          const pixels = node.getBoundingClientRect();
          return { value: node.textContent, x: bounds.x, y: bounds.y, right: bounds.x + bounds.width, bottom: bounds.y + bounds.height, pixelHeight: pixels.height };
        });
        const bounds = svg.getBoundingClientRect();
        return { length, firstOverlap, secondOverlap, rects, text, svgWidth: bounds.width, svgLeft: bounds.left, svgRight: bounds.right, viewport: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }));
      assert.equal(items.length, 3, `${width}px 난이도 ${difficulty}: 세 문제 그림`);
      for (const item of items) {
        assert.equal(item.rects.length, 5, "예시 테이프 3장과 겹침 표시 2곳");
        assert(item.svgLeft >= 0 && item.svgRight <= width + 1 && !item.overflow, "그림이 화면 밖으로 나가지 않음");
        const [first, second, third, overlapOne, overlapTwo] = item.rects;
        assert(Math.abs(overlapOne.width / first.width - item.firstOverlap / item.length) < 0.001, "첫 겹침 폭 비율");
        assert(Math.abs(overlapTwo.width / second.width - item.secondOverlap / item.length) < 0.001, "둘째 겹침 폭 비율");
        assert(Math.abs(second.x - (first.x + first.width - overlapOne.width)) < 0.08, "첫 겹침 위치");
        assert(Math.abs(third.x - (second.x + second.width - overlapTwo.width)) < 0.08, "둘째 겹침 위치");
        assert(item.text.every(label => label.x >= 0 && label.right <= 420 && label.y >= 0 && label.bottom <= 124 && label.pixelHeight >= 10), "숫자와 계속 표시가 그림 안에서 읽혀야 함");
        for (let left = 0; left < item.text.length; left += 1) for (let right = left + 1; right < item.text.length; right += 1) {
          const a = item.text[left];
          const b = item.text[right];
          const overlap = a.x < b.right + 1 && a.right + 1 > b.x && a.y < b.bottom + 1 && a.bottom + 1 > b.y;
          assert(!overlap, `그림 글자 겹침: ${a.value}, ${b.value}`);
        }
        const overlapLabels = item.text.filter(label => label.value.endsWith("cm") && [item.firstOverlap / 10, item.secondOverlap / 10].includes(Number.parseFloat(label.value)));
        assert(overlapLabels.length >= 2, "두 겹침 길이 글자");
        checked += 1;
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 테이프 그림 좌표·비율·가시성 검사 통과: ${checked}개 SVG (PC·모바일 × 3단계 × 3문항)`);
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
