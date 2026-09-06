import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const captureDir = process.env.FIELDS_CAPTURE_DIR || "";
if (captureDir) await fs.mkdir(captureDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function openLesson(viewport, suffix) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK04-HIDDEN-${suffix}&book=book-04`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="hidden-cube-count"]').click();
  return { page, errors };
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, `${label}: horizontal overflow`);
}

async function auditConcept(viewport, label) {
  const { page, errors } = await openLesson(viewport, label);
  const experience = page.locator('.progressive-concept[data-progressive-family="cube-hidden-count"]');
  assert.equal(await experience.count(), 1, `${label}: source-backed concept animation missing`);
  assert.equal(await experience.locator('.hidden-cube-concept-visual[data-hidden-cube-phase="height"]').count(), 1, `${label}: height-reading scene missing`);
  assert.equal(await experience.locator(".ws-iso-top-label").count(), 3, `${label}: first scene needs three top-face height labels`);
  assert.equal(await experience.locator(".cube-scene-set").count(), 0, `${label}: concept must not show three source questions side by side`);
  await assertNoOverflow(page, `${label}/height`);

  await experience.locator('[data-experience-action="next"]').click();
  assert.equal(await experience.locator('.hidden-cube-concept-visual[data-hidden-cube-phase="total"]').count(), 1, `${label}: total-count scene missing`);
  assert.equal(await experience.locator(".ws-iso-top-label").count(), 4, `${label}: total scene needs four top-face height labels`);
  assert.equal(await experience.locator(".cube-height-map .filled").count(), 4, `${label}: top-view height map is incomplete`);
  assert.match(await experience.locator(".hidden-cube-equation").innerText(), /3\s*\+\s*2\s*\+\s*2\s*\+\s*2\s*=\s*9/u, `${label}: height total equation changed`);
  await assertNoOverflow(page, `${label}/total`);

  await experience.locator('[data-experience-action="next"]').click();
  assert.equal(await experience.locator('.hidden-cube-concept-visual[data-hidden-cube-phase="hidden"]').count(), 1, `${label}: hidden-count scene missing`);
  assert.equal(await experience.locator(".ws-iso-top-label").count(), 6, `${label}: final scene needs six top-face height labels`);
  assert.match(await experience.locator(".hidden-cube-equation").innerText(), /10\s*-\s*6\s*=\s*4/u, `${label}: hidden-count equation changed`);
  assert.equal(await experience.locator('[data-experience-choice="4개"]').count(), 1, `${label}: approved concept answer is not unique`);
  await experience.locator('[data-experience-choice="4개"]').click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${label}: verified concept did not unlock source questions`);
  await assertNoOverflow(page, `${label}/hidden`);
  if (captureDir) await page.screenshot({ path: path.join(captureDir, `book04-hidden-${label}.png`), fullPage: true });
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
}

async function auditPerQuestionAnswersAndPrint() {
  const { page, errors } = await openLesson({ width: 1440, height: 1050 }, "DESKTOP-SOURCE");
  const experience = page.locator('.progressive-concept[data-progressive-family="cube-hidden-count"]');
  await experience.locator('[data-experience-action="next"]').click();
  await experience.locator('[data-experience-action="next"]').click();
  await experience.locator('[data-experience-answer]').click();
  await page.locator('.stage-step[data-phase="original"]').click();

  const expectedLabelCounts = [3, 4, 6];
  for (let index = 0; index < expectedLabelCounts.length; index += 1) {
    const card = page.locator(".source-question-card");
    assert.equal(await card.locator("[data-original-item]").count(), 1, `source ${index + 1}: more than one answer card is shown`);
    assert.equal(await card.locator('[data-input-group][data-answer-scope="original"]').count(), 1, `source ${index + 1}: answer input missing`);
    assert.equal(await card.locator(".ws-iso-top-label").count(), expectedLabelCounts[index], `source ${index + 1}: top-face labels changed`);
    const visualBeforeAnswer = await card.evaluate((node) => {
      const visual = node.querySelector(".item-quiz-visual");
      const input = node.querySelector('[data-input-group][data-answer-scope="original"]');
      return Boolean(visual && input && (visual.compareDocumentPosition(input) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    assert.equal(visualBeforeAnswer, true, `source ${index + 1}: answer input must sit below its own diagram`);
    await card.locator("[data-original-answer]").click();
    assert.equal(await card.locator(".quiz-item-solution").count(), 1, `source ${index + 1}: worked solution missing`);
    assert.match(await card.locator(".quiz-item-solution").innerText(), /풀이[\s\S]*답/u, `source ${index + 1}: solution and answer are not paired`);
    await page.locator('[data-check="original"]').click();
  }

  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printLessonButton").click();
  await page.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4 "));
  const sourcePages = page.locator('.gold-print-page[data-print-part^="original-"]');
  assert.equal(await sourcePages.count(), 1, "the three source questions must share one A4 page");
  const printItems = sourcePages.locator(".gold-print-source-item");
  assert.equal(await printItems.count(), 3, "A4 source question grouping changed");
  for (let index = 0; index < 3; index += 1) {
    const printItem = printItems.nth(index);
    assert.equal(await printItem.locator(".gold-print-answer").count(), 1, `print ${index + 1}: answer line missing`);
    assert.equal(await printItem.locator(".ws-iso-top-label").count(), expectedLabelCounts[index], `print ${index + 1}: top-face labels missing`);
  }
  await page.emulateMedia({ media: "print" });
  if (captureDir) await page.screenshot({ path: path.join(captureDir, "book04-hidden-print.png"), fullPage: true });
  const printLayout = await sourcePages.evaluateAll((nodes) => nodes.every((node) => {
    const pageBox = node.getBoundingClientRect();
    const items = [...node.querySelectorAll(".gold-print-source-item")];
    return pageBox.height <= 1022 && items.every((item) => {
      const source = item.getBoundingClientRect();
      const visual = item.querySelector(".gold-print-visual")?.getBoundingClientRect();
      const answer = item.querySelector(".gold-print-answer")?.getBoundingClientRect();
      return visual && answer && source.left >= pageBox.left - 1 && source.right <= pageBox.right + 1 && source.top >= pageBox.top - 1 && source.bottom <= pageBox.bottom + 1 && answer.top >= visual.bottom - 1;
    });
  }));
  assert.equal(printLayout, true, "A4 content crosses a page boundary or an answer line is not below its diagram");
  assert.deepEqual(errors, [], `desktop source: browser errors: ${errors.join(" | ")}`);
  await page.close();
}

await auditConcept({ width: 1440, height: 1050 }, "desktop");
await auditConcept({ width: 390, height: 844 }, "mobile");
await auditPerQuestionAnswersAndPrint();
await browser.close();

console.log("GOLDEN_BELL_BOOK04_HIDDEN_BROWSER_OK desktop=pass mobile=pass sourceItems=3 perItemAnswers=pass printPages=1");
