const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
let server;
let browser;
let baseUrl;

test.before(async function () {
  server = http.createServer(function (request, response) {
    const requestPath = new URL(request.url, "http://127.0.0.1").pathname;
    if (requestPath === "/api/grade6-local") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      response.end(JSON.stringify({ ok: false, message: "Static public test host" }));
      return;
    }
    const relative = requestPath === "/boarding-school-math/" ? "/boarding-school-math/index.html" : requestPath;
    const target = path.resolve(repoRoot, `.${relative}`);
    if (!target.startsWith(repoRoot) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, { "content-type": `${mime[path.extname(target)] || "application/octet-stream"}; charset=utf-8` });
    fs.createReadStream(target).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/`;
  browser = await chromium.launch({ headless: true });
});

test.after(async function () {
  await browser.close();
  await new Promise(function (resolve) { server.close(resolve); });
});

function collectErrors(page) {
  const errors = [];
  page.on("console", function (message) { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", function (error) { errors.push(error.message); });
  return errors;
}

test("production home exposes a truthful goal-to-official-source path", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match(await page.locator("h1").innerText(), /진단에서\s*AMC 12까지,\s*한 학생의 수학 경로/);
  assert.match(await page.locator(".proof-strip").innerText(), /K–12/);
  assert.match(await page.locator("#amc-pathway").innerText(), /AMC 8[\s\S]*AMC 10[\s\S]*AMC 12/);
  assert.equal(await page.locator(".sample-pill").textContent(), "예시 화면");
  assert.equal(await page.locator(".role-shortcut").count(), 2);
  assert.equal(await page.locator('.role-shortcut[data-role-target="student"]').count(), 1);
  assert.equal(await page.locator('.role-shortcut[data-role-target="teacher"]').count(), 1);
  assert.ok(await page.locator('a[href="./catalog.html"]').count() >= 1);
  assert.equal(await page.locator(".start-path-card").count(), 4);
  assert.equal(await page.locator("[data-goal]").count(), 5);
  assert.equal(await page.locator("#goal-title").textContent(), "SASMO · Grade 6 준비");
  assert.match(await page.locator("#goal-format").textContent(), /90분 · 25문항/);
  assert.equal(await page.locator("#goal-primary").getAttribute("href"), "./sasmo.html");
  assert.equal(await page.locator('.contest-path a[href="./sasmo.html"]').count(), 1);
  assert.ok(await page.locator('a[href="./concept-learning.html"]').count() >= 1);

  const original = page.locator("#goal-original");
  assert.equal(await original.getAttribute("href"), "https://form.simcc.org/2019-sasmo-year-paper/");
  assert.equal(await original.getAttribute("target"), "_blank");
  assert.match(await original.getAttribute("rel"), /noopener/);
  assert.match(await original.getAttribute("rel"), /noreferrer/);
  assert.equal(await original.getAttribute("data-original-record-id"), "sasmo-2019-member-portal-g2-12");
  assert.match(await original.textContent(), /Grade 6 공식 원본 접근/);

  await page.locator("#goal-grade-select").selectOption("1");
  assert.equal(await page.locator("#goal-title").textContent(), "SASMO · Grade 1 준비");
  assert.equal(await original.getAttribute("href"), "https://sasmo.simcc.org/courses/sasmo-past-papers-year-2025/");
  assert.equal(await original.getAttribute("data-original-record-id"), "sasmo-2025-official-lms-g1-11");

  await page.locator("#goal-grade-select").selectOption("K2");
  assert.equal(await original.isHidden(), true);
  assert.match(await page.locator("#goal-status-note").textContent(), /잠금 상태/);

  await page.locator('[data-goal="kangaroo"]').click();
  assert.equal(await page.locator('[data-goal="kangaroo"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("#goal-format").textContent(), /75분/);
  assert.equal(await original.isHidden(), true);

  await page.locator('[data-goal="amc"]').click();
  await page.locator("#goal-grade-select").selectOption("9");
  assert.equal(await page.locator("#goal-title").textContent(), "AMC 10 · Grade 9 권장 경로");
  assert.match(await page.locator("#goal-format").textContent(), /75분 · 25문항/);
  await page.locator("#goal-grade-select").selectOption("11");
  assert.equal(await page.locator("#goal-title").textContent(), "AMC 12 · Grade 11 권장 경로");
  assert.match(await page.locator("#goal-eligibility").textContent(), /G12 이하/);
  assert.equal(await page.locator("#goal-primary").getAttribute("href"), "#map");
  assert.equal(await page.locator("#goal-primary").textContent(), "고등 과정 설계 상태 보기");

  await page.locator('[data-goal="school"]').click();
  await page.locator("#goal-grade-select").selectOption("6");
  assert.equal(await page.locator("#goal-primary").getAttribute("href"), "./diagnostic.html");
  await page.locator("#goal-grade-select").selectOption("5");
  assert.equal(await page.locator("#goal-primary").getAttribute("href"), "./catalog.html?role=student&grade=5");

  await page.locator('[data-goal="singapore"]').click();
  await page.locator("#goal-grade-select").selectOption("6");
  assert.equal(await page.locator("#goal-primary").getAttribute("href"), "./concept-learning.html");

  await page.locator('[data-goal="sasmo"]').click();
  assert.equal(await page.locator('[data-goal="sasmo"]').getAttribute("aria-selected"), "true");

  await page.locator('[data-goal="kangaroo"]').focus();
  await page.keyboard.press("ArrowDown");
  assert.equal(await page.locator('[data-goal="sasmo"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator('[data-goal="sasmo"]').getAttribute("tabindex"), "0");

  await page.locator('[data-role-preview="teacher"]').click();
  assert.equal(await page.locator("#role-preview").getAttribute("aria-labelledby"), "role-tab-teacher");
  assert.match(await page.locator("#role-title").textContent(), /수업 그룹/);
  await page.locator('.role-shortcut[data-role-target="student"]').click();
  assert.equal(await page.locator('[data-role-preview="student"]').getAttribute("aria-selected"), "true");
  assert.equal((await page.locator("body").innerText()).includes("학부모"), false);

  await page.locator('[data-grade-tab="8"]').click();
  assert.equal(await page.locator("#selected-grade").textContent(), "G8");
  assert.equal(await page.locator("#skill-map-panel").getAttribute("aria-labelledby"), "grade-tab-8");
  assert.equal(await page.locator("#skill-rows .skill-row").count(), 5);

  const missingHashTargets = await page.locator('a[href^="#"]').evaluateAll(function (anchors) {
    return anchors.map(function (anchor) { return anchor.getAttribute("href"); }).filter(function (href) {
      return !href || href === "#" || !document.querySelector(href);
    });
  });
  assert.deepEqual(missingHashTargets, []);
  assert.deepEqual(errors, []);
  await page.close();
});

test("dedicated SASMO page exposes a K2-G12 student/teacher program and safe source inventory", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}sasmo.html`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match(await page.locator("h1").innerText(), /GFIELD SASMO\s*준비 프로그램/);
  assert.equal(await page.locator("[data-level]").count(), 13);
  assert.equal(await page.locator("[data-goal]").count(), 4);
  assert.equal(await page.locator("#domain-grid .domain-card").count(), 6);
  assert.equal(await page.locator("[data-role]").count(), 2);
  assert.equal(await page.locator("#k12-record-count").textContent(), "88");
  assert.equal(await page.locator("#k12-asset-count").textContent(), "144");
  assert.equal(await page.locator("#edugain-topic-count").textContent(), "158");
  assert.equal(await page.locator("#archive-coverage-list .coverage-row").count(), 11);
  assert.equal(await page.locator("#hero-format").textContent(), "공식 형식 · 15문항 · 60분");
  assert.match(await page.locator(".official-format-grid").innerText(), /K2[\s\S]*15문항 · 60분[\s\S]*G1–G12[\s\S]*25문항 · 90분/);
  assert.equal(await page.evaluate(function () {
    return window.GFIELDSASMOProgramArchitecture.validateArchitecture().valid
      && window.GFIELDSASMOProgramArchitecture.validatePublicSafety().valid
      && window.GFIELDSASMOSourceInventory.validatePublicInventory().valid;
  }), true);

  await page.locator('[data-level="K2"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-level="G1"]').getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#hero-format").textContent(), "공식 형식 · 25문항 · 90분");
  assert.equal(await page.locator("#official-sasmo-link").getAttribute("href"), "https://sasmo.simcc.org/courses/sasmo-past-papers-year-2025/");
  await page.locator('[data-goal="amc-bridge"]').click();
  assert.match(await page.locator("#goal-title").textContent(), /AMC 연결/);
  await page.locator('[data-role="student"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-role="teacher"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("#role-title").textContent(), /수업 그룹/);
  assert.equal((await page.locator("body").innerText()).includes("학부모"), false);
  assert.equal(await page.locator('a[href$=".pdf"], a[href*="files.k12mathcontests.com"]').count(), 0);
  const duplicateIds = await page.locator("[id]").evaluateAll(function (elements) {
    const counts = elements.reduce(function (result, element) {
      result[element.id] = (result[element.id] || 0) + 1;
      return result;
    }, {});
    return Object.keys(counts).filter(function (id) { return counts[id] > 1; });
  });
  assert.deepEqual(duplicateIds, []);
  const missingHashTargets = await page.locator('a[href^="#"]').evaluateAll(function (anchors) {
    return anchors.map(function (anchor) { return anchor.getAttribute("href"); }).filter(function (href) {
      return !href || href === "#" || !document.querySelector(href);
    });
  });
  assert.deepEqual(missingHashTargets, []);
  const unsafeExternalLinks = await page.locator('a[target="_blank"]').evaluateAll(function (anchors) {
    return anchors.filter(function (anchor) {
      const rel = new Set((anchor.getAttribute("rel") || "").split(/\s+/));
      return !rel.has("noopener") || !rel.has("noreferrer");
    }).map(function (anchor) { return anchor.getAttribute("href"); });
  });
  assert.deepEqual(unsafeExternalLinks, []);
  assert.deepEqual(errors, []);
  await page.close();
});

test("dedicated SASMO page stays usable at mobile and tablet widths", async function () {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600 });
    const errors = collectErrors(page);
    await page.goto(`${baseUrl}sasmo.html`, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(function () {
      return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    });
    assert.equal(dimensions.scroll, dimensions.client, `SASMO overflow at ${width}px`);
    const allLevelsVisible = await page.locator("#level-selector").evaluate(function (selector) {
      const selectorRect = selector.getBoundingClientRect();
      return Array.from(selector.querySelectorAll("button")).every(function (button) {
        const rect = button.getBoundingClientRect();
        return rect.left >= selectorRect.left && rect.right <= selectorRect.right
          && rect.top >= selectorRect.top && rect.bottom <= selectorRect.bottom;
      });
    });
    assert.equal(allLevelsVisible, true, `not all K2-G12 controls visible at ${width}px`);
    assert.equal(await page.locator('[data-level="G12"]').isVisible(), true);
    const targetSizes = await page.locator("[data-level], [data-goal], [data-role], .primary-link, .outline-link, .archive-coverage summary, .brand, .site-footer a").evaluateAll(function (controls) {
      return controls.map(function (control) {
        const rect = control.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    targetSizes.forEach(function (size) {
      assert.ok(size.width >= 44, `SASMO touch width ${size.width} at ${width}px`);
      assert.ok(size.height >= 44, `SASMO touch height ${size.height} at ${width}px`);
    });
    assert.deepEqual(errors, []);
    await page.close();
  }
});

test("legacy curriculum foundation remains available without feature regression", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}catalog.html`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.evaluate(function () { return typeof window.GFIELDGrade6RoadmapProjection; }), "object");
  assert.equal(await page.locator(".program-card").count(), 1);
  assert.equal(await page.locator("#resource-list li").count(), 6);
  assert.equal(await page.locator("#unit-list .unit-item").count(), 9);

  await page.locator('[data-grade="8"]').click();
  assert.equal(await page.locator(".program-card").count(), 5);
  assert.equal(await page.locator(".domain-item").count(), 5);
  assert.equal(await page.locator("#unit-list .unit-item").count(), 10);

  await page.locator('[data-role="teacher"]').click();
  assert.deepEqual(await page.locator("#resource-list li b").allTextContents(), ["수업 교안", "정답지", "해설지", "평가 루브릭", "과제 생성기", "교사용 분석"]);

  await page.locator('[data-grade="6"]').click();
  assert.equal(await page.locator('[data-unit-id="ccss-6-rp-a"]').getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("#cadence-summary").getByText("선택 단원: 비와 비율 · 6.RP.A", { exact: true }).count(), 1);

  await page.locator('[data-role="student"]').click();
  assert.equal(await page.locator("#resource-list").getByText("정답지", { exact: true }).count(), 0);
  assert.equal(await page.locator("#resource-list").getByText("개념 워크북", { exact: true }).count(), 1);

  await page.locator('[data-locale="en"]').click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator("h1").textContent(), "A K–12 pathway with a verified K–8 foundation");
  assert.deepEqual(errors, []);
  await page.close();

  const linkedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const linkedErrors = collectErrors(linkedPage);
  await linkedPage.goto(`${baseUrl}catalog.html?role=teacher&grade=8`, { waitUntil: "networkidle" });
  assert.equal(await linkedPage.locator('[data-role="teacher"]').getAttribute("aria-pressed"), "true");
  assert.equal(await linkedPage.locator('[data-grade="8"]').getAttribute("aria-pressed"), "true");
  assert.equal(await linkedPage.locator(".program-card").count(), 5);
  assert.match(await linkedPage.locator("#resource-list").innerText(), /교사용 분석/);
  assert.deepEqual(linkedErrors, []);
  await linkedPage.close();
});

test("Grade 6 diagnostic page explains the real flow while public hosting keeps assessment content locked", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}diagnostic.html`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match(await page.locator("h1").innerText(), /42문항을 풀고,\s*5개 영역을 분석하고, 다음 학습을 처방합니다/);
  assert.equal(await page.locator("#item-count").textContent(), "42");
  assert.equal(await page.locator("#cluster-count").textContent(), "10");
  assert.equal(await page.locator("#domain-count").textContent(), "5");
  assert.match(await page.locator(".status-chip").innerText(), /진단 · 분석 · 처방 v1/);
  assert.match(await page.locator(".hero-meta").innerText(), /42\s*비공개 QA 문항[\s\S]*32\+10\s*자동채점 \+ 교사검토/);
  assert.match(await page.locator(".release-note").innerText(), /42문항은 모두 독립 검수 대기[\s\S]*실제 학생 운영은 잠겨/);
  assert.match(await page.locator(".release-note").innerText(), /10개 자체 제작 개념 레슨/);
  assert.equal(await page.locator('a[href="./concept-learning.html"]').count() >= 1, true);
  assert.equal(await page.locator(".cluster-card").count(), 10);
  assert.equal(await page.locator("#runtime-status-title").textContent(), "공개 안내 모드");
  assert.equal(await page.locator("#student-start").isDisabled(), true);
  assert.equal(await page.locator("#teacher-open").isDisabled(), true);
  assert.equal(await page.locator("#student-workspace").isVisible(), true);
  assert.equal(await page.locator("#teacher-workspace").isHidden(), true);
  assert.equal(await page.locator('[data-role="student"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("#role-panel").innerText(), /학생은 42문항을 풀고 자신의 강점과 다음 연습을 확인합니다/);
  assert.equal(await page.locator("#role-panel .role-link").getAttribute("href"), "./catalog.html?role=student&grade=6");
  assert.equal(await page.evaluate(function () {
    return window.GFIELDGrade6PlacementPlan.plan.slots.every(function (slot) {
      return slot.itemId === null && slot.itemVersion === null && slot.releaseState === "locked-awaiting-reviewed-item";
    });
  }), true);
  const publicHtml = await page.content();
  ["qst-bnk-", "private-authoring", "privateDraft", "solutionByLocale", "rubricDraft", "scoringSpec"].forEach(function (token) {
    assert.equal(publicHtml.includes(token), false, `diagnostic leaked ${token}`);
  });
  assert.equal(await page.locator("#teacher-entry-form").count(), 1);
  assert.equal(await page.locator("#student-question").innerText(), "");

  await page.locator('[data-workspace-role="teacher"][role="tab"]').click();
  assert.equal(await page.locator("#workspace-tab-teacher").getAttribute("aria-selected"), "true");
  assert.equal(await page.locator("#teacher-workspace").isVisible(), true);
  assert.equal(await page.locator("#student-workspace").isHidden(), true);

  await page.locator('[data-role="teacher"]').click();
  assert.equal(await page.locator('[data-role="teacher"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("#role-panel").innerText(), /교사는 10개 서술 응답을 확인하고 처방 후보를 학교 검토로 넘깁니다/);
  assert.equal(await page.locator("#role-panel .role-link").getAttribute("href"), "./catalog.html?role=teacher&grade=6");
  await page.locator('[data-role="teacher"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-role="student"]').getAttribute("aria-selected"), "true");
  assert.deepEqual(errors, []);
  await page.close();
});

test("Grade 6 public concept learning provides ten deep-linked, fully solved lessons without graded assessment leakage", async function () {
  const visualEvidence = {
    "6.RP.A": /8권[\s\S]*12달러[\s\S]*14권[\s\S]*21달러/,
    "6.NS.A": /3\/4 = 6\/8[\s\S]*6개/,
    "6.NS.B": /84[\s\S]*60[\s\S]*최대공약수는 12/,
    "6.NS.C": /-7\/4[\s\S]*-5\/3/,
    "6.EE.A": /2³[\s\S]*8 \+ 4[\s\S]*31/,
    "6.EE.B": /6x = 42[\s\S]*x = 7/,
    "6.EE.C": /y = 3x \+ 2[\s\S]*23/,
    "6.G.A": /\(0,0\)[\s\S]*\(8,4\)[\s\S]*\(4,6\)/,
    "6.SP.A": /자료 A[\s\S]*자료 B[\s\S]*평균은 8/,
    "6.SP.B": /2, 4, 4, 6, 9[\s\S]*9 − 2 = 7/
  };
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}concept-learning.html?cluster=6.G.A`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator("#concept-list button").count(), 10);
  assert.equal(await page.locator('#concept-list button[data-cluster="6.G.A"]').getAttribute("aria-current"), "page");
  assert.match(await page.locator("#lesson h2").textContent(), /보이는 도형을 분해하고 보완해 넓이 구하기/);
  assert.equal(await page.locator("#lesson .example-method").count(), 2);
  assert.match(await page.locator("#lesson .example-result").innerText(), /40제곱단위[\s\S]*모두 40/);
  assert.match(await page.locator("#lesson .checkpoint-gate").innerText(), /교사 배정 뒤 열립니다[\s\S]*자동 결정하지 않습니다/);
  assert.equal(await page.locator("#lesson input, #lesson textarea, #lesson select").count(), 0);

  for (const button of await page.locator("#concept-list button").all()) {
    await button.click();
    assert.equal(await page.locator("#lesson .example-method").count(), 2);
    assert.equal(await page.locator("#lesson .math-visual").count(), 1);
    assert.ok(await page.locator("#lesson .math-visual table, #lesson .math-visual svg[role=\"img\"], #lesson .math-visual [role=\"img\"]").count() >= 1);
    const activeCluster = await button.getAttribute("data-cluster");
    assert.match(await page.locator("#lesson .math-visual").innerText(), visualEvidence[activeCluster]);
    assert.equal(await page.locator("#lesson .misconception-card").count(), 1);
    assert.equal(await page.locator("#lesson .reflection-prompt").count(), 1);
    assert.match(new URL(page.url()).searchParams.get("cluster"), /^6\.(?:RP|NS|EE|G|SP)\.[A-C]$/);
  }
  await page.goto(`${baseUrl}concept-learning.html?cluster=6.NS.B`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#lesson").innerText(), /84와 60의 최대공약수[\s\S]*최대공약수는 정확히 12/);
  assert.doesNotMatch(await page.locator("#lesson").innerText(), /126|공통 곱 42/);
  await page.goto(`${baseUrl}concept-learning.html?cluster=6.EE.B`, { waitUntil: "networkidle" });
  assert.match(await page.locator("#lesson").innerText(), /6x = 42[\s\S]*x = 7/);
  assert.doesNotMatch(await page.locator("#lesson").innerText(), /4x\s*-\s*7|29/);
  const publicHtml = await page.locator("#lesson").innerHTML();
  ["qst-bnk-", "slot-bdg-", "private-authoring", "privateDraft", "scoringSpec", "rubricDraft"].forEach(function (token) {
    assert.equal(publicHtml.includes(token), false, `concept lesson leaked ${token}`);
  });
  assert.deepEqual(errors, []);
  await page.close();

  for (const width of [320, 390, 768]) {
    const mobile = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600 });
    const mobileErrors = collectErrors(mobile);
    await mobile.goto(`${baseUrl}concept-learning.html?cluster=6.RP.A`, { waitUntil: "networkidle" });
    for (const button of await mobile.locator("#concept-list button").all()) {
      await button.click();
      const dimensions = await mobile.evaluate(function () {
        return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
      });
      const activeCluster = await button.getAttribute("data-cluster");
      assert.equal(dimensions.scroll, dimensions.client, `concept learning ${activeCluster} overflow at ${width}px`);
      const svgLabelAudit = await mobile.locator(".model-svg .svg-label").evaluateAll(function (nodes) {
        const boxes = nodes.map(function (node) {
          const rect = node.getBoundingClientRect();
          return { text: node.textContent, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, height: rect.height };
        });
        const overlaps = [];
        for (let left = 0; left < boxes.length; left += 1) {
          for (let right = left + 1; right < boxes.length; right += 1) {
            const a = boxes[left]; const b = boxes[right];
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) overlaps.push([a.text, b.text]);
          }
        }
        return { minimumHeight: boxes.length ? Math.min(...boxes.map(function (box) { return box.height; })) : null, overlaps };
      });
      if (svgLabelAudit.minimumHeight != null) assert.ok(svgLabelAudit.minimumHeight >= 12, `${activeCluster} SVG labels unreadable at ${width}px`);
      assert.deepEqual(svgLabelAudit.overlaps, [], `${activeCluster} SVG labels overlap at ${width}px`);
    }
    assert.equal(await mobile.locator(".site-header nav").isVisible(), true, `concept navigation hidden at ${width}px`);
    const controls = await mobile.locator("#concept-list button, .lesson-nav-button, .brand, .site-header nav a, .concept-footer a").evaluateAll(function (nodes) {
      return nodes.filter(function (node) { return !node.disabled; }).map(function (node) {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    controls.forEach(function (size) {
      assert.ok(size.width >= 44, `concept touch width ${size.width} at ${width}px`);
      assert.ok(size.height >= 44, `concept touch height ${size.height} at ${width}px`);
    });
    assert.deepEqual(mobileErrors, []);
    await mobile.close();
  }
});

test("home and curriculum foundation have no mobile horizontal overflow", async function () {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600 });
    const errors = collectErrors(page);
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    const dimensions = await page.evaluate(function () {
      return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    });
    assert.equal(dimensions.scroll, dimensions.client, `home overflow at ${width}px`);
    assert.equal(await page.locator(".hero-actions .button").first().isVisible(), true);
    const targetSizes = await page.locator(".goal-button, .grade-tabs button, .role-tabs button, .role-shortcut, .mobile-quick-nav a, .brand, .text-link, .official-link, .site-footer a").evaluateAll(function (controls) {
      return controls.map(function (control) {
        const rect = control.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    targetSizes.forEach(function (size) {
      assert.ok(size.width >= 44, `touch width ${size.width} at ${width}px`);
      assert.ok(size.height >= 44, `touch height ${size.height} at ${width}px`);
    });
    if (width === 390) {
      const firstScreen = await page.locator(".hero-actions").evaluate(function (actions) {
        const rect = actions.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, viewport: window.innerHeight };
      });
      assert.ok(firstScreen.top >= 0, `hero actions begin above viewport: ${firstScreen.top}`);
      assert.ok(firstScreen.bottom <= firstScreen.viewport, `hero actions below first screen: ${firstScreen.bottom}`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.locator('[data-goal="sasmo"]').click();
      const pathPosition = await page.evaluate(function () {
        const panel = document.getElementById("goal-detail").getBoundingClientRect();
        const original = document.getElementById("goal-original").getBoundingClientRect();
        return { panelTop: panel.top, originalBottom: original.bottom, viewport: window.innerHeight };
      });
      assert.ok(pathPosition.panelTop >= 100 && pathPosition.panelTop <= 145, `goal panel top ${pathPosition.panelTop}`);
      assert.ok(pathPosition.originalBottom <= pathPosition.viewport, `official original CTA below viewport: ${pathPosition.originalBottom}`);
    }
    if (width <= 768) {
      assert.equal(await page.locator(".mobile-quick-nav").isVisible(), true);
      const quickTargets = await page.locator(".mobile-quick-nav a").evaluateAll(function (controls) {
        return controls.map(function (control) { return control.getBoundingClientRect().height; });
      });
      quickTargets.forEach(function (height) { assert.ok(height >= 44, `quick nav touch height ${height}`); });
    }
    assert.deepEqual(errors, []);
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = collectErrors(page);
  await page.goto(`${baseUrl}catalog.html`, { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(function () {
    return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
  assert.equal(dimensions.scroll, dimensions.client);
  const catalogTargets = await page.locator(".locale-switch button, .segmented button, .grade-switch button, .brand, .source-note a, footer a").evaluateAll(function (controls) {
    return controls.map(function (control) {
      const rect = control.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
  });
  catalogTargets.forEach(function (size) {
    assert.ok(size.width >= 44, `catalog touch width ${size.width}`);
    assert.ok(size.height >= 44, `catalog touch height ${size.height}`);
  });
  assert.deepEqual(errors, []);
  await page.close();

  for (const width of [320, 390, 768]) {
    const diagnostic = await browser.newPage({ viewport: { width, height: 844 }, isMobile: width < 600 });
    const diagnosticErrors = collectErrors(diagnostic);
    await diagnostic.goto(`${baseUrl}diagnostic.html`, { waitUntil: "networkidle" });
    const diagnosticDimensions = await diagnostic.evaluate(function () {
      return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
    });
    assert.equal(diagnosticDimensions.scroll, diagnosticDimensions.client, `diagnostic overflow at ${width}px`);
    const roleTargets = await diagnostic.locator("[data-role], .brand, .role-link, .site-footer a").evaluateAll(function (controls) {
      return controls.map(function (control) {
        const rect = control.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
    });
    roleTargets.forEach(function (size) {
      assert.ok(size.width >= 44, `diagnostic touch width ${size.width} at ${width}px`);
      assert.ok(size.height >= 44, `diagnostic touch height ${size.height} at ${width}px`);
    });
    assert.deepEqual(diagnosticErrors, []);
    await diagnostic.close();
  }
});
