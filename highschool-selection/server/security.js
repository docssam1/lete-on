"use strict";

const crypto = require("node:crypto");

function clean(value) {
  return String(value == null ? "" : value).normalize("NFC").trim();
}

function cleanApprovalCode(value) {
  return clean(value).toUpperCase();
}

function b64url(value) {
  return Buffer.from(value).toString("base64url");
}

function hmac(secret, value) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function timingEqual(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function hashApprovalCode(code, salt) {
  const normalized = cleanApprovalCode(code);
  if (!normalized) throw new Error("approval code is required");
  const saltBytes = salt ? Buffer.from(String(salt), "base64url") : crypto.randomBytes(16);
  const digest = crypto.scryptSync(normalized, saltBytes, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt-v1$${saltBytes.toString("base64url")}$${digest.toString("base64url")}`;
}

function verifyApprovalCode(code, encoded) {
  const parts = String(encoded || "").split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt-v1") return false;
  let supplied;
  try {
    supplied = hashApprovalCode(code, parts[1]).split("$")[2];
  } catch (_) {
    return false;
  }
  return timingEqual(supplied, parts[2]);
}

function approvalVersion(encoded, secret) {
  return hmac(secret, `approval\n${String(encoded || "")}`).slice(0, 24);
}

function signSession(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(secret, body)}`;
}

function verifySession(token, secret, nowMs) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2 || !timingEqual(parts[1], hmac(secret, parts[0]))) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    const now = Number.isFinite(nowMs) ? nowMs : Date.now();
    if (!payload || !payload.studentId || !Number.isFinite(payload.exp) || payload.exp <= now) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function parseCookies(header) {
  return String(header || "").split(";").reduce(function (result, entry) {
    const index = entry.indexOf("=");
    if (index < 1) return result;
    const key = entry.slice(0, index).trim();
    const value = entry.slice(index + 1).trim();
    try { result[key] = decodeURIComponent(value); } catch (_) { result[key] = value; }
    return result;
  }, {});
}

function sessionCookie(token, options) {
  const opts = options || {};
  const maxAge = Math.max(60, Number(opts.maxAgeSeconds || 43200));
  return [
    `${opts.name || "highselect_session"}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    opts.secure === false ? "" : "Secure",
    `Max-Age=${Math.floor(maxAge)}`
  ].filter(Boolean).join("; ");
}

function opaqueSubject(studentId, secret) {
  return hmac(secret, `subject\n${studentId}`).slice(0, 24);
}

function signPageAsset(input, secret) {
  return hmac(secret, [input.subject, input.examId, input.pageNumber, input.expires].join("\n"));
}

function verifyPageAsset(input, signature, secret) {
  return timingEqual(signature, signPageAsset(input, secret));
}

module.exports = {
  clean,
  cleanApprovalCode,
  hashApprovalCode,
  verifyApprovalCode,
  approvalVersion,
  signSession,
  verifySession,
  parseCookies,
  sessionCookie,
  opaqueSubject,
  signPageAsset,
  verifyPageAsset
};
