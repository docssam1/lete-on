"use strict";

// Read-only browser and print audit for the five verified E4 source types.
// All generated evidence is written below tmp/ and is intentionally untracked.
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(questionBankDir, "tmp", "e4-browser-audit");

const sources = [
  { id: "6-1-u2-e4-example-4-1", search: "예제 4-1", kind: "cube-six-pyramid-assembly", poolCount: 1 },
  { id: "6-1-u2-e4-example-4-2", search: "예제 4-2", kind: "pyramid-vertex-truncation", poolCount: 3 },
  { id: "6-1-u2-e4-example-4-4", search: "예제 4-4", kind: "tetrahedron-midpoint-quadrilateral", poolCount: 3 },
  { id: "6-1-u2-e4-mission-1", search: "Mission 1", kind: "prism-pyramid-base-join", poolCount: 3 },
  { id: "6-1-u2-e4-mission-4", search: "Mission 4", kind: "pyramid-base-to-base", poolCount: 3 }
];
const difficulties = [-1, 0, 1];
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expectedAnswers = [
  ["74"],
  ["38", "50", "62"],
  ["48cm", "60cm", "72cm"],
  ["면 7개, 모서리 12개, 꼭짓점 7개", "면 9개, 모서리 16개, 꼭짓점 9개", "면 11개, 모서리 20개, 꼭짓점 11개"],
  ["26", "32", "38"]
];

const failures = [];
const findings = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
let checkedViews = 0;
const fail = message => failures.push(message);
const invalidText = text => /undefined|null|NaN|Infinity|SyntaxError/.test(String(text || ""));

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(`${repoRoot}${path.sep}`) ? file : null;
}

function contentType(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" })[path.extname(file)] || "application/octet-stream";
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

function pdfPageCount(pdfPath) {
  const output = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  return Number(output.match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
}

function inkPixels(pngPath) {
  const png = PNG.sync.read(fs.readFileSync(pngPath));
  let count = 0;
  for (let y = Math.floor(png.height * .05); y < Math.floor(png.height * .95); y += 1) {
    for (let x = Math.floor(png.width * .03); x < Math.floor(png.width * .97); x += 1) {
      const offset = (y * png.width + x) * 4;
      if (png.data[offset] < 185 || png.data[offset + 1] < 185 || png.data[offset + 2] < 185) count += 1;
    }
  }
  return count;
}

function renderPdfPages(pdfPath, prefix, label) {
  try {
    const expected = pdfPageCount(pdfPath);
    const directory = path.dirname(prefix);
    const stem = path.basename(prefix);
    for (const file of fs.readdirSync(directory).filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name))) fs.unlinkSync(path.join(directory, file));
    execFileSync("pdftoppm", ["-png", pdfPath, prefix], { stdio: "ignore" });
    const pages = fs.readdirSync(directory)
      .filter(name => new RegExp(`^${stem}-\\d+\\.png$`).test(name))
      .sort((a, b) => Number(a.match(/-(\d+)\.png$/)[1]) - Number(b.match(/-(\d+)\.png$/)[1]));
    if (!expected || pages.length !== expected) fail(`${label}: A4 ${expected}쪽 중 ${pages.length}쪽만 PNG로 렌더되었습니다.`);
    for (const page of pages) {
      const pagePath = path.join(directory, page);
      if (fs.statSync(pagePath).size < 5000 || inkPixels(pagePath) < 1200) fail(`${label}: ${page}가 비었거나 잘린 페이지입니다.`);
    }
    renderedPages += pages.length;
  } catch (error) {
    fail(`${label}: A4 전체 페이지 렌더 실패 (${error.message})`);
  }
}

function checkPdf(pdfPath, prefix, label) {
  if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) {
    fail(`${label}: A4 PDF가 비었습니다.`);
    return;
  }
  pdfs += 1;
  renderPdfPages(pdfPath, prefix, label);
}

function attachListeners(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 예외 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/Failed to load resource.*(?:404|ERR_[A-Z_]+)/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
}

async function selectType(page, baseUrl, source, difficulty) {
  await page.goto(`${baseUrl}?type=${encodeURIComponent(source.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
  await page.locator("#problemView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
}

function normalizedDataset(svg) {
  if (!svg) return "";
  const keys = ["source61E4Structure", "source61E4Geometry", "baseSides", "finalTopology", "resultContract"];
  return keys.map(key => `${key}:${svg.dataset[key] || ""}`).join("|");
}

async function inspectView(page, source, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(({ sourceId, kind, isAnswer }) => {
    const selector = isAnswer ? "#solutionView .solution-item" : "#problemView .question-item";
    const items = [...document.querySelectorAll(selector)];
    const visible = element => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const boxOutside = element => {
      const box = element?.getBoundingClientRect();
      return !box || box.left < -2 || box.right > document.documentElement.clientWidth + 2 || box.top < -2;
    };
    const clipped = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return ((style.overflowX === "hidden" || style.overflowX === "clip") && element.scrollWidth > element.clientWidth + 1)
        || ((style.overflowY === "hidden" || style.overflowY === "clip") && element.scrollHeight > element.clientHeight + 1);
    };
    const overlap = (left, right) => {
      const x = Math.max(0, Math.min(left.right, right.right) - Math.max(left.left, right.left));
      const y = Math.max(0, Math.min(left.bottom, right.bottom) - Math.max(left.top, right.top));
      return x * y / Math.max(1, Math.min(left.width * left.height, right.width * right.height));
    };
    const svgState = svg => {
      const box = svg?.getBoundingClientRect();
      const viewBox = svg?.getAttribute("viewBox") || "";
      const parts = viewBox.trim().split(/\s+/).map(Number);
      const expectedRatio = parts.length === 4 ? parts[2] / parts[3] : 0;
      const actualRatio = box?.height ? box.width / box.height : 0;
      const textNodes = [...(svg?.querySelectorAll("text") || [])].map(node => ({
        text: String(node.textContent || "").replace(/\s+/g, " ").trim(),
        box: (() => { const b = node.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width, height: b.height }; })()
      }));
      const overlaps = [];
      for (let i = 0; i < textNodes.length; i += 1) for (let j = i + 1; j < textNodes.length; j += 1) {
        if (textNodes[i].box.width > 2 && textNodes[j].box.width > 2 && overlap(textNodes[i].box, textNodes[j].box) > .32) overlaps.push(`${textNodes[i].text}|${textNodes[j].text}`);
      }
      const font = svg?.querySelector("text") ? getComputedStyle(svg.querySelector("text")).fontFamily : "";
      const segments = [...(svg?.querySelectorAll("[data-solid-edge]") || [])].map(node => [
        Number(node.getAttribute("x1")), Number(node.getAttribute("y1")),
        Number(node.getAttribute("x2")), Number(node.getAttribute("y2"))
      ]).filter(segment => segment.every(Number.isFinite));
      const crosses = (a, b) => {
        const [x1, y1, x2, y2] = a, [x3, y3, x4, y4] = b;
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denominator) < 1e-7) return false;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;
        return t > .03 && t < .97 && u > .03 && u < .97;
      };
      let edgeCrossings = 0;
      for (let i = 0; i < segments.length; i += 1) for (let j = i + 1; j < segments.length; j += 1) if (crosses(segments[i], segments[j])) edgeCrossings += 1;
      return {
        exists: Boolean(svg),
        visible: visible(svg),
        outside: boxOutside(svg),
        clipped: clipped(svg),
        width: box?.width || 0,
        height: box?.height || 0,
        drawingWidth: (() => { try { return svg.getBBox().width; } catch (_) { return 0; } })(),
        drawingHeight: (() => { try { return svg.getBBox().height; } catch (_) { return 0; } })(),
        viewBox,
        expectedRatio,
        actualRatio,
        structure: svg?.dataset.source61E4Structure || "",
        geometry: svg?.dataset.source61E4Geometry || "",
        baseSides: svg?.dataset.baseSides || "",
        finalTopology: svg?.dataset.finalTopology || "",
        resultHighlight: svg?.dataset.resultHighlight || "",
        answerFaces: svg?.querySelectorAll("[data-solid-face]").length || 0,
        answerEdges: svg?.querySelectorAll("[data-solid-edge]").length || 0,
        answerVertices: svg?.querySelectorAll("[data-solid-vertex]").length || 0,
        facesByKind: [...(svg?.querySelectorAll("[data-solid-face]") || [])].reduce((map, node) => { const key = node.dataset.solidFace || ""; map[key] = (map[key] || 0) + 1; return map; }, {}),
        edgesByKind: [...(svg?.querySelectorAll("[data-solid-edge]") || [])].reduce((map, node) => { const key = node.dataset.solidEdge || ""; map[key] = (map[key] || 0) + 1; return map; }, {}),
        verticesByKind: [...(svg?.querySelectorAll("[data-solid-vertex]") || [])].reduce((map, node) => { const key = node.dataset.solidVertex || ""; map[key] = (map[key] || 0) + 1; return map; }, {}),
        hiddenEdges: svg?.querySelectorAll(".source61-e4-hidden-edge").length || 0,
        cutPlanes: svg?.querySelectorAll(".source61-e4-cut-plane").length || 0,
        cutMarks: svg?.querySelectorAll(".source61-e4-cut-mark").length || 0,
        midpoints: svg?.querySelectorAll(".source61-e4-midpoint").length || 0,
        section: svg?.querySelectorAll(".source61-e4-section-highlight").length || 0,
        separate: svg?.querySelectorAll(".source61-e4-separate-solid,.source61-e4-separate-pyramid").length || 0,
        edgeCrossings,
        font,
        overlaps,
        rawMarkup: svg?.outerHTML || ""
      };
    };
    const answerVisuals = items.map(item => item.querySelector(":scope > .solution-answer-visual"));
    const wrappers = answerVisuals.map(item => item?.querySelector(":scope > .source61-answer-diagram"));
    const bodyText = document.body.innerText || "";
    return {
      count: items.length,
      visibleCount: items.filter(visible).length,
      empty: items.some(item => !String(item.textContent || "").replace(/\s+/g, " ").trim()),
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: items.some(item => item.scrollWidth > item.clientWidth + 2),
      itemOutside: items.some(boxOutside),
      itemClipped: items.some(clipped),
      invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(bodyText),
      rawFraction: /\b\d+\s*\/\s*\d+\b/.test(bodyText),
      bodyText,
      items: items.map(item => ({
        text: item.innerText || "",
        svg: svgState(item.querySelector("svg.source61-e4-diagram")),
        evidence: [...item.querySelectorAll("[data-source61-prism-e4-kind]")].map(node => ({ kind: node.dataset.source61PrismE4Kind || "", source: node.dataset.sourceItem || "", values: node.dataset.values || "", difficulty: node.dataset.difficultyDesign || "" }))
      })),
      answerVisuals: wrappers.map(wrapper => ({
        exists: Boolean(wrapper),
        visible: visible(wrapper),
        outside: boxOutside(wrapper),
        clipped: clipped(wrapper),
        source: wrapper?.dataset.answerSource || "",
        pool: wrapper?.dataset.verifiedPoolIndex || "",
        svg: svgState(wrapper?.querySelector("svg.source61-e4-diagram"))
      })),
      problemAnswerLeak: isAnswer ? 0 : document.querySelectorAll("#problemView .solution-answer-visual,#problemView .solution-item,#problemView [data-answer-source],#problemView [data-result-highlight],#problemView [data-solid-face],#problemView [data-solid-edge],#problemView [data-solid-vertex],#problemView .is-solved").length,
      problemResultAttributes: isAnswer ? 0 : [...document.querySelectorAll("#problemView svg.source61-e4-diagram")].filter(svg => /data-result-highlight=|data-solid-face=|data-solid-edge=|data-solid-vertex=|class=\"[^\"]*is-solved/.test(svg.outerHTML)).length,
      sourceMarkers: items.map(item => [...item.querySelectorAll("[data-source61-prism-e4-kind]")].map(node => ({ kind: node.dataset.source61PrismE4Kind || "", source: node.dataset.sourceItem || "", difficulty: node.dataset.difficultyDesign || "" })))
    };
  }, { sourceId: source.id, kind: source.kind, isAnswer: answerView });
  checkedViews += 1;
  const expectedCount = source.poolCount;
  const label = `${source.id} / ${viewportLabel} / 난이도 ${difficulty} / ${answerView ? "답" : "문제"}`;
  if (state.count !== expectedCount || state.visibleCount !== expectedCount) fail(`${label}: 고정 문항 ${expectedCount}개가 모두 표시되지 않았습니다 (${state.count}/${state.visibleCount}).`);
  if (state.empty || state.pageOverflow || state.itemOverflow || state.itemOutside || state.itemClipped || state.invalid || state.rawFraction) fail(`${label}: 빈 내용·넘침·잘림·화면 밖·깨진 값 또는 가로 분수가 있습니다.`);
  if (state.problemAnswerLeak || state.problemResultAttributes) fail(`${label}: 문제 화면에 답 전용 요소 또는 결과 속성이 노출되었습니다.`);
  if (state.items.some(item => !item.svg.exists || !item.svg.visible || item.svg.outside || item.svg.clipped || item.svg.drawingWidth <= 0 || item.svg.drawingHeight <= 0)) fail(`${label}: 도형이 비어 있거나 화면 밖·잘림 상태입니다.`);
  if (state.items.some(item => Math.abs(item.svg.actualRatio - item.svg.expectedRatio) > .035)) fail(`${label}: SVG viewBox와 실제 화면 비율이 다릅니다.`);
  if (state.items.some(item => !item.svg.font.includes("Pretendard") || !item.svg.font.includes("Malgun Gothic") || !item.svg.font.includes("Arial"))) fail(`${label}: E4 도형 글꼴 공통화가 적용되지 않았습니다.`);
  if (state.items.some(item => item.svg.overlaps.length)) fail(`${label}: 도형 안의 글자 상자가 겹칩니다 (${state.items.map(item => item.svg.overlaps.join(",")).filter(Boolean).join("; ")}).`);
  if (state.sourceMarkers.some(markers => markers.length !== 1 || markers[0].kind !== source.kind || markers[0].source !== source.id || markers[0].difficulty !== difficultyNames[String(difficulty)])) fail(`${label}: 원문 유형·난이도 검산 표식이 다릅니다.`);
  if (answerView) {
    if (state.answerVisuals.length !== expectedCount || state.answerVisuals.some(item => !item.exists || !item.visible || item.outside || item.clipped || !item.svg.exists || !item.svg.visible)) fail(`${label}: 답 그림이 모두 보이지 않거나 잘렸습니다.`);
    if (state.answerVisuals.map(item => item.pool).sort((a, b) => Number(a) - Number(b)).join(",") !== Array.from({ length: expectedCount }, (_, index) => index).join(",")) fail(`${label}: 고정 pool 번호가 0부터 모두 나오지 않습니다.`);
    if (state.answerVisuals.some(item => item.source !== source.id || !item.svg.resultHighlight || !item.svg.rawMarkup.includes("is-solved"))) fail(`${label}: 답 그림의 원문 연결·결과 표시·완성 상태가 없습니다.`);
    if (source.kind !== "cube-six-pyramid-assembly" && state.answerVisuals.some(item => item.svg.hiddenEdges < 1)) fail(`${label}: 답 그림에 가려진 모서리 점선이 없습니다.`);
    if (source.kind === "cube-six-pyramid-assembly" && state.answerVisuals.some(item => item.svg.edgeCrossings > 20)) fail(`${label}: 답 그림의 선 교차가 과도하여 정육면체와 여섯 사각뿔의 구조가 별 모양처럼 겹쳐 보입니다. 가시성 검수에서 잠급니다.`);
  }
  for (const item of state.items) {
    if (item.evidence.length !== 1 || item.evidence[0].kind !== source.kind || item.evidence[0].source !== source.id || item.evidence[0].difficulty !== difficultyNames[String(difficulty)]) fail(`${label}: 문항별 원문 검산 연결이 다릅니다.`);
  }
  return state;
}

function evidenceNumber(item) {
  const values = item?.evidence?.[0]?.values || "";
  const match = String(values).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function checkTopology(source, problem, answer, label) {
  for (const item of problem.items) {
    if (source.kind === "pyramid-vertex-truncation" && item.svg.cutMarks !== 4 * evidenceNumber(item)) fail(`${label}: 문제의 절단 표시 수가 n과 다릅니다.`);
  }
  for (const [index, item] of answer.answerVisuals.entries()) {
    const svg = item.svg;
    if (source.kind === "cube-six-pyramid-assembly") {
      if (svg.facesByKind["stellated-cube"] !== 24 || svg.edgesByKind["stellated-cube"] !== 36 || svg.verticesByKind["stellated-cube"] !== 14 || svg.separate || !svg.rawMarkup.includes("source61-e4-counting-net")) fail(`${label}: 정육면체+사각뿔의 펼친 세기 그림 또는 실제 24면·36모서리·14꼭짓점 표시가 없습니다.`);
    } else if (source.kind === "pyramid-vertex-truncation") {
      const n = Number(item.svg.baseSides) || evidenceNumber(answer.items[index]);
      if (![3, 4, 5].includes(n) || svg.facesByKind["truncated-pyramid"] !== 2 * n + 2 || svg.edgesByKind["truncated-pyramid"] !== 6 * n || svg.verticesByKind["truncated-pyramid"] !== 4 * n) fail(`${label}: ${n}각뿔 절단 후 요소 수가 공식과 다릅니다.`);
    } else if (source.kind === "tetrahedron-midpoint-quadrilateral") {
      if (svg.facesByKind.tetrahedron !== 4 || svg.edgesByKind.tetrahedron !== 6 || svg.verticesByKind.tetrahedron !== 4 || svg.midpoints !== 4 || svg.section !== 1) fail(`${label}: 정사면체의 면·모서리·꼭짓점 또는 가운데점 사각형이 다릅니다.`);
    } else if (source.kind === "prism-pyramid-base-join") {
      const n = Number(item.svg.baseSides) || (svg.answerVertices - 1) / 2 || evidenceNumber(answer.items[index]);
      if (![3, 4, 5].includes(n) || svg.facesByKind["prism-pyramid"] !== 2 * n + 1 || svg.edgesByKind["prism-pyramid"] !== 4 * n || svg.verticesByKind["prism-pyramid"] !== 2 * n + 1 || svg.separate) fail(`${label}: 각기둥+각뿔을 붙인 뒤의 실제 요소 수가 ${n}에 맞지 않습니다.`);
    } else if (source.kind === "pyramid-base-to-base") {
      const n = Number(item.svg.baseSides) || svg.answerVertices - 2 || evidenceNumber(answer.items[index]);
      if (![4, 5, 6].includes(n) || svg.facesByKind.bipyramid !== 2 * n || svg.edgesByKind.bipyramid !== 3 * n || svg.verticesByKind.bipyramid !== n + 2 || svg.separate) fail(`${label}: 두 각뿔을 붙인 뒤의 실제 요소 수가 ${n}에 맞지 않습니다.`);
    }
  }
}

function compareProblemAnswer(problem, answer, source, label) {
  const mismatches = [];
  problem.items.forEach((item, index) => {
    const answerItem = answer.answerVisuals[index];
    const answerText = answer.items[index]?.text || "";
    const problemValues = String(item.evidence[0]?.values || "").split(",").filter(Boolean);
    if (!answerItem || item.svg.structure !== answerItem.svg.structure || item.svg.geometry !== answerItem.svg.geometry) mismatches.push(`${index + 1}:structure`);
    if (source.kind === "prism-pyramid-base-join") {
      const answerN = (answerItem?.svg.answerVertices - 1) / 2;
      if (answerN !== Number(problemValues[0])) mismatches.push(`${index + 1}:n`);
    } else if (source.kind === "pyramid-base-to-base") {
      const answerN = answerItem?.svg.answerVertices - 2;
      if (answerN !== Number(problemValues[0])) mismatches.push(`${index + 1}:n`);
    } else if (problemValues.some(value => !answerText.includes(value))) mismatches.push(`${index + 1}:data`);
  });
  if (mismatches.length) fail(`${label}: 문제와 답의 구조 지문·도형 지문·n/자료가 다릅니다 (${mismatches.join(", ")}).`);
  if (answer.answerVisuals.some(item => item.svg.rawMarkup.includes("data-final-topology=\"unknown\""))) fail(`${label}: 답 SVG가 미완성 토폴로지로 표시됩니다.`);
  if (problem.items.some(item => item.svg.rawMarkup.includes("data-result-highlight=") || item.svg.rawMarkup.includes("data-solid-"))) fail(`${label}: 문제 SVG에 답 전용 결과 정보가 있습니다.`);
  if (source.kind === "tetrahedron-midpoint-quadrilateral" && problem.items.some(item => !item.text.includes("사각형의 둘레"))) fail(`${label}: 문제에 가운데점 사각형의 주어진 둘레가 없습니다.`);
}

async function capture(page, source, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${source.id}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${source.id}: ${view}/${viewportLabel} 캡처가 비었거나 잘렸습니다.`);
  screenshots += 1;
}

async function captureA4(page, source, view, tabId) {
  await page.locator(`#${tabId}`).click();
  await page.waitForTimeout(100);
  await page.emulateMedia({ media: "print" });
  const pdf = path.join(outputDir, `${source.id}-${view}-a4.pdf`);
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  checkPdf(pdf, pdf.replace(/\.pdf$/, "-page"), `${source.id} / ${view}`);
  await page.emulateMedia({ media: "screen" });
}

async function inspectType(browser, baseUrl, source, difficulty, viewport, viewportLabel) {
  const label = `${source.id} / ${viewportLabel} / 난이도 ${difficulty}`;
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  attachListeners(page, label);
  await page.route("**/*", route => {
    if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url())) route.abort();
    else route.continue();
  });
  try {
    await selectType(page, baseUrl, source, difficulty);
    const problem = await inspectView(page, source, difficulty, false, viewportLabel);
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible", timeout: 10000 });
    const answer = await inspectView(page, source, difficulty, true, viewportLabel);
    checkTopology(source, problem, answer, label);
    compareProblemAnswer(problem, answer, source, label);
    for (const [index, item] of answer.answerVisuals.entries()) {
      const pool = Number(item.pool);
      const expected = expectedAnswers[sources.indexOf(source)][pool];
      const answerText = answer.items[index]?.text || "";
      if (!Number.isInteger(pool) || !expected || !answerText.includes(expected)) fail(`${label}: pool ${pool}의 공식 답 표시가 예상 답과 다릅니다.`);
    }
    await page.locator("#problemTab").click();
    await capture(page, source, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await capture(page, source, difficulty, viewportLabel, "answer");
    if (difficulty === 0 && viewportLabel === "desktop") {
      await captureA4(page, source, "problem", "problemTab");
      await captureA4(page, source, "answer", "solutionTab");
    }
    findings.push({ source: source.id, difficulty, viewport: viewportLabel, problemItems: problem.count, answerItems: answer.count, pools: answer.answerVisuals.map(item => Number(item.pool)), topology: answer.answerVisuals.map(item => ({ faces: item.svg.answerFaces, edges: item.svg.answerEdges, vertices: item.svg.answerVertices })) });
  } catch (error) {
    fail(`${label}: 브라우저 감사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

function generatorReady() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  const api = global.window.HSE_GENERATORS;
  if (!api?.names?.includes("sourceGrade6PrismsPyramidsE4")) { fail("E4 전용 생성기가 등록되지 않았습니다."); return false; }
  for (let variant = 0; variant < sources.length; variant += 1) {
    for (let pool = 0; pool < sources[variant].poolCount; pool += 1) {
      try {
        const generated = api.generate({ generatorKey: "sourceGrade6PrismsPyramidsE4", variant, sourceItemId: sources[variant].id }, 0, 0, 1000 + variant * 100 + pool, variant);
        if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== sources[variant].poolCount || generated.sourceItemId !== sources[variant].id) fail(`${sources[variant].id}: 고정 pool 생성기 계약이 다릅니다.`);
      } catch (error) { fail(`${sources[variant].id}: 생성기 준비 확인 실패 (${error.message})`); }
    }
  }
  return failures.length === 0;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!generatorReady()) throw new Error(failures.join("\n"));
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (const source of sources) for (const difficulty of difficulties) {
      await inspectType(browser, baseUrl, source, difficulty, { width: 1440, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, source, difficulty, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 60) fail(`화면 캡처 ${screenshots}장, 60장이어야 합니다.`);
  if (pdfs !== 10) fail(`A4 PDF ${pdfs}개, 10개이어야 합니다.`);
  if (renderedPages < pdfs) fail(`A4 전체 페이지 렌더가 부족합니다 (${renderedPages}쪽 / 최소 ${pdfs}쪽).`);
  const status = failures.length ? "실패" : "통과";
  const summary = `${status}: E4 5유형×3난이도×PC/모바일, 고정 pool 1·3·3·3·3, 문제·답 분리·SVG 지문·실제 토폴로지·글꼴·겹침·누출 검사; 화면 ${screenshots}장, A4 ${pdfs}개, 전체 PNG ${renderedPages}쪽, 확인 뷰 ${checkedViews}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  fs.writeFileSync(path.join(outputDir, "audit-detail.json"), JSON.stringify({ sources, difficulties, screenshots, pdfs, renderedPages, checkedViews, findings, failures }, null, 2), "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`6-1 2단원 개념탐구 4 E4 브라우저·인쇄 감사 통과: 5유형×3난이도 · 고정 pool 1·3·3·3·3 · 화면 60장 · A4 10개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
