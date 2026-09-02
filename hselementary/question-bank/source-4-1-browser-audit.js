"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const url = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(process.cwd(), "tmp", "browser-audit");
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on("pageerror", error => failures.push(`브라우저 오류: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) failures.push(`콘솔 오류: ${message.text()}`);
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.selectOption("#unitFilter", "4-1-u6");
  await page.fill("#typeSearchInput", "두 자리 수에서 두 자리 숫자의 곱을 뺀 수");
  const row = page.locator(".tree-type:not(.is-pending)").first();
  await row.hover();
  if (await page.locator("#typePreviewPopover:not([hidden])").count()) failures.push("마우스를 올리기만 했는데 미리보기가 열립니다.");
  await row.click();
  const preview = page.locator("#typePreviewPopover:not([hidden])");
  await preview.waitFor({ state: "visible" });
  const previewBox = await preview.boundingBox();
  if (!previewBox || previewBox.x < 0 || previewBox.y < 0 || previewBox.x + previewBox.width > 1440 || previewBox.y + previewBox.height > 900) failures.push("데스크톱 미리보기가 화면 밖으로 잘립니다.");
  if (previewBox && (previewBox.width > 345 || previewBox.height > 325)) failures.push(`데스크톱 미리보기가 너무 큽니다: ${previewBox.width}×${previewBox.height}`);
  const rowBox = await row.boundingBox();
  const treeBox = await page.locator(".tree-pane").boundingBox();
  if (previewBox && rowBox) {
    const overlapWidth = Math.max(0, Math.min(previewBox.x + previewBox.width, rowBox.x + rowBox.width) - Math.max(previewBox.x, rowBox.x));
    const overlapHeight = Math.max(0, Math.min(previewBox.y + previewBox.height, rowBox.y + rowBox.height) - Math.max(previewBox.y, rowBox.y));
    if (overlapWidth * overlapHeight > 0) failures.push("미리보기가 현재 선택한 유형 행을 가립니다.");
  }
  if (previewBox && treeBox) {
    const overlapWidth = Math.max(0, Math.min(previewBox.x + previewBox.width, treeBox.x + treeBox.width) - Math.max(previewBox.x, treeBox.x));
    const overlapHeight = Math.max(0, Math.min(previewBox.y + previewBox.height, treeBox.y + treeBox.height) - Math.max(previewBox.y, treeBox.y));
    if (overlapWidth * overlapHeight > 0) failures.push("미리보기가 유형 목록 영역을 가립니다.");
  }
  if ((await row.getAttribute("aria-expanded")) !== "true") failures.push("열린 유형에 미리보기 상태가 표시되지 않습니다.");
  await page.screenshot({ path: path.join(outputDir, "4-1-rule-preview-desktop.png"), fullPage: false });

  await page.locator("input[data-type-id]").first().check();
  await page.click("#generateButton");
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (desktopOverflow) failures.push("데스크톱 문제 검토 화면에 가로 넘침이 있습니다.");
  await page.screenshot({ path: path.join(outputDir, "4-1-rule-review-desktop.png"), fullPage: false });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  mobile.on("pageerror", error => failures.push(`모바일 브라우저 오류: ${error.message}`));
  await mobile.goto(url, { waitUntil: "networkidle" });
  await mobile.selectOption("#unitFilter", "4-1-u6");
  await mobile.fill("#typeSearchInput", "수 카드로 만든 3 미만 소수의 합");
  const mobileRow = mobile.locator(".tree-type:not(.is-pending)").first();
  await mobileRow.click();
  const mobilePreview = mobile.locator("#typePreviewPopover:not([hidden])");
  await mobilePreview.waitFor({ state: "visible" });
  const [mobileRowBox, mobilePreviewBox] = await Promise.all([mobileRow.boundingBox(), mobilePreview.boundingBox()]);
  if (!mobilePreviewBox || !mobileRowBox || mobilePreviewBox.y < mobileRowBox.y + mobileRowBox.height - 1) failures.push("모바일 미리보기가 누른 유형 아래에 펼쳐지지 않습니다.");
  if (await mobile.locator(".selection-footer:visible").count()) failures.push("모바일 하단 문제 구성 바가 미리보기를 가릴 수 있습니다.");
  await mobile.screenshot({ path: path.join(outputDir, "4-1-card-preview-mobile.png"), fullPage: true });
  await mobile.locator("input[data-type-id]").first().check();
  const mobileOverflowBefore = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (mobileOverflowBefore) failures.push("모바일 유형 선택 화면에 가로 넘침이 있습니다.");
  await mobile.click("#generateButton");
  await mobile.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const mobileOverflowAfter = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (mobileOverflowAfter) failures.push("모바일 문제 검토 화면에 가로 넘침이 있습니다.");
  await mobile.screenshot({ path: path.join(outputDir, "4-1-card-review-mobile.png"), fullPage: true });

  await browser.close();
  if (failures.length) {
    console.error(`4-1 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`4-1 브라우저 감사 통과: 데스크톱 미리보기·검토, 모바일 선택·검토, 가로 넘침 0 · ${outputDir}`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
