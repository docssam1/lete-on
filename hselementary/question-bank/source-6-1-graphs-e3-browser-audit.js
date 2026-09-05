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
  || path.join(__dirname, "tmp", "source-6-1-graphs-e3-browser-audit");
const sourceIds = [
  "6-1-u5-e3-exploration", "6-1-u5-e3-example-1", "6-1-u5-e3-example-2", "6-1-u5-e3-example-3",
  "6-1-u5-e3-mission-1", "6-1-u5-e3-mission-2", "6-1-u5-e3-mission-3", "6-1-u5-e3-mission-4",
  "6-1-u5-e3-mission-5", "6-1-u5-e3-mission-6"
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

function findPool(sourceItemId, difficulty, variant, poolIndex) {
  for (let seed = 1; seed < 10000; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey: "sourceGrade6GraphsE3", reviewLocked: false, variant }, 0, difficulty, seed, variant);
    if (generated.verifiedPoolIndex === poolIndex) return generated;
  }
  throw new Error(`${sourceItemId}: pool ${poolIndex} 시드를 찾지 못했습니다.`);
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
    const svgs = [...document.querySelectorAll("svg.source61-graphs-e3-diagram")];
    const visible = node => { const s=getComputedStyle(node), b=node.getBoundingClientRect(); return s.display!=="none" && s.visibility!=="hidden" && b.width>0 && b.height>0; };
    const textOverlaps = [];
    svgs.forEach((svg, svgIndex) => {
      const texts = [...svg.querySelectorAll("text")].map(node => ({ node, box: node.getBoundingClientRect() })).filter(x => visible(x.node));
      texts.forEach((left, i) => texts.slice(i + 1).forEach((right, j) => {
        const area = Math.max(0, Math.min(left.box.right,right.box.right)-Math.max(left.box.left,right.box.left)) * Math.max(0, Math.min(left.box.bottom,right.box.bottom)-Math.max(left.box.top,right.box.top));
        if (area > 2) textOverlaps.push(`${svgIndex}:${i}:${i+j+1}`);
      }));
    });
    const values = svgs.map(svg => svg.dataset.source61GraphsE3Values || "");
    const textClips = [];
    svgs.forEach((svg, svgIndex) => {
      const svgBox = svg.getBoundingClientRect();
      [...svg.querySelectorAll("text")].filter(visible).forEach((node, textIndex) => {
        const box = node.getBoundingClientRect();
        if (box.left < svgBox.left - 1 || box.right > svgBox.right + 1 || box.top < svgBox.top - 1 || box.bottom > svgBox.bottom + 1) {
          textClips.push(`${svgIndex}:${textIndex}:${(node.textContent || "").trim()}`);
        }
      });
    });
    const segmentChecks = [];
    svgs.forEach(svg => {
      if (svg.dataset.phase !== "answer") return;
      [...svg.querySelectorAll(".source61-e3-chart")].forEach(chart => {
        const sectors=[...chart.querySelectorAll(":scope > .source61-e3-sector")];
        const sum=sectors.reduce((total,sector)=>total+Number(sector.dataset.segmentAngle||0),0);
        if(Math.abs(sum-360)>1e-8) segmentChecks.push(`circle:${sum}`);
        sectors.forEach(sector => {
          const arc=sector.querySelector(".source61-e3-angle-arc");
          if(arc && (arc.dataset.angleOwner!==sector.dataset.segmentLabel || Math.abs(Number(arc.dataset.angleValue)-Number(sector.dataset.segmentAngle))>1e-8)) segmentChecks.push(`angle-owner:${sector.dataset.segmentLabel}`);
        });
      });
    });
    const boxes = svgs.map(svg => { const b=svg.getBoundingClientRect(); let bb={width:0,height:0}; try{const x=svg.getBBox();bb={width:x.width,height:x.height};}catch(_){} return {left:b.left,right:b.right,width:b.width,height:b.height,bbox:bb,font:getComputedStyle(svg.querySelector("text")||svg).fontFamily,layout:svg.dataset.source61GraphsE3Layout||"",values:svg.dataset.source61GraphsE3Values||"",highlight:svg.hasAttribute("data-result-highlight")}; });
    const itemBox=item?.getBoundingClientRect();
    const finalAnswers = [...document.querySelectorAll("[data-final-answer]")].map(node => node.getAttribute("data-final-answer") || "");
    const contracts = [...document.querySelectorAll("[data-visibility-contract],[data-source61-e3-visibility-contract]")].map(node => node.getAttribute("data-visibility-contract") || node.getAttribute("data-source61-e3-visibility-contract") || "");
    const answerContracts = [...document.querySelectorAll("[data-answer-contract],[data-source61-e3-answer-contract]")].map(node => node.getAttribute("data-answer-contract") || node.getAttribute("data-source61-e3-answer-contract") || "");
    const angleLabels=[...document.querySelectorAll(".source61-e3-angle-label")].map(node=>({text:(node.textContent||"").trim(),box:node.getBoundingClientRect(),owner:node.previousElementSibling?.dataset.angleOwner||""}));
    const emptyCircles=[...document.querySelectorAll(".source61-e3-empty-circle-outline")].map(node=>{const b=node.getBoundingClientRect();return{width:b.width,height:b.height,stroke:parseFloat(getComputedStyle(node).strokeWidth)||0,ticks:node.parentElement?.querySelectorAll("[data-empty-circle-tick]").length||0};});
    return { item: itemBox?{left:itemBox.left,right:itemBox.right,scrollWidth:item.scrollWidth,clientWidth:item.clientWidth}:null, svgs:boxes, values, textOverlaps, textClips, segmentChecks, angleLabels, emptyCircles, pageOverflow:document.documentElement.scrollWidth>innerWidth+2, itemText:document.body.innerText||"", finalAnswers, contracts, answerContracts, answerWrappers:document.querySelectorAll(".source61-graphs-e3-answer").length, resultHighlights:document.querySelectorAll("[data-result-highlight]").length, markers:document.querySelectorAll("[data-source61-graphs-e3-kind]").length };
  });
  const label=`${sourceId}/v${variant}/d${difficulty}/${view}/${viewportName}`;
  if (!state.item || state.pageOverflow || state.item.scrollWidth > state.item.clientWidth + 2 || state.item.left < -2 || state.item.right > viewportWidth(viewportName) + 2) fail(`${label}: 화면 밖 또는 가로 넘침`);
  if (state.svgs.length < 1 || state.svgs.some(svg=>svg.width<=0||svg.height<=0||svg.bbox.width<=0||svg.bbox.height<=0||!svg.layout||(view === "answer" && !svg.values))) fail(`${label}: 빈 그림 또는 자료 속성 누락`);
  if (state.textOverlaps.length) fail(`${label}: SVG 글자 겹침 ${state.textOverlaps.join(",")}`);
  if (state.textClips.length) fail(`${label}: SVG 글자 잘림 ${state.textClips.join(",")}`);
  if (state.segmentChecks.length) fail(`${label}: 구간 검산 실패 ${state.segmentChecks.join(",")}`);
  if (/undefined|null|NaN|Infinity|\$\{[^}]+\}/.test(state.itemText)) fail(`${label}: 깨진 값 노출`);
  if (view === "problem" && (state.resultHighlights || state.answerWrappers)) fail(`${label}: 문제 화면에 답 표시 노출`);
  if (view === "problem" && (state.finalAnswers.length || state.resultHighlights || state.values.some(Boolean))) fail(`${label}: 문제 화면에 최종 답·검산 값 또는 강조 노출`);
  if (view === "answer" && (state.answerWrappers !== 1 || state.resultHighlights < 1 || !state.markers || !state.finalAnswers.some(value => value === generated.answer) || !state.contracts.length || !state.answerContracts.length)) fail(`${label}: 답 그림·최종 답·계약 표시 누락`);
  if (state.angleLabels.some(label => !label.owner || !label.text || label.box.width <= 0 || label.box.height <= 0)) fail(`${label}: 각도 숫자와 대상 부채꼴 연결 누락`);
  const expectsEmptyCircle = variant === 0 && view === "problem";
  if (expectsEmptyCircle && (state.emptyCircles.length !== 1 || state.emptyCircles.some(circle => circle.width < 60 || circle.height < 60 || Math.abs(circle.width - circle.height) > 2 || circle.stroke < 1 || circle.ticks !== 4))) fail(`${label}: 빈 원그래프의 원 테두리 또는 네 눈금 누락`);
  if (!expectsEmptyCircle && state.emptyCircles.length) fail(`${label}: 빈 원그래프가 잘못 표시됨`);
  if (state.svgs.some(svg => !/Pretendard|Malgun Gothic|Arial|Noto Sans KR|sans-serif/i.test(svg.font))) fail(`${label}: 공통 글꼴 누락`);
  return state;
}

function viewportWidth(name) { return viewports[name].width; }

async function capture(page, generated, sourceId, variant, difficulty, poolIndex, view, viewportName) {
  const file=path.join(outputDir, `${variant}-${difficulty}-p${poolIndex}-${view}-${viewportName}.png`);
  await page.screenshot({path:file,fullPage:true});
  if(!fs.existsSync(file)||fs.statSync(file).size<2000) fail(`${sourceId}: ${file} 캡처가 비었습니다.`);
  screenshots+=1;
}

async function capturePdf(page, generated, sourceId, variant, difficulty, poolIndex, view) {
  await page.setViewportSize({width:794,height:1123});
  await page.setContent(pageMarkup(generated, view), {waitUntil:"load"});
  await page.emulateMedia({media:"print"});
  const file=path.join(outputDir, `${variant}-${difficulty}-p${poolIndex}-${view}.pdf`);
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
        for(let poolIndex=0;poolIndex<3;poolIndex+=1){
          const generated=findPool(sourceIds[variant],difficulty,variant,poolIndex);
          const problemValues=(generated.prompt.match(/data-values="([^"]+)"/)||[])[1]||"";
          const answerValues=(generated.answerVisual.match(/data-values="([^"]+)"/)||[])[1]||"";
          if(problemValues) fail(`${sourceIds[variant]} / d${difficulty} / p${poolIndex}: 문제 화면에 숨은 답 자료 노출`);
          if(!answerValues) fail(`${sourceIds[variant]} / d${difficulty} / p${poolIndex}: 답 화면의 검산 자료 누락`);
          for(const [viewportName,viewport] of Object.entries(viewports)){
            const page=await browser.newPage({viewport});
            for(const view of ["problem","answer"]){
              await inspectPage(page,generated,sourceIds[variant],variant,difficulty,view,viewportName);
              await capture(page,generated,sourceIds[variant],variant,difficulty,poolIndex,view,viewportName);
            }
            await page.close();
          }
          const page=await browser.newPage({viewport:{width:794,height:1123}});
          for(const view of ["problem","answer"]) await capturePdf(page,generated,sourceIds[variant],variant,difficulty,poolIndex,view);
          await page.close();
        }
      }
    }
  } finally { await browser.close(); server.close(); }
  const summary=`${failures.length?"실패":"통과"}: 10유형 × 3난이도 × 3고정 문항 × (PC·모바일 문제/답) ${screenshots}장, A4 PDF ${pdfs}개·${renderedPdfPages}쪽\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir,"audit-result.txt"),summary,"utf8");
  if(failures.length){console.error(`여러 가지 그래프 E3 브라우저 감사 실패: ${failures.length}건`);console.error(failures.slice(0,80).join("\n"));process.exit(1);}
  console.log(`여러 가지 그래프 E3 브라우저 감사 통과: 10유형 × 3난이도 × 3고정 문항 × PC·390px 모바일 문제/답 ${screenshots}장, A4 PDF ${pdfs}개·${renderedPdfPages}쪽`);
}
main().catch(error=>{console.error(error.stack||error);process.exit(1);});
