import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { goldenBellPrintUnits } from "./golden-bell-print-units.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Private fixtures are local-only");
const output = process.env.FIELDS_CAPTURE_DIR;
assert.ok(output && process.env.FIELDS_PRIVATE_ANSWER_BANK);
await fs.mkdir(output, { recursive: true });
const bank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const report = { viewports: [], prints: [], protection: [], covers: [] };
const book = GOLDEN_BELL_BOOKS.find((item) => item.id === "book-01");
const normalize = (value) => value.replace(/\s/gu, "");
const unitKeys = [...new Set(book.lessons.map((lesson) => normalize(lesson.unit)))];
assert.equal(unitKeys.length, 4);
for (const candidate of GOLDEN_BELL_BOOKS.filter((item) => item.lessons.length)) {
  const groups = goldenBellPrintUnits(candidate);
  const grouped = groups.flatMap((group) => group.lessons.map((lesson) => lesson.id));
  assert.equal(new Set(grouped).size, candidate.lessons.length, `${candidate.id}: each lesson must belong to exactly one print range`);
  assert.equal(grouped.length, candidate.lessons.length);
  assert.ok(groups.every((group) => group.number === null || group.number <= 4), `${candidate.id}: detailed types must not become fictitious units`);
}
const book4Units = goldenBellPrintUnits(GOLDEN_BELL_BOOKS.find((item) => item.id === "book-04"));
assert.deepEqual(book4Units.filter((group) => group.number).map((group) => group.number), [1, 2, 3, 4]);
assert.deepEqual(book4Units.find((group) => group.number === 2).lessons.map((lesson) => lesson.id), ["hidden-cube-count", "fold-hole-count", "cube-box-fill"]);
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: bank.books["book-01"] }) }));
    await page.addInitScript(() => { sessionStorage.setItem("gfield_fields_session", "fc-print-test-fixture"); window.print = () => { window.fcPrintCalls = (window.fcPrintCalls || 0) + 1; }; });
    await page.addInitScript(() => window.addEventListener("DOMContentLoaded", () => { const qr = document.getElementById("printGameQR"); if (qr) qr.checked = false; }));
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    assert.equal(await page.title(), "FC 골든벨 학습");
    assert.match(await page.locator("#courseBrand").innerText(), /^FC/u);
    const dialog = page.locator("#coverDialog");
    const open = async () => { await page.locator("#printSelectedButton").click(); assert.equal(await dialog.isVisible(), true); };
    const choose = async (keys) => {
      await dialog.locator("#printUnitsNone").click();
      for (const key of keys) await dialog.locator(`[data-print-unit="${key}"]`).check();
    };
    await open();
    assert.equal(await dialog.locator("[data-print-unit]").count(), 4);
    assert.equal(await dialog.locator("[data-print-unit]:checked").count(), 1);
    await dialog.locator("#printUnitsNone").click();
    assert.equal(await dialog.locator("#printSelectionApply").isDisabled(), true);
    assert.match(await dialog.locator("#printSelectionStatus").innerText(), /선택한 단원이 없습니다/u);
    assert.equal(await page.evaluate(() => window.fcPrintCalls || 0), 0);
    await dialog.locator("#printUnitsAll").click();
    assert.equal(await dialog.locator("[data-print-unit]:checked").count(), 4);
    assert.equal(await dialog.locator("[data-cover-lesson]").count(), book.lessons.length);
    await page.keyboard.press("Escape");
    await open();
    assert.equal(await dialog.locator("[data-print-unit]:checked").count(), 1, "Cancelled unit changes must not persist");
    await choose([unitKeys[0]]);
    await dialog.locator('[name="coverStyle"][value="simple"]').check();
    await dialog.locator("#printIncludeAnswers").uncheck();
    await page.waitForTimeout(120);
    await dialog.screenshot({ path: path.join(output, `selected-dialog-${width}.png`) });
    assert.equal(await dialog.evaluate((node) => node.scrollWidth > node.clientWidth + 1), false);
    const cases = width === 1440
      ? [{ keys: [unitKeys[0]], style: "simple", mode: "study" }, { keys: [unitKeys[1], unitKeys[3]], style: "concept", mode: "both" }, { keys: [unitKeys[3]], style: "none", mode: "both" }, { keys: [unitKeys[0]], style: "concept", mode: "answers" }, { keys: [unitKeys[1]], style: "none", mode: "quick" }]
      : [{ keys: [unitKeys[1], unitKeys[3]], style: "concept", mode: "study" }];
    for (let index = 0; index < cases.length; index++) {
      const test = cases[index];
      if (index) {
        await page.selectOption("#coursePrintMode", test.mode);
        await open();
      }
      await choose(test.keys);
      if (["study", "both"].includes(test.mode)) {
        await dialog.locator('[name="coverStyle"][value="' + test.style + '"]').check();
        await dialog.locator("#printIncludeAnswers").setChecked(test.mode === "both");
      } else {
        assert.equal(await dialog.locator("#printAnswerFieldset").isVisible(), false);
        assert.equal(await dialog.locator('[name="coverStyle"]').first().isDisabled(), true);
      }
      const expected = book.lessons.filter((lesson) => test.keys.includes(normalize(lesson.unit))).map((lesson) => lesson.id);
      const hasCover = ["study", "both"].includes(test.mode) && test.style !== "none";
      assert.deepEqual(await dialog.locator("[data-cover-lesson]").evaluateAll((nodes) => nodes.map((node) => node.dataset.coverLesson)), hasCover ? expected : []);
      await dialog.locator("#printSelectionApply").click();
      await page.waitForFunction(() => !document.getElementById("coverDialog").open);
      const root = page.locator("#goldPrintRoot");
      const records = await root.locator(":scope > article").evaluateAll((nodes) => nodes.map((node) => ({ lesson: node.dataset.printLesson, part: node.dataset.printPart, watermark: node.dataset.watermark })));
      assert.deepEqual([...new Set(records.filter((node) => !["book-cover", "duplex-blank"].includes(node.lesson)).map((node) => node.lesson))], expected);
      assert.equal(records.filter((node) => node.part === "cover").length, hasCover ? 1 : 0);
      assert.equal(records.some((node) => node.part.startsWith("answers-")), test.mode !== "study");
      assert.ok(records.every((node) => node.part === "duplex-blank" || node.watermark?.includes("GFIELD")));
      if (test.mode === "both") assert.equal(records.findIndex((node) => node.part.startsWith("answers-")) % 2, 0);
      if (["answers", "quick"].includes(test.mode)) assert.equal(records.some((node) => node.part === "duplex-blank"), false);
      assert.doesNotMatch(await root.innerText(), /FIELDS CLASSIC|필즈 더 클래식/u);
      if (hasCover) {
        assert.equal(await root.locator(".gold-cover-art").evaluate((img) => img.complete && img.naturalWidth > 0), true);
        assert.match(await root.locator(".gold-print-cover-range").innerText(), test.mode === "both" ? /답안과 풀이 포함/u : /답안 제외/u);
      }
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ path: path.join(output, `selected-${width}-${index}-${test.mode}.pdf`), format: "A4", printBackground: true });
      assert.equal((await PDFDocument.load(pdf)).getPageCount(), records.length);
      if (hasCover) {
        assert.equal(await root.locator(".gold-print-cover").evaluate((node) => {
          const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
          return [...node.querySelectorAll(".gold-print-cover-concepts li")].every((row) => row.getBoundingClientRect().bottom < footer.top);
        }), true);
        await root.locator(".gold-print-cover").screenshot({ path: path.join(output, `selected-cover-${width}-${index}.png`) });
      }
      report.prints.push({ width, ...test, lessons: expected, pages: records.length, answerPage: records.findIndex((node) => node.part.startsWith("answers-")) + 1 });
      await page.emulateMedia({ media: "screen" });
    }
    await page.selectOption("#coursePrintMode", "study");
    await open();
    assert.deepEqual(await dialog.locator("[data-print-unit]:checked").evaluateAll((nodes) => nodes.map((node) => node.dataset.printUnit)), cases.at(-1).keys);
    await page.keyboard.press("Escape");
    if (width === 1440) {
      await page.selectOption("#coursePrintMode", "study");
      await open();
      await choose([unitKeys[0]]);
      await dialog.locator('[name="coverStyle"][value="concept"]').check();
      const calls = await page.evaluate(() => window.fcPrintCalls);
      await page.evaluate(() => {
        window.fcOriginalDecode = HTMLImageElement.prototype.decode;
        HTMLImageElement.prototype.decode = function () {
          return this.closest("#goldPrintRoot") ? Promise.reject(new Error("Simulated unavailable print image")) : window.fcOriginalDecode.call(this);
        };
      });
      await dialog.locator("#printSelectionApply").click();
      await page.waitForFunction(() => document.getElementById("printStatus").textContent.includes("준비하지 못했습니다"));
      assert.equal(await page.evaluate(() => window.fcPrintCalls), calls, "Failed image preparation must not print");
      assert.equal(await page.locator("#goldPrintRoot > article").count(), 0);
      assert.equal(await dialog.isVisible(), true);
      assert.equal(await dialog.locator("[data-print-unit]:checked").count(), 1);
      await page.evaluate(() => { HTMLImageElement.prototype.decode = window.fcOriginalDecode; });
      await page.keyboard.press("Escape");
      report.protection.push({ failedImageBlocked: true, selectionRetained: true });
    }
    assert.deepEqual(errors, []);
    report.viewports.push(width);
    await page.close();
  }

  const locked = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  await locked.addInitScript(() => { window.print = () => { window.fcPrintCalls = (window.fcPrintCalls || 0) + 1; }; });
  await locked.addInitScript(() => window.addEventListener("DOMContentLoaded", () => { const qr = document.getElementById("printGameQR"); if (qr) qr.checked = false; }));
  await locked.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-01`, { waitUntil: "networkidle" });
  await locked.locator("#printSelectedButton").click();
  await locked.locator("#printIncludeAnswers").check();
  assert.equal(await locked.locator("#printSelectionApply").isDisabled(), true);
  assert.match(await locked.locator("#printSelectionStatus").innerText(), /불러온 뒤/u);
  assert.equal(await locked.locator("#goldPrintRoot").innerText(), "");
  await locked.locator("#printIncludeAnswers").uncheck();
  assert.equal(await locked.locator("#printSelectionApply").isDisabled(), false);
  await locked.locator("#coverDialogClose").click();
  report.protection.push({ answerPrintBlocked: true, studyStillAvailable: true });
  await locked.close();

  const crowded = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await crowded.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-02`, { waitUntil: "networkidle" });
  for (const style of ["concept", "simple"]) {
    await crowded.locator("#printCoverButton").click();
    await crowded.locator(`[name="coverStyle"][value="${style}"]`).check();
    assert.equal(await crowded.locator("#coverPreview [data-cover-lesson]").count(), 18);
    await crowded.evaluate(() => {
      const root = document.getElementById("goldPrintRoot");
      root.replaceChildren(document.querySelector("#coverPreview .gold-print-cover").cloneNode(true));
      root.setAttribute("aria-hidden", "false");
      document.getElementById("coverDialog").close();
    });
    await crowded.emulateMedia({ media: "print" });
    const pdf = await crowded.pdf({ path: path.join(output, `book02-${style}-cover.pdf`), format: "A4", printBackground: false });
    assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1);
    const fits = await crowded.locator("#goldPrintRoot .gold-print-cover").evaluate((node) => {
      const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
      return [...node.querySelectorAll(".gold-print-cover-concepts li")].every((row) => row.getBoundingClientRect().bottom < footer.top);
    });
    assert.equal(fits, true);
    await crowded.locator("#goldPrintRoot .gold-print-cover").screenshot({ path: path.join(output, `book02-${style}-cover.png`) });
    report.covers.push({ book: "book-02", style, concepts: 18, pages: 1, backgroundPrintingNotRequired: true });
    await crowded.emulateMedia({ media: "screen" });
  }
  await crowded.close();

  const allCovers = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const candidate of GOLDEN_BELL_BOOKS.filter((item) => item.lessons.length)) {
    await allCovers.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&course=${candidate.courseId}&book=${candidate.id}`, { waitUntil: "networkidle" });
    await allCovers.locator("#printCoverButton").click();
    await allCovers.locator('[name="coverStyle"][value="concept"]').check();
    assert.equal(await allCovers.locator("#coverPreview [data-cover-lesson]").count(), candidate.lessons.length);
    await allCovers.evaluate(() => {
      const root = document.getElementById("goldPrintRoot");
      root.replaceChildren(document.querySelector("#coverPreview .gold-print-cover").cloneNode(true));
      root.setAttribute("aria-hidden", "false");
      document.getElementById("coverDialog").close();
    });
    await allCovers.emulateMedia({ media: "print" });
    const pdf = await allCovers.pdf({ path: path.join(output, `${candidate.id}-all-cover.pdf`), format: "A4", printBackground: true });
    assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1);
    assert.equal(await allCovers.locator("#goldPrintRoot .gold-print-cover").evaluate((node) => {
      const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
      return [...node.querySelectorAll(".gold-print-cover-concepts li")].every((row) => row.getBoundingClientRect().bottom < footer.top);
    }), true, `${candidate.id}: cover content must clear the footer`);
    report.covers.push({ book: candidate.id, style: "concept", concepts: candidate.lessons.length, pages: 1 });
    await allCovers.emulateMedia({ media: "screen" });
  }
  await allCovers.close();
} finally { await browser.close(); }
await fs.writeFile(path.join(output, "selected-print-audit.json"), JSON.stringify(report, null, 2));
console.log(`FC_SELECTED_PRINT_OK viewports=${report.viewports.length} prints=${report.prints.length} covers=${report.covers.length}`);
