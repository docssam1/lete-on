import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { hydrateProtectedAnswers } from "./golden-bell-protected.js";
import { appendProtectedRecoveryItems } from "./golden-bell-recovery.js";
import { goldenBellPracticeItems } from "./golden-bell-faithful-practice.js";
import { installFaithfulPractice } from "./golden-bell-faithful-protected.js";
import "../../geometry/worksheet/generators.js";
import { sourceAnimationsForLesson } from "./golden-bell-source-animations.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(runtimeModules, "pdf-lib"));
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const requestedBook = process.argv[2] || process.env.GOLDEN_BELL_BOOK || "book-02";
const testCode = process.env.FIELDS_TEST_ACCESS_CODE || "";
const testName = process.env.FIELDS_TEST_STUDENT || "DEMO";
const syntheticFixture = process.env.FIELDS_SYNTHETIC_PRINT_FIXTURE === "1";
const syntheticRecords = (book) => {
  const records = {};
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.answerRef) records[node.answerRef] = { answer: "검사용", solution: "인쇄 구조 검사용 풀이" };
    Object.values(node).forEach(visit);
  };
  visit(book);
  return records;
};
const privateFixture = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"))
  : syntheticFixture
    ? { books: Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [book.id, syntheticRecords(book)])) }
    : null;
if (!testCode && !privateFixture) throw new Error("FIELDS_TEST_ACCESS_CODE or a private FIELDS_PRIVATE_ANSWER_BANK fixture is required");
if (privateFixture) {
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname), "Private answer fixtures may only be used against a local test server");
  for (const book of GOLDEN_BELL_BOOKS) {
    hydrateProtectedAnswers(book, privateFixture.books[book.id]);
    appendProtectedRecoveryItems(book, privateFixture.books[book.id]);
    installFaithfulPractice(book, privateFixture.books[book.id]);
  }
}
const captureDirectory = process.env.FIELDS_CAPTURE_DIR;
if (captureDirectory) await mkdir(captureDirectory, { recursive: true });
const bookIds = requestedBook === "all"
  ? Array.from({ length: 10 }, (_, index) => `book-${String(index + 1).padStart(2, "0")}`)
  : requestedBook.split(",");
assert.ok(bookIds.every((id) => GOLDEN_BELL_BOOKS.some((book) => book.id === id)), "Unknown print audit book");
const viewportWidth = Number(process.env.FIELDS_VIEWPORT_WIDTH || 1440);

function sourceParts(lesson) {
  const concept = lesson.original.separateConceptPrint ? ["concept"] : [];
  if (lesson.original.mode !== "paged" && lesson.original.printMode !== "paged") return [...concept, "original"];
  return [...concept, ...[...new Set(lesson.original.items.map((item) => item.printGroup))].map((group) => `original-${group}`)];
}

function lessonParts(lesson) {
  const vocabulary = lesson.id === "polyomino-family-count" ? ["vocabulary"] : [];
  const animation = sourceAnimationsForLesson(lesson)[0];
  const frameCount = animation ? (animation.printSteps || [0, animation.beats.length - 1]).length : 0;
  const framesPerPage = animation?.conceptExample ? 2 : animation?.family.startsWith("book10-") ? 1 : 2;
  const animationParts = Array.from({ length: animation?.family === "book01-fold" ? sourceAnimationsForLesson(lesson).length : Math.ceil(frameCount / framesPerPage) }, (_, index) => `animation-${index + 1}`);
  const book = GOLDEN_BELL_BOOKS.find((entry) => entry.lessons.includes(lesson));
  const storyParts = goldenBellPracticeItems(lesson, book.id).map((_, index) => `story-${index + 1}`);
  return [...vocabulary, ...animationParts, ...sourceParts(lesson), ...storyParts];
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 1000 } });
  let token = "isolated-print-audit";
  if (privateFixture) {
    await page.route("**/functions/v1/fields-auth", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", route => {
      const { bookId } = route.request().postDataJSON();
      assert.ok(privateFixture.books[bookId], `Missing private print fixture for ${bookId}`);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: privateFixture.books[bookId] }) });
    });
  } else {
    const authResponse = await fetch("https://fgahqumaldheqettmvqg.supabase.co/functions/v1/fields-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: new URL(baseUrl).origin },
      body: JSON.stringify({ action: "login", code: testCode, name: testName })
    });
    const auth = await authResponse.json();
    assert.equal(authResponse.status, 200, `protected print audit login failed: ${auth.error || authResponse.status}`);
    token = auth.token;
  }
  await page.addInitScript(({ token, name }) => {
    sessionStorage.setItem("gfield_fields_session", token);
    sessionStorage.setItem("gf_n", name);
  }, { token, name: testName });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });

  for (const bookId of bookIds) {
    const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === bookId);
    const currentLesson = book.lessons[0];
    await page.emulateMedia({ media: "screen" });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${encodeURIComponent(testName)}&book=${bookId}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printLessonButton").click();
    await page.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4 "), null, { timeout: 120000 });
    assert.equal(await page.locator('.gold-print-page[data-print-part="cover"]').count(), 0, `${bookId}: current learning print must not waste a cover sheet`);
    const expectedLessonParts = lessonParts(currentLesson);
    const expectedLessonPages = await page.locator(".gold-print-page").count();
    assert.ok(expectedLessonPages <= expectedLessonParts.length, `${bookId}: current learning print grew`);
    assert.deepEqual(await page.locator(".gold-print-page").evaluateAll((nodes) => [...new Set(nodes.flatMap((node) => JSON.parse(node.dataset.printParts)))]), expectedLessonParts, `${bookId}: current learning print parts are incomplete`);
    await page.emulateMedia({ media: "print" });
    const lessonPdf = await PDFDocument.load(await page.pdf({ format: "A4", printBackground: true }));
    assert.equal(lessonPdf.getPageCount(), expectedLessonPages, `${bookId}: current learning PDF page count mismatch`);

    await page.emulateMedia({ media: "screen" });
    await page.locator("#printBookButton").click();
    await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled, null, { timeout: 120000 });
    const printStatus = await page.locator("#printStatus").textContent();
    assert.match(printStatus, /^A4 /u, `${bookId}: whole-book print failed: ${printStatus}; ${errors.join(" | ")}`);
    const previousBookPages = 1 + book.lessons.reduce((sum, lesson) => sum + lessonParts(lesson).length, 0);
    const expectedBookPages = await page.locator(".gold-print-page").count();
    assert.ok(expectedBookPages < previousBookPages, `${bookId}: print page count was not reduced`);
    const cover = page.locator('.gold-print-page[data-print-part="cover"]');
    assert.equal(await cover.count(), 1, `${bookId}: book print needs exactly one cover`);
    assert.equal(await page.locator(".gold-print-page").first().getAttribute("data-print-part"), "cover", `${bookId}: cover is not the first page`);
    assert.equal(await cover.locator(".gold-print-cover-concepts li").count(), book.lessons.length, `${bookId}: cover concept index is incomplete`);
    assert.equal(await cover.locator(".gold-print-cover-path li").count(), 4, `${bookId}: cover learning path is incomplete`);
    assert.equal(await cover.locator(".gold-print-cover-meta dd").count(), 2, `${bookId}: cover name or date field is missing`);
    assert.deepEqual(await page.locator('.gold-print-page:not([data-print-part="cover"])').evaluateAll((nodes) => [...new Set(nodes.flatMap((node) => JSON.parse(node.dataset.printParts).map((part) => JSON.stringify([node.dataset.printLesson, part]))))].map((entry) => JSON.parse(entry))), book.lessons.flatMap((lesson) => lessonParts(lesson).map((part) => [lesson.id, part])), `${bookId}: book print order or contents mismatch`);
    for (const lesson of book.lessons) {
      const content = page.locator(`.gold-print-page[data-print-lesson="${lesson.id}"]`);
      const expectedStories = goldenBellPracticeItems(lesson, book.id).length;
      assert.deepEqual(await content.locator(".gold-print-story").evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.storyNumber))), Array.from({ length: expectedStories }, (_, index) => index + 1), `${bookId}/${lesson.id}: additional practice lost or reordered`);
      assert.equal(await content.locator(".gold-print-story .gold-print-item").count(), expectedStories, `${bookId}/${lesson.id}: an answer area is missing`);
      assert.equal(await content.locator(".gold-print-story .gold-print-item > span:not(.gold-print-answer,.gold-print-part-answers,.gold-print-options)").count(), 0, "Duplicated story prompt");
      if (bookId === "book-06") {
        assert.equal(await content.locator(".gold-print-story .gold-print-visual").count(), expectedStories, `${bookId}/${lesson.id}: an additional-practice visual is missing`);
      }
      const expectedSources = lesson.original.visual?.kind === "book03-six-original" ? 0 : lesson.original.items.length;
      assert.equal(await content.locator(".gold-print-source-item").count(), expectedSources, `${bookId}/${lesson.id}: source exercise lost`);
      assert.deepEqual(await content.locator(".gold-print-source-item [data-print-part-id]").evaluateAll((nodes) => nodes.map((node) => node.dataset.printPartId)), lesson.original.items.flatMap((item) => (item.parts || []).map((part) => part.id)), `${bookId}/${lesson.id}: multipart answer order changed`);
    }
    assert.equal(await page.locator('.gold-print-page:not([data-watermark])').count(), 0, `${bookId}: print watermark missing`);
    assert.deepEqual(await page.locator('#goldPrintRoot img').evaluateAll((nodes) => nodes.filter((node) => !node.complete || !node.naturalWidth).map((node) => node.getAttribute('src'))), [], `${bookId}: print image missing or not loaded`);

    await page.emulateMedia({ media: "print" });
    if (bookId === "book-06") {
      const collapsedVisuals = await page.locator('.gold-print-page[data-print-book="book-06"] .gold-print-visual .book06-visual > *').evaluateAll((nodes) => nodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.width < 5 || rect.height < 5;
      }).map((node) => node.outerHTML.slice(0, 120)));
      assert.deepEqual(collapsedVisuals, [], `${bookId}: a print visual collapsed: ${JSON.stringify(collapsedVisuals)}`);
    }
    if (bookId === "book-03") {
      const columns = await page.locator('.gold-print-page[data-print-lesson="basic-vertical-cryptarithm"] .guided-cryptarithm-stack').first().evaluate((stack) => {
        const centerX = (node) => {
          const rect = node.getBoundingClientRect();
          return rect.left + rect.width / 2;
        };
        return {
          addends: [...stack.querySelectorAll(".guided-cryptarithm-addend .guided-cryptarithm-cell")].map(centerX),
          carry: centerX(stack.querySelector(".guided-cryptarithm-carry .guided-cryptarithm-cell")),
          results: [...stack.querySelectorAll(".guided-cryptarithm-result .guided-cryptarithm-cell")].map(centerX),
          plus: centerX([...stack.querySelectorAll(".guided-cryptarithm-addend b")].at(-1))
        };
      });
      const close = (a, b) => Math.abs(a - b) <= 1;
      assert.ok(columns.addends.every((x) => close(x, columns.results[1])), `book-03 print addends are not aligned to the ones column: ${JSON.stringify(columns)}`);
      assert.ok(close(columns.carry, columns.results[0]), `book-03 print carry is not aligned to the tens column: ${JSON.stringify(columns)}`);
      assert.ok(columns.plus < columns.results[0] - 3, `book-03 print plus sign overlaps the tens column: ${JSON.stringify(columns)}`);
    }
    const pageBounds = await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => {
      const pageRect = node.getBoundingClientRect();
      const footer = node.querySelector(":scope > .gold-print-footer");
      const footerTop = footer?.getBoundingClientRect().top ?? pageRect.bottom;
      const contentBottom = Array.from(node.children)
        .filter((child) => !child.classList.contains("gold-print-footer"))
        .reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom), pageRect.top);
      return {
        lesson: node.dataset.printLesson,
        part: node.dataset.printPart,
        pageHeight: Math.round(pageRect.height),
        contentBottom: Math.round(contentBottom - pageRect.top),
        footerTop: Math.round(footerTop - pageRect.top),
        children: Array.from(node.children).map((child) => ({
          className: child.className,
          height: Math.round(child.getBoundingClientRect().height)
        }))
      };
    }));
    if (process.env.GOLDEN_BELL_PRINT_BOUNDS === "1") console.log(`${bookId} ${JSON.stringify(pageBounds)}`);
    const oversized = pageBounds.filter(({ pageHeight }) => pageHeight > 1022);
    assert.deepEqual(oversized, [], `${bookId}: printable page expanded beyond one A4 content sheet: ${JSON.stringify(oversized)}`);
    const overlaps = pageBounds.filter(({ contentBottom, footerTop }) => contentBottom > footerTop - 2);
    assert.deepEqual(overlaps, [], `${bookId}: printable content overlaps the footer: ${JSON.stringify(overlaps)}`);

    const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
    if (captureDirectory) await writeFile(path.join(captureDirectory, `${bookId}-golden-bell.pdf`), pdfBytes);
    if (process.env.GOLDEN_BELL_PDF_PATH && bookIds.length === 1) await writeFile(process.env.GOLDEN_BELL_PDF_PATH, pdfBytes);
    const pdf = await PDFDocument.load(pdfBytes);
    assert.equal(pdf.getPageCount(), expectedBookPages, `${bookId}: physical PDF page count mismatch`);
    const perPage = await page.locator(".gold-print-exercise-grid").evaluateAll((nodes) => nodes.map((node) => node.children.length));
    assert.ok(perPage.some((count) => count >= 2), `${bookId}: still printing only one exercise on each page`);
    if (process.env.FIELDS_PRINT_MODE_AUDIT === "1") {
      await page.emulateMedia({ media: "screen" });
      await page.locator("#coursePrintMode").selectOption("both");
      await page.locator("#printBookButton").click();
      await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled, null, { timeout: 120000 });
      assert.match(await page.locator("#printStatus").textContent(), /^A4 /u, `${bookId}: combined workbook print failed`);
      assert.equal(await page.locator('.gold-print-page[data-print-part="cover"]').count(), 1, `${bookId}: combined workbook cover missing`);
      assert.equal((await page.locator(".gold-print-cover-path li").last().textContent()).replace(/\s+/g, ""), "4답안과풀이", `${bookId}: combined cover does not match its contents`);
      const combinedParts = await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => node.dataset.printPart));
      const answerStart = combinedParts.findIndex((part) => part.startsWith("answers-"));
      assert.ok(answerStart > 0, `${bookId}: combined workbook answers missing`);
      assert.equal(answerStart % 2, 0, `${bookId}: answers must start on an odd-numbered front page`);
      assert.equal(await page.locator(`.gold-print-page:nth-child(-n+${answerStart}) .course-answer-item`).count(), 0, `${bookId}: answers leaked into study pages`);
      const answerOverlaps = await page.locator(".course-answer-item").evaluateAll((items) => items.flatMap((item) => {
        const children = [...item.children].filter((child) => {
          const style = getComputedStyle(child);
          const box = child.getBoundingClientRect();
          return style.display !== "none" && box.width > 0 && box.height > 0;
        }).sort((left, right) => left.getBoundingClientRect().top - right.getBoundingClientRect().top);
        return children.slice(1).flatMap((child, index) => {
          const previous = children[index];
          return child.getBoundingClientRect().top < previous.getBoundingClientRect().bottom - 1
            ? [{ item: item.dataset.answerItem, previous: previous.className || previous.tagName, child: child.className || child.tagName }]
            : [];
        });
      }));
      assert.deepEqual(answerOverlaps, [], `${bookId}: answer sections overlap: ${JSON.stringify(answerOverlaps)}`);
      await page.emulateMedia({ media: "print" });
      const combinedPdf = await PDFDocument.load(await page.pdf({ format: "A4", printBackground: true }));
      assert.equal(combinedPdf.getPageCount(), combinedParts.length, `${bookId}: combined workbook PDF page count mismatch`);

      await page.emulateMedia({ media: "screen" });
      await page.locator("#coursePrintMode").selectOption("answers");
      await page.locator("#printBookButton").click();
      await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled, null, { timeout: 120000 });
      assert.equal(await page.locator('.gold-print-page[data-print-part="cover"]').count(), 0, `${bookId}: answer-only print must not include a cover`);
      assert.ok(await page.locator(".course-answer-item").count() > 0, `${bookId}: answer-only print is empty`);
      assert.equal(await page.locator('.gold-print-page:not([data-print-part^="answers-"])').count(), 0, `${bookId}: answer-only print contains study pages`);

      await page.locator("#coursePrintMode").selectOption("quick");
      await page.locator("#printBookButton").click();
      await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled, null, { timeout: 120000 });
      assert.ok(await page.locator(".course-answer-item").count() > 0, `${bookId}: quick answers are empty`);
      assert.equal(await page.locator(".course-answer-item p,.course-solution-visual").count(), 0, `${bookId}: quick answers include worked solutions`);
    }
    console.log(`GOLDEN_BELL_PRINT_OK book=${bookId} pages=${previousBookPages}->${pdf.getPageCount()} exercisesPerPage=${Math.min(...perPage)}-${Math.max(...perPage)} viewport=${viewportWidth} footerClear=pass auth=${privateFixture ? "isolated-fixture" : "live-session"}`);
  }
  assert.deepEqual(errors, [], `print browser errors: ${errors.join(" | ")}`);
} finally {
  await browser.close();
}
