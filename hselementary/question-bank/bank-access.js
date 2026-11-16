(() => {
  "use strict";

  const STORAGE_KEY = "hselementary-bank-access-v1";
  const PAIRS = [4, 5, 6].flatMap(grade => [1, 2].map(term => ({ grade, term })));
  const permissionKey = ({ grade, term }) => `hselementary:grade:${grade}:term:${term}`;
  const normalize = value => String(value || "").trim().toUpperCase();
  const bytesToHex = bytes => Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");

  function permissionsFromSession() {
    const session = window.HSELEMENTARY_SESSION || window.GFIELD_SESSION || (() => {
      try { return JSON.parse(localStorage.getItem("gfield-session") || localStorage.getItem("hse-session") || "null"); }
      catch { return null; }
    })();
    const values = session?.permissions ?? session?.permission ?? session?.claims?.permissions;
    if (Array.isArray(values)) return values.map(String);
    if (values && typeof values === "object") return Object.entries(values).filter(([, enabled]) => enabled === true).map(([key]) => key);
    return [];
  }

  function storedPermissions() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      const permissions = window.GFIELD_CONFIG?.access?.[saved?.hash];
      return Array.isArray(permissions) ? permissions.map(String) : [];
    } catch { return []; }
  }

  function pairsForPermissions(permissions = []) {
    const granted = new Set(permissions);
    return PAIRS.filter(pair => granted.has(permissionKey(pair)));
  }

  function approvalEnforced() {
    return window.GFIELD_CONFIG?.meta?.elementaryApprovalEnforced === true;
  }

  function allowedPairs() {
    return approvalEnforced()
      ? pairsForPermissions([...permissionsFromSession(), ...storedPermissions()])
      : PAIRS;
  }

  function announce(message, isError = true) {
    const target = document.getElementById("bankAccessMessage");
    if (!target) return;
    target.textContent = message;
    target.dataset.state = isError ? "error" : "success";
  }

  function showGate() {
    const gate = document.getElementById("bankAccessGate");
    if (!gate) return;
    gate.hidden = false;
    const app = document.querySelector(".app-shell");
    if (app) {
      app.inert = true;
      app.setAttribute("aria-hidden", "true");
    }
    document.getElementById("bankAccessCode")?.focus();
  }

  function hideGate() {
    const gate = document.getElementById("bankAccessGate");
    if (gate) gate.hidden = true;
    const app = document.querySelector(".app-shell");
    if (app) {
      app.inert = false;
      app.removeAttribute("aria-hidden");
    }
  }

  async function lookupCode(code) {
    const config = window.GFIELD_CONFIG;
    if (!config?.meta?.salt || !config?.access || typeof crypto?.subtle?.digest !== "function") return null;
    const input = new TextEncoder().encode(`${config.meta.salt}:${normalize(code)}`);
    const digest = await crypto.subtle.digest("SHA-256", input);
    const hash = bytesToHex(digest);
    const permissions = config.access[hash];
    return Array.isArray(permissions) ? { hash, permissions } : null;
  }

  const api = {
    permissionKey,
    allowedPairs,
    canAccess(grade, term) {
      return allowedPairs().some(pair => pair.grade === Number(grade) && pair.term === Number(term));
    },
    firstAllowedPair() { return allowedPairs()[0] || null; },
    refresh() {
      if (!approvalEnforced() || allowedPairs().length) hideGate();
      else showGate();
    }
  };
  window.HSE_BANK_ACCESS = api;

  document.getElementById("bankAccessForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    const code = document.getElementById("bankAccessCode").value;
    if (button) button.disabled = true;
    try {
      const matched = await lookupCode(code);
      const approved = pairsForPermissions(matched?.permissions || []);
      if (!approved.length) {
        announce(matched ? "이 승인번호에는 초등 문제은행 학년·학기 권한이 없습니다." : "승인번호를 확인해 주세요.");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ hash: matched.hash }));
      announce(`${approved.length}개 학년·학기 승인 확인`, false);
      hideGate();
      document.dispatchEvent(new CustomEvent("hse-bank-access-ready"));
    } catch (error) {
      announce("승인을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      if (button) button.disabled = false;
    }
  });

  document.getElementById("bankAccessForm")?.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll("input:not([disabled]), button:not([disabled])")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  api.refresh();
})();
