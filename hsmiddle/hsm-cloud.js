(() => {
  const ENDPOINT = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/hsmiddle-records";
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs";
  const TOKEN_KEY = "hsm-session-token-v2";
  const PENDING_KEY = "hsm-pending-attempts-v1";
  const TIMEOUT_MS = 8000;

  function ready() {
    try { return typeof navigator === "undefined" || navigator.onLine !== false; }
    catch (e) { return true; }
  }

  function token() {
    try { return localStorage.getItem(TOKEN_KEY) || ""; }
    catch (e) { return ""; }
  }

  async function request(action, body, authenticated) {
    let timer = null;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const headers = { apikey: ANON_KEY, "Content-Type": "application/json" };
      if (authenticated !== false) headers["x-hsm-session"] = token();
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify(Object.assign({ action }, body || {})),
        signal: controller.signal,
      });
      let data = null;
      try { data = await response.json(); } catch (e) {}
      return { ok: response.ok, status: response.status, data };
    } catch (e) {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async function login(name, code) {
    const result = await request("login", { name, code }, false);
    return result && result.ok ? result.data : null;
  }

  async function session() {
    const result = await request("session");
    return result && result.ok ? result.data : null;
  }

  async function logout() {
    const result = await request("logout");
    return Boolean(result && result.ok);
  }

  async function markStart() {
    const result = await request("markStart");
    return Boolean(result && result.ok);
  }

  async function getStart() {
    const result = await request("getStart");
    return result && result.ok && result.data ? result.data.startedAt || null : null;
  }

  async function listAttempts(_name, round) {
    const result = await request("listAttempts", { round });
    if (!result || !result.ok || !result.data || !Array.isArray(result.data.attempts)) return null;
    return result.data.attempts;
  }

  function pendingAttempts() {
    try {
      const value = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
      return Array.isArray(value) ? value.slice(0, 20) : [];
    } catch (e) { return []; }
  }

  function queueAttempt(round, record) {
    const queue = pendingAttempts();
    const signature = JSON.stringify({ round, record });
    if (!queue.some(item => item.signature === signature)) queue.push({ round, record, signature, queuedAt: new Date().toISOString() });
    localStorage.setItem(PENDING_KEY, JSON.stringify(queue.slice(-20)));
  }

  function completeExamRecord(round, record) {
    if (round === "diagnostic") return true;
    const states = record && record.states;
    if (!states || typeof states !== "object" || Array.isArray(states)) return false;
    const entries = Object.entries(states);
    return entries.length === 40 && entries.every(([key, value]) => /^([1-9]|[1-3][0-9]|40)$/.test(key) && ["o", "x", "manual"].includes(value));
  }

  async function flushPending() {
    if (!token()) return { sent: 0, pending: pendingAttempts().length };
    const queue = pendingAttempts();
    const remaining = [];
    let sent = 0;
    for (const item of queue) {
      if (!completeExamRecord(item.round, item.record)) continue;
      const result = await request("addAttempt", { round: item.round, record: item.record });
      if (result && result.ok) sent += 1;
      else if (result && result.status === 409) sent += 1;
      else remaining.push(item);
    }
    localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
    return { sent, pending: remaining.length };
  }

  async function addAttempt(_name, round, record) {
    if (!completeExamRecord(round, record)) return { ok: false, reason: "invalid" };
    const result = await request("addAttempt", { round, record });
    if (!result) { queueAttempt(round, record); return { ok: false, reason: "pending" }; }
    if (result.ok) return { ok: true, attempt: result.data && result.data.attempt };
    if (result.status === 409 || (result.data && result.data.error === "attempt_limit")) return { ok: false, reason: "full" };
    if (result.status === 401 || result.status >= 500) { queueAttempt(round, record); return { ok: false, reason: "pending" }; }
    if (result.status === 403) return { ok: false, reason: "auth" };
    return { ok: false, reason: "invalid" };
  }

  async function allAttempts() {
    const result = await request("allAttempts");
    return result && result.ok && result.data && Array.isArray(result.data.attempts) ? result.data.attempts : null;
  }

  async function adminList() {
    const result = await request("adminList");
    return result && result.ok && result.data && Array.isArray(result.data.accounts) ? result.data.accounts : null;
  }

  async function adminUpsert(name, code, permissions) {
    const result = await request("adminUpsert", { name, code, permissions });
    return result && result.ok ? result.data.account : null;
  }

  async function adminDeactivate(name) {
    const result = await request("adminDeactivate", { name });
    return Boolean(result && result.ok);
  }

  window.HSMIDDLE_CLOUD = {
    TOKEN_KEY,
    ready,
    login,
    session,
    logout,
    markStart,
    getStart,
    listAttempts,
    addAttempt,
    flushPending,
    allAttempts,
    adminList,
    adminUpsert,
    adminDeactivate,
  };
})();
