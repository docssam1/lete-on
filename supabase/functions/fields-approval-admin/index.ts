import "jsr:@supabase/functions-js@2.5.0/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.112.4";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://127.0.0.1:8793",
  "http://127.0.0.1:8794",
  "http://localhost:8793",
  "http://localhost:8794",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
]);

const PRODUCT_IDS = new Set([
  "개념완성",
  "연산연습",
  "진단모의고사",
  "진단약점클리닉",
  "킬러문항",
  "실전모의고사1회",
  "실전모의고사2회",
  "실전모의고사3회",
  "실전모의고사4회",
  "실전모의고사5회",
  "실전모의고사6회",
  "파이널모의고사1회",
  "파이널모의고사2회",
  "파이널모의고사3회",
  "마무리점검",
]);

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Pragma": "no-cache",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
  if (ALLOWED_ORIGINS.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") || "";
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function normalizeName(value: unknown): string {
  return String(value ?? "").normalize("NFKC").trim().replace(/\s+/gu, "");
}

function validName(value: string): boolean {
  return value.length >= 1 && value.length <= 30 && !/[\u0000-\u001f\u007f]/u.test(value);
}

function normalizeType(value: unknown): "internal" | "online" {
  return value === "online" ? "online" : "internal";
}

function normalizePermissions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map(String).filter((item) => PRODUCT_IDS.has(item))));
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function approvalCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXY23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let value = "GF";
  for (let i = 0; i < 6; i++) value += alphabet[bytes[i] % alphabet.length];
  return value;
}

const service = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function requireAdmin(req: Request) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new HttpError(401, "관리자 로그인이 필요합니다.");
  const { data, error } = await service.auth.getUser(token);
  const role = String(data.user?.app_metadata?.role || "");
  if (error || !data.user || !["admin", "teacher"].includes(role) || data.user.app_metadata?.admin_id !== "DOCSSAM") {
    throw new HttpError(403, "관리자 권한이 없습니다.");
  }
  const { data: account, error: accountError } = await service.from("hs_accounts")
    .select("user_id,role,active").eq("user_id", data.user.id).maybeSingle();
  if (accountError || !account?.active || !["admin", "teacher"].includes(account.role)) {
    throw new HttpError(403, "관리자 권한이 없습니다.");
  }
  return data.user;
}

async function listAccounts() {
  const { data, error } = await service.from("fields_access_accounts")
    .select("student_name,permissions,student_type,active,updated_at")
    .order("student_name");
  if (error) throw new Error(error.message);
  return { accounts: data || [] };
}

async function uniqueCode(): Promise<{ code: string; hash: string }> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = approvalCode();
    const hash = await sha256(code);
    const { count, error } = await service.from("fields_access_accounts")
      .select("student_name", { count: "exact", head: true }).eq("code_hash", hash);
    if (error) throw new Error(error.message);
    if (!count) return { code, hash };
  }
  throw new Error("승인번호를 만들지 못했습니다. 다시 시도해 주세요.");
}

async function issueOne(item: Record<string, unknown>) {
  const student = normalizeName(item.student);
  if (!validName(student) || student.toLocaleLowerCase("ko-KR") === "docssam") {
    throw new HttpError(400, "학생 이름을 확인해 주세요.");
  }
  const { count, error: lookupError } = await service.from("fields_access_accounts")
    .select("student_name", { count: "exact", head: true }).eq("student_name", student);
  if (lookupError) throw new Error(lookupError.message);
  if (count) throw new HttpError(409, "이미 등록된 학생입니다.");
  const issued = await uniqueCode();
  const type = normalizeType(item.studentType);
  const permissions = normalizePermissions(item.permissions);
  const { error } = await service.from("fields_access_accounts").insert({
    student_name: student,
    code_hash: issued.hash,
    permissions,
    student_type: type,
    active: true,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return { student, approvalCode: issued.code, permissions, studentType: type, active: true };
}

async function resetCode(rawName: unknown) {
  const student = normalizeName(rawName);
  if (!validName(student)) throw new HttpError(400, "학생 이름을 확인해 주세요.");
  const issued = await uniqueCode();
  const { data, error } = await service.from("fields_access_accounts")
    .update({ code_hash: issued.hash, active: true, updated_at: new Date().toISOString() })
    .eq("student_name", student).select("student_name").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new HttpError(404, "학생 승인을 찾지 못했습니다.");
  await service.from("fields_access_sessions").delete().eq("student_name", student);
  return { student, approvalCode: issued.code };
}

Deno.serve(async (req: Request) => {
  if (!allowedOrigin(req)) return json(req, { error: "origin_not_allowed" }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "method_not_allowed" }, 405);

  try {
    await requireAdmin(req);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const action = String(body.action || "");

    if (action === "list") return json(req, await listAccounts());
    if (action === "issue") return json(req, await issueOne(body));
    if (action === "bulkIssue") {
      const students = Array.isArray(body.students) ? body.students.slice(0, 60) : [];
      if (!students.length) throw new HttpError(400, "학생 명단이 없습니다.");
      const issued = [];
      const failed = [];
      for (const item of students) {
        try {
          issued.push(await issueOne((item || {}) as Record<string, unknown>));
        } catch (error) {
          failed.push({
            student: normalizeName((item as Record<string, unknown>)?.student),
            message: error instanceof Error ? error.message : "등록 실패",
          });
        }
      }
      return json(req, { issued, failed }, failed.length ? 207 : 200);
    }
    if (action === "resetCode") return json(req, await resetCode(body.student));
    if (action === "setAccess") {
      const student = normalizeName(body.student);
      if (!validName(student)) throw new HttpError(400, "학생 이름을 확인해 주세요.");
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (Array.isArray(body.permissions)) patch.permissions = normalizePermissions(body.permissions);
      if (body.studentType === "internal" || body.studentType === "online") patch.student_type = body.studentType;
      if (typeof body.active === "boolean") patch.active = body.active;
      const { data, error } = await service.from("fields_access_accounts")
        .update(patch).eq("student_name", student)
        .select("student_name,permissions,student_type,active,updated_at").maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new HttpError(404, "학생 승인을 찾지 못했습니다.");
      if (body.active === false) await service.from("fields_access_sessions").delete().eq("student_name", student);
      return json(req, { account: data });
    }
    throw new HttpError(400, "지원하지 않는 작업입니다.");
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = String(error instanceof Error ? error.message : error).slice(0, 240);
    return json(req, { error: message }, status);
  }
});
