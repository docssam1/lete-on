import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as api from "../../games/perimeter/core.js?v=perimeter-1";
import { DOMAIN_ORDER, LANGUAGES, COVER_SAMPLE, comparisonSymbol } from "./workbook-core.js";
import { COPY } from "./i18n.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright"), { PDFDocument } = require("pdf-lib");
const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [], pdfs = [], screenshots = [];
let layoutChecks = 0, contentChecks = 0, pixelChecks = 0;
const bank = new Map(api.domains.flatMap((d) => api.problemsFor(d.id)).map((p) => [p.id, p]));
async function digests() {
  const hashes = {};
  for (const path of ["../../games/perimeter/core.js", "../../games/perimeter/render.js", "../../games/perimeter/i18n.js", "./app.js", "./styles.css", "./workbook-core.js", "./i18n.js"]) hashes[path] = createHash("sha256").update(await readFile(new URL(path, import.meta.url))).digest("hex");
  return hashes;
}
const sources = await digests();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const snapshot = () => page.locator(".problem").evaluateAll((nodes) => nodes.map((p) => p.dataset.problemId));
const toggle = (id, value) => page.locator(id).evaluate((node, checked) => { node.checked = checked; node.dispatchEvent(new Event("change", { bubbles: true })); }, value);
async function open(query = "?seed=719") {
  await page.goto(`${base}/geometry/worksheet/perimeter/${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready);
  assert.equal(await page.locator("body").getAttribute("data-ready"), "true", await page.locator("#loadMessage").textContent());
}

async function layout() {
  const result = await page.evaluate(() => {
    const issues = [], rect = (node) => node.getBoundingClientRect(), visible = (node) => node.getClientRects().length > 0;
    const inside = (child, parent) => child.left >= parent.left - 1 && child.right <= parent.right + 1 && child.top >= parent.top - 1 && child.bottom <= parent.bottom + 1;
    const scales = [];
    for (const problem of document.querySelectorAll(".problem")) {
      const box = rect(problem), heading = rect(problem.querySelector(".problem-heading")), body = rect(problem.querySelector(".problem-body"));
      if (heading.bottom > body.top + 1) issues.push(`Heading overlap: ${problem.id}`);
      for (const node of problem.querySelectorAll(".problem-heading, .diagram, .response, .diagram svg, .response p")) if (visible(node) && !inside(rect(node), box)) issues.push(`Problem overflow: ${problem.id} ${node.getAttribute("class") || node.tagName}`);
      const diagram = rect(problem.querySelector(".diagram")), response = rect(problem.querySelector(".response"));
      if (diagram.left < response.right - 1 && diagram.right > response.left + 1 && diagram.top < response.bottom - 1 && diagram.bottom > response.top + 1) issues.push(`Diagram/answer overlap: ${problem.id}`);
      const svgs = [...problem.querySelectorAll(".diagram svg")].filter(visible);
      if (svgs.length !== 1) issues.push(`Expected one visible diagram: ${problem.id}`);
      for (const svg of svgs) {
        const matrix = svg.getScreenCTM(), vb = svg.viewBox.baseVal;
        if (!matrix || Math.abs(Math.hypot(matrix.a, matrix.b) - Math.hypot(matrix.c, matrix.d)) > .0001) issues.push(`Stretched SVG: ${problem.id}`);
        scales.push(Math.hypot(matrix.a, matrix.b));
        for (const node of svg.querySelectorAll("text, rect, path, line")) {
          const r = rect(node), corners = [new DOMPoint(r.left, r.top), new DOMPoint(r.right, r.bottom)].map((point) => point.matrixTransform(matrix.inverse()));
          if (corners[0].x < vb.x - 1 || corners[0].y < vb.y - 1 || corners[1].x > vb.x + vb.width + 1 || corners[1].y > vb.y + vb.height + 1) issues.push(`SVG content clipped: ${problem.id} ${node.tagName}`);
        }
        if (matchMedia("print").matches) {
          const paired = ["compare", "build"].includes(problem.dataset.domain);
          if (rect(svg).width / (paired ? 2 : 1) < 65 * 96 / 25.4 - 1) issues.push(`Printed board below 65mm: ${problem.id}`);
          if (paired && vb.width !== 648) issues.push(`Paired print layout is not horizontal: ${problem.id}`);
        }
      }
    }
    if (matchMedia("print").matches && Math.max(...scales) - Math.min(...scales) > .001) issues.push("Inconsistent printed unit scale");
    for (const sheet of document.querySelectorAll(".sheet")) {
      const problems = [...sheet.querySelectorAll(".problem")];
      if (problems.length > 2 || new Set(problems.map((p) => p.dataset.domain)).size !== 1 || problems[0].dataset.domain !== sheet.dataset.domain) issues.push("Mixed-domain page");
      if (rect(problems.at(-1)).bottom > rect(sheet.querySelector("footer")).top + 1) issues.push("Footer overlap");
    }
    for (const paper of document.querySelectorAll(".sheet, .book-cover:not([hidden])")) {
      if (paper.scrollHeight > paper.clientHeight + 1 || paper.scrollWidth > paper.clientWidth + 1) issues.push("Page overflow");
      for (const node of paper.querySelectorAll(":scope > header, :scope > footer, .cover-copy, .cover-concept, .cover-contents, .learner-fit, .cover-meta")) if (!inside(rect(node), rect(paper))) issues.push(`Page content outside paper: ${node.className}`);
    }
    if (!matchMedia("print").matches && document.documentElement.scrollWidth > innerWidth + 1) issues.push("Horizontal overflow");
    for (const node of document.querySelectorAll("button, select, .maker-settings label, .activity-label")) if (visible(node) && node.scrollWidth > node.clientWidth + 1) issues.push(`Control overflow: ${node.id || node.className}`);
    return { issues, problems: document.querySelectorAll(".problem").length };
  });
  assert.deepEqual(result.issues, [], JSON.stringify(result));
  layoutChecks += result.problems;
}

async function content(reveal, lang = "ko") {
  const items = await page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => {
    const svg = [...node.querySelectorAll(".diagram svg")].find((s) => s.getClientRects().length);
    const squares = [...svg.querySelectorAll('rect[width="44"][height="44"]')];
    return {
      id: node.dataset.problemId, prompt: node.querySelector(".problem-prompt").textContent,
      response: node.querySelector(".response").textContent, answer: node.querySelector(".answer-value")?.textContent,
      buttons: svg.querySelectorAll('[role="button"], [tabindex]').length,
      boards: [squares.slice(0, 36), squares.slice(36)].map((board) => board.filter((r) => r.getAttribute("fill") !== "#ffffff").map((r) => `${(Number(r.getAttribute("x")) - 30) / 44},${(Number(r.getAttribute("y")) - 38) / 44}`).sort()),
    };
  }));
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  for (const item of items) {
    const p = bank.get(item.id), keys = (cells) => (cells || []).map((c) => `${c.x},${c.y}`).sort();
    assert.equal(item.prompt, api.promptFor(p, lang));
    assert.equal(item.buttons, 0);
    assert.deepEqual(item.boards[0], keys(p.cells));
    assert.deepEqual(item.boards[1], keys(p.domain === "compare" ? p.other : p.domain === "build" && reveal ? p.example : []));
    if (reveal) {
      assert.ok(item.response.includes(api.solutionFor(p, lang)));
      assert.equal(item.answer, p.domain === "build" ? `${COPY[lang].example}. ` : String(p.domain === "compare" ? comparisonSymbol(api.answerFor(p)) : api.answerFor(p)));
    } else assert.equal(item.answer || "", "");
    contentChecks += 1;
  }
  assert.equal(await page.locator("[data-cover-sample]").getAttribute("data-cover-sample"), COVER_SAMPLE.id);
  assert.ok(await page.locator(".learner-fit").textContent().then((text) => text.includes(COPY[lang].learnerFit)));
  assert.ok((await page.locator("#backLink").getAttribute("href")).includes(`games/perimeter/?domain=`));
}

async function pixels() {
  const results = await page.locator(".diagram svg, .cover-diagram svg").evaluateAll(async (svgs) => {
    const values = [];
    for (const svg of svgs.filter((s) => s.getClientRects().length)) {
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
      const image = new Image(); image.src = url; await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = svg.viewBox.baseVal.width; canvas.height = svg.viewBox.baseVal.height;
      const ctx = canvas.getContext("2d"); ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let ink = 0;
      for (let i = 0; i < data.length; i += 4) if (Math.min(data[i], data[i + 1], data[i + 2]) < 180) ink += 1;
      values.push(ink); URL.revokeObjectURL(url);
    }
    return values;
  });
  assert.ok(results.every((ink) => ink > 500), `Blank SVG: ${results}`);
  pixelChecks += results.length;
}

async function capture(name, locator = page) {
  await locator.screenshot({ path: `${output}/${name}.png` }); screenshots.push(name);
}
async function pdf(name, expectedPages) {
  await page.emulateMedia({ media: "print" }); await layout();
  const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true }), document = await PDFDocument.load(bytes);
  assert.equal(document.getPageCount(), expectedPages, name);
  for (const p of document.getPages()) {
    assert.ok(Math.abs(p.getWidth() - 595.28) < 1); assert.ok(Math.abs(p.getHeight() - 841.89) < 1);
  }
  await writeFile(`${output}/${name}.pdf`, bytes);
  pdfs.push({ name, pages: expectedPages, cover: await page.locator("#coverToggle").isChecked(), problems: await snapshot() });
  await page.emulateMedia({ media: "screen" });
}

try {
  await open();
  const all = await snapshot();
  assert.equal(all.length, 20);
  for (const domain of DOMAIN_ORDER) assert.equal(all.filter((id) => bank.get(id).domain === domain).length, 5);
  await layout(); await content(false); await pixels();
  await capture("desktop"); await capture("cover", page.locator("#coverSheet"));
  for (const domain of DOMAIN_ORDER) await capture(`student-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  await pdf("all20-ko-student", 13);
  await toggle("#answerToggle", true); assert.deepEqual(await snapshot(), all);
  await layout(); await content(true); await pixels();
  for (const domain of DOMAIN_ORDER) await capture(`answers-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  await pdf("all20-ko-answers", 13);
  await toggle("#coverToggle", false); assert.deepEqual(await snapshot(), all);
  await pdf("all20-answers-no-cover", 12);
  await toggle("#answerToggle", false); assert.deepEqual(await snapshot(), all);
  await pdf("all20-student-no-cover", 12);
  await page.reload({ waitUntil: "networkidle" }); await page.waitForFunction(() => document.body.dataset.ready === "true");
  assert.deepEqual(await snapshot(), all, "URL restores identical selected problems and order");
  assert.equal(await page.locator("#coverToggle").isChecked(), false);
  await page.locator("#countInput").focus(); await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "languageSelect");
  await page.evaluate(() => { window.print = () => { window.printCalls = (window.printCalls || 0) + 1; }; });
  await page.locator("#printButton").click(); assert.equal(await page.evaluate(() => window.printCalls), 1);
  const visited = new Set(all);
  for (let n = 0; n < 3; n += 1) { await page.locator("#refreshButton").click(); (await snapshot()).forEach((id) => visited.add(id)); }
  assert.equal(visited.size, 80);
  for (const width of [1280, 768, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const domain of DOMAIN_ORDER) {
      await open(`?domain=${domain}&count=20&seed=719`);
      const before = await snapshot();
      for (const lang of LANGUAGES) {
        await page.locator("#languageSelect").selectOption(lang); assert.deepEqual(await snapshot(), before);
        for (const reveal of [false, true]) {
          await toggle("#answerToggle", reveal); assert.deepEqual(await snapshot(), before);
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
        await toggle("#answerToggle", reveal); await page.emulateMedia({ media: "print" });
        await layout(); await content(reveal, lang);
        if (domain === "all" && lang !== "ko") await pdf(`all20-${lang}-${reveal ? "answers" : "student"}`, 13);
      }
      await page.emulateMedia({ media: "screen" });
    }
  }
  for (const domain of api.domains) { await open(`?level=${domain.level}`); assert.equal(await page.locator("#domainSelect").inputValue(), domain.id); }
  await open("?count=99&seed=719"); assert.equal(await page.locator("#countInput").inputValue(), "20");
  assert.match(await page.locator("#countNotice").innerText(), /조정/);
  for (let count = 1; count <= 20; count += 1) {
    await page.locator("#countInput").fill(String(count)); await page.locator("#countInput").dispatchEvent("change");
    assert.equal((await snapshot()).length, count); await layout();
  }
  await page.locator("#countInput").fill("0"); await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator("#countInput").inputValue(), "1");
  await toggle("#coverToggle", false); await pdf("single1-no-cover", 1);
  await page.setViewportSize({ width: 390, height: 844 }); await open(); await layout(); await capture("mobile");
  for (const domain of DOMAIN_ORDER) await capture(`mobile-${domain}`, page.locator(`.sheet[data-domain="${domain}"]`).first());
  // Print from a narrow screen must still use the full-size horizontal layout.
  await page.emulateMedia({ media: "print" }); await layout(); await content(false);
  await page.emulateMedia({ media: "screen", reducedMotion: "reduce" }); await toggle("#answerToggle", true); await layout();
  const failure = await context.newPage();
  await failure.goto(`${base}/geometry/worksheet/perimeter/?domain=unavailable`); await failure.waitForFunction(() => document.body.dataset.ready === "error");
  assert.equal(await failure.locator("#printButton").isDisabled(), true); assert.equal(await failure.locator("#worksheet").isVisible(), false); await failure.close();
  for (const module of ["core.js", "render.js"]) {
    const brokenContext = await browser.newContext({ serviceWorkers: "block" });
    await brokenContext.route(`**/games/perimeter/${module}*`, (route) => route.fulfill({ status: 503, body: "Unavailable" }));
    const broken = await brokenContext.newPage(); await broken.goto(`${base}/geometry/worksheet/perimeter/`);
    await broken.waitForFunction(() => document.body.dataset.ready === "error");
    assert.equal(await broken.locator("#printButton").isDisabled(), true); assert.equal(await broken.locator("#retryButton").isVisible(), true); assert.equal(await broken.locator(".problem").count(), 0);
    await brokenContext.close();
  }
  assert.deepEqual(errors, []); assert.deepEqual(await digests(), sources, "Sources changed during QA; rerun against completed files");
  const result = { passed: true, layoutChecks, contentChecks, pixelChecks, verifiedBankIds: visited.size, viewports: [1280, 768, 390], languages: LANGUAGES, sources, pdfs, screenshots, errors };
  await writeFile(`${output}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, pdfs: pdfs.map(({ name, pages }) => ({ name, pages })) }, null, 2));
} catch (error) {
  await writeFile(`${output}/failure.json`, JSON.stringify({ passed: false, message: error.message, stack: error.stack, url: page.url(), errors }, null, 2));
  await page.screenshot({ path: `${output}/failure.png` }).catch(() => {}); throw error;
} finally { await browser.close(); }
