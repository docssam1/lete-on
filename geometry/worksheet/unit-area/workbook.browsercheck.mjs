import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as api from "../../games/unit-area/core.js?v=area-1";
import { DOMAIN_ORDER, LANGUAGES, comparisonSymbol } from "./workbook-core.js";
import { COPY } from "./i18n.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { PDFDocument } = require("pdf-lib");
const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [], pdfs = [], screenshots = [];
let layoutProblemChecks = 0, pixelChecks = 0, contentProblemChecks = 0;
const bank = new Map(api.domains.flatMap((d) => api.problemsFor(d.id)).map((p) => [p.id, p]));
async function sourceDigests() {
  const hashes = {};
  for (const path of ["../../games/unit-area/core.js", "../../games/unit-area/render.js", "./app.js", "./styles.css", "./workbook-core.js", "./i18n.js"]) hashes[path] = createHash("sha256").update(await readFile(new URL(path, import.meta.url))).digest("hex");
  return hashes;
}
const sources = await sourceDigests();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const snapshot = () => page.locator(".problem").evaluateAll((nodes) => nodes.map((p) => p.dataset.problemId));

async function open(query = "?seed=719") {
  await page.goto(`${base}/geometry/worksheet/unit-area/${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready);
  assert.equal(await page.locator("body").getAttribute("data-ready"), "true", await page.locator("#loadMessage").textContent());
}

async function layout() {
  const result = await page.evaluate(() => {
    const issues = [], rect = (node) => node.getBoundingClientRect();
    const inside = (child, parent) => child.left >= parent.left - 1 && child.right <= parent.right + 1 && child.top >= parent.top - 1 && child.bottom <= parent.bottom + 1;
    for (const problem of document.querySelectorAll(".problem")) {
      const box = rect(problem), heading = rect(problem.querySelector(".problem-heading")), body = rect(problem.querySelector(".problem-body"));
      if (heading.bottom > body.top + 1) issues.push(`Heading overlap: ${problem.id}`);
      for (const node of problem.querySelectorAll(".problem-heading, .unit-cue, .diagram, .response, .diagram svg, .response p")) if (!inside(rect(node), box)) issues.push(`Problem overflow: ${problem.id} ${node.getAttribute("class") || node.tagName}`);
      const diagram = rect(problem.querySelector(".diagram")), response = rect(problem.querySelector(".response"));
      if (diagram.left < response.right - 1 && diagram.right > response.left + 1 && diagram.top < response.bottom - 1 && diagram.bottom > response.top + 1) issues.push(`Response overlap: ${problem.id}`);
      const svg = problem.querySelector(".diagram svg"), matrix = svg.getScreenCTM();
      if (!matrix || Math.abs(Math.hypot(matrix.a, matrix.b) - Math.hypot(matrix.c, matrix.d)) > .0001) issues.push(`Stretched SVG: ${problem.id}`);
      const vb = svg.viewBox.baseVal;
      for (const node of svg.querySelectorAll("text, [data-grid], [data-piece-index], [data-drawing-square], [data-pair-tray]")) {
        const r = rect(node), corners = [new DOMPoint(r.left, r.top), new DOMPoint(r.right, r.bottom)].map((point) => point.matrixTransform(matrix.inverse()));
        if (corners[0].x < vb.x - 1 || corners[0].y < vb.y - 1 || corners[1].x > vb.x + vb.width + 1 || corners[1].y > vb.y + vb.height + 1) issues.push(`SVG content clipped: ${problem.id} ${node.tagName}`);
      }
      if (matchMedia("print").matches) {
        const grid = rect(svg.querySelector("[data-grid]"));
        const minimum = problem.dataset.domain === "compare" ? 30 : 40;
        if (grid.width < minimum * 96 / 25.4 - 1) issues.push(`Small printed grid: ${problem.id}`);
      }
    }
    for (const sheet of document.querySelectorAll(".sheet")) {
      const problems = [...sheet.querySelectorAll(".problem")];
      if (problems.length > 2 || new Set(problems.map((p) => p.dataset.domain)).size !== 1 || problems[0].dataset.domain !== sheet.dataset.domain) issues.push("Mixed activity page");
      if (rect(sheet.querySelector(".problem-grid")).bottom > rect(sheet.querySelector("footer")).top + 1) issues.push("Footer overlap");
    }
    for (const paper of document.querySelectorAll(".sheet, .book-cover:not([hidden])")) {
      if (paper.scrollHeight > paper.clientHeight + 1 || paper.scrollWidth > paper.clientWidth + 1) issues.push("Page overflow");
      for (const node of paper.querySelectorAll(":scope > header, :scope > footer, .cover-copy, .cover-contents, .cover-meta, .page-watermark")) if (!inside(rect(node), rect(paper))) issues.push(`Page content outside paper: ${node.className}`);
      if (paper.querySelector(".page-watermark")?.textContent !== "GFIELD") issues.push("Missing watermark");
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push("Horizontal overflow");
    for (const node of document.querySelectorAll("button, select, .maker-settings label, .activity-label")) if (node.getClientRects().length && node.scrollWidth > node.clientWidth + 1) issues.push(`Control overflow: ${node.id || node.className}`);
    return { issues, problems: document.querySelectorAll(".problem").length };
  });
  assert.deepEqual(result.issues, [], JSON.stringify(result));
  layoutProblemChecks += result.problems;
}

async function content(reveal, lang = "ko") {
  const items = await page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => {
    const svg = node.querySelector("svg");
    return {
      id: node.dataset.problemId,
      response: node.querySelector(".response").innerText,
      prompt: node.querySelector(".problem-prompt").innerText,
      unit: svg.querySelector("[data-unit-cue]").textContent,
      answer: node.querySelector(".answer-value")?.textContent,
      revealed: svg.querySelectorAll("[data-answer]").length,
      marks: svg.querySelectorAll("[data-pair], [data-pair-tray], [data-count-mark]").length,
      buttons: svg.querySelectorAll('[role="button"], [tabindex="0"]').length,
      drawing: [...svg.querySelectorAll("[data-drawing-square]")].filter((n) => n.getAttribute("fill") !== "transparent").map((n) => n.getAttribute("data-drawing-square")),
      pieces: [...svg.querySelectorAll("[data-piece-index]")].map((n) => ({ index: Number(n.dataset.pieceIndex), board: n.dataset.board, transform: n.getAttribute("transform"), part: n.querySelector("[data-part]")?.getAttribute("data-part") || "full" }))
    };
  }));
  const order = items.map((item) => DOMAIN_ORDER.indexOf(bank.get(item.id).domain));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.equal(new Set(items.map((item) => item.id)).size, items.length);
  for (const item of items) {
    const p = bank.get(item.id);
    assert.equal(item.prompt, api.promptFor(p, lang));
    assert.ok(item.unit.includes("1"));
    assert.equal(item.buttons, 0);
    assert.doesNotMatch(item.response, /cm²|cm2/);
    if (!reveal) {
      assert.equal(item.revealed, 0);
      assert.equal(item.marks, 0, "Student marks and pairs must be blank");
      assert.equal(item.answer ?? "", "");
      assert.equal(item.drawing.length, 0, "Student drawing grid must be blank");
    } else {
      assert.ok(item.revealed > 0);
      assert.ok(item.response.includes(api.solutionFor(p, lang)));
      if (p.domain === "build") {
        assert.equal(item.answer, COPY[lang].example);
        assert.ok(item.response.includes(COPY[lang].otherAnswers));
        assert.deepEqual(item.drawing.sort(), p.example.map((point) => point.join(",")).sort());
      } else assert.equal(item.answer, String(p.domain === "compare" ? comparisonSymbol(api.answerFor(p)) : api.answerFor(p)));
    }
    for (const piece of item.pieces) {
      const cell = p.domain === "compare" ? (piece.board === "A" ? p.left : p.right)[piece.index] : p.cells[piece.index];
      const top = p.domain === "compare" ? (piece.board === "A" ? 108 : 414) : 88;
      assert.equal(piece.transform, `translate(${48 + cell.x * 44} ${top + cell.y * 44})`, "Static shapes keep their original coordinates");
      assert.equal(piece.part, cell.part);
    }
    assert.equal(item.pieces.length, p.domain === "build" ? 0 : p.domain === "compare" ? p.left.length + p.right.length : p.cells.length);
    contentProblemChecks += 1;
  }
}

async function pixels() {
  const checks = await page.locator(".problem .diagram svg").evaluateAll(async (svgs) => {
    const results = [];
    for (const svg of svgs) {
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
      const image = new Image(); image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = 360; canvas.height = svg.viewBox.baseVal.height;
      const ctx = canvas.getContext("2d"); ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let ink = 0;
      for (let i = 0; i < data.length; i += 4) if (Math.min(data[i], data[i + 1], data[i + 2]) < 180) ink += 1;
      results.push(ink); URL.revokeObjectURL(url);
    }
    return results;
  });
  assert.ok(checks.every((ink) => ink > 250), `Blank diagrams: ${checks}`);
  pixelChecks += checks.length;
}

async function capture(name, locator = page) {
  await locator.screenshot({ path: `${output}/${name}.png` });
  screenshots.push(name);
}

async function pdf(name, expectedPages) {
  await page.emulateMedia({ media: "print" });
  await layout();
  const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  const document = await PDFDocument.load(bytes);
  assert.equal(document.getPageCount(), expectedPages, name);
  for (const p of document.getPages()) {
    assert.ok(Math.abs(p.getWidth() - 595.28) < 1);
    assert.ok(Math.abs(p.getHeight() - 841.89) < 1);
  }
  await writeFile(`${output}/${name}.pdf`, bytes);
  pdfs.push({ name, pages: document.getPageCount(), problems: await snapshot() });
  await page.emulateMedia({ media: "screen" });
}

try {
  await open();
  const all = await snapshot();
  assert.equal(all.length, 20);
  for (const domain of DOMAIN_ORDER) assert.equal(all.filter((id) => bank.get(id).domain === domain).length, 5);
  await layout(); await content(false); await pixels();
  await capture("desktop");
  await capture("cover", page.locator("#coverSheet"));
  for (const domain of DOMAIN_ORDER) await capture(`student-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  await pdf("all20-student", 13);
  await page.locator("#answerToggle").check();
  assert.deepEqual(await snapshot(), all);
  await layout(); await content(true); await pixels();
  for (const domain of DOMAIN_ORDER) await capture(`answers-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  await pdf("all20-answers", 13);
  await page.locator("#coverToggle").uncheck();
  assert.deepEqual(await snapshot(), all);
  await pdf("all20-answers-no-cover", 12);
  await page.locator("#answerToggle").uncheck();
  assert.deepEqual(await snapshot(), all);
  await pdf("all20-student-no-cover", 12);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready === "true");
  assert.deepEqual(await snapshot(), all, "URL restores the same bank selection");
  assert.equal(await page.locator("#coverToggle").isChecked(), false);
  await page.locator("#countInput").focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "languageSelect");
  await page.evaluate(() => { window.print = () => { window.printCalls = (window.printCalls || 0) + 1; }; });
  await page.locator("#printButton").click();
  assert.equal(await page.evaluate(() => window.printCalls), 1);
  const visited = new Set(all);
  for (let n = 0; n < 3; n += 1) {
    await page.locator("#refreshButton").click();
    (await snapshot()).forEach((id) => visited.add(id));
    await layout(); await content(false);
  }
  assert.equal(visited.size, 80);

  for (const width of [1280, 768, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const domain of DOMAIN_ORDER) {
      await open(`?domain=${domain}&count=20&seed=719`);
      const before = await snapshot();
      for (const lang of LANGUAGES) {
        await page.locator("#languageSelect").selectOption(lang);
        assert.deepEqual(await snapshot(), before);
        for (const reveal of [false, true]) {
          await page.locator("#answerToggle").setChecked(reveal);
          await layout(); await content(reveal, lang);
          if (width === 390 && domain === "build" && reveal) await capture(`mobile-${lang}-build-answers`, page.locator(".sheet").first());
        }
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const lang of LANGUAGES) {
    for (const domain of ["all", ...DOMAIN_ORDER]) {
      await open(`?domain=${domain}&count=20&seed=719&lang=${lang}`);
      for (const reveal of [false, true]) {
        await page.locator("#answerToggle").evaluate((node, checked) => { node.checked = checked; node.dispatchEvent(new Event("change", { bubbles: true })); }, reveal);
        await page.emulateMedia({ media: "print" });
        await layout(); await content(reveal, lang);
        if (domain === "all" && lang !== "ko") await pdf(`all20-${lang}-${reveal ? "answers" : "student"}`, 13);
      }
      await page.emulateMedia({ media: "screen" });
    }
  }
  for (const domain of api.domains) {
    await open(`?level=${domain.level}&seed=719`);
    assert.equal(await page.locator("#domainSelect").inputValue(), domain.id);
  }
  await open("?domain=all&count=99&seed=719");
  assert.equal(await page.locator("#countInput").inputValue(), "20");
  assert.match(await page.locator("#countNotice").innerText(), /조정/);
  for (let count = 1; count <= 20; count += 1) {
    await page.locator("#countInput").fill(String(count));
    await page.locator("#countInput").dispatchEvent("change");
    assert.equal((await snapshot()).length, count);
    await layout();
  }
  await page.locator("#countInput").fill("0");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator("#countInput").inputValue(), "1");
  await page.locator("#coverToggle").uncheck();
  await pdf("single1-no-cover", 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await open(); await layout();
  await capture("mobile");
  for (const domain of DOMAIN_ORDER) await capture(`mobile-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#answerToggle").check(); await layout();

  const failure = await context.newPage();
  await failure.goto(`${base}/geometry/worksheet/unit-area/?domain=unavailable`);
  await failure.waitForFunction(() => document.body.dataset.ready === "error");
  assert.equal(await failure.locator("#printButton").isDisabled(), true);
  assert.equal(await failure.locator("#worksheet").isVisible(), false);
  await failure.close();
  for (const module of ["core.js", "render.js"]) {
    const brokenContext = await browser.newContext({ serviceWorkers: "block" });
    await brokenContext.route(`**/games/unit-area/${module}*`, (route) => route.fulfill({ status: 503, body: "Unavailable" }));
    const broken = await brokenContext.newPage();
    await broken.goto(`${base}/geometry/worksheet/unit-area/`);
    await broken.waitForFunction(() => document.body.dataset.ready === "error");
    assert.equal(await broken.locator("#printButton").isDisabled(), true);
    assert.equal(await broken.locator("#retryButton").isVisible(), true);
    assert.equal(await broken.locator(".problem").count(), 0);
    await brokenContext.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(await sourceDigests(), sources, "Sources changed during QA; rerun against the completed files");
  const result = { passed: true, layoutProblemChecks, contentProblemChecks, pixelChecks, verifiedBankIds: visited.size, viewports: [1280, 768, 390], languages: LANGUAGES, sources, pdfs, screenshots, errors };
  await writeFile(`${output}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, pdfs: pdfs.map(({ name, pages }) => ({ name, pages })) }, null, 2));
} catch (error) {
  await writeFile(`${output}/failure.json`, JSON.stringify({ passed: false, message: error.message, stack: error.stack, url: page.url(), errors }, null, 2));
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {});
  throw error;
} finally { await browser.close(); }
