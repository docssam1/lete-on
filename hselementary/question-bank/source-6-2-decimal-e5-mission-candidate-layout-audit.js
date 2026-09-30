"use strict";

const assert = require("node:assert/strict");
const { mkdirSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const missionNumber = Number(process.env.HSE_E5_MISSION_NUMBER || 1);
assert([1, 2, 3, 4].includes(missionNumber), "배치 검사할 Mission 번호가 올바르지 않음");
const sourceItemId = `6-2-u2-e5-mission-${missionNumber}`;
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json").missions.find(item => item.sourceItemId === sourceItemId);
const downstreamMode = missionNumber === 3 && process.env.HSE_E5_MISSION3_MODE === "downstream";
const candidateReview = downstreamMode ? review.downstreamCandidateVerification : review.candidateVerification;
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
const publicCandidate = review.downstreamCandidateVerification?.publicReleaseStatus === "verified-as-adaptation"
  ? review.downstreamCandidateVerification : review.candidateVerification;
assert.equal(type.reviewLocked, !["verified", "verified-as-adaptation"].includes(publicCandidate.publicReleaseStatus), "검수 상태와 공개 상태 일치");
assert.equal(type.generatorKey, type.reviewLocked ? "" : publicCandidate.generator);
assert(candidateReview, "검수할 후보 생성기가 기록되어 있음");
if (downstreamMode) assert.equal(candidateReview.publicReleaseStatus, "verified-as-adaptation", "하류 보정 후보는 공개 유사문항");
const candidate = candidateReview === publicCandidate ? type
  : { ...type, reviewLocked: false, generatorKey: candidateReview.generator };
const baseUrl = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR;
if (outputDir) mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const width of [1280, 390, 320]) for (const difficulty of [-1, 0, 1]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      const items = [0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant));
      const questions = items.map((item, index) => `<article><b>${index + 1}</b><p>${item.prompt}</p><div class="answer-line">답</div></article>`).join("");
      const answers = items.map((item, index) => `<article><b>${index + 1}. ${item.answer}</b><p>${item.solution}</p>${item.answerVisual}</article>`).join("");
      await page.evaluate(({ questions, answers }) => {
        document.body.innerHTML = `<main id="candidateSheet"><section id="problemView"><h1>문제</h1>${questions}</section><section id="solutionView"><h1>정답·풀이</h1>${answers}</section></main>`;
      }, { questions, answers });
      await page.addStyleTag({ content: `
        *{box-sizing:border-box}html,body{width:100%;margin:0;padding:0;letter-spacing:0}
        body{background:#fff;color:#1e2930;font:16px/1.65 Pretendard,"Malgun Gothic",sans-serif}
        #candidateSheet{width:min(760px,100%);margin:0 auto;padding:16px}
        #candidateSheet h1{font-size:18px;margin:0 0 14px}
        #candidateSheet article{max-width:100%;padding:12px 0 16px;margin:0 0 16px;border-bottom:1px solid #b9c8d1;break-inside:avoid;page-break-inside:avoid}
        #candidateSheet article p{margin:8px 0 12px;overflow-wrap:anywhere}
        #candidateSheet .answer-line{margin-top:18px;border-bottom:1px solid #b9c8d1;font-size:12px;color:#5b7080}
        #candidateSheet .source61-math-board{width:min(430px,100%);margin:10px 0 0}
        @media print{
          body{font-size:13px;line-height:1.38}
          #candidateSheet{width:100%;padding:0}
          #candidateSheet article{padding:5px 0 7px;margin-bottom:7px}
          #candidateSheet article p{margin:4px 0 6px}
          #candidateSheet .source61-math-board{margin-top:4px}
          #candidateSheet .source61-math-board>strong{padding:4px 7px}
          #candidateSheet .source61-math-row{padding:4px 7px;gap:5px}
          #candidateSheet .source61-math-row>b{font-size:13px;line-height:1.35}
          #solutionView{break-before:page;page-break-before:always}
        }
      ` });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(missionNumber => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        questions: document.querySelectorAll("#problemView article").length,
        answers: document.querySelectorAll("#solutionView article").length,
        boards: [...document.querySelectorAll(".source61-math-board")].filter(board => board.dataset.answerSource === `6-2-u2-e5-mission-${missionNumber}`).map(board => ({
          box: board.getBoundingClientRect().toJSON(),
          article: board.closest("article").getBoundingClientRect().toJSON(),
          rows: [...board.querySelectorAll(".source61-math-row")].map(row => ({ width: row.clientWidth, scroll: row.scrollWidth }))
        }))
      }), missionNumber);
      assert(!layout.overflow && layout.questions === 3 && layout.answers === 3, `${width}px: 문제·풀이 세 쌍과 화면 너비`);
      assert.equal(layout.boards.length, 3);
      for (const board of layout.boards) {
        assert(board.box.left >= board.article.left - 1 && board.box.right <= board.article.right + 1, `${width}px: 풀이 표가 문항 안에 있음`);
        assert(board.rows.every(row => row.scroll <= row.width + 1), `${width}px: 풀이 표의 글씨가 잘리지 않음`);
      }
      checked += 6;
      if (outputDir && width === 390 && difficulty >= 0) await page.screenshot({ path: path.join(outputDir, `mission-${missionNumber}-${difficulty === 1 ? "hard" : "source"}-390.png`), fullPage: true });
      if (outputDir && width === 1280 && difficulty >= 0) await page.pdf({ path: path.join(outputDir, `mission-${missionNumber}-${difficulty === 1 ? "hard" : "source"}-a4.pdf`), format: "A4", printBackground: true });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`6-2 개념탐구 5 Mission ${missionNumber}${downstreamMode ? " 하류 보정" : ""} 후보: PC·390px·320px 문제·풀이 ${checked}개 배치 검사 통과`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
