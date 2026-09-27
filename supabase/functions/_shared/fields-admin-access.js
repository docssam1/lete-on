const ADMIN_NAME = "DOCSSAM";
const ADMIN_PERMISSIONS = [
  "개념완성", "연산연습", "진단모의고사", "진단약점클리닉", "킬러문항",
  "실전모의고사1회", "실전모의고사2회", "실전모의고사3회",
  "실전모의고사4회", "실전모의고사5회", "실전모의고사6회",
  "파이널모의고사1회", "파이널모의고사2회", "파이널모의고사3회",
  "마무리점검", "자료실",
];

export class FieldsAccessError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function isFieldsAdminName(name) {
  return String(name || "").normalize("NFKC").replace(/\s+/gu, "").toUpperCase() === ADMIN_NAME;
}

async function hash(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function adminAccount(service, userId) {
  const { data, error } = await service.from("hs_accounts")
    .select("user_id,student,role,active").eq("user_id", userId).maybeSingle();
  if (error) throw new FieldsAccessError(503, "account_lookup_failed");
  if (!data?.active || data.role !== "admin" || !isFieldsAdminName(data.student)) {
    throw new FieldsAccessError(401, "session_invalid");
  }
  return { name: ADMIN_NAME, permissions: [...ADMIN_PERMISSIONS], type: "admin", adminUserId: data.user_id };
}

export async function authenticateFieldsAdmin(service, url, key, req, name, code, send = fetch, options = {}) {
  if (!isFieldsAdminName(name)) throw new FieldsAccessError(401, "credentials_invalid");
  const headers = { "Content-Type": "application/json", apikey: key };
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
  if (ip) headers["x-forwarded-for"] = ip.split(",")[0].trim().slice(0, 96);
  // Reuse the common credential check and rate limit; never duplicate its approval code.
  const response = await send(`${url}/functions/v1/hs-admin-session`, {
    method: "POST", headers,
    body: JSON.stringify({ action: "login", name, approvalCode: code, deviceToken: String(options.deviceToken || "") }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    const status = response.status === 429 ? 429 : response.status >= 500 ? 503 : 401;
    throw new FieldsAccessError(status, status === 429 ? "too_many_attempts" : status === 503 ? "admin_auth_unavailable" : "credentials_invalid");
  }
  const result = await response.json();
  const accessToken = result.session?.access_token;
  if (!accessToken) throw new FieldsAccessError(503, "admin_auth_unavailable");
  let retained = false;
  try {
    const { data, error } = await service.auth.getUser(accessToken);
    if (error || !data.user || data.user.app_metadata?.role !== "admin"
      || !isFieldsAdminName(data.user.app_metadata?.admin_id)) {
      throw new FieldsAccessError(401, "credentials_invalid");
    }
    const account = await adminAccount(service, data.user.id);
    if (options.retainSession) {
      if (!result.session.refresh_token) throw new FieldsAccessError(503, "admin_auth_unavailable");
      retained = true;
      return { ...account, session: result.session, deviceToken: result.deviceToken };
    }
    return account;
  } finally {
    // A full administrator login keeps the verified common session. Learning-only
    // sessions close their temporary login without revoking other devices.
    if (!retained) {
      const { error } = await service.auth.admin.signOut(accessToken, "local");
      if (result.deviceToken) {
        const { error: deviceError } = await service.from("hs_admin_devices")
          .delete().eq("token_hash", await hash(result.deviceToken));
        if (deviceError) throw new FieldsAccessError(503, "admin_session_cleanup_failed");
      }
      if (error) throw new FieldsAccessError(503, "admin_session_cleanup_failed");
    }
  }
}

export async function resolveFieldsSession(service, tokenHash) {
  const { data: session, error } = await service.from("fields_access_sessions")
    .select("student_name,admin_user_id,expires_at").eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString()).maybeSingle();
  if (error) throw new FieldsAccessError(503, "session_lookup_failed");
  if (!session || Boolean(session.student_name) === Boolean(session.admin_user_id)) {
    throw new FieldsAccessError(401, "session_invalid");
  }
  if (session.admin_user_id) {
    return { ...await adminAccount(service, session.admin_user_id), expiresAt: session.expires_at };
  }
  const { data: account, error: accountError } = await service.from("fields_access_accounts")
    .select("student_name,permissions,student_type,active").eq("student_name", session.student_name).maybeSingle();
  if (accountError) throw new FieldsAccessError(503, "account_lookup_failed");
  if (!account?.active) throw new FieldsAccessError(401, "session_invalid");
  return { name: account.student_name, permissions: account.permissions, type: account.student_type, expiresAt: session.expires_at };
}
