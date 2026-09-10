// Temporary, pinned release transport. No student, Auth, entitlement, or DB APIs.
// release-settings.ts is supplied only in the operator's deployment payload.
import { createClient } from "npm:@supabase/supabase-js@2.112.3";
import { RELEASE } from "./release-settings.ts";

const BUCKET = "hf-challenge-private";
const MAX_BYTES = 6 * 1024 * 1024;
const MAX_LEASE = 6 * 60 * 60 * 1000;
const HEX = /^[a-f0-9]{64}$/;

function pathAllowed(path) {
  return typeof path === "string" && path.length <= 300 &&
    /^[A-Za-z0-9_./-]+\.json$/.test(path) &&
    path.split("/").every(part => part && part !== "." && part !== "..");
}

function settingsValid() {
  return RELEASE && Number.isSafeInteger(RELEASE.issuedAt) && Number.isSafeInteger(RELEASE.expiresAt) &&
    RELEASE.expiresAt > RELEASE.issuedAt && RELEASE.expiresAt - RELEASE.issuedAt <= MAX_LEASE &&
    HEX.test(RELEASE.tokenSha256) && RELEASE.files && typeof RELEASE.files === "object" &&
    !Array.isArray(RELEASE.files) && Object.keys(RELEASE.files).length > 0 &&
    Object.entries(RELEASE.files).every(([path, file]) => pathAllowed(path) && file &&
      HEX.test(file.sha256) && Number.isSafeInteger(file.bytes) && file.bytes > 0 && file.bytes <= MAX_BYTES);
}

function live() {
  const now = Date.now();
  return settingsValid() && RELEASE.issuedAt <= now && now < RELEASE.expiresAt;
}

function response(status, body) {
  return new Response(JSON.stringify(body), { status, headers: {
    "content-type": "application/json; charset=utf-8", "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  } });
}

async function digest(bytes) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}
function hex(bytes) { return Array.from(bytes, n => n.toString(16).padStart(2, "0")).join(""); }
function equalHash(actual, expected) {
  // Both hashes are fixed 32-byte values; never stop at the first differing byte.
  let mismatch = actual.length ^ 32;
  for (let i = 0; i < 32; i++) mismatch |= actual[i] ^ parseInt(expected.slice(i * 2, i * 2 + 2), 16);
  return mismatch === 0;
}

async function readLimited(request, limit) {
  if (!request.body) throw Error("invalid_body");
  const reader = request.body.getReader(), chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw Error("too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}

function serviceKey() {
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    if (typeof keys.default === "string" && keys.default) return keys.default;
  } catch { /* Legacy server environments use a single key. */ }
  return Deno.env.get("SUPABASE_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

async function privateBucket(storage) {
  let bucket = await storage.getBucket(BUCKET);
  if (bucket.error) {
    if (String(bucket.error.statusCode ?? bucket.error.status) !== "404") throw Error("bucket_unavailable");
    if (!live()) throw Error("expired");
    const created = await storage.createBucket(BUCKET, {
      public: false, fileSizeLimit: MAX_BYTES, allowedMimeTypes: ["application/json"]
    });
    // Re-read also handles a concurrent identical create. Never update an existing bucket.
    bucket = await storage.getBucket(BUCKET);
    if (bucket.error || !bucket.data) throw Error(created.error ? "bucket_unavailable" : "bucket_readback_failed");
  }
  if (!bucket.data || bucket.data.public !== false || bucket.data.id !== BUCKET) throw Error("bucket_not_private");
}

async function readback(store, path, expected) {
  const { data, error } = await store.download(path);
  if (error || !data) return "unavailable";
  if (data.size !== expected.bytes || data.size > MAX_BYTES) return "mismatch";
  return equalHash(await digest(await data.arrayBuffer()), expected.sha256) ? "match" : "mismatch";
}

Deno.serve(async request => {
  if (request.method !== "POST") return response(405, { status: "method_not_allowed" });
  if (request.headers.has("origin")) return response(403, { status: "browser_disallowed" });
  if (!live()) return response(404, { status: "unavailable" });
  const match = /^Bearer ([A-Fa-f0-9]{64}|[A-Za-z0-9_-]{43})$/.exec(request.headers.get("authorization") || "");
  if (!match || !equalHash(await digest(new TextEncoder().encode(match[1])), RELEASE.tokenSha256)) {
    return response(401, { status: "unauthorized" });
  }
  const path = request.headers.get("x-release-path") || "";
  if (!pathAllowed(path) || !Object.prototype.hasOwnProperty.call(RELEASE.files, path)) {
    return response(403, { status: "path_disallowed" });
  }
  const expected = RELEASE.files[path];
  const mime = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!["application/json", "application/octet-stream"].includes(mime) || request.headers.has("content-encoding")) {
    return response(415, { status: "content_type_disallowed" });
  }
  const declared = request.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) !== expected.bytes)) {
    return response(Number(declared) > MAX_BYTES ? 413 : 400, { status: "size_mismatch" });
  }
  try {
    const body = await readLimited(request, Math.min(MAX_BYTES, expected.bytes));
    if (body.byteLength !== expected.bytes) return response(400, { status: "size_mismatch" });
    if (!equalHash(await digest(body), expected.sha256)) return response(422, { status: "hash_mismatch" });
    try { JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)); }
    catch { return response(422, { status: "invalid_json" }); }
    if (!live()) return response(404, { status: "unavailable" });
    const url = Deno.env.get("SUPABASE_URL") || "", key = serviceKey();
    if (!url || !key) return response(503, { status: "server_unavailable" });
    const service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    await privateBucket(service.storage);
    if (!live()) return response(404, { status: "unavailable" });
    const store = service.storage.from(BUCKET);
    const uploaded = await store.upload(path, body, { contentType: "application/json", cacheControl: "0", upsert: false });
    const verified = await readback(store, path, expected);
    if (verified !== "match") return response(uploaded.error ? 409 : 502, { status: uploaded.error ? "object_conflict" : "readback_failed" });
    await privateBucket(service.storage);
    if (!live()) return response(404, { status: "unavailable" });
    return response(200, { path, sha256: hex(await digest(body)), bytes: body.byteLength,
      status: uploaded.error ? "already_present" : "uploaded" });
  } catch (error) {
    return response(error?.message === "too_large" ? 413 : 503, {
      status: error?.message === "too_large" ? "too_large" : "operation_failed"
    });
  }
});
