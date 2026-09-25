"use strict";

// Browser and print gate for source group 4-2 / unit 4 / exploration 3.
// It intentionally owns no generator data: the group module remains the source of truth.

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const pdfJsPath = process.env.HSE_PDFJS_PATH
  || path.join(path.dirname(playwrightPath), "pdfjs-dist", "legacy", "build", "pdf.mjs");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(os.tmpdir(), "hse-source-4-2-parallel-angle-chain-one-browser-audit");

const SOURCE_IDS = [
  "4-2-u4-e3-exploration",
  "4-2-u4-e3-example-3-1",
  "4-2-u4-e3-example-3-2",
  "4-2-u4-e3-example-3-3",
  "4-2-u4-e3-example-3-4",
  "4-2-u4-e3-mission-1",
  "4-2-u4-e3-mission-2",
  "4-2-u4-e3-mission-3",
  "4-2-u4-e3-mission-4",
  "4-2-u4-e3-mission-5",
  "4-2-u4-e3-mission-6"
];

const failures = [];
let screenStates = 0;
let pdfFiles = 0;
let pdfJsPromise;

function fail(message) {
  failures.push(message);
}

function safePath(urlPath) {
  const relative = decodeURIComponent(String(urlPath || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
}

function contentType(file) {
  return ({
    ".css": "text/css",
    ".html": "text/html",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".svg": "image/svg+xml"
  })[path.extname(file)] || "application/octet-stream";
}

async function startReadOnlyServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

async function inspectPdf(pdfPath, label, typeName) {
  if (!pdfJsPromise) pdfJsPromise = import(pathToFileURL(pdfJsPath).href);
  const pdfJs = await pdfJsPromise;
  const document = await pdfJs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
  if (document.numPages < 1 || document.numPages > 4) fail(`${label}: expected 1-4 A4 pages, received ${document.numPages}.`);
  let joinedText = "";
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(" ");
    joinedText += ` ${text}`;
    const substantive = text.replace(/LETE-ON|문제|정답|풀이|\s/g, "");
    if (substantive.length < 30) fail(`${label} page ${pageNumber}: blank or title-only A4 page.`);
  }
  const normalizedName = String(typeName || "").replace(/\s/g, "");
  const occurrences = normalizedName ? joinedText.replace(/\s/g, "").split(normalizedName).length - 1 : 0;
  if (occurrences !== 3) fail(`${label}: type name appears ${occurrences} times instead of three.`);
}

function loadRuntime() {
  global.window = {};
  require("./curriculum.js");
  require("./generators.js");
  // Chain-one deliberately reuses the coordinate/angle primitives from exploration 2.
  require("./source-4-2-parallel-angle.js");
  const moduleApi = require("./source-4-2-parallel-angle-chain-one.js");
  const globalApi = window.HSE_SOURCE_42_PARALLEL_ANGLE_CHAIN_ONE;
  if (!globalApi) throw new Error("HSE_SOURCE_42_PARALLEL_ANGLE_CHAIN_ONE is missing after module load.");
  return { moduleApi, globalApi };
}

function runtimeTypes() {
  return window.HSE_CURRICULUM.semesters
    .flatMap(semester => semester.units || [])
    .flatMap(unit => unit.subunits || [])
    .flatMap(subunit => subunit.types || []);
}

async function inspectItems(page, selector, sourceItemId, phase, label) {
  const example31Tops = sourceItemId === "4-2-u4-e3-example-3-1"
    ? window.HSE_SOURCE_42_PARALLEL_ANGLE_CHAIN_ONE?.POOLS?.["example-3-1"]?.map(pool => pool.top)
    : null;
  const state = await page.evaluate(({ selector, sourceItemId, phase, example31Tops }) => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height };
    };
    const intersects = (a, b, threshold = 1.5) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > threshold
      && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > threshold;
    const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance
      && inner.right <= outer.right + tolerance
      && inner.top >= outer.top - tolerance
      && inner.bottom <= outer.bottom + tolerance;
    const screenPoint = (element, x, y) => {
      const point = element.ownerSVGElement.createSVGPoint();
      point.x = x;
      point.y = y;
      return point.matrixTransform(element.getScreenCTM());
    };
    const sampleShape = element => {
      const tag = element.tagName.toLowerCase();
      if (tag === "line") {
        const a = screenPoint(element, Number(element.getAttribute("x1")), Number(element.getAttribute("y1")));
        const b = screenPoint(element, Number(element.getAttribute("x2")), Number(element.getAttribute("y2")));
        return Array.from({ length: 81 }, (_, index) => ({ x: a.x + (b.x - a.x) * index / 80, y: a.y + (b.y - a.y) * index / 80 }));
      }
      if (tag === "polyline") {
        const points = [...element.points].map(point => screenPoint(element, point.x, point.y));
        return points.flatMap((a, index) => {
          const b = points[index + 1];
          if (!b) return [];
          const count = Math.max(8, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
          return Array.from({ length: count + 1 }, (_, step) => ({ x: a.x + (b.x - a.x) * step / count, y: a.y + (b.y - a.y) * step / count }));
        });
      }
      if (tag === "path" && typeof element.getTotalLength === "function") {
        const length = element.getTotalLength();
        const count = Math.max(24, Math.ceil(length / 2));
        return Array.from({ length: count + 1 }, (_, index) => {
          const point = element.getPointAtLength(length * index / count);
          return screenPoint(element, point.x, point.y);
        });
      }
      return [];
    };
    const isVisibleStroke = element => {
      const style = getComputedStyle(element);
      return style.stroke !== "none" && Number.parseFloat(style.strokeWidth) > 0;
    };
    const isArc = element => element.matches("[data-angle-arc], .pa-arc, .pac1-arc, path[class*='arc']");
    const isRightMark = element => element.matches("[data-right-mark], .pa-right, .pac1-right, path[class*='right']");
    const isLeader = element => element.matches("[data-layout-ignore], [data-layout-overlap-ok], .pa-leader, .pac1-leader, [class*='leader']");
    const nodes = [...document.querySelectorAll(selector)];
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      items: nodes.map(item => {
        const svg = item.querySelector("svg.source42-pa.source42-pac1");
        const itemBox = rect(item);
        const svgBox = svg ? rect(svg) : null;
        const viewBox = svg?.viewBox?.baseVal;
        const textNodes = svg ? [...svg.querySelectorAll("text")].map(element => ({
          text: compact(element.textContent),
          box: rect(element),
          local: element.getBBox(),
          style: getComputedStyle(element),
          overlapAllowed: element.hasAttribute("data-layout-overlap-ok")
        })) : [];
        // Angle arcs are strokes too: a small 15-degree label must never sit on either a ray or its arc.
        const shapes = svg ? [...svg.querySelectorAll("line,path,polyline")].filter(element => isVisibleStroke(element) && !isLeader(element)) : [];
        const arcs = svg ? [...svg.querySelectorAll("line,path,polyline")].filter(isArc) : [];
        const textOverlaps = [];
        for (let first = 0; first < textNodes.length; first += 1) {
          for (let second = first + 1; second < textNodes.length; second += 1) {
            if (intersects(textNodes[first].box, textNodes[second].box)) textOverlaps.push(`${textNodes[first].text}/${textNodes[second].text}`);
          }
        }
        const textStrokeOverlaps = textNodes.flatMap(text => text.overlapAllowed ? [] : shapes
          .filter(shape => sampleShape(shape).some(point => point.x >= text.box.left - 1.25 && point.x <= text.box.right + 1.25 && point.y >= text.box.top - 1.25 && point.y <= text.box.bottom + 1.25))
          .map(shape => `${text.text}/${shape.getAttribute("class") || shape.tagName.toLowerCase()}`));
        const graphicsOutside = svg ? [...svg.querySelectorAll("line,path,polyline,circle,text")].filter(element => {
          const bounds = element.getBBox();
          return bounds.x < viewBox.x - 2 || bounds.y < viewBox.y - 2
            || bounds.x + bounds.width > viewBox.x + viewBox.width + 2
            || bounds.y + bounds.height > viewBox.y + viewBox.height + 2;
        }).map(element => `${element.tagName}:${compact(element.textContent) || element.getAttribute("class") || "unnamed"}`) : ["missing SVG"];
        const lineStyle = shapes.map(element => {
          const style = getComputedStyle(element);
          return { stroke: style.stroke, width: Number.parseFloat(style.strokeWidth) };
        });
        const numericAngleLabels = textNodes.filter(text => /^\d+°$/.test(text.text));
        const arcState = arcs.map(element => {
          const box = rect(element);
          const bounds = element.getBBox();
          const length = typeof element.getTotalLength === "function" ? element.getTotalLength() : Math.max(bounds.width, bounds.height);
          return { localWidth: bounds.width, localHeight: bounds.height, width: box.width, height: box.height, length };
        });
        const rightState = svg ? [...svg.querySelectorAll("line,path,polyline")].filter(isRightMark).map(element => {
          const bounds = element.getBBox();
          const box = rect(element);
          return { localWidth: bounds.width, localHeight: bounds.height, width: box.width, height: box.height };
        }) : [];
        return {
          sourceItemId: svg?.getAttribute("data-source-item") || "",
          phase: svg?.getAttribute("data-phase") || "",
          poolIndex: svg?.getAttribute("data-pool-index") || compact(item.getAttribute("data-pool-index")),
          signature: `${compact(item.innerText)}|${textNodes.map(text => text.text).join(",")}`,
          hasAnswerVisual: Boolean(item.querySelector(".verified-answer-diagram svg.source42-pa.source42-pac1")),
          svgVisible: Boolean(svgBox && svgBox.width >= Math.min(272, innerWidth - 44) && svgBox.height >= 145),
          svgInside: Boolean(svgBox && inside(svgBox, itemBox, 2)),
          itemOverflow: item.scrollWidth > item.clientWidth + 1,
          graphicsOutside,
          textOverlaps,
          textStrokeOverlaps,
          textStyleClear: textNodes.every(text => text.text && text.style.fill === "rgb(17, 17, 17)" && text.style.stroke === "none" && text.box.height >= 10.5),
          lineStyleClear: lineStyle.length > 0 && lineStyle.every(line => (line.stroke === "rgb(17, 17, 17)" || line.stroke === "rgb(34, 34, 34)") && line.width >= 0.8 && line.width <= 2.1),
          arcState,
          rightState,
          numericAngleLabels,
          expectedSource: sourceItemId,
          expectedPhase: phase
        };
      })
    };
  }, { selector, sourceItemId, phase, example31Tops });

  if (state.documentOverflow) fail(`${label}: document has horizontal overflow.`);
  if (state.items.length !== 3) fail(`${label}: expected 3 variants, received ${state.items.length}.`);
  const signatures = new Set();
  const poolIndices = new Set();
  state.items.forEach((item, index) => {
    const prefix = `${label} variant ${index + 1}`;
    if (item.sourceItemId !== sourceItemId || item.phase !== phase) fail(`${prefix}: source id or phase mismatch.`);
    if (!item.svgVisible || !item.svgInside || item.itemOverflow) fail(`${prefix}: SVG is clipped, too small, or outside the item.`);
    if (item.graphicsOutside.length) fail(`${prefix}: graphics outside SVG viewBox: ${item.graphicsOutside.slice(0, 3).join(", ")}.`);
    if (item.textOverlaps.length) fail(`${prefix}: SVG text collision: ${item.textOverlaps.slice(0, 3).join(", ")}.`);
    if (item.textStrokeOverlaps.length) fail(`${prefix}: SVG text intersects a geometry line: ${item.textStrokeOverlaps.slice(0, 3).join(", ")}.`);
    if (!item.textStyleClear || !item.lineStyleClear) fail(`${prefix}: font, text color, or workbook line style is invalid.`);
    if (!item.arcState.length) fail(`${prefix}: no angle arc was found.`);
    item.arcState.forEach((arc, arcIndex) => {
      if (arc.length < 9 || Math.max(arc.localWidth, arc.localHeight) < 8 || Math.max(arc.width, arc.height) < 9) {
        fail(`${prefix}: angle arc ${arcIndex + 1} is too small to read.`);
      }
    });
    item.rightState.forEach((mark, markIndex) => {
      if (Math.max(mark.localWidth, mark.localHeight) < 6 || Math.max(mark.width, mark.height) < 6) {
        fail(`${prefix}: right-angle mark ${markIndex + 1} is below the 6px minimum.`);
      }
    });
    if (sourceItemId === "4-2-u4-e3-example-3-1") {
      const expectedTop = example31Tops?.[Number(item.poolIndex)];
      if (!Number.isFinite(expectedTop)) fail(`${prefix}: example 3-1 pool index has no source top-angle data.`);
      else if (!item.numericAngleLabels.some(angle => angle.text === `${expectedTop}°`)) {
        fail(`${prefix}: expected source top angle ${expectedTop}° is not shown in the SVG.`);
      }
      if (Number(item.poolIndex) === 0 && expectedTop !== 15) fail(`${prefix}: source pool 0 must preserve 15°.`);
    }
    if (phase === "answer" && !item.hasAnswerVisual) fail(`${prefix}: answer view has no verified answer diagram.`);
    if (item.signature) signatures.add(item.signature);
    if (item.poolIndex) poolIndices.add(item.poolIndex);
  });
  if (signatures.size !== 3) fail(`${label}: the three variants are not distinct.`);
  if (poolIndices.size && poolIndices.size !== 3) fail(`${label}: variants do not expose three distinct pools.`);
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

async function inspectType(browser, baseUrl, type, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(90000);
  page.on("pageerror", error => fail(`${type.id}/${viewportLabel}: page error ${error.message}`));
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  await waitForFonts(page);

  const problemLabel = `${type.sourceItemId}-${viewportLabel}-problem`;
  await inspectItems(page, "#problemView .question-item", type.sourceItemId, "problem", problemLabel);
  await page.screenshot({ path: path.join(outputDir, `${problemLabel}.png`), fullPage: true, timeout: 120000 });
  screenStates += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    await waitForFonts(page);
    await inspectItems(page, "#problemView .question-item", type.sourceItemId, "problem", `${problemLabel}-a4`);
    const pdfPath = path.join(outputDir, `${problemLabel}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    await inspectPdf(pdfPath, problemLabel, type.name);
    pdfFiles += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
  await waitForFonts(page);
  const solutionLabel = `${type.sourceItemId}-${viewportLabel}-solution`;
  await inspectItems(page, "#solutionView .solution-item", type.sourceItemId, "answer", solutionLabel);
  await page.screenshot({ path: path.join(outputDir, `${solutionLabel}.png`), fullPage: true, timeout: 120000 });
  screenStates += 1;

  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    await waitForFonts(page);
    await inspectItems(page, "#solutionView .solution-item", type.sourceItemId, "answer", `${solutionLabel}-a4`);
    const pdfPath = path.join(outputDir, `${solutionLabel}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    await inspectPdf(pdfPath, solutionLabel, type.name);
    pdfFiles += 1;
  }
  await page.close();
}

(async () => {
  const { moduleApi, globalApi } = loadRuntime();
  const allTypes = runtimeTypes();
  const types = SOURCE_IDS.map(sourceItemId => allTypes.find(type => type.sourceItemId === sourceItemId));
  const expectedGeneratorKey = globalApi.GENERATOR_KEY || moduleApi.GENERATOR_KEY || "";
  if (types.some(type => !type || type.reviewLocked)) fail("all 11 chain-one source types must be present and unlocked.");
  if (expectedGeneratorKey && window.HSE_GENERATORS?.generatorKey && types.filter(Boolean).some(type => window.HSE_GENERATORS.generatorKey(type) !== expectedGeneratorKey)) {
    fail("a chain-one source type is attached to a different generator.");
  }
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const type of types.filter(Boolean)) {
      await inspectType(browser, baseUrl, type, { width: 1440, height: 1000 }, "desktop");
      await inspectType(browser, baseUrl, type, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const summaryPath = path.join(outputDir, "audit-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify({ sourceIds: SOURCE_IDS, screenStates, pdfFiles, failures }, null, 2));
  if (failures.length) throw new Error(failures.slice(0, 80).join("\n"));
  console.log(`4-2 parallel-angle chain-one browser audit passed: 11 types, ${screenStates} PC/390 problem-solution states, ${pdfFiles} A4 files, ${outputDir}`);
})().catch(error => {
  console.error(`4-2 parallel-angle chain-one browser audit failed\n${error.stack || error}`);
  process.exit(1);
});
