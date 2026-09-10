import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const out = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
const expected = {
  plane: ["점판 도형", "각도 탐구", "사각형 탐구", "원 탐구", "둘레 탐구", "단위 넓이"],
  move: ["도형의 변화", "거울대칭"],
  observe: ["숨은 도형", "길 잇기"]
};
const diceLabels = ["칸마다 밑면 기록", "목표 칸의 밑면", "표시한 칸의 눈의 합", "두 주사위 밑면 추리", "도착한 주사위의 다섯 면"];
const countEnabled = new Set(["점판 도형", "각도 탐구", "사각형 탐구", "원 탐구", "둘레 탐구", "단위 넓이", "도형의 변화", "거울대칭", "주사위 굴리기"]);
const targetReady = new Map([
  ["점판 도형", "#countInput"], ["각도 탐구", "#countInput"], ["사각형 탐구", "#countInput"],
  ["원 탐구", "#countInput"], ["둘레 탐구", "#countInput"], ["단위 넓이", "#countInput"],
  ["도형의 변화", "#countInput"], ["거울대칭", "#countInput"], ["숨은 도형", "#problemGrid .problem"],
  ["길 잇기", "#problemGrid .problem"], ["주사위 굴리기", "#countInput"], ["전개도 전망대", "#problemGrid .problem"]
]);
const domainLabels = ["쌓기나무", "평면도형", "이동·대칭", "도형 찾기·길 잇기", "입체·전개도", "색종이 접기"];

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];
let links = 0;
let layouts = 0;
let targetLoads = 0;

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const labUrl = `${base}/geometry/lab/`;
  await page.goto(labUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".domain-btn");
  assert.deepEqual(await page.locator(".domain-btn").allTextContents(), domainLabels);

  assert.equal(await page.locator("#levelField").isVisible(), true, "cube level control");
  assert.equal(await page.locator("#intensityField").isVisible(), true, "cube difficulty control");
  assert.equal(await page.locator("#previewPanel").isVisible(), true, "generated worksheet preview");
  assert.ok(await page.locator('.type-card.is-multiple input[type="checkbox"]').count() > 1, "generated types use checkboxes");
  assert.equal(await page.locator('.type-card[data-book] input[type="radio"]').count(), 2, "prepared worksheets use radios");
  assert.ok(Math.max(...(await page.locator(".count-btn").evaluateAll((buttons) => buttons.map((button) => Number(button.dataset.count))))) <= 20, "catalog count cap");

  await page.locator('.type-card[data-type="TC"]').click();
  await page.locator('.type-card[data-type="IC"]').click();
  assert.equal(await page.locator('.type-card.is-multiple .type-input:checked').count(), 2, "multiple generated types");
  let generatedHref = new URL(await page.locator("#buildBtn").getAttribute("href"), labUrl);
  assert.equal(generatedHref.searchParams.get("types"), "TC.IC");
  await page.locator('.stage-badge[data-level="L0"]').click();
  assert.equal(await page.locator('.type-card[data-type="TC"] .type-input').isChecked(), true, "incompatible selection retained");
  assert.equal(await page.locator('.type-card[data-type="TC"] .type-input').isDisabled(), true, "incompatible selection identified");
  assert.match(await page.locator("#typeNote").textContent(), /선택은 유지/);
  generatedHref = new URL(await page.locator("#buildBtn").getAttribute("href"), labUrl);
  assert.equal(generatedHref.searchParams.get("types"), "IC", "only compatible type handed off");

  await page.locator('.domain-btn[data-domain="fold"]').click();
  await page.locator('.stage-badge[data-level="L3"]').click();
  assert.equal(await page.locator("#levelField").isVisible(), true, "fold level filter");
  assert.equal(await page.locator("#intensityField").isVisible(), true, "fold difficulty handoff");
  assert.equal(await page.locator("#previewPanel").isVisible(), false, "fold has no fake preview");
  assert.ok(await page.locator('.type-card[data-fold] input[type="radio"]').count() > 1, "fold types use radios");
  assert.ok(Math.max(...(await page.locator(".count-btn").evaluateAll((buttons) => buttons.map((button) => Number(button.dataset.count))))) <= 20, "fold count cap");
  await page.locator('.type-card[data-fold="hole2"]').click();
  const foldHref = new URL(await page.locator("#buildBtn").getAttribute("href"), labUrl);
  assert.equal(foldHref.searchParams.get("mode"), "hole2");
  assert.equal(foldHref.searchParams.get("count"), "20");

  const targetHrefs = [];
  for (const [domain, labels] of Object.entries(expected)) {
    await page.locator(`.domain-btn[data-domain="${domain}"]`).click();
    assert.equal(await page.locator("#levelField").isVisible(), false, `${domain}: irrelevant level hidden`);
    assert.equal(await page.locator("#intensityField").isVisible(), false, `${domain}: irrelevant difficulty hidden`);
    assert.equal(await page.locator("#previewPanel").isVisible(), false, `${domain}: empty preview hidden`);
    assert.deepEqual(await page.locator('.type-card[data-available="true"] .type-label').allTextContents(), labels);
    assert.equal(await page.locator('.type-card input[type="radio"]').count(), labels.length, `${domain}: worksheet cards use radios`);
    for (const label of labels) {
      const card = page.locator(".type-card", { hasText: label });
      await card.click();
      assert.equal(await page.locator('.type-card .type-input:checked').count(), 1, `${label}: one print engine selected`);
      if (countEnabled.has(label)) {
        assert.equal(await page.locator("#countField").isVisible(), true, `${label}: count field visible`);
        const count = page.locator('.count-btn[data-count="15"]');
        assert.equal(await count.isDisabled(), false, `${label}: count controls should be enabled`);
        await count.click();
      } else {
        assert.equal(await page.locator("#countField").isVisible(), false, `${label}: fixed count field hidden`);
        assert.equal(await page.locator('.count-btn[data-count="15"]').isDisabled(), true, `${label}: fixed activity should disable count controls`);
        assert.equal(await page.locator(".count-btn.is-active").count(), 0, `${label}: fixed activity should not imply a selected count`);
      }
      const href = await page.locator("#buildBtn").getAttribute("href");
      assert.ok(href && href !== "#", `${label}: missing build link`);
      const targetUrl = new URL(href, labUrl);
      assert.equal(targetUrl.pathname.startsWith("/geometry/worksheet/"), true, `${label}: wrong target`);
      assert.equal(targetUrl.searchParams.has("count"), countEnabled.has(label), `${label}: count handoff mismatch`);
      if (countEnabled.has(label)) assert.equal(targetUrl.searchParams.get("count"), "15", `${label}: wrong count`);
      targetHrefs.push({ label, href: targetUrl.href });
      links += 1;
    }
  }

  await page.locator('.domain-btn[data-domain="solid"]').click();
  assert.equal(await page.locator("#levelField").isVisible(), false, "solid: unrelated course stage visible");
  assert.equal(await page.locator("#intensityField").isVisible(), false, "solid: unrelated generic difficulty visible");
  assert.equal(await page.locator("#diceLevelField").isVisible(), true, "solid: dice difficulty missing");
  assert.equal(await page.locator("#previewPanel").isVisible(), false, "solid: empty preview visible");
  assert.equal(await page.locator("#typesTitle").textContent(), "세부유형");
  assert.deepEqual(await page.locator('.type-card[data-dice-activity] .type-label').allTextContents(), diceLabels);
  assert.equal(await page.locator('.type-card[data-dice-activity] input[type="checkbox"]').count(), 5, "dice details must be multi-select checkboxes");
  assert.equal(await page.locator('.type-card[data-studio="NE"] input[type="radio"]').count(), 1, "net worksheet must stay separate");
  assert.equal(await page.locator("#countField").isVisible(), false, "solid: count should wait for a printable selection");
  await page.locator('.dice-level-btn[data-dice-level="5"]').click();
  for (const activity of ["sequence", "sum", "visible"]) await page.locator(`.type-card[data-dice-activity="${activity}"]`).click();
  assert.equal(await page.locator('.type-card[data-dice-activity] .type-input:checked').count(), 3, "dice detail multi-selection");
  assert.equal(await page.locator("#countField").isVisible(), true, "dice detail count missing");
  await page.locator('.count-btn[data-count="15"]').click();
  const diceHref = new URL(await page.locator("#buildBtn").getAttribute("href"), labUrl);
  assert.equal(diceHref.pathname, "/geometry/worksheet/dice-roll/");
  assert.equal(diceHref.searchParams.get("activities"), "sequence.sum.visible");
  assert.equal(diceHref.searchParams.get("level"), "5");
  assert.equal(diceHref.searchParams.get("count"), "15");
  assert.equal(diceHref.searchParams.get("cover"), "1");
  assert.match(await page.locator("#buildSummary").textContent(), /주사위 굴리기 · 난이도 5 · 15문항/);
  targetHrefs.push({ label: "주사위 굴리기", href: diceHref.href });
  links += 1;

  await page.locator('.type-card[data-studio="NE"]').click();
  assert.equal(await page.locator('.type-card[data-dice-activity] .type-input:checked').count(), 0, "net selection did not clear dice engine");
  assert.equal(await page.locator("#diceLevelField").isVisible(), false, "net selection kept dice difficulty visible");
  assert.equal(await page.locator("#countField").isVisible(), false, "net worksheet incorrectly shows generated count");
  const netHref = new URL(await page.locator("#buildBtn").getAttribute("href"), labUrl);
  assert.equal(netHref.pathname, "/geometry/worksheet/net-observatory/");
  assert.equal(netHref.searchParams.has("activities"), false);
  targetHrefs.push({ label: "전개도 전망대", href: netHref.href });
  links += 1;

  await page.locator('.domain-btn[data-domain="plane"]').click();
  assert.equal(await page.locator('.type-card[data-studio="AR"] .type-input').isChecked(), true, "selection restored per domain");

  for (const { label, href } of targetHrefs) {
    const target = await context.newPage();
    const localErrors = [];
    target.on("pageerror", (error) => localErrors.push(error.message));
    const response = await target.goto(href, { waitUntil: "networkidle" });
    assert.ok(response && response.ok(), `${label}: target HTTP failure`);
    await target.waitForSelector(targetReady.get(label));
    if (countEnabled.has(label)) {
      assert.equal(await target.locator("#countInput").inputValue(), "15", `${label}: target ignored count`);
      assert.equal(await target.locator("article").count(), 15, `${label}: target did not render 15 problems`);
    }
    if (label === "주사위 굴리기") {
      const selectedActivities = new URL(href).searchParams.get("activities").split(".").sort();
      assert.deepEqual(await target.locator(".problem").evaluateAll((problems) => [...new Set(problems.map((problem) => problem.dataset.activity))].sort()), selectedActivities, "dice bank ignored selected detail types");
      for (const activity of selectedActivities) assert.equal(await target.locator(`.problem[data-activity="${activity}"]`).count(), 5, `dice bank did not distribute ${activity} evenly`);
      assert.ok(await target.locator(".visible-problem").count() > 0, "dice bank omitted the five-face activity");
      const diceWork = await target.locator(".visible-problem").evaluateAll((problems) => problems.map((problem) => ({
        moves: problem.querySelectorAll('.route-board line[data-direction]').length,
        guides: problem.querySelectorAll('.five-face-guide').length
      })));
      diceWork.forEach(({ moves, guides }) => assert.equal(guides, moves, "dice bank did not render one five-face guide per move"));
    }
    assert.deepEqual(localErrors, [], `${label}: target browser errors`);
    await target.close();
    targetLoads += 1;
  }

  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
    await page.goto(labUrl, { waitUntil: "networkidle" });
    await page.locator('.domain-btn[data-domain="plane"]').click();
    await page.locator('.type-card[data-studio="GB"] .type-input').focus();
    await page.keyboard.press("Space");
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      irrelevantControlsHidden: ["levelField", "intensityField", "previewPanel"].every((id) => document.getElementById(id).hidden),
      selectedRadios: document.querySelectorAll('.type-card input[type="radio"]:checked').length,
      buildTop: document.getElementById("buildBtn").getBoundingClientRect().top,
      domains: [...document.querySelectorAll(".domain-btn")].every((node) => {
        const box = node.getBoundingClientRect();
        return box.left >= 0 && box.right <= window.innerWidth && box.height >= 40;
      }),
      cards: [...document.querySelectorAll(".type-card")].every((node) => {
        const box = node.getBoundingClientRect();
        return box.left >= 0 && box.right <= window.innerWidth && box.width >= 120;
      })
    }));
    assert.equal(layout.overflow, false, `${width}: horizontal overflow`);
    assert.equal(layout.irrelevantControlsHidden, true, `${width}: irrelevant controls visible`);
    assert.equal(layout.selectedRadios, 1, `${width}: keyboard radio selection`);
    if (width === 390) assert.ok(layout.buildTop < 1300, `390: build action too far below selection (${layout.buildTop})`);
    assert.equal(layout.domains, true, `${width}: clipped domain control`);
    assert.equal(layout.cards, true, `${width}: clipped type card`);
    await page.screenshot({ path: `${out}/lab-${width}.png`, fullPage: true });

    await page.locator('.domain-btn[data-domain="solid"]').click();
    await page.locator('.dice-level-btn[data-dice-level="4"]').click();
    await page.locator('.type-card[data-dice-activity="sequence"]').click();
    await page.locator('.type-card[data-dice-activity="visible"]').click();
    const solidLayout = await page.evaluate(() => {
      const types = document.getElementById("typesField").getBoundingClientRect();
      const count = document.getElementById("countField").getBoundingClientRect();
      const build = document.querySelector(".build-bar").getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        diceLevelVisible: !document.getElementById("diceLevelField").hidden,
        unrelatedControlsHidden: ["levelField", "intensityField", "previewPanel"].every((id) => document.getElementById(id).hidden),
        selectedDetails: document.querySelectorAll('.type-card[data-dice-activity] input:checked').length,
        details: document.querySelectorAll('.type-card[data-dice-activity]').length,
        cardsFit: [...document.querySelectorAll(".type-card")].every((node) => {
          const box = node.getBoundingClientRect();
          return box.left >= 0 && box.right <= window.innerWidth && node.scrollWidth <= node.clientWidth + 1;
        }),
        levelsFit: [...document.querySelectorAll(".dice-level-btn")].every((node) => {
          const box = node.getBoundingClientRect();
          return box.left >= 0 && box.right <= window.innerWidth;
        }),
        ordered: types.bottom <= count.top + 1 && count.bottom <= build.top + 1
      };
    });
    assert.equal(solidLayout.overflow, false, `${width}: solid horizontal overflow`);
    assert.equal(solidLayout.diceLevelVisible, true, `${width}: solid dice level hidden`);
    assert.equal(solidLayout.unrelatedControlsHidden, true, `${width}: solid unrelated controls visible`);
    assert.equal(solidLayout.selectedDetails, 2, `${width}: solid multi-selection lost`);
    assert.equal(solidLayout.details, 5, `${width}: solid detail cards missing`);
    assert.equal(solidLayout.cardsFit, true, `${width}: solid card clipped`);
    assert.equal(solidLayout.levelsFit, true, `${width}: solid level control clipped`);
    assert.equal(solidLayout.ordered, true, `${width}: solid fields overlap or are out of order`);
    await page.screenshot({ path: `${out}/lab-solid-${width}.png`, fullPage: true });
    layouts += 1;
  }
  await context.close();

  if (base.includes("127.0.0.1") || base.includes("localhost")) {
    const offline = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await offline.newPage();
    await page.goto(`${base}/geometry/world-map/`, { waitUntil: "networkidle" });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await offline.setOffline(true);
    await page.goto(`${base}/geometry/lab/`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('.domain-btn[data-domain="plane"]');
    assert.equal(await page.locator(".domain-btn").count(), 6, "offline catalog domains");
    await page.locator('.domain-btn[data-domain="plane"]').click();
    assert.equal(await page.locator('.type-card[data-available="true"]').count(), 6, "offline plane catalog");
    await offline.close();
  }

  const report = {
    passed: true,
    domains: domainLabels.length,
    standaloneWorksheets: links,
    targetLoads,
    responsiveLayouts: layouts,
    maxSelectableQuestions: 20,
    learner_stage: "초등 도형 · 통합 문제은행 탐색과 학습지 만들기",
    learnerFit: {
      language: "교사용 한국어 영역명과 초등 학습 행동 중심 설명",
      representations: "영역 탭, 생성 유형 체크박스, 독립 학습지 라디오, 문항 수와 실제 인쇄 화면 연결",
      prerequisites: "연습할 도형 영역을 알고 선택할 수 있음",
      "reasoning-load": "문제 풀이 전 선택 화면이므로 영역과 활동 구분만 요구",
      "response-mode": "영역과 한 인쇄 엔진을 선택하거나 생성 유형을 복수 선택한 뒤 검증된 문제은행으로 이동"
    },
    errors
  };
  assert.deepEqual(errors, [], "catalog browser errors");
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
