(function (root) {
  "use strict";
  const SESSION_KEY = "highselect-session-v1";
  const MAX_AGE_MS = 12 * 60 * 60 * 1000;

  function clean(value) { return String(value == null ? "" : value).trim(); }
  function cleanCode(value) { return clean(value).toUpperCase(); }
  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!data || !data.name || !data.issuedAt) return null;
      if (data.role !== "admin" && !data.studentId) { clear(); return null; }
      if (Date.now() - new Date(data.issuedAt).getTime() > MAX_AGE_MS) { clear(); return null; }
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
  function clear() { localStorage.removeItem(SESSION_KEY); }
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
    const apiBase = clean(root.HIGHSELECT_RUNTIME && root.HIGHSELECT_RUNTIME.apiBase);
    if (!apiBase) return { ok: false, offline: true, message: "운영 승인 서버가 아직 연결되지 않았습니다." };
    try {
      const response = await fetch(apiBase.replace(/\/$/, "") + "/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: n, approvalCode: c })
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) return { ok: false, message: data.message || "이름 또는 승인번호를 확인해 주세요." };
      if (data.role !== "admin" && !clean(data.studentId)) return { ok: false, message: "학생 식별 정보가 없는 승인 응답입니다." };
      return { ok: true, session: write(data) };
    } catch (_) {
      return { ok: false, offline: true, message: "승인 서버에 연결하지 못했습니다." };
    }
  }
  root.HIGHSELECT_AUTH = { read, write, clear, canAccess, requireSession, requireAdmin, signIn, clean, cleanCode };
})(typeof window !== "undefined" ? window : globalThis);
