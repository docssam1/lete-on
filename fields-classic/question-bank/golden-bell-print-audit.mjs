import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { hydrateProtectedAnswers } from "./golden-bell-protected.js";
import { appendProtectedRecoveryItems } from "./golden-bell-recovery.js";
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
const privateFixture = process.env.FIELDS_PRIVATE_ANSWER_BANK
  ? JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8")) : null;
if (!testCode && !privateFixture) throw new Error("FIELDS_TEST_ACCESS_CODE or a private FIELDS_PRIVATE_ANSWER_BANK fixture is required");
if (privateFixture) {
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname), "Private answer fixtures may only be used against a local test server");
  for (const book of GOLDEN_BELL_BOOKS) {
    hydrateProtectedAnswers(book, privateFixture.books[book.id]);
    appendProtectedRecoveryItems(book, privateFixture.books[book.id]);
  }
}
const captureDirectory = process.env.FIELDS_CAPTURE_DIR;
if (captureDirectory) await mkdir(captureDirectory, { recursive: true });
const bookIds = requestedBook === "all"
  ? Array.from({ length: 10 }, (_, index) => `book-${String(index + 1).padStart(2, "0")}`)
  : requestedBook.split(",");
assert.ok(bookIds.every((id) => GOLDEN_BELL_BOOKS.some((book) => book.id === id)), "Unknown print audit book");

function sourceParts(lesson) {
  const concept = lesson.original.separateConceptPrint ? ["concept"] : [];
  if (lesson.original.mode !== "paged" && lesson.original.printMode !== "paged") return [...concept, "original"];
  return [...concept, ...[...new Set(lesson.original.items.map((item) => item.printGroup))].map((group) => `original-${group}`)];
}

function lessonParts(lesson) {
  const vocabulary = lesson.id === "polyomino-family-count" ? ["vocabulary"] : [];
  const animation = sourceAnimationsForLesson(lesson)[0];
  const frameCount = animation ? (animation.printSteps || [0, animation.beats.length - 1]).length : 0;
  const framesPerPage = animation?.family.startsWith("book10-") ? 1 : 2;
  const animationParts = Array.from({ length: Math.ceil(frameCount / framesPerPage) }, (_, index) => `animation-${index + 1}`);
  const storyParts = Array.from({ length: 1 + (lesson.similarPractice || []).length }, (_, index) => `story-${index + 1}`);
  return [...vocabulary, ...animationParts, ...sourceParts(lesson), ...storyParts];
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
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
    await page.waitForTimeout(100);
    const expectedLessonParts = lessonParts(currentLesson);
    const expectedLessonPages = expectedLessonParts.length;
    assert.equal(await page.locator(".gold-print-page").count(), expectedLessonPages, `${bookId}: current learning print page count mismatch`);
    assert.deepEqual(await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => node.dataset.printPart)), expectedLessonParts, `${bookId}: current learning print parts are incomplete`);
    await page.emulateMedia({ media: "print" });
    const lessonPdf = await PDFDocument.load(await page.pdf({ format: "A4", printBackground: true }));
    assert.equal(lessonPdf.getPageCount(), expectedLessonPages, `${bookId}: current learning PDF page count mismatch`);

    await page.emulateMedia({ media: "screen" });
    await page.locator("#printBookButton").click();
    await page.waitForTimeout(100);
    const expectedBookPages = book.lessons.reduce((sum, lesson) => sum + lessonParts(lesson).length, 0);
    assert.equal(await page.locator(".gold-print-page").count(), expectedBookPages, `${bookId}: print DOM page count mismatch`);
    assert.deepEqual(await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => [node.dataset.printLesson, node.dataset.printPart])), book.lessons.flatMap((lesson) => lessonParts(lesson).map((part) => [lesson.id, part])), `${bookId}: book print order or contents mismatch`);
    assert.equal(await page.locator('.gold-print-page:not([data-watermark])').count(), 0, `${bookId}: print watermark missing`);
    assert.deepEqual(await page.locator('#goldPrintRoot img').evaluateAll((nodes) => nodes.filter((node) => !node.complete || !node.naturalWidth).map((node) => node.getAttribute('src'))), [], `${bookId}: print image missing or not loaded`);

    await page.emulateMedia({ media: "print" });
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
    console.log(`GOLDEN_BELL_PRINT_OK book=${bookId} pages=${pdf.getPageCount()} footerClear=pass auth=${privateFixture ? "isolated-fixture" : "live-session"}`);
  }
  assert.deepEqual(errors, [], `print browser errors: ${errors.join(" | ")}`);
} finally {
  await browser.close();
}
