"use strict";
// 2026-11-24: 6-2 1단원(분수의 나눗셈) 원문 유형의 "학생 화면"을 problem-hint-policy.js를 켠 채로 검사한다.
// 유형별 browser 감사(source-6-2-fraction-division-e*-browser-audit.js)는 생성기 계약을 보려고 정책을 끄므로,
// 이 감사가 같은 시드로 만든 정책 전후 문항을 짝지어, 정책이 지운 조건 정리 상자의 수·기호가 문제 문장·그림에 모두 남아 있는지(정보 손실 없음)와
// 문항 수·답 노출·가로 넘침·잘림·콘솔 오류를 PC 1440px 세 난이도(정책 전후 비교)와 모바일 390px 보통 난이도에서 확인한다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");

const repoRoot = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR;
assert(outputDir && path.isAbsolute(outputDir), "HSE_SCREENSHOT_DIR must be an absolute folder.");
fs.mkdirSync(outputDir, { recursive: true });
const failures = [];
const fail = message => failures.push(message);
const BOARD_CLASS = "^source6[12]-[\\w-]*board$";
// 사람이 검토해 "원문에 없는 풀이 단서"로 지운 상자(problem-hint-policy.js BOARD_DROP). 문제 문장에서 계산해 내야 하는 값을
// 미리 보여 주므로 상자의 수가 문제에 그대로 없는 것이 정상이다(사용자 결정 2026-11-23 "원문에 없는 힌트 같은 거는 빼").
const REVIEWED_HINT_BOARDS = {
  "6-2-u1-e2-example-4": "10시간·15시간에서 계산하는 1시간당 비율(1/10, 1/15)을 미리 보여 줌",
  "6-2-u1-e2-mission-4": "'2월 한 달'의 날 수 28일과 곱셈 풀이 틀을 미리 보여 줌",
  "6-2-u1-e3-mission-6": "'1보다 큰 한 자리 수'를 '2부터 9까지'로 바꿔 주고 풀이 순서를 알려 줌",
  "6-2-u1-e5-example-1": "문제에 없는 '하루 24시간'을 알려 줌"
};
const TOKEN = "\\d+(?:\\.\\d+)?|[㉠-㉯]|[■▲●◆★♥△□○]|[ㄱ-ㅎ]{2,}|[A-Z]";

function startServer(disablePolicy) {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://local");
    if (disablePolicy && /\/problem-hint-policy\.js$/.test(url.pathname)) {
      response.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" });
      response.end("/* disabled: reference render */");
      return;
    }
    let file = path.resolve(repoRoot, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(repoRoot)) { response.writeHead(403); response.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    const type = ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".mjs": "application/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve({ server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` }));
  });
}

async function snapshot(browser, baseUrl, typeId, difficulty, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && !/cdn\.jsdelivr|Failed to load resource/.test(message.text())) errors.push(message.text()); });
  await page.route("https://cdn.jsdelivr.net/**", route => route.abort());
  await page.goto(`${baseUrl}index.html?type=${encodeURIComponent(typeId)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#problemView .question-item").first().waitFor({ state: "visible", timeout: 60000 });
  const read = () => page.evaluate(({ boardSource, tokenSource }) => {
    const boardClass = new RegExp(boardSource);
    const tokens = text => (String(text || "").match(new RegExp(tokenSource, "g")) || []);
    const textOf = node => [node.innerText || "", ...[...node.querySelectorAll("svg text")].map(text => text.textContent || "")].join(" ");
    const isBoard = node => [...node.classList].some(name => boardClass.test(name));
    const view = document.querySelector("#problemView:not([hidden])") ? "problem" : "answer";
    const items = [...document.querySelectorAll(view === "problem" ? "#problemView .question-item" : "#solutionView .solution-item")].map(item => {
      const rect = item.getBoundingClientRect();
      const insideBoard = node => { for (let up = node.parentElement; up && up !== item; up = up.parentElement) if (isBoard(up)) return true; return false; };
      const boards = [...item.querySelectorAll("*")].filter(isBoard).filter(board => !insideBoard(board));
      return {
        text: textOf(item),
        tokens: tokens(textOf(item)),
        boards: boards.map(board => ({ cls: [...board.classList].find(name => boardClass.test(name)), tokens: tokens(textOf(board)) })),
        overflow: item.scrollWidth > item.clientWidth + 2 || rect.left < -2 || rect.right > innerWidth + 2,
        leak: view === "problem" ? item.querySelectorAll("[data-answer-source],.is-solved,[class*='-solution']").length + (/답\s*[:：]/.test(item.innerText) ? 1 : 0) : 0
      };
    });
    return { view, items, pageOverflow: document.documentElement.scrollWidth > innerWidth + 1, broken: /undefined|NaN|Infinity|\$\{/.test(document.querySelector("#worksheet")?.innerText || "") };
  }, { boardSource: BOARD_CLASS, tokenSource: TOKEN });
  const problem = await read();
  await page.locator("#solutionTab").click();
  await page.locator("#solutionView").waitFor({ state: "visible", timeout: 30000 });
  const answer = await read();
  return { page, errors, problem, answer };
}

(async () => {
  const live = await startServer(false);
  const reference = await startServer(true);
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  let checked = 0, removedBoards = 0, screenshots = 0, pairs = 0, reviewedHints = 0;
  try {
    const listPage = await browser.newPage();
    await listPage.route("https://cdn.jsdelivr.net/**", route => route.abort());
    await listPage.goto(`${live.baseUrl}index.html`, { waitUntil: "load", timeout: 90000 });
    await listPage.waitForFunction(() => window.HSE_CURRICULUM && window.HSE_GENERATORS);
    const typeIds = await listPage.evaluate(() => window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(su => su.types)))
      .filter(type => /^6-2-u1-e\d-/.test(type.id) && (type.generator || type.generatorKey) && !type.reviewLocked).map(type => type.id));
    await listPage.close();
    assert(typeIds.length >= 40, `6-2 1단원 원문 유형이 ${typeIds.length}개뿐입니다.`);
    // 1) 같은 시드로 정책 적용 전후 문항을 짝지어 비교한다: 정책을 끈 페이지에서 원래 문항을 만든 뒤
    //    problem-hint-policy.js를 불러 생성기를 감싸고 같은 인자로 다시 만든다.
    const pairPage = await browser.newPage();
    await pairPage.route("https://cdn.jsdelivr.net/**", route => route.abort());
    await pairPage.goto(`${reference.baseUrl}index.html`, { waitUntil: "load", timeout: 90000 });
    await pairPage.waitForFunction(() => window.HSE_CURRICULUM && window.HSE_GENERATORS);
    const args = [];
    for (const typeId of typeIds) for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) args.push([typeId, difficulty, 1000 + variant * 104729, variant]);
    const raw = await pairPage.evaluate(list => {
      const all = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(su => su.types)));
      return list.map(([id, d, seed, v]) => { const q = window.HSE_GENERATORS.generate(all.find(t => t.id === id), 0, d, seed, v); return q ? q.prompt : null; });
    }, args);
    await pairPage.addScriptTag({ url: `${live.baseUrl}problem-hint-policy.js` });
    const compared = await pairPage.evaluate(({ list, rawPrompts, boardSource, tokenSource }) => {
      const all = window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(su => su.types)));
      const boardClass = new RegExp(boardSource);
      const tokens = text => (String(text || "").match(new RegExp(tokenSource, "g")) || []);
      const parse = html => { const box = document.createElement("div"); box.innerHTML = html; return box; };
      // 분수 표기처럼 숫자 칸이 붙어 있는 곳도 따로 세도록 글자 조각마다 띄어서 모은다.
      const textOf = node => { const parts = []; const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT); while (walker.nextNode()) parts.push(walker.currentNode.nodeValue); return parts.join(" "); };
      const boardsOf = root => [...root.querySelectorAll("*")].filter(node => [...node.classList].some(name => boardClass.test(name)))
        .filter(node => { for (let up = node.parentElement; up && up !== root; up = up.parentElement) if ([...up.classList].some(name => boardClass.test(name))) return false; return true; })
        .map(node => ({ cls: [...node.classList].find(name => boardClass.test(name)), tokens: tokens(textOf(node)) }));
      return list.map(([id, d, seed, v], index) => {
        const q = window.HSE_GENERATORS.generate(all.find(t => t.id === id), 0, d, seed, v);
        const before = parse(rawPrompts[index] || ""), after = parse(q ? q.prompt : "");
        const afterBoards = boardsOf(after).map(board => board.cls);
        const available = new Set(tokens(textOf(after)));
        const removed = boardsOf(before).filter(board => { const at = afterBoards.indexOf(board.cls); if (at >= 0) { afterBoards.splice(at, 1); return false; } return true; });
        return { id, d, v, policy: Boolean(q && q.problemHintPolicy), removed: removed.length, lost: [...new Set(removed.flatMap(board => board.tokens.filter(token => token !== "□" && !available.has(token)).map(token => `${board.cls}:${token}`)))], // □는 식 틀의 빈칸 표시(정보 아님)
          question: /[?？]|세요|까요|니까|시오/.test(textOf(after)) };
      });
    }, { list: args, rawPrompts: raw, boardSource: BOARD_CLASS, tokenSource: TOKEN });
    await pairPage.close();
    for (const row of compared) {
      removedBoards += row.removed;
      if (row.lost.length && REVIEWED_HINT_BOARDS[row.id]) reviewedHints += 1;
      else if (row.lost.length) fail(`${row.id}/d${row.d}/v${row.v}: 정책이 지운 상자의 ${row.lost.join(", ")}가 문제에 남아 있지 않습니다.`);
      if (!row.question) fail(`${row.id}/d${row.d}/v${row.v}: 정책 적용 뒤 물음 문장이 없습니다.`);
    }
    // 2) 정책을 켠 실제 화면: PC 세 난이도와 모바일 보통 난이도.
    const plan = [];
    for (const typeId of typeIds) {
      for (const difficulty of [-1, 0, 1]) plan.push([typeId, difficulty, "pc", { width: 1440, height: 1000 }]);
      plan.push([typeId, 0, "mobile", { width: 390, height: 844 }]);
    }
    for (const [typeId, difficulty, name, viewport] of plan) {
      const label = `${typeId}/d${difficulty}/${name}`;
      const on = await snapshot(browser, live.baseUrl, typeId, difficulty, viewport);
      checked += 1;
      if (on.errors.length) fail(`${label}: 브라우저 오류 ${on.errors[0]}`);
      if (on.problem.items.length < 1 || on.problem.items.length !== on.answer.items.length) fail(`${label}: 문제 ${on.problem.items.length}문항, 답 ${on.answer.items.length}문항`);
      if (on.problem.pageOverflow || on.answer.pageOverflow || on.problem.items.some(item => item.overflow)) fail(`${label}: 가로 넘침 또는 화면 밖 배치`);
      if (on.problem.broken || on.answer.broken) fail(`${label}: 깨진 값`);
      if (on.problem.items.some(item => item.leak)) fail(`${label}: 문제 화면에 답이나 풀이가 보입니다.`);
      if (on.problem.items.some(item => !/[?？]|세요|까요|니까|시오/.test(item.text))) fail(`${label}: 물음 문장이 없는 문항이 있습니다.`);
      if (difficulty === 0 && name === "pc") {
        await on.page.locator("#problemTab").click();
        await on.page.screenshot({ path: path.join(outputDir, `${typeId}-d0-pc-problem.png`), fullPage: true });
        screenshots += 1;
      }
      await on.page.close();
    }
    pairs = compared.length;
  } finally {
    await browser.close();
    live.server.close();
    reference.server.close();
  }
  fs.writeFileSync(path.join(outputDir, "fraction-division-policy-result.json"), JSON.stringify({ checked, pairs, removedBoards, reviewedHints, reviewedHintBoards: REVIEWED_HINT_BOARDS, screenshots, failures }, null, 2));
  if (failures.length) {
    console.error(failures.slice(0, 40).join("\n"));
    throw new Error(`6-2 1단원 학생 화면(힌트 정책 적용) 감사 실패 ${failures.length}건`);
  }
  console.log(`6-2 1단원 학생 화면(힌트 정책 적용) 감사 통과: 같은 시드 정책 전후 ${pairs}쌍(유형×3난이도×3변형)에서 지운 조건 상자 ${removedBoards}개의 수·기호가 문제에 남음(검토한 풀이 단서 상자 ${reviewedHints}쌍 제외), 정책 적용 화면 ${checked}개(PC 세 난이도·모바일 보통), 답 노출·넘침·오류 없음, 화면 ${screenshots}장`);
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
