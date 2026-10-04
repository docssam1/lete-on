import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { HANDS_ON_ACTIVITIES as activities, expectedCells, matchesClue } from "./golden-bell-hands-on-models.js";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { printGameExpiry } from "./golden-bell-game-print.js";
import { FIELDS_GAME_LESSONS, issueFieldsGameCapability, resolveFieldsGameCapability } from "../../supabase/functions/_shared/fields-game-capability.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const require = createRequire(import.meta.url);
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = require(path.join(modules, "pdf-lib"));
const { PNG } = require(path.join(modules, "pngjs"));
const sharp = require(path.join(modules, "sharp"));
const jsQR = require(process.env.FIELDS_QR_DECODER);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Private fixtures are local-only");
const output = process.env.FIELDS_CAPTURE_DIR;
assert.ok(output && process.env.FIELDS_PRIVATE_ANSWER_BANK);
await fs.mkdir(output, { recursive: true });
const bank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const secret = "local-qr-audit-only-no-production-credential";
const session = "a".repeat(64);
const issued = new Map();
for (const id of Object.keys(activities)) {
  assert.equal(FIELDS_GAME_LESSONS[id], activities[id].lesson, "Backend and authored game catalog must agree");
  issued.set(id, await issueFieldsGameCapability(secret, id));
}
assert.deepEqual(Object.keys(FIELDS_GAME_LESSONS).sort(), Object.keys(activities).sort());
const book = GOLDEN_BELL_BOOKS.find((b) => b.id === "book-01");
assert.deepEqual(printGameExpiry(Date.parse("2027-10-02T15:30:00Z") / 1000), { date: "2027-10-03", time: "00:30" });
const report = { games: [], prints: [], protection: [], qrDecodes: [], errors: [] };
const browser = await chromium.launch({ headless: true });

async function routeGames(page, { failIssue = false, failResolve = false } = {}) {
  await page.route("**/functions/v1/fields-game-link", async (route) => {
    const req = route.request(), body = req.postDataJSON();
    let payload, status = 200;
    if (body.action === "issue") {
      assert.equal(req.headers()["x-fields-session"], session);
      if (failIssue) { status = 503; payload = { error: "service_unavailable" }; }
      else payload = { links: body.activities.map((id) => issued.get(id)) };
    } else {
      assert.equal(req.headers()["x-fields-session"], undefined, "QR must not send the normal Fields session");
      if (failResolve) { status = 503; payload = { error: "service_unavailable" }; }
      else try { payload = await resolveFieldsGameCapability(secret, body.token); }
      catch { status = 401; payload = { error: "capability_invalid" }; }
    }
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(payload) });
  });
}

const permutations = (items) => items.length ? items.flatMap((n, i) => permutations(items.filter((_, j) => j !== i)).map((p) => [n, ...p])) : [[]];
async function solveRound(page, activity, round) {
  const click = (action, value) => page.locator(`[data-hand-action="${action}"]${value === undefined ? "" : `[data-value="${value}"]`}`).click();
  if (activity.kind === "fold") {
    for (const _ of round.model.folds) await click("fold");
    await click("cut");
  }
  if (["mirror", "fold"].includes(activity.kind)) for (const cell of expectedCells(activity, round)) await click("cell", cell);
  if (["cross", "order"].includes(activity.kind)) {
    const pool = activity.kind === "cross" ? [1, 2, 3, 4, 5].filter((n) => n !== round.center) : ["A", "B", "C", "D"];
    const slots = permutations(pool).find((p) => activity.kind === "cross" ? p[0] + p[3] === p[1] + p[2] : round.clues.every((clue) => matchesClue(p, clue)));
    for (const [i, n] of slots.entries()) { await click("choose", n); await click("slot", i); }
  }
  if (activity.kind === "transfer") for (let i = 0; i < (round.left - round.right) / 2; i++) await click("move", 1);
  await click("check");
  await page.locator(".hand-feedback.correct").waitFor();
}

try {
  for (const width of process.env.FIELDS_QR_PRINT_ONLY ? [] : [1440, 390]) {
    for (const [id, activity] of Object.entries(activities)) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const requests = [];
      page.on("request", (r) => requests.push(r.url()));
      page.on("pageerror", (e) => report.errors.push(e.message));
      await routeGames(page);
      await page.addInitScript(() => {
        sessionStorage.setItem("gfield_fields_session", "ordinary-session-must-not-be-used-or-changed");
        localStorage.setItem("qr-audit-sentinel", "unchanged");
      });
      await page.goto(`${base}/fields-classic/question-bank/game.html?activity=share-equally&book=book-10#${issued.get(id).token}`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("#gameContent").isVisible(), true);
      assert.equal(await page.locator("#gameContent").getAttribute("data-hand-activity"), id, "Query overrides cannot change the signed game");
      assert.equal(await page.locator("a,button[data-hand-activity],[data-hand-action=questions]").count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (activity.kind === "clock") {
        // 시계는 레벨 게임(golden-bell-clock-game.js). 레벨 1이 원본 체험 3도전으로 시작하므로 그것을 풀고
        // 넷째 문제로 넘어가는지 본다. 게임 전체는 golden-bell-clock-game-audit.mjs가 검사한다.
        await page.locator("[data-clock-go]").click();
        for (const round of activity.rounds) {
          for (let i = 0; i < Math.abs(round.turns); i++) await page.locator(`[data-clock-turn="${Math.sign(round.turns)}"]:not([disabled])`).click();
          await page.locator("[data-clock-check]:not([disabled])").click();
          await page.locator("[data-clock-next]").click();
        }
        assert.equal(await page.locator(".cg").getAttribute("data-problem"), "3");
        assert.equal(await page.locator(".cg-coach img").evaluate((img) => img.complete && img.naturalWidth > 0), true);
      } else {
        for (const [i, round] of activity.rounds.entries()) {
          await solveRound(page, activity, round);
          if (i < activity.rounds.length - 1) await page.locator('[data-hand-action="next"]').click();
        }
        await page.locator('[data-hand-action="again"]').click();
        assert.match(await page.locator(".hand-round").innerText(), /1 \/ 3/u);
        assert.equal(await page.locator(".hand-guide img").evaluate((img) => img.complete && img.naturalWidth > 0), true);
      }
      assert.equal(await page.locator("#gameContent").getAttribute("data-hand-activity"), id);
      assert.ok(!requests.some((url) => /golden-bell-library|source-data|golden-bell-protected|fields-auth|golden-bell-answers|worksheet\/generators/u.test(url)), "Game must not load question-bank modules or APIs");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("gfield_fields_session")), "ordinary-session-must-not-be-used-or-changed");
      assert.equal(await page.evaluate(() => localStorage.getItem("qr-audit-sentinel")), "unchanged");
      await page.screenshot({ path: path.join(output, `game-${id}-${width}.png`), fullPage: true });
      report.games.push({ id, width, rounds: activity.rounds.length, isolated: true });
      await page.close();
    }
  }
  for (const test of ["missing", "tampered", "expired", "retry", "hash-race"]) {
    const page = await browser.newPage();
    await routeGames(page, { failResolve: test === "retry" });
    let token = issued.get("turn-clock").token;
    if (test === "missing") token = "";
    if (test === "tampered") token = token.replace("turn-clock", "mirror-tiles");
    if (test === "expired") token = (await issueFieldsGameCapability(secret, "turn-clock", Date.now() - 366 * 86400000)).token;
    await page.goto(`${base}/fields-classic/question-bank/game.html#${token}`, { waitUntil: "networkidle" });
    if (test === "hash-race") {
      await page.evaluate(() => { location.hash = "invalid"; });
      await page.waitForFunction(() => document.querySelector("#gameContent").hidden);
    }
    assert.equal(await page.locator("#gameContent").isVisible(), false);
    assert.equal(await page.locator("[data-hand-action]").count(), 0);
    assert.equal(await page.locator("#gameRetry").isVisible(), test === "retry");
    report.protection.push({ test, denied: true });
    await page.close();
  }
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 3 });
    page.on("pageerror", (e) => report.errors.push(e.message));
    page.on("console", (msg) => { if (msg.type() === "error") console.log("PRINT_DIAGNOSTIC", msg.text()); });
    await routeGames(page);
    await page.route("**/functions/v1/fields-auth", (r) => r.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: bank.books["book-01"] }) }));
    await page.addInitScript((token) => { sessionStorage.setItem("gfield_fields_session", token); window.print = () => { window.qrPrints = (window.qrPrints || 0) + 1; }; }, session);
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    for (const mode of width === 1440 ? ["study", "both", "answers", "quick"] : ["study"]) {
      await page.selectOption("#coursePrintMode", mode);
      await page.locator("#printSelectedButton").click();
      await page.locator("#printUnitsAll").click();
      if (["study", "both"].includes(mode)) await page.locator("#printIncludeAnswers").setChecked(mode === "both");
      await page.locator("#printSelectionApply").click();
      await page.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4"), null, { timeout: 10000 }).catch(async (e) => { console.log("PRINT_STATUS", await page.locator("#printStatus").innerText()); throw e; });
      const pages = await page.locator("#goldPrintRoot > article").evaluateAll((nodes) => nodes.map((n) => ({ lesson: n.dataset.printLesson, part: n.dataset.printPart, qr: !!n.querySelector("[data-print-game]") })));
      const links = await page.locator("#goldPrintRoot [data-print-game]").evaluateAll((nodes) => nodes.map((n) => ({ id: n.dataset.printGame, href: n.href })));
      if (["study", "both"].includes(mode)) assert.deepEqual([...new Set(links.map((n) => n.id))].sort(), Object.keys(activities).sort());
      else assert.equal(links.length, 0);
      assert.equal(await page.locator('.gold-print-duplex-blank [data-print-game],[data-print-part^="answers-"] [data-print-game]').count(), 0);
      assert.equal(await page.locator('.gold-print-cover [data-print-game]').count(), ["study", "both"].includes(mode) ? Object.keys(activities).length : 0);
      if (mode === "both") assert.equal(pages.findIndex((n) => n.part.startsWith("answers-")) % 2, 0);
      await page.emulateMedia({ media: "print" });
      const overflow = await page.locator("#goldPrintRoot > article:has(.has-game-qr)").evaluateAll((nodes) => nodes.filter((n) => {
        const footer = n.querySelector(".gold-print-footer").getBoundingClientRect();
        return [...n.children].filter((c) => !c.matches(".gold-print-footer")).some((c) => c.getBoundingClientRect().bottom > footer.top - 7);
      }).map((n) => n.dataset.printLesson));
      assert.deepEqual(overflow, []);
      const filename = path.join(output, `qr-selected-${width}-${mode}.pdf`);
      const pdf = await page.pdf({ path: filename, format: "A4", printBackground: true });
      assert.equal((await PDFDocument.load(pdf)).getPageCount(), pages.length);
      if (mode === "study") {
        for (const id of Object.keys(activities)) {
          const image = await page.locator(`[data-print-game="${id}"] .gold-print-qr-image`).first().screenshot();
          const png = PNG.sync.read(image);
          const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
          assert.ok(decoded, `${id}: printed-size QR must decode`);
          assert.equal(decoded.data, links.find((link) => link.id === id).href);
          report.qrDecodes.push({ id, width, source: "print-size-image" });
        }
        if (width === 1440) {
          const first = pages.findIndex((p) => p.qr) + 1;
          const prefix = path.join(output, "qr-pdf-page");
          execFileSync("pdftoppm", ["-f", String(first), "-l", String(first), "-r", "300", "-singlefile", "-png", filename, prefix]);
          const png = PNG.sync.read(await fs.readFile(`${prefix}.png`));
          const boxes = await page.locator("#goldPrintRoot > article").nth(first - 1).locator(".gold-print-qr-image").evaluateAll((nodes) => nodes.map((n) => {
            const r = n.getBoundingClientRect(), p = n.closest("article").getBoundingClientRect();
            return { x: r.left - p.left, y: r.top - p.top, width: r.width, height: r.height };
          }));
          for (const [i, box] of boxes.entries()) {
            // Crop the actual PDF raster, not a re-created QR. @page uses 11mm margins.
            const crop = await sharp(png.data, { raw: { width: png.width, height: png.height, channels: 4 } }).extract({
              left: Math.floor(11 * 300 / 25.4 + box.x * 300 / 96) - 8,
              top: Math.floor(11 * 300 / 25.4 + box.y * 300 / 96) - 8,
              width: Math.ceil(box.width * 300 / 96) + 16, height: Math.ceil(box.height * 300 / 96) + 16
            }).png().toBuffer();
            await fs.writeFile(path.join(output, `qr-pdf-crop-${i}.png`), crop);
            const image = PNG.sync.read(crop);
            const decoded = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
            assert.ok(decoded, "Actual A4 PDF QR region must decode");
            assert.ok(links.some((link) => link.href === decoded.data));
            report.qrDecodes.push({ width, source: "actual-A4-PDF", dpi: 300 });
          }
        }
      }
      report.prints.push({ width, mode, pages: pages.length, qrCount: links.length, clipping: false });
      await page.emulateMedia({ media: "screen" });
    }
    await page.locator("#printGameQR").uncheck();
    await page.selectOption("#coursePrintMode", "study");
    await page.locator("#printLessonButton").click();
    await page.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4"));
    assert.equal(await page.locator("[data-print-game]").count(), 0);
    await page.close();
  }
  for (const test of ["issue-failed", "login-required"]) {
    const page = await browser.newPage();
    await routeGames(page, { failIssue: true });
    if (test === "issue-failed") {
      await page.route("**/functions/v1/fields-auth", (r) => r.fulfill({ contentType: "application/json", body: "{}" }));
      await page.addInitScript((token) => sessionStorage.setItem("gfield_fields_session", token), session);
    }
    await page.addInitScript(() => { window.print = () => { window.qrPrints = (window.qrPrints || 0) + 1; }; });
    await page.route("**/functions/v1/golden-bell-answers", (r) => r.fulfill({ status: 401, contentType: "application/json", body: '{}' }));
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-01`, { waitUntil: "networkidle" });
    await page.locator("#printLessonButton").click();
    await page.waitForFunction(() => !document.querySelector("#printGameQR").disabled);
    assert.equal(await page.evaluate(() => window.qrPrints || 0), 0);
    assert.equal(await page.locator("#goldPrintRoot > article").count(), 0);
    assert.equal(await page.locator("#goldPrintRoot").getAttribute("aria-hidden"), "true");
    report.protection.push({ test, printingBlocked: true });
    await page.close();
  }
  assert.deepEqual(report.errors, []);
  await fs.writeFile(path.join(output, "game-qr-audit.json"), JSON.stringify(report, null, 2));
  console.log(`FC_GAME_QR_OK games=${report.games.length} prints=${report.prints.length} decodes=${report.qrDecodes.length} protection=${report.protection.length}`);
} finally { await browser.close(); }
