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

test("Grade 6 diagnostic blueprint separates role guidance from locked assessment content", async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = collectErrors(page);
  const response = await page.goto(`${baseUrl}diagnostic.html`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match(await page.locator("h1").innerText(), /Grade 6 배치 진단\s*교사용 설계표/);
  assert.equal(await page.locator("#item-count").textContent(), "42");
  assert.equal(await page.locator("#cluster-count").textContent(), "10");
  assert.equal(await page.locator("#domain-count").textContent(), "5");
  assert.equal(await page.locator(".cluster-card").count(), 10);
  assert.match(await page.locator("#role-panel").innerText(), /교사는 영역별 근거를 수업 계획으로 연결합니다/);
  assert.equal(await page.evaluate(function () {
    return window.GFIELDGrade6PlacementPlan.plan.slots.every(function (slot) {
      return slot.itemId === null && slot.itemVersion === null && slot.releaseState === "locked-awaiting-reviewed-item";
    });
  }), true);
  assert.equal((await page.content()).includes("qst-bnk-"), false);

  await page.locator('[data-role="student"]').click();
  assert.equal(await page.locator('[data-role="student"]').getAttribute("aria-selected"), "true");
  assert.match(await page.locator("#role-panel").innerText(), /학생은 평가 뒤에 무엇을 연습할지 확인합니다/);
  await page.locator('[data-role="student"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator('[data-role="teacher"]').getAttribute("aria-selected"), "true");
  assert.deepEqual(errors, []);
  await page.close();
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

  const diagnostic = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const diagnosticErrors = collectErrors(diagnostic);
  await diagnostic.goto(`${baseUrl}diagnostic.html`, { waitUntil: "networkidle" });
  const diagnosticDimensions = await diagnostic.evaluate(function () {
    return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
  assert.equal(diagnosticDimensions.scroll, diagnosticDimensions.client);
  const roleTargets = await diagnostic.locator("[data-role], .brand, .site-footer a").evaluateAll(function (controls) {
    return controls.map(function (control) { return control.getBoundingClientRect().height; });
  });
  roleTargets.forEach(function (height) { assert.ok(height >= 44, `diagnostic touch height ${height}`); });
  assert.deepEqual(diagnosticErrors, []);
  await diagnostic.close();
});
