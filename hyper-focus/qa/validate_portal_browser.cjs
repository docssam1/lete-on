const { chromium } = require("playwright");
const assert = require("node:assert/strict");

const base = process.argv[2] || "http://127.0.0.1:4177";
const adminCode = String(process.env.HF_QA_ADMIN_CODE || "").trim();

const QA_STUDENT = "포털검수";
const QA_CODE = "GFQA2468";

async function installOfflineConfig(page) {
  await page.route("**/hyper-focus/supabase-config.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: "window.GFIELD_HF_SUPABASE_CONFIG=Object.freeze({enabled:false,features:Object.freeze({secureMockDelivery:false})});"
  }));
}

async function installStudentFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/data.js", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.GFIELD_HF_DATA={students:[${JSON.stringify(QA_STUDENT)}],studentCode:{${JSON.stringify(QA_STUDENT)}:${JSON.stringify(QA_CODE)}},studentType:{${JSON.stringify(QA_STUDENT)}:"internal"},access:{${JSON.stringify(QA_STUDENT)}:["hyperfocus"]}};`
  }));
}

async function installVipAdminFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/portal-auth.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.GFieldHFPortalAuth={ready:async()=>({role:"admin",name:"DOCSSAM",permissions:["*"]}),client:async()=>({functions:{invoke:async()=>({data:{contents:[{id:"qa-vip-01",kind:"resources",title:"검수용 비공개 자료",summary:"관리자 편집 화면 레이아웃 검수",body_html:"",content_date:"2026-09-03",tags:["qa"],status:"draft"}],relations:[],assets:[]},error:null})}})};`
  }));
}

async function installRemoteAdminFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/portal-auth.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.GFieldHFPortalAuth={ready:async()=>({role:"admin",name:"DOCSSAM",permissions:["*"]}),isSupabaseEnabled:()=>true,client:async()=>({functions:{invoke:async(_name,{body}={})=>body?.action==="list"?({data:{students:[{id:"11111111-1111-4111-8111-111111111111",name:"승인번호검수",type:"internal",status:"active",approvalCode:"GF-2468",permissions:["hyperfocus"],mockBundles:{utilization:{state:"none",activeCount:0,expectedCount:8},final:{state:"none",activeCount:0,expectedCount:3},last:{state:"none",activeCount:0,expectedCount:4}}}]},error:null}):({data:{ok:true},error:null})}})};`
  }));
}

async function loginStudentFixture(page) {
  await page.locator("[data-login-open]").first().click();
  assert.equal(await page.locator("#loginCode").getAttribute("type"), "text");
  await page.locator("#loginName").fill(QA_STUDENT);
  await page.locator("#loginCode").fill(QA_CODE);
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
    await installStudentFixture(desktop);
    desktop.on("pageerror", error => errors.push(`desktop: ${error.message}`));
    const response = await desktop.goto(`${base}/hyper-focus/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await desktop.locator("#previewGrid .preview-card").count(), 4);
    await noOverflow(desktop, "desktop public");
    await desktop.screenshot({ path: "tmp/hf-portal-public-desktop.png", fullPage: true });

    await loginStudentFixture(desktop);
    assert.equal(await desktop.locator("#productShelf .library-book").count(), 4);
    assert.deepEqual(await desktop.locator("#productShelf .library-book").evaluateAll(rows => rows.map(row => row.dataset.product)), ["hyperfocus", "mock", "challenge", "vip"]);
    assert.deepEqual(await desktop.locator("#productShelf .library-book strong").allInnerTexts(), ["Hyper Focus\n문항 진단", "프리미어\n모의고사", "2026년 9월\n챌린지 대비", "VIP\n라운지"]);
    assert.equal(await desktop.evaluate(() => window.GFIELD_HF_PORTAL.products.find(product => product.key === "vip").href), "https://hs.gfieldacademy.net/");
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
    assert.match(await desktop.locator("#studentInfoDisplay").textContent(), /포털검수.*승인번호 확인 완료/);
    await desktop.waitForTimeout(16000);
    assert.equal(await desktop.locator("#page2").isVisible(), true);
    assert.equal(await desktop.locator("#gfieldIntro").isVisible(), false);
    assert.equal(await desktop.locator("#introPreview").isVisible(), false);

    await desktop.goto(`${base}/hyper-focus/vip/`, { waitUntil: "networkidle" });
    assert.equal(await desktop.locator("#blocked:not([hidden])").count(), 1);

    const directAdmin = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await directAdmin.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "domcontentloaded" });
    await directAdmin.waitForURL(/hyper-focus\/(?:\?login=1)?$/);
    assert.match(directAdmin.url(), /login=1/);
    await directAdmin.close();

    const admin = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    if (!adminCode) await installOfflineConfig(admin);
    await admin.goto(`${base}/hyper-focus/`, { waitUntil: "domcontentloaded" });
    if (adminCode) {
      await admin.locator("[data-login-open]").first().click();
      await admin.locator("#loginName").fill("docssam");
      await admin.locator("#loginCode").fill(adminCode);
      await admin.locator("#loginForm button[type=submit]").click();
      await admin.waitForURL(/hyper-focus\/admin\.html$/);
      await admin.waitForLoadState("networkidle");
    } else {
      await admin.evaluate(() => sessionStorage.setItem("gfield_hf_portal_session_v1", JSON.stringify({ role: "admin", name: "DOCSSAM", permissions: ["*"] })));
      await admin.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "networkidle" });
    }
    assert.equal(await admin.locator("#rows tr").count(), 0);
    for (const heading of ["문항 진단", "추가 문제", "모의고사", "VIP 라운지", "문제 은행"]) assert.equal(await admin.getByRole("columnheader", { name: heading }).count(), 1);
    await admin.close();

    const approvalAdmin = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
    await installRemoteAdminFixture(approvalAdmin);
    approvalAdmin.on("pageerror", error => errors.push(`approval admin desktop: ${error.message}`));
    await approvalAdmin.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "networkidle" });
    assert.equal(await approvalAdmin.locator("#rows tr").count(), 1);
    assert.equal(await approvalAdmin.locator('[data-action="copy-code"]').textContent(), "GF-2468");
    assert.equal(await approvalAdmin.locator('[data-action="rotate"]').textContent(), "로그인 재설정");
    await noOverflow(approvalAdmin, "desktop approval admin");
    await approvalAdmin.screenshot({ path: "tmp/hf-admin-approval-code-desktop.png", fullPage: true });
    await approvalAdmin.close();

    const vipAdmin = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await installVipAdminFixture(vipAdmin);
    vipAdmin.on("pageerror", error => errors.push(`vip admin desktop: ${error.message}`));
    await vipAdmin.goto(`${base}/hyper-focus/vip/admin.html`, { waitUntil: "networkidle" });
    assert.equal(await vipAdmin.locator("#app:not([hidden])").count(), 1);
    assert.equal(await vipAdmin.locator("#blocked:not([hidden])").count(), 0);
    assert.equal(await vipAdmin.locator("#contentList .content-card").count(), 1);
    assert.equal(await vipAdmin.getByRole("button", { name: "안전하게 저장" }).count(), 1);
    await noOverflow(vipAdmin, "desktop VIP admin");
    await vipAdmin.screenshot({ path: "tmp/hf-vip-admin-desktop.png", fullPage: true });
    await vipAdmin.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installStudentFixture(mobile);
    mobile.on("pageerror", error => errors.push(`mobile: ${error.message}`));
    await mobile.goto(`${base}/hyper-focus/`, { waitUntil: "networkidle" });
    await noOverflow(mobile, "mobile public");
    await mobile.screenshot({ path: "tmp/hf-portal-public-mobile.png", fullPage: true });
    await loginStudentFixture(mobile);
    await noOverflow(mobile, "mobile library");
    await mobile.screenshot({ path: "tmp/hf-portal-library-mobile.png", fullPage: true });

    const vipAdminMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installVipAdminFixture(vipAdminMobile);
    vipAdminMobile.on("pageerror", error => errors.push(`vip admin mobile: ${error.message}`));
    await vipAdminMobile.goto(`${base}/hyper-focus/vip/admin.html`, { waitUntil: "networkidle" });
    assert.equal(await vipAdminMobile.locator("#app:not([hidden])").count(), 1);
    assert.equal(await vipAdminMobile.locator("#blocked:not([hidden])").count(), 0);
    await noOverflow(vipAdminMobile, "mobile VIP admin");
    await vipAdminMobile.screenshot({ path: "tmp/hf-vip-admin-mobile.png", fullPage: true });
    await vipAdminMobile.close();

    const approvalAdminMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installRemoteAdminFixture(approvalAdminMobile);
    approvalAdminMobile.on("pageerror", error => errors.push(`approval admin mobile: ${error.message}`));
    await approvalAdminMobile.goto(`${base}/hyper-focus/admin.html`, { waitUntil: "networkidle" });
    assert.equal(await approvalAdminMobile.locator('[data-action="copy-code"]').textContent(), "GF-2468");
    await noOverflow(approvalAdminMobile, "mobile approval admin");
    await approvalAdminMobile.screenshot({ path: "tmp/hf-admin-approval-code-mobile.png", fullPage: true });
    await approvalAdminMobile.close();

    assert.deepEqual(errors, []);
    console.log(JSON.stringify({
      status: 200,
      publicPrograms: 4,
      libraryPrograms: ["hyperfocus", "mock", "challenge", "vip"],
      fixtureUnlocked: 1,
      fixtureLocked: 3,
      diagnosisAutoLogin: true,
      vipDirectAccessBlocked: true,
      adminDirectAccessBlocked: true,
      adminCredentialLogin: adminCode ? true : "not_requested",
      adminProductPermissions: 5,
      adminCurrentApprovalCode: true,
      vipAdminDesktop: true,
      vipAdminMobile: true,
      desktopOverflow: 0,
      mobileOverflow: 0,
      errors
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
