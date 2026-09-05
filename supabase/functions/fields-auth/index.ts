import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://127.0.0.1:8793",
  "http://127.0.0.1:8794",
  "http://localhost:8793",
  "http://localhost:8794",
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
    if (action === "login") {
      const code = String(body?.code || "").trim().toUpperCase();
      const suppliedName = String(body?.name || "").replace(/\s+/gu, "").trim();
      if (code.length < 6 || code.length > 64 || suppliedName.length < 1 || suppliedName.length > 30) {
        return json(req, { error: "credentials_invalid" }, 400);
      }
      const codeHash = await sha256(code);
      const { data: account, error } = await service.from("fields_access_accounts")
        .select("student_name,code_hash,permissions,student_type,active").eq("student_name", suppliedName).maybeSingle();
      if (error) console.error("fields_access_account_query_failed", error.code, error.message);
      if (error) return json(req, { error: "account_lookup_failed" }, 503);
      if (!account?.active || account.code_hash !== codeHash) return json(req, { error: "credentials_invalid" }, 401);
      const token = randomToken();
      const tokenHash = await sha256(token);
      const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
      const { error: insertError } = await service.from("fields_access_sessions").insert({
        token_hash: tokenHash,
        student_name: account.student_name,
        expires_at: expiresAt,
      });
      if (insertError) return json(req, { error: "session_create_failed" }, 503);
      return json(req, { token, expiresAt, name: account.student_name, permissions: account.permissions, type: account.student_type });
    }

    const token = String(req.headers.get("x-fields-session") || body?.token || "");
    if (!/^[a-f0-9]{64}$/u.test(token)) return json(req, { error: "session_required" }, 401);
    const tokenHash = await sha256(token);
    if (action === "logout") {
      await service.from("fields_access_sessions").delete().eq("token_hash", tokenHash);
      return json(req, { ok: true });
    }
    if (action !== "session") return json(req, { error: "action_invalid" }, 400);
    const { data: session, error } = await service.from("fields_access_sessions")
      .select("student_name,expires_at").eq("token_hash", tokenHash).gt("expires_at", new Date().toISOString()).maybeSingle();
    if (error || !session) return json(req, { error: "session_invalid" }, 401);
    await service.from("fields_access_sessions").update({ last_seen_at: new Date().toISOString() }).eq("token_hash", tokenHash);
    return json(req, { ok: true, name: session.student_name, expiresAt: session.expires_at });
  } catch {
    return json(req, { error: "request_invalid" }, 400);
  }
});
