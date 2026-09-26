import assert from "node:assert/strict";
import { ensureFieldsSession, loadProtectedGoldenBellBook } from "./golden-bell-protected.js";

const originalFetch = globalThis.fetch;
const originalStorage = globalThis.sessionStorage;
const values = new Map();
globalThis.sessionStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key)
};
const sessionKey = "gfield_fields_session";
const token = "a".repeat(64);
const json = (status, body) => new Response(JSON.stringify(body), { status });

try {
  for (const status of [402, 403, 429, 500, 503]) {
    values.clear();
    values.set(sessionKey, token);
    globalThis.fetch = async () => json(status, { message: "Service unavailable" });
    await assert.rejects(ensureFieldsSession("QA"), (error) => error.status === status);
    assert.equal(values.get(sessionKey), token, `HTTP ${status} must preserve the session`);
  }
  globalThis.fetch = async () => { throw new TypeError("Network unavailable"); };
  await assert.rejects(ensureFieldsSession("QA"), /Network unavailable/u);
  assert.equal(values.get(sessionKey), token);

  globalThis.fetch = async () => json(401, { error: "session_invalid" });
  await assert.rejects(ensureFieldsSession("QA"), /login_required/u);
  assert.equal(values.has(sessionKey), false);

  values.set(sessionKey, token);
  values.set("gf_c", "TEST-ONLY");
  values.set("gf_n", "QA");
  const actions = [];
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    actions.push(body.action);
    return body.action === "session" ? json(401, { error: "session_invalid" }) : json(200, { token: "b".repeat(64) });
  };
  assert.equal(await ensureFieldsSession("QA"), "b".repeat(64));
  assert.deepEqual(actions, ["session", "login"]);

  globalThis.fetch = async (url) => url.endsWith("fields-auth") ? json(200, { ok: true }) : json(402, {});
  await assert.rejects(loadProtectedGoldenBellBook("book-04", "QA"), (error) => error.status === 402);
  assert.equal(values.get(sessionKey), "b".repeat(64));
  console.log("PROTECTED_SESSION_OK outages=6 expired=1 relogin=1 answerOutage=1");
} finally {
  globalThis.fetch = originalFetch;
  if (originalStorage === undefined) delete globalThis.sessionStorage;
  else globalThis.sessionStorage = originalStorage;
}
