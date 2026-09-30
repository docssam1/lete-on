"use strict";

const assert = require("node:assert/strict");
const { mkdirSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.locator('#gradeFilter button[data-grade="6"]').click();
      await page.locator('#termFilter button[data-term="2"]').click();
      await page.locator("#unitFilter").selectOption("6-2-u2");
      assert(!(await page.locator("#catalogPanel").innerText()).includes("공개 유형만 표시"), "잠금 유형을 함께 보여 주는 화면에 잘못된 안내가 없음");
      const expected = [
        ["6-2-u2-e3-exploration-1", "두 소수의 몫을 소수 둘째 자리까지 반올림하기"],
        ["6-2-u2-e3-exploration-2", "나누는 수가 소수 둘째 자리인 몫 반올림하기"],
        ["6-2-u2-e3-exploration-3", "1보다 작은 몫을 소수 둘째 자리까지 반올림하기"]
      ];
      for (const [id, label] of expected) {
        await page.locator("#typeSearchInput").fill(label);
        const row = page.locator(`[data-preview-type-id="${id}"]`);
        assert.equal(await row.count(), 1, `${width}px ${id}: 원문 세부 유형이 있음`);
        assert((await row.innerText()).includes(label), `${width}px ${id}: 정확한 이름`);
        assert(await row.locator('input[type="checkbox"]').isDisabled(), `${width}px ${id}: 출제 잠금`);
      }
      await page.locator("#typeSearchInput").fill("가장 큰 몫");
      const risk = page.locator('[data-preview-type-id="6-2-u2-e3-example-3"]');
      assert.equal(await risk.count(), 1, "양수 조건이 빠진 예제가 분류표에 있음");
      assert(await risk.locator('input[type="checkbox"]').isDisabled(), "조건 누락 예제는 선택 불가");
      await risk.scrollIntoViewIfNeeded();
      await risk.click();
      const preview = page.locator("#typePreviewPopover");
      await preview.waitFor({ state: "visible" });
      const message = await preview.innerText();
      assert(message.includes("양수 조건") && message.includes("검수 대기"), "미리보기에 정확한 잠금 이유");
      const state = await page.evaluate(() => {
        const box = document.querySelector("#typePreviewPopover").getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, box: box.toJSON(), viewport: innerWidth };
      });
      assert(!state.overflow, `${width}px: 가로 스크롤 없음`);
      assert(state.box.left >= -1 && state.box.right <= width + 1, `${width}px: 미리보기가 화면 밖으로 나가지 않음`);
      assert.deepEqual(errors, [], "브라우저 스크립트 오류 없음");
      if (outputDir) await page.screenshot({ path: path.join(outputDir, `grade6-e3-${width}.png`) });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log("6-2 개념탐구 3 공개 분류표 PC·390px: 세 원문 유형과 조건 누락 잠금 미리보기 통과");
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
