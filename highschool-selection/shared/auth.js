(function (root) {
  "use strict";
  const SESSION_KEY = "highselect-session-v1";
  const CLOUD_SESSION_KEY = "highselect-cloud-session-v1";
  const DEVICE_KEY = "highselect-admin-device-v1";
  const MAX_AGE_MS = 12 * 60 * 60 * 1000;

  function clean(value) { return String(value == null ? "" : value).trim(); }
  function cleanCode(value) { return clean(value).toUpperCase(); }
  function runtime() { return root.HIGHSELECT_RUNTIME || {}; }
  function cloudRequired() { return !clean(runtime().apiBase) && !!clean(runtime().adminSessionUrl); }
  function readCloudSession() {
    try {
      const value = JSON.parse(sessionStorage.getItem(CLOUD_SESSION_KEY) || "null");
      return value && clean(value.accessToken) && clean(value.refreshToken) ? value : null;
    } catch (_) { return null; }
  }
  function writeCloudSession(session) {
    const accessToken = clean(session && session.access_token);
    const refreshToken = clean(session && session.refresh_token);
    if (!accessToken || !refreshToken) throw new Error("관리자 세션을 만들지 못했습니다.");
    const expiresAt = Number(session.expires_at) > 0
      ? Number(session.expires_at) * 1000
      : Date.now() + Math.max(60, Number(session.expires_in) || 3600) * 1000;
    const safe = { accessToken, refreshToken, expiresAt };
    sessionStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify(safe));
    return safe;
  }
  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!data || !data.name || !data.issuedAt) return null;
      if (data.role !== "admin" && !data.studentId) { clear(); return null; }
      if (Date.now() - new Date(data.issuedAt).getTime() > MAX_AGE_MS) { clear(); return null; }
      if (cloudRequired() && data.role === "admin" && !readCloudSession()) { clear(); return null; }
      data.access = Array.isArray(data.access) ? data.access : [];
      return data;
    } catch (_) { return null; }
  }
  function write(session) {
    const safe = {
      name: clean(session.name),
      studentId: clean(session.studentId),
      role: session.role === "admin" ? "admin" : "student",
      access: Array.isArray(session.access) ? session.access.slice() : [],
      issuedAt: session.issuedAt || new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    return safe;
  }
  function clear() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(CLOUD_SESSION_KEY);
  }
  function canAccess(examId, session) { return !!session && session.access.includes(examId); }
  function requireSession(loginPath) {
    const session = read();
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search);
      location.replace((loginPath || "./login.html") + "?next=" + next);
      return null;
    }
    return session;
  }
  function requireAdmin(loginPath) {
    const session = requireSession(loginPath);
    if (!session) return null;
    if (session.role !== "admin") {
      location.replace(loginPath || "./login.html");
      return null;
    }
    return session;
  }
  async function signIn(name, code) {
    const n = clean(name), c = cleanCode(code);
    if (!n || !c) return { ok: false, message: "이름과 승인번호를 모두 입력해 주세요." };
    const settings = runtime();
    const apiBase = clean(settings.apiBase);
    if (!apiBase && !clean(settings.adminSessionUrl)) return { ok: false, offline: true, message: "운영 승인 서버가 아직 연결되지 않았습니다." };
    try {
      const cloud = !apiBase;
      const deviceToken = cloud ? clean(localStorage.getItem(DEVICE_KEY)) : "";
      const response = await fetch(cloud ? settings.adminSessionUrl : apiBase.replace(/\/$/, "") + "/session", {
        method: "POST",
        headers: Object.assign(
          { "Content-Type": "application/json" },
          cloud ? { apikey: clean(settings.supabasePublishableKey) } : {}
        ),
        credentials: "include",
        body: JSON.stringify(cloud ? { action: "login", name: n, approvalCode: c, deviceToken } : { name: n, approvalCode: c })
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        const busy = response.status === 429;
        return { ok: false, message: busy ? "로그인 시도가 많습니다. 잠시 뒤 다시 시도해 주세요." : (data.message || "이름 또는 승인번호를 확인해 주세요.") };
      }
      if (cloud) {
        writeCloudSession(data.session);
        if (clean(data.deviceToken)) localStorage.setItem(DEVICE_KEY, clean(data.deviceToken));
        return { ok: true, session: write({ name: clean(data.admin && data.admin.name) || n, role: "admin", access: [] }) };
      }
      if (data.role !== "admin" && !clean(data.studentId)) return { ok: false, message: "학생 식별 정보가 없는 승인 응답입니다." };
      return { ok: true, session: write(data) };
    } catch (_) {
      return { ok: false, offline: true, message: "승인 서버에 연결하지 못했습니다." };
    }
  }

  async function refreshCloudSession() {
    const current = readCloudSession();
    const settings = runtime();
    if (!current || !clean(settings.supabaseUrl) || !clean(settings.supabasePublishableKey)) throw new Error("관리자 로그인이 필요합니다.");
    const response = await fetch(`${String(settings.supabaseUrl).replace(/\/$/, "")}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: clean(settings.supabasePublishableKey), "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: current.refreshToken })
    });
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) { clear(); throw new Error("관리자 로그인이 만료되었습니다."); }
    return writeCloudSession(data);
  }

  async function authorizedFetch(url, options) {
    if (!cloudRequired()) return fetch(url, options);
    let session = readCloudSession();
    if (!session) throw new Error("관리자 로그인이 필요합니다.");
    if (Number(session.expiresAt) <= Date.now() + 30000) session = await refreshCloudSession();
    const settings = runtime();
    const requestOptions = Object.assign({}, options || {});
    requestOptions.headers = Object.assign({}, requestOptions.headers || {}, {
      apikey: clean(settings.supabasePublishableKey),
      Authorization: `Bearer ${session.accessToken}`
    });
    let response = await fetch(url, requestOptions);
    if (response.status === 401) {
      session = await refreshCloudSession();
      requestOptions.headers = Object.assign({}, requestOptions.headers, { Authorization: `Bearer ${session.accessToken}` });
      response = await fetch(url, requestOptions);
    }
    return response;
  }

  root.HIGHSELECT_AUTH = {
    read, write, clear, canAccess, requireSession, requireAdmin, signIn, authorizedFetch, cloudRequired,
    clean, cleanCode
  };
})(typeof window !== "undefined" ? window : globalThis);
