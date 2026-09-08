import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import * as api from "../../games/angle-studio/core.js";
import { chooseEntries, groupPages } from "./workbook-core.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { PDFDocument } = require("pdf-lib");
const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [], pdfs = [], screenshots = [];
let layoutProblemChecks = 0, pixelChecks = 0;
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const bank = new Map(api.domains.flatMap((d) => api.problemsFor(d.id)).map((p) => [p.id, p]));
const snapshot = () => page.locator(".problem").evaluateAll((nodes) => nodes.map((p) => p.dataset.problemId));

async function open(query = "") {
  await page.goto(`${base}/geometry/worksheet/angle-studio/${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.body.dataset.ready);
  assert.equal(await page.locator("body").getAttribute("data-ready"), "true", await page.locator("#loadMessage").textContent());
}

async function layout() {
  const result = await page.evaluate(() => {
    const issues = [], rect = (n) => n.getBoundingClientRect();
    for (const problem of document.querySelectorAll(".problem")) {
      const box = rect(problem), heading = rect(problem.querySelector(".problem-heading")), body = rect(problem.querySelector(".problem-body"));
      if (heading.bottom > body.top + 1) issues.push(`Heading overlap ${problem.dataset.problemId}`);
      for (const node of problem.querySelectorAll(".problem-heading, .diagram, .response, .diagram svg")) {
        const r = rect(node);
        if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) issues.push(`Problem overflow ${problem.dataset.problemId} ${node.getAttribute("class") || "svg"}`);
      }
      const diagram = rect(problem.querySelector(".diagram")), response = rect(problem.querySelector(".response"));
      if (diagram.left < response.right - 1 && diagram.right > response.left + 1 && diagram.top < response.bottom - 1 && diagram.bottom > response.top + 1) issues.push(`Response overlap ${problem.dataset.problemId}`);
      const svg = problem.querySelector(".diagram svg"), matrix = svg.getScreenCTM();
      if (!matrix || Math.abs(Math.hypot(matrix.a, matrix.b) - Math.hypot(matrix.c, matrix.d)) > .0001) issues.push(`Stretched SVG ${problem.dataset.problemId}`);
      if (problem.dataset.unit === "point" && matchMedia("print").matches && matrix.a * 260 < 55 * 96 / 25.4 - 1) issues.push("Printed dot grid below 55mm");
    }
    for (const sheet of document.querySelectorAll(".sheet")) {
      const domains = new Set([...sheet.querySelectorAll(".problem")].map((p) => p.dataset.domain));
      if (domains.size !== 1 || !domains.has(sheet.dataset.domain)) issues.push("Mixed activity page");
      if (rect(sheet.querySelector(".problem-grid")).bottom > rect(sheet.querySelector("footer")).top + 1) issues.push("Footer overlap");
    }
    for (const paper of document.querySelectorAll(".sheet, .book-cover:not([hidden])")) {
      if (paper.scrollHeight > paper.clientHeight + 1 || paper.scrollWidth > paper.clientWidth + 1) issues.push("Page overflow");
      const mark = paper.querySelector(".page-watermark"), box = rect(paper), m = rect(mark);
      if (!mark.textContent.includes("GFIELD") || m.bottom > box.bottom || m.right > box.right) issues.push("Watermark missing or clipped");
    }
    if (document.documentElement.scrollWidth > innerWidth) issues.push("Horizontal overflow");
    for (const node of document.querySelectorAll("button, select, .maker-settings label, .activity-label")) {
      if (node.scrollWidth > node.clientWidth + 1) issues.push(`Control overflow ${node.id || node.className}`);
    }
    return { issues, problems: document.querySelectorAll(".problem").length };
  });
  assert.deepEqual(result.issues, [], JSON.stringify(result));
  layoutProblemChecks += result.problems;
}

async function content(reveal) {
  const items = await page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => {
    const svg = node.querySelector("svg");
    const lines = [...svg.querySelectorAll("line")].map((line) => ["x1", "y1", "x2", "y2"].map((a) => Number(line.getAttribute(a))));
    lines.sort((a, b) => Math.hypot(b[2] - b[0], b[3] - b[1]) - Math.hypot(a[2] - a[0], a[3] - a[1]));
    let angle = null;
    if (node.dataset.domain === "estimate") {
      const [a, b] = lines;
      const u = [a[2] - a[0], a[3] - a[1]], v = [b[2] - b[0], b[3] - b[1]];
      angle = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
    }
    return { id: node.dataset.problemId, text: node.innerText, response: node.querySelector(".response").innerText, svgText: svg.textContent, answer: node.querySelector(".answer-value")?.textContent, buttons: svg.querySelectorAll('[role="button"]').length, diagonals: svg.querySelectorAll("[data-diagonal]").length, solutionSteps: svg.querySelectorAll("[data-solution-step]").length, angle };
  }));
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
  const polygonOrder = { triangles: 0, sum: 1, missing: 2, regular: 3 };
  const kinds = items.filter((item) => bank.get(item.id).domain === "polygon").map((item) => polygonOrder[bank.get(item.id).kind]);
  assert.deepEqual(kinds, [...kinds].sort((a, b) => a - b), "Polygon teaching sequence");
  for (const item of items) {
    const p = bank.get(item.id);
    assert.ok(p, item.id);
    assert.equal(item.buttons, 0);
    if (p.domain === "parallel") assert.match(item.text, p.parallel ? /평행합니다/ : /평행하지 않습니다/);
    if (p.domain === "polygon" && !reveal) {
      assert.equal(item.diagonals, 0, "Student draws the diagonals manually");
      assert.equal(item.solutionSteps, 0, "Student diagram contains no solution");
    }
    if (p.domain === "estimate") {
      assert.ok(Math.abs(item.angle - api.answerFor(p)) < .001, `Actual rendered angle ${p.id}: ${item.angle}`);
      assert.match(item.response, /어림한 각도/);
      assert.match(item.response, /실제 각도/);
      assert.doesNotMatch(item.response, /정답|오답|정확히|맞았|틀렸/);
      if (!reveal) assert.doesNotMatch(item.svgText, /\d+°/);
      else assert.ok(item.response.includes(String(api.answerFor(p))));
    } else if (p.unit === "point") {
      assert.equal((item.svgText.match(/B/g) || []).length, reveal ? 1 : 0);
      if (reveal) {
        assert.match(item.response, /예시 답안/);
        assert.match(item.response, /다른/);
      }
    } else if (reveal) assert.equal(item.answer, `${api.answerFor(p)}${p.unit === "degree" ? "°" : p.responseKind === "angle-label" ? "번" : "개"}`);
    else {
      assert.equal(item.answer, "");
      assert.ok(item.response.includes(p.unit === "degree" ? "°" : p.responseKind === "angle-label" ? "번" : "개"));
    }
  }
  assert.equal(await page.locator(".sheet .page-watermark").count(), await page.locator(".sheet").count());
}

async function pixels() {
  const checks = await page.locator(".problem .diagram svg").evaluateAll(async (svgs) => {
    const results = [];
    for (const svg of svgs) {
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
      const image = new Image(); image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas"); canvas.width = 360; canvas.height = 360;
      const c = canvas.getContext("2d"); c.fillStyle = "white"; c.fillRect(0, 0, 360, 360); c.drawImage(image, 0, 0, 360, 360);
      const data = c.getImageData(0, 0, 360, 360).data;
      let ink = 0;
      for (let i = 0; i < data.length; i += 4) if (Math.min(data[i], data[i + 1], data[i + 2]) < 180) ink += 1;
      results.push(ink); URL.revokeObjectURL(url);
    }
    return results;
  });
  assert.ok(checks.every((ink) => ink > 200), `Blank diagrams: ${checks}`);
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
  assert.equal(await page.locator("#domainSelect").inputValue(), "all");
  assert.equal(await page.locator("#countInput").inputValue(), "20");
  const all = await snapshot();
  const bodyPages = groupPages(chooseEntries(api, "all", 20)).length;
  for (const [index, domain] of api.domains.entries()) assert.equal(all.filter((id) => bank.get(id).domain === domain.id).length, Math.floor(20 / api.domains.length) + (index < 20 % api.domains.length ? 1 : 0));
  await layout(); await content(false); await pixels();
  await capture("desktop");
  await capture("cover", page.locator("#coverSheet"));
  await pdf("all20-student", bodyPages + 1);
  await page.locator("#answerToggle").check();
  assert.deepEqual(await snapshot(), all);
  await content(true); await pixels();
  await pdf("all20-answers", bodyPages + 1);
  await page.locator("#coverToggle").uncheck();
  assert.deepEqual(await snapshot(), all);
  await pdf("all20-answers-no-cover", bodyPages);
  await page.locator("#answerToggle").uncheck();
  await pdf("all20-student-no-cover", bodyPages);
  await page.locator("#countInput").focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "coverToggle");
  await page.evaluate(() => { window.print = () => { window.printCalls = (window.printCalls || 0) + 1; }; });
  await page.locator("#printButton").click();
  assert.equal(await page.evaluate(() => window.printCalls), 1);
  const visited = new Set(all);
  for (let n = 0; n < 3; n += 1) {
    await page.locator("#refreshButton").click();
    const next = await snapshot();
    if (api.domains.length === 4) for (const id of next) { assert.ok(!visited.has(id)); visited.add(id); }
  }

  for (const domain of api.domains) {
    await open(`?domain=${domain.id}`);
    const initial = await snapshot();
    assert.equal(initial.length, 10);
    await page.locator("#refreshButton").click();
    assert.ok((await snapshot()).every((id) => !initial.includes(id)));
    await page.locator("#countInput").fill("20");
    await page.locator("#countInput").dispatchEvent("change");
    const full = await snapshot();
    assert.equal(full.length, 20);
    for (const width of [1280, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const reveal of [false, true]) {
        await page.locator("#answerToggle").setChecked(reveal);
        assert.deepEqual(await snapshot(), full);
        await layout(); await content(reveal);
        if (width === 390) await capture(`mobile-${domain.id}-${reveal ? "answers" : "student"}`, page.locator(".problem").first());
      }
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const reveal of [false, true]) {
      await page.locator("#answerToggle").setChecked(reveal);
      await page.emulateMedia({ media: "print" });
      await layout();
      await capture(`a4-${domain.id}-${reveal ? "answers" : "student"}`, page.locator(".sheet").first());
      await page.emulateMedia({ media: "screen" });
    }
    if (domain.id === "right-angle") {
      await page.locator("#countInput").fill("10");
      await page.locator("#countInput").dispatchEvent("change");
      await pdf("right-angle10-answers", 6);
      await page.locator("#answerToggle").uncheck();
      await pdf("right-angle10-student", 6);
    }
    for (let count = 1; count <= 20; count += 1) {
      await page.locator("#countInput").fill(String(count));
      await page.locator("#countInput").dispatchEvent("change");
      assert.equal((await snapshot()).length, count);
    }
    await open(`?level=${domain.level}`);
    assert.equal(await page.locator("#domainSelect").inputValue(), domain.id);
  }
  await open("?domain=all&count=99");
  assert.equal(await page.locator("#countInput").inputValue(), "20");
  assert.match(await page.locator("#countNotice").innerText(), /조정/);
  for (let count = 1; count <= 20; count += 1) {
    await page.locator("#countInput").fill(String(count));
    await page.locator("#countInput").dispatchEvent("change");
    assert.equal((await snapshot()).length, count);
  }
  await page.locator("#countInput").fill("0");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator("#countInput").inputValue(), "1");
  await page.locator("#coverToggle").uncheck();
  await pdf("single1-no-cover", 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await open("?domain=all"); await layout();
  await capture("mobile");

  const failure = await context.newPage();
  await failure.goto(`${base}/geometry/worksheet/angle-studio/?domain=unavailable`);
  await failure.waitForFunction(() => document.body.dataset.ready === "error");
  assert.equal(await failure.locator("#printButton").isDisabled(), true);
  assert.equal(await failure.locator("#worksheet").isVisible(), false);
  await failure.close();
  const brokenContext = await browser.newContext();
  await brokenContext.route("**/games/angle-studio/core.js*", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  const broken = await brokenContext.newPage();
  await broken.goto(`${base}/geometry/worksheet/angle-studio/`);
  await broken.waitForFunction(() => document.body.dataset.ready === "error");
  assert.equal(await broken.locator("#printButton").isDisabled(), true);
  assert.equal(await broken.locator("#retryButton").isVisible(), true);
  await brokenContext.close();
  assert.deepEqual(errors, []);
  const result = { passed: true, layoutProblemChecks, pixelChecks, viewports: [1280, 768, 390], pdfs, screenshots, errors };
  await writeFile(`${output}/results.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ ...result, pdfs: pdfs.map(({ name, pages }) => ({ name, pages })) }, null, 2));
} finally { await browser.close(); }
