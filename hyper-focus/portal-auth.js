(function (root) {
  "use strict";

  const SESSION_KEY = "gfield_hf_portal_session_v1";
  const ADMIN_NAME = "docssam";
  const ADMIN_PEPPER = "gfield-hf-admin-v1|";
  const ADMIN_DIGEST = "36054863904f8ed97df9bbaca5023a6fd97468e95ab2d5073fcdba8c55949a6e";

  function members() {
    return root.GFIELD_HF_DATA || { students: [], studentCode: {}, studentType: {}, access: {} };
  }

  function cleanName(value) {
    return String(value || "").replace(/\s+/g, "").trim();
  }

  function cleanCode(value) {
    return String(value || "").trim().toUpperCase();
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
        sessionStorage.setItem("gfield_hf_code", value.code);
      }
    } catch (_) {}
  }

  async function sha256(value) {
    if (!root.crypto?.subtle) return "";
    const bytes = new TextEncoder().encode(value);
    const hash = await root.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
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
      name: registered,
      code: upper,
      type: data.studentType?.[registered] || "internal",
      permissions
    };
  }

  async function signIn(name, code) {
    const normalizedName = cleanName(name).toLowerCase();
    if (normalizedName === ADMIN_NAME) {
      const digest = await sha256(ADMIN_PEPPER + String(code || "").trim());
      if (digest === ADMIN_DIGEST) {
        const admin = { role: "admin", name: "DOCSSAM", permissions: ["*"] };
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

  function current() {
    const session = safeSessionRead();
    if (!session || !session.role) return null;
    if (session.role === "admin") return session;
    const member = findMember(session.name, session.code);
    if (!member) {
      signOut();
      return null;
    }
    safeSessionWrite(member);
    return member;
  }

  function canAccess(session, permission) {
    if (!session) return false;
    const permissions = Array.isArray(session.permissions) ? session.permissions : [];
    return permissions.includes("*") || permissions.includes(permission);
  }

  function signOut() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem("gfield_hf_name");
      sessionStorage.removeItem("gfield_hf_code");
    } catch (_) {}
  }

  root.GFieldHFPortalAuth = { SESSION_KEY, cleanName, cleanCode, findMember, signIn, current, canAccess, signOut };
})(window);
