"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
const source = fs.readFileSync(path.join(root, "supabase-config.js"), "utf8");
const read = name => source.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1] || "";
const projectUrl = read("projectUrl");
const publishableKey = read("publishableKey");
const origin = "https://lete-on.gfieldacademy.net";

async function responseJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { error: text.slice(0, 160) }; }
  return { response, body };
}

async function expectJson(url, options, status = 200) {
  const result = await responseJson(url, options);
  assert.equal(result.response.status, status, `${url} -> ${result.response.status}: ${result.body.error || "unknown"}`);
  return result.body;
}

async function main() {
  assert.ok(serviceKey && projectUrl && publishableKey, "Supabase 실검증 환경값이 필요합니다.");
  const runId = crypto.randomUUID();
  const contentId = `qa-vip-${runId.replaceAll("-", "").slice(0, 10)}`;
  const email = `hf.qa.admin.${runId}@auth.gfieldacademy.net`;
  const password = `${crypto.randomUUID()}Aa1!`;
  const serviceHeaders = { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, "content-type": "application/json" };
  const restHeaders = { ...serviceHeaders, prefer: "return=representation" };
  let userId = "";
  try {
    const created = await expectJson(`${projectUrl}/auth/v1/admin/users`, {
      method: "POST", headers: serviceHeaders,
      body: JSON.stringify({ email, password, email_confirm: true, app_metadata: { hf_role: "admin" } })
    });
    userId = created.id;
    assert.match(userId, /^[0-9a-f-]{36}$/i);
    await expectJson(`${projectUrl}/rest/v1/hf_admin_accounts`, {
      method: "POST", headers: restHeaders,
      body: JSON.stringify({ user_id: userId, role: "admin", account_status: "active" })
    }, 201);

    await new Promise(resolve => setTimeout(resolve, 1200));
    const session = await expectJson(`${projectUrl}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: { apikey: publishableKey, "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const headers = { apikey: publishableKey, authorization: `Bearer ${session.access_token}`, "content-type": "application/json", origin };
    const invoke = body => expectJson(`${projectUrl}/functions/v1/admin-vip`, { method: "POST", headers, body: JSON.stringify(body) });

    const listed = await invoke({ action: "list" });
    assert.ok(Array.isArray(listed.contents) && Array.isArray(listed.relations) && Array.isArray(listed.assets));
    const saved = await invoke({ action: "saveContent", id: contentId, kind: "resources", title: "QA 비공개 자료", contentDate: "", summary: "자동 검수 후 삭제", bodyText: "공개하지 않는 초안", tags: ["qa"], status: "draft" });
    assert.equal(saved.content.id, contentId);
    assert.equal(saved.content.status, "draft");
    const relations = await invoke({ action: "saveRelations", contentId, relatedIds: [] });
    assert.deepEqual(relations.relatedIds, []);
    const upload = await invoke({ action: "createUpload", contentId, assetKind: "cover", mimeType: "image/png", byteSize: 68 });
    assert.equal(upload.bucket, "hf-vip-private");
    assert.equal(upload.objectPath, `${contentId}/cover`);
    assert.ok(upload.uploadToken);

    const denied = await responseJson(`${projectUrl}/functions/v1/admin-vip`, {
      method: "POST", headers: { apikey: publishableKey, "content-type": "application/json", origin },
      body: JSON.stringify({ action: "list" })
    });
    assert.equal(denied.response.status, 401);
    console.log(JSON.stringify({ status: "PASS", list: true, saveDraft: true, saveRelations: true, signedUpload: true, unauthenticatedStatus: 401 }, null, 2));
  } finally {
    await fetch(`${projectUrl}/rest/v1/hf_vip_relations?content_id=eq.${encodeURIComponent(contentId)}`, { method: "DELETE", headers: serviceHeaders });
    await fetch(`${projectUrl}/rest/v1/hf_vip_assets?content_id=eq.${encodeURIComponent(contentId)}`, { method: "DELETE", headers: serviceHeaders });
    await fetch(`${projectUrl}/rest/v1/hf_vip_contents?id=eq.${encodeURIComponent(contentId)}`, { method: "DELETE", headers: serviceHeaders });
    if (userId) {
      await fetch(`${projectUrl}/rest/v1/hf_admin_accounts?user_id=eq.${encodeURIComponent(userId)}`, { method: "DELETE", headers: serviceHeaders });
      await fetch(`${projectUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE", headers: serviceHeaders });
    }
  }
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
