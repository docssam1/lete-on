"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const adminPassword = String(process.env.HF_ADMIN_E2E_PASSWORD || "");
const unauthenticatedOnly = process.env.HF_ADMIN_E2E_UNAUTH_ONLY === "1";
const source = fs.readFileSync(path.join(root, "supabase-config.js"), "utf8");
const read = name => source.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1] || "";
const projectUrl = read("projectUrl");
const publishableKey = read("publishableKey");
const adminEmail = read("adminEmail");

async function responseJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

async function main() {
  assert.ok(projectUrl && publishableKey && adminEmail, "공개 Supabase 설정이 필요합니다.");
  const endpoint = `${projectUrl}/functions/v1/admin-vip`;
  const denied = await responseJson(endpoint, { method: "POST", headers: { apikey: publishableKey, "content-type": "application/json", origin: "https://lete-on.gfieldacademy.net" }, body: JSON.stringify({ action: "list" }) });
  assert.equal(denied.response.status, 401, "비로그인 VIP 관리자 요청이 차단되지 않았습니다.");
  if (unauthenticatedOnly) {
    console.log(JSON.stringify({ status: "PASS", unauthenticatedStatus: denied.response.status }, null, 2));
    return;
  }
  assert.ok(adminPassword, "관리자 실검증 비밀번호가 필요합니다.");
  const login = await responseJson(`${projectUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: publishableKey, "content-type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  assert.equal(login.response.status, 200, "DOCSSAM 관리자 로그인 실패");
  const headers = { apikey: publishableKey, authorization: `Bearer ${login.body.access_token}`, "content-type": "application/json", origin: "https://lete-on.gfieldacademy.net" };
  const list = await responseJson(endpoint, { method: "POST", headers, body: JSON.stringify({ action: "list" }) });
  assert.equal(list.response.status, 200, `VIP 관리자 목록 실패: ${list.body.error || "unknown"}`);
  assert.ok(Array.isArray(list.body.contents) && Array.isArray(list.body.relations) && Array.isArray(list.body.assets));
  console.log(JSON.stringify({ status: "PASS", contents: list.body.contents.length, relations: list.body.relations.length, assets: list.body.assets.length, unauthenticatedStatus: denied.response.status }, null, 2));
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
