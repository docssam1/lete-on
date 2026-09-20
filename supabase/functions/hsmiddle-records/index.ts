import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const PRODUCTION_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
]);
const EXAMS = new Set(["diagnostic", "mock-1", "mock-2", "mock-3", "final"]);
const SESSION_HOURS = 12;

class HttpError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function originAllowed(origin: string) {
  return !origin || PRODUCTION_ORIGINS.has(origin) || /^http:\/\/(127\.0\.0\.1|localhost):\d+$/u.test(origin);
}

function responseHeaders(req: Request) {
  const headers = new Headers({
    "Access-Control-Allow-Headers": "apikey, content-type, x-hsm-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Pragma": "no-cache",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (originAllowed(origin) && origin) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
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
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function normalizeName(value: unknown) {
  return String(value ?? "").normalize("NFKC").trim();
}

function normalizeCode(value: unknown) {
  return String(value ?? "").normalize("NFKC").trim().toUpperCase();
}

function validName(name: string) {
  return name.length >= 1 && name.length <= 80 && !/[\u0000-\u001f\u007f]/u.test(name);
}

function validPermissions(value: unknown): string[] {
  if (!Array.isArray(value)) throw new HttpError(400, "permissions_invalid");
  const permissions = Array.from(new Set(value.map(item => String(item)).filter(item => EXAMS.has(item))));
  if (!permissions.length) throw new HttpError(400, "permissions_invalid");
  return permissions;
}

function validRound(value: unknown) {
  const round = String(value ?? "").trim();
  if (!EXAMS.has(round)) throw new HttpError(400, "round_invalid");
  return round;
}

function validAttemptRecord(value: unknown, round: string) {
  const record = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const score = Number(record.score);
  const correct = Number(record.correct);
  const answered = Number(record.answered);
  const states = record.states;
  if (!Number.isFinite(score) || score < 0 || score > 100) throw new HttpError(400, "score_invalid");
  if (!Number.isInteger(correct) || !Number.isInteger(answered) || correct < 0 || answered < 0 || correct > answered || answered > 40) {
    throw new HttpError(400, "counts_invalid");
  }
  if (Math.abs(score - correct * 2.5) > 0.001) throw new HttpError(400, "score_mismatch");
  if (!states || typeof states !== "object" || Array.isArray(states)) throw new HttpError(400, "states_invalid");
  const entries = Object.entries(states as Record<string, unknown>);
  if (entries.length > 40 || entries.some(([key, item]) => !/^([1-9]|[1-3][0-9]|40)$/u.test(key) || !["o", "x", "manual", null].includes(item as string | null))) {
    throw new HttpError(400, "states_invalid");
  }
  if (round !== "diagnostic" && (entries.length !== 40 || entries.some(([, item]) => item === null))) {
    throw new HttpError(400, "attempt_incomplete");
  }
  const countedAnswered = entries.filter(([, item]) => item === "o" || item === "x").length;
  const countedCorrect = entries.filter(([, item]) => item === "o").length;
  if (answered !== countedAnswered || correct !== countedCorrect) throw new HttpError(400, "states_mismatch");
  return { score, correct, answered, states };
}

const url = Deno.env.get("SUPABASE_URL") || "";
const key = secretKey();
const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function consumeLoginLimit(req: Request) {
  const forwarded = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  const ip = forwarded.split(",")[0].trim().slice(0, 96);
  const { data, error } = await service.rpc("consume_hs_rate_limit", {
    p_key_hash: await sha256(`hsmiddle-login:${ip}`),
    p_limit: 12,
    p_window_seconds: 600,
  });
  if (error) throw new HttpError(503, "auth_unavailable");
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.allowed) throw new HttpError(429, "too_many_attempts");
}

async function accountFor(name: string) {
  const { data, error } = await service.from("hsm_access_accounts")
    .select("student_name,permissions,is_admin,active")
    .eq("student_name", name)
    .maybeSingle();
  if (error) throw new HttpError(503, "account_lookup_failed");
  return data;
}

async function ensureStartedAt(name: string) {
  const { data, error } = await service.from("hsm_students").select("started_at").eq("name", name).maybeSingle();
  if (error) throw new HttpError(503, "start_lookup_failed");
  if (data?.started_at) return data.started_at;
  const { data: inserted, error: insertError } = await service.from("hsm_students")
    .insert({ name }).select("started_at").single();
  if (!insertError && inserted?.started_at) return inserted.started_at;
  const { data: raced, error: racedError } = await service.from("hsm_students").select("started_at").eq("name", name).maybeSingle();
  if (racedError || !raced?.started_at) throw new HttpError(503, "start_create_failed");
  return raced.started_at;
}

async function login(req: Request, body: Record<string, unknown>) {
  await consumeLoginLimit(req);
  const name = normalizeName(body.name);
  const code = normalizeCode(body.code);
  if (!validName(name) || code.length < 6 || code.length > 64) throw new HttpError(401, "credentials_invalid");
  const { data: authenticated, error: authError } = await service.rpc("hsm_authenticate", { p_name: name, p_code: code });
  if (authError) throw new HttpError(503, "account_lookup_failed");
  const account = Array.isArray(authenticated) ? authenticated[0] : authenticated;
  if (!account) throw new HttpError(401, "credentials_invalid");
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();
  const { error } = await service.from("hsm_access_sessions").insert({
    token_hash: await sha256(token),
    student_name: account.student_name,
    expires_at: expiresAt,
  });
  if (error) throw new HttpError(503, "session_create_failed");
  const startedAt = account.is_admin ? null : await ensureStartedAt(account.student_name);
  return { ok: true, token, expiresAt, startedAt, name: account.student_name, access: account.permissions, admin: account.is_admin };
}

async function requireSession(req: Request) {
  const token = String(req.headers.get("x-hsm-session") || "");
  if (!/^[a-f0-9]{64}$/u.test(token)) throw new HttpError(401, "session_required");
  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const { data: session, error } = await service.from("hsm_access_sessions")
    .select("student_name,expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", now)
    .maybeSingle();
  if (error || !session) throw new HttpError(401, "session_invalid");
  const account = await accountFor(session.student_name);
  if (!account?.active) throw new HttpError(401, "session_invalid");
  await service.from("hsm_access_sessions").update({ last_seen_at: now }).eq("token_hash", tokenHash);
  return { tokenHash, expiresAt: session.expires_at, account };
}

function requirePermission(session: Awaited<ReturnType<typeof requireSession>>, round: string) {
  const permissions = Array.isArray(session.account.permissions) ? session.account.permissions.map(String) : [];
  if (!permissions.includes(round) && !session.account.is_admin) throw new HttpError(403, "permission_denied");
}

async function listAttempts(session: Awaited<ReturnType<typeof requireSession>>, round: string) {
  requirePermission(session, round);
  const { data, error } = await service.from("hsm_attempts")
    .select("attempt,score,correct,answered,states,created_at")
    .eq("student", session.account.student_name)
    .eq("round", round)
    .order("attempt", { ascending: true });
  if (error) throw new HttpError(503, "attempt_lookup_failed");
  return data || [];
}

async function addAttempt(session: Awaited<ReturnType<typeof requireSession>>, round: string, rawRecord: unknown) {
  requirePermission(session, round);
  const record = validAttemptRecord(rawRecord, round);
  const sortedStates = Object.fromEntries(Object.entries(record.states as Record<string, unknown>).sort((left, right) => Number(left[0]) - Number(right[0])));
  const clientId = await sha256(JSON.stringify({ round, score: record.score, correct: record.correct, answered: record.answered, states: sortedStates }));
  const { data: duplicate, error: duplicateError } = await service.from("hsm_attempts")
    .select("attempt").eq("student", session.account.student_name).eq("round", round).eq("client_id", clientId).maybeSingle();
  if (duplicateError) throw new HttpError(503, "attempt_lookup_failed");
  if (duplicate) return { ok: true, attempt: duplicate.attempt, duplicate: true };
  const existing = await listAttempts(session, round);
  if (existing.length >= 3) throw new HttpError(409, "attempt_limit");
  const attempt = existing.reduce((max, row) => Math.max(max, Number(row.attempt) || 0), 0) + 1;
  const { data, error } = await service.from("hsm_attempts").insert({
    student: session.account.student_name,
    round,
    attempt,
    client_id: clientId,
    ...record,
  }).select("attempt").single();
  if (error?.code === "23505" || error?.code === "23514") throw new HttpError(409, "attempt_limit");
  if (error || !data) throw new HttpError(503, "attempt_save_failed");
  return { ok: true, attempt: data.attempt };
}

async function adminList(session: Awaited<ReturnType<typeof requireSession>>) {
  if (!session.account.is_admin) throw new HttpError(403, "admin_required");
  const { data, error } = await service.from("hsm_access_accounts")
    .select("student_name,permissions,is_admin,active,updated_at")
    .order("student_name", { ascending: true });
  if (error) throw new HttpError(503, "admin_list_failed");
  return data || [];
}

async function adminUpsert(session: Awaited<ReturnType<typeof requireSession>>, body: Record<string, unknown>) {
  if (!session.account.is_admin) throw new HttpError(403, "admin_required");
  const name = normalizeName(body.name);
  const code = normalizeCode(body.code);
  const permissions = validPermissions(body.permissions);
  if (!validName(name)) throw new HttpError(400, "name_invalid");
  const current = await accountFor(name);
  if (!current && (code.length < 6 || code.length > 64)) throw new HttpError(400, "code_required");
  if (current?.is_admin && name !== session.account.student_name) throw new HttpError(403, "admin_account_protected");
  if (code && (code.length < 6 || code.length > 64)) throw new HttpError(400, "code_invalid");
  const { data, error } = await service.rpc("hsm_upsert_access_account", {
    p_name: name,
    p_code: code,
    p_permissions: permissions,
    p_is_admin: Boolean(current?.is_admin),
  });
  const saved = Array.isArray(data) ? data[0] : data;
  if (error || !saved) throw new HttpError(503, "admin_save_failed");
  return saved;
}

async function adminDeactivate(session: Awaited<ReturnType<typeof requireSession>>, body: Record<string, unknown>) {
  if (!session.account.is_admin) throw new HttpError(403, "admin_required");
  const name = normalizeName(body.name);
  if (!validName(name) || name === session.account.student_name) throw new HttpError(400, "account_protected");
  const { data, error } = await service.from("hsm_access_accounts")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("student_name", name)
    .eq("is_admin", false)
    .select("student_name").maybeSingle();
  if (error || !data) throw new HttpError(404, "account_not_found");
  await service.from("hsm_access_sessions").delete().eq("student_name", name);
  return { ok: true };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (!originAllowed(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);

  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const action = String(body.action || "");
    if (action === "login") return json(req, await login(req, body));

    const session = await requireSession(req);
    if (action === "logout") {
      await service.from("hsm_access_sessions").delete().eq("token_hash", session.tokenHash);
      return json(req, { ok: true });
    }
    if (action === "session") {
      const startedAt = session.account.is_admin ? null : await ensureStartedAt(session.account.student_name);
      return json(req, { ok: true, name: session.account.student_name, access: session.account.permissions, admin: session.account.is_admin, expiresAt: session.expiresAt, startedAt });
    }
    if (action === "getStart" || action === "markStart") return json(req, { startedAt: await ensureStartedAt(session.account.student_name) });
    if (action === "listAttempts") return json(req, { attempts: await listAttempts(session, validRound(body.round)) });
    if (action === "addAttempt") return json(req, await addAttempt(session, validRound(body.round), body.record));
    if (action === "allAttempts") {
      if (!session.account.is_admin) throw new HttpError(403, "admin_required");
      const { data, error } = await service.from("hsm_attempts")
        .select("student,round,attempt,score,correct,answered,states,created_at")
        .order("created_at", { ascending: false });
      if (error) throw new HttpError(503, "attempt_lookup_failed");
      return json(req, { attempts: data || [] });
    }
    if (action === "adminList") return json(req, { accounts: await adminList(session) });
    if (action === "adminUpsert") return json(req, { account: await adminUpsert(session, body) });
    if (action === "adminDeactivate") return json(req, await adminDeactivate(session, body));
    throw new HttpError(400, "action_invalid");
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const code = error instanceof HttpError ? error.code : "internal_error";
    return json(req, { error: code }, status);
  }
});
