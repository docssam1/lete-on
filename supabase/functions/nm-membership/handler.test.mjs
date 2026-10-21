// Offline tests for nm-membership handler. Run: node --test supabase/functions/nm-membership/
// Everything is faked: no network, no Supabase, no SMS is ever sent.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHandler } from "./handler.mjs";

const TOKEN = "a".repeat(64);
const UID = "11111111-1111-4111-8111-111111111111";
const OTHER = "33333333-3333-4333-8333-333333333333";
const PID = "22222222-2222-4222-8222-222222222222";
const RAW_PHONE = "01012345678";
const TRIGGER = "trigger-secret-xyz";
const JWT = "eyJhbGciOiJIUzI1NiJ9.payload.signature";

function setup(over = {}) {
  const calls = { rpc: [], weekly: [], getUser: [], secret: 0 };
  const deps = {
    rpc: async (a, p, actor, ip) => { calls.rpc.push({ a, p, actor, ip }); if (over.rpcThrows) throw new Error("SQL boom password=hunter2"); return over.rpc ? over.rpc(a, p, actor, ip) : { data: {} }; },
    getUser: async (jwt) => { calls.getUser.push(jwt); return over.user === undefined ? { id: UID, emailVerified: true } : over.user; },
    notifySecret: async () => { calls.secret++; return over.secret === undefined ? TRIGGER : over.secret; },
    callWeeklyNotify: async (k, m) => { calls.weekly.push({ k, m }); if (over.weeklyThrows) throw new Error("net"); return over.weekly ? over.weekly(k, m) : { ok: null, status: "queued" }; },
    courseLimits: over.courseLimits,
  };
  const handle = createHandler(deps);
  const post = (body, headers = {}, raw) => handle(new Request("https://x.test/functions/v1/nm-membership", {
    method: "POST",
    headers: { "content-type": "application/json", apikey: "anon-key", origin: "https://lete-on.gfieldacademy.net", "x-forwarded-for": "203.0.113.9", ...headers },
    body: raw ?? JSON.stringify(body),
  }));
  return { calls, post, handle };
}
const admin = (extra) => ({ adminToken: TOKEN, ...extra });
const bearer = { authorization: `Bearer ${JWT}` };

// ---------- transport / CORS / body ----------
test("malicious origin rejected before any work; allowed origin echoed; no-store", async () => {
  const t = setup();
  const bad = await t.post({ action: "status" }, { origin: "https://evil.example", ...bearer });
  assert.equal(bad.status, 403);
  assert.equal(bad.headers.get("access-control-allow-origin"), null);
  assert.equal(t.calls.getUser.length + t.calls.rpc.length, 0);
  const ok = await t.post({ action: "resolve_worksheet", token: "b".repeat(32) }, { origin: "https://docssam1.github.io" });
  assert.equal(ok.headers.get("access-control-allow-origin"), "https://docssam1.github.io");
  assert.equal(ok.headers.get("cache-control"), "no-store");
  const pre = await t.handle(new Request("https://x.test/", { method: "OPTIONS", headers: { origin: "http://localhost:8767" } }));
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-origin"), "http://localhost:8767");
});

test("missing apikey, non-POST, oversized, non-JSON, array bodies are rejected without RPC", async () => {
  const t = setup();
  assert.equal((await t.post({ action: "resolve_worksheet", token: "b".repeat(32) }, { apikey: "" })).status, 401);
  assert.equal((await t.handle(new Request("https://x.test/", { method: "GET", headers: { apikey: "k" } }))).status, 405);
  assert.equal((await t.post(null, {}, JSON.stringify({ action: "status", pad: "x".repeat(5000) }))).status, 413);
  assert.equal((await t.post(null, {}, "{not json")).status, 400);
  assert.equal((await t.post(null, {}, "[1]")).status, 400);
  assert.equal((await t.post({ action: "drop_everything" })).status, 400);
  assert.equal((await t.post({ action: "__proto__" })).status, 400);
  assert.equal(t.calls.rpc.length, 0);
});

// ---------- status / JWT / owner spoof ----------
test("status: invalid or unverified JWT is 401 and never reaches RPC", async () => {
  let t = setup({ user: null });
  assert.equal((await t.post({ action: "status" }, bearer)).status, 401);
  assert.equal((await t.post({ action: "status" })).status, 401); // no bearer
  t = setup({ user: { id: UID, emailVerified: false } });
  assert.equal((await t.post({ action: "status" }, bearer)).status, 401);
  assert.equal(t.calls.rpc.length, 0);
});

test("status: actor comes only from verified JWT; spoofed owner/user fields are rejected", async () => {
  const t = setup({ rpc: async () => ({ data: { membership: { userId: UID, canUse: true } } }) });
  for (const spoof of [{ userId: OTHER }, { ownerId: OTHER }, { actor: OTHER }, { p_actor: OTHER }, { user_metadata: { admin: true } }]) {
    assert.equal((await t.post({ action: "status", ...spoof }, bearer)).status, 400);
  }
  assert.equal(t.calls.rpc.length, 0);
  const r = await t.post({ action: "status", profileName: "민수" }, bearer);
  assert.equal(r.status, 200);
  assert.deepEqual(t.calls.rpc[0].p, { profileName: "민수" });
  assert.equal(t.calls.rpc[0].a, "status");
  assert.equal(t.calls.rpc[0].actor, UID);
  assert.deepEqual(t.calls.getUser, [JWT]);
});

test("a JWT alone (even with admin-looking metadata) cannot run admin actions", async () => {
  const t = setup({ user: { id: UID, emailVerified: true, user_metadata: { role: "admin" } } });
  const r = await t.post({ action: "admin_list" }, bearer);
  assert.equal(r.status, 400); // adminToken required
  assert.equal(t.calls.rpc.length, 0);
});

// ---------- admin login / session / errors ----------
test("admin_login: generic invalid response, hashed IP only, no reflected input", async () => {
  const t = setup({ rpc: async () => ({ data: { error: "invalid_credentials", status: 401 } }) });
  const r = await t.post({ action: "admin_login", username: "boss", code: "Sup3rSecret!" });
  assert.equal(r.status, 401);
  const text = await r.text();
  assert.deepEqual(JSON.parse(text), { error: "invalid_credentials" });
  assert.ok(!text.includes("Sup3rSecret") && !text.includes("boss"));
  assert.match(t.calls.rpc[0].ip, /^[0-9a-f]{64}$/);
  assert.ok(!t.calls.rpc[0].ip.includes("203.0.113.9"));
});

test("admin_login: rate limit maps to 429 + Retry-After; success returns only token/expiresAt", async () => {
  let t = setup({ rpc: async () => ({ data: { error: "rate_limited", status: 429 } }) });
  const lim = await t.post({ action: "admin_login", username: "boss", code: "x" });
  assert.equal(lim.status, 429);
  assert.equal(lim.headers.get("retry-after"), "900");
  t = setup({ rpc: async () => ({ data: { token: TOKEN, expiresAt: "2030-01-01T00:00:00.000Z", code_hash: "$2a$leak" } }) });
  const ok = await t.post({ action: "admin_login", username: "boss", code: "x" });
  assert.deepEqual(await ok.json(), { token: TOKEN, expiresAt: "2030-01-01T00:00:00.000Z" });
});

test("fail closed: RPC throw / SQL-ish error never leaks details", async () => {
  let t = setup({ rpcThrows: true });
  let r = await t.post({ action: "admin_login", username: "boss", code: "x" });
  assert.equal(r.status, 503);
  let text = await r.text();
  assert.ok(!text.includes("hunter2") && !text.includes("SQL"));
  t = setup({ rpc: async () => ({ data: null, error: { message: 'relation "nm_private.admin_accounts" does not exist' } }) });
  r = await t.post({ action: "admin_list", ...admin() });
  text = await r.text();
  assert.equal(r.status, 503);
  assert.ok(!text.includes("nm_private"));
  t = setup({ rpc: async () => ({ data: { error: "ERROR: password for 'x' is 123", status: 418 } }) });
  r = await t.post({ action: "admin_list", ...admin() });
  assert.deepEqual(await r.json(), { error: "request_failed" });
});

test("admin commands need a well-formed opaque token; bad session => 401 from RPC", async () => {
  const t = setup({ rpc: async () => ({ data: { error: "unauthorized", status: 401 } }) });
  assert.equal((await t.post({ action: "admin_list", adminToken: "short" })).status, 400);
  assert.equal((await t.post({ action: "admin_list", adminToken: "Z".repeat(64) })).status, 400);
  assert.equal(t.calls.rpc.length, 0);
  assert.equal((await t.post({ action: "admin_list", ...admin() })).status, 401);
});

test("disallowed plans / bad emails / bad learning values are rejected at the edge", async () => {
  const t = setup({ rpc: async () => ({ data: { member: {} } }) });
  for (const plan of ["monthly", "trial", "SIX_MONTH", "", null, 6]) {
    assert.equal((await t.post({ action: "admin_grant", ...admin({ email: "a@b.com", plan }) })).status, 400, String(plan));
  }
  assert.equal((await t.post({ action: "admin_grant", ...admin({ email: "not-an-email", plan: "annual" }) })).status, 400);
  const base = { profileName: "민수", courseKey: "C4", sessionIndex: 3, speed: 1, amount: 1, cadence: "w1", startDate: "2026-10-05" };
  for (const bad of [{ courseKey: "C74" }, { courseKey: "c4" }, { sessionIndex: 0 }, { sessionIndex: 1001 }, { sessionIndex: 1.5 },
    { speed: 2 }, { amount: "1" }, { cadence: "w3" }, { startDate: "2026-02-30" }, { entryYear: 12 }, { owner_id: OTHER }]) {
    assert.equal((await t.post({ action: "admin_set_learning", ...admin({ ...base, ...bad }) })).status, 400, JSON.stringify(bad));
  }
  assert.equal(t.calls.rpc.length, 0);
  const ok = await t.post({ action: "admin_grant", ...admin({ email: " Parent@Example.COM ", plan: "six_month" }) });
  assert.equal(ok.status, 200);
  assert.deepEqual(t.calls.rpc[0].p, { adminToken: TOKEN, email: "parent@example.com", plan: "six_month" });
  const good = await t.post({ action: "admin_set_learning", ...admin(base) });
  assert.equal(good.status, 200);
  assert.equal(t.calls.rpc[1].p.entryYear, null);
});

test("optional static course limits are enforced when injected", async () => {
  const t = setup({ courseLimits: { C4: 5 }, rpc: async () => ({ data: { settings: {} } }) });
  const body = { profileName: "민수", courseKey: "C4", sessionIndex: 6, speed: 1, amount: 1, cadence: "w1", startDate: "2026-10-05" };
  assert.equal((await t.post({ action: "admin_set_learning", ...admin(body) })).status, 400);
  assert.equal((await t.post({ action: "admin_set_learning", ...admin({ ...body, sessionIndex: 5 }) })).status, 200);
});

test("secret-looking keys are scrubbed from pass-through responses", async () => {
  const t = setup({ rpc: async () => ({ data: { members: [{ userId: UID, phone: RAW_PHONE, phoneMasked: "010-****-5678", token_hash: "abc", profiles: [{ name: "민수", password: "p" }] }], unlinkedProfiles: [] } }) });
  const text = await (await t.post({ action: "admin_list", ...admin() })).text();
  assert.ok(!text.includes(RAW_PHONE) && !text.includes("token_hash") && !text.includes('"password"'));
  assert.ok(text.includes("010-****-5678"));
});

// ---------- preview / send ----------
const previewData = { previewId: PID, message: "[numbers of magic] msg https://lete-on.gfieldacademy.net/w/?m=" + "c".repeat(32), link: "https://lete-on.gfieldacademy.net/w/?m=" + "c".repeat(32), phoneMasked: "010-****-5678", messageType: "LMS", expiresAt: "2030-01-01T00:10:00.000Z", phone: RAW_PHONE, token_hash: "zz" };

test("preview never sends and exposes no raw phone", async () => {
  const t = setup({ rpc: async () => ({ data: previewData }) });
  const r = await t.post({ action: "admin_preview_worksheet", ...admin({ profileName: "민수", k: 1 }) });
  const body = await r.json();
  assert.equal(r.status, 200);
  assert.deepEqual(Object.keys(body).sort(), ["expiresAt", "link", "message", "messageType", "phoneMasked", "previewId"]);
  assert.equal(t.calls.weekly.length, 0);
  assert.equal(t.calls.secret, 0);
  assert.equal((await t.post({ action: "admin_preview_worksheet", ...admin({ profileName: "민수", k: 3 }) })).status, 400);
});

function sendRpc(state = {}) {
  state.used = false; state.finish = [];
  return async (a, p) => {
    if (a === "admin_send_begin") {
      if (state.used) return { data: { replay: { ok: null, status: "queued", phoneMasked: "010-****-5678" } } };
      state.used = true;
      return { data: { phoneMasked: "010-****-5678", payload: { phone: RAW_PHONE, title: "10월 2주차 학습지", msg: "[numbers of magic] hi https://lete-on.gfieldacademy.net/w/?m=" + "c".repeat(32), msgType: "LMS" } } };
    }
    if (a === "admin_send_finish") { state.finish.push(p); return { data: { ok: true } }; }
    return { data: {} };
  };
}

test("send: one server-built dispatch, client cannot supply phone/message, nothing sensitive returned", async () => {
  const st = {};
  const t = setup({ rpc: sendRpc(st) });
  for (const extra of [{ phone: "01099999999" }, { message: "buy now" }, { msg: "x" }, { recipients: ["a", "b"] }]) {
    assert.equal((await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID, ...extra }) })).status, 400);
  }
  assert.equal(t.calls.weekly.length, 0);
  const r = await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
  const text = await r.text();
  assert.deepEqual(JSON.parse(text), { ok: null, status: "queued", phoneMasked: "010-****-5678" });
  assert.ok(!text.includes(RAW_PHONE) && !text.includes(TRIGGER) && !text.includes(TOKEN));
  assert.equal(t.calls.weekly.length, 1);
  assert.equal(t.calls.weekly[0].k, TRIGGER);
  assert.deepEqual(Object.keys(t.calls.weekly[0].m).sort(), ["msg", "msg_type", "phone", "preview_id", "title"]);
  assert.equal(t.calls.weekly[0].m.phone, RAW_PHONE);
  assert.equal(t.calls.weekly[0].m.preview_id, PID);
  assert.deepEqual(st.finish[0], { adminToken: TOKEN, previewId: PID, status: "queued", ok: null });
});

test("send is idempotent: repeated and concurrent requests dispatch exactly once", async () => {
  const t = setup({ rpc: sendRpc() });
  const [a, b] = await Promise.all([
    t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) }),
    t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) }),
  ]);
  const c = await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
  for (const r of [a, b, c]) assert.equal(r.status, 200);
  assert.equal(t.calls.weekly.length, 1);
  assert.equal((await c.json()).phoneMasked, "010-****-5678");
});

test("send: missing trigger key stops before consuming; wrong/missing consent or plan blocks dispatch", async () => {
  let t = setup({ secret: "", rpc: sendRpc() });
  assert.equal((await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) })).status, 503);
  assert.equal(t.calls.rpc.length, 0);
  for (const [code, status] of [["consent_required", 409], ["plan_required", 403], ["settings_changed", 409], ["preview_expired", 410], ["contact_changed", 409]]) {
    t = setup({ rpc: async () => ({ data: { error: code, status } }) });
    const r = await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
    assert.equal(r.status, status, code);
    assert.deepEqual(await r.json(), { error: code });
    assert.equal(t.calls.weekly.length, 0, code);
  }
});

test("send: ambiguous upstream result is never retried and reported as ok:null/failed", async () => {
  const st = {};
  let t = setup({ rpc: sendRpc(st), weeklyThrows: true });
  let r = await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
  assert.deepEqual(await r.json(), { ok: null, status: "failed", phoneMasked: "010-****-5678" });
  assert.equal(t.calls.weekly.length, 1);
  await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
  assert.equal(t.calls.weekly.length, 1);
  t = setup({ rpc: sendRpc(), weekly: async () => ({ ok: true, status: "queued" }) }); // inconsistent upstream => ambiguous
  r = await t.post({ action: "admin_send_worksheet", ...admin({ previewId: PID }) });
  assert.deepEqual((await r.json()).status, "failed");
});

// ---------- resolve ----------
test("resolve returns only config fields, hides identity, needs no auth, never consumes", async () => {
  const cfg = { courseKey: "C4", week: "2026-W42", k: 1, amount: 1, cadence: "w1", sessionIndex: 3 };
  const t = setup({ rpc: async () => ({ data: { config: { ...cfg, name: "민수", email: "p@x.com", phone: RAW_PHONE, profileName: "민수", ownerId: UID } } }) });
  const text = await (await t.post({ action: "resolve_worksheet", token: "d".repeat(32) })).text();
  assert.deepEqual(JSON.parse(text), { config: cfg });
  assert.ok(!/민수|p@x\.com|0101234|ownerId/.test(text));
  assert.equal(t.calls.getUser.length, 0);
  await t.post({ action: "resolve_worksheet", token: "d".repeat(32) });
  assert.equal(t.calls.rpc.length, 2);
  assert.ok(t.calls.rpc.every((c) => c.a === "resolve_worksheet"));
});

test("resolve: malformed, unknown, or expired tokens all give the same generic 404", async () => {
  const t = setup({ rpc: async () => ({ data: { error: "not_found", status: 404 } }) });
  const a = await t.post({ action: "resolve_worksheet", token: "nothex" });
  const b = await t.post({ action: "resolve_worksheet", token: "e".repeat(32) });
  assert.equal(a.status, 404); // format rejected locally, same generic answer
  assert.deepEqual(await a.json(), { error: "not_found" });
  assert.equal(b.status, 404);
  assert.deepEqual(await b.json(), { error: "not_found" });
  const t2 = setup({ rpc: async () => ({ data: { weird: true } }) });
  assert.equal((await t2.post({ action: "resolve_worksheet", token: "e".repeat(32) })).status, 404);
});

// ---------- static checks on schema.sql ----------
const sql = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
test("schema.sql: locked-down exposure, no plaintext admin code, no monthly plan", () => {
  assert.match(sql, /revoke all on function public\.nm_membership_rpc\(text, jsonb, uuid, text\) from public, anon, authenticated;/);
  assert.match(sql, /grant execute on function public\.nm_membership_rpc\(text, jsonb, uuid, text\) to service_role;/);
  assert.match(sql, /security definer\s+set search_path = pg_catalog/);
  assert.ok(!/grant [^;]*\bto (anon|authenticated|public)\b/i.test(sql));
  assert.equal((sql.match(/enable row level security/g) || []).length, 8);
  assert.ok(!/monthly/i.test(sql));
  assert.ok(!/^\s*insert into nm_private\.admin_accounts/im.test(sql)); // seeding exists only as a commented instruction
  assert.match(sql, /plan_code in \('six_month', 'annual'\)/);
  assert.match(sql, /on conflict \(key_hash\) do update/);
  assert.match(sql, /v_att > 8/);
  assert.match(sql, /interval '15 minutes'/);
  assert.match(sql, /interval '2 hours'/);
  assert.match(sql, /interval '10 minutes'/);
  assert.match(sql, /interval '14 days'/);
  assert.match(sql, /new\.trial_started_at is distinct from old\.trial_started_at/);
});

// ---------- register_contact / status.contact (all values synthetic) ----------
const SAMPLE = "01000001111";
const SAMPLE2 = "01000002222";
const goodContact = { action: "register_contact", phone: SAMPLE, collectionConsent: true, smsConsent: true };

test("register_contact: verified actor is passed to RPC, exact fields only, response has no phone", async () => {
  const t = setup({ rpc: async () => ({ data: { ok: true, phone: SAMPLE } }) });
  const r = await t.post(goodContact, bearer);
  assert.equal(r.status, 200);
  const text = await r.text();
  assert.deepEqual(JSON.parse(text), { ok: true });
  assert.ok(!text.includes(SAMPLE));
  assert.equal(t.calls.rpc[0].a, "register_contact");
  assert.equal(t.calls.rpc[0].actor, UID);
  assert.deepEqual(t.calls.rpc[0].p, { phone: SAMPLE, collectionConsent: true, smsConsent: true });
  assert.deepEqual(t.calls.getUser, [JWT]);
});

test("register_contact: needs a verified JWT; spoofed owner/actor fields rejected", async () => {
  let t = setup({ user: null });
  assert.equal((await t.post(goodContact, bearer)).status, 401);
  assert.equal((await t.post(goodContact)).status, 401);
  t = setup({ user: { id: UID, emailVerified: false } });
  assert.equal((await t.post(goodContact, bearer)).status, 401);
  t = setup();
  for (const spoof of [{ ownerId: OTHER }, { userId: OTHER }, { owner_id: OTHER }, { actor: OTHER }, { profileName: "민수" }]) {
    assert.equal((await t.post({ ...goodContact, ...spoof }, bearer)).status, 400);
  }
  assert.equal(t.calls.rpc.length, 0);
});

test("register_contact: validation of phone and consents", async () => {
  const t = setup();
  const bad = [
    { phone: "0100000111" + "12" }, { phone: "010000011" }, { phone: "02000001111" }, { phone: "010-0000-1111" },
    { phone: 1000001111 }, { phone: undefined },
    { collectionConsent: false }, { collectionConsent: "true" }, { collectionConsent: undefined },
    { smsConsent: "false" }, { smsConsent: undefined },
  ];
  for (const b of bad) assert.equal((await t.post({ ...goodContact, ...b }, bearer)).status, 400, JSON.stringify(b));
  assert.equal(t.calls.rpc.length, 0);
});

test("register_contact: SMS consent is optional (false accepted); 10-digit phone accepted", async () => {
  const t = setup({ rpc: async () => ({ data: { ok: true } }) });
  const r = await t.post({ ...goodContact, phone: "0100001111", smsConsent: false }, bearer);
  assert.equal(r.status, 200);
  assert.deepEqual(t.calls.rpc[0].p, { phone: "0100001111", collectionConsent: true, smsConsent: false });
});

test("register_contact: same phone is allowed for different verified actors (no uniqueness at the edge)", async () => {
  const users = [UID, OTHER];
  let i = 0;
  const statuses = [];
  for (const id of users) {
    const t2 = setup({ user: { id, emailVerified: true }, rpc: async () => ({ data: { ok: true } }) });
    statuses.push((await t2.post(goodContact, bearer)).status);
    assert.equal(t2.calls.rpc[0].actor, users[i++]);
    assert.equal(t2.calls.rpc[0].p.phone, SAMPLE);
  }
  assert.deepEqual(statuses, [200, 200]);
  const t3 = setup({ rpc: async () => ({ data: { error: "email_already_linked", status: 409 } }) });
  assert.equal((await t3.post(goodContact, bearer)).status, 409);
});

test("status: contact output is normalized/masked and raw phone is never returned", async () => {
  const t = setup({ rpc: async () => ({ data: { membership: { canUse: true }, contact: { registered: true, phoneMasked: "010-****-1111", smsConsent: true, phone: SAMPLE } } }) });
  const text = await (await t.post({ action: "status" }, bearer)).text();
  assert.deepEqual(JSON.parse(text).contact, { registered: true, phoneMasked: "010-****-1111", smsConsent: true });
  assert.ok(!text.includes(SAMPLE));
  const t2 = setup({ rpc: async () => ({ data: { membership: {}, contact: { registered: true, phoneMasked: SAMPLE, smsConsent: "yes" } } }) });
  const b2 = await (await t2.post({ action: "status" }, bearer)).json();
  assert.deepEqual(b2.contact, { registered: true, phoneMasked: null, smsConsent: false }); // unmasked digits are dropped
});

test("schema.sql: one-student-per-email policy, no phone uniqueness, private contacts, valid special syntax", () => {
  assert.match(sql, /create unique index if not exists nm_profiles_one_student_per_owner_idx\s+on public\.nm_profiles \(owner_id\) where owner_id is not null;/);
  assert.match(sql, /'email_already_linked', 'status', 409/);
  assert.match(sql, /exception when unique_violation/);
  assert.match(sql, /create table if not exists nm_private\.guardian_contacts/);
  assert.match(sql, /alter table nm_private\.guardian_contacts\s+enable row level security;/);
  assert.ok(!/unique[^;]*\bphone\b/i.test(sql.replace(/--.*$/gm, "")));
  assert.ok(!/pg_catalog\.extract\s*\(/i.test(sql));
  assert.ok(!/pg_catalog\.position\s*\(/i.test(sql));
  assert.match(sql, /EXTRACT\(isodow from/);
  assert.match(sql, /p_action = 'register_contact'/);
  assert.match(sql, /'entryYear', v_year::integer,\s+'setAt'/);
  assert.match(sql, /'adminPlan', nm_private\.settings_json\(v_name\)/);
  assert.ok(!/'schoolAge',\s*pg_catalog\.extract/.test(sql));
});
