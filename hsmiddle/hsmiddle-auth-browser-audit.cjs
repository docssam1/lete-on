#!/usr/bin/env node
"use strict";

const { chromium } = require("playwright");

const base = process.argv[2] || "http://127.0.0.1:8896/hsmiddle";
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const token = "c".repeat(64);
const expiresAt = new Date(Date.now() + 3600000).toISOString();

async function mockServer(page) {
  const calls = [];
  await page.route("**/functions/v1/hsmiddle-records", async route => {
    const body = JSON.parse(route.request().postData() || "{}");
    calls.push(body.action);
    if (body.action === "login") {
      if (body.name !== "테스트학생" || body.code !== "HS-TEST") {
        await route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ error: "credentials_invalid" }) });
        return;
      }
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, token, expiresAt, startedAt: new Date().toISOString(), name: "테스트학생", access: ["diagnostic", "mock-1"], admin: false }) });
      return;
    }
    if (body.action === "session") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, expiresAt, startedAt: new Date().toISOString(), name: "테스트학생", access: ["diagnostic", "mock-1"], admin: false }) });
      return;
    }
    if (body.action === "listAttempts") {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ attempts: [] }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  return calls;
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const directTableCalls = [];
    page.on("request", request => { if (/\/rest\/v1\/hsm_(students|attempts)/.test(request.url())) directTableCalls.push(request.url()); });
    const actions = await mockServer(page);

    await page.goto(`${base}/login.html`, { waitUntil: "domcontentloaded" });
    await page.fill("#name", "잘못된학생");
    await page.fill("#code", "HS-WRONG");
    await page.click("button[type=submit]");
    await page.waitForFunction(() => document.querySelector("#status").textContent.includes("확인"));
    assert(page.url().endsWith("login.html"), "invalid login escaped login page");

    await page.fill("#name", "테스트학생");
    await page.fill("#code", "HS-TEST");
    await page.click("button[type=submit]");
    await page.waitForURL("**/library.html");
    const session = await page.evaluate(() => ({
      code: localStorage.getItem("hs-code"),
      token: localStorage.getItem("hsm-session-token-v2"),
      profile: JSON.parse(localStorage.getItem("hsm-session-profile-v2") || "null"),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    assert(session.code === null, "approval code persisted in browser storage");
    assert(session.token === token, "server session token not stored");
    assert(session.profile && session.profile.name === "테스트학생", "server profile not stored");
    assert(session.overflow <= 1, "mobile library horizontally overflows");

    await page.goto(`${base}/diagnostic.html`, { waitUntil: "networkidle" });
    assert(await page.locator("#app:not(.hidden)").count() === 1, "diagnostic did not accept server session");
    assert(actions.includes("login") && actions.includes("listAttempts"), "expected edge-function actions missing");
    assert(directTableCalls.length === 0, "browser called protected tables directly");
    await context.close();
    console.log(`HSMIDDLE_AUTH_BROWSER_AUDIT_OK actions=${actions.join(",")} direct_table_calls=0 mobile=390`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error.stack || error); process.exit(1); });
