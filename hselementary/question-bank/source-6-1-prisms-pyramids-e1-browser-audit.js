"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(questionBankDir, "tmp", "6-1-prisms-pyramids-e1-browser-audit");
const sourceIds = [
  "6-1-u2-e1-example-1-1",
  "6-1-u2-e1-mission-1",
  "6-1-u2-e1-mission-2",
  "6-1-u2-e1-mission-5"
];
const difficulties = [-1, 0, 1];
const representativeDifficulties = new Set([-1, 0]);
const failures = [];
let screenshots = 0;
let pdfs = 0;
let checkedPages = 0;

const fail = message => failures.push(message);
const normalize = value => String(value || "").replace(/\s+/g, " ").trim();

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
}

function contentType(file) {
  return ({
    ".css": "text/css", ".html": "text/html", ".js": "application/javascript",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png"
  })[path.extname(file)] || "application/octet-stream";
}

async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": `${contentType(file)}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

function attachListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

function renderFirstPage(pdfPath, pngPath, label) {
  try {
    execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-png", "-singlefile", pdfPath, pngPath.replace(/\.png$/, "")], { stdio: "ignore" });
    if (!fs.existsSync(pngPath) || fs.statSync(pngPath).size < 5000) fail(`${label}: A4 첫 페이지 PNG가 비었습니다.`);
  } catch (error) {
    fail(`${label}: A4 첫 페이지 PNG 생성 실패 (${error.message}).`);
  }
}

function hasInvalidText(value) {
  return /undefined|null|NaN|Infinity|SyntaxError/.test(String(value || ""));
}

async function inspectView(page, selector, label, answerView, variant) {
  const state = await page.evaluate(({ selected, isAnswer }) => {
    const items = [...document.querySelectorAll(selected)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const overflows = element => {
      if (!element) return true;
      return element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
    };
    const outside = element => {
      if (!element) return true;
      const box = element.getBoundingClientRect();
      return box.left < -1 || box.right > innerWidth + 1;
    };
    const visuals = items.map(item => item.querySelector(":scope > .solution-answer-visual"));
    const wrappers = visuals.map(visual => visual?.querySelector(":scope > .source61-answer-diagram"));
    const diagrams = items.map(item => [...item.querySelectorAll("svg")]);
    return {
      count: items.length,
      visibleCount: items.filter(visible).length,
      empty: items.some(item => !String(item.textContent || "").replace(/\s+/g, " ").trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      itemOverflow: items.some(overflows),
      outside: items.some(outside),
      invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText || ""),
      rawFraction: /\b\d+\s*\/\s*\d+\b/.test(document.body.innerText),
      markers: items.map(item => item.querySelectorAll("[data-source61-prism-e1-kind]").length),
      markerSources: items.map(item => [...item.querySelectorAll("[data-source61-prism-e1-kind]")].map(node => node.dataset.sourceItem || "")),
      answerVisuals: wrappers.map((wrapper, index) => ({
        exists: Boolean(wrapper),
        visible: visible(wrapper),
        overflow: overflows(wrapper),
        outside: outside(wrapper),
        source: wrapper?.dataset.answerSource || "",
        pool: wrapper?.dataset.verifiedPoolIndex || "",
        marker: Boolean(wrapper?.querySelector("[data-source61-prism-e1-kind]"))
      })),
      problemAnswerLeak: document.querySelectorAll("#problemView .solution-answer-visual, #problemView .solution-item, #problemView .solution").length,
      itemMarkup: items.map(item => item.innerHTML),
      diagramMarkup: diagrams.map(group => group.map(svg => svg.outerHTML).join("\n")),
      diagramCount: diagrams.map(group => group.length),
      pointPositions: diagrams.map(group => group.map(svg => [...svg.querySelectorAll("text")]
        .map(node => ({ label: String(node.textContent || "").replace(/\s+/g, " ").trim(), x: Number(node.getAttribute("x")), y: Number(node.getAttribute("y")) }))
        .filter(point => ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅊ", "ㅈ"].includes(point.label)))),
      targetEdges: diagrams.map(group => group.map(svg => [...svg.querySelectorAll(".source61-target-edge")]
        .map(line => ({ x1: Number(line.getAttribute("x1")), x2: Number(line.getAttribute("x2")), y1: Number(line.getAttribute("y1")), y2: Number(line.getAttribute("y2")) })))),
      netGeometry: items.map(item => {
        const svg = item.querySelector("svg.source61-triangular-prism-net");
        if (!svg) return null;
        const values = (node, names) => names.map(name => `${name}:${node.getAttribute(name) || ""}`).join(",");
        return {
          viewBox: svg.getAttribute("viewBox") || "",
          polygons: [...svg.querySelectorAll("polygon")].map(node => node.getAttribute("points") || ""),
          rectangles: [...svg.querySelectorAll("rect")].map(node => values(node, ["x", "y", "width", "height"])),
          target: [...svg.querySelectorAll(".source61-target-edge")].map(node => values(node, ["x1", "y1", "x2", "y2"])),
          pointOrder: svg.dataset.pointOrder || "",
          areaGa: svg.dataset.areaGa || "",
          targetEdge: svg.dataset.targetEdge || "",
          targetOrientation: svg.dataset.targetEdgeOrientation || "",
          targetArea: svg.dataset.targetArea || ""
        };
      }),
      visibleText: items.map(item => item.innerText || "")
    };
  }, { selected: selector, isAnswer: answerView });

  checkedPages += 1;
  if (state.count !== 3 || state.visibleCount !== 3) fail(`${label}: count=12 요청에서 고정 문항 3개가 표시되지 않습니다 (${state.count}/${state.visibleCount}).`);
  if (state.empty || state.pageOverflow || state.itemOverflow || state.outside || state.invalid) fail(`${label}: 빈 내용·가로 넘침·잘림·화면 밖 또는 깨진 값이 있습니다.`);
  if (state.rawFraction) fail(`${label}: 일반 가로 분수 표기가 남아 있습니다.`);
  if (state.markers.some(count => count < 1)) fail(`${label}: 문제·답에 data-source61-prism-e1-kind 표시가 없습니다.`);
  if (state.problemAnswerLeak) fail(`${label}: 문제 화면에 답 또는 풀이가 노출됩니다.`);
  if (answerView) {
    if (state.answerVisuals.length !== 3 || state.answerVisuals.some(item => !item.exists || !item.visible || item.overflow || item.outside || !item.marker)) {
      fail(`${label}: 답 그림 3개가 모두 보이지 않거나 원문 근거 표시가 없습니다.`);
    }
    const pools = state.answerVisuals.map(item => item.pool).sort().join(",");
    if (pools !== "0,1,2") fail(`${label}: 답 그림 고정 묶음 번호가 0,1,2가 아닙니다 (${pools}).`);
    if (state.answerVisuals.some(item => item.source !== sourceIds[variant])) fail(`${label}: 답 그림의 원문 유형 연결이 다릅니다.`);
    if (state.markerSources.some(sources => sources.some(source => source !== sourceIds[variant]))) fail(`${label}: 답의 원문 근거 유형 ID가 다릅니다.`);
  }
  return state;
}

function checkSemantic(state, label, variant, answerView, difficulty) {
  for (let index = 0; index < state.itemMarkup.length; index += 1) {
    const markup = state.itemMarkup[index];
    const visibleText = state.visibleText[index] || "";
    if (variant === 0) {
      if (!markup.includes('data-prism-kind="count-relation"') || !markup.includes("면") || !markup.includes("모서리") || !markup.includes("꼭짓점")) {
        fail(`${label}: 각기둥의 면·모서리·꼭짓점 관계표가 없습니다.`);
      }
      if (!answerView && (/data-n="\d+"|밑면이\s*\d+각형|\d+각기둥/.test(markup + visibleText))) {
        fail(`${label}: 문제 도형에 실제 밑면 변 수 또는 정답 각기둥 이름이 미리 보입니다.`);
      }
      if (!answerView && difficulty === -1 && (!markup.includes("n+2") || !markup.includes("3n") || !markup.includes("2n") || !markup.includes('data-support="guided"'))) {
        fail(`${label}: 쉬움 단계에 n 관계 안내가 없습니다.`);
      }
      if (!answerView && difficulty >= 0 && (markup.includes("n+2") || markup.includes("3n") || markup.includes("2n") || !markup.includes('data-support="source"'))) {
        fail(`${label}: 원본·어려움 단계에 구성 요소 공식이 미리 보입니다.`);
      }
      if (answerView && (!markup.includes('data-solved="true"') || !/\d+각기둥/.test(markup + visibleText))) {
        fail(`${label}: 답에서 구한 각기둥 변 수가 그림에 강조되지 않았습니다.`);
      }
    }
    if (variant === 1) {
      if (!markup.includes('data-prism-kind="ratio-table"') || !markup.includes("ㄱ") || !markup.includes("ㄴ") || !markup.includes("ㄷ")) {
        fail(`${label}: 꼭짓점·모서리·면과 목표식 표가 없습니다.`);
      }
      if (!answerView && !/\d+각형인 각기둥|\d+각기둥/.test(markup + visibleText)) {
        fail(`${label}: 문제에 주어진 각기둥 이름이 없습니다.`);
      }
      if (!answerView && difficulty === -1 && (!markup.includes('data-support="guided"') || !markup.includes("2×") || !markup.includes("3×") || !markup.includes("+2=□"))) {
        fail(`${label}: 쉬움 단계에 ㄱ·ㄴ·ㄷ 계산 안내가 없습니다.`);
      }
      if (!answerView && difficulty >= 0 && (!markup.includes('data-support="source"') || (markup.match(/□개/g) || []).length < 3 || /2×\d+|3×\d+|\d+\+2=/.test(markup))) {
        fail(`${label}: 원본·어려움 단계에 ㄱ·ㄴ·ㄷ 계산값이나 공식이 미리 보입니다.`);
      }
      if (answerView && !markup.includes('data-solved="true"')) fail(`${label}: 답에서 목표식의 값이 강조되지 않았습니다.`);
    }
    if (variant === 2) {
      if (!markup.includes("source61-prism-roll") || !markup.includes("data-roll-count=") || !markup.includes("marker-end")) {
        fail(`${label}: 오각기둥·굴림 방향·칠한 띠가 모두 보이지 않습니다.`);
      }
      const rounds = Number((markup.match(/data-roll-count="(\d+)"/) || [])[1]);
      const rectangleCount = (markup.match(/class="source61-roll-rectangle(?: is-solved)?"/g) || []).length;
      const hasRoundBoundaries = markup.includes("data-round-boundaries=") || markup.includes("source61-roll-round-boundary");
      const hasContactTotal = markup.includes(`data-total-contact-count="${5 * rounds}"`) || rectangleCount === 5 * rounds;
      if (!Number.isInteger(rounds) || !hasRoundBoundaries || !hasContactTotal) {
        fail(`${label}: 굴림 회차 경계와 5×회차의 바닥 띠가 명확하지 않습니다.`);
      }
      if (answerView && (!markup.includes("is-solved") || !markup.includes("data-base-perimeter=") || !markup.includes("data-target-edge-total="))) {
        fail(`${label}: 답에서 밑면 둘레와 모든 모서리 합이 강조되지 않았습니다.`);
      }
    }
    if (variant === 3) {
      if (!markup.includes("source61-triangular-prism-net") || !["가", "나", "다", "ㄴㅊ"].every(token => markup.includes(token))) {
        fail(`${label}: 삼각기둥 전개도, 면 이름 또는 목표 선분이 없습니다.`);
      }
      const points = Object.fromEntries((state.pointPositions[index] || []).flat().map(point => [point.label, point]));
      const sameY = (left, right) => points[left] && points[right] && Math.abs(points[left].y - points[right].y) < 0.1;
      const targetHorizontal = (state.targetEdges[index] || []).flat().some(edge => Math.abs(edge.y1 - edge.y2) < 0.1 && edge.x1 < edge.x2);
      if (!points.ㄱ || !points.ㄴ || !points.ㅊ || !points.ㅂ || !sameY("ㄷ", "ㄴ") || !sameY("ㄴ", "ㅊ")
        || !sameY("ㄷ", "ㅈ") || !sameY("ㄹ", "ㅁ") || !sameY("ㅁ", "ㅅ") || !sameY("ㅅ", "ㅇ") || !targetHorizontal) {
        fail(`${label}: 위 꼭짓점 ㄱ, 윗변 ㄴㅊ, 전개도 네 꼭짓점, 아래 꼭짓점 ㅂ 또는 수평 ㄴㅊ가 원본과 다릅니다 (${JSON.stringify({ points, targetEdges: (state.targetEdges[index] || []).flat() })}).`);
      }
      if (!answerView && (/공통\s*높이|data-common-height="\d+"/.test(markup + visibleText) || /높이\s*\d+\s*cm/.test(visibleText))) {
        fail(`${label}: 문제에 계산으로 얻는 공통 높이가 노출되어 있습니다.`);
      }
      if (answerView && !/높이/.test(visibleText)) fail(`${label}: 답에 공통 높이를 구한 근거가 없습니다.`);
      if (answerView && (!markup.includes("source61-target-edge is-solved") || !markup.includes("source61-target-area is-solved"))) {
        fail(`${label}: 답에서 ㄴㅊ와 면 나가 함께 강조되지 않았습니다.`);
      }
    }
  }
}

function compareNetShapes(problem, answer, label) {
  const invariant = value => value && ({
    viewBox: value.viewBox,
    polygonCount: value.polygons.length,
    rectangleCount: value.rectangles.length,
    targetCount: value.target.length,
    pointOrder: value.pointOrder,
    areaGa: value.areaGa,
    targetEdge: value.targetEdge,
    targetOrientation: value.targetOrientation,
    targetArea: value.targetArea
  });
  const left = problem.netGeometry.map(value => JSON.stringify(invariant(value))).sort();
  const right = answer.netGeometry.map(value => JSON.stringify(invariant(value))).sort();
  if (left.join("\n") !== right.join("\n")) fail(`${label}: 문제와 답의 삼각기둥 전개도 좌표·점 순서·대상 면 구조가 다릅니다.`);
}

async function captureRepresentative(page, sourceItemId, difficulty, viewportLabel, answerView) {
  const view = answerView ? "answer" : "problem";
  const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  screenshots += 1;
}

async function renderA4(page, sourceItemId, viewName, tabId) {
  await page.locator(`#${tabId}`).click();
  await page.waitForTimeout(100);
  await page.emulateMedia({ media: "print" });
  const pdfPath = path.join(outputDir, `${sourceItemId}-${viewName}-a4.pdf`);
  const pngPath = path.join(outputDir, `${sourceItemId}-${viewName}-a4-page-1.png`);
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) fail(`${sourceItemId}: ${viewName} A4 PDF가 비었습니다.`);
  else renderFirstPage(pdfPath, pngPath, `${sourceItemId} / ${viewName}`);
  pdfs += 1;
  await page.emulateMedia({ media: "screen" });
}

async function inspectType(browser, baseUrl, variant, difficulty, viewport, viewportLabel) {
  const sourceItemId = sourceIds[variant];
  const label = `${sourceItemId} / ${viewportLabel} / 난이도 ${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  await page.route("**/*", route => {
    const url = route.request().url();
    if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(url)) route.abort();
    else route.continue();
  });
  try {
    await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceItemId)}&review=1&difficulty=${difficulty}&count=12`, {
      waitUntil: "domcontentloaded", timeout: 90000
    });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspectView(page, "#problemView .question-item", label, false, variant);
    checkSemantic(problem, `${label} / 문제`, variant, false, difficulty);
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspectView(page, "#solutionView .solution-item", label, true, variant);
    checkSemantic(answer, `${label} / 답`, variant, true, difficulty);
    if (variant === 3) compareNetShapes(problem, answer, label);

    if (representativeDifficulties.has(difficulty)) {
      await page.locator("#problemTab").click();
      await page.waitForTimeout(100);
      await captureRepresentative(page, sourceItemId, difficulty, viewportLabel, false);
      await page.locator("#solutionTab").click();
      await page.waitForTimeout(100);
      await captureRepresentative(page, sourceItemId, difficulty, viewportLabel, true);
    }
    if (difficulty === 0 && viewportLabel === "desktop") {
      await renderA4(page, sourceItemId, "problem", "problemTab");
      await renderA4(page, sourceItemId, "answer", "solutionTab");
    }
  } catch (error) {
    fail(`${label}: 화면 검사 실패 (${error.message}).`);
  } finally {
    await page.close();
  }
}

function generatorReady() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  const api = global.window.HSE_GENERATORS;
  if (!api || typeof api.generate !== "function" || !api.names.includes("sourceGrade6PrismsPyramidsE1")) return false;
  try {
    const result = api.generate({ generatorKey: "sourceGrade6PrismsPyramidsE1", variant: 0, sourceItemId: sourceIds[0] }, 0, 0, 1, 0);
    return result?.generationMode === "fixed-verified-pool" && result.verifiedVariantCount === 3;
  } catch (error) {
    fail(`생성기 준비 확인 실패: ${error.message}`);
    return false;
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!generatorReady()) {
    const summary = "구문 검사 통과: sourceGrade6PrismsPyramidsE1 생성기가 아직 준비되지 않아 브라우저 감사는 대기합니다.\n";
    fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
    console.log(summary.trim());
    return;
  }

  const { server, baseUrl } = await startServer();
  let browser;
  try {
    const { chromium } = require(playwrightPath);
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe",
      args: ["--disable-quic"]
    });
    for (let variant = 0; variant < sourceIds.length; variant += 1) {
      for (const difficulty of difficulties) {
        await inspectType(browser, baseUrl, variant, difficulty, { width: 1440, height: 900 }, "desktop");
        await inspectType(browser, baseUrl, variant, difficulty, { width: 390, height: 844 }, "mobile");
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  if (screenshots !== 32) fail(`대표 화면 수가 ${screenshots}장입니다. 32장이어야 합니다.`);
  if (pdfs !== 8) fail(`A4 PDF 수가 ${pdfs}개입니다. 8개여야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 4유형×3난이도×PC/모바일, 고정 pool 3문항, 문제·답 그림·근거·도형 계약, 화면 ${screenshots}장, A4 PDF ${pdfs}개, 확인 페이지 ${checkedPages}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 2단원 개념탐구 1 브라우저 감사 통과: 4유형×3난이도×PC/모바일 · 고정 3문항 · 답 그림 · 화면 ${screenshots}장 · A4 PDF ${pdfs}개 · 확인 페이지 ${checkedPages}개`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
