import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const captureDir = process.env.FIELDS_CAPTURE_DIR || "";
if (captureDir) await fs.mkdir(captureDir, { recursive: true });
const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-04");
assert.ok(book, "book-04 is missing");
const protectedFixture = {};
const visitProtectedRefs = (node) => {
  if (!node || typeof node !== "object") return;
  if (node.answerRef) protectedFixture[node.answerRef] = {
    answer: Array.isArray(node.options) && node.options.length ? node.options[0] : "0",
    solution: "보이는 윗면의 높이를 모두 더해 전체 수를 구하고, 보이는 기둥 수를 빼서 확인합니다."
  };
  Object.values(node).forEach(visitProtectedRefs);
};
visitProtectedRefs(book);
protectedFixture[book.lessons.find((lesson) => lesson.id === "hidden-cube-count").experience.check.answerRef].answer = "4개";
const runId = Date.now();
const browser = await chromium.launch({ headless: true });

async function preparePage(page, student) {
  await page.route("**/functions/v1/fields-auth", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: protectedFixture }) }));
  await page.addInitScript(({ name }) => {
    sessionStorage.setItem("gfield_fields_session", "book04-hidden-browser-audit");
    sessionStorage.setItem("gf_n", name);
  }, { name: student });
}

async function openLesson(viewport, suffix) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const student = `BOOK04-HIDDEN-${suffix}-${runId}`;
  await preparePage(page, student);
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=book-04`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  await page.locator('.lesson-button[data-lesson="hidden-cube-count"]').click();
  return { page, errors };
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, `${label}: horizontal overflow`);
}

async function auditConcept(viewport, label) {
  const { page, errors } = await openLesson(viewport, label);
  const experience = page.locator('.source-animation[data-source-family="cube-hidden-count"]');
  assert.equal(await experience.count(), 1, `${label}: source-backed concept animation missing`);
  assert.equal(await experience.locator("[data-source-track] option").count(), 3, `${label}: three independent concept examples are required`);
  for (const [index, stage] of ["given", "target", "transform", "verify"].entries()) {
    assert.equal(await experience.locator(`[data-concept-stage="${stage}"]`).count(), 1, `${label}: ${stage} scene missing`);
    if (index >= 2) assert.ok(await experience.locator(".ws-iso-top-label").count(), `${label}: ${stage} scene needs top-face height labels`);
    await assertNoOverflow(page, `${label}/${stage}`);
    if (index < 3) await experience.locator('[data-experience-action="next"]').click();
  }
  assert.ok(await experience.locator("[data-answer-value]").count(), `${label}: verified hidden count is missing`);
  await page.locator('[data-next-phase="original"]').click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${label}: verified concept did not unlock source questions`);
  if (captureDir) await page.screenshot({ path: path.join(captureDir, `book04-hidden-${label}.png`), fullPage: true });
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
}

async function auditPerQuestionAnswersAndPrint() {
  const { page, errors } = await openLesson({ width: 1440, height: 1050 }, "DESKTOP-SOURCE");
  await page.locator('[data-next-phase="original"]').click();

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
