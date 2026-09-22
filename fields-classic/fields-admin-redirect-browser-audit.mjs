import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const live = process.env.FIELDS_LIVE_AUTH_QA === "1";
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
assert.ok(["127.0.0.1", "localhost", "lete-on.gfieldacademy.net"].includes(new URL(base).hostname));
const code = live ? process.env.FIELDS_ADMIN_APPROVAL : "fixture-only-code";
assert.ok(code, "Live tests require an environment-supplied approval code");
const browser = await chromium.launch();
const api = "https://fgahqumaldheqettmvqg.supabase.co";
const report = [];
const testDeviceHashes = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    const actions = [];
    let adminSession;
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => {
      if (request.url().endsWith("/fields-auth") && request.method() === "POST") actions.push(request.postDataJSON().action);
    });
    if (!live) {
      await page.route("**/functions/v1/fields-auth", route => {
        const body = route.request().postDataJSON();
        if (body.action === "session") return route.fulfill({ json: { ok: true, name: "DOCSSAM", type: "admin", permissions: [] } });
        if (body.action === "logout") return route.fulfill({ json: { ok: true } });
        assert.equal(body.action, "admin-login");
        if (body.code !== code) return route.fulfill({ status: 401, json: { error: "credentials_invalid" } });
        return route.fulfill({ json: { type: "admin", session: {
          access_token: "fixture-admin", refresh_token: "fixture-refresh",
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: { app_metadata: { role: "admin", admin_id: "DOCSSAM" } },
        } } });
      });
      await page.route("**/functions/v1/fields-approval-admin", route => {
        assert.equal(route.request().headers().authorization, "Bearer fixture-admin");
        assert.equal(route.request().postDataJSON().action, "list");
        return route.fulfill({ json: { accounts: [{ student_name: "Fixture Student", permissions: [], active: true }] } });
      });
      await page.addInitScript(() => {
        if (location.pathname.endsWith("/program/")) {
          sessionStorage.setItem("gfield_fields_session", "old-learning-only-token");
          sessionStorage.setItem("gf_n", "DOCSSAM");
        }
      });
    }
    try {
      await page.goto(`${base}/fields-classic/program/`, { waitUntil: "networkidle" });
      if (!live) {
        assert.equal(await page.locator("#app").evaluate(node => node.classList.contains("show")), false);
        assert.match(await page.locator("#gErr").innerText(), /관리자 승인번호/);
        await page.locator("#gCode").fill("wrong-code");
        await page.locator(".gate-btn").click();
        await page.waitForFunction(() => document.getElementById("gErr").textContent.includes("확인해 주세요"));
        assert.ok(page.url().includes("/program/"));
      }
      await page.locator("#gName").fill(width === 1440 ? "docssam" : "DOCSSAM");
      await page.locator("#gCode").fill(code);
      const loggedIn = page.waitForResponse(response => response.url().endsWith("/fields-auth") && response.request().postDataJSON().action === "admin-login");
      await page.locator(".gate-btn").click();
      const response = await loggedIn;
      assert.equal(response.status(), 200, `login status ${response.status()}`);
      await page.waitForURL("**/fields-classic/admin.html");
      adminSession = await page.evaluate(() => JSON.parse(localStorage.getItem("gfield_hs_admin_session_v1") || "null"));
      if (live) {
        const device = await page.evaluate(() => localStorage.getItem("gfield_hs_admin_device_v1"));
        if (device) testDeviceHashes.push(Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(device))).toString("hex"));
      }
      await page.waitForFunction(() => document.getElementById("approval-status").textContent.includes("보안 저장소 연결됨"));
      assert.equal(await page.locator("#adminApp").isVisible(), true);
      assert.equal(await page.locator("#loginCard").isVisible(), false);
      assert.ok(await page.locator("#matrix tbody tr").count() > 0);
      assert.equal(await page.evaluate(() => sessionStorage.getItem("gfield_fields_session")), null);
      assert.equal(actions.filter(action => action === "login").length, 0, "administrator must never enter student login branch");
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForFunction(() => document.getElementById("approval-status").textContent.includes("보안 저장소 연결됨"));
      assert.deepEqual(errors, []);
      report.push({ width, adminRedirect: true, approvalList: true, studentPage: false, restored: true, live });
    } finally {
      if (live && adminSession?.access_token) {
        await page.request.post(`${api}/auth/v1/logout?scope=local`, {
          headers: { apikey: "sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I", Authorization: `Bearer ${adminSession.access_token}` }, data: {},
        });
      }
      await page.close();
    }
  }
  console.log(JSON.stringify({ checks: report, testDeviceHashes }));
} finally { await browser.close(); }
