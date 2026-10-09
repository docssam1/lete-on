"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json");
const exampleReview = require("./source-inventory/6-2-u2-e5-source-review.json");
const reviewedItems = [
  ...review.missions.filter(item => [1, 2, 3, 4, 6].some(number => item.sourceItemId.endsWith(`mission-${number}`))),
  ...exampleReview.items.filter(item => item.candidateVerification.publicReleaseStatus === "verified")
];
const candidateKeys = Object.fromEntries(reviewedItems.map(item => [item.sourceItemId,
  item.downstreamCandidateVerification?.publicReleaseStatus === "verified-as-adaptation"
    ? item.downstreamCandidateVerification.generator : item.candidateVerification.generator]));
const ids = process.env.HSE_AUDIT_IDS?.split(",").filter(Boolean) || Object.keys(candidateKeys);
const baseUrl = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR;
const assets = ["generators.js", "source-inventory-grade6.js", "source-6-2-decimal-e5-unit.css", "app.js"];
const hashes = () => Object.fromEntries(assets.map(file => [file, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, file))).digest("hex")]));
const startHashes = hashes();
const assertOneA4Page = (file, label) => {
  const pages = Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)?.[1]);
  assert.equal(pages, 1, `${label}: 실제 A4 PDF가 한 장이어야 함`);
};

for (const id of ids) {
  assert(candidateKeys[id], `${id}: 검수 후보 생성기 없음`);
  const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
    .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
    .find(item => item.sourceItemId === id);
  assert(!type?.reviewLocked, `${id}: 실제 공개 원장에 열려 있어야 함`);
  assert.equal(type.generatorKey, candidateKeys[id], `${id}: 생성기 연결`);
}
if (outputDir) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  let checked = 0;
  try {
    for (const id of ids) for (const difficulty of [-1, 0, 1]) for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${baseUrl}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      const problem = await page.evaluate(() => ({
        count: document.querySelectorAll("#problemView .question-item").length,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        answerLeak: !!document.querySelector("#problemView .source61-math-board")
      }));
      assert.equal(problem.count, 3, `${id} ${difficulty} ${width}px: 실제 문제 3개`);
      assert(!problem.overflow && !problem.answerLeak, `${id} ${difficulty} ${width}px: 문제 넘침·답 누출 없음`);
      const capture = difficulty === 0 || exampleReview.items.some(item => item.sourceItemId === id);
      const suffix = difficulty === 0 ? "" : difficulty < 0 ? "-easy" : "-hard";
      if (outputDir && capture && width !== 320) {
        await page.screenshot({ path: path.join(outputDir, `${id}-${width}${suffix}-problem.png`), fullPage: true });
      }
      if (outputDir && capture && width === 1280) {
        await page.emulateMedia({ media: "print" });
        const file = path.join(outputDir, `${id}${suffix}-problem-a4.pdf`);
        await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
        assertOneA4Page(file, `${id}: 문제`);
        await page.emulateMedia({ media: "screen" });
      }
      await page.locator("#solutionTab").click();
      const solution = await page.evaluate(expectedId => ({
        count: document.querySelectorAll("#solutionView .solution-item").length,
        pages: document.querySelectorAll("#solutionView .print-page").length,
        boards: document.querySelectorAll(`#solutionView [data-answer-source="${expectedId}"]`).length,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        rowOverflow: [...document.querySelectorAll("#solutionView .source61-math-row")].some(row => row.scrollWidth > row.clientWidth + 1),
        expressionOverflow: [...document.querySelectorAll("#solutionView .math-inline-expression")].some(expression => {
          const r = expression.getBoundingClientRect(), parent = expression.closest("p").getBoundingClientRect();
          return r.left < parent.left - 1 || r.right > parent.right + 1;
        }),
        tableStyle: [...document.querySelectorAll("#solutionView .source62-e5-unit-answer .source61-math-row > *")].every(cell => {
          const style = getComputedStyle(cell);
          return style.color === "rgb(17, 17, 17)" && Number(style.fontWeight) === 400;
        })
      }), id);
      assert.equal(solution.count, 3, `${id} ${difficulty} ${width}px: 실제 풀이 3개`);
      assert.equal(solution.pages, 1, `${id} ${difficulty} ${width}px: 세 풀이를 한 쪽에 배치`);
      assert.equal(solution.boards, 3, `${id} ${difficulty} ${width}px: 문항·답 그림 1:1`);
      assert(!solution.overflow && !solution.rowOverflow && !solution.expressionOverflow && solution.tableStyle, `${id} ${difficulty} ${width}px: 풀이 표시 ${JSON.stringify(solution)}`);
      assert.deepEqual(errors, [], `${id} ${difficulty} ${width}px: 브라우저 오류`);
      if (outputDir && capture && width !== 320) {
        await page.screenshot({ path: path.join(outputDir, `${id}-${width}${suffix}-solution.png`), fullPage: true });
      }
      if (outputDir && capture && width === 1280) {
        await page.emulateMedia({ media: "print" });
        const file = path.join(outputDir, `${id}${suffix}-solution-a4.pdf`);
        await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
        assertOneA4Page(file, `${id}: 풀이`);
      }
      checked += 1;
      await page.close();
    }
  } finally {
    await browser.close();
  }
  const endHashes = hashes();
  assert.deepEqual(endHashes, startHashes, "검사 중 구현 파일이 바뀌지 않음");
  if (outputDir) fs.writeFileSync(path.join(outputDir, "verified-render-proof.json"), JSON.stringify({ checked, ids, startHashes, endHashes }, null, 2));
  console.log(`6-2 E5 공개 유형의 실제 문제은행 화면 ${checked}개: PC·390px·320px 문제·풀이 통과`);
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
