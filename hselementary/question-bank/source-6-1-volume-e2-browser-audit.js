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
const ids = [
  "6-1-u6-e2-exploration", "6-1-u6-e2-example-1", "6-1-u6-e2-mission-1",
  "6-1-u6-e2-mission-2", "6-1-u6-e2-mission-3"
];
const difficulties = process.env.HSE_DIFFICULTY ? [Number(process.env.HSE_DIFFICULTY)] : [-1, 0, 1];
const outputDir = process.env.HSE_SCREENSHOT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), "hse-volume-e2-browser-"));
const forbiddenLearnerNotation = /a≤b≤c|a²|[VS][₁₂₃₄₅]|\b(?:s|h|a|V|S|N)\b|\d\s*[sah](?=\s|$|[=×()+\-0-9])/;
const forbiddenTechnicalLabels = /원문 유형|고정 풀|sourceItemId|6-1-u6-e2-/;
const poppler = process.env.HSE_POPPLER_BIN || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin";
const pdfinfo = path.join(poppler, "pdfinfo.exe");
const pdftoppm = path.join(poppler, "pdftoppm.exe");
const python = process.env.HSE_PYTHON || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const expected = {
  exploration: [[30, 24, 6], [28, 20, 4], [36, 26, 5]],
  "example-1": [12, 24, 36],
  "mission-1": [48, 60, 72],
  "mission-2": [[110, 22, 14], [120, 24, 12], [96, 16, 8]],
  "mission-3": [10, 8, 12]
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
      const texts = [...svg.querySelectorAll("text")].map(node => ({ value: node.textContent.trim(), ...rect(node) })).filter(item => item.value);
      const overlaps = []; for (let i = 0; i < texts.length; i += 1) for (let j = i + 1; j < texts.length; j += 1) {
        const a = texts[i], b = texts[j]; if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) overlaps.push(`${a.value}<>${b.value}`);
      }
      const required = (svg.dataset.requiredElements || "").split(",").filter(Boolean);
      const visualRoles = [...svg.querySelectorAll("[data-visual-element]")].map(node => node.dataset.visualElement);
      const present = new Set(visualRoles);
      const roleCounts = visualRoles.reduce((counts, role) => ({ ...counts, [role]: (counts[role] || 0) + 1 }), {});
      const lines = [...svg.querySelectorAll("line[data-visual-element]")].map(node => ({ role: node.dataset.visualElement, x1: Number(node.getAttribute("x1")), y1: Number(node.getAttribute("y1")), x2: Number(node.getAttribute("x2")), y2: Number(node.getAttribute("y2")) }));
      const paths = [...svg.querySelectorAll("path[data-visual-element]")].map(node => ({ role: node.dataset.visualElement, d: node.getAttribute("d") || "", join: node.dataset.ropeJoin || "", style: node.dataset.ropeStyle || "", loops: node.dataset.ropeLoopCount || "", cells: node.dataset.cellCount || "" }));
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
      if (svg.bbox.x < svg.view.x - 1 || svg.bbox.y < svg.view.y - 1 || svg.bbox.right > svg.view.right + 1 || svg.bbox.bottom > svg.view.bottom + 1) fail(`${label}/${phase}/pool${item.pool}: SVG viewBox 밖으로 잘림`);
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
