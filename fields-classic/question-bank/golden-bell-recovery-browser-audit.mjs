import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { GOLDEN_BELL_RECOVERY as RECOVERY_CATALOG } from "./golden-bell-recovery-data.js";
const GOLDEN_BELL_RECOVERY = process.argv[2] ? RECOVERY_CATALOG.filter(group => process.argv[2].split(",").includes(group.bookId)) : RECOVERY_CATALOG;
assert.ok(GOLDEN_BELL_RECOVERY.length, "No recovery books selected");

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname), "Private fixtures are local-only");
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "A private answer fixture is required");
const bank = JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];

async function newPage(width, includeRecovery = true) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem("gfield_fields_session", "isolated-recovery-audit"));
  const oldProgress = Object.fromEntries(GOLDEN_BELL_RECOVERY.map(group => [group.bookId, Object.fromEntries(group.updates.map(update => [update.lessonId, { original: true, extension: true }]))]));
  await page.addInitScript(progress => localStorage.setItem("fields-classic-golden-bell:DEMO", JSON.stringify(progress)), oldProgress);
  await page.route("**/functions/v1/fields-auth", route => route.fulfill({ contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", route => {
    const { bookId } = route.request().postDataJSON();
    const answers = Object.fromEntries(Object.entries(bank.books[bookId]).filter(([ref]) => includeRecovery || !ref.startsWith("/recovery/")));
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers }) });
  });
  return { page, errors };
}

async function openBook(page, bookId) {
  await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${bookId}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  await page.evaluate(() => { window.print = () => {}; });
}

async function openLesson(page, lesson) {
  await page.locator(`[data-lesson="${lesson.id}"]`).click();
  await page.locator('[data-phase="original"]').click();
  if (lesson.original.mode === "paged") {
    const currentId = await page.locator("[data-original-item]").getAttribute("data-original-item");
    assert.ok(!lesson.original.items.some(item => item.id === currentId), "Previously completed learners should start at the first new source question");
  }
}

async function clippedVisualParts(visual) {
  return visual.evaluate(node => {
    const frame = node.getBoundingClientRect();
    return [...node.querySelectorAll("span,b,i,figcaption,svg")].filter(part => {
      const box = part.getBoundingClientRect();
      if (!box.width || !box.height) return false;
      if (box.left < frame.left - 2 || box.right > frame.right + 2 || box.top < frame.top - 2 || box.bottom > frame.bottom + 2) return true;
      for (let parent = part.parentElement; parent && parent !== node; parent = parent.parentElement) {
        const css = getComputedStyle(parent);
        const bound = parent.getBoundingClientRect();
        if (css.overflowX === "hidden" && (box.left < bound.left - 2 || box.right > bound.right + 2)) return true;
        if (css.overflowY === "hidden" && (box.top < bound.top - 2 || box.bottom > bound.bottom + 2)) return true;
      }
      return false;
    }).map(part => {
      const box = part.getBoundingClientRect();
      return { tag: `${part.tagName}.${part.className}`, text: part.textContent, left: box.left - frame.left, right: box.right - frame.left, top: box.top - frame.top, bottom: box.bottom - frame.top, frame: [frame.width, frame.height] };
    });
  });
}

try {
  // An unchanged protected server must keep the original learning usable.
  const baseline = await newPage(1440, false);
  for (const group of GOLDEN_BELL_RECOVERY) {
    await openBook(baseline.page, group.bookId);
    for (const update of group.updates) {
      assert.ok((await baseline.page.locator(`[data-lesson="${update.lessonId}"]`).getAttribute("class")).includes("complete"), "No recovery payload must preserve previous completion");
      await baseline.page.locator(`[data-lesson="${update.lessonId}"]`).click();
      await baseline.page.locator('[data-phase="original"]').click();
      assert.ok(await baseline.page.locator("[data-original-item]").count());
      for (const item of update.items) assert.equal(await baseline.page.locator(`[data-original-item="${item.id}"]`).count(), 0);
      await baseline.page.locator("#printLessonButton").click();
      for (const item of update.items) assert.equal(await baseline.page.locator(`.gold-print-page[data-print-part="original-${item.printGroup}"]`).count(), 0);
    }
  }
  assert.deepEqual(baseline.errors, []);
  await baseline.page.close();

  for (const width of [1440, 390]) {
    const { page, errors } = await newPage(width);
    for (const group of GOLDEN_BELL_RECOVERY) {
      await openBook(page, group.bookId);
      const book = GOLDEN_BELL_BOOKS.find(entry => entry.id === group.bookId);
      for (const update of group.updates) {
        const lesson = book.lessons.find(entry => entry.id === update.lessonId);
        assert.ok(!(await page.locator(`[data-lesson="${lesson.id}"]`).getAttribute("class")).includes("complete"), "Old completion must not silently complete added questions");
        await openLesson(page, lesson);
        for (const item of update.items) {
          const card = page.locator(`[data-original-item="${item.id}"]`);
          const question = lesson.original.mode === "paged" ? page.locator(".source-question-card") : card;
          const record = bank.books[book.id][item.answerRef];
          assert.ok(record?.answer && record.solution.length >= 40);
          await card.waitFor();
          assert.ok((await question.innerText()).includes(item.prompt), `${item.id}: source prompt missing`);
          assert.equal(await card.locator("input").count(), 1, `${item.id}: only the original target is requested`);
          assert.equal(await card.locator(".quiz-item-solution").count(), 0);
          const visual = question.locator(".item-quiz-visual");
          assert.equal(await visual.count(), 1);
          const overflow = await visual.evaluate(node => {
            const frame = node.getBoundingClientRect();
            return { container: node.scrollWidth > node.clientWidth + 2, child: [...node.children].some(child => {
              const box = child.getBoundingClientRect();
              return box.left < frame.left - 2 || box.right > frame.right + 2;
            }) };
          });
          assert.deepEqual(overflow, { container: false, child: false }, `${item.id}: visual clipped at ${width}`);
          assert.deepEqual(await clippedVisualParts(visual), [], `${item.id}: diagram parts clipped at ${width}`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          assert.ok(await card.locator("input").evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 16));
          if (item.visual.subtype === "source-balance-equations") {
            assert.equal(await visual.locator(".balance-unit").count(), 3);
            assert.equal(await visual.locator(".balance-tokens.labeled i").count(), 8);
            assert.equal(await visual.locator(".balance-question").count(), 1);
          }
          if (item.visual.sourceLayout && item.visual.subtype === "exchange") {
            assert.equal(await visual.locator(".b7-coupon-grid>span").count(), item.visual.rate);
            assert.equal(await visual.locator(".b7-exchange-reward").innerText(), item.visual.rewardLabel);
          }
          if (item.visual.subtype === "source-sum-matrix") {
            const matrix = visual.locator(".b8-source-sum-matrix");
            assert.equal(await matrix.locator(".cells>span").count(), 16);
            assert.deepEqual(await matrix.locator(".rows>b").allTextContents(), item.visual.rowTotals.map(String));
            assert.deepEqual(await matrix.locator(".columns>b").allTextContents(), item.visual.columnTotals.map(value => value === null ? "?" : String(value)));
            assert.equal(await matrix.locator(".target").count(), 1);
            const positions = await matrix.evaluate(node => {
              const cells = node.querySelector(".cells").getBoundingClientRect();
              const rows = node.querySelector(".rows").getBoundingClientRect();
              const columns = node.querySelector(".columns").getBoundingClientRect();
              return { right: rows.left >= cells.right, below: columns.top >= cells.bottom };
            });
            assert.deepEqual(positions, { right: true, below: true });
          }
          if (item.visual.subtype === "source-weight-scales") {
            assert.equal(await visual.locator(".source-weight-scale").count(), 2);
            for (let index = 0; index < 2; index += 1) {
              const scale = visual.locator(".source-weight-scale").nth(index);
              assert.equal(await scale.locator(".weight-item").count(), item.visual.scales[index].rows.flat().length);
              assert.ok((await scale.locator("figcaption").innerText()).includes(item.visual.scales[index].total));
            }
          }
          if (output) await question.screenshot({ path: path.join(output, `${book.id}-${item.id}-${width}.png`) });
          const check = lesson.original.mode === "paged" ? page.locator('[data-check="original"]') : card.locator("[data-original-check]");
          await card.locator("input").fill(String(Number(record.answer) + 1));
          await check.click();
          assert.ok((await card.getAttribute("class")).includes("incorrect"), `${item.id}: wrong answer accepted`);
          assert.equal(await card.locator(".quiz-item-solution").count(), 0);
          await card.locator("input").fill(String(record.answer));
          await check.click();
          assert.ok((await card.getAttribute("class")).includes("correct"), `${item.id}: correct answer rejected`);
          assert.ok((await card.locator(".quiz-item-solution").innerText()).includes(record.solution), `${item.id}: full worked solution absent`);
          if (output) await card.locator(".quiz-item-solution").screenshot({ path: path.join(output, `${book.id}-${item.id}-solution-${width}.png`) });
          if (lesson.original.mode === "paged") await check.click();
        }
        await page.locator("#printLessonButton").click();
        await page.evaluate(async () => { await document.fonts.ready; });
        const extraCount = 1 + (lesson.similarPractice || []).length;
        assert.equal(await page.locator('.gold-print-page[data-print-part^="story-"]').count(), extraCount, "Extra practice must remain in current lesson printing");
        await page.emulateMedia({ media: "print" });
        const bounds = await page.locator(".gold-print-page").evaluateAll(nodes => nodes.map(node => {
          const frame = node.getBoundingClientRect();
          const footer = node.querySelector(":scope > .gold-print-footer").getBoundingClientRect();
          const bottom = Math.max(...[...node.children].filter(child => !child.classList.contains("gold-print-footer")).map(child => child.getBoundingClientRect().bottom));
          return { part: node.dataset.printPart, height: frame.height, footerClear: bottom < footer.top - 1, overflow: node.scrollWidth > node.clientWidth + 2, watermark: Boolean(node.dataset.watermark) };
        }));
        assert.deepEqual(bounds.filter(bound => bound.height > 1022 || !bound.footerClear || bound.overflow || !bound.watermark), [], `${lesson.id}: A4 bounds or watermark failure`);
        for (const item of update.items) {
          const printed = page.locator(`.gold-print-page[data-print-part="original-${item.printGroup}"]`);
          assert.equal(await printed.count(), 1);
          assert.ok((await printed.innerText()).includes(item.prompt));
          assert.equal(await printed.locator(".gold-print-answer").count(), 1);
          assert.ok(await printed.locator(".gold-print-source-item>p").evaluate(node => parseFloat(getComputedStyle(node).fontSize) >= 16), "Printed recovery question text must be at least 12pt");
          assert.equal(await printed.locator(".quiz-item-solution").count(), 0);
          assert.ok(await printed.evaluate(node => Number(getComputedStyle(node, "::after").zIndex) >= 2), "Watermark must not be hidden behind an opaque diagram");
          assert.deepEqual(await clippedVisualParts(printed.locator(".gold-print-visual")), [], `${item.id}: printed diagram parts clipped`);
          assert.ok(!(await printed.innerText()).includes(bank.books[book.id][item.answerRef].solution));
          if (output && width === 1440) await printed.screenshot({ path: path.join(output, `${book.id}-${item.id}-print.png`) });
        }
        const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
        const pdfPages = (await PDFDocument.load(pdfBytes)).getPageCount();
        assert.equal(pdfPages, bounds.length, "No extra or missing physical PDF pages");
        if (output && width === 1440) await writeFile(path.join(output, `${book.id}-${lesson.id}.pdf`), pdfBytes);
        const newPdfPages = update.items.map(item => ({ id: item.id, page: bounds.findIndex(bound => bound.part === `original-${item.printGroup}`) + 1 }));
        results.push({ book: book.id, lesson: lesson.id, width, newItems: update.items.length, extraCount, pdfPages, newPdfPages, bounds });
        await page.emulateMedia({ media: "screen" });
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  if (output) await writeFile(path.join(output, "recovery-browser-audit.json"), JSON.stringify({ scope: "Local protected-response fixture; not server publication", results }, null, 2));
  console.log(`GOLDEN_BELL_RECOVERY_BROWSER_OK ${JSON.stringify({ books: GOLDEN_BELL_RECOVERY.length, results: results.map(({ bounds, ...result }) => result), baselineFallback: "pass" })}`);
} finally {
  await browser.close();
}
