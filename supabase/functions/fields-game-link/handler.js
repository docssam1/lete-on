import { FieldsAccessError, resolveFieldsSession } from "../_shared/fields-admin-access.js";
import { FieldsGameCapabilityError, isFieldsGameActivity, issueFieldsGameCapability, resolveFieldsGameCapability } from "../_shared/fields-game-capability.js";

export const MAX_REQUEST_BYTES = 4096;
const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net", "https://docssam1.github.io",
  ...["127.0.0.1", "localhost"].flatMap(host => [8793, 8794, 8795, 8796, 8797, 8798].map(port => `http://${host}:${port}`)),
]);

class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function secretKey(readEnv) {
  const serviceRole = readEnv("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (serviceRole) return serviceRole;
  const named = readEnv("SUPABASE_SECRET_KEYS") || "";
  if (named) {
    try { return String(JSON.parse(named).default || ""); } catch { /* legacy fallback */ }
  }
  return readEnv("SUPABASE_SECRET_KEY") || "";
}

function responseHeaders(req) {
  const headers = new Headers({
    "Access-Control-Allow-Headers": "content-type, x-fields-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "private, no-store", "Pragma": "no-cache",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin", "X-Content-Type-Options": "nosniff",
  });
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) headers.set("Access-Control-Allow-Origin", origin);
  return headers;
}

async function requestBody(req) {
  const declared = req.headers.get("content-length");
  if (declared !== null && (!/^\d+$/u.test(declared) || Number(declared) > MAX_REQUEST_BYTES)) {
    throw new RequestError(413, "request_too_large");
  }
  if ((req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new RequestError(400, "request_invalid");
  }
  // Count streamed bytes, including when content-length is absent or dishonest.
  const reader = req.body?.getReader();
  if (!reader) throw new RequestError(400, "request_invalid");
  const bytes = new Uint8Array(MAX_REQUEST_BYTES);
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (size + value.byteLength > MAX_REQUEST_BYTES) {
        // Do not wait on a potentially attacker-controlled cancellation callback.
        void reader.cancel().catch(() => {});
        throw new RequestError(413, "request_too_large");
      }
      bytes.set(value, size); size += value.byteLength;
    }
  } finally { reader.releaseLock(); }
  try {
    const body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, size)));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new RequestError(400, "request_invalid"); }
}

function exactKeys(body, keys) {
  return Object.keys(body).length === keys.length && keys.every(key => Object.hasOwn(body, key));
}

export function createFieldsGameLinkHandler({ getSecret, getService, now = Date.now }) {
  return async req => {
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: responseHeaders(req) });
    const origin = req.headers.get("origin") || "";
    if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "origin_not_allowed" }, 403);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: responseHeaders(req) });
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    try {
      const body = await requestBody(req);
      if (body.action === "issue") {
        const session = req.headers.get("x-fields-session") || "";
        if (!/^[a-f0-9]{64}$/u.test(session)) return json({ error: "session_required" }, 401);
        if (!exactKeys(body, ["action", "activities"]) || !Array.isArray(body.activities)
          || body.activities.length < 1 || body.activities.length > 7
          || new Set(body.activities).size !== body.activities.length || !body.activities.every(isFieldsGameActivity)) {
          return json({ error: "request_invalid" }, 400);
        }
        const key = getSecret();
        if (!key) return json({ error: "server_not_ready" }, 503);
        const service = getService(key);
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(session));
        const tokenHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
        await resolveFieldsSession(service, tokenHash);
        const issuedAt = now();
        const links = await Promise.all(body.activities.map(activityId => issueFieldsGameCapability(key, activityId, issuedAt)));
        return json({ links });
      }
      if (body.action === "resolve") {
        // No caller-selected book, lesson, activity, identity, or expiry is trusted.
        if (!exactKeys(body, ["action", "token"])) return json({ error: "request_invalid" }, 400);
        const key = getSecret();
        if (!key) return json({ error: "server_not_ready" }, 503);
        return json(await resolveFieldsGameCapability(key, body.token, now()));
      }
      return json({ error: "action_invalid" }, 400);
    } catch (error) {
      if (error instanceof RequestError) return json({ error: error.message }, error.status);
      if (error instanceof FieldsAccessError) {
        return json({ error: error.status === 401 ? "session_invalid" : "service_unavailable" }, error.status === 401 ? 401 : 503);
      }
      if (error instanceof FieldsGameCapabilityError) return json({ error: "capability_invalid" }, 401);
      return json({ error: "service_unavailable" }, 503);
    }
  };
}
