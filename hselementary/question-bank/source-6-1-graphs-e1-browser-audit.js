"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const outputDir = path.join(__dirname, "tmp", "source-6-1-graphs-e1-browser-audit");
const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8")
  .replace(/^@import[^;]+;\s*/, "");
const sourceIds = [
  "6-1-u5-e1-example-1", "6-1-u5-e1-example-2", "6-1-u5-e1-example-3",
  "6-1-u5-e1-mission-1", "6-1-u5-e1-mission-2", "6-1-u5-e1-mission-3",
  "6-1-u5-e1-mission-4", "6-1-u5-e1-mission-5", "6-1-u5-e1-mission-6"
];
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const shell = (generated, view) => {
  const answer = view === "answer";
  const body = answer ? generated.answerVisual : generated.prompt;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${css}</style><style>body{margin:0;background:#eef3f7}.review-stage{max-width:900px;margin:0 auto;padding:20px}.question-item{background:#fff;border:1px solid #b5c5d1;padding:20px}.question-prompt{font-size:16px;line-height:1.7}.verified-answer-diagram{margin-top:12px}.source61-graphs-e1-diagram{display:block;margin:12px auto;max-width:100%}</style></head><body><main class="review-stage"><article class="question-item"><header><span>${answer ? "정답·풀이" : "문제"}</span>${answer ? `<strong>${generated.answer}</strong>` : ""}</header><div class="question-prompt">${body}</div>${answer ? `<p>${generated.solution}</p>` : ""}</article></main></body></html>`;
};
const inspect = async (page, sourceId, difficulty, view, viewportName) => {
  const state = await page.evaluate(() => {
    const diagrams = [...document.querySelectorAll("svg.source61-graphs-e1-diagram")];
    const question = document.querySelector(".question-item");
    const textOverlaps = [];
    const rowValueErrors = [];
    const symbolSizeErrors = [];
    const legendLayoutErrors = [];
    const resultLayoutErrors = [];
    const symbolFrameErrors = [];
    diagrams.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ node, box: node.getBoundingClientRect() }));
      texts.forEach((left, index) => texts.slice(index + 1).forEach((right, offset) => {
        if (left.box.left < right.box.right - 1 && left.box.right > right.box.left + 1 && left.box.top < right.box.bottom - 1 && left.box.bottom > right.box.top + 1) textOverlaps.push(`${svgIndex}:${index}:${index + offset + 1}`);
      }));
      [...svg.querySelectorAll(".source61-e1-row")].forEach(row => {
        if (row.dataset.rowValue === "") return;
        const encoded = [...row.querySelectorAll(".source61-e1-symbol")].reduce((sum, symbol) => sum + Number(symbol.dataset.symbolValue || 0), 0);
        if (encoded !== Number(row.dataset.rowValue)) rowValueErrors.push(`${row.dataset.rowLabel}:${encoded}/${row.dataset.rowValue}`);
      });
      const legendItems = [...svg.querySelectorAll(".source61-e1-legend-item")];
      const widths = legendItems.map(item => item.querySelector(".source61-e1-symbol")?.getBoundingClientRect().width || 0);
      if (!widths.length || widths.some((width, index) => width <= 0 || (index > 0 && width >= widths[index - 1]))) symbolSizeErrors.push(widths.join("/"));
      legendItems.forEach(item => {
        const symbol = item.querySelector(".source61-e1-symbol")?.getBoundingClientRect();
        const label = item.querySelector(".source61-e1-legend-label")?.getBoundingClientRect();
        if (!symbol || !label || label.left < symbol.right + 2) legendLayoutErrors.push(item.dataset.legendUnit || "unknown");
      });
      const frame = svg.querySelector(".source61-e1-frame")?.getBoundingClientRect();
      const resultBox = svg.querySelector(".source61-e1-result-box")?.getBoundingClientRect();
      if (resultBox && (!frame || resultBox.left < frame.left + 2 || resultBox.right > frame.right - 2 || resultBox.bottom > frame.bottom - 2)) resultLayoutErrors.push(String(svgIndex));
      [...svg.querySelectorAll(".source61-e1-symbol")].forEach(symbol => {
        const box = symbol.getBoundingClientRect();
        if (!frame || box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1) symbolFrameErrors.push(`${svgIndex}:${symbol.dataset.symbolValue || "?"}`);
      });
    });
    return {
      diagrams: diagrams.map(svg => { const box = svg.getBoundingClientRect(); return { structure: svg.dataset.source61GraphsE1Structure, layout: svg.dataset.source61GraphsE1Layout, values: svg.dataset.source61GraphsE1Values, denominations: svg.dataset.symbolDenominations, shapes: svg.dataset.symbolShapes, width: box.width, height: box.height, left: box.left, right: box.right, top: box.top, bottom: box.bottom, bbox: (() => { try { const b = svg.getBBox(); return { width: b.width, height: b.height }; } catch (_) { return { width: 0, height: 0 }; } })(), solved: svg.hasAttribute("data-result-highlight") }; }),
      question: question ? { scrollWidth: question.scrollWidth, clientWidth: question.clientWidth, left: question.getBoundingClientRect().left, right: question.getBoundingClientRect().right } : null,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      bodyText: document.body.innerText || "",
      answerCount: document.querySelectorAll(".source61-graphs-e1-answer").length,
      textOverlaps,
      rowValueErrors,
      symbolSizeErrors,
      legendLayoutErrors,
      resultLayoutErrors,
      symbolFrameErrors
    };
  });
  const width = await page.evaluate(() => innerWidth);
  const label = `${sourceId} / 난이도 ${difficulty} / ${viewportName} / ${view}`;
  if (state.diagrams.length !== 1) fail(`${label}: 그래프 그림 수가 1개가 아닙니다.`);
  if (view === "problem" && state.diagrams.some(item => item.solved || state.answerCount)) fail(`${label}: 문제 화면에 답 그림 또는 정답 표시가 있습니다.`);
  if (view === "answer" && (state.answerCount !== 1 || state.diagrams.some(item => !item.solved))) fail(`${label}: 답 그림 또는 정답 강조가 없습니다.`);
  if (state.pageOverflow || !state.question || state.question.scrollWidth > state.question.clientWidth + 2 || state.question.left < -2 || state.question.right > width + 2) fail(`${label}: 가로 넘침 또는 문항이 화면 밖입니다.`);
  if (state.diagrams.some(item => item.width <= 0 || item.height <= 0 || item.bbox.width <= 0 || item.bbox.height <= 0 || item.left < -2 || item.right > width + 2 || !item.structure || !item.layout || !item.values || !item.shapes)) fail(`${label}: 빈 그림·잘린 그림·자료 속성 누락입니다.`);
  if (state.textOverlaps.length) fail(`${label}: SVG 글자 겹침 ${state.textOverlaps.join(",")}`);
  if (state.rowValueErrors.length) fail(`${label}: 기호의 합과 행 값이 다릅니다 (${state.rowValueErrors.join(",")})`);
  if (state.symbolSizeErrors.length || state.diagrams.some(item => !item.denominations)) fail(`${label}: 큰·중간·작은 기호의 크기 또는 범례가 구분되지 않습니다.`);
  if (state.legendLayoutErrors.length) fail(`${label}: 범례 아이콘과 단위 글자가 겹칩니다 (${state.legendLayoutErrors.join(",")}).`);
  if (state.resultLayoutErrors.length) fail(`${label}: 답 결과 칸이 그림 테두리 밖으로 나갑니다.`);
  if (state.symbolFrameErrors.length) fail(`${label}: 그림 기호가 내부 테두리 밖으로 나갑니다 (${state.symbolFrameErrors.join(",")}).`);
  if (/undefined|null|NaN|Infinity|SyntaxError/.test(state.bodyText)) fail(`${label}: 깨진 값이 노출됩니다.`);
  return state;
};

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  try {
    for (let variant = 3; variant <= 11; variant += 1) for (const difficulty of [-1, 0, 1]) {
      const sourceId = sourceIds[variant - 3];
      const generated = api.generate({ sourceItemId: sourceId, generatorKey: "sourceGrade6GraphsE1", reviewLocked: false, variant }, 0, difficulty, 610000 + variant * 1000 + difficulty + 2, variant);
      let desktopProblem;
      for (const [viewportName, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        for (const view of ["problem", "answer"]) {
          await page.setContent(shell(generated, view), { waitUntil: "domcontentloaded", timeout: 90000 });
          await page.evaluate(() => Promise.race([document.fonts?.ready || Promise.resolve(), new Promise(resolve => setTimeout(resolve, 200))]));
          const state = await inspect(page, sourceId, difficulty, view, viewportName);
          if (view === "problem" && viewportName === "desktop") desktopProblem = state;
          if (view === "answer" && desktopProblem && (state.diagrams[0]?.structure !== desktopProblem.diagrams[0]?.structure || state.diagrams[0]?.layout !== desktopProblem.diagrams[0]?.layout || state.diagrams[0]?.values !== desktopProblem.diagrams[0]?.values || state.diagrams[0]?.denominations !== desktopProblem.diagrams[0]?.denominations || state.diagrams[0]?.shapes !== desktopProblem.diagrams[0]?.shapes)) fail(`${sourceId} / 난이도 ${difficulty}: 문제·답 구조·자료·범례가 다릅니다.`);
          await page.screenshot({ path: path.join(outputDir, `${sourceId}-${difficulty}-${viewportName}-${view}.png`), fullPage: true });
          screenshots += 1;
        }
        await page.close();
      }
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
      for (const view of ["problem", "answer"]) {
        await page.setContent(shell(generated, view), { waitUntil: "domcontentloaded", timeout: 90000 });
        await page.emulateMedia({ media: "print" });
        const state = await inspect(page, sourceId, difficulty, view, "A4");
        if (state.pageOverflow || state.diagrams.some(item => item.bottom > 1123 + 2)) fail(`${sourceId} / 난이도 ${difficulty} / A4 / ${view}: 인쇄 영역 밖입니다.`);
        const pdfPath = path.join(outputDir, `${sourceId}-${difficulty}-${view}.pdf`);
        await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
        if (!fs.existsSync(pdfPath) || fs.statSync(pdfPath).size < 5000) fail(`${sourceId} / 난이도 ${difficulty} / A4 / ${view}: PDF가 비어 있습니다.`);
        pdfs += 1;
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 108 || pdfs !== 54) fail(`산출물 수 ${screenshots}/${pdfs}, PC·모바일·A4 문제/답 108장·54개 PDF여야 합니다.`);
  const summary = `${failures.length ? "실패" : "통과"}: E1 공개 9유형 × 3난이도, PC1440·mobile390·A4 문제/답, 동일 data-values·정답 강조·빈 그림·겹침·넘침 검사; 화면 ${screenshots}장, A4 ${pdfs}개\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  console.log(summary);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
