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
    for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await page.locator('#gradeFilter button[data-grade="6"]').click();
      await page.locator('#termFilter button[data-term="2"]').click();
      await page.locator('#unitFilter option[value="6-2-u2"]').waitFor({ state: "attached" });
      await page.locator("#unitFilter").selectOption("6-2-u2");
      for (const [id, label] of [
        ["6-2-u2-e5-exploration-1", "거리와 연료의 단위량으로 시간 구하기"],
        ["6-2-u2-e5-example-1", "일정한 속도로 타는 양초 시간 구하기"],
        ["6-2-u2-e5-example-2", "달릴 거리에 필요한 연료값 구하기"],
        ["6-2-u2-e5-example-3", "두 수도꼭지로 물 받는 시간 구하기"],
        ["6-2-u2-e5-example-4", "강물을 거슬러 가는 시간 구하기"],
        ["6-2-u2-e5-mission-1", "걷는 빠르기로 걸린 시간을 소수 첫째 자리까지 구하기"],
        ["6-2-u2-e5-mission-2", "두 자동차가 1L로 가는 거리 비교하기"],
        ["6-2-u2-e5-mission-3", "연어가 강물을 거슬러 가는 시간 구하기"],
        ["6-2-u2-e5-mission-4", "참기름을 덜어 낸 뒤 빈 통의 무게 구하기"],
        ["6-2-u2-e5-mission-5", "남은 양초의 길이로 지난 시간 구하기"],
        ["6-2-u2-e5-mission-6", "주어진 거리 관계로 갤런을 리터로 바꾸기"]
      ]) {
        await page.locator("#typeSearchInput").fill(label);
        const row = page.locator(`[data-preview-type-id="${id}"]`);
        assert.equal(await row.count(), 1, `${width}px ${id}: 원문 유형이 한 개만 표시`);
        assert(await row.locator('input[type="checkbox"]').isDisabled(), `${width}px ${id}: 공식 답 대조 전 잠금`);
        await row.scrollIntoViewIfNeeded();
        await row.click();
        const preview = page.locator("#typePreviewPopover");
        await preview.waitFor({ state: "visible" });
        const previewText = await preview.innerText();
        if (id.endsWith("mission-3")) assert(previewText.includes("기준 빠르기"), `${width}px ${id}: 모호한 조건 표시`);
        else if (id.endsWith("mission-4")) assert(previewText.includes("손글씨 답"), `${width}px ${id}: 계산 충돌 표시`);
        else assert(previewText.includes("공식 답"), `${width}px ${id}: 실제 잠금 사유 표시`);
        const box = await preview.evaluate(element => element.getBoundingClientRect().toJSON());
        assert(box.left >= -1 && box.right <= width + 1, `${width}px ${id}: 미리보기 가로 잘림 없음`);
        if (outputDir && ["example-3", "mission-3", "mission-4"].some(suffix => id.endsWith(suffix))) {
          await page.screenshot({ path: path.join(outputDir, `grade6-e5-${id.slice(-9)}-${width}.png`) });
        }
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${width}px: 가로 스크롤 없음`);
      assert.deepEqual(errors, [], `${width}px: 브라우저 오류 없음`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log("6-2 개념탐구 5 PC·390px·320px: 본문·예제·Mission 11유형과 충돌 잠금 미리보기 검사 통과");
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
