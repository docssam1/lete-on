import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { goldenBellPrintUnits } from "./golden-bell-print-units.js";
import { HANDS_ON_ACTIVITIES, unitForLesson } from "./golden-bell-hands-on-models.js";
import { issueFieldsGameCapability, resolveFieldsGameCapability } from "../../supabase/functions/_shared/fields-game-capability.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const require = createRequire(import.meta.url);
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = require(path.join(modules, "pdf-lib"));
const { PNG } = require(path.join(modules, "pngjs"));
const sharp = require(path.join(modules, "sharp"));
const jsQR = require(process.env.FIELDS_QR_DECODER);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8798";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Private fixtures must stay local");
const output = path.resolve(process.env.FIELDS_CAPTURE_DIR || "");
assert.match(output, /^E:[\\/]/iu, "Evidence must be on E:");
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK);
await fs.mkdir(output, { recursive: true });
const bank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const secret = "local-cover-audit-only-no-production-credential";
const session = "a".repeat(64);
const issued = new Map();
for (const id of Object.keys(HANDS_ON_ACTIVITIES)) issued.set(id, await issueFieldsGameCapability(secret, id));
const book1 = GOLDEN_BELL_BOOKS.find((b) => b.id === "book-01");
const unit1 = goldenBellPrintUnits(book1).find((u) => u.number === 1);
assert.ok(unit1);
const allGames = Object.keys(HANDS_ON_ACTIVITIES).sort();
const firstGames = ["mirror-tiles", "turn-clock"];
const onlyCases = new Set((process.env.FIELDS_COVER_AUDIT_CASES || "").split(",").map((s) => s.trim()).filter(Boolean));
const report = { startedAt: new Date().toISOString(), base, selectedCases: [...onlyCases], cases: [], prints: [], previews: [], qrDecodes: [], failures: [], pageErrors: [] };
const browser = await chromium.launch({ headless: true });

async function check(name, operation) {
  if (onlyCases.size && !onlyCases.has(name)) return;
  try { await operation(); report.cases.push({ name, passed: true }); console.log(`PASS ${name}`); }
  catch (error) {
    report.cases.push({ name, passed: false });
    report.failures.push({ name, message: error.message, stack: error.stack });
    console.error(`FAIL ${name}: ${error.message}`);
  }
  await fs.writeFile(path.join(output, "cover-games-audit.json"), JSON.stringify(report, null, 2));
}

async function openPage(width = 1440, bookId = "book-01", failure = "") {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 3 });
  page.setDefaultTimeout(15000);
  const state = { issues: [], requests: [], consoleErrors: [] };
  page.on("pageerror", (e) => report.pageErrors.push({ width, bookId, message: e.message }));
  page.on("console", (msg) => { if (msg.type() === "error") state.consoleErrors.push(msg.text()); });
  page.on("request", (r) => state.requests.push(r.url()));
  await page.route("**/functions/v1/fields-auth", (r) => r.fulfill({ contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: bank.books[bookId] }) }));
  await page.route("**/functions/v1/fields-game-link", async (route) => {
    const body = route.request().postDataJSON();
    if (body.action === "issue") {
      state.issues.push(body.activities);
      assert.equal(route.request().headers()["x-fields-session"], session);
      let links = body.activities.map((id) => issued.get(id));
      if (failure === "incomplete") links = links.slice(1);
      if (failure === "wrong-game") links = links.map(() => issued.get("fold-once"));
      await route.fulfill({ status: failure === "service" ? 503 : 200, contentType: "application/json", body: JSON.stringify(failure === "service" ? { error: "service_unavailable" } : { links }) });
    } else {
      assert.equal(route.request().headers()["x-fields-session"], undefined);
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(await resolveFieldsGameCapability(secret, body.token)) });
    }
  });
  await page.addInitScript((token) => {
    sessionStorage.setItem("gfield_fields_session", token);
    localStorage.setItem("fields-classic-golden-bell-print-cover", "concept");
    window.coverAuditPrints = 0;
    window.print = () => { window.coverAuditPrints++; };
  }, session);
  await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${bookId}`, { waitUntil: "networkidle" });
  await page.locator("#lessonList button[data-lesson]").first().waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector("#lessonList .lesson-button.active") && !document.querySelector("#printSelectedButton").disabled && !document.querySelector("#printBookButton").disabled);
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  return { page, state };
}

async function selectFirst(page, { style = "concept", mode = "study" } = {}) {
  await page.selectOption("#coursePrintMode", mode);
  await page.locator("#printSelectedButton").click();
  await page.locator("#printUnitsNone").click();
  await page.locator(`[data-print-unit="${unit1.key}"]`).check();
  if (["study", "both"].includes(mode)) await page.locator("#printIncludeAnswers").setChecked(mode === "both");
  if (["study", "both"].includes(mode)) await page.locator(`[name=coverStyle][value=${style}]`).check();
}

async function verifyCover(page, selector, lessons, expected, placeholders) {
  const cover = page.locator(selector);
  const rows = await cover.locator("[data-cover-lesson]").evaluateAll((nodes) => nodes.map((n) => ({ id: n.dataset.coverLesson, title: n.querySelector("strong").textContent, concept: n.querySelector("p").textContent, unit: n.querySelector("small").textContent })));
  assert.deepEqual(rows, lessons.map((l) => ({ id: l.id, title: l.title, concept: l.representativeConcept, unit: l.unit })), "Old concept rows must be preserved exactly");
  const games = await cover.locator("[data-cover-game]").evaluateAll((nodes) => nodes.map((n) => ({ id: n.dataset.coverGame, title: n.querySelector("strong").textContent, label: n.querySelector(".gold-cover-game-unit").textContent })));
  assert.deepEqual(games.map((g) => g.id).sort(), expected);
  assert.equal(new Set(games.map((g) => g.id)).size, expected.length);
  for (const game of games) {
    assert.equal(game.title, HANDS_ON_ACTIVITIES[game.id].title);
    const unit = goldenBellPrintUnits(book1).find((u) => u.lessons.some((l) => lessons.includes(l) && unitForLesson(book1.id, l.id)?.activities.includes(game.id)));
    assert.equal(game.label, unit.label, `${game.id}: correct selected-unit label`);
  }
  assert.equal(await cover.locator(".gold-cover-qr-placeholder").count(), placeholders ? expected.length : 0);
  assert.equal(await cover.locator("[data-print-game]").count(), placeholders ? 0 : expected.length);
}

async function waitPrint(page, state) {
  await page.waitForFunction(() => !document.querySelector("#printGameQR").disabled);
  const status = await page.locator("#printStatus").innerText();
  assert.match(status, /^A4/u, `${status}; ${state.consoleErrors.join(" | ")}`);
  assert.equal(await page.evaluate(() => window.coverAuditPrints), 1);
}

async function savePrint(page, state, name, { games = [], lessons = unit1.lessons, cover = true, style = "concept", decode = false, duplex = false } = {}) {
  await waitPrint(page, state);
  const root = page.locator("#goldPrintRoot");
  assert.equal(await root.locator(".gold-print-cover").count(), cover ? 1 : 0);
  assert.equal(await root.locator(".gold-cover-qr-placeholder").count(), 0, "Placeholders must never print");
  const coverGames = cover ? games : [];
  if (cover) {
    await verifyCover(page, "#goldPrintRoot .gold-print-cover", lessons, coverGames, false);
    assert.equal(await root.locator(".gold-print-cover").getAttribute("data-cover-style"), style);
    assert.equal(await root.locator(".gold-cover-art").evaluate((img) => img.complete && img.naturalWidth > 0), true);
  }
  const links = await root.locator("[data-print-game]").evaluateAll((nodes) => nodes.map((n) => ({ id: n.dataset.printGame, href: n.href, cover: !!n.closest(".gold-print-cover") })));
  assert.deepEqual([...new Set(links.filter((l) => !l.cover).map((l) => l.id))].sort(), games);
  for (const id of games) {
    const matching = links.filter((l) => l.id === id);
    assert.equal(new Set(matching.map((l) => l.href)).size, 1, "Cover and footer must reuse the same issued href");
    const url = new URL(matching[0].href);
    assert.equal(url.origin, "https://lete-on.gfieldacademy.net", "QR uses the canonical game-only destination, even in local print fixtures");
    assert.equal(url.pathname, "/fields-classic/question-bank/game.html");
    assert.equal(url.search, "");
    const capability = await resolveFieldsGameCapability(secret, url.hash.slice(1));
    assert.equal(capability.activityId, id);
  }
  assert.equal(await root.locator('[data-print-part^="answers-"] [data-print-game],.gold-print-duplex-blank [data-print-game]').count(), 0);
  const parts = await root.locator(":scope > article").evaluateAll((nodes) => nodes.map((n) => n.dataset.printPart));
  if (duplex) {
    const firstAnswer = parts.findIndex((p) => p.startsWith("answers-"));
    assert.ok(firstAnswer > 0);
    assert.equal(firstAnswer % 2, 0, "Answers must begin on a new front side");
  }
  await page.emulateMedia({ media: "print" });
  const geometry = await root.locator(":scope > article").evaluateAll((pages) => {
    const issues = [];
    const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
    for (const [index, page] of pages.entries()) {
      const p = page.getBoundingClientRect(), footer = page.querySelector(":scope > .gold-print-footer").getBoundingClientRect();
      // Descendant checks catch overflowing nested lists missed by top-level measurements.
      for (const n of page.querySelectorAll("header,section,h1,h2,p,li,strong,small,[data-cover-lesson],.gold-cover-game-unit,.gold-cover-game-code,.gold-print-qr-image,.gold-cover-game-expiry")) {
        if (n.closest(".gold-print-footer")) continue;
        const r = n.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left < p.left - 1 || r.right > p.right + 1 || r.top < p.top - 1 || r.bottom > footer.top - 7) issues.push({ index, part: page.dataset.printPart, selector: n.className || n.tagName, problem: "page/footer clipping", box: { left: r.left - p.left, top: r.top - p.top, width: r.width, height: r.height }, footerTop: footer.top - p.top });
      }
      for (const item of page.querySelectorAll("[data-cover-game]")) {
        const code = item.querySelector(".gold-cover-game-code").getBoundingClientRect();
        for (const label of item.querySelectorAll("strong,.gold-cover-game-unit")) {
          const r = label.getBoundingClientRect();
          if (overlaps(code, r)) issues.push({ index, id: item.dataset.coverGame, problem: "QR overlaps label" });
          if (label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1) issues.push({ index, id: item.dataset.coverGame, problem: "game label clipped" });
          const range = document.createRange();
          range.selectNodeContents(label);
          for (const text of range.getClientRects()) if (text.left < r.left - 1 || text.right > r.right + 1 || text.top < r.top - 1 || text.bottom > r.bottom + 1) issues.push({ index, id: item.dataset.coverGame, problem: "game label text outside box" });
        }
      }
      const section = page.querySelector(".gold-cover-games");
      if (section) for (const row of page.querySelectorAll("[data-cover-lesson]")) if (overlaps(row.getBoundingClientRect(), section.getBoundingClientRect())) issues.push({ index, id: row.dataset.coverLesson, problem: "concept overlaps games" });
      const codes = [...page.querySelectorAll(".gold-cover-game-code")];
      codes.forEach((a, i) => codes.slice(i + 1).forEach((b) => { if (overlaps(a.getBoundingClientRect(), b.getBoundingClientRect())) issues.push({ index, problem: "QR boxes overlap" }); }));
      for (const image of page.querySelectorAll(".gold-print-qr-image")) {
        const r = image.getBoundingClientRect();
        const container = image.closest(".gold-print-footer") ? footer : p;
        if (r.left < container.left - 1 || r.right > container.right + 1 || r.top < container.top - 1 || r.bottom > container.bottom + 1) issues.push({ index, problem: "QR outside page/footer box" });
        const title = image.parentElement.querySelector(":scope > span:not(.gold-print-qr-image)");
        if (title && overlaps(r, title.getBoundingClientRect())) issues.push({ index, problem: "footer QR overlaps title" });
      }
      const gameFooter = page.querySelector(".gold-print-games"), footerMeta = page.querySelector(".gold-print-footer-meta");
      if (gameFooter && footerMeta && overlaps(gameFooter.getBoundingClientRect(), footerMeta.getBoundingClientRect())) issues.push({ index, problem: "footer games overlap metadata" });
    }
    return issues;
  });
  const filename = path.join(output, `${name}.pdf`);
  const pdf = await page.pdf({ path: filename, format: "A4", printBackground: true });
  const document = await PDFDocument.load(pdf);
  const coverPage = root.locator(":scope > article").first();
  await coverPage.screenshot({ path: path.join(output, `${name}-first-page.png`) });
  report.prints.push({ name, domPages: parts.length, pdfPages: document.getPageCount(), links, geometry, issues: state.issues, parts });
  assert.equal(document.getPageCount(), parts.length, "PDF must have exactly one A4 page per article");
  for (const p of document.getPages()) {
    assert.ok(Math.abs(p.getWidth() - 595.28) < 1 && Math.abs(p.getHeight() - 841.89) < 1);
  }
  if (decode && coverGames.length) {
    const prefix = path.join(output, `${name}-pdf-cover`);
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-r", "300", "-singlefile", "-png", filename, prefix]);
    const pdfPNG = PNG.sync.read(await fs.readFile(`${prefix}.png`));
    for (const id of coverGames) {
      const image = root.locator(`.gold-print-cover [data-print-game="${id}"] .gold-print-qr-image`);
      const box = await image.evaluate((n) => {
        const r = n.getBoundingClientRect(), p = n.closest("article").getBoundingClientRect();
        return { x: r.left - p.left, y: r.top - p.top, width: r.width, height: r.height };
      });
      const mm = coverGames.length > 4 ? 22 : 27;
      assert.ok(Math.abs(box.width * 25.4 / 96 - mm) < 0.2 && Math.abs(box.height * 25.4 / 96 - mm) < 0.2, `${id}: actual cover QR must be ${mm}mm; got ${box.width * 25.4 / 96}mm`);
      const href = links.find((l) => l.cover && l.id === id).href;
      const actual = await image.screenshot();
      await fs.writeFile(path.join(output, `${name}-${id}-print-size.png`), actual);
      const png = PNG.sync.read(actual);
      const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
      assert.equal(decoded?.data, href, `${id}: actual print-size image must decode`);
      report.qrDecodes.push({ name, id, mm, source: "actual-print-dimensions" });
      // Crop the real A4 raster with the existing 11mm @page margin.
      const crop = await sharp(pdfPNG.data, { raw: { width: pdfPNG.width, height: pdfPNG.height, channels: 4 } }).extract({ left: Math.floor(11 * 300 / 25.4 + box.x * 300 / 96) - 8, top: Math.floor(11 * 300 / 25.4 + box.y * 300 / 96) - 8, width: Math.ceil(box.width * 300 / 96) + 16, height: Math.ceil(box.height * 300 / 96) + 16 }).png().toBuffer();
      await fs.writeFile(path.join(output, `${name}-${id}-pdf-crop.png`), crop);
      const raster = PNG.sync.read(crop);
      assert.equal(jsQR(new Uint8ClampedArray(raster.data), raster.width, raster.height)?.data, href, `${id}: actual PDF crop must decode`);
      report.qrDecodes.push({ name, id, mm, source: "actual-A4-PDF", dpi: 300 });
    }
  }
  assert.deepEqual(geometry, [], "Nested content and QR boxes must not overlap the footer or one another");
}

try {
  for (const width of [1440, 390]) await check(`preview-${width}`, async () => {
    const { page, state } = await openPage(width);
    try {
      await page.locator("#printCoverButton").click();
      for (const style of ["concept", "simple"]) {
        await page.locator(`[name=coverStyle][value=${style}]`).check();
        await verifyCover(page, "#coverPreview .gold-print-cover", book1.lessons, allGames, true);
        await page.screenshot({ path: path.join(output, `preview-${width}-${style}.png`), fullPage: true });
      }
      await page.locator("#coverDialogClose").click();
      await selectFirst(page);
      await verifyCover(page, "#coverPreview .gold-print-cover", unit1.lessons, firstGames, true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.screenshot({ path: path.join(output, `preview-${width}-unit1.png`), fullPage: true });
      assert.deepEqual(state.issues, [], "Opening/changing/cancelling preview must not issue links");
      assert.equal(await page.evaluate(() => window.coverAuditPrints), 0);
      await page.locator("#coverDialogClose").click();
      assert.equal(await page.locator("#goldPrintRoot > article").count(), 0);
      report.previews.push({ width, wholeGames: 7, selectedGames: 2, styles: ["concept", "simple"], issuance: 0 });
    } finally { await page.close(); }
  });
  for (const style of ["concept", "simple"]) await check(`whole-book-${style}`, async () => {
    const { page, state } = await openPage();
    try {
      await page.locator("#printCoverButton").click();
      await page.locator(`[name=coverStyle][value=${style}]`).check();
      await page.locator("#coverDialogApply").click();
      await page.locator("#printBookButton").click();
      await savePrint(page, state, `whole-book-${style}`, { games: allGames, lessons: book1.lessons, style, decode: true });
      assert.equal(state.issues.length, 1);
      assert.deepEqual(state.issues[0].slice().sort(), allGames);
    } finally { await page.close(); }
  });
  for (const width of [1440, 390]) await check(`selected-unit1-${width}`, async () => {
    const { page, state } = await openPage(width);
    try {
      await selectFirst(page, { style: "simple" });
      await page.locator("#printSelectionApply").click();
      await savePrint(page, state, `selected-unit1-${width}`, { games: firstGames, style: "simple", decode: true });
      assert.equal(state.issues.length, 1);
      assert.deepEqual(state.issues[0].slice().sort(), firstGames);
    } finally { await page.close(); }
  });
  for (const test of ["qr-off", "no-cover", "answers", "quick", "duplex"]) await check(test, async () => {
    const { page, state } = await openPage();
    try {
      if (test === "qr-off") await page.locator("#printGameQR").uncheck();
      const answerOnly = ["answers", "quick"].includes(test);
      await selectFirst(page, { mode: test === "duplex" ? "both" : answerOnly ? test : "study", style: test === "no-cover" ? "none" : "concept" });
      if (test === "qr-off" || test === "no-cover" || answerOnly) assert.equal(await page.locator("#coverPreview [data-cover-game]").count(), 0);
      await page.locator("#printSelectionApply").click();
      await savePrint(page, state, test, { games: test === "no-cover" || test === "duplex" ? firstGames : [], cover: !answerOnly && test !== "no-cover", duplex: test === "duplex" });
      assert.equal(state.issues.length, test === "no-cover" || test === "duplex" ? 1 : 0);
    } finally { await page.close(); }
  });
  await check("unsupported-book2", async () => {
    const { page, state } = await openPage(1440, "book-02");
    try {
      await page.locator("#printCoverButton").click();
      assert.equal(await page.locator("#coverPreview [data-cover-game]").count(), 0);
      await page.locator("#coverDialogApply").click();
      await page.locator("#printBookButton").click();
      await savePrint(page, state, "unsupported-book2", { lessons: GOLDEN_BELL_BOOKS.find((b) => b.id === "book-02").lessons });
      assert.deepEqual(state.issues, []);
    } finally { await page.close(); }
  });
  for (const failure of ["service", "incomplete", "wrong-game", "encoder"]) await check(`failure-${failure}`, async () => {
    const { page, state } = await openPage(1440, "book-01", failure);
    try {
      await selectFirst(page);
      if (failure === "encoder") await page.evaluate(() => { globalThis.qrcode = undefined; });
      await page.locator("#printSelectionApply").click();
      await page.waitForFunction(() => !document.querySelector("#printGameQR").disabled);
      assert.equal(await page.evaluate(() => window.coverAuditPrints), 0);
      assert.equal(await page.locator("#goldPrintRoot > article").count(), 0);
      assert.equal(await page.locator("#goldPrintRoot .gold-cover-qr-placeholder").count(), 0);
      assert.equal(await page.locator("#goldPrintRoot").getAttribute("aria-hidden"), "true");
      assert.doesNotMatch(await page.locator("#printStatus").innerText(), /^A4/u);
      await page.screenshot({ path: path.join(output, `failure-${failure}.png`), fullPage: true });
      assert.equal(state.issues.length, 1);
    } finally { await page.close(); }
  });
  await check("destination-isolated", async () => {
    const { page, state } = await openPage(390);
    try {
      state.requests.length = 0;
      await page.goto(`${base}/fields-classic/question-bank/game.html?activity=fold-once&book=book-10#${issued.get("turn-clock").token}`, { waitUntil: "networkidle" });
      await page.locator('#gameContent[data-hand-activity="turn-clock"]').waitFor({ state: "visible" });
      assert.equal(await page.locator("#gameContent").getAttribute("data-hand-activity"), "turn-clock");
      assert.equal(await page.locator("#gameContent").isVisible(), true);
      assert.equal(await page.locator("a,button[data-hand-activity],[data-hand-action=questions]").count(), 0);
      assert.ok(!state.requests.some((url) => /golden-bell-library|source-data|golden-bell-protected|fields-auth|golden-bell-answers|worksheet\/generators/u.test(url)), "Destination must not load bank modules or bank functions");
      assert.deepEqual(await page.evaluate(() => [typeof globalThis.GFIELD_GEOMETRY_QUESTION_BANK, typeof globalThis.GW_GEN]), ["undefined", "undefined"], "Destination must not expose question-bank or generator functions");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("gfield_fields_session")), session);
      await page.screenshot({ path: path.join(output, "destination-isolated.png"), fullPage: true });
    } finally { await page.close(); }
  });
  await check("no-page-errors", async () => assert.deepEqual(report.pageErrors, []));
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  await fs.writeFile(path.join(output, "cover-games-audit.json"), JSON.stringify(report, null, 2));
}
console.log(`FC_COVER_GAMES_${report.failures.length ? "FAILED" : "OK"} cases=${report.cases.length} prints=${report.prints.length} decodes=${report.qrDecodes.length} failures=${report.failures.length}`);
if (report.failures.length) process.exitCode = 1;
