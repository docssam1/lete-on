(function (global) {
  "use strict";

  const FREE_PER_DIFFICULTY = 2;
  const PAID_PER_DIFFICULTY = 20;
  const MAX_SELECTED_TYPES = 20;
  const PAID_PERMISSION = "soma:premier:hyperfocus-extra";
  const STORAGE_KEY = "hf-premier-extra-access-hash-v1";
  const DIFFICULTIES = ["easy", "same", "hard"];

  function normalizeCode(value) {
    return String(value || "").trim().toUpperCase();
  }

  function configOrEmpty(config) {
    const value = config || global.GFIELD_CONFIG || {};
    return {
      salt: String(value.meta && value.meta.salt || "gfield-on-2026-v1"),
      access: value.access && typeof value.access === "object" ? value.access : {}
    };
  }

  async function sha256Hex(value) {
    if (!global.crypto || !global.crypto.subtle) throw new Error("이 브라우저에서는 승인번호를 안전하게 확인할 수 없습니다.");
    const bytes = new TextEncoder().encode(String(value));
    const digest = await global.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function permissionsForHash(hash, config) {
    const cfg = configOrEmpty(config);
    const permissions = cfg.access[String(hash || "")];
    return Array.isArray(permissions) ? permissions.slice() : [];
  }

  function hasPaidPermission(permissions) {
    return Array.isArray(permissions) && permissions.includes(PAID_PERMISSION);
  }

  function paidPracticeReady() {
    return global.GFIELD_HF_SUPABASE_CONFIG?.features?.securePracticeDelivery === true;
  }

  async function verifyCode(code, config) {
    const normalized = normalizeCode(code);
    if (!normalized) return { valid: false, paid: false, hash: "", permissions: [] };
    const cfg = configOrEmpty(config);
    const hash = await sha256Hex(`${cfg.salt}:${normalized}`);
    const permissions = permissionsForHash(hash, config);
    return { valid: permissions.length > 0, paid: hasPaidPermission(permissions) && paidPracticeReady(), hash, permissions };
  }

  function saveVerifiedHash(hash) {
    try {
      if (hash) global.localStorage.setItem(STORAGE_KEY, String(hash));
      else global.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
  }

  function storedAccess(config) {
    let hash = "";
    try { hash = global.localStorage.getItem(STORAGE_KEY) || ""; } catch (error) {}
    const permissions = permissionsForHash(hash, config);
    return { hash, permissions, paid: hasPaidPermission(permissions) && paidPracticeReady() };
  }

  function tier(value) {
    return value === "paid" && paidPracticeReady() ? "paid" : "free";
  }

  function limitForTier(value) {
    return tier(value) === "paid" ? PAID_PER_DIFFICULTY : FREE_PER_DIFFICULTY;
  }

  function validatePracticeRequest(options) {
    const opts = options || {};
    const difficulty = String(opts.difficulty || "same");
    const count = Number(opts.countPerType);
    const accessTier = tier(opts.accessTier);
    if (!DIFFICULTIES.includes(difficulty)) throw new Error("약점 문제 난이도를 쉽게·같게·어렵게 중에서 골라 주세요.");
    if (!Number.isInteger(count) || count < 1) throw new Error("약점 유형별 문제 수를 1개 이상 직접 정해 주세요.");
    if (opts.accessTier === "paid" && !paidPracticeReady() && count > FREE_PER_DIFFICULTY) {
      throw new Error("추가 문제는 비공개 서버 전달 준비 중입니다. 현재는 난이도별 2문항만 이용할 수 있습니다.");
    }
    const limit = limitForTier(accessTier);
    if (count > limit) {
      if (accessTier === "free") throw new Error(`난이도별 무료 유사문제는 ${FREE_PER_DIFFICULTY}문항까지입니다. ${FREE_PER_DIFFICULTY + 1}번째부터는 유료 추가 문제입니다.`);
      throw new Error(`난이도별 추가 문제는 한 번에 ${PAID_PER_DIFFICULTY}문항까지 만들 수 있습니다.`);
    }
    return { difficulty, countPerType: count, accessTier, limit };
  }

  global.HFAccessPolicy = {
    FREE_PER_DIFFICULTY,
    PAID_PER_DIFFICULTY,
    MAX_SELECTED_TYPES,
    PAID_PERMISSION,
    DIFFICULTIES: DIFFICULTIES.slice(),
    normalizeCode,
    permissionsForHash,
    hasPaidPermission,
    paidPracticeReady,
    verifyCode,
    saveVerifiedHash,
    storedAccess,
    tier,
    limitForTier,
    validatePracticeRequest
  };
})(typeof window !== "undefined" ? window : globalThis);
