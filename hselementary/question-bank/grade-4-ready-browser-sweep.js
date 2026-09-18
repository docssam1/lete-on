"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-grade-4-ready-browser-sweep");
const failures = [];
const findings = [];
const sampledUnits = new Set();
let visitedStates = 0;
let visualStates = 0;
let sampleFiles = 0;

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-parallel-angle.js");
require("./source-grade6-decimal-e1-mission4.js");
require("./source-grade6-decimal-e1-mission3.js");
require("./source-grade6-decimal-e2-example2.js");
require("./source-grade6-decimal-e2-example4.js");
require("./source-grade6-decimal-e2-mission6.js");
require("./source-grade6-decimal-e4-example1.js");
require("./source-grade6-decimal-e4-mission4.js");
require("./source-grade6-volume-e2.js");
require("./source-grade6-volume-e3-mission3.js");
require("./source-grade6-volume-e4.js");
require("./source-grade6-surface-e1.js");

const api = window.HSE_GENERATORS;
const requestedTypeIds = new Set(String(process.env.HSE_TYPE_IDS || "").split(",").map(value => value.trim()).filter(Boolean));
const requestedSemesters = new Set(String(process.env.HSE_SEMESTERS || "4-1,4-2").split(",").map(value => value.trim()).filter(Boolean));
const expectedReadyCount = Number(process.env.HSE_EXPECTED_READY || 519);
const auditLabel = String(process.env.HSE_AUDIT_LABEL || "4학년");
const allReadyTypes = window.HSE_CURRICULUM.semesters
  .filter(semester => requestedSemesters.has(semester.id))
  .flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types
    .filter(type => !type.reviewLocked && api.generatorKey(type))
    .map(type => ({ ...type, semesterId: semester.id, unitId: unit.id, unitName: unit.name })))));
const readyTypes = requestedTypeIds.size ? allReadyTypes.filter(type => requestedTypeIds.has(type.id)) : allReadyTypes;

function fail(message) {
  if (failures.length < 160) failures.push(message);
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
    ".svg": "image/svg+xml",
    ".png": "image/png"
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

async function collectState(page, rootSelector, itemSelector) {
  return page.evaluate(({ rootSelector: root, itemSelector: item }) => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const box = element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
    };
    const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance
      && inner.right <= outer.right + tolerance
      && inner.top >= outer.top - tolerance
      && inner.bottom <= outer.bottom + tolerance;
    const lineCount = element => {
      const tops = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const parent = node.parentElement;
        if (compact(node.textContent) && !parent?.closest(".marked-digit,.math-fraction,.math-mixed-number")) {
          const range = document.createRange();
          range.selectNodeContents(node);
          [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0).forEach(rect => {
            if (!tops.some(top => Math.abs(top - rect.top) < 2)) tops.push(rect.top);
          });
        }
        node = walker.nextNode();
      }
      return Math.max(1, tops.length);
    };
    const rootElement = document.querySelector(root);
    const entries = [...document.querySelectorAll(`${root} ${item}`)];
    return {
      rootVisible: Boolean(rootElement && !rootElement.hidden && rootElement.getBoundingClientRect().height > 0),
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText),
      entries: entries.map(entry => {
        const entryBox = box(entry);
        const visualReports = [...entry.querySelectorAll("svg,canvas,img,table")].map(visual => {
          const visualBox = box(visual);
          const textBoxes = visual.tagName === "svg"
            ? [...visual.querySelectorAll("text")]
              .filter(text => compact(text.textContent) && getComputedStyle(text).display !== "none" && getComputedStyle(text).visibility !== "hidden")
              .map(text => ({ text: compact(text.textContent), box: box(text) }))
            : [];
          let labelOverlap = false;
          const overlapPairs = [];
          for (let left = 0; left < textBoxes.length; left += 1) {
            for (let right = left + 1; right < textBoxes.length; right += 1) {
              const first = textBoxes[left].box;
              const second = textBoxes[right].box;
              const width = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
              const height = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
              const smaller = Math.min(first.width * first.height, second.width * second.height);
              if (smaller > 0 && width * height > smaller * 0.55) {
                labelOverlap = true;
                overlapPairs.push([textBoxes[left].text, textBoxes[right].text]);
              }
            }
          }
          const angleMarks = visual.tagName === "svg" ? [...visual.querySelectorAll("[data-angle-role]")] : [];
          const angleMarkReports = angleMarks.map(mark => {
            const path = mark.tagName?.toLowerCase() === "path" ? mark : mark.querySelector("path");
            const pathBox = path ? box(path) : null;
            return {
              role: mark.dataset.angleRole || "",
              span: Number(mark.dataset.sectorAngle || mark.dataset.arcSpan || mark.dataset.angleValue || NaN),
              width: pathBox ? Number(pathBox.width.toFixed(2)) : 0,
              height: pathBox ? Number(pathBox.height.toFixed(2)) : 0,
              length: path && typeof path.getTotalLength === "function" ? Number(path.getTotalLength().toFixed(2)) : 0,
              complete: Boolean(path && pathBox && pathBox.width + pathBox.height >= 6 && path.getTotalLength() >= 5)
            };
          });
          return {
            tag: visual.tagName.toLowerCase(),
            className: typeof visual.className === "object" ? visual.className.baseVal : visual.className,
            visible: visualBox.width >= 8 && visualBox.height >= 8,
            insideItem: inside(visualBox, entryBox),
            textInside: textBoxes.every(label => label.text && inside(label.box, entryBox, 3)),
            outsideLabels: textBoxes.filter(label => !inside(label.box, entryBox, 3)).map(label => label.text),
            labelOverlap,
            overlapPairs,
            angleMarksComplete: angleMarkReports.every(mark => mark.complete),
            angleMarkReports
          };
        });
        const singleLineEquations = [...entry.querySelectorAll(".equation")]
          .filter(equation => !equation.querySelector("br") && !equation.classList.contains("fraction-series-equation"))
          .map(equation => ({
            text: compact(equation.textContent),
            className: equation.className,
            lines: lineCount(equation),
            whiteSpace: getComputedStyle(equation).whiteSpace,
            overflowWrap: getComputedStyle(equation).overflowWrap,
            overflowX: getComputedStyle(equation).overflowX,
            clientWidth: equation.clientWidth,
            scrollWidth: equation.scrollWidth,
            fits: equation.scrollWidth <= equation.clientWidth + 1
          }));
        const helperLeak = [...entry.querySelectorAll('.equation[data-mixed-kind^="e2-"],.equation[data-mixed-kind^="e3-"]')]
          .some(equation => getComputedStyle(equation).display !== "none");
        const guidedLeak = [...entry.querySelectorAll(".question-step")]
          .some(step => getComputedStyle(step).display !== "none");
        return {
          text: compact(entry.textContent),
          overflow: entry.scrollWidth > entry.clientWidth + 1,
          overflowDetails: [...entry.querySelectorAll("*")]
            .map(element => {
              const elementBox = box(element);
              return {
                tag: element.tagName.toLowerCase(),
                className: typeof element.className === "object" ? element.className.baseVal : element.className,
                text: compact(element.textContent).slice(0, 90),
                width: Number(elementBox.width.toFixed(2)),
                right: Number(elementBox.right.toFixed(2)),
                entryRight: Number(entryBox.right.toFixed(2)),
                clientWidth: element.clientWidth,
                scrollWidth: element.scrollWidth
              };
            })
            .filter(item => item.right > item.entryRight + 1 || item.scrollWidth > item.clientWidth + 1)
            .slice(0, 12),
          visualReports,
          singleLineEquations,
          helperLeak,
          guidedLeak
        };
      })
    };
  }, { rootSelector, itemSelector });
}

function assertState(state, type, label) {
  const prefix = `${type.id} ${label}`;
  const expectedEntries = Math.max(1, Number(type.verifiedVariantCount || 3));
  if (!state.rootVisible || state.entries.length !== expectedEntries) {
    fail(`${prefix}: 문제 또는 풀이가 ${expectedEntries}개 보여야 하나 ${state.entries.length}개입니다.`);
  }
  if (state.documentOverflow) fail(`${prefix}: 화면 전체에 가로 넘침이 있습니다.`);
  if (state.broken) fail(`${prefix}: 깨진 값이 화면에 보입니다.`);
  state.entries.forEach((entry, index) => {
    if (!entry.text) fail(`${prefix} ${index + 1}번: 내용이 비었습니다.`);
    if (entry.overflow) fail(`${prefix} ${index + 1}번: 문항 영역에 가로 넘침이 있습니다 ${JSON.stringify(entry.overflowDetails)}.`);
    if (entry.helperLeak) fail(`${prefix} ${index + 1}번: 정답을 암시하는 보조 계산식이 문제에 노출됩니다.`);
    if (entry.guidedLeak) fail(`${prefix} ${index + 1}번: 풀이를 암시하는 불필요한 안내 문장이 문제에 노출됩니다.`);
    const badVisuals = entry.visualReports.filter(visual => !visual.visible || !visual.insideItem || !visual.textInside || visual.labelOverlap || !visual.angleMarksComplete);
    if (badVisuals.length) {
      fail(`${prefix} ${index + 1}번: 그림 검사 ${JSON.stringify(badVisuals)}.`);
    }
    const printState = label.startsWith("A4");
    const badEquations = entry.singleLineEquations.filter(equation => {
      const screenOverflowSafe = ["auto", "scroll"].includes(equation.overflowX);
      return equation.lines !== 1
        || equation.whiteSpace !== "nowrap"
        || equation.overflowWrap !== "normal"
        || (!equation.fits && (printState || !screenOverflowSafe));
    });
    if (badEquations.length) {
      fail(`${prefix} ${index + 1}번: 한 줄 수식 검사 ${JSON.stringify(badEquations)}.`);
    }
  });
}

async function saveSample(page, type, label, suffix) {
  const key = `${type.unitId}:${label}:${suffix}`;
  if (sampledUnits.has(key)) return;
  sampledUnits.add(key);
  const filename = `${type.unitId}-${label}-${suffix}`;
  if (suffix.startsWith("a4")) await page.pdf({ path: path.join(outputDir, `${filename}.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
  else await page.screenshot({ path: path.join(outputDir, `${filename}.png`), fullPage: true, timeout: 120000 });
  sampleFiles += 1;
}

async function inspectType(page, baseUrl, type, viewport, label) {
  const before = failures.length;
  await page.setViewportSize(viewport);
  await page.emulateMedia({ media: "screen" });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
  const problem = await collectState(page, "#problemView", ".question-item");
  assertState(problem, type, `${label} 문제`);
  if (failures.length > before && failures.length <= 12) {
    await page.screenshot({ path: path.join(outputDir, `${type.id}-${label}-problem-failure.png`), fullPage: true, timeout: 120000 }).catch(() => {});
  }
  visitedStates += 1;
  const hasVisual = problem.entries.some(entry => entry.visualReports.length);
  if (hasVisual || requestedTypeIds.size) {
    visualStates += 1;
    await saveSample(page, type, label, "problem");
  }

  if (label === "desktop") {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: "print" });
    const printProblem = await collectState(page, "#problemView", ".question-item");
    assertState(printProblem, type, "A4 문제");
    if (hasVisual || requestedTypeIds.size) await saveSample(page, type, "desktop", "a4");
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize(viewport);
  }

  await page.locator("#solutionTab").click();
  const solution = await collectState(page, "#solutionView", ".solution-item");
  assertState(solution, type, `${label} 풀이`);
  visitedStates += 1;
  if (solution.entries.some(entry => entry.visualReports.length) || requestedTypeIds.size) await saveSample(page, type, label, "solution");

  if (label === "desktop") {
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: "print" });
    const printSolution = await collectState(page, "#solutionView", ".solution-item");
    assertState(printSolution, type, "A4 풀이");
    if (printSolution.entries.some(entry => entry.visualReports.length) || requestedTypeIds.size) {
      await saveSample(page, type, "desktop", "a4-solution");
    }
    await page.emulateMedia({ media: "screen" });
    await page.setViewportSize(viewport);
  }

  if (failures.length > before && failures.length <= 12) {
    await page.screenshot({ path: path.join(outputDir, `${type.id}-${label}-failure.png`), fullPage: true, timeout: 120000 }).catch(() => {});
  }
  findings.push({ id: type.id, semester: type.semesterId, unit: type.unitId, viewport: label, visual: hasVisual });
}

async function sweep(browser, baseUrl, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  for (const type of readyTypes) {
    try {
      await inspectType(page, baseUrl, type, viewport, label);
    } catch (error) {
      fail(`${type.id} ${label}: 화면 검사를 마치지 못했습니다 (${error.message}).`);
    }
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!requestedTypeIds.size && readyTypes.length !== expectedReadyCount) fail(`${auditLabel} 공개 유형은 ${expectedReadyCount}개여야 하나 ${readyTypes.length}개입니다.`);
  if (requestedTypeIds.size && readyTypes.length !== requestedTypeIds.size) fail(`요청한 ${requestedTypeIds.size}유형 중 공개 상태로 찾은 것은 ${readyTypes.length}개입니다.`);
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  try {
    await sweep(browser, baseUrl, { width: 1440, height: 1000 }, "desktop");
    await sweep(browser, baseUrl, { width: 390, height: 844 }, "mobile");
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  fs.writeFileSync(path.join(outputDir, "audit-detail.json"), JSON.stringify({ readyTypes: readyTypes.length, visitedStates, visualStates, sampleFiles, failures, findings }, null, 2));
  if (failures.length) {
    console.error(`${auditLabel} 공개 유형 브라우저 전수 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`${auditLabel} 공개 유형 브라우저 전수 감사 통과: ${readyTypes.length}유형 · PC/모바일 문제·풀이 ${visitedStates.toLocaleString()}상태 · 그림 ${visualStates.toLocaleString()}상태 · A4 검사`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
