import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { hydrateProtectedAnswers } from "./golden-bell-protected.js";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK && process.env.FIELDS_BALANCE_CANDIDATE, "Private fixture paths are required");
const bank = JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const candidate = JSON.parse(await readFile(process.env.FIELDS_BALANCE_CANDIDATE, "utf8"));
const update = candidate.updates.find((entry) => entry.lessonId === "balance-substitution");
const item = update.appendItems.find((entry) => entry.sourceNo === "31-(3)");
assert.ok(item && item.workedSolution.length >= 3);

const ratios = new Set();
const weight = (objects, values) => Object.entries(objects).reduce((sum, [label, count]) => sum + count * values[label], 0);
for (let unit = 1; unit <= 12; unit += 1) {
  for (let second = 1; second <= 60; second += 1) {
    for (let third = 1; third <= 60; third += 1) {
      const values = { "가": unit, "나": second, "다": third };
      if (item.visual.equations.slice(0, 2).every((equation) => weight(equation.left, values) === weight(equation.right, values))) {
        ratios.add(weight(item.visual.equations[2].left, values) / unit);
      }
    }
  }
}
assert.equal(ratios.size, 1, "The requested number of unit marbles must be unique");
assert.equal(String([...ratios][0]), String(item.privateAnswer), "Independent ratio check disagrees with the teacher answer");

const books = structuredClone(GOLDEN_BELL_BOOKS);
const book = books.find((entry) => entry.id === candidate.bookId);
const lessonIndex = book.lessons.findIndex((entry) => entry.id === update.lessonId);
const lesson = book.lessons[lessonIndex];
const oldCount = lesson.original.items.length;
assert.ok(!lesson.original.items.some((entry) => entry.id === item.id), "Recovery would duplicate an existing item");
const answerRef = `/books/${book.id}/lessons/${lessonIndex}/original/items/${oldCount}`;
assert.ok(!Object.hasOwn(bank.books[book.id], answerRef));
const approved = {
  id: item.id, sourceNo: item.sourceNo, sourceLocator: item.sourceLocator,
  typeLabel: item.typeLabel, prompt: item.prompt, visual: item.visual,
  answerMode: "input", inputMode: "numeric", structureKey: lesson.original.structureKey,
  printGroup: Math.max(0, ...lesson.original.items.map((entry) => Number(entry.printGroup) || 0)) + 1,
  answerRef
};
lesson.original.items.push(approved);
lesson.original.printMode = "paged";
bank.books[book.id][answerRef] = { answer: item.privateAnswer, solution: item.workedSolution.join(" ") };
hydrateProtectedAnswers(structuredClone(book), bank.books[book.id]);
assert.deepEqual(lesson.original.items.slice(0, oldCount), GOLDEN_BELL_BOOKS.find((entry) => entry.id === book.id).lessons[lessonIndex].original.items);
assert.doesNotMatch(JSON.stringify(approved), /"(?:answer|solution|privateAnswer|workedSolution)":/);

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem("gfield_fields_session", "isolated-recovery-audit"));
    await page.route("**/golden-bell-data.js*", (route) => route.fulfill({ contentType: "text/javascript", body: `export const GOLDEN_BELL_BOOKS=${JSON.stringify(books)};export const goldenBellBookById=id=>GOLDEN_BELL_BOOKS.find(book=>book.id===id);` }));
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: bank.books[book.id] }) }));
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${book.id}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    await page.locator(`[data-lesson="${lesson.id}"]`).click();
    await page.locator('[data-phase="original"]').click();
    if (lesson.original.mode === "paged") {
      for (let index = 0; index < oldCount; index += 1) {
        await page.locator("[data-original-skip]").click();
        await page.locator('[data-check="original"]').click();
      }
    }
    const card = page.locator(`[data-original-item="${item.id}"]`);
    const board = lesson.original.mode === "paged" ? page.locator(".source-balance-board") : card.locator(".source-balance-board");
    assert.equal(await board.locator(".balance-unit").count(), 3, "The three source balances must remain separate");
    assert.equal(await board.locator(".balance-tokens.labeled i").count(), 8);
    assert.equal(await board.locator(".balance-question").count(), 1);
    const loadOverlaps = await page.locator(".source-balance-board .balance-unit").evaluateAll((nodes) => nodes.filter((node) => {
      const left = node.querySelector(".balance-load.left").getBoundingClientRect();
      const right = node.querySelector(".balance-load.right").getBoundingClientRect();
      return left.right > right.left;
    }).length);
    assert.equal(loadOverlaps, 0, "Objects from opposite pans must not overlap");
    assert.equal(await card.locator(".quiz-item-solution").count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    if (output) await page.locator("#lessonContent").screenshot({ path: path.join(output, `recovered-balance-${width}.png`) });
    await card.locator("input").fill(String(item.privateAnswer));
    const check = lesson.original.mode === "paged" ? page.locator('[data-check="original"]') : card.locator("[data-original-check]");
    await check.click();
    assert.equal(await card.locator(".quiz-item-solution").count(), 1, "The correct answer must open its worked solution");
    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printLessonButton").click();
    const printed = page.locator(`.gold-print-page[data-print-part="original-${approved.printGroup}"]`);
    assert.equal(await printed.count(), 1);
    assert.equal(await printed.locator(".balance-unit").count(), 3);
    assert.equal(await printed.locator(".quiz-item-solution").count(), 0);
    await page.emulateMedia({ media: "print" });
    assert.equal(await printed.evaluate((node) => node.scrollWidth > node.clientWidth + 1), false);
    const clippedBalances = await printed.locator(".source-balance-board .balance-unit").evaluateAll((nodes) => nodes.flatMap((node) => {
      const frame = node.closest(".gold-print-visual").getBoundingClientRect();
      return [node, ...node.querySelectorAll(".balance-stand,.balance-load")].filter((part) => {
        const box = part.getBoundingClientRect();
        return box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1;
      }).map((part) => part.className);
    }));
    assert.deepEqual(clippedBalances, [], "Printed balances and stands must stay inside the visual frame");
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    const pdfPages = (await PDFDocument.load(pdf)).getPageCount();
    assert.equal(pdfPages, await page.locator(".gold-print-page").count(), "No extra or missing PDF pages");
    if (output) {
      await writeFile(path.join(output, `recovered-balance-${width}.pdf`), pdf);
      await printed.screenshot({ path: path.join(output, `recovered-balance-print-${width}.png`) });
    }
    assert.deepEqual(errors, []);
    results.push({ width, sameThreeBalances: true, answerAndSolution: true, printIncluded: true, clippedBalances: 0, pdfPages });
    await page.close();
  }
  if (output) await writeFile(path.join(output, "balance-recovery-audit.json"), JSON.stringify({ scope: "Isolated private candidate, not a public release", itemId: item.id, results }, null, 2));
  console.log(`BALANCE_RECOVERY_BROWSER_OK ${JSON.stringify({ candidates: 1, results, publicDataChanged: false })}`);
} finally {
  await browser.close();
}
