import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.3";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "http://127.0.0.1:4177",
  "http://localhost:4177"
]);
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
const EMAIL_DOMAIN = "auth.gfieldacademy.net";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PERMISSIONS = new Set(["hyperfocus", "hyperfocus-extra", "mock", "vip", "problem-bank"]);

function environmentKey(mapName: string, singleName: string, legacyName: string): string {
  const mapValue = Deno.env.get(mapName);
  if (mapValue) {
    try {
      const parsed = JSON.parse(mapValue) as Record<string, unknown>;
      if (typeof parsed.default === "string") return parsed.default;
    } catch (_) {}
  }
  return Deno.env.get(singleName) || Deno.env.get(legacyName) || "";
}

async function readJsonObject(
  request: Request,
  maximumBytes: number
): Promise<{ value?: Record<string, unknown>; error?: "too_large" | "invalid" }> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maximumBytes) return { error: "too_large" };
  if (!request.body) return { error: "invalid" };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        return { error: "too_large" };
      }
      chunks.push(value);
    }
  } catch (_) {
    return { error: "invalid" };
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.byteLength; });
  try {
    const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { value: parsed as Record<string, unknown> }
      : { error: "invalid" };
  } catch (_) {
    return { error: "invalid" };
  }
}

function responseHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  return {
    "access-control-allow-origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://lete-on.gfieldacademy.net",
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "vary": "Origin",
    "x-content-type-options": "nosniff"
  };
}

function json(request: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(request) });
}

function decodeClaims(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, "=")));
  } catch (_) {
    return null;
  }
}

function cleanName(value: unknown): string {
  return String(value || "").normalize("NFKC").trim();
}

function loginNameKey(value: string): string {
  return value.normalize("NFKC").replace(/\s+/gu, "").toLocaleLowerCase("ko-KR");
}

function randomChars(length: number): string {
  const result: string[] = [];
  const limit = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length;
  while (result.length < length) {
    const values = new Uint8Array(Math.max(16, length - result.length));
    crypto.getRandomValues(values);
    for (const value of values) {
      if (value >= limit) continue;
      result.push(CODE_ALPHABET[value % CODE_ALPHABET.length]);
      if (result.length === length) break;
    }
  }
  return result.join("");
}

function formatCode(body: string): string {
  return `GF-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}-${body.slice(16, 20)}`;
}

function normalizeCode(value: string): string {
  return value.toUpperCase().replace(/[\s-]+/gu, "");
}

async function derivedPassword(name: string, code: string): Promise<string> {
  const input = new TextEncoder().encode(`hf-login-v1\0${loginNameKey(name)}\0${normalizeCode(code)}`);
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", input));
  let binary = "";
  bytes.forEach(value => { binary += String.fromCharCode(value); });
  return `${btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")}Aa1!`;
}

async function uniqueHandle(service: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const handle = randomChars(4).toLowerCase();
    const { data, error } = await service.from("hf_students").select("id").eq("login_handle", handle).maybeSingle();
    if (error) throw error;
    if (!data) return handle;
  }
  throw new Error("handle_generation_failed");
}

async function setStudentAuthVersion(
  service: SupabaseClient,
  studentId: string,
  loginVersion: number,
  operationId: string,
  password?: string
): Promise<void> {
  const attributes: {
    password?: string;
    app_metadata: { hf_role: string; hf_login_version: number; hf_auth_change_id: string };
  } = {
    app_metadata: {
      hf_role: "student",
      hf_login_version: loginVersion,
      hf_auth_change_id: operationId
    }
  };
  if (password) attributes.password = password;
  const { error } = await service.auth.admin.updateUserById(studentId, attributes);
  if (error) throw error;
}

async function beginStudentAuthChange(
  service: SupabaseClient,
  studentId: string,
  expectedVersion: number,
  accountStatus: string | null = null
): Promise<{ operationId: string; pendingVersion: number } | null> {
  const operationId = crypto.randomUUID();
  const { data, error } = await service.rpc("hf_begin_student_auth_change", {
    p_student_id: studentId,
    p_expected_version: expectedVersion,
    p_operation_id: operationId,
    p_account_status: accountStatus
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : null;
  const pendingVersion = Number(row?.pending_login_version);
  return Number.isInteger(pendingVersion) && pendingVersion > expectedVersion
    ? { operationId, pendingVersion }
    : null;
}

async function authChangeReachedAuth(
  service: SupabaseClient,
  studentId: string,
  operationId: string,
  pendingVersion: number
): Promise<boolean> {
  const { data, error } = await service.auth.admin.getUserById(studentId);
  if (error || !data.user) throw error || new Error("auth_user_read_failed");
  return data.user.app_metadata?.hf_auth_change_id === operationId
    && Number(data.user.app_metadata?.hf_login_version) === pendingVersion;
}

function authErrorIsDefinitiveRejection(error: unknown): boolean {
  const status = Number((error as { status?: unknown } | null)?.status);
  return Number.isInteger(status)
    && status >= 400
    && status < 500
    && ![408, 409, 425, 429].includes(status);
}

async function cancelStudentAuthChange(
  service: SupabaseClient,
  studentId: string,
  operationId: string,
  pendingVersion: number
): Promise<void> {
  const { data, error } = await service.rpc("hf_cancel_student_auth_change", {
    p_student_id: studentId,
    p_operation_id: operationId,
    p_pending_version: pendingVersion
  });
  if (error || data !== true) throw error || new Error("auth_change_cancel_failed");
}

async function completeStudentAuthChange(
  service: SupabaseClient,
  studentId: string,
  operationId: string,
  pendingVersion: number
): Promise<void> {
  const { data, error } = await service.rpc("hf_complete_student_auth_change", {
    p_student_id: studentId,
    p_operation_id: operationId,
    p_pending_version: pendingVersion
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : null;
  if (Number(row?.new_login_version) !== pendingVersion) {
    throw new Error("auth_change_complete_failed");
  }
}

async function applyStudentAuthChange(
  service: SupabaseClient,
  studentId: string,
  expectedVersion: number,
  accountStatus: string | null,
  password?: string
): Promise<boolean> {
  const change = await beginStudentAuthChange(service, studentId, expectedVersion, accountStatus);
  if (!change) return false;
  try {
    await setStudentAuthVersion(
      service,
      studentId,
      change.pendingVersion,
      change.operationId,
      password
    );
  } catch (updateError) {
    const reachedAuth = await authChangeReachedAuth(
      service,
      studentId,
      change.operationId,
      change.pendingVersion
    );
    if (!reachedAuth && authErrorIsDefinitiveRejection(updateError)) {
      await cancelStudentAuthChange(
        service,
        studentId,
        change.operationId,
        change.pendingVersion
      );
    }
    if (!reachedAuth) throw updateError;
  }
  await completeStudentAuthChange(
    service,
    studentId,
    change.operationId,
    change.pendingVersion
  );
  return true;
}

Deno.serve(async request => {
  const origin = request.headers.get("origin") || "";
  if (request.method === "OPTIONS") {
    return ALLOWED_ORIGINS.has(origin)
      ? new Response("ok", { headers: responseHeaders(request) })
      : json(request, 403, { error: "origin_not_allowed" });
  }
  if (request.method !== "POST" || (origin && !ALLOWED_ORIGINS.has(origin))) {
    return json(request, 403, { error: "request_not_allowed" });
  }
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = environmentKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY");
  const secretKey = environmentKey("SUPABASE_SECRET_KEYS", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
  if (!token || !supabaseUrl || !publishableKey || !secretKey) {
    return json(request, 401, { error: "authentication_required" });
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: authorization } }
  });
  const service = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  const claims = decodeClaims(token);
  const metadata = claims?.app_metadata as Record<string, unknown> | undefined;
  if (
    authError || !authData.user || authData.user.is_anonymous
    || metadata?.hf_role !== "admin"
    || authData.user.app_metadata?.hf_role !== "admin"
    || claims?.aal !== "aal2"
  ) {
    return json(request, 403, { error: "admin_mfa_required" });
  }
  const { data: staff, error: staffError } = await userClient
    .from("hf_admin_accounts")
    .select("role,account_status,authorization_changed_at")
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (staffError || staff?.role !== "admin" || staff.account_status !== "active") {
    return json(request, 403, { error: "admin_mfa_required" });
  }

  const parsedPayload = await readJsonObject(request, 16384);
  if (parsedPayload.error === "too_large") return json(request, 413, { error: "request_too_large" });
  if (!parsedPayload.value) return json(request, 400, { error: "invalid_request" });
  const payload = parsedPayload.value;
  const action = String(payload.action || "");

  try {
    if (action === "list") {
      const { data: rows, error } = await service
        .from("hf_students")
        .select("id,display_name,student_type,account_status,created_at,hf_entitlements(permission_key,starts_at,expires_at,revoked_at)")
        .order("display_name", { ascending: true });
      if (error) throw error;
      const now = Date.now();
      const students = (rows || []).map(row => ({
        id: row.id,
        name: row.display_name,
        type: row.student_type,
        status: row.account_status,
        createdAt: row.created_at,
        permissions: (row.hf_entitlements || []).filter((entry: Record<string, unknown>) => {
          const starts = Date.parse(String(entry.starts_at || ""));
          const expires = entry.expires_at ? Date.parse(String(entry.expires_at)) : null;
          return !entry.revoked_at && starts <= now && (expires === null || expires > now);
        }).map((entry: Record<string, unknown>) => entry.permission_key)
      }));
      return json(request, 200, { students });
    }

    if (action === "create") {
      const name = cleanName(payload.name);
      const studentType = String(payload.studentType || "");
      if (
        name.length < 1 || name.length > 80 || /[\u0000-\u001f\u007f]/u.test(name)
        || !["internal", "online"].includes(studentType)
      ) return json(request, 400, { error: "invalid_student" });

      const handle = await uniqueHandle(service);
      const body = `${handle.toUpperCase()}${randomChars(16)}`;
      const oneTimeApprovalCode = formatCode(body);
      const email = `hf.${handle}@${EMAIL_DOMAIN}`;
      const password = await derivedPassword(name, oneTimeApprovalCode);
      const { data: created, error: createError } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { hf_role: "student", hf_login_version: 1 }
      });
      if (createError || !created.user) throw createError || new Error("auth_create_failed");

      const { error: profileError } = await service.from("hf_students").insert({
        id: created.user.id,
        login_handle: handle,
        display_name: name,
        login_name_key: loginNameKey(name),
        login_version: 1,
        student_type: studentType,
        account_status: "active"
      });
      if (profileError) {
        await service.auth.admin.deleteUser(created.user.id, false);
        throw profileError;
      }
      const { error: entitlementError } = await service.from("hf_entitlements").insert({
        student_id: created.user.id,
        permission_key: "hyperfocus",
        granted_by: authData.user.id
      });
      if (entitlementError) {
        await service.from("hf_students").delete().eq("id", created.user.id);
        await service.auth.admin.deleteUser(created.user.id, false);
        throw entitlementError;
      }
      return json(request, 200, { studentId: created.user.id, oneTimeApprovalCode });
    }

    const studentId = String(payload.studentId || "");
    if (!UUID_RE.test(studentId)) return json(request, 400, { error: "invalid_student" });

    if (action === "rotate_code") {
      const { data: profile, error } = await service
        .from("hf_students")
        .select("display_name,login_handle,login_version")
        .eq("id", studentId)
        .maybeSingle();
      if (error || !profile) return json(request, 404, { error: "student_not_found" });
      if (String(profile.login_handle).length !== 4) throw new Error("invalid_login_handle");
      const body = `${String(profile.login_handle).toUpperCase()}${randomChars(16)}`;
      const oneTimeApprovalCode = formatCode(body);
      const changed = await applyStudentAuthChange(
        service,
        studentId,
        Number(profile.login_version),
        null,
        await derivedPassword(profile.display_name, oneTimeApprovalCode)
      );
      if (!changed) return json(request, 409, { error: "student_changed_retry" });
      return json(request, 200, { oneTimeApprovalCode });
    }

    if (action === "set_status") {
      const status = String(payload.status || "");
      if (!["active", "suspended", "archived"].includes(status)) return json(request, 400, { error: "invalid_status" });
      const { data: profile, error } = await service
        .from("hf_students")
        .select("login_version")
        .eq("id", studentId)
        .maybeSingle();
      if (error || !profile) return json(request, 404, { error: "student_not_found" });
      const changed = await applyStudentAuthChange(
        service,
        studentId,
        Number(profile.login_version),
        status
      );
      if (!changed) return json(request, 409, { error: "student_changed_retry" });
      return json(request, 200, { ok: true });
    }

    if (action === "set_entitlement") {
      const permissionKey = String(payload.permissionKey || "");
      if (!PERMISSIONS.has(permissionKey) || typeof payload.enabled !== "boolean") {
        return json(request, 400, { error: "invalid_permission" });
      }
      const value = payload.enabled;
      const { data: changed, error } = await service.rpc("hf_set_student_entitlement", {
        p_student_id: studentId,
        p_permission_key: permissionKey,
        p_enabled: value,
        p_granted_by: authData.user.id
      });
      if (error || changed !== true) throw error || new Error("entitlement_change_failed");
      return json(request, 200, { ok: true });
    }

    return json(request, 400, { error: "invalid_action" });
  } catch (_) {
    return json(request, 500, { error: "operation_failed" });
  }
});
