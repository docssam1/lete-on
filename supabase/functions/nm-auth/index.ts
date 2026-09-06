// Numbers of Magic — 승인번호 검증 (2026-09-06)
//
// 왜 서버로 옮겼나: 전에는 브라우저가 anon 키로 nm_codes 를 직접 SELECT 했다. RLS 가
// active=true 라 "코드를 알아야만 조회된다"고 문서에 적혀 있었지만 그건 행 필터일 뿐이라
// /rest/v1/nm_codes?select=code 한 번이면 유효 코드가 전부 나왔다(2026-09-06 실측 200).
// 게이트를 켜는 순간 무의미해지므로 검증을 여기로 옮기고 anon SELECT 정책은 삭제한다.
//
// 계약: POST { action:'verify'|'recheck', code } → { ok:true, label } | { ok:false }
//       429 { error:'rate_limited' } — 같은 IP 10분에 12회 초과
// 설계: number_magic/승인번호-설계.md
import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://docssam1.github.io",
  "https://lete-on.gfieldacademy.net",
  "http://127.0.0.1:8767",
  "http://localhost:8767",
]);
const WINDOW_MIN = 10;
const MAX_ATTEMPTS = 12;

function headers(req: Request) {
  const h = new Headers({
    "Access-Control-Allow-Headers": "content-type, apikey, authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) h.set("Access-Control-Allow-Origin", origin);
  return h;
}
function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(req) });
}
async function sha256(v: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v));
  return Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  let body: any = {};
  try { body = await req.json(); } catch (_) { return json(req, { error: "request_invalid" }, 400); }
  const action = String(body?.action || "verify");
  if (action !== "verify" && action !== "recheck") return json(req, { error: "action_invalid" }, 400);

  const code = String(body?.code || "").trim().toUpperCase();
  if (code.length < 6 || code.length > 32) return json(req, { ok: false });

  // 속도 제한 — IP 는 해시로만 센다(개인정보 최소화). 표가 죽어도 검증은 계속한다.
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const ipHash = (await sha256(ip)).slice(0, 32);
  const ws = new Date(Math.floor(Date.now() / (WINDOW_MIN * 60000)) * (WINDOW_MIN * 60000)).toISOString();
  try {
    const { data: row } = await sb.from("nm_auth_attempts")
      .select("attempts").eq("ip_hash", ipHash).eq("window_start", ws).maybeSingle();
    const n = (row?.attempts ?? 0) + 1;
    if (n > MAX_ATTEMPTS) return json(req, { error: "rate_limited", retryAfter: WINDOW_MIN * 60 }, 429);
    if (row) await sb.from("nm_auth_attempts").update({ attempts: n }).eq("ip_hash", ipHash).eq("window_start", ws);
    else await sb.from("nm_auth_attempts").insert({ ip_hash: ipHash, window_start: ws, attempts: 1 });
  } catch (_) { /* 속도 제한 실패는 무시 */ }

  const { data, error } = await sb.from("nm_codes").select("code,label,active").eq("code", code).maybeSingle();
  if (error) return json(req, { error: "lookup_failed" }, 503);
  if (!data || !data.active) return json(req, { ok: false });
  return json(req, { ok: true, label: data.label || "" });
});
