(() => {
  const NAME_KEY = "hs-student";
  const LEGACY_CODE_KEY = "hs-code";
  const TOKEN_KEY = "hsm-session-token-v2";
  const SESSION_KEY = "hsm-session-profile-v2";
  const STARTED_PREFIX = "hsm-started-";
  const USAGE_PERIOD_DAYS = 180;

  try {
    const name = sessionStorage.getItem(NAME_KEY);
    if (name && !localStorage.getItem(NAME_KEY)) localStorage.setItem(NAME_KEY, name);
    sessionStorage.removeItem(LEGACY_CODE_KEY);
    localStorage.removeItem(LEGACY_CODE_KEY);
  } catch (e) {}

  const trim = value => String(value ?? "").trim();
  const normalizeName = value => trim(value).normalize("NFKC");
  const normalizeCode = value => trim(value).normalize("NFKC").toUpperCase();

  function storedProfile() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
    catch (e) { return null; }
  }

  function readSession() {
    const profile = storedProfile();
    const token = localStorage.getItem(TOKEN_KEY) || "";
    const expires = profile && profile.expiresAt ? new Date(profile.expiresAt).getTime() : NaN;
    const valid = Boolean(profile && token && /^[a-f0-9]{64}$/i.test(token) && Number.isFinite(expires) && expires > Date.now());
    return {
      name: valid ? normalizeName(profile.name) : (localStorage.getItem(NAME_KEY) || ""),
      token: valid ? token : "",
      valid,
      access: valid && Array.isArray(profile.access) ? profile.access.slice() : [],
      admin: Boolean(valid && profile.admin),
      expiresAt: valid ? profile.expiresAt : null,
    };
  }

  function syncStart(name, isoString) {
    if (!isoString) return;
    const serverTime = new Date(isoString).getTime();
    if (Number.isNaN(serverTime)) return;
    const key = STARTED_PREFIX + normalizeName(name);
    const localValue = localStorage.getItem(key);
    const localTime = localValue ? new Date(localValue).getTime() : NaN;
    if (!localValue || Number.isNaN(localTime) || serverTime < localTime) localStorage.setItem(key, new Date(serverTime).toISOString());
  }

  function saveServerSession(payload) {
    const name = normalizeName(payload && payload.name);
    const token = String(payload && payload.token || "");
    const access = Array.isArray(payload && payload.access) ? payload.access.map(String) : [];
    if (!name || !/^[a-f0-9]{64}$/i.test(token) || !payload.expiresAt) return null;
    localStorage.setItem(NAME_KEY, name);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, access, admin: Boolean(payload.admin), expiresAt: payload.expiresAt }));
    if (payload.startedAt) syncStart(name, payload.startedAt);
    return readSession();
  }

  async function login(name, code) {
    if (!window.HSMIDDLE_CLOUD) return null;
    const payload = await window.HSMIDDLE_CLOUD.login(normalizeName(name), normalizeCode(code));
    const session = payload ? saveServerSession(payload) : null;
    if (session && window.HSMIDDLE_CLOUD.flushPending) await window.HSMIDDLE_CLOUD.flushPending();
    return session;
  }

  async function refreshSession() {
    const current = readSession();
    if (!current.valid || !window.HSMIDDLE_CLOUD) return null;
    const payload = await window.HSMIDDLE_CLOUD.session();
    if (!payload) { clearSession(); return null; }
    return saveServerSession(Object.assign({}, payload, { token: current.token }));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_CODE_KEY);
  }

  async function logout() {
    try { if (window.HSMIDDLE_CLOUD) await window.HSMIDDLE_CLOUD.logout(); } catch (e) {}
    clearSession();
  }

  function accessList(name) {
    const session = readSession();
    return session.valid && session.name === normalizeName(name) ? session.access : [];
  }

  function canAccess(name, examKey) {
    return accessList(name).includes(examKey);
  }

  function isAdmin(name) {
    const session = readSession();
    return Boolean(session.valid && session.admin && session.name === normalizeName(name));
  }

  function startedAt(name) {
    return localStorage.getItem(STARTED_PREFIX + normalizeName(name)) || null;
  }

  function markStart(name) {
    const key = STARTED_PREFIX + normalizeName(name);
    if (!localStorage.getItem(key)) localStorage.setItem(key, new Date().toISOString());
  }

  function daysLeft(name) {
    const started = startedAt(name);
    if (!started) return USAGE_PERIOD_DAYS;
    const startedTime = new Date(started).getTime();
    if (Number.isNaN(startedTime)) return USAGE_PERIOD_DAYS;
    return USAGE_PERIOD_DAYS - Math.floor((Date.now() - startedTime) / 86400000);
  }

  function isExpired(name) {
    return !isAdmin(name) && daysLeft(name) <= 0;
  }

  window.HSMIDDLE_AUTH = {
    NAME_KEY,
    TOKEN_KEY,
    normalizeName,
    normalizeCode,
    accessList,
    canAccess,
    isAdmin,
    readSession,
    login,
    refreshSession,
    clearSession,
    logout,
    startedAt,
    markStart,
    syncStart,
    daysLeft,
    isExpired,
  };
})();
