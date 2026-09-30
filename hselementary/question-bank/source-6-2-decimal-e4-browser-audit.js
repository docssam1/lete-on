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
      await page.locator('#unitFilter option[value="6-2-u2"]').waitFor({ state: "attached" });
      await page.locator("#unitFilter").selectOption("6-2-u2");
      for (const [id, label] of [
        ["6-2-u2-e4-exploration-1", "만들 수 있는 반지 수와 남은 금의 무게 구하기"],
        ["6-2-u2-e4-exploration-2", "몫을 구하는 자리가 달라질 때 가장 작은 나머지 구하기"],
        ["6-2-u2-e4-example-1", "세 나눗셈의 몫과 나머지 구하기"],
        ["6-2-u2-e4-example-2", "몫이 소수 첫째 자리에서 끝나도록 더하기"],
        ["6-2-u2-e4-example-3", "반올림 조건으로 수를 찾아 새 나머지 구하기"],
        ["6-2-u2-e4-example-4", "몫의 자리를 늘려 새 나머지 구하기"],
        ["6-2-u2-e4-mission-1", "네 나눗셈의 나머지를 큰 순서로 쓰기"],
        ["6-2-u2-e4-mission-2", "정확한 몫의 자리를 줄여 생기는 나머지 구하기"],
        ["6-2-u2-e4-mission-3", "원래 수를 되찾아 다른 수로 나눈 나머지 구하기"],
        ["6-2-u2-e4-mission-4", "몫이 소수 둘째 자리에서 끝나도록 더하기"],
        ["6-2-u2-e4-mission-5", "가장 큰 원래 수를 찾아 다시 나눈 나머지 구하기"],
        ["6-2-u2-e4-mission-6", "셋째 자리 몫의 반올림과 나머지로 원래 수 구하기"]
      ]) {
        await page.locator("#typeSearchInput").fill(label);
        const row = page.locator(`[data-preview-type-id="${id}"]`);
        assert.equal(await row.count(), 1, `${width}px ${id}: 원문 물음과 같은 이름으로 한 개만 표시`);
        assert(await row.locator('input[type="checkbox"]').isDisabled(), `${width}px ${id}: 공식 답 대조 전 잠금`);
        await row.scrollIntoViewIfNeeded();
        await row.click();
        const preview = page.locator("#typePreviewPopover");
        await preview.waitFor({ state: "visible" });
        const box = await preview.evaluate(element => element.getBoundingClientRect().toJSON());
        assert(box.left >= -1 && box.right <= width + 1, `${width}px ${id}: 미리보기 가로 잘림 없음`);
        if (id.endsWith("example-4")) assert((await preview.innerText()).includes("공식 답"), `${width}px: 필기와 계산이 다른 예제의 잠금 이유`);
        if (outputDir) await page.screenshot({ path: path.join(outputDir, `grade6-e4-${id.includes("example") ? "example" : id.includes("mission") ? "mission" : "exploration"}-${id.slice(-1)}-${width}.png`) });
      }
      assert(!(await page.locator("#catalogPanel").innerText()).includes("반올림한 몫과 나머지 관계 알아보기"), "원문에 없는 반올림 유형명 제거");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${width}px: 가로 스크롤 없음`);
      assert.deepEqual(errors, [], `${width}px: 브라우저 오류 없음`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log("6-2 개념탐구 4 공개 분류표 PC·390px: 두 탐구·네 예제·여섯 Mission 유형과 잠금 미리보기 통과");
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
