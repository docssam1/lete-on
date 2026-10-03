import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import test from "node:test";
import { FIELDS_GAME_LESSONS, issueFieldsGameCapability } from "../_shared/fields-game-capability.js";
import { MAX_REQUEST_BYTES, createFieldsGameLinkHandler, secretKey } from "./handler.js";

const SECRET = "synthetic-game-test-key-not-a-credential";
const SESSION = "a".repeat(64);
const HASH = createHash("sha256").update(SESSION).digest("hex");
const NOW = Date.parse("2030-10-03T10:20:30.456Z");
const EXPIRES = "2099-10-03T10:20:30.000Z";
const ACTIVITIES = Object.keys(FIELDS_GAME_LESSONS);

function mockService({ kind = "student", sessionError = false, accountError = false, active = true, session = undefined, admin = {} } = {}) {
  const calls = [];
  const rows = {
    fields_access_sessions: session === undefined
      ? { token_hash: HASH, student_name: kind === "student" ? "Synthetic Student" : null, admin_user_id: kind === "admin" ? "synthetic-admin-id" : null, expires_at: EXPIRES }
      : session,
    fields_access_accounts: { student_name: "Synthetic Student", permissions: ["synthetic-permission"], student_type: "online", active },
    hs_accounts: { user_id: "synthetic-admin-id", student: "DOCSSAM", role: "admin", active, ...admin },
  };
  return {
    calls,
    get auth() { throw new Error("No login, impersonation or signOut allowed"); },
    from(table) {
      assert.ok(Object.hasOwn(rows, table), `unexpected table ${table}`);
      const call = [table]; calls.push(call);
      let row = rows[table];
      const query = {
        select(columns) { call.push(["select", columns]); return query; },
        eq(column, value) { call.push(["eq", column, value]); if (row?.[column] !== value) row = null; return query; },
        gt(column, value) { call.push(["gt", column, value]); if (!(row?.[column] > value)) row = null; return query; },
        async maybeSingle() {
          const failed = table === "fields_access_sessions" ? sessionError : accountError;
          return { data: row, error: failed ? { message: `${SECRET}: internal details`, code: "private-db-error" } : null };
        },
      };
      return query;
    },
  };
}

function harness(service = mockService(), options = {}) {
  const handler = createFieldsGameLinkHandler({ getSecret: () => SECRET, getService: () => service, now: () => NOW, ...options });
  return {
    service, handler,
    async send(body, { session = "", origin = "https://lete-on.gfieldacademy.net", method = "POST", headers = {}, raw } = {}) {
      const response = await handler(new Request("https://synthetic.test/fields-game-link", {
        method, headers: { "content-type": "application/json", ...(origin ? { origin } : {}), ...(session ? { "x-fields-session": session } : {}), ...headers },
        ...(method === "POST" ? { body: raw === undefined ? JSON.stringify(body) : raw } : {}),
      }));
      return { status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json() };
    },
  };
}

function privateResponse(result) {
  assert.equal(result.headers.get("cache-control"), "private, no-store");
  assert.equal(result.headers.get("pragma"), "no-cache");
  assert.equal(result.headers.get("vary"), "Origin");
  assert.equal(result.headers.get("x-content-type-options"), "nosniff");
  const text = JSON.stringify(result.body);
  for (const secret of [SECRET, SESSION, HASH, "Synthetic Student", "synthetic-admin-id", "synthetic-permission", "internal details", "private-db-error"]) {
    assert.ok(!text.includes(secret), `response leaked ${secret === SECRET ? "synthetic secret" : "private fixture"}`);
  }
}

for (const kind of ["student", "admin"]) {
  test(`issue verifies existing ${kind} account and returns all seven game-only links`, async () => {
    const api = harness(mockService({ kind }));
    const result = await api.send({ action: "issue", activities: ACTIVITIES }, { session: SESSION });
    assert.equal(result.status, 200); privateResponse(result);
    assert.deepEqual(Object.keys(result.body), ["links"]);
    assert.equal(result.body.links.length, 7);
    assert.equal(api.service.calls.length, 2);
    assert.deepEqual(api.service.calls[0].slice(0, 3), ["fields_access_sessions", ["select", "student_name,admin_user_id,expires_at"], ["eq", "token_hash", HASH]]);
    assert.equal(api.service.calls[0][3][0], "gt");
    assert.equal(api.service.calls[0][3][1], "expires_at");
    assert.equal(api.service.calls[1][0], kind === "admin" ? "hs_accounts" : "fields_access_accounts");
    for (const [i, link] of result.body.links.entries()) {
      assert.deepEqual(Object.keys(link).sort(), ["activityId", "bookId", "expiresAt", "lessonId", "token"]);
      assert.equal(link.activityId, ACTIVITIES[i]); assert.equal(link.bookId, "book-01");
      assert.equal(link.lessonId, FIELDS_GAME_LESSONS[link.activityId]);
      assert.equal(Date.parse(link.expiresAt) - Math.floor(NOW / 1000) * 1000, 31536000000);
      assert.match(link.token, /^fcg1\.[a-z-]+\.\d+\.[A-Za-z0-9_-]{43}$/u);
      assert.ok(Buffer.byteLength(link.token) <= 80);
      assert.equal(Number(link.token.split(".")[2]) * 1000, Date.parse(link.expiresAt));
      assert.ok(!link.token.includes(SESSION)); assert.ok(!link.token.includes("Student"));
    }
    const callCount = api.service.calls.length;
    const { token, ...metadata } = result.body.links[0];
    const resolved = await api.send({ action: "resolve", token }, { origin: "" });
    assert.equal(resolved.status, 200); assert.deepEqual(resolved.body, metadata); privateResponse(resolved);
    assert.equal(api.service.calls.length, callCount, "anonymous resolve does not touch DB/session");
  });
}

test("issue requires a header session, not codes/body tokens/JWT/game token", async () => {
  const api = harness();
  const game = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  for (const session of ["", "forged-admin", "A".repeat(64), "a".repeat(63), "a".repeat(65), "b".repeat(10000), "Bearer synthetic.jwt", game.token]) {
    const result = await api.send({ action: "issue", activities: ["turn-clock"] }, { session });
    assert.equal(result.status, 401); assert.deepEqual(result.body, { error: "session_required" }); privateResponse(result);
  }
  for (const extra of [{ token: SESSION }, { session: SESSION }, { code: "synthetic-code", name: "DOCSSAM" }, { approvalCode: "synthetic-code" }]) {
    assert.equal((await api.send({ action: "issue", activities: ["turn-clock"], ...extra })).status, 401);
  }
  assert.equal(api.service.calls.length, 0);
  assert.equal((await api.send({ action: "issue", activities: ["turn-clock"] }, { session: "b".repeat(64) })).status, 401);
  assert.equal(api.service.calls.length, 1, "well-formed but unknown session is actually checked");
});

for (const [label, options, status] of [
  ["missing", { session: null }, 401],
  ["expired", { session: { token_hash: HASH, student_name: "Synthetic Student", expires_at: "2000-01-01T00:00:00Z" } }, 401],
  ["dual identity", { session: { token_hash: HASH, student_name: "Synthetic Student", admin_user_id: "synthetic-admin-id", expires_at: EXPIRES } }, 401],
  ["no identity", { kind: "unknown" }, 401],
  ["inactive student", { active: false }, 401],
  ["inactive admin", { kind: "admin", active: false }, 401],
  ["wrong admin role", { kind: "admin", admin: { role: "student" } }, 401],
  ["wrong admin name", { kind: "admin", admin: { student: "Other Admin" } }, 401],
  ["session DB error", { sessionError: true }, 503],
  ["student DB error", { accountError: true }, 503],
  ["admin DB error", { kind: "admin", accountError: true }, 503],
]) {
  test(`issue fails closed for ${label}`, async () => {
    const api = harness(mockService(options));
    const result = await api.send({ action: "issue", activities: ["turn-clock"] }, { session: SESSION });
    assert.equal(result.status, status); privateResponse(result);
    assert.deepEqual(result.body, { error: status === 401 ? "session_invalid" : "service_unavailable" });
    assert.ok(!Object.hasOwn(result.body, "links"));
  });
}

test("issue accepts 1..7 unique allowlisted IDs; rejects overrides/identity/expiry", async () => {
  const api = harness();
  const valid = await api.send({ action: "issue", activities: ["fold-twice"] }, { session: SESSION });
  assert.equal(valid.status, 200); assert.equal(valid.body.links.length, 1);
  const count = api.service.calls.length;
  for (const activities of [[], ACTIVITIES.concat("turn-clock"), ["turn-clock", "turn-clock"], ["no-game"], ["constructor"], ["__proto__"], [null], [1], [{}], "turn-clock", null]) {
    assert.equal((await api.send({ action: "issue", activities }, { session: SESSION })).status, 400);
  }
  for (const extra of [{ bookId: "book-02" }, { lessonId: "clock-turning" }, { activityId: "fold-once" }, { admin_user_id: "synthetic-admin-id" }, { role: "admin" }, { name: "DOCSSAM", code: "synthetic-code" }, { expiresAt: EXPIRES }]) {
    assert.equal((await api.send({ action: "issue", activities: ["turn-clock"], ...extra }, { session: SESSION })).status, 400);
  }
  assert.equal(api.service.calls.length, count);
});

test("anonymous resolve never needs service or session; rejects scope overrides", async () => {
  const api = harness(undefined, { getService() { throw new Error("resolve must never query service"); } });
  const link = await issueFieldsGameCapability(SECRET, "cross-sums", NOW);
  for (const session of ["", "invalid-session", SESSION]) {
    const result = await api.send({ action: "resolve", token: link.token }, { session });
    assert.equal(result.status, 200); assert.equal(result.body.activityId, "cross-sums"); privateResponse(result);
  }
  for (const extra of [{ activityId: "turn-clock" }, { activityId: "cross-sums" }, { bookId: "book-02" }, { bookId: "book-01" }, { lessonId: "clock-turning" }, { activities: ["turn-clock"] }]) {
    const result = await api.send({ action: "resolve", token: link.token, ...extra });
    assert.equal(result.status, 400); privateResponse(result);
  }
});

test("resolve rejects malformed, tampered, other-key, and expired capabilities", async () => {
  const api = harness();
  const link = await issueFieldsGameCapability(SECRET, "turn-clock", NOW);
  const wrongKey = await issueFieldsGameCapability("another-synthetic-key", "turn-clock", NOW);
  for (const token of [null, {}, [], 0, "", "fcg1.invalid", SESSION, "x".repeat(97), link.token.replace("fcg1.", "fcg2."), link.token.replace("turn-clock", "mirror-tiles"), link.token.replace(link.token.split(".")[2], String(Number(link.token.split(".")[2]) - 1)), wrongKey.token]) {
    const result = await api.send({ action: "resolve", token });
    assert.equal(result.status, 401); assert.deepEqual(result.body, { error: "capability_invalid" }); privateResponse(result);
  }
  const expired = await harness(undefined, { now: () => Date.parse(link.expiresAt) }).send({ action: "resolve", token: link.token });
  assert.equal(expired.status, 401); privateResponse(expired);
  assert.equal(api.service.calls.length, 0);
});

test("bounded request parsing checks declared and actual streamed byte sizes", async () => {
  const api = harness();
  for (const headers of [{ "content-length": String(MAX_REQUEST_BYTES + 1) }, { "content-length": "invalid" }]) {
    const result = await api.send({ action: "resolve", token: "bad" }, { headers });
    assert.equal(result.status, 413); privateResponse(result);
  }
  for (const headers of [{}, { "content-length": "1" }]) {
    const result = await api.send({}, { raw: " ".repeat(MAX_REQUEST_BYTES + 1), headers });
    assert.equal(result.status, 413); privateResponse(result);
  }
  const body = JSON.stringify({ action: "issue", activities: ["turn-clock"] });
  assert.equal((await api.send({}, { session: SESSION, raw: body.padEnd(MAX_REQUEST_BYTES, " ") })).status, 200);
  assert.equal((await api.send({}, { raw: "\u00e9".repeat(MAX_REQUEST_BYTES / 2 + 1) })).status, 413, "bytes, not JS characters");
  for (const raw of ["", "{", "null", "[]", '"text"', "123", new Uint8Array([0xff])]) {
    const result = await api.send({}, { raw });
    assert.equal(result.status, 400); privateResponse(result);
  }
  assert.equal((await api.send({}, { headers: { "content-type": "text/plain" } })).status, 400);
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(MAX_REQUEST_BYTES)); controller.enqueue(new Uint8Array(1)); },
    cancel() { cancelled = true; },
  });
  const response = await api.handler(new Request("https://synthetic.test", { method: "POST", headers: { "content-type": "application/json" }, body: stream, duplex: "half" }));
  assert.equal(response.status, 413); assert.equal(cancelled, true);
});

test("CORS is exact prod origins plus localhost/127.0.0.1 ports 8793..8798", async () => {
  const api = harness();
  for (const origin of ["https://lete-on.gfieldacademy.net", "https://docssam1.github.io", ...["127.0.0.1", "localhost"].flatMap(host => [8793, 8794, 8795, 8796, 8797, 8798].map(port => `http://${host}:${port}`))]) {
    const result = await api.send({}, { origin, method: "OPTIONS" });
    assert.equal(result.status, 204); assert.equal(result.headers.get("access-control-allow-origin"), origin); privateResponse(result);
    assert.equal(result.headers.get("access-control-allow-headers"), "content-type, x-fields-session");
  }
  for (const origin of ["https://evil.invalid", "http://localhost:8792", "http://127.0.0.1:8799", "https://localhost:8793", "http://localhost.evil.invalid:8793", "null"]) {
    const result = await api.send({}, { origin, method: "OPTIONS" });
    assert.equal(result.status, 403); assert.equal(result.headers.get("access-control-allow-origin"), null); privateResponse(result);
  }
  const get = await api.send({}, { method: "GET" }); assert.equal(get.status, 405); privateResponse(get);
  assert.equal(api.service.calls.length, 0);
});

test("unsupported login/logout/revoke actions do not mutate general sessions", async () => {
  const api = harness();
  for (const action of ["login", "admin-login", "logout", "revoke", "session", "answers", undefined]) {
    const result = await api.send({ action }, { session: SESSION });
    assert.equal(result.status, 400); assert.deepEqual(result.body, { error: "action_invalid" }); privateResponse(result);
  }
  assert.equal(api.service.calls.length, 0);
});

test("missing configuration/unexpected failures are sanitized", async () => {
  for (const action of ["issue", "resolve"]) {
    const result = await harness(undefined, { getSecret: () => "" }).send({ action, ...(action === "issue" ? { activities: ["turn-clock"] } : { token: "bad" }) }, { session: SESSION });
    assert.equal(result.status, 503); assert.deepEqual(result.body, { error: "server_not_ready" }); privateResponse(result);
  }
  for (const options of [
    { getSecret() { throw new Error(SECRET); } },
    { getService() { throw new Error(SECRET); } },
  ]) {
    const result = await harness(undefined, options).send({ action: "issue", activities: ["turn-clock"] }, { session: SESSION });
    assert.equal(result.status, 503); assert.deepEqual(result.body, { error: "service_unavailable" }); privateResponse(result);
  }
});

test("server secret fallback matches existing pattern", () => {
  for (const [env, expected] of [
    [{ SUPABASE_SERVICE_ROLE_KEY: "role", SUPABASE_SECRET_KEYS: '{"default":"named"}', SUPABASE_SECRET_KEY: "legacy" }, "role"],
    [{ SUPABASE_SECRET_KEYS: '{"default":"named"}', SUPABASE_SECRET_KEY: "legacy" }, "named"],
    [{ SUPABASE_SECRET_KEYS: "bad-json", SUPABASE_SECRET_KEY: "legacy" }, "legacy"],
    [{ SUPABASE_SECRET_KEY: "legacy" }, "legacy"], [{}, ""],
  ]) assert.equal(secretKey(key => env[key]), expected);
});

test("actual Deno entrypoint wires tested handler, pinned client, and server-only env", async () => {
  const source = await readFile(new URL("./index.ts", import.meta.url), "utf8");
  assert.match(source, /npm:@supabase\/supabase-js@2\.112\.4/u);
  let handler, clientCalls = 0;
  const service = mockService();
  const env = { SUPABASE_SERVICE_ROLE_KEY: SECRET, SUPABASE_URL: "https://synthetic.test" };
  new Function("Deno", "createClient", "createFieldsGameLinkHandler", "secretKey", stripTypeScriptTypes(source.replace(/^import .*;\r?\n/gmu, "")))(
    { env: { get: key => env[key] }, serve(fn) { handler = fn; } },
    (url, key, options) => {
      clientCalls++;
      assert.equal(url, env.SUPABASE_URL); assert.equal(key, SECRET);
      assert.deepEqual(options, { auth: { persistSession: false, autoRefreshToken: false } });
      return service;
    }, createFieldsGameLinkHandler, secretKey,
  );
  const result = await handler(new Request("https://synthetic.test", { method: "POST", headers: { "content-type": "application/json", "x-fields-session": SESSION }, body: JSON.stringify({ action: "issue", activities: ["turn-clock"] }) }));
  assert.equal(result.status, 200); assert.equal(clientCalls, 1);
  const link = (await result.json()).links[0];
  delete env.SUPABASE_URL;
  const resolved = await handler(new Request("https://synthetic.test", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "resolve", token: link.token }) }));
  assert.equal(resolved.status, 200); assert.equal(clientCalls, 1);
  const noUrl = await handler(new Request("https://synthetic.test", { method: "POST", headers: { "content-type": "application/json", "x-fields-session": SESSION }, body: JSON.stringify({ action: "issue", activities: ["turn-clock"] }) }));
  assert.equal(noUrl.status, 503); assert.equal(clientCalls, 1);
});
