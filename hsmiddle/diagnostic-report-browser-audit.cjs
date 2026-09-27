const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");

const base = process.argv[2] || "http://127.0.0.1:8894/hsmiddle";
const output = path.resolve(process.argv[3] || path.join(os.tmpdir(), "hsmiddle-report-audit"));
const playwrightPaths = [
  process.env.PLAYWRIGHT_PATH,
  "playwright"
].filter(Boolean);
const playwrightPath = playwrightPaths.find(candidate => {
  try { require.resolve(candidate); return true; } catch (_) { return false; }
});
if (!playwrightPath) throw new Error("Playwright runtime not found. Set PLAYWRIGHT_PATH.");
const { chromium } = require(playwrightPath);

fs.mkdirSync(output, { recursive: true });
const assert = (value, message) => { if (!value) throw new Error(message); };
const url = target => base + "/" + target;
const seed = () => {
  localStorage.setItem("hs-student", "DEMO");
  localStorage.setItem("hsm-session-token-v2", "a".repeat(64));
  localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "DEMO", access: ["diagnostic"], admin: false, expiresAt: new Date(Date.now() + 3600000).toISOString() }));
  localStorage.setItem("hsm-mark-mode", "ox");
  for (let i = 1; i <= 40; i++) localStorage.setItem("hsm-ox-" + i, i % 5 === 0 ? "x" : "o");
};
const adminSeed = () => {
  localStorage.setItem("hs-student", "docssam");
  localStorage.setItem("hsm-session-token-v2", "b".repeat(64));
  localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "docssam", access: ["diagnostic", "mock-1", "mock-2", "mock-3", "final"], admin: true, expiresAt: new Date(Date.now() + 3600000).toISOString() }));
  localStorage.setItem("hsm-mark-mode", "ox");
  for (let i = 1; i <= 40; i++) localStorage.setItem("hsm-ox-" + i, i % 5 === 0 ? "x" : "o");
  window.__printCalls = 0;
  window.print = () => { window.__printCalls += 1; };
};
const linkedPrintSeed = token => ({
  initializer: ({ token }) => {
    localStorage.setItem("hs-student", "DEMO");
    localStorage.setItem("hsm-session-token-v2", "a".repeat(64));
    localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "DEMO", access: ["diagnostic"], admin: false, expiresAt: new Date(Date.now() + 3600000).toISOString() }));
    localStorage.setItem("hsm-mark-mode", "ox");
    for (let i = 1; i <= 40; i++) localStorage.setItem("hsm-ox-" + i, i % 5 === 0 ? "x" : "o");
    localStorage.setItem("hsm-linked-print-v1:" + token, JSON.stringify({
      student: "DEMO",
      numbers: [1, 2],
      issuedAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000,
      access: "diagnostic"
    }));
  },
  arg: { token }
});

function loadSourcePageIndex() {
  const context = {};
  context.window = context;
  vm.createContext(context);
  for (const source of [
    "question-bank/data/schema.js",
    "question-bank/data/source-page-index.js"
  ]) vm.runInContext(fs.readFileSync(path.join(__dirname, source), "utf8"), context, { filename: source });
  return context.HSMIDDLE_SOURCE_PAGE_INDEX.pages;
}

const linkedPageCount = (numbers, mode) => {
  const roles = mode === "problem" ? ["problem"]
    : mode === "answer" ? ["quick-answer", "answer-solution"]
      : mode === "solution" ? ["quick-answer", "solution", "answer-solution"]
        : ["problem", "quick-answer", "solution", "answer-solution"];
  return loadSourcePageIndex().filter(entry => numbers.includes(entry.diagnosticNumber) && roles.includes(entry.role)).length;
};

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--disable-gpu"] });
  async function withPage(target, size, callback, initializer = seed) {
    const [width, height] = size.split(",").map(Number);
    const context = await browser.newContext({ viewport: { width, height: Math.min(height, 1200) }, deviceScaleFactor: 1 });
    if (typeof initializer === "function") await context.addInitScript(initializer);
    else await context.addInitScript(initializer.initializer, initializer.arg);
    const page = await context.newPage();
    await page.route("**/functions/v1/hsmiddle-records", async route => {
      const request = route.request();
      const body = JSON.parse(request.postData() || "{}");
      const admin = request.headers()["x-hsm-session"] === "b".repeat(64);
      const access = admin ? ["diagnostic", "mock-1", "mock-2", "mock-3", "final", "question-bank"] : ["diagnostic"];
      if (body.action === "session") {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, name: admin ? "docssam" : "DEMO", access, admin, expiresAt: new Date(Date.now() + 3600000).toISOString(), startedAt: "2026-09-01T00:00:00.000Z" }) });
        return;
      }
      if (body.action === "listAttempts") {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ attempts: [] }) });
        return;
      }
      await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "unexpected_action" }) });
    });
    await page.goto(url(target), { waitUntil: "networkidle" });
    if (target.startsWith("report.html")) {
      await page.waitForFunction(() => Boolean(document.querySelector("#whoName")?.textContent.trim()));
      await page.waitForFunction(() => Boolean(document.querySelector(".errtable")));
    }
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(250);
    try { return await callback(page); } finally { await context.close(); }
  }
  const dom = (target, size) => withPage(target, size, page => page.content());
  const shot = (target, size, name) => withPage(target, size, async page => {
    const file = path.join(output, name);
    await page.screenshot({ path: file, fullPage: true });
    assert(fs.existsSync(file) && fs.statSync(file).size > 10000, "missing screenshot " + name);
  });
  const elementShot = (target, size, selector, name) => withPage(target, size, async page => {
    const file = path.join(output, name);
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: file });
    assert(fs.existsSync(file) && fs.statSync(file).size > 3000, "missing element screenshot " + name);
  });

  try {
    await withPage("diagnostic.html", "1440,900", async page => {
      assert(await page.locator(".item").count() === 40, "O/X input must render 40 items");
      assert(await page.locator(".list.ox-grid").count() === 1, "O/X quick grid missing");
      assert((await page.locator("#autosave").innerText()).includes("40/40문항"), "automatic score snapshot status missing");
    });
    await shot("diagnostic.html", "1440,900", "diagnostic-ox-desktop.png");
    await withPage("diagnostic.html", "390,844", async page => {
      const columns = await page.locator(".list.ox-grid").evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
      assert(columns === 4, "mobile O/X input must keep four questions per row");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile diagnostic has horizontal overflow");
    });
    await shot("diagnostic.html", "390,844", "diagnostic-ox-mobile.png");
    await elementShot("diagnostic.html", "390,844", ".list.ox-grid", "diagnostic-ox-grid-mobile.png");
    await withPage("diagnostic.html", "1440,900", async page => {
      await page.evaluate(() => {
        for (let i = 1; i <= 40; i++) { localStorage.removeItem("hsm-ox-" + i); localStorage.removeItem("hsm-answer-" + i); }
        setMark("answer");
      });
      await page.locator('[data-q="1"]').fill("2527869999999999");
      const answerScore = await page.locator("#score").innerText();
      await page.evaluate(() => setMark("ox"));
      assert(await page.locator("#score").innerText() === answerScore && answerScore === "2.5", "answer score was lost after switching to O/X mode");
    });
    await withPage("diagnostic.html", "1440,900", async page => {
      const dialogs = [];
      page.on("dialog", async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
      await page.evaluate(() => { window.HSMIDDLE_CLOUD = null; });
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      await page.evaluate(() => setOX(1, "x"));
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      await page.evaluate(() => setOX(1, "o"));
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("hsm-history-diagnostic-DEMO") || "[]"));
      assert(saved.length === 2, "a non-consecutive duplicate diagnostic result must not be saved twice");
      assert(dialogs.some(message => message.includes("이미 저장")), "duplicate score save warning missing");
    });

    await withPage("report.html", "1440,900", async page => {
      assert(await page.locator(".chart").count() === 4, "report must render four charts");
      assert(await page.locator(".diagnostic-cell").count() === 40, "report must render 40 O/X cells");
      assert(await page.locator(".plan-step").count() === 3, "report must render a three-step learning plan");
      const body = await page.locator("body").innerText();
      assert(body.includes("꼭 맞아야 할 문항") && body.includes("정답률 60% 이상"), "must-correct section or criterion missing");
      assert(body.includes("5번, 10번, 20번을 틀렸습니다"), "must-correct wrong-number analysis missing");
      assert(body.includes("선택 번호 인쇄") && body.includes("오답 전체 인쇄"), "wrong-answer print controls missing");
      assert(body.includes("연계 유사문제") && body.includes("선택 유사문제 인쇄"), "diagnostic account must see linked similar-print controls");
      assert(!body.includes("별도 학습 상품"), "diagnostic report must not expose the separate question-bank catalog");
    });
    await shot("report.html", "1440,900", "report-desktop.png");
    await withPage("report.html", "390,844", async page => {
      const columns = await page.locator(".diagnostic-grid").evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
      assert(columns === 4, "mobile report O/X grid must keep four questions per row");
      assert(await page.locator(".errtable tbody tr").first().evaluate(node => getComputedStyle(node).display) === "grid", "mobile wrong-answer rows must use card layout");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile report has horizontal overflow");
    });
    await shot("report.html", "390,844", "report-mobile.png");
    await elementShot("report.html", "390,844", ".diagnostic-grid", "report-ox-grid-mobile.png");
    await elementShot("report.html", "390,844", ".essential-note", "report-essential-mobile.png");
    await elementShot("report.html", "390,844", ".plan", "report-plan-mobile.png");
    await elementShot("report.html", "390,844", ".errtable tbody tr", "report-wrong-card-mobile.png");

    await withPage("report.html", "1440,900", async page => {
      const labels = await page.locator(".print-group button").allTextContents();
      assert(labels.includes("선택 유사문제 인쇄") && labels.includes("오답 유사문제 전체 인쇄"), "similar-problem print controls missing for entitled account");
      const opened = await page.evaluate(() => {
        const opened = [];
        window.open = target => { opened.push(String(target)); };
        toggleWrongPicks(false);
        for (const input of document.querySelectorAll("[data-wrong-pick]")) input.checked = input.value === "5" || input.value === "10";
        setWrongPrintMode("answer");
        setLinkedPrintMode("solution");
        printSelectedSimilar();
        printAllSimilar();
        return opened.map(target => {
          const token = new URL(target, location.href).searchParams.get("ticket");
          return { target, ticket: JSON.parse(localStorage.getItem("hsm-linked-print-v1:" + token) || "null") };
        });
      });
      assert(opened[0].target.includes("viewer.html?doc=linked-similar") && opened[0].target.includes("mode=solution"), "selected linked-print URL is incorrect");
      assert(JSON.stringify(opened[0].ticket.numbers) === JSON.stringify([5, 10]), "selected linked-print ticket is incorrect");
      assert(JSON.stringify(opened[1].ticket.numbers) === JSON.stringify([5, 10, 15, 20, 25, 30, 35, 40]), "all-wrong linked-print ticket is incorrect");
      const file = path.join(output, "report-similar-print-controls.png");
      await page.locator(".print-tools").screenshot({ path: file });
      assert(fs.statSync(file).size > 3000, "similar-problem print controls screenshot missing");
    }, adminSeed);

    const problemTarget = "viewer.html?doc=diagnostic-review&qs=1,2,3,4,5,6,7,8&mode=problem&student=DEMO";
    await withPage(problemTarget, "1100,900", async page => {
      assert(await page.locator(".print-sheet").count() === 2, "eight selected questions must render as two A4 sheets");
      assert(await page.locator(".review-card").count() === 8, "selected-number print must render eight review cards");
      assert(await page.locator(".answer-sheet").count() === 0, "problem-only print leaked answer sheet");
      const canvases = await page.locator("canvas").evaluateAll(nodes => nodes.map(node => [node.width, node.height]));
      assert(canvases.length === 8 && canvases.every(([width, height]) => width > 0 && height > 0), "question crops did not render");
    });
    await shot(problemTarget, "1100,900", "wrong-print-problem-only.png");
    await withPage(problemTarget, "1100,900", async page => {
      await page.emulateMedia({ media: "print" });
      const pdfPath = path.join(output, "wrong-print-problem-only-a4.pdf");
      await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
      const count = (fs.readFileSync(pdfPath).toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
      assert(count === 2, "eight selected diagnostic questions must print on exactly two A4 pages");
    });

    const answerTarget = "viewer.html?doc=diagnostic-review&qs=1,2,3,4,5,6,7,8&mode=answer&student=DEMO";
    await withPage(answerTarget, "1100,900", async page => {
      assert(await page.locator(".answer-sheet").count() === 1, "problem+answer print must append an answer sheet");
      assert((await page.locator(".answer-sheet").innerText()).includes("2527869999999999"), "official answer missing from answer sheet");
    });
    await shot(answerTarget, "1100,900", "wrong-print-problem-answer.png");
    await withPage(answerTarget, "1100,900", async page => {
      await page.emulateMedia({ media: "print" });
      await page.pdf({ path: path.join(output, "wrong-print-problem-answer.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    });

    for (const linkedMode of ["problem", "answer", "solution", "combined"]) {
      const expectedPages = linkedPageCount([1, 2], linkedMode);
      const token = "linked-" + linkedMode;
      const target = `viewer.html?doc=linked-similar&ticket=${token}&mode=${linkedMode}`;
      await withPage(target, "1440,900", async page => {
      assert(await page.locator(".linked-page").count() === expectedPages, `${linkedMode} linked-print page count is wrong`);
        assert(await page.locator(".linked-page img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), `${linkedMode} linked print has a broken source image`);
        assert(await page.locator(".linked-page .mark").count() === expectedPages, `${linkedMode} linked print watermark is missing`);
        assert(await page.evaluate(key => localStorage.getItem("hsm-linked-print-v1:" + key) === null, token), "linked print ticket must be one-use");
      }, linkedPrintSeed(token));
    }
    await withPage("viewer.html?doc=linked-similar&qs=1,2&mode=combined", "1440,900", async page => {
      assert(await page.locator(".linked-page").count() === 0, "URL numbers must not open linked source pages without a ticket");
      assert((await page.locator(".denied").innerText()).includes("승인 세션"), "missing-ticket message must explain the approved-session requirement");
    });
    await withPage("viewer.html?doc=linked-similar&ticket=linked-mobile&mode=combined", "390,844", async page => {
      assert(await page.locator(".linked-page").count() === linkedPageCount([1, 2], "combined"), "mobile linked print lost source pages");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile linked print has horizontal overflow");
      const file = path.join(output, "linked-print-mobile.png");
      await page.screenshot({ path: file, fullPage: true });
    }, linkedPrintSeed("linked-mobile"));

    const library = await dom("library.html", "1440,900");
    assert(/중등 심화 문제은행[\s\S]{0,2000}잠김/.test(library), "question bank must be a separately locked product for DEMO");
    await withPage("question-bank/", "1440,900", async page => {
      assert(await page.locator("#accessGate").isVisible(), "direct question-bank access must be locked for a diagnostic-only account");
      assert(!(await page.locator("#app").isVisible()), "question-bank app leaked to a diagnostic-only account");
    });

    const combinedTarget = "question-bank/?qs=5,10&mode=answer&autoprint=1";
    await withPage(combinedTarget, "1440,900", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      assert(await page.locator(".combined-part.problem-part").count() === 1, "combined print problem part missing");
      assert(await page.locator(".combined-part.answer-part").count() === 1, "combined print answer part missing");
      assert(await page.locator(".problem-part .set-section").count() === 2, "selected similar-problem types missing from problem part");
      assert(await page.locator(".answer-part .set-section").count() === 2, "selected similar-problem types missing from answer part");
      assert(await page.locator(".answer-part .page").count() === 2, "combined print must append quick-answer pages only");
      const answerSources = await page.locator(".answer-part img").evaluateAll(images => images.map(image => image.getAttribute("src")));
      assert(answerSources.every(source => /\/page-4\.png$/.test(source)), "solution pages leaked into problem+answer print");
      assert(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0)), "combined print contains a broken image");
    }, adminSeed);
    await withPage(combinedTarget, "390,844", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile combined print has horizontal overflow");
      const file = path.join(output, "similar-print-combined-mobile.png");
      await page.screenshot({ path: file, fullPage: true });
    }, adminSeed);
    await withPage(combinedTarget, "1100,900", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      await page.emulateMedia({ media: "print" });
      await page.pdf({ path: path.join(output, "similar-print-combined.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    }, adminSeed);

    await withPage("question-bank/?qs=5,99&mode=problem", "1440,900", async page => {
      const notice = await page.locator("#linkedNotice").innerText();
      assert(notice.includes("99번") && notice.includes("제외"), "unavailable similar-problem number must be disclosed");
    }, adminSeed);
    console.log(JSON.stringify({ ok: true, output, files: fs.readdirSync(output).filter(name => !name.startsWith(".")).sort() }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
