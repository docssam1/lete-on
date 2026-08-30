import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const { getDocument } = await import(pathToFileURL(path.join(runtimeModules, "pdfjs-dist", "legacy", "build", "pdf.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const outputDir = process.env.CONCEPT_AUDIT_OUTPUT_DIR || "";
if (outputDir) fs.mkdirSync(outputDir, { recursive: true });
const pilotExpectations = Object.freeze({
  "shape-quarter-half-turn": Object.freeze([
    "도형이 돌아가는 중심을 먼저 표시합니다.",
    "반의 반 바퀴인지 반 바퀴인지, 어느 방향으로 도는지 확인합니다.",
    "각 꼭짓점을 중심에서 같은 거리로 같은 회전량만큼 옮긴 뒤 차례로 잇습니다."
  ]),
  "fold-cut-shape-choice": Object.freeze([
    "종이가 어느 선을 따라 겹쳐졌는지 먼저 표시합니다.",
    "접힌 상태의 자른 자리를 접은 선 반대쪽 같은 거리로 옮깁니다.",
    "원래 자리와 대칭 자리를 함께 그려 전체 모양을 확인합니다."
  ]),
  "circular-magic-line-sum": Object.freeze([
    "여러 줄에 함께 들어가는 가운데 수를 표시합니다.",
    "한 줄의 합에서 가운데 수를 빼 마주 보는 두 수의 합을 찾습니다.",
    "남은 수를 같은 합이 되는 짝으로 놓고 모든 줄을 다시 더합니다."
  ]),
  "person-item-logic": Object.freeze([
    "사람은 가로, 동물이나 음식은 세로에 놓아 조건을 한눈에 볼 수 있게 합니다.",
    "맞는 관계를 표시하고 같은 행과 열의 다른 가능성을 지웁니다.",
    "마지막 후보를 정한 뒤 처음부터 모든 조건에 다시 대입합니다."
  ]),
  "shape-mirror-direction": Object.freeze([
    "도형과 거울 사이의 선을 기준으로 어느 쪽에 비치는지 먼저 확인합니다.",
    "각 꼭짓점에서 거울선에 수직으로 가서 반대편 같은 거리의 점을 표시합니다.",
    "대응하는 점을 원래 순서대로 잇고 좌우 방향이 바뀌었는지 확인합니다."
  ]),
  "fold-number-cut-sum-textbook": Object.freeze([
    "접는 선과 화살표를 차례로 보고 어느 칸이 어느 쪽으로 이동하는지 표시합니다.",
    "접힌 종이에서 자른 자리와 겹치는 원래 번호 칸을 펼치는 순서의 반대로 모두 찾습니다.",
    "표시한 번호가 빠짐없이 잘린 칸인지 다시 확인한 뒤 그 수들만 더합니다."
  ]),
  "cross-shape-magic-sum": Object.freeze([
    "가로줄과 세로줄에 모두 들어가는 가운데 칸을 먼저 표시합니다.",
    "가운데 수를 제외하고 가로 양끝과 세로 양끝의 합이 같아지도록 수 카드를 짝지어 봅니다.",
    "카드를 놓은 뒤 가로줄과 세로줄을 각각 더해 두 합이 같은지 확인합니다."
  ]),
  "two-digit-condition": Object.freeze([
    "십의 자리 조건과 일의 자리 조건, 두 숫자의 합이나 차 조건을 따로 적습니다.",
    "십의 자리가 0이 아닌 숫자쌍 가운데 먼저 만족하는 조건에 맞는 후보를 모두 적습니다.",
    "남은 후보를 다른 조건에 하나씩 대입해 모두 만족하는 두 자리 수만 남깁니다."
  ])
});
const expectedOfflineError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function openPilot(page, typeId, label) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !expectedOfflineError(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=CONCEPT-AUDIT&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="concept"]').click();
  const pilot = page.locator(`#curriculumTree [data-preview-type="${typeId}"]`);
  assert.equal(await pilot.count(), 1, `${label}: ${typeId} pilot type missing`);
  if (!(await pilot.isVisible())) {
    await pilot.evaluate((element) => {
      for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
        if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      }
    });
    await page.waitForTimeout(50);
  }
  await pilot.scrollIntoViewIfNeeded();
  return { errors, pilot };
}

async function assertPreview(page, pilot, expectedBeats, trigger, label) {
  if (trigger === "hover") await pilot.hover();
  else {
    const targetInput = pilot.locator("input");
    const tabInputs = page.locator('#curriculumTree input[data-curriculum-key]:not([disabled])');
    const targetIndex = await targetInput.evaluate((target) => [...document.querySelectorAll('#curriculumTree input[data-curriculum-key]:not([disabled])')].indexOf(target));
    assert.ok(targetIndex > 0, `${label}: target has no previous keyboard stop`);
    await tabInputs.nth(targetIndex - 1).focus();
    await page.keyboard.press("Tab");
    assert.equal(await targetInput.evaluate((target) => document.activeElement === target), true, `${label}: Tab did not reach the target input`);
  }
  const preview = page.locator("#typePreview:not([hidden])");
  await preview.waitFor();
  assert.equal(await preview.locator(".textbook-concept-tutorial.source-backed").count(), 1, `${label}: source-backed preview class missing`);
  assert.equal(await preview.locator(".textbook-concept-tutorial header span").innerText(), "개념 익히기", `${label}: source-backed heading changed`);
  assert.deepEqual(await preview.locator(".textbook-concept-tutorial li p").allInnerTexts(), expectedBeats, `${label}: preview beat text changed`);
  assert.equal(await preview.locator("text=개념 찾기").count(), 0, `${label}: generic filler returned`);
  assert.equal(await preview.locator("text=답 확인").count(), 0, `${label}: answer filler returned`);
}

async function buildPilotWorksheet(page, pilot, expectedBeats, label, count = 1) {
  await pilot.locator("input").check();
  await page.locator("#questionCount").fill(String(count));
  await page.locator("#questionCount").dispatchEvent("input");
  await page.locator("#buildButton").click();
  assert.equal(await page.locator(".question-card").count(), count, `${label}: pilot question count mismatch`);
  assert.equal(await page.locator("#typePreview[hidden]").count(), 1, `${label}: preview remained over worksheet`);
  const tutorial = page.locator("#questionGrid .textbook-concept-tutorial.source-backed");
  assert.equal(await tutorial.count(), count, `${label}: worksheet source-backed tutorial count mismatch`);
  assert.equal(await tutorial.first().locator("header span").innerText(), "개념 익히기", `${label}: worksheet heading changed`);
  assert.deepEqual(await tutorial.first().locator("li p").allInnerTexts(), expectedBeats, `${label}: worksheet beat text changed`);
  assert.equal(await page.locator(".concept-worked-solution").count(), count, `${label}: configured worked solution disclosure count mismatch`);
  assert.equal(await page.locator(".concept-worked-solution[open]").count(), 0, `${label}: worked solution must remain collapsed`);
  assert.equal(await page.locator(".answer-text").count(), 0, `${label}: answer text exposed`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}: horizontal overflow`);
}

async function assertPrintableCards(page, typeId) {
  const scrollY = await page.evaluate(() => window.scrollY);
  assert.equal(scrollY, 0, `${typeId} print: worksheet did not return to the page top`);
  const worksheetHead = await page.locator(".worksheet-head").boundingBox();
  assert.ok(worksheetHead && worksheetHead.y >= -1, `${typeId} print: worksheet heading is clipped above the page`);
  const worksheetBox = await page.locator("#worksheetSection").boundingBox();
  assert.ok(worksheetBox && worksheetBox.width >= 793 && worksheetBox.width <= 795,
    `${typeId} print: worksheet width ${worksheetBox?.width || 0}px is not A4 width`);
  assert.ok(worksheetBox && worksheetBox.y + worksheetBox.height <= 1124,
    `${typeId} print: worksheet height ${worksheetBox?.height || 0}px exceeds one A4 page`);
  const cards = page.locator("#questionGrid .question-card");
  const boxes = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const visibleChildren = [...element.children].filter((child) => {
      const childRect = child.getBoundingClientRect();
      return getComputedStyle(child).display !== "none" && childRect.height > 0;
    });
    return {
      top: rect.top,
      bottom: rect.bottom,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      lastVisibleBottom: Math.max(...visibleChildren.map((child) => child.getBoundingClientRect().bottom))
    };
  }));
  assert.equal(boxes.length, 2, `${typeId} print: expected two card boxes`);
  assert.ok(boxes[0].top >= worksheetHead.y + worksheetHead.height - 1, `${typeId} print: first card overlaps or precedes the worksheet heading`);
  for (const [index, box] of boxes.entries()) {
    assert.ok(box.scrollHeight <= box.clientHeight + 1, `${typeId} print: card ${index + 1} content is vertically clipped`);
    assert.ok(box.scrollWidth <= box.clientWidth + 1, `${typeId} print: card ${index + 1} content is horizontally clipped`);
    assert.ok(box.lastVisibleBottom <= box.bottom + 1, `${typeId} print: card ${index + 1} last visible block crosses its border`);
  }
  assert.ok(boxes[0].bottom <= boxes[1].top + 1, `${typeId} print: question cards overlap`);
  for (const card of await cards.all()) {
    const requiredBlocks = card.locator(".textbook-concept-tutorial,.question-prompt,.visual,.answer-line,.drawing-answer-note");
    assert.equal(await requiredBlocks.count(), 4, `${typeId} print: required instructional or response block missing`);
    const cardBox = await card.boundingBox();
    for (const block of await requiredBlocks.all()) {
      assert.equal(await block.isVisible(), true, `${typeId} print: required block is hidden`);
      const blockBox = await block.boundingBox();
      assert.ok(blockBox.x >= cardBox.x - 1 && blockBox.y >= cardBox.y - 1
        && blockBox.x + blockBox.width <= cardBox.x + cardBox.width + 1
        && blockBox.y + blockBox.height <= cardBox.y + cardBox.height + 1, `${typeId} print: required block crosses its card`);
    }
  }
}

async function inspectPrintedPdf(pdf, typeId) {
  const document = await getDocument({ data: new Uint8Array(pdf) }).promise;
  try {
    assert.equal(document.numPages, 1, `${typeId} print: two concept questions should fit on one A4 page, got ${document.numPages}`);
    const page = await document.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const title = content.items.find((item) => item.str.includes("필즈 더 클래식 단원 학습지"));
    const firstNumber = content.items.find((item) => item.str === "01");
    const secondNumber = content.items.find((item) => item.str === "02");
    for (const [label, item] of [["worksheet title", title], ["question 01", firstNumber], ["question 02", secondNumber]]) {
      assert.ok(item, `${typeId} print: ${label} is missing from the rendered PDF`);
      const y = item.transform[5];
      assert.ok(y >= 0 && y <= viewport.height, `${typeId} print: ${label} is outside the A4 page`);
    }
    return document.numPages;
  } finally {
    await document.destroy();
  }
}

const browser = await chromium.launch({ headless: true });
try {
  const printPageCounts = [];
  for (const [typeId, expectedBeats] of Object.entries(pilotExpectations)) {
    console.log(`CURRICULUM_CONCEPT_BROWSER_CHECK ${typeId}`);
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    const desktopContext = await openPilot(desktop, typeId, `desktop ${typeId}`);
    if (typeId === "shape-quarter-half-turn") {
      await assertPreview(desktop, desktopContext.pilot, expectedBeats, "hover", "desktop hover");
      await desktop.keyboard.press("Escape");
      const principleOnly = desktop.locator('#curriculumTree [data-preview-type="shape-flip-composition"]');
      assert.equal(await principleOnly.count(), 1, "desktop: principle-only comparison type missing");
      await principleOnly.hover();
      const principlePreview = desktop.locator("#typePreview:not([hidden])");
      await principlePreview.waitFor();
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial.principle-only").count(), 1, "desktop: principle-only preview class missing");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial header span").innerText(), "풀이 원리", "desktop: principle-only heading changed");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial li").count(), 1, "desktop: principle-only preview should have one row");
      assert.equal(await principlePreview.locator(".textbook-concept-tutorial li strong").innerText(), "핵심 방법", "desktop: principle-only label changed");
    }
    const previewTrigger = typeId === "shape-quarter-half-turn" ? "focus" : "hover";
    await assertPreview(desktop, desktopContext.pilot, expectedBeats, previewTrigger, `desktop ${previewTrigger} ${typeId}`);
    await buildPilotWorksheet(desktop, desktopContext.pilot, expectedBeats, `desktop ${typeId}`, 2);
    await desktop.emulateMedia({ media: "print" });
    await desktop.evaluate(() => window.scrollTo(0, 0));
    const printedTutorial = desktop.locator("#questionGrid .textbook-concept-tutorial.source-backed");
    assert.equal(await printedTutorial.locator("li").count(), 6, `${typeId} print: all beats must remain in the DOM`);
    for (const line of await printedTutorial.locator("li").all()) {
      assert.equal(await line.isVisible(), true, `${typeId} print: a source-backed beat is hidden`);
    }
    for (const solution of await desktop.locator(".concept-worked-solution").all()) {
      assert.equal(await solution.isVisible(), false, `${typeId} print: worked solution disclosure must stay off the worksheet`);
    }
    await assertPrintableCards(desktop, typeId);
    const pdf = await desktop.pdf({ format: "A4", printBackground: true });
    if (outputDir) fs.writeFileSync(path.join(outputDir, `${typeId}.pdf`), pdf);
    const printPages = await inspectPrintedPdf(pdf, typeId);
    printPageCounts.push(printPages);
    assert.deepEqual(desktopContext.errors, [], `${typeId} desktop: browser errors ${desktopContext.errors.join(" | ")}`);
    await desktop.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const mobileContext = await openPilot(mobile, typeId, `mobile ${typeId}`);
    await buildPilotWorksheet(mobile, mobileContext.pilot, expectedBeats, `mobile ${typeId}`);
    assert.deepEqual(mobileContext.errors, [], `${typeId} mobile: browser errors ${mobileContext.errors.join(" | ")}`);
    await mobile.close();
  }
  console.log(`CURRICULUM_CONCEPT_BROWSER_OK pilots=${Object.keys(pilotExpectations).length} beats=3 printPages=${printPageCounts.join(",")} desktop-focus desktop-hover mobile`);
} finally {
  await browser.close();
}
