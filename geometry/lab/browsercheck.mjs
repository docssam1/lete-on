import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const out = fileURLToPath(new URL("./qa-artifacts/", import.meta.url));
const expected = {
  plane: ["점판 도형", "각도 탐구", "사각형 탐구", "원 탐구", "둘레 탐구", "단위 넓이"],
  move: ["도형의 변화", "거울대칭"],
  observe: ["숨은 도형", "길 잇기"],
  solid: ["주사위 굴리기", "전개도 전망대"]
};
const countEnabled = new Set(["점판 도형", "각도 탐구", "사각형 탐구", "원 탐구", "둘레 탐구", "단위 넓이", "도형의 변화", "거울대칭"]);
const targetReady = new Map([
  ["점판 도형", "#countInput"], ["각도 탐구", "#countInput"], ["사각형 탐구", "#countInput"],
  ["원 탐구", "#countInput"], ["둘레 탐구", "#countInput"], ["단위 넓이", "#countInput"],
  ["도형의 변화", "#countInput"], ["거울대칭", "#countInput"], ["숨은 도형", "#problemGrid .problem"],
  ["길 잇기", "#problemGrid .problem"], ["주사위 굴리기", "#problemGrid .problem"], ["전개도 전망대", "#problemGrid .problem"]
]);
const domainLabels = ["쌓기나무", "평면도형", "이동·대칭", "관찰·경로", "입체·전개도", "색종이 접기"];

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

  const targetHrefs = [];
  for (const [domain, labels] of Object.entries(expected)) {
    await page.locator(`.domain-btn[data-domain="${domain}"]`).click();
    assert.deepEqual(await page.locator(".type-card:not(:disabled) .type-label").allTextContents(), labels);
    for (const label of labels) {
      const card = page.locator(".type-card", { hasText: label });
      await card.click();
      if (countEnabled.has(label)) {
        const count = page.locator('.count-btn[data-count="15"]');
        assert.equal(await count.isDisabled(), false, `${label}: count controls should be enabled`);
        await count.click();
      } else {
        assert.equal(await page.locator('.count-btn[data-count="15"]').isDisabled(), true, `${label}: fixed activity should disable count controls`);
        assert.equal(await page.locator(".count-btn.is-active").count(), 0, `${label}: fixed activity should not imply a selected count`);
      }
      const href = await page.locator("#buildBtn").getAttribute("href");
      assert.ok(href && href !== "#", `${label}: missing build link`);
      assert.equal(new URL(href, labUrl).pathname.startsWith("/geometry/worksheet/"), true, `${label}: wrong target`);
      assert.equal(new URL(href, labUrl).searchParams.has("count"), countEnabled.has(label), `${label}: count handoff mismatch`);
      if (countEnabled.has(label)) assert.equal(new URL(href, labUrl).searchParams.get("count"), "15", `${label}: wrong count`);
      targetHrefs.push({ label, href: new URL(href, labUrl).href });
      links += 1;
    }
  }

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
    assert.deepEqual(localErrors, [], `${label}: target browser errors`);
    await target.close();
    targetLoads += 1;
  }

  for (const width of [1280, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 768 ? 900 : 844 });
    await page.goto(labUrl, { waitUntil: "networkidle" });
    await page.locator('.domain-btn[data-domain="plane"]').click();
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
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
    assert.equal(layout.domains, true, `${width}: clipped domain control`);
    assert.equal(layout.cards, true, `${width}: clipped type card`);
    await page.screenshot({ path: `${out}/lab-${width}.png`, fullPage: true });
    layouts += 1;
  }
  await context.close();

  if (base.includes("127.0.0.1") || base.includes("localhost")) {
    const offline = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await offline.newPage();
    await page.goto(`${base}/geometry/world-map/`, { waitUntil: "networkidle" });
    await page.waitForFunction(async () => {
      if (!("serviceWorker" in navigator)) return false;
      await navigator.serviceWorker.ready;
      return true;
    });
    await page.reload({ waitUntil: "networkidle" });
    await offline.setOffline(true);
    await page.goto(`${base}/geometry/lab/`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('.domain-btn[data-domain="plane"]');
    assert.equal(await page.locator(".domain-btn").count(), 6, "offline catalog domains");
    await page.locator('.domain-btn[data-domain="plane"]').click();
    assert.equal(await page.locator(".type-card:not(:disabled)").count(), 6, "offline plane catalog");
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
      representations: "영역 탭, 학습지 유형 카드, 문항 수와 실제 인쇄 화면 연결",
      prerequisites: "연습할 도형 영역을 알고 선택할 수 있음",
      "reasoning-load": "문제 풀이 전 선택 화면이므로 영역과 활동 구분만 요구",
      "response-mode": "영역과 학습지를 선택한 뒤 기존 검증된 문제은행으로 이동"
    },
    errors
  };
  assert.deepEqual(errors, [], "catalog browser errors");
  await writeFile(`${out}/results.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
