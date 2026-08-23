const { chromium } = require("playwright");
const assert = require("node:assert/strict");

const base = process.argv[2] || "http://127.0.0.1:4177";

async function loginDemo(page) {
  await page.locator("[data-login-open]").first().click();
  const demoCode = await page.evaluate(() => window.GFIELD_HF_DATA.studentCode.DEMO);
  await page.locator("#loginName").fill("DEMO");
  await page.locator("#loginCode").fill(demoCode);
  await page.locator("#loginForm button[type=submit]").click();
  await page.locator("#libraryHome:not([hidden])").waitFor();
  await page.locator("#loginModal").waitFor({ state: "hidden" });
}

async function noOverflow(page, label) {
  const sizes = await page.evaluate(() => ({ body: document.body.scrollWidth, viewport: document.documentElement.clientWidth }));
  assert.ok(sizes.body <= sizes.viewport + 1, `${label} horizontal overflow: ${sizes.body} > ${sizes.viewport}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    desktop.on("pageerror", error => errors.push(`desktop: ${error.message}`));
    const response = await desktop.goto(`${base}/hyper-focus/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await desktop.locator("#previewGrid .preview-card").count(), 4);
    await noOverflow(desktop, "desktop public");
    await desktop.screenshot({ path: "tmp/hf-portal-public-desktop.png", fullPage: true });

    await loginDemo(desktop);
    assert.equal(await desktop.locator("#productShelf .library-book").count(), 4);
    assert.equal(await desktop.locator("#productShelf .library-book.unlocked").count(), 1);
    assert.equal(await desktop.locator("#productShelf .library-book.locked").count(), 3);
    await desktop.locator('[data-product="mock"]').first().click();
    await desktop.locator("#toast.show").waitFor();
    assert.match(await desktop.locator("#toast").textContent(), /이용 권한이 없습니다/);
    await noOverflow(desktop, "desktop library");
    await desktop.screenshot({ path: "tmp/hf-portal-library-desktop.png", fullPage: true });

    await desktop.locator('[data-product="hyperfocus"]').first().click();
    await desktop.waitForURL(/diagnosis\.html/);
    await desktop.locator("#page2").waitFor({ state: "visible" });
    assert.equal(await desktop.locator("#parentPhone").count(), 0);
    assert.match(await desktop.locator("#studentInfoDisplay").textContent(), /DEMO.*승인번호 확인 완료/);

    await desktop.goto(`${base}/hyper-focus/vip/`, { waitUntil: "networkidle" });
    assert.equal(await desktop.locator("#blocked:not([hidden])").count(), 1);

    const directAdmin = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await directAdmin.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "domcontentloaded" });
    await directAdmin.waitForURL(/hyper-focus\/(?:\?login=1)?$/);
    assert.match(directAdmin.url(), /login=1/);
    await directAdmin.close();

    const admin = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await admin.goto(`${base}/hyper-focus/`, { waitUntil: "domcontentloaded" });
    await admin.evaluate(() => sessionStorage.setItem("gfield_hf_portal_session_v1", JSON.stringify({ role: "admin", name: "DOCSSAM", permissions: ["*"] })));
    await admin.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "networkidle" });
    assert.ok(await admin.locator("#rows tr").count() > 0);
    for (const heading of ["문항 진단", "추가 문제", "모의고사", "VIP 라운지", "문제 은행"]) assert.equal(await admin.getByRole("columnheader", { name: heading }).count(), 1);
    await admin.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    mobile.on("pageerror", error => errors.push(`mobile: ${error.message}`));
    await mobile.goto(`${base}/hyper-focus/`, { waitUntil: "networkidle" });
    await noOverflow(mobile, "mobile public");
    await mobile.screenshot({ path: "tmp/hf-portal-public-mobile.png", fullPage: true });
    await loginDemo(mobile);
    await noOverflow(mobile, "mobile library");
    await mobile.screenshot({ path: "tmp/hf-portal-library-mobile.png", fullPage: true });

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({
      status: 200,
      publicPrograms: 4,
      demoUnlocked: 1,
      demoLocked: 3,
      diagnosisAutoLogin: true,
      vipDirectAccessBlocked: true,
      adminDirectAccessBlocked: true,
      adminProductPermissions: 5,
      desktopOverflow: 0,
      mobileOverflow: 0,
      errors
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
