"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = path.join(__dirname, "tmp", "decimal-division-e1-browser-audit");
const sourceIds = [
  "6-1-u3-e1-exploration-1", "6-1-u3-e1-example-1", "6-1-u3-e1-example-2", "6-1-u3-e1-example-3",
  "6-1-u3-e1-example-4", "6-1-u3-e1-mission-1", "6-1-u3-e1-mission-2", "6-1-u3-e1-mission-5", "6-1-u3-e1-mission-6"
];
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
const fail = message => failures.push(message);

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404); response.end("not found"); return;
    }
    const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function buildGenerator() {
  global.window = {};
  delete require.cache[require.resolve("./generators.js")];
  require("./generators.js");
  return window.HSE_GENERATORS;
}

async function inspect(page, generated, sourceId, difficulty, view, viewportName) {
  const html = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  await page.evaluate(content => { document.body.innerHTML = content; }, html);
  await page.waitForTimeout(50);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svgs = [...document.querySelectorAll("svg.source61-e1-diagram")];
    const textOverlap = [];
    svgs.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ node, box: node.getBoundingClientRect() }));
      texts.forEach((left, leftIndex) => texts.slice(leftIndex + 1).forEach((right, rightIndex) => {
        const overlap = left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1;
        if (overlap) textOverlap.push(`${svgIndex}:${leftIndex}:${leftIndex + rightIndex + 1}`);
      }));
    });
    const boxes = [...document.querySelectorAll("svg.source61-e1-diagram")].map(svg => ({
      rect: (() => { const box = svg.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; })(),
      bbox: (() => { try { const box = svg.getBBox(); return { x: box.x, y: box.y, width: box.width, height: box.height }; } catch (_) { return { x: 0, y: 0, width: 0, height: 0 }; } })(),
      font: getComputedStyle(svg.querySelector("text") || svg).fontFamily,
      structure: svg.dataset.source61E1Structure || "",
      values: svg.dataset.source61E1Values || ""
    }));
    const mathBoards = [...document.querySelectorAll(".source61-math-board")].map(board => {
      const box = board.getBoundingClientRect();
      return { rect: { x: box.x, y: box.y, width: box.width, height: box.height }, text: (board.innerText || "").trim() };
    });
    const questionPrompt = document.querySelector(".question-prompt");
    const promptBox = questionPrompt?.getBoundingClientRect();
    const bodyText = document.body.innerText || "";
    return {
      bodyText,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      itemOverflow: item ? item.scrollWidth > item.clientWidth + 2 : true,
      itemRect: item ? (() => { const box = item.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; })() : null,
      promptContent: questionPrompt ? { text: (questionPrompt.innerText || "").trim(), rect: { x: promptBox.x, y: promptBox.y, width: promptBox.width, height: promptBox.height } } : null,
      mathBoards,
      boxes,
      textOverlap,
      answerWrapper: document.querySelector(".source61-e1-answer")?.dataset || null,
      problemLeak: document.querySelectorAll(".source61-e1-answer,[data-answer-source],[data-result-highlight]").length,
      hasResult: document.querySelectorAll("[data-result-highlight]").length
    };
  });
  const label = `${sourceId} / ${viewportName} / 난이도 ${difficulty} / ${view}`;
  if (state.pageOverflow || state.itemOverflow || !state.itemRect || state.itemRect.left < -2 || state.itemRect.right > (await page.evaluate(() => innerWidth)) + 2) fail(`${label}: 가로 넘침 또는 화면 밖 문항`);
  const invalidSvg = state.boxes.some(box => box.rect.width <= 0 || box.rect.height <= 0 || box.bbox.width <= 0 || box.bbox.height <= 0);
  if (view === "problem") {
    if (!state.promptContent || !state.promptContent.text || state.promptContent.rect.width <= 0 || state.promptContent.rect.height <= 0) fail(`${label}: 문제 자료가 비어 있거나 화면에 표시되지 않음`);
    if (state.boxes.length ? invalidSvg : !state.mathBoards.length || state.mathBoards.some(board => board.rect.width <= 0 || board.rect.height <= 0 || !board.text)) fail(`${label}: 문제 자료의 그림 또는 수식 보드가 비어 있음`);
  } else {
    if (!state.boxes.length || invalidSvg) fail(`${label}: 답 그림이 비어 있거나 SVG가 화면에 표시되지 않음`);
    if (state.boxes.some(box => !box.font.includes("Pretendard") || !box.font.includes("Malgun Gothic") || !box.font.includes("Arial"))) fail(`${label}: 공통 수학 글꼴 누락`);
  }
  if (state.textOverlap.length) fail(`${label}: SVG 글자 겹침 ${state.textOverlap.join(",")}`);
  if (/undefined|null|NaN|Infinity|\b\d+\s*\/\s*\d+\b/.test(state.bodyText)) fail(`${label}: 깨진 값 또는 슬래시 분수`);
  if (view === "problem") {
    if (state.answerWrapper || state.hasResult || state.problemLeak) fail(`${label}: 문제 화면에 답 전용 정보 노출`);
  } else {
    if (!state.answerWrapper || state.answerWrapper.answerSource !== sourceId || Number(state.answerWrapper.verifiedPoolIndex) !== generated.verifiedPoolIndex) fail(`${label}: 답 원문 연결 또는 pool 번호 누락`);
    if (state.hasResult !== state.boxes.length) fail(`${label}: 답 그림의 결과 표시 누락`);
  }
}

async function capture(page, file, label) {
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (!fs.existsSync(file) || fs.statSync(file).size < 2000) fail(`${label}: 화면 캡처가 비었습니다.`);
  screenshots += 1;
}

async function capturePdf(page, file, label) {
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
  if (!fs.existsSync(file) || fs.statSync(file).size < 2000) fail(`${label}: A4 PDF가 비었습니다.`);
  pdfs += 1;
  renderedPages += 1;
  await page.emulateMedia({ media: "screen" });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const api = buildGenerator();
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
    for (let variant = 0; variant < sourceIds.length; variant += 1) {
      for (const difficulty of [-1, 0, 1]) {
        for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
          const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
          await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "domcontentloaded" });
          const generated = api.generate({ sourceItemId: sourceIds[variant] }, 0, difficulty, 610300 + variant * 100000 + (difficulty + 1) * 1000 + 17, variant);
          await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
          await capture(page, path.join(outputDir, `${sourceIds[variant]}-${difficulty}-${viewportName}-problem.png`), `${sourceIds[variant]} problem`);
          await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
          await capture(page, path.join(outputDir, `${sourceIds[variant]}-${difficulty}-${viewportName}-answer.png`), `${sourceIds[variant]} answer`);
          if (difficulty === 0 && viewportName === "desktop") {
            await inspect(page, generated, sourceIds[variant], difficulty, "problem", viewportName);
            await capturePdf(page, path.join(outputDir, `${sourceIds[variant]}-problem-a4.pdf`), `${sourceIds[variant]} problem`);
            await inspect(page, generated, sourceIds[variant], difficulty, "answer", viewportName);
            await capturePdf(page, path.join(outputDir, `${sourceIds[variant]}-answer-a4.pdf`), `${sourceIds[variant]} answer`);
          }
          await page.close();
        }
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 108) fail(`화면 캡처 ${screenshots}장, 108장이어야 합니다.`);
  if (pdfs !== 18) fail(`A4 PDF ${pdfs}개, 18개이어야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: 9유형×3난이도×PC/모바일, 고정 pool 3개, 문제·답 분리·답 그림·공통 글꼴·글자 겹침·가로 넘침 검사; 화면 ${screenshots}장, A4 ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
