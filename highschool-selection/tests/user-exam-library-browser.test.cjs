"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const staticRoot = path.resolve(__dirname, "..");

function executablePath() {
  const candidates = [
    process.env.HIGHSELECT_BROWSER_EXECUTABLE,
    process.platform === "win32" ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" : "",
    process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "",
    process.platform === "win32" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : "",
    chromium && chromium.executablePath ? chromium.executablePath() : ""
  ].filter(Boolean);
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "my-exams.html";
    const resolved = path.resolve(staticRoot, relative);
    if (resolved !== staticRoot && !resolved.startsWith(`${staticRoot}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      response.writeHead(404).end();
      return;
    }
    const mime = ({ ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" })[path.extname(resolved)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": mime, "Cache-Control": "no-store" });
    fs.createReadStream(resolved).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` })));
}

function recipe(examId, parentExamId, overrides) {
  const options = overrides || {};
  return {
    examId,
    ownerId: "student_browser",
    state: options.state || "temporary",
    createdAt: "2026-09-03T00:00:00.000Z",
    updatedAt: "2026-09-03T00:00:00.000Z",
    expiresAt: options.state === "saved" ? null : "2026-09-10T00:00:00.000Z",
    generationMode: "academy_prep",
    selectionSnapshot: {
      generationMode: "academy_prep",
      academyId: "WM",
      semesterId: "M2-1",
      conditions: {
        scopeKeys: ["G8/M01"],
        difficultyWeights: { lowered: 20, standard: 50, raised: 30 },
        responseWeights: { objective: 40, subjective: 60 },
        questionCount: 20,
        maxPerFamily: 1
      }
    },
    seed: 101,
    parentExamId: parentExamId || null,
    items: Array.from({ length: 20 }, (_, index) => ({ itemId: `item-${index + 1}`, itemVersionId: `item-${index + 1}-v1`, order: index + 1, score: 1 })),
    layout: { paperSize: "A4", columns: 2, itemsPerPage: 4, fontScale: 1 }
  };
}

async function installApi(page, base, requests) {
  let items = [recipe("exam-parent", null), recipe("exam-child-1", "exam-parent", { state: "saved" })];
  await page.route(`${base}/user-exam-library/**`, async route => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    requests.push({ method: request.method(), pathname, body: request.postDataJSON ? request.postDataJSON() : null });
    const json = body => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
    if (request.method() === "GET" && pathname.endsWith("/print-manifest")) {
      const examId = pathname.split("/").at(-2);
      return json({
        examId,
        generationMode: "learning",
        academyId: null,
        semesterId: "M2-1",
        questionCount: 4,
        pageCount: 1,
        assetPolicy: "signed-item-images",
        expiresAt: "2026-09-03T00:10:00.000Z",
        layout: { paperSize: "A4", columns: 2, itemsPerPage: 4, fontScale: 1 },
        items: Array.from({ length: 4 }, (_, index) => ({
          number: index + 1,
          score: 1,
          inputType: index % 2 ? "input" : "single_choice",
          mimeType: "image/png",
          url: `${base}/user-exam-assets/${examId}/item-${String(index + 1).padStart(3, "0")}.png?sig=test`
        }))
      });
    }
    if (request.method() === "GET" && pathname.endsWith("/access")) return json({ ownerId: "student_browser", plan: { planId: "basic", maxSavedExamCount: 3, maxRecentExamCount: 5, temporaryRetentionDays: 7 }, entitlements: [], updatedAt: "2026-09-03T00:00:00.000Z" });
    if (request.method() === "GET" && pathname.endsWith("/options")) return json({ targets: [{ generationMode: "academy_prep", academyId: "WM", semesterId: "M2-1", scopeKeys: ["G8/M01", "G8/M02"] }], count: 1 });
    if (request.method() === "GET" && pathname.endsWith("/exams")) return json({ items, count: items.length });
    if (request.method() === "POST" && pathname.endsWith("/generate")) {
      items = [recipe("exam-generated", null), ...items];
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(items[0]) });
    }
    if (request.method() === "POST" && pathname.endsWith("/similar")) {
      items = [recipe("exam-child-2", "exam-parent"), ...items];
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(items[0]) });
    }
    if (request.method() === "POST" && pathname.endsWith("/save")) return json(items[0]);
    if (request.method() === "DELETE") { items = items.filter(item => !pathname.endsWith(`/${item.examId}`)); return json({ removed: true }); }
    return route.fulfill({ status: 404, contentType: "application/json", body: "{}" });
  });
  await page.route(`${base}/user-exam-assets/**`, async route => {
    const number = Number((new URL(route.request().url()).pathname.match(/item-(\d{3})/) || [])[1] || 1);
    const formulas = [
      "2x + 5 = 17",
      "a:b = 3:5일 때, a=9이면 b는?",
      "x + 35° = 90°일 때, x의 값은?",
      "y = 2x - 1에서 x=3일 때, y는?"
    ];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><rect width="900" height="560" fill="white"/><text x="40" y="62" font-family="Malgun Gothic, sans-serif" font-size="22" font-weight="700" fill="#7b2f1e">배치 확인용 예시 문제</text><text x="40" y="112" font-family="Malgun Gothic, sans-serif" font-size="28" fill="#111">다음 문제를 풀고 답을 쓰시오.</text><text x="70" y="220" font-family="Malgun Gothic, Georgia, serif" font-size="46" fill="#25154f">${formulas[number - 1]}</text><path d="M90 300H810M90 380H650" stroke="#777" stroke-width="3"/><circle cx="700" cy="380" r="70" fill="none" stroke="#111" stroke-width="4"/><text x="40" y="520" font-family="Malgun Gothic, sans-serif" font-size="22" fill="#555">한 개의 답을 쓰세요.</text></svg>`;
    return route.fulfill({ status: 200, contentType: "image/svg+xml", body: svg });
  });
}

async function seedStudent(page) {
  await page.addInitScript(() => {
    localStorage.setItem("highselect-session-v1", JSON.stringify({
      name: "학생테스트", studentId: "student_browser", role: "student", access: [], issuedAt: new Date().toISOString()
    }));
  });
}

test("personal exam builder works on desktop and phone without exposing protected fields", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());

  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await seedStudent(page);
    await installApi(page, fixture.base, requests);
    await page.goto(`${fixture.base}/my-exams.html`);
    await page.locator("#my-exam-workspace").waitFor({ state: "visible" });
    assert.match(await page.locator("#plan-card").textContent(), /기본 이용권/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.locator("#my-exam-list .my-exam-card").count(), 2);

    await page.locator('[data-exam-id="exam-parent"] [data-action="load"]').click();
    assert.equal(await page.locator("#question-count").inputValue(), "20");
    assert.match(await page.locator("#my-exam-alert").textContent(), /구성을 불러왔습니다/);

    await page.locator('[data-exam-id="exam-parent"] [data-action="similar"]').click();
    await page.waitForFunction(() => document.querySelectorAll("#my-exam-list .my-exam-card").length === 3);
    const similar = requests.find(item => item.method === "POST" && item.pathname.endsWith("/similar"));
    assert.equal(similar.body.derivationIndex, 2);

    await page.locator("#question-count").fill("18");
    await page.locator("#generate-exam").click();
    await page.waitForFunction(() => document.querySelectorAll("#my-exam-list .my-exam-card").length === 4);
    const generated = requests.find(item => item.method === "POST" && item.pathname.endsWith("/generate"));
    assert.equal(generated.body.questionCount, 18);
    assert.deepEqual(generated.body.layout, { paperSize: "A4", columns: 2, itemsPerPage: 4, fontScale: 1 });
    assert.equal(errors.length, 0);
    assert.equal(await page.evaluate(() => document.body.innerText.includes("answerKey") || document.body.innerText.includes("sourcePath")), false);
    if (process.env.HIGHSELECT_SCREENSHOT_DIR) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      fs.mkdirSync(process.env.HIGHSELECT_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({
        path: path.join(process.env.HIGHSELECT_SCREENSHOT_DIR, `highselect-my-exams-${viewport.width}.png`),
        fullPage: true
      });
    }
    await page.locator('[data-exam-id="exam-parent"] .my-exam-open').click();
    await page.waitForFunction(() => document.body.dataset.printReady === "true");
    assert.equal(await page.locator(".exam-sheet").count(), 1);
    assert.equal(await page.locator(".exam-question").count(), 4);
    const boxes = await page.locator(".exam-question").evaluateAll(nodes => nodes.map(node => {
      const box = node.getBoundingClientRect();
      return { number: Number(node.dataset.questionNumber), x: Math.round(box.x), y: Math.round(box.y) };
    }));
    assert.equal(boxes[0].x, boxes[1].x);
    assert.ok(boxes[1].y > boxes[0].y);
    assert.ok(boxes[2].x > boxes[0].x);
    assert.equal(boxes[2].y, boxes[0].y);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    assert.equal(await page.locator("#print-exam").isEnabled(), true);
    if (process.env.HIGHSELECT_USER_EXAM_PDF && viewport.width === 1440) {
      fs.mkdirSync(path.dirname(process.env.HIGHSELECT_USER_EXAM_PDF), { recursive: true });
      await page.pdf({ path: process.env.HIGHSELECT_USER_EXAM_PDF, format: "A4", printBackground: true, preferCSSPageSize: true });
    }
    if (process.env.HIGHSELECT_SCREENSHOT_DIR) {
      await page.screenshot({ path: path.join(process.env.HIGHSELECT_SCREENSHOT_DIR, `highselect-exam-print-${viewport.width}.png`), fullPage: true });
    }
    await context.close();
  }
});

test("admin assigns question-bank plans and exact academy semesters", async t => {
  const browserBinary = executablePath();
  assert.ok(browserBinary, "Chromium is required; run npm run install:browser in highschool-selection");
  const fixture = await startStaticServer();
  t.after(() => fixture.server.close());
  const browser = await chromium.launch({ headless: true, executablePath: browserBinary });
  t.after(() => browser.close());
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [], errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && !/^Failed to load resource:/.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    localStorage.setItem("highselect-session-v1", JSON.stringify({
      name: "관리자", studentId: "admin_browser", role: "admin", access: [], issuedAt: new Date().toISOString()
    }));
  });
  await page.route("**/admin/access-grants", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify([{ id: "student_browser", studentName: "학생테스트", examIds: ["SH-R01"], expiresAt: null }])
  }));
  await page.route("**/admin/user-exam-library/**", async route => {
    const request = route.request(), pathname = new URL(request.url()).pathname;
    if (request.method() === "GET" && pathname.endsWith("/options")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        plans: [
          { planId: "basic", maxSavedExamCount: 3, maxRecentExamCount: 5, temporaryRetentionDays: 7 },
          { planId: "plus", maxSavedExamCount: 10, maxRecentExamCount: 20, temporaryRetentionDays: 14 }
        ],
        targets: ["SH", "DP", "WM", "ED", "DG", "SM"].map(academyId => ({ generationMode: "academy_prep", academyId, semesterId: "CM1", scopeKeys: ["G10/M01"] })),
        planCount: 2, targetCount: 6
      }) });
    }
    if (request.method() === "GET") return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: "아직 설정 없음" }) });
    if (request.method() === "PUT") {
      requests.push(request.postDataJSON());
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ownerId: "student_browser" }) });
    }
    return route.fulfill({ status: 405, contentType: "application/json", body: "{}" });
  });
  await page.goto(`${fixture.base}/admin/index.html`);
  await page.locator('[data-library="student_browser"]').click();
  await page.locator("#bank-access-panel").waitFor({ state: "visible" });
  await page.locator(".bank-target-group").first().waitFor();
  assert.equal(await page.locator(".bank-target-group").count(), 6);
  await page.locator("#bank-plan").selectOption("plus");
  await page.locator("#bank-all-learning").check();
  await page.locator('[data-academy-semester="WM"]').check();
  await page.locator('#bank-access-form button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector("#bank-access-status")?.textContent.includes("저장했습니다"));
  assert.deepEqual(requests[0], {
    planId: "plus",
    entitlements: [
      { kind: "all_learning" },
      { kind: "academy_semester", academyId: "WM", semesterId: "CM1" }
    ]
  });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.deepEqual(errors, []);
  if (process.env.HIGHSELECT_SCREENSHOT_DIR) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(100);
    fs.mkdirSync(process.env.HIGHSELECT_SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: path.join(process.env.HIGHSELECT_SCREENSHOT_DIR, "highselect-admin-bank-390.png"), fullPage: true });
  }
});
