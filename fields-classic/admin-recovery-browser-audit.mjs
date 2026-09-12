import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const browser = await chromium.launch();

async function run(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, isMobile: width === 390, hasTouch: width === 390 });
  const errors = [];
  const calls = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/functions/v1/hs-admin-session", route => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      session: {
        access_token: "test-admin-access",
        refresh_token: "test-admin-refresh",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: { app_metadata: { role: "admin", admin_id: "DOCSSAM" } },
      },
      deviceToken: "test-device-token-with-more-than-thirty-two-characters",
    }),
  }));
  await page.route("**/functions/v1/fields-approval-admin", async route => {
    const body = route.request().postDataJSON();
    calls.push(body);
    if (body.action === "list") {
      return route.fulfill({ contentType: "application/json", body: JSON.stringify({
        accounts: Array.from({ length: 18 }, (_, index) => ({
          student_name: `테스트${String(index + 1).padStart(2, "0")}`,
          permissions: index === 0 ? ["개념완성"] : [],
          student_type: index % 2 ? "online" : "internal",
          active: index !== 17,
        })),
      }) });
    }
    if (body.action === "resetCode") return route.fulfill({ contentType: "application/json", body: JSON.stringify({ student: body.student, approvalCode: "GFTEST99" }) });
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ account: body }) });
  });

  await page.goto(`${base}/fields-classic/admin.html`, { waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("#adminApp").isVisible(), false, "approval list must be gated before login");
  await page.locator("#adminCode").fill("test-only");
  await page.locator("#loginButton").click();
  await page.locator("#matrix tbody tr").nth(17).waitFor();
  assert.equal(await page.locator("#matrix tbody tr").count(), 18, "all recovered approvals should render");
  assert.match(await page.locator("#approval-status").textContent(), /18건/);
  assert.equal(await page.locator("#matrix").textContent().then(text => text.includes("GFTEST99")), false, "stored approval codes must not render");

  await page.locator("#matrix tbody tr").first().locator(".cell").nth(1).click();
  await page.waitForFunction(() => document.querySelector("#approval-status")?.textContent?.includes("저장됨"));
  assert.ok(calls.some(call => call.action === "setAccess"), "permission toggle must save to secure API");

  const publicSource = await page.evaluate(() => buildFile());
  assert.ok(publicSource.includes('"students": []'), "GitHub content save must omit students");
  assert.ok(publicSource.includes('"studentCode": {}'), "GitHub content save must omit approval codes");
  assert.ok(!publicSource.includes("테스트01"), "GitHub content save must omit names");

  const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(bodyWidth <= width + 1, `page must not overflow viewport at ${width}px`);
  assert.deepEqual(errors, [], `browser errors at ${width}px`);
  await page.close();
  return { width, approvals: 18, secureSave: true, noPublicNames: true };
}

async function runStudentSessionFlow() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let loginCalls = 0;
  let sessionCalls = 0;
  await page.route("**/functions/v1/fields-auth", route => {
    const body = route.request().postDataJSON();
    if (body.action === "login") loginCalls++;
    if (body.action === "session") sessionCalls++;
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({
      ok: true,
      token: "a".repeat(64),
      name: "테스트학생",
      permissions: ["개념완성", "진단모의고사"],
      type: "online",
    }) });
  });
  await page.goto(`${base}/fields-classic/program/index.html`, { waitUntil: "domcontentloaded" });
  await page.locator("#gCode").fill("GFTEST99");
  await page.locator("#gName").fill("테스트학생");
  await page.locator(".gate-btn").click();
  await page.locator("#app.show").waitFor();
  assert.equal(loginCalls, 1, "program login must use secure API");
  assert.equal(await page.evaluate(() => sessionStorage.getItem("gf_c")), null, "raw approval code must not remain in session storage");
  assert.equal((await page.evaluate(() => sessionStorage.getItem("gfield_fields_session")))?.length, 64, "secure session token must be stored");
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#app.show").waitFor();
  assert.equal(sessionCalls, 1, "program reload must restore permissions from secure session");
  await page.close();

  const mock = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  let requestedPublicData = false;
  await mock.on("request", request => { if (/\/fields-classic\/data\.js/u.test(request.url())) requestedPublicData = true; });
  await mock.route("**/functions/v1/fields-auth", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({
    token: "b".repeat(64), name: "테스트학생", permissions: ["진단모의고사"], type: "online",
  }) }));
  await mock.goto(`${base}/fields-classic/mock/index.html`, { waitUntil: "domcontentloaded" });
  await mock.locator("#nameInp").fill("테스트학생");
  await mock.locator("#codeInp").fill("GFTEST99");
  await mock.locator(".gate-btn").click();
  await mock.locator("#mainContent").waitFor({ state: "visible" });
  assert.equal(requestedPublicData, false, "mock login must not request public approval data");
  await mock.close();
  return { programLogin: "secure", programReload: "session", mockLogin: "secure" };
}

async function runLiveAdminSmoke() {
  assert.ok(process.env.FIELDS_ADMIN_APPROVAL, "FIELDS_ADMIN_APPROVAL is required for live smoke test");
  assert.ok(process.env.FIELDS_ADMIN_DEVICE, "FIELDS_ADMIN_DEVICE is required for live smoke test");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(token => localStorage.setItem("gfield_hs_admin_device_v1", token), process.env.FIELDS_ADMIN_DEVICE);
  await page.goto(`${base}/fields-classic/admin.html`, { waitUntil: "domcontentloaded" });
  await page.locator("#adminCode").fill(process.env.FIELDS_ADMIN_APPROVAL);
  await page.locator("#loginButton").click();
  await page.locator("#matrix tbody tr").nth(17).waitFor({ timeout: 15000 });
  const count = await page.locator("#matrix tbody tr").count();
  assert.equal(count, 18, "live secure API must return all recovered approvals");
  assert.match(await page.locator("#approval-status").textContent(), /18건/);
  await page.close();
  return { liveAdminApprovals: count };
}

try {
  const results = process.env.FIELDS_ADMIN_LIVE === "1"
    ? [await runLiveAdminSmoke()]
    : [await run(1440), await run(390), await runStudentSessionFlow()];
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
