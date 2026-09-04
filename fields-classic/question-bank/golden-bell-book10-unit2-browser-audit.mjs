import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE || process.cwd(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(runtimeModules, "pdf-lib"));
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const screenshotPrefix = process.env.GOLDEN_BELL_BOOK10_SCREENSHOT_PREFIX || process.argv[2] || "";

async function unlockConcept(page) {
  await page.locator('.lesson-button[data-lesson="catch-up-acorns"]').click();
  const experience = page.locator(".progressive-concept");
  for (let step = 0; step < 2; step += 1) await experience.locator('[data-experience-action="next"]').click();
  await experience.locator("[data-experience-answer]").click();
  await page.locator('.stage-step[data-phase="original"]').click();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
    });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK10-UNIT2-${viewport.width}&book=book-10`, { waitUntil: "networkidle" });
    await page.locator('.lesson-button[data-lesson="catch-up-acorns"]').click();
    assert.equal(await page.locator(".concept-type-overview article").count(), 5, "unit 2 type overview is incomplete");
    assert.equal(await page.locator(".concept-type-overview").evaluate((node) => Boolean(node.compareDocumentPosition(document.querySelector(".concept-experience")) & Node.DOCUMENT_POSITION_FOLLOWING)), true, "type overview must appear before the concept experience");
    await unlockConcept(page);

    assert.equal(await page.locator("[data-original-item]").count(), 1, "source practice must show one item at a time");
    assert.equal(await page.locator(".source-question-progress span").count(), 18, "source Q1(1), Q1(2), and Q2-Q17 progress is incomplete");
    assert.equal(await page.locator(".source-question-progress").evaluate((node) => node.scrollLeft), 0, "source progress must begin at Q1 on narrow screens");
    assert.equal(await page.locator(".answer-part input").count(), 3, "first source item needs three answer fields");
    assert.equal(await page.locator(".b10-quantity-equation").count(), 2, "first source weight conditions are missing");
    assert.equal(await page.locator(".quiz-item-solution").count(), 0, "worked solution leaked before checking");
    if (screenshotPrefix) {
      await page.screenshot({ path: `${screenshotPrefix}-${viewport.width}.png`, fullPage: true });
    }

    await page.locator('.answer-part input').nth(0).fill("11");
    await page.locator('.answer-part input').nth(1).fill("7");
    await page.locator('.answer-part input').nth(2).fill("4");
    await page.locator('[data-check="original"]').click();
    assert.match(await page.locator(".feedback").innerText(), /맞았어요/u, "approved multi-part answer was rejected");
    assert.match(await page.locator(".quiz-item-solution").innerText(), /33÷3=11/u, "worked solution is not calculation-based");
    await page.locator('[data-check="original"]').click();
    assert.match(await page.locator(".source-question-card>header span").innerText(), /1-\(2\)/u, "next source item did not open");

    const seenTypes = new Set();
    const expectedVisuals = [
      ".b10-quantity-equations", ".b10-quantity-equations", ".b10-quantity-equations", ".b10-target-score",
      ".b10-quantity-equations", ".b10-quantity-equations", ".b10-pair-sum-list", ".b10-pair-sum-list",
      ".b10-pair-sum-list", ".b10-pair-sum-list", ".b10-ring", ".b10-commerce-equation",
      ".b10-share-change-unknown", ".b10-share-change-unknown", ".b10-table", ".b10-table",
      ".b10-table", ".b10-table"
    ];
    for (let index = 1; index < 18; index += 1) {
      seenTypes.add((await page.locator(".source-question-card>header strong").innerText()).trim());
      assert.equal(await page.locator(".quiz-visual").count(), 1, `source item ${index + 1} visual missing`);
      assert.equal(await page.locator(expectedVisuals[index]).count(), 1, `source item ${index + 1} uses the wrong visual structure`);
      await page.locator("[data-original-skip]").click();
      await page.locator('[data-check="original"]').click();
      if (index < 17) assert.equal(await page.locator("[data-original-item]").count(), 1, `source item ${index + 2} did not open`);
    }
    assert.ok(seenTypes.size >= 9, `source type split is too coarse: ${[...seenTypes].join(", ")}`);
    assert.equal(await page.locator("[data-extension-answer]").count(), 1, "source practice did not continue to additional learning");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${viewport.width}px horizontal overflow`);
    assert.deepEqual(errors, [], `${viewport.width}px browser errors: ${errors.join(" | ")}`);
    await page.close();
  }

  const printPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await printPage.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK10-PRINT&book=book-10`, { waitUntil: "networkidle" });
  await printPage.locator('.lesson-button[data-lesson="catch-up-acorns"]').click();
  await printPage.evaluate(() => { window.print = () => {}; });
  await printPage.locator("#printLessonButton").click();
  await printPage.waitForTimeout(100);
  assert.equal(await printPage.locator('.gold-print-page[data-print-part^="original-"]').count(), 9, "source practice print needs nine source-page groups");
  assert.equal(await printPage.locator('.gold-print-page[data-print-part^="story-"]').count(), 2, "additional learning print pages missing");
  assert.equal(await printPage.locator(".gold-print-source-item").count(), 18, "print omitted a source item");
  assert.equal(await printPage.locator(".gold-print-source-item .gold-print-part-answers").count(), 18, "print answer fields missing");
  await printPage.emulateMedia({ media: "print" });
  const bounds = await printPage.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => {
    const pageRect = node.getBoundingClientRect();
    const footer = node.querySelector(":scope > .gold-print-footer");
    const contentBottom = Array.from(node.children)
      .filter((child) => !child.classList.contains("gold-print-footer"))
      .reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom), pageRect.top);
    return { height: pageRect.height, contentBottom: contentBottom - pageRect.top, footerTop: footer.getBoundingClientRect().top - pageRect.top };
  }));
  assert.deepEqual(bounds.filter((item) => item.height > 1022), [], "a print page expanded beyond A4");
  assert.deepEqual(bounds.filter((item) => item.contentBottom > item.footerTop - 2), [], "print content overlaps the footer");
  const pdf = await PDFDocument.load(await printPage.pdf({ format: "A4", printBackground: true }));
  assert.equal(pdf.getPageCount(), 11, "current Book 10 unit 2 print must contain 9 source and 2 additional pages");
  await printPage.close();

  console.log("GOLDEN_BELL_BOOK10_UNIT2_BROWSER_OK desktop=pass mobile=pass sourceCards=18 printPages=11");
} finally {
  await browser.close();
}
