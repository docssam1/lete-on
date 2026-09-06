"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const dir = __dirname;
const root = path.resolve(dir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(dir, "tmp", "source-6-1-volume-e4-browser-audit");
const poppler = process.env.HSE_POPPLER_BIN || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin";
const pdfinfo = path.join(poppler, "pdfinfo.exe");
const pdftoppm = path.join(poppler, "pdftoppm.exe");
const python = process.env.HSE_PYTHON || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const failures = [];
const edgeNames = ["top", "bottom", "left", "right"];
const fail = message => failures.push(message);

const allCases = [
  ["6-1-u6-e4-exploration-1", "tilted-segment"], ["6-1-u6-e4-exploration-2", "tilted-restored"], ["6-1-u6-e4-exploration-3", "tilted-sealed"],
  ["6-1-u6-e4-example-1", "overflow-stone"], ["6-1-u6-e4-example-2", "equal-partitions"], ["6-1-u6-e4-example-3", "square-rod"], ["6-1-u6-e4-example-4", "flow-equal-height"],
  ["6-1-u6-e4-mission-1", "unit-conversion"], ["6-1-u6-e4-mission-2", "wall-thickness"], ["6-1-u6-e4-mission-3", "tilted-spill"],
  ["6-1-u6-e4-mission-4", "submerged-stone"], ["6-1-u6-e4-mission-5", "rectangular-rod"], ["6-1-u6-e4-mission-6", "partitioned-tank"]
].map(([id, model]) => ({ id, model }));
const cases = process.env.HSE_CASE ? allCases.filter(item => item.id.includes(process.env.HSE_CASE)) : allCases;
const difficulties = process.env.HSE_DIFFICULTY ? [Number(process.env.HSE_DIFFICULTY)] : [-1, 0, 1];

const mime = { ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml" };
function safeFile(url) {
  const relative = decodeURIComponent((url || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(root, relative || "index.html");
  return file === root || file.startsWith(root + path.sep) ? file : null;
}
async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safeFile(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": `${mime[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { server, url: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

const expectsMixed = (id, pool) => id.endsWith("exploration-3") || id.endsWith("example-3") || ((id.endsWith("example-2") || id.endsWith("mission-6")) && pool === 0);

async function snapshot(page, phase) {
  return page.evaluate(currentPhase => {
    const view = document.querySelector(currentPhase === "problem" ? "#problemView" : "#solutionView");
    const roots = [...view.querySelectorAll(currentPhase === "problem" ? ".question-item" : ".solution-item")];
    const rectangle = node => { const value = node.getBoundingClientRect(); return { left: value.left, right: value.right, top: value.top, bottom: value.bottom, width: value.width, height: value.height }; };
    const describeSvg = svg => {
      const bounds = rectangle(svg);
      const texts = [...svg.querySelectorAll("text")].map(node => ({ value: (node.textContent || "").trim(), ...rectangle(node) })).filter(item => item.value);
      const clipped = texts.filter(item => item.left < bounds.left - 2 || item.right > bounds.right + 2 || item.top < bounds.top - 2 || item.bottom > bounds.bottom + 2).map(item => item.value);
      const overlaps = [];
      for (let left = 0; left < texts.length; left += 1) for (let right = left + 1; right < texts.length; right += 1) {
        const a = texts[left], b = texts[right];
        const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (width > 1 && height > 1) overlaps.push(`${a.value}[${a.left.toFixed(1)},${a.right.toFixed(1)}]<>${b.value}[${b.left.toFixed(1)},${b.right.toFixed(1)}]`);
      }
      const required = (svg.dataset.requiredElements || "").split(",").filter(Boolean);
      const present = new Set([...svg.querySelectorAll("[data-visual-element]")].map(node => node.dataset.visualElement));
      return {
        phase: svg.dataset.phase || "", key: svg.dataset.modelKey || "", values: svg.dataset.source61VolumeE4Values || "",
        required, missing: required.filter(role => !present.has(role)), width: bounds.width, height: bounds.height,
        clipped, overlaps, polygonCount: svg.querySelectorAll("polygon").length, lineCount: svg.querySelectorAll("line,path").length,
        slashText: /\d+\s*\/\s*\d+/.test(svg.textContent || ""), caretText: /(?:cm|m)\^[23]/.test(svg.textContent || ""),
        measureFractions: svg.querySelectorAll(".svg-measurement .fraction-bar").length,
        solvedMarks: svg.querySelectorAll(".is-solved").length
      };
    };
    const items = roots.map(root => {
      const evidence = root.querySelector("[data-source-item]");
      const answer = root.querySelector("[data-answer-source]");
      const svg = root.querySelector(".source61-volume-e4-diagram");
      return {
        source: evidence?.dataset.sourceItem || answer?.dataset.answerSource || "",
        pool: Number(evidence?.dataset.poolIndex ?? answer?.dataset.verifiedPoolIndex),
        svg: svg ? describeSvg(svg) : null,
        answerFraction: Boolean(root.querySelector("header strong .math-fraction")),
        answerMixed: Boolean(root.querySelector("header strong .math-mixed-number")),
        solutionMixed: Boolean(root.querySelector("p .math-mixed-number"))
      };
    });
    const fractions = [...view.querySelectorAll(".math-fraction")];
    const mixed = [...view.querySelectorAll(".math-mixed-number")];
    return {
      items,
      visible: !view.hidden,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(view.innerText),
      caret: /(?:cm|m)\^[23]/.test(view.innerText),
      slash: /\d+\s*\/\s*\d+/.test(view.innerText),
      htmlLeak: /<span\b|&lt;span\b|math-mixed-number/.test(view.innerText),
      fractionBad: fractions.some(node => node.children.length !== 2 || rectangle(node).height < 14 || rectangle(node).width < 5),
      mixedBad: mixed.some(node => !node.querySelector(":scope > .math-fraction") || rectangle(node).height < 14),
      unitSuperscripts: view.querySelectorAll(".math-unit sup, svg tspan[baseline-shift='super']").length
    };
  }, phase);
}

function verifySnapshots(problem, answer, sourceCase, difficulty, viewport) {
  const label = `${sourceCase.id}/d${difficulty}/${viewport}`;
  if (!problem.visible || !answer.visible || problem.items.length !== 3 || answer.items.length !== 3) fail(`${label}: 문제·답 화면 또는 3문항 구성이 맞지 않습니다.`);
  [problem, answer].forEach((state, phaseIndex) => {
    const phase = phaseIndex ? "답" : "문제";
    if (state.overflow) fail(`${label}/${phase}: 가로 넘침이 있습니다.`);
    if (state.broken || state.caret || state.slash || state.htmlLeak) fail(`${label}/${phase}: 깨진 값, caret, slash 또는 HTML 코드가 노출됩니다.`);
    if (state.fractionBad || state.mixedBad) fail(`${label}/${phase}: 분수·대분수 DOM 구조나 크기가 잘못되었습니다.`);
  });
  const pools = problem.items.map(item => item.pool);
  if (new Set(pools).size !== 3 || ![0, 1, 2].every(pool => pools.includes(pool))) fail(`${label}: 고정 풀 0·1·2가 모두 나오지 않습니다.`);
  problem.items.forEach((problemItem, index) => {
    const answerItem = answer.items[index];
    const itemLabel = `${label}/p${problemItem.pool}`;
    if (problemItem.source !== sourceCase.id || answerItem?.source !== sourceCase.id) fail(`${itemLabel}: 선택한 원문 유형과 생성 문항이 다릅니다.`);
    if (!problemItem.svg || !answerItem?.svg) { fail(`${itemLabel}: 문제 또는 답 그림이 없습니다.`); return; }
    if (problemItem.svg.phase !== "problem" || answerItem.svg.phase !== "answer") fail(`${itemLabel}: 문제·답 그림 단계가 잘못되었습니다.`);
    if (problemItem.svg.key !== sourceCase.model || answerItem.svg.key !== sourceCase.model || problemItem.svg.values !== answerItem.svg.values) fail(`${itemLabel}: 문제·답 모델 또는 원시 좌표값이 다릅니다.`);
    [problemItem.svg, answerItem.svg].forEach((svg, phaseIndex) => {
      const phase = phaseIndex ? "답" : "문제";
      if (svg.width < 180 || svg.height < 90 || svg.clipped.length || svg.overlaps.length || svg.missing.length || svg.slashText || svg.caretText) fail(`${itemLabel}/${phase}: 그림 가시성 오류 ${JSON.stringify({ width: svg.width, height: svg.height, clipped: svg.clipped, overlaps: svg.overlaps, missing: svg.missing, slash: svg.slashText, caret: svg.caretText })}`);
      if (!sourceCase.id.endsWith("mission-1") && (svg.polygonCount < 2 || svg.lineCount < 2)) fail(`${itemLabel}/${phase}: 입체 면·깊이 선이 부족합니다.`);
    });
    if (answerItem.svg.solvedMarks < 1) fail(`${itemLabel}: 답 그림에 계산 요소 강조가 없습니다.`);
    if (expectsMixed(sourceCase.id, problemItem.pool)) {
      if (!answerItem.answerFraction || !answerItem.answerMixed || !answerItem.solutionMixed || answerItem.svg.measureFractions < 1) fail(`${itemLabel}: 답·풀이·SVG가 공통 대분수 구조로 렌더되지 않았습니다.`);
    }
  });
}

function pageCount(file) {
  const info = execFileSync(pdfinfo, [file], { encoding: "utf8" });
  const count = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  if (!Number.isInteger(count) || count < 1) throw new Error("PDF 페이지 수를 읽지 못했습니다.");
  return count;
}
function renderAndInspectPages(file, prefix, count) {
  execFileSync(pdftoppm, ["-f", "1", "-l", String(count), "-png", "-r", "110", file, prefix], { stdio: "ignore" });
  const script = [
    "from PIL import Image", "import glob,json,re,sys", "prefix=sys.argv[1]", "expected=int(sys.argv[2])",
    "files=glob.glob(prefix+'-*.png')", "files.sort(key=lambda value:int(re.search(r'-(\\d+)\\.png$',value).group(1)))", "rows=[]",
    "for page_no,image in enumerate(files,start=1):", " im=Image.open(image).convert('RGB')", " w,h=im.size", " band=4", " threshold=238", " dark=lambda rgb:min(rgb)<threshold",
    " ink=sum(1 for rgb in im.get_flattened_data() if dark(rgb))",
    " top=sum(1 for y in range(band) for x in range(w) if dark(im.getpixel((x,y))))", " bottom=sum(1 for y in range(h-band,h) for x in range(w) if dark(im.getpixel((x,y))))",
    " left=sum(1 for x in range(band) for y in range(h) if dark(im.getpixel((x,y))))", " right=sum(1 for x in range(w-band,w) for y in range(h) if dark(im.getpixel((x,y))))",
    " rows.append({'page':page_no,'ink':ink,'edges':{'top':top,'bottom':bottom,'left':left,'right':right}})",
    "if len(rows)!=expected: raise SystemExit(f'rendered {len(rows)} pages, expected {expected}')", "print(json.dumps(rows))"
  ].join("\n");
  return JSON.parse(execFileSync(python, ["-c", script, prefix, String(count)], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}

async function inspectScreen(browser, baseUrl, sourceCase, difficulty, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const label = `${sourceCase.id}-d${difficulty}-${viewport.name}`;
  page.on("pageerror", error => fail(`${label}: ${error.message}`));
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceCase.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  const problem = await snapshot(page, "problem");
  await page.screenshot({ path: path.join(outputDir, `${label}-problem.png`), fullPage: true, timeout: 120000 });
  await page.locator("#solutionTab").click();
  await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
  const answer = await snapshot(page, "answer");
  await page.screenshot({ path: path.join(outputDir, `${label}-answer.png`), fullPage: true, timeout: 120000 });
  verifySnapshots(problem, answer, sourceCase, difficulty, viewport.name);
  await page.close();
}

async function inspectA4(browser, baseUrl, sourceCase, difficulty, reports) {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  const label = `${sourceCase.id}-d${difficulty}`;
  await page.goto(`${baseUrl}?type=${encodeURIComponent(sourceCase.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  const files = [];
  for (const phase of ["problem", "answer"]) {
    if (phase === "answer") await page.locator("#solutionTab").click();
    const visibleState = await page.evaluate(() => ({ problem: !document.querySelector("#problemView")?.hidden, answer: !document.querySelector("#solutionView")?.hidden }));
    if ((phase === "problem" && (!visibleState.problem || visibleState.answer)) || (phase === "answer" && (visibleState.problem || !visibleState.answer))) fail(`${label}/A4 ${phase}: 문제와 답이 분리되지 않았습니다.`);
    await page.emulateMedia({ media: "print" });
    const pdf = path.join(outputDir, `${label}-a4-${phase}.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
    files.push({ phase, pdf });
  }
  const report = { sourceCase, difficulty, pages: [] };
  for (const file of files) {
    try {
      const count = pageCount(file.pdf);
      const renders = renderAndInspectPages(file.pdf, file.pdf.replace(/\.pdf$/, ""), count);
      renders.forEach(render => {
        if (render.ink < 100) fail(`${label}/A4 ${file.phase} ${render.page}/${count}: 빈 페이지입니다.`);
        edgeNames.forEach(edge => { if (render.edges[edge] > 0) fail(`${label}/A4 ${file.phase} ${render.page}/${count}: ${edge} 가장자리 잉크 ${render.edges[edge]}픽셀`); });
      });
      report.pages.push({ phase: file.phase, count, renders });
    } catch (error) { fail(`${label}/A4 ${file.phase}: ${error.message}`); }
  }
  reports.push(report);
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const started = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  const reports = [];
  try {
    for (const viewport of [{ name: "pc", width: 1440, height: 1000 }, { name: "mobile390", width: 390, height: 844 }]) {
      for (const difficulty of difficulties) for (const sourceCase of cases) await inspectScreen(browser, started.url, sourceCase, difficulty, viewport).catch(error => fail(`${sourceCase.id}/d${difficulty}/${viewport.name}: ${error.message}`));
    }
    if (process.env.HSE_SKIP_A4 !== "1") for (const difficulty of difficulties) for (const sourceCase of cases) await inspectA4(browser, started.url, sourceCase, difficulty, reports).catch(error => fail(`${sourceCase.id}/d${difficulty}/A4: ${error.message}`));
  } finally {
    await browser.close();
    await new Promise(resolve => started.server.close(resolve));
  }
  const renders = reports.flatMap(report => report.pages.flatMap(group => group.renders));
  if (renders.length) {
    const maximumEdges = Object.fromEntries(edgeNames.map(edge => [edge, Math.max(...renders.map(render => render.edges[edge]))]));
    console.log(`A4 전수 집계: PDF ${reports.reduce((sum, report) => sum + report.pages.length, 0)}개, 전체 ${renders.length}쪽 렌더`);
    console.log(`A4 가장자리 최대 잉크: 상 ${maximumEdges.top}, 하 ${maximumEdges.bottom}, 좌 ${maximumEdges.left}, 우 ${maximumEdges.right}픽셀`);
  }
  if (failures.length) {
    console.error(`6-1 부피 활용 E4 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 240).join("\n"));
    process.exit(1);
  }
  console.log("6-1 부피 활용 E4 브라우저 감사 통과: 13유형 × 3고정풀 × 3난이도 · PC·390px·A4 문제/답 전수 확인");
})().catch(error => { console.error(error.stack || error.message); process.exit(1); });
