(function (root) {
  "use strict";

  const SESSION_KEY = "gfield_hf_portal_session_v1";
  const ADMIN_NAME = "docssam";
  const ADMIN_PEPPER = "gfield-hf-admin-v1|";
  const ADMIN_DIGEST = "36054863904f8ed97df9bbaca5023a6fd97468e95ab2d5073fcdba8c55949a6e";
  const STUDENT_CODE_RE = /^GF([0-9A-HJKMNP-TV-Z]{20})$/;
  const STUDENT_EMAIL_DOMAIN = "auth.gfieldacademy.net";
  let remoteSession = null;
  let listenerInstalled = false;
  let pendingMfa = null;

  function members() {
    return root.GFIELD_HF_DATA || { students: [], studentCode: {}, studentType: {}, access: {} };
  }

  function cleanName(value) {
    return String(value || "").normalize("NFKC").replace(/\s+/gu, "").trim();
  }

  function loginNameKey(value) {
    return cleanName(value).toLocaleLowerCase("ko-KR");
  }

  function cleanCode(value) {
    return String(value || "").normalize("NFKC").toUpperCase().replace(/[\s-]+/gu, "");
  }

  function parseApprovalCode(value) {
    const normalized = cleanCode(value);
    const match = normalized.match(STUDENT_CODE_RE);
    if (!match) return null;
    return {
      normalized,
      handle: match[1].slice(0, 4).toLowerCase(),
      formatted: `GF-${match[1].slice(0, 4)}-${match[1].slice(4, 8)}-${match[1].slice(8, 12)}-${match[1].slice(12, 16)}-${match[1].slice(16, 20)}`
    };
  }

  function safeSessionRead() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function safeSessionWrite(value) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
      if (value.role === "student") {
        sessionStorage.setItem("gfield_hf_name", value.name);
        if (value.backend === "legacy" && value.code) sessionStorage.setItem("gfield_hf_code", value.code);
        else sessionStorage.removeItem("gfield_hf_code");
      } else {
        sessionStorage.removeItem("gfield_hf_name");
        sessionStorage.removeItem("gfield_hf_code");
      }
    } catch (_) {}
  }

  function clearLocalSession() {
    remoteSession = null;
    pendingMfa = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem("gfield_hf_name");
      sessionStorage.removeItem("gfield_hf_code");
    } catch (_) {}
  }

  async function sha256Bytes(value) {
    if (!root.crypto?.subtle) throw new Error("이 브라우저에서는 안전한 로그인을 지원하지 않습니다.");
    const bytes = new TextEncoder().encode(value);
    return new Uint8Array(await root.crypto.subtle.digest("SHA-256", bytes));
  }

  async function sha256Hex(value) {
    const bytes = await sha256Bytes(value);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function base64Url(bytes) {
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  async function deriveStudentPassword(name, normalizedCode) {
    const material = `hf-login-v1\0${loginNameKey(name)}\0${normalizedCode}`;
    return `${base64Url(await sha256Bytes(material))}Aa1!`;
  }

  function findMember(name, code) {
    const data = members();
    const upper = cleanCode(code);
    const registered = Object.keys(data.studentCode || {}).find(
      student => cleanCode(data.studentCode[student]) === upper
    );
    if (!registered || cleanName(registered) !== cleanName(name)) return null;
    const permissions = Array.isArray(data.access?.[registered]) ? data.access[registered].slice() : [];
    return {
      role: "student",
      backend: "legacy",
      name: registered,
      code: upper,
      type: data.studentType?.[registered] || "internal",
      permissions
    };
  }

  function isSupabaseEnabled() {
    return root.GFieldHFSupabase?.enabled() === true;
  }

  async function installAuthListener(client) {
    if (listenerInstalled) return;
    listenerInstalled = true;
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) clearLocalSession();
    });
  }

  async function hydrateRemoteSession(client, authSession) {
    const user = authSession?.user;
    if (!user) return null;
    const role = String(user.app_metadata?.hf_role || "");
    if (["admin", "content_editor"].includes(role)) {
      const { data: assurance, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error || assurance?.currentLevel !== "aal2") return null;
      const { data: staff, error: staffError } = await client
        .from("hf_admin_accounts")
        .select("role,account_status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (staffError || !staff || staff.account_status !== "active" || staff.role !== role) return null;
      return {
        role,
        backend: "supabase",
        userId: user.id,
        name: role === "admin" ? "DOCSSAM" : "콘텐츠 관리자",
        permissions: role === "admin" ? ["*"] : ["vip"]
      };
    }

    const { data: profile, error: profileError } = await client
      .from("hf_students")
      .select("id,display_name,student_type,account_status")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError || !profile || profile.account_status !== "active") return null;
    const { data: rows, error: entitlementError } = await client
      .from("hf_entitlements")
      .select("permission_key");
    if (entitlementError) return null;
    return {
      role: "student",
      backend: "supabase",
      userId: user.id,
      name: profile.display_name,
      type: profile.student_type,
      permissions: (rows || []).map(row => row.permission_key)
    };
  }

  async function prepareStaffMfa(client, authSession) {
    const role = String(authSession?.user?.app_metadata?.hf_role || "");
    if (!["admin", "content_editor"].includes(role)) return null;
    const { data: assurance, error: assuranceError } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) return null;
    if (assurance?.currentLevel === "aal2") return hydrateRemoteSession(client, authSession);
    const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
    if (factorError) return null;
    const factor = (factors?.totp || []).find(item => item.status === "verified");
    if (!factor) return { role: "mfa_enrollment_required", backend: "supabase" };
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: factor.id });
    if (challengeError || !challenge?.id) return null;
    pendingMfa = { client, factorId: factor.id, challengeId: challenge.id };
    return { role: "mfa_required", backend: "supabase" };
  }

  async function verifyMfa(code) {
    if (!pendingMfa || !/^\d{6}$/.test(String(code || "").trim())) return null;
    const { client, factorId, challengeId } = pendingMfa;
    const { error } = await client.auth.mfa.verify({
      factorId,
      challengeId,
      code: String(code).trim()
    });
    if (error) return null;
    pendingMfa = null;
    const { data } = await client.auth.getSession();
    const session = await hydrateRemoteSession(client, data.session);
    if (!session) return null;
    remoteSession = session;
    safeSessionWrite(session);
    return session;
  }

  async function remoteSignIn(name, code) {
    const client = await root.GFieldHFSupabase.ready();
    await installAuthListener(client);
    await client.auth.signOut({ scope: "local" });
    clearLocalSession();

    const normalizedName = loginNameKey(name);
    let email;
    let password;
    if (normalizedName === ADMIN_NAME) {
      email = String(root.GFieldHFSupabase.config().adminEmail || "").trim();
      password = String(code || "");
      if (!email || !password) return null;
    } else {
      const parsed = parseApprovalCode(code);
      if (!parsed || !normalizedName) return null;
      email = `hf.${parsed.handle}@${STUDENT_EMAIL_DOMAIN}`;
      password = await deriveStudentPassword(name, parsed.normalized);
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.session) return null;
    if (["admin", "content_editor"].includes(String(data.user?.app_metadata?.hf_role || ""))) {
      const staffResult = await prepareStaffMfa(client, data.session);
      if (staffResult) return staffResult;
    }
    const session = await hydrateRemoteSession(client, data.session);
    if (!session) {
      await client.auth.signOut({ scope: "local" });
      clearLocalSession();
      return null;
    }
    remoteSession = session;
    safeSessionWrite(session);
    return session;
  }

  async function legacySignIn(name, code) {
    const normalizedName = loginNameKey(name);
    if (normalizedName === ADMIN_NAME) {
      const digest = await sha256Hex(ADMIN_PEPPER + String(code || "").trim());
      if (digest === ADMIN_DIGEST) {
        const admin = { role: "admin", backend: "legacy", name: "DOCSSAM", permissions: ["*"] };
        safeSessionWrite(admin);
        return admin;
      }
      return null;
    }
    const member = findMember(name, code);
    if (!member) return null;
    safeSessionWrite(member);
    return member;
  }

  async function signIn(name, code) {
    try {
      return isSupabaseEnabled() ? await remoteSignIn(name, code) : await legacySignIn(name, code);
    } catch (error) {
      console.error("Hyper Focus login failed", error);
      return null;
    }
  }

  function current() {
    const session = remoteSession || safeSessionRead();
    if (!session || !session.role) return null;
    if (isSupabaseEnabled()) return session.backend === "supabase" ? session : null;
    if (session.role === "admin") return session;
    const member = findMember(session.name, session.code);
    if (!member) {
      clearLocalSession();
      return null;
    }
    safeSessionWrite(member);
    return member;
  }

  async function ready() {
    if (!isSupabaseEnabled()) return current();
    try {
      const client = await root.GFieldHFSupabase.ready();
      await installAuthListener(client);
      const { data, error } = await client.auth.getSession();
      if (error || !data.session) {
        clearLocalSession();
        return null;
      }
      const session = await hydrateRemoteSession(client, data.session);
      if (!session) {
        await client.auth.signOut({ scope: "local" });
        clearLocalSession();
        return null;
      }
      remoteSession = session;
      safeSessionWrite(session);
      return session;
    } catch (error) {
      console.error("Hyper Focus session restore failed", error);
      clearLocalSession();
      return null;
    }
  }

  function canAccess(session, permission) {
    if (!session) return false;
    const permissions = Array.isArray(session.permissions) ? session.permissions : [];
    return permissions.includes("*") || permissions.includes(permission);
  }

  async function signOut() {
    if (isSupabaseEnabled()) {
      try {
        const client = await root.GFieldHFSupabase.ready();
        await client.auth.signOut({ scope: "local" });
      } catch (_) {}
    }
    clearLocalSession();
  }

  async function client() {
    return isSupabaseEnabled() ? root.GFieldHFSupabase.ready() : null;
  }

  root.GFieldHFPortalAuth = Object.freeze({
    SESSION_KEY,
    cleanName,
    cleanCode,
    loginNameKey,
    parseApprovalCode,
    deriveStudentPassword,
    findMember,
    isSupabaseEnabled,
    signIn,
    verifyMfa,
    ready,
    current,
    canAccess,
    signOut,
    client
  });
})(window);
