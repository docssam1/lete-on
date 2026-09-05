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

function responseHeaders(req: Request) {
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
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(req) });
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

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  const token = String(req.headers.get("x-fields-session") || "");
  if (!/^[a-f0-9]{64}$/u.test(token)) return json(req, { error: "session_required" }, 401);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = secretKey();
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);
  const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const tokenHash = await sha256(token);
    const { data: session, error: sessionError } = await service.from("fields_access_sessions")
      .select("student_name,expires_at").eq("token_hash", tokenHash).gt("expires_at", new Date().toISOString()).maybeSingle();
    if (sessionError || !session) return json(req, { error: "session_invalid" }, 401);
    const body = await req.json();
    const bookId = String(body?.bookId || "");
    if (!/^book-[0-9]{2}$/u.test(bookId)) return json(req, { error: "book_invalid" }, 400);
    const { data: book, error: bookError } = await service.from("golden_bell_answer_books")
      .select("payload,payload_sha256,updated_at").eq("book_id", bookId).maybeSingle();
    if (bookError || !book) return json(req, { error: "answer_book_unavailable" }, 404);
    await service.from("fields_access_sessions").update({ last_seen_at: new Date().toISOString() }).eq("token_hash", tokenHash);
    return json(req, { bookId, answers: book.payload, revision: book.payload_sha256, updatedAt: book.updated_at });
  } catch {
    return json(req, { error: "request_invalid" }, 400);
  }
});
