// Numbers of Magic — nm-membership request handler (offline-testable, dependency injection).
// No Deno/Supabase imports here. index.ts wires the real dependencies:
//   deps.rpc(action, payload, actor, ipHash) -> Promise<{data,error}>   (public.nm_membership_rpc, service_role only)
//   deps.getUser(jwt)  -> Promise<{id, emailVerified} | null>            (auth.getUser — verifies the real JWT)
//   deps.notifySecret() -> Promise<string>                               (NOTIFY_TRIGGER_KEY, server only)
//   deps.callWeeklyNotify(triggerKey, manualPayload) -> Promise<{ok,status}>
//   deps.courseLimits? { C12: maxSessionIndex, ... }                     (optional extra bound; SQL always enforces C0..C73 / 1..1000)

export const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "https://docssam1.github.io",
  "http://localhost:8767",
  "http://127.0.0.1:8767",
]);
export const MAX_BODY_BYTES = 4096;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const NO_CTRL = /^[^\u0000-\u001f\u007f]+$/;
const SPEEDS = [0.7, 0.85, 1, 1.25, 1.5];
const HIGH_PLAN_VERSION = "20261023-high3m";
const HIGH_PLAN_COURSE = /^C(3[89]|[4-6][0-9])$/;
const MIDDLE_PLAN_VERSION = "20261023-middle25";
const MIDDLE_PLAN_COURSE = /^C(29|3[0-7])$/;
const CALCULUS_PLAN_VERSION = "20261024-calculus3m";
const CALCULUS_PLAN_COURSE = /^C7[0-3]$/;
const DELIVERY_PLAN_VERSION = "20261024-personal1";
const MIDDLE_EXTENSION_VERSION = "20261024-middle-extension1";
// Canonical source sessions, not the compact bundle count. Keep in sync with
// course-limits.json and NM_DELIVERY_PLAN.SOURCE_LIMITS (verified offline).
const DELIVERY_SOURCE_COUNTS = [19,6,6,8,9,8,8,4,9,11,6,8,6,4,4,4,5,9,5,4,7,6,4,7,7,4,8,12,12,11,9,11,8,7,9,8,10,13,8,9,7,8,8,6,6,7,8,5,4,7,7,8,5,8,7,9,8,8,8,10,10,9,8,8,4,7,8,8,7,5,5,4,6,5];
const INVALID = Symbol("invalid");
const DENY_KEYS = new Set(["phone", "tokenhash", "token_hash", "code_hash", "trigger_key", "service_role", "password", "secret", "authorization", "hash"]);
const OK_STATUS = new Set([400, 401, 403, 404, 409, 410, 429, 503]);

// ---- field validators: return normalized value or INVALID ----
const str = (max, re) => (v) => (typeof v === "string" && v.length >= 1 && v.length <= max && (!re || re.test(v)) ? v : INVALID);
const text = (max) => str(max, NO_CTRL);
const hex = (n) => str(n, new RegExp(`^[0-9a-f]{${n}}$`));
const email = (v) => {
  if (typeof v !== "string") return INVALID;
  const e = v.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]{1,64}@[^\s@.][^\s@]{0,188}\.[^\s@]{2,}$/.test(e) ? e : INVALID;
};
const int = (lo, hi) => (v) => (Number.isInteger(v) && v >= lo && v <= hi ? v : INVALID);
const oneOf = (list) => (v) => (list.includes(v) ? v : INVALID);

const pname = text(100);
const adminToken = hex(64);
const courseKey = (v) => (typeof v === "string" && /^C(0|[1-9]\d?)$/.test(v) && Number(v.slice(1)) <= 73 ? v : INVALID);
const startDate = (v) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return INVALID;
  const d = new Date(v + "T00:00:00Z");
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== v) return INVALID;
  const y = d.getUTCFullYear();
  return y >= 2020 && y <= 2100 ? v : INVALID;
};
const query = (v) => (typeof v === "string" && v.length <= 254 && (v === "" || NO_CTRL.test(v)) ? v.trim() : INVALID);
const object = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const exactSession = (key, n) => courseKey(key) !== INVALID && Number.isInteger(n) && n >= 1 && n <= DELIVERY_SOURCE_COUNTS[Number(key.slice(1))];
function personalPlan(v) {
  if (!object(v) || !exactSession(v.courseKey, v.sessionIndex) || startDate(v.startDate) === INVALID
      || !SPEEDS.includes(v.speed) || !SPEEDS.includes(v.amount) || !["w1", "w2"].includes(v.cadence)
      || !["p0", "p1", "p2", "p3", "p4"].includes(v.pace)) return null;
  const p = pick(v, ["courseKey", "sessionIndex", "startDate", "speed", "amount", "cadence", "pace"]);
  if (Object.hasOwn(v, "middleExtensions")) {
    if (!object(v.middleExtensions) || Object.entries(v.middleExtensions).some(([g, version]) => !["1", "2", "3"].includes(g) || version !== MIDDLE_EXTENSION_VERSION)) return null;
    p.middleExtensions = { ...v.middleExtensions };
  }
  if (Object.hasOwn(v, "extensionAnchor")) {
    const a = v.extensionAnchor, ends = { 1: "C31", 2: "C34", 3: "C37" }, next = { 1: "C32", 2: "C35", 3: "C38" };
    if (!object(a) || ![1, 2, 3].includes(a.grade) || !Number.isInteger(a.index) || a.index < 0 || a.index >= 12
        || p.courseKey !== ends[a.grade] || p.middleExtensions?.[a.grade] !== MIDDLE_EXTENSION_VERSION) return null;
    p.extensionAnchor = { grade: a.grade, index: a.index };
    if (Object.hasOwn(a, "resume")) {
      if (!object(a.resume) || a.resume.courseKey !== next[a.grade] || !exactSession(a.resume.courseKey, a.resume.sessionIndex)) return null;
      p.extensionAnchor.resume = pick(a.resume, ["courseKey", "sessionIndex"]);
    }
  }
  return p;
}
function isoWeek(v) {
  if (typeof v !== "string" || !/^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/.test(v)) return false;
  const y = +v.slice(0, 4), w = +v.slice(6), jan4 = new Date(Date.UTC(y, 0, 4));
  if (y < 2020 || y > 2100) return false;
  const mon = new Date(+jan4 - ((jan4.getUTCDay() + 6) % 7) * 86400000 + (w - 1) * 604800000);
  const thursday = new Date(+mon + 3 * 86400000);
  return thursday.getUTCFullYear() === y;
}

// action -> { auth, fields: { name: [validator, required] } }. Unknown fields are rejected (blocks owner/actor spoofing).
const phone = (v) => (typeof v === "string" && /^01\d{8,9}$/.test(v) ? v : INVALID);
const mustTrue = (v) => (v === true ? v : INVALID);
const bool = (v) => (typeof v === "boolean" ? v : INVALID);

const ACTIONS = {
  status: { auth: "jwt", fields: { profileName: [pname, false] } },
  // phone omitted = keep the number on file; privacyVersion/guardianConsent omitted = pre-notice client (SQL decides).
  register_contact: { auth: "jwt", fields: { phone: [phone, false], collectionConsent: [mustTrue, true], smsConsent: [bool, true], privacyVersion: [oneOf(["2026-10-22-v1"]), false], guardianConsent: [mustTrue, false] } },
  admin_login: { auth: "none", fields: { username: [str(64, /^[A-Za-z0-9_.@-]+$/), true], code: [str(128), true] } },
  admin_logout: { auth: "admin", fields: { adminToken: [adminToken, true] } },
  admin_list: { auth: "admin", fields: { adminToken: [adminToken, true], query: [query, false] } },
  admin_grant: { auth: "admin", fields: { adminToken: [adminToken, true], email: [email, true], plan: [oneOf(["six_month", "annual"]), true] } },
  admin_revoke: { auth: "admin", fields: { adminToken: [adminToken, true], userId: [str(36, UUID), true] } },
  admin_link: { auth: "admin", fields: { adminToken: [adminToken, true], email: [email, true], profileName: [pname, true] } },
  admin_set_learning: {
    auth: "admin",
    fields: {
      adminToken: [adminToken, true], profileName: [pname, true], courseKey: [courseKey, true], sessionIndex: [int(1, 1000), true],
      speed: [oneOf(SPEEDS), true], amount: [oneOf(SPEEDS), true], cadence: [oneOf(["w1", "w2"]), true],
      entryYear: [(v) => (v === null ? null : int(1990, 2100)(v)), false], startDate: [startDate, true],
    },
  },
  admin_preview_worksheet: { auth: "admin", fields: { adminToken: [adminToken, true], profileName: [pname, true], k: [oneOf([1, 2]), true] } },
  admin_send_worksheet: { auth: "admin", fields: { adminToken: [adminToken, true], previewId: [str(36, UUID), true] } },
  resolve_worksheet: { auth: "public", fields: { token: [hex(32), true] } },
};

function validate(spec, body) {
  const out = {};
  for (const k of Object.keys(body)) {
    if (k !== "action" && !Object.prototype.hasOwnProperty.call(spec.fields, k)) return null;
  }
  for (const [k, [fn, req]] of Object.entries(spec.fields)) {
    const raw = Object.prototype.hasOwnProperty.call(body, k) ? body[k] : undefined;
    if (raw === undefined) { if (req) return null; continue; }
    const v = fn(raw);
    if (v === INVALID) return null;
    out[k] = v;
  }
  return out;
}

async function sha256Hex(s) {
  const b = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
}

function scrub(v) {
  if (Array.isArray(v)) return v.map(scrub);
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) if (!DENY_KEYS.has(k.toLowerCase())) o[k] = scrub(x);
    return o;
  }
  return v;
}
const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o && o[k] !== undefined).map((k) => [k, o[k]]));

function normalizeSend(r) {
  const s = r && r.status;
  if (s === "sent" && r.ok === true) return { ok: true, status: "sent" };
  if (s === "queued" && r.ok === null) return { ok: null, status: "queued" };
  if (s === "failed" && r.ok === false) return { ok: false, status: "failed" };
  return { ok: null, status: "failed" }; // ambiguous — never retried
}

export function createHandler(deps) {
  return async function handle(req) {
    const origin = req.headers.get("origin") || "";
    const h = new Headers({
      "Access-Control-Allow-Headers": "content-type, apikey, authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
    });
    const originOk = ALLOWED_ORIGINS.has(origin);
    if (originOk) h.set("Access-Control-Allow-Origin", origin);
    const out = (body, status = 200, extra = {}) => {
      for (const [k, v] of Object.entries(extra)) h.set(k, v);
      return new Response(body === null ? null : JSON.stringify(body), { status, headers: h });
    };
    const fail = (code, status, extra) => out({ error: code }, status, extra);

    if (origin && !originOk) return fail("origin_not_allowed", 403);
    if (req.method === "OPTIONS") return out(null, 204);
    if (req.method !== "POST") return fail("method_not_allowed", 405);
    const apikey = req.headers.get("apikey") || "";
    if (!apikey || apikey.length > 2048) return fail("apikey_required", 401);

    const cl = Number(req.headers.get("content-length") || 0);
    if (cl > MAX_BODY_BYTES) return fail("body_too_large", 413);
    let raw;
    try { raw = await req.text(); } catch (_) { return fail("request_invalid", 400); }
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return fail("body_too_large", 413);
    let body;
    try { body = JSON.parse(raw); } catch (_) { return fail("request_invalid", 400); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail("request_invalid", 400);

    const action = body.action;
    const spec = typeof action === "string" && Object.prototype.hasOwnProperty.call(ACTIONS, action) ? ACTIONS[action] : null;
    if (!spec) return fail("action_invalid", 400);
    const payload = validate(spec, body);
    if (!payload) return action === "resolve_worksheet" ? fail("not_found", 404) : fail("request_invalid", 400);

    // Optional per-course bound (static map from the app's course data); SQL enforces the hard limits regardless.
    if (action === "admin_set_learning" && deps.courseLimits) {
      const max = deps.courseLimits[payload.courseKey];
      if (!Number.isInteger(max) || payload.sessionIndex > max) return fail("request_invalid", 400);
    }
    if (action === "admin_set_learning" && payload.entryYear === undefined) payload.entryYear = null;

    const xff = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim().slice(0, 64) || "unknown";
    const ipHash = await sha256Hex("nm-membership:ip:" + xff);

    const call = async (act, pl, actor) => {
      try {
        const r = await deps.rpc(act, pl, actor ?? null, ipHash);
        const d = r && !r.error ? r.data : null;
        if (!d || typeof d !== "object" || Array.isArray(d)) return { fail: { code: "server_error", status: 503 } };
        if (typeof d.error === "string") {
          const code = /^[a-z_]{1,40}$/.test(d.error) ? d.error : "request_failed";
          return { fail: { code, status: OK_STATUS.has(d.status) ? d.status : 503 } };
        }
        return { data: d };
      } catch (_) { return { fail: { code: "server_error", status: 503 } }; }
    };
    const failOf = (r) => fail(r.fail.code, r.fail.status, r.fail.status === 429 ? { "Retry-After": "900" } : {});

    try {
      if (spec.auth === "jwt") {
        const m = /^Bearer ([A-Za-z0-9._~+/=-]{20,4096})$/.exec(req.headers.get("authorization") || "");
        if (!m) return fail("unauthorized", 401);
        const user = await deps.getUser(m[1]);
        if (!user || typeof user.id !== "string" || !UUID.test(user.id) || user.emailVerified !== true) return fail("unauthorized", 401);
        const r = await call(action, payload, user.id);
        if (r.fail) return failOf(r);
        if (action === "register_contact") return out({ ok: true });
        const c = r.data.contact && typeof r.data.contact === "object" ? r.data.contact : {};
        const contact = {
          registered: c.registered === true,
          phoneMasked: typeof c.phoneMasked === "string" && /^\d{3}-\*{4}-\d{4}$/.test(c.phoneMasked) ? c.phoneMasked : null,
          smsConsent: c.smsConsent === true,
          privacyVersion: c.privacyVersion === "2026-10-22-v1" ? c.privacyVersion : null,
          consentedAt: typeof c.consentedAt === "string" && Number.isFinite(Date.parse(c.consentedAt)) ? c.consentedAt : null,
        };
        return out({ ...scrub(r.data), contact });
      }

      if (action === "resolve_worksheet") {
        const r = await call(action, payload, null);
        if (r.fail || !r.data.config) return fail("not_found", 404);
        if (Object.hasOwn(r.data.config, "deliveryPlanVersion") || Object.hasOwn(r.data.config, "learningPlan")) {
          const raw = r.data.config, plan = personalPlan(raw.learningPlan);
          if (raw.deliveryPlanVersion !== DELIVERY_PLAN_VERSION || !plan || !isoWeek(raw.week) || raw.k !== 1
              || raw.courseKey !== plan.courseKey || raw.sessionIndex !== plan.sessionIndex || raw.amount !== plan.amount
              || raw.cadence !== plan.cadence || Object.hasOwn(raw, "highPlanVersion")) return fail("not_found", 404);
          return out({ config: { ...pick(raw, ["courseKey", "week", "k", "amount", "cadence", "sessionIndex"]),
            deliveryPlanVersion: DELIVERY_PLAN_VERSION, learningPlan: plan } });
        }
        const config = pick(r.data.config, ["courseKey", "week", "k", "amount", "cadence", "sessionIndex"]);
        // A stored snapshot opts in once; old links keep their original single-session seed.
        const planVersion = HIGH_PLAN_COURSE.test(config.courseKey) ? HIGH_PLAN_VERSION
          : MIDDLE_PLAN_COURSE.test(config.courseKey) ? MIDDLE_PLAN_VERSION
          : CALCULUS_PLAN_COURSE.test(config.courseKey) ? CALCULUS_PLAN_VERSION : null;
        if (planVersion && r.data.config.highPlanVersion === planVersion) {
          config.highPlanVersion = planVersion;
          if (startDate(r.data.config.highStartDate) !== INVALID) config.highStartDate = r.data.config.highStartDate;
          if (SPEEDS.includes(r.data.config.highSpeed)) config.highSpeed = r.data.config.highSpeed;
        }
        return out({ config });
      }

      if (action === "admin_login") {
        const r = await call(action, { username: payload.username, code: payload.code }, null);
        if (r.fail) {
          if (r.fail.code === "invalid_credentials") return fail("invalid_credentials", 401);
          if (r.fail.code === "rate_limited") return fail("rate_limited", 429, { "Retry-After": "900" });
          return fail("server_error", 503);
        }
        if (typeof r.data.token !== "string" || !r.data.token) return fail("server_error", 503);
        return out(pick(r.data, ["token", "expiresAt"]));
      }

      if (action === "admin_send_worksheet") {
        // 1) secret first (nothing is consumed if the key is unavailable) 2) atomic consume 3) one dispatch 4) record result
        let key = "";
        try { key = String((await deps.notifySecret()) || ""); } catch (_) { key = ""; }
        if (!key) return fail("server_not_ready", 503);
        const b = await call("admin_send_begin", payload, null);
        if (b.fail) return failOf(b);
        if (b.data.replay) {
          const rp = normalizeSend(b.data.replay);
          return out({ ...rp, phoneMasked: typeof b.data.replay.phoneMasked === "string" ? b.data.replay.phoneMasked : null });
        }
        const p = b.data.payload;
        if (!p || typeof p.phone !== "string" || typeof p.msg !== "string") return fail("server_error", 503);
        let res;
        try {
          res = normalizeSend(await deps.callWeeklyNotify(key, {
            preview_id: payload.previewId, phone: p.phone, title: String(p.title || ""), msg: p.msg, msg_type: p.msgType === "SMS" ? "SMS" : "LMS",
          }));
        } catch (_) { res = { ok: null, status: "failed" }; }
        await call("admin_send_finish", { adminToken: payload.adminToken, previewId: payload.previewId, status: res.status, ok: res.ok }, null);
        return out({ ...res, phoneMasked: typeof b.data.phoneMasked === "string" ? b.data.phoneMasked : null });
      }

      // remaining admin actions: RPC authenticates the opaque session itself
      const r = await call(action, payload, null);
      if (r.fail) return failOf(r);
      if (action === "admin_preview_worksheet") {
        return out(pick(r.data, ["previewId", "message", "link", "phoneMasked", "messageType", "expiresAt"]));
      }
      if (action === "admin_logout" || action === "admin_revoke" || action === "admin_link") return out({ ok: true });
      return out(scrub(r.data));
    } catch (_) {
      return fail("server_error", 503);
    }
  };
}
