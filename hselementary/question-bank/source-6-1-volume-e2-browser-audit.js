"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const dir = __dirname;
const root = path.resolve(dir, "..", "..");
const failures = [];
const fail = message => failures.push(message);
const difficultyBodies = new Map();
const allIds = [
  "6-1-u6-e2-exploration", "6-1-u6-e2-example-1", "6-1-u6-e2-example-2", "6-1-u6-e2-example-3", "6-1-u6-e2-example-4", "6-1-u6-e2-mission-1",
  "6-1-u6-e2-mission-2", "6-1-u6-e2-mission-3", "6-1-u6-e2-mission-4", "6-1-u6-e2-mission-5", "6-1-u6-e2-mission-6"
];
const ids = process.env.HSE_SOURCE_ITEM_ID
  ? allIds.filter(id => id === process.env.HSE_SOURCE_ITEM_ID)
  : allIds;
if (!ids.length) throw new Error(`알 수 없는 문항 ID: ${process.env.HSE_SOURCE_ITEM_ID}`);
const difficulties = process.env.HSE_DIFFICULTY ? [Number(process.env.HSE_DIFFICULTY)] : [-1, 0, 1];
const outputDir = process.env.HSE_SCREENSHOT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), "hse-volume-e2-browser-"));
const forbiddenLearnerNotation = /a≤b≤c|a²|[VS][₁₂₃₄₅]|\b(?:s|h|a|V|S|N)\b|\d\s*[sah](?=\s|$|[=×()+\-0-9])/;
const forbiddenTechnicalLabels = /원문 유형|고정 풀|sourceItemId|6-1-u6-e2-/;
const normalizedMathText = value => String(value || "")
  .replace(/cm\s*2/g, "cm²")
  .replace(/cm\s*3/g, "cm³")
  .replace(/m\s*2/g, "m²")
  .replace(/m\s*3/g, "m³");
const poppler = process.env.HSE_POPPLER_BIN || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin";
const pdfinfo = path.join(poppler, "pdfinfo.exe");
const pdftoppm = path.join(poppler, "pdftoppm.exe");
const python = process.env.HSE_PYTHON || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const expected = {
  exploration: [[30, 24, 6], [28, 20, 4], [36, 26, 5]],
  "example-1": [12, 24, 36],
  "example-2": [
    { length: 8, depth: 3, height: 3, heights: [3, 2, 1], rows: 4, surface: 98, volume: 48 },
    { length: 9, depth: 4, height: 6, heights: [3, 2, 1], rows: 4, surface: 192, volume: 144 },
    { length: 12, depth: 6, height: 3, heights: [3, 2, 1], rows: 4, surface: 228, volume: 144 }
  ],
  "example-3": [
    { width: 36, totalDepth: 40, lowDepth: 16, highStart: 20, highEnd: 16, lowHeight: 8, finalHeight: 14 },
    { width: 30, totalDepth: 30, lowDepth: 10, highStart: 22, highEnd: 18, lowHeight: 8, finalHeight: 16 },
    { width: 42, totalDepth: 42, lowDepth: 14, highStart: 24, highEnd: 18, lowHeight: 9, finalHeight: 17 }
  ],
  "example-4": [[3, 10, 4], [5, 9, 6], [7, 11, 5]],
  "mission-1": [48, 60, 72],
  "mission-2": [[110, 22, 14], [120, 24, 12], [96, 16, 8]],
  "mission-3": [10, 8, 12],
  "mission-4": [
    { boardLength: 25, boardDepth: 11, flatHeight: 1, cuboidLength: 10, cuboidDepth: 6, rightGap: 7, doubledHeight: 5 },
    { boardLength: 32, boardDepth: 12, flatHeight: 1, cuboidLength: 8, cuboidDepth: 6, rightGap: 8, doubledHeight: 7 },
    { boardLength: 28, boardDepth: 10, flatHeight: 1, cuboidLength: 8, cuboidDepth: 6, rightGap: 6, doubledHeight: 9 }
  ],
  "mission-5": [[8, 6, 12], [10, 7, 9], [12, 8, 10]],
  "mission-6": [5, 4, 6]
};

const mime = { ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".png": "image/png" };
function safeFile(url) {
  const relative = decodeURIComponent((url || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(root, relative || "index.html");
  return file === root || file.startsWith(root + path.sep) ? file : null;
}
async function startServer() {
  const server = http.createServer((request, response) => {
    if (request.url === "/audit") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/hselementary/question-bank/styles.css"><style>html,body{margin:0;padding:0}#audit{box-sizing:border-box;width:100%;max-width:760px;margin:0 auto;padding:28px 32px;color:#172b42}#audit article{box-sizing:border-box;margin:0 0 28px;padding:0 0 24px;border-bottom:1px solid #dce5ee;overflow:visible}#audit .answer-view article{padding-bottom:32px}#audit header{font-size:18px;font-weight:900;margin-bottom:10px}#audit p{font-size:14px;line-height:1.65}@media print{@page{size:A4;margin:16mm 14mm}#audit{max-width:none;padding:0}#audit article{break-inside:avoid}}</style></head><body><main id="audit"></main><script src="/hselementary/question-bank/generators.js"></script><script src="/hselementary/question-bank/math-notation.js"></script><script src="/hselementary/question-bank/source-inventory-grade6.js"></script><script src="/hselementary/question-bank/source-grade6-volume-e2.js"></script></body></html>`);
      return;
    }
    let file = safeFile(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": `${mime[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}/audit` };
}

function renderMath(markup) {
  const template = document.createElement("template");
  template.innerHTML = String(markup || "");
  const notation = window.HSE_MATH_NOTATION;
  const append = (target, tokens) => tokens.forEach(token => {
    if (token.type === "text") target.append(token.value);
    else if (token.type === "fraction") {
      const fraction = document.createElement("span"); fraction.className = "math-fraction";
      fraction.setAttribute("aria-label", notation.fractionAria(token));
      const numerator = document.createElement("span"); const denominator = document.createElement("span");
      append(numerator, token.numerator); append(denominator, token.denominator); fraction.append(numerator, denominator); target.append(fraction);
    } else if (token.type === "mixed") {
      const mixed = document.createElement("span"); mixed.className = "math-mixed-number";
      mixed.setAttribute("aria-label", notation.mixedAria(token)); mixed.append(token.whole); append(mixed, [token.fraction]); target.append(mixed);
    } else {
      const unit = document.createElement("span"); unit.className = "math-unit"; unit.append(token.base);
      const power = document.createElement("sup"); power.textContent = token.power; unit.append(power); target.append(unit);
    }
  });
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest("svg, .math-fraction, .math-unit")) return;
    const tokens = notation.tokenize(node.nodeValue);
    if (tokens.length === 1 && tokens[0].type === "text" && tokens[0].value === node.nodeValue) return;
    const fragment = document.createDocumentFragment(); append(fragment, tokens); node.replaceWith(fragment);
  });
  return template.innerHTML;
}

async function snapshot(page, phase, viewportName, sourceItemId, difficulty) {
  const state = await page.evaluate(({ phase: currentPhase, viewport: name, id, difficulty: level }) => {
    const view = document.querySelector(currentPhase === "problem" ? ".problem-view" : ".answer-view");
    const rect = node => { const value = node.getBoundingClientRect(); return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height }; };
    const svgState = svg => {
      const box = rect(svg); const viewBox = svg.viewBox.baseVal; const bbox = svg.getBBox();
      const texts = [...svg.querySelectorAll("text")].map(node => ({ value: node.textContent.trim(), role: node.dataset.visualElement || "", ...rect(node) })).filter(item => item.value);
      const overlaps = []; for (let i = 0; i < texts.length; i += 1) for (let j = i + 1; j < texts.length; j += 1) {
        const a = texts[i], b = texts[j]; if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) overlaps.push(`${a.value}<>${b.value}`);
      }
      const required = (svg.dataset.requiredElements || "").split(",").filter(Boolean);
      const visualRoles = [...svg.querySelectorAll("[data-visual-element]")].map(node => node.dataset.visualElement);
      const present = new Set(visualRoles);
      const roleCounts = visualRoles.reduce((counts, role) => ({ ...counts, [role]: (counts[role] || 0) + 1 }), {});
      const lines = [...svg.querySelectorAll("line[data-visual-element]")].map(node => ({ role: node.dataset.visualElement, x1: Number(node.getAttribute("x1")), y1: Number(node.getAttribute("y1")), x2: Number(node.getAttribute("x2")), y2: Number(node.getAttribute("y2")) }));
      const paths = [...svg.querySelectorAll("path[data-visual-element]")].map(node => ({ role: node.dataset.visualElement, d: node.getAttribute("d") || "", join: node.dataset.ropeJoin || "", style: node.dataset.ropeStyle || "", loops: node.dataset.ropeLoopCount || "", loop: node.dataset.ropeLoop || "", cells: node.dataset.cellCount || "" }));
      return { phase: svg.dataset.phase, model: svg.dataset.modelKey, values: svg.dataset.source61VolumeE2Values, required, missing: required.filter(role => !present.has(role)), roleCounts, lines, paths, box, bbox: { x: bbox.x, y: bbox.y, right: bbox.x + bbox.width, bottom: bbox.y + bbox.height, width: bbox.width, height: bbox.height }, view: { x: viewBox.x, y: viewBox.y, right: viewBox.x + viewBox.width, bottom: viewBox.y + viewBox.height }, texts, overlaps, solved: svg.querySelectorAll(".is-solved").length };
    };
    const items = [...view.querySelectorAll("article")].map(article => ({ source: article.dataset.source, pool: Number(article.dataset.pool), svgs: [...article.querySelectorAll("svg")].map(svgState), text: article.innerText, solution: article.querySelector(":scope > p")?.innerText || "" }));
    return { id, difficulty: level, name, phase: currentPhase, items, visible: !view.hidden, overflow: document.documentElement.scrollWidth > innerWidth + 1, broken: /undefined|null|NaN|Infinity|SyntaxError/.test(view.innerText), slash: /\d+\s*\/\s*\d+/.test(view.innerText), caret: /(?:cm|m)\^[23]/.test(view.innerText) };
  }, { phase, viewport: viewportName, id: sourceItemId, difficulty });
  return state;
}

function verify(problem, answer, sourceItemId, difficulty, viewport) {
  const label = `${sourceItemId}/d${difficulty}/${viewport}`;
  if (!problem.visible || !answer.visible || problem.items.length !== 3 || answer.items.length !== 3) fail(`${label}: 문제·답 3문항이 보이지 않습니다.`);
  [problem, answer].forEach((state, index) => {
    const phase = index ? "답" : "문제";
    if (state.overflow) fail(`${label}/${phase}: 가로 넘침`);
    if (state.broken || state.slash || state.caret) fail(`${label}/${phase}: 깨진 수식 또는 값`);
    state.items.forEach(item => item.svgs.forEach(svg => {
      if (svg.box.width <= 0 || svg.box.height <= 0 || svg.bbox.width <= 0 || svg.bbox.height <= 0) fail(`${label}/${phase}/pool${item.pool}: 빈 SVG`);
      if (svg.bbox.x < svg.view.x - 1 || svg.bbox.y < svg.view.y - 1 || svg.bbox.right > svg.view.right + 1 || svg.bbox.bottom > svg.view.bottom + 1) fail(`${label}/${phase}/pool${item.pool}: SVG viewBox 밖으로 잘림 ${JSON.stringify({ bbox: svg.bbox, view: svg.view })}`);
      if (svg.box.left < -2 || svg.box.right > (viewport === "mobile390" ? 390 : 1440) + 2) fail(`${label}/${phase}/pool${item.pool}: 화면 밖 SVG`);
      if (svg.missing.length || svg.overlaps.length) fail(`${label}/${phase}/pool${item.pool}: 필수 시각 요소 또는 텍스트 겹침 ${JSON.stringify({ missing: svg.missing, overlaps: svg.overlaps })}`);
      if (phase === "답" && svg.solved < 1) fail(`${label}/답/pool${item.pool}: 정답 그림에 계산 근거 강조가 없습니다.`);
    }));
    state.items.forEach(item => { if (forbiddenLearnerNotation.test(item.text)) fail(`${label}/${phase}/pool${item.pool}: 학습자 표시 영역에 문자식 기호가 남았습니다.`); });
    state.items.forEach(item => { if (forbiddenTechnicalLabels.test(item.text)) fail(`${label}/${phase}/pool${item.pool}: 학습자 표시 영역에 기술 라벨이 노출되었습니다.`); });
    state.items.forEach(item => { if (/(전수 열거|전수로 찾습니다|계단형 직육면체 프리즘)/.test(item.text)) fail(`${label}/${phase}/pool${item.pool}: 학생 표시 영역에 교정 전 전문 표현이 남았습니다.`); });
  });
  const pools = problem.items.map(item => item.pool);
  if (new Set(pools).size !== 3 || ![0, 1, 2].every(pool => pools.includes(pool))) fail(`${label}: 0·1·2 고정 풀이 모두 표시되지 않았습니다.`);
  problem.items.forEach((item, index) => {
    const solved = answer.items[index];
    if (item.source !== sourceItemId || solved.source !== sourceItemId) fail(`${label}/pool${item.pool}: sourceItemId 불일치`);
    if (item.svgs.length !== 1 || solved.svgs.length !== 1) fail(`${label}/pool${item.pool}: 그림 수가 1개가 아닙니다.`);
    if (item.svgs[0].model !== solved.svgs[0].model || item.svgs[0].values !== solved.svgs[0].values) fail(`${label}/pool${item.pool}: 문제·답 구조 데이터 불일치`);
    if (phaseIsProblemLeaking(item.text)) fail(`${label}/문제/pool${item.pool}: 답·해결 정보 노출`);
    if (sourceItemId.endsWith("example-2")) {
      const data = expected["example-2"][item.pool];
      const expectedAnswer = difficulty === 1
        ? `직육면체 24개, 겉넓이 ${data.surface}cm², 부피 ${data.volume}cm³`
        : `겉넓이 ${data.surface}cm², 부피 ${data.volume}cm³`;
      const roles = [
        "congruent-stair-back-profile", "congruent-stair-top-face", "congruent-stair-riser-face",
        "congruent-stair-depth-grid", "congruent-stair-riser-grid", "congruent-stair-front-cell",
        "congruent-stair-profile-outline", "congruent-stair-length-dimension", "congruent-stair-height-dimension",
        "congruent-stair-depth-dimension"
      ];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => roles.forEach(role => {
        if (!svg.required.includes(role) || !svg.roleCounts[role]) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role}가 없습니다.`);
      }));
      if (item.svgs[0].model !== "congruent-block-stair" || solved.svgs[0].model !== "congruent-block-stair") fail(`${label}/pool${item.pool}: 같은 직육면체 계단 모델이 아닙니다.`);
      if (item.svgs[0].roleCounts["congruent-stair-front-cell"] !== 6 || item.svgs[0].roleCounts["congruent-stair-top-face"] !== 3 || item.svgs[0].roleCounts["congruent-stair-depth-grid"] !== 9) fail(`${label}/문제/pool${item.pool}: 3·2·1 앞면과 깊이 4줄의 격자가 다릅니다.`);
      if (!solved.svgs[0].required.includes("congruent-stair-answer-card") || solved.svgs[0].roleCounts["congruent-stair-answer-card"] !== 1) fail(`${label}/답/pool${item.pool}: 답 그림 계산 표가 없습니다.`);
      ["congruent-stair-length-dimension", "congruent-stair-height-dimension", "congruent-stair-depth-dimension"].forEach(role => {
        const dimension = item.svgs[0].lines.find(entry => entry.role === role);
        if (!dimension || [dimension.x1, dimension.y1, dimension.x2, dimension.y2].some(value => !Number.isFinite(value)) || (dimension.x1 === dimension.x2 && dimension.y1 === dimension.y2)) fail(`${label}/문제/pool${item.pool}: ${role} 치수선이 유효하지 않습니다.`);
      });
      const solvedText = normalizedMathText(solved.text);
      const solvedSolution = normalizedMathText(solved.solution);
      if (solvedText.replace(/\s+/g, "").indexOf(expectedAnswer.replace(/\s+/g, "")) < 0) fail(`${label}/답/pool${item.pool}: ${expectedAnswer}이 표시되지 않습니다.`);
      if (!solvedSolution.includes("직육면체는 6×4=24개") || !solvedSolution.includes(`겉넓이는 ${data.surface - 2 * data.length * data.depth - 2 * data.height * data.depth}+${2 * data.length * data.depth}+${2 * data.height * data.depth}=${data.surface}cm²`)) fail(`${label}/답/pool${item.pool}: 조각 수 또는 겉넓이 면 분해 풀이가 없습니다.`);
      if (!item.text.includes("모양과 크기가 같은 직육면체") || item.text.includes("정육면체 24개")) fail(`${label}/문제/pool${item.pool}: 원문의 직육면체 표현이 다릅니다.`);
      if (difficulty === -1 && (!item.text.includes("높은 쪽부터 3칸, 2칸, 1칸") || !item.text.includes("깊이 방향은 4줄") || !solved.solution.startsWith("앞면 3+2+1칸과 깊이 4줄이 주어졌습니다."))) fail(`${label}/pool${item.pool}: 쉬움의 칸 안내 또는 첫 풀이가 다릅니다.`);
      if (difficulty === 0 && (!item.text.includes("직육면체 24개") || item.text.includes("높은 쪽부터") || !solved.solution.startsWith("그림을 앞면의 계단 칸과 뒤쪽 깊이 줄로 나누어 봅니다."))) fail(`${label}/pool${item.pool}: 기준의 원문 24개 조건 또는 그림 풀이가 다릅니다.`);
      if (difficulty === 1 && (item.text.includes("직육면체 24개") || !item.text.includes("사용한 직육면체의 수") || !solved.solution.startsWith("먼저 그림의 칸을 빠짐없이 셉니다."))) fail(`${label}/pool${item.pool}: 어려움의 조각 수 추론 조건이 다릅니다.`);
      if (item.pool === 0 && (data.surface !== 98 || data.volume !== 48)) fail(`${label}: 원문 답 계약이 98cm²·48cm³가 아닙니다.`);
    }
    if (sourceItemId.endsWith("example-3")) {
      const data = expected["example-3"][item.pool];
      const highDepth = data.totalDepth - data.lowDepth;
      const highCrossSection = highDepth * (data.highStart + data.highEnd) / 2;
      const lowCrossSection = data.lowDepth * data.lowHeight;
      const cutCrossSection = highDepth * ((data.highStart - data.finalHeight) + (data.highEnd - data.finalHeight)) / 2;
      const fillCrossSection = data.lowDepth * (data.finalHeight - data.lowHeight);
      const roles = [
        "earthwork-back-profile", "earthwork-high-top", "earthwork-low-top", "earthwork-cliff", "earthwork-end-face", "earthwork-front-profile",
        "earthwork-total-depth-dimension", "earthwork-low-depth-dimension", "earthwork-high-start-height-dimension",
        "earthwork-high-end-height-dimension", "earthwork-low-height-dimension", "earthwork-width-dimension"
      ];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => roles.forEach(role => {
        if (!svg.required.includes(role) || svg.roleCounts[role] !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role}가 정확히 하나가 아닙니다.`);
      }));
      if (item.svgs[0].model !== "earthwork-leveling" || solved.svgs[0].model !== "earthwork-leveling") fail(`${label}/pool${item.pool}: 흙 고르기 모델이 아닙니다.`);
      ["earthwork-cut-area", "earthwork-fill-area", "earthwork-final-level", "earthwork-answer-card"].forEach(role => {
        if (!solved.svgs[0].required.includes(role) || solved.svgs[0].roleCounts[role] !== 1) fail(`${label}/답/pool${item.pool}: ${role}가 정확히 하나가 아닙니다.`);
      });
      ["earthwork-total-depth-dimension", "earthwork-low-depth-dimension", "earthwork-high-start-height-dimension", "earthwork-high-end-height-dimension", "earthwork-low-height-dimension", "earthwork-width-dimension"].forEach(role => {
        const dimension = item.svgs[0].lines.find(entry => entry.role === role);
        if (!dimension || [dimension.x1, dimension.y1, dimension.x2, dimension.y2].some(value => !Number.isFinite(value)) || (dimension.x1 === dimension.x2 && dimension.y1 === dimension.y2)) fail(`${label}/문제/pool${item.pool}: ${role} 치수선이 유효하지 않습니다.`);
      });
      if (cutCrossSection !== fillCrossSection) fail(`${label}/pool${item.pool}: 깎은 단면과 채운 단면이 다릅니다.`);
      if (!solved.text.includes(`${data.finalHeight}m`) || !solved.text.includes(`깎은 단면 = 채운 단면 = ${cutCrossSection}m²`)) fail(`${label}/답/pool${item.pool}: 최종 높이 또는 독립 재검산이 보이지 않습니다.`);
      const solvedSolution = normalizedMathText(solved.solution);
      if (!solvedSolution.includes(`${highDepth}×(${data.highStart}+${data.highEnd})÷2=${highCrossSection}m²`) || !solvedSolution.includes(`${data.lowDepth}×${data.lowHeight}=${lowCrossSection}m²`)) fail(`${label}/답/pool${item.pool}: 사다리꼴·직사각형 단면 풀이가 없습니다.`);
      if (item.text.includes(`${data.finalHeight}m`) || item.text.includes("깎은 단면")) fail(`${label}/문제/pool${item.pool}: 정답 또는 재검산 값이 노출되었습니다.`);
      if (difficulty === -1 && (!item.text.includes(`높은 부분의 깊이는 ${highDepth}m`) || !solved.solution.startsWith(`높은 부분의 깊이는 ${highDepth}m로 주어졌습니다.`))) fail(`${label}/pool${item.pool}: 쉬움의 계산된 깊이 또는 첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 0 && (!item.text.includes(`폭이 ${data.width}m`) || !item.text.includes(`전체 깊이가 ${data.totalDepth}m`) || !solved.solution.startsWith(`높은 부분의 깊이는 ${data.totalDepth}-${data.lowDepth}=${highDepth}m입니다.`))) fail(`${label}/pool${item.pool}: 기준의 원본 치수 또는 첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 1 && (!item.text.includes("모든 부분의 폭은 같습니다") || item.text.includes(`폭이 ${data.width}m`) || !solved.solution.startsWith("폭은 모든 부분에서 같으므로 옆에서 본 단면 넓이를"))) fail(`${label}/pool${item.pool}: 어려움의 공통 폭 조건 또는 첫 풀이 단계가 맞지 않습니다.`);
      if (item.pool === 0 && (data.finalHeight !== 14 || highDepth !== 24 || highCrossSection !== 432 || lowCrossSection !== 128 || cutCrossSection !== 96)) fail(`${label}: 원본 수치의 14m 계산이 다릅니다.`);
    }
    if (sourceItemId.endsWith("example-4")) {
      const [width, depth, height] = expected["example-4"][item.pool];
      const ropeA = 2 * (depth + height);
      const ropeB = 2 * (width + height);
      const horizontalRope = 2 * (width + depth);
      const ropeC = ropeB + horizontalRope;
      const candidates = [];
      for (let candidateWidth = 1; candidateWidth < ropeC; candidateWidth += 1) {
        for (let candidateDepth = 1; candidateDepth < ropeC; candidateDepth += 1) {
          for (let candidateHeight = 1; candidateHeight < ropeC; candidateHeight += 1) {
            if (2 * (candidateDepth + candidateHeight) === ropeA && 2 * (candidateWidth + candidateHeight) === ropeB && ropeB + 2 * (candidateWidth + candidateDepth) === ropeC) candidates.push([candidateWidth, candidateDepth, candidateHeight]);
          }
        }
      }
      const ropeRoles = ["box-a-depth-height-visible", "box-a-depth-height-hidden", "box-b-width-height-visible", "box-b-width-height-hidden", "box-c-width-height-visible", "box-c-width-height-hidden", "box-c-width-depth-visible", "box-c-width-depth-hidden"];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => ropeRoles.forEach(role => {
        if (!svg.required.includes(role) || svg.roleCounts[role] !== 1 || svg.paths.filter(entry => entry.role === role).length !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role} 끈 경로가 정확히 하나가 아닙니다.`);
      }));
      ["two-loop-width-dimension", "two-loop-height-dimension", "two-loop-depth-dimension", "two-loop-answer-card"].forEach(role => {
        if (!solved.svgs[0].required.includes(role) || solved.svgs[0].roleCounts[role] !== 1) fail(`${label}/답/pool${item.pool}: ${role} 답 그림 근거가 없습니다.`);
      });
      const problemPaths = item.svgs[0].paths;
      const countLoop = loop => problemPaths.filter(entry => entry.loop === loop).length;
      if (countLoop("depth-height") !== 2 || countLoop("width-height") !== 4 || countLoop("width-depth") !== 2) fail(`${label}/문제/pool${item.pool}: 가·나·다의 고리 수가 원문과 다릅니다.`);
      if (problemPaths.some(entry => entry.role?.startsWith("box-c-depth-height"))) fail(`${label}/문제/pool${item.pool}: 다 그림에 원문에 없는 깊이·높이 고리가 추가되었습니다.`);
      if (!item.text.includes("(단, 매듭의 길이는 생각하지 않습니다.)")) fail(`${label}/문제/pool${item.pool}: 원문의 매듭 길이 제외 조건이 없습니다.`);
      if (item.text.includes(`가로 ${width}cm`) || item.text.includes(`깊이 ${depth}cm`) || item.text.includes(`높이 ${height}cm`)) fail(`${label}/문제/pool${item.pool}: 문제에 답 치수가 노출되었습니다.`);
      if (!solved.text.includes(`가로 ${width}cm`) || !solved.text.includes(`깊이 ${depth}cm`) || !solved.text.includes(`높이 ${height}cm`) || !solved.text.includes(`나의 고리 ${ropeB}cm`) || !solved.text.includes(`수평 고리 ${horizontalRope}cm`) || !solved.text.includes(`${width}×${depth}×${height}`)) fail(`${label}/답/pool${item.pool}: 세 변 또는 두 고리 분해가 답 그림에 없습니다.`);
      if (JSON.stringify(candidates) !== JSON.stringify([[width, depth, height]]) || solved.text.replace(/\s+/g, "").indexOf(`${width * depth * height}cm³`) < 0) fail(`${label}/pool${item.pool}: 단일 답 또는 부피가 다릅니다.`);
      if (difficulty === -1 && (!item.text.includes("가의 끈은 깊이와 높이를 한 바퀴") || !item.text.includes("수평 고리로 되어 있습니다") || !solved.solution.startsWith(`가의 끈 길이의 절반은 ${ropeA}÷2=`))) fail(`${label}/pool${item.pool}: 쉬움의 고리 안내 또는 풀이가 다릅니다.`);
      if (difficulty === 0 && (!item.text.includes(`그림과 같이 ${ropeA}cm, ${ropeB}cm, ${ropeC}cm`) || item.text.includes("다에는 나의 고리가") || !solved.solution.startsWith("가의 끈은 깊이와 높이를"))) fail(`${label}/pool${item.pool}: 기준의 원문 고리 구조 또는 풀이가 다릅니다.`);
      if (difficulty === 1 && (!item.text.includes("다에는 나의 고리가 함께 들어") || !solved.solution.startsWith(`다의 끈에는 나의 고리 ${ropeB}cm가 함께 들어 있습니다.`))) fail(`${label}/pool${item.pool}: 어려움의 공통 고리 조건 또는 풀이가 다릅니다.`);
      if (item.pool === 0 && (ropeA !== 28 || ropeB !== 14 || ropeC !== 40 || width * depth * height !== 120)) fail(`${label}: 원문 28cm·14cm·40cm·120cm³ 계약이 다릅니다.`);
    }
    if (sourceItemId.endsWith("mission-2")) {
      const [rope, cubeLeft, cuboidLeft] = expected["mission-2"][item.pool];
      const cubeUsed = rope - cubeLeft;
      const cuboidUsed = rope - cuboidLeft;
      const usedDifference = cuboidUsed - cubeUsed;
      if (item.text.includes("가로 둘레 4×") || item.text.includes("위아래 둘레 2×")) fail(`${label}/문제/pool${item.pool}: 문제 그림에 끈 풀이 공식이 노출되었습니다.`);
      if (!solved.text.includes("가 전체 끈 길이") || !solved.text.includes("나 전체 끈 길이")) fail(`${label}/답/pool${item.pool}: 두 끈의 실제 계산 근거가 없습니다.`);
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => ["cube-continuous-rope", "cuboid-continuous-rope"].forEach(role => {
        const paths = svg.paths.filter(entry => entry.role === role);
        if (paths.length !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role} 단일 path가 정확히 하나가 아닙니다.`);
        const ropePath = paths[0];
        const join = (ropePath?.join || "").replace(",", " ");
        const commands = ropePath?.d.match(/[A-Za-z]/g) || [];
        if (!join || (ropePath.d.match(/[Mm]/g) || []).length !== 1 || !commands.every(command => /[ML]/i.test(command)) || ropePath.d.split(join).length < 4) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role}가 중앙 매듭에서 두 방향으로 이어진 직선 경로가 아닙니다.`);
        if (ropePath.style !== "surface-cross" || ropePath.loops !== "2") fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role}의 표면 십자 경로 계약이 없습니다.`);
        const knotRole = role.replace("-continuous-rope", "-rope-knot");
        if (svg.roleCounts[knotRole] !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${knotRole}가 정확히 하나가 아닙니다.`);
        if (!svg.required.includes(role)) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role} 필수 역할이 없습니다.`);
      }));
      if ([...item.svgs[0].paths, ...solved.svgs[0].paths].some(entry => /-(?:base|vertical)-loop$/.test(entry.role))) fail(`${label}/pool${item.pool}: 분리된 끈 경로가 남았습니다.`);
      if (difficulty === -1) {
        if (!item.text.includes(`가에서 실제 사용한 끈은 ${cubeUsed}cm`) || !item.text.includes(`나에서 실제 사용한 끈은 ${cuboidUsed}cm`) || item.text.includes("남은 끈")) fail(`${label}/문제/pool${item.pool}: 쉬움의 실제 사용 길이 조건이 잘못되었습니다.`);
        if (!solved.solution.startsWith(`가에서 사용한 끈은 ${cubeUsed}cm, 나에서 사용한 끈은 ${cuboidUsed}cm로 주어졌습니다.`) || solved.solution.includes(`${rope}-${cubeLeft}`)) fail(`${label}/답/pool${item.pool}: 쉬움 풀이 첫 단계가 주어진 사용 길이와 다릅니다.`);
      } else if (difficulty === 0) {
        if (!item.text.includes(`가에서 남은 끈은 ${cubeLeft}cm`) || !item.text.includes(`나에서 남은 끈은 ${cuboidLeft}cm`)) fail(`${label}/문제/pool${item.pool}: 기준의 남은 끈 조건이 없습니다.`);
        if (!solved.solution.startsWith("가의 전체 끈에서 남은 끈을 빼면")) fail(`${label}/답/pool${item.pool}: 기준 풀이 첫 단계가 남은 끈 조건과 다릅니다.`);
      } else {
        if (!item.text.includes(`나는 가보다 사용한 끈이 ${usedDifference}cm 더 깁니다`) || item.text.includes("나에서 남은 끈")) fail(`${label}/문제/pool${item.pool}: 어려움의 끈 차이 조건이 잘못되었습니다.`);
        if (!solved.solution.startsWith(`가에서 사용한 끈은 ${rope}-${cubeLeft}=${cubeUsed}cm입니다.`) || !solved.solution.includes(`나에서 사용한 끈은 ${cubeUsed}+${usedDifference}=${cuboidUsed}cm`) || solved.solution.includes(`${rope}-${cuboidLeft}`)) fail(`${label}/답/pool${item.pool}: 어려움 풀이가 차이에서 나의 사용 길이를 먼저 구하지 않습니다.`);
      }
      if (!item.text.includes("(단, 매듭의 길이는 생각하지 않습니다.)")) fail(`${label}/문제/pool${item.pool}: 원문의 매듭 길이 제외 조건이 없습니다.`);
    }
    if (sourceItemId.endsWith("mission-4")) {
      const data = expected["mission-4"][item.pool];
      const cubeSide = data.boardDepth - data.cuboidDepth;
      const totalVolume = data.boardLength * data.boardDepth * data.flatHeight;
      const cubeVolume = cubeSide ** 3;
      const baseArea = data.cuboidLength * data.cuboidDepth;
      const remainingVolume = totalVolume - cubeVolume;
      const expectedAnswer = `${Math.floor(data.doubledHeight / 2)} 1/2cm`;
      const semanticRoles = ["initial-board-plan", "soil-cube-front-face", "soil-cube-side-face", "soil-cube-top-face", "soil-cuboid-front-face", "soil-cuboid-side-face", "soil-cuboid-top-face", "right-gap-dimension", "cuboid-length-dimension", "cuboid-depth-dimension", "initial-board-length-label", "initial-board-depth-label", "cuboid-length-label", "cuboid-depth-label", "right-gap-label", "flattened-board-plan", "flattened-soil-top-face", "flattened-height-dimension", "flattened-length-label", "flattened-depth-label", "flattened-height-label"];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => semanticRoles.forEach(role => {
        if (!svg.required.includes(role) || svg.roleCounts[role] !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role} 시각 역할이 없습니다.`);
      }));
      const problemLabels = Object.fromEntries(item.svgs[0].texts.filter(entry => entry.role).map(entry => [entry.role, entry.value]));
      if (item.svgs[0].model !== "soil-solids-flattened-volume" || solved.svgs[0].model !== "soil-solids-flattened-volume") fail(`${label}/pool${item.pool}: 홈 판이 아닌 흙 부피 보존 모델이 아닙니다.`);
      const exactLabels = { "initial-board-length-label": `${data.boardLength}cm`, "initial-board-depth-label": `${data.boardDepth}cm`, "cuboid-length-label": `${data.cuboidLength}cm`, "cuboid-depth-label": `${data.cuboidDepth}cm`, "right-gap-label": `${data.rightGap}cm`, "flattened-length-label": `${data.boardLength}cm`, "flattened-depth-label": `${data.boardDepth}cm`, "flattened-height-label": `${data.flatHeight}cm` };
      if (Object.entries(exactLabels).some(([role, value]) => problemLabels[role] !== value)) fail(`${label}/문제/pool${item.pool}: 원문 판·나의 밑면·오른쪽 빈 곳·고르게 편 높이 치수 라벨이 정확하지 않습니다.`);
      if (viewport === "mobile390" && item.svgs[0].texts.filter(entry => entry.role.endsWith("-label")).some(entry => entry.height < 8.5)) fail(`${label}/문제/pool${item.pool}: 모바일 치수 글자가 읽기 기준보다 작습니다.`);
      if (item.text.includes(`가의 한 변: ${cubeSide}cm`) || item.text.includes(`나의 높이: ${expectedAnswer}`) || item.text.includes(`남은 부피: ${remainingVolume}cm³`)) fail(`${label}/문제/pool${item.pool}: 정답 계산값이 문제에 노출되었습니다.`);
      const answerRoleText = Object.fromEntries(solved.svgs[0].texts.filter(entry => entry.role).map(entry => [entry.role, entry.value]));
      const expectedAnswerRoleText = { "soil-total-volume-calc": `전체 흙 ${data.boardLength}×${data.boardDepth}×${data.flatHeight}=${totalVolume}cm³`, "soil-cube-side-calc": `가의 한 변 ${data.boardDepth}-${data.cuboidDepth}=${cubeSide}cm`, "soil-cube-volume-calc": `가의 부피 ${cubeSide}×${cubeSide}×${cubeSide}=${cubeVolume}cm³`, "soil-cuboid-base-area-calc": `나의 밑면 ${data.cuboidLength}×${data.cuboidDepth}=${baseArea}cm²`, "soil-cuboid-volume-calc": `나의 부피 ${totalVolume}-${cubeVolume}=${remainingVolume}cm³`, "soil-cuboid-height-calc": `나의 높이 ${remainingVolume}÷${baseArea}=` };
      if (Object.entries(expectedAnswerRoleText).some(([role, value]) => answerRoleText[role] !== value)) fail(`${label}/답/pool${item.pool}: 부피 보존 계산 근거가 답 그림의 올바른 위치에 없습니다.`);
      ["soil-volume-answer-card", "soil-total-volume-calc", "soil-cube-side-calc", "soil-cube-volume-calc", "soil-cuboid-base-area-calc", "soil-cuboid-volume-calc", "soil-cuboid-height-calc", "cuboid-height-mixed-fraction", "cuboid-height-whole", "cuboid-height-numerator", "cuboid-height-fraction-bar", "cuboid-height-denominator", "cuboid-height-unit"].forEach(role => {
        if (!solved.svgs[0].required.includes(role) || solved.svgs[0].roleCounts[role] !== 1) fail(`${label}/답/pool${item.pool}: ${role} 대분수 역할이 정확히 하나가 아닙니다.`);
      });
      const answerLabels = solved.svgs[0].texts.map(entry => entry.value);
      if (answerLabels.includes(`${data.doubledHeight}/2`) || answerLabels.some(value => /\d+\s*\/\s*\d+/.test(value)) || !answerLabels.includes(String(Math.floor(data.doubledHeight / 2))) || !answerLabels.includes("1") || !answerLabels.includes("2") || !answerLabels.includes("cm")) fail(`${label}/답/pool${item.pool}: 정답 SVG가 적층 대분수 역할로 표시되지 않습니다.`);
      if ((solved.solution.match(/나의 높이는/g) || []).length !== 1 || !solved.solution.includes(`${remainingVolume}÷${baseArea}=`)) fail(`${label}/답/pool${item.pool}: 높이 나눗셈이 하나로 계산되지 않았습니다.`);
      if (difficulty === -1 && (!item.text.includes(`${data.boardDepth}-${data.cuboidDepth}으로 가의 한 변`) || !item.text.includes("전체의 부피를 먼저"))) fail(`${label}/pool${item.pool}: 쉬움의 첫 계산 안내가 없습니다.`);
      if (difficulty === 0 && (item.text.includes("나의 밑면은") || item.text.includes("가의 한 변이나 나의 밑면 넓이는"))) fail(`${label}/pool${item.pool}: 기준 문제에 난이도별 보조 조건이 섞였습니다.`);
      if (difficulty === 1 && (!item.text.includes("가의 한 변이나 나의 밑면 넓이는 직접 알려주지 않았습니다") || !item.text.includes("그림의 치수에서 가의 한 변과 나의 밑면 넓이를"))) fail(`${label}/pool${item.pool}: 어려움의 그림 치수 추론 조건이 없습니다.`);
      if (item.pool === 0 && (data.doubledHeight !== 5 || totalVolume !== 275 || cubeVolume !== 125 || remainingVolume !== 150 || expectedAnswer !== "2 1/2cm")) fail(`${label}: 원문 5/2cm 흙 부피 보존 계약이 다릅니다.`);
    }
    if (sourceItemId.endsWith("mission-5")) {
      const [width, height, depth] = expected["mission-5"][item.pool];
      const ropeA = 2 * (depth + height);
      const ropeB = 2 * (width + height);
      const ropeC = 4 * (width + height + depth);
      const hardDifference = ropeC - ropeA - ropeB;
      const ropeRoles = ["box-a-depth-height-visible", "box-a-depth-height-hidden", "box-b-width-height-visible", "box-b-width-height-hidden", "box-c-depth-height-visible", "box-c-depth-height-hidden", "box-c-width-height-visible", "box-c-width-height-hidden", "box-c-width-depth-visible", "box-c-width-depth-hidden"];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => ropeRoles.forEach(role => {
        if (!svg.required.includes(role) || svg.roleCounts[role] !== 1 || svg.paths.filter(entry => entry.role === role).length !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role} 끈 경로가 정확히 하나가 아닙니다.`);
      }));
      ["box-width-dimension", "box-height-dimension", "box-depth-dimension"].forEach(role => {
        if (!solved.svgs[0].required.includes(role) || solved.svgs[0].roleCounts[role] !== 1) fail(`${label}/답/pool${item.pool}: ${role} 치수선이 없습니다.`);
      });
      if (!item.text.includes("(단, 매듭의 길이는 생각하지 않습니다.)")) fail(`${label}/문제/pool${item.pool}: 원문의 매듭 길이 제외 조건이 없습니다.`);
      if (!solved.text.includes(`가로 ${width}cm`) || !solved.text.includes(`세로 ${depth}cm`) || !solved.text.includes(`높이 ${height}cm`) || !solved.text.includes(`${width}×${depth}×${height}`)) fail(`${label}/답/pool${item.pool}: 세 변과 부피의 그림 근거가 없습니다.`);
      if (difficulty === -1 && (!item.text.includes("가의 끈은 세로와 높이의 합의 2배") || !item.text.includes("다의 세 방향 끈은 가로·세로·높이의 합의 4배") || !solved.solution.startsWith(`가의 끈 길이의 절반은 ${ropeA}÷2=`))) fail(`${label}/pool${item.pool}: 쉬움의 방향별 끈 뜻 또는 첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 0 && (!item.text.includes(`각각 ${ropeA}cm, ${ropeB}cm, ${ropeC}cm`) || item.text.includes("합보다") || !solved.solution.startsWith("가의 끈은 세로와 높이를 각각 두 번 지나므로"))) fail(`${label}/pool${item.pool}: 기준의 원문 세 길이 또는 첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 1 && (!item.text.includes(`각각 ${ropeA}cm, ${ropeB}cm`) || !item.text.includes(`합보다 ${hardDifference}cm 더 깁니다`) || item.text.includes(`사용한 끈 ${ropeC}cm`) || !solved.solution.startsWith(`다에서 사용한 끈은 ${ropeA}+${ropeB}+${hardDifference}=${ropeC}cm입니다.`))) fail(`${label}/pool${item.pool}: 어려움의 세 번째 끈 관계 또는 첫 풀이 단계가 맞지 않습니다.`);
    }
    if (sourceItemId.endsWith("mission-6")) {
      const unit = expected["mission-6"][item.pool];
      const width = 4 * unit;
      const depth = 3 * unit;
      const height = unit;
      const paperArea = width * (depth + height) / 2;
      const volume = width * depth * height;
      const candidates = [];
      for (let candidate = 1; candidate <= 100; candidate += 1) if (4 * candidate * (candidate + 3 * candidate) / 2 === paperArea) candidates.push(candidate);
      const sharedRoles = ["wrapped-box-front-face", "wrapped-box-top-face", "wrapped-box-right-face", "wrapped-paper-front-part", "wrapped-paper-top-part", "wrapped-paper-left-edge", "wrapped-paper-left-top-edge", "wrapped-paper-right-top-edge", "wrapped-paper-right-edge", "wrapped-paper-base-edge", "vertex-n", "vertex-d", "vertex-b", "vertex-s", "vertex-g", "vertex-r", "vertex-o", "vertex-j", "width-ratio-label", "depth-ratio-label", "paper-area-label"];
      [item.svgs[0], solved.svgs[0]].forEach((svg, phaseIndex) => sharedRoles.forEach(role => {
        if (!svg.required.includes(role) || svg.roleCounts[role] !== 1) fail(`${label}/${phaseIndex ? "답" : "문제"}/pool${item.pool}: ${role}가 정확히 하나가 아닙니다.`);
      }));
      ["wrapped-answer-card", "unfolded-paper-triangle", "unfolded-paper-height", "unfolded-right-angle-horizontal", "unfolded-right-angle-vertical", "unfolded-base-label", "unfolded-height-label", "unit-square-area-calc", "unit-length-calc", "box-width-depth-calc", "box-height-calc", "box-volume-expression", "box-volume-answer"].forEach(role => {
        if (!solved.svgs[0].required.includes(role) || solved.svgs[0].roleCounts[role] !== 1) fail(`${label}/답/pool${item.pool}: ${role}가 정확히 하나가 아닙니다.`);
      });
      if (item.svgs[0].model !== "cuboid-wrapped-triangle-paper-volume" || solved.svgs[0].model !== "cuboid-wrapped-triangle-paper-volume") fail(`${label}/pool${item.pool}: 삼각형 종이 직육면체 모델이 아닙니다.`);
      if (JSON.stringify(candidates) !== JSON.stringify([unit])) fail(`${label}/pool${item.pool}: 가장 짧은 모서리 후보가 하나가 아닙니다.`);
      if (!item.text.includes("삼각형 모양의 종이 한 장") || item.text.includes("두 장")) fail(`${label}/문제/pool${item.pool}: 원본 종이 한 장 조건이 아닙니다.`);
      if (item.text.includes(`${unit}cm`) || item.text.includes(`${volume}cm³`)) fail(`${label}/문제/pool${item.pool}: 답 모서리 또는 부피가 노출되었습니다.`);
      const normalizedAnswerText = solved.text.replace(/,/g, "");
      if (!normalizedAnswerText.includes(`밑변 ${width}cm`) || !normalizedAnswerText.includes(`높이 ${height}+${depth}=${height + depth}cm`) || !normalizedAnswerText.includes(`${paperArea}÷8=${paperArea / 8}`) || !normalizedAnswerText.includes(`${width}×${depth}×${height}`) || !normalizedAnswerText.includes(`${volume}cm³`)) fail(`${label}/답/pool${item.pool}: 펼친 삼각형과 부피 근거가 없습니다.`);
      if (viewport === "mobile390" && [...item.svgs[0].texts, ...solved.svgs[0].texts].filter(entry => entry.role).some(entry => entry.height < 8.5)) fail(`${label}/pool${item.pool}: 모바일 시각 라벨이 읽기 기준보다 작습니다.`);
      if (difficulty === -1 && (!item.text.includes("밑변은 가장 짧은 모서리의 4배") || !solved.solution.startsWith("종이를 펼친 삼각형의 밑변은"))) fail(`${label}/pool${item.pool}: 쉬움의 펼침 안내 또는 첫 풀이가 다릅니다.`);
      if (difficulty === 0 && (item.text.includes("종이를 펼치면") || item.text.includes("한 평면에 펼쳐") || !solved.solution.startsWith("앞면과 윗면에 걸쳐 붙인 삼각형 종이 한 장을 펼쳐 봅니다."))) fail(`${label}/pool${item.pool}: 기준 문제·풀이 구조가 다릅니다.`);
      if (difficulty === 1 && (!item.text.includes("종이가 꺾인 자리를 이용") || !solved.solution.startsWith("삼각형 종이 한 장을 앞면과 윗면이 만나는 모서리를 따라 펼쳐"))) fail(`${label}/pool${item.pool}: 어려움의 구조 추론이 없습니다.`);
      if (item.pool === 0 && (paperArea !== 200 || unit !== 5 || width !== 20 || depth !== 15 || volume !== 1500)) fail(`${label}: 원본 계산 계약이 다릅니다.`);
    }
    if (sourceItemId.endsWith("exploration") && (item.text.includes("상자의 부피") || !solved.text.match(/\d+개/))) fail(`${label}/pool${item.pool}: 블록 개수 전용 문항 계약이 아닙니다.`);
    if (sourceItemId.endsWith("exploration")) {
      const [width, height, cut] = expected.exploration[item.pool];
      const roles = ["paper-width-dimension", "paper-width-start", "paper-width-end", "paper-height-dimension", "paper-height-start", "paper-height-end", "cut-width-dimension", "cut-width-start", "cut-width-end", "cut-height-dimension", "cut-height-start", "cut-height-end"];
      roles.forEach(role => { if (!item.svgs[0].required.includes(role)) fail(`${label}/문제/pool${item.pool}: ${role} 전체 치수선이 없습니다.`); });
      roles.filter(role => role.includes("dimension")).forEach(role => { const line = item.svgs[0].lines.find(entry => entry.role === role); if (!line || [line.x1, line.y1, line.x2, line.y2].some(value => !Number.isFinite(value)) || (line.x1 === line.x2 && line.y1 === line.y2)) fail(`${label}/문제/pool${item.pool}: ${role} endpoint가 유효하지 않습니다.`); });
      if (!item.text.includes("(상자의 두께는 생각하지 않습니다.)")) fail(`${label}/문제/pool${item.pool}: 상자 두께 조건이 없습니다.`);
      if (difficulty === -1 && (!item.text.includes(`접은 뒤 상자의 밑면은 가로 ${width - 2 * cut}cm, 세로 ${height - 2 * cut}cm`) || !solved.solution.startsWith("접은 뒤 밑면 가로"))) fail(`${label}/pool${item.pool}: 쉬움의 밑면 조건·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 0 && (!item.text.includes(`가로 ${width}cm, 세로 ${height}cm`) || !solved.solution.startsWith("접은 뒤 밑면은 가로"))) fail(`${label}/pool${item.pool}: 기준의 종이 조건·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 1 && (!item.text.includes(`둘레가 ${2 * (width + height)}cm`) || item.text.includes(`전체 가로 ${width}cm`) || item.text.includes(`전체 세로 ${height}cm`) || !solved.solution.startsWith(`종이의 가로와 세로의 합은 ${2 * (width + height)}÷2=`))) fail(`${label}/pool${item.pool}: 어려움의 둘레·차 조건 또는 첫 풀이 단계가 맞지 않습니다.`);
    }
    if (sourceItemId.endsWith("mission-3")) {
      const unit = expected["mission-3"][item.pool];
      const depth = 5 * unit;
      ["stair-front-face", "stair-back-face", "stair-top-face", "stair-side-face", "stair-depth-edge", "unit-dimension", "width-dimension", "height-dimension", "depth-dimension"].forEach(role => { if (!item.svgs[0].required.includes(role)) fail(`${label}/문제/pool${item.pool}: ${role} 3D 요소가 없습니다.`); });
      ["stair-front-face", "stair-back-face", "stair-top-face", "stair-side-face", "stair-depth-edge"].forEach(role => { if (!solved.svgs[0].required.includes(role)) fail(`${label}/답/pool${item.pool}: ${role} 3D 요소가 없습니다.`); });
      const perimeter = solved.svgs[0].paths.filter(entry => entry.role === "cross-section-perimeter-20-cells");
      if (perimeter.length !== 1 || perimeter[0].cells !== "20" || !solved.svgs[0].required.includes("cross-section-perimeter-20-cells")) fail(`${label}/답/pool${item.pool}: 단면 바깥 둘레 20칸 강조 경로가 없습니다.`);
      if (difficulty === -1 && (!item.text.includes("앞면 칸 수는 차례로 1칸, 2칸, 3칸, 4칸, 5칸") || !solved.solution.startsWith("높이가 1층부터 5층인 다섯 부분의 앞면 칸 수가"))) fail(`${label}/pool${item.pool}: 쉬움의 앞면 칸 수·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 0 && (!item.text.includes(`깊이가 ${depth}cm`) || !item.text.includes(`${unit}cm씩 다섯 칸`) || !solved.solution.startsWith("앞면을 살펴보면"))) fail(`${label}/pool${item.pool}: 기준의 실제 치수·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 1 && (!item.text.includes(`전체 가로 ${5 * unit}cm를 똑같이 5등분`) || !item.text.includes("깊이는 전체 가로와 같습니다") || item.text.includes(`한 칸 ${unit}cm`) || item.text.includes(`깊이 ${depth}cm`) || !solved.solution.startsWith(`전체 가로 ${5 * unit}cm를 5등분했으므로 한 칸은 ${5 * unit}÷5=${unit}cm입니다.`))) fail(`${label}/pool${item.pool}: 어려움의 5등분·깊이 관계 또는 첫 풀이 단계가 맞지 않습니다.`);
    }
    if (sourceItemId.endsWith("example-1") || sourceItemId.endsWith("mission-1")) {
      if ((item.text + solved.text).includes("a≤b≤c") || !(item.text + solved.text).includes("세 변의 길이를 작은 수부터 차례로")) fail(`${label}/pool${item.pool}: 인수 나열 초등 표현이 없습니다.`);
      if (difficulty === -1 && (!item.text.includes("가장 짧은 변으로 가능한 길이는") || !solved.solution.startsWith("가장 짧은 변으로 가능한 길이가"))) fail(`${label}/pool${item.pool}: 쉬움의 가장 짧은 변 후보·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 0 && (item.text.includes("가장 짧은 변으로 가능한 길이는") || item.text.includes("세 변의 길이가 모두 다른 경우의 수도") || !solved.solution.startsWith("세 변의 길이를 작은 수부터 차례로"))) fail(`${label}/pool${item.pool}: 기준의 원본 조건·첫 풀이 단계가 맞지 않습니다.`);
      if (difficulty === 1 && (!item.text.includes("전체 가지 수") || !item.text.includes("세 변의 길이가 모두 다른 경우의 수도") || !solved.solution.startsWith("먼저 서로 다른 직육면체의 모든 경우") || !solved.text.includes("세 변의 길이가 모두 다른 경우"))) fail(`${label}/pool${item.pool}: 어려움의 추가 분류·답·첫 풀이 단계가 맞지 않습니다.`);
    }
  });
}
function phaseIsProblemLeaking(text) {
  return /(?:정답 그림|계산 근거|부피\s*=|겉넓이\s*=|\bV[₁₂₃₄₅]=|\bS=|가로 둘레 4×|위아래 둘레 2×)/.test(text);
}

function pageCount(file) {
  const info = execFileSync(pdfinfo, [file], { encoding: "utf8" });
  return Number(info.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
}
function renderPages(file, prefix, count) {
  execFileSync(pdftoppm, ["-f", "1", "-l", String(count), "-png", "-r", "96", file, prefix], { stdio: "ignore" });
  const script = [
    "from PIL import Image", "import glob,json,re,sys", "prefix=sys.argv[1]", "expected=int(sys.argv[2])", "files=sorted(glob.glob(prefix+'-*.png'), key=lambda v:int(re.search(r'-(\\d+)\\.png$',v).group(1)))", "rows=[]",
    "for f in files:", " im=Image.open(f).convert('RGB'); w,h=im.size; dark=lambda p:min(p)<238", " ink=sum(1 for p in im.getdata() if dark(p)); band=4", " edges={'top':sum(dark(im.getpixel((x,y))) for y in range(band) for x in range(w)),'bottom':sum(dark(im.getpixel((x,y))) for y in range(h-band,h) for x in range(w)),'left':sum(dark(im.getpixel((x,y))) for x in range(band) for y in range(h)),'right':sum(dark(im.getpixel((x,y))) for x in range(w-band,w) for y in range(h))}", " rows.append({'file':f,'width':w,'height':h,'ink':ink,'edges':edges})", "if len(rows)!=expected: raise SystemExit(f'rendered {len(rows)} pages, expected {expected}')", "print(json.dumps(rows))"
  ].join("\n");
  return JSON.parse(execFileSync(python, ["-c", script, prefix, String(count)], { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }));
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, url } = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  let screenshotCount = 0;
  let pdfCount = 0;
  let renderedPageCount = 0;
  try {
    for (const viewport of [{ name: "desktop1440", width: 1440, height: 1000 }, { name: "mobile390", width: 390, height: 844 }]) {
      for (const difficulty of difficulties) for (const sourceItemId of ids) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        page.on("pageerror", error => fail(`${sourceItemId}/d${difficulty}/${viewport.name}: ${error.message}`));
        await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
        const result = await page.evaluate(({ sourceItemId: id, difficulty: level, renderMathSource }) => {
          const render = eval(`(${renderMathSource})`);
          const kind = id.endsWith("exploration") ? "exploration" : id.match(/e2-(example|mission)-(\d+)$/)?.slice(1).join("-");
          const sourceType = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === id);
          if (!sourceType || !Number.isInteger(sourceType.variant)) throw new Error(`${id}: 실제 공개 catalog type 또는 variant가 없습니다.`);
          const entries = [0, 1, 2].map(pool => window.HSE_GENERATORS.generate(sourceType, 1, level, 7, pool));
          const coreBody = markup => {
            const template = document.createElement("template");
            template.innerHTML = String(markup || "");
            template.content.querySelectorAll("[data-step-evidence],svg,span[hidden]").forEach(node => node.remove());
            return (template.content.textContent || "").replace(/\s+/g, " ").trim();
          };
          const problem = entries.map((entry, index) => `<article data-source="${entry.sourceItemId}" data-pool="${entry.verifiedPoolIndex}">${render(entry.prompt)}</article>`).join("");
          const answer = entries.map((entry, index) => `<article data-source="${entry.sourceItemId}" data-pool="${entry.verifiedPoolIndex}"><header>${render(entry.answer)}</header>${render(entry.answerVisual)}<p>${render(entry.solution)}</p></article>`).join("");
          document.querySelector("#audit").innerHTML = `<section class="problem-view">${problem}</section><section class="answer-view" hidden>${answer}</section>`;
          return { kind, sourceItemId: id, count: entries.length, pools: entries.map(entry => entry.verifiedPoolIndex), provenances: entries.map(entry => entry.variantProvenance), bodies: entries.map(entry => ({ pool: entry.verifiedPoolIndex, body: coreBody(entry.prompt) })) };
        }, { sourceItemId, difficulty, renderMathSource: renderMath.toString() });
        if (!result || result.count !== 3) fail(`${sourceItemId}/d${difficulty}/${viewport.name}: 생성 문항 수 오류`);
        if (!result || result.pools.join(",") !== "0,1,2") fail(`${sourceItemId}/d${difficulty}/${viewport.name}: catalog type.variant보다 호출 인수 variant가 우선하지 않습니다.`);
        if (!result || result.provenances.join(",") !== "source-values,source-structure-variant,source-structure-variant") fail(`${sourceItemId}/d${difficulty}/${viewport.name}: 풀별 원문·변형 관계가 다릅니다.`);
        (result?.bodies || []).forEach(entry => {
          const bodyKey = `${sourceItemId}:pool${entry.pool}`;
          if (!difficultyBodies.has(bodyKey)) difficultyBodies.set(bodyKey, new Map());
          const bodies = difficultyBodies.get(bodyKey);
          if (bodies.has(difficulty) && bodies.get(difficulty) !== entry.body) fail(`${bodyKey}/d${difficulty}: viewport에 따라 문제 본문이 바뀝니다.`);
          bodies.set(difficulty, entry.body);
        });
        const problem = await snapshot(page, "problem", viewport.name === "desktop1440" ? "desktop" : "mobile390", sourceItemId, difficulty);
        await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-d${difficulty}-${viewport.name}-problem.png`), fullPage: true }); screenshotCount += 1;
        await page.evaluate(() => { document.querySelector(".problem-view").hidden = true; document.querySelector(".answer-view").hidden = false; });
        const answer = await snapshot(page, "answer", viewport.name === "desktop1440" ? "desktop" : "mobile390", sourceItemId, difficulty);
        await page.screenshot({ path: path.join(outputDir, `${sourceItemId}-d${difficulty}-${viewport.name}-answer.png`), fullPage: true }); screenshotCount += 1;
        verify(problem, answer, sourceItemId, difficulty, viewport.name === "desktop1440" ? "desktop" : "mobile390");
        if (viewport.name === "desktop1440") {
          for (const [phase, hiddenSelector, visibleSelector] of [["problem", ".answer-view", ".problem-view"], ["answer", ".problem-view", ".answer-view"]]) {
            await page.evaluate(({ hidden, visible }) => { document.querySelector(hidden).hidden = true; document.querySelector(visible).hidden = false; }, { hidden: hiddenSelector, visible: visibleSelector });
            await page.emulateMedia({ media: "print" });
            if (sourceItemId.endsWith("mission-4") && phase === "problem") {
              const printLabels = await page.evaluate(() => [...document.querySelectorAll(".problem-view article")].map(article => ({ pool: Number(article.dataset.pool), labels: [...article.querySelectorAll("svg text")].map(node => node.textContent.trim()) })));
              printLabels.forEach(entry => {
                const data = expected["mission-4"][entry.pool];
                const labels = entry.labels.join(" ");
                [data.boardLength, data.boardDepth, data.cuboidLength, data.cuboidDepth, data.rightGap, data.flatHeight].forEach(value => { if (!labels.includes(`${value}cm`)) fail(`${sourceItemId}/d${difficulty}/A4/problem/pool${entry.pool}: ${value}cm 수치 라벨이 인쇄 DOM에 없습니다.`); });
              });
            }
            const pdf = path.join(outputDir, `${sourceItemId}-d${difficulty}-${phase}.pdf`);
            await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true }); pdfCount += 1;
            await page.emulateMedia({ media: "screen" });
            const pages = pageCount(pdf); if (!pages) fail(`${sourceItemId}/d${difficulty}/A4/${phase}: PDF 페이지가 없습니다.`);
            try { const rendered = renderPages(pdf, pdf.replace(/\.pdf$/, ""), pages); renderedPageCount += rendered.length; if (rendered.some(item => item.ink < 100)) fail(`${sourceItemId}/d${difficulty}/A4/${phase}: 빈 페이지`); if (rendered.some(item => Object.values(item.edges).some(value => value > 0))) fail(`${sourceItemId}/d${difficulty}/A4/${phase}: 가장자리 잘림 흔적`); } catch (error) { fail(`${sourceItemId}/d${difficulty}/A4/${phase}: ${error.message}`); }
          }
        }
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  const expectedScreenshots = ids.length * difficulties.length * 2 * 2;
  const expectedPdfs = ids.length * difficulties.length * 2;
  if (screenshotCount !== expectedScreenshots) fail(`스크린샷 수 ${screenshotCount}/${expectedScreenshots}`);
  if (pdfCount !== expectedPdfs || renderedPageCount < pdfCount) fail(`A4 PDF/렌더 수 ${pdfCount}/${renderedPageCount}, 기대 PDF ${expectedPdfs}개 이상 렌더`);
  if (difficulties.length === 3) difficultyBodies.forEach((bodies, label) => {
    if (bodies.size !== 3 || new Set(bodies.values()).size !== 3) fail(`${label}: 힌트 문장을 제거하면 세 난이도 문제 본문이 구조적으로 구별되지 않습니다.`);
  });
  const summary = `${failures.length ? "실패" : "통과"}: 6-1 부피 개념탐구 2 브라우저 감사 · ${ids.length}유형 × 3풀 × ${difficulties.length}난이도 · 1440 desktop/390 mobile/A4 문제·정답 · 화면 ${screenshotCount}장 · A4 ${pdfCount}개/${renderedPageCount}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(`결과 폴더: ${outputDir}`);
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
