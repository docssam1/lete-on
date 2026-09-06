"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..", "..");
const output = path.join(process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-grade6-e4-browser-audit"));
const poppler = process.env.HSE_POPPLER_BIN || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin";
const pdfinfo = path.join(poppler, "pdfinfo.exe");
const pdftoppm = path.join(poppler, "pdftoppm.exe");
const python = process.env.HSE_PYTHON || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe";
const failures = [];
const edgeNames = ["top", "bottom", "left", "right"];
const mobileMetrics = {
  readableHeight: Infinity,
  readableWidth: Infinity,
  importantHeight: Infinity,
  importantWidth: Infinity
};
const fail = message => failures.push(message);
const sum = values => values.reduce((total, value) => total + value, 0);
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-6;
const graph = (title, labels, values) => ({ title, labels, values });

const cases = [
  { id: "6-1-u5-e4-exploration-1", pools: [
    { total: 5000, agree: 70, oppose: 30, agreeReasons: [35, 34, 22, 9], opposeReasons: [33, 32, 28, 7] },
    { total: 6000, agree: 60, oppose: 40, agreeReasons: [40, 30, 20, 10], opposeReasons: [25, 35, 30, 10] },
    { total: 4000, agree: 75, oppose: 25, agreeReasons: [30, 28, 25, 17], opposeReasons: [40, 30, 20, 10] }
  ] },
  { id: "6-1-u5-e4-exploration-2", pools: [
    { total: 5000, agree: 70, oppose: 30, agreeReasons: [35, 34, 22, 9], opposeReasons: [33, 32, 28, 7] },
    { total: 6000, agree: 60, oppose: 40, agreeReasons: [40, 30, 20, 10], opposeReasons: [25, 35, 30, 10] },
    { total: 4000, agree: 75, oppose: 25, agreeReasons: [30, 28, 25, 17], opposeReasons: [40, 30, 20, 10] }
  ] },
  { id: "6-1-u5-e4-example-1", pools: [
    { surname: [22, 15, 8, 55], branches: [42, 17, 9, 32] },
    { surname: [25, 10, 12, 53], branches: [40, 20, 15, 25] },
    { surname: [20, 15, 10, 55], branches: [45, 20, 12, 23] }
  ] },
  { id: "6-1-u5-e4-example-2", pools: [
    { male: 60, female: 40, maleRates: [25, 35, 40], femaleRates: [45, 25, 30] },
    { male: 55, female: 45, maleRates: [30, 30, 40], femaleRates: [40, 35, 25] },
    { male: 48, female: 52, maleRates: [20, 45, 35], femaleRates: [30, 30, 40] }
  ] },
  { id: "6-1-u5-e4-mission-1", pools: [{ before: [30, 25, 20, 15, 10] }, { before: [40, 20, 15, 15, 10] }, { before: [20, 30, 25, 15, 10] }] },
  { id: "6-1-u5-e4-mission-2", pools: [
    { gender: [62, 38], academies: [35, 30, 20, 15] },
    { gender: [55, 45], academies: [30, 20, 35, 15] },
    { gender: [64, 36], academies: [40, 25, 20, 15] }
  ] },
  { id: "6-1-u5-e4-mission-4", pools: [
    { gifts: [30, 25, 20, 25], toys: [45, 20, 10, 25] },
    { gifts: [25, 30, 20, 25], toys: [40, 25, 15, 20] },
    { gifts: [35, 20, 20, 25], toys: [50, 15, 10, 25] }
  ] },
  { id: "6-1-u5-e4-mission-5", pools: [
    { total: 80, angles: [36, 81, 162, 81], known: [8, 8, 12], points: [6, 6, 8] },
    { total: 100, angles: [36, 72, 180, 72], known: [10, 10, 20], points: [5, 5, 8] },
    { total: 60, angles: [60, 60, 180, 60], known: [10, 6, 15], points: [4, 4, 5] }
  ] },
  { id: "6-1-u5-e4-mission-6", pools: [
    { male: 52, female: 48, femaleRate: 24 },
    { male: 55, female: 45, femaleRate: 20 },
    { male: 48, female: 52, femaleRate: 25 }
  ] }
];

const agreeLabels = ["일자리가 생기므로", "관광 수요 증가", "지역의 성장", "기타"];
const opposeLabels = ["공사 중 공해 발생", "환경 훼손 염려", "교통 체증", "기타"];

function scoreRows(data) {
  const groups = data.angles.map(angle => data.total * angle / 360);
  const counts = [data.known[0], data.known[1], groups[1] - data.known[1], data.known[2], groups[2] - data.known[2], groups[3]];
  const scores = [0, data.points[0], data.points[2], data.points[0] + data.points[1], data.points[1] + data.points[2], sum(data.points)];
  return scores.map((score, index) => ({ score, count: counts[index] })).sort((a, b) => a.score - b.score);
}

function expected(id, data) {
  const labels = ["소설", "참고서", "위인전", "시집", "기타"];
  if (id.endsWith("exploration-1")) {
    const graphs = [graph("찬반 여부", ["찬성", "반대"], [data.agree, data.oppose]), graph("찬성 이유", agreeLabels, data.agreeReasons), graph("반대 이유", opposeLabels, data.opposeReasons)];
    return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
  }
  if (id.endsWith("exploration-2")) {
    const before = [graph("이동 전 찬반 여부", ["찬성", "반대"], [data.agree, data.oppose]), graph("이동 전 찬성 이유", agreeLabels, data.agreeReasons), graph("이동 전 반대 이유", opposeLabels, data.opposeReasons)];
    const moved = data.total * data.oppose * data.opposeReasons[2] / 10000;
    const oldOther = data.total * data.agree * data.agreeReasons[3] / 10000;
    const newAgree = data.total * data.agree / 100 + moved;
    const otherRate = (oldOther + moved) * 100 / newAgree;
    return { problemGraphs: before, answerGraphs: [...before, graph("바뀐 뒤 찬반 여부", ["찬성", "반대"], [newAgree * 100 / data.total, 100 - newAgree * 100 / data.total]), graph("바뀐 뒤 찬성 이유", ["기타", "기타 외"], [otherRate, 100 - otherRate])], problemTables: [], answerTables: [] };
  }
  if (id.endsWith("example-1")) {
    const graphs = [graph("우리나라 성씨별 사람 수", ["김씨", "이씨", "박씨", "기타"], data.surname), graph("김씨의 본관별 사람 수", ["김해 김씨", "경주 김씨", "광산 김씨", "기타"], data.branches)];
    return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
  }
  if (id.endsWith("example-2")) {
    const graphs = [graph("남녀 학생 수", ["남학생", "여학생"], [data.male, data.female]), graph("다니는 학원별 남학생 수", ["피아노", "미술", "태권도"], data.maleRates), graph("다니는 학원별 여학생 수", ["피아노", "미술", "태권도"], data.femaleRates)];
    return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
  }
  if (id.endsWith("mission-1")) {
    const after = [data.before[0] / 2, data.before[1], data.before[2] + data.before[0] / 2, data.before[3], data.before[4]];
    return { problemGraphs: [graph("1학기 학급 문고의 종류별 권수", labels, data.before), graph("2학기 학급 문고의 종류별 권수", [], [])], answerGraphs: [graph("1학기 학급 문고의 종류별 권수", labels, data.before), graph("2학기 학급 문고의 종류별 권수", labels, after)], problemTables: [], answerTables: [] };
  }
  if (id.endsWith("mission-2")) {
    const graphs = [graph("남녀의 수", ["남학생", "여학생"], data.gender), graph("여학생이 다니고 싶은 학원별 학생 수", ["미술 학원", "피아노 학원", "발레 학원", "기타"], data.academies)];
    return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
  }
  if (id.endsWith("mission-4")) {
    const graphs = [graph("받고 싶은 선물별 학생 수", ["휴대전화", "게임기", "장난감", "기타"], data.gifts), graph("장난감 종류별 학생 수", ["로봇", "팽이", "큐브", "기타"], data.toys)];
    return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
  }
  if (id.endsWith("mission-5")) {
    const rows = scoreRows(data);
    const known = [0, data.points[0], data.points[0] + data.points[1]];
    const graphData = graph("시험 결과", ["3문제 모두 틀린 학생", "1문제 맞힌 학생", "2문제 맞힌 학생", "3문제 맞힌 학생"], data.angles.map(angle => angle / 3.6));
    return {
      problemGraphs: [graphData], answerGraphs: [graphData],
      problemTables: [["점수|학생 수", ...rows.map(row => `${row.score}점|${known.includes(row.score) ? row.count : "□"}`)]],
      answerTables: [["점수|학생 수", ...rows.map(row => `${row.score}점|${row.count}`)]]
    };
  }
  const values = [34, data.femaleRate, 20, 12, 100 - 34 - data.femaleRate - 20 - 12];
  const graphs = [graph("남·여학생 수", ["남학생", "여학생"], [data.male, data.female]), graph("여학생이 좋아하는 상표", ["가 상표", "나 상표", "다 상표", "라 상표", "기타"], values)];
  return { problemGraphs: graphs, answerGraphs: graphs, problemTables: [], answerTables: [] };
}

function safeFile(url) {
  const relative = decodeURIComponent((url || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(root, relative || "index.html");
  return file === root || file.startsWith(root + path.sep) ? file : null;
}

function typeOf(file) {
  return ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json" })[path.extname(file)] || "application/octet-stream";
}

async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safeFile(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": typeOf(file) + "; charset=utf-8", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return { server, url: "http://127.0.0.1:" + server.address().port + "/hselementary/question-bank/" };
}

function compareGraphs(actual, wanted, label) {
  if (actual.length !== wanted.length) fail(`${label}: 그래프 수 ${actual.length}/${wanted.length}`);
  wanted.forEach((expectedGraph, index) => {
    const got = actual[index];
    if (!got) return;
    if (got.title !== expectedGraph.title) fail(`${label}: ${index + 1}번 제목 '${got.title}' != '${expectedGraph.title}'`);
    if (JSON.stringify(got.labels) !== JSON.stringify(expectedGraph.labels)) fail(`${label}: ${got.title} 항목 순서 불일치 ${got.labels.join("/")}`);
    if (got.values.length !== expectedGraph.values.length || got.values.some((value, valueIndex) => !close(value, expectedGraph.values[valueIndex]))) fail(`${label}: ${got.title} 구간 비율 불일치 ${got.values.join("/")}`);
  });
}

function compareTables(actual, wanted, label) {
  const compact = actual.map(table => table.rows.map(row => row.join("|")).join("||"));
  const expected = wanted.map(table => table.join("||"));
  if (JSON.stringify(compact) !== JSON.stringify(expected)) fail(`${label}: 표 셀 자료 불일치 ${JSON.stringify(compact)}`);
}

async function snapshot(page, phase) {
  return page.evaluate(currentPhase => {
    const itemRoots = currentPhase === "problem"
      ? [...document.querySelectorAll("#problemView .question-item")]
      : [...document.querySelectorAll("#solutionView .solution-item")].map(item => item.querySelector(".source61-graphs-e4-answer")).filter(Boolean);
    const describeGraph = element => {
      const pie = Boolean(element.querySelector(".source61-e4-pie"));
      const segments = [...element.querySelectorAll(pie ? ".source61-e4-sector" : ".source61-e4-strip-segment")];
      const svgRect = element.getBoundingClientRect();
      const texts = [...element.querySelectorAll(".source61-e4-readable-text")].map(text => {
        const rect = text.getBoundingClientRect();
        return {
          value: (text.textContent || "").trim(),
          important: text.classList.contains("source61-e4-important-value"),
          width: rect.width,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          fontSize: parseFloat(getComputedStyle(text).fontSize)
        };
      });
      const clipped = texts.filter(text => text.left < svgRect.left - 1 || text.right > svgRect.right + 1 || text.top < svgRect.top - 1 || text.bottom > svgRect.bottom + 1).map(text => text.value);
      const overlaps = [];
      for (let left = 0; left < texts.length; left += 1) for (let right = left + 1; right < texts.length; right += 1) {
        const a = texts[left], b = texts[right];
        const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapWidth > 1 && overlapHeight > 1) overlaps.push(`${a.value}<>${b.value}`);
      }
      return {
        title: element.getAttribute("aria-label") || "",
        phase: element.dataset.phase || "",
        labels: segments.map(item => item.dataset.segmentLabel || item.dataset.stripLabel || ""),
        values: segments.map(item => Number(item.dataset.segmentPercent || item.dataset.stripPercent)),
        guides: [...element.querySelectorAll("[data-strip-guide]")].map(item => Number(item.dataset.stripGuide)),
        textMetrics: texts,
        clipped,
        overlaps
      };
    };
    const items = itemRoots.map(item => ({
      sourceId: currentPhase === "problem" ? item.querySelector("[data-source61-graphs-e4-kind]")?.dataset.sourceItem || "" : item.dataset.answerSource || "",
      poolIndex: currentPhase === "answer" ? Number(item.dataset.verifiedPoolIndex) : null,
      graphs: [...item.querySelectorAll(".source61-graphs-e4-diagram")].map(describeGraph),
      tables: [...item.querySelectorAll(".source61-e4-table")].map(table => ({ phase: table.dataset.phase || "", rows: [...table.rows].map(row => [...row.cells].map(cell => (cell.textContent || "").trim())) }))
    }));
    return {
      items,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      broken: /undefined|null|NaN|Infinity|SyntaxError/.test(document.body.innerText)
    };
  }, phase);
}

function verifySnapshot(problem, answer, sourceCase, difficulty, viewportName) {
  const label = `${sourceCase.id}/d${difficulty}/${viewportName}`;
  if (problem.items.length !== 3 || answer.items.length !== 3) fail(`${label}: 문제/답 문항 수가 3이 아닙니다.`);
  if (problem.overflow || answer.overflow) fail(`${label}: 가로 넘침이 있습니다.`);
  if (problem.broken || answer.broken) fail(`${label}: 깨진 값이 표시됩니다.`);
  const pools = answer.items.map(item => item.poolIndex);
  if (new Set(pools).size !== 3 || ![0, 1, 2].every(pool => pools.includes(pool))) fail(`${label}: 고정 풀 0/1/2가 모두 나오지 않습니다.`);
  answer.items.forEach((answerItem, index) => {
    const problemItem = problem.items[index];
    const itemLabel = `${label}/p${answerItem.poolIndex}`;
    if (!problemItem || problemItem.sourceId !== sourceCase.id || answerItem.sourceId !== sourceCase.id) fail(`${itemLabel}: 원본 유형 연결이 다릅니다.`);
    const wanted = expected(sourceCase.id, sourceCase.pools[answerItem.poolIndex]);
    compareGraphs(problemItem?.graphs || [], wanted.problemGraphs, `${itemLabel}/문제`);
    compareGraphs(answerItem.graphs, wanted.answerGraphs, `${itemLabel}/답`);
    compareTables(problemItem?.tables || [], wanted.problemTables, `${itemLabel}/문제`);
    compareTables(answerItem.tables, wanted.answerTables, `${itemLabel}/답`);
    [...(problemItem?.graphs || []), ...answerItem.graphs].forEach(graphInfo => {
      if (graphInfo.phase !== (problemItem?.graphs.includes(graphInfo) ? "problem" : "answer")) fail(`${itemLabel}: 그래프 단계 표시가 틀렸습니다.`);
      if (graphInfo.guides.length && JSON.stringify(graphInfo.guides) !== JSON.stringify([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])) fail(`${itemLabel}/${graphInfo.title}: 10% 눈금 불일치`);
      if (graphInfo.clipped.length) fail(`${itemLabel}/${graphInfo.title}: 잘린 글자 ${graphInfo.clipped.join("/")}`);
      if (graphInfo.overlaps.length) fail(`${itemLabel}/${graphInfo.title}: 겹친 글자 ${graphInfo.overlaps.join("/")}`);
      if (viewportName === "mobile390") graphInfo.textMetrics.forEach(metric => {
        const minimum = metric.important ? 11 : 10;
        mobileMetrics.readableHeight = Math.min(mobileMetrics.readableHeight, metric.height);
        mobileMetrics.readableWidth = Math.min(mobileMetrics.readableWidth, metric.width);
        if (metric.important) {
          mobileMetrics.importantHeight = Math.min(mobileMetrics.importantHeight, metric.height);
          mobileMetrics.importantWidth = Math.min(mobileMetrics.importantWidth, metric.width);
        }
        if (metric.width <= 0 || metric.height < minimum) fail(`${itemLabel}/${graphInfo.title}: '${metric.value}' 실제 글자 높이 ${metric.height.toFixed(2)}px < ${minimum}px`);
        if (metric.fontSize < (metric.important ? 22 : 20)) fail(`${itemLabel}/${graphInfo.title}: '${metric.value}' SVG 글자 설정 ${metric.fontSize}px 부족`);
      });
    });
    (problemItem?.tables || []).forEach(table => { if (table.phase !== "problem") fail(`${itemLabel}: 문제 표 단계 오류`); });
    answerItem.tables.forEach(table => { if (table.phase !== "answer") fail(`${itemLabel}: 답 표 단계 오류`); });
  });
}

function pageCount(file) {
  const info = execFileSync(pdfinfo, [file], { encoding: "utf8" });
  const count = Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
  if (!Number.isInteger(count) || count < 1) throw new Error("PDF 페이지 수를 읽지 못했습니다.");
  return count;
}

function renderAndInspectPages(file, prefix, count) {
  const directory = path.dirname(prefix);
  const stem = path.basename(prefix) + "-";
  fs.readdirSync(directory).filter(name => name.startsWith(stem) && name.endsWith(".png")).forEach(name => fs.unlinkSync(path.join(directory, name)));
  execFileSync(pdftoppm, ["-f", "1", "-l", String(count), "-png", "-r", "110", file, prefix], { stdio: "ignore" });
  const script = [
    "from PIL import Image",
    "import glob, json, os, re, sys",
    "prefix=sys.argv[1]",
    "expected=int(sys.argv[2])",
    "files=glob.glob(prefix+'-*.png')",
    "files.sort(key=lambda value:int(re.search(r'-(\\d+)\\.png$', value).group(1)))",
    "rows=[]",
    "for page_no, image in enumerate(files, start=1):",
    " im=Image.open(image).convert('RGB')",
    " w,h=im.size",
    " band=4",
    " threshold=238",
    " dark=lambda rgb:min(rgb)<threshold",
    " ink=sum(1 for rgb in im.get_flattened_data() if dark(rgb))",
    " top=sum(1 for y in range(band) for x in range(w) if dark(im.getpixel((x,y))))",
    " bottom=sum(1 for y in range(h-band,h) for x in range(w) if dark(im.getpixel((x,y))))",
    " left=sum(1 for x in range(band) for y in range(h) if dark(im.getpixel((x,y))))",
    " right=sum(1 for x in range(w-band,w) for y in range(h) if dark(im.getpixel((x,y))))",
    " rows.append({'page':page_no,'image':os.path.abspath(image),'width':w,'height':h,'ink':ink,'edges':{'top':top,'bottom':bottom,'left':left,'right':right}})",
    "if len(rows)!=expected: raise SystemExit(f'rendered {len(rows)} pages, expected {expected}')",
    "print(json.dumps(rows, ensure_ascii=False))"
  ].join("\n");
  return JSON.parse(execFileSync(python, ["-c", script, prefix, String(count)], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}

async function inspectScreen(page, baseUrl, sourceCase, difficulty, viewport) {
  const url = `${baseUrl}?type=${encodeURIComponent(sourceCase.id)}&review=1&difficulty=${difficulty}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  const problem = await snapshot(page, "problem");
  const base = `${sourceCase.id}-d${difficulty}-${viewport.name}`;
  await page.screenshot({ path: path.join(output, base + "-problem.png"), fullPage: true, timeout: 120000 });
  await page.locator("#solutionTab").click();
  const answer = await snapshot(page, "answer");
  await page.screenshot({ path: path.join(output, base + "-answer.png"), fullPage: true, timeout: 120000 });
  verifySnapshot(problem, answer, sourceCase, difficulty, viewport.name);
}

async function inspectA4(page, baseUrl, sourceCase, difficulty, pageReports) {
  const url = `${baseUrl}?type=${encodeURIComponent(sourceCase.id)}&review=1&difficulty=${difficulty}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 30000 });
  const base = `${sourceCase.id}-d${difficulty}`;
  const problemState = await page.evaluate(() => ({ problem: !document.querySelector("#problemView")?.hidden, answer: !document.querySelector("#solutionView")?.hidden }));
  if (!problemState.problem || problemState.answer) fail(`${base}/A4 문제: 문제와 답 화면이 분리되지 않았습니다.`);
  await page.emulateMedia({ media: "print" });
  const problemPdf = path.join(output, base + "-a4-problem.pdf");
  await page.pdf({ path: problemPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  await page.locator("#solutionTab").click();
  const answerState = await page.evaluate(() => ({ problem: !document.querySelector("#problemView")?.hidden, answer: !document.querySelector("#solutionView")?.hidden }));
  if (answerState.problem || !answerState.answer) fail(`${base}/A4 답: 문제와 답 화면이 분리되지 않았습니다.`);
  await page.emulateMedia({ media: "print" });
  const answerPdf = path.join(output, base + "-a4-answer.pdf");
  await page.pdf({ path: answerPdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  await page.emulateMedia({ media: "screen" });
  try {
    const problemPages = pageCount(problemPdf);
    const answerPages = pageCount(answerPdf);
    const problemRenders = renderAndInspectPages(problemPdf, path.join(output, base + "-a4-problem"), problemPages);
    const answerRenders = renderAndInspectPages(answerPdf, path.join(output, base + "-a4-answer"), answerPages);
    [{ phase: "문제", pages: problemRenders }, { phase: "답", pages: answerRenders }].forEach(group => group.pages.forEach(render => {
      if (render.ink < 100) fail(`${base}/A4 ${group.phase} ${render.page}/${group.pages.length}쪽: 빈 페이지입니다.`);
      edgeNames.forEach(edge => {
        if (render.edges[edge] > 0) fail(`${base}/A4 ${group.phase} ${render.page}/${group.pages.length}쪽: ${edge} 가장자리 잉크 ${render.edges[edge]}픽셀`);
      });
    }));
    const problemHash = crypto.createHash("sha256").update(fs.readFileSync(problemPdf)).digest("hex");
    const answerHash = crypto.createHash("sha256").update(fs.readFileSync(answerPdf)).digest("hex");
    if (problemHash === answerHash) fail(`${base}/A4: 문제와 답 PDF가 같습니다.`);
    pageReports.push({ id: sourceCase.id, difficulty, problemPages, answerPages, problemRenders, answerRenders });
  } catch (error) {
    fail(`${base}/A4: ${error.message}`);
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const started = await startServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  const pageReports = [];
  try {
    for (const viewport of [{ name: "pc", width: 1440, height: 1000 }, { name: "mobile390", width: 390, height: 844 }]) {
      for (const difficulty of [-1, 0, 1]) for (const sourceCase of cases) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        page.on("pageerror", error => fail(`${sourceCase.id}/${viewport.name}: ${error.message}`));
        await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
        await inspectScreen(page, started.url, sourceCase, difficulty, viewport).catch(error => fail(`${sourceCase.id}/d${difficulty}/${viewport.name}: ${error.message}`));
        await page.close();
      }
    }
    for (const difficulty of [-1, 0, 1]) for (const sourceCase of cases) {
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
      await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
      await inspectA4(page, started.url, sourceCase, difficulty, pageReports);
    }
  } finally {
    await browser.close();
    await new Promise(resolve => started.server.close(resolve));
  }
  if (pageReports.length) {
    const problemPages = pageReports.reduce((total, item) => total + item.problemPages, 0);
    const answerPages = pageReports.reduce((total, item) => total + item.answerPages, 0);
    const renders = pageReports.flatMap(item => [...item.problemRenders, ...item.answerRenders]);
    const maximumEdges = Object.fromEntries(edgeNames.map(edge => [edge, Math.max(...renders.map(render => render.edges[edge]))]));
    console.log(`A4 전수 집계: PDF ${pageReports.length * 2}개, 문제 ${problemPages}쪽, 답 ${answerPages}쪽, 전체 ${renders.length}쪽 렌더`);
    console.log(`A4 가장자리 최대 잉크: 상 ${maximumEdges.top}, 하 ${maximumEdges.bottom}, 좌 ${maximumEdges.left}, 우 ${maximumEdges.right}픽셀`);
  }
  if (Number.isFinite(mobileMetrics.readableHeight)) {
    console.log(`390px 실제 글자 최소값: 전체 ${mobileMetrics.readableHeight.toFixed(2)}px 높이 / ${mobileMetrics.readableWidth.toFixed(2)}px 너비, 중요 수치 ${mobileMetrics.importantHeight.toFixed(2)}px 높이 / ${mobileMetrics.importantWidth.toFixed(2)}px 너비`);
  }
  if (failures.length) {
    console.error("6-1 5단원 E4 브라우저 감사 실패: " + failures.length + "건");
    console.error(failures.slice(0, 240).join("\n"));
    process.exit(1);
  }
  console.log("6-1 5단원 E4 브라우저 감사 통과: 9유형 × 3난이도 × 3고정풀, PC·390px 상세 자료와 A4 문제/답 모든 페이지 확인");
})().catch(error => { console.error(error.stack || error.message); process.exit(1); });
