"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const root = path.resolve(__dirname, "../..");
const css = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
const outputDir = process.env.HSE_SCREENSHOT_DIR
  || path.join(__dirname, "tmp", "source-6-1-graphs-e2-browser-audit");
const sourceIds = [
  "6-1-u5-e2-exploration", "6-1-u5-e2-example-1", "6-1-u5-e2-example-2", "6-1-u5-e2-example-3",
  "6-1-u5-e2-mission-1", "6-1-u5-e2-mission-2", "6-1-u5-e2-mission-3", "6-1-u5-e2-mission-4",
  "6-1-u5-e2-mission-5", "6-1-u5-e2-mission-6"
];
const difficulties = [-1, 0, 1];
const viewports = { desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } };
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPdfPages = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(root, relative || "index.html");
  return file === root || file.startsWith(root + path.sep) ? file : null;
}

function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("not found"); return; }
    const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
    response.writeHead(200, { "Content-Type": `${types[path.extname(file)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}` })));
}

function findPoolZero(sourceItemId, difficulty, variant) {
  for (let seed = 1; seed < 10000; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey: "sourceGrade6GraphsE2", reviewLocked: false, variant }, 0, difficulty, seed, variant);
    if (generated.verifiedPoolIndex === 0) return generated;
  }
  throw new Error(`${sourceItemId}: pool 0 시드를 찾지 못했습니다.`);
}

function pageMarkup(generated, view) {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div></section></main>`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${css}</style><style>
    html,body{margin:0;padding:0;background:#fff;color:#183b56;font-family:Pretendard,"Malgun Gothic",Arial,sans-serif}
    body{padding:24px;box-sizing:border-box}.question-item,.solution-item{max-width:1040px;margin:0 auto;padding:24px;box-sizing:border-box}
    .question-prompt,.solution-answer-visual,.solution-explanation{font-family:Pretendard,"Malgun Gothic",Arial,sans-serif;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}
    .solution-explanation{word-break:break-word}
    @media print{body{padding:12mm}.question-item,.solution-item{max-width:none;padding:4mm}.question-item,.solution-item{break-inside:avoid}}
  </style></head><body>${content}</body></html>`;
}

async function inspectPage(page, generated, sourceId, variant, difficulty, view, viewportName) {
  await page.setContent(pageMarkup(generated, view), { waitUntil: "load" });
  await page.emulateMedia({ media: "screen" });
  await page.waitForTimeout(30);
  const state = await page.evaluate(() => {
    const item = document.querySelector(".question-item,.solution-item");
    const svgs = [...document.querySelectorAll("svg.source61-graphs-e2-diagram,svg.source61-graphs-e2-pictograph")];
    const visible = node => { const s=getComputedStyle(node), b=node.getBoundingClientRect(); return s.display!=="none" && s.visibility!=="hidden" && b.width>0 && b.height>0; };
    const textOverlaps = [];
    svgs.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ node, box: node.getBoundingClientRect() })).filter(x => visible(x.node));
      texts.forEach((left, i) => texts.slice(i + 1).forEach((right, j) => {
        const area = Math.max(0, Math.min(left.box.right,right.box.right)-Math.max(left.box.left,right.box.left)) * Math.max(0, Math.min(left.box.bottom,right.box.bottom)-Math.max(left.box.top,right.box.top));
        if (area > 2) textOverlaps.push(`${svgIndex}:${i}:${i+j+1}`);
      }));
    });
    const values = svgs.map(svg => svg.dataset.source61GraphsE2Values || "");
    const rows = svgs.flatMap(svg => [...svg.querySelectorAll(".source61-e2-strip-row")].map(row => ({ svg, row, values: row.dataset.rowSegments.split(",").map(Number) })));
    const segmentChecks = [];
    rows.forEach(({ row, values }) => {
      const sum = values.reduce((a,b)=>a+b,0); if (Math.abs(sum-100)>1e-8) segmentChecks.push(`strip:${sum}`);
      const blocks=[...row.querySelectorAll(".source61-e2-segment")]; if(blocks.length!==values.length) segmentChecks.push("strip-count");
      blocks.forEach(block => { if(Number(block.getAttribute("width"))<=0 || Number(block.getAttribute("height"))<=0) segmentChecks.push("strip-size"); });
    });
    svgs.forEach(svg => {
      const groups = new Map();
      [...svg.querySelectorAll(".source61-e2-rect-segment")].forEach(block => { const key=block.getAttribute("y"); if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(block); if(Number(block.getAttribute("width"))<=0 || Number(block.getAttribute("height"))<=0) segmentChecks.push("rect-size"); });
      for(const blocks of groups.values()){ const sum=blocks.reduce((a,b)=>a+Number(b.dataset.segmentPercent||0),0); if(Math.abs(sum-100)>1e-8) segmentChecks.push(`rect:${sum}`); }
    });
    const boxes = svgs.map(svg => { const b=svg.getBoundingClientRect(); let bb={width:0,height:0}; try{const x=svg.getBBox();bb={width:x.width,height:x.height};}catch(_){} return {left:b.left,right:b.right,width:b.width,height:b.height,bbox:bb,font:getComputedStyle(svg.querySelector("text")||svg).fontFamily,layout:svg.dataset.source61GraphsE2Layout||"",values:svg.dataset.source61GraphsE2Values||"",highlight:svg.hasAttribute("data-result-highlight")}; });
    const studentTables = [...document.querySelectorAll('svg[data-source61-e2-student-table="visible"] foreignObject')].map(container => {
      const boundary = container.getBoundingClientRect();
      const cells = [...container.querySelectorAll("tbody td")].map(cell => {
        const box = cell.getBoundingClientRect();
        const centerY = box.top + box.height / 2;
        return { text: (cell.textContent || "").trim(), width: box.width, height: box.height, top: box.top, bottom: box.bottom, visible: visible(cell) && centerY >= boundary.top && centerY <= boundary.bottom };
      });
      return { cells };
    });
    const itemBox=item?.getBoundingClientRect();
    const finalAnswers = [...document.querySelectorAll("[data-final-answer]")].map(node => node.getAttribute("data-final-answer") || "");
    const contracts = [...document.querySelectorAll("[data-visibility-contract],[data-source61-e2-visibility-contract]")].map(node => node.getAttribute("data-visibility-contract") || node.getAttribute("data-source61-e2-visibility-contract") || "");
    const answerContracts = [...document.querySelectorAll("[data-answer-contract],[data-source61-e2-answer-contract]")].map(node => node.getAttribute("data-answer-contract") || node.getAttribute("data-source61-e2-answer-contract") || "");
    return { item: itemBox?{left:itemBox.left,right:itemBox.right,scrollWidth:item.scrollWidth,clientWidth:item.clientWidth}:null, svgs:boxes, values, textOverlaps, segmentChecks, studentTables, pageOverflow:document.documentElement.scrollWidth>innerWidth+2, itemText:document.body.innerText||"", finalAnswers, contracts, answerContracts, answerWrappers:document.querySelectorAll(".source61-graphs-e2-answer").length, resultHighlights:document.querySelectorAll("[data-result-highlight]").length, markers:document.querySelectorAll("[data-source61-graphs-e2-kind]").length };
  });
  const label=`${sourceId}/v${variant}/d${difficulty}/${view}/${viewportName}`;
  if (!state.item || state.pageOverflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.left < -2 || state.item.right > viewportWidth(viewportName) + 2) fail(`${label}: 화면 밖 또는 가로 넘침`);
  if (state.svgs.length < 1 || state.svgs.some(svg=>svg.width<=0||svg.height<=0||svg.bbox.width<=0||svg.bbox.height<=0||!svg.layout||!svg.values)) fail(`${label}: 빈 그림 또는 자료 속성 누락`);
  if (state.textOverlaps.length) fail(`${label}: SVG 글자 겹침 ${state.textOverlaps.join(",")}`);
  if (state.segmentChecks.length) fail(`${label}: 구간 검산 실패 ${state.segmentChecks.join(",")}`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}/.test(state.itemText)) fail(`${label}: 깨진 값 노출`);
  if (view === "problem" && (state.resultHighlights || state.answerWrappers)) fail(`${label}: 문제 화면에 답 표시 노출`);
  if (view === "problem" && (state.finalAnswers.length || state.resultHighlights)) fail(`${label}: 문제 화면에 최종 답 또는 강조 노출`);
  if (view === "answer" && (state.answerWrappers !== 1 || state.resultHighlights < 1 || !state.markers || !state.finalAnswers.some(value => value === generated.answer) || !state.contracts.length || !state.answerContracts.length)) fail(`${label}: 답 그림·최종 답·계약 표시 누락`);
  if (variant === 9) {
    const expected = ((generated.prompt.match(/data-source61-graphs-e2-kind="[^"]+" data-source-item="[^"]+" data-values="([^"]+)"/) || [])[1] || "").split(",").slice(0, 4);
    const cells = state.studentTables[0]?.cells || [];
    if (cells.length !== 5 || cells.slice(0, 4).some((cell, index) => !cell.visible || cell.text !== expected[index]) || cells.some(cell => cell.width <= 0 || cell.height <= 0)) fail(`${label}: 학생 수 표 값이 보이는 영역 안에 없음`);
  }
  if (state.svgs.some(svg => !/Pretendard|Malgun Gothic|Arial|Noto Sans KR|sans-serif/i.test(svg.font))) fail(`${label}: 공통 글꼴 누락`);
  return state;
}

function viewportWidth(name) { return viewports[name].width; }

async function capture(page, generated, sourceId, variant, difficulty, view, viewportName) {
  const file=path.join(outputDir, `${variant}-${difficulty}-${view}-${viewportName}.png`);
  await page.screenshot({path:file,fullPage:true});
  if(!fs.existsSync(file)||fs.statSync(file).size<2000) fail(`${sourceId}: ${file} 캡처가 비었습니다.`);
  screenshots+=1;
}

async function capturePdf(page, generated, sourceId, variant, difficulty, view) {
  await page.setViewportSize({width:794,height:1123});
  await page.setContent(pageMarkup(generated, view), {waitUntil:"load"});
  await page.emulateMedia({media:"print"});
  const file=path.join(outputDir, `${variant}-${difficulty}-${view}.pdf`);
  await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
  if(!fs.existsSync(file)||fs.statSync(file).size<5000){fail(`${sourceId}: A4 PDF가 비었습니다.`);return;}
  const info=execFileSync("pdfinfo",[file],{encoding:"utf8"});
  const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]||0);
  pdfs+=1;
  if(pages!==1) fail(`${sourceId}/v${variant}/d${difficulty}/${view}: A4 ${pages}쪽`);
  renderedPdfPages+=pages;
  await page.emulateMedia({media:"screen"});
}

async function main(){
  fs.mkdirSync(outputDir,{recursive:true});
  const {server,baseUrl}=await startServer();
  const browser=await chromium.launch({headless:true});
  try{
    for(let variant=0;variant<sourceIds.length;variant+=1){
      for(const difficulty of difficulties){
        const generated=findPoolZero(sourceIds[variant],difficulty,variant);
        const problemValues=(generated.prompt.match(/data-values="([^"]+)"/)||[])[1]||"";
        const answerValues=(generated.answerVisual.match(/data-values="([^"]+)"/)||[])[1]||"";
        if(problemValues!==answerValues) fail(`${sourceIds[variant]} / d${difficulty}: 문제·답 자료 값 불일치`);
        for(const [viewportName,viewport] of Object.entries(viewports)){
          const page=await browser.newPage({viewport});
          for(const view of ["problem","answer"]){
            await inspectPage(page,generated,sourceIds[variant],variant,difficulty,view,viewportName);
            await capture(page,generated,sourceIds[variant],variant,difficulty,view,viewportName);
          }
          await page.close();
        }
        const page=await browser.newPage({viewport:{width:794,height:1123}});
        for(const view of ["problem","answer"]) await capturePdf(page,generated,sourceIds[variant],variant,difficulty,view);
        await page.close();
      }
    }
  } finally { await browser.close(); server.close(); }
  const summary=`${failures.length?"실패":"통과"}: 10유형 × 3난이도 × (PC·모바일 문제/답) ${screenshots}장, A4 PDF ${pdfs}개·${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir,"audit-result.txt"),summary,"utf8");
  if(failures.length){console.error(`여러 가지 그래프 E2 브라우저 감사 실패: ${failures.length}건`);console.error(failures.slice(0,80).join("\n"));process.exit(1);}
  console.log(`여러 가지 그래프 E2 브라우저 감사 통과: 10유형 × 3난이도 × PC·390px 모바일 문제/답 ${screenshots}장, A4 PDF ${pdfs}개·${renderedPdfPages}쪽`);
}
main().catch(error=>{console.error(error.stack||error);process.exit(1);});
