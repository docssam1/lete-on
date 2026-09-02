import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import snapshot from "./catalog.json" with { type: "json" };
import { searchSnapshot, validateSnapshot } from "./core.mjs";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://hs.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") || "";
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function corsHeaders(req: Request): Headers {
  const headers = new Headers({
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Pragma": "no-cache",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

function bearer(req: Request): string {
  const value = req.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function secretKey(): string {
  const named = Deno.env.get("SUPABASE_SECRET_KEYS") || "";
  if (named) {
    try { return String(JSON.parse(named).default || ""); } catch (_) { /* legacy fallback below */ }
  }
  return Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

async function requireActiveAdmin(req: Request) {
  const token = bearer(req);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = secretKey();
  if (!token || !url || !serviceKey) throw new Error("authentication_required");
  const service = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await service.auth.getUser(token);
  const role = String(data.user?.app_metadata?.role || data.user?.app_metadata?.gfield_role || "");
  if (error || !data.user || data.user.is_anonymous || !["admin", "teacher"].includes(role)) {
    throw new Error("admin_required");
  }
  const { data: account, error: accountError } = await service.from("hs_accounts")
    .select("role,active").eq("user_id", data.user.id).maybeSingle();
  if (accountError || !account?.active || !["admin", "teacher"].includes(account.role)) {
    throw new Error("admin_required");
  }
}

validateSnapshot(snapshot);

Deno.serve(async (req: Request) => {
  if (!allowedOrigin(req)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  if (req.method !== "GET") return json(req, { error: "method_not_allowed" }, 405);
  try {
    await requireActiveAdmin(req);
    const url = new URL(req.url);
    if ((url.searchParams.get("action") || "") === "status") {
      if (Array.from(url.searchParams.keys()).some(key => key !== "action")) return json(req, { error: "query_invalid" }, 400);
      return json(req, {
        ready: true,
        schemaVersion: snapshot.schemaVersion,
        snapshotRevision: snapshot.snapshotRevision,
        profileCount: snapshot.profiles.length,
      });
    }
    return json(req, searchSnapshot(snapshot, url.searchParams));
  } catch (error) {
    const code = error instanceof Error ? error.message : "server_not_ready";
    const status = code === "authentication_required" ? 401
      : code === "admin_required" ? 403
      : ["query_invalid", "profiles_invalid", "limit_invalid", "include_candidates_invalid"].includes(code) ? 400
      : 503;
    return json(req, { error: status === 503 ? "server_not_ready" : code }, status);
  }
});
