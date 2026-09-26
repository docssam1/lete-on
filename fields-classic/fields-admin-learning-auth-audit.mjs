import assert from "node:assert/strict";
import fs from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import * as access from "../supabase/functions/_shared/fields-admin-access.js";
import { isFieldsGoldenBellBookId } from "../supabase/functions/_shared/fields-golden-bell-book-id.js";

const hash = async value => Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))).toString("hex");
const admin = { user_id: "admin-id", student: "DOCSSAM", role: "admin", active: true };
const user = { id: admin.user_id, app_metadata: { role: "admin", admin_id: "DOCSSAM" } };
const expires = new Date(Date.now() + 3600000).toISOString();
let assertions = 0;

function mockService(results = {}, authUser = user) {
  const calls = [];
  const service = {
    calls,
    auth: {
      getUser: async token => { calls.push(["getUser", token]); return { data: { user: authUser }, error: null }; },
      admin: { signOut: async (token, scope) => { calls.push(["signOut", token, scope]); return { error: null }; } },
    },
    from(table) {
      const record = [table]; calls.push(record);
      const queue = results[table] || [];
      const result = queue.shift() || { data: null, error: null };
      const query = {};
      for (const method of ["select", "eq", "gt", "insert", "delete", "update"]) {
        query[method] = (...args) => { record.push([method, ...args]); return query; };
      }
      query.maybeSingle = async () => result;
      query.then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
      return query;
    },
  };
  return service;
}

async function handler(slug, service, send = async () => { throw new Error("unexpected_network"); }) {
  const source = fs.readFileSync(new URL(`../supabase/functions/${slug}/index.ts`, import.meta.url), "utf8")
    .replace(/^import .*;\r?\n/gm, "");
  let serve;
  const env = { SUPABASE_URL: "https://auth.test", SUPABASE_SERVICE_ROLE_KEY: "server-test-key" };
  new Function("Deno", "createClient", "fetch", ...Object.keys(access), "isFieldsGoldenBellBookId",
    stripTypeScriptTypes(source))(
    { serve(fn) { serve = fn; }, env: { get: key => env[key] } },
    () => service, send, ...Object.values(access), isFieldsGoldenBellBookId,
  );
  return async (body = {}, token = "", origin = "http://127.0.0.1:8794", method = "POST") => {
    const response = await serve(new Request(`https://fields.test/${slug}`, {
      method, headers: { origin, "Content-Type": "application/json", ...(token ? { "x-fields-session": token } : {}) },
      ...(method === "POST" ? { body: JSON.stringify(body) } : {}),
    }));
    return { status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json() };
  };
}

function upstream(status = 200, extra = {}) {
  return async (url, options) => {
    assert.equal(url, "https://auth.test/functions/v1/hs-admin-session");
    assert.equal(JSON.parse(options.body).action, "login");
    assert.ok(!options.headers.Origin && !options.headers.origin);
    return Response.json(status === 200 ? { session: { access_token: "temporary-test-jwt" }, deviceToken: "temporary-test-device", ...extra } : { error: "denied" }, { status });
  };
}

{
  const service = mockService({ hs_accounts: [{ data: admin }] });
  const send = await handler("fields-auth", service, upstream());
  // The shared helper's injected transport exercises the same code as the edge fetch.
  const originalFetch = globalThis.fetch; globalThis.fetch = upstream();
  try {
    const result = await send({ action: "login", name: "docssam", code: "test-code-not-real" });
    assert.equal(result.status, 200);
    assert.equal(result.body.type, "admin");
    assert.equal(result.body.name, "DOCSSAM");
    assert.match(result.body.token, /^[a-f0-9]{64}$/u);
    assert.ok(result.body.permissions.includes("개념완성"));
    assert.ok(!JSON.stringify(result.body).includes("temporary-test"));
    const inserted = service.calls.find(call => call[0] === "fields_access_sessions")[1][1];
    assert.equal(inserted.admin_user_id, admin.user_id);
    assert.ok(!inserted.student_name);
    assert.equal(inserted.token_hash, await hash(result.body.token));
    assert.ok(service.calls.some(call => call[0] === "signOut" && call[2] === "local"));
    assert.ok(service.calls.some(call => call[0] === "hs_admin_devices" && call[1][0] === "delete"));
    assert.ok(!service.calls.some(call => call[0] === "fields_access_accounts"));
    assertions++;
  } finally { globalThis.fetch = originalFetch; }
}

for (const [status, expected] of [[401, 401], [403, 401], [429, 429], [503, 503]]) {
  const service = mockService();
  await assert.rejects(() => access.authenticateFieldsAdmin(service, "https://auth.test", "server-test-key", new Request("https://fields.test"), "docssam", "test-code", upstream(status)), error => error.status === expected);
  assert.equal(service.calls.length, 0);
  assertions++;
}

{
  const service = mockService({ hs_accounts: [{ data: admin }] });
  const send = await handler("fields-auth", service, upstream(200, {
    session: { access_token: "temporary-test-jwt", refresh_token: "temporary-test-refresh", user },
  }));
  const result = await send({ action: "admin-login", name: "docssam", code: "test-code-not-real" });
  assert.equal(result.status, 200);
  assert.equal(result.body.type, "admin");
  assert.equal(result.body.session.refresh_token, "temporary-test-refresh");
  assert.ok(!result.body.token);
  assert.ok(!service.calls.some(call => ["fields_access_sessions", "fields_access_accounts", "signOut"].includes(call[0])));
  assertions++;
}
{
  const service = mockService();
  const result = await (await handler("fields-auth", service))({ action: "admin-login", name: "Student", code: "student-code" });
  assert.equal(result.status, 401);
  assert.equal(service.calls.length, 0);
  assertions++;
}

for (const disabled of [{ ...admin, active: false }, { ...admin, role: "teacher" }, { ...admin, student: "different-name" }]) {
  const service = mockService({ hs_accounts: [{ data: disabled }] });
  await assert.rejects(() => access.authenticateFieldsAdmin(service, "https://auth.test", "server-test-key", new Request("https://fields.test"), "docssam", "test-code", upstream()), error => error.status === 401);
  assert.ok(service.calls.some(call => call[0] === "signOut" && call[2] === "local"));
  assertions++;
}
{
  const service = mockService({}, { ...user, app_metadata: { role: "student", admin_id: "DOCSSAM" } });
  await assert.rejects(() => access.authenticateFieldsAdmin(service, "https://auth.test", "server-test-key", new Request("https://fields.test"), "docssam", "test-code", upstream()), error => error.status === 401);
  assertions++;
}
{
  const account = { student_name: "Test Student", code_hash: await hash("STUDENT-CODE"), permissions: ["개념완성"], student_type: "online", active: true };
  const service = mockService({ fields_access_accounts: [{ data: account }] });
  const send = await handler("fields-auth", service);
  const result = await send({ action: "login", name: "TestStudent", code: "student-code", role: "admin", admin_user_id: "admin-id" });
  assert.equal(result.status, 200);
  assert.equal(result.body.type, "online");
  const inserted = service.calls.find(call => call[0] === "fields_access_sessions")[1][1];
  assert.equal(inserted.student_name, account.student_name);
  assert.ok(!inserted.admin_user_id);
  assertions++;
}
for (const account of [null, { active: false, code_hash: "wrong" }, { active: true, code_hash: "wrong" }]) {
  const service = mockService({ fields_access_accounts: [{ data: account }] });
  const result = await (await handler("fields-auth", service))({ action: "login", name: "Student", code: "bad-code" });
  assert.equal(result.status, 401); assertions++;
}
for (const kind of ["admin", "student", "expired", "disabled", "lookup-failed", "dual-identity"]) {
  const isStudent = kind === "student";
  const session = { student_name: isStudent || kind === "dual-identity" ? "Student" : null, admin_user_id: isStudent ? null : "admin-id", expires_at: expires };
  const results = {
    fields_access_sessions: [{ data: kind === "expired" ? null : session, error: kind === "lookup-failed" ? { code: "offline" } : null }],
    hs_accounts: [{ data: { ...admin, active: kind !== "disabled" } }],
    fields_access_accounts: [{ data: { student_name: "Student", active: true, permissions: ["개념완성"], student_type: "online" } }],
    golden_bell_answer_books: [{ data: { payload: { fixture: true }, payload_sha256: "test" } }],
  };
  for (const slug of ["fields-auth", "golden-bell-answers"]) {
    const service = mockService(structuredClone(results));
    const result = await (await handler(slug, service))({ action: "session", bookId: "book-01" }, "a".repeat(64));
    const expected = kind === "lookup-failed" ? 503 : ["admin", "student"].includes(kind) ? 200 : 401;
    assert.equal(result.status, expected, `${kind} ${slug}`);
    if (expected !== 200) assert.ok(!service.calls.some(call => call[0] === "golden_bell_answer_books"));
    assertions++;
  }
}
{
  const service = mockService(); const send = await handler("fields-auth", service);
  assert.equal((await send({ action: "session" }, "forged-admin")).status, 401);
  assert.equal((await send({}, "", "https://untrusted.invalid")).status, 403);
  for (const port of [8794, 8796]) {
    const result = await send({}, "", `http://127.0.0.1:${port}`, "OPTIONS");
    assert.equal(result.status, 204);
    assert.equal(result.headers.get("Access-Control-Allow-Origin"), `http://127.0.0.1:${port}`);
  }
  const result = await send({ action: "logout" }, "b".repeat(64));
  assert.equal(result.status, 200);
  assert.deepEqual(service.calls[0], ["fields_access_sessions", ["delete"], ["eq", "token_hash", await hash("b".repeat(64))]]);
  assertions++;
}
console.log(`FIELDS_ADMIN_LEARNING_AUTH_OK cases=${assertions}`);
