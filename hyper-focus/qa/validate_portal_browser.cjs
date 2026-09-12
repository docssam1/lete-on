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

async function installVipStudentFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/portal-auth.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.GFieldHFPortalAuth={
  ready:async()=>({role:"student",name:"VIP검수",permissions:["vip"]}),
  canAccess:(session,key)=>session.permissions.includes(key),
  isSupabaseEnabled:()=>true,
  client:async()=>({from:table=>({select(){return this},order(){
    const rows={
      hf_vip_contents:[
        {id:"hf-resource-secret-roadmap-ages-5-6-7",kind:"resources",title:"상위권 5·6·7세를 위한 맞춤 시크릿 로드맵",summary:"시크릿 로드맵",content_date:"2026-09-11",tags:["로드맵"],body_html:"",external_url:"https://lete-on.gfieldacademy.net/roadmap/demo/",status:"published",published_at:"2026-09-11T00:00:00Z"},
        {id:"hf-seminar-soma-premier-strategy",kind:"seminar",title:"소마 프리미어 합격 전략",summary:"전략 영상",content_date:"2026-09-11",tags:["소마"],body_html:"",external_url:"https://youtu.be/h197u-ymJag",status:"published",published_at:"2026-09-11T00:00:00Z"},
        {id:"hf-seminar-fields-age6-final-strategy",kind:"seminar",title:"6세 필즈대비 파이널 전략",summary:"파이널 전략 영상",content_date:"2026-09-11",tags:["필즈"],body_html:"",external_url:"https://youtu.be/ipM78EnPTTU",status:"published",published_at:"2026-09-11T00:00:00Z"}
      ],
      hf_vip_relations:[],hf_vip_assets:[]
    };
    return Promise.resolve({data:rows[table]||[],error:null});
  }})})
};`
  }));
}

async function installRemoteAdminFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/portal-auth.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.__HF_ADMIN_CALLS=[];
window.GFieldHFPortalAuth={
  ready:async()=>({role:"admin",name:"DOCSSAM",permissions:["*"]}),
  isSupabaseEnabled:()=>true,
  client:async()=>({functions:{invoke:async(name,{body}={})=>{
    window.__HF_ADMIN_CALLS.push({name,body});
    if(body?.action==="list")return {data:{students:[{id:"11111111-1111-4111-8111-111111111111",name:"승인번호검수",type:"internal",status:"active",approvalCode:"GF-2468",permissions:["hyperfocus","challenge-bank-replace-count-constraints","challenge-bank-split-merge-chain"],mockBundles:{utilization:{state:"none",activeCount:0,expectedCount:8},final:{state:"none",activeCount:0,expectedCount:3},last:{state:"none",activeCount:0,expectedCount:4}}}]},error:null};
    if(body?.action==="set_detail_entitlements")return {data:{ok:true,studentId:body.studentId,scope:body.scope,changedCount:body.changes.length,changes:body.changes},error:null};
    return {data:{ok:true},error:null};
  }}})
};`
  }));
}

async function installConceptVideoFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/challenge/access-service.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.HFChallengeAccess={allow:key=>["challenge-concept-1","challenge-concept-2"].includes(key),approvedStudentName:()=>"영상검수",isTeacherPreview:()=>false,refresh:async()=>({verified:true})};`
  }));
  await page.route("**/hyper-focus/challenge/document-access.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: "void 0;"
  }));
  await page.route("https://www.youtube-nocookie.com/embed/**", route => route.fulfill({
    contentType: "text/html; charset=utf-8",
    body: "<!doctype html><title>concept video fixture</title>"
  }));
}

async function installMockVideoFixture(page) {
  await installOfflineConfig(page);
  await page.route("**/hyper-focus/challenge/access-service.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: `window.HFChallengeAccess={allow:key=>key==="challenge-mock-1",approvedStudentName:()=>"영상검수",isTeacherPreview:()=>false,refresh:async()=>({verified:true})};`
  }));
  await page.route("**/hyper-focus/challenge/document-access.js*", route => route.fulfill({
    contentType: "application/javascript; charset=utf-8",
    body: "void 0;"
  }));
  await page.route("https://www.youtube-nocookie.com/embed/**", route => route.fulfill({
    contentType: "text/html; charset=utf-8",
    body: "<!doctype html><title>mock video fixture</title>"
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
    assert.equal(await desktop.evaluate(() => window.GFIELD_HF_PORTAL.products.find(product => product.key === "vip").href), "./vip/");
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

    const vipStudent = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await installVipStudentFixture(vipStudent);
    vipStudent.on("pageerror", error => errors.push(`vip student desktop: ${error.message}`));
    await vipStudent.goto(`${base}/hyper-focus/vip/`, { waitUntil: "networkidle" });
    assert.equal(await vipStudent.locator("#app:not([hidden])").count(), 1);
    assert.equal(await vipStudent.locator("#blocked").isHidden(), true);
    assert.equal(await vipStudent.locator("#contentGrid .content-card").count(), 1);
    await vipStudent.locator("#contentGrid .content-card").click();
    const roadmapLink = vipStudent.locator("#detailBody .external-access a");
    assert.equal(await roadmapLink.getAttribute("href"), "https://lete-on.gfieldacademy.net/roadmap/demo/");
    assert.equal(await roadmapLink.getAttribute("target"), "_blank");
    assert.equal(await roadmapLink.getAttribute("rel"), "noopener noreferrer");
    assert.equal(await roadmapLink.getAttribute("referrerpolicy"), "no-referrer");
    await vipStudent.locator("#detail .detail-backdrop").click({ position: { x: 10, y: 10 } });
    await vipStudent.locator("#detail").waitFor({ state: "hidden" });
    await vipStudent.locator('[data-kind="seminar"]').click();
    assert.deepEqual(await vipStudent.locator("#contentGrid .content-card h3").allInnerTexts(), ["소마 프리미어 합격 전략", "6세 필즈대비 파이널 전략"]);
    await noOverflow(vipStudent, "desktop VIP catalog");
    await vipStudent.screenshot({ path: "tmp/hf-vip-catalog-desktop.png", fullPage: true });
    await vipStudent.locator("#contentGrid .content-card").first().click();
    assert.equal(await vipStudent.locator("#detailBody .external-access a").getAttribute("href"), "https://youtu.be/h197u-ymJag");
    await vipStudent.screenshot({ path: "tmp/hf-vip-detail-desktop.png", fullPage: true });
    await vipStudent.close();

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
    await approvalAdmin.locator('[data-action="details"]').click();
    await approvalAdmin.locator("#approvalCenter").waitFor({ state: "visible" });
    await approvalAdmin.locator("#approvalChallengeSelectAll").click();
    assert.equal((await approvalAdmin.locator("#approvalChallengeTabCount").textContent()).trim(), "(102)");
    await approvalAdmin.locator("#approvalSave").click();
    await approvalAdmin.waitForFunction(() => document.querySelector("#approvalStatus")?.textContent?.includes("102개 승인 항목을 한 번에 저장했습니다."));
    const batchCalls = await approvalAdmin.evaluate(() => window.__HF_ADMIN_CALLS.filter(call => call.body?.action === "set_detail_entitlements"));
    assert.equal(batchCalls.length, 1, "전체 유형은 Edge Function 한 번으로 저장해야 합니다.");
    assert.equal(batchCalls[0].name, "admin-students");
    assert.equal(batchCalls[0].body.scope, "challenge");
    assert.equal(batchCalls[0].body.changes.length, 102);
    assert.ok(batchCalls[0].body.changes.every(change => change.enabled === true));
    await noOverflow(approvalAdmin, "desktop approval admin");
    await approvalAdmin.screenshot({ path: "tmp/hf-admin-approval-code-desktop.png", fullPage: true });
    await approvalAdmin.close();

    const conceptVideo = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await installConceptVideoFixture(conceptVideo);
    conceptVideo.on("pageerror", error => errors.push(`concept video desktop: ${error.message}`));
    await conceptVideo.goto(`${base}/hyper-focus/challenge/concepts.html?round=1`, { waitUntil: "networkidle" });
    assert.equal(await conceptVideo.locator("#conceptVideoPanel").isVisible(), true);
    assert.match(await conceptVideo.locator("#conceptVideoFrame").getAttribute("src"), /youtube-nocookie\.com\/embed\/7KvLEzuKfhk/);
    assert.equal(await conceptVideo.locator("#conceptVideoLink").getAttribute("href"), "https://youtu.be/7KvLEzuKfhk");
    assert.equal(await conceptVideo.locator("#conceptVideoWatermark span").count(), 3);
    assert.match(await conceptVideo.locator("#conceptViewerLayout").evaluate(node => getComputedStyle(node).gridTemplateColumns), /px/);
    await noOverflow(conceptVideo, "desktop concept video");
    await conceptVideo.screenshot({ path: "tmp/hf-concept-1-video-desktop.png", fullPage: true });
    await conceptVideo.locator("#round").selectOption("2");
    assert.equal(await conceptVideo.locator("#conceptVideoPanel").isVisible(), true);
    assert.match(await conceptVideo.locator("#conceptVideoFrame").getAttribute("src"), /youtube-nocookie\.com\/embed\/E8I6OpqlBJs/);
    assert.equal(await conceptVideo.locator("#conceptVideoFrame").getAttribute("title"), "챌린지 대비 개념 2회 학습 영상");
    assert.equal(await conceptVideo.locator("#conceptVideoLink").getAttribute("href"), "https://youtu.be/E8I6OpqlBJs");
    assert.equal(await conceptVideo.locator("#conceptVideoWatermark span").count(), 3);
    await noOverflow(conceptVideo, "desktop concept 2 video");
    await conceptVideo.screenshot({ path: "tmp/hf-concept-2-video-desktop.png", fullPage: true });
    await conceptVideo.close();

    const mockVideo = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await installMockVideoFixture(mockVideo);
    mockVideo.on("pageerror", error => errors.push(`challenge mock video desktop: ${error.message}`));
    await mockVideo.goto(`${base}/hyper-focus/challenge/exam.html?round=1`, { waitUntil: "networkidle" });
    assert.equal(await mockVideo.locator("#mockVideoPanel").isVisible(), true);
    assert.match(await mockVideo.locator("#mockVideoFrame").getAttribute("src"), /youtube-nocookie\.com\/embed\/_QHKH2ctLWE/);
    assert.equal(await mockVideo.locator("#mockVideoFrame").getAttribute("title"), "챌린지 대비 모의고사 1회 학습 영상");
    assert.equal(await mockVideo.locator("#mockVideoLink").getAttribute("href"), "https://youtu.be/_QHKH2ctLWE");
    assert.equal(await mockVideo.locator("#mockVideoWatermark span").count(), 3);
    assert.match(await mockVideo.locator("#mockViewerLayout").evaluate(node => getComputedStyle(node).gridTemplateColumns), /px/);
    await noOverflow(mockVideo, "desktop challenge mock video");
    await mockVideo.screenshot({ path: "tmp/hf-challenge-mock-1-video-desktop.png", fullPage: true });
    await mockVideo.emulateMedia({ media: "print" });
    assert.equal(await mockVideo.locator("#mockVideoPanel").isHidden(), true);
    await mockVideo.emulateMedia({ media: "screen" });
    await mockVideo.locator("#round").selectOption("2");
    assert.equal(await mockVideo.locator("#mockVideoPanel").isHidden(), true);
    assert.equal(await mockVideo.locator("#mockVideoFrame").getAttribute("src"), null);
    await mockVideo.close();

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

    const vipStudentMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installVipStudentFixture(vipStudentMobile);
    vipStudentMobile.on("pageerror", error => errors.push(`vip student mobile: ${error.message}`));
    await vipStudentMobile.goto(`${base}/hyper-focus/vip/`, { waitUntil: "networkidle" });
    await vipStudentMobile.locator('[data-kind="seminar"]').click();
    assert.equal(await vipStudentMobile.locator("#contentGrid .content-card").count(), 2);
    await noOverflow(vipStudentMobile, "mobile VIP catalog");
    await vipStudentMobile.screenshot({ path: "tmp/hf-vip-catalog-mobile.png", fullPage: true });
    await vipStudentMobile.locator("#contentGrid .content-card").first().click();
    assert.equal(await vipStudentMobile.locator("#detailBody .external-access a").getAttribute("href"), "https://youtu.be/h197u-ymJag");
    await noOverflow(vipStudentMobile, "mobile VIP detail");
    await vipStudentMobile.screenshot({ path: "tmp/hf-vip-detail-mobile.png", fullPage: true });
    await vipStudentMobile.close();

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

    const conceptVideoMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installConceptVideoFixture(conceptVideoMobile);
    conceptVideoMobile.on("pageerror", error => errors.push(`concept video mobile: ${error.message}`));
    await conceptVideoMobile.goto(`${base}/hyper-focus/challenge/concepts.html?round=2`, { waitUntil: "networkidle" });
    assert.equal(await conceptVideoMobile.locator("#conceptVideoPanel").isVisible(), true);
    assert.match(await conceptVideoMobile.locator("#conceptVideoFrame").getAttribute("src"), /youtube-nocookie\.com\/embed\/E8I6OpqlBJs/);
    assert.equal(await conceptVideoMobile.locator("#conceptVideoLink").getAttribute("href"), "https://youtu.be/E8I6OpqlBJs");
    await noOverflow(conceptVideoMobile, "mobile concept 2 video");
    await conceptVideoMobile.screenshot({ path: "tmp/hf-concept-2-video-mobile.png", fullPage: true });
    await conceptVideoMobile.close();

    const mockVideoMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await installMockVideoFixture(mockVideoMobile);
    mockVideoMobile.on("pageerror", error => errors.push(`challenge mock video mobile: ${error.message}`));
    await mockVideoMobile.goto(`${base}/hyper-focus/challenge/exam.html?round=1`, { waitUntil: "networkidle" });
    assert.equal(await mockVideoMobile.locator("#mockVideoPanel").isVisible(), true);
    assert.match(await mockVideoMobile.locator("#mockVideoFrame").getAttribute("src"), /youtube-nocookie\.com\/embed\/_QHKH2ctLWE/);
    assert.equal(await mockVideoMobile.locator("#mockVideoLink").getAttribute("href"), "https://youtu.be/_QHKH2ctLWE");
    await noOverflow(mockVideoMobile, "mobile challenge mock video");
    await mockVideoMobile.screenshot({ path: "tmp/hf-challenge-mock-1-video-mobile.png", fullPage: true });
    await mockVideoMobile.close();

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
      conceptVideoViewers: [1, 2],
      challengeMockOneVideoViewer: true,
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
