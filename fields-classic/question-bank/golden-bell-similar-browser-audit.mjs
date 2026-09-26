import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { goldenBellPracticeItems } from "./golden-bell-faithful-practice.js";
import { installFaithfulPractice } from "./golden-bell-faithful-protected.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname), "Private answer fixtures may only be used against a local test server");
const useSyntheticFixture = process.env.FIELDS_SYNTHETIC_SIMILAR_FIXTURE === "1";
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK || useSyntheticFixture, "Set FIELDS_PRIVATE_ANSWER_BANK or explicitly enable the local synthetic UI fixture");
function syntheticRecords(book) {
  const records = {};
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.answerRef) records[node.answerRef] = {
      answer: Array.isArray(node.options) && node.options.length ? node.options[0] : "0",
      solution: "조건을 정리하고 그림의 관계를 따라 계산한 뒤 답을 확인합니다."
    };
    Object.values(node).forEach(visit);
  };
  visit(book);
  return records;
}
const privateBank = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"))
  : { books: Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [book.id, syntheticRecords(book)])) };
const output = process.env.FIELDS_CAPTURE_DIR;
for (const book of GOLDEN_BELL_BOOKS) installFaithfulPractice(book, privateBank.books[book.id]);
if (output) await mkdir(output, { recursive: true });
const results = [];
const runId = Date.now();
const auditBooks = GOLDEN_BELL_BOOKS.filter((book) => /^book-(0[2-9]|10)$/u.test(book.id));

function unlockedProgress() {
  return Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [
    book.id,
    Object.fromEntries(book.lessons.map((lesson) => [lesson.id, { original: true }]))
  ]));
}

async function auditViewport(browser, viewport, label) {
  const student = `SIMILAR-${label.toUpperCase()}-${runId}`;
  const page = await browser.newPage({ viewport, isMobile: label === "mobile", hasTouch: label === "mobile" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  await page.addInitScript(({ key, progress }) => {
    localStorage.setItem(key, JSON.stringify(progress));
    sessionStorage.setItem("gfield_fields_session", "isolated-similar-audit");
  }, {
    key: `fields-classic-golden-bell:${student}`,
    progress: unlockedProgress()
  });
  await page.route("**/functions/v1/fields-auth", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", route => {
    const { bookId } = route.request().postDataJSON();
    assert.ok(privateBank.books[bookId], `Missing private fixture for ${bookId}`);
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: privateBank.books[bookId] }) });
  });

  let audited = 0;
  for (const book of auditBooks) {
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=${book.id}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    for (const lesson of book.lessons) {
      await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
      if (book.id === "book-05" && lesson.id === "path-number-grid") {
        await page.locator('.stage-step[data-phase="original"]').click();
        const sourceVisuals = await page.locator(".item-quiz-visual .book05-visual").evaluateAll((nodes) => nodes.map((node) => ({
          width: node.getBoundingClientRect().width,
          pathWidth: node.querySelector(".b5-path-grid")?.getBoundingClientRect().width || 0,
          calendars: node.querySelectorAll(".b5-calendar,.torn-calendar").length
        })));
        assert.equal(sourceVisuals.length, lesson.original.items.length, `${label}/book-05/path-number-grid: source visual count changed`);
        assert.ok(sourceVisuals.every(({ width, pathWidth }) => width > 240 && pathWidth > 180), `${label}/book-05/path-number-grid: source number array collapsed: ${JSON.stringify(sourceVisuals)}`);
        assert.ok(sourceVisuals.every(({ calendars }) => calendars === 0), `${label}/book-05/path-number-grid: calendar leaked into the number-array lesson`);
      }
      const extensionStep = page.locator('.stage-step[data-phase="extension"]');
      assert.equal(await extensionStep.isDisabled(), false, `${label}/${book.id}/${lesson.id}: additional learning is locked`);
      await extensionStep.click();
      const items = goldenBellPracticeItems(lesson, book.id);
      const lessonMinutes = lesson.dailyPractice?.estimatedMinutes || Math.max(3, items.length);
      const workloadPattern = new RegExp(`${items.length}문제 중 1번째[\\s\\S]*이 학습 ${items.length}문제 · 약 ${lessonMinutes}분 \\/ 이 권 ${book.dailyPractice.problemCount}문제`, "u");
      assert.match(await page.locator(".daily-quiz-head aside").innerText(), workloadPattern, `${label}/${book.id}/${lesson.id}: daily workload label missing`);
      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        assert.equal(await page.locator(".daily-quiz-head aside strong").innerText(), `${items.length}문제 중 ${itemIndex + 1}번째`, `${label}/${book.id}/${lesson.id}: additional problem did not open`);
        assert.equal(await page.locator(".extension-solution").count(), 0, `${label}/${book.id}/${lesson.id}: similar solution leaked`);
        const visual = await page.locator(".quiz-visual").evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            contentLength: node.textContent.trim().length + node.querySelectorAll("svg, table, ol, ul, div").length,
            overflow: node.scrollWidth > node.clientWidth + 1
          };
        });
        assert.ok(visual.width > 120 && visual.height > 40 && visual.contentLength > 0, `${label}/${book.id}/${lesson.id}: similar visual is blank: ${JSON.stringify(visual)}`);
        assert.equal(visual.overflow, false, `${label}/${book.id}/${lesson.id}: similar visual overflows its panel`);
        await page.locator("[data-extension-answer]").click();
        assert.match(await page.locator(".extension-solution").innerText(), /풀이[\s\S]*답/u, `${label}/${book.id}/${lesson.id}: worked solution or answer missing`);
        const sizes = await page.locator(".extension-study>strong, .extension-study input, .extension-study button, .extension-solution p").evaluateAll((nodes) => nodes.map((node) => ({
          fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
          height: node.matches("button, input") ? node.getBoundingClientRect().height : null
        })));
        assert.ok(sizes.every(({ fontSize }) => fontSize >= 14), `${label}/${book.id}/${lesson.id}: similar-practice text is too small: ${JSON.stringify(sizes)}`);
        assert.ok(sizes.filter(({ height }) => height != null).every(({ height }) => height >= 40), `${label}/${book.id}/${lesson.id}: similar-practice touch control is too small: ${JSON.stringify(sizes)}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${book.id}/${lesson.id}: page has horizontal overflow`);
        results.push({ viewport: label, book: book.id, lesson: lesson.id, item: itemIndex + 1, render: "pass", solution: "pass", overflow: "pass" });
        if (itemIndex + 1 < items.length) await page.locator('[data-check="extension"]').click();
      }
      audited += 1;
    }
  }
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
  return audited;
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await auditViewport(browser, { width: 1440, height: 1050 }, "desktop");
  const mobile = await auditViewport(browser, { width: 390, height: 844 }, "mobile");
  console.log(`GOLDEN_BELL_SIMILAR_BROWSER_OK desktop=${desktop} mobile=${mobile} itemViews=${results.length} auth=isolated-fixture math=not-audited duration=estimate-only`);
} finally {
  if (output) await writeFile(path.join(output, "similar-browser-audit.json"), JSON.stringify({ scope: "Isolated authorization fixtures; interaction/render checks, not independent mathematics or live authorization", results }, null, 2));
  await browser.close();
}
