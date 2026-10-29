import { createClient } from "npm:@supabase/supabase-js@2";
import { FieldsAccessError, isFieldsAdminName, authenticateFieldsAdmin, resolveFieldsSession } from "../_shared/fields-admin-access.js";
import { membershipSummary } from "../_shared/fields-membership.js";

// 가입 회원(fields_members, 원장 2026-10-29)이면 체험이 끝났거나 멈춘 경우 로그인을 막고, 열린 권을 함께 돌려준다.
// 회원 표에 없는 옛 승인번호(원장이 직접 만든 것)는 그대로 들어온다.
async function memberOf(service: any, name: string) {
  const { data, error } = await service.from("fields_members").select("*").eq("child_name", name).maybeSingle();
  if (error) return null;
  return membershipSummary(data);
}

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://127.0.0.1:8793",
  "http://127.0.0.1:8794",
  "http://localhost:8793",
  "http://localhost:8794",
  "http://127.0.0.1:8796",
  "http://localhost:8796",
  "http://127.0.0.1:8767",
  "http://localhost:8767",
]);

function headers(req: Request) {
  const value = new Headers({
    "Access-Control-Allow-Headers": "content-type, x-fields-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Pragma": "no-cache",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) value.set("Access-Control-Allow-Origin", origin);
  return value;
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(req) });
}

function secretKey() {
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (serviceRole) return serviceRole;
  const named = Deno.env.get("SUPABASE_SECRET_KEYS") || "";
  if (named) {
    try { return String(JSON.parse(named).default || ""); } catch { /* legacy fallback */ }
  }
  return Deno.env.get("SUPABASE_SECRET_KEY") || "";
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = secretKey();
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);
  const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const body = await req.json();
    const action = String(body?.action || "login");
    if (action === "login" || action === "admin-login") {
      const code = String(body?.code || "").trim().toUpperCase();
      const suppliedName = String(body?.name || "").replace(/\s+/gu, "").trim();
      if (code.length < 6 || code.length > 64 || suppliedName.length < 1 || suppliedName.length > 30) {
        return json(req, { error: "credentials_invalid" }, 400);
      }
      if (isFieldsAdminName(suppliedName)) {
        const account = await authenticateFieldsAdmin(service, url, key, req, suppliedName, String(body.code).trim(), fetch, {
          retainSession: action === "admin-login", deviceToken: action === "admin-login" ? body.deviceToken : "",
        });
        if (action === "admin-login") {
          if (!("session" in account)) return json(req, { error: "admin_auth_unavailable" }, 503);
          return json(req, { name: account.name, type: "admin", session: account.session, deviceToken: account.deviceToken });
        }
        const token = randomToken();
        const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
        const { error } = await service.from("fields_access_sessions").insert({
          token_hash: await sha256(token), admin_user_id: account.adminUserId, expires_at: expiresAt,
        });
        if (error) return json(req, { error: "session_create_failed" }, 503);
        return json(req, { token, expiresAt, name: account.name, permissions: account.permissions, type: account.type });
      }
      if (action === "admin-login") return json(req, { error: "credentials_invalid" }, 401);
      const codeHash = await sha256(code);
      const { data: account, error } = await service.from("fields_access_accounts")
        .select("student_name,code_hash,permissions,student_type,active").eq("student_name", suppliedName).maybeSingle();
      if (error) console.error("fields_access_account_query_failed", error.code, error.message);
      if (error) return json(req, { error: "account_lookup_failed" }, 503);
      if (!account?.active || account.code_hash !== codeHash) return json(req, { error: "credentials_invalid" }, 401);
      const member = await memberOf(service, account.student_name);
      if (member && !member.open) return json(req, { error: member.reason, member }, 403);
      const token = randomToken();
      const tokenHash = await sha256(token);
      const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
      const { error: insertError } = await service.from("fields_access_sessions").insert({
        token_hash: tokenHash,
        student_name: account.student_name,
        expires_at: expiresAt,
      });
      if (insertError) return json(req, { error: "session_create_failed" }, 503);
      return json(req, { token, expiresAt, name: account.student_name, permissions: account.permissions, type: account.student_type, member });
    }

    const token = String(req.headers.get("x-fields-session") || body?.token || "");
    if (!/^[a-f0-9]{64}$/u.test(token)) return json(req, { error: "session_required" }, 401);
    const tokenHash = await sha256(token);
    if (action === "logout") {
      const { error } = await service.from("fields_access_sessions").delete().eq("token_hash", tokenHash);
      if (error) return json(req, { error: "session_delete_failed" }, 503);
      return json(req, { ok: true });
    }
    if (action !== "session") return json(req, { error: "action_invalid" }, 400);
    const account = await resolveFieldsSession(service, tokenHash);
    const member = account.type === "admin" ? null : await memberOf(service, account.name);
    if (member && !member.open) return json(req, { error: member.reason, member }, 403);
    await service.from("fields_access_sessions").update({ last_seen_at: new Date().toISOString() }).eq("token_hash", tokenHash);
    return json(req, {
      ok: true,
      name: account.name,
      permissions: account.permissions,
      type: account.type,
      expiresAt: account.expiresAt,
      member,
    });
  } catch (error) {
    if (error instanceof FieldsAccessError) return json(req, { error: error.message }, error.status);
    if (error instanceof TypeError || (error instanceof Error && error.name === "TimeoutError")) {
      return json(req, { error: "auth_unavailable" }, 503);
    }
    return json(req, { error: "request_invalid" }, 400);
  }
});
