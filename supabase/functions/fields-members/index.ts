import { createClient } from "npm:@supabase/supabase-js@2";
import { FieldsAccessError, resolveFieldsSession } from "../_shared/fields-admin-access.js";
import { FIELDS_BOOKS, TRIAL_DAYS, membershipSummary } from "../_shared/fields-membership.js";

// 지필드 사고력 수학 스스로 공부 — 회원 가입·승인번호·요청·관리(원장 2026-10-29).
//  학부모: 이메일 인증(Supabase Auth 인증번호 메일, Authorization: Bearer <access token>) 뒤
//    register  — 아이 이름·보호자 전화·아이 전화(선택)·유치 나이/초등 학년·개인정보 동의·시작 진도(선택) → 체험 14일 + 승인번호
//    mine      — 이 이메일로 가입한 아이들
//    reissue   — 승인번호를 잊었을 때 새로 받기(옛 번호와 로그인은 끊는다)
//  학생(이름+승인번호로 로그인한 세션, x-fields-session):
//    status    — 지금 상태(체험·정규·열린 권)
//    request   — 정규회원 승인 요청(regular) · 다음 권 추가 요청(book). 요청은 카톡으로 하고 여기엔 표시만 남긴다
//    start     — 시작 진도 바꾸기(학부모)
//  관리자(DOCSSAM 세션): admin-list · admin-update(승인·체험 연장·멈춤·권 더 열기·시작 진도·메모) · admin-reissue
// 승인번호는 해시로만 둔다(fields_access_accounts.code_hash). 응답에만 한 번 보이고 저장소·기록에 남기지 않는다.
const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://127.0.0.1:8767", "http://localhost:8767",
  "http://127.0.0.1:8793", "http://localhost:8793",
]);
const CONSENT_VERSION = "fields-2026-10-29-v1";

function headers(req: Request) {
  const value = new Headers({
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-fields-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) value.set("Access-Control-Allow-Origin", origin);
  return value;
}
const json = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: headers(req) });
class HttpError extends Error { status: number; constructor(status: number, message: string) { super(message); this.status = status; } }

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}
function approvalCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXY23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let value = "GF";
  for (let i = 0; i < 6; i += 1) value += alphabet[bytes[i] % alphabet.length];
  return value;
}
const cleanName = (v: unknown) => String(v ?? "").normalize("NFKC").replace(/\s+/gu, "").trim();
const cleanPhone = (v: unknown) => String(v ?? "").replace(/[^\d]/g, "");
const validPhone = (p: string) => /^01\d{8,9}$/.test(p);

async function newCode(service: any) {
  for (let i = 0; i < 8; i += 1) {
    const code = approvalCode(), hash = await sha256(code);
    const { count, error } = await service.from("fields_access_accounts").select("student_name", { count: "exact", head: true }).eq("code_hash", hash);
    if (error) throw new Error(error.message);
    if (!count) return { code, hash };
  }
  throw new HttpError(503, "code_failed");
}
function cleanStart(raw: any) {
  const book = FIELDS_BOOKS.includes(String(raw?.book)) ? String(raw.book) : "book-01";
  const unit = Math.min(Math.max(Number(raw?.unit) || 0, 0), 3);
  const part = Math.min(Math.max(Number(raw?.part) || 1, 1), 3);
  return { book, unit, part };
}
// 학부모 화면에 보여 줄 회원 한 명(관리자 목록에는 연락처까지)
function view(m: any, admin = false) {
  const base = { child: m.child_name, level: m.level, age: m.age, grade: m.grade, createdAt: m.created_at, ...membershipSummary(m) };
  return admin ? { ...base, email: m.email, guardianPhone: m.guardian_phone, childPhone: m.child_phone, memo: m.memo || "" } : base;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !key) return json(req, { error: "server_not_ready" }, 503);
  const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const members = service.from("fields_members");

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "");

    // ── 학부모(이메일 인증) ──
    if (["register", "mine", "reissue"].includes(action)) {
      const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
      if (!bearer) throw new HttpError(401, "email_required");
      const { data, error } = await service.auth.getUser(bearer);
      const email = String(data?.user?.email || "").toLowerCase();
      if (error || !email || !data.user?.email_confirmed_at && !data.user?.confirmed_at) throw new HttpError(401, "email_required");

      if (action === "mine") {
        const { data: rows, error: e } = await members.select("*").eq("email", email).order("created_at");
        if (e) throw new Error(e.message);
        return json(req, { email, children: (rows || []).map((m: any) => view(m)) });
      }
      if (action === "reissue") {
        const child = cleanName(body.child);
        const { data: m } = await members.select("child_name,email").eq("child_name", child).maybeSingle();
        if (!m || m.email !== email) throw new HttpError(404, "child_not_found");
        const issued = await newCode(service);
        const { error: e } = await service.from("fields_access_accounts").update({ code_hash: issued.hash, active: true, updated_at: new Date().toISOString() }).eq("student_name", child);
        if (e) throw new Error(e.message);
        await service.from("fields_access_sessions").delete().eq("student_name", child);
        return json(req, { child, approvalCode: issued.code });
      }
      // register
      const child = cleanName(body.child);
      if (child.length < 1 || child.length > 20 || child.toUpperCase() === "DOCSSAM" || child.toUpperCase() === "DEMO") throw new HttpError(400, "child_invalid");
      const guardianPhone = cleanPhone(body.guardianPhone), childPhone = cleanPhone(body.childPhone);
      if (!validPhone(guardianPhone)) throw new HttpError(400, "phone_invalid");
      if (childPhone && !validPhone(childPhone)) throw new HttpError(400, "child_phone_invalid");
      const level = body.level === "kinder" ? "kinder" : body.level === "elementary" ? "elementary" : "";
      const age = level === "kinder" ? Number(body.age) : null, grade = level === "elementary" ? Number(body.grade) : null;
      if (!level || (level === "kinder" && !(age! >= 3 && age! <= 8)) || (level === "elementary" && !(grade! >= 1 && grade! <= 6))) throw new HttpError(400, "level_invalid");
      if (body?.consent?.privacy !== true || body?.consent?.guardian !== true) throw new HttpError(400, "consent_required");
      const { count, error: ce } = await service.from("fields_access_accounts").select("student_name", { count: "exact", head: true }).eq("student_name", child);
      if (ce) throw new Error(ce.message);
      if (count) throw new HttpError(409, "name_taken");
      const issued = await newCode(service);
      const now = new Date();
      const { error: ae } = await service.from("fields_access_accounts").insert({ student_name: child, code_hash: issued.hash, permissions: [], student_type: "online", active: true, updated_at: now.toISOString() });
      if (ae) throw new Error(ae.message);
      const start = cleanStart(body.start);
      const { data: m, error: me } = await members.insert({
        child_name: child, email, auth_user_id: data.user.id, guardian_phone: guardianPhone, child_phone: childPhone || null,
        level, age, grade, consent_version: CONSENT_VERSION, consented_at: now.toISOString(),
        status: "trial", trial_until: new Date(now.getTime() + TRIAL_DAYS * 86400000).toISOString(),
        start_book: start.book, start_unit: start.unit, start_part: start.part, start_set_by: body.start ? "parent" : null,
      }).select("*").single();
      if (me) { await service.from("fields_access_accounts").delete().eq("student_name", child); throw new Error(me.message); }
      return json(req, { child, approvalCode: issued.code, member: view(m) });
    }

    // ── 로그인 세션(학생·관리자) ──
    const token = String(req.headers.get("x-fields-session") || "");
    if (!/^[a-f0-9]{64}$/u.test(token)) throw new HttpError(401, "session_required");
    const account = await resolveFieldsSession(service, await sha256(token));
    const admin = account.type === "admin";

    if (action === "status" || action === "request" || action === "start") {
      if (admin) throw new HttpError(400, "student_only");
      const { data: m, error } = await members.select("*").eq("child_name", account.name).maybeSingle();
      if (error) throw new Error(error.message);
      if (!m) return json(req, { legacy: true, name: account.name });   // 원장이 직접 만든 옛 승인번호 — 막지 않는다
      if (action === "request") {
        const field = body.kind === "book" ? "book_requested_at" : "approval_requested_at";
        const { data: u, error: e } = await members.update({ [field]: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", m.id).select("*").single();
        if (e) throw new Error(e.message);
        return json(req, { member: view(u) });
      }
      if (action === "start") {
        const s = cleanStart(body.start);
        const { data: u, error: e } = await members.update({ start_book: s.book, start_unit: s.unit, start_part: s.part, start_set_by: "parent", updated_at: new Date().toISOString() }).eq("id", m.id).select("*").single();
        if (e) throw new Error(e.message);
        return json(req, { member: view(u) });
      }
      return json(req, { member: view(m) });
    }

    if (!admin) throw new HttpError(403, "admin_required");
    if (action === "admin-list") {
      const { data: rows, error } = await members.select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw new Error(error.message);
      return json(req, { members: (rows || []).map((m: any) => view(m, true)) });
    }
    const child = cleanName(body.child);
    const { data: m, error: le } = await members.select("*").eq("child_name", child).maybeSingle();
    if (le) throw new Error(le.message);
    if (!m) throw new HttpError(404, "child_not_found");
    if (action === "admin-reissue") {
      const issued = await newCode(service);
      const { error } = await service.from("fields_access_accounts").update({ code_hash: issued.hash, active: true, updated_at: new Date().toISOString() }).eq("student_name", child);
      if (error) throw new Error(error.message);
      await service.from("fields_access_sessions").delete().eq("student_name", child);
      return json(req, { child, approvalCode: issued.code });
    }
    if (action === "admin-update") {
      const now = new Date().toISOString();
      const patch: Record<string, unknown> = { updated_at: now };
      if (body.op === "approve") Object.assign(patch, { status: "approved", approved_at: m.approved_at || now, approval_requested_at: null });
      else if (body.op === "trial") Object.assign(patch, { status: "trial", approved_at: null, trial_until: new Date(Math.max(Date.now(), new Date(m.trial_until).getTime()) + Math.min(Math.max(Number(body.days) || 14, 1), 90) * 86400000).toISOString() });
      else if (body.op === "pause") patch.status = "paused";
      else if (body.op === "resume") patch.status = m.approved_at ? "approved" : "trial";
      else if (body.op === "grant-book") Object.assign(patch, { extra_books: (m.extra_books || 0) + 1, book_requested_at: null });
      else if (body.op === "take-book") patch.extra_books = Math.max(0, (m.extra_books || 0) - 1);
      else if (body.op === "start") { const s = cleanStart(body.start); Object.assign(patch, { start_book: s.book, start_unit: s.unit, start_part: s.part, start_set_by: "admin" }); }
      else if (body.op === "memo") patch.memo = String(body.memo || "").slice(0, 200);
      else throw new HttpError(400, "op_invalid");
      const { data: u, error } = await members.update(patch).eq("id", m.id).select("*").single();
      if (error) throw new Error(error.message);
      if (body.op === "pause") await service.from("fields_access_sessions").delete().eq("student_name", child);
      return json(req, { member: view(u, true) });
    }
    throw new HttpError(400, "action_invalid");
  } catch (error) {
    if (error instanceof HttpError || error instanceof FieldsAccessError) return json(req, { error: error.message }, (error as any).status);
    console.error("fields_members_failed", error instanceof Error ? error.message : error);
    return json(req, { error: "request_failed" }, 500);
  }
});
